const GOVERNANCE_SURFACE_PATTERNS = Object.freeze([
  /^AGENTS\.md$/i,
  /^agents\/README\.md$/i,
  /^agents\/lead-reviewer-agent\.md$/i,
  /^agents\/pr-readiness-reviewer-agent\.md$/i,
  /^package\.json$/i,
  /^build-scripts\/ci\/check-branch-protection\.js$/i,
  /^build-scripts\/review-gates\/pr-readiness-router(?:\.test)?\.js$/i,
  /^build-scripts\/review-gates\/pr-readiness-governance-surfaces\.js$/i,
  /^build-scripts\/review-gates\/review-pr-readiness\.js$/i,
  /^build-scripts\/review-gates\/apply-pr-readiness-decision\.js$/i,
  /^build-scripts\/review-gates\/review-throughput-fields(?:\.test)?\.js$/i,
  /^build-scripts\/sprints\/check-review-throughput-packet(?:\.test)?\.js$/i,
  /^docs\/review\/pr-readiness-/i,
  /^docs\/review\/pr-throughput-policy\.md$/i,
  /^docs\/review\/review-packet-throughput\.schema\.json$/i,
  /^\.github\/workflows\//i,
]);

const GOVERNANCE_SURFACE_TEST_PATHS = Object.freeze([
  'AGENTS.md',
  'agents/lead-reviewer-agent.md',
  'agents/pr-readiness-reviewer-agent.md',
  'package.json',
  'build-scripts/ci/check-branch-protection.js',
  'build-scripts/review-gates/pr-readiness-router.js',
  'build-scripts/review-gates/pr-readiness-governance-surfaces.js',
  'build-scripts/review-gates/review-pr-readiness.js',
  'build-scripts/review-gates/apply-pr-readiness-decision.js',
  'build-scripts/review-gates/review-throughput-fields.js',
  'build-scripts/sprints/check-review-throughput-packet.js',
  'docs/review/pr-readiness-routing-policy.md',
  'docs/review/pr-throughput-policy.md',
  'docs/review/review-packet-throughput.schema.json',
  '.github/workflows/platform-ci.yml',
]);

const EVIDENCE_TAIL_PATTERNS = Object.freeze([
  /^reports\/sprints\/[^/]+-lead-review-round-?\d+(?:-recheck\d+)?\.md$/i,
  /^reports\/sprints\/[^/]+-lead-review-(?:assignment|corrections|disposition|terminology-delta)\.md$/i,
  /^reports\/sprints\/[^/]+-command-log\.(?:md|jsonl)$/i,
  /^reports\/github-agent-index-[^/]+\.(?:json|md)$/i,
  /^reports\/internal-dashboard\/(?:dashboard-data\.json|index\.html)$/i,
  /^reports\/url-index\.md$/i,
]);

function normalizePath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\.\.\/4veco-platform\//, '');
}

function matchesAny(pathValue, patterns) {
  const normalized = normalizePath(pathValue);
  return patterns.some((pattern) => pattern.test(normalized));
}

function isGovernanceSurface(pathValue) {
  return matchesAny(pathValue, GOVERNANCE_SURFACE_PATTERNS);
}

function isEvidenceTailPath(pathValue) {
  const normalized = normalizePath(pathValue);
  return (
    matchesAny(normalized, EVIDENCE_TAIL_PATTERNS) &&
    !isGovernanceSurface(normalized) &&
    !/\.(?:js|cjs|mjs|ts|tsx|jsx|jsonschema)$/i.test(normalized)
  );
}

module.exports = {
  EVIDENCE_TAIL_PATTERNS,
  GOVERNANCE_SURFACE_PATTERNS,
  GOVERNANCE_SURFACE_TEST_PATHS,
  isEvidenceTailPath,
  isGovernanceSurface,
  normalizePath,
};
