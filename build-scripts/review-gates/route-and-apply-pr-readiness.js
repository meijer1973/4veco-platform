#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { runReview } = require('./review-pr-readiness');
const {
  ALLOWED_TRANSITIONS,
} = require('./pr-readiness-router');
const {
  applyDecisionToState,
  applyLiveDecision,
} = require('./apply-pr-readiness-decision');

const DEFAULT_REPO = 'meijer1973/4veco-platform';

function fail(message) {
  console.error(`Route and apply PR readiness failed: ${message}`);
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

function writeIfRequested(file, content) {
  if (!file) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
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

function defaultApplyDecision(decision, options = {}) {
  if (options.fixturePr) {
    return applyDecisionToState(decision, normalizeFixturePr(readJson(options.fixturePr)), options);
  }
  return applyLiveDecision(decision, options);
}

function validateExpectedTransition(result, expectedTransition) {
  const allowed = new Set(Object.values(ALLOWED_TRANSITIONS));
  if (!allowed.has(expectedTransition)) {
    throw new Error(`--expect-transition must be one of ${[...allowed].join(', ')}`);
  }
  if (expectedTransition !== ALLOWED_TRANSITIONS.MARK_READY) {
    throw new Error('--expect-transition MARK_READY is required');
  }
  if (result.decision.allowed_transition !== expectedTransition) {
    throw new Error(
      `expected transition ${expectedTransition}, got ${result.decision.allowed_transition}`
    );
  }
  if (
    expectedTransition === ALLOWED_TRANSITIONS.MARK_READY &&
    !['marked_ready', 'already_ready', 'would_mark_ready'].includes(result.application.transition_action)
  ) {
    throw new Error(
      `expected MARK_READY application, got ${result.application.transition_action}`
    );
  }
}

function runRouteAndApply(options, deps = {}) {
  const reviewRunner = deps.runReview || runReview;
  const applyRunner = deps.applyDecision || defaultApplyDecision;
  const repo = options.repo || DEFAULT_REPO;
  const prNumber = Number(options.prNumber);
  if (!Number.isInteger(prNumber) || prNumber <= 0) {
    throw new Error('--pr must be a positive integer');
  }
  if (!options.evidence) {
    throw new Error('--evidence <file> is required so supplemental proof is explicit');
  }
  if (!options.expectTransition) {
    throw new Error('--expect-transition MARK_READY is required');
  }
  if (options.expectTransition !== ALLOWED_TRANSITIONS.MARK_READY) {
    throw new Error('--expect-transition MARK_READY is required');
  }

  const reviewOptions = options.fixture ? { fixture: options.fixture } : { repo, prNumber };
  reviewOptions.evidence = options.evidence;
  const review = reviewRunner(reviewOptions);
  const application = applyRunner(review.decision, {
    dryRun: Boolean(options.dryRun),
    fixturePr: options.fixturePr,
  });

  const result = {
    ok: application.ok !== false,
    repo,
    pr_number: prNumber,
    expected_transition: options.expectTransition || null,
    decision: review.decision,
    application,
    markdown: review.markdown,
  };
  validateExpectedTransition(result, options.expectTransition || null);
  return result;
}

function parseArgs(argv) {
  const prValue = optionValue(argv, '--pr');
  if (!prValue) fail('--pr is required');
  return {
    repo: optionValue(argv, '--repo') || DEFAULT_REPO,
    prNumber: Number(prValue),
    evidence: optionValue(argv, '--evidence'),
    expectTransition: optionValue(argv, '--expect-transition'),
    fixture: optionValue(argv, '--fixture'),
    fixturePr: optionValue(argv, '--fixture-pr'),
    dryRun: flag(argv, '--dry-run'),
    outputJson: optionValue(argv, '--output-json'),
    outputMarkdown: optionValue(argv, '--output-markdown') || optionValue(argv, '--output-md'),
    quiet: flag(argv, '--quiet'),
  };
}

function runCli(argv) {
  const options = parseArgs(argv);
  let result;
  try {
    result = runRouteAndApply(options);
  } catch (error) {
    fail(error.message);
  }
  const json = `${JSON.stringify(result, null, 2)}\n`;
  writeIfRequested(options.outputJson, json);
  writeIfRequested(options.outputMarkdown, result.markdown);
  if (!options.quiet) process.stdout.write(json);
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  runRouteAndApply,
};
