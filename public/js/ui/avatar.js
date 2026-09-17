// Avatares: la foto del usuario o, si no tiene, la inicial de su nombre (o un
// ícono). Y la línea de autor de las tarjetas (avatar + @usuario).
//
//   UI.Avatar({ name: p.author?.username, variant: 'author', size: 'lg' })
//   UI.Avatar({ name: u.username, src: u.avatar, alt: u.username, variant: 'author', size: 'md' })
//   UI.Avatar({ src: c.user?.avatar, icon: 'fas fa-user', variant: 'commenter', size: '2xl' })
//   avatarEl.innerHTML = UI.AvatarContent({ name: r.author?.username, src: r.author?.avatar });
//   UI.AuthorLine({ username: r.author?.username, size: 'md' })
//
// `src` sólo se pasa donde la página mostraba la foto: varias tarjetas muestran
// siempre la inicial aunque el usuario tenga avatar. `name` es el texto del que
// sale la inicial (cada página elige `displayName || username` o `username`);
// sin nombre se muestra '?'. `alt` sólo se imprime si se pasa.
//
// Requiere js/ui/core.js y config.js (sanitizeUrl).
(function () {
  const { html, cx } = UI;

  // Tamaños: xs w-5 · sm w-6 · md w-7 · lg w-8 · xl w-9 · 2xl w-10 · 3xl w-12.
  //
  // Cada variante lleva el string completo de su caja: en fase 1 cada página
  // conserva sus clases exactas (con o sin `overflow-hidden`, `shrink-0`…).
  //   box      clases del contenedor
  //   img      si está, la foto *reemplaza* a la caja y lleva estas clases;
  //            si no, la foto va dentro de la caja a tamaño completo
  //   initial  [tag, clases] cuando la inicial va envuelta en otro elemento
  //   icon     clases del contenedor del ícono de reemplazo (variante con ícono)
  //
  // Las clases `*-magenta-*` que usaban los chips de participantes no existen
  // en la paleta de Tailwind y nunca generaron CSS: se omiten para reproducir
  // lo que se veía (sin fondo y con el color de texto heredado).
  const VARIANTS = {
    // Autor de una obra y usuarios que le dieron like.
    author: {
      md: { box: 'w-7 h-7 rounded-full overflow-hidden bg-cyan-500 text-black flex items-center justify-center text-xs font-bold shrink-0' },
      lg: { box: 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-cyan-500 text-black' },
      '3xl': { box: 'w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-lg font-bold bg-cyan-500 text-black shrink-0' },
    },
    // Autor discreto al pie de una tarjeta.
    byline: {
      sm: { box: 'w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[9px] font-bold text-gray-500' },
      md: { box: 'w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500' },
      lg: {
        box: 'w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-white/5 flex items-center justify-center',
        initial: ['span', 'text-[10px] font-bold text-gray-500'],
      },
      xl: {
        box: 'w-9 h-9 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-inner bg-white/5',
        initial: ['div', 'w-full h-full flex items-center justify-center text-xs font-bold bg-white/5 text-gray-500'],
      },
    },
    // Participantes etiquetados en un evento (detalle y formulario).
    participant: {
      xs: { box: 'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold overflow-hidden' },
      md: { box: 'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden shrink-0' },
      '2xl': { box: 'w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black group-hover:bg-cyan-500 group-hover:text-black transition-all' },
    },
    // Postulantes a una oportunidad.
    applicant: {
      '2xl': { box: 'w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400' },
      '3xl': { box: 'w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg font-bold text-emerald-400 shrink-0' },
    },
    // Usuarios de puerta de un evento (chip y buscador).
    door: {
      sm: { box: 'w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold', img: 'w-6 h-6 rounded-full object-cover' },
      lg: { box: 'w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold', img: 'w-8 h-8 rounded-full object-cover' },
    },
    // Buscador del dueño de una entrada manual.
    owner: {
      lg: { box: 'w-8 h-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 text-xs font-bold', img: 'w-8 h-8 rounded-full object-cover' },
    },
    // Quien generó una notificación.
    actor: {
      '2xl': { box: 'w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-gray-400 text-sm font-bold', img: 'w-10 h-10 rounded-full object-cover' },
    },
    // Autor de un comentario: sin foto muestra un ícono, no la inicial.
    commenter: {
      '2xl': { box: 'w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10', icon: 'w-full h-full bg-cyan-500/20 flex items-center justify-center text-cyan-400' },
    },
  };

  const FILL_IMG = 'w-full h-full object-cover';

  function initialOf(name) {
    return (name || '?')[0].toUpperCase();
  }

  function image(url, className, alt) {
    return alt === undefined
      ? html`<img src="${url}" class="${className}">`
      : html`<img src="${url}" class="${className}" alt="${alt}">`;
  }

  // Lo de adentro de una caja de avatar que ya existe en el HTML estático.
  function AvatarContent({ name, src } = {}) {
    const url = src && sanitizeUrl(src);
    return url ? image(url, FILL_IMG) : html`${initialOf(name)}`;
  }

  function Avatar({ name, src, alt, icon, variant, size, className } = {}) {
    // Una variante o tamaño inexistente deja la caja sin clases, no cae en otro.
    const v = VARIANTS[variant]?.[size] || {};
    const url = src && sanitizeUrl(src);
    if (v.img) {
      return url
        ? image(url, cx(v.img, className), alt)
        : html`<div class="${cx(v.box, className)}">${initialOf(name)}</div>`;
    }
    let content;
    if (url) content = image(url, FILL_IMG, alt);
    else if (v.icon) content = html`<div class="${v.icon}"><i class="${cx(icon, 'text-xs')}"></i></div>`;
    else if (v.initial) {
      const [tag, cls] = v.initial;
      content = tag === 'span'
        ? html`<span class="${cls}">${initialOf(name)}</span>`
        : html`<div class="${cls}">${initialOf(name)}</div>`;
    }
    else content = initialOf(name);
    return html`<div class="${cx(v.box, className)}">${content}</div>`;
  }

  const AUTHOR_LINE = {
    sm: 'flex items-center gap-2',
    md: 'flex items-center gap-3',
  };

  // Avatar discreto + @usuario al pie de las tarjetas de recursos y oportunidades.
  function AuthorLine({ username, size = 'md', className } = {}) {
    return html`<div class="${cx(AUTHOR_LINE[size], className)}">${Avatar({ name: username, variant: 'byline', size })}<span class="text-xs text-gray-500 font-medium">@${username || 'anónimo'}</span></div>`;
  }

  Object.assign(UI, { Avatar, AvatarContent, AuthorLine });
})();
