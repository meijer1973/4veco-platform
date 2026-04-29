#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Extend ALLOWED_* vocabularies only after the relevant checkpoint approves
 *   the new value or after a governed registry replaces these constants.
 * - Keep this validator read-only. It validates overlays under
 *   references/data/exercises/ and must not mutate protected source files.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const OVERLAY_DIR = 'references/data/exercises';
const OVERLAY_FILES = [
  'references/data/exercises/exam-question-overlays.json',
  'references/data/exercises/target-exercise-overlays.json',
];
const SCHEMA_PATH = 'references/schemas/exercise-metadata-overlay.schema.json';
const CP1_CLOSURE = 'reports/review-gates/GATE-CP1-schema-audit/gate-closure.json';
const EXAM_SOURCE = 'references/external/exam-questions.json';
const TARGET_SOURCE = 'references/authored/course-target-exercises.json';
const UNIT_SOURCE = 'references/machine/micro-teaching-units.json';
const PRECISION_VERIFIER = 'build-scripts/lib/verify_svg_geometry.py';

const ALLOWED_INSTRUCTIONAL_ROLES = new Set([
  'worked_example',
  'startoefening',
  'independent_practice',
  'interleaving',
  'target',
  'verdieping',
  'consolidatie',
  'instapquiz',
  'diagnostic',
  'nieuws',
]);
const ALLOWED_ASSESSMENT_ROLES = new Set(['exam_mirror', 'bridge', 'prerequisite']);
const ALLOWED_SOURCE_TYPES = new Set(['external_exam_question', 'target_exercise']);
const ALLOWED_AUTHORITY_TIERS = new Set(['tier_a_external_exam', 'tier_c_owned_target_exercise']);
const ALLOWED_AUTHORITY_LEVELS = new Set([
  'external_primary',
  'owned_exercise_evidence',
  'authored_judgement',
  'generated_report',
  'diagnostic',
]);
const ALLOWED_EVIDENCE_STATUSES = new Set([
  'external_primary',
  'owned_exercise_evidence',
  'pending_review',
  'diagnostic_only',
  'source_values_not_extracted',
]);
const ALLOWED_BLOOM_LEVELS = new Set([
  'remember',
  'understand',
  'apply',
  'analyze',
  'evaluate',
  'create',
  'pending_review',
]);
const ALLOWED_ANSWER_FORMATS = new Set([
  'calculation',
  'short_explanation',
  'graph',
  'mixed',
  'multiple_choice',
  'classification',
  'pending_review',
]);
const ALLOWED_PRECISION_STATUSES = new Set(['not_applicable', 'pending', 'pass', 'warn', 'fail']);
const ALLOWED_REPRESENTATIONS = new Set([
  'none',
  'table',
  'bar_chart',
  'line_chart',
  'pie_chart',
  'p_q_graph',
  'producer_graph',
  'source_text',
]);

function fail(message) {
  console.error(`Exercise overlay check failed: ${message}`);
  process.exit(1);
}

function readJson(relPath) {
  const full = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(full)) fail(`missing ${relPath}`);
  try {
    return JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function exists(relPath) {
  return fs.existsSync(path.join(REPO_ROOT, relPath));
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function isArray(value) {
  return Array.isArray(value);
}

function checkString(value, label) {
  assert(typeof value === 'string' && value.trim().length > 0, `${label} must be a non-empty string`);
}

function checkStringArray(value, label, { allowEmpty = true, pattern = null } = {}) {
  assert(isArray(value), `${label} must be an array`);
  if (!allowEmpty) assert(value.length > 0, `${label} must not be empty`);
  for (const [index, item] of value.entries()) {
    checkString(item, `${label}[${index}]`);
    if (pattern) assert(pattern.test(item), `${label}[${index}] has invalid format: ${item}`);
  }
}

function examKey(record) {
  return [
    record.exam,
    String(record.opgave_num),
    String(record.question_num),
  ].join('|');
}

function targetKey(record) {
  return record.id;
}

function findSourceRecord(record, examRecords, targetRecords) {
  if (record.source_type === 'external_exam_question') {
    const locator = record.source_record_locator || {};
    const key = [locator.exam, String(locator.opgave_num), String(locator.question_num)].join('|');
    return examRecords.get(key);
  }
  if (record.source_type === 'target_exercise') {
    const locator = record.source_record_locator || {};
    return targetRecords.get(locator.id);
  }
  return null;
}

function checkOverlayRoot(overlay, overlayPath) {
  assert(overlay.schema_version === 1, `${overlayPath} schema_version must be 1`);
  checkString(overlay.overlay_id, `${overlayPath} overlay_id`);
  assert(['dry_run', 'active', 'deprecated'].includes(overlay.overlay_status), `${overlayPath} has invalid overlay_status`);
  checkString(overlay.generated_by, `${overlayPath} generated_by`);
  checkString(overlay.generated_on, `${overlayPath} generated_on`);
  checkStringArray(overlay.source_files, `${overlayPath} source_files`, { allowEmpty: false });
  assert(isArray(overlay.records) && overlay.records.length > 0, `${overlayPath} records must be a non-empty array`);
}

function checkRecord(record, context) {
  const label = `${context.overlayPath} ${record.overlay_record_id || '<missing overlay_record_id>'}`;

  checkString(record.overlay_record_id, `${label} overlay_record_id`);
  assert(ALLOWED_SOURCE_TYPES.has(record.source_type), `${label} has invalid source_type`);
  checkString(record.source_path, `${label} source_path`);
  checkString(record.source_stable_id, `${label} source_stable_id`);
  assert(record.source_record_locator && typeof record.source_record_locator === 'object', `${label} source_record_locator must be an object`);
  checkString(record.source_version, `${label} source_version`);
  checkString(record.curriculum_version, `${label} curriculum_version`);
  assert(['dry_run', 'active', 'deprecated', 'needs_review'].includes(record.content_status), `${label} has invalid content_status`);
  assert(ALLOWED_AUTHORITY_TIERS.has(record.authority_tier), `${label} has invalid authority_tier`);
  assert(ALLOWED_AUTHORITY_LEVELS.has(record.authority_level), `${label} has invalid authority_level`);
  assert(ALLOWED_EVIDENCE_STATUSES.has(record.evidence_status), `${label} has invalid evidence_status`);

  checkStringArray(record.required_units, `${label} required_units`, {
    pattern: /^[A-Z][0-9]{2}$/,
  });
  for (const unit of record.required_units) {
    assert(context.unitIds.has(unit), `${label} required_units contains unknown unit: ${unit}`);
  }

  checkStringArray(record.exercise_operations, `${label} exercise_operations`, {
    pattern: /^[a-z0-9_]+$/,
  });
  checkStringArray(record.skill_tags, `${label} skill_tags`, {
    pattern: /^[a-z0-9_]+$/,
  });

  assert(ALLOWED_INSTRUCTIONAL_ROLES.has(record.instructional_role), `${label} has invalid instructional_role`);
  if (Object.prototype.hasOwnProperty.call(record, 'assessment_role')) {
    assert(record.assessment_role !== null, `${label} assessment_role must be omitted when absent, not null`);
    assert(record.assessment_role !== 'not_applicable', `${label} assessment_role must be omitted when absent, not not_applicable`);
    assert(ALLOWED_ASSESSMENT_ROLES.has(record.assessment_role), `${label} has invalid assessment_role`);
  }

  assert(ALLOWED_BLOOM_LEVELS.has(record.bloom_level), `${label} has invalid bloom_level`);
  checkString(record.instruction_word, `${label} instruction_word`);
  assert(ALLOWED_ANSWER_FORMATS.has(record.answer_format), `${label} has invalid answer_format`);

  assert(record.graph_spec && typeof record.graph_spec === 'object', `${label} graph_spec must be an object`);
  checkStringArray(record.graph_spec.representation_types, `${label} graph_spec.representation_types`, { allowEmpty: false });
  for (const representation of record.graph_spec.representation_types) {
    assert(ALLOWED_REPRESENTATIONS.has(representation), `${label} has invalid representation type: ${representation}`);
  }
  assert(typeof record.graph_spec.graph_required === 'boolean', `${label} graph_spec.graph_required must be boolean`);
  assert(typeof record.graph_spec.source_values_required === 'boolean', `${label} graph_spec.source_values_required must be boolean`);
  assert(record.graph_spec.precision_verifier === PRECISION_VERIFIER, `${label} precision_verifier must be ${PRECISION_VERIFIER}`);
  assert(ALLOWED_PRECISION_STATUSES.has(record.precision_lint_status), `${label} has invalid precision_lint_status`);

  const scaffolding = record.scaffolding;
  assert(scaffolding && typeof scaffolding === 'object', `${label} scaffolding must be an object`);
  assert(Number.isInteger(scaffolding.verbal_level) && scaffolding.verbal_level >= 0 && scaffolding.verbal_level <= 5, `${label} scaffolding.verbal_level must be 0-5`);
  assert(Number.isInteger(scaffolding.visual_stage) && scaffolding.visual_stage >= 1 && scaffolding.visual_stage <= 4, `${label} scaffolding.visual_stage must be 1-4`);
  assert(Number.isInteger(scaffolding.fading_position) && scaffolding.fading_position >= 0, `${label} scaffolding.fading_position must be a non-negative integer`);
  assert(typeof scaffolding.dual_coding_present === 'boolean', `${label} scaffolding.dual_coding_present must be boolean`);

  const productBoundary = record.product_boundary;
  assert(productBoundary && typeof productBoundary === 'object', `${label} product_boundary must be an object`);
  for (const field of [
    'student_diagnostics_authorized',
    'adaptive_routing_authorized',
    'student_facing_ai_authorized',
    'summative_use_authorized',
  ]) {
    assert(productBoundary[field] === false, `${label} product_boundary.${field} must be false`);
  }

  checkStringArray(record.round_trip_notes, `${label} round_trip_notes`);
  checkStringArray(record.unresolved_questions, `${label} unresolved_questions`);

  if (record.source_type === 'external_exam_question') {
    assert(record.source_path === EXAM_SOURCE, `${label} external source_path must be ${EXAM_SOURCE}`);
    assert(record.authority_tier === 'tier_a_external_exam', `${label} external record must be tier_a_external_exam`);
    assert(record.authority_level === 'external_primary', `${label} external record must keep external_primary authority`);
  }

  if (record.source_type === 'target_exercise') {
    assert(record.source_path === TARGET_SOURCE, `${label} target source_path must be ${TARGET_SOURCE}`);
    assert(record.authority_tier === 'tier_c_owned_target_exercise', `${label} target record must be tier_c_owned_target_exercise`);
    assert(record.authority_level === 'owned_exercise_evidence', `${label} target record must be owned_exercise_evidence`);
  }

  const sourceRecord = findSourceRecord(record, context.examRecords, context.targetRecords);
  assert(sourceRecord, `${label} source_record_locator does not resolve to a source record`);
}

function main() {
  assert(exists(SCHEMA_PATH), `missing ${SCHEMA_PATH}`);
  assert(exists(PRECISION_VERIFIER), `missing ${PRECISION_VERIFIER}`);

  const cp1 = readJson(CP1_CLOSURE);
  assert(cp1.status === 'pass_with_conditions', 'CP-1 must be closed as pass_with_conditions before S4 overlay dry-run');

  const exams = readJson(EXAM_SOURCE);
  const targets = readJson(TARGET_SOURCE);
  const units = readJson(UNIT_SOURCE);

  assert(isArray(exams), `${EXAM_SOURCE} must be an array`);
  assert(targets && isArray(targets.exercises), `${TARGET_SOURCE} must contain exercises array`);
  assert(isArray(units), `${UNIT_SOURCE} must be an array`);

  const context = {
    examRecords: new Map(exams.map((record) => [examKey(record), record])),
    targetRecords: new Map(targets.exercises.map((record) => [targetKey(record), record])),
    unitIds: new Set(units.map((unit) => unit.id)),
    overlayPath: null,
  };

  for (const overlayPath of OVERLAY_FILES) {
    assert(overlayPath.startsWith(`${OVERLAY_DIR}/`), `${overlayPath} must live under ${OVERLAY_DIR}`);
    const overlay = readJson(overlayPath);
    checkOverlayRoot(overlay, overlayPath);
    context.overlayPath = overlayPath;
    for (const record of overlay.records) checkRecord(record, context);
  }

  console.log(`OK exercise overlays: ${OVERLAY_FILES.length} files, ${OVERLAY_FILES.map((file) => readJson(file).records.length).reduce((a, b) => a + b, 0)} dry-run records`);
}

if (require.main === module) main();
