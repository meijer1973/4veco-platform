const {
  markerFor,
  parseBundleAuthorizationComment,
  renderBundleAuthorizationTemplate,
  validateBundleAuthorizationCommentMetadata,
  validateBundleAuthorizationRecord,
} = require('./check-human-bundle-authorization');

const record = {
  schema_version: 1,
  decision: 'APPROVE_BUNDLE_AND_MERGE',
  bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
  controller: {
    repository: 'meijer1973/4veco-platform',
    pr_number: 140,
    reviewed_payload_head_sha: 'c'.repeat(40),
  },
  members: [
    {
      repository: 'meijer1973/4veco-lessen',
      pr_number: 34,
      reviewed_payload_head_sha: '7'.repeat(40),
    },
  ],
  decision_scope: 'Graph-transfer presentation source and generated lesson output.',
  merge_order: 'CI_SELECTED',
  invalidation_conditions: [
    'member_payload_not_ancestor',
    'substantive_member_change',
    'bundle_membership_change',
    'effective_product_change',
    'no_green_intermediate_order',
  ],
};

describe('human bundle authorization', () => {
  test('accepts canonical bundle authorization without comment id in JSON', () => {
    const summary = validateBundleAuthorizationRecord(record, {
      expectedBundleId: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
      expectedControllerRepo: 'meijer1973/4veco-platform',
      expectedControllerPr: 140,
    });

    expect(summary.ok).toBe(true);
    expect(summary.marker).toBe(markerFor(record));
  });

  test('parses marker plus machine JSON and rejects prose-only approval', () => {
    const body = `${markerFor(record)}\n\n\`\`\`json\n${JSON.stringify(record, null, 2)}\n\`\`\`\n`;
    expect(parseBundleAuthorizationComment(body)).toEqual(record);
    expect(() => parseBundleAuthorizationComment('APPROVED, please merge both PRs')).toThrow(
      'bundle authorization marker not found'
    );
  });

  test('renders the canonical bundle payload authorization handoff label', () => {
    const body = renderBundleAuthorizationTemplate(record);

    expect(body).toContain('HUMAN_DECISION: APPROVE_BUNDLE_AND_MERGE');
    expect(body).toContain('AUTHORIZATION_TYPE: BUNDLE_PAYLOAD_AUTHORIZATION');
    expect(body).toContain(`CONTROLLER_REVIEWED_PAYLOAD_HEAD: ${record.controller.reviewed_payload_head_sha}`);
    expect(body).toContain(`MEMBER_1_REVIEWED_PAYLOAD_HEAD: ${record.members[0].reviewed_payload_head_sha}`);
    expect(parseBundleAuthorizationComment(body)).toEqual(record);
  });

  test('rejects marker and JSON bundle mismatch', () => {
    const body = `<!-- 4veco-human-bundle-authorization:OTHER -->\n\n\`\`\`json\n${JSON.stringify(record, null, 2)}\n\`\`\``;
    expect(() => parseBundleAuthorizationComment(body)).toThrow('bundle authorization marker bundle_id mismatch');
  });

  test('rejects unsupported authorization fields including self-declared comment id', () => {
    const summary = validateBundleAuthorizationRecord({
      ...record,
      authorization_comment_id: 123,
    });
    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('unsupported bundle authorization field: authorization_comment_id');
  });

  test('derives comment binding from GitHub metadata', () => {
    const metadata = validateBundleAuthorizationCommentMetadata({
      id: 98765,
      issue_url: 'https://api.github.com/repos/meijer1973/4veco-platform/issues/140',
      user: { login: 'meijer1973' },
      author_association: 'OWNER',
    }, record, {
      expectedRepo: 'meijer1973/4veco-platform',
      expectedPr: 140,
      expectedCommentId: 98765,
      expectedAuthorLogin: 'meijer1973',
    });

    expect(metadata.ok).toBe(true);
  });
});
