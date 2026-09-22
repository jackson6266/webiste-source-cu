(() => {
  "use strict";
  const one = (s, root = document) => root.querySelector(s);
  const all = (s, root = document) => [...root.querySelectorAll(s)];
  const menu = one(".menu-toggle");
  const nav = one(".main-nav");
  const banner = one(".cookie-banner");
  const sticky = one(".mobile-contact");
  function updateSticky() {
    if (!sticky) return;
    const hero = one(".hero").getBoundingClientRect();
    const contact = one("#kontakt").getBoundingClientRect();
    const footer = one(".site-footer").getBoundingClientRect();
    sticky.hidden =
      innerWidth > 700 ||
      hero.bottom > 0 ||
      contact.top < innerHeight ||
      footer.top < innerHeight ||
      !banner.hidden ||
      menu?.getAttribute("aria-expanded") === "true";
  }
  function setMenu(open) {
    menu?.setAttribute("aria-expanded", String(open));
    nav?.classList.toggle("is-open", open);
    updateSticky();
  }
  menu?.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") !== "true"));
  all("a", nav || document).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu?.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menu.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) setMenu(false);
  });
  let scrollPending = false;
  addEventListener(
    "scroll",
    () => {
      if (scrollPending) return;
      scrollPending = true;
      requestAnimationFrame(() => {
        updateSticky();
        scrollPending = false;
      });
    },
    { passive: true },
  );
  addEventListener("resize", () => {
    if (innerWidth > 900) setMenu(false);
    updateSticky();
  });

  all("[data-service]").forEach((link) =>
    link.addEventListener("click", () => {
      const select = one("#bereich");
      if (select) select.value = link.dataset.service;
    }),
  );
  all("[data-comparison-range]").forEach((range) => {
    const frame = one("[data-comparison]", range.closest(".comparison-card"));
    const line = one(".comparison-line", frame);
    const handle = one("span", line);
    line.removeAttribute("aria-hidden");
    handle.setAttribute("role", "slider");
    handle.setAttribute("tabindex", "0");
    handle.setAttribute("aria-label", range.getAttribute("aria-label"));
    handle.setAttribute("aria-valuemin", "0");
    handle.setAttribute("aria-valuemax", "100");
    handle.setAttribute("aria-orientation", "horizontal");
    handle.title = "Ziehen oder mit den Pfeiltasten verschieben";
    const update = () => {
      frame.style.setProperty("--split", `${range.value}%`);
      range.setAttribute("aria-valuetext", `${range.value} Prozent Vorher-Bild`);
      handle.setAttribute("aria-valuenow", range.value);
      handle.setAttribute("aria-valuetext", range.getAttribute("aria-valuetext"));
      one(".label-before", frame).hidden = Number(range.value) < 15;
      one(".label-after", frame).hidden = Number(range.value) > 85;
    };
    range.addEventListener("input", update);
    const move = (event) => {
      const rect = frame.getBoundingClientRect();
      range.value = Math.round(
        Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)),
      );
      update();
    };
    let pointer = null;
    frame.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      pointer = event.pointerId;
      frame.setPointerCapture(pointer);
      handle.focus({ preventScroll: true });
      move(event);
    });
    frame.addEventListener("pointermove", (event) => {
      if (event.pointerId === pointer) move(event);
    });
    const endDrag = (event) => {
      if (event.pointerId !== pointer) return;
      pointer = null;
      if (frame.hasPointerCapture(event.pointerId)) frame.releasePointerCapture(event.pointerId);
    };
    frame.addEventListener("pointerup", endDrag);
    frame.addEventListener("pointercancel", endDrag);
    frame.addEventListener("lostpointercapture", () => {
      pointer = null;
    });
    frame.addEventListener("dragstart", (event) => event.preventDefault());
    handle.addEventListener("keydown", (event) => {
      const keys = {
        ArrowLeft: -1,
        ArrowDown: -1,
        ArrowRight: 1,
        ArrowUp: 1,
        PageDown: -10,
        PageUp: 10,
      };
      if (!(event.key in keys) && !["Home", "End"].includes(event.key)) return;
      event.preventDefault();
      range.value =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? 100
            : Number(range.value) + keys[event.key];
      update();
    });
    update();
  });
  const slideshow = one("[data-slideshow]");
  if (slideshow) {
    const slides = all(".hero-slide", slideshow);
    const dots = all("[data-slide]", slideshow);
    const toggle = one("[data-slide-toggle]", slideshow);
    const caption = one("[data-slide-caption]", slideshow);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let index = 0;
    let paused = motion.matches;
    let hovered = false;
    let visible = true;
    let timer;
    let request = 0;
    const load = (slide) => {
      if (slide.dataset.src) {
        slide.srcset = slide.dataset.srcset;
        slide.src = slide.dataset.src;
        delete slide.dataset.src;
      }
      return slide
        .decode()
        .then(() => true)
        .catch(() => false);
    };
    const schedule = () => {
      clearTimeout(timer);
      if (!paused && !hovered && visible && !document.hidden)
        timer = setTimeout(() => show(index + 1), 5500);
    };
    const syncToggle = () => {
      toggle.setAttribute("aria-label", paused ? "Slideshow abspielen" : "Slideshow pausieren");
      toggle.setAttribute("aria-pressed", String(!paused));
      one("[data-play-icon]", toggle).hidden = !paused;
      one("[data-pause-icon]", toggle).hidden = paused;
    };
    const show = async (next) => {
      clearTimeout(timer);
      const id = ++request;
      next = (next + slides.length) % slides.length;
      const loaded = await load(slides[next]);
      if (id !== request) return;
      if (loaded) {
        index = next;
        slides.forEach((slide, i) => {
          slide.classList.toggle("is-active", i === index);
          slide.setAttribute("aria-hidden", String(i !== index));
        });
        dots.forEach((dot, i) => dot.setAttribute("aria-current", String(i === index)));
        caption.textContent = `${String(index + 1).padStart(2, "0")} / ${slides[index].dataset.title}`;
        load(slides[(index + 1) % slides.length]);
      }
      schedule();
    };
    dots.forEach((dot) => dot.addEventListener("click", () => show(Number(dot.dataset.slide))));
    one("[data-slide-prev]", slideshow).addEventListener("click", () => show(index - 1));
    one("[data-slide-next]", slideshow).addEventListener("click", () => show(index + 1));
    toggle.addEventListener("click", () => {
      paused = !paused;
      syncToggle();
      schedule();
    });
    slideshow.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") {
        hovered = true;
        schedule();
      }
    });
    slideshow.addEventListener("pointerleave", () => {
      hovered = false;
      schedule();
    });
    slideshow.addEventListener("focusin", (event) => {
      if (event.target === toggle) return;
      paused = true;
      syncToggle();
      schedule();
    });
    document.addEventListener("visibilitychange", schedule);
    motion.addEventListener("change", () => {
      paused = motion.matches;
      syncToggle();
      schedule();
    });
    if ("IntersectionObserver" in window)
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        schedule();
      }).observe(slideshow);
    one(".slideshow-controls", slideshow).hidden = false;
    syncToggle();
    load(slides[1]);
    schedule();
  }
  const filters = one(".filters");
  if (filters) {
    filters.hidden = false;
    all("[data-filter]", filters).forEach((button) =>
      button.addEventListener("click", () => {
        all("[data-filter]", filters).forEach((b) =>
          b.setAttribute("aria-pressed", String(b === button)),
        );
        let count = 0;
        all("[data-category]").forEach((tile) => {
          tile.hidden =
            button.dataset.filter !== "all" && tile.dataset.category !== button.dataset.filter;
          if (!tile.hidden) count++;
        });
        one("#filter-status").textContent =
          `${count} ${count === 1 ? "Projekt" : "Projekte"} angezeigt.`;
      }),
    );
  }
  const dialog = one(".lightbox");
  if (dialog && typeof dialog.showModal === "function") {
    let opener;
    let pictures = [];
    let position = 0;
    function showPicture() {
      const link = pictures[position];
      const img = one("img", dialog);
      img.src = link.href;
      img.alt = one("img", link).alt;
      one("p", dialog).textContent = link.dataset.caption;
      one("[data-photo-position]", dialog).textContent = `${position + 1} / ${pictures.length}`;
      one(".lightbox-navigation", dialog).hidden = pictures.length < 2;
    }
    function step(direction) {
      position = (position + direction + pictures.length) % pictures.length;
      showPicture();
    }
    all("[data-lightbox]").forEach((link) =>
      link.addEventListener("click", (event) => {
        event.preventDefault();
        opener = link;
        const story = link.closest(".project-story");
        const frames = story ? all(".story-frames [data-lightbox]", story) : [];
        pictures = frames.length ? frames : [link];
        position = Math.max(
          0,
          pictures.findIndex((picture) => picture.href === link.href),
        );
        showPicture();
        dialog.showModal();
      }),
    );
    one("[data-photo-prev]", dialog)?.addEventListener("click", () => step(-1));
    one("[data-photo-next]", dialog)?.addEventListener("click", () => step(1));
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        step(event.key === "ArrowRight" ? 1 : -1);
      }
    });
    one(".lightbox-close", dialog).addEventListener("click", () => dialog.close());
    let backdropPress = false;
    dialog.addEventListener("pointerdown", (event) => {
      const rect = dialog.getBoundingClientRect();
      backdropPress =
        event.target === dialog &&
        (event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom);
    });
    dialog.addEventListener("click", (event) => {
      if (backdropPress && event.target === dialog) dialog.close();
      backdropPress = false;
    });
    dialog.addEventListener("close", () => opener?.focus({ preventScroll: true }));
  }

  all("[data-open-project]").forEach((link) =>
    link.addEventListener("click", () => {
      one('[data-filter="all"]')?.click();
      const details = one(`#projekt-${link.dataset.openProject} details`);
      if (details) details.open = true;
    }),
  );

  const analyticsId = "G-N915KNK197";
  const storageKey = "cu-mainwerk-consent-v1";
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  let analyticsLoaded = false;
  let consentOpener;
  let currentChoice = null;
  window[`ga-disable-${analyticsId}`] = true;
  function analytics(allowed) {
    window[`ga-disable-${analyticsId}`] = !allowed;
    if (!allowed) {
      if (window.gtag) window.gtag("consent", "update", { analytics_storage: "denied" });
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.trim().split("=")[0];
        if (!/^_ga(?:_|$)/.test(name)) return;
        ["", `; domain=${location.hostname}`, "; domain=.cu-mainwerk.de"].forEach((domain) => {
          document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
        });
      });
      return;
    }
    if (!["cu-mainwerk.de", "www.cu-mainwerk.de"].includes(location.hostname)) return;
    if (analyticsLoaded) {
      window.gtag("consent", "update", { analytics_storage: "granted" });
      return;
    }
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", analyticsId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    document.head.append(script);
  }
  if (banner) {
    const readChoice = (raw) => {
      try {
        const saved = JSON.parse(raw);
        return saved &&
          ["accepted", "declined"].includes(saved.choice) &&
          Number.isFinite(saved.at) &&
          Date.now() >= saved.at &&
          Date.now() - saved.at < maxAge
          ? saved.choice
          : null;
      } catch {
        return null;
      }
    };
    const describeChoice = () => {
      one(".cookie-status", banner).textContent =
        currentChoice === "accepted"
          ? "Aktuelle Auswahl: Statistik akzeptiert."
          : currentChoice === "declined"
            ? "Aktuelle Auswahl: Nur notwendige Funktionen."
            : "";
      one("[data-cookie-close]", banner).hidden = !currentChoice;
    };
    const applyChoice = (choice) => {
      currentChoice = choice;
      analytics(choice === "accepted");
      banner.hidden = Boolean(choice);
      describeChoice();
      updateSticky();
    };
    let initialChoice = null;
    try {
      initialChoice = readChoice(localStorage.getItem(storageKey));
    } catch {
      /* Default to no optional tracking. */
    }
    applyChoice(initialChoice);
    all("[data-consent]").forEach((button) =>
      button.addEventListener("click", () => {
        try {
          localStorage.setItem(
            storageKey,
            JSON.stringify({ choice: button.dataset.consent, at: Date.now() }),
          );
        } catch {
          /* Choice still applies to this page. */
        }
        applyChoice(button.dataset.consent);
        consentOpener?.focus({ preventScroll: true });
      }),
    );
    all("[data-cookie-settings]").forEach((button) =>
      button.addEventListener("click", () => {
        consentOpener = button;
        describeChoice();
        banner.hidden = false;
        one("[data-consent]", banner).focus({ preventScroll: true });
        updateSticky();
      }),
    );
    const closeSettings = () => {
      if (!currentChoice) return;
      banner.hidden = true;
      consentOpener?.focus({ preventScroll: true });
      updateSticky();
    };
    one("[data-cookie-close]", banner).addEventListener("click", closeSettings);
    banner.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && currentChoice) {
        event.preventDefault();
        closeSettings();
      }
    });
    // A withdrawal applies to other open pages on the same origin immediately.
    addEventListener("storage", (event) => {
      if (event.key === storageKey || event.key === null) applyChoice(readChoice(event.newValue));
    });
    addEventListener("pageshow", (event) => {
      if (!event.persisted) return;
      try {
        applyChoice(readChoice(localStorage.getItem(storageKey)));
      } catch {
        /* Keep the current page choice. */
      }
    });
  }

  const form = one(".contact-form");
  if (form) {
    const privacy = one("#privacy", form);
    const submit = one(".form-submit", form);
    const status = one("#form-status", form);
    const message = one("#message", form);
    let sending = false;
    const sync = () => {
      submit.disabled = sending || !privacy.checked;
      status.textContent = sending
        ? "Ihre Anfrage wird zur Sicherheitsprüfung weitergeleitet …"
        : privacy.checked
          ? "Bitte prüfen Sie Ihre Angaben. Anschließend können Sie die Anfrage senden."
          : "Bitte bestätigen Sie die Datenschutzhinweise, um die Anfrage zu senden.";
      status.classList.remove("is-error");
      one("[data-message-count]", form).textContent = message.value.length;
    };
    privacy.addEventListener("change", sync);
    message.addEventListener("input", sync);
    all("input[minlength], textarea[minlength]", form).forEach((input) => {
      const validate = () =>
        input.setCustomValidity(
          input.value && input.value.trim().length < input.minLength
            ? `Bitte geben Sie mindestens ${input.minLength} Zeichen ein (ohne äußere Leerzeichen).`
            : "",
        );
      input.addEventListener("input", validate);
      validate();
    });
    form.addEventListener("submit", (event) => {
      if (
        sending ||
        !privacy.checked ||
        one('[name="_honey"]', form).value ||
        !form.reportValidity()
      ) {
        event.preventDefault();
        status.textContent = "Bitte prüfen Sie Ihre Angaben und die Datenschutzhinweise.";
        status.classList.add("is-error");
        return;
      }
      sending = true;
      sync();
    });
    addEventListener("pageshow", () => {
      sending = false;
      sync();
    });
    sync();
  }
  updateSticky();
})();
