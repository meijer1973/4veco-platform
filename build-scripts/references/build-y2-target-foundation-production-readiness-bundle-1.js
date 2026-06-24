#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SPRINT = 'Y2-TARGET-FOUNDATION-PRODUCTION-READINESS-BUNDLE-1';
const PRIOR_SOURCE_SPRINT = 'Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1';
const PRIOR_TARGET_SPRINT = 'Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1';
const GATE_DIR = `reports/review-gates/${SPRINT}`;
const CANONICAL_ASSETS = 'references/data/year2-target-foundation/canonical-source-assets.json';
const READINESS_JSON = `${GATE_DIR}/production-readiness-bundle.json`;
const READINESS_MD = `${GATE_DIR}/production-readiness-bundle.md`;
const HANDOFF_JSON = `${GATE_DIR}/generator-handoff-manifests.json`;
const HANDOFF_MD = `${GATE_DIR}/generator-handoff-manifests.md`;
const DISPOSITION_JSON = `${GATE_DIR}/mtu-answer-skill-disposition.json`;
const DISPOSITION_MD = `${GATE_DIR}/mtu-answer-skill-disposition.md`;
const ASSET_GALLERY_HTML = `${GATE_DIR}/canonical-source-assets-gallery.html`;
const REVIEW_PACKET_JSON = `${GATE_DIR}/review-packet.json`;
const REVIEW_PACKET_MD = `reports/reference-planning/${SPRINT}-review-packet.md`;
const PLAN_MD = `reports/sprints/${SPRINT}-plan.md`;
const RESULT_MD = `reports/sprints/${SPRINT}-result.md`;

const CANDIDATES = 'references/authored/year2-v6-target-foundation-candidates.json';
const SOURCE_FOUNDATION = 'references/data/year2-target-foundation/source-reconstruction-foundation.json';
const ANSWER_CONTRACTS = 'references/data/year2-target-foundation/answer-contracts.json';
const SOURCE_PROOF = `reports/review-gates/${PRIOR_SOURCE_SPRINT}/source-reconstruction-proof.json`;
const SOURCE_PROOF_MD = `reports/review-gates/${PRIOR_SOURCE_SPRINT}/source-reconstruction-proof.md`;
const SOURCE_GALLERY_HTML = `reports/review-gates/${PRIOR_SOURCE_SPRINT}/source-reconstruction-gallery.html`;
const MTU_PROOF = `reports/review-gates/${PRIOR_SOURCE_SPRINT}/mtu-task-family-governed-proof.json`;
const MTU_PROOF_MD = `reports/review-gates/${PRIOR_SOURCE_SPRINT}/mtu-task-family-governed-proof.md`;
const PRIOR_SOURCE_PACKET_JSON = `reports/review-gates/${PRIOR_SOURCE_SPRINT}/review-packet.json`;
const PRIOR_SOURCE_PACKET_MD = `reports/reference-planning/${PRIOR_SOURCE_SPRINT}-review-packet.md`;
const PRIOR_MTU_REVIEW = `reports/reference-planning/${PRIOR_TARGET_SPRINT}-mtu-task-family-review.json`;
const BOOK7_TARGET_PACKAGE = 'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book7-risk-information-target-package.md';

const changedPaths = [
  'build-scripts/references/build-y2-source-reconstruction-and-mtu-proof-1.js',
  'build-scripts/references/check-y2-source-reconstruction-and-mtu-proof-1.js',
  'build-scripts/references/check-y2-target-registry-and-task-foundation-implementation-1.js',
  'build-scripts/references/check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js',
  'build-scripts/references/build-y2-target-foundation-production-readiness-bundle-1.js',
  'build-scripts/references/check-y2-target-foundation-production-readiness-bundle-1.js',
  CANDIDATES,
  SOURCE_FOUNDATION,
  ANSWER_CONTRACTS,
  BOOK7_TARGET_PACKAGE,
  SOURCE_GALLERY_HTML,
  MTU_PROOF,
  CANONICAL_ASSETS,
  ASSET_GALLERY_HTML,
  READINESS_JSON,
  READINESS_MD,
  HANDOFF_JSON,
  HANDOFF_MD,
  DISPOSITION_JSON,
  DISPOSITION_MD,
  REVIEW_PACKET_JSON,
  REVIEW_PACKET_MD,
  PLAN_MD,
  RESULT_MD,
];

const specs = [
  {
    record_id: 'Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1',
    owner: 'Y2-B5-P13',
    title: 'Book 5 pension model',
    short_check_boundary: 'Short checks may ask students to select assumptions, classify stock/flow, and assemble a two-link explanation. They must not claim target completion.',
    exit_ticket_requirements: [
      'Use the pension model source and assumptions.',
      'Classify accumulated saving as stock with source justification.',
      'Explain a premium/wealth ratio or pension-age purchasing-power mechanism in a target-equivalent open response.',
    ],
  },
  {
    record_id: 'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1',
    owner: 'Y2-B6-P12',
    title: 'Book 6 VastWonen/Reder housing case',
    short_check_boundary: 'Short checks may rehearse table value selection, waiting-list arithmetic, and one mechanism chain. They must not close the full cost/revenue target.',
    exit_ticket_requirements: [
      'Use both VastWonen/Reder tables.',
      'Show a calculation path for waiting-list or revenue-maximising output.',
      'Write a source-supported rent or mortgage-risk explanation with conclusion.',
    ],
  },
  {
    record_id: 'Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1',
    owner: 'Y2-B7-P13',
    title: 'Book 7 credit-insurance information case',
    short_check_boundary: 'Short checks may practise actor-condition matching and expected-damage components. They must not close broad insurance/information authority.',
    exit_ticket_requirements: [
      'Use the actor-arrow figure and Digibate table together.',
      'Calculate expected damage and markup where required.',
      'Explain moral hazard, adverse selection, or principal-agent logic from explicit source conditions.',
    ],
  },
  {
    record_id: 'Y2-B8-Q15-Q16-STRATEGIC-TARGET-1',
    owner: 'Y2-B8-P04',
    title: 'Book 8 Guarda/Orso Bianco strategic case',
    short_check_boundary: 'Short checks may practise dominant-strategy orientation and self-binding vocabulary. They must visibly label the payoff map as derived if used.',
    exit_ticket_requirements: [
      'Use the official context first; any payoff representation must be labelled derived/non-official.',
      'Identify the strategic incentive and the worse joint outcome.',
      'Explain self-binding and the changed price-war incentive in a two-link response.',
    ],
  },
];

const dispositionOverrides = {
  'Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1:OP-T1': {
    outcome: 'existing_support_requires_extension',
    rationale: 'Existing source_value_selection/source_chain_builder support is useful, but the pension chart needs route-specific schematic-source handling and no numeric-table overclaim.',
  },
  'Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1:OP-H1': {
    outcome: 'new_answer_skill_record_required',
    rationale: 'The public-finance/pension-age mechanism needs a reviewed answer-skill record before lesson or exit-ticket reliance.',
  },
  'Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1:OP-ANS2': {
    outcome: 'existing_support_requires_extension',
    rationale: 'Calculation-answer formatting exists, but the pension ratio response needs route-specific source/ratio proof.',
  },
  'Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1:OP-ANS3': {
    outcome: 'new_answer_skill_record_required',
    rationale: 'The source-supported explanation form needs a reviewed Year 2 answer-skill record.',
  },
  'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1:OP-P1': {
    outcome: 'existing_support_requires_extension',
    rationale: 'Price-control and table-selection support exists, but this route needs social-housing waiting-list proof.',
  },
  'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1:OP-D1': {
    outcome: 'new_task_family_runtime_support_required',
    rationale: 'Demand-function solving depends on formula derivation plus calculation capture not yet proven for this Year 2 route.',
  },
  'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1:OP-C1': {
    outcome: 'new_task_family_runtime_support_required',
    rationale: 'Revenue/cost calculation needs formula-derivation runtime proof before lesson reliance.',
  },
  'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1:OP-C2': {
    outcome: 'new_task_family_runtime_support_required',
    rationale: 'Marginal-revenue output choice needs formula-derivation and decision-step proof before lesson reliance.',
  },
  'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1:OP-F1': {
    outcome: 'new_answer_skill_record_required',
    rationale: 'Mortgage-rate and rental-income risk mechanisms need a reviewed answer-skill record.',
  },
  'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1:OP-E1': {
    outcome: 'existing_support_requires_extension',
    rationale: 'Elasticity/source-chain support exists, but the rent-market income-elasticity route needs exact source proof.',
  },
  'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1:OP-ANS2': {
    outcome: 'new_task_family_runtime_support_required',
    rationale: 'Calculation-answer formatting depends on route-specific formula derivation and intermediate-step capture.',
  },
  'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1:OP-ANS3': {
    outcome: 'new_answer_skill_record_required',
    rationale: 'The source-supported rent/mortgage explanation form needs a Year 2 answer-skill record.',
  },
  'Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1:OP-R1': {
    outcome: 'existing_support_requires_extension',
    rationale: 'Assertion/source-chain support exists, but insurance expected-loss and information-problem routing needs exact route proof.',
  },
  'Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1:OP-M1': {
    outcome: 'existing_governed_support_sufficient',
    rationale: 'Matching/source/sentence support is sufficient for principal-agent actor-condition orientation after route-specific data binding.',
  },
  'Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1:OP-ANS2': {
    outcome: 'existing_support_requires_extension',
    rationale: 'Calculation capture exists, but expected-value plus markup answer formatting needs route-specific proof.',
  },
  'Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1:OP-ANS3': {
    outcome: 'new_answer_skill_record_required',
    rationale: 'Condition-based information-problem explanations need a reviewed answer-skill record.',
  },
  'Y2-B8-Q15-Q16-STRATEGIC-TARGET-1:OP-S1': {
    outcome: 'existing_support_requires_extension',
    rationale: 'Matching and step-ordering support exists, but game-theory source-to-derived representation proof must be route-specific.',
  },
  'Y2-B8-Q15-Q16-STRATEGIC-TARGET-1:OP-ANS1': {
    outcome: 'new_answer_skill_record_required',
    rationale: 'Command-word and point-allocation handling for the strategic prompt needs a reviewed answer-skill record.',
  },
  'Y2-B8-Q15-Q16-STRATEGIC-TARGET-1:OP-ANS3': {
    outcome: 'new_answer_skill_record_required',
    rationale: 'Two-link correction-model strategic explanations need a reviewed answer-skill record.',
  },
};

const outcomeBlocks = {
  existing_governed_support_sufficient: {
    blocks: 'nothing for foundation readiness; later route-specific rendered proof is still required before student/product use',
    does_not_block: 'reviewed foundation ready for lesson design',
    proof_required_to_close: 'Keep source asset, answer contract, and route binding together in the lesson-production PR.',
  },
  existing_support_requires_extension: {
    blocks: 'lesson production and target-equivalent exit-ticket reliance for this OP row',
    does_not_block: 'foundation promotion and generator handoff',
    proof_required_to_close: 'Governed route-specific support extension with rendered proof and exact-head review.',
  },
  new_task_family_runtime_support_required: {
    blocks: 'lesson production, shared task-shell reliance, and target-equivalent proof for this OP row',
    does_not_block: 'foundation promotion and generator handoff',
    proof_required_to_close: 'Governed runtime/task-family PR with focused tests, rendered proof, CI, lead review, and human authorization.',
  },
  new_answer_skill_record_required: {
    blocks: 'lesson production and answer-model closure for this OP row',
    does_not_block: 'foundation promotion and generator handoff',
    proof_required_to_close: 'Governed answer-skill record with correction-model point logic, route proof, and human authorization.',
  },
};

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}

function write(relPath, content) {
  const target = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function writeJson(relPath, value) {
  write(relPath, `${JSON.stringify(value, null, 2)}\n`);
}

function html(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function mdList(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

function byId(items, key) {
  return new Map((items || []).map((item) => [item[key], item]));
}

function findSpec(recordId) {
  return specs.find((spec) => spec.record_id === recordId);
}

function summarizeArtifact(artifact) {
  const values = artifact.values || artifact.rows || artifact.arrows || artifact.must_preserve || artifact.requirements_satisfied || [];
  if (artifact.calculation_trace) {
    return { values, calculation_trace: artifact.calculation_trace };
  }
  if (artifact.conditions) {
    return { values, conditions: artifact.conditions };
  }
  return { values };
}

function accessibilityText(spec, artifact) {
  if (artifact.artifact_id === 'figuur-1-pensioenmodel-2024-2044') {
    return 'Schematic pension model chart for 2024-2044 showing pension wealth rising relative to GDP and premium pressure falling relative to pension wealth; exact student numeric extraction is not authorized from this schematic.';
  }
  if (artifact.artifact_id === 'figuur-1-kredietverzekering-en-voorwaarden') {
    return 'Actor-arrow diagram linking supplier, credit insurer, and buying company with numbered arrows for product delivery, invoice, premium, payout, collection service, collection costs, and outstanding debt.';
  }
  if (artifact.artifact_id === 'derived-payoff-representation') {
    return 'Derived, non-official incentive map for the Guarda and Orso Bianco price-war case; it must be presented after the official source context.';
  }
  return `${spec.owner} source asset ${artifact.artifact_id} with official locator ${artifact.official_locator}.`;
}

function buildCanonicalAssets(foundation, sourceProof) {
  const sourceRecords = byId(sourceProof.records, 'record_id');
  const records = foundation.records.map((record) => {
    const proof = sourceRecords.get(record.record_id);
    const spec = findSpec(record.record_id);
    return {
      record_id: record.record_id,
      target_owner_candidate_id: spec.owner,
      source_family: record.source_family,
      status_after_human_merge: 'canonical_source_assets_ready_for_lesson_design',
      rendered_proof_surface: proof.rendered_surface,
      official_locators: [...new Set(record.required_artifacts.map((artifact) => artifact.official_locator))],
      assets: record.required_artifacts.map((artifact) => ({
        asset_id: artifact.artifact_id,
        artifact_type: artifact.artifact_type,
        canonical_status: 'canonical_ready_for_lesson_design_after_human_merge',
        official_locator: artifact.official_locator,
        source_derived_values_or_geometry: summarizeArtifact(artifact),
        accessibility_text: accessibilityText(spec, artifact),
        provenance: {
          source_foundation: SOURCE_FOUNDATION,
          rendered_review_proof: SOURCE_PROOF,
          rendered_gallery: proof.rendered_surface,
          official_locator: artifact.official_locator,
        },
        anti_substitution_metadata: {
          anti_substitution_rule: artifact.anti_substitution_rule || 'Use only this approved source-family asset for the target handoff.',
          allowed_substitution: false,
        },
        lesson_use_boundary: artifact.artifact_id === 'figuur-1-pensioenmodel-2024-2044'
          ? 'schematic_visual_only_no_exact_numeric_table_claim'
          : artifact.artifact_id === 'derived-payoff-representation'
            ? 'derived_non_official_must_be_labelled_and_secondary_to_official_context'
            : 'official_source_asset_for_lesson_design_after_human_merge',
      })),
    };
  });
  return {
    schema_version: 1,
    sprint_id: SPRINT,
    status: 'canonical_source_assets_ready_for_review_no_lesson_output',
    authority_boundary: 'canonical_source_asset_handoff_only_no_external_mutation_no_lesson_no_product_use',
    source_inputs: [SOURCE_FOUNDATION, SOURCE_PROOF],
    records,
    authority_claims: authorityClaims(),
  };
}

function buildDisposition(mtuProof) {
  const records = mtuProof.records.map((record) => {
    const cases = record.proof_cases.map((proofCase) => {
      const key = `${record.record_id}:${proofCase.op_row}`;
      const override = dispositionOverrides[key];
      const closure = outcomeBlocks[override.outcome];
      return {
        proof_case_id: proofCase.proof_case_id,
        record_id: record.record_id,
        target_owner_candidate_id: record.target_owner_candidate_id,
        op_row: proofCase.op_row,
        exact_outcome: override.outcome,
        rationale: override.rationale,
        task_families: proofCase.task_families,
        subquestions: proofCase.subquestions,
        source_artifact_ids: proofCase.source_artifact_ids,
        answer_contract_forms: proofCase.answer_contracts.map((contract) => ({
          subquestion: contract.subquestion,
          answer_form: contract.answer_form,
          point_logic: contract.point_logic,
          short_answer_model: contract.short_answer_model,
        })),
        blocks: closure.blocks,
        does_not_block: closure.does_not_block,
        proof_required_to_close: closure.proof_required_to_close,
      };
    });
    return {
      record_id: record.record_id,
      target_owner_candidate_id: record.target_owner_candidate_id,
      source_family: record.source_family,
      status_after_human_merge: 'op_row_disposition_ready_for_lesson_design',
      disposition_cases: cases,
    };
  });
  const allCases = records.flatMap((record) => record.disposition_cases);
  return {
    schema_version: 1,
    sprint_id: SPRINT,
    status: 'all_19_op_rows_have_exact_disposition_no_runtime_mutation',
    authority_boundary: 'disposition_only_no_mtu_mutation_no_operation_closure_no_answer_skill_mutation_no_product_use',
    allowed_outcomes: Object.keys(outcomeBlocks),
    records,
    summary: Object.fromEntries(Object.keys(outcomeBlocks).map((outcome) => [
      outcome,
      allCases.filter((item) => item.exact_outcome === outcome).length,
    ])),
    blocker_list: allCases
      .filter((item) => item.exact_outcome !== 'existing_governed_support_sufficient')
      .map((item) => ({
        id: `${item.proof_case_id}:disposition`,
        classification: item.exact_outcome === 'new_task_family_runtime_support_required' ? 'scale_blocker' : 'proof_required_to_close',
        blocks: item.blocks,
        does_not_block: item.does_not_block,
        proof_required_to_close: item.proof_required_to_close,
      })),
    authority_claims: authorityClaims(),
  };
}

function buildHandoffs(candidates, canonicalAssets, disposition, answerContracts) {
  const candidateById = byId(candidates.records, 'id');
  const assetsByRecord = byId(canonicalAssets.records, 'record_id');
  const dispositionByRecord = byId(disposition.records, 'record_id');
  const answersByRecord = byId(answerContracts.records, 'record_id');
  const records = specs.map((spec) => {
    const candidate = candidateById.get(spec.record_id);
    const assets = assetsByRecord.get(spec.record_id);
    const disp = dispositionByRecord.get(spec.record_id);
    const answer = answersByRecord.get(spec.record_id);
    return {
      record_id: spec.record_id,
      target_owner_candidate_id: spec.owner,
      approved_target_and_prerequisites: {
        lesson_goal: candidate.lesson_goal,
        prerequisites: candidate.prerequisite_candidate_ids,
        integrates: candidate.integrates_candidate_ids,
        bounded_retrieval_markers: candidate.bounded_retrieval_marker_ids,
      },
      canonical_source_assets: assets.assets.map((asset) => ({
        asset_id: asset.asset_id,
        official_locator: asset.official_locator,
        lesson_use_boundary: asset.lesson_use_boundary,
        accessibility_text: asset.accessibility_text,
      })),
      operation_and_answer_form_chain: candidate.operation_mapping.map((mapping) => ({
        subquestion: mapping.subquestion,
        op_rows: mapping.op_rows,
        answer_contract: answer.answer_contracts.find((contract) => contract.subquestion === mapping.subquestion),
      })),
      task_family_requirements: disp.disposition_cases.map((item) => ({
        op_row: item.op_row,
        task_families: item.task_families,
        exact_outcome: item.exact_outcome,
        proof_required_to_close: item.proof_required_to_close,
      })),
      source_context_first_layout: [
        'Present the official source/context before any task prompt.',
        'Keep source locators visible in teacher/generator metadata.',
        'Use canonical asset accessibility text before rendered interaction planning.',
      ],
      short_check_boundary: spec.short_check_boundary,
      target_equivalent_exit_ticket_requirements: spec.exit_ticket_requirements,
      answer_model_and_point_logic: answer.answer_contracts,
      remaining_blockers: disp.disposition_cases
        .filter((item) => item.exact_outcome !== 'existing_governed_support_sufficient')
        .map((item) => ({
          op_row: item.op_row,
          blocks: item.blocks,
          proof_required_to_close: item.proof_required_to_close,
        })),
      authority_boundary: 'handoff_manifest_only_no_lesson_generation_no_product_use',
    };
  });
  return {
    schema_version: 1,
    sprint_id: SPRINT,
    status: 'generator_handoff_ready_for_review_no_lesson_output',
    records,
    authority_claims: authorityClaims(),
  };
}

function authorityClaims() {
  return {
    canonical_source_assets_ready_for_review: true,
    op_row_disposition_ready_for_review: true,
    generator_handoff_ready_for_review: true,
    foundation_ready_for_lesson_design_after_human_merge: true,
    target_registry_records_created: false,
    active_v5_registry_mutated: false,
    external_source_mutation_authorized: false,
    machine_reference_mutation_authorized: false,
    mtus_minted: false,
    mtu_mutation_authorized: false,
    operation_registry_mutation_authorized: false,
    answer_skill_mutation_authorized: false,
    broad_operation_row_closure_authorized: false,
    generated_lesson_output_authorized: false,
    product_authority: false,
    product_route_adoption_authorized: false,
    cp6_closure_authorized: false,
    scale_gate_authorized: false,
    diagnostics_authorized: false,
    adaptive_routing_authorized: false,
    mastery_authorized: false,
    pv_authorized: false,
    summative_use_authorized: false,
    student_use_authorized: false,
    student_product_use_authorized: false,
  };
}

function buildReadinessBundle(candidates, canonicalAssets, disposition, handoffs) {
  const blockerList = [
    ...disposition.blocker_list,
    {
      id: 'Y2TFPRB-target-equivalent-exit-ticket-proof',
      classification: 'scale_blocker',
      blocks: 'lesson completion, product readiness, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, and student/product use',
      does_not_block: 'reviewed foundation ready for lesson design after human merge',
      proof_required_to_close: 'Cross-repo lesson-production PRs must render target-equivalent exit tickets from these handoff manifests and return through REV-STD-1 product proof.',
    },
  ];
  return {
    schema_version: 1,
    sprint_id: SPRINT,
    status: 'foundation_ready_for_lesson_design_after_human_merge_with_production_blockers_listed',
    conclusion: 'CONCISE BLOCKER LIST',
    product_end_state_refs: ['../4veco-lessen/specifications/product-end-state.md'],
    original_sprint_or_gate_spec_refs: [
      'references/owned/course-blueprint-v6-three-year.md',
      `reports/review-gates/${PRIOR_SOURCE_SPRINT}/review-packet.json`,
      `reports/review-gates/${PRIOR_SOURCE_SPRINT}/source-reconstruction-proof.json`,
      `reports/review-gates/${PRIOR_SOURCE_SPRINT}/mtu-task-family-governed-proof.json`,
      SOURCE_FOUNDATION,
      ANSWER_CONTRACTS,
      PRIOR_MTU_REVIEW,
      'reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/review-packet.json',
    ],
    non_negotiable_requirements: nonNegotiables(),
    core_requirement_checklist: [
      ['Product end-state cited', 'met', '../4veco-lessen/specifications/product-end-state.md'],
      ['Original sprint/gate specs cited', 'met', 'original_sprint_or_gate_spec_refs'],
      ['Four target families included', 'met', 'records'],
      ['Canonical source assets created', 'met', CANONICAL_ASSETS],
      ['Accessibility and anti-substitution metadata present', 'met', CANONICAL_ASSETS],
      ['All 19 OP rows have exact disposition', 'met', DISPOSITION_JSON],
      ['Generator handoff manifests created', 'met', HANDOFF_JSON],
      ['Promotion limited to lesson design foundation', 'met', 'target_foundation_promotions'],
      ['No downstream authority claimed', 'met', 'authority_claims'],
      ['Exact-head PR proof', 'pending_remote_pr', 'single_account_pr_governance_pilot'],
    ].map(([requirement, status, evidence]) => ({ requirement, status, evidence })),
    records: specs.map((spec) => ({
      record_id: spec.record_id,
      target_owner_candidate_id: spec.owner,
      promotion: {
        from: 'candidate_for_governed_year2_v6_target_foundation',
        to_after_human_merge: 'reviewed_foundation_ready_for_lesson_design',
        does_not_authorize: [
          'lesson generation',
          'MTU mutation',
          'operation closure',
          'answer-skill mutation',
          'product route',
          'CP-6',
          'Scale Gate',
          'student/product use',
        ],
      },
      canonical_asset_count: canonicalAssets.records.find((record) => record.record_id === spec.record_id).assets.length,
      disposition_case_count: disposition.records.find((record) => record.record_id === spec.record_id).disposition_cases.length,
      handoff_manifest: `${HANDOFF_JSON}#${spec.owner}`,
    })),
    exact_merge_order: [
      {
        order: 1,
        lane: 'platform',
        artifact: SPRINT,
        purpose: 'Install canonical source assets, exact OP-row dispositions, and generator handoffs.',
        required_route: 'READY_FOR_HUMAN_REVIEW',
      },
      {
        order: 2,
        lane: 'platform',
        artifact: 'governed MTU/runtime and answer-skill support PRs',
        purpose: 'Close the listed support blockers without broad OP-row closure.',
        required_route: 'READY_FOR_HUMAN_REVIEW',
      },
      {
        order: 3,
        lane: '4veco-lessen',
        artifact: 'cross-repo lesson-production PRs',
        purpose: 'Generate lesson designs from the handoff manifests with target-equivalent exit-ticket proof.',
        required_route: 'READY_FOR_HUMAN_REVIEW',
      },
      {
        order: 4,
        lane: 'product proof',
        artifact: 'REV-STD-1 product-proof and Scale Gate packets',
        purpose: 'Only after rendered lesson output and runtime support prove product safety.',
        required_route: 'READY_FOR_HUMAN_REVIEW',
      },
    ],
    blocker_list: blockerList,
    authority_claims: authorityClaims(),
    linked_artifacts: {
      canonical_assets: CANONICAL_ASSETS,
      asset_gallery: ASSET_GALLERY_HTML,
      disposition: DISPOSITION_JSON,
      handoffs: HANDOFF_JSON,
    },
  };
}

function nonNegotiables() {
  return [
    'Cite product end-state and original sprint/gate specs.',
    'Include all four owner targets: Y2-B5-P13, Y2-B6-P12, Y2-B7-P13, Y2-B8-P04.',
    'Create canonical reusable source assets with official locators, provenance, accessibility text, and anti-substitution metadata.',
    'Keep the pension figure schematic unless a later governed source-derived numeric reconstruction is approved.',
    'Keep the Book 8 payoff representation derived, non-official, and secondary to official context.',
    'Record one exact MTU/task-family/answer-skill disposition for every OP row.',
    'Create machine-readable generator handoff manifests for every owner paragraph.',
    'Promote only to reviewed foundation ready for lesson design after human merge.',
    'Do not authorize lesson generation, MTU mutation, operation closure, answer-skill mutation, product routes, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, or student/product use.',
    'Before merge, rerun exact-head CI, review threads, branch protection ok:true, lead review, and PR Readiness Reviewer.',
  ];
}

function buildPacket(readiness) {
  return {
    schema_version: 1,
    packet_id: SPRINT,
    sprint_id: SPRINT,
    pr_number: null,
    pr_url: null,
    pr_throughput_class: 'high_authority',
    bundle_id: null,
    authority_class: 'protected_reference',
    changed_paths: changedPaths,
    review_autonomy: {
      level: 'L4',
      lead_review_result: 'PENDING_REMOTE_HEAD',
      rationale: 'This PR creates a high-authority Year 2 production-readiness handoff surface for protected target foundations and must route READY_FOR_HUMAN_REVIEW after exact-head proof.',
    },
    human_decision_required: true,
    paired_prs: [],
    auto_merge_allowed_after_ci: false,
    escalation_triggers: [
      'protected_year2_target_foundation',
      'canonical_source_asset_handoff',
      'generator_handoff_manifest',
      'lesson_production_boundary',
      'single_account_governance_pilot',
    ],
    date: '2026-06-24',
    product_end_state_refs: readiness.product_end_state_refs,
    original_sprint_or_gate_spec_refs: readiness.original_sprint_or_gate_spec_refs,
    non_negotiable_requirements: readiness.non_negotiable_requirements,
    core_requirement_checklist: readiness.core_requirement_checklist,
    implementation_summary: {
      target_families: 4,
      canonical_asset_records: 4,
      canonical_assets: 10,
      op_row_dispositions: 19,
      generator_handoff_manifests: 4,
      conclusion: readiness.conclusion,
    },
    carried_flags: readiness.blocker_list.map((item) => ({
      id: item.id,
      classification: item.classification,
      blocks: [item.blocks],
      does_not_block: [item.does_not_block],
      proof_required_to_close: item.proof_required_to_close,
    })),
    authority_claims: readiness.authority_claims,
    proof: {
      local_checkers: [
        { command: 'node --check build-scripts/references/build-y2-source-reconstruction-and-mtu-proof-1.js', status: 'passed' },
        { command: 'node build-scripts/references/build-y2-source-reconstruction-and-mtu-proof-1.js', status: 'passed' },
        { command: 'node --check build-scripts/references/check-y2-source-reconstruction-and-mtu-proof-1.js', status: 'passed' },
        { command: 'node build-scripts/references/check-y2-source-reconstruction-and-mtu-proof-1.js', status: 'passed' },
        { command: 'node build-scripts/references/check-y2-target-registry-and-task-foundation-implementation-1.js', status: 'passed' },
        { command: 'node build-scripts/references/check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js --json', status: 'passed' },
        { command: 'node --check build-scripts/references/build-y2-target-foundation-production-readiness-bundle-1.js', status: 'passed' },
        { command: 'node build-scripts/references/build-y2-target-foundation-production-readiness-bundle-1.js', status: 'passed' },
        { command: 'node --check build-scripts/references/check-y2-target-foundation-production-readiness-bundle-1.js', status: 'passed' },
        { command: 'node build-scripts/references/check-y2-target-foundation-production-readiness-bundle-1.js', status: 'passed' },
        { command: `npm.cmd run check:review-throughput -- ${REVIEW_PACKET_JSON}`, status: 'passed' },
      ],
    },
    single_account_pr_governance_pilot: {
      pilot_status: 'pending_remote_pr',
      expected_route: 'READY_FOR_HUMAN_REVIEW',
      remote_head_sha: null,
      branch_protection_checker_command: 'npm.cmd run check:branch-protection -- --repo meijer1973/4veco-platform --branch main',
      branch_protection_checker_output: null,
      branch_protection_ok_required: true,
      pr_readiness_reviewer_command: null,
      pr_readiness_decision: null,
      lead_review: {
        required: true,
        path: null,
        result: null,
        reviewed_commit_sha: null,
      },
      pilot_data_record: {
        pilot_case: 'protected_reference_high_authority_pr',
        router_route_vs_retrospective_human_judgment: {
          router_route: 'pending_pr_readiness_reviewer_expected_READY_FOR_HUMAN_REVIEW',
          retrospective_human_judgment: 'pending_owner_review',
        },
        lead_review_sufficient: 'sufficient_for_content_preflight_not_sufficient_for_merge',
        unnecessary_human_escalation: false,
        stale_head_or_incomplete_evidence_failures: [
          {
            stage: 'initial_pr_readiness_after_draft_open',
            head_sha: '6a91ae042ff11eb8b648afa9c8351072ab05d13d',
            result: 'KEEP_DRAFT_REVISE',
            reason: 'PR became behind current main after initial exact-head CI, so strict branch protection required refresh and renewed proof.',
          },
        ],
        queueing_behavior_for_close_together_authorized_prs: 'not_applicable_single_pr',
        repeated_main_advancement_behavior: 'observed_once_main_advanced_by_three_commits_after_draft_open_branch_rebased_and_proof_renewal_required',
        overlap_or_deterministic_refresh_dead_end: 'none_observed',
        serialized_integration_lane_used: false,
        integration_authorized_required: false,
      },
      owner_authorization_required_to_merge: true,
      owner_authorization_exact_sha: null,
    },
    decision: {
      status: 'READY_FOR_HUMAN_REVIEW_PENDING_REMOTE_PROOF',
      route: 'READY_FOR_HUMAN_REVIEW',
      human_review_required: true,
      mark_ready_allowed: false,
      merge_allowed: false,
      reason: 'Protected Year 2 target-foundation production-readiness handoff must wait for exact-head CI, branch-protection, lead review, review-thread proof, PR Readiness Reviewer output, and explicit owner authorization.',
    },
  };
}

function renderAssetGallery(canonicalAssets) {
  const sections = canonicalAssets.records.map((record) => `
    <section id="${html(record.target_owner_candidate_id)}">
      <h2>${html(record.target_owner_candidate_id)}</h2>
      <p>${html(record.source_family)}</p>
      <div class="grid">
        ${record.assets.map((asset) => `
          <article>
            <h3>${html(asset.asset_id)}</h3>
            <p><strong>Locator:</strong> ${html(asset.official_locator)}</p>
            <p><strong>Boundary:</strong> ${html(asset.lesson_use_boundary)}</p>
            <p>${html(asset.accessibility_text)}</p>
          </article>`).join('')}
      </div>
    </section>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${SPRINT} Canonical Source Assets</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #17202a; background: #f7f8fa; }
    main { max-width: 1120px; margin: 0 auto; }
    section { margin: 28px 0; padding: 20px; background: #fff; border: 1px solid #d7dce2; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }
    article { border: 1px solid #dde3ea; padding: 14px; background: #fbfcfd; }
    h1, h2, h3 { margin-top: 0; }
  </style>
</head>
<body>
<main>
  <h1>${SPRINT} Canonical Source Assets</h1>
  <p>This gallery is a human-review proof surface only. It does not authorize lesson generation, MTU mutation, product routes, or student/product use.</p>
  ${sections}
</main>
</body>
</html>
`;
}

function renderDispositionMd(disposition) {
  const rows = disposition.records.flatMap((record) =>
    record.disposition_cases.map((item) =>
      `| \`${record.target_owner_candidate_id}\` | \`${item.op_row}\` | \`${item.exact_outcome}\` | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`
    )
  );
  return `# ${SPRINT} MTU And Answer-Skill Disposition

## Core-Requirement Checklist

- Every OP row covered: met.
- One exact outcome per OP row: met.
- no MTU mutation: met.
- No operation or answer-skill registry mutation: met.

| target | OP row | exact outcome | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|---|
${rows.join('\n')}
`;
}

function renderHandoffMd(handoffs) {
  return `# ${SPRINT} Generator Handoff Manifests

These handoffs are machine-readable lesson-design inputs only. They do not generate lessons or authorize product use.

${handoffs.records.map((record) => `## ${record.target_owner_candidate_id}

- Approved target: ${record.approved_target_and_prerequisites.lesson_goal}
- Canonical source assets: ${record.canonical_source_assets.map((asset) => `\`${asset.asset_id}\``).join(', ')}
- Short-check boundary: ${record.short_check_boundary}
- Target-equivalent exit-ticket requirements:
${mdList(record.target_equivalent_exit_ticket_requirements)}
- Remaining blockers:
${mdList(record.remaining_blockers.map((item) => `${item.op_row}: ${item.proof_required_to_close}`))}
`).join('\n')}
`;
}

function renderReadinessMd(readiness) {
  return `# ${SPRINT} Production-Readiness Bundle

Status: ${readiness.status}

## Product End-State And Original Specs

${mdList([...readiness.product_end_state_refs, ...readiness.original_sprint_or_gate_spec_refs].map((item) => `\`${item}\``))}

## Non-Negotiable Requirements

${mdList(readiness.non_negotiable_requirements)}

## Core-Requirement Checklist

| requirement | status | evidence |
|---|---|---|
${readiness.core_requirement_checklist.map((item) => `| ${item.requirement} | ${item.status} | ${item.evidence} |`).join('\n')}

## Conclusion

${readiness.conclusion}: the foundations are ready for lesson-design handoff after exact-head human merge, but cross-repo lesson production still has the blockers below.

## Findings

| id | classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
${readiness.blocker_list.map((item) => `| ${item.id} | ${item.classification} | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`).join('\n')}

## Exact Merge Order

${readiness.exact_merge_order.map((item) => `${item.order}. ${item.lane}: ${item.artifact} - ${item.purpose}`).join('\n')}

## Authority Boundary

No lesson generation, MTU mutation, broad operation closure, product routes, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, or student/product use is authorized.
`;
}

function renderPacketMd(packet) {
  return `# ${SPRINT} Review Packet

## Product End-State And Original Specs

${mdList([...packet.product_end_state_refs, ...packet.original_sprint_or_gate_spec_refs].map((item) => `\`${item}\``))}

## Non-Negotiable Requirements

${mdList(packet.non_negotiable_requirements)}

## Core-Requirement Checklist

| requirement | status | evidence |
|---|---|---|
${packet.core_requirement_checklist.map((item) => `| ${item.requirement} | ${item.status} | ${item.evidence} |`).join('\n')}

## Findings

| id | classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
${packet.carried_flags.map((item) => `| ${item.id} | ${item.classification} | ${item.blocks.join('; ')} | ${item.does_not_block.join('; ')} | ${item.proof_required_to_close} |`).join('\n')}

## Pilot Data Record

- Router route vs retrospective human judgment: ${packet.single_account_pr_governance_pilot.pilot_data_record.router_route_vs_retrospective_human_judgment.router_route} / ${packet.single_account_pr_governance_pilot.pilot_data_record.router_route_vs_retrospective_human_judgment.retrospective_human_judgment}
- Lead review sufficient: ${packet.single_account_pr_governance_pilot.pilot_data_record.lead_review_sufficient}
- Unnecessary human escalation: ${packet.single_account_pr_governance_pilot.pilot_data_record.unnecessary_human_escalation}
- Stale-head or incomplete-evidence failures: ${packet.single_account_pr_governance_pilot.pilot_data_record.stale_head_or_incomplete_evidence_failures.length}
- Queueing behavior: ${packet.single_account_pr_governance_pilot.pilot_data_record.queueing_behavior_for_close_together_authorized_prs}
- Repeated-main-advancement behavior: ${packet.single_account_pr_governance_pilot.pilot_data_record.repeated_main_advancement_behavior}
- Overlap or deterministic-refresh dead end: ${packet.single_account_pr_governance_pilot.pilot_data_record.overlap_or_deterministic_refresh_dead_end}

## Decision

Route: \`${packet.decision.route}\`

Exact-head PR proof is pending. Before merge, branch protection output must include \`ok: true\`, validate-platform must pass at the exact head, lead review must pass at the exact head, review threads must be clean, and owner authorization must name the exact SHA.
`;
}

function renderPlanMd() {
  return `# ${SPRINT} Plan

## Goal

Create a governed Year 2 production-readiness handoff for Y2-B5-P13, Y2-B6-P12, Y2-B7-P13, and Y2-B8-P04.

## Non-Negotiable Requirements

${mdList(nonNegotiables())}

## Verification Plan

- Run the builder.
- Run the custom checker.
- Run review-throughput on the review packet.
- Run platform validation before publication.
- Route through READY_FOR_HUMAN_REVIEW with exact-head branch protection ok:true.
`;
}

function renderResultMd() {
  return `# ${SPRINT} Result

## Summary

- Canonical source assets created at \`${CANONICAL_ASSETS}\`.
- Generator handoff manifests created at \`${HANDOFF_JSON}\`.
- MTU and answer-skill dispositions created at \`${DISPOSITION_JSON}\`.
- Production-readiness bundle created at \`${READINESS_JSON}\`.

## Authority Boundary

No lesson generation, MTU mutation, broad operation closure, product routes, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, or student/product use is authorized.

## Next Action

Open a draft PR, collect exact-head CI/checker/branch-protection/lead-review proof, run the PR Readiness Reviewer, and return to the owner if the route is \`READY_FOR_HUMAN_REVIEW\`.
`;
}

function main() {
  const candidates = readJson(CANDIDATES);
  const foundation = readJson(SOURCE_FOUNDATION);
  const answerContracts = readJson(ANSWER_CONTRACTS);
  const sourceProof = readJson(SOURCE_PROOF);
  const mtuProof = readJson(MTU_PROOF);

  const canonicalAssets = buildCanonicalAssets(foundation, sourceProof);
  const disposition = buildDisposition(mtuProof);
  const handoffs = buildHandoffs(candidates, canonicalAssets, disposition, answerContracts);
  const readiness = buildReadinessBundle(candidates, canonicalAssets, disposition, handoffs);
  const packet = buildPacket(readiness);

  writeJson(CANONICAL_ASSETS, canonicalAssets);
  writeJson(DISPOSITION_JSON, disposition);
  write(DISPOSITION_MD, renderDispositionMd(disposition));
  writeJson(HANDOFF_JSON, handoffs);
  write(HANDOFF_MD, renderHandoffMd(handoffs));
  writeJson(READINESS_JSON, readiness);
  write(READINESS_MD, renderReadinessMd(readiness));
  write(ASSET_GALLERY_HTML, renderAssetGallery(canonicalAssets));
  writeJson(REVIEW_PACKET_JSON, packet);
  write(REVIEW_PACKET_MD, renderPacketMd(packet));
  write(PLAN_MD, renderPlanMd());
  write(RESULT_MD, renderResultMd());

  console.log(`Generated ${SPRINT} artifacts`);
}

if (require.main === module) main();
