/**
 * Regression test for L1.5V Bucket C6: deployed §1.1.1 companion HTML must
 * use canonical Dutch economics terminology consistently.
 *
 * Forbidden tokens in rendered HTML text content (NOT in alt-text or
 * visual SVG content embedded inside an <img>):
 *   - "Mais" (capitalised, no diaeresis) → must be "maïs"
 *   - "alt. kosten" (ad-hoc shortening) → must be "alternatieve kosten"
 *   - "opportunity costs" / "opportuniteitskosten" → must be "alternatieve
 *      kosten" (exception: explicit pedagogical "vermijd dit"-blocks where
 *      the forbidden term is named in order to be rejected; the test
 *      filters those out via the surrounding "vermijd"/"niet" markers)
 *
 * The two visual SVG generators (b1-111-visual-variants.js fig_3 + we_1)
 * use the shorthand "alt. kosten" inside size-constrained step cards and
 * bar-chart badges. Those tokens live in `_assets/*.svg` files referenced
 * by the HTML as <img src=...>; this test only inspects HTML text content.
 *
 * Skips cleanly if the HTML files aren't deployed.
 */

const fs = require('fs');
const path = require('path');

const PARA_DIR = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '4veco-lessen',
    'Boek 1 - Grondslagen, vraag en aanbod',
    '1.1 Hoofdstuk Economisch denken en rekenen',
    '1.1.1 Schaarste en economisch denken'
);

const FIXTURES = [
    '1.1.1 Schaarste en economisch denken – uitleg voorkennis.html',
    '1.1.1 Schaarste en economisch denken – uitleg vaardigheden.html',
    '1.1.1 Schaarste en economisch denken – samenvatting.html',
    '1.1.1 Schaarste en economisch denken – begeleide inoefening.html',
];

/** Strip <script>, <style>, and HTML tag content; leave only the rendered
 * text the student would read. Keep a safety strip on common asset-id
 * shaped attributes. */
function visibleText(html) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        // Drop attribute values entirely so we don't double-count alt-text
        // strings (those have their own dedicated test).
        .replace(/\s[a-zA-Z-]+="[^"]*"/g, '')
        .replace(/<[^>]+>/g, ' ');
}

for (const fxFile of FIXTURES) {
    const filePath = path.join(PARA_DIR, fxFile);
    const exists = fs.existsSync(filePath);
    const describeOrSkip = exists ? describe : describe.skip;

    describeOrSkip(`terminology in ${fxFile}`, () => {
        let visible;
        beforeAll(() => {
            visible = visibleText(fs.readFileSync(filePath, 'utf8'));
        });

        test('no capitalised "Mais" without diaeresis', () => {
            // "maïs" is correct; "Mais" (no diaeresis, capitalised) is the
            // forbidden form. Use word-boundary + explicit absence of ï.
            const matches = visible.match(/\bMais\b/g) || [];
            expect(matches).toEqual([]);
        });

        test('no ad-hoc "alt. kosten" / "Alt. kosten" shortening', () => {
            const matches = visible.match(/\b[Aa]lt\.\s*kosten\b/g) || [];
            expect(matches).toEqual([]);
        });

        test('no English "opportunity costs" except in explicit do-not-use blocks', () => {
            // Allow occurrences only inside "Opportunity costs ... vermijd"
            // / "niet" guidance blocks. Filter out lines that contain both
            // the forbidden token AND a rejection marker within the same
            // ~120 character window.
            const idxs = [];
            let i = visible.toLowerCase().indexOf('opportunity costs');
            while (i >= 0) {
                idxs.push(i);
                i = visible.toLowerCase().indexOf('opportunity costs', i + 1);
            }
            const offending = idxs.filter(idx => {
                const window = visible.slice(Math.max(0, idx - 100), idx + 120).toLowerCase();
                return !/(vermijd|niet|niet \"|do not|geen)/.test(window);
            });
            expect(offending).toEqual([]);
        });

        test('no "opportuniteitskosten" except in explicit do-not-use blocks', () => {
            const idxs = [];
            let i = visible.toLowerCase().indexOf('opportuniteitskosten');
            while (i >= 0) {
                idxs.push(i);
                i = visible.toLowerCase().indexOf('opportuniteitskosten', i + 1);
            }
            const offending = idxs.filter(idx => {
                const window = visible.slice(Math.max(0, idx - 100), idx + 120).toLowerCase();
                return !/(vermijd|niet|geen)/.test(window);
            });
            expect(offending).toEqual([]);
        });
    });
}
