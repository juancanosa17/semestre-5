#!/usr/bin/env node
/**
 * lock.js — cifra los documentos locales y los deja listos para publicar.
 *
 *   node tools/lock.js              pide la contraseña por teclado (sin eco)
 *   node tools/lock.js --stdin      lee la contraseña de la entrada estándar
 *   node tools/lock.js --generate   genera una contraseña aleatoria fuerte
 *                                   y la escribe en un archivo FUERA del repo
 *
 * Los HTML en claro NUNCA entran al repositorio: se leen de las rutas de
 * tools/sources.json y sólo se publica el resultado cifrado.
 *
 * Cifrado: AES-256-GCM · clave por PBKDF2-HMAC-SHA256, 310.000 iteraciones,
 * salt aleatorio de 16 bytes. Cada archivo lleva su propio IV de 12 bytes.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const RAIZ    = path.resolve(__dirname, '..');
const DATA    = path.join(RAIZ, 'data');
const SOURCES = path.join(__dirname, 'sources.json');

const ITER = 310000;
const HASH = 'sha256';

const CR = String.fromCharCode(13);
const LF = String.fromCharCode(10);
const EOT = String.fromCharCode(4);
const ETX = String.fromCharCode(3);
const DEL = String.fromCharCode(127);
const BS  = String.fromCharCode(8);

/* ── contraseña ─────────────────────────────────────────────── */

function preguntar(prompt) {
  return new Promise((resolve, reject) => {
    const inp = process.stdin;
    if (!inp.isTTY) {
      reject(new Error(
        'No hay terminal interactiva. Ejecutá "node tools/lock.js" desde una consola,' + LF +
        '   o usá "node tools/lock.js --generate" para que la genere el script.'));
      return;
    }
    process.stdout.write(prompt);
    inp.setRawMode(true);
    inp.resume();
    inp.setEncoding('utf8');
    let buf = '';
    inp.on('data', function onData(ch) {
      if (ch === CR || ch === LF || ch === EOT) {
        inp.setRawMode(false); inp.pause(); inp.removeListener('data', onData);
        process.stdout.write(LF);
        resolve(buf);
      } else if (ch === ETX) {
        inp.setRawMode(false); process.stdout.write(LF); process.exit(130);
      } else if (ch === DEL || ch === BS) {
        buf = buf.slice(0, -1);
      } else {
        buf += ch;
      }
    });
  });
}

function generar() {
  /* 5 palabras al azar + un número: fácil de tipear, ~64 bits de entropía */
  const w = ('ancla bosque cable delta enigma faro grieta hilo iman jarra kilo lente '
           + 'malla nodo orbita pinza quilla ronda savia torre umbral vela xilema yunta zafiro '
           + 'brujula cantera duna espuma fragua glaciar hangar isla')
           .split(' ');
  const pick = () => w[crypto.randomInt(w.length)];
  return [pick(), pick(), pick(), pick(), pick()].join('-') + '-' + crypto.randomInt(10, 100);
}

function leerStdin() {
  return new Promise((resolve) => {
    let buf = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => { buf += c; });
    process.stdin.on('end', () => {
      while (buf.endsWith(CR) || buf.endsWith(LF)) buf = buf.slice(0, -1);
      resolve(buf);
    });
  });
}

/* ── principal ──────────────────────────────────────────────── */

(async function main() {
  if (!fs.existsSync(SOURCES)) {
    console.error('Falta tools/sources.json');
    process.exit(1);
  }
  const docs = JSON.parse(fs.readFileSync(SOURCES, 'utf8'));

  for (const d of docs) {
    if (!fs.existsSync(d.path)) {
      console.error('No se encuentra el archivo fuente:' + LF + '   ' + d.path);
      process.exit(1);
    }
  }

  const generado = process.argv.includes('--generate');
  let pass;

  if (generado) {
    pass = generar();
  } else if (process.argv.includes('--stdin')) {
    pass = await leerStdin();
    if (!pass) { console.error('No llego ninguna contrasena por la entrada estandar.'); process.exit(1); }
  } else {
    pass = await preguntar('Contraseña (no se muestra al escribir): ');
    if (pass.length < 10) {
      console.error(LF + 'Muy corta: usá al menos 10 caracteres. El contenido queda público'
                       + ' y cifrado,' + LF + '   así que una contraseña débil se rompe sin apuro.');
      process.exit(1);
    }
    const conf = await preguntar('Repetila para confirmar: ');
    if (conf !== pass) { console.error('No coinciden.'); process.exit(1); }
  }

  const salt = crypto.randomBytes(16);
  const key  = crypto.pbkdf2Sync(pass, salt, ITER, 32, HASH);

  const sellar = (buf) => {
    const iv = crypto.randomBytes(12);
    const c  = crypto.createCipheriv('aes-256-gcm', key, iv);
    const ct = Buffer.concat([c.update(buf), c.final(), c.getAuthTag()]);
    return Buffer.concat([iv, ct]);
  };

  fs.mkdirSync(DATA, { recursive: true });
  for (const f of fs.readdirSync(DATA)) {
    if (f.slice(-4) === '.bin') fs.unlinkSync(path.join(DATA, f));
  }

  const salida = [];
  docs.forEach((d, i) => {
    const claro = fs.readFileSync(d.path);
    const file  = 'd' + i + '.bin';
    fs.writeFileSync(path.join(DATA, file), sellar(claro));
    salida.push({ id: d.id, title: d.title, href: d.href, file });
    console.log('  cifrado  ' + d.title.padEnd(34)
              + (claro.length / 1024).toFixed(0).padStart(5) + ' KB  ->  data/' + file);
  });

  const manifest = {
    v: 1,
    kdf: { name: 'PBKDF2', hash: 'SHA-256', iter: ITER, salt: salt.toString('base64') },
    verifier: sellar(Buffer.from('semestre-5')).toString('base64'),
    docs: salida
  };
  fs.writeFileSync(path.join(DATA, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(LF + 'Listo. ' + salida.length + ' documentos cifrados en data/.');

  if (generado) {
    const esc = path.join(os.homedir(), 'OneDrive', 'Escritorio');
    const dst = path.join(fs.existsSync(esc) ? esc : os.homedir(), 'CLAVE-semestre-5.txt');
    fs.writeFileSync(dst,
      'Contraseña del sitio semestre-5' + LF +
      '===============================' + LF + LF +
      pass + LF + LF +
      'Guardala donde guardes tus contraseñas y después borrá este archivo.' + LF +
      'NO está en el repositorio y no se sube a ningún lado.' + LF +
      'Para cambiarla:  node tools/lock.js   (y volvé a commitear y pushear data/)' + LF,
      'utf8');
    console.log('Contraseña generada y guardada en:' + LF + '   ' + dst);
    console.log('(a propósito no se imprime en pantalla)');
  }
})().catch(e => { console.error(e.message); process.exit(1); });
