#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  ACTUAL_CHANGED_PATHS_POLICY,
  INDEX_PATHS,
  TRUSTED_FRESHNESS_CHECKER,
  TRUSTED_GENERATOR,
} = require('./refresh-bundle-agent-indexes');

const SHA_PATTERN = /^[a-f0-9]{40}$/i;
const STATES = Object.freeze({
  PLATFORM_FIRST: 'platform-first',
  LESSON_FIRST: 'lesson-first',
  BUNDLE_FINAL: 'bundle-final',
});
const STATE_VALUES = new Set(Object.values(STATES));
const SUCCESS_VALUES = new Set(['success', 'succeeded', 'passed', 'pass', 'ok']);

function lessonFirstIntegrationContract() {
  return {
    schema_version: 2,
    order: STATES.LESSON_FIRST,
    post_first_merge_refresh: {
      required: true,
      phase: 'after_lesson_merge_before_platform_ci',
      source: 'lesson_merge_commit',
      trusted_executor: 'platform-main',
      generator: TRUSTED_GENERATOR,
      freshness_checker: TRUSTED_FRESHNESS_CHECKER,
      generated_and_verified_paths: [...INDEX_PATHS],
      actual_changed_paths_policy: ACTUAL_CHANGED_PATHS_POLICY,
      deterministic_inputs: [
        'platform_refresh_parent_sha',
        'lesson_merge_commit_sha',
        'lesson_merge_committer_timestamp',
        'canonical_source_branches',
      ],
      exact_readiness_head: 'platform_integration_head_sha',
      exact_ci_binding: {
        platform_sha: 'platform_integration_head_sha',
        lesson_sha: 'lesson_merge_commit_sha',
      },
    },
  };
}

function validateIntegrationContract(contract) {
  const expected = lessonFirstIntegrationContract();
  const failures = [];
  if (!contract || typeof contract !== 'object') {
    return { ok: false, failures: ['lesson-first integration_contract missing'], contract: null };
  }
  const refresh = contract.post_first_merge_refresh || {};
  if (contract.schema_version !== expected.schema_version) failures.push('integration_contract schema_version mismatch');
  if (contract.order !== expected.order) failures.push('integration_contract order mismatch');
  for (const key of ['required', 'phase', 'source', 'trusted_executor', 'generator', 'freshness_checker', 'exact_readiness_head']) {
    if (refresh[key] !== expected.post_first_merge_refresh[key]) {
      failures.push(`integration_contract ${key} mismatch`);
    }
  }
  if (!sameStringArray(refresh.generated_and_verified_paths, expected.post_first_merge_refresh.generated_and_verified_paths)) {
    failures.push('integration_contract generated_and_verified_paths mismatch');
  }
  if (refresh.actual_changed_paths_policy !== expected.post_first_merge_refresh.actual_changed_paths_policy) {
    failures.push('integration_contract actual_changed_paths_policy mismatch');
  }
  if (!sameStringArray(refresh.deterministic_inputs, expected.post_first_merge_refresh.deterministic_inputs)) {
    failures.push('integration_contract deterministic_inputs mismatch');
  }
  const ci = refresh.exact_ci_binding || {};
  if (ci.platform_sha !== expected.post_first_merge_refresh.exact_ci_binding.platform_sha) {
    failures.push('integration_contract platform CI binding mismatch');
  }
  if (ci.lesson_sha !== expected.post_first_merge_refresh.exact_ci_binding.lesson_sha) {
    failures.push('integration_contract lesson CI binding mismatch');
  }
  return { ok: failures.length === 0, failures, contract };
}

function validateIntegrationRefreshProof(proof, options = {}) {
  const item = proof || {};
  const compatibility = options.compatibility || {};
  const exact = compatibility.exact_members || options.exactMembers || {};
  const failures = [];
  const refreshResult = item.refresh_result || {};
  const lineage = item.lineage || {};
  const readiness = item.readiness || {};
  const ci = item.ci || {};
  if (item.status !== 'complete') failures.push('integration_refresh status must be complete');
  if (item.order !== STATES.LESSON_FIRST) failures.push('integration_refresh order mismatch');
  if (item.platform_payload_sha !== exact.platform_candidate_sha) failures.push('integration_refresh platform payload mismatch');
  if (item.lesson_payload_sha !== exact.lesson_candidate_sha) failures.push('integration_refresh lesson payload mismatch');
  requireSha(item.platform_integration_head_sha, 'integration_refresh platform_integration_head_sha', failures);
  requireSha(item.lesson_merge_commit_sha, 'integration_refresh lesson_merge_commit_sha', failures);
  if (item.platform_integration_head_sha === item.platform_payload_sha) {
    failures.push('integration_refresh head must be a descendant, not the payload head');
  }
  if (item.lesson_merge_commit_sha === item.lesson_payload_sha) {
    failures.push('integration_refresh lesson merge commit must differ from payload head');
  }
  if (options.controllerHead && item.platform_integration_head_sha !== options.controllerHead) {
    failures.push('integration_refresh controller head mismatch');
  }
  if (options.lessonMergeSha && item.lesson_merge_commit_sha !== options.lessonMergeSha) {
    failures.push('integration_refresh lesson main mismatch');
  }
  if (refreshResult.trusted_executor !== 'platform-main') failures.push('integration_refresh executor mismatch');
  if (!['created', 'reused'].includes(refreshResult.status)) failures.push('integration_refresh result status mismatch');
  if (refreshResult.platform_integration_head_sha !== item.platform_integration_head_sha) {
    failures.push('integration_refresh result head mismatch');
  }
  if (refreshResult.lesson_merge_commit_sha !== item.lesson_merge_commit_sha) {
    failures.push('integration_refresh result lesson mismatch');
  }
  requireSha(refreshResult.previous_platform_head_sha, 'integration_refresh previous platform head', failures);
  const metadata = refreshResult.metadata || {};
  const commit = refreshResult.commit || {};
  if (metadata.platform_source_commit !== refreshResult.previous_platform_head_sha) {
    failures.push('integration_refresh platform source commit mismatch');
  }
  if (typeof metadata.platform_source_branch !== 'string' || !metadata.platform_source_branch.trim()) {
    failures.push('integration_refresh platform source branch missing');
  }
  if (metadata.lesson_source_commit !== item.lesson_merge_commit_sha) {
    failures.push('integration_refresh lesson source commit mismatch');
  }
  if (metadata.lesson_source_branch !== 'origin/main') {
    failures.push('integration_refresh lesson source branch mismatch');
  }
  if (!metadata.generated_at || Number.isNaN(Date.parse(metadata.generated_at))) {
    failures.push('integration_refresh generated_at invalid');
  }
  if (options.platformBranch && metadata.platform_source_branch !== options.platformBranch) {
    failures.push('integration_refresh platform source branch mismatch');
  }
  if (!isNonEmptyIndexSubset(refreshResult.changed_paths)) failures.push('integration_refresh changed paths invalid');
  if (!sameStringArray(refreshResult.verified_paths, INDEX_PATHS)) failures.push('integration_refresh verified paths mismatch');
  if (commit.sha !== item.platform_integration_head_sha) failures.push('integration_refresh commit head mismatch');
  if (commit.parent_sha !== refreshResult.previous_platform_head_sha) failures.push('integration_refresh commit parent mismatch');
  if (!sameStringArray(commit.changed_paths, refreshResult.changed_paths)) {
    failures.push('integration_refresh commit paths mismatch');
  }
  const hashes = refreshResult.hashes || {};
  if (!INDEX_PATHS.every((file) => /^[a-f0-9]{64}$/i.test(String(hashes[file] || '')))) {
    failures.push('integration_refresh deterministic hashes missing');
  }
  if (
    lineage.reviewed_payload_head_sha !== item.platform_payload_sha ||
    lineage.integration_head_sha !== item.platform_integration_head_sha ||
    lineage.payload_ancestor_of_integration_head !== true ||
    lineage.authorization_inherited !== true ||
    asArray(lineage.failures).length > 0
  ) {
    failures.push('integration_refresh lineage invalid');
  }
  if (
    readiness.head_sha !== item.platform_integration_head_sha ||
    !['READY_FOR_LEAD_ONLY', 'READY_FOR_HUMAN_REVIEW'].includes(readiness.route) ||
    readiness.attestation_schema_version !== 2 ||
    !/^sha256:[a-f0-9]{64}$/i.test(String(readiness.attestation_digest || ''))
  ) {
    failures.push('integration_refresh readiness invalid');
  } else if (readiness.attestation_digest !== integrationRefreshReadinessAttestationDigest(item)) {
    failures.push('integration_refresh readiness attestation mismatch');
  }
  if (
    !isSuccess(ci.status) ||
    ci.platform_sha !== item.platform_integration_head_sha ||
    ci.lesson_sha !== item.lesson_merge_commit_sha
  ) {
    failures.push('integration_refresh CI binding invalid');
  }
  const readinessDecision = options.readinessDecision;
  if (readinessDecision && (
    !readinessDecision.reviewed_pr ||
    readinessDecision.reviewed_pr.head_sha !== readiness.head_sha ||
    readinessDecision.route !== readiness.route
  )) {
    failures.push('integration_refresh readiness decision mismatch');
  }
  return { ok: failures.length === 0, failures, proof: item };
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function integrationRefreshReadinessAttestationDigest(proof) {
  const item = proof || {};
  const readiness = item.readiness || {};
  const refreshResult = item.refresh_result || {};
  const ci = item.ci || {};
  const canonical = {
    schema_version: 2,
    order: item.order,
    platform_payload_sha: item.platform_payload_sha,
    platform_integration_head_sha: item.platform_integration_head_sha,
    lesson_payload_sha: item.lesson_payload_sha,
    lesson_merge_commit_sha: item.lesson_merge_commit_sha,
    refresh_status: refreshResult.status,
    refresh_parent_sha: refreshResult.previous_platform_head_sha,
    refresh_changed_paths: refreshResult.changed_paths,
    refresh_verified_paths: refreshResult.verified_paths,
    refresh_hashes: refreshResult.hashes,
    refresh_metadata: refreshResult.metadata,
    readiness_head_sha: readiness.head_sha,
    readiness_route: readiness.route,
    ci_status: ci.status,
    ci_platform_sha: ci.platform_sha,
    ci_lesson_sha: ci.lesson_sha,
    ci_run_id: ci.run_id || null,
  };
  return `sha256:${crypto.createHash('sha256').update(stableStringify(canonical)).digest('hex')}`;
}

function sameStringArray(left, right) {
  const normalize = (value) => asArray(value).map(String).sort();
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));
}

function isNonEmptyIndexSubset(values) {
  const raw = asArray(values).map(String);
  const normalized = [...new Set(raw)].sort();
  return raw.length > 0 && normalized.length === raw.length && normalized.every((item) => INDEX_PATHS.includes(item));
}

function fail(message) {
  console.error(`Cross-repo bundle compatibility failed: ${message}`);
  process.exit(1);
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (index + 1 >= args.length) fail(`missing value for ${name}`);
  return args[index + 1];
}

function flag(args, name) {
  return args.includes(name);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function isSuccess(value) {
  return SUCCESS_VALUES.has(String(value || '').trim().toLowerCase());
}

function requireSha(value, label, failures) {
  if (!SHA_PATTERN.test(String(value || ''))) failures.push(`${label} must be a 40-character SHA`);
}

function normalizeStatus(value) {
  return isSuccess(value) ? 'success' : 'failure';
}

function stateResult(options) {
  const failures = [];
  const state = options.state;
  if (!STATE_VALUES.has(state)) failures.push(`unsupported state: ${state || 'missing'}`);
  if (typeof options.bundleId !== 'string' || !options.bundleId.trim()) failures.push('bundle_id is required');
  requireSha(options.platformBaseSha, 'platform_base_sha', failures);
  requireSha(options.platformCandidateSha, 'platform_candidate_sha', failures);
  requireSha(options.lessonBaseSha, 'lesson_base_sha', failures);
  requireSha(options.lessonCandidateSha, 'lesson_candidate_sha', failures);
  requireSha(options.platformStateSha, 'platform_state_sha', failures);
  requireSha(options.lessonStateSha, 'lesson_state_sha', failures);
  if (failures.length > 0) {
    return { ok: false, failures };
  }
  return {
    ok: true,
    bundle_id: options.bundleId,
    state,
    status: normalizeStatus(options.status),
    platform_sha: options.platformStateSha,
    lesson_sha: options.lessonStateSha,
    exact_members: {
      platform_base_sha: options.platformBaseSha,
      platform_candidate_sha: options.platformCandidateSha,
      lesson_base_sha: options.lessonBaseSha,
      lesson_candidate_sha: options.lessonCandidateSha,
    },
    commands: asArray(options.commands),
    failed_command: options.failedCommand || null,
  };
}

function normalizeState(item) {
  const result = item || {};
  return {
    bundle_id: result.bundle_id || result.bundleId || null,
    state: result.state,
    status: normalizeStatus(result.status || result.conclusion || result.result),
    platform_sha: result.platform_sha || result.platformStateSha,
    lesson_sha: result.lesson_sha || result.lessonStateSha,
    exact_members: result.exact_members || result.exactMembers || null,
    commands: asArray(result.commands),
    failed_command: result.failed_command || result.failedCommand || null,
  };
}

function collectExactMembers(states) {
  const source = states.find((item) => item && item.exact_members) || {};
  const exact = source.exact_members || {};
  return {
    platform_base_sha: exact.platform_base_sha || exact.platformBaseSha || null,
    platform_candidate_sha: exact.platform_candidate_sha || exact.platformCandidateSha || null,
    lesson_base_sha: exact.lesson_base_sha || exact.lessonBaseSha || null,
    lesson_candidate_sha: exact.lesson_candidate_sha || exact.lessonCandidateSha || null,
  };
}

function summarizeCompatibility(input, options = {}) {
  const failures = [];
  const rawStates = Array.isArray(input.states)
    ? input.states
    : Object.entries(input.states || {}).map(([state, value]) => ({ ...value, state: value.state || state }));
  const byState = {};
  for (const raw of rawStates) {
    const state = normalizeState(raw);
    if (!STATE_VALUES.has(state.state)) {
      failures.push(`unsupported matrix state: ${state.state || 'missing'}`);
      continue;
    }
    byState[state.state] = state;
  }
  for (const state of STATE_VALUES) {
    if (!byState[state]) failures.push(`missing matrix state: ${state}`);
  }
  const exactMembers = input.exact_members || collectExactMembers(rawStates);
  for (const [key, value] of Object.entries(exactMembers)) {
    requireSha(value, key, failures);
  }
  const bundleId = input.bundle_id || input.bundleId || (rawStates[0] && rawStates[0].bundle_id);
  if (typeof bundleId !== 'string' || !bundleId.trim()) failures.push('bundle_id is required');
  for (const raw of rawStates) {
    const rawBundleId = raw.bundle_id || raw.bundleId;
    if (!rawBundleId) {
      failures.push(`${raw.state || 'state'} bundle_id missing`);
    } else if (bundleId && rawBundleId !== bundleId) {
      failures.push(`${raw.state || 'state'} bundle_id mismatch`);
    }
    const stateExact = raw.exact_members || raw.exactMembers;
    if (!stateExact) {
      failures.push(`${raw.state || 'state'} exact_members missing`);
      continue;
    }
    for (const [key, expected] of Object.entries(exactMembers)) {
      const actual = stateExact[key] || stateExact[key.replace(/_([a-z])/g, (_match, letter) => letter.toUpperCase())];
      if (!actual) {
        failures.push(`${raw.state || 'state'} ${key} missing`);
      } else if (expected && actual !== expected) {
        failures.push(`${raw.state || 'state'} ${key} mismatch`);
      }
    }
  }
  const expectedStateShas = {
    [STATES.PLATFORM_FIRST]: {
      platform_sha: exactMembers.platform_candidate_sha,
      lesson_sha: exactMembers.lesson_base_sha,
    },
    [STATES.LESSON_FIRST]: {
      platform_sha: exactMembers.platform_base_sha,
      lesson_sha: exactMembers.lesson_candidate_sha,
    },
    [STATES.BUNDLE_FINAL]: {
      platform_sha: exactMembers.platform_candidate_sha,
      lesson_sha: exactMembers.lesson_candidate_sha,
    },
  };
  for (const [stateName, expected] of Object.entries(expectedStateShas)) {
    const state = byState[stateName];
    if (!state) continue;
    if (state.platform_sha !== expected.platform_sha) {
      failures.push(`${stateName} platform_sha must match ${expected.platform_sha}`);
    }
    if (state.lesson_sha !== expected.lesson_sha) {
      failures.push(`${stateName} lesson_sha must match ${expected.lesson_sha}`);
    }
  }

  const platformFirstGreen = byState[STATES.PLATFORM_FIRST] && byState[STATES.PLATFORM_FIRST].status === 'success';
  const lessonFirstGreen = byState[STATES.LESSON_FIRST] && byState[STATES.LESSON_FIRST].status === 'success';
  const bundleFinalGreen = byState[STATES.BUNDLE_FINAL] && byState[STATES.BUNDLE_FINAL].status === 'success';
  const permittedMergeOrders = [];
  if (bundleFinalGreen && platformFirstGreen) permittedMergeOrders.push('platform-first');
  if (bundleFinalGreen && lessonFirstGreen) permittedMergeOrders.push('lesson-first');
  if (!bundleFinalGreen) failures.push('bundle_final_not_green');
  if (bundleFinalGreen && permittedMergeOrders.length === 0) failures.push('no_green_intermediate_order');
  const recommendedMergeOrder = permittedMergeOrders.includes('lesson-first')
    ? 'lesson-first'
    : permittedMergeOrders[0] || null;
  const integrationContract = input.integration_contract || (
    options.synthesizeIntegrationContract === false ? null : lessonFirstIntegrationContract()
  );
  const contractValidation = validateIntegrationContract(integrationContract);
  failures.push(...contractValidation.failures);

  return {
    schema_version: 2,
    bundle_id: bundleId || null,
    exact_members: exactMembers,
    states: {
      [STATES.PLATFORM_FIRST]: byState[STATES.PLATFORM_FIRST] || null,
      [STATES.LESSON_FIRST]: byState[STATES.LESSON_FIRST] || null,
      [STATES.BUNDLE_FINAL]: byState[STATES.BUNDLE_FINAL] || null,
    },
    permitted_merge_orders: permittedMergeOrders,
    recommended_merge_order: recommendedMergeOrder,
    integration_contract: integrationContract,
    commands: rawStates.flatMap((state) => asArray(state.commands)),
    provenance: input.provenance || null,
    ok: failures.length === 0,
    failures,
  };
}

function validateCompatibilityProof(proof, options = {}) {
  const summary = summarizeCompatibility(proof || {}, { synthesizeIntegrationContract: false });
  const failures = [...summary.failures];
  if (options.bundleId && summary.bundle_id !== options.bundleId) {
    failures.push(`bundle_id mismatch: expected ${options.bundleId}`);
  }
  for (const [key, expected] of Object.entries(options.exactMembers || {})) {
    if (expected && summary.exact_members[key] !== expected) {
      failures.push(`${key} mismatch: expected ${expected}`);
    }
  }
  return {
    ...summary,
    ok: failures.length === 0,
    failures,
  };
}

function readStateResults(inputDir) {
  const states = [];
  for (const state of STATE_VALUES) {
    const file = path.join(inputDir, `${state}.json`);
    if (fs.existsSync(file)) states.push(readJson(file));
  }
  return states;
}

function runCli(argv) {
  const mode = argv[0];
  if (mode === 'state-result') {
    let commands = [];
    const commandsJson = optionValue(argv, '--commands-json');
    if (commandsJson) {
      try {
        commands = JSON.parse(commandsJson);
      } catch (error) {
        fail(`--commands-json must be valid JSON: ${error.message}`);
      }
    }
    const result = stateResult({
      bundleId: optionValue(argv, '--bundle-id'),
      state: optionValue(argv, '--state'),
      platformBaseSha: optionValue(argv, '--platform-base-sha'),
      platformCandidateSha: optionValue(argv, '--platform-candidate-sha'),
      lessonBaseSha: optionValue(argv, '--lesson-base-sha'),
      lessonCandidateSha: optionValue(argv, '--lesson-candidate-sha'),
      platformStateSha: optionValue(argv, '--platform-state-sha'),
      lessonStateSha: optionValue(argv, '--lesson-state-sha'),
      status: optionValue(argv, '--status') || 'failure',
      commands,
      failedCommand: optionValue(argv, '--failed-command'),
    });
    const output = optionValue(argv, '--output');
    if (output) writeJson(output, result);
    else process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (!result.ok) process.exit(1);
    return;
  }
  if (mode === 'summarize') {
    const fixture = optionValue(argv, '--fixture');
    const inputDir = optionValue(argv, '--input-dir');
    if (!fixture && !inputDir) fail('summarize requires --fixture or --input-dir');
    const input = fixture ? readJson(fixture) : { states: readStateResults(inputDir) };
    if (!input.provenance && process.env.GITHUB_RUN_ID) {
      input.provenance = {
        workflow: process.env.GITHUB_WORKFLOW || null,
        workflow_ref: process.env.GITHUB_WORKFLOW_REF || null,
        workflow_sha: process.env.GITHUB_WORKFLOW_SHA || null,
        run_id: process.env.GITHUB_RUN_ID || null,
        run_attempt: process.env.GITHUB_RUN_ATTEMPT || null,
        event_name: process.env.GITHUB_EVENT_NAME || null,
        inputs: {
          bundle_id: process.env.BUNDLE_ID || null,
          platform_base_sha: process.env.PLATFORM_BASE_SHA || null,
          platform_candidate_sha: process.env.PLATFORM_CANDIDATE_SHA || null,
          lesson_base_sha: process.env.LESSON_BASE_SHA || null,
          lesson_candidate_sha: process.env.LESSON_CANDIDATE_SHA || null,
        },
      };
    }
    const summary = summarizeCompatibility(input);
    const output = optionValue(argv, '--output');
    if (output) writeJson(output, summary);
    else process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
    if (flag(argv, '--check') && !summary.ok) process.exit(1);
    return;
  }
  fail('mode must be state-result or summarize');
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  STATES,
  isSuccess,
  lessonFirstIntegrationContract,
  integrationRefreshReadinessAttestationDigest,
  stateResult,
  summarizeCompatibility,
  validateIntegrationContract,
  validateIntegrationRefreshProof,
  validateCompatibilityProof,
};
