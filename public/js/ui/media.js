// Medios de tarjetas y detalles: la miniatura (imagen o ícono de reemplazo) y
// la vista previa de YouTube que se reproduce al pasar el mouse.
//
//   UI.MediaThumb({ variant: 'post-gallery', imageUrl: p.imageUrl, alt: p.title, youtubeId, fallbackIcon: 'fas fa-palette', link: `post.html?id=${p._id}` })
//   UI.MediaThumb({ variant: 'favorite', imageUrl, youtubeId, fallbackIcon: 'fas fa-palette', link, children: chip })
//   <div class="w-24 h-24 relative" ${UI.videoHover(youtubeId, { isolated: true })}>…${youtubeId && UI.VideoOverlay()}</div>
//   imgContainer.innerHTML += UI.VideoOverlay();
//
// `playVideo` / `stopVideo` (js/header.js) buscan `.video-overlay` dentro del
// elemento que recibe el hover: la clase es el enganche y no se puede cambiar.
// `youtubeId` es el id de 11 caracteres que devuelve `extractYouTubeId()`.
//
// Requiere js/ui/core.js.
(function () {
  const { html, raw, cx } = UI;

  const IFRAME = raw('<iframe class="w-full h-full" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');

  const OVERLAY = {
    // Detalles y la mayoría de las tarjetas.
    solid: { box: 'video-overlay absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none bg-black' },
    // Galería de obras: fondo traslúcido en línea en vez de `bg-black`.
    dim: { box: 'video-overlay absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-10', style: 'background: rgba(0,0,0,0.8);' },
    // Feed y destacados de la home: sin transición ni fondo.
    feed: { box: 'video-overlay absolute inset-0 opacity-0 pointer-events-none z-10' },
  };

  function VideoOverlay({ variant = 'solid' } = {}) {
    const v = OVERLAY[variant] || {};
    return v.style
      ? html`<div class="${v.box}" style="${v.style}">${IFRAME}</div>`
      : html`<div class="${v.box}">${IFRAME}</div>`;
  }

  // Atributos del elemento que dispara la vista previa. `isolated` corta la
  // propagación: en búsqueda la miniatura está dentro de una fila clickeable.
  function videoHover(youtubeId, { isolated = false } = {}) {
    if (!youtubeId) return '';
    return isolated
      ? html`onmouseenter="event.stopPropagation(); playVideo(this, '${youtubeId}')" onmouseleave="stopVideo(this)"`
      : html`onmouseenter="playVideo(this, '${youtubeId}')" onmouseleave="stopVideo(this)"`;
  }

  // Miniatura clickeable de una tarjeta. Cada variante reproduce las clases que
  // tenía su página (fase 1):
  //   open      cómo navega: 'location' (onclick en la misma pestaña),
  //             'new-tab' (onclick con window.open) o 'anchor' (<a href>)
  //   box       clases del elemento que recibe hover y click
  //   img       clases de la imagen
  //   fallback  caja del ícono cuando no hay imagen
  //   icon      clases que se suman al `fallbackIcon`
  //   overlay   variante de VideoOverlay
  //   sanitize  la imagen pasa por sanitizeUrl (la home lo hacía; el resto no)
  //
  // Las clases `*-magenta-*` no existen en la paleta de Tailwind y nunca
  // generaron CSS: se conservan tal cual estaban (no pintan nada).
  const CLICK_BOX = 'block w-full h-full relative cursor-pointer';
  const ZOOM_IMG = 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110';
  const NEUTRAL_FALLBACK = 'w-full h-full bg-white/5 flex items-center justify-center';

  const THUMB = {
    'post-gallery': { open: 'location', box: CLICK_BOX, img: ZOOM_IMG, fallback: NEUTRAL_FALLBACK, icon: 'text-3xl text-gray-700', overlay: 'dim' },
    'post-profile': { open: 'location', box: CLICK_BOX, img: ZOOM_IMG, fallback: NEUTRAL_FALLBACK, icon: 'text-3xl text-gray-700', overlay: 'solid' },
    'recurso-gallery': { open: 'location', box: CLICK_BOX, img: ZOOM_IMG, fallback: NEUTRAL_FALLBACK, icon: 'text-4xl text-gray-700 opacity-30', overlay: 'solid' },
    'recurso-profile': { open: 'location', box: CLICK_BOX, img: ZOOM_IMG, fallback: NEUTRAL_FALLBACK, icon: 'text-3xl text-gray-700 opacity-30', overlay: 'solid' },
    'evento-gallery': { open: 'location', box: CLICK_BOX, img: ZOOM_IMG, fallback: 'w-full h-full bg-magenta-500/10 flex items-center justify-center', icon: 'text-4xl text-magenta-500/30', overlay: 'solid' },
    'evento-profile': { open: 'location', box: CLICK_BOX, img: ZOOM_IMG, fallback: 'w-full h-full bg-magenta-500/10 flex items-center justify-center', icon: 'text-3xl text-magenta-500/30', overlay: 'solid' },
    'oportunidad-profile': { open: 'location', box: CLICK_BOX, img: ZOOM_IMG, fallback: 'w-full h-full bg-emerald-500/10 flex items-center justify-center', icon: 'text-3xl text-emerald-500/30', overlay: 'solid' },
    featured: { sanitize: true, open: 'location', box: CLICK_BOX, img: 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110', fallback: 'w-full h-full bg-cyan-500/10 flex items-center justify-center', icon: 'text-4xl text-cyan-500/30', overlay: 'feed' },
    feed: { sanitize: true, open: 'anchor', box: 'block w-full h-full relative', img: 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110', fallback: 'w-full h-full bg-white/5 flex items-center justify-center cursor-pointer', icon: 'text-3xl text-gray-700', overlay: 'feed' },
    favorite: { open: 'new-tab', box: 'block aspect-video bg-white/5 relative overflow-hidden cursor-pointer', img: 'w-full h-full object-cover transition-transform group-hover:scale-110', fallback: 'w-full h-full flex items-center justify-center text-gray-700', icon: 'text-3xl', overlay: 'solid' },
  };

  function image(url, className, alt) {
    return alt === undefined
      ? html`<img src="${url}" class="${className}">`
      : html`<img src="${url}" alt="${alt}" class="${className}">`;
  }

  // `imageUrl` es la URL cruda del item: si hay imagen o ícono se decide por
  // ella, aunque sanitizeUrl después la vacíe. `alt` sólo se imprime si se
  // pasa. `children` va al final, encima de la imagen (el chip de favoritos).
  function MediaThumb({ variant, imageUrl, alt, youtubeId, fallbackIcon, link, children } = {}) {
    const v = THUMB[variant] || {};
    const content = html`${imageUrl
      ? image(v.sanitize ? sanitizeUrl(imageUrl) : imageUrl, v.img, alt)
      : html`<div class="${v.fallback}"><i class="${cx(fallbackIcon, v.icon)}"></i></div>`}${youtubeId && VideoOverlay({ variant: v.overlay })}${children}`;
    const hover = videoHover(youtubeId);
    if (v.open === 'anchor') return html`<a href="${link}" class="${v.box}" ${hover}>${content}</a>`;
    const onclick = v.open === 'new-tab'
      ? html`window.open('${link}', '_blank')`
      : html`window.location.href='${link}'`;
    return html`<div class="${v.box}" ${hover} onclick="${onclick}">${content}</div>`;
  }

  Object.assign(UI, { VideoOverlay, videoHover, MediaThumb });
})();
