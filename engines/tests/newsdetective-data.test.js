/**
 * Data validation tests for all news detective data files.
 * Ensures every paragraph has structurally valid data with correct round types.
 */
const fs = require('fs');
const path = require('path');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(MODULE_ROOT, 'shared', 'newsdetective');

// Load all data files — empty if shared/newsdetective/ is missing (fresh book)
function loadAllData() {
    if (!fs.existsSync(DATA_DIR)) return [];
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.js')).sort();
    const result = [];
    for (const file of files) {
        const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
        const fn = new Function(content + '\nreturn NEWS_DETECTIVE_DATA;');
        const data = fn();
        result.push({ file, parNr: file.replace('.js', ''), data });
    }
    return result;
}

const allData = loadAllData();
const describeOrSkip = allData.length > 0 ? describe : describe.skip;

describeOrSkip('news detective data files', () => {
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

    // ── Article ─────────────────────────────────────────────────────
    test('has article with required fields', () => {
        expect(data.article).toBeDefined();
        for (const key of ['headline', 'body', 'source', 'sourceDate', 'visualAlt']) {
            expect(typeof data.article[key]).toBe('string');
            expect(data.article[key].length).toBeGreaterThan(0);
        }
    });

    test('has article with valid sourceUrl', () => {
        expect(typeof data.article.sourceUrl).toBe('string');
        expect(data.article.sourceUrl).toMatch(/^https?:\/\//);
    });

    // ── Rounds array ────────────────────────────────────────────────
    test('has exactly 4 rounds', () => {
        expect(Array.isArray(data.rounds)).toBe(true);
        expect(data.rounds).toHaveLength(4);
    });

    test('rounds are in correct type order', () => {
        const expected = ['concept', 'consequence', 'model', 'error'];
        for (let i = 0; i < 4; i++) {
            expect(data.rounds[i].type).toBe(expected[i]);
        }
    });

    // ── Round 1: concept ────────────────────────────────────────────
    test('concept round has question and 4 options with exactly 1 correct', () => {
        const r = data.rounds[0];
        expect(typeof r.question).toBe('string');
        expect(r.question.length).toBeGreaterThan(0);
        expect(Array.isArray(r.options)).toBe(true);
        expect(r.options).toHaveLength(4);

        let correctCount = 0;
        for (const opt of r.options) {
            expect(typeof opt.text).toBe('string');
            expect(opt.text.length).toBeGreaterThan(0);
            expect(typeof opt.feedback).toBe('string');
            expect(opt.feedback.length).toBeGreaterThan(0);
            if (opt.correct === true) correctCount++;
        }
        expect(correctCount).toBe(1);
    });

    // ── Round 2: consequence ────────────────────────────────────────
    test('consequence round has chain with 4 items (positions 0-3) and 2 distractors', () => {
        const r = data.rounds[1];
        expect(typeof r.question).toBe('string');
        expect(r.question.length).toBeGreaterThan(0);

        expect(Array.isArray(r.chain)).toBe(true);
        expect(r.chain).toHaveLength(4);
        const positions = r.chain.map(c => c.position).sort();
        expect(positions).toEqual([0, 1, 2, 3]);

        for (const c of r.chain) {
            expect(typeof c.text).toBe('string');
            expect(c.text.length).toBeGreaterThan(0);
        }

        expect(Array.isArray(r.distractors)).toBe(true);
        expect(r.distractors).toHaveLength(2);
        for (const d of r.distractors) {
            expect(typeof d.text).toBe('string');
            expect(d.text.length).toBeGreaterThan(0);
        }
    });

    // ── Round 3: model ──────────────────────────────────────────────
    test('model round has 3 options with exactly 1 correct', () => {
        const r = data.rounds[2];
        expect(typeof r.question).toBe('string');
        expect(r.question.length).toBeGreaterThan(0);
        expect(Array.isArray(r.options)).toBe(true);
        expect(r.options).toHaveLength(3);

        let correctCount = 0;
        for (const opt of r.options) {
            expect(typeof opt.id).toBe('string');
            expect(opt.id.length).toBeGreaterThan(0);
            expect(typeof opt.label).toBe('string');
            expect(opt.label.length).toBeGreaterThan(0);
            expect(typeof opt.description).toBe('string');
            expect(opt.description.length).toBeGreaterThan(0);
            expect(typeof opt.feedback).toBe('string');
            expect(opt.feedback.length).toBeGreaterThan(0);
            if (opt.correct === true) correctCount++;
        }
        expect(correctCount).toBe(1);
    });

    // ── Round 4: error ──────────────────────────────────────────────
    test('error round has valid structure', () => {
        const r = data.rounds[3];
        expect(typeof r.fakeAnalysis).toBe('string');
        expect(r.fakeAnalysis.length).toBeGreaterThan(0);
        expect(typeof r.errorPhrase).toBe('string');
        expect(r.errorPhrase.length).toBeGreaterThan(0);
        expect(typeof r.errorExplanation).toBe('string');
        expect(r.errorExplanation.length).toBeGreaterThan(0);
        expect(Array.isArray(r.distractorPhrases)).toBe(true);
        expect(r.distractorPhrases.length).toBeGreaterThanOrEqual(2);

        for (const p of r.distractorPhrases) {
            expect(typeof p).toBe('string');
            expect(p.length).toBeGreaterThan(0);
        }
    });

    test('error phrases appear in fakeAnalysis text', () => {
        const r = data.rounds[3];
        expect(r.fakeAnalysis).toContain(r.errorPhrase);
        for (const p of r.distractorPhrases) {
            expect(r.fakeAnalysis).toContain(p);
        }
    });

    // ── Error round quality checks ─────────────────────────────────
    test('distractor phrases do not contain the error phrase', () => {
        const r = data.rounds[3];
        for (const p of r.distractorPhrases) {
            expect(p).not.toContain(r.errorPhrase);
            expect(r.errorPhrase).not.toContain(p);
        }
    });

    test('distractor phrases are distinct from each other', () => {
        const r = data.rounds[3];
        const unique = new Set(r.distractorPhrases);
        expect(unique.size).toBe(r.distractorPhrases.length);
    });

    test('error round has no obvious contradictions between distractors and correction', () => {
        const r = data.rounds[3];
        const explanation = r.errorExplanation.toLowerCase();

        // Extract negation patterns from the correction:
        // If the correction says concept X is wrong, distractors should not assert X
        const errorLower = r.errorPhrase.toLowerCase();

        for (const p of r.distractorPhrases) {
            const pLower = p.toLowerCase();

            // Distractor should not repeat the error concept
            // (e.g., if error is "volkomen concurrentie", distractor shouldn't contain it)
            expect(pLower).not.toContain(errorLower);

            // Distractor should not contain negations of what the correction asserts
            // Pattern: correction says "X is juist Y" but distractor says "niet Y" or "geen Y"
            // This catches cases like correction="oligopolie" but distractor says "geen marktmacht"

            // Check for antonym pairs that signal contradictions
            const contradictionPairs = [
                ['wel uitsluitbaar', 'niet-uitsluitbaar'],
                ['niet-uitsluitbaar', 'wel uitsluitbaar'],
                ['quasi-collectief', 'zuiver collectief'],
                ['zuiver collectief', 'quasi-collectief'],
                ['vrijhandel', 'protectionisme'],
                ['protectionisme', 'vrijhandel'],
                ['volledig gerealiseerd in nederland', 'elke schakel voegt waarde toe'],
                ['allocatief efficiënt', 'niet allocatief efficiënt'],
            ];

            for (const [ifInExplanation, shouldNotBeInDistractor] of contradictionPairs) {
                if (explanation.includes(ifInExplanation)) {
                    expect(pLower).not.toContain(shouldNotBeInDistractor);
                }
            }
        }
    });

    // ── Optional lesLink ────────────────────────────────────────────
    test('lesLink is a non-empty string if present', () => {
        if (data.lesLink !== undefined) {
            expect(typeof data.lesLink).toBe('string');
            expect(data.lesLink.length).toBeGreaterThan(0);
        }
    });
});
