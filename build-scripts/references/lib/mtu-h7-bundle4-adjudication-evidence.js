'use strict';

const OPERATION_ADJUDICATION_CORRECTIONS = Object.freeze({
  'h7-ha23-2-q15-net-ratio-nivellering': Object.freeze({
    full_fit_mtu_ids: Object.freeze(['A81', 'A96']),
    partial_anchor_mtu_ids: Object.freeze(['H08']),
    excluded_historical_mtu_ids: Object.freeze(['A38']),
    answer_form_mtu_ids: Object.freeze(['A96']),
    procedure_mtu_ids: Object.freeze(['A81', 'A96']),
    partial_procedure_anchor_mtu_ids: Object.freeze(['H08']),
    forbidden_mtu_ids: Object.freeze(['A15']),
    route_tags: Object.freeze([
      'calculation', 'income_distribution', 'ratio_comparison', 'source_reading',
      'answer_form', 'procedure', 'canonical_positive_narrowing_governance'
    ]),
    missing_operation_expectations: Object.freeze([
      'No live MTU exactly covers comparison of post-tax high-income/low-income ratios; H08 remains only a canonical-governance anchor because its label and kern conflict.'
    ]),
    correction_basis: 'The official model compares two net-income ratios. It does not calculate a percentage change, so A38 is excluded.'
  }),
  'h7-ha24-1-q12-snel-residual-payoff': Object.freeze({
    full_fit_mtu_ids: Object.freeze(['A81', 'A96']),
    partial_anchor_mtu_ids: Object.freeze([]),
    excluded_historical_mtu_ids: Object.freeze([]),
    answer_form_mtu_ids: Object.freeze(['A96']),
    procedure_mtu_ids: Object.freeze(['A81', 'A96']),
    partial_procedure_anchor_mtu_ids: Object.freeze([]),
    forbidden_mtu_ids: Object.freeze(['F12']),
    route_tags: Object.freeze([
      'calculation', 'ultimatum_game', 'residual_payoff', 'source_reading', 'answer_form', 'procedure'
    ]),
    missing_operation_expectations: Object.freeze([
      'No live MTU exactly covers the proposer residual-payoff arithmetic inside an ultimatum-game decision tree.'
    ]),
    correction_basis: 'A81 and A96 fit the source-use and calculation answer form; F12 remains forbidden because this is not matrix Nash selection.'
  }),
  'h7-ha24-1-q12-sprinter-margin-payoff': Object.freeze({
    full_fit_mtu_ids: Object.freeze(['A81', 'A96']),
    partial_anchor_mtu_ids: Object.freeze([]),
    excluded_historical_mtu_ids: Object.freeze([]),
    answer_form_mtu_ids: Object.freeze(['A96']),
    procedure_mtu_ids: Object.freeze(['A81', 'A96']),
    partial_procedure_anchor_mtu_ids: Object.freeze([]),
    forbidden_mtu_ids: Object.freeze(['F12']),
    route_tags: Object.freeze([
      'calculation', 'ultimatum_game', 'margin_payoff', 'marginal_cost_subtraction',
      'source_reading', 'answer_form', 'procedure'
    ]),
    missing_operation_expectations: Object.freeze([
      'No live MTU exactly covers accepted price less marginal cost inside an ultimatum-game decision tree.'
    ]),
    correction_basis: 'The operation must subtract the EUR 3,500 marginal cost from the accepted price; A81 and A96 do not replace that missing operation.'
  }),
  'h7-vw23-2-q20-game-tree-nash': Object.freeze({
    full_fit_mtu_ids: Object.freeze(['A81', 'A97']),
    partial_anchor_mtu_ids: Object.freeze(['F12']),
    excluded_historical_mtu_ids: Object.freeze([]),
    answer_form_mtu_ids: Object.freeze(['A97']),
    procedure_mtu_ids: Object.freeze(['A81', 'A97']),
    partial_procedure_anchor_mtu_ids: Object.freeze(['F12']),
    forbidden_mtu_ids: Object.freeze([]),
    route_tags: Object.freeze([
      'game_theory', 'game_tree', 'sequential_payoff_comparison', 'nash_equilibrium',
      'source_reading', 'answer_form', 'procedure', 'matrix_shortcut_guard'
    ]),
    missing_operation_expectations: Object.freeze([
      'No live MTU exactly covers sequential game-tree payoff comparison; F12 is a matrix-only partial concept anchor.'
    ]),
    correction_basis: 'F12 is retained only as a partial Nash anchor because its procedure is explicitly matrix based.'
  }),
  'h7-vw24-1-q17-insurance-cost-benefit': Object.freeze({
    full_fit_mtu_ids: Object.freeze(['H24', 'A88', 'A81', 'A96']),
    partial_anchor_mtu_ids: Object.freeze(['G11', 'G12']),
    excluded_historical_mtu_ids: Object.freeze(['A38']),
    answer_form_mtu_ids: Object.freeze(['A96']),
    procedure_mtu_ids: Object.freeze(['H24', 'A88', 'A81', 'A96']),
    partial_procedure_anchor_mtu_ids: Object.freeze(['G12']),
    forbidden_mtu_ids: Object.freeze(['A15']),
    route_tags: Object.freeze([
      'calculation', 'insurance_cost', 'currency_risk', 'currency_conversion',
      'fixed_premium', 'monthly_variable_premium', 'six_month_scaling',
      'cost_benefit', 'source_reading', 'answer_form', 'scaling', 'procedure'
    ]),
    missing_operation_expectations: Object.freeze([
      'No live MTU exactly covers fixed plus monthly currency-insurance cost, six-month scaling, avoided exchange-rate loss, and net-benefit comparison as one operation.'
    ]),
    correction_basis: 'A38 is inapplicable. G12 is only a partial insurance anchor; H24/A88/A81/A96 cover conversion, scale, source use, and answer form without closing the composite procedure.'
  }),
  'h7-vw24-2-q15-ga-mb-first-adjustment': Object.freeze({
    full_fit_mtu_ids: Object.freeze(['A81']),
    partial_anchor_mtu_ids: Object.freeze(['I07', 'A42']),
    excluded_historical_mtu_ids: Object.freeze(['A40']),
    answer_form_mtu_ids: Object.freeze([]),
    procedure_mtu_ids: Object.freeze([]),
    partial_procedure_anchor_mtu_ids: Object.freeze(['I07', 'A42']),
    forbidden_mtu_ids: Object.freeze(['A45']),
    route_tags: Object.freeze([
      'macro_graph_mutation', 'is_mb_ga', 'ga_shift', 'mb_shift', 'time_sequence',
      'first_period_sequence', 'one_point_real_rate_step', 'source_reading',
      'graph_answer_form_gap', 'procedure_gap'
    ]),
    missing_operation_expectations: Object.freeze([
      'No live answer-form MTU exactly covers a multi-period IS-MB-GA drawing.',
      'No live procedure exactly covers the first-period GA1/MB1 sequence from expected-minus-realized inflation and a one-point real-rate reduction.'
    ]),
    correction_basis: 'A40 is a welfare-area shading MTU and is excluded. I07/A42 are partial graph anchors, not a complete period-specific sequence or answer form.'
  }),
  'h7-vw24-2-q15-ga-mb-second-adjustment-and-table': Object.freeze({
    full_fit_mtu_ids: Object.freeze(['A81']),
    partial_anchor_mtu_ids: Object.freeze(['I07', 'A42']),
    excluded_historical_mtu_ids: Object.freeze(['A40']),
    answer_form_mtu_ids: Object.freeze([]),
    procedure_mtu_ids: Object.freeze([]),
    partial_procedure_anchor_mtu_ids: Object.freeze(['I07', 'A42']),
    forbidden_mtu_ids: Object.freeze(['A45']),
    route_tags: Object.freeze([
      'macro_graph_mutation', 'is_mb_ga', 'ga_shift', 'mb_shift', 'time_sequence',
      'second_period_sequence', 'final_r_pi_table_completion', 'source_reading',
      'graph_and_table_answer_form_gap', 'procedure_gap'
    ]),
    missing_operation_expectations: Object.freeze([
      'No live answer-form MTU exactly covers the combined multi-period graph and final r/pi table.',
      'No live procedure exactly covers GA2/MB2 plus final real-rate and inflation completion.'
    ]),
    correction_basis: 'A40 is a welfare-area shading MTU and is excluded. I07/A42 remain partial anchors; graph movement alone cannot satisfy the table-completion operation.'
  })
});

const RECORD_SOURCE_COMPLETENESS = Object.freeze({
  'ha-1022-a-23-2-o:opgave-3:question-15': Object.freeze({
    supplemental_pages: Object.freeze([Object.freeze({
      role: 'opgave_context_preceding_question',
      source_pdf_path: 'references/external/exams/ha-1022-a-23-2-o.pdf',
      page_number: 6,
      required_text_patterns: Object.freeze(['Heffingskortingen inkomensafhankelijk', 'bron 1'])
    })]),
    correction_model_pages: Object.freeze([Object.freeze({
      source_pdf_path: 'references/external/exams/ha-1022-a-23-2-c.pdf',
      page_number: 9,
      required_text_patterns: Object.freeze(['66.113/16.920 = 3,9', 'toegenomen nivellering'])
    })]),
    unavailable_sources: Object.freeze([Object.freeze({
      source_label: 'bron 1 and bron 2 referenced by question 15',
      repository_file_candidates: Object.freeze(['references/external/exams/ha-1022-a-23-2-b.pdf']),
      status: 'unavailable_in_repository_explicit_blocking_limitation',
      impact: 'The official correction-model calculation is present, but the two source tables cannot be visually re-reviewed from this repository; later execution must remain held or obtain authoritative source-annex evidence.'
    })])
  }),
  'ha-1022-a-24-1-o:opgave-2:question-12': Object.freeze({
    supplemental_pages: Object.freeze([Object.freeze({
      role: 'opgave_rules_budget_and_marginal_cost',
      source_pdf_path: 'references/external/exams/ha-1022-a-24-1-o.pdf',
      page_number: 4,
      required_text_patterns: Object.freeze(['Marginale kosten', '3.500', 'budget van', '6.000'])
    })]),
    correction_model_pages: Object.freeze([Object.freeze({
      source_pdf_path: 'references/external/exams/ha-1022-a-24-1-c.pdf',
      page_number: 9,
      required_text_patterns: Object.freeze(['budgetbedrag', 'marginale kosten', '4.500', '3.500'])
    })]),
    unavailable_sources: Object.freeze([Object.freeze({
      source_label: 'bron 2 ultimatum-game decision tree referenced by question 12',
      repository_file_candidates: Object.freeze(['references/external/exams/ha-1022-a-24-1-b.pdf']),
      status: 'unavailable_in_repository_explicit_blocking_limitation',
      impact: 'The official correction-model payoffs are present, but the decision-tree geometry cannot be visually re-reviewed; later execution must remain held or obtain authoritative source-annex evidence.'
    })])
  }),
  'vw-1022-a-23-2-o:opgave-4:question-20': Object.freeze({
    supplemental_pages: Object.freeze([]),
    correction_model_pages: Object.freeze([Object.freeze({
      source_pdf_path: 'references/external/exams/vw-1022-a-23-2-c.pdf',
      page_number: 11,
      required_text_patterns: Object.freeze(['104 > 100', 'Nash-evenwicht'])
    })]),
    unavailable_sources: Object.freeze([])
  }),
  'vw-1022-a-24-1-o:opgave-3:question-17': Object.freeze({
    supplemental_pages: Object.freeze([Object.freeze({
      role: 'table_1_fixed_and_monthly_premium_terms',
      source_pdf_path: 'references/external/exams/vw-1022-a-24-1-o.pdf',
      page_number: 6,
      required_text_patterns: Object.freeze(['vaste premie van 0,5%', '0,25% per', 'maand'])
    })]),
    correction_model_pages: Object.freeze([Object.freeze({
      source_pdf_path: 'references/external/exams/vw-1022-a-24-1-c.pdf',
      page_number: 11,
      required_text_patterns: Object.freeze(['0,0025 x 6', '515.625', '275.625'])
    })]),
    unavailable_sources: Object.freeze([])
  }),
  'vw-1022-a-24-2-o:opgave-3:question-15': Object.freeze({
    supplemental_pages: Object.freeze([Object.freeze({
      role: 'starting_is_mb_ga_figure_and_low_conjuncture_state',
      source_pdf_path: 'references/external/exams/vw-1022-a-24-2-o.pdf',
      page_number: 6,
      required_text_patterns: Object.freeze(['Beleidsdilemma', 'IS-MB-GA-model', 'laagconjunctuur'])
    })]),
    correction_model_pages: Object.freeze([Object.freeze({
      source_pdf_path: 'references/external/exams/vw-1022-a-24-2-c.pdf',
      page_number: 9,
      required_text_patterns: Object.freeze(['GA2 en MB2', 'r = 2%', '3,4%'])
    })]),
    unavailable_sources: Object.freeze([Object.freeze({
      source_label: 'question 15 official uitwerkbijlage graph and final r/pi table',
      repository_file_candidates: Object.freeze(['references/external/exams/vw-1022-a-24-2-u.pdf']),
      status: 'unavailable_in_repository_explicit_blocking_limitation',
      impact: 'The starting graph and correction model are present, but the official response-sheet geometry and table cannot be visually re-reviewed; later execution must remain held or obtain authoritative uitwerkbijlage evidence.'
    })])
  })
});

module.exports = {
  OPERATION_ADJUDICATION_CORRECTIONS,
  RECORD_SOURCE_COMPLETENESS
};
