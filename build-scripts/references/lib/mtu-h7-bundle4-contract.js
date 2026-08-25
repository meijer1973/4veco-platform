'use strict';

const PREP_STATUS = 'prepared_for_human_protected_canonical_adjudication_not_executed';

const SEMANTIC_NEGATIVE_CONTRACTS = Object.freeze({
  'h7-governance-negative-q15-denivellering-label-reversal': Object.freeze({
    key: 'positive_narrowing_governance',
    baseline: 'held_for_explicit_positive_counterpart_decision',
    mutated: 'closed_as_denivellering_without_positive_counterpart_authority',
    defect_class: 'canonical_mtu_governance_need'
  }),
  'h7-governance-negative-q12-cost-omitted-margin': Object.freeze({
    key: 'responder_margin_cost_subtraction',
    baseline: 'cost_subtraction_required',
    mutated: 'cost_subtraction_omitted',
    defect_class: 'operation_registry_need'
  }),
  'h7-governance-negative-q20-matrix-shortcut': Object.freeze({
    key: 'game_tree_reasoning_mode',
    baseline: 'backward_induction_required',
    mutated: 'payoff_matrix_shortcut_substituted',
    defect_class: 'operation_registry_need'
  }),
  'h7-governance-negative-q17-premium-month-factor-omitted': Object.freeze({
    key: 'premium_annualization',
    baseline: 'month_factor_required',
    mutated: 'month_factor_omitted',
    defect_class: 'procedure_fit_gap'
  }),
  'h7-governance-negative-q15-macro-one-step-only': Object.freeze({
    key: 'first_period_ga_mb_sequence',
    baseline: 'period_specific_sequence_required',
    mutated: 'collapsed_to_one_generic_shift',
    defect_class: 'procedure_fit_gap'
  }),
  'h7-governance-negative-q15-final-r-pi-omitted': Object.freeze({
    key: 'final_r_pi_table_completion',
    baseline: 'final_values_required',
    mutated: 'final_values_omitted',
    defect_class: 'procedure_fit_gap'
  })
});

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function unique(values) {
  return [...new Set(asArray(values).filter(Boolean))];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function semanticNegativeContract(operation) {
  return SEMANTIC_NEGATIVE_CONTRACTS[operation.negative_guard?.fixture_id] || null;
}

function buildRegressionContract(operation) {
  const contract = semanticNegativeContract(operation);
  return contract ? { [contract.key]: contract.baseline } : {};
}

function buildNegativeMutation(operation) {
  const expectedDefectClass = operation.negative_guard?.expected_failure_defect_class;
  if (expectedDefectClass === 'over_trigger') {
    const mtuId = asArray(operation.forbidden_mtu_ids)[0];
    if (!mtuId) throw new Error(`negative fixture needs a forbidden MTU: ${operation.operation_id}`);
    return { type: 'map_forbidden_mtu', mtu_id: mtuId };
  }

  const semanticContract = semanticNegativeContract(operation);
  if (semanticContract) {
    if (semanticContract.defect_class !== expectedDefectClass) {
      throw new Error(`semantic negative defect class drift: ${operation.operation_id}`);
    }
    return {
      type: 'set_semantic_regression_value',
      key: semanticContract.key,
      value: semanticContract.mutated
    };
  }

  throw new Error(`negative fixture lacks an executable semantic mutation: ${operation.operation_id}`);
}

function applyNegativeMutation(operation, mutation) {
  const mutated = clone(operation);
  if (mutation.type === 'map_forbidden_mtu') {
    mutated.mapped_mtu_ids = unique([...asArray(mutated.mapped_mtu_ids), mutation.mtu_id]);
  } else if (mutation.type === 'set_semantic_regression_value') {
    mutated.regression_contract = {
      ...(mutated.regression_contract || {}),
      [mutation.key]: mutation.value
    };
  } else {
    throw new Error(`unsupported negative mutation type: ${mutation.type}`);
  }
  return mutated;
}

function evaluateOperationContract(operation) {
  const defectClasses = [];
  if (operation.adjudication_status !== PREP_STATUS) {
    defectClasses.push(operation.source_prior_defect_class || 'governance_hold_bypassed');
  }

  const forbidden = new Set(asArray(operation.forbidden_mtu_ids));
  if (asArray(operation.mapped_mtu_ids).some((id) => forbidden.has(id))) {
    defectClasses.push('over_trigger');
  }

  const expectedRouteTags = asArray(operation.semantic_binding?.expected_route_tags);
  if (expectedRouteTags.some((tag) => !asArray(operation.route_tags).includes(tag))) {
    defectClasses.push('procedure_fit_gap');
  }

  for (const expected of asArray(operation.semantic_binding?.expected_regression_contract)) {
    if (operation.regression_contract?.[expected.key] !== expected.value) {
      defectClasses.push(expected.defect_class);
    }
  }

  return unique(defectClasses);
}

function executeNegativeFixture(matrix, fixture) {
  const operation = asArray(matrix.operations).find((row) => row.operation_id === fixture.operation_id);
  if (!operation) throw new Error(`negative fixture operation missing: ${fixture.operation_id}`);
  const mutated = applyNegativeMutation(operation, fixture.mutation_patch);
  const observedFailureDefectClasses = evaluateOperationContract(mutated);
  return {
    fixture_id: fixture.fixture_id,
    operation_id: fixture.operation_id,
    mutation_applied: true,
    expected_failure_defect_class: fixture.expected_failure_defect_class,
    observed_failure_defect_classes: observedFailureDefectClasses,
    detected_with_intended_defect_class: observedFailureDefectClasses.includes(fixture.expected_failure_defect_class)
  };
}

function executeNegativeFixtures(matrix, fixtures) {
  return asArray(fixtures).map((fixture) => executeNegativeFixture(matrix, fixture));
}

module.exports = {
  PREP_STATUS,
  applyNegativeMutation,
  buildRegressionContract,
  buildNegativeMutation,
  evaluateOperationContract,
  executeNegativeFixture,
  executeNegativeFixtures
};
