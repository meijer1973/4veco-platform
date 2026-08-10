'use strict';

const PREP_STATUS = 'prepared_for_human_protected_canonical_adjudication_not_executed';

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function unique(values) {
  return [...new Set(asArray(values).filter(Boolean))];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildNegativeMutation(operation) {
  const expectedDefectClass = operation.negative_guard?.expected_failure_defect_class;
  if (expectedDefectClass === 'over_trigger') {
    const mtuId = asArray(operation.forbidden_mtu_ids)[0];
    if (!mtuId) throw new Error(`negative fixture needs a forbidden MTU: ${operation.operation_id}`);
    return { type: 'map_forbidden_mtu', mtu_id: mtuId };
  }

  if (expectedDefectClass === 'procedure_fit_gap') {
    const requiredTags = asArray(operation.semantic_binding?.expected_route_tags);
    const routeTag = requiredTags.includes('table_completion') ? 'table_completion' :
      requiredTags.includes('time_sequence') ? 'time_sequence' :
      requiredTags.includes('insurance_cost') ? 'insurance_cost' :
      requiredTags.includes('procedure') ? 'procedure' : null;
    if (!routeTag) throw new Error(`negative fixture needs a procedure route tag: ${operation.operation_id}`);
    return { type: 'remove_required_route_tag', route_tag: routeTag };
  }

  return {
    type: 'bypass_governance_hold',
    adjudication_status: 'executed_without_owner_governance_decision'
  };
}

function applyNegativeMutation(operation, mutation) {
  const mutated = clone(operation);
  if (mutation.type === 'map_forbidden_mtu') {
    mutated.mapped_mtu_ids = unique([...asArray(mutated.mapped_mtu_ids), mutation.mtu_id]);
  } else if (mutation.type === 'remove_required_route_tag') {
    mutated.route_tags = asArray(mutated.route_tags).filter((tag) => tag !== mutation.route_tag);
  } else if (mutation.type === 'bypass_governance_hold') {
    mutated.adjudication_status = mutation.adjudication_status;
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
  buildNegativeMutation,
  evaluateOperationContract,
  executeNegativeFixture,
  executeNegativeFixtures
};
