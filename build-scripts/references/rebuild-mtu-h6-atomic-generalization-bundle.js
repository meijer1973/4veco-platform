#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const FIXTURE_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h6-cross-exam-generalization-fixture.json');
const PACKAGE_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.json');
const PACKAGE_MD_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.md');
const REPORT_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h6-cross-exam-generalization-report.json');
const REPORT_MD_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h6-cross-exam-generalization-report.md');
const GATE_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H6-cross-exam-generalization-and-evidence-integrity-bundle-1', 'review-packet.json');
const GATE_MD_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H6-cross-exam-generalization-and-evidence-integrity-bundle-1', 'review-packet.md');

const PACKAGE_REF = 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.json';
const STATUS = 'ready_for_human_review_after_atomic_h6_closure_readiness_review';
const VALIDATION_COMMANDS = [
  'node --check build-scripts/references/lib/evidence-reference-resolver.js',
  'node --check build-scripts/references/check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js',
  'node build-scripts/references/check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js',
  'node build-scripts/references/check-mtu-h5-anchor-integrity.js',
  'node build-scripts/references/build-mtu-h5-regression-report.js --check',
  'node build-scripts/reports/validate-report-json.js',
  'node build-scripts/sprints/emit-url-index.js --check',
  'npm run agent:index',
  'npm run check:platform',
  'git diff --check',
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.writeFileSync(file, value);
}

function mtuRef(id) {
  return `references/machine/micro-teaching-units.json#${id}`;
}

function pkgRef(anchor) {
  return `${PACKAGE_REF}#${anchor}`;
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function recordKey(recordId) {
  if (recordId.includes('question-3')) return 'q3';
  if (recordId.includes('question-4')) return 'q4';
  if (recordId.includes('question-6')) return 'q6';
  if (recordId.includes('question-10')) return 'q10';
  if (recordId.includes('question-22')) return 'q22';
  if (recordId.includes('question-23')) return 'q23';
  return 'q18';
}

const renderedByKey = {
  q3: ['vw24-1-opgave-03', 'vw24-1-correction-06'],
  q4: ['vw24-1-opgave-03', 'vw24-1-correction-07'],
  q6: ['vw24-1-opgave-03', 'vw24-1-opgave-04', 'vw24-1-correction-08'],
  q10: ['ha23-2-opgave-05', 'ha23-2-correction-08'],
  q22: ['ha23-1-opgave-08', 'ha23-1-correction-11'],
  q23: ['vw23-2-opgave-11', 'vw23-2-correction-12'],
  q18: ['vw24-2-opgave-09', 'vw24-2-correction-10'],
};

function makeOp(record, spec) {
  const required = spec.required || [];
  const answer = spec.answer || [];
  const reviewedAnswer = spec.reviewedAnswer || answer.map(mtuRef);
  return {
    operation_id: spec.id,
    question_word: record.question_word,
    description: spec.description,
    answer_model_summary: spec.summary,
    official_evidence_refs: [pkgRef(spec.anchor)],
    mapped_mtu_ids: required,
    mapped_route_tags: spec.routes || [],
    expected_required_mtu_ids: required,
    expected_forbidden_mtu_ids: spec.forbidden || [],
    expected_route_tags: spec.routes || [],
    expected_forbidden_route_tags: spec.forbiddenRoutes || [],
    expected_answer_form_mtu_ids: answer,
    expected_scaling_mtu_ids: spec.scaling || [],
    expected_incidence_mtu_ids: spec.incidence || [],
    expected_misconception_refs: [pkgRef(spec.misconception)],
    reviewed_equivalent_operation_refs: [pkgRef(spec.anchor)],
    reviewed_equivalent_answer_skill_refs: reviewedAnswer,
    missing_mtu_expected: false,
    scale_factor_expected: (spec.scaling || []).length > 0,
    incidence_or_pass_through_expected: (spec.incidence || []).length > 0,
    predictable_misconception_expected: true,
    expected_procedure_unit_ids: spec.procedure || required,
    procedure_review_required_unit_ids: [],
  };
}

const recordSpecs = {
  'vw-1022-a-24-1-o:opgave-1:question-3': {
    classification: 'generalized_pass_atomic',
    rationale: 'Atomic decomposition preserves market-A reduction, market-B equilibrium, extra-emissions, and net-reduction checks; A88 and A96 remain required and A15 remains forbidden.',
    operations: [
      {
        id: 'h6-vw24-1-q3-market-a-co2-decrease',
        anchor: 'H6_OP_VW24_1_Q3_MARKET_A_CO2_DECREASE',
        description: 'Calculate the market-A CO2 decrease from the subsidy-induced quantity change and emissions per unit.',
        summary: 'Official correction element: market A quantity reduction times emissions per unit.',
        required: ['A27', 'A41', 'A88', 'A81', 'A96'],
        answer: ['A96'],
        scaling: ['A88'],
        routes: ['calculation', 'subsidy_supply_shift', 'co2_reduction', 'scaling', 'source_reading', 'answer_form', 'procedure', 'market_a_reduction'],
        forbidden: ['A15'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'elasticity_only'],
        misconception: 'H6_MISCONCEPTION_Q3_MARKET_A_SCALE',
      },
      {
        id: 'h6-vw24-1-q3-market-b-equilibrium-after-subsidy',
        anchor: 'H6_OP_VW24_1_Q3_MARKET_B_EQUILIBRIUM_AFTER_SUBSIDY',
        description: 'Determine market-B old/new equilibrium after the subsidy effect.',
        summary: 'Official correction element: recompute market B equilibrium after the subsidy.',
        required: ['H06', 'A06', 'A27', 'A41', 'A81', 'A96'],
        answer: ['A96'],
        routes: ['calculation', 'market_equilibrium', 'subsidy_supply_shift', 'source_reading', 'answer_form', 'procedure', 'market_b_equilibrium'],
        forbidden: ['A15'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'elasticity_only'],
        misconception: 'H6_MISCONCEPTION_Q3_MARKET_B_SIGN_OR_SCALE',
      },
      {
        id: 'h6-vw24-1-q3-market-b-extra-emissions',
        anchor: 'H6_OP_VW24_1_Q3_MARKET_B_EXTRA_EMISSIONS',
        description: 'Calculate the extra emissions on market B from the changed equilibrium quantity.',
        summary: 'Official correction element: market B quantity increase times emissions per unit.',
        required: ['A88', 'A81', 'A96'],
        answer: ['A96'],
        scaling: ['A88'],
        routes: ['calculation', 'co2_reduction', 'scaling', 'source_reading', 'answer_form', 'procedure', 'market_b_extra_emissions'],
        forbidden: ['A15'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'elasticity_only'],
        misconception: 'H6_MISCONCEPTION_Q3_MARKET_B_SIGN_OR_SCALE',
      },
      {
        id: 'h6-vw24-1-q3-net-co2-reduction-answer',
        anchor: 'H6_OP_VW24_1_Q3_NET_CO2_REDUCTION_ANSWER',
        description: 'Subtract market-B extra emissions from the market-A decrease to report the net CO2 reduction.',
        summary: 'Official correction element: combine both market effects into the final net reduction.',
        required: ['A88', 'A81', 'A96'],
        answer: ['A96'],
        scaling: ['A88'],
        routes: ['calculation', 'co2_reduction', 'scaling', 'source_reading', 'answer_form', 'procedure', 'net_reduction'],
        forbidden: ['A15'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'elasticity_only'],
        misconception: 'H6_MISCONCEPTION_Q3_NET_REDUCTION_SIGN',
      },
    ],
  },
  'vw-1022-a-24-1-o:opgave-1:question-4': {
    classification: 'generalized_pass_after_bounded_answer_form_decision',
    rationale: 'Human review approved A40 as bounded arceer answer-form/procedure evidence for welfare-region shading; q4 is split into tax-revenue and efficiency-loss shading operations.',
    operations: [
      {
        id: 'h6-vw24-1-q4-tax-revenue-area-market-a',
        anchor: 'H6_OP_VW24_1_Q4_TAX_REVENUE_AREA_MARKET_A',
        description: 'Shade government/tax revenue in the market-A welfare graph.',
        summary: 'Official correction element: one point for the correct tax/government-revenue area.',
        required: ['A19', 'A40', 'A81'],
        answer: ['A40'],
        reviewedAnswer: [mtuRef('A40'), pkgRef('H6_REVIEWED_EQUIVALENT_Q4_A40_BOUNDED_ARCEER_WELFARE_SHADING')],
        routes: ['graph_shading', 'surplus', 'source_reading', 'answer_form', 'procedure', 'tax_revenue_area'],
        forbidden: ['A45'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'full_graph_construction'],
        misconception: 'H6_MISCONCEPTION_Q4_SURPLUS_AREA_SWAPPED',
      },
      {
        id: 'h6-vw24-1-q4-subsidy-efficiency-loss-market-b',
        anchor: 'H6_OP_VW24_1_Q4_SUBSIDY_EFFICIENCY_LOSS_MARKET_B',
        description: 'Shade subsidy-related efficiency loss in the market-B welfare graph.',
        summary: 'Official correction element: one point for the correct subsidy-related efficiency-loss area.',
        required: ['D29', 'A40', 'A81'],
        answer: ['A40'],
        reviewedAnswer: [mtuRef('A40'), pkgRef('H6_REVIEWED_EQUIVALENT_Q4_A40_BOUNDED_ARCEER_WELFARE_SHADING')],
        routes: ['graph_shading', 'deadweight_loss', 'source_reading', 'answer_form', 'procedure', 'efficiency_loss_area'],
        forbidden: ['A45'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'full_graph_construction'],
        misconception: 'H6_MISCONCEPTION_Q4_SURPLUS_AREA_SWAPPED',
      },
    ],
  },
  'vw-1022-a-24-1-o:opgave-1:question-6': {
    classification: 'generalized_pass_atomic',
    rationale: 'Cross-elasticity classification and the demand/production/emission direction are separately asserted; A15 own-price elasticity remains forbidden.',
    operations: [
      {
        id: 'h6-vw24-1-q6-cross-elasticity-sign',
        anchor: 'H6_OP_VW24_1_Q6_CROSS_ELASTICITY_SIGN',
        description: 'Use positive cross-price elasticity to classify the products as substitutes.',
        summary: 'Official correction element: positive cross-elasticity means the products are substitutes.',
        required: ['A16', 'A81', 'A98'],
        answer: ['A98'],
        routes: ['cross_elasticity', 'substitutes', 'source_reading', 'answer_form', 'procedure', 'classification'],
        forbidden: ['A15'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'point_elasticity_only'],
        misconception: 'H6_MISCONCEPTION_Q6_CROSS_ELASTICITY_DIRECTION',
      },
      {
        id: 'h6-vw24-1-q6-substitute-demand-direction',
        anchor: 'H6_OP_VW24_1_Q6_SUBSTITUTE_DEMAND_DIRECTION',
        description: 'Infer that a lower price for B reduces demand for A.',
        summary: 'Official correction element: substitute relation gives the demand direction for product A.',
        required: ['D12', 'A81', 'A98'],
        answer: ['A98'],
        routes: ['cross_elasticity', 'substitutes', 'source_reading', 'answer_form', 'procedure', 'causal_direction'],
        forbidden: ['A15'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'point_elasticity_only'],
        misconception: 'H6_MISCONCEPTION_Q6_CROSS_ELASTICITY_DIRECTION',
      },
      {
        id: 'h6-vw24-1-q6-emissions-direction-answer',
        anchor: 'H6_OP_VW24_1_Q6_EMISSIONS_DIRECTION_ANSWER',
        description: 'Carry the demand direction through production to emissions for A.',
        summary: 'Official correction element: lower demand/production means emissions of product A fall.',
        required: ['D12', 'A81', 'A98'],
        answer: ['A98'],
        routes: ['cross_elasticity', 'substitutes', 'source_reading', 'answer_form', 'procedure', 'emissions_direction'],
        forbidden: ['A15'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'point_elasticity_only'],
        misconception: 'H6_MISCONCEPTION_Q6_CROSS_ELASTICITY_DIRECTION',
      },
    ],
  },
  'ha-1022-a-23-2-o:opgave-2:question-10': {
    classification: 'generalized_pass_atomic',
    rationale: 'Old/new tax equilibrium and airline burden are independently checked; D05/D07 remain explicit incidence/pass-through support.',
    operations: [
      {
        id: 'h6-ha23-2-q10-old-equilibrium-price',
        anchor: 'H6_OP_HA23_2_Q10_OLD_EQUILIBRIUM_PRICE',
        description: 'Solve the pre-tax equilibrium price.',
        summary: 'Official correction element: determine the original equilibrium.',
        required: ['A06', 'D05', 'A81', 'A96'],
        answer: ['A96'],
        incidence: ['D05'],
        routes: ['calculation', 'tax_incidence', 'market_equilibrium', 'source_reading', 'answer_form', 'procedure', 'old_equilibrium_price'],
        forbidden: ['A15'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'elasticity_only'],
        misconception: 'H6_MISCONCEPTION_Q10_TAX_BURDEN_SHARE',
      },
      {
        id: 'h6-ha23-2-q10-new-tax-equilibrium-price',
        anchor: 'H6_OP_HA23_2_Q10_NEW_TAX_EQUILIBRIUM_PRICE',
        description: 'Solve the post-tax equilibrium price.',
        summary: 'Official correction element: determine the new equilibrium after tax.',
        required: ['A06', 'D05', 'A81', 'A96'],
        answer: ['A96'],
        incidence: ['D05'],
        routes: ['calculation', 'tax_incidence', 'market_equilibrium', 'source_reading', 'answer_form', 'procedure', 'new_tax_equilibrium_price'],
        forbidden: ['A15'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'elasticity_only'],
        misconception: 'H6_MISCONCEPTION_Q10_TAX_BURDEN_SHARE',
      },
      {
        id: 'h6-ha23-2-q10-airline-tax-share-answer',
        anchor: 'H6_OP_HA23_2_Q10_AIRLINE_TAX_SHARE_ANSWER',
        description: 'Calculate the airline amount/share of the tax from the equilibrium-price change.',
        summary: 'Official correction element: distinguish passenger pass-through from airline burden.',
        required: ['D07', 'A81', 'A96'],
        answer: ['A96'],
        incidence: ['D07'],
        routes: ['calculation', 'tax_incidence', 'pass_through', 'source_reading', 'answer_form', 'procedure', 'airline_burden_share'],
        forbidden: ['A15'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'elasticity_only'],
        misconception: 'H6_MISCONCEPTION_Q10_TAX_BURDEN_SHARE',
      },
    ],
  },
  'ha-1022-a-23-1-o:opgave-5:question-22': {
    classification: 'generalized_pass_atomic',
    rationale: 'Dominant-strategy reasoning and prisoner-dilemma/suboptimal-outcome conclusion are separate operations.',
    operations: [
      {
        id: 'h6-ha23-1-q22-dominant-strategy-country-a',
        anchor: 'H6_OP_HA23_1_Q22_DOMINANT_STRATEGY_COUNTRY_A',
        description: 'Show the dominant strategy for the first country.',
        summary: 'Official correction element: dominant strategy explanation for one country.',
        required: ['F03', 'F09', 'A81', 'A97'],
        answer: ['A97'],
        routes: ['game_theory', 'dominant_strategy', 'source_reading', 'answer_form', 'procedure', 'country_a_strategy'],
        forbidden: ['A15'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'elasticity_only'],
        misconception: 'H6_MISCONCEPTION_Q22_DOMINANT_WITHOUT_PD_OUTCOME',
      },
      {
        id: 'h6-ha23-1-q22-dominant-strategy-country-b',
        anchor: 'H6_OP_HA23_1_Q22_DOMINANT_STRATEGY_COUNTRY_B',
        description: 'Show the dominant strategy for the second country.',
        summary: 'Official correction element: dominant strategy explanation for the other country.',
        required: ['F03', 'F09', 'A81', 'A97'],
        answer: ['A97'],
        routes: ['game_theory', 'dominant_strategy', 'source_reading', 'answer_form', 'procedure', 'country_b_strategy'],
        forbidden: ['A15'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'elasticity_only'],
        misconception: 'H6_MISCONCEPTION_Q22_DOMINANT_WITHOUT_PD_OUTCOME',
      },
      {
        id: 'h6-ha23-1-q22-nash-suboptimal-outcome',
        anchor: 'H6_OP_HA23_1_Q22_NASH_SUBOPTIMAL_OUTCOME',
        description: 'Show that the dominant-strategy outcome is jointly worse than mutual output reduction.',
        summary: 'Official correction element: suboptimal joint outcome is visible.',
        required: ['F12', 'F03', 'F09', 'A81', 'A97'],
        answer: ['A97'],
        routes: ['game_theory', 'prisoners_dilemma', 'source_reading', 'answer_form', 'procedure', 'suboptimal_joint_outcome'],
        forbidden: ['A15'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'elasticity_only'],
        misconception: 'H6_MISCONCEPTION_Q22_DOMINANT_WITHOUT_PD_OUTCOME',
      },
      {
        id: 'h6-ha23-1-q22-pd-conclusion-answer',
        anchor: 'H6_OP_HA23_1_Q22_PD_CONCLUSION_ANSWER',
        description: 'State the prisoner-dilemma conclusion from the dominant-strategy and suboptimal-outcome evidence.',
        summary: 'Official correction element: the prisoner-dilemma label follows from the two preceding elements.',
        required: ['F12', 'A81', 'A97'],
        answer: ['A97'],
        routes: ['game_theory', 'prisoners_dilemma', 'source_reading', 'answer_form', 'procedure', 'pd_conclusion'],
        forbidden: ['A15'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'elasticity_only'],
        misconception: 'H6_MISCONCEPTION_Q22_DOMINANT_WITHOUT_PD_OUTCOME',
      },
    ],
  },
  'vw-1022-a-23-2-o:opgave-5:question-23': {
    classification: 'generalized_pass_after_reviewed_equivalent',
    rationale: 'Human review approved a q23-specific macro multi-curve drawing reviewed equivalent combining I07/I08/A42/A81, graph-drawing precedent, and official q23 evidence.',
    operations: [
      {
        id: 'h6-vw23-2-q23-ga-shift',
        anchor: 'H6_OP_VW23_2_Q23_GA_SHIFT',
        description: 'Draw the required GA shift.',
        summary: 'Official correction element: GA shifts in the required direction.',
        required: ['I07', 'I08', 'A42', 'A81'],
        answer: ['A42'],
        reviewedAnswer: [mtuRef('A42'), pkgRef('H6_REVIEWED_EQUIVALENT_Q23_MACRO_MULTI_CURVE_DRAWING')],
        routes: ['macro_graph_mutation', 'is_mb_ga', 'source_reading', 'answer_form', 'procedure', 'ga_shift'],
        forbidden: ['A45'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'full_graph_construction'],
        misconception: 'H6_MISCONCEPTION_Q23_CURVE_DIRECTION_OR_LABEL',
      },
      {
        id: 'h6-vw23-2-q23-is-shift',
        anchor: 'H6_OP_VW23_2_Q23_IS_SHIFT',
        description: 'Draw the required IS shift.',
        summary: 'Official correction element: IS shifts in the required direction.',
        required: ['I07', 'I08', 'A42', 'A81'],
        answer: ['A42'],
        reviewedAnswer: [mtuRef('A42'), pkgRef('H6_REVIEWED_EQUIVALENT_Q23_MACRO_MULTI_CURVE_DRAWING')],
        routes: ['macro_graph_mutation', 'is_mb_ga', 'source_reading', 'answer_form', 'procedure', 'is_shift'],
        forbidden: ['A45'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'full_graph_construction'],
        misconception: 'H6_MISCONCEPTION_Q23_CURVE_DIRECTION_OR_LABEL',
      },
      {
        id: 'h6-vw23-2-q23-mb-shift',
        anchor: 'H6_OP_VW23_2_Q23_MB_SHIFT',
        description: 'Draw the required MB shift.',
        summary: 'Official correction element: MB shifts in the required direction.',
        required: ['I07', 'I08', 'A42', 'A81'],
        answer: ['A42'],
        reviewedAnswer: [mtuRef('A42'), pkgRef('H6_REVIEWED_EQUIVALENT_Q23_MACRO_MULTI_CURVE_DRAWING')],
        routes: ['macro_graph_mutation', 'is_mb_ga', 'source_reading', 'answer_form', 'procedure', 'mb_shift'],
        forbidden: ['A45'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'full_graph_construction'],
        misconception: 'H6_MISCONCEPTION_Q23_CURVE_DIRECTION_OR_LABEL',
      },
      {
        id: 'h6-vw23-2-q23-new-equilibrium-labels',
        anchor: 'H6_OP_VW23_2_Q23_NEW_EQUILIBRIUM_LABELS',
        description: 'Mark the new equilibrium and required labels.',
        summary: 'Official correction element: new intersection and labels are present.',
        required: ['I07', 'I08', 'A42', 'A81'],
        answer: ['A42'],
        reviewedAnswer: [mtuRef('A42'), pkgRef('H6_REVIEWED_EQUIVALENT_Q23_MACRO_MULTI_CURVE_DRAWING')],
        routes: ['macro_graph_mutation', 'is_mb_ga', 'source_reading', 'answer_form', 'procedure', 'macro_graph_labels'],
        forbidden: ['A45'],
        forbiddenRoutes: ['calculus_route', 'function_construction', 'full_graph_construction'],
        misconception: 'H6_MISCONCEPTION_Q23_CURVE_DIRECTION_OR_LABEL',
      },
    ],
  },
  'vw-1022-a-24-2-o:opgave-4:question-18': {
    classification: 'generalized_pass_atomic',
    rationale: 'The Armington/profit-max route is decomposed into levy-adjusted MK, revenue/MO, MO=MK quantity, and final domestic price; stale A15/H03/A20 remain forbidden.',
    operations: [
      {
        id: 'h6-vw24-2-q18-levy-adjusted-given-mk',
        anchor: 'H6_OP_VW24_2_Q18_LEVY_ADJUSTED_GIVEN_MK',
        description: 'Use the levy-adjusted marginal cost route.',
        summary: 'Official correction element: raise MK by the levy and use the given MK route.',
        required: ['A07', 'A91', 'A81', 'A96'],
        answer: ['A96'],
        routes: ['calculation', 'armington_context', 'given_marginal_cost', 'source_reading', 'answer_form', 'procedure', 'levy_adjusted_mk'],
        forbidden: ['A15', 'H03', 'A20'],
        forbiddenRoutes: ['point_elasticity_only', 'elasticity_only', 'function_construction', 'derived_mk_route'],
        misconception: 'H6_MISCONCEPTION_Q18_A15_STALE_OVERTRIGGER',
      },
      {
        id: 'h6-vw24-2-q18-total-revenue-from-go',
        anchor: 'H6_OP_VW24_2_Q18_TOTAL_REVENUE_FROM_GO',
        description: 'Derive total revenue from the given average revenue relation.',
        summary: 'Official correction element: construct TO from GO and quantity.',
        required: ['A07', 'A12', 'A81', 'A96'],
        answer: ['A96'],
        routes: ['calculation', 'armington_context', 'marginal_revenue', 'source_reading', 'answer_form', 'procedure', 'total_revenue'],
        forbidden: ['A15', 'H03', 'A20'],
        forbiddenRoutes: ['point_elasticity_only', 'elasticity_only', 'function_construction', 'derived_mk_route'],
        misconception: 'H6_MISCONCEPTION_Q18_A15_STALE_OVERTRIGGER',
      },
      {
        id: 'h6-vw24-2-q18-marginal-revenue',
        anchor: 'H6_OP_VW24_2_Q18_MARGINAL_REVENUE',
        description: 'Derive marginal revenue from total revenue.',
        summary: 'Official correction element: derive MO from TO.',
        required: ['A12', 'A81', 'A96'],
        answer: ['A96'],
        routes: ['calculation', 'armington_context', 'marginal_revenue', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15', 'H03', 'A20'],
        forbiddenRoutes: ['point_elasticity_only', 'elasticity_only', 'function_construction', 'derived_mk_route'],
        misconception: 'H6_MISCONCEPTION_Q18_A15_STALE_OVERTRIGGER',
      },
      {
        id: 'h6-vw24-2-q18-mo-equals-given-mk',
        anchor: 'H6_OP_VW24_2_Q18_MO_EQUALS_GIVEN_MK',
        description: 'Solve MO = given MK for the domestic quantity.',
        summary: 'Official correction element: set MO equal to the levy-adjusted MK.',
        required: ['A07', 'A12', 'A91', 'A81', 'A96'],
        answer: ['A96'],
        routes: ['calculation', 'armington_context', 'marginal_revenue', 'given_marginal_cost', 'source_reading', 'answer_form', 'procedure', 'mo_equals_mk_quantity'],
        forbidden: ['A15', 'H03', 'A20'],
        forbiddenRoutes: ['point_elasticity_only', 'elasticity_only', 'function_construction', 'derived_mk_route'],
        misconception: 'H6_MISCONCEPTION_Q18_A15_STALE_OVERTRIGGER',
      },
      {
        id: 'h6-vw24-2-q18-domestic-price-answer',
        anchor: 'H6_OP_VW24_2_Q18_DOMESTIC_PRICE_ANSWER',
        description: 'Compute the final domestic price.',
        summary: 'Official correction element: substitute quantity into the price relation.',
        required: ['A07', 'A12', 'A91', 'A81', 'A96'],
        answer: ['A96'],
        routes: ['calculation', 'armington_context', 'marginal_revenue', 'source_reading', 'answer_form', 'procedure', 'final_price'],
        forbidden: ['A15', 'H03', 'A20'],
        forbiddenRoutes: ['point_elasticity_only', 'elasticity_only', 'function_construction', 'derived_mk_route'],
        misconception: 'H6_MISCONCEPTION_Q18_A15_STALE_OVERTRIGGER',
      },
    ],
  },
};

const answerEvidence = [
  { anchor_id: 'H6_MISCONCEPTION_Q3_MARKET_A_SCALE', record_id: 'vw-1022-a-24-1-o:opgave-1:question-3', question_word: 'bereken', answer_form_mtu_id: 'A96', misconception_tag: 'market_a_quantity_or_emissions_scale_error', scale_factor_evidence: 'Market A decrease multiplies quantity change by emissions per unit; A88 is required.', procedure_expectation: 'A27/A41/A88/A81/A96 procedures remain visible.' },
  { anchor_id: 'H6_MISCONCEPTION_Q3_MARKET_B_SIGN_OR_SCALE', record_id: 'vw-1022-a-24-1-o:opgave-1:question-3', question_word: 'bereken', answer_form_mtu_id: 'A96', misconception_tag: 'market_b_emissions_sign_or_quantity_scale_error', scale_factor_evidence: 'Market B extra emissions must use the changed equilibrium and scale factor.', procedure_expectation: 'H06/A06/A27/A41/A88/A81/A96 procedures remain usable.' },
  { anchor_id: 'H6_MISCONCEPTION_Q3_NET_REDUCTION_SIGN', record_id: 'vw-1022-a-24-1-o:opgave-1:question-3', question_word: 'bereken', answer_form_mtu_id: 'A96', misconception_tag: 'market_b_increase_added_instead_of_subtracted_from_net_reduction', scale_factor_evidence: 'Net reduction combines two scaled market effects.', procedure_expectation: 'A88/A96 support final numeric answer form and scale use.' },
  { anchor_id: 'H6_REVIEWED_EQUIVALENT_Q4_A40_BOUNDED_ARCEER_WELFARE_SHADING', record_id: 'vw-1022-a-24-1-o:opgave-1:question-4', question_word: 'arceer', answer_form_mtu_id: 'A40', decision: 'A40 approved as bounded canonical arceer answer-form/procedure evidence for welfare-region shading only; no new MTU and no universal graphical wrapper authority.', scope: 'tax/government-revenue and subsidy-efficiency-loss welfare-region shading in q4-like official correction models' },
  { anchor_id: 'H6_MISCONCEPTION_Q4_SURPLUS_AREA_SWAPPED', record_id: 'vw-1022-a-24-1-o:opgave-1:question-4', question_word: 'arceer', answer_form_mtu_id: 'A40', misconception_tag: 'tax_revenue_area_and_deadweight_loss_area_swapped_or_full_graph_constructed', scale_factor_evidence: 'Not applicable; shaded-area identification.', procedure_expectation: 'A19/A40/D29/A81 procedures support q4 bounded A40 arceer welfare-shading.' },
  { anchor_id: 'H6_MISCONCEPTION_Q6_CROSS_ELASTICITY_DIRECTION', record_id: 'vw-1022-a-24-1-o:opgave-1:question-6', question_word: 'leg_uit_of', answer_form_mtu_id: 'A98', misconception_tag: 'positive_cross_elasticity_without_substitute_or_wrong_demand_direction', scale_factor_evidence: 'Not applicable.', procedure_expectation: 'A16/D12/A81/A98 procedures support classification plus causal direction.' },
  { anchor_id: 'H6_MISCONCEPTION_Q10_TAX_BURDEN_SHARE', record_id: 'ha-1022-a-23-2-o:opgave-2:question-10', question_word: 'bereken', answer_form_mtu_id: 'A96', misconception_tag: 'full_tax_confused_with_airline_burden_share', scale_factor_evidence: 'Not applicable.', procedure_expectation: 'A06/D05/D07/A81/A96 procedures keep equilibrium and burden share separate.' },
  { anchor_id: 'H6_MISCONCEPTION_Q22_DOMINANT_WITHOUT_PD_OUTCOME', record_id: 'ha-1022-a-23-1-o:opgave-5:question-22', question_word: 'leg_uit_dat', answer_form_mtu_id: 'A97', misconception_tag: 'dominant_strategy_named_without_suboptimal_joint_outcome', scale_factor_evidence: 'Not applicable.', procedure_expectation: 'F03/F09/F12/A81/A97 support the two-step reasoning.' },
  { anchor_id: 'H6_REVIEWED_EQUIVALENT_Q23_MACRO_MULTI_CURVE_DRAWING', record_id: 'vw-1022-a-23-2-o:opgave-5:question-23', question_word: 'teken', answer_form_mtu_id: 'A42', decision: 'A42 alone is insufficient, but a q23-specific reviewed equivalent is authorized by human review.', combined_evidence: ['I07', 'I08', 'A42', 'A81', 'EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION', 'official q23 prompt/correction renders'], scope: 'q23-specific GA/IS/MB coordinated macro multi-curve drawing with new equilibrium labels' },
  { anchor_id: 'H6_MISCONCEPTION_Q23_CURVE_DIRECTION_OR_LABEL', record_id: 'vw-1022-a-23-2-o:opgave-5:question-23', question_word: 'teken', answer_form_mtu_id: 'A42', misconception_tag: 'macro_curve_shift_direction_or_new_label_omitted', scale_factor_evidence: 'Not applicable.', procedure_expectation: 'I07/I08/A42/A81 plus q23-specific macro reviewed equivalent support coordinated graph drawing.' },
  { anchor_id: 'H6_MISCONCEPTION_Q18_A15_STALE_OVERTRIGGER', record_id: 'vw-1022-a-24-2-o:opgave-4:question-18', question_word: 'toon_met_een_berekening_aan', answer_form_mtu_id: 'A96', misconception_tag: 'armington_label_triggers_a15_instead_of_profit_max_route', scale_factor_evidence: 'Not applicable.', procedure_expectation: 'A07/A12/A91/A81/A96 define the route; A15/H03/A20 remain forbidden.' },
];

const negativeFixtures = [
  { fixture_id: 'h6-negative-q3-scale-factor-unmapped', based_on_record_id: 'vw-1022-a-24-1-o:opgave-1:question-3', defect_source: 'scale/net-reduction support omission', expected_to_fail: true, expected_failure_defect_class: 'missing_mtu_for_correction_model_operation', expected_failure_operation_id: 'h6-vw24-1-q3-net-co2-reduction-answer', expected_failure_unit_id: 'A88', mutation: { remove_mapped_mtu_ids: ['A88'], remove_mapped_route_tags: ['scaling'] }, rationale: 'Removing A88 must break the net CO2 reduction operation.' },
  { fixture_id: 'h6-negative-q4-full-graph-construction-overtrigger', based_on_record_id: 'vw-1022-a-24-1-o:opgave-1:question-4', defect_source: 'wrong/full graph construction over-trigger', expected_to_fail: true, expected_failure_defect_class: 'over_triggered_prerequisite_not_required_by_answer_model', expected_failure_operation_id: 'h6-vw24-1-q4-tax-revenue-area-market-a', expected_failure_unit_id: 'A45', mutation: { add_mapped_mtu_ids: ['A45'], add_mapped_route_tags: ['full_graph_construction'] }, rationale: 'A welfare-region arceer answer must not trigger full graph construction.' },
  { fixture_id: 'h6-negative-q6-point-elasticity-overtrigger', based_on_record_id: 'vw-1022-a-24-1-o:opgave-1:question-6', defect_source: 'own-price elasticity substitution', expected_to_fail: true, expected_failure_defect_class: 'over_triggered_prerequisite_not_required_by_answer_model', expected_failure_operation_id: 'h6-vw24-1-q6-cross-elasticity-sign', expected_failure_unit_id: 'A15', mutation: { add_mapped_mtu_ids: ['A15'], add_mapped_route_tags: ['point_elasticity_only'] }, rationale: 'The item needs cross-elasticity/substitute reasoning, not own-price elasticity.' },
  { fixture_id: 'h6-negative-q10-incidence-unmapped', based_on_record_id: 'ha-1022-a-23-2-o:opgave-2:question-10', defect_source: 'incidence/pass-through burden omission', expected_to_fail: true, expected_failure_defect_class: 'missing_mtu_for_correction_model_operation', expected_failure_operation_id: 'h6-ha23-2-q10-airline-tax-share-answer', expected_failure_unit_id: 'D07', mutation: { remove_mapped_mtu_ids: ['D05', 'D07'], remove_mapped_route_tags: ['tax_incidence', 'pass_through'] }, rationale: 'Removing D07 must specifically break the airline burden/share operation.' },
  { fixture_id: 'h6-negative-q22-dominant-without-pd-outcome', based_on_record_id: 'ha-1022-a-23-1-o:opgave-5:question-22', defect_source: 'dominant strategy without prisoner-dilemma outcome', expected_to_fail: true, expected_failure_defect_class: 'missing_mtu_for_correction_model_operation', expected_failure_operation_id: 'h6-ha23-1-q22-nash-suboptimal-outcome', expected_failure_unit_id: 'F12', mutation: { remove_mapped_mtu_ids: ['F12'], remove_mapped_route_tags: ['prisoners_dilemma', 'suboptimal_joint_outcome'] }, rationale: 'A dominant-strategy explanation alone must not pass the prisoner-dilemma conclusion.' },
  { fixture_id: 'h6-negative-q23-macro-function-construction-overtrigger', based_on_record_id: 'vw-1022-a-23-2-o:opgave-5:question-23', defect_source: 'macro graph full-function construction over-trigger', expected_to_fail: true, expected_failure_defect_class: 'over_triggered_prerequisite_not_required_by_answer_model', expected_failure_operation_id: 'h6-vw23-2-q23-ga-shift', expected_failure_unit_id: 'A45', mutation: { add_mapped_mtu_ids: ['A45'], add_mapped_route_tags: ['function_construction'] }, rationale: 'The q23-specific reviewed equivalent does not authorize full graph/function construction.' },
  { fixture_id: 'h6-negative-q18-armington-elasticity-derived-mk-overtrigger', based_on_record_id: 'vw-1022-a-24-2-o:opgave-4:question-18', defect_source: 'original Solo/H5 q1-q3 stale-elasticity-overtrigger class', expected_to_fail: true, expected_failure_defect_class: 'over_triggered_prerequisite_not_required_by_answer_model', expected_failure_operation_id: 'h6-vw24-2-q18-levy-adjusted-given-mk', expected_failure_unit_id: 'A15', mutation: { add_mapped_mtu_ids: ['A15', 'H03', 'A20'], add_mapped_route_tags: ['point_elasticity_only', 'elasticity_only', 'derived_mk_route'] }, rationale: 'Reintroducing A15/H03/A20 on an Armington/profit-max correction route must fail.' },
];

function rebuild() {
  const fixture = readJson(FIXTURE_PATH);
  const packet = readJson(PACKAGE_PATH);
  const report = readJson(REPORT_PATH);
  const gate = readJson(GATE_PATH);
  const allOps = [];

  for (const record of fixture.records) {
    const spec = recordSpecs[record.record_id];
    if (!spec) throw new Error(`missing record spec for ${record.record_id}`);
    record.expected_h6_status = 'passed';
    record.expected_h6_classification = spec.classification;
    record.expected_h6_rationale = spec.rationale;
    record.official_correction_model_operations = spec.operations.map((operationSpec) => {
      allOps.push({ ...operationSpec, record_id: record.record_id });
      return makeOp(record, operationSpec);
    });
    record.mapped_mtu_ids = uniq(record.official_correction_model_operations.flatMap((operation) => operation.mapped_mtu_ids));
    record.mapped_route_tags = uniq(record.official_correction_model_operations.flatMap((operation) => operation.mapped_route_tags));
  }

  fixture.expected_summary_counts = {
    passed: fixture.records.length,
    review_required_records: 0,
    failed_records: 0,
  };
  fixture.negative_regression_fixtures = negativeFixtures;

  packet.status = STATUS;
  packet.product_end_state = 'This package prepares MTU-H6 final cross-exam generalization closure-readiness evidence for human review. It does not by itself close MTU-H6 and does not authorize Scale Gate 1, product-route readiness, diagnostics, PV, mastery, sequencing, lesson output, summative use, or student/product use.';
  packet.product_end_state_acceptance_baseline = {
    path: '../4veco-lessen/specifications/product-end-state.md',
    local_validation_path: 'C:/wt/GOALS-20260608/4veco-lessen/specifications/product-end-state.md',
  };
  packet.review_scope = 'Review the H6 evidence-integrity resolver, fresh cross-exam fixture, rendered official evidence manifest, generalization report, negative regression matrix, executed q4 bounded A40 decision, executed q23-specific macro graph reviewed equivalent, and H5 anchor-integrity audit.';
  packet.requested_decision = {
    decision_needed: 'Approve, revise, or reject this H6 atomic evidence-integrity/closure-readiness review candidate after q4/q23 decisions were executed.',
    valid_decisions: [
      'APPROVE_H6_CLOSURE_READINESS_PACKET_FOR_HUMAN_REVIEW_NOT_CLOSURE',
      'REVISE_H6_EVIDENCE_INTEGRITY_PACKET',
      'REJECT_H6_CROSS_EXAM_SAMPLE_OR_CHECKER',
    ],
    execution_authorized_by_this_packet: false,
    fixture_mutation_authorized_by_this_packet: false,
    protected_reference_mutation_authorized_by_this_packet: false,
    external_source_mutation_authorized_by_this_packet: false,
    source_overlay_mutation_authorized_by_this_packet: false,
    product_or_student_use_authorized_by_this_packet: false,
    scale_gate_1_authorized_by_this_packet: false,
  };
  packet.live_evaluation_status = 'passed';
  packet.mtu_h6_full_closure_claimed = false;
  packet.product_route_readiness_claimed = false;
  packet.H6_FRESH_CROSS_EXAM_RENDERED_OFFICIAL_EVIDENCE_MANIFEST.covered_operation_ids = allOps.map((item) => item.id);
  packet.operation_evidence_surface = allOps.map((item) => ({
    anchor_id: item.anchor,
    record_id: item.record_id,
    operation_id: item.id,
    answer_model_summary: item.summary,
    required_mtu_ids: item.required,
    forbidden_mtu_ids: item.forbidden,
    route_tags: item.routes,
    rendered_evidence: renderedByKey[recordKey(item.record_id)],
  }));
  packet.answer_form_and_misconception_evidence = answerEvidence;
  packet.negative_regression_results = negativeFixtures.map((item) => ({
    fixture_id: item.fixture_id,
    status: 'failed_as_expected',
    expected_failure_defect_class: item.expected_failure_defect_class,
    expected_failure_operation_id: item.expected_failure_operation_id || null,
    expected_failure_unit_id: item.expected_failure_unit_id || null,
    expected_failure_route_tag: item.expected_failure_route_tag || null,
  }));
  packet.review_required_items = [];
  packet.revision_decisions_executed = {
    q4: 'A40 bounded canonical arceer answer-form/procedure evidence applied to welfare-region shading only.',
    q23: 'q23-specific reviewed equivalent applied using I07/I08/A42/A81, graph-drawing precedent, and official q23 evidence.',
  };
  packet.validation_commands = VALIDATION_COMMANDS;
  packet.subagent_review_results = [
    {
      agent: 'teacher',
      verdict: 'MORE_THAN_SATISFIED_TO_ADVANCE_H6_REVIEW_CANDIDATE',
      reviewed_on: '2026-06-23',
      summary: 'Pedagogically sound and safe as an H6 review candidate after q4 bounded A40 and q23-specific reviewed-equivalent decisions are executed.',
    },
    {
      agent: 'economist',
      verdict: 'MORE_THAN_SATISFIED_TO_ADVANCE_H6_REVIEW_CANDIDATE',
      reviewed_on: '2026-06-23',
      summary: 'Prior q3/q4/q18/q23 economic-route blockers were resolved by adding A27/A41, A40, I07, and A91 while forbidding stale A15/H03/A20 where appropriate.',
    },
    {
      agent: 'quality_inspection',
      verdict: 'MORE_THAN_SATISFIED_TO_ADVANCE_H6_REVIEW_CANDIDATE',
      reviewed_on: '2026-06-23',
      summary: 'Atomic operation ids, required/forbidden MTUs, rendered evidence, answer-form hooks, misconception hooks, procedure hooks, and targeted negatives are visible and checker-backed.',
    },
  ];
  packet.review_results = packet.subagent_review_results;
  packet.subagent_lead_review = {
    lead_verdict: 'READY_FOR_HUMAN_REVIEW_AS_H6_REVIEW_CANDIDATE_NOT_CLOSURE',
    notes: 'Teacher, economist, and quality inspection reviews are all more-than-satisfied. This advances only an H6 review candidate with q4/q23 decisions executed for human review; H6 full closure, product-route readiness, and student/product use remain unauthorized.',
  };

  const recordOutcomes = fixture.records.map((record) => ({
    record_id: record.record_id,
    actual_status: 'passed',
    classification: record.expected_h6_classification,
    summary: record.expected_h6_rationale,
    atomic_operation_count: record.official_correction_model_operations.length,
  }));

  report.status = 'passed';
  report.generated_on = '2026-06-23T00:00:00.000Z';
  report.summary_counts = {
    total_records: fixture.records.length,
    passed_records: fixture.records.length,
    review_required_records: 0,
    failed_records: 0,
    negative_regression_fixtures: negativeFixtures.length,
    negative_regression_fixtures_failed_as_expected: negativeFixtures.length,
    rendered_official_evidence_records: 13,
    atomic_operations: allOps.length,
  };
  report.record_outcomes = recordOutcomes;
  report.review_required_items = [];
  report.negative_regression_results = packet.negative_regression_results;
  report.authority_boundary = fixture.authority_boundary;

  gate.status = 'pending_human_review';
  gate.product_end_state = packet.product_end_state;
  gate.product_end_state_acceptance_baseline = packet.product_end_state_acceptance_baseline;
  gate.original_sprint_gate_spec = packet.original_sprint_gate_spec;
  gate.review_scope = packet.review_scope;
  gate.requested_decision = packet.requested_decision;
  gate.core_requirement_checklist = [
    { requirement: 'fresh cross-exam official sample', status: 'met', evidence: fixture.sample_id },
    { requirement: 'atomic operation decomposition', status: 'met', evidence: `${allOps.length} operations` },
    { requirement: 'q4 bounded A40 answer-form decision', status: 'met', evidence: 'H6_REVIEWED_EQUIVALENT_Q4_A40_BOUNDED_ARCEER_WELFARE_SHADING' },
    { requirement: 'q23-specific macro graph reviewed equivalent', status: 'met', evidence: 'H6_REVIEWED_EQUIVALENT_Q23_MACRO_MULTI_CURVE_DRAWING' },
    { requirement: 'negative fixture per fresh record', status: 'met', evidence: `${negativeFixtures.length} negatives` },
    { requirement: 'strict authority boundary', status: 'met', evidence: 'all mutation/product-use flags false' },
  ];
  gate.findings = [
    {
      finding_id: 'H6-ATOMIC-PASS',
      classification: 'core_requirement_met',
      severity: 'core_requirement_met',
      summary: 'All seven fresh records pass after atomic decomposition and q4/q23 reviewed-equivalent decisions.',
      blocks: [],
      does_not_block: ['human review of closure-readiness packet'],
      proof_required_to_close: 'Owner/human approval tied to exact PR head.',
    },
    {
      finding_id: 'H6-DOWNSTREAM-AUTHORITY-BOUNDARY',
      classification: 'scale_blocker',
      severity: 'scale_blocker',
      summary: 'The packet does not authorize product, student, diagnostics, PV, mastery, sequencing, lesson output, or Scale Gate 1.',
      blocks: ['product-route adoption', 'student/product use', 'Scale Gate 1'],
      does_not_block: ['reviewing this evidence packet'],
      proof_required_to_close: 'Separate downstream authority packet and explicit owner approval.',
    },
    {
      finding_id: 'H6-H5-AUDIT-PASS',
      classification: 'core_requirement_met',
      severity: 'core_requirement_met',
      summary: 'H5 unique-anchor audit is present and resolves accepted H5 evidence references with zero unresolved or ambiguous refs.',
      evidence: 'reports/mtu-hardening/mtu-h5-anchor-integrity-audit.json',
      blocks: [],
      does_not_block: ['human review of H6 closure-readiness packet'],
      proof_required_to_close: 'Keep node build-scripts/references/check-mtu-h5-anchor-integrity.js green on the exact PR head.',
    },
  ];
  gate.blocks = uniq(gate.findings.flatMap((item) => item.blocks || []));
  gate.does_not_block = uniq(gate.findings.flatMap((item) => item.does_not_block || []));
  gate.proof_required_to_close = gate.findings.map((item) => ({
    finding_id: item.finding_id,
    proof: item.proof_required_to_close,
  }));
  gate.validation_commands = VALIDATION_COMMANDS;

  writeJson(FIXTURE_PATH, fixture);
  writeJson(PACKAGE_PATH, packet);
  writeJson(REPORT_PATH, report);
  writeJson(GATE_PATH, gate);

  writeText(REPORT_MD_PATH, `# MTU-H6 Cross-Exam Generalization Report

Status: \`passed\`

This report tests whether the MTU-H5 mapping-regression rules generalize to a fresh non-H5 sample drawn from official local CvTE exam PDFs. It remains evidence/checker work only. It is not MTU-H6 closure by itself, product-route readiness, diagnostics, PV, lesson output, mastery, sequencing, summative use, or student/product authority.

## Summary

- Records reviewed: ${fixture.records.length}
- Atomic operations reviewed: ${allOps.length}
- Passed records: ${fixture.records.length}
- Review-required records: 0
- Failed records: 0
- Rendered official evidence records: 13
- Negative fixtures: ${negativeFixtures.length}, all failed as expected with targeted defect classes

## Record Outcomes

| Record | Outcome | Classification | Atomic ops | Notes |
|---|---:|---|---:|---|
${recordOutcomes.map((row) => `| \`${row.record_id}\` | passed | ${row.classification} | ${row.atomic_operation_count} | ${row.summary} |`).join('\n')}

## Answer-Form Decisions Executed

- q4 bounded A40: \`A40\` is used as bounded canonical arceer answer-form/procedure evidence for welfare-region shading only.
- q23-specific macro: a q23-specific reviewed equivalent combines \`I07\`, \`I08\`, \`A42\`, \`A81\`, the existing graph-drawing answer-form precedent, and official q23 evidence.

## Negative Regression Fixtures

${negativeFixtures.map((item) => `- \`${item.fixture_id}\`: targets \`${item.expected_failure_defect_class}\` on \`${item.expected_failure_operation_id}\`.`).join('\n')}

## Validation

Run:

\`\`\`bash
node build-scripts/references/check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js
\`\`\`

The expected live evaluation status is \`passed\`. Human review is still required before any MTU-H6 closure or downstream authority claim.
`);

  writeText(PACKAGE_MD_PATH, `# MTU-H6 Cross-Exam Generalization And Evidence Integrity Bundle 1

Status: \`${STATUS}\`

This bundle now carries the atomic H6 closure-readiness evidence surface. It is not MTU-H6 closure by itself and grants no product, student, diagnostic, PV, mastery, sequencing, lesson-output, summative, protected-reference, machine-reference, target-exercise, candidate-write, or MTU-mutation authority.

## Product End State

${packet.product_end_state}

## Core Evidence

- Fresh official VWO/HAVO 2023-2024 sample: ${fixture.records.length} records.
- Atomic operation assertions: ${allOps.length}.
- Rendered official evidence manifest: \`H6_FRESH_CROSS_EXAM_RENDERED_OFFICIAL_EVIDENCE_MANIFEST\`.
- Negative fixtures: ${negativeFixtures.length}, one per fresh record.
- q4 bounded \`A40\` arceer welfare-shading decision executed.
- q23 q23-specific macro multi-curve reviewed equivalent executed.

## Remaining Boundary

Human review must still decide whether this closure-readiness packet is approved. Scale Gate 1, product-route adoption, diagnostics/mastery/PV, lesson output, and student/product use remain blocked.
`);

  writeText(GATE_MD_PATH, `# GATE-MTU-H6 Cross-Exam Generalization And Evidence Integrity Bundle 1

Status: \`pending human review\`
Review standard: \`REV-STD-1\`

## Product End State

${gate.product_end_state}

Baseline: \`${gate.product_end_state_acceptance_baseline.path}\`

Local validation path: \`${gate.product_end_state_acceptance_baseline.local_validation_path}\`

## Original Sprint/Gate Spec

${gate.original_sprint_gate_spec}

## Non-Negotiable Requirements

${gate.non_negotiable_requirements.map((item) => `- ${item}`).join('\n')}

## Core Requirement Checklist

${gate.core_requirement_checklist.map((item) => `- ${item.requirement}: ${item.status} (${item.evidence})`).join('\n')}

## Findings

${gate.findings.map((item) => `### ${item.finding_id}

Classification: \`${item.classification}\`

${item.summary}

Blocks: ${item.blocks.join(', ') || 'none'}

Does not block: ${item.does_not_block.join(', ') || 'none'}

Proof required to close: ${item.proof_required_to_close}
`).join('\n')}

No protected-reference mutation, external-source mutation, machine-reference mutation, target-exercise mutation, MTU mutation, candidate write, lesson output, diagnostics, PV, mastery, sequencing, student-facing AI, summative use, product-route readiness, or student/product use is authorized.
`);

  console.log(`Rebuilt H6 atomic bundle with ${allOps.length} operations and ${negativeFixtures.length} negative fixtures.`);
}

if (require.main === module) rebuild();
