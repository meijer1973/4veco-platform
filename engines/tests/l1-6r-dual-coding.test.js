const fs = require('fs');
const path = require('path');

const PAR_DIR = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '4veco-lessen',
  'Boek 1 - Grondslagen, vraag en aanbod',
  '1.1 Hoofdstuk Economisch denken en rekenen',
  '1.1.3 Grafieken en tabellen'
);

const exists = fs.existsSync(PAR_DIR);
const describeOrSkip = exists ? describe : describe.skip;

function read(name) {
  const target = path.join(PAR_DIR, name);
  if (!fs.existsSync(target) && name.endsWith('.html')) {
    const suffix = name.split(' ').slice(-2).join(' ');
    const fallback = fs.readdirSync(PAR_DIR).find((file) => file.endsWith(suffix));
    if (fallback) return fs.readFileSync(path.join(PAR_DIR, fallback), 'utf8');
  }
  return fs.readFileSync(target, 'utf8');
}

function readAsset(name) {
  return fs.readFileSync(path.join(PAR_DIR, '_assets', name), 'utf8');
}

describeOrSkip('L1.6R §1.1.3 semantic dual-coding surfaces', () => {
  test('vaardigheden pairs core procedures with visual learning objects', () => {
    const html = read('1.1.3 Grafieken en tabellen – uitleg vaardigheden.html');
    for (const id of [
      'ice_table',
      'vaardigheden_pq_graph',
      'vaardigheden_interpolation_graph',
      'misleading_axis_comparison',
    ]) {
      expect(html).toContain(`data-visual-id="${id}"`);
    }
    expect(html).toContain('Prijs per ijsje');
    expect(html).toContain('P-Q-grafiek');
    expect(html).toContain('EUR 1,75');
  });

  test('guided practice embeds source visuals for graph/table exercises', () => {
    const html = read('1.1.3 Grafieken en tabellen – begeleide inoefening.html');
    for (const id of [
      'guided_bread_graph',
      'blank_axes_template',
      'guided_cinema_interpolation',
      'guided_water_two_point',
      'misleading_axis_comparison',
    ]) {
      expect(html).toContain(`data-visual-id="${id}"`);
    }
  });

  test('guided practice visuals match exercise-specific values and labels', () => {
    const html = read('1.1.3 Grafieken en tabellen â€“ begeleide inoefening.html');
    const breadAsset = readAsset('1.1.3_ex_1.svg');
    const cinemaAsset = readAsset('1.1.3_ex_2.svg');

    expect(html).toContain('data-source-asset="1.1.3_ex_1.svg"');
    expect(html).toContain('EUR 3,00 hoort bij 200 broodjes');
    expect(html).toContain('150 broodjes hoort bij EUR 3,50');
    expect(breadAsset).toContain('Broodjesverkoop');
    expect(breadAsset).toContain('(200;');
    expect(breadAsset).toContain('(150;');

    for (const value of ['200 bekers', '160 bekers', '120 bekers', '80 bekers', '40 bekers']) {
      expect(html).toContain(value);
    }
    expect(html).toContain('data-visual-id="guided_coffee_table"');
    expect(html).toContain('Prijs per beker');

    expect(html).toContain('data-source-asset="1.1.3_ex_2.svg"');
    expect(html).toContain('EUR 9,00 hoort bij 500 bezoekers');
    expect(html).toContain('EUR 11,00');
    expect(html).toContain('300 bezoekers');
    expect(cinemaAsset).toContain('Bioscoopbezoekers');
    expect(cinemaAsset).toContain('(600;');
    expect(cinemaAsset).toContain('(200;');

    for (const value of ['500', '350', 'EUR 0,80', 'EUR 1,20', 'EUR 1,00', '425']) {
      expect(html).toContain(value);
    }
    expect(html).toContain('data-visual-id="guided_water_two_point"');
  });

  test('presentation web deck includes required table and graph visuals', () => {
    const html = read('1.1.3 Grafieken en tabellen – presentatie.html');
    for (const id of [
      'slide_start_table_graph',
      'slide_ice_table',
      'slide_pq_graph',
      'slide_interpolation_graph',
      'slide_misleading_axis_comparison',
    ]) {
      expect(html).toContain(`data-visual-id="${id}"`);
    }
    expect(html).toContain('pv2-inline-graph');
    expect(html).toContain('pv2-data-table');
  });

  test('companion review and quality-ref no longer claim unresolved dual-coding fail', () => {
    const review = read('1.1.3-companion-visual-review.md');
    const qualityRef = read('1.1.3-quality-ref.yaml');
    expect(review).toMatch(/## Verdict\s+PASS WITH FLAGS/);
    expect(review).not.toMatch(/^###\s*HF-\d+\b/m);
    expect(qualityRef).toContain('human_review_status: "l16r_guided_concordance_revised_pending_human_review"');
    expect(qualityRef).toContain('required_objects_present:');
    expect(qualityRef).toContain('guided_visual_concordance:');
  });
});
