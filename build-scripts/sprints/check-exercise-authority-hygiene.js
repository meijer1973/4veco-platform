#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen');
const MANIFEST_PATH = 'references/data/exercise-authority-hygiene-manifest.json';

function fail(message) {
  console.error(`EXERCISE-AUTHORITY-HYGIENE check failed: ${message}`);
  process.exit(1);
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^\.?\//, '').replace(/\/+$/, '');
}

function fullPath(file) {
  return path.resolve(ROOT, file);
}

function exists(file) {
  return fs.existsSync(fullPath(file));
}

function read(file) {
  const resolved = fullPath(file);
  if (!fs.existsSync(resolved)) fail(`missing file: ${file}`);
  return fs.readFileSync(resolved, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function sha256(file) {
  const resolved = fullPath(file);
  if (!fs.existsSync(resolved)) fail(`missing hash target: ${file}`);
  return crypto.createHash('sha256').update(fs.readFileSync(resolved)).digest('hex').toUpperCase();
}

function fileSize(file) {
  return fs.statSync(fullPath(file)).size;
}

function collectStrings(value, output = []) {
  if (typeof value === 'string') output.push(normalizePath(value));
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, output));
  else if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectStrings(item, output));
  }
  return output;
}

function git(args, cwd = ROOT) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    fail(`git ${args.join(' ')} failed`);
  }
  return result.stdout.trim();
}

function assertClean(repoCwd, paths, label) {
  const result = spawnSync('git', ['status', '--porcelain', '--', ...paths], {
    cwd: repoCwd,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    fail(`git status failed for ${label}`);
  }
  if (result.stdout.trim()) fail(`${label} has changes:\n${result.stdout.trim()}`);
}

function manifest() {
  const data = readJson(MANIFEST_PATH);
  if (data.schema_version !== 1) fail('manifest schema_version must be 1');
  if (data.status !== 'current') fail('manifest status must be current');
  if (data.updated_by_sprint !== 'EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1') {
    fail('manifest updated_by_sprint mismatch');
  }
  for (const [key, value] of Object.entries(data.authority_boundaries || {})) {
    if (value !== false) fail(`authority boundary must remain false: ${key}`);
  }
  return data;
}

function checkExemplarAuthority(data) {
  for (const item of data.exemplar_authority || []) {
    const canonical = normalizePath(item.canonical_path);
    const alias = normalizePath(item.historical_alias_path);
    if (!canonical || !alias) fail(`${item.id} exemplar authority must name canonical and alias paths`);
    if (!exists(canonical)) fail(`${item.id} canonical path missing: ${canonical}`);
    if (!exists(alias)) fail(`${item.id} historical alias path missing: ${alias}`);
    if (normalizePath(item.active_agent_routing_path) !== canonical) {
      fail(`${item.id} active_agent_routing_path must equal canonical path`);
    }
    if (item.preserve_historical_copy !== true) fail(`${item.id} must preserve historical copy`);

    for (const source of item.current_authority_sources || []) {
      const strings = collectStrings(readJson(source));
      if (!strings.includes(canonical)) fail(`${source} must cite canonical exemplar path ${canonical}`);
      if (strings.includes(alias)) fail(`${source} must not cite historical alias as active authority ${alias}`);
    }

    const aliasReadme = read(path.join(alias, 'README.md'));
    if (!/Historical alias/i.test(aliasReadme) || !aliasReadme.includes(item.canonical_path)) {
      fail(`${alias}/README.md must identify itself as a historical alias and cite the canonical path`);
    }

    for (const file of item.same_content_files || []) {
      const left = path.join(canonical, file);
      const right = path.join(alias, file);
      if (sha256(left) !== sha256(right)) fail(`${item.id} expected identical file differs: ${file}`);
    }
    for (const file of item.known_historical_differences || []) {
      const left = path.join(canonical, file);
      const right = path.join(alias, file);
      if (sha256(left) === sha256(right)) fail(`${item.id} expected historical difference is identical: ${file}`);
    }
  }
}

function checkGoldenFixtures(data) {
  const config = data.golden_fixtures || {};
  if (normalizePath(config.active_fixture_root) !== 'build-scripts/sprints/fixtures') {
    fail('golden fixture active root must be build-scripts/sprints/fixtures');
  }
  if (normalizePath(config.report_snapshot_root) !== 'reports/fixtures/golden-ticket-layout') {
    fail('golden fixture report snapshot root must be reports/fixtures/golden-ticket-layout');
  }

  const fixtureIndex = readJson(config.ui_fixture_index);
  for (const fixture of fixtureIndex.fixtures || []) {
    const htmlFile = fixture && fixture.payload && fixture.payload.html_file;
    if (htmlFile && !normalizePath(htmlFile).startsWith(`${normalizePath(config.active_fixture_root)}/`)) {
      fail(`${config.ui_fixture_index} fixture ${fixture.id} must use active fixture root`);
    }
  }

  for (const pair of config.duplicate_pairs || []) {
    const active = normalizePath(pair.active_fixture);
    const snapshot = normalizePath(pair.report_snapshot);
    if (!exists(active)) fail(`active Golden fixture missing: ${active}`);
    if (!exists(snapshot)) fail(`report Golden fixture snapshot missing: ${snapshot}`);
    const activeHash = sha256(active);
    const snapshotHash = sha256(snapshot);
    if (activeHash !== pair.sha256) fail(`${active} hash mismatch in manifest`);
    if (snapshotHash !== pair.sha256) fail(`${snapshot} hash mismatch in manifest`);
    if (activeHash !== snapshotHash) fail(`${pair.id} active fixture and report snapshot must be byte-identical`);
  }

  for (const fixture of config.active_only_fixtures || []) {
    const fixturePath = normalizePath(fixture.path);
    if (!exists(fixturePath)) fail(`active-only Golden fixture missing: ${fixturePath}`);
    if (fixture.disposition !== 'active_negative_checker_fixture') {
      fail(`${fixturePath} must be classified as active_negative_checker_fixture`);
    }
    if (sha256(fixturePath) !== fixture.sha256) fail(`${fixturePath} hash mismatch in manifest`);
  }
}

function checkKnowledgeArtifacts(data) {
  for (const artifact of data.knowledge_artifacts || []) {
    const artifactPath = normalizePath(artifact.path);
    if (!exists(artifactPath)) fail(`knowledge artifact missing: ${artifactPath}`);
    if (artifact.git_tracked !== true) fail(`${artifactPath} must be recorded as git_tracked:true`);
    const tracked = git(['ls-files', '--', artifactPath]).split(/\r?\n/).map(normalizePath).filter(Boolean);
    if (!tracked.includes(artifactPath)) fail(`${artifactPath} must be tracked by git`);
    if (fileSize(artifactPath) !== artifact.bytes) fail(`${artifactPath} byte size mismatch`);
    if (sha256(artifactPath) !== artifact.sha256) fail(`${artifactPath} sha256 mismatch`);
    if (artifact.disposition !== 'tracked_historical_reference_archive') {
      fail(`${artifactPath} must be tracked_historical_reference_archive`);
    }
    for (const field of [
      'active_runtime_dependency',
      'generated_lesson_output',
      'product_authority',
      'student_use_authority',
      'delete_or_replace_without_review',
    ]) {
      if (artifact[field] !== false) fail(`${artifactPath} ${field} must be false`);
    }
    const note = read(artifact.note_path);
    if (!/tracked/i.test(note) || !/knowledge\/reference material only/i.test(note)) {
      fail(`${artifact.note_path} must state tracked reference-only disposition`);
    }
  }
}

function checkWiring() {
  const packageJson = readJson('package.json');
  if (
    packageJson.scripts['check:exercise-authority-hygiene'] !==
    'node build-scripts/sprints/check-exercise-authority-hygiene.js'
  ) {
    fail('package.json must define check:exercise-authority-hygiene');
  }
  const ciWorkflow = read('.github/workflows/platform-ci.yml');
  if (!ciWorkflow.includes('npm run check:exercise-authority-hygiene')) {
    fail('platform CI must run check:exercise-authority-hygiene');
  }
}

const data = manifest();
checkExemplarAuthority(data);
checkGoldenFixtures(data);
checkKnowledgeArtifacts(data);
checkWiring();

assertClean(
  ROOT,
  [
    'source-data/book-1/exit-ticket',
    'engines',
    'references/machine',
    'references/external',
    'references/authored/course-target-exercises.json',
    'knowledge/exit-ticket-game-1.1.1.zip',
  ],
  'forbidden platform source/engine/protected/archive surfaces'
);
assertClean(LESSON_ROOT, ['Boek 1 - Grondslagen, vraag en aanbod'], 'generated Book 1 lesson output');

console.log('OK EXERCISE-AUTHORITY-HYGIENE manifest/checker proof');
