// ==========================================================
// RESEÑAS - Willi ArVi Music
// ==========================================================

(function () {
  const carouselEl = document.getElementById('reviewsCarousel');
  const dotsEl = document.getElementById('reviewsDots');
  const prevBtn = document.getElementById('reviewsPrev');
  const nextBtn = document.getElementById('reviewsNext');

  if (!carouselEl) return;

  let reviews = [];
  let currentIndex = 0;
  let autoPlayTimer = null;

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];

      if (inQuotes) {
        if (c === '"' && next === '"') { cell += '"'; i++; }
        else if (c === '"') { inQuotes = false; }
        else { cell += c; }
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ',') { row.push(cell); cell = ''; }
        else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
        else if (c === '\r') { }
        else { cell += c; }
      }
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderStars(n) {
    n = Math.max(0, Math.min(5, parseInt(n) || 0));
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += i <= n ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    return html;
  }

  function getInitial(name) {
    return (name || '?').trim().charAt(0).toUpperCase();
  }

  async function loadReviews() {
    try {
      const url = CONFIG.reviewsCSV;
      if (!url || url === '#') throw new Error('URL no configurada');

      const r = await fetch(url);
      if (!r.ok) throw new Error('Error de red');
      const text = await r.text();

      const rows = parseCSV(text);
      if (rows.length < 2) {
        carouselEl.innerHTML = `<div class="review-loading">Aún no hay reseñas. ¡Sé el primero en compartir la tuya!</div>`;
        return;
      }

      reviews = rows.slice(1)
        .filter(row => row.length >= 5)
        .filter(row => {
          const autoriza = (row[5] || '').toLowerCase().trim();
          return autoriza === '' || autoriza.startsWith('s');
        })
        .map(row => ({
          nombre: row[1] || 'Anónimo',
          ciudad: row[2] || '',
          calificacion: row[3] || '5',
          texto: row[4] || '',
          fecha: row[0] || ''
        }))
        .filter(r => r.texto && r.texto.trim().length > 0);

      if (!reviews.length) {
        carouselEl.innerHTML = `<div class="review-loading">Aún no hay reseñas publicadas.</div>`;
        return;
      }

      renderCarousel();
      restartAutoPlay();
    } catch (e) {
      console.error('Error cargando reseñas:', e);
      carouselEl.innerHTML = `<div class="review-loading">No se pudieron cargar las reseñas.</div>`;
    }
  }

  function renderCarousel() {
    carouselEl.innerHTML = reviews.map((r, i) => `
      <div class="review-card ${i === 0 ? 'active' : ''}" data-index="${i}" style="${i === 0 ? '' : 'display:none'}">
        <div class="review-stars">${renderStars(r.calificacion)}</div>
        <p class="review-text">“${escapeHtml(r.texto)}”</p>
        <div class="review-author">
          <div class="review-author-avatar">${getInitial(r.nombre)}</div>
          <div class="review-author-info">
            <h4>${escapeHtml(r.nombre)}</h4>
            ${r.ciudad ? `<p>${escapeHtml(r.ciudad)}</p>` : ''}
          </div>
        </div>
      </div>
    `).join('');

    if (dotsEl) {
      dotsEl.innerHTML = reviews.map((_, i) =>
        `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Ir a reseña ${i + 1}"></button>`
      ).join('');

      dotsEl.querySelectorAll('.carousel-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          goTo(parseInt(dot.dataset.index));
          restartAutoPlay();
        });
      });
    }
  }

  function goTo(index) {
    const cards = carouselEl.querySelectorAll('.review-card');
    const dots = dotsEl ? dotsEl.querySelectorAll('.carousel-dot') : [];
    if (!cards.length) return;

    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;
    currentIndex = index;

    cards.forEach((c, i) => {
      c.style.display = i === index ? 'block' : 'none';
      c.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  function restartAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    if (reviews.length > 1) autoPlayTimer = setInterval(next, 7000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartAutoPlay(); });

  let touchStartX = 0;
  carouselEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  carouselEl.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) next(); else prev();
      restartAutoPlay();
    }
  }, { passive: true });

  document.addEventListener('DOMContentLoaded', loadReviews);
})();