const fs = require('fs');
const path = require('path');
const { validatePolicyRoot } = require('../../build-scripts/references/check-presentation-policy');
const { validateGoldenPresentation, validateContentModel, REQUIRED_EXEMPLAR_ROLES, REQUIRED_UNIVERSAL_ROLES, EXPECTED_HTML_SHA256 } = require('../../build-scripts/sprints/check-golden-presentation-111');
const { validatePptxSkillMirror } = require('../../build-scripts/sprints/check-pptx-skill-mirror');
const { validateHtml } = require('../../scripts/qa-presentation-web');

const ROOT = path.resolve(__dirname, '..', '..');
const EXEMPLAR_SEQUENCE = [
  'route_contract',
  'narrative_anchor',
  'concept_model_development',
  'transfer_slide',
  'concept_model_development',
  'misconception_slide',
  'procedure_route',
  'worked_example_calculation',
  'worked_example_interpretation',
  'retrieval_check',
  'summary_bridge',
];

describe('golden presentation exemplar and policy', () => {
  test('presentation policy files and index entry validate', () => {
    expect(validatePolicyRoot(ROOT)).toEqual([]);
  });

  test('1.1.1 golden presentation package validates', () => {
    expect(validateGoldenPresentation(ROOT)).toEqual([]);
  });

  test('PPTX command mirror matches the source skill', () => {
    expect(validatePptxSkillMirror(ROOT)).toEqual([]);
  });

  function makeSlide(role, index, studentExplanation = ['Student explanation.']) {
    return {
      id: `slide-${String(index).padStart(2, '0')}`,
      title: `Slide ${index}`,
      h2: `Slide ${index}`,
      role,
      assertion: 'A visible assertion.',
      student_explanation: studentExplanation,
    };
  }

  function makeModel(slides) {
    return {
      schema_version: '1.1.0',
      exemplar_id: '1.1.1-golden-presentation',
      surface: 'web_first_presentation',
      quality_claim: 'golden_conceptual_exemplar',
      source_snapshot: {
        sha256: EXPECTED_HTML_SHA256,
        provenance: 'Derived from the frozen HTML snapshot.',
      },
      route_contract: {
        universal_roles_present: [...REQUIRED_UNIVERSAL_ROLES],
      },
      slides,
    };
  }

  test('content model rejects missing route roles and slide explanations', () => {
    const missingRoleModel = {
      ...makeModel(EXEMPLAR_SEQUENCE.map((role, index) => makeSlide(role === 'summary_bridge' ? 'concept_model_development' : role, index + 1))),
    };
    expect(REQUIRED_EXEMPLAR_ROLES).toContain('summary_bridge');
    expect(() => validateContentModel(missingRoleModel)).toThrow(/missing exemplar slide role summary_bridge/);

    const missingExplanationSlides = EXEMPLAR_SEQUENCE.map((role, index) => makeSlide(role, index + 1));
    delete missingExplanationSlides[3].student_explanation;
    const missingNotesModel = {
      ...makeModel(missingExplanationSlides),
    };
    expect(() => validateContentModel(missingNotesModel)).toThrow(/missing student_explanation/);
  });

  test('web QA rejects missing notes and unfinished-status wording', () => {
    const badHtml = `
      <html><body>
        <nav><a data-slide-link="1" href="#s1">1</a></nav>
        <button data-notes-toggle>notes</button>
        <span data-current>1</span>
        <article id="s1" data-slide="1" data-slide-role="route_contract">
          <h2>Lesdoel</h2>
          <p class="assertion">Vandaag leer je iets.</p>
        </article>
        <p>prototype</p>
      </body></html>
    `;
    const failures = validateHtml(badHtml, { production: true });
    expect(failures.join('\n')).toMatch(/missing readable notes/);
    expect(failures.join('\n')).toMatch(/unfinished-status wording/);
  });

  test('standalone exemplar passes static web QA', () => {
    const htmlPath = path.join(ROOT, 'references', 'exemplars', '1.1.1-golden-presentation', 'golden-presentation.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    expect(validateHtml(html, { production: true })).toEqual([]);
  });
});
