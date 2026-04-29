#!/usr/bin/env node
// Validate reports/review-gates/<gate-id>/bundle-urls.md against the gate
// directory: every file must be listed, every listed URL must point at an
// existing file. Run as part of check-sprint-bundle.js --complete for any
// sprint that declares a gate_id.

const fs = require('fs');
const path = require('path');

const { parseRepoFromPackageJson, buildRawUrl } = require('./emit-gate-bundle-urls.js');

function fail(message) {
  console.error(`check-bundle-urls: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  let gateId = null;
  let branch = 'main';
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--branch') {
      branch = args[i + 1];
      i += 1;
    } else if (arg.startsWith('--branch=')) {
      branch = arg.slice('--branch='.length);
    } else if (!arg.startsWith('--')) {
      gateId = arg;
    }
  }
  if (!gateId) fail('missing gate id, for example GATE-CP2-owned-source-scope');
  if (!/^GATE-[A-Za-z0-9.-]+$/.test(gateId)) {
    fail(`unexpected gate id format: ${gateId}`);
  }
  return { gateId, branch };
}

function extractListedUrls(markdown) {
  const urls = [];
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^-\s+(https?:\/\/\S+)\s*$/);
    if (match) urls.push(match[1]);
  }
  return urls;
}

function urlToRelativePath(url, owner, repo, branch) {
  const prefix = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
  if (!url.startsWith(prefix)) return null;
  const encoded = url.slice(prefix.length);
  return encoded
    .split('/')
    .map((segment) => decodeURIComponent(segment))
    .join('/');
}

function check({ gateId, branch }) {
  const { owner, repo } = parseRepoFromPackageJson();
  const gateDirRel = path.posix.join('reports', 'review-gates', gateId);
  const gateDirAbs = path.join(process.cwd(), 'reports', 'review-gates', gateId);
  if (!fs.existsSync(gateDirAbs)) fail(`gate directory does not exist: ${gateDirAbs}`);

  const bundlePath = path.join(gateDirAbs, 'bundle-urls.md');
  if (!fs.existsSync(bundlePath)) {
    fail(
      `missing bundle-urls.md for ${gateId}; run: node build-scripts/sprints/emit-gate-bundle-urls.js ${gateId}`
    );
  }

  const diskFiles = fs
    .readdirSync(gateDirAbs, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();

  const markdown = fs.readFileSync(bundlePath, 'utf8');
  const listedUrls = extractListedUrls(markdown);
  if (listedUrls.length === 0) fail(`bundle-urls.md for ${gateId} contains no URLs`);

  // Every URL must point at an existing file inside this gate directory.
  const listedFiles = new Set();
  for (const url of listedUrls) {
    const rel = urlToRelativePath(url, owner, repo, branch);
    if (!rel) {
      fail(`URL does not match raw base for ${owner}/${repo}@${branch}: ${url}`);
    }
    const expectedPrefix = `${gateDirRel}/`;
    if (!rel.startsWith(expectedPrefix)) {
      fail(`URL points outside gate directory: ${url}`);
    }
    const filename = rel.slice(expectedPrefix.length);
    if (filename.includes('/')) {
      fail(`URL points into a subdirectory (gate listing must be flat): ${url}`);
    }
    const abs = path.join(gateDirAbs, filename);
    if (!fs.existsSync(abs)) {
      fail(`listed URL has no file on disk: ${url}`);
    }
    listedFiles.add(filename);
  }

  // Every disk file must be listed (this includes bundle-urls.md itself).
  const missing = diskFiles.filter((name) => !listedFiles.has(name));
  if (missing.length > 0) {
    fail(
      `bundle-urls.md is stale; missing entries: ${missing.join(', ')}. ` +
        `Regenerate: node build-scripts/sprints/emit-gate-bundle-urls.js ${gateId}`
    );
  }

  // Sanity-check that every disk file's expected URL is actually present.
  for (const name of diskFiles) {
    const rel = path.posix.join(gateDirRel, name);
    const expected = buildRawUrl(owner, repo, branch, rel);
    if (!listedUrls.includes(expected)) {
      fail(
        `bundle-urls.md does not contain the canonical URL for ${name}; ` +
          `expected ${expected}. Regenerate: node build-scripts/sprints/emit-gate-bundle-urls.js ${gateId}`
      );
    }
  }

  console.log(`OK bundle-urls: ${gateId} (${diskFiles.length} artifacts)`);
}

if (require.main === module) {
  check(parseArgs(process.argv));
}

module.exports = { extractListedUrls, urlToRelativePath };
