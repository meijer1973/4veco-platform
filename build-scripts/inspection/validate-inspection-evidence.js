#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SCHEMA_PATH = path.join(REPO_ROOT, 'references', 'schemas', 'inspection-evidence.schema.json');

const REQUIRED_WORDING =
  'This schema is report-only and diagnostic. It does not create a quality gate, compliance claim, or generated-output mutation path.';

const STATUS = {
  pass: 'PASS_REPORT_ONLY',
  warn: 'PASS_WITH_WARNINGS_REPORT_ONLY',
  invalid: 'SCHEMA_INVALID_REPORT_ONLY',
};

const KNOWN_FORBIDDEN_PHRASES = [
  '4veco is compliant with Dutch inspection standards',
  '4veco is approved by the Dutch Inspectorate of Education',
  '4veco materials by themselves satisfy a school',
  '4veco provides OP0 evidence',
  '4veco provides complete OP0',
  '4veco provides school-wide basic-skills evidence',
  '4veco proves citizenship curriculum implementation',
  'inspection_ready',
  'certified',
  'final_school_evidence',
  'complete_OP0',
];

function usage() {
  return [
    'Usage:',
    '  node build-scripts/inspection/validate-inspection-evidence.js --input <file> --report-only [--mode pilot|full-report] [--json]',
    '',
    'This validator is diagnostic and report-only. It is not a build gate.',
  ].join('\n');
}

function parseArgs(argv) {
  const options = { mode: 'pilot', json: false, reportOnly: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--input') {
      index += 1;
      options.input = argv[index];
    } else if (arg === '--report-only') {
      options.reportOnly = true;
    } else if (arg === '--mode') {
      index += 1;
      options.mode = argv[index];
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else {
      options.unknown = arg;
    }
  }
  return options;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    const wrapped = new Error(`Could not read JSON: ${file}: ${error.message}`);
    wrapped.code = 'JSON_READ_ERROR';
    throw wrapped;
  }
}

function pointer(...parts) {
  return parts.join('.');
}

function add(list, severity, pathLabel, message) {
  list.push({ severity, path: pathLabel, message });
}

function enumValues(schema, defName) {
  return new Set(schema.$defs[defName].enum);
}

function propConst(schema, propName) {
  return schema.properties[propName].const;
}

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function requireObject(findings, value, pathLabel) {
  if (!isObject(value)) {
    add(findings, 'error', pathLabel, 'must be an object');
    return false;
  }
  return true;
}

function requireArray(findings, value, pathLabel, { minItems = 0 } = {}) {
  if (!Array.isArray(value)) {
    add(findings, 'error', pathLabel, 'must be an array');
    return false;
  }
  if (value.length < minItems) {
    add(findings, 'error', pathLabel, `must contain at least ${minItems} item(s)`);
  }
  return true;
}

function requireString(findings, value, pathLabel) {
  if (typeof value !== 'string' || value.trim() === '') {
    add(findings, 'error', pathLabel, 'must be a non-empty string');
    return false;
  }
  return true;
}

function requireConst(findings, value, expected, pathLabel) {
  if (value !== expected) {
    add(findings, 'error', pathLabel, `must be ${JSON.stringify(expected)}`);
  }
}

function requireEnum(findings, value, allowed, pathLabel) {
  if (!allowed.has(value)) {
    add(findings, 'error', pathLabel, `must be one of: ${Array.from(allowed).join(', ')}`);
  }
}

function scanKnownForbiddenPhrases(findings, value, pathLabel) {
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    for (const phrase of KNOWN_FORBIDDEN_PHRASES) {
      if (lower.includes(phrase.toLowerCase())) {
        add(
          findings,
          'error',
          pathLabel,
          `contains known forbidden phrase: ${phrase}`
        );
      }
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanKnownForbiddenPhrases(findings, item, `${pathLabel}[${index}]`));
    return;
  }
  if (isObject(value)) {
    for (const [key, item] of Object.entries(value)) {
      scanKnownForbiddenPhrases(findings, item, pointer(pathLabel, key));
    }
  }
}

function validateDiagnosticPolicy(findings, schema, record) {
  if (!requireObject(findings, record.diagnostic_policy, 'diagnostic_policy')) return;
  const policy = record.diagnostic_policy;
  const required = schema.$defs.diagnostic_policy.required;
  for (const field of required) {
    if (!(field in policy)) add(findings, 'error', `diagnostic_policy.${field}`, 'is required');
  }
  for (const field of [
    'report_only',
    'diagnostic_only',
    'fail_builds',
    'block_paragraph_production',
    'quality_gate',
    'mutate_generated_output',
    'compliance_claim',
  ]) {
    const expected = schema.$defs.diagnostic_policy.properties[field].const;
    requireConst(findings, policy[field], expected, `diagnostic_policy.${field}`);
  }
  requireConst(findings, policy.required_wording, REQUIRED_WORDING, 'diagnostic_policy.required_wording');
}

function validateScope(findings, record) {
  if (!requireObject(findings, record.generated_for_scope, 'generated_for_scope')) return;
  const scope = record.generated_for_scope;
  requireString(findings, scope.book, 'generated_for_scope.book');
  requireString(findings, scope.chapter, 'generated_for_scope.chapter');
  if (requireArray(findings, scope.paragraph_ids, 'generated_for_scope.paragraph_ids', { minItems: 1 })) {
    scope.paragraph_ids.forEach((id, index) => requireString(findings, id, `generated_for_scope.paragraph_ids[${index}]`));
  }
  if (requireArray(findings, scope.live_blueprint_titles, 'generated_for_scope.live_blueprint_titles', { minItems: 1 })) {
    scope.live_blueprint_titles.forEach((title, index) => {
      const base = `generated_for_scope.live_blueprint_titles[${index}]`;
      if (!requireObject(findings, title, base)) return;
      requireString(findings, title.paragraph_id, `${base}.paragraph_id`);
      requireString(findings, title.title, `${base}.title`);
      requireString(findings, title.source_path, `${base}.source_path`);
    });
  }
}

function validateTitleSourceReconciliation(findings, schema, record) {
  if (!requireObject(findings, record.title_source_reconciliation, 'title_source_reconciliation')) return;
  const reconciliation = record.title_source_reconciliation;
  requireString(findings, reconciliation.live_blueprint_source, 'title_source_reconciliation.live_blueprint_source');
  if (typeof reconciliation.mismatch_detected !== 'boolean') {
    add(findings, 'error', 'title_source_reconciliation.mismatch_detected', 'must be a boolean');
  }
  if (
    requireArray(findings, reconciliation.checked_sources, 'title_source_reconciliation.checked_sources', {
      minItems: 1,
    })
  ) {
    const allowed = new Set(schema.$defs.title_check_source.properties.source_type.enum);
    reconciliation.checked_sources.forEach((source, index) => {
      const base = `title_source_reconciliation.checked_sources[${index}]`;
      if (!requireObject(findings, source, base)) return;
      requireEnum(findings, source.source_type, allowed, `${base}.source_type`);
      requireString(findings, source.source_path_or_note, `${base}.source_path_or_note`);
      requireString(findings, source.observed_title, `${base}.observed_title`);
    });
  }
  requireString(findings, reconciliation.reconciliation_note, 'title_source_reconciliation.reconciliation_note');
}

function validateSourcePointer(findings, schema, source, pathLabel) {
  if (!requireObject(findings, source, pathLabel)) return;
  const sourceTypeAllowed = new Set(schema.$defs.source_pointer.properties.source_type.enum);
  requireEnum(findings, source.source_type, sourceTypeAllowed, `${pathLabel}.source_type`);
  requireString(findings, source.path_or_url, `${pathLabel}.path_or_url`);
  requireString(findings, source.cited_claim, `${pathLabel}.cited_claim`);
  if (source.evidence_finality !== undefined) {
    const finalityAllowed = enumValues(schema, 'evidence_finality');
    if (requireArray(findings, source.evidence_finality, `${pathLabel}.evidence_finality`)) {
      source.evidence_finality.forEach((value, index) =>
        requireEnum(findings, value, finalityAllowed, `${pathLabel}.evidence_finality[${index}]`)
      );
    }
  }
}

function validateProductSchoolBoundary(findings, boundary, pathLabel) {
  if (!requireObject(findings, boundary, pathLabel)) return;
  requireString(findings, boundary['4veco_evidence'], `${pathLabel}.4veco_evidence`);
  requireString(findings, boundary.school_owned_evidence, `${pathLabel}.school_owned_evidence`);
  requireString(findings, boundary.forbidden_inference, `${pathLabel}.forbidden_inference`);
}

function validateOp0Boundary(findings, boundary, pathLabel) {
  if (!requireObject(findings, boundary, pathLabel)) return;
  requireConst(findings, boundary.not_complete_op0_evidence, true, `${pathLabel}.not_complete_op0_evidence`);
  requireConst(
    findings,
    boundary.not_school_wide_basic_skills_evidence,
    true,
    `${pathLabel}.not_school_wide_basic_skills_evidence`
  );
  requireConst(
    findings,
    boundary.not_citizenship_curriculum_proof,
    true,
    `${pathLabel}.not_citizenship_curriculum_proof`
  );
  requireString(findings, boundary.boundary_note, `${pathLabel}.boundary_note`);
}

function validateCategoryRecords(findings, warnings, schema, record, mode) {
  if (!requireArray(findings, record.category_records, 'category_records', { minItems: 1 })) return;

  const categoryAllowed = enumValues(schema, 'category_id');
  const outcomeAllowed = enumValues(schema, 'category_outcome');
  const stateAllowed = enumValues(schema, 'evidence_state');
  const finalityAllowed = enumValues(schema, 'evidence_finality');
  const targetProofAllowed = enumValues(schema, 'target_equivalent_proof_status');
  const seen = new Set();

  for (const [index, category] of record.category_records.entries()) {
    const base = `category_records[${index}]`;
    if (!requireObject(findings, category, base)) continue;

    requireEnum(findings, category.category_id, categoryAllowed, `${base}.category_id`);
    requireEnum(findings, category.category_outcome, outcomeAllowed, `${base}.category_outcome`);
    requireEnum(findings, category.evidence_state, stateAllowed, `${base}.evidence_state`);
    if (seen.has(category.category_id)) {
      add(findings, 'error', `${base}.category_id`, `duplicate category ${category.category_id}`);
    }
    seen.add(category.category_id);

    if (category.category_outcome === 'accepted_as_present_but_weak') {
      add(warnings, 'warning', `${base}.category_outcome`, 'weak category outcome is valid but should remain visible');
    }
    if (category.evidence_state === 'present_but_weak') {
      add(warnings, 'warning', `${base}.evidence_state`, 'weak evidence is valid evidence, not a schema failure');
    }

    if (requireArray(findings, category.evidence_finality, `${base}.evidence_finality`, { minItems: 1 })) {
      category.evidence_finality.forEach((value, finalityIndex) => {
        requireEnum(findings, value, finalityAllowed, `${base}.evidence_finality[${finalityIndex}]`);
        if (['target_exercise_migrated', 'diagnostic_report_only', 'pass_with_flags'].includes(value)) {
          add(warnings, 'warning', `${base}.evidence_finality[${finalityIndex}]`, `${value} is valid but not final proof`);
        }
      });
    }

    if (requireArray(findings, category.source_pointers, `${base}.source_pointers`)) {
      category.source_pointers.forEach((source, sourceIndex) =>
        validateSourcePointer(findings, schema, source, `${base}.source_pointers[${sourceIndex}]`)
      );
    }
    validateProductSchoolBoundary(findings, category.product_school_boundary, `${base}.product_school_boundary`);
    requireString(findings, category.report_claim, `${base}.report_claim`);
    requireArray(findings, category.known_flags, `${base}.known_flags`);

    if (category.category_id === 'assessment_and_closure') {
      requireEnum(
        findings,
        category.target_equivalent_proof_status,
        targetProofAllowed,
        `${base}.target_equivalent_proof_status`
      );
      if (
        [
          'target_exercise_migrated_needs_review',
          'target_equivalent_not_started',
          'target_equivalent_advisory_only',
          'target_equivalent_candidate',
        ].includes(category.target_equivalent_proof_status)
      ) {
        add(
          warnings,
          'warning',
          `${base}.target_equivalent_proof_status`,
          `${category.target_equivalent_proof_status} is valid but weak/non-final proof`
        );
      }
    }

    if (category.category_id === 'basic_skills') {
      requireConst(
        findings,
        category.subject_material_basic_skills_label,
        'subject_material_basic_skills_evidence',
        `${base}.subject_material_basic_skills_label`
      );
      validateOp0Boundary(findings, category.op0_boundary, `${base}.op0_boundary`);
    }
  }

  if (mode === 'full-report') {
    for (const category of categoryAllowed) {
      if (!seen.has(category)) {
        add(findings, 'error', 'category_records', `full-report mode requires category ${category}`);
      }
    }
  }
}

function validateReportClaimBoundaries(findings, record) {
  if (!requireObject(findings, record.report_claim_boundaries, 'report_claim_boundaries')) return;
  const boundaries = record.report_claim_boundaries;
  requireString(findings, boundaries.safe_claim, 'report_claim_boundaries.safe_claim');
  requireArray(findings, boundaries.forbidden_claims, 'report_claim_boundaries.forbidden_claims', { minItems: 1 });
  requireString(findings, boundaries.school_boundary_note, 'report_claim_boundaries.school_boundary_note');
  requireString(findings, boundaries.op0_boundary_note, 'report_claim_boundaries.op0_boundary_note');
}

function validateRecord(schema, record, mode) {
  const findings = [];
  const warnings = [];

  if (!requireObject(findings, record, 'root')) return { findings, warnings };

  requireConst(findings, record.schema_version, propConst(schema, 'schema_version'), 'schema_version');
  requireConst(findings, record.schema_usage, 'report_only', 'schema_usage');
  validateDiagnosticPolicy(findings, schema, record);
  requireConst(findings, record.profile_id, propConst(schema, 'profile_id'), 'profile_id');
  requireConst(findings, record.profile_version, propConst(schema, 'profile_version'), 'profile_version');
  requireEnum(findings, record.record_status, new Set(schema.properties.record_status.enum), 'record_status');
  requireConst(findings, record.jurisdiction, propConst(schema, 'jurisdiction'), 'jurisdiction');
  requireConst(findings, record.sector, propConst(schema, 'sector'), 'sector');
  requireConst(findings, record.subject_focus, propConst(schema, 'subject_focus'), 'subject_focus');
  validateScope(findings, record);
  validateTitleSourceReconciliation(findings, schema, record);
  validateCategoryRecords(findings, warnings, schema, record, mode);
  validateReportClaimBoundaries(findings, record);
  requireString(findings, record.next_action, 'next_action');

  if (record.known_limitations !== undefined) {
    requireArray(findings, record.known_limitations, 'known_limitations');
  }

  if (isObject(record.report_claim_boundaries)) {
    scanKnownForbiddenPhrases(findings, record.report_claim_boundaries.safe_claim, 'report_claim_boundaries.safe_claim');
  }
  if (Array.isArray(record.category_records)) {
    for (const [index, category] of record.category_records.entries()) {
      scanKnownForbiddenPhrases(findings, category.report_claim, `category_records[${index}].report_claim`);
    }
  }

  return { findings, warnings };
}

function printResult(result, json) {
  if (json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.log(result.status);
  console.log(`mode: ${result.mode}`);
  console.log(`input: ${result.input}`);
  console.log(`schema: ${result.schema}`);
  console.log(`errors: ${result.errors.length}`);
  console.log(`warnings: ${result.warnings.length}`);
  console.log('claim_safety_note: known-phrase checks are limited and do not replace human claim-safety review');
  for (const finding of result.errors) {
    console.log(`error: ${finding.path}: ${finding.message}`);
  }
  for (const warning of result.warnings) {
    console.log(`warning: ${warning.path}: ${warning.message}`);
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  const setupFindings = [];
  if (options.unknown) add(setupFindings, 'error', 'argv', `unknown argument ${options.unknown}`);
  if (!options.input) add(setupFindings, 'error', 'argv.input', '--input is required');
  if (!options.reportOnly) add(setupFindings, 'error', 'argv.report_only', '--report-only is required');
  if (!['pilot', 'full-report'].includes(options.mode)) {
    add(setupFindings, 'error', 'argv.mode', '--mode must be pilot or full-report');
  }

  let schema = null;
  let record = null;
  const inputPath = options.input ? path.resolve(options.input) : '<missing>';
  if (setupFindings.length === 0) {
    try {
      schema = readJson(SCHEMA_PATH);
      record = readJson(inputPath);
    } catch (error) {
      add(setupFindings, 'error', 'json', error.message);
    }
  }

  const { findings, warnings } =
    setupFindings.length > 0 ? { findings: setupFindings, warnings: [] } : validateRecord(schema, record, options.mode);

  const status = findings.length > 0 ? STATUS.invalid : warnings.length > 0 ? STATUS.warn : STATUS.pass;
  const result = {
    status,
    mode: options.mode,
    input: options.input || null,
    schema: path.relative(REPO_ROOT, SCHEMA_PATH).replace(/\\/g, '/'),
    errors: findings,
    warnings,
    report_only: true,
    diagnostic_only: true,
    exits_nonzero_only_for_malformed_or_schema_invalid_input: true,
    claim_safety_limited: true,
  };

  printResult(result, options.json);
  if (findings.length > 0) process.exit(2);
}

if (require.main === module) {
  main();
}

module.exports = {
  validateRecord,
  parseArgs,
  STATUS,
};
