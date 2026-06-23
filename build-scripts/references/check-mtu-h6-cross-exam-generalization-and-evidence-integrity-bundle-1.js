#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { execFileSync } = require('child_process');

const { resolveEvidenceRef, splitRef } = require('./lib/evidence-reference-resolver.js');

const ROOT = process.cwd();
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h6-cross-exam-generalization-fixture.json');
const REPORT_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h6-cross-exam-generalization-report.json');
const REPORT_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h6-cross-exam-generalization-report.md');
const PACKAGE_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.json');
const PACKAGE_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.md');
const GATE_ID = 'GATE-MTU-H6-cross-exam-generalization-and-evidence-integrity-bundle-1';
const GATE_DIR = path.join(ROOT, 'reports', 'review-gates', GATE_ID);
const GATE_JSON = path.join(GATE_DIR, 'review-packet.json');
const GATE_MD = path.join(GATE_DIR, 'review-packet.md');
const GATE_BUNDLE = path.join(GATE_DIR, 'bundle-urls.md');
const UNITS_PATH = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');

const PACKAGE_ID = 'MTU-H6-CROSS-EXAM-GENERALIZATION-AND-EVIDENCE-INTEGRITY-BUNDLE-1';
const FIXTURE_ID = 'MTU-H6-cross-exam-generalization-vwo-havo-2023-2024-review-candidate';
const SAMPLE_ID = 'MTU-H6-fresh-cross-exam-vwo-havo-2023-2024-sample-001';
const STATUS = 'ready_for_human_review_after_atomic_h6_closure_readiness_review';
const MANIFEST_ANCHOR = 'H6_FRESH_CROSS_EXAM_RENDERED_OFFICIAL_EVIDENCE_MANIFEST';

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
  'source_overlay_mutation_authorized',
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
  'scale_gate_1_authorized',
];

const FORBIDDEN_CHANGED_PREFIXES = [
  'references/machine/',
  'references/external/',
  'references/authored/',
  'references/data/exam-ingestion/',
  'references/candidates/',
  'reports/candidates/',
  'lesson-output/',
  'lessons/',
  'product/',
  'diagnostics/',
  'pv/',
];

const EXPECTED_RENDERED_MANIFEST = [
  {
    render_id: 'ha23-1-correction-11',
    role: 'official_correction_model_page',
    source_pdf_path: 'references/external/exams/ha-1022-a-23-1-c.pdf',
    source_pdf_sha256: 'e1bcf98aa57d79c883b5ca233954293f85073d4707b96df75493cc8912487b31',
    page_number: 11,
    rendered_png_path: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1-evidence/ha23-1-correction-11.png',
    rendered_png_sha256: '7f5448ddd067eafdcbb5856f3b56410ffcb68417bcbb671fd54494e3007b4305',
    width_px: 1489,
    height_px: 2105,
  },
  {
    render_id: 'ha23-1-opgave-08',
    role: 'official_prompt_page',
    source_pdf_path: 'references/external/exams/ha-1022-a-23-1-o.pdf',
    source_pdf_sha256: 'd57164b995c0a26c41865dd78973f55385dc20a5e29b0b3b9827a778494f2198',
    page_number: 8,
    rendered_png_path: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1-evidence/ha23-1-opgave-08.png',
    rendered_png_sha256: '7d3e8343119953d3670605b57f3fd08333c319dfa9040476bd1726bf66e73735',
    width_px: 1489,
    height_px: 2105,
  },
  {
    render_id: 'ha23-2-correction-08',
    role: 'official_correction_model_page',
    source_pdf_path: 'references/external/exams/ha-1022-a-23-2-c.pdf',
    source_pdf_sha256: '155b7adfdd6c711dd933fff4256045714d6fee4c75a52a5589f02b98064622e3',
    page_number: 8,
    rendered_png_path: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1-evidence/ha23-2-correction-08.png',
    rendered_png_sha256: '5639fe59ae1a18b4c24f944a6c526a8e5d4e1247556960201a3757999d1ec094',
    width_px: 1489,
    height_px: 2105,
  },
  {
    render_id: 'ha23-2-opgave-05',
    role: 'official_prompt_page',
    source_pdf_path: 'references/external/exams/ha-1022-a-23-2-o.pdf',
    source_pdf_sha256: '2eca63d9fc6828e1e68018b113b3b8ab0f637a1d21e662a0d6f2e4f1519fb880',
    page_number: 5,
    rendered_png_path: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1-evidence/ha23-2-opgave-05.png',
    rendered_png_sha256: '61ac70b0f5a969c89a1b1046d4fd10e722a238db563116413aa3f502bbb84d0a',
    width_px: 1489,
    height_px: 2105,
  },
  {
    render_id: 'vw23-2-correction-12',
    role: 'official_correction_model_page',
    source_pdf_path: 'references/external/exams/vw-1022-a-23-2-c.pdf',
    source_pdf_sha256: '5e1ce21751e52f760c5dfe2882afe91e06717219c6afbf036dadd2797f3b36ba',
    page_number: 12,
    rendered_png_path: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1-evidence/vw23-2-correction-12.png',
    rendered_png_sha256: '6fedd5fa199ea8e17f3fdb0e33053cebfaf0f50cc2b3fded5b974f6dbf1687f9',
    width_px: 1489,
    height_px: 2105,
  },
  {
    render_id: 'vw23-2-opgave-11',
    role: 'official_prompt_page',
    source_pdf_path: 'references/external/exams/vw-1022-a-23-2-o.pdf',
    source_pdf_sha256: '5d54e348b3360edaec50a6129d24fb8e58ca446ebe1f2c2e5e6a23e01137733b',
    page_number: 11,
    rendered_png_path: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1-evidence/vw23-2-opgave-11.png',
    rendered_png_sha256: '9382455067229918b5907df1907634a2bbc97b39bb15aad7c978a9645bde1890',
    width_px: 1489,
    height_px: 2105,
  },
  {
    render_id: 'vw24-1-correction-06',
    role: 'official_correction_model_page',
    source_pdf_path: 'references/external/exams/vw-1022-a-24-1-c.pdf',
    source_pdf_sha256: 'faad3d1db469c529834e11288d99d88e0193b4a435261496863a57215373c70f',
    page_number: 6,
    rendered_png_path: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1-evidence/vw24-1-correction-06.png',
    rendered_png_sha256: 'f39731f73ed2d97d7d9c39e5d5508d482606254ab680a2c4883d447ed744560a',
    width_px: 1489,
    height_px: 2105,
  },
  {
    render_id: 'vw24-1-correction-07',
    role: 'official_correction_model_page',
    source_pdf_path: 'references/external/exams/vw-1022-a-24-1-c.pdf',
    source_pdf_sha256: 'faad3d1db469c529834e11288d99d88e0193b4a435261496863a57215373c70f',
    page_number: 7,
    rendered_png_path: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1-evidence/vw24-1-correction-07.png',
    rendered_png_sha256: '19bcc14e61a5f236e12eb585c6d60c0986f2b3c20fea23428ab1fafaaa10872f',
    width_px: 1489,
    height_px: 2105,
  },
  {
    render_id: 'vw24-1-correction-08',
    role: 'official_correction_model_page',
    source_pdf_path: 'references/external/exams/vw-1022-a-24-1-c.pdf',
    source_pdf_sha256: 'faad3d1db469c529834e11288d99d88e0193b4a435261496863a57215373c70f',
    page_number: 8,
    rendered_png_path: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1-evidence/vw24-1-correction-08.png',
    rendered_png_sha256: 'fb6ba35b53306bfd5444d37a40b872975dfd4f7245ec9b441e9710f479e9c9fe',
    width_px: 1489,
    height_px: 2105,
  },
  {
    render_id: 'vw24-1-opgave-03',
    role: 'official_prompt_page',
    source_pdf_path: 'references/external/exams/vw-1022-a-24-1-o.pdf',
    source_pdf_sha256: '4239099731dec0aac021d0377602a71f11be5450590c278cc864d7650090686f',
    page_number: 3,
    rendered_png_path: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1-evidence/vw24-1-opgave-03.png',
    rendered_png_sha256: '991b7789a69405cfd70b59619971814d13f651108dd3b28539d05388e6dc1d61',
    width_px: 1489,
    height_px: 2105,
  },
  {
    render_id: 'vw24-1-opgave-04',
    role: 'official_prompt_page',
    source_pdf_path: 'references/external/exams/vw-1022-a-24-1-o.pdf',
    source_pdf_sha256: '4239099731dec0aac021d0377602a71f11be5450590c278cc864d7650090686f',
    page_number: 4,
    rendered_png_path: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1-evidence/vw24-1-opgave-04.png',
    rendered_png_sha256: '8b4d9de95790062a857183ad586a1276742a606263af39a37259eb61eaebcb82',
    width_px: 1489,
    height_px: 2105,
  },
  {
    render_id: 'vw24-2-correction-10',
    role: 'official_correction_model_page',
    source_pdf_path: 'references/external/exams/vw-1022-a-24-2-c.pdf',
    source_pdf_sha256: '8981461d5c43d8b072c605273ab3d555ccf15270062cf3d6d98ef832cd693045',
    page_number: 10,
    rendered_png_path: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1-evidence/vw24-2-correction-10.png',
    rendered_png_sha256: 'b304357c28ea984f65d489b65e9725ba2c318d50e6f8c3eaedad9bec141cb880',
    width_px: 1489,
    height_px: 2105,
  },
  {
    render_id: 'vw24-2-opgave-09',
    role: 'official_prompt_page',
    source_pdf_path: 'references/external/exams/vw-1022-a-24-2-o.pdf',
    source_pdf_sha256: '08a26f8deea66bf92b99817fdcc311792e08a4b8cfa79d62339a2fffd9a3d210',
    page_number: 9,
    rendered_png_path: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1-evidence/vw24-2-opgave-09.png',
    rendered_png_sha256: 'da4cb4ab3cd26abbfba18152094ded24c77328dcd3cbe616f491108cb6c2ba2b',
    width_px: 1489,
    height_px: 2105,
  },
];

function fail(message) {
  console.error(`MTU-H6 cross-exam evidence-integrity check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function readJson(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${rel(file)}`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${rel(file)}: ${error.message}`);
  }
}

function readText(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${rel(file)}`);
  return fs.readFileSync(file, 'utf8');
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function sha256File(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolutePath)) fail(`missing file: ${relativePath}`);
  return crypto.createHash('sha256').update(fs.readFileSync(absolutePath)).digest('hex');
}

function pngDimensions(relativePath) {
  const buffer = fs.readFileSync(path.join(ROOT, relativePath));
  assert(buffer.slice(1, 4).toString('ascii') === 'PNG', `${relativePath} must be a PNG`);
  return {
    width_px: buffer.readUInt32BE(16),
    height_px: buffer.readUInt32BE(20),
  };
}

function loadUnits() {
  const units = readJson(UNITS_PATH);
  assert(Array.isArray(units), `${rel(UNITS_PATH)} must contain an array`);
  return new Map(units.map((unit) => [unit.id, unit]));
}

function expectFalseBoundary(boundary, context) {
  for (const key of AUTHORITY_FALSE_KEYS) {
    assert(boundary && boundary[key] === false, `${context}.${key} must be false`);
  }
}

function expectsProcedure(unit) {
  return ['apply', 'analyze', 'analyse', 'evaluate'].includes(String(unit?.mastery_target || '').toLowerCase());
}

function mappedIds(record, operation) {
  return new Set([
    ...asArray(record.mapped_mtu_ids),
    ...asArray(operation.mapped_mtu_ids),
  ].filter(Boolean));
}

function mappedRouteTags(record, operation) {
  return new Set([
    ...asArray(record.mapped_route_tags),
    ...asArray(operation.mapped_route_tags),
  ].filter(Boolean));
}

function add(bucket, assertionId, detail) {
  bucket.push({ assertion_id: assertionId, ...detail });
}

function checkRefs(references, context, result) {
  for (const reference of references || []) {
    const resolved = resolveEvidenceRef(ROOT, reference);
    if (!resolved.ok) {
      add(result.buckets.failed, `${context}-BAD-REF-${result.buckets.failed.length + 1}`, {
        defect_class: 'evidence_reference_integrity_gap',
        reference,
        reason: resolved.reason,
      });
    }
  }
}

function collectOperationRefs(operation) {
  return [
    ...asArray(operation.official_evidence_refs),
    ...asArray(operation.reviewed_equivalent_operation_refs),
    ...asArray(operation.reviewed_equivalent_answer_skill_refs),
    ...asArray(operation.expected_misconception_refs),
  ];
}

function checkRequiredUnits(record, operation, units, result, context) {
  const ids = mappedIds(record, operation);
  for (const unitId of [
    ...asArray(operation.expected_required_mtu_ids),
    ...asArray(operation.expected_answer_form_mtu_ids),
    ...asArray(operation.expected_incidence_mtu_ids),
    ...asArray(operation.expected_scaling_mtu_ids),
    ...asArray(operation.expected_procedure_unit_ids),
  ]) {
    if (!units.has(unitId)) {
      add(result.buckets.failed, `${context}-UNKNOWN-${unitId}`, {
        record_id: record.record_id,
        operation_id: operation.operation_id,
        defect_class: 'canonical_mtu_gap',
        unit_id: unitId,
        reason: `expected live MTU ${unitId} is absent from the canonical registry`,
      });
    } else if (!ids.has(unitId)) {
      add(result.buckets.failed, `${context}-MISSING-${unitId}`, {
        record_id: record.record_id,
        operation_id: operation.operation_id,
        defect_class: 'missing_mtu_for_correction_model_operation',
        unit_id: unitId,
        reason: `expected MTU ${unitId} is not present in mapped_mtu_ids`,
      });
    }
  }
}

function checkRequiredRoutes(record, operation, result, context) {
  const tags = mappedRouteTags(record, operation);
  for (const tag of asArray(operation.expected_route_tags)) {
    if (!tags.has(tag)) {
      add(result.buckets.failed, `${context}-MISSING-ROUTE-${tag}`, {
        record_id: record.record_id,
        operation_id: operation.operation_id,
        defect_class: 'missing_route_tag_for_correction_model_operation',
        route_tag: tag,
        reason: `expected route tag ${tag} is not present in mapped_route_tags`,
      });
    }
  }
}

function checkForbidden(record, operation, result, context) {
  const ids = mappedIds(record, operation);
  const tags = mappedRouteTags(record, operation);
  for (const unitId of asArray(operation.expected_forbidden_mtu_ids)) {
    if (ids.has(unitId)) {
      add(result.buckets.failed, `${context}-FORBIDDEN-${unitId}`, {
        record_id: record.record_id,
        operation_id: operation.operation_id,
        defect_class: 'over_triggered_prerequisite_not_required_by_answer_model',
        unit_id: unitId,
        reason: `forbidden MTU ${unitId} is mapped`,
      });
    }
  }
  for (const tag of asArray(operation.expected_forbidden_route_tags)) {
    if (tags.has(tag)) {
      add(result.buckets.failed, `${context}-FORBIDDEN-ROUTE-${tag}`, {
        record_id: record.record_id,
        operation_id: operation.operation_id,
        defect_class: tag.includes('calculus')
          ? 'calculus_route_triggered_where_non_calculus_route_intended'
          : 'over_triggered_prerequisite_not_required_by_answer_model',
        route_tag: tag,
        reason: `forbidden route tag ${tag} is mapped`,
      });
    }
  }
}

function checkAnswerForm(record, operation, result, context) {
  const answerFormIds = asArray(operation.expected_answer_form_mtu_ids);
  if (operation.missing_answer_form_expected === true) {
    add(result.buckets.review_required, `${context}-ANSWER-FORM-REVIEW`, {
      record_id: record.record_id,
      operation_id: operation.operation_id,
      defect_class: 'question_word_without_answer_form_mtu',
      question_word: operation.question_word || record.question_word,
      reason: operation.missing_answer_form_rationale || 'answer-form MTU or reviewed equivalent is intentionally unresolved',
    });
    return;
  }
  if (answerFormIds.length === 0 && !hasText(operation.not_applicable_answer_form_rationale)) {
    add(result.buckets.failed, `${context}-ANSWER-FORM-MISSING`, {
      record_id: record.record_id,
      operation_id: operation.operation_id,
      defect_class: 'question_word_without_answer_form_mtu',
      question_word: operation.question_word || record.question_word,
      reason: 'expected answer-form evidence is absent',
    });
  }
}

function checkSpecialExpectations(record, operation, result, context) {
  if (operation.scale_factor_expected === true && asArray(operation.expected_scaling_mtu_ids).length === 0) {
    add(result.buckets.failed, `${context}-SCALING-MISSING`, {
      record_id: record.record_id,
      operation_id: operation.operation_id,
      defect_class: 'scale_factor_usage_without_scaling_unit_mtu',
      reason: 'scale-factor operation has no expected_scaling_mtu_ids',
    });
  }
  if (operation.incidence_or_pass_through_expected === true && asArray(operation.expected_incidence_mtu_ids).length === 0) {
    add(result.buckets.failed, `${context}-INCIDENCE-MISSING`, {
      record_id: record.record_id,
      operation_id: operation.operation_id,
      defect_class: 'incidence_pass_through_task_without_incidence_mtu',
      reason: 'incidence/pass-through operation has no expected_incidence_mtu_ids',
    });
  }
  if (operation.predictable_misconception_expected === true && asArray(operation.expected_misconception_refs).length === 0) {
    add(result.buckets.failed, `${context}-MISCONCEPTION-MISSING`, {
      record_id: record.record_id,
      operation_id: operation.operation_id,
      defect_class: 'predictable_misconception_without_tag_or_equivalent_evidence',
      reason: 'predictable misconception has no evidence/tag reference',
    });
  }
}

function checkProcedure(record, operation, units, result, context) {
  for (const unitId of asArray(operation.expected_procedure_unit_ids)) {
    const unit = units.get(unitId);
    if (!unit) continue;
    if (!expectsProcedure(unit)) continue;
    if (!Array.isArray(unit.procedure) || unit.procedure.length === 0) {
      add(result.buckets.failed, `${context}-PROCEDURE-${unitId}`, {
        record_id: record.record_id,
        operation_id: operation.operation_id,
        defect_class: 'apply_analyze_unit_without_usable_canonical_procedure',
        unit_id: unitId,
        reason: 'apply/analyze/evaluate unit has no usable canonical procedure',
      });
    }
  }
}

function evaluateFixture(fixture, units) {
  const result = {
    schema_version: 1,
    sprint_id: 'MTU-H6',
    fixture_id: fixture.fixture_id,
    sample_id: fixture.sample_id,
    status: 'passed',
    buckets: { passed: [], failed: [], review_required: [], blocked: [] },
    record_outcomes: [],
  };

  expectFalseBoundary(fixture.authority_boundary, 'fixture.authority_boundary');
  checkRefs(fixture.source_basis?.primary_evidence || [], 'MTUH6-SOURCE-BASIS', result);

  for (const record of fixture.records || []) {
    const beforeFailed = result.buckets.failed.length;
    const beforeReview = result.buckets.review_required.length;
    checkRefs(record.source_evidence_paths || [], `MTUH6-${record.record_id}`, result);
    assert(Array.isArray(record.official_correction_model_operations) && record.official_correction_model_operations.length > 0, `${record.record_id} must have official_correction_model_operations`);

    for (const operation of record.official_correction_model_operations) {
      const context = `MTUH6-${record.record_id}-${operation.operation_id}`;
      assert(hasText(operation.operation_id), `${record.record_id} operation must have operation_id`);
      assert(hasText(operation.answer_model_summary), `${context} must have answer_model_summary`);
      checkRefs(collectOperationRefs(operation), context, result);
      checkRequiredUnits(record, operation, units, result, context);
      checkRequiredRoutes(record, operation, result, context);
      checkForbidden(record, operation, result, context);
      checkAnswerForm(record, operation, result, context);
      checkSpecialExpectations(record, operation, result, context);
      checkProcedure(record, operation, units, result, context);
    }

    const failed = result.buckets.failed.length > beforeFailed;
    const review = result.buckets.review_required.length > beforeReview;
    const status = failed ? 'failed' : review ? 'review_required' : 'passed';
    result.record_outcomes.push({
      record_id: record.record_id,
      expected_h6_status: record.expected_h6_status,
      actual_status: status,
      classification: record.expected_h6_classification,
    });
    add(result.buckets[status], `MTUH6-RECORD-${record.record_id}-${status}`, {
      record_id: record.record_id,
      defect_class: status === 'passed' ? 'generalized_pass' : record.expected_h6_classification,
      reason: record.expected_h6_rationale || `${record.record_id} evaluated as ${status}`,
    });
  }

  if (result.buckets.failed.length > 0) result.status = 'failed';
  else if (result.buckets.review_required.length > 0) result.status = 'review_required';

  return result;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function applyMutation(record, mutation) {
  const copy = clone(record);
  const applyToContainer = (container) => {
    if (mutation.add_mapped_mtu_ids) {
      container.mapped_mtu_ids = [...new Set([...asArray(container.mapped_mtu_ids), ...mutation.add_mapped_mtu_ids])];
    }
    if (mutation.remove_mapped_mtu_ids) {
      const remove = new Set(mutation.remove_mapped_mtu_ids);
      container.mapped_mtu_ids = asArray(container.mapped_mtu_ids).filter((id) => !remove.has(id));
    }
    if (mutation.add_mapped_route_tags) {
      container.mapped_route_tags = [...new Set([...asArray(container.mapped_route_tags), ...mutation.add_mapped_route_tags])];
    }
    if (mutation.remove_mapped_route_tags) {
      const remove = new Set(mutation.remove_mapped_route_tags);
      container.mapped_route_tags = asArray(container.mapped_route_tags).filter((tag) => !remove.has(tag));
    }
  };
  applyToContainer(copy);
  for (const operation of asArray(copy.official_correction_model_operations)) {
    applyToContainer(operation);
  }
  return copy;
}

function checkNegativeFixtures(fixture, units) {
  const recordsById = new Map((fixture.records || []).map((record) => [record.record_id, record]));
  const results = [];
  for (const negative of fixture.negative_regression_fixtures || []) {
    const base = recordsById.get(negative.based_on_record_id);
    assert(base, `${negative.fixture_id} base record ${negative.based_on_record_id} missing`);
    const mutated = applyMutation(base, negative.mutation || {});
    mutated.record_id = `${base.record_id}#${negative.fixture_id}`;
    mutated.expected_h6_status = 'failed';
    mutated.expected_h6_classification = negative.expected_failure_defect_class;
    const mini = {
      fixture_id: negative.fixture_id,
      sample_id: fixture.sample_id,
      source_basis: fixture.source_basis,
      authority_boundary: fixture.authority_boundary,
      records: [mutated],
    };
    const evaluation = evaluateFixture(mini, units);
    const matchingFailure = evaluation.buckets.failed.find((item) => (
      item.defect_class === negative.expected_failure_defect_class &&
      (!negative.expected_failure_operation_id || item.operation_id === negative.expected_failure_operation_id) &&
      (!negative.expected_failure_unit_id || item.unit_id === negative.expected_failure_unit_id) &&
      (!negative.expected_failure_route_tag || item.route_tag === negative.expected_failure_route_tag)
    ));
    assert(evaluation.status === 'failed', `${negative.fixture_id} must fail`);
    assert(
      matchingFailure,
      `${negative.fixture_id} must fail with ${negative.expected_failure_defect_class}` +
        `${negative.expected_failure_operation_id ? ` on ${negative.expected_failure_operation_id}` : ''}` +
        `${negative.expected_failure_unit_id ? ` for ${negative.expected_failure_unit_id}` : ''}` +
        `${negative.expected_failure_route_tag ? ` for ${negative.expected_failure_route_tag}` : ''}`
    );
    results.push({
      fixture_id: negative.fixture_id,
      status: 'failed_as_expected',
      expected_failure_defect_class: negative.expected_failure_defect_class,
      expected_failure_operation_id: negative.expected_failure_operation_id || null,
      expected_failure_unit_id: negative.expected_failure_unit_id || null,
      expected_failure_route_tag: negative.expected_failure_route_tag || null,
    });
  }
  assert(results.length >= (fixture.records || []).length, 'at least one negative regression fixture per fresh record is required');
  return results;
}

function checkExpectedOutcomes(fixture, evaluation) {
  const expectedById = new Map((fixture.records || []).map((record) => [record.record_id, record.expected_h6_status]));
  for (const outcome of evaluation.record_outcomes) {
    assert(outcome.actual_status === expectedById.get(outcome.record_id), `${outcome.record_id} expected ${expectedById.get(outcome.record_id)}, got ${outcome.actual_status}`);
  }
  const expected = fixture.expected_summary_counts;
  assert(expected, 'fixture.expected_summary_counts is required');
  assert(evaluation.buckets.passed.length === expected.passed, `expected ${expected.passed} passed records/assertions`);
  assert(evaluation.record_outcomes.filter((item) => item.actual_status === 'review_required').length === expected.review_required_records, `expected ${expected.review_required_records} review_required records`);
  assert(evaluation.record_outcomes.filter((item) => item.actual_status === 'failed').length === expected.failed_records, `expected ${expected.failed_records} failed records`);
}

function checkRenderedManifest(packet) {
  const manifest = packet[MANIFEST_ANCHOR];
  assert(manifest && manifest.anchor_id === MANIFEST_ANCHOR, `package must define ${MANIFEST_ANCHOR}`);
  assert(manifest.render_tool?.tool === 'Poppler pdftoppm', 'rendered manifest tool mismatch');
  assert(manifest.render_tool?.format === 'png', 'rendered manifest format mismatch');
  assert(manifest.render_tool?.dpi === 180, 'rendered manifest dpi mismatch');
  assert(Array.isArray(manifest.records), 'rendered manifest records must be array');
  assert(manifest.records.length === EXPECTED_RENDERED_MANIFEST.length, `rendered manifest must contain ${EXPECTED_RENDERED_MANIFEST.length} records`);
  const records = new Map(manifest.records.map((record) => [record.render_id, record]));
  assert(records.size === manifest.records.length, 'rendered manifest render_id values must be unique');
  const seenPngs = new Set();
  const seenPages = new Set();
  for (const expected of EXPECTED_RENDERED_MANIFEST) {
    const actual = records.get(expected.render_id);
    assert(actual, `rendered manifest missing ${expected.render_id}`);
    for (const [key, value] of Object.entries(expected)) {
      assert(actual[key] === value, `${expected.render_id}.${key} mismatch; expected ${value}, got ${actual[key]}`);
    }
    const pageKey = `${actual.source_pdf_path}#page=${actual.page_number}`;
    assert(!seenPages.has(pageKey), `rendered manifest duplicates source page ${pageKey}`);
    seenPages.add(pageKey);
    assert(!seenPngs.has(actual.rendered_png_path), `rendered manifest duplicates PNG ${actual.rendered_png_path}`);
    seenPngs.add(actual.rendered_png_path);
    assert(sha256File(actual.source_pdf_path) === actual.source_pdf_sha256, `${expected.render_id}.source_pdf_sha256 must match file`);
    assert(sha256File(actual.rendered_png_path) === actual.rendered_png_sha256, `${expected.render_id}.rendered_png_sha256 must match file`);
    const dimensions = pngDimensions(actual.rendered_png_path);
    assert(dimensions.width_px === actual.width_px, `${expected.render_id}.width_px must match PNG`);
    assert(dimensions.height_px === actual.height_px, `${expected.render_id}.height_px must match PNG`);
  }
  return seenPages;
}

function collectStrings(value, strings = []) {
  if (typeof value === 'string') {
    strings.push(value);
    return strings;
  }
  if (!value || typeof value !== 'object') return strings;
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, strings);
    return strings;
  }
  for (const item of Object.values(value)) collectStrings(item, strings);
  return strings;
}

function checkPdfFragmentIntegrity(surfaces, manifestPageKeys) {
  const refs = [];
  for (const surface of surfaces) refs.push(...collectStrings(surface));
  for (const reference of refs) {
    if (!/\.pdf#/i.test(reference)) continue;
    const { relativePath, fragment } = splitRef(reference);
    if (!/\.pdf$/i.test(relativePath)) continue;
    const pageMatch = fragment.match(/(?:^|[&?])page=(\d+)(?:$|&)/);
    assert(pageMatch, `PDF reference must include a page locator: ${reference}`);
    const pageKey = `${relativePath}#page=${Number(pageMatch[1])}`;
    assert(
      manifestPageKeys.has(pageKey),
      `PDF page locator must be backed by rendered evidence manifest: ${reference}`
    );
  }
}

function checkReport(report, evaluation) {
  assert(report.schema_version === 1, 'report schema_version must be 1');
  assert(report.sprint_id === 'MTU-H6', 'report sprint_id mismatch');
  assert(report.fixture_id === FIXTURE_ID, 'report fixture_id mismatch');
  assert(report.status === evaluation.status, 'report status must match live evaluation');
  assert(report.summary_counts.passed_records === evaluation.record_outcomes.filter((item) => item.actual_status === 'passed').length, 'report passed_records mismatch');
  assert(report.summary_counts.review_required_records === evaluation.record_outcomes.filter((item) => item.actual_status === 'review_required').length, 'report review_required_records mismatch');
  assert(report.summary_counts.failed_records === evaluation.record_outcomes.filter((item) => item.actual_status === 'failed').length, 'report failed_records mismatch');
  const byId = new Map(report.record_outcomes.map((item) => [item.record_id, item.actual_status]));
  for (const outcome of evaluation.record_outcomes) {
    assert(byId.get(outcome.record_id) === outcome.actual_status, `report status mismatch for ${outcome.record_id}`);
  }
}

function checkMarkdown(text, requiredStrings, context) {
  for (const value of requiredStrings) {
    assert(text.includes(value), `${context} must include ${value}`);
  }
}

function checkPackageAndGate(packet, gate, fixture, evaluation, negativeResults) {
  assert(packet.schema_version === 1 && packet.sprint_id === 'MTU-H6', 'package header mismatch');
  assert(packet.package_id === PACKAGE_ID && packet.gate_id === GATE_ID, 'package id mismatch');
  assert(packet.fixture_id === FIXTURE_ID && packet.sample_id === SAMPLE_ID, 'package fixture/sample mismatch');
  assert(packet.status === STATUS, 'package status mismatch');
  assert(packet.review_standard === 'REV-STD-1', 'package review standard mismatch');
  assert(gate.schema_version === 1 && gate.gate_id === GATE_ID && gate.package_id === PACKAGE_ID, 'gate header mismatch');
  assert(gate.status === 'pending_human_review', 'gate status mismatch');
  assert(gate.review_standard === 'REV-STD-1', 'gate review standard mismatch');
  assert(hasText(packet.product_end_state) && hasText(gate.product_end_state), 'product_end_state is required');
  assert(hasText(packet.original_sprint_gate_spec) && hasText(gate.original_sprint_gate_spec), 'original_sprint_gate_spec is required');
  expectFalseBoundary(packet.authority_boundary, 'package.authority_boundary');
  expectFalseBoundary(gate.authority_boundary, 'gate.authority_boundary');
  assert(packet.mtu_h6_full_closure_claimed === false, 'package must not claim MTU-H6 full closure');
  assert(packet.product_route_readiness_claimed === false, 'package must not claim product-route readiness');
  assert(packet.fixture_id === fixture.fixture_id, 'package fixture id must match fixture');
  assert(packet.live_evaluation_status === evaluation.status, 'package live_evaluation_status mismatch');
  assert(Array.isArray(packet.negative_regression_results) && packet.negative_regression_results.length === negativeResults.length, 'package negative regression result count mismatch');
  assert(Array.isArray(gate.non_negotiable_requirements) && gate.non_negotiable_requirements.length >= 6, 'gate non-negotiable requirements are required');
  assert(Array.isArray(gate.core_requirement_checklist) && gate.core_requirement_checklist.length >= 6, 'gate core requirement checklist is required');
  assert(Array.isArray(gate.findings) && gate.findings.length >= 3, 'gate findings are required');
  for (const finding of gate.findings) {
    assert(hasText(finding.classification), `${finding.finding_id} must include classification`);
    assert(Array.isArray(finding.blocks), `${finding.finding_id} must include blocks`);
    assert(Array.isArray(finding.does_not_block), `${finding.finding_id} must include does_not_block`);
    assert(hasText(finding.proof_required_to_close), `${finding.finding_id} must include proof_required_to_close`);
  }
  const reviewAgents = new Map((packet.subagent_review_results || []).map((row) => [row.agent, row.verdict]));
  for (const agent of ['teacher', 'economist', 'quality_inspection']) {
    assert(reviewAgents.get(agent) === 'MORE_THAN_SATISFIED_TO_ADVANCE_H6_REVIEW_CANDIDATE', `${agent} subagent verdict mismatch`);
  }
  assert(packet.subagent_lead_review?.lead_verdict === 'READY_FOR_HUMAN_REVIEW_AS_H6_REVIEW_CANDIDATE_NOT_CLOSURE', 'lead review verdict mismatch');
  const refs = [
    ...(packet.source_evidence || []),
    ...(gate.must_review || []),
    ...(gate.evidence_base || []),
  ];
  const bad = refs.map((reference) => resolveEvidenceRef(ROOT, reference)).filter((result) => !result.ok);
  assert(bad.length === 0, `package/gate evidence refs must resolve: ${bad.map((item) => `${item.reference} (${item.reason})`).join('; ')}`);
}

function checkGitScope() {
  let changed = [];
  try {
    changed = execFileSync('git', ['diff', '--name-only', 'origin/main...HEAD'], { cwd: ROOT, encoding: 'utf8' })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch (_error) {
    changed = [];
  }
  try {
    const statusChanged = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' })
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => line.slice(3).replace(/\\/g, '/'));
    changed.push(...statusChanged);
  } catch (_error) {
    // Git status is a hardening check only; do not mask the content checks.
  }
  const unique = [...new Set(changed.map((value) => value.replace(/\\/g, '/')))];
  for (const file of unique) {
    for (const prefix of FORBIDDEN_CHANGED_PREFIXES) {
      assert(!file.startsWith(prefix), `forbidden changed path under ${prefix}: ${file}`);
    }
  }
}

function main() {
  const jsonOutput = process.argv.includes('--json');
  const units = loadUnits();
  const fixture = readJson(FIXTURE);
  const report = readJson(REPORT_JSON);
  const packet = readJson(PACKAGE_JSON);
  const gate = readJson(GATE_JSON);
  const markdownReport = readText(REPORT_MD);
  const markdownPackage = readText(PACKAGE_MD);
  const markdownGate = readText(GATE_MD);
  const bundle = readText(GATE_BUNDLE);

  assert(fixture.schema_version === 1 && fixture.sprint_id === 'MTU-H6', 'fixture header mismatch');
  assert(fixture.fixture_id === FIXTURE_ID && fixture.sample_id === SAMPLE_ID, 'fixture id/sample mismatch');
  assert(fixture.status === 'review_candidate_for_mtu_h6_generalization', 'fixture status mismatch');
  expectFalseBoundary(fixture.authority_boundary, 'fixture.authority_boundary');

  checkGitScope();
  const evaluation = evaluateFixture(fixture, units);
  checkExpectedOutcomes(fixture, evaluation);
  const negativeResults = checkNegativeFixtures(fixture, units);
  const manifestPageKeys = checkRenderedManifest(packet);
  checkPdfFragmentIntegrity([fixture, packet, gate], manifestPageKeys);
  checkReport(report, evaluation);
  checkPackageAndGate(packet, gate, fixture, evaluation, negativeResults);

  checkMarkdown(markdownReport, ['MTU-H6 Cross-Exam Generalization Report', 'passed', 'q4 bounded A40', 'q23-specific macro'], rel(REPORT_MD));
  checkMarkdown(markdownPackage, ['MTU-H6 Cross-Exam Generalization And Evidence Integrity Bundle 1', 'not MTU-H6 closure', MANIFEST_ANCHOR], rel(PACKAGE_MD));
  checkMarkdown(markdownGate, ['GATE-MTU-H6 Cross-Exam Generalization And Evidence Integrity Bundle 1', 'pending human review', 'REV-STD-1'], rel(GATE_MD));
  checkMarkdown(bundle, [rel(PACKAGE_JSON), rel(FIXTURE), rel(REPORT_JSON)], rel(GATE_BUNDLE));

  const result = {
    schema_version: 1,
    sprint_id: 'MTU-H6',
    status: evaluation.status,
    fixture_id: FIXTURE_ID,
    sample_id: SAMPLE_ID,
    records: evaluation.record_outcomes,
    negative_regression_results: negativeResults,
    rendered_evidence_records: EXPECTED_RENDERED_MANIFEST.length,
  };

  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`MTU-H6 cross-exam evidence-integrity status: ${result.status}`);
    console.log(`records=${result.records.length} rendered_evidence=${result.rendered_evidence_records} negative=${negativeResults.length}`);
  }
}

if (require.main === module) main();
