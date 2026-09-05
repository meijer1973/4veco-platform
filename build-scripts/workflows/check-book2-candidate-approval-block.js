#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const { durableLifecycleState, findFailures, readInputs } = require('./check-book2-target-authority-remediation');

const ROOT = path.resolve(__dirname, '..', '..');
const CHECKER = path.join(ROOT, 'build-scripts', 'workflows', 'check-book-outline-currentness.js');
const PARAGRAPHS = [
  ['2.1.1', 'H-229-211-CANDIDATE'],
  ['2.1.2', 'H-212-STALE-REF'],
  ['2.1.3', 'H-213-DELTAQ'],
  ['2.1.4', 'H-229-214-CANDIDATE'],
  ['2.2.1', 'H-229-221-CANDIDATE'],
  ['2.2.2', 'H-229-222-CANDIDATE'],
  ['2.2.3', 'H-229-223-CANDIDATE'],
  ['2.2.4', 'H-229-224-CANDIDATE'],
  ['2.3.1', 'H-231-V5'],
  ['2.3.2', 'H-232-V5'],
  ['2.3.3', 'H-233-V5-REF'],
  ['2.3.4', 'H-234-PLACEHOLDER'],
];

function run(args) {
  return spawnSync(process.execPath, [CHECKER, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
  });
}

function combined(result) {
  return `${result.stdout || ''}\n${result.stderr || ''}`;
}

function expectPass(args, label) {
  const result = run(args);
  if (result.status !== 0) throw new Error(`${label} should pass:\n${combined(result)}`);
}

function expectBlocked(args, needle, label) {
  const result = run(args);
  if (result.status === 0) throw new Error(`${label} should be blocked`);
  if (!combined(result).includes(needle)) {
    throw new Error(`${label} did not name ${needle}:\n${combined(result)}`);
  }
}

function approvalBlockLifecycleMode(meta, input = readInputs(), options = {}) {
  const lifecycle = durableLifecycleState(meta, input, options);
  const failures = findFailures({ ...input, meta }, { ...options, durable: true });
  if (failures.length) throw new Error(failures.join('\n- '));
  return lifecycle.mode;
}

function main() {
  const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'references/authored/book-outlines/book-2-outline.meta.json'), 'utf8'));
  const lifecycleMode = approvalBlockLifecycleMode(meta);
  if (lifecycleMode === 'retired') {
    console.log('Book 2 candidate approval block: PASS');
    console.log('- retired after fully evidenced Issue #229 target integration');
    return;
  }
  expectPass([], 'structural currentness');
  for (const [paragraph, hold] of PARAGRAPHS) {
    expectPass(['--action', 'target_authority_repair', '--paragraph', paragraph], `${paragraph} repair`);
    for (const action of ['target_authority_integration', 'paragraph_production', 'lesson_authoring']) {
      expectBlocked(['--action', action, '--paragraph', paragraph], hold, `${paragraph} ${action}`);
    }
  }
  expectBlocked(['--require-approved'], 'H-229-211-CANDIDATE', 'approved-use mode');
  expectBlocked(['--action', 'merge'], 'H-229-211-CANDIDATE', 'merge');
  console.log('Book 2 candidate approval block: PASS');
  console.log('- structural and target-authority repair routes pass');
  console.log('- approved use, integration, production, lesson authoring, and merge remain blocked');
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(`Book 2 candidate approval block: FAIL\n- ${error.message}`); process.exit(1); }
}

module.exports = { PARAGRAPHS, approvalBlockLifecycleMode, main };
