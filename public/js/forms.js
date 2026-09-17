/**
 * Centralized Form Components for Arte Digital Data
 * Ensures Create and Edit forms always stay synchronized
 */

window.formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  // Adjust for local timezone to get the correct YYYY-MM-DDTHH:mm format
  const offset = d.getTimezoneOffset() * 60000;
  const localISOTime = new Date(d.getTime() - offset).toISOString().slice(0, 16);
  return localISOTime;
};

const FORM_TEMPLATES = {
  post: (prefix, item = {}) => `
    <div class="space-y-4">
      ${UI.Field({
        label: 'Título de la Obra',
        children: UI.html`<input type="text" id="${prefix}-title" name="title" value="${item.title || ''}" required placeholder="Ej: Paisaje Cyberpunk 2077"
          class="ui-input ui-input--dark ui-input--focus-cyan ui-input--animated">`,
      })}
      ${UI.Field({
        label: 'Etiquetas (separadas por coma)',
        children: UI.html`<input type="text" id="${prefix}-tags" name="tags" value="${(item.tags || []).join(', ')}" placeholder="3d, blender, neon..."
          class="ui-input ui-input--dark ui-input--focus-cyan ui-input--animated">`,
      })}
      ${UI.Field({
        label: 'Descripción',
        children: UI.html`<textarea id="${prefix}-desc" name="description" rows="4" placeholder="Contanos sobre tu proceso creativo..."
          class="ui-textarea ui-textarea--dark ui-textarea--focus-cyan ui-textarea--animated ui-textarea--fixed mb-1">${item.description || ''}</textarea>
        <div id="${prefix}-desc-preview" class="px-2 text-[10px] text-gray-600 min-h-[1.5em] italic"></div>`,
      })}
      ${UI.Field({
        label: 'Video de YouTube (Link)',
        variant: 'video',
        hint: 'Se mostrará una vista previa al pasar el mouse.',
        hintVariant: 'caps',
        children: UI.html`<div class="relative">
          <i class="fab fa-youtube absolute left-4 top-1/2 -translate-y-1/2 text-red-500"></i>
          <input type="url" id="${prefix}-youtube" name="youtube_video" value="${item.youtube_video || ''}" placeholder="https://www.youtube.com/watch?v=..."
            class="ui-input ui-input--dark ui-input--focus-red ui-input--animated pl-11">
        </div>`,
      })}
      ${UI.Field({
        label: item._id ? 'Cambiar Imagen (opcional)' : 'Imagen de la Obra',
        children: UI.html`<input type="file" id="${prefix}-file" name="file" accept="image/*" ${item._id ? '' : 'required'}
          class="ui-input ui-input--file ui-input--file-cyan">`,
      })}
      ${UI.Field({
        label: 'Visibilidad',
        children: UI.html`<select id="${prefix}-visibility" name="visibility" class="ui-select ui-select--dark ui-select--focus-cyan ui-select--animated">
          <option value="public" ${item.visibility === 'unlisted' ? '' : 'selected'}>Público (Listado)</option>
          <option value="unlisted" ${item.visibility === 'unlisted' ? 'selected' : ''}>No Listado</option>
        </select>`,
      })}
    </div>
  `,

  recurso: (prefix, item = {}) => `
    <div class="space-y-4">
      ${UI.Field({
        label: 'Título del Recurso',
        children: UI.html`<input type="text" id="${prefix}-title" name="title" value="${item.title || ''}" required placeholder="Ej: Pack de Brushes Sci-Fi"
          class="ui-input ui-input--dark ui-input--focus-orange">`,
      })}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${UI.Field({
          label: 'Tipo de Recurso',
          children: UI.html`<select id="${prefix}-type" name="type" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:border-orange-500 focus:outline-none">
            <option value="software" ${item.type === 'software' ? 'selected' : ''}>Software</option>
            <option value="github" ${item.type === 'github' ? 'selected' : ''}>GitHub / Código</option>
            <option value="drive" ${item.type === 'drive' ? 'selected' : ''}>Drive / Descarga</option>
            <option value="tutorial" ${item.type === 'tutorial' ? 'selected' : ''}>Tutorial / Guía</option>
            <option value="texto" ${item.type === 'texto' ? 'selected' : ''}>Texto / Artículo</option>
            <option value="other" ${item.type === 'other' ? 'selected' : ''}>Otro</option>
          </select>`,
        })}
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-2 text-orange-400 font-black">Link de Descarga / Web</label>
          <input type="url" id="${prefix}-url" name="url" value="${escapeHTML(item.url || '')}" required placeholder="https://..."
            class="ui-input ui-input--dark ui-input--focus-orange">
        </div>
      </div>
      ${UI.Field({
        label: 'Descripción',
        children: UI.html`<textarea id="${prefix}-desc" name="description" rows="3" placeholder="¿Para qué sirve este recurso?"
          class="ui-textarea ui-textarea--dark ui-textarea--focus-orange ui-textarea--fixed mb-1">${item.description || ''}</textarea>
        <div id="${prefix}-desc-preview" class="px-2 text-[10px] text-gray-600 min-h-[1.5em] italic"></div>`,
      })}
      ${UI.Field({
        label: 'Video de YouTube (Opcional)',
        variant: 'video',
        children: UI.html`<input type="url" id="${prefix}-youtube" name="youtube_video" value="${item.youtube_video || ''}" placeholder="https://www.youtube.com/watch?v=..."
          class="ui-input ui-input--dark ui-input--focus-red ui-input--animated">`,
      })}
      ${UI.Field({
        label: 'Etiquetas',
        children: UI.html`<input type="text" id="${prefix}-tags" name="tags" value="${(item.tags || []).join(', ')}" placeholder="herramientas, free, assets..."
          class="ui-input ui-input--dark ui-input--focus-orange">`,
      })}
      ${UI.Field({
        label: item._id ? 'Cambiar Imagen (opcional)' : 'Imagen de Previsualización',
        children: UI.html`<input type="file" id="${prefix}-file" name="file" accept="image/*"
          class="ui-input ui-input--file ui-input--file-orange">`,
      })}
    </div>
  `,

  evento: (prefix, item = {}) => {
    const tc = item.ticketConfig || {};
    const participantsHtml = (item.participants || []).map(p => {
      const pid = p && p._id ? String(p._id) : (typeof p === 'string' ? p : '');
      const pname = (p && p.username) ? p.username : (pid || '?');
      const pavatar = p && p.avatar ? p.avatar : '';
      return '<div class="participant-chip flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white" data-id="' + pid + '" data-username="' + pname + '">'
        + UI.Avatar({ name: pname, src: pavatar, variant: 'participant', size: 'xs' })
        + '<span class="font-bold text-xs">' + pname + '</span>'
        + '<button type="button" onclick="removeParticipantChip(this)" class="ml-1 ui-btn ui-btn--chip-remove"><i class="fas fa-times text-[9px]"></i></button>'
        + '</div>';
    }).join('');
    
    const dateValue = item.date ? formatDateForInput(item.date) : '';
    
    return `
    <div class="space-y-4">
      ${UI.Field({
        label: 'Nombre del Evento',
        children: UI.html`<input type="text" id="${prefix}-title" name="title" value="${item.title || ''}" required placeholder="Ej: Meetup Arte Digital BsAs"
          class="ui-input ui-input--dark ui-input--animated">`,
      })}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${UI.Field({
          label: 'Fecha y Hora',
          children: UI.html`<input type="date" id="${prefix}-date" name="date" value="${dateValue.split('T')[0] || ''}" required
            class="ui-input ui-input--dark">
          <input type="time" id="${prefix}-time" name="time" value="${dateValue.split('T')[1] || '20:00'}"
            class="ui-input ui-input--dark mt-2">
          <input type="hidden" id="${prefix}-date-combined" name="date-combined" value="${dateValue}">`,
        })}
        ${UI.Field({
          label: 'Lugar / Enlace',
          children: UI.html`<input type="text" id="${prefix}-location" name="location" value="${item.location || ''}" placeholder="Club X o Link de Meet"
            class="ui-input ui-input--dark">`,
        })}
      </div>
      ${UI.Field({
        label: 'Descripción',
        children: UI.html`<textarea id="${prefix}-desc" name="description" rows="4" placeholder="¡No se lo pierdan! Estarán @tolch y @jp..."
          class="ui-textarea ui-textarea--dark ui-textarea--fixed mb-1">${item.description || ''}</textarea>
        <div id="${prefix}-desc-preview" class="px-2 text-[10px] text-gray-600 min-h-[1.5em] italic"></div>`,
      })}
      ${UI.Field({
        label: 'Etiquetas / Hashtags',
        hint: 'Separadas por coma. Se mostrarán como hashtags del evento.',
        hintVariant: 'caps',
        children: UI.html`<input type="text" id="${prefix}-tags" name="tags" value="${(item.tags || []).join(', ')}" placeholder="vjing, shaders, livecoding, IA..."
          class="ui-input ui-input--dark ui-input--animated">`,
      })}
      ${UI.Field({
        label: 'Video de YouTube (Flyer animado)',
        variant: 'video',
        children: UI.html`<input type="url" id="${prefix}-youtube" name="youtube_video" value="${item.youtube_video || ''}" placeholder="https://www.youtube.com/watch?v=..."
          class="ui-input ui-input--dark ui-input--focus-red ui-input--animated">`,
      })}
      ${UI.Field({
        label: item._id ? 'Cambiar Imagen / Flyer' : 'Imagen / Flyer (File)',
        children: UI.html`<input type="file" id="${prefix}-file" name="file" accept="image/*"
          class="ui-input ui-input--file">
        <input type="text" id="${prefix}-img-url" name="imageUrl" value="${item._id ? (item.imageUrl || '') : (item.imageUrl || '')}" placeholder="O pegá el enlace de la imagen..."
          class="ui-input ui-input--dark ui-input--animated mt-2">`,
      })}
      
      <!-- Participants Section -->
      <div class="border-t border-white/10 pt-6 mt-6">
        <h4 class="ui-eyebrow ui-eyebrow--field-wide mb-3">
          <i class="fas fa-users text-magenta-500 mr-2"></i>Participantes del Evento
        </h4>
        <p class="text-[10px] text-gray-500 mb-3">También se agregan automáticamente cuando etiquetás @usuarios en la descripción.</p>
        <div class="flex gap-2 mb-3">
          <input type="text" id="${prefix}-participant-search" placeholder="Buscar usuario por nombre..."
            class="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-magenta-500 focus:outline-none transition-colors"
            oninput="searchParticipants('${prefix}', this.value)">
          <button type="button" onclick="addParticipantFromSearch('${prefix}')"
            class="px-4 py-2 rounded-xl bg-magenta-500/20 border border-magenta-500/30 text-magenta-400 font-bold text-sm hover:bg-magenta-500/40 transition-all">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div id="${prefix}-participant-suggestions" class="hidden bg-[#0d0d12] border border-white/10 rounded-xl overflow-hidden mb-3 max-h-40 overflow-y-auto"></div>
        <div id="${prefix}-participants-list" class="flex flex-wrap gap-2 min-h-[2rem]">
          ${participantsHtml}
        </div>
      </div>

      <!-- Ticket System Section -->
      <div class="border-t border-white/10 pt-6 mt-6">
        <div class="flex items-center gap-3 mb-4">
          <input type="checkbox" id="${prefix}-ticket-enabled" ${tc.enabled ? 'checked' : ''}
            class="ui-checkbox ui-checkbox--md"
            onchange="toggleTicketConfig('${prefix}')">
          <label for="${prefix}-ticket-enabled" class="text-sm font-bold text-white cursor-pointer">
            <i class="fas fa-ticket-alt text-magenta-500 mr-2"></i>Activar sistema de entradas
          </label>
        </div>
        
        <div id="${prefix}-ticket-config" class="space-y-4 ${tc.enabled ? '' : 'hidden'}">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${UI.Field({
              label: 'Precio (ARS)',
              children: UI.html`<input type="number" id="${prefix}-ticket-price" value="${tc.price || 0}" min="0" placeholder="0"
                class="ui-input ui-input--dark">`,
            })}
            ${UI.Field({
              label: 'Cantidad máxima de entradas',
              children: UI.html`<input type="number" id="${prefix}-ticket-max" value="${tc.maxTickets || 100}" min="1"
                class="ui-input ui-input--dark">`,
            })}
          </div>
          
          ${UI.Field({
            label: 'Link de pago (MercadoPago)',
            children: UI.html`<input type="url" id="${prefix}-ticket-link" value="${tc.paymentLink || ''}" placeholder="https://mpago.la/..."
              class="ui-input ui-input--dark">`,
          })}

          ${UI.Field({
            label: 'Modo de cobro',
            children: UI.html`<div class="flex flex-wrap gap-3">
              <label class="ui-choice ui-choice--pill">
                <input type="radio" name="${prefix}-ticket-mode" value="auto" ${!tc.mode || tc.mode === 'auto' ? 'checked' : ''} class="ui-radio" onchange="updateTicketMode('${prefix}')">
                <span class="font-bold">Auto</span>
              </label>
              <label class="ui-choice ui-choice--pill">
                <input type="radio" name="${prefix}-ticket-mode" value="manual" ${tc.mode === 'manual' ? 'checked' : ''} class="ui-radio" onchange="updateTicketMode('${prefix}')">
                <span class="font-bold">Manual</span>
              </label>
            </div>
            <p class="ui-hint mt-2">Auto = MercadoPago con alias de artedigitaldata. Manual = el comprador ve el CBU/alias en el mensaje de compra y el administrador envía la entrada.</p>`,
          })}
          ${UI.Field({
            id: `${prefix}-manual-payment-info-container`,
            className: tc.mode === 'manual' ? '' : 'hidden',
            label: 'CBU / Alias de MercadoPago',
            hint: 'Esta información se mostrará en la página de compra cuando el modo manual esté activado.',
            children: UI.html`<input type="text" id="${prefix}-ticket-manual-info" value="${tc.manualPaymentInfo || ''}" placeholder="Ej: aliasmercadopago o 0001234500012345678901"
              class="ui-input ui-input--dark">`,
          })}
          
          ${UI.Field({
            label: 'Mensaje en página de compra',
            hint: 'Se muestra en la pantalla de compra. En modo manual pegá CBU o alias de MercadoPago y avisá al comprador que luego el administrador le enviará la entrada.',
            children: UI.html`<textarea id="${prefix}-ticket-purchase-message" rows="2" placeholder="Ej: Todos los asistentes entran al sorteo de una tablet..."
              class="ui-textarea ui-textarea--dark ui-textarea--fixed">${tc.purchaseMessage || ''}</textarea>`,
          })}

          ${UI.Field({
            label: 'Mensaje post-compra',
            children: UI.html`<textarea id="${prefix}-ticket-message" rows="2" placeholder="¡Gracias por tu compra! Presentá este QR en la entrada..."
              class="ui-textarea ui-textarea--dark ui-textarea--fixed">${tc.successMessage || ''}</textarea>`,
          })}
          
          <div class="flex items-center gap-3">
            <input type="checkbox" id="${prefix}-ticket-contribution" ${tc.isContribution ? 'checked' : ''}
              class="ui-checkbox ui-checkbox--md">
            <label for="${prefix}-ticket-contribution" class="text-sm text-gray-300 cursor-pointer">
              Evento con bono contribución (el usuario decide cuánto pagar)
            </label>
          </div>
        </div>
      </div>
    </div>
    `;
  }
};

window.renderFields = (type, prefix, data = {}) => {
  if (!FORM_TEMPLATES[type]) return 'Tipo no soportado';
  return FORM_TEMPLATES[type](prefix, data);
};

window.toggleTicketConfig = (prefix) => {
  const checkbox = document.getElementById(`${prefix}-ticket-enabled`);
  const configDiv = document.getElementById(`${prefix}-ticket-config`);
  if (checkbox && configDiv) {
    configDiv.classList.toggle('hidden', !checkbox.checked);
  }
};

let _participantSearchSelected = {};

window.searchParticipants = async (prefix, query) => {
  const suggestionsEl = document.getElementById(`${prefix}-participant-suggestions`);
  if (!suggestionsEl) return;
  if (!query || query.length < 2) {
    suggestionsEl.classList.add('hidden');
    suggestionsEl.innerHTML = '';
    _participantSearchSelected[prefix] = null;
    return;
  }
  try {
    const res = await fetch(`${CONFIG.API_URL}/tagging?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
      suggestionsEl.classList.add('hidden');
      suggestionsEl.innerHTML = '';
      _participantSearchSelected[prefix] = null;
      return;
    }
    const results = await res.json();
    const users = results.filter(r => r.type === 'user');
    if (users.length === 0) {
      suggestionsEl.classList.add('hidden');
      suggestionsEl.innerHTML = '';
      _participantSearchSelected[prefix] = null;
      return;
    }
    suggestionsEl.classList.remove('hidden');
    suggestionsEl.innerHTML = users.map(u => {
      const uid = u._id || u.id || '';
      return '<div class="suggestion-row flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-white/10 transition-colors"'
        + ' data-id="' + uid + '" data-username="' + u.label + '" data-avatar="' + (u.avatar || '') + '"'
        + ' onclick="selectParticipantSuggestion(\'' + prefix + '\', this)">' 
        + UI.Avatar({ name: u.label, src: u.avatar, variant: 'participant', size: 'md' })
        + '<span class="text-sm text-white font-bold">@' + u.label + '</span>'
        + '</div>';
    }).join('');
  } catch (e) {
    suggestionsEl.classList.add('hidden');
    suggestionsEl.innerHTML = '';
    _participantSearchSelected[prefix] = null;
  }
};

window.updateTicketMode = (prefix) => {
  const selectedMode = document.querySelector(`input[name="${prefix}-ticket-mode"]:checked`)?.value;
  const manualInfoContainer = document.getElementById(`${prefix}-manual-payment-info-container`);
  if (manualInfoContainer) {
    manualInfoContainer.classList.toggle('hidden', selectedMode !== 'manual');
  }
};

window.selectParticipantSuggestion = (prefix, el) => {
  const id = el.dataset.id;
  const username = el.dataset.username;
  const avatar = el.dataset.avatar;
  _participantSearchSelected[prefix] = { _id: id, username, avatar };
  const searchInput = document.getElementById(`${prefix}-participant-search`);
  if (searchInput) searchInput.value = username;
  const suggestionsEl = document.getElementById(`${prefix}-participant-suggestions`);
  if (suggestionsEl) suggestionsEl.classList.add('hidden');
  addParticipantChip(prefix, { _id: id, username, avatar });
};

window.addParticipantFromSearch = (prefix) => {
  const selected = _participantSearchSelected[prefix];
  if (!selected) return;
  addParticipantChip(prefix, selected);
  const searchInput = document.getElementById(`${prefix}-participant-search`);
  if (searchInput) searchInput.value = '';
  _participantSearchSelected[prefix] = null;
};

window.addParticipantChip = (prefix, user) => {
  const listEl = document.getElementById(`${prefix}-participants-list`);
  if (!listEl) return;
  const existing = listEl.querySelector(`[data-id="${user._id}"]`);
  if (existing) return;
  const chip = document.createElement('div');
  chip.className = 'participant-chip flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white';
  chip.dataset.id = user._id;
  chip.dataset.username = user.username;
  chip.innerHTML = `
    ${UI.Avatar({ name: user.username, src: user.avatar, variant: 'participant', size: 'xs' })}
    <span class="font-bold text-xs">${user.username}</span>
    <button type="button" onclick="removeParticipantChip(this)" class="ml-1 ui-btn ui-btn--chip-remove"><i class="fas fa-times text-[9px]"></i></button>
  `;
  listEl.appendChild(chip);
};

window.removeParticipantChip = (btn) => {
  btn.closest('.participant-chip').remove();
};

window.syncParticipantsFromDescription = async (prefix, description) => {
  if (!description) return;
  const mentions = description.match(/@(\w+)/g);
  if (!mentions) return;
  const usernames = [...new Set(mentions.map(m => m.substring(1)))];
  try {
    for (const username of usernames) {
      const res = await fetch(`${CONFIG.API_URL}/tagging?q=${encodeURIComponent(username)}`);
      if (!res.ok) continue;
      const results = await res.json();
      const user = results.find(r => r.type === 'user' && r.label.toLowerCase() === username.toLowerCase());
      if (user) {
        const uid = user._id || user.id || '';
        if (uid) addParticipantChip(prefix, { _id: uid, username: user.label, avatar: user.avatar || '' });
      }
    }
  } catch(e) {}
};

window.getParticipantIds = (prefix) => {
  const listEl = document.getElementById(`${prefix}-participants-list`);
  if (!listEl) return [];
  return Array.from(listEl.querySelectorAll('.participant-chip')).map(chip => chip.dataset.id).filter(Boolean);
};

window.getTicketConfig = (prefix) => {
  const enabled = document.getElementById(`${prefix}-ticket-enabled`)?.checked || false;
  if (!enabled) return { enabled: false };
  
  return {
    enabled: true,
    price: parseFloat(document.getElementById(`${prefix}-ticket-price`)?.value) || 0,
    maxTickets: parseInt(document.getElementById(`${prefix}-ticket-max`)?.value) || 100,
    paymentLink: document.getElementById(`${prefix}-ticket-link`)?.value || '',
    successMessage: document.getElementById(`${prefix}-ticket-message`)?.value || '',
    purchaseMessage: document.getElementById(`${prefix}-ticket-purchase-message`)?.value || '',
    manualPaymentInfo: document.getElementById(`${prefix}-ticket-manual-info`)?.value || '',
    mode: document.querySelector(`input[name="${prefix}-ticket-mode"]:checked`)?.value || 'auto',
    isContribution: document.getElementById(`${prefix}-ticket-contribution`)?.checked || false
  };
};
