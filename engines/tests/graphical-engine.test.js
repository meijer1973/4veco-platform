const GraphicalEngine = require('../graphical-engine');
const AdaptiveSeam = require('../adaptive-seam');

function makeStorage(initial) {
    return {
        _data: Object.assign({}, initial || {}),
        getItem(key) {
            return Object.prototype.hasOwnProperty.call(this._data, key) ? this._data[key] : null;
        },
        setItem(key, value) {
            this._data[key] = String(value);
        }
    };
}

function fixtureData() {
    return {
        schema_version: 1,
        meta: { parNr: '1.1.2', parName: 'Percentages en indexcijfers', title: 'Grafieken lezen' },
        student_title: 'Grafieken lezen',
        challenges: [
            {
                id: 'bar-read',
                type: 'bar_value_read',
                title: 'Lees een staaf af',
                prompt: 'Wat is de waarde in 2025?',
                target_label: '2025',
                graph: {
                    type: 'bar',
                    title: 'Verkoop',
                    x_label: 'jaar',
                    y_label: 'aantal',
                    unit: 'stuks',
                    series: [
                        { label: '2024', value: 120 },
                        { label: '2025', value: 150 }
                    ]
                },
                expected_answer: { kind: 'number', value: 150, unit: 'stuks', tolerance: 0 },
                feedback_steps: [
                    { label: 'Bron', text: 'Lees de grafiek.' },
                    { label: 'Waarden', text: 'Kies 2025.' },
                    { label: 'Berekening', text: 'Er is geen berekening nodig.' }
                ]
            },
            {
                id: 'percentage-change',
                type: 'graph_values_percentage_change',
                title: 'Gebruik twee waarden',
                prompt: 'Bereken de verandering.',
                graph: {
                    type: 'line',
                    title: 'Index',
                    x_label: 'jaar',
                    y_label: 'index',
                    unit: 'index',
                    series: [
                        { label: '2023', value: 125 },
                        { label: '2024', value: 135 }
                    ]
                },
                expected_answer: {
                    kind: 'percentage_change',
                    old_label: '2023',
                    new_label: '2024',
                    value: 8,
                    unit: '%',
                    tolerance: 0.1
                },
                feedback_steps: [
                    { label: 'Bron', text: 'Lees de indexgrafiek.' },
                    { label: 'Waarden', text: 'Oud is 125 en nieuw is 135.' },
                    { label: 'Berekening', text: '10 / 125 x 100% = 8%.' }
                ]
            }
        ]
    };
}

describe('GraphicalEngine', () => {
    test('validates the MVP data shape', () => {
        expect(GraphicalEngine.validateData(fixtureData())).toBe(true);
    });

    test('rejects unsupported challenge types', () => {
        const data = fixtureData();
        data.challenges[0].type = 'market_equilibrium_drag';
        expect(() => new GraphicalEngine({ data })).toThrow(/not supported/);
    });

    test('reads the inert adaptive seam without changing behavior', () => {
        const storage = makeStorage({
            [AdaptiveSeam.STORAGE_KEY]: JSON.stringify({
                schema_version: 1,
                paragraph_id: '1.1.2',
                focus_skills: ['percentages'],
                difficulty_hint: 'default',
                allowed_hints: 'default',
                source: 'test'
            })
        });
        const engine = new GraphicalEngine({ data: fixtureData(), adaptiveStorage: storage });
        expect(engine.getAdaptivePayload().source).toBe('test');
        expect(engine.getProgress()).toEqual({ current: 1, total: 2, completed: 0 });
    });

    test('checks direct graph-value answers with tolerance', () => {
        const engine = new GraphicalEngine({ data: fixtureData() });
        expect(engine.answerNumber('149').correct).toBe(false);
        expect(engine.answerNumber('150').correct).toBe(true);
        expect(engine.getSummary()).toEqual({ correct: 1, total: 2, completed: 1, perfect: false });
    });

    test('checks selected graph values and percentage answer', () => {
        const engine = new GraphicalEngine({ data: fixtureData() });
        engine.answerNumber(150);
        engine.nextChallenge();

        const wrongLabels = engine.answerPercentage({ old_label: '2024', new_label: '2023', value: 8 });
        expect(wrongLabels.correct).toBe(false);

        const correct = engine.answerPercentage({ old_label: '2023', new_label: '2024', value: '8,0' });
        expect(correct.correct).toBe(true);
        expect(correct.submitted.calculated_from_selected_values).toBeCloseTo(8);
        expect(engine.isComplete()).toBe(true);
        expect(engine.getSummary()).toEqual({ correct: 2, total: 2, completed: 2, perfect: true });
    });
});
