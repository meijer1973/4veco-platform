#!/usr/bin/env node
const fs = require('fs');
const { spawnSync } = require('child_process');

/*
HOW TO ADAPT:
- This checker is read-only. It validates a GitHub branch-protection response
  against the platform policy and never mutates repository settings.
- Live mode uses `gh api repos/<repo>/branches/<branch>/protection`.
- Tests should call the pure validation functions with mocked responses.
*/

const DEFAULT_REPO = 'meijer1973/4veco-platform';
const DEFAULT_BRANCH = 'main';
const DEFAULT_REQUIRED_CONTEXT = 'validate-platform';

function fail(message) {
  console.error(`Branch protection check failed: ${message}`);
  process.exit(1);
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (!args[index + 1]) fail(`missing value for ${name}`);
  return args[index + 1];
}

function booleanValue(value) {
  if (typeof value === 'boolean') return value;
  if (value && typeof value === 'object' && typeof value.enabled === 'boolean') return value.enabled;
  return null;
}

function contextsFromProtection(protection) {
  const checks = protection.required_status_checks || {};
  if (Array.isArray(checks.contexts)) return checks.contexts;
  if (Array.isArray(checks.checks)) {
    return checks.checks.map((check) => check && (check.context || check.name)).filter(Boolean);
  }
  return [];
}

function summarizeProtection(protection, options = {}) {
  const requiredContext = options.requiredContext || DEFAULT_REQUIRED_CONTEXT;
  const strict = Boolean(protection.required_status_checks && protection.required_status_checks.strict);
  const contexts = contextsFromProtection(protection);
  const enforceAdmins = booleanValue(protection.enforce_admins);
  const allowForcePushes = booleanValue(protection.allow_force_pushes);
  const allowDeletions = booleanValue(protection.allow_deletions);

  const failures = [];
  if (strict !== true) failures.push('required_status_checks.strict must be true');
  if (!contexts.includes(requiredContext)) failures.push(`required status context missing: ${requiredContext}`);
  if (enforceAdmins !== true) failures.push('enforce_admins.enabled must be true');
  if (allowForcePushes !== false) failures.push('allow_force_pushes.enabled must be false');
  if (allowDeletions !== false) failures.push('allow_deletions.enabled must be false');

  return {
    repository: options.repo || DEFAULT_REPO,
    branch: options.branch || DEFAULT_BRANCH,
    ok: failures.length === 0,
    expected: {
      required_status_checks: {
        strict: true,
        contexts: [requiredContext],
      },
      enforce_admins: true,
      allow_force_pushes: false,
      allow_deletions: false,
    },
    observed: {
      required_status_checks: {
        strict,
        contexts,
      },
      enforce_admins: enforceAdmins,
      allow_force_pushes: allowForcePushes,
      allow_deletions: allowDeletions,
    },
    failures,
  };
}

function readFixture(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function fetchProtection(repo, branch) {
  const result = spawnSync('gh', ['api', `repos/${repo}/branches/${branch}/protection`], {
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(
      `unable to read branch protection through gh api${detail ? `: ${detail}` : ''}`
    );
  }
  return JSON.parse(result.stdout);
}

function runCli(argv) {
  const repo = optionValue(argv, '--repo') || DEFAULT_REPO;
  const branch = optionValue(argv, '--branch') || DEFAULT_BRANCH;
  const requiredContext = optionValue(argv, '--required-context') || DEFAULT_REQUIRED_CONTEXT;
  const fixture = optionValue(argv, '--fixture');

  let protection;
  try {
    protection = fixture ? readFixture(fixture) : fetchProtection(repo, branch);
  } catch (error) {
    fail(error.message);
  }

  const summary = summarizeProtection(protection, { repo, branch, requiredContext });
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.ok) fail(summary.failures.join('; '));
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  DEFAULT_REPO,
  DEFAULT_BRANCH,
  DEFAULT_REQUIRED_CONTEXT,
  contextsFromProtection,
  summarizeProtection,
};
