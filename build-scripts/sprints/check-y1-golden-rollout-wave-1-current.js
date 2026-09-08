#!/usr/bin/env node
/**
 * HOW TO ADAPT: retain the historical Y1 verifier and capture claims. Changes to
 * this successor require a new committed source payload, a regenerated source
 * certificate, full current-pair validation and independent L4 review.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const yaml = require('js-yaml');
const historical = require('./check-y1-golden-rollout-wave-1');

const ROOT = path.resolve(__dirname, '../..');
const LESSON_ROOT = path.resolve(ROOT, '../4veco-lessen');
const BASELINE = '96416b6b5bd57094576e9aba0a42d682584ec479';
const SNAPSHOT = 'f09fd6e88edc5049b026b16b0158e7e188091d2d';
const REPAIR_ID = 'Y1-GOLDEN-ROLLOUT-WAVE-1-DESCENDANT-VERIFIER';
const CERTIFICATE = 'reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-descendant-verifier-certificate.json';
const COMMAND = 'check:y1-golden-rollout-wave-1-current';
const SOURCE_PATHS = [
  'build-scripts/sprints/check-y1-golden-rollout-wave-1-current.js',
  'build-scripts/sprints/check-y1-golden-rollout-wave-1-current.test.js',
  'build-scripts/sprints/write-y1-golden-rollout-wave-1-current-evidence.js',
];
const WIRING_PATHS = ['package.json', '.github/workflows/platform-ci.yml', 'package-lock.json'];
const YAML_VERSION = '3.14.2';
const check = (ok, message) => { if (!ok) throw new Error(message); };
const digest = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
// Only immutable commit/blob bytes are cached; current refs are resolved anew.
const blobCache = new Map();
const initialObservations = new Set();

function git(args, root = ROOT) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
  check(result.status === 0, `Git verification failed: ${String(result.stderr || '').trim()}`);
  return result.stdout.trim();
}

function resolve(ref, root = ROOT) {
  check(typeof ref === 'string' && ref.length > 0, 'missing commit ref');
  return git(['rev-parse', '--verify', '--end-of-options', `${ref}^{commit}`], root);
}

function ancestor(base, head, root = ROOT) {
  check(spawnSync('git', ['merge-base', '--is-ancestor', base, head], { cwd: root }).status === 0,
    `commit must descend from recorded baseline: ${base} -> ${head}`);
}

function bytes(ref, relativePath, root = ROOT) {
  const key = `${root}\0${ref}\0${relativePath}`;
  const immutable = /^[0-9a-f]{40}$/.test(ref);
  if (immutable && blobCache.has(key)) return blobCache.get(key);
  const oid = historical.gitBlob(ref, relativePath, root);
  check(oid, `committed artifact missing: ${relativePath}`);
  const result = spawnSync('git', ['cat-file', 'blob', oid], { cwd: root, maxBuffer: 40 * 1024 * 1024 });
  check(result.status === 0, `cannot read committed artifact: ${relativePath}`);
  const record = { path: relativePath, blob_oid: oid, sha256: digest(result.stdout), content: result.stdout };
  if (immutable) blobCache.set(key, record);
  return record;
}

function binding(ref, relativePath) {
  const { content, ...record } = bytes(ref, relativePath);
  return record;
}

function jsonAt(ref, relativePath) {
  return JSON.parse(bytes(ref, relativePath).content.toString('utf8'));
}

function historicalPaths() {
  const delta = jsonAt(BASELINE, historical.PATHS.deltaProof);
  return [...new Set([
    'build-scripts/sprints/check-y1-golden-rollout-wave-1.js',
    'build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js',
    ...historical.SOURCE_MANIFEST_ARTIFACTS.map((item) => item.path),
    ...delta.platform_equal_paths.map((item) => item.path),
    ...['proof', 'deltaProof', 'result', 'renderedRenewal', 'sourceManifest',
      'prerequisiteVisualReview', 'packet', 'bundleUrls'].map((key) => historical.PATHS[key]),
  ])].sort();
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  return value;
}
const same = (left, right) => JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));

// Parse the complete document so key ordering cannot hide job conditions and
// duplicate YAML keys cannot silently replace the protected job or invocation.
function workflowContract(workflow) {
  check(require('js-yaml/package.json').version === YAML_VERSION, 'runtime YAML parser version changed');
  const document = yaml.safeLoad(workflow, { json: false });
  check(document && typeof document === 'object' && !Array.isArray(document), 'invalid workflow document');
  const { jobs, ...topLevel } = document;
  const job = jobs?.['validate-platform'];
  check(job && typeof job === 'object' && !Array.isArray(job), 'required validate-platform job missing');
  const { steps, ...jobSettings } = job;
  check(Array.isArray(steps), 'required validate-platform steps missing');
  function step(name) {
    const matches = steps.filter((block) => block?.name === name);
    check(matches.length === 1, `required workflow step missing or duplicated: ${name}`);
    return matches[0];
  }
  const commands = Object.values(jobs).flatMap((item) => (item?.steps || []).flatMap((block) =>
    String(block?.run || '').match(/\bnpm(?:\.cmd)? run check:y1-golden-rollout-wave-1(?:-current)?(?=\s|$)/g) || []));
  check(commands.length === 1 && commands[0] === `npm run ${COMMAND}`, 'workflow must invoke exactly one current Y1 verifier');
  const platformCheckout = step('Checkout platform repository');
  const lessonCheckout = step('Checkout lessen repository');
  const normalization = step('Normalize repository line endings');
  const y1 = step('Validate Y1 Golden rollout wave');
  check(steps.indexOf(normalization) > Math.max(steps.indexOf(platformCheckout), steps.indexOf(lessonCheckout))
    && steps.indexOf(normalization) < steps.indexOf(y1), 'runtime normalization must follow checkouts and precede Y1 validation');
  return {
    top_level: topLevel,
    job_settings: jobSettings,
    platform_checkout: platformCheckout,
    lesson_checkout: lessonCheckout,
    runtime_normalization: normalization,
    y1,
  };
}

function expectedWiring() {
  const original = bytes(BASELINE, WIRING_PATHS[1]).content.toString('utf8');
  return workflowContract(original
    .replace('npm run check:y1-golden-rollout-wave-1 --', `npm run ${COMMAND} --`)
    .replace('checkout-index -f -- reports/url-index.md', 'checkout-index -f --all'));
}

function validateWiring(packageText, workflowText, lockText = fs.readFileSync(path.join(ROOT, 'package-lock.json'), 'utf8')) {
  const pkg = JSON.parse(packageText);
  const lock = JSON.parse(lockText);
  const scripts = pkg.scripts;
  check(scripts?.[COMMAND] === `node ${SOURCE_PATHS[0]}`, 'current Y1 npm mapping changed');
  check(scripts?.['check:y1-golden-rollout-wave-1'] === 'node build-scripts/sprints/check-y1-golden-rollout-wave-1.js',
    'historical Y1 npm mapping changed');
  check(pkg.devDependencies?.['js-yaml'] === YAML_VERSION && lock.packages?.['']?.devDependencies?.['js-yaml'] === YAML_VERSION,
    'current YAML parser dependency pin changed');
  const baselineLock = jsonAt(BASELINE, 'package-lock.json');
  check(same(lock.packages?.['node_modules/js-yaml'], baselineLock.packages['node_modules/js-yaml']), 'current YAML parser lock binding changed');
  check(same(workflowContract(workflowText), expectedWiring()), 'current Y1 workflow contract changed');
}

function validateLesson(currentRef) {
  const current = resolve(currentRef, LESSON_ROOT);
  ancestor(SNAPSHOT, current, LESSON_ROOT);
  const proof = jsonAt(BASELINE, historical.PATHS.scaleProof);
  const dependencies = historical.deriveLessonDependencies(proof, SNAPSHOT, current);
  const equal = historical.attestEqualPaths(dependencies.equal_paths,
    { historical_snapshot: SNAPSHOT, current_head: current }, LESSON_ROOT, 'current lesson rendered input');
  check(equal.length > 0 && equal.every((item) => item.status === 'equal'),
    `current lesson rendered inputs changed or missing: ${equal.filter((item) => item.status !== 'equal').map((item) => item.path).join(', ')}`);
  const routes = dependencies.existence_only_paths.map((relativePath) => ({
    path: relativePath,
    historical_blob: historical.gitBlob(SNAPSHOT, relativePath, LESSON_ROOT),
    current_blob: historical.gitBlob(current, relativePath, LESSON_ROOT),
  }));
  check(routes.length > 0 && routes.every((item) => item.historical_blob && item.current_blob), 'current lesson route destination missing');
  return { historical_lesson_snapshot_sha: SNAPSHOT, current_lesson_sha: current,
    rendered_input_count: equal.length, route_target_count: routes.length,
    rendered_inputs_unchanged: true, route_destinations_present: true,
    rendered_inputs: equal, route_targets: routes };
}

function buildCertificate(sourceRef, initialLessonRef) {
  const source = resolve(sourceRef);
  ancestor(BASELINE, source);
  const observedLesson = resolve(initialLessonRef, LESSON_ROOT);
  // The initial observation is immutable provenance, not the live lesson check.
  if (!initialObservations.has(observedLesson)) {
    validateLesson(observedLesson);
    initialObservations.add(observedLesson);
  }
  for (const relativePath of historicalPaths()) {
    check(bytes(BASELINE, relativePath).sha256 === bytes(source, relativePath).sha256,
      `historical artifact changed: ${relativePath}`);
  }
  validateWiring(...WIRING_PATHS.map((relativePath) => bytes(source, relativePath).content.toString('utf8')));
  return {
    schema_version: 1, repair_id: REPAIR_ID,
    binding_model: 'historical_capture_and_current_descendant_verification',
    baseline_platform_sha: BASELINE, source_payload_sha: source,
    historical_lesson_snapshot_sha: SNAPSHOT,
    initial_observation: { lesson_sha: observedLesson, informational_only: true },
    successor_sources: SOURCE_PATHS.map((relativePath) => binding(source, relativePath)),
    wiring_provenance: WIRING_PATHS.map((relativePath) => binding(source, relativePath)),
    retained_historical_artifacts: historicalPaths().map((relativePath) => binding(BASELINE, relativePath)),
  };
}

function validateCertificate(record, currentRef) {
  check(record?.schema_version === 1 && record.repair_id === REPAIR_ID, 'successor certificate identity mismatch');
  check(/^[0-9a-f]{40}$/.test(record.source_payload_sha || ''), 'successor source payload must be an exact commit SHA');
  check(/^[0-9a-f]{40}$/.test(record.initial_observation?.lesson_sha || ''), 'initial lesson observation must be an exact commit SHA');
  const source = resolve(record.source_payload_sha);
  const current = resolve(currentRef);
  ancestor(source, current);
  const expected = buildCertificate(source, record.initial_observation.lesson_sha);
  check(JSON.stringify(record) === JSON.stringify(expected), 'successor certificate inventory, hashes or binding is stale/malformed');
  for (const item of [...record.successor_sources, ...record.retained_historical_artifacts]) {
    check(JSON.stringify(binding(current, item.path)) === JSON.stringify(item), `bound current artifact changed: ${item.path}`);
  }
  validateWiring(...WIRING_PATHS.map((relativePath) => bytes(current, relativePath).content.toString('utf8')));
  return { source_payload_sha: source, current_platform_sha: current };
}

function verifyRuntimeCheckout(record, head) {
  for (const relativePath of [...SOURCE_PATHS, ...WIRING_PATHS, ...historicalPaths(), CERTIFICATE]) {
    const local = path.join(ROOT, relativePath);
    check(fs.existsSync(local), `runtime checkout file missing: ${relativePath}`);
    const actual = fs.readFileSync(local);
    const expected = bytes(head, relativePath);
    const actualHash = digest(actual);
    check(actualHash === expected.sha256,
      `runtime checkout differs from committed head: ${relativePath}; expected_sha256=${expected.sha256}; actual_sha256=${actualHash}; matches_lf_to_crlf_conversion=${actual.equals(Buffer.from(expected.content.toString('utf8').replace(/\n/g, '\r\n')))}`);
  }
  check(JSON.stringify(JSON.parse(fs.readFileSync(path.join(ROOT, CERTIFICATE), 'utf8'))) === JSON.stringify(record), 'runtime certificate differs');
}

function parseArgs(argv) {
  const allowed = new Set(['--event-mode', '--scope-mode', '--base', '--head', '--lesson-base', '--lesson-head']);
  const seen = new Set();
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    check(allowed.has(key) && !seen.has(key), `unsupported or duplicate current verifier option: ${key}`);
    check(argv[index + 1] && !argv[index + 1].startsWith('--'), `missing value for ${key}`);
    seen.add(key);
  }
  const options = historical.parseArgs(argv);
  check(options.scopeMode === 'auto', 'current verifier requires automatic scope validation');
  check(options.lessonHead === 'HEAD', 'current verifier must use the actual lesson checkout HEAD');
  return options;
}

function run(options) {
  // Re-parse a fixed active contract even for programmatic callers.
  const active = parseArgs(['--event-mode', options.eventMode, '--scope-mode', options.scopeMode,
    '--base', options.base, '--head', options.head, '--lesson-head', options.lessonHead]);
  const head = resolve(active.head);
  const record = jsonAt(head, CERTIFICATE);
  const source = validateCertificate(record, head);
  verifyRuntimeCheckout(record, head);
  const previous = historical.run({ ...active, lessonHead: SNAPSHOT });
  const lesson = validateLesson('HEAD');
  return {
    ok: true, repair_id: REPAIR_ID, ...source,
    event_mode: active.eventMode, platform_event_base_sha: previous.delta.base_sha,
    historical_validation: {
      passed: true, lesson_snapshot_sha: SNAPSHOT,
      platform_payload_sha: previous.exact_head_delta.platform_payload_sha,
      platform_rendered_input_count: previous.exact_head_delta.platform_equal_path_count,
      verified_rendered_renewal_count: previous.exact_head_delta.verified_rendered_renewal_count,
      first_viewport_only: true, below_fold_exercises_attested: false,
    },
    current_lesson_validation: lesson,
    new_capture_performed: false,
  };
}

if (require.main === module) {
  try { process.stdout.write(`${JSON.stringify(run(parseArgs(process.argv.slice(2))), null, 2)}\n`); }
  catch (error) { process.stderr.write(`Y1 current verifier failed: ${error.message}\n`); process.exitCode = 1; }
}

module.exports = { BASELINE, SNAPSHOT, CERTIFICATE, SOURCE_PATHS, WIRING_PATHS, ROOT, LESSON_ROOT,
  buildCertificate, validateCertificate, validateLesson, validateWiring, workflowContract,
  historicalPaths, verifyRuntimeCheckout, parseArgs, run };
