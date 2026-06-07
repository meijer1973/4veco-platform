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

const REQUIRED_BLOCKED_SCOPE = [
  'student-facing skill-tree exposure for generator-blocked units',
  'student-facing route display for generator-blocked units',
  'lesson route exposure for generator-blocked units',
  'student diagnostics',
  'adaptive routing',
  'student-facing AI',
  'automatic sequencing',
  'mastery decisions',
  'summative decisions',
  'product-route adoption for generator-blocked units',
  'student-facing PV projection for generator-blocked units',
];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function fail(message) {
  console.error(`Skilltree generator readiness check failed: ${message}`);
  process.exit(1);
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildContext() {
  const report = readJson(REPORT_PATH);
  const blockFile = readJson(BLOCK_PATH);
  const units = readJson(UNITS_PATH);
  const generatorsModule = require(repoPath(GENERATORS_PATH));
  const generators = generatorsModule.GEN || generatorsModule;
  const elements = require(repoPath(BASE_ELEMENTS_PATH));
  const deployBundleData = buildSkilltreeBundleData(units, generators);

  return { report, blockFile, units, elements, deployBundleData };
}

function collectValidationErrors(context) {
  const { report, blockFile, units, elements, deployBundleData } = context;
  const errors = [];
  const check = (condition, message) => {
    if (!condition) errors.push(message);
  };

  check(report.status === 'passed', 'report status must be passed');
  check(report.policy && report.policy.diagnostic_only === true, 'report must be diagnostic-only');
  check(report.policy && report.policy.student_facing_skilltree_use_authorized === false, 'student-facing skilltree use must remain blocked for blocked units');
  check(report.policy && report.policy.generator_exposure_for_blocked_units_authorized === false, 'generator exposure must be blocked for blocked units');
  check(report.policy && report.policy.route_exposure_for_blocked_units_authorized === false, 'route exposure must be blocked for blocked units');
  check(report.policy && report.policy.pv_projection_authorized === false, 'PV projection must remain blocked');
  check(report.policy && report.policy.diagnostics_authorized === false, 'diagnostics must remain blocked');
  check(report.policy && report.policy.adaptive_routing_authorized === false, 'adaptive routing must remain blocked');
  check(report.policy && report.policy.mastery_decisions_authorized === false, 'mastery decisions must remain blocked');
  check(report.policy && report.policy.product_route_adoption_authorized === false, 'product-route adoption must remain blocked');
  check(report.policy && report.policy.product_authority_authorized === false, 'product authority must remain blocked');
  check(report.policy && report.policy.machine_registry_created === false, 'RX.6 must not create a machine registry');

  const activeUnits = units.filter((unit) => /^A\d+/.test(unit.id) && !unit.deprecated);
  check(report.summary && report.summary.active_a_domain_count === activeUnits.length, 'active A-domain count mismatch');
  check(
    report.summary && report.summary.active_a_domain_count === report.summary.interactive_skill_count + report.summary.generator_blocked_count,
    'interactive + blocked must equal active A-domain count'
  );
  check(report.summary && report.summary.untracked_missing_generator_count === 0, 'missing generators must have explicit non-interactive block records');
  check(report.summary && report.summary.blocked_interactive_leak_count === 0, 'blocked units must not leak into interactive exports');
  check(report.summary && report.summary.blocked_route_leak_count === 0, 'blocked units must not leak into route exports');
  check(report.summary && report.summary.negative_fixture_rejection_required === true, 'negative-fixture rejection must be required by the report');

  check(blockFile.unit_count === report.summary.generator_blocked_count, 'RX.6 block file count mismatch');
  check(blockFile.student_facing_skilltree_use_allowed === false, 'RX.6 block file must block student-facing skilltree use');
  check(blockFile.student_facing_route_use_allowed === false, 'RX.6 block file must block student-facing route use');
  check(blockFile.pv_projection_allowed === false, 'RX.6 block file must block PV projection');
  check(blockFile.diagnostics_authorized === false, 'RX.6 block file must block diagnostics');
  check(blockFile.adaptive_routing_authorized === false, 'RX.6 block file must block adaptive routing');
  check(blockFile.mastery_decisions_authorized === false, 'RX.6 block file must block mastery decisions');
  check(blockFile.product_authority_authorized === false, 'RX.6 block file must block product authority');

  for (const scope of REQUIRED_BLOCKED_SCOPE) {
    check(
      Array.isArray(report.blocked_scope) && report.blocked_scope.includes(scope),
      `report blocked_scope missing ${scope}`
    );
    check(
      Array.isArray(blockFile.blocked_downstream_uses) && blockFile.blocked_downstream_uses.includes(scope),
      `block file blocked_downstream_uses missing ${scope}`
    );
  }

  const interactiveIds = sortedIds(elements.SKILLS);
  const blockedIds = sortedIds(elements.GENERATOR_BLOCKED_SKILLS);
  const routeIds = sortedIds(elements.ROUTE_SKILLS);
  check(sameList(interactiveIds, sortedIds(deployBundleData.skills)), 'deploy interactive split must match source base-elements');
  check(sameList(blockedIds, sortedIds(deployBundleData.generatorBlockedSkills)), 'deploy blocked split must match source base-elements');
  check(sameList(routeIds, sortedIds(deployBundleData.routeSkills)), 'deploy route split must match source base-elements');
  check(
    sameList(blockedIds, (blockFile.generator_blocked_units || []).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))),
    'RX.6 block file must list exactly the blocked source units'
  );

  const routeIdSet = new Set(routeIds);
  for (const blockedId of blockedIds) {
    check(!interactiveIds.includes(blockedId), `${blockedId} must not be in interactive source export`);
    check(!routeIdSet.has(blockedId), `${blockedId} must not be in student-visible route export`);
  }

  for (const row of report.rows || []) {
    if (row.generator_blocked) {
      check(row.generator_implemented === false, `${row.unit_id} cannot be blocked and implemented`);
      check(row.interactive_skilltree_use_allowed === false, `${row.unit_id} must not allow interactive skilltree use`);
      check(row.student_facing_skilltree_use_allowed === false, `${row.unit_id} must not allow student-facing skilltree use`);
      check(row.student_facing_route_use_allowed === false, `${row.unit_id} must not allow student-facing route use`);
      check(row.base_elements_export === 'generator_blocked', `${row.unit_id} must be blocked in source base-elements`);
      check(row.deploy_bundle_export === 'generator_blocked', `${row.unit_id} must be blocked in deploy bundle`);
      check(row.base_route_export === 'not_exported', `${row.unit_id} must not be route-visible in source base-elements`);
      check(row.deploy_route_export === 'not_exported', `${row.unit_id} must not be route-visible in deploy bundle`);
      check(Array.isArray(row.generator_block_sources) && row.generator_block_sources.length > 0, `${row.unit_id} needs an explicit block source`);
    } else {
      check(row.generator_implemented === true, `${row.unit_id} must be implemented if not blocked`);
      check(row.base_elements_export === 'interactive', `${row.unit_id} must be interactive in source base-elements`);
      check(row.deploy_bundle_export === 'interactive', `${row.unit_id} must be interactive in deploy bundle`);
    }
  }

  const checkById = new Map((report.checks || []).map((item) => [item.id, item]));
  for (const id of [
    'source_base_elements_split_matches_generators',
    'deploy_bundle_split_matches_source',
    'deploy_route_export_matches_source',
    'blocked_units_have_explicit_noninteractive_status',
    'no_missing_generator_unit_is_interactive',
    'no_missing_generator_unit_is_route_visible',
    'student_facing_controls_preserved',
    'rx6_generator_block_file_written',
    'downstream_product_authority_blocked',
  ]) {
    check(checkById.has(id), `missing report check ${id}`);
  }
  const failedChecks = (report.checks || []).filter((item) => item.status !== 'passed');
  check(failedChecks.length === 0, `failed report checks: ${failedChecks.map((item) => item.id).join(', ')}`);

  return errors;
}

function makeBlockedInteractiveNegativeFixture(report) {
  const fixture = clone(report);
  const row = (fixture.rows || []).find((item) => item.generator_blocked);
  if (!row) throw new Error('negative fixture requires at least one generator-blocked row');
  row.base_elements_export = 'interactive';
  row.deploy_bundle_export = 'interactive';
  row.interactive_skilltree_use_allowed = true;
  row.student_facing_skilltree_use_allowed = true;
  fixture.summary.blocked_interactive_leak_count = 1;
  return fixture;
}

function main() {
  const context = buildContext();
  const errors = collectValidationErrors(context);
  if (errors.length > 0) fail(errors.join('\n- '));

  const negativeContext = {
    ...context,
    report: makeBlockedInteractiveNegativeFixture(context.report),
  };
  const negativeErrors = collectValidationErrors(negativeContext);
  if (negativeErrors.length === 0) {
    fail('negative fixture with blocked unit marked interactive was not rejected');
  }
  const rejectedInteractiveLeak = negativeErrors.some((message) =>
    /interactive|student-facing skilltree|blocked units must not leak/i.test(message)
  );
  if (!rejectedInteractiveLeak) {
    fail(`negative fixture failed for the wrong reason: ${negativeErrors.join('; ')}`);
  }

  console.log('OK skilltree generator readiness');
  console.log('OK negative fixture rejected: blocked unit marked interactive');
}

if (require.main === module) {
  main();
}

module.exports = {
  collectValidationErrors,
  makeBlockedInteractiveNegativeFixture,
};
