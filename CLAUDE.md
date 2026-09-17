# Arte Digital Data — Guía para IA

Red social para artistas digitales. Backend Node/TypeScript + frontend vanilla JS. Español.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js + TypeScript, Express v4 |
| Base de datos | MongoDB + Mongoose |
| Real-time | Socket.io v4 |
| Auth | JWT + SSO externo (FSCAuth) |
| Pagos | MercadoPago SDK |
| Upload | multer + disco local (NO Cloudinary activo) |
| Frontend | HTML + JS vanilla + TailwindCSS v3 (compilado, NO CDN) |
| Deploy | PM2 + Nginx en VPS |
| Dev local | `npx serve public -p 3000` (NO servidor Node) |

---

## Estructura de carpetas

```
artedigitaldata/
├── server.ts              # Punto de entrada (Express + Socket.io)
├── src/
│   ├── models/            # Schemas Mongoose
│   ├── routes/            # API REST
│   ├── middleware/        # auth.ts — JWT, roles
│   └── utils/             # userHydration.ts, mailer.ts
├── public/                # Todo el frontend (servido estático)
│   ├── *.html             # Una página por feature
│   ├── css/style.css      # Estilos compartidos (gradient-text, card-cyber, etc.)
│   ├── css/<pagina>.css   # Estilos propios de una página (manifiesto, artistas…)
│   ├── css/tailwind.css   # Build de Tailwind (generado — no editar a mano)
│   ├── js/                # Lógica frontend
│   └── img/               # Imágenes estáticas (artedigital.png, etc.)
├── deploy_scripts/        # Scripts de deploy a VPS y FTP
└── nginx-deploy.conf      # Config Nginx para producción
```

---

## Modelos principales

| Modelo | Archivo | Campos clave |
|--------|---------|--------------|
| User | `src/models/User.ts` | username, email, role, permissions.artedigital.role, avatar, bio, socials |
| Post | `src/models/Post.ts` | title, description, imageUrl, author (ref User), likes[], comments[] |
| Evento | `src/models/Evento.ts` | title, date, location, creator, ticketConfig, pinned, participants[] |
| Recurso | `src/models/Recurso.ts` | title, type, url, imageUrl, author, likes[], comments[] |
| ChatRoom | `src/models/ChatRoom.ts` | name, participants[], isPrivate |
| Message | `src/models/Message.ts` | room, sender, content |
| Ticket | `src/models/Ticket.ts` | event, code, qrData, paymentStatus, redeemed |
| Notification | `src/models/Notification.ts` | recipient, actor, type, resourceId |

---

## API — rutas principales

Todas bajo `/artedigitaldata/api` en producción y `/api` en local.

```
POST   /auth/register        POST   /auth/login
GET    /auth/me

GET    /posts                POST   /posts
GET    /posts/:id            PATCH  /posts/:id       DELETE /posts/:id
POST   /posts/:id/like       POST   /posts/:id/comment

GET    /recursos             POST   /recursos
GET    /recursos/:id         PATCH  /recursos/:id    DELETE /recursos/:id
POST   /recursos/:id/like    POST   /recursos/:id/comment

GET    /eventos              POST   /eventos
GET    /eventos/:id          PATCH  /eventos/:id     DELETE /eventos/:id
POST   /eventos/:id/like     POST   /eventos/:id/pin POST   /eventos/:id/unpin
GET    /eventos/pinned/list

GET    /profile/:username
PATCH  /profile/me

GET    /upload               POST   /upload

GET    /tickets/my           POST   /tickets
GET    /notifications        PATCH  /notifications/:id/read

| GET    /search?q=...
| GET    /admin/users          PATCH  /admin/users/:id/role
| GET    /admin/autobot/status  POST   /admin/autobot/run
| GET    /public/posts          GET    /public/recursos
| GET    /public/eventos        GET    /public/stats
| GET    /public/contest
| GET    /posts/contest/months
```

---

## Frontend — archivos JS en `public/js/`

| Archivo | Rol |
|---------|-----|
| `config.js` | CONFIG global: API_URL, BASE, escapeHTML(), sanitizeUrl() |
| `auth.js` | Token localStorage, isLoggedIn(), getUser(), apiRequest(), SSO |
| `header.js` | Navbar, menú usuario, renderHeader() |
| `notifications.js` | Campana de notificaciones, Socket.io |
| `tagging.js` | Autocomplete @menciones |
| `forms.js` | Templates HTML de formularios (create/edit) |
| `index.js` | Feed global, filtros por tipo, eventos pinnados |
| `create.js` | Crear posts/recursos/eventos |
| `profile.js` | Perfil de usuario, tabs, edición |
| `chat.js` | Chat en tiempo real (Socket.io) |
| `search.js` | Búsqueda global |
| `admin.js` | Panel admin |
| `evento.js` / `post.js` / `recurso.js` | Detalle de cada tipo de contenido |

---

## Patrones críticos

### Seguridad XSS — SIEMPRE usar en HTML dinámico
```js
escapeHTML(str)   // escapa &<>"' — usar en TODO texto de usuario
sanitizeUrl(url)  // valida protocolo http/https — usar en src= y href=
```

### API requests autenticadas
```js
const res = await apiRequest('/posts', { method: 'POST', body: JSON.stringify(data) });
// apiRequest está en auth.js — añade el token automáticamente y hace logout en 401
```

### URLs limpias — IMPORTANTE para dev local
`npx serve` elimina la extensión `.html` de las URLs y puede perder query strings al redirigir.
**Regla:** nunca usar extensión `.html` en los `href` o `window.location.href`:
```js
// ✅ Correcto
window.location.href = `recurso?id=${item._id}`;
href="profile?user=username"

// ❌ Rompe en local con npx serve
window.location.href = `recurso.html?id=${item._id}`;
```

### CONFIG.BASE — NO usar para links internos
`CONFIG.BASE` devuelve `''` en localhost y `/artedigitaldata` en producción. Para links entre páginas usar rutas relativas simples (sin `CONFIG.BASE`). Solo usar `CONFIG.BASE` cuando sea necesario construir una URL absoluta para el servidor.

### Hidratación de usuarios (backend)
`src/utils/userHydration.ts` resuelve refs de User en lotes antes de devolver respuestas. Posts, Recursos y Eventos pasan por hidratación — `_id` se serializa como string hex de 24 chars.

### Sistema de estilos — Tailwind compilado

Tailwind se compila a `public/css/tailwind.css`. Ya NO se usa el Play CDN
(`cdn.tailwindcss.com`): compilaba el CSS en el navegador en cada visita.

```bash
npm run build:css     # compila una vez
npm run watch:css     # recompila al vuelo mientras desarrollás
```

- **`npm run build` NO compila el CSS** (sigue siendo sólo `tsc`). El VPS corre
  ese script y `tailwindcss` es devDependency: si allá hubiera
  `NODE_ENV=production`, `npm install` la omitiría y el deploy del backend se
  caería. El VPS no necesita compilarlo porque recibe el archivo ya generado
  desde git.
- El archivo generado **se versiona**: el VPS lo toma de git y el deploy por FTP
  sincroniza `public/` tal cual está en local. `run_deploy.bat` lo recompila
  solo y **cancela el deploy si el resultado no está commiteado**, porque si no
  el VPS y el mirror de FTP quedarían con estilos distintos.
- La configuración vive en `tailwind.config.js` y NO tiene `theme.extend`: el
  CDN corría con el tema por defecto y cualquier extensión cambiaría el render.
- El input es `src/styles/tailwind.css` (las tres directivas `@tailwind`).

**El `<link>` de Tailwind va ÚLTIMO en el `<head>`**, después de `css/style.css`
y de cualquier `<style>` en línea. El CDN inyectaba su hoja al final del head,
así que ese es el orden que gana los empates de especificidad. Moverlo antes
cambia el render: por ejemplo `.card-cyber` (en `style.css`) le ganaría a
`bg-[#0d0d12]/60` en las tarjetas del feed.

**Nada de `<style>` en las páginas.** Los estilos propios de una página van en
`public/css/<pagina>.css`, y el `<link>` se pone **entre `style.css` y
`tailwind.css`**, que es donde estaba el `<style>` que reemplazó. Cambiarlo de
lugar altera qué regla gana los empates de especificidad.

Sólo va a `style.css` lo que usen varias páginas. Hoy casi no hay repetición
entre páginas (4 selectores compartidos sobre 105), así que ante la duda:
archivo propio.

Ojo: el scanner de Tailwind lee los archivos como texto plano, sin entender
HTML. Mientras el CSS vivía en `<style>`, cosas como `filter: drop-shadow(...)`
o `resize: vertical` le hacían generar utilidades fantasma (`.drop-shadow`,
`.resize`) que ningún elemento usaba. Al mover ese CSS a archivos `.css` —que
no están en `content`— esas reglas dejaron de generarse.

**Clases armadas por interpolación → `safelist`.** Tailwind escanea el código
como texto plano, así que no puede ver `` `text-${accentColor}-400` ``. Si
agregás una clase dinámica de ese tipo, sumala al `safelist` de
`tailwind.config.js` o no se va a generar.

### Componentes de UI — `docs/componentes.md`

Tipografía, botones, tarjetas, estados y modales salen de la librería:
tokens en `src/styles/tokens.css`, primitivas `ui-*` en
`src/styles/components/`, componentes `UI.X()` en `public/js/ui/`. Todo HTML
armado en JS usa `UI.html` (escapa por defecto). Leer `docs/componentes.md`
antes de crear markup nuevo.

**Ojo:** la tabla "Frontend — archivos JS" de arriba está desactualizada: la
lógica de casi todas las páginas vive en `<script>` inline del HTML, y 17
archivos de `public/js/` no los carga ninguna página (lista en
`docs/componentes.md`).

#### Antes de escribir markup: buscar si ya existe

El catálogo de `docs/componentes.md` lista todo lo que hay (tarjetas, modales,
tabs, campos, botones, títulos, avatares, badges, estados). Si lo que necesitás
está ahí, se usa; si es parecido pero no igual, se le agrega una **variante**
al componente; sólo si no se parece a nada se escribe markup nuevo.

**Nunca** copiar y pegar markup de otra página: eso es exactamente lo que se
vino a eliminar.

#### Cómo se escribe un componente nuevo

Dos niveles, según lo que sea:

| Qué es | Dónde va |
|---|---|
| Un elemento suelto con estilos (botón, input, badge, título) | clase CSS `ui-*` en `src/styles/components/<familia>.css`, con `@apply` dentro de `@layer components` |
| Algo con estructura o que recibe datos (tarjeta, modal, estado) | función `UI.Nombre(props)` en `public/js/ui/<familia>.js`, que devuelve `UI.html` |

Reglas (las largas están en `docs/componentes.md`):

- **Función pura:** recibe props, devuelve markup. Sin `fetch`, sin `getUser()`
  ni `isAdmin()`, sin tocar el DOM. Lo que depende de la sesión entra por props
  (`canEdit`, `isLiked`), que calcula la página.
- **Todo el HTML armado en JS pasa por `UI.html`**, que escapa por defecto.
  `UI.raw()` sólo para HTML ya seguro (p. ej. `formatMentions`).
- **Props con nombre de rol, no de estilo:** `variant: 'gallery'`,
  `size: 'md'`, `accent: 'emerald'`. Nunca `padding: 'py-2'`.
- **Clases completas en mapas**, nunca `text-${color}-400`: el scanner de
  Tailwind lee texto plano y no ve la interpolación.
- **`className` sólo para ubicar** el componente (margen, `col-span-*`,
  ancho). Si hace falta otro color o tipografía, es una variante nueva.
- **Comentario de cabecera** con ejemplos de uso, como en `js/ui/state.js`.
- Si agregás una familia nueva, su `<script>` va en el `<head>` de **todas**
  las páginas y su CSS se registra en `src/styles/components/index.css`.
- Sumá el componente al catálogo de `docs/componentes.md` y un caso en
  `tools/visual-harness/cases/`.

#### Cómo se arma una página nueva

Copiar el esqueleto de `public/obras.html`, que es la referencia:

```html
<head>
  <!-- meta, title -->
  <link rel="stylesheet" href="...font-awesome...">
  <link rel="stylesheet" href="css/style.css">
  <!-- css/<pagina>.css va acá, si la página tiene estilos propios -->
  <link rel="stylesheet" href="css/tailwind.css">   <!-- SIEMPRE último -->
  <script src="js/config.js"></script>
  <script src="js/ui/core.js"></script>
  <!-- ...el resto de js/ui/*.js, igual que en las demás páginas -->
</head>
<body class="min-h-screen">
  <div id="app-header"></div>          <!-- lo llena header.js -->

  <main class="relative z-10 pt-20 pb-10 max-w-7xl mx-auto px-4">
    <section id="page-header" class="mb-10"></section>
    <script>document.getElementById('page-header').innerHTML = UI.PageHeader({
      icon: 'fas fa-palette', title: 'Título', subtitle: 'Bajada.' });</script>

    <div id="lista" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
    <script>document.getElementById('lista').innerHTML =
      UI.LoadingState({ message: 'Cargando...' });</script>
  </main>

  <script src="js/auth.js"></script>
  <script src="js/header.js"></script>
  <script>
    // Sólo datos y composición: nada de markup copiado.
    document.addEventListener('DOMContentLoaded', cargar);
    async function cargar() {
      const cont = document.getElementById('lista');
      try {
        const res = await fetch(CONFIG.API_URL + '/posts');
        const items = await res.json();
        if (!items.length) {
          cont.innerHTML = UI.EmptyState({ icon: 'fas fa-image', message: 'No hay nada todavía' });
          return;
        }
        cont.innerHTML = items.map((p) => UI.PostCard({ post: p, variant: 'gallery' })).join('');
      } catch {
        cont.innerHTML = UI.ErrorState({ message: 'Error cargando' });
      }
    }
  </script>
</body>
```

Lo que tiene que cumplir sí o sí:

1. El `<script>` inline de la página **sólo trae datos y compone componentes**.
   Si te encontrás escribiendo `<div class="rounded-2xl border...">`, falta un
   componente o una variante.
2. Los tres estados (cargando, vacío, error) salen de `js/ui/state.js`.
3. Links relativos y **sin `.html`** (`post?id=…`), por `npx serve`.
4. **Nada de `<style>` en la página:** estilos propios a `css/<pagina>.css`,
   con el `<link>` entre `style.css` y `tailwind.css`.
5. Texto de usuario dentro de `UI.html`; nunca datos de usuario adentro de un
   atributo `on*`.
6. Si la página se agrega a `tools/visual-harness/pages.js`, queda cubierta por
   el harness de ahí en adelante (hay que grabarla una vez con `--record`).
7. `npm run build:css` y commitear `public/css/tailwind.css`.

### Harness visual — cambios que no deben alterar el front

`tools/visual-harness/` compara el render de todas las páginas pixel a pixel
entre dos estados del código. Usarlo en cualquier refactor de CSS o markup que
deba ser visualmente idéntico. Ver `tools/visual-harness/README.md`.

```bash
node tools/visual-harness/capture.js antes --record
# ... hacer el cambio ...
node tools/visual-harness/capture.js despues
node tools/visual-harness/compare.js antes despues
```

### Roles
- `user.role` (global): `USER`, `ADMIN`, `SYSTEM`
- `user.permissions.artedigital.role` (app-specific): `USUARIO`, `ADMINISTRADOR`
- Los checks de admin en frontend usan `isAdmin()` de `auth.js`
- Los checks en backend usan `adminMiddleware` de `src/middleware/auth.ts`

---

## Auth — flujo SSO

1. Usuario sin token → redirige a `CONFIG.FSCAUTH_URL` (servicio externo FSCAuth)
2. FSCAuth devuelve `?token=...&username=...&userId=...` en la URL
3. `auth.js` captura y guarda en localStorage (`artedigitaldata_token`, `artedigitaldata_user`)
4. Todas las requests llevan `Authorization: Bearer {token}`
5. Backend verifica con `JWT_SECRET` del `.env`

---

## Socket.io

```js
// Cliente
const socket = io(CONFIG.SOCKET_URL, { path: CONFIG.SOCKET_PATH });
socket.emit('joinUserRoom', userId);    // notificaciones personales
socket.emit('joinRoom', roomId);        // sala de chat
socket.emit('chatMessage', { roomId, senderId, content });
socket.on('newMessage', (msg) => { });

// Servidor — notificar a un usuario específico
notifyUser(userId, 'newNotification', data);  // emite a room user_{userId}
```

---

## Upload de archivos

- Endpoint: `POST /upload` con `multipart/form-data`, campo `file`
- Guarda en `/img/uploads/{subfolder}/` (subfolders: profiles, recursos, eventos, posts, general)
- Devuelve `{ url: "https://vps.../artedigitaldata/img/uploads/..." }`
- Tamaño máximo: 10 MB
- **Cloudinary está en package.json pero NO se usa** — el upload actual es a disco local

---

## Variables de entorno (`.env`)

```
PORT=2494
MONGODB_URI=...          # DB principal (contenido)
MONGODB_AUTH_URI=...     # DB de usuarios centralizada (opcional)
JWT_SECRET=...
FSC_AUTH_API=...         # URL del servicio de auth externo
MERCADOPAGO_ACCESS_TOKEN=...
# Deploy (opcionales):
VPS_HOST, VPS_PORT, VPS_USER, VPS_PASS
FTP_HOST, FTP_USER, FTP_PASS
GITHUB_TOKEN, GITHUB_REPO
```

---

## Correr el proyecto

### Solo frontend (más rápido, datos del VPS)
```bash
npm run build:css      # sólo si cambiaste clases de Tailwind
npx serve public -p 3000
# Abrir http://localhost:3000
```

### Full stack local
```bash
cp .env.example .env   # completar variables
npm install
npm run dev            # ts-node server.ts con watch
# Abrir http://localhost:2494/artedigitaldata
```

### Deploy a producción
```bash
deploy_scripts/run_deploy.bat
# 1. Sube código al VPS por SSH
# 2. Ejecuta server_update.sh (npm install + tsc + PM2 restart)
# 3. Sincroniza /public al FTP (solo archivos modificados)
```

---

## Convenciones de código

- **Sin comentarios obvios** — solo cuando el POR QUÉ no es claro
- **Sin `.html` en hrefs** — usar clean URLs (ver sección arriba)
- **Todo texto de usuario pasa por escapeHTML()** antes de insertarse en innerHTML
- **Todo src/href externo pasa por sanitizeUrl()** antes de insertarse
- **No usar `innerHTML` con err.message** — puede exponer info interna
- **No hacer console.log de CONFIG.API_URL ni datos de respuesta** en producción
- Interfaces TypeScript con prefijo `I`: `IUser`, `IPost`, `IEvento`
- Errores del servidor: `{ error: "mensaje" }` JSON consistente
- Los modelos no tienen transforms en `toJSON`/`toObject` — `_id` se serializa como string hex

---

## Páginas y sus propósitos

| URL | HTML | Propósito |
|-----|------|-----------|
| `/` | `index.html` | Feed global (posts + recursos + eventos mezclados) |
| `/login` | `login.html` | Redirige a SSO FSCAuth |
| `/register` | `register.html` | Redirige a SSO FSCAuth |
| `/profile?user=X` | `profile.html` | Perfil de usuario, tabs de contenido |
| `/create` | `create.html` | Crear post / recurso / evento |
| `/post?id=X` | `post.html` | Detalle de obra con comentarios |
| `/recurso?id=X` | `recurso.html` | Detalle de recurso con comentarios |
| `/evento?id=X` | `evento.html` | Detalle de evento, compra de entradas |
| `/chat` | `chat.html` | Chat en tiempo real |
| `/search` | `search.html` | Búsqueda global |
| `/admin` | `admin.html` | Panel de administración |
| `/calendario` | `calendario.html` | Calendario de eventos |
