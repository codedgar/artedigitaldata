# Librería de componentes

El front se armó página por página copiando markup: hay 162 combinaciones
distintas de clases en `<button>`, ~20 estilos de `<h1>`, 31 de inputs, y la
misma tarjeta de obra escrita a mano en obras, perfil, búsqueda y feed. Esta
librería es el lugar único de donde salen tipografía, colores, botones,
tarjetas, estados y modales, para que un cambio en un componente llegue a todas
las páginas y las secciones nuevas se armen con piezas existentes.

## Fases

**Fase 1 — extracción (la actual). El render no cambia ni un píxel.**
Cada variante que existe hoy se reproduce exacta. Si dos botones "iguales"
difieren en `py-2` vs `py-2.5`, son dos variantes. No se unifica nada.

**Fase 2 — consolidación.** Con todo el markup ya centralizado, se reducen
las variantes a propósito (p. ej. 162 botones → ~5), revisando cada cambio
visual con el harness. Nada de esto se hace en fase 1.

---

## Arquitectura

```
src/styles/tokens.css            1. Tokens     variables CSS: color, tipografía, radios, sombras
src/styles/components/<x>.css    2. Primitivas clases CSS `ui-*` (botón, input, badge, superficie, texto)
public/js/ui/<x>.js              3. Componentes funciones `UI.Nombre(props)` que devuelven HTML
public/*.html (script inline)    4. Páginas    datos + composición de componentes
```

Cada nivel sólo usa los de arriba. Una página no define estilos de botón; un
componente no hace `fetch`.

### ¿Primitiva CSS o componente JS?

| Si el elemento… | Es… | Ejemplo |
|---|---|---|
| es un solo elemento con estilos (y quizá estados hover/focus/disabled) y aparece en HTML estático | **primitiva** `ui-*` | `<button class="ui-btn ui-btn--primary">` |
| tiene estructura (varios elementos, íconos, partes opcionales) o recibe datos | **componente** `UI.X()` | `UI.PostCard(post)`, `UI.EmptyState({...})` |

Los componentes usan primitivas por dentro. Una primitiva nunca genera markup.

---

## Tokens — `src/styles/tokens.css`

Variables en `:root`, compiladas dentro de `css/tailwind.css`. Hoy contiene
lo que había en `style.css` (`--bg-base`, `--bg-surface`, `--color-cyan`,
`--color-magenta`, `--color-text`, `--color-text-dim`, `--gradient-neon`).

- Un color o valor que se repite en varias primitivas o componentes va acá.
- En fase 1 **no** se reemplazan utilidades de Tailwind por variables
  (`text-cyan-400` ≠ `--color-cyan`: son colores distintos).
- Fase 1 no agrega colores al `theme` de Tailwind.

## Primitivas CSS — `src/styles/components/<nombre>.css`

```css
/* src/styles/components/button.css */
@layer components {
  .ui-btn { @apply inline-flex items-center gap-2 transition-all; }
  .ui-btn--filter { @apply px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10; }
}
```

- Nombre BEM con prefijo `ui-`: bloque `ui-btn`, variante `ui-btn--primary`,
  parte `ui-card__body`, estado `is-active` (o el que ya use el JS de la página).
- Siempre dentro de `@layer components` y con `@apply` de las mismas
  utilidades que tenía el markup. Nada de CSS a mano salvo que la utilidad no
  exista.
- Cada familia ya tiene su archivo registrado en `src/styles/components/index.css`.
- Correr `npm run build:css` y commitear `public/css/tailwind.css`.
- Las utilidades sueltas en el elemento le ganan a la primitiva (están en una
  capa posterior). Usarlas sólo para layout (ver `className` abajo).
- Las clases legacy de `style.css` (`btn-primary`, `card-cyber`,
  `gradient-text`) siguen funcionando. En fase 1 se pueden *componer* dentro
  de una primitiva dejándolas en el markup, no se reescriben.

## Componentes JS — `public/js/ui/<nombre>.js`

Plantilla (ver `public/js/ui/state.js`, que es la referencia):

```js
// Qué es y dónde se usa, en una línea. Ejemplos de uso.
// Requiere js/ui/core.js.
(function () {
  const { html, cx } = UI;

  // Clases completas, nunca `text-${accent}-400`: el scanner de Tailwind no las ve.
  const ACCENT = { cyan: 'text-cyan-400', orange: 'text-orange-400' };

  function EmptyState({ icon, message, hint, accent = 'cyan', className } = {}) {
    return html`
      <div class="${cx('col-span-full text-center text-gray-500 py-20', className)}">
        <i class="${cx(icon, 'text-5xl mb-4', ACCENT[accent])}"></i>
        <p class="text-xl">${message}</p>
        ${hint && html`<p class="text-sm mt-2">${hint}</p>`}
      </div>`;
  }

  Object.assign(UI, { EmptyState });
})();
```

Reglas:

1. **Función pura**: recibe un objeto de props, devuelve el resultado de
   `UI.html`. Sin `fetch`, sin leer `localStorage`/`getUser()`, sin tocar el
   DOM, sin estado global. Lo que dependa de la sesión llega por props
   (`canEdit`, `isLiked`, `currentUserId`).
2. **Nombre** en PascalCase, colgado de `window.UI`. Archivo en kebab-case
   con el nombre de la familia (`card.js` → `UI.PostCard`, `UI.RecursoCard`).
   Un archivo JS y, si hace falta, un CSS con el mismo nombre.
3. **Props con nombre de rol, no de estilo**: `variant: 'filter'`,
   `size: 'md'`, `accent: 'emerald'`. Nunca `padding: 'py-2'`.
4. **`className`** existe sólo para ubicar el componente en su contenedor
   (margen, `col-span-*`, ancho, `hidden`). Si una página necesita otro color,
   tipografía o padding, eso es una variante nueva del componente.
5. **Variantes cerradas**: un mapa objeto → clases completas. Una variante que
   no existe devuelve `undefined` para esa clase; no inventar defaults
   silenciosos que tapen un error de tipeo.
6. **Eventos**: para markup nuevo, `data-*` + un listener delegado en la
   página. Los `onclick="fn('${id}')"` existentes se pueden conservar en fase 1
   **sólo con IDs de Mongo** (hex); nunca interpolar texto de usuario dentro de
   un atributo `on*` (escapar HTML no protege el contexto JS).
7. **Links internos**: en markup nuevo, rutas relativas sin `.html`
   (`post?id=…`, `profile?user=…`), como pide `CLAUDE.md`. Al migrar markup
   existente, el `href` se conserva tal cual (con `.html` o `CONFIG.BASE` si los
   tenía): cambiarlo es un cambio de comportamiento y queda para aparte (ver
   "Bugs encontrados").
8. **Accesibilidad mínima**: botón de sólo ícono con `aria-label`; `<img>`
   con `alt`; un modal con `role="dialog"` y `aria-modal="true"`. Agregar
   atributos ARIA no cambia el render, se permite en fase 1.

### `UI.html` — escapar es lo normal

`public/js/ui/core.js`. **Todo HTML armado en JS usa `UI.html`**, en
componentes y en los renderers de las páginas.

```js
UI.html`<h3>${post.title}</h3>`              // escapa title
UI.html`<ul>${items.map((i) => UI.html`<li>${i}</li>`)}</ul>`  // arrays y anidados: ok
UI.html`<p>${UI.raw(formatMentions(text))}</p>`   // HTML ya seguro: raw()
UI.html`${cond && UI.html`<b>x</b>`}`       // false/null/undefined no imprimen nada; 0 sí
UI.html`<a href="${userUrl}">`               // bloquea javascript:/data:/vbscript:
```

- `UI.raw()` **sólo** para strings que ya salen escapados de una función
  confiable (`formatMentions`, otro componente, un ícono fijo). Nunca para
  datos de la API.
- `href`/`src` con datos de usuario siguen pasando por `sanitizeUrl()` cuando
  hay que resolver la URL de una imagen del VPS; `UI.html` sólo corta los
  esquemas peligrosos, no reescribe rutas.
- `innerHTML = UI.html`…`` funciona directo (`toString()`).
- Escapar puede cambiar el render sólo si el dato contiene `< > & " '`. Si el
  harness muestra una diferencia por eso, es la corrección de seguridad
  esperada: documentarla en el reporte, no revertirla.

### Carga de scripts

Todas las páginas con Tailwind ya cargan **la librería completa** en el
`<head>`, justo antes de `</head>`: `js/config.js`, `js/ui/core.js` y un
`<script>` por familia (`avatar`, `badge`, `button`, `card`, `form`,
`heading`, `media`, `modal`, `state`, `tabs`), en orden alfabético. Las
familias todavía vacías son stubs.

- **No editar ese bloque** en fase 1. Una familia nueva se agrega en todas
  las páginas a la vez, en un commit propio.
- `config.js` ya no se carga al final del `<body>`.
- Los scripts de la librería no tocan el DOM al cargar, así que se pueden usar
  desde HTML estático:

```html
<div id="obras-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
<script>document.getElementById('obras-container').innerHTML = UI.LoadingState({ message: 'Cargando arte...' });</script>
```

Si el elemento tiene que existir con su `id` antes de que corra el JS de la
página (p. ej. un `#loading` que después se oculta), el `<script>` se
reemplaza a sí mismo; así no queda un hermano extra que altere `space-y-*`:

```html
<script>document.currentScript.outerHTML = UI.PageLoader({ id: 'loading', message: 'Cargando recurso...' });</script>
```

Un elemento suelto (un título, un botón) no necesita script: se escribe en el
HTML con su primitiva (`<h1 class="ui-title ui-title--page mb-2">`).

---

## Qué NO hacer en fase 1

- **No consolidar variantes** ni "arreglar" inconsistencias visuales. Anotarlas
  en el reporte para fase 2.
- **No extraer lo que aparece una sola vez** y no es una pieza reusable
  obvia (el sistema solar del feed, el loader con trofeo de concurso).
- **No tocar los archivos JS muertos.** Estos no los carga ninguna página
  (la lógica real está en `<script>` inline del HTML): `admin.js`,
  `calendario.js`, `chat.js`, `create.js`, `event-gallery.js`, `evento.js`,
  `eventos.js`, `forgot-password.js`, `login.js`, `obras.js`, `p5-global.js`,
  `post.js`, `profile.js`, `recurso.js`, `recursos.js`, `register.js`,
  `reset-password.js`. Editarlos no tiene efecto.
- **No tocar** las páginas de canvas/WebGL (`404`, `letrasgpu`, `outputeffect`,
  `particles`, `particulas`, `visualeffects`), ni `lettesGPU/`, `shaders/`.
- **No cambiar comportamiento**: mismas URLs, mismos IDs y clases que lee el JS
  (`filter-btn`, `tab-btn`, `video-overlay`…), mismo texto.
- **No reordenar** los `<link>` de CSS (ver `CLAUDE.md`).
- No agregar dependencias ni build de JS.

---

## Verificación — criterios de aceptación

Un componente migrado está terminado cuando se cumple **todo**:

1. **Harness de páginas en cero** para cada página tocada:
   ```bash
   HARNESS_PAGES=obras,recursos node tools/visual-harness/capture.js <label>
   HARNESS_PAGES=obras,recursos node tools/visual-harness/compare.js ref <label>
   ```
   `ref` es la captura de `HEAD` antes de empezar (ya existe en
   `snapshots/ref`). Cualquier píxel distinto se explica (p. ej. escape de un
   dato) o se corrige.
2. **Casos de fragmentos en verde** para todo lo que el harness no ve
   (estados de carga/vacío/error, modales abiertos, hover, vistas logueadas):
   `tools/visual-harness/cases/<componente>.js`, con el HTML `before` copiado
   **literal** de `git show 75d8386:public/<pagina>.html` (el commit previo a la
   migración), un caso por variante. El `before` se pinta con el `style.css` y
   `tailwind.css` de ese commit y el `after` con los actuales, así que una
   utilidad que la migración dejó de usar no rompe el caso.
   ```bash
   node tools/visual-harness/compare-fragments.js tools/visual-harness/cases/<componente>.js
   ```
   Compara píxeles y estilos computados de cada elemento. Ver `cases/state.js`.
3. **Sin markup duplicado**: `grep` del patrón original no encuentra más
   copias en las páginas asignadas (salvo las listadas como excepción).
4. **Sin errores nuevos en consola** (el harness los lista en `_meta.json`).
5. **`npm run build:css`** corrido y `public/css/tailwind.css` incluido.
6. **Catálogo actualizado** (tabla de abajo) con props y páginas que lo usan.
7. Reporte final con: componentes/variantes creados, páginas migradas,
   excepciones que no se migraron y por qué, inconsistencias para fase 2.

Limitaciones conocidas:

- El harness captura páginas sin sesión. Lo que sólo se ve logueado (botones
  de editar, admin) se verifica con fragmentos.
- `login`, `register`, `create`, `chat`, `event-tickets` y `crear-oportunidad`
  agotan el timeout de carga (redirección al SSO) tanto en `ref` como después:
  la captura de página de esas seis no prueba nada; dependen de los fragmentos.
- Los casos con `focus:` sobre selects (sombra difuminada de `select:focus`)
  pueden diferir 1-2 píxeles por 1-2 unidades RGB con estilos computados
  idénticos: es ruido de rasterizado del blur, no una regresión
  (`form.js` → `crear-oportunidad-tipos--focus-opovisibility`).
- `cases/_pages.js` es un helper compartido por `card.js`/`media.js`, no un
  archivo de casos.
- `capture.js` toma un candado global (`snapshots/.lock`): una sola captura a
  la vez en la máquina. Los fragmentos no lo toman.

---

## Catálogo

Fase 1 reproduce cada variante existente, así que hay variantes casi iguales a
propósito (ver "Fase 2" abajo).

### Núcleo y estados — JS

| Componente | Archivo | Props | Usado en |
|---|---|---|---|
| `UI.html`, `UI.raw`, `UI.cx` | `js/ui/core.js` | — | todas las migradas |
| `UI.LoadingState` | `js/ui/state.js` | `message`, `accent` (cyan·orange·emerald·fuchsia·yellow·magenta), `size` (md·lg·xl), `layout` (grid·block), `className` | obras, recursos, oportunidades, index, eventos, profile |
| `UI.LoadingText` | `js/ui/state.js` | `message`, `className` | profile |
| `UI.PageLoader` | `js/ui/state.js` | `id`, `message`, `accent` (magenta·cyan·cyan-deep·brand·emerald), `tone` (muted·soft), `className` | evento, event-tickets, oportunidad, recurso, postulantes, scan-redeem, ticket-purchase, ticket-success, post, search |
| `UI.EmptyState` | `js/ui/state.js` | `id`, `icon`, `message`, `hint`, `action`, `accent` (cyan·emerald·fuchsia·orange·yellow·magenta·neutral·ghost·faded·danger), `size` (sm·md·lg), `iconSize` (sm·md·lg·xl), `surface` (plain·dashed), `layout` (grid·block), `className` | obras, recursos, oportunidades, eventos, search, profile, admin-tickets, event-tickets, js/index.js, js/notifications.js |
| `UI.ErrorState` | `js/ui/state.js` | `message`, `variant` (inline·plain·stacked), `className` | obras, recursos, oportunidades, eventos, js/index.js |
| `UI.StatusText` | `js/ui/state.js` | `message`, `variant` (17: comments·notice·sidebar·sidebar-error·thread-loading·thread-error·dropdown·dropdown-loading·grid-error·result-loading·result-error·note·note-spaced·caption·caption-soft·error-line·error-caption), `className` | chat, admin, event-tickets, search, oportunidad, postulantes, evento, recurso, post, ticket-success, js/tagging.js |

### Tipografía

| Componente | Archivo | Props / variantes | Usado en |
|---|---|---|---|
| `UI.PageHeader` | `js/ui/heading.js` | `icon`, `title`, `subtitle`, `accent` (cyan·magenta·magenta-500), `size` (lg·md·sm) | obras, recursos, eventos, admin, admin-tickets |
| `.ui-title` + `--hero·hero-lg·page-lg·page·page-sm·page-xs·status·panel·panel-strong·section·section-strong·subsection·card·card-strong·card-sm·tile·tile-sm` | `styles/components/heading.css` | sólo tipografía; márgenes y layout quedan en el elemento | 30 páginas, js/index.js |
| `.ui-eyebrow` + `--stat·section·field·field-wide·micro` | `styles/components/heading.css` | — | admin, admin-tickets, calendario, event-tickets, evento, eventos, postulantes, profile, recurso, scan-redeem, ticket-success, js/header.js, js/forms.js |

### Botones — primitivas

`ui-btn` + una variante. Ubicación (`w-full`, `absolute top-4 right-4`, `mt-*`)
y las clases que cambia el JS (filtros, tabs) quedan como utilidades.

| Variantes | Archivo | Notas | Usado en |
|---|---|---|---|
| `--primary-sm·primary-lg·primary-block·primary-bold·primary-xl` (+ `--glow-cyan·glow-orange·glow-magenta`) | `styles/components/button.css` | junto a la clase legacy `btn-primary` | evento, post, recurso, login, register, forgot/reset-password, event-tickets, ticket-purchase, ticket-success, scan-redeem, create |
| `--outline·secondary-caps·success·video·map·ticket-cta·type-card` | ídem | — | event-tickets, admin-tickets, crear-oportunidad, oportunidad, scan-redeem, evento, recurso, profile, ticket-success, create |
| `--pager·pager-caps·icon-nav` | ídem | estado `disabled` | admin-tickets, concurso, calendario |
| `--close·close-sm·dismiss·back·icon-remove·chip-remove·icon-delete·icon-edit(-cyan·-orange)·comment-delete·link` | ídem | — | admin, evento, post, profile, recurso, ticket-purchase, event-tickets, chat, oportunidad, postulantes, crear-oportunidad, js/forms.js |
| `--row-view·row-edit·row-delete·row-delete-soft·row-subtle·option` | ídem | — | admin, admin-tickets, event-tickets |
| `--tool-icon·tool-text` | ídem | — | js/edit-logic.js |
| `--filter·tab-underline·tab-pill` | ídem | fondo/texto/borde activos siguen como utilidades | recursos, profile, admin |
| `--nav·menu` (+ `--accent-cyan·accent-magenta·accent-emerald`) | ídem | — | js/header.js |

### Formularios

| Componente | Archivo | Props / variantes | Usado en |
|---|---|---|---|
| `UI.Field` | `js/ui/form.js` | `label`, `variant` (caps·video·field·account·compact·eyebrow·signup), `hint`, `hintVariant` (field·caps), `children`, `id`, `className` | js/forms.js |
| `.ui-label` + `--caps·video·field·account·compact·eyebrow·signup` | `styles/components/form.css` | — | admin, event-tickets, ticket-purchase, forms.js, crear-oportunidad, oportunidad, login, register, forgot/reset-password, profile, formularioingreso, concurso |
| `.ui-input` / `.ui-select` / `.ui-textarea` + `--dark·soft·soft-muted·dense·compact·filter (select)·comment (textarea)·file (input)` | ídem | modificadores `--animated`, `--fixed`, `--focus-{cyan,orange,red,fuchsia,yellow,brand}`, `--focus-{cyan,orange,fuchsia,emerald}-soft`, `--file-{cyan,orange}` | admin, admin-tickets, event-tickets, ticket-purchase, forms.js, crear-oportunidad, oportunidad, create, login, register, forgot/reset-password, profile, evento, recurso, post, chat |
| `.ui-hint` (+ `--caps`) | ídem | — | forms.js, ticket-purchase |
| `.ui-checkbox` (+ `--sm·md`), `.ui-radio`, `.ui-choice` (+ `--pill`) | ídem | — | crear-oportunidad, forms.js |

### Identidad: avatares y badges

| Componente | Archivo | Props | Usado en |
|---|---|---|---|
| `UI.Avatar` | `js/ui/avatar.js` | `name`, `src`, `alt`, `icon`, `variant` (author·byline·participant·applicant·door·owner·actor·commenter), `size` (xs·sm·md·lg·xl·2xl·3xl, según variante), `className` | obras, post, recurso, evento, oportunidad, postulantes, event-tickets, js/index.js, js/forms.js, js/notifications.js |
| `UI.AvatarContent` | `js/ui/avatar.js` | `name`, `src` | evento, recurso |
| `UI.AuthorLine` | `js/ui/avatar.js` | `username`, `size` (sm·md), `className` | recursos, oportunidades |
| `UI.badgeClass` | `js/ui/badge.js` | `variant` (type·type-lg·status·status-lg·count), `tone` (cyan·emerald·fuchsia·gray·green·magenta·orange·red·yellow), `className` | oportunidad, postulantes |
| `UI.TypeBadge` | `js/ui/badge.js` | `label`, `icon`, `tone`, `className` | recursos, oportunidades |
| `UI.StatusBadge` | `js/ui/badge.js` | `label`, `tone`, `size` (sm·lg), `className` | oportunidad, postulantes |
| `UI.CountBadge` | `js/ui/badge.js` | `icon`, `count`, `label`, `className` | artistas |
| `UI.Stat`, `UI.Stats` | `js/ui/badge.js` | `kind` (likes·comments), `count` / `likes`, `comments` | obras, recursos, profile |

### Tarjetas y medios

| Componente | Archivo | Props | Usado en |
|---|---|---|---|
| `UI.PostCard` | `js/ui/card.js` | `post`, `variant` (gallery·profile·contest·search), `youtubeId`, `canEdit` | obras, profile, search |
| `UI.RecursoCard` | `js/ui/card.js` | `recurso`, `variant` (gallery·profile·search), `youtubeId`, `typeIcon`, `typeTone`, `canEdit` | recursos, profile, search |
| `UI.EventoCard` | `js/ui/card.js` | `evento`, `variant` (gallery·profile·search), `youtubeId`, `canManage`, `canEdit`, `isDoorEvent` | eventos, profile, search |
| `UI.OportunidadCard` | `js/ui/card.js` | `oportunidad`, `variant` (gallery·profile), `tone` (cyan·orange·magenta·emerald), `typeLabel`, `typeIcon`, `canEdit` | oportunidades, profile |
| `UI.FeedCard` | `js/ui/card.js` | `item` (con `feedType`), `youtubeId`, `isLiked`, `canPin` | js/index.js |
| `UI.FeaturedCard` | `js/ui/card.js` | `item`, `youtubeId`, `canUnpin` | js/index.js |
| `UI.FavoriteCard` | `js/ui/card.js` | `item` (con `type`), `youtubeId` | profile |
| `UI.TicketCard` | `js/ui/card.js` | `ticket`, `mapsUrl` | profile |
| `UI.VisualEffectCard` | `js/ui/card.js` | `effect`, `canEdit` | profile |
| `.ui-card` + `--tile·media·padded`, `--edge-cyan·edge-orange·edge-emerald` | `styles/components/card.css` | junto a `card-cyber` y `group` en el markup | obras, recursos, oportunidades, profile |
| `UI.MediaThumb` | `js/ui/media.js` | `variant` (post-gallery·post-profile·recurso-gallery·recurso-profile·evento-gallery·evento-profile·oportunidad-profile·featured·feed·favorite), `imageUrl`, `alt`, `youtubeId`, `fallbackIcon`, `link`, `children` | card.js |
| `UI.VideoOverlay` | `js/ui/media.js` | `variant` (solid·dim·feed) | card.js, post, evento, recurso |
| `UI.videoHover` | `js/ui/media.js` | `(youtubeId, { isolated })` → atributos `onmouseenter`/`onmouseleave` | card.js, post |

### Modales y superficies

| Componente | Archivo | Props / variantes | Usado en |
|---|---|---|---|
| `UI.EditModal` | `js/ui/modal.js` | sin props (ids `global-edit-modal`/`edit-modal-content` fijos: contrato con edit-logic.js) | evento, post, profile, recurso |
| `.ui-modal` + `--sheet·sheet-admin·dialog·dialog-stacked·scanner·status·confirm·alert·room·directory·donation·loading` | `styles/components/modal.css` | sin `display`: `hidden`/`flex` quedan en el elemento (los alterna el JS) | admin, chat, create, event-tickets, formularioingreso, scan-redeem, ticket-purchase, js/header.js, y vía EditModal |
| `.ui-modal__panel` + `--edit·edit-admin·form·notice·result·status·scanner·room·directory·donation` | ídem | con `role="dialog" aria-modal="true"`; `card-cyber` queda en el markup | ídem |
| `.ui-panel` + `--auth·detail·detail-padded·detail-form·admin (+accent-cyan·emerald·magenta)·table·stat·stat-soft·row·chat·frame` | ídem | layout (ancho, `mb-*`, `flex`, `hidden`) queda como utilidad | login, register, forgot/reset-password, evento, recurso, ticket-purchase, ticket-success, scan-redeem, admin, admin-tickets, event-tickets, create, crear-oportunidad, chat, quienessomos |

### Tabs y filtros

| Componente | Archivo | Props / variantes | Usado en |
|---|---|---|---|
| `UI.Tabs` | `js/ui/tabs.js` | `variant` (underline·pill·split·filter·filter-pill), `items` [{key, label, icon, iconAccent, labelId, badgeId, accent, hidden, className}], `active`, `onSelect` (nombre de función global), `idPrefix` | profile, admin, chat, recursos, oportunidades |
| `UI.ChoiceCards` | `js/ui/tabs.js` | `items` [{key, label, hint, icon, accent (cyan·orange·magenta)}], `onSelect` | crear-oportunidad |
| `UI.HumanAIToggle` | `js/ui/tabs.js` | `botsOnly` | index |
| `UI.setActiveTab` · `UI.setTabState` · `UI.setHumanAIToggle` | `js/ui/tabs.js` | **helpers de DOM (no puros)**: `(buttons, activeEl\|null, variant)` · `(btn, on, variant)` · `(btn, botsOnly)`; las listas de clases activas/inactivas de cada variante viven en `TAB_STATE` | profile, admin, chat, recursos, oportunidades, crear-oportunidad, js/index.js |
| `.ui-tabs--underline·pill`, `.ui-btn--tab-split·filter-pill·choice-card`, `.ui-filter-switch` (+ `--post·recurso·evento·oportunidad` con `.active`) | `styles/components/tabs.css` | las clases de estado quedan como utilidades | profile, chat, admin, oportunidades, crear-oportunidad, index |

---

## Fase 2 — candidatos a consolidar

Surgidos de la extracción; cada uno es un cambio visual a revisar con el
harness.

- **Magenta no existe.** `magenta` no está en la paleta de Tailwind: todo
  `text-/border-/bg-/shadow-/focus:border-magenta-*` nunca generó CSS (íconos
  grises, campos sin color de foco, botones sin fondo). Decidir: agregar
  `magenta` al tema o pasar a `fuchsia`. Fase 1 conserva el "sin color".
- **Botones:** `primary-sm/lg/block/bold/xl` difieren sólo en padding, radio y
  escala de hover → tamaños. `close`/`close-sm` y `dismiss`/`row-view` casi
  iguales. Botón tintado con borde en 3 colores × 2 radios.
- **Tipografía:** pares que sólo cambian el peso (`panel`/`panel-strong`,
  `section`/`section-strong`, `card`/`card-strong`); cuatro tamaños de título
  de página. Escala propuesta: hero · page · panel · section · card · item ·
  eyebrow · micro.
- **Formularios:** `dark`/`soft`/`soft-muted` difieren en placeholder y
  transición; acentos de foco sólidos y `/50` del mismo color; los
  modificadores de foco llevan nombre de color, no de rol. `subsection`
  (heading) = label `--field` (form).
- **Estados:** `StatusText` tiene 17 variantes que caben en ~4 (línea tenue,
  línea de error, caption, línea de carga); cyan-400/cyan-500/`--color-cyan`
  para el mismo spinner.
- **Tarjetas:** `PostCard`/`RecursoCard` gallery vs profile casi iguales;
  `FeedCard` vs `FeaturedCard`; las variantes de `MediaThumb` difieren sólo en
  duración del zoom, tamaño del ícono de fallback y tinte; overlays
  `dim`/`solid`/`feed` → uno. Las miniaturas navegan de tres formas (onclick,
  `window.open`, `<a>`).
- **Modales:** z-index 50/100/101/10000/10001/10002 → tres capas (base,
  apilada, bloqueante); fondos black/70·80·90·95 con blur none/sm/md → dos
  variantes; `sheet`/`sheet-admin`, `dialog`/`dialog-stacked`,
  `confirm`/`alert` difieren sólo en z-index; 4-5 estilos de botón cerrar.
- **Tabs:** `underline` y `split` son la misma tab subrayada con distinto cyan;
  `filter` y `filter-pill` el mismo filtro de elección única (cyan vs
  emerald); `ui-filter-switch` es CSS a mano con `!important`.
- **Safelist de `tailwind.config.js`:** las entradas del bloque "tarjetas del
  feed", `border-X-500/10` (profile.js muerto) y `bg-X-500/10`/`border-X-500/40`
  (updateFilterStyles) ya no se interpolan: se pueden quitar. `text-X-400`
  sigue haciendo falta (edit-logic.js).
- **Avatares y badges:** `byline` y `applicant` son el mismo avatar en otro
  tamaño; `door`/`owner` sólo cambian cyan/fuchsia; `status`/`status-lg` y
  `type`/`type-lg` casi iguales.

## Bugs encontrados durante la extracción (sin corregir)

Fase 1 no cambia comportamiento; quedan anotados para arreglarlos aparte.
Todos verificados contra el código (2026-09-17), no sólo reportados.

- **eventos.html:** los participantes llegan como IDs crudos sin `username`,
  `p.username[0]` tira excepción y la lista de eventos muestra "Error cargando
  eventos" con datos de producción.
- **Texto de usuario sin escapar** fuera de lo migrado: autor y título en la
  tarjeta de obras, chips de participantes en forms.js (`pname`, `pavatar`),
  `renderCamposDinamicos` en oportunidad (`param.label`, `param.key`),
  `addParametro` en crear-oportunidad, `err.message` en el error de tickets de
  profile.
- **profile.html tabs:** `border-primary-500` no existe y `switchTab` no mueve
  `border-b-2`: el subrayado queda siempre en la primera tab.
- **Filtro/tab inicial:** el primer filtro de recursos conserva
  `hover:bg-cyan-500/30` al cambiar de filtro; la primera tab de admin nunca
  recibe `hover:text-white`.
- **header.js:** `hover:text-[var(--color-emerald)]` usa un token que no existe.
- **evento.html:** typo `shadow-[0_0_20px_ravicon(...)]` en el CTA de entradas.
- **`style.css`:** `select:focus` con `!important` pisa el color de foco de
  todos los selects con cyan.
- **Links con `.html`** (contra la regla de URLs limpias): header.js,
  tagging.js (`profile.html?user=`), eventos (`calendario.html`), profile,
  chat, search, `ticket-purchase.html?event=`.
- **Resultados de recursos en search** enlazan todos a `recursos.html`, no al
  recurso.
- **`undefined` impreso:** obras enlaza a `profile.html?user=undefined` en
  posts sin autor; eventos muestra "Por undefined" sin creador.
- **profile.html:** posts y recursos muestran la descripción cruda (sin
  `formatMentions`, como en las galerías); `deleteVisualEffect` lee
  `localStorage.getItem('token')` (la clave es `artedigitaldata_token`) y usa
  `/api/visualeffects` fijo; favoritos de tipo desconocido se pintan como
  eventos.
- **create.html (menor, no rompe nada):** cerrar `#status-overlay` agrega
  `hidden` pero nunca quita el `flex` que puso `showStatus`. `hidden` gana, así
  que el overlay se oculta igual; queda sólo como inconsistencia.
- **Modales** con `aria-modal` sin focus trap ni cierre con Escape.
- **recursos.html:** `filterRecursos` usa el `event` global implícito.
- **tailwind.config.js** sí tiene `theme.extend` (gold, lime), aunque su
  comentario y `CLAUDE.md` digan que no.
