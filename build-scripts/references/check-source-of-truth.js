#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SOURCE_OF_TRUTH = 'references/SOURCE_OF_TRUTH.md';
const SOURCE_MANIFEST = 'references/data/source_manifest.json';
const DOCUMENT_INVENTORY = 'references/data/document_inventory.json';

const REQUIRED_SECTIONS = [
  '## Layered Canon Rule',
  '## Canonical Data Rules',
  '## Protected Surfaces',
  '## Current Inventory Inputs',
  '## Exceptions And Known Follow-Ups',
];

const REQUIRED_SURFACES = [
  'references/external/',
  'references/machine/',
  'references/authored/',
  'references/qc-prompts/',
  'references/data/',
  'reports/',
  'build-scripts/references/',
  'build-scripts/reports/',
];

function fail(message) {
  console.error(`Source-of-truth check failed: ${message}`);
  process.exit(1);
}

function read(relPath) {
  const full = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(full)) fail(`missing ${relPath}`);
  return fs.readFileSync(full, 'utf8');
}

function readJson(relPath) {
  return JSON.parse(read(relPath));
}

function main() {
  const markdown = read(SOURCE_OF_TRUTH);
  for (const section of REQUIRED_SECTIONS) {
    if (!markdown.includes(section)) fail(`missing section ${section}`);
  }
  for (const surface of REQUIRED_SURFACES) {
    if (!markdown.includes(surface)) fail(`missing surface ${surface}`);
  }
  if (!/references\/machine\/[\s\S]*CLI only/i.test(markdown)) {
    fail('machine registry row must declare CLI-only editing');
  }
  if (!/Generated reports are projections/i.test(markdown)) {
    fail('must state that generated reports are projections');
  }

  const manifest = readJson(SOURCE_MANIFEST);
  const inventory = readJson(DOCUMENT_INVENTORY);
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) fail('source manifest has no files');
  if (!Array.isArray(inventory.files) || inventory.files.length === 0) fail('document inventory has no files');

  const unclassified = inventory.files.filter((entry) => entry.layer === 'unclassified');
  if (unclassified.length) {
    fail(`inventory contains unclassified file(s): ${unclassified.map((entry) => entry.path).join(', ')}`);
  }

  console.log(`OK source of truth: ${SOURCE_OF_TRUTH}`);
}

if (require.main === module) main();
