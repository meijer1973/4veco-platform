/**
 * Optional Procedure-Visual formal step ID checks for procedure data.
 *
 * Existing procedure-game data may remain legacy_unmapped. When a file opts
 * into formal_step_id, the fields must be strings and every procedure-level
 * procedure_template_id must also be a string.
 */
const fs = require('fs');
const path = require('path');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(MODULE_ROOT, 'shared', 'procedure');

function loadAllData() {
    if (!fs.existsSync(DATA_DIR)) return [];
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.js')).sort();
    return files.map((file) => {
        const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
        const fn = new Function(content + '\nreturn PROCEDURE_DATA;');
        return { file, parNr: file.replace('.js', ''), data: fn() };
    });
}

const allData = loadAllData();
const describeOrSkip = allData.length > 0 ? describe : describe.skip;

describeOrSkip('procedure formal_step_id optional contract', () => {
    test.each(allData)('$parNr optional formal fields are well-formed', ({ data }) => {
        for (const proc of data.procedures || []) {
            const steps = proc.steps || [];
            const mappedStepCount = steps.filter((step) => step.formal_step_id !== undefined).length;

            if (proc.procedure_template_id !== undefined) {
                expect(typeof proc.procedure_template_id).toBe('string');
                expect(proc.procedure_template_id.length).toBeGreaterThan(0);
            }

            for (const step of steps) {
                if (step.formal_step_id !== undefined) {
                    expect(typeof step.formal_step_id).toBe('string');
                    expect(step.formal_step_id).toMatch(/^[a-z][a-z0-9_]*$/);
                }
            }

            if (mappedStepCount > 0) {
                expect(typeof proc.procedure_template_id).toBe('string');
                expect(mappedStepCount).toBe(steps.length);
            }
        }
    });
});
