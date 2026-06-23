const fs = require('fs');

describe('cross-repo bundle workflow safety', () => {
  const platformCi = fs.readFileSync('.github/workflows/platform-ci.yml', 'utf8');
  const bundleWorkflow = fs.readFileSync('.github/workflows/cross-repo-bundle-compatibility.yml', 'utf8');
  const authorizedBundleWorkflow = fs.readFileSync('.github/workflows/authorized-bundle-integration.yml', 'utf8');

  test('required validate-platform no longer substitutes matching lesson branches', () => {
    expect(platformCi).not.toContain('Use matching lessen branch when available');
    expect(platformCi).not.toContain('github.head_ref');
    expect(platformCi).toContain('repository: meijer1973/4veco-lessen');
  });

  test('bundle workflow checks platform-first, lesson-first, and final exact-ref states', () => {
    expect(bundleWorkflow).toContain('platform-first');
    expect(bundleWorkflow).toContain('lesson-first');
    expect(bundleWorkflow).toContain('bundle-final');
    expect(bundleWorkflow).toContain('platform_candidate_sha');
    expect(bundleWorkflow).toContain('lesson_candidate_sha');
    expect(bundleWorkflow).toContain('cross-repo-bundle-compatibility.js summarize');
  });

  test('bundle workflow records machine-readable JSON and uses deterministic summary gate', () => {
    expect(bundleWorkflow).toContain('bundle-results');
    expect(bundleWorkflow).toContain('--commands-json');
    expect(bundleWorkflow).toContain('--check');
    expect(bundleWorkflow).toContain('bundle-summary.json');
  });

  test('authorized bundle workflow uses the serialized main integration lane', () => {
    expect(authorizedBundleWorkflow).toContain('group: 4veco-main-integration');
    expect(authorizedBundleWorkflow).toContain('queue: max');
    expect(authorizedBundleWorkflow).toContain('cancel-in-progress: false');
    expect(authorizedBundleWorkflow).toContain('Checkout trusted main workflow code');
    expect(authorizedBundleWorkflow).toContain('integrate:authorized-bundle');
    expect(authorizedBundleWorkflow).toContain('compatibility_workflow_run_id');
    expect(authorizedBundleWorkflow).toContain('bundle-summary.json');
  });
});
