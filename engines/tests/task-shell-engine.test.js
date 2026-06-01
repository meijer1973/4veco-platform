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
            id: 'cloze-tiles',
            family: 'cloze_tile_select',
            skillLabel: 'Indexpunten invullen',
            prompt: 'Vul de ontbrekende stappen in.',
            interaction: {
                segments: [
                    { type: 'text', text: 'De stijging is ' },
                    { type: 'blank', blankId: 'indexpunten' },
                    { type: 'text', text: ' indexpunten en je deelt door ' },
                    { type: 'blank', blankId: 'basis' },
                    { type: 'text', text: '.' }
                ],
                blanks: [
                    { id: 'indexpunten', label: 'Stijging in indexpunten' },
                    { id: 'basis', label: 'Basis voor procentuele stijging' }
                ],
                tiles: [
                    { id: 'vier', label: '4', kind: 'answer' },
                    { id: 'honderdacht', label: '108', kind: 'answer' },
                    { id: 'vier-procent', label: '4%', kind: 'distractor', distractorFor: 'indexpunten' }
                ]
            },
            expected: {
                kind: 'cloze_tile_select',
                blanks: {
                    indexpunten: 'vier',
                    basis: 'honderdacht'
                }
            }
        }),
        baseTask({
            id: 'cloze-text',
            family: 'cloze_text',
            skillLabel: 'Indexpunten invullen',
            prompt: 'Vul de ontbrekende waarden in.',
            interaction: {
                segments: [
                    { type: 'text', text: 'De stijging is ' },
                    { type: 'blank', blankId: 'indexpunten' },
                    { type: 'text', text: ' indexpunten. Je deelt door ' },
                    { type: 'blank', blankId: 'basis' },
                    { type: 'text', text: ', omdat ' },
                    { type: 'blank', blankId: 'reden' },
                    { type: 'text', text: '.' }
                ],
                blanks: [
                    { id: 'indexpunten', label: 'Stijging in indexpunten', placeholder: 'bijv. 4', inputMode: 'decimal', width: 'short' },
                    { id: 'basis', label: 'Oude index als basis', placeholder: 'bijv. 108', inputMode: 'decimal', width: 'short' },
                    { id: 'reden', label: 'Waarom 108 de basis is', placeholder: 'oude index is de basis', width: 'wide' }
                ]
            },
            expected: {
                kind: 'cloze_text',
                blanks: {
                    indexpunten: { accepted: ['4', '4 indexpunten'], rejectText: ['4%'] },
                    basis: { accepted: ['108', 'index 108'] },
                    reden: {
                        requiredTextGroups: [
                            ['108', 'oude index'],
                            ['basis', 'deler', 'delen']
                        ],
                        rejectText: ['altijd delen door 100']
                    }
                }
            }
        }),
        baseTask({
            id: 'multi-select',
            family: 'multi_select',
            skillLabel: 'Schaarste herkennen',
            prompt: 'Kies alle uitspraken die bij schaarste horen.',
            interaction: {
                inputLabel: 'Uitspraken over schaarste',
                options: [
                    { id: 'behoeften', label: 'Behoeften zijn groter dan beschikbare middelen.' },
                    { id: 'keuze', label: 'Je moet kiezen tussen alternatieven.' },
                    { id: 'alles-kan', label: 'Iedereen kan alles krijgen wat hij wil.' }
                ]
            },
            expected: {
                kind: 'multi_select',
                mode: 'exact_set',
                values: ['behoeften', 'keuze'],
                partialFeedback: 'practice_only'
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
        }),
        baseTask({
            id: 'sentence-builder',
            family: 'sentence_builder',
            skillLabel: 'Redenering bouwen',
            prompt: 'Bouw de economische redenering in de juiste volgorde.',
            interaction: {
                tokens: [
                    { id: 'prijs-stijgt', label: 'De prijs stijgt', kind: 'answer' },
                    { id: 'vraag-daalt', label: 'de gevraagde hoeveelheid daalt', kind: 'answer' },
                    { id: 'hogere-prijs', label: 'bij een hogere prijs', kind: 'answer' },
                    { id: 'vraag-stijgt', label: 'de gevraagde hoeveelheid stijgt', kind: 'distractor', distractorFor: 'vraag-daalt' }
                ],
                separator: ' -> ',
                placeholder: 'Bouw je redenering.'
            },
            expected: {
                kind: 'sentence_builder',
                tokens: ['prijs-stijgt', 'vraag-daalt', 'hogere-prijs'],
                acceptedSequences: [
                    ['prijs-stijgt', 'vraag-daalt', 'hogere-prijs']
                ]
            }
        }),
        baseTask({
            id: 'formula-builder',
            family: 'formula_builder',
            skillLabel: 'Formule bouwen',
            prompt: 'Bouw de formule voor procentuele verandering.',
            interaction: {
                tokens: [
                    { id: 'nieuw-min-oud', label: 'nieuw - oud', kind: 'answer', category: 'numerator' },
                    { id: 'delen-door-oud', label: '/ oud', kind: 'answer', category: 'denominator' },
                    { id: 'keer-100-procent', label: 'x 100%', kind: 'answer', category: 'multiplier' },
                    { id: 'delen-door-nieuw', label: '/ nieuw', kind: 'distractor', category: 'denominator', distractorFor: 'delen-door-oud' }
                ],
                separator: ' ',
                placeholder: 'Bouw de formule.'
            },
            expected: {
                kind: 'formula_builder',
                tokens: ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent'],
                acceptedSequences: [
                    ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent']
                ]
            }
        }),
        baseTask({
            id: 'step-ordering',
            family: 'step_ordering',
            skillLabel: 'Stappen ordenen',
            prompt: 'Zet de stappen voor procentuele verandering in de juiste volgorde.',
            interaction: {
                steps: [
                    { id: 'verschil', label: 'Bereken het verschil', kind: 'answer', description: 'Nieuw min oud' },
                    { id: 'deel-door-oud', label: 'Deel door de oude waarde', kind: 'answer' },
                    { id: 'keer-100', label: 'Vermenigvuldig met 100%', kind: 'answer' },
                    { id: 'deel-door-nieuw', label: 'Deel door de nieuwe waarde', kind: 'distractor', distractorFor: 'deel-door-oud' }
                ],
                separator: ' -> ',
                placeholder: 'Orden de stappen.',
                stepBankLabel: 'Stappenbank',
                sequenceLabel: 'Gekozen volgorde'
            },
            expected: {
                kind: 'step_ordering',
                order: ['verschil', 'deel-door-oud', 'keer-100'],
                partialFeedback: 'practice_only'
            }
        }),
        baseTask({
            id: 'source-values',
            family: 'source_value_selection',
            skillLabel: 'Bronwaarden kiezen',
            prompt: 'Kies de waarden uit de bron en geef hun rol aan.',
            interaction: {
                valueBankLabel: 'Bronwaarden',
                roleLabel: 'Rol in berekening',
                values: [
                    { id: 'prijs-oud', label: 'EUR 800', kind: 'answer', sourceLabel: 'oude prijs', unit: 'euro', period: 'jaar 1' },
                    { id: 'prijs-nieuw', label: 'EUR 920', kind: 'answer', sourceLabel: 'nieuwe prijs', unit: 'euro', period: 'jaar 2' },
                    { id: 'prijs-btw', label: '21%', kind: 'distractor', distractorFor: 'prijs-nieuw', description: 'Btw-percentage uit de bron' }
                ],
                roles: [
                    { id: 'old', label: 'oude waarde' },
                    { id: 'new', label: 'nieuwe waarde' }
                ]
            },
            expected: {
                kind: 'source_value_selection',
                selections: [
                    { valueId: 'prijs-oud', role: 'old' },
                    { valueId: 'prijs-nieuw', role: 'new' }
                ],
                partialFeedback: 'practice_only'
            }
        }),
        baseTask({
            id: 'source-chain',
            family: 'source_chain_builder',
            skillLabel: 'Bronketen bouwen',
            prompt: 'Bouw de bron naar berekening naar conclusie.',
            interaction: {
                nodeBankLabel: 'Bronketen onderdelen',
                sequenceLabel: 'Opgebouwde bronketen',
                placeholder: 'Bouw de keten.',
                separator: ' -> ',
                nodes: [
                    { id: 'bron', label: 'Lees de prijstabel', kind: 'answer', nodeRole: 'source' },
                    { id: 'waarden', label: 'Gebruik 800 en 920', kind: 'answer', nodeRole: 'value' },
                    { id: 'bewerking', label: '(920 - 800) / 800 x 100%', kind: 'answer', nodeRole: 'operation' },
                    { id: 'antwoord', label: '15%', kind: 'answer', nodeRole: 'answer' },
                    { id: 'conclusie', label: 'De prijs stijgt met 15%', kind: 'answer', nodeRole: 'conclusion' },
                    { id: 'deel-door-nieuw', label: 'Deel door 920', kind: 'distractor', nodeRole: 'operation', distractorFor: 'bewerking' }
                ]
            },
            expected: {
                kind: 'source_chain_builder',
                chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie'],
                partialFeedback: 'practice_only'
            }
        }),
        baseTask({
            id: 'label-placement',
            family: 'label_placement',
            skillLabel: 'Grafieklabels plaatsen',
            prompt: 'Plaats de labels bij de juiste onderdelen van de grafiek.',
            interaction: {
                labelBankLabel: 'Labelbank',
                targetRegionLabel: 'Grafiekvlak',
                placementLabel: 'Geplaatste labels',
                visual: {
                    kind: 'coordinate_plane',
                    title: 'Prijs-hoeveelheidgrafiek',
                    description: 'Een assenstelsel met een horizontale hoeveelheid-as en een verticale prijs-as.'
                },
                labels: [
                    {
                        id: 'prijs',
                        label: 'Prijs',
                        description: 'De prijs staat op de verticale as.',
                        kind: 'answer'
                    },
                    {
                        id: 'hoeveelheid',
                        label: 'Hoeveelheid',
                        description: 'De hoeveelheid staat op de horizontale as.',
                        kind: 'answer'
                    },
                    {
                        id: 'omzet',
                        label: 'Omzet',
                        description: 'Omzet hoort niet als aslabel in deze grafiek.',
                        kind: 'distractor',
                        distractorFor: 'prijs'
                    }
                ],
                targets: [
                    {
                        id: 'y-as',
                        label: 'Verticale as',
                        description: 'De verticale as toont de prijs.',
                        kind: 'answer',
                        targetRole: 'axis',
                        x: 14,
                        y: 26
                    },
                    {
                        id: 'x-as',
                        label: 'Horizontale as',
                        description: 'De horizontale as toont de hoeveelheid.',
                        kind: 'answer',
                        targetRole: 'axis',
                        x: 72,
                        y: 84
                    },
                    {
                        id: 'caption',
                        label: 'Bijschrift',
                        description: 'Dit is een bijschriftgebied, geen as.',
                        kind: 'distractor',
                        targetRole: 'structure_part',
                        distractorFor: 'y-as',
                        x: 78,
                        y: 16
                    }
                ]
            },
            expected: {
                kind: 'label_placement',
                placements: [
                    { labelId: 'prijs', targetId: 'y-as' },
                    { labelId: 'hoeveelheid', targetId: 'x-as' }
                ],
                partialFeedback: 'practice_only'
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
            'cloze_text',
            'multi_select',
            'cloze_tile_select',
            'sentence_builder',
            'formula_builder',
            'step_ordering',
            'source_value_selection',
            'source_chain_builder',
            'label_placement',
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
        expect(TaskShellEngine.evaluateTask(tasks[6], { blanks: { indexpunten: 'vier', basis: 'honderdacht' } }).matched).toBe(true);
        expect(TaskShellEngine.evaluateTask(tasks[7], {
            blanks: {
                indexpunten: '4 indexpunten',
                basis: 'index 108',
                reden: 'De oude index 108 is de basis.'
            }
        }).matched).toBe(true);
        expect(TaskShellEngine.evaluateTask(tasks[8], { values: ['keuze', 'behoeften'] }).matched).toBe(true);
        expect(TaskShellEngine.evaluateTask(tasks[14], { tokens: ['prijs-stijgt', 'vraag-daalt', 'hogere-prijs'] }).matched).toBe(true);
        expect(TaskShellEngine.evaluateTask(tasks[15], { tokens: ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent'] }).matched).toBe(true);
        expect(TaskShellEngine.evaluateTask(tasks[9], 'b').matched).toBe(true);
        expect(TaskShellEngine.evaluateTask(tasks[10], '149,5').matched).toBe(true);
        expect(TaskShellEngine.evaluateTask(tasks[11], { x: '20,2', y: '4,1' }).matched).toBe(true);
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

    test('supports cloze tile selection with exact blank-to-tile mapping', () => {
        const cloze = fixtures()[6];

        expect(TaskShellEngine.evaluateTask(cloze, {
            blanks: {
                indexpunten: 'vier',
                basis: 'honderdacht'
            }
        })).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true
        }));

        expect(TaskShellEngine.evaluateTask(cloze, {
            blanks: {
                indexpunten: 'vier-procent',
                basis: 'honderdacht'
            }
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(cloze, {
            blanks: {
                indexpunten: 'vier'
            }
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(cloze, {
            indexpunten: 'vier',
            basis: 'honderdacht'
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));
    });

    test('supports cloze text with exact shape, accepted values, and bounded text groups', () => {
        const cloze = fixtures()[7];

        expect(TaskShellEngine.evaluateTask(cloze, {
            blanks: {
                indexpunten: '4',
                basis: '108',
                reden: 'De oude index is de basis.'
            }
        })).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true
        }));

        expect(TaskShellEngine.evaluateTask(cloze, {
            blanks: {
                indexpunten: '4%',
                basis: '108',
                reden: 'De oude index is de basis.'
            }
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(cloze, {
            blanks: {
                indexpunten: '4',
                basis: '108',
                reden: 'Je moet altijd delen door 100.'
            }
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(cloze, {
            blanks: {
                indexpunten: '4',
                basis: '108'
            }
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(cloze, {
            indexpunten: '4',
            basis: '108',
            reden: 'De oude index is de basis.'
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(cloze, {
            blanks: {
                indexpunten: '4',
                basis: '108',
                reden: 'De oude index is de basis.'
            },
            extra: 'ignored'
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.focusPlan(cloze)).toEqual([
            '[data-task-id="cloze-text"][data-cloze-text-blank-id]'
        ]);
    });

    test('supports multi-select with exact order-insensitive set matching and practice feedback', () => {
        const multi = fixtures()[8];

        expect(TaskShellEngine.evaluateTask(multi, {
            values: ['keuze', 'behoeften']
        })).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true
        }));

        const retry = TaskShellEngine.evaluateTask(multi, {
            values: ['behoeften', 'alles-kan']
        });
        expect(retry).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));
        expect(retry.selectionFeedback).toEqual({
            mode: 'practice_only',
            missingRequired: [{ id: 'keuze', label: 'Je moet kiezen tussen alternatieven.' }],
            selectedDistractors: [{ id: 'alles-kan', label: 'Iedereen kan alles krijgen wat hij wil.' }],
            correctSelected: [{ id: 'behoeften', label: 'Behoeften zijn groter dan beschikbare middelen.' }]
        });

        expect(TaskShellEngine.evaluateTask(multi, {
            values: ['behoeften']
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(multi, {
            values: ['behoeften', 'keuze', 'alles-kan']
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(multi, {
            values: ['behoeften', 'behoeften', 'keuze']
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(multi, {
            values: ['behoeften', 'keuze'],
            extra: 'ignored'
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(multi, ['behoeften', 'keuze'])).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        const numericIds = {
            ...multi,
            interaction: {
                inputLabel: 'Numerieke ids als strings',
                options: [
                    { id: '1', label: 'Eerste juiste optie' },
                    { id: '2', label: 'Tweede juiste optie' },
                    { id: '3', label: 'Afleider' }
                ]
            },
            expected: {
                kind: 'multi_select',
                mode: 'exact_set',
                values: ['1', '2'],
                partialFeedback: 'practice_only'
            }
        };
        expect(TaskShellEngine.validateTask(numericIds)).toBe(true);
        expect(TaskShellEngine.evaluateTask(numericIds, { values: ['1', '2'] }).matched).toBe(true);
        expect(TaskShellEngine.evaluateTask(numericIds, { values: [1, '2'] }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(numericIds, { values: [{ id: '1' }, '2'] }).matched).toBe(false);

        expect(TaskShellEngine.focusPlan(multi)).toEqual([
            '[data-task-id="multi-select"][data-multi-option-id]'
        ]);
    });

    test('rejects invalid multi-select schemas before rendering', () => {
        const multi = fixtures()[8];

        expect(() => TaskShellEngine.validateTask({
            ...multi,
            interaction: {
                ...multi.interaction,
                inputLabel: ''
            }
        })).toThrow(/interaction.inputLabel/);

        expect(() => TaskShellEngine.validateTask({
            ...multi,
            interaction: {
                ...multi.interaction,
                options: [
                    { id: 'behoeften', label: 'Behoeften zijn groter dan middelen.' },
                    { id: 'behoeften', label: 'Dubbel.' },
                    { id: 'alles-kan', label: 'Iedereen kan alles krijgen.' }
                ]
            }
        })).toThrow(/duplicate option id/);

        expect(() => TaskShellEngine.validateTask({
            ...multi,
            expected: {
                kind: 'multi_select',
                mode: 'exact_set',
                values: ['behoeften']
            }
        })).toThrow(/expected.values must contain at least 2 item/);

        expect(() => TaskShellEngine.validateTask({
            ...multi,
            expected: {
                kind: 'multi_select',
                mode: 'partial',
                values: ['behoeften', 'keuze']
            }
        })).toThrow(/expected.mode must be exact_set/);

        expect(() => TaskShellEngine.validateTask({
            ...multi,
            expected: {
                kind: 'multi_select',
                mode: 'exact_set',
                values: ['behoeften', 'onbekend']
            }
        })).toThrow(/must match an option id/);

        expect(() => TaskShellEngine.validateTask({
            ...multi,
            expected: {
                kind: 'multi_select',
                mode: 'exact_set',
                values: ['behoeften', 'keuze', 'alles-kan']
            }
        })).toThrow(/must include at least one distractor option/);

        expect(() => TaskShellEngine.validateTask({
            ...multi,
            expected: {
                kind: 'multi_select',
                mode: 'exact_set',
                values: ['behoeften', 'keuze'],
                partialFeedback: 'diagnostic'
            }
        })).toThrow(/partialFeedback must be practice_only/);
    });

    test('supports sentence builder with exact ordered token sequences', () => {
        const sentence = fixtures()[14];

        expect(TaskShellEngine.evaluateTask(sentence, {
            tokens: ['prijs-stijgt', 'vraag-daalt', 'hogere-prijs']
        })).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true
        }));

        expect(TaskShellEngine.evaluateTask(sentence, {
            tokens: ['prijs-stijgt', 'hogere-prijs', 'vraag-daalt']
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(sentence, {
            tokens: ['prijs-stijgt', 'vraag-daalt']
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(sentence, {
            tokens: ['prijs-stijgt', 'vraag-daalt', 'hogere-prijs', 'vraag-stijgt']
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(sentence, [
            'prijs-stijgt',
            'vraag-daalt',
            'hogere-prijs'
        ])).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));
    });

    test('rejects invalid sentence builder schemas before rendering', () => {
        const sentence = fixtures()[14];
        expect(() => TaskShellEngine.validateTask({
            ...sentence,
            interaction: {
                ...sentence.interaction,
                tokens: [
                    { id: 'prijs-stijgt', label: 'De prijs stijgt', kind: 'answer' },
                    { id: 'prijs-stijgt', label: 'Dubbel', kind: 'answer' },
                    { id: 'vraag-stijgt', label: 'de gevraagde hoeveelheid stijgt', kind: 'distractor', distractorFor: 'prijs-stijgt' }
                ]
            }
        })).toThrow(/duplicate sentence token id/);

        expect(() => TaskShellEngine.validateTask({
            ...sentence,
            expected: {
                kind: 'sentence_builder',
                tokens: ['prijs-stijgt', 'onbekend'],
                acceptedSequences: [['prijs-stijgt', 'onbekend']]
            }
        })).toThrow(/must match an interaction token/);

        expect(() => TaskShellEngine.validateTask({
            ...sentence,
            interaction: {
                ...sentence.interaction,
                tokens: [
                    { id: 'prijs-stijgt', label: 'De prijs stijgt', kind: 'answer' },
                    { id: 'vraag-daalt', label: 'de gevraagde hoeveelheid daalt', kind: 'answer' }
                ]
            }
        })).toThrow(/must include at least one distractor/);

        expect(() => TaskShellEngine.validateTask({
            ...sentence,
            expected: {
                kind: 'sentence_builder',
                tokens: ['prijs-stijgt', 'prijs-stijgt'],
                acceptedSequences: [['prijs-stijgt', 'prijs-stijgt']]
            }
        })).toThrow(/uses token more than once/);

        expect(() => TaskShellEngine.validateTask({
            ...sentence,
            expected: {
                kind: 'sentence_builder',
                tokens: ['prijs-stijgt', 'vraag-daalt', 'hogere-prijs'],
                acceptedSequences: [['prijs-stijgt', 'vraag-daalt']]
            }
        })).toThrow(/must include expected.tokens/);
    });

    test('supports formula builder with exact ordered token sequences', () => {
        const formula = fixtures()[15];

        expect(TaskShellEngine.evaluateTask(formula, {
            tokens: ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent']
        })).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true
        }));

        expect(TaskShellEngine.evaluateTask(formula, {
            tokens: ['nieuw-min-oud', 'keer-100-procent', 'delen-door-oud']
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(formula, {
            tokens: ['nieuw-min-oud', 'delen-door-oud']
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(formula, {
            tokens: ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent', 'delen-door-nieuw']
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(formula, [
            'nieuw-min-oud',
            'delen-door-oud',
            'keer-100-procent'
        ])).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(formula, {
            tokens: ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent'],
            extra: 'ignored'
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.focusPlan(formula)).toEqual([
            '[data-task-id="formula-builder"][data-formula-token-id]',
            '[data-task-id="formula-builder"][data-formula-sequence]'
        ]);
    });

    test('rejects invalid formula builder schemas before rendering', () => {
        const formula = fixtures()[15];

        expect(() => TaskShellEngine.validateTask({
            ...formula,
            interaction: {
                ...formula.interaction,
                tokens: [
                    { id: 'nieuw-min-oud', label: 'nieuw - oud', kind: 'answer', category: 'numerator' },
                    { id: 'nieuw-min-oud', label: 'Dubbel', kind: 'answer', category: 'numerator' },
                    { id: 'delen-door-nieuw', label: '/ nieuw', kind: 'distractor', category: 'denominator', distractorFor: 'nieuw-min-oud' }
                ]
            }
        })).toThrow(/duplicate formula token id/);

        expect(() => TaskShellEngine.validateTask({
            ...formula,
            interaction: {
                ...formula.interaction,
                tokens: [
                    { id: 'nieuw-min-oud', label: 'nieuw - oud', kind: 'answer' },
                    { id: 'delen-door-oud', label: '/ oud', kind: 'answer', category: 'denominator' },
                    { id: 'delen-door-nieuw', label: '/ nieuw', kind: 'distractor', category: 'denominator', distractorFor: 'delen-door-oud' }
                ]
            }
        })).toThrow(/category must be a non-empty string/);

        expect(() => TaskShellEngine.validateTask({
            ...formula,
            interaction: {
                ...formula.interaction,
                tokens: [
                    { id: 'nieuw-min-oud', label: 'nieuw - oud', kind: 'answer', category: 'answer' },
                    { id: 'delen-door-oud', label: '/ oud', kind: 'answer', category: 'denominator' },
                    { id: 'delen-door-nieuw', label: '/ nieuw', kind: 'distractor', category: 'denominator', distractorFor: 'delen-door-oud' }
                ]
            }
        })).toThrow(/category must be a formula token category/);

        expect(() => TaskShellEngine.validateTask({
            ...formula,
            expected: {
                kind: 'formula_builder',
                tokens: ['nieuw-min-oud', 'onbekend'],
                acceptedSequences: [['nieuw-min-oud', 'onbekend']]
            }
        })).toThrow(/must match an interaction token/);

        expect(() => TaskShellEngine.validateTask({
            ...formula,
            interaction: {
                ...formula.interaction,
                tokens: [
                    { id: 'nieuw-min-oud', label: 'nieuw - oud', kind: 'answer', category: 'numerator' },
                    { id: 'delen-door-oud', label: '/ oud', kind: 'answer', category: 'denominator' }
                ]
            }
        })).toThrow(/tokens must include at least one distractor token/);

        expect(() => TaskShellEngine.validateTask({
            ...formula,
            expected: {
                kind: 'formula_builder',
                tokens: ['nieuw-min-oud', 'nieuw-min-oud'],
                acceptedSequences: [['nieuw-min-oud', 'nieuw-min-oud']]
            }
        })).toThrow(/uses token more than once/);

        expect(() => TaskShellEngine.validateTask({
            ...formula,
            expected: {
                kind: 'formula_builder',
                tokens: ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent'],
                acceptedSequences: [['nieuw-min-oud', 'delen-door-oud']]
            }
        })).toThrow(/must include expected.tokens/);
    });

    test('supports step ordering with exact ordered step sequences and practice feedback', () => {
        const ordering = fixtures()[16];

        expect(TaskShellEngine.evaluateTask(ordering, {
            order: ['verschil', 'deel-door-oud', 'keer-100']
        })).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true
        }));

        const retry = TaskShellEngine.evaluateTask(ordering, {
            order: ['verschil', 'keer-100', 'deel-door-nieuw']
        });
        expect(retry).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));
        expect(retry.orderFeedback).toEqual({
            mode: 'practice_only',
            firstMisplaced: {
                expectedId: 'deel-door-oud',
                expectedLabel: 'Deel door de oude waarde',
                actualId: 'keer-100',
                actualLabel: 'Vermenigvuldig met 100%'
            },
            missingRequired: [{ id: 'deel-door-oud', label: 'Deel door de oude waarde' }],
            selectedDistractors: [{ id: 'deel-door-nieuw', label: 'Deel door de nieuwe waarde' }],
            correctPrefix: [{ id: 'verschil', label: 'Bereken het verschil' }]
        });

        expect(TaskShellEngine.evaluateTask(ordering, {
            order: ['verschil', 'keer-100', 'deel-door-oud']
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(ordering, {
            order: ['verschil', 'deel-door-oud']
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(ordering, {
            order: ['verschil', 'deel-door-oud', 'keer-100', 'deel-door-nieuw']
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(ordering, {
            order: ['verschil', 'deel-door-oud', 'keer-100'],
            extra: 'ignored'
        })).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(ordering, [
            'verschil',
            'deel-door-oud',
            'keer-100'
        ])).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        const arrayWithOrder = [];
        arrayWithOrder.order = ['verschil', 'deel-door-oud', 'keer-100'];
        expect(TaskShellEngine.evaluateTask(ordering, arrayWithOrder)).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));

        expect(TaskShellEngine.evaluateTask(ordering, {
            order: ['verschil', 2, 'keer-100']
        }).matched).toBe(false);

        expect(TaskShellEngine.focusPlan(ordering)).toEqual([
            '[data-task-id="step-ordering"][data-step-id]',
            '[data-task-id="step-ordering"][data-step-sequence]'
        ]);
    });

    test('rejects invalid step ordering schemas before rendering', () => {
        const ordering = fixtures()[16];

        expect(() => TaskShellEngine.validateTask({
            ...ordering,
            interaction: {
                ...ordering.interaction,
                steps: [
                    { id: 'verschil', label: 'Bereken het verschil', kind: 'answer' },
                    { id: 'verschil', label: 'Dubbel', kind: 'answer' },
                    { id: 'deel-door-nieuw', label: 'Deel door nieuw', kind: 'distractor', distractorFor: 'verschil' }
                ]
            }
        })).toThrow(/duplicate step id/);

        expect(() => TaskShellEngine.validateTask({
            ...ordering,
            interaction: {
                ...ordering.interaction,
                steps: [
                    { id: 'verschil', label: 'Bereken het verschil', kind: 'answer' },
                    { id: 'deel-door-oud', label: 'Deel door oud', kind: 'answer' },
                    { id: 'neutraal', label: 'Lees rustig', kind: 'neutral' }
                ]
            }
        })).toThrow(/kind must be answer or distractor/);

        expect(() => TaskShellEngine.validateTask({
            ...ordering,
            interaction: {
                ...ordering.interaction,
                steps: [
                    { id: 'verschil', label: 'Bereken het verschil', kind: 'answer' },
                    { id: 'deel-door-oud', label: 'Deel door oud', kind: 'answer' }
                ]
            }
        })).toThrow(/steps must contain at least 3 item/);

        expect(() => TaskShellEngine.validateTask({
            ...ordering,
            interaction: {
                ...ordering.interaction,
                steps: [
                    { id: 'verschil', label: 'Bereken het verschil', kind: 'answer' },
                    { id: 'deel-door-oud', label: 'Deel door oud', kind: 'answer' },
                    { id: 'keer-100', label: 'Vermenigvuldig met 100%', kind: 'answer' }
                ]
            }
        })).toThrow(/must include at least one distractor step/);

        expect(() => TaskShellEngine.validateTask({
            ...ordering,
            expected: {
                kind: 'step_ordering',
                order: ['verschil', 'onbekend', 'keer-100']
            }
        })).toThrow(/must match an interaction step/);

        expect(() => TaskShellEngine.validateTask({
            ...ordering,
            expected: {
                kind: 'step_ordering',
                order: ['verschil', 'deel-door-nieuw', 'keer-100']
            }
        })).toThrow(/must be an answer step/);

        expect(() => TaskShellEngine.validateTask({
            ...ordering,
            expected: {
                kind: 'step_ordering',
                order: ['verschil', 'deel-door-oud']
            }
        })).toThrow(/must include all answer steps/);

        expect(() => TaskShellEngine.validateTask({
            ...ordering,
            expected: {
                kind: 'step_ordering',
                order: ['verschil', 'deel-door-oud', 'deel-door-oud']
            }
        })).toThrow(/uses step more than once/);

        expect(() => TaskShellEngine.validateTask({
            ...ordering,
            expected: {
                kind: 'step_ordering',
                order: ['verschil', 'deel-door-oud', 'keer-100'],
                partialFeedback: 'diagnostic'
            }
        })).toThrow(/partialFeedback must be practice_only/);
    });

    test('supports source value selection with exact value-role sets and practice feedback', () => {
        const sourceValues = fixtures()[17];

        expect(TaskShellEngine.evaluateTask(sourceValues, {
            selections: [
                { valueId: 'prijs-nieuw', role: 'new' },
                { valueId: 'prijs-oud', role: 'old' }
            ]
        })).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true
        }));

        const retry = TaskShellEngine.evaluateTask(sourceValues, {
            selections: [
                { valueId: 'prijs-oud', role: 'new' },
                { valueId: 'prijs-btw', role: 'new' }
            ]
        });
        expect(retry).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));
        expect(retry.sourceValueFeedback).toEqual({
            mode: 'practice_only',
            missingRequired: [{ id: 'prijs-nieuw', label: 'EUR 920' }],
            wrongRoles: [{
                id: 'prijs-oud',
                label: 'EUR 800',
                expectedRole: { id: 'old', label: 'oude waarde' },
                actualRole: { id: 'new', label: 'nieuwe waarde' }
            }],
            selectedDistractors: [{ id: 'prijs-btw', label: '21%' }],
            correctSelected: []
        });

        expect(TaskShellEngine.evaluateTask(sourceValues, {
            selections: [
                { valueId: 'prijs-oud', role: 'old' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(sourceValues, {
            selections: [
                { valueId: 'prijs-oud', role: 'old' },
                { valueId: 'prijs-nieuw', role: 'old' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(sourceValues, {
            selections: [
                { valueId: 'prijs-oud', role: 'old' },
                { valueId: 'prijs-nieuw', role: 'new' },
                { valueId: 'prijs-btw', role: 'new' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(sourceValues, {
            selections: [
                { valueId: 'prijs-oud', role: 'old' },
                { valueId: 'prijs-oud', role: 'new' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(sourceValues, {
            selections: [
                { valueId: 'prijs-oud', role: 'old' },
                { valueId: 'onbekend', role: 'new' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(sourceValues, {
            selections: [
                { valueId: 'prijs-oud', role: 'old' },
                { valueId: 'prijs-nieuw', role: 'basis' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(sourceValues, {
            selections: [
                { valueId: 'prijs-oud', role: 'old', extra: 'ignored' },
                { valueId: 'prijs-nieuw', role: 'new' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(sourceValues, {
            selections: [
                { valueId: 'prijs-oud', role: 'old' },
                { valueId: 'prijs-nieuw', role: 'new' }
            ],
            extra: 'ignored'
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(sourceValues, [
            { valueId: 'prijs-oud', role: 'old' },
            { valueId: 'prijs-nieuw', role: 'new' }
        ]).matched).toBe(false);
        const arrayWithSelections = [];
        arrayWithSelections.selections = [
            { valueId: 'prijs-oud', role: 'old' },
            { valueId: 'prijs-nieuw', role: 'new' }
        ];
        expect(TaskShellEngine.evaluateTask(sourceValues, arrayWithSelections).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(sourceValues, {
            selections: [
                { valueId: 'prijs-oud', role: 'old' },
                { valueId: 920, role: 'new' }
            ]
        }).matched).toBe(false);

        expect(TaskShellEngine.focusPlan(sourceValues)).toEqual([
            '[data-task-id="source-values"][data-source-value-id]',
            '[data-task-id="source-values"][data-source-role-value-id]'
        ]);
    });

    test('rejects invalid source value selection schemas before rendering', () => {
        const sourceValues = fixtures()[17];

        expect(() => TaskShellEngine.validateTask({
            ...sourceValues,
            interaction: {
                ...sourceValues.interaction,
                values: [
                    { id: 'prijs-oud', label: 'EUR 800', kind: 'answer' },
                    { id: 'prijs-oud', label: 'Dubbel', kind: 'answer' },
                    { id: 'prijs-btw', label: '21%', kind: 'distractor', distractorFor: 'prijs-oud' }
                ]
            }
        })).toThrow(/duplicate source value id/);

        expect(() => TaskShellEngine.validateTask({
            ...sourceValues,
            interaction: {
                ...sourceValues.interaction,
                values: [
                    { id: 'prijs-oud', label: 'EUR 800', kind: 'answer' },
                    { id: 'prijs-nieuw', label: 'EUR 920', kind: 'answer' }
                ]
            }
        })).toThrow(/must contain at least 3 item/);

        expect(() => TaskShellEngine.validateTask({
            ...sourceValues,
            interaction: {
                ...sourceValues.interaction,
                values: [
                    { id: 'prijs-oud', label: 'EUR 800', kind: 'answer' },
                    { id: 'prijs-nieuw', label: 'EUR 920', kind: 'answer' },
                    { id: 'prijs-extra', label: 'EUR 1000', kind: 'answer' }
                ]
            }
        })).toThrow(/must include at least one distractor value/);

        expect(() => TaskShellEngine.validateTask({
            ...sourceValues,
            interaction: {
                ...sourceValues.interaction,
                roles: [
                    { id: 'old', label: 'oude waarde' },
                    { id: 'old', label: 'dubbel' }
                ]
            }
        })).toThrow(/duplicate source role id/);

        expect(() => TaskShellEngine.validateTask({
            ...sourceValues,
            expected: {
                kind: 'source_value_selection',
                selections: [
                    { valueId: 'prijs-oud', role: 'old' },
                    { valueId: 'prijs-btw', role: 'new' }
                ]
            }
        })).toThrow(/must be an answer value/);

        expect(() => TaskShellEngine.validateTask({
            ...sourceValues,
            interaction: {
                ...sourceValues.interaction,
                values: [
                    ...sourceValues.interaction.values,
                    { id: 'prijs-actie', label: 'EUR 1000', kind: 'answer' }
                ]
            },
            expected: {
                kind: 'source_value_selection',
                selections: [
                    { valueId: 'prijs-oud', role: 'old' },
                    { valueId: 'prijs-nieuw', role: 'new' }
                ]
            }
        })).toThrow(/must include all answer values/);

        expect(() => TaskShellEngine.validateTask({
            ...sourceValues,
            expected: {
                kind: 'source_value_selection',
                selections: [
                    { valueId: 'prijs-oud', role: 'old' },
                    { valueId: 'prijs-oud', role: 'new' }
                ]
            }
        })).toThrow(/uses source value more than once/);

        expect(() => TaskShellEngine.validateTask({
            ...sourceValues,
            expected: {
                kind: 'source_value_selection',
                selections: [
                    { valueId: 'prijs-oud', role: 'old' },
                    { valueId: 'prijs-nieuw', role: 'basis' }
                ],
                partialFeedback: 'diagnostic'
            }
        })).toThrow(/role must match an interaction role/);
    });

    test('supports source chain builder with exact ordered chain and practice feedback', () => {
        const chain = fixtures()[18];

        expect(TaskShellEngine.evaluateTask(chain, {
            chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie']
        })).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true
        }));

        const retry = TaskShellEngine.evaluateTask(chain, {
            chain: ['bron', 'waarden', 'deel-door-nieuw']
        });
        expect(retry).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));
        expect(retry.sourceChainFeedback).toEqual({
            mode: 'practice_only',
            firstMisplaced: {
                expectedId: 'bewerking',
                expectedLabel: '(920 - 800) / 800 x 100%',
                actualId: 'deel-door-nieuw',
                actualLabel: 'Deel door 920'
            },
            missingRequired: [
                { id: 'bewerking', label: '(920 - 800) / 800 x 100%' },
                { id: 'antwoord', label: '15%' },
                { id: 'conclusie', label: 'De prijs stijgt met 15%' }
            ],
            selectedDistractors: [{ id: 'deel-door-nieuw', label: 'Deel door 920' }],
            correctPrefix: [
                { id: 'bron', label: 'Lees de prijstabel' },
                { id: 'waarden', label: 'Gebruik 800 en 920' }
            ],
            missingRequiredRoles: [
                { id: 'operation', label: 'bewerking' },
                { id: 'answer', label: 'antwoord' },
                { id: 'conclusion', label: 'conclusie' }
            ]
        });

        expect(TaskShellEngine.evaluateTask(chain, {
            chain: ['bron', 'waarden', 'antwoord', 'bewerking', 'conclusie']
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(chain, {
            chain: ['bron', 'waarden', 'bewerking', 'antwoord']
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(chain, {
            chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie', 'deel-door-nieuw']
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(chain, {
            chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'antwoord']
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(chain, {
            chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'onbekend']
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(chain, {
            chain: ['bron', 'waarden', 'bewerking', 'antwoord', 15]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(chain, {
            chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie'],
            extra: 'ignored'
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(chain, [
            'bron',
            'waarden',
            'bewerking',
            'antwoord',
            'conclusie'
        ]).matched).toBe(false);
        const arrayWithChain = [];
        arrayWithChain.chain = ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie'];
        expect(TaskShellEngine.evaluateTask(chain, arrayWithChain).matched).toBe(false);

        expect(TaskShellEngine.focusPlan(chain)).toEqual([
            '[data-task-id="source-chain"][data-source-node-id]',
            '[data-task-id="source-chain"][data-source-chain-sequence]'
        ]);
    });

    test('rejects invalid source chain builder schemas before rendering', () => {
        const chain = fixtures()[18];

        expect(() => TaskShellEngine.validateTask({
            ...chain,
            interaction: {
                ...chain.interaction,
                nodes: [
                    { id: 'bron', label: 'Lees de prijstabel', kind: 'answer', nodeRole: 'source' },
                    { id: 'bron', label: 'Dubbel', kind: 'answer', nodeRole: 'value' },
                    { id: 'bewerking', label: 'Bewerking', kind: 'answer', nodeRole: 'operation' },
                    { id: 'antwoord', label: '15%', kind: 'answer', nodeRole: 'answer' },
                    { id: 'conclusie', label: 'Conclusie', kind: 'answer', nodeRole: 'conclusion' },
                    { id: 'afleider', label: 'Afleider', kind: 'distractor', nodeRole: 'operation', distractorFor: 'bewerking' }
                ]
            }
        })).toThrow(/duplicate source chain node id/);

        expect(() => TaskShellEngine.validateTask({
            ...chain,
            interaction: {
                ...chain.interaction,
                nodes: chain.interaction.nodes.map((node) => node.id === 'conclusie'
                    ? { ...node, kind: 'distractor', distractorFor: 'antwoord' }
                    : node)
            }
        })).toThrow(/nodeRole conclusion/);

        expect(() => TaskShellEngine.validateTask({
            ...chain,
            interaction: {
                ...chain.interaction,
                nodes: chain.interaction.nodes.map((node) => node.kind === 'distractor'
                    ? { ...node, kind: 'answer' }
                    : node)
            }
        })).toThrow(/must include at least one distractor node/);

        expect(() => TaskShellEngine.validateTask({
            ...chain,
            interaction: {
                ...chain.interaction,
                nodes: [
                    { id: 'bron', label: 'Lees de prijstabel', kind: 'answer', nodeRole: 'source' },
                    { id: 'waarden', label: 'Gebruik 800 en 920', kind: 'answer', nodeRole: 'value' },
                    { id: 'bewerking', label: 'Bewerking', kind: 'answer', nodeRole: 'formula' },
                    { id: 'antwoord', label: '15%', kind: 'answer', nodeRole: 'answer' },
                    { id: 'conclusie', label: 'Conclusie', kind: 'answer', nodeRole: 'conclusion' },
                    { id: 'afleider', label: 'Afleider', kind: 'distractor', nodeRole: 'operation', distractorFor: 'bewerking' }
                ]
            }
        })).toThrow(/nodeRole must be a source-chain node role/);

        expect(() => TaskShellEngine.validateTask({
            ...chain,
            expected: {
                kind: 'source_chain_builder',
                chain: ['bron', 'waarden', 'deel-door-nieuw', 'antwoord', 'conclusie']
            }
        })).toThrow(/must be an answer node/);

        expect(() => TaskShellEngine.validateTask({
            ...chain,
            interaction: {
                ...chain.interaction,
                nodes: [
                    ...chain.interaction.nodes,
                    { id: 'controle', label: 'Controleer eenheid', kind: 'answer', nodeRole: 'conclusion' }
                ]
            },
            expected: {
                kind: 'source_chain_builder',
                chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie']
            }
        })).toThrow(/must include all answer nodes/);

        expect(() => TaskShellEngine.validateTask({
            ...chain,
            expected: {
                kind: 'source_chain_builder',
                chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'antwoord']
            }
        })).toThrow(/uses node more than once/);

        expect(() => TaskShellEngine.validateTask({
            ...chain,
            expected: {
                kind: 'source_chain_builder',
                chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie'],
                partialFeedback: 'diagnostic'
            }
        })).toThrow(/partialFeedback must be practice_only/);
    });

    test('supports label placement with exact order-insensitive placement sets and practice feedback', () => {
        const labels = fixtures()[19];

        expect(TaskShellEngine.evaluateTask(labels, {
            placements: [
                { labelId: 'hoeveelheid', targetId: 'x-as' },
                { labelId: 'prijs', targetId: 'y-as' }
            ]
        })).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true
        }));

        const retry = TaskShellEngine.evaluateTask(labels, {
            placements: [
                { labelId: 'prijs', targetId: 'x-as' },
                { labelId: 'omzet', targetId: 'caption' }
            ]
        });
        expect(retry).toEqual(expect.objectContaining({
            state: 'retry',
            matched: false
        }));
        expect(retry.labelPlacementFeedback).toEqual({
            mode: 'practice_only',
            missingLabels: [{ id: 'hoeveelheid', label: 'Hoeveelheid' }],
            missingTargets: [{ id: 'y-as', label: 'Verticale as' }],
            misplacedLabels: [{
                label: { id: 'prijs', label: 'Prijs' },
                expectedTarget: { id: 'y-as', label: 'Verticale as' },
                actualTarget: { id: 'x-as', label: 'Horizontale as' }
            }],
            selectedDistractorLabels: [{ id: 'omzet', label: 'Omzet' }],
            selectedDistractorTargets: [{ id: 'caption', label: 'Bijschrift' }],
            correctPlacements: []
        });

        expect(TaskShellEngine.evaluateTask(labels, {
            placements: [
                { labelId: 'prijs', targetId: 'y-as' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(labels, {
            placements: [
                { labelId: 'prijs', targetId: 'x-as' },
                { labelId: 'hoeveelheid', targetId: 'y-as' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(labels, {
            placements: [
                { labelId: 'prijs', targetId: 'y-as' },
                { labelId: 'hoeveelheid', targetId: 'x-as' },
                { labelId: 'omzet', targetId: 'caption' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(labels, {
            placements: [
                { labelId: 'prijs', targetId: 'y-as' },
                { labelId: 'prijs', targetId: 'x-as' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(labels, {
            placements: [
                { labelId: 'prijs', targetId: 'y-as' },
                { labelId: 'hoeveelheid', targetId: 'y-as' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(labels, {
            placements: [
                { labelId: 'prijs', targetId: 'y-as' },
                { labelId: 'onbekend', targetId: 'x-as' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(labels, {
            placements: [
                { labelId: 'prijs', targetId: 'y-as' },
                { labelId: 'hoeveelheid', targetId: 'onbekend' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(labels, {
            placements: [
                { labelId: 'prijs', targetId: 'y-as', extra: 'ignored' },
                { labelId: 'hoeveelheid', targetId: 'x-as' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(labels, {
            placements: [
                { labelId: 'prijs', targetId: 'y-as' },
                { labelId: 'hoeveelheid', targetId: 'x-as' }
            ],
            extra: 'ignored'
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(labels, [
            { labelId: 'prijs', targetId: 'y-as' },
            { labelId: 'hoeveelheid', targetId: 'x-as' }
        ]).matched).toBe(false);
        const arrayWithPlacements = [];
        arrayWithPlacements.placements = [
            { labelId: 'prijs', targetId: 'y-as' },
            { labelId: 'hoeveelheid', targetId: 'x-as' }
        ];
        expect(TaskShellEngine.evaluateTask(labels, arrayWithPlacements).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(labels, {
            placements: [
                { labelId: 'prijs', targetId: 'y-as' },
                { labelId: 42, targetId: 'x-as' }
            ]
        }).matched).toBe(false);
        expect(TaskShellEngine.evaluateTask(labels, {
            placements: [
                { labelId: 'prijs', targetId: 'y-as' },
                { labelId: 'hoeveelheid', targetId: 42 }
            ]
        }).matched).toBe(false);

        expect(TaskShellEngine.focusPlan(labels)).toEqual([
            '[data-task-id="label-placement"][data-label-id]',
            '[data-task-id="label-placement"][data-label-target-id]',
            '[data-task-id="label-placement"][data-label-placement-summary]'
        ]);
    });

    test('rejects invalid label placement schemas before rendering', () => {
        const labels = fixtures()[19];

        expect(() => TaskShellEngine.validateTask({
            ...labels,
            interaction: {
                ...labels.interaction,
                labels: [
                    { id: 'prijs', label: 'Prijs', description: 'Prijsas', kind: 'answer' },
                    { id: 'prijs', label: 'Dubbel', description: 'Dubbel label', kind: 'answer' },
                    { id: 'omzet', label: 'Omzet', description: 'Afleider', kind: 'distractor', distractorFor: 'prijs' }
                ]
            }
        })).toThrow(/duplicate label placement label id/);

        expect(() => TaskShellEngine.validateTask({
            ...labels,
            interaction: {
                ...labels.interaction,
                labels: labels.interaction.labels.map((label) => label.id === 'prijs'
                    ? { id: label.id, label: label.label, kind: label.kind }
                    : label)
            }
        })).toThrow(/description/);

        expect(() => TaskShellEngine.validateTask({
            ...labels,
            interaction: {
                ...labels.interaction,
                labels: labels.interaction.labels.map((label) => label.kind === 'distractor'
                    ? { ...label, distractorFor: undefined }
                    : label)
            }
        })).toThrow(/distractorFor/);

        expect(() => TaskShellEngine.validateTask({
            ...labels,
            interaction: {
                ...labels.interaction,
                targets: labels.interaction.targets.map((target) => target.id === 'x-as'
                    ? { id: target.id, label: target.label, kind: target.kind, targetRole: target.targetRole }
                    : target)
            }
        })).toThrow(/description/);

        expect(() => TaskShellEngine.validateTask({
            ...labels,
            interaction: {
                ...labels.interaction,
                targets: labels.interaction.targets.map((target) => target.kind === 'distractor'
                    ? { ...target, distractorFor: undefined }
                    : target)
            }
        })).toThrow(/distractorFor/);

        expect(() => TaskShellEngine.validateTask({
            ...labels,
            interaction: {
                ...labels.interaction,
                targets: labels.interaction.targets.map((target) => target.id === 'caption'
                    ? { ...target, targetRole: 'caption' }
                    : target)
            }
        })).toThrow(/targetRole must be a label-placement target role/);

        expect(() => TaskShellEngine.validateTask({
            ...labels,
            interaction: {
                ...labels.interaction,
                targets: labels.interaction.targets.map((target) => target.id === 'x-as'
                    ? { ...target, x: 120 }
                    : target)
            }
        })).toThrow(/x must be between 0 and 100/);

        expect(() => TaskShellEngine.validateTask({
            ...labels,
            expected: {
                kind: 'label_placement',
                placements: [
                    { labelId: 'prijs', targetId: 'y-as' },
                    { labelId: 'onbekend', targetId: 'x-as' }
                ]
            }
        })).toThrow(/must match an interaction label/);

        expect(() => TaskShellEngine.validateTask({
            ...labels,
            expected: {
                kind: 'label_placement',
                placements: [
                    { labelId: 'prijs', targetId: 'y-as' },
                    { labelId: 'hoeveelheid', targetId: 'onbekend' }
                ]
            }
        })).toThrow(/must match an interaction target/);

        expect(() => TaskShellEngine.validateTask({
            ...labels,
            expected: {
                kind: 'label_placement',
                placements: [
                    { labelId: 'prijs', targetId: 'y-as' },
                    { labelId: 'omzet', targetId: 'x-as' }
                ]
            }
        })).toThrow(/must be an answer label/);

        expect(() => TaskShellEngine.validateTask({
            ...labels,
            expected: {
                kind: 'label_placement',
                placements: [
                    { labelId: 'prijs', targetId: 'caption' },
                    { labelId: 'hoeveelheid', targetId: 'x-as' }
                ]
            }
        })).toThrow(/must be an answer target/);

        expect(() => TaskShellEngine.validateTask({
            ...labels,
            interaction: {
                ...labels.interaction,
                labels: [
                    ...labels.interaction.labels,
                    {
                        id: 'vraaglijn',
                        label: 'Vraaglijn',
                        description: 'Een extra antwoordlabel.',
                        kind: 'answer'
                    }
                ]
            },
            expected: {
                kind: 'label_placement',
                placements: [
                    { labelId: 'prijs', targetId: 'y-as' },
                    { labelId: 'hoeveelheid', targetId: 'x-as' }
                ]
            }
        })).toThrow(/must include all answer labels/);

        expect(() => TaskShellEngine.validateTask({
            ...labels,
            expected: {
                kind: 'label_placement',
                placements: [
                    { labelId: 'prijs', targetId: 'y-as' },
                    { labelId: 'prijs', targetId: 'x-as' }
                ]
            }
        })).toThrow(/uses label more than once/);

        expect(() => TaskShellEngine.validateTask({
            ...labels,
            expected: {
                kind: 'label_placement',
                placements: [
                    { labelId: 'prijs', targetId: 'y-as' },
                    { labelId: 'hoeveelheid', targetId: 'y-as' }
                ]
            }
        })).toThrow(/uses target more than once/);

        expect(() => TaskShellEngine.validateTask({
            ...labels,
            expected: {
                kind: 'label_placement',
                placements: [
                    { labelId: 'prijs', targetId: 'y-as' },
                    { labelId: 'hoeveelheid', targetId: 'x-as' }
                ],
                partialFeedback: 'diagnostic'
            }
        })).toThrow(/partialFeedback must be practice_only/);
    });

    test('rejects invalid cloze tile schemas before rendering', () => {
        const cloze = fixtures()[6];
        expect(() => TaskShellEngine.validateTask({
            ...cloze,
            interaction: {
                ...cloze.interaction,
                blanks: [
                    { id: 'indexpunten', label: 'Stijging in indexpunten' },
                    { id: 'indexpunten', label: 'Dubbel' }
                ]
            }
        })).toThrow(/duplicate cloze blank id/);

        expect(() => TaskShellEngine.validateTask({
            ...cloze,
            expected: {
                kind: 'cloze_tile_select',
                blanks: {
                    indexpunten: 'onbekend',
                    basis: 'honderdacht'
                }
            }
        })).toThrow(/must match an interaction tile/);

        expect(() => TaskShellEngine.validateTask({
            ...cloze,
            interaction: {
                ...cloze.interaction,
                tiles: [
                    { id: 'vier', label: '4', kind: 'answer' },
                    { id: 'honderdacht', label: '108', kind: 'answer' }
                ]
            }
        })).toThrow(/must include at least one distractor/);

        expect(() => TaskShellEngine.validateTask({
            ...cloze,
            expected: {
                kind: 'cloze_tile_select',
                blanks: {
                    indexpunten: 'vier',
                    basis: 'vier'
                }
            }
        })).toThrow(/uses tile more than once/);
    });

    test('rejects invalid cloze text schemas before rendering', () => {
        const cloze = fixtures()[7];

        expect(() => TaskShellEngine.validateTask({
            ...cloze,
            interaction: {
                ...cloze.interaction,
                blanks: [
                    { id: 'indexpunten', label: 'Stijging in indexpunten' },
                    { id: 'indexpunten', label: 'Dubbel' },
                    { id: 'basis', label: 'Oude index als basis' },
                    { id: 'reden', label: 'Waarom 108 de basis is' }
                ]
            }
        })).toThrow(/duplicate cloze text blank id/);

        expect(() => TaskShellEngine.validateTask({
            ...cloze,
            interaction: {
                ...cloze.interaction,
                segments: [
                    { type: 'text', text: 'De stijging is ' },
                    { type: 'blank', blankId: 'indexpunten' }
                ]
            }
        })).toThrow(/segments must include blank basis/);

        expect(() => TaskShellEngine.validateTask({
            ...cloze,
            expected: {
                kind: 'cloze_text',
                blanks: {
                    indexpunten: { accepted: ['4'] },
                    basis: { accepted: ['108'] },
                    reden: {}
                }
            }
        })).toThrow(/must include accepted or requiredTextGroups/);

        expect(() => TaskShellEngine.validateTask({
            ...cloze,
            expected: {
                kind: 'cloze_text',
                blanks: {
                    indexpunten: { accepted: ['4'] },
                    basis: { accepted: ['108'] },
                    reden: { requiredTextGroups: [{ label: 'basis', any: ['basis'] }] }
                }
            }
        })).toThrow(/requiredTextGroups\[0\] must contain at least 1 item/);

        expect(() => TaskShellEngine.validateTask({
            ...cloze,
            expected: {
                kind: 'cloze_text',
                blanks: {
                    indexpunten: { accepted: ['4'] },
                    basis: { accepted: ['108'] },
                    reden: { requiredTextGroups: [['basis']] },
                    extra: { accepted: ['x'] }
                }
            }
        })).toThrow(/expected.blanks must match all interaction blanks/);
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
