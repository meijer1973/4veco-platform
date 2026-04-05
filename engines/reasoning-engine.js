/**
 * ReasoningEngine — Pure game logic for the Reasoning Game.
 * Supports 5 game modes and 3 content domains.
 * No DOM references. Works in both browser (<script>) and Node.js (require).
 */
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.ReasoningEngine = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // ── Domain configurations ───────────────────────────────────────

    var DOMAINS = {
        arithmetic: {
            showFormula: false,
            useOperationCounting: true,
            hideFormulaInErrorMode: false,
            flowTypeColors: {
                given:     { bg: '#eff6ff', border: '#93c5fd', icon: '\uD83D\uDCE6' },
                operation: { bg: '#fff7ed', border: '#fdba74', icon: '\u2699\uFE0F' }
            },
            validFlowTypes: ['given', 'operation']
        },
        economics: {
            showFormula: false,
            useOperationCounting: false,
            hideFormulaInErrorMode: false,
            flowTypeColors: {
                cause:     { bg: '#fef3c7', border: '#f59e0b', icon: '\u26A1' },
                reasoning: { bg: '#e0f2fe', border: '#0ea5e9', icon: '\uD83D\uDD17' },
                effect:    { bg: '#dcfce7', border: '#22c55e', icon: '\uD83C\uDFAF' }
            },
            validFlowTypes: ['cause', 'reasoning', 'effect']
        },
        'math-economics': {
            showFormula: true,
            useOperationCounting: false,
            hideFormulaInErrorMode: true,
            flowTypeColors: {
                given:  { bg: '#eef2ff', border: '#818cf8', icon: '\uD83D\uDCCB' },
                step:   { bg: '#fef3c7', border: '#f59e0b', icon: '\u2699\uFE0F' },
                result: { bg: '#dcfce7', border: '#22c55e', icon: '\uD83C\uDFAF' }
            },
            validFlowTypes: ['given', 'step', 'result']
        }
    };

    var MODE_NAMES = [
        'Order Steps',
        'Build Sub-Questions',
        'Find the Error',
        'Build Flow Diagram',
        'Match Structures'
    ];

    var MODE_NAMES_NL = [
        'Stappen ordenen',
        'Deelvragen opbouwen',
        'Vind de fout',
        'Stroomdiagram bouwen',
        'Structuren matchen'
    ];

    // ── CSV Parser ──────────────────────────────────────────────────

    function parseCSV(csvString) {
        var lines = csvString.trim().split('\n');
        if (lines.length < 2) return [];

        var headers = parseLine(lines[0]);
        var rows = [];
        for (var i = 1; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line) continue;
            var values = parseLine(line);
            var obj = {};
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = (j < values.length) ? values[j] : '';
            }
            rows.push(obj);
        }
        return rows;
    }

    /** Parse a single CSV line respecting quoted fields */
    function parseLine(line) {
        var fields = [];
        var current = '';
        var inQuotes = false;
        for (var i = 0; i < line.length; i++) {
            var ch = line[i];
            if (inQuotes) {
                if (ch === '"') {
                    if (i + 1 < line.length && line[i + 1] === '"') {
                        current += '"';
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    current += ch;
                }
            } else {
                if (ch === '"') {
                    inQuotes = true;
                } else if (ch === ';') {
                    fields.push(current.trim());
                    current = '';
                } else {
                    current += ch;
                }
            }
        }
        fields.push(current.trim());
        return fields;
    }

    // ── Problem builder ─────────────────────────────────────────────

    function buildProblem(row) {
        var flowSlots = [];
        for (var i = 1; i <= 6; i++) {
            var type = row['flow_' + i + '_type'];
            var text = row['flow_' + i + '_text'];
            if (type && text) flowSlots.push({ type: type, text: text, origIdx: i - 1 });
        }

        return {
            id: parseInt(row.id) || 0,
            text: row.problem_text || '',
            structureType: row.structure_type || '',
            structureLabel: row.structure_label || '',

            steps: [
                { label: row.step_1_label || '', detail: row.step_1_detail || '', formula: row.step_1_formula || null },
                { label: row.step_2_label || '', detail: row.step_2_detail || '', formula: row.step_2_formula || null },
                { label: row.step_3_label || '', detail: row.step_3_detail || '', formula: row.step_3_formula || null }
            ],

            distractorSteps: [
                { label: row.distractor_1_label || '', detail: row.distractor_1_detail || '', formula: row.distractor_1_formula || null },
                { label: row.distractor_2_label || '', detail: row.distractor_2_detail || '', formula: row.distractor_2_formula || null },
                { label: row.distractor_3_label || '', detail: row.distractor_3_detail || '', formula: row.distractor_3_formula || null }
            ],

            subQuestions: {
                correct: [row.subq_1 || '', row.subq_2 || '', row.subq_3 || ''],
                distractors: [row.subq_distractor_1 || '', row.subq_distractor_2 || '']
            },

            errorInfo: {
                errorIdx: (parseInt(row.error_step_index) || 1) - 1,
                wrong: {
                    label: row.error_wrong_label || '',
                    detail: row.error_wrong_detail || '',
                    formula: row.error_wrong_formula || null
                }
            },

            flowSlots: flowSlots
        };
    }

    // ── Shuffle (Fisher-Yates) ──────────────────────────────────────

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
    }

    // ── ReasoningEngine constructor ─────────────────────────────────

    /**
     * @param {Object} config
     * @param {string} config.csvString    — raw CSV content
     * @param {string} config.domain       — 'arithmetic' | 'economics' | 'math-economics'
     * @param {number} [config.roundsPerGame=5]
     */
    function ReasoningEngine(config) {
        if (!config) throw new Error('ReasoningEngine: config is required');
        if (!config.csvString) throw new Error('ReasoningEngine: csvString is required');
        if (!config.domain || !DOMAINS[config.domain]) {
            throw new Error('ReasoningEngine: invalid domain "' + config.domain + '"');
        }

        this.domain = config.domain;
        this.domainConfig = DOMAINS[config.domain];
        this.roundsPerGame = config.roundsPerGame || 5;

        // Parse CSV into problems
        var rows = parseCSV(config.csvString);
        this.problems = rows.map(buildProblem);

        if (this.problems.length < 1) {
            throw new Error('ReasoningEngine: no valid problems found in CSV');
        }

        // Group by structure type (for Match mode)
        this._structureGroups = {};
        for (var i = 0; i < this.problems.length; i++) {
            var st = this.problems[i].structureType;
            if (!this._structureGroups[st]) this._structureGroups[st] = [];
            this._structureGroups[st].push(this.problems[i]);
        }

        // Game state
        this._mode = -1;
        this._rounds = [];
        this._roundIdx = -1;
        this._score = 0;
        this._answered = false;
        this._matchData = null;
    }

    // ── Session management ──────────────────────────────────────────

    /**
     * Start a new game with the given mode.
     * @param {number} modeIndex — 0-4
     * @returns {{ roundCount: number, modeName: string }}
     */
    ReasoningEngine.prototype.startGame = function (modeIndex) {
        if (modeIndex < 0 || modeIndex > 4) throw new Error('Invalid mode: ' + modeIndex);

        this._mode = modeIndex;
        this._score = 0;
        this._roundIdx = 0;
        this._answered = false;
        this._matchData = null;
        this._roundResults = [];

        if (modeIndex === 4) {
            // Match mode: single round
            this._rounds = [0];
            this._matchData = this._generateMatchData();
        } else {
            // All other modes: pick random problems
            var indices = [];
            for (var i = 0; i < this.problems.length; i++) indices.push(i);
            indices = shuffle(indices);
            this._rounds = indices.slice(0, Math.min(this.roundsPerGame, indices.length));
        }

        return {
            roundCount: this._rounds.length,
            modeName: MODE_NAMES_NL[modeIndex]
        };
    };

    // ── Round presentation ──────────────────────────────────────────

    /**
     * Get the current round's presentation data.
     * Returns null if game is over.
     */
    ReasoningEngine.prototype.getRound = function () {
        if (this._roundIdx >= this._rounds.length) return null;

        this._answered = false;
        var problem = this.problems[this._rounds[this._roundIdx]];

        switch (this._mode) {
            case 0: return this._presentOrderSteps(problem);
            case 1: return this._presentSubQuestions(problem);
            case 2: return this._presentFindError(problem);
            case 3: return this._presentFlowDiagram(problem);
            case 4: return this._presentMatchStructures();
            default: return null;
        }
    };

    // Mode 0: Order Steps
    ReasoningEngine.prototype._presentOrderSteps = function (problem) {
        var allSteps = problem.steps.concat(problem.distractorSteps);
        var options;

        if (this.domainConfig.useOperationCounting) {
            // Arithmetic: count duplicate labels
            var counts = {};
            for (var i = 0; i < allSteps.length; i++) {
                var lbl = allSteps[i].label;
                counts[lbl] = (counts[lbl] || 0) + 1;
            }
            // Deduplicate by label, keep first occurrence
            var seen = {};
            options = [];
            for (var j = 0; j < allSteps.length; j++) {
                var label = allSteps[j].label;
                if (!seen[label]) {
                    seen[label] = true;
                    options.push({
                        label: label,
                        detail: allSteps[j].detail,
                        formula: allSteps[j].formula,
                        count: counts[label],
                        isCorrect: j < 3,
                        origIdx: j
                    });
                }
            }
            options = shuffle(options);
        } else {
            options = shuffle(allSteps.map(function (s, idx) {
                return {
                    label: s.label,
                    detail: s.detail,
                    formula: s.formula,
                    count: 1,
                    isCorrect: idx < 3,
                    origIdx: idx
                };
            }));
        }

        return {
            mode: 0,
            modeName: MODE_NAMES_NL[0],
            problemText: problem.text,
            options: options,
            correctOrder: problem.steps.map(function (s) { return s.label; }),
            maxSelections: 3,
            roundNumber: this._roundIdx + 1,
            totalRounds: this._rounds.length,
            showFormula: this.domainConfig.showFormula
        };
    };

    // Mode 1: Build Sub-Questions
    ReasoningEngine.prototype._presentSubQuestions = function (problem) {
        var all = problem.subQuestions.correct.map(function (q, i) {
            return { text: q, isCorrect: true, correctIdx: i };
        }).concat(problem.subQuestions.distractors.map(function (q) {
            return { text: q, isCorrect: false, correctIdx: -1 };
        }));

        return {
            mode: 1,
            modeName: MODE_NAMES_NL[1],
            problemText: problem.text,
            options: shuffle(all),
            correctOrder: problem.subQuestions.correct.slice(),
            maxSelections: 3,
            roundNumber: this._roundIdx + 1,
            totalRounds: this._rounds.length
        };
    };

    // Mode 2: Find the Error
    ReasoningEngine.prototype._presentFindError = function (problem) {
        var steps = [];
        for (var i = 0; i < 3; i++) {
            if (i === problem.errorInfo.errorIdx) {
                steps.push({
                    label: problem.errorInfo.wrong.label,
                    detail: problem.errorInfo.wrong.detail,
                    formula: problem.errorInfo.wrong.formula,
                    isError: true,
                    stepNumber: i + 1
                });
            } else {
                steps.push({
                    label: problem.steps[i].label,
                    detail: problem.steps[i].detail,
                    formula: problem.steps[i].formula,
                    isError: false,
                    stepNumber: i + 1
                });
            }
        }

        return {
            mode: 2,
            modeName: MODE_NAMES_NL[2],
            problemText: problem.text,
            steps: steps,
            errorIdx: problem.errorInfo.errorIdx,
            correctStep: problem.steps[problem.errorInfo.errorIdx],
            roundNumber: this._roundIdx + 1,
            totalRounds: this._rounds.length,
            showFormula: this.domainConfig.showFormula,
            hideFormulaBeforeAnswer: this.domainConfig.hideFormulaInErrorMode
        };
    };

    // Mode 3: Build Flow Diagram
    ReasoningEngine.prototype._presentFlowDiagram = function (problem) {
        var blocks = problem.flowSlots.map(function (slot, idx) {
            return {
                type: slot.type,
                text: slot.text,
                origIdx: idx
            };
        });

        return {
            mode: 3,
            modeName: MODE_NAMES_NL[3],
            problemText: problem.text,
            blocks: shuffle(blocks),
            correctOrder: problem.flowSlots.map(function (s) { return s.text; }),
            flowTypeColors: this.domainConfig.flowTypeColors,
            roundNumber: this._roundIdx + 1,
            totalRounds: this._rounds.length
        };
    };

    // Mode 4: Match Structures
    ReasoningEngine.prototype._presentMatchStructures = function () {
        return {
            mode: 4,
            modeName: MODE_NAMES_NL[4],
            items: this._matchData.items,
            correctPairs: this._matchData.correctPairs,
            roundNumber: 1,
            totalRounds: 1
        };
    };

    // ── Answer checking ─────────────────────────────────────────────

    /**
     * Submit an answer for the current round.
     * @param {*} answer — mode-specific answer format
     * @returns {{ correct: boolean, score: number, feedback: object }}
     */
    ReasoningEngine.prototype.submitAnswer = function (answer) {
        if (this._answered) throw new Error('Already answered this round');
        this._answered = true;

        var result;
        switch (this._mode) {
            case 0: result = this._checkOrderSteps(answer); break;
            case 1: result = this._checkSubQuestions(answer); break;
            case 2: result = this._checkFindError(answer); break;
            case 3: result = this._checkFlowDiagram(answer); break;
            case 4: result = this._checkMatchStructures(answer); break;
            default: result = { correct: false, feedback: {} };
        }

        if (result.correct) this._score++;

        var currentProblem = this.problems[this._rounds[this._roundIdx]];
        this._roundResults.push({ structureType: currentProblem.structureType, correct: result.correct });

        return {
            correct: result.correct,
            score: this._score,
            totalRounds: this._rounds.length,
            feedback: result.feedback
        };
    };

    // Mode 0 check: answer = array of selected labels in order
    ReasoningEngine.prototype._checkOrderSteps = function (selectedLabels) {
        var problem = this.problems[this._rounds[this._roundIdx]];
        var correctLabels = problem.steps.map(function (s) { return s.label; });
        var correct = selectedLabels.length === 3;
        if (correct) {
            for (var i = 0; i < 3; i++) {
                if (selectedLabels[i] !== correctLabels[i]) { correct = false; break; }
            }
        }
        return {
            correct: correct,
            feedback: {
                correctOrder: problem.steps,
                selectedOrder: selectedLabels
            }
        };
    };

    // Mode 1 check: answer = array of selected sub-question texts in order
    ReasoningEngine.prototype._checkSubQuestions = function (selectedTexts) {
        var problem = this.problems[this._rounds[this._roundIdx]];
        var correctTexts = problem.subQuestions.correct;
        var correct = selectedTexts.length === 3;
        if (correct) {
            for (var i = 0; i < 3; i++) {
                if (selectedTexts[i] !== correctTexts[i]) { correct = false; break; }
            }
        }
        return {
            correct: correct,
            feedback: {
                correctOrder: correctTexts,
                selectedOrder: selectedTexts
            }
        };
    };

    // Mode 2 check: answer = stepIndex (0, 1, or 2) that student thinks is wrong
    ReasoningEngine.prototype._checkFindError = function (selectedIdx) {
        var problem = this.problems[this._rounds[this._roundIdx]];
        var correct = selectedIdx === problem.errorInfo.errorIdx;
        return {
            correct: correct,
            feedback: {
                errorIdx: problem.errorInfo.errorIdx,
                wrongStep: problem.errorInfo.wrong,
                correctStep: problem.steps[problem.errorInfo.errorIdx],
                selectedIdx: selectedIdx
            }
        };
    };

    // Mode 3 check: answer = array of block texts in the order the student placed them
    ReasoningEngine.prototype._checkFlowDiagram = function (placedTexts) {
        var problem = this.problems[this._rounds[this._roundIdx]];
        var correctTexts = problem.flowSlots.map(function (s) { return s.text; });
        var correct = placedTexts.length === correctTexts.length;
        if (correct) {
            for (var i = 0; i < correctTexts.length; i++) {
                if (placedTexts[i] !== correctTexts[i]) { correct = false; break; }
            }
        }
        return {
            correct: correct,
            feedback: {
                correctOrder: problem.flowSlots,
                placedOrder: placedTexts
            }
        };
    };

    // Mode 4 check: answer = array of [idA, idB] pairs
    ReasoningEngine.prototype._checkMatchStructures = function (userPairs) {
        var correctPairs = this._matchData.correctPairs;
        var matchCount = 0;

        for (var i = 0; i < userPairs.length; i++) {
            var ua = userPairs[i][0];
            var ub = userPairs[i][1];
            for (var j = 0; j < correctPairs.length; j++) {
                var ca = correctPairs[j][0];
                var cb = correctPairs[j][1];
                if ((ua === ca && ub === cb) || (ua === cb && ub === ca)) {
                    matchCount++;
                    break;
                }
            }
        }

        return {
            correct: matchCount === correctPairs.length,
            feedback: {
                matchCount: matchCount,
                totalPairs: correctPairs.length,
                correctPairs: correctPairs,
                items: this._matchData.items
            }
        };
    };

    // ── Round advancement ───────────────────────────────────────────

    /**
     * Advance to the next round. Returns true if there is a next round, false if game over.
     */
    ReasoningEngine.prototype.nextRound = function () {
        this._roundIdx++;
        return this._roundIdx < this._rounds.length;
    };

    ReasoningEngine.prototype.getCurrentStructureType = function () {
        if (this._roundIdx >= this._rounds.length) return null;
        return this.problems[this._rounds[this._roundIdx]].structureType;
    };

    // ── Results ─────────────────────────────────────────────────────

    ReasoningEngine.prototype.getResult = function () {
        var total = this._rounds.length;
        var score = this._score;
        var ratio = total > 0 ? score / total : 0;
        var emoji = ratio >= 1 ? '\uD83C\uDFC6' : (ratio >= 0.5 ? '\uD83D\uDCC8' : '\uD83D\uDCDA');

        var perType = {};
        for (var i = 0; i < this._roundResults.length; i++) {
            var rr = this._roundResults[i];
            if (!perType[rr.structureType]) perType[rr.structureType] = { correct: 0, total: 0 };
            perType[rr.structureType].total++;
            if (rr.correct) perType[rr.structureType].correct++;
        }

        return {
            score: score,
            total: total,
            ratio: ratio,
            emoji: emoji,
            modeName: MODE_NAMES_NL[this._mode],
            perType: perType
        };
    };

    // ── Queries ─────────────────────────────────────────────────────

    ReasoningEngine.prototype.getDomainConfig = function () {
        return JSON.parse(JSON.stringify(this.domainConfig));
    };

    ReasoningEngine.prototype.getStructureTypes = function () {
        var types = [];
        for (var type in this._structureGroups) {
            if (this._structureGroups.hasOwnProperty(type)) {
                types.push({
                    type: type,
                    label: this._structureGroups[type][0].structureLabel,
                    count: this._structureGroups[type].length
                });
            }
        }
        return types;
    };

    ReasoningEngine.prototype.getProblemCount = function () {
        return this.problems.length;
    };

    ReasoningEngine.prototype.getModeNames = function () {
        return MODE_NAMES_NL.slice();
    };

    // ── Match data generation ───────────────────────────────────────

    ReasoningEngine.prototype._generateMatchData = function () {
        // Filter to types with at least 2 problems
        var validTypes = [];
        for (var type in this._structureGroups) {
            if (this._structureGroups.hasOwnProperty(type) && this._structureGroups[type].length >= 2) {
                validTypes.push(type);
            }
        }

        if (validTypes.length < 3) {
            throw new Error('Match mode requires at least 3 structure types with 2+ problems each. Found: ' + validTypes.length);
        }

        // Pick 3 random types
        var chosenTypes = shuffle(validTypes).slice(0, 3);

        // From each type, pick 2 random problems
        var items = [];
        var correctPairs = [];
        for (var i = 0; i < chosenTypes.length; i++) {
            var pair = shuffle(this._structureGroups[chosenTypes[i]]).slice(0, 2);
            correctPairs.push([pair[0].id, pair[1].id]);
            items.push({
                id: pair[0].id,
                text: pair[0].text,
                structureType: pair[0].structureType,
                structureLabel: pair[0].structureLabel
            });
            items.push({
                id: pair[1].id,
                text: pair[1].text,
                structureType: pair[1].structureType,
                structureLabel: pair[1].structureLabel
            });
        }

        return { items: shuffle(items), correctPairs: correctPairs };
    };

    // ── Static exports ──────────────────────────────────────────────

    ReasoningEngine.parseCSV = parseCSV;
    ReasoningEngine.buildProblem = buildProblem;
    ReasoningEngine.DOMAINS = DOMAINS;
    ReasoningEngine.MODE_NAMES = MODE_NAMES;
    ReasoningEngine.MODE_NAMES_NL = MODE_NAMES_NL;

    return ReasoningEngine;
});
