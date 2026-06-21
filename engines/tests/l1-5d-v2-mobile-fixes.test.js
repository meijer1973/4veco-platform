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

    test('active §1.1.1 presentation route is no longer the legacy converter surface', () => {
        expect(html).toMatch(/data-layout="presentation-v2"/);
        expect(html).not.toMatch(/data-layout="presentatie-v1"/);
        expect(html).not.toMatch(/slide-pseudotable|slide-option-grid|slide-notes-list/);
    });

    test('procedure and worked-example content remains explicit in the new route', () => {
        expect(html).toContain('Schaars middel');
        expect(html).toContain('Opbrengsten');
        expect(html).toContain('Tarwe');
        expect(html).toContain('Maïs');
        expect(html).toContain('€3.500');
    });
});
