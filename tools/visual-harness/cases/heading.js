// Casos de la familia heading: primitivas `ui-title--*` / `ui-eyebrow--*` y
// UI.PageHeader. `before` es el HTML literal que había en cada página antes de
// migrarla (75d8386); en las plantillas JS la interpolación `${...}` se
// reemplazó por un texto de ejemplo, igual en ambos lados.
const scripts = ['js/ui/heading.js'];
const mobile = { width: 390, height: 844 };
const box = '<div style="width:1000px">{}</div>';

const primitives = [
  // artistas.html
  { name: 'title-hero', before: `<h1 class="text-4xl md:text-5xl font-black gradient-text mb-2">Galeria de Artistas</h1>`, after: `<h1 class="ui-title ui-title--hero gradient-text mb-2">Galeria de Artistas</h1>` },
  // quienessomos.html
  { name: 'title-hero-lg', wrapper: box, before: `<h1 class="text-4xl md:text-6xl font-black gradient-text mb-3">
        Quienes Somos
      </h1>`, after: `<h1 class="ui-title ui-title--hero-lg gradient-text mb-3">
        Quienes Somos
      </h1>` },
  // recurso.html
  { name: 'title-page-lg', before: `<h1 id="resource-title" class="text-3xl md:text-5xl font-black text-white mb-2 truncate"></h1>`, after: `<h1 id="resource-title" class="ui-title ui-title--page-lg mb-2 truncate"></h1>` },
  // quienessomos.html
  { name: 'title-page', before: `<h2 class="text-3xl md:text-4xl font-black text-white">
          Casos de <span class="gradient-text">Exito</span>
        </h2>`, after: `<h2 class="ui-title ui-title--page">
          Casos de <span class="gradient-text">Exito</span>
        </h2>` },
  // calendario.html
  { name: 'title-page-sm', before: `<h1 class="text-3xl font-black text-white flex items-center gap-3">
          <i class="fas fa-calendar-alt text-cyan-400"></i> Calendario Comunidad
        </h1>`, after: `<h1 class="ui-title ui-title--page-sm flex items-center gap-3">
          <i class="fas fa-calendar-alt text-cyan-400"></i> Calendario Comunidad
        </h1>` },
  // event-tickets.html
  { name: 'title-page-sm-plain', before: `<h1 class="text-3xl font-black text-white">Administrar Entradas</h1>`, after: `<h1 class="ui-title ui-title--page-sm">Administrar Entradas</h1>` },
  // profile.html
  { name: 'title-page-xs', before: `<h1 id="profile-username" class="text-2xl md:text-3xl font-black text-white">Cargando...</h1>`, after: `<h1 id="profile-username" class="ui-title ui-title--page-xs">Cargando...</h1>` },
  // create.html
  { name: 'title-status', before: `<h2 id="status-title" class="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Subiendo...</h2>`, after: `<h2 id="status-title" class="ui-title ui-title--status mb-2">Subiendo...</h2>` },
  // login.html
  { name: 'title-panel', before: `<h1 class="text-2xl font-bold text-white">Iniciar Sesión</h1>`, after: `<h1 class="ui-title ui-title--panel">Iniciar Sesión</h1>` },
  // admin.html
  { name: 'title-panel-sticky', before: `<h2 id="modal-title" class="text-2xl font-bold text-white mb-6 sticky top-0 bg-[var(--bg-surface)] py-2 z-10">Editar Contenido</h2>`, after: `<h2 id="modal-title" class="ui-title ui-title--panel mb-6 sticky top-0 bg-[var(--bg-surface)] py-2 z-10">Editar Contenido</h2>` },
  // admin.html
  { name: 'title-panel-strong', before: `<h2 class="text-2xl font-black text-white flex items-center gap-3">
            <i class="fas fa-robot text-green-400"></i>
            AutoBot <span class="text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-xl uppercase tracking-widest">Automático</span>
          </h2>`, after: `<h2 class="ui-title ui-title--panel-strong flex items-center gap-3">
            <i class="fas fa-robot text-green-400"></i>
            AutoBot <span class="text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-xl uppercase tracking-widest">Automático</span>
          </h2>` },
  // search.html
  { name: 'title-section', before: `<h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <i class="fas fa-users text-cyan-400"></i> Usuarios
            </h2>`, after: `<h2 class="ui-title ui-title--section mb-6 flex items-center gap-2">
              <i class="fas fa-users text-cyan-400"></i> Usuarios
            </h2>` },
  // evento.html
  { name: 'title-section-border', before: `<h3 class="text-xl font-bold text-white mb-4 border-l-4 border-magenta-500 pl-4">Descripción</h3>`, after: `<h3 class="ui-title ui-title--section mb-4 border-l-4 border-magenta-500 pl-4">Descripción</h3>` },
  // ticket-purchase.html
  { name: 'title-section-strong', before: `<h3 class="text-xl font-black text-white mb-4">
          <i class="fas fa-exclamation-triangle text-yellow-400 mr-2"></i>
          ¿Estás seguro?
        </h3>`, after: `<h3 class="ui-title ui-title--section-strong mb-4">
          <i class="fas fa-exclamation-triangle text-yellow-400 mr-2"></i>
          ¿Estás seguro?
        </h3>` },
  // oportunidad.html
  { name: 'title-subsection', before: `<h3 class="text-sm font-bold text-gray-300 mb-2"><i class="fas fa-file-contract mr-2"></i>Bases y Condiciones</h3>`, after: `<h3 class="ui-title ui-title--subsection mb-2"><i class="fas fa-file-contract mr-2"></i>Bases y Condiciones</h3>` },
  // create.html
  { name: 'title-card', before: `<h3 class="text-lg font-bold text-white mb-1">Obra Artística</h3>`, after: `<h3 class="ui-title ui-title--card mb-1">Obra Artística</h3>` },
  // ticket-purchase.html
  { name: 'title-card-strong', before: `<h3 class="text-lg font-black text-white">Instrucciones de pago</h3>`, after: `<h3 class="ui-title ui-title--card-strong">Instrucciones de pago</h3>` },
  // guiaingreso.html
  { name: 'title-card-sm', before: `<h3 class="text-white font-bold text-sm mb-1">Feed de Arte</h3>`, after: `<h3 class="ui-title ui-title--card-sm mb-1">Feed de Arte</h3>` },
  // oportunidades.html
  { name: 'title-tile', before: `<h3 class="text-sm md:text-lg font-black text-white uppercase tracking-tight">Obra Artística</h3>`, after: `<h3 class="ui-title ui-title--tile">Obra Artística</h3>` },
  // crear-oportunidad.html
  { name: 'title-tile-sm', before: `<h3 class="text-sm font-black text-white uppercase tracking-tight">Convocatoria de Obra</h3>`, after: `<h3 class="ui-title ui-title--tile-sm">Convocatoria de Obra</h3>` },
  // admin-tickets.html
  { name: 'eyebrow-stat', before: `<p class="text-xs text-gray-500 uppercase tracking-wider">Total Entradas</p>`, after: `<p class="ui-eyebrow ui-eyebrow--stat">Total Entradas</p>` },
  // scan-redeem.html
  { name: 'eyebrow-stat-mb', before: `<p class="text-xs text-gray-500 uppercase tracking-wider mb-3">Datos del Asistente</p>`, after: `<p class="ui-eyebrow ui-eyebrow--stat mb-3">Datos del Asistente</p>` },
  // admin.html
  { name: 'eyebrow-section', before: `<h3 class="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Últimos Posts Automáticos</h3>`, after: `<h3 class="ui-eyebrow ui-eyebrow--section mb-4">Últimos Posts Automáticos</h3>` },
  // evento.html
  { name: 'eyebrow-field', before: `<h4 class="text-xs font-bold text-gray-500 uppercase">Hora</h4>`, after: `<h4 class="ui-eyebrow ui-eyebrow--field">Hora</h4>` },
  // calendario.html
  { name: 'eyebrow-field-wide', before: `<div class="text-center py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Dom</div>`, after: `<div class="text-center py-4 ui-eyebrow ui-eyebrow--field-wide">Dom</div>` },
  // admin.html
  { name: 'eyebrow-micro', before: `<p class="text-[10px] uppercase tracking-widest font-black text-gray-500 mb-2">🤖 Bot User</p>`, after: `<p class="ui-eyebrow ui-eyebrow--micro mb-2">🤖 Bot User</p>` },
  // recursos.html (plantilla de tarjeta, con hover del grupo)
  {
    name: 'title-section-strong-group-hover',
    wrapper: '<div class="group" style="width:400px">{}</div>',
    hover: '.group',
    before: `<h3 class="text-xl font-black text-white mb-2 leading-tight group-hover:text-cyan-400 transition-colors line-clamp-1">TouchDesigner: guía de inicio</h3>`,
    after: `<h3 class="ui-title ui-title--section-strong mb-2 leading-tight group-hover:text-cyan-400 transition-colors line-clamp-1">TouchDesigner: guía de inicio</h3>`,
  },
  // artistas.html (plantilla, hover sobre el propio título)
  {
    name: 'title-card-strong-hover',
    hover: 'h3',
    before: `<h3 class="text-lg font-black text-white hover:text-[var(--color-cyan)] transition-colors">Artista Demo</h3>`,
    after: `<h3 class="ui-title ui-title--card-strong hover:text-[var(--color-cyan)] transition-colors">Artista Demo</h3>`,
  },
];

// Variantes con `md:`: se repiten en mobile.
const responsive = ['title-hero', 'title-hero-lg', 'title-page', 'title-page-xs', 'title-tile'];
const mobileCases = primitives
  .filter((c) => responsive.includes(c.name))
  .map((c) => ({ ...c, name: `${c.name}-mobile`, viewport: mobile, wrapper: '<div style="width:340px">{}</div>' }));

const pageHeaders = [
  // obras.html (recursos.html usa la misma estructura)
  {
    name: 'page-header-md',
    wrapper: '<section class="mb-10" style="width:1000px">{}</section>',
    before: `<h1 class="text-3xl md:text-4xl font-black text-white mb-2">
        <i class="fas fa-palette text-[var(--color-cyan)] mr-2"></i>Galería de Obras
      </h1>
      <p class="text-gray-400">Explorá el talento de la comunidad de artistas digitales.</p>`,
    after: () => UI.PageHeader({ icon: 'fas fa-palette', title: 'Galería de Obras', subtitle: 'Explorá el talento de la comunidad de artistas digitales.' }).toString(),
  },
  // eventos.html
  {
    name: 'page-header-lg',
    wrapper: box,
    before: `<h1 class="text-3xl md:text-5xl font-black text-white mb-2">
          <i class="fas fa-calendar-star text-[var(--color-magenta)] mr-2"></i>Eventos de la Comunidad
        </h1>
        <p class="text-gray-400">Publicá tus fechas, ferias, talleres y encuentros.</p>`,
    after: () => UI.PageHeader({ icon: 'fas fa-calendar-star', title: 'Eventos de la Comunidad', subtitle: 'Publicá tus fechas, ferias, talleres y encuentros.', accent: 'magenta', size: 'lg' }).toString(),
  },
  // admin.html
  {
    name: 'page-header-sm',
    wrapper: box,
    before: `<h1 class="text-3xl font-black text-white">
            <i class="fas fa-shield-alt text-[var(--color-cyan)] mr-2"></i>Panel de Control
          </h1>
          <p class="text-gray-400 mt-1">Gestión global de la plataforma</p>`,
    after: () => UI.PageHeader({ icon: 'fas fa-shield-alt', title: 'Panel de Control', subtitle: 'Gestión global de la plataforma', size: 'sm' }).toString(),
  },
  // admin-tickets.html
  {
    name: 'page-header-sm-magenta-500',
    wrapper: box,
    before: `<h1 class="text-3xl font-black text-white">
            <i class="fas fa-ticket-alt text-magenta-500 mr-2"></i>Todas las Entradas
          </h1>
          <p class="text-gray-400 mt-1">Administración global del sistema de entradas</p>`,
    after: () => UI.PageHeader({ icon: 'fas fa-ticket-alt', title: 'Todas las Entradas', subtitle: 'Administración global del sistema de entradas', accent: 'magenta-500', size: 'sm' }).toString(),
  },
  {
    name: 'page-header-escapes-title',
    wrapper: box,
    before: `<h1 class="text-3xl md:text-4xl font-black text-white mb-2">&lt;b&gt;Obras&lt;/b&gt;</h1>`,
    after: () => UI.PageHeader({ title: '<b>Obras</b>' }).toString(),
  },
];
const pageHeadersMobile = pageHeaders
  .filter((c) => c.name === 'page-header-md' || c.name === 'page-header-lg')
  .map((c) => ({ ...c, name: `${c.name}-mobile`, viewport: mobile, wrapper: '<div style="width:340px">{}</div>' }));

module.exports = [...primitives, ...mobileCases, ...pageHeaders, ...pageHeadersMobile]
  .map((c) => ({ wrapper: box, scripts, ...c }));
