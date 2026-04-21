/* Voorkennis — theme toggle + sidebar + section navigation.
 * Shares the Instapquiz/Wiskundevaardigheden theme key (quizMode). */
(function () {
    'use strict';

    var THEME_KEY = 'quizMode';

    function getMode() {
        try { return localStorage.getItem(THEME_KEY) || 'light'; } catch (e) { return 'light'; }
    }
    function applyMode(mode) {
        document.documentElement.setAttribute('data-theme', mode === 'dark' ? 'dark' : 'light');
        try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
        document.querySelectorAll('.theme-toggle').forEach(function (btn) {
            var ring = btn.querySelector('.ring');
            var label = btn.querySelector('.label');
            if (ring) ring.innerHTML = mode === 'dark' ? moonSvg() : sunSvg();
            if (label) label.textContent = mode === 'dark' ? 'Donker' : 'Licht';
        });
    }

    function sunSvg() {
        return '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
    }
    function moonSvg() {
        return '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
    }

    function buildToggle() {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-toggle';
        btn.setAttribute('aria-label', 'Wissel licht/donker');
        var mode = document.documentElement.getAttribute('data-theme') || 'light';
        btn.innerHTML =
            '<span class="ring">' + (mode === 'dark' ? moonSvg() : sunSvg()) + '</span>' +
            '<span class="label">' + (mode === 'dark' ? 'Donker' : 'Licht') + '</span>';
        btn.addEventListener('click', function () {
            var cur = document.documentElement.getAttribute('data-theme') || 'light';
            applyMode(cur === 'dark' ? 'light' : 'dark');
        });
        return btn;
    }

    function injectToggle() {
        var host = document.querySelector('.hero .hero-inner') || document.querySelector('.hero');
        if (host && !host.querySelector('.theme-toggle')) {
            host.appendChild(buildToggle());
        }
    }

    function arrowSvg() {
        return '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>';
    }

    function injectBackLink() {
        var host = document.querySelector('.hero .hero-inner') || document.querySelector('.hero');
        if (!host || host.querySelector('.back-to-overview')) return;
        var a = document.createElement('a');
        a.className = 'back-to-overview';
        a.href = '../index.html';
        a.innerHTML = arrowSvg() + '<span>Overzicht</span>';
        host.insertBefore(a, host.firstChild);
    }

    function wireSidebar() {
        var sidebar = document.getElementById('sidebar');
        var overlay = document.getElementById('sidebarOverlay');
        var toggle = document.getElementById('sidebarToggle');
        if (toggle && sidebar && overlay) {
            toggle.addEventListener('click', function () {
                sidebar.classList.toggle('open');
                overlay.classList.toggle('show');
            });
            overlay.addEventListener('click', function () {
                sidebar.classList.remove('open');
                overlay.classList.remove('show');
            });
        }

        document.querySelectorAll('[data-section], [data-target]').forEach(function (el) {
            el.addEventListener('click', function (e) {
                var id = el.dataset.section || el.dataset.target;
                var target = document.getElementById(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    if (sidebar) sidebar.classList.remove('open');
                    if (overlay) overlay.classList.remove('show');
                }
            });
        });

        var navItems = document.querySelectorAll('.nav-item[data-section]');
        var sections = document.querySelectorAll('.section');
        if (navItems.length && sections.length && 'IntersectionObserver' in window) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        navItems.forEach(function (n) { n.classList.remove('active'); });
                        var active = document.querySelector('.nav-item[data-section="' + entry.target.id + '"]');
                        if (active) active.classList.add('active');
                    }
                });
            }, { rootMargin: '-10% 0px -80% 0px' });
            sections.forEach(function (s) { obs.observe(s); });
        }

        document.querySelectorAll('.checklist-item input').forEach(function (cb) {
            cb.addEventListener('change', function () {
                this.closest('.checklist-item').classList.toggle('checked', this.checked);
            });
        });
    }

    function init() {
        applyMode(getMode());
        injectBackLink();
        injectToggle();
        wireSidebar();
    }

    if (document.readyState !== 'loading') init();
    else document.addEventListener('DOMContentLoaded', init);

    window.addEventListener('storage', function (e) {
        if (e.key === THEME_KEY && e.newValue) applyMode(e.newValue);
    });
})();
