#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep AUTHORIZED_ORDER aligned with the human gate closure before reuse.
 * - Add new candidate lanes by reading their candidate-spec packet and preserving
 *   the same pattern: gate closure first, live numbering check, CLI-only mutation,
 *   mutation log, and generator/product-boundary tracking.
 * - This script may write review/report artifacts directly, but protected machine
 *   references must only be changed through the CLI command invoked here:
 *   build-scripts/references/unit-add.js.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GATE_DIR = 'reports/review-gates/GATE-RX2-first-lane-mutation-review';
const SPECS_PATH = 'references/data/sprints/RX.2-first-lane-candidate-specs.json';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const BLOCK_PATH = 'references/data/sprints/RX.2-generator-blocked-units.json';
const BLOCK_MD_PATH = `${GATE_DIR}/RX.2-generator-blocked-units.md`;
const MUTATION_LOG_JSON = `${GATE_DIR}/RX.2-mutation-log.json`;
const MUTATION_LOG_MD = `${GATE_DIR}/RX.2-mutation-log.md`;
const HUMAN_JSON = `${GATE_DIR}/human-interview.json`;
const HUMAN_MD = `${GATE_DIR}/human-interview.md`;
const CLOSURE_JSON = `${GATE_DIR}/gate-closure.json`;
const CLOSURE_MD = `${GATE_DIR}/gate-closure.md`;
const TODAY = '2026-04-29';
const AUTHORIZED_ORDER = ['A61', 'A66', 'A67', 'A70', 'A72', 'A74'];
const BLOCKED_SCOPE = [
  'A62',
  'A63',
  'A64',
  'A68',
  'A69',
  'A71',
  'A73',
  'A82',
  'A83',
  'A84',
  'producer candidates A75-A81',
  'held duplicate/overlap records',
  'student diagnostics',
  'adaptive routing',
  'student-facing AI',
  'automatic sequencing',
  'mastery decisions',
  'summative decisions',
];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function writeJson(relPath, data) {
  fs.writeFileSync(repoPath(relPath), JSON.stringify(data, null, 2) + '\n');
}

function writeText(relPath, text) {
  fs.writeFileSync(repoPath(relPath), text.replace(/\n*$/, '\n'));
}

function fail(message) {
  console.error(`RX.2 apply failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function commandText(spec) {
  return `node build-scripts/references/unit-add.js --spec '${JSON.stringify(spec)}'`;
}

function runCommand(spec) {
  const command = 'node';
  const args = ['build-scripts/references/unit-add.js', '--spec', JSON.stringify(spec)];
  const result = spawnSync(command, args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    shell: false,
  });

  return {
    command: commandText(spec),
    status: result.status === 0 ? 'passed' : 'failed',
    exit_code: result.status,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

function specsById(specs) {
  return new Map(specs.candidates.map((candidate) => [candidate.candidate_id, candidate]));
}

function strengthenSpec(candidate) {
  const spec = JSON.parse(JSON.stringify(candidate.rx2_draft_spec));
  if (spec.id === 'A61') {
    spec.kern = 'Selecteer in een economische tabel de waarden die nodig zijn voor een berekening: juiste rij, kolom, periode en oude/nieuwe waarde.';
    spec.zero_needs_review = {
      reviewed_on: TODAY,
      reviewer: 'Head of Content Strategy RX.2 gate',
      rationale: 'Approved as an underbouw-assumed root because this is economic source-value selection for a calculation, not generic table reading.',
      recommended_needs: [],
      severity: 'low',
    };
  }
  if (spec.id === 'A70') {
    delete spec.review_flags;
  }
  return spec;
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
    const spec = strengthenSpec(candidate);
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
  };
}

function writeGateFiles() {
  const answers = [
    ['RX2-Q1', 'A. Yes', 'The RX.2 first-lane scope remains limited to A61, A66, A67, A70, A72, and A74.'],
    ['RX2-Q2', 'A. Preserve A61/A66/A67/A70/A72/A74', 'The provisional IDs are preserved with gaps so deferred representation candidates can later occupy their intended conceptual slots.'],
    ['RX2-Q3', 'B. Yes, but strengthen zero-needs rationale', 'A61 is acceptable as an underbouw-assumed root only when described as economic source-value selection for a calculation, not generic table reading.'],
    ['RX2-Q4', 'A. Yes', 'A70 uses A38 as the first-lane prerequisite; deferred A64 remains tied to the later pie/chart lane.'],
    ['RX2-Q5', 'B. Mostly, with wording fixes', 'The candidate specs are strong enough for mutation after tightening A61 wording and preserving the A70 dependency decision in closure and mutation logs.'],
    ['RX2-Q6', 'B. Yes, but mark non-interactive until implemented', 'The units may enter the catalog, but student-facing skill-tree use remains blocked until generators exist and validate.'],
    ['RX2-Q7', 'A. Yes', 'The CLI mutation plan preserves execution order and protected-source boundaries.'],
    ['RX2-Q8', 'A. Yes', 'Deferred chart-only, line-graph, elasticity, producer, and held duplicate/overlap candidates remain blocked.'],
    ['RX2-Q9', 'A. Yes, all six', 'CLI-only unit mutation is authorized for all six candidates after gate closure and live checks.'],
    ['RX2-Q10', 'B. pass_with_conditions', 'Close the gate as pass_with_conditions; do not close as clean pass.'],
  ].map(([id, answer, decision]) => ({ id, answer, decision }));

  const human = {
    gate_id: 'GATE-RX2-first-lane-mutation-review',
    sprint_id: 'RX.2',
    recorded_on: TODAY,
    reviewer_role: 'Head of Content Strategy',
    decision: 'pass_with_conditions',
    closure_authorized: true,
    plain_pass_authorized: false,
    cli_unit_mutation_authorized: true,
    authorized_candidates: AUTHORIZED_ORDER,
    required_execution_order: AUTHORIZED_ORDER,
    answers,
    pattern_analysis: 'The human review authorizes the six-candidate first lane only, preserves ID gaps, approves the A70 dependency adjustment, and requires generator-blocked/non-interactive tracking before any student-facing skill-tree use.',
    targeted_followups_required: true,
    targeted_followups: [
      'Re-check live A-domain numbering immediately before mutation.',
      'Preserve the A61/A66/A67/A70/A72/A74 IDs unless a numbering conflict appears.',
      'Record the A70 dependency adjustment in the gate closure and mutation log.',
      'Track all six generator implementations as missing/non-interactive until implemented and validated.',
      'Keep deferred chart-only, line-graph, elasticity, producer, and held duplicate/overlap candidates blocked.',
    ],
  };

  const closure = {
    gate_id: 'GATE-RX2-first-lane-mutation-review',
    sprint_id: 'RX.2',
    status: 'pass_with_conditions',
    closed_on: TODAY,
    closure_confirmed_by_human: true,
    human_interview: HUMAN_MD,
    review_packet: `${GATE_DIR}/review-packet.md`,
    audit: `${GATE_DIR}/candidate-specs.json`,
    summary: 'RX.2 first-lane mutation review is closed as pass_with_conditions. CLI-only mutation is authorized for A61, A66, A67, A70, A72, and A74 after live numbering and dependency checks; all six remain generator-blocked/non-interactive for student-facing skill-tree use until their generators are implemented and validated.',
    protected_reference_data_changed: false,
    cli_unit_mutation_authorized: true,
    authorized_execution_mode: 'CLI-only via build-scripts/references/unit-add.js',
    authorized_candidates: AUTHORIZED_ORDER,
    required_execution_order: AUTHORIZED_ORDER,
    blocked_scope: BLOCKED_SCOPE,
    accepted_outcomes: [
      'The bounded first-lane scope is accepted.',
      'The provisional IDs A61, A66, A67, A70, A72, and A74 are preserved with gaps.',
      'A61 is accepted as an underbouw-assumed root when framed as economic source-value selection for a calculation.',
      'A70 may use A38 as the first-lane prerequisite instead of deferred A64.',
      'CLI-only mutation may proceed for all six authorized candidates after live checks.',
      'Generator implementation may be missing if non-interactive/student-facing blocks are tracked.',
    ],
    blocked_outcomes: [
      'Do not mutate any candidate outside A61, A66, A67, A70, A72, and A74.',
      'Do not mutate chart-only candidates A62, A64, A68, or A71 in this lane.',
      'Do not mutate line-graph candidates A63, A69, or A73 in this lane.',
      'Do not mutate elasticity candidates A82, A83, or A84 in this lane.',
      'Do not mutate producer candidates A75-A81 in this lane.',
      'Do not mutate held duplicate/overlap records.',
      'Do not hand-edit references/machine/.',
      'Do not hand-edit references/external/.',
      'Do not mutate authored source files.',
      'Do not patch RAG chunks by hand.',
      'Do not expose the new units in student-facing skill-tree use before generator implementation.',
      'Do not authorize student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions.',
    ],
    explicit_decisions: [
      {
        topic: 'gate status',
        decision: 'Close GATE-RX2-first-lane-mutation-review as pass_with_conditions, not clean pass.',
      },
      {
        topic: 'mutation authorization',
        decision: 'Authorize immediate CLI-only unit mutation for A61, A66, A67, A70, A72, and A74 after live checks.',
      },
      {
        topic: 'ID handling',
        decision: 'Preserve A61/A66/A67/A70/A72/A74 with gaps unless live numbering conflicts appear.',
      },
      {
        topic: 'A61 zero-needs rationale',
        decision: 'Strengthen A61 rationale to economic source-value selection for a calculation, not generic table reading.',
      },
      {
        topic: 'A70 dependency adjustment',
        decision: 'Record that A70 depends on A38 because A64 is a deferred chart-only candidate; pie-chart share reading remains in the A64/A71 lane.',
      },
      {
        topic: 'generator status',
        decision: 'Track all six units as generator-blocked/non-interactive until GEN_A61, GEN_A66, GEN_A67, GEN_A70, GEN_A72, and GEN_A74 are implemented and validated.',
      },
    ],
    conditions_to_reopen_or_pass: [
      'Re-check live A-domain numbering immediately before mutation.',
      'Preserve the provisional IDs with gaps unless a live-numbering conflict appears.',
      'Strengthen A61 zero-needs rationale as economic source-value selection, not generic table reading.',
      'Record the A70 dependency adjustment in gate closure and mutation log because review_flags will not persist through unit-add formatting.',
      'Mark all six generators as missing/non-interactive until GEN_A61, GEN_A66, GEN_A67, GEN_A70, GEN_A72, and GEN_A74 are implemented and validated.',
      'Do not expose these units in student-facing skill-tree use before generator implementation.',
      'Keep deferred chart-only, line-graph, elasticity, producer, and held duplicate/overlap candidates blocked.',
      'Do not hand-edit references/machine, references/external, authored source files, or RAG chunks.',
    ],
    allowed_next_step: 'RX.2 CLI-only first-lane mutation execution',
    allowed_next_step_scope: [
      'live A-domain numbering check',
      'dependency resolution check',
      'unit-add.js execution for A61, A66, A67, A70, A72, and A74 only',
      'generator-blocked/non-interactive tracking',
      'validation and report regeneration',
    ],
  };

  writeJson(HUMAN_JSON, human);
  writeJson(CLOSURE_JSON, closure);

  writeText(HUMAN_MD, `# Human Interview: GATE-RX2 First-Lane Mutation Review

Recorded on: ${TODAY}  
Reviewer role: Head of Content Strategy  
Decision: \`pass_with_conditions\`

## Answers

${answers.map((answer) => `### ${answer.id}\n\nAnswer: ${answer.answer}\n\n${answer.decision}`).join('\n\n')}

## Decision Pattern

The review authorizes the six-candidate first lane only, preserves ID gaps, approves the A70 dependency adjustment, and requires generator-blocked/non-interactive tracking before any student-facing skill-tree use.

## Authorized Candidates

${AUTHORIZED_ORDER.map((id) => `- \`${id}\``).join('\n')}

## Required Follow-Ups

${human.targeted_followups.map((item) => `- ${item}`).join('\n')}
`);

  writeText(CLOSURE_MD, `# Gate Closure: GATE-RX2 First-Lane Mutation Review

Status: \`pass_with_conditions\`  
Closed on: ${TODAY}  
Human confirmation: yes

## Summary

RX.2 first-lane mutation review is closed as \`pass_with_conditions\`. CLI-only mutation is authorized for \`${AUTHORIZED_ORDER.join('`, `')}\` after live numbering and dependency checks.

The new units remain generator-blocked and non-interactive for student-facing skill-tree use until their generators are implemented and validated.

## Authorized Execution

- Execution mode: \`CLI-only via build-scripts/references/unit-add.js\`
- Required order: ${AUTHORIZED_ORDER.map((id) => `\`${id}\``).join(' -> ')}
- Protected source hand edits: blocked

## Accepted Outcomes

${closure.accepted_outcomes.map((item) => `- ${item}`).join('\n')}

## Blocked Outcomes

${closure.blocked_outcomes.map((item) => `- ${item}`).join('\n')}

## Explicit Decisions

${closure.explicit_decisions.map((item) => `- ${item.topic}: ${item.decision}`).join('\n')}

## Conditions

${closure.conditions_to_reopen_or_pass.map((item) => `- ${item}`).join('\n')}
`);
}

function writeGeneratorBlocked(candidateMap) {
  const units = AUTHORIZED_ORDER.map((id) => {
    const candidate = candidateMap.get(id);
    const spec = strengthenSpec(candidate);
    return {
      unit_id: id,
      generator: spec.generator,
      generator_implemented: false,
      generator_status: 'missing_generator_implementation',
      student_facing_skilltree_use_allowed: false,
      non_interactive_until_generator_validates: true,
      proof_required_to_unblock: [
        `${spec.generator} implemented in the skill-tree generator layer`,
        'generator coverage validator passes',
        'student-facing skill-tree exposure is explicitly approved in a later sprint',
      ],
    };
  });
  const block = {
    schema_version: 1,
    sprint_id: 'RX.2',
    status: 'active_block',
    recorded_on: TODAY,
    source_gate: CLOSURE_JSON,
    blocked_reason: 'first-lane units are catalog-valid but generator implementations are missing',
    student_facing_skilltree_use_allowed: false,
    units,
    blocked_downstream_uses: [
      'student-facing skill-tree exposure for A61/A66/A67/A70/A72/A74',
      'student diagnostics',
      'adaptive routing',
      'student-facing AI',
      'automatic sequencing',
      'mastery decisions',
      'summative decisions',
    ],
  };
  writeJson(BLOCK_PATH, block);
  writeText(BLOCK_MD_PATH, `# RX.2 Generator-Blocked Units

Status: \`active_block\`  
Recorded on: ${TODAY}

The six RX.2 first-lane units are allowed in the machine catalog, but they are not approved for student-facing skill-tree use until their generators are implemented and validated.

| Unit | Generator | Implemented | Student-facing skill-tree use |
|---|---|---:|---:|
${units.map((unit) => `| ${unit.unit_id} | ${unit.generator} | no | blocked |`).join('\n')}

## Proof Required To Unblock

- Implement \`GEN_A61\`, \`GEN_A66\`, \`GEN_A67\`, \`GEN_A70\`, \`GEN_A72\`, and \`GEN_A74\`.
- Run generator coverage validation.
- Record later approval before exposing the nodes in student-facing skill-tree use.
`);
}

function writeMutationLogs(precheck, commands, candidateMap) {
  const unitsAdded = commands.filter((command) => command.status === 'passed').map((command) => command.unit_id);
  const log = {
    sprint_id: 'RX.2',
    generated_on: new Date().toISOString(),
    status: commands.every((command) => command.status === 'passed') ? 'completed' : 'failed',
    decision_source: CLOSURE_JSON,
    execution_mode: 'CLI-only via build-scripts/references/unit-add.js',
    pre_execution_check: precheck,
    commands,
    applied: {
      units_added: unitsAdded,
      a70_dependency_decision: 'A70 depends on A38 because A64 is a deferred chart-only candidate; pie-chart share reading remains in the A64/A71 lane.',
      a61_zero_needs_rationale: 'A61 is an underbouw-assumed root for economic source-value selection for a calculation, not generic table reading.',
    },
    generator_block: {
      tracked_in: BLOCK_PATH,
      status: 'active_block',
      units: AUTHORIZED_ORDER.map((id) => ({
        unit_id: id,
        generator: strengthenSpec(candidateMap.get(id)).generator,
        generator_implemented: false,
        student_facing_skilltree_use_allowed: false,
      })),
    },
    blocked_scope: BLOCKED_SCOPE,
    constraints: [
      'CLI-only mutation',
      'no hand edits to references/machine',
      'no hand edits to references/external',
      'no authored-source mutation',
      'no RAG chunk patching',
      'no student-facing skill-tree exposure before generator implementation',
    ],
    summary: {
      units_added: unitsAdded.length,
      commands_passed: commands.filter((command) => command.status === 'passed').length,
      commands_failed: commands.filter((command) => command.status === 'failed').length,
    },
  };
  writeJson(MUTATION_LOG_JSON, log);
  writeText(MUTATION_LOG_MD, `# RX.2 Mutation Log

Status: \`${log.status}\`  
Generated on: ${log.generated_on}  
Decision source: \`${CLOSURE_JSON}\`

## Pre-Execution Check

- Live A-domain max before mutation: \`${precheck.live_a_domain_max_id_before_mutation}\`
- Authorized IDs available: ${precheck.authorized_ids_available ? 'yes' : 'no'}
- Dependency check: ${precheck.dependency_check}

## Commands

| Unit | Status | Command output |
|---|---|---|
${commands.map((command) => `| ${command.unit_id} | ${command.status} | ${command.stdout.replace(/\|/g, '\\|')} |`).join('\n')}

## Applied

- Units added: ${unitsAdded.map((id) => `\`${id}\``).join(', ')}
- A61 rationale: ${log.applied.a61_zero_needs_rationale}
- A70 decision: ${log.applied.a70_dependency_decision}

## Generator Block

Tracked in: \`${BLOCK_PATH}\`

All six units remain blocked for student-facing skill-tree use until generator implementation and validation.

## Blocked Scope

${BLOCKED_SCOPE.map((item) => `- ${item}`).join('\n')}
`);
}

function main() {
  const specs = readJson(SPECS_PATH);
  const candidateMap = specsById(specs);
  assert(
    JSON.stringify(specs.policy.first_lane_scope) === JSON.stringify(AUTHORIZED_ORDER),
    'candidate spec first_lane_scope does not match authorized order'
  );

  writeGateFiles();
  const precheck = validateLivePreconditions(candidateMap);

  const commands = [];
  for (const id of AUTHORIZED_ORDER) {
    const spec = strengthenSpec(candidateMap.get(id));
    const result = runCommand(spec);
    commands.push({
      step: `add unit ${id}`,
      unit_id: id,
      ...result,
    });
    if (result.status !== 'passed') {
      writeGeneratorBlocked(candidateMap);
      writeMutationLogs(precheck, commands, candidateMap);
      fail(`unit-add failed for ${id}`);
    }
  }

  writeGeneratorBlocked(candidateMap);
  writeMutationLogs(precheck, commands, candidateMap);
  console.log(`OK RX.2 gate closed and ${commands.length} first-lane unit(s) applied through unit-add.js`);
}

if (require.main === module) main();
