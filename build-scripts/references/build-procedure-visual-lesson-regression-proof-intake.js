#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SPRINT_ID = 'PV-G4';
const GATE_ID = 'GATE-PV-G4-lesson-regression';
const SCRIPT = 'build-scripts/references/build-procedure-visual-lesson-regression-proof-intake.js';

const paths = {
  templates: 'references/data/procedure-visual/procedure-templates.json',
  visualStates: 'references/data/procedure-visual/visual-states.json',
  links: 'references/data/procedure-visual/unit-template-links.json',
  promotionDesign: 'references/data/procedure-visual/promotion-pipeline-design.json',
  requirements: 'references/data/procedure-visual/lesson-regression-proof-requirements.json',
  reportJson: 'reports/json/procedure-visual-lesson-regression-proof-intake.json',
  reportMd: 'reports/markdown/procedure-visual-lesson-regression-proof-intake.md',
  gateDir: `reports/review-gates/${GATE_ID}`,
  lessonProofDir: process.env.LESSON_PV_G4_PROOF_DIR || path.resolve('..', '4veco-lessen', 'pv-g4-proof-records'),
};

const forbiddenMachineFiles = [
  'references/machine/procedure-templates.json',
  'references/machine/visual-states.json',
  'references/machine/unit-template-links.json',
  'references/machine/procedure-visual-vocab.json',
  'references/machine/procedure-visual.json',
  'references/machine/procedure-visual-unit-template-links.json',
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function ensureDir(fileOrDir) {
  const dir = path.extname(fileOrDir) ? path.dirname(fileOrDir) : fileOrDir;
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(file, data) {
  ensureDir(file);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function writeMarkdown(file, lines) {
  ensureDir(file);
  fs.writeFileSync(file, `${lines.join('\n')}\n`, 'utf8');
}

function countItems(record, field) {
  return Array.isArray(record[field]) ? record[field].length : 0;
}

function loadRecordedProofs(requirements) {
  if (!fs.existsSync(paths.lessonProofDir)) return [];
  const requiredFields = requirements.proof_record_required_fields || [];
  return fs.readdirSync(paths.lessonProofDir)
    .filter((file) => /^PVG4-proof-\d+\.json$/.test(file))
    .sort()
    .map((file) => {
      const proofPath = path.join(paths.lessonProofDir, file);
      const proof = readJson(proofPath);
      const missingFields = requiredFields.filter((field) => !Object.prototype.hasOwnProperty.call(proof, field));
      const failedCommands = Array.isArray(proof.validation_commands)
        ? proof.validation_commands.filter((cmd) => cmd && cmd.status !== 'passed')
        : ['validation_commands_missing'];
      return {
        ...proof,
        proof_record_path: path.relative(process.cwd(), proofPath).replace(/\\/g, '/'),
        intake_validation: {
          missing_required_fields: missingFields,
          failed_validation_command_count: failedCommands.length,
          validation_command_count: Array.isArray(proof.validation_commands) ? proof.validation_commands.length : 0,
        },
      };
    });
}

function buildRequirements() {
  return {
    schema_version: 1,
    registry_id: 'procedure-visual-lesson-regression-proof-requirements',
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    status: 'evidence_intake_prepared',
    generated_by: SCRIPT,
    generated_on: new Date().toISOString(),
    policy: {
      references_machine_write_authorized: false,
      references_external_write_authorized: false,
      lesson_target_write_authorized_by_references_team: false,
      student_facing_projection_authorized: false,
      diagnostics_or_adaptive_use_authorized: false,
    },
    required_proof_count: 2,
    proof_must_show: [
      'fresh paragraph build or pilot surface uses or validates PV data',
      'proof is owned and committed by the lesson team when it changes lesson-side output',
      'no hand-built generated-output patching',
      'complete paragraph validation passes where applicable',
      'Book 1 check passes where applicable',
      'PV data remains a references/data overlay and no PV machine registry is created',
    ],
    acceptable_proof_types: [
      'procedure game maps to formal PV steps in a fresh paragraph or pilot surface',
      'visual-state sequence is used or validated in a companion visual surface',
      'answer model validates against PV step order',
      'surface-variant check proves the same semantic visual anchor across web/docx/slide surfaces',
    ],
    rejected_proof_types: [
      'manual patch inside generated lesson output',
      'screenshot-only evidence without reproducible command or artifact path',
      'platform-only report proof with no lesson-side use or validation',
      'student-facing PV projection without a publication gate',
      'any proof that requires PV records to move into references/machine',
    ],
    proof_record_required_fields: [
      'proof_id',
      'lesson_repo_commit',
      'paragraph_or_surface',
      'pv_records_used',
      'validation_commands',
      'generated_output_touched',
      'hand_patch_absent',
      'proof_artifacts',
      'owner',
      'review_status',
    ],
  };
}

function buildReport(requirements) {
  const templates = readJson(paths.templates);
  const visualStates = readJson(paths.visualStates);
  const links = readJson(paths.links);
  const promotionDesign = readJson(paths.promotionDesign);
  const forbiddenMachineFilesFound = forbiddenMachineFiles.filter((file) => fs.existsSync(file));
  const recordedProofs = loadRecordedProofs(requirements);
  const enoughProofs = recordedProofs.length >= requirements.required_proof_count;
  const proofRecordsComplete = recordedProofs.every((proof) => proof.intake_validation.missing_required_fields.length === 0);
  const proofCommandsPassed = recordedProofs.every((proof) => proof.intake_validation.failed_validation_command_count === 0);
  const readyForHcsReview = enoughProofs && proofRecordsComplete && proofCommandsPassed && forbiddenMachineFilesFound.length === 0;

  const checks = [
    {
      id: 'required_proof_count_met',
      status: enoughProofs ? 'passed' : 'failed',
      detail: `${recordedProofs.length} of ${requirements.required_proof_count} required lesson-side PV regression proofs are recorded.`,
    },
    {
      id: 'proof_records_complete',
      status: proofRecordsComplete && recordedProofs.length > 0 ? 'passed' : 'failed',
      detail: proofRecordsComplete
        ? 'Recorded proof records contain the required PV-G4 template fields.'
        : 'One or more proof records are missing required fields.',
    },
    {
      id: 'proof_validation_commands_passed',
      status: proofCommandsPassed && recordedProofs.length > 0 ? 'passed' : 'failed',
      detail: proofCommandsPassed
        ? 'Recorded proof validation commands are marked passed.'
        : 'One or more proof validation commands are missing or failed.',
    },
    {
      id: 'no_forbidden_machine_files',
      status: forbiddenMachineFilesFound.length === 0 ? 'passed' : 'failed',
      detail: forbiddenMachineFilesFound.length === 0 ? 'No PV machine registry files found.' : forbiddenMachineFilesFound.join(', '),
    },
    {
      id: 'references_team_lesson_write_block',
      status: 'passed',
      detail: 'The proof-intake packet does not authorize references-team commits to lesson-side output.',
    },
    {
      id: 'student_facing_projection_block',
      status: 'passed',
      detail: 'PV-G4 proof intake does not authorize student-facing PV projection or generator exposure.',
    },
  ];

  return {
    schema_version: 1,
    report_id: 'procedure-visual-lesson-regression-proof-intake',
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    status: readyForHcsReview ? 'ready_for_hcs_review' : 'blocked_pending_lesson_team_evidence',
    generated_by: SCRIPT,
    generated_on: new Date().toISOString(),
    source_evidence: {
      promotion_pipeline_design: paths.promotionDesign,
      promotion_pipeline_status: promotionDesign.status,
      pv_template_count: countItems(templates, 'templates'),
      pv_visual_state_count: countItems(visualStates, 'visual_states'),
      pv_unit_template_link_count: countItems(links, 'links'),
    },
    policy: requirements.policy,
    required_proof_count: requirements.required_proof_count,
    recorded_proof_count: recordedProofs.length,
    recorded_proofs: recordedProofs,
    missing_evidence: readyForHcsReview ? [] : [
      ...(!enoughProofs ? ['two lesson-team-owned PV regression proofs'] : []),
      ...(!proofRecordsComplete ? ['complete PV-G4 proof-template fields for each proof'] : []),
      ...(!proofCommandsPassed ? ['passing validation output for each proof'] : []),
      ...(forbiddenMachineFilesFound.length > 0 ? ['removal of forbidden PV machine registry files'] : []),
    ],
    next_action_for_lesson_team: readyForHcsReview
      ? [
        'Submit the HCS PV-G4 lesson-regression review packet for human gate review.',
        'Do not treat PV-G4 as closed until HCS records a gate decision.',
      ]
      : [
        'Choose two fresh paragraph or pilot surfaces that can use or validate existing PV records.',
        'Run the lesson-side build and validation commands in the lesson-team workflow.',
        'Commit lesson-side changes in the lesson team repository only.',
        'Return proof records using the PV-G4 proof template.',
      ],
    proof_requirements: requirements,
    forbidden_machine_files_checked: forbiddenMachineFiles,
    forbidden_machine_files_found: forbiddenMachineFilesFound,
    checks,
    gate_recommendation: {
      ready_for_hcs_closure: readyForHcsReview,
      recommended_status_now: readyForHcsReview ? 'submit_for_hcs_review' : 'hold_pending_lesson_evidence',
      reason: readyForHcsReview
        ? 'PV-G4 has two recorded lesson-side regression proofs with passing validation commands; HCS still must review and decide.'
        : 'PV-G4 requires at least two complete lesson-side regression proofs before HCS can review the gate.',
    },
  };
}

function buildProofTemplate() {
  return {
    proof_id: 'PVG4-proof-001',
    lesson_repo_commit: '<lesson-team-commit-sha>',
    paragraph_or_surface: '<paragraph id or pilot surface>',
    pv_records_used: {
      procedure_template_ids: [],
      visual_state_ids: [],
      unit_template_link_ids: [],
    },
    validation_commands: [
      {
        command: '<lesson-side build or validation command>',
        status: 'passed',
        evidence_artifact: '<path or URL>',
      },
    ],
    generated_output_touched: true,
    hand_patch_absent: true,
    proof_artifacts: [
      '<path or URL to lesson-team proof artifact>',
    ],
    owner: 'lesson_team',
    review_status: 'submitted_for_pv_g4_review',
    notes: 'Use one record per lesson-side PV regression proof.',
  };
}

function markdownReport(report) {
  return [
    '# Procedure-Visual Lesson Regression Proof Intake',
    '',
    `Sprint: \`${SPRINT_ID}\``,
    `Gate: \`${GATE_ID}\``,
    `Status: \`${report.status}\``,
    '',
    '## Current Evidence',
    '',
    `- PV templates: ${report.source_evidence.pv_template_count}`,
    `- PV visual states: ${report.source_evidence.pv_visual_state_count}`,
    `- PV unit-template links: ${report.source_evidence.pv_unit_template_link_count}`,
    `- Recorded lesson-side PV regression proofs: ${report.recorded_proof_count}/${report.required_proof_count}`,
    '',
    '## Decision',
    '',
    report.gate_recommendation.ready_for_hcs_closure
      ? 'PV-G4 has enough recorded lesson-side evidence for HCS human review. This packet does not close the gate by itself.'
      : 'PV-G4 is not ready for closure. The references team can prepare the evidence intake packet, but the required proof must come from lesson-team-owned build or validation work.',
    '',
    '## Missing Evidence',
    '',
    ...(report.missing_evidence.length ? report.missing_evidence.map((item) => `- ${item}`) : ['- None for intake; HCS review still required.']),
    '',
    '## Required Proof Features',
    '',
    ...report.proof_requirements.proof_must_show.map((item) => `- ${item}`),
    '',
    '## Boundary',
    '',
    '- No PV `references/machine/` registry creation is authorized.',
    '- No references-team lesson-target write or commit is authorized.',
    '- No student-facing PV projection, generator exposure, diagnostics, adaptive routing, AI, sequencing, mastery, or summative use is authorized.',
  ];
}

function markdownProofTemplate(template) {
  return [
    '# PV-G4 Lesson Regression Proof Template',
    '',
    'Use this template once per lesson-side PV regression proof. The lesson team owns lesson-output changes and commits.',
    '',
    '```json',
    JSON.stringify(template, null, 2),
    '```',
    '',
    'A valid PV-G4 closure needs at least two proof records plus validation output showing no hand-built generated-output patching.',
  ];
}

function reviewPacket(report) {
  const ready = report.gate_recommendation.ready_for_hcs_closure;
  return [
    '# GATE-PV-G4 Lesson Regression: Evidence Intake Packet',
    '',
    `Sprint: \`${SPRINT_ID}\``,
    `Status: \`${ready ? 'evidence_ready_for_hcs_review' : 'evidence_intake_prepared_not_ready_for_closure'}\``,
    '',
    ready
      ? 'This packet records two lesson-side PV regression proofs for HCS human review. It does not close the gate by itself.'
      : 'This packet prepares the PV-G4 evidence request. It does not close the gate because lesson-side PV regression proof evidence is incomplete.',
    '',
    '## Context',
    '',
    'PV.7 and PV.8 require at least two lesson-side PV regression proofs before any student-facing or machine-authoritative PV promotion can reopen. The current platform-side PV overlay is mature enough for proof intake, but the lesson-side evidence is still absent.',
    '',
    '## Current Proof Count',
    '',
    `Recorded proofs: \`${report.recorded_proof_count}/${report.required_proof_count}\``,
    '',
    '## Required Lesson-Team Evidence',
    '',
    ...report.proof_requirements.proof_must_show.map((item) => `- ${item}`),
    '',
    '## Review Questions After Proofs Exist',
    '',
    '### PVG4-Q1',
    '',
    'Are at least two lesson-side PV regression proofs recorded and owned by the lesson team?',
    '',
    ready ? 'Recommended answer now: A. Yes, two proof records are recorded.' : 'Recommended answer now: B. No, hold until proof records exist.',
    '',
    '### PVG4-Q2',
    '',
    'Does each proof show PV data being used or validated in a fresh paragraph or pilot surface without hand-built generated-output patching?',
    '',
    ready ? 'Recommended answer now: A. Yes, inspect proof artifacts and validation commands.' : 'Recommended answer now: B. Not yet assessable.',
    '',
    '### PVG4-Q3',
    '',
    'Did complete paragraph validation and Book 1 checks pass where applicable?',
    '',
    ready ? 'Recommended answer now: A. Yes, commands are recorded as passed in the intake.' : 'Recommended answer now: B. Not yet assessable.',
    '',
    '### PVG4-Q4',
    '',
    'Does PV-G4 authorize PV machine promotion or student-facing PV projection?',
    '',
    'Recommended answer: A. No.',
    '',
    '### PVG4-Q5',
    '',
    'What gate status should `GATE-PV-G4-lesson-regression` receive?',
    '',
    ready ? 'Recommended answer now: `human_review_required`.' : 'Recommended answer now: `hold_pending_lesson_evidence`.',
    '',
    '## Required Conditions Before Closure',
    '',
    '- Record two lesson-team-owned proof records.',
    '- Include reproducible validation commands and outputs.',
    '- Confirm no generated lesson output was hand-patched.',
    '- Keep PV records in `references/data/procedure-visual/`.',
    '- Do not authorize machine promotion, student-facing projection, diagnostics, adaptive routing, AI, sequencing, mastery, or summative use.',
  ];
}

function main() {
  const requirements = buildRequirements();
  const report = buildReport(requirements);
  const template = buildProofTemplate();
  const ready = report.gate_recommendation.ready_for_hcs_closure;

  writeJson(paths.requirements, requirements);
  writeJson(paths.reportJson, report);
  writeMarkdown(paths.reportMd, markdownReport(report));
  writeJson(path.join(paths.gateDir, 'proof-template.json'), template);
  writeMarkdown(path.join(paths.gateDir, 'proof-template.md'), markdownProofTemplate(template));
  writeJson(path.join(paths.gateDir, 'proof-intake.json'), report);
  writeMarkdown(path.join(paths.gateDir, 'proof-intake.md'), markdownReport(report));
  writeJson(path.join(paths.gateDir, 'review-packet.json'), {
    gate_id: GATE_ID,
    sprint_id: SPRINT_ID,
    status: ready ? 'evidence_ready_for_hcs_review' : 'evidence_intake_prepared_not_ready_for_closure',
    recorded_proof_count: report.recorded_proof_count,
    required_proof_count: report.required_proof_count,
    ready_for_hcs_closure: ready,
    recommended_status_now: ready ? 'human_review_required' : 'hold_pending_lesson_evidence',
    machine_promotion_authorized: false,
    student_facing_projection_authorized: false,
  });
  writeMarkdown(path.join(paths.gateDir, 'review-packet.md'), reviewPacket(report));

  console.log(`wrote ${paths.reportJson}`);
  console.log(`wrote ${path.join(paths.gateDir, 'review-packet.md')}`);
}

if (require.main === module) {
  main();
}
