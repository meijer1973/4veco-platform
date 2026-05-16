#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const OVERLAY = path.join(REPO_ROOT, 'references', 'data', 'unit-design-status', 'unit-design-status-overlay.json');
const SCHEMA = path.join(REPO_ROOT, 'references', 'schemas', 'unit-design-status.schema.json');
const GATE_DIR = path.join(REPO_ROOT, 'reports', 'review-gates', 'GATE-CP5-D04-resolution');
const REQUIRED_AUDIT_UNITS = ['D04', 'A15', 'A16', 'A17', 'D06', 'D11', 'D12', 'D27'];
const S9A_LOG = path.join(GATE_DIR, 'S9a-d04-mutation-log.json');
const S9A_STALE_AUDIT = path.join(GATE_DIR, 'S9a-stale-reference-audit.json');
const S9A_REPLACEMENTS = ['A15', 'D06', 'A17', 'D11', 'A16', 'D12', 'D27'];
const REQUIRED_GATE_FILES = [
  'd04-decision-record.json',
  'd04-decision-record.md',
  'dependent-unit-audit.json',
  'dependent-unit-audit.md',
  'unit-design-status-strategy.json',
  'unit-design-status-strategy.md',
  'review-packet.json',
  'review-packet.md',
];

function fail(errors) {
  for (const error of errors) console.error(`ERROR  ${error}`);
  console.error(`${errors.length} unit-design-status validation error(s).`);
  process.exit(1);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function existsRel(relPath) {
  return fs.existsSync(path.join(REPO_ROOT, relPath));
}

function sameArray(actual, expected) {
  return JSON.stringify(actual || []) === JSON.stringify(expected || []);
}

function main() {
  const errors = [];
  if (!fs.existsSync(SCHEMA)) errors.push('missing references/schemas/unit-design-status.schema.json');
  if (!fs.existsSync(OVERLAY)) errors.push('missing references/data/unit-design-status/unit-design-status-overlay.json');
  for (const name of REQUIRED_GATE_FILES) {
    if (!fs.existsSync(path.join(GATE_DIR, name))) errors.push(`missing CP-5 artifact ${name}`);
  }
  if (errors.length) fail(errors);

  const schema = readJson(SCHEMA);
  if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') errors.push('schema must use draft 2020-12');
  if (schema.additionalProperties !== false) errors.push('schema must set additionalProperties:false');

  const overlay = readJson(OVERLAY);
  if (overlay.status !== 'active_internal_overlay') errors.push('overlay status must be active_internal_overlay');
  if (overlay.storage_strategy && overlay.storage_strategy.strategy !== 'derived_overlay_first') errors.push('storage strategy must be derived_overlay_first');
  if (overlay.storage_strategy && overlay.storage_strategy.machine_field_migration_ready !== false) errors.push('machine field migration must not be ready/authorized in S9');
  if (overlay.storage_strategy && overlay.storage_strategy.protected_reference_mutation_authorized !== false) errors.push('protected reference mutation must not be authorized');

  const flags = overlay.authority_boundary || {};
  const mustBeTrue = ['internal_design_status'];
  const mustBeFalse = [
    'primary_evidence',
    'curriculum_authority',
    'exam_authority',
    'scoring_rule',
    'student_facing_exposure',
    'student_diagnostics',
    'adaptive_routing',
    'mastery_decision',
    'automatic_sequencing',
    'student_facing_ai',
    'summative_use',
    'pv_projection',
    'pv_machine_promotion',
    'machine_field_migration',
    'protected_reference_mutation_authorized',
  ];
  for (const key of mustBeTrue) if (flags[key] !== true) errors.push(`authority_boundary.${key} must be true`);
  for (const key of mustBeFalse) if (flags[key] !== false) errors.push(`authority_boundary.${key} must be false`);

  const records = overlay.records || [];
  const ids = records.map((item) => item.unit_id);
  if (new Set(ids).size !== ids.length) errors.push('record unit IDs must be unique');
  const d04 = records.find((item) => item.unit_id === 'D04');
  const s9aLogExists = fs.existsSync(S9A_LOG);
  const s9aLog = s9aLogExists ? readJson(S9A_LOG) : null;
  if (!d04) {
    errors.push('D04 record missing');
  } else {
    const expectedStatus = s9aLogExists ? 'retired_after_cli_mutation' : 'unstable_unit_design';
    const expectedReviewStatus = s9aLogExists ? 's9a_cli_mutation_completed' : fs.existsSync(path.join(GATE_DIR, 'gate-closure.json')) ? 'cp5_closed' : 'cp5_review_required';
    if (d04.status !== expectedStatus) errors.push(`D04 status must be ${expectedStatus}`);
    const closureExists = fs.existsSync(path.join(GATE_DIR, 'gate-closure.json'));
    if (!['cp5_review_required', 'cp5_closed', 's9a_cli_mutation_completed'].includes(d04.review_status)) {
      errors.push('D04 review_status must be cp5_review_required, cp5_closed, or s9a_cli_mutation_completed');
    }
    if (d04.review_status !== expectedReviewStatus) errors.push(`D04 review_status must be ${expectedReviewStatus}`);
    if (d04.gate_id !== 'GATE-CP5-D04-resolution') errors.push('D04 gate_id must be GATE-CP5-D04-resolution');
    if (d04.promotion_blocked !== true) errors.push('D04 promotion_blocked must be true');
    if (d04.c_to_b_promotion_blocked !== true) errors.push('D04 c_to_b_promotion_blocked must be true');
    if ((d04.current_catalog_state.needs || []).length !== 0) errors.push('D04 current needs should remain empty; S9a must not add a D04 prerequisite edge');
    if (s9aLogExists) {
      if (d04.current_catalog_state.deprecated !== true) errors.push('D04 must be deprecated after S9a mutation');
      if (!sameArray(d04.current_catalog_state.deprecated_in_favor_of, S9A_REPLACEMENTS)) errors.push('D04 deprecated_in_favor_of mismatch after S9a');
      if (d04.mutation_log_ref !== 'reports/review-gates/GATE-CP5-D04-resolution/S9a-d04-mutation-log.json') errors.push('D04 mutation_log_ref must point at S9a log');
      if (!s9aLog || s9aLog.status !== 'completed') errors.push('S9a mutation log must be completed');
      if (s9aLog && !sameArray(s9aLog.applied && s9aLog.applied.deprecated_in_favor_of, S9A_REPLACEMENTS)) errors.push('S9a mutation log replacement IDs mismatch');
    } else if (d04.current_catalog_state.deprecated !== false) {
      errors.push('D04 should not be deprecated before S9a mutation log exists');
    }
    for (const id of REQUIRED_AUDIT_UNITS) {
      if (!(d04.affected_unit_ids || []).includes(id)) errors.push(`D04 affected_unit_ids must include ${id}`);
    }
    for (const id of ['A15', 'A16', 'A17', 'D06', 'D11', 'D12', 'D27']) {
      if (!(d04.successor_unit_ids || []).includes(id)) errors.push(`D04 successor_unit_ids must include ${id}`);
    }
    for (const ref of d04.evidence_refs || []) {
      if (!ref.path || !existsRel(ref.path)) errors.push(`evidence path missing: ${ref.path}`);
    }
    if ((d04.blocked_downstream_uses || []).includes('exercise_promotion') !== true) errors.push('D04 must block exercise_promotion');
  }

  const audit = readJson(path.join(GATE_DIR, 'dependent-unit-audit.json'));
  for (const id of REQUIRED_AUDIT_UNITS) {
    if (!(audit.audit_scope || []).includes(id)) errors.push(`dependent-unit audit_scope must include ${id}`);
    if (!(audit.units || []).some((unit) => unit.unit_id === id)) errors.push(`dependent-unit audit must include unit ${id}`);
  }
  if (s9aLogExists) {
    if (!(audit.d04_citations && Array.isArray(audit.d04_citations.target_exercises) && audit.d04_citations.target_exercises.length === 0)) {
      errors.push('post-S9a audit must show zero active D04 target-exercise citations');
    }
    if (!fs.existsSync(S9A_STALE_AUDIT)) errors.push('S9a stale-reference audit must exist after mutation');
  } else if (!(audit.d04_citations && audit.d04_citations.target_exercises && audit.d04_citations.target_exercises.length >= 1)) {
    errors.push('audit must include at least one D04 target-exercise citation before S9a mutation');
  }
  if (!(audit.d04_citations && audit.d04_citations.exam_questions && audit.d04_citations.exam_questions.length >= 1)) errors.push('audit must include at least one D04 exam-question citation');
  if (audit.conclusion && audit.conclusion.d04_is_prerequisite_edge_issue !== false) errors.push('audit must reject D04 prerequisite-edge framing');
  if (audit.conclusion && audit.conclusion.c_to_b_promotion_blocked_until_cp5 !== true) errors.push('audit must block C-to-B promotion until CP-5');

  const packet = readJson(path.join(GATE_DIR, 'review-packet.json'));
  if (!Array.isArray(packet.review_questions) || packet.review_questions.length < 6) errors.push('review packet must include at least six review questions');
  if (packet.protected_reference_data_changed !== false) errors.push('review packet must keep protected_reference_data_changed false');

  const closure = path.join(GATE_DIR, 'gate-closure.json');
  if (fs.existsSync(closure)) {
    const gate = readJson(closure);
    if (gate.protected_reference_data_changed !== false) errors.push('gate closure must keep protected_reference_data_changed false');
    if (gate.closure_confirmed_by_human !== true) errors.push('gate closure must be explicitly human-confirmed');
  }

  if (errors.length) fail(errors);
  console.log(`OK unit-design status overlay: ${records.length} record(s), CP-5 packet present`);
}

if (require.main === module) main();
