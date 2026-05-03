#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const { buildSkilltreeBundleData } = require('../../scripts/deploy');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_PATH = 'reports/json/skilltree-generator-readiness.json';
const BLOCK_PATH = 'references/data/sprints/RX.6-generator-blocked-units.json';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const GENERATORS_PATH = 'engines/skilltree/generators.js';
const BASE_ELEMENTS_PATH = 'engines/skilltree/base-elements.js';

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function fail(message) {
  console.error(`Skilltree generator readiness check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readJson(relPath) {
  if (!fs.existsSync(repoPath(relPath))) fail(`missing ${relPath}`);
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function sortedIds(items) {
  return items.map((item) => item.id || item.unit_id).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function sameList(left, right) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

function main() {
  const report = readJson(REPORT_PATH);
  const blockFile = readJson(BLOCK_PATH);
  const units = readJson(UNITS_PATH);
  const generatorsModule = require(repoPath(GENERATORS_PATH));
  const generators = generatorsModule.GEN || generatorsModule;
  const elements = require(repoPath(BASE_ELEMENTS_PATH));
  const deployBundleData = buildSkilltreeBundleData(units, generators);

  assert(report.status === 'passed', 'report status must be passed');
  assert(report.policy.diagnostic_only === true, 'report must be diagnostic-only');
  assert(report.policy.student_facing_skilltree_use_authorized === false, 'student-facing skilltree use must remain blocked for blocked units');
  assert(report.policy.generator_exposure_for_blocked_units_authorized === false, 'generator exposure must be blocked for blocked units');
  assert(report.policy.pv_projection_authorized === false, 'PV projection must remain blocked');
  assert(report.policy.machine_registry_created === false, 'RX.6 must not create a machine registry');

  const activeUnits = units.filter((unit) => /^A\d+/.test(unit.id) && !unit.deprecated);
  assert(report.summary.active_a_domain_count === activeUnits.length, 'active A-domain count mismatch');
  assert(report.summary.active_a_domain_count === report.summary.interactive_skill_count + report.summary.generator_blocked_count, 'interactive + blocked must equal active A-domain count');
  assert(report.summary.untracked_missing_generator_count === 0, 'missing generators must have explicit non-interactive block records');
  assert(report.summary.blocked_interactive_leak_count === 0, 'blocked units must not leak into interactive exports');
  assert(blockFile.unit_count === report.summary.generator_blocked_count, 'RX.6 block file count mismatch');
  assert(blockFile.student_facing_skilltree_use_allowed === false, 'RX.6 block file must block student-facing skilltree use');
  assert(blockFile.pv_projection_allowed === false, 'RX.6 block file must block PV projection');

  const interactiveIds = sortedIds(elements.SKILLS);
  const blockedIds = sortedIds(elements.GENERATOR_BLOCKED_SKILLS);
  assert(sameList(interactiveIds, sortedIds(deployBundleData.skills)), 'deploy interactive split must match source base-elements');
  assert(sameList(blockedIds, sortedIds(deployBundleData.generatorBlockedSkills)), 'deploy blocked split must match source base-elements');
  assert(sameList(blockedIds, (blockFile.generator_blocked_units || []).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))), 'RX.6 block file must list exactly the blocked source units');

  for (const row of report.rows || []) {
    if (row.generator_blocked) {
      assert(row.generator_implemented === false, `${row.unit_id} cannot be blocked and implemented`);
      assert(row.interactive_skilltree_use_allowed === false, `${row.unit_id} must not allow interactive skilltree use`);
      assert(row.student_facing_skilltree_use_allowed === false, `${row.unit_id} must not allow student-facing use`);
      assert(row.base_elements_export === 'generator_blocked', `${row.unit_id} must be blocked in source base-elements`);
      assert(row.deploy_bundle_export === 'generator_blocked', `${row.unit_id} must be blocked in deploy bundle`);
      assert(Array.isArray(row.generator_block_sources) && row.generator_block_sources.length > 0, `${row.unit_id} needs an explicit block source`);
    } else {
      assert(row.generator_implemented === true, `${row.unit_id} must be implemented if not blocked`);
      assert(row.base_elements_export === 'interactive', `${row.unit_id} must be interactive in source base-elements`);
      assert(row.deploy_bundle_export === 'interactive', `${row.unit_id} must be interactive in deploy bundle`);
    }
  }

  const failedChecks = (report.checks || []).filter((check) => check.status !== 'passed');
  assert(failedChecks.length === 0, `failed report checks: ${failedChecks.map((check) => check.id).join(', ')}`);

  console.log('OK skilltree generator readiness');
}

if (require.main === module) {
  main();
}
