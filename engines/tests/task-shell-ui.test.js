const TaskShellUI = require('../task-shell-ui');
const TaskShellEngine = require('../task-shell-engine');
const A96ProofData = require('../../build-scripts/sprints/mtu-ans-proof-impl1-a96-data');

function task(id, family, interaction, expected, feedback) {
    const selfCheck = expected.kind === 'self_check';
    return {
        id,
        family,
        skillLabel: 'Studentvaardigheid',
        purpose: 'Deze taak oefent een lokale stap.',
        prompt: 'Voer de gevraagde handeling uit.',
        interaction,
        expected,
        feedback: feedback || (selfCheck ? {
            selfCheckTitle: 'Controleer je antwoord',
            selfCheckText: 'Vergelijk je werk met de punten.',
            retryTitle: 'Vul eerst iets in',
            retryText: 'Schrijf je antwoord voordat je controleert.'
        } : {
            matchTitle: 'Past bij de stap',
            matchText: 'Je antwoord sluit aan op de vraag.',
            retryTitle: 'Kijk nog een keer',
            retryText: 'Vergelijk je antwoord met de gevraagde handeling.'
        }),
        practiceRoute: {
            label: 'Oefen deze stap verder',
            href: 'oefenen.html'
        }
    };
}

function data() {
    return {
        schema_version: 1,
        title: 'Gedeelde taakvormen',
        intro: 'Gebruik dezelfde taaktaal voor verschillende oefenroutes.',
        tasks: [
            task('numeric', 'numeric_input', { inputLabel: 'Numeriek antwoord' }, { kind: 'number', value: 10 }),
            {
                ...task('work', 'calculation_work_capture', {
                    workLabel: 'Berekening',
                    finalAnswerLabel: 'Eindantwoord',
                    finalAnswerPlaceholder: 'Bijvoorbeeld 15',
                    unitNotationLabel: 'Notatie',
                    unitNotationPlaceholder: 'Bijvoorbeeld %'
                }, {
                    kind: 'self_check',
                    criteria: ['Formule zichtbaar', 'Waarden ingevuld']
                }),
                hints: ['Denk aan nieuw min oud, gedeeld door oud.']
            },
            task('final', 'final_answer_entry', { inputLabel: 'Eindantwoord' }, { kind: 'text', accepted: ['10%'] }),
            task('unit', 'unit_notation_field', { inputLabel: 'Eenheid of notatie' }, { kind: 'text', accepted: ['%'] }),
            task('short', 'short_constructed_response', { inputLabel: 'Kort antwoord' }, { kind: 'self_check', criteria: ['Oorzaak genoemd'] }),
            task('structured-short', 'structured_short_response', {
                fields: [
                    { id: 'indexpunten', label: 'Stijging in indexpunten' },
                    { id: 'basis', label: 'Basis voor procentuele verandering' }
                ],
                options: [
                    { id: 'niet-vier-procent', label: 'Klopt niet' },
                    { id: 'wel-vier-procent', label: 'Klopt wel' }
                ]
            }, {
                kind: 'structured_text_criteria',
                criteria: ['Noem indexpunten', 'Kies de juiste uitspraak'],
                fields: [
                    { id: 'indexpunten', accepted: ['4', '4 indexpunten'] },
                    { id: 'basis', accepted: ['108'] }
                ],
                choice: { value: 'niet-vier-procent' }
            }),
            task('cloze-tiles', 'cloze_tile_select', {
                segments: [
                    { type: 'text', text: 'De stijging is ' },
                    { type: 'blank', blankId: 'indexpunten' },
                    { type: 'text', text: ' indexpunten en de basis is ' },
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
            }, {
                kind: 'cloze_tile_select',
                blanks: {
                    indexpunten: 'vier',
                    basis: 'honderdacht'
                }
            }),
            task('cloze-text', 'cloze_text', {
                segments: [
                    { type: 'text', text: 'De stijging is ' },
                    { type: 'blank', blankId: 'indexpunten' },
                    { type: 'text', text: ' indexpunten en de basis is ' },
                    { type: 'blank', blankId: 'basis' },
                    { type: 'text', text: '.' }
                ],
                blanks: [
                    { id: 'indexpunten', label: 'Stijging in indexpunten', placeholder: 'bijv. 4', inputMode: 'decimal', width: 'short' },
                    { id: 'basis', label: 'Basis voor procentuele stijging', placeholder: 'bijv. 108', inputMode: 'decimal', width: 'short' }
                ]
            }, {
                kind: 'cloze_text',
                blanks: {
                    indexpunten: { accepted: ['4', '4 indexpunten'] },
                    basis: { accepted: ['108'] }
                }
            }),
            task('multi-select', 'multi_select', {
                inputLabel: 'Uitspraken over schaarste',
                options: [
                    { id: 'behoeften', label: 'Behoeften zijn groter dan middelen.' },
                    { id: 'keuze', label: 'Je moet kiezen tussen alternatieven.' },
                    { id: 'alles-kan', label: 'Iedereen kan alles krijgen wat hij wil.' }
                ]
            }, {
                kind: 'multi_select',
                mode: 'exact_set',
                values: ['behoeften', 'keuze'],
                partialFeedback: 'practice_only'
            }),
            task('sentence-builder', 'sentence_builder', {
                tokens: [
                    { id: 'prijs-stijgt', label: 'De prijs stijgt', kind: 'answer' },
                    { id: 'vraag-daalt', label: 'de gevraagde hoeveelheid daalt', kind: 'answer' },
                    { id: 'hogere-prijs', label: 'bij een hogere prijs', kind: 'answer' },
                    { id: 'vraag-stijgt', label: 'de gevraagde hoeveelheid stijgt', kind: 'distractor', distractorFor: 'vraag-daalt' }
                ],
                separator: ' -> ',
                placeholder: 'Bouw je redenering.',
                tokenBankLabel: 'Fragmentbank',
                sequenceLabel: 'Opgebouwde redenering'
            }, {
                kind: 'sentence_builder',
                tokens: ['prijs-stijgt', 'vraag-daalt', 'hogere-prijs'],
                acceptedSequences: [
                    ['prijs-stijgt', 'vraag-daalt', 'hogere-prijs']
                ]
            }),
            task('formula-builder', 'formula_builder', {
                tokens: [
                    { id: 'nieuw-min-oud', label: 'nieuw - oud', kind: 'answer', category: 'numerator' },
                    { id: 'delen-door-oud', label: '/ oud', kind: 'answer', category: 'denominator' },
                    { id: 'keer-100-procent', label: 'x 100%', kind: 'answer', category: 'multiplier' },
                    { id: 'delen-door-nieuw', label: '/ nieuw', kind: 'distractor', category: 'denominator', distractorFor: 'delen-door-oud' }
                ],
                separator: ' ',
                placeholder: 'Bouw de formule.',
                tokenBankLabel: 'Formuleblokken',
                sequenceLabel: 'Opgebouwde formule'
            }, {
                kind: 'formula_builder',
                tokens: ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent'],
                acceptedSequences: [
                    ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent']
                ]
            }),
            task('step-ordering', 'step_ordering', {
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
            }, {
                kind: 'step_ordering',
                order: ['verschil', 'deel-door-oud', 'keer-100'],
                partialFeedback: 'practice_only'
            }),
            task('source-values', 'source_value_selection', {
                valueBankLabel: 'Bronwaarden',
                roleLabel: 'Rol in berekening',
                values: [
                    { id: 'prijs-oud', label: 'EUR 800', kind: 'answer', sourceLabel: 'oude prijs', unit: 'euro', period: 'jaar 1' },
                    { id: 'prijs-nieuw', label: 'EUR 920', kind: 'answer', sourceLabel: 'nieuwe prijs', unit: 'euro', period: 'jaar 2' },
                    { id: 'prijs-btw', label: '21%', kind: 'distractor', distractorFor: 'prijs-nieuw' }
                ],
                roles: [
                    { id: 'old', label: 'oude waarde' },
                    { id: 'new', label: 'nieuwe waarde' }
                ]
            }, {
                kind: 'source_value_selection',
                selections: [
                    { valueId: 'prijs-oud', role: 'old' },
                    { valueId: 'prijs-nieuw', role: 'new' }
                ],
                partialFeedback: 'practice_only'
            }),
            task('source-chain', 'source_chain_builder', {
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
            }, {
                kind: 'source_chain_builder',
                chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie'],
                partialFeedback: 'practice_only'
            }),
            task('label-placement', 'label_placement', {
                labelBankLabel: 'Labelbank',
                targetRegionLabel: 'Grafiekvlak',
                placementLabel: 'Geplaatste labels',
                visual: {
                    kind: 'coordinate_plane',
                    title: 'Prijs-hoeveelheidgrafiek',
                    description: 'Een assenstelsel met prijs op de verticale as en hoeveelheid op de horizontale as.'
                },
                labels: [
                    { id: 'prijs', label: 'Prijs', description: 'De prijs hoort op de verticale as.', kind: 'answer' },
                    { id: 'hoeveelheid', label: 'Hoeveelheid', description: 'De hoeveelheid hoort op de horizontale as.', kind: 'answer' },
                    { id: 'omzet', label: 'Omzet', description: 'Omzet is hier een afleider.', kind: 'distractor', distractorFor: 'prijs' }
                ],
                targets: [
                    { id: 'y-as', label: 'Verticale as', description: 'Plaats hier het prijslabel.', kind: 'answer', targetRole: 'axis', x: 14, y: 26 },
                    { id: 'x-as', label: 'Horizontale as', description: 'Plaats hier het hoeveelheidlabel.', kind: 'answer', targetRole: 'axis', x: 72, y: 84 },
                    { id: 'caption', label: 'Bijschrift', description: 'Dit is geen aslabel.', kind: 'distractor', targetRole: 'structure_part', distractorFor: 'y-as', x: 78, y: 16 }
                ]
            }, {
                kind: 'label_placement',
                placements: [
                    { labelId: 'prijs', targetId: 'y-as' },
                    { labelId: 'hoeveelheid', targetId: 'x-as' }
                ],
                partialFeedback: 'practice_only'
            }),
            task('matching-pairs', 'matching_pairs', {
                leftBankLabel: 'Begrippen',
                rightBankLabel: 'Betekenissen',
                pairLabel: 'Gemaakte koppels',
                placeholder: 'Kies een begrip en daarna de juiste betekenis.',
                leftItems: [
                    { id: 'schaarste', label: 'Schaarste', description: 'Begrip over beperkte middelen.', kind: 'answer' },
                    { id: 'alternatieve-kosten', label: 'Alternatieve kosten', description: 'Beste niet-gekozen alternatief.', kind: 'answer' },
                    { id: 'winst', label: 'Winst', description: 'Afleider buiten deze koppeling.', kind: 'distractor', distractorFor: 'schaarste' }
                ],
                rightItems: [
                    { id: 'behoeften-middelen', label: 'Behoeften zijn groter dan middelen', description: 'Betekenis van schaarste.', kind: 'answer' },
                    { id: 'beste-alternatief', label: 'Beste niet-gekozen alternatief', description: 'Betekenis van alternatieve kosten.', kind: 'answer' },
                    { id: 'opbrengst-kosten', label: 'Opbrengst min kosten', description: 'Afleider die bij winst hoort.', kind: 'distractor', distractorFor: 'behoeften-middelen' }
                ]
            }, {
                kind: 'matching_pairs',
                pairs: [
                    ['schaarste', 'behoeften-middelen'],
                    ['alternatieve-kosten', 'beste-alternatief']
                ],
                partialFeedback: 'practice_only'
            }),
            task('two-tier-choice', 'two_tier_choice', {
                answerLabel: 'Kies het antwoord',
                reasonLabel: 'Kies de reden',
                answerOptions: [
                    {
                        id: 'vier-indexpunten',
                        label: 'De stijging is 4 indexpunten.',
                        description: 'Het verschil tussen 112 en 108 wordt in indexpunten genoemd.'
                    },
                    {
                        id: 'vier-procent',
                        label: 'De stijging is 4 procent.',
                        description: 'Dit verwart indexpunten met procentuele verandering.'
                    }
                ],
                reasonOptions: [
                    {
                        id: 'verschil-in-punten',
                        label: 'Indexpunten bereken je door indexgetallen af te trekken.',
                        description: '112 min 108 is 4 indexpunten.'
                    },
                    {
                        id: 'delen-door-honderd',
                        label: 'Je deelt altijd door 100.',
                        description: 'Dit is geen goede reden voor procentuele verandering.'
                    }
                ]
            }, {
                kind: 'two_tier_choice',
                answer: 'vier-indexpunten',
                reason: 'verschil-in-punten',
                partialFeedback: 'practice_only'
            }),
            task('table', 'table_value_selection', { inputLabel: 'Tabelwaarde', options: [{ id: 'a', label: '8' }, { id: 'b', label: '10' }] }, { kind: 'choice', value: 'b' }),
            task('graph', 'graph_reading', { inputLabel: 'Afgelezen waarde' }, { kind: 'number', value: 10, tolerance: 1 }),
            task('point', 'point_placement', { xLabel: 'Hoeveelheid', yLabel: 'Prijs' }, { kind: 'point', x: 4, y: 10 }),
            task('construct', 'graph_construction_substitute', {
                workspaceTitle: 'Tekenruimte',
                xAxisLabel: 'Horizontale as',
                yAxisLabel: 'Verticale as',
                pointRowsLabel: 'Punten uit de tabel',
                lineConfirmationLabel: 'Ik heb de punten met een dalende lijn verbonden',
                lineShapeLabel: 'Lijnvorm',
                xInputLabel: 'Q',
                yInputLabel: 'P',
                emptyGraphAltText: 'Lege P-Q-grafiek voor constructie',
                axes: {
                    x: { label: 'Q', min: 0, max: 20 },
                    y: { label: 'P', min: 0, max: 4 }
                },
                pointCount: 2
            }, {
                kind: 'graph_construction_substitute',
                axes: {
                    xAccepted: ['q', 'hoeveelheid'],
                    yAccepted: ['p', 'prijs']
                },
                points: [
                    { x: 0, y: 4 },
                    { x: 20, y: 2 }
                ],
                toleranceX: 0,
                toleranceY: 0,
                lineShape: 'decreasing'
            }),
            task('reasoning', 'structured_reasoning', { inputLabel: 'Redenering' }, { kind: 'self_check', criteria: ['Oorzaak genoemd', 'Conclusie gekoppeld'] }),
            task('assertion-reason', 'assertion_reason', {
                assertionLabel: 'Stelling',
                assertionText: 'Als de prijs stijgt, daalt de gevraagde hoeveelheid.',
                reasonLabel: 'Reden',
                reasonText: 'Bij een hogere prijs kopen consumenten meestal minder.',
                optionLabel: 'Kies de juiste relatie',
                options: [
                    {
                        id: 'both-correct-explains',
                        label: 'Stelling en reden zijn juist, en de reden ondersteunt de stelling.',
                        description: 'De reden legt uit waarom de gevraagde hoeveelheid daalt.'
                    },
                    {
                        id: 'both-correct-no-explain',
                        label: 'Stelling en reden zijn juist, maar de reden ondersteunt de stelling niet.',
                        description: 'Gebruik dit alleen wanneer de reden losstaat van de stelling.'
                    },
                    {
                        id: 'assertion-correct-reason-wrong',
                        label: 'De stelling is juist, maar de reden is onjuist.',
                        description: 'De richting klopt, maar de uitleg niet.'
                    },
                    {
                        id: 'assertion-wrong-reason-correct',
                        label: 'De stelling is onjuist, maar de reden is juist.',
                        description: 'De uitleg kan kloppen, terwijl de stelling niet klopt.'
                    },
                    {
                        id: 'both-wrong',
                        label: 'Stelling en reden zijn allebei onjuist.',
                        description: 'Kies dit als beide onderdelen niet kloppen.'
                    }
                ]
            }, {
                kind: 'assertion_reason',
                value: 'both-correct-explains',
                partialFeedback: 'practice_only'
            }),
            {
                ...A96ProofData.strictA96Task,
                id: 'answer-form',
                contextRefs: undefined
            }
        ]
    };
}

function contextBlocks() {
    return [
        {
            id: 'ctx-zorg-intro',
            type: 'markdown',
            title: 'Vergelijk twee verzekeringen',
            bodyMarkdown: 'Een leerling vergelijkt twee varianten met premie per maand en eigen risico per jaar.',
            accessibilitySummary: 'Korte inleiding bij de vergelijking.'
        },
        {
            id: 'ctx-zorg-source',
            type: 'source_excerpt',
            sourceLabel: 'Bron 1',
            caption: 'Bron 1: Gegevens verzekeringen',
            bodyMarkdown: 'De bron toont per variant de maandpremie en het eigen risico.',
            sourceRefs: ['references/external/exams/example.pdf#question-1'],
            accessibilitySummary: 'Tekstbron met de benodigde gegevens.'
        },
        {
            id: 'ctx-zorg-table',
            type: 'table',
            sourceLabel: 'Tabel 1',
            caption: 'Tabel 1: Premie en eigen risico',
            sourceMaterialId: 'zorg-table',
            columns: ['Variant', 'Eigen risico per jaar', 'Premie per maand'],
            rows: [
                ['Standaard', 385, '108,25 euro'],
                ['Verhoogd', 885, '86,25 euro']
            ],
            altText: 'Tabel met twee varianten, het eigen risico per jaar en de premie per maand.'
        },
        {
            id: 'ctx-zorg-svg',
            type: 'svg_figure',
            sourceLabel: 'Figuur 1',
            caption: 'Figuur 1: Premieverschil per maand',
            sourceMaterialId: 'zorg-table',
            svg: '<svg viewBox="0 0 320 180" role="img"><rect x="60" y="40" width="80" height="110"></rect><rect x="180" y="70" width="80" height="80"></rect></svg>',
            viewBox: '0 0 320 180',
            altText: 'Staafdiagram waarin de maandpremie van de verhoogde variant lager is.',
            reconstruction: {
                status: 'reconstructed_from_source',
                sourceMaterialId: 'zorg-table',
                rawCopiedImage: false
            }
        },
        {
            id: 'ctx-zorg-graph',
            type: 'graph',
            sourceLabel: 'Figuur 2',
            caption: 'Figuur 2: Jaarpremie per variant',
            sourceMaterialId: 'zorg-table',
            axes: {
                x: { label: 'Variant' },
                y: { label: 'Jaarpremie in euro' }
            },
            series: [
                {
                    label: 'Jaarpremie',
                    points: [
                        { x: 'Standaard', y: 1299 },
                        { x: 'Verhoogd', y: 1035 }
                    ]
                }
            ],
            altText: 'Grafiek met jaarpremies voor standaard en verhoogd eigen risico.'
        },
        {
            id: 'ctx-zorg-flow',
            type: 'flowchart',
            sourceLabel: 'Figuur 3',
            caption: 'Figuur 3: Denkroute van maand naar jaar',
            sourceMaterialId: 'zorg-table',
            nodes: [
                { id: 'premie-maand', label: 'Premie per maand' },
                { id: 'premie-jaar', label: 'Premie per jaar' },
                { id: 'vergelijk', label: 'Vergelijk varianten' }
            ],
            edges: [
                { from: 'premie-maand', to: 'premie-jaar', label: 'keer 12' },
                { from: 'premie-jaar', to: 'vergelijk', label: 'naast eigen risico' }
            ],
            altText: 'Stroomschema van maandpremie naar jaarpremie en vergelijking.'
        },
        {
            id: 'ctx-zorg-formula',
            type: 'formula',
            sourceLabel: 'Formule 1',
            caption: 'Formule 1: Jaarpremie',
            sourceMaterialId: 'zorg-table',
            expression: 'jaarpremie = maandpremie x 12',
            variables: [
                { symbol: 'maandpremie', meaning: 'premie per maand in euro' },
                { symbol: 'jaarpremie', meaning: 'premie per jaar in euro' }
            ],
            altText: 'Formule waarin jaarpremie gelijk is aan maandpremie keer twaalf.'
        },
        {
            id: 'ctx-zorg-info',
            type: 'info_box',
            title: 'Let op de eenheid',
            bodyMarkdown: 'Premie staat per maand; eigen risico staat per jaar.',
            accessibilitySummary: 'Informatiekader over maand- en jaarbedragen.'
        }
    ];
}

function contextData() {
    return {
        schema_version: 1,
        title: 'Context in de taakschil',
        intro: 'Gebruik de bron voordat je een keuze maakt.',
        contextBlocks: contextBlocks(),
        tasks: [
            task('context-source-values', 'source_value_selection', {
                valueBankLabel: 'Bronwaarden',
                roleLabel: 'Rol in berekening',
                values: [
                    { id: 'standaard', label: '108,25 euro', kind: 'answer', sourceLabel: 'standaard maandpremie' },
                    { id: 'verhoogd', label: '86,25 euro', kind: 'answer', sourceLabel: 'verhoogde maandpremie' },
                    { id: 'eigen-risico', label: '385 euro', kind: 'distractor', distractorFor: 'standaard' }
                ],
                roles: [
                    { id: 'standard', label: 'standaard premie' },
                    { id: 'raised', label: 'verhoogde premie' }
                ]
            }, {
                kind: 'source_value_selection',
                selections: [
                    { valueId: 'standaard', role: 'standard' },
                    { valueId: 'verhoogd', role: 'raised' }
                ],
                partialFeedback: 'practice_only'
            })
        ].map((item) => ({
            ...item,
            contextRefs: contextBlocks().map((block) => block.id)
        }))
    };
}

describe('TaskShellUI', () => {
    test('renders all accepted task families with stable task markers', () => {
        const html = TaskShellUI.renderStaticHtml(data());
        for (const family of [
            'numeric_input',
            'calculation_work_capture',
            'calculation_answer_form_capture',
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
            'matching_pairs',
            'two_tier_choice',
            'assertion_reason',
            'source_value_selection',
            'source_chain_builder',
            'label_placement',
            'table_value_selection',
            'graph_reading',
            'point_placement',
            'graph_construction_substitute',
            'structured_reasoning'
        ]) {
            expect(html).toContain(`data-task-family="${family}"`);
        }
    });

    test('renders context blocks before the task list with captions and task references', () => {
        const html = TaskShellUI.renderStaticHtml(contextData());
        expect(html.indexOf('data-task-context')).toBeGreaterThan(-1);
        expect(html.indexOf('data-task-context')).toBeLessThan(html.indexOf('class="ts-task-list"'));
        for (const type of ['markdown', 'source_excerpt', 'table', 'svg_figure', 'graph', 'flowchart', 'formula', 'info_box']) {
            expect(html).toContain(`data-context-type="${type}"`);
        }
        expect(html).toContain('Bron 1 - Gegevens verzekeringen');
        expect(html).toContain('Tabel 1 - Premie en eigen risico');
        expect(html).toContain('Figuur 1 - Premieverschil per maand');
        expect(html).toContain('Figuur 2 - Jaarpremie per variant');
        expect(html).toContain('Figuur 3 - Denkroute van maand naar jaar');
        expect(html).toContain('Formule 1 - Jaarpremie');
        expect(html).toContain('Tabel met twee varianten');
        expect(html).toContain('role="img" aria-label="Staafdiagram');
        expect(html).toContain('class="ts-context-refs"');
        expect(html).toContain('Gebruik:');
        expect(html).toContain('href="#ts-context-block-1"');

        const visibleText = html.replace(/<[^>]+>/g, ' ');
        expect(visibleText).not.toContain('ctx-zorg-intro');
        expect(html).toContain('data-context-block="ctx-zorg-intro"');
    });

    test('renders one visible source identifier per context block', () => {
        const html = TaskShellUI.renderContextBlocks(contextBlocks());
        const visibleHtml = html.replace(/<caption class="ts-visually-hidden">[\s\S]*?<\/caption>/g, '');
        const sourceBlock = visibleHtml.match(/data-context-block="ctx-zorg-source"[\s\S]*?<\/section>/)[0];
        const tableBlock = visibleHtml.match(/data-context-block="ctx-zorg-table"[\s\S]*?<\/section>/)[0];

        expect((sourceBlock.match(/Bron 1/g) || []).length).toBe(1);
        expect((tableBlock.match(/Tabel 1/g) || []).length).toBe(1);
        expect(sourceBlock).toContain('Bron 1 - Gegevens verzekeringen');
        expect(tableBlock).toContain('Tabel 1 - Premie en eigen risico');
    });

    test('exports and escapes context rendering helpers', () => {
        expect(typeof TaskShellUI.renderContextBlocks).toBe('function');
        const html = TaskShellUI.renderContextBlocks([
            {
                id: 'ctx-unsafe-copy',
                type: 'markdown',
                title: 'Veilige tekst',
                bodyMarkdown: '<script>alert("x")</script>',
                accessibilitySummary: 'Samenvatting voor schermlezers.'
            }
        ]);
        expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
        expect(html).not.toContain('<script>alert');
    });

    test('renders keyboard-focusable controls and neutral feedback containers', () => {
        const html = TaskShellUI.renderStaticHtml(data());
        expect(html).toContain('inputmode="decimal"');
        expect(html).toContain('textarea');
        expect(html).toContain('data-choice-id="b"');
        expect(html).toContain('aria-pressed="false"');
        expect(html).toContain('data-point-axis="x"');
        expect(html).toContain('aria-live="polite"');
        expect(html).toContain('role="status"');
        expect(html).toContain('tabindex="-1"');
        expect(html).toContain('data-input-role="work"');
        expect(html).toContain('data-input-role="final-answer"');
        expect(html).toContain('data-input-role="unit-notation"');
        expect(html).toContain('class="ts-answer-grid"');
        expect(html).toContain('data-input-role="structured-field"');
        expect(html).toContain('data-field-id="indexpunten"');
        expect(html).toContain('class="ts-cloze"');
        expect(html).toContain('data-cloze-blank-id="basis"');
        expect(html).toContain('data-cloze-tile-id="vier-procent"');
        expect(html).toContain('class="ts-cloze-clear"');
        expect(html).toContain('role="group" aria-label="Tegelbank"');
        expect(html).toContain('data-task-family="cloze_text"');
        expect(html).toContain('class="ts-cloze-typed"');
        expect(html).toContain('data-cloze-text-blank-id="basis"');
        expect(html).toContain('data-cloze-text-label="Basis voor procentuele stijging"');
        expect(html).toContain('inputmode="decimal"');
        expect(html).toContain('aria-label="Basis voor procentuele stijging"');
        expect(html).toContain('data-task-family="multi_select"');
        expect(html).toContain('class="ts-multi-select"');
        expect(html).toContain('data-multi-option-id="alles-kan"');
        expect(html).toContain('role="group" aria-label="Uitspraken over schaarste"');
        expect(html).toContain('class="ts-sentence"');
        expect(html).toContain('data-sentence-token-id="vraag-stijgt"');
        expect(html).toContain('data-sentence-sequence');
        expect(html).toContain('role="group" aria-label="Fragmentbank"');
        expect(html).toContain('class="ts-formula"');
        expect(html).toContain('data-formula-token-id="delen-door-nieuw"');
        expect(html).toContain('data-formula-token-category="denominator"');
        expect(html).toContain('data-formula-sequence');
        expect(html).toContain('role="group" aria-label="Formuleblokken"');
        expect(html).toContain('class="ts-step-ordering"');
        expect(html).toContain('data-step-id="deel-door-nieuw"');
        expect(html).toContain('data-step-sequence');
        expect(html).toContain('role="group" aria-label="Stappenbank"');
        expect(html).toContain('aria-label="Gekozen volgorde"');
        expect(html).toContain('class="ts-source-values"');
        expect(html).toContain('data-source-value-id="prijs-btw"');
        expect(html).toContain('data-source-role-value-id="prijs-oud"');
        expect(html).toContain('role="group" aria-label="Bronwaarden"');
        expect(html).toContain('aria-label="Rol in berekening voor EUR 800"');
        expect(html).toContain('class="ts-source-chain"');
        expect(html).toContain('data-source-node-id="deel-door-nieuw"');
        expect(html).toContain('data-source-node-role="operation"');
        expect(html).toContain('data-source-chain-sequence');
        expect(html).toContain('role="group" aria-label="Bronketen onderdelen"');
        expect(html).toContain('aria-label="Opgebouwde bronketen"');
        expect(html).toContain('class="ts-label-placement"');
        expect(html).toContain('data-label-id="prijs"');
        expect(html).toContain('data-label-target-id="y-as"');
        expect(html).toContain('data-label-target-role="axis"');
        expect(html).toContain('data-label-placement-summary');
        expect(html).toContain('class="ts-label-target-region"');
        expect(html).toContain('class="ts-label-visual-axis ts-label-visual-axis-x"');
        expect(html).toContain('aria-label="Prijs: De prijs hoort op de verticale as."');
        expect(html).toContain('aria-label="Verticale as: Plaats hier het prijslabel."');
        expect(html).toContain('data-task-family="graph_construction_substitute"');
        expect(html).toContain('class="ts-graph-construction"');
        expect(html).toContain('data-graph-workspace');
        expect(html).toContain('class="ts-graph-grid-line"');
        expect(html).toContain('data-graph-axis="x"');
        expect(html).toContain('data-graph-point-index="0"');
        expect(html).toContain('data-graph-line-confirmation');
        expect(html).toContain('data-task-family="matching_pairs"');
        expect(html).toContain('class="ts-matching-pairs"');
        expect(html).toContain('data-match-left-id="schaarste"');
        expect(html).toContain('data-match-right-id="behoeften-middelen"');
        expect(html).toContain('data-match-pair-summary');
        expect(html).toContain('role="group" aria-label="Begrippen"');
        expect(html).toContain('role="group" aria-label="Betekenissen"');
        expect(html).toContain('aria-label="Schaarste: Begrip over beperkte middelen."');
        expect(html).toContain('aria-label="Behoeften zijn groter dan middelen: Betekenis van schaarste."');
        expect(html).toContain('data-task-family="two_tier_choice"');
        expect(html).toContain('class="ts-two-tier-choice"');
        expect(html).toContain('data-two-tier-answer-id="vier-indexpunten"');
        expect(html).toContain('data-two-tier-reason-id="verschil-in-punten"');
        expect(html).toContain('data-two-tier-summary');
        expect(html).toContain('role="group" aria-label="Kies het antwoord"');
        expect(html).toContain('role="group" aria-label="Kies de reden"');
        expect(html).toContain('De stijging is 4 indexpunten.');
        expect(html).toContain('Het verschil tussen 112 en 108 wordt in indexpunten genoemd.');
        expect(html).toContain('Indexpunten bereken je door indexgetallen af te trekken.');
        expect(html).toContain('112 min 108 is 4 indexpunten.');
        expect(html).toContain('data-task-family="assertion_reason"');
        expect(html).toContain('class="ts-assertion"');
        expect(html).toContain('class="ts-assertion-card"');
        expect(html).toContain('Als de prijs stijgt, daalt de gevraagde hoeveelheid.');
        expect(html).toContain('Bij een hogere prijs kopen consumenten meestal minder.');
        expect(html).toContain('role="group" aria-label="Kies de juiste relatie"');
        expect(html).toContain('data-assertion-option-id="both-correct-explains"');
        expect(html).toContain('data-assertion-summary');
        expect(html).toContain('aria-label="Feedback op je antwoord"');
    });

    test('allows label placement visuals to suppress the default graph line', () => {
        const fixture = data();
        const labelTask = fixture.tasks.find((item) => item.family === 'label_placement');
        labelTask.interaction.visual.showLine = false;
        labelTask.interaction.visual.showGrid = false;
        const html = TaskShellUI.renderStaticHtml(fixture);

        expect(html).toContain('class="ts-label-visual-axis ts-label-visual-axis-x"');
        expect(html).toContain('ts-label-target-region-clean');
        expect(html).not.toContain('ts-label-visual-line');
    });

    test('renders hints collapsed and feedback actions with stable affordance styling', () => {
        const html = TaskShellUI.renderStaticHtml(data());
        expect(html).toContain('<details class="ts-hints">');
        expect(html).toContain('<summary>Hint</summary>');
        expect(html).toContain('Denk aan nieuw min oud, gedeeld door oud.');
        expect(html).not.toContain('<details class="ts-hints" open>');

        const result = TaskShellEngine.evaluateTask(data().tasks[0], '9');
        const feedback = TaskShellUI.renderFeedback(result);
        expect(feedback).toContain('class="ts-feedback-actions"');
        expect(feedback).toContain('class="ts-feedback-action"');

        const multiResult = TaskShellEngine.evaluateTask(data().tasks[8], { values: ['behoeften', 'alles-kan'] });
        const multiFeedback = TaskShellUI.renderFeedback(multiResult);
        expect(multiFeedback).toContain('class="ts-selection-feedback"');
        expect(multiFeedback).toContain('Nog nodig');
        expect(multiFeedback).toContain('Je moet kiezen tussen alternatieven.');
        expect(multiFeedback).toContain('Niet nodig gekozen');
        expect(multiFeedback).toContain('Iedereen kan alles krijgen wat hij wil.');

        const orderResult = TaskShellEngine.evaluateTask(data().tasks[11], { order: ['verschil', 'keer-100', 'deel-door-nieuw'] });
        const orderFeedback = TaskShellUI.renderFeedback(orderResult);
        expect(orderFeedback).toContain('class="ts-order-feedback"');
        expect(orderFeedback).toContain('Eerste plek om te controleren');
        expect(orderFeedback).toContain('Deel door de oude waarde');
        expect(orderFeedback).toContain('Afleider gekozen');
        expect(orderFeedback).toContain('Deel door de nieuwe waarde');

        const sourceValueResult = TaskShellEngine.evaluateTask(data().tasks[12], {
            selections: [
                { valueId: 'prijs-oud', role: 'new' },
                { valueId: 'prijs-btw', role: 'new' }
            ]
        });
        const sourceValueFeedback = TaskShellUI.renderFeedback(sourceValueResult);
        expect(sourceValueFeedback).toContain('class="ts-source-value-feedback"');
        expect(sourceValueFeedback).toContain('Rol controleren');
        expect(sourceValueFeedback).toContain('verwacht oude waarde');
        expect(sourceValueFeedback).toContain('Niet nodig gekozen');
        expect(sourceValueFeedback).toContain('21%');

        const sourceChainResult = TaskShellEngine.evaluateTask(data().tasks[13], {
            chain: ['bron', 'waarden', 'deel-door-nieuw']
        });
        const sourceChainFeedback = TaskShellUI.renderFeedback(sourceChainResult);
        expect(sourceChainFeedback).toContain('class="ts-source-chain-feedback"');
        expect(sourceChainFeedback).toContain('Eerste onderdeel om te controleren');
        expect(sourceChainFeedback).toContain('(920 - 800) / 800 x 100%');
        expect(sourceChainFeedback).toContain('Ontbrekend type onderdeel');
        expect(sourceChainFeedback).toContain('antwoord');

        const labelResult = TaskShellEngine.evaluateTask(data().tasks[14], {
            placements: [
                { labelId: 'prijs', targetId: 'x-as' },
                { labelId: 'omzet', targetId: 'caption' }
            ]
        });
        const labelFeedback = TaskShellUI.renderFeedback(labelResult);
        expect(labelFeedback).toContain('class="ts-label-feedback"');
        expect(labelFeedback).toContain('Label controleren');
        expect(labelFeedback).toContain('verwacht Verticale as');
        expect(labelFeedback).toContain('Afleidend label gekozen');
        expect(labelFeedback).toContain('Afleidende plek gekozen');
        expect(labelFeedback).toContain('Omzet');

        const matchingResult = TaskShellEngine.evaluateTask(data().tasks[15], {
            pairs: [
                ['schaarste', 'beste-alternatief'],
                ['winst', 'opbrengst-kosten']
            ]
        });
        const matchingFeedback = TaskShellUI.renderFeedback(matchingResult);
        expect(matchingFeedback).toContain('class="ts-match-feedback"');
        expect(matchingFeedback).toContain('Koppel controleren');
        expect(matchingFeedback).toContain('verwacht Behoeften zijn groter dan middelen');
        expect(matchingFeedback).toContain('Afleider links gekozen');
        expect(matchingFeedback).toContain('Afleider rechts gekozen');
        expect(matchingFeedback).toContain('Winst');

        const twoTierResult = TaskShellEngine.evaluateTask(data().tasks[16], {
            answer: 'vier-procent',
            reason: 'verschil-in-punten'
        });
        const twoTierFeedback = TaskShellUI.renderFeedback(twoTierResult);
        expect(twoTierFeedback).toContain('class="ts-two-tier-feedback"');
        expect(twoTierFeedback).toContain('Antwoord');
        expect(twoTierFeedback).toContain('kijk dit na');
        expect(twoTierFeedback).toContain('Reden');
        expect(twoTierFeedback).toContain('past');
        expect(twoTierFeedback).toContain('Controleer of je reden het gekozen antwoord echt ondersteunt.');

        const assertionResult = TaskShellEngine.evaluateTask(data().tasks.find((task) => task.id === 'assertion-reason'), {
            value: 'both-correct-no-explain'
        });
        const assertionFeedback = TaskShellUI.renderFeedback(assertionResult);
        expect(assertionFeedback).toContain('class="ts-assertion-feedback"');
        expect(assertionFeedback).toContain('Gekozen relatie');
        expect(assertionFeedback).toContain('Verwachte relatie');
        expect(assertionFeedback).toContain('kijk dit na');
        expect(assertionFeedback).toContain('Controleer of de gekozen relatie klopt bij stelling en reden.');
    });

    test('can hide pre-attempt criteria while keeping the same task contract', () => {
        const hiddenCriteria = data().tasks[1];
        hiddenCriteria.interaction.showCriteriaBeforeCheck = false;
        const html = TaskShellUI.renderTask(hiddenCriteria, 0);
        expect(html).not.toContain('class="ts-criteria"');
        expect(html).not.toContain('Formule zichtbaar');
        expect(TaskShellEngine.validateTask(data().tasks[1])).toBe(true);
    });

    test('renders Dutch student-facing family labels', () => {
        const html = TaskShellUI.renderStaticHtml(data());
        expect(html).toContain('Rekenantwoord');
        expect(html).toContain('Berekening tonen');
        expect(html).toContain('Kort antwoord in stappen');
        expect(html).toContain('Invultekst');
        expect(html).toContain('Meerdere keuzes');
        expect(html).toContain('Invullen met tegels');
        expect(html).toContain('Zin bouwen');
        expect(html).toContain('Formule bouwen');
        expect(html).toContain('Stappen ordenen');
        expect(html).toContain('Koppels maken');
        expect(html).toContain('Antwoord en reden kiezen');
        expect(html).toContain('Stelling en reden beoordelen');
        expect(html).toContain('Bronwaarden kiezen');
        expect(html).toContain('Bronketen bouwen');
        expect(html).toContain('Labels plaatsen');
        expect(html).toContain('Grafiek construeren');
        expect(html).not.toContain('Numeric input');
        expect(html).not.toContain('Graph-construction substitute');
    });

    test('does not render internal codes or restricted product-boundary words', () => {
        const html = TaskShellUI.renderStaticHtml(data());
        expect(html).not.toMatch(/\b(?:A\d{2}|B\d{2}|PV|MTU)\b/);
        for (const term of TaskShellEngine.BLOCKED_STUDENT_TERMS) {
            expect(html.toLowerCase()).not.toContain(term.toLowerCase());
        }
    });

    test('renders self-check feedback with criteria and practice route', () => {
        const result = TaskShellEngine.evaluateTask(data().tasks[1], { work: 'berekening', finalAnswer: '10%' });
        const html = TaskShellUI.renderFeedback(result);
        expect(html).toContain('is-self_check');
        expect(html).toContain('data-feedback-state="self_check"');
        expect(html).toContain('Formule zichtbaar');
        expect(html).toContain('Oefen deze stap verder');
    });

    test('exports cloze tile helpers for consuming wrappers', () => {
        expect(typeof TaskShellUI.collectClozeTileResponse).toBe('function');
        expect(typeof TaskShellUI.handleClozeTileClick).toBe('function');
        expect(typeof TaskShellUI.collectCalculationResponse).toBe('function');
        expect(TaskShellEngine.focusPlan(data().tasks[6])).toEqual([
            '[data-task-id="cloze-tiles"][data-cloze-tile-id]',
            '[data-task-id="cloze-tiles"][data-cloze-blank-id]'
        ]);
    });

    test('renders and collects interval-first graph reading controls', () => {
        const graphReading = task('interpolatie-225', 'graph_reading', {
            inputLabel: '2. Afgelezen hoeveelheid Q',
            inputPlaceholder: 'vul hoeveelheid in',
            stepOrder: ['interval_selection', 'read_q_value'],
            intervalLabel: '1. Gebruikt interval',
            intervalOptions: [
                { id: '150-200', label: 'EUR 1,50 naar EUR 2,00', correct: false },
                { id: '200-250', label: 'EUR 2,00 naar EUR 2,50', correct: true },
                { id: '250-300', label: 'EUR 2,50 naar EUR 3,00', correct: false }
            ]
        }, {
            kind: 'number',
            value: 225,
            tolerance: 10,
            interval: { kind: 'choice', value: '200-250' }
        });
        const html = TaskShellUI.renderTask(graphReading, 0, {});
        expect(html.indexOf('data-graph-reading-interval-option-id="200-250"')).toBeLessThan(html.indexOf('data-input-role="answer"'));
        expect(html).toContain('placeholder="vul hoeveelheid in"');
        expect(typeof TaskShellUI.collectGraphReadingResponse).toBe('function');
        expect(TaskShellEngine.focusPlan(graphReading)).toEqual([
            '[data-task-id="interpolatie-225"][data-graph-reading-interval-option-id]',
            '[data-task-id="interpolatie-225"][data-input-role="answer"]'
        ]);

        const root = {
            querySelector: (selector) => {
                if (selector.includes('data-input-role="answer"')) return { value: '225' };
                if (selector.includes('data-graph-reading-interval-option-id') && selector.includes(':checked')) {
                    return { getAttribute: () => '200-250' };
                }
                return null;
            }
        };
        expect(TaskShellUI.collectGraphReadingResponse(root, graphReading)).toEqual({
            interval: '200-250',
            value: '225'
        });
    });

    test('exports graph-construction helpers for consuming wrappers', () => {
        expect(typeof TaskShellUI.collectGraphConstructionResponse).toBe('function');
        expect(typeof TaskShellUI.handleGraphConstructionClick).toBe('function');
        expect(typeof TaskShellUI.handleGraphConstructionChange).toBe('function');
        const graphTask = data().tasks.find((task) => task.id === 'construct');
        expect(TaskShellEngine.focusPlan(graphTask)).toEqual([
            '[data-task-id="construct"][data-graph-axis="x"]',
            '[data-task-id="construct"][data-graph-axis="y"]',
            '[data-task-id="construct"][data-graph-point-index]',
            '[data-task-id="construct"][data-graph-line-confirmation]'
        ]);
        const snapHtml = TaskShellUI.renderTask({
            ...graphTask,
            interaction: {
                ...graphTask.interaction,
                pointSnapMode: 'magnetic_table_point',
                pointSnapTolerancePx: 72
            },
            expected: {
                ...graphTask.expected,
                acceptedTablePoints: [
                    { x: 0, y: 4 },
                    { x: 10, y: 3 },
                    { x: 20, y: 2 }
                ],
                minimumPointCount: 2,
                pointPolicy: 'straight_line_two_distinct_table_points'
            }
        }, 0, {});
        expect(snapHtml).toContain('data-point-snap-mode="magnetic_table_point"');
        expect(snapHtml).toContain('data-point-snap-tolerance-px="72"');
        expect(snapHtml).toContain('data-accepted-table-points=');
    });

    test('renders delayed graph axis guides as neutral until the student chooses axes', () => {
        const graphTask = {
            ...data().tasks.find((task) => task.id === 'construct'),
            interaction: {
                ...data().tasks.find((task) => task.id === 'construct').interaction,
                hideAxisLabelsUntilAxisSelection: true,
                axes: {
                    x: { label: 'Hoeveelheid Q', min: 0, max: 20, ticks: [0, 10, 20] },
                    y: { label: 'Prijs P', min: 0, max: 4, ticks: [0, 2, 4] }
                }
            }
        };
        const html = TaskShellUI.renderStaticHtml({
            schema_version: 1,
            title: 'Graph delayed guides',
            tasks: [graphTask]
        });

        expect(html).toContain('ts-graph-hide-axis-guides');
        expect(html).toContain('data-hide-axis-guides-until-selection="true"');
        expect(html).toContain('data-graph-tick-layer');
        expect(html).toContain('data-graph-axis-label="x">Kies horizontale as</div>');
        expect(html).toContain('data-graph-axis-label="y">Kies verticale as</div>');
        expect(html).not.toContain('data-graph-axis-label="x">Hoeveelheid Q</div>');
        expect(html).not.toContain('data-graph-axis-label="y">Prijs P</div>');
    });

    test('exports cloze text helpers for consuming wrappers', () => {
        expect(typeof TaskShellUI.collectClozeTextResponse).toBe('function');
        expect(TaskShellEngine.focusPlan(data().tasks[7])).toEqual([
            '[data-task-id="cloze-text"][data-cloze-text-blank-id]'
        ]);
    });

    test('exports multi-select helpers for consuming wrappers', () => {
        expect(typeof TaskShellUI.collectMultiSelectResponse).toBe('function');
        expect(typeof TaskShellUI.handleMultiSelectClick).toBe('function');
        expect(TaskShellEngine.focusPlan(data().tasks[8])).toEqual([
            '[data-task-id="multi-select"][data-multi-option-id]'
        ]);
    });

    test('exports sentence builder helpers for consuming wrappers', () => {
        expect(typeof TaskShellUI.collectSentenceBuilderResponse).toBe('function');
        expect(typeof TaskShellUI.handleSentenceBuilderClick).toBe('function');
        expect(TaskShellEngine.focusPlan(data().tasks[9])).toEqual([
            '[data-task-id="sentence-builder"][data-sentence-token-id]',
            '[data-task-id="sentence-builder"][data-sentence-sequence]'
        ]);
    });

    test('exports formula builder helpers for consuming wrappers', () => {
        expect(typeof TaskShellUI.collectFormulaBuilderResponse).toBe('function');
        expect(typeof TaskShellUI.handleFormulaBuilderClick).toBe('function');
        expect(TaskShellEngine.focusPlan(data().tasks[10])).toEqual([
            '[data-task-id="formula-builder"][data-formula-token-id]',
            '[data-task-id="formula-builder"][data-formula-sequence]'
        ]);
    });

    test('renders and collects calculation answer-form controls', () => {
        const answerFormTask = {
            ...A96ProofData.strictA96Task,
            id: 'answer-form-ui',
            contextRefs: undefined
        };
        const html = TaskShellUI.renderTask(answerFormTask, 0, {});
        expect(html).toContain('data-task-family="calculation_answer_form_capture"');
        expect(html).toContain('data-answer-form-task="answer-form-ui"');
        expect(html).toContain('data-answer-form-step="formula"');
        expect(html).toContain('data-answer-form-step="substitution"');
        expect(html).toContain('data-field-id="oldPriceDenominator"');
        expect(html).toContain('data-formula-max-uses="2"');
        expect(html).toContain('data-input-role="conclusion"');
        expect(html).not.toContain('data-input-role="work"');
        expect(typeof TaskShellUI.collectCalculationAnswerFormResponse).toBe('function');

        const selectedTokens = A96ProofData.passingResponse.methodTokens.map((tokenId) => ({
            getAttribute: (name) => (name === 'data-formula-selected-token-id' ? tokenId : '')
        }));
        const substitutionFields = Object.entries(A96ProofData.passingResponse.substitution).map(([fieldId, value]) => ({
            value,
            getAttribute: (name) => (name === 'data-field-id' ? fieldId : '')
        }));
        const root = {
            querySelectorAll: (selector) => {
                if (selector.includes('data-formula-selected-token-id')) return selectedTokens;
                if (selector.includes('data-input-role="substitution"')) return substitutionFields;
                return [];
            },
            querySelector: (selector) => {
                if (selector.includes('data-input-role="final-answer"')) return { value: A96ProofData.passingResponse.finalAnswer };
                if (selector.includes('data-input-role="unit-notation"')) return { value: A96ProofData.passingResponse.notation };
                if (selector.includes('data-input-role="conclusion"')) return { value: A96ProofData.passingResponse.conclusion };
                return null;
            }
        };

        expect(TaskShellUI.collectCalculationAnswerFormResponse(root, answerFormTask)).toEqual(A96ProofData.passingResponse);

        const feedback = TaskShellUI.renderFeedback(TaskShellEngine.evaluateTask(
            answerFormTask,
            A96ProofData.negativeResponses.wrongDenominator
        ));
        expect(feedback).toContain('class="ts-answer-form-feedback"');
        expect(feedback).toContain('Bronwaarden in de formule');
    });

    test('exports step ordering helpers for consuming wrappers', () => {
        expect(typeof TaskShellUI.collectStepOrderingResponse).toBe('function');
        expect(typeof TaskShellUI.handleStepOrderingClick).toBe('function');
        expect(TaskShellEngine.focusPlan(data().tasks[11])).toEqual([
            '[data-task-id="step-ordering"][data-step-id]',
            '[data-task-id="step-ordering"][data-step-sequence]'
        ]);
    });

    test('exports source value helpers for consuming wrappers', () => {
        expect(typeof TaskShellUI.collectSourceValueSelectionResponse).toBe('function');
        expect(typeof TaskShellUI.handleSourceValueSelectionClick).toBe('function');
        expect(TaskShellEngine.focusPlan(data().tasks[12])).toEqual([
            '[data-task-id="source-values"][data-source-value-id]',
            '[data-task-id="source-values"][data-source-role-value-id]'
        ]);
    });

    test('exports source chain helpers for consuming wrappers', () => {
        expect(typeof TaskShellUI.collectSourceChainBuilderResponse).toBe('function');
        expect(typeof TaskShellUI.handleSourceChainBuilderClick).toBe('function');
        expect(TaskShellEngine.focusPlan(data().tasks[13])).toEqual([
            '[data-task-id="source-chain"][data-source-node-id]',
            '[data-task-id="source-chain"][data-source-chain-sequence]'
        ]);
    });

    test('exports label placement helpers for consuming wrappers', () => {
        expect(typeof TaskShellUI.collectLabelPlacementResponse).toBe('function');
        expect(typeof TaskShellUI.handleLabelPlacementClick).toBe('function');
        expect(TaskShellEngine.focusPlan(data().tasks[14])).toEqual([
            '[data-task-id="label-placement"][data-label-id]',
            '[data-task-id="label-placement"][data-label-target-id]',
            '[data-task-id="label-placement"][data-label-placement-summary]'
        ]);
    });

    test('exports matching pair helpers for consuming wrappers', () => {
        expect(typeof TaskShellUI.collectMatchingPairsResponse).toBe('function');
        expect(typeof TaskShellUI.handleMatchingPairsClick).toBe('function');
        expect(TaskShellEngine.focusPlan(data().tasks[15])).toEqual([
            '[data-task-id="matching-pairs"][data-match-left-id]',
            '[data-task-id="matching-pairs"][data-match-right-id]',
            '[data-task-id="matching-pairs"][data-match-pair-summary]'
        ]);
    });

    test('exports two-tier choice helpers for consuming wrappers', () => {
        expect(typeof TaskShellUI.collectTwoTierChoiceResponse).toBe('function');
        expect(typeof TaskShellUI.handleTwoTierChoiceClick).toBe('function');
        expect(TaskShellEngine.focusPlan(data().tasks[16])).toEqual([
            '[data-task-id="two-tier-choice"][data-two-tier-answer-id]',
            '[data-task-id="two-tier-choice"][data-two-tier-reason-id]',
            '[data-task-id="two-tier-choice"][data-two-tier-summary]'
        ]);
    });

    test('exports assertion-reason helpers for consuming wrappers', () => {
        const assertion = data().tasks.find((task) => task.id === 'assertion-reason');
        expect(typeof TaskShellUI.collectAssertionReasonResponse).toBe('function');
        expect(typeof TaskShellUI.handleAssertionReasonClick).toBe('function');
        expect(TaskShellEngine.focusPlan(assertion)).toEqual([
            '[data-task-id="assertion-reason"][data-assertion-option-id]',
            '[data-task-id="assertion-reason"][data-assertion-summary]'
        ]);
    });

    test('renders and exports functional answer builder controls', () => {
        const answerTask = task('functional-answer', 'functional_answer_builder', {
            rowGroupLabel: 'Antwoordregels',
            answerPreview: {
                label: 'Opgebouwd antwoord',
                placeholder: 'Kies per regel een onderdeel.',
                template: '{{oorzaak}} {{conclusie}}'
            },
            answerRows: [
                {
                    id: 'oorzaak',
                    label: 'Oorzaak',
                    options: [
                        { id: 'schaarste', label: 'Er is schaarste.', kind: 'answer' },
                        { id: 'winst', label: 'Er is winst.', kind: 'distractor', distractorFor: 'schaarste' }
                    ]
                },
                {
                    id: 'conclusie',
                    label: 'Conclusie',
                    options: [
                        { id: 'kosten', label: 'De kosten zijn het beste alternatief.', kind: 'answer' },
                        { id: 'som', label: 'De kosten zijn alle alternatieven samen.', kind: 'distractor', distractorFor: 'kosten' }
                    ]
                }
            ]
        }, {
            kind: 'functional_answer_builder',
            rows: { oorzaak: 'schaarste', conclusie: 'kosten' },
            partialFeedback: 'practice_only'
        });

        const html = TaskShellUI.renderTask(answerTask, 0, {});
        expect(html).toContain('data-task-family="functional_answer_builder"');
        expect(html).toContain('data-functional-answer-task="functional-answer"');
        expect(html).toContain('data-answer-row-id="oorzaak"');
        expect(html).toContain('data-answer-preview');
        expect(typeof TaskShellUI.collectFunctionalAnswerResponse).toBe('function');
        expect(typeof TaskShellUI.handleFunctionalAnswerClick).toBe('function');
        expect(TaskShellEngine.focusPlan(answerTask)).toEqual([
            '[data-task-id="functional-answer"][data-answer-row-id]',
            '[data-task-id="functional-answer"][data-answer-preview]'
        ]);

        const root = {
            querySelectorAll: () => [
                { getAttribute: (name) => name === 'data-answer-row-id' ? 'oorzaak' : 'schaarste' },
                { getAttribute: (name) => name === 'data-answer-row-id' ? 'conclusie' : 'kosten' }
            ]
        };
        expect(TaskShellUI.collectFunctionalAnswerResponse(root, answerTask)).toEqual({
            rows: { oorzaak: 'schaarste', conclusie: 'kosten' }
        });
    });

    test('renders and exports direct graph evidence controls', () => {
        const graphTask = task('graph-evidence', 'graph_evidence_selector', {
            maxSelections: 2,
            hitTargetPx: 44,
            trayLabel: 'Gekozen punten',
            graph: {
                title: 'Vraaglijn',
                altText: 'Grafiek met twee tabelpunten en een afleider.',
                axes: {
                    x: { label: 'Prijs P', min: 0, max: 10, ticks: [0, 5, 10] },
                    y: { label: 'Hoeveelheid Q', min: 0, max: 700, ticks: [0, 300, 600] }
                },
                series: [
                    {
                        label: 'Vraag',
                        points: [
                            { id: 'laag', x: 2, y: 600, label: 'P=2, Q=600', kind: 'answer' },
                            { id: 'hoog', x: 8, y: 300, label: 'P=8, Q=300', kind: 'answer' },
                            { id: 'midden', x: 5, y: 450, label: 'P=5, Q=450', kind: 'distractor', distractorFor: 'laag' }
                        ]
                    }
                ]
            }
        }, {
            kind: 'graph_evidence_selector',
            pointIds: ['laag', 'hoog'],
            partialFeedback: 'practice_only'
        });

        const html = TaskShellUI.renderTask(graphTask, 0, {});
        expect(html).toContain('data-task-family="graph_evidence_selector"');
        expect(html).toContain('data-graph-evidence-task="graph-evidence"');
        expect(html).toContain('data-graph-evidence-point-id="laag"');
        expect(html).toContain('width:44px;height:44px');
        expect(html).toContain('data-graph-evidence-tray');
        expect(typeof TaskShellUI.collectGraphEvidenceResponse).toBe('function');
        expect(typeof TaskShellUI.handleGraphEvidenceClick).toBe('function');
        expect(TaskShellEngine.focusPlan(graphTask)).toEqual([
            '[data-task-id="graph-evidence"][data-graph-evidence-point-id]',
            '[data-task-id="graph-evidence"][data-graph-evidence-tray]'
        ]);

        const root = {
            querySelectorAll: () => [
                { getAttribute: () => 'hoog' },
                { getAttribute: () => 'laag' }
            ]
        };
        expect(TaskShellUI.collectGraphEvidenceResponse(root, graphTask)).toEqual({
            pointIds: ['hoog', 'laag']
        });
    });

    test('escapes task text before rendering', () => {
        const unsafe = data();
        unsafe.tasks[0].prompt = '<script>alert("x")</script>';
        const html = TaskShellUI.renderStaticHtml(unsafe);
        expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
        expect(html).not.toContain('<script>alert');
    });
});
