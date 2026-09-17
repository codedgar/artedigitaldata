// Estados de un contenedor que carga datos: cargando, vacío y error.
// Por defecto ocupan todas las columnas de una grilla (`col-span-full`); con
// `layout: 'block'` sirven para listas que no son grilla.
//
//   container.innerHTML = UI.LoadingState({ message: 'Cargando arte...', accent: 'orange' });
//   container.innerHTML = UI.LoadingState({ message: 'Cargando entradas...', accent: 'fuchsia', size: 'md', layout: 'block' });
//   container.innerHTML = UI.LoadingText({ message: 'Cargando recursos...' });
//   container.innerHTML = UI.EmptyState({ icon: 'fas fa-image', message: 'Aún no hay obras publicadas' });
//   container.innerHTML = UI.EmptyState({ icon: 'fas fa-box-open', message: '…', accent: 'orange', size: 'sm' });
//   container.innerHTML = UI.EmptyState({ icon: 'fas fa-search', message: '…', accent: 'ghost', iconSize: 'md', surface: 'dashed' });
//   container.innerHTML = UI.ErrorState({ message: 'Error cargando obras' });
//   container.innerHTML = UI.ErrorState({ message: 'Error cargando eventos', variant: 'plain' });
//
// Carga de una página de detalle (el bloque `#loading` que se oculta al llegar
// los datos). En HTML estático se reemplaza el propio <script> para que el
// elemento quede en el mismo lugar y con su id antes de que corra la página:
//
//   <script>document.currentScript.outerHTML = UI.PageLoader({ id: 'loading', message: 'Cargando recurso...', accent: 'cyan-deep' });</script>
//
// Mensajes de una sola línea (listas del chat, comentarios, notas):
//
//   list.innerHTML = UI.StatusText({ variant: 'sidebar', message: 'No hay salas aún. ¡Crea la primera!' });
//
// Requiere js/ui/core.js.
(function () {
  const { html, cx } = UI;

  // Clases completas (no interpoladas) para que el scanner de Tailwind las vea.
  // `magenta` no existe en la paleta de Tailwind: `text-magenta-400` nunca
  // generó CSS y el ícono hereda el color del contenedor. Se reproduce eso.
  const SPINNER_ACCENT = {
    cyan: 'text-cyan-400',
    'cyan-deep': 'text-cyan-500',
    brand: 'text-[var(--color-cyan)]',
    orange: 'text-orange-400',
    emerald: 'text-emerald-400',
    fuchsia: 'text-fuchsia-400',
    yellow: 'text-yellow-400',
    magenta: '',
  };
  // Ícono de los estados vacíos: color tenue u opacidad sobre el gris heredado.
  const EMPTY_ACCENT = {
    cyan: 'text-cyan-400/30',
    emerald: 'text-emerald-400/30',
    fuchsia: 'text-fuchsia-400/30',
    orange: 'text-orange-400/30',
    yellow: 'text-yellow-500/20',
    magenta: '',
    neutral: 'text-gray-600',
    ghost: 'opacity-20',
    faded: 'opacity-30',
    danger: 'text-red-400/50',
  };

  const LAYOUT = {
    grid: 'col-span-full',
    block: '',
  };

  const LOADING_SIZE = {
    md: { box: 'py-10', spinner: 'text-2xl mb-3' },
    lg: { box: 'py-20', spinner: 'text-3xl mb-4' },
    xl: { box: 'py-20', spinner: 'text-4xl mb-4' },
  };

  function LoadingState({ message, accent = 'cyan', size = 'lg', layout = 'grid', className } = {}) {
    const s = LOADING_SIZE[size];
    return html`
      <div class="${cx(LAYOUT[layout], 'text-center text-gray-500', s.box, className)}">
        <i class="${cx('fas fa-spinner fa-spin', s.spinner, SPINNER_ACCENT[accent])}"></i>
        <p>${message}</p>
      </div>`;
  }

  // Estado de carga sin spinner: sólo el texto.
  function LoadingText({ message, className } = {}) {
    return html`
      <div class="${cx('col-span-full text-center text-gray-500 py-10', className)}">
        <p>${message}</p>
      </div>`;
  }

  // Color del mensaje bajo el spinner de página.
  const PAGE_TONE = {
    muted: 'text-gray-500',
    soft: 'text-gray-400',
  };

  // Carga de página completa: sin color en la caja, el spinner magenta hereda
  // el del body (distinto del gris de LoadingState).
  function PageLoader({ id, message, accent = 'magenta', tone = 'muted', className } = {}) {
    return html`
      <div${id && html` id="${id}"`} class="${cx('py-20 text-center', className)}">
        <i class="${cx('fas fa-spinner fa-spin text-4xl mb-4', SPINNER_ACCENT[accent])}"></i>
        <p class="${PAGE_TONE[tone]}">${message}</p>
      </div>`;
  }

  // Padding de la caja, margen del ícono y tamaño del mensaje van juntos.
  // `surface: 'dashed'` es un panel con fondo y borde punteado, más alto.
  const EMPTY_SIZE = {
    sm: { plain: 'py-10', dashed: 'py-16', icon: 'mb-3', message: '', iconSize: 'md' },
    md: { plain: 'py-12', icon: 'mb-4', message: '', iconSize: 'md' },
    lg: { plain: 'py-20', dashed: 'py-20 px-8', icon: 'mb-4', message: 'text-xl', iconSize: 'lg' },
  };
  const EMPTY_SURFACE = {
    plain: '',
    dashed: 'bg-white/5 rounded-3xl border border-dashed border-white/10',
  };
  const ICON_SIZE = {
    sm: 'text-3xl',
    md: 'text-4xl',
    lg: 'text-5xl',
    xl: 'text-6xl',
  };

  // `action` es markup ya armado con UI.html (un link para salir del vacío).
  function EmptyState({ id, icon, message, hint, action, accent = 'cyan', size = 'lg', iconSize, surface = 'plain', layout = 'grid', className } = {}) {
    const s = EMPTY_SIZE[size];
    return html`
      <div${id && html` id="${id}"`} class="${cx(LAYOUT[layout], 'text-center text-gray-500', s[surface], EMPTY_SURFACE[surface], className)}">
        <i class="${cx(icon, ICON_SIZE[iconSize || s.iconSize], s.icon, EMPTY_ACCENT[accent])}"></i>
        <p${s.message && html` class="${s.message}"`}>${message}</p>
        ${hint && html`<p class="text-sm mt-2">${hint}</p>`}
        ${action}
      </div>`;
  }

  // inline: ícono pegado al texto (un espacio entre ambos correría el mensaje).
  // plain: sólo texto, más alto. stacked: ícono en su propia línea.
  function ErrorState({ message, variant = 'inline', className } = {}) {
    if (variant === 'plain') {
      return html`<div class="${cx('col-span-full text-center text-red-400 py-20', className)}">${message}</div>`;
    }
    if (variant === 'stacked') {
      return html`<div class="${cx('col-span-full text-center text-red-500 py-10', className)}"><i class="fas fa-exclamation-triangle mb-2"></i><br>${message}</div>`;
    }
    return html`<div class="${cx('col-span-full text-center text-red-400 py-10', className)}"><i class="fas fa-exclamation-triangle mr-2"></i>${message}</div>`;
  }

  // Mensajes de una línea. Cada variante es la combinación exacta de etiqueta
  // y clases que tenía su página (fase 1: no se unifican).
  const STATUS_TEXT = {
    comments: { tag: 'div', box: 'text-center py-10 text-gray-600 italic' },
    notice: { tag: 'div', box: 'text-center py-20' },
    sidebar: { tag: 'div', box: 'text-center text-gray-500 py-8 text-sm' },
    'sidebar-error': { tag: 'div', box: 'text-center text-red-400 py-4 text-sm' },
    'thread-loading': { tag: 'div', box: 'text-center text-gray-500 py-4', icon: 'fas fa-spinner fa-spin mr-2' },
    'thread-error': { tag: 'div', box: 'text-center text-red-400 py-4' },
    dropdown: { tag: 'div', box: 'p-4 text-center text-xs text-gray-400' },
    'dropdown-loading': { tag: 'div', box: 'p-4 text-xs text-gray-400 flex items-center gap-2', icon: 'fas fa-spinner fa-spin text-cyan-500' },
    'grid-error': { tag: 'div', box: 'col-span-full text-center text-red-500' },
    'result-loading': { tag: 'p', box: 'text-white', icon: 'fas fa-spinner fa-spin mr-2' },
    'result-error': { tag: 'div', box: 'text-red-400', icon: 'fas fa-exclamation-triangle mr-2' },
    note: { tag: 'p', box: 'text-center text-gray-500' },
    'note-spaced': { tag: 'p', box: 'text-center text-gray-500 py-10' },
    caption: { tag: 'p', box: 'text-gray-600 italic text-sm' },
    'caption-soft': { tag: 'p', box: 'text-gray-500 text-sm italic' },
    'error-line': { tag: 'p', box: 'text-red-500 text-center' },
    'error-caption': { tag: 'p', box: 'text-red-400 text-sm' },
  };

  function StatusText({ message, variant, className } = {}) {
    const v = STATUS_TEXT[variant];
    const icon = v.icon && html`<i class="${v.icon}"></i>`;
    if (v.tag === 'p') return html`<p class="${cx(v.box, className)}">${icon}${message}</p>`;
    return html`<div class="${cx(v.box, className)}">${icon}${message}</div>`;
  }

  Object.assign(UI, { LoadingState, LoadingText, PageLoader, EmptyState, ErrorState, StatusText });
})();
