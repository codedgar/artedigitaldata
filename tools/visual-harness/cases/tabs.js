// Casos de tabs y barras de filtros (UI.Tabs, UI.ChoiceCards, UI.HumanAIToggle
// y los helpers UI.setActiveTab / setTabState / setHumanAIToggle).
//
// Cada barra se prueba como secuencia: se pinta el markup, se "clickean" las
// keys de `steps` y se captura. `before` usa el markup literal de 75d8386
// (leído con git show, por rango de líneas) y el código de toggle original
// copiado de la página; `after` usa el componente y el helper. Así se compara
// el estado inicial, el estado tras activar cada ítem, una cadena que pasa por
// todos, y el hover sobre ítems activos e inactivos.
//
// `sequences` y `program` se exportan aparte para reusar las secuencias fuera
// del harness (p. ej. comparar el atributo `class` exacto, que el harness no
// mira: sólo píxeles y estilos computados).
const { execFileSync } = require('child_process');
const path = require('path');

const REF = '75d8386';
const repo = path.resolve(__dirname, '../../..');
const fileCache = {};
function refLines(file, from, to, ref = REF) {
  const key = `${ref}:${file}`;
  if (!fileCache[key]) {
    fileCache[key] = execFileSync('git', ['show', key], { cwd: repo, maxBuffer: 64 * 1024 * 1024 }).toString().split('\n');
  }
  return fileCache[key].slice(from - 1, to).join('\n');
}

// Reglas del <style> de index.html en 75d8386. Los filtros se mudaron a
// tabs.css; `.moon-pill` sigue en la página, así que va en los dos lados, en
// la misma posición (un <style> al final del <head>, después de tailwind.css).
const INDEX_FILTER_RULES = refLines('public/index.html', 26, 69);
const INDEX_MOON_RULES = refLines('public/index.html', 218, 240);

// Link estático "Entradas" que queda en la barra de admin después de los
// botones. Literal y no por rango de líneas de HEAD: HEAD cambia con cada
// commit y el rango dejaba de apuntar a este bloque.
const ADMIN_TICKETS_LINK = `          <a href="admin-tickets.html" class="px-6 py-2 rounded-lg font-bold text-sm transition-all text-magenta-400 hover:text-white hover:bg-magenta-500/20 flex items-center gap-2">
            <i class="fas fa-ticket-alt"></i>Entradas
          </a>
        </div>`;

// Arma la función que corre en el navegador: markup, toggles, innerHTML.
function program({ head, markup, toggle, steps, extra, trimText }) {
  return new Function(`
    ${head ? `document.head.insertAdjacentHTML('beforeend', ${JSON.stringify(`<style>${head}</style>`)});` : ''}
    const root = document.getElementById('root');
    root.innerHTML = ${markup};
    ${extra || ''}
    const toggle = ${toggle};
    for (const k of ${JSON.stringify(steps)}) toggle(k);
    ${trimText ? "root.querySelectorAll('button').forEach((b) => { b.textContent = b.textContent.trim(); });" : ''}
    return root.innerHTML;
  `);
}

const bars = [
  {
    bar: 'profile',
    scripts: ['js/ui/tabs.js'],
    wrapper: '<div style="width:1340px">{}</div>',
    before: JSON.stringify(refLines('public/profile.html', 136, 165)),
    after: `'<div class="ui-tabs--underline mb-8 overflow-x-auto scrollbar-hide">' + UI.Tabs({ variant: 'underline', onSelect: 'switchTab', idPrefix: 'tab-', active: 'posts', items: [
        { key: 'posts', icon: 'fas fa-palette', label: 'OBRAS' },
        { key: 'recursos', icon: 'fas fa-box-open', label: 'RECURSOS' },
        { key: 'concursos', icon: 'fas fa-trophy', iconAccent: 'yellow', label: 'MIS IMAGENES' },
        { key: 'eventos', icon: 'fas fa-calendar-alt', label: 'EVENTOS' },
        { key: 'oportunidades', icon: 'fas fa-briefcase', label: 'CHANCES' },
        { key: 'favs', icon: 'fas fa-heart', iconAccent: 'red', label: 'TUS FAV' },
        { key: 'tickets', icon: 'fas fa-ticket-alt', iconAccent: 'fuchsia', label: 'ENTRADAS' },
        { key: 'visualeffects', icon: 'fas fa-wand-magic-sparkles', iconAccent: 'cyan', label: 'VISUAL EFFECTS' },
        { key: 'notificaciones', icon: 'fas fa-bell', iconAccent: 'yellow-soft', label: 'NOTIFICACIONES', badgeId: 'notif-badge', hidden: true },
      ] }) + '</div>'`,
    beforeToggle: `(tab) => {
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active', 'text-[var(--color-cyan)]', 'border-primary-500');
        btn.classList.add('text-gray-500');
      });
      document.getElementById('tab-' + tab).classList.add('active', 'text-[var(--color-cyan)]', 'border-primary-500');
      document.getElementById('tab-' + tab).classList.remove('text-gray-500');
    }`,
    afterToggle: `(tab) => UI.setActiveTab(document.querySelectorAll('.tab-btn'), document.getElementById('tab-' + tab), 'underline')`,
    initial: 'posts',
    keys: ['posts', 'recursos', 'concursos', 'eventos', 'oportunidades', 'favs', 'tickets', 'visualeffects', 'notificaciones'],
    item: (k) => `#tab-${k}`,
    // Logueado con notificaciones: la tab aparece y el contador se muestra.
    variants: [{
      suffix: 'notif-visible',
      extra: `document.getElementById('tab-notificaciones').classList.remove('hidden');
        const badge = document.getElementById('notif-badge'); badge.textContent = '3'; badge.classList.remove('hidden');`,
      steps: [[], ['notificaciones']],
    }],
  },
  {
    bar: 'admin',
    scripts: ['js/ui/tabs.js'],
    wrapper: '<div style="width:1100px">{}</div>',
    before: JSON.stringify(refLines('public/admin.html', 29, 39)),
    after: `'<div class="ui-tabs--pill">' + UI.Tabs({ variant: 'pill', onSelect: 'switchTab', idPrefix: 'tab-', active: 'users', items: [
            { key: 'users', label: 'Usuarios' },
            { key: 'posts', label: 'Posteos' },
            { key: 'recursos', label: 'Recursos' },
            { key: 'eventos', label: 'Eventos' },
            { key: 'oportunidades', label: 'Oportunidades' },
            { key: 'autobot', label: 'Autobot', icon: 'fas fa-robot', labelId: 'tab-autobot-label', className: 'flex items-center gap-1' },
          ] }) + ${JSON.stringify(ADMIN_TICKETS_LINK)}`,
    beforeToggle: `(tab) => {
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('bg-cyan-500', 'text-black');
        b.classList.add('text-gray-400');
      });
      document.getElementById(\`tab-\${tab}\`).classList.add('bg-cyan-500', 'text-black');
      document.getElementById(\`tab-\${tab}\`).classList.remove('text-gray-400');
    }`,
    afterToggle: `(tab) => UI.setActiveTab(document.querySelectorAll('.tab-btn'), document.getElementById(\`tab-\${tab}\`), 'pill')`,
    initial: 'users',
    keys: ['users', 'posts', 'recursos', 'eventos', 'oportunidades', 'autobot'],
    item: (k) => `#tab-${k}`,
  },
  {
    bar: 'chat',
    scripts: ['js/ui/tabs.js'],
    wrapper: '<div class="flex flex-col" style="width:320px">{}</div>',
    before: JSON.stringify(refLines('public/chat.html', 33, 40)),
    after: `'<div class="ui-tabs--underline">' + UI.Tabs({ variant: 'split', onSelect: 'setTab', idPrefix: 'tab-', active: 'rooms', items: [
            { key: 'rooms', label: 'Salas' },
            { key: 'private', label: 'Mensajes' },
          ] }) + '</div>'`,
    beforeToggle: `(tab) => {
      const tabRooms = document.getElementById('tab-rooms');
      const tabPrivate = document.getElementById('tab-private');
      if (tab === 'rooms') {
        tabRooms.classList.add('border-cyan-500', 'text-cyan-500');
        tabRooms.classList.remove('border-transparent', 'text-gray-500');
        tabPrivate.classList.remove('border-cyan-500', 'text-cyan-500');
        tabPrivate.classList.add('border-transparent', 'text-gray-500');
      } else {
        tabPrivate.classList.add('border-cyan-500', 'text-cyan-500');
        tabPrivate.classList.remove('border-transparent', 'text-gray-500');
        tabRooms.classList.remove('border-cyan-500', 'text-cyan-500');
        tabRooms.classList.add('border-transparent', 'text-gray-500');
      }
    }`,
    afterToggle: `(tab) => {
      const tabRooms = document.getElementById('tab-rooms');
      const tabPrivate = document.getElementById('tab-private');
      UI.setActiveTab([tabRooms, tabPrivate], tab === 'rooms' ? tabRooms : tabPrivate, 'split');
    }`,
    initial: 'rooms',
    // Los botones del chat traían el texto entre saltos de línea. No se pinta
    // (la primera corrida sin esto dio 0 píxeles y estilos iguales), pero el
    // harness compara textContent: se recorta en los dos lados.
    trimText: true,
    keys: ['rooms', 'private'],
    item: (k) => `#tab-${k}`,
    // Repetir la tab activa: el original no la desactiva primero.
    variants: [{ suffix: 'repeat', steps: [['rooms'], ['private', 'private'], ['private', 'rooms', 'rooms']] }],
  },
  {
    bar: 'recursos',
    scripts: ['js/ui/tabs.js'],
    wrapper: '<div style="width:900px">{}</div>',
    before: JSON.stringify(refLines('public/recursos.html', 24, 31)),
    after: `'<div class="flex flex-wrap gap-2 mb-8">' + UI.Tabs({ variant: 'filter', onSelect: 'filterRecursos', active: 'all', items: [
        { key: 'all', label: 'Todos' },
        { key: 'software', label: 'Software' },
        { key: 'github', label: 'GitHub' },
        { key: 'drive', label: 'Drive' },
        { key: 'tutorial', label: 'Tutoriales' },
        { key: 'texto', label: 'Textos' },
      ] }) + '</div>'`,
    // filterRecursos usa el `event` global del click.
    beforeToggle: `(type) => {
      const event = { target: document.querySelector('[onclick="filterRecursos(\\'' + type + '\\')"]') };
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('bg-cyan-500/20', 'text-[var(--color-cyan)]', 'border-cyan-500/30');
        b.classList.add('bg-white/5', 'text-gray-400', 'border-white/10');
      });
      event.target.classList.add('bg-cyan-500/20', 'text-[var(--color-cyan)]', 'border-cyan-500/30');
      event.target.classList.remove('bg-white/5', 'text-gray-400', 'border-white/10');
    }`,
    afterToggle: `(type) => {
      const event = { target: document.querySelector('[onclick="filterRecursos(\\'' + type + '\\')"]') };
      UI.setActiveTab(document.querySelectorAll('.filter-btn'), event.target, 'filter');
    }`,
    initial: 'all',
    keys: ['all', 'software', 'github', 'drive', 'tutorial', 'texto'],
    item: (k) => `[onclick="filterRecursos('${k}')"]`,
  },
  {
    bar: 'oportunidades',
    scripts: ['js/ui/tabs.js'],
    wrapper: '<div style="width:1100px">{}</div>',
    before: JSON.stringify(refLines('public/oportunidades.html', 87, 100)),
    after: `'<div class="flex flex-wrap items-center justify-center gap-3">' + UI.Tabs({ variant: 'filter-pill', onSelect: 'filterOportunidades', idPrefix: 'filter-', active: 'all', items: [
          { key: 'all', icon: 'fas fa-th', label: 'Todas', accent: 'emerald' },
          { key: 'convocatoria_obra', icon: 'fas fa-palette', label: 'Convocatoria de Obra', accent: 'cyan' },
          { key: 'oportunidad_laboral', icon: 'fas fa-briefcase', label: 'Oportunidades Laborales', accent: 'orange' },
          { key: 'colaboracion', icon: 'fas fa-handshake', label: 'Colaboración', accent: 'magenta' },
        ] }) + '</div>'`,
    beforeToggle: `(tipo) => {
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('border-emerald-500/30', 'bg-emerald-500/10', 'text-emerald-400');
        btn.classList.add('border-white/10', 'bg-white/5', 'text-gray-500');
      });
      const activeBtn = document.getElementById('filter-' + tipo);
      if (activeBtn) {
        activeBtn.classList.remove('border-white/10', 'bg-white/5', 'text-gray-500');
        activeBtn.classList.add('border-emerald-500/30', 'bg-emerald-500/10', 'text-emerald-400');
      }
    }`,
    afterToggle: `(tipo) => UI.setActiveTab(document.querySelectorAll('.filter-btn'), document.getElementById('filter-' + tipo), 'filter-pill')`,
    initial: 'all',
    keys: ['all', 'convocatoria_obra', 'oportunidad_laboral', 'colaboracion'],
    item: (k) => `#filter-${k}`,
  },
  {
    bar: 'crear-oportunidad',
    scripts: ['js/ui/tabs.js'],
    wrapper: '<div style="width:1000px">{}</div>',
    before: JSON.stringify(refLines('public/crear-oportunidad.html', 25, 50)),
    after: `'<div class="grid grid-cols-1 md:grid-cols-3 gap-4">' + UI.ChoiceCards({ onSelect: 'selectTipo', items: [
          { key: 'convocatoria_obra', icon: 'fas fa-palette', label: 'Convocatoria de Obra', hint: 'Para eventos y exposiciones', accent: 'cyan' },
          { key: 'oportunidad_laboral', icon: 'fas fa-briefcase', label: 'Oportunidad Laboral', hint: 'Trabajos y posiciones', accent: 'orange' },
          { key: 'colaboracion', icon: 'fas fa-handshake', label: 'Colaboración', hint: 'Proyectos colaborativos', accent: 'magenta' },
        ] }) + '</div>'`,
    // selectTipo(tipo); `null` es resetForm (sólo desactiva).
    beforeToggle: `(tipo) => {
      document.querySelectorAll('.tipo-btn').forEach(btn => {
        btn.classList.remove('border-emerald-500/50', 'bg-emerald-500/10', 'ring-2', 'ring-emerald-500/30');
        btn.classList.add('border-white/10', 'bg-white/5');
      });
      if (tipo === null) return;
      const activeBtn = document.getElementById('btn-' + tipo);
      if (activeBtn) {
        activeBtn.classList.remove('border-white/10', 'bg-white/5');
        activeBtn.classList.add('border-emerald-500/50', 'bg-emerald-500/10', 'ring-2', 'ring-emerald-500/30');
      }
    }`,
    afterToggle: `(tipo) => UI.setActiveTab(document.querySelectorAll('.tipo-btn'), tipo === null ? null : document.getElementById('btn-' + tipo), 'choice')`,
    initial: null,
    keys: ['convocatoria_obra', 'oportunidad_laboral', 'colaboracion'],
    item: (k) => `#btn-${k}`,
    variants: [{ suffix: 'reset', steps: [['colaboracion', null]] }],
  },
  {
    bar: 'index-switch',
    scripts: ['js/ui/tabs.js'],
    wrapper: '<div class="flex gap-6 p-10" style="width:700px;background:linear-gradient(90deg,#123,#f0a,#0ff)">{}</div>',
    head: { before: INDEX_FILTER_RULES + INDEX_MOON_RULES, after: INDEX_MOON_RULES },
    before: JSON.stringify([270, 280, 290, 300].map((l) => refLines('public/index.html', l, l + 3)).join('\n')),
    after: JSON.stringify(['post', 'oportunidad', 'evento', 'recurso'].map((t) => {
      const [, label, icon] = { post: [0, 'Obras', 'fa-palette'], oportunidad: [0, 'Chances', 'fa-briefcase'], evento: [0, 'Eventos', 'fa-calendar-alt'], recurso: [0, 'Recursos', 'fa-box-open'] }[t];
      return `              <button onclick="toggleFilter('${t}')" id="filter-${t}" class="ui-filter-switch ui-filter-switch--${t} active moon-pill">
                <i class="fas ${icon} text-xs shrink-0"></i>
                <span>${label}</span>
              </button>`;
    }).join('\n')),
    // toggleFilter + updateFilterStyles de js/index.js (sin el render del feed).
    beforeToggle: `(type) => {
      window.af = window.af || { post: true, recurso: true, evento: true, oportunidad: true };
      af[type] = !af[type];
      if (!Object.values(af).some(v => v)) af = { post: true, recurso: true, evento: true, oportunidad: true };
      Object.keys(af).forEach(type => {
        const btn = document.getElementById(\`filter-\${type}\`);
        btn.classList.remove('active');
        if (af[type]) {
          btn.classList.add('active');
        }
      });
    }`,
    afterToggle: `(type) => {
      window.af = window.af || { post: true, recurso: true, evento: true, oportunidad: true };
      af[type] = !af[type];
      if (!Object.values(af).some(v => v)) af = { post: true, recurso: true, evento: true, oportunidad: true };
      Object.keys(af).forEach(type => {
        UI.setTabState(document.getElementById(\`filter-\${type}\`), af[type], 'switch');
      });
    }`,
    // Son independientes: "activar" es apagar uno; la cadena apaga todos y
    // vuelve a encender todos.
    initial: '__none__',
    keys: ['post', 'recurso', 'evento', 'oportunidad'],
    item: (k) => `#filter-${k}`,
    chain: ['post', 'evento', 'recurso', 'oportunidad'],
    variants: [{ suffix: 'mixed', steps: [['post', 'evento'], ['post', 'post']] }],
  },
  {
    bar: 'human-ai',
    scripts: ['js/ui/tabs.js'],
    wrapper: '<div class="flex items-center gap-3 mb-6">{}</div>',
    before: JSON.stringify(refLines('public/index.html', 325, 327)),
    after: `UI.HumanAIToggle({ botsOnly: false }).toString()`,
    beforeToggle: `() => {
      window.showBotsOnly = !window.showBotsOnly;
      const btn = document.getElementById('filter-human-ai');
      if (btn) {
        if (showBotsOnly) {
          btn.innerHTML = '<i class="fas fa-robot text-sm"></i>';
          btn.className = 'w-9 h-9 rounded-xl border border-purple-500/40 bg-purple-500/20 text-purple-400 flex items-center justify-center transition-all hover:scale-105 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0';
          btn.title = 'Mostrando contenido IA (Click para cambiar a Humanos)';
        } else {
          btn.innerHTML = '<i class="fas fa-user text-sm"></i>';
          btn.className = 'w-9 h-9 rounded-xl border border-emerald-500/40 bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-all hover:scale-105 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0';
          btn.title = 'Mostrando contenido Humano (Click para cambiar a IA)';
        }
      }
    }`,
    afterToggle: `() => {
      window.showBotsOnly = !window.showBotsOnly;
      const btn = document.getElementById('filter-human-ai');
      if (btn) UI.setHumanAIToggle(btn, showBotsOnly);
    }`,
    initial: 'human',
    keys: ['human', 'bots'],
    item: () => '#filter-human-ai',
    steps: [[], ['x'], ['x', 'x']],
  },
];

// Secuencias por barra: inicial, activar cada ítem, cadena por todos; con
// hover sobre el primer ítem y sobre el recién activado.
const sequences = [];
for (const b of bars) {
  const add = (name, steps, hover, extra) => sequences.push({ ...b, name: `${b.bar}--${name}`, steps, hover, extra });
  if (b.steps) {
    b.steps.forEach((steps, i) => {
      add(`toggle-${i}`, steps);
      add(`toggle-${i}--hover`, steps, b.item());
    });
    continue;
  }
  const first = b.keys[0];
  const second = b.keys[1];
  add('initial', []);
  add('initial--hover-first', [], b.item(first));
  add('initial--hover-second', [], b.item(second));
  for (const k of b.keys) {
    if (k === b.initial) continue;
    add(`on-${k}`, [k]);
  }
  add(`on-${second}--hover-first`, [second], b.item(first));
  add(`on-${second}--hover-second`, [second], b.item(second));
  const chain = b.chain || [...b.keys.filter((k) => k !== b.initial), ...(b.initial && b.keys.includes(b.initial) ? [b.initial] : [])];
  add('chain', chain);
  add('chain--hover-first', chain, b.item(first));
  for (const v of b.variants || []) {
    v.steps.forEach((steps, i) => add(`${v.suffix}-${i}`, steps, undefined, v.extra));
  }
}

const cases = sequences.map((s) => ({
  name: s.name,
  scripts: s.scripts,
  wrapper: s.wrapper,
  hover: s.hover,
  before: program({ head: s.head && s.head.before, markup: s.before, toggle: s.beforeToggle, steps: s.steps, extra: s.extra, trimText: s.trimText }),
  after: program({ head: s.head && s.head.after, markup: s.after, toggle: s.afterToggle, steps: s.steps, extra: s.extra, trimText: s.trimText }),
}));

module.exports = cases;
module.exports.sequences = sequences;
module.exports.program = program;
