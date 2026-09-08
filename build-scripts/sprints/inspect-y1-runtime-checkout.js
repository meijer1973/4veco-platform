#!/usr/bin/env node
// HOW TO ADAPT: keep this early checkpoint read-only and source-bound. It checks
// checkout bytes before tests; the complete current verifier remains mandatory.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../..');
const CERTIFICATE = 'reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-descendant-verifier-certificate.json';
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function git(args, optional = false) {
  const result = spawnSync('git', args, { cwd: ROOT, maxBuffer: 40 * 1024 * 1024 });
  if (result.status !== 0 && !(optional && result.status === 1)) throw new Error(result.stderr.toString('utf8'));
  return result.stdout;
}

function inspect() {
  if (process.argv.length !== 2) throw new Error('checkout inspection accepts no options');
  const head = git(['rev-parse', 'HEAD']).toString('utf8').trim();
  const certificate = JSON.parse(git(['cat-file', 'blob', `${head}:${CERTIFICATE}`]).toString('utf8'));
  const paths = [...new Set([...certificate.successor_sources, ...certificate.wiring_provenance,
    ...certificate.retained_historical_artifacts, { path: CERTIFICATE }].map((item) => item.path))];
  const mismatches = [];
  for (const relativePath of paths) {
    const expected = git(['cat-file', 'blob', `${head}:${relativePath}`]);
    const file = path.join(ROOT, relativePath);
    const actual = fs.existsSync(file) ? fs.readFileSync(file) : null;
    if (!actual || hash(actual) !== hash(expected)) mismatches.push({
      path: relativePath, expected_sha256: hash(expected), actual_sha256: actual && hash(actual),
      matches_lf_to_crlf_conversion: Boolean(actual && actual.equals(Buffer.from(expected.toString('utf8').replace(/\n/g, '\r\n')))),
    });
  }
  const report = {
    ok: mismatches.length === 0, checkpoint: 'before_dependencies_and_tests', platform_head_sha: head,
    git_version: git(['--version']).toString('utf8').trim(),
    configuration: Object.fromEntries(['core.autocrlf', 'core.eol', 'core.attributesFile'].map((key) =>
      [key, git(['config', '--show-origin', '--show-scope', '--get', key], true).toString('utf8').trim() || null])),
    checkout_eol: git(['ls-files', '--eol', '--', ...paths]).toString('utf8').trim().split('\n'),
    effective_attributes: git(['check-attr', 'text', 'eol', '--', ...paths]).toString('utf8').trim().split('\n'),
    checked_path_count: paths.length, mismatches,
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!report.ok) process.exitCode = 1;
}

if (require.main === module) {
  try { inspect(); }
  catch (error) { process.stderr.write(`Y1 early checkout check failed: ${error.message}\n`); process.exitCode = 1; }
}
