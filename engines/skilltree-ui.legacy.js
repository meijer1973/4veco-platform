/**
 * SkillTree UI — DOM binding layer for the skill tree (wiskundevaardigheden).
 *
 * Idiom: persistent scaffold + els map + surgical updaters + event delegation,
 * matching the pattern used by quiz-ui.js / reasoning-ui.js / procedure-ui.js.
 * State lives in the engine; the UI only holds transient DOM-lifecycle state
 * (overlay nav stack, auto-advance timer).
 *
 * Reads window.SKILL_TREE_ELEMENTS, window.SKILL_TREE_DATA,
 * window.SKILL_TREE_EXPLANATIONS (optional).
 */
(function () {
    'use strict';

    // ── Dependencies ──────────────────────────────────────────
    var elements = window.SKILL_TREE_ELEMENTS;
    var data = window.SKILL_TREE_DATA;
    var explanations = window.SKILL_TREE_EXPLANATIONS || {};
    var Engine = window.SkillTreeEngine;

    if (!elements || !Engine || !data) {
        document.body.innerHTML = '<p style="color:red;padding:20px">Fout: ontbrekende scripts. Controleer of alle bestanden geladen zijn.</p>';
        return;
    }

    var engine = new Engine({ elements: elements, data: data, explanations: explanations });

    // ── Icons (FontAwesome 6.5.1) ─────────────────────────────
    var ICON = {
        arrowLeft: '<i class="fa-solid fa-arrow-left"></i>',
        lightbulb: '<i class="fa-solid fa-lightbulb"></i>',
        reset:     '<i class="fa-solid fa-rotate-left"></i>',
        refresh:   '<i class="fa-solid fa-rotate-right"></i>',
        tree:      '<i class="fa-solid fa-sitemap"></i>',
        info:      '<i class="fa-solid fa-circle-info"></i>',
        book:      '<i class="fa-solid fa-book"></i>'
    };

    // ── Helpers ───────────────────────────────────────────────
    function esc(s) {
        var d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    function starsHTML(count, max) {
        max = max || 5;
        var h = '';
        for (var i = 0; i < max; i++) {
            h += '<span class="' + (i < count ? 'st-star-on' : 'st-star-off') + '">\u2605</span>';
        }
        return h;
    }

    function formatExplText(text) {
        return esc(text).replace(/\n/g, '<br>');
    }

    function skillNameById(skillId) {
        var all = engine.getAllSkills();
        for (var i = 0; i < all.length; i++) {
            if (all[i].id === skillId) return all[i].name;
        }
        return skillId;
    }

    // ── Theme (shared with instapquiz via localStorage key "quizMode") ──
    var THEME_KEY = 'quizMode';
    function getStoredTheme() {
        try { return localStorage.getItem(THEME_KEY) || 'light'; }
        catch (e) { return 'light'; }
    }
    function applyTheme(mode) {
        mode = mode === 'dark' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', mode);
        try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
        var ring = document.querySelector('.st-theme-toggle .ring i');
        var label = document.querySelector('.st-theme-toggle .label');
        if (ring)  ring.className  = mode === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        if (label) label.textContent = mode === 'dark' ? 'Donker' : 'Licht';
    }
    applyTheme(getStoredTheme());

    // ── Bind to the persistent scaffold in the HTML ───────────────
    // The deployed *-wiskundevaardigheden.html owns the DOM tree — see
    // engines/tests/_wiskundevaardigheden-template.html for the canonical
    // shape. This file only reads slot references and populates them.
    var els = {
        viewTree:          document.getElementById('st-view-tree'),
        legend:            document.getElementById('st-legend'),
        viewToggleBtn:     document.getElementById('st-view-toggle'),
        themeToggleBtn:    document.getElementById('st-theme-toggle'),
        header:            document.getElementById('st-header'),
        headerTitle:       document.getElementById('st-header-title'),
        statMasteredVal:   document.getElementById('st-stat-mastered-val'),
        statTotalVal:      document.getElementById('st-stat-total-val'),
        statStarsVal:      document.getElementById('st-stat-stars-val'),
        statMaxStarsVal:   document.getElementById('st-stat-maxstars-val'),
        goalBannerSlot:    document.getElementById('st-goal-banner-slot'),
        layers:            document.getElementById('st-layers'),
        resetBtn:          document.getElementById('st-reset'),
        viewExercise:      document.getElementById('st-view-exercise'),
        exerciseRoot:      document.getElementById('st-exercise'),
        backBtn:           document.getElementById('st-back'),
        exSkillId:         document.getElementById('st-ex-skill-id'),
        exSkillName:       document.getElementById('st-ex-skill-name'),
        stepCounter:       document.getElementById('st-step-counter'),
        progressFill:      document.getElementById('st-progress-fill'),
        context:           document.getElementById('st-context'),
        completedList:     document.getElementById('st-completed-list'),
        stepCardSlot:      document.getElementById('st-step-card-slot'),
        scoreTracker:      document.getElementById('st-score-tracker'),
        resultSlot:        document.getElementById('st-result-slot'),
        viewDeps:          document.getElementById('st-view-deps'),
        depsBackBtn:       document.getElementById('st-deps-back'),
        depsTitle:         document.getElementById('st-deps-title'),
        depsGraphSlot:     document.getElementById('st-deps-graph-slot'),
        depsGoalBtnSlot:   document.getElementById('st-deps-goal-btn-slot'),
        viewExpl:          document.getElementById('st-view-expl'),
        explBackBtn:       document.getElementById('st-expl-back'),
        explTitle:         document.getElementById('st-expl-title'),
        explBody:          document.getElementById('st-expl-body'),
        infoOverlay:       document.getElementById('st-info-overlay'),
        infoHeader:        document.getElementById('st-info-header'),
        infoDesc:          document.getElementById('st-info-desc'),
        infoPreview:       document.getElementById('st-info-preview'),
        infoStars:         document.getElementById('st-info-stars')
    };

    // Guard: fail loudly if the HTML is old-style (scaffold missing). Prevents
    // silent breakage during the Sept-2026 deploy transition.
    if (!els.viewTree || !els.viewExercise || !els.viewDeps || !els.viewExpl || !els.infoOverlay || !els.layers || !els.stepCardSlot) {
        document.body.innerHTML = '<p style="color:red;padding:20px">Fout: skilltree HTML is verouderd. Deze versie van skilltree-ui.js verwacht de volledige scaffold (zie <code>_wiskundevaardigheden-template.html</code>). HTML en JS moeten samen worden bijgewerkt.</p>';
        return;
    }

    // ── UI-only state (DOM-lifecycle) ─────────────────────────
    var advanceTimer = null;
    var lastFinishedSkillId = null;
    var depSkillId = null;
    var depSubgraph = null;
    var depHistory = [];
    var savedDepState = null;
    var goalJustAchieved = null;

    // ════════════════════════════════════════════════════════════
    // Tree view
    // ════════════════════════════════════════════════════════════

    function getCardDisplayState(skillId) {
        var skill = null;
        var visible = engine.getVisibleSkills();
        for (var i = 0; i < visible.length; i++) {
            if (visible[i].id === skillId) { skill = visible[i]; break; }
        }
        if (!skill) return null;

        var stars = engine.getStars();
        var layerColors = engine.getLayerColors();
        var layerNames = engine.getLayerNames();
        var newArr = engine.getNewSkills();
        var lc = layerColors[skill.layer] || layerColors[0];
        var starCount = stars[skill.id] || 0;
        var hasGen = engine.hasGenerator(skill.id);
        var ready = engine.prereqsDone(skill.id);
        var missing = engine.getMissingPrereqs(skill.id);
        var isNew = false;
        for (var n = 0; n < newArr.length; n++) { if (newArr[n] === skill.id) { isNew = true; break; } }
        var isMastered = starCount === 5;
        var isLastLayer = skill.layer === layerNames.length - 1;
        var hasDeps = skill.needs.length > 0;

        var boxShadow = starCount >= 1 ? '0 0 12px ' + lc.glow :
                        isNew ? '0 0 10px ' + lc.glow : 'none';
        var borderStyle = isMastered ? '2px solid #fbbf24' :
                          (isNew && starCount === 0) ? '1.5px solid ' + lc.text :
                          '1px solid ' + lc.text + '40';
        var strokeColor = isMastered ? '#fbbf24' : lc.text + '60';
        var strokeWidth = isMastered ? 2 : 1;

        var classes = 'st-skill-card';
        if (!ready && starCount === 0) classes += ' st-locked';
        if (isMastered) classes += ' st-mastered-5';
        if (isNew && starCount === 0) classes += ' st-new-skill';

        return {
            id: skill.id, name: skill.name, layer: skill.layer,
            starCount: starCount, hasGenerator: hasGen, hasDeps: hasDeps,
            ready: ready, missing: missing, isNew: isNew, isMastered: isMastered,
            isLastLayer: isLastLayer,
            bg: lc.bg, text: lc.text, glow: lc.glow,
            borderStyle: borderStyle, boxShadow: boxShadow,
            strokeColor: strokeColor, strokeWidth: strokeWidth,
            classes: classes
        };
    }

    function renderLegend() {
        // Only the view-toggle label needs updating per state; the rest of the
        // legend (info/deps chips, theme toggle) is static in the HTML scaffold.
        if (els.viewToggleBtn) {
            var viewMode = engine.getViewMode();
            els.viewToggleBtn.textContent = viewMode === 'module' ? '\u00A7 Paragraaf' : '\u25A6 Module';
        }
    }

    function renderHeader() {
        // Title lives in HTML (hardcoded per paragraaf). JS only writes the
        // progress numbers into the stat-tile slots.
        var progress = engine.getProgress();
        if (els.statMasteredVal) els.statMasteredVal.textContent = progress.mastered;
        if (els.statTotalVal)    els.statTotalVal.textContent    = progress.total;
        if (els.statStarsVal)    els.statStarsVal.textContent    = progress.totalStars;
        if (els.statMaxStarsVal) els.statMaxStarsVal.textContent = progress.maxStars;
    }

    function renderGoalBanner() {
        var goals = engine.getGoals();
        var hasActive = goals.active.length > 0;
        var hasAchieved = goals.achieved.length > 0;

        if (!hasActive && !hasAchieved) {
            els.goalBannerSlot.innerHTML = '<div class="st-goal-banner"><div class="st-goal-prompt">\uD83C\uDFAF Kies een doel via het afhankelijkheden-menu van een vaardigheid</div></div>';
            return;
        }

        var html = '<div class="st-goal-banner">';
        html += '<div class="st-goal-section-title">\uD83C\uDFAF Doelen</div>';

        for (var i = 0; i < goals.active.length; i++) {
            var goal = goals.active[i];
            var path = engine.getGoalPath(goal.id);
            if (!path) continue;

            var pct = path.totalPrereqs > 0 ? Math.round((path.fullyMastered / path.totalPrereqs) * 100) : 0;

            html += '<div class="st-goal-card">';
            html += '<button class="st-goal-remove" data-goal-id="' + goal.id + '" type="button">\u2715</button>';
            html += '<div class="st-goal-name"><span class="st-goal-name-id">' + esc(goal.id) + '</span>' + esc(path.goalName) + '</div>';
            html += '<div class="st-goal-bar"><div class="st-goal-bar-fill" style="width:' + pct + '%"></div></div>';
            html += '<div class="st-goal-info"><span>' + path.fullyMastered + '/' + path.totalPrereqs + ' stappen</span><span>' + pct + '%</span></div>';

            if (path.orderedPath && path.orderedPath.length > 0) {
                html += '<div class="st-goal-path">';
                for (var pi = 0; pi < path.orderedPath.length; pi++) {
                    var step = path.orderedPath[pi];
                    var stepClass = 'st-goal-step';
                    if (step.done) stepClass += ' st-goal-step-done';
                    else if (step.actionable) stepClass += ' st-goal-step-actionable';
                    if (step.id === goal.id) stepClass += ' st-goal-step-target';

                    var actionable = step.actionable && engine.hasGenerator(step.id);
                    if (actionable) {
                        html += '<button class="' + stepClass + '" data-goal-start="' + step.id + '" type="button">';
                    } else {
                        html += '<span class="' + stepClass + '">';
                    }
                    html += '<span class="st-goal-step-id">' + esc(step.id) + '</span>';
                    html += '<span class="st-goal-step-name">' + esc(step.name) + '</span>';
                    if (step.done) html += '<span class="st-goal-step-check">\u2713</span>';
                    else html += '<span class="st-goal-step-stars">' + step.stars + '/3</span>';
                    html += actionable ? '</button>' : '</span>';

                    if (pi < path.orderedPath.length - 1) {
                        html += '<span class="st-goal-step-arrow">\u2192</span>';
                    }
                }
                html += '</div>';
            }
            html += '</div>';
        }

        for (var a = 0; a < goals.achieved.length; a++) {
            var badge = goals.achieved[a];
            html += '<div class="st-goal-card st-goal-card-achieved">';
            html += '<div class="st-goal-name"><span class="st-goal-achieved-text">\uD83C\uDFC6 ' + esc(badge.id) + ' \u00B7 ' + esc(skillNameById(badge.id)) + ' (behaald!)</span></div>';
            html += '</div>';
        }

        html += '</div>';
        els.goalBannerSlot.innerHTML = html;
    }

    function renderLayers() {
        var layerNames = engine.getLayerNames();
        var layerColors = engine.getLayerColors();
        var visible = engine.getVisibleSkills();

        var goals = engine.getGoals();
        var goalPathSet = {};
        var goalSkillSet = {};
        for (var gi = 0; gi < goals.active.length; gi++) {
            var gid = goals.active[gi].id;
            goalSkillSet[gid] = true;
            var parPath = engine.getGoalPathForParagraph(gid);
            if (parPath) {
                for (var pi = 0; pi < parPath.visibleOnPath.length; pi++) {
                    goalPathSet[parPath.visibleOnPath[pi]] = true;
                }
            }
        }

        var html = '';
        for (var li = 0; li < layerNames.length; li++) {
            var lc = layerColors[li];
            var layerSkills = [];
            for (var j = 0; j < visible.length; j++) {
                if (visible[j].layer === li) layerSkills.push(visible[j]);
            }
            if (layerSkills.length === 0) continue;

            html += '<div class="st-layer" data-layer="' + li + '">';
            html += '<div class="st-layer-title">';
            if (li === layerNames.length - 1) html += '<span>\uD83C\uDFC6</span>';
            html += 'Laag ' + (li + 1) + ' \u2014 ' + esc(layerNames[li]);
            html += '</div>';
            html += '<div class="st-layer-grid">';

            for (var k = 0; k < layerSkills.length; k++) {
                var cs = getCardDisplayState(layerSkills[k].id);
                if (!cs) continue;

                var cardClasses = cs.classes;
                if (goalPathSet[cs.id] && !goalSkillSet[cs.id]) cardClasses += ' st-on-goal-path';
                if (goalSkillSet[cs.id]) cardClasses += ' st-goal-skill';

                html += '<button class="' + cardClasses + '"';
                html += ' data-skill="' + cs.id + '"';
                html += ' data-layer="' + cs.layer + '"';
                if (!cs.hasGenerator) html += ' disabled';
                html += ' type="button">';

                html += '<div class="st-skill-id"><span>' + esc(cs.id) + '</span>';
                html += '<span class="st-skill-icons">';
                if (goalPathSet[cs.id]) html += '<span class="st-goal-icon" title="Op doelpad">\uD83C\uDFAF</span>';
                html += '<span class="st-info-btn" data-info-skill="' + cs.id + '" title="Meer informatie">' + ICON.info + '</span>';
                if (cs.hasDeps) {
                    html += '<span class="st-dep-btn" data-dep-skill="' + cs.id + '" title="Toon afhankelijkheden">' + ICON.tree + '</span>';
                }
                html += '</span>';
                html += '</div>';
                if (!cs.ready && cs.missing.length > 0 && cs.starCount === 0) {
                    html += '<div class="st-prereq-hint" title="Tip: oefen eerst ' + cs.missing.join(', ') + '">\uD83D\uDCA1 ' + cs.missing.join(', ') + '</div>';
                }
                html += '<div>' + (cs.isLastLayer ? '\uD83C\uDFC6 ' : '') + esc(cs.name) + '</div>';
                // Always render a 5-star row: earned stars highlighted, rest greyed.
                html += '<div class="st-stars">' + starsHTML(cs.starCount, 5) + '</div>';
                if (cs.starCount === 0) {
                    var actionVerb = ('ontouchstart' in window) ? 'Tap' : 'Klik';
                    html += '<div class="st-tap-hint">' + actionVerb + ' om te oefenen \u2192</div>';
                }
                html += '</button>';
            }
            html += '</div></div>';
        }
        els.layers.innerHTML = html;
    }

    function renderTree() {
        renderLegend();
        renderHeader();
        renderGoalBanner();
        renderLayers();
    }

    function showTreeView() {
        els.viewExercise.hidden = true;
        els.viewDeps.hidden = true;
        els.viewExpl.hidden = true;
        els.viewTree.hidden = false;
        renderTree();

        if (savedDepState) {
            depHistory = savedDepState.history;
            depSkillId = savedDepState.skillId;
            savedDepState = null;
            openDependencyOverlay(depSkillId, true);
        }
    }

    // ── Tree event delegation (wired once) ────────────────────
    els.viewTree.addEventListener('click', function (e) {
        var t = e.target;

        var infoBtn = t.closest && t.closest('.st-info-btn');
        if (infoBtn) {
            e.stopPropagation();
            openInfoPopup(infoBtn.getAttribute('data-info-skill'));
            return;
        }

        var depBtn = t.closest && t.closest('.st-dep-btn');
        if (depBtn) {
            e.stopPropagation();
            openDependencyOverlay(depBtn.getAttribute('data-dep-skill'));
            return;
        }

        var card = t.closest && t.closest('.st-skill-card');
        if (card && !card.disabled) {
            startSkill(card.getAttribute('data-skill'));
            return;
        }

        var goalRemove = t.closest && t.closest('.st-goal-remove');
        if (goalRemove) {
            engine.removeGoal(goalRemove.getAttribute('data-goal-id'));
            renderTree();
            return;
        }

        var goalStart = t.closest && t.closest('[data-goal-start]');
        if (goalStart) {
            startSkill(goalStart.getAttribute('data-goal-start'));
            return;
        }

        if (t.id === 'st-view-toggle' || (t.closest && t.closest('#st-view-toggle'))) {
            var current = engine.getViewMode();
            engine.setViewMode(current === 'module' ? 'paragraph' : 'module');
            renderTree();
            return;
        }

        if (t.id === 'st-theme-toggle' || (t.closest && t.closest('#st-theme-toggle'))) {
            var cur = document.documentElement.getAttribute('data-theme') || 'light';
            applyTheme(cur === 'dark' ? 'light' : 'dark');
            return;
        }

        if (t === els.resetBtn || (t.closest && t.closest('#st-reset'))) {
            if (confirm('Weet je zeker dat je alle voortgang wilt resetten?')) {
                engine.resetStars();
                renderTree();
            }
        }
    });

    // ════════════════════════════════════════════════════════════
    // Exercise view
    // ════════════════════════════════════════════════════════════

    function showExerciseView() {
        els.viewTree.hidden = true;
        els.viewDeps.hidden = true;
        els.viewExpl.hidden = true;
        els.viewExercise.hidden = false;
    }

    function startSkill(skillId) {
        if (!engine.hasGenerator(skillId)) return;
        var ex = engine.startExercise(skillId);
        if (!ex) return;
        showExerciseView();
        mountExerciseShell();
        renderStepCard();
        focusInput();
    }

    function returnToTree() {
        if (advanceTimer) { clearTimeout(advanceTimer); advanceTimer = null; }
        showTreeView();
    }

    function mountExerciseShell() {
        var state = engine.getExerciseState();
        if (!state) { returnToTree(); return; }

        // Populate the pre-existing exercise scaffold (see HTML template).
        els.exerciseRoot.setAttribute('data-layer', String(state.skillLayer));
        els.exSkillId.textContent   = state.skillId;
        els.exSkillName.textContent = state.skillName;
        els.context.textContent     = state.context;

        // Reveal active-exercise sections, hide the result slot.
        els.stepCardSlot.hidden  = false;
        els.scoreTracker.hidden  = false;
        els.resultSlot.hidden    = true;
        els.resultSlot.innerHTML = '';

        renderProgressBar(state, null);
        renderCompletedList(state);
    }

    function renderProgressBar(state, feedback) {
        var pct = ((state.currentStepIdx + (feedback === 'correct' ? 1 : 0)) / state.totalSteps) * 100;
        if (els.progressFill) els.progressFill.style.width = pct + '%';
        if (els.stepCounter)  els.stepCounter.textContent = 'Stap ' + (state.currentStepIdx + 1) + '/' + state.totalSteps;
    }

    function renderCompletedList(state) {
        if (!els.completedList) return;
        var html = '';
        for (var i = 0; i < state.completedSteps.length; i++) {
            var cs = state.completedSteps[i];
            html += '<div class="st-completed-step">';
            html += '<div class="st-cs-label">\u2713 Stap ' + (i + 1) + ': ' + esc(cs.q) + '</div>';
            html += '<div class="st-cs-answer">Antwoord: ' + cs.a + '</div>';
            html += '</div>';
        }
        els.completedList.innerHTML = html;
    }

    function renderStepCard(opts) {
        opts = opts || {};
        var state = engine.getExerciseState();
        if (!state) { returnToTree(); return; }

        var feedback = opts.feedback || null;          // null | 'correct' | 'wrong'
        var showHint = !!opts.showHint;
        var showExpl = !!opts.showExpl || feedback === 'correct';
        var mcSelected = opts.mcSelected == null ? -1 : opts.mcSelected;
        var orderPlaced = opts.orderPlaced || [];
        var errorSelected = opts.errorSelected == null ? -1 : opts.errorSelected;
        var inputValue = opts.inputValue == null ? '' : opts.inputValue;

        var stepMode = state.currentStep.mode || 'numeric';
        var stepClass = 'st-step-card';
        if (feedback === 'correct') stepClass += ' st-correct';
        if (feedback === 'wrong') stepClass += ' st-wrong';

        var html = '<div class="' + stepClass + '" id="st-step-card" data-mode="' + stepMode + '">';
        html += '<p class="st-question">' + esc(state.currentStep.q) + '</p>';

        if (stepMode === 'mc') {
            html += '<div class="st-mc-grid">';
            for (var oi = 0; oi < state.currentStep.options.length; oi++) {
                var optClass = 'st-mc-option';
                var optDisabled = '';
                if (feedback === 'correct') {
                    optClass += (oi === state.currentStep.correctIdx) ? ' st-mc-correct' : ' st-mc-faded';
                    optDisabled = ' disabled';
                } else if (feedback === 'wrong' && mcSelected === oi) {
                    optClass += ' st-mc-wrong';
                }
                html += '<button class="' + optClass + '" data-mc-idx="' + oi + '" type="button"' + optDisabled + '>' + esc(String(state.currentStep.options[oi])) + '</button>';
            }
            html += '</div>';
        } else if (stepMode === 'order') {
            html += '<div class="st-order-bank">';
            for (var bi = 0; bi < state.currentStep.blocks.length; bi++) {
                var placed = orderPlaced.indexOf(bi) !== -1;
                html += '<div class="st-order-block' + (placed ? ' st-placed' : '') + '" data-block-idx="' + bi + '">' + esc(state.currentStep.blocks[bi]) + '</div>';
            }
            html += '</div>';
            html += '<div class="st-order-chain">';
            for (var ci = 0; ci < orderPlaced.length; ci++) {
                if (ci > 0) html += '<div class="st-order-arrow">\u2193</div>';
                html += '<div class="st-order-placed" data-chain-idx="' + ci + '">' + (ci + 1) + '. ' + esc(state.currentStep.blocks[orderPlaced[ci]]) + '</div>';
            }
            html += '</div>';
            if (orderPlaced.length === state.currentStep.blocks.length && feedback !== 'correct') {
                html += '<button class="st-check-btn" id="st-order-check" type="button">Controleer volgorde</button>';
            }
        } else if (stepMode === 'error') {
            html += '<div class="st-error-cards">';
            for (var ei = 0; ei < state.currentStep.shownSteps.length; ei++) {
                var errClass = 'st-error-card';
                var errAttr = '';
                if (feedback === 'correct') {
                    errClass += state.currentStep.shownSteps[ei].isError ? ' st-error-found' : ' st-error-ok';
                    errAttr = ' data-disabled="true"';
                } else if (feedback === 'wrong' && errorSelected === ei) {
                    errClass += ' st-error-wrong';
                }
                html += '<div class="' + errClass + '" data-error-idx="' + ei + '"' + errAttr + '>';
                html += '<span class="st-error-num">Stap ' + (ei + 1) + '</span> ' + esc(state.currentStep.shownSteps[ei].text);
                html += '</div>';
            }
            html += '</div>';
        } else {
            html += '<div class="st-input-row">';
            var dis = feedback === 'correct' ? ' disabled' : '';
            html += '<button class="st-minus-btn" id="st-toggle-minus" type="button"' + dis + '>\u00B1</button>';
            html += '<input class="st-answer-input" id="st-input" type="text" inputmode="decimal" value="' + esc(inputValue) + '"' + dis + ' placeholder="Antwoord (gebruik \u00B1 voor negatief)">';
            html += '<button class="st-check-btn" id="st-check" type="button"' + dis + '>Check</button>';
            html += '</div>';
        }

        if (feedback === 'wrong' && stepMode === 'numeric') {
            html += '<p class="st-wrong-msg">\u2717 Niet juist. Probeer het opnieuw' + (!showHint ? ' of gebruik een hint.' : '.') + '</p>';
        }

        html += '<div class="st-help-row">';
        if (feedback !== 'correct' && !showHint) {
            html += '<button class="st-hint-btn" id="st-hint" type="button">' + ICON.lightbulb + ' Hint</button>';
        }
        if (engine.hasExplanation(state.skillId)) {
            html += '<button class="st-explanation-btn" id="st-explanation" type="button">' + ICON.book + ' Uitleg</button>';
        }
        html += '</div>';
        if (showHint) {
            html += '<div class="st-hint-box">\uD83D\uDCA1 ' + esc(state.currentStep.hint) + '</div>';
        }
        if (showExpl) {
            html += '<div class="st-expl-box">\u2713 ' + esc(state.currentStep.expl) + '</div>';
        }
        html += '</div>';

        els.stepCardSlot.innerHTML = html;
        wireStepCard({
            feedback: feedback, showHint: showHint, showExpl: showExpl,
            mcSelected: mcSelected, orderPlaced: orderPlaced, errorSelected: errorSelected,
            inputValue: inputValue
        });

        renderProgressBar(state, feedback);
        renderScoreTracker(state);
    }

    function wireStepCard(ctx) {
        var card = document.getElementById('st-step-card');
        if (!card) return;
        var mode = card.getAttribute('data-mode');

        // Delegated click handler covers MC/order/error/hint/expl/check/minus buttons.
        card.addEventListener('click', function (e) {
            if (ctx.feedback === 'correct') {
                // Still allow explanation button after a correct step
                if (e.target.closest && e.target.closest('#st-explanation')) {
                    var st = engine.getExerciseState();
                    if (st) openExplanationOverlay(st.skillId);
                }
                return;
            }
            var t = e.target;

            if (mode === 'mc') {
                var mcBtn = t.closest && t.closest('.st-mc-option');
                if (mcBtn) {
                    var mcIdx = parseInt(mcBtn.getAttribute('data-mc-idx'), 10);
                    doCheck(mcIdx, { mcSelected: mcIdx });
                    return;
                }
            }

            if (mode === 'order') {
                var block = t.closest && t.closest('.st-order-block');
                if (block && !block.classList.contains('st-placed')) {
                    var idx = parseInt(block.getAttribute('data-block-idx'), 10);
                    ctx.orderPlaced = ctx.orderPlaced.concat([idx]);
                    renderStepCard({ orderPlaced: ctx.orderPlaced });
                    return;
                }
                var chain = t.closest && t.closest('.st-order-placed');
                if (chain) {
                    var ci = parseInt(chain.getAttribute('data-chain-idx'), 10);
                    var next = ctx.orderPlaced.slice();
                    next.splice(ci, 1);
                    renderStepCard({ orderPlaced: next });
                    return;
                }
                if (t.id === 'st-order-check') {
                    doCheck(ctx.orderPlaced, { orderPlaced: ctx.orderPlaced });
                    return;
                }
            }

            if (mode === 'error') {
                var errCard = t.closest && t.closest('.st-error-card');
                if (errCard && !errCard.hasAttribute('data-disabled')) {
                    var eIdx = parseInt(errCard.getAttribute('data-error-idx'), 10);
                    doCheck(eIdx, { errorSelected: eIdx });
                    return;
                }
            }

            if (t.id === 'st-toggle-minus' || (t.closest && t.closest('#st-toggle-minus'))) {
                var input = document.getElementById('st-input');
                var v = input ? input.value : ctx.inputValue;
                v = v.startsWith('-') ? v.slice(1) : '-' + v;
                renderStepCard({ inputValue: v });
                focusInput();
                return;
            }

            if (t.id === 'st-check' || (t.closest && t.closest('#st-check'))) {
                var inp = document.getElementById('st-input');
                var val = inp ? inp.value : ctx.inputValue;
                doCheck(val, { inputValue: val });
                return;
            }

            if (t.id === 'st-hint' || (t.closest && t.closest('#st-hint'))) {
                engine.useHint();
                renderStepCard({
                    feedback: ctx.feedback,
                    showHint: true,
                    showExpl: ctx.showExpl,
                    mcSelected: ctx.mcSelected,
                    orderPlaced: ctx.orderPlaced,
                    errorSelected: ctx.errorSelected,
                    inputValue: (document.getElementById('st-input') || {}).value || ctx.inputValue
                });
                focusInput();
                return;
            }

            if (t.id === 'st-explanation' || (t.closest && t.closest('#st-explanation'))) {
                var stE = engine.getExerciseState();
                if (stE) openExplanationOverlay(stE.skillId);
            }
        });

        // Keyboard: Enter submits numeric input. Input event clears wrong feedback.
        var inp = document.getElementById('st-input');
        if (inp) {
            inp.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    doCheck(inp.value, { inputValue: inp.value });
                }
            });
            inp.addEventListener('input', function () {
                if (ctx.feedback === 'wrong') {
                    card.classList.remove('st-wrong');
                    var wrongMsg = card.querySelector('.st-wrong-msg');
                    if (wrongMsg) wrongMsg.remove();
                }
            });
        }
    }

    function renderScoreTracker(state) {
        if (!els.scoreTracker) return;
        var penalty = state.errors + state.hints;
        var previewStars = penalty === 0 ? 3 : penalty <= 2 ? 2 : 1;
        var html = '<span>Fouten: ' + state.errors + '</span>';
        if (state.streak >= 2) {
            html += '<span class="st-streak">\uD83D\uDD25 ' + state.streak + ' op rij!</span>';
        } else {
            html += '<span>Hints: ' + state.hints + '</span>';
        }
        html += '<span class="' + (penalty === 0 ? 'st-score-perfect' : '') + '">+' + previewStars + ' \u2605</span>';
        els.scoreTracker.innerHTML = html;
    }

    function doCheck(answer, ctx) {
        ctx = ctx || {};
        var result = engine.checkAnswer(answer);

        if (result.correct) {
            if (result.isLastStep) {
                var fr = engine.finishExercise();
                if (fr) {
                    lastFinishedSkillId = fr.skillId;
                    var achieved = engine.checkGoalCompletion();
                    goalJustAchieved = achieved.length > 0 ? achieved : null;
                    mountResult(fr);
                }
            } else {
                renderStepCard({
                    feedback: 'correct', showExpl: true,
                    mcSelected: ctx.mcSelected, orderPlaced: ctx.orderPlaced,
                    errorSelected: ctx.errorSelected, inputValue: ctx.inputValue
                });
                if (advanceTimer) clearTimeout(advanceTimer);
                advanceTimer = setTimeout(function () {
                    advanceTimer = null;
                    engine.nextStep();
                    renderStepCard();
                    var st = engine.getExerciseState();
                    if (st) renderCompletedList(st);
                    focusInput();
                }, 1200);
            }
        } else {
            renderStepCard({
                feedback: 'wrong',
                mcSelected: ctx.mcSelected, orderPlaced: ctx.orderPlaced,
                errorSelected: ctx.errorSelected, inputValue: ctx.inputValue
            });
            focusInput();
        }
    }

    function focusInput() {
        setTimeout(function () {
            var inp = document.getElementById('st-input');
            if (inp) inp.focus();
        }, 50);
    }

    // ════════════════════════════════════════════════════════════
    // Result view (inline inside exercise panel)
    // ════════════════════════════════════════════════════════════

    function spawnConfetti(container) {
        var colors = ['#fbbf24', '#22c55e', '#3b82f6', '#ef4444', '#a855f7', '#f97316'];
        for (var i = 0; i < 40; i++) {
            var span = document.createElement('span');
            span.className = 'st-confetti-piece';
            span.style.left = Math.random() * 100 + '%';
            span.style.background = colors[Math.floor(Math.random() * colors.length)];
            span.style.animationDelay = (Math.random() * 0.6) + 's';
            span.style.animationDuration = (1.2 + Math.random() * 1.0) + 's';
            span.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
            container.appendChild(span);
        }
    }

    function mountResult(fr) {
        var isMastery = fr.newTotal === 5 && fr.improved;
        var msg = isMastery ? 'Meester! \uD83C\uDFC6' :
                  fr.earned === 3 ? 'Perfect! \uD83C\uDFAF' :
                  fr.earned === 2 ? 'Goed gedaan!' : 'Gehaald!';
        var details = '';
        if (fr.errors > 0) details += fr.errors + ' fout' + (fr.errors > 1 ? 'en' : '');
        if (fr.errors > 0 && fr.hints > 0) details += ', ';
        if (fr.hints > 0) details += fr.hints + ' hint' + (fr.hints > 1 ? 's' : '') + ' gebruikt';
        if (fr.errors === 0 && fr.hints === 0) details = 'Zonder fouten of hints!';

        var html = '<div class="st-result-card' + (isMastery ? ' st-mastery-card' : '') + '">';
        if (isMastery) html += '<div class="st-confetti-container" id="st-confetti"></div>';
        html += '<div class="st-result-stars">' + starsHTML(fr.newTotal, 5) + '</div>';
        html += '<p class="st-result-message">' + esc(msg) + '</p>';
        html += '<p class="st-result-details">' + esc(details) + '</p>';
        if (fr.improved) {
            html += '<p class="st-result-progress">+' + fr.earned + ' \u2605 \u2192 ' + fr.newTotal + '/5 sterren</p>';
        } else {
            html += '<p class="st-result-progress">' + fr.newTotal + '/5 sterren (al behaald)</p>';
        }
        if (fr.newTotal === 4 && fr.improved) {
            html += '<p class="st-near-miss">Nog \u00e9\u00e9n ster voor de gouden rand \uD83C\uDFC6 Doe het foutloos!</p>';
        }

        html += '<div class="st-result-buttons">';
        html += '<button class="st-btn-back" id="st-result-back" type="button">' + ICON.arrowLeft + ' Overzicht</button>';
        if (fr.newTotal < 5) {
            html += '<button class="st-btn-retry" id="st-result-retry" type="button">' + ICON.refresh + ' Opnieuw</button>';
        }
        var nextSkill = engine.getNextSkill(fr.skillId);
        if (nextSkill) {
            html += '<button class="st-btn-next" id="st-result-next" data-skill="' + nextSkill.id + '" type="button">Volgende \u2192</button>';
        }
        html += '</div>';
        html += '</div>';

        var activeGoals = engine.getGoals().active;
        for (var gpi = 0; gpi < activeGoals.length; gpi++) {
            if (!engine.isOnGoalPath(fr.skillId)) continue;
            var gPath = engine.getGoalPath(activeGoals[gpi].id);
            if (!gPath) continue;
            var gPct = gPath.totalPrereqs > 0 ? Math.round((gPath.fullyMastered / gPath.totalPrereqs) * 100) : 0;
            html += '<div class="st-result-goal">';
            html += '<div class="st-result-goal-title">\uD83C\uDFAF Doel: ' + esc(gPath.goalName) + '</div>';
            html += '<div class="st-goal-bar"><div class="st-goal-bar-fill" style="width:' + gPct + '%"></div></div>';
            html += '<div class="st-goal-info"><span>' + gPath.fullyMastered + '/' + gPath.totalPrereqs + ' stappen</span><span>' + gPct + '%</span></div>';
            if (gPath.nextActionable.length > 0) {
                var nId = gPath.nextActionable[0];
                html += '<div class="st-result-goal-next">Volgende stap: ' + esc(nId) + ' \u2014 ' + esc(skillNameById(nId)) + '</div>';
            }
            html += '</div>';
            break;
        }

        if (goalJustAchieved && goalJustAchieved.length > 0) {
            for (var agi = 0; agi < goalJustAchieved.length; agi++) {
                html += '<div class="st-goal-achieved-card">';
                html += '<div class="st-confetti-container" id="st-goal-confetti"></div>';
                html += '<div class="st-goal-achieved-title">\uD83C\uDFC6 Doel bereikt!</div>';
                html += '<div class="st-goal-achieved-name">' + esc(skillNameById(goalJustAchieved[agi])) + '</div>';
                html += '<button class="st-btn-back" id="st-goal-achieved-ok" type="button">Bekijk je badges \u2192</button>';
                html += '</div>';
            }
        }

        // Populate the result slot; hide the active-exercise chrome.
        els.resultSlot.innerHTML = html;
        els.resultSlot.hidden   = false;
        els.stepCardSlot.hidden = true;
        els.scoreTracker.hidden = true;

        if (isMastery) {
            var cEl = document.getElementById('st-confetti');
            if (cEl) spawnConfetti(cEl);
        }
        if (goalJustAchieved) {
            var gcEl = document.getElementById('st-goal-confetti');
            if (gcEl) spawnConfetti(gcEl);
        }

        setTimeout(function () {
            var starEls = els.resultSlot.querySelectorAll('.st-result-stars .st-star-on');
            for (var i = 0; i < starEls.length; i++) {
                (function (el, delay) {
                    setTimeout(function () { el.style.animation = 'starPop 0.4s ease both'; }, delay);
                })(starEls[i], i * 150);
            }
        }, 50);

        document.getElementById('st-result-back').addEventListener('click', function () {
            goalJustAchieved = null;
            returnToTree();
        });
        var retryBtn = document.getElementById('st-result-retry');
        if (retryBtn) {
            retryBtn.addEventListener('click', function () {
                goalJustAchieved = null;
                startSkill(lastFinishedSkillId);
            });
        }
        var nextBtn = document.getElementById('st-result-next');
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                var sid = nextBtn.getAttribute('data-skill');
                goalJustAchieved = null;
                startSkill(sid);
            });
        }
        var goalOkBtn = document.getElementById('st-goal-achieved-ok');
        if (goalOkBtn) {
            goalOkBtn.addEventListener('click', function () {
                goalJustAchieved = null;
                returnToTree();
            });
        }
    }

    // ════════════════════════════════════════════════════════════
    // Dependency overlay (transient; mounted to body)
    // ════════════════════════════════════════════════════════════

    function getParentAvgX(nodeId, edges, nodePos) {
        var sum = 0, count = 0;
        for (var i = 0; i < edges.length; i++) {
            if (edges[i].from === nodeId && nodePos[edges[i].to]) {
                sum += nodePos[edges[i].to].cx || 0;
                count++;
            }
        }
        return count > 0 ? sum / count : 0;
    }

    function openDependencyOverlay(skillId, restoring) {
        depSubgraph = engine.getDependencySubgraph(skillId);
        if (!depSubgraph) return;
        if (!restoring && depSkillId) {
            depHistory.push(depSkillId);
        }
        depSkillId = skillId;
        showDepsView();
        renderDependencyOverlay();
    }

    function goBackDependency() {
        if (depHistory.length > 0) {
            depSkillId = depHistory.pop();
            depSubgraph = engine.getDependencySubgraph(depSkillId);
            renderDependencyOverlay();
        } else {
            closeDependencyOverlay();
        }
    }

    function closeDependencyOverlay() {
        depSkillId = null;
        depSubgraph = null;
        depHistory = [];
        els.depsGraphSlot.innerHTML = '';
        els.depsGoalBtnSlot.innerHTML = '';
        // If the deps view is currently the active one, return to tree.
        if (!els.viewDeps.hidden) showTreeView();
        document.removeEventListener('keydown', depEscHandler);
    }

    function showDepsView() {
        els.viewTree.hidden = true;
        els.viewExercise.hidden = true;
        els.viewExpl.hidden = true;
        els.viewDeps.hidden = false;
        document.addEventListener('keydown', depEscHandler);
    }

    function depEscHandler(e) {
        if (e.key === 'Escape') goBackDependency();
    }

    function renderDependencyOverlay() {
        if (!depSkillId || !depSubgraph) return;

        depSubgraph = engine.getDependencySubgraph(depSkillId);
        if (!depSubgraph) { depSkillId = null; return; }

        var layerColors = engine.getLayerColors();
        var stars = engine.getStars();
        var nodes = depSubgraph.nodes;
        var edges = depSubgraph.edges;

        var NODE_W = 120, NODE_H = 48, H_GAP = 14, V_GAP = 42, PAD = 14;

        var layerBuckets = {};
        for (var i = 0; i < nodes.length; i++) {
            var ly = nodes[i].layer;
            if (!layerBuckets[ly]) layerBuckets[ly] = [];
            layerBuckets[ly].push(nodes[i]);
        }

        var layerOrder = Object.keys(layerBuckets).map(Number).sort(function (a, b) { return b - a; });

        var nodePos = {};
        for (var li = 0; li < layerOrder.length; li++) {
            var bucket = layerBuckets[layerOrder[li]];
            if (li > 0) {
                bucket.sort(function (a, b) {
                    return getParentAvgX(a.id, edges, nodePos) - getParentAvgX(b.id, edges, nodePos);
                });
            }
            for (var bi = 0; bi < bucket.length; bi++) {
                nodePos[bucket[bi].id] = { row: li, col: bi, rowSize: bucket.length };
            }
        }

        var maxCols = 1;
        for (var key in layerBuckets) {
            if (layerBuckets[key].length > maxCols) maxCols = layerBuckets[key].length;
        }
        var svgW = Math.max(320, maxCols * (NODE_W + H_GAP) - H_GAP + PAD * 2);
        var svgH = layerOrder.length * (NODE_H + V_GAP) - V_GAP + PAD * 2;

        for (var nid in nodePos) {
            var np = nodePos[nid];
            var rowW = np.rowSize * (NODE_W + H_GAP) - H_GAP;
            var startX = (svgW - rowW) / 2;
            np.x = startX + np.col * (NODE_W + H_GAP);
            np.y = PAD + np.row * (NODE_H + V_GAP);
            np.cx = np.x + NODE_W / 2;
            np.cy = np.y + NODE_H / 2;
        }

        var svg = '<svg class="st-dep-graph" viewBox="0 0 ' + svgW + ' ' + svgH + '" preserveAspectRatio="xMidYMin meet">';
        svg += '<defs><marker id="dep-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">';
        svg += '<path d="M0,0 L6,2 L0,4 Z" fill="#475569"/></marker></defs>';

        for (var ei = 0; ei < edges.length; ei++) {
            var fromPos = nodePos[edges[ei].from];
            var toPos = nodePos[edges[ei].to];
            if (!fromPos || !toPos) continue;
            var x1 = fromPos.cx, y1 = fromPos.y;
            var x2 = toPos.cx, y2 = toPos.y + NODE_H;
            var cp = V_GAP * 0.45;
            var d = 'M' + x1 + ',' + y1 + ' C' + x1 + ',' + (y1 - cp) + ' ' + x2 + ',' + (y2 + cp) + ' ' + x2 + ',' + y2;
            var prereqStars = stars[edges[ei].from] || 0;
            var edgeColor = prereqStars >= 1 ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.25)';
            svg += '<path class="st-dep-edge" d="' + d + '" stroke="' + edgeColor + '" marker-end="url(#dep-arrow)"/>';
        }

        for (var ni = 0; ni < nodes.length; ni++) {
            var node = nodes[ni];
            var pos = nodePos[node.id];
            if (!pos) continue;
            var cs = getCardDisplayState(node.id);
            var lc = layerColors[node.layer] || layerColors[0];
            var nodeStars = cs ? cs.starCount : (stars[node.id] || 0);
            var sColor = cs ? cs.strokeColor : (lc.text + '60');
            var sWidth = cs ? cs.strokeWidth : 1;
            var hasGen = cs ? cs.hasGenerator : false;
            var hasDeps = cs ? cs.hasDeps : (node.needs && node.needs.length > 0);
            var nodeBg = cs ? cs.bg : lc.bg;
            var nodeText = cs ? cs.text : lc.text;

            svg += '<g class="st-dep-node' + (hasGen ? '' : ' st-dep-node-disabled') + '" data-skill="' + node.id + '">';
            svg += '<rect x="' + pos.x + '" y="' + pos.y + '" width="' + NODE_W + '" height="' + NODE_H + '" rx="8" fill="' + nodeBg + '" stroke="' + sColor + '" stroke-width="' + sWidth + '"/>';
            svg += '<text x="' + (pos.x + 7) + '" y="' + (pos.y + 12) + '" fill="' + nodeText + '" font-size="8.5" font-weight="700" opacity="0.5" font-family="DM Sans, sans-serif">' + node.id + '</text>';

            var infoX = pos.x + NODE_W - (hasDeps ? 30 : 16);
            var infoY = pos.y + 3;
            svg += '<g class="st-dep-info-btn" data-info-skill="' + node.id + '" transform="translate(' + infoX + ',' + infoY + ')">';
            svg += '<rect x="-3" y="-3" width="18" height="18" fill="transparent"/>';
            svg += '<g transform="scale(0.5)" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.8">';
            svg += '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>';
            svg += '</g></g>';

            if (hasDeps) {
                var treeX = pos.x + NODE_W - 16;
                var treeY = pos.y + 3;
                svg += '<g class="st-dep-tree-btn" data-dep-skill="' + node.id + '" transform="translate(' + treeX + ',' + treeY + ')">';
                svg += '<rect x="-3" y="-3" width="18" height="18" fill="transparent"/>';
                svg += '<g transform="scale(0.5)" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.8">';
                svg += '<path d="M12 3v6"/><path d="M12 9l-5 5"/><path d="M12 9l5 5"/>';
                svg += '<circle cx="12" cy="3" r="1.5"/><circle cx="7" cy="14" r="1.5"/><circle cx="17" cy="14" r="1.5"/>';
                svg += '<path d="M7 15.5v3"/><path d="M17 15.5v3"/>';
                svg += '<circle cx="7" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/>';
                svg += '</g></g>';
            }

            var displayName = node.name.length > 20 ? node.name.substring(0, 18) + '\u2026' : node.name;
            svg += '<text x="' + pos.cx + '" y="' + (pos.y + 26) + '" fill="' + nodeText + '" font-size="9.5" font-weight="500" text-anchor="middle" font-family="DM Sans, sans-serif">' + esc(displayName) + '</text>';

            var starY = pos.y + NODE_H - 7;
            var starStartX = pos.cx - 19;
            for (var si = 0; si < 5; si++) {
                var starColor = si < nodeStars ? '#fbbf24' : '#334155';
                svg += '<text x="' + (starStartX + si * 9.5) + '" y="' + starY + '" fill="' + starColor + '" font-size="7.5" text-anchor="middle">\u2605</text>';
            }

            svg += '</g>';
        }
        svg += '</svg>';

        var rootNode = null;
        for (var ri = 0; ri < nodes.length; ri++) {
            if (nodes[ri].id === depSkillId) { rootNode = nodes[ri]; break; }
        }
        var title = rootNode ? rootNode.name : depSkillId;

        var goalBtn;
        if (engine.isAchievedGoal(depSkillId)) {
            goalBtn = '<button class="st-goal-set-btn" type="button" disabled>\uD83C\uDFC6 Doel al behaald</button>';
        } else if (engine.isGoal(depSkillId)) {
            goalBtn = '<button class="st-goal-set-btn" type="button" disabled>\uD83C\uDFAF Dit is al een doel</button>';
        } else if (engine.getGoals().active.length >= 2) {
            goalBtn = '<button class="st-goal-set-btn" type="button" disabled>Maximaal 2 doelen \u2014 verwijder eerst een doel</button>';
        } else {
            goalBtn = '<button class="st-goal-set-btn" id="st-set-goal" type="button">\uD83C\uDFAF Stel in als doel</button>';
        }

        // Populate the in-scaffold view. Title + graph + goal button all go
        // into their dedicated slots; the legend lives in the HTML.
        els.depsTitle.textContent = 'Afhankelijkheden: ' + title;
        els.depsGraphSlot.innerHTML = svg;
        els.depsGoalBtnSlot.innerHTML = goalBtn;
    }

    // ════════════════════════════════════════════════════════════
    // Info popup (transient)
    // ════════════════════════════════════════════════════════════

    function infoEscHandler(e) {
        if (e.key === 'Escape') closeInfoPopup();
    }

    function closeInfoPopup() {
        els.infoOverlay.hidden = true;
        els.infoHeader.innerHTML = '';
        els.infoDesc.innerHTML = '';
        els.infoPreview.innerHTML = '';
        els.infoStars.innerHTML = '';
        document.removeEventListener('keydown', infoEscHandler);
    }

    function openInfoPopup(skillId) {
        var desc = engine.getSkillDescription(skillId);
        var preview = engine.generatePreview(skillId);
        var cs = getCardDisplayState(skillId);
        if (!cs) return;

        // Scope layer colour to the overlay so header pill uses --layer-accent.
        els.infoOverlay.setAttribute('data-layer', String(cs.layer));

        els.infoHeader.innerHTML =
            '<span class="st-info-skill-id">' + esc(cs.id) + '</span>' +
            '<span>' + esc(cs.name) + '</span>' +
            '<button class="st-info-close" id="st-info-close" type="button">\u2715</button>';

        if (desc) {
            els.infoDesc.textContent = desc;
            els.infoDesc.hidden = false;
        } else {
            els.infoDesc.hidden = true;
        }

        if (preview) {
            els.infoPreview.innerHTML =
                '<div class="st-info-preview-label">Voorbeeldvraag</div>' +
                '<div class="st-info-preview-context">' + esc(preview.context) + '</div>' +
                '<div class="st-info-preview-q">' + esc(preview.question) + '</div>';
            els.infoPreview.hidden = false;
        } else {
            els.infoPreview.hidden = true;
        }

        if (cs.starCount > 0) {
            els.infoStars.innerHTML = starsHTML(cs.starCount);
            els.infoStars.hidden = false;
        } else {
            els.infoStars.hidden = true;
        }

        els.infoOverlay.hidden = false;
        document.addEventListener('keydown', infoEscHandler);
    }

    // ════════════════════════════════════════════════════════════
    // Explanation overlay (transient)
    // ════════════════════════════════════════════════════════════

    // Remember which view the user came from so the back button restores it.
    var explReturnView = null;

    function explEscHandler(e) {
        if (e.key === 'Escape') closeExplanationOverlay();
    }

    function closeExplanationOverlay() {
        els.viewExpl.hidden = true;
        els.explBody.innerHTML = '';
        document.removeEventListener('keydown', explEscHandler);
        if (explReturnView === 'exercise') {
            els.viewExercise.hidden = false;
        } else {
            els.viewTree.hidden = false;
        }
        explReturnView = null;
    }

    function openExplanationOverlay(skillId) {
        var expl = engine.getExplanation(skillId);
        if (!expl) return;
        var cs = getCardDisplayState(skillId);
        var skillName = cs ? cs.name : skillId;

        var SECTION_LABELS = {
            uitleg:    'Uitleg',
            formule:   'Formule',
            voorbeeld: 'Voorbeeld',
            tip:       '\uD83D\uDCA1 Tip',
            valkuil:   '\u26A0 Valkuil',
            check:     '\u2714 Zelfcheck'
        };

        var body = '';
        for (var i = 0; i < expl.sections.length; i++) {
            var sec = expl.sections[i];
            var label = SECTION_LABELS[sec.type];
            if (!label) continue;
            if (sec.type === 'voorbeeld' && sec.title) label += ': ' + esc(sec.title);
            body += '<div class="st-expl-section st-expl-' + sec.type + '">';
            body += '<div class="st-expl-section-label">' + label + '</div>';
            if (sec.type === 'formule') {
                body += '<div class="st-expl-formula-box">' + formatExplText(sec.content) + '</div>';
            } else {
                body += '<div class="st-expl-text">' + formatExplText(sec.content) + '</div>';
            }
            body += '</div>';
        }

        els.explTitle.textContent = expl.title || skillName;
        els.explBody.innerHTML = body;

        // Remember where to go back to and show the expl view.
        explReturnView = els.viewExercise.hidden ? 'tree' : 'exercise';
        els.viewTree.hidden = true;
        els.viewExercise.hidden = true;
        els.viewDeps.hidden = true;
        els.viewExpl.hidden = false;
        els.viewExpl.scrollTop = 0;

        document.addEventListener('keydown', explEscHandler);
    }

    // ════════════════════════════════════════════════════════════
    // Init
    // ════════════════════════════════════════════════════════════

    // Wire the back-to-tree button once. The button itself lives in the
    // HTML scaffold, so its lifecycle matches the page, not the exercise.
    if (els.backBtn) {
        els.backBtn.addEventListener('click', function () {
            engine.abortExercise();
            returnToTree();
        });
    }

    // Deps view — back button + delegated clicks on the graph.
    if (els.depsBackBtn) {
        els.depsBackBtn.addEventListener('click', goBackDependency);
    }
    els.viewDeps.addEventListener('click', function (e) {
        var t = e.target;

        var infoBtn = t.closest && t.closest('.st-dep-info-btn');
        if (infoBtn) {
            e.stopPropagation();
            openInfoPopup(infoBtn.getAttribute('data-info-skill'));
            return;
        }

        var treeBtn = t.closest && t.closest('.st-dep-tree-btn');
        if (treeBtn) {
            e.stopPropagation();
            openDependencyOverlay(treeBtn.getAttribute('data-dep-skill'));
            return;
        }

        var gNode = t.closest && t.closest('.st-dep-node');
        if (gNode) {
            e.stopPropagation();
            var sid = gNode.getAttribute('data-skill');
            if (!sid || !engine.hasGenerator(sid)) return;
            savedDepState = { skillId: depSkillId, history: depHistory.slice() };
            depSkillId = null;
            depSubgraph = null;
            depHistory = [];
            els.depsGraphSlot.innerHTML = '';
            els.depsGoalBtnSlot.innerHTML = '';
            document.removeEventListener('keydown', depEscHandler);
            startSkill(sid);
            return;
        }

        if (t.id === 'st-set-goal' || (t.closest && t.closest('#st-set-goal'))) {
            engine.setGoal(depSkillId);
            closeDependencyOverlay();
            renderTree();
        }
    });

    // Explanation view — back button.
    if (els.explBackBtn) {
        els.explBackBtn.addEventListener('click', closeExplanationOverlay);
    }

    // Info popup — backdrop click + close button.
    if (els.infoOverlay) {
        els.infoOverlay.addEventListener('click', function (e) {
            if (e.target === els.infoOverlay) { closeInfoPopup(); return; }
            if (e.target.id === 'st-info-close' || (e.target.closest && e.target.closest('#st-info-close'))) {
                closeInfoPopup();
            }
        });
    }

    renderTree();

})();
