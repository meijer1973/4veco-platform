const fs = require('fs');

describe('authorized PR integration workflow', () => {
  const workflow = fs.readFileSync('.github/workflows/authorized-pr-integration.yml', 'utf8');
  const integrationRunner = fs.readFileSync('build-scripts/review-gates/integrate-authorized-pr.js', 'utf8');

  test('serializes all authorized integrations through one repository-wide group', () => {
    expect(workflow).toContain('group: 4veco-main-integration');
    expect(workflow).toContain('queue: max');
    expect(workflow).toContain('cancel-in-progress: false');
  });

  test('runs trusted workflow code from main instead of PR branch code', () => {
    expect(workflow).toContain('Checkout trusted main workflow code');
    expect(workflow).toContain('ref: main');
  });

  test('does not use integration-authorized as the workflow job name', () => {
    expect(workflow).toContain('name: authorized-pr-integration-runner');
    expect(workflow).not.toMatch(/\n\s+name:\s*integration-authorized\b/);
  });

  test('reserves integration-authorized for the explicit commit status context', () => {
    expect(workflow).not.toContain('context: integration-authorized');
    expect(integrationRunner).toContain("const INTEGRATION_CONTEXT = 'integration-authorized'");
    expect(integrationRunner).toContain('setCommitStatus');
  });

  test('dry-run workflow path passes validation mode without authorizing a reusable status', () => {
    expect(workflow).toContain("if ($env:DRY_RUN -eq 'true')");
    expect(workflow).toContain("$scriptArgs += '--dry-run'");
    expect(integrationRunner).toContain('if (options.dryRun)');
    expect(integrationRunner).toContain('return { dry_run: true, state, sha, context: INTEGRATION_CONTEXT }');
  });

  test('passes PR number and authorization comment id to integration script', () => {
    expect(workflow).toContain('--authorization-comment-id');
    expect(workflow).toContain('integrate-authorized-pr.js');
    expect(workflow).toContain("'120'");
  });
});
