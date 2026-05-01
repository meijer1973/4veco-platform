#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Add stricter schema checks in PV.2.
 * - Keep this checker read-only. It verifies PV.1 inventory discipline and
 *   protected-surface boundaries.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const INVENTORY_PATH = 'references/data/procedure-visual/inventory.json';
const REPORT_JSON_PATH = 'reports/json/procedure-visual-inventory.json';
const REPORT_MD_PATH = 'reports/markdown/procedure-visual-inventory.md';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const CP4_CLOSURE_PATH = 'reports/review-gates/GATE-CP4-skill-registry-coexistence/gate-closure.json';

const FORBIDDEN_MACHINE_PV_FILES = [
  'references/machine/procedure-templates.json',
  'references/machine/visual-states.json',
  'references/machine/procedure-visual-vocab.json',
];

const REQUIRED_CATEGORIES = [
  'procedure_prose_only',
  'procedure_game_data_exists',
  'visualizable_formula_trace',
  'visualizable_graph_stage',
  'visualizable_flowchart',
  'table_trace_needed',
  'surface_variants_needed',
  'blocked_by_operation_registry',
  'blocked_by_generator',
];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function fail(message) {
  console.error(`Procedure-Visual inventory check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function exists(relPath) {
  return fs.existsSync(repoPath(relPath));
}

function readJson(relPath) {
  try {
    return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function main() {
  for (const relPath of [INVENTORY_PATH, REPORT_JSON_PATH, REPORT_MD_PATH, UNITS_PATH, CP4_CLOSURE_PATH]) {
    assert(exists(relPath), `missing ${relPath}`);
  }
  for (const relPath of FORBIDDEN_MACHINE_PV_FILES) {
    assert(!exists(relPath), `unexpected PV machine registry file: ${relPath}`);
  }

  const inventory = readJson(INVENTORY_PATH);
  const report = readJson(REPORT_JSON_PATH);
  const units = readJson(UNITS_PATH);
  const unitIds = new Set(units.map((unit) => unit.id));
  const cp4 = readJson(CP4_CLOSURE_PATH);

  assert(inventory.schema_version === 1, 'schema_version must be 1');
  assert(inventory.inventory_id === 'procedure-visual-inventory', 'inventory_id mismatch');
  assert(inventory.sprint_id === 'PV.1', 'sprint_id must be PV.1');
  assert(inventory.status === 'completed_inventory', 'status must be completed_inventory');
  assert(inventory.storage_decision && inventory.storage_decision.inventory_location === INVENTORY_PATH, 'inventory location mismatch');
  assert(inventory.storage_decision.machine_registry_created === false, 'machine_registry_created must be false');
  assert(inventory.policy && inventory.policy.protected_reference_data_changed === false, 'protected reference data must not change in PV.1');
  assert(inventory.policy.no_machine_registry_authorized === true, 'no_machine_registry_authorized must be true');
  assert(inventory.policy.student_facing_projection_authorized === false, 'student-facing projection must remain unauthorized');
  assert(cp4.status === 'pass_with_conditions', 'CP-4 must be closed before PV.1');
  assert(cp4.pv_dependency_authorized === 'provisional references only', 'CP-4 PV dependency decision mismatch');

  for (const category of REQUIRED_CATEGORIES) {
    assert(inventory.category_definitions && inventory.category_definitions[category], `missing category definition ${category}`);
  }

  const pilots = inventory.ranked_pilot_templates || [];
  assert(pilots.length >= 8 && pilots.length <= 12, `expected 8-12 ranked pilot templates, got ${pilots.length}`);
  assert(inventory.summary.ranked_pilot_template_count === pilots.length, 'pilot count summary mismatch');

  const ranks = new Set();
  const templateIds = new Set();
  let hasFormulaTrace = false;
  let hasGraphStage = false;
  let hasTableTrace = false;
  let hasFlowchart = false;
  let hasGeneratorBlocked = false;
  let provisionalRefs = 0;

  for (const pilot of pilots) {
    assert(Number.isInteger(pilot.rank), `${pilot.template_id || '<unknown>'} missing integer rank`);
    assert(!ranks.has(pilot.rank), `duplicate rank ${pilot.rank}`);
    ranks.add(pilot.rank);
    assert(pilot.template_id && typeof pilot.template_id === 'string', `rank ${pilot.rank} missing template_id`);
    assert(!templateIds.has(pilot.template_id), `duplicate template_id ${pilot.template_id}`);
    templateIds.add(pilot.template_id);
    assert(Array.isArray(pilot.unit_ids) && pilot.unit_ids.length > 0, `${pilot.template_id} missing unit_ids`);
    assert(pilot.representation_type, `${pilot.template_id} missing representation_type`);
    assert(pilot.visual_type, `${pilot.template_id} missing visual_type`);
    assert(Array.isArray(pilot.inventory_categories) && pilot.inventory_categories.length > 0, `${pilot.template_id} missing inventory_categories`);
    assert(Array.isArray(pilot.blocker_status) && pilot.blocker_status.length > 0, `${pilot.template_id} missing blocker_status`);
    assert(pilot.student_facing_projection_allowed === false, `${pilot.template_id} must not allow student-facing projection`);
    for (const unitId of pilot.unit_ids) {
      assert(unitIds.has(unitId), `${pilot.template_id} references missing unit ${unitId}`);
    }
    for (const category of pilot.inventory_categories) {
      assert(REQUIRED_CATEGORIES.includes(category), `${pilot.template_id} uses unknown category ${category}`);
    }
    for (const opRef of pilot.operation_refs || []) {
      assert(opRef.found === true, `${pilot.template_id} references missing operation ${opRef.operation_id}`);
      assert(opRef.governance_status === 'provisional_until_cp4', `${opRef.operation_id} must remain provisional_until_cp4`);
      assert(opRef.provisional_reference_allowed_by_cp4 === true, `${opRef.operation_id} must be explicitly allowed by CP-4 as provisional`);
      provisionalRefs += 1;
    }
    hasFormulaTrace = hasFormulaTrace || /formula_trace/.test(pilot.visual_type) || pilot.inventory_categories.includes('visualizable_formula_trace');
    hasGraphStage = hasGraphStage || /graph_stage/.test(pilot.visual_type) || pilot.inventory_categories.includes('visualizable_graph_stage');
    hasTableTrace = hasTableTrace || /table_trace/.test(pilot.visual_type) || pilot.inventory_categories.includes('table_trace_needed');
    hasFlowchart = hasFlowchart || /flowchart/.test(pilot.visual_type) || pilot.inventory_categories.includes('visualizable_flowchart');
    hasGeneratorBlocked = hasGeneratorBlocked || pilot.blocker_status.includes('generator_or_projection_support_pending');
  }

  assert(hasFormulaTrace, 'ranked pilots must include a formula trace candidate');
  assert(hasGraphStage, 'ranked pilots must include a graph-stage candidate');
  assert(hasTableTrace, 'ranked pilots must include a table-trace candidate');
  assert(hasFlowchart, 'ranked pilots must include a flowchart candidate');
  assert(hasGeneratorBlocked, 'ranked pilots must expose generator/projection blockers');
  assert(provisionalRefs > 0, 'ranked pilots must include explicit provisional operation references');
  assert(inventory.summary.provisional_operation_reference_count === provisionalRefs, 'provisional operation reference summary mismatch');

  const findings = inventory.runtime_surface_findings || {};
  assert(findings.micro_teaching_unit_procedures, 'missing micro-unit procedure finding');
  assert(findings.procedure_engine, 'missing procedure engine finding');
  assert(findings.skill_operation_registry, 'missing skill-operation registry finding');
  assert(findings.source_data_book_1, 'missing Book 1 source-data finding');
  assert(findings.procedure_engine.formal_step_id_supported === false, 'PV.1 should record formal_step_id as not yet supported');
  assert(findings.skill_operation_registry.machine_registry_created === false, 'skill-operation registry must remain references/data overlay');

  assert(Array.isArray(inventory.pv2_schema_requirements) && inventory.pv2_schema_requirements.length >= 4, 'PV.2 schema requirements missing');
  assert(report.inventory_id === inventory.inventory_id, 'report JSON must mirror inventory id');
  assert(report.summary.ranked_pilot_template_count === pilots.length, 'report JSON summary mismatch');

  const md = fs.readFileSync(repoPath(REPORT_MD_PATH), 'utf8');
  assert(md.includes('# Procedure-Visual Inventory'), 'Markdown report missing title');
  assert(md.includes('No protected reference data'), 'Markdown report must state protected-surface boundary');

  console.log(`OK Procedure-Visual inventory: ${pilots.length} ranked pilots, ${provisionalRefs} provisional operation refs`);
}

if (require.main === module) main();
