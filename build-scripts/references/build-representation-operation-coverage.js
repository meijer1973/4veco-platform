#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep this report layer read-only with respect to references/machine/ and
 *   references/external/.
 * - Add new coverage rows to FOUNDATION_REQUIREMENTS when future RX/PV gates
 *   approve additional representation-sensitive lanes.
 * - Do not use this script to promote operation records to a machine registry.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

const INPUTS = {
  skillOperationRegistry: 'references/data/skill-operation-registry.json',
  rx1Inventory: 'references/data/sprints/RX.1-representation-operation-inventory.json',
  units: 'references/machine/micro-teaching-units.json',
  pvTemplates: 'references/data/procedure-visual/procedure-templates.json',
  pvVisualStates: 'references/data/procedure-visual/visual-states.json',
  pvLinks: 'references/data/procedure-visual/unit-template-links.json',
  generators: 'engines/skilltree/generators.js',
};

const OUTPUTS = {
  coverageJson: 'reports/json/representation-operation-coverage.json',
  coverageMd: 'reports/representation-operation-coverage.md',
  coverageMdMirror: 'reports/markdown/representation-operation-coverage.md',
  graphTreeJson: 'reports/json/graph-skill-tree.json',
  graphTreeMd: 'reports/graph-skill-tree.md',
  graphTreeMdMirror: 'reports/markdown/graph-skill-tree.md',
  gapsJson: 'reports/json/representation-transfer-gaps.json',
  gapsMd: 'reports/representation-transfer-gaps.md',
  gapsMdMirror: 'reports/markdown/representation-transfer-gaps.md',
  gatePacketJson: 'reports/review-gates/GATE-RX5-representation-operation-reports/review-packet.json',
  gatePacketMd: 'reports/review-gates/GATE-RX5-representation-operation-reports/review-packet.md',
  gateClosureJson: 'reports/review-gates/GATE-RX5-representation-operation-reports/technical-closure.json',
  gateClosureMd: 'reports/review-gates/GATE-RX5-representation-operation-reports/technical-closure.md',
};

const FOUNDATION_REQUIREMENTS = [
  {
    requirement_id: 'table_value_selection',
    label: 'table value selection',
    expected_unit_id: 'A61',
    expected_operation_id: 'REP_TABLE_VALUE_SELECTION',
    category: 'foundation',
  },
  {
    requirement_id: 'bar_chart_value_reading',
    label: 'bar chart value reading',
    expected_unit_id: 'A62',
    expected_operation_id: 'REP_BAR_CHART_VALUE_READING',
    category: 'foundation',
  },
  {
    requirement_id: 'line_graph_value_reading',
    label: 'line graph value reading',
    expected_unit_id: 'A63',
    expected_operation_id: 'REP_LINE_GRAPH_VALUE_READING',
    category: 'foundation',
  },
  {
    requirement_id: 'pie_chart_share_reading',
    label: 'pie chart share reading',
    expected_unit_id: 'A64',
    expected_operation_id: 'REP_PIE_SHARE_READING',
    category: 'foundation',
  },
  {
    requirement_id: 'share_times_total',
    label: 'absolute quantity from share and total',
    expected_unit_id: 'A65',
    expected_operation_id: 'REP_SHARE_TOTAL_ABSOLUTE_QUANTITY',
    category: 'foundation',
  },
  {
    requirement_id: 'percentage_change_bar_chart',
    label: 'percentage change from bar chart',
    expected_unit_id: 'A68',
    expected_operation_id: 'REP_PCT_CHANGE_BAR_CHART',
    category: 'composed_calculation',
  },
  {
    requirement_id: 'percentage_change_line_graph',
    label: 'percentage change from line graph',
    expected_unit_id: 'A69',
    expected_operation_id: 'REP_PCT_CHANGE_LINE_GRAPH',
    category: 'composed_calculation',
  },
  {
    requirement_id: 'percentage_change_pie_chart',
    label: 'percentage change from pie chart',
    expected_unit_id: 'A71',
    expected_operation_id: 'REP_PCT_CHANGE_PIE_CHART',
    category: 'held_high_risk',
  },
  {
    requirement_id: 'index_change_line_graph',
    label: 'index change from line graph',
    expected_unit_id: 'A73',
    expected_operation_id: 'REP_INDEX_CHANGE_LINE_GRAPH',
    category: 'composed_calculation',
  },
  {
    requirement_id: 'profit_revenue_cost_table',
    label: 'profit from revenue/cost table',
    expected_unit_id: 'A75',
    expected_operation_id: 'REP_PROFIT_FROM_REVENUE_COST_TABLE',
    category: 'producer_table',
  },
  {
    requirement_id: 'profit_p_gtk_q',
    label: 'profit from P, GTK, and Q',
    expected_unit_id: 'A76',
    expected_operation_id: 'REP_PROFIT_FROM_P_GTK_Q',
    category: 'producer_table',
  },
  {
    requirement_id: 'break_even_to_tk_graph',
    label: 'break-even from TO-TK graph',
    expected_unit_id: 'A77',
    expected_operation_id: 'REP_BREAK_EVEN_TO_TK_GRAPH',
    category: 'producer_graph',
  },
  {
    requirement_id: 'profit_loss_to_tk_graph',
    label: 'profit/loss from TO-TK graph',
    expected_unit_id: 'A78',
    expected_operation_id: 'REP_PROFIT_LOSS_TO_TK_GRAPH',
    category: 'producer_graph',
  },
  {
    requirement_id: 'max_profit_to_tk_table',
    label: 'maximum profit from TO-TK table',
    expected_unit_id: 'A79',
    expected_operation_id: 'REP_MAX_PROFIT_TO_TK_TABLE',
    category: 'producer_table',
  },
  {
    requirement_id: 'profit_rectangle_producer_graph',
    label: 'profit rectangle in producer graph',
    expected_unit_id: 'A80',
    expected_operation_id: 'REP_PROFIT_RECTANGLE_PRODUCER_GRAPH',
    category: 'held_until_pv_producer_graph',
  },
  {
    requirement_id: 'producer_graph_profit_loss_break_even',
    label: 'profit/loss/break-even in producer graph',
    expected_unit_id: 'A81',
    expected_operation_id: 'REP_PROFIT_LOSS_BREAK_EVEN_PRODUCER_GRAPH',
    category: 'held_until_pv_producer_graph',
  },
  {
    requirement_id: 'elasticity_table',
    label: 'elasticity from table values',
    expected_unit_id: 'A82',
    expected_operation_id: 'REP_ELASTICITY_FROM_TABLE',
    category: 'elasticity',
  },
  {
    requirement_id: 'elasticity_pq_graph',
    label: 'demand elasticity from P-Q graph',
    expected_unit_id: 'A83',
    expected_operation_id: 'REP_ELASTICITY_FROM_DEMAND_GRAPH',
    category: 'elasticity_graph',
  },
  {
    requirement_id: 'revenue_change_elasticity_source',
    label: 'revenue change with elasticity from source',
    expected_unit_id: 'A84',
    expected_operation_id: 'REP_REVENUE_CHANGE_WITH_ELASTICITY_SOURCE',
    category: 'elasticity',
  },
];

const HELD_OPERATION_IDS = new Set([
  'REP_PCT_CHANGE_PIE_CHART',
  'REP_PROFIT_RECTANGLE_PRODUCER_GRAPH',
  'REP_PROFIT_LOSS_BREAK_EVEN_PRODUCER_GRAPH',
  'HOLD_WELFARE_AREAS_PQ_DIAGRAM',
  'HOLD_SHIFT_VS_MOVEMENT',
  'HOLD_SHORT_SIDE_INTERVENTION_QUANTITY',
  'HOLD_MARGINAL_VALUES_FROM_TABLE',
  'HOLD_GRAPHICAL_MO_MK_OPTIMUM',
]);

const RX5_GATE_ID = 'GATE-RX5-representation-operation-reports';
const TODAY = '2026-05-02';

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function writeJson(relPath, data) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function writeText(relPath, text) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text, 'utf8');
}

function countBy(items, field) {
  return items.reduce((acc, item) => {
    const key = item[field] || '<missing>';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}

function loadGenerators() {
  try {
    const moduleExports = require(repoPath(INPUTS.generators));
    return moduleExports.GEN || moduleExports;
  } catch (error) {
    return {};
  }
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(abs));
    } else {
      files.push(abs);
    }
  }
  return files;
}

function collectGeneratorBlocks() {
  const roots = [
    repoPath('references/data/sprints'),
    repoPath('reports/review-gates'),
  ];
  const blocked = new Map();

  for (const root of roots) {
    for (const full of walkFiles(root)) {
      if (!/generator-blocked-units\.json$/i.test(full)) continue;
      const rel = path.relative(REPO_ROOT, full).replace(/\\/g, '/');
      const data = JSON.parse(fs.readFileSync(full, 'utf8'));
      const ids = new Set();
      for (const unitId of data.generator_blocked_units || []) ids.add(unitId);
      for (const unit of data.units || []) {
        if (unit.unit_id) ids.add(unit.unit_id);
      }
      for (const unitId of ids) {
        if (!blocked.has(unitId)) {
          blocked.set(unitId, []);
        }
        blocked.get(unitId).push(rel);
      }
    }
  }

  return blocked;
}

function buildPvIndexes(templates, visualStates, links) {
  const templatesById = new Map((templates.templates || []).map((template) => [template.template_id, template]));
  const visualStatesById = new Map((visualStates.visual_states || []).map((state) => [state.visual_state_id, state]));
  const byUnit = new Map();

  for (const link of links.links || []) {
    if (!byUnit.has(link.unit_id)) byUnit.set(link.unit_id, []);
    const template = templatesById.get(link.template_id);
    const visualStateRefs = template
      ? unique((template.procedure_steps || []).map((step) => step.visual_state_ref))
      : [];
    byUnit.get(link.unit_id).push({
      template_id: link.template_id,
      link_status: link.status,
      projection_blockers: link.projection_blockers || [],
      student_facing_allowed: Boolean(link.publication && link.publication.student_facing_allowed),
      visual_state_ids: visualStateRefs.filter((id) => visualStatesById.has(id)),
    });
  }

  return { templatesById, visualStatesById, byUnit };
}

function operationCoverageState(operation, unitsById) {
  const candidate = operation.candidate_unit_id || null;
  const candidateIsLive = Boolean(candidate && unitsById.has(candidate));
  const sourceStatus = operation.status || 'unknown';

  if (HELD_OPERATION_IDS.has(operation.operation_id) || /held|hold/i.test(sourceStatus)) {
    return candidateIsLive ? 'held_but_candidate_unit_live' : 'held_or_duplicate_review';
  }
  if (candidateIsLive && sourceStatus === 'live_unit_mapped') return 'live_unit_mapped';
  if (candidateIsLive) return 'live_unit_live_registry_status_stale';
  if (sourceStatus === 'overlay_provisional') return 'overlay_provisional';
  if (candidate) return 'candidate_not_live';
  return 'unmapped_or_not_scoped';
}

function operationCoverageType(operation) {
  const representation = operation.representation || 'not_declared';
  const base = operation.base_operation || 'not_declared';
  if (/not_declared|none|formula/.test(representation)) return 'base_calculation_or_unclassified';
  if (/table|chart|graph|diagram|source|p_q|to_tk/i.test(representation)) {
    if (/source_value|reading|share_reading|selection/i.test(base)) return 'representation_reading_foundation';
    return 'calculation_from_representation';
  }
  return 'representation_related';
}

function linkedOperationsByUnit(operations) {
  const byUnit = new Map();
  for (const operation of operations) {
    const unitIds = unique([
      operation.candidate_unit_id,
      ...(operation.mapped_unit_ids || []),
      ...(operation.live_unit_ids || []),
    ]);
    for (const unitId of unitIds) {
      if (!byUnit.has(unitId)) byUnit.set(unitId, []);
      byUnit.get(unitId).push(operation.operation_id);
    }
  }
  return byUnit;
}

function buildCoverageRows(registry, unitsById, pvByUnit, generatorBlocks, generators) {
  return (registry.exercise_operations || []).map((operation) => {
    const candidate = operation.candidate_unit_id || null;
    const mappedUnitIds = operation.mapped_unit_ids || [];
    const liveUnitIds = unique([
      ...mappedUnitIds.filter((unitId) => unitsById.has(unitId)),
      candidate && unitsById.has(candidate) ? candidate : null,
    ]);
    const liveUnits = liveUnitIds.map((unitId) => unitsById.get(unitId));
    const pvLinks = liveUnitIds.flatMap((unitId) => pvByUnit.get(unitId) || []);
    const visualStateIds = unique(pvLinks.flatMap((link) => link.visual_state_ids || []));
    const candidateUnit = candidate ? unitsById.get(candidate) : null;
    const generatorInfo = liveUnits.map((unit) => ({
      unit_id: unit.id,
      declared_generator: unit.generator || null,
      generator_implemented: Boolean(generators[unit.id] || (unit.generator && generators[unit.generator])),
      generator_blocked: generatorBlocks.has(unit.id),
      generator_block_sources: generatorBlocks.get(unit.id) || [],
    }));
    const nameAlignment = candidateUnit && candidateUnit.name !== operation.name
      ? 'live_unit_name_differs_from_operation_label'
      : 'aligned_or_not_applicable';

    return {
      operation_id: operation.operation_id,
      operation_name: operation.name,
      source_status: operation.status,
      governance_status: operation.governance_status || 'provisional',
      coverage_state: operationCoverageState(operation, unitsById),
      coverage_type: operationCoverageType(operation),
      representation: operation.representation || 'not_declared',
      base_operation: operation.base_operation || 'not_declared',
      economic_context: operation.economic_context || 'not_declared',
      candidate_unit_id: candidate,
      candidate_unit_live: Boolean(candidateUnit),
      live_unit_ids: liveUnitIds,
      live_unit_names: liveUnits.map((unit) => unit.name),
      mapped_unit_ids: mappedUnitIds,
      generator_info: generatorInfo,
      any_generator_blocked: generatorInfo.some((info) => info.generator_blocked),
      any_generator_implemented: generatorInfo.some((info) => info.generator_implemented),
      pv_template_ids: unique(pvLinks.map((link) => link.template_id)),
      pv_visual_state_ids: visualStateIds,
      pv_projection_allowed: pvLinks.some((link) => link.student_facing_allowed),
      name_alignment: nameAlignment,
      held_reason: operation.held_reason || null,
      evidence_status: operation.evidence_status || null,
      notes: operation.notes || [],
    };
  });
}

function buildFoundationRows(coverageRows, unitsById, generatorBlocks) {
  const byOperation = new Map(coverageRows.map((row) => [row.operation_id, row]));
  return FOUNDATION_REQUIREMENTS.map((requirement) => {
    const row = byOperation.get(requirement.expected_operation_id);
    const unit = unitsById.get(requirement.expected_unit_id);
    let status = 'missing_not_yet_scoped';
    if (row) status = row.coverage_state;
    if (unit && !row) status = 'live_unit_without_operation_report_mapping';
    if (!unit && HELD_OPERATION_IDS.has(requirement.expected_operation_id)) status = 'held_or_duplicate_review';
    return {
      ...requirement,
      status,
      live_unit: Boolean(unit),
      unit_name: unit ? unit.name : null,
      generator_blocked: unit ? generatorBlocks.has(unit.id) : false,
      pv_template_ids: row ? row.pv_template_ids : [],
    };
  });
}

function buildGraphTree(units, operations, pvByUnit, generatorBlocks, generators) {
  const operationsByUnit = linkedOperationsByUnit(operations);
  const graphUnits = units
    .filter((unit) => unit.id && /^A\d+/.test(unit.id) && (unit.aspects || []).includes('grafisch'))
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  const nodeIds = new Set(graphUnits.map((unit) => unit.id));
  const nodes = graphUnits.map((unit) => {
    const pvLinks = pvByUnit.get(unit.id) || [];
    return {
      unit_id: unit.id,
      name: unit.name,
      aspects: unit.aspects || [],
      needs: unit.needs || [],
      linked_operation_ids: operationsByUnit.get(unit.id) || [],
      pv_template_ids: unique(pvLinks.map((link) => link.template_id)),
      generator: unit.generator || null,
      generator_implemented: Boolean(generators[unit.id] || (unit.generator && generators[unit.generator])),
      generator_blocked: generatorBlocks.has(unit.id),
    };
  });
  const edges = graphUnits.flatMap((unit) => (unit.needs || []).map((need) => ({
    from: need,
    to: unit.id,
    dependency_is_graph_node: nodeIds.has(need),
  })));

  return {
    schema_version: 1,
    report_id: 'graph-skill-tree',
    generated_by: 'build-scripts/references/build-representation-operation-coverage.js',
    generated_on: new Date().toISOString(),
    policy: {
      student_facing_use_authorized: false,
      reason: 'RX.5 reports graph-skill structure only. Generator and publication gates still control student-facing use.',
    },
    summary: {
      graph_unit_count: nodes.length,
      graph_units_with_operation_links: nodes.filter((node) => node.linked_operation_ids.length > 0).length,
      graph_units_with_pv_templates: nodes.filter((node) => node.pv_template_ids.length > 0).length,
      graph_units_generator_blocked: nodes.filter((node) => node.generator_blocked).length,
      graph_units_with_generators: nodes.filter((node) => node.generator_implemented).length,
      dependency_edge_count: edges.length,
    },
    nodes,
    edges,
  };
}

function buildGaps(coverageRows, foundationRows, graphTree) {
  const gaps = [];
  for (const row of coverageRows) {
    if (row.coverage_state === 'held_or_duplicate_review') {
      gaps.push({
        gap_id: `held:${row.operation_id}`,
        severity: 'medium',
        category: 'held_or_duplicate_review',
        operation_id: row.operation_id,
        unit_id: row.candidate_unit_id,
        summary: `${row.operation_name} remains held or duplicate-audit scoped.`,
        proof_to_close: 'Later human review moves the operation into a mutation lane or confirms the hold remains correct.',
      });
    }
    if (row.coverage_state === 'candidate_not_live') {
      gaps.push({
        gap_id: `candidate:${row.operation_id}`,
        severity: 'medium',
        category: 'candidate_not_live',
        operation_id: row.operation_id,
        unit_id: row.candidate_unit_id,
        summary: `${row.operation_name} has a candidate unit that is not live.`,
        proof_to_close: 'CLI mutation occurs after a gate, or the candidate is explicitly retired/held.',
      });
    }
    if (row.coverage_state === 'live_unit_live_registry_status_stale') {
      gaps.push({
        gap_id: `registry-status:${row.operation_id}`,
        severity: 'low',
        category: 'registry_status_stale',
        operation_id: row.operation_id,
        unit_id: row.candidate_unit_id,
        summary: `${row.operation_name} now has a live unit but the S7 registry source status is still ${row.source_status}.`,
        proof_to_close: 'A later governed registry refresh updates the provisional operation record status, without machine promotion.',
      });
    }
    if (row.name_alignment === 'live_unit_name_differs_from_operation_label') {
      gaps.push({
        gap_id: `name-alignment:${row.operation_id}`,
        severity: 'low',
        category: 'operation_unit_name_alignment',
        operation_id: row.operation_id,
        unit_id: row.candidate_unit_id,
        summary: `${row.operation_name} differs from the live unit label.`,
        proof_to_close: 'Later operation normalization records the preferred operation label and aliases.',
      });
    }
    if (row.any_generator_blocked) {
      gaps.push({
        gap_id: `generator-block:${row.operation_id}`,
        severity: 'high_for_student_facing_release',
        category: 'generator_blocked_live_unit',
        operation_id: row.operation_id,
        unit_id: row.live_unit_ids.join(','),
        summary: `${row.operation_name} maps to live unit(s) that remain generator-blocked.`,
        proof_to_close: 'RX.6 or equivalent generator/projection validation implements or intentionally disables student-facing nodes.',
      });
    }
    if (
      row.coverage_type === 'calculation_from_representation' &&
      row.live_unit_ids.length > 0 &&
      row.pv_template_ids.length === 0
    ) {
      gaps.push({
        gap_id: `pv-template:${row.operation_id}`,
        severity: 'medium',
        category: 'pv_template_missing',
        operation_id: row.operation_id,
        unit_id: row.live_unit_ids.join(','),
        summary: `${row.operation_name} is representation-composed but has no PV pilot template yet.`,
        proof_to_close: 'PV.3/PV.5 adds or validates a template/visual-state path, or records why no PV template is needed.',
      });
    }
  }

  for (const row of foundationRows) {
    if (!row.live_unit && row.status === 'missing_not_yet_scoped') {
      gaps.push({
        gap_id: `foundation-missing:${row.requirement_id}`,
        severity: 'medium',
        category: 'foundation_requirement_missing',
        operation_id: row.expected_operation_id,
        unit_id: row.expected_unit_id,
        summary: `${row.label} is missing and not scoped by a live unit or held record.`,
        proof_to_close: 'Add to a reviewed candidate queue or record an explicit hold/retire decision.',
      });
    }
  }

  if (graphTree.summary.graph_units_generator_blocked > 0) {
    gaps.push({
      gap_id: 'graph-skill-tree:generator-blocks',
      severity: 'high_for_student_facing_release',
      category: 'graph_skill_tree_generator_blocks',
      operation_id: null,
      unit_id: null,
      summary: `${graphTree.summary.graph_units_generator_blocked} graphical A-domain units are not ready for student-facing skill-tree use.`,
      proof_to_close: 'RX.6 implements generators or records intentional non-interactive status for each graph unit.',
    });
  }

  return {
    schema_version: 1,
    report_id: 'representation-transfer-gaps',
    generated_by: 'build-scripts/references/build-representation-operation-coverage.js',
    generated_on: new Date().toISOString(),
    policy: {
      diagnostic_only: true,
      student_facing_use_authorized: false,
      machine_registry_promotion_authorized: false,
    },
    summary: {
      gap_count: gaps.length,
      by_category: countBy(gaps, 'category'),
      by_severity: countBy(gaps, 'severity'),
    },
    gaps: gaps.sort((a, b) => a.gap_id.localeCompare(b.gap_id)),
  };
}

function markdownTable(headers, rows) {
  const lines = [];
  lines.push(`| ${headers.join(' | ')} |`);
  lines.push(`| ${headers.map(() => '---').join(' | ')} |`);
  for (const row of rows) {
    lines.push(`| ${row.map((cell) => String(cell ?? '').replace(/\n/g, '<br>')).join(' | ')} |`);
  }
  return lines.join('\n');
}

function renderCoverageMarkdown(report) {
  const rows = report.operations.map((row) => [
    row.operation_id,
    row.operation_name,
    row.coverage_state,
    row.coverage_type,
    row.live_unit_ids.join(', '),
    row.any_generator_blocked ? 'yes' : 'no',
    row.pv_template_ids.join(', '),
  ]);
  const foundationRows = report.foundation_coverage.map((row) => [
    row.label,
    row.expected_unit_id,
    row.status,
    row.live_unit ? 'live' : 'not live',
    row.generator_blocked ? 'yes' : 'no',
    row.pv_template_ids.join(', '),
  ]);

  return `# Representation Operation Coverage

Generated by \`build-scripts/references/build-representation-operation-coverage.js\`.

## Summary

- Operation records: ${report.summary.operation_count}
- Live unit mapped: ${report.summary.operation_count_by_coverage_state.live_unit_mapped || 0}
- Live but registry-source status stale: ${report.summary.operation_count_by_coverage_state.live_unit_live_registry_status_stale || 0}
- Held/duplicate review: ${report.summary.operation_count_by_coverage_state.held_or_duplicate_review || 0}
- Generator-blocked live operation rows: ${report.summary.generator_blocked_operation_count}
- PV-linked operation rows: ${report.summary.pv_linked_operation_count}
- Machine registry created: ${report.storage_decision.machine_registry_created}

## Policy

RX.5 is report-only. It does not create \`references/machine/exercise-operations.json\`, \`references/machine/skill-tags.json\`, or any PV machine registry. Operation records remain provisional and student-facing use remains blocked unless later generator/publication gates approve it.

## Graphical Foundation Coverage

${markdownTable(
    ['Requirement', 'Unit', 'Status', 'Live', 'Generator Blocked', 'PV Templates'],
    foundationRows
  )}

## Operation Rows

${markdownTable(
    ['Operation', 'Name', 'Coverage State', 'Coverage Type', 'Live Units', 'Generator Blocked', 'PV Templates'],
    rows
  )}
`;
}

function renderGraphTreeMarkdown(report) {
  const rows = report.nodes.map((node) => [
    node.unit_id,
    node.name,
    node.needs.join(', '),
    node.linked_operation_ids.join(', '),
    node.generator_implemented ? 'yes' : 'no',
    node.generator_blocked ? 'yes' : 'no',
    node.pv_template_ids.join(', '),
  ]);
  const edgeRows = report.edges.map((edge) => [
    edge.from,
    edge.to,
    edge.dependency_is_graph_node ? 'yes' : 'no',
  ]);

  return `# Graph Skill Tree

Generated by \`build-scripts/references/build-representation-operation-coverage.js\`.

## Summary

- Graphical A-domain units: ${report.summary.graph_unit_count}
- Graphical units with operation links: ${report.summary.graph_units_with_operation_links}
- Graphical units with PV templates: ${report.summary.graph_units_with_pv_templates}
- Graphical units generator-blocked: ${report.summary.graph_units_generator_blocked}
- Dependency edges: ${report.summary.dependency_edge_count}

## Nodes

${markdownTable(
    ['Unit', 'Name', 'Needs', 'Operations', 'Generator Implemented', 'Generator Blocked', 'PV Templates'],
    rows
  )}

## Dependency Edges

${markdownTable(['From', 'To', 'From Is Graph Node'], edgeRows)}

## Boundary

This is a reference/reporting graph only. It does not expose units to the student-facing skill tree and does not authorize diagnostics, adaptive routing, mastery, sequencing, AI, or summative use.
`;
}

function renderGapsMarkdown(report) {
  const rows = report.gaps.map((gap) => [
    gap.gap_id,
    gap.severity,
    gap.category,
    gap.operation_id || '',
    gap.unit_id || '',
    gap.summary,
    gap.proof_to_close,
  ]);
  return `# Representation Transfer Gaps

Generated by \`build-scripts/references/build-representation-operation-coverage.js\`.

## Summary

- Gap count: ${report.summary.gap_count}
- Categories: ${Object.entries(report.summary.by_category).map(([key, value]) => `${key}=${value}`).join(', ')}
- Severities: ${Object.entries(report.summary.by_severity).map(([key, value]) => `${key}=${value}`).join(', ')}

## Gaps

${markdownTable(
    ['Gap', 'Severity', 'Category', 'Operation', 'Unit', 'Summary', 'Proof To Close'],
    rows
  )}

## Boundary

Gaps are diagnostic governance records. They are not a mutation queue, not curriculum authority, and not student-facing material.
`;
}

function buildGateArtifacts(coverage, gaps) {
  const packet = {
    schema_version: 1,
    gate_id: RX5_GATE_ID,
    sprint_id: 'RX.5',
    status: 'technical_report_gate',
    generated_on: new Date().toISOString(),
    mutation_authorized: false,
    machine_registry_created: false,
    student_facing_use_authorized: false,
    purpose: 'Validate that RX.5 reports bridge provisional S7/RX operation records, live unit status, generator blocks, and PV links without promoting an operation registry.',
    evidence: {
      coverage_report: OUTPUTS.coverageJson,
      graph_skill_tree: OUTPUTS.graphTreeJson,
      transfer_gaps: OUTPUTS.gapsJson,
    },
    checks: [
      'coverage report distinguishes live, candidate, held, stale, generator-blocked, and PV-linked states',
      'graph skill tree is reference/report-only and preserves publication blocks',
      'transfer gaps include proof-to-close fields',
      'no references/machine operation or skill-tag registry exists',
      'no student-facing use is authorized',
    ],
  };

  const closure = {
    schema_version: 1,
    gate_id: RX5_GATE_ID,
    sprint_id: 'RX.5',
    status: 'pass_with_conditions',
    closed_on: TODAY,
    closure_type: 'technical',
    mutation_authorized: false,
    machine_registry_created: false,
    student_facing_use_authorized: false,
    report_outputs: [
      OUTPUTS.coverageJson,
      OUTPUTS.coverageMd,
      OUTPUTS.graphTreeJson,
      OUTPUTS.graphTreeMd,
      OUTPUTS.gapsJson,
      OUTPUTS.gapsMd,
    ],
    summary: {
      operation_count: coverage.summary.operation_count,
      transfer_gap_count: gaps.summary.gap_count,
      generator_blocked_operation_count: coverage.summary.generator_blocked_operation_count,
      pv_linked_operation_count: coverage.summary.pv_linked_operation_count,
    },
    conditions: [
      'Keep operation records provisional until a later schema, validator, CLI, mutation-log, and human-promotion gate exists.',
      'Do not create references/machine/exercise-operations.json or references/machine/skill-tags.json.',
      'Use the transfer-gap report as diagnostic planning input only, not as an automatic mutation queue.',
      'Keep generator-blocked units non-interactive until RX.6 or a later approved generator/projection sprint.',
      'Do not authorize student diagnostics, adaptive routing, student-facing AI, sequencing, mastery, summative use, or student-facing PV projection.',
    ],
  };

  const packetMd = `# ${RX5_GATE_ID}: Review Packet

Sprint: \`RX.5\`
Status: \`technical_report_gate\`

RX.5 is a report-only bridge between S7 provisional operation records, RX live-unit mutations, and PV pilot links. No machine-registry promotion or student-facing use is authorized.

## Evidence

- Coverage report: \`${OUTPUTS.coverageJson}\`
- Graph skill tree: \`${OUTPUTS.graphTreeJson}\`
- Transfer gaps: \`${OUTPUTS.gapsJson}\`

## Checks

${packet.checks.map((check) => `- ${check}`).join('\n')}

## Stop Conditions

- Do not create \`references/machine/exercise-operations.json\`.
- Do not create \`references/machine/skill-tags.json\`.
- Do not treat gaps as an automatic mutation queue.
- Do not authorize student-facing skill-tree use, PV projection, diagnostics, adaptive routing, AI, sequencing, mastery, or summative use.
`;

  const closureMd = `# ${RX5_GATE_ID}: Technical Closure

Sprint: \`RX.5\`
Status: \`pass_with_conditions\`

RX.5 completed the representation-operation report bridge without machine-registry promotion.

## Outputs

${closure.report_outputs.map((output) => `- \`${output}\``).join('\n')}

## Conditions

${closure.conditions.map((condition) => `- ${condition}`).join('\n')}

## Summary

- Operation records: ${coverage.summary.operation_count}
- Transfer gaps: ${gaps.summary.gap_count}
- Generator-blocked operation rows: ${coverage.summary.generator_blocked_operation_count}
- PV-linked operation rows: ${coverage.summary.pv_linked_operation_count}
`;

  writeJson(OUTPUTS.gatePacketJson, packet);
  writeText(OUTPUTS.gatePacketMd, packetMd);
  writeJson(OUTPUTS.gateClosureJson, closure);
  writeText(OUTPUTS.gateClosureMd, closureMd);

  return { packet, closure };
}

function assertNoMachineRegistryCreated() {
  const forbidden = [
    'references/machine/exercise-operations.json',
    'references/machine/skill-tags.json',
    'references/machine/representation-operations.json',
    'references/machine/procedure-templates.json',
    'references/machine/visual-states.json',
  ];
  const existing = forbidden.filter((relPath) => fs.existsSync(repoPath(relPath)));
  if (existing.length > 0) {
    throw new Error(`Forbidden machine registry exists: ${existing.join(', ')}`);
  }
}

function main() {
  assertNoMachineRegistryCreated();

  const registry = readJson(INPUTS.skillOperationRegistry);
  const rx1Inventory = readJson(INPUTS.rx1Inventory);
  const units = readJson(INPUTS.units);
  const templates = readJson(INPUTS.pvTemplates);
  const visualStates = readJson(INPUTS.pvVisualStates);
  const links = readJson(INPUTS.pvLinks);
  const generators = loadGenerators();
  const generatorBlocks = collectGeneratorBlocks();
  const unitsById = new Map(units.map((unit) => [unit.id, unit]));
  const pvIndexes = buildPvIndexes(templates, visualStates, links);

  const operations = buildCoverageRows(registry, unitsById, pvIndexes.byUnit, generatorBlocks, generators);
  const foundation = buildFoundationRows(operations, unitsById, generatorBlocks);
  const graphTree = buildGraphTree(units, operations, pvIndexes.byUnit, generatorBlocks, generators);
  const gaps = buildGaps(operations, foundation, graphTree);

  const coverage = {
    schema_version: 1,
    report_id: 'representation-operation-coverage',
    sprint_id: 'RX.5',
    generated_by: 'build-scripts/references/build-representation-operation-coverage.js',
    generated_on: new Date().toISOString(),
    storage_decision: {
      source_registry: INPUTS.skillOperationRegistry,
      machine_registry_created: false,
      operation_governance_status: 'provisional_report_only',
      reason: 'RX.5 reports current coverage but does not promote operations to references/machine/.',
    },
    source_files: Object.values(INPUTS),
    policy: {
      diagnostic_only: true,
      student_facing_use_authorized: false,
      bulk_backfill_authorized: false,
      machine_registry_promotion_authorized: false,
      pv_projection_authorized: false,
    },
    rx1_inventory_summary: rx1Inventory.summary,
    summary: {
      operation_count: operations.length,
      operation_count_by_coverage_state: countBy(operations, 'coverage_state'),
      operation_count_by_coverage_type: countBy(operations, 'coverage_type'),
      generator_blocked_operation_count: operations.filter((row) => row.any_generator_blocked).length,
      pv_linked_operation_count: operations.filter((row) => row.pv_template_ids.length > 0).length,
      foundation_requirement_count: foundation.length,
      foundation_live_count: foundation.filter((row) => row.live_unit).length,
      foundation_held_count: foundation.filter((row) => /held/.test(row.status)).length,
      graph_skill_tree_node_count: graphTree.summary.graph_unit_count,
      transfer_gap_count: gaps.summary.gap_count,
    },
    foundation_coverage: foundation,
    operations,
  };

  writeJson(OUTPUTS.coverageJson, coverage);
  writeText(OUTPUTS.coverageMd, renderCoverageMarkdown(coverage));
  writeText(OUTPUTS.coverageMdMirror, renderCoverageMarkdown(coverage));
  writeJson(OUTPUTS.graphTreeJson, graphTree);
  writeText(OUTPUTS.graphTreeMd, renderGraphTreeMarkdown(graphTree));
  writeText(OUTPUTS.graphTreeMdMirror, renderGraphTreeMarkdown(graphTree));
  writeJson(OUTPUTS.gapsJson, gaps);
  writeText(OUTPUTS.gapsMd, renderGapsMarkdown(gaps));
  writeText(OUTPUTS.gapsMdMirror, renderGapsMarkdown(gaps));
  buildGateArtifacts(coverage, gaps);

  console.log(`wrote ${OUTPUTS.coverageJson}`);
  console.log(`wrote ${OUTPUTS.graphTreeJson}`);
  console.log(`wrote ${OUTPUTS.gapsJson}`);
  console.log(`wrote ${OUTPUTS.gateClosureJson}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  buildCoverageRows,
  buildFoundationRows,
  buildGraphTree,
  buildGaps,
};
