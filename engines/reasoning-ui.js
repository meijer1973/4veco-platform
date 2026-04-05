/**
 * reasoning-ui.js — DOM binding layer for the Reasoning Game.
 * Reads window.REASONING_CSV + window.REASONING_META,
 * instantiates ReasoningEngine, and wires up all DOM interactions.
 *
 * Requires: reasoning-engine.js loaded before this file.
 */
(function () {
    'use strict';

    var csv = window.REASONING_CSV;
    var meta = window.REASONING_META;
    if (!csv || !meta) { console.error('reasoning-ui.js: REASONING_CSV or REASONING_META not found'); return; }

    // ── Set CSS custom properties ───────────────────────────────────
    var _par = (meta.parNr || '').substring(0, 3);
    var dc = meta.domainColors || (window.DOMAIN_COLORS && window.DOMAIN_COLORS[_par]) || {};
    var root = document.documentElement;
    if (dc.primary)   root.style.setProperty('--r-primary', dc.primary);
    if (dc.primaryDk) root.style.setProperty('--r-primary-dk', dc.primaryDk);
    if (dc.primaryLt) root.style.setProperty('--r-primary-lt', dc.primaryLt);
    if (dc.accent)    root.style.setProperty('--r-accent', dc.accent);
    if (dc.navy)      root.style.setProperty('--r-navy', dc.navy);

    // ── Create engine ───────────────────────────────────────────────
    var engine = new ReasoningEngine({
        csvString: csv,
        domain: meta.domain,
        roundsPerGame: 5
    });

    // ── Progress tracking ───────────────────────────────────────────
    var STORAGE_KEY = 'reasoning_global_progress';
    var catData = window.REASONING_CATEGORIES || null;

    function loadProgress() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
        catch (e) { return {}; }
    }

    function saveProgress(progress) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
        catch (e) { /* silent */ }
    }

    /** Save a single answer's result to global progress immediately */
    function saveAnswerProgress(structureType, correct) {
        if (!catData) return;
        var catId = getCategoryId(meta.parNr, structureType);
        if (!catId) return;
        var progress = loadProgress();
        if (!progress[catId]) progress[catId] = { correct: 0, total: 0 };
        progress[catId].total++;
        if (correct) progress[catId].correct++;
        saveProgress(progress);
        renderSidebar();
    }

    function getMasteryLevel(correct) {
        if (correct >= 10) return { label: 'Expert', color: '#f59e0b' };
        if (correct >= 6)  return { label: 'Gevorderd', color: '#22c55e' };
        if (correct >= 3)  return { label: 'Onderweg', color: '#3b82f6' };
        return { label: 'Beginner', color: '#94a3b8' };
    }

    function getCategoryId(parNr, structureType) {
        if (!catData) return null;
        return catData.mapping[parNr + '-' + structureType] || null;
    }

    function getLocalCategories() {
        if (!catData) return [];
        var types = engine.getStructureTypes();
        var seen = {};
        var result = [];
        for (var i = 0; i < types.length; i++) {
            var catId = getCategoryId(meta.parNr, types[i].type);
            if (catId && !seen[catId]) {
                seen[catId] = true;
                result.push(catId);
            }
        }
        return result;
    }

    // ── Sidebar reference ────────────────────────────────────────────
    var sidebarEl = document.getElementById('r-sidebar');

    // ── Mode icons and descriptions ─────────────────────────────────
    var MODE_ICONS = ['\uD83D\uDD22', '\u2753', '\uD83D\uDD0D', '\uD83D\uDCC8', '\uD83E\uDDE9'];
    var MODE_DESCS = [
        'Selecteer 3 juiste stappen en zet ze in de goede volgorde.',
        'Kies de 3 juiste deelvragen in de goede volgorde.',
        'Welke van de 3 stappen bevat een fout?',
        'Bouw een stroomdiagram door blokken in de juiste volgorde te plaatsen.',
        'Koppel 6 opgaven aan 3 paren die dezelfde oplossingsstructuur delen.'
    ];
    var MODE_INSTRUCTIONS = [
        'Je ziet 6 stappen: 3 zijn correct en 3 zijn afleidingsmanoeuvres. Selecteer de 3 juiste stappen en zet ze in de goede volgorde door erop te klikken.',
        'Je ziet 5 deelvragen: 3 zijn correct en 2 zijn afleidingsmanoeuvres. Selecteer de 3 juiste deelvragen in de goede volgorde.',
        'Je ziet 3 redeneerstappen. E\u00e9n stap bevat een fout. Klik op de stap die volgens jou fout is.',
        'Bouw het stroomdiagram door de blokken in de juiste volgorde te plaatsen. Klik op een blok om het toe te voegen. Klik op een geplaatst blok om het te verwijderen.',
        'Je ziet 6 opgaven. Koppel steeds 2 opgaven die dezelfde oplossingsstructuur delen. Klik op een opgave om te selecteren, dan op een tweede om een paar te vormen.'
    ];

    // ── DOM references ──────────────────────────────────────────────
    var els = {
        menuScreen:    document.getElementById('r-menu'),
        gameScreen:    document.getElementById('r-game'),
        resultsScreen: document.getElementById('r-results'),
        gameContent:   document.getElementById('r-game-content'),
        modeBtns:      document.getElementById('r-mode-btns'),
        structureInfo: document.getElementById('r-structure-info'),
        gameBar:       document.getElementById('r-game-bar'),
        problemBox:    document.getElementById('r-problem-box'),
        feedbackBox:   document.getElementById('r-feedback'),
        feedbackTitle: document.getElementById('r-feedback-title'),
        feedbackDetail:document.getElementById('r-feedback-detail'),
        checkBtn:      document.getElementById('r-check-btn'),
        nextBtn:       document.getElementById('r-next-btn'),
        backBtn:       document.getElementById('r-back-btn'),
        modeBadge:     document.getElementById('r-mode-badge'),
        roundBadge:    document.getElementById('r-round-badge'),
        resultsEmoji:  document.getElementById('r-results-emoji'),
        resultsTitle:  document.getElementById('r-results-title'),
        resultsScore:  document.getElementById('r-results-score'),
        progressFill:  document.getElementById('r-progress-fill')
    };

    // ── Session progress per structure type ────────────────────────
    // Session progress is persisted in localStorage so it survives page reloads.
    var SESSION_PROGRESS_KEY = 'reasoning_session_' + meta.parNr;
    var sessionProgress = {};  // { "A": { correct: 0, total: 0 }, ... }
    var MASTERY_THRESHOLD = 3; // correct answers needed to "complete" a type

    function loadSessionProgress() {
        try { return JSON.parse(localStorage.getItem(SESSION_PROGRESS_KEY)) || {}; }
        catch (e) { return {}; }
    }

    function saveSessionProgress() {
        try { localStorage.setItem(SESSION_PROGRESS_KEY, JSON.stringify(sessionProgress)); }
        catch (e) { /* silent */ }
    }

    function initSessionProgress() {
        var saved = loadSessionProgress();
        var types = engine.getStructureTypes();
        sessionProgress = {};
        for (var i = 0; i < types.length; i++) {
            var key = types[i].type;
            sessionProgress[key] = saved[key] || { correct: 0, total: 0 };
        }
    }

    function updateSessionProgress(structureType, correct) {
        if (!sessionProgress[structureType]) sessionProgress[structureType] = { correct: 0, total: 0 };
        sessionProgress[structureType].total++;
        if (correct) sessionProgress[structureType].correct++;
        saveSessionProgress();
    }

    function renderSessionProgress() {
        var el = document.getElementById('r-session-progress');
        if (!el) return;
        var types = engine.getStructureTypes();
        var html = '';
        var allDone = true;
        for (var i = 0; i < types.length; i++) {
            var t = types[i];
            var sp = sessionProgress[t.type] || { correct: 0, total: 0 };
            var steps = Math.min(sp.correct, MASTERY_THRESHOLD);
            var pct = Math.round((steps / MASTERY_THRESHOLD) * 100);
            var done = steps >= MASTERY_THRESHOLD;
            if (!done) allDone = false;
            var barColor = done ? '#10b981' : 'var(--r-primary)';
            var statusText = done
                ? '<i class="fa-solid fa-check-circle" style="color:#10b981"></i> Klaar'
                : steps + '/' + MASTERY_THRESHOLD + ' goed';
            var textColor = done ? '#10b981' : '#64748b';
            html += '<div class="r-session-type">'
                + '<div class="r-session-type-header">'
                + '<span class="r-session-type-name">' + esc(t.type) + ': ' + esc(t.label) + '</span>'
                + '<span class="r-session-type-status" style="color:' + textColor + '">' + statusText + '</span>'
                + '</div>'
                + '<div class="r-session-type-bar"><div class="r-session-type-fill" style="width:' + pct + '%;background:' + barColor + '"></div></div>'
                + '</div>';
        }
        el.innerHTML = html;
    }

    // ── Game state ──────────────────────────────────────────────────
    var progressAtGameStart = {};  // snapshot of progress when game begins
    var currentMode = -1;
    var selection = [];      // For modes 0, 1: ordered list of selected items
    var selectedErrorIdx = -1; // For mode 2
    var placedBlocks = [];   // For mode 3
    var matchPairs = [];     // For mode 4: [[idA,idB], ...]
    var matchFirst = null;   // For mode 4: first card of current pair
    var roundData = null;    // Current round presentation data

    // ── Screen management ───────────────────────────────────────────

    function showScreen(name) {
        els.menuScreen.classList.remove('active');
        els.gameScreen.classList.remove('active');
        els.resultsScreen.classList.remove('active');
        if (name === 'menu') els.menuScreen.classList.add('active');
        else if (name === 'game') els.gameScreen.classList.add('active');
        else if (name === 'results') els.resultsScreen.classList.add('active');
    }

    // ── Menu screen ─────────────────────────────────────────────────

    function renderMenu() {
        var modeNames = engine.getModeNames();
        var html = '';
        for (var i = 0; i < 5; i++) {
            var rounds = (i === 4) ? '1 ronde' : Math.min(engine.getProblemCount(), 5) + ' rondes';
            html += '<button class="r-mode-btn" data-mode="' + i + '">'
                + '<div class="r-mode-icon" style="background:' + getModeColor(i) + '">' + MODE_ICONS[i] + '</div>'
                + '<div class="r-mode-info">'
                + '<div class="r-mode-name">' + modeNames[i] + '</div>'
                + '<div class="r-mode-desc">' + MODE_DESCS[i] + '</div>'
                + '<div class="r-mode-rounds">' + rounds + '</div>'
                + '</div></button>';
        }
        els.modeBtns.innerHTML = html;

        // Structure info
        var types = engine.getStructureTypes();
        var infoHtml = '<h4>\u{1F4CA} Structuurtypen in deze les:</h4><ul>';
        for (var j = 0; j < types.length; j++) {
            infoHtml += '<li><strong>' + esc(types[j].type) + '</strong>: ' + esc(types[j].label) + ' (' + types[j].count + ' opgaven)</li>';
        }
        infoHtml += '</ul>';
        els.structureInfo.innerHTML = infoHtml;

        // Render sidebar
        renderSidebar();

        // Bind mode buttons
        var btns = els.modeBtns.querySelectorAll('.r-mode-btn');
        for (var k = 0; k < btns.length; k++) {
            btns[k].addEventListener('click', function () {
                startGame(parseInt(this.getAttribute('data-mode')));
            });
        }
    }

    function getModeColor(idx) {
        var colors = ['#e0f2fe', '#fce7f3', '#fee2e2', '#dcfce7', '#fef3c7'];
        return colors[idx] || '#f1f5f9';
    }

    // ── Sidebar: all 8 categories ──────────────────────────────────

    function renderSidebar() {
        var dashEl = document.getElementById('r-progress-dashboard');
        if (!dashEl || !catData || !sidebarEl) return;

        var localCats = getLocalCategories();
        var progress = loadProgress();
        var allCatIds = Object.keys(catData.categories);
        var html = '';

        for (var i = 0; i < allCatIds.length; i++) {
            var cid = allCatIds[i];
            var cat = catData.categories[cid];
            var prog = progress[cid] || { correct: 0, total: 0 };
            var lvl = getMasteryLevel(prog.correct);
            var maxQ = cat.maxQuestions || 1;
            var pct = Math.min(100, Math.round((prog.correct / maxQ) * 100));
            var isLocal = localCats.indexOf(cid) >= 0;
            var rowClass = 'r-cat-row' + (isLocal ? ' r-cat-active' : (prog.total > 0 ? '' : ' r-cat-inactive'));

            html += '<div class="' + rowClass + '">'
                + '<span class="r-cat-icon">' + cat.icon + '</span>'
                + '<div class="r-cat-detail">'
                + '<div style="display:flex;justify-content:space-between;align-items:center">'
                + '<span class="r-cat-name">' + esc(cat.name) + '</span>'
                + '<span class="r-cat-count">' + prog.correct + '/' + maxQ + '</span>'
                + '</div>'
                + '<div class="r-cat-bar"><div class="r-cat-fill" style="width:' + pct + '%;background:' + cat.color + '"></div></div>'
                + '</div>'
                + '<span class="r-cat-level" style="color:' + lvl.color + '">' + esc(lvl.label) + '</span>'
                + '</div>';
        }

        dashEl.innerHTML = html;
        sidebarEl.style.display = 'flex';
    }

    // ── Start game ──────────────────────────────────────────────────

    function startGame(modeIndex) {
        currentMode = modeIndex;
        progressAtGameStart = loadProgress();  // snapshot for level-up detection
        var info = engine.startGame(modeIndex);
        els.modeBadge.textContent = info.modeName;
        showScreen('game');
        renderSessionProgress();
        presentRound();
    }

    // ── Present round ───────────────────────────────────────────────

    function presentRound() {
        roundData = engine.getRound();
        if (!roundData) { showResults(); return; }

        // Reset state
        selection = [];
        selectedErrorIdx = -1;
        placedBlocks = [];
        matchPairs = [];
        matchFirst = null;

        // Update badges
        els.roundBadge.textContent = roundData.roundNumber + '/' + roundData.totalRounds;

        // Hide feedback and next, show check
        els.feedbackBox.classList.remove('r-show', 'r-success', 'r-fail', 'r-partial');
        els.nextBtn.style.display = 'none';
        els.checkBtn.style.display = 'inline-block';
        els.checkBtn.disabled = true;

        // Problem text
        els.problemBox.textContent = roundData.problemText || '';
        els.problemBox.style.display = roundData.problemText ? 'block' : 'none';

        // Render instruction box + mode-specific content
        var instructionHtml = '<div class="r-instruction-box"><i class="fa-solid fa-circle-info"></i> '
            + esc(MODE_INSTRUCTIONS[currentMode]) + '</div>';
        var content = '';
        switch (currentMode) {
            case 0: content = renderOrderSteps(); break;
            case 1: content = renderSubQuestions(); break;
            case 2: content = renderFindError(); break;
            case 3: content = renderFlowDiagram(); break;
            case 4: content = renderMatchStructures(); break;
        }
        els.gameContent.innerHTML = instructionHtml + content;
        bindModeInteractions();
    }

    // ── Mode 0: Order Steps ─────────────────────────────────────────

    function renderOrderSteps() {
        var html = '<div class="r-selection-box"><div class="r-selection-title">Jouw volgorde:</div>'
            + '<div class="r-selection-items" id="r-sel-display"><span class="r-selection-empty">Klik op stappen om ze te selecteren...</span></div></div>';
        html += '<div class="r-step-grid" id="r-options">';
        for (var i = 0; i < roundData.options.length; i++) {
            var opt = roundData.options[i];
            html += '<div class="r-step-card" data-idx="' + i + '">'
                + '<div class="r-step-badge r-empty" data-badge="' + i + '"></div>'
                + '<div class="r-step-content">'
                + '<div class="r-step-label">' + esc(opt.label) + '</div>'
                + '<div class="r-step-detail">' + esc(opt.detail) + '</div>';
            if (roundData.showFormula && opt.formula) {
                html += '<div class="r-step-formula">' + esc(opt.formula) + '</div>';
            }
            html += '</div>';
            if (opt.count > 1) {
                html += '<span class="r-step-count">\u00D7' + opt.count + '</span>';
            }
            html += '</div>';
        }
        html += '</div>';
        return html;
    }

    // ── Mode 1: Build Sub-Questions ─────────────────────────────────

    function renderSubQuestions() {
        var html = '<div class="r-selection-box"><div class="r-selection-title">Jouw volgorde:</div>'
            + '<div class="r-selection-items" id="r-sel-display"><span class="r-selection-empty">Klik op deelvragen om ze te selecteren...</span></div></div>';
        html += '<div id="r-options">';
        for (var i = 0; i < roundData.options.length; i++) {
            html += '<div class="r-subq-row" data-idx="' + i + '">'
                + '<div class="r-step-badge r-empty" data-badge="' + i + '"></div>'
                + '<span>' + esc(roundData.options[i].text) + '</span></div>';
        }
        html += '</div>';
        return html;
    }

    // ── Mode 2: Find the Error ──────────────────────────────────────

    function renderFindError() {
        var html = '<p style="color:#64748b;font-size:14px;margin-bottom:12px;">Welke stap bevat de fout? Klik op de verdachte stap.</p>';
        html += '<div class="r-step-grid" id="r-options">';
        for (var i = 0; i < roundData.steps.length; i++) {
            var step = roundData.steps[i];
            html += '<div class="r-step-card" data-idx="' + i + '">'
                + '<div class="r-step-badge">' + (i + 1) + '</div>'
                + '<div class="r-step-content">'
                + '<div class="r-step-label">' + esc(step.label) + '</div>'
                + '<div class="r-step-detail">' + esc(step.detail) + '</div>';
            if (roundData.showFormula && !roundData.hideFormulaBeforeAnswer && step.formula) {
                html += '<div class="r-step-formula">' + esc(step.formula) + '</div>';
            }
            html += '</div></div>';
        }
        html += '</div>';
        return html;
    }

    // ── Mode 3: Build Flow Diagram ──────────────────────────────────

    function renderFlowDiagram() {
        var colors = roundData.flowTypeColors;
        var html = '<div class="r-flow-bank" id="r-flow-bank">';
        for (var i = 0; i < roundData.blocks.length; i++) {
            var block = roundData.blocks[i];
            var tc = colors[block.type] || { bg: '#f1f5f9', border: '#cbd5e1', icon: '\u2022' };
            html += '<div class="r-flow-block" data-idx="' + i + '" style="background:' + tc.bg + ';border-color:' + tc.border + '">'
                + '<span class="r-flow-icon">' + tc.icon + '</span>'
                + '<span>' + esc(block.text) + '</span></div>';
        }
        html += '</div>';
        html += '<div class="r-flow-chain" id="r-flow-chain"><span class="r-selection-empty">Klik op blokken om het diagram te bouwen...</span></div>';
        return html;
    }

    // ── Mode 4: Match Structures ────────────────────────────────────

    function renderMatchStructures() {
        var items = roundData.items;
        var html = '<p style="color:#64748b;font-size:14px;margin-bottom:8px;">Koppel telkens 2 opgaven die dezelfde oplossingsstructuur delen.</p>';
        html += '<button class="r-match-reset" id="r-match-reset">Reset paren</button>';
        html += '<div class="r-match-grid" id="r-options">';
        for (var i = 0; i < items.length; i++) {
            html += '<div class="r-match-card" data-id="' + items[i].id + '">'
                + '<div class="r-match-text">' + esc(items[i].text) + '</div>'
                + '<div class="r-match-label">' + esc(items[i].structureLabel) + '</div>'
                + '</div>';
        }
        html += '</div>';
        return html;
    }

    // ── Bind interactions ───────────────────────────────────────────

    function bindModeInteractions() {
        // Mode 3 uses #r-flow-bank, not #r-options — handle it before the options guard
        if (currentMode === 3) {
            var blocks = document.querySelectorAll('#r-flow-bank .r-flow-block');
            for (var k = 0; k < blocks.length; k++) {
                blocks[k].addEventListener('click', handleFlowBankClick);
            }
            return;
        }

        var options = document.getElementById('r-options');
        if (!options) return;

        switch (currentMode) {
            case 0: // Order Steps
            case 1: // Sub-Questions
                var cards = options.querySelectorAll('.r-step-card, .r-subq-row');
                for (var i = 0; i < cards.length; i++) {
                    cards[i].addEventListener('click', handleStepClick);
                }
                break;

            case 2: // Find Error
                var steps = options.querySelectorAll('.r-step-card');
                for (var j = 0; j < steps.length; j++) {
                    steps[j].addEventListener('click', handleErrorClick);
                }
                // Find Error: clicking IS the answer (no separate check button)
                els.checkBtn.style.display = 'none';
                break;

            case 4: // Match Structures
                var matchCards = options.querySelectorAll('.r-match-card');
                for (var m = 0; m < matchCards.length; m++) {
                    matchCards[m].addEventListener('click', handleMatchClick);
                }
                var resetBtn = document.getElementById('r-match-reset');
                if (resetBtn) resetBtn.addEventListener('click', resetMatchPairs);
                break;
        }
    }

    // ── Mode 0/1: Step/SubQ click handler ───────────────────────────

    function handleStepClick() {
        var idx = parseInt(this.getAttribute('data-idx'));
        var maxSel = roundData.maxSelections;

        // Toggle selection
        var selIdx = selection.indexOf(idx);
        if (selIdx >= 0) {
            selection.splice(selIdx, 1);
            this.classList.remove('r-selected');
        } else if (selection.length < maxSel) {
            selection.push(idx);
            this.classList.add('r-selected');
        }

        // Update badges
        updateSelectionBadges();
        updateSelectionDisplay();
        els.checkBtn.disabled = (selection.length !== maxSel);
    }

    function updateSelectionBadges() {
        var cards = document.querySelectorAll('#r-options .r-step-card, #r-options .r-subq-row');
        for (var i = 0; i < cards.length; i++) {
            var idx = parseInt(cards[i].getAttribute('data-idx'));
            var badge = cards[i].querySelector('.r-step-badge');
            var pos = selection.indexOf(idx);
            if (pos >= 0) {
                badge.textContent = pos + 1;
                badge.classList.remove('r-empty');
            } else {
                badge.textContent = '';
                badge.classList.add('r-empty');
            }
        }
    }

    function updateSelectionDisplay() {
        var display = document.getElementById('r-sel-display');
        if (!display) return;
        if (selection.length === 0) {
            display.innerHTML = '<span class="r-selection-empty">Klik om te selecteren...</span>';
            return;
        }
        var html = '';
        for (var i = 0; i < selection.length; i++) {
            if (i > 0) html += '<span class="r-selection-arrow">\u2192</span>';
            var opt = roundData.options[selection[i]];
            var text = (currentMode === 0) ? opt.label : opt.text;
            html += '<span class="r-selection-item">' + esc(text) + '</span>';
        }
        display.innerHTML = html;
    }

    // ── Mode 2: Find Error click handler ────────────────────────────

    function handleErrorClick() {
        var idx = parseInt(this.getAttribute('data-idx'));
        selectedErrorIdx = idx;

        // Immediately submit
        var stType = engine.getCurrentStructureType();
        var result = engine.submitAnswer(idx);
        updateSessionProgress(stType, result.correct);
        renderSessionProgress();

        // Disable all cards
        var cards = document.querySelectorAll('#r-options .r-step-card');
        for (var i = 0; i < cards.length; i++) {
            cards[i].classList.add('r-disabled');
            cards[i].style.pointerEvents = 'none';
        }

        // Highlight
        if (result.correct) {
            this.classList.add('r-correct');
            showFeedback(true, 'Goed gevonden!', 'Stap ' + (idx + 1) + ' bevatte inderdaad een fout.');
        } else {
            this.classList.add('r-wrong');
            var errorCard = cards[result.feedback.errorIdx];
            errorCard.classList.add('r-correct');
            showFeedback(false, 'Dat was niet de foute stap.',
                'Stap ' + (result.feedback.errorIdx + 1) + ' was fout. Correct: "' + esc(result.feedback.correctStep.label) + '"');
        }

        // Reveal formulas if hidden
        if (roundData.hideFormulaBeforeAnswer && roundData.showFormula) {
            for (var j = 0; j < roundData.steps.length; j++) {
                if (roundData.steps[j].formula) {
                    var content = cards[j].querySelector('.r-step-content');
                    content.innerHTML += '<div class="r-step-formula">' + esc(roundData.steps[j].formula) + '</div>';
                }
            }
        }

        els.nextBtn.style.display = 'inline-block';
    }

    // ── Mode 3: Flow diagram handlers ───────────────────────────────

    function handleFlowBankClick() {
        var idx = parseInt(this.getAttribute('data-idx'));
        var block = roundData.blocks[idx];
        this.classList.add('r-placed');

        placedBlocks.push({ idx: idx, block: block });
        renderFlowChain();
        els.checkBtn.disabled = (placedBlocks.length < roundData.blocks.length);
    }

    function handleFlowChainClick(placedIdx) {
        // Remove from chain, return to bank
        var removed = placedBlocks.splice(placedIdx, 1)[0];
        var bankBlocks = document.querySelectorAll('#r-flow-bank .r-flow-block');
        bankBlocks[removed.idx].classList.remove('r-placed');
        renderFlowChain();
        els.checkBtn.disabled = true;
    }

    function renderFlowChain() {
        var chain = document.getElementById('r-flow-chain');
        if (placedBlocks.length === 0) {
            chain.innerHTML = '<span class="r-selection-empty">Klik op blokken om het diagram te bouwen...</span>';
            return;
        }
        var colors = roundData.flowTypeColors;
        var html = '';
        for (var i = 0; i < placedBlocks.length; i++) {
            if (i > 0) html += '<div class="r-flow-arrow">\u2193</div>';
            var b = placedBlocks[i].block;
            var tc = colors[b.type] || { bg: '#f1f5f9', border: '#cbd5e1', icon: '\u2022' };
            html += '<div class="r-flow-placed" data-placed="' + i + '" style="background:' + tc.bg + ';border-color:' + tc.border + '">'
                + '<span class="r-flow-icon">' + tc.icon + '</span>'
                + '<span>' + esc(b.text) + '</span></div>';
        }
        chain.innerHTML = html;

        // Bind click-to-remove on placed blocks
        var placed = chain.querySelectorAll('.r-flow-placed');
        for (var j = 0; j < placed.length; j++) {
            (function (pi) {
                placed[pi].addEventListener('click', function () { handleFlowChainClick(pi); });
            })(j);
        }
    }

    // ── Mode 4: Match handlers ──────────────────────────────────────

    function handleMatchClick() {
        if (this.classList.contains('r-paired') || this.classList.contains('r-disabled')) return;

        var id = parseInt(this.getAttribute('data-id'));

        if (matchFirst === null) {
            // First of pair
            matchFirst = { id: id, el: this };
            this.classList.add('r-highlight');
        } else if (matchFirst.id === id) {
            // Deselect
            this.classList.remove('r-highlight');
            matchFirst = null;
        } else {
            // Second of pair — form a pair
            var pairIdx = matchPairs.length;
            matchPairs.push([matchFirst.id, id]);
            matchFirst.el.classList.remove('r-highlight');
            matchFirst.el.classList.add('r-paired', 'r-pair-' + pairIdx);
            this.classList.add('r-paired', 'r-pair-' + pairIdx);
            matchFirst = null;
        }

        els.checkBtn.disabled = (matchPairs.length < 3);
    }

    function resetMatchPairs() {
        matchPairs = [];
        matchFirst = null;
        var cards = document.querySelectorAll('#r-options .r-match-card');
        for (var i = 0; i < cards.length; i++) {
            cards[i].classList.remove('r-highlight', 'r-paired', 'r-pair-0', 'r-pair-1', 'r-pair-2', 'r-disabled');
        }
        els.checkBtn.disabled = true;
    }

    // ── Check button handler ────────────────────────────────────────

    function handleCheck() {
        var answer;
        switch (currentMode) {
            case 0: // Order Steps
                answer = selection.map(function (idx) { return roundData.options[idx].label; });
                break;
            case 1: // Sub-Questions
                answer = selection.map(function (idx) { return roundData.options[idx].text; });
                break;
            case 2: // Find Error (handled inline, shouldn't reach here)
                return;
            case 3: // Flow Diagram
                answer = placedBlocks.map(function (pb) { return pb.block.text; });
                break;
            case 4: // Match
                answer = matchPairs;
                break;
        }

        var stType = engine.getCurrentStructureType();
        var result = engine.submitAnswer(answer);
        updateSessionProgress(stType, result.correct);
        renderSessionProgress();

        // Save progress immediately so it persists even if the user leaves mid-game
        saveAnswerProgress(stType, result.correct);

        // Disable interaction
        disableAllInteraction();

        // Show feedback
        if (currentMode === 4) {
            // Match: show partial results
            var fb = result.feedback;
            if (result.correct) {
                showFeedback(true, 'Alle paren kloppen!', fb.matchCount + ' van ' + fb.totalPairs + ' paren goed.');
            } else {
                showFeedback(false, fb.matchCount + ' van ' + fb.totalPairs + ' paren goed.',
                    'Bekijk de juiste koppelingen hieronder.');
            }
            // Reveal structure labels on all cards
            var cards = document.querySelectorAll('#r-options .r-match-card');
            for (var i = 0; i < cards.length; i++) cards[i].classList.add('r-reveal');
        } else if (result.correct) {
            showFeedback(true, 'Helemaal goed!', '');
        } else {
            var correctHtml = formatCorrectAnswer();
            showFeedback(false, 'Dat klopt niet helemaal.', correctHtml);
        }

        els.checkBtn.style.display = 'none';
        els.nextBtn.style.display = 'inline-block';
    }

    function formatCorrectAnswer() {
        if (currentMode === 0) {
            return 'Juiste volgorde: ' + roundData.correctOrder.map(esc).join(' \u2192 ');
        } else if (currentMode === 1) {
            return 'Juiste volgorde: ' + roundData.correctOrder.map(esc).join(' \u2192 ');
        } else if (currentMode === 3) {
            return 'Juiste volgorde: ' + roundData.correctOrder.map(function (t) { return esc(t); }).join(' \u2193 ');
        }
        return '';
    }

    function disableAllInteraction() {
        var items = document.querySelectorAll('.r-step-card, .r-subq-row, .r-flow-block, .r-flow-placed, .r-match-card');
        for (var i = 0; i < items.length; i++) {
            items[i].classList.add('r-disabled');
            items[i].style.pointerEvents = 'none';
        }
    }

    // ── Feedback ────────────────────────────────────────────────────

    function showFeedback(success, title, detail) {
        els.feedbackBox.classList.remove('r-show', 'r-success', 'r-fail', 'r-partial');
        els.feedbackBox.classList.add('r-show', success ? 'r-success' : 'r-fail');
        els.feedbackTitle.textContent = title;
        els.feedbackDetail.innerHTML = detail;
    }

    // ── Next round handler ──────────────────────────────────────────

    function handleNext() {
        if (engine.nextRound()) {
            presentRound();
        } else {
            showResults();
        }
    }

    // ── Results screen ──────────────────────────────────────────────

    function showResults() {
        var result = engine.getResult();
        els.resultsEmoji.textContent = result.emoji;
        els.resultsTitle.textContent = result.modeName + ' klaar!';
        els.resultsScore.textContent = result.score + ' van ' + result.total + ' goed';
        var pct = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
        els.progressFill.style.width = '0%';
        showScreen('results');
        setTimeout(function () { els.progressFill.style.width = pct + '%'; }, 100);

        // ── Render session breakdown (progress already saved per-answer) ──
        var breakdownEl = document.getElementById('r-session-breakdown');
        if (!breakdownEl || !catData) return;

        var progress = loadProgress();
        var sessionCats = {};  // catId → { correct, total }

        // Aggregate per-type results into categories for display
        for (var type in result.perType) {
            if (!result.perType.hasOwnProperty(type)) continue;
            var catId = getCategoryId(meta.parNr, type);
            if (!catId) continue;
            var pt = result.perType[type];
            if (!sessionCats[catId]) {
                sessionCats[catId] = { correct: pt.correct, total: pt.total };
            } else {
                sessionCats[catId].correct += pt.correct;
                sessionCats[catId].total += pt.total;
            }
        }

        // Render breakdown
        var html = '<div class="r-session-divider">Deze sessie</div>';
        for (var catId2 in sessionCats) {
            if (!sessionCats.hasOwnProperty(catId2)) continue;
            var cat = catData.categories[catId2];
            var sc = sessionCats[catId2];
            var prevCorrect = (progressAtGameStart[catId2] || { correct: 0 }).correct;
            var prevLevel = getMasteryLevel(prevCorrect);
            var newLevel = getMasteryLevel(progress[catId2].correct);
            var levelUp = newLevel.label !== prevLevel.label;
            var rowClass = levelUp ? 'r-session-row r-level-up' : 'r-session-row';
            var levelText = levelUp ? ('\u2192 ' + newLevel.label + '!') : newLevel.label;
            var levelColor = levelUp ? newLevel.color : '#64748b';
            html += '<div class="' + rowClass + '">'
                + '<span>' + cat.icon + ' ' + esc(cat.name) + ': ' + sc.correct + '/' + sc.total + ' goed</span>'
                + '<span class="r-session-level" style="color:' + levelColor + '">' + esc(levelText) + '</span>'
                + '</div>';
        }
        breakdownEl.innerHTML = html;
    }

    // ── Utility ─────────────────────────────────────────────────────

    function esc(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ── Wire up global buttons ──────────────────────────────────────

    els.checkBtn.addEventListener('click', handleCheck);
    els.nextBtn.addEventListener('click', handleNext);
    els.backBtn.addEventListener('click', function () { showScreen('menu'); });

    // Replay and menu buttons on results screen
    document.getElementById('r-replay-btn').addEventListener('click', function () {
        startGame(currentMode);
    });
    document.getElementById('r-menu-btn').addEventListener('click', function () {
        showScreen('menu');
    });

    // Keyboard: Enter/Space to advance
    document.addEventListener('keydown', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (els.nextBtn.style.display !== 'none' && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleNext();
        }
    });

    // ── Initial render ──────────────────────────────────────────────
    initSessionProgress();
    renderSessionProgress();
    renderMenu();
    showScreen('menu');
})();
