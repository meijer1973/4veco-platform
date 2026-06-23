(function () {
  const root = document.querySelector('[data-pv2]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('[data-pv2-slide]'));
  const links = Array.from(root.querySelectorAll('[data-pv2-link]'));
  const current = root.querySelector('[data-pv2-current]');
  const prev = root.querySelector('[data-pv2-prev]');
  const next = root.querySelector('[data-pv2-next]');
  const notesToggle = root.querySelector('[data-pv2-notes]');
  const themeToggle = root.querySelector('[data-pv2-theme]');
  const fullscreenToggle = root.querySelector('[data-pv2-fullscreen]');
  let index = Math.max(0, slides.findIndex((slide) => `#${slide.id}` === window.location.hash));
  if (index < 0) index = 0;

  function show(nextIndex, pushHash, focusActive) {
    index = Math.max(0, Math.min(slides.length - 1, nextIndex));
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.hidden = !active;
      slide.classList.toggle('is-active', active);
    });
    links.forEach((link, i) => {
      const active = i === index;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (current) current.textContent = String(index + 1);
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === slides.length - 1;
    if (pushHash && slides[index]) history.replaceState(null, '', `#${slides[index].id}`);
    if (focusActive && slides[index]) {
      const focusTarget = slides[index].querySelector('h2') || slides[index];
      if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
      try {
        focusTarget.focus({ preventScroll: true });
      } catch (_err) {
        focusTarget.focus();
      }
    }
  }

  links.forEach((link, i) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      show(i, true, true);
    });
  });
  if (prev) prev.addEventListener('click', () => show(index - 1, true, true));
  if (next) next.addEventListener('click', () => show(index + 1, true, true));

  document.addEventListener('keydown', (event) => {
    if (isEditableTarget(event.target)) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault();
      show(index + 1, true, true);
    }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      show(index - 1, true, true);
    }
    if (event.key === 'Home') {
      event.preventDefault();
      show(0, true, true);
    }
    if (event.key === 'End') {
      event.preventDefault();
      show(slides.length - 1, true, true);
    }
  });

  if (notesToggle) {
    notesToggle.addEventListener('click', () => {
      const pressed = notesToggle.getAttribute('aria-pressed') === 'true';
      notesToggle.setAttribute('aria-pressed', String(!pressed));
      notesToggle.setAttribute('aria-expanded', String(!pressed));
      const openLabel = notesToggle.getAttribute('data-open-label') || 'Studentgerichte uitleg';
      const closeLabel = notesToggle.getAttribute('data-close-label') || 'Verberg uitleg';
      notesToggle.textContent = pressed ? openLabel : closeLabel;
      root.classList.toggle('pv2-speaker-notes-open', !pressed);
      root.querySelectorAll('.pv2-notes').forEach((details) => {
        details.open = !pressed;
      });
    });
  }

  if (themeToggle) {
    let savedTheme = '';
    try {
      savedTheme = window.localStorage?.getItem('quizMode') || '';
    } catch (_err) {
      savedTheme = '';
    }
    if (savedTheme === 'dark' || savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    updateThemeButton(isDarkTheme());
    themeToggle.addEventListener('click', () => {
      const theme = isDarkTheme() ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      try {
        window.localStorage?.setItem('quizMode', theme);
      } catch (_err) {
        // Theme still changes for the current page when storage is unavailable.
      }
      updateThemeButton(theme === 'dark');
    });
  }

  if (fullscreenToggle) {
    fullscreenToggle.addEventListener('click', async () => {
      const active = document.fullscreenElement === root || root.classList.contains('is-fullscreen');
      try {
        if (!active && root.requestFullscreen) {
          await root.requestFullscreen();
        } else if (active && document.exitFullscreen) {
          await document.exitFullscreen();
        } else {
          root.classList.toggle('is-fullscreen', !active);
          updateFullscreenButton(!active);
        }
      } catch (_err) {
        root.classList.toggle('is-fullscreen', !active);
        updateFullscreenButton(!active);
      }
    });
  }

  function updateFullscreenButton(active) {
    if (!fullscreenToggle) return;
    fullscreenToggle.setAttribute('aria-pressed', String(active));
    fullscreenToggle.textContent = active ? 'Sluit presentatiemodus' : 'Presentatiemodus';
    root.classList.toggle('is-fullscreen', active);
  }

  function updateThemeButton(dark) {
    if (!themeToggle) return;
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.textContent = dark ? 'Light mode' : 'Dark mode';
  }

  function isDarkTheme() {
    const explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'dark') return true;
    if (explicit === 'light') return false;
    return Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  function isEditableTarget(target) {
    if (!target) return false;
    const tag = target.tagName;
    return target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  }

  document.addEventListener('fullscreenchange', () => {
    updateFullscreenButton(document.fullscreenElement === root);
  });

  window.addEventListener('hashchange', () => {
    const target = slides.findIndex((slide) => `#${slide.id}` === window.location.hash);
    if (target >= 0) show(target, false, true);
  });

  show(index, Boolean(window.location.hash));
})();
