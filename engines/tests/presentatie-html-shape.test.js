/**
 * Regression test for L1.5D D2 (PPTX-as-web): the deployed §1.1.1
 * presentatie.html must be a 9-slide, semantically-structured surface
 * with meaningful image alt-text and structured speaker-notes.
 *
 * Skips cleanly when the HTML file is not deployed yet (matches the
 * companion-alt-text-meaningful test pattern).
 */

const fs = require('fs');
const path = require('path');

const FILE = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '4veco-lessen',
    'Boek 1 - Grondslagen, vraag en aanbod',
    '1.1 Hoofdstuk Economisch denken en rekenen',
    '1.1.1 Schaarste en economisch denken',
    '1.1.1 Schaarste en economisch denken – presentatie.html'
);

const exists = fs.existsSync(FILE);
const describeOrSkip = exists ? describe : describe.skip;

describeOrSkip('§1.1.1 presentatie.html (L1.5D D2)', () => {
    let html;
    beforeAll(() => {
        html = fs.readFileSync(FILE, 'utf8');
    });

    test('renders 9 slides as <section class="slide" id="slide-N">', () => {
        const sections = [...html.matchAll(/<section class="slide [^"]+" id="slide-(\d+)"/g)];
        expect(sections).toHaveLength(9);
        const ids = sections.map(m => parseInt(m[1], 10));
        expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('every <img> inside a .slide-figure has a meaningful alt', () => {
        // Match img tags inside <figure class="slide-figure">…</figure>.
        const figures = [...html.matchAll(
            /<figure class="slide-figure">[\s\S]*?<\/figure>/g
        )].map(m => m[0]);
        expect(figures.length).toBeGreaterThanOrEqual(4);
        for (const fig of figures) {
            const altMatch = fig.match(/\balt="([^"]*)"/);
            expect(altMatch).not.toBeNull();
            const alt = altMatch[1];
            expect(alt.length).toBeGreaterThanOrEqual(10);
            expect(alt).toMatch(/\s/);
            // No filename / asset-id-shaped alt.
            expect(alt).not.toMatch(/^1\.\d+\.\d+_/);
        }
    });

    test('every slide carries a <details class="slide-notes"> block', () => {
        const slideBodies = [...html.matchAll(
            /<section class="slide [\s\S]*?<\/section>/g
        )].map(m => m[0]);
        expect(slideBodies).toHaveLength(9);
        for (const body of slideBodies) {
            expect(body).toMatch(/<details class="slide-notes">/);
        }
    });

    test('canonical speaker-notes parsed into Vraag/Uitleg/Pitfall/Overgang dl', () => {
        const lists = [...html.matchAll(/<dl class="slide-notes-list">[\s\S]*?<\/dl>/g)]
            .map(m => m[0]);
        // §1.1.1 ships canonical notes on every slide.
        expect(lists.length).toBeGreaterThanOrEqual(9);
        for (const dl of lists) {
            for (const key of ['Vraag', 'Uitleg', 'Pitfall', 'Overgang']) {
                expect(dl).toMatch(
                    new RegExp(`<dt class="slide-notes-key">${key}</dt>`)
                );
            }
        }
    });

    test('slide 5 detects the 4-step card stack', () => {
        const slide5 = html.match(
            /<section class="slide [^"]+" id="slide-5"[\s\S]*?<\/section>/
        );
        expect(slide5).not.toBeNull();
        expect(slide5[0]).toMatch(/<div class="slide-cards">/);
        const cardNums = [...slide5[0].matchAll(/<span class="card-num">(\d{2})<\/span>/g)]
            .map(m => m[1]);
        expect(cardNums).toEqual(['01', '02', '03', '04']);
    });

    test('sidebar uses explicit semantic nav labels instead of prominent numbers', () => {
        expect(html).toMatch(/data-slide-link="2"[\s\S]{0,120}<span class="nav-title">Lisa moet kiezen<\/span>/);
        expect(html).toMatch(/data-slide-link="7"[\s\S]{0,140}<span class="nav-title">Alternatieve kosten boer<\/span>/);
        expect(html).not.toMatch(/<span class="nav-title">€12<\/span>/);
        expect(html).not.toMatch(/<span class="nav-title">€3\.500<\/span>/);
    });

    test('slide 2 preserves the A/B option pairing as semantic option cards', () => {
        const slide2 = html.match(
            /<section class="slide [^"]+" id="slide-2"[\s\S]*?<\/section>/
        );
        expect(slide2).not.toBeNull();
        expect(slide2[0]).toMatch(/<div class="slide-option-grid" role="list">/);
        expect(slide2[0]).toMatch(/<article class="slide-option-card" role="listitem">[\s\S]*<p class="option-label">Optie A<\/p>[\s\S]*<h3 class="option-title">Bioscoop<\/h3>[\s\S]*<p class="option-value">€12<\/p>/);
        expect(slide2[0]).toMatch(/<p class="option-label">Optie B<\/p>[\s\S]*<h3 class="option-title">Nieuw boek<\/h3>[\s\S]*<p class="option-value">€15<\/p>/);
    });

    test('teacher notes mode is explicit and nav metadata is not displayed as notes', () => {
        expect(html).toMatch(/data-notes-toggle aria-pressed="false">Toon alle sprekersnotities<\/button>/);
        expect(html).toMatch(/Verberg alle sprekersnotities/);
        expect(html).not.toMatch(/NavTitle:/);
    });

    test('slide 6 detects the tarwe/maïs pseudo-table with header', () => {
        const slide6 = html.match(
            /<section class="slide [^"]+" id="slide-6"[\s\S]*?<\/section>/
        );
        expect(slide6).not.toBeNull();
        expect(slide6[0]).toMatch(/<table class="slide-pseudotable">/);
        expect(slide6[0]).toMatch(/<thead>[\s\S]*<th>GEWAS<\/th>/);
        expect(slide6[0]).toMatch(/<td>Tarwe<\/td>/);
        expect(slide6[0]).toMatch(/<td>Maïs<\/td>/);
    });

    test('dark/light master classification: 3 dark, 6 light', () => {
        const darkCount = (html.match(/class="slide slide--dark"/g) || []).length;
        const lightCount = (html.match(/class="slide slide--light"/g) || []).length;
        expect(darkCount).toBe(3);
        expect(lightCount).toBe(6);
    });
});
