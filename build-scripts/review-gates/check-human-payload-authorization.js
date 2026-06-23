#!/usr/bin/env node
const fs = require('fs');
const { spawnSync } = require('child_process');

const MARKER_PREFIX = '4veco-human-payload-authorization';
const MARKER_PATTERN = /<!--\s*4veco-human-payload-authorization:([^:]+\/[^:]+):(\d+):([a-f0-9]{40})\s*-->/i;
const SHA_PATTERN = /^[a-f0-9]{40}$/i;
const VALID_DECISIONS = new Set(['APPROVE_AND_MERGE', 'APPROVE_FOR_INTEGRATION']);
const ALLOWED_RECORD_KEYS = new Set([
  'repository',
  'pr_number',
  'reviewed_payload_head_sha',
  'base_sha_at_review',
  'decision',
  'decision_scope',
  'authorization_comment_id',
  'permitted_integration_descendants',
  'invalidation_conditions',
  'supersedes_authorization_sha',
]);

function fail(message) {
  console.error(`Human payload authorization check failed: ${message}`);
  process.exit(1);
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (!args[index + 1]) fail(`missing value for ${name}`);
  return args[index + 1];
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function runGh(args, options = {}) {
  const result = spawnSync('gh', args, {
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

function markerFor(record) {
  return `<!-- ${MARKER_PREFIX}:${record.repository}:${record.pr_number}:${record.reviewed_payload_head_sha} -->`;
}

function jsonBlockFromComment(body) {
  const fenced = String(body || '').match(/```json\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1];
  const firstBrace = String(body || '').indexOf('{');
  const lastBrace = String(body || '').lastIndexOf('}');
  if (firstBrace === -1 || lastBrace <= firstBrace) return null;
  return String(body || '').slice(firstBrace, lastBrace + 1);
}

function markerFieldsFromComment(body) {
  const marker = String(body || '').match(MARKER_PATTERN);
  if (!marker) throw new Error('authorization marker not found');
  return {
    repository: marker[1],
    pr_number: Number(marker[2]),
    reviewed_payload_head_sha: marker[3],
  };
}

function parseAuthorizationComment(body) {
  const text = String(body || '');
  const marker = markerFieldsFromComment(text);
  const json = jsonBlockFromComment(text);
  if (!json) {
    throw new Error('machine-readable JSON authorization record not found');
  }
  const record = JSON.parse(json);
  if (record.repository !== marker.repository) throw new Error('authorization marker repository mismatch');
  if (record.pr_number !== marker.pr_number) throw new Error('authorization marker PR number mismatch');
  if (record.reviewed_payload_head_sha !== marker.reviewed_payload_head_sha) {
    throw new Error('authorization marker reviewed payload mismatch');
  }
  return record;
}

function issueUrlMatchesTarget(issueUrl, repo, prNumber) {
  const expectedPath = `/repos/${repo}/issues/${Number(prNumber)}`;
  const raw = String(issueUrl || '').trim();
  if (!raw) return false;
  try {
    return new URL(raw).pathname.replace(/\/+$/, '') === expectedPath;
  } catch (_error) {
    return raw.replace(/\/+$/, '') === expectedPath;
  }
}

function validateAuthorizationCommentMetadata(comment, record, options = {}) {
  const failures = [];
  const repo = options.expectedRepo || record.repository;
  const prNumber = Number(options.expectedPr || record.pr_number);
  const expectedCommentId = Number(options.expectedCommentId || record.authorization_comment_id);
  const expectedAuthorLogin = options.expectedAuthorLogin || String(repo || '').split('/')[0];
  if (Number(comment && comment.id) !== expectedCommentId) {
    failures.push(`authorization comment id mismatch: expected ${expectedCommentId}`);
  }
  if (!issueUrlMatchesTarget(comment && comment.issue_url, repo, prNumber)) {
    failures.push(`authorization comment must belong to ${repo}#${prNumber}`);
  }
  const login = comment && comment.user && comment.user.login;
  if (login !== expectedAuthorLogin) {
    failures.push(`authorization comment author must be ${expectedAuthorLogin}`);
  }
  if ((comment && comment.author_association) !== 'OWNER') {
    failures.push('authorization comment author_association must be OWNER');
  }
  return {
    ok: failures.length === 0,
    failures,
    comment_id: comment && comment.id,
    issue_url: comment && comment.issue_url,
    author_login: login || null,
    author_association: comment && comment.author_association || null,
  };
}

function fetchAuthorizationComment(repo, commentId, options = {}) {
  const raw = runGh(['api', `repos/${repo}/issues/comments/${commentId}`]);
  const comment = JSON.parse(raw);
  const record = parseAuthorizationComment(comment.body);
  const metadata = validateAuthorizationCommentMetadata(comment, record, {
    expectedRepo: repo,
    expectedPr: options.expectedPr,
    expectedCommentId: commentId,
    expectedAuthorLogin: options.expectedAuthorLogin,
  });
  if (!metadata.ok) throw new Error(metadata.failures.join('; '));
  return record;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function validateAuthorizationRecord(record, options = {}) {
  const failures = [];
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    failures.push('authorization record must be an object');
  }
  const item = record || {};
  const repository = item.repository;
  const prNumber = item.pr_number;
  const payloadSha = item.reviewed_payload_head_sha;
  const baseSha = item.base_sha_at_review;
  const commentId = item.authorization_comment_id;
  const descendants = asArray(item.permitted_integration_descendants);
  const invalidationConditions = asArray(item.invalidation_conditions);

  for (const key of Object.keys(item)) {
    if (!ALLOWED_RECORD_KEYS.has(key)) failures.push(`unsupported authorization field: ${key}`);
  }
  if (typeof repository !== 'string' || !/^[^/\s]+\/[^/\s]+$/.test(repository)) {
    failures.push('repository must be owner/name');
  }
  if (!Number.isInteger(prNumber) || prNumber < 1) failures.push('pr_number must be a positive integer');
  if (!SHA_PATTERN.test(String(payloadSha || ''))) failures.push('reviewed_payload_head_sha must be a 40-character SHA');
  if (!SHA_PATTERN.test(String(baseSha || ''))) failures.push('base_sha_at_review must be a 40-character SHA');
  if (!VALID_DECISIONS.has(String(item.decision || ''))) {
    failures.push(`decision must be one of: ${[...VALID_DECISIONS].join(', ')}`);
  }
  if (typeof item.decision_scope !== 'string' || item.decision_scope.trim().length === 0) {
    failures.push('decision_scope is required');
  }
  if (!(Number.isInteger(commentId) || /^[0-9]+$/.test(String(commentId || '')))) {
    failures.push('authorization_comment_id must be present');
  }
  if (descendants.length === 0) failures.push('permitted_integration_descendants must be non-empty');
  if (!descendants.includes('conflict_free_main_base_sync_merge')) {
    failures.push('permitted_integration_descendants must allow conflict-free main base-sync merge');
  }
  if (!descendants.includes('allowlisted_deterministic_evidence_refresh')) {
    failures.push('permitted_integration_descendants must allow deterministic evidence refresh');
  }
  for (const sha of asArray(item.supersedes_authorization_sha)) {
    if (!SHA_PATTERN.test(String(sha || ''))) failures.push('supersedes_authorization_sha entries must be SHAs');
  }
  const requiredInvalidations = [
    'reviewed_payload_not_ancestor',
    'manual_conflict_resolution',
    'substantive_pr_authored_commit_after_authorization',
    'authority_or_scope_change',
    'changed_effective_payload',
  ];
  for (const condition of requiredInvalidations) {
    if (!invalidationConditions.includes(condition)) {
      failures.push(`invalidation_conditions missing ${condition}`);
    }
  }
  if (options.expectedRepo && repository !== options.expectedRepo) {
    failures.push(`repository mismatch: expected ${options.expectedRepo}`);
  }
  if (options.expectedPr && prNumber !== Number(options.expectedPr)) {
    failures.push(`pr_number mismatch: expected ${options.expectedPr}`);
  }
  if (options.expectedPayloadSha && payloadSha !== options.expectedPayloadSha) {
    failures.push(`reviewed payload mismatch: expected ${options.expectedPayloadSha}`);
  }

  return {
    ok: failures.length === 0,
    marker: failures.length === 0 ? markerFor(item) : null,
    record: item,
    failures,
  };
}

function runCli(argv) {
  const recordFile = optionValue(argv, '--record');
  const commentFile = optionValue(argv, '--comment-file');
  const repo = optionValue(argv, '--repo');
  const commentId = optionValue(argv, '--comment-id');
  const expectedPr = optionValue(argv, '--pr');
  const expectedPayloadSha = optionValue(argv, '--payload-sha');

  let record;
  try {
    if (recordFile) record = readJson(recordFile);
    else if (commentFile) record = parseAuthorizationComment(fs.readFileSync(commentFile, 'utf8'));
    else if (repo && commentId) record = fetchAuthorizationComment(repo, commentId, {
      expectedPr: expectedPr ? Number(expectedPr) : null,
    });
    else fail('provide --record, --comment-file, or --repo with --comment-id');
  } catch (error) {
    fail(error.message);
  }

  const summary = validateAuthorizationRecord(record, {
    expectedRepo: repo || null,
    expectedPr: expectedPr ? Number(expectedPr) : null,
    expectedPayloadSha,
  });
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.ok) fail(summary.failures.join('; '));
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  MARKER_PREFIX,
  MARKER_PATTERN,
  VALID_DECISIONS,
  fetchAuthorizationComment,
  issueUrlMatchesTarget,
  markerFor,
  markerFieldsFromComment,
  parseAuthorizationComment,
  validateAuthorizationCommentMetadata,
  validateAuthorizationRecord,
};
