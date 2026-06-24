#!/usr/bin/env node
const fs = require('fs');
const { spawnSync } = require('child_process');
const { issueUrlMatchesTarget } = require('./check-human-payload-authorization');

const MARKER_PREFIX = '4veco-human-bundle-authorization';
const MARKER_PATTERN = /<!--\s*4veco-human-bundle-authorization:([A-Za-z0-9._-]+)\s*-->/i;
const SHA_PATTERN = /^[a-f0-9]{40}$/i;
const VALID_DECISIONS = new Set(['APPROVE_BUNDLE_AND_MERGE']);
const VALID_MERGE_ORDERS = new Set(['CI_SELECTED', 'platform-first', 'lesson-first']);
const ALLOWED_RECORD_KEYS = new Set([
  'schema_version',
  'decision',
  'bundle_id',
  'controller',
  'members',
  'decision_scope',
  'merge_order',
  'invalidation_conditions',
]);

function fail(message) {
  console.error(`Human bundle authorization check failed: ${message}`);
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
  return `<!-- ${MARKER_PREFIX}:${record.bundle_id} -->`;
}

function jsonBlockFromComment(body) {
  const fenced = String(body || '').match(/```json\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1];
  const firstBrace = String(body || '').indexOf('{');
  const lastBrace = String(body || '').lastIndexOf('}');
  if (firstBrace === -1 || lastBrace <= firstBrace) return null;
  return String(body || '').slice(firstBrace, lastBrace + 1);
}

function markerBundleIdFromComment(body) {
  const marker = String(body || '').match(MARKER_PATTERN);
  if (!marker) throw new Error('bundle authorization marker not found');
  return marker[1];
}

function parseBundleAuthorizationComment(body) {
  const text = String(body || '');
  const markerBundleId = markerBundleIdFromComment(text);
  const json = jsonBlockFromComment(text);
  if (!json) throw new Error('machine-readable JSON bundle authorization record not found');
  const record = JSON.parse(json);
  if (record.bundle_id !== markerBundleId) throw new Error('bundle authorization marker bundle_id mismatch');
  return record;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function validRepo(value) {
  return typeof value === 'string' && /^[^/\s]+\/[^/\s]+$/.test(value);
}

function validateMember(member, label, failures) {
  const item = member || {};
  if (!validRepo(item.repository)) failures.push(`${label}.repository must be owner/name`);
  if (!Number.isInteger(item.pr_number) || item.pr_number < 1) failures.push(`${label}.pr_number must be a positive integer`);
  if (!SHA_PATTERN.test(String(item.reviewed_payload_head_sha || ''))) {
    failures.push(`${label}.reviewed_payload_head_sha must be a 40-character SHA`);
  }
}

function validateBundleAuthorizationRecord(record, options = {}) {
  const failures = [];
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    failures.push('bundle authorization record must be an object');
  }
  const item = record || {};
  for (const key of Object.keys(item)) {
    if (!ALLOWED_RECORD_KEYS.has(key)) failures.push(`unsupported bundle authorization field: ${key}`);
  }
  if (item.schema_version !== 1) failures.push('schema_version must be 1');
  if (!VALID_DECISIONS.has(String(item.decision || ''))) {
    failures.push(`decision must be one of: ${[...VALID_DECISIONS].join(', ')}`);
  }
  if (typeof item.bundle_id !== 'string' || !item.bundle_id.trim()) failures.push('bundle_id is required');
  validateMember(item.controller, 'controller', failures);
  if (!Array.isArray(item.members) || item.members.length === 0) failures.push('members must be a non-empty array');
  item.members && item.members.forEach((member, index) => validateMember(member, `members[${index}]`, failures));
  if (typeof item.decision_scope !== 'string' || !item.decision_scope.trim()) failures.push('decision_scope is required');
  if (!VALID_MERGE_ORDERS.has(String(item.merge_order || ''))) {
    failures.push(`merge_order must be one of: ${[...VALID_MERGE_ORDERS].join(', ')}`);
  }
  const invalidationConditions = asArray(item.invalidation_conditions);
  const requiredInvalidations = [
    'member_payload_not_ancestor',
    'substantive_member_change',
    'bundle_membership_change',
    'effective_product_change',
    'no_green_intermediate_order',
  ];
  for (const condition of requiredInvalidations) {
    if (!invalidationConditions.includes(condition)) {
      failures.push(`invalidation_conditions missing ${condition}`);
    }
  }
  if (options.expectedBundleId && item.bundle_id !== options.expectedBundleId) {
    failures.push(`bundle_id mismatch: expected ${options.expectedBundleId}`);
  }
  if (options.expectedControllerRepo && item.controller && item.controller.repository !== options.expectedControllerRepo) {
    failures.push(`controller.repository mismatch: expected ${options.expectedControllerRepo}`);
  }
  if (options.expectedControllerPr && item.controller && item.controller.pr_number !== Number(options.expectedControllerPr)) {
    failures.push(`controller.pr_number mismatch: expected ${options.expectedControllerPr}`);
  }
  if (options.expectedControllerHead && item.controller && item.controller.reviewed_payload_head_sha !== options.expectedControllerHead) {
    failures.push(`controller reviewed payload mismatch: expected ${options.expectedControllerHead}`);
  }
  return {
    ok: failures.length === 0,
    marker: failures.length === 0 ? markerFor(item) : null,
    record: item,
    failures,
  };
}

function validateBundleAuthorizationCommentMetadata(comment, record, options = {}) {
  const failures = [];
  const repo = options.expectedRepo || (record.controller && record.controller.repository);
  const prNumber = Number(options.expectedPr || (record.controller && record.controller.pr_number));
  const expectedCommentId = Number(options.expectedCommentId);
  const expectedAuthorLogin = options.expectedAuthorLogin || String(repo || '').split('/')[0];
  if (!Number.isInteger(expectedCommentId) || Number(comment && comment.id) !== expectedCommentId) {
    failures.push(`bundle authorization comment id mismatch: expected ${expectedCommentId}`);
  }
  if (!issueUrlMatchesTarget(comment && comment.issue_url, repo, prNumber)) {
    failures.push(`bundle authorization comment must belong to ${repo}#${prNumber}`);
  }
  const login = comment && comment.user && comment.user.login;
  if (login !== expectedAuthorLogin) failures.push(`bundle authorization comment author must be ${expectedAuthorLogin}`);
  if ((comment && comment.author_association) !== 'OWNER') {
    failures.push('bundle authorization comment author_association must be OWNER');
  }
  return {
    ok: failures.length === 0,
    failures,
    comment_id: comment && comment.id,
    issue_url: comment && comment.issue_url,
    author_login: login || null,
    author_association: (comment && comment.author_association) || null,
  };
}

function fetchBundleAuthorizationComment(repo, commentId, options = {}) {
  const raw = runGh(['api', `repos/${repo}/issues/comments/${commentId}`]);
  const comment = JSON.parse(raw);
  const record = parseBundleAuthorizationComment(comment.body);
  const metadata = validateBundleAuthorizationCommentMetadata(comment, record, {
    expectedRepo: repo,
    expectedPr: options.expectedPr,
    expectedCommentId: commentId,
    expectedAuthorLogin: options.expectedAuthorLogin,
  });
  if (!metadata.ok) throw new Error(metadata.failures.join('; '));
  return { record, metadata };
}

function runCli(argv) {
  const recordFile = optionValue(argv, '--record');
  const commentFile = optionValue(argv, '--comment-file');
  const repo = optionValue(argv, '--repo');
  const commentId = optionValue(argv, '--comment-id');
  const expectedPr = optionValue(argv, '--pr');
  const expectedBundleId = optionValue(argv, '--bundle-id');
  const expectedHead = optionValue(argv, '--controller-head');
  let record;
  try {
    if (recordFile) record = readJson(recordFile);
    else if (commentFile) record = parseBundleAuthorizationComment(fs.readFileSync(commentFile, 'utf8'));
    else if (repo && commentId) {
      record = fetchBundleAuthorizationComment(repo, commentId, {
        expectedPr: expectedPr ? Number(expectedPr) : null,
      }).record;
    } else fail('provide --record, --comment-file, or --repo with --comment-id');
  } catch (error) {
    fail(error.message);
  }
  const summary = validateBundleAuthorizationRecord(record, {
    expectedBundleId,
    expectedControllerRepo: repo || null,
    expectedControllerPr: expectedPr ? Number(expectedPr) : null,
    expectedControllerHead: expectedHead || null,
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
  fetchBundleAuthorizationComment,
  markerFor,
  markerBundleIdFromComment,
  parseBundleAuthorizationComment,
  validateBundleAuthorizationCommentMetadata,
  validateBundleAuthorizationRecord,
};
