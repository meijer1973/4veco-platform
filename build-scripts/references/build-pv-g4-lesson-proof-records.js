#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SCRIPT = 'build-scripts/references/build-pv-g4-lesson-proof-records.js';
const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = process.env.LESSON_ROOT
  ? path.resolve(process.env.LESSON_ROOT)
  : path.resolve(PLATFORM_ROOT, '..', '4veco-lessen');
const BOOK_ROOT = process.env.BOOK_ROOT
  ? path.resolve(process.env.BOOK_ROOT)
  : path.join(LESSON_ROOT, 'Boek 1 - Grondslagen, vraag en aanbod');
const PROOF_DIR = path.join(LESSON_ROOT, 'pv-g4-proof-records');
const REPORT_DIR = path.join(PROOF_DIR, 'reports');
const PILOT_DIR = path.join(PROOF_DIR, 'pilot-surfaces');
const HCS_PACKET = path.join(PROOF_DIR, 'HCS-PV-G4-lesson-regression-review-packet.md');

const PV_PATHS = {
  templates: path.join(PLATFORM_ROOT, 'references', 'data', 'procedure-visual', 'procedure-templates.json'),
  visualStates: path.join(PLATFORM_ROOT, 'references', 'data', 'procedure-visual', 'visual-states.json'),
  links: path.join(PLATFORM_ROOT, 'references', 'data', 'procedure-visual', 'unit-template-links.json'),
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(file, data) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function writeMarkdown(file, lines) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${lines.join('\n')}\n`, 'utf8');
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function rel(file, root = LESSON_ROOT) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function gitHash(repoRoot) {
  return execSync('git rev-parse HEAD', { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function gitDirty(repoRoot, excludeProofArtifacts = false) {
  const command = excludeProofArtifacts
    ? 'git status --porcelain -- . ":(exclude)pv-g4-proof-records"'
    : 'git status --porcelain';
  const out = execSync(command, { cwd: repoRoot, encoding: 'utf8' });
  return out.trim().length > 0;
}

function runCommand(command) {
  try {
    const output = execSync(command, {
      cwd: PLATFORM_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
      maxBuffer: 1024 * 1024 * 8,
    });
    return {
      command,
      status: 'passed',
      output_tail: output.trim().split(/\r?\n/).slice(-20),
    };
  } catch (error) {
    const output = `${error.stdout || ''}\n${error.stderr || ''}`.trim();
    return {
      command,
      status: 'failed',
      exit_code: error.status,
      output_tail: output.split(/\r?\n/).slice(-30),
    };
  }
}

function findTemplate(templateId) {
  const registry = readJson(PV_PATHS.templates);
  return (registry.templates || []).find((item) => item.template_id === templateId);
}

function findVisualState(visualStateId) {
  const registry = readJson(PV_PATHS.visualStates);
  return (registry.visual_states || []).find((item) => item.visual_state_id === visualStateId);
}

function findLink(linkId) {
  const registry = readJson(PV_PATHS.links);
  return (registry.links || []).find((item) => {
    const syntheticId = `${item.unit_id}:${item.template_id}`;
    return item.link_id === linkId || syntheticId === linkId;
  });
}

function buildA61PilotSurface() {
  const pilot = {
    schema_version: 1,
    surface_id: 'l-pv3-a61-table-trace-pilot',
    owner: 'lesson_team',
    student_facing: false,
    paragraph_or_surface: 'Bounded A61 table-trace pilot surface for PV-G4 proof 002',
    procedure_template_id: 'select_table_values_trace',
    visual_state_id: 'table_trace_source_values_selected',
    unit_template_link_id: 'A61:select_table_values_trace',
    task_context: {
      prompt: 'Lees uit een tabel met jaren en prijzen de waarden af die nodig zijn voor een procentuele verandering.',
      source_table_columns: ['jaar', 'prijs'],
      target: 'prijs in oud jaar en prijs in nieuw jaar',
    },
    steps: [
      {
        formal_step_id: 'read_question_target',
        surface_label: 'Lees wat de vraag vraagt',
        text_anchor: 'Bepaal of je een oud jaar, nieuw jaar, prijs of index nodig hebt.',
      },
      {
        formal_step_id: 'check_table_headers_units',
        surface_label: 'Controleer kolommen en eenheden',
        text_anchor: 'Lees de tabelkoppen en noteer of de waarden euro, procent of indexcijfers zijn.',
      },
      {
        formal_step_id: 'select_needed_values',
        surface_label: 'Selecteer de waarden',
        text_anchor: 'Markeer alleen de twee tabelcellen die je nodig hebt voor de berekening.',
      },
      {
        formal_step_id: 'label_selected_values',
        surface_label: 'Label oud en nieuw',
        text_anchor: 'Schrijf bij elke geselecteerde waarde of het de oude waarde of nieuwe waarde is.',
      },
    ],
    visual_anchors: [
      'table headers checked before value selection',
      'needed values selected',
      'selected values labelled old/new',
    ],
    publication_boundary: 'PV validation proof only; no student-facing PV projection authorized.',
  };

  const pilotPath = path.join(PILOT_DIR, 'a61-table-trace-pilot.json');
  writeJson(pilotPath, pilot);
  return { pilot, pilotPath };
}

function validateA61Pilot(pilot, pilotPath) {
  const template = findTemplate(pilot.procedure_template_id);
  const visualState = findVisualState(pilot.visual_state_id);
  const link = findLink(pilot.unit_template_link_id);
  const expectedStepIds = template ? (template.procedure_steps || template.steps || []).map((step) => step.step_id || step.formal_step_id) : [];
  const actualStepIds = (pilot.steps || []).map((step) => step.formal_step_id);
  const checks = [];

  function check(id, ok, detail, extra = {}) {
    checks.push({
      id,
      status: ok ? 'passed' : 'failed',
      detail,
      ...extra,
    });
  }

  check('template_exists', Boolean(template), `Template ${pilot.procedure_template_id}`);
  check('visual_state_exists', Boolean(visualState), `Visual state ${pilot.visual_state_id}`);
  check('unit_template_link_exists', Boolean(link), `Unit-template link ${pilot.unit_template_link_id}`);
  check(
    'step_order_matches_template',
    JSON.stringify(actualStepIds) === JSON.stringify(expectedStepIds),
    `actual=${actualStepIds.join(' > ')}, expected=${expectedStepIds.join(' > ')}`,
    { actual: actualStepIds, expected: expectedStepIds }
  );
  check(
    'not_student_facing',
    pilot.student_facing === false,
    'Pilot remains a lesson-owned proof artifact, not student-facing publication.'
  );
  check(
    'visual_anchors_present',
    Array.isArray(pilot.visual_anchors) && pilot.visual_anchors.length >= 3,
    'Pilot records table-trace visual anchors.'
  );

  const failures = checks.filter((item) => item.status !== 'passed');
  const report = {
    schema_version: 1,
    report_id: 'PVG4-proof-002-a61-table-trace-report',
    generated_by: SCRIPT,
    generated_on: new Date().toISOString(),
    status: failures.length === 0 ? 'passed' : 'failed',
    pilot_surface: rel(pilotPath),
    pv_records_used: {
      procedure_template_ids: [pilot.procedure_template_id],
      visual_state_ids: [pilot.visual_state_id],
      unit_template_link_ids: [pilot.unit_template_link_id],
    },
    checks,
    failures,
  };
  const reportPath = path.join(REPORT_DIR, 'PVG4-proof-002-a61-table-trace-report.json');
  writeJson(reportPath, report);
  return { report, reportPath };
}

function validationCommands(contractReportPath) {
  const p111 = path.join(BOOK_ROOT, '1.1 Hoofdstuk Economisch denken en rekenen', '1.1.1 Schaarste en economisch denken');
  const p112 = path.join(BOOK_ROOT, '1.1 Hoofdstuk Economisch denken en rekenen', '1.1.2 Percentages en indexcijfers');
  return [
    `node scripts\\validate-procedure-contracts.js --book-root "${BOOK_ROOT}" --report "${contractReportPath}"`,
    `node scripts\\validate-paragraph.js --mode complete --profile student-web "${p111}"`,
    `node scripts\\validate-paragraph.js --mode part-a --profile publisher-print "${p111}"`,
    `node scripts\\validate-paragraph.js --mode complete --profile student-web "${p112}"`,
    `npm.cmd run check:book -- "${BOOK_ROOT}"`,
  ];
}

function buildProofRecord({ proofId, lessonCommit, lessonDirty, paragraphOrSurface, pvRecordsUsed, validationResults, generatedOutputTouched, proofArtifacts, notes }) {
  return {
    proof_id: proofId,
    lesson_repo_commit: lessonCommit,
    lesson_worktree_dirty_at_generation: lessonDirty,
    paragraph_or_surface: paragraphOrSurface,
    pv_records_used: pvRecordsUsed,
    validation_commands: validationResults,
    generated_output_touched: generatedOutputTouched,
    hand_patch_absent: true,
    hand_patch_absent_evidence: [
      'Generated lesson-target procedure data is produced by platform script b1-111-procedure-data.js.',
      'Proof records and pilot surfaces are lesson-owned proof artifacts, not generated student output.',
      'PV records remain in references/data/procedure-visual; no references/machine PV registry is created.',
    ],
    proof_artifacts: proofArtifacts,
    owner: 'lesson_team',
    review_status: 'submitted_for_pv_g4_review',
    notes,
  };
}

function buildHcsPacket({ proof1, proof2, contractReportPath, a61ReportPath }) {
  const allCommandStatuses = [...proof1.validation_commands, ...proof2.validation_commands].map((cmd) => cmd.status);
  const ready = allCommandStatuses.every((status) => status === 'passed');
  const lines = [
    '# HCS PV-G4 Lesson Regression Review Packet',
    '',
    'Status: `submitted_for_human_review`',
    `Generated by: \`${SCRIPT}\``,
    `Generated on: \`${new Date().toISOString()}\``,
    '',
    '## Recommendation',
    '',
    ready
      ? 'Submit PV-G4 for HCS human review as lesson-side evidence ready. This packet does not close PV-G4 by itself.'
      : 'Do not close PV-G4 yet. One or more proof validation commands failed; use this packet as a remediation record.',
    '',
    '## Proof Count',
    '',
    '- Required proofs: `2`',
    '- Recorded proofs: `2`',
    '',
    '## Proof 001',
    '',
    `- Record: \`${rel(path.join(PROOF_DIR, 'PVG4-proof-001.json'))}\``,
    `- Surface: ${proof1.paragraph_or_surface}`,
    `- PV template: \`${proof1.pv_records_used.procedure_template_ids.join(', ')}\``,
    `- Contract report: \`${rel(contractReportPath)}\``,
    '',
    '## Proof 002',
    '',
    `- Record: \`${rel(path.join(PROOF_DIR, 'PVG4-proof-002.json'))}\``,
    `- Surface: ${proof2.paragraph_or_surface}`,
    `- PV template: \`${proof2.pv_records_used.procedure_template_ids.join(', ')}\``,
    `- A61 report: \`${rel(a61ReportPath)}\``,
    '',
    '## Boundary',
    '',
    '- No PV records are promoted into `references/machine`.',
    '- No student-facing PV projection is authorized.',
    '- No adaptive, diagnostic, mastery, sequencing, AI, or summative use is authorized.',
    '- HCS must still decide the gate outcome.',
    '',
    '## Validation Status',
    '',
    '| Command | Status |',
    '| --- | --- |',
    ...proof1.validation_commands.map((item) => `| \`${item.command.replace(/\|/g, '\\|')}\` | ${item.status} |`),
    ...proof2.validation_commands.map((item) => `| \`${item.command.replace(/\|/g, '\\|')}\` | ${item.status} |`),
  ];
  writeMarkdown(HCS_PACKET, lines);
}

function main() {
  ensureDir(PROOF_DIR);
  ensureDir(REPORT_DIR);
  ensureDir(PILOT_DIR);

  const contractReportPath = path.join(REPORT_DIR, 'PVG4-proof-001-procedure-contract-report.json');
  const commands = validationCommands(contractReportPath);
  const validationResults = commands.map(runCommand);

  const { pilot, pilotPath } = buildA61PilotSurface();
  const { report: a61Report, reportPath: a61ReportPath } = validateA61Pilot(pilot, pilotPath);

  const lessonCommit = gitHash(LESSON_ROOT);
  const lessonDirty = gitDirty(LESSON_ROOT, true);
  const proof1 = buildProofRecord({
    proofId: 'PVG4-proof-001',
    lessonCommit,
    lessonDirty,
    paragraphOrSurface: '1.1.1 Schaarste en economisch denken / procedure-game + answer-model parity',
    pvRecordsUsed: {
      procedure_template_ids: ['choose_by_opportunity_cost_flow'],
      visual_state_ids: ['flowchart_opportunity_cost_choice'],
      unit_template_link_ids: ['B02:choose_by_opportunity_cost_flow'],
    },
    validationResults,
    generatedOutputTouched: true,
    proofArtifacts: [
      rel(contractReportPath),
      rel(path.join(PROOF_DIR, 'PVG4-proof-001.json')),
    ],
    notes: 'Proof 001 validates that the 1.1.1 procedure-game data maps to formal B02/PV steps and that lesson surfaces no longer drift to the old three-step route.',
  });

  const proof2Validation = [
    {
      command: 'node build-scripts\\references\\build-pv-g4-lesson-proof-records.js (A61 pilot validation stage)',
      status: a61Report.status === 'passed' ? 'passed' : 'failed',
      evidence_artifact: rel(a61ReportPath),
    },
  ];
  const proof2 = buildProofRecord({
    proofId: 'PVG4-proof-002',
    lessonCommit,
    lessonDirty,
    paragraphOrSurface: 'Bounded lesson-owned A61 table-trace pilot surface',
    pvRecordsUsed: a61Report.pv_records_used,
    validationResults: proof2Validation,
    generatedOutputTouched: false,
    proofArtifacts: [
      rel(pilotPath),
      rel(a61ReportPath),
      rel(path.join(PROOF_DIR, 'PVG4-proof-002.json')),
    ],
    notes: 'Proof 002 uses a different PV template and validates A61 table-trace step order without student-facing PV projection.',
  });

  writeJson(path.join(PROOF_DIR, 'PVG4-proof-001.json'), proof1);
  writeJson(path.join(PROOF_DIR, 'PVG4-proof-002.json'), proof2);
  buildHcsPacket({ proof1, proof2, contractReportPath, a61ReportPath });

  const failed = [...validationResults, ...proof2Validation].filter((item) => item.status !== 'passed');
  console.log(`wrote ${rel(path.join(PROOF_DIR, 'PVG4-proof-001.json'))}`);
  console.log(`wrote ${rel(path.join(PROOF_DIR, 'PVG4-proof-002.json'))}`);
  console.log(`wrote ${rel(HCS_PACKET)}`);
  if (failed.length > 0) {
    console.error(`PV-G4 proof record build completed with ${failed.length} failing validation command(s).`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
