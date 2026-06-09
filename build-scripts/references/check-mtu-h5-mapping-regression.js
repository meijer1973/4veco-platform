#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DEFAULT_FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const UNITS_PATH = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const SAMPLE_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-sample-selection-packet.json');

const AUTHORITY_FALSE_KEYS = [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'authored_target_exercise_mutation_authorized',
  'unit_minting_authorized',
  'unit_update_authorized',
  'unit_split_authorized',
  'unit_merge_authorized',
  'unit_deprecation_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_mutation_authorized',
  'candidate_storage_creation_authorized',
  'candidate_writes_authorized',
  'lesson_output_mutation_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'sequencing_authorized',
  'student_facing_ai_authorized',
  'summative_use_authorized',
  'pv_projection_authorized',
  'pv_machine_promotion_authorized',
  'student_product_use_authorized',
  'product_route_readiness_claimed',
];

const REQUIRED_DEFECT_CLASSES = [
  'missing_mtu_for_correction_model_operation',
  'over_triggered_prerequisite_not_required_by_answer_model',
  'calculus_route_triggered_where_non_calculus_route_intended',
  'function_construction_route_triggered_when_point_calculation_enough',
  'incidence_pass_through_task_without_incidence_mtu',
  'question_word_without_answer_form_mtu',
  'scale_factor_usage_without_scaling_unit_mtu',
  'predictable_misconception_without_tag_or_equivalent_evidence',
  'apply_analyze_unit_without_usable_canonical_procedure',
];

function parseArgs(argv) {
  const options = {
    fixture: DEFAULT_FIXTURE,
    allowBlocked: false,
    allowReviewCandidate: false,
    expectFail: false,
    json: false,
  };
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--allow-blocked') options.allowBlocked = true;
    else if (arg === '--allow-review-candidate') options.allowReviewCandidate = true;
    else if (arg === '--expect-fail') options.expectFail = true;
    else if (arg === '--json') options.json = true;
    else if (arg === '--fixture') {
      index += 1;
      if (!argv[index]) fail('missing value for --fixture');
      options.fixture = path.resolve(ROOT, argv[index]);
    } else {
      fail(`unknown argument: ${arg}`);
    }
  }
  return options;
}

function fail(message) {
  console.error(`MTU-H5 mapping regression check failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${rel(file)}`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${rel(file)}: ${error.message}`);
  }
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function nonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function evidenceExists(evidencePath) {
  if (!hasText(evidencePath)) return false;
  if (/^https?:\/\//.test(evidencePath)) return true;
  return fs.existsSync(path.resolve(ROOT, evidencePath.split('#')[0]));
}

function output(result, json) {
  if (json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.log(`MTU-H5 mapping regression status: ${result.status}`);
  console.log(`passed=${result.buckets.passed.length} failed=${result.buckets.failed.length} review_required=${result.buckets.review_required.length} blocked=${result.buckets.blocked.length}`);
}

function blockedResult(reason) {
  return {
    schema_version: 1,
    sprint_id: 'MTU-H5',
    status: 'blocked',
    reason,
    buckets: {
      passed: [],
      failed: [],
      review_required: [],
      blocked: [{ assertion_id: 'MTUH5-BLOCKED-NO-APPROVED-SAMPLE', reason }],
    },
  };
}

function add(bucket, assertionId, record) {
  bucket.push({ assertion_id: assertionId, ...record });
}

function loadUnits() {
  const units = readJson(UNITS_PATH);
  if (!Array.isArray(units)) fail(`${rel(UNITS_PATH)} must contain an array`);
  return new Map(units.map((unit) => [unit.id, unit]));
}

function requireFalse(authority, key, result) {
  if (!authority || authority[key] !== false) {
    add(result.buckets.blocked, `MTUH5-AUTH-${key}`, {
      defect_class: 'authority_boundary_violation',
      reason: `authority_boundary.${key} must be false`,
    });
  }
}

function operationMappedIds(record, operation) {
  return [
    ...asArray(record.mapped_mtu_ids),
    ...asArray(operation.mapped_mtu_ids),
    ...asArray(operation.expected_required_mtu_ids),
    ...asArray(operation.expected_answer_form_mtu_ids),
    ...asArray(operation.expected_incidence_mtu_ids),
    ...asArray(operation.expected_scaling_mtu_ids),
    ...asArray(operation.expected_procedure_unit_ids),
  ].filter(Boolean);
}

function operationMappedRouteTags(record, operation) {
  return new Set([
    ...asArray(record.mapped_route_tags),
    ...asArray(operation.mapped_route_tags),
  ]);
}

function operationExpectedRouteTags(operation) {
  return new Set([
    ...asArray(operation.expected_route_tags),
  ]);
}

function defectForForbiddenRouteTag(tag) {
  if (tag === 'function_construction') return 'function_construction_route_triggered_when_point_calculation_enough';
  if (['calculus', 'calculus_route', 'derivative_route'].includes(tag)) {
    return 'calculus_route_triggered_where_non_calculus_route_intended';
  }
  return 'over_triggered_prerequisite_not_required_by_answer_model';
}

function liveIds(ids, units, result, context, defectClass) {
  const live = [];
  for (const id of ids) {
    if (!units.has(id)) {
      add(result.buckets.failed, `${context}-UNKNOWN-${id}`, {
        defect_class: defectClass,
        unit_id: id,
        reason: `expected live MTU ${id} is absent from the canonical registry`,
      });
    } else {
      live.push(id);
    }
  }
  return live;
}

function expectsProcedure(unit) {
  return ['apply', 'analyze', 'analyse', 'evaluate'].includes(String(unit?.mastery_target || '').toLowerCase());
}

function checkProcedureExpectations(record, operation, units, result, context) {
  const explicitIds = asArray(operation.expected_procedure_unit_ids);
  const derivedIds = asArray(operation.expected_required_mtu_ids)
    .filter((id) => expectsProcedure(units.get(id)));
  const procedureIds = [...new Set([...explicitIds, ...derivedIds])];
  const reviewRequiredIds = new Set(asArray(operation.procedure_review_required_unit_ids));

  for (const unitId of procedureIds) {
    const unit = units.get(unitId);
    if (!unit) {
      result.procedure_checks.push({
        record_id: record.record_id,
        operation_id: operation.operation_id,
        unit_id: unitId,
        status: 'procedure_missing',
        reason: 'expected procedure unit is absent from the canonical registry',
      });
      add(result.buckets.failed, `${context}-PROCEDURE-UNKNOWN-${unitId}`, {
        record_id: record.record_id,
        operation_id: operation.operation_id,
        defect_class: 'apply_analyze_unit_without_usable_canonical_procedure',
        unit_id: unitId,
        reason: 'expected procedure unit is absent from the canonical registry',
      });
      continue;
    }

    if (!expectsProcedure(unit)) {
      result.procedure_checks.push({
        record_id: record.record_id,
        operation_id: operation.operation_id,
        unit_id: unitId,
        status: 'procedure_not_required',
        mastery_target: unit.mastery_target || null,
        reason: 'unit mastery target does not require a canonical procedure',
      });
      continue;
    }

    if (!Array.isArray(unit.procedure) || unit.procedure.length === 0) {
      result.procedure_checks.push({
        record_id: record.record_id,
        operation_id: operation.operation_id,
        unit_id: unitId,
        status: 'procedure_missing',
        mastery_target: unit.mastery_target || null,
        reason: 'apply/analyze/evaluate unit has no usable canonical procedure',
      });
      add(result.buckets.failed, `${context}-PROCEDURE-${unitId}`, {
        record_id: record.record_id,
        operation_id: operation.operation_id,
        defect_class: 'apply_analyze_unit_without_usable_canonical_procedure',
        unit_id: unitId,
        reason: 'apply/analyze/evaluate unit has no usable canonical procedure',
      });
      continue;
    }

    if (reviewRequiredIds.has(unitId)) {
      result.procedure_checks.push({
        record_id: record.record_id,
        operation_id: operation.operation_id,
        unit_id: unitId,
        status: 'procedure_review_required',
        mastery_target: unit.mastery_target || null,
        procedure_steps: unit.procedure.length,
        reason: 'canonical procedure is present, but the fixture marks semantic fit review as required',
      });
      add(result.buckets.review_required, `${context}-PROCEDURE-REVIEW-${unitId}`, {
        record_id: record.record_id,
        operation_id: operation.operation_id,
        defect_class: 'apply_analyze_unit_without_usable_canonical_procedure',
        unit_id: unitId,
        reason: 'canonical procedure exists but needs semantic fit review for this operation',
      });
      continue;
    }

    result.procedure_checks.push({
      record_id: record.record_id,
      operation_id: operation.operation_id,
      unit_id: unitId,
      status: 'procedure_present',
      mastery_target: unit.mastery_target || null,
      procedure_steps: unit.procedure.length,
      reason: 'canonical procedure is present',
    });
  }
}

function validateFixtureEnvelope(fixture, result, options) {
  if (fixture.schema_version !== 1) {
    add(result.buckets.blocked, 'MTUH5-SCHEMA-VERSION', { reason: 'fixture schema_version must be 1' });
  }
  if (fixture.sprint_id !== 'MTU-H5') {
    add(result.buckets.blocked, 'MTUH5-SPRINT-ID', { reason: 'fixture sprint_id must be MTU-H5' });
  }
  const allowedStatuses = ['approved_for_mtu_h5_regression'];
  if (options.allowReviewCandidate) allowedStatuses.push('review_candidate_for_mtu_h5_regression');
  if (!allowedStatuses.includes(fixture.status)) {
    add(result.buckets.blocked, 'MTUH5-SAMPLE-NOT-APPROVED', {
      reason: 'fixture status must be approved_for_mtu_h5_regression',
    });
  }
  if (!hasText(fixture.review_packet) || !fs.existsSync(path.resolve(ROOT, fixture.review_packet))) {
    add(result.buckets.blocked, 'MTUH5-REVIEW-PACKET-MISSING', {
      reason: 'fixture must cite an existing approving review_packet',
    });
  }
  for (const key of AUTHORITY_FALSE_KEYS) requireFalse(fixture.authority_boundary, key, result);
  if (!options.skipNegativeFixtures && (!Array.isArray(fixture.records) || fixture.records.length < 3)) {
    add(result.buckets.blocked, 'MTUH5-MINIMUM-RECORDS', {
      reason: 'fixture must include at least three reviewed records',
    });
  }
  if (!options.skipNegativeFixtures && (!Array.isArray(fixture.negative_fixtures) || fixture.negative_fixtures.length < 1)) {
    add(result.buckets.blocked, 'MTUH5-NEGATIVE-FIXTURE-MISSING', {
      reason: 'fixture must include at least one negative fixture',
    });
  }
}

function validateRecordShape(record, result) {
  const context = record.record_id || 'record-without-id';
  if (!hasText(record.record_id)) {
    add(result.buckets.blocked, 'MTUH5-RECORD-ID', { reason: 'record missing record_id' });
  }
  if (!['real_exam_question', 'official_correction_model', 'reviewed_target_exercise'].includes(record.source_type)) {
    add(result.buckets.blocked, `${context}-SOURCE-TYPE`, {
      record_id: record.record_id,
      reason: 'source_type must be real_exam_question, official_correction_model, or reviewed_target_exercise',
    });
  }
  if (!nonEmptyArray(record.source_evidence_paths) || !record.source_evidence_paths.every(evidenceExists)) {
    add(result.buckets.blocked, `${context}-SOURCE-EVIDENCE`, {
      record_id: record.record_id,
      reason: 'record must cite existing local evidence paths or URLs',
    });
  }
  if (!nonEmptyArray(record.official_correction_model_operations)) {
    add(result.buckets.blocked, `${context}-OPERATIONS`, {
      record_id: record.record_id,
      reason: 'record must include official_correction_model_operations',
    });
  }
}

function assertionContext(record, operation, suffix) {
  return `${record.record_id || 'record'}:${operation.operation_id || 'operation'}:${suffix}`;
}

function checkOperation(record, operation, units, result) {
  const mappedIds = operationMappedIds(record, operation);
  const mappedRouteTags = operationMappedRouteTags(record, operation);
  const expectedRouteTags = operationExpectedRouteTags(operation);
  const requiredIds = asArray(operation.expected_required_mtu_ids);
  const forbiddenIds = asArray(operation.expected_forbidden_mtu_ids);
  const forbiddenRouteTags = asArray(operation.expected_forbidden_route_tags);
  const answerFormIds = asArray(operation.expected_answer_form_mtu_ids);
  const incidenceIds = asArray(operation.expected_incidence_mtu_ids);
  const scalingIds = asArray(operation.expected_scaling_mtu_ids);
  const misconceptionRefs = asArray(operation.expected_misconception_refs);
  const reviewedEquivalents = asArray(operation.reviewed_equivalent_refs);
  const reviewHooks = asArray(operation.review_required_hooks);
  const context = assertionContext(record, operation, 'ASSERT');

  if (operation.missing_mtu_expected === true || (requiredIds.length === 0 && reviewedEquivalents.length === 0 && reviewHooks.length === 0)) {
    add(result.buckets.failed, `${context}-MISSING-OPERATION-MTU`, {
      record_id: record.record_id,
      operation_id: operation.operation_id,
      defect_class: 'missing_mtu_for_correction_model_operation',
      reason: 'official correction-model operation has no required live MTU or reviewed equivalent',
    });
  } else {
    liveIds(requiredIds, units, result, `${context}-REQUIRED`, 'missing_mtu_for_correction_model_operation');
  }

  const overTriggers = [...new Set(mappedIds.filter((id) => forbiddenIds.includes(id)))];
  if (overTriggers.length > 0) {
    add(result.buckets.failed, `${context}-OVER-TRIGGER`, {
      record_id: record.record_id,
      operation_id: operation.operation_id,
      defect_class: 'over_triggered_prerequisite_not_required_by_answer_model',
      unit_ids: overTriggers,
      reason: 'mapped MTUs include units explicitly forbidden by the reviewed answer model',
    });
  }

  const forbiddenMappedRouteTags = [...mappedRouteTags].filter((tag) => forbiddenRouteTags.includes(tag));
  for (const routeTag of forbiddenMappedRouteTags) {
    add(result.buckets.failed, `${context}-FORBIDDEN-ROUTE-${routeTag}`, {
      record_id: record.record_id,
      operation_id: operation.operation_id,
      defect_class: defectForForbiddenRouteTag(routeTag),
      route_tag: routeTag,
      reason: 'mapped route tags include a route explicitly forbidden by the reviewed answer model',
    });
  }

  if (expectedRouteTags.has('non_calculus') && (mappedRouteTags.has('calculus') || mappedRouteTags.has('derivative_route') || mappedRouteTags.has('calculus_route'))) {
    add(result.buckets.failed, `${context}-CALCULUS-ROUTE`, {
      record_id: record.record_id,
      operation_id: operation.operation_id,
      defect_class: 'calculus_route_triggered_where_non_calculus_route_intended',
      reason: 'operation expects a non-calculus route but mapped route tags include calculus/derivative route',
    });
  }

  if (expectedRouteTags.has('point_calculation') && mappedRouteTags.has('function_construction')) {
    add(result.buckets.failed, `${context}-FUNCTION-CONSTRUCTION`, {
      record_id: record.record_id,
      operation_id: operation.operation_id,
      defect_class: 'function_construction_route_triggered_when_point_calculation_enough',
      reason: 'operation expects point calculation but mapped route tags include function construction',
    });
  }

  if (operation.incidence_or_pass_through_expected === true) {
    const liveIncidenceIds = liveIds(incidenceIds, units, result, `${context}-INCIDENCE`, 'incidence_pass_through_task_without_incidence_mtu');
    if (liveIncidenceIds.length === 0 && reviewedEquivalents.length === 0) {
      add(result.buckets.failed, `${context}-INCIDENCE-MISSING`, {
        record_id: record.record_id,
        operation_id: operation.operation_id,
        defect_class: 'incidence_pass_through_task_without_incidence_mtu',
        reason: 'incidence/pass-through operation has no incidence MTU or reviewed equivalent',
      });
    }
  }

  if (hasText(record.question_word) && record.question_word !== 'not_applicable') {
    const liveAnswerFormIds = liveIds(answerFormIds, units, result, `${context}-ANSWER-FORM`, 'question_word_without_answer_form_mtu');
    if (liveAnswerFormIds.length === 0 && asArray(operation.answer_form_reviewed_equivalent_refs).length === 0) {
      add(result.buckets.failed, `${context}-ANSWER-FORM-MISSING`, {
        record_id: record.record_id,
        operation_id: operation.operation_id,
        defect_class: 'question_word_without_answer_form_mtu',
        question_word: record.question_word,
        expected_gap: operation.missing_answer_form_expected === true,
        reason: operation.missing_answer_form_expected === true
          ? 'question word has an explicit missing answer-form expectation'
          : 'question word has no answer-form MTU or reviewed equivalent',
      });
    }
  }

  if (operation.scale_factor_expected === true) {
    const liveScalingIds = liveIds(scalingIds, units, result, `${context}-SCALING`, 'scale_factor_usage_without_scaling_unit_mtu');
    if (liveScalingIds.length === 0 && asArray(operation.scaling_reviewed_equivalent_refs).length === 0) {
      add(result.buckets.failed, `${context}-SCALING-MISSING`, {
        record_id: record.record_id,
        operation_id: operation.operation_id,
        defect_class: 'scale_factor_usage_without_scaling_unit_mtu',
        reason: 'scale/unit operation has no scaling MTU or reviewed equivalent',
      });
    }
  }

  if (operation.predictable_misconception_expected === true && misconceptionRefs.length === 0) {
    add(result.buckets.failed, `${context}-MISCONCEPTION-MISSING`, {
      record_id: record.record_id,
      operation_id: operation.operation_id,
      defect_class: 'predictable_misconception_without_tag_or_equivalent_evidence',
      reason: 'predictable misconception is expected but no tag or equivalent evidence is cited',
    });
  }

  checkProcedureExpectations(record, operation, units, result, context);

  for (const hook of reviewHooks) {
    add(result.buckets.review_required, `${context}-REVIEW-${hook}`, {
      record_id: record.record_id,
      operation_id: operation.operation_id,
      hook,
      reason: 'fixture marks this validator hook as review_required',
    });
  }
}

function runFixture(fixture, units, options = {}) {
  const result = {
    schema_version: 1,
    sprint_id: 'MTU-H5',
    fixture_id: fixture.fixture_id || fixture.sample_id || null,
    status: 'pending',
    required_defect_classes: REQUIRED_DEFECT_CLASSES,
    procedure_checks: [],
    buckets: {
      passed: [],
      failed: [],
      review_required: [],
      blocked: [],
    },
  };

  validateFixtureEnvelope(fixture, result, options);
  for (const record of asArray(fixture.records)) {
    validateRecordShape(record, result);
    for (const operation of asArray(record.official_correction_model_operations)) {
      checkOperation(record, operation, units, result);
    }
  }

  if (!options.skipNegativeFixtures) {
    for (const negative of asArray(fixture.negative_fixtures)) {
      const negativeResult = runFixture({
        ...fixture,
        fixture_id: negative.fixture_id,
        records: asArray(negative.records),
        negative_fixtures: [],
        status: 'approved_for_mtu_h5_regression',
      }, units, { skipNegativeFixtures: true });
      if (negative.expected_status !== 'fail') {
        add(result.buckets.blocked, `MTUH5-NEGATIVE-${negative.fixture_id}-STATUS`, {
          reason: 'negative fixture expected_status must be fail',
        });
      } else if (negativeResult.buckets.failed.length === 0) {
        add(result.buckets.failed, `MTUH5-NEGATIVE-${negative.fixture_id}-DID-NOT-FAIL`, {
          defect_class: 'negative_fixture_regression',
          reason: 'negative fixture did not trigger any failed assertions',
        });
      } else {
        const failedDefectClasses = [
          ...new Set(negativeResult.buckets.failed.map((entry) => entry.defect_class).filter(Boolean)),
        ];
        add(result.buckets.passed, `MTUH5-NEGATIVE-${negative.fixture_id}-FAILS-AS-EXPECTED`, {
          defect_classes: failedDefectClasses,
          failed_assertion_ids: negativeResult.buckets.failed.map((entry) => entry.assertion_id),
          reason: 'negative fixture triggered failed assertions as expected',
        });
      }
    }
  }

  if (result.buckets.blocked.length > 0) result.status = 'blocked';
  else if (result.buckets.failed.length > 0) result.status = 'failed';
  else if (result.buckets.review_required.length > 0) result.status = 'review_required';
  else result.status = 'passed';

  return result;
}

function main() {
  const options = parseArgs(process.argv);
  if (!fs.existsSync(SAMPLE_PACKET)) fail(`missing sample-selection packet: ${rel(SAMPLE_PACKET)}`);
  const units = loadUnits();

  if (!fs.existsSync(options.fixture)) {
    const result = blockedResult(`approved fixture missing: ${rel(options.fixture)}`);
    output(result, options.json);
    if (options.allowBlocked) return;
    process.exit(1);
  }

  const fixture = readJson(options.fixture);
  const result = runFixture(fixture, units, { allowReviewCandidate: options.allowReviewCandidate });
  output(result, options.json);

  if (options.expectFail && result.buckets.failed.length === 0) {
    fail('expected fixture to fail, but no failed assertions were produced');
  }
  if (!options.expectFail && result.status !== 'passed' && result.status !== 'review_required') {
    process.exit(1);
  }
}

main();
