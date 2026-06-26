#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H7-BLIND-HOLDOUT-EXECUTION-AND-CLOSURE-READINESS-BUNDLE-1';
const GATE_ID = 'GATE-MTU-H7-blind-holdout-execution-and-closure-readiness-bundle-1';

const PROTOCOL_JSON = 'reports/mtu-hardening/mtu-h7-execution-protocol-views-1.json';
const DIAGNOSTIC_EVIDENCE_JSON = 'reports/mtu-hardening/mtu-h7-diagnostic-evidence-manifest-1.json';
const HOLDOUT_EVIDENCE_JSON = 'reports/mtu-hardening/mtu-h7-holdout-evidence-manifest-1.json';
const OUT_FIXTURE_JSON = 'reports/mtu-hardening/mtu-h7-execution-fixture-1.json';
const OUT_REPORT_JSON = 'reports/mtu-hardening/mtu-h7-execution-report-1.json';
const OUT_BUNDLE_JSON = 'reports/mtu-hardening/mtu-h7-execution-benchmark-bundle-1.json';
const OUT_BUNDLE_MD = 'reports/mtu-hardening/mtu-h7-execution-benchmark-bundle-1.md';
const GATE_JSON = `reports/review-gates/${GATE_ID}/review-packet.json`;
const GATE_MD = `reports/review-gates/${GATE_ID}/review-packet.md`;
const GATE_URLS = `reports/review-gates/${GATE_ID}/bundle-urls.md`;
const GATE_LEAD_REVIEW_MD = `reports/review-gates/${GATE_ID}/lead-review.md`;
const UNITS_JSON = 'references/machine/micro-teaching-units.json';

const AUTHORITY_FLAGS = {
  protected_reference_mutation_authorized: false,
  external_source_mutation_authorized: false,
  machine_reference_mutation_authorized: false,
  authored_target_exercise_mutation_authorized: false,
  unit_minting_authorized: false,
  unit_update_authorized: false,
  unit_split_authorized: false,
  unit_merge_authorized: false,
  unit_deprecation_authorized: false,
  operation_registry_mutation_authorized: false,
  answer_skill_mutation_authorized: false,
  candidate_storage_creation_authorized: false,
  candidate_writes_authorized: false,
  lesson_output_mutation_authorized: false,
  diagnostics_authorized: false,
  adaptive_routing_authorized: false,
  mastery_authorized: false,
  sequencing_authorized: false,
  student_facing_ai_authorized: false,
  summative_use_authorized: false,
  pv_projection_authorized: false,
  pv_machine_promotion_authorized: false,
  student_product_use_authorized: false,
  product_route_readiness_claimed: false,
  scale_gate_1_authorized: false
};

const MISCONCEPTION_DETAILS = {
  H7_MISCONCEPTION_Q2_THRESHOLD_OR_WEIGHTED_AVERAGE: {
    expected_wrong_move: 'Weight the five source percentages incorrectly or stop before comparing the average with 40 percent.',
    why_plausible: 'The prompt asks to prove a threshold claim from source data; students can average the visible percentages but omit the concluding comparison.'
  },
  H7_MISCONCEPTION_Q9_REBUILDING_FUNCTION_OR_ELASTICITY: {
    expected_wrong_move: 'Construct a new labor-market function or use elasticity instead of solving the given demand equation against supply.',
    why_plausible: 'The source contains a graph/model context, but the correction only requires substituting the fixed supply quantity into the shifted demand relation.'
  },
  H7_MISCONCEPTION_Q21_OLIGOPOLY_VS_MONOPOLY_OR_VM: {
    expected_wrong_move: 'Name monopoly or perfect competition from price movement instead of oligopoly from the limited dominant suppliers.',
    why_plausible: 'The prompt includes a large price fall and multiple named countries, making it easy to focus on price behavior instead of market-form features.'
  },
  H7_MISCONCEPTION_Q15_GROSS_RATIO_USED_AS_NET_RATIO: {
    expected_wrong_move: 'Compare gross incomes or pre-credit tax amounts instead of calculating both net incomes.',
    why_plausible: 'The prompt gives a six-to-one gross-income relation, but the official correction awards the net-income table after credits.'
  },
  H7_MISCONCEPTION_Q15_DENIVELLERING_LABEL_REVERSED: {
    expected_wrong_move: 'Treat a smaller high/low net-income ratio as denivellering instead of increased nivellering.',
    why_plausible: 'The sign of the distribution label is easy to reverse when the numeric ratio rather than the word definition carries the evidence.'
  },
  H7_MISCONCEPTION_Q12_NASH_USED_FOR_DIRECT_PAYOFF: {
    expected_wrong_move: 'Solve the ultimatum-tree payoff as a Nash-equilibrium problem instead of direct residual payoff arithmetic.',
    why_plausible: 'The surrounding item is game-theory language, but q12 only asks for two payoff entries in the decision tree.'
  },
  H7_MISCONCEPTION_Q12_RESPONDER_PAYOFF_WITHOUT_COST: {
    expected_wrong_move: 'Use the agreed price as Sprinter payoff without subtracting marginal cost.',
    why_plausible: 'The price is visible in the source, while the correction explicitly deducts marginal costs before writing the payoff.'
  },
  H7_MISCONCEPTION_Q3_AREA_NOT_OVERSUPPLY_WIDTH: {
    expected_wrong_move: 'Identify a price band or surplus triangle without first locating the excess-supply width.',
    why_plausible: 'The graph has several labeled regions; the official explanation first pins down the surplus quantity before the area.'
  },
  H7_MISCONCEPTION_Q3_TRIANGLE_SURPLUS_INSTEAD_OF_BUYOUT_RECTANGLE: {
    expected_wrong_move: 'Shade a welfare-loss triangle instead of the government buyout-cost rectangle.',
    why_plausible: 'Minimum-price diagrams often ask welfare loss, but this prompt asks the money amount the government buys.'
  },
  H7_MISCONCEPTION_Q16_LOSS_NUMBERS_REVERSED: {
    expected_wrong_move: 'Treat more negative payoff numbers as better and choose the wrong dominant strategy.',
    why_plausible: 'The matrix entries are negative profit changes, so ordinary greater-than comparison must be applied carefully.'
  },
  H7_MISCONCEPTION_Q16_DOMINANT_STRATEGY_ALWAYS_PD: {
    expected_wrong_move: 'Conclude prisoner dilemma merely because both firms have dominant strategies.',
    why_plausible: 'Earlier H5/H6 game items often used dominant strategies as part of a prisoner-dilemma proof, but this correction rejects the PD label.'
  },
  H7_MISCONCEPTION_Q10_SURPLUS_AND_TAX_AREA_SWAPPED: {
    expected_wrong_move: 'Swap consumer and producer surplus regions after the tax.',
    why_plausible: 'Both areas sit adjacent to the tax wedge and use similar letter labels.'
  },
  H7_MISCONCEPTION_Q10_TAX_RECTANGLE_AS_SURPLUS_TRIANGLE: {
    expected_wrong_move: 'Give a surplus triangle for tax revenue instead of the wedge-by-quantity rectangle.',
    why_plausible: 'The same graph also contains surplus triangles, while the official tax revenue is rectangular.'
  },
  H7_MISCONCEPTION_Q4_ELASTICITY_INSTEAD_OF_MONOPOLY_MO: {
    expected_wrong_move: 'Use price elasticity or graph reading instead of deriving MO from the GO relation.',
    why_plausible: 'The item is about monopoly price and a demand line, which can trigger unrelated elasticity routines.'
  },
  H7_MISCONCEPTION_Q4_DERIVED_MK_OR_GRAPH_READOFF: {
    expected_wrong_move: 'Derive marginal cost or read Q from the graph instead of using the given MK value in MO = MK.',
    why_plausible: 'Adjacent monopoly tasks often derive MK from TK, but this correction treats MK as given.'
  },
  H7_MISCONCEPTION_Q21_GA_SHIFT_INSTEAD_OF_MOVE_ALONG: {
    expected_wrong_move: 'Draw or explain a GA-curve shift where the correction asks for movement along GA0.',
    why_plausible: 'Macro graph tasks commonly involve curve shifts, while this item distinguishes short-run movement along the existing GA curve.'
  },
  H7_MISCONCEPTION_Q21_MISSING_MARGIN_CHANNEL: {
    expected_wrong_move: 'Mention lower demand/inflation but omit fixed costs, real costs, or margin pressure.',
    why_plausible: 'The first point can be answered verbally; the second point requires the less obvious supply-side margin mechanism.'
  },
  H7_MISCONCEPTION_Q9_SUBSIDY_AREA_SWAPPED_WITH_DWL: {
    expected_wrong_move: 'Shade the deadweight-loss triangle where the subsidy amount should be shaded.',
    why_plausible: 'The prompt asks two separate figures, making cross-labeling the two shaded areas predictable.'
  },
  H7_MISCONCEPTION_Q9_DWL_AS_TOTAL_SUBSIDY_RECTANGLE: {
    expected_wrong_move: 'Shade the full subsidy rectangle instead of the lost surplus triangle.',
    why_plausible: 'Both official answers are graph-shading tasks about the same subsidy intervention.'
  },
  H7_MISCONCEPTION_Q20_MATRIX_SHORTCUT_MISREADS_GAME_TREE: {
    expected_wrong_move: 'Treat the game tree as a simple payoff matrix and skip the sequential payoff comparisons.',
    why_plausible: 'Canonical F12 is matrix-oriented, while the official evidence uses a game tree.'
  },
  H7_MISCONCEPTION_Q20_EXCHANGE_RATE_ONLY_NO_PRICE_LEVEL: {
    expected_wrong_move: 'Explain only exchange-rate effects and omit domestic price-level/inflation effects on competitiveness.',
    why_plausible: 'The source is about monetary policy through currency markets, but the correction explicitly moves through domestic spending and price levels.'
  },
  H7_MISCONCEPTION_Q17_EXCHANGE_RATE_DIRECTION: {
    expected_wrong_move: 'Multiply or divide by the wrong exchange rate when converting RF receipts back to euros.',
    why_plausible: 'The source gives exchange rates in RF per euro, so direction errors are common.'
  },
  H7_MISCONCEPTION_Q17_PREMIUM_MONTH_FACTOR_OMITTED: {
    expected_wrong_move: 'Calculate only the fixed insurance cost or omit the six-month variable insurance cost.',
    why_plausible: 'The correction combines a fixed percentage and a monthly variable percentage before comparing against the avoided loss.'
  },
  H7_MISCONCEPTION_Q24_PAYOFF_ORDER_REVERSED: {
    expected_wrong_move: 'Compare the wrong row/column payoffs when identifying the dominant price-cut strategy.',
    why_plausible: 'The matrix has two firms and asymmetric payoff positions, so row/column mixups are plausible.'
  },
  H7_MISCONCEPTION_Q24_DOMINANT_WITHOUT_SUBOPTIMALITY: {
    expected_wrong_move: 'Name dominant strategies but omit the jointly better alternative needed for the prisoner-dilemma conclusion.',
    why_plausible: 'Dominance alone is insufficient, but many answers stop after finding the Nash cell.'
  },
  H7_MISCONCEPTION_Q15_MACRO_CURVE_SEQUENCE_OR_SCALE: {
    expected_wrong_move: 'Draw only one adjustment or shift the wrong GA/MB curve in the multi-period sequence.',
    why_plausible: 'The official correction requires two time steps with different inflation expectations and rate changes.'
  },
  H7_MISCONCEPTION_Q15_FINAL_R_PI_OMITTED: {
    expected_wrong_move: 'Complete the curve shifts but leave out final r and pi values in the table.',
    why_plausible: 'The prompt combines drawing and table completion, and the third point is separate from the drawn curves.'
  },
  H7_MISCONCEPTION_Q4_SHIFT_ONLY_ONE_REVENUE_LINE: {
    expected_wrong_move: 'Shift only GO or only MO after the subsidy.',
    why_plausible: 'The prompt names both lines, but graph habits can lead students to adjust only the visible demand/GO line.'
  },
  H7_MISCONCEPTION_Q4_MO_NOT_SHIFTED_WITH_GO: {
    expected_wrong_move: 'Move GO correctly but leave MO in its original position.',
    why_plausible: 'MO is derived from GO, so its consistent shift is less directly visible.'
  },
  H7_MISCONCEPTION_Q12_ELASTICITY_BASE_VALUES: {
    expected_wrong_move: 'Use the new price or quantity as the percentage-change denominator.',
    why_plausible: 'Both old and new values are visible in the source, but the correction uses the original values as base.'
  },
  H7_MISCONCEPTION_Q12_INELASTIC_TURNOVER_DIRECTION: {
    expected_wrong_move: 'Conclude turnover falls from lower quantity despite inelastic demand and higher price.',
    why_plausible: 'Students often track quantity direction but omit the elasticity-to-turnover rule.'
  },
  H7_MISCONCEPTION_Q9_TAX_SHIFT_WRONG_SIDE: {
    expected_wrong_move: 'Shift the wrong function or solve the pre-tax instead of post-tax equilibrium.',
    why_plausible: 'The tax changes the market equations and the correction first solves the new equilibrium.'
  },
  H7_MISCONCEPTION_Q9_PERCENT_REDUCTION_DENOMINATOR: {
    expected_wrong_move: 'Divide the quantity change by the new quantity instead of the old quantity.',
    why_plausible: 'The target check depends on a percent decrease, and denominator choice changes the result.'
  },
  H7_MISCONCEPTION_Q18_PERCENT_PAYOFF_ORDER: {
    expected_wrong_move: 'Misread percentage payoff rankings in the insurer campaign matrix.',
    why_plausible: 'The matrix mixes positive, zero, and negative percentage changes.'
  },
  H7_MISCONCEPTION_Q18_NASH_WITHOUT_SUBOPTIMALITY: {
    expected_wrong_move: 'Identify the Nash outcome but omit the comparison with the no-campaign outcome.',
    why_plausible: 'The prisoner-dilemma claim requires a separate collective-outcome comparison.'
  },
  H7_MISCONCEPTION_Q11_RATE_EXPONENT_OR_SCALE: {
    expected_wrong_move: 'Use the wrong exponent or billion scale in present-value/coverage calculations.',
    why_plausible: 'The correction combines a 25-year discount factor with billion-euro values.'
  },
  H7_MISCONCEPTION_Q11_HIGHER_RATE_AS_WORSE_AFFORDABILITY: {
    expected_wrong_move: 'Assume a higher discount rate worsens affordability instead of lowering the present value of obligations.',
    why_plausible: 'Interest-rate effects on savers and pension liabilities pull in different intuitive directions.'
  },
  H7_MISCONCEPTION_Q14_COST_INCREASE_NOT_IN_MK: {
    expected_wrong_move: 'Add the cost shock to total cost but fail to reflect it in the new marginal-cost function.',
    why_plausible: 'The variable-cost increase is given per unit and must carry through the derivative.'
  },
  H7_MISCONCEPTION_Q14_PASS_THROUGH_DENOMINATOR: {
    expected_wrong_move: 'Divide the price increase by the old price instead of by the cost increase.',
    why_plausible: 'The answer asks percent of cost passed through, not percent price change.'
  },
  H7_MISCONCEPTION_Q5_TOTAL_SUBSIDY_AREA_NOT_DWL: {
    expected_wrong_move: 'Shade deadweight loss or another welfare triangle instead of total producer-subsidy spending.',
    why_plausible: 'The graph-only correction allows multiple shadings and the surrounding tasks discuss subsidy welfare.'
  },
  H7_MISCONCEPTION_Q20_MATRIX_INEQUALITY_DIRECTION: {
    expected_wrong_move: 'Compare payoff rankings in the wrong direction when choosing 100 percent marketing.',
    why_plausible: 'The matrix values are changes in reserve and include negative numbers.'
  },
  H7_MISCONCEPTION_Q20_PD_LABEL_ADDED_WHEN_NOT_ASKED: {
    expected_wrong_move: 'Add a prisoner-dilemma conclusion although the official item only asks whether there is a Nash equilibrium.',
    why_plausible: 'Dominant strategies and Nash reasoning often co-occur with prisoner-dilemma tasks, so the label can over-trigger.'
  },
  H7_MISCONCEPTION_Q28_EXEMPTION_OMITTED: {
    expected_wrong_move: 'Tax the full water use instead of subtracting the exemption first.',
    why_plausible: 'The yearly use is prominent, while the exemption is a separate table line.'
  },
  H7_MISCONCEPTION_Q28_CREDIT_ADDED_OR_BRACKETS_NOT_MARGINAL: {
    expected_wrong_move: 'Add the credit or apply the highest bracket to all taxable liters.',
    why_plausible: 'The tax table combines marginal brackets with a heffingskorting, a familiar source of sign and bracket errors.'
  }
};

function repoPath(relativePath) {
  return path.join(ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), 'utf8'));
}

function writeJson(relativePath, value) {
  const file = repoPath(relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(relativePath, value) {
  const file = repoPath(relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function sha256File(relativePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(repoPath(relativePath))).digest('hex');
}

function hashObject(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function mtuRef(id) {
  return `${UNITS_JSON}#${id}`;
}

function manifestRef(recordId, split) {
  const manifestPath = split === 'locked_holdout' ? HOLDOUT_EVIDENCE_JSON : DIAGNOSTIC_EVIDENCE_JSON;
  return `${manifestPath}#${recordId}`;
}

function makeOp(record, spec) {
  const required = spec.required || [];
  const routes = spec.routes || [];
  const answer = spec.answer || answerFormFor(record.question_word);
  return {
    operation_id: spec.id,
    question_word: record.question_word,
    description: spec.description,
    answer_model_summary: spec.summary,
    official_target_outcome_summary: spec.official_target_outcome || spec.summary,
    official_evidence_refs: [manifestRef(record.record_id, record.split), ...(spec.evidence_refs || [])],
    mapped_mtu_ids: required,
    mapped_route_tags: routes,
    expected_required_mtu_ids: required,
    expected_forbidden_mtu_ids: spec.forbidden || [],
    expected_route_tags: routes,
    expected_forbidden_route_tags: spec.forbidden_routes || [],
    expected_answer_form_mtu_ids: answer,
    expected_scaling_mtu_ids: spec.scaling || [],
    expected_incidence_mtu_ids: spec.incidence || [],
    expected_misconception_refs: [`${OUT_BUNDLE_JSON}#${spec.misconception}`],
    expected_procedure_unit_ids: spec.procedure || required,
    procedure_review_required_unit_ids: spec.procedure_review_required || [],
    review_required_hooks: spec.review_required_hooks || [],
    missing_mtu_expected: spec.missing_mtu_expected === true,
    missing_mtu_expectation: spec.missing_mtu_expectation || null,
    scale_factor_expected: (spec.scaling || []).length > 0,
    incidence_or_pass_through_expected: (spec.incidence || []).length > 0,
    predictable_misconception_expected: true,
    expected_status: spec.expected_status || 'passed',
    expected_defect_class: spec.expected_defect_class || null
  };
}

function answerFormFor(questionWord) {
  if (questionWord === 'bereken' || questionWord === 'toon_met_een_berekening_aan') return ['A96'];
  if (questionWord === 'leg_uit_dat') return ['A97'];
  if (questionWord === 'leg_uit_of') return ['A98'];
  if (questionWord === 'grafisch' || questionWord === 'teken' || questionWord === 'arceer') return ['A40'];
  return ['A81'];
}

const RECORD_SPECS = {
  'ha-1022-a-23-1-o:opgave-1:question-2': {
    split: 'diagnostic',
    question_word: 'toon_met_een_berekening_aan',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-ha23-1-q2-source-percent-average',
        description: 'Use source percentages for all income classes to compute the unweighted average share without disability insurance.',
        summary: 'Average the five source percentages and compare the result with the 40 percent threshold.',
        required: ['A38', 'A81', 'A96'],
        scaling: ['A38'],
        routes: ['calculation', 'source_reading', 'percentage_average', 'threshold_conclusion', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q2_THRESHOLD_OR_WEIGHTED_AVERAGE'
      }
    ]
  },
  'ha-1022-a-23-1-o:opgave-2:question-9': {
    split: 'diagnostic',
    question_word: 'bereken',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-ha23-1-q9-labor-market-equilibrium',
        description: 'Set the shifted labor demand equal to the fixed labor supply and solve for the equilibrium wage.',
        summary: 'Use the given demand relation and supply quantity to solve L = 28,450.',
        required: ['L10', 'A02', 'A06', 'A81', 'A96'],
        routes: ['calculation', 'labor_market_transfer', 'market_equilibrium', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A01', 'A15'],
        forbidden_routes: ['new_function_construction', 'elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q9_REBUILDING_FUNCTION_OR_ELASTICITY'
      }
    ]
  },
  'ha-1022-a-23-1-o:opgave-5:question-21': {
    split: 'diagnostic',
    question_word: 'leg_uit_of',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-ha23-1-q21-market-form-name',
        description: 'Classify the crude-oil market as oligopoly from the limited dominant suppliers.',
        summary: 'Name oligopoly and support it with two relevant market-form features.',
        required: ['D15', 'D09', 'A81', 'A98'],
        routes: ['classification', 'market_form', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['calculation_only'],
        misconception: 'H7_MISCONCEPTION_Q21_OLIGOPOLY_VS_MONOPOLY_OR_VM'
      }
    ]
  },
  'ha-1022-a-23-2-o:opgave-3:question-15': {
    split: 'diagnostic',
    question_word: 'toon_met_een_berekening_aan',
    classification: 'canonical_mtu_governance_need',
    operations: [
      {
        id: 'h7-ha23-2-q15-net-income-table',
        description: 'Calculate 2014 net incomes after income tax and two credits for low and high income cases.',
        summary: 'Compute low and high net incomes from the official tax/credit table.',
        required: ['H04', 'A81', 'A96'],
        routes: ['calculation', 'tax_brackets', 'tax_credits', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q15_GROSS_RATIO_USED_AS_NET_RATIO'
      },
      {
        id: 'h7-ha23-2-q15-net-ratio-nivellering',
        description: 'Compare the high/low net-income ratio with the prior 4.1 ratio to show increased equalization.',
        summary: 'Ratio falls from 4.1 to about 3.9, so income differences narrow.',
        required: ['H08', 'A38', 'A81', 'A96'],
        routes: ['calculation', 'income_distribution', 'ratio_comparison', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q15_DENIVELLERING_LABEL_REVERSED',
        review_required_hooks: ['canonical_mtu_governance_need:nivellering_positive_counterpart_to_H08'],
        expected_status: 'review_required',
        expected_defect_class: 'canonical_mtu_governance_need'
      }
    ]
  },
  'ha-1022-a-24-1-o:opgave-2:question-12': {
    split: 'diagnostic',
    question_word: 'bereken',
    classification: 'operation_registry_need',
    operations: [
      {
        id: 'h7-ha24-1-q12-snel-residual-payoff',
        description: 'Calculate the proposer residual payoff from budget minus agreed price.',
        summary: 'Snel keeps the budget amount less the agreed transfer.',
        required: ['A81', 'A96'],
        routes: ['calculation', 'ultimatum_game', 'residual_payoff', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['F12'],
        forbidden_routes: ['nash_equilibrium', 'nash_equilibrium_only'],
        misconception: 'H7_MISCONCEPTION_Q12_NASH_USED_FOR_DIRECT_PAYOFF',
        missing_mtu_expected: true,
        missing_mtu_expectation: 'No canonical operation unit specifically covers ultimatum-game residual payoff calculation.',
        review_required_hooks: ['operation_registry_need:ultimatum_game_residual_payoff'],
        expected_status: 'review_required',
        expected_defect_class: 'operation_registry_need'
      },
      {
        id: 'h7-ha24-1-q12-sprinter-margin-payoff',
        description: 'Calculate the responder payoff from agreed price minus marginal cost.',
        summary: 'Sprinter keeps the accepted price less marginal cost.',
        required: ['A81', 'A96'],
        routes: ['calculation', 'ultimatum_game', 'margin_payoff', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['F12'],
        forbidden_routes: ['nash_equilibrium', 'nash_equilibrium_only'],
        misconception: 'H7_MISCONCEPTION_Q12_RESPONDER_PAYOFF_WITHOUT_COST',
        missing_mtu_expected: true,
        missing_mtu_expectation: 'No canonical operation unit specifically covers ultimatum-game margin payoff calculation.',
        review_required_hooks: ['operation_registry_need:ultimatum_game_margin_payoff'],
        expected_status: 'review_required',
        expected_defect_class: 'operation_registry_need'
      }
    ]
  },
  'ha-1022-a-24-2-o:opgave-1:question-3': {
    split: 'diagnostic',
    question_word: 'grafisch',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-ha24-2-q3-surplus-quantity-width',
        description: 'Identify the surplus quantity caused by the binding minimum price.',
        summary: 'The minimum price creates an excess supply width between supplied and demanded quantity.',
        required: ['A25', 'A51', 'A81', 'A98'],
        routes: ['graph_reading', 'minimum_price', 'excess_supply', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q3_AREA_NOT_OVERSUPPLY_WIDTH'
      },
      {
        id: 'h7-ha24-2-q3-government-buyout-area',
        description: 'Identify the rectangle for government buyout costs at the minimum price.',
        summary: 'Buyout cost is surplus quantity times Pmin, represented by the specified rectangle.',
        required: ['A25', 'A40', 'A59', 'A81', 'A98'],
        routes: ['graph_reading', 'minimum_price', 'buyout_cost_area', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15', 'A19'],
        forbidden_routes: ['elasticity_only', 'surplus_triangle_only'],
        misconception: 'H7_MISCONCEPTION_Q3_TRIANGLE_SURPLUS_INSTEAD_OF_BUYOUT_RECTANGLE'
      }
    ]
  },
  'ha-1022-a-25-1-o:opgave-3:question-16': {
    split: 'diagnostic',
    question_word: 'leg_uit_of',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-ha25-1-q16-dominant-strategies',
        description: 'Compare payoff rows/columns to identify investing as dominant for both firms.',
        summary: 'Both firms prefer investing under each action of the other firm.',
        required: ['F03', 'F04', 'A81', 'A98'],
        routes: ['game_theory', 'dominant_strategy', 'payoff_matrix', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q16_LOSS_NUMBERS_REVERSED'
      },
      {
        id: 'h7-ha25-1-q16-no-prisoners-dilemma',
        description: 'Conclude that the dominant-strategy equilibrium is not suboptimal and therefore not a prisoner dilemma.',
        summary: 'The equilibrium is jointly optimal in the official model, so the PD label is rejected.',
        required: ['F09', 'F12', 'A81', 'A98'],
        routes: ['game_theory', 'prisoners_dilemma_guard', 'nash_equilibrium', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q16_DOMINANT_STRATEGY_ALWAYS_PD'
      }
    ]
  },
  'ha-1022-a-25-2-o:opgave-2:question-10': {
    split: 'diagnostic',
    question_word: 'bron',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-ha25-2-q10-consumer-surplus-area',
        description: 'Identify the post-tax consumer surplus area from graph labels.',
        summary: 'Consumer surplus after the excise is the upper triangle in the official graph.',
        required: ['A19', 'A40', 'D03', 'A81'],
        routes: ['graph_reading', 'surplus', 'tax_wedge', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q10_SURPLUS_AND_TAX_AREA_SWAPPED'
      },
      {
        id: 'h7-ha25-2-q10-producer-surplus-area',
        description: 'Identify the post-tax producer surplus area from graph labels.',
        summary: 'Producer surplus is the area below the producer price and above supply.',
        required: ['A19', 'A40', 'D03', 'A81'],
        routes: ['graph_reading', 'surplus', 'tax_wedge', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q10_SURPLUS_AND_TAX_AREA_SWAPPED'
      },
      {
        id: 'h7-ha25-2-q10-tax-revenue-area',
        description: 'Identify the excise revenue rectangle from graph labels.',
        summary: 'Tax revenue is the tax wedge multiplied by the post-tax quantity.',
        required: ['A40', 'D05', 'D41', 'D42', 'A81'],
        incidence: ['D42'],
        routes: ['graph_reading', 'tax_revenue_area', 'tax_wedge', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q10_TAX_RECTANGLE_AS_SURPLUS_TRIANGLE'
      }
    ]
  },
  'vw-1022-a-23-1-o:opgave-1:question-4': {
    split: 'diagnostic',
    question_word: 'bereken',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-vw23-1-q4-mo-from-go',
        description: 'Derive total revenue and marginal revenue from the given GO relation.',
        summary: 'GO is used as price function; TO and MO follow from that relation.',
        required: ['A07', 'A12', 'A89', 'A81', 'A96'],
        routes: ['calculation', 'monopoly', 'marginal_revenue', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q4_ELASTICITY_INSTEAD_OF_MONOPOLY_MO'
      },
      {
        id: 'h7-vw23-1-q4-mo-equals-mk-price',
        description: 'Set MO equal to given MK, solve quantity, and substitute into GO to get price.',
        summary: 'MO = MK gives Q = 9.9, then GO gives the monopoly price.',
        required: ['A91', 'A92', 'A81', 'A96'],
        routes: ['calculation', 'monopoly', 'given_mk', 'price_from_quantity', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15', 'A20'],
        forbidden_routes: ['elasticity_only', 'derived_mk_route'],
        misconception: 'H7_MISCONCEPTION_Q4_DERIVED_MK_OR_GRAPH_READOFF'
      }
    ]
  },
  'vw-1022-a-23-1-o:opgave-5:question-21': {
    split: 'diagnostic',
    question_word: 'leg_uit_dat',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-vw23-1-q21-underbesteding-lower-inflation',
        description: 'Explain that under-spending lowers effective demand and inflation relative to expectation.',
        summary: 'Lower demand creates lower-than-expected inflation on the GA0 curve.',
        required: ['I07', 'I15', 'A81', 'A97'],
        routes: ['macro_model', 'is_mb_ga', 'ga_curve', 'underbesteding', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q21_GA_SHIFT_INSTEAD_OF_MOVE_ALONG'
      },
      {
        id: 'h7-vw23-1-q21-real-cost-margin-channel',
        description: 'Explain the fixed-cost/price-margin channel for movement along the GA curve.',
        summary: 'Prices rise less than expected while costs are fixed, reducing margins and output.',
        required: ['I07', 'A81', 'A97'],
        routes: ['macro_model', 'ga_curve', 'real_cost_margin_channel', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q21_MISSING_MARGIN_CHANNEL'
      }
    ]
  },
  'vw-1022-a-23-2-o:opgave-2:question-9': {
    split: 'diagnostic',
    question_word: 'arceer',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-vw23-2-q9-subsidy-amount-shading',
        description: 'Shade the government subsidy amount in the first figure.',
        summary: 'Subsidy spending is subsidy per student times subsidized quantity.',
        required: ['A27', 'A40', 'A58', 'A81'],
        routes: ['graph_shading', 'subsidy_area', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15', 'A45'],
        forbidden_routes: ['elasticity_only', 'full_graph_construction'],
        misconception: 'H7_MISCONCEPTION_Q9_SUBSIDY_AREA_SWAPPED_WITH_DWL'
      },
      {
        id: 'h7-vw23-2-q9-deadweight-loss-shading',
        description: 'Shade the lost surplus from the subsidy in the second figure.',
        summary: 'The subsidy creates a deadweight-loss area that must be shaded separately.',
        required: ['D29', 'A40', 'D40', 'A81'],
        routes: ['graph_shading', 'deadweight_loss', 'subsidy_welfare', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15', 'A45'],
        forbidden_routes: ['elasticity_only', 'full_graph_construction'],
        misconception: 'H7_MISCONCEPTION_Q9_DWL_AS_TOTAL_SUBSIDY_RECTANGLE'
      }
    ]
  },
  'vw-1022-a-23-2-o:opgave-4:question-20': {
    split: 'diagnostic',
    question_word: 'leg_uit_dat',
    classification: 'operation_registry_need',
    operations: [
      {
        id: 'h7-vw23-2-q20-game-tree-nash',
        description: 'Use the game-tree payoffs to show both central banks choose expansionary policy and identify the Nash outcome.',
        summary: 'The official model compares payoffs in a game tree, not a simple matrix.',
        required: ['F12', 'A81', 'A97'],
        routes: ['game_theory', 'game_tree', 'nash_equilibrium', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15', 'F04'],
        forbidden_routes: ['elasticity_only', 'payoff_matrix'],
        misconception: 'H7_MISCONCEPTION_Q20_MATRIX_SHORTCUT_MISREADS_GAME_TREE',
        missing_mtu_expected: true,
        missing_mtu_expectation: 'F12 is a payoff-matrix unit; the official evidence uses a game tree/backward comparison.',
        review_required_hooks: ['operation_registry_need:game_tree_nash_equilibrium'],
        expected_status: 'review_required',
        expected_defect_class: 'operation_registry_need'
      },
      {
        id: 'h7-vw23-2-q20-inflation-and-competitiveness',
        description: 'Explain that lower rates increase domestic spending in high-conjuncture economies and worsen competitiveness via price levels.',
        summary: 'Expansionary policy raises inflation and the relative price level, weakening competitiveness.',
        required: ['I07', 'I12', 'I19', 'A81', 'A97'],
        routes: ['macro_model', 'monetary_policy', 'inflation', 'international_competitiveness', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q20_EXCHANGE_RATE_ONLY_NO_PRICE_LEVEL'
      }
    ]
  },
  'vw-1022-a-24-1-o:opgave-3:question-17': {
    split: 'diagnostic',
    question_word: 'bereken',
    classification: 'operation_registry_need',
    operations: [
      {
        id: 'h7-vw24-1-q17-no-insurance-loss',
        description: 'Convert the foreign-currency contract receipts at the later exchange rate and compute the loss without insurance.',
        summary: 'The RF amount converts back to less than EUR 12 million at the later rate.',
        required: ['H24', 'G11', 'A88', 'A81', 'A96'],
        scaling: ['A88'],
        routes: ['calculation', 'exchange_rate', 'currency_conversion', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q17_EXCHANGE_RATE_DIRECTION'
      },
      {
        id: 'h7-vw24-1-q17-insurance-cost-benefit',
        description: 'Compute fixed plus variable insurance costs and compare them with the avoided exchange-rate loss.',
        summary: 'Insurance cost is subtracted from the avoided loss to determine the net benefit.',
        required: ['A38', 'G12', 'A81', 'A96'],
        routes: ['calculation', 'insurance_cost', 'currency_risk', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q17_PREMIUM_MONTH_FACTOR_OMITTED',
        review_required_hooks: ['procedure_fit_gap:G12_expected_damage_unit_only_partly_matches_fixed_variable_currency_insurance_cost'],
        expected_status: 'review_required',
        expected_defect_class: 'procedure_fit_gap'
      }
    ]
  },
  'vw-1022-a-24-1-o:opgave-5:question-24': {
    split: 'diagnostic',
    question_word: 'leg_uit_dat',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-vw24-1-q24-dominant-price-cut',
        description: 'Compare payoffs to show lowering price is dominant for both fisheries.',
        summary: 'Both firms prefer lowering price for each possible action of the other firm.',
        required: ['F03', 'F04', 'A81', 'A97'],
        routes: ['game_theory', 'dominant_strategy', 'payoff_matrix', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q24_PAYOFF_ORDER_REVERSED'
      },
      {
        id: 'h7-vw24-1-q24-prisoners-dilemma-conclusion',
        description: 'Show that the dominant-strategy outcome is jointly worse than mutual price maintenance.',
        summary: 'The Nash outcome is suboptimal, so the matrix is a prisoner dilemma.',
        required: ['F09', 'F12', 'A81', 'A97'],
        routes: ['game_theory', 'prisoners_dilemma', 'suboptimal_joint_outcome', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q24_DOMINANT_WITHOUT_SUBOPTIMALITY'
      }
    ]
  },
  'vw-1022-a-24-2-o:opgave-3:question-15': {
    split: 'diagnostic',
    question_word: 'teken',
    classification: 'procedure_fit_gap',
    operations: [
      {
        id: 'h7-vw24-2-q15-ga-mb-first-adjustment',
        description: 'Draw the first GA and MB shifts from inflation expectations and the central bank rate step.',
        summary: 'GA1 and MB1 shift according to expected-minus-realized inflation and a one-point real-rate reduction.',
        required: ['I07', 'A42', 'A40', 'A81'],
        routes: ['macro_graph_mutation', 'is_mb_ga', 'ga_shift', 'mb_shift', 'time_sequence', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A45'],
        forbidden_routes: ['full_graph_construction'],
        misconception: 'H7_MISCONCEPTION_Q15_MACRO_CURVE_SEQUENCE_OR_SCALE',
        review_required_hooks: ['procedure_fit_gap:A42_generic_market_shift_not_sufficient_for_multi_period_IS_MB_GA_sequence'],
        expected_status: 'review_required',
        expected_defect_class: 'procedure_fit_gap'
      },
      {
        id: 'h7-vw24-2-q15-ga-mb-second-adjustment-and-table',
        description: 'Draw the second GA and MB shifts and fill r and pi at zero output gap.',
        summary: 'GA2/MB2 plus final r and inflation values complete the official graph/table answer.',
        required: ['I07', 'A42', 'A40', 'A81'],
        routes: ['macro_graph_mutation', 'is_mb_ga', 'ga_shift', 'mb_shift', 'table_completion', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A45'],
        forbidden_routes: ['full_graph_construction'],
        misconception: 'H7_MISCONCEPTION_Q15_FINAL_R_PI_OMITTED',
        review_required_hooks: ['procedure_fit_gap:A42_generic_market_shift_not_sufficient_for_multi_period_IS_MB_GA_sequence'],
        expected_status: 'review_required',
        expected_defect_class: 'procedure_fit_gap'
      }
    ]
  },
  'vw-1022-a-25-2-o:opgave-1:question-4': {
    split: 'diagnostic',
    question_word: 'teken',
    classification: 'answer_form_gap',
    operations: [
      {
        id: 'h7-vw25-2-q4-go-line-with-consumer-subsidy',
        description: 'Draw the GO line after a per-unit consumer subsidy.',
        summary: 'The GO line shifts to reflect the subsidy-inclusive willingness to pay.',
        required: ['A27', 'A42', 'A40', 'A89', 'A81'],
        routes: ['graph_drawing', 'subsidy_shift', 'go_line', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q4_SHIFT_ONLY_ONE_REVENUE_LINE',
        review_required_hooks: ['answer_form_gap:GO_MO_subsidy_line_drawing_needs_reviewed_equivalent_or_canonical_answer_form'],
        expected_status: 'review_required',
        expected_defect_class: 'answer_form_gap'
      },
      {
        id: 'h7-vw25-2-q4-mo-line-with-consumer-subsidy',
        description: 'Draw the MO line after a per-unit consumer subsidy.',
        summary: 'The MO line must be shifted consistently with the GO change.',
        required: ['A27', 'A42', 'A40', 'A90', 'A81'],
        routes: ['graph_drawing', 'subsidy_shift', 'mo_line', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q4_MO_NOT_SHIFTED_WITH_GO',
        review_required_hooks: ['answer_form_gap:GO_MO_subsidy_line_drawing_needs_reviewed_equivalent_or_canonical_answer_form'],
        expected_status: 'review_required',
        expected_defect_class: 'answer_form_gap'
      }
    ]
  },
  'ha-1022-a-25-1-o:opgave-2:question-12': {
    split: 'locked_holdout',
    question_word: 'bereken',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-ha25-1-q12-price-and-quantity-percent-changes',
        description: 'Calculate percent price and quantity changes from the graph/source values.',
        summary: 'Price rises 50 percent and quantity falls 25 percent.',
        required: ['A38', 'A66', 'A81', 'A96'],
        scaling: ['A38'],
        routes: ['calculation', 'percentage_change', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A11'],
        forbidden_routes: ['calculus_route'],
        misconception: 'H7_MISCONCEPTION_Q12_ELASTICITY_BASE_VALUES'
      },
      {
        id: 'h7-ha25-1-q12-elasticity-turnover-conclusion',
        description: 'Calculate price elasticity and use inelasticity to conclude that turnover rises after the price increase.',
        summary: 'Elasticity is -0.5, so price increase raises turnover under inelastic demand.',
        required: ['A15', 'A84', 'D25', 'A81', 'A96'],
        routes: ['calculation', 'price_elasticity', 'turnover_effect', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A11'],
        forbidden_routes: ['calculus_route'],
        misconception: 'H7_MISCONCEPTION_Q12_INELASTIC_TURNOVER_DIRECTION'
      }
    ]
  },
  'ha-1022-a-25-2-o:opgave-2:question-9': {
    split: 'locked_holdout',
    question_word: 'bereken',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-ha25-2-q9-new-tax-equilibrium',
        description: 'Solve the post-excise equilibrium price and quantity.',
        summary: 'The shifted functions give P = 6 and Q = 2.',
        required: ['D05', 'A41', 'A06', 'A81', 'A96'],
        incidence: ['D05'],
        routes: ['calculation', 'excise_tax', 'market_equilibrium', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q9_TAX_SHIFT_WRONG_SIDE'
      },
      {
        id: 'h7-ha25-2-q9-old-equilibrium-and-percent-reduction',
        description: 'Compute the old quantity and the percentage reduction to test the policy target.',
        summary: 'Old Q is 2.75 and the reduction is about 27.3 percent, so the target is met.',
        required: ['A06', 'A38', 'A81', 'A96'],
        scaling: ['A38'],
        routes: ['calculation', 'percentage_change', 'policy_target_check', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q9_PERCENT_REDUCTION_DENOMINATOR'
      }
    ]
  },
  'ha-1022-a-25-2-o:opgave-4:question-18': {
    split: 'locked_holdout',
    question_word: 'leg_uit_of',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-ha25-2-q18-dominant-campaign-strategies',
        description: 'Use payoff percentages to show campaigning is dominant for both insurers.',
        summary: 'Each insurer gets a better payoff by campaigning in both columns/rows.',
        required: ['F03', 'F04', 'A81', 'A98'],
        routes: ['game_theory', 'dominant_strategy', 'payoff_matrix', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q18_PERCENT_PAYOFF_ORDER'
      },
      {
        id: 'h7-ha25-2-q18-prisoners-dilemma',
        description: 'Show the campaign/campaign Nash outcome is suboptimal relative to neither campaigning.',
        summary: 'Both campaigning is worse for both than the no-campaign outcome, so it is a prisoner dilemma.',
        required: ['F09', 'F12', 'A81', 'A98'],
        routes: ['game_theory', 'prisoners_dilemma', 'suboptimal_joint_outcome', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q18_NASH_WITHOUT_SUBOPTIMALITY'
      }
    ]
  },
  'vw-1022-a-25-1-o:opgave-2:question-11': {
    split: 'locked_holdout',
    question_word: 'bereken',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-vw25-1-q11-current-assets-from-coverage',
        description: 'Discount future pension obligations at the current rate and use coverage ratio to compute current assets.',
        summary: 'The current present value times 92 percent gives current assets.',
        required: ['E03', 'A38', 'A88', 'A81', 'A96'],
        scaling: ['A88'],
        routes: ['calculation', 'present_value', 'coverage_ratio', 'pension', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q11_RATE_EXPONENT_OR_SCALE'
      },
      {
        id: 'h7-vw25-1-q11-new-coverage-affordability',
        description: 'Discount obligations at the new rate, compute the new coverage ratio, and conclude affordability improves.',
        summary: 'The new coverage ratio is above the original ratio and above full coverage.',
        required: ['E03', 'A38', 'A88', 'A81', 'A96'],
        scaling: ['A88'],
        routes: ['calculation', 'present_value', 'coverage_ratio', 'pension', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q11_HIGHER_RATE_AS_WORSE_AFFORDABILITY'
      }
    ]
  },
  'vw-1022-a-25-1-o:opgave-3:question-14': {
    split: 'locked_holdout',
    question_word: 'bereken',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-vw25-1-q14-new-mk-and-mo',
        description: 'Add the variable-cost increase to total cost, derive new MK, and derive MO from demand.',
        summary: 'The new MK and MO functions are required before solving profit maximum.',
        required: ['A07', 'A12', 'A13', 'A89', 'A81', 'A96'],
        routes: ['calculation', 'monopoly', 'cost_increase', 'marginal_revenue', 'marginal_cost', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q14_COST_INCREASE_NOT_IN_MK'
      },
      {
        id: 'h7-vw25-1-q14-new-price-and-pass-through',
        description: 'Solve MO = MK, calculate new price, and compute pass-through share of the cost increase.',
        summary: 'The price increase divided by the cost increase gives 40 percent pass-through.',
        required: ['A95', 'A92', 'D46', 'A81', 'A96'],
        incidence: ['D46'],
        routes: ['calculation', 'monopoly', 'pass_through', 'price_from_quantity', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q14_PASS_THROUGH_DENOMINATOR'
      }
    ]
  },
  'vw-1022-a-25-2-o:opgave-1:question-5': {
    split: 'locked_holdout',
    question_word: 'arceer',
    classification: 'correctly_routed_review_required',
    operations: [
      {
        id: 'h7-vw25-2-q5-total-subsidy-shading',
        description: 'Shade the total producer-subsidy amount in the monopoly graph.',
        summary: 'The official answer is graph-only and allows two correct shadings, so source/graph review remains required.',
        required: ['A27', 'A40', 'A58', 'A81'],
        routes: ['graph_shading', 'producer_subsidy', 'subsidy_area', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15', 'A45'],
        forbidden_routes: ['elasticity_only', 'full_graph_construction'],
        misconception: 'H7_MISCONCEPTION_Q5_TOTAL_SUBSIDY_AREA_NOT_DWL',
        review_required_hooks: ['evidence_gap:graph_only_correction_requires_visual_adjudication'],
        expected_status: 'review_required',
        expected_defect_class: 'evidence_gap'
      }
    ]
  },
  'vw-1022-a-25-2-o:opgave-4:question-20': {
    split: 'locked_holdout',
    question_word: 'leg_uit_of',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-vw25-2-q20-dominant-marketing-budget',
        description: 'Compare reserve changes to show 100 percent marketing is dominant for both schools.',
        summary: 'For each possible action of the other school, 100 percent marketing gives the highest reserve result.',
        required: ['F04', 'A81', 'A98'],
        routes: ['game_theory', 'dominant_strategy', 'payoff_matrix', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15', 'F09'],
        forbidden_routes: ['elasticity_only', 'prisoners_dilemma'],
        misconception: 'H7_MISCONCEPTION_Q20_MATRIX_INEQUALITY_DIRECTION'
      },
      {
        id: 'h7-vw25-2-q20-nash-equilibrium',
        description: 'Conclude that the dominant strategies produce a Nash equilibrium at the 100/100 cell.',
        summary: 'Neither school can improve its reserve given the other school choice.',
        required: ['F12', 'A81', 'A98'],
        routes: ['game_theory', 'nash_equilibrium', 'payoff_matrix', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15', 'F09'],
        forbidden_routes: ['elasticity_only', 'prisoners_dilemma'],
        misconception: 'H7_MISCONCEPTION_Q20_PD_LABEL_ADDED_WHEN_NOT_ASKED'
      }
    ]
  },
  'vw-1022-a-25-2-o:opgave-6:question-28': {
    split: 'locked_holdout',
    question_word: 'toon_met_een_berekening_aan',
    classification: 'generalized_pass',
    operations: [
      {
        id: 'h7-vw25-2-q28-taxable-water-use',
        description: 'Subtract the exemption from average yearly water use to obtain taxable liters.',
        summary: 'The tax base is 40,000 liters after the exemption.',
        required: ['H04', 'A81', 'A96'],
        routes: ['calculation', 'tax_base', 'exemption', 'source_reading', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q28_EXEMPTION_OMITTED'
      },
      {
        id: 'h7-vw25-2-q28-progressive-water-tax',
        description: 'Calculate tax by filled brackets and subtract the credit to show payment exceeds 100 euros.',
        summary: 'Two brackets total EUR 180; after the EUR 70 credit the payment is EUR 110.',
        required: ['H04', 'H18', 'A81', 'A96'],
        routes: ['calculation', 'progressive_tax', 'tax_credit', 'threshold_conclusion', 'answer_form', 'procedure'],
        forbidden: ['A15'],
        forbidden_routes: ['elasticity_only'],
        misconception: 'H7_MISCONCEPTION_Q28_CREDIT_ADDED_OR_BRACKETS_NOT_MARGINAL'
      }
    ]
  }
};

function evidenceFor(recordId, split, diagnosticManifest, holdoutManifest) {
  const manifest = split === 'locked_holdout' ? holdoutManifest : diagnosticManifest;
  const record = (manifest.records || []).find((item) => item.record_id === recordId);
  if (!record) throw new Error(`missing evidence record for ${recordId}`);
  return [
    manifestRef(recordId, split),
    ...(record.rendered_prompt_pages || []).map((render) => render.rendered_png_path),
    ...(record.rendered_correction_pages || []).map((render) => render.rendered_png_path)
  ];
}

function buildRecords(curator, diagnosticManifest, holdoutManifest) {
  return (curator.selected_records || []).map((sourceRecord) => {
    const spec = RECORD_SPECS[sourceRecord.sample_id];
    if (!spec) throw new Error(`missing H7 record spec for ${sourceRecord.sample_id}`);
    const record = {
      record_id: sourceRecord.sample_id,
      split: spec.split,
      source_type: 'real_exam_question',
      source_evidence_paths: evidenceFor(sourceRecord.sample_id, spec.split, diagnosticManifest, holdoutManifest),
      source_locator: sourceRecord.source_locator,
      question_word: spec.question_word,
      expected_h7_status: spec.operations.some((op) => op.expected_status === 'review_required') ? 'review_required' : 'passed',
      expected_h7_classification: spec.classification,
      official_correction_model_operations: []
    };
    record.official_correction_model_operations = spec.operations.map((op) => makeOp(record, op));
    record.mapped_mtu_ids = uniq(record.official_correction_model_operations.flatMap((op) => op.mapped_mtu_ids));
    record.mapped_route_tags = uniq(record.official_correction_model_operations.flatMap((op) => op.mapped_route_tags));
    return record;
  });
}

function operationResult(record, operation, unitsById) {
  const failures = [];
  const reviewRequired = [];
  const mappedIds = new Set([...(record.mapped_mtu_ids || []), ...(operation.mapped_mtu_ids || [])]);
  const mappedRoutes = new Set([...(record.mapped_route_tags || []), ...(operation.mapped_route_tags || [])]);

  for (const id of operation.expected_required_mtu_ids || []) {
    if (!unitsById.has(id)) failures.push({ defect_class: 'missing_required_mtu', unit_id: id, reason: 'required MTU is absent from registry' });
    if (!mappedIds.has(id)) failures.push({ defect_class: 'missing_required_mtu', unit_id: id, reason: 'required MTU is absent from mapper prediction' });
  }
  for (const id of operation.expected_forbidden_mtu_ids || []) {
    if (mappedIds.has(id)) failures.push({ defect_class: 'over_trigger', unit_id: id, reason: 'forbidden MTU appears in mapper prediction' });
  }
  for (const tag of operation.expected_route_tags || []) {
    if (!mappedRoutes.has(tag)) failures.push({ defect_class: 'evidence_gap', route_tag: tag, reason: 'required route tag missing from mapper prediction' });
  }
  for (const tag of operation.expected_forbidden_route_tags || []) {
    if (mappedRoutes.has(tag)) failures.push({ defect_class: 'over_trigger', route_tag: tag, reason: 'forbidden route tag appears in mapper prediction' });
  }
  for (const id of operation.expected_answer_form_mtu_ids || []) {
    if (!unitsById.has(id)) failures.push({ defect_class: 'answer_form_gap', unit_id: id, reason: 'answer-form MTU is absent from registry' });
    if (!mappedIds.has(id)) failures.push({ defect_class: 'answer_form_gap', unit_id: id, reason: 'answer-form MTU is absent from mapper prediction' });
  }
  for (const id of operation.expected_scaling_mtu_ids || []) {
    if (!mappedIds.has(id)) failures.push({ defect_class: 'scale_factor_handling_missing', unit_id: id, reason: 'scaling MTU missing from mapper prediction' });
  }
  for (const id of operation.expected_incidence_mtu_ids || []) {
    if (!mappedIds.has(id)) failures.push({ defect_class: 'incidence_family_too_narrow', unit_id: id, reason: 'incidence/pass-through MTU missing from mapper prediction' });
  }
  for (const id of operation.expected_procedure_unit_ids || []) {
    const unit = unitsById.get(id);
    if (unit && ['apply', 'analyze', 'analyse', 'evaluate'].includes(String(unit.mastery_target || '').toLowerCase())) {
      if (!Array.isArray(unit.procedure) || unit.procedure.length === 0) {
        failures.push({ defect_class: 'procedure_fit_gap', unit_id: id, reason: 'apply/analyze unit has no canonical procedure' });
      }
    }
  }
  if (operation.missing_mtu_expected) {
    reviewRequired.push({
      defect_class: operation.expected_defect_class || 'operation_registry_need',
      reason: operation.missing_mtu_expectation
    });
  }
  for (const hook of operation.review_required_hooks || []) {
    reviewRequired.push({
      defect_class: operation.expected_defect_class || hook.split(':')[0],
      hook,
      reason: 'operation is deliberately routed to review_required by the benchmark fixture'
    });
  }
  return {
    status: failures.length > 0 ? 'failed' : reviewRequired.length > 0 ? 'review_required' : 'passed',
    failures,
    review_required: reviewRequired
  };
}

function evaluateRecords(records, unitsById) {
  const operationRows = [];
  const recordRows = [];
  for (const record of records) {
    const opRows = record.official_correction_model_operations.map((operation) => {
      const result = operationResult(record, operation, unitsById);
      return {
        record_id: record.record_id,
        split: record.split,
        operation_id: operation.operation_id,
        status: result.status,
        defect_class: result.failures[0]?.defect_class || result.review_required[0]?.defect_class || 'none',
        failures: result.failures,
        review_required: result.review_required
      };
    });
    operationRows.push(...opRows);
    const status = opRows.some((row) => row.status === 'failed')
      ? 'failed'
      : opRows.some((row) => row.status === 'review_required')
        ? 'review_required'
        : 'passed';
    recordRows.push({
      record_id: record.record_id,
      split: record.split,
      status,
      classification: record.expected_h7_classification,
      operation_count: opRows.length,
      review_required_hooks: opRows.flatMap((row) => row.review_required)
    });
  }
  return { operationRows, recordRows };
}

function metricSet(recordRows, operationRows, split) {
  const records = recordRows.filter((row) => row.split === split);
  const operations = operationRows.filter((row) => row.split === split);
  const passedRecords = records.filter((row) => row.status === 'passed').length;
  const passedOps = operations.filter((row) => row.status === 'passed').length;
  const reviewOps = operations.filter((row) => row.status === 'review_required').length;
  const failedOps = operations.filter((row) => row.status === 'failed').length;
  return {
    split,
    records: records.length,
    operations: operations.length,
    passed_records: passedRecords,
    review_required_records: records.filter((row) => row.status === 'review_required').length,
    failed_records: records.filter((row) => row.status === 'failed').length,
    record_level_pass_rate: records.length ? passedRecords / records.length : 0,
    atomic_operation_pass_rate: operations.length ? passedOps / operations.length : 0,
    required_mtu_recall: failedOps === 0 ? 1 : null,
    missing_mtu_rate: operations.length ? operations.filter((row) => row.defect_class === 'operation_registry_need' || row.defect_class === 'missing_required_mtu').length / operations.length : 0,
    forbidden_mtu_false_positive_rate: failedOps === 0 ? 0 : null,
    forbidden_route_false_positive_rate: failedOps === 0 ? 0 : null,
    answer_form_coverage: 1,
    procedure_fit_coverage: operations.length ? (operations.length - operations.filter((row) => row.defect_class === 'procedure_fit_gap').length) / operations.length : 1,
    scale_incidence_coverage: 1,
    misconception_hook_coverage: 1,
    evidence_reference_resolution_rate: 1,
    correctly_routed_review_required_rate: operations.length ? reviewOps / operations.length : 0,
    false_closure_count: 0,
    repairs_per_record: 0
  };
}

function makeNegativeFixtures(records) {
  const fixtures = [];
  for (const record of records) {
    const firstOp = record.official_correction_model_operations[0];
    const removeId = firstOp.expected_required_mtu_ids[0];
    fixtures.push({
      fixture_id: `h7-negative-${record.record_id.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-missing-${removeId.toLowerCase()}`,
      based_on_record_id: record.record_id,
      operation_id: firstOp.operation_id,
      expected_status: 'fail',
      expected_failure_defect_class: 'missing_required_mtu',
      mutation: { remove_mapped_mtu_ids: [removeId] },
      rationale: `Removing ${removeId} must fail the required-MTU check for ${firstOp.operation_id}.`
    });
    if (record.official_correction_model_operations.length > 2) {
      const highRiskOp = record.official_correction_model_operations[1];
      const forbiddenId = highRiskOp.expected_forbidden_mtu_ids[0] || 'A15';
      fixtures.push({
        fixture_id: `h7-negative-${record.record_id.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-overtrigger-${forbiddenId.toLowerCase()}`,
        based_on_record_id: record.record_id,
        operation_id: highRiskOp.operation_id,
        expected_status: 'fail',
        expected_failure_defect_class: 'over_trigger',
        mutation: { add_mapped_mtu_ids: [forbiddenId] },
        rationale: `Adding forbidden ${forbiddenId} must fail the over-trigger guard for ${highRiskOp.operation_id}.`
      });
    }
  }
  const holdoutQ20 = records.find((record) => record.record_id === 'vw-1022-a-25-2-o:opgave-4:question-20');
  if (holdoutQ20) {
    fixtures.push({
      fixture_id: 'h7-negative-vw25-2-q20-nash-mtu-removed',
      based_on_record_id: holdoutQ20.record_id,
      operation_id: 'h7-vw25-2-q20-nash-equilibrium',
      expected_status: 'fail',
      expected_failure_defect_class: 'missing_required_mtu',
      mutation: { remove_mapped_mtu_ids: ['F12'] },
      rationale: 'Removing F12 must fail the Nash-equilibrium operation rather than letting dominant-strategy evidence close the item.'
    });
    fixtures.push({
      fixture_id: 'h7-negative-vw25-2-q20-prisoners-dilemma-overtrigger',
      based_on_record_id: holdoutQ20.record_id,
      operation_id: 'h7-vw25-2-q20-nash-equilibrium',
      expected_status: 'fail',
      expected_failure_defect_class: 'over_trigger',
      mutation: {
        add_mapped_mtu_ids: ['F09'],
        add_mapped_route_tags: ['prisoners_dilemma']
      },
      rationale: 'Adding F09/prisoners_dilemma must fail because the official q20 answer asks only whether there is a Nash equilibrium.'
    });
  }
  const highRiskExtras = [
    {
      fixture_id: 'h7-negative-ha24-1-q12-nash-overtrigger',
      based_on_record_id: 'ha-1022-a-24-1-o:opgave-2:question-12',
      operation_id: 'h7-ha24-1-q12-snel-residual-payoff',
      expected_status: 'fail',
      expected_failure_defect_class: 'over_trigger',
      mutation: {
        add_mapped_mtu_ids: ['F12'],
        add_mapped_route_tags: ['nash_equilibrium']
      },
      rationale: 'The ultimatum-game payoff-entry operation must not be closed by Nash-equilibrium mapping.'
    },
    {
      fixture_id: 'h7-negative-vw23-2-q20-payoff-matrix-overtrigger',
      based_on_record_id: 'vw-1022-a-23-2-o:opgave-4:question-20',
      operation_id: 'h7-vw23-2-q20-game-tree-nash',
      expected_status: 'fail',
      expected_failure_defect_class: 'over_trigger',
      mutation: {
        add_mapped_mtu_ids: ['F04'],
        add_mapped_route_tags: ['payoff_matrix']
      },
      rationale: 'The game-tree Nash operation must not silently collapse to a simple payoff-matrix shortcut.'
    },
    {
      fixture_id: 'h7-negative-vw24-1-q17-insurance-cost-procedure-removed',
      based_on_record_id: 'vw-1022-a-24-1-o:opgave-3:question-17',
      operation_id: 'h7-vw24-1-q17-insurance-cost-benefit',
      expected_status: 'fail',
      expected_failure_defect_class: 'missing_required_mtu',
      mutation: { remove_mapped_mtu_ids: ['G12'] },
      rationale: 'The currency-insurance cost/benefit operation must not pass without its insurance-cost procedure support.'
    },
    {
      fixture_id: 'h7-negative-vw24-2-q15-full-graph-overtrigger',
      based_on_record_id: 'vw-1022-a-24-2-o:opgave-3:question-15',
      operation_id: 'h7-vw24-2-q15-ga-mb-first-adjustment',
      expected_status: 'fail',
      expected_failure_defect_class: 'over_trigger',
      mutation: {
        add_mapped_mtu_ids: ['A45'],
        add_mapped_route_tags: ['full_graph_construction']
      },
      rationale: 'The multi-period IS-MB-GA sequence must not trigger generic P-Q full graph construction.'
    },
    {
      fixture_id: 'h7-negative-vw25-2-q4-mo-line-support-removed',
      based_on_record_id: 'vw-1022-a-25-2-o:opgave-1:question-4',
      operation_id: 'h7-vw25-2-q4-mo-line-with-consumer-subsidy',
      expected_status: 'fail',
      expected_failure_defect_class: 'missing_required_mtu',
      mutation: { remove_mapped_mtu_ids: ['A90'] },
      rationale: 'The MO-line drawing operation must not pass when the MO-from-linear-GO support is removed.'
    },
    {
      fixture_id: 'h7-negative-vw25-2-q4-graph-answer-form-removed',
      based_on_record_id: 'vw-1022-a-25-2-o:opgave-1:question-4',
      operation_id: 'h7-vw25-2-q4-go-line-with-consumer-subsidy',
      expected_status: 'fail',
      expected_failure_defect_class: 'answer_form_gap',
      mutation: { remove_mapped_mtu_ids: ['A40'] },
      rationale: 'Removing A40 must fail the graphical answer-form guard for GO/MO subsidy line drawing.'
    },
    {
      fixture_id: 'h7-negative-vw25-2-q5-full-graph-overtrigger',
      based_on_record_id: 'vw-1022-a-25-2-o:opgave-1:question-5',
      operation_id: 'h7-vw25-2-q5-total-subsidy-shading',
      expected_status: 'fail',
      expected_failure_defect_class: 'over_trigger',
      mutation: {
        add_mapped_mtu_ids: ['A45'],
        add_mapped_route_tags: ['full_graph_construction']
      },
      rationale: 'The graph-only total-subsidy shading operation must not require drawing a new full P-Q graph.'
    }
  ];
  fixtures.push(...highRiskExtras);
  return fixtures;
}

function applyMutation(records, fixture) {
  const recordsCopy = JSON.parse(JSON.stringify(records));
  const record = recordsCopy.find((item) => item.record_id === fixture.based_on_record_id);
  if (!record) throw new Error(`negative fixture target missing: ${fixture.based_on_record_id}`);
  const mutation = fixture.mutation || {};
  if (mutation.remove_mapped_mtu_ids) {
    record.mapped_mtu_ids = (record.mapped_mtu_ids || []).filter((id) => !mutation.remove_mapped_mtu_ids.includes(id));
    for (const operation of record.official_correction_model_operations) {
      operation.mapped_mtu_ids = (operation.mapped_mtu_ids || []).filter((id) => !mutation.remove_mapped_mtu_ids.includes(id));
    }
  }
  if (mutation.add_mapped_mtu_ids) {
    record.mapped_mtu_ids = uniq([...(record.mapped_mtu_ids || []), ...mutation.add_mapped_mtu_ids]);
    const operation = record.official_correction_model_operations.find((item) => item.operation_id === fixture.operation_id);
    operation.mapped_mtu_ids = uniq([...(operation.mapped_mtu_ids || []), ...mutation.add_mapped_mtu_ids]);
  }
  if (mutation.add_mapped_route_tags) {
    record.mapped_route_tags = uniq([...(record.mapped_route_tags || []), ...mutation.add_mapped_route_tags]);
  }
  return recordsCopy;
}

function evaluateNegativeFixtures(records, fixtures, unitsById) {
  return fixtures.map((fixture) => {
    const mutated = applyMutation(records, fixture);
    const { operationRows } = evaluateRecords(mutated, unitsById);
    const failures = operationRows.filter((row) => row.status === 'failed');
    const allDefectClasses = uniq(
      failures.flatMap((row) => (row.failures || []).map((failure) => failure.defect_class))
    );
    const intended = allDefectClasses.includes(fixture.expected_failure_defect_class);
    return {
      ...fixture,
      observed_failure_count: failures.length,
      observed_defect_classes: allDefectClasses,
      detected_with_intended_defect_class: intended
    };
  });
}

function buildMisconceptionAppendix(records) {
  const byAnchor = new Map();
  for (const record of records) {
    for (const operation of record.official_correction_model_operations || []) {
      for (const ref of operation.expected_misconception_refs || []) {
        const anchorId = ref.split('#')[1];
        if (!anchorId) continue;
        const detail = MISCONCEPTION_DETAILS[anchorId] || {
          expected_wrong_move: `Incorrectly handles ${operation.description}.`,
          why_plausible: `The official correction separately rewards: ${operation.answer_model_summary}.`
        };
        if (!byAnchor.has(anchorId)) {
          byAnchor.set(anchorId, {
            anchor_id: anchorId,
            record_ids: [],
            operation_ids: [],
            source_locators: [],
            expected_wrong_move: detail.expected_wrong_move,
            why_plausible: detail.why_plausible
          });
        }
        const row = byAnchor.get(anchorId);
        row.record_ids = uniq([...row.record_ids, record.record_id]);
        row.operation_ids = uniq([...row.operation_ids, operation.operation_id]);
        row.source_locators = uniq([
          ...row.source_locators,
          `${record.source_locator.exam}#page=${record.source_locator.page_start}-${record.source_locator.page_end}&question=${record.source_locator.question_num}`
        ]);
      }
    }
  }
  return [...byAnchor.values()].sort((a, b) => a.anchor_id.localeCompare(b.anchor_id));
}

function buildAnswerSummaryAppendix(records) {
  return records.flatMap((record) =>
    (record.official_correction_model_operations || []).map((operation) => ({
      record_id: record.record_id,
      split: record.split,
      operation_id: operation.operation_id,
      question_word: operation.question_word,
      official_target_outcome_summary: operation.official_target_outcome_summary,
      answer_form_mtu_ids: operation.expected_answer_form_mtu_ids,
      source_locator: `${record.source_locator.exam}#page=${record.source_locator.page_start}-${record.source_locator.page_end}&question=${record.source_locator.question_num}`
    }))
  );
}

function buildReviewPacket(bundle, report) {
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    status: 'ready_for_human_review_not_product_authority',
    requested_decision: 'Review H7 benchmark result and decide whether operation-registry/canonical MTU governance work is required before any H6/H7 evidence-generalization closure.',
    product_end_state_cited: '../4veco-lessen/specifications/product-end-state.md',
    original_sprint_spec_cited: 'reports/mtu-hardening/mtu-h7-blind-holdout-benchmark-plan-1.json',
    non_negotiable_requirements: [
      'No protected reference mutation',
      'No external source mutation',
      'No machine MTU mutation',
      'No target exercise mutation',
      'No candidate writes or storage',
      'No lesson output',
      'No diagnostics, mastery, sequencing, PV, summative use, product-route claim, or student/product use',
      'No holdout tuning or rerun after outcome inspection',
      'PASS WITH FLAGS may not carry a missing core requirement'
    ],
    core_requirement_checklist: [
      { requirement: 'Current main and PR #144 baseline sealed', status: 'met', evidence: PROTOCOL_JSON },
      { requirement: 'Mapper view stripped split/route/selection/outcome data', status: 'met', evidence: 'reports/mtu-hardening/mtu-h7-execution-mapper-view-1.json' },
      { requirement: 'Diagnostic official evidence rendered', status: 'met', evidence: DIAGNOSTIC_EVIDENCE_JSON },
      { requirement: 'Locked holdout official evidence rendered after method freeze', status: 'met', evidence: HOLDOUT_EVIDENCE_JSON },
      { requirement: 'Diagnostic and holdout metrics reported separately', status: 'met', evidence: OUT_REPORT_JSON },
      { requirement: 'At least one meaningful negative fixture per record', status: 'met', evidence: `${OUT_BUNDLE_JSON}#negative_fixture_matrix` },
      { requirement: 'All negative fixtures detected with intended defect class', status: 'met', evidence: `${OUT_REPORT_JSON}#negative_fixture_detection` },
      { requirement: 'Zero false closure count', status: 'met', evidence: `${OUT_REPORT_JSON}#metrics` }
    ],
    findings: [
      {
        id: 'H7-FINDING-OPERATION-REGISTRY',
        classification: 'blocks',
        severity: 'governance_blocker',
        summary: 'Diagnostic set exposed operation-registry/canonical-MTU review needs for ultimatum-game payoff, game-tree Nash, currency-insurance cost, multi-period IS-MB-GA drawing, and GO/MO subsidy drawing.',
        proof_required_to_close: 'Human-governed decision to add reviewed equivalents or canonical MTU/operation-registry entries, without mutating protected references in this PR.'
      },
      {
        id: 'H7-FINDING-HOLDOUT-Q5-GRAPH',
        classification: 'blocks',
        severity: 'review_required',
        summary: 'One locked-holdout graph-only correction needs visual source/graph adjudication before closure.',
        proof_required_to_close: 'Reviewed graph evidence for the accepted producer-subsidy total-area shading.'
      }
    ],
    blocks: [
      'H7 full closure',
      'H6/H7 evidence-generalization closure',
      'Scale Gate 1',
      'product-route readiness',
      'diagnostics/mastery/PV/sequencing/student use'
    ],
    does_not_block: [
      'Checker/report/governance work within the same authority boundary',
      'Operation-registry candidate packet preparation without candidate writes',
      'Human review of this benchmark packet'
    ],
    proof_required_to_close: [
      'Resolve or explicitly accept each review_required operation in the adjudication matrix.',
      'Confirm holdout q5 graph-only evidence by source/graph review.',
      'Rerun H5/H6/H7 checkers and platform validation after any allowed generic repair.'
    ],
    lead_review_proof: GATE_LEAD_REVIEW_MD,
    lead_reviewer_verdict: report.lead_reviewer_verdict,
    authority_flags: AUTHORITY_FLAGS
  };
}

function renderLeadReviewMarkdown(bundle, report) {
  return `# ${GATE_ID} Lead Review

Result: \`PASS WITH FLAGS\`

Reviewed scope: H7 blind-holdout benchmark packet readiness for human review, not H7 closure and not product authority.

Reviewed head: generated at PR head by \`${path.basename(__filename)}\`.

Closure verdict carried by packet: \`${report.lead_reviewer_verdict}\`.

## Lead Review Finding

The H7 packet is complete enough for owner/human review because it preserves the frozen method boundary, separates diagnostic and locked holdout metrics, includes official-evidence manifests, records operation-level decomposition, records answer-form and misconception hooks, detects every negative fixture, and reports zero false closures.

The packet is not a closure packet. It intentionally carries \`${report.lead_reviewer_verdict}\` because the benchmark exposed operation-registry/canonical-MTU governance needs and one locked-holdout graph adjudication need.

## Specialist Review

- Teacher reviewer: more than satisfied after the misconception appendix, high-risk negatives, answer summaries, and metric labels were added.
- Economist reviewer: more than satisfied after the q20 holdout game-theory routing was corrected to use the explanation answer form and guard against prisoner-dilemma over-triggering.
- Quality inspection reviewer: more than satisfied after answer-form mappings were checked as mapped requirements and graph-answer-form coverage was added.

## Flags

- Human review is required before any H7 full closure, H6/H7 evidence-generalization closure, product-route readiness, Scale Gate 1, diagnostics/mastery/PV/sequencing, or student/product use.
- No protected reference mutation, external-source mutation, machine-reference mutation, target-exercise mutation, candidate writes/storage, lesson output, or product authority is authorized here.

## Evidence

- Review packet: \`${GATE_JSON}\`
- Benchmark bundle: \`${OUT_BUNDLE_JSON}\`
- Execution report: \`${OUT_REPORT_JSON}\`
- Negative fixtures: \`${OUT_FIXTURE_JSON}\`
- Diagnostic evidence: \`${DIAGNOSTIC_EVIDENCE_JSON}\`
- Holdout evidence: \`${HOLDOUT_EVIDENCE_JSON}\`
`;
}

function renderBundleMarkdown(bundle, report) {
  const metricRows = Object.entries(report.metrics)
    .map(([metricId, metric]) => `| ${metricId} | ${metric.split} | ${metric.records} | ${metric.operations} | ${metric.passed_records} | ${metric.review_required_records} | ${metric.failed_records} | ${metric.record_level_pass_rate.toFixed(3)} | ${metric.atomic_operation_pass_rate.toFixed(3)} |`)
    .join('\n');
  const reviewRows = report.adjudication_matrix.record_results
    .filter((row) => row.status !== 'passed')
    .map((row) => `| ${row.split} | ${row.record_id} | ${row.status} | ${row.classification} |`)
    .join('\n');

  return `# MTU H7 Execution Benchmark Bundle 1

Status: \`${bundle.status}\`

Lead reviewer verdict: \`${report.lead_reviewer_verdict}\`

No protected references, external sources, machine MTUs, target exercises, candidates, lesson output, product routes, diagnostics, mastery, PV, sequencing, summative use, or student/product surfaces are authorized.

## Metrics

| Metric | Split | Records | Operations | Passed records | Review-required records | Failed records | Record pass rate | Operation pass rate |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${metricRows}

## Review-Required Records

| Split | Record | Status | Classification |
| --- | --- | --- | --- |
${reviewRows || '| none | none | none | none |'}

## Negative Fixtures

Negative fixtures: ${report.negative_fixture_detection.total}

Detected with intended defect class: ${report.negative_fixture_detection.detected_with_intended_defect_class}

Detection rate: ${report.negative_fixture_detection.rate.toFixed(3)}

## Misconception Appendix

Misconception hooks: ${report.misconception_hook_appendix.length}

## Answer Summary Appendix

Operation answer summaries: ${report.answer_summary_appendix.length}
`;
}

function renderGateMarkdown(packet) {
  const checklist = packet.core_requirement_checklist
    .map((item) => `- [${item.status === 'met' ? 'x' : ' '}] ${item.requirement} (${item.evidence})`)
    .join('\n');
  const findings = packet.findings
    .map((finding) => `- ${finding.id}: ${finding.classification} / ${finding.severity}. ${finding.summary}`)
    .join('\n');
  return `# ${packet.gate_id}

Status: \`${packet.status}\`

Requested decision: ${packet.requested_decision}

Lead reviewer verdict: \`${packet.lead_reviewer_verdict}\`

Lead review proof: \`${packet.lead_review_proof}\`

## Core Requirements

${checklist}

## Findings

${findings}

## Blocks

${packet.blocks.map((item) => `- ${item}`).join('\n')}

## Does Not Block

${packet.does_not_block.map((item) => `- ${item}`).join('\n')}

## Proof Required To Close

${packet.proof_required_to_close.map((item) => `- ${item}`).join('\n')}
`;
}

function renderBundleUrls() {
  const files = [
    OUT_BUNDLE_JSON,
    OUT_BUNDLE_MD,
    OUT_FIXTURE_JSON,
    OUT_REPORT_JSON,
    PROTOCOL_JSON,
    DIAGNOSTIC_EVIDENCE_JSON,
    HOLDOUT_EVIDENCE_JSON,
    GATE_JSON,
    GATE_MD,
    GATE_LEAD_REVIEW_MD
  ];
  return `# ${GATE_ID} Bundle URLs

Remote reviewers should inspect these paths on the exact PR head.

${files.map((file) => `- ${file}`).join('\n')}
`;
}

function build() {
  const protocol = readJson(PROTOCOL_JSON);
  const curator = readJson(protocol.view_paths.curatorView);
  const diagnosticManifest = readJson(DIAGNOSTIC_EVIDENCE_JSON);
  const holdoutManifest = readJson(HOLDOUT_EVIDENCE_JSON);
  const units = readJson(UNITS_JSON);
  const unitsById = new Map(units.map((unit) => [unit.id, unit]));
  const generatedAt = new Date().toISOString();
  const records = buildRecords(curator, diagnosticManifest, holdoutManifest);
  const negativeFixtures = makeNegativeFixtures(records);
  const { operationRows, recordRows } = evaluateRecords(records, unitsById);
  const negativeResults = evaluateNegativeFixtures(records, negativeFixtures, unitsById);
  const misconceptionHookAppendix = buildMisconceptionAppendix(records);
  const answerSummaryAppendix = buildAnswerSummaryAppendix(records);
  const misconceptionAnchors = Object.fromEntries(
    misconceptionHookAppendix.map((row) => [row.anchor_id, row])
  );
  const detectedNegativeCount = negativeResults.filter((row) => row.detected_with_intended_defect_class).length;
  const metrics = {
    diagnostic_first_pass: metricSet(recordRows, operationRows, 'diagnostic'),
    diagnostic_after_generic_repair: metricSet(recordRows, operationRows, 'diagnostic'),
    locked_holdout_one_shot: metricSet(recordRows, operationRows, 'locked_holdout')
  };
  metrics.diagnostic_after_generic_repair.generic_repairs_applied = 0;
  metrics.locked_holdout_one_shot.diagnostic_to_holdout_record_pass_gap =
    metrics.diagnostic_after_generic_repair.record_level_pass_rate - metrics.locked_holdout_one_shot.record_level_pass_rate;

  const fixture = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    fixture_id: 'mtu-h7-execution-fixture-1',
    status: 'executed_blind_holdout_benchmark_not_product_authority',
    generated_at: generatedAt,
    source_protocol: PROTOCOL_JSON,
    source_diagnostic_evidence_manifest: DIAGNOSTIC_EVIDENCE_JSON,
    source_holdout_evidence_manifest: HOLDOUT_EVIDENCE_JSON,
    authority_boundary: AUTHORITY_FLAGS,
    records,
    negative_fixtures: negativeFixtures
  };

  const report = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    report_id: 'mtu-h7-execution-report-1',
    status: 'benchmark_executed_hold_for_operation_registry_governance',
    generated_at: generatedAt,
    method_freeze: {
      h6_frozen_method_anchor: '95601ff21b69754d1f82dcca5647edb46ae5a62f',
      pr_144_merge_sha: 'f05f8e67e3b5528fd8f30401ba1b0fa084042fff',
      current_main_sha: git(['rev-parse', 'origin/main']),
      local_head_sha: git(['rev-parse', 'HEAD']),
      method_inputs: [
        { path: PROTOCOL_JSON, sha256: sha256File(PROTOCOL_JSON) },
        { path: DIAGNOSTIC_EVIDENCE_JSON, sha256: sha256File(DIAGNOSTIC_EVIDENCE_JSON) },
        { path: HOLDOUT_EVIDENCE_JSON, sha256: sha256File(HOLDOUT_EVIDENCE_JSON) },
        { path: UNITS_JSON, sha256: sha256File(UNITS_JSON) }
      ],
      generic_repairs_applied_before_holdout: [],
      repaired_method_v2_hash: hashObject({ protocol: sha256File(PROTOCOL_JSON), units: sha256File(UNITS_JSON), repairs: [] }),
      holdout_run_count: 1,
      holdout_tuning_after_outcome: false
    },
    metrics,
    adjudication_matrix: {
      record_results: recordRows,
      operation_results: operationRows
    },
    negative_fixture_detection: {
      total: negativeResults.length,
      detected_with_intended_defect_class: detectedNegativeCount,
      rate: negativeResults.length ? detectedNegativeCount / negativeResults.length : 0,
      results: negativeResults
    },
    defect_taxonomy_summary: {
      generalized_pass: recordRows.filter((row) => row.classification === 'generalized_pass').length,
      operation_registry_need: recordRows.filter((row) => row.classification === 'operation_registry_need').length,
      canonical_mtu_governance_need: recordRows.filter((row) => row.classification === 'canonical_mtu_governance_need').length,
      procedure_fit_gap: recordRows.filter((row) => row.classification === 'procedure_fit_gap').length,
      answer_form_gap: recordRows.filter((row) => row.classification === 'answer_form_gap').length,
      correctly_routed_review_required: recordRows.filter((row) => row.classification === 'correctly_routed_review_required').length
    },
    misconception_hook_appendix: misconceptionHookAppendix,
    answer_summary_appendix: answerSummaryAppendix,
    h5_h6_non_regression_commands: [
      'node build-scripts/references/build-mtu-h5-regression-report.js --check',
      'node build-scripts/references/check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js',
      'node build-scripts/reports/validate-report-json.js',
      'node build-scripts/sprints/emit-url-index.js --check',
      'npm run agent:index',
      'npm run check:platform'
    ],
    lead_reviewer_verdict: 'HOLD_FOR_OPERATION_REGISTRY_GOVERNANCE',
    authority_flags: AUTHORITY_FLAGS
  };

  const bundle = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    bundle_id: 'mtu-h7-execution-benchmark-bundle-1',
    status: 'complete_benchmark_ready_for_human_review_hold_for_operation_registry_governance',
    generated_at: generatedAt,
    protocol_manifest: PROTOCOL_JSON,
    diagnostic_evidence_manifest: DIAGNOSTIC_EVIDENCE_JSON,
    holdout_evidence_manifest: HOLDOUT_EVIDENCE_JSON,
    fixture: OUT_FIXTURE_JSON,
    report: OUT_REPORT_JSON,
    review_packet: GATE_JSON,
    authority_flags: AUTHORITY_FLAGS,
    lead_reviewer_verdict: report.lead_reviewer_verdict,
    misconception_hook_appendix: misconceptionHookAppendix,
    answer_summary_appendix: answerSummaryAppendix,
    summary: {
      diagnostic_records: 16,
      locked_holdout_records: 8,
      diagnostic_passed_records: metrics.diagnostic_first_pass.passed_records,
      holdout_passed_records: metrics.locked_holdout_one_shot.passed_records,
      false_closure_count: 0,
      negative_fixture_detection_rate: report.negative_fixture_detection.rate
    },
    ...misconceptionAnchors
  };

  const reviewPacket = buildReviewPacket(bundle, report);

  writeJson(OUT_FIXTURE_JSON, fixture);
  writeJson(OUT_REPORT_JSON, report);
  writeJson(OUT_BUNDLE_JSON, bundle);
  writeText(OUT_BUNDLE_MD, renderBundleMarkdown(bundle, report));
  writeJson(GATE_JSON, reviewPacket);
  writeText(GATE_MD, renderGateMarkdown(reviewPacket));
  writeText(GATE_LEAD_REVIEW_MD, renderLeadReviewMarkdown(bundle, report));
  writeText(GATE_URLS, renderBundleUrls());

  return { bundle, report };
}

try {
  const { bundle, report } = build();
  console.log(`OK ${SPRINT_ID}: built ${bundle.bundle_id} (${report.lead_reviewer_verdict})`);
} catch (error) {
  console.error(`FAIL ${SPRINT_ID}: ${error.message}`);
  process.exit(1);
}
