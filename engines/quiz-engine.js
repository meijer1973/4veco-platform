/**
 * QuizEngine — Pure game logic for instapquiz mastery system.
 * No DOM references. Works in both browser (<script>) and Node.js (require).
 *
 * Usage (browser):
 *   <script src="quiz-engine.js"></script>
 *   var engine = new QuizEngine({ questions: [...], categories: {...} });
 *
 * Usage (Node.js / Jest):
 *   const QuizEngine = require('./quiz-engine');
 */
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.QuizEngine = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /**
     * @param {Object} config
     * @param {Array}  config.questions      — [{category, difficulty, q, options, answer, rationale}]
     * @param {Object} config.categories     — { key: { name, colors: { bg, text, bar } } }
     * @param {number} [config.maxQuestions=10]
     * @param {number} [config.streakToClose=3]
     */
    function QuizEngine(config) {
        if (!config) throw new Error('QuizEngine: config is required');
        if (!config.questions || !config.questions.length) throw new Error('QuizEngine: questions array is required');
        if (!config.categories || !Object.keys(config.categories).length) throw new Error('QuizEngine: categories map is required');

        this.questions = config.questions;
        this.categories = config.categories;
        this.maxQuestions = config.maxQuestions || 10;
        this.streakToClose = config.streakToClose || 3;

        this._initProgress();
        this.score = 0;
        this.currentQuestionIndex = 0;
        this.askedThisSession = [];
        this.currentQuestion = null;
        this.shuffledCorrectIndex = -1;
        this._sessionActive = false;
    }

    // ── Initialisation ──────────────────────────────────────────────

    QuizEngine.prototype._initProgress = function () {
        this.progress = {};
        for (var cat in this.categories) {
            if (this.categories.hasOwnProperty(cat)) {
                this.progress[cat] = {
                    level: 1,
                    correctCount: 0,
                    passedLevel3: false,
                    closed: false
                };
            }
        }
    };

    // ── Session lifecycle ───────────────────────────────────────────

    /** Start (or restart) a quiz session. Resets score & index but keeps
     *  category progress — unless all categories are already closed,
     *  in which case everything resets. Returns {allWereClosed}. */
    QuizEngine.prototype.startSession = function () {
        var allClosed = this._allClosed();
        if (allClosed) {
            this._initProgress();
        }
        this.score = 0;
        this.currentQuestionIndex = 0;
        this.askedThisSession = [];
        this.currentQuestion = null;
        this.shuffledCorrectIndex = -1;
        this._sessionActive = true;
        return { allWereClosed: allClosed };
    };

    // ── Core game loop ──────────────────────────────────────────────

    /**
     * Advance to the next question.
     * @returns {Object|null} question presentation object, or null when session is over.
     *   { category, categoryName, categoryColors, difficulty,
     *     questionText, options (shuffled), questionNumber, maxQuestions }
     */
    QuizEngine.prototype.nextQuestion = function () {
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex > this.maxQuestions) {
            this._sessionActive = false;
            return null;
        }

        var q = this._selectQuestion();
        if (!q) {
            this._sessionActive = false;
            return null;
        }

        this.currentQuestion = q;

        // Shuffle option indices
        var indices = [];
        for (var i = 0; i < q.options.length; i++) indices.push(i);
        this._shuffle(indices);
        this.shuffledCorrectIndex = indices.indexOf(q.answer);

        var shuffledOptions = [];
        for (var j = 0; j < indices.length; j++) {
            shuffledOptions.push(q.options[indices[j]]);
        }

        return {
            category: q.category,
            categoryName: this.categories[q.category].name,
            categoryColors: this.categories[q.category].colors,
            difficulty: q.difficulty,
            questionText: q.q,
            options: shuffledOptions,
            questionNumber: this.currentQuestionIndex,
            maxQuestions: this.maxQuestions
        };
    };

    /**
     * Submit an answer for the current question.
     * @param {number} selectedIndex — index in the SHUFFLED options array
     * @returns {Object} { correct, correctIndex (in shuffled space), rationale,
     *                      score, progress (deep copy), categoryClosed }
     */
    QuizEngine.prototype.submitAnswer = function (selectedIndex) {
        if (!this.currentQuestion) throw new Error('QuizEngine: no current question');

        var q = this.currentQuestion;
        var isCorrect = (selectedIndex === this.shuffledCorrectIndex);
        var cat = q.category;
        var p = this.progress[cat];
        var categoryClosed = false;

        if (isCorrect) {
            this.score++;
            p.correctCount++;
            if (q.difficulty === 3) p.passedLevel3 = true;
            if (p.correctCount >= this.streakToClose && p.passedLevel3) {
                p.closed = true;
                categoryClosed = true;
            }
            if (p.level < 3) p.level++;
        } else {
            if (p.level > 1) p.level--;
            p.correctCount = 0;
            p.passedLevel3 = false;
        }

        return {
            correct: isCorrect,
            correctIndex: this.shuffledCorrectIndex,
            rationale: q.rationale,
            score: this.score,
            progress: this.getProgress(),
            categoryClosed: categoryClosed
        };
    };

    // ── Queries ─────────────────────────────────────────────────────

    /** Deep copy of per-category progress */
    QuizEngine.prototype.getProgress = function () {
        return JSON.parse(JSON.stringify(this.progress));
    };

    /** Session result summary */
    QuizEngine.prototype.getResult = function () {
        var questionsPlayed = this.currentQuestionIndex > this.maxQuestions
            ? this.maxQuestions
            : this.currentQuestionIndex - 1;
        return {
            score: this.score,
            total: questionsPlayed,
            allClosed: this._allClosed()
        };
    };

    /** Whether session is still active */
    QuizEngine.prototype.isSessionActive = function () {
        return this._sessionActive;
    };

    // ── Private helpers ─────────────────────────────────────────────

    QuizEngine.prototype._allClosed = function () {
        for (var cat in this.progress) {
            if (this.progress.hasOwnProperty(cat) && !this.progress[cat].closed) {
                return false;
            }
        }
        return true;
    };

    QuizEngine.prototype._selectQuestion = function () {
        var self = this;
        var available = [];
        for (var cat in this.progress) {
            if (this.progress.hasOwnProperty(cat) && !this.progress[cat].closed) {
                available.push(cat);
            }
        }
        if (available.length === 0) return null;

        this._shuffle(available);

        for (var i = 0; i < available.length; i++) {
            var targetCat = available[i];
            var p = this.progress[targetCat];
            var targetDiff = p.level;
            if (p.correctCount >= 2) targetDiff = 3;

            var possible = this._filterUnasked(targetCat, targetDiff);
            if (possible.length === 0) {
                possible = this._filterUnasked(targetCat, null);
            }
            if (possible.length > 0) {
                var sel = possible[Math.floor(Math.random() * possible.length)];
                this.askedThisSession.push(sel);
                return sel;
            }
        }

        // Absolute fallback: any unasked question
        var fallback = [];
        for (var k = 0; k < this.questions.length; k++) {
            if (this.askedThisSession.indexOf(this.questions[k]) === -1) {
                fallback.push(this.questions[k]);
            }
        }
        if (fallback.length > 0) {
            var sel = fallback[Math.floor(Math.random() * fallback.length)];
            this.askedThisSession.push(sel);
            return sel;
        }
        return null;
    };

    QuizEngine.prototype._filterUnasked = function (cat, diff) {
        var result = [];
        for (var i = 0; i < this.questions.length; i++) {
            var q = this.questions[i];
            if (q.category === cat
                && (diff === null || q.difficulty === diff)
                && this.askedThisSession.indexOf(q) === -1) {
                result.push(q);
            }
        }
        // Push selected to askedThisSession is done at selection point
        return result;
    };

    QuizEngine.prototype._shuffle = function (arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
    };

    return QuizEngine;
});
