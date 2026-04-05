/**
 * Data validation tests for reasoning game question files.
 */
const fs = require('fs');
const path = require('path');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '..', '..');
const REASONING_DIR = path.join(MODULE_ROOT, 'shared', 'reasoning');

function loadAllReasoningData() {
    const files = fs.readdirSync(REASONING_DIR).filter(f => f.endsWith('.js') && f !== 'meta-categories.js').sort();
    const result = [];
    for (const file of files) {
        const content = fs.readFileSync(path.join(REASONING_DIR, file), 'utf8');
        const fn = new Function(content + '\nreturn { csv: REASONING_CSV, meta: REASONING_META };');
        const data = fn();
        result.push({ file, parNr: file.replace('.js', ''), ...data });
    }
    return result;
}

// Simple CSV parser for validation
function parseCSV(csvString) {
    const lines = csvString.trim().split('\n');
    if (lines.length < 2) return { headers: [], rows: [] };
    const headers = lines[0].split(';').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        rows.push(line);
    }
    return { headers, rows, rowCount: rows.length };
}

const REQUIRED_COLUMNS = [
    'id', 'structure_type', 'structure_label', 'problem_text',
    'step_1_label', 'step_1_detail', 'step_2_label', 'step_2_detail',
    'step_3_label', 'step_3_detail',
    'distractor_1_label', 'distractor_1_detail',
    'distractor_2_label', 'distractor_2_detail',
    'distractor_3_label', 'distractor_3_detail',
    'subq_1', 'subq_2', 'subq_3', 'subq_distractor_1', 'subq_distractor_2',
    'error_step_index', 'error_wrong_label', 'error_wrong_detail',
    'flow_1_type', 'flow_1_text', 'flow_2_type', 'flow_2_text',
    'flow_3_type', 'flow_3_text', 'flow_4_type', 'flow_4_text',
    'flow_5_type', 'flow_5_text'
];

const VALID_FLOW_TYPES = {
    'arithmetic': ['given', 'operation'],
    'economics': ['cause', 'reasoning', 'effect'],
    'math-economics': ['given', 'step', 'result']
};

const allData = loadAllReasoningData();

describe('reasoning data files', () => {
    test('at least 1 data file exists', () => {
        expect(allData.length).toBeGreaterThanOrEqual(1);
    });
});

describe.each(allData)('$parNr ($file)', ({ parNr, csv, meta }) => {
    const parsed = parseCSV(csv);

    test('has valid meta', () => {
        expect(meta.parNr).toBe(parNr);
        expect(typeof meta.parName).toBe('string');
        expect(meta.parName.length).toBeGreaterThan(0);
        expect(['arithmetic', 'economics', 'math-economics']).toContain(meta.domain);
    });

    test('has all required CSV columns', () => {
        for (const col of REQUIRED_COLUMNS) {
            expect(parsed.headers).toContain(col);
        }
    });

    test('has at least 6 problems', () => {
        expect(parsed.rowCount).toBeGreaterThanOrEqual(6);
    });

    test('can be parsed by ReasoningEngine', () => {
        const ReasoningEngine = require('../reasoning-engine');
        expect(() => {
            new ReasoningEngine({
                csvString: csv,
                domain: meta.domain,
                roundsPerGame: 3
            });
        }).not.toThrow();
    });

    test('has at least 3 structure types with 2+ problems each', () => {
        const ReasoningEngine = require('../reasoning-engine');
        const engine = new ReasoningEngine({
            csvString: csv,
            domain: meta.domain,
            roundsPerGame: 3
        });
        const types = engine.getStructureTypes();
        expect(types.length).toBeGreaterThanOrEqual(3);
        const typesWithEnough = types.filter(t => t.count >= 2);
        expect(typesWithEnough.length).toBeGreaterThanOrEqual(3);
    });

    test('all 5 game modes can start', () => {
        const ReasoningEngine = require('../reasoning-engine');
        const engine = new ReasoningEngine({
            csvString: csv,
            domain: meta.domain,
            roundsPerGame: 3
        });
        for (let mode = 0; mode <= 4; mode++) {
            expect(() => {
                engine.startGame(mode);
                engine.getRound();
            }).not.toThrow();
        }
    });
});
