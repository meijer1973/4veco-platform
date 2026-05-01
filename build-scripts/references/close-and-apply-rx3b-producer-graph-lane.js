#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep AUTHORIZED_ORDER aligned with the human gate closure before reuse.
 * - This script may write gate/report/sprint artifacts directly, but protected
 *   machine references must only be changed through the CLI command invoked
 *   here: build-scripts/references/unit-add.js.
 * - A80/A81 and graphical MO=MK are intentionally outside RX.3b.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GATE_DIR = 'reports/review-gates/GATE-RX3b-producer-graph-lane-review';
const SPECS_PATH = `${GATE_DIR}/candidate-specs.json`;
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const HUMAN_JSON = `${GATE_DIR}/human-interview.json`;
const HUMAN_MD = `${GATE_DIR}/human-interview.md`;
const CLOSURE_JSON = `${GATE_DIR}/gate-closure.json`;
const CLOSURE_MD = `${GATE_DIR}/gate-closure.md`;
const BLOCK_JSON = `${GATE_DIR}/RX.3b-generator-blocked-units.json`;
const BLOCK_MD = `${GATE_DIR}/RX.3b-generator-blocked-units.md`;
const MUTATION_LOG_JSON = `${GATE_DIR}/RX.3b-mutation-log.json`;
const MUTATION_LOG_MD = `${GATE_DIR}/RX.3b-mutation-log.md`;
const TODAY = '2026-05-01';
const AUTHORIZED_ORDER = ['A77', 'A78'];
const REQUIRED_DEPENDENCIES = {
  A77: ['A63', 'A29'],
  A78: ['A63', 'A75', 'A77'],
};
const PV_CONSTRAINTS = [
  'title and economic context',
  'horizontal and vertical axes',
  'units and scale',
  'TO and TK labels or legend',
  'exact versus estimated reading where relevant',
  'graph-reading before calculation or interpretation',
  'non-color fallback requirement for later PV visual-state templates',
];
const BLOCKED_SCOPE = [
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
  console.error(`RX.3b apply failed: ${message}`);
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
  const spec = JSON.parse(JSON.stringify(candidate.rx3b_draft_spec));
  if (spec.id === 'A78') {
    spec.needs = REQUIRED_DEPENDENCIES.A78;
  }
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

  for (const id of ['A80', 'A81']) {
    assert(!existingIds.has(id), `${id} must remain held and absent before RX.3b mutation`);
  }

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
    held_candidates_absent: true,
    dependency_check: 'passed',
    required_dependencies: REQUIRED_DEPENDENCIES,
  };
}

function writeGateFiles() {
  const answers = [
    ['RX3B-Q1', 'A. Yes, keep the scope limited to the TO-TK graph lane', 'RX.3b is limited to A77 and A78.'],
    ['RX3B-Q2', 'A. Yes, preserve A63/A29', 'A77 is approved with needs A63 and A29.'],
    ['RX3B-Q3', 'B. Mostly; add A77 after A77 is minted', 'A78 is approved with needs A63, A75, and A77.'],
    ['RX3B-Q4', 'A. Yes, record PV requirements now but keep real PV templates for PV.3/PV.5', 'Procedures must satisfy PV graph-stage constraints, but no real PV templates are created in this gate.'],
    ['RX3B-Q5', 'A. Yes, keep A80, A81, and HOLD_GRAPHICAL_MO_MK_OPTIMUM held', 'A80, A81, and graphical MO=MK remain outside the lane.'],
    ['RX3B-Q6', 'A. Yes, hard block student-facing use', 'Missing generators are acceptable only with non-interactive generator-block tracking.'],
    ['RX3B-Q7', 'A. Yes, after live numbering/dependency checks', 'Authorize CLI-only mutation for A77 and A78 after live checks.'],
    ['RX3B-Q8', 'pass_with_conditions', 'Close the gate as pass_with_conditions, not clean pass.'],
  ].map(([id, answer, decision]) => ({ id, answer, decision }));

  const human = {
    gate_id: 'GATE-RX3b-producer-graph-lane-review',
    sprint_id: 'RX.3b',
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
    a78_dependency_decision: {
      decision: 'add_A77',
      rationale: 'A78 profit/loss reading in a TO-TK graph should build on A77 break-even reading because break-even anchors the profit/loss zones in the same graph representation.',
    },
    pv_constraints_required: PV_CONSTRAINTS,
    generator_block_required: true,
    student_facing_use_authorized: false,
    pv_projection_authorized: false,
    answers,
    pattern_analysis: 'RX.3b remains limited to the TO-TK graph lane. A77 and A78 are approved for CLI-only mutation, with A78 dependent on A77. PV constraints are required in procedures, but real PV templates and product surfaces remain blocked.',
    targeted_followups_required: true,
    targeted_followups: [
      'Run live numbering and dependency checks immediately before mutation.',
      'Use only unit-add.js in the order A77, A78.',
      'Add A77 to A78 needs after A77 is minted.',
      'Keep A80, A81, and graphical MO=MK held.',
      'Track A77 and A78 as generator-blocked/non-interactive until generators exist and validate.',
      'Do not create real PV producer-graph templates in this gate.',
      'Keep student-facing skill-tree use, PV projection, diagnostics, adaptive routing, AI, sequencing, mastery, and summative use blocked.',
    ],
  };

  const closure = {
    gate_id: 'GATE-RX3b-producer-graph-lane-review',
    sprint_id: 'RX.3b',
    status: 'pass_with_conditions',
    closed_on: TODAY,
    closure_confirmed_by_human: true,
    human_interview: HUMAN_MD,
    review_packet: `${GATE_DIR}/review-packet.md`,
    audit: SPECS_PATH,
    summary: 'RX.3b producer graph-lane review is closed as pass_with_conditions. CLI-only mutation is authorized for A77 and A78 after live numbering and dependency checks. A77 must include A63 and A29. A78 must include A63, A75, and A77 after A77 is minted. Both units remain generator-blocked/non-interactive; PV projection and product-surface uses remain blocked.',
    protected_reference_data_changed: false,
    cli_unit_mutation_authorized: true,
    authorized_execution_mode: 'CLI-only via build-scripts/references/unit-add.js',
    authorized_candidates: AUTHORIZED_ORDER,
    required_execution_order: AUTHORIZED_ORDER,
    required_dependencies: REQUIRED_DEPENDENCIES,
    a78_dependency_decision: human.a78_dependency_decision,
    pv_constraints_required: PV_CONSTRAINTS,
    generator_block_required: true,
    student_facing_use_authorized: false,
    pv_projection_authorized: false,
    blocked_scope: BLOCKED_SCOPE,
    accepted_outcomes: [
      'RX.3b is correctly limited to the TO-TK graph lane.',
      'A77 is accepted with needs A63 and A29.',
      'A78 is accepted with needs A63, A75, and A77 after A77 is minted.',
      'PV graph-stage constraints must be represented in the unit procedures without creating real PV templates in this gate.',
      'CLI-only mutation may proceed for A77 and A78 after live checks.',
      'Missing generators are acceptable only if both units remain generator-blocked and non-interactive.',
    ],
    blocked_outcomes: [
      'Do not mutate A80 in this gate.',
      'Do not mutate A81 in this gate.',
      'Do not mutate HOLD_GRAPHICAL_MO_MK_OPTIMUM.',
      'Do not mutate held duplicate/overlap records.',
      'Do not create real PV producer-graph templates in this gate.',
      'Do not hand-edit references/machine/.',
      'Do not hand-edit references/external/.',
      'Do not mutate authored source files.',
      'Do not patch RAG chunks by hand.',
      'Do not expose A77 or A78 in student-facing skill-tree or PV projection before generator/projection support exists.',
      'Do not authorize diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative use, or student-facing PV projection.',
    ],
    explicit_decisions: [
      {
        topic: 'gate status',
        decision: 'Close GATE-RX3b-producer-graph-lane-review as pass_with_conditions, not clean pass.',
      },
      {
        topic: 'mutation authorization',
        decision: 'Authorize CLI-only unit mutation for A77 and A78 after live numbering and dependency checks.',
      },
      {
        topic: 'execution order',
        decision: 'Use the order A77, A78; A78 must not be minted before A77 exists.',
      },
      {
        topic: 'A77 dependencies',
        decision: 'A77 must include A63 and A29 as needs.',
      },
      {
        topic: 'A78 dependencies',
        decision: 'A78 must include A63, A75, and A77 as needs.',
      },
      {
        topic: 'PV constraints',
        decision: 'Record PV graph-stage requirements in procedures but do not create real PV producer-graph templates in this gate.',
      },
      {
        topic: 'generator status',
        decision: 'A77 and A78 remain generator-blocked/non-interactive until GEN_A77 and GEN_A78 exist and validate.',
      },
      {
        topic: 'blocked producer graph lane',
        decision: 'A80, A81, and graphical MO=MK remain held.',
      },
    ],
    conditions_to_reopen_or_pass: [
      'Run live numbering check immediately before any later mutation.',
      'Use only unit-add.js, in the order A77, A78.',
      'Record the A78 dependency decision in the gate closure and mutation log.',
      'A78 must include A63, A75, and A77 as needs after A77 is minted.',
      'Do not mutate A80, A81, HOLD_GRAPHICAL_MO_MK_OPTIMUM, or held duplicate/overlap records.',
      'Mark A77 and A78 generator-blocked and non-interactive until generators exist and validate.',
      'Do not expose A77 or A78 in student-facing skill-tree or PV projection before generator/projection support exists.',
      'Do not create real PV producer-graph templates in this gate; keep those for PV.3/PV.5.',
      'Do not hand-edit references/machine, references/external, authored source files, or RAG chunks.',
      'No diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative use, or student-facing PV projection is authorized.',
    ],
    allowed_next_step: 'RX.3b CLI-only producer TO-TK graph-lane mutation execution',
    allowed_next_step_scope: [
      'live A-domain numbering check',
      'dependency resolution check',
      'unit-add.js execution for A77 and A78 only',
      'A78 dependency adjustment to include A77',
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
    `# Human Interview: GATE-RX3b Producer Graph-Lane Review

Recorded on: ${TODAY}  
Reviewer role: Head of Content Strategy  
Decision: \`pass_with_conditions\`

## Answers

${answerMd}

## Decision Pattern

The review authorizes CLI-only mutation for \`A77\` and \`A78\`, adds \`A77\` as a dependency for \`A78\`, requires PV graph-stage discipline in procedures, and keeps graph-lane/product-surface blocks active.

## Authorized Candidates

- \`A77\`
- \`A78\`

## Required Follow-Ups

- Re-check live A-domain numbering immediately before mutation.
- Use \`unit-add.js\` only, in the order \`A77\` -> \`A78\`.
- Add \`A77\` to \`A78\` needs after \`A77\` is minted.
- Track both new generators as missing/non-interactive until implemented and validated.
- Keep \`A80\`, \`A81\`, graphical \`MO=MK\`, real PV templates, and product-boundary uses blocked.
`
  );
  writeText(
    CLOSURE_MD,
    `# Gate Closure: GATE-RX3b Producer Graph-Lane Review

Status: \`pass_with_conditions\`  
Closed on: ${TODAY}  
Human confirmation: yes

## Summary

RX.3b is closed as \`pass_with_conditions\`. CLI-only mutation is authorized for \`A77\` and \`A78\` after live numbering and dependency checks.

## Accepted Outcomes

- \`A77\` and \`A78\` are the only authorized units.
- \`A77\` must include \`A63\` and \`A29\` as needs.
- \`A78\` must include \`A63\`, \`A75\`, and \`A77\` as needs after \`A77\` is minted.
- The required order is \`A77\` -> \`A78\`.
- Both units remain generator-blocked and non-interactive until generator/projection support exists and validates.

## Blocked Outcomes

- No mutation of \`A80\`, \`A81\`, graphical \`MO=MK\`, or held duplicate/overlap records.
- No real PV producer-graph templates in this gate.
- No hand edits to \`references/machine/\`, \`references/external/\`, authored source files, or RAG chunks.
- No student-facing skill-tree use, PV projection, diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative use.

## Next Allowed Step

Run the approved CLI-only mutation for \`A77\` and \`A78\`, then validate and regenerate the reference/RAG surfaces.
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
    sprint_id: 'RX.3b',
    status: 'active_block',
    generated_on: new Date().toISOString(),
    generator_blocked_units: AUTHORIZED_ORDER,
    missing_generators: AUTHORIZED_ORDER.map((id) => `GEN_${id}`),
    student_facing_use_authorized: false,
    student_facing_skilltree_use_allowed: false,
    pv_projection_authorized: false,
    pv_projection_allowed: false,
    units,
    notes: [
      'These units are live catalog entries only after RX.3b CLI mutation.',
      'No student-facing skill-tree or PV projection use is authorized before generator/projection support exists and validates.',
    ],
  });
  writeText(
    BLOCK_MD,
    `# RX.3b Generator-Blocked Units

Status: \`active_block\`

The following units are live catalog entries but remain non-interactive until generators and projection support exist and validate:

- \`A77\` / \`GEN_A77\`
- \`A78\` / \`GEN_A78\`

No student-facing skill-tree use, PV projection, diagnostics, adaptive routing, AI, sequencing, mastery, or summative use is authorized.
`
  );
}

function writeMutationLog(preExecutionCheck, commands, status = 'completed') {
  const commandsPassed = commands.filter((command) => command.status === 'passed').length;
  const commandsFailed = commands.filter((command) => command.status === 'failed').length;
  const log = {
    sprint_id: 'RX.3b',
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
    a78_dependency_decision: {
      decision: 'add_A77',
      rationale: 'A78 profit/loss reading in a TO-TK graph should build on A77 break-even reading because break-even anchors the profit/loss zones in the same graph representation.',
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
      'no real PV producer-graph templates in this gate',
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
    `# RX.3b Mutation Log

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

## A78 Dependency Decision

\`A78\` was added with needs \`A63\`, \`A75\`, and \`A77\`, preserving the RX.3b HCS decision that profit/loss reading in a TO-TK graph should build on the break-even graph anchor.

## Generator Block

\`A77\` and \`A78\` remain generator-blocked/non-interactive until \`GEN_A77\` and \`GEN_A78\` exist and validate.

## Blocked Scope

No mutation or student-facing use was authorized for \`A80\`, \`A81\`, graphical \`MO=MK\`, held records, real PV templates, diagnostics, adaptive routing, student-facing AI, sequencing, mastery, summative use, or PV projection.
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
  console.log(`OK RX.3b applied: ${AUTHORIZED_ORDER.join(', ')}`);
}

if (require.main === module) main();
