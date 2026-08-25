#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..', '..');
const CAPTURE_ID = '112-normal-practice-desktop-light-opgaven';
const LESSON_SHA = 'f09fd6e88edc5049b026b16b0158e7e188091d2d';
const STARTING_PLATFORM_SHA = 'e2deb65fd9dd2e6f2f2c3b89e6572dc6a0fbe5e8';
const CANONICAL_RUNNER_BLOB = 'ee749d3edefa4b73b274ce38a62b16286f2816e8';
const canonicalRunner = path.join(__dirname, 'capture-scale-proof-3p-readiness-product-path-proof-1.js');
const historicalScreenshot = path.join(
  ROOT,
  'reports',
  'sprints',
  'SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1-screenshots',
  `${CAPTURE_ID}.png`
);
const outputDir = path.join(
  ROOT,
  'reports',
  'sprints',
  'Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-screenshots'
);

function fail(message) {
  throw new Error(message);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || ROOT,
    encoding: 'utf8',
    env: options.env || process.env,
    maxBuffer: 1024 * 1024 * 30,
  });
  if (result.status !== 0) {
    fail(`${command} ${args.join(' ')} failed: ${String(result.stderr || result.stdout || '').trim()}`);
  }
  return String(result.stdout || '').trim();
}

function parseArgs(argv) {
  const options = { lessonRoot: null };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--lesson-root') options.lessonRoot = path.resolve(argv[++index]);
    else fail(`unknown argument: ${argv[index]}`);
  }
  if (!options.lessonRoot) fail('--lesson-root is required');
  return options;
}

function replaceOnce(source, expected, replacement, label) {
  const first = source.indexOf(expected);
  if (first < 0 || source.indexOf(expected, first + expected.length) >= 0) {
    fail(`canonical runner ${label} patch point must occur exactly once`);
  }
  return `${source.slice(0, first)}${replacement}${source.slice(first + expected.length)}`;
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function compareScreenshots(renewedScreenshot) {
  const historicalBuffer = fs.readFileSync(historicalScreenshot);
  const renewedBuffer = fs.readFileSync(renewedScreenshot);
  const historical = await sharp(historicalBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const renewed = await sharp(renewedBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (JSON.stringify(historical.info) !== JSON.stringify(renewed.info)) fail('historical and renewed PNG metadata differ');

  const diff = Buffer.alloc(historical.data.length);
  let changedPixels = 0;
  let maximumChannelDelta = 0;
  let channelDeltaTotal = 0;
  for (let offset = 0; offset < historical.data.length; offset += 4) {
    let pixelChanged = false;
    for (let channel = 0; channel < 4; channel += 1) {
      const delta = Math.abs(historical.data[offset + channel] - renewed.data[offset + channel]);
      diff[offset + channel] = delta;
      if (delta > 0) {
        pixelChanged = true;
        channelDeltaTotal += delta;
        maximumChannelDelta = Math.max(maximumChannelDelta, delta);
      }
    }
    if (pixelChanged) changedPixels += 1;
    diff[offset + 3] = 255;
  }

  const totalPixels = historical.info.width * historical.info.height;
  const diffPath = path.join(outputDir, `${CAPTURE_ID}-pixel-diff.png`);
  await sharp(diff, { raw: historical.info }).png().toFile(diffPath);
  return {
    method: 'decoded_rgba_absolute_difference',
    historical_sha256: sha256(historicalBuffer),
    renewed_sha256: sha256(renewedBuffer),
    byte_equal: historicalBuffer.equals(renewedBuffer),
    width: historical.info.width,
    height: historical.info.height,
    changed_pixels: changedPixels,
    total_pixels: totalPixels,
    changed_pixel_ratio: changedPixels / totalPixels,
    maximum_channel_delta: maximumChannelDelta,
    mean_absolute_channel_delta: channelDeltaTotal / (totalPixels * 4),
    diff_path: path.relative(ROOT, diffPath).replace(/\\/g, '/'),
    diff_sha256: sha256(fs.readFileSync(diffPath)),
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const lessonRepo = run('git', ['rev-parse', '--show-toplevel'], { cwd: options.lessonRoot });
  const lessonHead = run('git', ['rev-parse', 'HEAD'], { cwd: lessonRepo });
  if (lessonHead !== LESSON_SHA) fail(`lesson HEAD must be ${LESSON_SHA}, got ${lessonHead}`);
  if (run('git', ['status', '--porcelain'], { cwd: lessonRepo })) fail('lesson worktree must be clean');
  const platformBase = run('git', ['rev-parse', `${STARTING_PLATFORM_SHA}^{commit}`]);
  if (platformBase !== STARTING_PLATFORM_SHA) fail('authorized starting platform commit is unavailable');
  const runnerBlob = run('git', ['hash-object', canonicalRunner]);
  if (runnerBlob !== CANONICAL_RUNNER_BLOB) fail(`canonical runner blob mismatch: ${runnerBlob}`);

  fs.mkdirSync(outputDir, { recursive: true });
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'y1-rendered-renewal-'));
  const transformedRunner = path.join(__dirname, `.capture-y1-renewal-${process.pid}.js`);
  try {
    let source = fs.readFileSync(canonicalRunner, 'utf8');
    source = replaceOnce(
      source,
      "const screenshotDir = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-screenshots`);",
      `const screenshotDir = ${JSON.stringify(outputDir)};`,
      'screenshot output'
    );
    source = replaceOnce(
      source,
      "const screenshotManifestMdPath = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-screenshot-manifest.md`);",
      `const screenshotManifestMdPath = ${JSON.stringify(path.join(scratch, 'screenshot-manifest.md'))};`,
      'Markdown manifest output'
    );
    source = replaceOnce(
      source,
      "const routeInventoryMdPath = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-route-inventory.md`);",
      `const routeInventoryMdPath = ${JSON.stringify(path.join(scratch, 'route-inventory.md'))};`,
      'route inventory output'
    );
    source = replaceOnce(
      source,
      "const proofJsonPath = path.join(platformRoot, 'reports', 'json', 'scale-proof-3p-readiness-product-path-proof-1-proof.json');",
      `const proofJsonPath = ${JSON.stringify(path.join(scratch, 'capture-run-proof.json'))};`,
      'proof output'
    );
    source = replaceOnce(
      source,
      '  const cases = buildCases();',
      `  const cases = buildCases().filter((item) => item.id === ${JSON.stringify(CAPTURE_ID)});\n  if (cases.length !== 1) throw new Error(\`Expected exactly one Y1 renewal capture, found \${cases.length}\`);`,
      'capture selection'
    );
    source = replaceOnce(
      source,
      "JSON.stringify({ schema_version: 1, sprint_id: SPRINT_ID, generated, screenshots: captures }, null, 2)",
      "JSON.stringify({ schema_version: 1, sprint_id: SPRINT_ID, generated, browser: { product: version.Browser, protocol_version: version['Protocol-Version'], user_agent: version['User-Agent'], v8_version: version['V8-Version'], webkit_version: version['WebKit-Version'] }, screenshots: captures }, null, 2)",
      'browser metadata'
    );
    fs.writeFileSync(transformedRunner, source, 'utf8');
    const captureOutput = run(process.execPath, [transformedRunner], {
      env: { ...process.env, LESSON_BOOK_ROOT: options.lessonRoot },
    });
    process.stdout.write(`${captureOutput}\n`);

    const manifestPath = path.join(outputDir, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (!Array.isArray(manifest.screenshots) || manifest.screenshots.length !== 1) fail('capture manifest must contain exactly one screenshot');
    if (manifest.screenshots[0].id !== CAPTURE_ID) fail('capture manifest contains the wrong capture');
    const renewedScreenshot = path.join(outputDir, `${CAPTURE_ID}.png`);
    const comparison = await compareScreenshots(renewedScreenshot);
    const comparisonPath = path.join(outputDir, 'comparison.json');
    fs.writeFileSync(comparisonPath, `${JSON.stringify({
      schema_version: 1,
      capture_id: CAPTURE_ID,
      captured_at: manifest.generated,
      platform_starting_sha: STARTING_PLATFORM_SHA,
      lesson_sha: LESSON_SHA,
      canonical_runner_blob: CANONICAL_RUNNER_BLOB,
      capture_count: 1,
      browser: manifest.browser,
      comparison,
    }, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify(comparison, null, 2));
  } finally {
    fs.rmSync(transformedRunner, { force: true });
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
