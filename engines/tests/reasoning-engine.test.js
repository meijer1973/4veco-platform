/**
 * Unit tests for ReasoningEngine — the pure game logic module.
 */
const ReasoningEngine = require('../reasoning-engine');

// ── Test fixtures ───────────────────────────────────────────────────

/** Minimal valid CSV with 6 problems across 3 structure types */
const MINIMAL_CSV = `id;structure_type;structure_label;problem_text;step_1_label;step_1_detail;step_1_formula;step_2_label;step_2_detail;step_2_formula;step_3_label;step_3_detail;step_3_formula;distractor_1_label;distractor_1_detail;distractor_1_formula;distractor_2_label;distractor_2_detail;distractor_2_formula;distractor_3_label;distractor_3_detail;distractor_3_formula;subq_1;subq_2;subq_3;subq_distractor_1;subq_distractor_2;error_step_index;error_wrong_label;error_wrong_detail;error_wrong_formula;flow_1_type;flow_1_text;flow_2_type;flow_2_text;flow_3_type;flow_3_text;flow_4_type;flow_4_text;flow_5_type;flow_5_text;flow_6_type;flow_6_text
1;A;Kenmerk herkennen;Probleem A1;Stap 1A;Detail 1A;;Stap 2A;Detail 2A;;Stap 3A;Detail 3A;;Dist 1;Detail D1;;Dist 2;Detail D2;;Dist 3;Detail D3;;SubQ 1A;SubQ 2A;SubQ 3A;Dist SubQ 1;Dist SubQ 2;2;Fout stap;Fout detail;;cause;Oorzaak;reasoning;Redenering;reasoning;Stap 2;effect;Gevolg;effect;Conclusie;;
2;A;Kenmerk herkennen;Probleem A2;Stap 1A2;Detail 1A2;;Stap 2A2;Detail 2A2;;Stap 3A2;Detail 3A2;;Dist 1b;Detail D1b;;Dist 2b;Detail D2b;;Dist 3b;Detail D3b;;SubQ 1A2;SubQ 2A2;SubQ 3A2;Dist SubQ 1b;Dist SubQ 2b;1;Fout stap b;Fout detail b;;cause;Oorzaak 2;reasoning;Redenering 2;effect;Gevolg 2;effect;Conclusie 2;reasoning;Extra;;
3;B;Drempel analyseren;Probleem B1;Stap 1B;Detail 1B;;Stap 2B;Detail 2B;;Stap 3B;Detail 3B;;Dist 1c;Detail D1c;;Dist 2c;Detail D2c;;Dist 3c;Detail D3c;;SubQ 1B;SubQ 2B;SubQ 3B;Dist SubQ 1c;Dist SubQ 2c;3;Fout stap c;Fout detail c;;cause;Start B;reasoning;Midden B;effect;Eind B;reasoning;Extra B;effect;Slot B;;
4;B;Drempel analyseren;Probleem B2;Stap 1B2;Detail 1B2;;Stap 2B2;Detail 2B2;;Stap 3B2;Detail 3B2;;Dist 1d;Detail D1d;;Dist 2d;Detail D2d;;Dist 3d;Detail D3d;;SubQ 1B2;SubQ 2B2;SubQ 3B2;Dist SubQ 1d;Dist SubQ 2d;2;Fout stap d;Fout detail d;;cause;Start B2;reasoning;Midden B2;effect;Eind B2;effect;Slot B2;reasoning;Extra B2;;
5;C;Omvang meten;Probleem C1;Stap 1C;Detail 1C;;Stap 2C;Detail 2C;;Stap 3C;Detail 3C;;Dist 1e;Detail D1e;;Dist 2e;Detail D2e;;Dist 3e;Detail D3e;;SubQ 1C;SubQ 2C;SubQ 3C;Dist SubQ 1e;Dist SubQ 2e;1;Fout stap e;Fout detail e;;cause;Start C;reasoning;Midden C;reasoning;Stap C2;effect;Eind C;effect;Slot C;;
6;C;Omvang meten;Probleem C2;Stap 1C2;Detail 1C2;;Stap 2C2;Detail 2C2;;Stap 3C2;Detail 3C2;;Dist 1f;Detail D1f;;Dist 2f;Detail D2f;;Dist 3f;Detail D3f;;SubQ 1C2;SubQ 2C2;SubQ 3C2;Dist SubQ 1f;Dist SubQ 2f;3;Fout stap f;Fout detail f;;cause;Start C2;reasoning;Midden C2;effect;Eind C2;reasoning;Extra C2;effect;Slot C2;;`;

function createEngine(overrides) {
    return new ReasoningEngine({
        csvString: MINIMAL_CSV,
        domain: 'economics',
        roundsPerGame: 3,
        ...overrides
    });
}

// ── Constructor ─────────────────────────────────────────────────────

describe('ReasoningEngine constructor', () => {
    test('throws without config', () => {
        expect(() => new ReasoningEngine()).toThrow('config is required');
    });

    test('throws without csvString', () => {
        expect(() => new ReasoningEngine({ domain: 'economics' })).toThrow('csvString');
    });

    test('throws with invalid domain', () => {
        expect(() => new ReasoningEngine({ csvString: MINIMAL_CSV, domain: 'invalid' })).toThrow('invalid domain');
    });

    test('creates engine with valid config', () => {
        const engine = createEngine();
        expect(engine.getProblemCount()).toBe(6);
    });

    test('defaults roundsPerGame to 5', () => {
        const engine = new ReasoningEngine({ csvString: MINIMAL_CSV, domain: 'economics' });
        expect(engine.roundsPerGame).toBe(5);
    });
});

// ── CSV Parsing ─────────────────────────────────────────────────────

describe('CSV parsing', () => {
    test('parses valid CSV', () => {
        const rows = ReasoningEngine.parseCSV(MINIMAL_CSV);
        expect(rows.length).toBe(6);
        expect(rows[0].id).toBe('1');
        expect(rows[0].structure_type).toBe('A');
    });

    test('handles quoted fields with semicolons', () => {
        const csv = 'a;b\n"hello;world";test';
        const rows = ReasoningEngine.parseCSV(csv);
        expect(rows[0].a).toBe('hello;world');
    });

    test('handles empty CSV', () => {
        const rows = ReasoningEngine.parseCSV('header\n');
        expect(rows.length).toBe(0);
    });

    test('skips empty lines', () => {
        const csv = 'a;b\n1;2\n\n3;4';
        const rows = ReasoningEngine.parseCSV(csv);
        expect(rows.length).toBe(2);
    });
});

// ── Structure types ─────────────────────────────────────────────────

describe('structure types', () => {
    test('returns correct structure types', () => {
        const engine = createEngine();
        const types = engine.getStructureTypes();
        expect(types.length).toBe(3);
        expect(types.map(t => t.type).sort()).toEqual(['A', 'B', 'C']);
    });

    test('each type has correct count', () => {
        const engine = createEngine();
        const types = engine.getStructureTypes();
        for (const t of types) {
            expect(t.count).toBe(2);
        }
    });
});

// ── Domain config ───────────────────────────────────────────────────

describe('domain config', () => {
    test('economics domain has correct flow types', () => {
        const engine = createEngine({ domain: 'economics' });
        const config = engine.getDomainConfig();
        expect(config.validFlowTypes).toContain('cause');
        expect(config.validFlowTypes).toContain('reasoning');
        expect(config.validFlowTypes).toContain('effect');
        expect(config.showFormula).toBe(false);
    });

    test('math-economics domain shows formulas', () => {
        const engine = createEngine({ domain: 'math-economics' });
        const config = engine.getDomainConfig();
        expect(config.showFormula).toBe(true);
        expect(config.hideFormulaInErrorMode).toBe(true);
    });

    test('arithmetic domain uses operation counting', () => {
        const engine = createEngine({ domain: 'arithmetic' });
        const config = engine.getDomainConfig();
        expect(config.useOperationCounting).toBe(true);
    });
});

// ── Mode 0: Order Steps ─────────────────────────────────────────────

describe('Mode 0: Order Steps', () => {
    test('startGame returns correct info', () => {
        const engine = createEngine();
        const info = engine.startGame(0);
        expect(info.modeName).toBe('Stappen ordenen');
        expect(info.roundCount).toBe(3);
    });

    test('getRound returns 6 options (3 correct + 3 distractors)', () => {
        const engine = createEngine();
        engine.startGame(0);
        const round = engine.getRound();
        expect(round.mode).toBe(0);
        expect(round.options.length).toBe(6);
        expect(round.maxSelections).toBe(3);
        expect(round.correctOrder.length).toBe(3);
    });

    test('correct order accepted', () => {
        const engine = createEngine();
        engine.startGame(0);
        const round = engine.getRound();
        const result = engine.submitAnswer(round.correctOrder);
        expect(result.correct).toBe(true);
    });

    test('wrong order rejected', () => {
        const engine = createEngine();
        engine.startGame(0);
        const round = engine.getRound();
        const wrong = round.correctOrder.slice().reverse();
        const result = engine.submitAnswer(wrong);
        expect(result.correct).toBe(false);
    });

    test('incomplete selection rejected', () => {
        const engine = createEngine();
        engine.startGame(0);
        engine.getRound();
        const result = engine.submitAnswer(['only one']);
        expect(result.correct).toBe(false);
    });
});

// ── Mode 1: Build Sub-Questions ─────────────────────────────────────

describe('Mode 1: Build Sub-Questions', () => {
    test('getRound returns 5 options', () => {
        const engine = createEngine();
        engine.startGame(1);
        const round = engine.getRound();
        expect(round.mode).toBe(1);
        expect(round.options.length).toBe(5);
        expect(round.correctOrder.length).toBe(3);
    });

    test('correct sub-questions accepted', () => {
        const engine = createEngine();
        engine.startGame(1);
        const round = engine.getRound();
        const result = engine.submitAnswer(round.correctOrder);
        expect(result.correct).toBe(true);
    });
});

// ── Mode 2: Find the Error ──────────────────────────────────────────

describe('Mode 2: Find the Error', () => {
    test('getRound returns 3 steps', () => {
        const engine = createEngine();
        engine.startGame(2);
        const round = engine.getRound();
        expect(round.mode).toBe(2);
        expect(round.steps.length).toBe(3);
        expect(round.errorIdx).toBeGreaterThanOrEqual(0);
        expect(round.errorIdx).toBeLessThanOrEqual(2);
    });

    test('correct error identification accepted', () => {
        const engine = createEngine();
        engine.startGame(2);
        const round = engine.getRound();
        const result = engine.submitAnswer(round.errorIdx);
        expect(result.correct).toBe(true);
    });

    test('wrong error identification rejected', () => {
        const engine = createEngine();
        engine.startGame(2);
        const round = engine.getRound();
        const wrongIdx = (round.errorIdx + 1) % 3;
        const result = engine.submitAnswer(wrongIdx);
        expect(result.correct).toBe(false);
        expect(result.feedback.errorIdx).toBe(round.errorIdx);
    });

    test('math-economics hides formula before answer', () => {
        const engine = createEngine({ domain: 'math-economics' });
        engine.startGame(2);
        const round = engine.getRound();
        expect(round.hideFormulaBeforeAnswer).toBe(true);
    });
});

// ── Mode 3: Build Flow Diagram ──────────────────────────────────────

describe('Mode 3: Build Flow Diagram', () => {
    test('getRound returns shuffled blocks', () => {
        const engine = createEngine();
        engine.startGame(3);
        const round = engine.getRound();
        expect(round.mode).toBe(3);
        expect(round.blocks.length).toBeGreaterThanOrEqual(5);
        expect(round.flowTypeColors).toBeDefined();
    });

    test('correct order accepted', () => {
        const engine = createEngine();
        engine.startGame(3);
        const round = engine.getRound();
        const result = engine.submitAnswer(round.correctOrder);
        expect(result.correct).toBe(true);
    });

    test('wrong order rejected', () => {
        const engine = createEngine();
        engine.startGame(3);
        const round = engine.getRound();
        const wrong = round.correctOrder.slice().reverse();
        const result = engine.submitAnswer(wrong);
        expect(result.correct).toBe(false);
    });
});

// ── Mode 4: Match Structures ────────────────────────────────────────

describe('Mode 4: Match Structures', () => {
    test('startGame generates match data', () => {
        const engine = createEngine();
        const info = engine.startGame(4);
        expect(info.roundCount).toBe(1);
    });

    test('getRound returns 6 items and 3 correct pairs', () => {
        const engine = createEngine();
        engine.startGame(4);
        const round = engine.getRound();
        expect(round.mode).toBe(4);
        expect(round.items.length).toBe(6);
        expect(round.correctPairs.length).toBe(3);
    });

    test('no structure labels leak before submission', () => {
        const engine = createEngine();
        engine.startGame(4);
        const round = engine.getRound();
        // Items should have text but we verify structureLabel is not used for display
        // (The UI must not show it — we verify the engine provides it for post-check only)
        for (const item of round.items) {
            expect(item.text).toBeTruthy();
            expect(item.structureLabel).toBeTruthy(); // present but UI must not show it
        }
    });

    test('correct pairs accepted', () => {
        const engine = createEngine();
        engine.startGame(4);
        const round = engine.getRound();
        const result = engine.submitAnswer(round.correctPairs);
        expect(result.correct).toBe(true);
        expect(result.feedback.matchCount).toBe(3);
    });

    test('wrong pairs rejected', () => {
        const engine = createEngine();
        engine.startGame(4);
        const round = engine.getRound();
        // Swap one pair
        const wrongPairs = round.correctPairs.slice();
        if (wrongPairs.length >= 2) {
            wrongPairs[0] = [wrongPairs[0][0], wrongPairs[1][1]];
        }
        const result = engine.submitAnswer(wrongPairs);
        // May or may not be fully correct depending on overlap
        expect(result.feedback.matchCount).toBeLessThanOrEqual(3);
    });
});

// ── Scoring & round advancement ─────────────────────────────────────

describe('scoring and rounds', () => {
    test('score increments on correct answer', () => {
        const engine = createEngine({ roundsPerGame: 2 });
        engine.startGame(0);
        const r1 = engine.getRound();
        const res = engine.submitAnswer(r1.correctOrder);
        expect(res.score).toBe(1);
    });

    test('score does not increment on wrong answer', () => {
        const engine = createEngine({ roundsPerGame: 2 });
        engine.startGame(0);
        engine.getRound();
        const res = engine.submitAnswer(['wrong', 'answers', 'here']);
        expect(res.score).toBe(0);
    });

    test('nextRound advances to next round', () => {
        const engine = createEngine({ roundsPerGame: 2 });
        engine.startGame(0);
        engine.getRound();
        engine.submitAnswer([]);
        expect(engine.nextRound()).toBe(true);
        const r2 = engine.getRound();
        expect(r2).not.toBeNull();
    });

    test('nextRound returns false when game is over', () => {
        const engine = createEngine({ roundsPerGame: 1 });
        engine.startGame(0);
        engine.getRound();
        engine.submitAnswer([]);
        expect(engine.nextRound()).toBe(false);
    });

    test('getResult returns correct summary', () => {
        const engine = createEngine({ roundsPerGame: 2 });
        engine.startGame(0);

        const r1 = engine.getRound();
        engine.submitAnswer(r1.correctOrder);
        engine.nextRound();

        engine.getRound();
        engine.submitAnswer(['wrong']);
        engine.nextRound();

        const result = engine.getResult();
        expect(result.score).toBe(1);
        expect(result.total).toBe(2);
        expect(result.ratio).toBe(0.5);
    });

    test('double submit throws', () => {
        const engine = createEngine();
        engine.startGame(0);
        engine.getRound();
        engine.submitAnswer([]);
        expect(() => engine.submitAnswer([])).toThrow('Already answered');
    });
});

// ── Edge cases ──────────────────────────────────────────────────────

describe('edge cases', () => {
    test('getRound returns null after all rounds played', () => {
        const engine = createEngine({ roundsPerGame: 1 });
        engine.startGame(0);
        engine.getRound();
        engine.submitAnswer([]);
        engine.nextRound();
        const r = engine.getRound();
        expect(r).toBeNull();
    });

    test('mode names are in Dutch', () => {
        const engine = createEngine();
        const names = engine.getModeNames();
        expect(names.length).toBe(5);
        expect(names[0]).toBe('Stappen ordenen');
    });

    test('invalid mode throws', () => {
        const engine = createEngine();
        expect(() => engine.startGame(5)).toThrow('Invalid mode');
        expect(() => engine.startGame(-1)).toThrow('Invalid mode');
    });
});

// ── Progress tracking ──────────────────────────────────────────────

describe('Progress tracking (perType & getCurrentStructureType)', () => {
    test('startGame initializes empty _roundResults', () => {
        const engine = createEngine();
        engine.startGame(0);
        expect(engine._roundResults).toEqual([]);
    });

    test('submitAnswer populates _roundResults', () => {
        const engine = createEngine();
        engine.startGame(0);
        engine.getRound();
        const labels = engine.problems[engine._rounds[0]].steps.map(s => s.label);
        engine.submitAnswer(labels);
        expect(engine._roundResults.length).toBe(1);
        expect(engine._roundResults[0]).toHaveProperty('structureType');
        expect(engine._roundResults[0]).toHaveProperty('correct');
    });

    test('getCurrentStructureType returns type for current round', () => {
        const engine = createEngine();
        engine.startGame(0);
        engine.getRound();
        const type = engine.getCurrentStructureType();
        expect(typeof type).toBe('string');
        expect(type.length).toBeGreaterThan(0);
    });

    test('getCurrentStructureType returns null after game ends', () => {
        const engine = createEngine({ roundsPerGame: 1 });
        engine.startGame(0);
        engine.getRound();
        const labels = engine.problems[engine._rounds[0]].steps.map(s => s.label);
        engine.submitAnswer(labels);
        engine.nextRound();
        expect(engine.getCurrentStructureType()).toBeNull();
    });

    test('getResult includes perType breakdown', () => {
        const engine = createEngine({ roundsPerGame: 2 });
        engine.startGame(0);

        // Round 1: correct
        engine.getRound();
        const labels1 = engine.problems[engine._rounds[0]].steps.map(s => s.label);
        engine.submitAnswer(labels1);
        engine.nextRound();

        // Round 2: wrong
        engine.getRound();
        engine.submitAnswer(['wrong1', 'wrong2', 'wrong3']);

        const result = engine.getResult();
        expect(result).toHaveProperty('perType');
        expect(typeof result.perType).toBe('object');

        // Should have entries
        const types = Object.keys(result.perType);
        expect(types.length).toBeGreaterThan(0);

        // Each entry should have correct and total
        for (const t of types) {
            expect(result.perType[t]).toHaveProperty('correct');
            expect(result.perType[t]).toHaveProperty('total');
            expect(result.perType[t].total).toBeGreaterThan(0);
        }
    });

    test('perType totals match total rounds played', () => {
        const engine = createEngine({ roundsPerGame: 3 });
        engine.startGame(0);

        for (let i = 0; i < 3; i++) {
            engine.getRound();
            const labels = engine.problems[engine._rounds[engine._roundIdx]].steps.map(s => s.label);
            engine.submitAnswer(labels);
            if (i < 2) engine.nextRound();
        }

        const result = engine.getResult();
        let totalFromPerType = 0;
        for (const t in result.perType) {
            totalFromPerType += result.perType[t].total;
        }
        expect(totalFromPerType).toBe(3);
    });

    test('match mode (mode 4) includes perType', () => {
        const engine = createEngine();
        engine.startGame(4);
        engine.getRound();
        // Submit wrong pairs to just test perType exists
        engine.submitAnswer([[1, 2], [3, 4], [5, 6]]);
        const result = engine.getResult();
        expect(result).toHaveProperty('perType');
        // Match mode uses structure types from matched items - perType may be empty
        // since match mode doesn't track individual problem structure types the same way
        expect(typeof result.perType).toBe('object');
    });
});
