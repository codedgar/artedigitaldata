// Campos de formulario. Las primitivas `ui-label`, `ui-input`, `ui-select`,
// `ui-textarea`, `ui-hint`, `ui-checkbox`, `ui-radio` y `ui-choice` viven en
// src/styles/components/form.css; acá está la estructura etiqueta + control +
// ayuda que se repite en los templates de js/forms.js.
//
//   UI.Field({
//     label: 'Título de la Obra',
//     children: UI.html`<input type="text" id="post-title" class="ui-input ui-input--dark ui-input--focus-cyan">`,
//   })
//   UI.Field({ label: 'Video de YouTube', variant: 'video', hint: 'Se mostrará una vista previa...', hintVariant: 'caps', children })
//
// `children` es el control (o varios) ya armado con UI.html.
// Requiere js/ui/core.js.
(function () {
  const { html, cx } = UI;

  const LABEL = {
    caps: 'ui-label ui-label--caps',
    video: 'ui-label ui-label--video',
    field: 'ui-label ui-label--field',
    account: 'ui-label ui-label--account',
    compact: 'ui-label ui-label--compact',
    eyebrow: 'ui-label ui-label--eyebrow',
    signup: 'ui-label ui-label--signup',
  };

  const HINT = {
    field: 'ui-hint',
    caps: 'ui-hint ui-hint--caps',
  };

  // `id` existe porque hay JS que muestra u oculta el campo entero buscándolo por id.
  function Field({ label, variant = 'caps', hint, hintVariant = 'field', children, id, className } = {}) {
    // Sin className el contenedor queda como `<div>` pelado, igual que en los templates originales.
    return html`<div${id ? html` id="${id}"` : ''}${className ? html` class="${cx(className)}"` : ''}>
        <label class="${LABEL[variant]}">${label}</label>
        ${children}
        ${hint && html`<p class="${HINT[hintVariant]}">${hint}</p>`}
      </div>`;
  }

  Object.assign(UI, { Field });
})();
