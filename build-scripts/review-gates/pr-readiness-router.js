const {
  isEvidenceTailPath,
  isGovernanceSurface,
  normalizePath,
} = require('./pr-readiness-governance-surfaces');
const {
  validateCompatibilityProof,
  validateIntegrationRefreshProof,
} = require('./cross-repo-bundle-compatibility');
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
  const headSha = item.head_sha || item.headRefOid || null;
  const mergeCommitSha = item.merge_commit_sha || item.merge_commit || item.mergeCommitSha ||
    (item.mergeCommit && item.mergeCommit.oid) || null;
  const normalized = {
    ...item,
    repository: item.repository || item.repo || null,
    pr_number: positiveInteger(item.pr_number || item.number),
    base: item.base || item.baseRefName || item.base_branch || null,
    head_sha: headSha,
    integration_head_sha: item.integration_head_sha || item.integrationHeadSha || headSha,
    reviewed_payload_head_sha: item.reviewed_payload_head_sha || item.payload_head_sha || null,
  };
  if (mergeCommitSha) normalized.merge_commit_sha = mergeCommitSha;
  else delete normalized.merge_commit_sha;
  return normalized;
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
  const integrationHead = member && (member.integration_head_sha || member.head_sha);
  const reviewedHead = member && member.reviewed_payload_head_sha;
  if (
    member &&
    SHA_PATTERN.test(String(member.head_sha || '')) &&
    SHA_PATTERN.test(String(integrationHead || '')) &&
    member.head_sha === integrationHead &&
    member.authorization_inherited === true &&
    SHA_PATTERN.test(String(reviewedHead || '')) &&
    reviewedHead !== integrationHead
  ) {
    const failures = asArray(member.failures || (member.lineage && member.lineage.failures));
    return failures.length === 0;
  }
  return Boolean(
    member &&
      SHA_PATTERN.test(String(member.head_sha || '')) &&
      SHA_PATTERN.test(String(member.reviewed_payload_head_sha || '')) &&
      member.head_sha === member.reviewed_payload_head_sha
  );
}

function bundleMemberLifecycleOk(member) {
  const mergeCommit = member && (
    member.merge_commit ||
    member.merge_commit_sha ||
    member.mergeCommitSha ||
    (member.mergeCommit && member.mergeCommit.oid)
  );
  const mergedOk = Boolean(
    member &&
      member.merged === true &&
      member.open === false &&
      member.current === true &&
      SHA_PATTERN.test(String(mergeCommit || '')) &&
      bundleMemberHeadMatches(member)
  );
  return Boolean(
    mergedOk ||
      (member &&
        member.open === true &&
        member.merged !== true &&
        !mergeCommit &&
        member.current === true &&
        member.mergeable === true &&
        bundleMemberHeadMatches(member))
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
  const candidateHead = (member) => member && (member.integration_head_sha || member.head_sha || member.reviewed_payload_head_sha);
  return {
    platform_base_sha: explicit.platform_base_sha || explicit.platformBaseSha || raw.platform_base_sha || raw.platformBaseSha || null,
    platform_candidate_sha:
      explicit.platform_candidate_sha ||
      explicit.platformCandidateSha ||
      raw.platform_candidate_sha ||
      raw.platformCandidateSha ||
      candidateHead(platformMember) ||
      null,
    lesson_base_sha: explicit.lesson_base_sha || explicit.lessonBaseSha || raw.lesson_base_sha || raw.lessonBaseSha || null,
    lesson_candidate_sha:
      candidateHead(lessonMember) ||
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

function collectDeclaredExactMemberMismatches(raw, exactMembers, options = {}) {
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
      if (key === 'platform_candidate_sha' && options.integrationRefreshOk === true) continue;
      mismatches.push(`${key}_does_not_match_member_head`);
    }
  }
  return mismatches;
}

function normalizeReadinessOperation(raw) {
  const operation = raw.readiness_operation || raw.readinessOperation || raw.coordinated_readiness || {};
  const kind = operation.kind || operation.operation || null;
  const coordinatedMarkReady =
    kind === 'coordinated_mark_ready' ||
    operation.coordinated_mark_ready === true ||
    raw.coordinated_mark_ready === true;
  return {
    ...operation,
    operation: coordinatedMarkReady ? 'coordinated_mark_ready' : kind,
    coordinated_mark_ready: coordinatedMarkReady,
    both_draft_substantively_ready:
      operation.both_draft_substantively_ready === true ||
      raw.both_draft_substantively_ready === true,
    members: asArray(operation.members || raw.readiness_members).map(normalizeBundleMember),
  };
}

function memberKey(member) {
  if (!member || !member.repository || !member.pr_number) return null;
  return `${member.repository}#${member.pr_number}`;
}

function findOperationMember(operation, member) {
  const key = memberKey(member);
  if (!key) return null;
  return (operation.members || []).find((item) => memberKey(item) === key) || null;
}

function memberReadinessFlag(member) {
  return Boolean(
    member &&
      (member.substantively_ready === true ||
        member.ready_for_coordinated_mark_ready === true)
  );
}

function memberCarriesExactHeadReadiness(member) {
  const item = normalizeBundleMember(member);
  return Boolean(
    memberReadinessFlag(item) &&
      SHA_PATTERN.test(String(item.head_sha || '')) &&
      SHA_PATTERN.test(String(item.reviewed_payload_head_sha || '')) &&
      item.head_sha === item.reviewed_payload_head_sha
  );
}

function coordinatedMarkReadyMemberProof(operation, member) {
  if (
    !operation ||
    operation.coordinated_mark_ready !== true ||
    operation.both_draft_substantively_ready !== true
  ) {
    return { ok: false, failures: [] };
  }
  const operationMember = findOperationMember(operation, member);
  const selfReady = memberCarriesExactHeadReadiness(member);
  const failures = [];
  let operationReady = false;

  if (memberReadinessFlag(operationMember)) {
    const operationHead = operationMember.head_sha;
    const operationReviewedHead = operationMember.reviewed_payload_head_sha;
    const headValid = SHA_PATTERN.test(String(operationHead || ''));
    const reviewedHeadValid = SHA_PATTERN.test(String(operationReviewedHead || ''));

    if (!headValid || !reviewedHeadValid) {
      if (!selfReady) failures.push('readiness_member_exact_head_missing');
    }
    if (headValid && member.head_sha && operationHead !== member.head_sha) {
      failures.push('readiness_member_head_mismatch');
    }
    if (
      reviewedHeadValid &&
      member.reviewed_payload_head_sha &&
      operationReviewedHead !== member.reviewed_payload_head_sha
    ) {
      failures.push('readiness_member_reviewed_payload_head_mismatch');
    }
    operationReady = headValid && reviewedHeadValid && failures.length === 0;
  }

  return {
    ok: (selfReady || operationReady) && failures.length === 0,
    failures: uniqueStrings(failures),
  };
}

function memberSubstantivelyReadyForCoordinatedMarkReady(operation, member) {
  return coordinatedMarkReadyMemberProof(operation, member).ok;
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
  const readinessOperation = normalizeReadinessOperation(raw);
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
    if (
      controller.reviewed_payload_head_sha &&
      controller.reviewed_payload_head_sha !== evidence.reviewed_pr.head_sha &&
      !bundleMemberHeadMatches({ ...controller, head_sha: evidence.reviewed_pr.head_sha, integration_head_sha: evidence.reviewed_pr.head_sha })
    ) {
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
        !bundleMemberHeadMatches({ ...currentMember, head_sha: evidence.reviewed_pr.head_sha, integration_head_sha: evidence.reviewed_pr.head_sha })
      ) {
        failures.push('bundle_member_head_mismatch');
      }
    }
  }
  if (pairedPrs.length === 0) failures.push('paired_prs_missing');
  const pairedLessonMembers = pairedPrs.filter((member) => repoIsLesson(member.repository));
  const platformController = !delegated && repoIsPlatform(evidence.reviewed_pr.repo);
  if (platformController && (pairedPrs.length !== 1 || pairedLessonMembers.length !== 1)) {
    failures.push('paired_lesson_member_count_invalid');
  }
  for (const paired of pairedPrs) {
    if (!bundleMemberComplete(paired)) failures.push('paired_pr_metadata_incomplete');
    const coordinatedProof = coordinatedMarkReadyMemberProof(readinessOperation, paired);
    failures.push(...coordinatedProof.failures);
    if (paired && !paired.base) failures.push('paired_pr_base_missing');
    if (paired && paired.reviewed_payload_head_sha && paired.head_sha && !bundleMemberHeadMatches(paired)) {
      failures.push('paired_pr_head_mismatch');
    }
  }
  if (raw.complete === false) failures.push('bundle_incomplete');
  const currentMember = delegated ? normalizeBundleMember(raw.current_member || raw.current_pr || raw.member || {}) : null;
  const exactMembers = bundleExpectedExactMembers(raw, controller, currentMember, pairedPrs);
  const exactMemberFailures = collectExactMemberFailures(exactMembers);
  failures.push(...exactMemberFailures);
  if (
    controller.reviewed_payload_head_sha &&
    exactMembers.platform_candidate_sha &&
    controller.reviewed_payload_head_sha !== exactMembers.platform_candidate_sha
  ) {
    failures.push('platform_candidate_sha_does_not_match_member_head');
  }
  const compatibilityRaw = raw.compatibility || raw.compatibility_matrix || raw.bundle_compatibility || proof.bundle_compatibility;
  const compatibility = compatibilityRaw
    ? validateCompatibilityProof(compatibilityRaw, {
        bundleId: bundleId || undefined,
        exactMembers,
      })
    : { ok: false, failures: ['bundle_compatibility_missing'] };
  if (!compatibility.ok) failures.push(...compatibility.failures);
  const platformHead = controller.integration_head_sha || controller.head_sha || null;
  const lessonMember = findBundleMemberByRepo([currentMember, ...pairedPrs].filter(Boolean), repoIsLesson);
  const lessonMergeSha = lessonMember && (
    lessonMember.merge_commit ||
    lessonMember.merge_commit_sha ||
    lessonMember.mergeCommitSha ||
    (lessonMember.mergeCommit && lessonMember.mergeCommit.oid)
  );
  const integrationRefreshRaw = raw.integration_refresh || raw.integrationRefresh || null;
  const integrationRefreshRequired = Boolean(
    platformHead &&
    exactMembers.platform_candidate_sha &&
    platformHead !== exactMembers.platform_candidate_sha
  );
  const integrationRefresh = integrationRefreshRaw
    ? validateIntegrationRefreshProof(integrationRefreshRaw, {
        compatibility,
        controllerHead: platformHead,
        lessonMergeSha: lessonMergeSha || undefined,
      })
    : { ok: false, failures: ['integration_refresh missing'], proof: null };
  if (integrationRefreshRequired && !integrationRefresh.ok) failures.push(...integrationRefresh.failures);
  if (!integrationRefreshRequired && integrationRefreshRaw && !integrationRefresh.ok) failures.push(...integrationRefresh.failures);
  failures.push(...collectDeclaredExactMemberMismatches(raw, exactMembers, {
    integrationRefreshOk: integrationRefreshRequired && integrationRefresh.ok,
  }));
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
    const coordinatedTransitionable = coordinatedMarkReadyMemberProof(readinessOperation, paired).ok;
    const controllerTransitionable = controllerFirstDraftTransitionable(paired, transitionContext);
    const transitionable = coordinatedTransitionable || controllerTransitionable;
    const lifecycleOk = bundleMemberLifecycleOk(paired);
    if (transitionable) {
      transitionableDraftMembers.push({
        repository: paired.repository,
        pr_number: paired.pr_number,
        base: paired.base || null,
        head_sha: paired.head_sha,
        reviewed_payload_head_sha: paired.reviewed_payload_head_sha,
        reason: coordinatedTransitionable ? 'coordinated_mark_ready' : 'controller_first_mark_ready',
      });
    }
    if (paired && paired.is_draft === true && !transitionable) failures.push('paired_pr_draft');
    if (paired && (!lifecycleOk || paired.ready !== true) && !transitionable) {
      failures.push('paired_pr_not_ready');
    }
  }
  if (platformController && pairedLessonMembers.length === 1) {
    const lesson = pairedLessonMembers[0];
    const lessonSha = exactMembers.lesson_candidate_sha;
    if (
      lesson.head_sha !== lessonSha ||
      lesson.integration_head_sha !== lessonSha ||
      lesson.reviewed_payload_head_sha !== lessonSha
    ) {
      failures.push('lesson_candidate_sha_does_not_match_member_head');
    }
    const lessonLeadReviews = pairedLeadReviews.filter((review) =>
      repoIsLesson(review.repository) && review.pr_number === lesson.pr_number
    );
    if (
      lessonLeadReviews.length !== 1 ||
      lessonLeadReviews[0].reviewed_commit_sha !== lessonSha
    ) {
      failures.push('paired_lesson_lead_review_missing_or_invalid');
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
    current_member: currentMember,
    paired_prs: pairedPrs,
    exact_members: exactMembers,
    compatibility,
    readiness_operation: readinessOperation.coordinated_mark_ready ? readinessOperation : null,
    transition_ready: transitionReady,
    merge_ready: mergeReady,
    transitionable_draft_members: transitionableDraftMembers,
    paired_lead_reviews: pairedLeadReviews,
    failures: uniqueStrings(failures),
  };
  if (integrationRefreshRaw) {
    summary.integration_refresh = integrationRefreshRaw;
    summary.integration_refresh_validation = integrationRefresh;
  }
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

function integrationDeltaReviewRequired(integrationProof) {
  const integration = integrationProof || {};
  const baseDrift = integration.base_drift || {};
  return Boolean(
    integration.requires_integration_delta_lead_review === true ||
    baseDrift.requires_integration_delta_lead_review === true
  );
}

function leadProof(proof, headSha) {
  const lead = proof.lead_review || {};
  const result = normalizeVerdict(lead.result);
  const reviewedSha = lead.reviewed_commit_sha || lead.reviewed_sha || lead.reviewed_remote_commit_sha;
  const afterLeadPaths = uniqueStrings(
    asArray(proof.post_lead_review_changed_paths).map(normalizePath)
  );
  const evidenceOnlyTail =
    reviewedSha &&
    reviewedSha !== headSha &&
    afterLeadPaths.length > 0 &&
    afterLeadPaths.every(isEvidenceTailPath);
  const integrationAuthorizedTail = integrationLeadAuthorizationProof(proof, reviewedSha, headSha);
  const integration = proof.integration || {};
  const deltaReviewRequired = integrationDeltaReviewRequired(integration);
  const deltaReviewPresent = Boolean(integration.delta_review);
  const deltaReviewComplete = integrationDeltaReviewComplete(
    integration.delta_review,
    integration.reviewed_payload_head_sha,
    headSha
  );
  const integrationDeltaReviewedTail = Boolean(
    reviewedSha &&
      reviewedSha !== headSha &&
      reviewedSha === integration.reviewed_payload_head_sha &&
      integration.ok === true &&
      integration.authorization_inherited === true &&
      integrationFailures(integration).length === 0 &&
      deltaReviewRequired &&
      deltaReviewComplete
  );
  const unexpectedDeltaReview = deltaReviewPresent && !deltaReviewRequired;

  return {
    ok: Boolean(
      !unexpectedDeltaReview &&
        lead.path &&
        PASSING_LEAD_RESULTS.has(result) &&
        reviewedSha &&
        (reviewedSha === headSha || evidenceOnlyTail || integrationAuthorizedTail || integrationDeltaReviewedTail)
    ),
    stale: Boolean(
      reviewedSha &&
        headSha &&
        reviewedSha !== headSha &&
        !evidenceOnlyTail &&
        !integrationAuthorizedTail &&
        !integrationDeltaReviewedTail
    ),
    evidenceOnlyTail,
    integrationAuthorizedTail,
    integrationDeltaReviewedTail,
    deltaReviewRequired,
    deltaReviewComplete,
    unexpectedDeltaReview,
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
  if (lead.unexpectedDeltaReview) reasons.push('integration_delta_review_unexpected');
  if (lead.deltaReviewRequired && !lead.deltaReviewComplete) {
    reasons.push('integration_delta_review_missing_or_invalid');
  }
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
    lead_review_integration_delta_reviewed: collected.lead.integrationDeltaReviewedTail,
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
  const bundleProof = decision.proof.bundle || {};
  const compatibilityValidation = bundleProof.compatibility
    ? validateCompatibilityProof(bundleProof.compatibility)
    : { ok: false, failures: ['bundle_compatibility_missing'], exact_members: {} };
  const compatibilityExact = compatibilityValidation.exact_members || {};
  const declaredExact = bundleProof.exact_members || {};
  const controllerProof = bundleProof.controller || {};
  const platformReadyBundle = Boolean(
    [ROUTES.READY_FOR_LEAD_ONLY, ROUTES.READY_FOR_HUMAN_REVIEW].includes(decision.route) &&
    repoIsPlatform(decision.reviewed_pr.repo) &&
    decision.throughput.class === 'cross_repo_bundle'
  );
  if (platformReadyBundle) {
    if (!compatibilityValidation.ok) {
      throw new Error(`ready platform bundle compatibility invalid: ${compatibilityValidation.failures.join(', ')}`);
    }
    const exactKeys = [
      'platform_base_sha',
      'platform_candidate_sha',
      'lesson_base_sha',
      'lesson_candidate_sha',
    ];
    if (!exactKeys.every((key) => SHA_PATTERN.test(String(compatibilityExact[key] || '')))) {
      throw new Error('ready platform bundle requires compatibility exact_members');
    }
    if (!exactKeys.every((key) => declaredExact[key] === compatibilityExact[key])) {
      throw new Error('ready platform bundle exact_members must match compatibility');
    }
    if (controllerProof.reviewed_payload_head_sha !== compatibilityExact.platform_candidate_sha) {
      throw new Error('ready platform bundle controller payload must match compatibility');
    }
    if (decision.proof.lead_reviewed_sha !== compatibilityExact.platform_candidate_sha) {
      throw new Error('ready platform bundle lead-reviewed payload must match compatibility');
    }
    const integrationProof = decision.proof.integration || {};
    const deltaReviewRequired = integrationDeltaReviewRequired(integrationProof);
    const deltaReviewPresent = Boolean(integrationProof.delta_review);
    const deltaReviewComplete = integrationDeltaReviewComplete(
      integrationProof.delta_review,
      compatibilityExact.platform_candidate_sha,
      decision.reviewed_pr.head_sha
    );
    if (deltaReviewRequired && !deltaReviewComplete) {
      throw new Error('ready platform bundle requires valid integration delta review');
    }
    if (!deltaReviewRequired && deltaReviewPresent) {
      throw new Error('ready platform bundle integration delta review is unexpected');
    }
    const pairedMembers = asArray(bundleProof.paired_prs);
    const lessonMembers = pairedMembers.filter((member) =>
      repoIsLesson(member.repository || member.repo)
    );
    if (pairedMembers.length !== 1 || lessonMembers.length !== 1) {
      throw new Error('ready platform bundle requires exactly one paired lesson member and no other paired members');
    }
    const lesson = normalizeBundleMember(lessonMembers[0]);
    if (
      lesson.head_sha !== compatibilityExact.lesson_candidate_sha ||
      lesson.integration_head_sha !== compatibilityExact.lesson_candidate_sha ||
      lesson.reviewed_payload_head_sha !== compatibilityExact.lesson_candidate_sha
    ) {
      throw new Error('ready platform bundle lesson payload must match compatibility');
    }
    const pairedLeadReviews = asArray(bundleProof.paired_lead_reviews);
    const lessonLeadReviews = pairedLeadReviews.filter((review) =>
      repoIsLesson(review.repository || review.repo) &&
      positiveInteger(review.pr_number || review.number) === lesson.pr_number
    );
    if (
      pairedLeadReviews.length !== 1 ||
      lessonLeadReviews.length !== 1 ||
      lessonLeadReviews[0].reviewed_commit_sha !== compatibilityExact.lesson_candidate_sha ||
      !PASSING_LEAD_RESULTS.has(normalizeVerdict(lessonLeadReviews[0].review_result)) ||
      typeof lessonLeadReviews[0].review_path !== 'string' ||
      !lessonLeadReviews[0].review_path.trim()
    ) {
      throw new Error('ready platform bundle lesson lead review must match compatibility');
    }
  }
  const refreshRequired = Boolean(
    platformReadyBundle &&
    decision.reviewed_pr.head_sha !== compatibilityExact.platform_candidate_sha
  );
  if (refreshRequired && !bundleProof.integration_refresh) {
    throw new Error('refreshed platform decision requires integration_refresh proof');
  }
  if (
    refreshRequired &&
    (!decision.proof.integration ||
      decision.proof.integration.reviewed_payload_head_sha !== compatibilityExact.platform_candidate_sha)
  ) {
    throw new Error('refreshed platform decision integration payload must match compatibility');
  }
  if (bundleProof.integration_refresh) {
    const lesson = findBundleMemberByRepo(asArray(bundleProof.paired_prs), repoIsLesson);
    const lessonMergeSha = lesson && (
      lesson.merge_commit ||
      lesson.merge_commit_sha ||
      lesson.mergeCommitSha ||
      (lesson.mergeCommit && lesson.mergeCommit.oid)
    );
    const refreshValidation = validateIntegrationRefreshProof(bundleProof.integration_refresh, {
      compatibility: bundleProof.compatibility,
      controllerHead: decision.reviewed_pr.head_sha,
      lessonMergeSha: lessonMergeSha || undefined,
      readinessDecision: decision,
    });
    if (!refreshValidation.ok) {
      const reasons = asArray(decision.reason_codes).join(', ') || 'none';
      throw new Error(
        `integration_refresh decision binding invalid: ${refreshValidation.failures.join(', ')}; ` +
        `decision reasons: ${reasons}`
      );
    }
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
      decision.proof.lead_review_integration_authorization_inherited !== true &&
      decision.proof.lead_review_integration_delta_reviewed !== true
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
    if (decision.proof.lead_review_integration_delta_reviewed === true) {
      const integration = decision.proof.integration || {};
      if (
        decision.proof.lead_reviewed_sha !== integration.reviewed_payload_head_sha ||
        integration.ok !== true ||
        integration.authorization_inherited !== true ||
        integrationFailures(integration).length > 0 ||
        !integrationDeltaReviewRequired(integration) ||
        !integrationDeltaReviewComplete(
          integration.delta_review,
          decision.proof.lead_reviewed_sha,
          decision.reviewed_pr.head_sha
        )
      ) {
        throw new Error(`${decision.route} requires valid integration delta review proof`);
      }
    }
    if (
      decision.proof.lead_reviewed_sha !== decision.reviewed_pr.head_sha &&
      decision.proof.lead_review_integration_authorization_inherited !== true &&
      decision.proof.lead_review_integration_delta_reviewed !== true
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

function statusOrUnknown(value) {
  const text = String(value || '').trim();
  return text || 'unknown';
}

function includesAny(values, candidates) {
  const haystack = asArray(values).map((value) => String(value || ''));
  return candidates.some((candidate) => haystack.includes(candidate));
}

function integrationFailures(integrationProof) {
  return asArray(
    integrationProof.failures ||
      (integrationProof.lineage && integrationProof.lineage.failures) ||
      []
  );
}

function passingReviewResult(value) {
  return PASSING_LEAD_RESULTS.has(normalizeVerdict(value));
}

function integrationDeltaReviewComplete(deltaReview, reviewedPayloadHead, integrationHead) {
  const review = deltaReview || {};
  const reviewedHead = review.integration_head_sha || review.reviewed_integration_head_sha;
  return Boolean(
    review &&
      typeof review === 'object' &&
      passingReviewResult(review.result || review.verdict || review.status) &&
      review.reviewed_payload_head_sha === reviewedPayloadHead &&
      reviewedHead === integrationHead &&
      (review.path || review.review_path)
  );
}

function integrationLineageProofComplete(integrationProof, currentHeadSha) {
  const integration = integrationProof || {};
  const lineageStatus = String(integration.lineage_status || '').trim().toLowerCase();
  const effectivePayloadStatus = String(integration.effective_payload_status || '').trim().toLowerCase();
  const bundleMembershipStatus = String(integration.bundle_membership_status || '').trim().toLowerCase();
  const authorityScopeStatus = String(integration.authority_scope_status || '').trim().toLowerCase();
  const lineagePositive =
    integration.payload_ancestor_of_integration_head === true ||
    lineageStatus === 'valid';
  const effectivePayloadPositive =
    !effectivePayloadStatus ||
    effectivePayloadStatus === 'unchanged';
  const bundleMembershipPositive =
    !bundleMembershipStatus ||
    bundleMembershipStatus === 'unchanged' ||
    bundleMembershipStatus === 'not_bundle';
  const authorityScopePositive =
    !authorityScopeStatus ||
    authorityScopeStatus === 'unchanged';
  return Boolean(
    integration.ok === true &&
      SHA_PATTERN.test(String(integration.reviewed_payload_head_sha || '')) &&
      SHA_PATTERN.test(String(integration.integration_head_sha || '')) &&
      integration.integration_head_sha === currentHeadSha &&
      integration.authorization_inherited === true &&
      lineagePositive &&
      effectivePayloadPositive &&
      bundleMembershipPositive &&
      authorityScopePositive
  );
}

function statusFromIntegration(integrationProof, key, inheritedStatus) {
  const direct = integrationProof[key];
  if (direct) return direct;
  const nestedKey = key.replace(/_status$/, '');
  if (integrationProof[nestedKey] && integrationProof[nestedKey].status) return integrationProof[nestedKey].status;
  return inheritedStatus || 'unknown';
}

function payloadIntegrationStateSummary(decision) {
  const proof = decision.proof || {};
  const integration = proof.integration || {};
  const authorization = proof.human_authorization || {};
  const failures = integrationFailures(integration);
  const reviewedPayloadHead =
    integration.reviewed_payload_head_sha ||
    authorization.reviewed_payload_head_sha ||
    decision.reviewed_pr.head_sha;
  const integrationHead = integration.integration_head_sha || decision.reviewed_pr.head_sha;
  const baseDrift = integration.base_drift || {};
  const bundle = proof.bundle || {};
  const bundleRequired = Boolean(bundle.required || bundle.delegated || (bundle.summary && bundle.summary.required));
  const integrationProofPresent = Object.keys(integration).length > 0;
  const branchUpdatePending = integration.branch_update_pending === true;
  const lineageInvalid = includesAny(failures, [
    'reviewed_payload_head_sha missing or invalid',
    'integration_head_sha missing or invalid',
    'reviewed_payload_head_not_ancestor',
    'reviewed_payload_not_ancestor',
    'lineage_invalid',
    'rebase_or_force_push_detected',
    'manual_conflict_resolution',
    'merge_changed_payload_or_unexpected_paths',
    'substantive_pr_authored_commit_after_authorization',
  ]);
  const effectivePayloadChanged = includesAny(failures, ['changed_effective_payload', 'effective_payload_changed']);
  const bundleMembershipChanged = includesAny(failures, ['bundle_membership_change', 'bundle_membership_changed']);
  const authorityScopeChanged = includesAny(failures, ['authority_or_scope_change', 'authority_scope_changed']);
  const reauthorizationRequired =
    integration.requires_human_reauthorization === true ||
    baseDrift.requires_human_reauthorization === true ||
    failures.length > 0;
  const deterministicRefreshRequired =
    integration.requires_deterministic_refresh === true ||
    baseDrift.requires_deterministic_refresh === true;
  const deterministicRefreshComplete = !deterministicRefreshRequired || integration.deterministic_refresh_verified === true;
  const deltaReviewRequired =
    integration.requires_integration_delta_lead_review === true ||
    baseDrift.requires_integration_delta_lead_review === true;
  const deltaReviewComplete =
    !deltaReviewRequired ||
    integrationDeltaReviewComplete(integration.delta_review, reviewedPayloadHead, integrationHead);
  const readyRoute = decision.route === ROUTES.READY_FOR_LEAD_ONLY || decision.route === ROUTES.READY_FOR_HUMAN_REVIEW;
  const humanRoute = decision.route === ROUTES.READY_FOR_HUMAN_REVIEW;
  const authorizationInherited = integrationProofPresent && integration.authorization_inherited === true;
  const integrationProofComplete = integrationLineageProofComplete(integration, decision.reviewed_pr.head_sha);
  const integrationProofPassed = Boolean(
    readyRoute &&
      integrationProofPresent &&
      !branchUpdatePending &&
      integrationProofComplete &&
      failures.length === 0 &&
      deterministicRefreshComplete &&
      deltaReviewComplete
  );
  const payloadAuthorization =
    reauthorizationRequired
      ? 'invalidated'
      : authorization.decision || authorizationInherited
        ? 'inherited'
        : humanRoute
          ? 'required'
          : 'not_required';
  let payloadState = 'PAYLOAD_AUTHORIZATION_REQUIRED';
  if (reauthorizationRequired) payloadState = 'PAYLOAD_REAUTHORIZATION_REQUIRED';
  else if (payloadAuthorization === 'inherited' || payloadAuthorization === 'not_required') payloadState = 'PAYLOAD_AUTHORIZED';

  let integrationState = 'INTEGRATION_VALIDATION_REQUIRED';
  if (reauthorizationRequired) integrationState = 'PAYLOAD_REAUTHORIZATION_REQUIRED';
  else if (branchUpdatePending) {
    integrationState = 'BRANCH_UPDATE_PENDING';
  } else if (deltaReviewRequired && !deltaReviewComplete) {
    integrationState = 'INTEGRATION_DELTA_REVIEW_REQUIRED';
  } else if (deterministicRefreshRequired && !deterministicRefreshComplete) {
    integrationState = 'DETERMINISTIC_REFRESH_REQUIRED';
  } else if (integrationProofPassed) {
    integrationState = 'READY_TO_MERGE_VIA_LANE';
  } else if (!integrationProofPresent && integrationHead !== reviewedPayloadHead && readyRoute) {
    integrationState = 'INTEGRATION_HEAD_REFRESHED';
  }

  const lineageStatus = lineageInvalid
    ? 'invalid'
    : statusFromIntegration(integration, 'lineage_status', authorizationInherited ? 'valid' : null);
  const effectivePayloadStatus = effectivePayloadChanged
    ? 'changed'
    : statusFromIntegration(integration, 'effective_payload_status', authorizationInherited ? 'unchanged' : null);
  const bundleMembershipStatus = !bundleRequired
    ? 'not_bundle'
    : bundleMembershipChanged
      ? 'changed'
      : statusFromIntegration(integration, 'bundle_membership_status', authorizationInherited ? 'unchanged' : null);
  const authorityScopeStatus = authorityScopeChanged
    ? 'changed'
    : statusFromIntegration(integration, 'authority_scope_status', authorizationInherited ? 'unchanged' : null);
  let integrationValidation = 'required';
  if (!readyRoute || reauthorizationRequired) integrationValidation = 'blocked';
  else if (branchUpdatePending) integrationValidation = 'pending_branch_update';
  else if (deltaReviewRequired && !deltaReviewComplete) integrationValidation = 'pending_delta_review';
  else if (deterministicRefreshRequired && !deterministicRefreshComplete) integrationValidation = 'pending_deterministic_refresh';
  else if (integrationProofPassed) integrationValidation = 'passed';

  let requiredNextAction = 'resolve readiness blockers before merge';
  if (payloadState === 'PAYLOAD_AUTHORIZATION_REQUIRED') {
    requiredNextAction = 'request owner payload authorization for the reviewed payload head and decision scope';
  } else if (payloadState === 'PAYLOAD_REAUTHORIZATION_REQUIRED') {
    requiredNextAction = 'return to owner review for refreshed payload authorization';
  } else if (integrationState === 'BRANCH_UPDATE_PENDING') {
    requiredNextAction = 'wait for the branch update to finish, then rerun the serialized integration lane';
  } else if (integrationState === 'INTEGRATION_DELTA_REVIEW_REQUIRED') {
    requiredNextAction = 'run integration delta lead review before merge';
  } else if (integrationState === 'DETERMINISTIC_REFRESH_REQUIRED') {
    requiredNextAction = 'run deterministic evidence refresh before merge';
  } else if (integrationState === 'READY_TO_MERGE_VIA_LANE') {
    requiredNextAction = 'merge through the serialized integration lane';
  } else if (integrationState === 'INTEGRATION_HEAD_REFRESHED') {
    requiredNextAction = 'run integration validation for the refreshed integration head';
  } else if (readyRoute) {
    requiredNextAction = 'complete integration validation through the serialized lane';
  }

  return {
    payload_state: payloadState,
    integration_state: integrationState,
    reviewed_payload_head_sha: reviewedPayloadHead,
    current_pr_head_sha: decision.reviewed_pr.head_sha || null,
    integration_head_sha: integrationHead,
    pending_integration_head_sha: integration.pending_integration_head_sha || integration.refreshed_head_sha || null,
    base_sha_at_review: authorization.base_sha_at_review || integration.base_sha_at_review || baseDrift.base_sha_at_review || null,
    current_base_sha: integration.current_base_sha || integration.current_main_sha || baseDrift.current_base_sha || null,
    lineage_status: lineageStatus,
    effective_payload_status: effectivePayloadStatus,
    bundle_membership_status: bundleMembershipStatus,
    authority_scope_status: authorityScopeStatus,
    payload_authorization: payloadAuthorization,
    integration_validation: integrationValidation,
    renewed_owner_authorization: reauthorizationRequired ? 'required' : 'not_required_unless_payload_changes',
    required_next_action: requiredNextAction,
  };
}

function memberLabel(member) {
  const item = member || {};
  const repo = item.repository || item.repo || 'unknown-repo';
  const number = item.pr_number || item.number || 'unknown';
  const head = item.head_sha || item.reviewed_payload_head_sha || 'unknown-head';
  return `${repo}#${number}@${head}`;
}

function compatibilityMergeOrder(compatibility) {
  if (!compatibility) return 'unavailable';
  if (compatibility.recommended_merge_order) return compatibility.recommended_merge_order;
  const orders = asArray(compatibility.permitted_merge_orders || compatibility.permitted_orders);
  if (orders.length > 0) return orders.join(', ');
  return 'none';
}

function bundleStateSummary(decision, hasBundlePayload) {
  const bundle = decision.proof.bundle || {};
  const summary = bundle.summary || bundle;
  if (!hasBundlePayload || !summary) return null;
  const controller = summary.controller || {};
  const paired = asArray(summary.paired_prs);
  const currentMember = summary.current_member || summary.current_pr || summary.member || null;
  const displayedMembers = summary.delegated === true && currentMember ? [currentMember] : paired;
  const mergedMembers = displayedMembers.filter((member) => member && member.merged === true);
  const openMembers = displayedMembers.filter((member) => member && member.open === true);
  const refreshContract = summary.compatibility && summary.compatibility.integration_contract;
  const refreshRequired = Boolean(
    refreshContract &&
    refreshContract.post_first_merge_refresh &&
    refreshContract.post_first_merge_refresh.required === true
  );
  const refreshValidation = summary.integration_refresh_validation || {};
  const refreshStatus = refreshRequired
    ? refreshValidation.ok === true ? 'complete' : 'required_after_lesson_merge'
    : 'not_required';
  let residualMode = 'full bundle';
  if (mergedMembers.length > 0 && openMembers.length === 0) {
    residualMode = 'platform-only residual controller';
  } else if (mergedMembers.length > 0 && openMembers.length > 0) {
    residualMode = 'lesson-first pending platform';
  } else if (!summary.ok || asArray(summary.failures).length > 0) {
    residualMode = 'blocked';
  }
  return {
    controller: controller.repository ? memberLabel(controller) : 'unknown',
    members: displayedMembers.map(memberLabel),
    merged_members: mergedMembers.map(memberLabel),
    open_members: openMembers.map(memberLabel),
    delegated_branch_protection_proof: summary.delegated ? 'controller' : 'none',
    merge_order_proof: compatibilityMergeOrder(summary.compatibility),
    post_first_merge_index_refresh: refreshStatus,
    residual_integration_mode: residualMode,
  };
}

function renderDecisionMarkdown(decision) {
  validateDecision(decision);
  const digest = decisionDigest(decision);
  const delegatedBundleProof = Boolean(decision.proof.bundle && decision.proof.bundle.delegated === true);
  const delegatedController = delegatedBundleProof ? decision.proof.bundle.controller || {} : {};
  const ciHeadLabel = delegatedBundleProof ? 'Controller CI head' : 'CI head';
  const ciStatusLabel = delegatedBundleProof ? 'Controller CI status' : 'CI status';
  const branchProtectionLabel = delegatedBundleProof ? 'Delegated branch protection' : 'Branch protection';
  const integrationProof = decision.proof.integration || {};
  const readyRoute = decision.route === ROUTES.READY_FOR_LEAD_ONLY || decision.route === ROUTES.READY_FOR_HUMAN_REVIEW;
  const bundleProof = decision.proof.bundle || null;
  const hasBundlePayload = Boolean(
    bundleProof &&
      (
        bundleProof.required === true ||
        bundleProof.delegated === true ||
        bundleProof.summary ||
        (decision.throughput && decision.throughput.class === 'cross_repo_bundle')
      )
  );
  const stateSummary = payloadIntegrationStateSummary(decision);
  const reviewedPayloadHead = stateSummary.reviewed_payload_head_sha || decision.reviewed_pr.head_sha;
  const integrationHead = stateSummary.integration_head_sha || decision.reviewed_pr.head_sha;
  const payloadAuthorizationRequired =
    decision.route === ROUTES.READY_FOR_HUMAN_REVIEW &&
    ['required', 'invalidated'].includes(stateSummary.payload_authorization);
  const integrationValidationRequired =
    readyRoute && stateSummary.integration_validation !== 'passed';
  const bundleState = bundleStateSummary(decision, hasBundlePayload);
  const leadReviewLine = delegatedBundleProof
    ? `- Delegated lead review: controller proof \`${decision.proof.lead_review_path || 'missing'}\` / \`${decision.proof.lead_review_result || 'missing'}\`; member reviewed payload head \`${decision.proof.lead_reviewed_sha || 'missing'}\``
    : `- Lead review: \`${decision.proof.lead_review_path || 'missing'}\` / \`${decision.proof.lead_review_result || 'missing'}\` at \`${decision.proof.lead_reviewed_sha || 'missing'}\``;
  const lines = [
    decisionMarker(decision),
    '# PR Readiness Decision',
    '',
    `- Route: \`${decision.route}\``,
    `- Allowed transition: \`${decision.allowed_transition}\``,
    `- Repository: \`${decision.reviewed_pr.repo}\``,
    `- PR: #${decision.reviewed_pr.number}`,
    `- Reviewed payload head: \`${reviewedPayloadHead}\``,
    `- Current PR head: \`${decision.reviewed_pr.head_sha}\``,
    `- Integration head: \`${integrationHead}\``,
    `- Payload authorization required: \`${payloadAuthorizationRequired}\``,
    `- Integration validation required: \`${integrationValidationRequired}\``,
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
    '## Authorization Model',
    '',
    '- Owner decisions authorize the reviewed payload head and decision scope.',
    '- The integration lane validates the current integration head before merge.',
    '- A later integration head does not require renewed owner authorization when the serialized lane proves payload lineage, effective-payload equivalence, unchanged bundle membership, and unchanged authority scope.',
    '- Substantive payload change, manual conflict resolution affecting behavior, changed bundle membership, or authority-scope change returns to owner review.'
  );
  if (hasBundlePayload) {
    lines.push(
      '- Bundle payload authorization is requested for the reviewed controller/member payload heads. The bundle lane will select/validate the integration heads and merge order before merging.'
    );
  }
  lines.push(
    '',
    '## Payload / Integration State',
    '',
    `- Payload state: \`${stateSummary.payload_state}\``,
    `- Integration state: \`${stateSummary.integration_state}\``,
    `- Reviewed payload head: \`${statusOrUnknown(stateSummary.reviewed_payload_head_sha)}\``,
    `- Current PR head: \`${statusOrUnknown(stateSummary.current_pr_head_sha)}\``,
    `- Integration head: \`${statusOrUnknown(stateSummary.integration_head_sha)}\``,
    `- Base at review: \`${statusOrUnknown(stateSummary.base_sha_at_review)}\``,
    `- Current base: \`${statusOrUnknown(stateSummary.current_base_sha)}\``,
    `- Payload lineage: \`${stateSummary.lineage_status}\``,
    `- Effective payload: \`${stateSummary.effective_payload_status}\``,
    `- Bundle membership: \`${stateSummary.bundle_membership_status}\``,
    `- Authority scope: \`${stateSummary.authority_scope_status}\``,
    `- Payload authorization: \`${stateSummary.payload_authorization}\``,
    `- Integration validation: \`${stateSummary.integration_validation}\``,
    `- Renewed owner authorization: \`${stateSummary.renewed_owner_authorization}\``,
    '- Renewed owner authorization is not required merely because the current PR head changed; it is required when payload lineage, effective payload, bundle membership, or authority scope changed.',
    `- Next action: ${stateSummary.required_next_action}`
  );
  if (bundleState) {
    lines.push(
      '',
      '## Bundle State',
      '',
      `- Controller PR/head: \`${bundleState.controller}\``,
      `- Member PR/head: ${bundleState.members.map((item) => `\`${item}\``).join(', ') || '`none`'}`,
      `- Merged members: ${bundleState.merged_members.map((item) => `\`${item}\``).join(', ') || '`none`'}`,
      `- Open members: ${bundleState.open_members.map((item) => `\`${item}\``).join(', ') || '`none`'}`,
      `- Delegated branch-protection proof: \`${bundleState.delegated_branch_protection_proof}\``,
      `- Merge order proof: \`${bundleState.merge_order_proof}\``,
      `- Post-first-merge index refresh: \`${bundleState.post_first_merge_index_refresh}\``,
      `- Residual integration mode: \`${bundleState.residual_integration_mode}\``
    );
  }
  lines.push(
    '',
    '## Proof Summary',
    '',
    ...(delegatedBundleProof
      ? [
          `- Delegated bundle controller proof: \`${delegatedController.repository || 'unknown'}#${delegatedController.pr_number || 'unknown'}\``,
        ]
      : []),
    `- ${ciHeadLabel}: \`${decision.proof.ci_head_sha || 'missing'}\``,
    `- ${ciStatusLabel}: \`${decision.proof.ci_status || 'missing'}\``,
    `- Required CI contexts: ${(decision.proof.ci_required_contexts || []).map((item) => `\`${item}\``).join(', ') || 'none recorded'}`,
    `- Checker proof: ${(decision.proof.checkers || []).map((checker) => `\`${checker.command || 'unknown'}:${checker.status || checker.conclusion || checker.result || 'unknown'}\``).join(', ') || 'none recorded'}`,
    leadReviewLine,
    `- Evidence-only tail allowed: \`${Boolean(decision.proof.lead_review_evidence_tail_allowed)}\``,
    `- Integration authorization inherited for lead review: \`${Boolean(decision.proof.lead_review_integration_authorization_inherited)}\``,
    `- Integration delta review satisfies lead freshness: \`${Boolean(decision.proof.lead_review_integration_delta_reviewed)}\``,
    `- ${branchProtectionLabel}: \`${JSON.stringify(decision.proof.branch_protection || {})}\``
  );
  if (decision.proof.human_authorization) {
    lines.push(`- Payload authorization record: \`${JSON.stringify(decision.proof.human_authorization)}\``);
  }
  if (decision.proof.integration) {
    lines.push(`- Integration validation proof: \`${JSON.stringify(decision.proof.integration)}\``);
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
  payloadIntegrationStateSummary,
  renderDecisionMarkdown,
  bundleStateSummary,
  validateDecision,
};
