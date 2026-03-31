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

  const updateSlider = (value) => {
    afterImage.style.clipPath = `inset(0 0 0 ${value}%)`;
    line.style.left = `${value}%`;
  };

  updateSlider(range.value);

  range.addEventListener("input", (e) => {
    updateSlider(e.target.value);
  });
});
