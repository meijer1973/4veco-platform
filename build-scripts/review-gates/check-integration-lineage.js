#!/usr/bin/env node
const fs = require('fs');
const { spawnSync } = require('child_process');
const { isEvidenceTailPath, normalizePath } = require('./pr-readiness-governance-surfaces');

const SHA_PATTERN = /^[a-f0-9]{40}$/i;

function fail(message) {
  console.error(`Integration lineage check failed: ${message}`);
  process.exit(1);
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (!args[index + 1]) fail(`missing value for ${name}`);
  return args[index + 1];
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function uniquePaths(values) {
  return [...new Set(asArray(values).map(normalizePath).filter(Boolean))];
}

function pathSet(values) {
  return new Set(uniquePaths(values));
}

function intersection(left, right) {
  const rightSet = pathSet(right);
  return uniquePaths(left).filter((item) => rightSet.has(item));
}

function isAllowlistedEvidenceRefresh(paths) {
  const normalized = uniquePaths(paths);
  return normalized.length > 0 && normalized.every(isEvidenceTailPath);
}

function isSubstantivePath(pathValue) {
  return !isEvidenceTailPath(pathValue);
}

function classifyBaseDrift(payloadPaths, baseDeltaPaths) {
  const overlappingPaths = intersection(payloadPaths, baseDeltaPaths);
  const substantiveOverlap = overlappingPaths.filter(isSubstantivePath);
  if (overlappingPaths.length === 0) {
    return {
      classification: 'no_substantive_overlap',
      overlapping_paths: [],
      requires_deterministic_refresh: false,
      requires_integration_delta_lead_review: false,
      requires_human_reauthorization: false,
    };
  }
  if (substantiveOverlap.length === 0) {
    return {
      classification: 'allowlisted_generated_or_evidence_overlap',
      overlapping_paths: overlappingPaths,
      requires_deterministic_refresh: true,
      requires_integration_delta_lead_review: false,
      requires_human_reauthorization: false,
    };
  }
  return {
    classification: 'substantive_overlap',
    overlapping_paths: overlappingPaths,
    requires_deterministic_refresh: false,
    requires_integration_delta_lead_review: true,
    requires_human_reauthorization: false,
  };
}

function commitChangedPaths(commit) {
  return uniquePaths(commit.changed_paths || commit.files || []);
}

function classifyInterveningCommit(commit, state) {
  const parents = asArray(commit.parents);
  const changedPaths = commitChangedPaths(commit);
  const baseDeltaSet = pathSet(state.base_delta_paths);
  const changedOutsideBase = changedPaths.filter((item) => !baseDeltaSet.has(item));
  const allowedEvidence = isAllowlistedEvidenceRefresh(changedPaths);

  if (parents.length >= 2) {
    if (commit.manual_conflict_resolution === true) {
      return {
        sha: commit.sha,
        classification: 'manual_conflict_resolution',
        invalidating: true,
        changed_paths: changedPaths,
      };
    }
    if (changedOutsideBase.length > 0 && !isAllowlistedEvidenceRefresh(changedOutsideBase)) {
      return {
        sha: commit.sha,
        classification: 'merge_changed_payload_or_unexpected_paths',
        invalidating: true,
        changed_paths: changedPaths,
        unexpected_paths: changedOutsideBase,
      };
    }
    return {
      sha: commit.sha,
      classification: 'conflict_free_main_base_sync_merge',
      invalidating: false,
      changed_paths: changedPaths,
    };
  }

  if (allowedEvidence) {
    return {
      sha: commit.sha,
      classification: 'allowlisted_deterministic_evidence_refresh',
      invalidating: false,
      changed_paths: changedPaths,
    };
  }

  return {
    sha: commit.sha,
    classification: 'substantive_pr_authored_commit_after_authorization',
    invalidating: true,
    changed_paths: changedPaths,
  };
}

function summarizeLineage(input) {
  const reviewedPayloadHead = input.reviewed_payload_head_sha;
  const integrationHead = input.integration_head_sha || input.current_pr_head_sha;
  const failures = [];

  if (!SHA_PATTERN.test(String(reviewedPayloadHead || ''))) failures.push('reviewed_payload_head_sha missing or invalid');
  if (!SHA_PATTERN.test(String(integrationHead || ''))) failures.push('integration_head_sha missing or invalid');
  if (input.payload_ancestor_of_integration_head !== true) {
    failures.push('reviewed_payload_head_not_ancestor');
  }
  if (input.rebase_or_force_push_detected === true) failures.push('rebase_or_force_push_detected');
  if (input.authority_scope_changed === true) failures.push('authority_or_scope_change');
  if (input.effective_payload_changed === true) failures.push('changed_effective_payload');

  const baseDrift = classifyBaseDrift(input.payload_paths || [], input.base_delta_paths || []);
  const commitClassifications = asArray(input.intervening_commits)
    .filter((commit) => commit && commit.sha !== reviewedPayloadHead)
    .map((commit) => classifyInterveningCommit(commit, input));

  for (const commit of commitClassifications) {
    if (commit.invalidating) failures.push(commit.classification);
  }

  return {
    ok: failures.length === 0,
    reviewed_payload_head_sha: reviewedPayloadHead || null,
    integration_head_sha: integrationHead || null,
    base_sha_at_review: input.base_sha_at_review || null,
    current_main_sha: input.current_main_sha || null,
    payload_ancestor_of_integration_head: input.payload_ancestor_of_integration_head === true,
    base_drift: baseDrift,
    intervening_commits: commitClassifications,
    authorization_inherited: failures.length === 0,
    requires_integration_delta_lead_review:
      failures.length === 0 && baseDrift.requires_integration_delta_lead_review === true,
    requires_deterministic_refresh:
      failures.length === 0 && baseDrift.requires_deterministic_refresh === true,
    failures: [...new Set(failures)],
  };
}

function runGit(args, options = {}) {
  const result = spawnSync('git', args, {
    cwd: options.cwd || process.cwd(),
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`git ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return result.stdout.trim();
}

function changedPathsBetween(baseSha, headSha, cwd) {
  if (!baseSha || !headSha || baseSha === headSha) return [];
  const output = runGit(['diff', '--name-only', `${baseSha}..${headSha}`], { cwd });
  return output ? output.split(/\r?\n/).filter(Boolean) : [];
}

function commitsBetween(baseSha, headSha, cwd) {
  if (!baseSha || !headSha || baseSha === headSha) return [];
  const output = runGit(['rev-list', '--reverse', '--first-parent', '--parents', `${baseSha}..${headSha}`], { cwd });
  if (!output) return [];
  return output.split(/\r?\n/).map((line) => {
    const [sha, ...parents] = line.trim().split(/\s+/);
    return {
      sha,
      parents,
      changed_paths: changedPathsBetween(`${sha}^`, sha, cwd),
    };
  });
}

function summarizeFromGit(options) {
  const cwd = options.cwd || process.cwd();
  const payloadSha = options.payloadSha;
  const headSha = options.headSha || 'HEAD';
  const baseShaAtReview = options.baseShaAtReview;
  const currentMainSha = options.currentMainSha || 'origin/main';
  const ancestorResult = spawnSync('git', ['merge-base', '--is-ancestor', payloadSha, headSha], {
    cwd,
    encoding: 'utf8',
  });
  return summarizeLineage({
    reviewed_payload_head_sha: runGit(['rev-parse', payloadSha], { cwd }),
    integration_head_sha: runGit(['rev-parse', headSha], { cwd }),
    base_sha_at_review: baseShaAtReview ? runGit(['rev-parse', baseShaAtReview], { cwd }) : null,
    current_main_sha: currentMainSha ? runGit(['rev-parse', currentMainSha], { cwd }) : null,
    payload_ancestor_of_integration_head: ancestorResult.status === 0,
    payload_paths: baseShaAtReview ? changedPathsBetween(baseShaAtReview, payloadSha, cwd) : [],
    base_delta_paths: baseShaAtReview ? changedPathsBetween(baseShaAtReview, currentMainSha, cwd) : [],
    intervening_commits: commitsBetween(payloadSha, headSha, cwd),
  });
}

function runCli(argv) {
  const fixture = optionValue(argv, '--fixture');
  let summary;
  try {
    if (fixture) {
      summary = summarizeLineage(JSON.parse(fs.readFileSync(fixture, 'utf8')));
    } else {
      summary = summarizeFromGit({
        cwd: optionValue(argv, '--cwd') || process.cwd(),
        payloadSha: optionValue(argv, '--payload-sha'),
        headSha: optionValue(argv, '--head-sha') || 'HEAD',
        baseShaAtReview: optionValue(argv, '--base-sha-at-review'),
        currentMainSha: optionValue(argv, '--current-main-sha') || 'origin/main',
      });
    }
  } catch (error) {
    fail(error.message);
  }
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.ok) fail(summary.failures.join('; '));
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  classifyBaseDrift,
  classifyInterveningCommit,
  isAllowlistedEvidenceRefresh,
  summarizeLineage,
  summarizeFromGit,
};
