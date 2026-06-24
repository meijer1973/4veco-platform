#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { runReview } = require('./review-pr-readiness');
const { applyLiveDecision } = require('./apply-pr-readiness-decision');

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

function runRouteAndApply(options, deps = {}) {
  const reviewRunner = deps.runReview || runReview;
  const applyRunner = deps.applyLiveDecision || applyLiveDecision;
  const repo = options.repo || DEFAULT_REPO;
  const prNumber = Number(options.prNumber);
  if (!Number.isInteger(prNumber) || prNumber <= 0) {
    throw new Error('--pr must be a positive integer');
  }

  const reviewOptions = { repo, prNumber };
  if (options.evidence) reviewOptions.evidence = options.evidence;
  const review = reviewRunner(reviewOptions);
  const application = applyRunner(review.decision, { dryRun: Boolean(options.dryRun) });

  return {
    ok: application.ok !== false,
    repo,
    pr_number: prNumber,
    decision: review.decision,
    application,
    markdown: review.markdown,
  };
}

function parseArgs(argv) {
  const prValue = optionValue(argv, '--pr');
  if (!prValue) fail('--pr is required');
  return {
    repo: optionValue(argv, '--repo') || DEFAULT_REPO,
    prNumber: Number(prValue),
    evidence: optionValue(argv, '--evidence'),
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
