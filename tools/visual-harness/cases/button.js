// Casos de las primitivas `ui-btn--*`. `before` es el markup literal de
// 75d8386 (páginas y js/ vivos) y `after` el mismo elemento migrado. Los
// `${...}` son texto: el markup viene de templates de JS y se renderiza tal cual.
//
// Casos con `hoverToo` se repiten con el mouse encima (`<nombre>--hover`).
// Los `*-toggled` no son literales: reproducen el elemento después de que el
// JS de la página le agrega o quita clases (filterRecursos, switchTab).
const wrapper = '<div class="relative flex flex-wrap items-start gap-4" style="width:640px;min-height:80px">{}</div>';

const cases = [
  {
    name: 'primary-sm', // evento.html
    hoverToo: 'button',
    before: `<button type="submit" class="btn-primary px-6 py-2 rounded-xl text-sm transition-all hover:scale-105">
                    Enviar Mensaje
                  </button>`,
    after: `<button type="submit" class="btn-primary ui-btn ui-btn--primary-sm">
                    Enviar Mensaje
                  </button>`,
  },
  {
    name: 'primary-block', // forgot-password.html
    hoverToo: 'button',
    before: `<button type="submit" id="submit-btn" class="btn-primary w-full py-3 rounded-xl transition-all hover:scale-[1.02]">
          <i class="fas fa-paper-plane mr-2"></i>Enviar Link
        </button>`,
    after: `<button type="submit" id="submit-btn" class="btn-primary w-full ui-btn ui-btn--primary-block">
          <i class="fas fa-paper-plane mr-2"></i>Enviar Link
        </button>`,
  },
  {
    name: 'primary-lg', // event-tickets.html
    before: `<a href="calendario.html" class="btn-primary px-8 py-3 rounded-xl">Volver al Calendario</a>`,
    after: `<a href="calendario.html" class="btn-primary ui-btn ui-btn--primary-lg">Volver al Calendario</a>`,
  },
  {
    name: 'primary-lg--mt-4', // recurso.html
    before: `<a href="recursos.html" class="btn-primary px-8 py-3 rounded-xl mt-4 inline-block">Volver a Recursos</a>`,
    after: `<a href="recursos.html" class="btn-primary mt-4 inline-block ui-btn ui-btn--primary-lg">Volver a Recursos</a>`,
  },
  {
    name: 'primary-bold', // event-tickets.html
    before: `<button onclick="closeScanResult()" class="w-full btn-primary py-3 rounded-xl font-bold">
          CONTINUAR
        </button>`,
    after: `<button onclick="closeScanResult()" class="w-full btn-primary ui-btn ui-btn--primary-bold">
          CONTINUAR
        </button>`,
  },
  {
    name: 'primary-xl', // ticket-purchase.html
    hoverToo: 'button',
    before: `<button type="submit" id="submit-btn" class="w-full btn-primary py-4 rounded-2xl font-black text-lg hover:scale-[1.01] transition-transform">
              <i class="fas fa-lock mr-2"></i>
              <span id="btn-text">PROCEDER AL PAGO</span>
            </button>`,
    after: `<button type="submit" id="submit-btn" class="w-full btn-primary ui-btn ui-btn--primary-xl">
              <i class="fas fa-lock mr-2"></i>
              <span id="btn-text">PROCEDER AL PAGO</span>
            </button>`,
  },
  {
    name: 'primary-xl+glow-cyan', // create.html
    hoverToo: 'button',
    before: `<button type="submit" class="w-full btn-primary py-4 rounded-2xl font-black text-lg shadow-xl shadow-cyan-500/10 hover:scale-[1.01] transition-transform">
          <i class="fas fa-paper-plane mr-2"></i>PUBLICAR OBRA
        </button>`,
    after: `<button type="submit" class="w-full btn-primary ui-btn ui-btn--primary-xl ui-btn--glow-cyan">
          <i class="fas fa-paper-plane mr-2"></i>PUBLICAR OBRA
        </button>`,
  },
  {
    name: 'primary-xl+glow-orange', // create.html
    hoverToo: 'button',
    before: `<button type="submit" class="w-full btn-primary py-4 rounded-2xl font-black text-lg shadow-xl shadow-orange-500/10 hover:scale-[1.01] transition-transform" style="background: linear-gradient(135deg, #ff8c00, #ff4500); color: white !important;">
          <i class="fas fa-upload mr-2"></i>SUBIR RECURSO
        </button>`,
    after: `<button type="submit" class="w-full btn-primary ui-btn ui-btn--primary-xl ui-btn--glow-orange" style="background: linear-gradient(135deg, #ff8c00, #ff4500); color: white !important;">
          <i class="fas fa-upload mr-2"></i>SUBIR RECURSO
        </button>`,
  },
  {
    name: 'primary-xl+glow-magenta', // create.html
    hoverToo: 'button',
    before: `<button type="submit" class="w-full btn-primary py-4 rounded-2xl font-black text-lg shadow-xl shadow-magenta-500/10 hover:scale-[1.01] transition-transform">
          <i class="fas fa-calendar-plus mr-2"></i>PUBLICAR EVENTO
        </button>`,
    after: `<button type="submit" class="w-full btn-primary ui-btn ui-btn--primary-xl ui-btn--glow-magenta">
          <i class="fas fa-calendar-plus mr-2"></i>PUBLICAR EVENTO
        </button>`,
  },
  {
    name: 'outline', // event-tickets.html
    hoverToo: 'button',
    before: `<button onclick="loadTickets()" class="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all">
            <i class="fas fa-sync-alt"></i>
          </button>`,
    after: `<button onclick="loadTickets()" class="ui-btn ui-btn--outline">
            <i class="fas fa-sync-alt"></i>
          </button>`,
  },
  {
    name: 'outline--alt', // admin-tickets.html
    hoverToo: 'button',
    before: `<button onclick="exportTickets()" class="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all flex items-center gap-2">
            <i class="fas fa-download"></i>
            Exportar CSV
          </button>`,
    after: `<button onclick="exportTickets()" class="flex items-center gap-2 ui-btn ui-btn--outline">
            <i class="fas fa-download"></i>
            Exportar CSV
          </button>`,
  },
  {
    name: 'secondary-caps', // crear-oportunidad.html
    hoverToo: 'a',
    before: `<a href="oportunidades.html" class="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
          <i class="fas fa-th mr-2"></i>Ver Oportunidades
        </a>`,
    after: `<a href="oportunidades.html" class="ui-btn ui-btn--secondary-caps">
          <i class="fas fa-th mr-2"></i>Ver Oportunidades
        </a>`,
  },
  {
    name: 'success', // event-tickets.html
    hoverToo: 'button',
    before: `<button onclick="redeemManual()" class="px-6 py-3 rounded-xl bg-green-500 text-black font-bold hover:bg-green-400 transition-all">
          Canjear
        </button>`,
    after: `<button onclick="redeemManual()" class="ui-btn ui-btn--success">
          Canjear
        </button>`,
  },
  {
    name: 'video', // evento.html
    hoverToo: 'a',
    before: `<a href="\${sanitizeUrl(ev.youtube_video)}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20 text-sm font-black uppercase tracking-widest hover:bg-red-600/20 transition-all">
            <i class="fab fa-youtube text-lg"></i> Ver Streaming / Video
          </a>`,
    after: `<a href="\${sanitizeUrl(ev.youtube_video)}" target="_blank" class="inline-flex items-center gap-2 ui-btn ui-btn--video">
            <i class="fab fa-youtube text-lg"></i> Ver Streaming / Video
          </a>`,
  },
  {
    name: 'map', // ticket-success.html
    hoverToo: 'a',
    before: `<a href="\${sanitizeUrl(ev.location)}" target="_blank" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-all text-xs font-bold">
          <i class="fas fa-map-marker-alt"></i>Ver Ubicación
        </a>`,
    after: `<a href="\${sanitizeUrl(ev.location)}" target="_blank" class="inline-flex items-center gap-2 ui-btn ui-btn--map">
          <i class="fas fa-map-marker-alt"></i>Ver Ubicación
        </a>`,
  },
  {
    name: 'map--mt-2', // profile.html
    hoverToo: 'a',
    before: `<a href="\${getGoogleMapsUrl(ev.location)}" target="_blank" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-all text-xs font-bold mt-2">
                        <i class="fas fa-map-marker-alt"></i>Ver en Google Maps
                      </a>`,
    after: `<a href="\${getGoogleMapsUrl(ev.location)}" target="_blank" class="inline-flex items-center gap-2 mt-2 ui-btn ui-btn--map">
                        <i class="fas fa-map-marker-alt"></i>Ver en Google Maps
                      </a>`,
  },
  {
    name: 'map--truncate', // ticket-success.html
    hoverToo: 'a',
    before: `<a href="\${sanitizeUrl(mapsUrl)}" target="_blank" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-all text-xs font-bold truncate max-w-[200px] md:max-w-xs">
          <i class="fas fa-map-marker-alt"></i>\${escapeHTML(ev.location)}
        </a>`,
    after: `<a href="\${sanitizeUrl(mapsUrl)}" target="_blank" class="inline-flex items-center gap-2 truncate max-w-[200px] md:max-w-xs ui-btn ui-btn--map">
          <i class="fas fa-map-marker-alt"></i>\${escapeHTML(ev.location)}
        </a>`,
  },
  {
    name: 'ticket-cta', // evento.html
    hoverToo: 'a',
    before: `<a href="ticket-purchase.html?event=\${ev._id}" class="group relative flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 bg-[length:200%_100%] text-white hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] h-full w-full overflow-hidden animate-gradient">
                <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                <i class="fas fa-ticket-alt text-xl group-hover:animate-bounce"></i>
                <span class="relative">
                  \${ev.ticketConfig.price === 0 ? 'RESERVAR ENTRADA' : 'COMPRAR ENTRADA'}
                </span>
              </a>`,
    after: `<a href="ticket-purchase.html?event=\${ev._id}" class="group relative flex items-center justify-center gap-3 h-full w-full overflow-hidden animate-gradient ui-btn ui-btn--ticket-cta">
                <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                <i class="fas fa-ticket-alt text-xl group-hover:animate-bounce"></i>
                <span class="relative">
                  \${ev.ticketConfig.price === 0 ? 'RESERVAR ENTRADA' : 'COMPRAR ENTRADA'}
                </span>
              </a>`,
  },
  {
    name: 'type-card', // create.html
    before: `<button onclick="switchType('post')" id="btn-post" class="type-card active p-6 rounded-3xl border border-white/5 bg-black/40 text-center group">
        <div class="w-16 h-16 mx-auto bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-4 transition-colors">
          <i class="fas fa-palette text-2xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-bold text-white mb-1">Obra Artística</h3>
        <p class="text-xs text-gray-500">Publicá tus creaciones y diseños</p>
      </button>`,
    after: `<button onclick="switchType('post')" id="btn-post" class="type-card active group ui-btn ui-btn--type-card">
        <div class="w-16 h-16 mx-auto bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-4 transition-colors">
          <i class="fas fa-palette text-2xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-bold text-white mb-1">Obra Artística</h3>
        <p class="text-xs text-gray-500">Publicá tus creaciones y diseños</p>
      </button>`,
  },
  {
    name: 'pager', // admin-tickets.html
    hoverToo: 'button',
    before: `<button onclick="changePage(-1)" id="prev-btn" class="px-4 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all disabled:opacity-50">
            <i class="fas fa-chevron-left"></i>
          </button>`,
    after: `<button onclick="changePage(-1)" id="prev-btn" class="ui-btn ui-btn--pager">
            <i class="fas fa-chevron-left"></i>
          </button>`,
  },
  {
    name: 'pager-caps', // concurso.html
    hoverToo: 'button',
    before: `<button id="prev-month-btn" onclick="navigateMonth(-1)" class="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-yellow-500/30 transition-all font-black text-sm uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed">
                        <i class="fas fa-chevron-left mr-2"></i>Anterior
                    </button>`,
    after: `<button id="prev-month-btn" onclick="navigateMonth(-1)" class="ui-btn ui-btn--pager-caps">
                        <i class="fas fa-chevron-left mr-2"></i>Anterior
                    </button>`,
  },
  {
    name: 'icon-nav', // calendario.html
    hoverToo: 'button',
    before: `<button onclick="prevMonth()" class="w-10 h-10 rounded-xl hover:bg-white/10 text-white transition-all"><i class="fas fa-chevron-left"></i></button>`,
    after: `<button onclick="prevMonth()" class="ui-btn ui-btn--icon-nav"><i class="fas fa-chevron-left"></i></button>`,
  },
  {
    name: 'close', // admin.html
    hoverToo: 'button',
    before: `<button onclick="closeEditModal()" class="absolute top-4 right-4 text-gray-400 hover:text-white z-10 bg-black/50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all">
        <i class="fas fa-times"></i>
      </button>`,
    after: `<button onclick="closeEditModal()" class="absolute top-4 right-4 z-10 ui-btn ui-btn--close">
        <i class="fas fa-times"></i>
      </button>`,
  },
  {
    name: 'close-sm', // ticket-purchase.html
    hoverToo: 'button',
    before: `<button onclick="closeLoginRequiredModal()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">
          <i class="fas fa-times"></i>
        </button>`,
    after: `<button onclick="closeLoginRequiredModal()" class="absolute top-4 right-4 ui-btn ui-btn--close-sm">
          <i class="fas fa-times"></i>
        </button>`,
  },
  {
    name: 'dismiss', // event-tickets.html
    hoverToo: 'button',
    before: `<button onclick="hideScanner()" class="text-gray-400 hover:text-white">
          <i class="fas fa-times text-xl"></i>
        </button>`,
    after: `<button onclick="hideScanner()" class="ui-btn ui-btn--dismiss">
          <i class="fas fa-times text-xl"></i>
        </button>`,
  },
  {
    name: 'dismiss--md-hidden', // chat.html
    // `md:hidden`: sólo se ve en pantallas angostas.
    viewport: { width: 400, height: 800 },
    hoverToo: 'button',
    before: `<button onclick="backToRooms()" class="md:hidden text-gray-400 hover:text-white">
            <i class="fas fa-arrow-left"></i>
          </button>`,
    after: `<button onclick="backToRooms()" class="md:hidden ui-btn ui-btn--dismiss">
            <i class="fas fa-arrow-left"></i>
          </button>`,
  },
  {
    name: 'back', // oportunidad.html
    hoverToo: 'a',
    before: `<a href="oportunidades.html" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/50 transition-all">
                <i class="fas fa-arrow-left"></i>
              </a>`,
    after: `<a href="oportunidades.html" class="ui-btn ui-btn--back">
                <i class="fas fa-arrow-left"></i>
              </a>`,
  },
  {
    name: 'icon-remove', // crear-oportunidad.html
    hoverToo: 'button',
    before: `<button type="button" onclick="removeParametro(this)" class="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center">
                    <i class="fas fa-trash text-xs"></i>
                  </button>`,
    after: `<button type="button" onclick="removeParametro(this)" class="ui-btn ui-btn--icon-remove">
                    <i class="fas fa-trash text-xs"></i>
                  </button>`,
  },
  {
    name: 'icon-remove--hidden', // crear-oportunidad.html
    before: `<button type="button" class="remove-param-btn hidden w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center">
                    <i class="fas fa-trash text-xs"></i>
                  </button>`,
    after: `<button type="button" class="remove-param-btn hidden ui-btn ui-btn--icon-remove">
                    <i class="fas fa-trash text-xs"></i>
                  </button>`,
  },
  {
    name: 'chip-remove', // js/forms.js
    hoverToo: 'button',
    before: `<button type="button" onclick="removeParticipantChip(this)" class="text-gray-500 hover:text-red-400 ml-1 transition-colors"><i class="fas fa-times text-[9px]"></i></button>`,
    after: `<button type="button" onclick="removeParticipantChip(this)" class="ml-1 ui-btn ui-btn--chip-remove"><i class="fas fa-times text-[9px]"></i></button>`,
  },
  {
    name: 'icon-delete', // profile.html
    hoverToo: 'button',
    before: `<button onclick="deletePost('\${p._id}')" class="text-gray-500 hover:text-red-500 transition-colors p-1" title="Eliminar"><i class="fas fa-trash-alt text-xs"></i></button>`,
    after: `<button onclick="deletePost('\${p._id}')" class="ui-btn ui-btn--icon-delete" title="Eliminar"><i class="fas fa-trash-alt text-xs"></i></button>`,
  },
  {
    name: 'icon-edit+icon-edit-cyan', // profile.html
    hoverToo: 'button',
    before: `<button onclick="openEditPost('\${p._id}')" class="text-gray-500 hover:text-cyan-400 transition-colors p-1" title="Editar"><i class="fas fa-edit text-xs"></i></button>`,
    after: `<button onclick="openEditPost('\${p._id}')" class="ui-btn ui-btn--icon-edit ui-btn--icon-edit-cyan" title="Editar"><i class="fas fa-edit text-xs"></i></button>`,
  },
  {
    name: 'icon-edit+icon-edit-orange', // profile.html
    hoverToo: 'button',
    before: `<button onclick="openEditRecurso('\${r._id}')" class="text-gray-500 hover:text-orange-400 transition-colors p-1" title="Editar"><i class="fas fa-edit text-xs"></i></button>`,
    after: `<button onclick="openEditRecurso('\${r._id}')" class="ui-btn ui-btn--icon-edit ui-btn--icon-edit-orange" title="Editar"><i class="fas fa-edit text-xs"></i></button>`,
  },
  {
    name: 'icon-edit', // profile.html
    hoverToo: 'button',
    before: `<button onclick="openEditEvento('\${ev._id}')" class="text-gray-500 hover:text-magenta-400 transition-colors p-1"><i class="fas fa-edit text-xs"></i></button>`,
    after: `<button onclick="openEditEvento('\${ev._id}')" class="ui-btn ui-btn--icon-edit"><i class="fas fa-edit text-xs"></i></button>`,
  },
  {
    name: 'comment-delete', // evento.html
    hoverToo: 'button',
    before: `<button onclick="deleteComment('\${c._id}')" class="text-gray-600 hover:text-red-500 transition-colors text-xs" title="Borrar mensaje">
                      <i class="fas fa-trash"></i>
                    </button>`,
    after: `<button onclick="deleteComment('\${c._id}')" class="ui-btn ui-btn--comment-delete" title="Borrar mensaje">
                      <i class="fas fa-trash"></i>
                    </button>`,
  },
  {
    name: 'link', // evento.html
    hoverToo: 'button',
    before: `<button onclick="showLogin()" class="text-cyan-400 hover:underline">iniciar sesión</button>`,
    after: `<button onclick="showLogin()" class="ui-btn ui-btn--link">iniciar sesión</button>`,
  },
  {
    name: 'row-edit', // admin.html
    hoverToo: 'button',
    before: `<button onclick="openEdit('posts', '\${p._id}')" class="text-yellow-500 hover:text-yellow-400"><i class="fas fa-edit"></i></button>`,
    after: `<button onclick="openEdit('posts', '\${p._id}')" class="ui-btn ui-btn--row-edit"><i class="fas fa-edit"></i></button>`,
  },
  {
    name: 'row-view', // admin.html
    hoverToo: 'a',
    before: `<a href="\${CONFIG.BASE}/post.html?id=\${p._id}" target="_blank" class="text-cyan-400 hover:text-white"><i class="fas fa-external-link-alt"></i></a>`,
    after: `<a href="\${CONFIG.BASE}/post.html?id=\${p._id}" target="_blank" class="ui-btn ui-btn--row-view"><i class="fas fa-external-link-alt"></i></a>`,
  },
  {
    name: 'row-delete', // admin.html
    hoverToo: 'button',
    before: `<button onclick="deleteItem('posts', '\${p._id}')" class="text-red-500 hover:text-red-400"><i class="fas fa-trash"></i></button>`,
    after: `<button onclick="deleteItem('posts', '\${p._id}')" class="ui-btn ui-btn--row-delete"><i class="fas fa-trash"></i></button>`,
  },
  {
    name: 'row-delete-soft', // admin-tickets.html
    hoverToo: 'button',
    before: `<button onclick="deleteTicket('\${t._id}')" class="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-xs">
                  <i class="fas fa-trash"></i>
                </button>`,
    after: `<button onclick="deleteTicket('\${t._id}')" class="ui-btn ui-btn--row-delete-soft">
                  <i class="fas fa-trash"></i>
                </button>`,
  },
  {
    name: 'row-subtle', // admin-tickets.html
    hoverToo: 'a',
    before: `<a href="ticket-success.html?ticket=\${escapeHTML(t.code)}" target="_blank" class="px-3 py-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-all text-xs">
                  <i class="fas fa-eye"></i>
                </a>`,
    after: `<a href="ticket-success.html?ticket=\${escapeHTML(t.code)}" target="_blank" class="ui-btn ui-btn--row-subtle">
                  <i class="fas fa-eye"></i>
                </a>`,
  },
  {
    name: 'option', // event-tickets.html
    hoverToo: 'button',
    before: `<button type="button" onclick="selectUser('\${user._id}')"
              class="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0">
              \${avatarHtml}
              <div class="flex-1 min-w-0">
                <p class="text-sm text-white font-medium truncate">\${displayName}</p>
                <p class="text-xs text-gray-500 truncate">@\${escapeHTML(user.username)}\${emailPart}</p>
              </div>
              <i class="fas fa-plus text-fuchsia-500 text-xs"></i>
            </button>
<button type="button" onclick="selectUser('\${user._id}')"
              class="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0">
              \${avatarHtml}
              <div class="flex-1 min-w-0">
                <p class="text-sm text-white font-medium truncate">\${displayName}</p>
                <p class="text-xs text-gray-500 truncate">@\${escapeHTML(user.username)}\${emailPart}</p>
              </div>
              <i class="fas fa-plus text-fuchsia-500 text-xs"></i>
            </button>`,
    after: `<button type="button" onclick="selectUser('\${user._id}')"
              class="w-full flex items-center gap-3 ui-btn ui-btn--option">
              \${avatarHtml}
              <div class="flex-1 min-w-0">
                <p class="text-sm text-white font-medium truncate">\${displayName}</p>
                <p class="text-xs text-gray-500 truncate">@\${escapeHTML(user.username)}\${emailPart}</p>
              </div>
              <i class="fas fa-plus text-fuchsia-500 text-xs"></i>
            </button>
<button type="button" onclick="selectUser('\${user._id}')"
              class="w-full flex items-center gap-3 ui-btn ui-btn--option">
              \${avatarHtml}
              <div class="flex-1 min-w-0">
                <p class="text-sm text-white font-medium truncate">\${displayName}</p>
                <p class="text-xs text-gray-500 truncate">@\${escapeHTML(user.username)}\${emailPart}</p>
              </div>
              <i class="fas fa-plus text-fuchsia-500 text-xs"></i>
            </button>`,
  },
  {
    name: 'tool-icon', // js/edit-logic.js
    hoverToo: 'button',
    before: `<button type="button" onclick="editCropper.rotate(-90)" class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-\${c}-500/50 transition-all flex items-center justify-center"><i class="fas fa-undo"></i></button>`,
    after: `<button type="button" onclick="editCropper.rotate(-90)" class="ui-btn ui-btn--tool-icon hover:border-\${c}-500/50"><i class="fas fa-undo"></i></button>`,
  },
  {
    name: 'tool-text', // js/edit-logic.js
    hoverToo: 'button',
    before: `<button type="button" onclick="editCropper.setAspectRatio(1)" class="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-\${c}-500/50 transition-all text-[10px] font-bold uppercase">1:1</button>`,
    after: `<button type="button" onclick="editCropper.setAspectRatio(1)" class="ui-btn ui-btn--tool-text hover:border-\${c}-500/50">1:1</button>`,
  },
  {
    name: 'filter', // recursos.html
    hoverToo: 'button',
    before: `<button onclick="filterRecursos('software')" class="filter-btn px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-all">Software</button>`,
    after: `<button onclick="filterRecursos('software')" class="filter-btn ui-btn ui-btn--filter bg-white/5 text-gray-400 border-white/10">Software</button>`,
  },
  {
    name: 'filter--active', // recursos.html
    hoverToo: 'button',
    before: `<button onclick="filterRecursos('all')" class="filter-btn active px-4 py-2 rounded-lg text-sm font-medium bg-cyan-500/20 text-[var(--color-cyan)] border border-cyan-500/30 hover:bg-cyan-500/30 transition-all">Todos</button>`,
    after: `<button onclick="filterRecursos('all')" class="filter-btn active ui-btn ui-btn--filter bg-cyan-500/20 text-[var(--color-cyan)] border-cyan-500/30 hover:bg-cyan-500/30">Todos</button>`,
  },
  {
    name: 'tab-underline', // profile.html
    hoverToo: 'button',
    before: `<button onclick="switchTab('recursos')" id="tab-recursos" class="tab-btn px-6 py-4 text-sm font-bold text-gray-500 hover:text-white whitespace-nowrap transition-all">
        <i class="fas fa-box-open mr-2"></i>RECURSOS
      </button>`,
    after: `<button onclick="switchTab('recursos')" id="tab-recursos" class="tab-btn ui-btn ui-btn--tab-underline text-gray-500 hover:text-white">
        <i class="fas fa-box-open mr-2"></i>RECURSOS
      </button>`,
  },
  {
    name: 'tab-underline--hidden', // profile.html
    before: `<button onclick="switchTab('notificaciones')" id="tab-notificaciones" class="tab-btn hidden px-6 py-4 text-sm font-bold text-gray-500 hover:text-white whitespace-nowrap transition-all">
        <i class="fas fa-bell mr-2 text-yellow-400"></i>NOTIFICACIONES
        <span id="notif-badge" class="hidden ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black"></span>
      </button>`,
    after: `<button onclick="switchTab('notificaciones')" id="tab-notificaciones" class="tab-btn hidden ui-btn ui-btn--tab-underline text-gray-500 hover:text-white">
        <i class="fas fa-bell mr-2 text-yellow-400"></i>NOTIFICACIONES
        <span id="notif-badge" class="hidden ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black"></span>
      </button>`,
  },
  {
    name: 'tab-underline--active', // profile.html
    hoverToo: 'button',
    before: `<button onclick="switchTab('posts')" id="tab-posts" class="tab-btn active px-6 py-4 text-sm font-bold text-[var(--color-cyan)] border-b-2 border-primary-500 whitespace-nowrap transition-all">
        <i class="fas fa-palette mr-2"></i>OBRAS
      </button>`,
    after: `<button onclick="switchTab('posts')" id="tab-posts" class="tab-btn active ui-btn ui-btn--tab-underline text-[var(--color-cyan)] border-b-2 border-primary-500">
        <i class="fas fa-palette mr-2"></i>OBRAS
      </button>`,
  },
  {
    name: 'tab-pill', // admin.html
    hoverToo: 'button',
    before: `<button onclick="switchTab('posts')" id="tab-posts" class="tab-btn px-6 py-2 rounded-lg font-bold text-sm transition-all text-gray-400 hover:text-white">Posteos</button>`,
    after: `<button onclick="switchTab('posts')" id="tab-posts" class="tab-btn ui-btn ui-btn--tab-pill text-gray-400 hover:text-white">Posteos</button>`,
  },
  {
    name: 'tab-pill--flex-items-center-gap-1', // admin.html
    hoverToo: 'button',
    before: `<button onclick="switchTab('autobot')" id="tab-autobot" class="tab-btn px-6 py-2 rounded-lg font-bold text-sm transition-all text-gray-400 hover:text-white flex items-center gap-1"><i class="fas fa-robot text-xs"></i><span id="tab-autobot-label">Autobot</span></button>`,
    after: `<button onclick="switchTab('autobot')" id="tab-autobot" class="tab-btn flex items-center gap-1 ui-btn ui-btn--tab-pill text-gray-400 hover:text-white"><i class="fas fa-robot text-xs"></i><span id="tab-autobot-label">Autobot</span></button>`,
  },
  {
    name: 'tab-pill--alt', // admin.html
    hoverToo: 'button',
    before: `<button onclick="switchTab('users')" id="tab-users" class="tab-btn px-6 py-2 rounded-lg font-bold text-sm transition-all bg-cyan-500 text-black">Usuarios</button>`,
    after: `<button onclick="switchTab('users')" id="tab-users" class="tab-btn ui-btn ui-btn--tab-pill bg-cyan-500 text-black">Usuarios</button>`,
  },
  {
    name: 'nav+accent-cyan', // js/header.js
    hoverToo: 'a',
    before: `<a href="\${CONFIG.BASE}/" class="nav-link flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-black text-gray-400 hover:text-[var(--color-cyan)] hover:bg-white/5 transition-all whitespace-nowrap">
            <i class="fas fa-home text-[10px]"></i> INICIO
          </a>`,
    after: `<a href="\${CONFIG.BASE}/" class="nav-link flex items-center gap-1.5 ui-btn ui-btn--nav ui-btn--accent-cyan">
            <i class="fas fa-home text-[10px]"></i> INICIO
          </a>`,
  },
  {
    name: 'nav+accent-magenta', // js/header.js
    hoverToo: 'a',
    before: `<a href="\${CONFIG.BASE}/artistas.html" class="nav-link flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-black text-gray-400 hover:text-[var(--color-magenta)] hover:bg-white/5 transition-all whitespace-nowrap">
            <i class="fas fa-users text-[10px]"></i> ARTISTAS
          </a>`,
    after: `<a href="\${CONFIG.BASE}/artistas.html" class="nav-link flex items-center gap-1.5 ui-btn ui-btn--nav ui-btn--accent-magenta">
            <i class="fas fa-users text-[10px]"></i> ARTISTAS
          </a>`,
  },
  {
    name: 'nav+accent-emerald', // js/header.js
    hoverToo: 'a',
    before: `<a href="\${CONFIG.BASE}/oportunidades.html" class="nav-link flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-black text-gray-400 hover:text-[var(--color-emerald)] hover:bg-white/5 transition-all whitespace-nowrap">
            <i class="fas fa-briefcase text-[10px]"></i> CHANCES
          </a>`,
    after: `<a href="\${CONFIG.BASE}/oportunidades.html" class="nav-link flex items-center gap-1.5 ui-btn ui-btn--nav ui-btn--accent-emerald">
            <i class="fas fa-briefcase text-[10px]"></i> CHANCES
          </a>`,
  },
  {
    name: 'menu+accent-cyan', // js/header.js
    hoverToo: 'a',
    before: `<a href="\${CONFIG.BASE}/" class="px-4 py-3 rounded-lg text-sm font-bold text-gray-300 hover:text-[var(--color-cyan)] hover:bg-white/5">
            <i class="fas fa-home mr-2"></i> INICIO
          </a>`,
    after: `<a href="\${CONFIG.BASE}/" class="ui-btn ui-btn--menu ui-btn--accent-cyan">
            <i class="fas fa-home mr-2"></i> INICIO
          </a>`,
  },
  {
    name: 'menu+accent-magenta', // js/header.js
    hoverToo: 'a',
    before: `<a href="\${CONFIG.BASE}/artistas.html" class="px-4 py-3 rounded-lg text-sm font-bold text-gray-300 hover:text-[var(--color-magenta)] hover:bg-white/5">
            <i class="fas fa-users mr-2"></i> ARTISTAS
          </a>`,
    after: `<a href="\${CONFIG.BASE}/artistas.html" class="ui-btn ui-btn--menu ui-btn--accent-magenta">
            <i class="fas fa-users mr-2"></i> ARTISTAS
          </a>`,
  },
  {
    name: 'menu+accent-emerald', // js/header.js
    hoverToo: 'a',
    before: `<a href="\${CONFIG.BASE}/oportunidades.html" class="px-4 py-3 rounded-lg text-sm font-bold text-gray-300 hover:text-[var(--color-emerald)] hover:bg-white/5">
            <i class="fas fa-briefcase mr-2"></i> CHANCES
          </a>`,
    after: `<a href="\${CONFIG.BASE}/oportunidades.html" class="ui-btn ui-btn--menu ui-btn--accent-emerald">
            <i class="fas fa-briefcase mr-2"></i> CHANCES
          </a>`,
  },
  {
    name: 'menu+accent-cyan--flex-items-center-gap-3', // js/header.js
    hoverToo: 'a',
    before: `<a href="\${CONFIG.BASE}/profile.html?user=\${encodeURIComponent(user?.username || '')}" class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-gray-300 hover:text-[var(--color-cyan)] hover:bg-white/5">
            \${user?.avatar ? \`
              <img src="\${sanitizeUrl(user.avatar)}" alt="\${escapeHTML(user.username)}" class="w-8 h-8 rounded-full object-cover border border-cyan-500/30">
            \` : \`
              <div class="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <i class="fas fa-user-astronaut text-xs"></i>
              </div>
            \`}
            <span class="uppercase">\${escapeHTML(user?.displayName || user?.username || 'MI PERFIL')}</span>
          </a>`,
    after: `<a href="\${CONFIG.BASE}/profile.html?user=\${encodeURIComponent(user?.username || '')}" class="flex items-center gap-3 ui-btn ui-btn--menu ui-btn--accent-cyan">
            \${user?.avatar ? \`
              <img src="\${sanitizeUrl(user.avatar)}" alt="\${escapeHTML(user.username)}" class="w-8 h-8 rounded-full object-cover border border-cyan-500/30">
            \` : \`
              <div class="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <i class="fas fa-user-astronaut text-xs"></i>
              </div>
            \`}
            <span class="uppercase">\${escapeHTML(user?.displayName || user?.username || 'MI PERFIL')}</span>
          </a>`,
  },
  // recursos.html filterRecursos(): el activo pierde bg-white/5 text-gray-400
  // border-white/10 y gana bg-cyan-500/20 text-[var(--color-cyan)] border-cyan-500/30.
  {
    name: 'filter-toggled-on',
    hoverToo: 'button',
    before: `<button onclick="filterRecursos('software')" class="filter-btn px-4 py-2 rounded-lg text-sm font-medium border hover:bg-white/10 transition-all bg-cyan-500/20 text-[var(--color-cyan)] border-cyan-500/30">Software</button>`,
    after: `<button onclick="filterRecursos('software')" class="filter-btn ui-btn ui-btn--filter bg-cyan-500/20 text-[var(--color-cyan)] border-cyan-500/30">Software</button>`,
  },
  {
    name: 'filter-toggled-off',
    hoverToo: 'button',
    before: `<button onclick="filterRecursos('all')" class="filter-btn active px-4 py-2 rounded-lg text-sm font-medium border hover:bg-cyan-500/30 transition-all bg-white/5 text-gray-400 border-white/10">Todos</button>`,
    after: `<button onclick="filterRecursos('all')" class="filter-btn active ui-btn ui-btn--filter hover:bg-cyan-500/30 bg-white/5 text-gray-400 border-white/10">Todos</button>`,
  },
  // profile.html switchTab(): quita/agrega text-gray-500 y text-[var(--color-cyan)] border-primary-500 active.
  {
    name: 'tab-underline-toggled-on',
    hoverToo: 'button',
    before: `<button onclick="switchTab('recursos')" id="tab-recursos" class="tab-btn px-6 py-4 text-sm font-bold hover:text-white whitespace-nowrap transition-all active text-[var(--color-cyan)] border-primary-500">
        <i class="fas fa-box-open mr-2"></i>RECURSOS
      </button>`,
    after: `<button onclick="switchTab('recursos')" id="tab-recursos" class="tab-btn ui-btn ui-btn--tab-underline hover:text-white active text-[var(--color-cyan)] border-primary-500">
        <i class="fas fa-box-open mr-2"></i>RECURSOS
      </button>`,
  },
  {
    name: 'tab-underline-toggled-off',
    hoverToo: 'button',
    before: `<button onclick="switchTab('obras')" id="tab-obras" class="tab-btn px-6 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all text-gray-500">
        <i class="fas fa-palette mr-2"></i>OBRAS
      </button>`,
    after: `<button onclick="switchTab('obras')" id="tab-obras" class="tab-btn ui-btn ui-btn--tab-underline border-b-2 text-gray-500">
        <i class="fas fa-palette mr-2"></i>OBRAS
      </button>`,
  },
  // admin.html switchTab(): quita/agrega bg-cyan-500 text-black y text-gray-400.
  {
    name: 'tab-pill-toggled-on',
    hoverToo: 'button',
    before: `<button onclick="switchTab('posts')" id="tab-posts" class="tab-btn px-6 py-2 rounded-lg font-bold text-sm transition-all hover:text-white bg-cyan-500 text-black">Posteos</button>`,
    after: `<button onclick="switchTab('posts')" id="tab-posts" class="tab-btn ui-btn ui-btn--tab-pill hover:text-white bg-cyan-500 text-black">Posteos</button>`,
  },
  {
    name: 'tab-pill-toggled-off',
    hoverToo: 'button',
    before: `<button onclick="switchTab('users')" id="tab-users" class="tab-btn px-6 py-2 rounded-lg font-bold text-sm transition-all text-gray-400">Usuarios</button>`,
    after: `<button onclick="switchTab('users')" id="tab-users" class="tab-btn ui-btn ui-btn--tab-pill text-gray-400">Usuarios</button>`,
  },
  // crear-oportunidad.html: el JS le saca `hidden` al botón de quitar parámetro.
  {
    name: 'icon-remove-shown',
    hoverToo: 'button',
    before: `<button type="button" class="remove-param-btn w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center">
                    <i class="fas fa-trash text-xs"></i>
                  </button>`,
    after: `<button type="button" class="remove-param-btn ui-btn ui-btn--icon-remove">
                    <i class="fas fa-trash text-xs"></i>
                  </button>`,
  },
  // Botones deshabilitados de la paginación.
  {
    name: 'pager-disabled',
    before: `<button onclick="changePage(-1)" id="prev-btn" disabled class="px-4 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all disabled:opacity-50">
            <i class="fas fa-chevron-left"></i>
          </button>`,
    after: `<button onclick="changePage(-1)" id="prev-btn" disabled class="ui-btn ui-btn--pager">
            <i class="fas fa-chevron-left"></i>
          </button>`,
  },
  {
    name: 'pager-caps-disabled',
    before: `<button id="prev-month-btn" disabled class="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-yellow-500/30 transition-all font-black text-sm uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed">
                        <i class="fas fa-chevron-left mr-2"></i>Anterior
                    </button>`,
    after: `<button id="prev-month-btn" disabled class="ui-btn ui-btn--pager-caps">
                        <i class="fas fa-chevron-left mr-2"></i>Anterior
                    </button>`,
  },
];

module.exports = cases.flatMap(({ hoverToo, ...c }) => {
  const base = { wrapper, scripts: [], ...c };
  return hoverToo ? [base, { ...base, name: `${c.name}--hover`, hover: hoverToo }] : [base];
});
