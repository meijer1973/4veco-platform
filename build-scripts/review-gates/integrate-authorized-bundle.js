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
const { validateCompatibilityProof } = require('./cross-repo-bundle-compatibility');
const {
  INTEGRATION_CONTEXT,
  readinessCommentFromComments,
  setCommitStatus,
} = require('./integrate-authorized-pr');
const { summarizeLineage } = require('./check-integration-lineage');
const { collectReviewThreadState } = require('./review-pr-readiness');
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
  return (runs || [])
    .filter((run) => run.headSha === headSha && Number(run.databaseId || 0) > minDatabaseId)
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
    'databaseId,status,conclusion,headSha,url',
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
    'databaseId,status,conclusion,headSha,url',
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

function triggerPlatformCi(options = {}) {
  if (options.dryRun) return { dry_run: true };
  const raw = runGh(['workflow', 'run', 'platform-ci.yml', '--repo', PLATFORM_REPO, '--ref', 'main']);
  return { triggered: true, output: raw };
}

function triggerPlatformCiForRef(ref, options = {}) {
  if (options.dryRun) return { dry_run: true, ref };
  const raw = runGh(['workflow', 'run', 'platform-ci.yml', '--repo', PLATFORM_REPO, '--ref', ref]);
  return { triggered: true, ref, output: raw };
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
  if (options.dryRun) return { ok: true, dry_run: true };
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
  if (options.dryRun) return { ok: true, dry_run: true };
  if (!artifact || !artifact.id) return { ok: false, failure: 'compatibility_artifact_id_missing' };
  const zip = runGhBuffer(['api', `repos/${PLATFORM_REPO}/actions/artifacts/${artifact.id}/zip`], options);
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
  if (options.dryRun) return { ok: true, dry_run: true };
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
  if (options.dryRun) return { ok: true, dry_run: true, run_id: String(runId) };
  const run = JSON.parse(runGh(['api', `repos/${PLATFORM_REPO}/actions/runs/${runId}`]));
  const artifact = fetchCompatibilityArtifact(runId);
  const workflow = fetchCompatibilityWorkflowInfo();
  const zip = downloadCompatibilityArtifactZip(artifact, options);
  const summary = downloadCompatibilityArtifactSummary(runId, options);
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

function refreshPlatformPrCi(pr, options = {}) {
  if (options.dryRun) return { ok: true, dry_run: true, head_sha: pr.headRefOid };
  if (!pr || !pr.headRefOid) return { ok: false, failure: 'platform_pr_head_missing' };
  const ref = pr.headRefName || pr.headRefOid;
  const minDatabaseId = latestWorkflowRunDatabaseId(PLATFORM_REPO, pr.headRefOid);
  triggerPlatformCiForRef(ref, options);
  return waitForPlatformHeadCi(pr.headRefOid, {
    ...options,
    minDatabaseId,
    expectedPlatformSha: pr.headRefOid,
  });
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
  const readiness = deps.fetchReadinessComment(repo, pr.number, expectedHeadSha);
  const reviewThreads = deps.fetchReviewThreadState(repo, pr.number);
  return {
    ok:
      stateFailures.length === 0 &&
      lineageFailures.length === 0 &&
      validateReadiness(readiness).length === 0 &&
      validateReviewThreadState(reviewThreads).length === 0,
    failures: [
      ...stateFailures,
      ...lineageFailures,
      ...validateReadiness(readiness),
      ...validateReviewThreadState(reviewThreads),
    ],
    lineage: member.lineage || null,
    readiness,
    reviewThreads,
  };
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
    fetchInterveningCommits,
    fetchMainSha,
    fetchPr,
    fetchReadinessComment,
    fetchReviewThreadState,
    latestWorkflowRunDatabaseId,
    preflightCrossRepoPermissions,
    validatePrState,
    recomputeCompatibility: (record, exactMembers = {}) => {
      if (!options.compatibilityProofPath) throw new Error('--compatibility-proof is required');
      const compatibility = validateCompatibilityProof(readJson(options.compatibilityProofPath), {
        bundleId: options.bundleId || (record && record.bundle_id) || undefined,
        exactMembers,
      });
      const verifier = options.verifyCompatibilityWorkflowRun || verifyCompatibilityWorkflowRun;
      const provenance = verifier(options.compatibilityRunId, compatibility, {
        bundleId: options.bundleId || (record && record.bundle_id) || undefined,
        exactMembers,
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
    fetchMergedPr,
    setCommitStatus,
    summarizeLineage,
    triggerPlatformCi,
    updateBranch,
    waitForPlatformMainCi,
    refreshPlatformPrCi,
  };
}

function validateMergedPr(repo, prNumber, mergedPr) {
  if (mergedPr.state !== 'MERGED' || !mergedPr.mergeCommit || !mergedPr.mergeCommit.oid) {
    return { ok: false, repo, prNumber, failure: 'merge_commit_not_observable', merged_pr: mergedPr };
  }
  return { ok: true, repo, prNumber, merge_commit: mergedPr.mergeCommit.oid, merged_pr: mergedPr };
}

function mergeStepForOrder(order, record) {
  const lesson = memberByRepo(record, LESSON_REPO);
  const platform = record.controller;
  if (order === 'lesson-first') return [lesson, platform];
  return [platform, lesson];
}

function integrateBundle(options = {}) {
  const deps = { ...defaultDeps(options), ...(options.deps || {}) };
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
  const platformStatus = platformStatusTarget(platformPr);
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
  const platformMember = memberStateFromPr(PLATFORM_REPO, record.controller, platformPr, platformMainSha, deps);
  const lessonMemberState = memberStateFromPr(LESSON_REPO, lessonMember, lessonPr, lessonMainSha, deps);
  const platformPreflight = validateMemberPreflight(
    PLATFORM_REPO,
    platformPr,
    platformMember,
    deps,
    { requireValidatePlatform: false }
  );
  const lessonPreflight = validateMemberPreflight(
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

  const compatibility = deps.recomputeCompatibility(record, {
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
  if (options.noMerge) {
    return { ok: true, phase: 'authorized_no_merge', order, compatibility, platform_main_sha: platformMainSha, lesson_main_sha: lessonMainSha };
  }

  const runtimeRecord = {
    ...record,
    controller: platformMember,
    members: [lessonMemberState],
  };
  const steps = mergeStepForOrder(order, runtimeRecord);
  const merges = [];
  const expectedMain = {
    [PLATFORM_REPO]: platformMainSha,
    [LESSON_REPO]: lessonMainSha,
  };
  for (const [index, member] of steps.entries()) {
    const repo = member.repository;
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
      const refreshed = deps.refreshPlatformPrCi(pr, {
        ...options,
        expectedLessonSha: currentLessonMain,
      });
      if (!refreshed.ok) {
        return withTerminalFailureStatus(
          { ok: false, phase: 'platform_pr_ci_refresh', refreshed, merges },
          deps,
          platformStatus,
          options,
          `Bundle platform CI refresh failed: ${refreshed.failure || 'unknown'}`
        );
      }
      pr = deps.fetchPr(repo, member.pr_number);
    }
    const preMerge = validateMemberPreflight(repo, pr, member, deps, {
      requireValidatePlatform: repo === PLATFORM_REPO,
    });
    if (!preMerge.ok) {
      return withTerminalFailureStatus(
        { ok: false, phase: 'pre_merge', repo, failures: preMerge.failures, pr, pre_merge: preMerge },
        deps,
        platformStatus,
        options,
        `Bundle pre-merge failed for ${repo}: ${preMerge.failures.join(', ')}`
      );
    }
    if (repo === PLATFORM_REPO) {
      const successStatus = setPlatformIntegrationStatus(
        deps,
        member.integration_head_sha,
        'success',
        'Bundle authorization inherited for exact platform integration head',
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
    let merge;
    try {
      merge = deps.mergePr(repo, member.pr_number, member.integration_head_sha, options);
    } catch (error) {
      return withTerminalFailureStatus(
        { ok: false, phase: 'merge', repo, pr_number: member.pr_number, error: error.message, merges },
        deps,
        platformStatus,
        options,
        `Bundle merge rejected for ${repo}: ${error.message}`
      );
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
    const merged = validateMergedPr(repo, member.pr_number, deps.fetchMergedPr(repo, member.pr_number));
    if (!merged.ok) {
      return withTerminalFailureStatus(
        { ok: false, phase: 'merge_verification', merge, merged },
        deps,
        platformStatus,
        options,
        `Bundle merge verification failed for ${repo}`
      );
    }
    merges.push({ repo, pr_number: member.pr_number, merge, ...merged });
    expectedMain[repo] = deps.fetchMainSha(repo);
    if (index === 0) {
      const expectedPlatformSha = deps.fetchMainSha(PLATFORM_REPO);
      const expectedLessonSha = deps.fetchMainSha(LESSON_REPO);
      const minDatabaseId = deps.latestWorkflowRunDatabaseId(PLATFORM_REPO, expectedPlatformSha);
      deps.triggerPlatformCi(options);
      const intermediateCi = deps.waitForPlatformMainCi(expectedPlatformSha, {
        ...options,
        minDatabaseId,
        expectedPlatformSha,
        expectedLessonSha,
      });
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
  const expectedFinalPlatformSha = deps.fetchMainSha(PLATFORM_REPO);
  const expectedFinalLessonSha = deps.fetchMainSha(LESSON_REPO);
  const minDatabaseId = deps.latestWorkflowRunDatabaseId(PLATFORM_REPO, expectedFinalPlatformSha);
  deps.triggerPlatformCi(options);
  const finalCi = deps.waitForPlatformMainCi(expectedFinalPlatformSha, {
    ...options,
    minDatabaseId,
    expectedPlatformSha: expectedFinalPlatformSha,
    expectedLessonSha: expectedFinalLessonSha,
  });
  if (!finalCi.ok) {
    return withTerminalFailureStatus(
      { ok: false, phase: 'final_ci', order, final_ci: finalCi, merges },
      deps,
      platformStatus,
      options,
      `Bundle final CI failed: ${finalCi.failure || 'unknown'}`
    );
  }
  return { ok: true, phase: 'merged_bundle', order, compatibility, merges, final_ci: finalCi };
}

function runCli(argv) {
  const prNumber = optionValue(argv, '--pr');
  const authorizationCommentId = optionValue(argv, '--authorization-comment-id');
  if (!prNumber) fail('--pr is required');
  if (!authorizationCommentId) fail('--authorization-comment-id is required');
  let result;
  try {
    result = integrateBundle({
      repo: optionValue(argv, '--repo') || PLATFORM_REPO,
      prNumber,
      authorizationCommentId,
      bundleId: optionValue(argv, '--bundle-id'),
      compatibilityProofPath: optionValue(argv, '--compatibility-proof'),
      compatibilityRunId: optionValue(argv, '--compatibility-run-id'),
      requireCrossRepoPermissions: flag(argv, '--require-cross-repo-permissions'),
      dryRun: flag(argv, '--dry-run'),
      noMerge: flag(argv, '--no-merge'),
      timeoutSeconds: Number(optionValue(argv, '--timeout-seconds') || 1800),
      pollSeconds: Number(optionValue(argv, '--poll-seconds') || 20),
    });
  } catch (error) {
    fail(error.message);
  }
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  LESSON_REPO,
  PLATFORM_REPO,
  INTEGRATION_CONTEXT,
  integrateBundle,
  preflightCrossRepoPermissions,
  selectLatestRunForHead,
  setPlatformIntegrationStatus,
  validateCompatibilityWorkflowProvenance,
  validatePlatformCiEvidence,
  validatePrState,
};
