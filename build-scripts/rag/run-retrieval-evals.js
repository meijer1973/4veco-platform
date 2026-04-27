#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { runQuery } = require('./query');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const EVAL_SET_PATH = path.join(REPO_ROOT, 'references/data/rag/retrieval_eval_set.json');
const RESULTS_PATH = path.join(REPO_ROOT, 'references/data/rag/retrieval_eval_results.json');
const MARKDOWN_PATH = path.join(REPO_ROOT, 'reports/markdown/retrieval-eval-results.md');

function normalize(value) {
  return String(value || '').toLowerCase().replace(/_/g, '-');
}

function uniq(values) {
  return Array.from(new Set(values.filter((value) => value !== undefined && value !== null && value !== '')));
}

function warningSet(results) {
  const warnings = [];
  for (const result of results) {
    if (result.diagnostic_only) warnings.push('diagnostic_only');
    if (result.pending_review) warnings.push('pending_review');
    if (result.generated_report_warning) warnings.push('generated_report_warning');
    if (result.not_primary_evidence) warnings.push('not_primary_evidence');
  }
  return uniq(warnings);
}

function analyzeAuthority(caseDef, results) {
  const violations = [];
  for (const result of results) {
    if (caseDef.must_not_treat_as_authority.includes('generated_report') && result.generated_report_warning) {
      if (result.curriculum_authority || !result.not_primary_evidence) {
        violations.push(`${result.chunk_id} treats generated report as authority`);
      }
    }
    if (caseDef.must_not_treat_as_authority.includes('diagnostic_only') && result.diagnostic_only) {
      if (result.curriculum_authority) violations.push(`${result.chunk_id} treats diagnostic_only as authority`);
    }
    if (caseDef.must_not_treat_as_authority.includes('pending_review') && result.pending_review) {
      if (result.curriculum_authority) violations.push(`${result.chunk_id} treats pending_review as authority`);
    }
  }
  return violations;
}

function evaluateCase(caseDef) {
  const output = runQuery({ text: caseDef.query, limit: 12 });
  const results = output.results;
  const foundEntities = uniq(results.flatMap((result) => result.entity_ids || []));
  const foundSourceTypes = uniq(results.map((result) => result.source_type));
  const foundWarnings = warningSet(results);
  const normalizedEntities = foundEntities.map(normalize);
  const missingEntities = (caseDef.expected_entities || []).filter((entity) => !normalizedEntities.includes(normalize(entity)));
  const missingSourceTypes = (caseDef.expected_source_types || []).filter((sourceType) => !foundSourceTypes.includes(sourceType));
  const missingWarnings = (caseDef.must_include_warnings || []).filter((warning) => !foundWarnings.includes(warning));
  const authorityViolations = analyzeAuthority(caseDef, results);
  const status = authorityViolations.length > 0 || missingWarnings.length > 0 || missingSourceTypes.length > 0 || missingEntities.length > 0
    ? 'fail'
    : 'pass';

  return {
    query_id: caseDef.query_id,
    query: caseDef.query,
    status,
    result_count: results.length,
    found_entities: foundEntities.slice(0, 50),
    found_source_types: foundSourceTypes,
    warnings_present: foundWarnings,
    expected_entities_missing: missingEntities,
    expected_source_types_missing: missingSourceTypes,
    warnings_missing: missingWarnings,
    authority_violations: authorityViolations,
    top_results: results.slice(0, 5),
    notes: caseDef.notes,
  };
}

function renderMarkdown(output) {
  const lines = [];
  lines.push('# Retrieval Evaluation Results');
  lines.push('');
  lines.push(`Generated on: ${output.generated_on}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Eval cases: ${output.summary.case_count}`);
  lines.push(`- Passed: ${output.summary.pass_count}`);
  lines.push(`- Failed: ${output.summary.fail_count}`);
  lines.push(`- Authority violations: ${output.summary.authority_violation_count}`);
  lines.push('');
  lines.push('## Cases');
  lines.push('');
  lines.push('| Query ID | Status | Results | Source types | Warnings | Missing |');
  lines.push('|---|---:|---:|---|---|---|');
  for (const result of output.results) {
    const missing = [
      ...result.expected_entities_missing.map((item) => `entity:${item}`),
      ...result.expected_source_types_missing.map((item) => `source:${item}`),
      ...result.warnings_missing.map((item) => `warning:${item}`),
      ...result.authority_violations,
    ].join('; ') || '-';
    lines.push(`| ${result.query_id} | ${result.status} | ${result.result_count} | ${result.found_source_types.join(', ') || '-'} | ${result.warnings_present.join(', ') || '-'} | ${missing} |`);
  }
  lines.push('');
  lines.push('## Case Details');
  for (const result of output.results) {
    lines.push('');
    lines.push(`### ${result.query_id}`);
    lines.push('');
    lines.push(`Query: ${result.query}`);
    lines.push('');
    lines.push(`Status: ${result.status}`);
    lines.push('');
    lines.push(`Notes: ${result.notes}`);
    lines.push('');
    lines.push('Top results:');
    lines.push('');
    for (const item of result.top_results) {
      lines.push(`- ${item.chunk_id} (${item.source_type}, ${item.authority_level})`);
      lines.push(`  - source: ${item.source_path}`);
      lines.push(`  - warnings: ${[
        item.diagnostic_only ? 'diagnostic_only' : '',
        item.pending_review ? 'pending_review' : '',
        item.generated_report_warning ? 'generated_report_warning' : '',
        item.not_primary_evidence ? 'not_primary_evidence' : '',
      ].filter(Boolean).join(', ') || '-'}`);
    }
  }
  lines.push('');
  lines.push('## Authority Notes');
  lines.push('');
  lines.push('Generated-report and diagnostic-only results are allowed in retrieval as warnings and review signals only. They are not primary evidence or curriculum authority.');
  lines.push('');
  return lines.join('\n');
}

function main() {
  const evalSet = JSON.parse(fs.readFileSync(EVAL_SET_PATH, 'utf8'));
  const results = evalSet.cases.map(evaluateCase);
  const output = {
    eval_set_id: evalSet.eval_set_id,
    schema_version: 1,
    generated_by: 'build-scripts/rag/run-retrieval-evals.js',
    generated_on: new Date().toISOString(),
    source_files: [
      'references/data/rag/retrieval_eval_set.json',
      'references/data/rag/chunk_index.jsonl',
      'build-scripts/rag/query.js',
    ],
    summary: {
      case_count: results.length,
      pass_count: results.filter((result) => result.status === 'pass').length,
      fail_count: results.filter((result) => result.status === 'fail').length,
      authority_violation_count: results.reduce((count, result) => count + result.authority_violations.length, 0),
    },
    results,
  };
  fs.writeFileSync(RESULTS_PATH, `${JSON.stringify(output, null, 2)}\n`);
  fs.writeFileSync(MARKDOWN_PATH, renderMarkdown(output));
  console.log(`Wrote ${path.relative(REPO_ROOT, RESULTS_PATH)}`);
  console.log(`Wrote ${path.relative(REPO_ROOT, MARKDOWN_PATH)}`);
  if (output.summary.fail_count > 0) {
    console.error(`Retrieval eval failures: ${output.summary.fail_count}`);
    process.exit(1);
  }
}

if (require.main === module) main();
