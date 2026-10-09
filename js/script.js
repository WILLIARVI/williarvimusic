// ==========================================================
// SCRIPT PRINCIPAL - Willi ArVi Music
// ==========================================================

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==========================================================
// LIGHTBOX - Visor de imágenes a pantalla completa
// ==========================================================
window.lightbox = {
  el: null,
  img: null,
  counter: null,
  images: [],
  index: 0,

  init() {
    this.el = document.getElementById('lightbox');
    this.img = document.getElementById('lightboxImg');
    this.counter = document.getElementById('lightboxCounter');
    if (!this.el) return;

    document.getElementById('lightboxClose').addEventListener('click', () => this.close());
    document.getElementById('lightboxPrev').addEventListener('click', () => this.prev());
    document.getElementById('lightboxNext').addEventListener('click', () => this.next());

    this.el.addEventListener('click', (e) => {
      if (e.target === this.el) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (!this.el.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'ArrowLeft') this.prev();
    });

    let startX = 0;
    this.el.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });
    this.el.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - startX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) this.next(); else this.prev();
      }
    }, { passive: true });
  },

  open(images, index) {
    if (!this.el || !images || !images.length) return;
    this.images = images;
    this.index = index || 0;
    this.show();
    this.el.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  show() {
    if (!this.images.length) return;
    this.img.src = this.images[this.index];
    if (this.counter) {
      this.counter.textContent = this.images.length > 1
        ? `${this.index + 1} / ${this.images.length}`
        : '';
    }
    const prev = document.getElementById('lightboxPrev');
    const next = document.getElementById('lightboxNext');
    if (prev && next) {
      const single = this.images.length <= 1;
      prev.style.display = single ? 'none' : 'flex';
      next.style.display = single ? 'none' : 'flex';
    }
  },

  close() {
    if (!this.el) return;
    this.el.classList.remove('active');
    document.body.style.overflow = '';
  },

  next() {
    if (this.images.length <= 1) return;
    this.index = (this.index + 1) % this.images.length;
    this.show();
  },

  prev() {
    if (this.images.length <= 1) return;
    this.index = (this.index - 1 + this.images.length) % this.images.length;
    this.show();
  }
};

// ==========================================================
// HELPER: Detectar si el usuario está haciendo swipe (touch)
// Sirve para no abrir el lightbox cuando el usuario quiere
// simplemente pasar a la siguiente foto del carrusel.
// ==========================================================
function attachSwipeSafeClick(element, handler) {
  let touchMoved = false;
  let startX = 0;
  let startY = 0;

  element.addEventListener('touchstart', (e) => {
    touchMoved = false;
    startX = e.changedTouches[0].screenX;
    startY = e.changedTouches[0].screenY;
  }, { passive: true });

  element.addEventListener('touchmove', (e) => {
    const dx = Math.abs(e.changedTouches[0].screenX - startX);
    const dy = Math.abs(e.changedTouches[0].screenY - startY);
    if (dx > 10 || dy > 10) touchMoved = true;
  }, { passive: true });

  element.addEventListener('click', (e) => {
    if (touchMoved) {
      touchMoved = false;
      return; // Ignorar: fue un swipe, no un tap
    }
    handler(e);
  });
}

// ==========================================================
// INICIALIZACIÓN GENERAL
// ==========================================================
document.addEventListener('DOMContentLoaded', function () {
  // Año dinámico del footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Toggle de menú móvil
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('active'));
    });
  }

  // Navbar opaco al hacer scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.background = window.scrollY > 50
        ? 'rgba(0,0,0,0.98)'
        : 'rgba(0,0,0,0.88)';
    });
  }

  // Inicializar lightbox
  window.lightbox.init();

  // Aplicar lightbox a imágenes con clase .zoomable (portada, eventos, QR)
  document.querySelectorAll('.zoomable').forEach(img => {
    img.style.cursor = 'zoom-in';

    attachSwipeSafeClick(img, () => {
      const isQR = img.classList.contains('support-qr');
      const src = img.src;
      const section = img.closest('section');
      let group = [src];
      let idx = 0;

      if (!isQR && section) {
        // Todas las imágenes zoomables de la misma sección (excepto QR)
        const siblings = section.querySelectorAll('.zoomable:not(.support-qr)');
        if (siblings.length > 1) {
          group = Array.from(siblings).map(i => i.src);
          idx = group.indexOf(src);
          if (idx < 0) idx = 0;
        }
      }
      window.lightbox.open(group, idx);
    });
  });

  // Render dinámico
  renderStore();
  renderPodcast();
  renderVideos();
});

// ==========================================================
// TIENDA
// ==========================================================
function renderStore() {
  const grid = document.getElementById('storeGrid');
  if (!grid || !CONFIG.productos) return;

  const formUrl = CONFIG.forms.compras;

  grid.innerHTML = CONFIG.productos.map(p => {
    const fotos = [];
    for (let i = 1; i <= (p.fotos || 3); i++) {
      fotos.push(`assets/productos/${p.slug}/${i}.jpg`);
    }

    return `
      <div class="product-card" data-slug="${p.slug}">
        <div class="product-gallery">
          ${fotos.map((url, i) => `
            <div class="product-gallery-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
              <img src="${url}" alt="${p.nombre}" loading="lazy">
            </div>
          `).join('')}
          ${fotos.length > 1 ? `
            <button class="product-gallery-arrow prev" aria-label="Anterior" type="button"><i class="fas fa-chevron-left"></i></button>
            <button class="product-gallery-arrow next" aria-label="Siguiente" type="button"><i class="fas fa-chevron-right"></i></button>
            <div class="product-gallery-nav">
              ${fotos.map((_, i) => `<button class="product-gallery-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Foto ${i + 1}" type="button"></button>`).join('')}
            </div>
          ` : ''}
        </div>
        <div class="product-info">
          <h3>${p.nombre}</h3>
          <p class="product-description">${p.descripcionCorta}</p>
          <button class="product-toggle-desc" type="button">Ver más detalles</button>
          <p class="product-description-full">${p.descripcionLarga}</p>
          <span class="product-price">${p.precio}</span>
          <a href="${formUrl}" target="_blank" class="product-btn">
            <i class="fas fa-shopping-cart"></i> Comprar
          </a>
        </div>
      </div>
    `;
  }).join('');

  // Inicializar cada tarjeta de producto
  grid.querySelectorAll('.product-card').forEach(card => {
    initProductGallery(card);
    const btn = card.querySelector('.product-toggle-desc');
    if (btn) {
      btn.addEventListener('click', () => {
        card.classList.toggle('expanded');
        btn.textContent = card.classList.contains('expanded') ? 'Ver menos' : 'Ver más detalles';
      });
    }
  });

  // Adjuntar lightbox a las imágenes de productos (con protección anti-swipe)
  grid.querySelectorAll('.product-gallery-slide img').forEach(img => {
    img.style.cursor = 'zoom-in';

    attachSwipeSafeClick(img, () => {
      const card = img.closest('.product-card');
      if (!card) return;
      const allImgs = card.querySelectorAll('.product-gallery-slide img');
      const srcs = Array.from(allImgs).map(i => i.src);
      const idx = srcs.indexOf(img.src);
      window.lightbox.open(srcs, idx >= 0 ? idx : 0);
    });
  });
}

function initProductGallery(card) {
  const slides = card.querySelectorAll('.product-gallery-slide');
  const dots = card.querySelectorAll('.product-gallery-dot');
  const prev = card.querySelector('.product-gallery-arrow.prev');
  const next = card.querySelector('.product-gallery-arrow.next');
  let idx = 0;

  if (!slides.length) return;

  function go(i) {
    if (i < 0) i = slides.length - 1;
    if (i >= slides.length) i = 0;
    idx = i;
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
  }

  if (prev) prev.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); go(idx - 1); });
  if (next) next.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); go(idx + 1); });
  dots.forEach(d => d.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); go(parseInt(d.dataset.index)); }));

  let touchStartX = 0;
  const gallery = card.querySelector('.product-gallery');
  if (gallery) {
    gallery.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    gallery.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 40) { if (diff < 0) go(idx + 1); else go(idx - 1); }
    }, { passive: true });
  }
}

// ==========================================================
// PODCAST
// ==========================================================
function renderPodcast() {
  const grid = document.getElementById('podcastGrid');
  if (!grid || !CONFIG.podcast) return;

  const videos = CONFIG.podcast.videos || [];

  if (!videos.length) {
    grid.innerHTML = `<div class="podcast-empty">Próximamente nuevos episodios de "${CONFIG.podcast.nombre}".</div>`;
    return;
  }

  grid.innerHTML = videos.map(v => `
    <div class="podcast-item">
      <iframe
        src="https://www.youtube.com/embed/${v.id}"
        title="${v.titulo || 'Episodio'}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy">
      </iframe>
      <div class="podcast-item-info">
        <h4>${v.titulo || 'Episodio'}</h4>
        ${v.descripcion ? `<p>${v.descripcion}</p>` : ''}
      </div>
    </div>
  `).join('');
}

// ==========================================================
// VIDEOS CON TABS
// ==========================================================
function renderVideos() {
  const wrapper = document.getElementById('videoEmbedWrapper');
  const tabs = document.querySelectorAll('.video-tab');
  if (!wrapper || !tabs.length) return;

  function loadPlaylist(key) {
    const url = CONFIG.videos[key];
    if (!url || url === '#') {
      wrapper.innerHTML = `
        <div class="video-empty">
          <i class="fas fa-play-circle"></i>
          <p>Próximamente nuevos videos en esta categoría. Mientras tanto, visítanos en YouTube.</p>
          <a href="https://youtube.com/@williarvimusic" target="_blank" class="btn btn-primary">
            <i class="fab fa-youtube"></i> Ir a YouTube
          </a>
        </div>`;
      return;
    }

    const match = url.match(/[?&]list=([^&]+)/);
    const listId = match ? match[1] : url;

    wrapper.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/videoseries?list=${listId}"
        title="Playlist"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy">
      </iframe>`;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadPlaylist(tab.dataset.tab);
    });
  });

  loadPlaylist(tabs[0].dataset.tab);
}
