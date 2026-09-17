// Utilidades de los casos de tarjetas y medios (cases/card.js, cases/media.js).
// No es un archivo de casos.
//
// Los casos corren la función de render real de cada página: `before` la de
// 75d8386 (antes de migrar) y `after` la del working tree, que llama a los
// componentes (UI.PostCard, UI.FeedCard…). Así se prueba el template original
// literal, el componente y cómo la página le arma las props (canEdit, tonos…).
// Las funciones de sesión (isLoggedIn, isAdmin, getUserId, isOwner) se
// reemplazan por valores fijos para ver las variantes de dueño y de admin.
//
// Los datos salen del netcache (respuestas reales de la API que usan las
// capturas de página), con algunos items retocados para cubrir ramas que la
// API de producción no tiene (sin imagen, oportunidades, entradas).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../../..');
const BEFORE_REF = process.env.FRAGMENTS_BEFORE_REF || '75d8386';
// El netcache vive junto al compare-fragments.js que se está corriendo.
const NETCACHE = path.join(path.dirname(require.main.filename), 'netcache');
const API = 'https://vps-4455523-x.dattaweb.com/artedigitaldata/api';

function api(route) {
  const key = crypto.createHash('sha1').update(`GET ${API}${route}`).digest('hex');
  return JSON.parse(fs.readFileSync(path.join(NETCACHE, `${key}.body`), 'utf8'));
}

const oldSource = (file) => execFileSync('git', ['show', `${BEFORE_REF}:public/${file}`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const newSource = (file) => fs.readFileSync(path.join(ROOT, 'public', file), 'utf8');

// Recorta `function nombre(...) { ... }` contando llaves. Alcanza para estas
// funciones: sus strings y templates tienen las llaves balanceadas.
function extract(src, name) {
  let start = src.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`no encontré function ${name}`);
  if (src.slice(start - 6, start) === 'async ') start -= 6;
  let i = src.indexOf('{', src.indexOf(')', start));
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) break;
  }
  return src.slice(start, i + 1);
}

const header = newSource('js/header.js');
const HELPERS = [
  extract(header, 'extractYouTubeId'),
  `window.playVideo = ${extract(header, 'playVideo')};`,
  `window.stopVideo = ${extract(header, 'stopVideo')};`,
].join('\n');

// Quita el espacio pegado a etiquetas de apertura y cierre (indentación de los
// templates) y colapsa el resto a un espacio, del mismo modo en los dos lados.
// El comparador mira el texto de cada elemento: sin esto "\n  A\n" y "A"
// cuentan como distintos aunque se vean igual. Las capturas de página
// verifican las tarjetas de galería con el espacio original.
const NORM = `(s) => s.replace(/(<[a-z][^>]*>)\\s+/g, '$1').replace(/\\s+(<\\/[a-z]+>)/g, '$1').replace(/\\s+/g, ' ')`;

const SESSIONS = {
  visitor: { loggedIn: false, admin: null, userId: null, owner: false },
  owner: { loggedIn: true, admin: false, userId: 'viewer-1', owner: true },
  admin: { loggedIn: true, admin: true, userId: 'viewer-1', owner: false },
};

// Arma el `before`/`after` de un caso: la función devuelve el innerHTML que la
// página dejó en su contenedor.
//   file     página o JS de public/
//   fns      funciones a traer del archivo
//   host     id del contenedor que buscan esas funciones
//   setup    código previo (variables globales de la página, stubs de fetch)
//   call     la llamada
function pageRender({ file, fns, host, setup = '', call, session = 'visitor' }, side) {
  const src = side === 'before' ? oldSource(file) : newSource(file);
  const s = SESSIONS[session];
  return `async () => {
    const isLoggedIn = () => ${s.loggedIn};
    const isAdmin = () => ${s.admin};
    const getUserId = () => ${JSON.stringify(s.userId)};
    let isOwner = ${s.owner};
    ${HELPERS}
    const host = document.createElement('div');
    host.id = ${JSON.stringify(host)};
    document.body.appendChild(host);
    ${setup}
    ${fns.map((f) => extract(src, f)).join('\n')}
    try { ${call}; } finally { host.remove(); }
    return (${NORM})(host.innerHTML);
  }`;
}

// compare-fragments sólo evalúa funciones (un string lo toma como HTML) y las
// serializa con toString(): el código tiene que ir entero adentro.
const browserFn = (source) => new Function(`return (${source})();`);

function pageCase({ name, wrapper, scripts, hover, viewport, ...render }) {
  return {
    name,
    wrapper,
    scripts,
    hover,
    viewport,
    before: browserFn(pageRender(render, 'before')),
    after: browserFn(pageRender(render, 'after')),
  };
}

module.exports = { api, pageCase, browserFn, NORM, HELPERS };
