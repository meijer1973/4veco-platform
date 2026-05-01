#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Add stricter PV checks as PV.3 adds pilot templates and visual states.
 * - Keep this validator read-only. PV starts under references/data/ and must
 *   not create references/machine PV registries before the promotion gate.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

const PV_DIR = 'references/data/procedure-visual';
const PROCEDURE_TEMPLATE_SCHEMA = `${PV_DIR}/procedure-template.schema.json`;
const VISUAL_STATE_SCHEMA = `${PV_DIR}/visual-state.schema.json`;
const VISUAL_GRAMMAR_SCHEMA = `${PV_DIR}/visual-grammar.schema.json`;
const VOCAB_PATH = `${PV_DIR}/procedure-visual-vocab.json`;
const PROCEDURE_TEMPLATES_PATH = `${PV_DIR}/procedure-templates.json`;
const VISUAL_STATES_PATH = `${PV_DIR}/visual-states.json`;
const UNIT_TEMPLATE_LINKS_PATH = `${PV_DIR}/unit-template-links.json`;

const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const SKILL_OPERATION_REGISTRY_PATH = 'references/data/skill-operation-registry.json';
const CP4_CLOSURE_PATH = 'reports/review-gates/GATE-CP4-skill-registry-coexistence/gate-closure.json';

const FORBIDDEN_MACHINE_PV_FILES = [
  'references/machine/procedure-templates.json',
  'references/machine/visual-states.json',
  'references/machine/procedure-visual-vocab.json',
  'references/machine/procedure-visual.json',
];

const REQUIRED_SCHEMA_FILES = [
  PROCEDURE_TEMPLATE_SCHEMA,
  VISUAL_STATE_SCHEMA,
  VISUAL_GRAMMAR_SCHEMA,
];

const REQUIRED_REGISTRY_FILES = [
  VOCAB_PATH,
  PROCEDURE_TEMPLATES_PATH,
  VISUAL_STATES_PATH,
  UNIT_TEMPLATE_LINKS_PATH,
];

const GRAPH_REPRESENTATIONS_REQUIRING_AXES = new Set([
  'bar_chart',
  'line_chart',
  'p_q_graph',
  'producer_graph',
  'market_graph',
]);

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  try {
    return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
  } catch (error) {
    throw new Error(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function exists(relPath) {
  return fs.existsSync(repoPath(relPath));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function pushCheck(checks, id, detail) {
  checks.push({ id, status: 'passed', detail });
}

function uniqueIds(records, field, label) {
  const seen = new Set();
  for (const record of records) {
    const value = record[field];
    assert(value, `${label} missing ${field}`);
    assert(!seen.has(value), `duplicate ${field}: ${value}`);
    seen.add(value);
  }
  return seen;
}

function schemaRequires(schema, schemaPath, fields) {
  assert(schema.$schema === 'https://json-schema.org/draft/2020-12/schema', `${schemaPath} must use JSON Schema 2020-12`);
  assert(schema.additionalProperties === false, `${schemaPath} must set additionalProperties false at root`);
  assert(Array.isArray(schema.required), `${schemaPath} must define root required fields`);
  for (const field of fields) {
    assert(schema.required.includes(field), `${schemaPath} must require ${field}`);
  }
}

function validateWrapper(wrapper, relPath, arrayField) {
  assert(wrapper.schema_version === 1, `${relPath} schema_version must be 1`);
  assert(wrapper.storage_decision, `${relPath} missing storage_decision`);
  assert(wrapper.storage_decision.registry_location === relPath, `${relPath} registry_location mismatch`);
  assert(wrapper.storage_decision.machine_registry_created === false, `${relPath} machine_registry_created must be false`);
  assert(Array.isArray(wrapper[arrayField]), `${relPath} must contain array ${arrayField}`);
  assert(wrapper.publication_policy, `${relPath} missing publication_policy`);
  assert(wrapper.publication_policy.student_facing_projection_allowed === false, `${relPath} must block student-facing projection`);
}

function validateTemplate(template, context) {
  const {
    actionIds,
    operationIds,
    unitIds,
    visualStateIds,
    checks,
  } = context;

  assert(template.template_id && /^[a-z][a-z0-9_]*$/.test(template.template_id), `invalid template_id ${template.template_id}`);
  assert(Array.isArray(template.source_unit_ids) && template.source_unit_ids.length > 0, `${template.template_id} missing source_unit_ids`);
  for (const unitId of template.source_unit_ids) {
    assert(unitIds.has(unitId), `${template.template_id} references missing source unit ${unitId}`);
  }
  assert(template.operation_reference_status !== 'governed', `${template.template_id} cannot use governed operation status in PV.2`);
  assert(Array.isArray(template.procedure_steps) && template.procedure_steps.length > 0, `${template.template_id} missing procedure_steps`);
  const stepIds = new Set();
  let provisionalOperationRefs = 0;

  for (const step of template.procedure_steps) {
    assert(step.step_id && /^[a-z][a-z0-9_]*$/.test(step.step_id), `${template.template_id} has invalid step_id`);
    assert(!stepIds.has(step.step_id), `${template.template_id} duplicate step_id ${step.step_id}`);
    stepIds.add(step.step_id);
    assert(step.label_nl, `${template.template_id}/${step.step_id} missing label_nl`);
    assert(step.action && actionIds.has(step.action), `${template.template_id}/${step.step_id} unknown action ${step.action}`);
    assert(Array.isArray(step.input_refs), `${template.template_id}/${step.step_id} input_refs must be an array`);
    assert(Array.isArray(step.output_refs), `${template.template_id}/${step.step_id} output_refs must be an array`);
    if (step.source_unit_ref) {
      assert(unitIds.has(step.source_unit_ref), `${template.template_id}/${step.step_id} references missing source_unit_ref ${step.source_unit_ref}`);
      assert(template.source_unit_ids.includes(step.source_unit_ref), `${template.template_id}/${step.step_id} source_unit_ref must be listed in source_unit_ids`);
    }
    if (step.visual_state_ref) {
      assert(visualStateIds.has(step.visual_state_ref), `${template.template_id}/${step.step_id} references missing visual_state_ref ${step.visual_state_ref}`);
    }
    if (step.operation_ref) {
      assert(step.operation_ref_status === 'provisional', `${template.template_id}/${step.step_id} operation_ref_status must be provisional`);
      assert(operationIds.has(step.operation_ref), `${template.template_id}/${step.step_id} references missing operation ${step.operation_ref}`);
      provisionalOperationRefs += 1;
    }
  }

  assert(template.publication, `${template.template_id} missing publication`);
  assert(template.publication.student_facing_allowed === false, `${template.template_id} must not allow student-facing projection in PV.2`);
  if (provisionalOperationRefs > 0) {
    assert(template.operation_reference_status === 'provisional', `${template.template_id} must mark operation_reference_status provisional`);
  }
  pushCheck(checks, `template:${template.template_id}`, `${template.procedure_steps.length} steps, ${provisionalOperationRefs} provisional operation refs`);
  return { provisionalOperationRefs };
}

function validateVisualState(state, context) {
  const {
    visualTypes,
    elementTypes,
    checks,
  } = context;

  assert(state.visual_state_id && /^[a-z][a-z0-9_]*$/.test(state.visual_state_id), `invalid visual_state_id ${state.visual_state_id}`);
  assert(visualTypes.has(state.visual_type), `${state.visual_state_id} unknown visual_type ${state.visual_type}`);
  assert(Array.isArray(state.elements) && state.elements.length > 0, `${state.visual_state_id} missing elements`);

  for (const element of state.elements) {
    assert(element.type && elementTypes.has(element.type), `${state.visual_state_id} unknown element type ${element.type}`);
    assert(element.role, `${state.visual_state_id}/${element.type} missing role`);
  }

  if (GRAPH_REPRESENTATIONS_REQUIRING_AXES.has(state.representation)) {
    const axes = state.elements.filter((element) => element.type === 'axis');
    const horizontal = axes.find((element) => element.axis_role === 'horizontal_axis');
    const vertical = axes.find((element) => element.axis_role === 'vertical_axis');
    assert(horizontal, `${state.visual_state_id} graph visual must declare horizontal axis`);
    assert(vertical, `${state.visual_state_id} graph visual must declare vertical axis`);
    assert(horizontal.label, `${state.visual_state_id} horizontal axis must have label`);
    assert(vertical.label, `${state.visual_state_id} vertical axis must have label`);
    assert(vertical.unit, `${state.visual_state_id} vertical axis must declare unit`);
  }

  if (state.representation === 'pie_chart') {
    assert(state.elements.some((element) => element.type === 'slice'), `${state.visual_state_id} pie chart must include slice element`);
    assert(state.elements.some((element) => element.type === 'legend' || element.type === 'annotation'), `${state.visual_state_id} pie chart must include legend or annotation`);
  }

  const surfaces = state.surface_requirements || {};
  for (const surface of ['web_light', 'web_dark', 'slide', 'docx', 'summary_thumbnail']) {
    assert(typeof surfaces[surface] === 'boolean', `${state.visual_state_id} surface_requirements.${surface} must be boolean`);
  }

  const accessibility = state.accessibility || {};
  assert(accessibility.meaning_not_color_only === true, `${state.visual_state_id} must not encode meaning by color alone`);
  assert(accessibility.direct_labels_required === true, `${state.visual_state_id} must require direct labels`);
  assert(accessibility.non_color_fallback, `${state.visual_state_id} must describe non-color fallback`);
  assert(state.publication && state.publication.student_facing_allowed === false, `${state.visual_state_id} must not allow student-facing projection in PV.2`);

  pushCheck(checks, `visual_state:${state.visual_state_id}`, `${state.visual_type}/${state.representation}`);
}

function validateProcedureVisualRegistry() {
  const checks = [];

  for (const relPath of [...REQUIRED_SCHEMA_FILES, ...REQUIRED_REGISTRY_FILES, UNITS_PATH, SKILL_OPERATION_REGISTRY_PATH, CP4_CLOSURE_PATH]) {
    assert(exists(relPath), `missing ${relPath}`);
  }
  pushCheck(checks, 'required_files_exist', 'schema, registry, unit, operation, and CP-4 files are present');

  for (const relPath of FORBIDDEN_MACHINE_PV_FILES) {
    assert(!exists(relPath), `unexpected PV machine registry file: ${relPath}`);
  }
  pushCheck(checks, 'no_machine_pv_registry', 'no references/machine PV registry files exist');

  const procedureTemplateSchema = readJson(PROCEDURE_TEMPLATE_SCHEMA);
  const visualStateSchema = readJson(VISUAL_STATE_SCHEMA);
  const visualGrammarSchema = readJson(VISUAL_GRAMMAR_SCHEMA);
  schemaRequires(procedureTemplateSchema, PROCEDURE_TEMPLATE_SCHEMA, ['template_id', 'source_unit_ids', 'procedure_steps', 'projections', 'publication']);
  schemaRequires(visualStateSchema, VISUAL_STATE_SCHEMA, ['visual_state_id', 'visual_type', 'elements', 'surface_requirements', 'accessibility', 'publication']);
  schemaRequires(visualGrammarSchema, VISUAL_GRAMMAR_SCHEMA, ['schema_version', 'registry_id', 'actions', 'visual_types', 'element_types', 'surface_ids', 'schema_examples']);
  pushCheck(checks, 'schema_contracts', 'PV schema files expose required root fields and strict roots');

  const vocab = readJson(VOCAB_PATH);
  const procedureTemplates = readJson(PROCEDURE_TEMPLATES_PATH);
  const visualStates = readJson(VISUAL_STATES_PATH);
  const unitTemplateLinks = readJson(UNIT_TEMPLATE_LINKS_PATH);
  const units = readJson(UNITS_PATH);
  const skillOperationRegistry = readJson(SKILL_OPERATION_REGISTRY_PATH);
  const cp4 = readJson(CP4_CLOSURE_PATH);

  assert(cp4.status === 'pass_with_conditions', 'CP-4 must be closed as pass_with_conditions');
  assert(cp4.pv_dependency_authorized === 'provisional references only', 'CP-4 must authorize PV provisional references only');
  assert(skillOperationRegistry.storage_decision.machine_registry_created === false, 'skill operation registry must remain references/data overlay');
  pushCheck(checks, 'cp4_and_operation_boundary', 'CP-4 allows provisional operation references only; operation registry is not machine-promoted');

  assert(vocab.schema_version === 1, 'vocab schema_version must be 1');
  assert(vocab.registry_id === 'procedure-visual-vocab', 'vocab registry_id mismatch');
  assert(vocab.storage_decision.machine_registry_created === false, 'vocab machine_registry_created must be false');
  assert(vocab.operation_reference_policy.exercise_operations_may_be_referenced === true, 'vocab must allow provisional exercise operation references');
  assert(vocab.operation_reference_policy.required_status === 'provisional', 'vocab operation required_status must be provisional');
  assert(vocab.operation_reference_policy.machine_promotion_authorized === false, 'vocab must block operation machine promotion');

  const actionIds = uniqueIds(vocab.actions || [], 'action_id', 'vocab action');
  const visualTypes = new Set(vocab.visual_types || []);
  const elementTypes = new Set(vocab.element_types || []);
  assert(actionIds.size >= 12, 'vocab must include enough action records for PV.2 examples and PV.3 pilots');
  assert(visualTypes.has('formula_trace') && visualTypes.has('graph_stage') && visualTypes.has('table_trace') && visualTypes.has('flowchart'), 'vocab must include formula, graph, table, and flowchart visual types');
  assert(elementTypes.has('axis') && elementTypes.has('annotation') && elementTypes.has('highlight'), 'vocab must include core visual element types');
  pushCheck(checks, 'vocab_policy', `${actionIds.size} actions, ${visualTypes.size} visual types, ${elementTypes.size} element types`);

  validateWrapper(procedureTemplates, PROCEDURE_TEMPLATES_PATH, 'templates');
  validateWrapper(visualStates, VISUAL_STATES_PATH, 'visual_states');
  validateWrapper(unitTemplateLinks, UNIT_TEMPLATE_LINKS_PATH, 'links');
  assert((procedureTemplates.templates || []).length === 0, 'PV.2 must not add real procedure templates before PV.3');
  assert((visualStates.visual_states || []).length === 0, 'PV.2 must not add real visual states before PV.3');
  assert((unitTemplateLinks.links || []).length === 0, 'PV.2 must not add unit-template links before PV.3');
  pushCheck(checks, 'empty_registries_pass', 'real PV registries are present, empty, and publication-blocked');

  const unitIds = new Set(units.map((unit) => unit.id));
  const operationIds = new Set((skillOperationRegistry.exercise_operations || []).map((op) => op.operation_id));
  for (const op of skillOperationRegistry.exercise_operations || []) {
    if ((vocab.schema_examples.procedure_templates || []).some((template) =>
      (template.procedure_steps || []).some((step) => step.operation_ref === op.operation_id)
    )) {
      assert(op.governance_status === 'provisional_until_cp4', `${op.operation_id} must remain provisional_until_cp4`);
    }
  }

  const exampleTemplates = vocab.schema_examples.procedure_templates || [];
  const exampleVisualStates = vocab.schema_examples.visual_states || [];
  assert(exampleTemplates.length >= 2, 'PV.2 vocab must include at least two procedure template examples');
  assert(exampleVisualStates.length >= 2, 'PV.2 vocab must include at least two visual state examples');
  const visualStateIds = uniqueIds(exampleVisualStates, 'visual_state_id', 'schema example visual state');
  uniqueIds(exampleTemplates, 'template_id', 'schema example template');

  let provisionalOperationRefCount = 0;
  for (const state of exampleVisualStates) {
    validateVisualState(state, { visualTypes, elementTypes, checks });
  }
  for (const template of exampleTemplates) {
    const result = validateTemplate(template, { actionIds, operationIds, unitIds, visualStateIds, checks });
    provisionalOperationRefCount += result.provisionalOperationRefs;
  }
  assert(provisionalOperationRefCount > 0, 'PV.2 examples must prove provisional operation-reference validation');
  pushCheck(checks, 'example_records_pass', `${exampleTemplates.length} procedure examples, ${exampleVisualStates.length} visual-state examples`);

  const graphExampleCount = exampleVisualStates.filter((state) => GRAPH_REPRESENTATIONS_REQUIRING_AXES.has(state.representation)).length;
  assert(graphExampleCount > 0, 'PV.2 examples must include at least one axis-validated graph/chart state');
  pushCheck(checks, 'graph_axis_and_accessibility_rules', `${graphExampleCount} graph/chart example(s) validated for axes, units, labels, and non-color fallback`);

  return {
    status: 'passed',
    checked_at: new Date().toISOString(),
    summary: {
      schema_file_count: REQUIRED_SCHEMA_FILES.length,
      registry_file_count: REQUIRED_REGISTRY_FILES.length,
      action_count: actionIds.size,
      visual_type_count: visualTypes.size,
      element_type_count: elementTypes.size,
      procedure_template_count: procedureTemplates.templates.length,
      visual_state_count: visualStates.visual_states.length,
      unit_template_link_count: unitTemplateLinks.links.length,
      schema_example_template_count: exampleTemplates.length,
      schema_example_visual_state_count: exampleVisualStates.length,
      provisional_operation_reference_count: provisionalOperationRefCount,
      machine_registry_created: false,
      student_facing_projection_allowed: false,
    },
    checks,
  };
}

function main() {
  try {
    const result = validateProcedureVisualRegistry();
    console.log(`OK Procedure-Visual registry: ${result.summary.schema_file_count} schemas, ${result.summary.schema_example_template_count} template examples, ${result.summary.provisional_operation_reference_count} provisional operation refs`);
  } catch (error) {
    console.error(`Procedure-Visual registry validation failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = {
  validateProcedureVisualRegistry,
};
