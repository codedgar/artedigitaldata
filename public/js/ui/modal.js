// Modales. Las primitivas (`ui-modal`, `ui-modal__panel`) están en
// src/styles/components/modal.css; acá sólo va el markup que se repetía igual
// en varias páginas.
//
// Modal de edición global que abre js/edit-logic.js (evento, post, profile,
// recurso). Se escribe en el lugar del propio <script>, al final del <body>:
//
//   <script>document.currentScript.outerHTML = UI.EditModal();</script>
//
// Los ids `global-edit-modal` y `edit-modal-content` y el `onclick` de cerrar
// son el contrato con edit-logic.js (`openGlobalEdit`/`closeGlobalEdit`), que
// busca los elementos recién al abrir; por eso no se reciben por props. El
// `hidden flex` del overlay queda en el markup porque es lo que ese JS alterna.
//
// Requiere js/ui/core.js.
(function () {
  const { html } = UI;

  function EditModal() {
    return html`<div id="global-edit-modal" class="hidden flex ui-modal ui-modal--sheet">
    <div class="card-cyber ui-modal__panel ui-modal__panel--edit" role="dialog" aria-modal="true">
      <button onclick="closeGlobalEdit()" class="absolute top-4 right-4 z-10 ui-btn ui-btn--close" aria-label="Cerrar">
        <i class="fas fa-times"></i>
      </button>
      <div id="edit-modal-content" class="max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide"></div>
    </div>
  </div>`;
  }

  Object.assign(UI, { EditModal });
})();
