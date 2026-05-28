#!/usr/bin/env node
/**
 * Build the MTU-H2E conditional-lane execution packet and review packet.
 *
 * HOW TO ADAPT:
 * - Keep this script non-mutating with respect to references/machine and
 *   references/external.
 * - Change LANE_ORDER only when a prior human gate changes the reviewed lane
 *   sequence.
 * - Update GATE_ID and artifact paths if a later packet forks this pattern.
 * - Do not put live CLI execution in this script; it writes planning/review
 *   artifacts only.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SPRINT_ID = 'MTU-H2E';
const GATE_ID = 'GATE-MTU-H2E-conditional-lane-execution';
const DATE = '2026-05-28';
const H2D_REMOTE_COMMIT = '63c2e53731af3941d49183628f4ba5927f8ac551';
const RESOLUTION_PATH = 'reports/mtu-hardening/solo-q1-q3-held-conditional-resolution.json';
const H2D_CLOSURE_PATH = 'reports/review-gates/GATE-MTU-H2D-held-conditional-lanes/gate-closure.json';
const PACKET_JSON_PATH = 'reports/mtu-hardening/solo-q1-q3-conditional-lane-execution-packet.json';
const PACKET_MD_PATH = 'reports/mtu-hardening/solo-q1-q3-conditional-lane-execution-packet.md';
const REVIEW_DIR = `reports/review-gates/${GATE_ID}`;
const REVIEW_JSON_PATH = `${REVIEW_DIR}/review-packet.json`;
const REVIEW_MD_PATH = `${REVIEW_DIR}/review-packet.md`;

const LANE_ORDER = ['A12', 'A88', 'A89', 'A90', 'A92', 'A93'];
const HELD_OUT_OF_SCOPE = ['A20'];
const GENERATOR_BLOCKED_LANES = ['A88', 'A89', 'A90', 'A92', 'A93'];

function repoPath(rel) {
  return path.join(ROOT, rel);
}

function readJson(rel) {
  return JSON.parse(fs.readFileSync(repoPath(rel), 'utf8'));
}

function writeJson(rel, data) {
  const full = repoPath(rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(rel, text) {
  const full = repoPath(rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text.replace(/\s+$/u, '') + '\n');
}

function compactJson(value) {
  return JSON.stringify(value);
}

function commandForLane(lane) {
  if (lane.unit_id === 'A12') {
    const spec = lane.revised_update_spec;
    return {
      unit_id: 'A12',
      action: 'unit-update',
      dry_run_command: `node build-scripts/references/unit-update.js --id A12 --spec '${compactJson(spec)}' --dry-run`,
      execution_command: `node build-scripts/references/unit-update.js --id A12 --spec '${compactJson(spec)}'`,
      extracted_spec_must_be_logged: true,
      execution_authorized_by_packet: false,
    };
  }
  const spec = lane.revised_spec;
  return {
    unit_id: lane.unit_id,
    action: 'unit-add',
    dry_run_command: null,
    dry_run_limitation: 'unit-add has no dry-run mode in the current CLI',
    execution_command: `node build-scripts/references/unit-add.js --spec '${compactJson(spec)}'`,
    extracted_spec_must_be_logged: true,
    execution_authorized_by_packet: false,
  };
}

function laneSummary(lane) {
  const spec = lane.revised_update_spec || lane.revised_spec;
  return {
    unit_id: lane.unit_id,
    action: lane.unit_id === 'A12' ? 'unit-update' : 'unit-add',
    name: spec.name,
    needs: spec.needs,
    exam_codes: spec.exam_codes,
    mastery_target: spec.mastery_target,
    prior_learning: spec.prior_learning,
    aspects: spec.aspects,
    terms: spec.terms,
    generator: spec.generator,
    zero_needs_status: spec.zero_needs_status || null,
    generator_handling: lane.unit_id === 'A12'
      ? 'existing GEN.A12 implementation requires impact review; no new generator work in H2E'
      : 'planned generator-blocked/not-yet-interactive until GEN implementation and later exposure approval',
    route_condition: lane.reason,
  };
}

function markdownTable(rows, columns) {
  const header = `| ${columns.map((column) => column.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${columns.map((column) => {
    const value = column.value(row);
    return String(value === undefined || value === null ? '' : value).replace(/\|/g, '\\|');
  }).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function build() {
  const resolution = readJson(RESOLUTION_PATH);
  const h2dClosure = readJson(H2D_CLOSURE_PATH);
  const laneById = new Map(resolution.lane_dispositions.map((lane) => [lane.unit_id, lane]));
  const lanes = LANE_ORDER.map((id) => laneById.get(id));
  if (lanes.some((lane) => !lane)) {
    throw new Error('missing one or more H2E lanes in H2D resolution');
  }

  const commands = lanes.map(commandForLane);
  const packet = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    created: DATE,
    status: 'execution_packet_ready_no_mutation',
    source_gate: H2D_CLOSURE_PATH,
    source_resolution: RESOLUTION_PATH,
    h2d_remote_evidence_commit: H2D_REMOTE_COMMIT,
    remote_publication_required_before_review: true,
    remote_publication_status: 'must_commit_and_push_this_packet_before_human_review',
    authority_boundary: {
      protected_reference_mutation_authorized: false,
      external_source_mutation_authorized: false,
      machine_reference_mutation_authorized: false,
      unit_minting_authorized: false,
      unit_update_execution_authorized: false,
      unit_split_execution_authorized: false,
      candidate_storage_creation_authorized: false,
      candidate_writes_authorized: false,
      lesson_output_mutation_authorized: false,
      target_exercise_promotion_authorized: false,
      cp6_closure_authorized: false,
      year1_closure_authorized: false,
      diagnostics_authorized: false,
      adaptive_routing_authorized: false,
      mastery_authorized: false,
      sequencing_authorized: false,
      student_facing_ai_authorized: false,
      summative_use_authorized: false,
      pv_projection_authorized: false,
      pv_machine_promotion_authorized: false,
      student_product_use_authorized: false,
    },
    execution_scope: {
      reviewable_lanes: LANE_ORDER,
      held_out_of_scope: HELD_OUT_OF_SCOPE,
      a20_condition: 'A20 remains held for a separate split/deprecate/replacement and affected-mapping packet because target exercise 4.1.2 uses current A20 in a given-MK context.',
      no_direct_execution_from_h2e_packet: true,
    },
    pre_execution_checks_required: [
      'git status --short',
      'fresh ID absence check for A88, A89, A90, A92, and A93',
      'fresh confirmation that A12 and A20 exist',
      'print each extracted JSON spec before running its CLI command',
      'run A12 unit-update --dry-run and prove A2.11 remains',
      'confirm A20 command is absent from the execution set',
      'confirm review packet and cited evidence were pushed before review',
    ],
    lane_summaries: lanes.map(laneSummary),
    exact_command_set: commands,
    post_execution_commands_required_if_later_gate_authorizes_execution: [
      'node build-scripts/references/build-unit-index.js',
      'node build-scripts/references/validate-core-schemas.js',
      'node build-scripts/references/build-skilltree-generator-readiness.js',
      'node build-scripts/references/check-skilltree-generator-readiness.js',
      'node build-scripts/references/check-mtu-h2e-conditional-lane-execution-packet.js',
      'git diff --check',
    ],
    generator_handling_decision: {
      existing_implemented_generators: [
        {
          registry_generator: 'GEN_A12',
          skilltree_key: 'GEN.A12',
          condition: 'A12 wording/semantic change requires impact review; H2E does not edit generator code.',
        },
        {
          registry_generator: 'GEN_A20',
          skilltree_key: 'GEN.A20',
          condition: 'A20 remains out of scope; any later A20 split must review generator behavior.',
        },
      ],
      proposed_missing_generators: GENERATOR_BLOCKED_LANES.map((id) => ({
        unit_id: id,
        registry_generator: `GEN_${id}`,
        skilltree_key: `GEN.${id}`,
        implementation_present_now: false,
        h2e_decision: 'generator_blocked_not_yet_interactive_if_minted_later',
        student_facing_skilltree_use_allowed: false,
        pv_projection_allowed: false,
      })),
      execution_condition: 'If a later gate authorizes unit-add for A88/A89/A90/A92/A93 without implementing generators, the execution sprint must refresh the skill-tree generator readiness block record so the new live units are explicit generator-blocked/non-interactive rows.',
    },
    expected_diff_if_later_execution_is_authorized: [
      'references/machine/micro-teaching-units.md',
      'references/machine/micro-teaching-units.json',
      'references/data/sprints/RX.6-generator-blocked-units.json, if generator-blocked status is used for new A-units',
      'reports/json/skilltree-generator-readiness.json and reports/markdown/skilltree-generator-readiness.md, if generator readiness is rebuilt',
      'sprint execution logs and validation evidence',
    ],
    rollback_route: [
      'Before execution, capture git status and exact pre-execution commit.',
      'If a command fails before commit, restore only the affected CLI-generated diffs from the pre-execution commit.',
      'If A12 update is rejected, rerun unit-update with the previous A12 JSON patch or revert the execution commit.',
      'If any new A-unit is rejected after minting, use a later reviewed unit-deprecate/revert lane rather than hand-editing references/machine.',
      'Never hand-edit references/machine or references/external as rollback.',
    ],
    validation_required_before_any_later_execution: [
      'node build-scripts/references/check-mtu-h2e-conditional-lane-execution-packet.js',
      'node build-scripts/references/check-mtu-h2d-held-conditional-resolution.js',
      'node build-scripts/sprints/check-sprint-bundle.js MTU-H2E --complete',
      'node build-scripts/references/build-unit-index.js',
      'node build-scripts/references/validate-core-schemas.js',
      'node build-scripts/references/check-skilltree-generator-readiness.js after generator-readiness rebuild if new generator-blocked units are minted',
      'node build-scripts/reports/validate-report-json.js',
      'npm.cmd test -- --runInBand',
      'git diff --check',
    ],
    not_authorized: [
      'A20 execution',
      'hand edits to references/machine or references/external',
      'unit minting from this packet alone',
      'unit update execution from this packet alone',
      'candidate storage or writes',
      'lesson output mutation',
      'target-exercise promotion',
      'student/product use',
    ],
  };

  const reviewPacket = {
    schema_version: 1,
    gate_id: GATE_ID,
    sprint_id: SPRINT_ID,
    date: DATE,
    status: 'review_packet_ready_no_mutation_authorized',
    review_scope: 'Review the MTU-H2E conditional-lane execution packet only. Decide whether a later bounded CLI execution sprint may be authorized for A12/A88/A89/A90/A92/A93 with A20 held.',
    remote_evidence_prerequisite: 'This review packet, the execution packet, and all cited evidence must be committed and pushed to the normal remote branch before human review starts.',
    evidence_base: [
      PACKET_JSON_PATH,
      PACKET_MD_PATH,
      H2D_CLOSURE_PATH,
      RESOLUTION_PATH,
      'references/machine/micro-teaching-units.json as read-only context',
      'engines/skilltree/generators.js',
      'build-scripts/references/unit-add.js',
      'build-scripts/references/unit-update.js',
      'references/reference-team-roadmap.md',
    ],
    calibration_questions: [
      {
        id: 'CAL-1',
        question: 'Confirm this gate reviews the H2E execution packet only and does not itself authorize protected reference mutation, unit minting, unit update execution, lesson output, or student/product use.',
      },
      {
        id: 'CAL-2',
        question: 'Confirm the H2E packet and cited evidence have been pushed to the normal remote branch before this review starts.',
      },
      {
        id: 'CAL-3',
        question: 'Confirm A20 remains out of scope and must stay held unless a separate split/deprecate/replacement packet handles affected mappings and generator behavior.',
      },
    ],
    planned_questions: [
      {
        id: 'MTUH2E-Q1',
        topic: 'remote evidence and preflight',
        question: 'Is the remote-before-review evidence rule and final pre-execution preflight sufficient for any later execution sprint?',
        options: [
          'Yes, accept the remote/preflight requirements.',
          'Add stronger remote hash or clean-worktree proof before execution.',
          'Hold until the packet is regenerated from a newer base commit.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH2E-Q2',
        topic: 'A12 update route',
        question: 'Should the later execution lane update A12 to the derivative-MO wording while retaining A2.11 and using existing GEN_A12 with impact review?',
        options: [
          'Yes, approve the A12 update route for later execution.',
          'Keep A12 unchanged and execute only new-unit lanes.',
          'Revise A12 wording or exam codes before execution.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH2E-Q3',
        topic: 'A88 and A89 zero-needs',
        question: 'Are A88 scale-factor handling and A89 GO-as-price recognition acceptable as zero-needs units with explicit zero-needs rationale?',
        options: [
          'Yes, approve both zero-needs routes for later execution.',
          'Approve only one; name which and why.',
          'Hold zero-needs additions until a broader root-unit review.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH2E-Q4',
        topic: 'A90 linear GO rule',
        question: 'Is A90 correctly narrowed to MO from a linear GO rule without derivatives, with table/graph variants deferred?',
        options: [
          'Yes, approve the narrowed A90 route.',
          'Revise A90 before execution.',
          'Hold A90 until a broader monopoly sequencing review.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH2E-Q5',
        topic: 'A92 and A93 dependency route',
        question: 'Should A92 depend on A89, and should A93 depend on A38 and A92 only while broader incidence remains MTU-H3?',
        options: [
          'Yes, approve A92/A93 as planned.',
          'Revise one dependency; name which.',
          'Hold A92/A93 until A89 or MTU-H3 is complete.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH2E-Q6',
        topic: 'generator-blocked handling',
        question: 'Is it acceptable to mint A88/A89/A90/A92/A93 later as generator-blocked/not-yet-interactive units, with generator-readiness refresh and no student-facing exposure?',
        options: [
          'Yes, accept generator-blocked/non-interactive handling for later execution.',
          'Require generator implementation before unit minting.',
          'Require proof of non-exposure instead of generator-blocked tracking.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH2E-Q7',
        topic: 'command set and rollback',
        question: 'Are the exact commands, command order, extracted-spec logging, rollback route, and validation requirements sufficient?',
        options: [
          'Yes, accept the command/rollback/validation standard.',
          'Add more proof requirements before execution.',
          'Hold until unit-add dry-run exists.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH2E-Q8',
        topic: 'A20 held lane',
        question: 'Should A20 remain held outside this execution packet and require a separate affected-mapping and generator-review packet?',
        options: [
          'Yes, keep A20 held and separate.',
          'Allow A20 only in a packet that updates affected mappings and generator evidence.',
          'Hold all q3 MO work until A20 is resolved.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH2E-Q9',
        topic: 'next sprint authority',
        question: 'If GATE-MTU-H2E closes, what should be authorized next?',
        options: [
          'Authorize a bounded CLI execution sprint for A12/A88/A89/A90/A92/A93 only, with A20 held.',
          'Authorize only generator implementation planning before CLI execution.',
          'Hold all downstream work and revise the packet.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH2E-Q10',
        topic: 'mutation and product authority now',
        question: 'Does this review packet itself authorize protected reference mutation, unit minting, unit updates, lesson output, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student/product use now?',
        options: [
          'No. This packet authorizes no mutation or product use; a closure may only authorize a named later sprint.',
          'Yes, but only for explicitly named low-risk CLI lanes after exact proof is accepted.',
          'Hold; authority cannot be decided until generator handling is revised.',
          'Open answer / other, with rationale.',
        ],
      },
    ],
    stop_conditions: [
      'Stop if the packet/evidence has not been pushed before review.',
      'Stop if any answer authorizes hand edits to references/machine or references/external.',
      'Stop if any answer authorizes A20 execution from this gate.',
      'Stop if A12 removes A2.11.',
      'Stop if A88 or A89 zero-needs rationale is removed.',
      'Stop if A90 becomes a broad table/graph/rule unit again.',
      'Stop if A93 reintroduces A66 or hides the MTU-H3 incidence boundary.',
      'Stop if generator absence for A88/A89/A90/A92/A93 is hidden.',
      'Stop if unit-add dry-run limitations are hidden.',
      'Stop if candidate writes, lesson-output mutation, target-exercise promotion, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student/product use are authorized now.',
    ],
    authority_boundary: packet.authority_boundary,
    recommended_next_action: 'Commit and push this packet and cited evidence, then run the formal GATE-MTU-H2E human review before any CLI execution.',
  };

  writeJson(PACKET_JSON_PATH, packet);
  writeJson(REVIEW_JSON_PATH, reviewPacket);
  writeText(PACKET_MD_PATH, renderPacketMarkdown(packet, h2dClosure));
  writeText(REVIEW_MD_PATH, renderReviewMarkdown(reviewPacket, packet));
}

function renderPacketMarkdown(packet, h2dClosure) {
  const laneRows = packet.lane_summaries;
  const commandRows = packet.exact_command_set;
  return `# MTU-H2E Solo q1-q3 Conditional Lane Execution Packet

Generated: ${DATE}

Status: execution packet ready, no mutation authorized.

Source gate: \`${h2dClosure.gate_id}\` closed as \`${h2dClosure.status}\`.

Remote publication requirement: this packet and all cited evidence must be
committed and pushed before human review starts.

## Scope

This packet prepares a later reviewable CLI execution set for \`${LANE_ORDER.join('`, `')}\`.
\`A20\` is held out of scope for a separate split/deprecate/replacement and
affected-mapping packet.

No protected reference mutation, external-source mutation, machine-reference
mutation, unit minting, unit update execution, unit split execution, candidate
writes, lesson-output mutation, target-exercise promotion, CP-6/Year-1 closure,
diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, or student/product use is
authorized by this packet.

## Lane Summary

${markdownTable(laneRows, [
    { label: 'Unit', value: (row) => `\`${row.unit_id}\`` },
    { label: 'Action', value: (row) => `\`${row.action}\`` },
    { label: 'Name', value: (row) => row.name },
    { label: 'Needs', value: (row) => row.needs.length ? row.needs.map((id) => `\`${id}\``).join(', ') : 'none' },
    { label: 'Generator handling', value: (row) => row.generator_handling },
  ])}

## Exact Command Set

These commands are for later review only. They are not authorized by MTU-H2E.

${markdownTable(commandRows, [
    { label: 'Unit', value: (row) => `\`${row.unit_id}\`` },
    { label: 'Action', value: (row) => `\`${row.action}\`` },
    { label: 'Dry-run', value: (row) => row.dry_run_command ? `\`${row.dry_run_command}\`` : row.dry_run_limitation },
    { label: 'Execution command', value: (row) => `\`${row.execution_command}\`` },
  ])}

## Generator Handling

- \`GEN_A12\` exists as \`GEN.A12\`; the later execution gate must review impact
  if A12 wording or semantics changes.
- \`GEN_A20\` exists as \`GEN.A20\`, but \`A20\` remains held outside this packet.
- \`GEN_A88\`, \`GEN_A89\`, \`GEN_A90\`, \`GEN_A92\`, and \`GEN_A93\` are not
  implemented. If their units are minted later without generator work, they
  must be generator-blocked/not-yet-interactive and the skill-tree generator
  readiness block record must be refreshed.

## Required Preflight

${packet.pre_execution_checks_required.map((item) => `- ${item}`).join('\n')}

## Required Post-Execution Validation If A Later Gate Authorizes Execution

${packet.post_execution_commands_required_if_later_gate_authorizes_execution.map((item) => `- \`${item}\``).join('\n')}

## Rollback Route

${packet.rollback_route.map((item) => `- ${item}`).join('\n')}

## Not Authorized

${packet.not_authorized.map((item) => `- ${item}`).join('\n')}

## Recommended Next Action

Commit and push this packet and evidence, then run \`${GATE_ID}\` as a formal
human review before any CLI execution.`;
}

function renderReviewMarkdown(reviewPacket, packet) {
  return `# GATE-MTU-H2E Conditional Lane Execution Review Packet

Generated: ${DATE}

Status: review packet ready, no mutation authorized.

## Review Scope

${reviewPacket.review_scope}

Remote evidence prerequisite: ${reviewPacket.remote_evidence_prerequisite}

## Evidence Base

${reviewPacket.evidence_base.map((item) => `- \`${item}\``).join('\n')}

## Planned Execution Lanes

${markdownTable(packet.lane_summaries, [
    { label: 'Unit', value: (row) => `\`${row.unit_id}\`` },
    { label: 'Action', value: (row) => `\`${row.action}\`` },
    { label: 'Needs', value: (row) => row.needs.length ? row.needs.map((id) => `\`${id}\``).join(', ') : 'none' },
    { label: 'Exam codes', value: (row) => row.exam_codes.map((id) => `\`${id}\``).join(', ') },
    { label: 'Generator', value: (row) => `\`${row.generator}\`` },
  ])}

Held lane: \`A20\` remains outside this gate.

## Calibration Questions

Before taking binding answers, confirm:

${reviewPacket.calibration_questions.map((item, index) => `${index + 1}. ${item.question}`).join('\n')}

If any answer is no, stop and revise the packet or route a governance pause.

## Full Planned Review Questions

The human review must show this complete list before starting, then ask one
question at a time.

${reviewPacket.planned_questions.map((item) => `### ${item.id}: ${item.topic}

${item.question}

Options:
${item.options.map((option) => `- ${option}`).join('\n')}`).join('\n\n')}

## Future Interview Protocol

- Show the full question list before starting.
- Ask calibration questions before binding answers.
- Ask one question at a time.
- Record each answer before asking the next question.
- Run pattern analysis after initial answers.
- Ask targeted follow-ups for ambiguity or conflicting authority.
- Draft a closure proposal only after evidence is complete.
- Require explicit human confirmation before writing a closure record or
  authorizing downstream sprint scope.

## Current Stop Conditions

${reviewPacket.stop_conditions.map((item) => `- ${item}`).join('\n')}

## Recommended Next Action

${reviewPacket.recommended_next_action}`;
}

if (require.main === module) {
  build();
  console.log(`Wrote ${PACKET_JSON_PATH}`);
  console.log(`Wrote ${PACKET_MD_PATH}`);
  console.log(`Wrote ${REVIEW_JSON_PATH}`);
  console.log(`Wrote ${REVIEW_MD_PATH}`);
}
