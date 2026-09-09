#!/usr/bin/env node
// HOW TO ADAPT: keep the maintenance scope explicit; unknown paths use product CI.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../..');
const PLAN = path.resolve(ROOT, '../ci-artifacts/maintenance-plan.json');
// These sealed suites audit the archived workflow, not the live CI contract.
const HISTORICAL_WORKFLOW_TESTS = require('../../jest.config.cjs').testPathIgnorePatterns[1];
const POLICY = 'docs/review/maintenance-workflow.md';
const CORE_TESTS = ['build-scripts/ci/maintenance-ci.test.js', 'build-scripts/ci/check-y1-product-evidence.test.js'];
const CI_TOOLS = new Set(['maintenance-ci', 'platform-ci-evidence', 'check-agent-branch-safety',
  'check-agent-worktree-safety', 'check-branch-protection', 'check-evidence-line-endings']);
const REVIEW_TOOLS = new Set([
  'apply-pr-readiness-decision', 'apply-bundle-readiness-decision', 'authorized-pr-integration-workflow',
  'check-active-governance-wording', 'check-governance-freshness', 'check-human-payload-authorization',
  'check-human-bundle-authorization', 'check-integration-lineage', 'check-integration-lane-capability',
  'cross-repo-bundle-workflow', 'cross-repo-bundle-compatibility', 'finalization-freshness-proof',
  'gh-json-input', 'integrate-authorized-pr', 'integrate-authorized-bundle', 'pr-readiness-router',
  'pr-readiness-governance-surfaces', 'refresh-bundle-agent-indexes', 'review-pr-readiness',
  'review-throughput-fields', 'route-and-apply-pr-readiness',
]);
const ALLOWED = [
  /^AGENTS\.md$/,
  /^\.github\/workflows\/(platform-ci|authorized-pr-integration|authorized-bundle-integration|cross-repo-bundle-compatibility)\.yml$/,
  /^build-scripts\/(ci|review-gates)\/fixtures\//,
  /^build-scripts\/reports\/(github-agent-index|check-agent-index-freshness)(\.test)?\.js$/,
  /^docs\/(maintenance|review)\//,
  /^agents\/(lead-reviewer-agent|pr-readiness-reviewer-agent)\.md$/,
  /^reports\/github-agent-index-(platform|lessen)\.(json|md)$/,
];
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, ...options });
  if (result.status !== 0) throw new Error(`${command} failed (${result.status}): ${result.stderr || result.error || ''}`);
  return result.stdout;
}
const git = (...args) => run('git', args);
function packageOnlyCiChanges(before, after) {
  const left = JSON.parse(before), right = JSON.parse(after);
  const scripts = new Set([...Object.keys(left.scripts || {}), ...Object.keys(right.scripts || {})]);
  for (const key of scripts) {
    if (left.scripts?.[key] !== right.scripts?.[key]
      && !/^(test$|check:platform$|check:ci-|ci:|check:y1-golden-rollout-wave-1-product$|check:.*(integration|readiness|authorization|governance)|integrate:|review:pr-readiness$|apply:|route-and-apply:|finalization:)/.test(key)) return false;
  }
  delete left.scripts; delete right.scripts;
  return JSON.stringify(left) === JSON.stringify(right);
}
function classify(paths, options = {}) {
  if (options.forceFull) return 'product';
  if (options.eventName === 'push') return 'smoke';
  if (paths.length === 0) return 'product';
  return paths.every(file => file === 'package.json'
    ? options.packageOnlyCi === true
    : ALLOWED.some(pattern => pattern.test(file)) || knownTool(file)) ? 'maintenance' : 'product';
}
function knownTool(file) {
  const match = /^build-scripts\/(ci|review-gates)\/([^/]+?)(?:\.test)?\.js$/.exec(file);
  return Boolean(match && (match[1] === 'ci' ? CI_TOOLS : REVIEW_TOOLS).has(match[2]));
}
function plan(base, head, options = {}) {
  if (![base, head].every(ref => /^[0-9a-f]{40}$/i.test(ref)) || /^0+$/.test(base)) throw new Error('CI requires exact nonzero base/head commit SHAs');
  if (git('rev-parse', 'HEAD').trim() !== head) throw new Error('CI checkout does not match the declared head');
  git('cat-file', '-e', `${base}^{commit}`);
  const paths = git('diff', '--no-renames', '--name-only', '-z', base, head).split('\0').filter(Boolean);
  const packageOnlyCi = !paths.includes('package.json') || packageOnlyCiChanges(git('show', `${base}:package.json`), git('show', `${head}:package.json`));
  return { profile: classify(paths, { packageOnlyCi, ...options }), base, head, paths,
    archived_workflow_test_suites: HISTORICAL_WORKFLOW_TESTS, policy: POLICY };
}
function jestArgs(paths, root = ROOT) {
  const args = ['--runInBand'];
  // Jest discards missing paths and unresolved dependency edges. A deletion
  // needs the complete Jest suite so surviving importers cannot disappear.
  if (paths.some(file => /\.[cm]?js$/.test(file) && !fs.existsSync(path.join(root, file)))) return args;
  const tests = new Set(CORE_TESTS);
  const workflowTests = {
    'platform-ci.yml': ['ci/platform-ci-evidence', 'review-gates/cross-repo-bundle-workflow',
      'workflows/check-book-outline-currentness', 'workflows/check-book2-target-authority-remediation',
      'workflows/check-part-a-exercise-authoring-contract', 'workflows/check-blueprint-pedagogical-boundaries'],
    'authorized-pr-integration.yml': ['review-gates/authorized-pr-integration-workflow'],
    'authorized-bundle-integration.yml': ['review-gates/cross-repo-bundle-workflow'],
    'cross-repo-bundle-compatibility.yml': ['review-gates/cross-repo-bundle-workflow'],
  };
  for (const file of paths) {
    if (/\.[cm]?js$/.test(file)) tests.add(file);
    if (file.startsWith('.github/workflows/')) {
      for (const name of workflowTests[path.basename(file)] || []) tests.add(`build-scripts/${name}.test.js`);
    }
    // These inputs are commonly read with fs and are invisible to Jest's graph.
    if (/\.(json|ya?ml)$/.test(file)) {
      const owner = file.startsWith('build-scripts/ci/') ? 'ci'
        : /^(build-scripts\/review-gates|docs\/review)\//.test(file) ? 'review-gates' : null;
      if (owner) {
        const directory = `build-scripts/${owner}`;
        for (const name of fs.readdirSync(path.join(root, directory), { recursive: true })) {
          if (/\.test\.[cm]?js$/.test(name)) tests.add(`${directory}/${name}`);
        }
      }
    }
  }
  return [...args, '--findRelatedTests', ...tests];
}
function check(result) {
  if (!['maintenance', 'smoke'].includes(result.profile)) throw new Error('Focused checks require a maintenance or smoke plan');
  if (git('rev-parse', 'HEAD').trim() !== result.head) throw new Error('Head moved after CI selection');
  for (const file of result.paths) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) continue; // Deletions remain in the scope decision.
    if (/\.[cm]?js$/.test(file)) {
      run(process.execPath, ['--check', full]);
    } else if (file.endsWith('.json')) JSON.parse(fs.readFileSync(full, 'utf8'));
    else if (/\.ya?ml$/.test(file)) require('js-yaml').safeLoad(fs.readFileSync(full, 'utf8'), { json: false });
  }
  git('diff', '--check', result.base, result.head);
  const args = jestArgs(result.profile === 'smoke' ? [] : result.paths);
  const message = result.profile === 'smoke' ? 'Post-merge smoke: checking syntax/configuration and core CI tests; PR product validation is not repeated.'
    : args.includes('--findRelatedTests') ? 'Running affected Jest tests.'
    : 'Deleted JavaScript: running the complete current Jest suite; archived workflow suites remain separate.';
  console.log(message);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\n${message}\n`);
  run(process.execPath, [path.join(ROOT, 'node_modules/jest/bin/jest.js'), ...args], { stdio: 'inherit' });
}
function main(argv) {
  if (argv[0] === 'plan') {
    const result = plan(argv[1] || process.env.CI_BASE_SHA, argv[2] || process.env.CI_HEAD_SHA,
      { forceFull: process.env.CI_FORCE_FULL === 'true', eventName: process.env.GITHUB_EVENT_NAME });
    fs.mkdirSync(path.dirname(PLAN), { recursive: true });
    fs.writeFileSync(PLAN, JSON.stringify(result, null, 2) + '\n');
    if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `maintenance=${result.profile !== 'product'}\n`);
    if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      `## CI profile: ${result.profile}\n\nHead: \`${result.head}\`; ${result.paths.length} changed paths.\n\n` +
      (result.profile === 'maintenance' ? 'Runs syntax/configuration checks and affected tests, with a full Jest fallback for JavaScript deletions. Presentation and historical product proofs are outside this maintenance scope.\n\n'
        : result.profile === 'smoke' ? 'Post-merge syntax/configuration and core CI smoke tests. Product validation belongs to the reviewed PR; it is not repeated here.\n\n'
          : 'Runs the current product/source suite and rendering checks. Historical capture integrity and current reuse are validated separately from the archived workflow contract.\n\n') +
      `Policy: ${result.policy}. Index freshness is advisory.\n`);
    console.log(JSON.stringify(result, null, 2));
  } else if (argv[0] === 'check') check(JSON.parse(fs.readFileSync(PLAN, 'utf8')));
  else throw new Error('Usage: maintenance-ci.js plan [base-sha head-sha] | check');
}
if (require.main === module) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { classify, packageOnlyCiChanges, plan, check, jestArgs, HISTORICAL_WORKFLOW_TESTS };
