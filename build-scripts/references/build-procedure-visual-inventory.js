#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Adjust PILOT_DEFINITIONS when PV.1 is rerun with a different pilot set.
 * - Keep PV data under references/data/procedure-visual/ until PV.7 or a later
 *   human gate explicitly authorizes machine-registry promotion.
 * - Do not use this script to mutate references/machine/ or references/external/.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

const INVENTORY_PATH = 'references/data/procedure-visual/inventory.json';
const REPORT_JSON_PATH = 'reports/json/procedure-visual-inventory.json';
const REPORT_MD_PATH = 'reports/markdown/procedure-visual-inventory.md';

const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const SKILL_OPERATION_REGISTRY_PATH = 'references/data/skill-operation-registry.json';
const CP4_CLOSURE_PATH = 'reports/review-gates/GATE-CP4-skill-registry-coexistence/gate-closure.json';
const RX2_BLOCK_PATH = 'references/data/sprints/RX.2-generator-blocked-units.json';
const RX2B_BLOCK_PATH = 'references/data/sprints/RX.2b-generator-blocked-units.json';
const PROCEDURE_ENGINE_PATH = 'engines/procedure-engine.js';
const PROCEDURE_UI_PATH = 'engines/procedure-ui.js';
const PROCEDURE_SHELL_BUILDER_PATH = 'build-scripts/platform/build-procedure-shells.js';
const SKILLTREE_SHELL_BUILDER_PATH = 'build-scripts/platform/build-skilltree-shells.js';
const GENERATORS_PATH = 'engines/skilltree/generators.js';
const DIDACTIC_PRINCIPLES_PATH = 'references/authored/didactiek-principes.md';
const PRECISION_REFERENCE_PATH = 'references/authored/economic_mathematical_precision_reference.md';
const SOURCE_DATA_BOOK_1_DIR = 'source-data/book-1';

const CATEGORY_DEFINITIONS = {
  procedure_prose_only: 'Unit has Dutch prose procedure steps but no formal PV step/action sequence.',
  procedure_game_data_exists: 'Existing procedure-game data can be mapped to formal PV step IDs.',
  visualizable_formula_trace: 'Procedure can be rendered as a formula trace or symbolic step sequence.',
  visualizable_graph_stage: 'Procedure can be rendered as staged graph or chart states.',
  visualizable_flowchart: 'Procedure can be rendered as a causal or procedural flowchart.',
  table_trace_needed: 'Procedure requires table/source-value reading or table transformation.',
  surface_variants_needed: 'PV must plan web-light, web-dark, slide, docx, and thumbnail variants where relevant.',
  blocked_by_operation_registry: 'Candidate depends on provisional operation IDs or on operation vocabulary not yet governed.',
  blocked_by_generator: 'Candidate cannot be student-facing until its generator/projection support exists and validates.',
};

const PILOT_DEFINITIONS = [
  {
    rank: 1,
    template_id: 'choose_by_opportunity_cost_flow',
    title: 'Alternatieve-kostenprocedure als flowchart',
    unit_ids: ['B02'],
    representation_type: 'choice_context',
    visual_type: 'flowchart',
    economic_context: 'scarcity_and_choice',
    operation_ids: [],
    inventory_categories: ['procedure_prose_only', 'visualizable_flowchart', 'surface_variants_needed', 'blocked_by_operation_registry'],
    pilot_rationale: 'Book 1 lesson material already treats B02 as a canonical step procedure; PV can prove cross-surface procedure consistency without waiting for producer graphs.',
    next_step: 'PV.3 can turn the four B02 procedure steps into formal PV steps and a flowchart-style visual state sequence.',
  },
  {
    rank: 2,
    template_id: 'build_total_revenue_function_trace',
    title: 'TO-functie opstellen als formuletrace',
    unit_ids: ['A07'],
    representation_type: 'formula',
    visual_type: 'formula_trace',
    economic_context: 'producer_revenue',
    operation_ids: [],
    inventory_categories: ['procedure_prose_only', 'visualizable_formula_trace', 'surface_variants_needed', 'blocked_by_operation_registry'],
    pilot_rationale: 'A07 is an existing A-domain procedure with implemented generator support and clear symbolic steps.',
    next_step: 'PV.3 can encode the substitution and multiplication steps before producer graph work expands.',
  },
  {
    rank: 3,
    template_id: 'derive_marginal_revenue_trace',
    title: 'MO bepalen als formuletrace',
    unit_ids: ['A12'],
    representation_type: 'formula',
    visual_type: 'formula_trace',
    economic_context: 'producer_revenue',
    operation_ids: [],
    inventory_categories: ['procedure_prose_only', 'visualizable_formula_trace', 'surface_variants_needed', 'blocked_by_operation_registry'],
    pilot_rationale: 'A12 is a compact bridge between revenue functions and later MO=MK reasoning.',
    next_step: 'PV.3 can model derive-MO steps and link them to A20 without promoting operation IDs.',
  },
  {
    rank: 4,
    template_id: 'derive_marginal_cost_trace',
    title: 'MK bepalen als formuletrace',
    unit_ids: ['A13'],
    representation_type: 'formula',
    visual_type: 'formula_trace',
    economic_context: 'producer_costs',
    operation_ids: [],
    inventory_categories: ['procedure_prose_only', 'visualizable_formula_trace', 'surface_variants_needed', 'blocked_by_operation_registry'],
    pilot_rationale: 'A13 gives the cost-side mirror to A12 and is a prerequisite for producer/profit templates.',
    next_step: 'PV.3 can align MK derivation with A20 and later RX.3 producer units.',
  },
  {
    rank: 5,
    template_id: 'solve_profit_maximum_mo_equals_mk',
    title: 'MO = MK oplossen als proceduretrace',
    unit_ids: ['A20'],
    representation_type: 'formula',
    visual_type: 'formula_trace_and_future_graph_stage',
    economic_context: 'producer_profit_maximization',
    operation_ids: [],
    related_held_operation_ids: ['HOLD_GRAPHICAL_MO_MK_OPTIMUM'],
    inventory_categories: ['procedure_prose_only', 'visualizable_formula_trace', 'visualizable_graph_stage', 'surface_variants_needed', 'blocked_by_operation_registry'],
    pilot_rationale: 'A20 is strategically central: it should drive explanation prose, answer models, formula traces, and later producer graph stages from one formal procedure.',
    next_step: 'PV.3 should start with formula trace only; graph-stage projection waits for RX.3/PV.5 constraints.',
  },
  {
    rank: 6,
    template_id: 'select_table_values_trace',
    title: 'Tabelwaarden selecteren als table trace',
    unit_ids: ['A61'],
    representation_type: 'table',
    visual_type: 'table_trace',
    economic_context: 'source_value_selection',
    operation_ids: ['REP_TABLE_VALUE_SELECTION'],
    inventory_categories: ['procedure_prose_only', 'table_trace_needed', 'surface_variants_needed', 'blocked_by_operation_registry', 'blocked_by_generator'],
    pilot_rationale: 'A61 is the root table/source-value selection unit for later percentage, index, producer, and elasticity work.',
    next_step: 'PV.3 can formalize row/column/unit/source-value selection before generator implementation.',
  },
  {
    rank: 7,
    template_id: 'read_bar_chart_value_stage',
    title: 'Staafdiagramwaarde aflezen als grafische leesfase',
    unit_ids: ['A62'],
    representation_type: 'bar_chart',
    visual_type: 'graph_stage',
    economic_context: 'source_chart_reading',
    operation_ids: ['REP_BAR_CHART_VALUE_READING'],
    inventory_categories: ['procedure_prose_only', 'visualizable_graph_stage', 'surface_variants_needed', 'blocked_by_operation_registry', 'blocked_by_generator'],
    pilot_rationale: 'A62 is a basic graphical foundation unit with explicit title, label, unit, scale, and estimation steps.',
    next_step: 'PV.3 can create a visual state sequence for context -> label -> scale -> value reading.',
  },
  {
    rank: 8,
    template_id: 'read_line_graph_value_stage',
    title: 'Lijngrafiekwaarde aflezen als grafische leesfase',
    unit_ids: ['A63'],
    representation_type: 'line_chart',
    visual_type: 'graph_stage',
    economic_context: 'time_series_reading',
    operation_ids: ['REP_LINE_GRAPH_VALUE_READING'],
    inventory_categories: ['procedure_prose_only', 'visualizable_graph_stage', 'surface_variants_needed', 'blocked_by_operation_registry', 'blocked_by_generator'],
    pilot_rationale: 'A63 is needed before TO/TK graph and index-line tasks; it also exercises interpolation language.',
    next_step: 'PV.3 can encode exact read, estimate, and interpolate as distinct student-visible states.',
  },
  {
    rank: 9,
    template_id: 'read_pie_share_stage',
    title: 'Cirkeldiagramaandeel aflezen als grafische leesfase',
    unit_ids: ['A64'],
    representation_type: 'pie_chart',
    visual_type: 'graph_stage',
    economic_context: 'source_share_reading',
    operation_ids: ['REP_PIE_SHARE_READING'],
    inventory_categories: ['procedure_prose_only', 'visualizable_graph_stage', 'surface_variants_needed', 'blocked_by_operation_registry', 'blocked_by_generator'],
    pilot_rationale: 'A64 tests whether PV can represent shares separately from absolute quantities.',
    next_step: 'PV.3 should keep A64 separate from A71-style pie-chart percentage change.',
  },
  {
    rank: 10,
    template_id: 'percentage_change_from_table_trace',
    title: 'Procentuele verandering vanuit tabel als table/formula trace',
    unit_ids: ['A67'],
    representation_type: 'table',
    visual_type: 'table_trace_and_formula_trace',
    economic_context: 'percentage_change',
    operation_ids: ['REP_PCT_CHANGE_TABLE'],
    inventory_categories: ['procedure_prose_only', 'visualizable_formula_trace', 'table_trace_needed', 'surface_variants_needed', 'blocked_by_operation_registry', 'blocked_by_generator'],
    pilot_rationale: 'A67 composes value selection with calculation and is a clear test of read-values-then-calculate modeling.',
    next_step: 'PV.3 can align table highlighting, formula substitution, and answer-model steps.',
  },
  {
    rank: 11,
    template_id: 'percentage_change_from_bar_chart_stage',
    title: 'Procentuele verandering vanuit staafdiagram als graph/formula trace',
    unit_ids: ['A68'],
    representation_type: 'bar_chart',
    visual_type: 'graph_stage_and_formula_trace',
    economic_context: 'percentage_change_from_chart',
    operation_ids: ['REP_PCT_CHANGE_BAR_CHART'],
    inventory_categories: ['procedure_prose_only', 'visualizable_graph_stage', 'visualizable_formula_trace', 'surface_variants_needed', 'blocked_by_operation_registry', 'blocked_by_generator'],
    pilot_rationale: 'A68 proves PV can separate reading two visual values from applying the percentage-change formula.',
    next_step: 'PV.3 should keep chart reading and formula calculation as separate formal steps.',
  },
  {
    rank: 12,
    template_id: 'index_change_from_line_graph_stage',
    title: 'Indexverandering uit lijngrafiek als graph/index trace',
    unit_ids: ['A73'],
    representation_type: 'line_chart',
    visual_type: 'graph_stage_and_formula_trace',
    economic_context: 'index_change',
    operation_ids: ['REP_INDEX_CHANGE_LINE_GRAPH'],
    inventory_categories: ['procedure_prose_only', 'visualizable_graph_stage', 'visualizable_formula_trace', 'surface_variants_needed', 'blocked_by_operation_registry', 'blocked_by_generator'],
    pilot_rationale: 'A73 keeps index-point interpretation visible before the later percentage-change-from-index step.',
    next_step: 'PV.3 can contrast index-point reading with percentage-change calculation.',
  },
];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function readText(relPath) {
  return fs.readFileSync(repoPath(relPath), 'utf8');
}

function writeJson(relPath, data) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(relPath, text) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text);
}

function walkFiles(relDir) {
  const full = repoPath(relDir);
  if (!fs.existsSync(full)) return [];
  const out = [];
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(relDir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) out.push(...walkFiles(rel));
    if (entry.isFile()) out.push(rel);
  }
  return out.sort();
}

function countBy(items, field) {
  return items.reduce((acc, item) => {
    const values = Array.isArray(item[field]) ? item[field] : [item[field]];
    for (const value of values) {
      const key = value || '<missing>';
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {});
}

function generatorIds() {
  // The generator file exports in Node and attaches to window in browsers.
  // Requiring it here is read-only and keeps PV.1 aligned with runtime coverage.
  const exported = require(repoPath(GENERATORS_PATH));
  return new Set(Object.keys(exported.GEN || {}));
}

function loadGeneratorBlocks() {
  const blocks = [];
  for (const relPath of [RX2_BLOCK_PATH, RX2B_BLOCK_PATH]) {
    if (!fs.existsSync(repoPath(relPath))) continue;
    const record = readJson(relPath);
    for (const unit of record.units || []) {
      blocks.push({ ...unit, source_path: relPath });
    }
  }
  return blocks;
}

function linkedOperations(operationIds, operationById) {
  return operationIds.map((operationId) => {
    const op = operationById.get(operationId);
    if (!op) {
      return {
        operation_id: operationId,
        found: false,
        provisional_reference_allowed_by_cp4: false,
      };
    }
    return {
      operation_id: operationId,
      found: true,
      name: op.name,
      status: op.status,
      governance_status: op.governance_status,
      mapped_unit_ids: op.mapped_unit_ids || [],
      source_path: op.source_path,
      provisional_reference_allowed_by_cp4: op.governance_status === 'provisional_until_cp4',
    };
  });
}

function buildPilot(def, unitById, operationById, generatorIdSet, generatorBlockById) {
  const units = def.unit_ids.map((unitId) => {
    const unit = unitById.get(unitId);
    if (!unit) {
      return { unit_id: unitId, found: false };
    }
    const generator = unit.generator || null;
    const generatorImplemented = generator ? generatorIdSet.has(generator.replace(/^GEN_/, '')) || generatorIdSet.has(unitId) || generatorIdSet.has(generator) : null;
    const blocked = generatorBlockById.get(unitId);
    return {
      unit_id: unit.id,
      found: true,
      name: unit.name,
      mastery_target: unit.mastery_target,
      aspects: unit.aspects || [],
      needs: unit.needs || [],
      procedure_step_count: Array.isArray(unit.procedure) ? unit.procedure.length : 0,
      generator,
      generator_implemented: generator ? generatorIdSet.has(unit.id) || generatorIdSet.has(generator) : null,
      generator_blocked: Boolean(blocked) || (generator ? !generatorImplemented : false),
      generator_block_source: blocked ? blocked.source_path : null,
    };
  });

  const operation_refs = linkedOperations(def.operation_ids || [], operationById);
  const blocker_status = new Set([
    'pv_schema_pending_pv2',
    'visual_renderer_pending',
    'procedure_game_mapping_pending',
  ]);
  if (def.inventory_categories.includes('blocked_by_operation_registry')) {
    blocker_status.add('operation_ids_provisional_until_later_registry_gate');
  }
  if (def.inventory_categories.includes('blocked_by_generator') || units.some((unit) => unit.generator_blocked)) {
    blocker_status.add('generator_or_projection_support_pending');
  }

  return {
    ...def,
    status: 'ranked_pilot_candidate',
    units,
    operation_refs,
    blocker_status: [...blocker_status],
    student_facing_projection_allowed: false,
  };
}

function secondaryCandidates(operationRegistry) {
  const wantedIds = [
    'REP_BASE_COMPARISON_VALUE_IDENTIFICATION',
    'REP_SHARE_TOTAL_ABSOLUTE_QUANTITY',
    'REP_PCT_CHANGE_LINE_GRAPH',
    'REP_PERCENTAGE_POINT_CHANGE',
    'REP_INDEX_FROM_TABLE',
    'REP_PCT_CHANGE_FROM_INDEX',
    'REP_PROFIT_FROM_REVENUE_COST_TABLE',
    'REP_PROFIT_FROM_P_GTK_Q',
    'REP_MAX_PROFIT_TO_TK_TABLE',
    'REP_ELASTICITY_FROM_TABLE',
    'REP_REVENUE_CHANGE_WITH_ELASTICITY_SOURCE',
  ];
  return wantedIds.map((id) => {
    const op = (operationRegistry.exercise_operations || []).find((record) => record.operation_id === id);
    if (!op) return { operation_id: id, status: 'missing_from_current_skill_operation_registry' };
    return {
      operation_id: op.operation_id,
      name: op.name,
      status: op.status,
      governance_status: op.governance_status,
      candidate_unit_id: op.candidate_unit_id,
      mapped_unit_ids: op.mapped_unit_ids,
      representation: op.representation,
      reason_for_secondary_status: op.status === 'candidate_pending_review'
        ? 'Later RX mutation lane; keep out of PV.1 ranked pilot list until unit review catches up.'
        : 'Useful follow-up candidate after PV.2/PV.3 prove the schema.',
    };
  });
}

function buildInventory() {
  const units = readJson(UNITS_PATH);
  const unitById = new Map(units.map((unit) => [unit.id, unit]));
  const operationRegistry = readJson(SKILL_OPERATION_REGISTRY_PATH);
  const operationById = new Map((operationRegistry.exercise_operations || []).map((op) => [op.operation_id, op]));
  const cp4 = readJson(CP4_CLOSURE_PATH);
  const generatorIdSet = generatorIds();
  const generatorBlocks = loadGeneratorBlocks();
  const generatorBlockById = new Map(generatorBlocks.map((unit) => [unit.unit_id, unit]));
  const book1Files = walkFiles(SOURCE_DATA_BOOK_1_DIR);

  const procedureEngine = readText(PROCEDURE_ENGINE_PATH);
  const procedureUi = readText(PROCEDURE_UI_PATH);
  const procedureShellBuilder = readText(PROCEDURE_SHELL_BUILDER_PATH);
  const skilltreeShellBuilder = readText(SKILLTREE_SHELL_BUILDER_PATH);

  const pilots = PILOT_DEFINITIONS.map((def) => buildPilot(def, unitById, operationById, generatorIdSet, generatorBlockById));
  const applyUnitsWithProcedures = units.filter((unit) => (
    unit.mastery_target === 'apply'
    && unit.deprecated !== true
    && Array.isArray(unit.procedure)
    && unit.procedure.length > 0
  ));
  const proseOnlyUnits = applyUnitsWithProcedures.filter((unit) => !PILOT_DEFINITIONS.some((pilot) => pilot.unit_ids.includes(unit.id))).length;

  const procedureDataFiles = book1Files.filter((file) => /procedure/i.test(file));

  const inventory = {
    schema_version: 1,
    inventory_id: 'procedure-visual-inventory',
    sprint_id: 'PV.1',
    status: 'completed_inventory',
    generated_by: 'build-scripts/references/build-procedure-visual-inventory.js',
    generated_on: new Date().toISOString(),
    storage_decision: {
      inventory_location: INVENTORY_PATH,
      machine_registry_created: false,
      reason: 'PV.1 is a governed references/data inventory. Machine promotion remains blocked until PV.7 or a later human gate approves schema, CLI, validators, mutation logs, reports, lesson regressions, and promotion scope.',
    },
    source_files: [
      UNITS_PATH,
      SKILL_OPERATION_REGISTRY_PATH,
      CP4_CLOSURE_PATH,
      RX2_BLOCK_PATH,
      RX2B_BLOCK_PATH,
      SOURCE_DATA_BOOK_1_DIR,
      PROCEDURE_ENGINE_PATH,
      PROCEDURE_UI_PATH,
      PROCEDURE_SHELL_BUILDER_PATH,
      SKILLTREE_SHELL_BUILDER_PATH,
      GENERATORS_PATH,
      DIDACTIC_PRINCIPLES_PATH,
      PRECISION_REFERENCE_PATH,
    ],
    policy: {
      protected_reference_data_changed: false,
      no_machine_registry_authorized: true,
      no_external_source_mutation: true,
      no_lesson_repo_mutation: true,
      student_facing_projection_authorized: false,
      pv_operation_reference_policy: cp4.pv_dependency_authorized,
      pv_templates_may_reference_provisional_operations: cp4.pv_dependency_authorized === 'provisional references only',
    },
    category_definitions: CATEGORY_DEFINITIONS,
    summary: {
      ranked_pilot_template_count: pilots.length,
      candidate_unit_count: new Set(pilots.flatMap((pilot) => pilot.unit_ids)).size,
      category_counts: countBy(pilots, 'inventory_categories'),
      visual_type_counts: countBy(pilots, 'visual_type'),
      generator_blocked_pilot_count: pilots.filter((pilot) => pilot.blocker_status.includes('generator_or_projection_support_pending')).length,
      provisional_operation_reference_count: pilots.reduce((sum, pilot) => sum + pilot.operation_refs.filter((op) => op.provisional_reference_allowed_by_cp4).length, 0),
      apply_units_with_procedure_count: applyUnitsWithProcedures.length,
      apply_units_with_procedure_not_ranked_count: proseOnlyUnits,
      source_data_book_1_file_count: book1Files.length,
      source_data_book_1_procedure_data_file_count: procedureDataFiles.length,
    },
    runtime_surface_findings: {
      micro_teaching_unit_procedures: {
        status: 'prose_procedure_steps_exist',
        live_apply_units_with_procedures: applyUnitsWithProcedures.length,
        limitation: 'Procedure steps are Dutch sentence strings, not formal actions with input/output refs or visual-state refs.',
      },
      skill_operation_registry: {
        path: SKILL_OPERATION_REGISTRY_PATH,
        status: operationRegistry.status,
        machine_registry_created: operationRegistry.storage_decision && operationRegistry.storage_decision.machine_registry_created,
        operation_policy: operationRegistry.field_policy && operationRegistry.field_policy.exercise_operations,
        limitation: 'CP-4 keeps exercise_operations provisional; PV may reference them only with explicit provisional status.',
      },
      source_data_book_1: {
        path: SOURCE_DATA_BOOK_1_DIR,
        files: book1Files,
        procedure_data_files: procedureDataFiles,
        finding: procedureDataFiles.length
          ? 'Book 1 source data has procedure-named files to inspect in PV.3.'
          : 'Book 1 source data currently exposes reasoning CSV data but no source-side procedure-game data files.',
      },
      procedure_engine: {
        path: PROCEDURE_ENGINE_PATH,
        step_types_supported: ['given', 'choose'],
        formal_step_id_supported: /formal_step_id/.test(procedureEngine) || /formal_step_id/.test(procedureUi),
        target_data_source: 'shared/procedure/<paragraph>.js files in a module/book target',
        shell_builder_path: PROCEDURE_SHELL_BUILDER_PATH,
        shell_builder_reads_target_shared_procedure: /shared['"],\s*['"]procedure/.test(procedureShellBuilder) || /shared[\\/]procedure/.test(procedureShellBuilder),
      },
      skilltree_shell_builder: {
        path: SKILLTREE_SHELL_BUILDER_PATH,
        reads_canonical_catalog: /base-elements/.test(skilltreeShellBuilder),
        generator_ids_implemented_count: generatorIdSet.size,
        generator_block_records: generatorBlocks.length,
      },
      didactic_constraints: [
        {
          source_path: DIDACTIC_PRINCIPLES_PATH,
          principle: 'Unified procedures across explanation, answer model, games, and visuals.',
        },
        {
          source_path: DIDACTIC_PRINCIPLES_PATH,
          principle: 'Dual coding and embedded graph labels are required for explanatory material.',
        },
        {
          source_path: PRECISION_REFERENCE_PATH,
          principle: 'Graph and formula surfaces must preserve assumptions, labels, equality conventions, and exact/estimate distinctions.',
        },
      ],
    },
    ranked_pilot_templates: pilots,
    secondary_candidate_pool: secondaryCandidates(operationRegistry),
    pv2_schema_requirements: [
      'Procedure template schema must represent source_unit_ids, ordered steps, actions, inputs, outputs, labels, and optional visual_state_ref.',
      'Visual-state schema must represent visual_type, semantic_focus, elements, surface requirements, and accessibility requirements.',
      'Operation references must preserve provisional status until a governed operation registry exists.',
      'Pilot records must not authorize student-facing projection unless later PV gates and generator/publication controls allow it.',
    ],
    blocked_scope: cp4.blocked_next_sprint_scope || [],
  };

  return inventory;
}

function markdownReport(inventory) {
  const lines = [];
  lines.push('# Procedure-Visual Inventory');
  lines.push('');
  lines.push(`Status: \`${inventory.status}\``);
  lines.push(`Sprint: \`${inventory.sprint_id}\``);
  lines.push(`Generated by: \`${inventory.generated_by}\``);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`Ranked pilot templates: \`${inventory.summary.ranked_pilot_template_count}\``);
  lines.push(`Candidate units represented: \`${inventory.summary.candidate_unit_count}\``);
  lines.push(`Generator-blocked pilot templates: \`${inventory.summary.generator_blocked_pilot_count}\``);
  lines.push(`Provisional operation references: \`${inventory.summary.provisional_operation_reference_count}\``);
  lines.push(`Apply units with prose procedures: \`${inventory.summary.apply_units_with_procedure_count}\``);
  lines.push('');
  lines.push('## Ranked Pilot Templates');
  lines.push('');
  lines.push('| Rank | Template | Units | Representation | Visual type | Blockers |');
  lines.push('|---:|---|---|---|---|---|');
  for (const pilot of inventory.ranked_pilot_templates) {
    lines.push(`| ${pilot.rank} | \`${pilot.template_id}\` | \`${pilot.unit_ids.join(', ')}\` | \`${pilot.representation_type}\` | \`${pilot.visual_type}\` | ${pilot.blocker_status.map((item) => `\`${item}\``).join('<br>')} |`);
  }
  lines.push('');
  lines.push('## Category Counts');
  lines.push('');
  lines.push('| Category | Count |');
  lines.push('|---|---:|');
  for (const [category, count] of Object.entries(inventory.summary.category_counts).sort()) {
    lines.push(`| \`${category}\` | ${count} |`);
  }
  lines.push('');
  lines.push('## Runtime Findings');
  lines.push('');
  lines.push(`- Micro-unit procedures: ${inventory.runtime_surface_findings.micro_teaching_unit_procedures.limitation}`);
  lines.push(`- Procedure engine formal step IDs: \`${inventory.runtime_surface_findings.procedure_engine.formal_step_id_supported}\``);
  lines.push(`- Book 1 source procedure data files: \`${inventory.summary.source_data_book_1_procedure_data_file_count}\``);
  lines.push(`- Skill-operation registry status: \`${inventory.runtime_surface_findings.skill_operation_registry.status}\``);
  lines.push('');
  lines.push('## PV.2 Schema Requirements');
  lines.push('');
  for (const requirement of inventory.pv2_schema_requirements) {
    lines.push(`- ${requirement}`);
  }
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  lines.push('No protected reference data changed.');
  lines.push('');
  lines.push('- PV.1 did not mutate `references/machine/` or `references/external/`.');
  lines.push('- PV.1 did not create `references/machine/procedure-templates.json` or `references/machine/visual-states.json`.');
  lines.push('- PV.1 does not authorize student-facing PV projection, diagnostics, adaptive routing, mastery decisions, sequencing, AI, or summative use.');
  lines.push('');
  return `${lines.join('\n')}`;
}

function main() {
  const inventory = buildInventory();
  writeJson(INVENTORY_PATH, inventory);
  writeJson(REPORT_JSON_PATH, inventory);
  writeText(REPORT_MD_PATH, markdownReport(inventory));
  console.log(`Wrote ${INVENTORY_PATH} with ${inventory.ranked_pilot_templates.length} ranked PV pilot templates`);
}

if (require.main === module) main();
