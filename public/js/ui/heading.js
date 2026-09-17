// Tipografía: encabezado de página (ícono + título + bajada). Los títulos
// sueltos y los eyebrows son primitivas CSS (`ui-title--*`, `ui-eyebrow--*`,
// ver src/styles/components/heading.css).
//
// Devuelve el h1 y el párrafo; el contenedor queda en la página porque cada
// una lo ubica distinto (sección con margen, columna de un flex).
//
//   <section id="page-header" class="mb-10"></section>
//   <script>
//     document.getElementById('page-header').innerHTML = UI.PageHeader({
//       icon: 'fas fa-palette', title: 'Galería de Obras', subtitle: 'Explorá el talento…',
//     });
//   </script>
//
//   UI.PageHeader({ icon: 'fas fa-shield-alt', title: 'Panel de Control', subtitle: '…', size: 'sm' });
//
// Requiere js/ui/core.js.
(function () {
  const { html, cx } = UI;

  // Clases completas (no interpoladas) para que el scanner de Tailwind las vea.
  // `magenta-500` no existe en la paleta de Tailwind: no genera CSS y el ícono
  // queda blanco. Se conserva tal cual para no cambiar el render en fase 1.
  const ICON_ACCENT = {
    cyan: 'text-[var(--color-cyan)]',
    magenta: 'text-[var(--color-magenta)]',
    'magenta-500': 'text-magenta-500',
  };

  // El espaciado entre título y bajada viaja con el tamaño: las páginas de
  // listado separan con el margen del h1, los paneles con el del párrafo.
  const SIZE = {
    lg: { title: 'ui-title ui-title--page-lg mb-2', subtitle: 'text-gray-400' },
    md: { title: 'ui-title ui-title--page mb-2', subtitle: 'text-gray-400' },
    sm: { title: 'ui-title ui-title--page-sm', subtitle: 'text-gray-400 mt-1' },
  };

  function PageHeader({ icon, title, subtitle, accent = 'cyan', size = 'md' } = {}) {
    const s = SIZE[size];
    return html`<h1 class="${s.title}">${icon && html`<i class="${cx(icon, ICON_ACCENT[accent], 'mr-2')}"></i>`}${title}</h1>
      ${subtitle && html`<p class="${s.subtitle}">${subtitle}</p>`}`;
  }

  Object.assign(UI, { PageHeader });
})();
