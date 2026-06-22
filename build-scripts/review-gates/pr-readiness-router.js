const ROUTES = Object.freeze({
  KEEP_DRAFT_REVISE: 'KEEP_DRAFT_REVISE',
  KEEP_DRAFT_BATCH: 'KEEP_DRAFT_BATCH',
  READY_FOR_LEAD_ONLY: 'READY_FOR_LEAD_ONLY',
  READY_FOR_HUMAN_REVIEW: 'READY_FOR_HUMAN_REVIEW',
  PAUSE_ESCALATE: 'PAUSE_ESCALATE',
});

const ALLOWED_TRANSITIONS = Object.freeze({
  NONE: 'NONE',
  MARK_READY: 'MARK_READY',
});

const REVIEW_LEVELS = ['L0', 'L1', 'L2', 'L3', 'L4'];
const LEVEL_WEIGHT = Object.freeze({ L0: 0, L1: 1, L2: 2, L3: 3, L4: 4 });
const AUTONOMOUS_LEVELS = new Set(['L0', 'L1', 'L2']);
const PASSING_LEAD_RESULTS = new Set(['PASS', 'PASS WITH FLAGS']);
const HUMAN_PAYLOADS = new Set(['none', 'thin', 'substantial', 'consequential_exception']);
const SHA_PATTERN = /^[a-f0-9]{40}$/i;

const GOVERNANCE_PATH_PATTERNS = [
  /^agents\/pr-readiness-reviewer-agent\.md$/i,
  /^build-scripts\/review-gates\/pr-readiness-router(?:\.test)?\.js$/i,
  /^build-scripts\/review-gates\/review-pr-readiness\.js$/i,
  /^build-scripts\/review-gates\/apply-pr-readiness-decision\.js$/i,
  /^docs\/review\/pr-readiness-/i,
  /^docs\/review\/pr-throughput-policy\.md$/i,
  /^\.github\/workflows\//i,
];

const PROTECTED_REFERENCE_PATTERNS = [
  /^references\/authored\//i,
  /^references\/owned\//i,
  /^references\/schemas\//i,
  /^references\/data\/inspection-standards\//i,
];

const MACHINE_EXTERNAL_REFERENCE_PATTERNS = [
  /^references\/machine\//i,
  /^references\/external\//i,
];

function normalizePath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\.\.\/4veco-platform\//, '');
}

function uniqueStrings(values) {
  return [...new Set((values || []).map((item) => String(item || '').trim()).filter(Boolean))];
}

function normalizeVerdict(value) {
  return String(value || '').trim().replace(/_/g, ' ').toUpperCase();
}

function successStatus(value) {
  return /^(success|succeeded|passed|pass|ok|neutral)$/i.test(String(value || '').trim());
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function highestLevel(levels) {
  return levels
    .filter((level) => REVIEW_LEVELS.includes(level))
    .sort((a, b) => LEVEL_WEIGHT[b] - LEVEL_WEIGHT[a])[0] || 'L1';
}

function inferAuthorityLevel(evidence) {
  const throughput = evidence.throughput || {};
  const className = throughput.class || evidence.pr_throughput_class;
  const authorityClass = throughput.authority_class || evidence.authority_class;
  const explicitLevel =
    throughput.level ||
    throughput.review_autonomy_level ||
    (evidence.review_autonomy && evidence.review_autonomy.level) ||
    evidence.review_autonomy_level;
  const levels = [explicitLevel];
  const ownerPreapproved =
    throughput.owner_preapproved ||
    throughput.owner_preapproval ||
    (evidence.review_autonomy && (evidence.review_autonomy.owner_preapproval || evidence.review_autonomy.ownerPreapproval)) ||
    evidence.owner_preapproval ||
    evidence.ownerPreapproval;

  if (authorityClass === 'mechanical' || className === 'micro_maintenance') levels.push('L0');
  if (authorityClass === 'standard' || className === 'normal_sprint') levels.push('L1');
  if (
    (authorityClass === 'generated_output' || className === 'generated_output') &&
    !(explicitLevel === 'L2' && ownerPreapproved)
  ) {
    levels.push('L3');
  }
  if (className === 'cross_repo_bundle') levels.push('L3');
  if (
    [
      'high_authority',
      'protected_reference',
      'machine_external_reference',
      'product_authority',
      'diagnostics_mastery_pv_student_use',
    ].includes(authorityClass)
  ) {
    levels.push('L4');
  }

  for (const paired of asArray(evidence.bundle && evidence.bundle.paired_prs)) {
    const pairedLevel =
      paired.level ||
      (paired.throughput && paired.throughput.level) ||
      paired.review_autonomy_level;
    if (pairedLevel) levels.push(pairedLevel);
  }

  return highestLevel(levels);
}

function normalizeEvidence(input) {
  const evidence = clone(input);
  evidence.reviewed_pr = evidence.reviewed_pr || {};
  evidence.proof = evidence.proof || {};
  evidence.throughput = evidence.throughput || {};
  evidence.review_autonomy = evidence.review_autonomy || {};
  evidence.batching = evidence.batching || { viable: false, target: null, reason: null };
  evidence.bundle = evidence.bundle || {};
  evidence.risk_signals = evidence.risk_signals || {};
  evidence.changed_paths = uniqueStrings(asArray(evidence.changed_paths).map(normalizePath));
  evidence.throughput.level = inferAuthorityLevel(evidence);
  evidence.throughput.class = evidence.throughput.class || evidence.pr_throughput_class || 'normal_sprint';
  evidence.throughput.authority_class =
    evidence.throughput.authority_class || evidence.authority_class || 'standard';
  evidence.throughput.human_decision_required =
    evidence.throughput.human_decision_required === undefined
      ? evidence.human_decision_required
      : evidence.throughput.human_decision_required;
  evidence.throughput.owner_preapproved = Boolean(
    evidence.throughput.owner_preapproved ||
      evidence.throughput.owner_preapproval ||
      evidence.review_autonomy.owner_preapproval ||
      evidence.review_autonomy.ownerPreapproval ||
      evidence.owner_preapproval ||
      evidence.ownerPreapproval
  );
  evidence.human_review_payload = HUMAN_PAYLOADS.has(evidence.human_review_payload)
    ? evidence.human_review_payload
    : 'none';
  evidence.consequence = evidence.consequence || (LEVEL_WEIGHT[evidence.throughput.level] >= 3 ? 'high' : 'low');
  return evidence;
}

function pathMatches(paths, patterns) {
  return paths.some((file) => patterns.some((pattern) => pattern.test(file)));
}

function collectEscalationSignals(evidence) {
  const paths = evidence.changed_paths || [];
  const signals = { ...evidence.risk_signals };
  if (pathMatches(paths, GOVERNANCE_PATH_PATTERNS)) signals.review_autonomy_governance_change = true;
  if (pathMatches(paths, PROTECTED_REFERENCE_PATTERNS)) signals.protected_reference_touched = true;
  if (pathMatches(paths, MACHINE_EXTERNAL_REFERENCE_PATTERNS)) signals.machine_external_reference_touched = true;
  if (paths.some((file) => /^\.github\/workflows\//i.test(file)) && signals.workflow_permission_increase !== false) {
    signals.workflow_surface_changed = true;
  }
  return signals;
}

function escalateForSignals(evidence, signals) {
  const hardL4Signals = [
    'review_autonomy_governance_change',
    'pr_readiness_router_modified',
    'transition_executor_modified',
    'review_evidence_weakened',
    'autonomous_merge_policy_changed',
    'branch_protection_weakened',
    'workflow_permission_increase',
    'pull_request_target_introduced',
    'workflow_surface_changed',
    'protected_reference_touched',
    'machine_external_reference_touched',
    'product_authority_changed',
    'diagnostics_mastery_pv_student_use',
  ];
  const triggered = hardL4Signals.filter((key) => signals[key]);
  if (triggered.length === 0) return { evidence, triggered };

  evidence.throughput.level = highestLevel([evidence.throughput.level, 'L4']);
  evidence.throughput.authority_class =
    evidence.throughput.authority_class === 'standard' ? 'high_authority' : evidence.throughput.authority_class;
  evidence.human_review_payload = 'consequential_exception';
  evidence.consequence = 'high';
  return { evidence, triggered };
}

function ciProof(proof, headSha) {
  const ci = proof.ci || {};
  const sha = proof.ci_head_sha || ci.head_sha || ci.reviewed_commit_sha || ci.reviewed_remote_commit_sha;
  const status = proof.ci_status || ci.conclusion || ci.status || ci.result;
  if (proof.ci_waiver === true) {
    return { ok: true, waived: true, sha: sha || null, status: 'waived' };
  }
  return {
    ok: Boolean(sha && sha === headSha && successStatus(status)),
    stale: Boolean(sha && headSha && sha !== headSha),
    missing: !sha || !status,
    sha: sha || null,
    status: status || null,
  };
}

function checkerProof(proof) {
  const checkers = asArray(proof.checkers);
  if (proof.checkers_required === false) return { ok: true, checkers };
  return {
    ok: checkers.length > 0 && checkers.every((checker) => successStatus(checker.status || checker.conclusion || checker.result)),
    checkers,
  };
}

function leadProof(proof, headSha) {
  const lead = proof.lead_review || {};
  const result = normalizeVerdict(lead.result);
  const reviewedSha = lead.reviewed_commit_sha || lead.reviewed_sha || lead.reviewed_remote_commit_sha;
  const afterLead = asArray(proof.post_lead_review_changes || lead.post_review_changes);
  const evidenceOnlyTail =
    reviewedSha &&
    reviewedSha !== headSha &&
    afterLead.length > 0 &&
    afterLead.every((item) => item.evidence_only === true || /^(evidence|packet|lead_review|metadata|index)$/i.test(item.kind || ''));

  return {
    ok: Boolean(
      lead.path &&
        PASSING_LEAD_RESULTS.has(result) &&
        reviewedSha &&
        (reviewedSha === headSha || evidenceOnlyTail)
    ),
    stale: Boolean(reviewedSha && headSha && reviewedSha !== headSha && !evidenceOnlyTail),
    evidenceOnlyTail,
    lead,
    result,
    reviewedSha: reviewedSha || null,
  };
}

function collectBlockers(evidence, signals) {
  const blockers = [];
  const pauseSignals = [
    'missing_permissions',
    'conflicting_repository_authority',
    'unresolved_worktree_contamination',
    'contradictory_human_decisions',
    'paired_repository_unavailable',
    'required_evidence_source_unavailable',
  ];
  for (const key of pauseSignals) {
    if (signals[key]) blockers.push(key);
  }
  return blockers;
}

function collectRevisionReasons(evidence) {
  const reasons = [];
  const headSha = evidence.reviewed_pr.head_sha;
  const proof = evidence.proof || {};
  const ci = ciProof(proof, headSha);
  const checkers = checkerProof(proof);
  const lead = leadProof(proof, headSha);

  if (!evidence.reviewed_pr.repo || !evidence.reviewed_pr.number || !evidence.reviewed_pr.url) {
    reasons.push('missing_remote_pr_identity');
  }
  if (evidence.reviewed_pr.state && evidence.reviewed_pr.state !== 'OPEN') reasons.push('pr_not_open');
  if (
    evidence.reviewed_pr.mergeable === false ||
    /^CONFLICTING$/i.test(String(evidence.reviewed_pr.mergeable || '')) ||
    /^(DIRTY|BLOCKED|BEHIND)$/i.test(String(evidence.reviewed_pr.merge_state || ''))
  ) {
    reasons.push('merge_readiness_blocked');
  }
  if (!SHA_PATTERN.test(String(headSha || ''))) reasons.push('missing_or_invalid_remote_head_sha');
  if (proof.changed_paths_verified !== true) reasons.push('changed_paths_not_verified');
  if (!ci.ok) reasons.push(ci.stale ? 'ci_not_current_head' : 'ci_proof_missing_or_not_successful');
  if (!checkers.ok) reasons.push('checker_proof_missing_or_not_successful');
  if (!lead.ok) reasons.push(lead.stale ? 'lead_review_stale_after_substantive_change' : 'lead_review_missing_or_not_passing');
  if (proof.review_threads_unavailable === true) reasons.push('review_threads_unavailable');
  if (proof.unresolved_review_threads === true) reasons.push('unresolved_review_threads');
  if (proof.requested_changes === true) reasons.push('requested_changes_unresolved');
  if (proof.blocking_comments === true) reasons.push('blocking_comments_unresolved');
  if (evidence.bundle && evidence.bundle.complete === false) reasons.push('bundle_incomplete');
  if (asArray(evidence.bundle && evidence.bundle.paired_prs).some((paired) => paired.ready === false || paired.current === false)) {
    reasons.push('paired_pr_not_ready');
  }
  if (evidence.throughput.level === 'L2' && !evidence.throughput.owner_preapproved) {
    reasons.push('l2_owner_preapproval_missing');
  }
  return { reasons, ci, checkers, lead };
}

function humanReviewRequired(evidence) {
  if (evidence.throughput.human_decision_required === true) return true;
  if (['substantial', 'consequential_exception'].includes(evidence.human_review_payload)) return true;
  return !AUTONOMOUS_LEVELS.has(evidence.throughput.level);
}

function allowedTransitionFor(evidence, route) {
  if (![ROUTES.READY_FOR_LEAD_ONLY, ROUTES.READY_FOR_HUMAN_REVIEW].includes(route)) {
    return ALLOWED_TRANSITIONS.NONE;
  }
  return evidence.reviewed_pr.was_draft === false ? ALLOWED_TRANSITIONS.NONE : ALLOWED_TRANSITIONS.MARK_READY;
}

function reviewedPr(evidence) {
  return {
    repo: evidence.reviewed_pr.repo || null,
    number: evidence.reviewed_pr.number || null,
    url: evidence.reviewed_pr.url || null,
    base: evidence.reviewed_pr.base || evidence.reviewed_pr.base_branch || null,
    head_sha: evidence.reviewed_pr.head_sha || null,
    was_draft: evidence.reviewed_pr.was_draft !== false,
  };
}

function proofSummary(evidence, collected) {
  const branchProtection = evidence.proof.branch_protection || evidence.branch_protection || {};
  return {
    ci_head_sha: collected.ci.sha,
    ci_status: collected.ci.status,
    lead_review_path: collected.lead.lead.path || null,
    lead_review_result: collected.lead.result || null,
    lead_reviewed_sha: collected.lead.reviewedSha,
    lead_review_evidence_tail_allowed: collected.lead.evidenceOnlyTail,
    changed_paths_verified: evidence.proof.changed_paths_verified === true,
    checkers: collected.checkers.checkers,
    branch_protection: branchProtection,
  };
}

function buildDecision(evidence, route, reasonCodes, collected, extras = {}) {
  const decision = {
    schema_version: 1,
    reviewed_pr: reviewedPr(evidence),
    throughput: {
      class: evidence.throughput.class,
      authority_class: evidence.throughput.authority_class,
      level: evidence.throughput.level,
    },
    human_review_payload: evidence.human_review_payload,
    consequence: evidence.consequence,
    batching: {
      viable: Boolean(evidence.batching && evidence.batching.viable),
      target: (evidence.batching && evidence.batching.target) || null,
      reason: (evidence.batching && evidence.batching.reason) || null,
    },
    route,
    reason_codes: uniqueStrings(reasonCodes),
    proof: proofSummary(evidence, collected),
    allowed_transition: allowedTransitionFor(evidence, route),
    human_notification_required: route === ROUTES.READY_FOR_HUMAN_REVIEW || route === ROUTES.PAUSE_ESCALATE,
  };

  if (extras.corrections) decision.corrections = extras.corrections;
  if (extras.blockers) decision.blockers = extras.blockers;
  if (extras.follow_up) decision.follow_up = extras.follow_up;
  if (extras.escalation_signals) decision.escalation_signals = extras.escalation_signals;

  const branchProtection = decision.proof.branch_protection || {};
  if (
    route === ROUTES.READY_FOR_LEAD_ONLY &&
    branchProtection.requires_distinct_approval === true &&
    branchProtection.lead_review_identity_satisfies !== true
  ) {
    decision.reason_codes.push('branch_protection_merge_constraint');
    decision.follow_up = decision.follow_up || [];
    decision.follow_up.push('Decide independent GitHub approval identity, narrow ruleset/bypass, or retained mechanical owner approval.');
  }

  validateDecision(decision);
  return decision;
}

function classifyPrReadiness(input) {
  let evidence = normalizeEvidence(input);
  const signals = collectEscalationSignals(evidence);
  const escalation = escalateForSignals(evidence, signals);
  evidence = escalation.evidence;

  const blockers = collectBlockers(evidence, signals);
  const collected = collectRevisionReasons(evidence);

  if (blockers.length > 0) {
    return buildDecision(evidence, ROUTES.PAUSE_ESCALATE, blockers, collected, {
      blockers,
      escalation_signals: escalation.triggered,
    });
  }

  if (collected.reasons.length > 0) {
    return buildDecision(evidence, ROUTES.KEEP_DRAFT_REVISE, collected.reasons, collected, {
      corrections: collected.reasons,
      escalation_signals: escalation.triggered,
    });
  }

  const needsHuman = humanReviewRequired(evidence);
  if (needsHuman) {
    if (evidence.human_review_payload === 'thin' && evidence.batching && evidence.batching.viable) {
      return buildDecision(
        evidence,
        ROUTES.KEEP_DRAFT_BATCH,
        ['human_payload_thin', 'safe_batching_available'],
        collected,
        { escalation_signals: escalation.triggered }
      );
    }
    if (['substantial', 'consequential_exception'].includes(evidence.human_review_payload)) {
      const reasons =
        evidence.human_review_payload === 'consequential_exception'
          ? ['human_authority_consequential_exception']
          : ['substantial_human_review_payload'];
      return buildDecision(evidence, ROUTES.READY_FOR_HUMAN_REVIEW, [...reasons, ...escalation.triggered], collected, {
        escalation_signals: escalation.triggered,
      });
    }
    return buildDecision(evidence, ROUTES.KEEP_DRAFT_REVISE, ['human_review_payload_not_reviewable'], collected, {
      corrections: ['human_review_payload_not_reviewable'],
      escalation_signals: escalation.triggered,
    });
  }

  return buildDecision(
    evidence,
    ROUTES.READY_FOR_LEAD_ONLY,
    ['current_head_ci_green', 'lead_review_pass', 'no_human_authority'],
    collected,
    { escalation_signals: escalation.triggered }
  );
}

function validateDecision(decision) {
  const routeValues = new Set(Object.values(ROUTES));
  const transitionValues = new Set(Object.values(ALLOWED_TRANSITIONS));
  if (decision.schema_version !== 1) throw new Error('decision.schema_version must be 1');
  if (!decision.reviewed_pr || typeof decision.reviewed_pr !== 'object') throw new Error('decision.reviewed_pr is required');
  if (!decision.reviewed_pr.repo) throw new Error('decision.reviewed_pr.repo is required');
  if (!Number.isInteger(decision.reviewed_pr.number) || decision.reviewed_pr.number < 1) {
    throw new Error('decision.reviewed_pr.number must be a positive integer');
  }
  if (!SHA_PATTERN.test(String(decision.reviewed_pr.head_sha || ''))) {
    throw new Error('decision.reviewed_pr.head_sha must be a 40-character SHA');
  }
  if (!routeValues.has(decision.route)) throw new Error(`unsupported route: ${decision.route}`);
  if (!transitionValues.has(decision.allowed_transition)) {
    throw new Error(`unsupported allowed_transition: ${decision.allowed_transition}`);
  }
  if (!Array.isArray(decision.reason_codes) || decision.reason_codes.length === 0) {
    throw new Error('decision.reason_codes must be a non-empty array');
  }
  if (!HUMAN_PAYLOADS.has(decision.human_review_payload)) {
    throw new Error(`unsupported human_review_payload: ${decision.human_review_payload}`);
  }
  return true;
}

function decisionMarker(decision) {
  validateDecision(decision);
  return `<!-- 4veco-pr-readiness:${decision.reviewed_pr.repo}:${decision.reviewed_pr.number}:${decision.reviewed_pr.head_sha} -->`;
}

function renderDecisionMarkdown(decision) {
  validateDecision(decision);
  const lines = [
    decisionMarker(decision),
    '# PR Readiness Decision',
    '',
    `- Route: \`${decision.route}\``,
    `- Allowed transition: \`${decision.allowed_transition}\``,
    `- Repository: \`${decision.reviewed_pr.repo}\``,
    `- PR: #${decision.reviewed_pr.number}`,
    `- Reviewed head: \`${decision.reviewed_pr.head_sha}\``,
    `- Throughput level: \`${decision.throughput.level}\``,
    `- Human-review payload: \`${decision.human_review_payload}\``,
    `- Human notification required: \`${decision.human_notification_required}\``,
    '',
    '## Reason Codes',
    '',
    ...decision.reason_codes.map((code) => `- \`${code}\``),
  ];

  if (decision.batching && decision.batching.viable) {
    lines.push('', '## Batching', '', `- Target: ${decision.batching.target || 'not specified'}`, `- Reason: ${decision.batching.reason || 'not specified'}`);
  }
  if (Array.isArray(decision.corrections) && decision.corrections.length > 0) {
    lines.push('', '## Corrections', '', ...decision.corrections.map((item) => `- \`${item}\``));
  }
  if (Array.isArray(decision.follow_up) && decision.follow_up.length > 0) {
    lines.push('', '## Follow Up', '', ...decision.follow_up.map((item) => `- ${item}`));
  }
  lines.push('');
  return `${lines.join('\n')}\n`;
}

module.exports = {
  ALLOWED_TRANSITIONS,
  ROUTES,
  classifyPrReadiness,
  decisionMarker,
  normalizeEvidence,
  renderDecisionMarkdown,
  validateDecision,
};
