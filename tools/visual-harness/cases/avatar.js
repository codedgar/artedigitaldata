// Casos de UI.Avatar / AvatarContent / AuthorLine. `before` es el HTML literal
// de cada template en 75d8386 con datos de ejemplo en lugar de los `${…}`.
//
// `tight()` quita el espacio en blanco pegado a las etiquetas de apertura y
// cierre (la indentación del template). El comparador mira el `textContent` de
// cada elemento, así que "\n    A\n  " y "A" contarían como distintos aunque
// no se rendericen: todas las cajas que lo tenían son flex o contienen sólo
// bloques, donde ese espacio colapsa. Las capturas de página lo verifican con
// el espacio original.
const IMG = 'https://vps-4455523-x.dattaweb.com/artedigitaldata/img/uploads/general/8b3c8343-21ad-44e2-9df5-14a883187682.jpg';
const tight = (s) => s.replace(/(<[a-z][^>]*>)\s+/g, '$1').replace(/\s+(<\/[a-z]+>)/g, '$1');
const scripts = ['js/ui/avatar.js'];
const row = '<div class="flex items-center gap-3" style="width:400px">{}</div>';

const cases = [
  // obras.html — autor de la tarjeta (siempre inicial)
  {
    name: 'author-lg-obras',
    before: `<div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-cyan-500 text-black">
                  A
                </div>`,
    after: () => UI.Avatar({ name: 'agustin', variant: 'author', size: 'lg' }).toString(),
  },
  // post.html — lista de likes
  {
    name: 'author-md-likes-img',
    before: `<div class="w-7 h-7 rounded-full overflow-hidden bg-cyan-500 text-black flex items-center justify-center text-xs font-bold shrink-0">
            <img src="${IMG}" alt="agustin" class="w-full h-full object-cover">
          </div>`,
    after: `() => UI.Avatar({ name: 'agustin', src: '${IMG}', alt: 'agustin', variant: 'author', size: 'md' }).toString()`,
  },
  {
    name: 'author-md-likes-initial',
    before: `<div class="w-7 h-7 rounded-full overflow-hidden bg-cyan-500 text-black flex items-center justify-center text-xs font-bold shrink-0">
            A
          </div>`,
    after: () => UI.Avatar({ name: 'agustin', variant: 'author', size: 'md' }).toString(),
  },
  // post.html — autor del detalle
  {
    name: 'author-3xl-post-img',
    before: `<div class="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-lg font-bold bg-cyan-500 text-black shrink-0">

                    <img src="${IMG}" alt="agustin" class="w-full h-full object-cover">

                </div>`,
    after: `() => UI.Avatar({ name: 'agustin', src: '${IMG}', alt: 'agustin', variant: 'author', size: '3xl' }).toString()`,
  },
  {
    name: 'author-3xl-post-initial',
    before: `<div class="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-lg font-bold bg-cyan-500 text-black shrink-0">
                  A
                </div>`,
    after: () => UI.Avatar({ name: 'agustin', variant: 'author', size: '3xl' }).toString(),
  },
  // recursos.html — línea de autor
  {
    name: 'authorline-md-recursos',
    before: `<div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500">
                    A
                  </div>
                  <span class="text-xs text-gray-500 font-medium">@agustin</span>
                </div>`,
    after: () => UI.AuthorLine({ username: 'agustin', size: 'md' }).toString(),
  },
  {
    name: 'authorline-md-sin-autor',
    before: `<div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500">
                    ?
                  </div>
                  <span class="text-xs text-gray-500 font-medium">@anónimo</span>
                </div>`,
    after: () => UI.AuthorLine({ username: undefined, size: 'md' }).toString(),
  },
  // oportunidades.html — línea de autor
  {
    name: 'authorline-sm-oportunidades',
    before: `<div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[9px] font-bold text-gray-500">
                    M
                  </div>
                  <span class="text-xs text-gray-500 font-medium">@maria</span>
                </div>`,
    after: () => UI.AuthorLine({ username: 'maria', size: 'sm' }).toString(),
  },
  // js/index.js — tarjeta de destacado
  {
    name: 'byline-lg-index-img',
    before: `<div class="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-white/5 flex items-center justify-center">

                  <img src="${IMG}" alt="agustin" class="w-full h-full object-cover">

              </div>`,
    after: `() => UI.Avatar({ name: 'agustin', src: '${IMG}', alt: 'agustin', variant: 'byline', size: 'lg' }).toString()`,
  },
  {
    name: 'byline-lg-index-initial',
    before: `<div class="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-white/5 flex items-center justify-center">

                  <span class="text-[10px] font-bold text-gray-500">A</span>

              </div>`,
    after: () => UI.Avatar({ name: 'agustin', variant: 'byline', size: 'lg' }).toString(),
  },
  // js/index.js — tarjeta del feed
  {
    name: 'byline-xl-index-img',
    before: `<div class="w-9 h-9 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-inner bg-white/5">

                  <img src="${IMG}" alt="agustin" class="w-full h-full object-cover">

              </div>`,
    after: `() => UI.Avatar({ name: 'agustin', src: '${IMG}', alt: 'agustin', variant: 'byline', size: 'xl' }).toString()`,
  },
  {
    name: 'byline-xl-index-initial',
    before: `<div class="w-9 h-9 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-inner bg-white/5">

                  <div class="w-full h-full flex items-center justify-center text-xs font-bold bg-white/5 text-gray-500">
                    A
                  </div>

              </div>`,
    after: () => UI.Avatar({ name: 'agustin', variant: 'byline', size: 'xl' }).toString(),
  },
  // js/forms.js — chip de participante (armado por concatenación)
  {
    name: 'participant-xs-forms-initial',
    wrapper: '<div class="participant-chip flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white">{}</div>',
    before: '<div class="w-5 h-5 rounded-full bg-magenta-500/20 flex items-center justify-center text-[9px] font-bold text-magenta-400 overflow-hidden">' + 'L' + '</div>',
    after: () => UI.Avatar({ name: 'luz', variant: 'participant', size: 'xs' }).toString(),
  },
  {
    name: 'participant-xs-forms-img',
    wrapper: '<div class="participant-chip flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white">{}</div>',
    before: '<div class="w-5 h-5 rounded-full bg-magenta-500/20 flex items-center justify-center text-[9px] font-bold text-magenta-400 overflow-hidden">' + '<img src="' + IMG + '" class="w-full h-full object-cover">' + '</div>',
    after: `() => UI.Avatar({ name: 'luz', src: '${IMG}', variant: 'participant', size: 'xs' }).toString()`,
  },
  // js/forms.js — addParticipantChip (template)
  {
    name: 'participant-xs-forms-chip-template',
    wrapper: '<div class="participant-chip flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white">{}</div>',
    before: `<div class="w-5 h-5 rounded-full bg-magenta-500/20 flex items-center justify-center text-[9px] font-bold text-magenta-400 overflow-hidden">
      L
    </div>`,
    after: () => UI.Avatar({ name: 'luz', variant: 'participant', size: 'xs' }).toString(),
  },
  // js/forms.js — sugerencias del buscador de participantes
  {
    name: 'participant-md-forms-suggestion',
    wrapper: '<div class="suggestion-row flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-white/10 transition-colors">{}<span class="text-sm text-white font-bold">@luz</span></div>',
    before: '<div class="w-7 h-7 rounded-full bg-magenta-500/20 flex items-center justify-center text-xs font-bold text-magenta-400 overflow-hidden shrink-0">' + 'L' + '</div>',
    after: () => UI.Avatar({ name: 'luz', variant: 'participant', size: 'md' }).toString(),
  },
  {
    name: 'participant-md-forms-suggestion-img',
    before: '<div class="w-7 h-7 rounded-full bg-magenta-500/20 flex items-center justify-center text-xs font-bold text-magenta-400 overflow-hidden shrink-0">' + '<img src="' + IMG + '" class="w-full h-full object-cover">' + '</div>',
    after: `() => UI.Avatar({ name: 'luz', src: '${IMG}', variant: 'participant', size: 'md' }).toString()`,
  },
  // evento.html — participantes del detalle (con hover del grupo)
  ...['', '.group'].map((hover) => ({
    name: `participant-2xl-evento${hover ? '-hover' : ''}`,
    wrapper: '<a href="#" class="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500 transition-all group">{}<span class="text-sm font-bold text-gray-300 group-hover:text-white">luz</span></a>',
    hover: hover || undefined,
    before: `<div class="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black group-hover:bg-cyan-500 group-hover:text-black transition-all">
              L
            </div>`,
    after: () => UI.Avatar({ name: 'luz', variant: 'participant', size: '2xl' }).toString(),
  })),
  // oportunidad.html / postulantes.html — postulantes
  {
    name: 'applicant-2xl-oportunidad',
    before: `<div class="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400">
                    J
                  </div>`,
    after: () => UI.Avatar({ name: 'juan', variant: 'applicant', size: '2xl' }).toString(),
  },
  {
    name: 'applicant-3xl-postulantes',
    before: `<div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg font-bold text-emerald-400 shrink-0">
                    J
                  </div>`,
    after: () => UI.Avatar({ name: 'juan', variant: 'applicant', size: '3xl' }).toString(),
  },
  // event-tickets.html — usuarios de puerta y dueño de entrada manual
  {
    name: 'door-sm-img',
    before: `<img src="${IMG}" class="w-6 h-6 rounded-full object-cover" alt="Juan Pérez">`,
    after: `() => UI.Avatar({ name: 'Juan Pérez', src: '${IMG}', alt: 'Juan Pérez', variant: 'door', size: 'sm' }).toString()`,
  },
  {
    name: 'door-sm-initial',
    before: `<div class="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold">J</div>`,
    after: () => UI.Avatar({ name: 'Juan Pérez', variant: 'door', size: 'sm' }).toString(),
  },
  {
    name: 'door-lg-img',
    before: `<img src="${IMG}" class="w-8 h-8 rounded-full object-cover" alt="Juan Pérez">`,
    after: `() => UI.Avatar({ name: 'Juan Pérez', src: '${IMG}', alt: 'Juan Pérez', variant: 'door', size: 'lg' }).toString()`,
  },
  {
    name: 'door-lg-initial',
    before: `<div class="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold">J</div>`,
    after: () => UI.Avatar({ name: 'Juan Pérez', variant: 'door', size: 'lg' }).toString(),
  },
  {
    name: 'owner-lg-img',
    before: `<img src="${IMG}" class="w-8 h-8 rounded-full object-cover" alt="Juan Pérez">`,
    after: `() => UI.Avatar({ name: 'Juan Pérez', src: '${IMG}', alt: 'Juan Pérez', variant: 'owner', size: 'lg' }).toString()`,
  },
  {
    name: 'owner-lg-initial',
    before: `<div class="w-8 h-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 text-xs font-bold">J</div>`,
    after: () => UI.Avatar({ name: 'Juan Pérez', variant: 'owner', size: 'lg' }).toString(),
  },
  // js/notifications.js
  {
    name: 'actor-2xl-img',
    before: `<img src="${IMG}" class="w-10 h-10 rounded-full object-cover" alt="">`,
    after: `() => UI.Avatar({ name: 'luz', src: '${IMG}', alt: '', variant: 'actor', size: '2xl' }).toString()`,
  },
  {
    name: 'actor-2xl-initial',
    before: `<div class="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-gray-400 text-sm font-bold">L</div>`,
    after: () => UI.Avatar({ name: 'luz', variant: 'actor', size: '2xl' }).toString(),
  },
  // post.html / recurso.html / evento.html — comentarios
  {
    name: 'commenter-2xl-img',
    before: `<div class="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10">
                          <img src="${IMG}" class="w-full h-full object-cover">
                        </div>`,
    after: `() => UI.Avatar({ src: '${IMG}', icon: 'fas fa-user', variant: 'commenter', size: '2xl' }).toString()`,
  },
  {
    name: 'commenter-2xl-icon-post',
    before: `<div class="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10">

                            <div class="w-full h-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                              <i class="fas fa-user text-xs"></i>
                            </div>

                        </div>`,
    after: () => UI.Avatar({ icon: 'fas fa-user', variant: 'commenter', size: '2xl' }).toString(),
  },
  {
    name: 'commenter-2xl-icon-evento',
    before: `<div class="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10">

              <div class="w-full h-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <i class="fas fa-user-astronaut text-xs"></i>
              </div>

          </div>`,
    after: () => UI.Avatar({ icon: 'fas fa-user-astronaut', variant: 'commenter', size: '2xl' }).toString(),
  },
  // evento.html / recurso.html — contenido de la caja estática del autor
  {
    name: 'content-evento-img',
    wrapper: '<div id="creator-avatar" class="w-8 h-8 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0">{}</div>',
    before: `<img src="${IMG}" class="w-full h-full object-cover">`,
    after: `() => UI.AvatarContent({ name: 'agustin', src: '${IMG}' }).toString()`,
  },
  {
    name: 'content-recurso-initial',
    wrapper: '<div id="author-avatar" class="w-8 h-8 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-cyan-400">{}</div>',
    before: 'A',
    after: () => UI.AvatarContent({ name: 'agustin' }).toString(),
  },
  // La inicial se escapa (antes obras la imprimía cruda).
  {
    name: 'escapes-initial',
    before: `<div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-cyan-500 text-black">&lt;</div>`,
    after: () => UI.Avatar({ name: '<b>x</b>', variant: 'author', size: 'lg' }).toString(),
  },
];

// Los `after` con la URL de ejemplo van como string: la función se serializa
// para correr en el navegador y ahí `IMG` no existe.
module.exports = cases.map((c) => ({
  wrapper: row,
  scripts,
  ...c,
  before: tight(c.before),
  after: typeof c.after === 'string' ? new Function(`return (${c.after})()`) : c.after,
}));
