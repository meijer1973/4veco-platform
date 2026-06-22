#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const EXPECTED_HTML_SHA256 = '0070525A9F0C57C2BC9211C6D19CAEA6F84A3EEFE0810999C5AB0AA167477FF0';

const REQUIRED_FILES = [
  'README.md',
  'accepted-snapshot-provenance.md',
  'content-review-and-revision-notes.md',
  'lead-review-2026-06-20.md',
  'source-snapshot.sha256',
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
  'slide-10.png',
  'slide-11.png',
];

const REQUIRED_EXEMPLAR_ROLES = [
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
];

const REQUIRED_UNIVERSAL_ROLES = [
  'route_contract',
  'concept_model_development',
  'worked_example_or_application',
  'retrieval_check',
  'summary_bridge',
  'student_facing_notes',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function hashFile(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function plainText(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function validateContentModel(model) {
  assert(model.schema_version === '1.1.0', 'schema_version must be 1.1.0');
  assert(model.exemplar_id === '1.1.1-golden-presentation', 'exemplar_id must be 1.1.1-golden-presentation');
  assert(model.surface === 'web_first_presentation', 'surface must be web_first_presentation');
  assert(model.quality_claim === 'golden_conceptual_exemplar', 'quality_claim must remain conceptual');
  assert(model.source_snapshot?.sha256 === EXPECTED_HTML_SHA256, 'model must cite the accepted HTML SHA-256');
  assert(/frozen HTML/i.test(model.source_snapshot?.provenance || ''), 'model provenance must identify the frozen HTML snapshot');
  assert(Array.isArray(model.slides) && model.slides.length === 11, '§1.1.1 exemplar model must contain exactly 11 slides');
  const roles = new Set(model.slides.map((slide) => slide.role));
  for (const role of REQUIRED_EXEMPLAR_ROLES) {
    assert(roles.has(role), `missing exemplar slide role ${role}`);
  }
  for (const role of REQUIRED_UNIVERSAL_ROLES) {
    assert(model.route_contract?.universal_roles_present?.includes(role), `missing universal route role ${role}`);
  }
  for (const slide of model.slides) {
    assert(slide.id, 'slide missing id');
    assert(/^slide-\d{2}$/.test(slide.id), `${slide.id} must use accepted snapshot slide id format`);
    assert(slide.title, `${slide.id} missing title`);
    assert(slide.h2, `${slide.id} missing h2`);
    assert(slide.assertion, `${slide.id} missing assertion`);
    assert(slide.role, `${slide.id} missing role`);
    assert(Array.isArray(slide.student_explanation) && slide.student_explanation.length > 0, `${slide.id} missing student_explanation content`);
  }
  const activeCheck = model.slides.find((slide) => slide.id === 'slide-10');
  assert(activeCheck?.role === 'retrieval_check', 'slide-10 must be the retrieval check');
  const activeCheckText = JSON.stringify(activeCheck);
  assert(activeCheckText.includes('Lisa kiest bioscoop'), 'slide-10 must include the accepted Lisa active check');
  assert(activeCheckText.includes('De boer kiest tarwe'), 'slide-10 must include the accepted farmer active check');
  assert(activeCheckText.includes('€3.500'), 'slide-10 must include the accepted €3.500 farmer answer');
  assert(!/prototype/i.test(JSON.stringify(model)), 'golden exemplar metadata must not use unfinished-status labels');
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

  check('accepted snapshot hash', () => {
    const htmlPath = path.join(exemplarDir, 'golden-presentation.html');
    assert(hashFile(htmlPath) === EXPECTED_HTML_SHA256, 'golden-presentation.html must exactly match the accepted review-package snapshot');
    const hashText = fs.readFileSync(path.join(exemplarDir, 'source-snapshot.sha256'), 'utf8');
    assert(hashText.includes(EXPECTED_HTML_SHA256), 'source-snapshot.sha256 must cite the accepted hash');
  });

  check('accepted html structure', () => {
    const html = fs.readFileSync(path.join(exemplarDir, 'golden-presentation.html'), 'utf8');
    const text = plainText(html);
    const slideMatches = html.match(/<article\b[^>]*class="[^"]*\bslide\b/g) || [];
    const noteMatches = html.match(/class="[^"]*\bnotes-source\b/g) || [];
    assert(slideMatches.length === 11, 'HTML must contain the 11 accepted slide articles');
    assert(noteMatches.length >= 11, 'HTML must contain notes-source content for every slide');
    assert(html.includes('id="slide-10"'), 'HTML must contain accepted slide-10 active check');
    assert(text.includes('Lisa kiest bioscoop. Wat is het schaarse middel?'), 'HTML must include accepted Lisa budget check');
    assert(text.includes('De boer kiest tarwe. Wat zijn de alternatieve kosten?'), 'HTML must include accepted farmer active check');
    assert(text.includes('€3.500'), 'HTML must include accepted farmer alternative-cost answer');
    assert(!/prototype/i.test(html), 'HTML must not use unfinished-status labels');
  });

  return failures;
}

function validateImplementedWebSource(root = path.resolve(__dirname, '..', '..')) {
  const failures = [];
  const deckPath = path.join(root, 'build-scripts', 'content', 'book-1', 'b1-111-presentation-v2-model.js');

  function check(label, fn) {
    try {
      fn();
    } catch (error) {
      failures.push(`${label}: ${error.message}`);
    }
  }

  check('implemented deck source exists', () => {
    assert(fs.existsSync(deckPath), `missing ${path.relative(root, deckPath)}`);
  });

  check('implemented deck source contract', () => {
    delete require.cache[require.resolve(deckPath)];
    const deck = require(deckPath);
    assert(deck.version === 'presentation-v2', 'implemented deck must use presentation-v2');
    assert(deck.exemplarId === '1.1.1-golden-presentation', 'implemented deck must cite the exemplar id');
    assert(deck.sourceSnapshot?.sha256 === EXPECTED_HTML_SHA256, 'implemented deck must cite the accepted HTML SHA-256');
    assert(deck.outputBase === '1.1.1 Schaarste en economisch denken – presentatie', 'implemented deck must write the active presentatie output base');
    assert(deck.sideLabel === 'Lespresentatie', 'implemented deck must not expose internal Golden labels to students');
    assert(Array.isArray(deck.slides) && deck.slides.length === 11, 'implemented deck must contain exactly 11 slides');
    const roles = new Set(deck.slides.map((slide) => slide.role));
    for (const role of REQUIRED_EXEMPLAR_ROLES) {
      assert(roles.has(role), `implemented deck missing route role ${role}`);
    }
    for (const slide of deck.slides) {
      assert(slide.layout, `${slide.id} missing renderer layout`);
      assert(slide.assertion, `${slide.id} missing assertion`);
      assert(slide.action, `${slide.id} missing action`);
      assert(slide.speakerNotes?.label === 'Studentgerichte uitleg', `${slide.id} missing student-facing notes label`);
      assert(Array.isArray(slide.speakerNotes?.student) && slide.speakerNotes.student.length > 0, `${slide.id} missing student-facing note body`);
      assert(slide.speakerNotes.teacherCue, `${slide.id} missing teacher cue`);
      assert(slide.speakerNotes.transition, `${slide.id} missing transition`);
    }
    assert(!/prototype/i.test(JSON.stringify(deck)), 'implemented deck must not use unfinished-status labels');
  });

  return failures;
}

function main() {
  const root = path.resolve(__dirname, '..', '..');
  const failures = [
    ...validateGoldenPresentation(root),
    ...validateImplementedWebSource(root),
  ];
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
  validateImplementedWebSource,
  validateContentModel,
  REQUIRED_EXEMPLAR_ROLES,
  REQUIRED_UNIVERSAL_ROLES,
  EXPECTED_HTML_SHA256,
};
