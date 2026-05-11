/**
 * Regression test for the L1.5D v2 sprint-review fixes (B1+B2 mobile
 * responsive + B7 caption heuristic + B8 PPTX accessibility).
 *
 * This is a content/selector-presence sanity check, not a real-browser
 * overflow test. It catches the "someone stripped the responsive
 * rules" or "someone reverted the converter heuristic" regression
 * class cheaply. A genuine 390px overflow assertion requires a
 * headless browser (chrome / playwright) and is out of scope here.
 *
 * Skips cleanly when the deployed lessen artifacts are absent.
 */

const fs = require('fs');
const path = require('path');

const LESSEN_BOOK = path.resolve(
    __dirname, '..', '..', '..',
    '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod'
);
const SHARED_CSS = path.join(LESSEN_BOOK, 'shared', 'voorkennis.css');
const PARA_DIR = path.join(
    LESSEN_BOOK,
    '1.1 Hoofdstuk Economisch denken en rekenen',
    '1.1.1 Schaarste en economisch denken'
);
const PRESENTATIE_HTML = path.join(
    PARA_DIR, '1.1.1 Schaarste en economisch denken – presentatie.html'
);

const cssExists = fs.existsSync(SHARED_CSS);
const htmlExists = fs.existsSync(PRESENTATIE_HTML);

(cssExists ? describe : describe.skip)('L1.5D v2 B1+B2 — mobile responsive CSS', () => {
    let css;
    beforeAll(() => { css = fs.readFileSync(SHARED_CSS, 'utf8'); });

    test('shrink-failure prevention rule on all three layouts', () => {
        // min-width: 0 on grid descendants — without this, long strings
        // (URLs, large numerals) block flex/grid wrap.
        expect(css).toMatch(/presentatie-grid \*[\s,]*[\s\S]*?min-width: 0/);
        expect(css).toMatch(/samenvatting-grid \*[\s,]*[\s\S]*?min-width: 0/);
        expect(css).toMatch(/nieuws-grid \*[\s,]*[\s\S]*?min-width: 0/);
    });

    test('samenvatting grid collapses to 1fr at 600px', () => {
        // The unconditional minmax(360px, 1fr) above 600px forced
        // overflow on 390px viewports. The narrow-viewport override
        // must collapse to a single column.
        expect(css).toMatch(/samenvatting-v1"\] \.samenvatting-grid \{[\s\S]{0,500}grid-template-columns: 1fr/);
    });

    test('presentatie-v1 has a 420px narrow-phone breakpoint', () => {
        expect(css).toMatch(/@media \(max-width: 420px\)[\s\S]{0,200}presentatie-v1/);
    });

    test('slide-controls wraps + buttons shrink on mobile', () => {
        // The Vorige / counter / Volgende row used to overflow at
        // 390px because of flex-nowrap and min-width: 7rem on buttons.
        expect(css).toMatch(/presentatie-v1[\s\S]*slide-controls[\s\S]{0,200}flex-wrap: wrap/);
    });

    test('hero h1 wrap rules apply to all three layouts', () => {
        // "Schaarste en economisch denken — Presentatie" used to clip
        // past the right edge because the em-dash + long suffix didn't
        // wrap. overflow-wrap: anywhere on the .hero h1 fixes it.
        expect(css).toMatch(/presentatie-v1[^,]*?\.hero h1,[\s\S]{0,400}overflow-wrap: anywhere/);
    });

    test('body overflow-x: hidden safety net at narrow viewports', () => {
        // The narrow-viewport safety net is inside an @media
        // (max-width: 600px) block. Anchor on the `.content {
        // overflow-x: hidden }` rule that the fix introduced.
        expect(css).toMatch(/body\[data-layout="nieuws-v1"\] \.content[\s\S]{0,80}overflow-x: hidden/);
    });

    test('slide-pseudotable scrolls horizontally instead of overflowing', () => {
        expect(css).toMatch(/slide-pseudotable\s*\{[\s\S]{0,300}overflow-x: auto/);
    });
});

(htmlExists ? describe : describe.skip)('L1.5D v2 B7 — Figuur 3 caption out of card 4 subtitle', () => {
    let html;
    beforeAll(() => { html = fs.readFileSync(PRESENTATIE_HTML, 'utf8'); });

    test('slide 5 card 04 subtitle is "Opbrengst − alternatieve kosten." only', () => {
        // Pre-B7 the card 4 subtitle absorbed the side-by-side
        // "Figuur 3 · het keuzeproces in vier stappen" caption,
        // producing a polluted subtitle. Post-B7 the subtitle is just
        // the canonical step description.
        const slide5 = html.match(
            /<section class="slide [^"]+" id="slide-5"[\s\S]*?<\/section>/
        );
        expect(slide5).not.toBeNull();
        const card4 = slide5[0].match(
            /<span class="card-num">04<\/span>[\s\S]*?<\/div>\s*<\/div>/
        );
        expect(card4).not.toBeNull();
        expect(card4[0]).toMatch(/<p class="card-subtitle">Opbrengst[^<]*alternatieve kosten\.<\/p>/);
        expect(card4[0]).not.toMatch(/Figuur 3/);
    });

    test('"Figuur 3" caption renders as its own slide-body paragraph', () => {
        // The caption is now a separate body paragraph between the
        // card stack and the figure.
        expect(html).toMatch(/<p class="slide-text">Figuur 3 · het keuzeproces in vier stappen<\/p>/);
    });
});
