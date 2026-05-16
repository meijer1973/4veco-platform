/**
 * Data validation tests for graphical-game data files.
 */
const fs = require('fs');
const path = require('path');
const GraphicalEngine = require('../graphical-engine');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(MODULE_ROOT, 'shared', 'graphical');

function loadAllData() {
    if (!fs.existsSync(DATA_DIR)) return [];
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.js')).sort();
    return files.map(file => {
        const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
        const fn = new Function(content + '\nreturn GRAPHICAL_GAME_DATA;');
        return { file, parNr: file.replace('.js', ''), data: fn() };
    });
}

function collectStudentStrings(data) {
    const strings = [];
    function add(value) {
        if (typeof value === 'string') strings.push(value);
    }
    add(data.meta && data.meta.title);
    add(data.meta && data.meta.parName);
    add(data.student_title);
    add(data.student_subtitle);
    for (const challenge of data.challenges || []) {
        add(challenge.title);
        add(challenge.prompt);
        add(challenge.target_label);
        add(challenge.graph && challenge.graph.title);
        add(challenge.graph && challenge.graph.x_label);
        add(challenge.graph && challenge.graph.y_label);
        add(challenge.graph && challenge.graph.unit);
        for (const point of (challenge.graph && challenge.graph.series) || []) add(point.label);
        for (const step of challenge.feedback_steps || []) {
            add(step.label);
            add(step.text);
        }
    }
    return strings;
}

const allData = loadAllData();
const describeOrSkip = allData.length > 0 ? describe : describe.skip;

describeOrSkip('graphical data files', () => {
    test('at least 1 data file exists', () => {
        expect(allData.length).toBeGreaterThanOrEqual(1);
    });
});

if (allData.length > 0) describe.each(allData)('$parNr ($file)', ({ parNr, data }) => {
    test('has valid graphical-game data', () => {
        expect(data.meta.parNr).toBe(parNr);
        expect(GraphicalEngine.validateData(data)).toBe(true);
    });

    test('challenge IDs are unique', () => {
        const ids = data.challenges.map(ch => ch.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    test('feedback follows source-values-calculation structure', () => {
        for (const challenge of data.challenges) {
            const labels = challenge.feedback_steps.map(step => step.label.toLowerCase());
            expect(labels).toEqual(['bron', 'waarden', 'berekening']);
        }
    });

    test('governance boundary is non-promotional and non-adaptive', () => {
        expect(data.internal_pv_boundary).toEqual({
            student_facing_pv_projection: false,
            pv_machine_promotion: false,
            adaptive_or_diagnostic_use: false,
            mastery_or_sequencing_use: false,
            ai_or_summative_use: false
        });
    });

    test('student-facing strings contain no internal codes or blocked claims', () => {
        const blocked = /\b(?:PV|A\d{2}|B\d{2}|adaptief|diagnostisch|diagnose|mastery|sequencing|summatief|AI)\b/i;
        const offender = collectStudentStrings(data).find(text => blocked.test(text));
        expect(offender || null).toBeNull();
    });
});
