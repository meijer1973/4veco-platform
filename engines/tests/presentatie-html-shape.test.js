/**
 * Regression test for the active §1.1.1 presentation route.
 *
 * The student-facing `presentatie.html` file is now the implemented
 * presentation-v2 Golden web surface, not the legacy PPTX-as-web converter.
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
  '1.1.1 Schaarste en economisch denken – presentatie.html',
);

const exists = fs.existsSync(FILE);
const describeOrSkip = exists ? describe : describe.skip;

describeOrSkip('§1.1.1 presentatie.html implemented web shape', () => {
  let html;
  beforeAll(() => {
    html = fs.readFileSync(FILE, 'utf8');
  });

  test('renders the production presentation-v2 route with 11 slides', () => {
    expect(html).toMatch(/data-layout="presentation-v2"/);
    expect(html).not.toMatch(/data-layout="presentatie-v1"/);
    const slides = [...html.matchAll(/data-pv2-slide="(\d+)"/g)].map((match) => Number(match[1]));
    expect(slides).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  test('uses semantic route roles and student-facing notes', () => {
    for (const role of [
      'route_contract',
      'narrative_anchor',
      'concept_model_development',
      'transfer_slide',
      'misconception_slide',
      'procedure_route',
      'worked_example_calculation',
      'worked_example_interpretation',
      'retrieval_check',
      'summary_bridge',
    ]) {
      expect(html).toContain(`data-route-role="${role}"`);
    }
    expect((html.match(/<details class="pv2-notes">/g) || [])).toHaveLength(11);
    expect(html).toContain('Studentgerichte uitleg');
    expect(html).not.toMatch(/Speaker notes|NavTitle:/);
  });

  test('keeps the accepted Lisa and farmer learning anchors active', () => {
    expect(html).toContain('Lisa heeft €20, maar wil voor €27');
    expect(html).toContain('Bioscoop');
    expect(html).toContain('Nieuw boek');
    expect(html).toContain('Tarwe');
    expect(html).toContain('Maïs');
    expect(html).toContain('€5.000');
    expect(html).toContain('€3.500');
    expect(html).toContain('€1.500');
  });

  test('does not expose retired converter structures on the active route', () => {
    expect(html).not.toMatch(/<section class="slide /);
    expect(html).not.toMatch(/slide-option-grid|slide-pseudotable|slide-notes-list/);
    expect(html).not.toMatch(/presentatie-v2-prototype|prototype v2/i);
  });
});
