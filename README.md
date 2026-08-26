# semestre-5

Material de estudio propio, publicado **cifrado**.

Este repositorio no contiene ningún documento legible: sólo blobs cifrados con
**AES-256-GCM** y la página que los descifra en el navegador. Sin la contraseña
no hay nada que leer, ni siquiera clonando el repositorio.

## Cómo funciona

```
index.html          la página de acceso y el visor
data/manifest.json  parámetros de derivación (salt, iteraciones) + índice
data/d*.bin         los documentos cifrados: 12 bytes de IV + ciphertext + tag
tools/lock.js       cifra los HTML locales y regenera data/
tools/sources.json  qué archivos cifrar (rutas de la máquina local)
```

- La clave se deriva con **PBKDF2-HMAC-SHA256, 310 000 iteraciones** sobre un
  salt aleatorio de 16 bytes.
- Cada documento se cifra con su propio IV de 12 bytes; GCM aporta la
  autenticación, así que una contraseña incorrecta falla al descifrar en lugar
  de devolver basura.
- La clave derivada se importa con `extractable: false`: vive en memoria y ni
  siquiera el JavaScript de la página puede volver a leer sus bytes.
- La contraseña **no se guarda** en `localStorage`, `sessionStorage`, cookies ni
  en el gestor de contraseñas del navegador, y **no viaja a ningún servidor**:
  todo el descifrado ocurre en el cliente. El campo se vacía apenas se usa.
- La sesión se bloquea sola a los **20 minutos de inactividad** y con el botón
  🔒 Bloquear. Bloquear recarga la página, con lo que el contexto que contenía
  la clave se destruye.
- Una `Content-Security-Policy` restrictiva impide que la página abra conexiones
  a cualquier host que no sea el propio sitio, así que el contenido descifrado
  no puede filtrarse hacia afuera.

## Actualizar el contenido

Los HTML en claro nunca entran acá. Editás los originales donde estén, y después:

```bash
node tools/lock.js
git add data && git commit -m "Actualiza el contenido" && git push
```

`tools/lock.js` pide la contraseña sin mostrarla en pantalla. Para cambiarla,
basta con volver a correrlo con una nueva: se genera un salt nuevo y se
recifra todo.

## Alcance de esta protección

En un hosting estático no existe un login real: no hay servidor que valide
credenciales. Por eso acá no se "esconde" el contenido detrás de una pantalla,
sino que se lo **cifra**. Lo que un tercero puede obtener bajando este repositorio
es el ciphertext, y contra él sólo cabe un ataque de fuerza bruta *offline* —
razón por la cual la contraseña tiene que ser larga. Las 310 000 iteraciones de
PBKDF2 encarecen cada intento.
