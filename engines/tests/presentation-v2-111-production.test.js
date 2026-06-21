const fs = require('fs');
const path = require('path');
const {
  REQUIRED_EXEMPLAR_ROLES,
  EXPECTED_HTML_SHA256,
} = require('../../build-scripts/sprints/check-golden-presentation-111');

const ROOT = path.resolve(__dirname, '..', '..', '..', '4veco-lessen');
const BOOK = path.join(ROOT, 'Boek 1 - Grondslagen, vraag en aanbod');
const PARA = path.join(
  BOOK,
  '1.1 Hoofdstuk Economisch denken en rekenen',
  '1.1.1 Schaarste en economisch denken',
);
const HTML = path.join(PARA, '1.1.1 Schaarste en economisch denken – presentatie.html');
const CSS = path.join(BOOK, 'shared', 'presentation-v2.css');
const JS = path.join(BOOK, 'shared', 'presentation-v2.js');
const MODEL = path.resolve(__dirname, '..', '..', 'build-scripts', 'content', 'book-1', 'b1-111-presentation-v2-model.js');

const exists = fs.existsSync(HTML) && fs.existsSync(CSS) && fs.existsSync(JS);
const describeOrSkip = exists ? describe : describe.skip;

describeOrSkip('§1.1.1 implemented Golden web presentation', () => {
  let html;
  let css;
  let js;
  let deck;

  beforeAll(() => {
    html = fs.readFileSync(HTML, 'utf8');
    css = fs.readFileSync(CSS, 'utf8');
    js = fs.readFileSync(JS, 'utf8');
    jest.resetModules();
    deck = require(MODEL);
  });

  test('uses the accepted eleven-slide semantic model and route roles', () => {
    expect(deck.version).toBe('presentation-v2');
    expect(deck.exemplarId).toBe('1.1.1-golden-presentation');
    expect(deck.sourceSnapshot.sha256).toBe(EXPECTED_HTML_SHA256);
    expect(deck.slides).toHaveLength(11);
    expect(new Set(deck.slides.map((slide) => slide.role))).toEqual(new Set(REQUIRED_EXEMPLAR_ROLES));
    for (const slide of deck.slides) {
      expect(slide.navTitle).toBeTruthy();
      expect(slide.assertion).toBeTruthy();
      expect(slide.action).toBeTruthy();
      expect(slide.speakerNotes.label).toBe('Studentgerichte uitleg');
      expect(slide.speakerNotes.student.length).toBeGreaterThan(0);
    }
    expect(JSON.stringify(deck)).not.toMatch(/prototype/i);
  });

  test('production HTML replaces the legacy converter surface', () => {
    expect(html).toMatch(/data-layout="presentation-v2"/);
    expect(html).not.toMatch(/data-layout="presentatie-v1"/);
    expect(html).not.toMatch(/slide-card|slide-option-grid|slide-pseudotable/);
    const slides = [...html.matchAll(/data-pv2-slide="(\d+)"/g)].map((match) => Number(match[1]));
    expect(slides).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    for (const role of REQUIRED_EXEMPLAR_ROLES) {
      expect(html).toContain(`data-route-role="${role}"`);
    }
  });

  test('student notes, provenance, and controls are explicit', () => {
    expect(html).toContain(`presentation-source-sha256" content="${EXPECTED_HTML_SHA256}"`);
    expect(html).toMatch(/data-pv2-notes aria-pressed="false" aria-expanded="false"[^>]*>Studentgerichte uitleg<\/button>/);
    expect(html).toMatch(/<summary>Studentgerichte uitleg<\/summary>/);
    expect(html).toMatch(/<h3>Studentuitleg<\/h3>/);
    expect(html).toMatch(/<h3>Docentcue<\/h3>/);
    expect(html).toMatch(/<h3>Overgang<\/h3>/);
    expect(html).not.toMatch(/Speaker notes|Docentmodus|Studentmodus|NavTitle:/);
  });

  test('accepted route content survives rendering', () => {
    for (const text of [
      'Vandaag leer je waarom kiezen kost',
      'Lisa heeft €20, maar wil voor €27',
      'Schaarste betekent: behoeften &gt; middelen',
      'Alternatieve kosten zijn het beste dat je laat liggen',
      'De boer: eerst beide alternatieven berekenen',
      'Nettowaarde: €5.000 − €3.500 = €1.500.',
      'Lisa kiest bioscoop. Wat is het schaarse middel?',
      'De boer kiest tarwe. Wat zijn de alternatieve kosten?',
      'De opbrengst van maïs: €3.500.',
    ]) {
      expect(html).toContain(text);
    }
  });

  test('renderer emits the new visual structures needed by the Golden route', () => {
    for (const marker of [
      'pv2-route-contract',
      'pv2-narrative-grid',
      'pv2-relation',
      'pv2-transfer-grid',
      'pv2-misconception-grid',
      'pv2-worked-grid',
      'pv2-equation',
      'pv2-check-grid',
      'pv2-summary-list',
    ]) {
      expect(html).toContain(marker);
      expect(css).toContain(marker);
    }
  });

  test('keyboard, focus, dark mode, notes, and fullscreen runtime hooks are present', () => {
    expect(js).toMatch(/event\.key === 'Home'/);
    expect(js).toMatch(/event\.key === 'End'/);
    expect(js).toMatch(/focusTarget\.focus/);
    expect(js).toMatch(/data-open-label/);
    expect(html).toMatch(/data-pv2-theme aria-pressed="false">Dark mode<\/button>/);
    expect(html).toMatch(/data-pv2-fullscreen aria-pressed="false">Full screen<\/button>/);
    expect(css).toMatch(/html\[data-theme="dark"\]/);
  });

  test('CSS preserves widescreen canvas and notes side rail without body overflow hiding', () => {
    expect(css).toMatch(/--pv2-slide-ratio:\s*16 \/ 9/);
    expect(css).toMatch(/aspect-ratio:\s*var\(--pv2-slide-ratio\)/);
    expect(css).toMatch(/pv2-speaker-notes-open[\s\S]{0,1200}grid-template-columns:\s*minmax\(0, 1fr\) var\(--pv2-notes-width\)/);
    expect(css).not.toMatch(/body\[data-layout="presentation-v2"\][\s\S]{0,500}overflow-x:\s*hidden/);
    expect(css).not.toMatch(/\.pv2-slide\s*\{[\s\S]{0,500}overflow:\s*(hidden|clip)/);
  });
});
