'use strict';

// HOW TO ADAPT: a later owner decision needs its own immutable evidence and
// reviewed content identity. Never refresh these pins from mutable HEAD.
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const REVIEWED_HEAD = 'b614577f19c6e8a95c9981256aa125e56d26cd79';
const PACKAGE_PATH = 'references/data/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1.candidates.json';
const PACKAGE_HASH = '914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310';
const EVIDENCE_COMMIT = '6d6f42226987f9ef9977f46dbb869455a88c25e2';
const EVIDENCE_PATH = 'reports/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1-owner-review-20260905.md';
const EVIDENCE_HASH = 'f67a8ec08d1ffe55d7ba22ac9767d18cba0e8eaba599c6e07f45c364b39071ff';
const EVIDENCE_REF = `https://github.com/meijer1973/4veco-platform/blob/${EVIDENCE_COMMIT}/${EVIDENCE_PATH}`;
const OLD_OUTLINE_HASH = '69d803d2786e97bbd7519d2feed3ee29b79751b00a3c8a440432621927a13cde';
const OUTLINE_HASH = '919c39f64dd212dba37b62902a5bb2e2ce6388c6020a0491e1621017ae2192a1';
const EI_DECISION = 'approve_three_way_ei_unlabeled_zero_one';
const IDS = ['2.1.1', '2.1.2', '2.1.3', '2.1.4', '2.2.1', '2.2.2', '2.2.3', '2.2.4', '2.3.1', '2.3.2', '2.3.3', '2.3.4'];
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
// Only immutable full-SHA objects are cached; mutable refs are always read anew.
const gitObjects = new Map();
function gitText(commit, file, root = ROOT) {
  const key = JSON.stringify([root, commit, file]);
  if (/^[0-9a-f]{40}$/.test(commit) && gitObjects.has(key)) return gitObjects.get(key);
  const content = execFileSync('git', ['show', `${commit}:${file}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (/^[0-9a-f]{40}$/.test(commit)) gitObjects.set(key, content);
  return content;
}
function approvedRecords() {
  const records = JSON.parse(gitText(REVIEWED_HEAD, PACKAGE_PATH));
  if (JSON.stringify(records.map((r) => r.id)) !== JSON.stringify(IDS) || hash(JSON.stringify(records)) !== PACKAGE_HASH) {
    throw new Error('immutable approved Book 2 package identity mismatch');
  }
  return records;
}
function validateOwnerDecision(decision) {
  const failures = [];
  const expected = {
    decision: 'approve_target_content_only', package_sha256: PACKAGE_HASH,
    reviewed_pr: 230, reviewed_head: REVIEWED_HEAD, decided_by: 'meijer1973',
    decided_on: '2026-09-05', evidence_ref: EVIDENCE_REF, evidence_sha256: EVIDENCE_HASH,
    integration_authorized: false, lessons_authorized: false, merge_authorized: false,
  };
  for (const [key, value] of Object.entries(expected)) {
    if (!decision || decision[key] !== value) failures.push(`Issue #229 owner decision mismatch: ${key}`);
  }
  try {
    if (hash(gitText(EVIDENCE_COMMIT, EVIDENCE_PATH)) !== EVIDENCE_HASH) failures.push('Issue #229 immutable owner evidence hash mismatch');
    approvedRecords();
  } catch (error) { failures.push(`Issue #229 immutable owner evidence unavailable: ${error.message}`); }
  return failures;
}
function validateEiDecision(meta) {
  const hold = (meta.holds || []).find((h) => h.id === 'H-229-EI-SUPERSESSION');
  const evidence = hold && hold.release_evidence;
  const failures = validateOwnerDecision(meta.issue_229_owner_decision);
  const expected = {
    resolved_via: 'outline_owner_decision', released_by: 'meijer1973', released_on: '2026-09-05',
    evidence_ref: EVIDENCE_REF, subject_id: 'book-2-ei-semantic-supersession',
    subject_sha256: OUTLINE_HASH, reviewed_pr: 230, reviewed_head: REVIEWED_HEAD,
    decision: EI_DECISION, supersedes_sha256: OLD_OUTLINE_HASH, evidence_sha256: EVIDENCE_HASH,
  };
  if (!hold || hold.status !== 'released') failures.push('H-229-EI-SUPERSESSION requires a released Ei supersession hold');
  for (const [key, value] of Object.entries(expected)) {
    if (!evidence || evidence[key] !== value) failures.push(`H-229-EI-SUPERSESSION semantic decision mismatch: ${key}`);
  }
  if (meta.semantic_authority?.sha256 !== OUTLINE_HASH) failures.push('H-229-EI-SUPERSESSION semantic outline hash mismatch');
  return failures;
}
function hasApprovedFrozenRecord(meta, record, binding) {
  if (!record || !binding) return false;
  if (validateOwnerDecision(meta.issue_229_owner_decision).length) return false;
  const expected = approvedRecords().find((r) => r.id === record.id);
  return Boolean(expected && hash(JSON.stringify(record)) === hash(JSON.stringify(expected))
    && binding.approved_replacement_sha256 === hash(JSON.stringify(expected))
    && binding.approval_ref === EVIDENCE_REF && binding.approved_by === 'meijer1973'
    && binding.approved_on === '2026-09-05');
}
module.exports = { REVIEWED_HEAD, PACKAGE_PATH, PACKAGE_HASH, EVIDENCE_COMMIT, EVIDENCE_PATH,
  EVIDENCE_HASH, EVIDENCE_REF, OLD_OUTLINE_HASH, OUTLINE_HASH, EI_DECISION, IDS, hash,
  gitText, approvedRecords, validateOwnerDecision, validateEiDecision, hasApprovedFrozenRecord };
