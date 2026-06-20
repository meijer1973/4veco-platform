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
  "reports/inspection-standards/dutch-quality-standards-rollup.md",
  "reports/inspection-standards/dutch-quality-standards-rollup.json",
  "reports/inspection-standards/dutch-school-evidence-pack-candidate.md",
  "reports/inspection-standards/dutch-school-evidence-pack-candidate.json",
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
  "personal_data_processing_authorized",
  "product_route_adoption_authorized",
  "diagnostics_mastery_pv_authorized",
  "student_or_product_use_authorized",
  "non_dutch_standards_work_authorized",
  "international_work_authorized",
  "school_pack_trial_authorized",
  "teacher_school_distribution_authorized",
  "public_distribution_authorized",
  "compliance_or_approval_claim",
  "inspection_readiness_claim",
  "op0_complete_claim",
  "pta_validity_claim",
  "summative_validity_claim",
  "school_implementation_evidence_claim",
];

const DECISION_OPTIONS = [
  "CLOSE_INTERNAL_SYSTEM",
  "AUTHORISE_BOUNDED_SCHOOL_PACK_TRIAL",
  "REMEDIATE_BEFORE_CLOSURE",
];

const SELECTED_DECISION = "CLOSE_INTERNAL_SYSTEM";

const PACK_FIRST_SCREEN = [
  "INTERNAL CANDIDATE ONLY",
  "NOT FOR SCHOOL OR PUBLIC DISTRIBUTION",
  "NOT INSPECTION APPROVAL",
  "NOT LEGAL COMPLIANCE",
  "NOT COMPLETE OP0 EVIDENCE",
  "NOT SCHOOL IMPLEMENTATION EVIDENCE",
  "NOT PTA OR SUMMATIVE VALIDITY",
];

const PACK_SECTION_ORDER = [
  "scope and safe-use boundary",
  "curriculum coherence",
  "subject-relevant basic skills",
  "didactic design",
  "assessment alignment",
  "support and differentiation",
  "accessibility",
  "quality assurance",
  "improvement cycle",
  "school-owned evidence still needed",
  "known blockers",
  "safe claims",
  "forbidden claims",
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

function boundaryFlags() {
  return Object.fromEntries(FALSE_FLAGS.map((flag) => [flag, false]));
}

function commonReportFields(reportId, status) {
  return {
    schema_version: 2,
    report_id: reportId,
    sprint_id: "GOAL-DQS-CLOSURE-1A",
    generated_date: "2026-06-20",
    status,
    dutch_only: true,
    internal_only: true,
    manual_invocation_only: true,
    human_review_required: true,
    original_contract_completion: true,
    ...boundaryFlags(),
    product_end_state: "../4veco-lessen/specifications/product-end-state.md",
    strategic_product_vision: "../4veco-lessen/specifications/product-vision.md",
    quality_standards_end_state: "docs/roadmaps/quality-standards/quality-standards-end-state.md",
    original_sprint_gate_spec: "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
    controlling_prior_component: "archive/sprints/GOAL-DQS-CLOSURE-1/GOAL-DQS-CLOSURE-1-human-review-packet.md",
    controlling_recent_gate: "archive/sprints/INSPECT-11EF/INSPECT-11EF-closure-log.md",
    source_files_used: sourceMetadata(),
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
    output_boundary: boundaryFlags(),
    output_files_written: OUTPUT_PATHS,
  };
}

function nonNegotiableRequirements() {
  return [
    "Use REV-STD-1 for review packet, validation, closure, final lead review, and PR body.",
    "Cite product end-state and the original sprint/gate spec.",
    "Name non-negotiable requirements.",
    "Include a core-requirement checklist.",
    "Classify findings and carried issues.",
    "Include blocks, does_not_block, and proof_required_to_close for carried issues.",
    "PASS WITH FLAGS may not carry a missing core requirement.",
    "Restore the original closure contract: Dutch roll-up, internal school-evidence-pack candidate, and final closure-policy decision.",
    "Keep all authority flags false.",
    "Keep the internal school-evidence-pack candidate unauthorised for school or public distribution.",
    "Keep school-owned evidence, draft source/profile status, forbidden inferences, and downstream blockers visible.",
    "Do not begin international work or unlock evidence-pack, teacher/school-facing, public/external, product-route, Scale Gate, diagnostics/mastery/PV, student/product-use, personal-data, compliance, approval, OP0, PTA, summative, or inspection-readiness authority.",
  ];
}

function commonChecklist(extraRows = []) {
  return [
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
      requirement: "REV-STD-1 core fields present",
      status: "met",
      evidence: "non_negotiable_requirements, core_requirement_checklist, finding_classification",
    },
    {
      requirement: "Exact source allowlist used",
      status: "met",
      evidence: "source_files_used",
    },
    {
      requirement: "Exact output allowlist used",
      status: "met",
      evidence: "output_files_written",
    },
    {
      requirement: "All authority flags false",
      status: "met",
      evidence: "output_boundary and top-level flags",
    },
    ...extraRows,
  ];
}

function buildRollupReport() {
  const report = {
    ...commonReportFields("dutch-quality-standards-rollup", "internal_multiscope_rollup_generated"),
    non_negotiable_requirements: nonNegotiableRequirements(),
    core_requirement_checklist: commonChecklist([
      {
        requirement: "Chapter 1.1 historical bounded control included",
        status: "met",
        evidence: "multi_scope_categories.chapter_1_1_historical_bounded_control",
      },
      {
        requirement: "Chapter 1.2 internal diagnostic scope included with active blockers",
        status: "met",
        evidence: "multi_scope_categories.chapter_1_2_internal_diagnostic_scope",
      },
      {
        requirement: "Chapter 1.3 internal diagnostic scope included with route-local evidence and downstream blockers",
        status: "met",
        evidence: "multi_scope_categories.chapter_1_3_internal_diagnostic_scope",
      },
      {
        requirement: "System layer included",
        status: "met",
        evidence: "multi_scope_categories.system_layer",
      },
    ]),
    rollup_summary: {
      recommended_closure_decision: SELECTED_DECISION,
      decision_basis:
        "The current Dutch internal/report-only evidence-support and diagnostic system is stable enough to close internally, while the internal pack candidate is not authorised for school/public distribution and does not justify a school-pack trial from this packet.",
      product_end_state_trace:
        "The product end-state asks each paragraph to expose a visible route from current readiness to target-exercise readiness. The roll-up shows route-local product evidence for Chapter 1.2 and Chapter 1.3, but not school-owned implementation evidence.",
      original_spec_trace:
        "The original quality-standards roadmap distinguishes internal product evidence from school-owned evidence and competent-authority judgement.",
    },
    multi_scope_categories: [
      {
        id: "chapter_1_1_historical_bounded_control",
        scope: "Chapter 1.1",
        posture: "historical bounded control only",
        strong_product_evidence: [
          "INSPECT-7 produced a bounded Book 1 Chapter 1.1 first-three evidence-pack sample.",
          "The bounded sample passed the required teacher, legal/privacy, and Dutch quality-inspection MORE_THAN_SATISFIED review gate.",
        ],
        route_local_diagnostic_evidence: [
          "Chapter 1.1 functions here as historical control evidence, not as a newly generated active diagnostic scope.",
          "The report uses the accepted INSPECT-7 sample to calibrate what product-side evidence looks like when reviewed.",
        ],
        weak_or_missing_evidence: [
          "The current packet does not rerun or expand Chapter 1.1 evidence packs.",
          "Book 1 clean-health claims remain blocked by separate Chapter 1.1 and Chapter 1.4 assembly-health issues.",
        ],
        school_owned_evidence_still_needed: [
          "School implementation and classroom-use records.",
          "School intervention/support records and competent-authority interpretation.",
        ],
        forbidden_inference: [
          "Do not infer current Book 1 clean health.",
          "Do not infer school implementation evidence or inspection approval from the historical bounded sample.",
        ],
        blocks: [
          "Book 1 clean-health claims.",
          "Teacher/school-facing or public reliance on Chapter 1.1 beyond the bounded historical control.",
        ],
        does_not_block: [
          "Closing the current internal/report-only Dutch system if the closure packet preserves the control-only boundary.",
        ],
        proof_required_to_close: [
          "Separate BOOK1-ASSEMBLY-HEALTH-1 route for Book 1 clean-health claims.",
          "Fresh human-authorised pack-strength review before any renewed Chapter 1.1 school-facing use.",
        ],
        source: "reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json",
      },
      {
        id: "chapter_1_2_internal_diagnostic_scope",
        scope: "Chapter 1.2",
        posture: "internal diagnostic scope with active blockers",
        strong_product_evidence: [
          "Chapter 1.2 has a manually generated internal diagnostic report pair.",
          "Route-local proof exists for selected target-equivalent evidence, while blockers remain visible.",
        ],
        route_local_diagnostic_evidence: [
          "The Chapter 1.2 report is diagnostic-only, internal-only, and manual-invocation-only.",
          "It preserves blockers for generated-output substitute-mechanism issues, accessibility depth, and support/differentiation depth.",
        ],
        weak_or_missing_evidence: [
          "1.2.2 carries a generated-output substitute-mechanism blocker.",
          "1.2.4 carries frozen-yoghurt and orphaned-asset blockers.",
          "Accessibility and support evidence remain below pack-strength.",
        ],
        school_owned_evidence_still_needed: [
          "School use, intervention, accommodation, support, PTA, grading, and summative-validity evidence.",
          "School governance and inspection-conversation evidence.",
        ],
        forbidden_inference: [
          "Do not infer pack-strength, teacher/school-facing readiness, PTA validity, summative validity, OP0 completeness, compliance, approval, or inspection readiness.",
        ],
        blocks: [
          "Clean Chapter 1.2 pack-strength reliance.",
          "Teacher/school-facing Chapter 1.2 evidence-pack use.",
          "Public/external or compliance-style claims.",
        ],
        does_not_block: [
          "Manual internal diagnostic use with blockers visible.",
          "Closing the current internal/report-only Dutch system if the final decision does not authorise school-pack distribution or trial.",
        ],
        proof_required_to_close: [
          "Corrected generated output or reviewed waiver/carry decisions for 1.2.2 and 1.2.4.",
          "Reviewed mobile, contrast/theme, semantic/PDF, text-equivalent, support, and differentiation evidence before pack-strength reliance.",
        ],
        source: "reports/inspection-standards/chapter-1-2-diagnostic-report.json",
      },
      {
        id: "chapter_1_3_internal_diagnostic_scope",
        scope: "Chapter 1.3",
        posture: "internal diagnostic scope with route-local evidence and downstream blockers",
        strong_product_evidence: [
          "INSPECT-11D reached accepted state A and repaired the prior 1.3.4 generated-output/source-registry divergence.",
          "Chapter 1.3 has a manually generated internal diagnostic report pair.",
          "Route-local proof records name concrete exercise and answer ranges for 1.3.1 through 1.3.4.",
        ],
        route_local_diagnostic_evidence: [
          "The Chapter 1.3 report retains route-local-only evidence status.",
          "It visibly carries school-owned evidence still needed, forbidden inferences, accessibility/support limitations, check-surface authority separation, owner next action, and proof required to close.",
        ],
        weak_or_missing_evidence: [
          "Residual CP-6/Year-1 maintenance flags are not closed by this packet.",
          "Rendered/static support evidence is not full accessibility certification.",
          "Check-surface gate authority remains separate.",
        ],
        school_owned_evidence_still_needed: [
          "Classroom implementation, differentiation, support, monitoring, and intervention records.",
          "School PTA, assessment-policy, summative-validity, governance, SKA, and inspection-conversation records.",
        ],
        forbidden_inference: [
          "Do not infer evidence-pack, teacher/school-facing, public/external, Scale Gate, product-route, diagnostics/mastery/PV, student/product-use, compliance, approval, OP0, PTA, summative, or inspection-readiness authority.",
        ],
        blocks: [
          "Scale Gate 1.",
          "Product-route adoption.",
          "Diagnostics/mastery/PV.",
          "Student/product-use.",
          "Teacher/school-facing or public/external claims.",
        ],
        does_not_block: [
          "Manual internal Chapter 1.3 diagnostic use with blockers visible.",
          "Closing the internal/report-only Dutch system if no downstream authority is unlocked.",
        ],
        proof_required_to_close: [
          "Renewed human review confirming check-surface gate closure and naming the authority unlocked.",
          "Later CP-6/Year-1 and accessibility/support routes for stronger claims.",
        ],
        source: "reports/inspection-standards/chapter-1-3-diagnostic-report.json",
      },
      {
        id: "system_layer",
        scope: "System layer",
        posture: "manual internal Dutch evidence-support system",
        strong_product_evidence: [
          "Draft Dutch source register and evidence profile exist.",
          "Report-only evidence schema/model and manual validator exist.",
          "External review, privacy, claim guardrails, teacher-facing template, internal diagnostic operating procedure, and stability/refusal checks exist.",
        ],
        route_local_diagnostic_evidence: [
          "Manual internal diagnostic generator supports Chapter 1.2 and Chapter 1.3 descriptors.",
          "DQS closure generator uses exact source and output allowlists and refuses forbidden audiences, claims, integrations, and scopes.",
        ],
        weak_or_missing_evidence: [
          "Source register and Dutch evidence profile remain draft/bounded, not final compliance sources.",
          "No package script, CI gate, dashboard gate, quality-ref integration, Scale Gate integration, or product route is authorised.",
          "No public/school-facing distribution route exists.",
        ],
        school_owned_evidence_still_needed: [
          "School-owned implementation, governance, support/care, PTA, assessment, and inspection-conversation evidence.",
        ],
        forbidden_inference: [
          "Do not infer legal compliance, inspectorate approval, inspection readiness, complete OP0 evidence, school implementation evidence, PTA validity, summative validity, or school-SKA completion.",
          "Do not infer international standards scope.",
        ],
        blocks: [
          "Final source/profile authority.",
          "L4/L5 Dutch quality-control maturity claims.",
          "School-facing, public, product, Scale Gate, diagnostics/mastery/PV, student/product-use, or international work.",
        ],
        does_not_block: [
          "Closing the internal/report-only Dutch system with draft/bounded status visible.",
          "Ordinary scoped PR work that does not reinterpret DQS or check-surface authority.",
        ],
        proof_required_to_close: [
          "Fresh source/profile maintenance sprint before stronger source authority.",
          "Fresh human-authorised INSPECT-12/13/14-style sprint before any teacher/school/public/product authority.",
        ],
        source: "docs/roadmaps/quality-standards/inspection-standards-roadmap.md",
      },
    ],
    finding_classification: [
      {
        finding: "The Dutch roll-up supports closing the current internal/report-only system only.",
        classification: "closure_decision_support",
        blocks:
          "School-pack trial, teacher/school-facing output, public/external output, product-route adoption, Scale Gate, diagnostics/mastery/PV, student/product-use, international work, and compliance/approval claims.",
        does_not_block: "Owner review of CLOSE_INTERNAL_SYSTEM as the final decision.",
        proof_required_to_close:
          "DQS checker confirms all roll-up categories include required fields and all authority flags remain false.",
      },
    ],
  };
  assertReportSafety(report);
  return report;
}

function buildPackCandidateReport(rollup) {
  const report = {
    ...commonReportFields(
      "dutch-school-evidence-pack-candidate",
      "internal_candidate_only_not_for_distribution"
    ),
    internal_candidate_only: true,
    readable_by_teachers_or_school_leaders_only_inside_internal_review: true,
    safe_use_first_screen: PACK_FIRST_SCREEN,
    section_order: PACK_SECTION_ORDER,
    supports_closure_decision: SELECTED_DECISION,
    bounded_trial_recommendation: "do_not_authorise_trial_from_this_packet",
    rollup_report_id: rollup.report_id,
    non_negotiable_requirements: nonNegotiableRequirements(),
    core_requirement_checklist: commonChecklist([
      {
        requirement: "Exact safe-use first screen present",
        status: "met",
        evidence: "safe_use_first_screen",
      },
      {
        requirement: "All required pack-candidate sections present",
        status: "met",
        evidence: "section_order and sections",
      },
      {
        requirement: "Candidate is not authorised for distribution",
        status: "met",
        evidence: "bounded_trial_recommendation and output_boundary",
      },
    ]),
    sections: {
      "scope and safe-use boundary": {
        summary:
          "Internal review candidate only. It tests whether current Dutch product evidence can be presented coherently, but it is not a teacher/school-facing pack and is not for school or public distribution.",
        strong_product_evidence: [
          "The current internal Dutch system has reviewed source/profile, report-only validator, historical bounded Chapter 1.1 sample, and Chapter 1.2/1.3 internal diagnostic reports.",
        ],
        weak_or_missing_evidence: [
          "School-owned implementation evidence and public/external sharing authority are absent.",
        ],
        safe_use: "May be read by teachers or school leaders only inside an owner-controlled internal review; it may not be distributed or relied on as a school-facing artifact.",
      },
      "curriculum coherence": {
        summary:
          "Product-side evidence links the current Chapter 1.2 and Chapter 1.3 diagnostic scopes to target exercises and route-local proof records.",
        strong_product_evidence: [
          "Chapter 1.3 route-local proof records name concrete exercise and answer ranges.",
          "Chapter 1.2 diagnostic records preserve target-equivalent and generated-output blockers.",
        ],
        weak_or_missing_evidence: [
          "Full multi-chapter published curriculum proof and school curriculum-plan adoption evidence are not present.",
        ],
      },
      "subject-relevant basic skills": {
        summary:
          "The product exposes economics-relevant reasoning, calculation, graph/table/source use, and answer-construction evidence.",
        strong_product_evidence: [
          "Internal diagnostic reports focus on economics route evidence rather than generic school OP0 claims.",
        ],
        weak_or_missing_evidence: [
          "This is not complete OP0 evidence for a school and does not cover school-wide language, rekenen-wiskunde, or citizenship implementation.",
        ],
      },
      "didactic design": {
        summary:
          "The internal evidence indicates a route from readiness to target-exercise work, consistent with the product end-state.",
        strong_product_evidence: [
          "Chapter 1.3 evidence includes repaired own-price movement versus demand-shift separation and route-local task proof.",
        ],
        weak_or_missing_evidence: [
          "Teacher classroom-use evidence, observed lesson evidence, and school implementation records are absent.",
        ],
      },
      "assessment alignment": {
        summary:
          "Product evidence can identify target-exercise and answer-form alignment, but it does not prove PTA or summative validity.",
        strong_product_evidence: [
          "Chapter diagnostic reports preserve answer-form and route-local proof language.",
        ],
        weak_or_missing_evidence: [
          "PTA policy, grading policy, summative-validity review, and school assessment cycle evidence remain school-owned.",
        ],
      },
      "support and differentiation": {
        summary:
          "Support/differentiation evidence is visible as product-side diagnostic context and as a limitation.",
        strong_product_evidence: [
          "Chapter 1.3 carries rendered/static support evidence as route-local proof.",
        ],
        weak_or_missing_evidence: [
          "Chapter 1.2 support evidence remains below pack-strength.",
          "School intervention, accommodation, monitoring, and individual support evidence are absent.",
        ],
      },
      accessibility: {
        summary:
          "Accessibility evidence is treated as a limitation rather than a certification claim.",
        strong_product_evidence: [
          "Chapter 1.3 has rendered mobile/desktop proof and static support evidence.",
        ],
        weak_or_missing_evidence: [
          "No full WCAG certification, PDF-tagging certification, or teacher/school-facing accessibility claim is made.",
        ],
      },
      "quality assurance": {
        summary:
          "The repository has repeatable manual checks for the internal diagnostic and closure surfaces.",
        strong_product_evidence: [
          "DQS generator/checker, diagnostic currentness checks, stability checks, report JSON validation, roadmap index checks, and platform tests are part of closure proof.",
        ],
        weak_or_missing_evidence: [
          "No hard CI/build gate, dashboard gate, quality-ref integration, or Scale Gate integration is authorised.",
        ],
      },
      "improvement cycle": {
        summary:
          "Known gaps are carried with blocks, does_not_block, and proof_required_to_close instead of being hidden as flags.",
        strong_product_evidence: [
          "Chapter 1.2, Chapter 1.3, check-surface, school-owned evidence, and Book 1 assembly issues remain separately classified.",
        ],
        weak_or_missing_evidence: [
          "No downstream remediation starts from this packet without later human authority.",
        ],
      },
      "school-owned evidence still needed": {
        summary:
          "The current product-side packet cannot replace school-owned records.",
        items: [
          "Classroom use and implementation evidence.",
          "Differentiation, intervention, accommodation, and support evidence.",
          "PTA, grading, summative-validity, and assessment-policy evidence.",
          "School governance, SKA, inspection conversation, and competent-authority judgement evidence.",
        ],
      },
      "known blockers": {
        summary: "Current blockers remain visible and block stronger authority.",
        items: [
          "Chapter 1.2 generated-output and pack-strength blockers.",
          "Chapter 1.3 downstream check-surface authority blocker.",
          "Draft/bounded source-profile status.",
          "School-owned evidence gap.",
          "Book 1 clean-health carry item for Chapter 1.1 and Chapter 1.4 assembly issues.",
        ],
      },
      "safe claims": {
        summary: "Allowed internal wording.",
        items: [
          "The current Dutch internal/report-only system has reviewed product-side evidence support through Chapter 1.3.",
          "The packet can help internal reviewers see product evidence and known gaps.",
          "The internal pack candidate is coherent enough for owner review, but not authorised for distribution.",
        ],
      },
      "forbidden claims": {
        summary: "Claims this candidate must not make.",
        items: [
          "4veco is legally compliant, approved, inspection-ready, OP0-complete, PTA-valid, summative-valid, or school-SKA complete.",
          "This is school implementation evidence or a teacher/school-facing pack.",
          "This authorises public/external sharing, a school-pack trial, product-route adoption, Scale Gate, diagnostics/mastery/PV, student/product-use, international work, or personal-data processing.",
        ],
      },
    },
    finding_classification: [
      {
        finding: "The pack candidate is coherent for internal owner review but not authorised for distribution.",
        classification: "internal_candidate_only",
        blocks:
          "Teacher/school-facing distribution, public/external sharing, school-pack trial start, and any school reliance claim.",
        does_not_block:
          "Using the candidate as one input to the final CLOSE_INTERNAL_SYSTEM closure-policy decision.",
        proof_required_to_close:
          "DQS checker verifies exact first-screen warnings, all required sections, false authority flags, and consistency with the roll-up and closure decision.",
      },
    ],
  };
  assertReportSafety(report);
  return report;
}

function buildClosureCandidateReport(rollup, pack) {
  const report = {
    ...commonReportFields(
      "dutch-quality-standards-closure-candidate",
      "original_contract_completion_human_review_pending"
    ),
    internal_closure_candidate_only: true,
    rollup_report_id: rollup.report_id,
    internal_pack_candidate_report_id: pack.report_id,
    non_negotiable_requirements: nonNegotiableRequirements(),
    core_requirement_checklist: commonChecklist([
      {
        requirement: "Dutch multi-scope roll-up pair exists",
        status: "met",
        evidence: "reports/inspection-standards/dutch-quality-standards-rollup.md/json",
      },
      {
        requirement: "Internal school-evidence-pack candidate pair exists",
        status: "met",
        evidence: "reports/inspection-standards/dutch-school-evidence-pack-candidate.md/json",
      },
      {
        requirement: "Final closure-policy decision chooses exactly one allowed option",
        status: "met",
        evidence: "final_closure_policy_decision.selected",
      },
      {
        requirement: "Decision based on roll-up and internal pack candidate",
        status: "met",
        evidence: "final_closure_policy_decision.basis_from_rollup_report and basis_from_pack_candidate_report",
      },
      {
        requirement: "No missing core requirement carried as PASS WITH FLAGS",
        status: "met",
        evidence: "finding_classification marks future authority as blockers for those surfaces",
      },
    ]),
    final_closure_policy_decision: {
      selected: SELECTED_DECISION,
      decision_selection_count: 1,
      allowed_options: DECISION_OPTIONS,
      rejected_options: DECISION_OPTIONS.filter((option) => option !== SELECTED_DECISION),
      meaning:
        "The internal/report-only Dutch system is closed and stable. No school-pack trial is authorised.",
      basis_from_rollup_report: rollup.report_id,
      basis_from_pack_candidate_report: pack.report_id,
      rationale: [
        "The roll-up shows the current system layer, Chapter 1.2, and Chapter 1.3 internal diagnostic reports are stable enough for internal/report-only closure.",
        "The pack candidate is coherent for internal owner review but remains explicitly unauthorised for school/public distribution.",
        "The pack candidate preserves school-owned evidence gaps and does not justify authorising a school-pack trial from this packet.",
        "No current-layer defect requires remediation before internal/report-only closure, so REMEDIATE_BEFORE_CLOSURE is not selected.",
      ],
      owner_next_action:
        "Owner next action: review PR #124 as the completed GOAL-DQS-CLOSURE-1A packet. If accepted and merged, treat the Dutch quality-standards project as closed for internal/report-only use only. Do not start international work, school-pack trial work, or downstream product work until separately authorised.",
    },
    closure_recommendation: {
      decision: SELECTED_DECISION,
      scope:
        "Close only the current Dutch internal/report-only evidence-support and diagnostic system through Chapter 1.3. No school-pack trial, teacher/school-facing distribution, public/external output, product-route adoption, Scale Gate, diagnostics/mastery/PV, student/product-use, international work, personal-data processing, or compliance/approval claim is authorised.",
      owner_next_action:
        "Human owner reviews the complete 1A packet. Accepting it closes the internal system only; any stronger authority requires a fresh sprint.",
    },
    maturity_assessment: [
      {
        level: "L0-L2",
        name: "Setup, source/profile, schema, validator",
        status: "met_for_internal_report_only_use",
        evidence:
          "Roadmap, draft Dutch source/profile, report-only evidence model, manual validator, guardrails, and operating procedure exist.",
      },
      {
        level: "L3",
        name: "Bounded historical sample",
        status: "met_historically_for_inspect_7_scope",
        evidence: "INSPECT-7 bounded Chapter 1.1 first-three sample remains historical control evidence.",
      },
      {
        level: "internal-diagnostic-layer",
        name: "Chapter 1.2 and Chapter 1.3 manual diagnostic reports",
        status: "met_for_internal_report_only_use",
        evidence: "Chapter 1.2 and Chapter 1.3 diagnostic report pairs exist and keep blockers visible.",
      },
      {
        level: "original-closure-contract",
        name: "Roll-up, internal pack candidate, and decision",
        status: "met_for_human_review",
        evidence: "GOAL-DQS-CLOSURE-1A generated all three artifact pairs and selected CLOSE_INTERNAL_SYSTEM.",
      },
      {
        level: "L4/L5",
        name: "Teacher/school-facing and full Dutch quality-control maturity",
        status: "not_claimed",
        evidence: "Internal pack candidate is not authorised for distribution and no school-pack trial is authorised.",
      },
    ],
    finding_classification: [
      {
        finding:
          "GOAL-DQS-CLOSURE-1A restores the original closure contract by adding the roll-up, internal pack candidate, and final closure-policy decision.",
        classification: "core_requirement_closed",
        blocks: "Nothing inside the internal/report-only closure decision after human acceptance, fresh green PR CI, and merge.",
        does_not_block: "Human review of the completed PR #124 packet.",
        proof_required_to_close:
          "All six outputs current, DQS checker PASS, specialist corrections closed, final lead PASS, PR #124 green/fresh/mergeable, and human acceptance.",
      },
      {
        finding: "Final decision is CLOSE_INTERNAL_SYSTEM.",
        classification: "closure_policy_decision",
        blocks:
          "School-pack trial authority, teacher/school-facing output, public/external output, product-route adoption, Scale Gate, diagnostics/mastery/PV, student/product-use, international work, personal-data processing, and compliance/approval claims.",
        does_not_block:
          "Treating the Dutch quality-standards project as closed for internal/report-only use after human acceptance and merge.",
        proof_required_to_close:
          "Human acceptance of the explicit decision after final lead PASS and fresh PR CI.",
      },
      {
        finding: "The internal school-evidence-pack candidate is not a distributed pack.",
        classification: "school_evidence_boundary",
        blocks:
          "School/public distribution, teacher/school-facing reliance, school-pack trial start, and school-owned evidence claims.",
        does_not_block: "Using the candidate as internal evidence in the closure-policy decision.",
        proof_required_to_close:
          "Separate human-authorised school-pack trial sprint if the owner later wants a bounded, non-public, no-personal-data trial.",
      },
      {
        finding: "Source register and Dutch evidence profile remain draft/bounded.",
        classification: "draft_source_profile_boundary",
        blocks:
          "Final source/profile authority, public/external claims, compliance/approval claims, and full L5 maturity.",
        does_not_block: "Internal/report-only closure with draft status visible.",
        proof_required_to_close:
          "Fresh source/profile maintenance sprint with renewed review and explicit human acceptance.",
      },
      {
        finding: "Check-surface authority remains separate.",
        classification: "downstream_gate_blocker",
        blocks: "Scale Gate 1, product-route adoption, diagnostics/mastery/PV, and student/product-use.",
        does_not_block: "DQS internal/report-only closure and ordinary scoped PR work.",
        proof_required_to_close:
          "Renewed human review confirming check-surface gate closure and naming any authority unlocked.",
      },
      {
        finding: "School-owned evidence is still needed before school-facing or external claims.",
        classification: "school_evidence_gap",
        blocks:
          "Teacher/school-facing reliance, public/external sharing, compliance, approval, OP0, PTA, summative, inspection-readiness, school-obligation, and school-SKA claims.",
        does_not_block: "Internal/report-only closure with explicit boundaries.",
        proof_required_to_close:
          "Separate school-owned evidence route and renewed human review before any school/public use.",
      },
      {
        finding: "Book 1 Chapter 1.1 and Chapter 1.4 assembly-health failures remain separate.",
        classification: "scope_boundary_flag",
        blocks: "Book 1 clean-health claims.",
        does_not_block: "DQS internal/report-only closure.",
        proof_required_to_close: "Separate BOOK1-ASSEMBLY-HEALTH-1 route.",
      },
      {
        finding: "International standards work is not part of this closure decision.",
        classification: "scope_boundary_flag",
        blocks: "Non-Dutch or international standards roadmap work.",
        does_not_block: "Dutch internal/report-only closure.",
        proof_required_to_close:
          "Owner acceptance/merge of this packet, then a separate later worktree and roadmap if international work is authorised.",
      },
    ],
    forbidden_inference: [
      "This closure candidate proves 4veco is compliant, approved, inspection-ready, OP0-complete, PTA-valid, summative-valid, or school-SKA complete.",
      "This closure candidate authorises evidence-pack generation, teacher/school-facing output, public/external output or sharing.",
      "This closure candidate authorises a school-pack trial.",
      "This closure candidate authorises package scripts, CI/build invocation, dashboard gates, quality-ref integration, Scale Gate integration, product-route adoption, diagnostics/mastery/PV, student-use, or product-use.",
      "This closure candidate authorises generated lesson-output mutation, protected-reference mutation, source-registry mutation, personal-data processing, or international standards work.",
    ],
    school_owned_evidence_still_needed: [
      "School implementation, classroom-use, monitoring, intervention, accommodation, and support evidence.",
      "PTA, grading, summative-validity, and assessment-policy evidence.",
      "School governance, SKA, inspection conversation, and competent-authority judgement evidence.",
    ],
    proof_required_to_close: [
      "All six generated outputs current and checked.",
      "Lead planning review corrections closed.",
      "Teacher/economics, legal/privacy, Dutch quality-inspection, and accessibility specialist corrections closed.",
      "Final lead PASS.",
      "Fresh PR #124 CI green, 0 behind current main, non-draft, and mergeable.",
      "Human acceptance of the explicit CLOSE_INTERNAL_SYSTEM decision.",
    ],
  };
  assertReportSafety(report);
  assertBundleConsistency({ rollup, pack, closure: report });
  return report;
}

function buildBundle() {
  const rollup = buildRollupReport();
  const pack = buildPackCandidateReport(rollup);
  const closure = buildClosureCandidateReport(rollup, pack);
  const bundle = { rollup, pack, closure };
  assertBundleConsistency(bundle);
  return bundle;
}

function assertReportSafety(report) {
  for (const flag of FALSE_FLAGS) {
    if (report[flag] !== false || report.output_boundary?.[flag] !== false) {
      throw new StopError("STOP_HIDDEN_BLOCKER", `${flag} must remain false in ${report.report_id}.`);
    }
  }

  const used = (report.source_files_used || []).map((entry) => entry.path);
  if (JSON.stringify(used) !== JSON.stringify(SOURCE_PATHS)) {
    throw new StopError("STOP_SOURCE_ALLOWLIST_MISMATCH", `${report.report_id} source allowlist mismatch.`);
  }

  for (const entry of report.source_files_used || []) {
    const bytes = fs.readFileSync(repoPath(entry.path));
    if (entry.sha256 !== sha256(bytes) || entry.bytes !== bytes.length) {
      throw new StopError("STOP_SOURCE_ALLOWLIST_MISMATCH", `Source metadata mismatch: ${entry.path}`);
    }
  }

  if (JSON.stringify(report.output_files_written) !== JSON.stringify(OUTPUT_PATHS)) {
    throw new StopError("STOP_OUTPUT_ALLOWLIST_MISMATCH", `${report.report_id} output allowlist mismatch.`);
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
    "draft",
    "teacher/school-facing",
    "public/external",
    "international",
  ]) {
    if (!text.includes(required)) {
      throw new StopError("STOP_HIDDEN_BLOCKER", `${report.report_id} is missing required term: ${required}`);
    }
  }
}

function assertBundleConsistency({ rollup, pack, closure }) {
  if (rollup.rollup_summary?.recommended_closure_decision !== SELECTED_DECISION) {
    throw new StopError("STOP_DECISION_INCONSISTENCY", "Roll-up does not support the selected decision.");
  }
  if (pack.supports_closure_decision !== SELECTED_DECISION) {
    throw new StopError("STOP_DECISION_INCONSISTENCY", "Pack candidate does not support the selected decision.");
  }
  if (pack.bounded_trial_recommendation !== "do_not_authorise_trial_from_this_packet") {
    throw new StopError("STOP_DECISION_INCONSISTENCY", "Pack candidate must not authorise a school-pack trial.");
  }
  const decision = closure.final_closure_policy_decision;
  if (decision?.selected !== SELECTED_DECISION || decision?.decision_selection_count !== 1) {
    throw new StopError("STOP_DECISION_INCONSISTENCY", "Closure candidate must choose exactly one decision.");
  }
  if (JSON.stringify(decision.allowed_options) !== JSON.stringify(DECISION_OPTIONS)) {
    throw new StopError("STOP_DECISION_INCONSISTENCY", "Decision options mismatch.");
  }
  if (decision.basis_from_rollup_report !== rollup.report_id || decision.basis_from_pack_candidate_report !== pack.report_id) {
    throw new StopError("STOP_DECISION_INCONSISTENCY", "Closure decision is not based on both inputs.");
  }
}

function escapeCell(value) {
  return String(value)
    .replace(/\r?\n/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

function pushList(lines, items) {
  for (const item of items || []) lines.push(`- ${item}`);
}

function pushChecklist(lines, checklist) {
  lines.push("| Requirement | Status | Evidence |");
  lines.push("|---|---|---|");
  checklist.forEach((item) => {
    lines.push(`| ${escapeCell(item.requirement)} | \`${escapeCell(item.status)}\` | ${escapeCell(item.evidence)} |`);
  });
}

function pushCommonHeader(lines, report, title) {
  lines.push(`# ${title}`);
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
  lines.push(`- Controlling prior component: \`${report.controlling_prior_component}\``);
  lines.push(`- Controlling recent gate: \`${report.controlling_recent_gate}\``);
  lines.push("");
  lines.push("## Non-Negotiable Requirements");
  lines.push("");
  pushList(lines, report.non_negotiable_requirements);
  lines.push("");
  lines.push("## Core Requirement Checklist");
  lines.push("");
  pushChecklist(lines, report.core_requirement_checklist);
  lines.push("");
}

function pushSourceProfile(lines, report) {
  lines.push("## Source Profile Status");
  lines.push("");
  lines.push(`- Source register status: \`${report.source_profile_status.source_register_status}\``);
  lines.push(`- Source register review status: \`${report.source_profile_status.source_register_review_status}\``);
  lines.push(`- Evidence profile status: \`${report.source_profile_status.evidence_profile_status}\``);
  lines.push(`- Evidence profile review status: \`${report.source_profile_status.evidence_profile_review_status}\``);
  lines.push(`- Active scope: ${report.source_profile_status.active_scope}`);
  lines.push(`- Non-Dutch inventory policy: ${report.source_profile_status.non_dutch_inventory_policy}`);
  lines.push("");
}

function pushFindingClassification(lines, findings) {
  lines.push("## Finding Classification");
  lines.push("");
  lines.push("| Finding | Classification | blocks | does_not_block | proof_required_to_close |");
  lines.push("|---|---|---|---|---|");
  findings.forEach((item) => {
    lines.push(
      `| ${escapeCell(item.finding)} | \`${escapeCell(item.classification)}\` | ${escapeCell(item.blocks)} | ${escapeCell(
        item.does_not_block
      )} | ${escapeCell(item.proof_required_to_close)} |`
    );
  });
  lines.push("");
}

function pushOutputBoundary(lines, report) {
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
}

function pushSourceFiles(lines, report) {
  lines.push("## Source Files Used");
  lines.push("");
  lines.push("| Source | SHA-256 | Bytes |");
  lines.push("|---|---|---:|");
  report.source_files_used.forEach((item) => {
    lines.push(`| \`${escapeCell(item.path)}\` | \`${item.sha256}\` | ${item.bytes} |`);
  });
  lines.push("");
}

function renderRollupMarkdown(report) {
  const lines = [];
  pushCommonHeader(lines, report, "GOAL-DQS-CLOSURE-1A Dutch Quality Standards Roll-Up");
  lines.push("## Roll-Up Summary");
  lines.push("");
  lines.push(`Recommended closure decision: \`${report.rollup_summary.recommended_closure_decision}\``);
  lines.push("");
  lines.push(report.rollup_summary.decision_basis);
  lines.push("");
  lines.push(`Product end-state trace: ${report.rollup_summary.product_end_state_trace}`);
  lines.push("");
  lines.push(`Original spec trace: ${report.rollup_summary.original_spec_trace}`);
  lines.push("");
  lines.push("## Multi-Scope Categories");
  lines.push("");
  report.multi_scope_categories.forEach((category) => {
    lines.push(`### ${category.scope}: ${category.posture}`);
    lines.push("");
    for (const field of [
      "strong_product_evidence",
      "route_local_diagnostic_evidence",
      "weak_or_missing_evidence",
      "school_owned_evidence_still_needed",
      "forbidden_inference",
      "blocks",
      "does_not_block",
      "proof_required_to_close",
    ]) {
      lines.push(`#### ${field}`);
      lines.push("");
      pushList(lines, category[field]);
      lines.push("");
    }
    lines.push(`Source: \`${category.source}\``);
    lines.push("");
  });
  pushSourceProfile(lines, report);
  pushFindingClassification(lines, report.finding_classification);
  pushSourceFiles(lines, report);
  pushOutputBoundary(lines, report);
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderPackMarkdown(report) {
  const lines = [];
  lines.push("# GOAL-DQS-CLOSURE-1A Internal School Evidence Pack Candidate");
  lines.push("");
  PACK_FIRST_SCREEN.forEach((item) => lines.push(item));
  lines.push("");
  lines.push(`Status: ${report.status}`);
  lines.push(`Date: ${report.generated_date}`);
  lines.push(`Sprint: \`${report.sprint_id}\``);
  lines.push("");
  lines.push("This is an internal review candidate only. It may be readable by teachers or school leaders inside an owner-controlled internal review, but it is not authorised for school or public distribution.");
  lines.push("");
  lines.push("## Product End-State And Original Spec");
  lines.push("");
  lines.push(`- Product end-state: \`${report.product_end_state}\``);
  lines.push(`- Strategic product vision: \`${report.strategic_product_vision}\``);
  lines.push(`- Quality standards end-state: \`${report.quality_standards_end_state}\``);
  lines.push(`- Original sprint/gate spec: \`${report.original_sprint_gate_spec}\``);
  lines.push("");
  lines.push("## Non-Negotiable Requirements");
  lines.push("");
  pushList(lines, report.non_negotiable_requirements);
  lines.push("");
  lines.push("## Core Requirement Checklist");
  lines.push("");
  pushChecklist(lines, report.core_requirement_checklist);
  lines.push("");
  for (const sectionName of PACK_SECTION_ORDER) {
    const section = report.sections[sectionName];
    lines.push(`## ${sectionName}`);
    lines.push("");
    lines.push(section.summary);
    lines.push("");
    if (section.strong_product_evidence) {
      lines.push("Strong product evidence:");
      pushList(lines, section.strong_product_evidence);
      lines.push("");
    }
    if (section.weak_or_missing_evidence) {
      lines.push("Weak or missing evidence:");
      pushList(lines, section.weak_or_missing_evidence);
      lines.push("");
    }
    if (section.items) {
      pushList(lines, section.items);
      lines.push("");
    }
    if (section.safe_use) {
      lines.push(`Safe use: ${section.safe_use}`);
      lines.push("");
    }
  }
  pushSourceProfile(lines, report);
  pushFindingClassification(lines, report.finding_classification);
  pushSourceFiles(lines, report);
  pushOutputBoundary(lines, report);
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderClosureMarkdown(report) {
  const lines = [];
  pushCommonHeader(lines, report, "GOAL-DQS-CLOSURE-1A Dutch Quality Standards Closure Candidate");
  lines.push("## Final Closure-Policy Decision");
  lines.push("");
  lines.push(`Selected decision: \`${report.final_closure_policy_decision.selected}\``);
  lines.push("");
  lines.push(`Meaning: ${report.final_closure_policy_decision.meaning}`);
  lines.push("");
  lines.push("Allowed options:");
  pushList(lines, report.final_closure_policy_decision.allowed_options.map((option) => `\`${option}\``));
  lines.push("");
  lines.push(`Decision selection count: \`${report.final_closure_policy_decision.decision_selection_count}\``);
  lines.push("");
  lines.push(`Basis from roll-up report: \`${report.final_closure_policy_decision.basis_from_rollup_report}\``);
  lines.push(`Basis from internal pack candidate report: \`${report.final_closure_policy_decision.basis_from_pack_candidate_report}\``);
  lines.push("");
  lines.push("Rationale:");
  pushList(lines, report.final_closure_policy_decision.rationale);
  lines.push("");
  lines.push(report.final_closure_policy_decision.owner_next_action);
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
  lines.push("| Level | Name | Status | Evidence |");
  lines.push("|---|---|---|---|");
  report.maturity_assessment.forEach((item) => {
    lines.push(
      `| \`${escapeCell(item.level)}\` | ${escapeCell(item.name)} | \`${escapeCell(item.status)}\` | ${escapeCell(
        item.evidence
      )} |`
    );
  });
  lines.push("");
  pushSourceProfile(lines, report);
  pushFindingClassification(lines, report.finding_classification);
  lines.push("## Forbidden Inference");
  lines.push("");
  pushList(lines, report.forbidden_inference);
  lines.push("");
  lines.push("## School-Owned Evidence Still Needed");
  lines.push("");
  pushList(lines, report.school_owned_evidence_still_needed);
  lines.push("");
  lines.push("## Proof Required To Close");
  lines.push("");
  pushList(lines, report.proof_required_to_close);
  lines.push("");
  pushSourceFiles(lines, report);
  pushOutputBoundary(lines, report);
  return `${lines.join("\n").trimEnd()}\n`;
}

function outputContents(bundle) {
  return new Map([
    [OUTPUT_PATHS[0], renderRollupMarkdown(bundle.rollup)],
    [OUTPUT_PATHS[1], `${JSON.stringify(bundle.rollup, null, 2)}\n`],
    [OUTPUT_PATHS[2], renderPackMarkdown(bundle.pack)],
    [OUTPUT_PATHS[3], `${JSON.stringify(bundle.pack, null, 2)}\n`],
    [OUTPUT_PATHS[4], renderClosureMarkdown(bundle.closure)],
    [OUTPUT_PATHS[5], `${JSON.stringify(bundle.closure, null, 2)}\n`],
  ]);
}

function parseMode(argv) {
  const args = argv.slice(2);
  const check = args.includes("--check");
  const unknown = args.filter((arg) => arg !== "--check");
  const joined = unknown.join(" ").toLowerCase();

  if (/teacher|school-facing|evidence-pack|pack-strength|school-pack/.test(joined)) {
    throw new StopError("STOP_PACK_STRENGTH_REQUEST", "Teacher/school/evidence-pack output is not authorised.", {
      args: unknown,
    });
  }
  if (/public|external|publish|external-share/.test(joined)) {
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
  if (/compliance|compliant|approval|inspection-ready|inspection-readiness|op0|op0-complete|pta|summative|school-ska/.test(joined)) {
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
  const bundle = buildBundle();
  writeOrCheck(outputContents(bundle), mode.check);
  return bundle;
}

function main() {
  try {
    const mode = parseMode(process.argv);
    run(mode);
    console.log(mode.check ? "DQS closure bundle output is current." : "DQS closure bundle generated.");
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
  DECISION_OPTIONS,
  FALSE_FLAGS,
  OUTPUT_PATHS,
  PACK_FIRST_SCREEN,
  PACK_SECTION_ORDER,
  SOURCE_PATHS,
  SELECTED_DECISION,
  StopError,
  buildBundle,
  buildClosureCandidateReport,
  buildPackCandidateReport,
  buildReport: buildClosureCandidateReport,
  buildRollupReport,
  normalizePath,
  outputContents,
  parseMode,
  sha256,
};
