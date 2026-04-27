#!/usr/bin/env node
const { runQuery } = require('./query');

function fail(errors) {
  for (const error of errors) console.error(`ERROR  ${error}`);
  console.error(`${errors.length} query-output validation error(s).`);
  process.exit(1);
}

function validateOutput(label, output) {
  const errors = [];
  if (!Array.isArray(output.results) || output.results.length === 0) errors.push(`${label}: expected at least one result`);
  for (const [index, item] of (output.results || []).entries()) {
    for (const field of ['source_path', 'source_type', 'authority_level', 'entity_ids', 'evidence_ids', 'edge_statuses', 'diagnostic_only', 'pending_review', 'generated_report_warning', 'not_primary_evidence']) {
      if (!(field in item)) errors.push(`${label}: result ${index} missing ${field}`);
    }
    if (item.generated_report_warning && item.not_primary_evidence !== true) {
      errors.push(`${label}: generated report result ${item.chunk_id} must set not_primary_evidence=true`);
    }
  }
  return errors;
}

function main() {
  const cases = [
    ['unit A15', { unit: 'A15', limit: 12 }],
    ['term prijselasticiteit', { term: 'prijselasticiteit_van_de_vraag', limit: 12 }],
    ['exam code A2.5', { examCode: 'A2.5', limit: 12 }],
    ['quality issue empty-needs', { qualityIssue: 'empty-needs', limit: 12 }],
  ];
  const errors = [];
  let sawGeneratedWarning = false;
  for (const [label, args] of cases) {
    const output = runQuery(args);
    errors.push(...validateOutput(label, output));
    if (output.results.some((item) => item.generated_report_warning && item.not_primary_evidence)) {
      sawGeneratedWarning = true;
    }
  }
  if (!sawGeneratedWarning) errors.push('expected at least one generated-report warning across validation queries');
  if (errors.length) fail(errors);
  console.log(`OK query output contract: ${cases.length} query mode(s)`);
}

if (require.main === module) main();
