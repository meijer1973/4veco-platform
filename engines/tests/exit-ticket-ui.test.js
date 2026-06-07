const fs = require('fs');
const path = require('path');
const ExitTicketUI = require('../exit-ticket-ui');
const ExitTicketEngine = require('../exit-ticket-engine');
const data = require('../../source-data/book-1/exit-ticket/1.1.1-korte-check.json');
const targetData = require('../../source-data/book-1/exit-ticket/1.1.2-exit-ticket.json');
const exit113Data = require('../../source-data/book-1/exit-ticket/1.1.3-exit-ticket.json');
const exitTicketShells = require('../../build-scripts/platform/build-exit-ticket-shells');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');

function visibleHtml() {
    const engine = new ExitTicketEngine({ data });
    const view = ExitTicketUI.buildSkillView(data, engine, {});
    return ExitTicketUI.renderStaticHtml(data, view);
}

function targetVisibleHtml() {
    const engine = new ExitTicketEngine({ data: targetData });
    const view = ExitTicketUI.buildSkillView(targetData, engine, {});
    return ExitTicketUI.renderStaticHtml(targetData, view);
}

function graphTaskShellData() {
    return {
        schema_version: 1,
        parNr: '1.1.3',
        parName: 'Grafieken en tabellen',
        title: 'Grafiektaak oefenvorm',
        intro: 'Gebruik dezelfde taakvormen als het grafiekenspel.',
        targetSkillIds: ['A61', 'A62', 'A63'],
        skillScopeIds: ['A61', 'A62', 'A63'],
        metadataAlignment: {
            status: 'paragraph_skill_aligned_not_target_readiness',
            paragraphSkillIds: ['A61', 'A62', 'A63'],
            targetExerciseSkillIds: ['A61', 'A62', 'A63', 'A38'],
            targetReadinessEvidence: false
        },
        tasks: [
            {
                id: 'table-task',
                type: 'task_shell',
                taskShell: {
                    id: 'table-task',
                    family: 'table_value_selection',
                    skillLabel: 'Tabelwaarde kiezen',
                    purpose: 'Kies de bronwaarde uit de juiste rij.',
                    prompt: 'Welke waarde hoort bij prijs EUR 2,00?',
                    interaction: {
                        inputLabel: 'Tabelwaarde',
                        options: [{ id: 'a', label: '300 ijsjes' }, { id: 'b', label: '400 ijsjes' }]
                    },
                    expected: { kind: 'choice', value: 'a' },
                    feedback: {
                        matchTitle: 'Juiste bronwaarde',
                        matchText: 'Je koos de waarde uit de juiste rij.',
                        retryTitle: 'Zoek de rij opnieuw',
                        retryText: 'Lees prijs en waarde in dezelfde rij.'
                    },
                    practiceRoute: { label: 'Oefen verder met grafieken', href: 'grafiekenspel.html' }
                }
            },
            {
                id: 'read-task',
                type: 'task_shell',
                taskShell: {
                    id: 'read-task',
                    family: 'graph_reading',
                    skillLabel: 'Grafiek aflezen',
                    purpose: 'Lees de grafiekwaarde met eenheid.',
                    prompt: 'Lees de waarde bij juni af.',
                    interaction: { inputLabel: 'Afgelezen waarde' },
                    expected: { kind: 'number', value: 70 },
                    feedback: {
                        matchTitle: 'Goed afgelezen',
                        matchText: 'Het punt bij juni staat op 70.',
                        retryTitle: 'Lees opnieuw',
                        retryText: 'Zoek juni en lees de verticale waarde.'
                    },
                    practiceRoute: { label: 'Oefen verder met grafieken', href: 'grafiekenspel.html' }
                }
            },
            {
                id: 'point-task',
                type: 'task_shell',
                taskShell: {
                    id: 'point-task',
                    family: 'point_placement',
                    skillLabel: 'Punt plaatsen',
                    purpose: 'Gebruik prijs als x-waarde en aantal als y-waarde.',
                    prompt: 'Welk punt hoort bij prijs 10 en aantal 100?',
                    interaction: { xLabel: 'prijs', yLabel: 'aantal' },
                    expected: { kind: 'point', x: 10, y: 100 },
                    feedback: {
                        matchTitle: 'Punt klopt',
                        matchText: 'Het punt is (10, 100).',
                        retryTitle: 'Controleer de asvolgorde',
                        retryText: 'Prijs is x en aantal is y.'
                    },
                    practiceRoute: { label: 'Oefen verder met grafieken', href: 'grafiekenspel.html' }
                }
            },
            {
                id: 'construct-task',
                type: 'task_shell',
                taskShell: {
                    id: 'construct-task',
                    family: 'graph_construction_substitute',
                    skillLabel: 'Grafiek tekenen',
                    purpose: 'Kies assen, plaats twee punten en trek de lijn.',
                    prompt: 'Teken een P-Q-grafiek bij de tabel.',
                    interaction: {
                        workspaceTitle: 'Tekenruimte',
                        xAxisLabel: 'Horizontale as',
                        yAxisLabel: 'Verticale as',
                        pointRowsLabel: 'Punten uit de tabel',
                        lineConfirmationLabel: 'Trek lijn door punten',
                        lineShapeLabel: 'Lijnvorm',
                        xInputLabel: 'Q',
                        yInputLabel: 'P',
                        emptyGraphAltText: 'Lege P-Q-grafiek met raster',
                        axes: {
                            x: { label: 'Q', min: 0, max: 600, ticks: [0, 100, 200, 300, 400, 500, 600] },
                            y: { label: 'P', min: 0, max: 3, ticks: [0, 1, 1.5, 2, 2.5, 3], tickDecimals: 2, tickFormat: 'decimal_comma' }
                        },
                        axisOptions: [
                            { id: 'prijs', label: 'Prijs P', value: 'P' },
                            { id: 'hoeveelheid', label: 'Hoeveelheid Q', value: 'Q' },
                            { id: 'omzet', label: 'Omzet', value: 'omzet' },
                            { id: 'tijd', label: 'Tijd', value: 'tijd' }
                        ],
                        pointCount: 2
                    },
                    expected: {
                        kind: 'graph_construction_substitute',
                        axes: {
                            xAccepted: ['q', 'hoeveelheid q'],
                            yAccepted: ['p', 'prijs p']
                        },
                        points: [
                            { x: 500, y: 1.5 },
                            { x: 300, y: 2 }
                        ],
                        toleranceX: 0,
                        toleranceY: 0,
                        lineShape: 'decreasing'
                    },
                    feedback: {
                        matchTitle: 'Grafiek klopt',
                        matchText: 'De assen, punten en dalende lijn passen bij de tabel.',
                        retryTitle: 'Controleer assen en punten',
                        retryText: 'Kies Q horizontaal, P verticaal en plaats twee tabelpunten.'
                    },
                    practiceRoute: { label: 'Oefen verder met grafieken', href: 'grafiekenspel.html' }
                }
            },
            {
                id: 'cloze-task',
                type: 'task_shell',
                taskShell: {
                    id: 'cloze-task',
                    family: 'cloze_tile_select',
                    skillLabel: 'Conclusie aanvullen',
                    purpose: 'Vul de bronconclusie aan met passende tegels.',
                    prompt: 'Maak de conclusie af.',
                    interaction: {
                        segments: [
                            { type: 'text', text: 'Bij prijs 2 hoort ' },
                            { type: 'blank', blankId: 'waarde' },
                            { type: 'text', text: ', dus de grafiek daalt als de prijs ' },
                            { type: 'blank', blankId: 'richting' },
                            { type: 'text', text: '.' }
                        ],
                        blanks: [
                            { id: 'waarde', label: 'Bronwaarde' },
                            { id: 'richting', label: 'Prijsrichting' }
                        ],
                        tiles: [
                            { id: 'driehonderd', label: '300 ijsjes', kind: 'answer' },
                            { id: 'stijgt', label: 'stijgt', kind: 'answer' },
                            { id: 'vierhonderd', label: '400 ijsjes', kind: 'distractor', distractorFor: 'waarde' }
                        ]
                    },
                    expected: {
                        kind: 'cloze_tile_select',
                        blanks: {
                            waarde: 'driehonderd',
                            richting: 'stijgt'
                        }
                    },
                    feedback: {
                        matchTitle: 'Conclusie past',
                        matchText: 'Je koppelt de bronwaarde aan de richting.',
                        retryTitle: 'Controleer de bron',
                        retryText: 'Lees de juiste waarde en richting opnieuw.'
                    },
                    practiceRoute: { label: 'Oefen verder met grafieken', href: 'grafiekenspel.html' }
                }
            },
            {
                id: 'sentence-task',
                type: 'task_shell',
                taskShell: {
                    id: 'sentence-task',
                    family: 'sentence_builder',
                    skillLabel: 'Conclusie bouwen',
                    purpose: 'Bouw de bronredenering in volgorde.',
                    prompt: 'Maak de economische redenering.',
                    interaction: {
                        tokens: [
                            { id: 'prijs-stijgt', label: 'De prijs stijgt', kind: 'answer' },
                            { id: 'vraag-daalt', label: 'de gevraagde hoeveelheid daalt', kind: 'answer' },
                            { id: 'bronwaarde', label: 'volgens de bronwaarde', kind: 'answer' },
                            { id: 'vraag-stijgt', label: 'de gevraagde hoeveelheid stijgt', kind: 'distractor', distractorFor: 'vraag-daalt' }
                        ],
                        separator: ' -> '
                    },
                    expected: {
                        kind: 'sentence_builder',
                        tokens: ['prijs-stijgt', 'vraag-daalt', 'bronwaarde'],
                        acceptedSequences: [
                            ['prijs-stijgt', 'vraag-daalt', 'bronwaarde']
                        ]
                    },
                    feedback: {
                        matchTitle: 'Redenering past',
                        matchText: 'Je bouwt oorzaak, gevolg en bronkoppeling in volgorde.',
                        retryTitle: 'Controleer de volgorde',
                        retryText: 'Begin bij de oorzaak en sluit af met de bronkoppeling.'
                    },
                    practiceRoute: { label: 'Oefen verder met redeneren', href: 'redeneer-spel.html' }
                }
            },
            {
                id: 'cloze-text-task',
                type: 'task_shell',
                taskShell: {
                    id: 'cloze-text-task',
                    family: 'cloze_text',
                    skillLabel: 'Bronconclusie invullen',
                    purpose: 'Vul korte bronwoorden in zonder keuze-tegels.',
                    prompt: 'Maak de bronconclusie af.',
                    interaction: {
                        segments: [
                            { type: 'text', text: 'Bij prijs 2 hoort ' },
                            { type: 'blank', blankId: 'waarde' },
                            { type: 'text', text: ', dus de gevraagde hoeveelheid ' },
                            { type: 'blank', blankId: 'richting' },
                            { type: 'text', text: '.' }
                        ],
                        blanks: [
                            { id: 'waarde', label: 'Bronwaarde', placeholder: 'bijv. 300 ijsjes' },
                            { id: 'richting', label: 'Richting', placeholder: 'bijv. daalt' }
                        ]
                    },
                    expected: {
                        kind: 'cloze_text',
                        blanks: {
                            waarde: { accepted: ['300 ijsjes', '300'] },
                            richting: { accepted: ['daalt', 'dalen'] }
                        }
                    },
                    feedback: {
                        matchTitle: 'Conclusie past',
                        matchText: 'Je vult de bronwaarde en richting controleerbaar in.',
                        retryTitle: 'Controleer de bron',
                        retryText: 'Lees de waarde en richting opnieuw.'
                    },
                    practiceRoute: { label: 'Oefen verder met grafieken', href: 'grafiekenspel.html' }
                }
            },
            {
                id: 'multi-select-task',
                type: 'task_shell',
                taskShell: {
                    id: 'multi-select-task',
                    family: 'multi_select',
                    skillLabel: 'Bronvoorwaarden kiezen',
                    purpose: 'Kies alle gegevens die je nodig hebt.',
                    prompt: 'Welke gegevens gebruik je voor de verandering?',
                    interaction: {
                        inputLabel: 'Benodigde gegevens',
                        options: [
                            { id: 'oude-waarde', label: 'Oude waarde uit de bron' },
                            { id: 'nieuwe-waarde', label: 'Nieuwe waarde uit de bron' },
                            { id: 'titel', label: 'Titel van de paragraaf' }
                        ]
                    },
                    expected: {
                        kind: 'multi_select',
                        mode: 'exact_set',
                        values: ['oude-waarde', 'nieuwe-waarde'],
                        partialFeedback: 'practice_only'
                    },
                    feedback: {
                        matchTitle: 'Gegevens kloppen',
                        matchText: 'Je kiest de oude en nieuwe bronwaarde.',
                        retryTitle: 'Controleer je keuzes',
                        retryText: 'Kies alleen de gegevens die nodig zijn voor de verandering.'
                    },
                    practiceRoute: { label: 'Oefen verder met bronnen', href: 'grafiekenspel.html' }
                }
            },
            {
                id: 'formula-task',
                type: 'task_shell',
                taskShell: {
                    id: 'formula-task',
                    family: 'formula_builder',
                    skillLabel: 'Formule bouwen',
                    purpose: 'Bouw eerst de formule voordat je gaat rekenen.',
                    prompt: 'Bouw de formule voor procentuele verandering.',
                    interaction: {
                        tokens: [
                            { id: 'nieuw-min-oud', label: 'nieuw - oud', kind: 'answer', category: 'numerator' },
                            { id: 'delen-door-oud', label: '/ oud', kind: 'answer', category: 'denominator' },
                            { id: 'keer-100-procent', label: 'x 100%', kind: 'answer', category: 'multiplier' },
                            { id: 'delen-door-nieuw', label: '/ nieuw', kind: 'distractor', category: 'denominator', distractorFor: 'delen-door-oud' }
                        ],
                        separator: ' ',
                        tokenBankLabel: 'Formuleblokken',
                        sequenceLabel: 'Opgebouwde formule'
                    },
                    expected: {
                        kind: 'formula_builder',
                        tokens: ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent'],
                        acceptedSequences: [
                            ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent']
                        ]
                    },
                    feedback: {
                        matchTitle: 'Formule klopt',
                        matchText: 'Je kiest de oude waarde als basis.',
                        retryTitle: 'Controleer de basis',
                        retryText: 'Bij procentuele verandering deel je door oud.'
                    },
                    practiceRoute: { label: 'Oefen verder met rekenen', href: 'wiskundevaardigheden.html' }
                }
            },
            {
                id: 'step-task',
                type: 'task_shell',
                taskShell: {
                    id: 'step-task',
                    family: 'step_ordering',
                    skillLabel: 'Grafiekstappen ordenen',
                    purpose: 'Zet de grafiekroute in volgorde.',
                    prompt: 'Orden de stappen voor het aflezen uit een grafiek.',
                    interaction: {
                        steps: [
                            { id: 'zoek-as', label: 'Zoek de juiste as', kind: 'answer' },
                            { id: 'lees-waarde', label: 'Lees de waarde af', kind: 'answer' },
                            { id: 'noteer-eenheid', label: 'Noteer de eenheid', kind: 'answer' },
                            { id: 'rond-eerst-af', label: 'Rond eerst af', kind: 'distractor', distractorFor: 'lees-waarde' }
                        ],
                        separator: ' -> ',
                        stepBankLabel: 'Grafiekstappen',
                        sequenceLabel: 'Gekozen volgorde'
                    },
                    expected: {
                        kind: 'step_ordering',
                        order: ['zoek-as', 'lees-waarde', 'noteer-eenheid'],
                        partialFeedback: 'practice_only'
                    },
                    feedback: {
                        matchTitle: 'Volgorde klopt',
                        matchText: 'Je leest eerst, daarna noteer je met eenheid.',
                        retryTitle: 'Controleer de volgorde',
                        retryText: 'Begin bij de as en eindig met de eenheid.'
                    },
                    practiceRoute: { label: 'Oefen verder met grafieken', href: 'grafiekenspel.html' }
                }
            },
            {
                id: 'source-values-task',
                type: 'task_shell',
                taskShell: {
                    id: 'source-values-task',
                    family: 'source_value_selection',
                    skillLabel: 'Bronwaarden kiezen',
                    purpose: 'Kies oude en nieuwe waarde uit de bron.',
                    prompt: 'Welke bronwaarden gebruik je voor de procentuele verandering?',
                    interaction: {
                        valueBankLabel: 'Bronwaarden',
                        roleLabel: 'Rol',
                        values: [
                            { id: 'oud', label: 'EUR 800', kind: 'answer', sourceLabel: 'oude prijs' },
                            { id: 'nieuw', label: 'EUR 920', kind: 'answer', sourceLabel: 'nieuwe prijs' },
                            { id: 'btw', label: '21%', kind: 'distractor', distractorFor: 'nieuw' }
                        ],
                        roles: [
                            { id: 'old', label: 'oude waarde' },
                            { id: 'new', label: 'nieuwe waarde' }
                        ]
                    },
                    expected: {
                        kind: 'source_value_selection',
                        selections: [
                            { valueId: 'oud', role: 'old' },
                            { valueId: 'nieuw', role: 'new' }
                        ],
                        partialFeedback: 'practice_only'
                    },
                    feedback: {
                        matchTitle: 'Bronwaarden kloppen',
                        matchText: 'Je kiest de oude en nieuwe waarde.',
                        retryTitle: 'Controleer de bron',
                        retryText: 'Kies alleen de waarden voor de berekening.'
                    },
                    practiceRoute: { label: 'Oefen verder met bronnen', href: 'grafiekenspel.html' }
                }
            },
            {
                id: 'source-chain-task',
                type: 'task_shell',
                taskShell: {
                    id: 'source-chain-task',
                    family: 'source_chain_builder',
                    skillLabel: 'Bronketen bouwen',
                    purpose: 'Bouw de route van bron naar conclusie.',
                    prompt: 'Bouw de juiste bronketen.',
                    interaction: {
                        nodeBankLabel: 'Bronketen onderdelen',
                        sequenceLabel: 'Opgebouwde bronketen',
                        nodes: [
                            { id: 'bron', label: 'Lees de tabel', kind: 'answer', nodeRole: 'source' },
                            { id: 'waarden', label: 'Gebruik 800 en 920', kind: 'answer', nodeRole: 'value' },
                            { id: 'bewerking', label: '(920 - 800) / 800', kind: 'answer', nodeRole: 'operation' },
                            { id: 'antwoord', label: '15%', kind: 'answer', nodeRole: 'answer' },
                            { id: 'conclusie', label: 'De prijs stijgt', kind: 'answer', nodeRole: 'conclusion' },
                            { id: 'deel-door-nieuw', label: 'Deel door nieuw', kind: 'distractor', nodeRole: 'operation', distractorFor: 'bewerking' }
                        ]
                    },
                    expected: {
                        kind: 'source_chain_builder',
                        chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie'],
                        partialFeedback: 'practice_only'
                    },
                    feedback: {
                        matchTitle: 'Bronketen klopt',
                        matchText: 'Je koppelt bron, waarde, bewerking, antwoord en conclusie.',
                        retryTitle: 'Controleer de keten',
                        retryText: 'Begin bij de bron en eindig met de conclusie.'
                    },
                    practiceRoute: { label: 'Oefen verder met bronnen', href: 'grafiekenspel.html' }
                }
            },
            {
                id: 'label-placement-task',
                type: 'task_shell',
                taskShell: {
                    id: 'label-placement-task',
                    family: 'label_placement',
                    skillLabel: 'Grafieklabels plaatsen',
                    purpose: 'Plaats labels bij de juiste onderdelen van de grafiek.',
                    prompt: 'Welke labels horen bij de assen?',
                    interaction: {
                        labelBankLabel: 'Labelbank',
                        targetRegionLabel: 'Grafiekvlak',
                        placementLabel: 'Geplaatste labels',
                        visual: {
                            kind: 'coordinate_plane',
                            title: 'Prijs-hoeveelheidgrafiek',
                            description: 'Een assenstelsel met prijs verticaal en hoeveelheid horizontaal.'
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
                    },
                    expected: {
                        kind: 'label_placement',
                        placements: [
                            { labelId: 'prijs', targetId: 'y-as' },
                            { labelId: 'hoeveelheid', targetId: 'x-as' }
                        ],
                        partialFeedback: 'practice_only'
                    },
                    feedback: {
                        matchTitle: 'Labels kloppen',
                        matchText: 'Je plaatst prijs en hoeveelheid bij de juiste assen.',
                        retryTitle: 'Controleer de assen',
                        retryText: 'Prijs staat verticaal; hoeveelheid staat horizontaal.'
                    },
                    practiceRoute: { label: 'Oefen verder met grafieken', href: 'grafiekenspel.html' }
                }
            },
            {
                id: 'matching-pairs-task',
                type: 'task_shell',
                taskShell: {
                    id: 'matching-pairs-task',
                    family: 'matching_pairs',
                    skillLabel: 'Begrippen koppelen',
                    purpose: 'Koppel begrippen aan betekenissen.',
                    prompt: 'Welke betekenis hoort bij elk begrip?',
                    interaction: {
                        leftBankLabel: 'Begrippen',
                        rightBankLabel: 'Betekenissen',
                        pairLabel: 'Gemaakte koppels',
                        leftItems: [
                            { id: 'schaarste', label: 'Schaarste', description: 'Beperkte middelen.', kind: 'answer' },
                            { id: 'alternatieve-kosten', label: 'Alternatieve kosten', description: 'Beste niet-gekozen alternatief.', kind: 'answer' },
                            { id: 'winst', label: 'Winst', description: 'Afleider.', kind: 'distractor', distractorFor: 'schaarste' }
                        ],
                        rightItems: [
                            { id: 'behoeften-middelen', label: 'Behoeften groter dan middelen', description: 'Betekenis van schaarste.', kind: 'answer' },
                            { id: 'beste-alternatief', label: 'Beste niet-gekozen alternatief', description: 'Betekenis van alternatieve kosten.', kind: 'answer' },
                            { id: 'opbrengst-kosten', label: 'Opbrengst min kosten', description: 'Afleider.', kind: 'distractor', distractorFor: 'behoeften-middelen' }
                        ]
                    },
                    expected: {
                        kind: 'matching_pairs',
                        pairs: [
                            ['schaarste', 'behoeften-middelen'],
                            ['alternatieve-kosten', 'beste-alternatief']
                        ],
                        partialFeedback: 'practice_only'
                    },
                    feedback: {
                        matchTitle: 'Koppels kloppen',
                        matchText: 'Je koppelt begrip en betekenis.',
                        retryTitle: 'Controleer je koppels',
                        retryText: 'Kies per begrip de passende betekenis.'
                    },
                    practiceRoute: { label: 'Oefen verder met begrippen', href: 'redeneer-spel.html' }
                }
            },
            {
                id: 'two-tier-choice-task',
                type: 'task_shell',
                taskShell: {
                    id: 'two-tier-choice-task',
                    family: 'two_tier_choice',
                    skillLabel: 'Antwoord met reden kiezen',
                    purpose: 'Kies een conclusie en de reden die deze conclusie ondersteunt.',
                    prompt: 'Welke uitspraak over indexpunten klopt, en waarom?',
                    interaction: {
                        answerLabel: 'Antwoord',
                        reasonLabel: 'Reden',
                        answerOptions: [
                            {
                                id: 'vier-indexpunten',
                                label: 'De stijging is 4 indexpunten.',
                                description: 'Dit benoemt het verschil tussen 112 en 108.'
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
                                label: 'Indexpunten bereken je door indexcijfers af te trekken.',
                                description: '112 min 108 is 4 indexpunten.'
                            },
                            {
                                id: 'delen-door-honderd',
                                label: 'Je deelt altijd door 100.',
                                description: 'Dit is geen juiste reden bij indexpunten.'
                            }
                        ]
                    },
                    expected: {
                        kind: 'two_tier_choice',
                        answer: 'vier-indexpunten',
                        reason: 'verschil-in-punten',
                        partialFeedback: 'practice_only'
                    },
                    feedback: {
                        matchTitle: 'Antwoord en reden passen',
                        matchText: 'Je koppelt de uitspraak aan de juiste reden.',
                        retryTitle: 'Controleer de koppeling',
                        retryText: 'Kijk of de reden het gekozen antwoord ondersteunt.'
                    },
                    practiceRoute: { label: 'Oefen verder met indexpunten', href: 'wiskundevaardigheden.html' }
                }
            },
            {
                id: 'assertion-reason-task',
                type: 'task_shell',
                taskShell: {
                    id: 'assertion-reason-task',
                    family: 'assertion_reason',
                    skillLabel: 'Stelling en reden beoordelen',
                    purpose: 'Kies de relatie tussen stelling en reden.',
                    prompt: 'Beoordeel de economische relatie.',
                    interaction: {
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
                    },
                    expected: {
                        kind: 'assertion_reason',
                        value: 'both-correct-explains',
                        partialFeedback: 'practice_only'
                    },
                    feedback: {
                        matchTitle: 'Relatie klopt',
                        matchText: 'Je beoordeelt stelling en reden samen.',
                        retryTitle: 'Controleer de relatie',
                        retryText: 'Kijk of de reden de stelling echt ondersteunt.'
                    },
                    practiceRoute: { label: 'Oefen verder met redeneren', href: 'redeneer-spel.html' }
                }
            }
        ]
    };
}

describe('ExitTicketUI', () => {
    test('renders student-visible text without internal MTU codes', () => {
        const html = visibleHtml();
        expect(html).toContain('Korte check');
        expect(html).toContain('Schaarste herkennen');
        expect(html).toContain('Alternatieve kosten kiezen');
        expect(html).not.toMatch(/\b(?:A\d{2}|B\d{2}|PV|MTU)\b/);
    });

    test('renders no blocked product-boundary words in the checkpoint surface', () => {
        const html = visibleHtml().toLowerCase();
        for (const term of ExitTicketEngine.BLOCKED_STUDENT_TERMS) {
            expect(html).not.toContain(term.toLowerCase());
        }
    });

    test('renders the 1.1.2 exit ticket candidate with approved local copy hidden before proof', () => {
        const html = targetVisibleHtml();
        expect(html).toContain('Exit ticket');
        expect(html).toContain('Procentuele verandering berekenen');
        expect(html).toContain('Indexpunten kort uitleggen');
        expect(html).toContain('Je hebt laten zien dat je de eindopgave van deze paragraaf aankunt.');
        expect(html).toContain('<section class="et-completion" id="et-completion" hidden>');
        expect(html).toContain('data-task-family="calculation_work_capture"');
        expect(html).toContain('data-task-family="structured_short_response"');
        expect(html).toContain('data-input-role="unit-notation"');
        expect(html).toContain('data-input-role="structured-field"');
        expect(html).toContain('data-field-id="indexpunten"');
        expect(html).not.toContain('class="ts-hints"');
        expect(html).not.toContain('class="ts-criteria"');
        expect(html).not.toContain('Gebruik nieuw min oud gedeeld door oud.');
        expect(html).not.toContain('Schrijf het antwoord als indexcijfer zonder procentteken.');
        expect(html).not.toContain('Bijvoorbeeld 15');
        expect(html).not.toContain('Bijvoorbeeld 108');
        expect(html).not.toContain('Bijvoorbeeld 3,7');
        expect(html).not.toContain('Bijvoorbeeld 4 indexpunten');
        expect(html).toContain('Vul je eindantwoord in');
        expect(html).toContain('placeholder="Bijvoorbeeld %"');
        expect(html).toContain('placeholder="Bijvoorbeeld indexcijfer"');
        expect((html.match(/class="et-feedback/g) || []).length).toBe(targetData.tasks.length);
        expect((html.match(/class="ts-feedback"/g) || []).length).toBe(0);
        expect(html).not.toMatch(/\b(?:A\d{2}|D\d{2}|PV|MTU)\b/);
        expect(html.toLowerCase()).not.toContain('bewezen');
        expect(html.toLowerCase()).not.toContain('aangetoond');
        expect(html.toLowerCase()).not.toContain('beheerst');
    });

    test('generator shell loads shared skill-map and exit-ticket runtime files', () => {
        const shell = exitTicketShells.generateShell('1.1.1', 'Schaarste en economisch denken', data, '1.1.1-korte-check');
        expect(shell).toContain('shared/skill-map-engine.js');
        expect(shell).toContain('shared/skilltree/base-elements.js');
        expect(shell).toContain('shared/skilltree/1.1.1.js');
        expect(shell).toContain('shared/skill-map-route-ui.js');
        expect(shell).toContain('shared/task-shell.css');
        expect(shell).toContain('shared/task-shell-engine.js');
        expect(shell).toContain('shared/task-shell-ui.js');
        expect(shell).toContain('shared/exit-ticket/1.1.1-korte-check.js');
        expect(shell).toContain('shared/exit-ticket-engine.js');
        expect(shell).toContain('shared/exit-ticket-ui.js');
        expect(shell).toContain('shared/exit-ticket.css');
    });

    test('generator shell uses the source title for the 1.1.2 exit ticket', () => {
        const shell = exitTicketShells.generateShell('1.1.2', 'Percentages en indexcijfers', targetData, '1.1.2-exit-ticket');
        expect(shell).toContain('<title>Percentages en indexcijfers - Exit ticket</title>');
        expect(shell).toContain('shared/exit-ticket/1.1.2-exit-ticket.js');
    });

    test('deploy copies checkpoint runtime and runs the shell generator before landing pages', () => {
        const deploy = fs.readFileSync(path.join(PLATFORM_ROOT, 'scripts', 'deploy.js'), 'utf8');
        expect(deploy).toContain("'task-shell-engine.js'");
        expect(deploy).toContain("'task-shell-ui.js'");
        expect(deploy).toContain("'task-shell.css'");
        expect(deploy).toContain("'exit-ticket-engine.js'");
        expect(deploy).toContain("'exit-ticket-ui.js'");
        expect(deploy).toContain("'exit-ticket.css'");
        const exitTicketIndex = deploy.indexOf('build-exit-ticket-shells.js');
        const landingIndex = deploy.indexOf('build-landing-page.js');
        expect(exitTicketIndex).toBeGreaterThan(-1);
        expect(landingIndex).toBeGreaterThan(-1);
        expect(exitTicketIndex).toBeLessThan(landingIndex);
    });

    test('renders checkpoint-compatible graph tasks through the shared task shell', () => {
        const html = ExitTicketUI.renderStaticHtml(graphTaskShellData(), {});
        expect(html).toContain('data-task-family="table_value_selection"');
        expect(html).toContain('data-task-family="graph_reading"');
        expect(html).toContain('data-task-family="point_placement"');
        expect(html).toContain('data-task-family="cloze_tile_select"');
        expect(html).toContain('data-task-family="cloze_text"');
        expect(html).toContain('data-task-family="multi_select"');
        expect(html).toContain('data-task-family="sentence_builder"');
        expect(html).toContain('data-task-family="formula_builder"');
        expect(html).toContain('data-task-family="step_ordering"');
        expect(html).toContain('data-task-family="source_value_selection"');
        expect(html).toContain('data-task-family="source_chain_builder"');
        expect(html).toContain('data-task-family="label_placement"');
        expect(html).toContain('data-task-family="matching_pairs"');
        expect(html).toContain('data-task-family="two_tier_choice"');
        expect(html).toContain('data-task-family="assertion_reason"');
        expect(html).toContain('data-task-family="graph_construction_substitute"');
        expect(html).toContain('class="ts-graph-construction"');
        expect(html).toContain('data-graph-workspace');
        expect(html).toContain('data-graph-axis="x"');
        expect(html).toContain('data-graph-point-index="0"');
        expect(html).toContain('data-graph-line-confirmation');
        expect(html).toContain('data-cloze-blank-id="waarde"');
        expect(html).toContain('data-cloze-tile-id="vierhonderd"');
        expect(html).toContain('data-cloze-text-blank-id="richting"');
        expect(html).toContain('data-multi-option-id="titel"');
        expect(html).toContain('data-sentence-token-id="vraag-stijgt"');
        expect(html).toContain('data-formula-token-id="delen-door-nieuw"');
        expect(html).toContain('data-step-id="rond-eerst-af"');
        expect(html).toContain('data-source-value-id="btw"');
        expect(html).toContain('data-source-node-id="deel-door-nieuw"');
        expect(html).toContain('data-label-id="prijs"');
        expect(html).toContain('data-label-target-id="y-as"');
        expect(html).toContain('data-match-left-id="schaarste"');
        expect(html).toContain('data-match-right-id="behoeften-middelen"');
        expect(html).toContain('data-match-pair-summary');
        expect(html).toContain('data-two-tier-answer-id="vier-indexpunten"');
        expect(html).toContain('data-two-tier-reason-id="verschil-in-punten"');
        expect(html).toContain('data-two-tier-summary');
        expect(html).toContain('data-assertion-option-id="both-correct-explains"');
        expect(html).toContain('data-assertion-summary');
        expect(html).toContain('et-task-shell-check');
        expect(html).not.toMatch(/\b(?:PV|MTU)\b/);
    });

    test('renders the excellent 1.1.3 exit-ticket candidate without formula context leakage', () => {
        const engine = new ExitTicketEngine({ data: exit113Data });
        const view = ExitTicketUI.buildSkillView(exit113Data, engine, {});
        const html = ExitTicketUI.renderStaticHtml(exit113Data, view);
        expect(html).toContain('data-task-family="graph_construction_substitute"');
        expect(html).toContain('data-task-family="graph_reading"');
        expect(html).toContain('data-task-family="formula_builder"');
        expect(html).toContain('data-task-family="calculation_work_capture"');
        expect(html).toContain('data-point-snap-mode="magnetic_table_point"');
        expect(html.indexOf('data-graph-reading-interval-option-id="200-250"')).toBeLessThan(html.indexOf('data-input-role="answer"'));
        expect(html).toContain('placeholder="vul hoeveelheid in"');
        expect(html).toContain('placeholder="vul percentage in, bijvoorbeeld met %"');
        expect(html).not.toContain('ts-context-formula');
        expect(html).not.toContain('ctx-stationbroodjes-formula');
        expect(html).not.toContain('placeholder="225"');
        expect(html).not.toContain('placeholder="-50"');
        expect(html).not.toMatch(/score|diagnostic|mastery/i);
    });

    test('exit-ticket wrapper delegates cloze tile collection to the shared task shell', () => {
        const source = fs.readFileSync(path.join(PLATFORM_ROOT, 'engines', 'exit-ticket-ui.js'), 'utf8');
        expect(source).toContain('handleClozeTileClick(app, event)');
        expect(source).toContain('handleMultiSelectClick(app, event)');
        expect(source).toContain('collectMultiSelectResponse(wrapper, task)');
        expect(source).toContain("task.family === 'multi_select'");
        expect(source).toContain('collectCalculationResponse(wrapper, task)');
        expect(source).toContain('collectClozeTileResponse(wrapper, task)');
        expect(source).toContain("task.family === 'cloze_tile_select'");
        expect(source).toContain("task.family === 'cloze_text'");
        expect(source).toContain('collectClozeTextResponse(wrapper, task)');
        expect(source).toContain('handleSentenceBuilderClick(app, event)');
        expect(source).toContain('collectSentenceBuilderResponse(wrapper, task)');
        expect(source).toContain('handleGraphConstructionClick(app, event)');
        expect(source).toContain('collectGraphConstructionResponse(wrapper, task)');
        expect(source).toContain('collectGraphReadingResponse(wrapper, task)');
        expect(source).toContain("task.family === 'graph_reading'");
        expect(source).toContain("task.family === 'sentence_builder'");
        expect(source).toContain('handleFormulaBuilderClick(app, event)');
        expect(source).toContain('collectFormulaBuilderResponse(wrapper, task)');
        expect(source).toContain("task.family === 'formula_builder'");
        expect(source).toContain('handleStepOrderingClick(app, event)');
        expect(source).toContain('collectStepOrderingResponse(wrapper, task)');
        expect(source).toContain("task.family === 'step_ordering'");
        expect(source).toContain('handleMatchingPairsClick(app, event)');
        expect(source).toContain('collectMatchingPairsResponse(wrapper, task)');
        expect(source).toContain("task.family === 'matching_pairs'");
        expect(source).toContain('handleTwoTierChoiceClick(app, event)');
        expect(source).toContain('collectTwoTierChoiceResponse(wrapper, task)');
        expect(source).toContain("task.family === 'two_tier_choice'");
        expect(source).toContain('handleAssertionReasonClick(app, event)');
        expect(source).toContain('collectAssertionReasonResponse(wrapper, task)');
        expect(source).toContain("task.family === 'assertion_reason'");
        expect(source).toContain('handleSourceValueSelectionClick(app, event)');
        expect(source).toContain('collectSourceValueSelectionResponse(wrapper, task)');
        expect(source).toContain("task.family === 'source_value_selection'");
        expect(source).toContain('handleSourceChainBuilderClick(app, event)');
        expect(source).toContain('collectSourceChainBuilderResponse(wrapper, task)');
        expect(source).toContain("task.family === 'source_chain_builder'");
        expect(source).toContain('handleLabelPlacementClick(app, event)');
        expect(source).toContain('collectLabelPlacementResponse(wrapper, task)');
        expect(source).toContain("task.family === 'label_placement'");
    });
});
