/**
 * Unit tests for NewsDetectiveEngine — the pure game logic module.
 */
const NewsDetectiveEngine = require('../newsdetective-engine');

// ── Test fixtures ───────────────────────────────────────────────────

function makeData(overrides) {
    return {
        meta: { parNr: "3.1.1", parName: "Markt en marktstructuur" },
        domainColors: { primary: "#17A2B8", primaryDk: "#117A8B", primaryLt: "#E8F8FB", accent: "#F8C471", navy: "#1E2761" },
        article: {
            headline: "Test headline",
            body: "Test body text.",
            source: "NOS",
            sourceDate: "1 jan 2026",
            visualAlt: "Test visual"
        },
        rounds: [
            {
                type: "concept",
                question: "Welk concept past?",
                options: [
                    { text: "Correct", correct: true, feedback: "Goed!" },
                    { text: "Fout A", correct: false, feedback: "Fout A uitleg" },
                    { text: "Fout B", correct: false, feedback: "Fout B uitleg" },
                    { text: "Fout C", correct: false, feedback: "Fout C uitleg" }
                ]
            },
            {
                type: "consequence",
                question: "Wat is het gevolg?",
                chain: [
                    { text: "Stap 1", position: 0 },
                    { text: "Stap 2", position: 1 },
                    { text: "Stap 3", position: 2 },
                    { text: "Stap 4", position: 3 }
                ],
                distractors: [
                    { text: "Afleider X" },
                    { text: "Afleider Y" }
                ]
            },
            {
                type: "model",
                question: "Welk model past?",
                options: [
                    { id: "correct-model", label: "Correct Model", description: "Desc", correct: true, feedback: "Goed model!" },
                    { id: "wrong-a", label: "Wrong A", description: "Desc A", correct: false, feedback: "Fout A model" },
                    { id: "wrong-b", label: "Wrong B", description: "Desc B", correct: false, feedback: "Fout B model" }
                ]
            },
            {
                type: "error",
                fakeAnalysis: "Dit is een voorbeeld van volkomen concurrentie in de markt.",
                errorPhrase: "volkomen concurrentie",
                errorExplanation: "Het is geen volkomen concurrentie maar een oligopolie.",
                distractorPhrases: [
                    "Dit is een voorbeeld van",
                    "in de markt"
                ]
            }
        ],
        lesLink: "Dit komt terug bij: marktvormen",
        ...overrides
    };
}

/** Play through a round correctly (must be called after nextRound) */
function playRoundCorrect(engine) {
    const round = engine.getRound();
    if (round.type === 'concept') {
        const ci = round.options.findIndex(o => o.text === "Correct");
        engine.submitAnswer(ci >= 0 ? ci : 0);
    } else if (round.type === 'consequence') {
        engine.submitAnswer(["Stap 1", "Stap 2", "Stap 3", "Stap 4"]);
    } else if (round.type === 'model') {
        engine.submitAnswer("correct-model");
    } else if (round.type === 'error') {
        engine.submitAnswer("volkomen concurrentie");
    }
}

/** Advance to a specific round number (1-based), playing earlier rounds correctly */
function skipToRound(engine, targetRound) {
    for (let i = 1; i < targetRound; i++) {
        engine.nextRound();
        playRoundCorrect(engine);
    }
    engine.nextRound();
}

// ── Constructor tests ───────────────────────────────────────────────

describe('NewsDetectiveEngine constructor', () => {
    test('throws without data', () => {
        expect(() => new NewsDetectiveEngine()).toThrow('data is required');
    });

    test('throws without article', () => {
        expect(() => new NewsDetectiveEngine({ rounds: [{},{},{},{}] })).toThrow('article is required');
    });

    test('throws with wrong number of rounds', () => {
        expect(() => new NewsDetectiveEngine({
            article: { headline: "x", body: "x", source: "x", sourceDate: "x", visualAlt: "x" },
            rounds: [{ type: "concept" }]
        })).toThrow('exactly 4 rounds');
    });

    test('throws with wrong round type order', () => {
        expect(() => new NewsDetectiveEngine({
            article: { headline: "x", body: "x", source: "x", sourceDate: "x", visualAlt: "x" },
            rounds: [
                { type: "model" },
                { type: "concept" },
                { type: "consequence" },
                { type: "error" }
            ]
        })).toThrow('round 0 must be type "concept"');
    });

    test('creates engine with valid data', () => {
        const engine = new NewsDetectiveEngine(makeData());
        expect(engine).toBeDefined();
    });
});

// ── Static properties ───────────────────────────────────────────────

describe('static properties', () => {
    test('ROUND_TYPES has 4 entries', () => {
        expect(NewsDetectiveEngine.ROUND_TYPES).toEqual(['concept', 'consequence', 'model', 'error']);
    });

    test('ROUND_NAMES_NL has 4 Dutch names', () => {
        expect(NewsDetectiveEngine.ROUND_NAMES_NL).toHaveLength(4);
        expect(NewsDetectiveEngine.ROUND_NAMES_NL[0]).toBe('Herken het concept');
    });
});

// ── startGame ───────────────────────────────────────────────────────

describe('startGame', () => {
    test('returns article and totalRounds', () => {
        const engine = new NewsDetectiveEngine(makeData());
        const result = engine.startGame();
        expect(result.article.headline).toBe("Test headline");
        expect(result.totalRounds).toBe(4);
    });

    test('resets state on restart', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        engine.nextRound();
        // Play through round 1
        const round = engine.getRound();
        const correctIdx = round.options.findIndex(o => o.text === "Correct");
        engine.submitAnswer(correctIdx >= 0 ? correctIdx : 0);

        // Restart
        const result = engine.startGame();
        expect(result.totalRounds).toBe(4);
    });
});

// ── getArticle / getMeta / getDomainColors ───────────────────────────

describe('accessors', () => {
    test('getArticle returns deep copy', () => {
        const engine = new NewsDetectiveEngine(makeData());
        const a1 = engine.getArticle();
        const a2 = engine.getArticle();
        a1.headline = "modified";
        expect(a2.headline).toBe("Test headline");
    });

    test('getMeta returns correct data', () => {
        const engine = new NewsDetectiveEngine(makeData());
        expect(engine.getMeta().parNr).toBe("3.1.1");
    });

    test('getDomainColors returns colors', () => {
        const engine = new NewsDetectiveEngine(makeData());
        expect(engine.getDomainColors().primary).toBe("#17A2B8");
    });

    test('getLesLink returns link text', () => {
        const engine = new NewsDetectiveEngine(makeData());
        expect(engine.getLesLink()).toBe("Dit komt terug bij: marktvormen");
    });
});

// ── nextRound ───────────────────────────────────────────────────────

describe('nextRound', () => {
    test('throws before startGame', () => {
        const engine = new NewsDetectiveEngine(makeData());
        expect(() => engine.nextRound()).toThrow('call startGame()');
    });

    test('returns true for rounds 1-4, then false', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();

        // Helper: play through a round (must call getRound to populate shuffle map)
        function playRound(engine) {
            const round = engine.getRound();
            if (round.type === 'concept') {
                const ci = round.options.findIndex(o => o.text === "Correct");
                engine.submitAnswer(ci >= 0 ? ci : 0);
            } else if (round.type === 'consequence') {
                engine.submitAnswer(["Stap 1", "Stap 2", "Stap 3", "Stap 4"]);
            } else if (round.type === 'model') {
                engine.submitAnswer("correct-model");
            } else if (round.type === 'error') {
                engine.submitAnswer("volkomen concurrentie");
            }
        }

        for (let i = 0; i < 4; i++) {
            expect(engine.nextRound()).toBe(true);
            playRound(engine);
        }

        expect(engine.nextRound()).toBe(false);
    });

    test('throws if current round not answered', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        engine.nextRound();
        expect(() => engine.nextRound()).toThrow('must answer current round');
    });
});

// ── getRound ────────────────────────────────────────────────────────

describe('getRound', () => {
    test('returns null before first nextRound', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        expect(engine.getRound()).toBeNull();
    });

    test('concept round has shuffled options', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        engine.nextRound();
        const round = engine.getRound();
        expect(round.type).toBe('concept');
        expect(round.typeName).toBe('Herken het concept');
        expect(round.roundNumber).toBe(1);
        expect(round.options).toHaveLength(4);
        // Options should have text but not correct/feedback (those are hidden)
        expect(round.options[0]).toHaveProperty('text');
        expect(round.options[0]).not.toHaveProperty('correct');
        expect(round.options[0]).not.toHaveProperty('feedback');
    });

    test('consequence round has items and distractors shuffled together', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        skipToRound(engine, 2);
        const round = engine.getRound();
        expect(round.type).toBe('consequence');
        expect(round.items).toHaveLength(6); // 4 chain + 2 distractors
        expect(round.requiredCount).toBe(4);
    });

    test('model round has shuffled options with id, label, description', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        skipToRound(engine, 3);
        const round = engine.getRound();
        expect(round.type).toBe('model');
        expect(round.options).toHaveLength(3);
        expect(round.options[0]).toHaveProperty('id');
        expect(round.options[0]).toHaveProperty('label');
        expect(round.options[0]).toHaveProperty('description');
        expect(round.options[0]).not.toHaveProperty('correct');
    });

    test('error round has fakeAnalysis and clickable phrases', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        skipToRound(engine, 4);
        const round = engine.getRound();
        expect(round.type).toBe('error');
        expect(typeof round.fakeAnalysis).toBe('string');
        expect(round.phrases.length).toBeGreaterThanOrEqual(3);
        expect(round.phrases).toContain("volkomen concurrentie");
    });
});

// ── submitAnswer ────────────────────────────────────────────────────

describe('submitAnswer', () => {
    test('throws with no active round', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        expect(() => engine.submitAnswer(0)).toThrow('no active round');
    });

    test('throws if answered twice', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        engine.nextRound();
        engine.getRound(); // populate shuffle map
        engine.submitAnswer(0);
        expect(() => engine.submitAnswer(0)).toThrow('already answered');
    });

    test('concept: correct answer scores point', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        engine.nextRound();
        const round = engine.getRound();
        const correctIdx = round.options.findIndex(o => o.text === "Correct");
        const result = engine.submitAnswer(correctIdx);
        expect(result.correct).toBe(true);
        expect(result.score).toBe(1);
        expect(typeof result.feedback).toBe('string');
        expect(result.roundType).toBe('concept');
    });

    test('concept: wrong answer does not score', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        engine.nextRound();
        const round = engine.getRound();
        const wrongIdx = round.options.findIndex(o => o.text === "Fout A");
        const result = engine.submitAnswer(wrongIdx);
        expect(result.correct).toBe(false);
        expect(result.score).toBe(0);
    });

    test('consequence: correct chain scores point', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        skipToRound(engine, 2);
        engine.getRound();
        const result = engine.submitAnswer(["Stap 1", "Stap 2", "Stap 3", "Stap 4"]);
        expect(result.correct).toBe(true);
    });

    test('consequence: wrong order does not score', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        skipToRound(engine, 2);
        engine.getRound();
        const result = engine.submitAnswer(["Stap 2", "Stap 1", "Stap 3", "Stap 4"]);
        expect(result.correct).toBe(false);
    });

    test('consequence: wrong count does not score', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        skipToRound(engine, 2);
        engine.getRound();
        const result = engine.submitAnswer(["Stap 1", "Stap 2"]);
        expect(result.correct).toBe(false);
    });

    test('model: correct id scores point', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        skipToRound(engine, 3);
        engine.getRound();
        const result = engine.submitAnswer("correct-model");
        expect(result.correct).toBe(true);
    });

    test('model: wrong id does not score', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        skipToRound(engine, 3);
        engine.getRound();
        const result = engine.submitAnswer("wrong-a");
        expect(result.correct).toBe(false);
    });

    test('error: correct phrase scores point', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        skipToRound(engine, 4);
        engine.getRound();
        const result = engine.submitAnswer("volkomen concurrentie");
        expect(result.correct).toBe(true);
    });

    test('error: wrong phrase does not score', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        skipToRound(engine, 4);
        engine.getRound();
        const result = engine.submitAnswer("in de markt");
        expect(result.correct).toBe(false);
    });

    test('returns correctAnswer for each round type', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();

        engine.nextRound();
        engine.getRound();
        const r1 = engine.submitAnswer(0);
        expect(r1.correctAnswer).toHaveProperty('index');

        engine.nextRound();
        engine.getRound();
        const r2 = engine.submitAnswer(["Stap 1", "Stap 2", "Stap 3", "Stap 4"]);
        expect(r2.correctAnswer).toHaveProperty('chain');
        expect(r2.correctAnswer.chain).toEqual(["Stap 1", "Stap 2", "Stap 3", "Stap 4"]);

        engine.nextRound();
        engine.getRound();
        const r3 = engine.submitAnswer("correct-model");
        expect(r3.correctAnswer).toHaveProperty('id');

        engine.nextRound();
        engine.getRound();
        const r4 = engine.submitAnswer("volkomen concurrentie");
        expect(r4.correctAnswer).toHaveProperty('phrase');
    });
});

// ── getResult ───────────────────────────────────────────────────────

describe('getResult', () => {
    test('returns correct summary after full game (all correct)', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();

        engine.nextRound();
        const r = engine.getRound();
        const ci = r.options.findIndex(o => o.text === "Correct");
        engine.submitAnswer(ci);

        engine.nextRound();
        engine.getRound();
        engine.submitAnswer(["Stap 1", "Stap 2", "Stap 3", "Stap 4"]);

        engine.nextRound();
        engine.getRound();
        engine.submitAnswer("correct-model");

        engine.nextRound();
        engine.getRound();
        engine.submitAnswer("volkomen concurrentie");

        const result = engine.getResult();
        expect(result.score).toBe(4);
        expect(result.total).toBe(4);
        expect(result.ratio).toBe(1);
        expect(result.perRound).toHaveLength(4);
        expect(result.perRound[0].correct).toBe(true);
        expect(result.perRound[0].type).toBe('concept');
        expect(result.perRound[0].typeName).toBe('Herken het concept');
    });

    test('returns correct summary with mixed results', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();

        // Round 1: wrong
        engine.nextRound();
        const r = engine.getRound();
        const wi = r.options.findIndex(o => o.text === "Fout A");
        engine.submitAnswer(wi);

        // Round 2: correct
        engine.nextRound();
        engine.getRound();
        engine.submitAnswer(["Stap 1", "Stap 2", "Stap 3", "Stap 4"]);

        // Round 3: wrong
        engine.nextRound();
        engine.getRound();
        engine.submitAnswer("wrong-a");

        // Round 4: correct
        engine.nextRound();
        engine.getRound();
        engine.submitAnswer("volkomen concurrentie");

        const result = engine.getResult();
        expect(result.score).toBe(2);
        expect(result.ratio).toBe(0.5);
        expect(result.perRound[0].correct).toBe(false);
        expect(result.perRound[1].correct).toBe(true);
        expect(result.perRound[2].correct).toBe(false);
        expect(result.perRound[3].correct).toBe(true);
    });
});

// ── isGameOver ──────────────────────────────────────────────────────

describe('isGameOver', () => {
    test('false before all rounds answered', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        expect(engine.isGameOver()).toBe(false);
        engine.nextRound();
        expect(engine.isGameOver()).toBe(false);
    });

    test('true after all 4 rounds answered', () => {
        const engine = new NewsDetectiveEngine(makeData());
        engine.startGame();
        for (let i = 0; i < 4; i++) {
            engine.nextRound();
            playRoundCorrect(engine);
        }
        expect(engine.isGameOver()).toBe(true);
    });
});
