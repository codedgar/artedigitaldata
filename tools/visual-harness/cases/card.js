// Casos de las tarjetas (js/ui/card.js): UI.PostCard, RecursoCard, EventoCard,
// OportunidadCard, FeedCard, FeaturedCard, FavoriteCard, TicketCard y
// VisualEffectCard, en todas sus variantes y con las sesiones que cambian el
// markup (visitante, dueño, admin). Cada caso corre la función de render de la
// página antes y después de migrar: ver cases/_pages.js.
const { api, pageCase } = require('./_pages');

const scripts = ['js/tagging.js', 'js/ui/avatar.js', 'js/ui/badge.js', 'js/ui/media.js', 'js/ui/card.js', 'js/ui/state.js'];
const grid = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style="width:1200px">{}</div>';
const grid8 = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style="width:1200px">{}</div>';
const grid2 = '<div class="grid grid-cols-1 md:grid-cols-2 gap-6" style="width:1200px">{}</div>';
const stack = '<div class="space-y-4" style="width:1200px">{}</div>';
const block = '<div class="space-y-12" style="width:1200px">{}</div>';
const tall = { width: 1440, height: 2400 };

const json = (v) => JSON.stringify(v);
const clone = (v) => JSON.parse(JSON.stringify(v));

const posts = api('/posts');
const recursos = api('/recursos');
const eventos = api('/eventos');
const profile = api('/profile/Agustin');

// Obras: con video (0), sin video (4), sin imagen (15), gif (5).
const obras = [posts[0], posts[4], posts[15], posts[5]];
// Recursos: github, other, drive, tutorial con video, sin imagen, tipo desconocido.
const unknownType = { ...clone(recursos[1]), type: 'plugin', imageUrl: '' };
const recursosSample = [recursos[0], recursos[1], recursos[15], recursos[20], recursos[23], unknownType];

const IMG = posts[4].imageUrl;
const withParticipants = (ev, extra = {}) => ({
  ...clone(ev),
  participants: [{ _id: 'p1', username: 'agustin' }, { _id: 'p2', username: 'maria' }],
  ...extra,
});
const eventosOwn = [
  withParticipants(eventos[12], { creator: { ...eventos[12].creator, _id: 'viewer-1' }, ticketConfig: { enabled: true, price: 0 } }),
  withParticipants(eventos[0], { imageUrl: '', location: '', description: '' }),
  { ...clone(eventos[1]), participants: [] },
];

const oportunidades = [
  { _id: 'o1', tipo: 'convocatoria_obra', titulo: 'Convocatoria Bienal', descripcion: 'Muestra colectiva de arte digital.', imagenUrl: IMG, lugarExposicion: 'CCK', fechaHasta: '2026-10-01T12:00:00.000Z', creador: { username: 'agustin' }, inscripciones: [1, 2], createdAt: '2026-08-01T12:00:00.000Z' },
  { _id: 'o2', tipo: 'convocatoria_obra', titulo: 'Sólo fecha', descripcion: '', fechaHasta: '2026-11-01T12:00:00.000Z', creador: { username: 'maria' }, createdAt: '2026-08-02T12:00:00.000Z' },
  { _id: 'o3', tipo: 'oportunidad_laboral', titulo: 'Motion designer', descripcion: 'Full time remoto', nombrePuesto: 'Motion', productoraEmpresa: 'Estudio X', creador: { username: 'pat' }, inscripciones: [], createdAt: '2026-08-03T12:00:00.000Z' },
  { _id: 'o4', tipo: 'colaboracion', titulo: 'Colab audiovisual', descripcion: 'Busco músicos', imagenUrl: IMG, nombreProyecto: 'Ondas', createdAt: '2026-08-04T12:00:00.000Z' },
  { _id: 'o5', tipo: 'otra', titulo: 'Sin tipo conocido', descripcion: 'x', createdAt: '2026-08-05T12:00:00.000Z' },
];
const OPORTUNIDADES_SETUP = `
    const tipoLabels = { convocatoria_obra: 'Convocatoria de Obra', oportunidad_laboral: 'Oportunidad Laboral', colaboracion: 'Colaboración' };
    const tipoIcons = { convocatoria_obra: 'fas fa-palette', oportunidad_laboral: 'fas fa-briefcase', colaboracion: 'fas fa-handshake' };
    const tipoColors = { convocatoria_obra: 'cyan', oportunidad_laboral: 'orange', colaboracion: 'magenta' };`;

const searchResults = [
  { type: 'post', id: posts[0]._id, label: posts[0].title, image: posts[0].imageUrl, author: 'agustin', date: posts[0].createdAt, youtube_video: 'https://www.youtube.com/watch?v=l6noiFoRERY' },
  { type: 'post', id: posts[4]._id, label: 'Sin imagen & "comillas"', author: 'maria', date: posts[4].createdAt },
  { type: 'event', id: eventos[12]._id, label: eventos[12].title, desc: 'Un evento', date: eventos[12].date, youtube_video: 'https://youtu.be/IoFMOYCiIUo' },
  { type: 'event', id: eventos[0]._id, label: eventos[0].title, date: eventos[0].date },
  { type: 'resource', id: 'r1', label: 'Repo', author: 'pat', resourceType: 'github' },
  { type: 'resource', id: 'r2', label: 'Carpeta', author: 'pat', resourceType: 'drive' },
  { type: 'resource', id: 'r3', label: 'Link', author: 'pat', resourceType: 'web' },
];

const profilePosts = [profile.posts[0], { ...clone(posts[4]), description: '' }, { ...clone(posts[15]) }];
const profileRecursos = [recursos[20], recursos[0], { ...clone(recursos[23]), description: '' }];
const doorEvents = [eventos[3], { ...clone(eventos[14]), imageUrl: '' }];
const profileEventos = [
  { ...clone(eventos[12]), ticketConfig: { enabled: true } },
  { ...clone(eventos[0]), imageUrl: '', location: '' },
];
const favorites = {
  posts: [profile.favorites.posts[0] || posts[1], { ...clone(posts[15]), author: undefined, creator: { username: 'pat' } }],
  recursos: [recursos[20], { ...clone(recursos[23]) }],
  eventos: [eventos[14], { ...clone(eventos[2]), imageUrl: '' }],
};
const effects = [
  { _id: 'fx1', title: 'Flyer neón', flyerWords: [{ text: 'ARTE' }, { word: 'DIGITAL' }, { text: '' }], createdAt: '2026-08-10T12:00:00.000Z' },
  { _id: 'fx2', flyerWords: [1, 2, 3, 4, 5, 6].map((n) => ({ text: `w${n}` })), createdAt: '2026-08-11T12:00:00.000Z' },
  { _id: 'fx3', title: 'Vacío', createdAt: '2026-08-12T12:00:00.000Z' },
  { _id: 'fx4', title: 'Una', flyerWords: [{ text: 'solo' }], createdAt: '2026-08-12T12:00:00.000Z' },
];
const QR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
const tickets = [
  { code: 'ADD-0001', qrData: QR, paymentStatus: 'free', redeemed: false, event: { _id: eventos[12]._id, title: eventos[12].title, date: eventos[12].date, location: 'Av. Corrientes 1234', imageUrl: IMG } },
  { code: 'ADD-0002', qrData: QR, paymentStatus: 'pending', redeemed: false, event: { id: 'e2', title: 'Sin imagen', date: eventos[0].date, location: 'https://maps.app/x' } },
  { code: 'ADD-0003', qrData: QR, paymentStatus: 'completed', redeemed: true, event: { _id: 'e3', title: 'Canjeada', date: eventos[0].date } },
  { code: 'ADD-0004', qrData: QR, paymentStatus: 'free', redeemed: false, event: null },
];
const PROFILE_SETUP = `
    function getGoogleMapsUrl(location) {
      if (!location) return '#';
      if (location.startsWith('http')) return location;
      return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(location);
    }`;

// Feed de la home: los cuatro tipos, un título que es link de YouTube, un item
// likeado y uno ya pinneado (sin botón de pin).
const feedItems = [
  { ...clone(posts[0]), feedType: 'post', likes: ['viewer-1'] },
  { ...clone(recursos[6]), feedType: 'recurso' },
  { ...clone(recursos[23]), feedType: 'recurso', imageUrl: '', type: 'software' },
  { ...clone(recursos[28]), feedType: 'recurso', imageUrl: '' },
  { ...clone(eventos[12]), feedType: 'evento', pinned: true },
  { ...oportunidades[0], feedType: 'oportunidad', imagenUrl: undefined },
  { ...oportunidades[2], feedType: 'oportunidad' },
  { ...oportunidades[3], feedType: 'oportunidad', creador: { username: 'pat', avatar: IMG } },
  { ...clone(posts[4]), feedType: 'post', title: 'https://www.youtube.com/watch?v=l6noiFoRERY', description: '', author: 'id-crudo' },
];
const FEED_SETUP = `
    let allFeedItems = ${json(feedItems)};
    let activeFilters = { post: true, recurso: true, evento: true, oportunidad: true };
    let showBotsOnly = false;`;

// Destacados: con y sin feedType (el tipo se deduce de los campos), con
// entradas pagas y gratis, sin imagen y sin fecha.
const pinned = [
  { ...clone(posts[0]), feedType: 'post' },
  { ...clone(recursos[20]), feedType: 'recurso' },
  { ...clone(eventos[12]), ticketConfig: { enabled: true, price: 0 } },
  { ...clone(eventos[14]), feedType: 'evento', ticketConfig: { enabled: true, price: 1500 }, imageUrl: '' },
  { ...oportunidades[0], createdAt: undefined },
  { ...clone(posts[15]), createdAt: undefined, author: undefined },
  { _id: 'x1', titulo: 'Recurso por url', url: 'https://example.com', creador: { username: 'pat' }, createdAt: '2026-08-01T12:00:00.000Z' },
];

const profileCase = (name, session, fns, call, extra = {}) => pageCase({
  name, session, file: 'profile.html', fns, host: extra.host, setup: PROFILE_SETUP, call,
  wrapper: extra.wrapper || grid, scripts, viewport: tall, hover: extra.hover, beforeRef: extra.beforeRef,
});

module.exports = [
  // obras.html
  ...['visitor', 'hover'].map((k) => pageCase({
    name: `post-gallery${k === 'hover' ? '-hover' : ''}`,
    file: 'obras.html', fns: ['renderObras'], host: 'obras-container',
    call: `renderObras(${json(obras)})`,
    wrapper: grid, scripts, viewport: tall, hover: k === 'hover' ? '.group:nth-child(2)' : undefined,
  })),

  // recursos.html
  ...['visitor', 'hover'].map((k) => pageCase({
    name: `recurso-gallery${k === 'hover' ? '-hover' : ''}`,
    file: 'recursos.html', fns: ['renderRecursos'], host: 'recursos-container',
    setup: `
    const typeIcons = { software: 'fas fa-desktop', github: 'fab fa-github', drive: 'fab fa-google-drive', tutorial: 'fas fa-graduation-cap', texto: 'fas fa-file-alt', other: 'fas fa-link' };
    const typeColors = { software: 'fuchsia', github: 'gray', drive: 'yellow', tutorial: 'green', texto: 'cyan', other: 'orange' };`,
    call: `renderRecursos(${json(recursosSample)})`,
    wrapper: grid, scripts, viewport: tall, hover: k === 'hover' ? '.group:nth-child(2)' : undefined,
  })),

  // eventos.html: con los datos de producción la lista termina en el error
  // (participantes sin username); después, con participantes etiquetados.
  pageCase({
    name: 'evento-gallery-produccion',
    file: 'eventos.html', fns: ['loadEvents'], host: 'events-container',
    setup: `const fetch = async () => ({ json: async () => ${json(eventos.slice(0, 6).map((e, i) => (i === 2 ? { ...e, participants: ['69bac77126597221457322e4'] } : e)))} });`,
    call: 'await loadEvents()',
    wrapper: grid8, scripts, viewport: tall,
  }),
  ...['visitor', 'admin', 'owner', 'hover'].map((k) => pageCase({
    name: `evento-gallery-${k}`,
    session: k === 'hover' ? 'visitor' : k,
    file: 'eventos.html', fns: ['loadEvents'], host: 'events-container',
    setup: `const fetch = async () => ({ json: async () => ${json(eventosOwn)} });`,
    call: 'await loadEvents()',
    wrapper: grid8, scripts, viewport: tall, hover: k === 'hover' ? '.group' : undefined,
  })),

  // oportunidades.html (producción no tiene oportunidades: datos armados)
  ...['visitor', 'hover'].map((k) => pageCase({
    name: `oportunidad-gallery${k === 'hover' ? '-hover' : ''}`,
    file: 'oportunidades.html', fns: ['renderOportunidades'], host: 'oportunidades-container',
    setup: OPORTUNIDADES_SETUP,
    call: `renderOportunidades(${json(oportunidades)})`,
    wrapper: grid, scripts, viewport: tall, hover: k === 'hover' ? '.group:nth-child(4)' : undefined,
  })),

  // search.html: filas de obra, evento y recurso (la API de búsqueda no está en el netcache)
  ...['visitor', 'hover'].map((k) => pageCase({
    name: `search-results${k === 'hover' ? '-hover' : ''}`,
    file: 'search.html', fns: ['renderResults'], host: 'results-sections',
    setup: 'const resultsContainer = host;',
    call: `renderResults(${json(searchResults.filter((r) => r.type !== 'user'))})`,
    wrapper: block, scripts, viewport: tall, hover: k === 'hover' ? '.group' : undefined,
  })),

  // profile.html
  ...['visitor', 'owner', 'admin'].map((s) => profileCase(`post-profile-${s}`, s, ['renderUserPosts'], `renderUserPosts(${json(profilePosts)})`, { host: 'user-posts' })),
  profileCase('post-profile-hover', 'owner', ['renderUserPosts'], `renderUserPosts(${json(profilePosts)})`, { host: 'user-posts', hover: '.group:nth-child(2)' }),
  profileCase('post-contest', 'visitor', ['renderUserConcursos'], `renderUserConcursos(${json([{ ...posts[1], contestMonth: 'AGOSTO 2026' }, posts[5]])})`, { host: 'user-concursos' }),
  profileCase('post-contest-hover', 'visitor', ['renderUserConcursos'], `renderUserConcursos(${json([{ ...posts[1], contestMonth: 'AGOSTO 2026' }, posts[5]])})`, { host: 'user-concursos', hover: '.group' }),
  ...['visitor', 'owner'].map((s) => profileCase(`recurso-profile-${s}`, s, ['renderUserRecursos'], `renderUserRecursos(${json(profileRecursos)})`, { host: 'user-recursos' })),
  profileCase('recurso-profile-hover', 'visitor', ['renderUserRecursos'], `renderUserRecursos(${json(profileRecursos)})`, { host: 'user-recursos', hover: '.group:nth-child(2)' }),
  ...['visitor', 'owner', 'admin'].map((s) => profileCase(`evento-profile-${s}`, s, ['renderUserEventos', 'renderEventoCardInline'], `renderUserEventos(${json(profileEventos)}, ${json(doorEvents)})`, { host: 'user-eventos' })),
  profileCase('evento-profile-hover', 'visitor', ['renderUserEventos', 'renderEventoCardInline'], `renderUserEventos(${json(profileEventos)}, [])`, { host: 'user-eventos', hover: '.group' }),
  profileCase('favorite', 'visitor', ['renderUserFavorites'], `renderUserFavorites(${json(favorites)})`, { host: 'user-favs' }),
  profileCase('favorite-hover', 'visitor', ['renderUserFavorites'], `renderUserFavorites(${json(favorites)})`, { host: 'user-favs', hover: '.group:nth-child(2)' }),
  ...['visitor', 'owner'].map((s) => profileCase(`oportunidad-profile-${s}`, s, ['renderUserOportunidades'], `renderUserOportunidades(${json(oportunidades)})`, { host: 'user-oportunidades' })),
  profileCase('oportunidad-profile-hover', 'visitor', ['renderUserOportunidades'], `renderUserOportunidades(${json(oportunidades)})`, { host: 'user-oportunidades', hover: '.group' }),
  // main renombró las secuencias y le sumó el badge Front y el link ?outputeffect=:
  // la referencia de estas tres es main, no el commit previo a la migración.
  ...['visitor', 'admin'].map((s) => profileCase(`visual-effect-${s}`, s, ['renderUserVisualEffects'], `renderUserVisualEffects(${json(effects)})`, { host: 'user-visualeffects', beforeRef: 'main' })),
  profileCase('visual-effect-hover', 'visitor', ['renderUserVisualEffects'], `renderUserVisualEffects(${json(effects)})`, { host: 'user-visualeffects', hover: '.group', beforeRef: 'main' }),
  profileCase('ticket', 'owner', ['renderUserTickets'], `renderUserTickets(${json(tickets)})`, { host: 'user-tickets', wrapper: stack }),

  // js/index.js — feed
  ...['visitor', 'admin', 'hover'].map((k) => pageCase({
    name: `feed-${k}`,
    session: k === 'hover' ? 'owner' : k,
    file: 'js/index.js', fns: ['renderFeed'], host: 'feed-container',
    setup: FEED_SETUP,
    call: 'renderFeed()',
    // Con admin, el borde del botón de pin (semitransparente, dentro de una
    // tarjeta con backdrop-blur) cambia unos píxeles entre corridas del mismo
    // HTML. En ese caso se apaga el blur en los dos lados; el caso de
    // visitante compara las tarjetas con blur.
    wrapper: k === 'admin' ? `<style>#root * { backdrop-filter: none !important; }</style>${grid}` : grid, scripts, viewport: { width: 1440, height: 3200 }, hover: k === 'hover' ? '.group:nth-child(2)' : undefined,
  })),

  // js/index.js — destacados
  ...['visitor', 'admin', 'hover'].map((k) => pageCase({
    name: `featured-${k}`,
    session: k === 'hover' ? 'visitor' : k,
    file: 'js/index.js', fns: ['renderPinnedEvents'], host: 'pinned-container',
    call: `renderPinnedEvents(${json(pinned)})`,
    wrapper: grid2, scripts, viewport: { width: 1440, height: 3200 }, hover: k === 'hover' ? '.group:nth-child(2)' : undefined,
  })),
];
