#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Extend REQUIRED_RECORD_FIELDS only after references/schemas/misconception.schema.json
 *   is intentionally expanded.
 * - Keep this checker read-only. It validates the internal misconception overlay
 *   and fails if it drifts toward student diagnostics, scoring, sequencing, or
 *   machine-registry authority.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REGISTRY_PATH = 'references/data/misconceptions/misconception-registry.json';
const SCHEMA_PATH = 'references/schemas/misconception.schema.json';
const REPORT_JSON_PATH = 'reports/json/misconception-registry.json';
const REPORT_MD_PATH = 'reports/markdown/misconception-registry.md';
const MACHINE_REGISTRY_PATHS = [
  'references/machine/misconception-registry.json',
  'references/machine/misconceptions.json',
  'references/machine/misconception-registry.md',
];

const REQUIRED_RECORD_FIELDS = [
  'misconception_id',
  'title_nl',
  'misconception_statement_nl',
  'correct_conception_nl',
  'common_trigger_nl',
  'linked_unit_ids',
  'evidence_refs',
  'affected_surfaces',
  'status',
  'severity',
  'owner_team',
  'authority_flags',
  'created_on',
];

const STATUS_VALUES = new Set(['active', 'candidate', 'deferred', 'retired']);
const SEVERITY_VALUES = new Set(['low', 'medium', 'high']);
const OWNER_VALUES = new Set(['references_team', 'content_strategy', 'platform_team', 'lessons_team', 'cross_team']);
const SURFACE_VALUES = new Set([
  'exercise_design',
  'answer_model_review',
  'teacher_explanation_review',
  'reasoning_game_source',
  'procedure_visual_review',
  'rag_context',
]);

const FLAG_EXPECTATIONS = {
  internal_only: true,
  diagnostic_design_context: true,
  primary_evidence: false,
  curriculum_authority: false,
  exam_authority: false,
  scoring_rule: false,
  student_facing_diagnosis: false,
  student_facing_exposure: false,
  adaptive_routing: false,
  mastery_decision: false,
  automatic_sequencing: false,
  student_facing_ai: false,
  summative_use: false,
  pv_projection: false,
  pv_machine_promotion: false,
  machine_registry_authority: false,
};

const FORBIDDEN_DOWNSTREAM_USES = [
  'student_diagnostics',
  'adaptive_routing',
  'automatic_mastery_decisions',
  'automatic_lesson_sequencing',
  'student_facing_ai',
  'summative_assessment_decisions',
  'student_facing_pv_projection',
  'pv_machine_promotion',
  'primary_curriculum_evidence',
  'exam_authority',
  'scoring_rule_authority',
  'references_machine_registry',
];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function exists(relPath) {
  return fs.existsSync(repoPath(relPath));
}

function readJson(relPath) {
  try {
    return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
  } catch (error) {
    throw new Error(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function isDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function fail(errors) {
  for (const error of errors) console.error(`ERROR  ${error}`);
  console.error(`${errors.length} misconception registry validation error(s).`);
  process.exit(1);
}

function flagsAreSafe(flags, label, errors) {
  if (!flags || typeof flags !== 'object') {
    errors.push(`${label}: missing authority_flags`);
    return;
  }
  for (const [key, expected] of Object.entries(FLAG_EXPECTATIONS)) {
    if (flags[key] !== expected) {
      errors.push(`${label}: authority_flags.${key} must be ${expected}`);
    }
  }
}

function checkNoForbiddenAllowedUses(allowedUses, label, errors) {
  for (const use of allowedUses || []) {
    if (FORBIDDEN_DOWNSTREAM_USES.includes(use)) {
      errors.push(`${label}: forbidden downstream use appears in allowed_downstream_uses: ${use}`);
    }
    if (/student|adaptive|mastery|sequencing|summative|scoring|machine_registry|pv_projection|pv_machine/i.test(use)) {
      errors.push(`${label}: allowed_downstream_uses contains unsafe product wording: ${use}`);
    }
  }
}

function collectFormalSteps(procedureVisual) {
  const stepsByTemplate = new Map();
  for (const template of procedureVisual.templates || []) {
    const steps = new Set((template.procedure_steps || []).map((step) => step.step_id));
    stepsByTemplate.set(template.template_id, steps);
  }
  return stepsByTemplate;
}

function main() {
  const errors = [];

  for (const relPath of [REGISTRY_PATH, SCHEMA_PATH]) {
    if (!exists(relPath)) errors.push(`missing ${relPath}`);
  }
  for (const relPath of MACHINE_REGISTRY_PATHS) {
    if (exists(relPath)) errors.push(`unexpected machine misconception registry: ${relPath}`);
  }
  if (errors.length) fail(errors);

  let schema;
  let registry;
  let units;
  let terms;
  let skillOperations;
  let procedureVisual;
  try {
    schema = readJson(SCHEMA_PATH);
    registry = readJson(REGISTRY_PATH);
    units = readJson('references/machine/micro-teaching-units.json');
    terms = readJson('references/machine/begrippen.json');
    skillOperations = readJson('references/data/skill-operation-registry.json');
    procedureVisual = readJson('references/data/procedure-visual/procedure-templates.json');
  } catch (error) {
    errors.push(error.message);
    fail(errors);
  }

  if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') errors.push('misconception schema must use draft 2020-12');
  if (schema.additionalProperties !== false) errors.push('misconception schema must set additionalProperties:false');
  const schemaRequired = new Set(schema.required || []);
  for (const field of REQUIRED_RECORD_FIELDS) {
    if (!schemaRequired.has(field)) errors.push(`${SCHEMA_PATH} must require ${field}`);
  }
  if (!schema.properties || !schema.properties.authority_flags) {
    errors.push(`${SCHEMA_PATH} must define authority_flags`);
  }

  if (registry.schema_version !== 1) errors.push('schema_version must be 1');
  if (registry.registry_id !== 'misconception-registry') errors.push('registry_id must be misconception-registry');
  if (registry.source_schema !== SCHEMA_PATH) errors.push(`source_schema must be ${SCHEMA_PATH}`);
  if (registry.storage_decision && registry.storage_decision.registry_location !== REGISTRY_PATH) {
    errors.push('storage_decision.registry_location must point to the references/data registry');
  }
  if (!registry.storage_decision || registry.storage_decision.machine_registry_created !== false) {
    errors.push('storage_decision.machine_registry_created must be false');
  }
  flagsAreSafe(registry.authority_flags, 'registry', errors);
  checkNoForbiddenAllowedUses(registry.allowed_downstream_uses, 'registry', errors);
  for (const use of FORBIDDEN_DOWNSTREAM_USES) {
    if (!Array.isArray(registry.blocked_downstream_uses) || !registry.blocked_downstream_uses.includes(use)) {
      errors.push(`registry.blocked_downstream_uses must include ${use}`);
    }
  }

  if (!Array.isArray(registry.records) || registry.records.length < 4) {
    errors.push('records must contain at least four S8 seed misconceptions');
  }
  if (registry.summary && registry.summary.record_count !== registry.records.length) {
    errors.push('summary.record_count must equal records.length');
  }

  const unitIds = new Set(units.map((unit) => unit.id));
  const termIds = new Set(Object.keys(terms.terms || {}));
  const operationIds = new Set((skillOperations.exercise_operations || []).map((operation) => operation.operation_key));
  const stepsByTemplate = collectFormalSteps(procedureVisual);
  const seen = new Set();
  const activeHigh = [];

  for (const [index, record] of (registry.records || []).entries()) {
    const label = `records[${index}] ${record.misconception_id || '<missing-id>'}`;
    for (const field of REQUIRED_RECORD_FIELDS) {
      if (record[field] === undefined || record[field] === null || record[field] === '') {
        errors.push(`${label}: missing ${field}`);
      }
    }
    if (!/^MIS-[A-Z0-9][A-Z0-9._-]+$/.test(record.misconception_id || '')) {
      errors.push(`${label}: invalid misconception_id`);
    }
    if (seen.has(record.misconception_id)) errors.push(`${label}: duplicate misconception_id`);
    seen.add(record.misconception_id);

    if (!STATUS_VALUES.has(record.status)) errors.push(`${label}: invalid status ${record.status}`);
    if (!SEVERITY_VALUES.has(record.severity)) errors.push(`${label}: invalid severity ${record.severity}`);
    if (!OWNER_VALUES.has(record.owner_team)) errors.push(`${label}: invalid owner_team ${record.owner_team}`);
    if (!isDate(record.created_on)) errors.push(`${label}: created_on must be YYYY-MM-DD`);
    if (record.updated_on && !isDate(record.updated_on)) errors.push(`${label}: updated_on must be YYYY-MM-DD`);
    if (record.status === 'active' && record.severity === 'high') activeHigh.push(record.misconception_id);

    if (!Array.isArray(record.linked_unit_ids) || record.linked_unit_ids.length === 0) {
      errors.push(`${label}: linked_unit_ids must be non-empty`);
    } else {
      for (const unitId of record.linked_unit_ids) {
        if (!unitIds.has(unitId)) errors.push(`${label}: unknown linked unit ${unitId}`);
      }
    }

    for (const termId of record.term_ids || []) {
      if (!termIds.has(termId)) errors.push(`${label}: unknown term_id ${termId}`);
    }
    for (const operationId of record.operation_ids || []) {
      if (!operationIds.has(operationId)) errors.push(`${label}: unknown operation_id ${operationId}`);
    }
    for (const [stepIndex, stepRef] of (record.formal_step_refs || []).entries()) {
      const templateSteps = stepsByTemplate.get(stepRef.template_id);
      if (!templateSteps) {
        errors.push(`${label}: formal_step_refs[${stepIndex}] unknown template_id ${stepRef.template_id}`);
      } else if (!templateSteps.has(stepRef.formal_step_id)) {
        errors.push(`${label}: formal_step_refs[${stepIndex}] unknown formal_step_id ${stepRef.formal_step_id}`);
      }
    }

    if (!Array.isArray(record.evidence_refs) || record.evidence_refs.length === 0) {
      errors.push(`${label}: evidence_refs must be non-empty`);
    } else {
      for (const [evidenceIndex, evidence] of record.evidence_refs.entries()) {
        if (!evidence.path || !evidence.role || !evidence.note) {
          errors.push(`${label}: evidence_refs[${evidenceIndex}] must include path, role, and note`);
        }
        if (evidence.path && !exists(evidence.path)) {
          errors.push(`${label}: evidence path does not exist: ${evidence.path}`);
        }
      }
    }

    if (!Array.isArray(record.affected_surfaces) || record.affected_surfaces.length === 0) {
      errors.push(`${label}: affected_surfaces must be non-empty`);
    } else {
      for (const surface of record.affected_surfaces) {
        if (!SURFACE_VALUES.has(surface)) errors.push(`${label}: invalid affected surface ${surface}`);
      }
    }

    flagsAreSafe(record.authority_flags, label, errors);
    checkNoForbiddenAllowedUses(record.allowed_downstream_uses, label, errors);
  }

  if (activeHigh.length < 2) errors.push('S8 seed registry should preserve multiple active high-severity misconceptions');

  if (exists(REPORT_JSON_PATH)) {
    const report = readJson(REPORT_JSON_PATH);
    if (report.report_id !== 'misconception-registry') errors.push(`${REPORT_JSON_PATH} has wrong report_id`);
    if (report.summary && report.summary.record_count !== registry.records.length) {
      errors.push(`${REPORT_JSON_PATH} record count must match registry`);
    }
    if (report.summary && report.summary.internal_only !== true) errors.push(`${REPORT_JSON_PATH} must label internal_only true`);
    if (report.summary && report.summary.curriculum_authority !== false) errors.push(`${REPORT_JSON_PATH} must label curriculum_authority false`);
    if (report.summary && report.summary.primary_evidence !== false) errors.push(`${REPORT_JSON_PATH} must label primary_evidence false`);
    if (report.summary && report.summary.student_facing_diagnosis !== false) {
      errors.push(`${REPORT_JSON_PATH} must label student_facing_diagnosis false`);
    }
  }
  if (exists(REPORT_MD_PATH)) {
    const markdown = fs.readFileSync(repoPath(REPORT_MD_PATH), 'utf8');
    for (const phrase of ['diagnostic_design_context', 'student_facing_diagnosis: false', 'primary_evidence: false']) {
      if (!markdown.includes(phrase)) errors.push(`${REPORT_MD_PATH} missing phrase: ${phrase}`);
    }
  }

  if (errors.length) fail(errors);
  console.log(`OK misconceptions: ${registry.records.length} record(s), internal diagnostic overlay only`);
}

if (require.main === module) main();
