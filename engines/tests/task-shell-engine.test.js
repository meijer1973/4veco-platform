const TaskShellEngine = require('../task-shell-engine');

function baseTask(overrides) {
    return {
        id: 'numeric-cpi',
        family: 'numeric_input',
        skillLabel: 'Rekenen met indexcijfers',
        purpose: 'Oefen de gevraagde berekening lokaal.',
        prompt: 'Bereken de procentuele verandering.',
        interaction: {
            inputLabel: 'Numeriek antwoord',
            placeholder: 'Bijvoorbeeld 2,5'
        },
        expected: {
            kind: 'number',
            value: 2.5,
            tolerance: 0.05,
            unit: '%'
        },
        feedback: {
            matchTitle: 'Controleerbaar antwoord',
            matchText: 'Je antwoord past binnen de afgesproken afronding.',
            retryTitle: 'Reken nog een keer na',
            retryText: 'Gebruik nieuw min oud, gedeeld door oud.'
        },
        practiceRoute: {
            label: 'Oefen verder met rekenen',
            href: 'rekenen.html'
        },
        ...overrides
    };
}

function fixtures() {
    return [
        baseTask(),
        baseTask({
            id: 'calculation-work',
            family: 'calculation_work_capture',
            skillLabel: 'Berekening tonen',
            prompt: 'Laat formule, invulling en tussenstappen zien.',
            interaction: {
                workLabel: 'Berekening',
                finalAnswerLabel: 'Eindantwoord met notatie'
            },
            expected: {
                kind: 'self_check',
                criteria: [
                    'Formule of rekenregel staat zichtbaar.',
                    'Waarden zijn met labels ingevuld.',
                    'Eindantwoord heeft eenheid of notatie.'
                ]
            },
            feedback: {
                selfCheckTitle: 'Vergelijk je uitwerking',
                selfCheckText: 'Loop de punten na voordat je verder oefent.',
                retryTitle: 'Schrijf eerst je uitwerking',
                retryText: 'Zonder tussenstappen kun je jezelf niet controleren.'
            }
        }),
        baseTask({
            id: 'final-answer',
            family: 'final_answer_entry',
            skillLabel: 'Eindantwoord formuleren',
            prompt: 'Geef het eindantwoord in procenten.',
            interaction: { inputLabel: 'Eindantwoord' },
            expected: { kind: 'text', accepted: ['2,5%', '2.5%'] }
        }),
        baseTask({
            id: 'unit-notation',
            family: 'unit_notation_field',
            skillLabel: 'Eenheid of notatie kiezen',
            prompt: 'Welke notatie hoort bij een procentuele verandering?',
            interaction: { inputLabel: 'Eenheid of notatie' },
            expected: { kind: 'text', accepted: ['%', 'procent'] }
        }),
        baseTask({
            id: 'short-response',
            family: 'short_constructed_response',
            skillLabel: 'Kort uitleggen',
            prompt: 'Leg in een korte zin uit waarom de prijs stijgt.',
            interaction: { inputLabel: 'Korte uitleg' },
            expected: {
                kind: 'self_check',
                criteria: ['Noem oorzaak.', 'Noem gevolg.', 'Gebruik de context.']
            },
            feedback: {
                selfCheckTitle: 'Controleer je uitleg',
                selfCheckText: 'Een korte uitleg heeft oorzaak en gevolg.',
                retryTitle: 'Schrijf eerst je uitleg',
                retryText: 'Noteer een korte zin voordat je vergelijkt.'
            }
        }),
        baseTask({
            id: 'structured-short',
            family: 'structured_short_response',
            skillLabel: 'Indexpunten kort uitleggen',
            prompt: 'Leg in stappen uit waarom 4 indexpunten geen 4 procent is.',
            interaction: {
                fields: [
                    { id: 'indexpunten', label: 'Stijging in indexpunten' },
                    { id: 'basis', label: 'Basis voor procentuele verandering' },
                    { id: 'procentuele-stijging', label: 'Procentuele stijging ongeveer' }
                ],
                options: [
                    { id: 'niet-vier-procent', label: 'De uitspraak klopt niet.' },
                    { id: 'wel-vier-procent', label: 'De uitspraak klopt wel.' }
                ]
            },
            expected: {
                kind: 'structured_text_criteria',
                criteria: [
                    'Noem indexpunten.',
                    'Gebruik 108 als basis.',
                    'Noem ongeveer 3,7 procent.',
                    'Wijs 4 procent af.'
                ],
                fields: [
                    { id: 'indexpunten', accepted: ['4', '4 indexpunten'] },
                    { id: 'basis', accepted: ['108', 'basis 108'] },
                    { id: 'procentuele-stijging', accepted: ['3,7%', '3.7%', '3,7 procent'] }
                ],
                choice: { value: 'niet-vier-procent' }
            }
        }),
        baseTask({
            id: 'table-value',
            family: 'table_value_selection',
            skillLabel: 'Tabelwaarde kiezen',
            prompt: 'Welke tabelwaarde hoort bij 2025?',
            interaction: {
                inputLabel: 'Tabelwaarde',
                options: [
                    { id: 'a', label: '120' },
                    { id: 'b', label: '150' }
                ]
            },
            expected: { kind: 'choice', value: 'b' }
        }),
        baseTask({
            id: 'graph-reading',
            family: 'graph_reading',
            skillLabel: 'Grafiek aflezen',
            prompt: 'Lees de waarde bij 2025 af.',
            interaction: { inputLabel: 'Afgelezen waarde' },
            expected: { kind: 'number', value: 150, tolerance: 1, unit: 'stuks' }
        }),
        baseTask({
            id: 'point-placement',
            family: 'point_placement',
            skillLabel: 'Punt plaatsen',
            prompt: 'Plaats het punt bij prijs 4 en hoeveelheid 20.',
            interaction: { xLabel: 'Hoeveelheid', yLabel: 'Prijs' },
            expected: { kind: 'point', x: 20, y: 4, toleranceX: 0.5, toleranceY: 0.2 }
        }),
        baseTask({
            id: 'graph-construction',
            family: 'graph_construction_substitute',
            skillLabel: 'Grafiek opbouwen',
            prompt: 'Beschrijf welke twee punten je zou tekenen.',
            interaction: { inputLabel: 'Punten en lijn' },
            expected: {
                kind: 'self_check',
                criteria: ['Noem twee punten.', 'Verbind de punten.', 'Controleer de assen.']
            },
            feedback: {
                selfCheckTitle: 'Controleer je grafiekstappen',
                selfCheckText: 'Een vervangende grafiektaak noemt punten, lijn en assen.',
                retryTitle: 'Schrijf eerst je stappen',
                retryText: 'Noem de punten voordat je jezelf controleert.'
            }
        }),
        baseTask({
            id: 'structured-reasoning',
            family: 'structured_reasoning',
            skillLabel: 'Redenering opbouwen',
            prompt: 'Bouw je redenering op met oorzaak, tussenstap en conclusie.',
            interaction: { inputLabel: 'Redenering' },
            expected: {
                kind: 'self_check',
                criteria: ['Oorzaak genoemd.', 'Tussenstap uitgewerkt.', 'Conclusie gekoppeld aan de vraag.']
            },
            feedback: {
                selfCheckTitle: 'Controleer je redenering',
                selfCheckText: 'Een controleerbare redenering heeft oorzaak, tussenstap en conclusie.',
                retryTitle: 'Schrijf eerst je redenering',
                retryText: 'Noteer de schakels voordat je jezelf controleert.'
            }
        })
    ];
}

describe('TaskShellEngine', () => {
    test('declares all GAME-UX-3A required task families', () => {
        expect(Object.keys(TaskShellEngine.FAMILIES)).toEqual(expect.arrayContaining([
            'numeric_input',
            'calculation_work_capture',
            'final_answer_entry',
            'unit_notation_field',
            'short_constructed_response',
            'structured_short_response',
            'table_value_selection',
            'graph_reading',
            'point_placement',
            'graph_construction_substitute',
            'structured_reasoning'
        ]));
    });

    test('validates at least one fixture for each accepted task family', () => {
        for (const task of fixtures()) {
            expect(TaskShellEngine.validateTask(task)).toBe(true);
            expect(TaskShellEngine.findStudentTextViolations(task)).toEqual([]);
        }
    });

    test('evaluates deterministic numeric, text, table, graph, and point tasks locally', () => {
        const tasks = fixtures();
        expect(TaskShellEngine.evaluateTask(tasks[0], '2,49')).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true
        }));
        expect(TaskShellEngine.evaluateTask(tasks[2], '2.5%').matched).toBe(true);
        expect(TaskShellEngine.evaluateTask(tasks[3], 'procent').matched).toBe(true);
        expect(TaskShellEngine.evaluateTask(tasks[6], 'b').matched).toBe(true);
        expect(TaskShellEngine.evaluateTask(tasks[7], '149,5').matched).toBe(true);
        expect(TaskShellEngine.evaluateTask(tasks[8], { x: '20,2', y: '4,1' }).matched).toBe(true);
    });

    test('uses self-check state for work capture and constructed responses', () => {
        const calculation = fixtures()[1];
        const empty = TaskShellEngine.evaluateTask(calculation, '');
        expect(empty.state).toBe('retry');
        const result = TaskShellEngine.evaluateTask(calculation, {
            work: 'nieuw - oud gedeeld door oud',
            finalAnswer: '2,5%'
        });
        expect(result.state).toBe('self_check');
        expect(result.matched).toBeNull();
        expect(result.selfCheckCriteria).toHaveLength(3);
    });

    test('supports deterministic calculation work capture when a final answer is reviewed', () => {
        const calculation = baseTask({
            id: 'target-equivalent-calculation',
            family: 'calculation_work_capture',
            skillLabel: 'Procentuele verandering berekenen',
            prompt: 'Bereken de procentuele stijging.',
            interaction: {
                workLabel: 'Berekening',
                finalAnswerLabel: 'Eindantwoord',
                unitNotationLabel: 'Notatie',
                unitNotationPlaceholder: 'Bijvoorbeeld %'
            },
            expected: {
                kind: 'calculation',
                finalAnswer: { kind: 'text', accepted: ['15', '15%', '15 procent'] },
                unitNotation: { kind: 'text', accepted: ['%', 'procent'], required: true },
                workRequired: true,
                requiredWorkText: [
                    { label: 'new price', any: ['920'] },
                    { label: 'old price', any: ['800'] },
                    { label: 'difference', any: ['920 - 800', '120'] },
                    { label: 'base', any: ['/ 800', 'gedeeld door 800'] }
                ],
                criteria: [
                    'Gebruik nieuw min oud gedeeld door oud.',
                    'Geef het eindantwoord in procenten.'
                ]
            }
        });

        expect(TaskShellEngine.evaluateTask(calculation, {
            work: '(920 - 800) / 800 x 100',
            finalAnswer: '15',
            unitNotation: '%'
        })).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true
        }));

        expect(TaskShellEngine.evaluateTask(calculation, {
            work: '(920 - 800) / 800 x 100',
            finalAnswer: '15',
            unitNotation: ''
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(calculation, {
            work: '(920 - 800) / 800 x 100',
            finalAnswer: '15',
            unitNotation: 'indexcijfer'
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(calculation, {
            work: '',
            finalAnswer: '15',
            unitNotation: '%'
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(calculation, {
            work: 'ik gok',
            finalAnswer: '15',
            unitNotation: '%'
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));
    });

    test('supports optional unit or notation fields without blocking compact answers', () => {
        const indexCalculation = baseTask({
            id: 'index-naar-waarde',
            family: 'calculation_work_capture',
            skillLabel: 'Indexcijfer berekenen',
            prompt: 'Bereken het indexcijfer.',
            interaction: {
                workLabel: 'Berekening',
                finalAnswerLabel: 'Indexcijfer',
                unitNotationLabel: 'Notatie'
            },
            expected: {
                kind: 'calculation',
                finalAnswer: { kind: 'text', accepted: ['108', 'index 108', 'indexcijfer 108'] },
                unitNotation: { kind: 'text', accepted: ['index', 'indexcijfer'], required: false },
                workRequired: true,
                requiredWorkText: [
                    { label: 'new value', any: ['162'] },
                    { label: 'base value', any: ['150'] },
                    { label: 'times hundred', any: ['x 100', '*100'] }
                ]
            }
        });

        expect(TaskShellEngine.evaluateTask(indexCalculation, {
            work: '162 / 150 x 100',
            finalAnswer: '108',
            unitNotation: ''
        })).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true
        }));

        expect(TaskShellEngine.evaluateTask(indexCalculation, {
            work: '162 / 150 x 100',
            finalAnswer: '108',
            unitNotation: 'indexcijfer'
        })).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true
        }));

        expect(TaskShellEngine.focusPlan(indexCalculation)).toEqual([
            '[data-task-id="index-naar-waarde"][data-input-role="work"]',
            '[data-task-id="index-naar-waarde"][data-input-role="final-answer"]',
            '[data-task-id="index-naar-waarde"][data-input-role="unit-notation"]'
        ]);
    });

    test('supports deterministic short responses with required text groups', () => {
        const explanation = baseTask({
            id: 'indexpunten-uitleg',
            family: 'short_constructed_response',
            skillLabel: 'Indexpunten kort uitleggen',
            prompt: 'Leg uit waarom 4 indexpunten geen 4 procent is.',
            interaction: { inputLabel: 'Korte uitleg' },
            expected: {
                kind: 'text_criteria',
                criteria: [
                    'Noem indexpunten.',
                    'Gebruik 108 als basis.',
                    'Noem ongeveer 3,7 procent.'
                ],
                requiredText: [
                    { label: 'indexpunten', any: ['4 indexpunten'] },
                    { label: 'basis', any: ['basis is 108', 'gedeeld door 108'] },
                    { label: 'uitkomst', any: ['3,7 procent', '3.7 procent'] }
                ],
                rejectText: ['niet fout', '4 procent is indexpunten']
            }
        });

        expect(TaskShellEngine.evaluateTask(explanation, 'Het gaat om 4 indexpunten; de basis is 108, dus het is ongeveer 3,7 procent.')).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true
        }));
        expect(TaskShellEngine.evaluateTask(explanation, 'Het is 4 procent.')).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));
        expect(TaskShellEngine.evaluateTask(explanation, 'Het is niet fout: 4 procent is indexpunten, 108 en 3,7.')).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));
    });

    test('supports deterministic structured short responses without broad prose matching', () => {
        const structured = fixtures()[5];

        expect(TaskShellEngine.evaluateTask(structured, {
            fields: {
                indexpunten: '4 indexpunten',
                basis: '108',
                'procentuele-stijging': '3,7%'
            },
            choice: 'niet-vier-procent'
        })).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true
        }));

        expect(TaskShellEngine.evaluateTask(structured, {
            fields: {
                indexpunten: '4 indexpunten',
                basis: '100',
                'procentuele-stijging': '4%'
            },
            choice: 'wel-vier-procent'
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));
    });

    test('keeps all boundary flags false for local practice output', () => {
        const result = TaskShellEngine.evaluateTask(fixtures()[0], '2,5');
        expect(result.boundaryFlags).toEqual(expect.objectContaining({
            diagnostics: false,
            adaptiveRouting: false,
            masteryDecisions: false,
            automaticSequencing: false,
            studentFacingAI: false,
            summativeUse: false,
            pvProjection: false,
            pvMachinePromotion: false,
            studentProductUse: false,
            targetEquivalentProof: false
        }));
    });

    test('rejects internal codes and restricted product claims in student-facing text', () => {
        expect(() => TaskShellEngine.validateTask(baseTask({ prompt: 'Gebruik A96.' }))).toThrow(/blocked terms or internal codes/);
        expect(() => TaskShellEngine.validateTask(baseTask({ prompt: 'Je score bepaalt de route.' }))).toThrow(/blocked terms or internal codes/);
    });

    test('validates a task set without target-equivalent proof authority', () => {
        expect(TaskShellEngine.validateTaskSet({
            schema_version: 1,
            title: 'Task shell fixture',
            tasks: fixtures()
        })).toBe(true);
    });
});
