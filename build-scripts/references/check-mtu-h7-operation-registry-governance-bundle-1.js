#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H7-OPERATION-REGISTRY-GOVERNANCE-AND-HOLDOUT-ADJUDICATION-BUNDLE-1';
const GATE_ID = 'GATE-MTU-H7-operation-registry-governance-and-holdout-adjudication-bundle-1';

const BUNDLE_JSON = 'reports/mtu-hardening/mtu-h7-operation-registry-governance-bundle-1.json';
const PUBLICATION_JSON = 'reports/mtu-hardening/mtu-h7-current-main-publication-closure-1.json';
const BLOCKER_JSON = 'reports/mtu-hardening/mtu-h7-operation-blocker-matrix-1.json';
const EVIDENCE_JSON = 'reports/mtu-hardening/mtu-h7-official-evidence-matrix-1.json';
const DECISIONS_JSON = 'reports/mtu-hardening/mtu-h7-reviewed-equivalent-decisions-1.json';
const CANDIDATES_JSON = 'reports/mtu-hardening/mtu-h7-governance-candidate-packets-1.json';
const Q5_JSON = 'reports/mtu-hardening/mtu-h7-holdout-q5-graph-adjudication-1.json';
const QUALITY_MD = 'reports/mtu-hardening/mtu-h7-governance-quality-log-1.md';
const GATE_JSON = `reports/review-gates/${GATE_ID}/review-packet.json`;
const GATE_MD = `reports/review-gates/${GATE_ID}/review-packet.md`;
const GATE_URLS = `reports/review-gates/${GATE_ID}/bundle-urls.md`;
const LEAD_REVIEW_MD = `reports/review-gates/${GATE_ID}/lead-review.md`;
const LEAD_REVIEW_TEMPLATE_MD = `reports/review-gates/${GATE_ID}/lead-review-template.md`;

const REQUIRED_RECORD_IDS = [
  'ha-1022-a-23-2-o:opgave-3:question-15',
  'ha-1022-a-24-1-o:opgave-2:question-12',
  'vw-1022-a-23-2-o:opgave-4:question-20',
  'vw-1022-a-24-1-o:opgave-3:question-17',
  'vw-1022-a-24-2-o:opgave-3:question-15',
  'vw-1022-a-25-2-o:opgave-1:question-4',
  'vw-1022-a-25-2-o:opgave-1:question-5'
];

const REQUIRED_OPERATION_IDS = [
  'h7-ha23-2-q15-net-ratio-nivellering',
  'h7-ha24-1-q12-snel-residual-payoff',
  'h7-ha24-1-q12-sprinter-margin-payoff',
  'h7-vw23-2-q20-game-tree-nash',
  'h7-vw24-1-q17-insurance-cost-benefit',
  'h7-vw24-2-q15-ga-mb-first-adjustment',
  'h7-vw24-2-q15-ga-mb-second-adjustment-and-table',
  'h7-vw25-2-q4-go-line-with-consumer-subsidy',
  'h7-vw25-2-q4-mo-line-with-consumer-subsidy',
  'h7-vw25-2-q5-total-subsidy-shading'
];

const REQUIRED_CANDIDATES = [
  'H7-CAND-CANONICAL-NIVELLERING-POSITIVE-COUNTERPART',
  'H7-CAND-OP-ULTIMATUM-RESIDUAL-PAYOFF',
  'H7-CAND-OP-ULTIMATUM-MARGIN-PAYOFF',
  'H7-CAND-OP-GAME-TREE-NASH-BACKWARD-COMPARISON',
  'H7-CAND-OP-FIXED-VARIABLE-CURRENCY-INSURANCE-COST-BENEFIT',
  'H7-CAND-OP-MULTIPERIOD-IS-MB-GA-SEQUENCE',
  'H7-CAND-ANSWER-FORM-GO-MO-SUBSIDY-LINE-DRAWING',
  'H7-CAND-GRAPH-TOTAL-SUBSIDY-SHADING-MULTI-ACCEPTED'
];

function repoPath(relativePath) {
  return path.join(ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), 'utf8'));
}

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), 'utf8');
}

function sha256File(relativePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(repoPath(relativePath))).digest('hex');
}

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function evidenceExists(ref) {
  if (typeof ref !== 'string' || ref.length === 0) return false;
  if (/^https?:\/\//.test(ref)) return true;
  return fs.existsSync(repoPath(ref.split('#')[0]));
}

function validate() {
  const failures = [];
  const requiredFiles = [
    BUNDLE_JSON,
    PUBLICATION_JSON,
    BLOCKER_JSON,
    EVIDENCE_JSON,
    DECISIONS_JSON,
    CANDIDATES_JSON,
    Q5_JSON,
    QUALITY_MD,
    GATE_JSON,
    GATE_MD,
    GATE_URLS,
    LEAD_REVIEW_MD,
    LEAD_REVIEW_TEMPLATE_MD
  ];
  for (const file of requiredFiles) {
    if (!fs.existsSync(repoPath(file))) failures.push(`missing artifact: ${file}`);
  }
  if (failures.length) return { ok: false, failures, summary: {} };

  const bundle = readJson(BUNDLE_JSON);
  const publication = readJson(PUBLICATION_JSON);
  const blocker = readJson(BLOCKER_JSON);
  const evidence = readJson(EVIDENCE_JSON);
  const decisions = readJson(DECISIONS_JSON);
  const candidates = readJson(CANDIDATES_JSON);
  const q5 = readJson(Q5_JSON);
  const gate = readJson(GATE_JSON);
  const quality = readText(QUALITY_MD);
  const gateMd = readText(GATE_MD);
  const urls = readText(GATE_URLS);
  const leadReview = readText(LEAD_REVIEW_MD);
  const leadTemplate = readText(LEAD_REVIEW_TEMPLATE_MD);

  for (const [name, doc] of [
    ['bundle', bundle],
    ['publication', publication],
    ['blocker', blocker],
    ['evidence', evidence],
    ['decisions', decisions],
    ['candidates', candidates],
    ['q5', q5],
    ['gate', gate]
  ]) {
    if (doc.sprint_id !== SPRINT_ID) failures.push(`${name} sprint_id mismatch`);
    if (doc.review_standard !== 'REV-STD-1') failures.push(`${name} review_standard must be REV-STD-1`);
    if (!allFalse(doc.authority_flags)) failures.push(`${name} authority flags must all be false`);
  }

  if (gate.gate_id !== GATE_ID) failures.push('gate_id mismatch');
  if (gate.route !== 'READY_FOR_HUMAN_REVIEW') failures.push(`gate route must be READY_FOR_HUMAN_REVIEW, got ${gate.route}`);
  if (gate.lead_review_proof !== LEAD_REVIEW_MD) failures.push('gate lead_review_proof mismatch');
  if (bundle.status !== 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE') failures.push(`bundle status mismatch: ${bundle.status}`);
  if (JSON.stringify(gate).includes('seven of nine') || gateMd.toLowerCase().includes('seven of nine')) {
    failures.push('gate text must not say seven of nine review-required operations');
  }
  if (!asArray(gate.core_requirement_checklist).some((item) => item.requirement === 'All ten review-required operations carry explicit route, proof, and negative guard')) {
    failures.push('gate checklist must name all ten review-required operations');
  }
  if (publication.previous_h7_lead_reviewer_verdict !== 'HOLD_FOR_OPERATION_REGISTRY_GOVERNANCE') {
    failures.push('publication closure must preserve previous H7 governed hold');
  }

  const operationRows = asArray(blocker.operations);
  const recordRows = asArray(blocker.records);
  if (recordRows.length !== 7) failures.push(`expected 7 review-required records, got ${recordRows.length}`);
  if (operationRows.length !== 10) failures.push(`expected 10 review-required operations, got ${operationRows.length}`);
  for (const recordId of REQUIRED_RECORD_IDS) {
    if (!recordRows.some((row) => row.record_id === recordId)) failures.push(`missing review-required record: ${recordId}`);
  }
  for (const operationId of REQUIRED_OPERATION_IDS) {
    if (!operationRows.some((row) => row.operation_id === operationId)) failures.push(`missing review-required operation: ${operationId}`);
  }

  const operationRoutes = new Map(operationRows.map((row) => [row.operation_id, row.final_route]));
  for (const operationId of [
    'h7-ha23-2-q15-net-ratio-nivellering',
    'h7-ha24-1-q12-snel-residual-payoff',
    'h7-ha24-1-q12-sprinter-margin-payoff',
    'h7-vw23-2-q20-game-tree-nash',
    'h7-vw24-1-q17-insurance-cost-benefit',
    'h7-vw24-2-q15-ga-mb-first-adjustment',
    'h7-vw24-2-q15-ga-mb-second-adjustment-and-table'
  ]) {
    const route = operationRoutes.get(operationId);
    if (!['HOLD_FOR_CANONICAL_MTU_GOVERNANCE', 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE'].includes(route)) {
      failures.push(`operation must remain protected/canonical hold: ${operationId}`);
    }
  }
  for (const operationId of [
    'h7-vw25-2-q4-go-line-with-consumer-subsidy',
    'h7-vw25-2-q4-mo-line-with-consumer-subsidy'
  ]) {
    if (operationRoutes.get(operationId) !== 'READY_FOR_HUMAN_H7_CLOSURE_REVIEW') {
      failures.push(`q4 operation must be prepared only for human reviewed-equivalent review: ${operationId}`);
    }
  }
  if (operationRoutes.get('h7-vw25-2-q5-total-subsidy-shading') !== 'HOLD_FOR_GRAPH_SOURCE_GOVERNANCE') {
    failures.push('q5 operation must remain graph-source governed hold');
  }

  for (const row of operationRows) {
    if (!row.negative_regression_fixture?.fixture_id) failures.push(`missing negative fixture guard for ${row.operation_id}`);
    if (!row.needed_governance || !row.safe_interim_action) failures.push(`missing governance text for ${row.operation_id}`);
    for (const ref of asArray(row.official_evidence_refs)) {
      if (!evidenceExists(ref)) failures.push(`unresolved official evidence ref for ${row.operation_id}: ${ref}`);
    }
    for (const page of [...asArray(row.rendered_prompt_pages), ...asArray(row.rendered_correction_pages)]) {
      if (!evidenceExists(page.rendered_png_path)) failures.push(`missing rendered evidence for ${row.operation_id}: ${page.rendered_png_path}`);
    }
  }

  const candidateIds = asArray(candidates.candidates).map((candidate) => candidate.candidate_packet_id);
  for (const candidateId of REQUIRED_CANDIDATES) {
    if (!candidateIds.includes(candidateId)) failures.push(`missing governance candidate packet: ${candidateId}`);
  }
  for (const candidate of asArray(candidates.candidates)) {
    if (candidate.status !== 'governance_evidence_only_not_candidate_write') {
      failures.push(`candidate must be evidence-only: ${candidate.candidate_packet_id}`);
    }
    if (!allFalse(candidate.authority_flags)) failures.push(`candidate flags must all be false: ${candidate.candidate_packet_id}`);
  }

  if (asArray(decisions.decisions).some((decision) => decision.status === 'applied')) {
    failures.push('reviewed-equivalent decisions must not be applied by this packet');
  }
  if (!q5.official_answer_characterization?.some((line) => /two correct/i.test(line))) {
    failures.push('q5 adjudication must record two correct shaded examples');
  }
  if (!q5.official_answer_characterization?.some((line) => /0 or 2 score/i.test(line))) {
    failures.push('q5 adjudication must record 0-or-2 scoring boundary');
  }
  if (q5.record_id !== 'vw-1022-a-25-2-o:opgave-1:question-5') failures.push('q5 record mismatch');
  if (q5.operation_id !== 'h7-vw25-2-q5-total-subsidy-shading') failures.push('q5 operation mismatch');

  for (const entry of asArray(bundle.source_hashes)) {
    if (!entry.path || entry.sha256 !== sha256File(entry.path)) failures.push(`source hash mismatch: ${entry.path}`);
  }
  for (const file of [BUNDLE_JSON, PUBLICATION_JSON, BLOCKER_JSON, EVIDENCE_JSON, DECISIONS_JSON, CANDIDATES_JSON, Q5_JSON, QUALITY_MD, GATE_JSON, GATE_MD, LEAD_REVIEW_MD, LEAD_REVIEW_TEMPLATE_MD]) {
    if (!urls.includes(file)) failures.push(`bundle urls missing: ${file}`);
  }
  for (const requiredText of [
    'Review standard: REV-STD-1',
    'Lead verdict: `MORE_THAN_SATISFIED_FOR_HUMAN_REVIEW_NOT_CLOSURE`',
    'Teacher reviewer: `MORE_THAN_SATISFIED`',
    'Economist reviewer: `MORE_THAN_SATISFIED`',
    'Quality inspection reviewer: `MORE_THAN_SATISFIED`',
    'does not close H7'
  ]) {
    if (!leadReview.includes(requiredText)) failures.push(`lead review missing text: ${requiredText}`);
  }
  for (const requiredText of [
    'Teacher reviewer verdict:',
    'Economist reviewer verdict:',
    'Quality inspection reviewer verdict:',
    'Each reviewer must be more than satisfied',
    'PASS WITH FLAGS may not carry a missing core requirement'
  ]) {
    if (!leadTemplate.includes(requiredText)) failures.push(`lead review template missing text: ${requiredText}`);
  }
  for (const command of [
    'node build-scripts/references/check-mtu-h7-operation-registry-governance-bundle-1.js',
    'node build-scripts/references/check-mtu-h7-execution-benchmark-bundle-1.js',
    'node build-scripts/reports/validate-report-json.js',
    'npm run check:platform'
  ]) {
    if (!quality.includes(command)) failures.push(`quality log missing validation command: ${command}`);
  }

  const evidenceOps = asArray(evidence.operation_evidence).map((row) => row.operation_id);
  for (const operationId of REQUIRED_OPERATION_IDS) {
    if (!evidenceOps.includes(operationId)) failures.push(`evidence matrix missing operation: ${operationId}`);
  }

  return {
    ok: failures.length === 0,
    failures,
    summary: {
      records: recordRows.length,
      operations: operationRows.length,
      candidates: candidateIds.length,
      status: bundle.status
    }
  };
}

const result = validate();
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else if (result.ok) {
  console.log(`OK ${SPRINT_ID}: governance bundle checked (${result.summary.records} records, ${result.summary.operations} operations, ${result.summary.candidates} candidates)`);
} else {
  console.error(`FAIL ${SPRINT_ID}: ${result.failures.length} issue(s)`);
  for (const failure of result.failures) console.error(`- ${failure}`);
}
process.exit(result.ok ? 0 : 1);
