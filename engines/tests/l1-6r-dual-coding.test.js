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
  return fs.readFileSync(path.join(PAR_DIR, name), 'utf8');
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
    expect(qualityRef).toContain('human_review_status: "l16r_visual_remediated_pending_human_review"');
    expect(qualityRef).toContain('required_objects_present:');
  });
});
