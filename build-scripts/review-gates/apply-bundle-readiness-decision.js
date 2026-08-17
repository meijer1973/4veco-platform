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
const { verifyTransitionPreconditions } = require('./apply-pr-readiness-decision');

const READY_ROUTES = new Set([ROUTES.READY_FOR_LEAD_ONLY, ROUTES.READY_FOR_HUMAN_REVIEW]);

function fail(message) {
  console.error(`Apply bundle readiness decision failed: ${message}`);
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

function writeJson(file, value) {
  if (!file) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function positiveInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeMember(member) {
  const item = member || {};
  return {
    ...item,
    repository: item.repository || item.repo || null,
    pr_number: positiveInteger(item.pr_number || item.number),
    head_sha: item.head_sha || item.headRefOid || null,
    reviewed_payload_head_sha: item.reviewed_payload_head_sha || item.payload_head_sha || item.head_sha || item.headRefOid || null,
  };
}

function memberKey(member) {
  const item = normalizeMember(member);
  if (!item.repository || !item.pr_number) return null;
  return `${item.repository}#${item.pr_number}`;
}

function repoUrl(repo, number) {
  return `https://github.com/${repo}/pull/${number}`;
}

function normalizeCurrentPr(repo, pr) {
  const item = pr || {};
  const rawMergeable = item.mergeable;
  const draftState = typeof item.is_draft === 'boolean'
    ? item.is_draft
    : typeof item.isDraft === 'boolean'
      ? item.isDraft
      : null;
  return {
    repo,
    number: Number(item.number),
    url: item.url || repoUrl(repo, item.number),
    state: typeof item.state === 'string' && item.state.trim() ? item.state : null,
    is_draft: draftState,
    base: item.base || item.baseRefName || null,
    head_sha: item.head_sha || item.headRefOid || null,
    mergeable: rawMergeable === true || /^MERGEABLE$/i.test(String(rawMergeable || '')),
    merge_state: item.merge_state || item.mergeStateStatus || null,
    comments: item.comments || [],
  };
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

function readOptions(options = {}) {
  return { ...options, dryRun: false };
}

function fetchCurrentPr(repo, number, options = {}) {
  const fields = [
    'number',
    'url',
    'state',
    'isDraft',
    'baseRefName',
    'headRefOid',
    'mergeable',
    'mergeStateStatus',
  ].join(',');
  const raw = runGh(['pr', 'view', String(number), '--repo', repo, '--json', fields], readOptions(options));
  return normalizeCurrentPr(repo, JSON.parse(raw));
}

function listLiveComments(repo, number, options = {}) {
  const raw = runGh(['api', `repos/${repo}/issues/${number}/comments`, '--paginate'], readOptions(options));
  return JSON.parse(raw || '[]');
}

function findExistingComment(comments, marker) {
  return (comments || []).find((comment) => String(comment.body || '').includes(marker)) || null;
}

function postOrUpdateComment(repo, number, comment, body, options = {}) {
  if (options.dryRun) {
    return { action: comment ? 'would_update_comment' : 'would_create_comment', id: comment && comment.id };
  }
  if (comment && comment.id) {
    runGh(['api', '-X', 'PATCH', `repos/${repo}/issues/comments/${comment.id}`, '-f', `body=${body}`], options);
    return { action: 'updated_comment', id: comment.id };
  }
  const raw = runGh(['api', '-X', 'POST', `repos/${repo}/issues/${number}/comments`, '-f', `body=${body}`], options);
  const created = JSON.parse(raw || '{}');
  return { action: 'created_comment', id: created.id || null };
}

function markReady(repo, number, options = {}) {
  if (options.dryRun) return { action: 'would_mark_ready' };
  runGh(['pr', 'ready', String(number), '--repo', repo], options);
  return { action: 'marked_ready' };
}

function defaultDeps() {
  return {
    fetchPr: fetchCurrentPr,
    listComments: listLiveComments,
    postOrUpdateComment,
    markReady,
  };
}

function collectBundleMembers(controllerDecision) {
  validateDecision(controllerDecision);
  const bundle = controllerDecision.proof.bundle || {};
  const controller = normalizeMember({
    repository: controllerDecision.reviewed_pr.repo,
    pr_number: controllerDecision.reviewed_pr.number,
    url: controllerDecision.reviewed_pr.url,
    base: controllerDecision.reviewed_pr.base,
    head_sha: controllerDecision.reviewed_pr.head_sha,
    reviewed_payload_head_sha: controllerDecision.reviewed_pr.head_sha,
    ...(bundle.controller || {}),
  });
  const members = [controller, ...asArray(bundle.paired_prs).map(normalizeMember)];
  const seen = new Set();
  return members.filter((member) => {
    const key = memberKey(member);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function currentPrMap(currentPrs) {
  const map = new Map();
  for (const pr of currentPrs) map.set(memberKey({ repository: pr.repo, pr_number: pr.number }), pr);
  return map;
}

function memberReviewedPr(member, current) {
  const head = member.reviewed_payload_head_sha || member.head_sha;
  return {
    repo: member.repository,
    number: member.pr_number,
    url: (current && current.url) || member.url || repoUrl(member.repository, member.pr_number),
    base: (current && current.base) || member.base || 'main',
    head_sha: head,
    was_draft: current ? current.is_draft === true : member.is_draft !== false,
  };
}

function delegatedBranchProtectionProof(controller, member) {
  return {
    delegated: true,
    controller_repository: controller.repository,
    controller_pr_number: controller.pr_number,
    member_repository: member.repository,
    member_pr_number: member.pr_number,
    note: 'lesson branch protection not required; readiness uses delegated controller proof',
  };
}

function decisionForMember(controllerDecision, member, allMembers, currentByKey) {
  const baseDecision = clone(controllerDecision);
  const current = currentByKey.get(memberKey(member));
  const reviewedPr = memberReviewedPr(member, current);
  const isController =
    reviewedPr.repo === controllerDecision.reviewed_pr.repo &&
    reviewedPr.number === controllerDecision.reviewed_pr.number;
  const bundle = clone(controllerDecision.proof.bundle || {});
  const normalizedController = normalizeMember({
    repository: controllerDecision.reviewed_pr.repo,
    pr_number: controllerDecision.reviewed_pr.number,
    head_sha: controllerDecision.reviewed_pr.head_sha,
    reviewed_payload_head_sha: controllerDecision.reviewed_pr.head_sha,
    ...(bundle.controller || {}),
  });
  const normalizedMember = normalizeMember({
    ...member,
    head_sha: reviewedPr.head_sha,
    reviewed_payload_head_sha: reviewedPr.head_sha,
  });

  if (!isController) {
    bundle.delegated = true;
    bundle.current_member = normalizedMember;
    bundle.paired_prs = allMembers
      .filter((item) => memberKey(item) !== memberKey(member))
      .map((item) => normalizeMember(item));
  }

  baseDecision.reviewed_pr = reviewedPr;
  baseDecision.proof = {
    ...baseDecision.proof,
    bundle,
    bundle_delegated_ci: !isController || baseDecision.proof.bundle_delegated_ci === true,
  };
  if (!isController) {
    baseDecision.proof.lead_reviewed_sha = normalizedMember.lead_reviewed_sha || normalizedMember.reviewed_payload_head_sha;
    baseDecision.proof.branch_protection = delegatedBranchProtectionProof(normalizedController, normalizedMember);
  }
  baseDecision.allowed_transition = reviewedPr.was_draft
    ? ALLOWED_TRANSITIONS.MARK_READY
    : ALLOWED_TRANSITIONS.NONE;
  baseDecision.reason_codes = [...new Set([...baseDecision.reason_codes, 'coordinated_bundle_mark_ready'])];
  baseDecision.proof.bundle.controller = normalizedController;
  validateDecision(baseDecision);
  return baseDecision;
}

function generateBundleMemberDecisions(controllerDecision, currentPrs = []) {
  if (!READY_ROUTES.has(controllerDecision.route)) {
    throw new Error('controller decision must be a ready route');
  }
  const members = collectBundleMembers(controllerDecision);
  if (members.length < 2) throw new Error('bundle readiness requires at least two members');
  const currentByKey = currentPrMap(currentPrs);
  return members.map((member) => decisionForMember(controllerDecision, member, members, currentByKey));
}

function verifyDecisionAgainstCurrent(decision, currentPr, options = {}) {
  verifyTransitionPreconditions(decision, currentPr);
  if (decision.allowed_transition === ALLOWED_TRANSITIONS.MARK_READY && currentPr.state !== 'OPEN') {
    throw new Error('mark_ready_pr_not_open');
  }
  if (currentPr.mergeable !== true) throw new Error('mark_ready_pr_not_mergeable');
  if (
    typeof options.expectedDraft === 'boolean' &&
    currentPr.is_draft !== options.expectedDraft
  ) {
    throw new Error(options.expectedDraft
      ? 'mark_ready_expected_draft_pr'
      : 'mark_ready_expected_newly_ready_pr');
  }
  return true;
}

function collectFailures(step, decisions, currentPrs, options = {}) {
  const failures = [];
  const byKey = currentPrMap(currentPrs);
  for (const decision of decisions) {
    const key = memberKey({ repository: decision.reviewed_pr.repo, pr_number: decision.reviewed_pr.number });
    const current = byKey.get(key);
    try {
      if (!current) throw new Error('pr_missing');
      const expectedDraft = typeof options.expectedDraft === 'function'
        ? options.expectedDraft(decision)
        : options.expectedDraft;
      verifyDecisionAgainstCurrent(decision, current, { expectedDraft });
    } catch (error) {
      failures.push(`${decision.reviewed_pr.repo}#${decision.reviewed_pr.number}:${error.message}`);
    }
  }
  return failures.map((failure) => `${step}:${failure}`);
}

function fetchMembers(deps, members, options) {
  return members.map((member) => deps.fetchPr(member.repository, member.pr_number, options));
}

function applyBundleReadiness(options = {}) {
  const deps = { ...defaultDeps(), ...(options.deps || {}) };
  const controllerDecision = options.controllerDecision;
  validateDecision(controllerDecision);
  const members = collectBundleMembers(controllerDecision);
  const initialPrs = fetchMembers(deps, members, options).map((pr, index) =>
    normalizeCurrentPr(members[index].repository, pr)
  );
  const decisions = generateBundleMemberDecisions(controllerDecision, initialPrs);
  const transitionPlanFailures = decisions
    .filter((decision) => decision.allowed_transition !== ALLOWED_TRANSITIONS.MARK_READY)
    .map((decision) => (
      `preflight:${decision.reviewed_pr.repo}#${decision.reviewed_pr.number}:mark_ready_expected_draft_pr`
    ));
  const preflightFailures = [
    ...transitionPlanFailures,
    ...collectFailures('preflight', decisions, initialPrs, { expectedDraft: true }),
  ];
  if (preflightFailures.length > 0) {
    return { ok: false, phase: 'preflight', failures: preflightFailures, merge_authority: false };
  }

  const commentResults = [];
  try {
    for (const decision of decisions) {
      const comments = deps.listComments(decision.reviewed_pr.repo, decision.reviewed_pr.number, options);
      const marker = decisionMarker(decision);
      const result = deps.postOrUpdateComment(
        decision.reviewed_pr.repo,
        decision.reviewed_pr.number,
        findExistingComment(comments, marker),
        renderDecisionMarkdown(decision),
        options
      );
      commentResults.push({ repo: decision.reviewed_pr.repo, pr_number: decision.reviewed_pr.number, ...result });
    }
  } catch (error) {
    return {
      ok: false,
      phase: 'comment',
      failures: [error.message],
      comments: commentResults,
      merge_authority: false,
    };
  }

  const beforeMutationPrs = fetchMembers(deps, members, options).map((pr, index) =>
    normalizeCurrentPr(members[index].repository, pr)
  );
  const preMutationFailures = collectFailures('pre_mutation', decisions, beforeMutationPrs, {
    expectedDraft: true,
  });
  if (preMutationFailures.length > 0) {
    return {
      ok: false,
      phase: 'pre_mutation',
      failures: preMutationFailures,
      comments: commentResults,
      merge_authority: false,
    };
  }

  const transitions = [];
  const transitioned = new Set();
  for (const decision of decisions) {
    const livePrs = fetchMembers(deps, members, options).map((pr, index) =>
      normalizeCurrentPr(members[index].repository, pr)
    );
    const sequentialPrs = options.dryRun
      ? livePrs.map((pr) => transitioned.has(memberKey({ repository: pr.repo, pr_number: pr.number }))
        ? { ...pr, is_draft: false }
        : pr)
      : livePrs;
    const beforeMemberFailures = collectFailures(
      'before_member_mutation',
      decisions,
      sequentialPrs,
      {
        expectedDraft: (candidate) => !transitioned.has(memberKey({
          repository: candidate.reviewed_pr.repo,
          pr_number: candidate.reviewed_pr.number,
        })),
      }
    );
    if (beforeMemberFailures.length > 0) {
      return {
        ok: false,
        phase: transitions.length > 0 ? 'partial_transition' : 'pre_mutation',
        failures: beforeMemberFailures,
        comments: commentResults,
        transitions,
        recovery_required: transitions.length > 0,
        merge_authority: false,
      };
    }
    const current = currentPrMap(sequentialPrs).get(memberKey({
      repository: decision.reviewed_pr.repo,
      pr_number: decision.reviewed_pr.number,
    }));
    try {
      verifyDecisionAgainstCurrent(decision, current, { expectedDraft: true });
      const transition = deps.markReady(decision.reviewed_pr.repo, decision.reviewed_pr.number, options);
      transitions.push({ repo: decision.reviewed_pr.repo, pr_number: decision.reviewed_pr.number, ...transition });
      transitioned.add(memberKey({
        repository: decision.reviewed_pr.repo,
        pr_number: decision.reviewed_pr.number,
      }));
      if (options.dryRun) continue;
      const verified = normalizeCurrentPr(
        decision.reviewed_pr.repo,
        deps.fetchPr(decision.reviewed_pr.repo, decision.reviewed_pr.number, options)
      );
      verifyDecisionAgainstCurrent(decision, verified, { expectedDraft: false });
    } catch (error) {
      return {
        ok: false,
        phase: 'partial_transition',
        failures: [`${decision.reviewed_pr.repo}#${decision.reviewed_pr.number}:${error.message}`],
        comments: commentResults,
        transitions,
        recovery_required: true,
        merge_authority: false,
      };
    }
  }

  if (!options.dryRun) {
    const verifiedPrs = fetchMembers(deps, members, options).map((pr, index) =>
      normalizeCurrentPr(members[index].repository, pr)
    );
    const verificationFailures = collectFailures('post_transition', decisions, verifiedPrs, {
      expectedDraft: false,
    });
    if (verificationFailures.length > 0) {
      return {
        ok: false,
        phase: 'post_transition',
        failures: verificationFailures,
        comments: commentResults,
        transitions,
        recovery_required: true,
        merge_authority: false,
      };
    }
  }

  return {
    ok: true,
    phase: options.dryRun ? 'dry_run' : 'ready_bundle',
    comments: commentResults,
    transitions,
    decisions,
    merge_authority: false,
  };
}

function parseArgs(argv) {
  const decisionPath = optionValue(argv, '--controller-decision') || optionValue(argv, '--decision');
  if (!decisionPath) fail('--controller-decision is required');
  return {
    controllerDecision: readJson(decisionPath),
    dryRun: flag(argv, '--dry-run'),
    output: optionValue(argv, '--output'),
  };
}

function runCli(argv) {
  const options = parseArgs(argv);
  let result;
  try {
    result = applyBundleReadiness(options);
  } catch (error) {
    fail(error.message);
  }
  writeJson(options.output, result);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) process.exit(1);
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  applyBundleReadiness,
  generateBundleMemberDecisions,
};
