const GoldenTicketLayout = require('../golden-ticket-layout');
const exit112Data = require('../../source-data/book-1/exit-ticket/1.1.2-exit-ticket.json');
const short112Data = require('../../source-data/book-1/exit-ticket/1.1.2-korte-check.json');
const exit113Data = require('../../source-data/book-1/exit-ticket/1.1.3-exit-ticket.json');
const short113Data = require('../../source-data/book-1/exit-ticket/1.1.3-korte-check.json');
const A96ProofData = require('../../build-scripts/sprints/mtu-ans-proof-impl1-a96-data');

function task(id) {
    return exit112Data.tasks.find((item) => item.id === id).taskShell;
}

function shortTask(id) {
    return short112Data.tasks.find((item) => item.id === id);
}

function graphShortTask(id) {
    return short113Data.tasks.find((item) => item.id === id).taskShell;
}

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

describe('GoldenTicketLayout', () => {
    test('selects supported variants by capability shape', () => {
        expect(GoldenTicketLayout.supportedVariantFor(exit113Data)).toBe('golden_graph_reading_claim_v1');
        expect(GoldenTicketLayout.supportedVariantFor(short113Data)).toBe('golden_graph_advisory_v1');
        expect(GoldenTicketLayout.supportedVariantFor(exit112Data)).toBe('golden_calculation_structured_v1');
        expect(GoldenTicketLayout.supportedVariantFor(short112Data)).toBe('golden_advisory_short_check_v1');
        expect(GoldenTicketLayout.rendererAssetsForVariant('golden_graph_advisory_v1').scripts).toEqual([
            'exit-ticket/{sourceKey}.js',
            'golden-ticket-graph.js',
            'golden-ticket-layout.js',
        ]);
        expect(GoldenTicketLayout.rendererAssetsForVariant('golden_calculation_structured_v1').scripts).toEqual([
            'exit-ticket/{sourceKey}.js',
            'golden-ticket-layout.js',
        ]);
        expect(GoldenTicketLayout.rendererAssetsForVariant('golden_advisory_short_check_v1').scripts).toEqual([
            'exit-ticket/{sourceKey}.js',
            'golden-ticket-layout.js',
        ]);
    });

    test('evaluates 1.1.2 calculation and structured responses without legacy task-shell UI', () => {
        expect(GoldenTicketLayout.evaluateTaskResponse(task('prijsstijging-procent'), {
            methodTokens: ['open', 'newPrice', 'minus', 'oldPrice', 'close', 'divide', 'oldPrice', 'times100'],
            substitution: {
                newPrice: '920',
                oldPriceNumerator: '800',
                oldPriceDenominator: '800',
            },
            finalAnswer: '15',
            notation: '%',
            conclusion: 'De prijs van de fiets stijgt met 15 procent.',
        })).toBe(true);

        expect(GoldenTicketLayout.evaluateTaskResponse(task('prijsstijging-procent'), {
            methodTokens: [],
            substitution: {},
            finalAnswer: '15',
            notation: '%',
            conclusion: 'De prijs van de fiets stijgt met 15 procent.',
        })).toBe(false);

        expect(GoldenTicketLayout.evaluateTaskResponse(task('prijsstijging-procent'), {
            methodTokens: ['open', 'newPrice', 'minus', 'oldPrice', 'close', 'divide', 'oldPrice', 'times100'],
            substitution: {
                newPrice: '920',
                oldPriceNumerator: '800',
                oldPriceDenominator: '920',
            },
            finalAnswer: '15',
            notation: '%',
            conclusion: 'De prijs van de fiets stijgt met 15 procent.',
        })).toBe(false);

        [
            'finalAnswerOnly',
            'sourceValuesOnly',
            'missingFormula',
            'wrongDenominator',
            'tokenBankOrderedAsAnswer',
            'missingSubstitution',
            'missingNotation',
            'conclusionWithoutDirection',
            'vagueExampleOnly',
            'contradictoryNegation',
            'contradictoryDecrease',
            'contradictoryHasPercent',
        ].forEach((caseName) => {
            expect(GoldenTicketLayout.evaluateTaskResponse(
                task('prijsstijging-procent'),
                A96ProofData.negativeResponses[caseName]
            )).toBe(false);
        });

        expect(GoldenTicketLayout.evaluateTaskResponse(task('indexpunten-uitleg'), {
            fields: {
                indexpunten: '4 indexpunten',
                basis: '108',
                'procentuele-stijging': '3,7%',
            },
            choice: 'niet-vier-procent',
        })).toBe(true);

        expect(GoldenTicketLayout.evaluateTaskResponse(task('indexpunten-uitleg'), {
            fields: {
                indexpunten: '4 procent',
                basis: '100',
                'procentuele-stijging': '4%',
            },
            choice: 'wel-vier-procent',
        })).toBe(false);
    });

    test('evaluates advisory short-check choices without target-equivalent state', () => {
        expect(GoldenTicketLayout.evaluateTaskResponse(shortTask('oude-waarde-als-basis'), 'a')).toBe(true);
        expect(GoldenTicketLayout.evaluateTaskResponse(shortTask('oude-waarde-als-basis'), 'b')).toBe(false);
        expect(GoldenTicketLayout.evaluateTaskResponse(shortTask('index-zonder-procent'), { answerId: 'b' })).toBe(true);
        expect(GoldenTicketLayout.evaluateTaskResponse(shortTask('indexpunten-niet-procent'), { answerId: 'c' })).toBe(false);
    });

    test('evaluates graph advisory route choice without target-equivalent state', () => {
        expect(GoldenTicketLayout.evaluateTaskResponse(graphShortTask('grafiekroute-kiezen'), 'tabel-naar-grafiek')).toBe(true);
        expect(GoldenTicketLayout.evaluateTaskResponse(graphShortTask('grafiekroute-kiezen'), 'grafieken-aflezen')).toBe(true);
        expect(GoldenTicketLayout.evaluateTaskResponse(graphShortTask('grafiekroute-kiezen'), 'procenten')).toBe(true);
        expect(GoldenTicketLayout.evaluateTaskResponse(graphShortTask('grafiekroute-kiezen'), 'onbekend')).toBe(false);
        expect(GoldenTicketLayout.evaluateTaskResponse(graphShortTask('grafiekroute-kiezen'), { answerId: 'tabel-naar-grafiek' })).toBe(true);
    });

    test('renders advisory short-check choice controls without graph or legacy fields', () => {
        const html = GoldenTicketLayout.renderMain(short112Data);

        expect(html).toContain('ge-workbench-advisory');
        expect(html).toContain('data-ge-choice-option');
        expect(html).toContain('data-context-block="ctx-112-short-prijs"');
        expect(html).toContain('Oefentip');
        expect(html).not.toContain('data-ge-work');
        expect(html).not.toContain('data-ge-structured-choice');
        expect(html).not.toContain('ge-locked');
    });

    test('renders the 1.1.2 A96 answer-form controls in the Golden calculation route', () => {
        const html = GoldenTicketLayout.renderMain(exit112Data);

        expect(html).toContain('data-ge-answer-form-task');
        expect(html).toContain('data-ge-formula-token-id="oldPrice"');
        expect(html).toContain('data-ge-substitution-field data-field-id="oldPriceDenominator"');
        expect(html).toContain('placeholder="vul de nieuwe prijs in"');
        expect(html).toContain('placeholder="vul de oude prijs in"');
        expect(html).toContain('placeholder="vul de basiswaarde in"');
        expect(html).not.toContain('placeholder="920"');
        expect(html).not.toContain('placeholder="800"');
        expect(html).toContain('data-input-role="unit-notation" data-ge-unit-notation');
        expect(html).toContain('data-input-role="conclusion" data-ge-conclusion');
        expect(html).toContain('data-ge-work');
    });

    test('renders graph advisory short-check controls without legacy or fake graph controls', () => {
        const html = GoldenTicketLayout.renderMain(short113Data);

        expect(html).toContain('ge-workbench-advisory');
        expect(html).toContain('data-ge-axis-option');
        expect(html).toContain('data-ge-graph-wrap');
        expect(html).toContain('data-ge-read-intervals');
        expect(html).toContain('data-ge-route-choice-option');
        expect(html).toContain('Toon oefentip');
        expect(html).toContain('Controleer grafiek en aflezing');
        expect(html).toContain('Na punt 2 verschijnt de lijn vanzelf');
        expect(html).not.toContain('Ga naar tabel naar grafiek');
        expect(html).not.toContain('data-ge-step="route-choice" data-task-id="grafiekroute-kiezen" data-task-family="table_value_selection" aria-disabled="true"');
        expect(html).not.toContain('lineConfirmationLabel');
        expect(html).not.toContain('lineShapeLabel');
        expect(html).not.toContain('Trek lijn door punten');
        expect(html).not.toContain('Lijnvorm');
        expect(html).not.toContain('id="exit-ticket-app"');
        expect(html).not.toContain('et-page');
    });

    test('rejects graph advisory data that revives fake line controls', () => {
        const data = clone(short113Data);
        const graphTask = data.tasks.find((item) => item.id === 'grafiekroute-starten').taskShell;
        graphTask.interaction.lineShapeLabel = 'Lijnvorm';

        expect(GoldenTicketLayout.supportedVariantFor(data)).toBeNull();
        expect(() => GoldenTicketLayout.renderMain(data)).toThrow(/lineShapeLabel/);
    });
});
