#!/usr/bin/env node
// Emit reports/review-gates/<gate-id>/bundle-urls.md listing every artifact in
// the gate directory as a full raw-GitHub URL. Lets external review agents
// whose fetch tools require literal URLs in context reach gate artifacts after
// a single fetch of the bundle-urls.md file.

const fs = require('fs');
const path = require('path');

function fail(message) {
  console.error(`emit-gate-bundle-urls: ${message}`);
  process.exit(1);
}

function parseRepoFromPackageJson() {
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) fail(`missing package.json at ${pkgPath}`);
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const url = pkg && pkg.repository && pkg.repository.url;
  if (!url) fail('package.json is missing repository.url');
  // Accept https://github.com/<owner>/<repo>.git or https://github.com/<owner>/<repo>
  const match = url.match(/github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?\/?$/);
  if (!match) fail(`could not parse repository.url: ${url}`);
  return { owner: match[1], repo: match[2] };
}

function encodePath(relativePath) {
  return relativePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function buildRawUrl(owner, repo, branch, relativePath) {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodePath(relativePath)}`;
}

function splitReference(reference) {
  const hashIndex = reference.indexOf('#');
  if (hashIndex === -1) return { relativePath: reference, fragment: '' };
  return {
    relativePath: reference.slice(0, hashIndex),
    fragment: reference.slice(hashIndex),
  };
}

function buildRawReferenceUrl(owner, repo, branch, reference) {
  if (/^https?:\/\//.test(reference)) return reference;
  const { relativePath, fragment } = splitReference(reference);
  return `${buildRawUrl(owner, repo, branch, relativePath)}${fragment}`;
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

function listGateArtifacts(gateDir, relativeRoot = '') {
  const currentDir = path.join(gateDir, relativeRoot);
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relativePath = relativeRoot
      ? path.posix.join(relativeRoot.replace(/\\/g, '/'), entry.name)
      : entry.name;
    if (entry.isDirectory()) {
      files.push(...listGateArtifacts(gateDir, relativePath));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }
  return files.sort();
}

function collectReviewPacketReferences(gateDirAbs) {
  const reviewPacketPath = path.join(gateDirAbs, 'review-packet.json');
  if (!fs.existsSync(reviewPacketPath)) return [];
  const reviewPacket = JSON.parse(fs.readFileSync(reviewPacketPath, 'utf8'));
  const references = new Set();

  for (const value of reviewPacket.must_review || []) {
    if (typeof value === 'string' && value.length > 0) references.add(value.replace(/\\/g, '/'));
  }

  for (const value of reviewPacket.evidence_base || []) {
    if (typeof value === 'string' && value.length > 0) references.add(value.replace(/\\/g, '/'));
  }

  for (const key of [
    'review_packet_markdown',
    'source_execution_gate_packet_markdown',
    'source_execution_gate_packet_json',
    'checker',
  ]) {
    const value = reviewPacket[key];
    if (typeof value === 'string' && value.length > 0) references.add(value.replace(/\\/g, '/'));
  }

  return Array.from(references);
}

function emit(gateId, branch) {
  const { owner, repo } = parseRepoFromPackageJson();
  const gateDirRel = path.posix.join('reports', 'review-gates', gateId);
  const gateDirAbs = path.join(process.cwd(), 'reports', 'review-gates', gateId);
  if (!fs.existsSync(gateDirAbs)) fail(`gate directory does not exist: ${gateDirAbs}`);

  const artifacts = listGateArtifacts(gateDirAbs);
  // Always include bundle-urls.md itself in the list, even though we are about
  // to write it. Listing it makes the file self-referential, which is useful
  // for an agent that has fetched only the URL index and now wants to confirm
  // it is looking at the canonical bundle-urls.md.
  const artifactSet = new Set(artifacts);
  artifactSet.add('bundle-urls.md');

  const referenceSet = new Set();
  for (const name of artifactSet) {
    referenceSet.add(path.posix.join(gateDirRel, name));
  }
  for (const reference of collectReviewPacketReferences(gateDirAbs)) {
    referenceSet.add(reference);
  }
  const sortedReferences = Array.from(referenceSet).sort();

  const lines = [];
  lines.push(`# ${gateId} - Artifact URLs`);
  lines.push('');
  lines.push(
    "This file lists every artifact in this gate's bundle as a full raw-GitHub URL " +
      'so external review agents can fetch them. Generated by ' +
      '`build-scripts/sprints/emit-gate-bundle-urls.js`. Do not hand-edit.'
  );
  lines.push('');
  for (const reference of sortedReferences) {
    lines.push(`- ${buildRawReferenceUrl(owner, repo, branch, reference)}`);
  }
  lines.push('');
  const out = lines.join('\n');

  const outPath = path.join(gateDirAbs, 'bundle-urls.md');
  fs.writeFileSync(outPath, out, 'utf8');
  console.log(`wrote ${path.posix.join(gateDirRel, 'bundle-urls.md')} (${sortedReferences.length} artifacts)`);
}

if (require.main === module) {
  const { gateId, branch } = parseArgs(process.argv);
  emit(gateId, branch);
}

module.exports = { parseRepoFromPackageJson, encodePath, buildRawUrl, buildRawReferenceUrl };
