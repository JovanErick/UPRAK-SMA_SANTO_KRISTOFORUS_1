/* ── Animation ────────────────── */
(function () {
  "use strict";

  const SELECTOR = "[data-reveal]";
  const THRESHOLD = 0.15; // elemen terlihat 15% baru trigger

  function initReveal() {
    const elements = document.querySelectorAll(SELECTOR);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Berhenti observasi setelah animasi selesai (one-shot)
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: THRESHOLD }
    );

    elements.forEach((el) => observer.observe(el));
  }

  // Jalankan setelah DOM siap
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReveal);
  } else {
    initReveal();
  }
})();