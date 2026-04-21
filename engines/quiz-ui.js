/**
 * quiz-ui.js — DOM binding layer for instapquiz (unified redesign).
 * Reads window.QUIZ_DATA, instantiates QuizEngine, wires up DOM.
 *
 * Requires: quiz-engine.js + QUIZ_DATA already loaded.
 *
 * This file emits the DOM expected by the unified redesign in quiz.css:
 *   - light/dark theme toggle (persisted via localStorage.quizMode; shared
 *     with skilltree-polish so both surfaces track one preference)
 *   - session segment progress bar
 *   - category chip with a colored dot + level chip with bolts
 *   - option cards with mono letter keys (A/B/C/D) + state icons
 *   - feedback block with icon + title + rationale
 *   - mastery sidebar with 3-step mastery bars per category
 */
(function () {
    'use strict';

    var data = window.QUIZ_DATA;
    if (!data) { console.error('quiz-ui.js: QUIZ_DATA not found'); return; }

    // ── Domain colors → CSS custom properties ───────────────────────
    var _par = (data.meta && data.meta.parNr || '').substring(0, 3);
    var dc = data.domainColors || (window.DOMAIN_COLORS && window.DOMAIN_COLORS[_par]) || {};
    var root = document.documentElement;
    if (dc.primary)   root.style.setProperty('--domain-primary', dc.primary);
    if (dc.primaryDk) root.style.setProperty('--domain-primary-dk', dc.primaryDk);
    if (dc.primaryLt) root.style.setProperty('--domain-primary-lt', dc.primaryLt);
    if (dc.accent)    root.style.setProperty('--domain-accent', dc.accent);
    if (dc.navy)      root.style.setProperty('--domain-navy', dc.navy);

    // ── Theme (shared with skilltree-polish via localStorage.quizMode) ─
    var STORAGE_KEY = 'quizMode';
    function getMode() {
        try { return localStorage.getItem(STORAGE_KEY) || 'light'; }
        catch (e) { return 'light'; }
    }
    function setMode(m) {
        root.setAttribute('data-theme', m);
        try { localStorage.setItem(STORAGE_KEY, m); } catch (e) {}
        renderThemeToggle();
    }
    function renderThemeToggle() {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;
        var isDark = root.getAttribute('data-theme') === 'dark';
        btn.innerHTML =
            '<span class="theme-toggle-icon">'
          +   '<i class="fa-solid ' + (isDark ? 'fa-moon' : 'fa-sun') + '"></i>'
          + '</span>'
          + (isDark ? 'Donker' : 'Licht');
    }
    root.setAttribute('data-theme', getMode());

    // ── Engine ──────────────────────────────────────────────────────
    var engine = new QuizEngine({
        questions: data.questions,
        categories: data.categories,
        maxQuestions: 10,
        streakToClose: 3
    });

    // ── DOM references ──────────────────────────────────────────────
    var els = {
        startScreen:      document.getElementById('start-screen'),
        gameScreen:       document.getElementById('game-screen'),
        endScreen:        document.getElementById('end-screen'),
        sidebar:          document.getElementById('sidebar'),
        sessionStrip:     document.getElementById('session-strip'),
        sessionSegments:  document.getElementById('session-segments'),
        sessionCount:     document.getElementById('session-count'),
        scoreDisplay:     document.getElementById('score-display'),
        closedDisplay:    document.getElementById('closed-display'),
        categoryDisplay:  document.getElementById('category-display'),
        difficultyChip:   document.getElementById('difficulty-chip'),
        questionText:     document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container'),
        feedbackBox:      document.getElementById('feedback-container'),
        feedbackIcon:     document.getElementById('feedback-icon'),
        feedbackTitle:    document.getElementById('feedback-title'),
        feedbackText:     document.getElementById('feedback-text'),
        nextBtn:          document.getElementById('next-btn'),
        finalScore:       document.getElementById('final-score'),
        masteryDash:      document.getElementById('mastery-dashboard'),
        themeToggle:      document.getElementById('theme-toggle')
    };

    var totalCats = Object.keys(data.categories).length;

    // ── Helpers ─────────────────────────────────────────────────────
    function pad2(n) { return (n < 10 ? '0' : '') + n; }

    function updateClosedCount() {
        var progress = engine.getProgress();
        var closed = 0;
        for (var cat in progress) {
            if (progress.hasOwnProperty(cat) && progress[cat].closed) closed++;
        }
        if (els.closedDisplay) els.closedDisplay.innerText = closed + '/' + totalCats;
    }

    function renderSessionBar(currentIdx, max) {
        if (!els.sessionStrip) return;
        max = max || 10;
        var segs = '';
        for (var i = 0; i < max; i++) {
            var cls = 'segment';
            if (i < currentIdx) cls += ' past';
            else if (i === currentIdx) cls += ' current';
            segs += '<div class="' + cls + '"></div>';
        }
        if (els.sessionSegments) els.sessionSegments.innerHTML = segs;
        if (els.sessionCount) {
            els.sessionCount.innerHTML = pad2(Math.min(currentIdx + 1, max))
                + '<span class="sep"> / ' + max + '</span>';
        }
    }

    function renderMasteryDashboard() {
        if (!els.masteryDash) return;
        var progress = engine.getProgress();
        var html = '';
        for (var cat in data.categories) {
            if (!data.categories.hasOwnProperty(cat)) continue;
            var p = progress[cat] || { correctCount: 0, closed: false };
            var info = data.categories[cat];
            var steps = p.closed ? 3 : Math.min(p.correctCount, 3);
            var color = info.colors && info.colors.bar ? info.colors.bar : '#17a2b8';
            var statusHtml = p.closed
                ? '<i class="fa-solid fa-lock"></i>'
                : steps + '/3';
            var bars = '';
            for (var s = 0; s < 3; s++) {
                bars += '<div class="mastery-step' + (s < steps ? ' filled' : '') + '"></div>';
            }
            html += '<div class="mastery-item' + (p.closed ? ' closed' : '') + '" style="color:' + color + '">'
                +   '<div class="mastery-label">'
                +     '<span class="cat-name">' + escapeHtml(info.name) + '</span>'
                +     '<span class="status-text">' + statusHtml + '</span>'
                +   '</div>'
                +   '<div class="mastery-steps">' + bars + '</div>'
                + '</div>';
        }
        els.masteryDash.innerHTML = html;
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ── Screen transitions ──────────────────────────────────────────
    function showScreen(name) {
        els.startScreen.classList.remove('active');
        els.gameScreen.classList.remove('active');
        els.endScreen.classList.remove('active');
        if (name === 'start') {
            els.startScreen.classList.add('active');
            if (els.sessionStrip) els.sessionStrip.style.display = 'none';
        } else if (name === 'game') {
            els.gameScreen.classList.add('active');
            if (els.sessionStrip) els.sessionStrip.style.display = 'flex';
        } else if (name === 'end') {
            els.endScreen.classList.add('active');
            if (els.sessionStrip) els.sessionStrip.style.display = 'none';
        }
    }

    // ── Present a question ──────────────────────────────────────────
    function presentQuestion() {
        var q = engine.nextQuestion();
        if (!q) { endGame(); return; }

        renderSessionBar(q.questionNumber - 1, q.maxQuestions);

        // Category chip: dot color = bar hex; text & bg derived from theme.
        var bar = q.categoryColors && q.categoryColors.bar ? q.categoryColors.bar : '#17a2b8';
        var chipBg = q.categoryColors && q.categoryColors.bg ? q.categoryColors.bg : '#e8f8fb';
        var chipText = q.categoryColors && q.categoryColors.text ? q.categoryColors.text : '#117A8B';
        els.categoryDisplay.innerHTML =
            '<span class="cat-dot" style="background:' + bar + ';color:' + bar + '"></span>'
          + escapeHtml(q.categoryName);
        // Light-mode uses the category's own pastel bg + dark text.
        els.categoryDisplay.style.background = chipBg;
        els.categoryDisplay.style.color = chipText;
        els.categoryDisplay.style.borderColor = bar;
        els.categoryDisplay.style.borderStyle = 'solid';
        els.categoryDisplay.style.borderWidth = '1px';
        // In dark mode: desaturated chip bg + bar-hex text. The CSS custom-property
        // approach is awkward because we have per-question colors, so we inline-set
        // and let CSS override via html[data-theme="dark"] attribute selectors here:
        if (root.getAttribute('data-theme') === 'dark') {
            els.categoryDisplay.style.background = bar + '22';
            els.categoryDisplay.style.color = bar;
            els.categoryDisplay.style.borderColor = bar + '66';
        }

        // Difficulty chip (3 bolts; light ones dim)
        var bolts = '';
        for (var d = 1; d <= 3; d++) {
            bolts += '<i class="fa-solid fa-bolt bolt' + (d <= q.difficulty ? '' : ' dim') + '"></i>';
        }
        bolts += '<span class="lvl-label">LVL ' + q.difficulty + '</span>';
        els.difficultyChip.innerHTML = bolts;

        // Question text
        els.questionText.innerHTML = q.questionText;

        // Feedback reset
        els.feedbackBox.className = 'feedback-box';
        els.feedbackBox.style.display = 'none';

        // Next button hidden
        els.nextBtn.style.display = 'none';

        // Options with letter keys
        els.optionsContainer.innerHTML = '';
        for (var j = 0; j < q.options.length; j++) {
            (function (idx) {
                var btn = document.createElement('button');
                btn.className = 'option-btn';
                var letter = String.fromCharCode(65 + idx);
                btn.innerHTML =
                    '<span class="key">' + letter + '</span>'
                  + '<span class="label">' + escapeHtml(q.options[idx]) + '</span>'
                  + '<i class="fa-solid state-icon"></i>';
                btn.onclick = function () { handleAnswer(idx, btn); };
                els.optionsContainer.appendChild(btn);
            })(j);
        }

        // Single-option grid switch
        if (q.options.length === 4) {
            els.optionsContainer.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
        } else {
            els.optionsContainer.style.gridTemplateColumns = '1fr';
        }
    }

    // ── Handle answer ───────────────────────────────────────────────
    function handleAnswer(selectedIndex, btnElement) {
        var allBtns = els.optionsContainer.querySelectorAll('.option-btn');
        for (var i = 0; i < allBtns.length; i++) {
            allBtns[i].disabled = true;
            allBtns[i].classList.add('faded');
        }

        var result = engine.submitAnswer(selectedIndex);

        if (result.correct) {
            btnElement.classList.add('correct');
            btnElement.classList.remove('faded');
            setStateIcon(btnElement, 'fa-check');
            els.feedbackBox.className = 'feedback-box show success';
            els.feedbackBox.style.display = 'grid';
            els.feedbackIcon.className = 'feedback-icon';
            els.feedbackIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
            els.feedbackTitle.innerText = 'Juist.';
        } else {
            btnElement.classList.add('wrong');
            btnElement.classList.remove('faded');
            setStateIcon(btnElement, 'fa-xmark');
            var correctBtn = allBtns[result.correctIndex];
            if (correctBtn) {
                correctBtn.classList.add('correct');
                correctBtn.classList.remove('faded');
                setStateIcon(correctBtn, 'fa-check');
            }
            els.feedbackBox.className = 'feedback-box show error';
            els.feedbackBox.style.display = 'grid';
            els.feedbackIcon.className = 'feedback-icon';
            els.feedbackIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            els.feedbackTitle.innerText = 'Niet helemaal.';
        }

        els.scoreDisplay.innerText = result.score;
        els.feedbackText.innerHTML = result.rationale;
        els.nextBtn.style.display = 'inline-flex';
        updateClosedCount();
        renderMasteryDashboard();
    }

    function setStateIcon(btn, iconClass) {
        var icon = btn.querySelector('.state-icon');
        if (!icon) return;
        icon.className = 'fa-solid state-icon ' + iconClass;
    }

    // ── End game ────────────────────────────────────────────────────
    function endGame() {
        var result = engine.getResult();
        els.finalScore.innerText = result.score + ' van de ' + result.total;
        showScreen('end');
        updateClosedCount();
        renderMasteryDashboard();
    }

    // ── Public functions (called from HTML) ─────────────────────────
    window.startGame = function () {
        engine.startSession();
        els.scoreDisplay.innerText = '0';
        showScreen('game');
        renderMasteryDashboard();
        updateClosedCount();
        presentQuestion();
    };

    window.restartSession = function () {
        var info = engine.startSession();
        if (info.allWereClosed) {
            alert('Geniaal! Je hebt de gehele stof van dit onderdeel volledig afgesloten. Tijd voor een nieuwe uitdaging (voortgang wordt gereset).');
        }
        els.scoreDisplay.innerText = '0';
        showScreen('game');
        renderMasteryDashboard();
        updateClosedCount();
        presentQuestion();
    };

    window.nextQuestion = function () { presentQuestion(); };

    // Theme toggle handler
    if (els.themeToggle) {
        els.themeToggle.addEventListener('click', function () {
            var cur = root.getAttribute('data-theme');
            setMode(cur === 'dark' ? 'light' : 'dark');
        });
    }

    // Keyboard: Enter/Space advances once feedback is visible; A–D selects an option.
    document.addEventListener('keydown', function (event) {
        var active = document.activeElement;
        var isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
        if (isTyping) return;
        var nextVisible = els.nextBtn && els.nextBtn.style.display !== 'none';
        if (nextVisible && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            presentQuestion();
            return;
        }
        // Letter key → select option if answerable
        if (!nextVisible && els.gameScreen && els.gameScreen.classList.contains('active')) {
            var idx = -1;
            if (event.key === 'a' || event.key === 'A') idx = 0;
            else if (event.key === 'b' || event.key === 'B') idx = 1;
            else if (event.key === 'c' || event.key === 'C') idx = 2;
            else if (event.key === 'd' || event.key === 'D') idx = 3;
            if (idx >= 0) {
                var btns = els.optionsContainer.querySelectorAll('.option-btn:not(:disabled)');
                if (btns[idx]) { event.preventDefault(); btns[idx].click(); }
            }
        }
    });

    // ── Initial render ──────────────────────────────────────────────
    renderThemeToggle();
    renderMasteryDashboard();
    updateClosedCount();
})();
