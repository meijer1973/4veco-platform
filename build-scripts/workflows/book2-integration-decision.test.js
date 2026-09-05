'use strict';

const owner = require('./book2-owner-decision');
const grant = require('./book2-integration-decision');
const currentness = require('./check-book-outline-currentness');
const remediation = require('./check-book2-target-authority-remediation');
const { approvalBlockLifecycleMode, PARAGRAPHS } = require('./check-book2-candidate-approval-block');

function pending(authorized = false) {
  const input = remediation.readInputs();
  input.meta = JSON.parse(owner.gitText(grant.BASELINE_COMMIT, grant.META_PATH));
  if (authorized) {
    input.meta.issue_229_integration_decision = { ...grant.EXPECTED };
    input.meta.issue_229_candidate.integration_status = 'authorized_pending_transition';
  }
  return input;
}
function filesFor(input) {
  const files = currentness.readFiles();
  const outline = owner.gitText(grant.BASELINE_COMMIT, currentness.OUTLINE_PATH);
  files[currentness.OUTLINE_PATH] = outline.split('\n').map((line) => {
    const hold = input.meta.holds.find((h) => line.startsWith(`| \`${h.id}\` |`));
    return hold ? currentness.formatHoldProjectionRow(hold) : line;
  }).join('\n');
  files[grant.REGISTRY_PATH] = `${JSON.stringify(input.registry, null, 2)}\n`;
  const meta = structuredClone(input.meta);
  meta.authority_sources.find((s) => s.path === grant.REGISTRY_PATH).sha256 = currentness.sha256CanonicalText(files[grant.REGISTRY_PATH]);
  files[grant.META_PATH] = JSON.stringify(meta);
  return files;
}

describe('separate Book 2 immutable integration grant', () => {
  test('pins actual owner evidence and leaves historical content decision unchanged', () => {
    expect(owner.hash(owner.gitText(grant.EVIDENCE_COMMIT, grant.EVIDENCE_PATH))).toBe(grant.EVIDENCE_HASH);
    expect(grant.validateIntegrationDecision(grant.EXPECTED)).toEqual([]);
    expect(owner.validateOwnerDecision(pending().meta.issue_229_owner_decision)).toEqual([]);
    expect(grant.EXPECTED.merge_authorized).toBe(false);
  });

  test.each(Object.keys(grant.EXPECTED))('rejects missing and altered grant field %s', (field) => {
    for (const altered of [false, true]) {
      const decision = { ...grant.EXPECTED };
      if (altered) decision[field] = 'forged'; else delete decision[field];
      expect(grant.validateIntegrationDecision(decision)).toEqual(expect.arrayContaining([expect.stringContaining(field)]));
    }
  });

  test('rejects invented grant fields and absent authorization', () => {
    expect(grant.validateIntegrationDecision({ ...grant.EXPECTED, admin_bypass: true })).toContain('Issue #229 integration decision requires exact fields');
    expect(grant.validateIntegrationDecision(undefined).join('\n')).toContain('requires a separate immutable owner integration decision');
    const input = pending(true);
    delete input.meta.issue_229_integration_decision;
    expect(remediation.findFailures(input, { durable: true }).join('\n')).toContain('requires a separate immutable');
  });

  test.each(PARAGRAPHS)('%s transitions from historical blocked to authorized pending, not production', (paragraph, holdId) => {
    const historical = pending();
    expect(remediation.findFailures(historical, { durable: true })).toEqual([]);
    expect(currentness.findBookOutlineFailures(filesFor(historical), { action: 'target_authority_integration', paragraph }).join('\n')).toContain('content approval does not authorize target integration');
    const input = pending(true);
    expect(approvalBlockLifecycleMode(input.meta, input)).toBe('pending');
    expect(currentness.findBookOutlineFailures(filesFor(input), { action: 'target_authority_integration', paragraph })).toEqual([]);
    for (const action of ['paragraph_production', 'lesson_authoring']) {
      expect(currentness.findBookOutlineFailures(filesFor(input), { action, paragraph }).join('\n')).toContain(holdId);
    }
  });

  test('rejects flipped historical flags despite a valid new grant', () => {
    const input = pending(true);
    input.meta.issue_229_owner_decision.integration_authorized = true;
    expect(remediation.findFailures(input, { durable: true }).join('\n')).toContain('owner decision mismatch: integration_authorized');
  });

  test('a pending grant does not silently retire or create payload authorization', () => {
    const input = pending(true);
    expect(currentness.findBookOutlineFailures(filesFor(input), { requireApproved: true }).join('\n')).toContain('H-229-211-CANDIDATE');
    expect(currentness.findBookOutlineFailures(filesFor(input), { action: 'merge' }).join('\n')).toContain('H-229-211-CANDIDATE');
    input.meta.issue_229_candidate.integration_status = 'integrated';
    expect(remediation.findFailures(input, { durable: true }).join('\n')).toContain('pending grant requires');
  });

  test('currentness rejects synchronized pending record, pin, binding and package drift', () => {
    const input = pending(true);
    const record = input.registry.exercises.find((r) => r.id === '2.1.2');
    record.lesson_goals[0] += ' Unauthorized extra work.';
    const recordHash = owner.hash(JSON.stringify(record));
    const packageHash = owner.hash(JSON.stringify(input.registry.exercises.filter((r) => r.module === 2)));
    input.meta.target_registry_pins.find((p) => p.id === record.id).target_record_sha256 = recordHash;
    for (const h of input.meta.holds.filter((h) => h.candidate_binding)) h.candidate_binding.candidate_package_sha256 = packageHash;
    const binding = input.meta.holds.find((h) => h.id === 'H-212-STALE-REF').candidate_binding;
    binding.candidate_replacement_sha256 = recordHash;
    binding.approved_replacement_sha256 = recordHash;
    input.meta.issue_229_candidate.package_sha256 = packageHash;
    expect(currentness.findBookOutlineFailures(filesFor(input), { action: 'target_authority_integration', paragraph: record.id }).join('\n')).toContain('active registry Book 2 records must exactly equal the candidate package');
  });

  test.each([owner.REVIEWED_HEAD, grant.BASELINE_COMMIT, grant.EVIDENCE_COMMIT, 'f'.repeat(40)])('rejects old/missing/non-activation commit %s', (commit) => {
    expect(grant.validateActivationCommit(commit).length).toBeGreaterThan(0);
  });
});

module.exports = { pending, filesFor };
