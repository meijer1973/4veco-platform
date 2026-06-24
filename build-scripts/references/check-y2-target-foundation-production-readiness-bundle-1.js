#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SPRINT = 'Y2-TARGET-FOUNDATION-PRODUCTION-READINESS-BUNDLE-1';
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
const PRIOR_SOURCE_SPRINT = 'Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1';
const SOURCE_PROOF = `reports/review-gates/${PRIOR_SOURCE_SPRINT}/source-reconstruction-proof.json`;
const SOURCE_PROOF_MD = `reports/review-gates/${PRIOR_SOURCE_SPRINT}/source-reconstruction-proof.md`;
const SOURCE_GALLERY_HTML = `reports/review-gates/${PRIOR_SOURCE_SPRINT}/source-reconstruction-gallery.html`;
const MTU_PROOF = `reports/review-gates/${PRIOR_SOURCE_SPRINT}/mtu-task-family-governed-proof.json`;
const MTU_PROOF_MD = `reports/review-gates/${PRIOR_SOURCE_SPRINT}/mtu-task-family-governed-proof.md`;
const PRIOR_SOURCE_PACKET_JSON = `reports/review-gates/${PRIOR_SOURCE_SPRINT}/review-packet.json`;
const PRIOR_SOURCE_PACKET_MD = `reports/reference-planning/${PRIOR_SOURCE_SPRINT}-review-packet.md`;
const BOOK7_TARGET_PACKAGE = 'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book7-risk-information-target-package.md';

const EXPECTED = [
  {
    record_id: 'Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1',
    owner: 'Y2-B5-P13',
    assets: ['figuur-1-pensioenmodel-2024-2044', 'pensioenmodel-assumptions-a-f'],
    op_rows: ['OP-T1', 'OP-H1', 'OP-ANS2', 'OP-ANS3'],
  },
  {
    record_id: 'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1',
    owner: 'Y2-B6-P12',
    assets: ['tabel-1-vastwonen-financial-data', 'tabel-2-particuliere-huurwoningen-reder', 'q28-housing-investor-context'],
    op_rows: ['OP-P1', 'OP-D1', 'OP-C1', 'OP-C2', 'OP-F1', 'OP-E1', 'OP-ANS2', 'OP-ANS3'],
  },
  {
    record_id: 'Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1',
    owner: 'Y2-B7-P13',
    assets: ['figuur-1-kredietverzekering-en-voorwaarden', 'tabel-1-financiele-gegevens-digibate'],
    op_rows: ['OP-R1', 'OP-M1', 'OP-ANS2', 'OP-ANS3'],
  },
  {
    record_id: 'Y2-B8-Q15-Q16-STRATEGIC-TARGET-1',
    owner: 'Y2-B8-P04',
    assets: ['ijssalon-guarda-orso-bianco-context', 'lowest-price-guarantee-self-binding-source', 'derived-payoff-representation'],
    op_rows: ['OP-S1', 'OP-ANS1', 'OP-ANS3'],
  },
];

const ALLOWED_OUTCOMES = new Set([
  'existing_governed_support_sufficient',
  'existing_support_requires_extension',
  'new_task_family_runtime_support_required',
  'new_answer_skill_record_required',
]);

const ALLOWED_TRUE_AUTHORITY = new Set([
  'canonical_source_assets_ready_for_review',
  'op_row_disposition_ready_for_review',
  'generator_handoff_ready_for_review',
  'foundation_ready_for_lesson_design_after_human_merge',
]);

const FORBIDDEN_TRUE_AUTHORITY = [
  'target_registry_records_created',
  'active_v5_registry_mutated',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'mtus_minted',
  'mtu_mutation_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_mutation_authorized',
  'broad_operation_row_closure_authorized',
  'generated_lesson_output_authorized',
  'product_authority',
  'product_route_adoption_authorized',
  'cp6_closure_authorized',
  'scale_gate_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'pv_authorized',
  'summative_use_authorized',
  'student_use_authorized',
  'student_product_use_authorized',
];

function fail(message) {
  console.error(`ERROR ${SPRINT}: ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function rel(file) {
  return path.join(ROOT, file);
}

function exists(file) {
  assert(fs.existsSync(rel(file)), `missing required file: ${file}`);
}

function read(file) {
  exists(file);
  return fs.readFileSync(rel(file), 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
    return {};
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function byId(items, key) {
  return new Map(asArray(items).map((item) => [item[key], item]));
}

function sameMembers(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    expected.every((item) => actual.includes(item)) &&
    actual.every((item) => expected.includes(item))
  );
}

function assertSameMembers(actual, expected, label) {
  assert(sameMembers(actual, expected), `${label} must be [${expected.join(', ')}], got [${asArray(actual).join(', ')}]`);
}

function assertAuthority(claims, label) {
  assert(claims && typeof claims === 'object', `${label} authority claims missing`);
  for (const key of ALLOWED_TRUE_AUTHORITY) {
    assert(claims[key] === true, `${label}.${key} must be true`);
  }
  for (const key of FORBIDDEN_TRUE_AUTHORITY) {
    assert(claims[key] === false, `${label}.${key} must be false`);
  }
  for (const [key, value] of Object.entries(claims)) {
    if (!ALLOWED_TRUE_AUTHORITY.has(key)) {
      assert(value === false, `${label}.${key} must not be true`);
    }
  }
}

function validateCanonicalAssets(assets, gallery) {
  assert(assets.sprint_id === SPRINT, 'canonical assets sprint mismatch');
  assert(assets.status === 'canonical_source_assets_ready_for_review_no_lesson_output', 'canonical assets status mismatch');
  assertAuthority(assets.authority_claims, 'canonical assets');
  assertSameMembers(assets.records.map((record) => record.target_owner_candidate_id), EXPECTED.map((spec) => spec.owner), 'canonical asset owners');
  let assetCount = 0;
  const records = byId(assets.records, 'record_id');
  for (const spec of EXPECTED) {
    const record = records.get(spec.record_id);
    assert(record, `canonical assets missing ${spec.record_id}`);
    assert(record.target_owner_candidate_id === spec.owner, `${spec.record_id} owner mismatch`);
    assert(record.status_after_human_merge === 'canonical_source_assets_ready_for_lesson_design', `${spec.record_id} post-merge status mismatch`);
    assertSameMembers(record.assets.map((asset) => asset.asset_id), spec.assets, `${spec.record_id} assets`);
    assetCount += record.assets.length;
    for (const asset of record.assets) {
      assert(asset.official_locator, `${asset.asset_id} locator missing`);
      assert(asset.accessibility_text, `${asset.asset_id} accessibility text missing`);
      assert(!/undefined/i.test(asset.accessibility_text), `${asset.asset_id} accessibility text contains undefined`);
      assert(asset.provenance?.source_foundation, `${asset.asset_id} provenance missing`);
      assert(asset.anti_substitution_metadata?.allowed_substitution === false, `${asset.asset_id} anti-substitution missing`);
      assert(asset.lesson_use_boundary, `${asset.asset_id} lesson boundary missing`);
      assert(gallery.includes(asset.asset_id), `gallery missing ${asset.asset_id}`);
    }
  }
  assert(assetCount === 10, `expected 10 canonical assets, got ${assetCount}`);
  assert(gallery.includes('human-review proof surface only'), 'gallery must state human-review boundary');
  assert(gallery.includes('derived_non_official_must_be_labelled'), 'gallery must preserve derived/non-official boundary');
}

function validateDisposition(disposition, dispositionMd) {
  assert(disposition.sprint_id === SPRINT, 'disposition sprint mismatch');
  assert(disposition.status === 'all_19_op_rows_have_exact_disposition_no_runtime_mutation', 'disposition status mismatch');
  assertAuthority(disposition.authority_claims, 'disposition');
  assertSameMembers(disposition.records.map((record) => record.target_owner_candidate_id), EXPECTED.map((spec) => spec.owner), 'disposition owners');
  let count = 0;
  const records = byId(disposition.records, 'record_id');
  for (const spec of EXPECTED) {
    const record = records.get(spec.record_id);
    assert(record, `disposition missing ${spec.record_id}`);
    assert(record.target_owner_candidate_id === spec.owner, `${spec.record_id} disposition owner mismatch`);
    assert(record.status_after_human_merge === 'op_row_disposition_ready_for_lesson_design', `${spec.record_id} disposition status mismatch`);
    assertSameMembers(record.disposition_cases.map((item) => item.op_row), spec.op_rows, `${spec.record_id} OP rows`);
    for (const item of record.disposition_cases) {
      count += 1;
      assert(ALLOWED_OUTCOMES.has(item.exact_outcome), `${item.proof_case_id} invalid outcome ${item.exact_outcome}`);
      assert(item.rationale, `${item.proof_case_id} rationale missing`);
      assert(asArray(item.task_families).length > 0, `${item.proof_case_id} task families missing`);
      assert(asArray(item.answer_contract_forms).length > 0, `${item.proof_case_id} answer contracts missing`);
      assert(item.blocks, `${item.proof_case_id} blocks missing`);
      assert(item.does_not_block, `${item.proof_case_id} does_not_block missing`);
      assert(item.proof_required_to_close, `${item.proof_case_id} proof_required_to_close missing`);
      assert(dispositionMd.includes(item.exact_outcome), `disposition markdown missing ${item.exact_outcome}`);
    }
  }
  assert(count === 19, `expected 19 dispositions, got ${count}`);
  assert(disposition.summary.existing_governed_support_sufficient === 1, 'expected one sufficient support case');
  assert(disposition.summary.new_task_family_runtime_support_required === 4, 'expected four runtime-support cases');
  assert(disposition.summary.new_answer_skill_record_required === 7, 'expected seven answer-skill cases');
  assert(disposition.summary.existing_support_requires_extension === 7, 'expected seven extension cases');
}

function validateHandoffs(handoffs, handoffMd) {
  assert(handoffs.sprint_id === SPRINT, 'handoff sprint mismatch');
  assert(handoffs.status === 'generator_handoff_ready_for_review_no_lesson_output', 'handoff status mismatch');
  assertAuthority(handoffs.authority_claims, 'handoffs');
  assertSameMembers(handoffs.records.map((record) => record.target_owner_candidate_id), EXPECTED.map((spec) => spec.owner), 'handoff owners');
  for (const record of handoffs.records) {
    assert(record.approved_target_and_prerequisites?.lesson_goal, `${record.record_id} lesson goal missing`);
    assert(asArray(record.canonical_source_assets).length > 0, `${record.record_id} source assets missing`);
    assert(asArray(record.operation_and_answer_form_chain).length > 0, `${record.record_id} answer chain missing`);
    assert(asArray(record.task_family_requirements).length > 0, `${record.record_id} task requirements missing`);
    assert(record.short_check_boundary, `${record.record_id} short-check boundary missing`);
    assert(asArray(record.target_equivalent_exit_ticket_requirements).length > 0, `${record.record_id} exit-ticket requirements missing`);
    assert(asArray(record.answer_model_and_point_logic).length > 0, `${record.record_id} point logic missing`);
    assert(record.authority_boundary.includes('no_lesson_generation'), `${record.record_id} authority boundary mismatch`);
    assert(handoffMd.includes(record.target_owner_candidate_id), `handoff markdown missing ${record.target_owner_candidate_id}`);
  }
}

function validateReadiness(readiness, readinessMd) {
  assert(readiness.sprint_id === SPRINT, 'readiness sprint mismatch');
  assert(readiness.status === 'foundation_ready_for_lesson_design_after_human_merge_with_production_blockers_listed', 'readiness status mismatch');
  assert(readiness.conclusion === 'CONCISE BLOCKER LIST', 'readiness conclusion must be blocker list');
  assertAuthority(readiness.authority_claims, 'readiness');
  assert(asArray(readiness.records).length === 4, 'readiness must include four records');
  assert(asArray(readiness.exact_merge_order).length === 4, 'readiness merge order must have four steps');
  assert(asArray(readiness.blocker_list).length === 19, 'readiness must carry 18 OP blockers plus exit-ticket blocker');
  for (const item of readiness.core_requirement_checklist) {
    assert(['met', 'pending_remote_pr'].includes(item.status), `invalid checklist status ${item.status}`);
  }
  const pending = readiness.core_requirement_checklist.filter((item) => item.status === 'pending_remote_pr');
  assert(pending.length === 1 && pending[0].requirement === 'Exact-head PR proof', 'only exact-head PR proof may be pending');
  for (const item of readiness.blocker_list) {
    assert(['proof_required_to_close', 'scale_blocker'].includes(item.classification), `${item.id} invalid classification`);
    assert(item.blocks && item.does_not_block && item.proof_required_to_close, `${item.id} REV-STD-1 fields incomplete`);
  }
  for (const needle of ['Product End-State And Original Specs', 'Non-Negotiable Requirements', 'Core-Requirement Checklist', 'Exact Merge Order']) {
    assert(readinessMd.includes(needle), `readiness markdown missing ${needle}`);
  }
}

function validatePacket(packet, packetMd) {
  assert(packet.packet_id === SPRINT, 'packet id mismatch');
  assert(packet.pr_throughput_class === 'high_authority', 'packet throughput class mismatch');
  assert(packet.authority_class === 'protected_reference', 'packet authority class mismatch');
  assert(packet.review_autonomy?.level === 'L4', 'packet review level must be L4');
  assert(packet.human_decision_required === true, 'packet must require human review');
  assert(packet.auto_merge_allowed_after_ci === false, 'packet must forbid auto merge');
  assert(packet.decision?.route === 'READY_FOR_HUMAN_REVIEW', 'packet route mismatch');
  assert(packet.single_account_pr_governance_pilot?.branch_protection_ok_required === true, 'packet must require branch protection ok:true');
  const pilot = packet.single_account_pr_governance_pilot?.pilot_data_record;
  assert(pilot?.router_route_vs_retrospective_human_judgment?.router_route, 'packet pilot data must record router route');
  assert(pilot?.router_route_vs_retrospective_human_judgment?.retrospective_human_judgment, 'packet pilot data must record retrospective human judgment');
  assert(pilot?.lead_review_sufficient, 'packet pilot data must record lead-review sufficiency');
  assert(typeof pilot?.unnecessary_human_escalation === 'boolean', 'packet pilot data must record unnecessary human escalation');
  assert(Array.isArray(pilot?.stale_head_or_incomplete_evidence_failures), 'packet pilot data must record stale-head/incomplete-evidence failures');
  assert(pilot?.queueing_behavior_for_close_together_authorized_prs, 'packet pilot data must record queueing behavior');
  assert(pilot?.repeated_main_advancement_behavior, 'packet pilot data must record repeated-main-advancement behavior');
  assert(pilot?.overlap_or_deterministic_refresh_dead_end, 'packet pilot data must record overlap or refresh dead end behavior');
  assertAuthority(packet.authority_claims, 'packet');
  for (const file of [
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
  ]) {
    assert(packet.changed_paths.includes(file), `packet changed_paths missing ${file}`);
    exists(file);
  }
  assert(packet.implementation_summary?.target_families === 4, 'packet target count mismatch');
  assert(packet.implementation_summary?.canonical_assets === 10, 'packet asset count mismatch');
  assert(packet.implementation_summary?.op_row_dispositions === 19, 'packet disposition count mismatch');
  assert(packet.implementation_summary?.generator_handoff_manifests === 4, 'packet handoff count mismatch');
  assert(packet.proof.local_checkers.some((item) => item.command.includes('check-y2-source-reconstruction-and-mtu-proof-1.js')), 'packet proof must include source-reconstruction checker');
  assert(packet.proof.local_checkers.some((item) => item.command.includes('check-y2-target-registry-and-task-foundation-implementation-1.js')), 'packet proof must include target-foundation checker');
  assert(packetMd.includes('ok: true'), 'packet markdown must mention branch protection ok:true');
  for (const needle of ['Product End-State And Original Specs', 'Non-Negotiable Requirements', 'Core-Requirement Checklist', 'Pilot Data Record', 'blocks', 'does_not_block', 'proof_required_to_close']) {
    assert(packetMd.includes(needle), `packet markdown missing ${needle}`);
  }
}

function validateEconomicsRepair(assets, handoffs) {
  const b7Assets = assets.records.find((record) => record.record_id === 'Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1');
  const b7Table = b7Assets.assets.find((asset) => asset.asset_id === 'tabel-1-financiele-gegevens-digibate');
  assert(b7Table.source_derived_values_or_geometry.calculation_trace.expected_damage_eur === 80000, 'Book 7 expected damage must be EUR 80,000');
  assert(b7Table.source_derived_values_or_geometry.calculation_trace.total_premium_eur === 96000, 'Book 7 total premium must be EUR 96,000');

  const b7Handoff = handoffs.records.find((record) => record.record_id === 'Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1');
  const b7Text = JSON.stringify(b7Handoff);
  assert(b7Text.includes('credit insurer is the principal'), 'Book 7 handoff must name credit insurer as principal');
  assert(b7Text.includes('buying company is the agent'), 'Book 7 handoff must name buying company as agent');
  assert(!b7Text.includes('Supplier and insurer have different incentives'), 'Book 7 handoff must not retain stale supplier/insurer principal-agent answer');
  assert(!b7Text.includes('86400') && !b7Text.includes('72000'), 'Book 7 handoff must not retain stale 72,000/86,400 premium values');
}

function validateMarkdown() {
  for (const [file, needles] of [
    [PLAN_MD, ['Goal', 'Non-Negotiable Requirements', 'Verification Plan', 'READY_FOR_HUMAN_REVIEW']],
    [RESULT_MD, ['Summary', 'Authority Boundary', 'Next Action']],
    [DISPOSITION_MD, ['Core-Requirement Checklist', 'Every OP row covered', 'no MTU mutation']],
    [HANDOFF_MD, ['Generator Handoff Manifests', 'Remaining blockers']],
  ]) {
    const text = read(file);
    for (const needle of needles) assert(text.includes(needle), `${file} missing ${needle}`);
  }
}

function main() {
  [
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
  ].forEach(exists);

  const assets = readJson(CANONICAL_ASSETS);
  const readiness = readJson(READINESS_JSON);
  const handoffs = readJson(HANDOFF_JSON);
  const disposition = readJson(DISPOSITION_JSON);
  const packet = readJson(REVIEW_PACKET_JSON);

  validateCanonicalAssets(assets, read(ASSET_GALLERY_HTML));
  validateDisposition(disposition, read(DISPOSITION_MD));
  validateHandoffs(handoffs, read(HANDOFF_MD));
  validateReadiness(readiness, read(READINESS_MD));
  validatePacket(packet, read(REVIEW_PACKET_MD));
  validateEconomicsRepair(assets, handoffs);
  validateMarkdown();

  if (!process.exitCode) {
    console.log(`OK ${SPRINT}: production-readiness bundle validated`);
  }
}

if (require.main === module) main();
