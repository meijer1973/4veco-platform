#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Extend the PV-G2 checks when PV.3 pilot criteria become stricter.
 * - Keep this builder read-only with respect to protected references.
 * - It writes reports and gate artifacts only; it must not mutate machine refs.
 */

const fs = require('fs');
const path = require('path');

const { validateProcedureVisualRegistry } = require('./validate-procedure-visual-registry.js');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const PROCEDURE_TEMPLATES_PATH = 'references/data/procedure-visual/procedure-templates.json';
const VISUAL_STATES_PATH = 'references/data/procedure-visual/visual-states.json';
const UNIT_TEMPLATE_LINKS_PATH = 'references/data/procedure-visual/unit-template-links.json';

const REPORT_JSON_PATH = 'reports/json/procedure-visual-pilot-status.json';
const REPORT_MD_PATH = 'reports/markdown/procedure-visual-pilot-status.md';
const GATE_DIR = 'reports/review-gates/GATE-PV-G2-pilot-content';
const REVIEW_PACKET_JSON_PATH = `${GATE_DIR}/review-packet.json`;
const REVIEW_PACKET_MD_PATH = `${GATE_DIR}/review-packet.md`;
const TECHNICAL_CLOSURE_JSON_PATH = `${GATE_DIR}/technical-closure.json`;
const TECHNICAL_CLOSURE_MD_PATH = `${GATE_DIR}/technical-closure.md`;

const REQUIRED_PROJECTIONS = [
  'formula_trace',
  'graph_stage_sequence',
  'table_trace',
  'flowchart',
];

const REQUIRED_VISUAL_TYPES = [
  'formula_trace',
  'graph_stage',
  'table_trace',
  'flowchart',
];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function writeJson(relPath, data) {
  const fullPath = repoPath(relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(relPath, text) {
  const fullPath = repoPath(relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, text);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function countBy(items, getKey) {
  const counts = {};
  for (const item of items) {
    const key = getKey(item);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function bulletList(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

function commandList(commands) {
  return ['```bash', ...commands, '```'].join('\n');
}

function buildStatus() {
  const validation = validateProcedureVisualRegistry();
  const procedureTemplates = readJson(PROCEDURE_TEMPLATES_PATH);
  const visualStates = readJson(VISUAL_STATES_PATH);
  const unitTemplateLinks = readJson(UNIT_TEMPLATE_LINKS_PATH);

  const templates = procedureTemplates.templates || [];
  const states = visualStates.visual_states || [];
  const links = unitTemplateLinks.links || [];

  const projectionCounts = {};
  for (const key of REQUIRED_PROJECTIONS) {
    projectionCounts[key] = templates.filter((template) => template.projections && template.projections[key] === true).length;
  }
  const visualTypeCounts = countBy(states, (state) => state.visual_type);
  const blockedTemplateCount = templates.filter((template) =>
    template.publication &&
    template.publication.student_facing_allowed === false &&
    Array.isArray(template.blockers) &&
    template.blockers.length > 0
  ).length;
  const blockedLinkCount = links.filter((link) =>
    link.publication &&
    link.publication.student_facing_allowed === false &&
    Array.isArray(link.projection_blockers) &&
    link.projection_blockers.length > 0
  ).length;

  const operationReferenceCount = templates.reduce((count, template) => {
    return count + (template.procedure_steps || []).filter((step) => step.operation_ref).length;
  }, 0);

  const pvG2Checks = [
    {
      id: 'template_count',
      status: templates.length >= 5 ? 'passed' : 'failed',
      detail: `${templates.length} pilot templates present; PV-G2 requires at least 5.`
    },
    {
      id: 'visual_state_count',
      status: states.length >= 2 ? 'passed' : 'failed',
      detail: `${states.length} pilot visual states present; PV-G2 requires at least 2.`
    },
    {
      id: 'unit_template_links',
      status: links.length >= 5 ? 'passed' : 'failed',
      detail: `${links.length} unit-template links present.`
    },
    ...REQUIRED_PROJECTIONS.map((key) => ({
      id: `projection:${key}`,
      status: projectionCounts[key] > 0 ? 'passed' : 'failed',
      detail: `${projectionCounts[key]} template(s) declare ${key}.`
    })),
    ...REQUIRED_VISUAL_TYPES.map((key) => ({
      id: `visual_type:${key}`,
      status: (visualTypeCounts[key] || 0) > 0 ? 'passed' : 'failed',
      detail: `${visualTypeCounts[key] || 0} visual state(s) use ${key}.`
    })),
    {
      id: 'publication_blocked_templates',
      status: blockedTemplateCount === templates.length ? 'passed' : 'failed',
      detail: `${blockedTemplateCount}/${templates.length} templates are student-facing blocked and have blockers.`
    },
    {
      id: 'publication_blocked_links',
      status: blockedLinkCount === links.length ? 'passed' : 'failed',
      detail: `${blockedLinkCount}/${links.length} unit-template links are student-facing blocked and have blockers.`
    },
    {
      id: 'operation_refs_provisional',
      status: validation.summary.real_provisional_operation_reference_count === operationReferenceCount ? 'passed' : 'failed',
      detail: `${operationReferenceCount} real operation reference(s) validated as provisional.`
    },
    {
      id: 'no_machine_pv_registry',
      status: validation.summary.machine_registry_created === false ? 'passed' : 'failed',
      detail: 'No references/machine Procedure-Visual registry exists.'
    }
  ];

  const failed = pvG2Checks.filter((check) => check.status !== 'passed');
  assert(failed.length === 0, `PV-G2 pilot status failed: ${failed.map((check) => check.id).join(', ')}`);

  return {
    report_id: 'procedure-visual-pilot-status',
    sprint_id: 'PV.3',
    gate_id: 'GATE-PV-G2-pilot-content',
    generated_by: 'build-scripts/references/build-procedure-visual-pilot-status.js',
    generated_on: new Date().toISOString(),
    status: 'passed',
    summary: {
      template_count: templates.length,
      visual_state_count: states.length,
      unit_template_link_count: links.length,
      projection_counts: projectionCounts,
      visual_type_counts: visualTypeCounts,
      operation_reference_count: operationReferenceCount,
      machine_registry_created: false,
      student_facing_projection_allowed: false
    },
    pilot_templates: templates.map((template) => ({
      template_id: template.template_id,
      source_unit_ids: template.source_unit_ids,
      representation: template.representation,
      economic_context: template.economic_context,
      projections: template.projections,
      blocker_count: (template.blockers || []).length
    })),
    visual_states: states.map((state) => ({
      visual_state_id: state.visual_state_id,
      visual_type: state.visual_type,
      representation: state.representation,
      semantic_focus: state.semantic_focus
    })),
    checks: [
      ...pvG2Checks,
      ...validation.checks
    ],
    acceptance_commands: [
      'node build-scripts/references/validate-procedure-visual-registry.js',
      'node build-scripts/references/build-procedure-visual-pilot-status.js'
    ],
    blocked_scope: [
      'references/machine Procedure-Visual registries',
      'student-facing PV projection',
      'procedure-game migration requirement',
      'visual renderer publication',
      'student diagnostics',
      'adaptive routing',
      'student-facing AI',
      'automatic sequencing',
      'mastery decisions',
      'summative use'
    ]
  };
}

function buildMarkdownReport(report) {
  const templateRows = report.pilot_templates
    .map((template) => `| ${template.template_id} | ${template.source_unit_ids.join(', ')} | ${template.representation} | ${Object.entries(template.projections).filter(([, value]) => value).map(([key]) => key).join(', ')} | ${template.blocker_count} |`)
    .join('\n');
  const stateRows = report.visual_states
    .map((state) => `| ${state.visual_state_id} | ${state.visual_type} | ${state.representation} | ${state.semantic_focus} |`)
    .join('\n');
  const checkRows = report.checks
    .map((check) => `| ${check.id} | ${check.status} | ${check.detail} |`)
    .join('\n');

  return `# Procedure-Visual Pilot Status

Generated by: \`${report.generated_by}\`
Generated on: ${report.generated_on}
Status: \`${report.status}\`

## Summary

- Pilot templates: ${report.summary.template_count}
- Pilot visual states: ${report.summary.visual_state_count}
- Unit-template links: ${report.summary.unit_template_link_count}
- Operation references validated as provisional: ${report.summary.operation_reference_count}
- Machine registry created: \`${report.summary.machine_registry_created}\`
- Student-facing projection allowed: \`${report.summary.student_facing_projection_allowed}\`

## Pilot Templates

| Template | Units | Representation | Projection flags | Blockers |
| --- | --- | --- | --- | ---: |
${templateRows}

## Visual States

| Visual State | Type | Representation | Semantic Focus |
| --- | --- | --- | --- |
${stateRows}

## PV-G2 Checks

| Check | Status | Detail |
| --- | --- | --- |
${checkRows}

## Boundary

PV.3 records pilot Procedure-Visual semantics under \`references/data/procedure-visual/\` only. It does not create or authorize \`references/machine/\` PV registries, student-facing projection, diagnostics, adaptive routing, AI, sequencing, mastery decisions, or summative use.

## Acceptance Commands

${commandList(report.acceptance_commands)}
`;
}

function buildGatePacket(report) {
  return {
    gate_id: report.gate_id,
    sprint_id: report.sprint_id,
    status: 'technical_packet_prepared',
    human_review_required: false,
    generated_by: report.generated_by,
    generated_on: report.generated_on,
    purpose: 'Technical pilot-content gate proving PV.3 has enough reference-side pilot data before PV.4/PV.5 integration work.',
    review_questions: [
      {
        id: 'PVG2-Q1',
        question: 'Do 5 or more pilot procedure templates exist?',
        answer: `A. Yes, ${report.summary.template_count} pilot templates exist.`
      },
      {
        id: 'PVG2-Q2',
        question: 'Do 2 or more pilot visual states exist?',
        answer: `A. Yes, ${report.summary.visual_state_count} pilot visual states exist.`
      },
      {
        id: 'PVG2-Q3',
        question: 'Do the pilots cover formula trace, graph-stage, table-trace, and flowchart-style projection categories?',
        answer: 'A. Yes, all four pilot coverage categories are represented.'
      },
      {
        id: 'PVG2-Q4',
        question: 'Are operation references still provisional and status-aware?',
        answer: `A. Yes, ${report.summary.operation_reference_count} operation references validate as provisional.`
      },
      {
        id: 'PVG2-Q5',
        question: 'Does PV.3 authorize machine promotion or student-facing PV projection?',
        answer: 'A. No, machine promotion and student-facing projection remain blocked.'
      }
    ],
    acceptance_evidence: report.checks,
    blocked_scope: report.blocked_scope
  };
}

function buildGatePacketMarkdown(packet) {
  const questions = packet.review_questions
    .map((question) => `### ${question.id}\n\n${question.question}\n\n${question.answer}`)
    .join('\n\n');
  const evidence = packet.acceptance_evidence
    .map((check) => `| ${check.id} | ${check.status} | ${check.detail} |`)
    .join('\n');
  return `# ${packet.gate_id}: Review Packet

Sprint: \`${packet.sprint_id}\`
Status: \`${packet.status}\`
Human review required: \`${packet.human_review_required}\`

## Purpose

${packet.purpose}

## Technical Review Questions

${questions}

## Acceptance Evidence

| Check | Status | Detail |
| --- | --- | --- |
${evidence}

## Blocked Scope

${bulletList(packet.blocked_scope)}
`;
}

function buildTechnicalClosure(report) {
  return {
    gate_id: report.gate_id,
    sprint_id: report.sprint_id,
    status: 'pass',
    human_review_required: false,
    closed_by: 'technical validator',
    generated_by: report.generated_by,
    generated_on: report.generated_on,
    closure_basis: [
      `${report.summary.template_count} pilot procedure templates validate.`,
      `${report.summary.visual_state_count} pilot visual states validate.`,
      'Formula trace, graph-stage, table-trace, and flowchart coverage are all present.',
      'Unit-template links resolve to live units and real templates.',
      'Operation references remain provisional under CP-4 conditions.',
      'No references/machine PV registry exists.',
      'All pilot templates, visual states, and links block student-facing projection.'
    ],
    next_sprint_unblocked: 'PV.4 Procedure/Game Projection Contract may proceed with backward-compatible formal_step_id planning.',
    not_authorized: report.blocked_scope
  };
}

function buildTechnicalClosureMarkdown(closure) {
  return `# ${closure.gate_id}: Technical Closure

Sprint: \`${closure.sprint_id}\`
Status: \`${closure.status}\`
Human review required: \`${closure.human_review_required}\`
Closed by: ${closure.closed_by}

## Closure Basis

${bulletList(closure.closure_basis)}

## Next Sprint

${closure.next_sprint_unblocked}

## Not Authorized

${bulletList(closure.not_authorized)}
`;
}

function main() {
  const report = buildStatus();
  writeJson(REPORT_JSON_PATH, report);
  writeText(REPORT_MD_PATH, buildMarkdownReport(report));

  const packet = buildGatePacket(report);
  writeJson(REVIEW_PACKET_JSON_PATH, packet);
  writeText(REVIEW_PACKET_MD_PATH, buildGatePacketMarkdown(packet));

  const closure = buildTechnicalClosure(report);
  writeJson(TECHNICAL_CLOSURE_JSON_PATH, closure);
  writeText(TECHNICAL_CLOSURE_MD_PATH, buildTechnicalClosureMarkdown(closure));

  console.log(`wrote ${REPORT_JSON_PATH}`);
  console.log(`wrote ${REPORT_MD_PATH}`);
  console.log(`wrote ${REVIEW_PACKET_JSON_PATH}`);
  console.log(`wrote ${TECHNICAL_CLOSURE_JSON_PATH}`);
}

if (require.main === module) main();

module.exports = {
  buildStatus,
};
