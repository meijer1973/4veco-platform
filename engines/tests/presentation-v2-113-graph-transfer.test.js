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
const RICH_SKILLS_HTML = path.join(PARA, '1.1.3 Grafieken en tabellen \u2013 uitleg vaardigheden.html');
const {
  mapPqPoint,
} = require(path.resolve(__dirname, '..', '..', 'build-scripts', 'lib', 'pq-plot-mapper.js'));

const exists = fs.existsSync(HTML) && fs.existsSync(CSS) && fs.existsSync(JS);
const describeOrSkip = exists ? describe : describe.skip;

describeOrSkip('section 1.1.3 graph/table web presentation transfer', () => {
  let html;
  let css;
  let js;
  let deck;
  let richSkillsHtml;

  beforeAll(() => {
    html = fs.readFileSync(HTML, 'utf8');
    css = fs.readFileSync(CSS, 'utf8');
    js = fs.readFileSync(JS, 'utf8');
    richSkillsHtml = fs.existsSync(RICH_SKILLS_HTML) ? fs.readFileSync(RICH_SKILLS_HTML, 'utf8') : '';
    jest.resetModules();
    deck = require(MODEL);
  });

  test('uses a standalone semantic presentation-v2 graph transfer deck', () => {
    expect(deck.version).toBe('presentation-v2');
    expect(deck.exemplarId).toBe('1.1.3-graph-transfer-presentation');
    expect(deck.routeContract.productBoundary).toMatch(/without new PPTX-generation|zonder nieuwe PPTX/i);
    expect(deck.slides).toHaveLength(8);
    expect(deck.slides.map((slide) => slide.role)).toEqual([
      'route_contract',
      'source_table_anchor',
      'table_value_selection',
      'axis_convention',
      'graph_reading_interpolation',
      'graph_claim_check',
      'retrieval_check',
      'summary_bridge',
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
      'Vraaglijn ijsjes',
      'Prijs per ijsje (P)',
      'Hoeveelheid ijsjes (Q)',
      '\u20ac1,00',
      '\u20ac1,50',
      '\u20ac2,00',
      '\u20ac2,50',
      '\u20ac3,00',
      '>100<',
      '>500<',
    ]) {
      expect(html).toContain(marker);
    }
    expect(html).toContain('Prijs staat verticaal; hoeveelheid staat horizontaal.');
  });

  test('P-Q graph geometry is derived from economic values', () => {
    const axisSlide = deck.slides.find(slide => slide.role === 'axis_convention');
    const visual = axisSlide.visual;
    const config = { pMin: 1, pMax: 3, qMin: 100, qMax: 500, plot: visual.plot };
    const pointFor = (quantity, price) => visual.points.find(point => point.quantity === quantity && point.price === price);
    const expectedPoint = (quantity, price) => mapPqPoint({ quantity, price }, config);

    expect(visual.sourceRows).toEqual([
      { quantity: 500, price: 1, label: '' },
      { quantity: 400, price: 1.5, label: '' },
      { quantity: 300, price: 2, label: '(300; 2,00)' },
      { quantity: 200, price: 2.5, label: '' },
      { quantity: 100, price: 3, label: '' },
    ]);

    expect(pointFor(100, 3).x).toBeLessThan(pointFor(500, 1).x);
    expect(pointFor(100, 3).y).toBeLessThan(pointFor(500, 1).y);
    expect(pointFor(300, 2)).toMatchObject(expectedPoint(300, 2));
    for (const point of visual.points) {
      const expected = expectedPoint(point.quantity, point.price);
      expect(point.x).toBeCloseTo(expected.x, 2);
      expect(point.y).toBeCloseTo(expected.y, 2);
    }

    const sortedByQuantity = [...visual.points].sort((a, b) => a.quantity - b.quantity);
    for (let index = 1; index < sortedByQuantity.length; index += 1) {
      expect(sortedByQuantity[index].quantity).toBeGreaterThan(sortedByQuantity[index - 1].quantity);
      expect(sortedByQuantity[index].price).toBeLessThan(sortedByQuantity[index - 1].price);
      expect(sortedByQuantity[index].x).toBeGreaterThan(sortedByQuantity[index - 1].x);
      expect(sortedByQuantity[index].y).toBeGreaterThan(sortedByQuantity[index - 1].y);
    }
  });

  test('interpolation guide sits between the correct source points', () => {
    const interpolationSlide = deck.slides.find(slide => slide.role === 'graph_reading_interpolation');
    const visual = interpolationSlide.visual;
    const config = { pMin: 1, pMax: 3, qMin: 100, qMax: 500, plot: visual.plot };
    const expectedGuide = mapPqPoint({ quantity: 350, price: 1.75 }, config);
    const p300 = visual.points.find(point => point.quantity === 300 && point.price === 2);
    const p400 = visual.points.find(point => point.quantity === 400 && point.price === 1.5);

    expect(visual.guides).toMatchObject({
      quantity: 350,
      price: 1.75,
      xLabel: 'Q ongeveer 350',
      yLabel: '\u20ac1,75',
    });
    expect(visual.guides.x).toBeCloseTo(expectedGuide.x, 2);
    expect(visual.guides.y).toBeCloseTo(expectedGuide.y, 2);
    expect(visual.guides.x).toBeGreaterThan(p300.x);
    expect(visual.guides.x).toBeLessThan(p400.x);
    expect(visual.guides.y).toBeGreaterThan(p300.y);
    expect(visual.guides.y).toBeLessThan(p400.y);
  });

  test('geometry validation rejects a reversed coordinate fixture', () => {
    const axisSlide = deck.slides.find(slide => slide.role === 'axis_convention');
    const visual = axisSlide.visual;
    const config = { pMin: 1, pMax: 3, qMin: 100, qMax: 500, plot: visual.plot };
    const assertMapped = points => {
      for (const point of points) {
        const expected = mapPqPoint({ quantity: point.quantity, price: point.price }, config);
        if (Math.abs(point.x - expected.x) > 0.01 || Math.abs(point.y - expected.y) > 0.01) {
          throw new Error(`point ${point.quantity}/${point.price} is not data-mapped`);
        }
      }
    };
    const reversed = visual.points.map(point => ({
      ...point,
      x: visual.plot.right - (point.x - visual.plot.left),
      y: visual.plot.bottom - (point.y - visual.plot.top),
    }));

    expect(() => assertMapped(visual.points)).not.toThrow();
    expect(() => assertMapped(reversed)).toThrow(/not data-mapped/);
  });

  test('student-facing notes avoid teacher-only and unsupported mastery wording', () => {
    expect(html).toMatch(/<summary>Studentgerichte uitleg<\/summary>/);
    expect(html).toMatch(/<h3>Studentuitleg<\/h3>/);
    expect(html).toMatch(/<h3>Let op<\/h3>/);
    expect(html).toMatch(/<h3>Overgang<\/h3>/);
    expect(html).not.toMatch(/<h3>Docentcue<\/h3>|<h3>Visual<\/h3>|<h3>Data<\/h3>/);
    expect(html).not.toMatch(/Laat leerlingen/);
    expect(html).not.toMatch(/\bbeheers\w*/iu);
  });

  test('rich lesson P-Q helper uses the same axis convention when generated', () => {
    if (!richSkillsHtml) return;
    expect(richSkillsHtml).toContain('Tabelpunten als P-Q-grafiek');
    expect(richSkillsHtml).toContain('Prijs per ijsje (P)');
    expect(richSkillsHtml).toContain('Hoeveelheid ijsjes (Q)');
    expect(richSkillsHtml).toContain('Vraaglijn ijsjes');
    expect(richSkillsHtml).toContain('data-q="100" data-p="3"');
    expect(richSkillsHtml).toContain('data-q="500" data-p="1"');
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
