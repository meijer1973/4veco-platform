const GoldenTicketLayout = require('../golden-ticket-layout');
const exit112Data = require('../../source-data/book-1/exit-ticket/1.1.2-exit-ticket.json');
const exit113Data = require('../../source-data/book-1/exit-ticket/1.1.3-exit-ticket.json');

function task(id) {
    return exit112Data.tasks.find((item) => item.id === id).taskShell;
}

describe('GoldenTicketLayout', () => {
    test('selects supported variants by capability shape', () => {
        expect(GoldenTicketLayout.supportedVariantFor(exit113Data)).toBe('golden_graph_reading_claim_v1');
        expect(GoldenTicketLayout.supportedVariantFor(exit112Data)).toBe('golden_calculation_structured_v1');
        expect(GoldenTicketLayout.rendererAssetsForVariant('golden_calculation_structured_v1').scripts).toEqual([
            'exit-ticket/{sourceKey}.js',
            'golden-ticket-layout.js',
        ]);
    });

    test('evaluates 1.1.2 calculation and structured responses without legacy task-shell UI', () => {
        expect(GoldenTicketLayout.evaluateTaskResponse(task('prijsstijging-procent'), {
            work: '(920 - 800) / 800 x 100',
            finalAnswer: '15%',
            unitNotation: '%',
        })).toBe(true);

        expect(GoldenTicketLayout.evaluateTaskResponse(task('prijsstijging-procent'), {
            work: 'ik gok',
            finalAnswer: '15%',
            unitNotation: '%',
        })).toBe(false);

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
});
