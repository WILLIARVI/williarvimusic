// ==========================================================
// GALERÍA AUTOMÁTICA - Willi ArVi Music
// ==========================================================

(function () {
  const { user, repo, galleryFolder } = CONFIG.github;
  const API_BASE = `https://api.github.com/repos/${user}/${repo}/contents/${galleryFolder}`;

  const tabsEl = document.getElementById('galleryTabs');
  const carouselEl = document.getElementById('galleryCarousel');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');

  if (!carouselEl) return;

  let albums = {};
  let currentAlbum = null;
  let currentIndex = 0;
  let autoPlayTimer = null;

  async function fetchJSON(url) {
    const r = await fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } });
    if (!r.ok) throw new Error(`GitHub API error: ${r.status}`);
    return r.json();
  }

  function prettifyName(name) {
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  async function loadAlbums() {
    try {
      const items = await fetchJSON(API_BASE);
      const folders = items.filter(i => i.type === 'dir');

      if (!folders.length) {
        carouselEl.innerHTML = `<div class="gallery-loading">Próximamente nuevas fotos.</div>`;
        return;
      }

      for (const folder of folders) {
        const fotos = await fetchJSON(folder.url);
        const imageUrls = fotos
          .filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f.name))
          .map(f => f.download_url);
        if (imageUrls.length) albums[folder.name] = imageUrls;
      }

      if (!Object.keys(albums).length) {
        carouselEl.innerHTML = `<div class="gallery-loading">Próximamente nuevas fotos.</div>`;
        return;
      }

      renderTabs();
      switchAlbum(Object.keys(albums)[0]);
    } catch (e) {
      console.error('Error cargando galería:', e);
      carouselEl.innerHTML = `<div class="gallery-loading">No se pudo cargar la galería. Intenta más tarde.</div>`;
    }
  }

  function renderTabs() {
    if (!tabsEl) return;
    tabsEl.innerHTML = '';
    Object.keys(albums).forEach(name => {
      const btn = document.createElement('button');
      btn.className = 'gallery-album-tab';
      btn.textContent = prettifyName(name);
      btn.dataset.album = name;
      btn.addEventListener('click', () => switchAlbum(name));
      tabsEl.appendChild(btn);
    });
  }

  function switchAlbum(name) {
    currentAlbum = name;
    currentIndex = 0;
    if (tabsEl) {
      tabsEl.querySelectorAll('.gallery-album-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.album === name);
      });
    }
    renderSlides();
    restartAutoPlay();
  }

  function renderSlides() {
    if (!currentAlbum || !albums[currentAlbum]) return;
    const photos = albums[currentAlbum];

    carouselEl.innerHTML = `
      ${photos.map((url, i) => `
        <div class="gallery-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
          <img src="${url}" alt="Foto ${i + 1} del álbum ${prettifyName(currentAlbum)}" loading="lazy">
          <div class="gallery-slide-caption">${prettifyName(currentAlbum)} · ${i + 1}/${photos.length}</div>
        </div>
      `).join('')}
      <div class="gallery-thumbs">
        ${photos.map((url, i) => `
          <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
            <img src="${url}" alt="Miniatura ${i + 1}" loading="lazy">
          </div>
        `).join('')}
      </div>
    `;

    carouselEl.querySelectorAll('.gallery-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => goToSlide(parseInt(thumb.dataset.index)));
    });
  }

  function goToSlide(index) {
    const slides = carouselEl.querySelectorAll('.gallery-slide');
    const thumbs = carouselEl.querySelectorAll('.gallery-thumb');
    if (!slides.length) return;

    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    thumbs.forEach((t, i) => t.classList.toggle('active', i === index));
  }

  function next() { goToSlide(currentIndex + 1); }
  function prev() { goToSlide(currentIndex - 1); }

  function restartAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(next, 6000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartAutoPlay(); });

  let touchStartX = 0;
  carouselEl.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  carouselEl.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) next(); else prev();
      restartAutoPlay();
    }
  }, { passive: true });

  document.addEventListener('DOMContentLoaded', loadAlbums);
})();