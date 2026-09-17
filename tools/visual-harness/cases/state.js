// Casos de UI.LoadingState / LoadingText / PageLoader / EmptyState / ErrorState / StatusText. `before` es el HTML
// literal que había en cada página antes de migrarla.
const grid = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style="width:1200px">{}</div>';
const block = '<div style="width:1200px">{}</div>';
const sidebar = '<div class="space-y-1" style="width:320px">{}</div>';
const scripts = ['js/ui/state.js'];

module.exports = [
  {
    name: 'obras-loading',
    before: `<div class="col-span-full text-center text-gray-500 py-20">
        <i class="fas fa-spinner fa-spin text-3xl text-cyan-400 mb-4"></i>
        <p>Cargando arte...</p>
      </div>`,
    after: () => UI.LoadingState({ message: 'Cargando arte...' }).toString(),
  },
  {
    name: 'obras-empty',
    before: `<div class="col-span-full text-center text-gray-500 py-20">
            <i class="fas fa-image text-5xl text-cyan-400/30 mb-4"></i>
            <p class="text-xl">Aún no hay obras publicadas</p>
          </div>`,
    after: () => UI.EmptyState({ icon: 'fas fa-image', message: 'Aún no hay obras publicadas' }).toString(),
  },
  {
    name: 'obras-error',
    before: `<div class="col-span-full text-center text-red-400 py-10"><i class="fas fa-exclamation-triangle mr-2"></i>Error cargando obras</div>`,
    after: () => UI.ErrorState({ message: 'Error cargando obras' }).toString(),
  },
  {
    name: 'recursos-empty',
    before: `<div class="col-span-full text-center text-gray-500 py-20">
            <i class="fas fa-folder-open text-5xl text-cyan-400/30 mb-4"></i>
            <p class="text-xl">No hay recursos</p>
          </div>`,
    after: () => UI.EmptyState({ icon: 'fas fa-folder-open', message: 'No hay recursos' }).toString(),
  },
  {
    name: 'oportunidades-loading',
    before: `<div class="col-span-full text-center text-gray-500 py-20">
          <i class="fas fa-spinner fa-spin text-3xl text-emerald-400 mb-4"></i>
          <p>Cargando oportunidades...</p>
        </div>`,
    after: () => UI.LoadingState({ message: 'Cargando oportunidades...', accent: 'emerald' }).toString(),
  },
  {
    name: 'oportunidades-empty',
    before: `<div class="col-span-full text-center text-gray-500 py-20">
            <i class="fas fa-briefcase text-5xl text-emerald-400/30 mb-4"></i>
            <p class="text-xl">Aún no hay oportunidades publicadas</p>
            <p class="text-sm mt-2">¡Sé el primero en crear una!</p>
          </div>`,
    after: () => UI.EmptyState({ icon: 'fas fa-briefcase', message: 'Aún no hay oportunidades publicadas', hint: '¡Sé el primero en crear una!', accent: 'emerald' }).toString(),
  },
  {
    name: 'profile-loading-md',
    before: `<div class="col-span-full text-center text-gray-500 py-10">
          <i class="fas fa-spinner fa-spin text-2xl text-orange-400 mb-3"></i>
          <p>Cargando obras...</p>
        </div>`,
    after: () => UI.LoadingState({ message: 'Cargando obras...', accent: 'orange', size: 'md' }).toString(),
  },
  {
    name: 'profile-loading-text',
    before: `<div class="col-span-full text-center text-gray-500 py-10">
          <p>Cargando recursos...</p>
        </div>`,
    after: () => UI.LoadingText({ message: 'Cargando recursos...' }).toString(),
  },
  {
    name: 'escapes-user-text',
    before: `<div class="col-span-full text-center text-red-400 py-10"><i class="fas fa-exclamation-triangle mr-2"></i>&lt;img src=x onerror=alert(1)&gt;</div>`,
    after: () => UI.ErrorState({ message: '<img src=x onerror=alert(1)>' }).toString(),
  },
  // --- LoadingState: variantes nuevas ---
  {
    name: 'recursos-loading',
    before: `<div class="col-span-full text-center text-gray-500 py-20">
        <i class="fas fa-spinner fa-spin text-3xl text-cyan-400 mb-4"></i>
        <p>Cargando recursos...</p>
      </div>`,
    after: () => UI.LoadingState({ message: 'Cargando recursos...' }).toString(),
  },
  {
    name: 'index-loading-orange',
    before: `<div class="col-span-full text-center text-gray-500 py-20">
          <i class="fas fa-spinner fa-spin text-3xl text-orange-400 mb-4"></i>
          <p>Cargando arte...</p>
        </div>`,
    after: () => UI.LoadingState({ message: 'Cargando arte...', accent: 'orange' }).toString(),
  },
  {
    name: 'eventos-loading-xl-magenta',
    before: `<div class="col-span-full text-center py-20 text-gray-500">
        <i class="fas fa-spinner fa-spin text-4xl text-magenta-400 mb-4"></i>
        <p>Sincronizando eventos...</p>
      </div>`,
    after: () => UI.LoadingState({ message: 'Sincronizando eventos...', accent: 'magenta', size: 'xl' }).toString(),
  },
  {
    name: 'profile-visualeffects-loading-md',
    before: `<div class="col-span-full text-center text-gray-500 py-10">
          <i class="fas fa-spinner fa-spin text-2xl text-cyan-400 mb-3"></i>
          <p>Cargando efectos visuales...</p>
        </div>`,
    after: () => UI.LoadingState({ message: 'Cargando efectos visuales...', size: 'md' }).toString(),
  },
  {
    name: 'profile-tickets-loading-block',
    wrapper: block,
    before: `<div class="text-center text-gray-500 py-10">
          <i class="fas fa-spinner fa-spin text-2xl text-fuchsia-400 mb-3"></i>
          <p>Cargando entradas...</p>
        </div>`,
    after: () => UI.LoadingState({ message: 'Cargando entradas...', accent: 'fuchsia', size: 'md', layout: 'block' }).toString(),
  },
  {
    name: 'profile-notifications-loading-yellow',
    wrapper: block,
    before: `<div class="text-center text-gray-500 py-10">
          <i class="fas fa-spinner fa-spin text-2xl text-yellow-400 mb-3"></i>
          <p>Cargando notificaciones...</p>
        </div>`,
    after: () => UI.LoadingState({ message: 'Cargando notificaciones...', accent: 'yellow', size: 'md', layout: 'block' }).toString(),
  },

  // --- PageLoader ---
  {
    name: 'page-loader-magenta',
    wrapper: block,
    before: `<div id="loading" class="py-20 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-magenta-500 mb-4"></i>
      <p class="text-gray-500">Sincronizando datos del evento...</p>
    </div>`,
    after: () => UI.PageLoader({ id: 'loading', message: 'Sincronizando datos del evento...' }).toString(),
  },
  {
    name: 'page-loader-emerald-soft',
    wrapper: block,
    before: `<div id="loading" class="text-center py-20">
      <i class="fas fa-spinner fa-spin text-4xl text-emerald-400 mb-4"></i>
      <p class="text-gray-400">Cargando oportunidad...</p>
    </div>`,
    after: () => UI.PageLoader({ id: 'loading', message: 'Cargando oportunidad...', accent: 'emerald', tone: 'soft' }).toString(),
  },
  {
    name: 'page-loader-cyan-deep',
    wrapper: block,
    before: `<div id="loading" class="py-20 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-cyan-500 mb-4"></i>
      <p class="text-gray-500">Cargando recurso...</p>
    </div>`,
    after: () => UI.PageLoader({ id: 'loading', message: 'Cargando recurso...', accent: 'cyan-deep' }).toString(),
  },
  {
    name: 'page-loader-brand',
    wrapper: block,
    before: `<div class="text-center py-20">
        <i class="fas fa-spinner fa-spin text-4xl text-[var(--color-cyan)] mb-4"></i>
        <p class="text-gray-400">Cargando detalles de la obra...</p>
      </div>`,
    after: () => UI.PageLoader({ message: 'Cargando detalles de la obra...', accent: 'brand', tone: 'soft' }).toString(),
  },
  {
    name: 'search-loader-cyan',
    wrapper: block,
    before: `
        <div class="text-center py-20">
          <i class="fas fa-spinner fa-spin text-4xl text-cyan-400 mb-4"></i>
          <p class="text-gray-400">Buscando en el metaverso...</p>
        </div>`,
    after: () => UI.PageLoader({ message: 'Buscando en el metaverso...', accent: 'cyan', tone: 'soft' }).toString(),
  },
  {
    // scan-redeem arranca oculto: el caso compara los estilos computados igual.
    name: 'page-loader-hidden',
    wrapper: block,
    before: `<div id="loading" class="hidden py-20 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-magenta-500 mb-4"></i>
      <p class="text-gray-500">Cargando entrada...</p>
    </div>`,
    after: () => UI.PageLoader({ id: 'loading', message: 'Cargando entrada...', className: 'hidden' }).toString(),
  },

  // --- EmptyState: variantes nuevas ---
  {
    name: 'eventos-empty-xl-ghost',
    before: `
            <div class="col-span-full text-center py-20 text-gray-500">
              <i class="fas fa-calendar-times text-6xl opacity-20 mb-4"></i>
              <p class="text-xl">No hay eventos programados próximamente.</p>
            </div>`,
    after: () => UI.EmptyState({ icon: 'fas fa-calendar-times', message: 'No hay eventos programados próximamente.', accent: 'ghost', iconSize: 'xl' }).toString(),
  },
  {
    name: 'search-empty-block-ghost',
    wrapper: block,
    before: `
          <div id="initial-state" class="text-center py-20 text-gray-500">
            <i class="fas fa-rocket text-5xl mb-4 opacity-20"></i>
            <p class="text-xl">Escribe algo para empezar a explorar...</p>
          </div>`,
    after: () => UI.EmptyState({ id: 'initial-state', icon: 'fas fa-rocket', message: 'Escribe algo para empezar a explorar...', accent: 'ghost', layout: 'block' }).toString(),
  },
  {
    name: 'index-feed-empty-dashed',
    before: `<div class="col-span-full text-center text-gray-500 py-20 px-8 bg-white/5 rounded-3xl border border-dashed border-white/10">
      <i class="fas fa-search text-4xl mb-4 opacity-20"></i>
      <p class="text-xl">No hay publicaciones para los filtros seleccionados</p>
    </div>`,
    after: () => UI.EmptyState({ icon: 'fas fa-search', message: 'No hay publicaciones para los filtros seleccionados', accent: 'ghost', iconSize: 'md', surface: 'dashed' }).toString(),
  },
  {
    name: 'profile-empty-sm-fuchsia',
    before: `<div class="col-span-full text-center text-gray-500 py-10"><i class="fas fa-image text-4xl text-fuchsia-400/30 mb-3"></i><p>Este artista aún no tiene obras publicadas</p></div>`,
    after: () => UI.EmptyState({ icon: 'fas fa-image', message: 'Este artista aún no tiene obras publicadas', accent: 'fuchsia', size: 'sm' }).toString(),
  },
  {
    name: 'profile-empty-sm-orange',
    before: `<div class="col-span-full text-center text-gray-500 py-10"><i class="fas fa-box-open text-4xl text-orange-400/30 mb-3"></i><p>Este usuario aún no tiene recursos compartidos</p></div>`,
    after: () => UI.EmptyState({ icon: 'fas fa-box-open', message: 'Este usuario aún no tiene recursos compartidos', accent: 'orange', size: 'sm' }).toString(),
  },
  {
    name: 'profile-empty-sm-magenta',
    before: `<div class="col-span-full text-center text-gray-500 py-10"><i class="fas fa-calendar-times text-4xl text-magenta-400/30 mb-3"></i><p>Este usuario no tiene eventos registrados</p></div>`,
    after: () => UI.EmptyState({ icon: 'fas fa-calendar-times', message: 'Este usuario no tiene eventos registrados', accent: 'magenta', size: 'sm' }).toString(),
  },
  {
    name: 'profile-empty-sm-emerald',
    before: `<div class="col-span-full text-center text-gray-500 py-10"><i class="fas fa-briefcase text-4xl text-emerald-400/30 mb-3"></i><p>Este usuario aún no tiene oportunidades publicadas</p></div>`,
    after: () => UI.EmptyState({ icon: 'fas fa-briefcase', message: 'Este usuario aún no tiene oportunidades publicadas', accent: 'emerald', size: 'sm' }).toString(),
  },
  {
    name: 'profile-favs-empty-dashed',
    before: `<div class="col-span-full text-center text-gray-500 py-16 bg-white/5 rounded-3xl border border-dashed border-white/10"><i class="fas fa-heart-broken text-4xl text-gray-600 mb-3"></i><p>Aún no hay favoritos guardados</p></div>`,
    after: () => UI.EmptyState({ icon: 'fas fa-heart-broken', message: 'Aún no hay favoritos guardados', accent: 'neutral', size: 'sm', surface: 'dashed' }).toString(),
  },
  {
    name: 'profile-concursos-empty-action',
    before: `<div class="col-span-full text-center text-gray-500 py-16 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <i class="fas fa-trophy text-4xl text-yellow-500/20 mb-3"></i>
          <p>Aún no participaste en ningún concurso</p>
          <a href="concurso" class="text-yellow-500 hover:text-yellow-400 text-sm font-bold block mt-2">¡Participar ahora!</a>
        </div>`,
    after: () => UI.EmptyState({
      icon: 'fas fa-trophy', message: 'Aún no participaste en ningún concurso', accent: 'yellow', size: 'sm', surface: 'dashed',
      action: UI.html`<a href="concurso" class="text-yellow-500 hover:text-yellow-400 text-sm font-bold block mt-2">¡Participar ahora!</a>`,
    }).toString(),
  },
  {
    name: 'profile-visualeffects-empty-action',
    before: `
          <div class="col-span-full text-center text-gray-500 py-10">
            <i class="fas fa-wand-magic-sparkles text-4xl text-cyan-400/30 mb-3"></i>
            <p>No hay efectos visuales guardados aún.</p>
            <a href="visualeffects.html" class="inline-block mt-3 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-bold hover:bg-cyan-500/30 transition-all">
              <i class="fas fa-plus mr-1"></i> Crear primer efecto
            </a>
          </div>`,
    after: () => UI.EmptyState({
      icon: 'fas fa-wand-magic-sparkles', message: 'No hay efectos visuales guardados aún.', size: 'sm',
      action: UI.html`<a href="visualeffects.html" class="inline-block mt-3 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-bold hover:bg-cyan-500/30 transition-all">
              <i class="fas fa-plus mr-1"></i> Crear primer efecto
            </a>`,
    }).toString(),
  },
  {
    name: 'notifications-empty-dashed-block',
    wrapper: block,
    before: `
      <div class="text-center text-gray-500 py-16 bg-white/5 rounded-3xl border border-dashed border-white/10">
        <i class="fas fa-bell-slash text-4xl text-gray-600 mb-3"></i>
        <p>No tenés notificaciones todavía</p>
      </div>`,
    after: () => UI.EmptyState({ icon: 'fas fa-bell-slash', message: 'No tenés notificaciones todavía', accent: 'neutral', size: 'sm', surface: 'dashed', layout: 'block' }).toString(),
  },
  {
    name: 'notifications-error-danger',
    wrapper: block,
    before: `
        <div class="text-center text-gray-500 py-10">
          <i class="fas fa-exclamation-circle text-3xl text-red-400/50 mb-3"></i>
          <p>Error al cargar notificaciones</p>
        </div>`,
    after: () => UI.EmptyState({ icon: 'fas fa-exclamation-circle', message: 'Error al cargar notificaciones', accent: 'danger', size: 'sm', iconSize: 'sm', layout: 'block' }).toString(),
  },
  {
    name: 'tickets-empty-md-faded',
    wrapper: block,
    before: `<div id="no-tickets" class="py-12 text-center text-gray-500">
          <i class="fas fa-ticket-alt text-4xl mb-4 opacity-30"></i>
          <p>No hay entradas</p>
        </div>`,
    after: () => UI.EmptyState({ id: 'no-tickets', icon: 'fas fa-ticket-alt', message: 'No hay entradas', accent: 'faded', size: 'md', layout: 'block' }).toString(),
  },
  {
    // El original arranca con `hidden`; este caso lo mantiene tal cual.
    name: 'tickets-empty-hidden',
    wrapper: block,
    before: `<div id="no-tickets" class="hidden py-12 text-center text-gray-500">
          <i class="fas fa-ticket-alt text-4xl mb-4 opacity-30"></i>
          <p>No hay entradas todavía</p>
        </div>`,
    after: () => UI.EmptyState({ id: 'no-tickets', icon: 'fas fa-ticket-alt', message: 'No hay entradas todavía', accent: 'faded', size: 'md', layout: 'block', className: 'hidden' }).toString(),
  },

  // --- ErrorState: variantes nuevas ---
  {
    name: 'eventos-error-plain',
    before: `<div class="col-span-full py-20 text-center text-red-400">Error cargando eventos</div>`,
    after: () => UI.ErrorState({ message: 'Error cargando eventos', variant: 'plain' }).toString(),
  },
  {
    name: 'index-feed-error-stacked',
    before: `<div class="col-span-full text-center text-red-500 py-10">
      <i class="fas fa-exclamation-triangle mb-2"></i><br>
      Error cargando el feed. Intenta recargar la página.
    </div>`,
    after: () => UI.ErrorState({ message: 'Error cargando el feed. Intenta recargar la página.', variant: 'stacked' }).toString(),
  },

  // --- StatusText ---
  {
    name: 'status-comments',
    wrapper: block,
    before: `<div class="text-center py-10 text-gray-600 italic">No hay comentarios aún.</div>`,
    after: () => UI.StatusText({ variant: 'comments', message: 'No hay comentarios aún.' }).toString(),
  },
  {
    // post.html tenía el texto entre saltos de línea dentro del <div>. En un
    // bloque ese espacio inicial y final colapsa (los píxeles no cambian, se
    // verificó con el literal), pero el comparador mira `textContent` tal
    // cual, así que el `before` va con el texto recortado.
    name: 'status-comments-post',
    wrapper: block,
    before: `
                      <div class="text-center py-10 text-gray-600 italic">No hay comentarios aún. ¡Sé el primero!</div>
                    `,
    after: () => UI.StatusText({ variant: 'comments', message: 'No hay comentarios aún. ¡Sé el primero!' }).toString(),
  },
  {
    name: 'status-notice',
    wrapper: block,
    before: `<div class="text-center py-20">Obra no encontrada</div>`,
    after: () => UI.StatusText({ variant: 'notice', message: 'Obra no encontrada' }).toString(),
  },
  {
    name: 'status-sidebar',
    wrapper: sidebar,
    before: `<div class="text-center text-gray-500 py-8 text-sm">No hay salas aún. ¡Crea la primera!</div>`,
    after: () => UI.StatusText({ variant: 'sidebar', message: 'No hay salas aún. ¡Crea la primera!' }).toString(),
  },
  {
    name: 'status-sidebar-error',
    wrapper: sidebar,
    before: `<div class="text-center text-red-400 py-4 text-sm">Error cargando salas</div>`,
    after: () => UI.StatusText({ variant: 'sidebar-error', message: 'Error cargando salas' }).toString(),
  },
  {
    name: 'status-thread-loading',
    wrapper: block,
    before: `<div class="text-center text-gray-500 py-4"><i class="fas fa-spinner fa-spin mr-2"></i>Cargando mensajes...</div>`,
    after: () => UI.StatusText({ variant: 'thread-loading', message: 'Cargando mensajes...' }).toString(),
  },
  {
    name: 'status-thread-error',
    wrapper: block,
    before: `<div class="text-center text-red-400 py-4">Error cargando mensajes</div>`,
    after: () => UI.StatusText({ variant: 'thread-error', message: 'Error cargando mensajes' }).toString(),
  },
  {
    name: 'status-dropdown',
    wrapper: sidebar,
    before: `<div class="p-4 text-center text-xs text-gray-400">No se encontraron usuarios</div>`,
    after: () => UI.StatusText({ variant: 'dropdown', message: 'No se encontraron usuarios' }).toString(),
  },
  {
    name: 'status-dropdown-loading',
    wrapper: sidebar,
    before: `<div class="p-4 text-xs text-gray-400 flex items-center gap-2">
      <i class="fas fa-spinner fa-spin text-cyan-500"></i> Buscando...
    </div>`,
    after: () => UI.StatusText({ variant: 'dropdown-loading', message: 'Buscando...' }).toString(),
  },
  {
    name: 'status-grid-error',
    wrapper: '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4" style="width:800px">{}</div>',
    before: `<div class="col-span-full text-center text-red-500">Error al cargar artistas</div>`,
    after: () => UI.StatusText({ variant: 'grid-error', message: 'Error al cargar artistas' }).toString(),
  },
  {
    name: 'status-result-loading',
    wrapper: block,
    before: `<p class="text-white"><i class="fas fa-spinner fa-spin mr-2"></i>Buscando contenido fresco...</p>`,
    after: () => UI.StatusText({ variant: 'result-loading', message: 'Buscando contenido fresco...' }).toString(),
  },
  {
    name: 'status-result-error',
    wrapper: block,
    before: `<div class="text-red-400"><i class="fas fa-exclamation-triangle mr-2"></i>Error: Error en el servidor</div>`,
    after: () => UI.StatusText({ variant: 'result-error', message: 'Error: ' + 'Error en el servidor' }).toString(),
  },
  {
    name: 'status-note',
    wrapper: block,
    before: `<p class="text-center text-gray-500">Error cargando inscripciones.</p>`,
    after: () => UI.StatusText({ variant: 'note', message: 'Error cargando inscripciones.' }).toString(),
  },
  {
    name: 'status-note-spaced',
    wrapper: block,
    before: `<p class="text-center text-gray-500 py-10">Error al cargar las postulaciones.</p>`,
    after: () => UI.StatusText({ variant: 'note-spaced', message: 'Error al cargar las postulaciones.' }).toString(),
  },
  {
    name: 'status-caption',
    wrapper: '<div class="space-y-2" style="width:600px">{}</div>',
    before: `<p class="text-gray-600 italic text-sm">Cargando...</p>`,
    after: () => UI.StatusText({ variant: 'caption', message: 'Cargando...' }).toString(),
  },
  {
    name: 'status-caption-soft',
    wrapper: block,
    before: `<p class="text-gray-500 text-sm italic">No hay usuarios de puerta asignados</p>`,
    after: () => UI.StatusText({ variant: 'caption-soft', message: 'No hay usuarios de puerta asignados' }).toString(),
  },
  {
    name: 'status-error-line',
    wrapper: block,
    before: `<p class="text-red-500 text-center">Error al buscar</p>`,
    after: () => UI.StatusText({ variant: 'error-line', message: 'Error al buscar' }).toString(),
  },
  {
    name: 'status-error-caption',
    wrapper: block,
    before: `<p class="text-red-400 text-sm">Error cargando QR</p>`,
    after: () => UI.StatusText({ variant: 'error-caption', message: 'Error cargando QR' }).toString(),
  },
].map((c) => ({ wrapper: grid, scripts, ...c }));
