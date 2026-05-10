/**
 * Regression test for L1.5V Bucket A3: voorkennis checklist must end with a
 * next-step routing block, never a bare checklist.
 *
 * The voorkennis review (1.1.1-companion-visual-review.md, HF-3) flagged that
 * the checklist had no next-step routing — a diagnostic block with no
 * consequence after completion. The econ-companion-artifacts skill requires
 * a "Wat nu?" routing block after every checklist.
 *
 * This test asserts that the §1.1.1 voorkennis HTML, when present, contains
 * a checklist-route block with at least one anchor link inside route-yes
 * AND inside route-no. Skips cleanly if the file isn't deployed yet (e.g.
 * fresh repo before deploy.js has run).
 */

const fs = require('fs');
const path = require('path');

const HTML = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '4veco-lessen',
    'Boek 1 - Grondslagen, vraag en aanbod',
    '1.1 Hoofdstuk Economisch denken en rekenen',
    '1.1.1 Schaarste en economisch denken',
    '1.1.1 Schaarste en economisch denken – uitleg voorkennis.html'
);

const fileExists = fs.existsSync(HTML);
const describeOrSkip = fileExists ? describe : describe.skip;

describeOrSkip('voorkennis checklist routing block (1.1.1)', () => {
    let html;
    beforeAll(() => {
        html = fs.readFileSync(HTML, 'utf8');
    });

    test('checklist section closes with a checklist-route block', () => {
        expect(html).toMatch(/<div class="checklist-route">/);
        expect(html).toMatch(/<h3 class="route-title">Wat nu\?<\/h3>/);
    });

    test('route-yes line has at least one anchor', () => {
        const m = html.match(/<p class="route-line route-yes">([\s\S]*?)<\/p>/);
        expect(m).not.toBeNull();
        expect(m[1]).toMatch(/<a href="[^"]+"[^>]*>/);
    });

    test('route-no line has at least one anchor', () => {
        const m = html.match(/<p class="route-line route-no">([\s\S]*?)<\/p>/);
        expect(m).not.toBeNull();
        expect(m[1]).toMatch(/<a href="[^"]+"[^>]*>/);
    });

    test('route block sits inside the checklist-section, after the items', () => {
        const cs = html.match(/<div class="checklist-section">[\s\S]*?<\/div>\s*<\/main>/);
        expect(cs).not.toBeNull();
        const block = cs[0];
        const itemsIdx = block.lastIndexOf('class="checklist-item"');
        const routeIdx = block.indexOf('class="checklist-route"');
        expect(routeIdx).toBeGreaterThan(itemsIdx);
    });
});
