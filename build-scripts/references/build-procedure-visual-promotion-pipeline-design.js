#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - This is a design/report builder only. It must not implement promotion,
 *   write references/machine/, or create mutation logs that imply promotion.
 * - When a later sprint implements the proposed CLI, keep that implementation
 *   separate and gate it with explicit human approval.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'PV.8';
const GATE_ID = 'GATE-PV8-promotion-pipeline-design';
const TODAY = '2026-05-03';

const DESIGN_DATA_PATH = 'references/data/procedure-visual/promotion-pipeline-design.json';
const REPORT_JSON_PATH = 'reports/json/procedure-visual-promotion-pipeline-design.json';
const REPORT_MD_PATH = 'reports/markdown/procedure-visual-promotion-pipeline-design.md';
const GATE_DIR = `reports/review-gates/${GATE_ID}`;
const REVIEW_PACKET_JSON_PATH = `${GATE_DIR}/review-packet.json`;
const REVIEW_PACKET_MD_PATH = `${GATE_DIR}/review-packet.md`;
const TECHNICAL_CLOSURE_JSON_PATH = `${GATE_DIR}/technical-closure.json`;
const TECHNICAL_CLOSURE_MD_PATH = `${GATE_DIR}/technical-closure.md`;

const FORBIDDEN_MACHINE_PV_FILES = [
  'references/machine/procedure-templates.json',
  'references/machine/visual-states.json',
  'references/machine/unit-template-links.json',
  'references/machine/procedure-visual-vocab.json',
  'references/machine/procedure-visual.json',
];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function exists(relPath) {
  return fs.existsSync(repoPath(relPath));
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

function buildDesign() {
  const pv7 = readJson('reports/review-gates/GATE-PV7-machine-promotion-review/gate-closure.json');
  const readiness = readJson('reports/json/procedure-visual-machine-promotion-readiness.json');
  const coverage = readJson('reports/json/procedure-visual-coverage.json');
  const generatorReadiness = readJson('reports/json/skilltree-generator-readiness.json');
  const forbiddenExisting = FORBIDDEN_MACHINE_PV_FILES.filter(exists);

  return {
    schema_version: 1,
    registry_id: 'procedure-visual-promotion-pipeline-design',
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    status: 'design_only',
    generated_by: 'build-scripts/references/build-procedure-visual-promotion-pipeline-design.js',
    generated_on: new Date().toISOString(),
    storage_decision: {
      registry_location: DESIGN_DATA_PATH,
      machine_registry_created: false,
      reason: 'PV.8 defines a future promotion path only. It does not execute promotion or create references/machine PV registries.'
    },
    source_evidence: {
      pv7_gate_closure: 'reports/review-gates/GATE-PV7-machine-promotion-review/gate-closure.json',
      pv7_decision: pv7.status,
      pv7_machine_promotion_authorized: pv7.machine_promotion_authorized,
      readiness_report: 'reports/json/procedure-visual-machine-promotion-readiness.json',
      readiness_status: readiness.status,
      coverage_report: 'reports/json/procedure-visual-coverage.json',
      pv_linked_unit_count: coverage.summary.pv_linked_unit_count,
      skilltree_generator_readiness: 'reports/json/skilltree-generator-readiness.json',
      generator_blocked_count: generatorReadiness.summary.generator_blocked_count
    },
    policy: {
      design_only: true,
      references_machine_write_authorized: false,
      student_facing_projection_authorized: false,
      operation_promotion_authorized: false,
      lesson_target_write_authorized: false,
      diagnostics_or_adaptive_use_authorized: false
    },
    forbidden_machine_files_checked: FORBIDDEN_MACHINE_PV_FILES,
    forbidden_machine_files_found: forbiddenExisting,
    future_promotion_sequence: [
      {
        order: 1,
        phase_id: 'PV8_DESIGN',
        name: 'Promotion pipeline design',
        status: 'this_sprint',
        exit_proof: [
          DESIGN_DATA_PATH,
          REPORT_JSON_PATH,
          REPORT_MD_PATH
        ]
      },
      {
        order: 2,
        phase_id: 'PVG4_LESSON_REGRESSION',
        name: 'Lesson regression proof',
        status: 'required_before_promotion',
        exit_proof: [
          'At least two recorded PV-G4 lesson-side regression proofs',
          'Complete paragraph validation and Book 1 checks where applicable',
          'No hand-built generated-output patching'
        ]
      },
      {
        order: 3,
        phase_id: 'PV9_CLI_IMPLEMENTATION',
        name: 'Promotion CLI implementation',
        status: 'future_only',
        exit_proof: [
          'CLI scripts implemented under build-scripts/references/',
          'machine-registry validators implemented',
          'mutation-log checker implemented',
          'dry-run mode proves no write by default'
        ]
      },
      {
        order: 4,
        phase_id: 'PV10_UNIT_TEMPLATE_LINK_PROMOTION_GATE',
        name: 'Unit-template link promotion gate',
        status: 'future_only',
        exit_proof: [
          'human-interview.*',
          'gate-closure.*',
          'dry-run promotion report',
          'rollback plan'
        ]
      }
    ],
    first_candidate: {
      record_class: 'unit_template_links',
      current_location: 'references/data/procedure-visual/unit-template-links.json',
      future_machine_location: 'references/machine/procedure-visual-unit-template-links.json',
      rationale: 'Links are the thinnest PV record class. They connect existing unit IDs to existing PV template IDs without promoting renderer-facing procedure templates or visual states.',
      promotion_status: 'not_authorized_in_pv8',
      required_before_promotion: [
        'PV-G4 lesson regression proofs recorded',
        'PV promotion CLI implemented and validated',
        'mutation log schema implemented',
        'future human gate explicitly authorizes the exact record set'
      ]
    },
    records_to_keep_as_overlay: [
      {
        record_class: 'procedure_templates',
        reason: 'Templates contain procedure semantics and operation references; they should remain governed data until more renderer and lesson-regression proof exists.'
      },
      {
        record_class: 'visual_states',
        reason: 'Visual states are renderer and surface-variant facing; they need stronger accessibility, surface, and lesson-regression proof before machine authority.'
      },
      {
        record_class: 'procedure_visual_vocab_and_schemas',
        reason: 'Vocabulary and schema governance needs its own promotion design and should not be bundled into first link promotion.'
      }
    ],
    proposed_cli_contract: [
      {
        command_name: 'build-scripts/references/pv-promotion-plan.js',
        implementation_status: 'proposed_not_implemented',
        default_mode: 'dry_run',
        purpose: 'Build a reviewed promotion candidate set without writing references/machine.',
        required_args: [
          '--scope unit-template-links',
          '--gate <gate-id>',
          '--output reports/review-gates/<gate-id>/promotion-plan.json'
        ],
        forbidden_behavior: [
          'no references/machine writes',
          'no lesson target writes',
          'no student-facing projection authorization'
        ]
      },
      {
        command_name: 'build-scripts/references/pv-machine-promote.js',
        implementation_status: 'proposed_not_implemented',
        default_mode: 'blocked_without_gate_closure',
        purpose: 'Apply an explicitly authorized machine promotion set.',
        required_args: [
          '--scope unit-template-links',
          '--gate-closure reports/review-gates/<gate-id>/gate-closure.json',
          '--mutation-log reports/review-gates/<gate-id>/PV-promotion-mutation-log.json'
        ],
        forbidden_behavior: [
          'no execution without closure_confirmed_by_human true',
          'no procedure_templates or visual_states promotion unless the gate explicitly names them',
          'no provisional exercise_operation promotion'
        ]
      },
      {
        command_name: 'build-scripts/references/pv-machine-rollback.js',
        implementation_status: 'proposed_not_implemented',
        default_mode: 'blocked_without_mutation_log',
        purpose: 'Rollback a prior PV machine promotion using the recorded mutation log.',
        required_args: [
          '--mutation-log reports/review-gates/<gate-id>/PV-promotion-mutation-log.json'
        ],
        forbidden_behavior: [
          'no rollback without exact preimage hashes',
          'no rollback of unrelated user changes'
        ]
      }
    ],
    proposed_mutation_log_schema: {
      schema_version: 1,
      required_fields: [
        'mutation_id',
        'gate_id',
        'sprint_id',
        'authorized_scope',
        'executed_by',
        'executed_on',
        'source_records',
        'target_records',
        'preimage_hashes',
        'postimage_hashes',
        'validators_run',
        'rollback_instructions',
        'protected_surfaces_touched'
      ],
      protected_surfaces_touched_must_equal: [
        'references/machine/procedure-visual-unit-template-links.json'
      ],
      must_not_include: [
        'references/external',
        'lesson targets',
        'RAG chunk hand patches',
        'provisional exercise_operation promotion'
      ]
    },
    proposed_validators: [
      {
        validator: 'build-scripts/references/validate-procedure-visual-machine-links.js',
        implementation_status: 'proposed_not_implemented',
        checks: [
          'Every promoted unit_id exists in micro-teaching-units.json.',
          'Every promoted template_id exists in references/data/procedure-visual/procedure-templates.json or an explicitly promoted template registry.',
          'No promoted link has student_facing_allowed true.',
          'Every promoted link records source overlay path and gate id.'
        ]
      },
      {
        validator: 'build-scripts/references/check-procedure-visual-promotion-log.js',
        implementation_status: 'proposed_not_implemented',
        checks: [
          'Mutation log schema is valid.',
          'Gate closure authorizes the exact scope.',
          'Preimage and postimage hashes resolve.',
          'Rollback instructions are present.'
        ]
      },
      {
        validator: 'build-scripts/references/check-procedure-visual-publication-boundary.js',
        implementation_status: 'proposed_not_implemented',
        checks: [
          'Machine promotion does not imply student-facing projection.',
          'Generator-blocked units remain blocked.',
          'Diagnostics, adaptive routing, AI, sequencing, mastery, and summative use remain unauthorized.'
        ]
      }
    ],
    future_gate_template: {
      proposed_gate_id: 'GATE-PV10-unit-template-link-promotion',
      required_questions: [
        'Are at least two PV-G4 lesson-side regression proofs recorded and valid?',
        'Is the promotion scope limited to unit-template links?',
        'Does the promotion CLI dry run produce the expected candidate set without writing references/machine?',
        'Does the mutation-log schema support rollback and protected-surface auditing?',
        'Do promoted links keep student-facing projection, generator exposure, diagnostics, adaptive routing, AI, sequencing, mastery, and summative use blocked?',
        'Does HCS explicitly authorize CLI-only promotion for the named record set?'
      ],
      valid_statuses: [
        'pass_with_conditions',
        'hold',
        'fail'
      ]
    },
    checks: [
      {
        id: 'pv7_blocks_promotion',
        status: pv7.machine_promotion_authorized === false ? 'passed' : 'failed',
        detail: 'PV.7 gate closure does not authorize machine promotion.'
      },
      {
        id: 'no_forbidden_machine_files',
        status: forbiddenExisting.length === 0 ? 'passed' : 'failed',
        detail: forbiddenExisting.length === 0 ? 'No PV machine registry files exist.' : forbiddenExisting.join(', ')
      },
      {
        id: 'design_only_policy',
        status: 'passed',
        detail: 'PV.8 records contracts only and does not implement promotion.'
      },
      {
        id: 'first_candidate_limited_to_links',
        status: 'passed',
        detail: 'Unit-template links are the only first candidate; templates and visual states remain overlays.'
      }
    ]
  };
}

function renderReportMd(design) {
  const lines = [];
  lines.push('# Procedure-Visual Promotion Pipeline Design');
  lines.push('');
  lines.push(`Sprint: \`${design.sprint_id}\``);
  lines.push(`Gate: \`${design.gate_id}\``);
  lines.push('Status: `design_only`');
  lines.push('');
  lines.push('## Decision Boundary');
  lines.push('');
  lines.push('PV.8 does not authorize machine promotion. It defines the future path required before a later gate may promote any PV record.');
  lines.push('');
  lines.push('## First Candidate');
  lines.push('');
  lines.push(`Record class: \`${design.first_candidate.record_class}\``);
  lines.push('');
  lines.push(`Current location: \`${design.first_candidate.current_location}\``);
  lines.push('');
  lines.push(`Future machine location: \`${design.first_candidate.future_machine_location}\``);
  lines.push('');
  lines.push(design.first_candidate.rationale);
  lines.push('');
  lines.push('## Future Sequence');
  lines.push('');
  lines.push('| Order | Phase | Status |');
  lines.push('|---:|---|---|');
  for (const phase of design.future_promotion_sequence) {
    lines.push(`| ${phase.order} | ${phase.name} | ${phase.status} |`);
  }
  lines.push('');
  lines.push('## Proposed CLI Contract');
  lines.push('');
  lines.push('| Command | Status | Purpose |');
  lines.push('|---|---|---|');
  for (const command of design.proposed_cli_contract) {
    lines.push(`| \`${command.command_name}\` | ${command.implementation_status} | ${command.purpose} |`);
  }
  lines.push('');
  lines.push('## Proposed Validators');
  lines.push('');
  lines.push('| Validator | Status |');
  lines.push('|---|---|');
  for (const validator of design.proposed_validators) {
    lines.push(`| \`${validator.validator}\` | ${validator.implementation_status} |`);
  }
  lines.push('');
  lines.push('## Records Kept As Overlays');
  lines.push('');
  for (const record of design.records_to_keep_as_overlay) {
    lines.push(`- \`${record.record_class}\`: ${record.reason}`);
  }
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  lines.push('- No `references/machine/` PV registry is created in PV.8.');
  lines.push('- No provisional `exercise_operations` are promoted.');
  lines.push('- No student-facing PV projection is authorized.');
  lines.push('- PV-G4 lesson-regression proof remains required before reopening promotion.');
  lines.push('');
  return lines.join('\n');
}

function buildReviewPacket(design) {
  return {
    gate_id: GATE_ID,
    sprint_id: SPRINT_ID,
    status: 'technical_design_closed',
    generated_on: TODAY,
    design_report: REPORT_JSON_PATH,
    machine_promotion_authorized: false,
    summary: {
      first_candidate: design.first_candidate.record_class,
      proposed_cli_count: design.proposed_cli_contract.length,
      proposed_validator_count: design.proposed_validators.length,
      future_gate: design.future_gate_template.proposed_gate_id
    },
    decisions: [
      'PV.8 is design-only.',
      'Unit-template links are the only future first candidate.',
      'Procedure templates and visual states remain references/data overlays.',
      'PV-G4 lesson-regression proof remains required before reopening promotion.'
    ],
    blocked_scope: [
      'references/machine Procedure-Visual registry creation',
      'student-facing PV projection',
      'generator exposure for blocked units',
      'provisional exercise_operation promotion',
      'diagnostics',
      'adaptive routing',
      'student-facing AI',
      'automatic sequencing',
      'mastery decisions',
      'summative use'
    ]
  };
}

function renderReviewPacketMd(packet) {
  const lines = [];
  lines.push('# GATE-PV8 Promotion Pipeline Design: Technical Packet');
  lines.push('');
  lines.push(`Sprint: \`${packet.sprint_id}\``);
  lines.push('Status: `technical_design_closed`');
  lines.push('');
  lines.push('PV.8 defines the future Procedure-Visual promotion pipeline. It does not authorize or execute machine promotion.');
  lines.push('');
  lines.push('## Design Report');
  lines.push('');
  lines.push(`- JSON: \`${REPORT_JSON_PATH}\``);
  lines.push(`- Markdown: \`${REPORT_MD_PATH}\``);
  lines.push(`- Data overlay: \`${DESIGN_DATA_PATH}\``);
  lines.push('');
  lines.push('## Decisions');
  lines.push('');
  for (const decision of packet.decisions) {
    lines.push(`- ${decision}`);
  }
  lines.push('');
  lines.push('## Blocked Scope');
  lines.push('');
  for (const item of packet.blocked_scope) {
    lines.push(`- ${item}`);
  }
  lines.push('');
  return lines.join('\n');
}

function buildTechnicalClosure(design) {
  return {
    gate_id: GATE_ID,
    sprint_id: SPRINT_ID,
    status: 'pass_with_conditions',
    closure_type: 'technical',
    closed_on: TODAY,
    machine_promotion_authorized: false,
    protected_reference_data_changed: false,
    design_report: REPORT_JSON_PATH,
    accepted_outcomes: [
      'PV promotion pipeline design exists.',
      'Future first candidate is limited to unit-template links.',
      'Proposed CLI contract, mutation-log schema, validators, rollback model, and future gate questions are documented.'
    ],
    blocked_outcomes: [
      'No PV references/machine registry is created.',
      'No unit-template link is promoted.',
      'No procedure template or visual state is promoted.',
      'No student-facing PV projection is authorized.'
    ],
    next_required_step: 'PV-G4 lesson-regression proof and later CLI implementation before any future promotion gate.'
  };
}

function renderTechnicalClosureMd(closure) {
  const lines = [];
  lines.push('# GATE-PV8 Promotion Pipeline Design: Technical Closure');
  lines.push('');
  lines.push(`Status: \`${closure.status}\``);
  lines.push('');
  lines.push('PV.8 is closed as a design-only technical sprint. No machine promotion is authorized.');
  lines.push('');
  lines.push('## Accepted Outcomes');
  lines.push('');
  for (const item of closure.accepted_outcomes) lines.push(`- ${item}`);
  lines.push('');
  lines.push('## Blocked Outcomes');
  lines.push('');
  for (const item of closure.blocked_outcomes) lines.push(`- ${item}`);
  lines.push('');
  lines.push('## Next Required Step');
  lines.push('');
  lines.push(closure.next_required_step);
  lines.push('');
  return lines.join('\n');
}

function main() {
  const design = buildDesign();
  const packet = buildReviewPacket(design);
  const closure = buildTechnicalClosure(design);

  writeJson(DESIGN_DATA_PATH, design);
  writeJson(REPORT_JSON_PATH, design);
  writeText(REPORT_MD_PATH, renderReportMd(design));
  writeJson(REVIEW_PACKET_JSON_PATH, packet);
  writeText(REVIEW_PACKET_MD_PATH, renderReviewPacketMd(packet));
  writeJson(TECHNICAL_CLOSURE_JSON_PATH, closure);
  writeText(TECHNICAL_CLOSURE_MD_PATH, renderTechnicalClosureMd(closure));

  console.log(`wrote ${REPORT_JSON_PATH}`);
  console.log(`wrote ${REVIEW_PACKET_JSON_PATH}`);
}

if (require.main === module) main();

module.exports = {
  buildDesign,
  buildReviewPacket,
  buildTechnicalClosure
};
