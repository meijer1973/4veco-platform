#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const FILE = path.join(REPO_ROOT, 'reports/json/reference-health.json');
const MD = path.join(REPO_ROOT, 'reports/markdown/reference-health.md');

function fail(errors) {
  for (const error of errors) console.error(`ERROR  ${error}`);
  console.error(`${errors.length} reference-health validation error(s).`);
  process.exit(1);
}

function main() {
  const errors = [];
  if (!fs.existsSync(FILE)) errors.push('missing reports/json/reference-health.json');
  if (!fs.existsSync(MD)) errors.push('missing reports/markdown/reference-health.md');
  if (errors.length) fail(errors);

  const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  for (const field of [
    'unit_counts',
    'empty_needs_status_distribution',
    'prior_knowledge_review_status',
    'term_link_coverage',
    'exam_question_coverage',
    'target_exercise_triage_status',
    'unresolved_refs',
    'qc_findings',
    'quality_issue_model',
    'procedure_visual_backbone',
    'schema_validation_status',
    'alignment_graph_status',
    'r5_3_gate_status',
    'retrieval_evaluation_status',
    'blocked_downstream_uses',
    'allowed_downstream_uses',
    'graph_authority',
  ]) {
    if (!(field in data)) errors.push(`missing ${field}`);
  }

  const authority = data.graph_authority || {};
  if (authority.whole_graph_authority !== false) errors.push('graph_authority.whole_graph_authority must be false');
  if (authority.approved_scope !== 'named_edge_groups_only') errors.push('graph_authority.approved_scope must be named_edge_groups_only');
  if (authority.student_diagnostics_allowed !== false) errors.push('student diagnostics must remain blocked');
  if (authority.adaptive_routing_allowed !== false) errors.push('adaptive routing must remain blocked');
  if (authority.student_facing_ai_allowed !== false) errors.push('student-facing AI must remain blocked');

  const qualityIssueModel = data.quality_issue_model || {};
  if (qualityIssueModel.internal_only !== true) errors.push('quality_issue_model.internal_only must be true');
  if (qualityIssueModel.curriculum_authority !== false) errors.push('quality_issue_model.curriculum_authority must be false');
  if (qualityIssueModel.student_facing_exposure !== false) errors.push('quality_issue_model.student_facing_exposure must be false');
  if (qualityIssueModel.primary_evidence !== false) errors.push('quality_issue_model.primary_evidence must be false');

  const pv = data.procedure_visual_backbone || {};
  if (pv.diagnostic_only !== true) errors.push('procedure_visual_backbone.diagnostic_only must be true');
  if (pv.curriculum_authority !== false) errors.push('procedure_visual_backbone.curriculum_authority must be false');
  if (pv.machine_registry_created !== false) errors.push('procedure_visual_backbone.machine_registry_created must be false');
  if (pv.student_facing_projection_authorized !== false) errors.push('procedure_visual_backbone.student_facing_projection_authorized must be false');
  if (pv.generator_exposure_authorized !== false) errors.push('procedure_visual_backbone.generator_exposure_authorized must be false');
  if (!(pv.pv_linked_unit_count >= 6)) errors.push('procedure_visual_backbone.pv_linked_unit_count must be at least 6');
  if (!(pv.linked_units_with_surface_variants >= 6)) errors.push('procedure_visual_backbone must report surface variants for linked units');
  if (!(pv.linked_units_with_game_mapping >= 1)) errors.push('procedure_visual_backbone must report at least one game mapping');
  if (!(pv.linked_units_generator_blocked >= 1)) errors.push('procedure_visual_backbone must preserve generator-blocked units');
  if (pv.linked_units_publication_allowed !== 0) errors.push('procedure_visual_backbone.linked_units_publication_allowed must be 0');

  for (const blocked of ['student_diagnostics', 'adaptive_routing', 'student_facing_ai']) {
    if (!Array.isArray(data.blocked_downstream_uses) || !data.blocked_downstream_uses.includes(blocked)) {
      errors.push(`blocked_downstream_uses must include ${blocked}`);
    }
  }
  for (const allowed of ['internal_dashboard', 'reference_health_reports', 'internal_retrieval_development', 'retrieval_evaluation']) {
    if (!Array.isArray(data.allowed_downstream_uses) || !data.allowed_downstream_uses.includes(allowed)) {
      errors.push(`allowed_downstream_uses must include ${allowed}`);
    }
  }

  if (errors.length) fail(errors);
  console.log('OK reference health contract');
}

if (require.main === module) main();
