#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const INVENTORY = 'references/data/document_inventory.json';
const ROOTS = ['references', 'reports', 'build-scripts/references', 'build-scripts/reports'];
const SELF_GENERATED = new Set([
  'references/data/source_manifest.json',
  'references/data/document_inventory.json',
]);

function fail(message) {
  console.error(`Document inventory check failed: ${message}`);
  process.exit(1);
}

function slashPath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function rel(filePath) {
  return slashPath(path.relative(REPO_ROOT, filePath));
}

function walkFiles(rootRel) {
  const root = path.join(REPO_ROOT, rootRel);
  if (!fs.existsSync(root)) return [];
  const out = [];
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      if (entry.isFile()) out.push(full);
    }
  }
  return out.map(rel);
}

function sha256(pathRel) {
  return crypto.createHash('sha256').update(fs.readFileSync(path.join(REPO_ROOT, pathRel))).digest('hex');
}

function main() {
  const full = path.join(REPO_ROOT, INVENTORY);
  if (!fs.existsSync(full)) fail(`missing ${INVENTORY}`);
  const inventory = JSON.parse(fs.readFileSync(full, 'utf8'));
  if (inventory.schema_version !== '0.1') fail('unexpected schema_version');
  if (!Array.isArray(inventory.files)) fail('files must be an array');

  const current = Array.from(new Set(ROOTS.flatMap(walkFiles))).sort();
  const listed = inventory.files.map((entry) => entry.path).sort();
  const missing = current.filter((pathRel) => !listed.includes(pathRel));
  const stale = listed.filter((pathRel) => !current.includes(pathRel));
  if (missing.length) fail(`missing file(s): ${missing.join(', ')}`);
  if (stale.length) fail(`stale file(s): ${stale.join(', ')}`);

  for (const entry of inventory.files) {
    for (const field of ['path', 'layer', 'authority_level', 'source_type', 'generated_status', 'edit_policy', 'owner', 'refresh_policy']) {
      if (!entry[field]) fail(`${entry.path} missing ${field}`);
    }
    if (!Array.isArray(entry.downstream_dependencies)) fail(`${entry.path} downstream_dependencies must be an array`);
    if (SELF_GENERATED.has(entry.path)) continue;
    const stats = fs.statSync(path.join(REPO_ROOT, entry.path));
    if (entry.size_bytes !== stats.size) fail(`${entry.path} size mismatch`);
    if (entry.sha256 !== sha256(entry.path)) fail(`${entry.path} sha256 mismatch`);
  }

  console.log(`OK document inventory: ${inventory.files.length} files`);
}

if (require.main === module) main();
