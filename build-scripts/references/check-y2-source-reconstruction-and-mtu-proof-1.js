#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SPRINT = 'Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1';
const PRIOR_SPRINT = 'Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1';
const GATE_DIR = `reports/review-gates/${SPRINT}`;
const CANDIDATES = 'references/authored/year2-v6-target-foundation-candidates.json';
const SOURCE_FOUNDATION = 'references/data/year2-target-foundation/source-reconstruction-foundation.json';
const ANSWER_CONTRACTS = 'references/data/year2-target-foundation/answer-contracts.json';
const PRIOR_MTU_REVIEW = `reports/reference-planning/${PRIOR_SPRINT}-mtu-task-family-review.json`;
const SOURCE_HTML = `${GATE_DIR}/source-reconstruction-gallery.html`;
const SOURCE_JSON = `${GATE_DIR}/source-reconstruction-proof.json`;
const SOURCE_MD = `${GATE_DIR}/source-reconstruction-proof.md`;
const MTU_JSON = `${GATE_DIR}/mtu-task-family-governed-proof.json`;
const MTU_MD = `${GATE_DIR}/mtu-task-family-governed-proof.md`;
const PACKET_JSON = `${GATE_DIR}/review-packet.json`;
const PACKET_MD = `reports/reference-planning/${SPRINT}-review-packet.md`;
const PLAN_MD = `reports/sprints/${SPRINT}-plan.md`;
const RESULT_MD = `reports/sprints/${SPRINT}-result.md`;

const EXPECTED = [
  {
    id: 'Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1',
    owner: 'Y2-B5-P13',
    source: 'vw-1022-a-25-2-o:q7-q11',
    anchor: 'book5',
    opRows: ['OP-T1', 'OP-H1', 'OP-ANS2', 'OP-ANS3'],
    artifacts: ['figuur-1-pensioenmodel-2024-2044', 'pensioenmodel-assumptions-a-f'],
    htmlNeedles: [
      'Figuur 1 Pensioenmodel econoom',
      'premies in % van pensioenvermogen',
      'pensioenvermogen als % van bbp',
      'annual inflation = 2%',
      'annual real economic growth = 0.5%',
    ],
  },
  {
    id: 'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1',
    owner: 'Y2-B6-P12',
    source: 'vw-1022-a-23-2-o:q26-q29',
    anchor: 'book6',
    opRows: ['OP-P1', 'OP-D1', 'OP-C1', 'OP-C2', 'OP-F1', 'OP-E1', 'OP-ANS2', 'OP-ANS3'],
    artifacts: [
      'tabel-1-vastwonen-financial-data',
      'tabel-2-particuliere-huurwoningen-reder',
      'q28-housing-investor-context',
    ],
    htmlNeedles: ['EUR 850', '6.800 woningen', 'TK = 450Q + 1.400.000', 'GO = -0.125Q + 2.150', '+0.4'],
  },
  {
    id: 'Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1',
    owner: 'Y2-B7-P13',
    source: 'vw-1022-a-23-1-o:q12-q15',
    anchor: 'book7',
    opRows: ['OP-R1', 'OP-M1', 'OP-ANS2', 'OP-ANS3'],
    artifacts: ['figuur-1-kredietverzekering-en-voorwaarden', 'tabel-1-financiele-gegevens-digibate'],
    htmlNeedles: [
      'vw-1022-a-23-1-o.pdf#page=6',
      '90% indemnity',
      'EUR 80.000',
      'EUR 96.000',
      'bonus-malus',
    ],
  },
  {
    id: 'Y2-B8-Q15-Q16-STRATEGIC-TARGET-1',
    owner: 'Y2-B8-P04',
    source: 'vw-1022-a-25-1-o:q15-q16',
    anchor: 'book8',
    opRows: ['OP-S1', 'OP-ANS1', 'OP-ANS3'],
    artifacts: [
      'ijssalon-guarda-orso-bianco-context',
      'lowest-price-guarantee-self-binding-source',
      'derived-payoff-representation',
    ],
    htmlNeedles: ['perfect substitutes', 'lowest-price guarantee', '25% discount', 'derived, non-official'],
  },
];

const ALLOWED_TRUE_AUTHORITY = new Set([
  'rendered_source_reconstruction_ready_for_review',
  'governed_mtu_task_family_proof_ready_for_review',
  'source_foundation_locator_repair_ready_for_review',
]);

const ALLOWED_CHECKLIST_STATUS = new Set(['met', 'pending_remote_pr']);
const ALLOWED_FINDINGS = new Set(['core_requirement_met', 'proof_required_to_close', 'scale_blocker']);

function fail(message) {
  console.error(`ERROR ${SPRINT}: ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function normalize(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^\.\//, '');
}

function relPath(file) {
  return path.join(ROOT, file);
}

function exists(file) {
  assert(fs.existsSync(relPath(file)), `missing required file: ${file}`);
}

function read(file) {
  exists(file);
  return fs.readFileSync(relPath(file), 'utf8');
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

function byId(items, key) {
  return new Map(asArray(items).map((item) => [item[key], item]));
}

function assertAllAuthorityFalseExcept(claims, label) {
  assert(claims && typeof claims === 'object', `${label} missing`);
  for (const [key, value] of Object.entries(claims)) {
    if (ALLOWED_TRUE_AUTHORITY.has(key)) {
      assert(value === true, `${label}.${key} must be true`);
    } else {
      assert(value === false, `${label}.${key} must be false`);
    }
  }
}

function validateSourceFoundation(foundation) {
  assert(foundation.sprint_id === PRIOR_SPRINT, 'source foundation must retain prior sprint id');
  assert(foundation.status === 'foundation_ready_not_rendered', 'source foundation status must remain foundation_ready_not_rendered');
  const records = byId(foundation.records, 'record_id');
  for (const spec of EXPECTED) {
    const record = records.get(spec.id);
    assert(record, `source foundation missing ${spec.id}`);
    assert(record.source_family === spec.source, `${spec.id} source family mismatch`);
    const artifactIds = asArray(record.required_artifacts).map((artifact) => artifact.artifact_id);
    assertSameMembers(artifactIds, spec.artifacts, `${spec.id} foundation artifact ids`);
    for (const artifact of record.required_artifacts) {
      assert(artifact.official_locator, `${spec.id}.${artifact.artifact_id} official locator missing`);
    }
  }
  const book7 = records.get('Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1');
  const figure = book7.required_artifacts.find((artifact) => artifact.artifact_id === 'figuur-1-kredietverzekering-en-voorwaarden');
  const table = book7.required_artifacts.find((artifact) => artifact.artifact_id === 'tabel-1-financiele-gegevens-digibate');
  assert(figure.official_locator === 'references/external/exams/vw-1022-a-23-1-o.pdf#page=6', 'Book 7 actor-arrow figure locator must be page 6');
  assert(table.official_locator === 'references/external/exams/vw-1022-a-23-1-o.pdf#page=7', 'Book 7 Digibate table locator must remain page 7');
}

function validateSourceProof(sourceProof, foundation, galleryHtml) {
  assert(sourceProof.sprint_id === SPRINT, 'source proof sprint mismatch');
  assert(sourceProof.prior_sprint_id === PRIOR_SPRINT, 'source proof prior sprint mismatch');
  assert(sourceProof.status === 'rendered_review_ready_pending_human_closure', 'source proof status mismatch');
  assert(sourceProof.authority_boundary.includes('no_external_mutation'), 'source proof must not authorize external mutation');
  assert(normalize(sourceProof.rendered_surface) === SOURCE_HTML, 'source proof rendered surface mismatch');
  assertSameMembers(sourceProof.records.map((record) => record.record_id), EXPECTED.map((spec) => spec.id), 'source proof records');
  assertAllAuthorityFalseExcept(sourceProof.authority_claims, 'source proof authority_claims');

  const foundationRecords = byId(foundation.records, 'record_id');
  const sourceRecords = byId(sourceProof.records, 'record_id');
  for (const spec of EXPECTED) {
    const record = sourceRecords.get(spec.id);
    const foundationRecord = foundationRecords.get(spec.id);
    assert(record.target_owner_candidate_id === spec.owner, `${spec.id} owner mismatch`);
    assert(record.source_family === spec.source, `${spec.id} source mismatch`);
    assert(record.rendered_surface === `${SOURCE_HTML}#${spec.anchor}`, `${spec.id} rendered anchor mismatch`);
    assert(record.anti_substitution_checked === true, `${spec.id} anti substitution must be checked`);
    assert(record.proof_status === 'rendered_review_ready_pending_human_acceptance', `${spec.id} source proof status mismatch`);
    assertSameMembers(record.rendered_artifact_ids, spec.artifacts, `${spec.id} rendered artifact ids`);
    assert(record.render_blocker_disposition?.closure_status === 'proof_ready_pending_human_review_on_exact_remote_head', `${spec.id} closure status mismatch`);
    assert(record.render_blocker_disposition?.prior_blocker?.blocks, `${spec.id} prior blocker must carry blocks`);
    assert(record.render_blocker_disposition?.prior_blocker?.does_not_block, `${spec.id} prior blocker must carry does_not_block`);
    assert(record.render_blocker_disposition?.prior_blocker?.proof_required_to_close, `${spec.id} prior blocker must carry proof_required_to_close`);

    const foundationArtifactIds = foundationRecord.required_artifacts.map((artifact) => artifact.artifact_id);
    assertSameMembers(record.artifacts.map((artifact) => artifact.artifact_id), foundationArtifactIds, `${spec.id} proof artifacts`);
    for (const artifact of record.artifacts) {
      assert(artifact.official_locator, `${spec.id}.${artifact.artifact_id} locator missing`);
      assert(artifact.render_note, `${spec.id}.${artifact.artifact_id} render_note missing`);
      if (artifact.artifact_id === 'derived-payoff-representation') {
        assert(/derived, non-official/i.test(galleryHtml), 'Book 8 derived representation must be visibly labelled non-official');
        assert(/derived, non-official/i.test(artifact.render_note), 'Book 8 derived render_note must say derived, non-official');
      }
    }

    assert(galleryHtml.includes(`id="${spec.anchor}"`), `gallery missing anchor ${spec.anchor}`);
    assert(galleryHtml.includes(`record ${spec.id}`), `gallery missing record id ${spec.id}`);
    assert(galleryHtml.includes(`owner ${spec.owner}`), `gallery missing owner ${spec.owner}`);
    for (const needle of spec.htmlNeedles) {
      assert(galleryHtml.includes(needle), `gallery missing ${needle}`);
    }
  }
  assert(galleryHtml.includes('This gallery is proof for human review'), 'gallery must state human-review boundary');
  assert(!/student\/product use is authorized/i.test(galleryHtml), 'gallery must not authorize student/product use');
}

function validateMtuProof(mtuProof, surface, answerContracts, priorMtuReview, sourceProof) {
  assert(mtuProof.sprint_id === SPRINT, 'MTU proof sprint mismatch');
  assert(mtuProof.prior_sprint_id === PRIOR_SPRINT, 'MTU proof prior sprint mismatch');
  assert(mtuProof.status === 'governed_task_family_proof_ready_pending_human_closure_no_mtu_mutation', 'MTU proof status mismatch');
  assert(mtuProof.authority_boundary.includes('no_mtu_mutation'), 'MTU proof boundary must forbid MTU mutation');
  assertAllAuthorityFalseExcept(mtuProof.authority_claims, 'MTU proof authority_claims');
  assertSameMembers(mtuProof.records.map((record) => record.record_id), EXPECTED.map((spec) => spec.id), 'MTU proof records');
  assert(mtuProof.closure_effect?.prior_flags_addressed_when_human_review_accepts_reviewed_payload?.includes('Y2TRTF-005'), 'MTU proof must address prior MTU flag pending human acceptance');
  assert(mtuProof.closure_effect?.prior_flags_addressed_when_human_review_accepts_reviewed_payload?.includes('Y2TRTF-006'), 'MTU proof must address prior source flag pending human acceptance');

  const surfaceRecords = byId(surface.records, 'id');
  const answerRecords = byId(answerContracts.records, 'record_id');
  const priorRecords = byId(priorMtuReview.records, 'record_id');
  const sourceRecords = byId(sourceProof.records, 'record_id');
  let proofCaseCount = 0;

  for (const spec of EXPECTED) {
    const proof = mtuProof.records.find((record) => record.record_id === spec.id);
    const candidate = surfaceRecords.get(spec.id);
    const answer = answerRecords.get(spec.id);
    const prior = priorRecords.get(spec.id);
    const source = sourceRecords.get(spec.id);
    assert(proof.target_owner_candidate_id === spec.owner, `${spec.id} MTU owner mismatch`);
    assertSameMembers(proof.op_rows_expected, spec.opRows, `${spec.id} expected OP rows`);
    assertSameMembers(candidate.op_rows, spec.opRows, `${spec.id} candidate OP rows`);
    assertSameMembers(proof.source_artifact_ids, spec.artifacts, `${spec.id} MTU source artifacts`);
    assertSameMembers(proof.source_artifact_ids, source.rendered_artifact_ids, `${spec.id} source artifact link`);
    assertSameMembers(proof.answer_contract_subquestions, answer.answer_contracts.map((item) => item.subquestion), `${spec.id} answer contract labels`);
    assertSameMembers(proof.proof_cases.map((item) => item.op_row), spec.opRows, `${spec.id} proof case OP rows`);
    assert(proof.protected_mtu_change_plan?.closure_status === 'governed_proof_surface_created_pending_human_review_no_mtu_write', `${spec.id} protected MTU plan closure status mismatch`);
    proofCaseCount += proof.proof_cases.length;

    const priorRows = byId(prior.complete_op_row_family_union, 'op_row');
    for (const proofCase of proof.proof_cases) {
      const priorRow = priorRows.get(proofCase.op_row);
      assert(priorRow, `${proofCase.proof_case_id} missing prior MTU row`);
      assertSameMembers(proofCase.task_families, priorRow.families, `${proofCase.proof_case_id} task families`);
      assert(proofCase.proof_case_id === `${spec.id}:${proofCase.op_row}`, `${spec.id}.${proofCase.op_row} proof_case_id mismatch`);
      assert(proofCase.mutation_status === 'not_mutated_review_proof_only', `${proofCase.proof_case_id} mutation status mismatch`);
      assert(asArray(proofCase.source_artifact_ids).length > 0, `${proofCase.proof_case_id} source artifacts missing`);
      assert(asArray(proofCase.answer_contracts).length > 0, `${proofCase.proof_case_id} answer contracts missing`);
      for (const contract of proofCase.answer_contracts) {
        assert(contract.answer_form && contract.point_logic && contract.short_answer_model, `${proofCase.proof_case_id} answer contract incomplete`);
      }
    }
  }
  assert(proofCaseCount === 19, `expected 19 OP-row proof cases, got ${proofCaseCount}`);
  for (const finding of asArray(mtuProof.global_findings)) {
    assert(ALLOWED_FINDINGS.has(finding.classification), `invalid MTU finding classification ${finding.classification}`);
    assert(asArray(finding.blocks).length > 0, `${finding.id} blocks missing`);
    assert(asArray(finding.does_not_block).length > 0, `${finding.id} does_not_block missing`);
    assert(finding.proof_required_to_close, `${finding.id} proof_required_to_close missing`);
  }
}

function validatePacket(packet, packetMd) {
  assert(packet.packet_id === SPRINT, 'packet id mismatch');
  assert(packet.pr_throughput_class === 'high_authority', 'packet throughput class mismatch');
  assert(packet.authority_class === 'protected_reference', 'packet authority class mismatch');
  assert(packet.review_autonomy?.level === 'L4', 'packet must be L4');
  assert(packet.human_decision_required === true, 'packet must require human decision');
  assert(packet.auto_merge_allowed_after_ci === false, 'packet must not allow auto merge');
  assert(packet.decision?.route === 'READY_FOR_HUMAN_REVIEW', 'packet route must be READY_FOR_HUMAN_REVIEW');
  assert(packet.decision?.mark_ready_allowed === false, 'packet must not mark ready before remote proof');
  assert(packet.decision?.merge_allowed === false, 'packet must not allow merge before authorization');
  assert(packet.single_account_pr_governance_pilot?.pilot_status === 'pending_remote_pr', 'pilot must be pending remote PR before publication');
  assert(packet.single_account_pr_governance_pilot?.branch_protection_ok_required === true, 'pilot must require branch protection ok:true');
  assertAllAuthorityFalseExcept(packet.authority_claims, 'packet authority_claims');

  for (const required of [
    '../4veco-lessen/specifications/product-end-state.md',
    'references/owned/course-blueprint-v6-three-year.md',
    SOURCE_FOUNDATION,
    ANSWER_CONTRACTS,
    PRIOR_MTU_REVIEW,
  ]) {
    assert(JSON.stringify(packet).includes(required), `packet missing required reference ${required}`);
  }

  const changedPaths = asArray(packet.changed_paths).map(normalize);
  for (const file of [
    'build-scripts/references/build-y2-source-reconstruction-and-mtu-proof-1.js',
    'build-scripts/references/check-y2-source-reconstruction-and-mtu-proof-1.js',
    SOURCE_FOUNDATION,
    SOURCE_HTML,
    SOURCE_JSON,
    SOURCE_MD,
    MTU_JSON,
    MTU_MD,
    PACKET_JSON,
    PACKET_MD,
    PLAN_MD,
    RESULT_MD,
  ]) {
    assert(changedPaths.includes(file), `packet changed_paths missing ${file}`);
    exists(file);
  }
  for (const item of packet.core_requirement_checklist || []) {
    assert(ALLOWED_CHECKLIST_STATUS.has(item.status), `invalid checklist status ${item.requirement}: ${item.status}`);
  }
  const pending = packet.core_requirement_checklist.filter((item) => item.status === 'pending_remote_pr');
  assert(pending.length === 1 && pending[0].requirement === 'Current-head PR proof', 'only current-head PR proof may be pending before draft PR');

  for (const flag of asArray(packet.carried_flags)) {
    assert(ALLOWED_FINDINGS.has(flag.classification), `invalid carried flag classification ${flag.classification}`);
    assert(asArray(flag.blocks).length > 0, `${flag.id} blocks missing`);
    assert(asArray(flag.does_not_block).length > 0, `${flag.id} does_not_block missing`);
    assert(flag.proof_required_to_close, `${flag.id} proof_required_to_close missing`);
  }
  assert(packet.implementation_summary?.source_records === 4, 'packet source record count mismatch');
  assert(packet.implementation_summary?.mtu_records === 4, 'packet MTU record count mismatch');
  assert(packet.implementation_summary?.proof_cases === 19, 'packet proof case count mismatch');
  assert(packet.proof?.local_checkers?.some((item) => item.command === 'node build-scripts/references/check-y2-source-reconstruction-and-mtu-proof-1.js'), 'packet missing custom checker proof');
  assert(packet.proof?.local_checkers?.some((item) => item.command === `npm.cmd run check:review-throughput -- ${PACKET_JSON}`), 'packet missing review-throughput proof');

  for (const needle of [
    'Product End-State And Original Specs',
    'Non-Negotiable Requirements',
    'Core-Requirement Checklist',
    'blocks',
    'does_not_block',
    'proof_required_to_close',
    'READY_FOR_HUMAN_REVIEW',
    'ok: true',
  ]) {
    assert(packetMd.includes(needle), `packet markdown missing ${needle}`);
  }
}

function validateMarkdownFiles() {
  for (const [file, needles] of [
    [SOURCE_MD, ['Product End-State And Original Specs', 'Non-Negotiable Requirements', 'Findings', 'proof_required_to_close']],
    [MTU_MD, ['Core-Requirement Checklist', 'Every OP row covered', 'scale_blocker', 'no MTU mutation']],
    [PLAN_MD, ['Goal', 'Non-Negotiable Requirements', 'Verification Plan', 'READY_FOR_HUMAN_REVIEW']],
    [RESULT_MD, ['Summary', 'Authority Boundary', 'Next Action', 'READY_FOR_HUMAN_REVIEW']],
  ]) {
    const text = read(file);
    for (const needle of needles) {
      assert(text.includes(needle), `${file} missing ${needle}`);
    }
  }
}

function main() {
  [
    CANDIDATES,
    SOURCE_FOUNDATION,
    ANSWER_CONTRACTS,
    PRIOR_MTU_REVIEW,
    SOURCE_HTML,
    SOURCE_JSON,
    SOURCE_MD,
    MTU_JSON,
    MTU_MD,
    PACKET_JSON,
    PACKET_MD,
    PLAN_MD,
    RESULT_MD,
  ].forEach(exists);

  const surface = readJson(CANDIDATES);
  const foundation = readJson(SOURCE_FOUNDATION);
  const answerContracts = readJson(ANSWER_CONTRACTS);
  const priorMtuReview = readJson(PRIOR_MTU_REVIEW);
  const sourceProof = readJson(SOURCE_JSON);
  const mtuProof = readJson(MTU_JSON);
  const packet = readJson(PACKET_JSON);
  const galleryHtml = read(SOURCE_HTML);
  const packetMd = read(PACKET_MD);

  validateSourceFoundation(foundation);
  validateSourceProof(sourceProof, foundation, galleryHtml);
  validateMtuProof(mtuProof, surface, answerContracts, priorMtuReview, sourceProof);
  validatePacket(packet, packetMd);
  validateMarkdownFiles();

  if (!process.exitCode) {
    console.log(`OK ${SPRINT}: rendered source reconstruction and governed MTU/task-family proof validated`);
  }
}

if (require.main === module) main();
