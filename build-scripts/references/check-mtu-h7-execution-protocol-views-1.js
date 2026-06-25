#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H7-BLIND-HOLDOUT-EXECUTION-AND-CLOSURE-READINESS-BUNDLE-1';
const PR144_MERGE_SHA = 'f05f8e67e3b5528fd8f30401ba1b0fa084042fff';
const H6_METHOD_ANCHOR_SHA = '95601ff21b69754d1f82dcca5647edb46ae5a62f';
const PROTOCOL = 'reports/mtu-hardening/mtu-h7-execution-protocol-views-1.json';
const CURATOR = 'reports/mtu-hardening/mtu-h7-execution-curator-view-1.json';
const MAPPER = 'reports/mtu-hardening/mtu-h7-execution-mapper-view-1.json';
const ADJUDICATOR = 'reports/mtu-hardening/mtu-h7-execution-adjudicator-view-1.json';
const H7_PLAN = 'reports/mtu-hardening/mtu-h7-blind-holdout-benchmark-plan-1.json';

function repoPath(relativePath) {
  return path.join(ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), 'utf8'));
}

function sha256File(relativePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(repoPath(relativePath))).digest('hex');
}

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

function run(command, args) {
  return spawnSync(command, args, { cwd: ROOT, encoding: 'utf8', shell: false });
}

function collectForbiddenKeyPaths(value, forbidden, prefix = '') {
  const hits = [];
  if (!value || typeof value !== 'object') return hits;
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      hits.push(...collectForbiddenKeyPaths(item, forbidden, `${prefix}[${index}]`));
    });
    return hits;
  }
  for (const [key, child] of Object.entries(value)) {
    const childPath = prefix ? `${prefix}.${key}` : key;
    if (forbidden.has(key) || forbidden.has(childPath)) hits.push(childPath);
    hits.push(...collectForbiddenKeyPaths(child, forbidden, childPath));
  }
  return hits;
}

function validate() {
  const failures = [];
  const protocol = readJson(PROTOCOL);
  const curator = readJson(CURATOR);
  const mapper = readJson(MAPPER);
  const adjudicator = readJson(ADJUDICATOR);
  const plan = readJson(H7_PLAN);

  if (protocol.sprint_id !== SPRINT_ID) failures.push('protocol sprint_id mismatch');
  if (curator.sprint_id !== SPRINT_ID) failures.push('curator sprint_id mismatch');
  if (mapper.sprint_id !== SPRINT_ID) failures.push('mapper sprint_id mismatch');
  if (adjudicator.sprint_id !== SPRINT_ID) failures.push('adjudicator sprint_id mismatch');
  if (protocol.governed_baseline.pr144_merge_sha !== PR144_MERGE_SHA) {
    failures.push('PR #144 merge SHA mismatch');
  }
  if (protocol.governed_baseline.h6_frozen_method_anchor_sha !== H6_METHOD_ANCHOR_SHA) {
    failures.push('H6 method anchor mismatch');
  }

  const ancestor = run('git', ['merge-base', '--is-ancestor', PR144_MERGE_SHA, 'HEAD']);
  if (ancestor.status !== 0) failures.push('current HEAD does not contain PR #144 merge');

  const selected = plan.selected_records || [];
  const diagnostic = selected.filter((record) => record.split === 'diagnostic');
  const holdout = selected.filter((record) => record.split === 'locked_holdout');
  if (plan.status !== 'method_frozen_sample_selected_not_evaluated') {
    failures.push(`H7 plan status changed: ${plan.status}`);
  }
  if (
    protocol.sample_counts.total_records !== 24 ||
    protocol.sample_counts.diagnostic_records !== 16 ||
    protocol.sample_counts.locked_holdout_records !== 8 ||
    selected.length !== 24 ||
    diagnostic.length !== 16 ||
    holdout.length !== 8
  ) {
    failures.push('H7 sample counts must remain 24 total / 16 diagnostic / 8 locked holdout');
  }

  const curatedIds = (curator.selected_records || []).map((record) => record.sample_id);
  const mapperIds = (mapper.records || []).map((record) => record.sample_id);
  const adjudicatorIds = (adjudicator.records || []).map((record) => record.sample_id);
  if (JSON.stringify(curatedIds) !== JSON.stringify(selected.map((record) => record.sample_id))) {
    failures.push('curator view does not preserve selected record IDs/order');
  }
  if (JSON.stringify(mapperIds) !== JSON.stringify(curatedIds)) {
    failures.push('mapper view does not preserve selected record IDs/order');
  }
  if (JSON.stringify(adjudicatorIds) !== JSON.stringify(curatedIds)) {
    failures.push('adjudicator view does not preserve selected record IDs/order');
  }

  const forbiddenMapperKeys = new Set([
    'split',
    'route_tags',
    'expected_outcomes',
    'gold_operations',
    'adjudication_results',
    'benchmark_classification',
    'question_type',
    'exam_codes',
    'metadata'
  ]);
  const mapperLeaks = collectForbiddenKeyPaths(mapper.records || [], forbiddenMapperKeys);
  if (mapperLeaks.length > 0) {
    failures.push(`mapper view leaks curator/semantic fields: ${mapperLeaks.slice(0, 8).join(', ')}`);
  }
  if (mapper.status !== 'sealed_mapper_input_no_split_tags_or_outcomes') {
    failures.push(`mapper status mismatch: ${mapper.status}`);
  }
  if (protocol.benchmark_view_policy.mapper_view_strips_curator_metadata !== true) {
    failures.push('protocol must assert mapper metadata stripping');
  }
  if (protocol.benchmark_view_policy.cryptographic_blinding_claimed !== false) {
    failures.push('protocol must not claim cryptographic blinding');
  }
  if (protocol.benchmark_view_policy.h7_mappings_recorded !== false) {
    failures.push('phase A must not record H7 mappings');
  }
  if (protocol.benchmark_view_policy.holdout_outcomes_recorded !== false) {
    failures.push('phase A must not record holdout outcomes');
  }
  if (protocol.negative_fixture_policy.minimum_total_negative_fixtures < selected.length) {
    failures.push('negative fixture policy must require at least one negative per record');
  }

  for (const collection of [protocol, curator, mapper, adjudicator]) {
    if (!allFalse(collection.authority_flags)) failures.push(`${collection.artifact_id || collection.view_id} authority flags must all be false`);
  }

  for (const input of protocol.method_input_hashes || []) {
    if (input.exists !== true) failures.push(`missing method input: ${input.path}`);
    if (input.exists === true && input.sha256 !== sha256File(input.path)) {
      failures.push(`method input hash mismatch: ${input.path}`);
    }
  }
  for (const input of protocol.official_source_pdf_hashes || []) {
    if (input.exists !== true) failures.push(`missing official source PDF: ${input.path}`);
    if (input.exists === true && input.sha256 !== sha256File(input.path)) {
      failures.push(`official source PDF hash mismatch: ${input.path}`);
    }
  }

  return {
    ok: failures.length === 0,
    failures,
    summary: {
      records: selected.length,
      diagnostic: diagnostic.length,
      holdout: holdout.length,
      method_inputs: (protocol.method_input_hashes || []).length,
      source_pdfs: (protocol.official_source_pdf_hashes || []).length
    }
  };
}

const result = validate();
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else if (result.ok) {
  console.log(
    `OK ${SPRINT_ID}: protocol views sealed (${result.summary.records} records, ${result.summary.method_inputs} method inputs, ${result.summary.source_pdfs} PDFs)`
  );
} else {
  console.error(`FAIL ${SPRINT_ID}: ${result.failures.length} issue(s)`);
  for (const failure of result.failures) console.error(`- ${failure}`);
}
process.exit(result.ok ? 0 : 1);
