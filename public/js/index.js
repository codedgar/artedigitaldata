document.addEventListener('DOMContentLoaded', async () => {
  const heroCta = document.getElementById('hero-cta');
  if (!isLoggedIn()) {
    heroCta.innerHTML = `
      <div class="mt-6">
        <button onclick="showRegister()" class="btn-primary inline-block text-black font-bold px-8 py-3 rounded-xl text-lg transition-all hover:scale-105">
          <i class="fas fa-rocket mr-2"></i>Únete Ahora
        </button>
      </div>`;
  }
  await Promise.all([loadPinnedEvents(), loadFeed()]);
});

async function loadPinnedEvents() {
  try {
    let pinnedItems = [];
    try {
      const res = await fetch(CONFIG.API_URL + '/posteos/pinned/list');
      if (res.ok) pinnedItems = await res.json();
    } catch {
      const res = await fetch(CONFIG.API_URL + '/eventos/pinned/list');
      if (res.ok) pinnedItems = await res.json();
    }

    if (pinnedItems && pinnedItems.length > 0) {
      document.getElementById('pinned-section').classList.remove('hidden');
      renderPinnedEvents(pinnedItems);
    } else {
      document.getElementById('pinned-section').classList.add('hidden');
    }
  } catch (err) {
    console.error('Error loading pinned items:', err);
  }
}

function renderPinnedEvents(events) {
  const container = document.getElementById('pinned-container');
  const userIsAdmin = isAdmin();
  container.innerHTML = events.map(ev => UI.FeaturedCard({ item: ev, youtubeId: extractYouTubeId(ev), canUnpin: userIsAdmin })).join('');
}

async function unpinItem(itemId, type) {
  if (!confirm('¿Despinnar este posteo?')) return;
  try {
    const endpoint = type === 'evento' ? `/eventos/${itemId}/unpin` : `/posteos/${type}/${itemId}/unpin`;
    const res = await apiRequest(endpoint, { method: 'POST' });
    if (res.ok) {
      await loadPinnedEvents();
      const pinnedContainer = document.getElementById('pinned-container');
      if (pinnedContainer.children.length === 0) {
        document.getElementById('pinned-section').classList.add('hidden');
      }
    }
  } catch (err) {
    console.error('Error unpinning item:', err);
    alert('Error al despinnar el posteo');
  }
}

async function pinItemFromFeed(itemId, type) {
  if (!confirm('¿Pinnar este posteo como destacado?')) return;
  try {
    const endpoint = type === 'evento' ? `/eventos/${itemId}/pin` : `/posteos/${type}/${itemId}/pin`;
    const res = await apiRequest(endpoint, { method: 'POST' });
    if (res.ok) {
      await Promise.all([loadPinnedEvents(), loadFeed()]);
      document.getElementById('pinned-section').classList.remove('hidden');
    }
  } catch (err) {
    console.error('Error pinning item:', err);
    alert('Error al pinear el posteo');
  }
}


let allFeedItems = [];
let activeFilters = { post: true, recurso: true, evento: true, oportunidad: true };
let showBotsOnly = false;

function toggleHumanAI() {
  showBotsOnly = !showBotsOnly;
  const btn = document.getElementById('filter-human-ai');
  if (btn) UI.setHumanAIToggle(btn, showBotsOnly);
  renderFeed();
}

function updateFilterStyles() {
  Object.keys(activeFilters).forEach(type => {
    UI.setTabState(document.getElementById(`filter-${type}`), activeFilters[type], 'switch');
  });
}

function toggleFilter(type) {
  activeFilters[type] = !activeFilters[type];
  // Si todos están desactivados, reactivar todos
  const anyActive = Object.values(activeFilters).some(v => v);
  if (!anyActive) {
    activeFilters = { post: true, recurso: true, evento: true, oportunidad: true };
  }
  updateFilterStyles();
  renderFeed();

  // Impulso orbital cósmico al interactuar
  const sunDisc = document.querySelector('.sun-disc');
  if (sunDisc) {
    sunDisc.style.transform = 'scale(1.1)';
    setTimeout(() => { sunDisc.style.transform = ''; }, 350);
  }
}

async function loadFeed() {
  const container = document.getElementById('feed-container');
  try {
    const [postsRes, recursosRes, eventosRes, oportunidadesRes] = await Promise.all([
      fetch(CONFIG.API_URL + '/posts'),
      fetch(CONFIG.API_URL + '/recursos'),
      fetch(CONFIG.API_URL + '/eventos'),
      fetch(CONFIG.API_URL + '/oportunidades')
    ]);

    if (!postsRes.ok || !recursosRes.ok || !eventosRes.ok || !oportunidadesRes.ok) {
      throw new Error('Error al cargar el feed.');
    }

    const [posts, recursos, eventos, oportunidades] = await Promise.all([
      postsRes.json(),
      recursosRes.json(),
      eventosRes.json(),
      oportunidadesRes.json()
    ]);

    allFeedItems = [
      ...posts.map(p => ({ ...p, feedType: 'post' })),
      ...recursos.map(r => ({ ...r, feedType: 'recurso' })),
      ...eventos.map(e => ({ ...e, feedType: 'evento' })),
      ...oportunidades.map(o => ({ ...o, feedType: 'oportunidad' }))
    ].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

    updateFilterStyles();
    renderFeed();
  } catch (err) {
    console.error('Error cargando el feed:', err);
    container.innerHTML = UI.ErrorState({ message: 'Error cargando el feed. Intenta recargar la página.', variant: 'stacked' });
  }
}

function renderFeed() {
  const container = document.getElementById('feed-container');
  const filtered = allFeedItems.filter(item => activeFilters[item.feedType])
    .filter(item => {
      const hasAutobotTag = (item.tags || []).includes('autobotadd');
      if (!showBotsOnly) return !hasAutobotTag;
      return hasAutobotTag;
    });

  if (!filtered.length) {
    container.innerHTML = UI.EmptyState({ icon: 'fas fa-search', message: 'No hay publicaciones para los filtros seleccionados', accent: 'ghost', iconSize: 'md', surface: 'dashed' });
    return;
  }

  const userIsAdmin = isAdmin();
  const userId = getUserId();
  container.innerHTML = filtered.map(item => UI.FeedCard({
    item,
    youtubeId: extractYouTubeId(item),
    isLiked: (item.likes || []).includes(userId),
    canPin: userIsAdmin && !item.pinned,
  })).join('');
}

async function toggleFeedLike(event, id, type) {
  event.preventDefault();
  if (!isLoggedIn()) {
    alert('Inicia sesión para dar like');
    return;
  }
  const endpoint = type === 'post' ? `/posts/${id}/like` :
                   (type === 'recurso' ? `/recursos/${id}/like` : 
                   (type === 'evento' ? `/eventos/${id}/like` : 
                   (type === 'oportunidad' ? `/oportunidades/${id}/like` : `/posteos/${type}/${id}/like`)));
  if (!endpoint) return;
  const btn = event.currentTarget;
  const icon = btn.querySelector('i');
  const countSpan = btn.querySelector('.like-count');
  try {
    const res = await apiRequest(endpoint, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      const userId = getUserId();
      const isLiked = (data.likes || []).includes(userId);
      icon.className = `${isLiked ? 'fas' : 'far'} fa-heart`;
      btn.className = `flex items-center gap-1.5 text-xs font-bold transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-cyan-400'}`;
      countSpan.innerText = (data.likes || []).length;
    }
  } catch (err) {
    console.error(err);
  }
}

