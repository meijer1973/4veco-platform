'use strict';

const {
  findRuleFailures,
  checkParagraphWorkflowWording,
} = require('./check-paragraph-workflow-wording');

describe('check-paragraph-workflow-wording', () => {
  test('active workflow surfaces preserve the two-lane and full-route contract', () => {
    expect(checkParagraphWorkflowWording()).toEqual({
      ok: true,
      files_checked: 7,
      failures: [],
    });
  });

  test('flags stale publisher-only PDF wording', () => {
    const failures = findRuleFailures(
      'fixture.md',
      'PDF output belongs to Part A / publisher-print unless a future decision changes it.',
      []
    );

    expect(failures).toHaveLength(1);
    expect(failures[0]).toMatch(/contains stale wording/);
  });

  test('flags a missing baseline-versus-product distinction', () => {
    const failures = findRuleFailures(
      'fixture.md',
      'The validator has fourteen files.',
      [/14-file baseline is not the complete product route/i],
      []
    );

    expect(failures).toHaveLength(1);
    expect(failures[0]).toMatch(/missing required wording/);
  });
});
