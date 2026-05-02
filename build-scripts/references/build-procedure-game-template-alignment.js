#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Add real target-data scans once PV-backed procedure games exist in lesson
 *   targets. Keep legacy_unmapped records allowed until a later migration gate.
 * - Keep this builder read-only with respect to protected references.
 */

const fs = require('fs');
const path = require('path');

const ProcedureEngine = require('../../engines/procedure-engine.js');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const ALIGNMENT_PATH = 'references/data/procedure-visual/procedure-game-alignment-pilots.json';
const PROCEDURE_TEMPLATES_PATH = 'references/data/procedure-visual/procedure-templates.json';
const UNIT_TEMPLATE_LINKS_PATH = 'references/data/procedure-visual/unit-template-links.json';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';

const REPORT_JSON_PATH = 'reports/json/procedure-game-template-alignment.json';
const REPORT_MD_PATH = 'reports/markdown/procedure-game-template-alignment.md';
const GATE_DIR = 'reports/review-gates/GATE-PV4-procedure-game-contract';
const REVIEW_PACKET_JSON_PATH = `${GATE_DIR}/review-packet.json`;
const REVIEW_PACKET_MD_PATH = `${GATE_DIR}/review-packet.md`;
const TECHNICAL_CLOSURE_JSON_PATH = `${GATE_DIR}/technical-closure.json`;
const TECHNICAL_CLOSURE_MD_PATH = `${GATE_DIR}/technical-closure.md`;

const FORBIDDEN_MACHINE_PV_FILES = [
  'references/machine/procedure-templates.json',
  'references/machine/visual-states.json',
  'references/machine/procedure-visual-vocab.json',
  'references/machine/procedure-game-template-alignment.json',
];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function exists(relPath) {
  return fs.existsSync(repoPath(relPath));
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

function bulletList(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

function commandList(commands) {
  return ['```bash', ...commands, '```'].join('\n');
}

function validateProcedureShape(procedure, alignmentId) {
  assert(procedure && typeof procedure === 'object', `${alignmentId} missing procedure`);
  for (const field of ['id', 'title', 'icon', 'description']) {
    assert(typeof procedure[field] === 'string' && procedure[field].length > 0, `${alignmentId} procedure missing ${field}`);
  }
  assert(Array.isArray(procedure.steps) && procedure.steps.length >= 3, `${alignmentId} procedure must have at least 3 steps`);
  assert(procedure.steps[0].type === 'given', `${alignmentId} first step must be given`);
  assert(procedure.steps.some((step) => step.type === 'choose'), `${alignmentId} must include at least one choose step`);

  for (const [index, step] of procedure.steps.entries()) {
    assert(['given', 'choose'].includes(step.type), `${alignmentId} step ${index} has invalid type ${step.type}`);
    assert(typeof step.label === 'string' && step.label.length > 0, `${alignmentId} step ${index} missing label`);
    if (step.type === 'given') {
      assert(typeof step.text === 'string' && step.text.length > 0, `${alignmentId} given step ${index} missing text`);
    }
    if (step.type === 'choose') {
      assert(Array.isArray(step.options) && step.options.length >= 2, `${alignmentId} choose step ${index} needs 2+ options`);
      const correctCount = step.options.filter((option) => option.correct === true).length;
      assert(correctCount === 1, `${alignmentId} choose step ${index} must have exactly one correct option`);
      for (const option of step.options) {
        assert(typeof option.text === 'string' && option.text.length > 0, `${alignmentId} option missing text`);
        if (option.correct !== true) {
          assert(typeof option.feedback === 'string' && option.feedback.length > 0, `${alignmentId} wrong option missing feedback`);
        }
      }
    }
  }
}

function buildStatus() {
  for (const relPath of [ALIGNMENT_PATH, PROCEDURE_TEMPLATES_PATH, UNIT_TEMPLATE_LINKS_PATH, UNITS_PATH]) {
    assert(exists(relPath), `missing ${relPath}`);
  }
  for (const relPath of FORBIDDEN_MACHINE_PV_FILES) {
    assert(!exists(relPath), `unexpected PV machine registry file: ${relPath}`);
  }

  const alignment = readJson(ALIGNMENT_PATH);
  const procedureTemplates = readJson(PROCEDURE_TEMPLATES_PATH);
  const unitTemplateLinks = readJson(UNIT_TEMPLATE_LINKS_PATH);
  const units = readJson(UNITS_PATH);

  assert(alignment.schema_version === 1, 'alignment schema_version must be 1');
  assert(alignment.registry_id === 'procedure-game-alignment-pilots', 'alignment registry_id mismatch');
  assert(alignment.storage_decision && alignment.storage_decision.machine_registry_created === false, 'alignment must remain references/data overlay');
  assert(alignment.publication_policy && alignment.publication_policy.student_facing_projection_allowed === false, 'alignment must block student-facing projection');

  const templatesById = new Map((procedureTemplates.templates || []).map((template) => [template.template_id, template]));
  const unitsById = new Map(units.map((unit) => [unit.id, unit]));
  const linkKeys = new Set((unitTemplateLinks.links || []).map((link) => `${link.unit_id}:${link.template_id}`));

  const checks = [];
  const rows = [];
  let mappedPilotCount = 0;
  let legacyUnmappedCount = 0;

  for (const pilot of alignment.pilot_procedures || []) {
    assert(pilot.alignment_id, 'pilot missing alignment_id');
    assert(['mapped', 'legacy_unmapped'].includes(pilot.expected_alignment_status), `${pilot.alignment_id} invalid expected_alignment_status`);
    assert(pilot.publication && pilot.publication.student_facing_allowed === false, `${pilot.alignment_id} must block student-facing publication`);
    validateProcedureShape(pilot.procedure, pilot.alignment_id);

    const engine = new ProcedureEngine({ procedures: [pilot.procedure], parNr: pilot.paragraph_ref || 'PV.4' });
    engine.startProcedure(0);
    const status = engine.getFormalAlignmentStatus();
    assert(status && status.status === pilot.expected_alignment_status, `${pilot.alignment_id} expected ${pilot.expected_alignment_status}, got ${status && status.status}`);

    if (pilot.expected_alignment_status === 'mapped') {
      mappedPilotCount++;
      assert(typeof pilot.unit_id === 'string' && unitsById.has(pilot.unit_id), `${pilot.alignment_id} mapped pilot must reference a live unit`);
      assert(typeof pilot.procedure_template_id === 'string' && templatesById.has(pilot.procedure_template_id), `${pilot.alignment_id} mapped pilot references missing template`);
      assert(pilot.procedure.procedure_template_id === pilot.procedure_template_id, `${pilot.alignment_id} procedure_template_id mismatch`);
      assert(linkKeys.has(`${pilot.unit_id}:${pilot.procedure_template_id}`), `${pilot.alignment_id} missing unit-template link`);

      const template = templatesById.get(pilot.procedure_template_id);
      const templateStepIds = new Set((template.procedure_steps || []).map((step) => step.step_id));
      const formalIds = pilot.procedure.steps.map((step) => step.formal_step_id);
      assert(formalIds.every((stepId) => typeof stepId === 'string' && stepId.length > 0), `${pilot.alignment_id} mapped pilot must map every game step`);
      assert(formalIds.every((stepId) => templateStepIds.has(stepId)), `${pilot.alignment_id} formal_step_id must resolve to template steps`);
      assert(new Set(formalIds).size === formalIds.length, `${pilot.alignment_id} formal_step_id values must be unique`);
      assert(templateStepIds.size === formalIds.length && formalIds.every((stepId) => templateStepIds.has(stepId)), `${pilot.alignment_id} must cover every template step exactly once`);
    } else {
      legacyUnmappedCount++;
      assert(pilot.unit_id === null, `${pilot.alignment_id} legacy pilot must not claim unit_id`);
      assert(pilot.procedure_template_id === null, `${pilot.alignment_id} legacy pilot must not claim procedure_template_id`);
      assert(status.mapped_step_count === 0, `${pilot.alignment_id} legacy pilot must have 0 mapped steps`);
    }

    checks.push({
      id: `alignment:${pilot.alignment_id}`,
      status: 'passed',
      detail: `${status.status}, ${status.mapped_step_count}/${status.step_count} mapped steps`
    });
    rows.push({
      alignment_id: pilot.alignment_id,
      procedure_id: pilot.procedure.id,
      unit_id: pilot.unit_id,
      procedure_template_id: pilot.procedure_template_id,
      status: status.status,
      step_count: status.step_count,
      mapped_step_count: status.mapped_step_count,
      unmapped_step_count: status.unmapped_step_count,
      formal_step_ids: status.formal_step_ids
    });
  }

  assert(mappedPilotCount >= 1, 'PV.4 requires at least one fully mapped pilot procedure');
  assert(legacyUnmappedCount >= 1, 'PV.4 requires at least one legacy_unmapped proof');

  checks.unshift(
    {
      id: 'mapped_pilot_present',
      status: 'passed',
      detail: `${mappedPilotCount} fully mapped pilot procedure(s).`
    },
    {
      id: 'legacy_unmapped_present',
      status: 'passed',
      detail: `${legacyUnmappedCount} legacy unmapped procedure(s) continue to validate.`
    },
    {
      id: 'no_machine_pv_registry',
      status: 'passed',
      detail: 'No references/machine PV procedure-game alignment registry exists.'
    }
  );

  return {
    report_id: 'procedure-game-template-alignment',
    sprint_id: 'PV.4',
    gate_id: 'GATE-PV4-procedure-game-contract',
    generated_by: 'build-scripts/references/build-procedure-game-template-alignment.js',
    generated_on: new Date().toISOString(),
    status: 'passed',
    summary: {
      pilot_procedure_count: rows.length,
      mapped_pilot_count: mappedPilotCount,
      legacy_unmapped_count: legacyUnmappedCount,
      machine_registry_created: false,
      student_facing_projection_allowed: false
    },
    alignments: rows,
    checks,
    acceptance_commands: [
      'node build-scripts/references/build-procedure-game-template-alignment.js',
      'npx.cmd jest engines/tests/procedure-engine.test.js engines/tests/procedure-data-formal-step.test.js --runInBand'
    ],
    blocked_scope: [
      'references/machine Procedure-Visual registries',
      'required migration of existing procedure-game data',
      'student-facing PV projection',
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
  const rows = report.alignments
    .map((row) => `| ${row.alignment_id} | ${row.procedure_id} | ${row.unit_id || ''} | ${row.procedure_template_id || ''} | ${row.status} | ${row.mapped_step_count}/${row.step_count} |`)
    .join('\n');
  const checks = report.checks
    .map((check) => `| ${check.id} | ${check.status} | ${check.detail} |`)
    .join('\n');

  return `# Procedure-Game Template Alignment

Generated by: \`${report.generated_by}\`
Generated on: ${report.generated_on}
Status: \`${report.status}\`

## Summary

- Pilot procedures: ${report.summary.pilot_procedure_count}
- Fully mapped pilots: ${report.summary.mapped_pilot_count}
- Legacy unmapped proofs: ${report.summary.legacy_unmapped_count}
- Machine registry created: \`${report.summary.machine_registry_created}\`
- Student-facing projection allowed: \`${report.summary.student_facing_projection_allowed}\`

## Alignments

| Alignment | Procedure | Unit | Template | Status | Mapped Steps |
| --- | --- | --- | --- | --- | --- |
${rows}

## Checks

| Check | Status | Detail |
| --- | --- | --- |
${checks}

## Boundary

PV.4 only adds an optional mapping contract. Existing procedure-game data may remain \`legacy_unmapped\`, and no student-facing PV projection, renderer publication, or machine promotion is authorized.

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
    purpose: 'Technical contract gate proving optional formal_step_id mapping works while legacy procedure games remain valid.',
    review_questions: [
      {
        id: 'PV4-Q1',
        question: 'Can procedure-game data optionally map steps to formal PV template steps?',
        answer: `A. Yes, ${report.summary.mapped_pilot_count} pilot procedure(s) map every game step to a PV template step.`
      },
      {
        id: 'PV4-Q2',
        question: 'Can existing procedure-game data remain unmapped?',
        answer: `A. Yes, ${report.summary.legacy_unmapped_count} legacy_unmapped proof record validates and remains runnable.`
      },
      {
        id: 'PV4-Q3',
        question: 'Does this authorize student-facing PV projection or forced migration?',
        answer: 'A. No, PV.4 only adds the optional contract and keeps publication/migration blocked.'
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
      'ProcedureEngine exposes optional formal_step_id alignment status.',
      `${report.summary.mapped_pilot_count} mapped pilot procedure validates against PV template steps.`,
      `${report.summary.legacy_unmapped_count} legacy unmapped procedure validates without formal_step_id.`,
      'Procedure-game alignment remains a references/data contract fixture.',
      'No references/machine PV registry exists.',
      'Student-facing PV projection and forced migration remain blocked.'
    ],
    next_sprint_unblocked: 'RX.5 or PV.5 may proceed according to the roadmap; PV.4 does not force lesson-side migration.',
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
  try {
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
  } catch (error) {
    console.error(`Procedure-game template alignment failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = {
  buildStatus,
};
