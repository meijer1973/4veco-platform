#!/usr/bin/env node
// HOW TO ADAPT: validate archived provenance at its source, then current reuse.
// Live workflow behavior is covered by the current CI tests, not the old capture.
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const assert = require('assert/strict');
const current = require('../sprints/check-y1-golden-rollout-wave-1-current');
const historical = require('../sprints/check-y1-golden-rollout-wave-1');
const BOOK1 = Object.freeze({
  path: 'build-scripts/platform/build-landing-page.js',
  before: '42ca3d531cd30c0215bd03839f3d94964f38a1477689d1759a517bcb1b5eb31a',
  after: '61975625af6aee453e7d7255671355fd437b69cfa5749dddd3c15e726d9e3d58',
  platformBase: '6d010e98610b5f7d1288af322cd228e160d39ada',
  lessonBase: '10b2bab1ab1dc9592f2ea1e967b6cc2cd7c281c2',
  revision: 'book1-second-edition-20261002',
  manifest: 'references/owned/book1-second-edition-2026/revision.json',
  pin: 'build-scripts/books/book1-second-edition-pin.json',
  review: 'reports/review-gates/book1-second-edition-20261002/independent-review.md',
});
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

function verifyBook1Review(readBlob) {
  const bytes = readBlob(BOOK1.manifest);
  const manifest = JSON.parse(bytes);
  const pin = JSON.parse(readBlob(BOOK1.pin));
  const review = readBlob(BOOK1.review).toString('utf8');
  assert.equal(manifest.revision, BOOK1.revision, 'Book 1 successor revision differs');
  assert.equal(pin.revision, BOOK1.revision, 'Book 1 successor pin differs');
  assert.equal(manifest.platform_base, BOOK1.platformBase, 'Book 1 platform baseline differs');
  assert.equal(manifest.lessons_base, BOOK1.lessonBase, 'Book 1 lesson baseline differs');
  assert.equal(pin.manifest_sha256, digest(bytes), 'Book 1 successor manifest is not pinned');
  const rows = manifest.platform.filter(row => row.path === BOOK1.path);
  assert.equal(rows.length, 1, 'Book 1 landing source must have exactly one current binding');
  assert.equal(rows[0].sha256, BOOK1.after, 'Book 1 landing source is not the bounded successor');
  assert.equal(rows[0].bytes, readBlob(BOOK1.path).length, 'Book 1 landing source byte count differs');
  assert.match(review, /^Verdict: PASS(?: with flags)?$/m, 'Book 1 independent review does not pass');
  assert.ok(review.includes('Review manifest SHA256: `' + digest(bytes) + '`'),
    'Book 1 independent review does not bind the current manifest');
  return { revision: BOOK1.revision, manifest_sha256: digest(bytes), review_path: BOOK1.review };
}

function verifyBindings(record, readBlob, options = {}) {
  const successors = [];
  for (const binding of [...record.successor_sources, ...record.retained_historical_artifacts]) {
    const actual = digest(readBlob(binding.path));
    if (actual === binding.sha256) continue;
    // One independently reviewed entry guard is a current source successor,
    // not a rewritten historical capture. All other bindings stay byte-exact.
    assert.ok(binding.path === BOOK1.path && binding.sha256 === BOOK1.before && actual === BOOK1.after
      && typeof options.readBaseline === 'function',
    `Bound Y1 source or historical artifact changed: ${binding.path}`);
    assert.equal(digest(options.readBaseline(binding.path)), binding.sha256,
      'Original Y1 landing source is not preserved at the accepted baseline');
    const review = verifyBook1Review(readBlob);
    successors.push({ path: binding.path, historical_sha256: binding.sha256, current_sha256: actual,
      historical_platform_sha: BOOK1.platformBase, change: 'Book 1 second-edition entry overwrite guard', ...review });
  }
  return successors;
}

function verifyEventScope(options, delta, policy) {
  historical.validateEventRefs(options, delta, current.ROOT);
  const selected = historical.selectScopeDelta(delta, policy, current.ROOT);
  const scope = historical.validateChangedEntries(selected.entries, policy, options.scopeMode);
  return { event_mode: options.eventMode, base_sha: delta.base_sha, head_sha: delta.head_sha,
    scope_attestation_triggered: scope.triggered, changed_paths: scope.changed_paths };
}

function verifyCurrentLesson() {
  try { return current.validateLesson('HEAD'); }
  catch (original) {
    const classroom = require('../books/book1-classroom-scope');
    const scope = classroom.verify({root: current.ROOT, lessons: current.LESSON_ROOT, requireTracked: true});
    // A historical capture does not attest today's deliberately retired links.
    // Admit only the separately checked finite retirement, then retain the
    // unchanged original proof at the accepted pre-retirement lesson commit.
    if (!scope.passed) throw new Error(`${original.message}; classroom retirement verification failed: ${
      scope.failures?.join('; ') || 'no scope diagnostic returned'}`, {cause: original});
    if (!scope.removals.length || !scope.entry_changes.length) throw original;
    const baseline = current.validateLesson(classroom.LESSON_BASE);
    return {historical_lesson_validation: baseline, current_lesson_sha: execFileSync('git', ['rev-parse', 'HEAD'],
      {cwd: current.LESSON_ROOT, encoding: 'utf8'}).trim(),
      historical_capture_attests_current_retired_pages: false,
      rendered_inputs_unchanged: false, new_capture_performed: false,
      retirement_successor: {revision: classroom.REVISION, lesson_base: classroom.LESSON_BASE,
        removals: scope.removals, entry_changes: scope.entry_changes,
        scope_verified: true, textbook_and_historical_evidence_unchanged: true}};
  }
}

function run(argv) {
  const options = current.parseArgs(argv);
  const git = args => execFileSync('git', args, { cwd: current.ROOT, maxBuffer: 40 * 1024 * 1024 });
  const head = git(['rev-parse', '--verify', `${options.head}^{commit}`]).toString().trim();
  const delta = historical.changedEntries(options.base, head, current.ROOT);
  historical.validateEventRefs(options, delta, current.ROOT);
  const record = JSON.parse(git(['show', `${head}:${current.CERTIFICATE}`]).toString());
  // buildCertificate validates the exact recorded source workflow and lockfile.
  assert.deepEqual(record, current.buildCertificate(record.source_payload_sha, record.initial_observation.lesson_sha));
  git(['merge-base', '--is-ancestor', record.source_payload_sha, head]);
  const successors = verifyBindings(record, file => git(['show', `${head}:${file}`]), {
    readBaseline: file => git(['show', `${BOOK1.platformBase}:${file}`]),
  });
  current.validateRuntimeAttributes(head);
  current.verifyRuntimeCheckout(record, head);
  let historicalOptions = { ...options, lessonHead: current.SNAPSHOT };
  let eventValidation;
  if (successors.length) {
    git(['merge-base', '--is-ancestor', BOOK1.platformBase, head]);
    // Retain actual-event and changed-scope validation before verifying the
    // immutable capture at its unchanged predecessor. Never pass off that
    // historical result as a capture or exact generator-byte proof of HEAD.
    const policy = JSON.parse(git(['show', `${head}:${historical.PATHS.wave}`])).changed_path_policy;
    eventValidation = verifyEventScope(options, delta, policy);
    historicalOptions = { eventMode: 'manual', scopeMode: 'auto', base: BOOK1.platformBase,
      head: BOOK1.platformBase, lessonHead: current.SNAPSHOT };
  }
  const proof = historical.run(historicalOptions);
  if (eventValidation?.scope_attestation_triggered) {
    const tail = historical.validateEvidenceTail(proof.exact_head_delta.platform_payload_sha, head);
    eventValidation.evidence_tail_paths = tail.entries.flatMap(historical.entryPaths);
  }
  return { ok: true, current_platform_sha: head, current_lesson_validation: verifyCurrentLesson(),
    historical_validation: { passed: true, platform_payload_sha: proof.exact_head_delta.platform_payload_sha,
      verified_through_platform_sha: proof.exact_head_delta.platform_exact_head_sha,
      first_viewport_only: true, below_fold_exercises_attested: false },
    current_source_successors: successors,
    ...(eventValidation ? { current_event_validation: eventValidation } : {}),
    workflow_provenance: { status: 'validated_at_recorded_source', source_sha: record.source_payload_sha,
      current_workflow_attested_by_historical_capture: false },
    new_capture_performed: false };
}
if (require.main === module) {
  try { console.log(JSON.stringify(run(process.argv.slice(2)), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { BOOK1, verifyBook1Review, verifyBindings, verifyEventScope, verifyCurrentLesson, run };
