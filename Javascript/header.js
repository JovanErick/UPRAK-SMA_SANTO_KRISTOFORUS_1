/* ── Mobile Navigation Drawer ────────────────── */
// Ambil elemen-elemen yang diperlukan untuk navigasi mobile
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileOverlay = document.getElementById("mobileOverlay");
const mobileNav = document.getElementById("mobileNav");
const mobileNavClose = document.getElementById("mobileNavClose");

// Fungsi untuk membuka drawer mobile
function openMobileNav() {
  mobileOverlay.style.display = "block";
  requestAnimationFrame(() => {
    mobileOverlay.classList.add("is-open");
    mobileNav.classList.add("is-open");
  });
  hamburgerBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

// Fungsi untuk menutup drawer mobile
function closeMobileNav() {
  mobileOverlay.classList.remove("is-open");
  mobileNav.classList.remove("is-open");
  hamburgerBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  setTimeout(() => {
    mobileOverlay.style.display = "none";
  }, 300);
}

// Event listener untuk tombol hamburger dan penutupan
hamburgerBtn.addEventListener("click", openMobileNav);
mobileNavClose.addEventListener("click", closeMobileNav);
mobileOverlay.addEventListener("click", closeMobileNav);
document.querySelectorAll("[data-mobile-link]").forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});