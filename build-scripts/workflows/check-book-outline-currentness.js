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

const WORKFLOW_SURFACES = Object.freeze([
  'BUILD-PARAGRAPH.md',
  'BUILD-CHAPTER.md',
  'skills/econ-textbook-paragraph.md',
  'docs/workflows/textbook-paragraph-lane.md',
  'agents/teacher-learning-quality-review-agent.md',
  'build-scripts/templates/template-textbook-paragraph-plan.md',
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

const REGISTERED_ACTIONS = Object.freeze([
  'outline_approval',
  'goal_design',
  'target_design',
  'specialist_review',
  'goal_approval',
  'target_authority',
  'paragraph_production',
  'chapter_planning',
  'chapter_production',
  'lesson_authoring',
  'merge',
  'formal_output_choice_teaching',
]);

const FORBIDDEN_SEMANTIC_KEYS = Object.freeze(new Set([
  'semantic_invariants',
  'chapter_spine',
  'paragraph_order',
  'required_paragraph_fields',
  'paragraphs',
  'paragraph_title',
  'role',
  'chapter_dependency',
  'prior_teaching',
  'prerequisite_state',
  'prerequisites',
  'retrieval',
  'interleave',
  'operation_emphasis',
  'misconception_boundary',
  'readiness_verdict',
  'non_goals',
  'prepares_for',
  'model_conditions',
]));

const SOURCE_PATHS = Object.freeze([
  OUTLINE_PATH,
  META_PATH,
  ...AUTHORITY_PATHS,
  ...WORKFLOW_SURFACES,
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
  return Object.fromEntries(SOURCE_PATHS.map((file) => {
    const absolute = path.join(root, file);
    return [file, fs.existsSync(absolute) ? fs.readFileSync(absolute) : null];
  }));
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

function findForbiddenSemanticKeys(value, location = '$', found = []) {
  if (!value || typeof value !== 'object') return found;
  if (Array.isArray(value)) {
    value.forEach((item, index) => findForbiddenSemanticKeys(item, `${location}[${index}]`, found));
    return found;
  }
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_SEMANTIC_KEYS.has(key)) found.push(`${location}.${key}`);
    findForbiddenSemanticKeys(child, `${location}.${key}`, found);
  }
  return found;
}

function checkMetadata(failures, files, meta) {
  if (!meta) return;
  if (meta.schema_version !== 2) failures.push(`${META_PATH}: schema_version must equal 2`);
  if (meta.outline_id !== 'book-2') failures.push(`${META_PATH}: outline_id must equal book-2`);
  if (meta.audit_outcome !== 'VALID_WITH_DERIVED_OUTLINE_REQUIRED') {
    failures.push(`${META_PATH}: audit_outcome must remain VALID_WITH_DERIVED_OUTLINE_REQUIRED`);
  }
  if (!/^book-2-outline-v\d+/.test(String(meta.version || ''))) failures.push(`${META_PATH}: version is missing or invalid`);
  if (!['review_ready_with_holds', 'approved', 'approved_with_holds'].includes(meta.status)) failures.push(`${META_PATH}: status is invalid`);

  const semantic = meta.semantic_authority || {};
  if (semantic.path !== OUTLINE_PATH) failures.push(`${META_PATH}: semantic_authority.path must equal ${OUTLINE_PATH}`);
  if (semantic.rule !== 'canonical_human_semantics_live_only_in_markdown') {
    failures.push(`${META_PATH}: semantic authority rule is missing or changed`);
  }
  const outline = files[OUTLINE_PATH];
  if (outline === null) failures.push(`${OUTLINE_PATH}: required source file is missing`);
  else if (sha256CanonicalText(outline) !== semantic.sha256) failures.push(`${META_PATH}: semantic_authority.sha256 is stale`);

  for (const location of findForbiddenSemanticKeys(meta)) {
    failures.push(`${META_PATH}: semantic field is prohibited in machine metadata: ${location}`);
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
    ? registry.exercises.filter((record) => EXPECTED_ORDER.includes(String(record.id || '')))
    : [];
  const pins = Array.isArray(meta.target_registry_pins) ? meta.target_registry_pins : [];
  if (book2.length !== 12) failures.push(`${TARGET_REGISTRY_PATH}: expected exactly 12 Book 2 target records`);
  if (pins.length !== 12) failures.push(`${META_PATH}: expected exactly 12 compact target registry pins`);
  if (!equal(book2.map((record) => record.id), EXPECTED_ORDER)) failures.push(`${TARGET_REGISTRY_PATH}: Book 2 IDs are missing or reordered`);
  if (!equal(pins.map((pin) => pin.id), EXPECTED_ORDER)) failures.push(`${META_PATH}: target registry pin IDs are missing or reordered`);

  const allowedPinKeys = ['id', 'kind', 'target_status', 'target_record_sha256'];
  for (let index = 0; index < EXPECTED_ORDER.length; index += 1) {
    const id = EXPECTED_ORDER[index];
    const record = book2[index];
    const pin = pins[index];
    if (!record || !pin) continue;
    if (!equal(Object.keys(pin), allowedPinKeys)) failures.push(`${META_PATH}: ${id} target pin must stay compact and contain only identity/status/hash fields`);
    if (record.paragraph_kind !== EXPECTED_KINDS[index]) failures.push(`${TARGET_REGISTRY_PATH}: ${id} paragraph kind changed`);
    if (pin.kind !== record.paragraph_kind) failures.push(`${META_PATH}: ${id} paragraph kind does not match target registry`);
    if (pin.target_status !== record.record_status) failures.push(`${META_PATH}: ${id} target status does not match target registry`);
    if (pin.target_record_sha256 !== sha256(JSON.stringify(record))) failures.push(`${META_PATH}: ${id} target record hash is stale`);
  }
}

function holdScopeMatches(hold, options = {}) {
  const scope = Array.isArray(hold.scope) ? hold.scope : [];
  if (scope.includes('book-2')) return true;
  if (options.paragraph) {
    if (scope.includes(options.paragraph)) return true;
    const chapter = options.paragraph.split('.').slice(0, 2).join('.');
    if (scope.includes(chapter)) return true;
  }
  if (options.chapter) {
    if (scope.includes(options.chapter)) return true;
    if (scope.some((item) => /^2\.[123]\.[1234]$/.test(item) && item.startsWith(`${options.chapter}.`))) return true;
  }
  if (options.action === 'lesson_authoring' && scope.some((item) => item.startsWith('lesson_'))) return true;
  return false;
}

function blockingHoldsForAction(meta, options = {}) {
  if (!meta || !options.action) return [];
  return (meta.holds || []).filter((hold) => (
    hold.status === 'open'
    && holdScopeMatches(hold, options)
    && Array.isArray(hold.blocks)
    && hold.blocks.includes(options.action)
  ));
}

function checkHolds(failures, files, meta, options) {
  if (!meta) return;
  const holds = Array.isArray(meta.holds) ? meta.holds : [];
  const ids = holds.map((hold) => hold && hold.id);
  if (new Set(ids).size !== ids.length) failures.push(`${META_PATH}: hold IDs must be unique`);
  for (const hold of holds) {
    if (!hold || typeof hold !== 'object') {
      failures.push(`${META_PATH}: every hold must be an object`);
      continue;
    }
    for (const field of ['id', 'status', 'severity', 'scope', 'summary', 'blocks', 'permits', 'release_condition', 'release_evidence']) {
      if (!(field in hold)) failures.push(`${META_PATH}: ${hold.id || 'unknown hold'} is missing lifecycle field ${field}`);
    }
    if (!['open', 'released'].includes(hold.status)) failures.push(`${META_PATH}: ${hold.id} status must be open or released`);
    if (!Array.isArray(hold.scope) || hold.scope.length === 0 || hold.scope.some((item) => typeof item !== 'string' || item.trim() === '')) {
      failures.push(`${META_PATH}: ${hold.id} scope must be a non-empty string array`);
    }
    if (!Array.isArray(hold.blocks) || !Array.isArray(hold.permits)) failures.push(`${META_PATH}: ${hold.id} blocks and permits must be arrays`);
    const overlap = (hold.blocks || []).filter((action) => (hold.permits || []).includes(action));
    if (overlap.length > 0) failures.push(`${META_PATH}: ${hold.id} cannot both block and permit ${overlap.join(', ')}`);
    for (const action of [...(hold.blocks || []), ...(hold.permits || [])]) {
      if (!REGISTERED_ACTIONS.includes(action)) failures.push(`${META_PATH}: ${hold.id} uses unregistered action ${action}`);
    }
    if (typeof hold.release_condition !== 'string' || hold.release_condition.trim() === '') failures.push(`${META_PATH}: ${hold.id} release_condition must be non-empty`);
    if (hold.status === 'open' && hold.release_evidence !== null) failures.push(`${META_PATH}: open hold ${hold.id} must have null release_evidence`);
    if (hold.status === 'released') {
      const evidence = hold.release_evidence;
      if (!evidence || typeof evidence !== 'object'
          || typeof evidence.released_by !== 'string' || evidence.released_by.trim() === ''
          || !/^\d{4}-\d{2}-\d{2}$/.test(String(evidence.released_on || ''))
          || typeof evidence.evidence_ref !== 'string' || evidence.evidence_ref.trim() === '') {
        failures.push(`${META_PATH}: released hold ${hold.id} requires released_by, released_on, and evidence_ref`);
      }
    }
  }

  const ownerHold = holds.find((hold) => hold.id === 'H-OUTLINE-OWNER');
  if (meta.status === 'review_ready_with_holds' && (!ownerHold || ownerHold.status !== 'open')) {
    failures.push(`${META_PATH}: review-ready status requires open H-OUTLINE-OWNER`);
  }
  if (['approved', 'approved_with_holds'].includes(meta.status) && (!ownerHold || ownerHold.status !== 'released')) {
    failures.push(`${META_PATH}: approved status requires released H-OUTLINE-OWNER with evidence`);
  }

  const prose = asText(files[OUTLINE_PATH]) || '';
  const proseIds = [...prose.matchAll(/^\| `?(H-[A-Z0-9-]+)`? \|/gm)].map((match) => match[1]);
  for (const id of ids) if (!proseIds.includes(id)) failures.push(`${OUTLINE_PATH}: hold ${id} is missing from the human-readable register`);
  for (const id of proseIds) if (!ids.includes(id)) failures.push(`${META_PATH}: prose hold ${id} is missing from lifecycle metadata`);

  for (const hold of blockingHoldsForAction(meta, options)) {
    failures.push(`${META_PATH}: action ${options.action} is blocked by open hold ${hold.id} in matching scope`);
  }
}

function checkProse(failures, files, meta) {
  const headings = [
    '## Authority and freshness',
    '## Purpose and position in the course',
    '## Entry prerequisites from Book 1',
    '## Book exit expectations',
    '## Chapter spine',
    '## Paragraph role matrix',
    '### Canonical paragraph foundation dimensions',
    '## Retrieval and interleaving schedule',
    '## Operation balance',
    '## Shared conventions',
    '## Common misconception map',
    '## Readiness and hold register',
  ];
  for (const heading of headings) requireText(failures, files, OUTLINE_PATH, new RegExp(`^${escapeRegExp(heading)}$`, 'm'), `missing required heading ${heading}`);
  if (!meta) return;
  requireText(failures, files, OUTLINE_PATH, new RegExp(`Version: \`${escapeRegExp(meta.version)}\``), 'version does not match metadata');
  requireText(failures, files, OUTLINE_PATH, /canonical human semantic\s+authority/i, 'canonical semantic authority statement is missing');
  requireText(failures, files, OUTLINE_PATH, /Consolidation paragraphs introduce no new terminal theory\./, 'consolidation boundary is missing');
  for (const id of EXPECTED_ORDER) requireText(failures, files, OUTLINE_PATH, new RegExp(`^\\| ${escapeRegExp(id)} \\|`, 'm'), `canonical foundation dimensions row ${id} is missing`);
  for (const classification of [
    'previously_taught_probably_secure',
    'previously_taught_retrieval_required',
    'previously_taught_not_secure_enough_to_assume',
    'preview_or_familiarity_only',
    'new_formal_learning',
  ]) requireText(failures, files, OUTLINE_PATH, new RegExp(classification), `prerequisite classification is missing: ${classification}`);
  for (const phrase of [
    'Revenue; profit; break-even; marginal costs; `MO=MK`',
    'supply-as-MC bridge in §2.3.2',
    'production/capacity range',
    'linear `TVK` and constant `GVK` are bounded assumptions',
    'directly needed by the approved target and worked example',
  ]) requireText(failures, files, OUTLINE_PATH, new RegExp(escapeRegExp(phrase), 'i'), `required §2.1.1 foundation boundary is missing: ${phrase}`);
  const text = asText(files[OUTLINE_PATH]) || '';
  if (/mastered operations available|mastered Book 1/i.test(text)) failures.push(`${OUTLINE_PATH}: curricular prior teaching is overstated as mastery`);
}

function checkWorkflowSurfaces(failures, files, meta) {
  if (!meta) return;
  if (!equal(meta.workflow_surfaces, WORKFLOW_SURFACES)) failures.push(`${META_PATH}: workflow_surfaces must contain the exact required surfaces`);
  for (const file of WORKFLOW_SURFACES) requireText(failures, files, file, /references\/authored\/book-outlines\/book-2-outline\.md/, `must point to ${OUTLINE_PATH}`);
  for (const file of WORKFLOW_SURFACES.slice(0, 6)) requireText(failures, files, file, /Book foundation check/i, 'Book foundation check is missing');

  for (const file of ['BUILD-PARAGRAPH.md', 'skills/econ-textbook-paragraph.md', 'docs/workflows/textbook-paragraph-lane.md', 'build-scripts/templates/template-textbook-paragraph-plan.md']) {
    requireText(failures, files, file, /X\.Y\.Z-textbook-plan\.md/, 'Part A textbook-plan ownership is missing');
    requireText(failures, files, file, /Part A (?:owns|owned)/i, 'Part A ownership statement is missing');
  }
  requireText(failures, files, 'build-scripts/templates/template-paragraph-plan.md', /Part B companion implementation plan/, 'Part B plan ownership is missing');
  requireText(failures, files, 'build-scripts/templates/template-paragraph-plan.md', /consumes the approved/i, 'Part B consumption boundary is missing');
  requireText(failures, files, 'build-scripts/templates/template-paragraph-plan.md', /Part A `X\.Y\.Z-textbook-plan\.md`/i, 'Part B Part A-plan reference is missing');
  requireText(failures, files, 'build-scripts/templates/template-textbook-paragraph-plan.md', /Foundation verdict: `\[PASS_FOR_<ACTION> \| BLOCKED_FOR_<ACTION>\]`/, 'distinct action-specific foundation verdict is missing');

  const pkg = parseJson(failures, files, 'package.json');
  if (pkg) {
    const scripts = pkg.scripts || {};
    if (scripts['check:book-outline-currentness'] !== 'node build-scripts/workflows/check-book-outline-currentness.js') failures.push('package.json: check:book-outline-currentness script is missing or changed');
    if (scripts['test:book-outline-currentness'] !== 'jest build-scripts/workflows/check-book-outline-currentness.test.js --runInBand') failures.push('package.json: test:book-outline-currentness script is missing or changed');
  }
  requireText(failures, files, '.github/workflows/platform-ci.yml', /- name: Validate Book 2 outline currentness\r?\n\s+run: npm run check:book-outline-currentness/, 'platform CI wiring is missing');
  requireText(failures, files, 'AGENT_GITHUB_ENTRY.md', /`build-scripts\/workflows\/check-book-outline-currentness\.js`/, 'GitHub entry map does not expose the checker');
}

function checkApprovedMode(failures, meta, requireApproved) {
  if (!requireApproved || !meta) return;
  const approval = meta.owner_approval || {};
  const outlineHash = meta.semantic_authority && meta.semantic_authority.sha256;
  if (!['approved', 'approved_with_holds'].includes(meta.status)) failures.push(`${META_PATH}: approved mode requires approved or approved_with_holds status`);
  if (approval.status !== 'approved') failures.push(`${META_PATH}: approved mode requires owner_approval.status=approved`);
  if (approval.approved_version !== meta.version) failures.push(`${META_PATH}: approved_version must match version`);
  if (approval.approved_outline_sha256 !== outlineHash) failures.push(`${META_PATH}: approved_outline_sha256 must match semantic_authority.sha256`);
  if (!Number.isInteger(approval.approved_pr) || approval.approved_pr <= 0) failures.push(`${META_PATH}: approved_pr must be a positive PR number`);
  if (!/^[0-9a-f]{40}$/i.test(String(approval.approved_commit || ''))) failures.push(`${META_PATH}: approved_commit must be a full commit SHA`);
}

function findBookOutlineFailures(files = readFiles(), options = {}) {
  const failures = [];
  const meta = parseJson(failures, files, META_PATH);
  const registry = parseJson(failures, files, TARGET_REGISTRY_PATH);
  checkMetadata(failures, files, meta);
  checkTargetRegistry(failures, files, meta, registry);
  checkHolds(failures, files, meta, options);
  checkProse(failures, files, meta);
  checkWorkflowSurfaces(failures, files, meta);
  checkApprovedMode(failures, meta, options.requireApproved === true);
  return failures;
}

function parseCli(argv) {
  const options = { requireApproved: false, root: ROOT, action: null, paragraph: null, chapter: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--require-approved') options.requireApproved = true;
    else if (['--root', '--action', '--paragraph', '--chapter'].includes(arg)) {
      if (!argv[index + 1]) throw new Error(`${arg} requires a value`);
      const key = arg.slice(2);
      options[key] = key === 'root' ? path.resolve(argv[index + 1]) : argv[index + 1];
      index += 1;
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  if (options.action && !REGISTERED_ACTIONS.includes(options.action)) throw new Error(`Unknown action: ${options.action}`);
  if ((options.paragraph || options.chapter) && !options.action) throw new Error('--paragraph/--chapter requires --action');
  if (options.paragraph && options.chapter) throw new Error('Use either --paragraph or --chapter, not both');
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
  console.log(`- target pins: ${EXPECTED_ORDER.length}`);
  console.log(`- mode: ${options.requireApproved ? 'approved-use' : options.action ? `action:${options.action}` : 'structural-currentness'}`);
  if (options.paragraph) console.log(`- paragraph scope: ${options.paragraph}`);
  if (options.chapter) console.log(`- chapter scope: ${options.chapter}`);
}

if (require.main === module) main();

module.exports = {
  AUTHORITY_PATHS,
  EXPECTED_ORDER,
  FORBIDDEN_SEMANTIC_KEYS,
  META_PATH,
  OUTLINE_PATH,
  REGISTERED_ACTIONS,
  TARGET_REGISTRY_PATH,
  WORKFLOW_SURFACES,
  asText,
  blockingHoldsForAction,
  findBookOutlineFailures,
  holdScopeMatches,
  readFiles,
  sha256,
  sha256CanonicalText,
};
