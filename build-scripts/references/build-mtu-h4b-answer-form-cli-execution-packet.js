#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep this builder non-mutating with respect to protected references. It
 *   may write sprint reports and review packets only.
 * - It turns a closed H4A planning decision into an exact execution-packet
 *   proposal for later human review.
 * - Do not execute the generated unit-add commands from this script.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { validateSpec } = require('./unit-add');
const { validate, loadTerminology, loadEindtermen } = require('./build-unit-index');

const ROOT = path.resolve(__dirname, '..', '..');
const TODAY = '2026-05-30';
const SPRINT_ID = 'MTU-H4B';
const GATE_ID = 'GATE-MTU-H4B-answer-form-cli-execution';

const H4A_CLOSURE_PATH = 'reports/review-gates/GATE-MTU-H4A-answer-form-cli-mutation-plan/gate-closure.json';
const H4A_PACKET_PATH = 'reports/mtu-hardening/mtu-h4a-answer-form-cli-mutation-plan.json';
const H4_CLOSURE_PATH = 'reports/review-gates/GATE-MTU-H4-answer-form-question-type-routing/gate-closure.json';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const TARGETS_PATH = 'references/authored/course-target-exercises.json';
const CANDIDATE_STORAGE_PATH = 'references/data/exam-ingestion/answer-skill-candidates.json';
const GENERATORS_PATH = 'engines/skilltree/generators.js';
const GENERATOR_READINESS_PATH = 'reports/json/skilltree-generator-readiness.json';
const EX_CONTRACT_PATH = 'references/data/exam-ingestion/operation-answer-skill-contract.json';

const PACKET_JSON_PATH = 'reports/mtu-hardening/mtu-h4b-answer-form-cli-execution-packet.json';
const PACKET_MD_PATH = 'reports/mtu-hardening/mtu-h4b-answer-form-cli-execution-packet.md';
const REVIEW_DIR = `reports/review-gates/${GATE_ID}`;
const REVIEW_JSON_PATH = `${REVIEW_DIR}/review-packet.json`;
const REVIEW_MD_PATH = `${REVIEW_DIR}/review-packet.md`;

const ACCEPTED_IDS = ['A96', 'A97', 'A98', 'A99', 'A80', 'A81'];
const INVALID_IDS = ['A100'];
const HELD_ID = 'A71';
const HELD_LANES = [
  'ANS_GRAFISCH_ARCEER_TEKEN',
  'ANS_MOTIVEER_CLASSIFICATIE',
  'ANS_ANALYSEER_BEOORDEEL',
];
const EX_OVERLAYS = [
  'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION',
  'EX_ANS_TWO_STEP_CORRECTION_MODEL_EXPLANATION',
];

const FALSE_AUTHORITY = [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'unit_minting_authorized',
  'answer_form_execution_authorized',
  'target_exercise_mutation_authorized',
  'question_type_field_writes_authorized',
  'answer_form_field_writes_authorized',
  'candidate_storage_creation_authorized',
  'candidate_writes_authorized',
  'generated_projection_refresh_authorized',
  'lesson_output_mutation_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'sequencing_authorized',
  'student_facing_ai_authorized',
  'summative_use_authorized',
  'pv_projection_authorized',
  'pv_machine_promotion_authorized',
  'scale_gate_1_authorized',
  'student_product_use_authorized',
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

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function compactSpec(spec) {
  const text = JSON.stringify(spec);
  if (text.includes("'")) {
    throw new Error(`spec for ${spec.id} contains a single quote and needs command quoting review`);
  }
  return text;
}

function commandFor(spec) {
  return `node build-scripts/references/unit-add.js --spec '${compactSpec(spec)}'`;
}

function authorityBoundary() {
  return Object.fromEntries(FALSE_AUTHORITY.map((key) => [key, false]));
}

function targetRecords(data) {
  return Array.isArray(data) ? data : data.exercises || data.target_exercises || [];
}

function loadGenerators() {
  const moduleExports = require(repoPath(GENERATORS_PATH));
  return moduleExports.GEN || moduleExports;
}

function generatorImplemented(spec, generators) {
  return Boolean(generators[spec.id] || (spec.generator && generators[spec.generator]));
}

function buildBaseline(units, targets) {
  const byId = new Map(units.map((unit) => [unit.id, unit]));
  const records = targetRecords(targets);
  return {
    live_unit_count: units.length,
    id_presence: Object.fromEntries([...ACCEPTED_IDS, HELD_ID, ...INVALID_IDS].map((id) => [id, byId.has(id)])),
    invalid_id_policy: {
      regex: '^[A-L][0-9][0-9]$',
      invalid_ids_rejected: INVALID_IDS,
      a100_valid: /^[A-L]\d\d$/.test('A100'),
    },
    target_exercise_records: records.length,
    target_question_type_field_count: records.filter((item) => Object.prototype.hasOwnProperty.call(item, 'question_type')).length,
    target_answer_form_field_count: records.filter((item) => Object.prototype.hasOwnProperty.call(item, 'answer_form')).length,
    candidate_storage_exists: fs.existsSync(repoPath(CANDIDATE_STORAGE_PATH)),
    candidate_storage_path: CANDIDATE_STORAGE_PATH,
  };
}

function validatePlannedSpecs(units, specs) {
  const existingIds = new Set(units.map((unit) => unit.id));
  const spec_validation = specs.map((spec) => ({
    unit_id: spec.id,
    validate_spec_errors: validateSpec(spec, existingIds),
  }));
  const simulated = [...units, ...specs];
  const catalog = validate(simulated, {
    terms: loadTerminology(),
    eindtermen: loadEindtermen(),
    skipStoredLayerValidation: true,
  });
  const eindtermen = loadEindtermen();
  const exam_code_validation = Object.fromEntries(
    specs.flatMap((spec) => spec.exam_codes || [])
      .filter((code, index, codes) => codes.indexOf(code) === index)
      .sort()
      .map((code) => [code, eindtermen.has(code)])
  );
  return {
    status: spec_validation.every((row) => row.validate_spec_errors.length === 0) && catalog.errors.length === 0
      ? 'passed'
      : 'failed',
    method: [
      'validateSpec for each reviewed unit spec against the current live catalog',
      'build-unit-index validate() on the simulated catalog with all six units appended',
      'loadEindtermen exam-code check against references/external/syllabus-eindtermen.json',
    ],
    spec_validation,
    catalog_validation_errors: catalog.errors,
    exam_code_validation,
    simulated_unit_count_after_additions: simulated.length,
    protected_reference_data_written: false,
  };
}

function buildPacket() {
  const h4aClosure = readJson(H4A_CLOSURE_PATH);
  const h4aPacket = readJson(H4A_PACKET_PATH);
  const h4Closure = fs.existsSync(repoPath(H4_CLOSURE_PATH)) ? readJson(H4_CLOSURE_PATH) : null;
  const units = readJson(UNITS_PATH);
  const targets = readJson(TARGETS_PATH);
  const exContract = readJson(EX_CONTRACT_PATH);
  const generatorReadiness = readJson(GENERATOR_READINESS_PATH);
  const generators = loadGenerators();

  const lanes = ACCEPTED_IDS.map((id) => {
    const lane = h4aPacket.proposed_unit_additions.find((item) => item.unit_id === id);
    if (!lane) throw new Error(`missing H4A proposed unit lane ${id}`);
    const specJson = compactSpec(lane.reviewed_spec);
    return {
      lane: lane.lane,
      unit_id: lane.unit_id,
      action: 'unit-add',
      execution_authorized_by_packet: false,
      reviewed_spec: lane.reviewed_spec,
      h4a_planning_rationale: lane.planning_rationale,
      source_use_modifier_only: lane.unit_id === 'A81' ? true : undefined,
      standalone_complete_answer_form: lane.unit_id === 'A81' ? false : undefined,
      compatible_underlying_answer_forms: lane.compatible_underlying_answer_forms || undefined,
      split_if_needed_condition: lane.unit_id === 'A80'
        ? 'Split noem and geef-aan into separate lanes if reviewed evidence shows different answer-construction behavior.'
        : undefined,
      exact_command: commandFor(lane.reviewed_spec),
      command_spec_sha256: sha256(specJson),
    };
  });
  const specs = lanes.map((lane) => lane.reviewed_spec);
  const validation = validatePlannedSpecs(units, specs);

  const exactCommandSet = lanes.map((lane, index) => ({
    execution_order: index + 1,
    unit_id: lane.unit_id,
    lane: lane.lane,
    command_kind: 'unit-add',
    dry_run_command: null,
    dry_run_limitation: 'unit-add has no dry-run mode in the current CLI; H4B therefore uses simulated catalog validation and exact command review instead.',
    print_or_log_extracted_spec_before_execution: true,
    command_spec_sha256: lane.command_spec_sha256,
    execution_command: lane.exact_command,
    execution_authorized_by_packet: false,
  }));

  const generatorRows = lanes.map((lane) => ({
    unit_id: lane.unit_id,
    declared_generator: lane.reviewed_spec.generator,
    unit_live_now: false,
    generator_implemented_now: generatorImplemented(lane.reviewed_spec, generators),
    current_readiness_row_exists: Boolean((generatorReadiness.rows || []).find((row) => row.unit_id === lane.unit_id)),
    exposure_status_now: 'not_live_no_student_route',
    condition_before_student_facing_exposure:
      'After any later minting, either implement the declared generator or record generator-blocked/non-interactive status and prove no student-facing route exposes the unit.',
  }));

  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    generated_on: TODAY,
    status: 'execution_packet_ready_no_mutation',
    source_gate: H4A_CLOSURE_PATH,
    source_planning_packet: H4A_PACKET_PATH,
    source_routing_gate: H4_CLOSURE_PATH,
    reviewed_h4a_remote_commit: h4aClosure.reviewed_remote_commit,
    reviewed_h4_remote_commit: h4Closure ? h4Closure.reviewed_remote_commit : null,
    remote_publication_required_before_review: true,
    remote_publication_status: 'H4B packet, review packet, sprint plan, baseline, checker, and cited evidence must be committed and pushed to the normal remote branch before GATE-MTU-H4B starts.',
    authority_boundary: authorityBoundary(),
    evidence_base: [
      H4A_CLOSURE_PATH,
      H4A_PACKET_PATH,
      H4_CLOSURE_PATH,
      'reports/sprints/MTU-H4B-plan.md',
      'reports/sprints/MTU-H4B-baseline.md',
      UNITS_PATH,
      TARGETS_PATH,
      EX_CONTRACT_PATH,
      'build-scripts/references/unit-add.js',
      'build-scripts/references/build-unit-index.js',
      GENERATOR_READINESS_PATH,
    ],
    h4a_closure_summary: {
      status: h4aClosure.status,
      authorized_next: h4aClosure.authorized_next,
      accepted_ids: ACCEPTED_IDS,
      held_lanes: HELD_LANES,
      conditions_carried_forward: [
        'record reviewed remote commit/hash before review',
        'accept bounded A80/A81/A96-A99 allocation and keep A71 held',
        'future A-domain growth requires ID-policy or namespace decision',
        'generator implementation or generator-blocked/non-interactive status before student-facing exposure',
        'no target-exercise question_type or answer_form writes',
        'no answer-skill candidate storage creation or writes',
        'run simulated catalog validation and full validator stack',
        'validate exam codes against syllabus registry',
      ],
    },
    baseline_checks: buildBaseline(units, targets),
    id_allocation: {
      accepted_for_this_bounded_execution_packet: ACCEPTED_IDS,
      held_id_not_consumed: HELD_ID,
      invalid_ids_rejected: INVALID_IDS,
      remaining_non_held_a_domain_slots_after_later_execution: [],
      future_a_domain_growth_requires: 'ID-policy or namespace decision before any further A-domain answer-form planning.',
      execution_authorized_now: false,
    },
    exact_unit_lanes: lanes,
    exact_command_set: exactCommandSet,
    held_lanes: HELD_LANES.map((lane) => ({
      lane,
      execution_command_present: false,
      status: 'held_pending_stronger_evidence_or_separate_gate',
    })),
    ex_answer_skill_overlay_boundary: {
      overlays_visible: EX_OVERLAYS,
      source_contract: EX_CONTRACT_PATH,
      contract_status: exContract.status || null,
      candidate_storage_path: CANDIDATE_STORAGE_PATH,
      candidate_storage_exists: fs.existsSync(repoPath(CANDIDATE_STORAGE_PATH)),
      candidate_storage_creation_authorized: false,
      candidate_writes_authorized: false,
      q3_q15_hidden_inside_answer_form_mtu: false,
    },
    target_mapping_boundary: {
      current_question_type_mappings_are_planning_input_only: true,
      target_exercise_question_type_writes_authorized: false,
      target_exercise_answer_form_writes_authorized: false,
      future_packet_required_for_authored_reference_field_mutation: true,
    },
    bron_modifier_boundary: {
      unit_id: 'A81',
      standalone_complete_answer_form: false,
      must_combine_with_underlying_answer_form: true,
      compatible_underlying_answer_forms:
        lanes.find((lane) => lane.unit_id === 'A81').compatible_underlying_answer_forms,
      stored_boundary_fields: [
        'kern',
        'procedure',
        'pitfalls',
        'zero_needs_review',
      ],
    },
    generator_exposure_handling: {
      current_skilltree_generator_readiness: {
        source: GENERATOR_READINESS_PATH,
        status: generatorReadiness.status,
        student_facing_skilltree_use_authorized:
          generatorReadiness.policy && generatorReadiness.policy.student_facing_skilltree_use_authorized,
        generator_exposure_for_blocked_units_authorized:
          generatorReadiness.policy && generatorReadiness.policy.generator_exposure_for_blocked_units_authorized,
        blocked_interactive_leak_count:
          generatorReadiness.summary && generatorReadiness.summary.blocked_interactive_leak_count,
      },
      planned_units: generatorRows,
      later_execution_condition:
        'After the units are minted, rerun generator readiness and either implement GEN_A80/GEN_A81/GEN_A96-GEN_A99 or record them as generator-blocked/non-interactive before any student-facing route can expose them.',
      student_facing_exposure_authorized_now: false,
    },
    simulated_catalog_validation: validation,
    expected_later_execution_diff: {
      protected_reference_files_that_would_change_only_after_later_authorization: [
        'references/machine/micro-teaching-units.md',
        'references/machine/micro-teaching-units.json',
      ],
      generated_reports_allowed_only_after_authorized_source_mutation: true,
      target_exercise_fields_not_part_of_later_h4b_execution: [
        'question_type',
        'answer_form',
      ],
      candidate_storage_not_part_of_later_h4b_execution: CANDIDATE_STORAGE_PATH,
    },
    rollback_requirements_for_later_execution: [
      'Capture git status and current commit before execution.',
      'Run exact commands only after a later gate authorizes execution.',
      'If any command fails before commit, revert the execution sprint changes as a whole; do not hand-edit references/machine.',
      'If execution is committed and later rejected, route a reviewed revert or deprecation sprint; do not use silent hand edits.',
      'Never create answer-skill candidate storage, target-exercise fields, generated projections, or lesson output as rollback side effects.',
    ],
    validation_stack_for_later_execution: [
      'node build-scripts/references/check-mtu-h4b-answer-form-cli-execution-packet.js',
      'node build-scripts/references/build-unit-index.js',
      'node build-scripts/references/validate-core-schemas.js',
      'node scripts/check-course-target-exercises-v5.js',
      'node build-scripts/references/build-skilltree-generator-readiness.js',
      'node build-scripts/references/check-skilltree-generator-readiness.js',
      'node build-scripts/reports/validate-report-json.js',
      'npm.cmd test -- --runInBand',
      'git diff --check',
    ],
    recommended_next_gate: GATE_ID,
    recommended_next_action:
      'Commit and push this H4B packet and cited evidence, then run GATE-MTU-H4B before any answer-form unit minting or downstream exposure.',
  };
}

function buildPacketMarkdown(packet) {
  const lines = [];
  lines.push('# MTU-H4B Answer-Form CLI Execution Packet');
  lines.push('');
  lines.push(`Generated: ${packet.generated_on}`);
  lines.push('');
  lines.push('Status: execution packet ready, no mutation authorized.');
  lines.push('');
  lines.push('## Authority Boundary');
  lines.push('');
  lines.push('This packet prepares a later bounded execution review only. It does not authorize unit minting, protected reference mutation, target-exercise field writes, candidate storage creation, candidate writes, generated projection refresh, lesson output, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, Scale Gate 1, or student/product use.');
  lines.push('');
  lines.push('## Exact Unit Specs');
  lines.push('');
  for (const lane of packet.exact_unit_lanes) {
    lines.push(`### ${lane.unit_id} ${lane.reviewed_spec.name}`);
    lines.push('');
    lines.push(`- Lane: \`${lane.lane}\``);
    lines.push(`- Action: \`${lane.action}\``);
    lines.push(`- Execution authorized by this packet: \`${lane.execution_authorized_by_packet}\``);
    if (lane.unit_id === 'A80') lines.push(`- Condition: ${lane.split_if_needed_condition}`);
    if (lane.unit_id === 'A81') {
      lines.push('- Boundary: source-use modifier only; not a standalone complete answer form.');
      lines.push(`- Compatible underlying forms: ${lane.compatible_underlying_answer_forms.map((item) => `\`${item}\``).join(', ')}`);
    }
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(lane.reviewed_spec, null, 2));
    lines.push('```');
    lines.push('');
  }
  lines.push('## Exact Command Set');
  lines.push('');
  lines.push('| Order | Unit | Command | Dry-run status |');
  lines.push('|---|---|---|---|');
  for (const command of packet.exact_command_set) {
    lines.push(`| ${command.execution_order} | \`${command.unit_id}\` | \`${command.execution_command.replace(/\|/g, '\\|')}\` | ${command.dry_run_limitation} |`);
  }
  lines.push('');
  lines.push('Before any later execution, print and log each extracted spec and compare its SHA-256 hash with the packet value.');
  lines.push('');
  lines.push('## ID Allocation Proof');
  lines.push('');
  lines.push(`- Accepted bounded IDs: ${packet.id_allocation.accepted_for_this_bounded_execution_packet.map((id) => `\`${id}\``).join(', ')}.`);
  lines.push(`- Held ID not consumed: \`${packet.id_allocation.held_id_not_consumed}\`.`);
  lines.push(`- Invalid IDs rejected: ${packet.id_allocation.invalid_ids_rejected.map((id) => `\`${id}\``).join(', ')}.`);
  lines.push(`- Future A-domain growth: ${packet.id_allocation.future_a_domain_growth_requires}`);
  lines.push('');
  lines.push('## Simulated Catalog Validation');
  lines.push('');
  lines.push(`Status: \`${packet.simulated_catalog_validation.status}\``);
  lines.push('');
  lines.push('| Unit | validateSpec errors |');
  lines.push('|---|---|');
  for (const row of packet.simulated_catalog_validation.spec_validation) {
    lines.push(`| \`${row.unit_id}\` | ${row.validate_spec_errors.length ? row.validate_spec_errors.join('; ') : 'none'} |`);
  }
  lines.push('');
  lines.push(`Catalog validation errors: ${packet.simulated_catalog_validation.catalog_validation_errors.length ? packet.simulated_catalog_validation.catalog_validation_errors.join('; ') : 'none'}.`);
  lines.push('');
  lines.push('## Exam-Code Validation');
  lines.push('');
  lines.push('| Code | Present in syllabus registry |');
  lines.push('|---|---|');
  for (const [code, present] of Object.entries(packet.simulated_catalog_validation.exam_code_validation)) {
    lines.push(`| \`${code}\` | ${present ? 'yes' : 'no'} |`);
  }
  lines.push('');
  lines.push('## Generator And Exposure Guardrails');
  lines.push('');
  lines.push('The planned answer-form units declare generators, but this sprint does not implement generators or expose student-facing routes. Later execution must prove generator implementation or generator-blocked/non-interactive status before any student-facing route can expose these units.');
  lines.push('');
  lines.push('| Unit | Generator | Implemented now | Exposure now |');
  lines.push('|---|---|---|---|');
  for (const row of packet.generator_exposure_handling.planned_units) {
    lines.push(`| \`${row.unit_id}\` | \`${row.declared_generator}\` | ${row.generator_implemented_now ? 'yes' : 'no'} | ${row.exposure_status_now} |`);
  }
  lines.push('');
  lines.push('## Held Lanes');
  lines.push('');
  for (const lane of packet.held_lanes) {
    lines.push(`- \`${lane.lane}\`: ${lane.status}; execution command present = \`${lane.execution_command_present}\`.`);
  }
  lines.push('');
  lines.push('## EX Overlay Boundary');
  lines.push('');
  lines.push('q3 threshold conclusion/unit-direction and q15 two-step correction-model explanation remain visible as EX answer-skill overlays. Candidate storage remains absent and no candidate writes are authorized.');
  lines.push('');
  lines.push('## Target-Exercise Mapping Boundary');
  lines.push('');
  lines.push('Current question-type mappings remain planning input only. No `question_type`, `answer_form`, or other target-exercise fields are written by this packet or by the later answer-form unit execution lane.');
  lines.push('');
  lines.push('## Rollback Route');
  lines.push('');
  for (const item of packet.rollback_requirements_for_later_execution) lines.push(`- ${item}`);
  lines.push('');
  lines.push('## Validation Required');
  lines.push('');
  for (const item of packet.validation_stack_for_later_execution) lines.push(`- \`${item}\``);
  lines.push('');
  lines.push('## Recommended Next Action');
  lines.push('');
  lines.push(packet.recommended_next_action);
  lines.push('');
  return `${lines.join('\n')}`;
}

function buildReviewPacket(packet) {
  const authority = authorityBoundary();
  return {
    schema_version: 1,
    gate_id: GATE_ID,
    sprint_id: SPRINT_ID,
    generated_on: TODAY,
    status: 'review_packet_ready_no_mutation_authorized',
    source_packet: PACKET_JSON_PATH,
    remote_publication_required_before_review: true,
    remote_publication_status: 'Commit and push the H4B packet, review packet, sprint logs, checker, and cited evidence before review starts.',
    authority_boundary: authority,
    evidence_base: [
      PACKET_JSON_PATH,
      PACKET_MD_PATH,
      'reports/sprints/MTU-H4B-plan.md',
      'reports/sprints/MTU-H4B-baseline.md',
      H4A_CLOSURE_PATH,
      H4A_PACKET_PATH,
      UNITS_PATH,
      TARGETS_PATH,
      EX_CONTRACT_PATH,
      GENERATOR_READINESS_PATH,
      'build-scripts/references/unit-add.js',
      'build-scripts/references/build-unit-index.js',
      'build-scripts/references/check-mtu-h4b-answer-form-cli-execution-packet.js',
    ],
    calibration_questions: [
      {
        id: 'MTUH4B-CAL1',
        question: 'Confirm this gate reviews the H4B execution packet only and does not itself authorize protected reference mutation, unit minting, candidate storage, target-exercise mutation, projection refresh, lesson output, or student/product use.',
      },
      {
        id: 'MTUH4B-CAL2',
        question: 'Confirm the H4B packet, review packet, sprint logs, checker, and cited evidence have been pushed to the normal remote branch before review starts.',
      },
      {
        id: 'MTUH4B-CAL3',
        question: 'Confirm A100 remains invalid, A71 remains held, candidate storage remains absent, and no proposed answer-form ID is live until a later exact execution gate authorizes it.',
      },
    ],
    planned_questions: [
      {
        id: 'MTUH4B-Q1',
        title: 'remote evidence and baseline',
        question: 'Is the H4B baseline sufficient: H4A closed, A80/A81/A96-A99 are absent, A100 is invalid, A71 is held, target fields are absent, and candidate storage is absent?',
        options: [
          'Yes, accept the baseline for execution-packet review.',
          'Add more source evidence before execution authority can be considered.',
          'Hold until the remote publication or baseline issue is resolved.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH4B-Q2',
        title: 'ID allocation and future policy',
        question: 'Is bounded use of A80, A81, and A96-A99 acceptable for a later execution sprint, with A100 rejected, A71 held, and future A-domain growth requiring ID-policy or namespace review?',
        options: [
          'Yes, approve this bounded ID allocation for later execution.',
          'Require an ID-policy sprint before any answer-form execution.',
          'Revise one or more IDs; name the replacement route.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH4B-Q3',
        title: 'A96 bereken command',
        question: 'Is the exact A96 unit-add command acceptable for ANS_BEREKEN, with formula, substitution, intermediate steps, unit/notation, and conclusion?',
        options: [
          'Yes, approve A96 for later execution.',
          'Revise the A96 spec or command before execution.',
          'Hold A96 until more correction-model evidence is read.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH4B-Q4',
        title: 'explanation commands',
        question: 'Are the exact A97, A98, and A99 unit-add commands acceptable as separate later execution lanes for uitleg_dat, uitleg_of, and leg uit met voorbeeld?',
        options: [
          'Yes, approve all three separate commands for later execution.',
          'Merge or revise one of the lanes; name the change.',
          'Hold explanation answer-form execution until more evidence is read.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH4B-Q5',
        title: 'A80 noem/geef aan',
        question: 'Is the exact A80 command acceptable for the combined noem/geef-aan answer-form unit, with a future split required if evidence shows geef aan behaves differently?',
        options: [
          'Yes, approve A80 with the split-if-needed condition.',
          'Split noem and geef aan before execution.',
          'Hold concise-identification answer forms until more examples are audited.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH4B-Q6',
        title: 'A81 bron modifier',
        question: 'Is the exact A81 command acceptable only as a source-use modifier plus underlying answer form, not as a standalone complete answer form?',
        options: [
          'Yes, approve A81 as modifier plus underlying answer form.',
          'Revise A81 so source-use stays entirely in task UI rather than an MTU.',
          'Hold bron until source-annex extraction is reviewed more broadly.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH4B-Q7',
        title: 'generator exposure',
        question: 'Are the generator and exposure guardrails sufficient: planned generators may be missing, so later execution must prove implemented or generator-blocked/non-interactive status and no student-facing exposure?',
        options: [
          'Yes, accept the generator/exposure guardrails.',
          'Require generator implementations before unit execution.',
          'Allow unit minting but require generator-blocked proof before any exposure.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH4B-Q8',
        title: 'held lanes and EX overlays',
        question: 'Should graph/draw/shade, Type 4 motiveer/classificatie, and analysis/evaluation remain held, while q3/q15 EX overlays remain visible with no candidate storage or writes?',
        options: [
          'Yes, keep held lanes and EX overlays exactly as written.',
          'Move one held lane into execution; name it and the evidence.',
          'Hold all downstream work until candidate storage is authorized.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH4B-Q9',
        title: 'validation and rollback',
        question: 'Are the command logging, no-dry-run disclosure, simulated catalog validation, exam-code validation, expected diff, validation stack, and rollback route sufficient for a later execution sprint?',
        options: [
          'Yes, accept the command, validation, and rollback standard.',
          'Add more proof requirements before execution.',
          'Hold until unit-add has a dry-run mode.',
          'Open answer / other, with rationale.',
        ],
      },
      {
        id: 'MTUH4B-Q10',
        title: 'next sprint and authority',
        question: 'If GATE-MTU-H4B closes, what is authorized next, and does this packet authorize any mutation or product use now?',
        options: [
          'Authorize only a later bounded execution sprint for accepted H4B commands; no execution or product use now.',
          'Authorize direct execution only if exact commands and final preflight are included in closure.',
          'Hold all downstream answer-form work and revise the H4B packet.',
          'Open answer / other, with rationale.',
        ],
      },
    ],
    future_interview_protocol: [
      'Show the full question list before starting.',
      'Ask calibration questions before binding answers.',
      'Ask one question at a time.',
      'Record each answer before asking the next question.',
      'Run pattern analysis after initial answers.',
      'Ask targeted follow-ups for ambiguity or conflicting authority.',
      'Draft a closure proposal only after evidence is complete.',
      'Require explicit human confirmation before writing a closure record or authorizing downstream execution scope.',
    ],
    stop_conditions: [
      'Stop if the packet/evidence has not been pushed before review.',
      'Stop if any answer authorizes hand edits to references/machine or references/external.',
      'Stop if any answer authorizes unit minting, target-exercise writes, candidate storage, candidate writes, projection refresh, lesson output, or product use from this gate.',
      'Stop if A100 or any invalid ID is treated as usable.',
      'Stop if A71 is consumed without explicit reviewer decision.',
      'Stop if bron is treated as a standalone complete answer form.',
      'Stop if graph, Type 4, or analysis/evaluation are minted without stronger evidence.',
      'Stop if q3/q15 EX overlay needs are hidden inside broad MTUs.',
      'Stop if student-facing exposure is authorized without generator implementation or generator-blocked/non-interactive proof.',
    ],
    recommended_next_action:
      'Commit and push this packet and cited evidence, then run GATE-MTU-H4B before any answer-form MTU minting or downstream exposure.',
  };
}

function buildReviewMarkdown(review, packet) {
  const lines = [];
  lines.push('# GATE-MTU-H4B Answer-Form CLI Execution Review Packet');
  lines.push('');
  lines.push(`Generated: ${review.generated_on}`);
  lines.push('');
  lines.push('Status: review packet ready, no mutation authorized.');
  lines.push('');
  lines.push('## Review Scope');
  lines.push('');
  lines.push('Review the MTU-H4B answer-form CLI execution packet only. Decide whether a later bounded execution sprint may execute the accepted A80, A81, and A96-A99 unit-add commands.');
  lines.push('');
  lines.push('Remote evidence prerequisite: this review packet, the H4B execution packet, sprint logs, checker, and cited evidence must be committed and pushed to the normal remote branch before human review starts. The gate closure must record the reviewed remote commit/hash.');
  lines.push('');
  lines.push('## Evidence Base');
  lines.push('');
  for (const item of review.evidence_base) lines.push(`- \`${item}\``);
  lines.push('');
  lines.push('## Calibration Questions');
  lines.push('');
  review.calibration_questions.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.question}`);
  });
  lines.push('');
  lines.push('If any answer is no, stop and revise the packet or route a governance pause.');
  lines.push('');
  lines.push('## Full Planned Review Questions');
  lines.push('');
  lines.push('The human review must show this complete list before starting, then ask one question at a time.');
  lines.push('');
  for (const question of review.planned_questions) {
    lines.push(`### ${question.id}: ${question.title}`);
    lines.push('');
    lines.push(question.question);
    lines.push('');
    lines.push('Options:');
    for (const option of question.options) lines.push(`- ${option}`);
    lines.push('');
  }
  lines.push('## Exact Command Summary');
  lines.push('');
  for (const command of packet.exact_command_set) {
    lines.push(`- \`${command.unit_id}\`: \`${command.execution_command}\``);
  }
  lines.push('');
  lines.push('## Stop Conditions');
  lines.push('');
  for (const item of review.stop_conditions) lines.push(`- ${item}`);
  lines.push('');
  lines.push('## Future Interview Protocol');
  lines.push('');
  for (const item of review.future_interview_protocol) lines.push(`- ${item}`);
  lines.push('');
  lines.push('## Recommended Next Action');
  lines.push('');
  lines.push(review.recommended_next_action);
  lines.push('');
  return `${lines.join('\n')}`;
}

function main() {
  const packet = buildPacket();
  const review = buildReviewPacket(packet);
  writeJson(PACKET_JSON_PATH, packet);
  writeText(PACKET_MD_PATH, buildPacketMarkdown(packet));
  writeJson(REVIEW_JSON_PATH, review);
  writeText(REVIEW_MD_PATH, buildReviewMarkdown(review, packet));
  console.log(`wrote ${PACKET_JSON_PATH}`);
  console.log(`wrote ${PACKET_MD_PATH}`);
  console.log(`wrote ${REVIEW_JSON_PATH}`);
  console.log(`wrote ${REVIEW_MD_PATH}`);
}

if (require.main === module) {
  main();
}

module.exports = { buildPacket, buildReviewPacket };
