/**
 * NewsDetectiveEngine — Pure game logic for Nieuws-detective.
 * No DOM references. Works in both browser (<script>) and Node.js (require).
 *
 * Each game has one news article and exactly 4 rounds:
 *   0: concept   — multiple choice: which economic concept applies?
 *   1: consequence — order a cause-effect chain (4 correct + 2 distractors)
 *   2: model     — pick the matching economic model (3 options)
 *   3: error     — spot the wrong phrase in a fake expert analysis
 *
 * Usage (browser):
 *   <script src="newsdetective-engine.js"></script>
 *   var engine = new NewsDetectiveEngine(NEWS_DETECTIVE_DATA);
 *
 * Usage (Node.js / Jest):
 *   const NewsDetectiveEngine = require('./newsdetective-engine');
 */
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.NewsDetectiveEngine = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var ROUND_TYPES = ['concept', 'consequence', 'model', 'error'];
    var ROUND_NAMES_NL = [
        'Herken het concept',
        'Voorspel het gevolg',
        'Kies het juiste model',
        'Spot de fout'
    ];

    /**
     * @param {Object} data — NEWS_DETECTIVE_DATA object
     * @param {Object} data.meta          — { parNr, parName }
     * @param {Object} data.domainColors  — { primary, primaryDk, primaryLt, accent, navy }
     * @param {Object} data.article       — { headline, body, source, sourceDate, visualAlt }
     * @param {Array}  data.rounds        — exactly 4 round objects
     * @param {string} [data.lesLink]     — optional link text to lesson
     */
    function NewsDetectiveEngine(data) {
        if (!data) throw new Error('NewsDetectiveEngine: data is required');
        if (!data.article) throw new Error('NewsDetectiveEngine: article is required');
        if (!data.rounds || data.rounds.length !== 4) throw new Error('NewsDetectiveEngine: exactly 4 rounds required');

        for (var i = 0; i < 4; i++) {
            if (data.rounds[i].type !== ROUND_TYPES[i]) {
                throw new Error('NewsDetectiveEngine: round ' + i + ' must be type "' + ROUND_TYPES[i] + '", got "' + data.rounds[i].type + '"');
            }
        }

        this._data = data;
        this._roundIndex = -1;
        this._score = 0;
        this._results = [null, null, null, null];
        this._answered = false;
        this._gameStarted = false;
        this._shuffleMaps = [null, null, null, null];
    }

    // ── Static ──────────────────────────────────────────────────────

    NewsDetectiveEngine.ROUND_TYPES = ROUND_TYPES;
    NewsDetectiveEngine.ROUND_NAMES_NL = ROUND_NAMES_NL;

    // ── Session lifecycle ───────────────────────────────────────────

    NewsDetectiveEngine.prototype.startGame = function () {
        this._roundIndex = -1;
        this._score = 0;
        this._results = [null, null, null, null];
        this._answered = false;
        this._gameStarted = true;
        this._shuffleMaps = [null, null, null, null];
        return {
            article: this.getArticle(),
            totalRounds: 4
        };
    };

    NewsDetectiveEngine.prototype.getArticle = function () {
        return JSON.parse(JSON.stringify(this._data.article));
    };

    NewsDetectiveEngine.prototype.getMeta = function () {
        return JSON.parse(JSON.stringify(this._data.meta));
    };

    NewsDetectiveEngine.prototype.getDomainColors = function () {
        return JSON.parse(JSON.stringify(this._data.domainColors));
    };

    NewsDetectiveEngine.prototype.getLesLink = function () {
        return this._data.lesLink || null;
    };

    // ── Round navigation ────────────────────────────────────────────

    /**
     * Advance to next round. Returns true if a round is available, false if game is over.
     */
    NewsDetectiveEngine.prototype.nextRound = function () {
        if (!this._gameStarted) throw new Error('NewsDetectiveEngine: call startGame() first');
        if (this._roundIndex >= 0 && !this._answered) {
            throw new Error('NewsDetectiveEngine: must answer current round before advancing');
        }
        this._roundIndex++;
        this._answered = false;
        return this._roundIndex < 4;
    };

    /**
     * Get the current round presentation.
     * @returns {Object|null} round data, or null if game is over
     */
    NewsDetectiveEngine.prototype.getRound = function () {
        if (this._roundIndex < 0 || this._roundIndex >= 4) return null;

        var round = this._data.rounds[this._roundIndex];
        var base = {
            type: round.type,
            typeName: ROUND_NAMES_NL[this._roundIndex],
            roundNumber: this._roundIndex + 1,
            totalRounds: 4,
            question: round.question || null
        };

        switch (round.type) {
            case 'concept':  return this._presentConcept(round, base);
            case 'consequence': return this._presentConsequence(round, base);
            case 'model':    return this._presentModel(round, base);
            case 'error':    return this._presentError(round, base);
        }
        return null;
    };

    /**
     * Submit answer for current round.
     * @param {*} answer — format depends on round type
     * @returns {Object} { correct, score, feedback, roundType, lesLink }
     */
    NewsDetectiveEngine.prototype.submitAnswer = function (answer) {
        if (this._roundIndex < 0 || this._roundIndex >= 4) {
            throw new Error('NewsDetectiveEngine: no active round');
        }
        if (this._answered) {
            throw new Error('NewsDetectiveEngine: already answered this round');
        }

        var round = this._data.rounds[this._roundIndex];
        var result;

        switch (round.type) {
            case 'concept':     result = this._checkConcept(round, answer); break;
            case 'consequence': result = this._checkConsequence(round, answer); break;
            case 'model':       result = this._checkModel(round, answer); break;
            case 'error':       result = this._checkError(round, answer); break;
        }

        if (result.correct) this._score++;
        this._results[this._roundIndex] = result.correct;
        this._answered = true;

        return {
            correct: result.correct,
            score: this._score,
            feedback: result.feedback,
            roundType: round.type,
            lesLink: this._data.lesLink || null,
            correctAnswer: result.correctAnswer || null
        };
    };

    /**
     * Get final results after all 4 rounds.
     * @returns {Object} { score, total, ratio, perRound }
     */
    NewsDetectiveEngine.prototype.getResult = function () {
        return {
            score: this._score,
            total: 4,
            ratio: this._score / 4,
            perRound: ROUND_TYPES.map(function (type, i) {
                return {
                    type: type,
                    typeName: ROUND_NAMES_NL[i],
                    correct: this._results[i]
                };
            }.bind(this))
        };
    };

    NewsDetectiveEngine.prototype.isGameOver = function () {
        return this._roundIndex >= 3 && this._answered;
    };

    // ── Round presenters ────────────────────────────────────────────

    NewsDetectiveEngine.prototype._presentConcept = function (round, base) {
        // Shuffle options, track correct index
        var indices = _range(round.options.length);
        _shuffle(indices);
        this._shuffleMaps[this._roundIndex] = indices;

        var options = indices.map(function (i) {
            return { text: round.options[i].text };
        });

        base.options = options;
        return base;
    };

    NewsDetectiveEngine.prototype._presentConsequence = function (round, base) {
        // Combine chain + distractors, shuffle
        var items = round.chain.map(function (c) { return { text: c.text, _isChain: true, _pos: c.position }; });
        var distractors = round.distractors.map(function (d) { return { text: d.text, _isChain: false }; });
        var all = items.concat(distractors);
        _shuffle(all);

        // Store for checking
        this._shuffleMaps[this._roundIndex] = all;

        base.items = all.map(function (a) { return { text: a.text }; });
        base.requiredCount = round.chain.length;
        return base;
    };

    NewsDetectiveEngine.prototype._presentModel = function (round, base) {
        var indices = _range(round.options.length);
        _shuffle(indices);
        this._shuffleMaps[this._roundIndex] = indices;

        var options = indices.map(function (i) {
            return {
                id: round.options[i].id,
                label: round.options[i].label,
                description: round.options[i].description
            };
        });

        base.options = options;
        return base;
    };

    NewsDetectiveEngine.prototype._presentError = function (round, base) {
        // Combine error phrase + distractor phrases, shuffle
        var phrases = [round.errorPhrase].concat(round.distractorPhrases);
        _shuffle(phrases);
        this._shuffleMaps[this._roundIndex] = phrases;

        base.fakeAnalysis = round.fakeAnalysis;
        base.phrases = phrases;
        return base;
    };

    // ── Answer checkers ─────────────────────────────────────────────

    NewsDetectiveEngine.prototype._checkConcept = function (round, selectedIndex) {
        // selectedIndex is index in the shuffled options array
        var shuffleMap = this._shuffleMaps[this._roundIndex];
        var originalIndex = shuffleMap[selectedIndex];
        var correct = round.options[originalIndex].correct === true;
        var feedback = round.options[originalIndex].feedback;

        // Find the correct option for correctAnswer
        var correctShuffledIndex = -1;
        for (var i = 0; i < shuffleMap.length; i++) {
            if (round.options[shuffleMap[i]].correct) {
                correctShuffledIndex = i;
                break;
            }
        }

        return {
            correct: correct,
            feedback: feedback,
            correctAnswer: { index: correctShuffledIndex }
        };
    };

    NewsDetectiveEngine.prototype._checkConsequence = function (round, selectedTexts) {
        // selectedTexts is an array of text strings in the order the user placed them
        if (!Array.isArray(selectedTexts) || selectedTexts.length !== round.chain.length) {
            return {
                correct: false,
                feedback: 'Je moet precies ' + round.chain.length + ' stappen selecteren.',
                correctAnswer: { chain: round.chain.slice().sort(function (a, b) { return a.position - b.position; }).map(function (c) { return c.text; }) }
            };
        }

        // Build correct order
        var correctOrder = round.chain.slice().sort(function (a, b) { return a.position - b.position; });
        var correct = true;
        for (var i = 0; i < correctOrder.length; i++) {
            if (selectedTexts[i] !== correctOrder[i].text) {
                correct = false;
                break;
            }
        }

        return {
            correct: correct,
            feedback: correct
                ? 'Goed! Je hebt de oorzaak-gevolg keten correct opgebouwd.'
                : 'Niet helemaal. De juiste volgorde is: ' + correctOrder.map(function (c, idx) { return (idx + 1) + '. ' + c.text; }).join(' → '),
            correctAnswer: { chain: correctOrder.map(function (c) { return c.text; }) }
        };
    };

    NewsDetectiveEngine.prototype._checkModel = function (round, selectedId) {
        var shuffleMap = this._shuffleMaps[this._roundIndex];
        // Find the original option by id
        var selectedOption = null;
        var correctOption = null;
        for (var i = 0; i < round.options.length; i++) {
            if (round.options[i].id === selectedId) selectedOption = round.options[i];
            if (round.options[i].correct) correctOption = round.options[i];
        }

        if (!selectedOption) {
            return { correct: false, feedback: 'Ongeldige selectie.', correctAnswer: { id: correctOption.id } };
        }

        return {
            correct: selectedOption.correct === true,
            feedback: selectedOption.feedback,
            correctAnswer: { id: correctOption.id, label: correctOption.label }
        };
    };

    NewsDetectiveEngine.prototype._checkError = function (round, selectedPhrase) {
        var correct = selectedPhrase === round.errorPhrase;

        return {
            correct: correct,
            feedback: correct
                ? round.errorExplanation
                : 'Dat is niet de fout. ' + round.errorExplanation,
            correctAnswer: { phrase: round.errorPhrase }
        };
    };

    // ── Utilities ───────────────────────────────────────────────────

    function _range(n) {
        var arr = [];
        for (var i = 0; i < n; i++) arr.push(i);
        return arr;
    }

    function _shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
    }

    return NewsDetectiveEngine;
});
