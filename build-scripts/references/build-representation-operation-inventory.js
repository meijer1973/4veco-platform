#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - RX.1 is non-mutating. Keep mutation_authorized false and never write to
 *   references/machine/, references/external/, or lesson targets.
 * - Candidate unit IDs are placeholders only. Re-check live A-domain IDs before
 *   any later RX.2+ unit-add sprint.
 * - Add candidate records only with target-exercise evidence, exam-question
 *   evidence, or an explicit didactic-prior rationale.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const INVENTORY_PATH = 'references/data/sprints/RX.1-representation-operation-inventory.json';
const COVERAGE_JSON_PATH = 'reports/json/representation-operation-inventory.json';
const COVERAGE_MD_PATH = 'reports/markdown/representation-operation-inventory.md';
const GATE_DIR = 'reports/review-gates/GATE-RX1-representation-unit-scope';
const DUPLICATE_JSON_PATH = `${GATE_DIR}/duplicate-overlap-report.json`;
const DUPLICATE_MD_PATH = `${GATE_DIR}/duplicate-overlap-report.md`;
const MUTATION_QUEUE_JSON_PATH = `${GATE_DIR}/proposed-mutation-queue.json`;
const MUTATION_QUEUE_MD_PATH = `${GATE_DIR}/proposed-mutation-queue.md`;
const REVIEW_PACKET_JSON_PATH = `${GATE_DIR}/review-packet.json`;
const REVIEW_PACKET_MD_PATH = `${GATE_DIR}/review-packet.md`;

const TARGETS_PATH = 'references/authored/course-target-exercises.json';
const EXAMS_PATH = 'references/external/exam-questions.json';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const OWNED_GRAPH_PATH = 'references/data/owned-content-graph.json';
const GRAPH_PLAN_PATH = 'references/data/exercises/graph-spec-representation-plan.json';
const CP3_CLOSURE_PATH = 'reports/review-gates/GATE-CP3-schema-extension-dry-run/gate-closure.json';

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
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

function examSourceId({ exam, opgave_num, question_num }) {
  return `external_exam_question:${exam}:opgave-${opgave_num}:question-${question_num}`;
}

function targetRef(id, role, note) {
  return {
    source_type: 'target_exercise',
    path: TARGETS_PATH,
    entity_id: `target_exercise:${id}`,
    role,
    note,
  };
}

function examRef(exam, opgave_num, question_num, role, note) {
  return {
    source_type: 'exam_question',
    path: EXAMS_PATH,
    entity_id: examSourceId({ exam, opgave_num, question_num }),
    role,
    note,
  };
}

function didacticRef(note) {
  return {
    source_type: 'didactic_prior_rationale',
    path: 'references/authored/didactiek-principes.md',
    entity_id: 'didactic_prior:representation-transfer',
    role: 'didactic-prior',
    note,
  };
}

const CANDIDATES = [
  {
    operation_id: 'REP_TABLE_VALUE_SELECTION',
    group: 'representation_reading_foundation',
    name: 'Tabelwaarden selecteren voor berekening',
    base_operation: 'source_value_selection',
    representation: 'table',
    economic_context: 'general_calculation',
    source_values_task: 'select_row_column_old_new_values',
    composition_pattern: 'read_values_before_calculation',
    classification: 'needs_new_representation_reading_unit',
    candidate_unit_id: 'A61',
    candidate_unit_name: 'Tabelwaarden selecteren voor berekening',
    needs: [],
    aspects: ['rekenen', 'verbaal'],
    evidence_refs: [
      targetRef('1.1.3', 'target-exercise table values', 'Target exercise asks students to read an ice-cream price/quantity table and interpret a percentage claim.'),
      targetRef('1.3.2', 'target-exercise table values', 'Cost-structure target requires selecting TK, TVK, TCK, GTK, GVK, and GCK values from source data.'),
    ],
    risk: 'low',
    pitfall: 'Student chooses the visible number but not the relevant row, column, base value, or comparison value.',
  },
  {
    operation_id: 'REP_BAR_CHART_VALUE_READING',
    group: 'representation_reading_foundation',
    name: 'Waarden aflezen uit staafdiagram',
    base_operation: 'source_value_reading',
    representation: 'bar_chart',
    economic_context: 'general_source_use',
    source_values_task: 'read_bar_heights',
    composition_pattern: 'read_values_before_calculation',
    classification: 'needs_new_representation_reading_unit',
    candidate_unit_id: 'A62',
    candidate_unit_name: 'Waarden aflezen uit staafdiagram',
    needs: [],
    aspects: ['grafisch'],
    evidence_refs: [
      didacticRef('Bar-chart value reading is a common representation-transfer task that cannot be assumed from table reading; no source mutation is proposed in RX.1.'),
    ],
    risk: 'medium',
    pitfall: 'Student compares bar height visually without checking scale or category labels.',
  },
  {
    operation_id: 'REP_LINE_GRAPH_VALUE_READING',
    group: 'representation_reading_foundation',
    name: 'Waarden aflezen uit lijngrafiek',
    base_operation: 'source_value_reading',
    representation: 'line_chart',
    economic_context: 'time_series',
    source_values_task: 'read_points_periods',
    composition_pattern: 'read_values_before_calculation',
    classification: 'needs_new_representation_reading_unit',
    candidate_unit_id: 'A63',
    candidate_unit_name: 'Waarden aflezen uit lijngrafiek',
    needs: [],
    aspects: ['grafisch'],
    evidence_refs: [
      targetRef('4.4.1', 'owned target exercise with CPI over time', 'Inflation/CPI target exercise requires comparing values across years and avoiding index-point traps.'),
      didacticRef('Line graphs introduce period/point selection and interpolation errors distinct from table reading.'),
    ],
    risk: 'medium',
    pitfall: 'Student reads the wrong year or treats a period change as a point value.',
  },
  {
    operation_id: 'REP_PIE_SHARE_READING',
    group: 'representation_reading_foundation',
    name: 'Aandelen aflezen uit cirkeldiagram',
    base_operation: 'share_reading',
    representation: 'pie_chart',
    economic_context: 'source_shares',
    source_values_task: 'read_share_percentages',
    composition_pattern: 'read_share_before_calculation',
    classification: 'needs_new_representation_reading_unit',
    candidate_unit_id: 'A64',
    candidate_unit_name: 'Aandelen aflezen uit cirkeldiagram',
    needs: [],
    aspects: ['grafisch', 'rekenen'],
    evidence_refs: [
      didacticRef('Pie charts encode shares, not raw absolute quantities; this is a representation distinction worth reviewing before mutation.'),
    ],
    risk: 'medium',
    pitfall: 'Student treats a share from a pie chart as an absolute number.',
  },
  {
    operation_id: 'REP_SHARE_TOTAL_ABSOLUTE_QUANTITY',
    group: 'representation_reading_foundation',
    name: 'Absolute hoeveelheid berekenen uit aandeel en totaal',
    base_operation: 'percentage_share_application',
    representation: 'pie_chart_plus_total',
    economic_context: 'source_shares',
    source_values_task: 'combine_share_and_total',
    composition_pattern: 'read_share_then_calculate_absolute_value',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A65',
    candidate_unit_name: 'Absolute hoeveelheid berekenen uit aandeel en totaal',
    needs: ['A64', 'A04'],
    aspects: ['grafisch', 'rekenen'],
    evidence_refs: [
      examRef('ha-1022-a-23-1-o', 1, 2, 'exam calculation using source values', 'Question asks to show more than 40% from bron 1; source values are not extracted yet, so this remains a reviewed candidate pattern.'),
      didacticRef('Share x total is a separate composed operation from reading the share alone.'),
    ],
    risk: 'medium',
    pitfall: 'Student multiplies by the wrong total or forgets to convert percentage to decimal/share form.',
  },
  {
    operation_id: 'REP_BASE_COMPARISON_VALUE_IDENTIFICATION',
    group: 'representation_reading_foundation',
    name: 'Basiswaarde en vergelijkingswaarde in bron bepalen',
    base_operation: 'base_value_selection',
    representation: 'source_text_or_table',
    economic_context: 'percentage_change',
    source_values_task: 'identify_old_new_base_comparison',
    composition_pattern: 'select_base_before_percentage_change',
    classification: 'needs_new_representation_reading_unit',
    candidate_unit_id: 'A66',
    candidate_unit_name: 'Basiswaarde en vergelijkingswaarde in bron bepalen',
    needs: ['A61'],
    aspects: ['rekenen', 'verbaal'],
    evidence_refs: [
      targetRef('1.1.2', 'percentage-change target exercise', 'Percentage and index exercise includes old/new values and index-point confusion.'),
      targetRef('1.1.3', 'table claim evaluation', 'Target asks which table interval could produce a 50% drop.'),
    ],
    risk: 'low',
    pitfall: 'Student uses the new value as denominator or reverses old and new values.',
  },
  {
    operation_id: 'REP_PCT_CHANGE_TABLE',
    group: 'percentage_change_from_representations',
    name: 'Procentuele verandering berekenen vanuit tabel',
    base_operation: 'percentage_change',
    representation: 'table',
    economic_context: 'general_price_quantity',
    source_values_task: 'select_table_values',
    composition_pattern: 'read_values_then_calculate',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A67',
    candidate_unit_name: 'Procentuele verandering berekenen vanuit tabel',
    needs: ['A38', 'A61', 'A66'],
    aspects: ['rekenen', 'verbaal'],
    evidence_refs: [
      targetRef('1.1.3', 'table percentage claim', 'Target asks students to inspect table values and evaluate a 50% sales drop claim.'),
      targetRef('4.4.3', 'real/nominal table application', 'Integration target uses mixed source material and table-based real/nominal calculations.'),
    ],
    risk: 'low',
    pitfall: 'Student correctly computes percentage change but selects the wrong pair of table values.',
  },
  {
    operation_id: 'REP_PCT_CHANGE_BAR_CHART',
    group: 'percentage_change_from_representations',
    name: 'Procentuele verandering berekenen vanuit staafdiagram',
    base_operation: 'percentage_change',
    representation: 'bar_chart',
    economic_context: 'source_chart',
    source_values_task: 'read_bar_values',
    composition_pattern: 'read_values_then_calculate',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A68',
    candidate_unit_name: 'Procentuele verandering berekenen vanuit staafdiagram',
    needs: ['A38', 'A62', 'A66'],
    aspects: ['grafisch', 'rekenen'],
    evidence_refs: [
      didacticRef('Representation transfer from base percentage-change formula to bar charts should be reviewed before mutation; no syllabus-only basis is used.'),
    ],
    risk: 'medium',
    pitfall: 'Student estimates bar heights without reading the axis scale.',
  },
  {
    operation_id: 'REP_PCT_CHANGE_LINE_GRAPH',
    group: 'percentage_change_from_representations',
    name: 'Procentuele verandering berekenen vanuit lijngrafiek',
    base_operation: 'percentage_change',
    representation: 'line_chart',
    economic_context: 'macro_time_series',
    source_values_task: 'read_two_time_points',
    composition_pattern: 'read_values_then_calculate',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A69',
    candidate_unit_name: 'Procentuele verandering berekenen vanuit lijngrafiek',
    needs: ['A38', 'A63', 'A66'],
    aspects: ['grafisch', 'rekenen'],
    evidence_refs: [
      targetRef('4.4.1', 'inflation and index over time', 'Book 4 returns to percentage/index interpretation across years.'),
      didacticRef('Time-series values create old/new selection errors distinct from base percentage calculation.'),
    ],
    risk: 'medium',
    pitfall: 'Student subtracts visually or uses index-point change as percentage change.',
  },
  {
    operation_id: 'REP_PERCENTAGE_POINT_CHANGE',
    group: 'percentage_change_from_representations',
    name: 'Percentagepuntverandering in aandeel herkennen',
    base_operation: 'percentage_point_difference',
    representation: 'share_or_index_source',
    economic_context: 'shares_inflation',
    source_values_task: 'compare_percent_values',
    composition_pattern: 'distinguish_percentage_points_from_percent_change',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A70',
    candidate_unit_name: 'Percentagepuntverandering in aandeel herkennen',
    needs: ['A64'],
    aspects: ['grafisch', 'rekenen', 'verbaal'],
    evidence_refs: [
      targetRef('1.1.2', 'index-point trap', 'Target explicitly asks why index from 108 to 112 is not automatically 4% inflation.'),
      targetRef('4.4.1', 'critical exam skill', 'Blueprint repeats the index-point versus percentage distinction in Book 4.'),
    ],
    risk: 'low',
    pitfall: 'Student says a rise from 20% to 25% is 5% instead of 5 percentage points.',
  },
  {
    operation_id: 'REP_PCT_CHANGE_PIE_CHART',
    group: 'percentage_change_from_representations',
    name: 'Procentuele verandering berekenen vanuit cirkeldiagram',
    base_operation: 'percentage_change',
    representation: 'pie_chart_plus_total',
    economic_context: 'source_shares',
    source_values_task: 'convert_shares_to_values',
    composition_pattern: 'read_share_calculate_absolute_then_percentage_change',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A71',
    candidate_unit_name: 'Procentuele verandering berekenen vanuit cirkeldiagram',
    needs: ['A38', 'A64', 'A65', 'A70'],
    aspects: ['grafisch', 'rekenen', 'verbaal'],
    evidence_refs: [
      didacticRef('Pie-chart percentage change requires reconstructing absolute values before applying percentage-change logic; hold for human review if evidence remains thin.'),
    ],
    risk: 'high',
    pitfall: 'Student compares shares directly even when totals differ across periods.',
  },
  {
    operation_id: 'REP_INDEX_FROM_TABLE',
    group: 'index_and_growth_from_representations',
    name: 'Indexcijfer berekenen vanuit tabel',
    base_operation: 'index_number',
    representation: 'table',
    economic_context: 'price_index',
    source_values_task: 'select_base_year_and_current_year',
    composition_pattern: 'select_values_then_index',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A72',
    candidate_unit_name: 'Indexcijfer berekenen vanuit tabel',
    needs: ['A39', 'A61'],
    aspects: ['rekenen', 'verbaal'],
    evidence_refs: [
      targetRef('1.1.2', 'price index target', 'Target asks students to calculate price index from 2023 and 2025 basket values.'),
      targetRef('4.4.1', 'CPI target', 'Book 4 target uses CPI/index values to calculate real values.'),
    ],
    risk: 'low',
    pitfall: 'Student uses the current year instead of base year as 100.',
  },
  {
    operation_id: 'REP_INDEX_CHANGE_LINE_GRAPH',
    group: 'index_and_growth_from_representations',
    name: 'Indexverandering aflezen uit lijngrafiek',
    base_operation: 'index_number_interpretation',
    representation: 'line_chart',
    economic_context: 'index_series',
    source_values_task: 'read_index_series_points',
    composition_pattern: 'read_index_points_then_interpret',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A73',
    candidate_unit_name: 'Indexverandering aflezen uit lijngrafiek',
    needs: ['A39', 'A63'],
    aspects: ['grafisch', 'rekenen'],
    evidence_refs: [
      didacticRef('Index series reading is distinct from raw-value line-graph reading because students confuse index-point and percentage changes.'),
      targetRef('4.4.1', 'CPI/index integration', 'Book 4 repeats the index-point distinction as a critical exam skill.'),
    ],
    risk: 'medium',
    pitfall: 'Student treats an index-point change as a percentage change.',
  },
  {
    operation_id: 'REP_PCT_CHANGE_FROM_INDEX',
    group: 'index_and_growth_from_representations',
    name: 'Procentuele verandering berekenen vanuit indexcijfers',
    base_operation: 'percentage_change',
    representation: 'index_values',
    economic_context: 'inflation_real_nominal',
    source_values_task: 'select_two_index_values',
    composition_pattern: 'read_index_values_then_percentage_change',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A74',
    candidate_unit_name: 'Procentuele verandering berekenen vanuit indexcijfers',
    needs: ['A38', 'A39', 'A66'],
    aspects: ['rekenen', 'verbaal'],
    evidence_refs: [
      targetRef('1.1.2', 'index to percentage change', 'Target asks for price increase from an index rising to 112 and corrects the 108-to-112 misconception.'),
      targetRef('4.4.1', 'inflation and real wage', 'Book 4 target applies CPI/index interpretation to real wage and inflation.'),
    ],
    risk: 'low',
    pitfall: 'Student subtracts index values instead of applying percentage change from the old index.',
  },
  {
    operation_id: 'REP_PROFIT_FROM_REVENUE_COST_TABLE',
    group: 'profit_and_producer_representations',
    name: 'Totale winst berekenen uit opbrengsten- en kostentabel',
    base_operation: 'profit',
    representation: 'table',
    economic_context: 'producer',
    source_values_task: 'select_to_tk_values',
    composition_pattern: 'read_values_then_calculate_profit',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A75',
    candidate_unit_name: 'Totale winst berekenen uit opbrengsten- en kostentabel',
    needs: ['A04', 'A61'],
    aspects: ['rekenen', 'verbaal'],
    evidence_refs: [
      targetRef('1.3.3', 'profit from TO and TK', 'Target asks students to calculate TO and winst from bakery data.'),
      targetRef('1.4.3', 'table with TK TO Winst MK MO', 'Target explicitly builds a Q/TK/TO/Winst table.'),
    ],
    risk: 'low',
    pitfall: 'Student reads the wrong row or mixes total and average values.',
  },
  {
    operation_id: 'REP_PROFIT_FROM_P_GTK_Q',
    group: 'profit_and_producer_representations',
    name: 'Totale winst berekenen uit P, GTK en Q',
    base_operation: 'profit',
    representation: 'producer_data',
    economic_context: 'producer',
    source_values_task: 'select_p_gtk_q_values',
    composition_pattern: 'read_values_then_apply_profit_rectangle_formula',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A76',
    candidate_unit_name: 'Totale winst berekenen uit P, GTK en Q',
    needs: ['A14', 'A04'],
    aspects: ['rekenen'],
    evidence_refs: [
      examRef('ha-1022-a-24-1-o', 2, 9, 'exam producer graph/profit area', 'Question asks which area gives total profit for Sprinter.'),
      targetRef('3.1.2', 'profit at optimal Q', 'Producer target requires calculating winst after finding optimal output.'),
    ],
    risk: 'medium',
    pitfall: 'Student uses TK instead of GTK or forgets to multiply the margin by Q.',
  },
  {
    operation_id: 'REP_BREAK_EVEN_TO_TK_GRAPH',
    group: 'profit_and_producer_representations',
    name: 'Break-even aflezen uit TO-TK-grafiek',
    base_operation: 'break_even',
    representation: 'to_tk_graph',
    economic_context: 'producer',
    source_values_task: 'read_intersection',
    composition_pattern: 'read_graph_intersection_then_interpret',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A77',
    candidate_unit_name: 'Break-even aflezen uit TO-TK-grafiek',
    needs: ['A63', 'A29'],
    aspects: ['grafisch', 'rekenen'],
    evidence_refs: [
      targetRef('1.3.3', 'TO/TK graph and break-even', 'Target asks students to draw TK and TO, mark break-even, and shade profit.'),
    ],
    risk: 'medium',
    pitfall: 'Student marks the wrong crossing or treats a profit area as the break-even point.',
  },
  {
    operation_id: 'REP_PROFIT_LOSS_TO_TK_GRAPH',
    group: 'profit_and_producer_representations',
    name: 'Winst of verlies aflezen uit TO-TK-grafiek',
    base_operation: 'profit',
    representation: 'to_tk_graph',
    economic_context: 'producer',
    source_values_task: 'read_vertical_distance',
    composition_pattern: 'read_graph_distance_then_interpret_profit_loss',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A78',
    candidate_unit_name: 'Winst of verlies aflezen uit TO-TK-grafiek',
    needs: ['A63', 'A75'],
    aspects: ['grafisch', 'rekenen'],
    evidence_refs: [
      targetRef('1.3.3', 'profit/loss zones in graph', 'Target asks students to show TK and TO in a graph and identify winst/verlies zones.'),
    ],
    risk: 'medium',
    pitfall: 'Student reads horizontal distance instead of vertical distance between TO and TK.',
  },
  {
    operation_id: 'REP_MAX_PROFIT_TO_TK_TABLE',
    group: 'profit_and_producer_representations',
    name: 'Maximale winst bepalen uit TO-TK-tabel',
    base_operation: 'profit_maximization_by_comparison',
    representation: 'table',
    economic_context: 'producer',
    source_values_task: 'compare_profit_by_quantity',
    composition_pattern: 'read_rows_then_choose_maximum',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A79',
    candidate_unit_name: 'Maximale winst bepalen uit TO-TK-tabel',
    needs: ['A75', 'A61'],
    aspects: ['rekenen', 'verbaal'],
    evidence_refs: [
      targetRef('1.4.4', 'profit optimum from table', 'Target asks students to extend a table and find which Q has highest winst.'),
      examRef('ha-1022-a-23-2-o', 4, 18, 'exam maximum total profit', 'Question asks to calculate maximum total profit for Fluid.'),
    ],
    risk: 'low',
    pitfall: 'Student selects highest revenue rather than highest profit.',
  },
  {
    operation_id: 'REP_PROFIT_RECTANGLE_PRODUCER_GRAPH',
    group: 'profit_and_producer_representations',
    name: 'Winstrechthoek tekenen in producentengrafiek',
    base_operation: 'profit_rectangle',
    representation: 'producer_graph',
    economic_context: 'producer',
    source_values_task: 'read_p_gtk_q_from_graph',
    composition_pattern: 'read_values_then_draw_area',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A80',
    candidate_unit_name: 'Winstrechthoek tekenen in producentengrafiek',
    needs: ['A76', 'A45'],
    aspects: ['grafisch', 'rekenen'],
    evidence_refs: [
      examRef('ha-1022-a-24-1-o', 2, 9, 'exam producer graph area', 'Question asks which area gives total profit.'),
      targetRef('3.1.2', 'producer profit calculation', 'Profit maximization target culminates in calculating winst at optimal Q.'),
    ],
    risk: 'medium',
    pitfall: 'Student draws rectangle to the wrong average-cost line or quantity.',
  },
  {
    operation_id: 'REP_PROFIT_LOSS_BREAK_EVEN_PRODUCER_GRAPH',
    group: 'profit_and_producer_representations',
    name: 'Winst, verlies en break-even herkennen in producentengrafiek',
    base_operation: 'profit_loss_break_even_recognition',
    representation: 'producer_graph',
    economic_context: 'producer',
    source_values_task: 'compare_p_and_gtk',
    composition_pattern: 'read_graph_condition_then_classify',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A81',
    candidate_unit_name: 'Winst, verlies en break-even herkennen in producentengrafiek',
    needs: ['A76', 'A80'],
    aspects: ['grafisch', 'verbaal'],
    evidence_refs: [
      targetRef('3.1.3', 'zero-profit equilibrium graph', 'Target asks students to draw long-run equilibrium and show P = minimum GTK = MK.'),
      examRef('ha-1022-a-24-1-o', 2, 9, 'exam producer graph area', 'Producer graph question requires identifying the relevant profit area.'),
    ],
    risk: 'medium',
    pitfall: 'Student recognises output but not whether P is above, equal to, or below GTK.',
  },
  {
    operation_id: 'REP_ELASTICITY_FROM_TABLE',
    group: 'elasticity_from_representations',
    name: 'Elasticiteit berekenen uit tabelwaarden',
    base_operation: 'elasticity',
    representation: 'table',
    economic_context: 'market',
    source_values_task: 'select_two_variable_changes',
    composition_pattern: 'read_values_then_calculate_elasticity',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A82',
    candidate_unit_name: 'Elasticiteit berekenen uit tabelwaarden',
    needs: ['A15', 'A61', 'A66'],
    aspects: ['rekenen', 'verbaal'],
    evidence_refs: [
      examRef('ha-1022-a-23-1-o', 5, 23, 'exam elasticity table', 'Question asks to explain a table cell using price elasticity.'),
      targetRef('2.1.1', 'price elasticity calculation', 'Elasticity paragraph requires concept and calculation.'),
    ],
    risk: 'medium',
    pitfall: 'Student computes one percentage change correctly but pairs it with the wrong driver variable.',
  },
  {
    operation_id: 'REP_ELASTICITY_FROM_DEMAND_GRAPH',
    group: 'elasticity_from_representations',
    name: 'Elasticiteit berekenen uit vraaggrafiek',
    base_operation: 'elasticity',
    representation: 'p_q_graph',
    economic_context: 'market_demand',
    source_values_task: 'read_two_price_quantity_pairs',
    composition_pattern: 'read_graph_pairs_then_calculate_elasticity',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A83',
    candidate_unit_name: 'Elasticiteit berekenen uit vraaggrafiek',
    needs: ['A15', 'A46', 'A66'],
    aspects: ['grafisch', 'rekenen'],
    evidence_refs: [
      examRef('ha-1022-a-24-2-o', 1, 2, 'exam elasticity from supply curve', 'Question asks to derive elasticity from a curve; graph extraction is the bottleneck, even though this case is supply-side.'),
      targetRef('2.1.1', 'elasticity calculation', 'Price elasticity target requires calculation and interpretation.'),
    ],
    risk: 'medium',
    pitfall: 'Student reads only one point or swaps P and Q changes.',
  },
  {
    operation_id: 'REP_REVENUE_CHANGE_WITH_ELASTICITY_SOURCE',
    group: 'elasticity_from_representations',
    name: 'Omzetverandering beoordelen met elasticiteit uit bron',
    base_operation: 'elasticity_revenue_interpretation',
    representation: 'source_text_or_table',
    economic_context: 'market_revenue',
    source_values_task: 'read_elasticity_or_change_from_source',
    composition_pattern: 'read_source_change_then_interpret_revenue_effect',
    classification: 'needs_new_composed_calculation_unit',
    candidate_unit_id: 'A84',
    candidate_unit_name: 'Omzetverandering beoordelen met elasticiteit uit bron',
    needs: ['A15', 'A67'],
    aspects: ['rekenen', 'verbaal'],
    evidence_refs: [
      examRef('ha-1022-a-24-1-o', 1, 5, 'exam revenue and price-inelastic demand', 'Question asks to explain how supermarket price rise leads to revenue increase.'),
      targetRef('2.1.2', 'elasticity and omzet', 'Target explicitly connects elastic/inelastic demand to revenue direction.'),
    ],
    risk: 'medium',
    pitfall: 'Student applies the elasticity sign mechanically without linking it to total revenue direction.',
  },
];

const HOLD_RECORDS = [
  {
    operation_id: 'HOLD_WELFARE_AREAS_PQ_DIAGRAM',
    group: 'duplicate_or_hold',
    name: 'Welvaartsgebieden herkennen in P-Q diagram',
    base_operation: 'welfare_area_recognition',
    representation: 'market_surplus_diagram',
    economic_context: 'market_welfare',
    source_values_task: 'identify_regions',
    composition_pattern: 'read_area_then_interpret',
    classification: 'hold_duplicate_audit',
    candidate_unit_id: null,
    candidate_unit_name: null,
    needs: [],
    aspects: ['grafisch', 'rekenen'],
    evidence_refs: [
      targetRef('2.2.1', 'consumer surplus graph', 'Consumer surplus and welfare graph work is already present in existing A-units.'),
    ],
    overlap_ids: ['A19', 'A32', 'A40'],
    hold_reason: 'Existing A19/A32/A40 already cover core surplus and welfare-area operations; do not mint before detailed overlap review.',
    risk: 'high',
    pitfall: 'New unit could duplicate existing welfare diagram operations.',
  },
  {
    operation_id: 'HOLD_SHIFT_VS_MOVEMENT',
    group: 'duplicate_or_hold',
    name: 'Beweging langs curve versus verschuiving',
    base_operation: 'graph_interpretation',
    representation: 'p_q_graph',
    economic_context: 'demand_supply',
    source_values_task: 'classify_movement_or_shift',
    composition_pattern: 'read_scenario_then_classify_graph_change',
    classification: 'hold_duplicate_audit',
    candidate_unit_id: null,
    candidate_unit_name: null,
    needs: [],
    aspects: ['grafisch', 'verbaal'],
    evidence_refs: [
      targetRef('1.2.2', 'movement vs shift target', 'Target already requires movement vs shift classification.'),
    ],
    overlap_ids: ['D32', 'A42'],
    hold_reason: 'D32 and A42 already touch this; design review needed before adding another graph-change unit.',
    risk: 'high',
    pitfall: 'Could fragment an existing conceptual distinction into a redundant A-domain unit.',
  },
  {
    operation_id: 'HOLD_SHORT_SIDE_INTERVENTION_QUANTITY',
    group: 'duplicate_or_hold',
    name: 'Korte zijde en interventiehoeveelheid',
    base_operation: 'short_side_rule',
    representation: 'p_q_graph',
    economic_context: 'price_controls',
    source_values_task: 'read_qd_qs_at_forced_price',
    composition_pattern: 'read_values_then_apply_min_rule',
    classification: 'already_covered_hold',
    candidate_unit_id: null,
    candidate_unit_name: null,
    needs: [],
    aspects: ['grafisch', 'rekenen'],
    evidence_refs: [
      targetRef('2.2.3', 'short-side missing flag', 'Earlier target flag led to A56 in R4.5; do not re-mint.'),
    ],
    overlap_ids: ['A51', 'A56', 'A59'],
    hold_reason: 'A51/A56/A59 now cover surplus/shortage and short-side/intervention quantity logic.',
    risk: 'low',
    pitfall: 'Would duplicate recently minted R4.5 units.',
  },
  {
    operation_id: 'HOLD_MARGINAL_VALUES_FROM_TABLE',
    group: 'duplicate_or_hold',
    name: 'Marginale waarden uit tabel',
    base_operation: 'table_difference',
    representation: 'table',
    economic_context: 'producer',
    source_values_task: 'take_differences',
    composition_pattern: 'read_adjacent_rows_then_calculate_delta',
    classification: 'already_covered_hold',
    candidate_unit_id: null,
    candidate_unit_name: null,
    needs: [],
    aspects: ['rekenen'],
    evidence_refs: [
      targetRef('1.4.3', 'MK/MO table method', 'Target led to A52 in R4.5.'),
    ],
    overlap_ids: ['A52'],
    hold_reason: 'A52 already covers MK and MO from table differences.',
    risk: 'low',
    pitfall: 'Would duplicate A52.',
  },
  {
    operation_id: 'HOLD_GRAPHICAL_MO_MK_OPTIMUM',
    group: 'duplicate_or_hold',
    name: 'Grafische MO=MK optimum bepalen',
    base_operation: 'profit_maximization',
    representation: 'producer_graph',
    economic_context: 'producer',
    source_values_task: 'read_mo_mk_intersection',
    composition_pattern: 'read_graph_intersection_then_solve_output',
    classification: 'hold_duplicate_audit',
    candidate_unit_id: null,
    candidate_unit_name: null,
    needs: [],
    aspects: ['grafisch', 'rekenen'],
    evidence_refs: [
      targetRef('3.1.2', 'MO=MK graph/calculation', 'Target uses MO=MK and producer graph reasoning.'),
      targetRef('3.2.3', 'monopoly full calculation', 'Monopoly procedure may already encode the operation.'),
    ],
    overlap_ids: ['A20', 'A28', 'A33', 'A54'],
    hold_reason: 'May overlap existing profit optimization and verification units; needs human review before minting.',
    risk: 'high',
    pitfall: 'Could conflate graphical optimum reading with algebraic MO=MK solving.',
  },
];

function checkEvidenceRefs(records, targets, exams) {
  const targetIds = new Set(targets.map((target) => `target_exercise:${target.id}`));
  const examIds = new Set(exams.map((exam) => examSourceId(exam)));
  for (const record of records) {
    for (const ref of record.evidence_refs) {
      if (ref.source_type === 'target_exercise' && !targetIds.has(ref.entity_id)) {
        throw new Error(`${record.operation_id} references unknown target ${ref.entity_id}`);
      }
      if (ref.source_type === 'exam_question' && !examIds.has(ref.entity_id)) {
        throw new Error(`${record.operation_id} references unknown exam question ${ref.entity_id}`);
      }
    }
  }
}

function currentMaxAId(units) {
  const nums = units
    .filter((unit) => /^A\d{2}$/.test(unit.id))
    .map((unit) => Number(unit.id.slice(1)));
  return Math.max(...nums);
}

function enrichRecords(records, units) {
  const unitIds = new Set(units.map((unit) => unit.id));
  return records.map((record) => {
    const overlaps = record.overlap_ids || [];
    const candidateLive = record.candidate_unit_id ? unitIds.has(record.candidate_unit_id) : false;
    return {
      ...record,
      candidate_id_status: record.candidate_unit_id
        ? (candidateLive ? 'conflicts_with_live_registry' : 'provisional_available_at_generation')
        : 'not_applicable_hold',
      evidence_status: record.evidence_refs.some((ref) => ref.source_type === 'exam_question')
        ? 'exam_question_evidence'
        : record.evidence_refs.some((ref) => ref.source_type === 'target_exercise')
          ? 'target_exercise_evidence'
          : 'didactic_prior_rationale',
      mint_decision: record.classification.includes('hold') || record.classification.includes('already_covered')
        ? 'hold'
        : 'candidate_pending_human_review',
      mutation_authorized: false,
      duplicate_overlap: {
        overlap_ids: overlaps,
        overlap_count: overlaps.length,
        verdict: overlaps.length ? 'overlap_requires_review_or_hold' : 'no_direct_duplicate_found_in_current_a_units',
        hold_reason: record.hold_reason || null,
      },
    };
  });
}

function summarize(records) {
  const byClassification = {};
  const byGroup = {};
  const byEvidence = {};
  for (const record of records) {
    byClassification[record.classification] = (byClassification[record.classification] || 0) + 1;
    byGroup[record.group] = (byGroup[record.group] || 0) + 1;
    byEvidence[record.evidence_status] = (byEvidence[record.evidence_status] || 0) + 1;
  }
  return {
    operation_count: records.length,
    proposed_candidate_count: records.filter((record) => record.mint_decision === 'candidate_pending_human_review').length,
    hold_count: records.filter((record) => record.mint_decision === 'hold').length,
    mutation_authorized_count: records.filter((record) => record.mutation_authorized).length,
    by_classification: byClassification,
    by_group: byGroup,
    by_evidence_status: byEvidence,
  };
}

function toMarkdownTable(rows, columns) {
  const header = `| ${columns.map((column) => column.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${columns.map((column) => String(column.value(row) ?? '').replace(/\|/g, '\\|')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function buildReviewPacket(inventory, duplicateReport, mutationQueue) {
  const reviewQuestions = [
    {
      id: 'RX1-Q1',
      question: 'Is the inventory complete enough for the current Book 1-4 representation-sensitive calculation surface?',
      options: ['A. Yes', 'B. Mostly, add specific rows', 'C. No, major source class missing', 'D. Not enough evidence'],
    },
    {
      id: 'RX1-Q2',
      question: 'Are A61-A84 acceptable as provisional candidate IDs, assuming RX.2+ rechecks live numbering before mutation?',
      options: ['A. Yes', 'B. Yes, but rename/renumber some', 'C. No, use operation IDs only for now', 'D. Not enough evidence'],
    },
    {
      id: 'RX1-Q3',
      question: 'Which RX.2 percentage/index candidates should proceed to mutation review first?',
      options: ['A. A61-A74 as a set', 'B. Only A61/A66/A67/A70/A72/A74 first', 'C. Hold chart-specific units until more exam evidence', 'D. Not enough evidence'],
    },
    {
      id: 'RX1-Q4',
      question: 'Are chart-only candidates with didactic-prior rationale, such as bar/pie chart units, acceptable for candidate status without immediate mutation approval?',
      options: ['A. Yes', 'B. Yes, but keep medium/high risk', 'C. No, require target/exam evidence before candidate status', 'D. Not enough evidence'],
    },
    {
      id: 'RX1-Q5',
      question: 'Should producer-table and producer-graph candidates A75-A81 remain in RX.3 after RX.2, or be split further?',
      options: ['A. Keep as RX.3', 'B. Split table and graph into separate sprints', 'C. Hold all producer graph units for later', 'D. Not enough evidence'],
    },
    {
      id: 'RX1-Q6',
      question: 'Should elasticity representation candidates A82-A84 proceed after producer candidates, or move earlier because exam evidence is strong?',
      options: ['A. Keep RX.4 order', 'B. Move A82-A84 earlier', 'C. Hold graph elasticity until source annex extraction improves', 'D. Not enough evidence'],
    },
    {
      id: 'RX1-Q7',
      question: 'Are the hold/duplicate decisions correct for welfare areas, shift-vs-movement, short side, table marginal values, and graphical MO=MK?',
      options: ['A. Yes', 'B. Mostly, revisit named holds', 'C. No, some should become candidates now', 'D. Not enough evidence'],
    },
    {
      id: 'RX1-Q8',
      question: 'What gate status should GATE-RX1-representation-unit-scope receive before RX.2 mutation planning?',
      options: ['A. pass', 'B. pass_with_conditions', 'C. hold', 'D. fail'],
    },
  ];

  return {
    gate_id: 'GATE-RX1-representation-unit-scope',
    sprint_id: 'RX.1',
    status: 'prepared_for_human_review',
    generated_by: 'build-scripts/references/build-representation-operation-inventory.js',
    generated_on: new Date().toISOString(),
    purpose: 'Review representation-sensitive operation inventory and duplicate audit before any RX.2+ unit mutation.',
    review_scope: {
      mutation_authorized: false,
      proposed_candidates: mutationQueue.records.length,
      held_or_duplicate_records: duplicateReport.records.length,
      candidate_ids_are_provisional: true,
    },
    artifacts: [
      INVENTORY_PATH,
      DUPLICATE_JSON_PATH,
      DUPLICATE_MD_PATH,
      MUTATION_QUEUE_JSON_PATH,
      MUTATION_QUEUE_MD_PATH,
    ],
    acceptance_checks: [
      'Every proposed candidate has target-exercise evidence, exam-question evidence, or didactic-prior rationale.',
      'No candidate is proposed from syllabus text alone.',
      'Duplicate and overlap candidates are held, not minted.',
      'Candidate records distinguish base operation, representation reading, and composed application.',
      'Candidate IDs are provisional and mutation_authorized is false.',
    ],
    review_questions: reviewQuestions,
    valid_gate_statuses: ['pass', 'pass_with_conditions', 'hold', 'fail'],
  };
}

function writeMarkdownReports(inventory, duplicateReport, mutationQueue, reviewPacket) {
  const inventoryRows = inventory.records;
  writeText(
    COVERAGE_MD_PATH,
    [
      '# Representation Operation Inventory',
      '',
      `Generated: ${inventory.generated_on}`,
      '',
      `Operations: ${inventory.summary.operation_count}`,
      `Candidate units pending review: ${inventory.summary.proposed_candidate_count}`,
      `Held/duplicate records: ${inventory.summary.hold_count}`,
      '',
      '## Matrix',
      '',
      toMarkdownTable(inventoryRows, [
        { label: 'Operation', value: (row) => row.operation_id },
        { label: 'Base operation', value: (row) => row.base_operation },
        { label: 'Representation', value: (row) => row.representation },
        { label: 'Context', value: (row) => row.economic_context },
        { label: 'Candidate', value: (row) => row.candidate_unit_id || 'hold' },
        { label: 'Decision', value: (row) => row.mint_decision },
        { label: 'Evidence', value: (row) => row.evidence_status },
      ]),
      '',
      'No mutation is authorized by this inventory.',
      '',
    ].join('\n')
  );

  writeText(
    DUPLICATE_MD_PATH,
    [
      '# RX.1 Duplicate / Overlap Report',
      '',
      `Held records: ${duplicateReport.records.length}`,
      '',
      toMarkdownTable(duplicateReport.records, [
        { label: 'Operation', value: (row) => row.operation_id },
        { label: 'Name', value: (row) => row.name },
        { label: 'Overlap IDs', value: (row) => (row.duplicate_overlap.overlap_ids || []).join(', ') },
        { label: 'Reason', value: (row) => row.duplicate_overlap.hold_reason || row.classification },
      ]),
      '',
      'Held records must not be minted in RX.2 without explicit human review.',
      '',
    ].join('\n')
  );

  writeText(
    MUTATION_QUEUE_MD_PATH,
    [
      '# RX.1 Proposed Mutation Queue',
      '',
      'Status: proposed only; mutation_authorized is false for every record.',
      '',
      toMarkdownTable(mutationQueue.records, [
        { label: 'Candidate', value: (row) => row.candidate_unit_id },
        { label: 'Name', value: (row) => row.candidate_unit_name },
        { label: 'Needs', value: (row) => (row.needs || []).join(', ') },
        { label: 'Classification', value: (row) => row.classification },
        { label: 'Risk', value: (row) => row.risk },
      ]),
      '',
      'RX.2+ must re-check live numbering and apply only human-approved candidates through CLI.',
      '',
    ].join('\n')
  );

  writeText(
    REVIEW_PACKET_MD_PATH,
    [
      '# GATE-RX1-representation-unit-scope Review Packet',
      '',
      'Status: `prepared_for_human_review`',
      '',
      'Purpose: review the representation-sensitive operation inventory and duplicate audit before any RX.2+ unit mutation.',
      '',
      '## Artifacts',
      '',
      ...reviewPacket.artifacts.map((artifact) => `- \`${artifact}\``),
      '',
      '## Summary',
      '',
      `- Proposed candidates: ${mutationQueue.records.length}`,
      `- Held/duplicate records: ${duplicateReport.records.length}`,
      '- Candidate IDs are provisional.',
      '- No mutation is authorized.',
      '',
      '## Review Questions',
      '',
      ...reviewPacket.review_questions.flatMap((question) => [
        `### ${question.id}`,
        '',
        question.question,
        '',
        'Options:',
        '',
        ...question.options.map((option) => `- ${option}`),
        '',
      ]),
    ].join('\n')
  );
}

function main() {
  const targets = readJson(TARGETS_PATH).exercises;
  const exams = readJson(EXAMS_PATH);
  const units = readJson(UNITS_PATH);
  const cp3 = readJson(CP3_CLOSURE_PATH);
  const graphPlan = readJson(GRAPH_PLAN_PATH);
  const ownedGraph = readJson(OWNED_GRAPH_PATH);
  if (cp3.status !== 'pass_with_conditions') {
    throw new Error('RX.1 requires CP-3 pass_with_conditions closure');
  }

  const allRecords = enrichRecords([...CANDIDATES, ...HOLD_RECORDS], units);
  checkEvidenceRefs(allRecords, targets, exams);
  const maxA = currentMaxAId(units);

  const candidateConflicts = allRecords.filter((record) => record.candidate_id_status === 'conflicts_with_live_registry');
  if (candidateConflicts.length) {
    throw new Error(`Candidate IDs already live and need renumbering: ${candidateConflicts.map((record) => record.candidate_unit_id).join(', ')}`);
  }

  const inventory = {
    schema_version: 1,
    sprint_id: 'RX.1',
    inventory_id: 'representation-operation-inventory',
    status: 'prepared_for_human_review',
    generated_by: 'build-scripts/references/build-representation-operation-inventory.js',
    generated_on: new Date().toISOString(),
    source_files: [
      TARGETS_PATH,
      EXAMS_PATH,
      UNITS_PATH,
      OWNED_GRAPH_PATH,
      GRAPH_PLAN_PATH,
      CP3_CLOSURE_PATH,
    ],
    cp3_gate_status: cp3.status,
    policy: {
      mutation_authorized: false,
      no_machine_edits: true,
      no_external_edits: true,
      no_lesson_target_edits: true,
      candidate_ids_are_provisional: true,
      no_syllabus_only_candidates: true,
      existing_a_domain_max_id_at_generation: `A${String(maxA).padStart(2, '0')}`,
      owned_content_graph_edge_count: ownedGraph.edge_count,
      graph_spec_plan_status: graphPlan.current_status,
    },
    summary: summarize(allRecords),
    records: allRecords,
  };

  const duplicateReport = {
    schema_version: 1,
    report_id: 'RX.1-duplicate-overlap-report',
    generated_by: inventory.generated_by,
    generated_on: inventory.generated_on,
    source_files: [INVENTORY_PATH, UNITS_PATH],
    status: 'warn',
    records: allRecords.filter((record) => record.mint_decision === 'hold'),
  };

  const mutationQueue = {
    schema_version: 1,
    queue_id: 'RX.1-proposed-mutation-queue',
    generated_by: inventory.generated_by,
    generated_on: inventory.generated_on,
    source_files: [INVENTORY_PATH],
    status: 'proposed_pending_human_review',
    mutation_authorized: false,
    candidate_ids_are_provisional: true,
    records: allRecords.filter((record) => record.mint_decision === 'candidate_pending_human_review'),
  };

  const reviewPacket = buildReviewPacket(inventory, duplicateReport, mutationQueue);

  writeJson(INVENTORY_PATH, inventory);
  writeJson(COVERAGE_JSON_PATH, inventory);
  writeJson(DUPLICATE_JSON_PATH, duplicateReport);
  writeJson(MUTATION_QUEUE_JSON_PATH, mutationQueue);
  writeJson(REVIEW_PACKET_JSON_PATH, reviewPacket);
  writeMarkdownReports(inventory, duplicateReport, mutationQueue, reviewPacket);

  console.log(`OK RX.1 inventory: ${inventory.summary.operation_count} records, ${mutationQueue.records.length} candidates, ${duplicateReport.records.length} holds`);
}

if (require.main === module) main();
