/* ── Card Slider ────────────────── */

(function () {
  'use strict';

  /* Buat overlay sekali */
  const overlay = document.createElement('div');
  overlay.className = 'card-slider-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Slider gambar');
  overlay.innerHTML = `
    <div class="card-slider">
      <div class="card-slider__track-wrap">
        <div class="card-slider__track" id="sliderTrack"></div>
        <button class="card-slider__btn card-slider__btn--prev" id="sliderPrev" aria-label="Sebelumnya">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="card-slider__btn card-slider__btn--next" id="sliderNext" aria-label="Berikutnya">
          <i class="fas fa-chevron-right"></i>
        </button>
        <div class="card-slider__dots" id="sliderDots"></div>
        <div class="card-slider__counter" id="sliderCounter">1 / 1</div>
      </div>
      <div class="card-slider__info">
        <div class="card-slider__info-text">
          <p class="card-slider__category" id="sliderCategory"></p>
          <p class="card-slider__title"    id="sliderTitle"></p>
        </div>
        <button class="card-slider__close" id="sliderClose" aria-label="Tutup">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  /* Referensi elemen */
  const track    = overlay.querySelector('#sliderTrack');
  const btnPrev  = overlay.querySelector('#sliderPrev');
  const btnNext  = overlay.querySelector('#sliderNext');
  const dotsWrap = overlay.querySelector('#sliderDots');
  const counter  = overlay.querySelector('#sliderCounter');
  const catEl    = overlay.querySelector('#sliderCategory');
  const titleEl  = overlay.querySelector('#sliderTitle');
  const closeBtn = overlay.querySelector('#sliderClose');

  let current = 0;
  let total   = 0;
  let dots    = [];

  /* Navigasi */
  function goTo(index) {
    if (index < 0 || index >= total) return;
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    counter.textContent   = `${current + 1} / ${total}`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === total - 1;
  }

  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  /* Keyboard */
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'Escape')     closeSlider();
  });

  /* Swipe (touch) */
  let touchStartX = 0;
  overlay.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  overlay.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }
  }, { passive: true });

  /* Tutup slider */
  function closeSlider() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      track.innerHTML    = '';
      dotsWrap.innerHTML = '';
      dots = [];
    }, 320);
  }

  closeBtn.addEventListener('click', closeSlider);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSlider();
  });

  /* Buka slider */
  function openSlider(images, category, title, startIndex) {
    track.innerHTML    = '';
    dotsWrap.innerHTML = '';
    dots               = [];
    current            = startIndex || 0;
    total              = images.length;

    catEl.textContent   = category  || '';
    titleEl.textContent = title     || '';

    // Build slides
    images.forEach((src, i) => {
      const slide = document.createElement('div');

      if (src) {
        slide.className = 'card-slider__slide';
        const img = document.createElement('img');
        img.src    = src;
        img.alt    = `${title} — foto ${i + 1}`;
        img.loading = i === 0 ? 'eager' : 'lazy';
        slide.appendChild(img);
      } else {
        slide.className = 'card-slider__slide-placeholder';
        slide.innerHTML = `<i class="fas fa-image"></i><span>Foto segera hadir</span>`;
      }

      track.appendChild(slide);

      // Dot
      const dot = document.createElement('button');
      dot.className  = 'card-slider__dot';
      dot.setAttribute('aria-label', `Foto ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    // Sembunyikan dots jika hanya 1 gambar
    dotsWrap.style.display = total <= 1 ? 'none' : '';
    counter.style.display  = total <= 1 ? 'none' : '';

    goTo(current);

    document.body.style.overflow = 'hidden';
    overlay.classList.add('is-open');
    closeBtn.focus();
  }

  /* Pasang listener ke semua card */
  function getImages(card) {
    // 1. Cek data-images attribute (JSON array string)
    const dataImages = card.getAttribute('data-images');
    if (dataImages) {
      try {
        const parsed = JSON.parse(dataImages);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      } catch (_) {}
    }

    // 2. Ambil semua <img> di dalam media wrapper
    const mediaWrap = card.querySelector(
      '.fac-card__media, .ekskul-card__media'
    );
    if (mediaWrap) {
      const imgs = [...mediaWrap.querySelectorAll('img')].map(i => i.src);
      if (imgs.length) return imgs;
    }

    return [null];
  }

  function getMeta(card) {
    const nameEl = card.querySelector(
      '.fac-card__name, .ekskul-card__name'
    );
    const catEl  = card.querySelector(
      '.fac-card__category, .ekskul-card__category'
    );
    return {
      title:    nameEl ? nameEl.textContent.trim() : '',
      category: catEl  ? catEl.textContent.trim()  : '',
    };
  }

  function attachListeners() {
    const cards = document.querySelectorAll('.fac-card, .ekskul-card');

    cards.forEach((card) => {
      // Klik pada media area saja
      const media = card.querySelector(
        '.fac-card__media, .ekskul-card__media'
      );
      if (!media) return;

      media.addEventListener('click', (e) => {
        e.preventDefault();
        const images   = getImages(card);
        const { title, category } = getMeta(card);
        openSlider(images, category, title, 0);
      });
    });
  }

  // Jalankan setelah DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachListeners);
  } else {
    attachListeners();
  }

  // Expose untuk re-attach setelah filter
  window.CardSlider = { attach: attachListeners, open: openSlider };

})();