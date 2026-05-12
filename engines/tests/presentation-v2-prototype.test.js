const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..', '4veco-lessen');
const PARA = path.join(
  ROOT,
  'Boek 1 - Grondslagen, vraag en aanbod',
  '1.1 Hoofdstuk Economisch denken en rekenen',
  '1.1.1 Schaarste en economisch denken',
);
const HTML = path.join(PARA, '1.1.1 Schaarste en economisch denken – presentatie-v2-prototype.html');
const CSS = path.join(ROOT, 'Boek 1 - Grondslagen, vraag en aanbod', 'shared', 'presentation-v2.css');
const MODEL = path.resolve(__dirname, '..', '..', 'build-scripts', 'content', 'book-1', 'b1-111-presentation-v2-model.js');

const exists = fs.existsSync(HTML) && fs.existsSync(CSS);
const describeOrSkip = exists ? describe : describe.skip;

describeOrSkip('presentation-v2 prototype', () => {
  let html;
  let css;
  let deck;

  beforeAll(() => {
    html = fs.readFileSync(HTML, 'utf8');
    css = fs.readFileSync(CSS, 'utf8');
    deck = require(MODEL);
  });

  test('uses a semantic source model with three prototype slides', () => {
    expect(deck.version).toBe('presentation-v2-prototype');
    expect(deck.slides.map((slide) => slide.layout)).toEqual([
      'choiceTensionCover',
      'choiceComparison',
      'procedureRoute',
    ]);
    for (const slide of deck.slides) {
      expect(slide.navTitle).toBeTruthy();
      expect(slide.speakerNotes.script).toEqual(expect.any(Array));
      expect(slide.speakerNotes.script.join(' ')).toMatch(/Lisa|schaarste|kiezen|alternatieve kosten/i);
    }
    expect(JSON.stringify(deck.slides)).not.toMatch(/B02/);
  });

  test('HTML is presentation-v2, not the legacy PPTX inference surface', () => {
    expect(html).toMatch(/data-layout="presentation-v2"/);
    expect(html).not.toMatch(/data-layout="presentatie-v1"/);
    expect(html).not.toMatch(/class="slide /);
    expect(html).not.toMatch(/slide-card|slide-option-grid|slide-pseudotable/);
    const slides = [...html.matchAll(/data-pv2-slide="(\d+)"/g)].map((match) => Number(match[1]));
    expect(slides).toEqual([1, 2, 3]);
  });

  test('navigation, speaker notes, and fullscreen controls are explicit', () => {
    expect(html).toMatch(/data-pv2-link="2"[\s\S]{0,100}Lisa moet kiezen/);
    expect(html).toMatch(/data-pv2-link="3"[\s\S]{0,100}Alternatieve kosten/);
    expect(html).toMatch(/data-pv2-notes aria-pressed="false" aria-expanded="false">Speaker notes<\/button>/);
    expect(html).toMatch(/data-pv2-theme aria-pressed="false">Dark mode<\/button>/);
    expect(html).toMatch(/data-pv2-fullscreen aria-pressed="false">Full screen<\/button>/);
    expect(html).toMatch(/<summary>Speaker notes<\/summary>/);
    expect(html).not.toMatch(/Docentmodus|Studentmodus|Docententoelichting|B02/);
  });

  test('slide canvas prefers widescreen and speaker notes can use a side rail', () => {
    expect(html).toMatch(/class="pv2-slide-canvas"/);
    expect(css).toMatch(/--pv2-slide-ratio:\s*16 \/ 9/);
    expect(css).toMatch(/aspect-ratio:\s*var\(--pv2-slide-ratio\)/);
    expect(css).toMatch(/pv2-speaker-notes-open[\s\S]{0,1200}grid-template-columns:\s*minmax\(0, 1fr\) var\(--pv2-notes-width\)/);
    expect(css).toMatch(/max-width:\s*min\(94vw, 150vh\)/);
  });

  test('dark mode is available as a first-class presentation theme', () => {
    expect(html).toMatch(/<html lang="nl" data-theme="light">/);
    expect(html).toMatch(/localStorage\.getItem\('quizMode'\)/);
    expect(css).toMatch(/html\[data-theme="dark"\]/);
    expect(css).toMatch(/prefers-color-scheme:\s*dark/);
    expect(css).toMatch(/--pv2-slide-bg:/);
    expect(css).toMatch(/--pv2-note-bg:/);
    expect(css).toMatch(/--pv2-primary-bg:/);
    expect(css).toMatch(/Space Grotesk/);
    expect(css).toMatch(/Fraunces/);
  });

  test('choice and procedure semantics survive in HTML', () => {
    expect(html).toMatch(/class="pv2-choice-lanes" role="list" aria-label="Keuzeopties"/);
    expect(html).toMatch(/Optie A[\s\S]*Bioscoop[\s\S]*€12/);
    expect(html).toMatch(/Optie B[\s\S]*Nieuw boek[\s\S]*€15/);
    expect(html).toMatch(/<ol class="pv2-route" aria-label="Alternatieve kosten in een keuze-situatie in vier stappen">/);
    for (const label of ['Benoem alternatieven', 'Bereken opbrengsten', 'Rangschik', 'Bereken nettowaarde']) {
      expect(html).toContain(label);
    }
  });

  test('speaker notes render narration-ready teacher explanation text', () => {
    const notes = [...html.matchAll(/<div class="pv2-speaker-script">([\s\S]*?)<\/div>/g)].map((match) => match[1]);
    expect(notes).toHaveLength(3);
    for (const note of notes) {
      expect((note.match(/<p>/g) || []).length).toBeGreaterThanOrEqual(2);
      expect(note).toMatch(/Lisa|schaarste|alternatieve kosten|nettowaarde|kiezen/i);
    }
    expect(html).toMatch(/data-pv2-speaker-text/);
  });

  test('CSS does not hide body/slide overflow as a mobile crutch', () => {
    expect(css).not.toMatch(/body\[data-layout="presentation-v2"\][\s\S]{0,500}overflow-x:\s*hidden/);
    expect(css).not.toMatch(/\.pv2-slide\s*\{[\s\S]{0,500}overflow:\s*(hidden|clip)/);
  });
});
