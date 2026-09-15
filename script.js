(() => {
  'use strict';
  const one = (s, root = document) => root.querySelector(s);
  const all = (s, root = document) => [...root.querySelectorAll(s)];
  const menu = one('.menu-toggle');
  const nav = one('.main-nav');
  const banner = one('.cookie-banner');
  const sticky = one('.mobile-contact');
  function updateSticky() {
    if (!sticky) return;
    const hero = one('.hero').getBoundingClientRect();
    const contact = one('#kontakt').getBoundingClientRect();
    const footer = one('.site-footer').getBoundingClientRect();
    sticky.hidden = innerWidth > 700 || hero.bottom > 0 || contact.top < innerHeight || footer.top < innerHeight || !banner.hidden || menu?.getAttribute('aria-expanded') === 'true';
  }
  function setMenu(open) {
    menu?.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
    updateSticky();
  }
  menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  all('a', nav || document).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) setMenu(false);
  });
  let scrollPending = false;
  addEventListener('scroll', () => {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => { updateSticky(); scrollPending = false; });
  }, {passive: true});
  addEventListener('resize', () => { if (innerWidth > 900) setMenu(false); updateSticky(); });

  all('[data-service]').forEach(link => link.addEventListener('click', () => {
    const select = one('#bereich');
    if (select) select.value = link.dataset.service;
  }));
  all('[data-comparison-range]').forEach(range => {
    const frame = one('[data-comparison]', range.closest('.comparison-card'));
    const update = () => {
      frame.style.setProperty('--split', `${range.value}%`);
      range.setAttribute('aria-valuetext', `${range.value} Prozent Vorher-Bild`);
      one('.label-before', frame).hidden = Number(range.value) < 15;
      one('.label-after', frame).hidden = Number(range.value) > 85;
    };
    range.addEventListener('input', update);
    update();
  });
  const filters = one('.filters');
  if (filters) {
    filters.hidden = false;
    all('[data-filter]', filters).forEach(button => button.addEventListener('click', () => {
      all('[data-filter]', filters).forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      let count = 0;
      all('[data-category]').forEach(tile => {
        tile.hidden = button.dataset.filter !== 'all' && tile.dataset.category !== button.dataset.filter;
        if (!tile.hidden) count++;
      });
      one('#filter-status').textContent = `${count} ${count === 1 ? 'Projekt' : 'Projekte'} angezeigt.`;
    }));
  }
  const dialog = one('.lightbox');
  if (dialog && typeof dialog.showModal === 'function') {
    let opener;
    all('[data-lightbox]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      opener = link;
      const img = one('img', dialog);
      img.src = link.href;
      img.alt = one('img', link).alt;
      one('p', dialog).textContent = link.dataset.caption;
      dialog.showModal();
    }));
    one('.lightbox-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => opener?.focus({preventScroll: true}));
  }

  const analyticsId = 'G-N915KNK197';
  const storageKey = 'cu-mainwerk-consent-v1';
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  let analyticsLoaded = false;
  let consentOpener;
  window[`ga-disable-${analyticsId}`] = true;
  function analytics(allowed) {
    window[`ga-disable-${analyticsId}`] = !allowed;
    if (!allowed) {
      if (window.gtag) window.gtag('consent', 'update', {analytics_storage: 'denied'});
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.trim().split('=')[0];
        if (!/^_ga(?:_|$)/.test(name)) return;
        ['', `; domain=${location.hostname}`, '; domain=.cu-mainwerk.de'].forEach(domain => {
          document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
        });
      });
      return;
    }
    if (!['cu-mainwerk.de', 'www.cu-mainwerk.de'].includes(location.hostname)) return;
    if (analyticsLoaded) {
      window.gtag('consent', 'update', {analytics_storage: 'granted'});
      return;
    }
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
    window.gtag('js', new Date());
    window.gtag('config', analyticsId, {allow_google_signals: false, allow_ad_personalization_signals: false});
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    document.head.append(script);
  }
  if (banner) {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch { /* Storage may be unavailable. */ }
    const valid = saved && ['accepted', 'declined'].includes(saved.choice) && Number.isFinite(saved.at) && Date.now() >= saved.at && Date.now() - saved.at < maxAge;
    banner.hidden = Boolean(valid);
    analytics(valid && saved.choice === 'accepted');
    all('[data-consent]').forEach(button => button.addEventListener('click', () => {
      try { localStorage.setItem(storageKey, JSON.stringify({choice: button.dataset.consent, at: Date.now()})); } catch { /* Choice still applies to this page. */ }
      analytics(button.dataset.consent === 'accepted');
      banner.hidden = true;
      consentOpener?.focus({preventScroll: true});
      updateSticky();
    }));
    all('[data-cookie-settings]').forEach(button => button.addEventListener('click', () => {
      consentOpener = button;
      banner.hidden = false;
      one('[data-consent]', banner).focus({preventScroll: true});
      updateSticky();
    }));
  }

  const form = one('.contact-form');
  if (form) {
    const privacy = one('#privacy', form);
    const submit = one('.form-submit', form);
    const status = one('#form-status', form);
    const message = one('#message', form);
    let sending = false;
    const sync = () => {
      submit.disabled = sending || !privacy.checked;
      status.textContent = sending ? 'Ihre Anfrage wird zur Sicherheitsprüfung weitergeleitet …' : privacy.checked ? 'Bitte prüfen Sie Ihre Angaben. Anschließend können Sie die Anfrage senden.' : 'Bitte bestätigen Sie die Datenschutzhinweise, um die Anfrage zu senden.';
      status.classList.remove('is-error');
      one('[data-message-count]', form).textContent = message.value.length;
    };
    privacy.addEventListener('change', sync);
    message.addEventListener('input', sync);
    all('input[minlength], textarea[minlength]', form).forEach(input => {
      const validate = () => input.setCustomValidity(input.value && input.value.trim().length < input.minLength ? `Bitte geben Sie mindestens ${input.minLength} Zeichen ein (ohne äußere Leerzeichen).` : '');
      input.addEventListener('input', validate);
      validate();
    });
    form.addEventListener('submit', event => {
      if (sending || !privacy.checked || one('[name="_honey"]', form).value || !form.reportValidity()) {
        event.preventDefault();
        status.textContent = 'Bitte prüfen Sie Ihre Angaben und die Datenschutzhinweise.';
        status.classList.add('is-error');
        return;
      }
      sending = true;
      sync();
    });
    addEventListener('pageshow', () => { sending = false; sync(); });
    sync();
  }
  updateSticky();
})();
