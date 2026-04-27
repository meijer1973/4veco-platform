#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const EVAL_SET_PATH = path.join(REPO_ROOT, 'references/data/rag/retrieval_eval_set.json');
const RESULTS_PATH = path.join(REPO_ROOT, 'references/data/rag/retrieval_eval_results.json');
const MARKDOWN_PATH = path.join(REPO_ROOT, 'reports/markdown/retrieval-eval-results.md');

function fail(message) {
  console.error(`Retrieval eval validation failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${path.relative(REPO_ROOT, file)}`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${path.relative(REPO_ROOT, file)}: ${error.message}`);
  }
}

function requireArray(value, label) {
  if (!Array.isArray(value)) fail(`${label} must be an array`);
}

function validateEvalSet(evalSet) {
  if (evalSet.eval_set_id !== 'R7.3-retrieval-eval-set') fail('unexpected eval_set_id');
  requireArray(evalSet.cases, 'cases');
  if (evalSet.cases.length < 10) fail('eval set must contain at least ten cases');
  const ids = new Set();
  for (const [index, item] of evalSet.cases.entries()) {
    for (const field of ['query_id', 'query', 'notes']) {
      if (!item[field] || typeof item[field] !== 'string') fail(`case ${index} missing ${field}`);
    }
    for (const field of ['expected_entities', 'expected_source_types', 'must_include_warnings', 'must_not_treat_as_authority']) {
      requireArray(item[field], `case ${item.query_id} ${field}`);
    }
    if (ids.has(item.query_id)) fail(`duplicate query_id: ${item.query_id}`);
    ids.add(item.query_id);
  }
  const requiredQueries = [
    'Welke units ondersteunen prijselasticiteit?',
    'Welke examenvragen testen producentensurplus?',
    'Welke live units missen term links?',
    'Welke units hebben lege needs maar zijn false_zero?',
    'Welke target exercises hebben nog missing-unit flags?',
    'Welke begrippen met formules missen pitfalls?',
    'Welke deprecated units worden nog geciteerd?',
    'Welke edges zijn diagnostic_only?',
    'Welke graph edges zijn pending_review?',
    'Welke informatie komt alleen uit generated reports?',
  ];
  for (const query of requiredQueries) {
    if (!evalSet.cases.some((item) => item.query === query)) fail(`missing required query: ${query}`);
  }
}

function validateResults(results, evalSet) {
  if (results.eval_set_id !== evalSet.eval_set_id) fail('result eval_set_id mismatch');
  requireArray(results.results, 'results.results');
  if (results.results.length !== evalSet.cases.length) fail('result count does not match eval cases');
  for (const result of results.results) {
    if (!result.query_id || !result.query) fail('result missing query_id/query');
    if (result.status !== 'pass') fail(`${result.query_id} did not pass`);
    if (!Number.isInteger(result.result_count) || result.result_count < 1) fail(`${result.query_id} has no retrieval results`);
    for (const field of ['found_entities', 'found_source_types', 'warnings_present', 'expected_entities_missing', 'expected_source_types_missing', 'warnings_missing', 'authority_violations', 'top_results']) {
      requireArray(result[field], `${result.query_id} ${field}`);
    }
    if (result.expected_entities_missing.length > 0) fail(`${result.query_id} missing expected entities`);
    if (result.expected_source_types_missing.length > 0) fail(`${result.query_id} missing expected source types`);
    if (result.warnings_missing.length > 0) fail(`${result.query_id} missing required warnings`);
    if (result.authority_violations.length > 0) fail(`${result.query_id} has authority violations`);
    for (const item of result.top_results) {
      for (const field of ['chunk_id', 'source_path', 'source_type', 'authority_level']) {
        if (!item[field]) fail(`${result.query_id} top result missing ${field}`);
      }
      if (item.generated_report_warning && item.not_primary_evidence !== true) {
        fail(`${result.query_id} generated-report result lacks not_primary_evidence`);
      }
      if (item.generated_report_warning && item.curriculum_authority === true) {
        fail(`${result.query_id} generated-report result is curriculum authority`);
      }
      if (item.diagnostic_only && item.curriculum_authority === true) {
        fail(`${result.query_id} diagnostic-only result is curriculum authority`);
      }
      if (item.pending_review && item.curriculum_authority === true) {
        fail(`${result.query_id} pending-review result is curriculum authority`);
      }
    }
  }
  if (!results.summary || results.summary.fail_count !== 0) fail('summary reports failed eval cases');
}

function main() {
  const evalSet = readJson(EVAL_SET_PATH);
  const results = readJson(RESULTS_PATH);
  validateEvalSet(evalSet);
  validateResults(results, evalSet);
  if (!fs.existsSync(MARKDOWN_PATH)) fail('missing Markdown eval report');
  const markdown = fs.readFileSync(MARKDOWN_PATH, 'utf8');
  if (!markdown.includes('# Retrieval Evaluation Results')) fail('Markdown report missing title');
  if (!markdown.includes('Generated-report and diagnostic-only results')) fail('Markdown report missing authority notes');
  console.log('OK retrieval eval results');
}

if (require.main === module) main();
