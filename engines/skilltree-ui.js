/**
 * skilltree-ui-v2.js — DOM binding layer for the wiskundevaardigheden skilltree.
 * Reads globals: SKILL_TREE_ELEMENTS, SKILL_TREE_DATA, SKILL_TREE_EXPLANATIONS, SkillTreeEngine.
 * Binds to the persistent HTML scaffold; populates slots and toggles [hidden].
 */
(function () {
    'use strict';
    /* ── 1. Globals guard + fatal banner ───────────────────── */
    function fatal(msg) {
        try {
            var d = document.createElement('div');
            d.style.cssText = 'padding:14px;margin:18px;border-radius:8px;background:#b23b3b;color:#fff;font-family:sans-serif;';
            d.textContent = 'Skilltree UI: ' + msg;
            if (document.body) document.body.insertBefore(d, document.body.firstChild);
        } catch (e) { /* ignore */ }
        if (typeof console !== 'undefined' && console.error) console.error('[skilltree-ui-v2] ' + msg);
    }
    var ELEMENTS = window.SKILL_TREE_ELEMENTS;
    var DATA = window.SKILL_TREE_DATA;
    var EXPLANATIONS = window.SKILL_TREE_EXPLANATIONS || {};
    var Engine = window.SkillTreeEngine;
    if (!ELEMENTS) { fatal('SKILL_TREE_ELEMENTS missing'); return; }
    if (!DATA) { fatal('SKILL_TREE_DATA missing'); return; }
    if (!Engine) { fatal('SkillTreeEngine missing'); return; }
    /* ── 2. Engine ─────────────────────────────────────────── */
    var engine = new Engine({ elements: ELEMENTS, data: DATA, explanations: EXPLANATIONS });
    /* ── 3. els map + 4. critical-element guard ────────────── */
    function $(id) { return document.getElementById(id); }
    var els = {
        app:$('skilltree-app'), viewTree:$('st-view-tree'), viewDeps:$('st-view-deps'),
        viewExpl:$('st-view-expl'), viewExercise:$('st-view-exercise'),
        headerTitle:$('st-header-title'), statMastered:$('st-stat-mastered-val'),
        statTotal:$('st-stat-total-val'), statStars:$('st-stat-stars-val'),
        statMaxStars:$('st-stat-maxstars-val'), viewToggle:$('st-view-toggle'),
        themeToggle:$('st-theme-toggle'), goalBannerSlot:$('st-goal-banner-slot'),
        layers:$('st-layers'), resetBtn:$('st-reset'), depsBack:$('st-deps-back'),
        depsTitle:$('st-deps-title'), depsGraphSlot:$('st-deps-graph-slot'),
        depsGoalBtnSlot:$('st-deps-goal-btn-slot'), explBack:$('st-expl-back'),
        explTitle:$('st-expl-title'), explBody:$('st-expl-body'),
        infoOverlay:$('st-info-overlay'), infoContainer:$('st-info-container'),
        infoHeader:$('st-info-header'), infoDesc:$('st-info-desc'),
        infoPreview:$('st-info-preview'), infoStars:$('st-info-stars'),
        exercise:$('st-exercise'), exBack:$('st-back'), exSkillId:$('st-ex-skill-id'),
        exSkillName:$('st-ex-skill-name'), exStepCounter:$('st-step-counter'),
        exProgressFill:$('st-progress-fill'), exContext:$('st-context'),
        exCompleted:$('st-completed-list'), exStepSlot:$('st-step-card-slot'),
        exScoreTracker:$('st-score-tracker'), exResultSlot:$('st-result-slot')
    };
    var REQ = ['app','viewTree','viewDeps','viewExpl','viewExercise','layers','goalBannerSlot','exStepSlot','exResultSlot','infoOverlay'];
    var miss = [];
    for (var mi = 0; mi < REQ.length; mi++) if (!els[REQ[mi]]) miss.push(REQ[mi]);
    if (miss.length) { fatal('scaffold missing: ' + miss.join(', ')); return; }
    /* ── 5. Shared state ──────────────────────────────────── */
    var STAR_DISPLAY_COUNT = 5;
    var uiState = {
        deps: {
            activeSkillId: null,
            history: [],
            returnState: null
        },
        exercise: {
            orderPlaced: [],
            hintShown: false,
            hintHtml: '',
            autoAdvanceId: null
        },
        explOrigin: 'tree'
    };
    /* ── 6. Utilities ─────────────────────────────────────── */
    function esc(s) {
        if (s == null) return '';
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }
    function fmt(s) { return esc(s).replace(/\n/g, '<br>'); }
    function stars(n, max) {
        var M = max || STAR_DISPLAY_COUNT, o = '';
        for (var i = 0; i < M; i++) o += i < n ? '<span class="st-star-on">\u2605</span>' : '<span class="st-star-off">\u2605</span>';
        return o;
    }
    function showView(name) {
        els.viewTree.hidden = name !== 'tree';
        els.viewDeps.hidden = name !== 'deps';
        els.viewExpl.hidden = name !== 'expl';
        els.viewExercise.hidden = name !== 'exercise';
    }
    function findSkill(id) {
        var all = engine.getAllSkills();
        for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
        return null;
    }
    function clearAutoAdvance() {
        if (!uiState.exercise.autoAdvanceId) return;
        clearTimeout(uiState.exercise.autoAdvanceId);
        uiState.exercise.autoAdvanceId = null;
    }
    function resetStepUiState() {
        uiState.exercise.orderPlaced = [];
        uiState.exercise.hintShown = false;
        uiState.exercise.hintHtml = '';
    }
    function rememberDepsReturnState() {
        if (!uiState.deps.activeSkillId) return;
        uiState.deps.returnState = {
            skillId: uiState.deps.activeSkillId,
            history: uiState.deps.history.slice()
        };
    }
    function restoreDepsReturnState() {
        if (!uiState.deps.returnState) return false;
        var saved = uiState.deps.returnState;
        uiState.deps.returnState = null;
        uiState.deps.activeSkillId = saved.skillId;
        uiState.deps.history = saved.history || [];
        showView('deps');
        renderDepsView(uiState.deps.activeSkillId);
        return true;
    }
    /* ── 7. Theme ─────────────────────────────────────────── */
    function syncThemeLabel() {
        if (!els.themeToggle) return;
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        var lbl = els.themeToggle.querySelector('.label');
        if (lbl) lbl.textContent = isDark ? 'Donker' : 'Licht';
        var ring = els.themeToggle.querySelector('.ring i');
        if (ring) ring.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
    function applyStoredTheme() {
        var m;
        try { m = localStorage.getItem('quizMode'); } catch (e) { m = null; }
        if (m === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        else document.documentElement.removeAttribute('data-theme');
        syncThemeLabel();
    }
    function toggleTheme() {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            try { localStorage.setItem('quizMode', 'light'); } catch (e) {}
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            try { localStorage.setItem('quizMode', 'dark'); } catch (e) {}
        }
        syncThemeLabel();
    }
    /* ── 8. Tree render ───────────────────────────────────── */
    function renderTree() {
        if (els.headerTitle) els.headerTitle.textContent = DATA.parName || 'Wiskundevaardigheden';
        var p = engine.getProgress();
        if (els.statMastered) els.statMastered.textContent = String(p.mastered);
        if (els.statTotal) els.statTotal.textContent = String(p.total);
        if (els.statStars) els.statStars.textContent = String(p.totalStars);
        if (els.statMaxStars) els.statMaxStars.textContent = String(p.maxStars);
        if (els.viewToggle) els.viewToggle.innerHTML = engine.getViewMode() === 'module' ? '\u29E6 Module' : '\u00A7 Paragraaf';
        renderGoalBanner();
        renderLayers();
    }
    function renderGoalBanner() {
        var g = engine.getGoals(), h = '';
        var noActive = !g.active || !g.active.length;
        var noAchieved = !g.achieved || !g.achieved.length;
        if (noActive && noAchieved) {
            els.goalBannerSlot.innerHTML = '<div class="st-goal-banner"><div class="st-goal-prompt">Tip: tap <i class="fa-solid fa-sitemap"></i> op een kaartje om een doel te kiezen.</div></div>';
            return;
        }
        h = '<div class="st-goal-banner">';
        if (!noActive) for (var i = 0; i < g.active.length; i++) {
            var path = engine.getGoalPath(g.active[i].id);
            if (path) h += renderGoalCard(g.active[i].id, path);
        }
        if (!noAchieved) for (var j = 0; j < g.achieved.length; j++) {
            var ag = g.achieved[j], sk = findSkill(ag.id);
            h += '<div class="st-goal-card-achieved"><span class="st-goal-achieved-text">\u2713 Doel behaald:</span> <strong>' + esc(ag.id) + '</strong> &middot; ' + esc(sk ? sk.name : ag.id) + '</div>';
        }
        h += '</div>';
        els.goalBannerSlot.innerHTML = h;
    }
    function renderGoalCard(goalId, path) {
        var steps = '', p = path.orderedPath || [];
        for (var i = 0; i < p.length; i++) {
            var s = p[i], cls = 'st-goal-step';
            if (s.done) cls += ' st-goal-step-done';
            else if (s.actionable) cls += ' st-goal-step-actionable';
            var data = (s.actionable && !s.done) ? ' data-goal-step="' + esc(s.id) + '"' : '';
            steps += '<span class="' + cls + '"' + data + '><span class="st-goal-step-id">' + esc(s.id) + '</span>'
                   + (s.done ? '<span class="st-goal-step-check">\u2713</span>' : '') + '</span>';
            if (i < p.length - 1) steps += '<span class="st-goal-step-arrow">\u203A</span>';
        }
        return '<div class="st-goal-card">'
             + '<div class="st-goal-name"><span class="st-goal-name-id">' + esc(goalId) + '</span>' + esc(path.goalName || goalId) + '</div>'
             + '<div class="st-goal-path">' + steps + '</div>'
             + '<button class="st-goal-remove" type="button" data-goal-remove="' + esc(goalId) + '" title="Doel verwijderen"><i class="fa-solid fa-xmark"></i></button>'
             + '</div>';
    }
    function renderLayers() {
        var visible = engine.getVisibleSkills(), names = engine.getLayerNames(), st = engine.getStars();
        var newSet = {}, nl = engine.getNewSkills();
        for (var n = 0; n < nl.length; n++) newSet[nl[n]] = true;
        var buckets = {};
        for (var i = 0; i < visible.length; i++) {
            var sk = visible[i];
            if (!buckets[sk.layer]) buckets[sk.layer] = [];
            buckets[sk.layer].push(sk);
        }
        var keys = [];
        for (var lk in buckets) if (buckets.hasOwnProperty(lk)) keys.push(parseInt(lk, 10));
        keys.sort(function (a, b) { return a - b; });
        var h = '';
        for (var li = 0; li < keys.length; li++) {
            var layer = keys[li], items = buckets[layer];
            h += '<div class="st-layer" data-layer="' + layer + '"><div class="st-layer-title">' + esc(names[layer] || ('Laag ' + layer)) + '</div><div class="st-layer-grid">';
            for (var ii = 0; ii < items.length; ii++) h += renderSkillCard(items[ii], st[items[ii].id] || 0, newSet);
            h += '</div></div>';
        }
        els.layers.innerHTML = h;
    }
    function renderSkillCard(skill, sc, newSet) {
        var prereqsOk = engine.prereqsDone(skill.id);
        var locked = !prereqsOk && sc === 0;
        var hasGen = engine.hasGenerator(skill.id);
        var isGoal = engine.isGoal(skill.id);
        var onPath = engine.isOnGoalPath(skill.id) && !isGoal;
        var isNew = newSet[skill.id] && sc === 0;
        var cls = 'st-skill-card';
        if (locked) cls += ' st-locked';
        if (sc >= STAR_DISPLAY_COUNT) cls += ' st-mastered-5';
        if (isNew) cls += ' st-new-skill';
        if (isGoal) cls += ' st-goal-skill';
        if (onPath) cls += ' st-on-goal-path';
        var dis = (locked || !hasGen) ? ' disabled' : '';
        var h = '<button class="' + cls + '" data-layer="' + skill.layer + '" data-skill="' + esc(skill.id) + '" type="button"' + dis + '>';
        h += '<div class="st-skill-id"><span>' + esc(skill.id) + '</span><span class="st-skill-icons">'
           + '<span class="st-info-btn" data-info="' + esc(skill.id) + '" title="Info"><i class="fa-solid fa-circle-info"></i></span>'
           + '<span class="st-dep-btn" data-dep="' + esc(skill.id) + '" title="Afhankelijkheden"><i class="fa-solid fa-sitemap"></i></span>'
           + '</span></div>';
        h += '<div>' + esc(skill.name) + (isGoal ? ' <span class="st-goal-icon" title="Jouw doel"></span>' : '') + '</div>';
        if (locked) {
            var ms = engine.getMissingPrereqs(skill.id);
            if (ms && ms.length) h += '<div class="st-prereq-hint">Eerst: ' + esc(ms.join(', ')) + '</div>';
        } else if (sc === 0 && hasGen) {
            h += '<div class="st-tap-hint">tik om te oefenen</div>';
        }
        h += '<div class="st-stars">' + stars(sc, STAR_DISPLAY_COUNT) + '</div></button>';
        return h;
    }
    /* ── 9. Exercise render ───────────────────────────────── */
    function mountExercise(skillId) {
        var state = engine.startExercise(skillId);
        if (!state) { fatal('Geen oefening beschikbaar voor ' + skillId); return; }
        resetStepUiState();
        clearAutoAdvance();
        var sk = findSkill(skillId);
        if (els.exercise) els.exercise.setAttribute('data-layer', sk ? String(sk.layer) : '0');
        if (els.exSkillId) els.exSkillId.textContent = skillId;
        if (els.exSkillName) els.exSkillName.textContent = state.skillName;
        if (els.exContext) els.exContext.innerHTML = fmt(state.context || '');
        if (els.exStepSlot) els.exStepSlot.hidden = false;
        if (els.exScoreTracker) els.exScoreTracker.hidden = false;
        if (els.exResultSlot) {
            els.exResultSlot.hidden = true;
            els.exResultSlot.innerHTML = '';
            els.exResultSlot.removeAttribute('data-result-skill');
        }
        if (els.exCompleted) els.exCompleted.innerHTML = '';
        showView('exercise');
        renderStep();
        renderScoreTracker();
    }
    function renderStepActions(step, skillId) {
        var h = '<div class="st-help-row">';
        if (step.hint) h += '<button class="st-hint-btn" type="button" data-action="hint"><i class="fa-solid fa-lightbulb"></i> Hint</button>';
        if (engine.hasExplanation(skillId)) h += '<button class="st-explanation-btn" type="button" data-action="open-expl"><i class="fa-solid fa-book-open"></i> Uitleg</button>';
        h += '</div>';
        return h;
    }
    function buildStepCard(state) {
        var step = state.currentStep;
        var mode = step.mode || 'numeric';
        var h = '<div class="st-step-card"><div class="st-question">' + fmt(step.q) + '</div>';
        if (mode === 'mc') {
            h += '<div class="st-mc-grid">';
            for (var i = 0; i < step.options.length; i++) {
                h += '<button class="st-mc-option" type="button" data-mc="' + i + '">' + esc(String(step.options[i])) + '</button>';
            }
            h += '</div>';
        } else if (mode === 'order') {
            h += renderOrderWidget(step, uiState.exercise.orderPlaced);
        } else if (mode === 'error') {
            h += '<div class="st-error-cards">';
            for (var e = 0; e < step.shownSteps.length; e++) {
                h += '<div class="st-error-card" data-err="' + e + '"><span class="st-error-num">' + (e + 1) + '.</span>' + esc(step.shownSteps[e].text) + '</div>';
            }
            h += '</div>';
        } else {
            h += '<div class="st-input-row"><button class="st-minus-btn" type="button" data-action="minus">\u2212</button>'
               + '<input class="st-answer-input" id="st-numeric-input" type="text" inputmode="decimal" autocomplete="off" placeholder="Antwoord"></div>'
               + '<button class="st-check-btn" type="button" data-action="check-numeric">Controleer</button>';
        }
        h += '<div class="st-wrong-msg" data-role="wrong-msg" hidden></div>';
        h += renderStepActions(step, state.skillId);
        h += '<div data-role="hint-box"></div><div data-role="expl-box"></div></div>';
        return h;
    }
    function renderStep() {
        var state = engine.getExerciseState();
        if (!state) return;
        var mode = state.currentStep.mode || 'numeric';
        var pct = Math.round((state.currentStepIdx / state.totalSteps) * 100);
        if (els.exProgressFill) els.exProgressFill.style.width = pct + '%';
        if (els.exStepCounter) els.exStepCounter.textContent = (state.currentStepIdx + 1) + ' / ' + state.totalSteps;
        renderCompleted(state.completedSteps);
        els.exStepSlot.innerHTML = buildStepCard(state);
        if (uiState.exercise.hintHtml) {
            var hintBox = els.exStepSlot.querySelector('[data-role="hint-box"]');
            if (hintBox) hintBox.innerHTML = uiState.exercise.hintHtml;
        }
        if (mode === 'numeric') {
            var inp = document.getElementById('st-numeric-input');
            if (inp) {
                setTimeout(function () { try { inp.focus(); } catch (e) {} }, 30);
            }
        }
    }
    function renderOrderWidget(step, placed) {
        var placedSet = {};
        for (var p = 0; p < placed.length; p++) placedSet[placed[p]] = true;
        var h = '<div class="st-order-bank">';
        for (var i = 0; i < step.blocks.length; i++) {
            var pl = placedSet[i];
            h += '<button class="st-order-block' + (pl ? ' st-placed' : '') + '" type="button" data-order-block="' + i + '"' + (pl ? ' disabled' : '') + '>' + esc(step.blocks[i]) + '</button>';
        }
        h += '</div><div class="st-order-chain">';
        for (var j = 0; j < placed.length; j++) {
            h += '<div class="st-order-placed">' + esc(step.blocks[placed[j]]) + '</div>';
            if (j < placed.length - 1) h += '<span class="st-order-arrow">\u2193</span>';
        }
        h += '</div>';
        if (placed.length > 0) h += '<div class="st-help-row"><button class="st-check-btn" type="button" data-action="reset-order">Opnieuw</button></div>';
        return h;
    }
    function handleOrderBlock(idx, step) {
        for (var i = 0; i < uiState.exercise.orderPlaced.length; i++) {
            if (uiState.exercise.orderPlaced[i] === idx) return;
        }
        uiState.exercise.orderPlaced.push(idx);
        if (uiState.exercise.orderPlaced.length === step.blocks.length) {
            var result = engine.checkAnswer(uiState.exercise.orderPlaced.slice());
            resetStepUiState();
            if (!result.correct) renderStep();
            handleSubmitResult(result);
            return;
        }
        renderStep();
    }
    function handleMinus() {
        var inp = document.getElementById('st-numeric-input');
        if (!inp) return;
        inp.value = inp.value.charAt(0) === '-' ? inp.value.substring(1) : '-' + inp.value;
        inp.focus();
    }
    function handleCheckNumeric() {
        var inp = document.getElementById('st-numeric-input');
        if (!inp) return;
        var v = inp.value.trim();
        if (v === '') return;
        handleSubmitResult(engine.checkAnswer(v));
    }
    function handleMC(idx) {
        var btns = els.exStepSlot.querySelectorAll('.st-mc-option');
        for (var i = 0; i < btns.length; i++) btns[i].disabled = true;
        var r = engine.checkAnswer(idx);
        if (r.correct) btns[idx].classList.add('st-mc-correct');
        else {
            btns[idx].classList.add('st-mc-wrong');
            setTimeout(function () { for (var j = 0; j < btns.length; j++) if (j !== idx) btns[j].disabled = false; }, 50);
        }
        handleSubmitResult(r);
    }
    function handleError(idx) {
        var cards = els.exStepSlot.querySelectorAll('.st-error-card');
        var r = engine.checkAnswer(idx);
        if (r.correct) {
            for (var i = 0; i < cards.length; i++) {
                cards[i].setAttribute('data-disabled', '1');
                cards[i].classList.add(i === idx ? 'st-error-found' : 'st-error-ok');
            }
        } else cards[idx].classList.add('st-error-wrong');
        handleSubmitResult(r);
    }
    function handleSubmitResult(result) {
        var card = els.exStepSlot.querySelector('.st-step-card');
        var wrongMsg = els.exStepSlot.querySelector('[data-role="wrong-msg"]');
        if (result.correct) {
            if (card) card.classList.add('st-correct');
            if (result.explanation) {
                var box = els.exStepSlot.querySelector('[data-role="expl-box"]');
                if (box) box.innerHTML = '<div class="st-expl-box">' + fmt(result.explanation) + '</div>';
            }
            renderScoreTracker();
            clearAutoAdvance();
            if (result.isLastStep) {
                uiState.exercise.autoAdvanceId = setTimeout(finishAndShowResult, 900);
            } else {
                uiState.exercise.autoAdvanceId = setTimeout(function () {
                    engine.nextStep();
                    resetStepUiState();
                    renderStep();
                    renderScoreTracker();
                }, 1200);
            }
        } else {
            if (card) { card.classList.add('st-wrong'); setTimeout(function () { card.classList.remove('st-wrong'); }, 450); }
            if (wrongMsg) { wrongMsg.hidden = false; wrongMsg.textContent = errMsg(result.error); }
            renderScoreTracker();
        }
    }
    function errMsg(c) {
        if (c === 'invalid_number') return 'Vul een geldig getal in.';
        if (c === 'invalid_choice') return 'Kies een van de opties.';
        if (c === 'wrong_order') return 'Volgorde klopt nog niet. Probeer opnieuw.';
        if (c === 'incomplete_order') return 'Plaats alle blokken.';
        return 'Nog niet juist, probeer opnieuw.';
    }
    function showHint() {
        if (uiState.exercise.hintShown) return;
        var hint = engine.useHint();
        if (!hint) return;
        var box = els.exStepSlot.querySelector('[data-role="hint-box"]');
        uiState.exercise.hintHtml = '<div class="st-hint-box"><i class="fa-solid fa-lightbulb"></i> ' + fmt(hint) + '</div>';
        if (box) box.innerHTML = uiState.exercise.hintHtml;
        uiState.exercise.hintShown = true;
        renderScoreTracker();
    }
    function renderCompleted(completed) {
        if (!els.exCompleted) return;
        var h = '';
        for (var i = 0; i < completed.length; i++) {
            var c = completed[i];
            h += '<div class="st-completed-step"><div class="st-cs-label">Stap ' + (i + 1) + ' \u2713</div>'
               + '<div>' + fmt(c.q) + '</div><div class="st-cs-answer">' + esc(String(c.a)) + '</div></div>';
        }
        els.exCompleted.innerHTML = h;
    }
    function renderScoreTracker() {
        if (!els.exScoreTracker) return;
        var s = engine.getExerciseState();
        if (!s) { els.exScoreTracker.innerHTML = ''; return; }
        var perfect = s.errors === 0 && s.hints === 0;
        var h = '<span>Fouten: ' + s.errors + '</span><span>Hints: ' + s.hints + '</span>';
        if (s.streak > 1) h += '<span class="st-streak">\uD83D\uDD25 Reeks: ' + s.streak + '</span>';
        if (perfect && s.completedSteps.length > 0) h += '<span class="st-score-perfect">Perfect!</span>';
        els.exScoreTracker.innerHTML = h;
    }
    /* ── 10. Result render ────────────────────────────────── */
    function finishAndShowResult() {
        var state = engine.getExerciseState();
        if (!state) return;
        var skillId = state.skillId;
        clearAutoAdvance();
        var finish = engine.finishExercise();
        if (!finish) return;
        var achieved = engine.checkGoalCompletion();
        renderResult(finish, skillId, achieved);
    }
    function renderResult(finish, skillId, achievedIds) {
        if (els.exStepSlot) els.exStepSlot.hidden = true;
        if (els.exScoreTracker) els.exScoreTracker.hidden = true;
        if (els.exResultSlot) els.exResultSlot.hidden = false;
        var mastered = finish.newTotal >= 3;
        var goalAchieved = false;
        for (var a = 0; a < achievedIds.length; a++) if (achievedIds[a] === skillId) goalAchieved = true;
        var cardCls = 'st-result-card' + ((mastered && finish.improved) ? ' st-mastery-card' : '');
        var msg;
        if (finish.newTotal >= 5) msg = 'Meesterschap!';
        else if (finish.newTotal >= 3) msg = 'Goed gedaan!';
        else if (finish.improved) msg = 'Mooi, je bent vooruit!';
        else msg = 'Probeer nog een keer voor meer sterren.';
        var details = 'Verdiend: +' + finish.earned + ' ster' + (finish.earned === 1 ? '' : 'ren')
                    + ' (' + finish.errors + ' fout, ' + finish.hints + ' hint' + (finish.hints === 1 ? '' : 's') + ')';
        var h = '<div class="' + cardCls + '">';
        h += '<div class="st-result-stars">' + stars(finish.newTotal, STAR_DISPLAY_COUNT) + '</div>';
        h += '<div class="st-result-message">' + esc(msg) + '</div>';
        h += '<div class="st-result-details">' + details + '</div>';
        if (!finish.improved && finish.previous < STAR_DISPLAY_COUNT) h += '<div class="st-near-miss">Vorige keer had je al ' + finish.previous + ' ster(ren).</div>';
        else if (finish.improved) h += '<div class="st-result-progress">' + finish.previous + ' \u2192 ' + finish.newTotal + ' sterren</div>';
        var goalInfo = goalProgressForSkill(skillId);
        if (goalInfo && !goalAchieved) h += renderGoalProgress(goalInfo);
        var next = engine.getNextSkill(skillId);
        h += '<div class="st-result-buttons">'
           + '<button class="st-btn-back" type="button" data-result-action="back"><i class="fa-solid fa-arrow-left"></i> Terug</button>'
           + '<button class="st-btn-retry" type="button" data-result-action="retry"><i class="fa-solid fa-rotate-right"></i> Nog een keer</button>';
        if (next) h += '<button class="st-btn-next" type="button" data-result-action="next" data-next="' + esc(next.id) + '">Volgende: ' + esc(next.id) + ' <i class="fa-solid fa-arrow-right"></i></button>';
        h += '</div>';
        if (goalAchieved) {
            var gsk = findSkill(skillId);
            h += '<div class="st-goal-achieved-card"><div class="st-goal-achieved-title">\uD83C\uDFAF Doel behaald!</div>'
               + '<div class="st-goal-achieved-name">' + esc(gsk ? gsk.name : skillId) + '</div></div>';
        }
        h += '</div>';
        els.exResultSlot.setAttribute('data-result-skill', skillId);
        els.exResultSlot.innerHTML = h;
        if (goalAchieved || (mastered && finish.improved)) {
            spawnConfetti(els.exResultSlot.querySelector('.st-result-card'));
        }
    }
    function onResultBack() {
        if (!restoreDepsReturnState()) {
            showView('tree');
            renderTree();
        }
    }
    function goalProgressForSkill(skillId) {
        var g = engine.getGoals();
        if (!g.active || !g.active.length) return null;
        for (var i = 0; i < g.active.length; i++) {
            var path = engine.getGoalPath(g.active[i].id);
            if (!path) continue;
            for (var j = 0; j < path.orderedPath.length; j++) {
                if (path.orderedPath[j].id === skillId) return path;
            }
        }
        return null;
    }
    function renderGoalProgress(path) {
        var done = path.fullyMastered, total = path.totalPrereqs;
        var pct = total > 0 ? Math.round((done / total) * 100) : 0;
        var h = '<div class="st-result-goal"><div class="st-result-goal-title">Doel: ' + esc(path.goalName) + '</div>'
              + '<div class="st-goal-bar"><div class="st-goal-bar-fill" style="width:' + pct + '%"></div></div>'
              + '<div class="st-goal-info"><span>' + done + ' / ' + total + ' beheerst</span><span>' + pct + '%</span></div>';
        if (path.nextActionable && path.nextActionable.length > 0 && !path.complete) {
            h += '<div class="st-result-goal-next">Volgende stap: <strong>' + esc(path.nextActionable[0]) + '</strong></div>';
        }
        return h + '</div>';
    }
    function spawnConfetti(parent) {
        if (!parent) return;
        var c = document.createElement('div');
        c.className = 'st-confetti-container';
        var colors = ['#c58f2c', '#17A2B8', '#d08732', '#2f7d4a', '#b23b3b'];
        for (var i = 0; i < 40; i++) {
            var p = document.createElement('span');
            p.className = 'st-confetti-piece';
            p.style.left = (Math.random() * 100) + '%';
            p.style.background = colors[i % colors.length];
            p.style.setProperty('--drift', (Math.random() * 160 - 80).toFixed(0) + 'px');
            p.style.animationDelay = (Math.random() * 0.4).toFixed(2) + 's';
            c.appendChild(p);
        }
        parent.appendChild(c);
        setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 2500);
    }
    /* ── 11. Info popup ───────────────────────────────────── */
    function openInfoPopup(skillId) {
        var skill = findSkill(skillId);
        if (!skill) return;
        els.infoContainer.setAttribute('data-layer', String(skill.layer));
        var desc = engine.getSkillDescription(skillId) || '';
        var prev = engine.generatePreview(skillId);
        var sc = engine.getStars()[skillId] || 0;
        els.infoHeader.innerHTML = '<span class="st-info-skill-id">' + esc(skillId) + '</span>'
            + '<span>' + esc(skill.name) + '</span>'
            + '<button class="st-info-close" type="button" data-info-close="1" aria-label="Sluiten">\u00D7</button>';
        els.infoDesc.innerHTML = fmt(desc);
        if (prev) {
            els.infoPreview.innerHTML = '<div class="st-info-preview-label">Voorbeeldvraag</div>'
                + '<div class="st-info-preview-context">' + fmt(prev.context || '') + '</div>'
                + '<div class="st-info-preview-q">' + fmt(prev.question || '') + '</div>';
        } else els.infoPreview.innerHTML = '<div class="st-info-preview-label">Geen voorbeeld beschikbaar</div>';
        els.infoStars.innerHTML = stars(sc, STAR_DISPLAY_COUNT);
        els.infoOverlay.hidden = false;
    }
    function closeInfoPopup() { els.infoOverlay.hidden = true; }
    /* ── 12. Deps view ────────────────────────────────────── */
    function openDepsView(skillId, replace) {
        if (!replace && uiState.deps.activeSkillId && uiState.deps.activeSkillId !== skillId) {
            uiState.deps.history.push(uiState.deps.activeSkillId);
        }
        uiState.deps.activeSkillId = skillId;
        renderDepsView(skillId);
        showView('deps');
    }
    function drillDeeper(skillId) {
        if (uiState.deps.activeSkillId) uiState.deps.history.push(uiState.deps.activeSkillId);
        uiState.deps.activeSkillId = skillId;
        renderDepsView(skillId);
    }
    function popDepsHistory() {
        if (uiState.deps.history.length > 0) {
            uiState.deps.activeSkillId = uiState.deps.history.pop();
            renderDepsView(uiState.deps.activeSkillId);
        } else {
            uiState.deps.activeSkillId = null;
            uiState.deps.history = [];
            showView('tree');
            renderTree();
        }
    }
    function renderDepsView(skillId) {
        var sg = engine.getDependencySubgraph(skillId);
        if (!sg) return;
        var sk = findSkill(skillId), name = sk ? sk.name : skillId;
        if (els.depsTitle) els.depsTitle.textContent = 'Afhankelijkheden: ' + name;
        els.depsGraphSlot.innerHTML = buildDepsSvg(sg);
        var isGoal = engine.isGoal(skillId), isAch = engine.isAchievedGoal(skillId);
        var goals = engine.getGoals();
        var full = goals.active.length >= 2 && !isGoal;
        var dis = isGoal || isAch || full;
        var lbl = isAch ? 'Doel al behaald' : isGoal ? 'Al ingesteld als doel' : full ? 'Max 2 doelen actief' : 'Stel in als doel';
        els.depsGoalBtnSlot.innerHTML = '<button class="st-goal-set-btn" id="st-set-goal" type="button"' + (dis ? ' disabled' : '') + '><i class="fa-solid fa-bullseye"></i> ' + esc(lbl) + '</button>';
    }
    function buildDepsSvg(sg) {
        var NW = 120, NH = 48, HG = 14, VG = 42, PAD = 14;
        var st = engine.getStars();
        var byLayer = {};
        for (var i = 0; i < sg.nodes.length; i++) {
            var n = sg.nodes[i];
            if (!byLayer[n.layer]) byLayer[n.layer] = [];
            byLayer[n.layer].push(n);
        }
        var keys = [];
        for (var lk in byLayer) if (byLayer.hasOwnProperty(lk)) keys.push(parseInt(lk, 10));
        keys.sort(function (a, b) { return a - b; });
        if (sg.nodes.length > 3) {
            var aOut = {}, aIn = {};
            for (var ei = 0; ei < sg.edges.length; ei++) {
                var e = sg.edges[ei];
                (aOut[e.from] = aOut[e.from] || []).push(e.to);
                (aIn[e.to] = aIn[e.to] || []).push(e.from);
            }
            for (var pass = 0; pass < 3; pass++) {
                for (var li = 1; li < keys.length; li++) {
                    var prev = byLayer[keys[li - 1]], prevIdx = {};
                    for (var pi = 0; pi < prev.length; pi++) prevIdx[prev[pi].id] = pi;
                    byLayer[keys[li]].sort(function (a, b) { return bary(a, prevIdx, aIn) - bary(b, prevIdx, aIn); });
                }
                for (var li2 = keys.length - 2; li2 >= 0; li2--) {
                    var nxt = byLayer[keys[li2 + 1]], nxtIdx = {};
                    for (var ni = 0; ni < nxt.length; ni++) nxtIdx[nxt[ni].id] = ni;
                    byLayer[keys[li2]].sort(function (a, b) { return bary(a, nxtIdx, aOut) - bary(b, nxtIdx, aOut); });
                }
            }
        }
        var positions = {}, maxW = 0;
        for (var ri = 0; ri < keys.length; ri++) {
            var row = byLayer[keys[ri]];
            var w = row.length * NW + (row.length - 1) * HG;
            if (w > maxW) maxW = w;
        }
        var width = maxW + PAD * 2;
        for (var ri2 = 0; ri2 < keys.length; ri2++) {
            var row2 = byLayer[keys[ri2]];
            var rowW = row2.length * NW + (row2.length - 1) * HG;
            var sx = PAD + (maxW - rowW) / 2;
            for (var ci = 0; ci < row2.length; ci++) {
                positions[row2[ci].id] = { x: sx + ci * (NW + HG), y: PAD + ri2 * (NH + VG), layer: row2[ci].layer };
            }
        }
        var height = PAD * 2 + keys.length * NH + (keys.length - 1) * VG;
        var edgesSvg = '';
        for (var eei = 0; eei < sg.edges.length; eei++) {
            var ed = sg.edges[eei], fp = positions[ed.from], tp = positions[ed.to];
            if (!fp || !tp) continue;
            var x1 = fp.x + NW / 2, y1 = fp.y + NH, x2 = tp.x + NW / 2, y2 = tp.y, mid = (y1 + y2) / 2;
            var color = (st[ed.from] || 0) >= 1 ? '#2f7d4a' : '#b23b3b';
            edgesSvg += '<path class="st-dep-edge" d="M ' + x1 + ' ' + y1 + ' C ' + x1 + ' ' + mid + ' ' + x2 + ' ' + mid + ' ' + x2 + ' ' + y2 + '" stroke="' + color + '"/>';
        }
        var lc = ['#17A2B8', '#d08732', '#2f7d4a', '#7b4fae', '#c2266b', '#c2410c'];
        var nodesSvg = '';
        for (var ni2 = 0; ni2 < sg.nodes.length; ni2++) {
            var nd = sg.nodes[ni2], pos = positions[nd.id];
            if (!pos) continue;
            var sc = st[nd.id] || 0;
            var dis = (!engine.hasGenerator(nd.id) || !engine.prereqsDone(nd.id)) && sc === 0;
            var gcls = 'st-dep-node' + (dis ? ' st-dep-node-disabled' : '');
            var fill = lc[nd.layer] || '#444';
            var nm = nd.name.length > 16 ? nd.name.substring(0, 14) + '\u2026' : nd.name;
            var strokeW = nd.id === sg.root ? 2 : 1;
            var strokeC = nd.id === sg.root ? '#c58f2c' : 'rgba(0,0,0,0.25)';
            var starStr = '';
            for (var ss = 0; ss < STAR_DISPLAY_COUNT; ss++) starStr += ss < sc ? '\u2605' : '\u2606';
            nodesSvg += '<g class="' + gcls + '" data-skill="' + esc(nd.id) + '" transform="translate(' + pos.x + ',' + pos.y + ')" data-layer="' + nd.layer + '">'
                + '<rect width="' + NW + '" height="' + NH + '" rx="8" ry="8" fill="' + fill + '" stroke="' + strokeC + '" stroke-width="' + strokeW + '"/>'
                + '<text x="8" y="14" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#fff" opacity="0.85">' + esc(nd.id) + '</text>'
                + '<text x="8" y="30" font-family="Inter, sans-serif" font-size="11" fill="#fff">' + esc(nm) + '</text>'
                + '<text x="8" y="44" font-family="Inter, sans-serif" font-size="9" fill="#ffe18a">' + starStr + '</text>'
                + '<g class="st-dep-info-btn" data-dep-info="' + esc(nd.id) + '" transform="translate(' + (NW - 34) + ',6)"><rect width="14" height="14" rx="3" fill="rgba(0,0,0,0.25)"/><text x="7" y="11" font-size="10" font-family="sans-serif" text-anchor="middle" fill="#fff">i</text></g>'
                + '<g class="st-dep-tree-btn" data-dep-drill="' + esc(nd.id) + '" transform="translate(' + (NW - 18) + ',6)"><rect width="14" height="14" rx="3" fill="rgba(0,0,0,0.25)"/><text x="7" y="11" font-size="10" font-family="sans-serif" text-anchor="middle" fill="#fff">\u22A5</text></g>'
                + '</g>';
        }
        return '<svg class="st-dep-graph" viewBox="0 0 ' + width + ' ' + height + '" xmlns="http://www.w3.org/2000/svg">' + edgesSvg + nodesSvg + '</svg>';
    }
    function bary(node, idx, adj) {
        var list = adj[node.id];
        if (!list || !list.length) return 0;
        var sum = 0, cnt = 0;
        for (var i = 0; i < list.length; i++) if (idx.hasOwnProperty(list[i])) { sum += idx[list[i]]; cnt++; }
        return cnt > 0 ? sum / cnt : 0;
    }
    /* ── 13. Expl view ────────────────────────────────────── */
    function openExplView(skillId, origin) {
        var expl = engine.getExplanation(skillId);
        if (!expl) return;
        uiState.explOrigin = origin || 'tree';
        if (els.explTitle) els.explTitle.textContent = expl.title || skillId;
        if (els.explBody) { els.explBody.innerHTML = renderExplSections(expl.sections || []); els.explBody.scrollTop = 0; }
        showView('expl');
    }
    function renderExplSections(sections) {
        var lbl = { uitleg:'Uitleg', formule:'Formule', voorbeeld:'Voorbeeld', tip:'\uD83D\uDCA1 Tip', valkuil:'\u26A0 Valkuil', check:'\u2714 Zelfcheck' };
        var h = '';
        for (var i = 0; i < sections.length; i++) {
            var s = sections[i], t = s.type || 'uitleg';
            var label = lbl[t] || t;
            if (t === 'voorbeeld' && s.title) label += ': ' + s.title;
            h += '<div class="st-expl-section st-expl-' + t + '"><div class="st-expl-section-label">' + esc(label) + '</div>';
            h += t === 'formule'
                ? '<div class="st-expl-formula-box">' + fmt(s.content || '') + '</div>'
                : '<div class="st-expl-text">' + fmt(s.content || '') + '</div>';
            h += '</div>';
        }
        return h;
    }
    function closeExplView() {
        if (uiState.explOrigin === 'exercise' && engine.getExerciseState()) showView('exercise');
        else if (uiState.deps.activeSkillId) showView('deps');
        else { showView('tree'); renderTree(); }
    }
    /* ── 14. Persistent listeners ─────────────────────────── */
    function wireListeners() {
        if (els.themeToggle) els.themeToggle.addEventListener('click', toggleTheme);
        if (els.viewToggle) els.viewToggle.addEventListener('click', function () {
            engine.setViewMode(engine.getViewMode() === 'module' ? 'paragraph' : 'module');
            renderTree();
        });
        if (els.resetBtn) els.resetBtn.addEventListener('click', function () {
            if (confirm('Weet je zeker dat je alle sterren wilt resetten?')) { engine.resetStars(); renderTree(); }
        });
        if (els.exBack) els.exBack.addEventListener('click', function () {
            clearAutoAdvance();
            resetStepUiState();
            engine.abortExercise();
            if (!restoreDepsReturnState()) { showView('tree'); renderTree(); }
        });
        if (els.depsBack) els.depsBack.addEventListener('click', popDepsHistory);
        if (els.explBack) els.explBack.addEventListener('click', closeExplView);
        if (els.infoOverlay) els.infoOverlay.addEventListener('click', function (e) {
            if (e.target === els.infoOverlay) { closeInfoPopup(); return; }
            var n = e.target;
            while (n && n !== els.infoOverlay) {
                if (n.getAttribute && n.getAttribute('data-info-close')) { closeInfoPopup(); return; }
                n = n.parentNode;
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape' && e.keyCode !== 27) return;
            if (!els.infoOverlay.hidden) { closeInfoPopup(); return; }
            if (!els.viewExpl.hidden) { closeExplView(); return; }
            if (!els.viewDeps.hidden) { popDepsHistory(); return; }
        });
        if (els.exStepSlot) els.exStepSlot.addEventListener('click', function (e) {
            var state = engine.getExerciseState();
            if (!state) return;
            var step = state.currentStep;
            var mode = step.mode || 'numeric';
            var t = e.target;
            while (t && t !== els.exStepSlot) {
                if (t.getAttribute) {
                    var act = t.getAttribute('data-action');
                    if (act === 'hint') { showHint(); return; }
                    if (act === 'open-expl') { openExplView(state.skillId, 'exercise'); return; }
                    if (act === 'minus') { handleMinus(); return; }
                    if (act === 'check-numeric') { handleCheckNumeric(); return; }
                    if (act === 'reset-order') { resetStepUiState(); renderStep(); return; }
                    var mc = t.getAttribute('data-mc');
                    if (mc !== null && mode === 'mc') { handleMC(parseInt(mc, 10)); return; }
                    var er = t.getAttribute('data-err');
                    if (er !== null && mode === 'error') { handleError(parseInt(er, 10)); return; }
                    var ob = t.getAttribute('data-order-block');
                    if (ob !== null && mode === 'order') { handleOrderBlock(parseInt(ob, 10), step); return; }
                }
                t = t.parentNode;
            }
        });
        if (els.exStepSlot) els.exStepSlot.addEventListener('keydown', function (e) {
            if (!e.target || e.target.id !== 'st-numeric-input') return;
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                handleCheckNumeric();
            }
        });
        if (els.exResultSlot) els.exResultSlot.addEventListener('click', function (e) {
            var t = e.target;
            while (t && t !== els.exResultSlot) {
                if (t.getAttribute) {
                    var act = t.getAttribute('data-result-action');
                    if (act) {
                        var skillId = els.exResultSlot.getAttribute('data-result-skill');
                        if (act === 'back') onResultBack();
                        else if (act === 'retry' && skillId) mountExercise(skillId);
                        else if (act === 'next') {
                            var nx = t.getAttribute('data-next');
                            if (nx) mountExercise(nx);
                        }
                        return;
                    }
                }
                t = t.parentNode;
            }
        });
        els.viewTree.addEventListener('click', function (e) {
            var t = e.target;
            while (t && t !== els.viewTree) {
                if (t.getAttribute) {
                    var info = t.getAttribute('data-info');
                    if (info) { e.preventDefault(); e.stopPropagation(); openInfoPopup(info); return; }
                    var dep = t.getAttribute('data-dep');
                    if (dep) { e.preventDefault(); e.stopPropagation(); openDepsView(dep, true); return; }
                    var gs = t.getAttribute('data-goal-step');
                    if (gs) { mountExercise(gs); return; }
                    var grm = t.getAttribute('data-goal-remove');
                    if (grm) { engine.removeGoal(grm); renderTree(); return; }
                    if (t.getAttribute('data-skill') && t.classList && t.classList.contains('st-skill-card')) {
                        if (t.disabled) return;
                        mountExercise(t.getAttribute('data-skill'));
                        return;
                    }
                }
                t = t.parentNode;
            }
        });
        els.viewDeps.addEventListener('click', function (e) {
            var t = e.target;
            while (t && t !== els.viewDeps) {
                if (t.getAttribute) {
                    if (t.id === 'st-set-goal' && !t.disabled) {
                        engine.setGoal(uiState.deps.activeSkillId); renderDepsView(uiState.deps.activeSkillId); return;
                    }
                    var drill = t.getAttribute('data-dep-drill');
                    if (drill) { drillDeeper(drill); return; }
                    var di = t.getAttribute('data-dep-info');
                    if (di) { openInfoPopup(di); return; }
                    if (t.tagName === 'g' || (t.parentNode && t.parentNode.tagName === 'g')) {
                        var g = t.tagName === 'g' ? t : t.parentNode;
                        var sa = g.getAttribute && g.getAttribute('data-skill');
                        var gc = g.getAttribute && g.getAttribute('class');
                        if (sa && gc && gc.indexOf('st-dep-node-disabled') < 0) {
                            rememberDepsReturnState();
                            mountExercise(sa);
                            return;
                        }
                    }
                }
                t = t.parentNode;
            }
        });
    }
    /* ── 15. Init ─────────────────────────────────────────── */
    applyStoredTheme();
    wireListeners();
    showView('tree');
    renderTree();
})();
