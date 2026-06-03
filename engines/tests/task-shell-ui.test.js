const TaskShellUI = require('../task-shell-ui');
const TaskShellEngine = require('../task-shell-engine');

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
            task('construct', 'graph_construction_substitute', { inputLabel: 'Grafiekstappen' }, { kind: 'self_check', criteria: ['Punten genoemd', 'Lijn beschreven'] }),
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
            })
        ]
    };
}

function contextData() {
    return {
        schema_version: 1,
        title: 'Bronnen gebruiken in de taakschil',
        intro: 'Lees eerst de bron en werk daarna de taken af.',
        contextBlocks: [
            {
                id: 'bron-water',
                type: 'markdown',
                label: 'Bron 1',
                title: 'Keuze bij watertekort',
                sourceRef: 'Reconstructed local source, 2026',
                body: 'Een gemeente heeft in een droge zomer niet genoeg water om alle wensen tegelijk uit te voeren.\n\nDe raad moet kiezen tussen sportvelden sproeien en de drinkwaterbuffer aanvullen.'
            },
            {
                id: 'tabel-watergebruik',
                type: 'table',
                label: 'Tabel 1',
                title: 'Watergebruik per activiteit',
                sourceRef: 'Reconstructed local source, 2026',
                columns: ['Activiteit', 'Water per dag'],
                rows: [
                    ['Sportvelden sproeien', '120.000 liter'],
                    ['Drinkwaterbuffer aanvullen', '180.000 liter']
                ],
                caption: 'De tabel toont twee concurrerende gebruiken.'
            },
            {
                id: 'figuur-vraag',
                type: 'graph',
                label: 'Figuur 1',
                title: 'Vraag naar drinkwater',
                sourceRef: 'Reconstructed local source, 2026',
                altText: 'Een dalende vraaglijn in een prijs-hoeveelheidgrafiek.',
                svg: '<svg viewBox="0 0 240 140" role="img" aria-label="Dalende vraaglijn"><rect width="240" height="140" fill="white"/><line x1="34" y1="112" x2="210" y2="112" stroke="#152033"/><line x1="34" y1="112" x2="34" y2="18" stroke="#152033"/><path d="M48 35 L200 105" stroke="#176c67" stroke-width="4" fill="none"/><text x="190" y="130" font-size="12">Q</text><text x="12" y="24" font-size="12">P</text></svg>',
                caption: 'Gereconstrueerde grafiek in de gedeelde stijl.'
            },
            {
                id: 'formule-procent',
                type: 'formula',
                label: 'Formule 1',
                title: 'Procentuele verandering',
                sourceRef: 'Reconstructed local source, 2026',
                formula: '(nieuw - oud) / oud x 100%'
            }
        ],
        tasks: [
            task('context-values', 'source_value_selection', {
                valueBankLabel: 'Bronwaarden',
                roleLabel: 'Rol',
                values: [
                    { id: 'sportvelden', label: 'Sportvelden sproeien', kind: 'answer', sourceLabel: 'activiteit' },
                    { id: 'buffer', label: 'Drinkwaterbuffer aanvullen', kind: 'answer', sourceLabel: 'activiteit' },
                    { id: 'zwembad', label: 'Nieuw zwembad vullen', kind: 'distractor', distractorFor: 'buffer' }
                ],
                roles: [
                    { id: 'choice-a', label: 'keuze A' },
                    { id: 'choice-b', label: 'keuze B' }
                ]
            }, {
                kind: 'source_value_selection',
                selections: [
                    { valueId: 'sportvelden', role: 'choice-a' },
                    { valueId: 'buffer', role: 'choice-b' }
                ],
                partialFeedback: 'practice_only'
            }),
            task('context-formula', 'formula_builder', {
                tokens: [
                    { id: 'nieuw-min-oud', label: 'nieuw - oud', kind: 'answer', category: 'numerator' },
                    { id: 'delen-door-oud', label: '/ oud', kind: 'answer', category: 'denominator' },
                    { id: 'keer-100', label: 'x 100%', kind: 'answer', category: 'multiplier' },
                    { id: 'delen-door-nieuw', label: '/ nieuw', kind: 'distractor', category: 'denominator', distractorFor: 'delen-door-oud' }
                ],
                separator: ' ',
                placeholder: 'Bouw de formule.',
                tokenBankLabel: 'Formuleblokken',
                sequenceLabel: 'Opgebouwde formule'
            }, {
                kind: 'formula_builder',
                tokens: ['nieuw-min-oud', 'delen-door-oud', 'keer-100'],
                acceptedSequences: [['nieuw-min-oud', 'delen-door-oud', 'keer-100']]
            })
        ].map((item) => ({
            ...item,
            contextRefs: item.id === 'context-values'
                ? ['bron-water', 'tabel-watergebruik']
                : ['figuur-vraag', 'formule-procent']
        }))
    };
}

describe('TaskShellUI', () => {
    test('renders all accepted task families with stable task markers', () => {
        const html = TaskShellUI.renderStaticHtml(data());
        for (const family of [
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

    test('renders context blocks before cited tasks', () => {
        const html = TaskShellUI.renderStaticHtml(contextData());
        expect(html).toContain('class="ts-context"');
        expect(html).toContain('data-context-block-id="bron-water"');
        expect(html).toContain('data-context-type="table"');
        expect(html).toContain('<table class="ts-context-table">');
        expect(html).toContain('Watergebruik per activiteit');
        expect(html).toContain('role="group" aria-label="Een dalende vraaglijn in een prijs-hoeveelheidgrafiek."');
        expect(html).toContain('class="ts-context-formula"');
        expect(html).toContain('(nieuw - oud) / oud x 100%');
        expect(html).toContain('<span class="ts-context-ref">Bron 1</span>');
        expect(html).toContain('<span class="ts-context-ref">Tabel 1</span>');
        expect(html).toContain('<span class="ts-context-ref">Figuur 1</span>');
        expect(html.indexOf('class="ts-context"')).toBeLessThan(html.indexOf('class="ts-task-list"'));
        expect(html).not.toContain('>bron-water<');
        expect(html).not.toContain('>figuur-vraag<');
    });

    test('uses engine validation for unsafe context before rendering', () => {
        const fixture = contextData();
        fixture.contextBlocks[0].body = '![kopie](source.png)';
        expect(() => TaskShellUI.renderStaticHtml(fixture)).toThrow(/raw images/);
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
        expect(html).toContain('Grafiekstappen');
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
        expect(TaskShellEngine.focusPlan(data().tasks[6])).toEqual([
            '[data-task-id="cloze-tiles"][data-cloze-tile-id]',
            '[data-task-id="cloze-tiles"][data-cloze-blank-id]'
        ]);
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

    test('escapes task text before rendering', () => {
        const unsafe = data();
        unsafe.tasks[0].prompt = '<script>alert("x")</script>';
        const html = TaskShellUI.renderStaticHtml(unsafe);
        expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
        expect(html).not.toContain('<script>alert');
    });
});
