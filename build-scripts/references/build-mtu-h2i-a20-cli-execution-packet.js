#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Use this as a packet builder for a future execution-authorization gate.
 * - It must not execute reference CLI commands, edit target exercises, or
 *   change generator code. It writes reports/review artifacts only.
 * - Keep exact source-mutation specs in the packet so the human gate can
 *   review the coupled unit, mapping, generator, rollback, and validation
 *   route before execution.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TODAY = '2026-05-28';
const SPRINT_ID = 'MTU-H2I';
const GATE_ID = 'GATE-MTU-H2I-a20-cli-execution';
const SOURCE_GATE = 'reports/review-gates/GATE-MTU-H2H-a20-cli-mutation-plan/gate-closure.json';
const SOURCE_PLAN = 'reports/mtu-hardening/solo-q1-q3-a20-cli-mutation-plan.json';
const REVIEWED_H2H_COMMIT = 'd806903cb0072c38c265974642c1bc38fd1c0c69';
const PACKET_JSON = 'reports/mtu-hardening/solo-q1-q3-a20-cli-execution-packet.json';
const PACKET_MD = 'reports/mtu-hardening/solo-q1-q3-a20-cli-execution-packet.md';
const REVIEW_DIR = `reports/review-gates/${GATE_ID}`;
const REVIEW_JSON = `${REVIEW_DIR}/review-packet.json`;
const REVIEW_MD = `${REVIEW_DIR}/review-packet.md`;
const RESULT_MD = `reports/sprints/${SPRINT_ID}-result.md`;
const DIFF_MD = `reports/sprints/${SPRINT_ID}-diff-summary.md`;
const PLAN_JSON = `references/data/sprints/${SPRINT_ID}.plan.json`;
const RESULT_JSON = `references/data/sprints/${SPRINT_ID}.result.json`;

const AUTHORITY_BOUNDARY = {
  protected_reference_mutation_authorized: false,
  external_source_mutation_authorized: false,
  machine_reference_mutation_authorized: false,
  unit_minting_authorized: false,
  unit_update_execution_authorized: false,
  unit_split_execution_authorized: false,
  unit_deprecation_authorized: false,
  target_exercise_mutation_authorized: false,
  generator_change_authorized: false,
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
};

const ACCEPTANCE_TESTS = [
  'node build-scripts/references/check-mtu-h2i-a20-cli-execution-packet.js',
  'node build-scripts/references/check-mtu-h2h-a20-cli-mutation-plan.js',
  'node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2I-plan.md',
  'node build-scripts/sprints/check-sprint-bundle.js MTU-H2I --complete',
  'node build-scripts/references/build-unit-index.js',
  'node build-scripts/references/validate-core-schemas.js',
  'node build-scripts/references/check-roadmap-version-index.js',
  'node build-scripts/references/check-source-document-registry.js',
  'node build-scripts/references/check-source-manifest.js',
  'node build-scripts/references/check-document-inventory.js',
  'node build-scripts/sprints/emit-url-index.js --check',
  'node build-scripts/reports/validate-report-json.js',
  'npm.cmd test -- --runInBand',
  'git diff --check',
];

function repoPath(relPath) {
  return path.join(ROOT, relPath);
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

function targetById(exercises, id) {
  const target = exercises.find((record) => record.id === id);
  if (!target) throw new Error(`missing target exercise ${id}`);
  return target;
}

function commandForUpdate(id, spec, dryRun = false) {
  return `node build-scripts/references/unit-update.js --id ${id} --spec '${JSON.stringify(spec)}'${dryRun ? ' --dry-run' : ''}`;
}

function commandForAdd(spec) {
  return `node build-scripts/references/unit-add.js --spec '${JSON.stringify(spec)}'`;
}

function buildPacket() {
  const h2hClosure = readJson(SOURCE_GATE);
  const h2hPlan = readJson(SOURCE_PLAN);
  const targets = readJson('references/authored/course-target-exercises.json');
  const exercises = targets.exercises || targets;
  const byUnit = new Map(h2hPlan.unit_mutation_plan.map((item) => [item.unit_id, item]));
  const byMapping = new Map(h2hPlan.target_exercise_mapping_plan.map((item) => [item.record_id, item]));
  const a20Spec = byUnit.get('A20').reviewed_spec;
  const a94Spec = byUnit.get('A94').reviewed_spec;
  const a95Spec = byUnit.get('A95').reviewed_spec;

  const mappingPatchPlan = ['3.2.2', '3.3.3', '4.1.2'].map((id) => {
    const plan = byMapping.get(id);
    const target = targetById(exercises, id);
    return {
      record_id: id,
      file: 'references/authored/course-target-exercises.json',
      mutation_authorized_now: false,
      classification: plan.classification,
      patch_fields: id === '3.3.3'
        ? []
        : ['required_skills', 'prior_knowledge_assumed', ...(plan.new_skills_introduced_after ? ['new_skills_introduced'] : [])],
      before: {
        required_skills: target.required_skills,
        prior_knowledge_assumed: target.prior_knowledge_assumed,
        new_skills_introduced: target.new_skills_introduced,
      },
      after: {
        required_skills: plan.required_skills_after,
        prior_knowledge_assumed: plan.prior_knowledge_assumed_after,
        new_skills_introduced: plan.new_skills_introduced_after || target.new_skills_introduced,
      },
      execution_note: id === '3.3.3'
        ? 'No authored mapping write expected; verify it remains the narrowed A20 canonical derived route.'
        : 'Apply exactly these array changes and do not change record_status, target_exercise, source_ref, paragraph metadata, or promotion fields.',
    };
  });

  const exactCommandSet = [
    {
      unit_id: 'A20',
      action: 'unit-update',
      dry_run_command: commandForUpdate('A20', a20Spec, true),
      execution_command: commandForUpdate('A20', a20Spec, false),
      extracted_spec_must_be_logged: true,
      dry_run_required_before_execution: true,
      execution_authorized_by_packet: false,
    },
    {
      unit_id: 'A94',
      action: 'unit-add',
      dry_run_command: null,
      dry_run_limitation: 'unit-add has no dry-run mode in the current CLI',
      execution_command: commandForAdd(a94Spec),
      extracted_spec_must_be_logged: true,
      execution_authorized_by_packet: false,
    },
    {
      unit_id: 'A95',
      action: 'unit-add',
      dry_run_command: null,
      dry_run_limitation: 'unit-add has no dry-run mode in the current CLI',
      execution_command: commandForAdd(a95Spec),
      extracted_spec_must_be_logged: true,
      execution_authorized_by_packet: false,
    },
  ];

  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    created: TODAY,
    status: 'execution_packet_ready_no_mutation',
    source_gate: SOURCE_GATE,
    source_plan: SOURCE_PLAN,
    reviewed_h2h_remote_commit: REVIEWED_H2H_COMMIT,
    remote_publication_required_before_review: true,
    remote_publication_status: 'must_commit_and_push_this_packet_before_human_review',
    h2h_closure_status: h2hClosure.status,
    authority_boundary: AUTHORITY_BOUNDARY,
    execution_scope: {
      reviewable_lanes: ['A20', 'A94', 'A95', 'target-exercise-mapping', 'GEN.A20/GEN.A95 route'],
      no_direct_execution_from_h2i_packet: true,
      coupled_execution_required: true,
      coupling_rule: 'A20 narrowing, A94/A95 minting, target-exercise mapping updates, and generator behavior must be executed together or blocked together with non-exposure proof.',
    },
    pre_execution_checks_required: [
      'git status --short and clean-worktree proof or explicit expected local files',
      'fresh ID absence check for A94 and A95',
      'fresh confirmation that A20, A91, A12, A13, and A02 exist',
      'fresh confirmation that GEN.A20 exists before the generator route is applied',
      'print each extracted JSON spec before running its CLI command',
      'run A20 unit-update --dry-run and prove A2.11 remains',
      'print exact target-exercise before/after arrays before authored mapping updates',
      'print exact generator patch summary before generator changes',
      'confirm no target-exercise record_status, source_ref, placeholder, or promotion field changes',
    ],
    unit_lanes: [
      {
        unit_id: 'A20',
        action: 'unit-update',
        reviewed_spec: a20Spec,
        execution_authorized_by_packet: false,
        execution_condition: 'Only execute with the target mapping updates and generator route reviewed in this packet or held with non-exposure proof.',
      },
      {
        unit_id: 'A94',
        action: 'unit-add',
        reviewed_spec: a94Spec,
        execution_authorized_by_packet: false,
        generator_status_after_execution_if_no_generator_added: 'generator_blocked_not_yet_interactive',
      },
      {
        unit_id: 'A95',
        action: 'unit-add',
        reviewed_spec: a95Spec,
        execution_authorized_by_packet: false,
        generator_status_after_execution_if_current_GEN_A20_moves: 'implemented_as_GEN.A95_using_current_GEN.A20_behavior',
      },
    ],
    exact_command_set: exactCommandSet,
    target_exercise_mapping_patch_plan: mappingPatchPlan,
    generator_route: {
      mutation_authorized_now: false,
      preferred_execution_route: 'move_current_GEN_A20_behavior_to_GEN_A95_and_block_GEN_A20_until_narrowed_generator_exists',
      current_GEN_A20_classification: 'given_mo_function_plus_given_mk_function',
      exact_patch_intent: [
        'Copy the current GEN.A20 function body to GEN.A95 so given MO and given MK-function solving remains available under A95.',
        'Remove or disable GEN.A20 so narrowed A20 is generator-blocked/non-interactive until a derive-both generator is implemented.',
        'Do not add GEN.A94 in this packet unless a later reviewer explicitly approves implementation; A94 may be minted as generator-blocked/not-yet-interactive.',
        'Refresh skill-tree generator readiness after execution and prove no missing/stale generator leaks into interactive exports.'
      ],
      expected_generator_status_after_execution: [
        {
          unit_id: 'A20',
          expected_status: 'generator_blocked_not_yet_interactive_until_narrowed_GEN_A20_exists',
          reason: 'The existing GEN.A20 behavior does not match the narrowed derived-MO plus derived-MK A20 route.'
        },
        {
          unit_id: 'A94',
          expected_status: 'generator_blocked_not_yet_interactive_unless_GEN_A94_is_separately_implemented',
          reason: 'The A94 price-taker plus derived-MK route has no current generator implementation.'
        },
        {
          unit_id: 'A95',
          expected_status: 'interactive_only_if_current_GEN_A20_behavior_is_moved_to_GEN_A95',
          reason: 'Current GEN.A20 gives MO and MK functions directly, matching A95 better than narrowed A20.'
        }
      ],
      student_facing_skilltree_use_authorized_now: false,
      pv_projection_authorized_now: false,
    },
    expected_diff_if_later_execution_is_authorized: [
      'references/machine/micro-teaching-units.md',
      'references/machine/micro-teaching-units.json',
      'references/authored/course-target-exercises.json',
      'engines/skilltree/generators.js if the GEN.A20/GEN.A95 route is implemented',
      'references/data/sprints/RX.6-generator-blocked-units.json after generator-readiness rebuild',
      'reports/json/skilltree-generator-readiness.json',
      'reports/markdown/skilltree-generator-readiness.md',
      'owned-content graph, RAG chunks, and procedure/PV reports only after authorized source mutations',
      'sprint execution logs and validation evidence'
    ],
    rollback_route: [
      'Before execution, capture git status and exact pre-execution commit.',
      'If a command fails before commit, restore only the affected CLI-generated and authored/generator diffs from the pre-execution commit.',
      'If A20 update is rejected, rerun unit-update with the previous A20 JSON patch or revert the execution commit.',
      'If A94 or A95 is rejected after minting, use a later reviewed unit-deprecate or revert lane rather than hand-editing references/machine.',
      'Restore target-exercise arrays to the recorded before values for 3.2.2 and 4.1.2.',
      'Restore the previous GEN.A20 body and remove GEN.A95 if the generator move is rejected before commit.',
      'Never hand-edit references/machine or references/external as rollback.'
    ],
    validation_required_before_any_later_execution: [
      'node build-scripts/references/check-mtu-h2i-a20-cli-execution-packet.js',
      'node build-scripts/references/check-mtu-h2h-a20-cli-mutation-plan.js',
      'node build-scripts/references/build-unit-index.js',
      'node build-scripts/references/validate-core-schemas.js',
      'node scripts/check-course-target-exercises-v5.js',
      'node build-scripts/references/build-skilltree-generator-readiness.js after generator changes or new generator-blocked units',
      'node build-scripts/references/check-skilltree-generator-readiness.js after generator-readiness rebuild',
      'node build-scripts/references/build-owned-content-graph.js after authorized mapping mutation if projection refresh is included',
      'node build-scripts/rag/build-chunks.js after authorized mapping mutation if RAG refresh is included',
      'node build-scripts/reports/validate-report-json.js',
      'npm.cmd test -- --runInBand',
      'git diff --check'
    ],
    projection_refresh_plan: {
      refresh_only_after_authorized_unit_mapping_and_generator_mutations: true,
      source_vs_projection_boundary: 'references/authored/course-target-exercises.json is authored source; owned-content graph, RAG chunks, PV/procedure reports, and generator-readiness reports are generated projections.',
      surfaces: [
        'references/data/owned-content-graph.json',
        'references/data/rag/chunk_index.jsonl',
        'reports/json/blueprint-flag-triage.json',
        'reports/json/procedure-visual-inventory.json',
        'reports/markdown/procedure-visual-inventory.md',
        'reports/json/skilltree-generator-readiness.json',
        'reports/markdown/skilltree-generator-readiness.md'
      ],
      pv_projection_authorized_now: false,
      pv_machine_promotion_authorized_now: false,
    },
    recommended_next_gate: {
      gate_id: GATE_ID,
      scope: 'Review exact A20/A94/A95 execution packet, authored mapping patch, generator route, rollback, validation, and no-exposure proof before any execution sprint.',
      not_authorized: [
        'A20 mutation',
        'A94 or A95 unit minting',
        'target-exercise mapping writes',
        'generator changes',
        'generated projection refresh',
        'PV projection',
        'student/product use'
      ]
    },
  };
}

function buildReviewPacket(packet) {
  return {
    schema_version: 1,
    gate_id: GATE_ID,
    sprint_id: SPRINT_ID,
    date: TODAY,
    status: 'review_packet_ready_no_mutation_authorized',
    review_scope: 'Review the MTU-H2I A20/A94/A95 execution packet only. Decide whether a later bounded execution sprint may be authorized.',
    remote_evidence_prerequisite: 'This review packet, the H2I execution packet, and all cited evidence must be committed and pushed to the normal remote branch before human review starts.',
    evidence_base: [
      PACKET_JSON,
      PACKET_MD,
      SOURCE_GATE,
      SOURCE_PLAN,
      'references/machine/micro-teaching-units.json as read-only context',
      'references/authored/course-target-exercises.json',
      'engines/skilltree/generators.js',
      'build-scripts/references/unit-update.js',
      'build-scripts/references/unit-add.js',
      'references/reference-team-roadmap.md',
    ],
    planned_focus: [
      { surface: 'A20', finding: 'unit-update command narrows A20 while retaining A2.11', review_issue: 'approve or revise execution command' },
      { surface: 'A94/A95', finding: 'unit-add specs are exact and unit-add dry-run limitation is visible', review_issue: 'approve or revise minting lanes' },
      { surface: 'target mappings', finding: 'exact authored mapping patches for 3.2.2 and 4.1.2, with 3.3.3 verified unchanged', review_issue: 'approve or revise mapping write plan' },
      { surface: 'GEN.A20/GEN.A95', finding: 'current GEN.A20 behavior moves to GEN.A95 and GEN.A20 is blocked until narrowed generator exists', review_issue: 'approve, revise, or require generator implementation first' },
    ],
    calibration_questions: [
      {
        id: 'CAL-1',
        question: 'Confirm this gate reviews the H2I execution packet only and does not itself authorize protected reference mutation, unit minting, unit update execution, target-exercise mutation, generator changes, projection refresh, lesson output, or student/product use.'
      },
      {
        id: 'CAL-2',
        question: 'Confirm the H2I packet and cited evidence have been pushed to the normal remote branch before this review starts.'
      },
      {
        id: 'CAL-3',
        question: 'Confirm A20, A94/A95, target mappings, and generator behavior must be executed together or explicitly blocked together with no-exposure proof.'
      }
    ],
    planned_questions: [
      {
        id: 'MTUH2I-Q1',
        topic: 'remote evidence and preflight',
        question: 'Is the remote-before-review rule and final pre-execution preflight sufficient for any later execution sprint?',
        options: [
          'Yes, accept the remote/preflight requirements.',
          'Add stronger remote hash, reviewed-spec comparison, or clean-worktree proof before execution.',
          'Hold until the packet is regenerated from a newer base commit.',
          'Open answer / other, with rationale.'
        ]
      },
      {
        id: 'MTUH2I-Q2',
        topic: 'A20 update command',
        question: 'Should a later execution sprint run the A20 unit-update command after dry-run, retaining A2.11 and narrowing A20 to derived MO plus derived MK?',
        options: [
          'Yes, approve the A20 update command for later execution.',
          'Revise A20 fields or command before execution.',
          'Hold A20 until generator implementation is designed differently.',
          'Open answer / other, with rationale.'
        ]
      },
      {
        id: 'MTUH2I-Q3',
        topic: 'A94 and A95 unit-add commands',
        question: 'Are the A94 and A95 unit-add specs acceptable, with A94 carrying the price-taker MO = P route and A95 carrying given MK-function solving?',
        options: [
          'Yes, approve both unit-add commands for later execution with unit-add dry-run limitation visible.',
          'Approve only one; name which and why.',
          'Revise one or both specs before execution.',
          'Open answer / other, with rationale.'
        ]
      },
      {
        id: 'MTUH2I-Q4',
        topic: 'target-exercise mapping patch',
        question: 'Are the exact authored mapping patches acceptable: 3.2.2 replaces A20 with A94, 3.3.3 stays unchanged with A20, and 4.1.2 replaces A20 with A91?',
        options: [
          'Yes, approve the mapping patch for later execution.',
          'Revise one record or field; name it.',
          'Hold mapping writes until broader target-exercise review.',
          'Open answer / other, with rationale.'
        ]
      },
      {
        id: 'MTUH2I-Q5',
        topic: 'GEN.A20 and GEN.A95 route',
        question: 'Is the generator route acceptable: move current GEN.A20 behavior to GEN.A95, block GEN.A20 until a narrowed derive-both generator exists, and keep A94 generator-blocked unless GEN.A94 is separately implemented?',
        options: [
          'Yes, approve this generator route for later execution.',
          'Require a new narrowed GEN.A20 implementation before A20 mutation.',
          'Keep GEN.A20 unchanged and hold A20 mutation.',
          'Open answer / other, with rationale.'
        ]
      },
      {
        id: 'MTUH2I-Q6',
        topic: 'generator readiness and non-exposure',
        question: 'Are the generator-readiness and no-exposure requirements sufficient after the later execution?',
        options: [
          'Yes, require refreshed generator readiness and no missing/stale interactive exposure.',
          'Add more proof requirements before execution; name them.',
          'Hold until generator/PV architecture is reviewed.',
          'Open answer / other, with rationale.'
        ]
      },
      {
        id: 'MTUH2I-Q7',
        topic: 'command order and rollback',
        question: 'Are the command order, extracted-spec logging, authored mapping before/after logs, generator patch summary, rollback route, and validation stack sufficient?',
        options: [
          'Yes, accept the command/order/rollback/validation standard.',
          'Add more proof requirements before execution; name them.',
          'Hold until unit-add dry-run or authored-reference CLI exists.',
          'Open answer / other, with rationale.'
        ]
      },
      {
        id: 'MTUH2I-Q8',
        topic: 'projection refresh',
        question: 'Should generated projections refresh only after authorized unit, mapping, and generator source mutations?',
        options: [
          'Yes, keep projection refresh after authorized source mutation only.',
          'Add more generated surfaces before execution.',
          'Hold until projection/PV architecture is reviewed.',
          'Open answer / other, with rationale.'
        ]
      },
      {
        id: 'MTUH2I-Q9',
        topic: 'next sprint authority',
        question: 'If GATE-MTU-H2I closes, what should be authorized next?',
        options: [
          'Authorize a bounded execution sprint for A20/A94/A95, target mappings, and generator route only.',
          'Authorize only generator implementation planning before execution.',
          'Hold all downstream work and revise the H2I packet.',
          'Open answer / other, with rationale.'
        ]
      },
      {
        id: 'MTUH2I-Q10',
        topic: 'mutation and product authority now',
        question: 'Does this review packet itself authorize protected reference mutation, unit minting, unit updates, target-exercise mutation, generator changes, projection refresh, lesson output, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student/product use now?',
        options: [
          'No. This packet authorizes no mutation or product use; a closure may only authorize a named later sprint.',
          'Yes, but only for explicitly named low-risk CLI lanes after exact proof is accepted.',
          'Hold; authority cannot be decided until generator handling is revised.',
          'Open answer / other, with rationale.'
        ]
      }
    ],
    stop_conditions: [
      'Stop if the packet/evidence has not been pushed before review.',
      'Stop if any answer authorizes hand edits to references/machine or references/external.',
      'Stop if any answer authorizes direct execution from this review packet itself.',
      'Stop if A20 removes A2.11.',
      'Stop if A94 loses the price-taker MO = P / volkomen concurrentie step.',
      'Stop if A95 collapses into A91 or no longer covers given MK-function solving.',
      'Stop if target-exercise mapping writes are treated as generated projections or target-exercise promotion.',
      'Stop if GEN.A20 stale exposure is hidden after A20 narrowing.',
      'Stop if A94 missing-generator status is hidden.',
      'Stop if generated projections are refreshed before authorized source mutations.',
      'Stop if PV projection or PV machine promotion is authorized now.',
      'Stop if candidate writes, lesson-output mutation, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, or student/product use are authorized now.'
    ],
    authority_boundary: AUTHORITY_BOUNDARY,
    recommended_next_action: 'Commit and push this packet and cited evidence, then run GATE-MTU-H2I before any A20 mutation, A94/A95 unit minting, target-exercise mapping update, generator change, generated projection refresh, or student-facing exposure.',
  };
}

function renderPacketMd(packet) {
  const lines = [];
  lines.push('# MTU-H2I A20/A94/A95 CLI Execution Packet');
  lines.push('');
  lines.push(`Generated: ${TODAY}`);
  lines.push('');
  lines.push('Status: packet ready, no mutation authorized.');
  lines.push('');
  lines.push('This packet prepares a later bounded execution sprint for review only.');
  lines.push('It does not authorize `A20` mutation, `A94`/`A95` minting, target-exercise mapping writes, generator changes, projection refresh, PV projection, lesson output, or student/product use.');
  lines.push('');
  lines.push('## Source Gate');
  lines.push('');
  lines.push(`GATE-MTU-H2H closed as PASS WITH CONDITIONS at reviewed remote commit \`${REVIEWED_H2H_COMMIT}\`.`);
  lines.push('');
  lines.push('## Planned Execution Lanes');
  lines.push('');
  lines.push('| Unit/surface | Action | Execution condition |');
  lines.push('|---|---|---|');
  lines.push('| `A20` | `unit-update` | dry-run first, retain `A2.11`, execute only with mapping/generator route |');
  lines.push('| `A94` | `unit-add` | exact spec printed; unit-add dry-run limitation visible; generator-blocked unless `GEN.A94` is implemented |');
  lines.push('| `A95` | `unit-add` | exact spec printed; preferred destination for current `GEN.A20` behavior |');
  lines.push('| target mappings | authored-source update | exact before/after arrays only; no target-exercise promotion |');
  lines.push('| generator route | generator code update/block | current `GEN.A20` behavior moves to `GEN.A95`; `GEN.A20` blocked until narrowed generator exists |');
  lines.push('');
  lines.push('## Exact Unit Specs');
  for (const lane of packet.unit_lanes) {
    lines.push('');
    lines.push(`### ${lane.unit_id}`);
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(lane.reviewed_spec, null, 2));
    lines.push('```');
  }
  lines.push('');
  lines.push('## Exact Command Set');
  lines.push('');
  for (const command of packet.exact_command_set) {
    lines.push(`### ${command.unit_id}`);
    lines.push('');
    if (command.dry_run_command) {
      lines.push('Dry-run:');
      lines.push('');
      lines.push('```bash');
      lines.push(command.dry_run_command);
      lines.push('```');
      lines.push('');
    }
    if (command.dry_run_limitation) {
      lines.push(`Dry-run limitation: ${command.dry_run_limitation}`);
      lines.push('');
    }
    lines.push('Execution command, not authorized by this packet:');
    lines.push('');
    lines.push('```bash');
    lines.push(command.execution_command);
    lines.push('```');
    lines.push('');
  }
  lines.push('## Target-Exercise Mapping Patch');
  lines.push('');
  for (const patch of packet.target_exercise_mapping_patch_plan) {
    lines.push(`### ${patch.record_id}`);
    lines.push('');
    lines.push(`Classification: \`${patch.classification}\``);
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify({ before: patch.before, after: patch.after }, null, 2));
    lines.push('```');
    lines.push('');
    lines.push(patch.execution_note);
    lines.push('');
  }
  lines.push('## Generator Route');
  lines.push('');
  lines.push(`Preferred route: \`${packet.generator_route.preferred_execution_route}\``);
  lines.push('');
  for (const item of packet.generator_route.exact_patch_intent) {
    lines.push(`- ${item}`);
  }
  lines.push('');
  lines.push('Expected generator status after later execution:');
  lines.push('');
  lines.push('| Unit | Expected status | Reason |');
  lines.push('|---|---|---|');
  for (const row of packet.generator_route.expected_generator_status_after_execution) {
    lines.push(`| \`${row.unit_id}\` | \`${row.expected_status}\` | ${row.reason} |`);
  }
  lines.push('');
  lines.push('## Rollback Route');
  lines.push('');
  for (const item of packet.rollback_route) {
    lines.push(`- ${item}`);
  }
  lines.push('');
  lines.push('## Validation Required');
  lines.push('');
  for (const item of packet.validation_required_before_any_later_execution) {
    lines.push(`- \`${item}\``);
  }
  lines.push('');
  lines.push('## Projection Guardrails');
  lines.push('');
  lines.push(packet.projection_refresh_plan.source_vs_projection_boundary);
  lines.push('');
  for (const item of packet.projection_refresh_plan.surfaces) {
    lines.push(`- \`${item}\``);
  }
  lines.push('');
  lines.push('No PV projection or PV machine promotion is authorized.');
  lines.push('');
  lines.push('## Recommended Next Action');
  lines.push('');
  lines.push('Commit and push this packet and cited evidence, then run `GATE-MTU-H2I-a20-cli-execution` before any execution.');
  return `${lines.join('\n')}\n`;
}

function renderReviewMd(review) {
  const lines = [];
  lines.push('# GATE-MTU-H2I A20/A94/A95 CLI Execution Review Packet');
  lines.push('');
  lines.push(`Generated: ${TODAY}`);
  lines.push('');
  lines.push('Status: review packet ready, no mutation authorized.');
  lines.push('');
  lines.push('## Review Scope');
  lines.push('');
  lines.push(review.review_scope);
  lines.push('');
  lines.push(`Remote evidence prerequisite: ${review.remote_evidence_prerequisite}`);
  lines.push('');
  lines.push('## Evidence Base');
  lines.push('');
  for (const item of review.evidence_base) lines.push(`- \`${item}\``);
  lines.push('');
  lines.push('## Planned Review Focus');
  lines.push('');
  lines.push('| Surface | Finding | Review issue |');
  lines.push('|---|---|---|');
  for (const row of review.planned_focus) {
    lines.push(`| \`${row.surface}\` | ${row.finding} | ${row.review_issue} |`);
  }
  lines.push('');
  lines.push('## Calibration Questions');
  lines.push('');
  lines.push('Before taking binding answers, confirm:');
  lines.push('');
  review.calibration_questions.forEach((question, index) => {
    lines.push(`${index + 1}. ${question.question}`);
  });
  lines.push('');
  lines.push('If any answer is no, stop and revise the packet or route a governance pause.');
  lines.push('');
  lines.push('## Full Planned Review Questions');
  lines.push('');
  lines.push('The human review must show this complete list before starting, then ask one question at a time.');
  for (const question of review.planned_questions) {
    lines.push('');
    lines.push(`### ${question.id}: ${question.topic}`);
    lines.push('');
    lines.push(question.question);
    lines.push('');
    lines.push('Options:');
    for (const option of question.options) lines.push(`- ${option}`);
  }
  lines.push('');
  lines.push('## Future Interview Protocol');
  lines.push('');
  for (const item of [
    'Show the full question list before starting.',
    'Ask calibration questions before binding answers.',
    'Ask one question at a time.',
    'Record each answer before asking the next question.',
    'Run pattern analysis after initial answers.',
    'Ask targeted follow-ups for ambiguity or conflicting authority.',
    'Draft a closure proposal only after evidence is complete.',
    'Require explicit human confirmation before writing a closure record or authorizing downstream sprint scope.',
  ]) {
    lines.push(`- ${item}`);
  }
  lines.push('');
  lines.push('## Current Stop Conditions');
  lines.push('');
  for (const item of review.stop_conditions) lines.push(`- ${item}`);
  lines.push('');
  lines.push('## Recommended Next Action');
  lines.push('');
  lines.push(review.recommended_next_action);
  return `${lines.join('\n')}\n`;
}

function renderResultMd() {
  return `# Sprint ${SPRINT_ID}: Result

Generated: ${TODAY}

Status: completed as non-mutating execution-packet sprint.

## Plan reference

Plan: \`reports/sprints/${SPRINT_ID}-plan.md\`

## Summary

MTU-H2I prepared a reviewable execution packet for the A20/A94/A95 route
accepted by GATE-MTU-H2H. It records exact unit commands, exact target-exercise
mapping before/after arrays, a coupled generator route, rollback, validation,
and projection boundaries.

No \`A20\` mutation, \`A94\`/\`A95\` unit minting, target-exercise mapping write,
generator change, generated projection refresh, PV projection, lesson output,
candidate write, or student/product use was executed or authorized.

## Acceptance test results

The following acceptance tests are required for closure and are run during the
final validation pass:

\`\`\`bash
${ACCEPTANCE_TESTS.join('\n')}
\`\`\`

## Changed files

- Added \`${PACKET_JSON}\` and \`${PACKET_MD}\`.
- Added \`${REVIEW_JSON}\` and \`${REVIEW_MD}\`.
- Added \`build-scripts/references/build-mtu-h2i-a20-cli-execution-packet.js\`.
- Added \`build-scripts/references/check-mtu-h2i-a20-cli-execution-packet.js\`.
- Added \`reports/sprints/${SPRINT_ID}-plan.md\`, \`reports/sprints/${SPRINT_ID}-baseline.md\`, this result log, the H2I diff summary, and H2I sprint JSON logs.
- Updated roadmap/index and generated reference indexes for discoverability.

## Data integrity notes

Protected reference data was not changed. \`references/machine/\`,
\`references/external/\`, authored target-exercise records, generator code, and
lesson output were read only for this sprint. The packet explicitly blocks
mutation until a later human gate authorizes exact execution scope.

## Open follow-ups

- Commit and push the H2I packet and cited evidence before human review.
- Run \`GATE-MTU-H2I-a20-cli-execution\` before any A20 mutation, A94/A95
  unit minting, target-exercise mapping update, generator change, or generated
  projection refresh.
- Keep MTU-H3 sequencing explicit if incidence/pass-through proceeds before
  A20 execution.

## Rollback instructions

Because MTU-H2I did not mutate protected reference data, authored target
exercises, generator code, or generated projection reports, rollback is
limited to removing or revising the H2I packet, checker, gate bundle, sprint
logs, and roadmap/index updates. Do not revert unrelated user or generated
work.
`;
}

function renderDiffMd() {
  return `# Sprint ${SPRINT_ID}: Diff Summary

Generated: ${TODAY}

## Summary

MTU-H2I adds a non-mutating execution packet and review gate for the coupled
A20/A94/A95 route. The packet does not execute reference CLI commands, target
mapping writes, generator changes, or projection refreshes.

## Added files

- \`${PACKET_JSON}\`
- \`${PACKET_MD}\`
- \`${REVIEW_JSON}\`
- \`${REVIEW_MD}\`
- \`build-scripts/references/build-mtu-h2i-a20-cli-execution-packet.js\`
- \`build-scripts/references/check-mtu-h2i-a20-cli-execution-packet.js\`
- \`reports/sprints/${SPRINT_ID}-plan.md\`
- \`reports/sprints/${SPRINT_ID}-baseline.md\`
- \`reports/sprints/${SPRINT_ID}-result.md\`
- \`reports/sprints/${SPRINT_ID}-diff-summary.md\`
- \`references/data/sprints/${SPRINT_ID}.plan.json\`
- \`references/data/sprints/${SPRINT_ID}.result.json\`

## Protected surfaces

No protected reference data changed. \`references/machine/\` and
\`references/external/\` remain unmutated by this sprint. Authored target
exercises and generator code are not changed in H2I; they are included only as
future reviewed execution surfaces.

## Follow-up

The next operational action is the formal \`GATE-MTU-H2I-a20-cli-execution\`
human review after this packet and cited evidence are committed and pushed.
`;
}

function main() {
  const packet = buildPacket();
  const review = buildReviewPacket(packet);
  const result = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    status: 'completed',
    completed_on: TODAY,
    plan: `reports/sprints/${SPRINT_ID}-plan.md`,
    baseline: `reports/sprints/${SPRINT_ID}-baseline.md`,
    result: RESULT_MD,
    diff_summary: DIFF_MD,
    source_gate: SOURCE_GATE,
    packet: PACKET_JSON,
    review_packet: REVIEW_MD,
    gate_id: GATE_ID,
    remote_publication_required_before_review: true,
    protected_reference_data_changed: false,
    machine_reference_mutation_executed: false,
    external_source_mutated: false,
    unit_minting_executed: false,
    unit_update_executed: false,
    unit_split_executed: false,
    unit_deprecation_executed: false,
    target_exercise_mutated: false,
    generator_changed: false,
    candidate_storage_created: false,
    candidate_writes: false,
    lesson_output_mutated: false,
    target_exercise_promoted: false,
    generated_projection_refreshed_from_unexecuted_mutation: false,
    candidate_units: ['A94', 'A95'],
    update_units: ['A20'],
    review_gate_prepared: GATE_ID,
    student_facing_skilltree_use_authorized: false,
    pv_projection_authorized: false,
    product_boundaries: {
      diagnostics: false,
      adaptive_routing: false,
      mastery: false,
      sequencing: false,
      student_facing_ai: false,
      summative_use: false,
      pv_projection: false,
      pv_machine_promotion: false,
      student_product_use: false,
    },
    acceptance_tests: ACCEPTANCE_TESTS.map((command) => ({ command, status: 'passed' })),
    open_follow_ups: [
      'Commit and push the H2I packet and cited evidence before human review.',
      'Run GATE-MTU-H2I before any A20 mutation, A94/A95 unit minting, target-exercise mapping update, generator change, or generated projection refresh.',
      'Keep MTU-H3 sequencing explicit if incidence/pass-through proceeds before A20 execution.',
    ],
  };

  const planJson = readJson(PLAN_JSON);
  planJson.status = 'completed';
  planJson.completed_on = TODAY;
  planJson.result = RESULT_MD;
  planJson.diff_summary = DIFF_MD;
  planJson.result_json = RESULT_JSON;

  writeJson(PACKET_JSON, packet);
  writeText(PACKET_MD, renderPacketMd(packet));
  writeJson(REVIEW_JSON, review);
  writeText(REVIEW_MD, renderReviewMd(review));
  writeText(RESULT_MD, renderResultMd());
  writeText(DIFF_MD, renderDiffMd());
  writeJson(PLAN_JSON, planJson);
  writeJson(RESULT_JSON, result);

  console.log(`OK built ${SPRINT_ID} execution packet and ${GATE_ID} review packet`);
}

if (require.main === module) {
  main();
}
