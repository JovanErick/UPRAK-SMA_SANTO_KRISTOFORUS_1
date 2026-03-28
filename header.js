 /* Mobile Nav Drawer */
      const hamburgerBtn = document.getElementById("hamburgerBtn");
      const mobileOverlay = document.getElementById("mobileOverlay");
      const mobileNav = document.getElementById("mobileNav");
      const mobileNavClose = document.getElementById("mobileNavClose");

      function openMobileNav() {
        mobileOverlay.style.display = "block";
        requestAnimationFrame(() => {
          mobileOverlay.classList.add("is-open");
          mobileNav.classList.add("is-open");
        });
        hamburgerBtn.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      }

      function closeMobileNav() {
        mobileOverlay.classList.remove("is-open");
        mobileNav.classList.remove("is-open");
        hamburgerBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        setTimeout(() => {
          mobileOverlay.style.display = "none";
        }, 300);
      }

      hamburgerBtn.addEventListener("click", openMobileNav);
      mobileNavClose.addEventListener("click", closeMobileNav);
      mobileOverlay.addEventListener("click", closeMobileNav);
      document.querySelectorAll("[data-mobile-link]").forEach((link) => {
        link.addEventListener("click", closeMobileNav);
      });