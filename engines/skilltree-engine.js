/**
 * SkillTreeEngine — Pure game logic for the skill tree (wiskundevaardigheden).
 * No DOM references. Works in both browser (<script>) and Node.js (require).
 *
 * Usage (browser):
 *   <script src="skilltree/base-elements.js"></script>
 *   <script src="skilltree/3.2.1.js"></script>
 *   <script src="skilltree-engine.js"></script>
 *   var engine = new SkillTreeEngine({ elements: SKILL_TREE_ELEMENTS, data: SKILL_TREE_DATA });
 *
 * Usage (Node.js / Jest):
 *   const SkillTreeEngine = require('./skilltree-engine');
 *   const elements = require('./skilltree/base-elements');
 *   var engine = new SkillTreeEngine({ elements: elements, data: { parNr: '3.2.1', activeSkills: null } });
 */
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.SkillTreeEngine = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var STORAGE_KEY = 'skilltree_global_stars';
    var GOALS_STORAGE_KEY = 'skilltree_goals';

    /**
     * @param {Object} config
     * @param {Object} config.elements  — SKILL_TREE_ELEMENTS (from base-elements.js)
     * @param {Object} config.data      — SKILL_TREE_DATA (from per-paragraph file)
     * @param {Object} [config.storage] — Optional storage adapter { getItem, setItem, removeItem }
     */
    function SkillTreeEngine(config) {
        if (!config) throw new Error('SkillTreeEngine: config is required');
        if (!config.elements) throw new Error('SkillTreeEngine: elements is required');

        this._elements = config.elements;
        this._data = config.data || { parNr: 'unknown', activeSkills: null };
        this._explanations = config.explanations || {};
        this._storage = config.storage || (typeof localStorage !== 'undefined' ? localStorage : null);

        // Build skill lookup
        this._skillMap = {};
        for (var i = 0; i < this._elements.SKILLS.length; i++) {
            this._skillMap[this._elements.SKILLS[i].id] = this._elements.SKILLS[i];
        }

        // Compute visible skills for this paragraph
        this._visibleSkills = this._computeVisibleSkills();

        // Load global stars (with migration from old per-paragraph keys)
        this._stars = this._loadStars();

        // Load goals
        this._goals = this._loadGoals();

        // Exercise state
        this._exercise = null;
        this._activeSkill = null;
        this._stepIdx = 0;
        this._errors = 0;
        this._hints = 0;
        this._completedSteps = [];
        this._streak = 0;
    }

    // ── Visible skills ────────────────────────────────────────

    SkillTreeEngine.prototype._computeVisibleSkills = function () {
        var active = this._data.activeSkills;
        if (!active) return this._elements.SKILLS.slice(); // null = all

        var activeSet = {};
        for (var i = 0; i < active.length; i++) activeSet[active[i]] = true;

        var filtered = [];
        for (var j = 0; j < this._elements.SKILLS.length; j++) {
            var s = this._elements.SKILLS[j];
            if (activeSet[s.id]) {
                // Filter prerequisites to only include visible skills
                var filteredNeeds = [];
                for (var k = 0; k < s.needs.length; k++) {
                    if (activeSet[s.needs[k]]) filteredNeeds.push(s.needs[k]);
                }
                filtered.push({
                    id: s.id,
                    name: s.name,
                    layer: s.layer,
                    needs: filteredNeeds
                });
            }
        }
        return filtered;
    };

    SkillTreeEngine.prototype.getVisibleSkills = function () {
        return this._visibleSkills;
    };

    SkillTreeEngine.prototype.setViewMode = function (mode) {
        // 'paragraph' = filtered by activeSkills, 'module' = all skills
        if (mode === 'module') {
            this._visibleSkills = this._elements.SKILLS.slice();
        } else {
            this._visibleSkills = this._computeVisibleSkills();
        }
        this._viewMode = mode;
    };

    SkillTreeEngine.prototype.getViewMode = function () {
        return this._viewMode || 'paragraph';
    };

    SkillTreeEngine.prototype.getAllSkills = function () {
        return this._elements.SKILLS;
    };

    SkillTreeEngine.prototype.getLayerNames = function () {
        return this._elements.LAYER_NAMES;
    };

    SkillTreeEngine.prototype.getLayerColors = function () {
        return this._elements.LAYER_COLORS;
    };

    SkillTreeEngine.prototype.getNewSkills = function () {
        return this._data.newSkills || [];
    };

    // ── Stars / Progress ──────────────────────────────────────

    SkillTreeEngine.prototype._loadStars = function () {
        if (!this._storage) return {};

        // Try loading global key first
        var globalData = null;
        try {
            var raw = this._storage.getItem(STORAGE_KEY);
            if (raw) globalData = JSON.parse(raw);
        } catch (e) { /* ignore */ }

        if (globalData) return globalData;

        // Migration: merge old per-paragraph keys
        var merged = {};
        var oldKeys = [];
        var parNrs = [
            '3.1.1','3.1.2','3.1.3',
            '3.2.1','3.2.2','3.2.3','3.2.4','3.2.5','3.2.6','3.2.7',
            '3.3.1','3.3.2','3.3.3','3.3.4',
            '3.4.1','3.4.2','3.4.3','3.4.4','3.4.5','3.4.6'
        ];

        for (var i = 0; i < parNrs.length; i++) {
            var key = 'skilltree_' + parNrs[i];
            try {
                var val = this._storage.getItem(key);
                if (val) {
                    var data = JSON.parse(val);
                    oldKeys.push(key);
                    for (var skillId in data) {
                        if (data.hasOwnProperty(skillId)) {
                            var s = data[skillId] || 0;
                            if (!merged[skillId] || s > merged[skillId]) {
                                merged[skillId] = s;
                            }
                        }
                    }
                }
            } catch (e) { /* ignore */ }
        }

        // Also check old "econ-game-stars" key (original React version)
        try {
            var oldReact = this._storage.getItem('econ-game-stars');
            if (oldReact) {
                var reactData = JSON.parse(oldReact);
                oldKeys.push('econ-game-stars');
                for (var sid in reactData) {
                    if (reactData.hasOwnProperty(sid)) {
                        var sv = reactData[sid] || 0;
                        if (!merged[sid] || sv > merged[sid]) {
                            merged[sid] = sv;
                        }
                    }
                }
            }
        } catch (e) { /* ignore */ }

        // Save merged to global key and clean up old keys
        if (oldKeys.length > 0) {
            try {
                this._storage.setItem(STORAGE_KEY, JSON.stringify(merged));
                for (var j = 0; j < oldKeys.length; j++) {
                    this._storage.removeItem(oldKeys[j]);
                }
            } catch (e) { /* ignore */ }
        }

        return merged;
    };

    SkillTreeEngine.prototype._saveStars = function () {
        if (!this._storage) return;
        try {
            this._storage.setItem(STORAGE_KEY, JSON.stringify(this._stars));
        } catch (e) { /* ignore */ }
    };

    SkillTreeEngine.prototype.getStars = function () {
        return this._stars;
    };

    SkillTreeEngine.prototype.getSkillStars = function (skillId) {
        return this._stars[skillId] || 0;
    };

    SkillTreeEngine.prototype.setStars = function (stars) {
        this._stars = stars;
        this._saveStars();
    };

    SkillTreeEngine.prototype.resetStars = function () {
        this._stars = {};
        this._saveStars();
    };

    // ── Goals ─────────────────────────────────────────────────

    SkillTreeEngine.prototype._loadGoals = function () {
        if (!this._storage) return { active: [], achieved: [] };
        try {
            var raw = this._storage.getItem(GOALS_STORAGE_KEY);
            if (raw) {
                var data = JSON.parse(raw);
                return {
                    active: data.active || [],
                    achieved: data.achieved || []
                };
            }
        } catch (e) { /* ignore */ }
        return { active: [], achieved: [] };
    };

    SkillTreeEngine.prototype._saveGoals = function () {
        if (!this._storage) return;
        try {
            this._storage.setItem(GOALS_STORAGE_KEY, JSON.stringify(this._goals));
        } catch (e) { /* ignore */ }
    };

    SkillTreeEngine.prototype.getGoals = function () {
        return this._goals;
    };

    SkillTreeEngine.prototype.setGoal = function (skillId) {
        if (!this._skillMap[skillId]) return null;
        if (this._goals.active.length >= 2) return null;
        // Check not already active
        for (var i = 0; i < this._goals.active.length; i++) {
            if (this._goals.active[i].id === skillId) return null;
        }
        // Check not already achieved
        for (var j = 0; j < this._goals.achieved.length; j++) {
            if (this._goals.achieved[j].id === skillId) return null;
        }
        this._goals.active.push({ id: skillId, setAt: Date.now() });
        this._saveGoals();
        return this._goals;
    };

    SkillTreeEngine.prototype.removeGoal = function (skillId) {
        var newActive = [];
        for (var i = 0; i < this._goals.active.length; i++) {
            if (this._goals.active[i].id !== skillId) newActive.push(this._goals.active[i]);
        }
        this._goals.active = newActive;
        this._saveGoals();
        return this._goals;
    };

    SkillTreeEngine.prototype.isGoal = function (skillId) {
        for (var i = 0; i < this._goals.active.length; i++) {
            if (this._goals.active[i].id === skillId) return true;
        }
        return false;
    };

    SkillTreeEngine.prototype.isAchievedGoal = function (skillId) {
        for (var i = 0; i < this._goals.achieved.length; i++) {
            if (this._goals.achieved[i].id === skillId) return true;
        }
        return false;
    };

    SkillTreeEngine.prototype.getGoalPath = function (skillId) {
        var skill = this._skillMap[skillId];
        if (!skill) return null;

        // BFS on FULL skill graph (not paragraph-filtered)
        var visited = {};
        var queue = [skillId];
        visited[skillId] = true;
        var allNodes = [];

        while (queue.length > 0) {
            var current = queue.shift();
            var s = this._skillMap[current];
            if (!s) continue;
            allNodes.push(s);
            for (var j = 0; j < s.needs.length; j++) {
                var prereq = s.needs[j];
                if (!visited[prereq]) {
                    visited[prereq] = true;
                    queue.push(prereq);
                }
            }
        }

        // Topological sort (Kahn's algorithm) for remaining skills
        var inDeg = {};
        var adj = {};
        for (var ni = 0; ni < allNodes.length; ni++) {
            var nid = allNodes[ni].id;
            if (!inDeg[nid]) inDeg[nid] = 0;
            if (!adj[nid]) adj[nid] = [];
        }
        for (var ei = 0; ei < allNodes.length; ei++) {
            var node = allNodes[ei];
            for (var pi = 0; pi < node.needs.length; pi++) {
                var p = node.needs[pi];
                if (visited[p]) {
                    if (!adj[p]) adj[p] = [];
                    adj[p].push(node.id);
                    inDeg[node.id] = (inDeg[node.id] || 0) + 1;
                }
            }
        }
        // Re-count in-degrees properly (reset first)
        for (var r in inDeg) { if (inDeg.hasOwnProperty(r)) inDeg[r] = 0; }
        for (var ei2 = 0; ei2 < allNodes.length; ei2++) {
            var node2 = allNodes[ei2];
            for (var pi2 = 0; pi2 < node2.needs.length; pi2++) {
                if (visited[node2.needs[pi2]]) {
                    inDeg[node2.id] = (inDeg[node2.id] || 0) + 1;
                }
            }
        }

        var topoQueue = [];
        for (var t in inDeg) {
            if (inDeg.hasOwnProperty(t) && inDeg[t] === 0) topoQueue.push(t);
        }
        var topoOrder = [];
        while (topoQueue.length > 0) {
            var cur = topoQueue.shift();
            topoOrder.push(cur);
            var neighbors = adj[cur] || [];
            for (var ni2 = 0; ni2 < neighbors.length; ni2++) {
                inDeg[neighbors[ni2]]--;
                if (inDeg[neighbors[ni2]] === 0) topoQueue.push(neighbors[ni2]);
            }
        }

        // Classify nodes
        var totalPrereqs = allNodes.length;
        var masteredPrereqs = 0;
        var fullyMastered = 0;
        var remaining = [];
        var nextActionable = [];

        for (var ti = 0; ti < topoOrder.length; ti++) {
            var sid = topoOrder[ti];
            var stars = this._stars[sid] || 0;
            if (stars >= 1) masteredPrereqs++;
            if (stars >= 3) fullyMastered++;
            if (stars < 3) {
                remaining.push(sid);
                // Check if all prereqs of this skill are done (>= 1 star)
                var sk = this._skillMap[sid];
                var allPrereqsDone = true;
                for (var pi3 = 0; pi3 < sk.needs.length; pi3++) {
                    if ((this._stars[sk.needs[pi3]] || 0) < 1) {
                        allPrereqsDone = false;
                        break;
                    }
                }
                if (allPrereqsDone) nextActionable.push(sid);
            }
        }

        // Build ordered path with status per skill
        var orderedPath = [];
        for (var oi = 0; oi < topoOrder.length; oi++) {
            var oid = topoOrder[oi];
            var osk = this._skillMap[oid];
            var ost = this._stars[oid] || 0;
            orderedPath.push({
                id: oid,
                name: osk ? osk.name : oid,
                stars: ost,
                done: ost >= 3,
                actionable: false
            });
        }
        // Mark actionable
        for (var ai = 0; ai < nextActionable.length; ai++) {
            for (var aj = 0; aj < orderedPath.length; aj++) {
                if (orderedPath[aj].id === nextActionable[ai]) {
                    orderedPath[aj].actionable = true;
                    break;
                }
            }
        }

        return {
            goalId: skillId,
            goalName: skill.name,
            totalPrereqs: totalPrereqs,
            masteredPrereqs: masteredPrereqs,
            fullyMastered: fullyMastered,
            remainingSkills: remaining,
            nextActionable: nextActionable,
            orderedPath: orderedPath,
            complete: (this._stars[skillId] || 0) >= 3
        };
    };

    SkillTreeEngine.prototype.getGoalPathForParagraph = function (skillId) {
        var path = this.getGoalPath(skillId);
        if (!path) return null;

        // Build set of all skills on the path
        var pathSet = {};
        var fullPath = this.getGoalPath(skillId);
        // Collect all node IDs from BFS (redo quick BFS for the set)
        var visited = {};
        var queue = [skillId];
        visited[skillId] = true;
        while (queue.length > 0) {
            var current = queue.shift();
            var s = this._skillMap[current];
            if (!s) continue;
            pathSet[current] = true;
            for (var j = 0; j < s.needs.length; j++) {
                if (!visited[s.needs[j]]) {
                    visited[s.needs[j]] = true;
                    queue.push(s.needs[j]);
                }
            }
        }

        // Intersect with visible skills
        var visibleOnPath = [];
        var visibleActionable = [];
        var goalVisibleHere = false;

        for (var i = 0; i < this._visibleSkills.length; i++) {
            var vs = this._visibleSkills[i];
            if (!pathSet[vs.id]) continue;
            if (vs.id === skillId) goalVisibleHere = true;
            visibleOnPath.push(vs.id);
            // Actionable = on path, < 3 stars, prereqs done
            if ((this._stars[vs.id] || 0) < 3 && this.prereqsDone(vs.id)) {
                visibleActionable.push(vs.id);
            }
        }

        return {
            visibleOnPath: visibleOnPath,
            visibleActionable: visibleActionable,
            goalVisibleHere: goalVisibleHere
        };
    };

    SkillTreeEngine.prototype.checkGoalCompletion = function () {
        var achieved = [];
        var stillActive = [];

        for (var i = 0; i < this._goals.active.length; i++) {
            var goal = this._goals.active[i];
            if ((this._stars[goal.id] || 0) >= 3) {
                achieved.push(goal.id);
                this._goals.achieved.push({
                    id: goal.id,
                    setAt: goal.setAt,
                    achievedAt: Date.now()
                });
            } else {
                stillActive.push(goal);
            }
        }

        if (achieved.length > 0) {
            this._goals.active = stillActive;
            this._saveGoals();
        }

        return achieved;
    };

    SkillTreeEngine.prototype.isOnGoalPath = function (skillId) {
        for (var i = 0; i < this._goals.active.length; i++) {
            var path = this.getGoalPath(this._goals.active[i].id);
            if (!path) continue;
            // Check if skillId is in the full path
            var visited = {};
            var queue = [this._goals.active[i].id];
            visited[this._goals.active[i].id] = true;
            while (queue.length > 0) {
                var current = queue.shift();
                if (current === skillId) return true;
                var s = this._skillMap[current];
                if (!s) continue;
                for (var j = 0; j < s.needs.length; j++) {
                    if (!visited[s.needs[j]]) {
                        visited[s.needs[j]] = true;
                        queue.push(s.needs[j]);
                    }
                }
            }
        }
        return false;
    };

    // ── Prerequisites ─────────────────────────────────────────

    SkillTreeEngine.prototype.prereqsDone = function (skillId) {
        var skill = this._skillMap[skillId];
        if (!skill) return false;

        // Use visible skill's filtered needs if available
        var visSkill = null;
        for (var i = 0; i < this._visibleSkills.length; i++) {
            if (this._visibleSkills[i].id === skillId) {
                visSkill = this._visibleSkills[i];
                break;
            }
        }
        var needs = visSkill ? visSkill.needs : skill.needs;

        for (var j = 0; j < needs.length; j++) {
            if ((this._stars[needs[j]] || 0) < 1) return false;
        }
        return true;
    };

    SkillTreeEngine.prototype.getMissingPrereqs = function (skillId) {
        var visSkill = null;
        for (var i = 0; i < this._visibleSkills.length; i++) {
            if (this._visibleSkills[i].id === skillId) {
                visSkill = this._visibleSkills[i];
                break;
            }
        }
        if (!visSkill) return [];

        var missing = [];
        for (var j = 0; j < visSkill.needs.length; j++) {
            if ((this._stars[visSkill.needs[j]] || 0) < 1) {
                missing.push(visSkill.needs[j]);
            }
        }
        return missing;
    };

    // ── Dependency subgraph ─────────────────────────────────────

    SkillTreeEngine.prototype.getDependencySubgraph = function (skillId) {
        // Build lookup of visible skills
        var visMap = {};
        for (var i = 0; i < this._visibleSkills.length; i++) {
            visMap[this._visibleSkills[i].id] = this._visibleSkills[i];
        }

        var root = visMap[skillId];
        if (!root) return null;

        // BFS to collect all transitive prerequisites
        var visited = {};
        var queue = [skillId];
        visited[skillId] = true;
        var nodes = [];
        var edges = [];

        while (queue.length > 0) {
            var current = queue.shift();
            var skill = visMap[current];
            if (!skill) continue;

            nodes.push({
                id: skill.id,
                name: skill.name,
                layer: skill.layer,
                needs: skill.needs.slice()
            });

            for (var j = 0; j < skill.needs.length; j++) {
                var prereq = skill.needs[j];
                edges.push({ from: prereq, to: current });
                if (!visited[prereq]) {
                    visited[prereq] = true;
                    queue.push(prereq);
                }
            }
        }

        return {
            root: skillId,
            nodes: nodes,
            edges: edges
        };
    };

    // ── Exercise flow ─────────────────────────────────────────

    SkillTreeEngine.prototype.hasGenerator = function (skillId) {
        return !!this._elements.GEN[skillId];
    };

    SkillTreeEngine.prototype.getSkillDescription = function (skillId) {
        var s = this._skillMap[skillId];
        return s ? (s.desc || '') : '';
    };

    SkillTreeEngine.prototype.getExplanation = function (skillId) {
        return this._explanations[skillId] || null;
    };

    SkillTreeEngine.prototype.hasExplanation = function (skillId) {
        return !!this._explanations[skillId];
    };

    SkillTreeEngine.prototype.generatePreview = function (skillId) {
        var gen = this._elements.GEN[skillId];
        if (!gen) return null;
        for (var i = 0; i < 10; i++) {
            var ex = gen();
            if (ex) return { context: ex.context, question: ex.steps[0].q };
        }
        return null;
    };

    SkillTreeEngine.prototype.startExercise = function (skillId) {
        var gen = this._elements.GEN[skillId];
        if (!gen) return null;

        var ex = null;
        for (var i = 0; i < 20; i++) {
            ex = gen();
            if (ex) break;
        }
        if (!ex) return null;

        this._activeSkill = this._skillMap[skillId];
        this._exercise = ex;
        this._stepIdx = 0;
        this._errors = 0;
        this._hints = 0;
        this._completedSteps = [];
        this._streak = 0;

        return {
            skillId: skillId,
            skillName: this._activeSkill.name,
            context: ex.context,
            totalSteps: ex.steps.length,
            currentStep: ex.steps[0]
        };
    };

    SkillTreeEngine.prototype.getExerciseState = function () {
        if (!this._exercise) return null;
        var step = this._exercise.steps[this._stepIdx];
        return {
            skillId: this._activeSkill.id,
            skillName: this._activeSkill.name,
            skillLayer: this._activeSkill.layer,
            context: this._exercise.context,
            totalSteps: this._exercise.steps.length,
            currentStepIdx: this._stepIdx,
            currentStep: step,
            errors: this._errors,
            hints: this._hints,
            streak: this._streak,
            completedSteps: this._completedSteps.slice(),
            isLastStep: this._stepIdx + 1 >= this._exercise.steps.length
        };
    };

    SkillTreeEngine.prototype.checkAnswer = function (input) {
        if (!this._exercise) return { valid: false, error: 'No active exercise' };

        var step = this._exercise.steps[this._stepIdx];
        var mode = step.mode || 'numeric';

        // Route to mode-specific validator
        if (mode === 'mc') return this._checkMC(input, step);
        if (mode === 'order') return this._checkOrder(input, step);
        if (mode === 'error') return this._checkError(input, step);

        // Default: numeric (existing logic)
        var cleaned = String(input).replace(',', '.').replace(/\s/g, '').replace(/\u2212/g, '-');
        var userVal = parseFloat(cleaned);

        if (isNaN(userVal)) {
            this._errors++;
            this._streak = 0;
            return { correct: false, error: 'invalid_number' };
        }

        var tolerance = Math.abs(step.a) < 0.5 ? 0.08 : Math.abs(step.a) < 10 ? 0.2 : Math.abs(step.a) * 0.02;
        if (Math.abs(userVal - step.a) <= tolerance) {
            this._streak++;
            this._completedSteps.push({
                q: step.q,
                a: step.a,
                userAnswer: userVal
            });
            return {
                correct: true,
                explanation: step.expl,
                isLastStep: this._stepIdx + 1 >= this._exercise.steps.length,
                streak: this._streak
            };
        } else {
            this._errors++;
            this._streak = 0;
            return { correct: false, error: 'wrong_answer' };
        }
    };

    SkillTreeEngine.prototype._checkMC = function (input, step) {
        var selected = parseInt(input, 10);
        if (isNaN(selected) || selected < 0 || selected >= step.options.length) {
            this._errors++;
            this._streak = 0;
            return { correct: false, error: 'invalid_choice' };
        }
        if (selected === step.correctIdx) {
            this._streak++;
            this._completedSteps.push({
                q: step.q,
                a: step.options[step.correctIdx],
                userAnswer: step.options[selected]
            });
            return {
                correct: true,
                explanation: step.expl,
                isLastStep: this._stepIdx + 1 >= this._exercise.steps.length,
                streak: this._streak
            };
        } else {
            this._errors++;
            this._streak = 0;
            return { correct: false, error: 'wrong_answer' };
        }
    };

    SkillTreeEngine.prototype._checkOrder = function (input, step) {
        // input = array of block indices in user's order
        if (!Array.isArray(input) || input.length !== step.correctOrder.length) {
            this._errors++;
            this._streak = 0;
            return { correct: false, error: 'incomplete_order' };
        }
        var match = true;
        for (var i = 0; i < step.correctOrder.length; i++) {
            if (input[i] !== step.correctOrder[i]) { match = false; break; }
        }
        if (match) {
            this._streak++;
            var ordered = [];
            for (var j = 0; j < step.correctOrder.length; j++) {
                ordered.push(step.blocks[step.correctOrder[j]]);
            }
            this._completedSteps.push({
                q: step.q,
                a: ordered.join(' \u2192 '),
                userAnswer: ordered.join(' \u2192 ')
            });
            return {
                correct: true,
                explanation: step.expl,
                isLastStep: this._stepIdx + 1 >= this._exercise.steps.length,
                streak: this._streak
            };
        } else {
            this._errors++;
            this._streak = 0;
            return { correct: false, error: 'wrong_order' };
        }
    };

    SkillTreeEngine.prototype._checkError = function (input, step) {
        var selected = parseInt(input, 10);
        if (isNaN(selected) || selected < 0 || selected >= step.shownSteps.length) {
            this._errors++;
            this._streak = 0;
            return { correct: false, error: 'invalid_choice' };
        }
        if (step.shownSteps[selected].isError) {
            this._streak++;
            this._completedSteps.push({
                q: step.q,
                a: 'Fout gevonden: ' + step.shownSteps[selected].text,
                userAnswer: step.shownSteps[selected].text
            });
            return {
                correct: true,
                explanation: step.expl,
                isLastStep: this._stepIdx + 1 >= this._exercise.steps.length,
                streak: this._streak
            };
        } else {
            this._errors++;
            this._streak = 0;
            return { correct: false, error: 'wrong_answer' };
        }
    };

    SkillTreeEngine.prototype.nextStep = function () {
        if (!this._exercise) return null;
        if (this._stepIdx + 1 >= this._exercise.steps.length) return null;

        this._stepIdx++;
        return {
            currentStepIdx: this._stepIdx,
            currentStep: this._exercise.steps[this._stepIdx],
            totalSteps: this._exercise.steps.length
        };
    };

    SkillTreeEngine.prototype.useHint = function () {
        if (!this._exercise) return null;
        this._hints++;
        var step = this._exercise.steps[this._stepIdx];
        return step.hint;
    };

    SkillTreeEngine.prototype.finishExercise = function () {
        if (!this._exercise || !this._activeSkill) return null;

        var totalPenalty = this._errors + this._hints;
        var earned = totalPenalty === 0 ? 3 : totalPenalty <= 2 ? 2 : 1;
        var prev = this._stars[this._activeSkill.id] || 0;
        var newTotal = Math.min(5, prev + earned);
        var improved = newTotal > prev;

        if (improved) {
            this._stars[this._activeSkill.id] = newTotal;
            this._saveStars();
        }

        var result = {
            skillId: this._activeSkill.id,
            earned: earned,
            previous: prev,
            newTotal: newTotal,
            improved: improved,
            errors: this._errors,
            hints: this._hints
        };

        // Reset exercise state
        this._exercise = null;
        this._activeSkill = null;

        return result;
    };

    SkillTreeEngine.prototype.abortExercise = function () {
        this._exercise = null;
        this._activeSkill = null;
    };

    // ── Next skill recommendation ─────────────────────────────

    SkillTreeEngine.prototype.getNextSkill = function (currentSkillId) {
        // Find the next unlocked skill with < 5 stars (prefer goal-path, then same layer, then next layer)
        var current = this._skillMap[currentSkillId];
        var currentLayer = current ? current.layer : 0;
        var best = null;
        var bestScore = Infinity;

        // Precompute goal-path set for scoring bonus
        var onGoalPath = {};
        for (var gi = 0; gi < this._goals.active.length; gi++) {
            var gid = this._goals.active[gi].id;
            var visited = {};
            var queue = [gid];
            visited[gid] = true;
            while (queue.length > 0) {
                var cur = queue.shift();
                onGoalPath[cur] = true;
                var sk = this._skillMap[cur];
                if (!sk) continue;
                for (var ni = 0; ni < sk.needs.length; ni++) {
                    if (!visited[sk.needs[ni]]) {
                        visited[sk.needs[ni]] = true;
                        queue.push(sk.needs[ni]);
                    }
                }
            }
        }

        for (var i = 0; i < this._visibleSkills.length; i++) {
            var s = this._visibleSkills[i];
            if (s.id === currentSkillId) continue;
            if ((this._stars[s.id] || 0) >= 5) continue;
            if (!this.prereqsDone(s.id)) continue;
            if (!this.hasGenerator(s.id)) continue;

            // Prefer: same layer first, then higher layers, then lower layers
            var layerDist = s.layer - currentLayer;
            var score = layerDist >= 0 ? layerDist * 10 : 100 + Math.abs(layerDist) * 10;
            // Within same priority, prefer fewer stars (less practiced)
            score += (this._stars[s.id] || 0);
            // Strong bonus for goal-path skills
            if (onGoalPath[s.id]) score -= 200;

            if (score < bestScore) {
                bestScore = score;
                best = s;
            }
        }

        return best;
    };

    // ── Progress stats ────────────────────────────────────────

    SkillTreeEngine.prototype.getProgress = function () {
        var visible = this._visibleSkills;
        var mastered = 0;
        var totalStars = 0;

        for (var i = 0; i < visible.length; i++) {
            var s = this._stars[visible[i].id] || 0;
            if (s >= 1) mastered++;
            totalStars += s;
        }

        return {
            mastered: mastered,
            total: visible.length,
            totalStars: totalStars,
            maxStars: visible.length * 5
        };
    };

    return SkillTreeEngine;
});
