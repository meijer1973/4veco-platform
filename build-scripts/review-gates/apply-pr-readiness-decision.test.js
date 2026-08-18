const fs = require('fs');
const path = require('path');
const { decisionMarker, renderDecisionMarkdown } = require('./pr-readiness-router');

jest.mock('child_process', () => ({
  spawnSync: jest.fn(),
}));

const { spawnSync } = require('child_process');

function readyDecision() {
  const headSha = 'a'.repeat(40);
  return {
    schema_version: 1,
    reviewed_pr: {
      repo: 'meijer1973/4veco-platform',
      number: 136,
      url: 'https://github.com/meijer1973/4veco-platform/pull/136',
      base: 'main',
      head_sha: headSha,
      was_draft: false,
    },
    throughput: {
      class: 'normal_sprint',
      authority_class: 'product_authority',
      level: 'L4',
    },
    human_review_payload: 'consequential_exception',
    consequence: 'high',
    batching: { viable: false, target: null, reason: null },
    route: 'READY_FOR_HUMAN_REVIEW',
    reason_codes: ['human_authority_consequential_exception'],
    proof: {
      ci_head_sha: headSha,
      ci_status: 'success',
      ci_required_contexts: ['validate-platform'],
      ci_missing_contexts: [],
      ci_checks: [{ name: 'validate-platform', conclusion: 'SUCCESS' }],
      lead_review_path: 'subagent:lead-review',
      lead_review_result: 'PASS',
      lead_reviewed_sha: headSha,
      lead_review_evidence_tail_allowed: false,
      lead_review_integration_authorization_inherited: false,
      post_lead_review_changed_paths: [],
      changed_paths_verified: true,
      checkers: [{ command: 'npm.cmd run check:platform', status: 'success' }],
      branch_protection: {
        required_approving_review_count: 0,
        approval_count_observable: true,
      },
      bundle: { required: false, delegated: false, ok: true, failures: [], summary: null },
      bundle_delegated_ci: false,
      human_authorization: null,
      integration: null,
    },
    allowed_transition: 'NONE',
    human_notification_required: true,
  };
}

function largeReadyDecision() {
  const decision = readyDecision();
  decision.proof.checkers = [
    {
      command: `node -e "${'x'.repeat(70000)}"`,
      status: 'success',
    },
  ];
  return decision;
}

function currentPrResponse(decision) {
  return {
    number: decision.reviewed_pr.number,
    url: decision.reviewed_pr.url,
    state: 'OPEN',
    isDraft: false,
    baseRefName: 'main',
    headRefOid: decision.reviewed_pr.head_sha,
    mergeable: 'MERGEABLE',
  };
}

function expectJsonTransport(args, expectedBody) {
  expect(args).not.toContain('-f');
  expect(args.some((arg) => String(arg).startsWith('body='))).toBe(false);
  expect(args).not.toContain(expectedBody);
  expect(args.every((arg) => String(arg).length < 4096)).toBe(true);
  const inputIndex = args.indexOf('--input');
  expect(inputIndex).toBeGreaterThan(-1);
  const inputPath = args[inputIndex + 1];
  const payload = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  expect(payload.body).toBe(expectedBody);
  return { inputPath, payload };
}

describe('apply-pr-readiness-decision live comment transport', () => {
  beforeEach(() => {
    spawnSync.mockReset();
  });

  test('posts large readiness comment through JSON input file and cleans up on success', () => {
    const decision = largeReadyDecision();
    const renderedBody = renderDecisionMarkdown(decision);
    const inputPaths = [];
    const apiBodies = [];

    expect(renderedBody.length).toBeGreaterThan(70000);

    spawnSync.mockImplementation((command, args) => {
      expect(command).toBe('gh');
      const joined = args.join(' ');
      if (joined.startsWith('pr view 136')) {
        return { status: 0, stdout: JSON.stringify(currentPrResponse(decision)), stderr: '' };
      }
      if (joined === 'api repos/meijer1973/4veco-platform/issues/136/comments --paginate') {
        return { status: 0, stdout: '[]', stderr: '' };
      }
      if (joined.startsWith('api -X POST repos/meijer1973/4veco-platform/issues/136/comments')) {
        const { inputPath, payload } = expectJsonTransport(args, renderedBody);
        inputPaths.push(inputPath);
        apiBodies.push(payload.body);
        return { status: 0, stdout: JSON.stringify({ id: 99 }), stderr: '' };
      }
      throw new Error(`unexpected gh call: ${joined}`);
    });

    const { applyLiveDecision } = require('./apply-pr-readiness-decision');
    const result = applyLiveDecision(decision, { dryRun: false });

    expect(result.comment_action).toBe('created_comment');
    expect(result.transition_action).toBe('none');
    expect(apiBodies).toEqual([renderedBody]);
    expect(inputPaths).toHaveLength(1);
    expect(fs.existsSync(inputPaths[0])).toBe(false);
    expect(fs.existsSync(path.dirname(inputPaths[0]))).toBe(false);
  });

  test('updates existing readiness comment through exact JSON input payload', () => {
    const decision = largeReadyDecision();
    const renderedBody = renderDecisionMarkdown(decision);
    const marker = decisionMarker(decision);
    const inputPaths = [];
    const apiBodies = [];

    expect(renderedBody.length).toBeGreaterThan(70000);

    spawnSync.mockImplementation((command, args) => {
      expect(command).toBe('gh');
      const joined = args.join(' ');
      if (joined.startsWith('pr view 136')) {
        return { status: 0, stdout: JSON.stringify(currentPrResponse(decision)), stderr: '' };
      }
      if (joined === 'api repos/meijer1973/4veco-platform/issues/136/comments --paginate') {
        return { status: 0, stdout: JSON.stringify([{ id: 44, body: `existing\n${marker}` }]), stderr: '' };
      }
      if (joined.startsWith('api -X PATCH repos/meijer1973/4veco-platform/issues/comments/44')) {
        const { inputPath, payload } = expectJsonTransport(args, renderedBody);
        inputPaths.push(inputPath);
        apiBodies.push(payload.body);
        return { status: 0, stdout: '{}', stderr: '' };
      }
      throw new Error(`unexpected gh call: ${joined}`);
    });

    const { applyLiveDecision } = require('./apply-pr-readiness-decision');
    const result = applyLiveDecision(decision, { dryRun: false });

    expect(result.comment_action).toBe('updated_comment');
    expect(apiBodies).toEqual([renderedBody]);
    expect(inputPaths).toHaveLength(1);
    expect(fs.existsSync(inputPaths[0])).toBe(false);
    expect(fs.existsSync(path.dirname(inputPaths[0]))).toBe(false);
  });

  test('removes JSON input file after gh api failure', () => {
    const decision = largeReadyDecision();
    const renderedBody = renderDecisionMarkdown(decision);
    let inputPath = null;

    expect(renderedBody.length).toBeGreaterThan(70000);

    spawnSync.mockImplementation((command, args) => {
      expect(command).toBe('gh');
      const joined = args.join(' ');
      if (joined.startsWith('pr view 136')) {
        return { status: 0, stdout: JSON.stringify(currentPrResponse(decision)), stderr: '' };
      }
      if (joined === 'api repos/meijer1973/4veco-platform/issues/136/comments --paginate') {
        return { status: 0, stdout: '[]', stderr: '' };
      }
      if (joined.startsWith('api -X POST repos/meijer1973/4veco-platform/issues/136/comments')) {
        const transport = expectJsonTransport(args, renderedBody);
        inputPath = transport.inputPath;
        expect(transport.payload.body).toBe(renderedBody);
        return { status: 1, stdout: '', stderr: 'permission denied' };
      }
      throw new Error(`unexpected gh call: ${joined}`);
    });

    const { applyLiveDecision } = require('./apply-pr-readiness-decision');
    expect(() => applyLiveDecision(decision, { dryRun: false })).toThrow(/permission denied/);
    expect(inputPath).toBeTruthy();
    expect(fs.existsSync(inputPath)).toBe(false);
    expect(fs.existsSync(path.dirname(inputPath))).toBe(false);
  });
});
