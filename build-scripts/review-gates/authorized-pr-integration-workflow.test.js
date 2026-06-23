const fs = require('fs');

describe('authorized PR integration workflow', () => {
  const workflow = fs.readFileSync('.github/workflows/authorized-pr-integration.yml', 'utf8');

  test('serializes all authorized integrations through one repository-wide group', () => {
    expect(workflow).toContain('group: 4veco-main-integration');
    expect(workflow).toContain('queue: max');
    expect(workflow).toContain('cancel-in-progress: false');
  });

  test('runs trusted workflow code from main instead of PR branch code', () => {
    expect(workflow).toContain('Checkout trusted main workflow code');
    expect(workflow).toContain('ref: main');
  });

  test('passes PR number and authorization comment id to integration script', () => {
    expect(workflow).toContain('--authorization-comment-id');
    expect(workflow).toContain('integrate-authorized-pr.js');
    expect(workflow).toContain("'120'");
  });
});
