#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep AUTHORIZED_ORDER aligned with the human gate closure before reuse.
 * - This script may write gate/report/sprint artifacts directly, but protected
 *   machine references must only be changed through the CLI command invoked
 *   here: build-scripts/references/unit-add.js.
 * - A77/A78/A80/A81 and graphical MO=MK are intentionally outside RX.3a.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GATE_DIR = 'reports/review-gates/GATE-RX3a-first-lane-mutation-review';
const SPECS_PATH = `${GATE_DIR}/candidate-specs.json`;
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const HUMAN_JSON = `${GATE_DIR}/human-interview.json`;
const HUMAN_MD = `${GATE_DIR}/human-interview.md`;
const CLOSURE_JSON = `${GATE_DIR}/gate-closure.json`;
const CLOSURE_MD = `${GATE_DIR}/gate-closure.md`;
const BLOCK_JSON = `${GATE_DIR}/RX.3a-generator-blocked-units.json`;
const BLOCK_MD = `${GATE_DIR}/RX.3a-generator-blocked-units.md`;
const MUTATION_LOG_JSON = `${GATE_DIR}/RX.3a-mutation-log.json`;
const MUTATION_LOG_MD = `${GATE_DIR}/RX.3a-mutation-log.md`;
const TODAY = '2026-05-01';
const AUTHORIZED_ORDER = ['A75', 'A76', 'A79'];
const REQUIRED_DEPENDENCIES = {
  A75: ['A04', 'A61'],
  A76: ['A14', 'A04', 'A61'],
  A79: ['A75', 'A61'],
};
const BLOCKED_SCOPE = [
  'A77',
  'A78',
  'A80',
  'A81',
  'HOLD_GRAPHICAL_MO_MK_OPTIMUM',
  'held duplicate/overlap records',
  'student diagnostics',
  'adaptive routing',
  'student-facing AI',
  'automatic sequencing',
  'mastery decisions',
  'summative use',
  'student-facing PV projection',
];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function writeJson(relPath, data) {
  fs.mkdirSync(path.dirname(repoPath(relPath)), { recursive: true });
  fs.writeFileSync(repoPath(relPath), `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(relPath, text) {
  fs.mkdirSync(path.dirname(repoPath(relPath)), { recursive: true });
  fs.writeFileSync(repoPath(relPath), text.replace(/\n*$/, '\n'));
}

function fail(message) {
  console.error(`RX.3a apply failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function sameArray(actual, expected) {
  return JSON.stringify(actual || []) === JSON.stringify(expected || []);
}

function specById(specs) {
  return new Map(specs.candidates.map((candidate) => [candidate.candidate_id, candidate]));
}

function finalSpec(candidate) {
  const spec = JSON.parse(JSON.stringify(candidate.rx3a_draft_spec));
  delete spec.review_flags;
  return spec;
}

function commandText(spec) {
  return `node build-scripts/references/unit-add.js --spec '${JSON.stringify(spec)}'`;
}

function runUnitAdd(spec) {
  const result = spawnSync(process.execPath, ['build-scripts/references/unit-add.js', '--spec', JSON.stringify(spec)], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    shell: false,
  });
  return {
    step: `add unit ${spec.id}`,
    unit_id: spec.id,
    command: commandText(spec),
    status: result.status === 0 ? 'passed' : 'failed',
    exit_code: result.status,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

function validateLivePreconditions(candidateMap) {
  const units = readJson(UNITS_PATH);
  const existingIds = new Set(units.map((unit) => unit.id));
  const occupied = AUTHORIZED_ORDER.filter((id) => existingIds.has(id));
  assert(occupied.length === 0, `authorized IDs already exist: ${occupied.join(', ')}`);

  const available = new Set(existingIds);
  for (const id of AUTHORIZED_ORDER) {
    const candidate = candidateMap.get(id);
    assert(candidate, `missing candidate spec for ${id}`);
    const spec = finalSpec(candidate);
    assert(sameArray(spec.needs, REQUIRED_DEPENDENCIES[id]), `${id} needs do not match the human decision`);
    for (const need of spec.needs || []) {
      assert(available.has(need), `${id} depends on missing or later unit ${need}`);
    }
    available.add(id);
  }

  const maxA = units
    .filter((unit) => /^A\d+$/.test(unit.id))
    .map((unit) => unit.id)
    .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))
    .at(-1);

  return {
    checked_on: new Date().toISOString(),
    live_a_domain_max_id_before_mutation: maxA,
    authorized_ids_available: true,
    occupied_authorized_ids: occupied,
    dependency_check: 'passed',
    required_dependencies: REQUIRED_DEPENDENCIES,
  };
}

function writeGateFiles() {
  const answers = [
    ['RX3A-Q1', 'A. Yes, keep the scope limited to A75/A76/A79', 'RX.3a is limited to the producer table/data first lane.'],
    ['RX3A-Q2', 'A. Yes', 'A75 correctly combines profit calculation with source-value selection from a TO/TK table.'],
    ['RX3A-Q3', 'A. Yes, preserve the HCS dependency decision', 'A76 must keep needs A14, A04, and A61.'],
    ['RX3A-Q4', 'A. Yes, provided A75 is minted first', 'A79 depends on A75 and A61.'],
    ['RX3A-Q5', 'A. Yes', 'The execution order remains A75 -> A76 -> A79.'],
    ['RX3A-Q6', 'B. Yes, but hard-block student-facing use', 'Missing generators are acceptable only with non-interactive generator-block tracking.'],
    ['RX3A-Q7', 'A. Yes, after live numbering/dependency checks', 'Authorize CLI-only mutation for A75, A76, and A79 after live checks.'],
    ['RX3A-Q8', 'pass_with_conditions', 'Close the gate as pass_with_conditions, not clean pass.'],
  ].map(([id, answer, decision]) => ({ id, answer, decision }));

  const human = {
    gate_id: 'GATE-RX3a-first-lane-mutation-review',
    sprint_id: 'RX.3a',
    recorded_on: TODAY,
    reviewer_role: 'Head of Content Strategy',
    decision: 'pass_with_conditions',
    closure_authorized: true,
    plain_pass_authorized: false,
    cli_unit_mutation_authorized: true,
    authorized_candidates: AUTHORIZED_ORDER,
    authorized_execution_mode: 'CLI-only via build-scripts/references/unit-add.js',
    required_execution_order: AUTHORIZED_ORDER,
    required_dependencies: REQUIRED_DEPENDENCIES,
    generator_block_required: true,
    student_facing_use_authorized: false,
    graph_lane_mutation_authorized: false,
    answers,
    pattern_analysis: 'RX.3a remains limited to the producer table/data first lane. A75, A76, and A79 are approved for CLI-only mutation; graph-lane candidates and product surfaces remain blocked.',
    targeted_followups_required: true,
    targeted_followups: [
      'Run live numbering and dependency checks immediately before mutation.',
      'Use only unit-add.js in the order A75, A76, A79.',
      'Keep A76 needs as A14, A04, and A61.',
      'Do not mutate A77, A78, A80, A81, graphical MO=MK, or held duplicate/overlap records.',
      'Track A75, A76, and A79 as generator-blocked/non-interactive until generators exist and validate.',
      'Keep student-facing skill-tree use, PV projection, diagnostics, adaptive routing, AI, sequencing, mastery, and summative use blocked.',
    ],
  };

  const closure = {
    gate_id: 'GATE-RX3a-first-lane-mutation-review',
    sprint_id: 'RX.3a',
    status: 'pass_with_conditions',
    closed_on: TODAY,
    closure_confirmed_by_human: true,
    human_interview: HUMAN_MD,
    review_packet: `${GATE_DIR}/review-packet.md`,
    audit: SPECS_PATH,
    summary: 'RX.3a first-lane mutation review is closed as pass_with_conditions. CLI-only mutation is authorized for A75, A76, and A79 after live numbering and dependency checks. A76 must include A14, A04, and A61. All three units remain generator-blocked/non-interactive until generator implementation and validation; graph-lane and product-surface uses remain blocked.',
    protected_reference_data_changed: false,
    cli_unit_mutation_authorized: true,
    authorized_execution_mode: 'CLI-only via build-scripts/references/unit-add.js',
    authorized_candidates: AUTHORIZED_ORDER,
    required_execution_order: AUTHORIZED_ORDER,
    required_dependencies: REQUIRED_DEPENDENCIES,
    generator_block_required: true,
    student_facing_use_authorized: false,
    graph_lane_mutation_authorized: false,
    blocked_scope: BLOCKED_SCOPE,
    accepted_outcomes: [
      'RX.3a is correctly limited to A75, A76, and A79.',
      'A75 is accepted with needs A04 and A61.',
      'A76 is accepted with needs A14, A04, and A61.',
      'A79 is accepted with needs A75 and A61, provided A75 is minted first.',
      'The required execution order is A75 -> A76 -> A79.',
      'CLI-only mutation may proceed for A75, A76, and A79 after live checks.',
      'Missing generators are acceptable only if all three units remain generator-blocked and non-interactive.',
    ],
    blocked_outcomes: [
      'Do not mutate A77 in this gate.',
      'Do not mutate A78 in this gate.',
      'Do not mutate A80 in this gate.',
      'Do not mutate A81 in this gate.',
      'Do not mutate HOLD_GRAPHICAL_MO_MK_OPTIMUM.',
      'Do not mutate held duplicate/overlap records.',
      'Do not hand-edit references/machine/.',
      'Do not hand-edit references/external/.',
      'Do not mutate authored source files.',
      'Do not patch RAG chunks by hand.',
      'Do not expose A75, A76, or A79 in student-facing skill-tree or PV projection before generator/projection support exists.',
      'Do not authorize diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative use, or student-facing PV projection.',
    ],
    explicit_decisions: [
      {
        topic: 'gate status',
        decision: 'Close GATE-RX3a-first-lane-mutation-review as pass_with_conditions, not clean pass.',
      },
      {
        topic: 'mutation authorization',
        decision: 'Authorize CLI-only unit mutation for A75, A76, and A79 after live numbering and dependency checks.',
      },
      {
        topic: 'execution order',
        decision: 'Use the order A75, A76, A79; A79 must not be minted before A75 exists.',
      },
      {
        topic: 'A76 dependencies',
        decision: 'A76 must include A14, A04, and A61 because P, GTK, and Q are source-value aware producer data.',
      },
      {
        topic: 'generator status',
        decision: 'A75, A76, and A79 remain generator-blocked/non-interactive until GEN_A75, GEN_A76, and GEN_A79 exist and validate.',
      },
      {
        topic: 'blocked graph lane',
        decision: 'A77, A78, A80, A81, and graphical MO=MK remain outside RX.3a mutation scope.',
      },
    ],
    conditions_to_reopen_or_pass: [
      'Run live numbering check immediately before mutation.',
      'Use only unit-add.js, in the order A75, A76, A79.',
      'A76 must include A14, A04, and A61 as needs.',
      'A79 must not be minted before A75 exists.',
      'Do not mutate A77, A78, A80, A81, or held duplicate/overlap records.',
      'Track A75, A76, and A79 as generator-blocked and non-interactive until generators exist and validate.',
      'Do not expose A75, A76, or A79 in student-facing skill-tree or PV projection before generator/projection support exists.',
      'Do not hand-edit references/machine, references/external, authored source files, or RAG chunks.',
      'No diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative use, or student-facing PV projection is authorized.',
    ],
    allowed_next_step: 'RX.3a CLI-only producer table/data first-lane mutation execution',
    allowed_next_step_scope: [
      'live A-domain numbering check',
      'dependency resolution check',
      'unit-add.js execution for A75, A76, and A79 only',
      'generator-blocked/non-interactive tracking',
      'validation and report regeneration',
    ],
  };

  writeJson(HUMAN_JSON, human);
  writeJson(CLOSURE_JSON, closure);

  const answerMd = answers
    .map((answer) => `### ${answer.id}\n\nAnswer: ${answer.answer}\n\n${answer.decision}`)
    .join('\n\n');
  writeText(
    HUMAN_MD,
    `# Human Interview: GATE-RX3a First-Lane Mutation Review

Recorded on: ${TODAY}  
Reviewer role: Head of Content Strategy  
Decision: \`pass_with_conditions\`

## Answers

${answerMd}

## Decision Pattern

The review authorizes CLI-only mutation for \`A75\`, \`A76\`, and \`A79\`, preserves the HCS dependency decision for \`A76\`, and blocks graph-lane/product-surface use.

## Authorized Candidates

- \`A75\`
- \`A76\`
- \`A79\`

## Required Follow-Ups

- Re-check live A-domain numbering immediately before mutation.
- Use \`unit-add.js\` only, in the order \`A75\` -> \`A76\` -> \`A79\`.
- Keep \`A76\` needs as \`A14\`, \`A04\`, and \`A61\`.
- Track all three new generators as missing/non-interactive until implemented and validated.
- Keep graph-lane and product-boundary blocks active.
`
  );
  writeText(
    CLOSURE_MD,
    `# Gate Closure: GATE-RX3a First-Lane Mutation Review

Status: \`pass_with_conditions\`  
Closed on: ${TODAY}  
Human confirmation: yes

## Summary

RX.3a is closed as \`pass_with_conditions\`. CLI-only mutation is authorized for \`A75\`, \`A76\`, and \`A79\` after live numbering and dependency checks.

## Accepted Outcomes

- \`A75\`, \`A76\`, and \`A79\` are the only authorized units.
- \`A76\` must include \`A14\`, \`A04\`, and \`A61\` as needs.
- The required order is \`A75\` -> \`A76\` -> \`A79\`.
- All three units remain generator-blocked and non-interactive until generator/projection support exists and validates.

## Blocked Outcomes

- No mutation of \`A77\`, \`A78\`, \`A80\`, \`A81\`, graphical \`MO=MK\`, or held duplicate/overlap records.
- No hand edits to \`references/machine/\`, \`references/external/\`, authored source files, or RAG chunks.
- No student-facing skill-tree use, PV projection, diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative use.

## Next Allowed Step

Run the approved CLI-only mutation for \`A75\`, \`A76\`, and \`A79\`, then validate and regenerate the reference/RAG surfaces.
`
  );
}

function writeGeneratorBlock() {
  const units = AUTHORIZED_ORDER.map((unitId) => ({
    unit_id: unitId,
    generator: `GEN_${unitId}`,
    generator_implemented: false,
    student_facing_skilltree_use_allowed: false,
    pv_projection_allowed: false,
    blocker: 'generator/projection support missing; student-facing use blocked until implementation and validation',
  }));
  writeJson(BLOCK_JSON, {
    schema_version: 1,
    sprint_id: 'RX.3a',
    status: 'active_block',
    generated_on: new Date().toISOString(),
    generator_blocked_units: AUTHORIZED_ORDER,
    missing_generators: AUTHORIZED_ORDER.map((id) => `GEN_${id}`),
    student_facing_use_authorized: false,
    student_facing_skilltree_use_allowed: false,
    pv_projection_allowed: false,
    units,
    notes: [
      'These units are live catalog entries only after RX.3a CLI mutation.',
      'No student-facing skill-tree or PV projection use is authorized before generator/projection support exists and validates.',
    ],
  });
  writeText(
    BLOCK_MD,
    `# RX.3a Generator-Blocked Units

Status: \`active_block\`

The following units are live catalog entries but remain non-interactive until generators and projection support exist and validate:

- \`A75\` / \`GEN_A75\`
- \`A76\` / \`GEN_A76\`
- \`A79\` / \`GEN_A79\`

No student-facing skill-tree use, PV projection, diagnostics, adaptive routing, AI, sequencing, mastery, or summative use is authorized.
`
  );
}

function writeMutationLog(preExecutionCheck, commands, status = 'completed') {
  const commandsPassed = commands.filter((command) => command.status === 'passed').length;
  const commandsFailed = commands.filter((command) => command.status === 'failed').length;
  const log = {
    sprint_id: 'RX.3a',
    generated_on: new Date().toISOString(),
    status,
    decision_source: CLOSURE_JSON,
    execution_mode: 'CLI-only via build-scripts/references/unit-add.js',
    pre_execution_check: preExecutionCheck,
    commands,
    applied: {
      units_added: commands.filter((command) => command.status === 'passed').map((command) => command.unit_id),
      required_execution_order: AUTHORIZED_ORDER,
      required_dependencies: REQUIRED_DEPENDENCIES,
    },
    generator_block: {
      tracked_in: BLOCK_JSON,
      status: 'active_block',
      units: AUTHORIZED_ORDER.map((unitId) => ({
        unit_id: unitId,
        generator: `GEN_${unitId}`,
        generator_implemented: false,
        student_facing_skilltree_use_allowed: false,
        pv_projection_allowed: false,
      })),
    },
    blocked_scope: BLOCKED_SCOPE,
    constraints: [
      'CLI-only mutation',
      'no hand edits to references/machine',
      'no hand edits to references/external',
      'no authored-source mutation',
      'no RAG chunk patching',
      'no student-facing skill-tree or PV projection before generator/projection support',
    ],
    summary: {
      units_added: commandsPassed,
      commands_passed: commandsPassed,
      commands_failed: commandsFailed,
    },
  };
  writeJson(MUTATION_LOG_JSON, log);
  writeText(
    MUTATION_LOG_MD,
    `# RX.3a Mutation Log

Status: \`${status}\`  
Execution mode: CLI-only via \`build-scripts/references/unit-add.js\`

## Pre-Execution Check

- Live A-domain max before mutation: \`${preExecutionCheck.live_a_domain_max_id_before_mutation}\`
- Authorized IDs available: ${preExecutionCheck.authorized_ids_available ? 'yes' : 'no'}
- Dependency check: \`${preExecutionCheck.dependency_check}\`

## Commands

${commands.map((command) => `- \`${command.unit_id}\`: ${command.status}`).join('\n')}

## Applied Units

${AUTHORIZED_ORDER.map((id) => `- \`${id}\``).join('\n')}

## A76 Dependency Decision

\`A76\` was added with needs \`A14\`, \`A04\`, and \`A61\`, preserving the RX.3/RX.3a HCS decision that the unit is source-value aware.

## Generator Block

\`A75\`, \`A76\`, and \`A79\` remain generator-blocked/non-interactive until \`GEN_A75\`, \`GEN_A76\`, and \`GEN_A79\` exist and validate.

## Blocked Scope

No mutation or student-facing use was authorized for the graph lane, held records, diagnostics, adaptive routing, student-facing AI, sequencing, mastery, summative use, or PV projection.
`
  );
}

function main() {
  const specs = readJson(SPECS_PATH);
  const candidateMap = specById(specs);

  writeGateFiles();
  const preExecutionCheck = validateLivePreconditions(candidateMap);

  const commands = [];
  for (const id of AUTHORIZED_ORDER) {
    const candidate = candidateMap.get(id);
    assert(candidate, `missing candidate spec ${id}`);
    const result = runUnitAdd(finalSpec(candidate));
    commands.push(result);
    if (result.status !== 'passed') {
      writeGeneratorBlock();
      writeMutationLog(preExecutionCheck, commands, 'failed');
      fail(`${id} unit-add.js failed`);
    }
  }

  writeGeneratorBlock();
  writeMutationLog(preExecutionCheck, commands, 'completed');
  console.log(`OK RX.3a applied: ${AUTHORIZED_ORDER.join(', ')}`);
}

if (require.main === module) main();
