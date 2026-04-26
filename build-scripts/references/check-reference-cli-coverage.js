#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

const COVERAGE_JSON = path.join(REPO_ROOT, 'reports/json/reference-cli-coverage.json');
const COVERAGE_MD = path.join(REPO_ROOT, 'reports/reference-cli-coverage.md');
const README = path.join(REPO_ROOT, 'build-scripts/references/README.md');

const REQUIRED_MUTATION_TYPES = [
  'unit_dependency_add',
  'zero_needs_review_fields',
  'unit_status_deprecate',
  'unit_split_or_merge',
  'unit_terms_update',
  'term_registry_update',
  'evidence_anchor_storage',
];

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function assert(condition, message, errors) {
  if (!condition) errors.push(message);
}

function main() {
  const errors = [];

  assert(fs.existsSync(COVERAGE_JSON), 'missing reports/json/reference-cli-coverage.json', errors);
  assert(fs.existsSync(COVERAGE_MD), 'missing reports/reference-cli-coverage.md', errors);
  assert(fs.existsSync(README), 'missing build-scripts/references/README.md', errors);

  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const coverage = JSON.parse(readText(COVERAGE_JSON));
  const markdown = readText(COVERAGE_MD);
  const readme = readText(README);

  assert(coverage.sprint_id === 'R3.1', 'coverage sprint_id must be R3.1', errors);
  assert(coverage.protected_reference_data_changed === false, 'protected_reference_data_changed must be false', errors);
  assert(coverage.summary?.overall_status === 'ready_with_blockers', 'summary.overall_status must be ready_with_blockers', errors);

  const coverageByType = new Map((coverage.command_coverage || []).map((entry) => [entry.mutation_type, entry]));
  for (const mutationType of REQUIRED_MUTATION_TYPES) {
    assert(coverageByType.has(mutationType), `missing command coverage for ${mutationType}`, errors);
  }

  assert(
    coverageByType.get('zero_needs_review_fields')?.status === 'implemented_in_r3_1',
    'zero_needs_review_fields must be implemented_in_r3_1',
    errors
  );
  assert(
    coverageByType.get('evidence_anchor_storage')?.status === 'planned_not_r3_2_blocker',
    'evidence_anchor_storage must be planned_not_r3_2_blocker',
    errors
  );

  for (const script of coverage.required_scripts || []) {
    assert(fs.existsSync(path.join(REPO_ROOT, script)), `required script missing: ${script}`, errors);
  }

  assert(!readme.includes('All scripts in this folder are yet to be built'), 'README still contains stale future-only CLI claim', errors);
  for (const heading of ['Current Status', 'Unit Registry Commands', 'R2.4 To R3.2 Readiness']) {
    assert(readme.includes(heading), `README missing heading: ${heading}`, errors);
  }

  for (const phrase of ['ready_with_blockers', 'Zero-needs review fields', 'R3.2 remains blocked']) {
    assert(markdown.includes(phrase), `coverage markdown missing phrase: ${phrase}`, errors);
  }

  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  console.log('reference CLI coverage check passed');
}

main();
