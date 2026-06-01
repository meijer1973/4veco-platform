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

    test('escapes task text before rendering', () => {
        const unsafe = data();
        unsafe.tasks[0].prompt = '<script>alert("x")</script>';
        const html = TaskShellUI.renderStaticHtml(unsafe);
        expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
        expect(html).not.toContain('<script>alert');
    });
});
