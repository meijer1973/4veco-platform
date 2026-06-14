const {
  fullHumanGateThroughputFields,
  ownerDecisionGateThroughputFields,
  reviewThroughputFields,
} = require('./review-throughput-fields');
const { validatePacket } = require('../sprints/check-review-throughput-packet');

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
});
