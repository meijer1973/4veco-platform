#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const SOURCE_PATHS = [
  "docs/roadmaps/quality-standards/quality-standards-end-state.md",
  "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
  "docs/roadmaps/quality-standards/sprint-ledger.md",
  "references/data/inspection-standards/source-register.json",
  "references/data/inspection-standards/nl-vo-evidence-profile.v0.json",
  "docs/inspection-standards/nl-vo-evidence-model.md",
  "docs/inspection-standards/external-review-privacy-and-claim-guardrails.md",
  "docs/inspection-standards/teacher-facing-evidence-pack-template.md",
  "build-scripts/inspection/validate-inspection-evidence.js",
  "docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md",
  "archive/sprints/INSPECT-11EF/INSPECT-11EF-closure-log.md",
  "archive/sprints/INSPECT-11EF/INSPECT-11EF-final-lead-review.md",
  "archive/sprints/INSPECT-11EF/INSPECT-11EF-validation-log.md",
  "archive/sprints/INSPECT-11EF/INSPECT-11EF-specialist-gate-results.md",
  "reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json",
  "reports/inspection-standards/internal-diagnostic-scope-readiness.json",
  "reports/inspection-standards/chapter-1-3-readiness-closure.json",
  "reports/inspection-standards/chapter-1-2-diagnostic-report.json",
  "reports/inspection-standards/chapter-1-3-diagnostic-report.json",
  "../4veco-lessen/specifications/product-end-state.md",
  "../4veco-lessen/specifications/product-vision.md",
];

const OUTPUT_PATHS = [
  "reports/inspection-standards/dutch-quality-standards-closure-candidate.md",
  "reports/inspection-standards/dutch-quality-standards-closure-candidate.json",
];

const FALSE_FLAGS = [
  "evidence_pack_generated",
  "teacher_school_facing_output_generated",
  "public_external_output_generated",
  "public_external_sharing_authorized",
  "package_script_or_ci_integration_created",
  "dashboard_gate_created",
  "quality_ref_or_scale_gate_integration_created",
  "generated_lesson_output_mutated",
  "protected_reference_or_source_registry_mutated",
  "personal_data_present",
  "product_route_adoption_authorized",
  "diagnostics_mastery_pv_authorized",
  "student_or_product_use_authorized",
  "non_dutch_standards_work_authorized",
  "compliance_or_approval_claim",
  "inspection_readiness_claim",
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

function readUtf8(relativePath) {
  const normalized = normalizePath(relativePath);
  if (!SOURCE_PATHS.includes(normalized)) {
    throw new StopError("STOP_SOURCE_ALLOWLIST_MISMATCH", `Source path is not allowlisted: ${relativePath}`);
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

function buildReport() {
  const report = {
    schema_version: 1,
    report_id: "dutch-quality-standards-closure-candidate",
    sprint_id: "GOAL-DQS-CLOSURE-1",
    generated_date: "2026-06-20",
    status: "current_authority_closure_candidate",
    dutch_only: true,
    internal_closure_candidate_only: true,
    human_review_required: true,
    evidence_pack_generated: false,
    teacher_school_facing_output_generated: false,
    public_external_output_generated: false,
    public_external_sharing_authorized: false,
    package_script_or_ci_integration_created: false,
    dashboard_gate_created: false,
    quality_ref_or_scale_gate_integration_created: false,
    generated_lesson_output_mutated: false,
    protected_reference_or_source_registry_mutated: false,
    personal_data_present: false,
    product_route_adoption_authorized: false,
    diagnostics_mastery_pv_authorized: false,
    student_or_product_use_authorized: false,
    non_dutch_standards_work_authorized: false,
    compliance_or_approval_claim: false,
    inspection_readiness_claim: false,
    product_end_state: "../4veco-lessen/specifications/product-end-state.md",
    strategic_product_vision: "../4veco-lessen/specifications/product-vision.md",
    quality_standards_end_state: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
    original_sprint_gate_spec: "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
    controlling_recent_gate: "archive/sprints/INSPECT-11EF/INSPECT-11EF-closure-log.md",
    source_files_used: sourceMetadata(),
    non_negotiable_requirements: [
      "Use REV-STD-1 for review packet, validation, closure, and PR body.",
      "Cite product end-state and the original sprint/gate spec.",
      "Name non-negotiable requirements.",
      "Include a core-requirement checklist.",
      "Classify findings with blocks, does_not_block, and proof_required_to_close.",
      "PASS WITH FLAGS may not carry a missing core requirement.",
      "Close only the current authorised Dutch quality-standards layer, not L4/L5 teacher/school-facing maturity.",
      "Keep evidence packs, teacher/school-facing output, public/external output, package/CI/dashboard gates, quality-ref, Scale Gate, product-route adoption, diagnostics/mastery/PV, student/product-use, personal data, and compliance/approval claims blocked.",
      "Do not mutate generated lesson output, protected references, source registries, or external source records.",
    ],
    core_requirement_checklist: [
      {
        requirement: "Product end-state cited",
        status: "met",
        evidence: "../4veco-lessen/specifications/product-end-state.md",
      },
      {
        requirement: "Original sprint/gate spec cited",
        status: "met",
        evidence: "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
      },
      {
        requirement: "Current authorised DQS layer inventoried",
        status: "met",
        evidence: "maturity_assessment and authorised_surfaces",
      },
      {
        requirement: "INSPECT-11E/F incorporated after PR #119 merge",
        status: "met",
        evidence: "archive/sprints/INSPECT-11EF/INSPECT-11EF-closure-log.md",
      },
      {
        requirement: "Closure recommendation does not carry missing L4/L5 requirements as PASS WITH FLAGS",
        status: "met",
        evidence: "maturity_assessment marks L4 and L5 blocked / future-authority-required",
      },
      {
        requirement: "All carried issues classify blocks, does_not_block, and proof_required_to_close",
        status: "met",
        evidence: "finding_classification",
      },
      {
        requirement: "No downstream authority unlocked",
        status: "met",
        evidence: "output_boundary and forbidden_inference",
      },
      {
        requirement: "Deterministic source/output allowlists used",
        status: "met",
        evidence: "source_files_used and output_files_written",
      },
    ],
    closure_recommendation: {
      decision: "close_current_authorised_dutch_quality_standards_layer_after_human_review",
      scope:
        "Close the current Dutch-only quality-standards layer as a reviewed internal/report-only evidence-support and diagnostic layer through Chapter 1.3. This is not full L5 maturity and does not authorise teacher/school-facing evidence packs, public output, product routes, Scale Gate, diagnostics/mastery/PV, student/product-use, personal-data processing, or compliance/approval claims.",
      owner_next_action:
        "Owner next action: review this closure candidate. If accepted, merge the PR and treat future INSPECT-12/13/14 work as fresh human-authorised sprints with the three-reviewer MORE_THAN_SATISFIED gate. If rejected, keep the current internal diagnostic layer merged but revise this closure packet before claiming system-level closure.",
    },
    maturity_assessment: [
      {
        level: "L0",
        name: "Setup",
        status: "met",
        evidence: "quality-standards roadmap, README, end-state, and sprint ledger exist.",
        source: "docs/roadmaps/quality-standards/sprint-ledger.md",
      },
      {
        level: "L1",
        name: "Source/profile design",
        status: "met_as_draft_bounded_profile_not_final",
        evidence:
          "Dutch source register and evidence profile exist with draft status and bounded Dutch-only use; they are not final, compliant, or inspection-ready.",
        source: "references/data/inspection-standards/nl-vo-evidence-profile.v0.json",
      },
      {
        level: "L2",
        name: "Evidence schema",
        status: "met_for_report_only_use",
        evidence: "Report-only schema and manual validator exist; no build/CI gate is created by this closure candidate.",
        source: "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
      },
      {
        level: "L3",
        name: "Bounded pack",
        status: "met_historically_for_inspect_7_scope",
        evidence: "INSPECT-7 produced a bounded Book 1 Chapter 1.1 first-three evidence-pack sample with three-reviewer MORE_THAN_SATISFIED results.",
        source: "reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json",
      },
      {
        level: "internal-diagnostic-layer",
        name: "Manual internal diagnostic reports",
        status: "met_for_chapter_1_2_and_chapter_1_3",
        evidence: "Chapter 1.2 and Chapter 1.3 internal diagnostic reports exist, are manual/internal only, and preserve blockers.",
        source: "docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md",
      },
      {
        level: "L4",
        name: "Dutch multi-scope scale",
        status: "blocked_future_authority_required",
        evidence: "Multi-scope evidence packs and pack-strength claims remain unauthorised.",
        source: "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
      },
      {
        level: "L5",
        name: "Dutch quality-control layer",
        status: "not_claimed",
        evidence: "Full teacher/school-facing quality-control maturity requires fresh INSPECT-12/13/14 authority and MORE_THAN_SATISFIED gates.",
        source: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
      },
    ],
    authorised_surfaces: [
      {
        surface: "Dutch source register and evidence profile",
        status: "draft_bounded_dutch_only",
        evidence: "references/data/inspection-standards/source-register.json; references/data/inspection-standards/nl-vo-evidence-profile.v0.json",
      },
      {
        surface: "Dutch quality-standards roadmap and governance docs",
        status: "active_dutch_only",
        evidence: "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
      },
      {
        surface: "Manual report-only inspection evidence validator",
        status: "manual_report_only",
        evidence: "build-scripts/inspection/validate-inspection-evidence.js",
      },
      {
        surface: "Bounded INSPECT-7 evidence-pack sample",
        status: "historical_bounded_sample_only",
        evidence: "reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json",
      },
      {
        surface: "Chapter 1.2 internal diagnostic report",
        status: "manual_internal_diagnostic_only",
        evidence: "reports/inspection-standards/chapter-1-2-diagnostic-report.json",
      },
      {
        surface: "Chapter 1.3 internal diagnostic report",
        status: "manual_internal_diagnostic_only",
        evidence: "reports/inspection-standards/chapter-1-3-diagnostic-report.json",
      },
      {
        surface: "Internal diagnostic operating procedure",
        status: "manual_internal_procedure_only",
        evidence: "docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md",
      },
    ],
    source_profile_status: {
      source_register_status: "draft",
      source_register_review_status: "draft_accepted_for_bounded_pilot_audit",
      evidence_profile_status: "draft",
      evidence_profile_review_status: "draft_dutch_scope_only_roadmap_proposed",
      active_scope: "Dutch VO/vwo-economie only",
      non_dutch_inventory_policy:
        "Non-Dutch standards sources, if present in the register, are historical or comparator inventory only and are not active DQS closure scope.",
      source: "references/data/inspection-standards/source-register.json",
      profile_source: "references/data/inspection-standards/nl-vo-evidence-profile.v0.json",
    },
    finding_classification: [
      {
        finding: "The current authorised Dutch quality-standards layer is ready for human closure review as an internal/report-only evidence-support and diagnostic layer.",
        classification: "closure_candidate",
        blocks: "Nothing inside the current internal/report-only closure candidate after human acceptance and green PR CI.",
        does_not_block: "Reviewing and merging this closure candidate.",
        proof_required_to_close: "REV-STD-1 packet, specialist gates, final lead PASS, fresh PR CI, and human acceptance.",
        source: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
      },
      {
        finding: "Full L4/L5 Dutch quality-control maturity is not claimed.",
        classification: "future_authority_required",
        blocks: "Multi-scope evidence packs, teacher/school-facing packs, public/external output, product-route adoption, Scale Gate, diagnostics/mastery/PV, student/product-use, and compliance/approval claims.",
        does_not_block: "Closing the current authorised internal/report-only DQS layer.",
        proof_required_to_close: "Fresh INSPECT-12/13/14-style sprints with explicit human authority and teacher, legal/privacy, and Dutch quality-inspection MORE_THAN_SATISFIED gates.",
        source: "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
      },
      {
        finding: "Source register and Dutch evidence profile remain draft/bounded rather than final compliance sources.",
        classification: "draft_source_profile_boundary",
        blocks: "Final source/profile authority, public/external claims, compliance/approval claims, and full L5 maturity.",
        does_not_block: "Current internal/report-only closure candidate because draft status and boundaries remain visible.",
        proof_required_to_close: "Fresh source/profile maintenance sprint with renewed review and explicit human acceptance before stronger source/profile authority.",
        source: "references/data/inspection-standards/nl-vo-evidence-profile.v0.json",
      },
      {
        finding: "Chapter 1.2 and Chapter 1.3 reports are internal diagnostic only.",
        classification: "downstream_gate_blocker",
        blocks: "Evidence-pack, teacher/school-facing, public/external, product-route, Scale Gate, diagnostics/mastery/PV, student/product-use, personal-data, compliance, approval, OP0, PTA, summative, and inspection-readiness authority.",
        does_not_block: "Manual internal diagnostic checks with blockers visible.",
        proof_required_to_close: "Renewed human review explicitly naming any stronger audience, output, integration, or authority.",
        source: "archive/sprints/INSPECT-11EF/INSPECT-11EF-closure-log.md",
      },
      {
        finding: "Check-surface authority remains separate.",
        classification: "downstream_gate_blocker",
        blocks: "Scale Gate 1, product-route adoption, diagnostics/mastery/PV, and student/product-use.",
        does_not_block: "DQS closure-candidate review and ordinary scoped PR work.",
        proof_required_to_close: "Renewed human review confirming check-surface gate closure and naming the authority unlocked.",
        source: "reports/inspection-standards/chapter-1-3-diagnostic-report.json",
      },
      {
        finding: "School-owned evidence is still needed before school-facing or external claims.",
        classification: "school_evidence_gap",
        blocks: "Teacher/school-facing reliance, public/external sharing, compliance, approval, OP0, PTA, summative, inspection-readiness, school-obligation, and school-SKA claims.",
        does_not_block: "Internal/report-only closure candidate with explicit boundaries.",
        proof_required_to_close: "Separate school-owned evidence route and renewed human review before any teacher/school-facing or public/external output.",
        source: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
      },
      {
        finding: "Book 1 Chapter 1.1 and Chapter 1.4 assembly-health failures are separate from DQS closure.",
        classification: "scope_boundary_flag",
        blocks: "Book 1 clean-health claims.",
        does_not_block: "DQS closure-candidate review because this packet does not claim Book 1 clean health.",
        proof_required_to_close: "Separate BOOK1-ASSEMBLY-HEALTH-1 route.",
        source: "archive/sprints/INSPECT-11EF/BOOK1-ASSEMBLY-HEALTH-1-triage-note.md",
      },
    ],
    forbidden_inference: [
      "This closure candidate proves 4veco is compliant, approved, inspection-ready, OP0-complete, PTA-valid, summative-valid, or school-SKA complete.",
      "This closure candidate authorises evidence-pack generation, teacher/school-facing output, public/external output or sharing.",
      "This closure candidate authorises package scripts, CI/build invocation, dashboard gates, quality-ref integration, Scale Gate integration, product-route adoption, diagnostics/mastery/PV, student-use, or product-use.",
      "This closure candidate authorises generated lesson-output mutation, protected-reference mutation, source-registry mutation, or personal-data processing.",
      "This closure candidate closes full L4/L5 Dutch quality-control maturity.",
    ],
    school_owned_evidence_still_needed: [
      "School implementation, classroom-use, monitoring, intervention, accommodation, and support evidence.",
      "PTA, grading, summative-validity, and assessment-policy evidence.",
      "School governance, SKA, inspection conversation, and competent-authority judgement evidence.",
    ],
    output_boundary: {
      evidence_pack_generated: false,
      teacher_school_facing_output_generated: false,
      public_external_output_generated: false,
      public_external_sharing_authorized: false,
      package_script_or_ci_integration_created: false,
      dashboard_gate_created: false,
      quality_ref_or_scale_gate_integration_created: false,
      generated_lesson_output_mutated: false,
      protected_reference_or_source_registry_mutated: false,
      personal_data_present: false,
      product_route_adoption_authorized: false,
      diagnostics_mastery_pv_authorized: false,
      student_or_product_use_authorized: false,
      non_dutch_standards_work_authorized: false,
      compliance_or_approval_claim: false,
      inspection_readiness_claim: false,
    },
    output_files_written: OUTPUT_PATHS,
  };

  report.proof_required_to_close = Array.from(
    new Set(report.finding_classification.map((finding) => finding.proof_required_to_close))
  );

  assertReportSafety(report);
  return report;
}

function assertReportSafety(report) {
  for (const flag of FALSE_FLAGS) {
    if (report[flag] !== false || report.output_boundary?.[flag] !== false) {
      throw new StopError("STOP_HIDDEN_BLOCKER", `${flag} must remain false.`);
    }
  }

  const used = (report.source_files_used || []).map((entry) => entry.path);
  if (JSON.stringify(used) !== JSON.stringify(SOURCE_PATHS)) {
    throw new StopError("STOP_SOURCE_ALLOWLIST_MISMATCH", "source_files_used no longer matches the exact allowlist.");
  }

  for (const entry of report.source_files_used || []) {
    const bytes = fs.readFileSync(repoPath(entry.path));
    if (entry.sha256 !== sha256(bytes) || entry.bytes !== bytes.length) {
      throw new StopError("STOP_SOURCE_ALLOWLIST_MISMATCH", `Source metadata mismatch: ${entry.path}`);
    }
  }

  if (JSON.stringify(report.output_files_written) !== JSON.stringify(OUTPUT_PATHS)) {
    throw new StopError("STOP_OUTPUT_ALLOWLIST_MISMATCH", "output_files_written no longer matches the exact allowlist.");
  }

  const text = JSON.stringify(report).toLowerCase();
  for (const required of [
    "product end-state",
    "original sprint/gate spec",
    "non-negotiable",
    "core-requirement",
    "blocks",
    "does_not_block",
    "proof_required_to_close",
    "pass with flags",
    "school-owned",
    "scale gate",
    "teacher/school-facing",
    "public/external",
  ]) {
    if (!text.includes(required)) {
      throw new StopError("STOP_HIDDEN_BLOCKER", `Closure candidate is missing required term: ${required}`);
    }
  }
}

function escapeCell(value) {
  return String(value)
    .replace(/\r?\n/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# GOAL-DQS-CLOSURE-1 Dutch Quality Standards Closure Candidate");
  lines.push("");
  lines.push(`Status: ${report.status}`);
  lines.push(`Date: ${report.generated_date}`);
  lines.push(`Sprint: \`${report.sprint_id}\``);
  lines.push("");
  lines.push("## Product End-State And Original Spec");
  lines.push("");
  lines.push(`- Product end-state: \`${report.product_end_state}\``);
  lines.push(`- Strategic product vision: \`${report.strategic_product_vision}\``);
  lines.push(`- Quality standards end-state: \`${report.quality_standards_end_state}\``);
  lines.push(`- Original sprint/gate spec: \`${report.original_sprint_gate_spec}\``);
  lines.push(`- Controlling recent gate: \`${report.controlling_recent_gate}\``);
  lines.push("");
  lines.push("## Non-Negotiable Requirements");
  lines.push("");
  report.non_negotiable_requirements.forEach((item) => lines.push(`- ${item}`));
  lines.push("");
  lines.push("## Core Requirement Checklist");
  lines.push("");
  lines.push("| Requirement | Status | Evidence |");
  lines.push("|---|---|---|");
  report.core_requirement_checklist.forEach((item) => {
    lines.push(`| ${escapeCell(item.requirement)} | \`${escapeCell(item.status)}\` | ${escapeCell(item.evidence)} |`);
  });
  lines.push("");
  lines.push("## Closure Recommendation");
  lines.push("");
  lines.push(`Decision: \`${report.closure_recommendation.decision}\``);
  lines.push("");
  lines.push(report.closure_recommendation.scope);
  lines.push("");
  lines.push(report.closure_recommendation.owner_next_action);
  lines.push("");
  lines.push("## Maturity Assessment");
  lines.push("");
  lines.push("| Level | Name | Status | Evidence | Source |");
  lines.push("|---|---|---|---|---|");
  report.maturity_assessment.forEach((item) => {
    lines.push(
      `| \`${escapeCell(item.level)}\` | ${escapeCell(item.name)} | \`${escapeCell(item.status)}\` | ${escapeCell(
        item.evidence
      )} | \`${escapeCell(item.source)}\` |`
    );
  });
  lines.push("");
  lines.push("## Authorised Surfaces");
  lines.push("");
  lines.push("| Surface | Status | Evidence |");
  lines.push("|---|---|---|");
  report.authorised_surfaces.forEach((item) => {
    lines.push(`| ${escapeCell(item.surface)} | \`${escapeCell(item.status)}\` | \`${escapeCell(item.evidence)}\` |`);
  });
  lines.push("");
  lines.push("## Source Profile Status");
  lines.push("");
  lines.push(`- Source register status: \`${report.source_profile_status.source_register_status}\``);
  lines.push(`- Source register review status: \`${report.source_profile_status.source_register_review_status}\``);
  lines.push(`- Evidence profile status: \`${report.source_profile_status.evidence_profile_status}\``);
  lines.push(`- Evidence profile review status: \`${report.source_profile_status.evidence_profile_review_status}\``);
  lines.push(`- Active scope: ${report.source_profile_status.active_scope}`);
  lines.push(`- Non-Dutch inventory policy: ${report.source_profile_status.non_dutch_inventory_policy}`);
  lines.push(`- Source: \`${report.source_profile_status.source}\``);
  lines.push(`- Profile source: \`${report.source_profile_status.profile_source}\``);
  lines.push("");
  lines.push("## Finding Classification");
  lines.push("");
  lines.push("| Finding | Classification | blocks | does_not_block | proof_required_to_close | Source |");
  lines.push("|---|---|---|---|---|---|");
  report.finding_classification.forEach((item) => {
    lines.push(
      `| ${escapeCell(item.finding)} | \`${escapeCell(item.classification)}\` | ${escapeCell(
        item.blocks
      )} | ${escapeCell(item.does_not_block)} | ${escapeCell(item.proof_required_to_close)} | \`${escapeCell(
        item.source
      )}\` |`
    );
  });
  lines.push("");
  lines.push("## Forbidden Inference");
  lines.push("");
  report.forbidden_inference.forEach((item) => lines.push(`- ${item}`));
  lines.push("");
  lines.push("## School-Owned Evidence Still Needed");
  lines.push("");
  report.school_owned_evidence_still_needed.forEach((item) => lines.push(`- ${item}`));
  lines.push("");
  lines.push("## Proof Required To Close");
  lines.push("");
  report.proof_required_to_close.forEach((item) => lines.push(`- ${item}`));
  lines.push("");
  lines.push("## Source Files Used");
  lines.push("");
  lines.push("| Source | SHA-256 | Bytes |");
  lines.push("|---|---|---:|");
  report.source_files_used.forEach((item) => {
    lines.push(`| \`${escapeCell(item.path)}\` | \`${item.sha256}\` | ${item.bytes} |`);
  });
  lines.push("");
  lines.push("## Output Boundary");
  lines.push("");
  lines.push("| Field | Value |");
  lines.push("|---|---|");
  Object.entries(report.output_boundary).forEach(([field, value]) => {
    lines.push(`| ${field} | \`${value}\` |`);
  });
  lines.push("");
  lines.push("## Output Files Written");
  lines.push("");
  report.output_files_written.forEach((item) => lines.push(`- \`${item}\``));
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function outputContents(report) {
  return new Map([
    [OUTPUT_PATHS.find((item) => item.endsWith(".json")), `${JSON.stringify(report, null, 2)}\n`],
    [OUTPUT_PATHS.find((item) => item.endsWith(".md")), renderMarkdown(report)],
  ]);
}

function parseMode(argv) {
  const args = argv.slice(2);
  const check = args.includes("--check");
  const unknown = args.filter((arg) => arg !== "--check");
  const joined = unknown.join(" ").toLowerCase();

  if (/teacher|school|evidence-pack|pack-strength/.test(joined)) {
    throw new StopError("STOP_PACK_STRENGTH_REQUEST", "Teacher/school/evidence-pack output is not authorised.", {
      args: unknown,
    });
  }
  if (/public|external/.test(joined)) {
    throw new StopError("STOP_PUBLIC_EXTERNAL_REQUEST", "Public/external output or sharing is not authorised.", {
      args: unknown,
    });
  }
  if (/personal|student-data/.test(joined)) {
    throw new StopError("STOP_PERSONAL_DATA", "Personal data processing is not authorised.", { args: unknown });
  }
  if (/scale|package|ci|build|dashboard|quality-ref|product-route|mastery|diagnostics|pv|product-use|student-use/.test(joined)) {
    throw new StopError("STOP_DOWNSTREAM_GATE_AUTHORITY", "Downstream gate authority is not authorised.", {
      args: unknown,
    });
  }
  if (/non-dutch|foreign|international/.test(joined)) {
    throw new StopError("STOP_NON_DUTCH_SCOPE_REQUEST", "Non-Dutch standards work is not authorised in this closure candidate.", {
      args: unknown,
    });
  }
  if (/compliance|approval|inspection-ready|inspection-readiness|op0|pta|summative|school-ska/.test(joined)) {
    throw new StopError(
      "STOP_COMPLIANCE_APPROVAL_CLAIM",
      "Compliance, approval, inspection-readiness, OP0, PTA, summative, and school-SKA claims are not authorised.",
      { args: unknown }
    );
  }
  if (/lesson-output|references\/machine|references\/external/.test(joined)) {
    throw new StopError("STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE", "Protected sources or lesson output are not authorised.", {
      args: unknown,
    });
  }
  if (unknown.length > 0) {
    throw new StopError("STOP_OUTPUT_ALLOWLIST_MISMATCH", "Unsupported argument for DQS closure candidate.", {
      args: unknown,
    });
  }

  return { check };
}

function writeOrCheck(contents, check) {
  const mismatches = [];
  for (const [outputPath, content] of contents.entries()) {
    if (!OUTPUT_PATHS.includes(outputPath)) {
      throw new StopError("STOP_OUTPUT_ALLOWLIST_MISMATCH", `Output is not allowlisted: ${outputPath}`);
    }
    const fullPath = repoPath(outputPath);
    if (check) {
      const current = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
      if (current !== content) mismatches.push(outputPath);
      continue;
    }
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf8");
  }
  if (mismatches.length > 0) {
    throw new Error(`DQS closure candidate output is stale: ${mismatches.join(", ")}`);
  }
}

function run(mode) {
  const report = buildReport();
  writeOrCheck(outputContents(report), mode.check);
  return report;
}

function main() {
  try {
    const mode = parseMode(process.argv);
    run(mode);
    console.log(mode.check ? "DQS closure candidate output is current." : "DQS closure candidate generated.");
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

if (require.main === module) main();

module.exports = {
  OUTPUT_PATHS,
  SOURCE_PATHS,
  StopError,
  buildReport,
  normalizePath,
  outputContents,
  parseMode,
  sha256,
};
