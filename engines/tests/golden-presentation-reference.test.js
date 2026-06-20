const fs = require('fs');
const path = require('path');
const { validatePolicyRoot } = require('../../build-scripts/references/check-presentation-policy');
const { validateGoldenPresentation, validateContentModel, REQUIRED_ROLES } = require('../../build-scripts/sprints/check-golden-presentation-111');
const { validateHtml } = require('../../scripts/qa-presentation-web');

const ROOT = path.resolve(__dirname, '..', '..');

describe('golden presentation exemplar and policy', () => {
  test('presentation policy files and index entry validate', () => {
    expect(validatePolicyRoot(ROOT)).toEqual([]);
  });

  test('1.1.1 golden presentation package validates', () => {
    expect(validateGoldenPresentation(ROOT)).toEqual([]);
  });

  function makeSlide(role, index, notes = {
    studentExplanation: ['Student explanation.'],
    misconceptionWatch: [],
    teacherCue: [],
    transition: 'Next slide.',
  }) {
    return {
      id: `slide-${index}`,
      navTitle: `Slide ${index}`,
      slideRole: role,
      studentTitle: `Slide ${index}`,
      assertion: 'A visible assertion.',
      visibleElements: ['assertion'],
      notes,
    };
  }

  test('content model rejects missing route roles and notes', () => {
    const missingRoleModel = {
      schema_version: 1,
      id: '1.1.1-golden-presentation',
      surface: 'web_first_presentation',
      quality_claim: 'golden_conceptual_exemplar',
      slides: REQUIRED_ROLES.map((role, index) => makeSlide(role === 'summary_bridge' ? 'concept_definition' : role, index + 1)),
    };
    expect(() => validateContentModel(missingRoleModel)).toThrow(/missing required slideRole summary_bridge/);

    const missingNotesModel = {
      ...missingRoleModel,
      slides: REQUIRED_ROLES.map((role, index) => makeSlide(role, index + 1, index === 3 ? undefined : undefined)),
    };
    delete missingNotesModel.slides[3].notes;
    expect(() => validateContentModel(missingNotesModel)).toThrow(/missing notes/);
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
