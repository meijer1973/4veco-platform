const {
  issueUrlMatchesTarget,
  markerFor,
  parseAuthorizationComment,
  renderPayloadAuthorizationTemplate,
  validateAuthorizationCommentMetadata,
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

  test('keeps existing APPROVE_FOR_INTEGRATION records valid', () => {
    const summary = validateAuthorizationRecord({
      ...record,
      decision: 'APPROVE_FOR_INTEGRATION',
    });

    expect(summary.ok).toBe(true);
  });

  test('parses the preferred marker and JSON block', () => {
    const body = `${markerFor(record)}\n\n\`\`\`json\n${JSON.stringify(record, null, 2)}\n\`\`\`\n`;
    expect(parseAuthorizationComment(body)).toEqual(record);
  });

  test('renders the canonical payload authorization handoff label without changing decision enum', () => {
    const body = renderPayloadAuthorizationTemplate(record);

    expect(body).toContain('HUMAN_DECISION: APPROVE_AND_MERGE');
    expect(body).toContain('AUTHORIZATION_TYPE: PAYLOAD_AUTHORIZATION');
    expect(body).toContain(`REVIEWED_PAYLOAD_HEAD: ${record.reviewed_payload_head_sha}`);
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

  test('rejects marker and JSON disagreement', () => {
    const body = `${markerFor({ ...record, pr_number: 137 })}\n\n\`\`\`json\n${JSON.stringify(record, null, 2)}\n\`\`\`\n`;

    expect(() => parseAuthorizationComment(body)).toThrow('authorization marker PR number mismatch');
  });

  test('rejects unsupported authorization fields', () => {
    const summary = validateAuthorizationRecord({
      ...record,
      copied_from_pr: 135,
    });

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('unsupported authorization field: copied_from_pr');
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

  test('rejects cross-PR comment metadata and non-owner authors', () => {
    const summary = validateAuthorizationCommentMetadata({
      id: 12345,
      issue_url: 'https://api.github.com/repos/meijer1973/4veco-platform/issues/135',
      user: { login: 'codex-bot' },
      author_association: 'CONTRIBUTOR',
    }, record, {
      expectedRepo: 'meijer1973/4veco-platform',
      expectedPr: 136,
      expectedCommentId: 12345,
      expectedAuthorLogin: 'meijer1973',
    });

    expect(summary.ok).toBe(false);
    expect(summary.failures).toEqual(expect.arrayContaining([
      'authorization comment must belong to meijer1973/4veco-platform#136',
      'authorization comment author must be meijer1973',
      'authorization comment author_association must be OWNER',
    ]));
  });

  test('accepts exact target issue URL metadata', () => {
    const summary = validateAuthorizationCommentMetadata({
      id: 12345,
      issue_url: 'https://api.github.com/repos/meijer1973/4veco-platform/issues/136',
      user: { login: 'meijer1973' },
      author_association: 'OWNER',
    }, record, {
      expectedRepo: 'meijer1973/4veco-platform',
      expectedPr: 136,
      expectedCommentId: 12345,
      expectedAuthorLogin: 'meijer1973',
    });

    expect(summary.ok).toBe(true);
    expect(summary.failures).toEqual([]);
  });

  test('rejects issue URL PR-number prefix collisions', () => {
    const summary = validateAuthorizationCommentMetadata({
      id: 12345,
      issue_url: 'https://api.github.com/repos/meijer1973/4veco-platform/issues/136',
      user: { login: 'meijer1973' },
      author_association: 'OWNER',
    }, { ...record, pr_number: 13 }, {
      expectedRepo: 'meijer1973/4veco-platform',
      expectedPr: 13,
      expectedCommentId: 12345,
      expectedAuthorLogin: 'meijer1973',
    });

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('authorization comment must belong to meijer1973/4veco-platform#13');
    expect(issueUrlMatchesTarget(
      'https://api.github.com/repos/meijer1973/4veco-platform/issues/136',
      'meijer1973/4veco-platform',
      13
    )).toBe(false);
  });
});
