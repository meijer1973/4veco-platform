/**
 * Regression test for L1.5V Bucket B2: §1.1.1 fig_3 (Economisch denken in
 * stappen) MUST show the canonical 4-step B02 procedure across every surface
 * variant — not the legacy 3-step form.
 *
 * Reads the deployed `_assets/1.1.1_fig_3_<surface>.svg` files. Skips cleanly
 * when assets aren't deployed (e.g. fresh repo before b1-111-visual-variants
 * has run).
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '4veco-lessen',
    'Boek 1 - Grondslagen, vraag en aanbod',
    '1.1 Hoofdstuk Economisch denken en rekenen',
    '1.1.1 Schaarste en economisch denken',
    '_assets'
);

const SURFACES = ['base', 'doc', 'slide', 'summary', 'web_light', 'web_dark'];

for (const surface of SURFACES) {
    const svgPath = surface === 'base'
        ? path.join(ASSETS_DIR, '1.1.1_fig_3.svg')
        : path.join(ASSETS_DIR, `1.1.1_fig_3_${surface}.svg`);
    const exists = fs.existsSync(svgPath);
    const describeOrSkip = exists ? describe : describe.skip;

    describeOrSkip(`fig_3 / ${surface}`, () => {
        let svg;
        beforeAll(() => {
            svg = fs.readFileSync(svgPath, 'utf8');
        });

        test('subtitle/title text never says drie stappen', () => {
            // The shared visual frame intentionally suppresses title + subtitle
            // text on the `slide` surface (the host slide carries its own
            // title chrome). On every other surface, the canonical title must
            // mention "vier stappen". Both surfaces must NEVER emit the
            // legacy "drie stappen" string.
            expect(svg).not.toMatch(/drie stappen/i);
            if (surface !== 'slide') {
                expect(svg).toMatch(/vier stappen/i);
            }
        });

        test('shows step badges 1, 2, 3, 4 (never 5)', () => {
            // Step badge text emits as `>1</text>`, `>2</text>`, etc.
            const matches = (svg.match(/>([1-9])<\/text>/g) || []).map(m => m.match(/>(\d)</)[1]);
            expect(matches).toEqual(expect.arrayContaining(['1', '2', '3', '4']));
            expect(matches).not.toContain('5');
        });

        test('mentions canonical step labels and not legacy ones', () => {
            expect(svg).toMatch(/Alternatieven/);
            expect(svg).toMatch(/Opbrengsten/);
            expect(svg).toMatch(/Rangschik/);
            expect(svg).toMatch(/Nettowaarde/);
            expect(svg).not.toMatch(/Opgeven/); // legacy 3-step third card label
        });
    });
}
