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
    fail(`gh ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return result.stdout;
}

function fetchCurrentPr(repo, number) {
  const fields = ['number', 'url', 'state', 'isDraft', 'baseRefName', 'headRefOid'].join(',');
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

function findExistingComment(comments, marker) {
  return (comments || []).find((comment) => String(comment.body || '').includes(marker)) || null;
}

function listLiveComments(repo, number) {
  const raw = runGh(['api', `repos/${repo}/issues/${number}/comments`, '--paginate']);
  return JSON.parse(raw || '[]');
}

function postOrUpdateLiveComment(repo, number, comment, body) {
  if (comment && comment.id) {
    runGh(['api', '-X', 'PATCH', `repos/${repo}/issues/comments/${comment.id}`, '-f', `body=${body}`]);
    return { action: 'updated_comment', id: comment.id };
  }
  const raw = runGh(['api', '-X', 'POST', `repos/${repo}/issues/${number}/comments`, '-f', `body=${body}`]);
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
  const comments = listLiveComments(repo, number);
  const commentResult = options.dryRun
    ? { action: findExistingComment(comments, marker) ? 'would_update_comment' : 'would_create_comment' }
    : postOrUpdateLiveComment(repo, number, findExistingComment(comments, marker), body);

  let transitionAction = 'none';
  if (decision.allowed_transition === ALLOWED_TRANSITIONS.MARK_READY) {
    if (currentPr.is_draft) {
      const finalPr = options.dryRun ? currentPr : fetchCurrentPr(repo, number);
      verifyTransitionPreconditions(decision, finalPr);
      if (!options.dryRun) runGh(['pr', 'ready', String(number), '--repo', repo]);
      transitionAction = options.dryRun ? 'would_mark_ready' : 'marked_ready';
    } else {
      transitionAction = 'already_ready';
    }
  }

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
  const result = runApply(options);
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
  runApply,
  verifyTransitionPreconditions,
};
