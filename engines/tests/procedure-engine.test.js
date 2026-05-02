/**
 * Unit tests for ProcedureEngine.
 */

// Mock localStorage for Node.js
global.localStorage = {
    _store: {},
    getItem(key) { return this._store[key] || null; },
    setItem(key, val) { this._store[key] = val; },
    removeItem(key) { delete this._store[key]; },
    clear() { this._store = {}; }
};

const ProcedureEngine = require('../procedure-engine');

// Minimal valid test data
const TEST_DATA = {
    procedures: [
        {
            id: 'test-proc',
            title: 'Test Procedure',
            icon: 'fa-test',
            description: 'A test procedure',
            steps: [
                { type: 'given', label: 'Start', text: 'Given step' },
                {
                    type: 'choose', label: 'Step 1',
                    options: [
                        { text: 'Correct answer', correct: true },
                        { text: 'Wrong answer 1', correct: false, feedback: 'Feedback 1' },
                        { text: 'Wrong answer 2', correct: false, feedback: 'Feedback 2' }
                    ]
                },
                {
                    type: 'choose', label: 'Step 2',
                    options: [
                        { text: 'Wrong A', correct: false, feedback: 'Feedback A' },
                        { text: 'Correct B', correct: true }
                    ]
                },
        { type: 'given', label: 'End', text: 'Conclusion' }
            ]
        },
        {
            id: 'formal-proc',
            title: 'Formal Procedure',
            icon: 'fa-test',
            description: 'A procedure with PV step mapping',
            procedure_template_id: 'choose_by_opportunity_cost_flow',
            steps: [
                { type: 'given', label: 'Step 1', text: 'Given formal step', formal_step_id: 'list_alternatives' },
                {
                    type: 'choose', label: 'Step 2', formal_step_id: 'calculate_payoffs',
                    options: [
                        { text: 'Right', correct: true },
                        { text: 'Wrong', correct: false, feedback: 'Nope' }
                    ]
                },
                { type: 'given', label: 'Step 3', text: 'Done', formal_step_id: 'rank_not_chosen' }
            ]
        },
        {
            id: 'test-proc-2',
            title: 'Second Procedure',
            icon: 'fa-test',
            description: 'Another procedure',
            steps: [
                { type: 'given', label: 'Start', text: 'Begin' },
                {
                    type: 'choose', label: 'Only step',
                    options: [
                        { text: 'Right', correct: true },
                        { text: 'Wrong', correct: false, feedback: 'Nope' }
                    ]
                },
                { type: 'given', label: 'End', text: 'Done' }
            ]
        }
    ]
};

beforeEach(() => {
    localStorage.clear();
});

describe('ProcedureEngine', () => {

    test('constructor initialises with procedures', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        expect(engine.procedures).toHaveLength(3);
        expect(engine.current).toBeNull();
        expect(engine.checked).toBe(false);
    });

    test('startProcedure sets current and resets state', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        const proc = engine.startProcedure(0);
        expect(proc).toBe(TEST_DATA.procedures[0]);
        expect(engine.current).toBe(proc);
        expect(engine.checked).toBe(false);
        expect(engine.selections).toHaveLength(4);
        expect(engine.selections.every(s => s === null)).toBe(true);
    });

    test('startProcedure returns null for invalid index', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        expect(engine.startProcedure(99)).toBeNull();
    });

    test('getShuffledOptions returns shuffled options for choose steps', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        engine.startProcedure(0);
        expect(engine.getShuffledOptions(0)).toBeNull();     // given step
        expect(engine.getShuffledOptions(1)).toHaveLength(3); // choose step with 3 options
        expect(engine.getShuffledOptions(2)).toHaveLength(2); // choose step with 2 options
        expect(engine.getShuffledOptions(3)).toBeNull();      // given step
    });

    test('selectOption updates selections', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        engine.startProcedure(0);
        expect(engine.selectOption(1, 0)).toBe(true);
        expect(engine.selections[1]).toBe(0);
    });

    test('selectOption rejects given steps', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        engine.startProcedure(0);
        expect(engine.selectOption(0, 0)).toBe(false); // given step
    });

    test('selectOption rejects after checking', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        engine.startProcedure(0);
        engine.selectOption(1, 0);
        engine.selectOption(2, 0);
        engine.checkAnswers();
        expect(engine.selectOption(1, 1)).toBe(false);
    });

    test('isAllSelected returns false when not all chosen', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        engine.startProcedure(0);
        engine.selectOption(1, 0);
        expect(engine.isAllSelected()).toBe(false);
    });

    test('isAllSelected returns true when all chosen', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        engine.startProcedure(0);
        engine.selectOption(1, 0);
        engine.selectOption(2, 0);
        expect(engine.isAllSelected()).toBe(true);
    });

    test('checkAnswers returns null if not all selected', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        engine.startProcedure(0);
        engine.selectOption(1, 0);
        expect(engine.checkAnswers()).toBeNull();
    });

    test('checkAnswers returns score and sets checked', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        engine.startProcedure(0);
        engine.selectOption(1, 0);
        engine.selectOption(2, 0);
        const score = engine.checkAnswers();
        expect(score).not.toBeNull();
        expect(score.total).toBe(2);
        expect(typeof score.correct).toBe('number');
        expect(typeof score.perfect).toBe('boolean');
        expect(engine.checked).toBe(true);
    });

    test('getChooseStepCount returns correct count', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        engine.startProcedure(0);
        expect(engine.getChooseStepCount()).toBe(2);
    });

    test('getFormalStepId returns optional PV formal step ids', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        engine.startProcedure(1);
        expect(engine.getFormalStepId(0)).toBe('list_alternatives');
        expect(engine.getFormalStepId(1)).toBe('calculate_payoffs');
        expect(engine.getFormalStepId(99)).toBeNull();
    });

    test('getFormalAlignmentStatus reports mapped procedure data', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        engine.startProcedure(1);
        expect(engine.getFormalAlignmentStatus()).toEqual({
            procedure_id: 'formal-proc',
            procedure_template_id: 'choose_by_opportunity_cost_flow',
            status: 'mapped',
            step_count: 3,
            mapped_step_count: 3,
            unmapped_step_count: 0,
            unmapped_step_indexes: [],
            formal_step_ids: ['list_alternatives', 'calculate_payoffs', 'rank_not_chosen']
        });
    });

    test('getFormalAlignmentStatus reports legacy unmapped procedure data', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        engine.startProcedure(0);
        expect(engine.getFormalAlignmentStatus()).toMatchObject({
            procedure_id: 'test-proc',
            procedure_template_id: null,
            status: 'legacy_unmapped',
            step_count: 4,
            mapped_step_count: 0,
            unmapped_step_count: 4
        });
    });

    test('reset restarts current procedure', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        engine.startProcedure(0);
        engine.selectOption(1, 0);
        engine.selectOption(2, 0);
        engine.checkAnswers();
        engine.reset();
        expect(engine.checked).toBe(false);
        expect(engine.selections.every(s => s === null)).toBe(true);
    });

    test('getBestScore returns null before any check', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        expect(engine.getBestScore('test-proc')).toBeNull();
    });

    test('getBestScore persists after checkAnswers', () => {
        const engine = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '0.0.0' });
        engine.startProcedure(0);
        engine.selectOption(1, 0);
        engine.selectOption(2, 0);
        engine.checkAnswers();
        const best = engine.getBestScore('test-proc');
        expect(best).not.toBeNull();
        expect(best.total).toBe(2);
    });

    test('scores persist across engine instances', () => {
        const engine1 = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '1.1.1' });
        engine1.startProcedure(0);
        engine1.selectOption(1, 0);
        engine1.selectOption(2, 0);
        engine1.checkAnswers();

        const engine2 = new ProcedureEngine({ procedures: TEST_DATA.procedures, parNr: '1.1.1' });
        expect(engine2.getBestScore('test-proc')).not.toBeNull();
    });
});
