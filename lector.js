/* lector.js — distribución por tema y subrayado para los resúmenes.
 *
 * El visor (index.html) lo inyecta al final de cada resumen, después de su
 * propio script, así que encuentra la página ya armada (índice, progreso,
 * autoevaluaciones, herramientas) y sólo la reacomoda:
 *
 *   - un tema por vez, con migas «Materias › Materia › Tema N» y el buscador;
 *   - la cabecera del tema como tarjeta de color, con los subtemas en tarjetas;
 *   - a la derecha, «En este tema» con el progreso, la lista de temas, las
 *     clases citadas y los subrayados;
 *   - subrayado en cinco colores, guardado en este navegador.
 *
 * No toca el contenido de los resúmenes: los HTML originales siguen igual y
 * el progreso de estudio es el mismo de siempre (los botones ✓ de cada subtema).
 */
(function(){
'use strict';

const raiz = document.documentElement;
if(raiz.classList.contains('lx')) return;
const main = document.getElementById('main');
const wrap = document.querySelector('.wrap');
const chaps = main ? [...main.querySelectorAll('.chap')] : [];
if(!main || !wrap || !chaps.length) return;

const yo = document.currentScript;
const marca = document.querySelector('.brand span:last-child');
const DOC = (yo && yo.dataset.doc) || document.title;
const MATERIA = (yo && yo.dataset.materia)
  || (marca && marca.firstChild ? marca.firstChild.textContent.split('·')[0].trim() : document.title);

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const esc = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const el = (tag, cls, html) => { const e = document.createElement(tag); if(cls) e.className = cls; if(html != null) e.innerHTML = html; return e; };

/* un color por materia, el mismo de la cuenta regresiva del visor */
const COLOR = {tc:'#fb7185', redes:'#f5a524', bd2:'#2dd4bf', da1:'#8b7cf6'}[DOC];
if(COLOR) raiz.style.setProperty('--lx-c', COLOR);

const LS = 'lector:' + DOC + ':';
const leer = (k, f) => { try { const v = localStorage.getItem(LS + k); return v === null ? f : JSON.parse(v); } catch(e){ return f; } };
const guardar = (k, v) => { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch(e){} };

const ICONOS = {
  bd2:   '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  redes: '<rect x="9" y="2" width="6" height="6" rx="1.2"/><rect x="2" y="16" width="6" height="6" rx="1.2"/><rect x="16" y="16" width="6" height="6" rx="1.2"/><path d="M5 16v-3h14v3M12 8v5"/>',
  tc:    '<path d="M6.5 20 11.6 9.4"/><path d="M6.5 4h2.4c1 0 1.9.6 2.3 1.5L17.5 20"/>',
  da1:   '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><path d="M7 11v4a2 2 0 0 0 2 2h4M17 13V9a2 2 0 0 0-2-2h-4"/>',
  libro: '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5"/><path d="M20 19v3H6.5"/>'
};
const ico = (d, w) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w || 1.9}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const TILDE = ico('<path d="m5 12 5 5L20 7"/>', 2.8);
const CRUZ = ico('<path d="M6 6l12 12M18 6 6 18"/>', 2.2);
const TACHO = ico('<path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.9 12.2h9.2L17.5 7M10.2 10.5v5.5M13.8 10.5v5.5"/>');
const FLECHA = ico('<path d="m9 6 6 6-6 6"/>', 2);

/* ══════════ datos de cada tema ══════════ */

const numDe = ch => { const m = /^c(\d+)$/.exec(ch.id); return m ? +m[1] : null; };
/* «Tema 3» para los numerados; la radiografía, los obligatorios y la tecnología van por nombre */
const etiqueta = ch => { const n = numDe(ch); return n ? 'Tema ' + n : ch.dataset.title; };
const subsDe = ch => $$('.sub[id]', ch);
const tituloSub = s => { const t = $(':scope>h3>.lx-t', s) || $(':scope>h3', s); return t ? t.textContent.replace(/✓/g, '').trim() : s.id; };
const numSub = s => { const h = $(':scope>h3 .hash', s); return h ? h.textContent.trim() : ''; };

/* lo que queda suelto en un tema (autoevaluaciones, herramientas) va en su propia tarjeta */
chaps.forEach(ch => {
  let grupo = null;
  [...ch.children].forEach(x => {
    if(x.classList.contains('chap-h') || x.classList.contains('sub')){ grupo = null; return; }
    if(!grupo){ grupo = el('div', 'lx-suelto'); ch.insertBefore(grupo, x); }
    grupo.appendChild(x);
  });
});

/* el título de cada subtema en su propio span, para atenuarlo cuando está estudiado */
$$('.sub>h3').forEach(h => {
  const t = el('span', 'lx-t');
  [...h.childNodes].forEach(n => {
    if(n.nodeType === 1 && (n.classList.contains('hash') || n.classList.contains('done'))) return;
    t.appendChild(n);
  });
  const hash = $(':scope>.hash', h);
  h.insertBefore(t, hash ? hash.nextSibling : h.firstChild);
});

/* ══════════ cabecera de cada tema ══════════ */

chaps.forEach(ch => {
  const h = $(':scope>.chap-h', ch);
  if(!h) return;
  const lbl = $(':scope>.lbl', h);
  const n = numDe(ch);
  const ceja = el('div', 'lx-ceja',
    `<span class="lx-ico">${ico(ICONOS[DOC] || ICONOS.libro)}</span>` +
    `<span class="lx-eyebrow">${esc((n ? 'Tema ' + n + ' · ' : '') + MATERIA)}</span>` +
    (lbl && lbl.textContent.trim() ? `<span class="lx-chip">${esc(lbl.textContent.trim())}</span>` : ''));
  h.insertBefore(ceja, h.firstChild);

  const road = $(':scope>.roadmap', h);
  const h2 = $(':scope>h2', h);
  if(road && h2){
    const items = $$('span', road).map(s => s.textContent.trim()).filter(Boolean);
    if(items.length){
      const r = el('div', 'lx-recorrido', '<b>Recorrido del tema</b>' + items.map(esc).join(' · '));
      h2.after(r);
    }
  }

  const subs = subsDe(ch);
  const qz = $$('.qz', ch).length;
  const par = $$('.box.par', ch);
  const clases = new Set($$('a.clase', ch).map(a => a.href)).size;
  const pills = el('div', 'lx-pills');
  if(subs.length) pills.appendChild(el('span', '', subs.length + (subs.length === 1 ? ' subtema' : ' subtemas')));
  if(qz){
    const b = el('button', '', qz + (qz === 1 ? ' pregunta' : ' preguntas'));
    b.type = 'button';
    b.onclick = () => { const q = $('.quiz', ch); if(q) q.scrollIntoView({behavior:'smooth', block:'start'}); };
    pills.appendChild(b);
  }
  if(par.length){
    const b = el('button', '', par.length + ' de parcial');
    b.type = 'button';
    b.title = 'Ir a la primera pregunta que salió en un parcial';
    b.onclick = () => par[0].scrollIntoView({behavior:'smooth', block:'center'});
    pills.appendChild(b);
  }
  if(clases){
    const b = el('button', 'lx-oscuro', '▶ ' + clases + (clases === 1 ? ' clase citada' : ' clases citadas'));
    b.type = 'button';
    b.onclick = () => { const c = $('#lxClases'); if(c) c.scrollIntoView({behavior:'smooth', block:'nearest'}); };
    pills.appendChild(b);
  }
  if(pills.children.length) h.appendChild(pills);
});

/* ══════════ migas + buscador ══════════ */

const migas = el('div', 'lx-migas');
const SEP = `<span class="lx-sep">${ico('<path d="m9 6 6 6-6 6"/>', 2)}</span>`;
migas.innerHTML =
  `<span class="lx-ruta" style="display:flex;flex-wrap:wrap;align-items:center;gap:8px">` +
    `<a href="Semestre 5.html" title="Volver al panel del semestre">Materias</a>${SEP}` +
    `<button type="button" class="lx-mig" id="lxMateria">${esc(MATERIA)}</button>${SEP}` +
    `<span class="lx-aqui" id="lxAqui"></span>` +
  `</span>` +
  `<select class="lx-temas-sel" id="lxSel" aria-label="Ir a otro tema"></select>` +
  `<button type="button" class="lx-buscar" id="lxBuscar">` +
    ico('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>', 2) +
    `<span>Buscar en el resumen…</span><kbd>Ctrl K</kbd></button>`;
wrap.parentNode.insertBefore(migas, wrap);
/* el ícono del buscador va con el tamaño de la letra */
$('#lxBuscar svg').style.cssText = 'width:18px;height:18px;flex-shrink:0';
$$('.lx-sep svg', migas).forEach(s => { s.style.cssText = 'width:14px;height:14px'; });

$('#lxSel').innerHTML = chaps.map(ch => `<option value="${ch.id}">${esc(etiqueta(ch) === ch.dataset.title ? ch.dataset.title : etiqueta(ch) + ' · ' + ch.dataset.title)}</option>`).join('');
$('#lxSel').addEventListener('change', e => mostrarCap(e.target.value));
$('#lxBuscar').addEventListener('click', () => { if(typeof window.openSearch === 'function') window.openSearch(); });
const inicio = chaps.find(c => c.id === 'c0') || chaps[0];
$('#lxMateria').addEventListener('click', () => mostrarCap(inicio.id));
$('#lxMateria').title = 'Ir a ' + inicio.dataset.title;

/* ══════════ columna derecha ══════════ */

const aside = el('aside', 'lx-aside');
const pegado = el('div', 'lx-pegado');
aside.appendChild(pegado);
wrap.appendChild(aside);

const cTema = el('nav', 'lx-card');
cTema.innerHTML =
  `<div class="lx-card-h"><div class="lx-anillo"><svg viewBox="0 0 46 46"><circle cx="23" cy="23" r="20" stroke="#ebebef"/>` +
  `<circle id="lxAnillo" cx="23" cy="23" r="20" stroke="var(--lx-tinta)" stroke-linecap="round" stroke-dasharray="0 125.7"/></svg><span id="lxPct">0%</span></div>` +
  `<div><p>En este tema</p><small id="lxCuenta">0/0 estudiados</small></div></div>` +
  `<ol class="lx-lista" id="lxSubs"></ol>`;
pegado.appendChild(cTema);

const cTemas = el('nav', 'lx-card');
cTemas.innerHTML =
  `<div class="lx-card-h"><div><p>Temas de ${esc(MATERIA)}</p><small id="lxTotal"></small></div></div>` +
  `<ol class="lx-lista" id="lxTemas"></ol>` +
  `<div class="lx-pie"><button type="button" id="lxReset">Reiniciar progreso</button></div>`;
pegado.appendChild(cTemas);
$('#lxReset').addEventListener('click', () => { const b = $('#btnReset'); if(b) b.click(); });

const cClases = el('section', 'lx-card');
cClases.id = 'lxClases';
pegado.appendChild(cClases);

const cHl = el('section', 'lx-card');
pegado.appendChild(cHl);

const ley = $('.leyenda', main);
if(ley){
  const cLey = el('section', 'lx-card', '<div class="lx-card-h"><div><p>Referencias</p><small>qué indica cada color de caja</small></div></div>');
  cLey.appendChild(ley);
  pegado.appendChild(cLey);
}

const nav = el('nav', 'lx-nav');
main.appendChild(nav);

/* ══════════ mostrar un tema ══════════ */

let actual = null;

function mostrarCap(id, op){
  op = op || {};
  const ch = chaps.find(c => c.id === id) || chaps[0];
  const cambio = ch !== actual;
  actual = ch;
  chaps.forEach(c => c.classList.toggle('lx-on', c === ch));

  $('#lxAqui').textContent = etiqueta(ch);
  $('#lxSel').value = ch.id;

  $('#lxSubs').innerHTML = subsDe(ch).map(s =>
    `<li><div class="lx-item" data-sub="${s.id}">` +
    `<button type="button" class="lx-tilde" data-tilde="${s.id}" aria-label="Marcar ${esc(tituloSub(s))} como estudiado">${TILDE}</button>` +
    `<span><span class="lx-n">${esc(numSub(s))}</span> ${esc(tituloSub(s))}</span></div></li>`).join('')
    || '<li class="lx-vacio">Este tema no tiene subtemas.</li>';

  pintarClases(ch);
  pintarNav(ch);
  pintarListaHl();
  progreso();
  if(op.scroll !== false && cambio) window.scrollTo(0, 0);
  if(op.guardar !== false) guardar('cap', ch.id);
  espiar();
}

function pintarClases(ch){
  const vistas = new Map();
  $$('a.clase', ch).forEach(a => { if(!vistas.has(a.href)) vistas.set(a.href, a); });
  const lista = [...vistas.values()];
  const MAX = 12;
  const chip = a => `<a class="clase" href="${esc(a.getAttribute('href'))}" target="_blank" rel="noopener" title="${esc(a.title || '')}">${esc(a.textContent.trim())}</a>`;
  cClases.innerHTML =
    `<div class="lx-card-h"><div><p>Clases citadas</p><small>${lista.length ? lista.length + ' enlaces al minuto exacto' : 'grabaciones de este tema'}</small></div></div>` +
    (lista.length
      ? `<div class="lx-clases">${lista.slice(0, MAX).map(chip).join('')}` +
        (lista.length > MAX ? `<button type="button" class="lx-mas">+${lista.length - MAX} más</button>` : '') + `</div>`
      : '<p class="lx-vacio">Todavía no hay clases citadas en este tema.</p>');
  const mas = $('.lx-mas', cClases);
  if(mas) mas.onclick = () => { mas.insertAdjacentHTML('beforebegin', lista.slice(MAX).map(chip).join('')); mas.remove(); };
}

function pintarNav(ch){
  const i = chaps.indexOf(ch);
  const ant = chaps[i - 1], sig = chaps[i + 1];
  nav.innerHTML =
    (ant ? `<button type="button" class="lx-ant" data-ir="${ant.id}"><small>← Anterior</small><span>${esc(ant.dataset.title)}</span></button>` : '') +
    (sig ? `<button type="button" class="lx-sig" data-ir="${sig.id}"><small>Siguiente →</small><span>${esc(sig.dataset.title)}</span></button>` : '');
}
nav.addEventListener('click', e => { const b = e.target.closest('[data-ir]'); if(b) mostrarCap(b.dataset.ir); });

/* ══════════ progreso: el de siempre, leído de los ✓ de cada subtema ══════════ */

function progreso(){
  if(!actual) return;
  const subs = subsDe(actual);
  const hechos = subs.filter(s => s.classList.contains('studied')).length;
  const pct = subs.length ? Math.round(100 * hechos / subs.length) : 0;
  $('#lxPct').textContent = pct + '%';
  $('#lxCuenta').textContent = hechos + '/' + subs.length + ' estudiados';
  $('#lxAnillo').setAttribute('stroke-dasharray', (pct / 100 * 125.7).toFixed(1) + ' 125.7');
  $$('[data-tilde]', cTema).forEach(b => {
    const s = document.getElementById(b.dataset.tilde);
    b.classList.toggle('on', !!(s && s.classList.contains('studied')));
  });

  let tot = 0, ok = 0;
  $('#lxTemas').innerHTML = chaps.map(ch => {
    const ss = subsDe(ch);
    const d = ss.filter(s => s.classList.contains('studied')).length;
    tot += ss.length; ok += d;
    const n = numDe(ch);
    return `<li><div class="lx-item${ch === actual ? ' act' : ''}" data-cap="${ch.id}">` +
      `<span><span class="lx-n">${n != null ? n : '·'}</span> ${esc(ch.dataset.title)}</span>` +
      `<span class="lx-prog">${ss.length ? d + '/' + ss.length : ''}</span></div></li>`;
  }).join('');
  $('#lxTotal').textContent = (tot ? Math.round(100 * ok / tot) : 0) + '% del resumen estudiado';
}

cTema.addEventListener('click', e => {
  const t = e.target.closest('[data-tilde]');
  if(t){
    const b = $('#' + CSS.escape(t.dataset.tilde) + '>h3 .done');
    if(b) b.click();
    return;
  }
  const it = e.target.closest('[data-sub]');
  if(it) window.goTo(it.dataset.sub);
});
cTemas.addEventListener('click', e => { const it = e.target.closest('[data-cap]'); if(it) mostrarCap(it.dataset.cap); });

/* el progreso cambia por los ✓ del resumen (y por «reiniciar»): se sigue la clase .studied */
const obs = new MutationObserver(() => progreso());
$$('.sub[id]').forEach(s => obs.observe(s, {attributes:true, attributeFilter:['class']}));

/* el subtema que se está leyendo, resaltado en la lista */
let rafEspia = 0;
function espiar(){
  rafEspia = 0;
  if(!actual) return;
  const linea = window.innerHeight * 0.3;
  const subs = subsDe(actual);
  let cur = subs[0] && subs[0].id;
  for(const s of subs) if(s.getBoundingClientRect().top <= linea) cur = s.id;
  $$('[data-sub]', cTema).forEach(i => i.classList.toggle('act', i.dataset.sub === cur));
}
window.addEventListener('scroll', () => { if(!rafEspia) rafEspia = requestAnimationFrame(espiar); }, {passive:true});

/* ══════════ navegación: un ancla a otro tema primero cambia de tema ══════════ */

const goToOriginal = window.goTo;
window.goTo = function(id){
  const t = document.getElementById(id);
  const ch = t && t.closest('.chap');
  if(ch && ch !== actual) mostrarCap(ch.id, {scroll:false});
  if(typeof goToOriginal === 'function') return goToOriginal.apply(this, arguments);
  if(t) t.scrollIntoView({behavior:'smooth', block:'start'});
};

/* los enlaces internos (#s3-2, #c4) pasan por goTo. El visor también los
   intercepta: se corta acá para que no se recorra dos veces. */
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href^="#"]');
  if(!a || !main.contains(a) && !aside.contains(a)) return;
  let id = a.getAttribute('href').slice(1);
  try { id = decodeURIComponent(id); } catch(err){}
  if(!id || !document.getElementById(id)) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  window.goTo(id);
}, true);

/* ══════════════════════════════════════════════════════════════
   SUBRAYADO
   Cada subrayado se ancla a su subtema (.sub con id) con desplazamientos
   sobre el texto. Al cargar se vuelve a pintar envolviendo ese tramo en
   <mark>; si el texto cambió, se busca la cita, y si tampoco está, no se
   pinta pero sigue en la lista para poder borrarlo.
   ══════════════════════════════════════════════════════════════ */

const COLORES = [
  {id:'amarillo', nombre:'Amarillo', fondo:'#fff0a3'},
  {id:'rosa',     nombre:'Rosa',     fondo:'#ffd3e2'},
  {id:'verde',    nombre:'Verde',    fondo:'#d4f1c2'},
  {id:'celeste',  nombre:'Celeste',  fondo:'#cfe6fb'},
  {id:'lila',     nombre:'Lila',     fondo:'#e2d9ff'}
];
const fondoDe = c => (COLORES.find(x => x.id === c) || COLORES[0]).fondo;

/* lo interactivo no se subraya: se vuelve a dibujar solo y movería los desplazamientos */
const FUERA = 'button,input,label,select,textarea,svg,canvas,script,style,.tool,.quiz,.hash,.pl-h,.pl-t,[data-nohl]';

function textos(root){
  const out = [];
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: n => {
      const p = n.parentElement;
      if(!p || p.closest(FUERA)) return NodeFilter.FILTER_REJECT;
      return n.nodeValue ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for(let n = w.nextNode(); n; n = w.nextNode()) out.push(n);
  return out;
}

/* desplazamiento de un punto (nodo, offset) dentro del texto subrayable de root */
function desplazamiento(root, nodo, off){
  const r = document.createRange();
  r.setStart(root, 0);
  r.setEnd(nodo, off);
  let n = 0;
  for(const t of textos(root)){
    if(!r.intersectsNode(t)) continue;
    if(t === r.endContainer){ n += r.endOffset; break; }
    n += t.length;
  }
  return n;
}

function pintar(root, h){
  const ts = textos(root);
  const todo = ts.map(t => t.nodeValue).join('');
  let a = h.start, b = h.end;
  if(todo.slice(a, b) !== h.quote){
    const i = todo.indexOf(h.quote);
    if(i < 0) return false;
    a = i; b = i + h.quote.length;
  }
  let pos = 0;
  for(const t of ts){
    const ini = pos, fin = pos + t.length;
    pos = fin;
    if(fin <= a || ini >= b) continue;
    let nodo = t;
    const desde = Math.max(a, ini) - ini, hasta = Math.min(b, fin) - ini;
    if(hasta < nodo.length) nodo.splitText(hasta);
    if(desde > 0) nodo = nodo.splitText(desde);
    if(!nodo.nodeValue.trim()) continue;   /* saltos de línea entre bloques: sin marca */
    const m = document.createElement('mark');
    m.className = 'lx-hl';
    m.dataset.hl = h.id;
    m.dataset.c = h.color;
    nodo.parentNode.insertBefore(m, nodo);
    m.appendChild(nodo);
  }
  return true;
}

const marcas = id => $$('mark.lx-hl[data-hl="' + id + '"]');
function despintar(id){
  marcas(id).forEach(m => {
    const p = m.parentNode;
    while(m.firstChild) p.insertBefore(m.firstChild, m);
    p.removeChild(m);
    p.normalize();
  });
}
function irAHl(id){
  const h = lista.find(x => x.id === id);
  if(h){ const s = document.getElementById(h.sub); const ch = s && s.closest('.chap'); if(ch && ch !== actual) mostrarCap(ch.id, {scroll:false}); }
  const m = marcas(id)[0];
  if(!m) return;
  m.scrollIntoView({behavior:'smooth', block:'center'});
  marcas(id).forEach(x => x.classList.add('lx-pulso'));
  setTimeout(() => marcas(id).forEach(x => x.classList.remove('lx-pulso')), 1400);
}

let lista = leer('hl', []);
if(!Array.isArray(lista)) lista = [];
const persistir = () => guardar('hl', lista);
const nuevoId = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);

lista.forEach(h => { const r = document.getElementById(h.sub); if(r) pintar(r, h); });

/* ---------- la barra de colores ---------- */
const barra = el('div', 'lx-barra');
barra.setAttribute('role', 'toolbar');
barra.setAttribute('aria-label', 'Subrayar');
barra.hidden = true;
document.body.appendChild(barra);
let estado = null;   /* {nuevo:{sub,start,end,quote}} o {id} */
let yBarra = 0;

function abrirBarra(box, est){
  estado = est;
  yBarra = window.scrollY;
  const h = est.id ? lista.find(x => x.id === est.id) : null;
  barra.innerHTML = COLORES.map(c =>
    `<button type="button" class="lx-col${h && h.color === c.id ? ' on' : ''}" data-col="${c.id}" style="background:${c.fondo}" title="${c.nombre}" aria-label="Subrayar en ${c.nombre.toLowerCase()}"></button>`).join('') +
    (est.id ? `<span class="lx-div"></span><button type="button" class="lx-borrar" data-borrar title="Borrar subrayado" aria-label="Borrar subrayado">${TACHO}</button>` : '');
  barra.hidden = false;
  const ancho = barra.offsetWidth || 200;
  const vw = window.innerWidth;
  const arriba = box.top > 60;
  barra.classList.toggle('abajo', !arriba);
  barra.style.left = Math.min(Math.max(box.left + box.width / 2, ancho / 2 + 8), vw - ancho / 2 - 8) + 'px';
  barra.style.top = (arriba ? box.top - 10 : box.bottom + 10) + 'px';
}
function cerrarBarra(){ barra.hidden = true; estado = null; }

barra.addEventListener('mousedown', e => e.preventDefault());   /* que no se pierda la selección */
barra.addEventListener('click', e => {
  if(!estado) return;
  const col = e.target.closest('[data-col]');
  if(e.target.closest('[data-borrar]') && estado.id){ borrarHl(estado.id); return; }
  if(!col) return;
  const color = col.dataset.col;
  if(estado.nuevo){
    const h = Object.assign({id:nuevoId(), color}, estado.nuevo);
    const r = document.getElementById(h.sub);
    const sel = window.getSelection();
    if(sel) sel.removeAllRanges();
    if(r && pintar(r, h)){ lista.push(h); persistir(); }
  } else if(estado.id){
    const id = estado.id;
    marcas(id).forEach(m => { m.dataset.c = color; });
    lista = lista.map(h => h.id === id ? Object.assign({}, h, {color}) : h);
    persistir();
  }
  cerrarBarra();
  pintarListaHl();
});

function borrarHl(id){
  despintar(id);
  lista = lista.filter(h => h.id !== id);
  persistir();
  cerrarBarra();
  pintarListaHl();
}

/* selección → barra encima */
function alSoltar(e){
  if(e && e.target && e.target.closest && e.target.closest('.lx-barra')) return;
  setTimeout(() => {
    const sel = window.getSelection();
    if(!sel || sel.isCollapsed || !sel.rangeCount) return;
    const r = sel.getRangeAt(0);
    const elDe = n => n.nodeType === 1 ? n : n.parentElement;
    const a0 = elDe(r.startContainer), b0 = elDe(r.endContainer);
    const sec = a0 && a0.closest('.sub[id]');
    if(!sec || sec !== (b0 && b0.closest('.sub[id]')) || !main.contains(sec)) return;
    const a = desplazamiento(sec, r.startContainer, r.startOffset);
    const b = desplazamiento(sec, r.endContainer, r.endOffset);
    const quote = textos(sec).map(t => t.nodeValue).join('').slice(a, b);
    if(b <= a || !quote.trim()) return;
    abrirBarra(r.getBoundingClientRect(), {nuevo:{sub:sec.id, start:a, end:b, quote}});
  }, 10);
}
document.addEventListener('mouseup', alSoltar);
document.addEventListener('touchend', alSoltar);
document.addEventListener('keyup', e => { if(e.shiftKey || e.key === 'Shift') alSoltar(e); });

/* tocar un subrayado → cambiar el color o borrarlo */
document.addEventListener('click', e => {
  const m = e.target.closest && e.target.closest('mark.lx-hl');
  if(!m) return;
  const sel = window.getSelection();
  if(sel && !sel.isCollapsed) return;
  abrirBarra(m.getBoundingClientRect(), {id:m.dataset.hl});
});
document.addEventListener('pointerdown', e => {
  if(barra.hidden) return;
  if(e.target.closest && e.target.closest('.lx-barra, mark.lx-hl')) return;
  cerrarBarra();
});
/* se cierra con un scroll de verdad, no con la inercia que queda al soltar la selección */
window.addEventListener('scroll', () => { if(!barra.hidden && Math.abs(window.scrollY - yBarra) > 40) cerrarBarra(); }, {passive:true});
document.addEventListener('keydown', e => { if(e.key === 'Escape' && !barra.hidden) cerrarBarra(); });

/* ---------- lista de subrayados del tema ---------- */
let seguro = false;
function pintarListaHl(){
  if(!actual) return;
  const delTema = lista.filter(h => { const s = document.getElementById(h.sub); return s && actual.contains(s); });
  const borrar = !delTema.length ? '' : seguro
    ? `<span class="lx-der lx-pie" style="padding:0"><button type="button" data-todos="si" style="color:#c2415b">Borrar todos</button><button type="button" data-todos="no">Cancelar</button></span>`
    : `<span class="lx-der lx-pie" style="padding:0"><button type="button" data-todos="pedir">Borrar todos</button></span>`;
  cHl.innerHTML =
    `<div class="lx-card-h"><div><p>Tus subrayados${delTema.length ? ' <span style="color:var(--lx-muted)">· ' + delTema.length + '</span>' : ''}</p>` +
    `<small>${lista.length ? lista.length + ' en todo el resumen' : 'se guardan en este navegador'}</small></div>${borrar}</div>` +
    (delTema.length
      ? `<ul class="lx-hls">${delTema.map(h =>
          `<li><button type="button" class="lx-ir" data-ir-hl="${h.id}" title="Ir al texto"><span style="background:${fondoDe(h.color)}">${esc(h.quote)}</span></button>` +
          `<button type="button" class="lx-x" data-x-hl="${h.id}" aria-label="Borrar subrayado">${CRUZ}</button></li>`).join('')}</ul>`
      : '') +
    `<p class="lx-ayuda">Seleccioná texto del resumen para subrayarlo. Tocá un subrayado para cambiarle el color o borrarlo.</p>`;
}
cHl.addEventListener('click', e => {
  const ir = e.target.closest('[data-ir-hl]');
  if(ir){ irAHl(ir.dataset.irHl); return; }
  const x = e.target.closest('[data-x-hl]');
  if(x){ borrarHl(x.dataset.xHl); return; }
  const t = e.target.closest('[data-todos]');
  if(!t) return;
  if(t.dataset.todos === 'pedir'){ seguro = true; pintarListaHl(); return; }
  if(t.dataset.todos === 'si'){
    lista.filter(h => { const s = document.getElementById(h.sub); return s && actual.contains(s); })
         .forEach(h => { despintar(h.id); lista = lista.filter(y => y.id !== h.id); });
    persistir();
  }
  seguro = false;
  pintarListaHl();
});

/* ══════════ arranque ══════════ */

raiz.classList.add('lx');
const guardado = leer('cap', null);
mostrarCap(chaps.some(c => c.id === guardado) ? guardado : chaps[0].id, {scroll:false, guardar:false});

})();
