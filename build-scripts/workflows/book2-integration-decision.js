'use strict';

// HOW TO ADAPT: a new grant requires separately committed owner evidence and
// governed review. Never derive authorization pins from mutable metadata/HEAD.
const path = require('path');
const { execFileSync } = require('child_process');
const owner = require('./book2-owner-decision');
const ROOT = path.resolve(__dirname, '..', '..');
const META_PATH = 'references/authored/book-outlines/book-2-outline.meta.json';
const REGISTRY_PATH = 'references/authored/course-target-exercises.json';
const EVIDENCE_COMMIT = '6e35f4fe0aeaa448da9476469294ccd45775232d';
const EVIDENCE_PATH = 'reports/sprints/BOOK2-TARGET-INTEGRATION-1-owner-authorization.md';
const EVIDENCE_HASH = '6bfdbe09538c7cdd35acbed22e8cf1b8af60c0fcafa89bec33fdb55c0b84ba87';
const EVIDENCE_REF = `https://github.com/meijer1973/4veco-platform/blob/${EVIDENCE_COMMIT}/${EVIDENCE_PATH}`;
const BASELINE_COMMIT = 'ad27f9c30205042c01cacf0b362f4d3f87e6c7a9';
const EXPECTED = Object.freeze({
  decision: 'authorize_frozen_book2_target_integration_then_part_a_production',
  transition_id: 'BOOK2-TARGET-INTEGRATION-1',
  package_sha256: owner.PACKAGE_HASH,
  outline_sha256: owner.OUTLINE_HASH,
  content_reviewed_head: owner.REVIEWED_HEAD,
  content_merge_commit: BASELINE_COMMIT,
  decided_by: 'meijer1973', decided_on: '2026-09-05',
  evidence_ref: EVIDENCE_REF, evidence_sha256: EVIDENCE_HASH,
  integration_authorized: true, lessons_authorized: true, merge_authorized: false,
  production_precondition: 'governed_transition_merged_main_ci_passed_and_action_holds_released',
});
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function validateIntegrationDecision(decision) {
  if (!decision) return ['Issue #229 requires a separate immutable owner integration decision; content approval does not authorize target integration'];
  const failures = [];
  if (!same(Object.keys(decision).sort(), Object.keys(EXPECTED).sort())) failures.push('Issue #229 integration decision requires exact fields');
  for (const [key, value] of Object.entries(EXPECTED)) {
    if (decision[key] !== value) failures.push(`Issue #229 integration decision mismatch: ${key}`);
  }
  try {
    if (owner.hash(owner.gitText(EVIDENCE_COMMIT, EVIDENCE_PATH)) !== EVIDENCE_HASH) failures.push('Issue #229 immutable integration evidence hash mismatch');
  } catch (error) { failures.push(`Issue #229 immutable integration evidence unavailable: ${error.message}`); }
  return failures;
}

function validatePendingDecision(meta) {
  const declared = meta.issue_229_candidate?.integration_status;
  const decision = meta.issue_229_integration_decision;
  const failures = decision || declared === 'authorized_pending_transition'
    ? validateIntegrationDecision(decision) : [];
  if (decision && declared !== 'authorized_pending_transition') failures.push('Issue #229 pending grant requires authorized_pending_transition status');
  if (decision || declared === 'authorized_pending_transition') {
    const expected = { ...JSON.parse(owner.gitText(BASELINE_COMMIT, META_PATH)).issue_229_candidate,
      integration_status: 'authorized_pending_transition' };
    const candidate = meta.issue_229_candidate || {};
    if (!same(Object.keys(candidate).sort(), Object.keys(expected).sort())) failures.push('Issue #229 pending grant requires exact pending fields without terminal provenance');
    for (const [key, value] of Object.entries(expected)) {
      if (!same(candidate[key], value)) failures.push(`Issue #229 pending grant requires exact pending value: ${key}`);
    }
  }
  return failures;
}

function validateActivationCommit(commit, root = ROOT) {
  const failures = [];
  try {
    if (!/^[0-9a-f]{40}$/.test(String(commit || ''))) throw new Error('full activation commit SHA required');
    if (commit === EVIDENCE_COMMIT) throw new Error('activation must be a distinct post-authorization commit');
    execFileSync('git', ['merge-base', '--is-ancestor', EVIDENCE_COMMIT, commit], { cwd: root, stdio: 'pipe' });
    execFileSync('git', ['merge-base', '--is-ancestor', commit, 'HEAD'], { cwd: root, stdio: 'pipe' });
    if (owner.hash(owner.gitText(commit, EVIDENCE_PATH, root)) !== EVIDENCE_HASH) throw new Error('activation changed the immutable authorization evidence');
    const meta = JSON.parse(owner.gitText(commit, META_PATH, root));
    failures.push(...validateIntegrationDecision(meta.issue_229_integration_decision));
    failures.push(...validatePendingDecision(meta));
    failures.push(...owner.validateOwnerDecision(meta.issue_229_owner_decision));
    failures.push(...owner.validateEiDecision(meta));
    if (meta.issue_229_candidate?.integration_status !== 'authorized_pending_transition'
        || meta.issue_229_candidate?.approval_status !== 'pending') {
      failures.push('activation commit must contain the authorized pending transition');
    }
    const baseline = JSON.parse(owner.gitText(BASELINE_COMMIT, META_PATH));
    if (!same(meta.holds, baseline.holds)) failures.push('activation commit must preserve the complete pending hold set and historical evidence');
    if (!same(meta.target_registry_pins, baseline.target_registry_pins)) failures.push('activation commit must preserve the exact approved target pins');
    // Lazy import only reuses the canonical semantic hasher, not its validators.
    const { sha256SemanticAuthority, OUTLINE_PATH } = require('./check-book-outline-currentness');
    if (sha256SemanticAuthority(owner.gitText(commit, OUTLINE_PATH, root)) !== owner.OUTLINE_HASH) failures.push('activation commit actual outline semantics differ from approved authority');
    const records = JSON.parse(owner.gitText(commit, REGISTRY_PATH, root)).exercises.filter((r) => r.module === 2);
    if (owner.hash(JSON.stringify(records)) !== owner.PACKAGE_HASH) failures.push('activation commit registry differs from frozen package');
    const candidates = JSON.parse(owner.gitText(commit, owner.PACKAGE_PATH, root));
    if (owner.hash(JSON.stringify(candidates)) !== owner.PACKAGE_HASH) failures.push('activation commit candidates differ from frozen package');
  } catch (error) { failures.push(`Issue #229 activation commit ${commit}: ${error.message}`); }
  return failures;
}

function validateReleaseBinding(meta, evidence) {
  const failures = validateIntegrationDecision(meta.issue_229_integration_decision);
  // Legacy pending fixtures keep their explicit authority failure without
  // manufacturing a new grant from release metadata or content presence.
  if (failures.length) return failures;
  const candidate = meta.issue_229_candidate || {};
  if (candidate.integration_status !== 'integrated'
      || candidate.approval_status !== 'integrated' || candidate.status !== 'integrated') {
    failures.push('Issue #229 release requires the integrated lifecycle state');
  }
  if (candidate.integration_evidence_ref !== EVIDENCE_REF) failures.push('Issue #229 top-level integration evidence must match immutable authorization');
  if (evidence && (evidence.integrated_commit !== candidate.integrated_commit
      || evidence.evidence_ref !== EVIDENCE_REF
      || evidence.released_by !== EXPECTED.decided_by || evidence.released_on !== EXPECTED.decided_on)) {
    failures.push('Issue #229 release must match the exact activation commit, owner, date and immutable authorization reference');
  }
  return failures;
}

function validateIntegrationRelease(meta, evidence, root = ROOT) {
  const failures = validateReleaseBinding(meta, evidence);
  if (validateIntegrationDecision(meta.issue_229_integration_decision).length === 0) {
    failures.push(...validateActivationCommit(meta.issue_229_candidate?.integrated_commit, root));
  }
  return failures;
}

module.exports = { EXPECTED, BASELINE_COMMIT, EVIDENCE_COMMIT, EVIDENCE_PATH,
  EVIDENCE_HASH, EVIDENCE_REF, META_PATH, REGISTRY_PATH,
  validateIntegrationDecision, validatePendingDecision, validateActivationCommit,
  validateReleaseBinding, validateIntegrationRelease };
