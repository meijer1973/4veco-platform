/**
 * Regression test for L1.5V Bucket A4: every embedded asset image in deployed
 * §1.1.1 companion HTML must carry a meaningful alt-text — not a filename
 * or asset id.
 *
 * The voorkennis review (1.1.1-companion-visual-review.md, HF-4) flagged
 * `alt="1.1.1_ex_1"` (filename / asset-id-shaped) as a hard fail. The fix
 * routes meaningful Dutch alt-text through `b1-111-alt-text.js` → builders →
 * docx descr (`asset-alt:` prefix) → converter → HTML alt.
 *
 * This test asserts: for every <img> inside an asset-figure on the deployed
 * voorkennis / vaardigheden / samenvatting / begeleide-inoefening HTML, the
 * `alt` attribute is at least 10 chars, contains a space, and does NOT
 * match the asset-id pattern. Skips cleanly when the HTML files aren't
 * deployed yet.
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
    {
        label: 'voorkennis',
        file: '1.1.1 Schaarste en economisch denken – uitleg voorkennis.html',
        minImgs: 1,
    },
    {
        label: 'vaardigheden',
        file: '1.1.1 Schaarste en economisch denken – uitleg vaardigheden.html',
        minImgs: 4,
    },
    {
        label: 'samenvatting',
        file: '1.1.1 Schaarste en economisch denken – samenvatting.html',
        minImgs: 4,
    },
    {
        label: 'begeleide inoefening',
        file: '1.1.1 Schaarste en economisch denken – begeleide inoefening.html',
        minImgs: 3,
    },
];

// Asset-id-shaped alt strings the test rejects: 1.1.1_fig_1, 1.1.1_ex_1,
// 1.1.1_we_1, 1.1.1_news_woningtekort, etc. Allow internal _light/_dark
// suffixes etc. — the rule is "no asset-id-shaped alt".
const ASSET_ID_RE = /^1\.\d+\.\d+_(fig|ex|we|mc|news)[A-Za-z0-9_-]*$/;

for (const fx of FIXTURES) {
    const filePath = path.join(PARA_DIR, fx.file);
    const exists = fs.existsSync(filePath);
    const describeOrSkip = exists ? describe : describe.skip;

    describeOrSkip(`alt-text on §1.1.1 ${fx.label}`, () => {
        let html;
        beforeAll(() => {
            html = fs.readFileSync(filePath, 'utf8');
        });

        test(`every asset-figure <img> has a meaningful alt`, () => {
            // Match <img ... alt="..." ...> tags inside the same line. The
            // asset-figure scope is enforced by selecting only those <img>
            // tags whose class includes "asset-svg" (set by all four
            // converters' render_asset_image()).
            const imgs = [...html.matchAll(/<img\b[^>]*\bclass="asset-svg"[^>]*>/g)]
                .map(m => m[0]);
            expect(imgs.length).toBeGreaterThanOrEqual(fx.minImgs);
            for (const tag of imgs) {
                const altMatch = tag.match(/\balt="([^"]*)"/);
                expect(altMatch).not.toBeNull();
                const alt = altMatch[1];
                expect(alt.length).toBeGreaterThanOrEqual(10);
                expect(alt).toMatch(/\s/);
                expect(alt).not.toMatch(ASSET_ID_RE);
            }
        });
    });
}
