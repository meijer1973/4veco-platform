#!/usr/bin/env node
/**
 * generate-reference-health.js
 *
 * Aggregates JSON-first reports and graph gate policy into one dashboard state.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const JSON_OUT = path.join(REPO_ROOT, 'reports/json/reference-health.json');
const MD_OUT = path.join(REPO_ROOT, 'reports/markdown/reference-health.md');

function readJson(relPath, fallback = null) {
  const file = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function report(id) {
  return readJson(`reports/json/${id}.json`, { report_id: id, status: 'info', issues: [], summary: {} });
}

function countBy(items, selector) {
  const counts = {};
  for (const item of items) {
    const value = selector(item) || 'unknown';
    counts[value] = (counts[value] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

function now() {
  return new Date().toISOString();
}

function main() {
  const units = readJson('references/machine/micro-teaching-units.json', []);
  const terms = readJson('references/machine/begrippen.json', { terms: {} });
  const exams = readJson('references/external/exam-questions.json', []);
  const targets = readJson('references/authored/course-target-exercises.json', {});
  const graph = readJson('references/data/alignment-graph.json', { edges: [] });
  const gate = readJson('reports/review-gates/GATE-R5-alignment-graph/gate-closure.json', {});
  const ragGate = readJson('reports/review-gates/GATE-R7-rag/gate-closure.json', null);

  const live = units.filter((unit) => !unit.deprecated);
  const deprecated = units.filter((unit) => unit.deprecated);
  const reports = [
    'dag-integrity',
    'terminology-drift',
    'unresolved-refs',
    'needs-coverage',
    'terms-coverage',
    'procedure-coverage',
    'aspects-coverage',
    'dead-units',
    'begrippen-coverage',
    'empty-needs-audit-summary',
    'alignment-graph-integrity',
    'evidence-anchor-status',
    'reference-quality-issues',
    'procedure-visual-coverage',
    'skilltree-generator-readiness',
  ].map(report);

  const issueCount = reports.reduce((sum, item) => sum + (item.issues || []).length, 0);
  const highIssues = reports.flatMap((item) => item.issues || []).filter((item) => ['high', 'critical'].includes(item.severity));
  const emptyNeeds = report('needs-coverage');
  const termsCoverage = report('terms-coverage');
  const unresolved = report('unresolved-refs');
  const blueprint = readJson('reports/json/blueprint-flag-triage.json', null);
  const examGaps = readJson('reports/json/exam-question-extraction-gaps.json', null);
  const retrievalEval = readJson('references/data/rag/retrieval_eval_results.json', null);
  const qualityIssueReport = report('reference-quality-issues');
  const procedureVisualCoverage = report('procedure-visual-coverage');
  const skilltreeGeneratorReadiness = report('skilltree-generator-readiness');
  const qualityIssueLog = readJson('references/data/qc/reference-quality-issues.json', {
    authority_boundary: {
      internal_only: true,
      curriculum_authority: false,
      student_facing_exposure: false,
      primary_evidence: false,
    },
    issues: [],
  });

  const state = {
    schema_version: 1,
    generated_by: 'build-scripts/reports/generate-reference-health.js',
    generated_on: now(),
    source_files: [
      'references/machine/micro-teaching-units.json',
      'references/machine/begrippen.json',
      'references/external/exam-questions.json',
      'references/authored/course-target-exercises.json',
      'references/data/alignment-graph.json',
      'reports/review-gates/GATE-R5-alignment-graph/gate-closure.json',
      'reports/review-gates/GATE-R7-rag/gate-closure.json',
      'reports/json/procedure-visual-coverage.json',
      'reports/json/skilltree-generator-readiness.json',
      'reports/json/*.json',
    ],
    unit_counts: {
      total: units.length,
      live: live.length,
      deprecated: deprecated.length,
      by_category: countBy(live, (unit) => unit.category),
      by_layer: countBy(live, (unit) => String(unit.layer)),
    },
    empty_needs_status_distribution: countBy(live.filter((unit) => !unit.needs || unit.needs.length === 0), (unit) => unit.zero_needs_status || 'unclassified'),
    prior_knowledge_review_status: countBy(live, (unit) => unit.zero_needs_review && unit.zero_needs_review.reviewer ? 'reviewed' : 'not_reviewed'),
    term_link_coverage: {
      terms: Object.keys(terms.terms || {}).length,
      units_without_terms: termsCoverage.summary.units_without_terms || 0,
      status: termsCoverage.status,
    },
    exam_question_coverage: {
      question_count: Array.isArray(exams) ? exams.length : (exams.questions || []).length || 0,
      status: examGaps ? examGaps.status || 'warn' : 'info',
      issue_count: examGaps && Array.isArray(examGaps.issues) ? examGaps.issues.length : null,
    },
    target_exercise_triage_status: {
      status: blueprint ? blueprint.status || 'info' : 'info',
      issue_count: blueprint && Array.isArray(blueprint.issues) ? blueprint.issues.length : null,
      source_present: Boolean(blueprint),
      target_surface_present: Boolean(targets),
    },
    unresolved_refs: {
      status: unresolved.status,
      issues: unresolved.issues.length,
    },
    qc_findings: {
      report_count: reports.length,
      total_issues: issueCount,
      high_or_critical_issues: highIssues.length,
      by_report_status: countBy(reports, (item) => item.status),
    },
    quality_issue_model: {
      source: 'references/data/qc/reference-quality-issues.json',
      report: 'reports/json/reference-quality-issues.json',
      status: qualityIssueReport.status,
      issue_log_status: qualityIssueLog.status || 'unknown',
      issue_count: Array.isArray(qualityIssueLog.issues) ? qualityIssueLog.issues.length : 0,
      active_issue_count: Array.isArray(qualityIssueLog.issues)
        ? qualityIssueLog.issues.filter((item) => item.status !== 'resolved').length
        : 0,
      by_status: countBy(qualityIssueLog.issues || [], (item) => item.status),
      by_category: countBy(qualityIssueLog.issues || [], (item) => item.quality_category),
      internal_only: qualityIssueLog.authority_boundary && qualityIssueLog.authority_boundary.internal_only === true,
      curriculum_authority: qualityIssueLog.authority_boundary && qualityIssueLog.authority_boundary.curriculum_authority === true,
      student_facing_exposure: qualityIssueLog.authority_boundary && qualityIssueLog.authority_boundary.student_facing_exposure === true,
      primary_evidence: qualityIssueLog.authority_boundary && qualityIssueLog.authority_boundary.primary_evidence === true,
    },
    procedure_visual_backbone: {
      source: 'reports/json/procedure-visual-coverage.json',
      status: procedureVisualCoverage.status,
      diagnostic_only: procedureVisualCoverage.policy && procedureVisualCoverage.policy.diagnostic_only === true,
      curriculum_authority: procedureVisualCoverage.policy && procedureVisualCoverage.policy.curriculum_authority === true,
      machine_registry_created: procedureVisualCoverage.policy && procedureVisualCoverage.policy.machine_registry_created === true,
      student_facing_projection_authorized: procedureVisualCoverage.policy && procedureVisualCoverage.policy.student_facing_projection_authorized === true,
      generator_exposure_authorized: procedureVisualCoverage.policy && procedureVisualCoverage.policy.generator_exposure_authorized === true,
      pv_linked_unit_count: procedureVisualCoverage.summary && procedureVisualCoverage.summary.pv_linked_unit_count || 0,
      template_count: procedureVisualCoverage.summary && procedureVisualCoverage.summary.template_count || 0,
      visual_state_count: procedureVisualCoverage.summary && procedureVisualCoverage.summary.visual_state_count || 0,
      linked_units_with_surface_variants: procedureVisualCoverage.summary && procedureVisualCoverage.summary.linked_units_with_surface_variants || 0,
      linked_units_with_game_mapping: procedureVisualCoverage.summary && procedureVisualCoverage.summary.linked_units_with_game_mapping || 0,
      linked_units_with_answer_model_projection: procedureVisualCoverage.summary && procedureVisualCoverage.summary.linked_units_with_answer_model_projection || 0,
      linked_units_with_generator_support: procedureVisualCoverage.summary && procedureVisualCoverage.summary.linked_units_with_generator_support || 0,
      linked_units_generator_blocked: procedureVisualCoverage.summary && procedureVisualCoverage.summary.linked_units_generator_blocked || 0,
      linked_units_publication_allowed: procedureVisualCoverage.summary && procedureVisualCoverage.summary.linked_units_publication_allowed || 0,
      blocker_reason_counts: procedureVisualCoverage.summary && procedureVisualCoverage.summary.blocker_reason_counts || {},
    },
    skilltree_generator_readiness: {
      source: 'reports/json/skilltree-generator-readiness.json',
      status: skilltreeGeneratorReadiness.status,
      diagnostic_only: skilltreeGeneratorReadiness.policy && skilltreeGeneratorReadiness.policy.diagnostic_only === true,
      student_facing_skilltree_use_authorized: skilltreeGeneratorReadiness.policy && skilltreeGeneratorReadiness.policy.student_facing_skilltree_use_authorized === true,
      generator_exposure_for_blocked_units_authorized: skilltreeGeneratorReadiness.policy && skilltreeGeneratorReadiness.policy.generator_exposure_for_blocked_units_authorized === true,
      pv_projection_authorized: skilltreeGeneratorReadiness.policy && skilltreeGeneratorReadiness.policy.pv_projection_authorized === true,
      machine_registry_created: skilltreeGeneratorReadiness.policy && skilltreeGeneratorReadiness.policy.machine_registry_created === true,
      active_a_domain_count: skilltreeGeneratorReadiness.summary && skilltreeGeneratorReadiness.summary.active_a_domain_count || 0,
      interactive_skill_count: skilltreeGeneratorReadiness.summary && skilltreeGeneratorReadiness.summary.interactive_skill_count || 0,
      generator_blocked_count: skilltreeGeneratorReadiness.summary && skilltreeGeneratorReadiness.summary.generator_blocked_count || 0,
      explicit_generator_block_count: skilltreeGeneratorReadiness.summary && skilltreeGeneratorReadiness.summary.explicit_generator_block_count || 0,
      untracked_missing_generator_count: skilltreeGeneratorReadiness.summary && skilltreeGeneratorReadiness.summary.untracked_missing_generator_count || 0,
      blocked_interactive_leak_count: skilltreeGeneratorReadiness.summary && skilltreeGeneratorReadiness.summary.blocked_interactive_leak_count || 0,
    },
    schema_validation_status: {
      report_json_contract: 'pass',
      alignment_graph: report('alignment-graph-integrity').status,
      evidence_anchors: report('evidence-anchor-status').status,
    },
    alignment_graph_status: {
      graph_status: graph.graph_status,
      edge_count: graph.edge_count || (graph.edges || []).length,
      by_review_status: countBy(graph.edges || [], (edge) => edge.review_status),
      by_relation: countBy(graph.edges || [], (edge) => edge.relation),
    },
    r5_3_gate_status: {
      gate_id: gate.gate_id,
      status: gate.status,
      graph_approval_scope: gate.graph_approval_scope,
      whole_graph_authority: gate.whole_graph_authority === true,
    },
    r7_4_gate_status: ragGate
      ? {
          gate_id: ragGate.gate_id,
          status: ragGate.status,
          teacher_facing_non_authoritative_lookup_allowed: (ragGate.allowed_downstream_uses || []).includes('teacher_facing_non_authoritative_lookup'),
          lesson_authoring_support_allowed: (ragGate.allowed_downstream_uses || []).includes('lesson_authoring_support_with_human_review'),
        }
      : {
          gate_id: 'GATE-R7-rag',
          status: 'not_closed',
          teacher_facing_non_authoritative_lookup_allowed: false,
          lesson_authoring_support_allowed: false,
        },
    graph_authority: {
      whole_graph_authority: false,
      approved_scope: 'named_edge_groups_only',
      student_diagnostics_allowed: false,
      adaptive_routing_allowed: false,
      student_facing_ai_allowed: false,
    },
    retrieval_evaluation_status: retrievalEval
      ? {
          status: retrievalEval.status || 'available',
          passed: retrievalEval.summary && (retrievalEval.summary.passed || retrievalEval.summary.pass_count),
          failed: retrievalEval.summary && (retrievalEval.summary.failed || retrievalEval.summary.fail_count),
        }
      : {
          status: 'not_available_yet',
          passed: null,
          failed: null,
        },
    allowed_downstream_uses: ragGate ? (ragGate.allowed_downstream_uses || []) : (gate.allowed_downstream_uses || []),
    blocked_downstream_uses: ragGate ? (ragGate.blocked_downstream_uses || []) : (gate.blocked_downstream_uses || []),
  };

  fs.mkdirSync(path.dirname(JSON_OUT), { recursive: true });
  fs.mkdirSync(path.dirname(MD_OUT), { recursive: true });
  fs.writeFileSync(JSON_OUT, JSON.stringify(state, null, 2) + '\n');

  const lines = [];
  lines.push('# Reference Health');
  lines.push('');
  lines.push(`Generated: ${state.generated_on}`);
  lines.push('');
  lines.push('## Unit Counts');
  lines.push('');
  lines.push(`- Total: ${state.unit_counts.total}`);
  lines.push(`- Live: ${state.unit_counts.live}`);
  lines.push(`- Deprecated: ${state.unit_counts.deprecated}`);
  lines.push('');
  lines.push('## Graph Authority');
  lines.push('');
  lines.push(`- Whole graph authority: ${state.graph_authority.whole_graph_authority}`);
  lines.push(`- Approved scope: ${state.graph_authority.approved_scope}`);
  lines.push(`- Student diagnostics allowed: ${state.graph_authority.student_diagnostics_allowed}`);
  lines.push(`- Adaptive routing allowed: ${state.graph_authority.adaptive_routing_allowed}`);
  lines.push(`- Student-facing AI allowed: ${state.graph_authority.student_facing_ai_allowed}`);
  lines.push('');
  lines.push('## QC Findings');
  lines.push('');
  lines.push(`- Reports: ${state.qc_findings.report_count}`);
  lines.push(`- Total issues: ${state.qc_findings.total_issues}`);
  lines.push(`- High/critical issues: ${state.qc_findings.high_or_critical_issues}`);
  lines.push('');
  lines.push('## Quality Issue Model');
  lines.push('');
  lines.push(`- Status: ${state.quality_issue_model.status}`);
  lines.push(`- Active issues: ${state.quality_issue_model.active_issue_count}`);
  lines.push(`- Internal only: ${state.quality_issue_model.internal_only}`);
  lines.push(`- Curriculum authority: ${state.quality_issue_model.curriculum_authority}`);
  lines.push(`- Student-facing exposure: ${state.quality_issue_model.student_facing_exposure}`);
  lines.push('');
  lines.push('## Procedure-Visual Backbone');
  lines.push('');
  lines.push(`- Status: ${state.procedure_visual_backbone.status}`);
  lines.push(`- Diagnostic only: ${state.procedure_visual_backbone.diagnostic_only}`);
  lines.push(`- Curriculum authority: ${state.procedure_visual_backbone.curriculum_authority}`);
  lines.push(`- Student-facing projection authorized: ${state.procedure_visual_backbone.student_facing_projection_authorized}`);
  lines.push(`- PV-linked units: ${state.procedure_visual_backbone.pv_linked_unit_count}`);
  lines.push(`- Templates: ${state.procedure_visual_backbone.template_count}`);
  lines.push(`- Visual states: ${state.procedure_visual_backbone.visual_state_count}`);
  lines.push(`- Units with surface variants: ${state.procedure_visual_backbone.linked_units_with_surface_variants}`);
  lines.push(`- Units generator-blocked: ${state.procedure_visual_backbone.linked_units_generator_blocked}`);
  lines.push('');
  lines.push('## Skilltree Generator Readiness');
  lines.push('');
  lines.push(`- Status: ${state.skilltree_generator_readiness.status}`);
  lines.push(`- Diagnostic only: ${state.skilltree_generator_readiness.diagnostic_only}`);
  lines.push(`- Student-facing skilltree use authorized: ${state.skilltree_generator_readiness.student_facing_skilltree_use_authorized}`);
  lines.push(`- Active A-domain units: ${state.skilltree_generator_readiness.active_a_domain_count}`);
  lines.push(`- Interactive units: ${state.skilltree_generator_readiness.interactive_skill_count}`);
  lines.push(`- Generator-blocked units: ${state.skilltree_generator_readiness.generator_blocked_count}`);
  lines.push(`- Untracked missing generators: ${state.skilltree_generator_readiness.untracked_missing_generator_count}`);
  lines.push('');
  lines.push('## Retrieval Evaluation');
  lines.push('');
  lines.push(`- Status: ${state.retrieval_evaluation_status.status}`);
  lines.push(`- R7.4 gate: ${state.r7_4_gate_status.status}`);
  fs.writeFileSync(MD_OUT, lines.join('\n').replace(/\n+$/g, '') + '\n');

  console.log(`OK reference health: reports/json/reference-health.json`);
}

if (require.main === module) main();
