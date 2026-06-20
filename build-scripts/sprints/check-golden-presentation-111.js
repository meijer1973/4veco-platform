#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'README.md',
  'golden-presentation.html',
  'golden-presentation-content-model.json',
  'slide-route.md',
  'speaker-notes-standard.md',
  'didactic-framework.md',
  'layout-framework.md',
  'teacher-student-review.md',
  'policy-extract.md',
  'implementation-handoff.md',
  'screenshot-proof.md',
];

const REQUIRED_PREVIEWS = [
  'slide-01.png',
  'slide-02.png',
  'slide-05.png',
  'slide-08.png',
  'slide-10.png',
  'slide-11.png',
];

const REQUIRED_ROLES = [
  'route_contract',
  'narrative_anchor',
  'concept_definition',
  'concept_transfer',
  'misconception_control',
  'procedure_route',
  'worked_example_calculation',
  'worked_example_interpretation',
  'active_check',
  'summary_bridge',
];

const REQUIRED_NOTE_FIELDS = [
  'studentExplanation',
  'misconceptionWatch',
  'teacherCue',
  'transition',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function validateContentModel(model) {
  assert(model.schema_version === 1, 'schema_version must be 1');
  assert(model.id === '1.1.1-golden-presentation', 'id must be 1.1.1-golden-presentation');
  assert(model.surface === 'web_first_presentation', 'surface must be web_first_presentation');
  assert(model.quality_claim === 'golden_conceptual_exemplar', 'quality_claim must remain conceptual');
  assert(Array.isArray(model.slides) && model.slides.length >= 10, 'model must contain at least 10 slides');
  const roles = new Set(model.slides.map((slide) => slide.slideRole));
  for (const role of REQUIRED_ROLES) {
    assert(roles.has(role), `missing required slideRole ${role}`);
  }
  for (const slide of model.slides) {
    assert(slide.id, 'slide missing id');
    assert(slide.navTitle, `${slide.id} missing navTitle`);
    assert(slide.studentTitle, `${slide.id} missing studentTitle`);
    assert(slide.assertion, `${slide.id} missing assertion`);
    assert(slide.slideRole, `${slide.id} missing slideRole`);
    assert(slide.notes, `${slide.id} missing notes`);
    for (const field of REQUIRED_NOTE_FIELDS) {
      assert(Object.prototype.hasOwnProperty.call(slide.notes, field), `${slide.id} missing notes.${field}`);
    }
    assert(Array.isArray(slide.notes.studentExplanation) && slide.notes.studentExplanation.length > 0, `${slide.id} missing studentExplanation content`);
    assert(typeof slide.notes.transition === 'string' && slide.notes.transition.trim(), `${slide.id} missing transition content`);
  }
  const metadata = JSON.stringify({
    id: model.id,
    surface: model.surface,
    title: model.title,
    quality_claim: model.quality_claim,
  });
  assert(!/prototype/i.test(metadata), 'golden exemplar metadata must not use unfinished-status labels');
}

function validateGoldenPresentation(root = path.resolve(__dirname, '..', '..')) {
  const exemplarDir = path.join(root, 'references', 'exemplars', '1.1.1-golden-presentation');
  const failures = [];

  function check(label, fn) {
    try {
      fn();
    } catch (error) {
      failures.push(`${label}: ${error.message}`);
    }
  }

  check('exemplar directory', () => {
    assert(fs.existsSync(exemplarDir), `missing ${path.relative(root, exemplarDir)}`);
  });

  for (const file of REQUIRED_FILES) {
    check(file, () => {
      const fullPath = path.join(exemplarDir, file);
      assert(fs.existsSync(fullPath), `missing ${path.relative(root, fullPath)}`);
    });
  }

  for (const file of REQUIRED_PREVIEWS) {
    check(file, () => {
      const fullPath = path.join(exemplarDir, 'previews', file);
      assert(fs.existsSync(fullPath), `missing ${path.relative(root, fullPath)}`);
      assert(fs.statSync(fullPath).size > 1000, `${file} is unexpectedly small`);
    });
  }

  check('screenshot proof references previews', () => {
    const text = fs.readFileSync(path.join(exemplarDir, 'screenshot-proof.md'), 'utf8');
    for (const file of REQUIRED_PREVIEWS) {
      assert(text.includes(`previews/${file}`), `screenshot-proof.md missing previews/${file}`);
    }
  });

  check('content model', () => {
    validateContentModel(readJson(path.join(exemplarDir, 'golden-presentation-content-model.json')));
  });

  check('standalone html slide roles', () => {
    const html = fs.readFileSync(path.join(exemplarDir, 'golden-presentation.html'), 'utf8');
    for (const role of REQUIRED_ROLES) {
      assert(html.includes(`data-slide-role="${role}"`), `HTML missing ${role}`);
    }
    assert(!/prototype/i.test(html), 'HTML must not use unfinished-status labels');
  });

  return failures;
}

function main() {
  const root = path.resolve(__dirname, '..', '..');
  const failures = validateGoldenPresentation(root);
  if (failures.length) {
    console.error('Golden presentation 1.1.1 check failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log('OK golden presentation 1.1.1 exemplar package');
}

if (require.main === module) main();

module.exports = {
  validateGoldenPresentation,
  validateContentModel,
  REQUIRED_ROLES,
  REQUIRED_NOTE_FIELDS,
};
