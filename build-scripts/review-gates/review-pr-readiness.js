#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  classifyPrReadiness,
  renderDecisionMarkdown,
  validateDecision,
} = require('./pr-readiness-router');

const DEFAULT_REPO = 'meijer1973/4veco-platform';
const DEFAULT_REQUIRED_CI_CONTEXTS = Object.freeze(['validate-platform']);

function fail(message) {
  console.error(`PR readiness review failed: ${message}`);
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

function writeIfRequested(file, content) {
  if (!file) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function runGh(args, options = {}) {
  const result = spawnSync('gh', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    if (options.optional) return null;
    fail(`gh ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return result.stdout;
}

function parseStatusChecks(statusCheckRollup) {
  return (statusCheckRollup || []).map((check) => ({
    name: check.name || check.context || check.workflowName || 'unknown',
    conclusion: check.conclusion || check.status || check.state || null,
    status: check.status || check.state || check.conclusion || null,
    details_url: check.detailsUrl || check.targetUrl || null,
  }));
}

function successStatus(value) {
  return /^(success|succeeded|passed|pass|ok)$/i.test(String(value || '').trim());
}

function uniqueStrings(values) {
  return [...new Set((values || []).map((item) => String(item || '').trim()).filter(Boolean))];
}

function checkNames(check) {
  return uniqueStrings([
    check.name,
    check.context,
    check.workflowName,
    check.workflow_name,
  ]);
}

function hasRequiredGreenChecks(checks, requiredContexts = DEFAULT_REQUIRED_CI_CONTEXTS) {
  return requiredContexts.every((context) => {
    const matching = checks.find((check) => checkNames(check).includes(context));
    return matching && successStatus(matching.conclusion || matching.status || matching.state || matching.result);
  });
}

function repoParts(repo) {
  const [owner, name] = String(repo || '').split('/');
  if (!owner || !name) fail(`repo must be owner/name, got ${repo}`);
  return { owner, name };
}

function collectReviewThreadPages(repo, prNumber, runner = runGh) {
  const { owner, name } = repoParts(repo);
  const query = `
    query($owner: String!, $name: String!, $number: Int!, $cursor: String) {
      repository(owner: $owner, name: $name) {
        pullRequest(number: $number) {
          reviewThreads(first: 100, after: $cursor) {
            nodes {
              isResolved
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    }
  `;
  const pages = [];
  let cursor = null;
  for (let page = 0; page < 50; page += 1) {
    const args = [
      'api',
      'graphql',
      '-f',
      `query=${query}`,
      '-F',
      `owner=${owner}`,
      '-F',
      `name=${name}`,
      '-F',
      `number=${prNumber}`,
    ];
    if (cursor) args.push('-F', `cursor=${cursor}`);
    const raw = runner(args, { optional: true });
    if (!raw) return null;
    const payload = JSON.parse(raw);
    const data = payload.data || payload;
    const connection =
      data.repository &&
      data.repository.pullRequest &&
      data.repository.pullRequest.reviewThreads;
    if (!connection || !connection.pageInfo) return null;
    pages.push(connection);
    if (!connection.pageInfo.hasNextPage) return pages;
    if (!connection.pageInfo.endCursor) return null;
    cursor = connection.pageInfo.endCursor;
  }
  return null;
}

function collectChangeRequestReviewPages(repo, prNumber, runner = runGh) {
  const { owner, name } = repoParts(repo);
  const query = `
    query($owner: String!, $name: String!, $number: Int!, $cursor: String) {
      repository(owner: $owner, name: $name) {
        pullRequest(number: $number) {
          reviews(first: 100, states: [CHANGES_REQUESTED], after: $cursor) {
            nodes {
              state
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    }
  `;
  const pages = [];
  let cursor = null;
  for (let page = 0; page < 50; page += 1) {
    const args = [
      'api',
      'graphql',
      '-f',
      `query=${query}`,
      '-F',
      `owner=${owner}`,
      '-F',
      `name=${name}`,
      '-F',
      `number=${prNumber}`,
    ];
    if (cursor) args.push('-F', `cursor=${cursor}`);
    const raw = runner(args, { optional: true });
    if (!raw) return null;
    const payload = JSON.parse(raw);
    const data = payload.data || payload;
    const connection =
      data.repository &&
      data.repository.pullRequest &&
      data.repository.pullRequest.reviews;
    if (!connection || !connection.pageInfo) return null;
    pages.push(connection);
    if (!connection.pageInfo.hasNextPage) return pages;
    if (!connection.pageInfo.endCursor) return null;
    cursor = connection.pageInfo.endCursor;
  }
  return null;
}

function collectReviewThreadState(repo, prNumber, runner = runGh) {
  const threadPages = collectReviewThreadPages(repo, prNumber, runner);
  const reviewPages = collectChangeRequestReviewPages(repo, prNumber, runner);
  if (!threadPages || !reviewPages) {
    return {
      available: false,
      unresolved_count: null,
      requested_changes_count: null,
    };
  }
  const threads = threadPages.flatMap((page) => page.nodes || []);
  const reviews = reviewPages.flatMap((page) => page.nodes || []);
  return {
    available: true,
    unresolved_count: threads.filter((thread) => thread && thread.isResolved === false).length,
    requested_changes_count: reviews.filter((review) => review && review.state === 'CHANGES_REQUESTED').length,
  };
}

function collectComparePaths(repo, baseSha, headSha) {
  if (!baseSha || !headSha || baseSha === headSha) return [];
  const raw = runGh(['api', `repos/${repo}/compare/${baseSha}...${headSha}`], { optional: true });
  if (!raw) return null;
  const data = JSON.parse(raw);
  return ((data && data.files) || []).map((file) => file.filename).filter(Boolean);
}

function collectLiveEvidence(repo, prNumber) {
  const fields = [
    'number',
    'url',
    'title',
    'body',
    'state',
    'isDraft',
    'baseRefName',
    'headRefOid',
    'additions',
    'deletions',
    'changedFiles',
    'files',
    'mergeStateStatus',
    'mergeable',
    'reviewDecision',
    'statusCheckRollup',
    'latestReviews',
  ].join(',');
  const view = JSON.parse(runGh(['pr', 'view', String(prNumber), '--repo', repo, '--json', fields]));
  const diffNames = runGh(['pr', 'diff', String(prNumber), '--repo', repo, '--name-only'], { optional: true });
  const changedPaths = diffNames
    ? diffNames.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    : (view.files || []).map((file) => file.path).filter(Boolean);
  const checks = parseStatusChecks(view.statusCheckRollup);
  const reviewThreads = collectReviewThreadState(repo, prNumber);

  return {
    reviewed_pr: {
      repo,
      number: view.number,
      url: view.url,
      title: view.title,
      body: view.body,
      state: view.state,
      was_draft: Boolean(view.isDraft),
      base: view.baseRefName,
      head_sha: view.headRefOid,
      merge_state: view.mergeStateStatus,
      mergeable: view.mergeable,
      additions: view.additions,
      deletions: view.deletions,
      changed_file_count: view.changedFiles,
    },
    changed_paths: changedPaths,
    throughput: {
      class: 'normal_sprint',
      authority_class: 'standard',
      level: 'L1',
    },
    human_review_payload: 'none',
    consequence: 'low',
    batching: {
      viable: false,
      target: null,
      reason: null,
    },
    proof: {
      ci: {
        head_sha: view.headRefOid,
        conclusion: hasRequiredGreenChecks(checks) ? 'success' : 'missing_or_pending',
        required_contexts: [...DEFAULT_REQUIRED_CI_CONTEXTS],
        checks,
      },
      checkers: [],
      lead_review: {},
      changed_paths_verified: changedPaths.length > 0,
      review_threads: reviewThreads,
      review_threads_unavailable: reviewThreads.available === false,
      requested_changes: view.reviewDecision === 'CHANGES_REQUESTED' || reviewThreads.requested_changes_count > 0,
      unresolved_review_threads: reviewThreads.unresolved_count > 0,
    },
  };
}

function mergeDeep(base, overlay) {
  if (!overlay || typeof overlay !== 'object') return base;
  const output = Array.isArray(base) ? [...base] : { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      output[key] &&
      typeof output[key] === 'object' &&
      !Array.isArray(output[key])
    ) {
      output[key] = mergeDeep(output[key], value);
    } else {
      output[key] = value;
    }
  }
  return output;
}

function pickObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function mergeSupplementalEvidence(remoteEvidence, supplemental = {}) {
  const output = mergeDeep({}, remoteEvidence);
  const safe = pickObject(supplemental);

  for (const key of ['throughput', 'review_autonomy', 'batching', 'bundle']) {
    if (safe[key] && typeof safe[key] === 'object' && !Array.isArray(safe[key])) {
      output[key] = mergeDeep(output[key] || {}, safe[key]);
    }
  }

  for (const key of ['human_review_payload', 'consequence', 'human_decision_required', 'owner_preapproval', 'ownerPreapproval']) {
    if (Object.prototype.hasOwnProperty.call(safe, key)) output[key] = safe[key];
  }

  const supplementalProof = pickObject(safe.proof);
  output.proof = output.proof || {};
  for (const key of [
    'checkers',
    'lead_review',
    'branch_protection',
    'human_authorization',
    'integration',
    'required_ci_contexts',
    'checkers_required',
    'ci_waiver',
  ]) {
    if (Object.prototype.hasOwnProperty.call(supplementalProof, key)) {
      output.proof[key] = supplementalProof[key];
    }
  }

  if (safe.risk_signals && typeof safe.risk_signals === 'object' && !Array.isArray(safe.risk_signals)) {
    output.risk_signals = output.risk_signals || {};
    for (const [key, value] of Object.entries(safe.risk_signals)) {
      if (value === true) output.risk_signals[key] = true;
    }
  }

  return output;
}

function completeLeadReviewTailEvidence(evidence, options = {}) {
  if (options.fixture) return evidence;
  const lead = evidence.proof && evidence.proof.lead_review;
  const reviewedSha = lead && (lead.reviewed_commit_sha || lead.reviewed_sha || lead.reviewed_remote_commit_sha);
  const headSha = evidence.reviewed_pr && evidence.reviewed_pr.head_sha;
  if (!reviewedSha || !headSha || reviewedSha === headSha) return evidence;
  const paths = collectComparePaths(evidence.reviewed_pr.repo, reviewedSha, headSha);
  evidence.proof = evidence.proof || {};
  if (paths === null) {
    evidence.proof.lead_review_compare_unavailable = true;
    return evidence;
  }
  evidence.proof.post_lead_review_changed_paths = paths;
  return evidence;
}

function runReview(options) {
  const evidence = options.fixture
    ? readJson(options.fixture)
    : collectLiveEvidence(options.repo || DEFAULT_REPO, options.prNumber);
  const supplemental = options.evidence ? readJson(options.evidence) : {};
  const mergedEvidence = completeLeadReviewTailEvidence(mergeSupplementalEvidence(evidence, supplemental), {
    fixture: Boolean(options.fixture),
  });
  const decision = classifyPrReadiness(mergedEvidence);
  validateDecision(decision);
  return {
    decision,
    markdown: renderDecisionMarkdown(decision),
  };
}

function parseArgs(argv) {
  const fixture = optionValue(argv, '--fixture');
  const repo = optionValue(argv, '--repo') || DEFAULT_REPO;
  const prValue = optionValue(argv, '--pr');
  const format = optionValue(argv, '--format') || 'json';
  if (!['json', 'markdown', 'both'].includes(format)) fail('--format must be json, markdown, or both');
  if (!fixture && !prValue) fail('live mode requires --pr');
  return {
    fixture,
    repo,
    prNumber: prValue ? Number(prValue) : null,
    evidence: optionValue(argv, '--evidence'),
    format,
    outputJson: optionValue(argv, '--output-json'),
    outputMarkdown: optionValue(argv, '--output-markdown') || optionValue(argv, '--output-md'),
    quiet: flag(argv, '--quiet'),
  };
}

function runCli(argv) {
  const options = parseArgs(argv);
  const result = runReview(options);
  const json = `${JSON.stringify(result.decision, null, 2)}\n`;
  writeIfRequested(options.outputJson, json);
  writeIfRequested(options.outputMarkdown, result.markdown);
  if (options.quiet) return;
  if (options.format === 'json') process.stdout.write(json);
  if (options.format === 'markdown') process.stdout.write(result.markdown);
  if (options.format === 'both') process.stdout.write(`${json}\n${result.markdown}`);
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  collectComparePaths,
  collectReviewThreadState,
  collectLiveEvidence,
  mergeDeep,
  mergeSupplementalEvidence,
  runReview,
};
