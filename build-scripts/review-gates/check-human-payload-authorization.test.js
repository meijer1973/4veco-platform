const {
  markerFor,
  parseAuthorizationComment,
  validateAuthorizationRecord,
} = require('./check-human-payload-authorization');

const record = {
  repository: 'meijer1973/4veco-platform',
  pr_number: 136,
  reviewed_payload_head_sha: 'ca09bcb31e90ce1f90dc91172f55e50ddd66d769',
  base_sha_at_review: '82702f07118a1828fc232e7bbc8478110988cec3',
  decision: 'APPROVE_AND_MERGE',
  decision_scope: 'Goal IQS selected deepening payload.',
  authorization_comment_id: 12345,
  permitted_integration_descendants: [
    'conflict_free_main_base_sync_merge',
    'allowlisted_deterministic_evidence_refresh',
  ],
  invalidation_conditions: [
    'reviewed_payload_not_ancestor',
    'manual_conflict_resolution',
    'substantive_pr_authored_commit_after_authorization',
    'authority_or_scope_change',
    'changed_effective_payload',
  ],
};

describe('human payload authorization', () => {
  test('validates a complete authorization record', () => {
    const summary = validateAuthorizationRecord(record, {
      expectedRepo: 'meijer1973/4veco-platform',
      expectedPr: 136,
      expectedPayloadSha: 'ca09bcb31e90ce1f90dc91172f55e50ddd66d769',
    });

    expect(summary.ok).toBe(true);
    expect(summary.marker).toBe(markerFor(record));
  });

  test('parses the preferred marker and JSON block', () => {
    const body = `${markerFor(record)}\n\n\`\`\`json\n${JSON.stringify(record, null, 2)}\n\`\`\`\n`;
    expect(parseAuthorizationComment(body)).toEqual(record);
  });

  test('rejects missing invalidation conditions', () => {
    const summary = validateAuthorizationRecord({
      ...record,
      invalidation_conditions: ['reviewed_payload_not_ancestor'],
    });

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('invalidation_conditions missing manual_conflict_resolution');
  });

  test('rejects mismatched expected payload head', () => {
    const summary = validateAuthorizationRecord(record, {
      expectedPayloadSha: 'ffffffffffffffffffffffffffffffffffffffff',
    });

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain(
      'reviewed payload mismatch: expected ffffffffffffffffffffffffffffffffffffffff'
    );
  });
});
