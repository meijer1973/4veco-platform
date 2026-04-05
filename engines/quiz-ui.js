/**
 * quiz-ui.js — DOM binding layer for instapquiz.
 * Reads window.QUIZ_DATA (set by the per-quiz data file),
 * instantiates QuizEngine, and wires up all DOM interactions.
 *
 * Requires: quiz-engine.js loaded before this file.
 *           QUIZ_DATA global set by the per-quiz data file.
 */
(function () {
    'use strict';

    var data = window.QUIZ_DATA;
    if (!data) { console.error('quiz-ui.js: QUIZ_DATA not found'); return; }

    // ── Set CSS custom properties from domain colors ────────────────
    var _par = (data.meta && data.meta.parNr || '').substring(0, 3);
    var dc = data.domainColors || (window.DOMAIN_COLORS && window.DOMAIN_COLORS[_par]) || {};
    var root = document.documentElement;
    if (dc.primary)   root.style.setProperty('--domain-primary', dc.primary);
    if (dc.primaryDk) root.style.setProperty('--domain-primary-dk', dc.primaryDk);
    if (dc.primaryLt) root.style.setProperty('--domain-primary-lt', dc.primaryLt);
    if (dc.accent)    root.style.setProperty('--domain-accent', dc.accent);
    if (dc.navy)      root.style.setProperty('--domain-navy', dc.navy);

    // ── Create engine instance ──────────────────────────────────────
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
        gameStats:        document.getElementById('game-stats'),
        scoreDisplay:     document.getElementById('score-display'),
        questionCount:    document.getElementById('question-count'),
        categoryDisplay:  document.getElementById('category-display'),
        difficultyStars:  document.getElementById('difficulty-stars'),
        questionText:     document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container'),
        feedbackBox:      document.getElementById('feedback-container'),
        feedbackTitle:    document.getElementById('feedback-title'),
        feedbackText:     document.getElementById('feedback-text'),
        nextBtn:          document.getElementById('next-btn'),
        finalScore:       document.getElementById('final-score'),
        masteryDash:      document.getElementById('mastery-dashboard')
    };

    // ── Render mastery dashboard ────────────────────────────────────
    function renderMasteryDashboard() {
        var progress = engine.getProgress();
        var html = '';
        for (var cat in data.categories) {
            if (!data.categories.hasOwnProperty(cat)) continue;
            var p = progress[cat];
            var catInfo = data.categories[cat];
            var steps = p.closed ? 3 : Math.min(p.correctCount, 3);
            var percentage = Math.round((steps / 3) * 100);
            var statusText = p.closed
                ? "Afgesloten <i class='fa-solid fa-check-circle'></i>"
                : 'Reeks: ' + steps + '/3';
            var barColor = (percentage === 100) ? '#10b981' : catInfo.colors.bar;
            var textColor = (percentage === 100) ? '#10b981' : '#64748b';
            html += '<div class="mastery-item">'
                + '<div class="mastery-label"><span>' + catInfo.name + '</span>'
                + '<span style="color:' + textColor + '">' + statusText + '</span></div>'
                + '<div class="mastery-bar-bg"><div class="mastery-bar-fill" style="width:'
                + percentage + '%;background-color:' + barColor + '"></div></div></div>';
        }
        els.masteryDash.innerHTML = html;
    }

    // ── Screen transitions ──────────────────────────────────────────
    function showScreen(name) {
        els.startScreen.classList.remove('active');
        els.gameScreen.classList.remove('active');
        els.endScreen.classList.remove('active');
        if (name === 'start') {
            els.startScreen.classList.add('active');
        } else if (name === 'game') {
            els.gameScreen.classList.add('active');
            els.sidebar.style.display = 'flex';
            els.gameStats.style.display = 'flex';
        } else if (name === 'end') {
            els.endScreen.classList.add('active');
        }
    }

    // ── Present a question ──────────────────────────────────────────
    var currentPresentation = null;

    function presentQuestion() {
        var q = engine.nextQuestion();
        if (!q) {
            endGame();
            return;
        }
        currentPresentation = q;

        els.questionCount.innerText = q.questionNumber + '/' + q.maxQuestions;
        els.feedbackBox.classList.remove('show', 'success', 'error');
        els.nextBtn.style.display = 'none';

        // Category badge
        els.categoryDisplay.innerText = q.categoryName + ' - Niveau ' + q.difficulty;
        els.categoryDisplay.style.backgroundColor = q.categoryColors.bg;
        els.categoryDisplay.style.color = q.categoryColors.text;

        // Difficulty stars
        var stars = '';
        for (var i = 0; i < q.difficulty; i++) stars += '<i class="fa-solid fa-star"></i>';
        els.difficultyStars.innerHTML = stars;

        // Question text
        els.questionText.innerHTML = q.questionText;

        // Options
        els.optionsContainer.innerHTML = '';
        for (var j = 0; j < q.options.length; j++) {
            (function (idx) {
                var btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerHTML = '<span>' + q.options[idx] + '</span>';
                btn.onclick = function () { handleAnswer(idx, btn); };
                els.optionsContainer.appendChild(btn);
            })(j);
        }
    }

    // ── Handle answer ───────────────────────────────────────────────
    function handleAnswer(selectedIndex, btnElement) {
        var allBtns = els.optionsContainer.querySelectorAll('.option-btn');
        for (var i = 0; i < allBtns.length; i++) allBtns[i].disabled = true;

        var result = engine.submitAnswer(selectedIndex);

        if (result.correct) {
            btnElement.classList.add('correct');
            els.feedbackBox.className = 'feedback-box show success';
            els.feedbackTitle.innerHTML = '<i class="fa-solid fa-check-circle"></i> Dat is correct!';
        } else {
            btnElement.classList.add('wrong');
            // Highlight the correct button (using shuffled index — fixes original bug)
            allBtns[result.correctIndex].classList.add('correct');
            els.feedbackBox.className = 'feedback-box show error';
            els.feedbackTitle.innerHTML = '<i class="fa-solid fa-times-circle"></i> Dat is helaas onjuist.';
        }

        els.scoreDisplay.innerText = result.score;
        els.feedbackText.innerHTML = result.rationale;
        els.nextBtn.style.display = 'block';
        renderMasteryDashboard();
    }

    // ── End game ────────────────────────────────────────────────────
    function endGame() {
        var result = engine.getResult();
        els.finalScore.innerText = result.score + ' van de ' + result.total;
        showScreen('end');
        renderMasteryDashboard();
    }

    // ── Public functions (called by onclick in HTML) ─────────────────
    window.startGame = function () {
        engine.startSession();
        showScreen('game');
        renderMasteryDashboard();
        presentQuestion();
    };

    window.restartSession = function () {
        var info = engine.startSession();
        if (info.allWereClosed) {
            alert('Geniaal! Je hebt de gehele stof van dit onderdeel volledig afgesloten. Tijd voor een nieuwe uitdaging (voortgang wordt gereset).');
        }
        els.scoreDisplay.innerText = '0';
        els.questionCount.innerText = '0/10';
        showScreen('game');
        renderMasteryDashboard();
        presentQuestion();
    };

    window.nextQuestion = function () {
        presentQuestion();
    };

    // ── Keyboard navigation ─────────────────────────────────────────
    document.addEventListener('keydown', function (event) {
        var active = document.activeElement;
        var isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
        if (isTyping) return;
        var nextVisible = els.nextBtn && els.nextBtn.style.display !== 'none';
        if (!nextVisible) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            presentQuestion();
        }
    });

    // ── Initial render ──────────────────────────────────────────────
    renderMasteryDashboard();
})();
