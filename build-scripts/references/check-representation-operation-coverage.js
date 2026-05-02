#!/usr/bin/env node
/**
 * Validate the RX.5 representation-operation reports.
 *
 * This checker verifies the report contract only. It must not mutate registry
 * data or promote provisional operation records.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

const PATHS = {
  coverage: 'reports/json/representation-operation-coverage.json',
  graphTree: 'reports/json/graph-skill-tree.json',
  gaps: 'reports/json/representation-transfer-gaps.json',
};

const FORBIDDEN_MACHINE_REGISTRIES = [
  'references/machine/exercise-operations.json',
  'references/machine/skill-tags.json',
  'references/machine/representation-operations.json',
  'references/machine/procedure-templates.json',
  'references/machine/visual-states.json',
];

function fail(message) {
  console.error(`Representation operation coverage check failed: ${message}`);
  process.exit(1);
}

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  if (!fs.existsSync(repoPath(relPath))) fail(`missing ${relPath}`);
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function byId(items, field) {
  return new Map(items.map((item) => [item[field], item]));
}

function main() {
  const coverage = readJson(PATHS.coverage);
  const graphTree = readJson(PATHS.graphTree);
  const gaps = readJson(PATHS.gaps);

  for (const relPath of FORBIDDEN_MACHINE_REGISTRIES) {
    assert(!fs.existsSync(repoPath(relPath)), `forbidden machine registry exists: ${relPath}`);
  }

  assert(coverage.storage_decision.machine_registry_created === false, 'coverage must declare no machine registry');
  assert(coverage.policy.student_facing_use_authorized === false, 'coverage must block student-facing use');
  assert(coverage.policy.machine_registry_promotion_authorized === false, 'coverage must block machine promotion');
  assert(coverage.summary.operation_count >= 33, 'coverage must include S7 operation rows');
  assert(coverage.summary.foundation_requirement_count >= 19, 'coverage must include foundation requirements');
  assert(coverage.summary.foundation_live_count >= 16, 'coverage must see live RX representation units');
  assert(coverage.summary.foundation_held_count >= 3, 'coverage must preserve held representation requirements');

  const foundationByUnit = byId(coverage.foundation_coverage, 'expected_unit_id');
  for (const unitId of ['A61', 'A62', 'A63', 'A64', 'A65', 'A68', 'A69', 'A73', 'A75', 'A76', 'A77', 'A78', 'A79', 'A82', 'A83', 'A84']) {
    const row = foundationByUnit.get(unitId);
    assert(row, `missing foundation row for ${unitId}`);
    assert(row.live_unit === true, `${unitId} must be live in RX.5 coverage`);
  }
  for (const unitId of ['A71', 'A80', 'A81']) {
    const row = foundationByUnit.get(unitId);
    assert(row, `missing held foundation row for ${unitId}`);
    assert(row.live_unit === false, `${unitId} must remain non-live/held`);
    assert(/held/.test(row.status), `${unitId} must be marked held`);
  }

  const operationById = byId(coverage.operations, 'operation_id');
  for (const operationId of ['REP_ELASTICITY_FROM_TABLE', 'REP_ELASTICITY_FROM_DEMAND_GRAPH', 'REP_REVENUE_CHANGE_WITH_ELASTICITY_SOURCE']) {
    const row = operationById.get(operationId);
    assert(row, `missing operation row ${operationId}`);
    assert(row.pv_template_ids.length > 0, `${operationId} must show PV pilot linkage`);
    assert(row.any_generator_blocked === true, `${operationId} must preserve generator block`);
  }
  for (const operationId of ['REP_PROFIT_FROM_REVENUE_COST_TABLE', 'REP_BREAK_EVEN_TO_TK_GRAPH']) {
    const row = operationById.get(operationId);
    assert(row, `missing operation row ${operationId}`);
    assert(row.coverage_state === 'live_unit_live_registry_status_stale', `${operationId} must expose stale S7 status`);
  }

  assert(graphTree.policy.student_facing_use_authorized === false, 'graph skill tree must block student-facing use');
  assert(graphTree.summary.graph_unit_count > 0, 'graph skill tree must include graph units');
  assert(graphTree.summary.graph_units_generator_blocked > 0, 'graph skill tree must preserve generator blocks');

  assert(gaps.policy.diagnostic_only === true, 'transfer gaps must be diagnostic only');
  assert(gaps.summary.gap_count > 0, 'transfer gaps must contain open diagnostic gaps');
  assert(gaps.summary.by_category.generator_blocked_live_unit > 0, 'transfer gaps must include generator-blocked category');
  assert(gaps.summary.by_category.registry_status_stale > 0, 'transfer gaps must include registry-status stale category');

  console.log('OK representation operation coverage reports');
}

if (require.main === module) {
  main();
}
