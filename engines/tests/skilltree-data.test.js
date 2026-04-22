/**
 * Data validation tests for Skill Tree — base elements and per-paragraph data files.
 *
 * Per-paragraph tests are driven by the target's deploy-config.json manifest:
 * only paragraphs that declare a `skilltree` block participate. If MODULE_ROOT
 * has no manifest (e.g. tests run against the platform root itself), the
 * per-paragraph suite is skipped and only the base-elements + generator suites
 * run.
 */
const path = require('path');
const fs = require('fs');
const elements = require('../skilltree/base-elements');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '..', '..');

let skilltreeParagraphs = [];
try {
    const { loadConfig } = require('../../build-scripts/lib/lib-deploy-config');
    const cfg = loadConfig(MODULE_ROOT);
    skilltreeParagraphs = cfg.paragraphs
        .filter(p => p.skilltree !== undefined)
        .map(p => p.id);
} catch (e) {
    // No manifest at MODULE_ROOT — per-paragraph tests are a no-op.
}

// ── Base elements validation ──────────────────────────────────────

describe('base-elements', () => {
    test('exports SKILLS array with 37 entries', () => {
        expect(elements.SKILLS).toHaveLength(37);
    });

    test('exports LAYER_NAMES with 6 entries', () => {
        expect(elements.LAYER_NAMES).toHaveLength(6);
    });

    test('exports LAYER_COLORS with 6 entries', () => {
        expect(elements.LAYER_COLORS).toHaveLength(6);
        for (const lc of elements.LAYER_COLORS) {
            expect(lc.bg).toBeTruthy();
            expect(lc.text).toBeTruthy();
            expect(lc.glow).toBeTruthy();
        }
    });

    test('exports GEN object with 37 generators', () => {
        expect(Object.keys(elements.GEN)).toHaveLength(37);
    });

    test('all skill IDs are unique', () => {
        const ids = elements.SKILLS.map(s => s.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    test('all skills have required fields', () => {
        for (const skill of elements.SKILLS) {
            expect(skill.id).toBeTruthy();
            expect(skill.name).toBeTruthy();
            expect(typeof skill.layer).toBe('number');
            expect(Array.isArray(skill.needs)).toBe(true);
            expect(skill.desc).toBeTruthy();
        }
    });

    test('all prerequisite IDs reference existing skills', () => {
        const ids = new Set(elements.SKILLS.map(s => s.id));
        for (const skill of elements.SKILLS) {
            for (const need of skill.needs) {
                expect(ids.has(need)).toBe(true);
            }
        }
    });

    test('prerequisites form a DAG (no cycles)', () => {
        const skills = {};
        for (const s of elements.SKILLS) skills[s.id] = s;

        function hasCycle(id, visited, stack) {
            visited.add(id);
            stack.add(id);
            for (const need of (skills[id] ? skills[id].needs : [])) {
                if (!visited.has(need)) {
                    if (hasCycle(need, visited, stack)) return true;
                } else if (stack.has(need)) {
                    return true;
                }
            }
            stack.delete(id);
            return false;
        }

        const visited = new Set();
        for (const s of elements.SKILLS) {
            if (!visited.has(s.id)) {
                expect(hasCycle(s.id, visited, new Set())).toBe(false);
            }
        }
    });

    test('layer counts: L0=5, L1=10, L2=3, L3=10, L4=4, L5=5', () => {
        const counts = [0, 0, 0, 0, 0, 0];
        for (const s of elements.SKILLS) counts[s.layer]++;
        expect(counts).toEqual([5, 10, 3, 10, 4, 5]);
    });
});

// ── Generator stress tests ────────────────────────────────────────

describe('exercise generators', () => {
    const RUNS = 20;

    for (const skill of elements.SKILLS) {
        test(`GEN.${skill.id} produces valid exercises (${RUNS} runs)`, () => {
            const gen = elements.GEN[skill.id];
            expect(gen).toBeDefined();

            for (let i = 0; i < RUNS; i++) {
                const ex = gen();
                expect(ex).toBeTruthy();
                expect(ex.context).toBeTruthy();
                expect(Array.isArray(ex.steps)).toBe(true);
                expect(ex.steps.length).toBeGreaterThanOrEqual(1);

                for (const step of ex.steps) {
                    expect(step.q).toBeTruthy();
                    expect(step.hint).toBeTruthy();
                    expect(step.expl).toBeTruthy();
                    if (step.mode === 'mc') {
                        expect(Array.isArray(step.options)).toBe(true);
                        expect(step.options.length).toBe(4);
                        expect(typeof step.correctIdx).toBe('number');
                        expect(step.correctIdx).toBeGreaterThanOrEqual(0);
                        expect(step.correctIdx).toBeLessThan(step.options.length);
                    } else if (step.mode === 'order') {
                        expect(Array.isArray(step.blocks)).toBe(true);
                        expect(step.blocks.length).toBeGreaterThanOrEqual(3);
                        expect(Array.isArray(step.correctOrder)).toBe(true);
                        expect(step.correctOrder.length).toBe(step.blocks.length);
                    } else if (step.mode === 'error') {
                        expect(Array.isArray(step.shownSteps)).toBe(true);
                        expect(step.shownSteps.length).toBeGreaterThanOrEqual(3);
                        var errorCount = step.shownSteps.filter(function(s) { return s.isError; }).length;
                        expect(errorCount).toBe(1);
                    } else {
                        expect(typeof step.a).toBe('number');
                        expect(isFinite(step.a)).toBe(true);
                    }
                }
            }
        });
    }
});

// ── Per-paragraph data files ──────────────────────────────────────

const perParagraphDescribe = skilltreeParagraphs.length > 0 ? describe : describe.skip;

perParagraphDescribe('per-paragraph data files', () => {
    const dataDir = path.join(MODULE_ROOT, 'shared', 'skilltree');
    const validIds = new Set(elements.SKILLS.map(s => s.id));

    test('all data files exist', () => {
        for (const parNr of skilltreeParagraphs) {
            const filePath = path.join(dataDir, parNr + '.js');
            expect(fs.existsSync(filePath)).toBe(true);
        }
    });

    for (const parNr of skilltreeParagraphs) {
        test(`${parNr}.js sets valid SKILL_TREE_DATA`, () => {
            // Simulate browser global
            const code = fs.readFileSync(path.join(dataDir, parNr + '.js'), 'utf8');
            const window = {};
            const fn = new Function('window', code);
            fn(window);

            expect(window.SKILL_TREE_DATA).toBeDefined();
            expect(window.SKILL_TREE_DATA.parNr).toBe(parNr);
            expect(window.SKILL_TREE_DATA.parName).toBeTruthy();

            const active = window.SKILL_TREE_DATA.activeSkills;
            if (active !== null) {
                expect(Array.isArray(active)).toBe(true);
                expect(active.length).toBeGreaterThanOrEqual(1);
                for (const id of active) {
                    expect(validIds.has(id)).toBe(true);
                }
            }
        });
    }
});
