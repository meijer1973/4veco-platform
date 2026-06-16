#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const GENERATED_DATE = "2026-06-16";
const REPORT_ID = "chapter-1-2-diagnostic-report";

const SOURCE_PATHS = [
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

const OUTPUT_PATHS = [
  "reports/inspection-standards/chapter-1-2-diagnostic-report.md",
  "reports/inspection-standards/chapter-1-2-diagnostic-report.json",
];

const INSPECT_10A_OUTPUT_ALLOWLIST = new Set([
  "archive/sprints/INSPECT-10B/INSPECT-10B-sprint-plan.md",
  "archive/sprints/INSPECT-10B/INSPECT-10B-planning-review.md",
  "archive/sprints/INSPECT-10B/INSPECT-10B-validation-log.md",
  "archive/sprints/INSPECT-10B/INSPECT-10B-lead-review-assignment.md",
  "archive/sprints/INSPECT-10B/INSPECT-10B-lead-review-round1.md",
  "archive/sprints/INSPECT-10B/INSPECT-10B-closure-log.md",
  "build-scripts/inspection/build-dutch-diagnostic-report.js",
  "reports/inspection-standards/chapter-1-2-diagnostic-report.md",
  "reports/inspection-standards/chapter-1-2-diagnostic-report.json",
  "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
  "docs/roadmaps/quality-standards/sprint-ledger.md",
  "docs/roadmaps/quality-standards/quality-standards-end-state.md",
  "docs/roadmaps/roadmap-version-index.md",
  "docs/roadmaps/roadmap-version-index.json",
]);

const STOP_CODES = [
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

function readUtf8(filePath) {
  const allowed = new Set(SOURCE_PATHS);
  const normalized = normalizePath(filePath);

  if (!allowed.has(normalized)) {
    throw new StopError("STOP_SOURCE_ALLOWLIST_MISMATCH", `Source path is not allowlisted: ${filePath}`);
  }

  if (
    normalized.startsWith("../4veco-lessen/") &&
    !normalized.startsWith("../4veco-lessen/specifications/")
  ) {
    throw new StopError(
      "STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE",
      `Lesson output path is not allowlisted: ${filePath}`
    );
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

function readJson(filePath) {
  const raw = readUtf8(filePath);
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new StopError("STOP_MISSING_SOURCE", `Required JSON source is invalid: ${filePath}`, {
      path: filePath,
      error: error.message,
    });
  }
}

function sourceMetadata() {
  return SOURCE_PATHS.map((sourcePath) => {
    const content = readUtf8(sourcePath);
    return {
      path: sourcePath,
      sha256: sha256(content),
      bytes: Buffer.byteLength(content, "utf8"),
    };
  });
}

function gitHeadFor(relativePath) {
  const fullPath = repoPath(relativePath);
  const cwd = fs.statSync(fullPath).isDirectory() ? fullPath : path.dirname(fullPath);

  try {
    return childProcess
      .execFileSync("git", ["-C", cwd, "rev-parse", "HEAD"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      })
      .trim();
  } catch (_) {
    return "not_available";
  }
}

function statusForTarget(proofStatus) {
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

function targetEvidence(proof) {
  return proof.target_proof_records.map((record) => ({
    target: record.paragraph_id,
    status: statusForTarget(record.proof_status),
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

function weakEvidence(proof) {
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

function blockerLedger(planning, proof) {
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

function schoolEvidenceStillNeeded() {
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

function forbiddenInferences() {
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

function refusalPolicy() {
  return STOP_CODES.map((code) => {
    const conditions = {
      STOP_SOURCE_ALLOWLIST_MISMATCH: "A requested source path is outside the INSPECT-10A source allowlist.",
      STOP_OUTPUT_ALLOWLIST_MISMATCH: "A requested output path is outside the INSPECT-10A output allowlist.",
      STOP_MISSING_SOURCE: "A required source file is missing or invalid.",
      STOP_HIDDEN_BLOCKER: "A generated report would omit a carried Chapter 1.2 or check-surface blocker.",
      STOP_PACK_STRENGTH_REQUEST: "A request asks for pack-strength, teacher/school-facing, or evidence-pack language.",
      STOP_PUBLIC_EXTERNAL_REQUEST: "A request asks for public/external generated output or public/external sharing.",
      STOP_PERSONAL_DATA: "A request introduces student-level, school-identifiable, or personal data.",
      STOP_DOWNSTREAM_GATE_AUTHORITY: "A request tries to unlock package/CI, dashboard, quality-ref, Scale Gate, product-route, diagnostics/mastery/PV, student-use, or product-use authority.",
      STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE: "A request reads or mutates lesson output or protected references outside the exact allowlist.",
      STOP_UNCITED_CLAIM: "A generated claim lacks a source path.",
    };
    return { code, condition: conditions[code] };
  });
}

function buildReport() {
  const planning = readJson("reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json");
  const proof = readJson("reports/inspection-standards/chapter-1-2-proof-support-remediation.json");
  readJson("reports/inspection-standards/chapter-1-2-target-equivalent-accessibility-support-review.json");
  readJson("reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.json");
  readJson("reports/inspection-standards/dutch-evidence-scale-readiness.json");
  readJson("reports/inspection-standards/dutch-evidence-gap-closure-plan.json");
  readJson("reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json");

  const report = {
    schema_version: 1,
    report_id: REPORT_ID,
    sprint_id: "INSPECT-10B",
    generated_date: GENERATED_DATE,
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
    source_files_used: sourceMetadata(),
    source_checkout_notes: {
      platform_head_policy:
        "not_embedded_in_generated_output; use validation logs and PR CI for platform commit evidence",
      lesson_specs_head: gitHeadFor("../4veco-lessen"),
      lesson_specs_mode: "read-only specification source; no generated lesson-output path is read",
    },
    evidence_status: "diagnostic_candidate_with_blocker",
    diagnostic_status_vocabulary: planning.diagnostic_status_vocabulary,
    input_eligibility_decisions: planning.input_eligibility_decisions,
    "4veco_product_evidence": targetEvidence(proof),
    weak_or_missing_evidence: weakEvidence(proof),
    blockers: blockerLedger(planning, proof),
    school_owned_evidence_still_needed: schoolEvidenceStillNeeded(),
    forbidden_inference: forbiddenInferences(),
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
    refusal_policy: refusalPolicy(),
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
    output_files_written: OUTPUT_PATHS,
  };

  report.proof_required_to_close = Array.from(
    new Set(report.blockers.map((blocker) => blocker.proof_required_to_close).filter(Boolean))
  );

  assertReportSafety(report);
  return report;
}

function assertReportSafety(report) {
  const sourceSet = new Set(SOURCE_PATHS);
  for (const source of report.source_files_used) {
    if (!sourceSet.has(source.path)) {
      throw new StopError("STOP_SOURCE_ALLOWLIST_MISMATCH", `Unexpected source in report: ${source.path}`);
    }
  }

  for (const outputPath of OUTPUT_PATHS) {
    if (!INSPECT_10A_OUTPUT_ALLOWLIST.has(outputPath)) {
      throw new StopError("STOP_OUTPUT_ALLOWLIST_MISMATCH", `Output is not allowlisted: ${outputPath}`);
    }
  }

  const text = JSON.stringify(report).toLowerCase();
  const requiredBlockerTerms = ["1.2.2", "1.2.4", "accessibility", "support", "check-surface"];
  const missingTerms = requiredBlockerTerms.filter((term) => !text.includes(term));
  if (missingTerms.length > 0) {
    throw new StopError("STOP_HIDDEN_BLOCKER", "Generated report is missing required blocker terms.", {
      missing_terms: missingTerms,
    });
  }

  const claimLists = [
    report["4veco_product_evidence"],
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
        });
      }
      if (!sourceSet.has(item.source)) {
        throw new StopError("STOP_UNCITED_CLAIM", "Generated claim cites a non-source-allowlisted path.", {
          source: item.source,
        });
      }
    }
  }

  [report.public_external_sharing_status, report.owner_next_action].forEach((item) => {
    if (!item.source || !sourceSet.has(item.source)) {
      throw new StopError("STOP_UNCITED_CLAIM", "Generated status cites a non-source-allowlisted path.", {
        source: item.source,
      });
    }
  });
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

function renderMarkdown(report) {
  const lines = [];

  lines.push("# INSPECT-10B Chapter 1.2 Internal Diagnostic Report");
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
  lines.push("No personal data is present. No generated lesson output is read or mutated.");
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

function outputContents(report) {
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = renderMarkdown(report);
  return new Map([
    ["reports/inspection-standards/chapter-1-2-diagnostic-report.json", json],
    ["reports/inspection-standards/chapter-1-2-diagnostic-report.md", markdown],
  ]);
}

function checkRequestedMode(args) {
  const check = args.includes("--check");
  const unknown = args.filter((arg) => arg !== "--check");
  const joined = unknown.join(" ").toLowerCase();

  if (joined.includes("pack-strength") || joined.includes("evidence-pack") || joined.includes("teacher")) {
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
      "Downstream gate authority is outside INSPECT-10B scope.",
      { args: unknown }
    );
  }
  if (joined.includes("lesson-output") || joined.includes("references/machine") || joined.includes("references/external")) {
    throw new StopError(
      "STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE",
      "Lesson-output or protected-reference access is outside INSPECT-10B scope.",
      { args: unknown }
    );
  }
  if (unknown.length > 0) {
    throw new StopError("STOP_OUTPUT_ALLOWLIST_MISMATCH", "Unsupported argument for diagnostic report generator.", {
      args: unknown,
    });
  }

  return { check };
}

function writeOrCheck(contents, check) {
  const mismatches = [];
  for (const [outputPath, content] of contents.entries()) {
    if (!OUTPUT_PATHS.includes(outputPath) || !INSPECT_10A_OUTPUT_ALLOWLIST.has(outputPath)) {
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
    throw new Error(`Diagnostic report output is stale: ${mismatches.join(", ")}`);
  }
}

function main() {
  try {
    const mode = checkRequestedMode(process.argv.slice(2));
    const report = buildReport();
    writeOrCheck(outputContents(report), mode.check);
    console.log(
      mode.check
        ? "INSPECT-10B diagnostic report output is current."
        : "INSPECT-10B diagnostic report generated."
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

main();
