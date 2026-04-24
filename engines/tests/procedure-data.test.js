/**
 * Data validation tests for all procedure (stappenplan) data files.
 * Ensures every paragraph has structurally valid data with correct step types.
 */
const fs = require('fs');
const path = require('path');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(MODULE_ROOT, 'shared', 'procedure');

// Load all data files
function loadAllData() {
    if (!fs.existsSync(DATA_DIR)) return [];
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.js')).sort();
    const result = [];
    for (const file of files) {
        const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
        const fn = new Function(content + '\nreturn PROCEDURE_DATA;');
        const data = fn();
        result.push({ file, parNr: file.replace('.js', ''), data });
    }
    return result;
}

const allData = loadAllData();
const describeOrSkip = allData.length > 0 ? describe : describe.skip;

describeOrSkip('procedure data files', () => {
    test('at least 1 data file exists', () => {
        expect(allData.length).toBeGreaterThanOrEqual(1);
    });
});

if (allData.length > 0) describe.each(allData)('$parNr ($file)', ({ parNr, data }) => {

    // ── Meta ────────────────────────────────────────────────────────
    test('has meta with parNr matching filename', () => {
        expect(data.meta).toBeDefined();
        expect(data.meta.parNr).toBe(parNr);
        expect(typeof data.meta.parName).toBe('string');
        expect(data.meta.parName.length).toBeGreaterThan(0);
    });

    // ── Procedures array ────────────────────────────────────────────
    test('has at least 1 procedure', () => {
        expect(Array.isArray(data.procedures)).toBe(true);
        expect(data.procedures.length).toBeGreaterThanOrEqual(1);
    });

    test('procedure IDs are unique', () => {
        const ids = data.procedures.map(p => p.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    // ── Each procedure ──────────────────────────────────────────────
    describe.each(data.procedures.map((p, i) => ({ ...p, _idx: i })))('procedure "$title" ($id)', (proc) => {

        test('has required fields', () => {
            expect(typeof proc.id).toBe('string');
            expect(proc.id.length).toBeGreaterThan(0);
            expect(typeof proc.title).toBe('string');
            expect(proc.title.length).toBeGreaterThan(0);
            expect(typeof proc.icon).toBe('string');
            expect(typeof proc.description).toBe('string');
            expect(proc.description.length).toBeGreaterThan(0);
        });

        test('has at least 3 steps (given + choose + given)', () => {
            expect(Array.isArray(proc.steps)).toBe(true);
            expect(proc.steps.length).toBeGreaterThanOrEqual(3);
        });

        test('first step is given', () => {
            expect(proc.steps[0].type).toBe('given');
        });

        test('has at least 1 choose step', () => {
            const chooseSteps = proc.steps.filter(s => s.type === 'choose');
            expect(chooseSteps.length).toBeGreaterThanOrEqual(1);
        });

        test('all steps have valid type and label', () => {
            for (const step of proc.steps) {
                expect(['given', 'choose']).toContain(step.type);
                expect(typeof step.label).toBe('string');
                expect(step.label.length).toBeGreaterThan(0);
            }
        });

        test('given steps have text', () => {
            const givenSteps = proc.steps.filter(s => s.type === 'given');
            for (const step of givenSteps) {
                expect(typeof step.text).toBe('string');
                expect(step.text.length).toBeGreaterThan(0);
            }
        });

        test('choose steps have 2+ options with exactly 1 correct', () => {
            const chooseSteps = proc.steps.filter(s => s.type === 'choose');
            for (const step of chooseSteps) {
                expect(Array.isArray(step.options)).toBe(true);
                expect(step.options.length).toBeGreaterThanOrEqual(2);

                let correctCount = 0;
                for (const opt of step.options) {
                    expect(typeof opt.text).toBe('string');
                    expect(opt.text.length).toBeGreaterThan(0);
                    if (opt.correct === true) correctCount++;
                }
                expect(correctCount).toBe(1);
            }
        });

        test('wrong options have feedback strings', () => {
            const chooseSteps = proc.steps.filter(s => s.type === 'choose');
            for (const step of chooseSteps) {
                for (const opt of step.options) {
                    if (!opt.correct) {
                        expect(typeof opt.feedback).toBe('string');
                        expect(opt.feedback.length).toBeGreaterThan(0);
                    }
                }
            }
        });
    });
});
