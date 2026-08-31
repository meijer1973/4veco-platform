#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const POLICY_PATH = 'references/owned/course-blueprint-pedagogical-boundaries.md';
const V5_META_PATH = 'references/owned/course-blueprint-v5.meta.json';
const V6_META_PATH = 'references/owned/course-blueprint-v6-three-year.meta.json';
const CONTRACT_PATH = 'skills/econ-exercise-builder.md';
const TARGET_REGISTRY_PATH = 'references/authored/course-target-exercises.json';

const POINTER_SURFACES = Object.freeze([
  'BUILD-PARAGRAPH.md',
  'skills/econ-exercise-builder.md',
  'docs/workflows/textbook-paragraph-lane.md',
  'agents/teacher-learning-quality-review-agent.md',
]);

const SOURCE_PATHS = Object.freeze([
  POLICY_PATH,
  V5_META_PATH,
  V6_META_PATH,
  'references/owned/README.md',
  ...POINTER_SURFACES,
  'AGENT_GITHUB_ENTRY.md',
  'package.json',
  '.github/workflows/platform-ci.yml',
]);

const V5_COUNTS = Object.freeze({ 1: 12, 2: 12, 3: 14, 4: 16 });
const V6_BOOKS_BY_YEAR = Object.freeze({
  1: [1, 2, 3, 4],
  2: [5, 6, 7, 8],
  3: [9, 10, 11],
});
const V6_COUNT_BEARING = Object.freeze({
  1: 12,
  2: 12,
  3: 14,
  4: 16,
  5: 13,
  6: 13,
  7: 14,
  8: 16,
  9: 14,
  10: 15,
  11: 9,
});

function normalizeSourceText(value) {
  return String(value).replace(/\r\n?/g, '\n');
}

function readFiles(root = ROOT) {
  return Object.fromEntries(
    SOURCE_PATHS.map((file) => {
      const absolute = path.join(root, file);
      return [file, fs.existsSync(absolute) ? normalizeSourceText(fs.readFileSync(absolute, 'utf8')) : null];
    })
  );
}

function requireText(failures, files, file, pattern, message) {
  const text = files[file];
  if (typeof text !== 'string') {
    failures.push(`${file}: required source file is missing`);
  } else if (!pattern.test(text)) {
    failures.push(`${file}: ${message}`);
  }
}

function parseJson(failures, files, file) {
  const text = files[file];
  if (typeof text !== 'string') {
    failures.push(`${file}: required source file is missing`);
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    failures.push(`${file}: invalid JSON: ${error.message}`);
    return null;
  }
}

function requireEqual(failures, actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) failures.push(message);
}

function checkPolicyText(failures, files) {
  const clauses = [
    [/## Compatibility with the Book 2\+ Part A authoring contract/, 'missing explicit Part A compatibility section'],
    [/`skills\/econ-exercise-builder\.md` remains the operational authority/, 'exercise builder is not preserved as operational authority'],
    [/explanation or context for an approved lesson goal or target operation/, 'bounded explanation/context permission is missing'],
    [/retrieval of a prerequisite that was already taught/, 'already-taught prerequisite retrieval boundary is missing'],
    [/explicitly optional perspective that does not become part of the core\s+route/, 'optional-perspective boundary is missing'],
    [/may not fill a `Covered` cell/, 'preview-to-Covered prohibition is missing'],
    [/It is not evidence of mastery/, 'preview-to-mastery prohibition is missing'],
    [/worked\nexample, the current-content Startopgaven check, Begeleide inoefening,\nZelfstandige oefening, or Doeloefening/, 'all protected Part A target stages are not enumerated'],
    [/reviewed target exercise or an approved lesson goal/, 'goal/target authorization boundary is missing'],
    [/must not displace practice of an approved target operation/, 'target-practice displacement prohibition is missing'],
    [/whole-lesson equation of at most 55 minutes/, '55-minute route protection is missing'],
    [/do not remove a target operation to make room/, 'target-operation preservation rule is missing'],
    [/Book 2 §2\.1\.1 must still\nteach its reviewed cost relations and procedures in full/, 'Book 2 §2.1.1 formal-teaching protection is missing'],
    [/revenue, profit, and break-even teaching must still provide its own formal\ninstruction and target-level practice/, 'later formal revenue/profit/break-even protection is missing'],
    [/The first edition of Book 1 is already printed and is frozen/, 'Book 1 first-edition freeze is missing'],
  ];

  for (const [pattern, message] of clauses) requireText(failures, files, POLICY_PATH, pattern, message);
}

function checkPedagogicalScopePolicy(failures, meta, file) {
  if (!meta) return;
  const policy = meta.pedagogical_scope_policy;
  if (!policy || typeof policy !== 'object') {
    failures.push(`${file}: pedagogical_scope_policy is missing`);
    return;
  }
  const exact = {
    part_a_exercise_authoring_contract: CONTRACT_PATH,
    anticipatory_scaffolding_allowed: true,
    preview_is_mastery: false,
    later_formal_treatment_still_required: true,
    preview_cannot_fill_target_coverage: true,
    preview_cannot_add_untargeted_independent_operation: true,
    preview_cannot_displace_target_route_or_timing: true,
  };
  for (const [key, expected] of Object.entries(exact)) {
    if (policy[key] !== expected) {
      failures.push(`${file}: pedagogical_scope_policy.${key} must equal ${JSON.stringify(expected)}`);
    }
  }
}

function checkMetadata(failures, files) {
  const v5 = parseJson(failures, files, V5_META_PATH);
  const v6 = parseJson(failures, files, V6_META_PATH);

  for (const [file, meta] of [[V5_META_PATH, v5], [V6_META_PATH, v6]]) {
    if (!meta) continue;
    requireEqual(
      failures,
      meta.normative_clarifications,
      [POLICY_PATH],
      `${file}: normative_clarifications must contain exactly ${POLICY_PATH}`
    );
    checkPedagogicalScopePolicy(failures, meta, file);
  }

  if (v5) {
    if (v5.active_target_exercise_registry !== TARGET_REGISTRY_PATH) {
      failures.push(`${V5_META_PATH}: active_target_exercise_registry must remain ${TARGET_REGISTRY_PATH}`);
    }
    requireEqual(failures, v5.paragraph_counts, V5_COUNTS, `${V5_META_PATH}: Year 1 paragraph counts changed`);
    if (v5.total_count_bearing_paragraphs !== 54) {
      failures.push(`${V5_META_PATH}: total_count_bearing_paragraphs must remain 54`);
    }
    const edition = v5.edition_policy || {};
    if (edition.book_1_first_edition !== 'printed_frozen') {
      failures.push(`${V5_META_PATH}: Book 1 first edition must remain printed_frozen`);
    }
    if (edition.book_2_first_edition !== 'active_textbook_priority') {
      failures.push(`${V5_META_PATH}: Book 2 first edition must remain active_textbook_priority`);
    }
  }

  if (v6) {
    if (v6.active_year_1_baseline !== 'owned:course-blueprint-v5') {
      failures.push(`${V6_META_PATH}: active_year_1_baseline must remain owned:course-blueprint-v5`);
    }
    const assessment = v6.assessment_structure || {};
    if (assessment.books_total !== 11) failures.push(`${V6_META_PATH}: books_total must remain 11`);
    requireEqual(failures, assessment.books_by_year, V6_BOOKS_BY_YEAR, `${V6_META_PATH}: 4+4+3 books_by_year route changed`);
    requireEqual(failures, v6.year_1_counts_from_v5, V5_COUNTS, `${V6_META_PATH}: inherited Year 1 counts changed`);
    const model = v6.final_planning_count_model || {};
    if (model.route !== '4+4+3') failures.push(`${V6_META_PATH}: final planning route must remain 4+4+3`);
    if (model.count_bearing_total !== 148) failures.push(`${V6_META_PATH}: count_bearing_total must remain 148`);
    if (model.scheduled_total !== 152) failures.push(`${V6_META_PATH}: scheduled_total must remain 152`);
    requireEqual(failures, model.count_bearing_by_book, V6_COUNT_BEARING, `${V6_META_PATH}: count-bearing book model changed`);
    const book11 = model.book_11_model || {};
    if (book11.count_bearing_modules !== 9 || book11.scheduled_timed_paper_repair_cycles !== 4 || book11.scheduled_total !== 13) {
      failures.push(`${V6_META_PATH}: Book 11 9+4 role model changed`);
    }
  }
}

function checkOperationalPointers(failures, files) {
  for (const file of POINTER_SURFACES) {
    requireText(failures, files, file, /\*\*Pedagogical-boundary inheritance:\*\*/, 'inheritance marker is missing');
    requireText(
      failures,
      files,
      file,
      /`references\/owned\/course-blueprint-pedagogical-boundaries\.md`/,
      `must point to ${POLICY_PATH}`
    );
  }
  requireText(
    failures,
    files,
    'references/owned/README.md',
    /`course-blueprint-pedagogical-boundaries\.md`[\s\S]{0,420}inherits the Book 2\+ Part A target-operation, sequence, paper-route, and 55-minute contract/,
    'owned-source inventory does not state the Part A inheritance'
  );
  requireText(
    failures,
    files,
    'AGENT_GITHUB_ENTRY.md',
    /`build-scripts\/workflows\/check-blueprint-pedagogical-boundaries\.js`/,
    'GitHub entry map does not expose the focused checker'
  );
}

function checkExecutionWiring(failures, files) {
  const packageJson = parseJson(failures, files, 'package.json');
  if (packageJson) {
    const expected = 'node build-scripts/workflows/check-blueprint-pedagogical-boundaries.js';
    if (!packageJson.scripts || packageJson.scripts['check:blueprint-pedagogical-boundaries'] !== expected) {
      failures.push('package.json: check:blueprint-pedagogical-boundaries script is missing or changed');
    }
  }
  requireText(
    failures,
    files,
    '.github/workflows/platform-ci.yml',
    /- name: Validate blueprint pedagogical boundaries\n\s+run: npm run check:blueprint-pedagogical-boundaries/,
    'platform CI wiring is missing or changed'
  );
}

function findBoundaryFailures(files = readFiles()) {
  const failures = [];
  checkPolicyText(failures, files);
  checkMetadata(failures, files);
  checkOperationalPointers(failures, files);
  checkExecutionWiring(failures, files);
  return failures;
}

function main() {
  const failures = findBoundaryFailures(readFiles());
  if (failures.length > 0) {
    console.error('Blueprint pedagogical-boundary contract: FAIL');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log('Blueprint pedagogical-boundary contract: PASS');
  console.log(`- policy: ${POLICY_PATH}`);
  console.log(`- metadata: ${V5_META_PATH}, ${V6_META_PATH}`);
  console.log(`- operational pointers: ${POINTER_SURFACES.length}`);
  console.log('- Book 1 and lesson output are not inspected or mutated');
}

if (require.main === module) main();

module.exports = {
  CONTRACT_PATH,
  POINTER_SURFACES,
  POLICY_PATH,
  SOURCE_PATHS,
  TARGET_REGISTRY_PATH,
  V5_META_PATH,
  V6_META_PATH,
  findBoundaryFailures,
  normalizeSourceText,
  readFiles,
};
