'use strict';

const owner = require('./book2-owner-decision');
const grant = require('./book2-integration-decision');
const currentness = require('./check-book-outline-currentness');
const remediation = require('./check-book2-target-authority-remediation');
const { approvalBlockLifecycleMode, PARAGRAPHS } = require('./check-book2-candidate-approval-block');
const ACTIVATION_COMMIT = '206c018478654db781cc879e7ea36adcd9ef600c';

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

function released() {
  const input = pending(true);
  Object.assign(input.meta.issue_229_candidate, { status: 'integrated', approval_status: 'integrated',
    integration_status: 'integrated', integrated_commit: ACTIVATION_COMMIT, integration_evidence_ref: grant.EVIDENCE_REF });
  for (const hold of input.meta.holds.filter((h) => h.candidate_binding)) {
    const b = hold.candidate_binding;
    delete hold.candidate_binding;
    hold.status = 'released';
    hold.target_binding = Object.fromEntries(['blocked_baseline_sha256', 'approved_replacement_sha256', 'approval_ref', 'approved_by', 'approved_on'].map((key) => [key, b[key]]));
    hold.release_evidence = { resolved_via: 'target_authority_integration', released_by: grant.EXPECTED.decided_by,
      released_on: grant.EXPECTED.decided_on, evidence_ref: grant.EVIDENCE_REF, subject_id: hold.scope[0].slice(10),
      subject_sha256: b.approved_replacement_sha256, integrated_commit: ACTIVATION_COMMIT };
  }
  return input;
}

function rejectedEverywhere(input, fragment) {
  expect(remediation.findFailures(input, { durable: true }).join('\n')).toContain(fragment);
  expect(() => approvalBlockLifecycleMode(input.meta, input)).toThrow(fragment);
  expect(currentness.findBookOutlineFailures(filesFor(input), { action: 'paragraph_production', paragraph: '2.1.1' }).join('\n')).toContain(fragment);
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

  test.each(['status', 'integrated_commit', 'integration_evidence_ref'])('authorized pending rejects terminal field %s', (field) => {
    const input = pending(true); input.meta.issue_229_candidate[field] = field === 'status' ? 'integrated' : 'forged';
    rejectedEverywhere(input, 'pending grant requires exact pending');
  });

  test.each([owner.REVIEWED_HEAD, grant.BASELINE_COMMIT, grant.EVIDENCE_COMMIT, 'f'.repeat(40)])('rejects old/missing/non-activation commit %s', (commit) => {
    expect(grant.validateActivationCommit(commit).length).toBeGreaterThan(0);
  });
});

describe('fully evidenced Book 2 activation', () => {
  test('all consumers accept the exact terminal package without changing frozen records', () => {
    const input = released();
    expect(grant.validateActivationCommit(ACTIVATION_COMMIT)).toEqual([]);
    expect(remediation.findFailures(input, { durable: true })).toEqual([]);
    expect(approvalBlockLifecycleMode(input.meta, input)).toBe('retired');
    expect(currentness.findBookOutlineFailures(filesFor(input), { requireApproved: true, action: 'paragraph_production', paragraph: '2.1.1' })).toEqual([]);
    expect(input.candidates.every((r) => r.record_status === 'candidate_review_ready')).toBe(true);
    expect(owner.hash(JSON.stringify(input.registry.exercises.filter((r) => r.module === 2)))).toBe(owner.PACKAGE_HASH);
  });

  test.each(['status', 'approval_status', 'integration_status'])('rejects mixed terminal lifecycle %s', (field) => {
    const input = released(); input.meta.issue_229_candidate[field] = 'pending';
    const failures = remediation.findFailures(input, { durable: true });
    expect(failures.length).toBeGreaterThan(0);
    expect(() => approvalBlockLifecycleMode(input.meta, input)).toThrow();
    expect(currentness.findBookOutlineFailures(filesFor(input), { action: 'paragraph_production', paragraph: '2.1.1' }).length).toBeGreaterThan(0);
  });

  test('rejects one released target plus eleven pending through scoped production too', () => {
    const input = released(); const historical = pending(true);
    for (const [, holdId] of PARAGRAPHS.slice(1)) {
      input.meta.holds[input.meta.holds.findIndex((h) => h.id === holdId)] = historical.meta.holds.find((h) => h.id === holdId);
    }
    rejectedEverywhere(input, 'durable terminal state requires a released target binding');
  });

  test.each(PARAGRAPHS)('%s release must use the same activation and immutable reference', (_, holdId) => {
    for (const field of ['integrated_commit', 'evidence_ref', 'released_by', 'released_on']) {
      const input = released();
      input.meta.holds.find((h) => h.id === holdId).release_evidence[field] = 'forged';
      rejectedEverywhere(input, 'release must match the exact activation commit');
    }
  });

  test('absent grant, changed top evidence, old activation and forged live content fail all consumers', () => {
    const absent = released(); delete absent.meta.issue_229_integration_decision;
    rejectedEverywhere(absent, 'requires a separate immutable owner integration decision');
    const evidence = released(); evidence.meta.issue_229_candidate.integration_evidence_ref = 'forged';
    rejectedEverywhere(evidence, 'top-level integration evidence must match');
    const old = released(); old.meta.issue_229_candidate.integrated_commit = owner.REVIEWED_HEAD;
    rejectedEverywhere(old, 'activation commit');
    const changed = released(); changed.registry.exercises.find((r) => r.id === '2.1.1').lesson_goals[0] += ' altered';
    rejectedEverywhere(changed, 'terminal registry must match the exact approved ordered package');
  });

  test.each([
    ['H-221-PRIOR', { action: 'paragraph_production', paragraph: '2.2.1' }],
    ['H-22-ELASTIC-CONTRAST', { action: 'paragraph_production', paragraph: '2.2.2' }],
    ['H-CHAPTER-23-PLAN', { action: 'chapter_production', chapter: '2.3' }],
    ['H-BOOK2-ROOT-PLAN', { action: 'whole_book_assembly' }],
    ['H-213-OPC2', { action: 'formal_output_choice_teaching', paragraph: '2.1.3' }],
  ])('preserves independent hold %s and permits its resolution', (holdId, options) => {
    const input = released(); const hold = input.meta.holds.find((h) => h.id === holdId);
    expect(hold).toEqual(pending().meta.holds.find((h) => h.id === holdId));
    expect(currentness.findBookOutlineFailures(filesFor(input), options).join('\n')).toContain(holdId);
    expect(currentness.findBookOutlineFailures(filesFor(input), { ...options, action: hold.resolution_actions[0] })).toEqual([]);
  });

  test.each(['holds', 'pins', 'grant', 'outline', 'evidence', 'registry', 'candidates'])('rejects corrupted activation snapshot %s', (kind) => {
    const original = owner.gitText;
    const spy = jest.spyOn(owner, 'gitText').mockImplementation((commit, file, root) => {
      const text = original(commit, file, root);
      if (commit !== ACTIVATION_COMMIT) return text;
      if (kind === 'outline' && file === currentness.OUTLINE_PATH) return text + '\nUnapproved semantic change.\n';
      if (kind === 'evidence' && file === grant.EVIDENCE_PATH) return text + ' altered';
      if (file === grant.META_PATH) {
        const meta = JSON.parse(text);
        if (kind === 'holds') meta.holds.find((h) => h.candidate_binding).release_evidence = { forged: true };
        if (kind === 'pins') meta.target_registry_pins[0].target_record_sha256 = 'f'.repeat(64);
        if (kind === 'grant') meta.issue_229_integration_decision.merge_authorized = true;
        return JSON.stringify(meta);
      }
      if (kind === 'registry' && file === grant.REGISTRY_PATH) {
        const data = JSON.parse(text); data.exercises.find((r) => r.module === 2).lesson_goals[0] += ' forged'; return JSON.stringify(data);
      }
      if (kind === 'candidates' && file === owner.PACKAGE_PATH) {
        const data = JSON.parse(text); data[0].lesson_goals[0] += ' forged'; return JSON.stringify(data);
      }
      return text;
    });
    try { expect(grant.validateActivationCommit(ACTIVATION_COMMIT).length).toBeGreaterThan(0); }
    finally { spy.mockRestore(); }
  });

  test('live currentness CLI does not bypass semantic provenance through circular initialization', () => {
    const { spawnSync } = require('child_process');
    const path = require('path');
    const result = spawnSync(process.execPath, [path.join(__dirname, 'check-book-outline-currentness.js'), '--require-approved'], { encoding: 'utf8' });
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
  });
});
