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
            task('table', 'table_value_selection', { inputLabel: 'Tabelwaarde', options: [{ id: 'a', label: '8' }, { id: 'b', label: '10' }] }, { kind: 'choice', value: 'b' }),
            task('graph', 'graph_reading', { inputLabel: 'Afgelezen waarde' }, { kind: 'number', value: 10, tolerance: 1 }),
            task('point', 'point_placement', { xLabel: 'Hoeveelheid', yLabel: 'Prijs' }, { kind: 'point', x: 4, y: 10 }),
            task('construct', 'graph_construction_substitute', { inputLabel: 'Grafiekstappen' }, { kind: 'self_check', criteria: ['Punten genoemd', 'Lijn beschreven'] }),
            task('reasoning', 'structured_reasoning', { inputLabel: 'Redenering' }, { kind: 'self_check', criteria: ['Oorzaak genoemd', 'Conclusie gekoppeld'] })
        ]
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
            'cloze_tile_select',
            'sentence_builder',
            'formula_builder',
            'table_value_selection',
            'graph_reading',
            'point_placement',
            'graph_construction_substitute',
            'structured_reasoning'
        ]) {
            expect(html).toContain(`data-task-family="${family}"`);
        }
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
        expect(html).toContain('class="ts-sentence"');
        expect(html).toContain('data-sentence-token-id="vraag-stijgt"');
        expect(html).toContain('data-sentence-sequence');
        expect(html).toContain('role="group" aria-label="Fragmentbank"');
        expect(html).toContain('class="ts-formula"');
        expect(html).toContain('data-formula-token-id="delen-door-nieuw"');
        expect(html).toContain('data-formula-token-category="denominator"');
        expect(html).toContain('data-formula-sequence');
        expect(html).toContain('role="group" aria-label="Formuleblokken"');
        expect(html).toContain('aria-label="Feedback op je antwoord"');
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
        expect(html).toContain('Invullen met tegels');
        expect(html).toContain('Zin bouwen');
        expect(html).toContain('Formule bouwen');
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

    test('exports sentence builder helpers for consuming wrappers', () => {
        expect(typeof TaskShellUI.collectSentenceBuilderResponse).toBe('function');
        expect(typeof TaskShellUI.handleSentenceBuilderClick).toBe('function');
        expect(TaskShellEngine.focusPlan(data().tasks[8])).toEqual([
            '[data-task-id="sentence-builder"][data-sentence-token-id]',
            '[data-task-id="sentence-builder"][data-sentence-sequence]'
        ]);
    });

    test('exports formula builder helpers for consuming wrappers', () => {
        expect(typeof TaskShellUI.collectFormulaBuilderResponse).toBe('function');
        expect(typeof TaskShellUI.handleFormulaBuilderClick).toBe('function');
        expect(TaskShellEngine.focusPlan(data().tasks[9])).toEqual([
            '[data-task-id="formula-builder"][data-formula-token-id]',
            '[data-task-id="formula-builder"][data-formula-sequence]'
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
