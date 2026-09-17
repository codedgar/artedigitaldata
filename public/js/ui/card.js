// Tarjetas de contenido: obra, recurso, evento, oportunidad, y las tarjetas
// mixtas del feed, favoritos, entradas y efectos visuales.
//
//   UI.PostCard({ post: p, variant: 'gallery', youtubeId })                  // obras
//   UI.PostCard({ post: p, variant: 'profile', youtubeId, canEdit })         // perfil
//   UI.PostCard({ post: p, variant: 'contest' })                             // perfil, concursos
//   UI.PostCard({ post: p, variant: 'search', youtubeId })                   // búsqueda
//   UI.RecursoCard({ recurso: r, variant: 'gallery', youtubeId, typeIcon, typeTone })
//   UI.RecursoCard({ recurso: r, variant: 'profile', youtubeId, canEdit })
//   UI.RecursoCard({ recurso: r, variant: 'search' })
//   UI.EventoCard({ evento: ev, variant: 'gallery', youtubeId, canManage })  // eventos
//   UI.EventoCard({ evento: ev, variant: 'profile', youtubeId, isDoorEvent, canEdit })
//   UI.EventoCard({ evento: e, variant: 'search', youtubeId })
//   UI.OportunidadCard({ oportunidad: opo, variant: 'gallery', tone, typeLabel, typeIcon })
//   UI.OportunidadCard({ oportunidad: opo, variant: 'profile', typeLabel, typeIcon, canEdit })
//   UI.FeedCard({ item, youtubeId, isLiked, canPin })                        // home, feed
//   UI.FeaturedCard({ item: ev, youtubeId, canUnpin })                       // home, destacados
//   UI.FavoriteCard({ item, youtubeId })
//   UI.TicketCard({ ticket: t, mapsUrl })
//   UI.VisualEffectCard({ effect: fx, canEdit })
//
// Los datos de sesión (`canEdit`, `isLiked`…) y el `youtubeId` los calcula la
// página. Los botones de editar/borrar siguen llamando a las funciones globales
// de cada página (`openEditPost('id')`, `deletePost('id')`…) con IDs de Mongo.
//
// Las variantes reproducen el markup exacto de cada página (fase 1), así que
// hay tarjetas casi iguales: se consolidan en fase 2. Las clases `*-magenta-*`
// no existen en la paleta de Tailwind y nunca pintaron nada; las que estaban
// escritas tal cual se conservan, y en los mapas de tonos se omiten.
//
// Primitivas en src/styles/components/card.css. Requiere js/ui/core.js,
// avatar.js, badge.js y media.js; las variantes con menciones (obras, recursos,
// feed, destacados) usan formatMentions de js/tagging.js.
(function () {
  const { html, raw, cx } = UI;

  // Un `${x}` de template literal imprime "undefined"; `html` no imprime nada.
  // Se usa donde la página mostraba el valor aunque faltara ("Por undefined").
  const asText = (value) => `${value}`;

  // ---------------------------------------------------------------- Obras

  function PostCard({ post: p, variant, youtubeId, canEdit = false } = {}) {
    if (variant === 'gallery') {
      return html`
          <div class="ui-card ui-card--tile ui-card--edge-cyan card-cyber group">
            <div class="relative aspect-video overflow-hidden">
              ${UI.MediaThumb({ variant: 'post-gallery', imageUrl: p.imageUrl, alt: p.title, youtubeId, fallbackIcon: 'fas fa-palette', link: `post.html?id=${p._id}` })}
            </div>
            <div class="p-5 flex-1 flex flex-col">
              <div class="flex items-center gap-3 mb-3">
                ${UI.Avatar({ name: p.author?.username, variant: 'author', size: 'lg' })}
                <div>
                  <a href="${CONFIG.BASE}/profile.html?user=${asText(p.author?.username)}" class="text-sm font-medium text-cyan-400">
                    ${p.author?.username || 'Anónimo'}
                  </a>
                  <p class="text-[10px] text-gray-500">${new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <h3 class="ui-title ui-title--card mb-2 line-clamp-1">${p.title}</h3>
              <p class="text-gray-400 text-sm mb-3 line-clamp-2">${raw(formatMentions(p.description))}</p>
              <div class="mt-auto flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-white/5">
                ${UI.Stats({ likes: p.likes?.length || 0, comments: p.comments?.length || 0 })}
              </div>
            </div>
          </div>
        `;
    }
    if (variant === 'profile') {
      return html`
          <div class="ui-card ui-card--media ui-card--edge-cyan card-cyber group">
            <div class="relative aspect-video overflow-hidden">
              ${UI.MediaThumb({ variant: 'post-profile', imageUrl: p.imageUrl, alt: p.title, youtubeId, fallbackIcon: 'fas fa-palette', link: `post?id=${p._id}` })}
            </div>
            <div class="p-4">
              <div class="flex items-start justify-between gap-2 mb-1">
                <a href="post?id=${p._id}" target="_blank" class="block hover:text-[var(--color-cyan)] transition-colors flex-1">
                  <h3 class="font-bold text-white line-clamp-1">${p.title}</h3>
                </a>
                ${canEdit && html`
                  <div class="flex gap-1">
                    <button onclick="openEditPost('${p._id}')" class="ui-btn ui-btn--icon-edit ui-btn--icon-edit-cyan" title="Editar"><i class="fas fa-edit text-xs"></i></button>
                    <button onclick="deletePost('${p._id}')" class="ui-btn ui-btn--icon-delete" title="Eliminar"><i class="fas fa-trash-alt text-xs"></i></button>
                  </div>
                `}
              </div>
              <p class="text-gray-400 text-sm line-clamp-2">${p.description || ''}</p>
              <div class="flex items-center gap-3 mt-3 text-xs text-gray-500">
                <span><i class="fas fa-heart text-fuchsia-400 mr-1"></i>${p.likes?.length || 0}</span>
                <a href="post?id=${p._id}" target="_blank" class="hover:text-cyan-400"><i class="fas fa-comment mr-1"></i>${p.comments?.length || 0}</a>
                <span>${new Date(p.createdAt).toLocaleDateString('es-AR')}</span>
              </div>
            </div>
          </div>`;
    }
    if (variant === 'contest') {
      return html`
          <div class="rounded-2xl overflow-hidden border border-yellow-500/20 card-cyber group relative">
            <div class="absolute top-3 left-3 z-10">
              <span class="px-2 py-1 rounded-lg bg-yellow-500 text-black text-[9px] font-black uppercase tracking-widest shadow-lg">
                ${p.contestMonth || 'CONCURSO'}
              </span>
            </div>
            <div class="relative aspect-square overflow-hidden cursor-pointer" onclick="window.location.href='post?id=${p._id}'">
              <img src="${asText(p.imageUrl)}" alt="${p.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <h4 class="text-white font-bold truncate">${p.title}</h4>
                <div class="flex items-center gap-2 text-xs text-yellow-500 font-bold">
                  <i class="fas fa-heart"></i> ${p.likes?.length || 0} VOTOS
                </div>
              </div>
            </div>
          </div>`;
    }
    if (variant === 'search') {
      return html`
                <div class="flex gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-magenta-500/30 transition-all cursor-pointer"
                     onclick="window.location.href='post.html?id=${p.id}'">
                  <div class="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative"
                       ${UI.videoHover(youtubeId, { isolated: true })}>
                    <img src="${p.image || 'img/artedigital.png'}" class="w-full h-full object-cover">
                    ${youtubeId && UI.VideoOverlay()}
                  </div>
                  <div class="flex-1 min-w-0 py-1">
                    <h3 class="text-white font-bold truncate">${p.label}</h3>
                    <p class="text-magenta-400 text-xs mt-1">por @${asText(p.author)}</p>
                    <p class="text-gray-500 text-[10px] mt-2">${new Date(p.date).toLocaleDateString()}</p>
                  </div>
                </div>
              `;
    }
    return html``;
  }

  // ------------------------------------------------------------- Recursos

  // Íconos del tipo de recurso en los resultados de búsqueda.
  const SEARCH_RESOURCE_ICON = { github: 'fas fa-code-branch', drive: 'fas fa-hdd' };

  // `typeIcon` y `typeTone` salen de los mapas de la página de recursos.
  function RecursoCard({ recurso: r, variant, youtubeId, typeIcon, typeTone, canEdit = false } = {}) {
    if (variant === 'gallery') {
      return html`
          <div class="ui-card ui-card--tile ui-card--edge-cyan card-cyber group">
            <div class="relative aspect-video overflow-hidden border-b border-white/5">
              ${UI.MediaThumb({ variant: 'recurso-gallery', imageUrl: r.imageUrl, alt: r.title, youtubeId, fallbackIcon: typeIcon, link: `recurso.html?id=${r._id}` })}
            </div>
            <a href="recurso.html?id=${r._id}" class="p-6 flex-1 flex flex-col">
              <div class="flex items-center gap-2 mb-4">
                ${UI.TypeBadge({ label: r.type, icon: typeIcon, tone: typeTone })}
              </div>
              <h3 class="ui-title ui-title--section-strong mb-2 leading-tight group-hover:text-cyan-400 transition-colors line-clamp-1">${r.title}</h3>
              <p class="text-gray-400 text-sm mb-5 line-clamp-2 leading-relaxed">${raw(formatMentions(r.description))}</p>

              <div class="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                ${UI.AuthorLine({ username: r.author?.username, size: 'md' })}
                <div class="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                  ${UI.Stats({ likes: r.likes?.length || 0, comments: r.comments?.length || 0 })}
                </div>
              </div>
            </a>
          </div>
        `;
    }
    if (variant === 'profile') {
      return html`
          <div class="ui-card ui-card--padded ui-card--edge-orange card-cyber group">
             <div class="relative aspect-video w-full overflow-hidden rounded-xl mb-4">
               ${UI.MediaThumb({ variant: 'recurso-profile', imageUrl: r.imageUrl, alt: r.title, youtubeId, fallbackIcon: 'fas fa-box-open', link: `recurso?id=${r._id}` })}
             </div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <a href="recurso?id=${r._id}" target="_blank" class="block hover:text-orange-400 transition-colors flex-1">
                <h3 class="font-bold text-white line-clamp-1">${r.title}</h3>
              </a>
              ${canEdit && html`
                <div class="flex gap-1">
                  <button onclick="openEditRecurso('${r._id}')" class="ui-btn ui-btn--icon-edit ui-btn--icon-edit-orange" title="Editar"><i class="fas fa-edit text-xs"></i></button>
                  <button onclick="deleteRecurso('${r._id}')" class="ui-btn ui-btn--icon-delete" title="Eliminar"><i class="fas fa-trash-alt text-xs"></i></button>
                </div>
              `}
            </div>
            <p class="text-xs text-gray-400 line-clamp-2 mb-3">${r.description || ''}</p>
            <div class="flex items-center gap-2 mb-3"><span class="px-2 py-0.5 rounded text-[10px] bg-orange-500/10 text-orange-400 uppercase font-bold">${asText(r.type)}</span></div>
            <div class="flex items-center justify-between text-[10px] text-gray-500 pt-3 border-t border-white/5">${UI.Stat({ kind: 'comments', count: r.comments?.length || 0 })}<span>${new Date(r.createdAt).toLocaleDateString()}</span></div>
          </div>`;
    }
    if (variant === 'search') {
      return html`
                <a href="recursos.html" class="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <i class="${SEARCH_RESOURCE_ICON[r.resourceType] || 'fas fa-link'}"></i>
                    </div>
                    <h3 class="ui-title ui-title--card-sm truncate">${r.label}</h3>
                  </div>
                  <p class="text-gray-500 text-xs">@${asText(r.author)}</p>
                </a>
              `;
    }
    return html``;
  }

  // -------------------------------------------------------------- Eventos

  // Perfil: eventos propios (magenta, que nunca generó CSS) o de puerta (cyan).
  const PROFILE_EVENT = {
    own: { border: 'border-magenta-500/10 hover:border-magenta-500/30', date: 'bg-magenta-500/20 text-magenta-400' },
    door: { border: 'border-cyan-500/20 hover:border-cyan-500/40', date: 'bg-cyan-500/20 text-cyan-400' },
  };

  function EventoCard({ evento: ev, variant, youtubeId, canManage = false, canEdit = false, isDoorEvent = false } = {}) {
    if (variant === 'gallery') {
      return html`
            <div class="rounded-3xl overflow-hidden border border-white/5 card-cyber flex flex-col h-full hover:border-[var(--color-magenta)] group">
              <div class="relative aspect-video overflow-hidden">
                ${UI.MediaThumb({ variant: 'evento-gallery', imageUrl: ev.imageUrl, alt: ev.title, youtubeId, fallbackIcon: 'fas fa-calendar-alt', link: `evento.html?id=${ev._id}` })}
              </div>
              <div class="p-6 flex-1 flex flex-col">
                <div class="flex items-center justify-between mb-4">
                  <span class="px-3 py-1 bg-magenta-500/20 text-magenta-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                    ${new Date(ev.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                  </span>
                  <span class="text-xs text-gray-500">Por ${asText(ev.creator?.username)}</span>
                </div>
                <h3 class="ui-title ui-title--section mb-2">${asText(ev.title)}</h3>
                <p class="text-gray-400 text-sm mb-4 line-clamp-2">${ev.description || ''}</p>

                <div class="flex items-center gap-2 text-xs text-gray-500 mb-6">
                  <i class="fas fa-clock text-magenta-500"></i>
                  <span>${new Date(ev.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs</span>
                  <i class="fas fa-map-marker-alt text-magenta-500 ml-2"></i>
                  <span class="truncate">${ev.location || 'Virtual'}</span>
                </div>

                <div class="mt-auto">
                  <h4 class="ui-eyebrow ui-eyebrow--field-wide mb-3">Participantes</h4>
                  <div class="flex flex-wrap gap-2">
                    ${ev.participants?.length ? ev.participants.map((p) => html`
                      <a href="profile.html?user=${asText(p.username)}" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500 transition-all">
                        <div class="w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center text-[8px] font-black text-black">
                          ${p.username[0].toUpperCase()}
                        </div>
                        <span class="text-[10px] text-gray-300 font-medium">${p.username}</span>
                      </a>
                    `) : html`<span class="text-xs text-gray-600 italic">No hay participantes etiquetados</span>`}
                  </div>
                </div>
              </div>
              ${canManage && html`
                <div class="flex flex-col gap-1">
                  ${ev.ticketConfig?.enabled && html`
                    <a href="event-tickets.html?event=${ev._id}" class="p-3 bg-green-500/10 text-green-400 hover:bg-green-500 transition-all hover:text-white text-xs font-bold w-full text-center flex items-center justify-center gap-2">
                      <i class="fas fa-ticket-alt"></i>ADMINISTRAR ENTRADAS
                    </a>
                  `}
                  <button onclick="deleteEvent('${ev._id}')" class="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 transition-all hover:text-white text-xs font-bold w-full">
                    ELIMINAR EVENTO
                  </button>
                </div>
              `}
            </div>
          `;
    }
    if (variant === 'profile') {
      const tone = PROFILE_EVENT[isDoorEvent ? 'door' : 'own'];
      return html`
        <div class="rounded-2xl p-5 border ${tone.border} bg-white/5 transition-all flex flex-col h-full group">
          <div class="relative aspect-video w-full overflow-hidden rounded-xl mb-4">
             ${UI.MediaThumb({ variant: 'evento-profile', imageUrl: ev.imageUrl, alt: ev.title, youtubeId, fallbackIcon: 'fas fa-calendar-alt', link: `evento?id=${ev._id}` })}
          </div>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg ${tone.date} flex flex-col items-center justify-center font-bold shrink-0">
               <span class="text-[10px] leading-none uppercase">${new Date(ev.date).toLocaleDateString('es-AR', { month: 'short' })}</span>
               <span class="text-sm leading-none">${new Date(ev.date).getDate()}</span>
            </div>
            <div class="flex-1 min-w-0">
              <a href="evento?id=${ev._id}" target="_blank"><h3 class="font-bold text-white group-hover:text-magenta-400 transition-colors truncate">${asText(ev.title)}</h3></a>
              <p class="text-[10px] text-gray-500 truncate"><i class="fas fa-map-marker-alt mr-1"></i>${ev.location || 'Online'}</p>
            </div>
            <div class="flex gap-1 shrink-0">
              ${isDoorEvent && html`<a href="event-tickets?event=${ev._id}" class="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all text-xs font-bold flex items-center gap-1"><i class="fas fa-door-open"></i><span>Puerta</span></a>`}
              ${!isDoorEvent && canEdit && html`
                ${ev.ticketConfig?.enabled && html`<a href="event-tickets?event=${ev._id}" class="text-green-400 hover:text-green-300 transition-colors p-1"><i class="fas fa-ticket-alt text-xs"></i></a>`}
                <button onclick="openEditEvento('${ev._id}')" class="ui-btn ui-btn--icon-edit"><i class="fas fa-edit text-xs"></i></button>
                <button onclick="deleteEvento('${ev._id}')" class="ui-btn ui-btn--icon-delete"><i class="fas fa-trash-alt text-xs"></i></button>
              `}
            </div>
          </div>
          <p class="text-xs text-gray-400 line-clamp-2">${ev.description || ''}</p>
        </div>`;
    }
    if (variant === 'search') {
      return html`
                <div class="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-yellow-500/30 transition-all cursor-pointer"
                     onclick="window.location.href='evento.html?id=${ev.id}'">
                  <div class="w-12 h-12 rounded-xl bg-yellow-500/10 flex flex-col items-center justify-center text-yellow-500 shrink-0 relative overflow-hidden"
                       ${UI.videoHover(youtubeId, { isolated: true })}>
                    <div class="date-display text-center">
                      <span class="block text-xs font-bold leading-none">${new Date(ev.date).toLocaleDateString('es', { month: 'short' })}</span>
                      <span class="block text-lg font-black leading-none">${new Date(ev.date).getDate()}</span>
                    </div>
                    ${youtubeId && UI.VideoOverlay()}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-white font-bold group-hover:text-yellow-400 transition-colors truncate">${ev.label}</h3>
                    <p class="text-gray-500 text-xs truncate">${ev.desc || ''}</p>
                  </div>
                </div>
              `;
    }
    return html``;
  }

  // -------------------------------------------------------- Oportunidades

  // Tonos por tipo de oportunidad. Sólo las clases que generaban CSS cuando se
  // armaban por interpolación: `text-*-500/20` no se generaba para ningún color
  // y `magenta` no existe, así que esas quedan afuera.
  const OPPORTUNITY_TONE = {
    cyan: { card: 'ui-card--edge-cyan hover:border-cyan-500/30', fallback: 'bg-cyan-500/5', cta: 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500' },
    orange: { card: 'ui-card--edge-orange hover:border-orange-500/30', fallback: 'bg-orange-500/5', cta: 'bg-orange-500/10 text-orange-400 hover:bg-orange-500' },
    emerald: { card: 'ui-card--edge-emerald hover:border-emerald-500/30', fallback: 'bg-emerald-500/5', cta: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500' },
    magenta: { card: '', fallback: '', cta: '' },
  };

  // Datos propios de cada tipo, al pie de la tarjeta de la galería.
  function opportunityExtraInfo(opo) {
    const parts = [];
    if (opo.tipo === 'convocatoria_obra') {
      if (opo.lugarExposicion) parts.push(html`<span class="text-xs text-gray-500"><i class="fas fa-map-marker-alt mr-1"></i>${opo.lugarExposicion}</span>`);
      if (opo.fechaHasta) parts.push(html`<span class="text-xs text-gray-500 ml-3"><i class="fas fa-clock mr-1"></i>${new Date(opo.fechaHasta).toLocaleDateString('es-AR')}</span>`);
    } else if (opo.tipo === 'oportunidad_laboral') {
      if (opo.nombrePuesto) parts.push(html`<span class="text-xs text-gray-500"><i class="fas fa-user-tie mr-1"></i>${opo.nombrePuesto}</span>`);
      if (opo.productoraEmpresa) parts.push(html`<span class="text-xs text-gray-500 ml-3"><i class="fas fa-building mr-1"></i>${opo.productoraEmpresa}</span>`);
    } else if (opo.tipo === 'colaboracion') {
      if (opo.nombreProyecto) parts.push(html`<span class="text-xs text-gray-500"><i class="fas fa-project-diagram mr-1"></i>${opo.nombreProyecto}</span>`);
    }
    return parts;
  }

  function OportunidadCard({ oportunidad: opo, variant, tone, typeLabel, typeIcon, canEdit = false } = {}) {
    if (variant === 'gallery') {
      const t = OPPORTUNITY_TONE[tone] || {};
      const extraInfo = opportunityExtraInfo(opo);
      return html`
          <div class="${cx('ui-card ui-card--tile card-cyber group', t.card)}">
            ${opo.imagenUrl ? html`
              <div class="relative aspect-video overflow-hidden">
                <img src="${opo.imagenUrl}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="${opo.titulo}">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            ` : html`
              <div class="${cx('relative aspect-video overflow-hidden flex items-center justify-center', t.fallback)}">
                <i class="${cx(typeIcon, 'text-5xl')}"></i>
              </div>
            `}
            <div class="p-5 flex-1 flex flex-col">
              <div class="flex items-center gap-2 mb-3">
                ${UI.TypeBadge({ label: typeLabel, icon: typeIcon, tone })}
              </div>
              <h3 class="ui-title ui-title--card mb-2 line-clamp-1">${asText(opo.titulo)}</h3>
              <p class="text-gray-400 text-sm mb-3 line-clamp-2">${opo.descripcion || ''}</p>

              ${extraInfo.length > 0 && html`<div class="flex flex-wrap gap-2 mb-4">${extraInfo}</div>`}

              <div class="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
                ${UI.AuthorLine({ username: opo.creador?.username, size: 'sm' })}
                <span class="text-xs text-gray-500">
                  <i class="fas fa-users mr-1"></i>${opo.inscripciones?.length || 0}
                </span>
              </div>
            </div>
            <a href="oportunidad.html?id=${opo._id}" class="${cx('block p-3 transition-all text-xs font-bold w-full text-center hover:text-white', t.cta)}">
              VER OPORTUNIDAD <i class="fas fa-arrow-right ml-1"></i>
            </a>
          </div>
        `;
    }
    if (variant === 'profile') {
      return html`
          <div class="ui-card ui-card--padded ui-card--edge-emerald card-cyber group">
             <div class="relative aspect-video w-full overflow-hidden rounded-xl mb-4">
               ${UI.MediaThumb({ variant: 'oportunidad-profile', imageUrl: opo.imagenUrl, alt: opo.titulo, fallbackIcon: typeIcon, link: `oportunidad.html?id=${opo._id}` })}
             </div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <a href="oportunidad.html?id=${opo._id}" target="_blank" class="block hover:text-emerald-400 transition-colors flex-1">
                <h3 class="font-bold text-white line-clamp-1">${asText(opo.titulo)}</h3>
              </a>
              ${canEdit && html`
                <div class="flex gap-1">
                  <a href="crear-oportunidad.html?id=${opo._id}" class="text-gray-500 hover:text-emerald-400 transition-colors p-1" title="Editar"><i class="fas fa-edit text-xs"></i></a>
                  <button onclick="deleteOportunidad('${opo._id}')" class="ui-btn ui-btn--icon-delete" title="Eliminar"><i class="fas fa-trash-alt text-xs"></i></button>
                </div>
              `}
            </div>
            <div class="flex items-center gap-2 mb-3">
              <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 uppercase font-bold"><i class="${cx(typeIcon, 'mr-1')}"></i>${typeLabel}</span>
              <span class="text-[10px] text-gray-500">${opo.inscripciones?.length || 0} inscriptos</span>
            </div>
            <p class="text-xs text-gray-400 line-clamp-2 mb-3">${opo.descripcion || ''}</p>
            <div class="flex items-center justify-between text-[10px] text-gray-500 pt-3 border-t border-white/5">
              <span>${new Date(opo.createdAt).toLocaleDateString()}</span>
              <a href="postulantes.html?id=${opo._id}" target="_blank" class="text-emerald-400 hover:text-emerald-300 font-bold">Ver postulantes <i class="fas fa-arrow-right ml-1"></i></a>
            </div>
          </div>`;
    }
    return html``;
  }

  // ------------------------------------------------------- Feed de la home

  // Colores por tipo en el feed y en destacados (post·recurso·evento·oportunidad
  // → cyan·lime·fuchsia·gold). Sólo las clases que generaban CSS cuando se
  // armaban por interpolación; `lime` y `gold` sólo tienen 400 y 500 en el tema.
  const FEED_ACCENT = {
    cyan: { card: 'hover:border-cyan-500/30', badge: 'border-cyan-500/30 text-cyan-400', chip: 'bg-cyan-500/20 text-cyan-400', link: 'hover:text-cyan-400', title: 'group-hover:text-cyan-400', go: 'hover:bg-cyan-500' },
    lime: { card: 'hover:border-lime-500/30', badge: 'border-lime-500/30 text-lime-400', chip: 'text-lime-400', link: 'hover:text-lime-400', title: 'group-hover:text-lime-400', go: 'hover:bg-lime-500' },
    fuchsia: { card: 'hover:border-fuchsia-500/30', badge: 'border-fuchsia-500/30 text-fuchsia-400', chip: 'bg-fuchsia-500/20 text-fuchsia-400', link: 'hover:text-fuchsia-400', title: 'group-hover:text-fuchsia-400', go: 'hover:bg-fuchsia-500' },
    gold: { card: 'hover:border-gold-500/30', badge: 'border-gold-500/30 text-gold-400', chip: 'text-gold-400', link: 'hover:text-gold-400', title: 'group-hover:text-gold-400', go: 'hover:bg-gold-500' },
  };

  const FEATURED_ACCENT = {
    cyan: { card: 'border-cyan-500/30 hover:border-cyan-500/60', badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    lime: { card: 'border-lime-500/30', badge: 'text-lime-400 border-lime-500/30' },
    fuchsia: { card: 'border-fuchsia-500/30', badge: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30' },
    gold: { card: 'border-gold-500/30', badge: 'text-gold-400 border-gold-500/30' },
  };

  const FEED_KIND = {
    post: { accent: 'cyan', badge: 'OBRA', path: 'post.html' },
    recurso: { accent: 'lime', badge: 'RECURSO', path: 'recurso.html' },
    evento: { accent: 'fuchsia', badge: 'EVENTO', path: 'evento.html' },
    oportunidad: { accent: 'gold', badge: 'OPORTUNIDAD', path: 'oportunidad.html' },
  };

  const RESOURCE_ICON = { texto: 'fas fa-file-alt', software: 'fas fa-desktop', tutorial: 'fas fa-graduation-cap' };

  const OPPORTUNITY_SUBTYPE = { convocatoria_obra: 'Convocatoria de Obra', oportunidad_laboral: 'Oportunidad Laboral' };

  function authorOf(item) {
    if (typeof item.author === 'object' && item.author?.username) return item.author;
    if (typeof item.creator === 'object' && item.creator?.username) return item.creator;
    if (typeof item.creador === 'object' && item.creador?.username) return item.creador;
    return { username: 'Anónimo', avatar: '' };
  }

  function mentionsOr(text, fallback) {
    const formatted = formatMentions(text);
    return formatted ? raw(formatted) : fallback;
  }

  // Tarjeta del feed mixto. `item.feedType` es post·recurso·evento·oportunidad.
  function FeedCard({ item, youtubeId, isLiked = false, canPin = false } = {}) {
    const type = item.feedType;
    const kind = FEED_KIND[type] || FEED_KIND.oportunidad;
    const a = FEED_ACCENT[kind.accent];
    const link = `${kind.path}?id=${item._id}`;
    const author = authorOf(item);
    const title = item.title || item.titulo || 'Sin título';
    const description = item.description || item.descripcion || '';
    const date = new Date(item.createdAt || item.date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const imgUrl = item.imageUrl || item.imagenUrl;
    const fallbackIcon = type === 'post' ? 'fas fa-palette'
      : type === 'evento' ? 'fas fa-calendar-alt'
        : type === 'oportunidad' ? 'fas fa-briefcase'
          : (RESOURCE_ICON[item.type] || 'fas fa-box-open');
    const subcategoria = OPPORTUNITY_SUBTYPE[item.tipo] || 'Colaboración';
    const isVideoTitle = title && (title.includes('youtube.com') || title.includes('youtu.be'));

    return html`
      <div class="${cx('group rounded-[2rem] overflow-hidden border border-white/5 bg-[#0d0d12]/60 hover:bg-[#0d0d12]/80 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col h-full card-cyber', a.card)}">
        <div class="relative aspect-video overflow-hidden">
          ${UI.MediaThumb({ variant: 'feed', imageUrl: imgUrl, alt: title, youtubeId, fallbackIcon, link })}
          <div class="absolute top-4 right-4 z-10 flex flex-col items-end gap-1">
            <span class="${cx('px-3 py-1 rounded-full text-[10px] font-black border bg-black/60 backdrop-blur-md uppercase tracking-widest', a.badge)}">
              ${kind.badge}
            </span>
            ${type === 'oportunidad' && html`<span class="${cx('px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider', a.chip)}">${subcategoria}</span>`}
            ${canPin && html`
            <button onclick="event.stopPropagation(); pinItemFromFeed('${item._id}', '${type}')" class="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all flex items-center justify-center" title="Pinnar posteo destacado">
              <i class="fas fa-thumbtack text-[10px] transform rotate-45"></i>
            </button>
            `}
          </div>
        </div>
        <div class="p-6 flex-1 flex flex-col">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              ${UI.Avatar({ name: author.username, src: author.avatar, alt: author.username, variant: 'byline', size: 'xl' })}
              <div>
                <a href="profile.html?user=${encodeURIComponent(author.username)}" class="${cx('block text-sm font-bold text-white transition-colors', a.link)}">
                  ${author.username}
                </a>
                <span class="text-xs text-slate-300 font-semibold uppercase tracking-wider">${date}</span>
              </div>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="${cx('ui-title ui-title--section-strong mb-2 leading-tight transition-colors line-clamp-1', a.title)}">
              ${isVideoTitle ? html`
                <a href="${sanitizeUrl(title)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-600/10 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border border-red-500/20 hover:bg-red-600/20 transition-all cursor-alias">
                  <i class="fab fa-youtube text-xs"></i> Ver Video
                </a>
              ` : html`<a href="${link}" class="${cx('transition-colors', a.link)}">${title}</a>`}
            </h3>
            <p class="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
              ${mentionsOr(description, 'Sin descripción')}
            </p>
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-white/5">
            <div class="flex items-center gap-4">
              <button onclick="toggleFeedLike(event, '${item._id}', '${type}')" class="${cx('flex items-center gap-1.5 text-xs font-bold transition-colors', isLiked ? 'text-red-500' : 'text-gray-500 hover:text-cyan-400')}">
                <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                <span class="like-count">${item.likes?.length || 0}</span>
              </button>
              <a href="${link}" class="flex items-center gap-1.5 text-xs text-gray-500 font-bold hover:text-magenta-400 transition-colors">
                <i class="fas fa-comment"></i> ${item.comments?.length || 0}
              </a>
            </div>
            <a href="${link}" class="${cx('w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white hover:text-black transition-all', a.go)}">
              <i class="fas fa-arrow-right text-xs"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Tarjeta de un destacado (pinneado) de la home. El tipo se deduce igual que
  // antes: `feedType` si viene, si no por los campos del item. Las condiciones
  // no son excluyentes y el orden de los ternarios decide.
  function FeaturedCard({ item: ev, youtubeId, canUnpin = false } = {}) {
    const isEvento = ev.feedType === 'evento' || (!ev.feedType && ev.date);
    const isOportunidad = ev.feedType === 'oportunidad' || ev.tipo;
    const isPost = ev.feedType === 'post' || (!ev.feedType && !ev.url && !ev.date && !ev.tipo);
    const isRecurso = ev.feedType === 'recurso' || ev.url;

    const link = isPost ? `post.html?id=${ev._id}`
      : isRecurso ? `recurso.html?id=${ev._id}`
        : isEvento ? `evento.html?id=${ev._id}` : `oportunidad.html?id=${ev._id}`;
    const accent = FEATURED_ACCENT[isPost ? 'cyan' : (isRecurso ? 'lime' : (isEvento ? 'fuchsia' : 'gold'))];
    const badgeText = isPost ? 'OBRA DESTACADA' : (isRecurso ? 'RECURSO DESTACADO' : (isEvento ? 'EVENTO DESTACADO' : 'DESTACADO'));
    const title = ev.title || ev.titulo || 'Sin título';
    const description = ev.description || ev.descripcion || '';
    const author = ev.author || ev.creator || ev.creador || { username: 'Anónimo' };
    const dateStr = ev.date ? new Date(ev.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }) : (ev.createdAt ? new Date(ev.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }) : '');
    const imgUrl = ev.imageUrl || ev.imagenUrl;
    const typeKey = ev.feedType || (isEvento ? 'evento' : (isOportunidad ? 'oportunidad' : (isRecurso ? 'recurso' : 'post')));
    const fallbackIcon = isPost ? 'fas fa-palette' : (isEvento ? 'fas fa-calendar-alt' : (isOportunidad ? 'fas fa-briefcase' : 'fas fa-box-open'));

    return html`
      <div class="${cx('group rounded-2xl overflow-hidden border-2 bg-[#0d0d12]/80 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col h-full card-cyber relative', accent.card)}">
        ${canUnpin ? html`
          <div class="absolute top-3 right-3 z-20">
            <button onclick="unpinItem('${ev._id}', '${typeKey}')" class="w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center" title="Despinnar posteo">
              <i class="fas fa-thumbtack transform rotate-45 text-xs"></i>
            </button>
          </div>
        ` : html`
          <div class="absolute top-3 right-3 z-20">
            <span class="${cx('px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border', accent.badge)}">
              <i class="fas fa-thumbtack mr-1"></i>${badgeText}
            </span>
          </div>
        `}
        <div class="relative aspect-video overflow-hidden">
          ${UI.MediaThumb({ variant: 'featured', imageUrl: imgUrl, alt: title, youtubeId, fallbackIcon, link })}
        </div>
        <div class="p-5 flex-1 flex flex-col">
          ${dateStr && html`
          <div class="flex items-center gap-2 mb-3">
            <span class="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-bold uppercase tracking-wider">
              ${dateStr}
            </span>
            ${ev.date && html`<span class="text-xs text-gray-500">${new Date(ev.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs</span>`}
          </div>
          `}
          <h3 class="ui-title ui-title--card-strong mb-2 leading-tight group-hover:text-cyan-400 transition-colors line-clamp-1">
            ${title}
          </h3>
          <p class="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
            ${mentionsOr(description, 'Sin descripción')}
          </p>
          ${isEvento && html`
          <div class="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <i class="fas fa-map-marker-alt text-cyan-500"></i>
            <span class="truncate">${ev.location || 'Virtual'}</span>
          </div>
          `}
          <div class="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <div class="flex items-center gap-3">
              ${UI.Avatar({ name: author.username, src: author.avatar, alt: author.username, variant: 'byline', size: 'lg' })}
              <span class="text-xs font-bold text-gray-400">${author.username || 'Anónimo'}</span>
            </div>
            ${ev.ticketConfig?.enabled ? html`
              <a href="ticket-purchase?event=${ev._id}" class="group relative flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-magenta-500 to-fuchsia-500 text-white text-xs font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)] overflow-hidden">
                <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                <i class="fas fa-ticket-alt"></i>
                ${ev.ticketConfig.price === 0 ? 'RESERVAR' : 'COMPRAR'}
              </a>
            ` : html`
              <a href="${link}" class="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold hover:bg-cyan-500 hover:text-black transition-all">
                Ver más <i class="fas fa-arrow-right ml-1"></i>
              </a>
            `}
          </div>
        </div>
      </div>
    `;
  }

  // ------------------------------------------------------------ Perfil

  // Favoritos: cyan obra · orange recurso · magenta evento (sin CSS).
  const FAVORITE = {
    post: { card: 'ui-card--edge-cyan', chip: 'text-cyan-400', title: 'group-hover:text-cyan-400', icon: 'fas fa-palette', path: 'post' },
    recurso: { card: 'ui-card--edge-orange', chip: 'text-orange-400', title: 'group-hover:text-orange-400', icon: 'fas fa-box-open', path: 'recurso' },
    evento: { card: '', chip: '', title: '', icon: 'fas fa-calendar-alt', path: 'evento' },
  };

  // `item.type` es post·recurso·evento; cualquier otro valor se muestra como evento.
  function FavoriteCard({ item, youtubeId } = {}) {
    const f = FAVORITE[item.type] || FAVORITE.evento;
    const link = `${f.path}?id=${item._id}`;
    const chip = html`<div class="absolute top-3 left-3 z-10"><span class="${cx('px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest', f.chip)}">${asText(item.type)}</span></div>`;
    return html`
          <div class="${cx('rounded-2xl overflow-hidden border card-cyber group', f.card)}">
            ${UI.MediaThumb({ variant: 'favorite', imageUrl: item.imageUrl, youtubeId, fallbackIcon: f.icon, link, children: chip })}
            <div class="p-4"><a href="${link}" target="_blank" class="block"><h3 class="${cx('font-bold text-white transition-colors truncate mb-1', f.title)}">${asText(item.title)}</h3></a><p class="text-[10px] text-gray-500 flex items-center gap-2"><i class="fas fa-user-circle"></i> @${(item.author || item.creator)?.username || 'anónimo'}</p></div>
          </div>`;
  }

  const TICKET_STATUS = {
    redeemed: { label: 'Canjeada', badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: 'fa-check-double' },
    pending: { label: 'Pago Pendiente', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: 'fa-clock' },
    valid: { label: 'Válida', badge: 'bg-green-500/20 text-green-400 border-green-500/30', icon: 'fa-check' },
  };

  // Entrada comprada. Si el evento se borró muestra la versión "no disponible".
  // `mapsUrl` es el link a Google Maps de la ubicación (lo arma la página).
  function TicketCard({ ticket: t, mapsUrl } = {}) {
    const ev = t.event;
    if (!ev) {
      return html`
            <div class="rounded-2xl border border-white/10 bg-black/40 overflow-hidden hover:border-red-500/30 transition-all opacity-60">
              <div class="flex flex-col md:flex-row">
                <div class="md:w-48 h-32 md:h-auto shrink-0 relative bg-gray-900 flex items-center justify-center">
                  <i class="fas fa-calendar-times text-3xl text-gray-600"></i>
                </div>
                <div class="flex-1 p-5">
                  <p class="text-lg font-bold text-gray-500">Evento eliminado</p>
                  <p class="text-sm text-gray-600 mt-1">Código: ${asText(t.code)}</p>
                  <div class="flex gap-3 mt-4 pt-4 border-t border-white/5">
                    <span class="px-3 py-1.5 rounded-lg bg-gray-500/10 text-gray-500 border border-gray-500/20 text-xs font-bold">
                      <i class="fas fa-ban mr-1"></i>No disponible
                    </span>
                  </div>
                </div>
              </div>
            </div>
          `;
    }
    const isRedeemed = t.redeemed;
    const isFree = t.paymentStatus === 'free' || t.paymentStatus === 'completed';
    // El QR es una URL `data:` que genera el servidor: `html` la vaciaría por
    // estar al comienzo de un src, así que se escapa a mano.
    const qrSrc = raw(escapeHTML(asText(t.qrData)));
    const status = TICKET_STATUS[isRedeemed ? 'redeemed' : (t.paymentStatus === 'pending' ? 'pending' : 'valid')];

    return html`
          <div class="rounded-2xl border border-white/10 bg-black/40 overflow-hidden hover:border-fuchsia-500/30 transition-all">
            <div class="flex flex-col md:flex-row">
              <div class="md:w-48 h-32 md:h-auto shrink-0 relative">
                ${ev.imageUrl
                  ? html`<img src="${ev.imageUrl}" alt="${asText(ev.title)}" class="w-full h-full object-cover">`
                  : html`<div class="w-full h-full bg-fuchsia-500/10 flex items-center justify-center"><i class="fas fa-calendar-alt text-3xl text-fuchsia-500/30"></i></div>`
                }
                <div class="absolute top-2 left-2">
                  <span class="px-2 py-1 rounded-lg ${status.badge} text-xs font-bold border">
                    <i class="fas ${status.icon} mr-1"></i>${status.label}
                  </span>
                </div>
              </div>

              <div class="flex-1 p-5">
                <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <a href="evento?id=${ev._id || ev.id}" class="text-lg font-bold text-white hover:text-fuchsia-400 transition-colors">
                      ${asText(ev.title)}
                    </a>
                    <p class="text-sm text-gray-500 mt-1">
                      <i class="fas fa-calendar mr-1"></i>
                      ${new Date(ev.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    ${ev.location ? html`
                      <a href="${mapsUrl}" target="_blank" class="inline-flex items-center gap-2 mt-2 ui-btn ui-btn--map">
                        <i class="fas fa-map-marker-alt"></i>Ver en Google Maps
                      </a>
                    ` : html`<p class="text-sm text-gray-500"><i class="fas fa-map-marker-alt mr-1"></i>Online</p>`}
                  </div>

                  <div class="flex items-center gap-4">
                    <div class="text-center">
                      <div class="inline-block p-2 bg-white rounded-lg mb-2">
                        <img src="${qrSrc}" alt="QR" class="w-16 h-16">
                      </div>
                      <p class="text-xs font-mono text-fuchsia-400">${asText(t.code)}</p>
                    </div>
                  </div>
                </div>

                <div class="flex gap-3 mt-4 pt-4 border-t border-white/10">
                  <a href="ticket-success?ticket=${t.code}" class="flex-1 px-4 py-2 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30 hover:bg-fuchsia-500/20 transition-all text-sm font-bold text-center">
                    <i class="fas fa-eye mr-1"></i>Ver Entrada
                  </a>
                  ${!isRedeemed && isFree && html`
                    <button onclick="downloadTicketQR('${t.code}')" class="px-4 py-2 rounded-xl bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-all text-sm">
                      <i class="fas fa-download"></i>
                    </button>
                  `}
                </div>
              </div>
            </div>
          </div>
        `;
  }

  // Proyecto guardado del editor de efectos visuales.
  function VisualEffectCard({ effect: fx, canEdit = false } = {}) {
    const wordsList = (fx.flyerWords || []).map((w) => w.text || w.word).filter(Boolean);
    const sampleWords = wordsList.slice(0, 5).join(', ') + (wordsList.length > 5 ? '...' : '');
    return html`
          <div class="ui-card ui-card--padded ui-card--edge-cyan card-cyber group flex flex-col justify-between">
            <div>
              <div class="flex items-start justify-between gap-2 mb-2">
                <h3 class="ui-title ui-title--card line-clamp-1 group-hover:text-cyan-400 transition-colors">${fx.title || 'Proyecto Flyer'}</h3>
                ${canEdit && html`
                  <button onclick="deleteVisualEffect('${fx._id}')" class="ui-btn ui-btn--icon-delete" title="Eliminar"><i class="fas fa-trash-alt text-xs"></i></button>
                `}
              </div>
              <div class="flex items-center gap-2 mb-3">
                <span class="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 uppercase font-bold">
                  <i class="fas fa-layer-group mr-1"></i>${wordsList.length} ${wordsList.length === 1 ? 'capa' : 'capas'}
                </span>
                <span class="text-[10px] text-gray-500">${new Date(fx.createdAt).toLocaleDateString()}</span>
              </div>
              <p class="text-xs text-gray-400 line-clamp-2 mb-4">
                <span class="text-cyan-400 font-semibold">Palabras:</span> ${sampleWords || 'Sin palabras'}
              </p>
            </div>
            <div class="flex gap-2 mt-2">
              <a href="visualeffects.html?id=${fx._id}" class="flex-1 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 rounded-xl text-center font-bold text-xs transition-all flex items-center justify-center gap-1.5">
                <i class="fas fa-edit"></i> Abrir Editor
              </a>
              <a href="outputeffect.html?id=${fx._id}" target="_blank" class="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-center font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5">
                <i class="fas fa-play"></i> Ver Output
              </a>
            </div>
          </div>`;
  }

  Object.assign(UI, { PostCard, RecursoCard, EventoCard, OportunidadCard, FeedCard, FeaturedCard, FavoriteCard, TicketCard, VisualEffectCard });
})();
