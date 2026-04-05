/**
 * Unit tests for QuizEngine — the pure game logic module.
 */
const QuizEngine = require('../quiz-engine');

// ── Test fixtures ───────────────────────────────────────────────────

/** Minimal question set with 2 categories, 3 difficulties each */
function makeQuestions() {
    const questions = [];
    const categories = ['catA', 'catB'];
    for (const cat of categories) {
        for (let diff = 1; diff <= 3; diff++) {
            for (let i = 0; i < 3; i++) {
                questions.push({
                    category: cat,
                    difficulty: diff,
                    q: `${cat}-d${diff}-q${i}`,
                    options: ['Correct', 'Wrong1', 'Wrong2', 'Wrong3'],
                    answer: 0,
                    rationale: `Explanation for ${cat}-d${diff}-q${i}`
                });
            }
        }
    }
    return questions;
}

function makeCategories() {
    return {
        catA: { name: 'Category A', colors: { bg: '#fff', text: '#000', bar: '#00f' } },
        catB: { name: 'Category B', colors: { bg: '#fff', text: '#000', bar: '#0f0' } }
    };
}

function createEngine(overrides) {
    return new QuizEngine({
        questions: makeQuestions(),
        categories: makeCategories(),
        maxQuestions: 10,
        streakToClose: 3,
        ...overrides
    });
}

/** Find the correct shuffled index for a question presentation */
function findCorrectIndex(presentation, originalQuestion) {
    // The correct answer text is always options[answer] from original
    const correctText = originalQuestion.options[originalQuestion.answer];
    return presentation.options.indexOf(correctText);
}

// ── Constructor tests ───────────────────────────────────────────────

describe('QuizEngine constructor', () => {
    test('throws without config', () => {
        expect(() => new QuizEngine()).toThrow('config is required');
    });

    test('throws without questions', () => {
        expect(() => new QuizEngine({ categories: makeCategories() })).toThrow('questions');
    });

    test('throws with empty questions', () => {
        expect(() => new QuizEngine({ questions: [], categories: makeCategories() })).toThrow('questions');
    });

    test('throws without categories', () => {
        expect(() => new QuizEngine({ questions: makeQuestions() })).toThrow('categories');
    });

    test('initialises with valid config', () => {
        const engine = createEngine();
        expect(engine).toBeDefined();
        expect(engine.maxQuestions).toBe(10);
        expect(engine.streakToClose).toBe(3);
    });

    test('defaults maxQuestions to 10', () => {
        const engine = new QuizEngine({
            questions: makeQuestions(),
            categories: makeCategories()
        });
        expect(engine.maxQuestions).toBe(10);
    });
});

// ── Session lifecycle ───────────────────────────────────────────────

describe('startSession', () => {
    test('returns allWereClosed: false on fresh start', () => {
        const engine = createEngine();
        const result = engine.startSession();
        expect(result.allWereClosed).toBe(false);
    });

    test('resets score and question index', () => {
        const engine = createEngine();
        engine.startSession();
        // Answer some questions to build up score
        const q1 = engine.nextQuestion();
        engine.submitAnswer(findCorrectIndex(q1, engine.currentQuestion));
        expect(engine.score).toBe(1);

        engine.startSession();
        expect(engine.score).toBe(0);
        expect(engine.currentQuestionIndex).toBe(0);
    });

    test('preserves category progress across sessions', () => {
        const engine = createEngine();
        engine.startSession();
        // Get a question and answer correctly
        const q = engine.nextQuestion();
        const correctIdx = findCorrectIndex(q, engine.currentQuestion);
        engine.submitAnswer(correctIdx);

        const progressBefore = engine.getProgress();
        engine.startSession();
        const progressAfter = engine.getProgress();

        // Progress should be preserved (not reset)
        expect(progressAfter[q.category].correctCount).toBe(
            progressBefore[q.category].correctCount
        );
    });
});

// ── Streak mechanics ────────────────────────────────────────────────

describe('streak mechanics', () => {
    test('correct answer increments correctCount', () => {
        const engine = createEngine();
        engine.startSession();
        const q = engine.nextQuestion();
        const cat = q.category;
        const correctIdx = findCorrectIndex(q, engine.currentQuestion);
        const result = engine.submitAnswer(correctIdx);

        expect(result.correct).toBe(true);
        expect(result.progress[cat].correctCount).toBe(1);
    });

    test('wrong answer resets correctCount to 0', () => {
        const engine = createEngine();
        engine.startSession();

        // Get first question and answer correctly
        const q1 = engine.nextQuestion();
        const cat1 = q1.category;
        engine.submitAnswer(findCorrectIndex(q1, engine.currentQuestion));

        // Keep answering correctly in same category until we get one
        // For simplicity, directly manipulate to test reset
        engine.progress[cat1].correctCount = 2;

        // Now get a question and answer wrong
        const q2 = engine.nextQuestion();
        const cat2 = q2.category;
        // Submit wrong answer (any index that's not correct)
        const correctIdx = findCorrectIndex(q2, engine.currentQuestion);
        const wrongIdx = (correctIdx + 1) % 4;
        const result = engine.submitAnswer(wrongIdx);

        expect(result.correct).toBe(false);
        expect(result.progress[cat2].correctCount).toBe(0);
    });

    test('wrong answer resets passedLevel3 to false', () => {
        const engine = createEngine();
        engine.startSession();

        // Set up a category with passedLevel3 = true
        engine.progress.catA.passedLevel3 = true;
        engine.progress.catA.correctCount = 2;

        // Force a question from catA
        const q = engine.nextQuestion();
        const cat = q.category;
        engine.progress[cat].passedLevel3 = true;

        // Answer wrong
        const correctIdx = findCorrectIndex(q, engine.currentQuestion);
        const wrongIdx = (correctIdx + 1) % 4;
        engine.submitAnswer(wrongIdx);

        expect(engine.progress[cat].passedLevel3).toBe(false);
    });
});

// ── Difficulty system ───────────────────────────────────────────────

describe('difficulty system', () => {
    test('correct answer increments level (max 3)', () => {
        const engine = createEngine();
        engine.startSession();

        const q = engine.nextQuestion();
        const cat = q.category;
        expect(engine.progress[cat].level).toBe(1);

        engine.submitAnswer(findCorrectIndex(q, engine.currentQuestion));
        expect(engine.progress[cat].level).toBe(2);
    });

    test('level does not exceed 3', () => {
        const engine = createEngine();
        engine.startSession();
        engine.progress.catA.level = 3;

        // Force a catA question
        const q = engine.nextQuestion();
        const cat = q.category;
        engine.progress[cat].level = 3;
        engine.submitAnswer(findCorrectIndex(q, engine.currentQuestion));
        expect(engine.progress[cat].level).toBe(3);
    });

    test('wrong answer decrements level (min 1)', () => {
        const engine = createEngine();
        engine.startSession();

        const q = engine.nextQuestion();
        const cat = q.category;
        engine.progress[cat].level = 2;

        const correctIdx = findCorrectIndex(q, engine.currentQuestion);
        engine.submitAnswer((correctIdx + 1) % 4);
        expect(engine.progress[cat].level).toBe(1);
    });

    test('level does not go below 1', () => {
        const engine = createEngine();
        engine.startSession();

        const q = engine.nextQuestion();
        const cat = q.category;
        expect(engine.progress[cat].level).toBe(1);

        const correctIdx = findCorrectIndex(q, engine.currentQuestion);
        engine.submitAnswer((correctIdx + 1) % 4);
        expect(engine.progress[cat].level).toBe(1);
    });
});

// ── Category closing ────────────────────────────────────────────────

describe('category closing', () => {
    test('3 correct + passedLevel3 closes category', () => {
        const engine = createEngine();
        engine.startSession();

        const q = engine.nextQuestion();
        const cat = q.category;

        // Simulate: 2 correct already + passedLevel3
        engine.progress[cat].correctCount = 2;
        engine.progress[cat].passedLevel3 = true;

        const result = engine.submitAnswer(findCorrectIndex(q, engine.currentQuestion));
        expect(result.correct).toBe(true);
        expect(result.progress[cat].closed).toBe(true);
        expect(result.categoryClosed).toBe(true);
    });

    test('3 correct WITHOUT passedLevel3 does NOT close category', () => {
        const engine = createEngine();
        engine.startSession();

        const q = engine.nextQuestion();
        const cat = q.category;

        // Simulate: 2 correct, but no difficulty-3 answer yet
        engine.progress[cat].correctCount = 2;
        engine.progress[cat].passedLevel3 = false;

        // If this question is not difficulty 3, category should NOT close
        // even with 3 correct
        // Force the question to be non-level-3
        engine.currentQuestion.difficulty = 1;

        const result = engine.submitAnswer(findCorrectIndex(q, engine.currentQuestion));
        expect(result.correct).toBe(true);
        expect(result.progress[cat].correctCount).toBe(3);
        expect(result.progress[cat].closed).toBe(false);
        expect(result.categoryClosed).toBe(false);
    });

    test('difficulty-3 correct answer sets passedLevel3', () => {
        const engine = createEngine();
        engine.startSession();

        const q = engine.nextQuestion();
        const cat = q.category;
        engine.currentQuestion.difficulty = 3;

        engine.submitAnswer(findCorrectIndex(q, engine.currentQuestion));
        expect(engine.progress[cat].passedLevel3).toBe(true);
    });

    test('non-difficulty-3 correct answer does NOT set passedLevel3', () => {
        const engine = createEngine();
        engine.startSession();

        const q = engine.nextQuestion();
        const cat = q.category;
        engine.currentQuestion.difficulty = 1;

        engine.submitAnswer(findCorrectIndex(q, engine.currentQuestion));
        expect(engine.progress[cat].passedLevel3).toBe(false);
    });

    test('wrong answer at streak 2 resets everything', () => {
        const engine = createEngine();
        engine.startSession();

        const q = engine.nextQuestion();
        const cat = q.category;
        engine.progress[cat].correctCount = 2;
        engine.progress[cat].passedLevel3 = true;
        engine.progress[cat].level = 3;

        const correctIdx = findCorrectIndex(q, engine.currentQuestion);
        engine.submitAnswer((correctIdx + 1) % 4);

        expect(engine.progress[cat].correctCount).toBe(0);
        expect(engine.progress[cat].passedLevel3).toBe(false);
        expect(engine.progress[cat].level).toBe(2); // decremented from 3
        expect(engine.progress[cat].closed).toBe(false);
    });
});

// ── Win condition ───────────────────────────────────────────────────

describe('win condition', () => {
    test('game ends after maxQuestions', () => {
        const engine = createEngine({ maxQuestions: 2 });
        engine.startSession();

        const q1 = engine.nextQuestion();
        expect(q1).not.toBeNull();
        engine.submitAnswer(0);

        const q2 = engine.nextQuestion();
        expect(q2).not.toBeNull();
        engine.submitAnswer(0);

        const q3 = engine.nextQuestion();
        expect(q3).toBeNull();
    });

    test('getResult reports correct score and total', () => {
        const engine = createEngine({ maxQuestions: 3 });
        engine.startSession();

        // Answer 3 questions, 2 correct
        for (let i = 0; i < 3; i++) {
            const q = engine.nextQuestion();
            if (i < 2) {
                engine.submitAnswer(findCorrectIndex(q, engine.currentQuestion));
            } else {
                const ci = findCorrectIndex(q, engine.currentQuestion);
                engine.submitAnswer((ci + 1) % 4);
            }
        }

        // Trigger session end (nextQuestion returns null after maxQuestions)
        const endQ = engine.nextQuestion();
        expect(endQ).toBeNull();

        const result = engine.getResult();
        expect(result.score).toBe(2);
        expect(result.total).toBe(3);
    });

    test('allClosed is true only when every category is closed', () => {
        const engine = createEngine();
        engine.startSession();

        expect(engine.getResult().allClosed).toBe(false);

        // Close one category
        engine.progress.catA.closed = true;
        expect(engine.getResult().allClosed).toBe(false);

        // Close both
        engine.progress.catB.closed = true;
        expect(engine.getResult().allClosed).toBe(true);
    });

    test('startSession resets all progress when all categories were closed', () => {
        const engine = createEngine();
        engine.startSession();

        // Close all categories
        engine.progress.catA.closed = true;
        engine.progress.catB.closed = true;

        const result = engine.startSession();
        expect(result.allWereClosed).toBe(true);

        // Progress should be fully reset
        expect(engine.progress.catA.closed).toBe(false);
        expect(engine.progress.catA.correctCount).toBe(0);
        expect(engine.progress.catB.closed).toBe(false);
    });
});

// ── Question presentation ───────────────────────────────────────────

describe('nextQuestion', () => {
    test('returns question object with expected properties', () => {
        const engine = createEngine();
        engine.startSession();
        const q = engine.nextQuestion();

        expect(q).toHaveProperty('category');
        expect(q).toHaveProperty('categoryName');
        expect(q).toHaveProperty('categoryColors');
        expect(q).toHaveProperty('difficulty');
        expect(q).toHaveProperty('questionText');
        expect(q).toHaveProperty('options');
        expect(q).toHaveProperty('questionNumber');
        expect(q).toHaveProperty('maxQuestions');
        expect(q.options).toHaveLength(4);
        expect(q.questionNumber).toBe(1);
    });

    test('options are shuffled (correct answer is among them)', () => {
        const engine = createEngine();
        engine.startSession();
        const q = engine.nextQuestion();

        // The original correct answer text should appear somewhere in shuffled options
        const originalCorrectText = engine.currentQuestion.options[engine.currentQuestion.answer];
        expect(q.options).toContain(originalCorrectText);
    });

    test('does not repeat questions within a session', () => {
        const engine = createEngine({ maxQuestions: 18 }); // 18 questions total in fixture
        engine.startSession();

        const seenTexts = new Set();
        for (let i = 0; i < 18; i++) {
            const q = engine.nextQuestion();
            if (!q) break;
            expect(seenTexts.has(q.questionText)).toBe(false);
            seenTexts.add(q.questionText);
            engine.submitAnswer(0);
        }
    });
});

// ── submitAnswer ────────────────────────────────────────────────────

describe('submitAnswer', () => {
    test('throws without current question', () => {
        const engine = createEngine();
        expect(() => engine.submitAnswer(0)).toThrow('no current question');
    });

    test('returns correctIndex in shuffled space', () => {
        const engine = createEngine();
        engine.startSession();
        const q = engine.nextQuestion();

        const correctIdx = findCorrectIndex(q, engine.currentQuestion);
        const result = engine.submitAnswer(correctIdx);

        expect(result.correct).toBe(true);
        expect(result.correctIndex).toBe(correctIdx);
    });

    test('returns deep copy of progress', () => {
        const engine = createEngine();
        engine.startSession();
        const q = engine.nextQuestion();
        const result = engine.submitAnswer(0);

        // Mutating returned progress should not affect engine
        result.progress.catA.correctCount = 999;
        expect(engine.progress.catA.correctCount).not.toBe(999);
    });
});

// ── Edge cases ──────────────────────────────────────────────────────

describe('edge cases', () => {
    test('handles single-category quiz', () => {
        const engine = new QuizEngine({
            questions: [
                { category: 'solo', difficulty: 1, q: 'Q1', options: ['A', 'B', 'C', 'D'], answer: 0, rationale: 'R1' },
                { category: 'solo', difficulty: 2, q: 'Q2', options: ['A', 'B', 'C', 'D'], answer: 1, rationale: 'R2' },
                { category: 'solo', difficulty: 3, q: 'Q3', options: ['A', 'B', 'C', 'D'], answer: 2, rationale: 'R3' }
            ],
            categories: { solo: { name: 'Solo', colors: { bg: '#fff', text: '#000', bar: '#f00' } } },
            maxQuestions: 10
        });
        engine.startSession();
        const q = engine.nextQuestion();
        expect(q).not.toBeNull();
        expect(q.category).toBe('solo');
    });

    test('returns null when all questions exhausted before maxQuestions', () => {
        const engine = new QuizEngine({
            questions: [
                { category: 'tiny', difficulty: 1, q: 'Only Q', options: ['A', 'B', 'C', 'D'], answer: 0, rationale: 'R' }
            ],
            categories: { tiny: { name: 'Tiny', colors: { bg: '#fff', text: '#000', bar: '#f00' } } },
            maxQuestions: 10
        });
        engine.startSession();
        const q1 = engine.nextQuestion();
        expect(q1).not.toBeNull();
        engine.submitAnswer(0);

        // After 1 question asked and category closed, next should be null
        // (category is not closed after 1 correct, so engine tries to find more)
        // Actually with only 1 question and streakToClose=3, it can't close.
        // The engine will return null because no unasked questions remain.
        const q2 = engine.nextQuestion();
        expect(q2).toBeNull();
    });

    test('getProgress returns deep copy', () => {
        const engine = createEngine();
        const progress = engine.getProgress();
        progress.catA.correctCount = 999;
        expect(engine.progress.catA.correctCount).toBe(0);
    });
});
