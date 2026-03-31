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

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === "alle" || filter === category) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".project-image img").forEach(img => {
  img.addEventListener("click", () => {
    if (lightbox && lightboxImage) {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightbox.classList.add("open");
    }
  });
});

if (lightboxClose && lightbox && lightboxImage) {
  lightboxClose.addEventListener("click", () => {
    lightbox.classList.remove("open");
    lightboxImage.src = "";
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("open");
      lightboxImage.src = "";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      lightbox.classList.remove("open");
      lightboxImage.src = "";
    }
  });
}

const scrollTopBtn = document.getElementById("scrollTopBtn");
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
const cookieBanner = document.getElementById("cookieBanner");
const cookieModal = document.getElementById("cookieModal");
const openCookieSettings = document.getElementById("openCookieSettings");
const cookieOnlyNecessary = document.getElementById("cookieOnlyNecessary");
const cookieAcceptAll = document.getElementById("cookieAcceptAll");
const cookieSaveSelection = document.getElementById("cookieSaveSelection");
const cookieAcceptAllModal = document.getElementById("cookieAcceptAllModal");
const cookieModalBackdrop = document.getElementById("cookieModalBackdrop");
const cookieStats = document.getElementById("cookieStats");
const cookieExternal = document.getElementById("cookieExternal");

const COOKIE_KEY = "cu_mainwerk_cookie_settings_v1";

function getCookieSettings() {
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCookieSettings(settings) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify({
    necessary: true,
    stats: !!settings.stats,
    external: !!settings.external,
    savedAt: new Date().toISOString()
  }));
  applyCookieSettings();
}

function applyCookieSettings() {
  const settings = getCookieSettings();

  if (!settings) {
    cookieBanner?.removeAttribute("hidden");
    return;
  }

  cookieBanner?.setAttribute("hidden", "");
  cookieModal?.setAttribute("hidden", "");

  // Später hier optionale Dienste nach Zustimmung laden:
  // if (settings.stats) { loadAnalytics(); }
  // if (settings.external) { enableExternalEmbeds(); }
}

function openCookieModal() {
  const settings = getCookieSettings() || { stats: false, external: false };
  if (cookieStats) cookieStats.checked = !!settings.stats;
  if (cookieExternal) cookieExternal.checked = !!settings.external;
  cookieModal?.removeAttribute("hidden");
}

function closeCookieModal() {
  cookieModal?.setAttribute("hidden", "");
}

openCookieSettings?.addEventListener("click", openCookieModal);
cookieOnlyNecessary?.addEventListener("click", () => {
  saveCookieSettings({ stats: false, external: false });
});
cookieAcceptAll?.addEventListener("click", () => {
  saveCookieSettings({ stats: true, external: true });
});
cookieSaveSelection?.addEventListener("click", () => {
  saveCookieSettings({
    stats: cookieStats?.checked,
    external: cookieExternal?.checked
  });
});
cookieAcceptAllModal?.addEventListener("click", () => {
  saveCookieSettings({ stats: true, external: true });
});
cookieModalBackdrop?.addEventListener("click", closeCookieModal);

applyCookieSettings();
