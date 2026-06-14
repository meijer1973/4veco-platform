#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REQUIRED_FIELDS = [
  'bundle_id',
  'authority_class',
  'review_autonomy',
  'human_decision_required',
  'paired_prs',
  'auto_merge_allowed_after_ci',
  'escalation_triggers',
];

const PR_CLASSES = new Set([
  'micro_maintenance',
  'normal_sprint',
  'generated_output',
  'high_authority',
  'cross_repo_bundle',
]);

const AUTHORITY_CLASSES = new Set([
  'mechanical',
  'standard',
  'generated_output',
  'high_authority',
  'protected_reference',
  'machine_external_reference',
  'product_authority',
  'diagnostics_mastery_pv_student_use',
]);

const AUTONOMOUS_LEVELS = new Set(['L0', 'L1', 'L2']);
const HUMAN_LEVELS = new Set(['L3', 'L4']);
const REVIEW_LEVELS = new Set([...AUTONOMOUS_LEVELS, ...HUMAN_LEVELS]);
const NON_AUTONOMOUS_AUTHORITY_CLASSES = new Set([
  'high_authority',
  'protected_reference',
  'machine_external_reference',
  'product_authority',
  'diagnostics_mastery_pv_student_use',
]);

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

const PRODUCT_AUTHORITY_KEYS = [
  'product_authority',
  'product_authority_claimed',
  'product_authority_authorized',
  'product_use_authorized',
  'student_product_use_authorized',
  'product_route_adoption_authorized',
  'product_route_readiness_claimed',
  'target_equivalent_completion_claims',
  'new_target_equivalent_completion_language_authorized',
];

const FORBIDDEN_AUTHORITY_KEYS = [
  'diagnostics',
  'diagnostics_authorized',
  'adaptive_routing',
  'adaptive_routing_authorized',
  'mastery',
  'mastery_authorized',
  'mastery_or_sequencing_authorized',
  'sequencing_authorized',
  'pv',
  'pv_authorized',
  'pv_projection_authorized',
  'pv_machine_promotion_authorized',
  'student_use',
  'student_use_authorized',
  'student_product_use_authorized',
  'student_facing_ai_authorized',
  'summative_use_authorized',
];

function fail(message) {
  console.error(`Review throughput packet check failed: ${message}`);
  process.exit(1);
}

function normalizePath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\.\.\/4veco-platform\//, '');
}

function normalizeKey(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeVerdict(value) {
  return String(value || '').trim().replace(/_/g, ' ').toUpperCase();
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function collectChangedPaths(packet) {
  const candidates = [
    packet.changed_paths,
    packet.changedPaths,
    packet.files,
    packet.changed_files,
    packet.changedFiles,
  ];
  const paths = [];
  for (const candidate of candidates) {
    for (const item of asArray(candidate)) {
      if (typeof item === 'string') {
        paths.push(normalizePath(item));
      } else if (item && typeof item === 'object') {
        const value = item.path || item.filename || item.file || item.name;
        if (value) paths.push(normalizePath(value));
      }
    }
  }
  return [...new Set(paths.filter(Boolean))];
}

function matchesAny(file, patterns) {
  return patterns.some((pattern) => pattern.test(file));
}

function generatedLessonOutputTouched(paths) {
  return paths.some((file) => /(^|\/)Boek\s+\d+\s+-\s+/i.test(file));
}

function hasTruthyClaim(value, keys) {
  const wanted = new Set(keys.map(normalizeKey));
  const queue = [value];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') continue;
    for (const [key, child] of Object.entries(current)) {
      if (wanted.has(normalizeKey(key))) {
        if (child === true) return true;
        if (typeof child === 'string' && /^(true|yes|claimed|authorized|authorised|granted)$/i.test(child.trim())) {
          return true;
        }
      }
      if (child && typeof child === 'object') queue.push(child);
    }
  }
  return false;
}

function containsForbiddenAuthorityText(packet) {
  const values = [
    packet.authority_class,
    packet.authorityClass,
    packet.requested_authority,
    packet.requestedAuthority,
  ]
    .filter(Boolean)
    .join(' ');
  return /\b(diagnostics?|mastery|pv|student[-_\s]?use|student[-_\s]?product[-_\s]?use)\b/i.test(values);
}

function hasSuccessStatus(value) {
  if (!value || typeof value !== 'object') return false;
  const statusFields = ['conclusion', 'status', 'result', 'outcome'];
  return statusFields.some((key) => {
    const candidate = value[key];
    return typeof candidate === 'string' && /^(success|passed|pass|ok)$/i.test(candidate.trim());
  });
}

function hasProofIdentity(value) {
  if (!value || typeof value !== 'object') return false;
  return [
    'run_id',
    'runId',
    'github_actions_run_id',
    'githubActionsRunId',
    'workflow',
    'context',
    'job',
    'command',
    'reviewed_commit_sha',
    'reviewedCommitSha',
    'reviewed_remote_commit_sha',
  ].some((key) => typeof value[key] === 'string' || typeof value[key] === 'number');
}

function hasCiProof(packet) {
  const proof = packet.proof || {};
  const candidates = [
    proof.ci,
    proof.ci_proof,
    packet.ci,
    packet.ci_proof,
    packet.ciProof,
    packet.validation && packet.validation.ci,
  ];
  return candidates.some((candidate) =>
    asArray(candidate).some((item) => hasSuccessStatus(item) && hasProofIdentity(item))
  );
}

function hasCheckerProof(packet) {
  const proof = packet.proof || {};
  const candidates = [
    proof.checkers,
    proof.checker,
    proof.checker_proof,
    packet.checkers,
    packet.checker_proof,
    packet.checkerProof,
    packet.validation && packet.validation.checkers,
  ];
  return candidates.some((candidate) =>
    asArray(candidate).some(
      (item) => item && typeof item === 'object' && hasSuccessStatus(item) && typeof item.command === 'string' && item.command.trim()
    )
  );
}

function leadReviewResult(packet) {
  const proof = packet.proof || {};
  const candidates = [
    packet.review_autonomy && packet.review_autonomy.lead_review_result,
    packet.review_autonomy && packet.review_autonomy.leadReviewResult,
    proof.lead_review && proof.lead_review.result,
    proof.lead_review && proof.lead_review.final_verdict,
    proof.leadReview && proof.leadReview.result,
    packet.lead_review && packet.lead_review.final_verdict,
    packet.lead_review && packet.lead_review.result,
    packet.leadReview && packet.leadReview.finalVerdict,
  ];
  return candidates.find((candidate) => typeof candidate === 'string' && candidate.trim()) || null;
}

function hasPassingLeadReview(packet) {
  return ['PASS', 'PASS WITH FLAGS'].includes(normalizeVerdict(leadReviewResult(packet)));
}

function hasOwnerPreapproval(packet) {
  const autonomy = packet.review_autonomy || {};
  const ownerPreapproval =
    autonomy.owner_preapproval ||
    autonomy.ownerPreapproval ||
    packet.owner_preapproval ||
    packet.ownerPreapproval;
  if (!ownerPreapproval) return false;
  if (typeof ownerPreapproval === 'string') return Boolean(ownerPreapproval.trim());
  if (typeof ownerPreapproval === 'object') {
    return Object.values(ownerPreapproval).some((value) => String(value || '').trim());
  }
  return false;
}

function isAutonomous(packet) {
  const level = packet.review_autonomy && packet.review_autonomy.level;
  return (
    AUTONOMOUS_LEVELS.has(level) ||
    packet.human_decision_required === false ||
    packet.auto_merge_allowed_after_ci === true
  );
}

function validateRequiredShape(packet) {
  for (const field of REQUIRED_FIELDS) {
    if (!hasOwn(packet, field)) fail(`missing required field: ${field}`);
  }
  if (!packet.review_autonomy || typeof packet.review_autonomy !== 'object') {
    fail('review_autonomy must be an object');
  }
  const level = packet.review_autonomy.level;
  if (!REVIEW_LEVELS.has(level)) fail(`review_autonomy.level must be one of L0, L1, L2, L3, L4; got ${level || 'missing'}`);
  if (typeof packet.human_decision_required !== 'boolean') {
    fail('human_decision_required must be boolean');
  }
  if (typeof packet.auto_merge_allowed_after_ci !== 'boolean') {
    fail('auto_merge_allowed_after_ci must be boolean');
  }
  if (!Array.isArray(packet.paired_prs)) fail('paired_prs must be an array');
  if (!Array.isArray(packet.escalation_triggers)) fail('escalation_triggers must be an array');
  if (packet.pr_throughput_class && !PR_CLASSES.has(packet.pr_throughput_class)) {
    fail(`unsupported pr_throughput_class: ${packet.pr_throughput_class}`);
  }
  if (!AUTHORITY_CLASSES.has(packet.authority_class)) {
    fail(`unsupported authority_class: ${packet.authority_class}`);
  }
  if (packet.paired_prs.length > 0 && (typeof packet.bundle_id !== 'string' || !packet.bundle_id.trim())) {
    fail('paired_prs requires a non-empty bundle_id');
  }
  if (packet.pr_throughput_class === 'cross_repo_bundle' && packet.paired_prs.length === 0) {
    fail('cross_repo_bundle requires paired_prs');
  }
  if (packet.auto_merge_allowed_after_ci && packet.human_decision_required) {
    fail('auto_merge_allowed_after_ci conflicts with human_decision_required');
  }
  if (AUTONOMOUS_LEVELS.has(level) && packet.human_decision_required !== false) {
    fail(`${level} autonomous lane requires human_decision_required: false`);
  }
  if (HUMAN_LEVELS.has(level) && packet.human_decision_required !== true) {
    fail(`${level} human-gate lane requires human_decision_required: true`);
  }
  if (HUMAN_LEVELS.has(level) && packet.auto_merge_allowed_after_ci) {
    fail(`${level} human-gate lane cannot allow auto_merge_allowed_after_ci`);
  }
  if (level === 'L2' && !hasOwnerPreapproval(packet)) {
    fail('L2 owner-preapproved lane requires owner_preapproval evidence');
  }
}

function validateAutonomousSafety(packet) {
  if (!isAutonomous(packet)) return;

  const paths = collectChangedPaths(packet);
  const protectedPaths = paths.filter((file) => matchesAny(file, PROTECTED_REFERENCE_PATTERNS));
  if (protectedPaths.length > 0) {
    fail(`autonomous classification rejected: protected references touched (${protectedPaths.join(', ')})`);
  }

  const machineExternalPaths = paths.filter((file) => matchesAny(file, MACHINE_EXTERNAL_REFERENCE_PATTERNS));
  if (machineExternalPaths.length > 0) {
    fail(`autonomous classification rejected: machine/external references touched (${machineExternalPaths.join(', ')})`);
  }

  if (NON_AUTONOMOUS_AUTHORITY_CLASSES.has(packet.authority_class)) {
    fail(`autonomous classification rejected: authority_class ${packet.authority_class} requires human review`);
  }

  if (generatedLessonOutputTouched(paths) && hasTruthyClaim(packet, PRODUCT_AUTHORITY_KEYS)) {
    fail('autonomous classification rejected: generated lesson output claims product authority');
  }

  if (hasTruthyClaim(packet, FORBIDDEN_AUTHORITY_KEYS) || containsForbiddenAuthorityText(packet)) {
    fail('autonomous classification rejected: diagnostics/mastery/PV/student-use authority is claimed');
  }

  if (!hasCiProof(packet)) {
    fail('autonomous classification rejected: CI proof is missing');
  }

  if (!hasCheckerProof(packet)) {
    fail('autonomous classification rejected: checker proof is missing');
  }

  if (!hasPassingLeadReview(packet)) {
    fail('autonomous classification rejected: lead-review result is missing or not passing');
  }

  if (packet.escalation_triggers.length > 0) {
    fail('autonomous classification rejected: escalation_triggers is non-empty');
  }
}

function validatePacket(packet) {
  validateRequiredShape(packet);
  validateAutonomousSafety(packet);
  return true;
}

function runCli(argv) {
  const file = argv.find((arg) => !arg.startsWith('--'));
  if (!file) fail('usage: check-review-throughput-packet.js <packet.json>');
  const packet = readJson(path.resolve(file));
  validatePacket(packet);
  console.log(`OK review throughput packet: ${packet.packet_id || file}`);
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  validatePacket,
  collectChangedPaths,
  isAutonomous,
};
