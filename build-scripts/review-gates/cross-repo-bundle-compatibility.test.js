const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  integrationRefreshReadinessAttestationDigest,
  stateResult,
  summarizeCompatibility,
  validateCompatibilityProof,
  validateIntegrationRefreshProof,
} = require('./cross-repo-bundle-compatibility');
const { INDEX_PATHS } = require('./refresh-bundle-agent-indexes');

const pBase = '1'.repeat(40);
const pHead = '2'.repeat(40);
const lBase = '3'.repeat(40);
const lHead = '4'.repeat(40);

function state(name, status) {
  return stateResult({
    bundleId: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
    state: name,
    platformBaseSha: pBase,
    platformCandidateSha: pHead,
    lessonBaseSha: lBase,
    lessonCandidateSha: lHead,
    platformStateSha: name === 'lesson-first' ? pBase : pHead,
    lessonStateSha: name === 'platform-first' ? lBase : lHead,
    status,
    commands: [`check ${name}`],
  });
}

function matrix(platformFirst, lessonFirst, bundleFinal = 'success') {
  return summarizeCompatibility({
    states: [
      state('platform-first', platformFirst),
      state('lesson-first', lessonFirst),
      state('bundle-final', bundleFinal),
    ],
  });
}

function integrationRefreshProof(overrides = {}) {
  const integrationHead = '5'.repeat(40);
  const lessonMerge = '6'.repeat(40);
  const proof = {
    status: 'complete',
    order: 'lesson-first',
    platform_payload_sha: pHead,
    platform_integration_head_sha: integrationHead,
    lesson_payload_sha: lHead,
    lesson_merge_commit_sha: lessonMerge,
    refresh_result: {
      status: 'created',
      trusted_executor: 'platform-main',
      previous_platform_head_sha: pHead,
      platform_integration_head_sha: integrationHead,
      lesson_merge_commit_sha: lessonMerge,
      changed_paths: INDEX_PATHS,
      hashes: Object.fromEntries(INDEX_PATHS.map((item) => [item, 'a'.repeat(64)])),
      metadata: {
        platform_source_commit: pHead,
        platform_source_branch: 'codex/controller',
        lesson_source_commit: lessonMerge,
        lesson_source_branch: 'origin/main',
        generated_at: '2026-08-14T00:00:00.000Z',
      },
    },
    lineage: {
      reviewed_payload_head_sha: pHead,
      integration_head_sha: integrationHead,
      payload_ancestor_of_integration_head: true,
      authorization_inherited: true,
      failures: [],
    },
    readiness: {
      head_sha: integrationHead,
      route: 'READY_FOR_HUMAN_REVIEW',
      attestation_schema_version: 1,
      attestation_digest: null,
    },
    ci: {
      status: 'success',
      platform_sha: integrationHead,
      lesson_sha: lessonMerge,
    },
  };
  const result = {
    ...proof,
    ...overrides,
    refresh_result: { ...proof.refresh_result, ...(overrides.refresh_result || {}) },
    lineage: { ...proof.lineage, ...(overrides.lineage || {}) },
    readiness: { ...proof.readiness, ...(overrides.readiness || {}) },
    ci: { ...proof.ci, ...(overrides.ci || {}) },
  };
  if (!Object.prototype.hasOwnProperty.call(overrides.readiness || {}, 'attestation_digest')) {
    result.readiness.attestation_digest = integrationRefreshReadinessAttestationDigest(result);
  }
  return result;
}

describe('cross-repo bundle compatibility', () => {
  test('platform candidate plus paired lesson candidate green does not allow platform-first when lesson main is red', () => {
    const summary = matrix('failure', 'success');
    expect(summary.ok).toBe(true);
    expect(summary.permitted_merge_orders).toEqual(['lesson-first']);
    expect(summary.recommended_merge_order).toBe('lesson-first');
  });

  test('platform-first state green allows platform to merge first', () => {
    const summary = matrix('success', 'failure');
    expect(summary.ok).toBe(true);
    expect(summary.permitted_merge_orders).toEqual(['platform-first']);
    expect(summary.recommended_merge_order).toBe('platform-first');
  });

  test('both intermediate states green choose deterministic lesson-first default', () => {
    const summary = matrix('success', 'success');
    expect(summary.ok).toBe(true);
    expect(summary.permitted_merge_orders).toEqual(['platform-first', 'lesson-first']);
    expect(summary.recommended_merge_order).toBe('lesson-first');
  });

  test('bundle-final green but both intermediate states red is blocked', () => {
    const summary = matrix('failure', 'failure');
    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('no_green_intermediate_order');
    expect(summary.permitted_merge_orders).toEqual([]);
  });

  test('red bundle-final blocks even when an intermediate is green', () => {
    const summary = matrix('success', 'success', 'failure');
    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('bundle_final_not_green');
    expect(summary.permitted_merge_orders).toEqual([]);
  });

  test('validates exact bundle id and members', () => {
    const summary = matrix('success', 'success');
    expect(validateCompatibilityProof(summary, {
      bundleId: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
      exactMembers: {
        platform_base_sha: pBase,
        platform_candidate_sha: pHead,
        lesson_base_sha: lBase,
        lesson_candidate_sha: lHead,
      },
    }).ok).toBe(true);

    expect(validateCompatibilityProof(summary, {
      exactMembers: { lesson_candidate_sha: '5'.repeat(40) },
    }).failures).toContain(`lesson_candidate_sha mismatch: expected ${'5'.repeat(40)}`);
  });

  test('requires the exact lesson-first post-merge refresh contract', () => {
    const summary = matrix('failure', 'success');
    const missing = { ...summary };
    delete missing.integration_contract;
    expect(validateCompatibilityProof(missing).failures).toContain('lesson-first integration_contract missing');

    const tampered = JSON.parse(JSON.stringify(summary));
    tampered.integration_contract.post_first_merge_refresh.trusted_executor = 'candidate-branch';
    expect(validateCompatibilityProof(tampered).failures).toContain('integration_contract trusted_executor mismatch');

    const wrongPaths = JSON.parse(JSON.stringify(summary));
    wrongPaths.integration_contract.post_first_merge_refresh.changed_paths.pop();
    expect(validateCompatibilityProof(wrongPaths).failures).toContain('integration_contract changed_paths mismatch');
  });

  test('keeps immutable payload coordinates separate from runtime refresh evidence', () => {
    const compatibility = matrix('failure', 'success');
    const proof = integrationRefreshProof();
    expect(validateIntegrationRefreshProof(proof, {
      compatibility,
      controllerHead: proof.platform_integration_head_sha,
      lessonMergeSha: proof.lesson_merge_commit_sha,
    }).ok).toBe(true);

    const mixedPayload = integrationRefreshProof({ platform_payload_sha: proof.platform_integration_head_sha });
    expect(validateIntegrationRefreshProof(mixedPayload, { compatibility }).failures)
      .toContain('integration_refresh platform payload mismatch');

    const staleReadiness = integrationRefreshProof({
      readiness: { ...proof.readiness, head_sha: pHead },
    });
    expect(validateIntegrationRefreshProof(staleReadiness, { compatibility }).failures)
      .toContain('integration_refresh readiness invalid');

    const wrongLessonCi = integrationRefreshProof({
      ci: { ...proof.ci, lesson_sha: lHead },
    });
    expect(validateIntegrationRefreshProof(wrongLessonCi, { compatibility }).failures)
      .toContain('integration_refresh CI binding invalid');

    const untrusted = integrationRefreshProof({
      refresh_result: { ...proof.refresh_result, trusted_executor: 'candidate-branch' },
    });
    expect(validateIntegrationRefreshProof(untrusted, { compatibility }).failures)
      .toContain('integration_refresh executor mismatch');

    const arbitraryDigest = integrationRefreshProof({
      readiness: { attestation_digest: `sha256:${'f'.repeat(64)}` },
    });
    expect(validateIntegrationRefreshProof(arbitraryDigest, { compatibility }).failures)
      .toContain('integration_refresh readiness attestation mismatch');

    const missingMetadata = integrationRefreshProof({
      refresh_result: { metadata: undefined },
    });
    expect(validateIntegrationRefreshProof(missingMetadata, { compatibility }).failures)
      .toEqual(expect.arrayContaining([
        'integration_refresh platform source commit mismatch',
        'integration_refresh lesson source commit mismatch',
        'integration_refresh generated_at invalid',
      ]));

    const tamperedMetadata = integrationRefreshProof({
      refresh_result: {
        previous_platform_head_sha: '7'.repeat(40),
        metadata: {
          ...proof.refresh_result.metadata,
          platform_source_branch: '',
          lesson_source_branch: 'agent/lesson-payload',
          generated_at: 'not-a-date',
        },
      },
    });
    expect(validateIntegrationRefreshProof(tamperedMetadata, { compatibility }).failures)
      .toEqual(expect.arrayContaining([
        'integration_refresh platform source commit mismatch',
        'integration_refresh platform source branch missing',
        'integration_refresh lesson source branch mismatch',
        'integration_refresh generated_at invalid',
      ]));
  });

  test('rejects malformed state-to-SHA mapping', () => {
    const bad = summarizeCompatibility({
      states: [
        state('platform-first', 'success'),
        {
          ...state('lesson-first', 'success'),
          platform_sha: pHead,
        },
        state('bundle-final', 'success'),
      ],
    });

    expect(bad.ok).toBe(false);
    expect(bad.failures).toContain(`lesson-first platform_sha must match ${pBase}`);
  });

  test('rejects inconsistent bundle id and exact members across state results', () => {
    const bad = summarizeCompatibility({
      states: [
        state('platform-first', 'success'),
        {
          ...state('lesson-first', 'success'),
          bundle_id: 'OTHER-BUNDLE',
        },
        {
          ...state('bundle-final', 'success'),
          exact_members: {
            platform_base_sha: pBase,
            platform_candidate_sha: '5'.repeat(40),
            lesson_base_sha: lBase,
            lesson_candidate_sha: lHead,
          },
        },
      ],
    });

    expect(bad.ok).toBe(false);
    expect(bad.failures).toContain('lesson-first bundle_id mismatch');
    expect(bad.failures).toContain('bundle-final platform_candidate_sha mismatch');
  });

  test('rejects missing state-level bundle id and exact members', () => {
    const bad = summarizeCompatibility({
      states: [
        {
          ...state('platform-first', 'success'),
          bundle_id: undefined,
        },
        {
          ...state('lesson-first', 'success'),
          exact_members: undefined,
        },
        state('bundle-final', 'success'),
      ],
    });

    expect(bad.ok).toBe(false);
    expect(bad.failures).toContain('platform-first bundle_id missing');
    expect(bad.failures).toContain('lesson-first exact_members missing');
  });

  test('state-result CLI accepts an explicitly empty failed-command value', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-state-result-'));
    const output = path.join(dir, 'state.json');
    const script = path.join(__dirname, 'cross-repo-bundle-compatibility.js');
    const result = spawnSync(process.execPath, [
      script,
      'state-result',
      '--bundle-id',
      'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
      '--state',
      'bundle-final',
      '--platform-base-sha',
      pBase,
      '--platform-candidate-sha',
      pHead,
      '--lesson-base-sha',
      lBase,
      '--lesson-candidate-sha',
      lHead,
      '--platform-state-sha',
      pHead,
      '--lesson-state-sha',
      lHead,
      '--status',
      'success',
      '--commands-json',
      '["check"]',
      '--failed-command',
      '',
      '--output',
      output,
    ], { encoding: 'utf8' });

    expect(result.status).toBe(0);
    expect(JSON.parse(fs.readFileSync(output, 'utf8'))).toMatchObject({
      status: 'success',
      failed_command: null,
    });
  });
});
