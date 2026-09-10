#!/usr/bin/env node
'use strict';
// HOW TO ADAPT: add relevant paragraph checks here, retaining exact paired SHA
// checks. This focused proof supplements required platform CI (lesson main).
const fs = require('fs');
const path = require('path');
const os = require('os');
const { committedFiles, materialize } = require('../../scripts/lib/committed-paragraph-files');
const { spawnSync, execFileSync } = require('child_process');
const evidence = require('../../scripts/lib/part-a-review-evidence');
const lane = require('../workflows/check-paragraph-lane-scope');
const ROOT = path.resolve(__dirname, '../..');
function git(root, args) { return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim(); }
function exactCheckout(root, sha) {
  if (!/^[a-f0-9]{40}$/.test(sha || '')) throw new Error('Require a full lowercase 40-character commit SHA');
  if (git(root, ['rev-parse', 'HEAD']) !== sha) throw new Error(`Checkout does not match declared commit: ${root}`);
  if (git(root, ['status', '--porcelain', '--untracked-files=normal'])) throw new Error(`Checkout contains uncommitted inputs: ${root}`);
}
function run(options) {
  if (options.platform) throw new Error('Run this CLI from the platform checkout being attested; alternate platform roots are not supported');
  const platform = ROOT, lessons = path.resolve(options.lessons);
  exactCheckout(platform, options.platformSha);
  exactCheckout(lessons, options.lessonSha);
  if (!/^[a-f0-9]{40}$/.test(options.lessonBase || '')) throw new Error('Require an exact lesson base SHA');
  git(lessons, ['merge-base', '--is-ancestor', options.lessonBase, options.lessonSha]);
  const inputs = committedFiles(lessons, options.lessonSha, options.paragraph);
  const changedPaths = lane.changedPathsFromGit(options.lessonBase, options.lessonSha, lessons);
  const qualityRefChanges = lane.qualityRefChangesFromGit(options.lessonBase, options.lessonSha, lessons, changedPaths);
  const scope = lane.checkLaneScope({ lane: 'textbook', changedPaths, qualityRefChanges });
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'paired-paragraph-inputs-'));
  const folder = path.join(temporary, path.posix.basename(options.paragraph));
  try {
    materialize(lessons, inputs, folder);
    const result = spawnSync(process.execPath, [path.join(platform, 'scripts/validate-paragraph.js'), '--mode', 'part-a', '--profile', 'student-web', folder], { encoding: 'utf8' });
    const review = evidence.checkReview(folder);
    return { schema_version: 1, platform_sha: options.platformSha, lesson_sha: options.lessonSha,
      lesson_base_sha: options.lessonBase, paragraph: options.paragraph,
      input_source: 'isolated committed Git blobs; no generation or local overlays',
      committed_input_count: inputs.length,
      scope, review, validation_exit_code: result.status,
      validation_output: `${result.stdout || ''}${result.stderr || ''}${result.error || ''}`.split(folder).join(`${options.lessonSha}:${options.paragraph}`),
      decision: scope.ok && review.ok && result.status === 0 ? 'PASS' : 'FAIL',
      scope_note: 'Focused Part A inventory, current review evidence and textbook lane diff. Does not replace independent rendered/content review, source authority, required platform CI, or publication authorization.' };
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}
function main(env = process.env) {
  const report = run({ lessons: env.LESSON_ROOT, platformSha: env.PLATFORM_SHA,
    lessonSha: env.LESSON_SHA, lessonBase: env.LESSON_BASE_SHA, paragraph: env.PARAGRAPH_PATH });
  const output = env.PARAGRAPH_CI_OUTPUT;
  if (output) fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  return report.decision === 'PASS' ? 0 : 1;
}
module.exports = { exactCheckout, run, main };
if (require.main === module) {
  try { process.exitCode = main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
