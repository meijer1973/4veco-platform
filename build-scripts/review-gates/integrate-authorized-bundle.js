#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  fetchBundleAuthorizationComment,
  validateBundleAuthorizationRecord,
} = require('./check-human-bundle-authorization');
const {
  integrationRefreshReadinessAttestationDigest,
  validateCompatibilityProof,
  validateIntegrationRefreshProof,
} = require('./cross-repo-bundle-compatibility');
const {
  collectAutoMergeDiagnostics,
  fetchBranchProtectionSummary,
  fetchAutoMergeState,
  fetchCombinedCommitStatus,
  fetchRepositoryMergeSettings,
  INTEGRATION_CONTEXT,
  readinessCommentFromComments,
  scheduleAutoMergePr,
  disableAutoMergePr,
  setCommitStatus,
  validateIntegrationDeltaReview,
  verifyAutoMergeEnabled,
  waitForPrMerge,
} = require('./integrate-authorized-pr');
const { summarizeLineage } = require('./check-integration-lineage');
const { collectReviewThreadState, runReview } = require('./review-pr-readiness');
const { applyLiveDecision } = require('./apply-pr-readiness-decision');
const { decisionDigest } = require('./pr-readiness-router');
const { refreshBundleAgentIndexes } = require('./refresh-bundle-agent-indexes');
const { readEvidence, validateEvidence } = require('../ci/platform-ci-evidence');

const PLATFORM_REPO = 'meijer1973/4veco-platform';
const LESSON_REPO = 'meijer1973/4veco-lessen';
const READY_READINESS_ROUTES = new Set(['READY_FOR_LEAD_ONLY', 'READY_FOR_HUMAN_REVIEW']);

function fail(message) {
  console.error(`Authorized bundle integration failed: ${message}`);
  process.exit(1);
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (!args[index + 1]) fail(`missing value for ${name}`);
  return args[index + 1];
}

function flag(args, name) {
  return args.includes(name);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readReviewJson(file) {
  if (!file) return null;
  const review = readJson(file);
  if (review && typeof review === 'object' && !Array.isArray(review) && !review.path && !review.review_path) {
    return { ...review, path: file };
  }
  return review;
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function runGh(args, options = {}) {
  if (options.dryRun) return '';
  const result = spawnSync('gh', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    if (options.optional) return null;
    throw new Error(`gh ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return result.stdout;
}

function runGhBuffer(args, options = {}) {
  if (options.dryRun) return Buffer.from('');
  const result = spawnSync('gh', args, {
    cwd: process.cwd(),
    encoding: null,
    maxBuffer: 1024 * 1024 * 50,
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || Buffer.from('')).toString('utf8').trim();
    if (options.optional) return null;
    throw new Error(`gh ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return result.stdout;
}

function listIssueComments(repo, prNumber) {
  const comments = [];
  for (let page = 1; page <= 20; page += 1) {
    const raw = runGh(['api', `repos/${repo}/issues/${prNumber}/comments?per_page=100&page=${page}`]);
    const pageComments = JSON.parse(raw);
    if (!Array.isArray(pageComments)) throw new Error('issue comments response must be an array');
    comments.push(...pageComments);
    if (pageComments.length < 100) return comments;
  }
  throw new Error('too_many_issue_comments_to_scan_for_readiness_comment');
}

function fetchReadinessComment(repo, prNumber, headSha) {
  return readinessCommentFromComments(listIssueComments(repo, prNumber), repo, prNumber, headSha);
}

function fetchReviewThreadState(repo, prNumber) {
  return collectReviewThreadState(repo, prNumber, runGh);
}

function repoPermissionOk(repoInfo) {
  const permissions = (repoInfo && repoInfo.permissions) || {};
  return permissions.admin === true || permissions.maintain === true || permissions.push === true;
}

function preflightCrossRepoPermissions(options = {}) {
  if (options.dryRun) return { ok: true, dry_run: true };
  const repos = [PLATFORM_REPO, LESSON_REPO].map((repo) => {
    const info = JSON.parse(runGh(['api', `repos/${repo}`]));
    return {
      repo,
      permissions: info.permissions || null,
      ok: repoPermissionOk(info),
    };
  });
  const failures = repos.filter((item) => !item.ok).map((item) => `${item.repo}:missing_push_permission`);
  return {
    ok: failures.length === 0,
    repos,
    failures,
  };
}

function parseChecks(statusCheckRollup) {
  return (statusCheckRollup || []).map((check) => ({
    name: check.name || check.context || check.workflowName || 'unknown',
    conclusion: check.conclusion || check.status || check.state || null,
  }));
}

function successStatus(value) {
  return /^(success|succeeded|passed|pass|ok)$/i.test(String(value || '').trim());
}

function fetchPr(repo, prNumber) {
  const fields = [
    'number',
    'url',
    'state',
    'isDraft',
    'baseRefName',
    'headRefName',
    'headRefOid',
    'mergeStateStatus',
    'mergeable',
    'mergeCommit',
    'statusCheckRollup',
  ].join(',');
  return JSON.parse(runGh(['pr', 'view', String(prNumber), '--repo', repo, '--json', fields]));
}

function fetchMainSha(repo) {
  const raw = runGh(['api', `repos/${repo}/git/ref/heads/main`]);
  return JSON.parse(raw).object.sha;
}

function fetchCompareStatus(repo, baseSha, headSha) {
  const raw = runGh(['api', `repos/${repo}/compare/${baseSha}...${headSha}`], { optional: true });
  if (!raw) return { status: 'unavailable', ahead_by: null, behind_by: null };
  const data = JSON.parse(raw);
  return {
    status: data.status,
    ahead_by: data.ahead_by,
    behind_by: data.behind_by,
    merge_base_commit_sha: data.merge_base_commit && data.merge_base_commit.sha,
  };
}

function fetchInterveningCommits(repo, baseSha, headSha) {
  if (!baseSha || !headSha || baseSha === headSha) return [];
  const commits = [];
  const seen = new Set();
  let currentSha = headSha;
  for (let depth = 0; depth < 100 && currentSha && currentSha !== baseSha; depth += 1) {
    if (seen.has(currentSha)) throw new Error('cycle detected while walking bundle member first-parent chain');
    seen.add(currentSha);
    const detail = JSON.parse(runGh(['api', `repos/${repo}/commits/${currentSha}`]));
    const parents = (detail.parents || []).map((parent) => parent.sha).filter(Boolean);
    commits.unshift({
      sha: currentSha,
      parents,
      changed_paths: (detail.files || []).map((file) => file.filename).filter(Boolean),
    });
    currentSha = parents[0] || null;
  }
  if (currentSha !== baseSha) {
    throw new Error('reviewed bundle payload head was not reached on member first-parent chain');
  }
  return commits;
}

function fetchComparePaths(repo, baseSha, headSha) {
  if (!baseSha || !headSha || baseSha === headSha) return [];
  const raw = runGh(['api', `repos/${repo}/compare/${baseSha}...${headSha}`], { optional: true });
  if (!raw) return [];
  return (JSON.parse(raw).files || []).map((file) => file.filename).filter(Boolean);
}

function buildMemberLineage(repo, member, pr, mainSha, deps) {
  const reviewedPayload = member.reviewed_payload_head_sha;
  const integrationHead = pr.headRefOid;
  const payloadCompare = deps.fetchCompareStatus(repo, reviewedPayload, integrationHead);
  const payloadAncestor = ['ahead', 'identical'].includes(payloadCompare.status);
  const needsDriftBase = Boolean(member.base_sha_at_review) || reviewedPayload !== integrationHead;
  const mainCompare = needsDriftBase ? deps.fetchCompareStatus(repo, reviewedPayload, mainSha) : null;
  const driftBaseSha = member.base_sha_at_review || (mainCompare && mainCompare.merge_base_commit_sha) || null;
  return deps.summarizeLineage({
    reviewed_payload_head_sha: reviewedPayload,
    integration_head_sha: integrationHead,
    base_sha_at_review: driftBaseSha,
    current_main_sha: mainSha,
    payload_ancestor_of_integration_head: payloadAncestor,
    payload_paths: driftBaseSha ? deps.fetchComparePaths(repo, driftBaseSha, reviewedPayload) : [],
    base_delta_paths: driftBaseSha ? deps.fetchComparePaths(repo, driftBaseSha, mainSha) : [],
    intervening_commits: payloadAncestor ? deps.fetchInterveningCommits(repo, reviewedPayload, integrationHead) : [],
  });
}

function memberStateFromPr(repo, member, pr, mainSha, deps) {
  const lineage = buildMemberLineage(repo, member, pr, mainSha, deps);
  return {
    ...member,
    head_sha: pr.headRefOid,
    integration_head_sha: pr.headRefOid,
    authorization_inherited: lineage.authorization_inherited === true,
    lineage,
    failures: lineage.failures || [],
  };
}

function isHeadCurrentWithMain(repo, mainSha, headSha, deps) {
  const compare = deps.fetchCompareStatus(repo, mainSha, headSha);
  return {
    ok: ['ahead', 'identical'].includes(compare.status),
    compare,
  };
}

function updateBranch(repo, prNumber, expectedHeadSha, options = {}) {
  if (options.dryRun) return { dry_run: true, repo, prNumber, expected_head_sha: expectedHeadSha };
  const payload = JSON.stringify({ expected_head_sha: expectedHeadSha });
  const result = spawnSync(
    'gh',
    ['api', '-X', 'PUT', `repos/${repo}/pulls/${prNumber}/update-branch`, '--input', '-'],
    {
      input: payload,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 20,
    }
  );
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`update-branch failed${detail ? `: ${detail}` : ''}`);
  }
  return JSON.parse(result.stdout || '{}');
}

function mergePr(repo, prNumber, headSha, options = {}) {
  if (options.dryRun) return { dry_run: true, repo, prNumber, head_sha: headSha };
  runGh(['pr', 'merge', String(prNumber), '--repo', repo, '--merge', '--match-head-commit', headSha]);
  return { merged: true, repo, prNumber, head_sha: headSha };
}

function setPlatformIntegrationStatus(deps, sha, state, description, targetUrl, options = {}) {
  if (!sha) {
    return {
      ok: false,
      failure: 'platform_integration_status_head_missing',
      state,
      context: INTEGRATION_CONTEXT,
    };
  }
  if (options.dryRun) {
    return {
      ok: true,
      dry_run: true,
      state,
      sha,
      context: INTEGRATION_CONTEXT,
    };
  }
  try {
    return {
      ok: true,
      status: deps.setCommitStatus(PLATFORM_REPO, sha, state, description, targetUrl, options),
    };
  } catch (error) {
    return {
      ok: false,
      failure: 'platform_integration_status_update_failed',
      state,
      sha,
      context: INTEGRATION_CONTEXT,
      error: error.message,
    };
  }
}

function platformStatusTarget(pr) {
  return {
    sha: pr && pr.headRefOid,
    url: pr && pr.url,
  };
}

function withTerminalFailureStatus(result, deps, target, options, description) {
  const status = setPlatformIntegrationStatus(
    deps,
    target && target.sha,
    'failure',
    description,
    target && target.url,
    options
  );
  return status.ok
    ? { ...result, integration_status: status }
    : { ...result, integration_status: status, status_failure: status };
}

function fetchMergedPr(repo, prNumber) {
  const fields = ['number', 'state', 'mergedAt', 'mergeCommit', 'headRefOid', 'url'].join(',');
  return JSON.parse(runGh(['pr', 'view', String(prNumber), '--repo', repo, '--json', fields]));
}

function selectLatestRunForHead(runs, headSha, options = {}) {
  const minDatabaseId = Number(options.minDatabaseId || 0);
  const workflowEvent = options.workflowEvent || null;
  return (runs || [])
    .filter((run) =>
      run.headSha === headSha &&
      Number(run.databaseId || 0) > minDatabaseId &&
      (!workflowEvent || run.event === workflowEvent)
    )
    .sort((a, b) => Number(b.databaseId || 0) - Number(a.databaseId || 0))[0] || null;
}

function findMainWorkflowRun(repo, headSha, options = {}) {
  const raw = runGh([
    'run',
    'list',
    '--repo',
    repo,
    '--branch',
    'main',
    '--workflow',
    'platform-ci',
    '--limit',
    '20',
    '--json',
    'databaseId,status,conclusion,headSha,url,event',
  ]);
  return selectLatestRunForHead(JSON.parse(raw) || [], headSha, options);
}

function findWorkflowRunForHead(repo, headSha, options = {}) {
  const raw = runGh([
    'run',
    'list',
    '--repo',
    repo,
    '--workflow',
    'platform-ci',
    '--limit',
    '50',
    '--json',
    'databaseId,status,conclusion,headSha,url,event',
  ]);
  return selectLatestRunForHead(JSON.parse(raw) || [], headSha, options);
}

function latestWorkflowRunDatabaseId(repo, headSha) {
  const raw = runGh([
    'run',
    'list',
    '--repo',
    repo,
    '--workflow',
    'platform-ci',
    '--limit',
    '50',
    '--json',
    'databaseId,headSha',
  ]);
  return Math.max(
    0,
    ...(JSON.parse(raw) || [])
      .filter((run) => run.headSha === headSha)
      .map((run) => Number(run.databaseId || 0))
  );
}

function requireFullSha(value, label) {
  const sha = String(value || '').trim().toLowerCase();
  if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error(`${label} must be a full 40-character commit SHA`);
  return sha;
}

function platformCiDispatchArgs(ref, options = {}) {
  const workflowRef = String(ref || '').trim();
  if (!workflowRef) throw new Error('platform-ci dispatch ref is required');
  const y1BaseSha = requireFullSha(options.y1BaseSha, 'y1_base_sha');
  const y1HeadSha = requireFullSha(options.y1HeadSha, 'y1_head_sha');
  return [
    'workflow',
    'run',
    'platform-ci.yml',
    '--repo',
    PLATFORM_REPO,
    '--ref',
    workflowRef,
    '-f',
    `y1_base_sha=${y1BaseSha}`,
    '-f',
    `y1_head_sha=${y1HeadSha}`,
  ];
}

function triggerPlatformCiForRef(ref, options = {}) {
  const args = platformCiDispatchArgs(ref, options);
  if (options.dryRun) return { dry_run: true, ref, args };
  const runner = options.runGhCommand || runGh;
  const raw = runner(args);
  return {
    triggered: true,
    ref,
    y1_base_sha: options.y1BaseSha,
    y1_head_sha: options.y1HeadSha,
    args,
    output: raw,
  };
}

function triggerPlatformCi(options = {}) {
  return triggerPlatformCiForRef('main', options);
}

function sleep(ms) {
  if (ms <= 0) return;
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function findFileRecursive(root, fileName) {
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.name === fileName) return full;
    }
  }
  return null;
}

function downloadPlatformCiEvidence(runId, options = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `platform-ci-${runId}-`));
  runGh([
    'run',
    'download',
    String(runId),
    '--repo',
    PLATFORM_REPO,
    '--name',
    'platform-ci-diagnostics',
    '--dir',
    dir,
  ]);
  const evidencePath = findFileRecursive(dir, 'platform-ci-evidence.json');
  if (!evidencePath) return { ok: false, failure: 'platform_ci_evidence_missing', run_id: runId };
  const evidence = readEvidence(evidencePath);
  validateEvidence(evidence);
  return {
    ok: true,
    run_id: runId,
    path: evidencePath,
    sha256: sha256File(evidencePath),
    evidence,
  };
}

function parseArtifactSha256Digest(artifact) {
  const digest = normalizeRunField(artifact, 'digest', 'digest');
  const match = String(digest || '').match(/^sha256:([a-f0-9]{64})$/i);
  return match ? match[1].toLowerCase() : null;
}

function downloadCompatibilityArtifactZip(artifact, options = {}) {
  if (!artifact || !artifact.id) return { ok: false, failure: 'compatibility_artifact_id_missing' };
  const zip = runGhBuffer(
    ['api', `repos/${PLATFORM_REPO}/actions/artifacts/${artifact.id}/zip`],
    { ...options, dryRun: false }
  );
  const sha256 = crypto.createHash('sha256').update(zip).digest('hex');
  const expected = parseArtifactSha256Digest(artifact);
  return {
    ok: Boolean(expected) && sha256 === expected,
    failure: !expected
      ? 'compatibility_artifact_digest_missing'
      : sha256 === expected
        ? null
        : 'compatibility_artifact_digest_mismatch',
    sha256,
    expected_sha256: expected,
  };
}

function downloadCompatibilityArtifactSummary(runId, options = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `bundle-summary-${runId}-`));
  runGh([
    'run',
    'download',
    String(runId),
    '--repo',
    PLATFORM_REPO,
    '--name',
    'bundle-summary',
    '--dir',
    dir,
  ]);
  const summaryPath = findFileRecursive(dir, 'bundle-summary.json');
  if (!summaryPath) return { ok: false, failure: 'compatibility_artifact_summary_missing', run_id: runId };
  return {
    ok: true,
    run_id: runId,
    path: summaryPath,
    sha256: sha256File(summaryPath),
  };
}

function validatePlatformCiEvidence(evidence, expected = {}) {
  const failures = [];
  const item = evidence || {};
  try {
    validateEvidence(item);
  } catch (error) {
    failures.push(error.message);
  }
  if (expected.platformSha && item.platform && item.platform.head_sha !== expected.platformSha) {
    failures.push(`platform_head_mismatch: expected ${expected.platformSha}`);
  }
  if (expected.lessonSha && item.lessen && item.lessen.head_sha !== expected.lessonSha) {
    failures.push(`lesson_head_mismatch: expected ${expected.lessonSha}`);
  }
  return {
    ok: failures.length === 0,
    failures,
    evidence: item,
  };
}

function normalizeRunField(run, snakeKey, camelKey) {
  return run && (run[snakeKey] !== undefined ? run[snakeKey] : run[camelKey]);
}

function validateCompatibilityWorkflowProvenance(run, artifact, compatibility, expected = {}) {
  const failures = [];
  const runId = String(expected.runId || '');
  if (!run || typeof run !== 'object') failures.push('compatibility_workflow_run_missing');
  const runDatabaseId = String(normalizeRunField(run, 'id', 'databaseId') || normalizeRunField(run, 'database_id', 'databaseId') || '');
  if (!runDatabaseId) failures.push('compatibility_run_id_missing');
  else if (runId && runDatabaseId !== runId) failures.push(`compatibility_run_id_mismatch: expected ${runId}`);
  const workflowId = String(normalizeRunField(run, 'workflow_id', 'workflowId') || '');
  if (!workflowId) failures.push('compatibility_workflow_id_missing');
  else if (expected.workflowId && workflowId !== String(expected.workflowId)) {
    failures.push(`compatibility_workflow_id_mismatch: expected ${expected.workflowId}`);
  }
  const pathValue = normalizeRunField(run, 'path', 'path');
  if (pathValue !== '.github/workflows/cross-repo-bundle-compatibility.yml') {
    failures.push('compatibility_workflow_path_mismatch');
  }
  if (normalizeRunField(run, 'event', 'event') !== 'workflow_dispatch') {
    failures.push('compatibility_workflow_event_mismatch');
  }
  if (normalizeRunField(run, 'status', 'status') !== 'completed') failures.push('compatibility_workflow_not_completed');
  if (normalizeRunField(run, 'conclusion', 'conclusion') !== 'success') failures.push('compatibility_workflow_not_successful');
  const runHeadSha = normalizeRunField(run, 'head_sha', 'headSha');
  if (expected.exactMembers && runHeadSha !== expected.exactMembers.platform_base_sha) {
    failures.push(`compatibility_workflow_sha_mismatch: expected ${expected.exactMembers.platform_base_sha}`);
  }
  const artifactName = normalizeRunField(artifact, 'name', 'name');
  if (artifactName !== 'bundle-summary') failures.push('compatibility_artifact_name_mismatch');
  if (artifact && artifact.expired === true) failures.push('compatibility_artifact_expired');
  const artifactDigest = parseArtifactSha256Digest(artifact);
  if (!artifactDigest) failures.push('compatibility_artifact_digest_missing');
  if (expected.artifactZipFailure) failures.push(expected.artifactZipFailure);
  if (!expected.artifactZipSha256) {
    failures.push('compatibility_artifact_digest_unverified');
  } else if (artifactDigest && String(expected.artifactZipSha256).toLowerCase() !== artifactDigest) {
    failures.push('compatibility_artifact_digest_mismatch');
  }
  if (expected.downloadedProofFailure) failures.push(expected.downloadedProofFailure);
  if (!expected.proofSha256 || !expected.downloadedProofSha256) {
    failures.push('compatibility_artifact_summary_unverified');
  } else if (expected.proofSha256 !== expected.downloadedProofSha256) {
    failures.push('compatibility_artifact_summary_mismatch');
  }
  const provenance = compatibility.provenance || {};
  if (String(provenance.run_id || '') !== runId) failures.push('compatibility_summary_run_id_mismatch');
  if (provenance.workflow !== 'cross-repo-bundle-compatibility') {
    failures.push('compatibility_summary_workflow_name_mismatch');
  }
  const expectedWorkflowRef =
    expected.workflowRef || `${PLATFORM_REPO}/.github/workflows/cross-repo-bundle-compatibility.yml@refs/heads/main`;
  if (provenance.workflow_ref !== expectedWorkflowRef) {
    failures.push(`compatibility_summary_workflow_ref_mismatch: expected ${expectedWorkflowRef}`);
  }
  const expectedWorkflowSha = expected.exactMembers && expected.exactMembers.platform_base_sha;
  if (!provenance.workflow_sha || (expectedWorkflowSha && provenance.workflow_sha !== expectedWorkflowSha)) {
    failures.push(`compatibility_summary_workflow_sha_mismatch: expected ${expectedWorkflowSha || 'trusted workflow sha'}`);
  }
  if (provenance.event_name !== 'workflow_dispatch') {
    failures.push('compatibility_summary_event_mismatch');
  }
  const inputs = provenance.inputs || {};
  if (expected.bundleId && inputs.bundle_id !== expected.bundleId) {
    failures.push(`compatibility_input_bundle_id_mismatch: expected ${expected.bundleId}`);
  }
  for (const [key, expectedSha] of Object.entries((expected && expected.exactMembers) || {})) {
    if (inputs[key] !== expectedSha) {
      failures.push(`compatibility_input_${key}_mismatch: expected ${expectedSha}`);
    }
  }
  return {
    ok: failures.length === 0,
    failures,
    run: run || null,
    artifact: artifact || null,
  };
}

function fetchCompatibilityArtifact(runId) {
  const raw = runGh(['api', `repos/${PLATFORM_REPO}/actions/runs/${runId}/artifacts`]);
  const artifacts = JSON.parse(raw).artifacts || [];
  return artifacts.find((artifact) => artifact.name === 'bundle-summary') || null;
}

function fetchCompatibilityWorkflowInfo() {
  return JSON.parse(runGh(['api', `repos/${PLATFORM_REPO}/actions/workflows/cross-repo-bundle-compatibility.yml`]));
}

function verifyCompatibilityWorkflowRun(runId, compatibility, expected = {}, options = {}) {
  if (!runId) {
    return { ok: false, failures: ['compatibility_workflow_run_id_required'] };
  }
  const fetchRun = options.fetchCompatibilityWorkflowRun || ((id) =>
    JSON.parse(runGh(['api', `repos/${PLATFORM_REPO}/actions/runs/${id}`])));
  const fetchArtifact = options.fetchCompatibilityArtifact || fetchCompatibilityArtifact;
  const fetchWorkflow = options.fetchCompatibilityWorkflowInfo || fetchCompatibilityWorkflowInfo;
  const downloadZip = options.downloadCompatibilityArtifactZip || downloadCompatibilityArtifactZip;
  const downloadSummary = options.downloadCompatibilityArtifactSummary || downloadCompatibilityArtifactSummary;
  const run = fetchRun(runId);
  const artifact = fetchArtifact(runId);
  const workflow = fetchWorkflow();
  const zip = downloadZip(artifact, { ...options, dryRun: false });
  const summary = downloadSummary(runId, { ...options, dryRun: false });
  return validateCompatibilityWorkflowProvenance(run, artifact, compatibility, {
    runId: String(runId),
    bundleId: expected.bundleId,
    exactMembers: expected.exactMembers,
    workflowId: workflow && workflow.id,
    compatibilityProofPath: expected.compatibilityProofPath,
    proofSha256: expected.compatibilityProofPath ? sha256File(expected.compatibilityProofPath) : null,
    artifactZipSha256: zip.sha256,
    artifactZipFailure: zip.ok === false ? zip.failure : null,
    downloadedProofSha256: summary.sha256,
    downloadedProofFailure: summary.ok === false ? summary.failure : null,
  });
}

function verifyPlatformCiRun(run, expected = {}, options = {}) {
  if (!run || run.status !== 'completed') return { ok: false, failure: 'platform_ci_run_not_completed', run };
  if (run.conclusion !== 'success') return { ok: false, failure: 'platform_ci_run_not_successful', run };
  if (!expected.platformSha && !expected.lessonSha) return { ok: true, run };
  const downloaded = downloadPlatformCiEvidence(run.databaseId, options);
  if (!downloaded.ok) return { ok: false, failure: downloaded.failure, run, downloaded };
  const evidence = validatePlatformCiEvidence(downloaded.evidence, expected);
  return {
    ok: evidence.ok,
    failure: evidence.ok ? null : 'platform_ci_evidence_mismatch',
    run,
    artifact: {
      path: downloaded.path,
      sha256: downloaded.sha256,
    },
    evidence,
  };
}

function waitForPlatformMainCi(headSha, options = {}) {
  if (options.dryRun) return { ok: true, dry_run: true, head_sha: headSha };
  const timeoutSeconds = Number(options.timeoutSeconds || 1800);
  const pollSeconds = Number(options.pollSeconds || 20);
  const deadline = Date.now() + timeoutSeconds * 1000;
  let lastRun = null;
  while (Date.now() <= deadline) {
    lastRun = findMainWorkflowRun(PLATFORM_REPO, headSha, options);
    if (lastRun && lastRun.status === 'completed') {
      return {
        head_sha: headSha,
        ...verifyPlatformCiRun(lastRun, {
          platformSha: options.expectedPlatformSha,
          lessonSha: options.expectedLessonSha,
        }, options),
      };
    }
    sleep(pollSeconds * 1000);
  }
  return { ok: false, head_sha: headSha, run: lastRun, failure: 'platform_main_ci_timeout' };
}

function waitForPlatformHeadCi(headSha, options = {}) {
  if (options.dryRun) return { ok: true, dry_run: true, head_sha: headSha };
  const timeoutSeconds = Number(options.timeoutSeconds || 1800);
  const pollSeconds = Number(options.pollSeconds || 20);
  const deadline = Date.now() + timeoutSeconds * 1000;
  let lastRun = null;
  while (Date.now() <= deadline) {
    lastRun = findWorkflowRunForHead(PLATFORM_REPO, headSha, options);
    if (lastRun && lastRun.status === 'completed') {
      return {
        head_sha: headSha,
        ...verifyPlatformCiRun(lastRun, {
          platformSha: options.expectedPlatformSha || headSha,
          lessonSha: options.expectedLessonSha,
        }, options),
      };
    }
    sleep(pollSeconds * 1000);
  }
  return { ok: false, head_sha: headSha, run: lastRun, failure: 'platform_head_ci_timeout' };
}

function validatePlatformCiRange(baseSha, headSha) {
  if (baseSha === headSha) {
    return { ok: true, status: 'identical', base_sha: baseSha, head_sha: headSha };
  }
  const comparison = fetchCompareStatus(PLATFORM_REPO, baseSha, headSha);
  return {
    ok: comparison.status === 'ahead' && Number(comparison.behind_by || 0) === 0,
    base_sha: baseSha,
    head_sha: headSha,
    comparison,
  };
}

function acquirePlatformMainCi(deps, coordinates = {}, options = {}) {
  let y1BaseSha;
  let y1HeadSha;
  let expectedPlatformSha;
  let expectedLessonSha;
  try {
    y1BaseSha = requireFullSha(coordinates.y1BaseSha, 'y1_base_sha');
    y1HeadSha = requireFullSha(coordinates.y1HeadSha, 'y1_head_sha');
    expectedPlatformSha = requireFullSha(coordinates.expectedPlatformSha, 'expected_platform_sha');
    expectedLessonSha = requireFullSha(coordinates.expectedLessonSha, 'expected_lesson_sha');
  } catch (error) {
    return { ok: false, failure: 'platform_ci_coordinates_invalid', error: error.message };
  }
  if (y1HeadSha !== expectedPlatformSha) {
    return {
      ok: false,
      failure: 'platform_ci_y1_head_mismatch',
      expected_platform_sha: expectedPlatformSha,
      y1_head_sha: y1HeadSha,
    };
  }
  let range;
  try {
    range = deps.validatePlatformCiRange(y1BaseSha, y1HeadSha);
  } catch (error) {
    return { ok: false, failure: 'platform_ci_y1_range_check_failed', error: error.message };
  }
  if (!range || range.ok !== true) {
    return {
      ok: false,
      failure: 'platform_ci_y1_range_invalid',
      y1_base_sha: y1BaseSha,
      y1_head_sha: y1HeadSha,
      range,
    };
  }

  const automaticOptions = {
    ...options,
    minDatabaseId: Number(coordinates.automaticMinDatabaseId || 0),
    workflowEvent: 'push',
    timeoutSeconds: Number(options.automaticRunTimeoutSeconds || 120),
    expectedPlatformSha,
    expectedLessonSha,
  };
  let automatic;
  try {
    automatic = deps.waitForPlatformMainCi(expectedPlatformSha, automaticOptions);
  } catch (error) {
    return { ok: false, failure: 'automatic_platform_main_ci_observation_failed', error: error.message, range };
  }
  const automaticRunObserved = Boolean(automatic && automatic.run);
  if (automatic.ok) {
    return { ...automatic, source: 'automatic_main_push', dispatch: null, range };
  }
  if (automatic.failure === 'platform_main_ci_timeout' && automatic.run) {
    try {
      automatic = deps.waitForPlatformMainCi(expectedPlatformSha, {
        ...automaticOptions,
        timeoutSeconds: Number(options.timeoutSeconds || 1800),
      });
    } catch (error) {
      return { ok: false, failure: 'automatic_platform_main_ci_wait_failed', error: error.message, range };
    }
    if (automatic.ok) {
      return { ...automatic, source: 'automatic_main_push', dispatch: null, range };
    }
  }
  if (automatic.failure !== 'platform_main_ci_timeout' || automatic.run || automaticRunObserved) {
    return {
      ok: false,
      failure: 'automatic_platform_main_ci_failed',
      automatic_ci: automatic,
      dispatch: null,
      range,
    };
  }

  let minDatabaseId;
  try {
    minDatabaseId = deps.latestWorkflowRunDatabaseId(PLATFORM_REPO, expectedPlatformSha);
  } catch (error) {
    return {
      ok: false,
      failure: 'platform_ci_fallback_floor_failed',
      error: error.message,
      automatic_ci: automatic,
      dispatch: null,
      range,
    };
  }
  let recheckedAutomaticRun;
  try {
    recheckedAutomaticRun = deps.findMainWorkflowRun(PLATFORM_REPO, expectedPlatformSha, {
      ...options,
      minDatabaseId: Number(coordinates.automaticMinDatabaseId || 0),
      workflowEvent: 'push',
    });
  } catch (error) {
    return {
      ok: false,
      failure: 'platform_ci_automatic_recheck_failed',
      error: error.message,
      automatic_ci: automatic,
      dispatch: null,
      range,
    };
  }
  if (recheckedAutomaticRun) {
    let recheckedAutomatic;
    try {
      recheckedAutomatic = deps.waitForPlatformMainCi(expectedPlatformSha, {
        ...automaticOptions,
        timeoutSeconds: Number(options.timeoutSeconds || 1800),
      });
    } catch (error) {
      return {
        ok: false,
        failure: 'automatic_platform_main_ci_wait_failed',
        error: error.message,
        rechecked_run: recheckedAutomaticRun,
        dispatch: null,
        range,
      };
    }
    return recheckedAutomatic.ok
      ? {
          ...recheckedAutomatic,
          source: 'automatic_main_push_rechecked',
          dispatch: null,
          rechecked_run: recheckedAutomaticRun,
          range,
        }
      : {
          ok: false,
          failure: 'automatic_platform_main_ci_failed',
          automatic_ci: recheckedAutomatic,
          rechecked_run: recheckedAutomaticRun,
          dispatch: null,
          range,
        };
  }
  let dispatch;
  try {
    dispatch = deps.triggerPlatformCi({
      ...options,
      y1BaseSha,
      y1HeadSha,
    });
  } catch (error) {
    return {
      ok: false,
      failure: 'platform_ci_fallback_dispatch_failed',
      error: error.message,
      automatic_ci: automatic,
      dispatch: null,
      range,
    };
  }
  let fallback;
  try {
    fallback = deps.waitForPlatformMainCi(expectedPlatformSha, {
      ...options,
      minDatabaseId,
      workflowEvent: 'workflow_dispatch',
      expectedPlatformSha,
      expectedLessonSha,
    });
  } catch (error) {
    return {
      ok: false,
      failure: 'platform_ci_fallback_wait_failed',
      error: error.message,
      automatic_ci: automatic,
      dispatch,
      range,
    };
  }
  return fallback.ok
    ? { ...fallback, source: 'manual_dispatch_fallback', dispatch, automatic_ci: automatic, range }
    : {
        ok: false,
        failure: fallback.failure || 'platform_ci_fallback_failed',
        fallback_ci: fallback,
        automatic_ci: automatic,
        dispatch,
        range,
      };
}

function refreshPlatformPrCi(pr, options = {}) {
  if (!pr || !pr.headRefOid) return { ok: false, failure: 'platform_pr_head_missing' };
  const ref = pr.headRefName || pr.headRefOid;
  const findRun = options.findWorkflowRunForHead || findWorkflowRunForHead;
  const verifyRun = options.verifyPlatformCiRun || verifyPlatformCiRun;
  const existingRun = findRun(PLATFORM_REPO, pr.headRefOid, options);
  if (existingRun && existingRun.status === 'completed' && existingRun.conclusion === 'success') {
    const existing = verifyRun(existingRun, {
      platformSha: pr.headRefOid,
      lessonSha: options.expectedLessonSha,
    }, options);
    if (existing.ok) {
      return { ...existing, reused: true, head_sha: pr.headRefOid, ...(options.dryRun ? { dry_run: true } : {}) };
    }
  }
  if (options.dryRun) {
    return {
      ok: false,
      dry_run: true,
      head_sha: pr.headRefOid,
      failure: 'exact_pair_platform_ci_missing_or_invalid',
    };
  }
  const latestRunId = options.latestWorkflowRunDatabaseId || latestWorkflowRunDatabaseId;
  const trigger = options.triggerPlatformCiForRef || triggerPlatformCiForRef;
  const wait = options.waitForPlatformHeadCi || waitForPlatformHeadCi;
  const minDatabaseId = latestRunId(PLATFORM_REPO, pr.headRefOid);
  let dispatch;
  try {
    dispatch = trigger(ref, {
      ...options,
      y1HeadSha: pr.headRefOid,
    });
  } catch (error) {
    return {
      ok: false,
      head_sha: pr.headRefOid,
      failure: 'platform_ci_fallback_dispatch_failed',
      error: error.message,
    };
  }
  return wait(pr.headRefOid, {
    ...options,
    minDatabaseId,
    workflowEvent: 'workflow_dispatch',
    expectedPlatformSha: pr.headRefOid,
    dispatch,
  });
}

function normalizeBundlePayloadLeadReview(record) {
  const item = record && typeof record === 'object' && !Array.isArray(record) ? record : {};
  return {
    schema_version: item.schema_version,
    result: String(item.result || item.review_result || item.verdict || '').trim().toUpperCase(),
    path: item.path || item.review_path || null,
    repository: item.repository || item.repo || null,
    pr_number: Number(item.pr_number || item.number || 0) || null,
    bundle_id: item.bundle_id || null,
    reviewed_payload_head_sha:
      item.reviewed_payload_head_sha || item.reviewed_commit_sha || item.reviewed_sha || null,
  };
}

function validateBundlePayloadLeadReview(record, expected = {}) {
  const review = normalizeBundlePayloadLeadReview(record);
  const failures = [];
  if (review.schema_version !== 1) failures.push('payload_lead_review_schema_version_invalid');
  if (!['PASS', 'PASS WITH FLAGS'].includes(review.result)) failures.push('payload_lead_review_result_not_passing');
  if (typeof review.path !== 'string' || !review.path.trim()) failures.push('payload_lead_review_path_missing');
  if (review.repository !== expected.repository) failures.push('payload_lead_review_repository_mismatch');
  if (review.pr_number !== Number(expected.prNumber)) failures.push('payload_lead_review_pr_mismatch');
  if (review.bundle_id !== expected.bundleId) failures.push('payload_lead_review_bundle_mismatch');
  if (review.reviewed_payload_head_sha !== expected.payloadSha) failures.push('payload_lead_review_payload_mismatch');
  return { ok: failures.length === 0, failures, review };
}

function validateLessonLeadReadiness(readiness, expected = {}) {
  const failures = [];
  if (!readiness || readiness.ok !== true || !readiness.decision) {
    failures.push('lesson_payload_readiness_missing_or_invalid');
  }
  const decision = readiness && readiness.decision || {};
  if (!READY_READINESS_ROUTES.has(decision.route)) failures.push('lesson_payload_readiness_not_ready');
  const reviewedPr = decision.reviewed_pr || {};
  if (reviewedPr.repo !== LESSON_REPO) failures.push('lesson_payload_readiness_repository_mismatch');
  if (Number(reviewedPr.number) !== Number(expected.prNumber)) failures.push('lesson_payload_readiness_pr_mismatch');
  if (reviewedPr.head_sha !== expected.payloadSha) failures.push('lesson_payload_readiness_head_mismatch');
  const proof = decision.proof || {};
  if (!['PASS', 'PASS WITH FLAGS'].includes(String(proof.lead_review_result || '').trim().toUpperCase())) {
    failures.push('lesson_payload_lead_review_result_not_passing');
  }
  if (typeof proof.lead_review_path !== 'string' || !proof.lead_review_path.trim()) {
    failures.push('lesson_payload_lead_review_path_missing');
  }
  if (proof.lead_reviewed_sha !== expected.payloadSha) failures.push('lesson_payload_lead_review_sha_mismatch');
  return {
    ok: failures.length === 0,
    failures,
    decision,
    paired_review: {
      repository: LESSON_REPO,
      pr_number: Number(expected.prNumber),
      reviewed_commit_sha: expected.payloadSha,
      review_result: proof.lead_review_result || null,
      review_path: proof.lead_review_path || null,
    },
  };
}

function resolveBundleReadinessSeed(input) {
  const payloadReadiness = input.payloadReadiness;
  if (payloadReadiness && payloadReadiness.ok === true && payloadReadiness.decision) {
    if (!READY_READINESS_ROUTES.has(payloadReadiness.decision.route)) {
      return { ok: false, phase: 'payload_readiness', failure: 'payload_readiness_decision_not_ready' };
    }
    const proof = payloadReadiness.decision.proof || {};
    return {
      ok: true,
      source: 'payload_readiness',
      route: payloadReadiness.decision.route,
      decision: payloadReadiness.decision,
      proof,
      bundle: proof.bundle || {},
    };
  }

  const platformReview = validateBundlePayloadLeadReview(input.payloadLeadReview, {
    repository: PLATFORM_REPO,
    prNumber: input.platformPr && input.platformPr.number,
    bundleId: input.authorization && input.authorization.bundle_id,
    payloadSha: input.platformPayloadSha,
  });
  if (!platformReview.ok) {
    return { ok: false, phase: 'payload_lead_review', failures: platformReview.failures, review: platformReview.review };
  }
  const lessonReview = validateLessonLeadReadiness(input.lessonReadiness, {
    prNumber: input.lessonPr && input.lessonPr.number,
    payloadSha: input.lessonPayloadSha,
  });
  if (!lessonReview.ok) {
    return { ok: false, phase: 'lesson_lead_review', failures: lessonReview.failures };
  }
  return {
    ok: true,
    source: 'residual_readiness_bridge',
    route: 'READY_FOR_HUMAN_REVIEW',
    decision: {
      route: 'READY_FOR_HUMAN_REVIEW',
      throughput: {
        class: 'cross_repo_bundle',
        authority_class: 'high_authority',
        level: 'L4',
        human_decision_required: true,
      },
      human_review_payload: 'consequential_exception',
      consequence: 'high',
      batching: {
        viable: false,
        target: null,
        reason: 'Residual bundle readiness requires exact-head human review.',
      },
    },
    proof: {
      checkers: [],
      lead_review_path: platformReview.review.path,
      lead_review_result: platformReview.review.result,
      lead_reviewed_sha: platformReview.review.reviewed_payload_head_sha,
    },
    bundle: {
      paired_lead_reviews: [lessonReview.paired_review],
    },
    payload_lead_review: platformReview.review,
    lesson_lead_review: lessonReview.paired_review,
  };
}

function generateBundleIntegrationReadiness(input, options = {}) {
  const seed = resolveBundleReadinessSeed(input);
  if (!seed.ok) return seed;
  const payloadDecision = seed.decision;
  const payloadProof = seed.proof;
  const lineage = input.lineage || {};
  const baseDrift = lineage.base_drift || {};
  const deltaReviewRequired =
    lineage.requires_integration_delta_lead_review === true ||
    baseDrift.requires_integration_delta_lead_review === true;
  const deltaReviewValidation = input.deltaReview
    ? validateIntegrationDeltaReview(input.deltaReview, lineage)
    : { ok: false, failures: ['integration_delta_review_missing'], review: null };
  if (deltaReviewRequired && !deltaReviewValidation.ok) {
    return {
      ok: false,
      phase: 'integration_delta_lead_review_required',
      failures: deltaReviewValidation.failures,
      delta_review: deltaReviewValidation,
    };
  }
  if (!deltaReviewRequired && input.deltaReview) {
    return {
      ok: false,
      phase: 'integration_delta_lead_review_unexpected',
      failures: ['integration_delta_review_not_required'],
    };
  }
  const validatedDeltaReview = deltaReviewRequired ? deltaReviewValidation.review : null;
  const compatibility = input.compatibility;
  const refreshProof = {
    status: 'complete',
    order: 'lesson-first',
    platform_payload_sha: input.platformPayloadSha,
    platform_integration_head_sha: input.platformPr.headRefOid,
    lesson_payload_sha: input.lessonPayloadSha,
    lesson_merge_commit_sha: input.lessonMergeCommitSha,
    refresh_result: input.refreshResult,
    lineage,
    readiness: {
      head_sha: input.platformPr.headRefOid,
      route: seed.route,
      attestation_schema_version: 2,
      attestation_digest: null,
    },
    ci: input.ci,
  };
  refreshProof.readiness.attestation_digest = integrationRefreshReadinessAttestationDigest(refreshProof);
  const refreshValidation = validateIntegrationRefreshProof(refreshProof, {
    compatibility,
    controllerHead: input.platformPr.headRefOid,
    lessonMergeSha: input.lessonMergeCommitSha,
    platformBranch: input.platformPr.headRefName,
  });
  if (!refreshValidation.ok) {
    return { ok: false, phase: 'integration_refresh_proof', failures: refreshValidation.failures };
  }
  const payloadBundle = seed.bundle;
  const supplemental = {
    throughput: payloadDecision.throughput,
    human_review_payload: payloadDecision.human_review_payload,
    consequence: payloadDecision.consequence,
    batching: payloadDecision.batching,
    proof: {
      checkers: [
        ...((payloadProof.checkers || []).map((checker) => ({ ...checker }))),
        { command: 'check-human-bundle-authorization', status: 'passed' },
        { command: 'verify-compatibility-workflow-provenance', status: 'passed' },
        { command: 'trusted post-first-merge agent-index refresh', status: 'passed' },
        { command: 'check-integration-lineage', status: 'passed' },
        { command: 'exact refreshed-head platform CI', status: 'passed' },
        ...(validatedDeltaReview
          ? [{
              command: 'integration delta lead review',
              status: 'passed',
              reviewed_commit_sha: input.platformPr.headRefOid,
            }]
          : []),
      ],
      lead_review: {
        path: payloadProof.lead_review_path,
        result: payloadProof.lead_review_result,
        reviewed_commit_sha: payloadProof.lead_reviewed_sha,
        paired_member_reviews: payloadBundle.paired_lead_reviews || [],
      },
      branch_protection: input.branchProtection,
      human_authorization: {
        decision: input.authorization.decision,
        reviewed_payload_head_sha: input.platformPayloadSha,
        bundle_id: input.authorization.bundle_id,
        comment_id: input.authorizationCommentId || null,
      },
      integration: {
        ...lineage,
        deterministic_refresh_verified: true,
        ...(validatedDeltaReview ? { delta_review: validatedDeltaReview } : {}),
      },
    },
    bundle: {
      ...payloadBundle,
      bundle_id: input.authorization.bundle_id,
      complete: true,
      controller: {
        repository: PLATFORM_REPO,
        pr_number: input.platformPr.number,
        base: 'main',
        head_sha: input.platformPr.headRefOid,
        integration_head_sha: input.platformPr.headRefOid,
        reviewed_payload_head_sha: input.platformPayloadSha,
        authorization_inherited: true,
        lineage: input.lineage,
        failures: input.lineage.failures || [],
        open: true,
        current: true,
        mergeable: true,
        ready: true,
        is_draft: false,
      },
      paired_prs: [{
        repository: LESSON_REPO,
        pr_number: input.lessonPr.number,
        base: 'main',
        head_sha: input.lessonPayloadSha,
        integration_head_sha: input.lessonPayloadSha,
        reviewed_payload_head_sha: input.lessonPayloadSha,
        merge_commit_sha: input.lessonMergeCommitSha,
        merged: true,
        open: false,
        current: true,
        mergeable: true,
        ready: true,
        is_draft: false,
      }],
      exact_members: compatibility.exact_members,
      compatibility,
      integration_refresh: refreshProof,
    },
  };
  let review;
  try {
    review = (options.runReview || runReview)({
      repo: PLATFORM_REPO,
      prNumber: input.platformPr.number,
      supplemental,
    });
  } catch (error) {
    return { ok: false, phase: 'integration_head_readiness', error: error.message };
  }
  if (
    review.decision.route !== refreshProof.readiness.route ||
    review.decision.reviewed_pr.head_sha !== input.platformPr.headRefOid
  ) {
    return { ok: false, phase: 'integration_head_readiness', decision: review.decision };
  }
  const boundRefresh = validateIntegrationRefreshProof(refreshProof, {
    compatibility,
    controllerHead: input.platformPr.headRefOid,
    lessonMergeSha: input.lessonMergeCommitSha,
    platformBranch: input.platformPr.headRefName,
    readinessDecision: review.decision,
  });
  if (!boundRefresh.ok) {
    return { ok: false, phase: 'integration_refresh_readiness_binding', failures: boundRefresh.failures };
  }
  let apply;
  try {
    apply = options.dryRun
      ? { ok: true, dry_run: true, comment_action: 'would_apply_comment', transition_action: 'none' }
      : (options.applyLiveDecision || applyLiveDecision)(review.decision, { dryRun: false });
  } catch (error) {
    return { ok: false, phase: 'integration_head_readiness_publication', error: error.message };
  }
  if (!apply || apply.ok !== true) {
    return { ok: false, phase: 'integration_head_readiness_publication', apply };
  }
  return {
    ok: true,
    phase: 'integration_head_readiness',
    source: seed.source,
    decision: review.decision,
    decision_digest: `sha256:${decisionDigest(review.decision)}`,
    markdown: review.markdown,
    apply: options.dryRun
      ? { ...apply, comment_action: 'would_create_exact_head_readiness' }
      : apply,
    integration_refresh: refreshProof,
  };
}


function validatePrState(pr, expectedHeadSha, options = {}) {
  const failures = [];
  if (!pr) failures.push('pr_missing');
  if (pr && pr.state !== 'OPEN') failures.push('pr_not_open');
  if (pr && pr.isDraft === true) failures.push('pr_is_draft');
  if (pr && pr.baseRefName !== 'main') failures.push('pr_base_must_be_main');
  if (pr && pr.headRefOid !== expectedHeadSha) failures.push('pr_head_mismatch');
  if (pr && (pr.mergeable === false || pr.mergeStateStatus === 'DIRTY')) failures.push('merge_conflict');
  if (options.requireValidatePlatform === true) {
    const validatePlatform = parseChecks(pr.statusCheckRollup).find((check) => check.name === 'validate-platform');
    if (!validatePlatform || !successStatus(validatePlatform.conclusion)) {
      failures.push('validate_platform_missing_or_not_successful');
    }
  }
  return failures;
}

function validateReadiness(readiness) {
  if (!readiness || readiness.ok !== true) return ['exact_head_readiness_missing_or_invalid'];
  if (!READY_READINESS_ROUTES.has(readiness.route)) return ['exact_head_readiness_not_ready'];
  return [];
}

function validatePublishedReadiness(readiness, expectedDecision) {
  const failures = [...validateReadiness(readiness)];
  const decision = readiness && readiness.decision;
  if (!decision || typeof decision !== 'object') failures.push('exact_head_readiness_decision_missing');
  if (decision && expectedDecision) {
    if (decision.route !== expectedDecision.route) failures.push('exact_head_readiness_route_mismatch');
    if (
      !decision.reviewed_pr ||
      !expectedDecision.reviewed_pr ||
      decision.reviewed_pr.repo !== expectedDecision.reviewed_pr.repo ||
      Number(decision.reviewed_pr.number) !== Number(expectedDecision.reviewed_pr.number) ||
      decision.reviewed_pr.head_sha !== expectedDecision.reviewed_pr.head_sha
    ) {
      failures.push('exact_head_readiness_target_mismatch');
    }
    try {
      if (decisionDigest(decision) !== decisionDigest(expectedDecision)) {
        failures.push('exact_head_readiness_decision_digest_mismatch');
      }
    } catch (_error) {
      failures.push('exact_head_readiness_decision_invalid');
    }
  }
  return { ok: failures.length === 0, failures: [...new Set(failures)], readiness };
}

function validateReviewThreadState(reviewThreads) {
  if (!reviewThreads || reviewThreads.available !== true) return ['review_threads_unavailable'];
  if (Number(reviewThreads.unresolved_count || 0) > 0) return ['unresolved_review_threads'];
  if (Number(reviewThreads.requested_changes_count || 0) > 0) return ['requested_changes_unresolved'];
  return [];
}

function validateMemberPreflight(repo, pr, member, deps, options = {}) {
  const expectedHeadSha = member.integration_head_sha || member.head_sha || member.reviewed_payload_head_sha;
  const stateFailures = deps.validatePrState(pr, expectedHeadSha, options);
  const lineageFailures = member.authorization_inherited === true
    ? []
    : ['member_payload_not_ancestor'];
  const readinessRequired = options.requireReadiness !== false;
  const readiness = readinessRequired
    ? options.readiness || deps.fetchReadinessComment(repo, pr.number, expectedHeadSha)
    : null;
  const reviewThreads = deps.fetchReviewThreadState(repo, pr.number);
  return {
    ok:
      stateFailures.length === 0 &&
      lineageFailures.length === 0 &&
      (!readinessRequired || validateReadiness(readiness).length === 0) &&
      validateReviewThreadState(reviewThreads).length === 0,
    failures: [
      ...stateFailures,
      ...lineageFailures,
      ...(readinessRequired ? validateReadiness(readiness) : []),
      ...validateReviewThreadState(reviewThreads),
    ],
    lineage: member.lineage || null,
    readiness,
    reviewThreads,
  };
}

function validateMergedMemberResume(repo, pr, member, deps, options = {}) {
  const expectedHeadSha = options.expectedHeadSha ||
    member.integration_head_sha ||
    member.head_sha ||
    member.reviewed_payload_head_sha;
  const mergeCommit = pr && pr.mergeCommit && pr.mergeCommit.oid;
  const currentMainSha = options.currentMainSha || deps.fetchMainSha(repo);
  const failures = [];
  if (options.allowPartialResume !== true) failures.push('partial_resume_not_allowed');
  if (repo !== LESSON_REPO) failures.push('partial_resume_only_lesson_member');
  if (!pr || pr.state !== 'MERGED') failures.push('partial_resume_member_not_merged');
  if (pr && pr.headRefOid !== expectedHeadSha) failures.push('partial_resume_head_mismatch');
  if (!mergeCommit) failures.push('partial_resume_merge_commit_missing');
  if (mergeCommit && currentMainSha !== mergeCommit) failures.push('partial_resume_merge_commit_not_current_main');
  const compare = expectedHeadSha && mergeCommit
    ? deps.fetchCompareStatus(repo, expectedHeadSha, mergeCommit)
    : null;
  if (compare && !['ahead', 'identical'].includes(compare.status)) {
    failures.push('partial_resume_head_not_ancestor_of_merge_commit');
  }
  const readiness = pr
    ? deps.fetchReadinessComment(repo, pr.number, expectedHeadSha)
    : null;
  const reviewThreads = pr
    ? deps.fetchReviewThreadState(repo, pr.number)
    : null;
  failures.push(...validateReadiness(readiness));
  failures.push(...validateReviewThreadState(reviewThreads));
  return {
    ok: failures.length === 0,
    failures,
    expected_head_sha: expectedHeadSha,
    merge_commit: mergeCommit || null,
    current_main_sha: currentMainSha,
    compare,
    readiness,
    reviewThreads,
  };
}

function validatePartialResumeCompatibility(compatibility, platformMainSha, platformMember, lessonMember) {
  const exact = compatibility && compatibility.exact_members || {};
  const failures = [];
  if (platformMainSha !== exact.platform_base_sha) failures.push('partial_resume_platform_main_advanced');
  if (platformMember.reviewed_payload_head_sha !== exact.platform_candidate_sha) {
    failures.push('partial_resume_platform_candidate_mismatch');
  }
  if (
    platformMember.authorization_inherited !== true ||
    (platformMember.failures || []).length > 0
  ) {
    failures.push('partial_resume_platform_lineage_invalid');
  }
  if (
    lessonMember.reviewed_payload_head_sha !== exact.lesson_candidate_sha ||
    lessonMember.integration_head_sha !== exact.lesson_candidate_sha
  ) {
    failures.push('partial_resume_lesson_candidate_mismatch');
  }
  return {
    ok: failures.length === 0,
    failures,
    exact_members: exact,
  };
}

function waitForIntermediatePlatformCi(deps, coordinates, options = {}) {
  return acquirePlatformMainCi(deps, coordinates, options);
}

function memberByRepo(record, repo) {
  if (record.controller && record.controller.repository === repo) return record.controller;
  return (record.members || []).find((member) => member.repository === repo) || null;
}

function defaultDeps(options = {}) {
  return {
    fetchAuthorization: (repo, commentId, fetchOptions) => fetchBundleAuthorizationComment(repo, commentId, fetchOptions),
    fetchComparePaths,
    fetchCompareStatus,
    findMainWorkflowRun,
    fetchInterveningCommits,
    fetchMainSha,
    fetchPr,
    fetchAutoMergeState,
    fetchCombinedCommitStatus,
    fetchBranchProtectionSummary: (repo = PLATFORM_REPO, fetchOptions = {}) =>
      fetchBranchProtectionSummary(repo, fetchOptions),
    fetchPlatformBranchProtectionSummary: () => fetchBranchProtectionSummary(PLATFORM_REPO, {}),
    fetchRepositoryMergeSettings,
    fetchReadinessComment,
    fetchReviewThreadState,
    latestWorkflowRunDatabaseId,
    preflightCrossRepoPermissions,
    validatePrState,
    recomputeCompatibility: (record, exactMembers = null) => {
      if (!options.compatibilityProofPath) throw new Error('--compatibility-proof is required');
      const compatibility = validateCompatibilityProof(readJson(options.compatibilityProofPath), {
        bundleId: options.bundleId || (record && record.bundle_id) || undefined,
        exactMembers: exactMembers || {},
      });
      const expectedExactMembers = exactMembers || compatibility.exact_members || {};
      const verifier = options.verifyCompatibilityWorkflowRun || verifyCompatibilityWorkflowRun;
      const provenance = verifier(options.compatibilityRunId, compatibility, {
        bundleId: options.bundleId || (record && record.bundle_id) || undefined,
        exactMembers: expectedExactMembers,
        compatibilityProofPath: options.compatibilityProofPath,
      }, options);
      return {
        ...compatibility,
        provenance_check: provenance,
        ok: compatibility.ok && provenance.ok,
        failures: [...compatibility.failures, ...((provenance && provenance.failures) || [])],
      };
    },
    mergePr,
    scheduleAutoMergePr,
    disableAutoMergePr,
    fetchMergedPr,
    setCommitStatus,
    summarizeLineage,
    triggerPlatformCi,
    updateBranch,
    validatePlatformCiRange,
    waitForPlatformMainCi,
    waitForPrMerge,
    refreshPlatformPrCi,
    refreshBundleAgentIndexes: (refreshOptions) => refreshBundleAgentIndexes({
      ...refreshOptions,
      trustedRoot: path.resolve(__dirname, '..', '..'),
      fetchPlatformPr: () => fetchPr(PLATFORM_REPO, refreshOptions.platformPr.number),
    }),
    generateBundleIntegrationReadiness,
  };
}

function validateMergedPr(repo, prNumber, mergedPr) {
  if (mergedPr.state !== 'MERGED' || !mergedPr.mergeCommit || !mergedPr.mergeCommit.oid) {
    return { ok: false, repo, prNumber, failure: 'merge_commit_not_observable', merged_pr: mergedPr };
  }
  return { ok: true, repo, prNumber, merge_commit: mergedPr.mergeCommit.oid, merged_pr: mergedPr };
}

function createIntegrationExecutionJournal() {
  return {
    verification_subphase: null,
    merge_invocations: [],
    completed_merges: [],
  };
}

function setJournalSubphase(journal, subphase) {
  if (journal) journal.verification_subphase = subphase;
}

function recordMergeInvocation(journal, details) {
  if (!journal) return null;
  const invocation = {
    repo: details.repo,
    pr_number: details.pr_number,
    head_sha: details.head_sha,
    method: details.method,
    outcome: 'unknown',
    merge_commit: null,
  };
  journal.merge_invocations.push(invocation);
  return invocation;
}

function recordCompletedMerge(journal, invocation, completedMerge) {
  if (invocation) {
    invocation.outcome = 'observed_merged';
    invocation.merge_commit = completedMerge.merge_commit;
  }
  journal.completed_merges.push(completedMerge);
}

function hasIrreversibleMergeState(journal) {
  return journal.merge_invocations.length > 0 || journal.completed_merges.some(
    (item) => item && item.dry_run !== true && item.merge_commit
  );
}

function postMergeFailureResult(result, journal, error = null) {
  const completedMerges = journal.completed_merges.filter(
    (item) => item && item.dry_run !== true && item.merge_commit
  );
  const unknownMergeOutcomes = journal.merge_invocations.filter(
    (item) => item && item.outcome !== 'observed_merged'
  );
  const verificationSubphase =
    (result && result.verification_subphase) ||
    (result && result.phase) ||
    journal.verification_subphase ||
    'unknown';
  return {
    ...(result || {}),
    ok: false,
    phase: 'merged_but_postmerge_verification_failed',
    verification_subphase: verificationSubphase,
    ...(error ? { error: error.message || String(error) } : {}),
    merges: [...journal.completed_merges],
    completed_merges: completedMerges,
    merge_outcome_unknown: unknownMergeOutcomes.length > 0,
    unknown_merge_outcomes: unknownMergeOutcomes,
    merge_invocations: [...journal.merge_invocations],
  };
}

function mergeStepForOrder(order, record) {
  const lesson = memberByRepo(record, LESSON_REPO);
  const platform = record.controller;
  if (order === 'lesson-first') return [lesson, platform];
  return [platform, lesson];
}

function resultMemberLabel(repo, prNumber, headSha) {
  return `${repo}#${prNumber || 'unknown'}@${headSha || 'unknown-head'}`;
}

function resultMemberState(repo, member, pr) {
  return {
    repo,
    pr_number: member && member.pr_number,
    head_sha:
      (member && (member.integration_head_sha || member.head_sha || member.reviewed_payload_head_sha)) ||
      (pr && pr.headRefOid) ||
      null,
    state: pr && pr.state,
  };
}

function compatibilityOrderProof(compatibility, order) {
  if (order) return order;
  if (compatibility && compatibility.recommended_merge_order) return compatibility.recommended_merge_order;
  const orders = compatibility && compatibility.permitted_merge_orders;
  return Array.isArray(orders) && orders.length > 0 ? orders.join(', ') : 'none';
}

function applyObservedMergeState(member, merges) {
  const merge = (merges || []).find((item) => item.repo === member.repo && item.pr_number === member.pr_number);
  if (!merge) return member;
  return {
    ...member,
    state: 'MERGED',
    merge_commit: merge.merge_commit,
  };
}

function bundleStateForResult(record, compatibility, order, platformPr, lessonPr, platformMember, lessonMemberState, merges = []) {
  const controller = resultMemberState(PLATFORM_REPO, platformMember || record.controller, platformPr);
  const lesson = resultMemberState(LESSON_REPO, lessonMemberState || memberByRepo(record, LESSON_REPO), lessonPr);
  const members = [lesson].filter((member) => member.pr_number).map((member) => applyObservedMergeState(member, merges));
  const mergedController = applyObservedMergeState(controller, merges);
  const mergedMembers = members.filter((member) => member.state === 'MERGED');
  const openMembers = members.filter((member) => member.state === 'OPEN');
  let residualMode = 'full bundle';
  if (mergedMembers.length > 0 && openMembers.length === 0 && mergedController.state !== 'MERGED') {
    residualMode = 'platform-only residual controller';
  } else if (mergedMembers.length > 0 && openMembers.length > 0) {
    residualMode = 'lesson-first pending platform';
  } else if (!compatibility || compatibility.ok !== true) {
    residualMode = 'blocked';
  }
  return {
    controller_pr_head: resultMemberLabel(controller.repo, controller.pr_number, controller.head_sha),
    member_pr_heads: members.map((member) => resultMemberLabel(member.repo, member.pr_number, member.head_sha)),
    merged_members: mergedMembers.map((member) => resultMemberLabel(member.repo, member.pr_number, member.head_sha)),
    open_members: openMembers.map((member) => resultMemberLabel(member.repo, member.pr_number, member.head_sha)),
    delegated_branch_protection_proof: 'controller',
    merge_order_proof: compatibilityOrderProof(compatibility, order),
    residual_integration_mode: residualMode,
    controller_state: mergedController.state || 'unknown',
  };
}

function integrateBundleCore(options = {}) {
  const modeFailures = [];
  if (options.prepareOnly === true && options.dryRun === true) {
    modeFailures.push('prepare_only_and_dry_run_are_mutually_exclusive');
  }
  if (options.prepareOnly === true && options.noMerge === true) {
    modeFailures.push('prepare_only_and_no_merge_are_mutually_exclusive');
  }
  if (modeFailures.length > 0) {
    return { ok: false, phase: 'integration_mode', failures: modeFailures };
  }
  const deps = { ...defaultDeps(options), ...(options.deps || {}) };
  const executionJournal = options.executionJournal || createIntegrationExecutionJournal();
  const deltaReview = options.deltaReview || readReviewJson(options.deltaReviewPath);
  const payloadLeadReview = options.payloadLeadReview || readReviewJson(options.payloadLeadReviewPath);
  const controllerRepo = options.repo || PLATFORM_REPO;
  const controllerPrNumber = Number(options.prNumber);
  if (!Number.isInteger(controllerPrNumber) || controllerPrNumber < 1) {
    throw new Error('--pr must be a positive integer');
  }
  const auth =
    options.authorization ||
    deps.fetchAuthorization(controllerRepo, options.authorizationCommentId, { expectedPr: controllerPrNumber });
  const record = auth.record || auth;
  const authorization = validateBundleAuthorizationRecord(record, {
    expectedBundleId: options.bundleId || record.bundle_id,
    expectedControllerRepo: controllerRepo,
    expectedControllerPr: controllerPrNumber,
  });
  if (!authorization.ok) return { ok: false, phase: 'authorization', authorization };
  if (options.requireCrossRepoPermissions === true) {
    const permissions = deps.preflightCrossRepoPermissions(options);
    if (!permissions.ok) return { ok: false, phase: 'cross_repo_permissions', permissions };
  }
  const lessonMember = memberByRepo(record, LESSON_REPO);
  if (!lessonMember) return { ok: false, phase: 'authorization', failures: ['lesson_member_missing'] };

  const platformMainSha = deps.fetchMainSha(PLATFORM_REPO);
  const lessonMainSha = deps.fetchMainSha(LESSON_REPO);
  const platformPr = deps.fetchPr(PLATFORM_REPO, record.controller.pr_number);
  let platformStatus = platformStatusTarget(platformPr);
  const platformBranchProtection = deps.fetchPlatformBranchProtectionSummary();
  if (!platformBranchProtection.ok) {
    return withTerminalFailureStatus(
      { ok: false, phase: 'platform_branch_protection', branch_protection: platformBranchProtection },
      deps,
      platformStatus,
      options,
      `Platform branch protection mismatch: ${(platformBranchProtection.failures || []).join(', ')}`
    );
  }
  if (platformBranchProtection.integration_authorized_required === true) {
    return withTerminalFailureStatus(
      {
        ok: false,
        phase: 'retired_activated_mode',
        branch_protection: platformBranchProtection,
        failures: ['integration-authorized required-context activation is retired; keep it optional audit evidence'],
      },
      deps,
      platformStatus,
      options,
      'integration-authorized required-context activation is retired; keep it optional audit evidence'
    );
  }
  const platformActivatedMerge = platformBranchProtection.integration_authorized_required === true;
  let platformRepositoryMergeSettings = null;
  if (platformActivatedMerge && !options.noMerge && !options.dryRun) {
    platformRepositoryMergeSettings = deps.fetchRepositoryMergeSettings(PLATFORM_REPO);
    if (platformRepositoryMergeSettings.allow_auto_merge !== true) {
      return withTerminalFailureStatus(
        {
          ok: false,
          phase: 'repo_auto_merge_disabled',
          repository_merge_settings: platformRepositoryMergeSettings,
        },
        deps,
        platformStatus,
        options,
        'Repository auto-merge is disabled for activated bundle platform merge'
      );
    }
  }
  const pendingStatus = setPlatformIntegrationStatus(
    deps,
    platformStatus.sha,
    'pending',
    'Authorized bundle integration lane running',
    platformStatus.url,
    options
  );
  if (!pendingStatus.ok) {
    return { ok: false, phase: 'integration_status', integration_status: pendingStatus };
  }
  const lessonPr = deps.fetchPr(LESSON_REPO, lessonMember.pr_number);
  const allowPartialResume = options.allowPartialResume === true;
  const partialResumeCandidate = allowPartialResume && lessonPr && lessonPr.state === 'MERGED';
  const platformMember = memberStateFromPr(PLATFORM_REPO, record.controller, platformPr, platformMainSha, deps);
  const lessonMemberState = memberStateFromPr(LESSON_REPO, lessonMember, lessonPr, lessonMainSha, deps);
  const platformPreflight = validateMemberPreflight(
    PLATFORM_REPO,
    platformPr,
    platformMember,
    deps,
    {
      requireValidatePlatform: false,
      requireReadiness: !partialResumeCandidate,
    }
  );
  const lessonPreflight = partialResumeCandidate
    ? { ok: true, failures: [], partial_resume_candidate: true }
    : validateMemberPreflight(
      LESSON_REPO,
      lessonPr,
      lessonMemberState,
      deps,
      { requireValidatePlatform: false }
    );
  const preflight = [
    ...platformPreflight.failures.map((failure) => `platform:${failure}`),
    ...lessonPreflight.failures.map((failure) => `lesson:${failure}`),
  ];
  if (preflight.length > 0) {
    return withTerminalFailureStatus({
      ok: false,
      phase: 'preflight',
      failures: preflight,
      platform_pr: platformPr,
      lesson_pr: lessonPr,
      platform_preflight: platformPreflight,
      lesson_preflight: lessonPreflight,
    }, deps, platformStatus, options, `Bundle preflight failed: ${preflight.join(', ')}`);
  }

  const compatibility = partialResumeCandidate
    ? deps.recomputeCompatibility(record, null)
    : deps.recomputeCompatibility(record, {
      platform_base_sha: platformMainSha,
      platform_candidate_sha: platformMember.integration_head_sha,
      lesson_base_sha: lessonMainSha,
      lesson_candidate_sha: lessonMemberState.integration_head_sha,
    });
  if (!compatibility.ok) {
    return withTerminalFailureStatus(
      { ok: false, phase: 'compatibility', compatibility },
      deps,
      platformStatus,
      options,
      `Bundle compatibility failed: ${(compatibility.failures || []).join(', ')}`
    );
  }
  const order = record.merge_order === 'CI_SELECTED' ? compatibility.recommended_merge_order : record.merge_order;
  if (!compatibility.permitted_merge_orders.includes(order)) {
    return withTerminalFailureStatus(
      { ok: false, phase: 'merge_order', compatibility, requested_order: order },
      deps,
      platformStatus,
      options,
      `Bundle merge order not permitted: ${order || 'missing'}`
    );
  }
  let partialResume = null;
  if (partialResumeCandidate) {
    if (order !== 'lesson-first') {
      return withTerminalFailureStatus(
        { ok: false, phase: 'partial_resume', failures: ['partial_resume_requires_lesson_first'], compatibility },
        deps,
        platformStatus,
        options,
        'Bundle partial resume requires lesson-first compatibility'
      );
    }
    const compatibilityResume = validatePartialResumeCompatibility(
      compatibility,
      platformMainSha,
      platformMember,
      lessonMemberState
    );
    const mergedResume = validateMergedMemberResume(LESSON_REPO, lessonPr, lessonMemberState, deps, {
      allowPartialResume,
      currentMainSha: lessonMainSha,
      expectedHeadSha: compatibility.exact_members && compatibility.exact_members.lesson_candidate_sha,
    });
    const failures = [...compatibilityResume.failures, ...mergedResume.failures];
    if (failures.length > 0) {
      return withTerminalFailureStatus(
        {
          ok: false,
          phase: 'partial_resume',
          failures,
          compatibility_resume: compatibilityResume,
          merged_resume: mergedResume,
        },
        deps,
        platformStatus,
        options,
        `Bundle partial resume failed: ${failures.join(', ')}`
      );
    }
    partialResume = {
      repo: LESSON_REPO,
      pr_number: lessonMember.pr_number,
      ...mergedResume,
    };
  }
  if (options.prepareOnly === true && !partialResume) {
    return withTerminalFailureStatus(
      {
        ok: false,
        phase: 'preparation_scope',
        failures: ['prepare_only_requires_validated_partial_resume'],
      },
      deps,
      platformStatus,
      options,
      'Bundle preparation-only mode requires a validated partial resume'
    );
  }
  const platformLineage = platformMember.lineage || {};
  const platformBaseDrift = platformLineage.base_drift || {};
  const dryRunDeltaReviewRequired = Boolean(
    platformLineage.requires_integration_delta_lead_review === true ||
    platformBaseDrift.requires_integration_delta_lead_review === true
  );
  if (options.dryRun && dryRunDeltaReviewRequired) {
    return {
      ok: false,
      phase: 'integration_delta_lead_review_required',
      failures: ['dry_run_cannot_validate_integration_delta_review'],
      lineage: platformLineage,
      dry_run: true,
    };
  }
  if (options.noMerge) {
    return {
      ok: true,
      phase: 'authorized_no_merge',
      order,
      compatibility,
      bundle_state: bundleStateForResult(record, compatibility, order, platformPr, lessonPr, platformMember, lessonMemberState),
      platform_main_sha: platformMainSha,
      lesson_main_sha: lessonMainSha,
      platform_branch_protection: platformBranchProtection,
    };
  }

  const runtimeRecord = {
    ...record,
    controller: platformMember,
    members: [lessonMemberState],
  };
  const steps = mergeStepForOrder(order, runtimeRecord);
  if (partialResume && (!steps[0] || steps[0].repository !== LESSON_REPO)) {
    return withTerminalFailureStatus(
      { ok: false, phase: 'partial_resume', failures: ['partial_resume_first_member_not_lesson'], compatibility },
      deps,
      platformStatus,
      options,
      'Bundle partial resume requires the first merge member to be the lesson PR'
    );
  }
  const merges = executionJournal.completed_merges;
  let platformIntegrationReadiness = null;
  let platformIntegrationRefresh = null;
  let platformIntegrationCi = null;
  let finalCiCoordinates = null;
  const expectedMain = {
    [PLATFORM_REPO]: platformMainSha,
    [LESSON_REPO]: lessonMainSha,
  };
  for (const [index, member] of steps.entries()) {
    const repo = member.repository;
    setJournalSubphase(executionJournal, index === 0 ? 'first_member_state' : 'next_member_state');
    const currentPlatformMain = deps.fetchMainSha(PLATFORM_REPO);
    const currentLessonMain = deps.fetchMainSha(LESSON_REPO);
    if (currentPlatformMain !== expectedMain[PLATFORM_REPO] || currentLessonMain !== expectedMain[LESSON_REPO]) {
      return withTerminalFailureStatus({
        ok: false,
        phase: 'base_changed_before_merge',
        failures: ['compatibility_recompute_required'],
        expected_main: { ...expectedMain },
        current_main: {
          [PLATFORM_REPO]: currentPlatformMain,
          [LESSON_REPO]: currentLessonMain,
        },
        merges,
      }, deps, platformStatus, options, 'Bundle compatibility recompute required before merge');
    }
    let pr = deps.fetchPr(repo, member.pr_number);
    if (pr.headRefOid !== member.integration_head_sha) {
      return {
        ok: true,
        phase: 'member_head_changed_retry',
        retry_required: true,
        repo,
        pr_number: member.pr_number,
        previous_head_sha: member.integration_head_sha,
        current_head_sha: pr.headRefOid,
        merges,
      };
    }
    if (partialResume && index === 0 && repo === LESSON_REPO) {
      const merged = validateMergedPr(repo, member.pr_number, pr);
      if (!merged.ok) {
        return withTerminalFailureStatus(
          { ok: false, phase: 'partial_resume_verification', merge: partialResume, merged },
          deps,
          platformStatus,
          options,
          `Bundle partial resume verification failed for ${repo}`
        );
      }
      merges.push({
        repo,
        pr_number: member.pr_number,
        merge: {
          resumed: true,
          already_merged: true,
          head_sha: member.integration_head_sha,
          merge_commit: partialResume.merge_commit,
        },
        resumed: true,
        ...merged,
      });
      expectedMain[repo] = partialResume.merge_commit;
      continue;
    }
    const currentMainForMember = repo === PLATFORM_REPO ? currentPlatformMain : currentLessonMain;
    const currentWithMain = isHeadCurrentWithMain(repo, currentMainForMember, pr.headRefOid, deps);
    if (!currentWithMain.ok) {
      const update = deps.updateBranch(repo, member.pr_number, pr.headRefOid, options);
      return {
        ok: true,
        phase: 'member_branch_updated',
        retry_required: true,
        repo,
        pr_number: member.pr_number,
        previous_head_sha: pr.headRefOid,
        main_sha: currentMainForMember,
        main_compare: currentWithMain.compare,
        update,
        compatibility,
        merges,
      };
    }
    if (repo === PLATFORM_REPO && index > 0 && steps[index - 1].repository === LESSON_REPO) {
      let indexRefresh;
      try {
        indexRefresh = deps.refreshBundleAgentIndexes({
          platformPr: pr,
          lessonMergeSha: currentLessonMain,
          reviewedPlatformPayloadSha: member.reviewed_payload_head_sha,
          dryRun: options.dryRun,
        });
      } catch (error) {
        return withTerminalFailureStatus(
          { ok: false, phase: 'platform_index_refresh', error: error.message, merges },
          deps,
          platformStatus,
          options,
          `Bundle platform index refresh failed: ${error.message}`
        );
      }
      if (!indexRefresh || indexRefresh.ok !== true) {
        return withTerminalFailureStatus(
          { ok: false, phase: 'platform_index_refresh', refresh: indexRefresh, merges },
          deps,
          platformStatus,
          options,
          'Bundle platform index refresh failed'
        );
      }
      if (!options.dryRun) {
        pr = deps.fetchPr(repo, member.pr_number);
        if (pr.headRefOid !== indexRefresh.platform_integration_head_sha) {
          return withTerminalFailureStatus(
            { ok: false, phase: 'platform_index_refresh_refetch', refresh: indexRefresh, pr, merges },
            deps,
            platformStatus,
            options,
            'Bundle platform index refresh head mismatch after push'
          );
        }
        const refreshedMember = memberStateFromPr(PLATFORM_REPO, record.controller, pr, currentPlatformMain, deps);
        if (!refreshedMember.authorization_inherited || refreshedMember.failures.length > 0) {
          return withTerminalFailureStatus(
            { ok: false, phase: 'platform_index_refresh_lineage', refresh: indexRefresh, member: refreshedMember, merges },
            deps,
            platformStatus,
            options,
            'Bundle platform index refresh lineage invalid'
          );
        }
        Object.assign(member, refreshedMember);
        platformStatus = platformStatusTarget(pr);
        const refreshedPending = setPlatformIntegrationStatus(
          deps,
          pr.headRefOid,
          'pending',
          'Authorized bundle integration validating refreshed index descendant',
          pr.url,
          options
        );
        if (!refreshedPending.ok) {
          return { ok: false, phase: 'integration_status', integration_status: refreshedPending, merges };
        }
      }
      const refreshedCi = deps.refreshPlatformPrCi(pr, {
        ...options,
        expectedLessonSha: currentLessonMain,
        y1BaseSha: currentPlatformMain,
      });
      if (!refreshedCi.ok) {
        return withTerminalFailureStatus(
          { ok: false, phase: 'platform_pr_ci_refresh', refreshed: refreshedCi, refresh: indexRefresh, merges },
          deps,
          platformStatus,
          options,
          `Bundle platform CI refresh failed: ${refreshedCi.failure || 'unknown'}`
        );
      }
      if (!options.dryRun) {
        pr = deps.fetchPr(repo, member.pr_number);
        if (pr.headRefOid !== member.integration_head_sha) {
          return withTerminalFailureStatus(
            { ok: false, phase: 'platform_head_changed_after_ci', previous_head_sha: member.integration_head_sha, pr, merges },
            deps,
            platformStatus,
            options,
            'Bundle platform head changed after refreshed CI'
          );
        }
      }
      if (options.prepareOnly === true) {
        const preparedPlatformMain = deps.fetchMainSha(PLATFORM_REPO);
        const preparedLessonMain = deps.fetchMainSha(LESSON_REPO);
        if (
          preparedPlatformMain !== expectedMain[PLATFORM_REPO] ||
          preparedLessonMain !== expectedMain[LESSON_REPO]
        ) {
          return withTerminalFailureStatus(
            {
              ok: false,
              phase: 'base_changed_before_preparation_complete',
              failures: ['compatibility_recompute_required'],
              expected_main: { ...expectedMain },
              current_main: {
                [PLATFORM_REPO]: preparedPlatformMain,
                [LESSON_REPO]: preparedLessonMain,
              },
              refresh: indexRefresh,
              exact_pair_ci: refreshedCi,
              merges,
            },
            deps,
            platformStatus,
            options,
            'Bundle compatibility recompute required before preparation completed'
          );
        }
        return {
          ok: true,
          phase: 'prepared_integration_head',
          preparation_only: true,
          order,
          compatibility,
          platform_integration_head_sha: pr.headRefOid,
          lesson_merge_commit_sha: currentLessonMain,
          refresh: indexRefresh,
          exact_pair_ci: refreshedCi,
          readiness_published: false,
          reusable_success_status_created: false,
          merges,
        };
      }
      const payloadReadiness = deps.fetchReadinessComment(
        PLATFORM_REPO,
        member.pr_number,
        member.reviewed_payload_head_sha
      );
      const integrationReadiness = deps.generateBundleIntegrationReadiness({
        authorization: record,
        authorizationCommentId: options.authorizationCommentId,
        branchProtection: platformBranchProtection,
        compatibility,
        platformPayloadSha: member.reviewed_payload_head_sha,
        platformPr: pr,
        lessonPayloadSha: lessonMemberState.reviewed_payload_head_sha,
        lessonMergeCommitSha: currentLessonMain,
        lessonPr,
        lessonReadiness: partialResume && partialResume.readiness,
        refreshResult: indexRefresh,
        lineage: member.lineage,
        deltaReview,
        payloadReadiness,
        payloadLeadReview,
        ci: {
          status: 'success',
          platform_sha: pr.headRefOid,
          lesson_sha: currentLessonMain,
          run_id: refreshedCi.run && (refreshedCi.run.databaseId || refreshedCi.run.id),
        },
      }, options);
      if (!integrationReadiness.ok) {
        return withTerminalFailureStatus(
          { ok: false, phase: 'integration_head_readiness', readiness: integrationReadiness, refresh: indexRefresh, merges },
          deps,
          platformStatus,
          options,
          'Bundle refreshed integration-head readiness failed'
        );
      }
      platformIntegrationReadiness = integrationReadiness;
      platformIntegrationRefresh = indexRefresh;
      platformIntegrationCi = refreshedCi;
      if (!options.dryRun) {
        const persistedReadiness = deps.fetchReadinessComment(
          PLATFORM_REPO,
          member.pr_number,
          pr.headRefOid
        );
        const published = validatePublishedReadiness(persistedReadiness, integrationReadiness.decision);
        if (!published.ok) {
          return withTerminalFailureStatus(
            {
              ok: false,
              phase: 'integration_head_readiness_refetch',
              failures: published.failures,
              readiness: integrationReadiness,
              persisted_readiness: persistedReadiness,
              refresh: indexRefresh,
              merges,
            },
            deps,
            platformStatus,
            options,
            'Bundle refreshed integration-head readiness could not be revalidated after publication'
          );
        }
        platformIntegrationReadiness.persisted = persistedReadiness;
        pr = deps.fetchPr(repo, member.pr_number);
      } else {
        pr = deps.fetchPr(repo, member.pr_number);
      }
    }
    const finalPlatformMain = deps.fetchMainSha(PLATFORM_REPO);
    const finalLessonMain = deps.fetchMainSha(LESSON_REPO);
    if (
      finalPlatformMain !== expectedMain[PLATFORM_REPO] ||
      finalLessonMain !== expectedMain[LESSON_REPO]
    ) {
      return withTerminalFailureStatus({
        ok: false,
        phase: 'base_changed_before_final_merge',
        failures: ['compatibility_recompute_required'],
        expected_main: { ...expectedMain },
        current_main: {
          [PLATFORM_REPO]: finalPlatformMain,
          [LESSON_REPO]: finalLessonMain,
        },
        merges,
      }, deps, platformStatus, options, 'Bundle compatibility recompute required before final member merge');
    }
    const preMerge = validateMemberPreflight(repo, pr, member, deps, {
      requireValidatePlatform: repo === PLATFORM_REPO,
      readiness: repo === PLATFORM_REPO && platformIntegrationReadiness
        ? options.dryRun
          ? {
              ok: true,
              route: platformIntegrationReadiness.decision.route,
              decision: platformIntegrationReadiness.decision,
              in_memory: true,
            }
          : platformIntegrationReadiness.persisted
        : undefined,
    });
    if (!preMerge.ok) {
      return withTerminalFailureStatus(
        { ok: false, phase: 'pre_merge', repo, failures: preMerge.failures, pr, pre_merge: preMerge, merges },
        deps,
        platformStatus,
        options,
        `Bundle pre-merge failed for ${repo}: ${preMerge.failures.join(', ')}`
      );
    }
    if (options.dryRun && repo === PLATFORM_REPO) {
      return {
        ok: true,
        phase: 'validated_dry_run',
        dry_run: true,
        order,
        compatibility,
        would_create_exact_head_readiness: Boolean(platformIntegrationReadiness),
        readiness: platformIntegrationReadiness,
        refresh: platformIntegrationRefresh,
        exact_pair_ci: platformIntegrationCi,
        pre_merge: preMerge,
        merges,
      };
    }
    const usePlatformAutoMerge = repo === PLATFORM_REPO && platformActivatedMerge;
    if (repo === PLATFORM_REPO && !usePlatformAutoMerge) {
      const successStatus = setPlatformIntegrationStatus(
        deps,
        member.integration_head_sha,
        'success',
        'Bundle payload authorization inherited; platform integration head validated',
        pr.url,
        options
      );
      if (!successStatus.ok) {
        return {
          ok: false,
          phase: 'integration_status',
          repo,
          pr_number: member.pr_number,
          integration_status: successStatus,
          merges,
        };
      }
    }
    const transitionPlatformBaseSha = deps.fetchMainSha(PLATFORM_REPO);
    const transitionAutomaticMinDatabaseId = repo === LESSON_REPO
      ? deps.latestWorkflowRunDatabaseId(PLATFORM_REPO, transitionPlatformBaseSha)
      : 0;
    let merge;
    let mergeInvocation = null;
    try {
      merge = usePlatformAutoMerge && options.dryRun
        ? { dry_run: true, auto_merge: true, repo, prNumber: member.pr_number, head_sha: member.integration_head_sha }
        : usePlatformAutoMerge
        ? deps.scheduleAutoMergePr(repo, member.pr_number, member.integration_head_sha, options)
        : deps.mergePr(repo, member.pr_number, member.integration_head_sha, options);
      if (!options.dryRun && !usePlatformAutoMerge) {
        mergeInvocation = recordMergeInvocation(executionJournal, {
          repo,
          pr_number: member.pr_number,
          head_sha: member.integration_head_sha,
          method: 'merge_pr',
        });
      }
    } catch (error) {
      return withTerminalFailureStatus(
        { ok: false, phase: usePlatformAutoMerge ? 'auto_merge_schedule' : 'merge', repo, pr_number: member.pr_number, error: error.message, merges },
        deps,
        platformStatus,
        options,
        `Bundle ${usePlatformAutoMerge ? 'auto-merge scheduling' : 'merge'} rejected for ${repo}: ${error.message}`
      );
    }
    let autoMergeState = null;
    if (usePlatformAutoMerge) {
      autoMergeState = verifyAutoMergeEnabled(repo, member.pr_number, member.integration_head_sha, deps, options);
      if (!autoMergeState.ok) {
        const diagnostics = collectAutoMergeDiagnostics(repo, member.pr_number, member.integration_head_sha, deps, {
          ...options,
          requireIntegrationAuthorized: true,
        });
        const disableAutoMerge = autoMergeState.failure === 'auto_merge_head_changed'
          ? deps.disableAutoMergePr(repo, member.pr_number, options)
          : null;
        const status = setPlatformIntegrationStatus(
          deps,
          member.integration_head_sha,
          'failure',
          `Bundle platform auto-merge not enabled: ${autoMergeState.failure || 'unknown'}`,
          pr.url,
          options
        );
        if (autoMergeState.failure === 'auto_merge_head_changed') {
          return {
            ok: true,
            phase: 'member_head_changed_retry',
            retry_required: true,
            repo,
            pr_number: member.pr_number,
            previous_head_sha: member.integration_head_sha,
            current_head_sha: autoMergeState.pr ? autoMergeState.pr.headRefOid : undefined,
            merge,
            auto_merge_state: autoMergeState,
            auto_merge_diagnostics: diagnostics,
            disable_auto_merge: disableAutoMerge,
            integration_status: status,
            merges,
          };
        }
        return {
          ok: false,
          phase: 'auto_merge_enable',
          repo,
          pr_number: member.pr_number,
          merge,
          auto_merge_state: autoMergeState,
          auto_merge_diagnostics: diagnostics,
          integration_status: status,
          merges,
        };
      }
      const successStatus = setPlatformIntegrationStatus(
        deps,
        member.integration_head_sha,
        'success',
        'Bundle payload authorization inherited; platform integration head validated',
        pr.url,
        options
      );
      if (!successStatus.ok) {
        return {
          ok: false,
          phase: 'integration_status',
          repo,
          pr_number: member.pr_number,
          integration_status: successStatus,
          merge,
          auto_merge_state: autoMergeState,
          merges,
        };
      }
    }
    if (options.dryRun) {
      merges.push({
        repo,
        pr_number: member.pr_number,
        merge,
        dry_run: true,
        merge_commit: null,
      });
      continue;
    }
    let mergedPr = null;
    if (usePlatformAutoMerge) {
      const observed = deps.waitForPrMerge(repo, member.pr_number, member.integration_head_sha, options);
      if (!observed.ok) {
        const diagnostics = collectAutoMergeDiagnostics(repo, member.pr_number, member.integration_head_sha, deps, {
          ...options,
          requireIntegrationAuthorized: true,
        });
        const disableAutoMerge = deps.disableAutoMergePr(repo, member.pr_number, options);
        const status = setPlatformIntegrationStatus(
          deps,
          member.integration_head_sha,
          'failure',
          `Bundle platform auto-merge did not complete: ${observed.failure || 'unknown'}`,
          pr.url,
          options
        );
        if (observed.failure === 'auto_merge_head_changed') {
          return {
            ok: false,
            phase: 'member_head_changed_retry',
            retry_required: true,
            repo,
            pr_number: member.pr_number,
            previous_head_sha: member.integration_head_sha,
            current_head_sha: observed.pr && observed.pr.headRefOid,
            merge,
            auto_merge_state: autoMergeState,
            auto_merge_observation: observed,
            auto_merge_diagnostics: diagnostics,
            disable_auto_merge: disableAutoMerge,
            integration_status: status,
            merges,
          };
        }
        return {
          ok: false,
          phase: observed.failure === 'auto_merge_timeout' ? 'auto_merge_timeout' : 'auto_merge_observation',
          repo,
          pr_number: member.pr_number,
          merge,
          auto_merge_state: autoMergeState,
          auto_merge_observation: observed,
          auto_merge_diagnostics: diagnostics,
          disable_auto_merge: disableAutoMerge,
          integration_status: status,
          merges,
        };
      }
      mergedPr = observed.pr;
      mergeInvocation = recordMergeInvocation(executionJournal, {
        repo,
        pr_number: member.pr_number,
        head_sha: member.integration_head_sha,
        method: 'auto_merge_observed',
      });
    } else {
      setJournalSubphase(executionJournal, 'merge_observation');
      mergedPr = deps.fetchMergedPr(repo, member.pr_number);
    }
    setJournalSubphase(executionJournal, 'merge_verification');
    const merged = validateMergedPr(repo, member.pr_number, mergedPr);
    if (!merged.ok) {
      return withTerminalFailureStatus(
        { ok: false, phase: 'merge_verification', merge, merged },
        deps,
        platformStatus,
        options,
        `Bundle merge verification failed for ${repo}`
      );
    }
    recordCompletedMerge(
      executionJournal,
      mergeInvocation,
      { repo, pr_number: member.pr_number, merge, ...merged }
    );
    setJournalSubphase(executionJournal, 'post_merge_main_state');
    expectedMain[repo] = deps.fetchMainSha(repo);
    const transitionPlatformHeadSha = deps.fetchMainSha(PLATFORM_REPO);
    const transitionLessonHeadSha = deps.fetchMainSha(LESSON_REPO);
    finalCiCoordinates = {
      y1BaseSha: repo === PLATFORM_REPO ? transitionPlatformBaseSha : transitionPlatformHeadSha,
      y1HeadSha: transitionPlatformHeadSha,
      expectedPlatformSha: transitionPlatformHeadSha,
      expectedLessonSha: transitionLessonHeadSha,
      automaticMinDatabaseId: transitionAutomaticMinDatabaseId,
    };
    if (index === 0 && !(order === 'lesson-first' && repo === LESSON_REPO)) {
      setJournalSubphase(executionJournal, 'intermediate_ci');
      const intermediateCi = waitForIntermediatePlatformCi(deps, finalCiCoordinates, options);
      if (!intermediateCi.ok) {
        return withTerminalFailureStatus(
          { ok: false, phase: 'intermediate_ci', order, intermediate_ci: intermediateCi, merges },
          deps,
          platformStatus,
          options,
          `Bundle intermediate CI failed: ${intermediateCi.failure || 'unknown'}`
        );
      }
    }
  }
  setJournalSubphase(executionJournal, 'final_state');
  const expectedFinalPlatformSha = deps.fetchMainSha(PLATFORM_REPO);
  const expectedFinalLessonSha = deps.fetchMainSha(LESSON_REPO);
  setJournalSubphase(executionJournal, 'final_ci');
  const finalCi = acquirePlatformMainCi(deps, {
    ...(finalCiCoordinates || {}),
    expectedPlatformSha: expectedFinalPlatformSha,
    expectedLessonSha: expectedFinalLessonSha,
    y1HeadSha: expectedFinalPlatformSha,
  }, options);
  if (!finalCi.ok) {
    return withTerminalFailureStatus(
      { ok: false, phase: 'final_ci', order, final_ci: finalCi, merges },
      deps,
      platformStatus,
      options,
      `Bundle final CI failed: ${finalCi.failure || 'unknown'}`
    );
  }
  return {
    ok: true,
    phase: 'merged_bundle',
    order,
    compatibility,
    bundle_state: bundleStateForResult(record, compatibility, order, platformPr, lessonPr, platformMember, lessonMemberState, merges),
    merges,
    final_ci: finalCi,
  };
}

function integrateBundle(options = {}) {
  const executionJournal = createIntegrationExecutionJournal();
  let result;
  try {
    result = integrateBundleCore({ ...options, executionJournal });
  } catch (error) {
    if (!hasIrreversibleMergeState(executionJournal)) throw error;
    return postMergeFailureResult(null, executionJournal, error);
  }
  const irreversibleStateRecorded = hasIrreversibleMergeState(executionJournal);
  if (!result || result.ok !== false || !irreversibleStateRecorded) return result;
  if (result.phase === 'merged_but_postmerge_verification_failed') return result;
  return postMergeFailureResult(result, executionJournal);
}

function runCli(argv, cli = {}) {
  const prNumber = optionValue(argv, '--pr');
  const authorizationCommentId = optionValue(argv, '--authorization-comment-id');
  if (!prNumber) fail('--pr is required');
  if (!authorizationCommentId) fail('--authorization-comment-id is required');
  let result;
  try {
    result = (cli.integrateBundle || integrateBundle)({
      repo: optionValue(argv, '--repo') || PLATFORM_REPO,
      prNumber,
      authorizationCommentId,
      bundleId: optionValue(argv, '--bundle-id'),
      compatibilityProofPath: optionValue(argv, '--compatibility-proof'),
      compatibilityRunId: optionValue(argv, '--compatibility-run-id'),
      deltaReviewPath: optionValue(argv, '--delta-review'),
      payloadLeadReviewPath: optionValue(argv, '--payload-lead-review'),
      requireCrossRepoPermissions: flag(argv, '--require-cross-repo-permissions'),
      allowPartialResume: flag(argv, '--allow-partial-resume'),
      prepareOnly: flag(argv, '--prepare-only'),
      dryRun: flag(argv, '--dry-run'),
      noMerge: flag(argv, '--no-merge'),
      timeoutSeconds: Number(optionValue(argv, '--timeout-seconds') || 1800),
      pollSeconds: Number(optionValue(argv, '--poll-seconds') || 20),
    });
  } catch (error) {
    fail(error.message);
  }
  (cli.stdout || console.log)(JSON.stringify(result, null, 2));
  if (!result.ok) (cli.exit || process.exit)(1);
  return result;
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  LESSON_REPO,
  PLATFORM_REPO,
  INTEGRATION_CONTEXT,
  acquirePlatformMainCi,
  generateBundleIntegrationReadiness,
  integrateBundle,
  runCli,
  platformCiDispatchArgs,
  preflightCrossRepoPermissions,
  refreshPlatformPrCi,
  selectLatestRunForHead,
  setPlatformIntegrationStatus,
  triggerPlatformCi,
  triggerPlatformCiForRef,
  validateCompatibilityWorkflowProvenance,
  validateBundlePayloadLeadReview,
  validateLessonLeadReadiness,
  validatePlatformCiEvidence,
  validatePublishedReadiness,
  verifyCompatibilityWorkflowRun,
  validatePrState,
};
