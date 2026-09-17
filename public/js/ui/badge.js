// Badges (chips de tipo, estado y conteo) y contadores de likes/comentarios.
//
//   UI.TypeBadge({ label: r.type, icon: 'fas fa-code', tone: 'fuchsia' })
//   UI.StatusBadge({ label: insc.estado, tone: 'yellow', size: 'lg' })   // size: sm·lg
//   UI.CountBadge({ icon: 'fas fa-palette', count: 3, label: 'OBRAS' })
//   UI.Stats({ likes: p.likes?.length || 0, comments: p.comments?.length || 0 })
//   UI.Stat({ kind: 'comments', count: r.comments?.length || 0 })
//
// Para un elemento estático al que el JS le asigna las clases:
//   badge.className = UI.badgeClass({ variant: 'type-lg', tone: color });
//
// Primitivas en src/styles/components/badge.css. Requiere js/ui/core.js.
(function () {
  const { html, cx } = UI;

  const VARIANT = {
    type: 'ui-badge--type',
    'type-lg': 'ui-badge--type-lg',
    status: 'ui-badge--status',
    'status-lg': 'ui-badge--status-lg',
    count: 'ui-badge--count',
  };

  const TONE = {
    cyan: 'ui-badge--cyan',
    emerald: 'ui-badge--emerald',
    fuchsia: 'ui-badge--fuchsia',
    gray: 'ui-badge--gray',
    green: 'ui-badge--green',
    magenta: 'ui-badge--magenta',
    orange: 'ui-badge--orange',
    red: 'ui-badge--red',
    yellow: 'ui-badge--yellow',
  };

  function badgeClass({ variant, tone, className } = {}) {
    return cx('ui-badge', VARIANT[variant], TONE[tone], className);
  }

  // Chip con ícono y tipo de contenido (tipo de recurso, tipo de oportunidad).
  // El ícono va pegado al texto: el espacio lo da su `mr-1`.
  function TypeBadge({ label, icon, tone, className } = {}) {
    return html`<span class="${badgeClass({ variant: 'type', tone, className })}"><i class="${cx(icon, 'mr-1')}"></i>${label}</span>`;
  }

  const STATUS_SIZE = { sm: 'status', lg: 'status-lg' };

  function StatusBadge({ label, tone, size = 'sm', className } = {}) {
    return html`<span class="${badgeClass({ variant: STATUS_SIZE[size], tone, className })}">${label}</span>`;
  }

  // `count-badge` toma sus colores de css/artistas.css.
  function CountBadge({ icon, count, label, className } = {}) {
    return html`<span class="${cx('count-badge', badgeClass({ variant: 'count' }), className)}"><i class="${cx(icon, 'text-[9px]')}"></i> ${count} ${label}</span>`;
  }

  const STAT_ICON = {
    likes: 'fas fa-heart mr-1',
    comments: 'fas fa-comment mr-1',
  };

  // Contador suelto: hereda tamaño y color del contenedor.
  function Stat({ kind, count } = {}) {
    return html`<span><i class="${STAT_ICON[kind]}"></i>${count}</span>`;
  }

  function Stats({ likes, comments } = {}) {
    return html`${Stat({ kind: 'likes', count: likes })}${Stat({ kind: 'comments', count: comments })}`;
  }

  Object.assign(UI, { badgeClass, TypeBadge, StatusBadge, CountBadge, Stat, Stats });
})();
