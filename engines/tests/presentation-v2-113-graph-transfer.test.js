const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..', '4veco-lessen');
const BOOK = path.join(ROOT, 'Boek 1 - Grondslagen, vraag en aanbod');
const PARA = path.join(
  BOOK,
  '1.1 Hoofdstuk Economisch denken en rekenen',
  '1.1.3 Grafieken en tabellen',
);
const HTML = path.join(PARA, '1.1.3 Grafieken en tabellen \u2013 presentatie.html');
const CSS = path.join(BOOK, 'shared', 'presentation-v2.css');
const JS = path.join(BOOK, 'shared', 'presentation-v2.js');
const MODEL = path.resolve(__dirname, '..', '..', 'build-scripts', 'content', 'book-1', 'b1-113-presentation-v2-model.js');

const exists = fs.existsSync(HTML) && fs.existsSync(CSS) && fs.existsSync(JS);
const describeOrSkip = exists ? describe : describe.skip;

describeOrSkip('section 1.1.3 graph/table web presentation transfer', () => {
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

  test('uses a standalone semantic presentation-v2 graph transfer deck', () => {
    expect(deck.version).toBe('presentation-v2');
    expect(deck.exemplarId).toBe('1.1.3-graph-transfer-presentation');
    expect(deck.routeContract.productBoundary).toMatch(/without new PPTX-generation|zonder nieuwe PPTX/i);
    expect(deck.slides).toHaveLength(7);
    expect(deck.slides.map((slide) => slide.role)).toEqual([
      'route_contract',
      'source_table_anchor',
      'table_value_selection',
      'axis_convention',
      'graph_reading_interpolation',
      'graph_claim_check',
      'retrieval_check',
    ]);
  });

  test('production HTML uses the shared web presentation route and not PPTX-converter chrome', () => {
    expect(html).toMatch(/data-layout="presentation-v2"/);
    expect(html).toMatch(/data-exemplar-id="1\.1\.3-graph-transfer-presentation"/);
    expect(html).toMatch(/<span>Lespresentatie<\/span>/);
    expect(html).not.toMatch(/webpresentatie<\/span>/i);
    expect(html).not.toMatch(/Download PowerPoint|Speaker notes|Full screen|Exit full screen/);
    expect(html).toMatch(/data-pv2-notes aria-pressed="false" aria-expanded="false"[^>]*>Studentgerichte uitleg<\/button>/);
    expect(html).toMatch(/data-pv2-fullscreen aria-pressed="false">Presentatiemodus<\/button>/);
  });

  test('graph/table learning objects survive rendering', () => {
    for (const marker of [
      'slide_ice_table',
      'slide_pq_graph',
      'slide_interpolation_graph',
      'slide_misleading_axis_comparison',
      'P-Q-grafiek',
      'Interpoleren bij \u20ac1,75',
      'Zelfde data, andere schaal',
      '(300; 2,00)',
      'Q ongeveer 350',
    ]) {
      expect(html).toContain(marker);
    }
    expect(html).toContain('Prijs staat verticaal; hoeveelheid staat horizontaal.');
  });

  test('student-facing notes avoid teacher-only and unsupported mastery wording', () => {
    expect(html).toMatch(/<summary>Studentgerichte uitleg<\/summary>/);
    expect(html).toMatch(/<h3>Studentuitleg<\/h3>/);
    expect(html).toMatch(/<h3>Let op<\/h3>/);
    expect(html).toMatch(/<h3>Overgang<\/h3>/);
    expect(html).not.toMatch(/<h3>Docentcue<\/h3>|<h3>Visual<\/h3>|<h3>Data<\/h3>/);
    expect(html).not.toMatch(/\bbeheers\w*/iu);
  });

  test('runtime and CSS still support graph slides, notes, dark mode, and fullscreen', () => {
    for (const marker of ['pv2-route-with-visual', 'pv2-inline-graph', 'pv2-axis-compare']) {
      expect(html).toContain(marker);
      expect(css).toContain(marker);
    }
    expect(js).toMatch(/event\.key === 'Home'/);
    expect(js).toMatch(/Sluit presentatiemodus/);
    expect(js).not.toMatch(/Exit full screen|Full screen/);
  });
});
