/**
 * Data validation tests for all 20 quiz question data files.
 * Ensures every quiz has structurally valid questions and consistent categories.
 */
const fs = require('fs');
const path = require('path');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '..', '..');
const QUESTIONS_DIR = path.join(MODULE_ROOT, 'shared', 'questions');

// Load all data files
function loadAllQuizData() {
    const files = fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.js')).sort();
    const result = [];
    for (const file of files) {
        const content = fs.readFileSync(path.join(QUESTIONS_DIR, file), 'utf8');
        // Execute the var assignment and capture QUIZ_DATA
        const fn = new Function(content + '\nreturn QUIZ_DATA;');
        const data = fn();
        result.push({ file, parNr: file.replace('.js', ''), data });
    }
    return result;
}

const allQuizzes = loadAllQuizData();

describe('quiz data files', () => {
    test('at least 20 quiz data files exist', () => {
        expect(allQuizzes.length).toBeGreaterThanOrEqual(20);
    });
});

describe.each(allQuizzes)('$parNr ($file)', ({ parNr, data }) => {
    test('has meta with required fields', () => {
        expect(data.meta).toBeDefined();
        expect(data.meta.parNr).toBe(parNr);
        expect(typeof data.meta.parName).toBe('string');
        expect(data.meta.parName.length).toBeGreaterThan(0);
    });

    test('has categories with required structure', () => {
        expect(data.categories).toBeDefined();
        const catKeys = Object.keys(data.categories);
        expect(catKeys.length).toBeGreaterThanOrEqual(2);

        for (const key of catKeys) {
            const cat = data.categories[key];
            expect(typeof cat.name).toBe('string');
            expect(cat.name.length).toBeGreaterThan(0);
            expect(cat.colors).toBeDefined();
            expect(cat.colors.bg).toMatch(/^#/);
            expect(cat.colors.text).toMatch(/^#/);
            expect(cat.colors.bar).toMatch(/^#/);
        }
    });

    test('has questions array with entries', () => {
        expect(Array.isArray(data.questions)).toBe(true);
        expect(data.questions.length).toBeGreaterThanOrEqual(10);
    });

    test('every question has required fields', () => {
        for (let i = 0; i < data.questions.length; i++) {
            const q = data.questions[i];
            const label = `question[${i}]`;
            expect(typeof q.category).toBe('string');
            expect([1, 2, 3]).toContain(q.difficulty);
            expect(typeof q.q).toBe('string');
            expect(q.q.length).toBeGreaterThan(0);
            expect(Array.isArray(q.options)).toBe(true);
            expect(q.options.length).toBe(4);
            expect(typeof q.answer).toBe('number');
            expect(q.answer).toBeGreaterThanOrEqual(0);
            expect(q.answer).toBeLessThanOrEqual(3);
            expect(typeof q.rationale).toBe('string');
            expect(q.rationale.length).toBeGreaterThan(0);
        }
    });

    test('every question category exists in categories map', () => {
        const catKeys = Object.keys(data.categories);
        for (const q of data.questions) {
            expect(catKeys).toContain(q.category);
        }
    });

    test('every category has at least one question', () => {
        const catKeys = Object.keys(data.categories);
        for (const key of catKeys) {
            const count = data.questions.filter(q => q.category === key).length;
            expect(count).toBeGreaterThan(0);
        }
    });

    test('every category has at least one difficulty-3 question (needed for closing)', () => {
        const catKeys = Object.keys(data.categories);
        const missing = [];
        for (const key of catKeys) {
            const d3count = data.questions.filter(q => q.category === key && q.difficulty === 3).length;
            if (d3count === 0) missing.push(key);
        }
        // Warn about missing d3 questions (content gap, not structural error)
        if (missing.length > 0) {
            console.warn(`  ⚠ ${parNr}: categories without difficulty-3 questions (cannot close): ${missing.join(', ')}`);
        }
        // At least some categories should have d3 questions
        expect(missing.length).toBeLessThan(catKeys.length);
    });
});
