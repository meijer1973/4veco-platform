#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const COMMON_STOP_CODES = [
  "STOP_SOURCE_ALLOWLIST_MISMATCH",
  "STOP_OUTPUT_ALLOWLIST_MISMATCH",
  "STOP_MISSING_SOURCE",
  "STOP_HIDDEN_BLOCKER",
  "STOP_PACK_STRENGTH_REQUEST",
  "STOP_PUBLIC_EXTERNAL_REQUEST",
  "STOP_PERSONAL_DATA",
  "STOP_DOWNSTREAM_GATE_AUTHORITY",
  "STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE",
  "STOP_UNCITED_CLAIM",
];

const GLOBAL_STOP_CODES = [
  ...COMMON_STOP_CODES,
  "STOP_UNKNOWN_SCOPE",
];

const CHAPTER_12_SOURCE_PATHS = [
  "reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json",
  "reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.md",
  "archive/sprints/INSPECT-10/INSPECT-10R-three-reviewer-gate-results.md",
  "reports/inspection-standards/chapter-1-2-proof-support-remediation.json",
  "reports/inspection-standards/chapter-1-2-proof-support-remediation.md",
  "reports/inspection-standards/chapter-1-2-target-equivalent-accessibility-support-review.json",
  "reports/inspection-standards/chapter-1-2-target-equivalent-accessibility-support-review.md",
  "reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.json",
  "reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.md",
  "reports/inspection-standards/dutch-evidence-scale-readiness.json",
  "reports/inspection-standards/dutch-evidence-gap-closure-plan.json",
  "reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json",
  "docs/roadmaps/quality-standards/quality-standards-end-state.md",
  "../4veco-lessen/specifications/product-end-state.md",
  "../4veco-lessen/specifications/product-vision.md",
  "docs/inspection-standards/report-only-generator-plan.md",
  "docs/inspection-standards/evidence-pack-source-contract.md",
  "docs/inspection-standards/report-only-validator-design.md",
];

const CHAPTER_12_OUTPUT_PATHS = [
  "reports/inspection-standards/chapter-1-2-diagnostic-report.md",
  "reports/inspection-standards/chapter-1-2-diagnostic-report.json",
];

const CHAPTER_13_LESSON_PROOF_PATHS = [
  "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.1 Aanbod/1.3.1 Aanbod \u2013 opgaven.md",
  "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.1 Aanbod/1.3.1 Aanbod \u2013 antwoorden.md",
  "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.2 Marktevenwicht/1.3.2 Marktevenwicht \u2013 opgaven.md",
  "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.2 Marktevenwicht/1.3.2 Marktevenwicht \u2013 antwoorden.md",
  "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.3 Verschuivingen en nieuw evenwicht/1.3.3 Verschuivingen en nieuw evenwicht \u2013 opgaven.md",
  "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.3 Verschuivingen en nieuw evenwicht/1.3.3 Verschuivingen en nieuw evenwicht \u2013 antwoorden.md",
  "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.4 Gemengde opgaven/1.3.4 Gemengde opgaven \u2013 opgaven.md",
  "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.4 Gemengde opgaven/1.3.4 Gemengde opgaven \u2013 antwoorden.md",
];

const CHAPTER_13_SOURCE_PATHS = [
  "reports/inspection-standards/chapter-1-3-readiness-closure.json",
  "reports/inspection-standards/chapter-1-3-readiness-closure.md",
  "docs/inspection-standards/chapter-1-3-source-traceability.md",
  "archive/sprints/INSPECT-11D/INSPECT-11D-authorisation-note.md",
  "archive/sprints/INSPECT-11D/INSPECT-11D-validation-log.md",
  "archive/sprints/INSPECT-11D/INSPECT-11D-specialist-gate-results.md",
  "archive/sprints/INSPECT-11D/INSPECT-11D-lead-review-final.md",
  "archive/sprints/INSPECT-11D/INSPECT-11D-closure-log.md",
  "docs/roadmaps/quality-standards/quality-standards-end-state.md",
  "../4veco-lessen/specifications/product-end-state.md",
  "../4veco-lessen/specifications/product-vision.md",
  ...CHAPTER_13_LESSON_PROOF_PATHS,
];

const CHAPTER_13_OUTPUT_PATHS = [
  "reports/inspection-standards/chapter-1-3-diagnostic-report.md",
  "reports/inspection-standards/chapter-1-3-diagnostic-report.json",
];

class StopError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "StopError";
    this.code = code;
    this.details = details;
  }
}

function normalizePath(value) {
  return value.replace(/\\/g, "/");
}

function repoPath(relativePath) {
  return path.resolve(process.cwd(), relativePath);
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function semanticSnapshot(report) {
  return {
    status: report.status,
    flags: Object.fromEntries(
      Object.entries(report).filter(
        ([key, value]) =>
          /(?:only|authorized|enabled|external|teacher|student|public|route|scale|dashboard|quality|personal|claim)/i.test(
            key
          ) && typeof value === "boolean"
      )
    ),
    scope: report.scope,
    diagnostic_status_vocabulary: report.diagnostic_status_vocabulary,
    input_eligibility_decisions: report.input_eligibility_decisions,
    product_evidence: report["4veco_product_evidence"],
    weak_or_missing_evidence: report.weak_or_missing_evidence,
    blockers: report.blockers,
    school_owned_evidence_still_needed: report.school_owned_evidence_still_needed,
    forbidden_inference: report.forbidden_inference,
    public_external_sharing_status: report.public_external_sharing_status,
    owner_next_action: report.owner_next_action,
    proof_required_to_close: report.proof_required_to_close,
    refusal_status: report.refusal_status,
    refusal_policy: report.refusal_policy,
    finding_classification: report.finding_classification,
    core_requirement_checklist: report.core_requirement_checklist,
    output_files_written: report.output_files_written,
  };
}

function semanticHash(report) {
  return sha256(JSON.stringify(canonicalize(semanticSnapshot(report)), null, 2));
}

function descriptorSets(descriptor) {
  return {
    source: new Set(descriptor.sourcePaths),
    output: new Set(descriptor.outputPaths),
    exactLessonProof: new Set(descriptor.exactLessonProofPaths || []),
  };
}

function readUtf8(descriptor, filePath) {
  const normalized = normalizePath(filePath);
  const sets = descriptorSets(descriptor);

  if (!sets.source.has(normalized)) {
    throw new StopError("STOP_SOURCE_ALLOWLIST_MISMATCH", `Source path is not allowlisted: ${filePath}`);
  }

  if (normalized.startsWith("../4veco-lessen/")) {
    const isSpecSource = normalized.startsWith("../4veco-lessen/specifications/");
    const isExactLessonProof = sets.exactLessonProof.has(normalized);
    if (!isSpecSource && !isExactLessonProof) {
      throw new StopError(
        "STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE",
        `Lesson output path is not allowlisted: ${filePath}`
      );
    }
  }

  const fullPath = repoPath(normalized);
  if (!fs.existsSync(fullPath)) {
    throw new StopError("STOP_MISSING_SOURCE", `Required source is missing: ${normalized}`, {
      path: normalized,
      resolved_path: fullPath,
    });
  }

  return fs.readFileSync(fullPath, "utf8");
}

function readJson(descriptor, filePath) {
  const raw = readUtf8(descriptor, filePath);
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new StopError("STOP_MISSING_SOURCE", `Required JSON source is invalid: ${filePath}`, {
      path: filePath,
      error: error.message,
    });
  }
}

function sourceMetadata(descriptor) {
  return descriptor.sourcePaths.map((sourcePath) => {
    const content = readUtf8(descriptor, sourcePath);
    return {
      path: sourcePath,
      sha256: sha256(content),
      bytes: Buffer.byteLength(content, "utf8"),
    };
  });
}

function statusForChapter12Target(proofStatus) {
  if (proofStatus.includes("candidate") || proofStatus.includes("with_blocking_generated_output_flag")) {
    return "diagnostic_candidate_with_blocker";
  }
  return "route_local_diagnostic_evidence";
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [String(value)];
}

function normalizeFinding(finding) {
  return {
    finding: finding.finding,
    classification: finding.classification || finding.finding_classification,
    blocks: finding.blocks,
    does_not_block: finding.does_not_block,
    proof_required_to_close: finding.proof_required_to_close,
  };
}

function chapter12TargetEvidence(proof) {
  return proof.target_proof_records.map((record) => ({
    target: record.paragraph_id,
    status: statusForChapter12Target(record.proof_status),
    proof_status: record.proof_status,
    evidence_summary: [
      `Operation-chain match: ${record.operation_chain_match.join("; ")}.`,
      `Answer-form match: ${record.answer_form_match.join("; ")}.`,
      record.scaffold_no_answer_before_attempt_boundary,
      record.authority_boundary,
    ],
    flags: record.flags,
    source: "reports/inspection-standards/chapter-1-2-proof-support-remediation.json",
    blocks: record.blocks,
    does_not_block: record.does_not_block,
    proof_required_to_close: record.proof_required_to_close,
  }));
}

function chapter12WeakEvidence(proof) {
  const accessibility = proof.accessibility_reviews
    .filter((review) => review.status !== "route_local_positive")
    .map((review) => ({
      area: `accessibility:${review.dimension}`,
      status: review.status,
      evidence: review.evidence,
      boundary: review.boundary,
      source: "reports/inspection-standards/chapter-1-2-proof-support-remediation.json",
    }));

  const support = proof.support_reviews
    .filter((review) => review.status !== "route_local_positive")
    .map((review) => ({
      area: `support:${review.dimension}`,
      status: review.status,
      evidence: review.evidence,
      boundary: review.boundary,
      source: "reports/inspection-standards/chapter-1-2-proof-support-remediation.json",
    }));

  return [...accessibility, ...support];
}

function chapter12BlockerLedger(planning, proof) {
  const planningBlockers = planning.blocker_carry_ledger
    .filter((blocker) => blocker.id !== "INSPECT10-IMPLEMENTATION-BLOCKED")
    .map((blocker) => ({
      id: blocker.id,
      owner_surface: blocker.owner_surface,
      finding: blocker.owner_surface,
      classification: "scale_blocker",
      blocks: blocker.blocks,
      does_not_block: blocker.does_not_block,
      proof_required_to_close: blocker.proof_required_to_close,
      source: "reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json",
    }));

  const proofBlockers = proof.finding_classification
    .filter((finding) => {
      const classification = finding.classification || finding.finding_classification;
      return classification === "scale_blocker" || String(finding.blocks).toLowerCase().includes("pack-strength");
    })
    .map((finding, index) => ({
      id: `INSPECT9C-CARRY-${index + 1}`,
      owner_surface: finding.finding,
      finding: finding.finding,
      classification: finding.classification || finding.finding_classification,
      blocks: finding.blocks,
      does_not_block: finding.does_not_block,
      proof_required_to_close: finding.proof_required_to_close,
      source: "reports/inspection-standards/chapter-1-2-proof-support-remediation.json",
    }));

  const byId = new Map();
  [...planningBlockers, ...proofBlockers].forEach((blocker) => {
    const key = `${blocker.id}:${blocker.finding}`;
    byId.set(key, blocker);
  });
  return Array.from(byId.values());
}

function chapter12SchoolEvidenceStillNeeded() {
  return [
    {
      item: "School implementation and classroom use evidence",
      reason:
        "Product artifacts do not prove classroom implementation, monitoring, interventions, accommodations, care plans, or school-wide support decisions.",
      source: "reports/inspection-standards/chapter-1-2-proof-support-remediation.json",
    },
    {
      item: "PTA, grading, summative-validity, and assessment-policy evidence",
      reason:
        "Chapter 1.2 diagnostic evidence is not PTA-validity, summative-validity, grading, or school assessment-policy proof.",
      source: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
    },
    {
      item: "School SKA, inspection conversation, and competent-authority judgement evidence",
      reason:
        "The Dutch quality-control layer separates product evidence from school obligations and competent-authority judgement.",
      source: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
    },
  ];
}

function chapter12ForbiddenInferences() {
  return [
    {
      inference: "Chapter 1.2 is pack-strength or teacher/school-facing ready.",
      source: "reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json",
    },
    {
      inference: "4veco is compliant, approved, inspection-ready, OP0-complete, PTA-valid, or summative-valid.",
      source: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
    },
    {
      inference: "This diagnostic report authorises public/external output or sharing.",
      source: "reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json",
    },
    {
      inference: "This diagnostic report authorises package-script, CI/build, dashboard, quality-ref, or Scale Gate integration.",
      source: "reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json",
    },
    {
      inference: "This diagnostic report authorises generated lesson-output mutation, product-route adoption, diagnostics/mastery/PV, student-use, or product-use work.",
      source: "reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json",
    },
  ];
}

function chapter13TargetEvidence(closure) {
  return closure.route_local_proof_records.map((record) => ({
    target: record.target,
    exercise_id: record.exercise_id,
    status: "route_local_diagnostic_evidence",
    proof_status: "route_local_only_with_downstream_blockers",
    evidence_summary: [
      `Exercise ${record.exercise_id}: ${record.operation_chain}.`,
      `Answer form: ${record.answer_form}.`,
      `Line ranges: opgaven ${record.opgaven_lines}; answers ${record.answer_lines}.`,
      record.boundary,
    ],
    line_ranges: {
      opgaven_lines: record.opgaven_lines,
      answer_lines: record.answer_lines,
    },
    flags: ["route-local-only", "school-owned evidence still needed"],
    source: "reports/inspection-standards/chapter-1-3-readiness-closure.json",
    blocks: ["teacher/school-facing claims", "public/external claims", "Scale Gate or product-route authority"],
    does_not_block: ["manual internal diagnostic report generation"],
    proof_required_to_close:
      "Future diagnostic routes must isolate independent exercises from worked examples and answer content, then add school-owned evidence before any teacher/school-facing or product-route claim.",
  }));
}

function chapter13WeakEvidence(closure) {
  return [
    {
      area: "route-local-only evidence",
      status: "school_owned_evidence_needed",
      evidence:
        "INSPECT-11D proves route-local exercise/answer ranges for Chapter 1.3 but does not prove classroom implementation, school monitoring, interventions, accommodations, or competent-authority judgement.",
      boundary: "Internal diagnostic display only; school-owned evidence still needed before external or school-facing claims.",
      source: "reports/inspection-standards/chapter-1-3-readiness-closure.json",
    },
    {
      area: "accessibility:rendered/static",
      status: "future_audit_flag",
      evidence: `Rendered desktop/mobile proof exists in ${closure.rendered_proof.directory}, but this is not a WCAG, PDF-tagging, or teacher/school-facing accessibility certification.`,
      boundary: "Accessibility/support limitations block accessibility certification and teacher/school-facing accessibility claims.",
      source: "reports/inspection-standards/chapter-1-3-readiness-closure.json",
    },
    {
      area: "support:school-owned route",
      status: "school_owned_evidence_needed",
      evidence:
        "Support evidence remains product-route local. Care plans, accommodations, interventions, and school-wide support decisions are outside this report.",
      boundary: "No OP0, PTA, summative, inspection-readiness, compliance, or approval claim.",
      source: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
    },
    {
      area: "companion/advisory",
      status: closure.companion_advisory.decision,
      evidence: closure.companion_advisory.reason,
      boundary: closure.companion_advisory.proof_required_to_close_future_route,
      source: "reports/inspection-standards/chapter-1-3-readiness-closure.json",
    },
  ];
}

function chapter13TargetReconciliation(closure) {
  return closure.target_reconciliation.map((item) => {
    if (item.target !== "1.3.4") {
      return {
        ...item,
        source: "reports/inspection-standards/chapter-1-3-readiness-closure.json",
      };
    }

    return {
      ...item,
      resolved_state:
        "reviewed_final_source_registry_no_new_theory; simultaneous_shift_divergence repaired_in_generated_output; INSPECT-11D state A accepted, so this no longer blocks INSPECT-11E/F internal diagnostic report generation",
      classification: "core_requirement_closed_for_internal_diagnostic",
      blocks: [
        "evidence-pack generation",
        "teacher/school-facing output",
        "public/external output",
        "product-route adoption",
        "Scale Gate",
        "diagnostics/mastery/PV",
        "student/product-use",
      ],
      does_not_block: [
        "Chapter 1.3 readiness closure packet",
        "INSPECT-11E/F manually invoked internal diagnostic report generation",
      ],
      proof_required_to_close:
        "Separate authorised route and renewed human review for any evidence-pack, teacher/school-facing, public/external, product-route, Scale Gate, diagnostics/mastery/PV, student/product-use, personal-data, compliance, approval, OP0, PTA, summative, or inspection-readiness claim.",
      source: "reports/inspection-standards/chapter-1-3-readiness-closure.json",
    };
  });
}

function chapter13Blockers(closure) {
  const targetFlags = closure.target_reconciliation
    .filter((item) => Array.isArray(item.blocks) && item.blocks.length > 0)
    .filter((item) => item.target !== "1.3.4")
    .map((item) => ({
      id: `INSPECT11D-TARGET-${item.target.replace(/\./g, "")}`,
      owner_surface: item.target,
      finding: item.resolved_state,
      classification: item.classification,
      blocks: item.blocks,
      does_not_block: item.does_not_block,
      proof_required_to_close: item.proof_required_to_close,
      source: "reports/inspection-standards/chapter-1-3-readiness-closure.json",
    }));

  const carried = closure.carried_issues
    .filter((item) => !["INSPECT11D-HUMAN-REVIEW", "INSPECT11D-SPECIALIST-GATES"].includes(item.id))
    .map((item) => ({
      ...item,
      owner_surface: item.id,
      source: "reports/inspection-standards/chapter-1-3-readiness-closure.json",
    }));

  const schoolEvidence = {
    id: "INSPECT11EF-SCHOOL-EVIDENCE",
    owner_surface: "school-owned evidence",
    finding:
      "The Chapter 1.3 report is route-local-only evidence; school-owned classroom, support, PTA, and inspection conversation evidence is still needed.",
    classification: "school_owned_evidence_needed",
    blocks: [
      "teacher/school-facing output",
      "public/external output",
      "evidence-pack generation",
      "inspection-readiness, compliance, approval, OP0, PTA, or summative claims",
    ],
    does_not_block: ["manual internal diagnostic report generation"],
    proof_required_to_close:
      "Separate school-owned evidence and renewed human review before any school-facing, public, product-route, or Scale Gate use.",
    source: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
  };

  return [...targetFlags, ...carried, schoolEvidence];
}

function chapter13FindingClassification(closure) {
  const targetFindings = chapter13TargetReconciliation(closure).map(normalizeFinding);
  const carriedFindings = closure.carried_issues.map((item) => {
    if (item.id === "INSPECT11D-HUMAN-REVIEW") {
      return {
        finding:
          "INSPECT-11D human review accepted state A and paired PRs merged; prior gate no longer blocks INSPECT-11E/F internal diagnostic report generation.",
        classification: "closed_prerequisite",
        blocks: [
          "none for INSPECT-11E/F internal diagnostic report generation",
          "downstream evidence-pack, teacher/school-facing, public/external, product-route, Scale Gate, diagnostics/mastery/PV, student/product-use, personal-data, compliance, approval, OP0, PTA, summative, and inspection-readiness claims remain blocked",
        ],
        does_not_block: ["manual internal Chapter 1.3 diagnostic report generation"],
        proof_required_to_close:
          "Completed by human acceptance of INSPECT-11D state A and governed platform PR #114 / lesson PR #28 merge sequence.",
      };
    }
    return normalizeFinding(item);
  });

  return [...targetFindings, ...carriedFindings];
}

function chapter13SchoolEvidenceStillNeeded() {
  return [
    {
      item: "School implementation and classroom use evidence",
      reason:
        "Chapter 1.3 route-local proof does not show classroom implementation, teacher intervention choices, student support execution, or school monitoring.",
      source: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
    },
    {
      item: "PTA, grading, summative-validity, and assessment-policy evidence",
      reason:
        "The internal diagnostic report cannot establish PTA-validity, summative-validity, grading policy, or school assessment-policy compliance.",
      source: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
    },
    {
      item: "Inspection conversation and competent-authority judgement evidence",
      reason:
        "Product evidence remains separated from school obligations, inspection dialogue, SKA evidence, and competent-authority judgement.",
      source: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
    },
  ];
}

function chapter13ForbiddenInferences() {
  return [
    {
      inference: "Chapter 1.3 is teacher/school-facing ready or evidence-pack ready.",
      source: "reports/inspection-standards/chapter-1-3-readiness-closure.json",
    },
    {
      inference: "Chapter 1.3 authorises public/external generated output or sharing.",
      source: "reports/inspection-standards/chapter-1-3-readiness-closure.json",
    },
    {
      inference: "Chapter 1.3 authorises Scale Gate 1, product-route adoption, diagnostics/mastery/PV, student-use, or product-use.",
      source: "reports/inspection-standards/chapter-1-3-readiness-closure.json",
    },
    {
      inference: "4veco is compliant, approved, inspection-ready, OP0-complete, PTA-valid, or summative-valid.",
      source: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
    },
    {
      inference: "The internal diagnostic report processes personal data or proves school-owned support evidence.",
      source: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
    },
    {
      inference: "The report authorises package scripts, CI/build invocation, dashboard gates, quality-ref integration, or generated lesson-output scanning.",
      source: "archive/sprints/INSPECT-11D/INSPECT-11D-authorisation-note.md",
    },
  ];
}

function refusalPolicy(stopCodes, scopeLabel) {
  return stopCodes.map((code) => {
    const conditions = {
      STOP_SOURCE_ALLOWLIST_MISMATCH: `A requested source path is outside the ${scopeLabel} source allowlist.`,
      STOP_OUTPUT_ALLOWLIST_MISMATCH: `A requested output path or argument is outside the ${scopeLabel} output allowlist.`,
      STOP_MISSING_SOURCE: "A required source file is missing or invalid.",
      STOP_HIDDEN_BLOCKER: "A generated report would omit a carried blocker or authority boundary.",
      STOP_PACK_STRENGTH_REQUEST: "A request asks for pack-strength, evidence-pack, teacher-facing, or school-facing language.",
      STOP_PUBLIC_EXTERNAL_REQUEST: "A request asks for public/external generated output or public/external sharing.",
      STOP_PERSONAL_DATA: "A request introduces student-level, school-identifiable, or personal data.",
      STOP_DOWNSTREAM_GATE_AUTHORITY:
        "A request tries to unlock package/CI, dashboard, quality-ref, Scale Gate, product-route, diagnostics/mastery/PV, student-use, or product-use authority.",
      STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE:
        "A request reads or mutates lesson output or protected references outside the exact allowlist.",
      STOP_UNCITED_CLAIM: "A generated claim lacks a source path.",
    };
    return { code, condition: conditions[code] };
  });
}

function chapter12RefusalPolicy() {
  const conditions = {
    STOP_SOURCE_ALLOWLIST_MISMATCH: "A requested source path is outside the INSPECT-10A source allowlist.",
    STOP_OUTPUT_ALLOWLIST_MISMATCH: "A requested output path is outside the INSPECT-10A output allowlist.",
    STOP_MISSING_SOURCE: "A required source file is missing or invalid.",
    STOP_HIDDEN_BLOCKER: "A generated report would omit a carried Chapter 1.2 or check-surface blocker.",
    STOP_PACK_STRENGTH_REQUEST: "A request asks for pack-strength, teacher/school-facing, or evidence-pack language.",
    STOP_PUBLIC_EXTERNAL_REQUEST: "A request asks for public/external generated output or public/external sharing.",
    STOP_PERSONAL_DATA: "A request introduces student-level, school-identifiable, or personal data.",
    STOP_DOWNSTREAM_GATE_AUTHORITY:
      "A request tries to unlock package/CI, dashboard, quality-ref, Scale Gate, product-route, diagnostics/mastery/PV, student-use, or product-use authority.",
    STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE:
      "A request reads or mutates lesson output or protected references outside the exact allowlist.",
    STOP_UNCITED_CLAIM: "A generated claim lacks a source path.",
  };
  return COMMON_STOP_CODES.map((code) => ({ code, condition: conditions[code] }));
}

function buildChapter12Report(descriptor) {
  const planning = readJson(descriptor, "reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json");
  const proof = readJson(descriptor, "reports/inspection-standards/chapter-1-2-proof-support-remediation.json");
  readJson(descriptor, "reports/inspection-standards/chapter-1-2-target-equivalent-accessibility-support-review.json");
  readJson(descriptor, "reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.json");
  readJson(descriptor, "reports/inspection-standards/dutch-evidence-scale-readiness.json");
  readJson(descriptor, "reports/inspection-standards/dutch-evidence-gap-closure-plan.json");
  readJson(descriptor, "reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json");

  const report = {
    schema_version: 1,
    report_id: "chapter-1-2-diagnostic-report",
    sprint_id: "INSPECT-10B",
    generated_date: "2026-06-16",
    status: "internal_diagnostic_report_generated",
    diagnostic_only: true,
    internal_only: true,
    manual_invocation_only: true,
    evidence_pack_generated: false,
    teacher_school_pack_generated: false,
    public_external_facing_output_generated: false,
    public_external_sharing_authorized: false,
    package_script_or_ci_integration_created: false,
    dashboard_gate_created: false,
    quality_ref_or_scale_gate_integration_created: false,
    generated_lesson_output_mutated: false,
    source_registry_mutated: false,
    personal_data_present: false,
    product_route_adoption_authorized: false,
    diagnostics_mastery_pv_authorized: false,
    student_or_product_use_authorized: false,
    scope: {
      chapter: "Book 1 Chapter 1.2 Vraag",
      paragraphs: ["1.2.1", "1.2.2", "1.2.3", "1.2.4"],
      language: "Dutch",
      report_surface: "internal diagnostic report only",
      source: "reports/inspection-standards/chapter-1-2-proof-support-remediation.json",
    },
    product_end_state: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
    original_sprint_gate_spec:
      "docs/roadmaps/quality-standards/inspection-standards-roadmap.md#candidate-future-sprints",
    controlling_implementation_gate:
      "reports/inspection-standards/dutch-diagnostic-report-generator-implementation-plan.md",
    source_files_used: sourceMetadata(descriptor),
    source_checkout_notes: {
      platform_head_policy:
        "not_embedded_in_generated_output; use validation logs and PR CI for platform commit evidence",
      lesson_specs_head_policy:
        "not_embedded_in_generated_output; lesson checkout movement is validated by source hashes, validation logs, and PR CI",
      lesson_specs_mode: "read-only specification source; no generated lesson-output path is read",
    },
    evidence_status: "diagnostic_candidate_with_blocker",
    diagnostic_status_vocabulary: planning.diagnostic_status_vocabulary,
    input_eligibility_decisions: planning.input_eligibility_decisions,
    "4veco_product_evidence": chapter12TargetEvidence(proof),
    weak_or_missing_evidence: chapter12WeakEvidence(proof),
    blockers: chapter12BlockerLedger(planning, proof),
    school_owned_evidence_still_needed: chapter12SchoolEvidenceStillNeeded(),
    forbidden_inference: chapter12ForbiddenInferences(),
    public_external_sharing_status: {
      status: "not_authorized",
      explanation:
        "INSPECT-10B generates an internal diagnostic report only. Public/external generated output or sharing requires later human review.",
      source: "reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json",
    },
    owner_next_action: {
      action:
        "Keep this as a manually invoked internal diagnostic generator only. Review and harden stability before any broader diagnostic scope; do not use it for pack-strength, teacher/school-facing, public/external, or downstream gate work.",
      source: "reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json",
    },
    proof_required_to_close: [],
    refusal_status: {
      status: "none",
      explanation: "Default run generated only the allowlisted internal diagnostic report pair.",
    },
    refusal_policy: chapter12RefusalPolicy(),
    finding_classification: [
      ...planning.finding_classification.map(normalizeFinding),
      ...proof.finding_classification.map(normalizeFinding),
    ],
    core_requirement_checklist: [
      {
        requirement: "Product end-state cited",
        status: "met",
        evidence: "product_end_state",
      },
      {
        requirement: "Original sprint/gate spec cited",
        status: "met",
        evidence: "original_sprint_gate_spec and controlling_implementation_gate",
      },
      {
        requirement: "Source allowlist enforced",
        status: "met",
        evidence: "source_files_used and generator SOURCE_PATHS",
      },
      {
        requirement: "Output allowlist enforced",
        status: "met",
        evidence: "output_files_written and generator OUTPUT_PATHS",
      },
      {
        requirement: "Blockers visible",
        status: "met",
        evidence: "blockers",
      },
      {
        requirement: "No missing core requirement carried as PASS WITH FLAGS",
        status: "met",
        evidence: "refusal_status and validation",
      },
    ],
    output_files_written: descriptor.outputPaths,
  };

  report.proof_required_to_close = Array.from(
    new Set(report.blockers.map((blocker) => blocker.proof_required_to_close).filter(Boolean))
  );

  assertReportSafety(report, descriptor);
  return report;
}

function buildChapter13Report(descriptor) {
  const closure = readJson(descriptor, "reports/inspection-standards/chapter-1-3-readiness-closure.json");
  readUtf8(descriptor, "reports/inspection-standards/chapter-1-3-readiness-closure.md");
  readUtf8(descriptor, "docs/inspection-standards/chapter-1-3-source-traceability.md");
  readUtf8(descriptor, "archive/sprints/INSPECT-11D/INSPECT-11D-authorisation-note.md");
  readUtf8(descriptor, "archive/sprints/INSPECT-11D/INSPECT-11D-validation-log.md");
  readUtf8(descriptor, "archive/sprints/INSPECT-11D/INSPECT-11D-specialist-gate-results.md");
  readUtf8(descriptor, "archive/sprints/INSPECT-11D/INSPECT-11D-lead-review-final.md");
  readUtf8(descriptor, "archive/sprints/INSPECT-11D/INSPECT-11D-closure-log.md");
  for (const lessonPath of descriptor.exactLessonProofPaths) readUtf8(descriptor, lessonPath);

  const report = {
    schema_version: 1,
    report_id: "chapter-1-3-diagnostic-report",
    sprint_id: "INSPECT-11E/F",
    generated_date: "2026-06-19",
    status: "internal_diagnostic_report_generated",
    diagnostic_only: true,
    internal_only: true,
    manual_invocation_only: true,
    evidence_pack_generated: false,
    teacher_school_pack_generated: false,
    public_external_facing_output_generated: false,
    public_external_sharing_authorized: false,
    package_script_or_ci_integration_created: false,
    dashboard_gate_created: false,
    quality_ref_or_scale_gate_integration_created: false,
    generated_lesson_output_mutated: false,
    source_registry_mutated: false,
    personal_data_present: false,
    product_route_adoption_authorized: false,
    diagnostics_mastery_pv_authorized: false,
    student_or_product_use_authorized: false,
    compliance_claim: false,
    inspection_readiness_claim: false,
    scope: {
      chapter: "Book 1 Chapter 1.3 Aanbod en marktevenwicht",
      paragraphs: ["1.3.1", "1.3.2", "1.3.3", "1.3.4"],
      language: "Dutch",
      report_surface: "internal diagnostic report only",
      source: "reports/inspection-standards/chapter-1-3-readiness-closure.json",
    },
    product_end_state: "../4veco-lessen/specifications/product-end-state.md",
    strategic_product_vision: "../4veco-lessen/specifications/product-vision.md",
    quality_standards_end_state: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
    original_sprint_gate_spec: "archive/sprints/INSPECT-11D/INSPECT-11D-authorisation-note.md",
    controlling_implementation_gate:
      "reports/inspection-standards/chapter-1-3-diagnostic-onboarding-plan.md",
    accepted_readiness_packet: [
      "reports/inspection-standards/chapter-1-3-readiness-closure.md",
      "reports/inspection-standards/chapter-1-3-readiness-closure.json",
    ],
    source_files_used: sourceMetadata(descriptor),
    source_checkout_notes: {
      platform_head_policy:
        "not_embedded_in_generated_output; use validation logs and PR CI for platform commit evidence",
      lesson_head_policy:
        "not_embedded_in_generated_output; exact lesson proof files are validated by source hashes and line-range records",
      lesson_source_mode:
        "read-only exact Chapter 1.3 Markdown proof paths only; no directory globbing, implicit discovery, generated lesson-output scanning, or mutation",
    },
    evidence_status: "route_local_only_with_downstream_blockers",
    diagnostic_status_vocabulary: [
      "route_local_diagnostic_evidence",
      "route_local_only_with_downstream_blockers",
      "scope_boundary_flag",
      "missing_required_evidence",
      "not_authorized_for_this_surface",
      "school_owned_evidence_needed",
    ],
    input_eligibility_decisions: [
      {
        input: "INSPECT-11D readiness closure packet",
        status: "accepted_for_internal_diagnostic_source",
        source: "reports/inspection-standards/chapter-1-3-readiness-closure.json",
      },
      {
        input: "Exact Chapter 1.3 lesson Markdown proof files",
        status: "accepted_exact_paths_only",
        source: "archive/sprints/INSPECT-11D/INSPECT-11D-authorisation-note.md",
      },
      {
        input: "School-owned evidence",
        status: "missing_required_evidence_for_school_or_external_claims",
        source: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
      },
    ],
    "4veco_product_evidence": chapter13TargetEvidence(closure),
    target_reconciliation: chapter13TargetReconciliation(closure),
    weak_or_missing_evidence: chapter13WeakEvidence(closure),
    blockers: chapter13Blockers(closure),
    school_owned_evidence_still_needed: chapter13SchoolEvidenceStillNeeded(),
    forbidden_inference: chapter13ForbiddenInferences(),
    source_traceability: {
      decision: closure.source_traceability.decision,
      record: closure.source_traceability.record,
      source_registry_mutated: false,
      stale_blueprint_prose_policy:
        "Authored JSON registry controls reviewed-final target status when older blueprint prose conflicts; stale blueprint prose is context rather than authority.",
      source: "docs/inspection-standards/chapter-1-3-source-traceability.md",
    },
    public_external_sharing_status: {
      status: "not_authorized",
      explanation:
        "INSPECT-11E/F generates an internal diagnostic report only. Public/external generated output or sharing is forbidden here and requires a later authorised route.",
      source: "archive/sprints/INSPECT-11D/INSPECT-11D-authorisation-note.md",
    },
    owner_next_action: {
      action:
        "Owner next action: use this Chapter 1.3 report only as a manually invoked internal diagnostic surface. Owner must keep route-local-only evidence separate from school-owned evidence, preserve check-surface authority separation, and collect renewed human authority before any evidence-pack, teacher/school-facing, public/external, Scale Gate, product-route, diagnostics/mastery/PV, student-use, or product-use work.",
      source: "reports/inspection-standards/chapter-1-3-readiness-closure.json",
    },
    proof_required_to_close: [],
    refusal_status: {
      status: "none",
      explanation: "Default run generated only the allowlisted Chapter 1.3 internal diagnostic report pair.",
    },
    refusal_policy: refusalPolicy(descriptor.stopCodes, "Chapter 1.3"),
    finding_classification: chapter13FindingClassification(closure),
    core_requirement_checklist: [
      ...closure.core_requirement_checklist,
      {
        requirement: "Chapter 1.3 diagnostic report generated",
        status: "met_internal_only",
        evidence: "reports/inspection-standards/chapter-1-3-diagnostic-report.md and .json",
      },
      {
        requirement: "Exact source allowlist enforced",
        status: "met",
        evidence: "source_files_used and scope descriptor sourcePaths",
      },
      {
        requirement: "Exact output allowlist enforced",
        status: "met",
        evidence: "output_files_written and scope descriptor outputPaths",
      },
      {
        requirement: "No missing core requirement carried as PASS WITH FLAGS",
        status: "met",
        evidence: "blockers remain visible; no downstream authority unlocked",
      },
    ],
    output_files_written: descriptor.outputPaths,
  };

  report.proof_required_to_close = Array.from(
    new Set(
      [
        ...report.blockers.map((blocker) => blocker.proof_required_to_close),
        ...report.school_owned_evidence_still_needed.map((item) => item.reason),
      ].filter(Boolean)
    )
  );

  assertReportSafety(report, descriptor);
  return report;
}

const SCOPE_DESCRIPTORS = {
  "chapter-1-2": {
    scope: "chapter-1-2",
    title: "# INSPECT-10B Chapter 1.2 Internal Diagnostic Report",
    sourcePaths: CHAPTER_12_SOURCE_PATHS,
    outputPaths: CHAPTER_12_OUTPUT_PATHS,
    exactLessonProofPaths: [],
    stopCodes: COMMON_STOP_CODES,
    requiredTerms: ["1.2.2", "1.2.4", "accessibility", "support", "check-surface"],
    requiredMarkdownFragments: [
      "## Safe-Use Note",
      "## Scope",
      "## 4veco_product_evidence",
      "## blockers",
      "## Refusal Policy",
      "## Output Boundary",
    ],
    buildReport: buildChapter12Report,
  },
  "chapter-1-3": {
    scope: "chapter-1-3",
    title: "# INSPECT-11E/F Chapter 1.3 Internal Diagnostic Report",
    sourcePaths: CHAPTER_13_SOURCE_PATHS,
    outputPaths: CHAPTER_13_OUTPUT_PATHS,
    exactLessonProofPaths: CHAPTER_13_LESSON_PROOF_PATHS,
    stopCodes: COMMON_STOP_CODES,
    requiredTerms: [
      "route-local",
      "school-owned",
      "forbidden",
      "accessibility",
      "support",
      "check-surface",
      "owner next action",
      "proof_required_to_close",
    ],
    requiredMarkdownFragments: [
      "## Safe-Use Note",
      "## Scope",
      "## target_reconciliation",
      "## school_owned_evidence_still_needed",
      "## source_traceability",
      "## owner_next_action",
      "## proof_required_to_close",
      "## Refusal Policy",
      "## Output Boundary",
    ],
    buildReport: buildChapter13Report,
  },
};

function assertReportSafety(report, descriptor) {
  const sets = descriptorSets(descriptor);
  for (const source of report.source_files_used) {
    if (!sets.source.has(source.path)) {
      throw new StopError("STOP_SOURCE_ALLOWLIST_MISMATCH", `Unexpected source in report: ${source.path}`);
    }
  }

  for (const outputPath of report.output_files_written) {
    if (!sets.output.has(outputPath)) {
      throw new StopError("STOP_OUTPUT_ALLOWLIST_MISMATCH", `Output is not allowlisted: ${outputPath}`);
    }
  }

  const text = JSON.stringify(report).toLowerCase();
  const missingTerms = descriptor.requiredTerms.filter((term) => !text.includes(term.toLowerCase()));
  if (missingTerms.length > 0) {
    throw new StopError("STOP_HIDDEN_BLOCKER", "Generated report is missing required blocker terms.", {
      missing_terms: missingTerms,
      scope: descriptor.scope,
    });
  }

  const claimLists = [
    report["4veco_product_evidence"],
    report.target_reconciliation || [],
    report.weak_or_missing_evidence,
    report.blockers,
    report.school_owned_evidence_still_needed,
    report.forbidden_inference,
  ];
  for (const list of claimLists) {
    for (const item of list) {
      if (!item.source || typeof item.source !== "string") {
        throw new StopError("STOP_UNCITED_CLAIM", "Generated report contains an uncited claim.", {
          item,
          scope: descriptor.scope,
        });
      }
      if (!sets.source.has(item.source)) {
        throw new StopError("STOP_UNCITED_CLAIM", "Generated claim cites a non-source-allowlisted path.", {
          source: item.source,
          scope: descriptor.scope,
        });
      }
    }
  }

  [report.public_external_sharing_status, report.owner_next_action, report.source_traceability].filter(Boolean).forEach(
    (item) => {
      if (!item.source || !sets.source.has(item.source)) {
        throw new StopError("STOP_UNCITED_CLAIM", "Generated status cites a non-source-allowlisted path.", {
          source: item.source,
          scope: descriptor.scope,
        });
      }
    }
  );
}

function escapeCell(value) {
  return String(value)
    .replace(/\r?\n/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

function listText(value) {
  return asArray(value).join("; ");
}

function renderMarkdown(report, descriptor) {
  const lines = [];

  lines.push(descriptor.title);
  lines.push("");
  lines.push(`Status: ${report.status}`);
  lines.push(`Date: ${report.generated_date}`);
  lines.push(`Sprint: \`${report.sprint_id}\``);
  lines.push("");
  lines.push("## Safe-Use Note");
  lines.push("");
  lines.push(
    "This is an internal Dutch diagnostic report only. It is not an evidence pack, teacher/school-facing pack, public/external output, compliance claim, approval claim, inspection-ready claim, complete OP0 claim, PTA-validity claim, summative-validity claim, classroom-implementation proof, school-obligation proof, school-SKA proof, product-route adoption gate, diagnostics/mastery/PV gate, student-use authority, or product-use authority."
  );
  lines.push("");
  if ((descriptor.exactLessonProofPaths || []).length > 0) {
    lines.push(
      "No personal data is present. Exact allowlisted read-only lesson Markdown proof paths may be read and hash-validated; generated lesson-output scanning and mutation remain forbidden."
    );
  } else {
    lines.push("No personal data is present. No generated lesson output is read or mutated.");
  }
  lines.push("");
  lines.push("## Scope");
  lines.push("");
  lines.push(`- Chapter: ${report.scope.chapter}`);
  lines.push(`- Paragraphs: ${report.scope.paragraphs.map((item) => `\`${item}\``).join(", ")}`);
  lines.push(`- Language: ${report.scope.language}`);
  lines.push(`- Report surface: ${report.scope.report_surface}`);
  lines.push(`- Evidence status: \`${report.evidence_status}\``);
  lines.push("");
  lines.push("## Product End-State And Original Spec");
  lines.push("");
  lines.push(`- Product end-state: \`${report.product_end_state}\``);
  if (report.strategic_product_vision) lines.push(`- Strategic product vision: \`${report.strategic_product_vision}\``);
  if (report.quality_standards_end_state) lines.push(`- Quality standards end-state: \`${report.quality_standards_end_state}\``);
  lines.push(`- Original sprint/gate spec: \`${report.original_sprint_gate_spec}\``);
  lines.push(`- Controlling implementation gate: \`${report.controlling_implementation_gate}\``);
  lines.push("");
  lines.push("## 4veco_product_evidence");
  lines.push("");
  lines.push("| Target | Status | Evidence | Flags | Source |");
  lines.push("|---|---|---|---|---|");
  report["4veco_product_evidence"].forEach((item) => {
    lines.push(
      `| \`${escapeCell(item.target)}\` | \`${escapeCell(item.status)}\` | ${escapeCell(
        listText(item.evidence_summary)
      )} | ${escapeCell(listText(item.flags))} | \`${escapeCell(item.source)}\` |`
    );
  });
  lines.push("");
  if (report.target_reconciliation) {
    lines.push("## target_reconciliation");
    lines.push("");
    lines.push("| Target | Registry status | Classification | blocks | does_not_block | proof_required_to_close | Source |");
    lines.push("|---|---|---|---|---|---|---|");
    report.target_reconciliation.forEach((item) => {
      lines.push(
        `| \`${escapeCell(item.target)}\` | \`${escapeCell(item.registry_status)}\` | \`${escapeCell(
          item.classification
        )}\` | ${escapeCell(listText(item.blocks))} | ${escapeCell(listText(item.does_not_block))} | ${escapeCell(
          item.proof_required_to_close
        )} | \`${escapeCell(item.source)}\` |`
      );
    });
    lines.push("");
  }
  lines.push("## weak_or_missing_evidence");
  lines.push("");
  lines.push("| Area | Status | Evidence | Boundary | Source |");
  lines.push("|---|---|---|---|---|");
  report.weak_or_missing_evidence.forEach((item) => {
    lines.push(
      `| \`${escapeCell(item.area)}\` | \`${escapeCell(item.status)}\` | ${escapeCell(
        item.evidence
      )} | ${escapeCell(item.boundary)} | \`${escapeCell(item.source)}\` |`
    );
  });
  lines.push("");
  lines.push("## blockers");
  lines.push("");
  lines.push("| ID | Finding | Classification | blocks | does_not_block | proof_required_to_close | Source |");
  lines.push("|---|---|---|---|---|---|---|");
  report.blockers.forEach((item) => {
    lines.push(
      `| \`${escapeCell(item.id)}\` | ${escapeCell(item.finding)} | \`${escapeCell(
        item.classification
      )}\` | ${escapeCell(item.blocks)} | ${escapeCell(item.does_not_block)} | ${escapeCell(
        item.proof_required_to_close
      )} | \`${escapeCell(item.source)}\` |`
    );
  });
  lines.push("");
  lines.push("## school_owned_evidence_still_needed");
  lines.push("");
  lines.push("| Item | Reason | Source |");
  lines.push("|---|---|---|");
  report.school_owned_evidence_still_needed.forEach((item) => {
    lines.push(`| ${escapeCell(item.item)} | ${escapeCell(item.reason)} | \`${escapeCell(item.source)}\` |`);
  });
  lines.push("");
  lines.push("## forbidden_inference");
  lines.push("");
  lines.push("| Forbidden inference | Source |");
  lines.push("|---|---|");
  report.forbidden_inference.forEach((item) => {
    lines.push(`| ${escapeCell(item.inference)} | \`${escapeCell(item.source)}\` |`);
  });
  lines.push("");
  if (report.source_traceability) {
    lines.push("## source_traceability");
    lines.push("");
    lines.push(`Decision: \`${report.source_traceability.decision}\``);
    lines.push("");
    lines.push(`Record: \`${report.source_traceability.record}\``);
    lines.push("");
    lines.push(report.source_traceability.stale_blueprint_prose_policy);
    lines.push("");
    lines.push(`Source: \`${report.source_traceability.source}\``);
    lines.push("");
  }
  lines.push("## public_external_sharing_status");
  lines.push("");
  lines.push(`Status: \`${report.public_external_sharing_status.status}\``);
  lines.push("");
  lines.push(report.public_external_sharing_status.explanation);
  lines.push("");
  lines.push(`Source: \`${report.public_external_sharing_status.source}\``);
  lines.push("");
  lines.push("## owner_next_action");
  lines.push("");
  lines.push(report.owner_next_action.action);
  lines.push("");
  lines.push(`Source: \`${report.owner_next_action.source}\``);
  lines.push("");
  lines.push("## proof_required_to_close");
  lines.push("");
  report.proof_required_to_close.forEach((item) => {
    lines.push(`- ${item}`);
  });
  lines.push("");
  lines.push("## refusal_status");
  lines.push("");
  lines.push(`Status: \`${report.refusal_status.status}\``);
  lines.push("");
  lines.push(report.refusal_status.explanation);
  lines.push("");
  lines.push("## Refusal Policy");
  lines.push("");
  lines.push("| Code | Condition |");
  lines.push("|---|---|");
  report.refusal_policy.forEach((item) => {
    lines.push(`| \`${escapeCell(item.code)}\` | ${escapeCell(item.condition)} |`);
  });
  lines.push("");
  lines.push("## Source Files Used");
  lines.push("");
  lines.push("| Source | SHA-256 | Bytes |");
  lines.push("|---|---|---:|");
  report.source_files_used.forEach((item) => {
    lines.push(`| \`${escapeCell(item.path)}\` | \`${item.sha256}\` | ${item.bytes} |`);
  });
  lines.push("");
  lines.push("## Output Files Written");
  lines.push("");
  report.output_files_written.forEach((item) => {
    lines.push(`- \`${item}\``);
  });
  lines.push("");
  lines.push("## Output Boundary");
  lines.push("");
  lines.push("| Field | Value |");
  lines.push("|---|---|");
  lines.push(`| diagnostic_only | \`${report.diagnostic_only}\` |`);
  lines.push(`| internal_only | \`${report.internal_only}\` |`);
  lines.push(`| manual_invocation_only | \`${report.manual_invocation_only}\` |`);
  lines.push(`| evidence_pack_generated | \`${report.evidence_pack_generated}\` |`);
  lines.push(`| teacher_school_pack_generated | \`${report.teacher_school_pack_generated}\` |`);
  lines.push(`| public_external_facing_output_generated | \`${report.public_external_facing_output_generated}\` |`);
  lines.push(`| package_script_or_ci_integration_created | \`${report.package_script_or_ci_integration_created}\` |`);
  lines.push(`| dashboard_gate_created | \`${report.dashboard_gate_created}\` |`);
  lines.push(`| quality_ref_or_scale_gate_integration_created | \`${report.quality_ref_or_scale_gate_integration_created}\` |`);
  lines.push(`| generated_lesson_output_mutated | \`${report.generated_lesson_output_mutated}\` |`);
  lines.push(`| source_registry_mutated | \`${report.source_registry_mutated}\` |`);
  lines.push(`| personal_data_present | \`${report.personal_data_present}\` |`);

  return `${lines.join("\n")}\n`;
}

function outputContents(report, descriptor) {
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = renderMarkdown(report, descriptor);
  return new Map([
    [descriptor.outputPaths.find((item) => item.endsWith(".json")), json],
    [descriptor.outputPaths.find((item) => item.endsWith(".md")), markdown],
  ]);
}

function parseMode(args) {
  let check = false;
  let scope = "chapter-1-2";
  const unknown = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--check") {
      check = true;
    } else if (arg === "--scope") {
      index += 1;
      if (!args[index]) {
        throw new StopError("STOP_UNKNOWN_SCOPE", "Missing value after --scope.", { args });
      }
      scope = args[index];
    } else if (arg.startsWith("--scope=")) {
      scope = arg.slice("--scope=".length);
    } else {
      unknown.push(arg);
    }
  }

  if (scope !== "all" && !SCOPE_DESCRIPTORS[scope]) {
    throw new StopError("STOP_UNKNOWN_SCOPE", `Unknown diagnostic report scope: ${scope}`, { scope });
  }

  const joined = unknown.join(" ").toLowerCase();
  if (joined.includes("pack-strength") || joined.includes("evidence-pack") || joined.includes("teacher") || joined.includes("school-facing")) {
    throw new StopError("STOP_PACK_STRENGTH_REQUEST", "Requested output is outside internal diagnostic scope.", {
      args: unknown,
    });
  }
  if (joined.includes("public") || joined.includes("external")) {
    throw new StopError("STOP_PUBLIC_EXTERNAL_REQUEST", "Public/external generated output is not authorised.", {
      args: unknown,
    });
  }
  if (joined.includes("personal") || joined.includes("student-data")) {
    throw new StopError("STOP_PERSONAL_DATA", "Personal data processing is not authorised.", { args: unknown });
  }
  if (
    joined.includes("scale") ||
    joined.includes("package") ||
    joined.includes("ci") ||
    joined.includes("build") ||
    joined.includes("dashboard") ||
    joined.includes("quality-ref") ||
    joined.includes("product-route") ||
    joined.includes("mastery") ||
    joined.includes("diagnostics") ||
    joined.includes("pv") ||
    joined.includes("product-use") ||
    joined.includes("student-use")
  ) {
    throw new StopError(
      "STOP_DOWNSTREAM_GATE_AUTHORITY",
      "Downstream gate authority is outside diagnostic report scope.",
      { args: unknown }
    );
  }
  if (
    joined.includes("lesson-output") ||
    joined.includes("lesson-output-scan") ||
    joined.includes("references/machine") ||
    joined.includes("references/external")
  ) {
    throw new StopError(
      "STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE",
      "Lesson-output or protected-reference access is outside diagnostic report scope.",
      { args: unknown }
    );
  }
  if (unknown.length > 0) {
    throw new StopError("STOP_OUTPUT_ALLOWLIST_MISMATCH", "Unsupported argument for diagnostic report generator.", {
      args: unknown,
    });
  }

  const scopes = scope === "all" ? Object.values(SCOPE_DESCRIPTORS) : [SCOPE_DESCRIPTORS[scope]];
  return { check, scope, scopes };
}

function buildReportForScope(scope) {
  const descriptor = typeof scope === "string" ? SCOPE_DESCRIPTORS[scope] : scope;
  if (!descriptor) {
    throw new StopError("STOP_UNKNOWN_SCOPE", `Unknown diagnostic report scope: ${scope}`, { scope });
  }
  return descriptor.buildReport(descriptor);
}

function writeOrCheck(descriptor, contents, check) {
  const mismatches = [];
  const sets = descriptorSets(descriptor);
  for (const [outputPath, content] of contents.entries()) {
    if (!sets.output.has(outputPath)) {
      throw new StopError("STOP_OUTPUT_ALLOWLIST_MISMATCH", `Output is not allowlisted: ${outputPath}`);
    }

    const fullPath = repoPath(outputPath);
    if (check) {
      const current = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
      if (current !== content) {
        mismatches.push(outputPath);
      }
      continue;
    }

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf8");
  }

  if (mismatches.length > 0) {
    throw new Error(`Diagnostic report output is stale for ${descriptor.scope}: ${mismatches.join(", ")}`);
  }
}

function run(mode) {
  const completedScopes = [];
  for (const descriptor of mode.scopes) {
    const report = buildReportForScope(descriptor);
    writeOrCheck(descriptor, outputContents(report, descriptor), mode.check);
    completedScopes.push(descriptor.scope);
  }
  return completedScopes;
}

function main() {
  try {
    const mode = parseMode(process.argv.slice(2));
    const completedScopes = run(mode);
    console.log(
      mode.check
        ? `Diagnostic report output is current for scopes: ${completedScopes.join(", ")}.`
        : `Diagnostic report generated for scopes: ${completedScopes.join(", ")}.`
    );
  } catch (error) {
    if (error instanceof StopError) {
      console.error(
        JSON.stringify(
          {
            refusal_code: error.code,
            message: error.message,
            details: error.details,
          },
          null,
          2
        )
      );
      process.exit(1);
    }

    console.error(error.message || error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  COMMON_STOP_CODES,
  GLOBAL_STOP_CODES,
  SCOPE_DESCRIPTORS,
  StopError,
  buildReportForScope,
  canonicalize,
  normalizePath,
  outputContents,
  parseMode,
  semanticHash,
  semanticSnapshot,
  sha256,
};
