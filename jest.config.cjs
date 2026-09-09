// Current suite shared by local npm commands and CI. Audit the sealed workflow
// suites in a worktree at the certificate's recorded source; see maintenance policy.
module.exports = {
  maxWorkers: 2,
  testPathIgnorePatterns: [
    '/node_modules/',
    'check-y1-golden-rollout-wave-1(-current)?\\.test\\.js$',
  ],
};
