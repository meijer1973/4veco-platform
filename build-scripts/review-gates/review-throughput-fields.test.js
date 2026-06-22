const {
  fullHumanGateThroughputFields,
  leadReviewAutonomousThroughputFields,
  mechanicalAutonomousThroughputFields,
  ownerDecisionGateThroughputFields,
  ownerPreapprovedAutonomousThroughputFields,
  reviewThroughputFields,
} = require('./review-throughput-fields');
const { validatePacket } = require('../sprints/check-review-throughput-packet');

function explicitProof(sha) {
  return {
    ci: {
      reviewed_commit_sha: sha,
      conclusion: 'success',
      required_contexts: ['validate-platform'],
      checks: [{ name: 'validate-platform', conclusion: 'SUCCESS' }],
    },
    checkers: [
      {
        command: 'npm.cmd run check:platform',
        status: 'passed',
      },
    ],
    lead_review: {
      path: 'reports/sprints/REVIEW-THROUGHPUT-2-lead-review-round2.md',
      result: 'PASS',
      reviewed_commit_sha: sha,
    },
  };
}

describe('review-throughput-fields', () => {
  test('creates a valid L4 full-human packet envelope', () => {
    const packet = {
      schema_version: 1,
      gate_id: 'GATE-EXAMPLE',
      sprint_id: 'EXAMPLE-1',
      ...fullHumanGateThroughputFields({
        gateId: 'GATE-EXAMPLE',
        changedPaths: [
          'reports/review-gates/GATE-EXAMPLE/review-packet.json',
          '.\\reports\\review-gates\\GATE-EXAMPLE\\review-packet.md',
        ],
      }),
    };

    expect(packet.review_autonomy.level).toBe('L4');
    expect(packet.human_decision_required).toBe(true);
    expect(packet.auto_merge_allowed_after_ci).toBe(false);
    expect(packet.changed_paths).toEqual([
      'reports/review-gates/GATE-EXAMPLE/review-packet.json',
      'reports/review-gates/GATE-EXAMPLE/review-packet.md',
    ]);
    expect(validatePacket(packet)).toBe(true);
  });

  test('creates a valid L3 owner-decision packet envelope', () => {
    const packet = {
      schema_version: 1,
      gate_id: 'GATE-GENERATED',
      sprint_id: 'EXAMPLE-2',
      ...ownerDecisionGateThroughputFields({
        packetId: 'GATE-GENERATED',
        changedPaths: ['reports/review-gates/GATE-GENERATED/review-packet.json'],
      }),
    };

    expect(packet.pr_throughput_class).toBe('generated_output');
    expect(packet.review_autonomy.level).toBe('L3');
    expect(validatePacket(packet)).toBe(true);
  });

  test('requires changed-path evidence even for helper-created human gates', () => {
    expect(() =>
      fullHumanGateThroughputFields({
        gateId: 'GATE-EXAMPLE',
        changedPaths: [],
      })
    ).toThrow('changedPaths must be a non-empty array');
  });

  test('rejects unsupported review levels at helper boundary', () => {
    expect(() =>
      reviewThroughputFields({
        packetId: 'GATE-EXAMPLE',
        prThroughputClass: 'normal_sprint',
        authorityClass: 'standard',
        changedPaths: ['reports/review-gates/GATE-EXAMPLE/review-packet.json'],
        reviewAutonomy: { level: 'L5' },
        humanDecisionRequired: true,
        autoMergeAllowedAfterCi: false,
      })
    ).toThrow('reviewAutonomy.level must be L0, L1, L2, L3, or L4');
  });

  test('creates a valid L0 mechanical autonomous packet envelope', () => {
    const reviewedCommitSha = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const packet = mechanicalAutonomousThroughputFields({
      packetId: 'MECH-1',
      changedPaths: ['reports/sprints/MECH-result.md'],
      proof: explicitProof(reviewedCommitSha),
    });

    expect(packet.review_autonomy.level).toBe('L0');
    expect(packet.human_decision_required).toBe(false);
    expect(packet.auto_merge_allowed_after_ci).toBe(false);
    expect(validatePacket(packet)).toBe(true);
  });

  test('creates a valid L1 lead-review autonomous packet envelope', () => {
    const reviewedCommitSha = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
    const packet = leadReviewAutonomousThroughputFields({
      packetId: 'NORMAL-1',
      changedPaths: ['build-scripts/review-gates/example.js'],
      proof: explicitProof(reviewedCommitSha),
    });

    expect(packet.pr_throughput_class).toBe('normal_sprint');
    expect(packet.review_autonomy.level).toBe('L1');
    expect(validatePacket(packet)).toBe(true);
  });

  test('creates a valid L2 owner-preapproved autonomous packet envelope', () => {
    const reviewedCommitSha = 'cccccccccccccccccccccccccccccccccccccccc';
    const packet = ownerPreapprovedAutonomousThroughputFields({
      packetId: 'PREAPPROVED-1',
      changedPaths: ['reports/fixtures/generated-output-refresh.json'],
      proof: explicitProof(reviewedCommitSha),
      ownerPreapproval: {
        lane: 'tiny-generated-output-refresh',
        evidence: 'owner approval recorded 2026-06-14',
      },
    });

    expect(packet.review_autonomy.level).toBe('L2');
    expect(packet.review_autonomy.owner_preapproval.lane).toBe('tiny-generated-output-refresh');
    expect(validatePacket(packet)).toBe(true);
  });

  test('requires explicit owner preapproval for L2 helper', () => {
    expect(() =>
      ownerPreapprovedAutonomousThroughputFields({
        packetId: 'PREAPPROVED-NEGATIVE',
        changedPaths: ['reports/fixtures/generated-output-refresh.json'],
        proof: explicitProof('dddddddddddddddddddddddddddddddddddddddd'),
      })
    ).toThrow('ownerPreapproval is required for L2 throughput fields');
  });

  test('autonomous helpers reject missing explicit proof', () => {
    expect(() =>
      mechanicalAutonomousThroughputFields({
        packetId: 'MECH-MISSING-PROOF',
        changedPaths: ['reports/sprints/MECH-result.md'],
      })
    ).toThrow('proof is required for autonomous throughput fields');
  });
});
