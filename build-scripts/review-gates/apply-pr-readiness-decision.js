#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  ALLOWED_TRANSITIONS,
  ROUTES,
  decisionMarker,
  renderDecisionMarkdown,
  validateDecision,
} = require('./pr-readiness-router');
const { runGhWithJsonInput } = require('./gh-json-input');

const SHA_PATTERN = /^[a-f0-9]{40}$/i;

function fail(message) {
  console.error(`Apply PR readiness decision failed: ${message}`);
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
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
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
    throw new Error(`gh ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return result.stdout;
}

function normalizeMergeable(value) {
  if (value === true) return true;
  if (value === false) return false;
  if (/^MERGEABLE$/i.test(String(value || ''))) return true;
  if (/^(CONFLICTING|DIRTY|UNKNOWN)$/i.test(String(value || ''))) return false;
  return null;
}

function fetchCurrentPr(repo, number) {
  const fields = ['number', 'url', 'state', 'isDraft', 'baseRefName', 'headRefOid', 'mergeable'].join(',');
  const raw = runGh(['pr', 'view', String(number), '--repo', repo, '--json', fields]);
  const pr = JSON.parse(raw);
  return {
    repo,
    number: pr.number,
    url: pr.url,
    state: pr.state,
    is_draft: Boolean(pr.isDraft),
    base: pr.baseRefName,
    head_sha: pr.headRefOid,
    mergeable: normalizeMergeable(pr.mergeable),
  };
}

function normalizeFixturePr(fixture) {
  return {
    repo: fixture.repo,
    number: fixture.number,
    url: fixture.url,
    state: fixture.state || 'OPEN',
    is_draft: fixture.is_draft !== false && fixture.isDraft !== false,
    base: fixture.base || fixture.baseRefName || null,
    head_sha: fixture.head_sha || fixture.headRefOid,
    mergeable: Object.prototype.hasOwnProperty.call(fixture, 'mergeable')
      ? normalizeMergeable(fixture.mergeable)
      : null,
    comments: fixture.comments || [],
  };
}

function verifyTransitionPreconditions(decision, currentPr) {
  validateDecision(decision);
  const failures = [];
  if (currentPr.repo !== decision.reviewed_pr.repo) failures.push('repository_mismatch');
  if (currentPr.number !== decision.reviewed_pr.number) failures.push('pr_number_mismatch');
  if (currentPr.base !== decision.reviewed_pr.base) failures.push('base_branch_changed');
  if (currentPr.head_sha !== decision.reviewed_pr.head_sha) failures.push('head_sha_changed');
  if (currentPr.state !== 'OPEN') failures.push('pr_not_open');
  if (
    decision.allowed_transition === ALLOWED_TRANSITIONS.MARK_READY &&
    ![ROUTES.READY_FOR_LEAD_ONLY, ROUTES.READY_FOR_HUMAN_REVIEW].includes(decision.route)
  ) {
    failures.push('transition_not_allowed_for_route');
  }
  if (decision.route === ROUTES.READY_FOR_HUMAN_REVIEW && ['L0', 'L1', 'L2'].includes(decision.throughput.level)) {
    failures.push('human_route_requires_human_level_or_exception');
  }
  if (decision.route === ROUTES.READY_FOR_HUMAN_REVIEW && decision.auto_merge === true) {
    failures.push('human_route_must_not_auto_merge');
  }
  if (failures.length > 0) {
    const error = new Error(`precondition failure: ${failures.join(', ')}`);
    error.failures = failures;
    throw error;
  }
  return true;
}

function positiveInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

function normalizeExpectedPairedMember(member) {
  const item = member || {};
  return {
    repo: item.repository || item.repo || null,
    number: positiveInteger(item.pr_number || item.number),
    base: item.base || item.baseRefName || item.base_branch || null,
    head_sha: item.head_sha || item.headRefOid || null,
    open: item.open,
    current: item.current,
    ready: item.ready,
    is_draft: item.is_draft === undefined ? item.isDraft : item.is_draft,
    mergeable: normalizeMergeable(item.mergeable),
  };
}

function collectExpectedPairedMembers(decision) {
  if (!decision || decision.allowed_transition !== ALLOWED_TRANSITIONS.MARK_READY) return [];
  const bundle = decision.proof && decision.proof.bundle;
  if (!bundle) return [];
  const byKey = new Map();
  for (const rawMember of [...(bundle.paired_prs || []), ...(bundle.transitionable_draft_members || [])]) {
    const member = normalizeExpectedPairedMember(rawMember);
    if (!member.repo || !member.number) continue;
    const key = `${member.repo}#${member.number}`;
    byKey.set(key, {
      ...(byKey.get(key) || {}),
      ...Object.fromEntries(Object.entries(member).filter(([, value]) => value !== undefined && value !== null)),
    });
  }
  return [...byKey.values()];
}

function normalizeFetchedPr(pr, fallbackRepo, fallbackNumber) {
  const item = pr || {};
  return {
    repo: item.repo || item.repository || fallbackRepo || null,
    number: positiveInteger(item.number || item.pr_number) || fallbackNumber || null,
    state: item.state || (item.open === true ? 'OPEN' : item.open === false ? 'CLOSED' : null),
    is_draft: item.is_draft === undefined ? Boolean(item.isDraft) : Boolean(item.is_draft),
    base: item.base || item.baseRefName || item.base_branch || null,
    head_sha: item.head_sha || item.headRefOid || null,
    mergeable: normalizeMergeable(item.mergeable),
  };
}

function verifyPairedTransitionPreconditions(decision, fetchPairedPr) {
  validateDecision(decision);
  const expectedMembers = collectExpectedPairedMembers(decision);
  if (decision.allowed_transition !== ALLOWED_TRANSITIONS.MARK_READY || expectedMembers.length === 0) return true;
  if (typeof fetchPairedPr !== 'function') {
    throw new Error('precondition failure: paired_pr_fetcher_missing');
  }

  const failures = [];
  for (const expected of expectedMembers) {
    const label = `${expected.repo || 'missing-repo'}#${expected.number || 'missing-pr'}`;
    if (!expected.repo || !expected.number) failures.push(`${label}:paired_pr_identity_missing`);
    if (!expected.base) failures.push(`${label}:paired_pr_base_missing`);
    if (!SHA_PATTERN.test(String(expected.head_sha || ''))) failures.push(`${label}:paired_pr_head_missing`);
    if (expected.open !== true) failures.push(`${label}:paired_pr_expected_open_not_true`);
    if (expected.current !== true) failures.push(`${label}:paired_pr_expected_current_not_true`);
    if (expected.mergeable !== true) failures.push(`${label}:paired_pr_expected_mergeable_not_true`);
    if (typeof expected.is_draft !== 'boolean') failures.push(`${label}:paired_pr_expected_draft_missing`);
    if (typeof expected.ready !== 'boolean') failures.push(`${label}:paired_pr_expected_ready_missing`);
    if (!expected.repo || !expected.number) continue;

    const live = normalizeFetchedPr(fetchPairedPr(expected.repo, expected.number), expected.repo, expected.number);
    if (live.repo !== expected.repo) failures.push(`${label}:paired_pr_repository_mismatch`);
    if (live.number !== expected.number) failures.push(`${label}:paired_pr_number_mismatch`);
    if (live.base !== expected.base) failures.push(`${label}:paired_pr_base_changed`);
    if (live.head_sha !== expected.head_sha) failures.push(`${label}:paired_pr_head_sha_changed`);
    if (live.state !== 'OPEN') failures.push(`${label}:paired_pr_not_open`);
    if (live.is_draft !== expected.is_draft) failures.push(`${label}:paired_pr_draft_state_changed`);
    if ((live.is_draft === false) !== expected.ready) failures.push(`${label}:paired_pr_ready_state_changed`);
    if (live.mergeable !== true) failures.push(`${label}:paired_pr_not_mergeable`);
  }

  if (failures.length > 0) {
    const error = new Error(`precondition failure: ${failures.join(', ')}`);
    error.failures = failures;
    throw error;
  }
  return true;
}

function findExistingComment(comments, marker) {
  return (comments || []).find((comment) => String(comment.body || '').includes(marker)) || null;
}

function listLiveComments(repo, number) {
  const raw = runGh(['api', `repos/${repo}/issues/${number}/comments`, '--paginate']);
  return JSON.parse(raw || '[]');
}

function postOrUpdateLiveComment(repo, number, comment, body) {
  if (comment && comment.id) {
    runGhWithJsonInput(runGh, ['api', '-X', 'PATCH', `repos/${repo}/issues/comments/${comment.id}`], { body });
    return { action: 'updated_comment', id: comment.id };
  }
  const raw = runGhWithJsonInput(runGh, ['api', '-X', 'POST', `repos/${repo}/issues/${number}/comments`], { body });
  const created = JSON.parse(raw || '{}');
  return { action: 'created_comment', id: created.id || null };
}

function applyDecisionToState(decision, currentPr, options = {}) {
  verifyTransitionPreconditions(decision, currentPr);
  const marker = decisionMarker(decision);
  const body = renderDecisionMarkdown(decision);
  const existing = findExistingComment(currentPr.comments || [], marker);
  const result = {
    ok: true,
    dry_run: Boolean(options.dryRun),
    route: decision.route,
    allowed_transition: decision.allowed_transition,
    marker,
    comment_action: existing ? 'would_update_comment' : 'would_create_comment',
    transition_action: 'none',
  };

  if (decision.allowed_transition === ALLOWED_TRANSITIONS.MARK_READY) {
    if (currentPr.is_draft) {
      const finalPr = options.finalPr || currentPr;
      verifyTransitionPreconditions(decision, finalPr);
      if (options.fetchPairedPr) verifyPairedTransitionPreconditions(decision, options.fetchPairedPr);
      result.transition_action = options.dryRun ? 'would_mark_ready' : 'marked_ready';
      currentPr.is_draft = false;
    } else {
      result.transition_action = 'already_ready';
    }
  }

  if (existing) {
    existing.body = body;
  } else {
    currentPr.comments = currentPr.comments || [];
    currentPr.comments.push({ id: `fixture-${currentPr.comments.length + 1}`, body });
  }

  return result;
}

function applyLiveDecision(decision, options) {
  const repo = decision.reviewed_pr.repo;
  const number = decision.reviewed_pr.number;
  const currentPr = fetchCurrentPr(repo, number);
  verifyTransitionPreconditions(decision, currentPr);
  const marker = decisionMarker(decision);
  const body = renderDecisionMarkdown(decision);

  let transitionAction = 'none';
  if (decision.allowed_transition === ALLOWED_TRANSITIONS.MARK_READY) {
    if (currentPr.is_draft) {
      const finalPr = options.dryRun ? currentPr : fetchCurrentPr(repo, number);
      verifyTransitionPreconditions(decision, finalPr);
      verifyPairedTransitionPreconditions(decision, (pairedRepo, pairedNumber) => fetchCurrentPr(pairedRepo, pairedNumber));
      transitionAction = options.dryRun ? 'would_mark_ready' : 'marked_ready';
      if (!options.dryRun) runGh(['pr', 'ready', String(number), '--repo', repo]);
    } else {
      transitionAction = 'already_ready';
    }
  }

  const comments = listLiveComments(repo, number);
  const commentResult = options.dryRun
    ? { action: findExistingComment(comments, marker) ? 'would_update_comment' : 'would_create_comment' }
    : postOrUpdateLiveComment(repo, number, findExistingComment(comments, marker), body);

  return {
    ok: true,
    dry_run: Boolean(options.dryRun),
    route: decision.route,
    allowed_transition: decision.allowed_transition,
    marker,
    comment_action: commentResult.action,
    transition_action: transitionAction,
  };
}

function runApply(options) {
  const decision = readJson(options.decisionPath);
  validateDecision(decision);
  if (options.fixturePr) {
    return applyDecisionToState(decision, normalizeFixturePr(readJson(options.fixturePr)), options);
  }
  return applyLiveDecision(decision, options);
}

function parseArgs(argv) {
  const decisionPath = optionValue(argv, '--decision');
  if (!decisionPath) fail('--decision is required');
  return {
    decisionPath,
    fixturePr: optionValue(argv, '--fixture-pr'),
    dryRun: flag(argv, '--dry-run'),
    output: optionValue(argv, '--output'),
  };
}

function runCli(argv) {
  const options = parseArgs(argv);
  let result;
  try {
    result = runApply(options);
  } catch (error) {
    fail(error.message);
  }
  const json = `${JSON.stringify(result, null, 2)}\n`;
  if (options.output) {
    fs.mkdirSync(path.dirname(options.output), { recursive: true });
    fs.writeFileSync(options.output, json);
  }
  process.stdout.write(json);
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  applyDecisionToState,
  applyLiveDecision,
  collectExpectedPairedMembers,
  runApply,
  verifyPairedTransitionPreconditions,
  verifyTransitionPreconditions,
};
