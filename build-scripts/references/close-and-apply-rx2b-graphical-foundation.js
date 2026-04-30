#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep AUTHORIZED_ORDER aligned with the human gate closure before reuse.
 * - This script may write gate/report/sprint artifacts directly, but protected
 *   machine references must only be changed through the CLI command invoked
 *   here: build-scripts/references/unit-add.js.
 * - A71 is intentionally held in RX.2b; do not add it to AUTHORIZED_ORDER
 *   without a later explicit human decision.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GATE_DIR = 'reports/review-gates/GATE-RX2b-graphical-foundation';
const SPECS_PATH = 'references/data/sprints/RX.2b-candidate-specs.json';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const COVERAGE_JSON = 'reports/json/graphical-foundation-coverage.json';
const COVERAGE_MD = 'reports/markdown/graphical-foundation-coverage.md';
const BLOCK_PATH = 'references/data/sprints/RX.2b-generator-blocked-units.json';
const BLOCK_MD_PATH = `${GATE_DIR}/RX.2b-generator-blocked-units.md`;
const MUTATION_LOG_JSON = `${GATE_DIR}/RX.2b-mutation-log.json`;
const MUTATION_LOG_MD = `${GATE_DIR}/RX.2b-mutation-log.md`;
const HUMAN_JSON = `${GATE_DIR}/human-interview.json`;
const HUMAN_MD = `${GATE_DIR}/human-interview.md`;
const CLOSURE_JSON = `${GATE_DIR}/gate-closure.json`;
const CLOSURE_MD = `${GATE_DIR}/gate-closure.md`;
const TODAY = '2026-04-30';
const AUTHORIZED_ORDER = ['A62', 'A63', 'A64', 'A65', 'A68', 'A69', 'A73'];
const HELD_CANDIDATES = ['A71'];
const BLOCKED_SCOPE = [
  'A71',
  'A75-A81 producer candidates',
  'A82-A84 elasticity candidates',
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
  fs.mkdirSync(path.dirname(repoPath(relPath)), { recursive: true });
  fs.writeFileSync(repoPath(relPath), `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(relPath, text) {
  fs.mkdirSync(path.dirname(repoPath(relPath)), { recursive: true });
  fs.writeFileSync(repoPath(relPath), text.replace(/\n*$/, '\n'));
}

function fail(message) {
  console.error(`RX.2b apply failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function commandText(spec) {
  return `node build-scripts/references/unit-add.js --spec '${JSON.stringify(spec)}'`;
}

function runCommand(spec) {
  const result = spawnSync('node', ['build-scripts/references/unit-add.js', '--spec', JSON.stringify(spec)], {
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

function finalSpec(candidate) {
  const spec = JSON.parse(JSON.stringify(candidate.rx2b_draft_spec));
  if (['A62', 'A63', 'A64'].includes(spec.id)) {
    spec.zero_needs_review = {
      reviewed_on: TODAY,
      reviewer: 'Head of Content Strategy RX.2b gate',
      rationale: 'Approved as an underbouw-assumed graphical-reading foundation only because the unit procedure explicitly teaches context/title, axis or legend labels, units, scale, exact versus estimated reading, and interpolation where relevant.',
      recommended_needs: [],
      severity: 'medium',
    };
  }
  delete spec.review_flags;
  return spec;
}

function validateLivePreconditions(candidateMap) {
  const units = readJson(UNITS_PATH);
  const existingIds = new Set(units.map((unit) => unit.id));
  const occupied = AUTHORIZED_ORDER.filter((id) => existingIds.has(id));
  assert(occupied.length === 0, `authorized IDs already exist: ${occupied.join(', ')}`);
  for (const id of HELD_CANDIDATES) {
    assert(!existingIds.has(id), `held candidate ${id} already exists in live catalog`);
  }

  const available = new Set(existingIds);
  for (const id of AUTHORIZED_ORDER) {
    const candidate = candidateMap.get(id);
    assert(candidate, `missing candidate spec for ${id}`);
    const spec = finalSpec(candidate);
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
  };
}

function writeGateFiles() {
  const answers = [
    ['RX2b-Q1', 'A. Yes', 'The graphical foundation queue is complete enough for this first pass; the one missing/not-yet-scoped item remains logged but does not block this lane.'],
    ['RX2b-Q2', 'A. Yes', 'A62, A63, and A64 are valid foundation units and must explicitly teach context/title, axis or legend, unit, scale, exact versus estimated reading, and interpolation where relevant.'],
    ['RX2b-Q3', 'A. Yes', 'A65 is justified as a distinct share-times-total composed operation depending on A64 and A04.'],
    ['RX2b-Q4', 'B. Yes, with conditions', 'A68, A69, and A73 are grounded enough if their procedures separate representation reading from calculation.'],
    ['RX2b-Q5', 'B. Hold A71 for later review', 'A71 remains held/high-risk because pie-chart percentage change involves nested share, total, percentage-point, and reconstruction distinctions.'],
    ['RX2b-Q6', 'A. Preserve IDs with gaps', 'Preserve provisional IDs with gaps; holding A71 must not trigger renumbering.'],
    ['RX2b-Q7', 'A. Yes', 'The approved order A62 -> A63 -> A64 -> A65 -> A68 -> A69 -> A73 resolves dependencies without cycles.'],
    ['RX2b-Q8', 'A. Yes', 'The coverage report distinguishes live, candidate, held/high-risk, missing/not-scoped, and generator-blocked states.'],
    ['RX2b-Q9', 'A. Yes', 'All newly approved A-units remain generator-blocked and non-interactive until RX.6 or later generator implementation and validation.'],
    ['RX2b-Q10', 'B. pass_with_conditions', 'Close GATE-RX2b-graphical-foundation as pass_with_conditions.'],
  ].map(([id, answer, decision]) => ({ id, answer, decision }));

  const human = {
    gate_id: 'GATE-RX2b-graphical-foundation',
    sprint_id: 'RX.2b',
    recorded_on: TODAY,
    reviewer_role: 'Head of Content Strategy',
    decision: 'pass_with_conditions',
    closure_authorized: true,
    plain_pass_authorized: false,
    cli_unit_mutation_authorized: true,
    authorized_candidates: AUTHORIZED_ORDER,
    held_candidates: HELD_CANDIDATES,
    required_execution_order: AUTHORIZED_ORDER,
    answers,
    pattern_analysis: 'The human review authorizes the lower-risk graphical foundation lane, holds A71, preserves ID gaps, and requires generator-blocked/non-interactive tracking before any student-facing skill-tree use.',
    targeted_followups_required: true,
    targeted_followups: [
      'Re-check live A-domain numbering immediately before mutation.',
      'Preserve provisional IDs with gaps.',
      'Record A71 as held/high-risk, not silently dropped.',
      'Record the one missing/not-yet-scoped coverage item as backlog with proof-to-close.',
      'Track all seven new generators as missing/non-interactive until implemented and validated.',
      'Keep product-boundary blocks active: no student-facing skill tree exposure, diagnostics, adaptive routing, AI, sequencing, mastery, or summative use.',
    ],
  };

  const closure = {
    gate_id: 'GATE-RX2b-graphical-foundation',
    sprint_id: 'RX.2b',
    status: 'pass_with_conditions',
    closed_on: TODAY,
    closure_confirmed_by_human: true,
    human_interview: HUMAN_MD,
    review_packet: `${GATE_DIR}/review-packet.md`,
    audit: `${GATE_DIR}/candidate-specs.json`,
    summary: 'RX.2b graphical foundation review is closed as pass_with_conditions. CLI-only mutation is authorized for A62, A63, A64, A65, A68, A69, and A73 after live numbering and dependency checks. A71 remains held/high-risk for later focused review. All newly added units remain generator-blocked/non-interactive until generator implementation and validation.',
    protected_reference_data_changed: false,
    cli_unit_mutation_authorized: true,
    authorized_execution_mode: 'CLI-only via build-scripts/references/unit-add.js',
    authorized_candidates: AUTHORIZED_ORDER,
    held_candidates: HELD_CANDIDATES,
    required_execution_order: AUTHORIZED_ORDER,
    blocked_scope: BLOCKED_SCOPE,
    accepted_outcomes: [
      'The graphical foundation queue is complete enough for the first pass.',
      'A62, A63, and A64 are accepted as foundation units only with explicit context/title, labels, units, scale, exact/estimated reading, and interpolation steps.',
      'A65 is accepted as a share-times-total composed operation.',
      'A68, A69, and A73 are accepted with procedures that separate representation reading from calculation.',
      'The provisional IDs are preserved with gaps.',
      'CLI-only mutation may proceed for A62, A63, A64, A65, A68, A69, and A73 after live checks.',
      'Generator implementation may be missing if non-interactive/student-facing blocks are tracked.',
    ],
    blocked_outcomes: [
      'Do not mutate A71 in this gate.',
      'Do not mutate producer candidates A75-A81 in this gate.',
      'Do not mutate elasticity candidates A82-A84 in this gate.',
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
        decision: 'Close GATE-RX2b-graphical-foundation as pass_with_conditions, not clean pass.',
      },
      {
        topic: 'mutation authorization',
        decision: 'Authorize immediate CLI-only unit mutation for A62, A63, A64, A65, A68, A69, and A73 after live checks.',
      },
      {
        topic: 'A71',
        decision: 'Hold A71 as high risk for later focused review; do not silently drop it.',
      },
      {
        topic: 'ID handling',
        decision: 'Preserve provisional IDs with gaps, including the held A71 gap.',
      },
      {
        topic: 'foundation procedure standard',
        decision: 'A62, A63, and A64 must encode context/title, axis or legend labels, units, scale, exact versus estimated reading, and interpolation where relevant.',
      },
      {
        topic: 'generator status',
        decision: 'Track all seven newly added units as generator-blocked/non-interactive until GEN_A62, GEN_A63, GEN_A64, GEN_A65, GEN_A68, GEN_A69, and GEN_A73 are implemented and validated.',
      },
    ],
    conditions_to_reopen_or_pass: [
      'Run live numbering and dependency checks immediately before mutation.',
      'Use only unit-add.js in the approved order.',
      'Do not mutate A71.',
      'Record A71 as held/high-risk.',
      'Record the missing/not-yet-scoped coverage item as backlog with proof-to-close.',
      'Track all new units as generator-blocked and non-interactive.',
      'Regenerated reports must distinguish live, candidate, held, missing, and generator-blocked statuses.',
      'Do not hand-edit references/machine, references/external, authored source files, or RAG chunks.',
      'No student-facing skill-tree use, diagnostics, adaptive routing, AI, sequencing, mastery, or summative use is authorized.',
    ],
    allowed_next_step: 'RX.2b CLI-only graphical foundation mutation execution',
    allowed_next_step_scope: [
      'live A-domain numbering check',
      'dependency resolution check',
      'unit-add.js execution for A62, A63, A64, A65, A68, A69, and A73 only',
      'A71 held/high-risk tracking',
      'generator-blocked/non-interactive tracking',
      'validation and report regeneration',
    ],
  };

  writeJson(HUMAN_JSON, human);
  writeJson(CLOSURE_JSON, closure);

  writeText(HUMAN_MD, `# Human Interview: GATE-RX2b Graphical Foundation

Recorded on: ${TODAY}  
Reviewer role: Head of Content Strategy  
Decision: \`pass_with_conditions\`

## Answers

${answers.map((answer) => `### ${answer.id}\n\nAnswer: ${answer.answer}\n\n${answer.decision}`).join('\n\n')}

## Decision Pattern

The review authorizes the lower-risk graphical foundation lane, holds \`A71\`, preserves ID gaps, and requires generator-blocked/non-interactive tracking before any student-facing skill-tree use.

## Authorized Candidates

${AUTHORIZED_ORDER.map((id) => `- \`${id}\``).join('\n')}

## Held Candidates

${HELD_CANDIDATES.map((id) => `- \`${id}\``).join('\n')}

## Required Follow-Ups

${human.targeted_followups.map((item) => `- ${item}`).join('\n')}
`);

  writeText(CLOSURE_MD, `# Gate Closure: GATE-RX2b Graphical Foundation

Status: \`pass_with_conditions\`  
Closed on: ${TODAY}  
Human confirmation: yes

## Summary

RX.2b graphical foundation review is closed as \`pass_with_conditions\`. CLI-only mutation is authorized for \`${AUTHORIZED_ORDER.join('`, `')}\` after live numbering and dependency checks.

\`A71\` remains held/high-risk for later focused review.

The new units remain generator-blocked and non-interactive for student-facing skill-tree use until their generators are implemented and validated.

## Authorized Execution

- Execution mode: \`CLI-only via build-scripts/references/unit-add.js\`
- Required order: ${AUTHORIZED_ORDER.map((id) => `\`${id}\``).join(' -> ')}
- Held: ${HELD_CANDIDATES.map((id) => `\`${id}\``).join(', ')}
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
    const spec = finalSpec(candidateMap.get(id));
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
    sprint_id: 'RX.2b',
    status: 'active_block',
    recorded_on: TODAY,
    source_gate: CLOSURE_JSON,
    blocked_reason: 'graphical foundation units are catalog-valid but generator implementations are missing',
    student_facing_skilltree_use_allowed: false,
    units,
    held_candidates: HELD_CANDIDATES.map((unit_id) => ({
      unit_id,
      reason: 'held_high_risk_for_later_focused_review',
    })),
    blocked_downstream_uses: [
      'student-facing skill-tree exposure for A62/A63/A64/A65/A68/A69/A73',
      'student diagnostics',
      'adaptive routing',
      'student-facing AI',
      'automatic sequencing',
      'mastery decisions',
      'summative decisions',
    ],
  };
  writeJson(BLOCK_PATH, block);
  writeText(BLOCK_MD_PATH, `# RX.2b Generator-Blocked Units

Status: \`active_block\`  
Recorded on: ${TODAY}

The seven RX.2b graphical-foundation units are allowed in the machine catalog, but they are not approved for student-facing skill-tree use until their generators are implemented and validated.

| Unit | Generator | Implemented | Student-facing skill-tree use |
|---|---|---:|---:|
${units.map((unit) => `| ${unit.unit_id} | ${unit.generator} | no | blocked |`).join('\n')}

## Held Candidate

- \`A71\` remains held/high-risk for later focused review.

## Proof Required To Unblock

- Implement \`GEN_A62\`, \`GEN_A63\`, \`GEN_A64\`, \`GEN_A65\`, \`GEN_A68\`, \`GEN_A69\`, and \`GEN_A73\`.
- Run generator coverage validation.
- Record later approval before exposing the nodes in student-facing skill-tree use.
`);
}

function mdEscape(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

function toMarkdownTable(rows, columns) {
  const header = `| ${columns.map((column) => column.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${columns.map((column) => mdEscape(column.value(row))).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function refreshCoverageAfterMutation() {
  const coverage = readJson(COVERAGE_JSON);
  const units = readJson(UNITS_PATH);
  const byId = new Map(units.map((unit) => [unit.id, unit]));
  const newBlockIds = new Set(AUTHORIZED_ORDER);

  for (const row of coverage.coverage_rows) {
    if (AUTHORIZED_ORDER.includes(row.unit_id)) {
      row.status = 'live_unit';
      row.rx2b_role = 'approved_mutated_unit_generator_blocked';
      row.generator_status = 'missing_generator_implementation';
      row.generator_blocked = true;
      row.aspects = byId.get(row.unit_id).aspects || row.aspects || [];
    }
    if (HELD_CANDIDATES.includes(row.unit_id)) {
      row.status = 'held_high_risk_unit';
      row.rx2b_role = 'held_high_risk_for_later_focused_review';
      row.generator_status = 'not_applicable_until_mutated';
      row.generator_blocked = false;
    }
  }

  coverage.status = 'updated_after_cli_mutation';
  coverage.updated_on = new Date().toISOString();
  coverage.policy.protected_reference_data_changed = true;
  coverage.policy.protected_reference_data_change_mode = 'CLI-only via build-scripts/references/unit-add.js';
  coverage.summary = {
    live_unit_count: coverage.coverage_rows.filter((row) => row.status === 'live_unit').length,
    candidate_unit_count: coverage.coverage_rows.filter((row) => row.status === 'candidate_unit').length,
    held_high_risk_count: coverage.coverage_rows.filter((row) => row.status === 'held_high_risk_unit').length,
    missing_not_yet_scoped_count: coverage.coverage_rows.filter((row) => row.status === 'missing_not_yet_scoped').length,
    deferred_not_rx2b_scope_count: coverage.coverage_rows.filter((row) => row.status === 'deferred_not_rx2b_scope').length,
    generator_blocked_live_count: coverage.coverage_rows.filter((row) => row.status === 'live_unit' && row.generator_blocked).length,
  };
  coverage.generator_blocked_units = coverage.coverage_rows
    .filter((row) => row.status === 'live_unit' && row.generator_blocked)
    .map((row) => ({
      unit_id: row.unit_id,
      generator: byId.get(row.unit_id).generator || `GEN_${row.unit_id}`,
      generator_status: row.generator_status,
      source: newBlockIds.has(row.unit_id) ? 'RX.2b' : 'prior_generator_block',
      student_facing_skilltree_use_allowed: false,
    }));
  coverage.backlog = [
    {
      item_id: 'other_chart_forms',
      status: 'missing_not_yet_scoped',
      next_action: 'Do not mint from abstract possibility. Add only if target exercises or exam evidence show scatterplots, stacked bars, or other chart forms requiring explicit representation-reading units.',
      proof_required_to_close: 'Evidence-backed row exists in a later representation-operation inventory or the item is explicitly closed as out of current course scope.',
    },
    {
      item_id: 'A71',
      status: 'held_high_risk',
      next_action: 'Run a later focused review for pie-chart percentage-change composition.',
      proof_required_to_close: 'Procedure and evidence show how to handle share versus absolute quantity, changing totals, percentage-point versus percentage change, and reconstruction before calculation.',
    },
  ];

  writeJson(COVERAGE_JSON, coverage);
  writeText(COVERAGE_MD, `# Graphical Foundation Coverage

Generated on: ${coverage.generated_on}  
Updated on: ${coverage.updated_on}

This report distinguishes live units, candidate units, held/high-risk units, missing but not-yet-scoped items, and generator-blocked units for the RX graphical foundation layer.

## Summary

- live units: ${coverage.summary.live_unit_count}
- candidate units: ${coverage.summary.candidate_unit_count}
- held/high-risk units: ${coverage.summary.held_high_risk_count}
- missing/not-yet-scoped items: ${coverage.summary.missing_not_yet_scoped_count}
- generator-blocked live units: ${coverage.summary.generator_blocked_live_count}

## Coverage Matrix

${toMarkdownTable(coverage.coverage_rows, [
    { label: 'Coverage ID', value: (row) => row.coverage_id },
    { label: 'Label', value: (row) => row.label },
    { label: 'Unit', value: (row) => row.unit_id || '' },
    { label: 'Status', value: (row) => row.status },
    { label: 'RX.2b role', value: (row) => row.rx2b_role },
    { label: 'Risk', value: (row) => row.risk || '' },
    { label: 'Evidence', value: (row) => row.evidence_status || '' },
    { label: 'Generator', value: (row) => row.generator_status },
  ])}

## Generator-Blocked Live Units

${toMarkdownTable(coverage.generator_blocked_units, [
    { label: 'Unit', value: (row) => row.unit_id },
    { label: 'Generator', value: (row) => row.generator },
    { label: 'Source', value: (row) => row.source },
    { label: 'Status', value: (row) => row.generator_status },
  ])}

## Backlog

${coverage.backlog.map((item) => `### ${item.item_id}\n\n- status: ${item.status}\n- next_action: ${item.next_action}\n- proof_required_to_close: ${item.proof_required_to_close}`).join('\n\n')}

## Interpretation

- RX.2b mutated only the approved graphical foundation lane through \`unit-add.js\`.
- \`A71\` remains held/high-risk for later focused review.
- Student-facing skill-tree exposure remains blocked until generators are implemented and validated in a later sprint.
`);
}

function writeMutationLogs(precheck, commands, candidateMap) {
  const unitsAdded = commands.filter((command) => command.status === 'passed').map((command) => command.unit_id);
  const log = {
    sprint_id: 'RX.2b',
    generated_on: new Date().toISOString(),
    status: commands.every((command) => command.status === 'passed') ? 'completed' : 'failed',
    decision_source: CLOSURE_JSON,
    execution_mode: 'CLI-only via build-scripts/references/unit-add.js',
    pre_execution_check: precheck,
    commands,
    applied: {
      units_added: unitsAdded,
      held_candidates: HELD_CANDIDATES,
      missing_not_yet_scoped_backlog_item: 'other_chart_forms',
    },
    generator_block: {
      tracked_in: BLOCK_PATH,
      status: 'active_block',
      units: AUTHORIZED_ORDER.map((id) => ({
        unit_id: id,
        generator: finalSpec(candidateMap.get(id)).generator,
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
  writeText(MUTATION_LOG_MD, `# RX.2b Mutation Log

Status: \`${log.status}\`  
Generated on: ${log.generated_on}  
Decision source: \`${CLOSURE_JSON}\`

## Pre-Execution Check

- Live A-domain max before mutation: \`${precheck.live_a_domain_max_id_before_mutation}\`
- Authorized IDs available: ${precheck.authorized_ids_available ? 'yes' : 'no'}
- Held candidates absent: ${precheck.held_candidates_absent ? 'yes' : 'no'}
- Dependency check: ${precheck.dependency_check}

## Commands

| Unit | Status | Command output |
|---|---|---|
${commands.map((command) => `| ${command.unit_id} | ${command.status} | ${command.stdout.replace(/\|/g, '\\|')} |`).join('\n')}

## Applied

- Units added: ${unitsAdded.map((id) => `\`${id}\``).join(', ')}
- Held candidates: ${HELD_CANDIDATES.map((id) => `\`${id}\``).join(', ')}
- Missing/not-yet-scoped backlog item: \`other_chart_forms\`

## Generator Block

Tracked in: \`${BLOCK_PATH}\`

All seven RX.2b units remain blocked for student-facing skill-tree use until generator implementation and validation.

## Blocked Scope

${BLOCKED_SCOPE.map((item) => `- ${item}`).join('\n')}
`);
}

function main() {
  const specs = readJson(SPECS_PATH);
  const candidateMap = specsById(specs);
  assert(
    JSON.stringify(specs.policy.approved_review_queue) === JSON.stringify(AUTHORIZED_ORDER),
    'candidate spec approved_review_queue does not match authorized order'
  );
  assert(
    JSON.stringify(specs.policy.conditional_queue) === JSON.stringify(HELD_CANDIDATES),
    'candidate spec conditional_queue does not match held candidates'
  );

  writeGateFiles();
  const precheck = validateLivePreconditions(candidateMap);

  const commands = [];
  for (const id of AUTHORIZED_ORDER) {
    const spec = finalSpec(candidateMap.get(id));
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
  refreshCoverageAfterMutation();
  writeMutationLogs(precheck, commands, candidateMap);
  console.log(`OK RX.2b gate closed and ${commands.length} graphical-foundation unit(s) applied through unit-add.js`);
}

if (require.main === module) main();
