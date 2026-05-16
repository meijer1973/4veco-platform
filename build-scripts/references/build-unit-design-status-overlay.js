#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(REPO_ROOT, 'references', 'data', 'unit-design-status');
const OUT_FILE = path.join(OUT_DIR, 'unit-design-status-overlay.json');
const GATE_ID = 'GATE-CP5-D04-resolution';
const GATE_DIR = path.join(REPO_ROOT, 'reports', 'review-gates', GATE_ID);
const GATE_CLOSURE = path.join(GATE_DIR, 'gate-closure.json');
const SPRINT_ID = 'S9';
const REQUIRED_AUDIT_UNITS = ['D04', 'A15', 'A16', 'A17', 'D06', 'D11', 'D12', 'D27'];

function readJson(relPath, fallback) {
  const file = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

function writeMarkdown(file, lines) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, lines.join('\n').replace(/\n+$/g, '') + '\n');
}

function now() {
  return new Date().toISOString();
}

function unitName(unit) {
  return unit && (unit.name || unit.title || unit.id);
}

function summarizeUnit(unit) {
  return {
    unit_id: unit.id,
    unit_name: unitName(unit),
    needs: unit.needs || [],
    terms: unit.terms || [],
    exam_codes: unit.exam_codes || [],
    deprecated: unit.deprecated === true,
    mastery_target: unit.mastery_target || null,
    procedure_step_count: Array.isArray(unit.procedure) ? unit.procedure.length : 0,
  };
}

function targetExercisesWithUnit(targets, unitId) {
  const exercises = Array.isArray(targets) ? targets : targets.exercises || [];
  return exercises
    .filter((item) => JSON.stringify(item).includes(unitId))
    .map((item) => ({
      id: item.id,
      paragraph_title: item.paragraph_title,
      source_ref: item.source_ref,
      required_skills: item.required_skills || [],
      new_skills_introduced: item.new_skills_introduced || [],
      prior_knowledge_assumed: item.prior_knowledge_assumed || [],
    }));
}

function examQuestionsWithUnit(exams, unitId) {
  const questions = Array.isArray(exams) ? exams : exams.questions || [];
  return questions
    .filter((item) => (item.required_skills || item.skill_ids || []).includes(unitId))
    .map((item) => ({
      exam: item.exam,
      level: item.level,
      year: item.year,
      tijdvak: item.tijdvak,
      opgave_num: item.opgave_num,
      opgave_name: item.opgave_name,
      question_num: item.question_num,
      required_skills: item.required_skills || item.skill_ids || [],
      exam_codes: item.exam_codes || [],
      question_type: item.question_type,
    }));
}

function blueprintTriageWithUnit(triage, unitId) {
  return (triage.triage_records || [])
    .filter((item) => JSON.stringify(item).includes(unitId))
    .map((item) => ({
      id: item.id,
      paragraph_id: item.paragraph_id,
      paragraph_title: item.paragraph_title,
      source_ref: item.source_ref,
      raw_flag: item.raw_flag,
      decision_category: item.decision_category,
      next_action: item.next_action,
      required_skills: item.evidence && item.evidence.required_skills || [],
      explicit_unit_ids_in_flag: item.evidence && item.evidence.explicit_unit_ids_in_flag || [],
      best_existing_unit_matches: item.evidence && item.evidence.best_existing_unit_matches || [],
    }));
}

function evidenceRefs() {
  return [
    {
      kind: 'human_gate_decision',
      path: 'reports/review-gates/GATE-R2-empty-needs/human-interview.md',
      anchor: 'Question 5: D04 Elasticity And Goods Classification',
      supports: 'Human reviewer said there is no need for a separate D04 unit; classifications should sit inside the relevant elasticity units.',
    },
    {
      kind: 'unit_design_packet',
      path: 'reports/review-gates/GATE-R2-empty-needs/R2.4-evidence-unit-design-packet.json',
      anchor: 'edge-D04-needs-A15 and unit_design_decisions[D04]',
      supports: 'D04 is unit_design_required, not a D04 to A15 prerequisite-edge correction.',
    },
    {
      kind: 'gate_closure',
      path: 'reports/review-gates/GATE-R5-alignment-graph/gate-closure.json',
      anchor: 'conditions_to_reopen_or_pass',
      supports: 'D04 must be represented as a unit-design issue, not as a simple prerequisite edge.',
    },
    {
      kind: 'quality_issue',
      path: 'reports/json/reference-quality-issues.json',
      anchor: 'R8-QC-007',
      supports: 'D04 requires a decision record, dependent-unit audit, and VWO economics review outcome before C-to-B promotion depends on it.',
    },
    {
      kind: 'target_exercise',
      path: 'references/authored/course-target-exercises.json',
      anchor: '2.1.3 Income elasticity and cross elasticity',
      supports: 'Owned target exercise groups D04 with income and cross elasticity work rather than as a standalone exercise target.',
    },
    {
      kind: 'exam_question',
      path: 'references/external/exam-questions.json',
      anchor: 'ha-1022-a-25-2-o opgave 2 question 8',
      supports: 'Exam extraction currently cites D04 for a goods-classification question tied to D1.7/D1.8.',
    },
  ];
}

function readGateClosure() {
  if (!fs.existsSync(GATE_CLOSURE)) return null;
  return JSON.parse(fs.readFileSync(GATE_CLOSURE, 'utf8'));
}

function buildOverlay(unitsById, gateClosure) {
  const d04 = unitsById.get('D04');
  if (!d04) throw new Error('D04 missing from micro-teaching-units.json');
  const gateClosed = Boolean(gateClosure && gateClosure.status);
  return {
    schema_version: 1,
    status: 'active_internal_overlay',
    generated_by: 'build-scripts/references/build-unit-design-status-overlay.js',
    generated_on: now(),
    authority_boundary: {
      internal_design_status: true,
      primary_evidence: false,
      curriculum_authority: false,
      exam_authority: false,
      scoring_rule: false,
      student_facing_exposure: false,
      student_diagnostics: false,
      adaptive_routing: false,
      mastery_decision: false,
      automatic_sequencing: false,
      student_facing_ai: false,
      summative_use: false,
      pv_projection: false,
      pv_machine_promotion: false,
      machine_field_migration: false,
      protected_reference_mutation_authorized: false,
    },
    storage_strategy: {
      strategy: 'derived_overlay_first',
      machine_field_migration_ready: false,
      protected_reference_mutation_authorized: false,
      rationale: 'Lifecycle CLIs exist, but unit_design_status is not yet a governed machine-unit field; CP-5 must close before any protected mutation lane.',
    },
    records: [
      {
        unit_id: 'D04',
        unit_name: unitName(d04),
        status: 'unstable_unit_design',
        review_status: gateClosed ? 'cp5_closed' : 'cp5_review_required',
        gate_id: GATE_ID,
        promotion_blocked: true,
        c_to_b_promotion_blocked: true,
        current_catalog_state: {
          needs: d04.needs || [],
          terms: d04.terms || [],
          exam_codes: d04.exam_codes || [],
          deprecated: d04.deprecated === true,
        },
        resolution_options: [
          'retire_standalone_unit',
          'merge_into_successor_units',
          'redistribute_content_to_successor_units',
          'split_into_successor_units',
          'hold_pending_more_evidence',
        ],
        recommended_resolution: 'redistribute_content_to_successor_units_then_retire_standalone_unit',
        successor_unit_ids: ['A15', 'A16', 'A17', 'D06', 'D11', 'D12', 'D27'],
        affected_unit_ids: REQUIRED_AUDIT_UNITS,
        evidence_refs: evidenceRefs(),
        blocked_downstream_uses: [
          'exercise_promotion',
          'student_diagnostics',
          'adaptive_routing',
          'mastery_decision',
          'automatic_sequencing',
          'student_facing_ai',
          'summative_use',
          'pv_projection',
          'pv_machine_promotion',
        ],
        notes: 'S9 prepares CP-5 closure only. D04 lifecycle mutation requires a later CLI-only sprint after explicit human gate closure.',
      },
    ],
  };
}

function buildAudit(unitsById, targets, exams, triage) {
  const units = REQUIRED_AUDIT_UNITS.map((id) => {
    const unit = unitsById.get(id);
    if (!unit) throw new Error(`required audit unit missing: ${id}`);
    return summarizeUnit(unit);
  });
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    generated_by: 'build-scripts/references/build-unit-design-status-overlay.js',
    generated_on: now(),
    protected_reference_data_changed: false,
    audit_scope: REQUIRED_AUDIT_UNITS,
    units,
    d04_citations: {
      target_exercises: targetExercisesWithUnit(targets, 'D04'),
      exam_questions: examQuestionsWithUnit(exams, 'D04'),
      blueprint_triage_records: blueprintTriageWithUnit(triage, 'D04'),
    },
    conclusion: {
      d04_is_prerequisite_edge_issue: false,
      d04_is_unit_design_issue: true,
      c_to_b_promotion_blocked_until_cp5: true,
      likely_successor_units: ['A15', 'A16', 'A17', 'D06', 'D11', 'D12', 'D27'],
    },
  };
}

function buildDecisionRecord(audit, gateClosure) {
  const gateClosed = Boolean(gateClosure && gateClosure.status);
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    generated_by: 'build-scripts/references/build-unit-design-status-overlay.js',
    generated_on: now(),
    decision_status: gateClosed ? `gate_closed_${gateClosure.status}` : 'review_packet_prepared_not_closed',
    protected_reference_data_changed: false,
    subject_unit: 'D04',
    subject_unit_name: 'Elasticiteit en goederenclassificatie',
    recommended_resolution: 'redistribute_content_to_successor_units_then_retire_standalone_unit',
    recommended_successor_mapping: [
      {
        concept: 'price-elasticity goods classification',
        successor_units: ['A15', 'D06'],
      },
      {
        concept: 'income-elasticity goods classification',
        successor_units: ['A17', 'D11'],
      },
      {
        concept: 'cross-elasticity substitutes/complements classification',
        successor_units: ['A16', 'D12', 'D27'],
      },
    ],
    non_decisions: [
      'No D04 prerequisite edge is approved.',
      'No protected machine reference mutation is authorized in S9.',
      'No exercise promotion may rely on D04 before CP-5 closes.',
    ],
    evidence_refs: evidenceRefs(),
    audit_summary: {
      audited_units: audit.audit_scope,
      target_exercise_citations: audit.d04_citations.target_exercises.length,
      exam_question_citations: audit.d04_citations.exam_questions.length,
      blueprint_triage_citations: audit.d04_citations.blueprint_triage_records.length,
    },
  };
}

function buildStrategy() {
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    generated_by: 'build-scripts/references/build-unit-design-status-overlay.js',
    generated_on: now(),
    strategy: 'derived_overlay_first',
    protected_reference_data_changed: false,
    machine_field_migration_ready: false,
    rationale: 'The roadmap prefers a derived overlay first unless CLI/schema migration is ready. Current CLI coverage can express deprecate, split, or merge after a decision, but there is no governed machine-unit unit_design_status field workflow yet.',
    accepted_now: [
      'Create references/data/unit-design-status/unit-design-status-overlay.json.',
      'Report D04 as unstable and promotion-blocked.',
      'Prepare CP-5 decision record, dependent-unit audit, and human review packet.',
    ],
    blocked_now: [
      'Do not edit references/machine/micro-teaching-units.json.',
      'Do not run unit-deprecate.js, unit-merge.js, or unit-split.js in S9.',
      'Do not add D04 -> A15.',
      'Do not treat D04 as promotion-safe before CP-5 closure.',
    ],
    later_if_cp5_passes: [
      'Plan a separate CLI-only mutation sprint with concrete target specs.',
      'Use unit-deprecate.js, unit-merge.js, or unit-split.js only after explicit human authorization.',
      'Regenerate machine projections, reports, RAG chunks, source manifest, and document inventory in that later sprint.',
    ],
  };
}

function buildReviewPacket(decision, audit, strategy, gateClosure) {
  const gateClosed = Boolean(gateClosure && gateClosure.status);
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    generated_by: 'build-scripts/references/build-unit-design-status-overlay.js',
    generated_on: now(),
    status: gateClosed ? `gate_closed_${gateClosure.status}` : 'ready_for_human_interview',
    protected_reference_data_changed: false,
    review_questions: [
      {
        id: 'q1_storage_strategy',
        question: 'Should S9 keep unit_design_status as a derived references/data overlay for now, rather than adding a machine-unit field?',
        options: ['A. Yes, derived overlay first.', 'B. No, prepare machine-field migration now.', 'C. Hold for more tooling evidence.', 'D. Open answer.'],
        recommended: 'A',
      },
      {
        id: 'q2_d04_resolution',
        question: 'What is the CP-5 lifecycle decision for D04 Elasticiteit en goederenclassificatie?',
        options: ['A. Redistribute content to successor elasticity units and retire D04 later through CLI.', 'B. Merge D04 into one existing unit.', 'C. Split D04 into successor units.', 'D. Hold pending more evidence.', 'E. Open answer.'],
        recommended: 'A',
      },
      {
        id: 'q3_successor_mapping',
        question: 'Is the proposed successor mapping complete: A15/D06 for price elasticity, A17/D11 for income elasticity, and A16/D12/D27 for cross elasticity and substitutes/complements?',
        options: ['A. Yes, mapping is complete enough for CP-5.', 'B. Mostly, but revise named units.', 'C. No, D04 should remain standalone.', 'D. Open answer.'],
        recommended: 'A',
      },
      {
        id: 'q4_audit_completeness',
        question: 'Is the dependent-unit audit complete enough for CP-5, covering D04, A15, A16, A17, D06, D11, D12, D27, target exercise 2.1.3, and exam ha-1022-a-25-2-o question 8?',
        options: ['A. Yes, complete enough.', 'B. Needs another evidence source before closure.', 'C. Hold and expand audit scope.', 'D. Open answer.'],
        recommended: 'A',
      },
      {
        id: 'q5_promotion_block',
        question: 'Should D04 remain blocked for C-to-B promotion and student-facing projection until a later CLI-only mutation sprint applies the CP-5 decision?',
        options: ['A. Yes, keep blocked until later CLI mutation.', 'B. Allow internal promotion once CP-5 closes.', 'C. Hold.', 'D. Open answer.'],
        recommended: 'A',
      },
      {
        id: 'q6_gate_status',
        question: 'What CP-5 gate status should close this review?',
        options: ['A. pass_with_conditions: S9 closes but later CLI mutation is required.', 'B. pass: fully resolved without conditions.', 'C. hold: more review needed.', 'D. fail: packet is not fit for closure.', 'E. Open answer.'],
        recommended: 'A',
      },
    ],
    packet_summary: {
      recommended_resolution: decision.recommended_resolution,
      storage_strategy: strategy.strategy,
      audited_units: audit.audit_scope,
      d04_target_exercise_citations: audit.d04_citations.target_exercises.length,
      d04_exam_question_citations: audit.d04_citations.exam_questions.length,
    },
    stop_conditions: [
      'Stop if a reviewer asks for protected machine mutation inside S9.',
      'Stop if D04 is treated as a simple prerequisite edge.',
      'Stop if the successor-unit mapping omits a relevant elasticity lane.',
      'Stop if gate closure lacks explicit human confirmation.',
    ],
  };
}

function mdTable(rows, columns) {
  const lines = [];
  lines.push(`| ${columns.join(' | ')} |`);
  lines.push(`| ${columns.map(() => '---').join(' | ')} |`);
  for (const row of rows) {
    lines.push(`| ${columns.map((column) => String(row[column] == null ? '' : row[column]).replace(/\|/g, '\\|')).join(' | ')} |`);
  }
  return lines;
}

function writeOverlayMarkdown(overlay) {
  const record = overlay.records[0];
  writeMarkdown(path.join(GATE_DIR, 'd04-decision-record.md'), [
    '# CP-5 D04 Decision Record',
    '',
    `Sprint: ${SPRINT_ID}`,
    `Gate: ${GATE_ID}`,
    `Status: ${record.review_status}`,
    '',
    '## Recommended Decision',
    '',
    `- Subject: ${record.unit_id} ${record.unit_name}`,
    `- Recommended resolution: ${record.recommended_resolution}`,
    `- Promotion blocked: ${record.promotion_blocked}`,
    `- Protected reference mutation authorized: ${overlay.authority_boundary.protected_reference_mutation_authorized}`,
    '',
    '## Evidence',
    '',
    ...record.evidence_refs.map((item) => `- ${item.kind}: \`${item.path}\` (${item.anchor}) - ${item.supports}`),
    '',
    '## Non-Decisions',
    '',
    '- No D04 prerequisite edge is approved.',
    '- No machine-unit mutation is authorized in S9.',
    '- Later CLI-only mutation needs a separate sprint after CP-5 closure.',
  ]);
}

function writeAuditMarkdown(audit) {
  writeMarkdown(path.join(GATE_DIR, 'dependent-unit-audit.md'), [
    '# CP-5 Dependent-Unit Audit',
    '',
    `Sprint: ${SPRINT_ID}`,
    `Gate: ${GATE_ID}`,
    '',
    '## Audited Units',
    '',
    ...mdTable(audit.units.map((unit) => ({
      Unit: unit.unit_id,
      Name: unit.unit_name,
      Needs: unit.needs.join(', ') || 'none',
      Terms: unit.terms.join(', ') || 'none',
      ExamCodes: unit.exam_codes.join(', ') || 'none',
      Deprecated: unit.deprecated,
    })), ['Unit', 'Name', 'Needs', 'Terms', 'ExamCodes', 'Deprecated']),
    '',
    '## D04 Citations',
    '',
    `- Target exercises: ${audit.d04_citations.target_exercises.length}`,
    `- Exam questions: ${audit.d04_citations.exam_questions.length}`,
    `- Blueprint triage records: ${audit.d04_citations.blueprint_triage_records.length}`,
    '',
    '## Conclusion',
    '',
    '- D04 is a unit-design issue, not a prerequisite-edge issue.',
    '- C-to-B promotion remains blocked until CP-5 closes and any later CLI mutation is executed.',
  ]);
}

function writeStrategyMarkdown(strategy) {
  writeMarkdown(path.join(GATE_DIR, 'unit-design-status-strategy.md'), [
    '# CP-5 Unit-Design Status Strategy',
    '',
    `Sprint: ${SPRINT_ID}`,
    `Gate: ${GATE_ID}`,
    '',
    '## Strategy',
    '',
    `- Strategy: ${strategy.strategy}`,
    `- Machine-field migration ready: ${strategy.machine_field_migration_ready}`,
    `- Protected reference data changed: ${strategy.protected_reference_data_changed}`,
    '',
    strategy.rationale,
    '',
    '## Accepted Now',
    '',
    ...strategy.accepted_now.map((item) => `- ${item}`),
    '',
    '## Blocked Now',
    '',
    ...strategy.blocked_now.map((item) => `- ${item}`),
    '',
    '## Later If CP-5 Passes',
    '',
    ...strategy.later_if_cp5_passes.map((item) => `- ${item}`),
  ]);
}

function writeReviewPacketMarkdown(packet) {
  writeMarkdown(path.join(GATE_DIR, 'review-packet.md'), [
    '# CP-5 D04 Resolution Review Packet',
    '',
    `Sprint: ${SPRINT_ID}`,
    `Gate: ${GATE_ID}`,
    `Status: ${packet.status}`,
    '',
    '## Scope',
    '',
    'This packet asks the human reviewer to close the D04 unit-design decision without authorizing protected machine mutation inside S9.',
    '',
    '## Planned Calibration Questions',
    '',
    ...packet.review_questions.flatMap((question, index) => [
      `### Question ${index + 1}: ${question.id}`,
      '',
      question.question,
      '',
      ...question.options.map((option) => `- ${option}`),
      '',
      `Recommended option: ${question.recommended}`,
      '',
    ]),
    '## Stop Conditions',
    '',
    ...packet.stop_conditions.map((item) => `- ${item}`),
  ]);
}

function main() {
  const units = readJson('references/machine/micro-teaching-units.json', []);
  const unitsById = new Map(units.map((unit) => [unit.id, unit]));
  const targets = readJson('references/authored/course-target-exercises.json', { exercises: [] });
  const exams = readJson('references/external/exam-questions.json', []);
  const triage = readJson('reports/json/blueprint-flag-triage.json', { triage_records: [] });
  const gateClosure = readGateClosure();

  const overlay = buildOverlay(unitsById, gateClosure);
  const audit = buildAudit(unitsById, targets, exams, triage);
  const decision = buildDecisionRecord(audit, gateClosure);
  const strategy = buildStrategy();
  const packet = buildReviewPacket(decision, audit, strategy, gateClosure);

  writeJson(OUT_FILE, overlay);
  writeJson(path.join(GATE_DIR, 'dependent-unit-audit.json'), audit);
  writeJson(path.join(GATE_DIR, 'd04-decision-record.json'), decision);
  writeJson(path.join(GATE_DIR, 'unit-design-status-strategy.json'), strategy);
  writeJson(path.join(GATE_DIR, 'review-packet.json'), packet);
  writeOverlayMarkdown(overlay);
  writeAuditMarkdown(audit);
  writeStrategyMarkdown(strategy);
  writeReviewPacketMarkdown(packet);

  console.log('OK unit-design status overlay and CP-5 review packet generated');
  console.log('wrote references/data/unit-design-status/unit-design-status-overlay.json');
  console.log(`wrote reports/review-gates/${GATE_ID}/ review packet artifacts`);
}

if (require.main === module) main();
