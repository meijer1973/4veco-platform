#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

/*
HOW TO ADAPT:
- New human-gate packets should include either a normal CI proof block or a
  complete CI waiver. This checker intentionally accepts a small set of labels
  instead of trying to infer proof from loose prose.
- Use --remote only when GitHub CLI access is available. It verifies the cited
  run head SHA and conclusion against GitHub Actions.
*/

function fail(message) {
  console.error(`Gate CI proof check failed: ${message}`);
  process.exit(1);
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (!args[index + 1]) fail(`missing value for ${name}`);
  return args[index + 1];
}

function normalizeKey(key) {
  return String(key).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findValueByKeys(value, keys) {
  const wanted = new Set(keys.map(normalizeKey));
  const queue = [value];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') continue;
    for (const [key, child] of Object.entries(current)) {
      if (wanted.has(normalizeKey(key))) return child;
      if (child && typeof child === 'object') queue.push(child);
    }
  }
  return undefined;
}

function firstSha(text) {
  const match = String(text).match(/\b[a-f0-9]{40}\b/i);
  return match ? match[0] : null;
}

function parseJsonProof(json) {
  const waiver = findValueByKeys(json, ['ci_waiver', 'ciWaiver']);
  if (waiver) return { type: 'waiver', waiver };

  return {
    type: 'proof',
    reviewedCommit: findValueByKeys(json, [
      'reviewed_remote_commit_sha',
      'reviewedRemoteCommitSha',
      'reviewed_commit_sha',
      'reviewedCommitSha',
    ]),
    workflow: findValueByKeys(json, ['workflow', 'ci_workflow', 'ciWorkflow']),
    context: findValueByKeys(json, ['context', 'job', 'ci_context', 'required_context']),
    runId: findValueByKeys(json, ['github_actions_run_id', 'github_run_id', 'run_id']),
    conclusion: findValueByKeys(json, ['conclusion', 'ci_conclusion']),
    corresponds:
      findValueByKeys(json, [
        'ci_run_corresponds_to_reviewed_commit',
        'run_corresponds_to_reviewed_commit',
        'ci_run_matches_reviewed_commit',
      ]) === true,
  };
}

function markdownSection(text, headingRegex) {
  const lines = text.split(/\r?\n/);
  let start = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (headingRegex.test(lines[i])) {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return null;
  const body = [];
  for (let i = start; i < lines.length; i += 1) {
    if (/^#{1,3}\s+/.test(lines[i])) break;
    body.push(lines[i]);
  }
  return body.join('\n');
}

function labelledValue(text, labels) {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = text.match(new RegExp(`${escaped}\\s*:?\\s*([^\\n]+)`, 'i'));
    if (match) return match[1].replace(/^[-*]\s*/, '').replace(/`/g, '').trim();
  }
  return null;
}

function parseMarkdownProof(text) {
  const waiverSection = markdownSection(text, /^##+\s+CI Waiver\b/i);
  if (waiverSection) {
    return {
      type: 'waiver',
      waiver: {
        owner: labelledValue(waiverSection, ['waiver owner', 'owner']),
        reason: labelledValue(waiverSection, ['reason']),
        affected_claim: labelledValue(waiverSection, ['affected claim']),
        consequence: labelledValue(waiverSection, ['consequence']),
        review_may_proceed: labelledValue(waiverSection, [
          'whether review may proceed',
          'review may proceed',
        ]),
        follow_up_required: labelledValue(waiverSection, ['follow-up required', 'follow up required']),
      },
    };
  }

  const reviewedCommit =
    firstSha(labelledValue(text, ['reviewed remote commit sha', 'reviewed commit sha']) || '') ||
    firstSha(labelledValue(text, ['reviewed remote commit', 'reviewed commit']) || '');

  const runId = labelledValue(text, [
    'github actions run id',
    'github run id',
    'run id',
  ]);
  const conclusion = labelledValue(text, ['ci conclusion', 'conclusion']);
  const workflow = labelledValue(text, ['ci workflow', 'workflow']);
  const context = labelledValue(text, ['ci context', 'required context', 'context', 'job']);
  const corresponds = /corresponds?\s+to\s+the\s+reviewed\s+(remote\s+)?commit/i.test(text) ||
    /matches\s+the\s+reviewed\s+(remote\s+)?commit/i.test(text);

  return {
    type: 'proof',
    reviewedCommit,
    workflow,
    context,
    runId,
    conclusion,
    corresponds,
    localOnlyHint: /run-sprint-command|command-log|local-only|local only/i.test(text),
  };
}

function parsePacket(file) {
  const text = fs.readFileSync(file, 'utf8');
  const trimmed = text.trim();
  if (trimmed.startsWith('{')) {
    return parseJsonProof(JSON.parse(trimmed));
  }
  return parseMarkdownProof(text);
}

function validateWaiver(waiver) {
  const required = [
    ['owner', ['owner', 'waiver_owner']],
    ['reason', ['reason']],
    ['affected claim', ['affected_claim', 'affectedClaim']],
    ['consequence', ['consequence']],
    ['whether review may proceed', ['review_may_proceed', 'reviewMayProceed']],
    ['follow-up required', ['follow_up_required', 'followUpRequired']],
  ];

  for (const [label, keys] of required) {
    const value =
      typeof waiver === 'object' && waiver !== null
        ? keys.map((key) => waiver[key]).find((candidate) => candidate !== undefined)
        : null;
    if (value === undefined || value === null || String(value).trim() === '') {
      throw new Error(`vague CI waiver: missing ${label}`);
    }
  }
  return true;
}

function validateProof(proof) {
  if (!proof.reviewedCommit || !/^[a-f0-9]{40}$/i.test(String(proof.reviewedCommit))) {
    if (proof.localOnlyHint) {
      throw new Error('unrelated local-only command log cited as CI proof; missing reviewed commit SHA');
    }
    throw new Error('missing reviewed commit SHA');
  }

  if (!proof.runId || !/^\d{6,}$/.test(String(proof.runId).trim())) {
    throw new Error('missing run ID');
  }

  const workflowContext = `${proof.workflow || ''} ${proof.context || ''}`;
  if (!/platform-ci/i.test(workflowContext) && !/validate-platform/i.test(workflowContext)) {
    throw new Error('missing platform-ci / validate-platform workflow or context');
  }

  if (!proof.conclusion || String(proof.conclusion).trim().toLowerCase() !== 'success') {
    throw new Error('CI conclusion must be success');
  }

  if (proof.corresponds !== true) {
    throw new Error('CI proof must state that the run corresponds to the reviewed commit');
  }

  return true;
}

function verifyRemote(proof, repo, allowNoGh) {
  const result = spawnSync('gh', ['api', `repos/${repo}/actions/runs/${proof.runId}`], {
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    if (allowNoGh) {
      console.warn('Remote verification skipped because gh was unavailable or unauthenticated.');
      return { skipped: true };
    }
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`remote GitHub run verification failed${detail ? `: ${detail}` : ''}`);
  }

  const run = JSON.parse(result.stdout);
  if (run.head_sha !== proof.reviewedCommit) {
    throw new Error(`remote run head SHA ${run.head_sha} does not match reviewed commit ${proof.reviewedCommit}`);
  }
  if (run.conclusion !== 'success') {
    throw new Error(`remote run conclusion must be success, got ${run.conclusion || 'null'}`);
  }
  if (run.name !== 'platform-ci') {
    throw new Error(`remote workflow must be platform-ci, got ${run.name || 'null'}`);
  }
  return { skipped: false, run };
}

function validatePacket(file, options = {}) {
  const parsed = parsePacket(file);
  if (parsed.type === 'waiver') {
    validateWaiver(parsed.waiver);
    return { mode: 'waiver' };
  }

  validateProof(parsed);
  const remote = options.remote
    ? verifyRemote(parsed, options.repo || 'meijer1973/4veco-platform', options.allowNoGh)
    : null;
  return { mode: 'ci-proof', proof: parsed, remote };
}

function runCli(argv) {
  const file = argv.find((arg) => !arg.startsWith('--'));
  if (!file) fail('usage: check-gate-ci-proof.js <gate-packet> [--remote] [--allow-no-gh] [--repo owner/name]');
  try {
    const result = validatePacket(path.resolve(file), {
      remote: argv.includes('--remote'),
      allowNoGh: argv.includes('--allow-no-gh'),
      repo: optionValue(argv, '--repo') || 'meijer1973/4veco-platform',
    });
    console.log(`OK gate CI proof: ${result.mode}`);
  } catch (error) {
    fail(error.message);
  }
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  parseJsonProof,
  parseMarkdownProof,
  validateWaiver,
  validateProof,
  validatePacket,
};
