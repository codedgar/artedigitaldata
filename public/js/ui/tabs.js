// Tabs y barras de filtros: el markup de los ítems y el estado activo/inactivo.
//
//   Barra estática: el contenedor queda en el HTML con su primitiva y el
//   <script> se reemplaza por los botones.
//     <div class="ui-tabs--underline mb-8 overflow-x-auto scrollbar-hide">
//       <script>document.currentScript.outerHTML = UI.Tabs({ variant: 'underline', onSelect: 'switchTab', idPrefix: 'tab-', active: 'posts', items: [...] });</script>
//     </div>
//
//   Al cambiar de tab, la página llama al helper en vez de listar clases:
//     UI.setActiveTab(document.querySelectorAll('.tab-btn'), document.getElementById('tab-' + tab), 'underline');
//
// Variantes: underline (profile) · pill (admin) · split (chat) · filter
// (recursos) · filter-pill (oportunidades) · choice (crear-oportunidad, con
// UI.ChoiceCards) · switch (interruptores del feed).
//
// Requiere js/ui/core.js.
(function () {
  const { html, cx } = UI;

  // Clases que el JS de cada página agregaba (active) y quitaba (inactive) al
  // cambiar de ítem. Quedan como utilidades en el elemento, no en primitivas.
  // Reproducen bugs conocidos a propósito (ver docs/componentes.md):
  // - underline: `border-primary-500` no existe y `border-b-2` no se mueve,
  //   así que el subrayado queda en la tab que arrancó activa.
  // - filter: no toca `active` ni `hover:bg-cyan-500/30`, que se quedan en
  //   el primer filtro.
  // - pill: no agrega `hover:text-white`, así que la primera tab no lo tiene.
  const TAB_STATE = {
    underline: { active: ['active', 'text-[var(--color-cyan)]', 'border-primary-500'], inactive: ['text-gray-500'] },
    pill: { active: ['bg-cyan-500', 'text-black'], inactive: ['text-gray-400'] },
    split: { active: ['border-cyan-500', 'text-cyan-500'], inactive: ['border-transparent', 'text-gray-500'] },
    filter: { active: ['bg-cyan-500/20', 'text-[var(--color-cyan)]', 'border-cyan-500/30'], inactive: ['bg-white/5', 'text-gray-400', 'border-white/10'] },
    'filter-pill': { active: ['border-emerald-500/30', 'bg-emerald-500/10', 'text-emerald-400'], inactive: ['border-white/10', 'bg-white/5', 'text-gray-500'] },
    choice: { active: ['border-emerald-500/50', 'bg-emerald-500/10', 'ring-2', 'ring-emerald-500/30'], inactive: ['border-white/10', 'bg-white/5'] },
    switch: { active: ['active'], inactive: [] },
  };

  // Markup inicial de cada variante. `hook` es la clase que busca el JS de la
  // página (`.tab-btn`, `.filter-btn`) y `hookActive` la que marca el ítem
  // inicial. `active`/`inactive` no coinciden con TAB_STATE: el markup
  // original traía clases que el toggle nunca vuelve a poner (`border-b-2`,
  // `hover:text-white`, `hover:bg-cyan-500/30`).
  const TAB_VARIANT = {
    underline: {
      hook: 'tab-btn', hookActive: 'active', item: 'ui-btn ui-btn--tab-underline', iconGap: 'mr-2',
      active: 'text-[var(--color-cyan)] border-b-2 border-primary-500', inactive: 'text-gray-500 hover:text-white',
    },
    pill: {
      hook: 'tab-btn', item: 'ui-btn ui-btn--tab-pill', iconGap: 'text-xs',
      active: 'bg-cyan-500 text-black', inactive: 'text-gray-400 hover:text-white',
    },
    split: {
      item: 'flex-1 ui-btn ui-btn--tab-split',
      active: 'border-cyan-500 text-cyan-500', inactive: 'border-transparent text-gray-500 hover:text-white',
    },
    filter: {
      hook: 'filter-btn', hookActive: 'active', item: 'ui-btn ui-btn--filter',
      active: 'bg-cyan-500/20 text-[var(--color-cyan)] border-cyan-500/30 hover:bg-cyan-500/30', inactive: 'bg-white/5 text-gray-400 border-white/10',
    },
    'filter-pill': {
      hook: 'filter-btn', item: 'ui-btn ui-btn--filter-pill', iconGap: 'mr-2',
      active: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400', inactive: 'border-white/10 bg-white/5 text-gray-500',
    },
  };

  const ICON_ACCENT = {
    yellow: 'text-yellow-500',
    'yellow-soft': 'text-yellow-400',
    red: 'text-red-500',
    fuchsia: 'text-fuchsia-500',
    cyan: 'text-cyan-400',
  };

  // Borde al hover de cada filtro de `filter-pill`. `magenta` no existe en la
  // paleta de Tailwind: `hover:border-magenta-500/50` nunca generó CSS.
  const FILTER_HOVER = {
    emerald: 'hover:border-emerald-500/60',
    cyan: 'hover:border-cyan-500/50',
    orange: 'hover:border-orange-500/50',
    magenta: '',
  };

  // Ítems de una barra de tabs o filtros (sin el contenedor, que queda en el
  // HTML con `ui-tabs--*` o sus utilidades).
  //   items: [{ key, label, icon, iconAccent, labelId, badgeId, accent, hidden, className }]
  //   onSelect: nombre de la función global que recibe la key (`switchTab`).
  //   idPrefix: si está, cada botón lleva id `${idPrefix}${key}`.
  // `key` e `idPrefix` son constantes de la página, nunca texto de usuario:
  // terminan dentro de un `onclick`.
  function Tabs({ variant, items, active, onSelect, idPrefix } = {}) {
    const v = TAB_VARIANT[variant];
    return html`${items.map((it) => {
      const on = it.key === active;
      const cls = cx(v.hook, it.hidden && 'hidden', on && v.hookActive, it.className, v.item, on ? v.active : v.inactive, FILTER_HOVER[it.accent]);
      const icon = it.icon && html`<i class="${cx(it.icon, v.iconGap, ICON_ACCENT[it.iconAccent])}"></i>`;
      const label = it.labelId ? html`<span id="${it.labelId}">${it.label}</span>` : it.label;
      // El espacio antes del contador es parte del render cuando se muestra.
      const badge = it.badgeId && html` <span id="${it.badgeId}" class="hidden ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black"></span>`;
      return html`<button onclick="${onSelect}('${it.key}')"${idPrefix && html` id="${idPrefix}${it.key}"`} class="${cls}">${icon}${label}${badge}</button>`;
    })}`;
  }

  // Colores de la tarjeta de opción: borde/fondo al hover y la caja del ícono.
  // `magenta` no existe en la paleta: su hover, su caja y su ícono nunca
  // tuvieron color (la caja conserva sólo el ancho de `border`).
  const CHOICE_ACCENT = {
    cyan: { hover: 'hover:border-cyan-500/50 hover:bg-cyan-500/5', box: 'bg-cyan-500/10 border border-cyan-500/20', icon: 'text-cyan-400' },
    orange: { hover: 'hover:border-orange-500/50 hover:bg-orange-500/5', box: 'bg-orange-500/10 border border-orange-500/20', icon: 'text-orange-400' },
    magenta: { hover: '', box: 'border', icon: '' },
  };

  // Selector de tipo en tarjetas grandes (un solo elegido, sin elegido al
  // cargar). Hook `.tipo-btn`, id `btn-${key}`.
  //   items: [{ key, label, hint, icon, accent }]
  function ChoiceCards({ items, onSelect } = {}) {
    return html`${items.map((it) => {
      const a = CHOICE_ACCENT[it.accent];
      return html`<button onclick="${onSelect}('${it.key}')" id="btn-${it.key}" class="${cx('tipo-btn group ui-btn ui-btn--choice-card border-white/10 bg-white/5', a.hover)}"><div class="${cx('w-14 h-14 mx-auto mb-4 rounded-2xl', a.box, 'flex items-center justify-center group-hover:scale-110 transition-transform')}"><i class="${cx(it.icon, 'text-2xl', a.icon)}"></i></div><h3 class="ui-title ui-title--tile-sm">${it.label}</h3><p class="text-xs text-gray-500 mt-1">${it.hint}</p></button>`;
    })}`;
  }

  // Botón Humano/IA del feed: cambia todo el className, el ícono y el title.
  const HUMAN_AI = {
    human: {
      className: 'w-9 h-9 rounded-xl border border-emerald-500/40 bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-all hover:scale-105 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0',
      icon: '<i class="fas fa-user text-sm"></i>',
      title: 'Mostrando contenido Humano (Click para cambiar a IA)',
    },
    bots: {
      className: 'w-9 h-9 rounded-xl border border-purple-500/40 bg-purple-500/20 text-purple-400 flex items-center justify-center transition-all hover:scale-105 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0',
      icon: '<i class="fas fa-robot text-sm"></i>',
      title: 'Mostrando contenido IA (Click para cambiar a Humanos)',
    },
  };

  function HumanAIToggle({ botsOnly = false } = {}) {
    const s = HUMAN_AI[botsOnly ? 'bots' : 'human'];
    return html`<button onclick="toggleHumanAI()" id="filter-human-ai" class="${s.className}" title="${s.title}">${UI.raw(s.icon)}</button>`;
  }

  // ── Helpers de DOM ──
  // Lo único de este archivo que no es puro: cambian clases de elementos que
  // ya están en la página. Hacen exactamente la misma secuencia de
  // classList.remove/add que tenía cada página, así que el `class` resultante
  // (orden incluido) no cambia.

  // Un solo ítem activo: desactiva todos y activa `activeEl` (si es null,
  // sólo desactiva, como el reset de crear-oportunidad).
  function setActiveTab(buttons, activeEl, variant) {
    const { active, inactive } = TAB_STATE[variant];
    buttons.forEach((b) => {
      b.classList.remove(...active);
      b.classList.add(...inactive);
    });
    if (activeEl) {
      activeEl.classList.add(...active);
      activeEl.classList.remove(...inactive);
    }
  }

  // Ítems independientes (varios activos a la vez), uno por llamada.
  function setTabState(btn, on, variant) {
    const { active, inactive } = TAB_STATE[variant];
    btn.classList.remove(...active);
    btn.classList.add(...inactive);
    if (on) {
      btn.classList.add(...active);
      btn.classList.remove(...inactive);
    }
  }

  function setHumanAIToggle(btn, botsOnly) {
    const s = HUMAN_AI[botsOnly ? 'bots' : 'human'];
    btn.innerHTML = s.icon;
    btn.className = s.className;
    btn.title = s.title;
  }

  Object.assign(UI, { Tabs, ChoiceCards, HumanAIToggle, setActiveTab, setTabState, setHumanAIToggle });
})();
