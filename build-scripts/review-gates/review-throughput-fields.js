const REVIEW_LEVELS = new Set(['L0', 'L1', 'L2', 'L3', 'L4']);

function normalizePath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '');
}

function uniqueChangedPaths(changedPaths) {
  if (!Array.isArray(changedPaths) || changedPaths.length === 0) {
    throw new Error('changedPaths must be a non-empty array');
  }

  const paths = changedPaths.map((item) => {
    if (typeof item !== 'string' || !item.trim()) {
      throw new Error('changedPaths must contain strings only');
    }
    return normalizePath(item.trim());
  });

  return [...new Set(paths)];
}

function reviewThroughputFields(options = {}) {
  const {
    packetId,
    prThroughputClass,
    authorityClass,
    changedPaths,
    reviewAutonomy,
    humanDecisionRequired,
    autoMergeAllowedAfterCi,
    bundleId = null,
    pairedPrs = [],
    escalationTriggers = [],
  } = options;

  if (typeof packetId !== 'string' || !packetId.trim()) {
    throw new Error('packetId is required');
  }
  if (!reviewAutonomy || typeof reviewAutonomy !== 'object') {
    throw new Error('reviewAutonomy is required');
  }
  if (!REVIEW_LEVELS.has(reviewAutonomy.level)) {
    throw new Error('reviewAutonomy.level must be L0, L1, L2, L3, or L4');
  }
  if (typeof humanDecisionRequired !== 'boolean') {
    throw new Error('humanDecisionRequired must be boolean');
  }
  if (typeof autoMergeAllowedAfterCi !== 'boolean') {
    throw new Error('autoMergeAllowedAfterCi must be boolean');
  }
  if (!Array.isArray(pairedPrs)) {
    throw new Error('pairedPrs must be an array');
  }
  if (!Array.isArray(escalationTriggers)) {
    throw new Error('escalationTriggers must be an array');
  }

  return {
    packet_id: packetId,
    pr_throughput_class: prThroughputClass,
    bundle_id: bundleId,
    authority_class: authorityClass,
    changed_paths: uniqueChangedPaths(changedPaths),
    review_autonomy: reviewAutonomy,
    human_decision_required: humanDecisionRequired,
    paired_prs: pairedPrs,
    auto_merge_allowed_after_ci: autoMergeAllowedAfterCi,
    escalation_triggers: escalationTriggers,
  };
}

function fullHumanGateThroughputFields(options = {}) {
  const { gateId, changedPaths, rationale } = options;
  const packetId = options.packetId || gateId;
  return reviewThroughputFields({
    packetId,
    prThroughputClass: options.prThroughputClass || 'high_authority',
    authorityClass: options.authorityClass || 'high_authority',
    changedPaths,
    reviewAutonomy: {
      level: 'L4',
      rationale: rationale || 'Full human gate required for high-authority or protected review surface.',
    },
    humanDecisionRequired: true,
    autoMergeAllowedAfterCi: false,
    bundleId: options.bundleId === undefined ? null : options.bundleId,
    pairedPrs: options.pairedPrs || [],
    escalationTriggers: options.escalationTriggers || ['human_gate_required'],
  });
}

function ownerDecisionGateThroughputFields(options = {}) {
  const { packetId, changedPaths, rationale } = options;
  return reviewThroughputFields({
    packetId,
    prThroughputClass: options.prThroughputClass || 'generated_output',
    authorityClass: options.authorityClass || 'generated_output',
    changedPaths,
    reviewAutonomy: {
      level: 'L3',
      rationale: rationale || 'Owner one-decision gate required for generated-output or product-adjacent review surface.',
    },
    humanDecisionRequired: true,
    autoMergeAllowedAfterCi: false,
    bundleId: options.bundleId === undefined ? null : options.bundleId,
    pairedPrs: options.pairedPrs || [],
    escalationTriggers: options.escalationTriggers || ['owner_decision_required'],
  });
}

module.exports = {
  fullHumanGateThroughputFields,
  ownerDecisionGateThroughputFields,
  reviewThroughputFields,
};
