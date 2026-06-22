#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LIBRARY = path.join(ROOT, 'references', 'exemplars', 'product-excellence', 'reasoning-games');

function fail(message) {
  console.error(`Reasoning golden exemplar check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(rel) {
  const file = path.join(ROOT, rel);
  assert(fs.existsSync(file), `missing required file: ${rel}`);
  return fs.readFileSync(file, 'utf8');
}

function readLibrary(rel) {
  const file = path.join(LIBRARY, rel);
  assert(fs.existsSync(file), `missing library file: ${rel}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(rel) {
  try {
    return JSON.parse(read(rel));
  } catch (error) {
    fail(`${rel} is not valid JSON: ${error.message}`);
  }
}

function readLibraryJson(rel) {
  try {
    return JSON.parse(readLibrary(rel));
  } catch (error) {
    fail(`${rel} is not valid JSON: ${error.message}`);
  }
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function normalizedNegativeFixtures(json) {
  if (Array.isArray(json.mustFail)) return json.mustFail;
  if (Array.isArray(json.fixtures)) return json.fixtures.filter((item) => item.should_fail !== false);
  if (Array.isArray(json.negative_fixtures)) return json.negative_fixtures;
  return [];
}

function assertAuthority(authority, label) {
  assert(authority && typeof authority === 'object', `${label} authority is required`);
  assert(authority.golden_reference === true, `${label} must be a golden reference`);
  [
    'student_product_adoption',
    'target_equivalent_proof',
    'diagnostics',
    'mastery_or_sequencing',
    'summative_use',
    'scale_gate'
  ].forEach((flag) => {
    assert(authority[flag] === false, `${label} authority.${flag} must be false`);
  });
}

function main() {
  assert(fs.existsSync(LIBRARY), 'reasoning game exemplar library directory is missing');

  const manifest = readLibraryJson('manifest.json');
  assert(manifest.schema_version === 1, 'manifest schema_version must be 1');
  assert(manifest.family_id === 'reasoning-game-golden-family-v1', 'unexpected manifest family_id');
  assert(manifest.library_version === '1.0.1', 'manifest must carry stable library_version 1.0.1');
  assert(manifest.repository_path === 'references/exemplars/product-excellence/reasoning-games', 'manifest repository_path mismatch');
  assert(manifest.change_policy && manifest.change_policy.stable === true, 'manifest must include stable change_policy');
  assert(Array.isArray(manifest.required_standard_files), 'manifest.required_standard_files must be listed');
  manifest.required_standard_files.forEach((rel) => readLibrary(rel));

  const standardText = readLibrary('family-standard.md');
  assert(/copy product grammar/i.test(standardText), 'family standard must preserve product-grammar rule');
  assert(/re-derive reasoning grammar/i.test(standardText), 'family standard must preserve reasoning-grammar rule');
  assert(/local repair/i.test(standardText), 'family standard must require local repair');
  assert(/stable/i.test(standardText) && /shuffle/i.test(standardText), 'family standard must require stable shuffle');

  const changeNotes = readLibrary('change-notes.md');
  assert(changeNotes.includes('GOAL-REASONING-GOLDEN-FAMILY-1'), 'change notes must name the adoption goal');
  assert(/copy product grammar/i.test(changeNotes), 'change notes must preserve product-grammar rule');
  assert(/re-derive reasoning grammar/i.test(changeNotes), 'change notes must preserve reasoning-grammar rule');
  assert(/no student product adoption/i.test(changeNotes), 'change notes must preserve authority boundary');
  assert(/generated lesson output must not be hand-edited/i.test(changeNotes), 'change notes must preserve generated-output boundary');

  const treeText = readLibrary('reasoning-archetype-decision-tree.md');
  [
    'Causal mechanism',
    'Choice and evidence',
    'Reference value and claim repair',
    'Graph evidence and epistemic scope'
  ].forEach((term) => {
    assert(treeText.includes(term), `decision tree missing ${term}`);
  });

  const traceability = readLibraryJson('policy-traceability.json');
  assertAuthority(traceability.authority_boundary, 'policy traceability');
  assert(
    (traceability.stable_policy_surface || []).includes('references/exemplars/product-excellence/reasoning-games/change-notes.md'),
    'policy traceability must include change-notes.md as a stable policy surface'
  );
  assert(Array.isArray(traceability.decisions) && traceability.decisions.length >= 6, 'policy traceability must include decision rows');
  const traceText = JSON.stringify(traceability);
  [
    'goal-not-answer',
    'local-repair',
    'stable-shuffle',
    'visible-answer-functions',
    'graph-source-directness',
    'authority-boundary'
  ].forEach((id) => assert(traceText.includes(id), `policy traceability missing ${id}`));

  const catalog = readJson('references/exemplars/exemplar-index.json');
  const catalogEntry = (catalog.entries || []).find((entry) => entry.id === manifest.family_id);
  assert(catalogEntry, 'exemplar-index.json must register reasoning-game-golden-family-v1');
  assert(catalogEntry.path === 'references/exemplars/product-excellence/reasoning-games/', 'catalog path mismatch');
  assert((catalogEntry.does_not_authorize || []).includes('student_product_adoption'), 'catalog entry must block product adoption');
  const catalogMd = read('references/exemplars/exemplar-index.md');
  assert(catalogMd.includes('reasoning-game-golden-family-v1'), 'exemplar-index.md missing reasoning game family entry');

  assert(Array.isArray(manifest.exemplars) && manifest.exemplars.length === 4, 'manifest must list exactly four exemplars');
  const seenExemplars = new Set();
  const recurringDefects = [
    /answer[_ -]?giving|goal_gives_answer_chain/i,
    /visible.*(?:id|metadata|role)|internal_role/i,
    /generic.*(?:textarea|mc|choice)/i,
    /clear[_ -]?all/i,
    /reshuffle|randomization/i,
    /tiny.*target|44/i,
    /decorative.*graph|graph_construction/i
  ];
  const allFixtureText = [];

  manifest.exemplars.forEach((exemplar) => {
    assert(!seenExemplars.has(exemplar.id), `duplicate exemplar id: ${exemplar.id}`);
    seenExemplars.add(exemplar.id);
    assert(exemplar.status === 'human_calibrated_reference_candidate', `${exemplar.id} status mismatch`);
    assert(typeof exemplar.reasoning_grammar === 'string' && exemplar.reasoning_grammar.includes('->'), `${exemplar.id} reasoning grammar must use readable arrows`);
    assert(Array.isArray(exemplar.core_patterns) && exemplar.core_patterns.length >= 3, `${exemplar.id} must list core patterns`);
    assertAuthority(exemplar.authority, exemplar.id);
    assert(exemplar.review_state && exemplar.review_state.product_grammar_locked === true, `${exemplar.id} review_state.product_grammar_locked missing`);
    assert(exemplar.review_state.reasoning_grammar_must_be_rederived === true, `${exemplar.id} must require re-derived reasoning grammar`);
    assert(exemplar.review_state.rendered_fidelity_required === true, `${exemplar.id} must require rendered fidelity`);

    const fileNames = (exemplar.files || []).map((file) => file.path.replace(/\\/g, '/'));
    [
      'prototype.html',
      'candidate-data.json',
      'implementation-handoff.md',
      'ui-framework.md',
      'negative-fixtures.json',
      'quality-brief.md',
      'README.md'
    ].forEach((suffix) => {
      assert(fileNames.some((file) => file.endsWith('/' + suffix)), `${exemplar.id} missing ${suffix}`);
    });

    exemplar.files.forEach((entry) => {
      assert(entry.path && !entry.path.startsWith('reference-exemplars/'), `${exemplar.id} file path must be repo-local: ${entry.path}`);
      const abs = path.join(LIBRARY, entry.path);
      assert(fs.existsSync(abs), `${exemplar.id} missing file: ${entry.path}`);
      const stat = fs.statSync(abs);
      assert(stat.size === entry.bytes, `${entry.path} byte count drifted: expected ${entry.bytes}, got ${stat.size}`);
      assert(sha256(abs) === entry.sha256, `${entry.path} sha256 drifted`);
    });

    const negativeRel = fileNames.find((file) => file.endsWith('/negative-fixtures.json'));
    const fixtures = normalizedNegativeFixtures(readLibraryJson(negativeRel));
    assert(fixtures.length >= 6, `${exemplar.id} must include at least six negative fixtures`);
    allFixtureText.push(JSON.stringify(fixtures));
  });

  const combinedFixtures = allFixtureText.join('\n');
  recurringDefects.forEach((pattern) => {
    assert(pattern.test(combinedFixtures), `negative fixtures missing recurring defect pattern ${pattern}`);
  });

  const packageOrigin = readLibraryJson('package-origin.json');
  assert(packageOrigin.goal === 'GOAL-REASONING-GOLDEN-FAMILY-1', 'package-origin goal mismatch');
  assertAuthority(packageOrigin.authority, 'package-origin');

  console.log('Reasoning golden exemplar check OK');
}

main();
