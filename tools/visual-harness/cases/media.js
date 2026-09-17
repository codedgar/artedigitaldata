// Casos de js/ui/media.js: UI.VideoOverlay (solid·dim·feed), UI.videoHover y
// UI.MediaThumb. Las variantes de MediaThumb sin hover ya están en
// cases/card.js; acá se pasa el mouse por la miniatura para disparar
// playVideo (copiado de js/header.js) y comparar el overlay visible con su
// loader. YouTube no está en el netcache: el iframe queda en blanco igual en
// los dos lados.
const { HELPERS, browserFn } = require('./_pages');
const cards = require('./card');

const IMG = 'https://vps-4455523-x.dattaweb.com/artedigitaldata/img/uploads/general/74c86467-7109-4b61-a0ac-0bdd23a89798.jpg';
const YT = 'l6noiFoRERY';
const scripts = ['js/ui/media.js'];
const box = `<div class="relative aspect-video overflow-hidden" style="width:640px" onmouseenter="playVideo(this, '${YT}')" onmouseleave="stopVideo(this)"><img src="${IMG}" class="w-full h-full object-cover">{}</div>`;

// Instala playVideo/stopVideo y devuelve el HTML que arma `body`.
const withPlayer = (body) => browserFn(`() => { ${HELPERS}; return (${body})(); }`);

const overlay = (name, before, variant) => [
  { name: `overlay-${name}`, before, after: browserFn(`() => UI.VideoOverlay({ variant: ${JSON.stringify(variant)} }).toString()`), wrapper: box, scripts },
  {
    name: `overlay-${name}-playing`,
    before: withPlayer(`() => ${JSON.stringify(before)}`),
    after: withPlayer(`() => UI.VideoOverlay({ variant: ${JSON.stringify(variant)} }).toString()`),
    wrapper: box, scripts, hover: '[onmouseenter]',
  },
];

// Hover sobre la primera miniatura con video de cada tarjeta.
const playing = (caseName) => {
  const c = cards.find((k) => k.name === caseName);
  if (!c) throw new Error(`falta el caso ${caseName} en cases/card.js`);
  return { ...c, name: `thumb-playing-${caseName}`, hover: '[onmouseenter]' };
};

module.exports = [
  // obras.html (galería)
  ...overlay('dim', `<div class="video-overlay absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-10" style="background: rgba(0,0,0,0.8);">
                    <iframe class="w-full h-full"
                            src=""
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen></iframe>
                  </div>`, 'dim'),
  // recurso.html / evento.html / profile.html (una línea)
  ...overlay('solid', `<div class="video-overlay absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none bg-black"><iframe class="w-full h-full" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`, 'solid'),
  // js/index.js
  ...overlay('feed', `<div class="video-overlay absolute inset-0 opacity-0 pointer-events-none z-10">
                <iframe class="w-full h-full" src="" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
              </div>`, 'feed'),

  // post.html — imagen del detalle con hover en el contenedor
  {
    name: 'post-detail-playing',
    before: withPlayer(`() => {
      const post = { imageUrl: ${JSON.stringify(IMG)}, title: 'Tato Bores', youtube_video: 'https://www.youtube.com/watch?v=${YT}' };
      return \`${`
                <div class="w-full bg-black flex justify-center border-b border-white/5 relative aspect-video overflow-hidden"
                     \${extractYouTubeId(post) ? \`onmouseenter="playVideo(this, '\${extractYouTubeId(post)}')" onmouseleave="stopVideo(this)"\` : ''}>
                  <img src="\${sanitizeUrl(post.imageUrl)}" alt="\${escapeHTML(post.title)}" class="max-w-full max-h-[70vh] object-contain transition-transform duration-700">
                  \${extractYouTubeId(post) ? \`
                    <div class="video-overlay absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none bg-black">
                      <iframe class="w-full h-full" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                  \` : ''}
                </div>`}\`;
    }`),
    after: withPlayer(`() => {
      const post = { imageUrl: ${JSON.stringify(IMG)}, title: 'Tato Bores', youtube_video: 'https://www.youtube.com/watch?v=${YT}' };
      return \`${`
                <div class="w-full bg-black flex justify-center border-b border-white/5 relative aspect-video overflow-hidden"
                     \${UI.videoHover(extractYouTubeId(post))}>
                  <img src="\${sanitizeUrl(post.imageUrl)}" alt="\${escapeHTML(post.title)}" class="max-w-full max-h-[70vh] object-contain transition-transform duration-700">
                  \${extractYouTubeId(post) ? UI.VideoOverlay() : ''}
                </div>`}\`;
    }`),
    wrapper: '<div style="width:900px">{}</div>', scripts, hover: '[onmouseenter]',
  },

  // Miniaturas de tarjetas con video, reproduciendo.
  playing('post-gallery'),
  playing('post-profile-visitor'),
  playing('recurso-gallery'),
  playing('recurso-profile-visitor'),
  playing('evento-gallery-visitor'),
  playing('evento-profile-visitor'),
  playing('favorite'),
  playing('feed-visitor'),
  playing('featured-visitor'),
  // Búsqueda: `videoHover` con `isolated` (corta la propagación al click de la fila).
  playing('search-results'),
];
