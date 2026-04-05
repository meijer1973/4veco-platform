/**
 * newsdetective-ui.js — DOM binding layer for Nieuws-detective.
 * Reads window.NEWS_DETECTIVE_DATA (set by per-paragraph data file),
 * instantiates NewsDetectiveEngine, and wires all DOM interactions.
 *
 * Requires: newsdetective-engine.js loaded before this file.
 *           NEWS_DETECTIVE_DATA global set by the data file.
 */
(function () {
    'use strict';

    var data = window.NEWS_DETECTIVE_DATA;
    if (!data) { console.error('newsdetective-ui.js: NEWS_DETECTIVE_DATA not found'); return; }

    // ── Set CSS custom properties from domain colors ────────────────
    var _par = (data.meta && data.meta.parNr || '').substring(0, 3);
    var dc = data.domainColors || (window.DOMAIN_COLORS && window.DOMAIN_COLORS[_par]) || {};
    var root = document.documentElement;
    if (dc.primary)   root.style.setProperty('--nd-domain', dc.primary);
    if (dc.primaryDk) root.style.setProperty('--nd-domain-dk', dc.primaryDk);
    if (dc.primaryLt) root.style.setProperty('--nd-domain-lt', dc.primaryLt);
    if (dc.accent)    root.style.setProperty('--nd-accent', dc.accent);
    if (dc.navy)      root.style.setProperty('--nd-navy', dc.navy);

    // ── Create engine ──────────────────────────────────────────────
    var engine = new NewsDetectiveEngine(data);

    // ── State ──────────────────────────────────────────────────────
    var currentRound = null;
    var chainSelection = []; // for consequence round

    // ── Build DOM ──────────────────────────────────────────────────
    var app = document.getElementById('nd-app');
    if (!app) { console.error('newsdetective-ui.js: #nd-app not found'); return; }

    app.innerHTML = buildHTML();

    // ── DOM references ─────────────────────────────────────────────
    var els = {
        header:       q('.nd-header'),
        headerScore:  q('.nd-header-score'),
        trackerSteps: qa('.nd-tracker-step'),
        trackerLines: qa('.nd-tracker-line'),
        screens: {
            start:   q('#nd-start'),
            article: q('#nd-article'),
            game:    q('#nd-game'),
            result:  q('#nd-result')
        },
        startHeadline: q('#nd-start-headline'),
        articleCard:    q('#nd-article-full'),
        gameRoundBadge: q('#nd-round-badge'),
        gameArticle:    q('#nd-game-article'),
        gameQuestion:   q('#nd-game-question'),
        gameContent:    q('#nd-game-content'),
        gameFeedback:   q('#nd-game-feedback'),
        gameNextBtn:    q('#nd-game-next'),
        gameSubmitBtn:  q('#nd-game-submit'),
        resultCard:     q('#nd-result-card'),
    };

    // ── Event wiring ───────────────────────────────────────────────
    q('#nd-start-btn').addEventListener('click', showArticleScreen);
    q('#nd-article-btn').addEventListener('click', startFirstRound);
    els.gameNextBtn.addEventListener('click', advanceRound);
    els.gameSubmitBtn.addEventListener('click', submitChain);
    // Result buttons are wired after renderResult() via event delegation
    els.resultCard.addEventListener('click', function (e) {
        var btn = e.target.closest('#nd-result-replay, #nd-result-lesson');
        if (!btn) return;
        if (btn.id === 'nd-result-replay') restart();
        else if (btn.id === 'nd-result-lesson') window.location.href = '../index.html';
    });

    // ── Initialize start screen ────────────────────────────────────
    initStartScreen();

    // ═══════════════════════════════════════════════════════════════
    // SCREEN FLOW
    // ═══════════════════════════════════════════════════════════════

    function initStartScreen() {
        var article = engine.getArticle();
        els.startHeadline.textContent = article.headline;
        showScreen('start');
    }

    function showArticleScreen() {
        var info = engine.startGame();
        var a = info.article;
        els.articleCard.innerHTML = renderArticleFull(a);
        showScreen('article');
    }

    function startFirstRound() {
        updateTrackerForRound(-1); // no active yet
        showScreen('game');
        els.headerScore.textContent = 'Score: 0/4';
        els.headerScore.style.display = '';
        advanceRound();
    }

    function advanceRound() {
        els.gameFeedback.innerHTML = '';
        els.gameFeedback.style.display = 'none';
        els.gameNextBtn.style.display = 'none';
        els.gameSubmitBtn.style.display = 'none';
        chainSelection = [];

        var hasMore = engine.nextRound();
        if (!hasMore) {
            showResultScreen();
            return;
        }

        currentRound = engine.getRound();
        updateTrackerForRound(currentRound.roundNumber - 1);

        // Render article compact
        var article = engine.getArticle();
        els.gameArticle.innerHTML = renderArticleCompact(article);

        // Round badge
        els.gameRoundBadge.innerHTML = '<span>Ronde ' + currentRound.roundNumber + '</span> ' + esc(currentRound.typeName);

        // Question
        els.gameQuestion.textContent = currentRound.question || '';

        // Render round-specific content
        switch (currentRound.type) {
            case 'concept':     renderConceptRound(); break;
            case 'consequence': renderConsequenceRound(); break;
            case 'model':       renderModelRound(); break;
            case 'error':       renderErrorRound(); break;
        }
    }

    function showResultScreen() {
        var result = engine.getResult();
        els.resultCard.innerHTML = renderResult(result);
        showScreen('result');

        // Update tracker: all done
        for (var i = 0; i < 4; i++) {
            var step = els.trackerSteps[i];
            step.className = 'nd-tracker-step ' + (result.perRound[i].correct ? 'complete' : 'wrong');
        }
        els.trackerLines.forEach(function (l) { l.classList.add('filled'); });

        // Animate score ring
        setTimeout(function () {
            var fill = q('.nd-score-ring-fill');
            if (fill) {
                var offset = 314 - (314 * result.ratio);
                fill.style.strokeDashoffset = offset;
            }
        }, 100);
    }

    function restart() {
        currentRound = null;
        chainSelection = [];
        els.headerScore.textContent = '';
        els.headerScore.style.display = 'none';
        resetTracker();
        initStartScreen();
    }

    // ═══════════════════════════════════════════════════════════════
    // ROUND RENDERERS
    // ═══════════════════════════════════════════════════════════════

    function renderConceptRound() {
        var html = '<div class="nd-options">';
        var letters = ['A', 'B', 'C', 'D'];
        currentRound.options.forEach(function (opt, i) {
            html += '<button class="nd-option" data-index="' + i + '">'
                + '<span class="nd-option-letter">' + letters[i] + '</span>'
                + '<span>' + esc(opt.text) + '</span>'
                + '</button>';
        });
        html += '</div>';
        els.gameContent.innerHTML = html;

        qa('.nd-option', els.gameContent).forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (btn.classList.contains('disabled')) return;
                var idx = parseInt(btn.getAttribute('data-index'));
                handleConceptAnswer(idx);
            });
        });
    }

    function handleConceptAnswer(idx) {
        var result = engine.submitAnswer(idx);
        var buttons = qa('.nd-option', els.gameContent);
        buttons.forEach(function (btn, i) {
            btn.classList.add('disabled');
            if (i === result.correctAnswer.index) btn.classList.add('correct');
            if (i === idx && !result.correct) btn.classList.add('wrong');
        });
        showFeedback(result);
    }

    function renderConsequenceRound() {
        var html = '';
        // Pool
        html += '<div class="nd-chain-section">';
        html += '<div class="nd-chain-label">Beschikbare blokken</div>';
        html += '<div class="nd-chain-pool" id="nd-pool">';
        currentRound.items.forEach(function (item, i) {
            html += '<div class="nd-chain-block" data-index="' + i + '">' + esc(item.text) + '</div>';
        });
        html += '</div></div>';

        // Slots
        html += '<div class="nd-chain-section">';
        html += '<div class="nd-chain-label">Jouw keten (' + currentRound.requiredCount + ' stappen)</div>';
        html += '<div class="nd-chain-slots" id="nd-slots">';
        for (var i = 0; i < currentRound.requiredCount; i++) {
            if (i > 0) html += '<span class="nd-chain-arrow">\u2192</span>';
            html += '<div class="nd-chain-slot" data-slot="' + i + '">' + (i + 1) + '</div>';
        }
        html += '</div></div>';

        els.gameContent.innerHTML = html;

        // Submit button for chain
        els.gameSubmitBtn.style.display = 'inline-flex';
        els.gameSubmitBtn.disabled = true;

        // Wire pool blocks
        qa('.nd-chain-block', els.gameContent).forEach(function (block) {
            block.addEventListener('click', function () {
                if (block.classList.contains('placed') || block.classList.contains('disabled')) return;
                placeBlock(block);
            });
        });

        // Wire slots (click to remove)
        qa('.nd-chain-slot', els.gameContent).forEach(function (slot) {
            slot.addEventListener('click', function () {
                if (!slot.classList.contains('filled') || slot.classList.contains('disabled')) return;
                removeFromSlot(slot);
            });
        });
    }

    function placeBlock(block) {
        var text = currentRound.items[parseInt(block.getAttribute('data-index'))].text;
        // Find first empty slot
        var slots = qa('.nd-chain-slot', els.gameContent);
        for (var i = 0; i < slots.length; i++) {
            if (!slots[i].classList.contains('filled')) {
                slots[i].textContent = text;
                slots[i].classList.add('filled');
                slots[i].setAttribute('data-text', text);
                slots[i].setAttribute('data-block-index', block.getAttribute('data-index'));
                block.classList.add('placed');
                chainSelection.push(text);

                // Show arrow
                var prevArrow = slots[i].previousElementSibling;
                if (prevArrow && prevArrow.classList.contains('nd-chain-arrow')) {
                    prevArrow.classList.add('visible');
                }
                break;
            }
        }
        updateSubmitButton();
    }

    function removeFromSlot(slot) {
        var blockIndex = slot.getAttribute('data-block-index');
        var text = slot.getAttribute('data-text');

        // Unplace the pool block
        var block = q('.nd-chain-block[data-index="' + blockIndex + '"]', els.gameContent);
        if (block) block.classList.remove('placed');

        // Clear this slot and shift later slots down
        var slots = qa('.nd-chain-slot', els.gameContent);
        var slotIdx = parseInt(slot.getAttribute('data-slot'));

        // Remove from chainSelection
        var csIdx = chainSelection.indexOf(text);
        if (csIdx !== -1) chainSelection.splice(csIdx, 1);

        // Rebuild slots from chainSelection
        slots.forEach(function (s, i) {
            var arrow = s.previousElementSibling;
            if (i < chainSelection.length) {
                s.textContent = chainSelection[i];
                s.classList.add('filled');
                s.setAttribute('data-text', chainSelection[i]);
                // Find matching block
                var items = currentRound.items;
                for (var j = 0; j < items.length; j++) {
                    if (items[j].text === chainSelection[i]) {
                        s.setAttribute('data-block-index', j);
                        break;
                    }
                }
                if (arrow && arrow.classList.contains('nd-chain-arrow') && i > 0) {
                    arrow.classList.add('visible');
                }
            } else {
                s.textContent = (i + 1);
                s.classList.remove('filled');
                s.removeAttribute('data-text');
                s.removeAttribute('data-block-index');
                if (arrow && arrow.classList.contains('nd-chain-arrow')) {
                    arrow.classList.remove('visible');
                }
            }
        });

        updateSubmitButton();
    }

    function updateSubmitButton() {
        els.gameSubmitBtn.disabled = chainSelection.length !== currentRound.requiredCount;
    }

    function submitChain() {
        if (chainSelection.length !== currentRound.requiredCount) return;
        var result = engine.submitAnswer(chainSelection);

        // Disable pool and slots
        qa('.nd-chain-block', els.gameContent).forEach(function (b) { b.classList.add('disabled'); });
        var slots = qa('.nd-chain-slot', els.gameContent);
        slots.forEach(function (s) { s.classList.add('disabled'); });

        // Mark correct/wrong
        var correctChain = result.correctAnswer.chain;
        slots.forEach(function (s, i) {
            if (s.classList.contains('filled')) {
                var text = s.getAttribute('data-text');
                if (i < correctChain.length && text === correctChain[i]) {
                    s.classList.add('correct');
                } else {
                    s.classList.add('wrong');
                }
            }
        });

        els.gameSubmitBtn.style.display = 'none';
        showFeedback(result);
    }

    function renderModelRound() {
        var html = '<div class="nd-model-grid">';
        currentRound.options.forEach(function (opt) {
            html += '<div class="nd-model-card" data-id="' + esc(opt.id) + '">'
                + '<div class="nd-model-header">' + esc(opt.label) + '</div>'
                + '<div class="nd-model-body">' + esc(opt.description) + '</div>'
                + '</div>';
        });
        html += '</div>';
        els.gameContent.innerHTML = html;

        qa('.nd-model-card', els.gameContent).forEach(function (card) {
            card.addEventListener('click', function () {
                if (card.classList.contains('disabled')) return;
                var id = card.getAttribute('data-id');
                handleModelAnswer(id, card);
            });
        });
    }

    function handleModelAnswer(id, clickedCard) {
        var result = engine.submitAnswer(id);
        var cards = qa('.nd-model-card', els.gameContent);
        cards.forEach(function (card) {
            card.classList.add('disabled');
            var cardId = card.getAttribute('data-id');
            if (cardId === result.correctAnswer.id) card.classList.add('correct');
            if (card === clickedCard && !result.correct) card.classList.add('wrong');
        });
        showFeedback(result);
    }

    function renderErrorRound() {
        var analysis = currentRound.fakeAnalysis;
        var phrases = currentRound.phrases;

        // Replace phrases in text with clickable spans
        // Sort phrases by length descending to avoid partial matches
        var sortedPhrases = phrases.slice().sort(function (a, b) { return b.length - a.length; });
        var markedText = analysis;
        var placeholders = {};

        sortedPhrases.forEach(function (phrase, i) {
            var placeholder = '\x00PHRASE_' + i + '\x00';
            placeholders[placeholder] = phrase;
            markedText = markedText.replace(phrase, placeholder);
        });

        // Now build HTML from marked text
        var htmlParts = markedText.split(/(\x00PHRASE_\d+\x00)/);
        var analysisHtml = '';
        htmlParts.forEach(function (part) {
            if (placeholders[part]) {
                var phrase = placeholders[part];
                analysisHtml += '<span class="nd-phrase" data-phrase="' + escAttr(phrase) + '">' + esc(phrase) + '</span>';
            } else {
                analysisHtml += esc(part);
            }
        });

        var html = '<div class="nd-analysis-box">'
            + '<div class="nd-analysis-intro">Een econoom schrijft:</div>'
            + '<div id="nd-analysis-text">' + analysisHtml + '</div>'
            + '</div>'
            + '<div class="nd-analysis-hint">\uD83D\uDCA1 Klik op de fout in de analyse</div>';

        els.gameContent.innerHTML = html;
        els.gameQuestion.textContent = 'Welke bewering in de analyse klopt niet?';

        qa('.nd-phrase', els.gameContent).forEach(function (span) {
            span.addEventListener('click', function () {
                if (span.classList.contains('disabled')) return;
                var phrase = span.getAttribute('data-phrase');
                handleErrorAnswer(phrase);
            });
        });
    }

    function handleErrorAnswer(phrase) {
        var result = engine.submitAnswer(phrase);
        var spans = qa('.nd-phrase', els.gameContent);
        spans.forEach(function (span) {
            span.classList.add('disabled');
            var p = span.getAttribute('data-phrase');
            if (p === result.correctAnswer.phrase) {
                if (result.correct) {
                    span.classList.add('correct-error');
                } else {
                    span.classList.add('pulsing-error');
                }
            } else if (p === phrase && !result.correct) {
                span.classList.add('not-error');
            }
        });

        // Hide hint
        var hint = q('.nd-analysis-hint', els.gameContent);
        if (hint) hint.style.display = 'none';

        showFeedback(result);
    }

    // ═══════════════════════════════════════════════════════════════
    // FEEDBACK
    // ═══════════════════════════════════════════════════════════════

    function showFeedback(result) {
        var icon = result.correct ? '\u2705' : '\u274C';
        var title = result.correct ? 'Goed gezien!' : 'Niet helemaal';
        var cls = result.correct ? 'nd-feedback-correct' : 'nd-feedback-wrong';

        var html = '<div class="nd-feedback ' + cls + '">'
            + '<div class="nd-feedback-icon">' + icon + '</div>'
            + '<div class="nd-feedback-content">'
            + '<div class="nd-feedback-title">' + title + '</div>'
            + '<p class="nd-feedback-text">' + esc(result.feedback) + '</p>';

        if (result.lesLink) {
            html += '<div class="nd-feedback-leslink">\uD83D\uDCCE ' + esc(result.lesLink) + '</div>';
        }

        html += '</div></div>';

        els.gameFeedback.innerHTML = html;
        els.gameFeedback.style.display = 'block';
        els.gameNextBtn.style.display = 'inline-flex';
        els.gameNextBtn.textContent = engine.isGameOver()
            ? 'Bekijk resultaat \u2192'
            : 'Volgende ronde \u2192';

        // Update score
        els.headerScore.textContent = 'Score: ' + result.score + '/4';
    }

    // ═══════════════════════════════════════════════════════════════
    // TRACKER
    // ═══════════════════════════════════════════════════════════════

    function updateTrackerForRound(roundIdx) {
        els.trackerSteps.forEach(function (step, i) {
            step.className = 'nd-tracker-step';
            if (i < roundIdx) step.classList.add('complete');
            else if (i === roundIdx) step.classList.add('active');
        });
        els.trackerLines.forEach(function (line, i) {
            line.classList.toggle('filled', i < roundIdx);
        });
    }

    function resetTracker() {
        els.trackerSteps.forEach(function (step) {
            step.className = 'nd-tracker-step';
        });
        els.trackerLines.forEach(function (line) {
            line.classList.remove('filled');
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // RENDERERS
    // ═══════════════════════════════════════════════════════════════

    function renderArticleFull(a) {
        var sourceLink = a.sourceUrl
            ? '<a href="' + escAttr(a.sourceUrl) + '" target="_blank" rel="noopener" class="nd-article-source-link">' + esc(a.source) + ' \u2197</a>'
            : '<span>' + esc(a.source) + '</span>';

        return '<div class="nd-article-breaking"><span class="nd-article-breaking-dot"></span> ECONOMISCH NIEUWS</div>'
            + '<div class="nd-article-meta">'
            + '<span class="nd-article-source">' + sourceLink + '</span>'
            + '<span>' + esc(a.sourceDate) + '</span>'
            + '</div>'
            + '<h2 class="nd-article-headline">' + esc(a.headline) + '</h2>'
            + '<p class="nd-article-body">' + esc(a.body) + '</p>'
            + (a.sourceUrl ? '<div class="nd-article-verify">\uD83D\uDD17 <a href="' + escAttr(a.sourceUrl) + '" target="_blank" rel="noopener">Lees het originele artikel</a></div>' : '');
    }

    function renderArticleCompact(a) {
        return '<h3 class="nd-article-headline">' + esc(a.headline) + '</h3>'
            + '<p class="nd-article-body">' + esc(a.body) + '</p>';
    }

    function renderResult(result) {
        var msg;
        if (result.score === 4) msg = 'Uitstekend! Je bent een echte nieuws-detective.';
        else if (result.score === 3) msg = 'Goed gedaan! Je hebt bijna alles door. Bekijk de les om het laatste puzzelstukje te vinden.';
        else if (result.score === 2) msg = 'Prima start. Kijk bij de terugkoppeling wat je nog kunt leren.';
        else msg = 'Geen zorgen \u2014 na de les kun je het opnieuw proberen!';

        var html = '<div class="nd-result-icon">\uD83D\uDD0D</div>'
            + '<h2 class="nd-result-title">Onderzoek afgerond</h2>'
            + '<div class="nd-score-ring">'
            + '<svg viewBox="0 0 120 120"><circle class="nd-score-ring-bg" cx="60" cy="60" r="50"/>'
            + '<circle class="nd-score-ring-fill" cx="60" cy="60" r="50"/></svg>'
            + '<div class="nd-score-ring-text">' + result.score + '/4</div>'
            + '</div>'
            + '<div class="nd-result-breakdown">';

        result.perRound.forEach(function (r) {
            var icon = r.correct ? '\u2705' : '\u274C';
            html += '<div class="nd-result-row">'
                + '<span class="nd-result-check">' + icon + '</span>'
                + '<span>' + esc(r.typeName) + '</span>'
                + '</div>';
        });

        html += '</div>'
            + '<p class="nd-result-message">' + esc(msg) + '</p>'
            + '<div class="nd-btn-row">'
            + '<button class="nd-btn nd-btn-secondary" id="nd-result-replay">\uD83D\uDD04 Opnieuw</button>'
            + '<button class="nd-btn nd-btn-primary" id="nd-result-lesson">\uD83D\uDCDA Naar de les</button>'
            + '</div>';

        return html;
    }

    // ═══════════════════════════════════════════════════════════════
    // HTML TEMPLATE
    // ═══════════════════════════════════════════════════════════════

    function buildHTML() {
        var meta = engine.getMeta();
        var article = engine.getArticle();
        var roundNames = ['Concept', 'Gevolg', 'Model', 'Fout'];

        var html = '';

        // Header
        html += '<div class="nd-header">';
        html += '<div class="nd-header-left">';
        html += '<h1 class="nd-header-title">\uD83D\uDD0D Nieuws-detective</h1>';
        html += '<p class="nd-header-subtitle">' + esc(meta.parNr + ' ' + meta.parName) + '</p>';
        html += '</div>';

        // Tracker
        html += '<div class="nd-tracker">';
        for (var i = 0; i < 4; i++) {
            if (i > 0) html += '<div class="nd-tracker-line"></div>';
            html += '<div class="nd-tracker-step">';
            html += '<div class="nd-tracker-num">' + (i + 1) + '</div>';
            html += '<div class="nd-tracker-label">' + roundNames[i] + '</div>';
            html += '</div>';
        }
        html += '</div>';

        html += '<div class="nd-header-score" style="display:none"></div>';
        html += '</div>';

        // Container
        html += '<div class="nd-container">';

        // Start screen
        html += '<div class="nd-screen active" id="nd-start">';
        html += '<div class="nd-start-card">';
        html += '<div class="nd-start-icon">\uD83D\uDCF0</div>';
        html += '<h2 class="nd-start-title">Nieuws-detective</h2>';
        html += '<p class="nd-start-desc">Analyseer een economisch nieuwsbericht in 4 ronden. Herken concepten, voorspel gevolgen, kies het juiste model en spot fouten in analyses.</p>';
        html += '<div class="nd-start-preview nd-article nd-article-compact">';
        html += '<h3 class="nd-article-headline" id="nd-start-headline"></h3>';
        html += '</div>';
        html += '<button class="nd-btn nd-btn-primary" id="nd-start-btn">Start het onderzoek \u2192</button>';
        html += '</div></div>';

        // Article screen
        html += '<div class="nd-screen" id="nd-article">';
        html += '<div class="nd-article" id="nd-article-full"></div>';
        html += '<div class="nd-btn-row"><button class="nd-btn nd-btn-primary" id="nd-article-btn">Begin het onderzoek \u2192</button></div>';
        html += '</div>';

        // Game screen
        html += '<div class="nd-screen" id="nd-game">';
        html += '<div class="nd-article nd-article-compact" id="nd-game-article"></div>';
        html += '<div id="nd-round-badge" class="nd-round-badge"></div>';
        html += '<h2 id="nd-game-question" class="nd-round-question"></h2>';
        html += '<div id="nd-game-content"></div>';
        html += '<div class="nd-btn-row">';
        html += '<button class="nd-btn nd-btn-submit" id="nd-game-submit" style="display:none">Controleer \u2713</button>';
        html += '<button class="nd-btn nd-btn-primary" id="nd-game-next" style="display:none">Volgende ronde \u2192</button>';
        html += '</div>';
        html += '<div id="nd-game-feedback" style="display:none"></div>';
        html += '</div>';

        // Result screen
        html += '<div class="nd-screen" id="nd-result">';
        html += '<div class="nd-result-card" id="nd-result-card"></div>';
        html += '</div>';

        html += '</div>'; // container

        return html;
    }

    // ═══════════════════════════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════════════════════════

    function showScreen(name) {
        Object.keys(els.screens).forEach(function (key) {
            els.screens[key].classList.toggle('active', key === name);
        });
    }

    function q(sel, ctx) { return (ctx || app).querySelector(sel); }
    function qa(sel, ctx) { return Array.prototype.slice.call((ctx || app).querySelectorAll(sel)); }

    function esc(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function escAttr(str) {
        return (str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

})();
