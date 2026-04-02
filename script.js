const mobileToggle = document.getElementById("mobileToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    mobileToggle.textContent = mobileMenu.classList.contains("open") ? "✕" : "☰";
  });

  document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      mobileToggle.textContent = "☰";
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");
if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));
}

const scrollTopBtn = document.getElementById("scrollTopBtn");
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.querySelectorAll("[data-before-after]").forEach(slider => {
  const range = slider.querySelector(".ba-range");
  const afterImage = slider.querySelector(".ba-image--after");
  const line = slider.querySelector(".ba-overlay-line");
  const handle = slider.querySelector(".ba-handle");
  const hint = slider.querySelector(".ba-hint");

  const updateSlider = (value) => {
    afterImage.style.clipPath = `inset(0 0 0 ${value}%)`;
    line.style.left = `${value}%`;

    if (handle) {
      handle.style.left = `${value}%`;
    }
  };

  updateSlider(range.value);

  range.addEventListener("input", (e) => {
    updateSlider(e.target.value);

    if (hint) {
      hint.style.opacity = "0";
      hint.style.transition = "opacity 0.25s ease";
    }

    if (handle) {
      handle.style.animation = "none";
    }
  });
});
// 🔥 COOKIE SYSTEM FIXED

function acceptCookies() {
  localStorage.setItem("cookieConsent", "accepted");

  const banner = document.getElementById("cookie-banner");
  if (banner) banner.style.display = "none";

  if (!gaConsent && typeof enableAnalytics === "function") {
    gaConsent = true;
    enableAnalytics();
  }
}

function declineCookies() {
  localStorage.setItem("cookieConsent", "declined");

  const banner = document.getElementById("cookie-banner");
  if (banner) banner.style.display = "none";
}

window.addEventListener("DOMContentLoaded", function () {
  const consent = localStorage.getItem("cookieConsent");
  const banner = document.getElementById("cookie-banner");

  if (!banner) return;

  // 🔥 WICHTIG: NICHT direkt verstecken!
  if (!consent) {
    banner.style.display = "flex";
  } else {
    banner.style.display = "none";

    if (consent === "accepted" && typeof enableAnalytics === "function") {
      enableAnalytics();
    }
  }
});
