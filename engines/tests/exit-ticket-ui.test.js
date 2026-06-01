const fs = require('fs');
const path = require('path');
const ExitTicketUI = require('../exit-ticket-ui');
const ExitTicketEngine = require('../exit-ticket-engine');
const data = require('../../source-data/book-1/exit-ticket/1.1.1.json');
const targetData = require('../../source-data/book-1/exit-ticket/1.1.2.json');
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
        expect(html).toContain('Vul de notatie in');
        expect((html.match(/class="et-feedback/g) || []).length).toBe(targetData.tasks.length);
        expect((html.match(/class="ts-feedback"/g) || []).length).toBe(0);
        expect(html).not.toMatch(/\b(?:A\d{2}|D\d{2}|PV|MTU)\b/);
        expect(html.toLowerCase()).not.toContain('bewezen');
        expect(html.toLowerCase()).not.toContain('aangetoond');
        expect(html.toLowerCase()).not.toContain('beheerst');
    });

    test('generator shell loads shared skill-map and exit-ticket runtime files', () => {
        const shell = exitTicketShells.generateShell('1.1.1', 'Schaarste en economisch denken');
        expect(shell).toContain('shared/skill-map-engine.js');
        expect(shell).toContain('shared/skilltree/base-elements.js');
        expect(shell).toContain('shared/skilltree/1.1.1.js');
        expect(shell).toContain('shared/skill-map-route-ui.js');
        expect(shell).toContain('shared/task-shell.css');
        expect(shell).toContain('shared/task-shell-engine.js');
        expect(shell).toContain('shared/task-shell-ui.js');
        expect(shell).toContain('shared/exit-ticket/1.1.1.js');
        expect(shell).toContain('shared/exit-ticket-engine.js');
        expect(shell).toContain('shared/exit-ticket-ui.js');
        expect(shell).toContain('shared/exit-ticket.css');
    });

    test('generator shell uses the source title for the 1.1.2 exit ticket', () => {
        const shell = exitTicketShells.generateShell('1.1.2', 'Percentages en indexcijfers', targetData);
        expect(shell).toContain('<title>Percentages en indexcijfers - Exit ticket</title>');
        expect(shell).toContain('shared/exit-ticket/1.1.2.js');
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
        expect(html).toContain('data-task-family="sentence_builder"');
        expect(html).toContain('data-task-family="formula_builder"');
        expect(html).toContain('data-cloze-blank-id="waarde"');
        expect(html).toContain('data-cloze-tile-id="vierhonderd"');
        expect(html).toContain('data-sentence-token-id="vraag-stijgt"');
        expect(html).toContain('data-formula-token-id="delen-door-nieuw"');
        expect(html).toContain('et-task-shell-check');
        expect(html).not.toMatch(/\b(?:PV|MTU)\b/);
    });

    test('exit-ticket wrapper delegates cloze tile collection to the shared task shell', () => {
        const source = fs.readFileSync(path.join(PLATFORM_ROOT, 'engines', 'exit-ticket-ui.js'), 'utf8');
        expect(source).toContain('handleClozeTileClick(app, event)');
        expect(source).toContain('collectClozeTileResponse(wrapper, task)');
        expect(source).toContain("task.family === 'cloze_tile_select'");
        expect(source).toContain('handleSentenceBuilderClick(app, event)');
        expect(source).toContain('collectSentenceBuilderResponse(wrapper, task)');
        expect(source).toContain("task.family === 'sentence_builder'");
        expect(source).toContain('handleFormulaBuilderClick(app, event)');
        expect(source).toContain('collectFormulaBuilderResponse(wrapper, task)');
        expect(source).toContain("task.family === 'formula_builder'");
    });
});
