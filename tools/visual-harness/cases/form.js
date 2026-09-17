// Casos de las primitivas de formulario (ui-label, ui-input, ui-select,
// ui-textarea, ui-hint, ui-checkbox, ui-radio, ui-choice) y de UI.Field.
//
// Los formularios migrados sólo se ven logueados o dentro de modales, así que
// cada caso recorta un bloque de la página: `before` sale literal de
// `git show 75d8386` (antes de la librería) y `after` del working tree, con los
// mismos marcadores. Así no hay copias a mano que puedan desincronizarse.
// Los templates de js/forms.js se ejecutan tal cual estaban en ese commit.
//
// Ojo: al migrar, algunas utilidades dejan de aparecer en el markup y Tailwind
// ya no las genera (p. ej. `outline-none`, que ahora sólo vive dentro de
// `ui-input--dense`). El `before` las sigue usando, así que contra el
// css/tailwind.css del working tree esos casos fallan aunque la página real
// no cambie. Para correrlos hay que apuntar HARNESS_ROOT a una copia de public/
// cuyo tailwind.css se compile sumando al `content` el public/ de 75d8386.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const REF = '75d8386';
const ROOT = path.resolve(__dirname, '../../..');
const scripts = ['js/ui/form.js'];
const wrapper = '<div style="width:900px">{}</div>';

const oldFile = (rel) => execSync(`git show ${REF}:${rel}`, { cwd: ROOT, maxBuffer: 1 << 24 }).toString();
const newFile = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

// Desde la línea que contiene `start` hasta la que contiene `end` (inclusive),
// más `extra` líneas. `from` saltea hasta ese texto antes de buscar.
function slice(text, { from, start, end, extra = 0 }) {
  const lines = text.split('\n');
  let i = 0;
  if (from) while (!lines[i].includes(from)) i++;
  while (!lines[i].includes(start)) i++;
  let j = i;
  while (!lines[j].includes(end)) j++;
  return lines.slice(i, j + 1 + extra).join('\n');
}

// Muchos bloques arrancan ocultos (`hidden` hasta que el JS los abre).
const unhide = (html) => html.replace(/class="([^"]*)"/g, (m, c) => `class="${c.replace(/(^|\s)hidden(?=\s|$)/g, '')}"`);

function pageCase(name, page, range, extra = {}) {
  const rel = `public/${page}.html`;
  return {
    name,
    before: unhide(slice(oldFile(rel), range)),
    after: unhide(slice(newFile(rel), range)),
    ...extra,
  };
}

// Una variante de caso por cada selector a enfocar.
function withFocus(base, selectors) {
  return [base, ...selectors.map((focus) => ({ ...base, name: `${base.name}--focus-${focus.replace(/[^a-z0-9]+/gi, '')}`, focus }))];
}

const pages = [
  ...withFocus(pageCase('admin-search', 'admin', { start: '<div class="mb-6 relative">', end: '</div>' }), ['#admin-search']),
  ...withFocus(pageCase('admin-edit', 'admin', { from: 'id="edit-type"', start: '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">', end: 'id="upload-status"' }), ['#edit-title', '#edit-rec-type', '#edit-visibility', '#edit-description', '#edit-imageUrl']),
  ...withFocus(pageCase('event-tickets-filters', 'event-tickets', { start: 'class="flex flex-col sm:flex-row gap-4 mb-6"', end: '</select>' }), ['#search-input', '#filter-status']),
  ...withFocus(pageCase('event-tickets-manual', 'event-tickets', { start: '<form id="manual-ticket-form"', end: '<div class="pt-4">' }), ['#user-search-input', '#manual-name']),
  ...withFocus(pageCase('admin-tickets-filters', 'admin-tickets', { start: 'class="flex flex-col sm:flex-row gap-4 mb-6"', end: '<!-- Tickets Table -->' }), ['#search-input', '#filter-event']),
  ...withFocus(pageCase('ticket-purchase', 'ticket-purchase', { start: '<div id="buyer-info-section"', end: '<div class="border-t border-white/10 pt-6">' }), ['#buyer-name', '#contribution-amount']),
  ...withFocus(pageCase('login', 'login', { start: '<form id="login-form"', end: '<div id="login-error"' }), ['#login-identifier']),
  pageCase('register', 'register', { start: '<form id="register-form"', end: '<div id="reg-error"' }),
  ...withFocus(pageCase('forgot-password', 'forgot-password', { start: '<form id="forgot-form"', end: 'placeholder="ejemplo@correo.com">', extra: 1 }), ['#forgot-email']),
  pageCase('reset-password', 'reset-password', { start: '<form id="reset-form"', end: 'id="reset-confirm"', extra: 3 }),
  ...withFocus(pageCase('profile-edit', 'profile', { start: '<form id="profile-edit-form"', end: '<div class="pt-6 border-t border-white/10 mt-6">' }), ['#edit-display-name', '#edit-bio']),
  ...withFocus(pageCase('crear-oportunidad-common', 'crear-oportunidad', { start: '<form id="oportunidad-form"', end: '<!-- Campos CONVOCATORIA DE OBRA -->' }), ['#opo-titulo', '#opo-descripcion']),
  ...withFocus(pageCase('crear-oportunidad-convocatoria', 'crear-oportunidad', { start: '<div id="fields-convocatoria_obra"', end: '<!-- Parámetros de presentación -->' }), ['#opo-basesCondiciones', '#opo-lugarExposicion', '#opo-fechaDesde']),
  ...withFocus(pageCase('crear-oportunidad-param', 'crear-oportunidad', { start: '<div class="parametro-row', end: 'class="remove-param-btn' }), ['.param-label', '.param-type', '.param-required']),
  ...withFocus(pageCase('crear-oportunidad-tipos', 'crear-oportunidad', { start: '<!-- Campos OPORTUNIDAD LABORAL -->', end: '<!-- Submit -->' }), ['#opo-nombrePuesto', '#opo-nombreProyecto', '#opo-colaboracionPedida', '#opo-tags', '#opo-visibility']),
  ...withFocus(pageCase('oportunidad-inscripcion', 'oportunidad', { start: '<section id="inscripcion-form"', end: '<div class="flex gap-4">' }), ['#insc-mensaje']),
  ...withFocus(pageCase('oportunidad-laboral', 'oportunidad', { from: "oportunidadData.tipo === 'oportunidad_laboral'", start: '<div>', end: '`;' }), ['input[name="email"]']),
  ...withFocus(pageCase('oportunidad-colaboracion', 'oportunidad', { from: "oportunidadData.tipo === 'colaboracion'", start: '<div>', end: '`;' }), ['textarea']),
  ...withFocus(pageCase('create-visibility-post', 'create', { start: '<select id="post-visibility"', end: '</select>' }), ['select']),
  ...withFocus(pageCase('create-visibility-rec', 'create', { start: '<select id="rec-visibility"', end: '</select>' }), ['select']),
  ...withFocus(pageCase('create-visibility-event', 'create', { start: '<select id="event-visibility"', end: '</select>' }), ['select']),
  pageCase('formularioingreso', 'formularioingreso', { start: '<form id="entry-form"', end: '<!-- Error -->' }),
  pageCase('concurso', 'concurso', { start: '<form id="contest-form"', end: 'id="file-input"' }),
  ...withFocus(pageCase('evento-comment', 'evento', { start: '<textarea id="comment-text"', end: 'class=' }), ['textarea']),
  pageCase('recurso-comment', 'recurso', { start: '<textarea id="comment-text"', end: 'class=' }),
  ...withFocus(pageCase('post-comment', 'post', { start: '<textarea id="comment-text"', end: 'class=' }), ['textarea']),
  ...withFocus(pageCase('chat-create-room', 'chat', { start: '<form id="create-room-form"', end: '<div class="flex gap-3">' }), ['#room-name-input', '#room-desc-input']),
].map((c) => ({ wrapper, scripts, ...c }));

// js/forms.js: el template viejo corre en Node con el código del commit de
// referencia; el nuevo corre en el navegador con UI.Field.
const legacyForms = (() => {
  const ctx = {};
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(`${oldFile('public/js/forms.js')}\nthis.FORM_TEMPLATES = FORM_TEMPLATES;`, ctx);
  return ctx.FORM_TEMPLATES;
})();

const ITEMS = {
  post: { _id: '6a7f7430dc1c465540652090', title: 'Paisaje', tags: ['3d', 'neon'], description: 'Proceso', youtube_video: 'https://www.youtube.com/watch?v=x', visibility: 'unlisted' },
  recurso: { _id: '6a796ddedc1c465540651898', title: 'Brushes', type: 'github', url: 'https://github.com/x', description: 'Pack', tags: ['free'] },
  evento: {
    _id: '69b81ad9c6180e5cfdfbb2a7', title: 'Meetup', location: 'Club X', description: 'Vengan', tags: ['vj'], imageUrl: 'https://x.test/a.png',
    ticketConfig: { enabled: true, price: 1500, maxTickets: 50, paymentLink: 'https://mpago.la/x', mode: 'manual', manualPaymentInfo: 'alias.mp', purchaseMessage: 'Hola', successMessage: 'Gracias', isContribution: true },
  },
};

function formsCase(type, prefix, item) {
  const args = [type, prefix, ...(item ? [item] : [])].map((a) => JSON.stringify(a)).join(', ');
  return {
    name: `forms-${type}-${item ? 'edit' : 'create'}`,
    before: legacyForms[type](prefix, item || undefined),
    // eslint-disable-next-line no-new-func
    after: new Function(`return renderFields(${args});`),
    wrapper: '<div style="width:640px">{}</div>',
    scripts: ['js/ui/form.js', 'js/forms.js'],
  };
}

const forms = [
  formsCase('post', 'post', null),
  ...withFocus(formsCase('post', 'edit', ITEMS.post), ['#edit-title', '#edit-desc', '#edit-youtube', '#edit-file', '#edit-visibility']),
  formsCase('recurso', 'rec', null),
  ...withFocus(formsCase('recurso', 'edit', ITEMS.recurso), ['#edit-title', '#edit-desc', '#edit-file']),
  formsCase('evento', 'event', null),
  ...withFocus(formsCase('evento', 'edit', ITEMS.evento), ['#edit-title', '#edit-ticket-enabled', 'input[value="manual"]', '#edit-ticket-purchase-message']),
];

module.exports = [
  ...pages,
  ...forms,
  {
    name: 'field-escapes-label',
    wrapper,
    scripts,
    before: `<div>
        <label class="block text-xs font-bold text-gray-500 uppercase mb-2">&lt;img src=x onerror=alert(1)&gt;</label>
        <input type="text" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors">
        <p class="text-[10px] text-gray-500 mt-1">&lt;b&gt;ayuda&lt;/b&gt;</p>
      </div>`,
    after: () => UI.Field({
      label: '<img src=x onerror=alert(1)>',
      hint: '<b>ayuda</b>',
      children: UI.html`<input type="text" class="ui-input ui-input--dark ui-input--focus-cyan ui-input--animated">`,
    }).toString(),
  },
];
