#!/usr/bin/env node
/**
 * rewrite-skilltree-test-ids.js
 *
 * One-shot helper: rewrite F/B/S/E ID references (quoted, bare keys,
 * comments) inside engines/tests/skilltree-engine.test.js to their A*
 * counterparts via math-migration-map.json. Used once during the rewire;
 * safe to re-run (idempotent).
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const TEST_FILE = path.join(REPO_ROOT, 'engines/tests/skilltree-engine.test.js');
const MAP_PATH  = path.join(__dirname, 'math-migration-map.json');

function main() {
  const map = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));
  let content = fs.readFileSync(TEST_FILE, 'utf8');
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);

  let total = 0;
  for (const oldId of keys) {
    const newId = map[oldId];
    const re = new RegExp(`\\b${oldId}\\b`, 'g');
    const matches = content.match(re);
    if (matches) {
      content = content.replace(re, newId);
      total += matches.length;
    }
  }

  fs.writeFileSync(TEST_FILE, content);
  console.log(`rewrote ${total} ID references in ${path.relative(REPO_ROOT, TEST_FILE)}`);
}

if (require.main === module) main();
