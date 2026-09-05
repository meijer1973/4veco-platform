#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ownerDecision229 = require('./book2-owner-decision');

const ROOT = path.resolve(__dirname, '..', '..');
const OUTLINE_PATH = 'references/authored/book-outlines/book-2-outline.md';
const META_PATH = 'references/authored/book-outlines/book-2-outline.meta.json';
const TARGET_REGISTRY_PATH = 'references/authored/course-target-exercises.json';
const HOLD_PROJECTION_HEADER = '| Hold ID | Status | Scope | Blocks | Explicitly permits | Resolution actions | Transition binding | Release condition | Release evidence |';
const APPROVAL_PR_NUMBER = 226;
const LIFECYCLE_STATUS_PATTERN = /^Status: `[^`]+`$/;
const LIFECYCLE_OWNER_APPROVAL_PATTERN = /^Owner approval: `[^`]+`$/;
const RELEASE_EVIDENCE_FIELDS = Object.freeze([
  'resolved_via',
  'released_by',
  'released_on',
  'evidence_ref',
  'subject_id',
  'subject_sha256',
  'integrated_commit',
  'reviewed_pr',
  'reviewed_head',
]);
const TARGET_BINDING_FIELDS = Object.freeze([
  'blocked_baseline_sha256',
  'approved_replacement_sha256',
  'approval_ref',
  'approved_by',
  'approved_on',
]);
const CANDIDATE_BINDING_FIELDS = Object.freeze([
  'blocked_baseline_sha256',
  'candidate_replacement_sha256',
  'candidate_package_sha256',
  'candidate_evidence_ref',
  'candidate_status',
  'approved_replacement_sha256',
  'approval_ref',
  'approved_by',
  'approved_on',
]);
const CANDIDATE_STATUSES = Object.freeze([
  'implementation_candidate',
  'specialist_reviewed_candidate',
  'lead_reviewed_candidate',
]);
const ISSUE_229_REVIEW_PACKET = 'reports/review-gates/GATE-BOOK2-TARGET-AUTHORITY-REMEDIATION-1/review-packet.json';
const GOAL_BINDING_FIELDS = Object.freeze([
  'approved_goal_package_sha256',
  'approval_ref',
  'approved_by',
  'approved_on',
]);
const TARGET_BASELINE_BY_HOLD = Object.freeze({
  'H-211-TARGET-INTEGRATION': 'f01cd43c65e639e396a14b3dcfe5ed546ed7baa5cf8d2aa20a8bbe0c2c310de8',
  'H-212-STALE-REF': '51de36d4b150bcabb51b8391aff15bf5b68610f140b80d12ca3f021e663ae4b5',
  'H-213-DELTAQ': 'e06c097e50cb44ea41357125f224a60124c5a4d17f7eaeafae769f15bfe683fd',
  'H-231-V5': '078536130e88c1bc9c6a58fc492dc47ccf7a411bafc8b49b9571e1de238f0388',
  'H-232-V5': 'd1dba16d567f77717277206c1e01de3d69de5f3e5c2c68783835a81c1f7b9ab8',
  'H-233-V5-REF': '7ae371e71b3f805daa084c4a0ddf32498f8ded36acfc2f7e97a0d5f443a2d833',
  'H-234-PLACEHOLDER': '601f73e3ed958b4b6257e3ccad0a08c44138b2a2fa310bbcee8beedc120e856f',
  'H-229-211-CANDIDATE': '709535d15ab3c89b7cfe3bac27ae9a152044cbd7611057b3bdf0defec1cc3f34',
  'H-229-214-CANDIDATE': '7a4a01e133dcdf828f4f9d7b06209d1c51ca29ff98d83876dc026f8ba973ac24',
  'H-229-221-CANDIDATE': '4283adf5c6de9015c2daccc80b794183138ff4b7b9b5f4309bd7da80ef0304ed',
  'H-229-222-CANDIDATE': 'b939b9f4538d9e16f5eed3c8a1f9bca03b8a2380610776105a5c8d235795ffb1',
  'H-229-223-CANDIDATE': '5455130e28d15c2b70a77d55df346ca04c5a19d6c25da158c615fddd68ba3a17',
  'H-229-224-CANDIDATE': '5edc21a8f3977215674013fca251719d8000c34ab9736246f119a4ef21a1476b',
});
const CANDIDATE_HOLD_BY_PARAGRAPH = Object.freeze({
  '2.1.1': 'H-229-211-CANDIDATE',
  '2.1.2': 'H-212-STALE-REF',
  '2.1.3': 'H-213-DELTAQ',
  '2.1.4': 'H-229-214-CANDIDATE',
  '2.2.1': 'H-229-221-CANDIDATE',
  '2.2.2': 'H-229-222-CANDIDATE',
  '2.2.3': 'H-229-223-CANDIDATE',
  '2.2.4': 'H-229-224-CANDIDATE',
  '2.3.1': 'H-231-V5',
  '2.3.2': 'H-232-V5',
  '2.3.3': 'H-233-V5-REF',
  '2.3.4': 'H-234-PLACEHOLDER',
});

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
  'outline_owner_decision',
  'approved_outline_use',
  'goal_design',
  'target_design',
  'specialist_review',
  'goal_owner_decision',
  'approved_goal_use',
  'target_authority_repair',
  'target_authority_integration',
  'paragraph_production',
  'chapter_planning',
  'chapter_plan_repair',
  'chapter_production',
  'book_plan_repair',
  'book_readiness',
  'whole_book_assembly',
  'lesson_authoring',
  'merge_owner_decision',
  'merge',
  'formal_output_choice_teaching',
]);

const REGISTERED_SCOPES = Object.freeze(new Set([
  'book:2',
  'chapter:2.1', 'chapter:2.2', 'chapter:2.3',
  ...EXPECTED_ORDER.map((id) => `paragraph:${id}`),
  'route:long',
]));

const PARAGRAPH_SCOPED_ACTIONS = Object.freeze(new Set([
  'goal_design',
  'target_design',
  'goal_owner_decision',
  'approved_goal_use',
  'target_authority_repair',
  'target_authority_integration',
  'paragraph_production',
  'formal_output_choice_teaching',
]));

const CHAPTER_SCOPED_ACTIONS = Object.freeze(new Set([
  'chapter_planning',
  'chapter_plan_repair',
  'chapter_production',
]));

const BOOK_AGGREGATE_ACTIONS = Object.freeze(new Set([
  'book_readiness',
  'whole_book_assembly',
  'merge',
]));

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

function semanticAuthorityText(value) {
  const text = asText(value).replace(/\r\n?/g, '\n');
  const lines = text.split('\n').map((line) => {
    if (LIFECYCLE_STATUS_PATTERN.test(line)) return '<!-- lifecycle status is validated against metadata and excluded from the semantic hash -->';
    if (LIFECYCLE_OWNER_APPROVAL_PATTERN.test(line)) return '<!-- lifecycle owner approval is validated against metadata and excluded from the semantic hash -->';
    return line;
  });
  const headerIndex = lines.findIndex((line) => line.trim() === HOLD_PROJECTION_HEADER);
  if (headerIndex < 0) return text;
  let endIndex = headerIndex + 2;
  while (endIndex < lines.length && lines[endIndex].trim().startsWith('|')) endIndex += 1;
  return [
    ...lines.slice(0, headerIndex),
    '<!-- lifecycle hold projection is validated against metadata and excluded from the semantic hash -->',
    ...lines.slice(endIndex),
  ].join('\n');
}

function sha256SemanticAuthority(value) {
  return sha256(Buffer.from(semanticAuthorityText(value), 'utf8'));
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
  if (meta.schema_version !== 5) failures.push(`${META_PATH}: schema_version must equal 5`);
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
  if (semantic.hash_scope !== 'canonical_utf8_lf_excluding_validated_lifecycle_fields') {
    failures.push(`${META_PATH}: semantic authority hash_scope is missing or changed`);
  }
  const outline = files[OUTLINE_PATH];
  if (outline === null) failures.push(`${OUTLINE_PATH}: required source file is missing`);
  else if (sha256SemanticAuthority(outline) !== semantic.sha256) failures.push(`${META_PATH}: semantic_authority.sha256 is stale`);

  for (const location of findForbiddenSemanticKeys(meta)) {
    failures.push(`${META_PATH}: semantic field is prohibited in machine metadata: ${location}`);
  }

  if (!meta.approval_context || !equal(Object.keys(meta.approval_context), ['pr_number'])
      || meta.approval_context.pr_number !== APPROVAL_PR_NUMBER) {
    failures.push(`${META_PATH}: approval_context must bind this package to PR #${APPROVAL_PR_NUMBER}`);
  }
  const approval = meta.owner_approval || {};
  const approvalFields = [
    'status',
    'approved_version',
    'approved_outline_sha256',
    'approved_pr',
    'approved_commit',
    'decision_ref',
    'decided_on',
    'decided_by',
  ];
  if (!equal(Object.keys(approval), approvalFields)) failures.push(`${META_PATH}: owner_approval must contain the exact immutable binding fields`);
  if (!['pending', 'approved'].includes(approval.status)) failures.push(`${META_PATH}: owner_approval.status must be pending or approved`);
  if (approval.status === 'pending' && approvalFields.slice(1).some((field) => approval[field] !== null)) {
    failures.push(`${META_PATH}: pending owner approval must not contain decision binding values`);
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
  const scopes = Array.isArray(hold.scope) ? hold.scope : [];
  const paragraph = options.paragraph || null;
  const chapter = options.chapter || (paragraph ? paragraph.split('.').slice(0, 2).join('.') : null);

  return scopes.some((scope) => {
    if (scope === 'book:2') return true;
    if (scope.startsWith('chapter:')) {
      const scopedChapter = scope.slice('chapter:'.length);
      if (chapter === scopedChapter) return true;
      return BOOK_AGGREGATE_ACTIONS.has(options.action);
    }
    if (scope.startsWith('paragraph:')) {
      const scopedParagraph = scope.slice('paragraph:'.length);
      if (paragraph === scopedParagraph) return true;
      if (options.chapter && scopedParagraph.startsWith(`${options.chapter}.`)) return true;
      return BOOK_AGGREGATE_ACTIONS.has(options.action);
    }
    if (scope.startsWith('route:')) return scope === `route:${options.route || ''}`;
    return false;
  });
}

function inheritedBlockedActions(options = {}) {
  if (options.action === 'lesson_authoring') {
    return options.paragraph
      ? ['lesson_authoring', 'paragraph_production']
      : ['lesson_authoring', 'chapter_production', 'paragraph_production'];
  }
  if (options.action === 'chapter_production') return ['chapter_production', 'paragraph_production'];
  if (BOOK_AGGREGATE_ACTIONS.has(options.action)) return [options.action, 'chapter_production', 'paragraph_production'];
  return options.action ? [options.action] : [];
}

function blockingHoldsForAction(meta, options = {}) {
  if (!meta || !options.action) return [];
  const blockedActions = inheritedBlockedActions(options);
  return (meta.holds || []).filter((hold) => (
    hold.status === 'open'
    && holdScopeMatches(hold, options)
    && Array.isArray(hold.blocks)
    && hold.blocks.some((action) => blockedActions.includes(action))
  ));
}

function normalizeProjectionText(value) {
  return String(value || '').replace(/`/g, '').replace(/\s+/g, ' ').trim();
}

function parseProjectionList(value) {
  const normalized = normalizeProjectionText(value);
  if (normalized === '' || normalized === '—') return [];
  return normalized.split(',').map((item) => item.trim()).filter(Boolean);
}

function formatProjectionList(values) {
  return Array.isArray(values) && values.length > 0
    ? values.map((value) => `\`${value}\``).join(', ')
    : '—';
}

function formatReleaseEvidence(evidence) {
  if (evidence === null || evidence === undefined) return '—';
  return RELEASE_EVIDENCE_FIELDS
    .filter((field) => Object.prototype.hasOwnProperty.call(evidence, field))
    .map((field) => `${field}=${evidence[field]}`)
    .join('; ');
}

function formatBinding(binding, fields) {
  if (!binding) return '—';
  return fields.map((field) => `${field}=${binding[field] === null ? 'pending' : binding[field]}`).join('; ');
}

function formatTransitionBinding(hold) {
  if (hold.target_binding) return formatBinding(hold.target_binding, TARGET_BINDING_FIELDS);
  if (hold.candidate_binding) return formatBinding(hold.candidate_binding, CANDIDATE_BINDING_FIELDS);
  if (hold.goal_binding) return formatBinding(hold.goal_binding, GOAL_BINDING_FIELDS);
  return '—';
}

function formatHoldProjectionRow(hold) {
  return `| \`${hold.id}\` | ${hold.status} | ${formatProjectionList(hold.scope)} | ${formatProjectionList(hold.blocks)} | ${formatProjectionList(hold.permits)} | ${formatProjectionList(hold.resolution_actions)} | ${formatTransitionBinding(hold)} | ${hold.release_condition} | ${formatReleaseEvidence(hold.release_evidence)} |`;
}

function parseHoldProjectionTable(failures, files) {
  const prose = asText(files[OUTLINE_PATH]) || '';
  const lines = prose.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => line.trim() === HOLD_PROJECTION_HEADER);
  if (headerIndex < 0) {
    failures.push(`${OUTLINE_PATH}: lifecycle hold projection header is missing or changed`);
    return [];
  }

  const projections = [];
  for (let index = headerIndex + 2; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line.startsWith('|')) break;
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length !== 9) {
      failures.push(`${OUTLINE_PATH}: lifecycle hold projection row must contain exactly 9 fields: ${line}`);
      continue;
    }
    projections.push({
      id: normalizeProjectionText(cells[0]),
      status: normalizeProjectionText(cells[1]),
      scope: parseProjectionList(cells[2]),
      blocks: parseProjectionList(cells[3]),
      permits: parseProjectionList(cells[4]),
      resolution_actions: parseProjectionList(cells[5]),
      transition_binding: normalizeProjectionText(cells[6]),
      release_condition: normalizeProjectionText(cells[7]),
      release_evidence: normalizeProjectionText(cells[8]) === '—' ? null : normalizeProjectionText(cells[8]),
    });
  }
  return projections;
}

function bindingFieldsAreNull(binding, fields) {
  return fields.every((field) => binding[field] === null);
}

function gitRun(root, args) {
  return spawnSync('git', args, { cwd: root, encoding: 'utf8' });
}

function targetRecordAtIntegratedCommit(failures, gitRoot, commit, subjectId) {
  if (!/^[0-9a-f]{40}$/i.test(String(commit || ''))) return null;
  const exists = gitRun(gitRoot, ['cat-file', '-e', `${commit}^{commit}`]);
  if (exists.status !== 0) {
    failures.push(`${META_PATH}: integrated_commit ${commit} does not resolve to a real commit`);
    return null;
  }
  const ancestor = gitRun(gitRoot, ['merge-base', '--is-ancestor', commit, 'HEAD']);
  if (ancestor.status !== 0) {
    failures.push(`${META_PATH}: integrated_commit ${commit} is not an ancestor of the current repository state`);
    return null;
  }
  const shown = gitRun(gitRoot, ['show', `${commit}:${TARGET_REGISTRY_PATH}`]);
  if (shown.status !== 0) {
    failures.push(`${META_PATH}: integrated_commit ${commit} does not contain ${TARGET_REGISTRY_PATH}`);
    return null;
  }
  let registry;
  try {
    registry = JSON.parse(shown.stdout);
  } catch (error) {
    failures.push(`${META_PATH}: integrated_commit ${commit} contains an invalid target registry: ${error.message}`);
    return null;
  }
  const record = Array.isArray(registry.exercises)
    ? registry.exercises.find((item) => item.id === subjectId)
    : null;
  if (!record) failures.push(`${META_PATH}: integrated_commit ${commit} does not contain target record ${subjectId}`);
  return record || null;
}

function releasedPinHasExactSuccessor(hold, pin, holds, seen = new Set()) {
  if (!pin || seen.has(hold.id)) return false;
  const approved = hold.target_binding?.approved_replacement_sha256;
  if (pin.target_record_sha256 === approved) return true;
  seen.add(hold.id);
  const scope = `paragraph:${pin.id}`;
  const successors = holds.filter((next) => next.id !== hold.id
    && equal(next.scope, [scope])
    && equal(next.resolution_actions, ['target_authority_integration'])
    && (next.candidate_binding || next.target_binding)?.blocked_baseline_sha256 === approved);
  if (successors.length !== 1) return false;
  const next = successors[0];
  if (next.status === 'released' && next.target_binding && !next.candidate_binding) {
    return releasedPinHasExactSuccessor(next, pin, holds, seen);
  }
  const binding = next.candidate_binding || next.target_binding;
  const replacement = next.candidate_binding ? binding.candidate_replacement_sha256 : binding.approved_replacement_sha256;
  return next.status === 'open' && next.release_evidence === null
    && next.blocks?.includes('paragraph_production')
    && /^[0-9a-f]{64}$/i.test(String(replacement || ''))
    && replacement !== approved && pin.target_record_sha256 === replacement;
}

function checkTargetBinding(failures, hold, pin, holds) {
  const binding = hold.target_binding;
  if (!binding || !equal(Object.keys(binding), TARGET_BINDING_FIELDS)) {
    failures.push(`${META_PATH}: ${hold.id} must contain the exact target transition binding fields`);
    return;
  }
  if (!/^[0-9a-f]{64}$/i.test(String(binding.blocked_baseline_sha256 || ''))) {
    failures.push(`${META_PATH}: ${hold.id} requires a full blocked_baseline_sha256`);
  }
  if (binding.blocked_baseline_sha256 !== TARGET_BASELINE_BY_HOLD[hold.id]) {
    failures.push(`${META_PATH}: ${hold.id} blocked_baseline_sha256 must match the original reviewed baseline`);
  }
  const replacementFields = TARGET_BINDING_FIELDS.slice(1);
  const replacementIsPending = binding.approved_replacement_sha256 === null;
  if (replacementIsPending) {
    if (!bindingFieldsAreNull(binding, replacementFields)) failures.push(`${META_PATH}: ${hold.id} pending replacement binding must keep all approval values null`);
    if (pin && pin.target_record_sha256 !== binding.blocked_baseline_sha256) failures.push(`${META_PATH}: ${hold.id} changed from its blocked baseline without an approved replacement`);
    if (hold.status === 'released') failures.push(`${META_PATH}: released target hold ${hold.id} requires an approved replacement binding`);
    return;
  }
  if (!/^[0-9a-f]{64}$/i.test(String(binding.approved_replacement_sha256 || ''))
      || binding.approved_replacement_sha256 === binding.blocked_baseline_sha256) {
    failures.push(`${META_PATH}: ${hold.id} approved replacement hash must be full and differ from the blocked baseline`);
  }
  if (typeof binding.approval_ref !== 'string' || binding.approval_ref.trim() === ''
      || typeof binding.approved_by !== 'string' || binding.approved_by.trim() === ''
      || !/^\d{4}-\d{2}-\d{2}$/.test(String(binding.approved_on || ''))) {
    failures.push(`${META_PATH}: ${hold.id} approved replacement requires approval_ref, approved_by, and approved_on`);
  }
  if (hold.status === 'open' && pin && ![binding.blocked_baseline_sha256, binding.approved_replacement_sha256].includes(pin.target_record_sha256)) {
    failures.push(`${META_PATH}: ${hold.id} current target is neither the blocked baseline nor the approved replacement`);
  }
  if (hold.status === 'released' && !releasedPinHasExactSuccessor(hold, pin, holds)) {
    failures.push(`${META_PATH}: released target ${hold.id} current pin must match approved replacement or an exact active successor`);
  }
}

function checkCandidateBinding(failures, hold, pin) {
  const binding = hold.candidate_binding;
  if (!binding || !equal(Object.keys(binding), CANDIDATE_BINDING_FIELDS)) {
    failures.push(`${META_PATH}: ${hold.id} must contain the exact candidate transition binding fields`);
    return;
  }
  if (!/^[0-9a-f]{64}$/i.test(String(binding.blocked_baseline_sha256 || ''))
      || binding.blocked_baseline_sha256 !== TARGET_BASELINE_BY_HOLD[hold.id]) {
    failures.push(`${META_PATH}: ${hold.id} blocked_baseline_sha256 must match the original reviewed baseline`);
  }
  if (!/^[0-9a-f]{64}$/i.test(String(binding.candidate_replacement_sha256 || ''))
      || binding.candidate_replacement_sha256 === binding.blocked_baseline_sha256) {
    failures.push(`${META_PATH}: ${hold.id} candidate replacement hash must be full and differ from the blocked baseline`);
  }
  if (!/^[0-9a-f]{64}$/i.test(String(binding.candidate_package_sha256 || ''))) {
    failures.push(`${META_PATH}: ${hold.id} requires a full candidate_package_sha256`);
  }
  if (typeof binding.candidate_evidence_ref !== 'string' || binding.candidate_evidence_ref.trim() === '') {
    failures.push(`${META_PATH}: ${hold.id} requires candidate_evidence_ref`);
  }
  if (!CANDIDATE_STATUSES.includes(binding.candidate_status)) {
    failures.push(`${META_PATH}: ${hold.id} candidate_status is invalid`);
  }
  if (!bindingFieldsAreNull(binding, CANDIDATE_BINDING_FIELDS.slice(5))) {
    const approvalComplete = /^[0-9a-f]{64}$/i.test(String(binding.approved_replacement_sha256 || ''))
      && binding.approved_replacement_sha256 === binding.candidate_replacement_sha256
      && typeof binding.approval_ref === 'string' && binding.approval_ref.trim() !== ''
      && typeof binding.approved_by === 'string' && binding.approved_by.trim() !== ''
      && /^\d{4}-\d{2}-\d{2}$/.test(String(binding.approved_on || ''));
    if (!approvalComplete) failures.push(`${META_PATH}: ${hold.id} candidate approval must be complete and bind the exact candidate hash`);
    if (binding.candidate_status !== 'lead_reviewed_candidate') {
      failures.push(`${META_PATH}: ${hold.id} candidate approval requires candidate_status lead_reviewed_candidate`);
    }
  }
  if (binding.candidate_status === 'lead_reviewed_candidate' && binding.candidate_evidence_ref !== ISSUE_229_REVIEW_PACKET) {
    failures.push(`${META_PATH}: ${hold.id} lead-reviewed candidate evidence must point to the exact Issue #229 review packet`);
  }
  if (pin && ![binding.blocked_baseline_sha256, binding.candidate_replacement_sha256].includes(pin.target_record_sha256)) {
    failures.push(`${META_PATH}: ${hold.id} current target is neither its baseline nor candidate replacement`);
  }
}

function checkGoalBinding(failures, hold) {
  const binding = hold.goal_binding;
  if (!binding || !equal(Object.keys(binding), GOAL_BINDING_FIELDS)) {
    failures.push(`${META_PATH}: ${hold.id} must contain the exact goal-package binding fields`);
    return;
  }
  if (hold.status === 'open') {
    if (!bindingFieldsAreNull(binding, GOAL_BINDING_FIELDS)) failures.push(`${META_PATH}: open goal hold ${hold.id} must keep goal-package approval values null`);
    return;
  }
  if (!/^[0-9a-f]{64}$/i.test(String(binding.approved_goal_package_sha256 || ''))
      || typeof binding.approval_ref !== 'string' || binding.approval_ref.trim() === ''
      || typeof binding.approved_by !== 'string' || binding.approved_by.trim() === ''
      || !/^\d{4}-\d{2}-\d{2}$/.test(String(binding.approved_on || ''))) {
    failures.push(`${META_PATH}: released goal hold ${hold.id} requires an exact approved goal-package hash and approval identity/date/reference`);
  }
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
    for (const field of ['id', 'status', 'severity', 'scope', 'summary', 'blocks', 'permits', 'resolution_actions', 'release_condition', 'release_evidence']) {
      if (!(field in hold)) failures.push(`${META_PATH}: ${hold.id || 'unknown hold'} is missing lifecycle field ${field}`);
    }
    if (!['open', 'released'].includes(hold.status)) failures.push(`${META_PATH}: ${hold.id} status must be open or released`);
    if (!Array.isArray(hold.scope) || hold.scope.length === 0 || hold.scope.some((item) => typeof item !== 'string' || item.trim() === '')) {
      failures.push(`${META_PATH}: ${hold.id} scope must be a non-empty string array`);
    }
    for (const scope of hold.scope || []) {
      if (!REGISTERED_SCOPES.has(scope)) failures.push(`${META_PATH}: ${hold.id} uses unregistered typed scope ${scope}`);
    }
    if (new Set(hold.scope || []).size !== (hold.scope || []).length) failures.push(`${META_PATH}: ${hold.id} scope values must be unique`);
    if (!Array.isArray(hold.blocks) || !Array.isArray(hold.permits) || !Array.isArray(hold.resolution_actions)) {
      failures.push(`${META_PATH}: ${hold.id} blocks, permits, and resolution_actions must be arrays`);
    }
    const overlap = (hold.blocks || []).filter((action) => (hold.permits || []).includes(action));
    if (overlap.length > 0) failures.push(`${META_PATH}: ${hold.id} cannot both block and permit ${overlap.join(', ')}`);
    if (!Array.isArray(hold.resolution_actions) || hold.resolution_actions.length !== 1) {
      failures.push(`${META_PATH}: ${hold.id} requires exactly one resolution action; split independent lifecycle milestones into separate holds`);
    }
    for (const action of [...(hold.blocks || []), ...(hold.permits || []), ...(hold.resolution_actions || [])]) {
      if (!REGISTERED_ACTIONS.includes(action)) failures.push(`${META_PATH}: ${hold.id} uses unregistered action ${action}`);
    }
    for (const action of hold.resolution_actions || []) {
      if (!(hold.permits || []).includes(action)) failures.push(`${META_PATH}: ${hold.id} resolution action ${action} must be explicitly permitted`);
      if ((hold.blocks || []).includes(action)) failures.push(`${META_PATH}: ${hold.id} resolution action ${action} cannot be blocked by the same hold`);
    }
    if (typeof hold.release_condition !== 'string' || hold.release_condition.trim() === '') failures.push(`${META_PATH}: ${hold.id} release_condition must be non-empty`);
    const isTargetIntegrationHold = (hold.resolution_actions || []).includes('target_authority_integration');
    const paragraphScopes = (hold.scope || []).filter((scope) => scope.startsWith('paragraph:'));
    const subjectId = paragraphScopes.length === 1 ? paragraphScopes[0].slice('paragraph:'.length) : null;
    const pin = (meta.target_registry_pins || []).find((item) => item.id === subjectId);
    if (isTargetIntegrationHold) {
      if (hold.status === 'open' && hold.candidate_binding) checkCandidateBinding(failures, hold, pin);
      else checkTargetBinding(failures, hold, pin, holds);
      const transitionBinding = hold.candidate_binding || hold.target_binding;
      if (options.action === 'target_authority_integration' && hold.status === 'open' && holdScopeMatches(hold, options)) {
        if (meta.issue_229_owner_decision?.integration_authorized === false) {
          failures.push(`${META_PATH}: ${hold.id} content approval does not authorize target integration`);
        }
        if (hold.candidate_binding && hold.candidate_binding.candidate_status !== 'lead_reviewed_candidate') {
          failures.push(`${META_PATH}: action target_authority_integration requires lead_reviewed_candidate status for ${hold.id}`);
        }
        if (!transitionBinding || transitionBinding.approved_replacement_sha256 === null) {
          failures.push(`${META_PATH}: action target_authority_integration requires an exact approved replacement binding for ${hold.id}`);
        }
      }
    } else if ('target_binding' in hold || 'candidate_binding' in hold) failures.push(`${META_PATH}: non-target hold ${hold.id} must not contain a target transition binding`);
    if (hold.id === 'H-211-GATE0B1') checkGoalBinding(failures, hold);
    else if ('goal_binding' in hold) failures.push(`${META_PATH}: only H-211-GATE0B1 may contain goal_binding`);
    if (hold.status === 'open' && hold.release_evidence !== null) failures.push(`${META_PATH}: open hold ${hold.id} must have null release_evidence`);
    if (hold.status === 'released') {
      const evidence = hold.release_evidence;
      if (!evidence || typeof evidence !== 'object'
          || typeof evidence.resolved_via !== 'string' || !(hold.resolution_actions || []).includes(evidence.resolved_via)
          || typeof evidence.released_by !== 'string' || evidence.released_by.trim() === ''
          || !/^\d{4}-\d{2}-\d{2}$/.test(String(evidence.released_on || ''))
          || typeof evidence.evidence_ref !== 'string' || evidence.evidence_ref.trim() === '') {
        failures.push(`${META_PATH}: released hold ${hold.id} requires resolved_via, released_by, released_on, and evidence_ref bound to its resolution action`);
      }

      if (evidence && evidence.resolved_via === 'target_authority_integration') {
        const evidenceFields = RELEASE_EVIDENCE_FIELDS.slice(0, 7);
        const binding = hold.target_binding || {};
        if (!equal(Object.keys(evidence), evidenceFields)) {
          failures.push(`${META_PATH}: target integration release ${hold.id} must contain the exact integration evidence fields`);
        }
        if (!subjectId || evidence.subject_id !== subjectId) failures.push(`${META_PATH}: target integration release ${hold.id} subject_id must match its single paragraph scope`);
        if (evidence.subject_sha256 !== binding.approved_replacement_sha256) failures.push(`${META_PATH}: target integration release ${hold.id} must match the exact approved replacement hash`);
        if (evidence.subject_sha256 === binding.blocked_baseline_sha256) failures.push(`${META_PATH}: target integration release ${hold.id} cannot reuse the blocked baseline hash`);
        if (!/^[0-9a-f]{40}$/i.test(String(evidence.integrated_commit || ''))) failures.push(`${META_PATH}: target integration release ${hold.id} requires a full integrated_commit SHA`);
        const integratedRecord = targetRecordAtIntegratedCommit(
          failures,
          options.gitRoot || files.__integrationGitRoot || options.root || ROOT,
          evidence.integrated_commit,
          subjectId,
        );
        if (integratedRecord && sha256(JSON.stringify(integratedRecord)) !== evidence.subject_sha256) {
          failures.push(`${META_PATH}: integrated_commit ${evidence.integrated_commit} contains a different target hash for ${subjectId}`);
        }
        if (integratedRecord && integratedRecord.record_status !== 'reviewed_final'
            && !(integratedRecord.record_status === 'candidate_review_ready'
              && hold.id === CANDIDATE_HOLD_BY_PARAGRAPH[subjectId]
              && ownerDecision229.hasApprovedFrozenRecord(meta, integratedRecord, binding))) {
          failures.push(`${META_PATH}: target integration release ${hold.id} requires reviewed_final or explicit immutable frozen-package owner approval`);
        }
      } else if (evidence && hold.id === 'H-OUTLINE-OWNER') {
        const evidenceFields = [...RELEASE_EVIDENCE_FIELDS.slice(0, 6), 'reviewed_pr', 'reviewed_head'];
        if (!equal(Object.keys(evidence), evidenceFields)) {
          failures.push(`${META_PATH}: owner release must contain the exact reviewed-head evidence fields`);
        }
        if (evidence.resolved_via !== 'outline_owner_decision') failures.push(`${META_PATH}: owner release must resolve via outline_owner_decision`);
        if (evidence.subject_id !== meta.version) failures.push(`${META_PATH}: owner release subject_id must match the approved outline version`);
        const supersededHash = meta.issue_229_owner_decision && ownerDecision229.validateEiDecision(meta).length === 0
          ? ownerDecision229.OLD_OUTLINE_HASH : (meta.semantic_authority || {}).sha256;
        if (evidence.subject_sha256 !== supersededHash) failures.push(`${META_PATH}: owner release subject_sha256 must match the semantic outline hash`);
        if (evidence.reviewed_pr !== (meta.approval_context || {}).pr_number) failures.push(`${META_PATH}: owner release reviewed_pr must match approval_context.pr_number`);
        if (!/^[0-9a-f]{40}$/i.test(String(evidence.reviewed_head || ''))) failures.push(`${META_PATH}: owner release requires a full reviewed_head SHA`);
      } else if (evidence && hold.id === 'H-229-EI-SUPERSESSION') {
        failures.push(...ownerDecision229.validateEiDecision(meta));
      } else if (evidence && hold.id === 'H-211-GATE0B1') {
        const evidenceFields = RELEASE_EVIDENCE_FIELDS.slice(0, 6);
        const binding = hold.goal_binding || {};
        if (!equal(Object.keys(evidence), evidenceFields)) failures.push(`${META_PATH}: goal release must contain the exact goal-package evidence fields`);
        if (evidence.resolved_via !== 'goal_owner_decision') failures.push(`${META_PATH}: goal release must resolve via goal_owner_decision`);
        if (evidence.subject_id !== '2.1.1-goal-package') failures.push(`${META_PATH}: goal release subject_id must identify the §2.1.1 goal package`);
        if (evidence.subject_sha256 !== binding.approved_goal_package_sha256) failures.push(`${META_PATH}: goal release subject_sha256 must match the approved goal-package hash`);
        if (evidence.evidence_ref !== binding.approval_ref
            || evidence.released_by !== binding.approved_by
            || evidence.released_on !== binding.approved_on) {
          failures.push(`${META_PATH}: goal release evidence must match the exact goal-package approval reference, identity, and date`);
        }
      } else if (evidence && !equal(Object.keys(evidence), RELEASE_EVIDENCE_FIELDS.slice(0, 4))) {
        failures.push(`${META_PATH}: released hold ${hold.id} must contain only the exact basic release evidence fields`);
      }
    }
  }

  const candidateHolds = holds.filter((hold) => hold && hold.status === 'open' && hold.candidate_binding);
  if (candidateHolds.length > 0) {
    const expectedCandidateIds = EXPECTED_ORDER.map((paragraph) => CANDIDATE_HOLD_BY_PARAGRAPH[paragraph]);
    const actualCandidateIds = candidateHolds.map((hold) => hold.id);
    if ((meta.issue_229_candidate || {}).approval_status === 'pending' && !equal(actualCandidateIds, expectedCandidateIds)) {
      failures.push(`${META_PATH}: Issue #229 candidate holds must cover all twelve paragraphs in canonical order`);
    }
    let registry = null;
    try { registry = JSON.parse(asText(files[TARGET_REGISTRY_PATH])); } catch (_) { /* registry parse failure is reported elsewhere */ }
    const records = registry && Array.isArray(registry.exercises)
      ? EXPECTED_ORDER.map((id) => registry.exercises.find((record) => record.id === id)).filter(Boolean)
      : [];
    const packageHash = records.length === EXPECTED_ORDER.length ? sha256(JSON.stringify(records)) : null;
    for (const hold of candidateHolds) {
      const paragraph = Object.keys(CANDIDATE_HOLD_BY_PARAGRAPH).find((id) => CANDIDATE_HOLD_BY_PARAGRAPH[id] === hold.id);
      const binding = hold.candidate_binding;
      if (!binding) continue;
      if (binding.candidate_package_sha256 !== packageHash) failures.push(`${META_PATH}: ${hold.id} candidate package hash is stale`);
      if (!binding.candidate_evidence_ref.includes('BOOK2-TARGET-AUTHORITY-REMEDIATION-1')) {
        failures.push(`${META_PATH}: ${hold.id} candidate evidence must identify the Issue #229 sprint`);
      }
      const paragraphScopesForHold = (hold.scope || []).filter((scope) => scope.startsWith('paragraph:'));
      if (!equal(paragraphScopesForHold, [`paragraph:${paragraph}`])) failures.push(`${META_PATH}: ${hold.id} candidate scope must match ${paragraph}`);
    }
  }

  const ownerHold = holds.find((hold) => hold.id === 'H-OUTLINE-OWNER');
  if (meta.status === 'review_ready_with_holds' && (!ownerHold || ownerHold.status !== 'open')) {
    failures.push(`${META_PATH}: review-ready status requires open H-OUTLINE-OWNER`);
  }
  if (['approved', 'approved_with_holds'].includes(meta.status) && (!ownerHold || ownerHold.status !== 'released')) {
    failures.push(`${META_PATH}: approved status requires released H-OUTLINE-OWNER with evidence`);
  }

  const projections = parseHoldProjectionTable(failures, files);
  const projectedIds = projections.map((projection) => projection.id);
  if (new Set(projectedIds).size !== projectedIds.length) failures.push(`${OUTLINE_PATH}: projected hold IDs must be unique`);
  for (const id of ids) if (!projectedIds.includes(id)) failures.push(`${OUTLINE_PATH}: hold ${id} is missing from the human-readable register`);
  for (const id of projectedIds) if (!ids.includes(id)) failures.push(`${META_PATH}: prose hold ${id} is missing from lifecycle metadata`);
  const projectionById = new Map(projections.map((projection) => [projection.id, projection]));
  for (const hold of holds) {
    if (!hold || !projectionById.has(hold.id)) continue;
    const projection = projectionById.get(hold.id);
    const comparisons = [
      ['status', projection.status, hold.status],
      ['scope', projection.scope, hold.scope],
      ['blocks', projection.blocks, hold.blocks],
      ['permits', projection.permits, hold.permits],
      ['resolution_actions', projection.resolution_actions, hold.resolution_actions],
      ['transition_binding', projection.transition_binding, normalizeProjectionText(formatTransitionBinding(hold))],
      ['release_condition', projection.release_condition, normalizeProjectionText(hold.release_condition)],
      ['release_evidence', projection.release_evidence, hold.release_evidence === null ? null : normalizeProjectionText(formatReleaseEvidence(hold.release_evidence))],
    ];
    for (const [field, actual, expected] of comparisons) {
      if (!equal(actual, expected)) failures.push(`${OUTLINE_PATH}: hold ${hold.id} projection mismatch for ${field}`);
    }
  }

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
  requireText(failures, files, OUTLINE_PATH, new RegExp(`^Version: \`${escapeRegExp(meta.version)}\`\\r?$`, 'm'), 'version does not match metadata');
  requireText(failures, files, OUTLINE_PATH, new RegExp(`^Status: \`${escapeRegExp(meta.status)}\`\\r?$`, 'm'), 'status does not match metadata');
  requireText(failures, files, OUTLINE_PATH, new RegExp(`^Owner approval: \`${escapeRegExp((meta.owner_approval || {}).status)}\`\\r?$`, 'm'), 'owner approval status does not match metadata');
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

  requireText(failures, files, 'AGENT_GITHUB_ENTRY.md', /Part A.*template-textbook-paragraph-plan\.md/i, 'GitHub entry map must route Part A to the textbook-plan template');
  requireText(failures, files, 'AGENT_GITHUB_ENTRY.md', /template-paragraph-plan\.md.*only for Part B/i, 'GitHub entry map must reserve the companion-plan template for Part B');
  requireText(failures, files, 'AGENT_GITHUB_ENTRY.md', /structural currentness.*action-specific check.*--require-approved/is, 'GitHub entry map must state structural, action-specific, then approved-use routing');
  requireText(failures, files, 'AGENT_GITHUB_ENTRY.md', /--require-approved.*approved authority, production, or integration/i, 'GitHub entry map must scope approved-use mode to approved authority, production, or integration');

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
  if (!meta) return;
  const approval = meta.owner_approval || {};
  const outlineHash = meta.semantic_authority && meta.semantic_authority.sha256;
  const ownerHold = (meta.holds || []).find((hold) => hold.id === 'H-OUTLINE-OWNER');
  const evidence = ownerHold && ownerHold.release_evidence;
  const approvalIsRequired = requireApproved || ['approved', 'approved_with_holds'].includes(meta.status) || approval.status === 'approved';
  if (!approvalIsRequired) return;
  if (requireApproved) {
    for (const hold of meta.holds || []) {
      if (hold.status === 'open' && hold.candidate_binding) failures.push(`${META_PATH}: approved-use mode is blocked by open candidate hold ${hold.id}`);
      if (hold.status === 'open' && hold.id === 'H-229-EI-SUPERSESSION') failures.push(`${META_PATH}: approved-use mode is blocked by open Ei supersession hold ${hold.id}`);
    }
  }
  if (!['approved', 'approved_with_holds'].includes(meta.status)) failures.push(`${META_PATH}: approved mode requires approved or approved_with_holds status`);
  if (approval.status !== 'approved') failures.push(`${META_PATH}: approved mode requires owner_approval.status=approved`);
  if (approval.approved_version !== meta.version) failures.push(`${META_PATH}: approved_version must match version`);
  const hasSupersession = meta.issue_229_owner_decision && ownerDecision229.validateEiDecision(meta).length === 0;
  if (approval.approved_outline_sha256 !== (hasSupersession ? ownerDecision229.OLD_OUTLINE_HASH : outlineHash)) failures.push(`${META_PATH}: approved_outline_sha256 must match semantic_authority.sha256 or the validated superseded outline`);
  if (!evidence || approval.approved_pr !== evidence.reviewed_pr || approval.approved_pr !== (meta.approval_context || {}).pr_number) {
    failures.push(`${META_PATH}: approved_pr must match the exact owner-reviewed PR binding`);
  }
  if (!evidence || approval.approved_commit !== evidence.reviewed_head) failures.push(`${META_PATH}: approved_commit must match the exact owner-reviewed head`);
  if (!evidence || approval.approved_outline_sha256 !== evidence.subject_sha256) failures.push(`${META_PATH}: approved_outline_sha256 must match the owner release subject hash`);
  if (!evidence || approval.approved_version !== evidence.subject_id) failures.push(`${META_PATH}: approved_version must match the owner release subject version`);
  if (!evidence || approval.decision_ref !== evidence.evidence_ref) failures.push(`${META_PATH}: decision_ref must match the exact owner decision/comment reference`);
  if (!evidence || approval.decided_on !== evidence.released_on) failures.push(`${META_PATH}: decided_on must match the owner release date`);
  if (!evidence || approval.decided_by !== evidence.released_by) failures.push(`${META_PATH}: decided_by must match the owner release identity`);
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
  if (meta?.issue_229_owner_decision) failures.push(...ownerDecision229.validateEiDecision(meta));
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
  if (options.paragraph && !EXPECTED_ORDER.includes(options.paragraph)) throw new Error(`Unknown Book 2 paragraph: ${options.paragraph}`);
  if (options.chapter && !['2.1', '2.2', '2.3'].includes(options.chapter)) throw new Error(`Unknown Book 2 chapter: ${options.chapter}`);
  if (options.action && PARAGRAPH_SCOPED_ACTIONS.has(options.action) && !options.paragraph) throw new Error(`Action ${options.action} requires --paragraph`);
  if (options.action && CHAPTER_SCOPED_ACTIONS.has(options.action) && !options.chapter) throw new Error(`Action ${options.action} requires --chapter`);
  if (options.action === 'lesson_authoring' && !options.paragraph && !options.chapter) throw new Error('Action lesson_authoring requires --paragraph or --chapter');
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
  APPROVAL_PR_NUMBER,
  AUTHORITY_PATHS,
  EXPECTED_ORDER,
  FORBIDDEN_SEMANTIC_KEYS,
  META_PATH,
  OUTLINE_PATH,
  REGISTERED_ACTIONS,
  REGISTERED_SCOPES,
  TARGET_REGISTRY_PATH,
  WORKFLOW_SURFACES,
  asText,
  blockingHoldsForAction,
  findBookOutlineFailures,
  formatHoldProjectionRow,
  formatReleaseEvidence,
  holdScopeMatches,
  readFiles,
  releasedPinHasExactSuccessor,
  sha256,
  sha256CanonicalText,
  sha256SemanticAuthority,
};
