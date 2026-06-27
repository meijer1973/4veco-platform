const {
  isEvidenceTailPath,
  isGovernanceSurface,
  normalizePath,
} = require('./pr-readiness-governance-surfaces');
const { validateCompatibilityProof } = require('./cross-repo-bundle-compatibility');
const crypto = require('crypto');

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
const DEFAULT_REQUIRED_CI_CONTEXTS = Object.freeze(['validate-platform']);

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

function uniqueStrings(values) {
  return [...new Set((values || []).map((item) => String(item || '').trim()).filter(Boolean))];
}

function normalizeVerdict(value) {
  return String(value || '').trim().replace(/_/g, ' ').toUpperCase();
}

function successStatus(value) {
  return /^(success|succeeded|passed|pass|ok)$/i.test(String(value || '').trim());
}

function requiredCiContexts(proof) {
  const ci = proof.ci || {};
  const configured =
    proof.required_ci_contexts ||
    proof.required_status_contexts ||
    ci.required_contexts ||
    ci.required_status_contexts ||
    [];
  return uniqueStrings([...DEFAULT_REQUIRED_CI_CONTEXTS, ...asArray(configured)]);
}

function checkNames(check) {
  const item = check || {};
  return uniqueStrings([
    item.name,
    item.context,
    item.workflowName,
    item.workflow_name,
  ]);
}

function requiredContextsProof(proof) {
  const ci = proof.ci || {};
  const checks = asArray(proof.status_checks || proof.checks || ci.checks || ci.status_checks);
  const required = requiredCiContexts(proof);
  const missing = required.filter((context) => {
    const matching = checks.find((check) => checkNames(check).includes(context));
    return !matching || !successStatus(matching.conclusion || matching.status || matching.state || matching.result);
  });
  return {
    ok: missing.length === 0,
    required,
    missing,
    checks,
  };
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function decisionDigest(decision) {
  validateDecision(decision);
  return crypto.createHash('sha256').update(stableStringify(decision)).digest('hex');
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
  if (paths.some(isGovernanceSurface)) signals.review_autonomy_governance_change = true;
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
  const contexts = requiredContextsProof(proof);
  if (proof.ci_waiver === true) {
    return { ok: true, waived: true, sha: sha || null, status: 'waived', contexts };
  }
  return {
    ok: Boolean(sha && sha === headSha && successStatus(status) && contexts.ok),
    stale: Boolean(sha && headSha && sha !== headSha),
    missing: !sha || !status,
    missingRequiredContext: !contexts.ok,
    sha: sha || null,
    status: status || null,
    contexts,
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

function countCandidate(value) {
  return Number.isInteger(value) && value >= 0 ? value : null;
}

function branchProtectionApprovalProof(rawBranchProtection) {
  const raw = rawBranchProtection && typeof rawBranchProtection === 'object' ? rawBranchProtection : {};
  const hasNestedCheckerShape = Boolean(
    raw.observed &&
      raw.observed.required_pull_request_reviews &&
      typeof raw.observed.required_pull_request_reviews === 'object'
  );
  const nestedReviewSummary =
    hasNestedCheckerShape
      ? raw.observed.required_pull_request_reviews
      : {};
  const hasRawApiShape = Boolean(
    raw.required_pull_request_reviews && typeof raw.required_pull_request_reviews === 'object'
  );
  const rawReviewSummary =
    hasRawApiShape
      ? raw.required_pull_request_reviews
      : {};
  const observed = hasNestedCheckerShape
    ? {
        source: 'branch-protection-checker',
        count: countCandidate(nestedReviewSummary.required_approving_review_count),
      }
    : hasRawApiShape
      ? {
          source: 'branch-protection-api',
          count: countCandidate(rawReviewSummary.required_approving_review_count),
        }
      : {
          source: raw.required_approving_review_count === undefined ? null : 'readiness-proof',
          count: countCandidate(raw.required_approving_review_count),
        };
  const normalized = {
    ...raw,
    required_approving_review_count: observed.count,
    approval_count_source: observed.source,
    approval_count_observable: observed.count !== null,
    requires_distinct_approval: observed.count !== null ? observed.count > 0 : null,
  };
  delete normalized.lead_review_identity_satisfies;
  return normalized;
}

function branchProtectionProof(proof, evidence) {
  return branchProtectionApprovalProof((proof && proof.branch_protection) || evidence.branch_protection || {});
}

function repoIsLesson(repo) {
  return /\/4veco-lessen$/i.test(String(repo || ''));
}

function repoIsPlatform(repo) {
  return /\/4veco-platform$/i.test(String(repo || ''));
}

function positiveInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

function normalizeBundleMember(member) {
  const item = member || {};
  return {
    ...item,
    repository: item.repository || item.repo || null,
    pr_number: positiveInteger(item.pr_number || item.number),
    base: item.base || item.baseRefName || item.base_branch || null,
    head_sha: item.head_sha || item.headRefOid || null,
    reviewed_payload_head_sha: item.reviewed_payload_head_sha || item.payload_head_sha || null,
  };
}

function bundleMemberComplete(member, options = {}) {
  const requireHead = options.requireHead !== false;
  return Boolean(
    member.repository &&
      member.pr_number &&
      SHA_PATTERN.test(String(member.reviewed_payload_head_sha || '')) &&
      (!requireHead || SHA_PATTERN.test(String(member.head_sha || '')))
  );
}

function bundleMemberHeadMatches(member) {
  return Boolean(
    member &&
      SHA_PATTERN.test(String(member.head_sha || '')) &&
      SHA_PATTERN.test(String(member.reviewed_payload_head_sha || '')) &&
      member.head_sha === member.reviewed_payload_head_sha
  );
}

function bundleMemberLifecycleOk(member) {
  return Boolean(
    member &&
      member.open === true &&
      member.current === true &&
      member.mergeable === true &&
      bundleMemberHeadMatches(member)
  );
}

function compatibilityStateGreen(compatibility, stateName) {
  const state = compatibility && compatibility.states && compatibility.states[stateName];
  return state && state.status === 'success';
}

function compatibilityPermitsPlatformFirst(compatibility) {
  return Boolean(
    compatibility &&
      compatibility.ok === true &&
      asArray(compatibility.permitted_merge_orders).includes('platform-first') &&
      compatibilityStateGreen(compatibility, 'platform-first') &&
      compatibilityStateGreen(compatibility, 'bundle-final')
  );
}

function pairedLeadReviewRecords(proof) {
  const lead = (proof && proof.lead_review) || {};
  return [
    ...asArray(lead.paired_member_reviews),
    ...asArray(lead.paired_reviews),
    ...asArray(lead.bundle_member_reviews),
  ].filter(Boolean);
}

function pairedLeadReviewFor(member, proof) {
  if (!member) return null;
  return pairedLeadReviewRecords(proof).find((record) => {
    const repository = record.repository || record.repo;
    const prNumber = positiveInteger(record.pr_number || record.number);
    const reviewedSha = record.reviewed_commit_sha || record.reviewed_sha || record.reviewed_remote_commit_sha;
    const result = normalizeVerdict(record.review_result || record.result || record.verdict);
    const path = record.review_path || record.path || record.report_path;
    return Boolean(
      repository === member.repository &&
        prNumber === member.pr_number &&
        reviewedSha === member.head_sha &&
        PASSING_LEAD_RESULTS.has(result) &&
        typeof path === 'string' &&
        path.trim()
    );
  }) || null;
}

function pairedLeadReviewed(member, proof) {
  return Boolean(pairedLeadReviewFor(member, proof));
}

function normalizePairedLeadReview(record) {
  const item = record || {};
  return {
    repository: item.repository || item.repo || null,
    pr_number: positiveInteger(item.pr_number || item.number),
    reviewed_commit_sha: item.reviewed_commit_sha || item.reviewed_sha || item.reviewed_remote_commit_sha || null,
    review_result: normalizeVerdict(item.review_result || item.result || item.verdict),
    review_path: item.review_path || item.path || item.report_path || null,
  };
}

function controllerFirstDraftTransitionable(member, context) {
  return Boolean(
    context &&
      context.delegated === false &&
      repoIsPlatform(context.reviewedRepo) &&
      repoIsLesson(member && member.repository) &&
      member.is_draft === true &&
      member.ready === false &&
      bundleMemberComplete(member) &&
      bundleMemberLifecycleOk(member) &&
      pairedLeadReviewed(member, context.proof) &&
      compatibilityPermitsPlatformFirst(context.compatibility)
  );
}

function findBundleMemberByRepo(members, predicate) {
  return members.find((member) => member && predicate(member.repository)) || null;
}

function bundleExpectedExactMembers(raw, controller, currentMember, pairedPrs) {
  const explicit = raw.exact_members || raw.exactMembers || {};
  const allMembers = [controller, currentMember, ...pairedPrs].filter(Boolean);
  const platformMember = findBundleMemberByRepo(allMembers, repoIsPlatform);
  const lessonMember = findBundleMemberByRepo(allMembers, repoIsLesson);
  return {
    platform_base_sha: explicit.platform_base_sha || explicit.platformBaseSha || raw.platform_base_sha || raw.platformBaseSha || null,
    platform_candidate_sha:
      (platformMember && platformMember.reviewed_payload_head_sha) ||
      explicit.platform_candidate_sha ||
      explicit.platformCandidateSha ||
      raw.platform_candidate_sha ||
      raw.platformCandidateSha ||
      null,
    lesson_base_sha: explicit.lesson_base_sha || explicit.lessonBaseSha || raw.lesson_base_sha || raw.lessonBaseSha || null,
    lesson_candidate_sha:
      (lessonMember && lessonMember.reviewed_payload_head_sha) ||
      explicit.lesson_candidate_sha ||
      explicit.lessonCandidateSha ||
      raw.lesson_candidate_sha ||
      raw.lessonCandidateSha ||
      null,
  };
}

function collectExactMemberFailures(exactMembers) {
  return Object.entries(exactMembers)
    .filter(([, value]) => !SHA_PATTERN.test(String(value || '')))
    .map(([key]) => `${key}_missing_or_invalid`);
}

function collectDeclaredExactMemberMismatches(raw, exactMembers) {
  const explicit = raw.exact_members || raw.exactMembers || {};
  const mismatches = [];
  for (const key of ['platform_candidate_sha', 'lesson_candidate_sha']) {
    const camelKey = key.replace(/_([a-z])/g, (_match, letter) => letter.toUpperCase());
    const declared = explicit[key] || explicit[camelKey] || raw[key] || raw[camelKey] || null;
    if (
      declared &&
      SHA_PATTERN.test(String(declared)) &&
      SHA_PATTERN.test(String(exactMembers[key] || '')) &&
      declared !== exactMembers[key]
    ) {
      mismatches.push(`${key}_does_not_match_member_head`);
    }
  }
  return mismatches;
}

function bundleSafetyProof(proof, evidence) {
  const raw = (proof && proof.bundle) || evidence.bundle || {};
  const pairedPrs = asArray(raw.paired_prs || (evidence.bundle && evidence.bundle.paired_prs)).map(normalizeBundleMember);
  const bundleId = raw.bundle_id || evidence.bundle_id || (evidence.bundle && evidence.bundle.bundle_id) || null;
  const required =
    evidence.throughput.class === 'cross_repo_bundle' ||
    pairedPrs.length > 0 ||
    Boolean(bundleId) ||
    Boolean(raw.delegated === true);
  const delegated = raw.delegated === true || raw.role === 'member';
  const failures = [];
  if (!required) {
    return { required: false, delegated: false, ok: true, failures: [], summary: null };
  }
  if (typeof bundleId !== 'string' || !bundleId.trim()) failures.push('bundle_id_missing');
  const controller = normalizeBundleMember(raw.controller || {});
  if (!bundleMemberComplete(controller, { requireHead: false })) {
    failures.push('bundle_controller_metadata_incomplete');
  }
  if (!delegated) {
    if (controller.repository && controller.repository !== evidence.reviewed_pr.repo) {
      failures.push('bundle_controller_repo_mismatch');
    }
    if (controller.pr_number && Number(controller.pr_number) !== Number(evidence.reviewed_pr.number)) {
      failures.push('bundle_controller_pr_mismatch');
    }
    if (controller.reviewed_payload_head_sha && controller.reviewed_payload_head_sha !== evidence.reviewed_pr.head_sha) {
      failures.push('bundle_controller_head_mismatch');
    }
  } else {
    const currentMember = normalizeBundleMember(raw.current_member || raw.current_pr || raw.member || {});
    if (!bundleMemberComplete(currentMember)) {
      failures.push('bundle_member_metadata_incomplete');
    } else {
      if (currentMember.repository !== evidence.reviewed_pr.repo) failures.push('bundle_member_repo_mismatch');
      if (Number(currentMember.pr_number) !== Number(evidence.reviewed_pr.number)) failures.push('bundle_member_pr_mismatch');
      if (
        currentMember.head_sha !== evidence.reviewed_pr.head_sha ||
        currentMember.reviewed_payload_head_sha !== evidence.reviewed_pr.head_sha
      ) {
        failures.push('bundle_member_head_mismatch');
      }
    }
  }
  if (pairedPrs.length === 0) failures.push('paired_prs_missing');
  for (const paired of pairedPrs) {
    if (!bundleMemberComplete(paired)) failures.push('paired_pr_metadata_incomplete');
    if (paired && !paired.base) failures.push('paired_pr_base_missing');
    if (paired && paired.reviewed_payload_head_sha && paired.head_sha && paired.reviewed_payload_head_sha !== paired.head_sha) {
      failures.push('paired_pr_head_mismatch');
    }
  }
  if (raw.complete === false) failures.push('bundle_incomplete');
  const currentMember = delegated ? normalizeBundleMember(raw.current_member || raw.current_pr || raw.member || {}) : null;
  const exactMembers = bundleExpectedExactMembers(raw, controller, currentMember, pairedPrs);
  const exactMemberFailures = collectExactMemberFailures(exactMembers);
  failures.push(...exactMemberFailures);
  failures.push(...collectDeclaredExactMemberMismatches(raw, exactMembers));
  const compatibilityRaw = raw.compatibility || raw.compatibility_matrix || raw.bundle_compatibility || proof.bundle_compatibility;
  const compatibility = compatibilityRaw
    ? validateCompatibilityProof(compatibilityRaw, {
        bundleId: bundleId || undefined,
        exactMembers,
      })
    : { ok: false, failures: ['bundle_compatibility_missing'] };
  if (!compatibility.ok) failures.push(...compatibility.failures);
  const transitionableDraftMembers = [];
  const pairedLeadReviews = [];
  const transitionContext = {
    delegated,
    reviewedRepo: evidence.reviewed_pr.repo,
    proof,
    compatibility,
  };
  for (const paired of pairedPrs) {
    const pairedLeadReview = pairedLeadReviewFor(paired, proof);
    if (pairedLeadReview) pairedLeadReviews.push(normalizePairedLeadReview(pairedLeadReview));
    const transitionable = controllerFirstDraftTransitionable(paired, transitionContext);
    const lifecycleOk = bundleMemberLifecycleOk(paired);
    if (transitionable) {
      transitionableDraftMembers.push({
        repository: paired.repository,
        pr_number: paired.pr_number,
        base: paired.base || null,
        head_sha: paired.head_sha,
        reviewed_payload_head_sha: paired.reviewed_payload_head_sha,
        reason: 'controller_first_mark_ready',
      });
    }
    if (paired && paired.is_draft === true && !transitionable) failures.push('paired_pr_draft');
    if (paired && (!lifecycleOk || paired.ready !== true) && !transitionable) {
      failures.push('paired_pr_not_ready');
    }
  }
  const reviewedPrIsDraft = evidence.reviewed_pr.was_draft !== false;
  const anyPairedDraft = pairedPrs.some((paired) => paired && paired.is_draft === true);
  const anyPairedNotReady = pairedPrs.some((paired) => paired && (!bundleMemberLifecycleOk(paired) || paired.ready !== true));
  const transitionReady = failures.length === 0 && (reviewedPrIsDraft || transitionableDraftMembers.length > 0);
  const mergeReady =
    failures.length === 0 &&
    reviewedPrIsDraft === false &&
    !anyPairedDraft &&
    !anyPairedNotReady &&
    transitionableDraftMembers.length === 0;
  const summary = {
    required,
    delegated,
    ok: failures.length === 0,
    bundle_id: bundleId,
    controller: controller.repository ? controller : null,
    paired_prs: pairedPrs,
    exact_members: exactMembers,
    compatibility,
    transition_ready: transitionReady,
    merge_ready: mergeReady,
    transitionable_draft_members: transitionableDraftMembers,
    paired_lead_reviews: pairedLeadReviews,
    failures: uniqueStrings(failures),
  };
  return summary;
}

function bundleAllowsLessonFirstControllerCi(bundle) {
  const summary = bundle && (bundle.summary || bundle);
  const compatibility = summary && summary.compatibility;
  const states = (compatibility && compatibility.states) || {};
  const lessonFirst = states['lesson-first'] || {};
  const bundleFinal = states['bundle-final'] || {};
  return Boolean(
    summary &&
      summary.required === true &&
      summary.delegated !== true &&
      summary.ok === true &&
      compatibility &&
      compatibility.ok === true &&
      asArray(compatibility.permitted_merge_orders).includes('lesson-first') &&
      compatibility.recommended_merge_order === 'lesson-first' &&
      lessonFirst.status === 'success' &&
      bundleFinal.status === 'success'
  );
}

function leadProof(proof, headSha) {
  const lead = proof.lead_review || {};
  const result = normalizeVerdict(lead.result);
  const reviewedSha = lead.reviewed_commit_sha || lead.reviewed_sha || lead.reviewed_remote_commit_sha;
  const afterLeadPaths = uniqueStrings(
    asArray(proof.post_lead_review_changed_paths || lead.post_review_changed_paths).map(normalizePath)
  );
  const evidenceOnlyTail =
    reviewedSha &&
    reviewedSha !== headSha &&
    afterLeadPaths.length > 0 &&
    afterLeadPaths.every(isEvidenceTailPath);
  const integrationAuthorizedTail = integrationLeadAuthorizationProof(proof, reviewedSha, headSha);

  return {
    ok: Boolean(
      lead.path &&
        PASSING_LEAD_RESULTS.has(result) &&
        reviewedSha &&
        (reviewedSha === headSha || evidenceOnlyTail || integrationAuthorizedTail)
    ),
    stale: Boolean(reviewedSha && headSha && reviewedSha !== headSha && !evidenceOnlyTail && !integrationAuthorizedTail),
    evidenceOnlyTail,
    integrationAuthorizedTail,
    postLeadReviewChangedPaths: afterLeadPaths,
    disallowedEvidenceTail: Boolean(
      reviewedSha &&
        reviewedSha !== headSha &&
        afterLeadPaths.length > 0 &&
        !integrationAuthorizedTail &&
        !afterLeadPaths.every(isEvidenceTailPath)
    ),
    lead,
    result,
    reviewedSha: reviewedSha || null,
  };
}

function integrationLeadAuthorizationProof(proof, reviewedSha, headSha) {
  if (!reviewedSha || !headSha || reviewedSha === headSha) return false;
  const integration = proof.integration || {};
  const baseDrift = integration.base_drift || {};
  return Boolean(
    integration.reviewed_payload_head_sha === reviewedSha &&
      integration.integration_head_sha === headSha &&
      integration.authorization_inherited === true &&
      integration.requires_integration_delta_lead_review !== true &&
      integration.requires_human_reauthorization !== true &&
      baseDrift.requires_integration_delta_lead_review !== true &&
      baseDrift.requires_human_reauthorization !== true &&
      asArray(integration.failures).length === 0
  );
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
  const branchProtection = branchProtectionProof(proof, evidence);
  const bundle = bundleSafetyProof(proof, evidence);
  const lessonDelegatedBundle = repoIsLesson(evidence.reviewed_pr.repo) && bundle.delegated === true && bundle.ok === true;
  const controllerDelegatedBundleCi =
    repoIsPlatform(evidence.reviewed_pr.repo) && bundleAllowsLessonFirstControllerCi(bundle);
  const bundleDelegatedCi = lessonDelegatedBundle || controllerDelegatedBundleCi;
  const autonomousLevel = AUTONOMOUS_LEVELS.has(evidence.throughput.level);
  const mergeState = String(evidence.reviewed_pr.merge_state || '');
  const integrationStatusPendingBlock =
    /^BLOCKED$/i.test(mergeState) &&
    proof.integration &&
    proof.integration.authorization_inherited === true &&
    proof.integration.integration_head_sha === headSha;
  const controllerBundlePendingBlock =
    /^BLOCKED$/i.test(mergeState) && controllerDelegatedBundleCi;

  if (!evidence.reviewed_pr.repo || !evidence.reviewed_pr.number || !evidence.reviewed_pr.url) {
    reasons.push('missing_remote_pr_identity');
  }
  if (evidence.reviewed_pr.state && evidence.reviewed_pr.state !== 'OPEN') reasons.push('pr_not_open');
  if (
    evidence.reviewed_pr.mergeable === false ||
    /^CONFLICTING$/i.test(String(evidence.reviewed_pr.mergeable || '')) ||
    /^DIRTY$/i.test(mergeState) ||
    (/^BLOCKED$/i.test(mergeState) && !integrationStatusPendingBlock && !controllerBundlePendingBlock)
  ) {
    reasons.push('merge_readiness_blocked');
  }
  if (!SHA_PATTERN.test(String(headSha || ''))) reasons.push('missing_or_invalid_remote_head_sha');
  if (proof.changed_paths_verified !== true) reasons.push('changed_paths_not_verified');
  if (autonomousLevel && proof.ci_waiver === true) reasons.push('ci_waiver_not_allowed_for_autonomous_lane');
  if (autonomousLevel && proof.checkers_required === false) {
    reasons.push('checker_waiver_not_allowed_for_autonomous_lane');
  }
  if (!ci.ok && !bundleDelegatedCi) {
    reasons.push(
      ci.stale
        ? 'ci_not_current_head'
        : ci.missingRequiredContext
          ? 'required_ci_context_missing_or_not_successful'
          : 'ci_proof_missing_or_not_successful'
    );
  }
  if (!checkers.ok) reasons.push('checker_proof_missing_or_not_successful');
  if (proof.lead_review_compare_unavailable === true) reasons.push('lead_review_compare_unavailable');
  if (!lead.ok) reasons.push(lead.stale ? 'lead_review_stale_after_substantive_change' : 'lead_review_missing_or_not_passing');
  if (proof.review_threads_unavailable === true) reasons.push('review_threads_unavailable');
  if (proof.unresolved_review_threads === true) reasons.push('unresolved_review_threads');
  if (proof.requested_changes === true) reasons.push('requested_changes_unresolved');
  if (proof.blocking_comments === true) reasons.push('blocking_comments_unresolved');
  if (bundle.required && !bundle.ok) reasons.push(...bundle.failures);
  if (evidence.bundle && evidence.bundle.complete === false) reasons.push('bundle_incomplete');
  const transitionableKeys = new Set(
    asArray(bundle.transitionable_draft_members).map((member) => `${member.repository}#${member.pr_number}`)
  );
  if (asArray(evidence.bundle && evidence.bundle.paired_prs).some((paired) => {
    const item = normalizeBundleMember(paired);
    return (
      (item.ready === false || item.current === false) &&
      !transitionableKeys.has(`${item.repository}#${item.pr_number}`)
    );
  })) {
    reasons.push('paired_pr_not_ready');
  }
  if (evidence.throughput.level === 'L2' && !evidence.throughput.owner_preapproved) {
    reasons.push('l2_owner_preapproval_missing');
  }
  return {
    reasons: uniqueStrings(reasons),
    ci,
    checkers,
    lead,
    branchProtection,
    bundle,
    lessonDelegatedBundle,
    controllerDelegatedBundleCi,
    bundleDelegatedCi,
  };
}

function branchProtectionRevisions(collected) {
  if (collected.lessonDelegatedBundle === true) return [];
  return collected.branchProtection.approval_count_observable === true
    ? []
    : ['branch_protection_approval_count_unavailable'];
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
  return {
    ci_head_sha: collected.ci.sha,
    ci_status: collected.ci.status,
    ci_required_contexts: collected.ci.contexts.required,
    ci_missing_contexts: collected.ci.contexts.missing,
    ci_checks: collected.ci.contexts.checks.map((check) => ({
      name: check.name || check.context || check.workflowName || check.workflow_name || 'unknown',
      conclusion: check.conclusion || check.status || check.state || check.result || null,
    })),
    lead_review_path: collected.lead.lead.path || null,
    lead_review_result: collected.lead.result || null,
    lead_reviewed_sha: collected.lead.reviewedSha,
    lead_review_evidence_tail_allowed: collected.lead.evidenceOnlyTail,
    lead_review_integration_authorization_inherited: collected.lead.integrationAuthorizedTail,
    post_lead_review_changed_paths: collected.lead.postLeadReviewChangedPaths,
    changed_paths_verified: evidence.proof.changed_paths_verified === true,
    checkers: collected.checkers.checkers,
    branch_protection: collected.branchProtection,
    bundle: collected.bundle.summary || collected.bundle || null,
    bundle_delegated_ci: collected.bundleDelegatedCi === true,
    human_authorization: evidence.proof.human_authorization || null,
    integration: evidence.proof.integration || null,
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
    branchProtection.requires_distinct_approval === true
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
      const protectionRevisions = branchProtectionRevisions(collected);
      if (protectionRevisions.length > 0) {
        return buildDecision(evidence, ROUTES.KEEP_DRAFT_REVISE, protectionRevisions, collected, {
          corrections: protectionRevisions,
          escalation_signals: escalation.triggered,
        });
      }
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

  const protectionRevisions = branchProtectionRevisions(collected);
  if (protectionRevisions.length > 0) {
    return buildDecision(evidence, ROUTES.KEEP_DRAFT_REVISE, protectionRevisions, collected, {
      corrections: protectionRevisions,
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
  if (!decision.throughput || typeof decision.throughput !== 'object') throw new Error('decision.throughput is required');
  if (!decision.proof || typeof decision.proof !== 'object') throw new Error('decision.proof is required');
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
  const readyRoutes = new Set([ROUTES.READY_FOR_LEAD_ONLY, ROUTES.READY_FOR_HUMAN_REVIEW]);
  const nonTransitionRoutes = new Set([ROUTES.KEEP_DRAFT_REVISE, ROUTES.KEEP_DRAFT_BATCH, ROUTES.PAUSE_ESCALATE]);
  if (nonTransitionRoutes.has(decision.route) && decision.allowed_transition !== ALLOWED_TRANSITIONS.NONE) {
    throw new Error(`${decision.route} must have allowed_transition NONE`);
  }
  if (!readyRoutes.has(decision.route) && decision.allowed_transition === ALLOWED_TRANSITIONS.MARK_READY) {
    throw new Error('MARK_READY transition is only valid for ready routes');
  }
  if (
    decision.route === ROUTES.READY_FOR_LEAD_ONLY &&
    (!AUTONOMOUS_LEVELS.has(decision.throughput.level) || decision.human_review_payload !== 'none')
  ) {
    throw new Error('READY_FOR_LEAD_ONLY requires L0-L2 with no human payload');
  }
  if (
    decision.route === ROUTES.READY_FOR_HUMAN_REVIEW &&
    LEVEL_WEIGHT[decision.throughput.level] < 3 &&
    decision.human_review_payload !== 'consequential_exception'
  ) {
    throw new Error('READY_FOR_HUMAN_REVIEW requires L3/L4 or consequential_exception');
  }
  if (decision.route === ROUTES.READY_FOR_HUMAN_REVIEW && decision.auto_merge === true) {
    throw new Error('READY_FOR_HUMAN_REVIEW must not permit auto_merge');
  }
  if (readyRoutes.has(decision.route)) {
    const delegatedLessonBundle =
      repoIsLesson(decision.reviewed_pr.repo) &&
      decision.proof.bundle &&
      decision.proof.bundle.delegated === true &&
      decision.proof.bundle.ok === true;
    const bundleDelegatedCi =
      delegatedLessonBundle ||
      (repoIsPlatform(decision.reviewed_pr.repo) &&
        decision.proof.bundle_delegated_ci === true &&
        bundleAllowsLessonFirstControllerCi(decision.proof.bundle));
    if (decision.throughput.class === 'cross_repo_bundle') {
      if (!decision.proof.bundle || decision.proof.bundle.ok !== true) {
        throw new Error(`${decision.route} requires green cross-repo bundle proof`);
      }
      const compatibility = decision.proof.bundle.compatibility || {};
      if (
        compatibility.ok !== true ||
        !asArray(compatibility.permitted_merge_orders).length ||
        !compatibility.recommended_merge_order
      ) {
        throw new Error(`${decision.route} requires green bundle-final and intermediate compatibility proof`);
      }
      const pairedPrs = asArray(decision.proof.bundle.paired_prs);
      const hasTransitionableDraftMembers = asArray(decision.proof.bundle.transitionable_draft_members).length > 0;
      const anyPairedDraft = pairedPrs.some((paired) => paired && paired.is_draft === true);
      const anyPairedNotReady = pairedPrs.some((paired) => {
        const member = normalizeBundleMember(paired);
        return !member.base || !bundleMemberLifecycleOk(member) || member.ready !== true;
      });
      if (
        decision.proof.bundle.merge_ready === true &&
        (decision.reviewed_pr.was_draft !== false ||
          anyPairedDraft ||
          anyPairedNotReady ||
          hasTransitionableDraftMembers)
      ) {
        throw new Error(`${decision.route} cannot mark bundle merge_ready while a draft or unready member remains`);
      }
      if (
        decision.allowed_transition === ALLOWED_TRANSITIONS.MARK_READY &&
        decision.proof.bundle.transition_ready !== true
      ) {
        throw new Error(`${decision.route} MARK_READY requires bundle transition_ready proof`);
      }
    }
    const branchProtection = decision.proof.branch_protection || null;
    const missingObservableApprovalCount =
      !branchProtection ||
      branchProtection.approval_count_observable !== true ||
      !Number.isInteger(branchProtection.required_approving_review_count);
    if (!delegatedLessonBundle && missingObservableApprovalCount) {
      throw new Error(`${decision.route} requires observable branch-protection approval count`);
    }
    if (decision.proof.changed_paths_verified !== true) {
      throw new Error(`${decision.route} requires changed_paths_verified proof`);
    }
    if (!bundleDelegatedCi && decision.proof.ci_head_sha !== decision.reviewed_pr.head_sha) {
      throw new Error(`${decision.route} requires CI proof for reviewed head`);
    }
    if (!bundleDelegatedCi && !successStatus(decision.proof.ci_status)) {
      throw new Error(`${decision.route} requires successful CI status`);
    }
    if (!bundleDelegatedCi && !asArray(decision.proof.ci_required_contexts).includes('validate-platform')) {
      throw new Error(`${decision.route} requires validate-platform CI context`);
    }
    if (!bundleDelegatedCi && asArray(decision.proof.ci_missing_contexts).includes('validate-platform')) {
      throw new Error(`${decision.route} requires passing validate-platform CI context`);
    }
    if (!bundleDelegatedCi) {
      const validatePlatformCheck = asArray(decision.proof.ci_checks).find((check) => {
        const status = check && (check.conclusion || check.status || check.state || check.result);
        return checkNames(check).includes('validate-platform') && successStatus(status);
      });
      if (!validatePlatformCheck) {
        throw new Error(`${decision.route} requires successful validate-platform check proof`);
      }
    }
    const checkers = asArray(decision.proof.checkers);
    if (
      checkers.length === 0 ||
      !checkers.every((checker) => successStatus(checker && (checker.status || checker.conclusion || checker.result)))
    ) {
      throw new Error(`${decision.route} requires passing checker proof`);
    }
    if (typeof decision.proof.lead_review_path !== 'string' || !decision.proof.lead_review_path.trim()) {
      throw new Error(`${decision.route} requires lead review path`);
    }
    if (!PASSING_LEAD_RESULTS.has(normalizeVerdict(decision.proof.lead_review_result))) {
      throw new Error(`${decision.route} requires passing lead review result`);
    }
    if (!SHA_PATTERN.test(String(decision.proof.lead_reviewed_sha || ''))) {
      throw new Error(`${decision.route} requires valid lead-reviewed SHA`);
    }
    if (
      decision.proof.lead_reviewed_sha !== decision.reviewed_pr.head_sha &&
      decision.proof.lead_review_evidence_tail_allowed !== true &&
      decision.proof.lead_review_integration_authorization_inherited !== true
    ) {
      throw new Error(`${decision.route} requires lead review for reviewed head, verified evidence-only tail, or inherited integration authorization`);
    }
    if (decision.proof.lead_review_integration_authorization_inherited === true) {
      const integration = decision.proof.integration || {};
      const baseDrift = integration.base_drift || {};
      if (
        integration.reviewed_payload_head_sha !== decision.proof.lead_reviewed_sha ||
        integration.integration_head_sha !== decision.reviewed_pr.head_sha ||
        integration.authorization_inherited !== true ||
        integration.requires_integration_delta_lead_review === true ||
        integration.requires_human_reauthorization === true ||
        baseDrift.requires_integration_delta_lead_review === true ||
        baseDrift.requires_human_reauthorization === true ||
        asArray(integration.failures).length > 0
      ) {
        throw new Error(`${decision.route} requires valid integration authorization proof`);
      }
    }
    if (
      decision.proof.lead_reviewed_sha !== decision.reviewed_pr.head_sha &&
      decision.proof.lead_review_integration_authorization_inherited !== true
    ) {
      const tailPaths = uniqueStrings(asArray(decision.proof.post_lead_review_changed_paths).map(normalizePath));
      if (tailPaths.length === 0 || !tailPaths.every(isEvidenceTailPath)) {
        throw new Error(`${decision.route} requires verified evidence-only tail paths`);
      }
    }
  }
  return true;
}

function decisionMarker(decision) {
  validateDecision(decision);
  return `<!-- 4veco-pr-readiness:${decision.reviewed_pr.repo}:${decision.reviewed_pr.number}:${decision.reviewed_pr.head_sha} -->`;
}

function parseRenderedDecisionMarkdown(body) {
  const text = String(body || '');
  const marker = text.match(/<!--\s*4veco-pr-readiness:([^:]+\/[^:]+):(\d+):([a-f0-9]{40})\s*-->/i);
  if (!marker) throw new Error('PR readiness marker not found');
  const digestMatch = text.match(/Decision digest:\s*`sha256:([a-f0-9]{64})`/i);
  if (!digestMatch) throw new Error('PR readiness decision digest not found');
  const machineBlock = text.match(/## Machine Decision\s+```json\s*([\s\S]*?)```/i);
  if (!machineBlock) throw new Error('machine-readable PR readiness decision not found');
  const decision = JSON.parse(machineBlock[1]);
  validateDecision(decision);
  const expectedMarker = decisionMarker(decision);
  if (!text.includes(expectedMarker)) throw new Error('PR readiness marker does not match machine decision');
  if (marker[1] !== decision.reviewed_pr.repo) throw new Error('PR readiness marker repository mismatch');
  if (Number(marker[2]) !== decision.reviewed_pr.number) throw new Error('PR readiness marker PR number mismatch');
  if (marker[3] !== decision.reviewed_pr.head_sha) throw new Error('PR readiness marker head mismatch');
  const digest = decisionDigest(decision);
  if (digestMatch[1] !== digest) throw new Error('PR readiness decision digest mismatch');
  return { decision, digest, marker: expectedMarker };
}

function renderDecisionMarkdown(decision) {
  validateDecision(decision);
  const digest = decisionDigest(decision);
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
    `- Decision digest: \`sha256:${digest}\``,
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
  lines.push(
    '',
    '## Proof Summary',
    '',
    `- CI head: \`${decision.proof.ci_head_sha || 'missing'}\``,
    `- CI status: \`${decision.proof.ci_status || 'missing'}\``,
    `- Required CI contexts: ${(decision.proof.ci_required_contexts || []).map((item) => `\`${item}\``).join(', ') || 'none recorded'}`,
    `- Checker proof: ${(decision.proof.checkers || []).map((checker) => `\`${checker.command || 'unknown'}:${checker.status || checker.conclusion || checker.result || 'unknown'}\``).join(', ') || 'none recorded'}`,
    `- Lead review: \`${decision.proof.lead_review_path || 'missing'}\` / \`${decision.proof.lead_review_result || 'missing'}\` at \`${decision.proof.lead_reviewed_sha || 'missing'}\``,
    `- Evidence-only tail allowed: \`${Boolean(decision.proof.lead_review_evidence_tail_allowed)}\``,
    `- Integration authorization inherited for lead review: \`${Boolean(decision.proof.lead_review_integration_authorization_inherited)}\``,
    `- Branch protection: \`${JSON.stringify(decision.proof.branch_protection || {})}\``
  );
  if (decision.proof.human_authorization) {
    lines.push(`- Human payload authorization: \`${JSON.stringify(decision.proof.human_authorization)}\``);
  }
  if (decision.proof.integration) {
    lines.push(`- Integration proof: \`${JSON.stringify(decision.proof.integration)}\``);
  }
  lines.push(
    '',
    '## Machine Decision',
    '',
    '```json',
    JSON.stringify(decision, null, 2),
    '```',
    ''
  );
  return `${lines.join('\n')}\n`;
}

module.exports = {
  ALLOWED_TRANSITIONS,
  ROUTES,
  classifyPrReadiness,
  decisionDigest,
  decisionMarker,
  normalizeEvidence,
  parseRenderedDecisionMarkdown,
  renderDecisionMarkdown,
  validateDecision,
};
