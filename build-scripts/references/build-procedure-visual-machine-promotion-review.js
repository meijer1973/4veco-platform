#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep this as a review/readiness builder. It must not write to
 *   references/machine/ or create promoted Procedure-Visual registries.
 * - If a later sprint adds a real PV promotion CLI, update the precondition
 *   checks here and keep the human gate explicit.
 */

const fs = require('fs');
const path = require('path');

const { loadProcedureVisualData } = require('../lib/lib-procedure-visual');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GATE_ID = 'GATE-PV7-machine-promotion-review';
const SPRINT_ID = 'PV.7';
const TODAY = '2026-05-03';

const READINESS_JSON = 'reports/json/procedure-visual-machine-promotion-readiness.json';
const READINESS_MD = 'reports/markdown/procedure-visual-machine-promotion-readiness.md';
const GATE_DIR = `reports/review-gates/${GATE_ID}`;
const REVIEW_PACKET_JSON = `${GATE_DIR}/review-packet.json`;
const REVIEW_PACKET_MD = `${GATE_DIR}/review-packet.md`;
const GATE_READINESS_JSON = `${GATE_DIR}/promotion-readiness.json`;
const GATE_READINESS_MD = `${GATE_DIR}/promotion-readiness.md`;

const REQUIRED_SCHEMA_FILES = [
  'references/data/procedure-visual/procedure-template.schema.json',
  'references/data/procedure-visual/visual-state.schema.json',
  'references/data/procedure-visual/visual-grammar.schema.json',
];

const REQUIRED_DATA_FILES = [
  'references/data/procedure-visual/procedure-visual-vocab.json',
  'references/data/procedure-visual/procedure-templates.json',
  'references/data/procedure-visual/visual-states.json',
  'references/data/procedure-visual/unit-template-links.json',
];

const REQUIRED_REPORTS = [
  'reports/json/procedure-visual-inventory.json',
  'reports/json/procedure-visual-schema-status.json',
  'reports/json/procedure-visual-pilot-status.json',
  'reports/json/procedure-game-template-alignment.json',
  'reports/json/procedure-visual-projection-mvp.json',
  'reports/json/procedure-visual-coverage.json',
];

const FORBIDDEN_MACHINE_PV_FILES = [
  'references/machine/procedure-templates.json',
  'references/machine/visual-states.json',
  'references/machine/procedure-visual-vocab.json',
  'references/machine/procedure-visual.json',
  'references/machine/unit-template-links.json',
];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function exists(relPath) {
  return fs.existsSync(repoPath(relPath));
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function writeJson(relPath, data) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function writeText(relPath, text) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text, 'utf8');
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(full));
    else files.push(full);
  }
  return files;
}

function fileListExists(paths) {
  return paths.every(exists);
}

function detectMachinePromotionCli() {
  const dir = repoPath('build-scripts/references');
  const files = fs.readdirSync(dir).filter((name) => name.endsWith('.js'));
  return files
    .filter((name) => /(?:procedure-visual|pv).*(?:add|edit|update|remove|promote|machine|migrate)/i.test(name))
    .filter((name) => !/^build-/i.test(name))
    .filter((name) => !/^check-/i.test(name))
    .filter((name) => name !== 'validate-procedure-visual-registry.js')
    .map((name) => `build-scripts/references/${name}`)
    .sort();
}

function detectMachinePromotionLogs() {
  const roots = ['reports/review-gates', 'references/data/sprints'];
  const logs = [];
  for (const root of roots) {
    for (const full of walkFiles(repoPath(root))) {
      const rel = path.relative(REPO_ROOT, full).replace(/\\/g, '/');
      if (/procedure-visual.*(?:machine|promotion).*log/i.test(rel) || /pv.*(?:machine|promotion).*log/i.test(rel)) {
        logs.push(rel);
      }
    }
  }
  return logs.sort();
}

function detectLessonRegressionProofs() {
  const proofs = [];
  for (const full of walkFiles(repoPath('reports/review-gates'))) {
    const rel = path.relative(REPO_ROOT, full).replace(/\\/g, '/');
    if (/GATE-PV-G4-lesson-regression|lesson-regression|fresh-paragraph-pv-regression/i.test(rel)) {
      proofs.push(rel);
    }
  }
  return proofs.sort();
}

function statusFromBoolean(value) {
  return value ? 'met' : 'not_met';
}

function buildReadiness() {
  const data = loadProcedureVisualData();
  const coverage = exists('reports/json/procedure-visual-coverage.json')
    ? readJson('reports/json/procedure-visual-coverage.json')
    : null;
  const projection = exists('reports/json/procedure-visual-projection-mvp.json')
    ? readJson('reports/json/procedure-visual-projection-mvp.json')
    : null;
  const gameAlignment = exists('reports/json/procedure-game-template-alignment.json')
    ? readJson('reports/json/procedure-game-template-alignment.json')
    : null;

  const existingForbiddenMachineFiles = FORBIDDEN_MACHINE_PV_FILES.filter(exists);
  const cliFiles = detectMachinePromotionCli();
  const mutationLogs = detectMachinePromotionLogs();
  const lessonRegressionProofs = detectLessonRegressionProofs();

  const preconditions = [
    {
      id: 'pv_schema_files_exist',
      status: statusFromBoolean(fileListExists(REQUIRED_SCHEMA_FILES)),
      evidence: REQUIRED_SCHEMA_FILES,
      required_for_promotion: true,
    },
    {
      id: 'pv_validator_exists',
      status: statusFromBoolean(exists('build-scripts/references/validate-procedure-visual-registry.js')),
      evidence: ['build-scripts/references/validate-procedure-visual-registry.js'],
      required_for_promotion: true,
    },
    {
      id: 'pv_overlay_records_exist',
      status: statusFromBoolean(fileListExists(REQUIRED_DATA_FILES) && data.templates.length > 0 && data.states.length > 0 && data.links.length > 0),
      evidence: REQUIRED_DATA_FILES,
      required_for_promotion: true,
    },
    {
      id: 'pv_reports_exist',
      status: statusFromBoolean(fileListExists(REQUIRED_REPORTS)),
      evidence: REQUIRED_REPORTS,
      required_for_promotion: true,
    },
    {
      id: 'pv_machine_registry_absent',
      status: statusFromBoolean(existingForbiddenMachineFiles.length === 0),
      evidence: existingForbiddenMachineFiles.length === 0 ? ['No PV references/machine files exist.'] : existingForbiddenMachineFiles,
      required_for_promotion: true,
    },
    {
      id: 'pv_machine_edit_cli_exists',
      status: statusFromBoolean(cliFiles.length > 0),
      evidence: cliFiles.length > 0 ? cliFiles : ['No PV add/edit/promote CLI exists under build-scripts/references/.'],
      required_for_promotion: true,
    },
    {
      id: 'pv_machine_mutation_logs_exist',
      status: statusFromBoolean(mutationLogs.length > 0),
      evidence: mutationLogs.length > 0 ? mutationLogs : ['No PV machine-promotion mutation log exists.'],
      required_for_promotion: true,
    },
    {
      id: 'two_lesson_side_regressions_recorded',
      status: statusFromBoolean(lessonRegressionProofs.length >= 2),
      evidence: lessonRegressionProofs.length > 0 ? lessonRegressionProofs : ['No PV lesson-regression gate/proof artifacts found in platform reports.'],
      required_for_promotion: true,
    },
    {
      id: 'student_facing_projection_blocked',
      status: statusFromBoolean(
        Boolean(coverage && coverage.policy && coverage.policy.student_facing_projection_authorized === false)
      ),
      evidence: ['reports/json/procedure-visual-coverage.json'],
      required_for_promotion: true,
    },
    {
      id: 'human_promotion_gate_prepared',
      status: 'met',
      evidence: [REVIEW_PACKET_MD, REVIEW_PACKET_JSON],
      required_for_promotion: true,
    },
  ];

  const blockingPreconditions = preconditions
    .filter((item) => item.required_for_promotion && item.status !== 'met')
    .map((item) => item.id);

  const candidateRecords = [
    {
      record_class: 'unit_template_links',
      current_location: 'references/data/procedure-visual/unit-template-links.json',
      record_count: data.links.length,
      readiness: 'not_ready',
      future_safe_path: 'Potential first promotion candidate after a PV machine-edit CLI, mutation log, and lesson-regression proof exist.',
      current_decision_recommendation: 'Do not promote in PV.7.',
    },
    {
      record_class: 'procedure_templates',
      current_location: 'references/data/procedure-visual/procedure-templates.json',
      record_count: data.templates.length,
      readiness: 'not_ready',
      future_safe_path: 'Keep as governed data overlay until template schema is stable across more than pilot records and a CLI exists.',
      current_decision_recommendation: 'Do not promote in PV.7.',
    },
    {
      record_class: 'visual_states',
      current_location: 'references/data/procedure-visual/visual-states.json',
      record_count: data.states.length,
      readiness: 'not_ready',
      future_safe_path: 'Keep as governed data overlay until renderers, surface variants, accessibility proofs, and lesson regressions stabilize.',
      current_decision_recommendation: 'Do not promote in PV.7.',
    },
    {
      record_class: 'procedure_visual_vocab_and_schemas',
      current_location: 'references/data/procedure-visual/',
      record_count: data.vocab && data.vocab.actions ? data.vocab.actions.length : 0,
      readiness: 'not_ready',
      future_safe_path: 'Keep as schema/vocabulary contracts; promotion would need a separate governance design.',
      current_decision_recommendation: 'Do not promote in PV.7.',
    },
  ];

  return {
    report_id: 'procedure-visual-machine-promotion-readiness',
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    generated_by: 'build-scripts/references/build-procedure-visual-machine-promotion-review.js',
    generated_on: new Date().toISOString(),
    status: blockingPreconditions.length === 0 ? 'ready_for_human_promotion_decision' : 'promotion_not_ready',
    summary: {
      template_count: data.templates.length,
      visual_state_count: data.states.length,
      unit_template_link_count: data.links.length,
      render_proof_count: projection && projection.summary ? projection.summary.render_result_count : null,
      mapped_procedure_game_pilot_count: gameAlignment && gameAlignment.summary ? gameAlignment.summary.mapped_pilot_count : null,
      pv_linked_unit_count: coverage && coverage.summary ? coverage.summary.pv_linked_unit_count : null,
      linked_units_publication_allowed: coverage && coverage.summary ? coverage.summary.linked_units_publication_allowed : null,
      machine_registry_created: false,
      existing_forbidden_machine_files: existingForbiddenMachineFiles,
      machine_promotion_cli_count: cliFiles.length,
      machine_promotion_mutation_log_count: mutationLogs.length,
      lesson_regression_proof_count: lessonRegressionProofs.length,
      blocking_preconditions: blockingPreconditions,
      recommended_decision: 'do_not_promote_yet',
    },
    policy: {
      references_machine_promotion_authorized: false,
      student_facing_projection_authorized: false,
      operation_promotion_authorized: false,
      diagnostics_or_adaptive_use_authorized: false,
    },
    preconditions,
    candidate_records: candidateRecords,
    recommended_future_sequence: [
      'Keep PV records in references/data/procedure-visual after PV.7 unless HCS explicitly overrides.',
      'Add a PV machine-edit CLI and mutation-log design before any promotion sprint.',
      'Record at least two lesson-side PV regression proofs before promoting student-facing or machine-authoritative PV records.',
      'If a later gate promotes anything first, prefer unit-template links only; keep procedure templates and visual states as governed data until renderer and lesson regressions mature.',
    ],
  };
}

function buildReviewPacket(readiness) {
  const reviewQuestions = [
    {
      id: 'PV7-Q1',
      question: 'Have the prerequisites for PV machine promotion been met?',
      recommended_answer: 'B. No. Schema, validator, data overlay, and reports exist, but PV machine-edit CLI, promotion mutation logs, and two lesson-side regressions are not yet present.',
    },
    {
      id: 'PV7-Q2',
      question: 'Should PV.7 create references/machine Procedure-Visual registries now?',
      recommended_answer: 'A. No. Do not create references/machine/procedure-templates.json, visual-states.json, unit-template-links.json, or procedure-visual-vocab.json in PV.7.',
    },
    {
      id: 'PV7-Q3',
      question: 'If a future promotion path is approved, which record class should be considered first?',
      recommended_answer: 'B. Unit-template links are the safest future first candidate, but only after CLI, mutation logs, and lesson-regression proof exist.',
    },
    {
      id: 'PV7-Q4',
      question: 'Should procedure templates and visual states remain governed references/data overlays for now?',
      recommended_answer: 'A. Yes. Keep templates and visual states in references/data/procedure-visual until renderers, surface variants, accessibility proof, and lesson regressions are more mature.',
    },
    {
      id: 'PV7-Q5',
      question: 'May PV continue referencing provisional exercise_operations?',
      recommended_answer: 'A. Yes, but only with explicit provisional status and no operation promotion.',
    },
    {
      id: 'PV7-Q6',
      question: 'Does PV.7 authorize student-facing PV projection, generator exposure, diagnostics, adaptive routing, mastery, sequencing, AI, or summative use?',
      recommended_answer: 'A. No. All downstream product surfaces remain blocked.',
    },
    {
      id: 'PV7-Q7',
      question: 'What follow-up should close the readiness gap before any later promotion attempt?',
      recommended_answer: 'B. Add a bounded PV promotion-pipeline design sprint and PV-G4 lesson-regression proof before reopening machine promotion.',
    },
    {
      id: 'PV7-Q8',
      question: 'What gate status should GATE-PV7-machine-promotion-review receive?',
      recommended_answer: 'pass_with_conditions, with machine promotion explicitly not authorized.',
    },
  ];

  return {
    gate_id: GATE_ID,
    sprint_id: SPRINT_ID,
    status: 'prepared_for_human_review',
    generated_on: TODAY,
    readiness_report: READINESS_JSON,
    gate_readiness_report: GATE_READINESS_JSON,
    machine_promotion_authorized_by_packet: false,
    recommended_decision: readiness.summary.recommended_decision,
    summary: readiness.summary,
    review_questions: reviewQuestions,
    required_conditions_if_passes: [
      'Do not create or edit any references/machine Procedure-Visual registry in PV.7.',
      'Keep procedure templates, visual states, vocabulary, and unit-template links under references/data/procedure-visual.',
      'PV templates may reference provisional exercise_operations only with explicit provisional status.',
      'Record any future promotion design as CLI-backed with mutation logs before machine registry creation.',
      'Require at least two lesson-side PV regression proofs before reopening promotion for student-facing or machine-authoritative PV records.',
      'Do not authorize student-facing PV projection, generator exposure for blocked units, diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative use.',
    ],
  };
}

function renderReadinessMd(report) {
  const lines = [];
  lines.push('# Procedure-Visual Machine Promotion Readiness');
  lines.push('');
  lines.push(`Sprint: \`${report.sprint_id}\``);
  lines.push(`Gate: \`${report.gate_id}\``);
  lines.push(`Status: \`${report.status}\``);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Procedure templates: ${report.summary.template_count}`);
  lines.push(`- Visual states: ${report.summary.visual_state_count}`);
  lines.push(`- Unit-template links: ${report.summary.unit_template_link_count}`);
  lines.push(`- Render proofs: ${report.summary.render_proof_count}`);
  lines.push(`- Mapped procedure-game pilots: ${report.summary.mapped_procedure_game_pilot_count}`);
  lines.push(`- PV-linked units: ${report.summary.pv_linked_unit_count}`);
  lines.push(`- Linked units with publication allowed: ${report.summary.linked_units_publication_allowed}`);
  lines.push(`- Machine promotion CLI count: ${report.summary.machine_promotion_cli_count}`);
  lines.push(`- Machine promotion mutation logs: ${report.summary.machine_promotion_mutation_log_count}`);
  lines.push(`- Lesson-regression proofs: ${report.summary.lesson_regression_proof_count}`);
  lines.push(`- Recommended decision: \`${report.summary.recommended_decision}\``);
  lines.push('');
  lines.push('## Preconditions');
  lines.push('');
  lines.push('| Precondition | Status | Evidence |');
  lines.push('|---|---:|---|');
  for (const item of report.preconditions) {
    lines.push(`| ${item.id} | ${item.status} | ${item.evidence.map((value) => `\`${value}\``).join('<br>')} |`);
  }
  lines.push('');
  lines.push('## Candidate Records');
  lines.push('');
  lines.push('| Record class | Count | Readiness | Recommendation |');
  lines.push('|---|---:|---|---|');
  for (const item of report.candidate_records) {
    lines.push(`| ${item.record_class} | ${item.record_count} | ${item.readiness} | ${item.current_decision_recommendation} |`);
  }
  lines.push('');
  lines.push('## Recommendation');
  lines.push('');
  lines.push('Do not promote PV records to `references/machine/` in PV.7. The safe future path is to add a CLI-backed promotion design and mutation-log workflow first, prove at least two lesson-side regressions, and then consider unit-template links before any richer procedure-template or visual-state promotion.');
  lines.push('');
  lines.push('## Boundaries');
  lines.push('');
  lines.push('- `references/machine/` PV registry creation remains unauthorized.');
  lines.push('- Student-facing PV projection remains unauthorized.');
  lines.push('- Provisional `exercise_operations` may be referenced only with explicit provisional status.');
  lines.push('- Diagnostics, adaptive routing, student-facing AI, sequencing, mastery, and summative use remain blocked.');
  lines.push('');
  return lines.join('\n');
}

function renderReviewPacketMd(packet) {
  const lines = [];
  lines.push('# GATE-PV7 Machine Promotion Review: Review Packet');
  lines.push('');
  lines.push(`Sprint: \`${packet.sprint_id}\``);
  lines.push('Status: `prepared_for_human_review`');
  lines.push('');
  lines.push('This packet prepares the Procedure-Visual machine-promotion decision. It does not authorize machine registry creation or student-facing PV projection.');
  lines.push('');
  lines.push('## Context');
  lines.push('');
  lines.push('PV.1 through PV.6 created the governed `references/data/procedure-visual/` overlay, schemas, validator, six pilot templates, six visual states, unit-template links, procedure-game alignment proof, SVG projection proof, coverage reporting, and reference-health dashboard integration. RX.6 made generator-blocked skill-tree units explicit.');
  lines.push('');
  lines.push('PV.7 asks whether any PV records should move into `references/machine/`. The readiness report shows that key promotion prerequisites are still absent: no PV machine-edit CLI, no PV machine-promotion mutation log, and no two lesson-side PV regression proofs.');
  lines.push('');
  lines.push('## Readiness Report');
  lines.push('');
  lines.push(`- JSON: \`${READINESS_JSON}\``);
  lines.push(`- Markdown: \`${READINESS_MD}\``);
  lines.push(`- Gate-local JSON: \`${GATE_READINESS_JSON}\``);
  lines.push(`- Gate-local Markdown: \`${GATE_READINESS_MD}\``);
  lines.push('');
  lines.push('## Recommended Decision');
  lines.push('');
  lines.push('Do not promote PV records to `references/machine/` in PV.7. Keep all PV records under `references/data/procedure-visual/` and use PV.7 to record the future promotion path.');
  lines.push('');
  lines.push('If HCS wants a future promotion path, the safest first candidate is `unit-template-links`, but only after a CLI-backed promotion workflow, mutation logs, and at least two lesson-side PV regressions exist. Procedure templates and visual states should remain governed data overlays until renderer and lesson-regression maturity is stronger.');
  lines.push('');
  lines.push('## Review Questions');
  lines.push('');
  for (const question of packet.review_questions) {
    lines.push(`### ${question.id}`);
    lines.push('');
    lines.push(question.question);
    lines.push('');
    lines.push(`Recommended answer: ${question.recommended_answer}`);
    lines.push('');
  }
  lines.push('## Required Conditions If Gate Passes');
  lines.push('');
  for (const condition of packet.required_conditions_if_passes) {
    lines.push(`- ${condition}`);
  }
  lines.push('');
  return lines.join('\n');
}

function main() {
  const readiness = buildReadiness();
  const packet = buildReviewPacket(readiness);
  writeJson(READINESS_JSON, readiness);
  const readinessMarkdown = renderReadinessMd(readiness);
  writeText(READINESS_MD, readinessMarkdown);
  writeJson(GATE_READINESS_JSON, readiness);
  writeText(GATE_READINESS_MD, readinessMarkdown);
  writeJson(REVIEW_PACKET_JSON, packet);
  writeText(REVIEW_PACKET_MD, renderReviewPacketMd(packet));
  console.log(`wrote ${READINESS_JSON}`);
  console.log(`wrote ${REVIEW_PACKET_JSON}`);
}

if (require.main === module) main();

module.exports = {
  buildReadiness,
  buildReviewPacket,
};
