// Casos de UI.TypeBadge / StatusBadge / CountBadge / Stat(s) y de las
// primitivas `ui-badge--*`. `before` es el HTML literal de cada template en
// 75d8386 con datos de ejemplo en lugar de los `${…}`; los colores
// interpolados se escriben ya resueltos, tal como llegaban al navegador.
//
// `tight()`: ver cases/avatar.js. Los chips son ítems flex (bloques) y el
// espacio al principio y al final de su línea colapsa.
const tight = (s) => s.replace(/(<[a-z][^>]*>)\s+/g, '$1').replace(/\s+(<\/[a-z]+>)/g, '$1');
const scripts = ['js/ui/badge.js'];
const row = '<div class="flex items-center gap-2 mb-4" style="width:600px">{}</div>';

// recursos.html: typeColors / typeIcons
const RECURSO_TYPES = {
  software: ['fuchsia', 'fas fa-desktop'],
  github: ['gray', 'fab fa-github'],
  drive: ['yellow', 'fab fa-google-drive'],
  tutorial: ['green', 'fas fa-graduation-cap'],
  texto: ['cyan', 'fas fa-file-alt'],
  other: ['orange', 'fas fa-link'],
};

// oportunidades.html: tipoColors (con `emerald` de fallback) / tipoIcons / tipoLabels
const OPO_TYPES = {
  convocatoria_obra: ['cyan', 'fas fa-palette', 'Convocatoria de Obra'],
  oportunidad_laboral: ['orange', 'fas fa-briefcase', 'Oportunidad Laboral'],
  colaboracion: ['magenta', 'fas fa-handshake', 'Colaboración'],
  otro: ['emerald', 'fas fa-briefcase', 'Oportunidad'],
};

const ESTADOS = { pendiente: 'yellow', aceptada: 'green', rechazada: 'red', otro: 'gray' };

const cases = [
  ...Object.entries(RECURSO_TYPES).map(([type, [color, icon]]) => ({
    name: `type-recursos-${type}`,
    before: `<span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-${color}-500/20 text-${color}-400 border border-${color}-500/30 uppercase tracking-widest">
                  <i class="${icon} mr-1"></i>${type}
                </span>`,
    after: new Function(`return UI.TypeBadge({ label: '${type}', icon: '${icon}', tone: '${color}' }).toString()`),
  })),
  ...Object.entries(OPO_TYPES).map(([tipo, [color, icon, label]]) => ({
    name: `type-oportunidades-${tipo}`,
    before: `<span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-${color}-500/20 text-${color}-400 border border-${color}-500/30 uppercase tracking-widest">
                  <i class="${icon} mr-1"></i>${label}
                </span>`,
    after: new Function(`return UI.TypeBadge({ label: '${label}', icon: '${icon}', tone: '${color}' }).toString()`),
  })),
  // oportunidad.html / postulantes.html: #opo-tipo-badge, clases asignadas por JS
  ...Object.entries(OPO_TYPES).map(([tipo, [color, icon, label]]) => ({
    name: `type-lg-oportunidad-${tipo}`,
    before: `<span id="opo-tipo-badge" class="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest bg-${color}-500/20 text-${color}-400 border border-${color}-500/30"><i class="${icon} mr-1"></i>${label}</span>`,
    after: new Function(`return '<span id="opo-tipo-badge" class="' + UI.badgeClass({ variant: 'type-lg', tone: '${color}' }) + '"><i class="${icon} mr-1"></i>${label}</span>'`),
  })),
  {
    name: 'type-lg-estatico-vacio',
    before: '<span id="opo-tipo-badge" class="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest"></span>',
    after: '<span id="opo-tipo-badge" class="ui-badge ui-badge--type-lg"></span>',
  },
  // oportunidad.html: estado de la inscripción
  ...Object.entries(ESTADOS).map(([estado, color]) => ({
    name: `status-oportunidad-${estado}`,
    wrapper: '<div class="flex items-start justify-between gap-4" style="width:600px"><div>x</div>{}</div>',
    before: `<span class="px-2 py-1 rounded-lg text-[10px] font-bold bg-${color}-500/20 text-${color}-400 border border-${color}-500/30 uppercase">${estado}</span>`,
    after: new Function(`return UI.StatusBadge({ label: '${estado}', tone: '${color}' }).toString()`),
  })),
  // postulantes.html: estado de la inscripción
  ...Object.entries(ESTADOS).map(([estado, color]) => ({
    name: `status-lg-postulantes-${estado}`,
    before: `<span class="px-3 py-1 rounded-xl text-xs font-bold bg-${color}-500/20 text-${color}-400 border border-${color}-500/30 uppercase tracking-wider">${estado}</span>`,
    after: new Function(`return UI.StatusBadge({ label: '${estado}', tone: '${color}', size: 'lg' }).toString()`),
  })),
  // artistas.html: contadores del artista (colores en css/artistas.css, que el
  // shell de fragmentos no carga: se compara sólo la forma)
  {
    name: 'count-artistas',
    wrapper: '<div class="flex flex-wrap justify-center gap-1.5" style="width:600px">{}</div>',
    before: `<span class="count-badge px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1"><i class="fas fa-palette text-[9px]"></i> 1 OBRA</span>`
      + `<span class="count-badge px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1"><i class="fas fa-box-open text-[9px]"></i> 12 RECURSOS</span>`
      + `<span class="count-badge px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1"><i class="fas fa-calendar-alt text-[9px]"></i> 3 EVENTOS</span>`,
    after: () => [
      UI.CountBadge({ icon: 'fas fa-palette', count: 1, label: 'OBRA' }),
      UI.CountBadge({ icon: 'fas fa-box-open', count: 12, label: 'RECURSOS' }),
      UI.CountBadge({ icon: 'fas fa-calendar-alt', count: 3, label: 'EVENTOS' }),
    ].join(''),
  },
  // obras.html: pie de la tarjeta
  {
    name: 'stats-obras',
    wrapper: '<div class="mt-auto flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-white/5" style="width:360px">{}</div>',
    before: `<span><i class="fas fa-heart mr-1"></i>12</span>
                <span><i class="fas fa-comment mr-1"></i>0</span>`,
    after: () => UI.Stats({ likes: 12, comments: 0 }).toString(),
  },
  // recursos.html: pie de la tarjeta
  {
    name: 'stats-recursos',
    wrapper: '<div class="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{}</div>',
    before: `<span><i class="fas fa-heart mr-1"></i>7</span>
                  <span><i class="fas fa-comment mr-1"></i>3</span>`,
    after: () => UI.Stats({ likes: 7, comments: 3 }).toString(),
  },
  // profile.html: pie de la tarjeta de recurso
  {
    name: 'stat-comments-profile',
    wrapper: '<div class="flex items-center justify-between text-[10px] text-gray-500 pt-3 border-t border-white/5" style="width:300px">{}<span>1/2/2026</span></div>',
    before: `<span><i class="fas fa-comment mr-1"></i>4</span>`,
    after: () => UI.Stat({ kind: 'comments', count: 4 }).toString(),
  },
  {
    name: 'escapes-type-label',
    before: `<span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase tracking-widest"><i class="fas fa-link mr-1"></i>&lt;b&gt;x&lt;/b&gt;</span>`,
    after: () => UI.TypeBadge({ label: '<b>x</b>', icon: 'fas fa-link', tone: 'orange' }).toString(),
  },
];

module.exports = cases.map((c) => ({ wrapper: row, scripts, ...c, before: tight(c.before) }));
