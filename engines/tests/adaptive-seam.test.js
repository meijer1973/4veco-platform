const AdaptiveSeam = require('../adaptive-seam');
const QuizEngine = require('../quiz-engine');
const NewsDetectiveEngine = require('../newsdetective-engine');
const ReasoningEngine = require('../reasoning-engine');
const SkillTreeEngine = require('../skilltree-engine');
const ProcedureEngine = require('../procedure-engine');

function makeStorage(initial) {
    return {
        _data: Object.assign({}, initial || {}),
        getItem(key) {
            return Object.prototype.hasOwnProperty.call(this._data, key)
                ? this._data[key]
                : null;
        },
        setItem(key, value) {
            this._data[key] = String(value);
        },
        removeItem(key) {
            delete this._data[key];
        }
    };
}

function validPayload(overrides) {
    return Object.assign({
        schema_version: 1,
        paragraph_id: '1.1.2',
        focus_skills: ['percentages', 'indexcijfers'],
        difficulty_hint: 'default',
        allowed_hints: 'default',
        source: 'test'
    }, overrides || {});
}

function storageWithPayload(payload) {
    return makeStorage({
        [AdaptiveSeam.STORAGE_KEY]: JSON.stringify(payload)
    });
}

function makeQuizConfig(storage) {
    return {
        parNr: '1.1.2',
        adaptiveStorage: storage,
        questions: [
            { category: 'pct', difficulty: 1, q: 'Vraag?', options: ['A', 'B'], answer: 0, rationale: 'Uitleg' }
        ],
        categories: {
            pct: { name: 'Percentages', colors: { bg: '#fff', text: '#111', bar: '#333' } }
        },
        maxQuestions: 1,
        streakToClose: 3
    };
}

function makeNewsData(storage) {
    return {
        adaptiveStorage: storage,
        meta: { parNr: '1.1.2', parName: 'Percentages en indexcijfers' },
        domainColors: {},
        article: { headline: 'Kop', body: 'Artikel', source: 'Test', sourceDate: '2026-05-16', visualAlt: 'Visual' },
        rounds: [
            { type: 'concept', question: 'Concept?', options: ['A', 'B'], answer: 0, feedback: 'Goed' },
            { type: 'consequence', question: 'Volgorde?', items: ['A', 'B', 'C', 'D', 'E', 'F'], correctOrder: ['A', 'B', 'C', 'D'], feedback: 'Goed' },
            { type: 'model', question: 'Model?', options: ['A', 'B', 'C'], answer: 1, feedback: 'Goed' },
            { type: 'error', question: 'Fout?', text: 'Een zin met fout.', wrongPhrase: 'fout', feedback: 'Goed' }
        ]
    };
}

const REASONING_CSV = `id;structure_type;structure_label;problem_text;step_1_label;step_1_detail;step_1_formula;step_2_label;step_2_detail;step_2_formula;step_3_label;step_3_detail;step_3_formula;distractor_1_label;distractor_1_detail;distractor_1_formula;distractor_2_label;distractor_2_detail;distractor_2_formula;distractor_3_label;distractor_3_detail;distractor_3_formula;subq_1;subq_2;subq_3;subq_distractor_1;subq_distractor_2;error_step_index;error_wrong_label;error_wrong_detail;error_wrong_formula;flow_1_type;flow_1_text;flow_2_type;flow_2_text;flow_3_type;flow_3_text;flow_4_type;flow_4_text;flow_5_type;flow_5_text;flow_6_type;flow_6_text
1;A;Structuur;Probleem;Stap 1;Detail 1;;Stap 2;Detail 2;;Stap 3;Detail 3;;Afleider 1;Detail A1;;Afleider 2;Detail A2;;Afleider 3;Detail A3;;Deelvraag 1;Deelvraag 2;Deelvraag 3;Afleider vraag 1;Afleider vraag 2;2;Foute stap;Foute detail;;cause;Oorzaak;reasoning;Redenering;effect;Gevolg;effect;Conclusie;;`;

function makeSkillElements() {
    return {
        SKILLS: [
            { id: 'A01', name: 'Basisvaardigheid', layer: 1, needs: [], desc: 'Test' }
        ],
        EXERCISES: {}
    };
}

function makeProcedureData() {
    return [
        {
            id: 'test-procedure',
            title: 'Testprocedure',
            steps: [
                { type: 'given', label: 'Start' },
                { type: 'choose', label: 'Kies', options: ['A', 'B'], correct: 0 },
                { type: 'result', label: 'Eind' }
            ]
        }
    ];
}

describe('AdaptiveSeam helper', () => {
    test('returns an inert default payload without storage', () => {
        expect(AdaptiveSeam.readPayload({ paragraphId: '1.1.2', storage: null })).toEqual({
            schema_version: 1,
            paragraph_id: '1.1.2',
            focus_skills: [],
            difficulty_hint: 'default',
            allowed_hints: 'default',
            source: 'none'
        });
    });

    test('ignores malformed JSON and wrong schema versions', () => {
        expect(AdaptiveSeam.readPayload({
            paragraphId: '1.1.2',
            storage: makeStorage({ [AdaptiveSeam.STORAGE_KEY]: '{not json' })
        }).source).toBe('none');

        expect(AdaptiveSeam.readPayload({
            paragraphId: '1.1.2',
            storage: storageWithPayload({ schema_version: 99, source: 'future' })
        }).source).toBe('none');
    });

    test('normalizes a valid payload without adding behavior flags', () => {
        const payload = AdaptiveSeam.readPayload({
            paragraphId: '1.1.2',
            storage: storageWithPayload(validPayload({
                focus_skills: ['A38', 'A38', '', 'A39'],
                difficulty_hint: 'harder'
            }))
        });

        expect(payload).toEqual({
            schema_version: 1,
            paragraph_id: '1.1.2',
            focus_skills: ['A38', 'A39'],
            difficulty_hint: 'harder',
            allowed_hints: 'default',
            source: 'test'
        });
        expect(payload).not.toHaveProperty('diagnostic');
        expect(payload).not.toHaveProperty('mastery');
        expect(payload).not.toHaveProperty('routing');
    });
});

describe('existing game engines read the inert seam without behavior changes', () => {
    test('quiz keeps its existing setup with an absent/default payload', () => {
        const engine = new QuizEngine(makeQuizConfig(makeStorage()));
        expect(engine.getAdaptivePayload()).toEqual(AdaptiveSeam.createDefaultPayload({ paragraphId: '1.1.2' }));
        expect(engine.maxQuestions).toBe(1);
        expect(engine.streakToClose).toBe(3);
        expect(Object.keys(engine.progress)).toEqual(['pct']);
    });

    test('news detective stores the payload but keeps four fixed rounds', () => {
        const engine = new NewsDetectiveEngine(makeNewsData(storageWithPayload(validPayload())));
        expect(engine.getAdaptivePayload().source).toBe('test');
        expect(engine.startGame().totalRounds).toBe(4);
        expect(engine.getMeta()).toEqual({ parNr: '1.1.2', parName: 'Percentages en indexcijfers' });
    });

    test('reasoning stores the payload but keeps configured round count and domain', () => {
        const engine = new ReasoningEngine({
            csvString: REASONING_CSV,
            domain: 'economics',
            parNr: '1.1.2',
            roundsPerGame: 1,
            adaptiveStorage: storageWithPayload(validPayload())
        });
        expect(engine.getAdaptivePayload().focus_skills).toEqual(['percentages', 'indexcijfers']);
        expect(engine.domain).toBe('economics');
        expect(engine.roundsPerGame).toBe(1);
        expect(engine.problems).toHaveLength(1);
    });

    test('skilltree stores the payload but keeps visible skills paragraph-scoped', () => {
        const engine = new SkillTreeEngine({
            elements: makeSkillElements(),
            data: { parNr: '1.1.2', activeSkills: ['A01'] },
            storage: makeStorage(),
            adaptiveStorage: storageWithPayload(validPayload())
        });
        expect(engine.getAdaptivePayload().source).toBe('test');
        expect(engine.getVisibleSkills().map(s => s.id)).toEqual(['A01']);
    });

    test('procedure stores the payload but keeps procedure score storage unchanged', () => {
        const engine = new ProcedureEngine({
            procedures: makeProcedureData(),
            parNr: '1.1.2',
            adaptiveStorage: storageWithPayload(validPayload())
        });
        expect(engine.getAdaptivePayload().paragraph_id).toBe('1.1.2');
        expect(engine.storageKey).toBe('proc_1.1.2');
        expect(engine.startProcedure(0).id).toBe('test-procedure');
    });
});
