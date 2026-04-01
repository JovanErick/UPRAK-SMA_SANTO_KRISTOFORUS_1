/* ── Hero: Keyword Carousel + Progress Bar ────────────────── */
// Mendapatkan elemen-elemen yang diperlukan untuk carousel
const wrapper = document.getElementById('keywordWrapper');
const track   = document.getElementById('keywordTrack');
const descs   = document.querySelectorAll('.hero__desc');
const fill    = document.getElementById('progressFill');

// Konfigurasi interval dan jumlah item
const INTERVAL = 3200;
const total    = 3;
let current    = 0;
let locked     = false;

// Fungsi untuk mengatur lebar setiap cell (span) agar sesuai dengan lebar wrapper
function setCellWidths() {
  const w = Math.min(wrapper.offsetWidth, 700); // Cap at 700px to prevent overflow
  track.querySelectorAll('span').forEach(s => s.style.width = w + 'px');
}

setCellWidths();
window.addEventListener('resize', setCellWidths);

// Fungsi untuk memulai animasi progress bar
function startProgress() {
  fill.style.transition = 'none';
  fill.style.width = '0%';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fill.style.transition = `width ${INTERVAL + 450}ms linear`;
      fill.style.width = '100%';
    });
  });
}

// Fungsi untuk berpindah ke keyword berikutnya
function next() {
  if (locked) return;
  locked = true;

  const nextIdx = current + 1;
  const slideWidth = Math.min(wrapper.offsetWidth, 700); // Use same capped width

  track.style.transition = 'transform 0.72s cubic-bezier(0.77,0,0.18,1)';
  track.style.transform  = `translateX(-${nextIdx * slideWidth}px)`;

  descs.forEach(d => d.classList.remove('is-active'));
  descs[nextIdx % total].classList.add('is-active');

  current = nextIdx;

  setTimeout(() => {
    if (current >= total) {
      track.style.transition = 'none';
      track.style.transform  = 'translateX(0)';
      current = 0;
    }
    locked = false;
    startProgress();
  }, 1000);
}

// Memulai progress bar dan interval perpindahan
startProgress();
setInterval(next, INTERVAL);

/* ── Bagian Navigasi: Active Indicator dengan IntersectionObserver ── */
// Ambil semua link navigasi desktop dan mobile
const navLinks    = document.querySelectorAll('#main-nav .site-nav__link');
const mobileLinks = document.querySelectorAll('[data-mobile-link]');

// Dapatkan section yang dituju oleh setiap link
const sections = [...navLinks].map(link => {
  const id = link.getAttribute('href').replace('#', '');
  return document.getElementById(id);
}).filter(Boolean);

// Fungsi untuk menghapus class active dari semua link
function removeActiveClasses() {
  navLinks.forEach(l => l.classList.remove('is-active'));
  mobileLinks.forEach(l => l.classList.remove('is-active'));
}

// Event listener untuk scroll: saat di posisi paling atas, hapus active
function handleScroll() {
  if (window.scrollY === 0) {
    removeActiveClasses();
  }
}

window.addEventListener('scroll', handleScroll);
// Panggil sekali untuk memastikan keadaan awal saat halaman dimuat
handleScroll();

// Observasi perubahan posisi section
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    
    // Hanya set active jika scrollY > 0 (tidak sedang di paling atas)
    if (window.scrollY > 0) {
      removeActiveClasses();
      const id = entry.target.id;
      const desktopLink = document.querySelector(`#main-nav a[href="#${id}"]`);
      const mobileLink  = document.querySelector(`[data-mobile-link][href="#${id}"]`);
      if (desktopLink) desktopLink.classList.add('is-active');
      if (mobileLink)  mobileLink.classList.add('is-active');
    }
  });
}, {
  root: null,
  rootMargin: '0px 0px -80% 0px',
  threshold: 0,
});

sections.forEach(section => observer.observe(section));
