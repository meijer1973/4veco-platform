#!/usr/bin/env node
// HOW TO ADAPT: temporary CI adapter; preserve the sealed verifiers and evidence.
// The owner suspended workflow-shape preservation, not historical product truth.
const fs = require('fs');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const assert = require('assert/strict');
const current = require('../sprints/check-y1-golden-rollout-wave-1-current');
const historical = require('../sprints/check-y1-golden-rollout-wave-1');
function verifyBindings(record, readBlob) {
  for (const binding of [...record.successor_sources, ...record.retained_historical_artifacts]) {
    assert.equal(crypto.createHash('sha256').update(readBlob(binding.path)).digest('hex'), binding.sha256,
      `Bound Y1 source or historical artifact changed: ${binding.path}`);
  }
}
function run(argv) {
  const maintenance = JSON.parse(fs.readFileSync(`${current.ROOT}/.github/ci-maintenance.json`, 'utf8'));
  assert(maintenance.active && maintenance.effort === 'CI-CLEANUP-20260909', 'Temporary workflow exception is not active');
  const options = current.parseArgs(argv);
  const git = args => execFileSync('git', args, { cwd: current.ROOT, maxBuffer: 40 * 1024 * 1024 });
  const head = git(['rev-parse', '--verify', `${options.head}^{commit}`]).toString().trim();
  const record = JSON.parse(git(['show', `${head}:${current.CERTIFICATE}`]).toString());
  assert.deepEqual(record, current.buildCertificate(record.source_payload_sha, record.initial_observation.lesson_sha));
  git(['merge-base', '--is-ancestor', record.source_payload_sha, head]);
  verifyBindings(record, file => git(['show', `${head}:${file}`]));
  current.validateRuntimeAttributes(head);
  current.verifyRuntimeCheckout(record, head);
  const proof = historical.run({ ...options, lessonHead: current.SNAPSHOT || 'f09fd6e88edc5049b026b16b0158e7e188091d2d' });
  return { ok: true, current_platform_sha: head, current_lesson_validation: current.validateLesson('HEAD'),
    historical_validation: { passed: true, platform_payload_sha: proof.exact_head_delta.platform_payload_sha,
      first_viewport_only: true, below_fold_exercises_attested: false },
    workflow_preservation: { status: 'suspended', authority: 'docs/maintenance/ci-cleanup-20260909.md' },
    new_capture_performed: false };
}
if (require.main === module) {
  try { console.log(JSON.stringify(run(process.argv.slice(2)), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { verifyBindings, run };
