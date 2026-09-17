// Casos de las primitivas `ui-modal*` / `ui-panel*` y de UI.EditModal.
//
// Los modales están cerrados en las capturas de página, así que acá se pintan
// ABIERTOS: se les quita `hidden` y se agrega `flex` cuando el JS de la página
// lo agrega (`classList.remove('hidden')` / `add('flex')`), igual en `before`
// y `after`. Cada uno va en escritorio y en mobile, y los overlays también
// cerrados (el `hidden` de utilidad tiene que ganarle a la primitiva).
//
// `before` sale literal de `git show 75d8386:public/<archivo>` y `after` del
// archivo del working tree: se recorta el elemento completo (por id o por la
// n-ésima aparición de su tag de apertura) en vez de copiarlo a mano, así el
// caso prueba el markup que quedó en la página. Las superficies de página se
// comparan con su tag de apertura real y un contenido fijo igual en los dos
// lados: lo que cambió es el contenedor, y su contenido real depende de datos.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');
const REF = '75d8386';
const refCache = {};
const atRef = (f) => (refCache[f] ??= execFileSync('git', ['show', `${REF}:public/${f}`], { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 }).toString());
const now = (f) => fs.readFileSync(path.join(ROOT, 'public', f), 'utf8');

function locate(src, needle, n) {
  let idx = -1;
  for (let i = 0; i <= n; i++) {
    idx = src.indexOf(needle, idx + 1);
    if (idx === -1) throw new Error(`no encontré ${needle} (#${n})`);
  }
  const start = src.lastIndexOf('<', idx);
  const tag = /^<(\w+)/.exec(src.slice(start))[1];
  return { start, tag };
}

// Elemento completo, balanceando tags del mismo nombre.
function element(src, needle, n = 0) {
  const { start, tag } = locate(src, needle, n);
  const re = new RegExp(`<${tag}[\\s>]|</${tag}>`, 'g');
  re.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = re.exec(src))) {
    depth += m[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return src.slice(start, m.index + m[0].length);
  }
  throw new Error(`sin cierre para ${needle}`);
}

const INNER = '<div class="p-6"><h3 class="text-xl font-bold text-white">Contenido</h3><p class="text-gray-400">Texto de ejemplo del panel</p></div>';
function opening(src, needle, n = 0, inner = INNER) {
  const { start, tag } = locate(src, needle, n);
  return `${src.slice(start, src.indexOf('>', start) + 1)}${inner}</${tag}>`;
}

// Replica lo que hace el JS al abrir: saca `hidden` y, si corresponde, suma `flex`.
function open(markup, addFlex) {
  return markup.replace(/class="([^"]*)"/, (_, cls) => {
    const list = cls.split(/\s+/).filter((c) => c && c !== 'hidden');
    if (addFlex && !list.includes('flex')) list.push('flex');
    return `class="${list.join(' ')}"`;
  });
}

const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };
// `transform` hace que `fixed inset-0` se resuelva contra esta caja y no
// contra la ventana, así la captura de #root no sale vacía.
const stage = (h) => `<div style="position:relative;height:${h}px;overflow:hidden;transform:translateZ(0)">{}</div>`;

const scripts = ['js/ui/modal.js'];
const cases = [];

// ── Overlays ──
// [archivo, id, ¿el JS agrega flex?, hover opcional]
const modals = [
  ['admin.html', 'edit-modal', true],
  ['chat.html', 'create-room-modal', false, '.card-cyber'],
  ['chat.html', 'users-modal', true, '.card-cyber'],
  ['create.html', 'status-overlay', true],
  ['event-tickets.html', 'scanner-modal', false],
  ['event-tickets.html', 'scan-result', false],
  ['event-tickets.html', 'manual-ticket-modal', false],
  ['event-tickets.html', 'send-emails-modal', false],
  ['formularioingreso.html', 'loading-overlay', false],
  ['scan-redeem.html', 'result-modal', false],
  ['ticket-purchase.html', 'status-overlay', true],
  ['ticket-purchase.html', 'free-ticket-modal', true],
  ['ticket-purchase.html', 'login-required-modal', true],
  ['ticket-purchase.html', 'error-modal', true],
  ['js/header.js', 'donation-modal', true, '.card-cyber'],
];

for (const [file, id, addFlex, hover] of modals) {
  const needle = `id="${id}"`;
  const before = element(atRef(file), needle);
  const after = element(now(file), needle);
  const name = `${path.basename(file).replace(/\.(html|js)$/, '')}-${id}`;
  cases.push({ name: `${name}--open`, before: open(before, addFlex), after: open(after, addFlex), wrapper: stage(desktop.height), viewport: desktop });
  cases.push({ name: `${name}--open-mobile`, before: open(before, addFlex), after: open(after, addFlex), wrapper: stage(mobile.height), viewport: mobile });
  cases.push({ name: `${name}--closed`, before, after, wrapper: stage(200), viewport: desktop });
  if (hover) {
    cases.push({ name: `${name}--open-hover`, before: open(before, addFlex), after: open(after, addFlex), wrapper: stage(desktop.height), viewport: desktop, hover });
  }
}

// ── UI.EditModal: las 4 copias contra el componente ──
const EDIT_SCRIPT = '<script>document.currentScript.outerHTML = UI.EditModal();</script>';
for (const file of ['evento.html', 'post.html', 'profile.html', 'recurso.html']) {
  if (!now(file).includes(EDIT_SCRIPT)) throw new Error(`${file} no usa UI.EditModal()`);
  const before = element(atRef(file), 'id="global-edit-modal"');
  const name = `edit-modal-${file.replace('.html', '')}`;
  const openAfter = () => UI.EditModal().toString().replace('class="hidden flex ', 'class="flex ');
  cases.push({ name: `${name}--open`, before: open(before, true), after: openAfter, wrapper: stage(desktop.height), viewport: desktop });
  cases.push({ name: `${name}--open-mobile`, before: open(before, true), after: openAfter, wrapper: stage(mobile.height), viewport: mobile });
  cases.push({ name: `${name}--open-hover`, before: open(before, true), after: openAfter, wrapper: stage(desktop.height), viewport: desktop, hover: '.card-cyber' });
  cases.push({ name: `${name}--closed`, before, after: () => UI.EditModal().toString(), wrapper: stage(200), viewport: desktop });
}
// Con contenido largo, como queda después de que edit-logic.js llena el panel.
{
  const empty = '<div id="edit-modal-content" class="max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide"></div>';
  const filled = empty.replace('></div>', `>${'<p class="text-white py-4">Campo de edición</p>'.repeat(40)}</div>`);
  const before = open(element(atRef('recurso.html'), 'id="global-edit-modal"'), true).replace(empty, filled);
  if (!before.includes(filled)) throw new Error('no pude llenar el modal de edición');
  for (const [suffix, viewport] of [['', desktop], ['-mobile', mobile]]) {
    cases.push({
      name: `edit-modal-filled${suffix}`,
      before,
      after: new Function(`return UI.EditModal().toString().replace('class="hidden flex ', 'class="flex ').replace(${JSON.stringify(empty)}, ${JSON.stringify(filled)});`),
      wrapper: stage(viewport.height),
      viewport,
    });
  }
}

// ── Superficies de página ──
// [nombre, archivo, aguja en 75d8386, aguja actual, n-ésima aparición, wrapper, opciones]
// `nowN` cuando la aparición en el archivo actual es otra: en quienessomos la
// variante `frame` junta tres juegos de clases que antes eran distintos.
const wide = '<div style="width:1100px">{}</div>';
const narrow = '<div>{}</div>';
const center = '<div class="flex justify-center" style="width:1100px">{}</div>';
const grid5 = '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" style="width:1200px">{}</div>';
const chatRow = '<div class="flex gap-4" style="width:1200px;height:420px">{}</div>';
const panels = [
  ...['login', 'register', 'forgot-password', 'reset-password'].map((p) => [
    `auth-${p}`, `${p}.html`, '<div class="w-full max-w-md rounded-2xl p-8 border border-cyan-500/20 card-cyber">', 'ui-panel--auth', 0, center, { hover: '.card-cyber' },
  ]),
  ['detail-evento', 'evento.html', '<div class="rounded-3xl overflow-hidden border border-white/10 card-cyber bg-black/40">', 'ui-panel--detail"', 0, wide, { hover: '.card-cyber' }],
  ['detail-ticket-purchase', 'ticket-purchase.html', '<div class="rounded-3xl overflow-hidden border border-white/10 card-cyber bg-black/40 mb-6">', 'ui-panel--detail"', 0, wide],
  ['detail-ticket-success', 'ticket-success.html', '<div class="rounded-3xl border border-white/10 card-cyber bg-black/40 overflow-hidden">', 'ui-panel--detail"', 0, wide],
  // scan-redeem saca `hidden` al cargar la entrada.
  ['detail-scan-redeem', 'scan-redeem.html', 'id="ticket-card"', 'id="ticket-card"', 0, wide, { show: true }],
  ['detail-padded-recurso', 'recurso.html', '<div class="rounded-3xl overflow-hidden border border-white/10 card-cyber bg-black/40 p-8 md:p-12">', 'ui-panel--detail-padded', 0, wide, { hover: '.card-cyber' }],
  ['detail-form-ticket-purchase', 'ticket-purchase.html', '<div class="rounded-3xl border border-white/10 card-cyber bg-black/40 p-8">', 'ui-panel--detail-form', 0, wide],
  ['admin-users', 'admin.html', '<div class="rounded-2xl border border-cyan-500/20 card-cyber overflow-hidden">', 'ui-panel--accent-cyan', 0, wide, { hover: '.card-cyber' }],
  ['admin-cyan-2', 'admin.html', '<div class="rounded-2xl border border-cyan-500/20 card-cyber overflow-hidden">', 'ui-panel--accent-cyan', 1, wide],
  ['admin-cyan-3', 'admin.html', '<div class="rounded-2xl border border-cyan-500/20 card-cyber overflow-hidden">', 'ui-panel--accent-cyan', 2, wide],
  ['admin-magenta', 'admin.html', '<div class="rounded-2xl border border-magenta-500/20 card-cyber overflow-hidden">', 'ui-panel--accent-magenta', 0, wide, { hover: '.card-cyber' }],
  ['admin-emerald', 'admin.html', '<div class="rounded-2xl border border-emerald-500/20 card-cyber overflow-hidden">', 'ui-panel--accent-emerald', 0, wide],
  ...[0, 1, 2].map((n) => [`stat-soft-admin-${n}`, 'admin.html', '<div class="p-6 rounded-2xl bg-white/5 border border-white/10">', 'ui-panel--stat-soft', n, grid5]),
  ...['admin-tickets', 'event-tickets'].flatMap((p) => [
    ...[0, 4].map((n) => [`stat-${p}-${n}`, `${p}.html`, '<div class="rounded-2xl border border-white/10 bg-black/40 p-6">', 'ui-panel--stat', n, grid5]),
    [`table-${p}`, `${p}.html`, '<div class="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">', 'ui-panel--table', 0, wide],
  ]),
  ...[0, 2].map((n) => [`row-create-${n}`, 'create.html', '<div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">', 'ui-panel--row', n, wide]),
  ['row-crear-oportunidad', 'crear-oportunidad.html', '<div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">', 'ui-panel--row', 0, wide],
  ['chat-rooms', 'chat.html', 'id="rooms-panel"', 'id="rooms-panel"', 0, chatRow, { hover: '.card-cyber' }],
  ['chat-area', 'chat.html', 'id="chat-area"', 'id="chat-area"', 0, chatRow],
  ['frame-quienessomos', 'quienessomos.html', '<div class="card-cyber rounded-2xl p-1">', 'ui-panel--frame', 0, wide, { hover: '.card-cyber' }],
  ['frame-quienessomos-glow', 'quienessomos.html', '<div class="card-cyber rounded-2xl p-1 glow-card">', 'ui-panel--frame', 0, wide, { nowN: 2 }],
  ['frame-quienessomos-group', 'quienessomos.html', '<div class="card-cyber rounded-2xl p-1 group">', 'ui-panel--frame', 0, wide, { nowN: 3 }],
];

for (const [name, file, refNeedle, nowNeedle, n, wrapper, opts = {}] of panels) {
  let before = opening(atRef(file), refNeedle, n);
  let after = opening(now(file), nowNeedle, opts.nowN ?? n);
  if (opts.show) { before = open(before, false); after = open(after, false); }
  cases.push({ name, before, after, wrapper, viewport: desktop });
  cases.push({ name: `${name}--mobile`, before, after, wrapper: narrow, viewport: mobile });
  if (opts.hover) cases.push({ name: `${name}--hover`, before, after, wrapper, viewport: desktop, hover: opts.hover });
}

module.exports = cases.map((c) => ({ scripts, ...c }));
