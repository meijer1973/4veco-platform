#!/usr/bin/env node
// HOW TO ADAPT: keep the maintenance scope explicit; unknown paths use product CI.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../..');
const PLAN = path.resolve(ROOT, '../ci-artifacts/maintenance-plan.json');
const SUSPENDED_TESTS = 'check-y1-golden-rollout-wave-1(-current)?\\.test\\.js$';
const CORE_TESTS = ['build-scripts/ci/maintenance-ci.test.js', 'build-scripts/ci/check-y1-product-evidence.test.js'];
const ALLOWED = [
  /^AGENTS\.md$/, /^\.github\/ci-maintenance\.json$/,
  /^\.github\/workflows\/(platform-ci|authorized-pr-integration|authorized-bundle-integration|cross-repo-bundle-compatibility)\.yml$/,
  /^build-scripts\/(ci|review-gates)\//,
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
  if (!options.active || options.forceFull || paths.length === 0) return 'product';
  return paths.every(file => file === 'package.json'
    ? options.packageOnlyCi === true
    : ALLOWED.some(pattern => pattern.test(file))) ? 'maintenance' : 'product';
}
function plan(base, head, options = {}) {
  if (![base, head].every(ref => /^[0-9a-f]{40}$/i.test(ref)) || /^0+$/.test(base)) throw new Error('CI requires exact nonzero base/head commit SHAs');
  if (git('rev-parse', 'HEAD').trim() !== head) throw new Error('CI checkout does not match the declared head');
  git('cat-file', '-e', `${base}^{commit}`);
  const paths = git('diff', '--no-renames', '--name-only', '-z', base, head).split('\0').filter(Boolean);
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, '.github/ci-maintenance.json'), 'utf8'));
  if (typeof config.active !== 'boolean' || config.effort !== 'CI-CLEANUP-20260909' || !/^\d{4}-\d{2}-\d{2}$/.test(config.review_date)) throw new Error('Invalid maintenance configuration');
  const packageOnlyCi = !paths.includes('package.json') || packageOnlyCiChanges(git('show', `${base}:package.json`), git('show', `${head}:package.json`));
  return { profile: classify(paths, { active: config.active, packageOnlyCi, ...options }), base, head, paths,
    effort: config.effort, review_date: config.review_date, review_due: new Date().toISOString().slice(0, 10) >= config.review_date,
    suspended_historical_tests: SUSPENDED_TESTS, policy: config.policy };
}
function check(result) {
  if (result.profile !== 'maintenance') throw new Error('Focused checks require a maintenance plan');
  if (git('rev-parse', 'HEAD').trim() !== result.head) throw new Error('Head moved after CI selection');
  const changedJs = [];
  for (const file of result.paths) {
    const full = path.join(ROOT, file);
    if (/\.[cm]?js$/.test(file)) changedJs.push(file);
    if (!fs.existsSync(full)) continue; // Deletions remain in the scope decision.
    if (/\.[cm]?js$/.test(file)) {
      run(process.execPath, ['--check', full]);
    } else if (file.endsWith('.json')) JSON.parse(fs.readFileSync(full, 'utf8'));
    else if (/\.ya?ml$/.test(file)) require('js-yaml').safeLoad(fs.readFileSync(full, 'utf8'), { json: false });
  }
  git('diff', '--check', result.base, result.head);
  run(process.execPath, [path.join(ROOT, 'node_modules/jest/bin/jest.js'), '--runInBand',
    '--findRelatedTests', ...new Set([...changedJs, ...CORE_TESTS]),
    `--testPathIgnorePatterns=${SUSPENDED_TESTS}`], { stdio: 'inherit' });
}
function main(argv) {
  if (argv[0] === 'plan') {
    const result = plan(argv[1] || process.env.CI_BASE_SHA, argv[2] || process.env.CI_HEAD_SHA,
      { forceFull: process.env.CI_FORCE_FULL === 'true' });
    fs.mkdirSync(path.dirname(PLAN), { recursive: true });
    fs.writeFileSync(PLAN, JSON.stringify(result, null, 2) + '\n');
    if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `maintenance=${result.profile === 'maintenance'}\n`);
    if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      `## CI profile: ${result.profile}\n\nHead: \`${result.head}\`; ${result.paths.length} changed paths.\n\n` +
      (result.profile === 'maintenance' ? 'Runs syntax/configuration checks and affected tests. Full-suite, presentation, historical-product and index-freshness execution are suspended for this maintenance change.\n\n' : 'Runs product/source tests and rendering checks. The temporary Y1 workflow-structure exception is reported separately.\n\n') +
      `Policy: ${result.policy}. Review point: ${result.review_date}${result.review_due ? ' — review due' : ''}.\n`);
    console.log(JSON.stringify(result, null, 2));
  } else if (argv[0] === 'check') check(JSON.parse(fs.readFileSync(PLAN, 'utf8')));
  else throw new Error('Usage: maintenance-ci.js plan [base-sha head-sha] | check');
}
if (require.main === module) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { classify, packageOnlyCiChanges, plan, check, SUSPENDED_TESTS };
