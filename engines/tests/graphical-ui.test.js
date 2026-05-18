/**
 * Source-level safeguards for the graphical-game UI.
 */
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'graphical-ui.js'), 'utf8');

describe('graphical ui safeguards', () => {
    test('answer placeholders do not reveal expected answers', () => {
        expect(source).not.toMatch(/placeholder="[^"]*expected_answer\.value/);
        expect(source).not.toContain('placeholder="Bijvoorbeeld \' + escapeHtml(formatNumber(challenge.expected_answer.value)) + \'"');
        expect(source).toContain('placeholder="Typ je antwoord"');
        expect(source).toContain('placeholder="Typ je percentage"');
    });

    test('percentage challenges require explicit old and new value selection', () => {
        expect(source).toContain('Kies oude waarde');
        expect(source).toContain('Kies nieuwe waarde');
        expect(source).toContain('id="g-old-label" required');
        expect(source).toContain('id="g-new-label" required');
        expect(source).not.toContain('document.getElementById("g-old-label").value = challenge.graph.series[0].label');
        expect(source).not.toContain('document.getElementById("g-new-label").value = challenge.graph.series[challenge.graph.series.length - 1].label');
    });

    test('final challenge feedback renders before the summary screen', () => {
        expect(source).toContain('if (engine.isComplete() && !lastResult)');
        expect(source).not.toContain('if (engine.isComplete()) {');
        expect(source).toContain("engine.index === data.challenges.length - 1 ? 'Bekijk resultaat'");
    });
});
