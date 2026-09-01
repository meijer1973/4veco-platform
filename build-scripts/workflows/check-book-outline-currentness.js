#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const OUTLINE_PATH = 'references/authored/book-outlines/book-2-outline.md';
const META_PATH = 'references/authored/book-outlines/book-2-outline.meta.json';
const TARGET_REGISTRY_PATH = 'references/authored/course-target-exercises.json';

const AUTHORITY_PATHS = Object.freeze([
  'references/owned/course-blueprint-v6-three-year.md',
  'references/owned/course-blueprint-v5.md',
  TARGET_REGISTRY_PATH,
  'references/owned/course-blueprint-pedagogical-boundaries.md',
  'skills/econ-exercise-builder.md',
]);

const WORKFLOW_POINTERS = Object.freeze([
  'BUILD-PARAGRAPH.md',
  'BUILD-CHAPTER.md',
  'skills/econ-textbook-paragraph.md',
  'docs/workflows/textbook-paragraph-lane.md',
  'agents/teacher-learning-quality-review-agent.md',
  'build-scripts/templates/template-paragraph-plan.md',
]);

const EXPECTED_ORDER = Object.freeze([
  '2.1.1', '2.1.2', '2.1.3', '2.1.4',
  '2.2.1', '2.2.2', '2.2.3', '2.2.4',
  '2.3.1', '2.3.2', '2.3.3', '2.3.4',
]);

const EXPECTED_KINDS = Object.freeze([
  'theory', 'theory', 'theory', 'gemengde_opgaven',
  'theory', 'theory', 'theory', 'gemengde_opgaven',
  'theory', 'theory', 'theory', 'gemengde_opgaven',
]);

const REQUIRED_FIELDS = Object.freeze([
  'id',
  'title',
  'kind',
  'target_status',
  'target_record_sha256',
  'role',
  'chapter_dependency',
  'prior_teaching',
  'retrieval',
  'interleave',
  'operation_emphasis',
  'misconception_boundary',
  'readiness_verdict',
  'holds',
]);

const CONTENT_HOLDS = Object.freeze([
  'H-211-GATE0B1',
  'H-212-STALE-REF',
  'H-213-DELTAQ',
  'H-213-OPC2',
  'H-221-PRIOR',
  'H-22-ELASTIC-CONTRAST',
  'H-231-V5',
  'H-232-V5',
  'H-233-V5-REF',
  'H-234-PLACEHOLDER',
  'H-LESSON-ROOT',
]);

const SOURCE_PATHS = Object.freeze([
  OUTLINE_PATH,
  META_PATH,
  ...AUTHORITY_PATHS,
  ...WORKFLOW_POINTERS,
  'AGENT_GITHUB_ENTRY.md',
  'package.json',
  '.github/workflows/platform-ci.yml',
]);

function sha256(value) {
  return crypto.createHash('sha256').update(Buffer.isBuffer(value) ? value : Buffer.from(String(value))).digest('hex');
}

function asText(value) {
  if (value === null || value === undefined) return null;
  return Buffer.isBuffer(value) ? value.toString('utf8') : String(value);
}

function sha256CanonicalText(value) {
  const text = asText(value);
  return sha256(Buffer.from(text.replace(/\r\n?/g, '\n'), 'utf8'));
}

function readFiles(root = ROOT) {
  return Object.fromEntries(
    SOURCE_PATHS.map((file) => {
      const absolute = path.join(root, file);
      return [file, fs.existsSync(absolute) ? fs.readFileSync(absolute) : null];
    })
  );
}

function parseJson(failures, files, file) {
  const text = asText(files[file]);
  if (text === null) {
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

function equal(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function requireText(failures, files, file, pattern, message) {
  const text = asText(files[file]);
  if (text === null) failures.push(`${file}: required source file is missing`);
  else if (!pattern.test(text)) failures.push(`${file}: ${message}`);
}

function checkMetadata(failures, files, meta) {
  if (!meta) return;
  if (meta.schema_version !== 1) failures.push(`${META_PATH}: schema_version must equal 1`);
  if (meta.outline_id !== 'book-2') failures.push(`${META_PATH}: outline_id must equal book-2`);
  if (meta.audit_outcome !== 'VALID_WITH_DERIVED_OUTLINE_REQUIRED') {
    failures.push(`${META_PATH}: audit_outcome must remain VALID_WITH_DERIVED_OUTLINE_REQUIRED`);
  }
  if (meta.outline_path !== OUTLINE_PATH) failures.push(`${META_PATH}: outline_path must equal ${OUTLINE_PATH}`);
  if (!/^book-2-outline-v\d+/.test(String(meta.version || ''))) failures.push(`${META_PATH}: version is missing or invalid`);
  if (!['review_ready_with_holds', 'approved', 'approved_with_holds'].includes(meta.status)) {
    failures.push(`${META_PATH}: status is invalid`);
  }

  const outline = files[OUTLINE_PATH];
  if (outline === null) failures.push(`${OUTLINE_PATH}: required source file is missing`);
  else if (sha256CanonicalText(outline) !== meta.outline_sha256) failures.push(`${META_PATH}: outline_sha256 is stale`);

  if (!equal(meta.paragraph_order, EXPECTED_ORDER)) failures.push(`${META_PATH}: paragraph_order must contain the exact 12 Book 2 IDs in order`);
  if (!equal(meta.required_paragraph_fields, REQUIRED_FIELDS)) failures.push(`${META_PATH}: required_paragraph_fields changed`);

  const invariants = new Set(meta.semantic_invariants || []);
  const requiredInvariants = [
    'preview_or_familiarity_must_not_be_treated_as_mastery',
    'consolidation_paragraphs_introduce_no_new_terminal_theory',
    'outline_does_not_approve_paragraph_goals_or_targets',
    'target_quality_holds_must_remain_visible_until_separately_released',
  ];
  for (const invariant of requiredInvariants) {
    if (!invariants.has(invariant)) failures.push(`${META_PATH}: semantic invariant missing: ${invariant}`);
  }

  const authority = Array.isArray(meta.authority_sources) ? meta.authority_sources : [];
  if (!equal(authority.map((item) => item.path), AUTHORITY_PATHS)) {
    failures.push(`${META_PATH}: authority_sources must contain the exact ordered source set`);
  }
  for (const item of authority) {
    if (!AUTHORITY_PATHS.includes(item.path)) continue;
    const value = files[item.path];
    if (value === null) failures.push(`${item.path}: required authority source is missing`);
    else if (sha256CanonicalText(value) !== item.sha256) failures.push(`${META_PATH}: authority hash is stale for ${item.path}`);
  }
}

function checkTargetRegistry(failures, files, meta, registry) {
  if (!meta || !registry) return;
  const book2 = Array.isArray(registry.exercises)
    ? registry.exercises.filter((record) => /^2\.[123]\.[1234]$/.test(String(record.id || '')))
    : [];
  const paragraphs = Array.isArray(meta.paragraphs) ? meta.paragraphs : [];
  if (book2.length !== 12) failures.push(`${TARGET_REGISTRY_PATH}: expected exactly 12 Book 2 target records`);
  if (paragraphs.length !== 12) failures.push(`${META_PATH}: expected exactly 12 paragraph records`);

  const registryOrder = book2.map((record) => record.id);
  const metaOrder = paragraphs.map((paragraph) => paragraph.id);
  if (!equal(registryOrder, EXPECTED_ORDER)) failures.push(`${TARGET_REGISTRY_PATH}: Book 2 IDs are missing or reordered`);
  if (!equal(metaOrder, EXPECTED_ORDER)) failures.push(`${META_PATH}: paragraph IDs are missing or reordered`);

  for (let index = 0; index < EXPECTED_ORDER.length; index += 1) {
    const id = EXPECTED_ORDER[index];
    const record = book2[index];
    const paragraph = paragraphs[index];
    if (!record || !paragraph) continue;
    if (record.paragraph_kind !== EXPECTED_KINDS[index]) failures.push(`${TARGET_REGISTRY_PATH}: ${id} paragraph kind changed`);
    if (paragraph.kind !== record.paragraph_kind) failures.push(`${META_PATH}: ${id} paragraph kind does not match target registry`);
    if (paragraph.title !== record.paragraph_title) failures.push(`${META_PATH}: ${id} title does not match target registry`);
    if (paragraph.target_status !== record.record_status) failures.push(`${META_PATH}: ${id} target status does not match target registry`);
    if (paragraph.target_record_sha256 !== sha256(JSON.stringify(record))) {
      failures.push(`${META_PATH}: ${id} target record hash is stale`);
    }
    for (const field of REQUIRED_FIELDS) {
      if (!(field in paragraph)) failures.push(`${META_PATH}: ${id} required paragraph field is missing: ${field}`);
    }
    for (const field of ['prior_teaching', 'retrieval', 'interleave', 'operation_emphasis', 'misconception_boundary']) {
      if (!Array.isArray(paragraph[field]) || paragraph[field].length === 0) {
        failures.push(`${META_PATH}: ${id} ${field} must be a non-empty array`);
      }
    }
    if (!Array.isArray(paragraph.holds)) failures.push(`${META_PATH}: ${id} holds must be an array`);
    for (const field of ['role', 'chapter_dependency', 'readiness_verdict']) {
      if (typeof paragraph[field] !== 'string' || paragraph[field].trim() === '') {
        failures.push(`${META_PATH}: ${id} ${field} must be non-empty`);
      }
    }
    if (record.paragraph_kind === 'gemengde_opgaven') {
      const boundary = paragraph.misconception_boundary.join(' ').toLowerCase();
      if (!boundary.includes('no new terminal theory')) {
        failures.push(`${META_PATH}: ${id} consolidation boundary must prohibit new terminal theory`);
      }
    }
  }
}

function checkHolds(failures, meta) {
  if (!meta) return;
  const holds = Array.isArray(meta.holds) ? meta.holds : [];
  const ids = holds.map((hold) => hold.id);
  for (const id of CONTENT_HOLDS) {
    if (!ids.includes(id)) failures.push(`${META_PATH}: required hold is missing: ${id}`);
  }
  const reviewReady = meta.status === 'review_ready_with_holds';
  if (reviewReady && !ids.includes('H-OUTLINE-OWNER')) failures.push(`${META_PATH}: review-ready status requires H-OUTLINE-OWNER`);
  if (!reviewReady && ids.includes('H-OUTLINE-OWNER')) failures.push(`${META_PATH}: approved status must release H-OUTLINE-OWNER`);

  const holdSet = new Set(ids);
  for (const hold of holds) {
    if (!hold || typeof hold !== 'object' || !hold.id || !hold.severity || !Array.isArray(hold.scope) || !hold.summary || !Array.isArray(hold.blocks)) {
      failures.push(`${META_PATH}: every hold requires id, severity, scope, summary, and blocks`);
    }
  }
  for (const paragraph of meta.paragraphs || []) {
    for (const id of paragraph.holds || []) {
      if (!holdSet.has(id)) failures.push(`${META_PATH}: ${paragraph.id} references unknown hold ${id}`);
    }
    if (reviewReady && !(paragraph.holds || []).includes('H-OUTLINE-OWNER')) {
      failures.push(`${META_PATH}: ${paragraph.id} must retain H-OUTLINE-OWNER while approval is pending`);
    }
  }
}

function checkProse(failures, files, meta) {
  const requiredHeadings = [
    '## Authority and freshness',
    '## Purpose and position in the course',
    '## Entry prerequisites from Book 1',
    '## Book exit expectations',
    '## Chapter spine',
    '## Paragraph role matrix',
    '## Retrieval and interleaving schedule',
    '## Operation balance',
    '## Shared conventions',
    '## Common misconception map',
    '## Readiness and hold register',
  ];
  for (const heading of requiredHeadings) {
    requireText(failures, files, OUTLINE_PATH, new RegExp(`^${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm'), `missing required heading ${heading}`);
  }
  if (!meta) return;
  requireText(failures, files, OUTLINE_PATH, new RegExp(`Version: \`${escapeRegExp(meta.version)}\``), 'version does not match metadata');
  requireText(failures, files, OUTLINE_PATH, /Familiarity or preview that is not prerequisite mastery/, 'preview-versus-mastery boundary is missing');
  requireText(failures, files, OUTLINE_PATH, /Consolidation paragraphs introduce no new terminal theory\./, 'consolidation boundary is missing');
  for (const id of EXPECTED_ORDER) requireText(failures, files, OUTLINE_PATH, new RegExp(`\\b${id.replace(/\./g, '\\.')}\\b`), `paragraph ${id} is missing`);
  for (const id of CONTENT_HOLDS) requireText(failures, files, OUTLINE_PATH, new RegExp(id), `hold ${id} is missing`);

  const text = asText(files[OUTLINE_PATH]) || '';
  const unsafe = [
    /preview\s+(?:is|proves|counts as)\s+mastery/i,
    /familiarity\s+(?:is|proves|counts as)\s+mastery/i,
  ];
  for (const pattern of unsafe) {
    if (pattern.test(text)) failures.push(`${OUTLINE_PATH}: preview-to-mastery promotion detected`);
  }
}

function checkWorkflowPointers(failures, files, meta) {
  if (!meta) return;
  const pointers = Array.isArray(meta.workflow_pointers) ? meta.workflow_pointers : [];
  if (!equal(pointers.map((pointer) => pointer.path), WORKFLOW_POINTERS)) {
    failures.push(`${META_PATH}: workflow_pointers must contain the exact required surfaces`);
  }
  for (const file of WORKFLOW_POINTERS) {
    requireText(failures, files, file, /Book foundation check/i, 'Book foundation check is missing');
    requireText(failures, files, file, /references\/authored\/book-outlines\/book-2-outline\.md/, `must point to ${OUTLINE_PATH}`);
  }

  const pkg = parseJson(failures, files, 'package.json');
  if (pkg) {
    const scripts = pkg.scripts || {};
    if (scripts['check:book-outline-currentness'] !== 'node build-scripts/workflows/check-book-outline-currentness.js') {
      failures.push('package.json: check:book-outline-currentness script is missing or changed');
    }
    if (scripts['test:book-outline-currentness'] !== 'jest build-scripts/workflows/check-book-outline-currentness.test.js --runInBand') {
      failures.push('package.json: test:book-outline-currentness script is missing or changed');
    }
  }
  requireText(
    failures,
    files,
    '.github/workflows/platform-ci.yml',
    /- name: Validate Book 2 outline currentness\r?\n\s+run: npm run check:book-outline-currentness/,
    'platform CI wiring is missing'
  );
  requireText(failures, files, 'AGENT_GITHUB_ENTRY.md', /`build-scripts\/workflows\/check-book-outline-currentness\.js`/, 'GitHub entry map does not expose the checker');
}

function checkApprovedMode(failures, meta, requireApproved) {
  if (!requireApproved || !meta) return;
  const approval = meta.owner_approval || {};
  if (!['approved', 'approved_with_holds'].includes(meta.status)) failures.push(`${META_PATH}: approved mode requires approved or approved_with_holds status`);
  if (approval.status !== 'approved') failures.push(`${META_PATH}: approved mode requires owner_approval.status=approved`);
  if (approval.approved_version !== meta.version) failures.push(`${META_PATH}: approved_version must match version`);
  if (approval.approved_outline_sha256 !== meta.outline_sha256) failures.push(`${META_PATH}: approved_outline_sha256 must match outline_sha256`);
  if (!Number.isInteger(approval.approved_pr) || approval.approved_pr <= 0) failures.push(`${META_PATH}: approved_pr must be a positive PR number`);
  if (!/^[0-9a-f]{40}$/i.test(String(approval.approved_commit || ''))) failures.push(`${META_PATH}: approved_commit must be a full commit SHA`);
}

function findBookOutlineFailures(files = readFiles(), options = {}) {
  const failures = [];
  const meta = parseJson(failures, files, META_PATH);
  const registry = parseJson(failures, files, TARGET_REGISTRY_PATH);
  checkMetadata(failures, files, meta);
  checkTargetRegistry(failures, files, meta, registry);
  checkHolds(failures, meta);
  checkProse(failures, files, meta);
  checkWorkflowPointers(failures, files, meta);
  checkApprovedMode(failures, meta, options.requireApproved === true);
  return failures;
}

function parseCli(argv) {
  const options = { requireApproved: false, root: ROOT };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--require-approved') options.requireApproved = true;
    else if (argv[index] === '--root') {
      options.root = path.resolve(argv[index + 1]);
      index += 1;
    } else throw new Error(`Unknown argument: ${argv[index]}`);
  }
  return options;
}

function main() {
  let options;
  try {
    options = parseCli(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exit(2);
  }
  const failures = findBookOutlineFailures(readFiles(options.root), options);
  if (failures.length > 0) {
    console.error('Book 2 outline currentness: FAIL');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log('Book 2 outline currentness: PASS');
  console.log(`- outline: ${OUTLINE_PATH}`);
  console.log(`- paragraphs: ${EXPECTED_ORDER.length}`);
  console.log(`- mode: ${options.requireApproved ? 'approved-use' : 'structural-currentness'}`);
}

if (require.main === module) main();

module.exports = {
  AUTHORITY_PATHS,
  CONTENT_HOLDS,
  EXPECTED_ORDER,
  META_PATH,
  OUTLINE_PATH,
  REQUIRED_FIELDS,
  TARGET_REGISTRY_PATH,
  WORKFLOW_POINTERS,
  asText,
  findBookOutlineFailures,
  readFiles,
  sha256,
  sha256CanonicalText,
};
