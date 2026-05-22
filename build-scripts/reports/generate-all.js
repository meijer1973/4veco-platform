#!/usr/bin/env node
/**
 * generate-all.js
 *
 * Builds JSON-first reference health reports plus Markdown projections.
 * Reports are diagnostic generated artifacts; they do not replace source data.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const JSON_DIR = path.join(REPO_ROOT, 'reports/json');
const MD_DIR = path.join(REPO_ROOT, 'reports/markdown');
const UNITS = 'references/machine/micro-teaching-units.json';
const TERMS = 'references/machine/begrippen.json';
const EXAMS = 'references/external/exam-questions.json';
const TARGETS = 'references/authored/course-target-exercises.json';
const EMPTY_NEEDS = 'references/data/audits/empty-needs-audit.json';
const QUALITY_ISSUES = 'references/data/qc/reference-quality-issues.json';
const MISCONCEPTIONS = 'references/data/misconceptions/misconception-registry.json';
const UNIT_DESIGN_STATUS = 'references/data/unit-design-status/unit-design-status-overlay.json';
const EXAM_ITEM_OVERLAYS = 'references/data/exam-ingestion/exam-item-overlays.json';
const EXAM_ANSWER_MODEL_OVERLAYS = 'references/data/exam-ingestion/exam-answer-model-overlays.json';
const EXAM_SOURCE_ANNEX_OVERLAYS = 'references/data/exam-ingestion/exam-source-annex-overlays.json';
const EX2_GATE_CLOSURE = 'reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json';

function readJson(relPath, fallback) {
  const file = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function rel(file) {
  return path.relative(REPO_ROOT, file).replace(/\\/g, '/');
}

function now() {
  return new Date().toISOString();
}

function sha(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function countBy(items, selector) {
  const counts = {};
  for (const item of items) {
    const value = selector(item) || 'unknown';
    counts[value] = (counts[value] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

function issue(reportId, index, severity, affectedEntity, category, evidencePath, nextAction, proofRequiredToClose) {
  return {
    issue_id: `${reportId}-${String(index).padStart(4, '0')}`,
    severity,
    affected_entity: affectedEntity,
    category,
    evidence_path: evidencePath,
    next_action: nextAction,
    proof_required_to_close: proofRequiredToClose,
  };
}

function makeReport(reportId, sourceFiles, status, issues, summary = {}) {
  return {
    report_id: reportId,
    generated_by: 'build-scripts/reports/generate-all.js',
    generated_on: now(),
    source_files: sourceFiles,
    schema_version: 1,
    status,
    summary,
    issues,
  };
}

function mdCell(value) {
  if (Array.isArray(value)) return value.length ? value.join(', ') : '-';
  if (value === true) return 'true';
  if (value === false) return 'false';
  if (value === null || value === undefined || value === '') return '-';
  return String(value).replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

function writeExamIngestionCoverageMarkdown(report) {
  const lines = [];
  lines.push('# Exam Ingestion Coverage');
  lines.push('');
  lines.push(`Generated: ${report.generated_on}`);
  lines.push(`Status: ${report.status}`);
  lines.push('');
  lines.push('Diagnostic EX-3 report. This report records reviewed EX-2 classifications for EX-1 pilot exam items. It does not authorize protected reference mutation, external-source mutation, unit minting, operation-registry mutation, answer-skill mutation, target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure, or student/product use.');
  lines.push('');
  lines.push('No protected reference mutation is authorized by this report.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|---|---:|');
  lines.push(`| Pilot items | ${mdCell(report.summary.pilot_item_count)} |`);
  lines.push(`| Reviewed classifications | ${mdCell(report.summary.reviewed_classification_count)} |`);
  lines.push(`| Blocking gaps | ${mdCell(report.summary.blocking_gap_count)} |`);
  lines.push(`| Lesson handoff ready with gaps | ${mdCell(report.summary.lesson_handoff_ready_with_gaps)} |`);
  lines.push(`| Lesson handoff blocked | ${mdCell(report.summary.lesson_handoff_blocked)} |`);
  lines.push(`| Answer-skill needs | ${mdCell(report.summary.classification_counts.answer_skill_need)} |`);
  lines.push(`| Operation-registry needs | ${mdCell(report.summary.classification_counts.operation_registry_need)} |`);
  lines.push('');
  lines.push('## Pilot Items');
  lines.push('');
  lines.push('| Exam item | Pilot role | Prompt | Source status | Answer model | Handoff | Blocking gaps |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const record of report.coverage_records || []) {
    lines.push(`| ${mdCell(record.exam_item_id)} | ${mdCell(record.pilot_role)} | ${mdCell(record.prompt_status)} | ${mdCell(record.source_material_status)} | ${mdCell(record.answer_model_status)} | ${mdCell(record.lesson_handoff_status)} | ${mdCell(record.blocking_gap_ids)} |`);
  }
  lines.push('');
  lines.push('## Reviewed Classifications');
  lines.push('');
  lines.push('| Requirement | Classification | Accepted/support units | Weak/stale units | Blocking gaps | Mutation authorized |');
  lines.push('|---|---|---|---|---|---|');
  for (const record of report.reviewed_classifications || []) {
    const units = record.accepted_unit_ids || record.supporting_unit_ids || record.candidate_unit_ids || record.partial_support_unit_ids || [];
    const weak = record.stale_or_weak_unit_ids || record.weak_or_prerequisite_unit_ids || [];
    lines.push(`| ${mdCell(record.requirement_id)} | ${mdCell(record.classification)} | ${mdCell(units)} | ${mdCell(weak)} | ${mdCell(record.blocking_gaps)} | ${mdCell(record.mutation_authorized)} |`);
  }
  lines.push('');
  lines.push('## Gate Conditions Carried Forward');
  lines.push('');
  for (const condition of report.conditions_carried_forward || []) {
    lines.push(`- ${condition}`);
  }
  lines.push('');
  lines.push('## Proof Required Before Next Use');
  lines.push('');
  for (const proof of report.proof_required_before_next_use || []) {
    lines.push(`- ${proof}`);
  }
  lines.push('');
  lines.push('## Authority Boundary');
  lines.push('');
  lines.push('| Boundary | Authorized |');
  lines.push('|---|---:|');
  for (const [key, value] of Object.entries(report.authority_boundary || {})) {
    lines.push(`| ${mdCell(key)} | ${mdCell(value)} |`);
  }
  lines.push('');
  lines.push('## Issues');
  lines.push('');
  if (report.issues.length === 0) {
    lines.push('None.');
  } else {
    for (const item of report.issues) {
      lines.push(`- **${item.severity}** ${item.affected_entity} (${item.category})`);
      lines.push(`  - evidence: \`${item.evidence_path}\``);
      lines.push(`  - next: ${item.next_action}`);
      lines.push(`  - close: ${item.proof_required_to_close}`);
    }
  }
  fs.writeFileSync(path.join(MD_DIR, `${report.report_id}.md`), lines.join('\n').replace(/\n+$/g, '') + '\n');
}

function writeReport(report) {
  fs.mkdirSync(JSON_DIR, { recursive: true });
  fs.mkdirSync(MD_DIR, { recursive: true });
  fs.writeFileSync(path.join(JSON_DIR, `${report.report_id}.json`), JSON.stringify(report, null, 2) + '\n');
  if (report.report_id === 'exam-ingestion-coverage') {
    writeExamIngestionCoverageMarkdown(report);
    return;
  }

  const lines = [];
  lines.push(`# ${report.report_id}`);
  lines.push('');
  lines.push(`Generated: ${report.generated_on}`);
  lines.push(`Status: ${report.status}`);
  lines.push(`Generated by: \`${report.generated_by}\``);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  for (const [key, value] of Object.entries(report.summary || {})) {
    lines.push(`- ${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
  }
  if (Object.keys(report.summary || {}).length === 0) lines.push('No summary fields.');
  lines.push('');
  lines.push('## Issues');
  lines.push('');
  if (report.issues.length === 0) {
    lines.push('None.');
  } else {
    for (const item of report.issues) {
      lines.push(`- **${item.severity}** ${item.affected_entity} (${item.category})`);
      lines.push(`  - evidence: \`${item.evidence_path}\``);
      lines.push(`  - next: ${item.next_action}`);
      lines.push(`  - close: ${item.proof_required_to_close}`);
    }
  }
  fs.writeFileSync(path.join(MD_DIR, `${report.report_id}.md`), lines.join('\n').replace(/\n+$/g, '') + '\n');
}

function loadUnits() {
  const units = readJson(UNITS, []);
  return {
    all: units,
    live: units.filter((unit) => !unit.deprecated),
    deprecated: units.filter((unit) => unit.deprecated),
    byId: new Map(units.map((unit) => [unit.id, unit])),
  };
}

function loadTerms() {
  const data = readJson(TERMS, { terms: {} });
  return data.terms || {};
}

function collectCitations() {
  const files = [];
  const roots = ['references', 'reports', 'knowledge', 'docs'];
  for (const root of roots) {
    const fullRoot = path.join(REPO_ROOT, root);
    if (!fs.existsSync(fullRoot)) continue;
    const stack = [fullRoot];
    while (stack.length) {
      const current = stack.pop();
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const full = path.join(current, entry.name);
        if (entry.isDirectory()) {
          if (!['node_modules', '.git'].includes(entry.name)) stack.push(full);
        } else if (/\.(md|json|js|jsonl)$/i.test(entry.name)) {
          files.push(full);
        }
      }
    }
  }
  return files;
}

function buildDagIntegrity(ctx) {
  const issues = [];
  let i = 1;
  for (const unit of ctx.units.all) {
    for (const need of unit.needs || []) {
      if (!ctx.units.byId.has(need)) {
        issues.push(issue('dag-integrity', i++, 'critical', unit.id, 'missing_need_reference', UNITS, `Create or correct prerequisite ${need}.`, 'All needs references resolve.'));
      }
    }
  }

  const visiting = new Set();
  const visited = new Set();
  function visit(id, pathSoFar) {
    if (visiting.has(id)) {
      issues.push(issue('dag-integrity', i++, 'critical', id, 'cycle', UNITS, `Break dependency cycle ${[...pathSoFar, id].join(' -> ')}.`, 'Dependency graph is acyclic.'));
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    const unit = ctx.units.byId.get(id);
    for (const need of (unit && unit.needs) || []) if (ctx.units.byId.has(need)) visit(need, [...pathSoFar, id]);
    visiting.delete(id);
    visited.add(id);
  }
  for (const unit of ctx.units.all) visit(unit.id, []);

  return makeReport('dag-integrity', [UNITS], issues.length ? 'fail' : 'pass', issues, {
    units: ctx.units.all.length,
    live_units: ctx.units.live.length,
    deprecated_units: ctx.units.deprecated.length,
  });
}

function buildTerminologyDrift(ctx) {
  const canonical = new Set(Object.keys(ctx.terms));
  const issues = [];
  let i = 1;
  let termCitations = 0;
  for (const unit of ctx.units.all) {
    for (const term of unit.terms || []) {
      termCitations++;
      if (!canonical.has(term)) {
        issues.push(issue('terminology-drift', i++, 'medium', unit.id, 'noncanonical_term', UNITS, `Resolve term ${term} through term registry or unit update.`, 'Unit term resolves to begrippen.json.'));
      }
    }
  }
  return makeReport('terminology-drift', [UNITS, TERMS], issues.length ? 'fail' : 'pass', issues, {
    term_registry_entries: canonical.size,
    unit_term_citations: termCitations,
  });
}

function buildUnresolvedRefs(ctx) {
  const deprecated = new Set(ctx.units.deprecated.map((unit) => unit.id));
  const issues = [];
  let i = 1;
  for (const file of collectCitations()) {
    const text = fs.readFileSync(file, 'utf8');
    for (const id of deprecated) {
      if (new RegExp(`\\b${id}\\b`).test(text)) {
        issues.push(issue('unresolved-refs', i++, 'low', id, 'deprecated_reference', rel(file), 'Remove or migrate deprecated unit citation.', 'No deprecated unit ID is cited from active docs/reports.'));
      }
    }
  }
  return makeReport('unresolved-refs', [UNITS, 'references/', 'reports/', 'knowledge/', 'docs/'], issues.length ? 'warn' : 'pass', issues, {
    deprecated_units: deprecated.size,
    deprecated_citations: issues.length,
  });
}

function buildNeedsCoverage(ctx) {
  const issues = [];
  let i = 1;
  for (const unit of ctx.units.live) {
    if (!Array.isArray(unit.needs) || unit.needs.length === 0) {
      const status = unit.zero_needs_status || 'unclassified';
      const severity = ['underbouw_assumed', 'true_zero'].includes(status) ? 'info' : status === 'false_zero' ? 'high' : 'medium';
      issues.push(issue('needs-coverage', i++, severity, unit.id, `empty_needs:${status}`, UNITS, 'Review whether this is true zero, underbouw assumed, or false zero.', 'Unit has explicit zero-needs status or at least one validated prerequisite.'));
    }
  }
  return makeReport('needs-coverage', [UNITS], issues.length ? 'warn' : 'pass', issues, {
    live_units: ctx.units.live.length,
    empty_needs: issues.length,
  });
}

function buildTermsCoverage(ctx) {
  const issues = [];
  let i = 1;
  for (const unit of ctx.units.live) {
    if (!Array.isArray(unit.terms) || unit.terms.length === 0) {
      issues.push(issue('terms-coverage', i++, 'medium', unit.id, 'missing_term_links', UNITS, 'Add canonical term slugs when this unit uses glossary concepts.', 'Unit terms are either populated or explicitly marked not applicable.'));
    }
  }
  return makeReport('terms-coverage', [UNITS, TERMS], issues.length ? 'warn' : 'pass', issues, {
    live_units: ctx.units.live.length,
    units_without_terms: issues.length,
  });
}

function buildProcedureCoverage(ctx) {
  const issues = [];
  let i = 1;
  for (const unit of ctx.units.live) {
    if (unit.mastery_target === 'apply' && (!Array.isArray(unit.procedure) || unit.procedure.length === 0)) {
      issues.push(issue('procedure-coverage', i++, 'medium', unit.id, 'missing_procedure', UNITS, 'Add a procedure or lower mastery target.', 'Apply-level unit has a procedure.'));
    }
  }
  return makeReport('procedure-coverage', [UNITS], issues.length ? 'warn' : 'pass', issues, {
    live_units: ctx.units.live.length,
    apply_units_without_procedure: issues.length,
  });
}

function buildAspectsCoverage(ctx) {
  const issues = [];
  let i = 1;
  for (const unit of ctx.units.live) {
    if (!Array.isArray(unit.aspects) || unit.aspects.length === 0) {
      issues.push(issue('aspects-coverage', i++, 'low', unit.id, 'missing_aspects', UNITS, 'Assign aspect tags when production planning uses this unit.', 'Unit has aspect tags or an explicit no-aspect rationale.'));
    }
  }
  return makeReport('aspects-coverage', [UNITS], issues.length ? 'warn' : 'pass', issues, {
    live_units: ctx.units.live.length,
    units_without_aspects: issues.length,
  });
}

function usedUnitIds(ctx) {
  const used = new Set();
  for (const question of ctx.exams.questions || ctx.exams || []) {
    for (const id of question.required_skills || question.skill_ids || []) used.add(id);
  }
  const targetText = JSON.stringify(ctx.targets);
  for (const unit of ctx.units.all) if (new RegExp(`\\b${unit.id}\\b`).test(targetText)) used.add(unit.id);
  return used;
}

function buildDeadUnits(ctx) {
  const used = usedUnitIds(ctx);
  const issues = [];
  let i = 1;
  for (const unit of ctx.units.live) {
    if (!used.has(unit.id)) {
      issues.push(issue('dead-units', i++, 'low', unit.id, 'uncited_live_unit', UNITS, 'Check whether this unit is future-needed, should be cited, or should be deprecated.', 'Unit is cited by exam/target evidence or explicitly marked intentionally uncited.'));
    }
  }
  return makeReport('dead-units', [UNITS, EXAMS, TARGETS], issues.length ? 'warn' : 'pass', issues, {
    live_units: ctx.units.live.length,
    cited_live_units: ctx.units.live.length - issues.length,
    uncited_live_units: issues.length,
  });
}

function buildBegrippenCoverage(ctx) {
  const issues = [];
  let i = 1;
  for (const [id, term] of Object.entries(ctx.terms)) {
    if (!Array.isArray(term.teaching_units) || term.teaching_units.length === 0) {
      issues.push(issue('begrippen-coverage', i++, 'low', id, 'term_without_teaching_units', TERMS, 'Link term to teaching units when used in production.', 'Term has teaching_units or explicit orphan rationale.'));
    }
  }
  return makeReport('begrippen-coverage', [TERMS, UNITS], issues.length ? 'warn' : 'pass', issues, {
    terms: Object.keys(ctx.terms).length,
    terms_without_teaching_units: issues.length,
  });
}

function buildEmptyNeedsAuditSummary(ctx) {
  const audit = ctx.emptyNeeds;
  const issues = [];
  let i = 1;
  for (const entry of audit.entries || []) {
    if (['false_zero', 'ambiguous'].includes(entry.recommended_status)) {
      issues.push(issue('empty-needs-audit-summary', i++, entry.severity || 'medium', entry.unit_id, `empty_needs_review:${entry.recommended_status}`, EMPTY_NEEDS, entry.human_question || 'Review empty-needs classification.', 'Human review or mutation workflow closes this entry.'));
    }
  }
  return makeReport('empty-needs-audit-summary', [EMPTY_NEEDS], issues.length ? 'warn' : 'info', issues, {
    live_unit_count: audit.live_unit_count || null,
    empty_needs_count: audit.empty_needs_count || null,
    by_status: audit.summary && audit.summary.by_status ? audit.summary.by_status : {},
  });
}

function buildReferenceQualityIssues(ctx) {
  const source = ctx.qualityIssues || { issues: [] };
  const active = (source.issues || []).filter((item) => item.status !== 'resolved');
  const issues = active.map((item, index) => issue(
    'reference-quality-issues',
    index + 1,
    item.severity,
    item.issue_id,
    item.quality_category,
    (item.evidence_refs && item.evidence_refs[0] && item.evidence_refs[0].path) || QUALITY_ISSUES,
    item.next_action,
    item.proof_required_to_close
  ));
  const criticalOpen = active.some((item) => item.severity === 'critical' && item.status !== 'deferred');
  const highOpen = active.some((item) => item.severity === 'high' && !['deferred', 'resolved'].includes(item.status));
  return makeReport('reference-quality-issues', [QUALITY_ISSUES], criticalOpen ? 'fail' : highOpen || issues.length ? 'warn' : 'pass', issues, {
    issue_log_status: source.status || 'unknown',
    total_issues: (source.issues || []).length,
    active_issues: active.length,
    by_status: countBy(source.issues || [], (item) => item.status),
    by_category: countBy(source.issues || [], (item) => item.quality_category),
    by_severity: countBy(source.issues || [], (item) => item.severity),
    internal_only: source.authority_boundary && source.authority_boundary.internal_only === true,
    curriculum_authority: source.authority_boundary && source.authority_boundary.curriculum_authority === true,
    student_facing_exposure: source.authority_boundary && source.authority_boundary.student_facing_exposure === true,
  });
}

function buildMisconceptionRegistry(ctx) {
  const source = ctx.misconceptions || { records: [], authority_flags: {} };
  const active = (source.records || []).filter((item) => item.status === 'active');
  const issues = active.map((item, index) => issue(
    'misconception-registry',
    index + 1,
    item.severity,
    item.misconception_id,
    'misconception_design_context',
    (item.evidence_refs && item.evidence_refs[0] && item.evidence_refs[0].path) || MISCONCEPTIONS,
    item.authoring_guidance_nl || 'Use this misconception as internal exercise-design and answer-model review context only.',
    'Retire or revise the misconception record only after source evidence is superseded or a later sprint changes the internal registry scope.'
  ));
  const flags = source.authority_flags || {};
  return makeReport('misconception-registry', [MISCONCEPTIONS], 'info', issues, {
    registry_status: source.status || 'unknown',
    record_count: (source.records || []).length,
    active_records: active.length,
    by_status: countBy(source.records || [], (item) => item.status),
    by_severity: countBy(source.records || [], (item) => item.severity),
    linked_unit_count: new Set((source.records || []).flatMap((item) => item.linked_unit_ids || [])).size,
    affected_surfaces: countBy((source.records || []).flatMap((item) => item.affected_surfaces || []), (item) => item),
    internal_only: flags.internal_only === true,
    diagnostic_design_context: flags.diagnostic_design_context === true,
    primary_evidence: flags.primary_evidence === true,
    curriculum_authority: flags.curriculum_authority === true,
    exam_authority: flags.exam_authority === true,
    scoring_rule: flags.scoring_rule === true,
    student_facing_diagnosis: flags.student_facing_diagnosis === true,
    student_facing_exposure: flags.student_facing_exposure === true,
    adaptive_routing: flags.adaptive_routing === true,
    mastery_decision: flags.mastery_decision === true,
    automatic_sequencing: flags.automatic_sequencing === true,
    student_facing_ai: flags.student_facing_ai === true,
    summative_use: flags.summative_use === true,
    pv_projection: flags.pv_projection === true,
    pv_machine_promotion: flags.pv_machine_promotion === true,
    machine_registry_authority: flags.machine_registry_authority === true,
  });
}

function buildUnitDesignStatus(ctx) {
  const source = ctx.unitDesignStatus || { records: [], authority_boundary: {} };
  const records = source.records || [];
  const unresolved = records.filter((item) => item.status !== 'retired_after_cli_mutation');
  const issues = records.map((item, index) => issue(
    'unit-design-status',
    index + 1,
    item.status === 'retired_after_cli_mutation' ? 'info' : item.promotion_blocked ? 'high' : 'medium',
    item.unit_id,
    item.status || 'unit_design_status',
    (item.evidence_refs && item.evidence_refs[0] && item.evidence_refs[0].path) || UNIT_DESIGN_STATUS,
    item.status === 'retired_after_cli_mutation'
      ? `Keep deprecated ${item.unit_id} out of active promotion dependencies and use successor units instead.`
      : `Keep ${item.unit_id} blocked for promotion until ${item.gate_id || 'the unit-design gate'} closes and any later CLI mutation executes.`,
    item.status === 'retired_after_cli_mutation'
      ? 'CLI mutation log and stale-reference audit exist, and active target-exercise dependencies no longer cite the retired unit.'
      : 'A human-reviewed unit-design decision record, dependent-unit audit, and later CLI-only mutation log exist if protected reference data changes.'
  ));
  const flags = source.authority_boundary || {};
  return makeReport('unit-design-status', [UNIT_DESIGN_STATUS], unresolved.length ? 'warn' : 'pass', issues, {
    overlay_status: source.status || 'unknown',
    record_count: records.length,
    by_status: countBy(records, (item) => item.status),
    unresolved_record_count: unresolved.length,
    promotion_blocked_count: records.filter((item) => item.promotion_blocked === true).length,
    affected_unit_count: new Set(records.flatMap((item) => item.affected_unit_ids || [])).size,
    gate_ids: [...new Set(records.map((item) => item.gate_id).filter(Boolean))].sort(),
    storage_strategy: source.storage_strategy && source.storage_strategy.strategy || 'unknown',
    internal_design_status: flags.internal_design_status === true,
    primary_evidence: flags.primary_evidence === true,
    curriculum_authority: flags.curriculum_authority === true,
    exam_authority: flags.exam_authority === true,
    scoring_rule: flags.scoring_rule === true,
    student_facing_exposure: flags.student_facing_exposure === true,
    student_diagnostics: flags.student_diagnostics === true,
    adaptive_routing: flags.adaptive_routing === true,
    mastery_decision: flags.mastery_decision === true,
    automatic_sequencing: flags.automatic_sequencing === true,
    student_facing_ai: flags.student_facing_ai === true,
    summative_use: flags.summative_use === true,
    pv_projection: flags.pv_projection === true,
    pv_machine_promotion: flags.pv_machine_promotion === true,
    machine_field_migration: flags.machine_field_migration === true,
    protected_reference_mutation_authorized: flags.protected_reference_mutation_authorized === true,
  });
}

function buildExamIngestionCoverage(ctx) {
  const items = (ctx.examItemOverlays && ctx.examItemOverlays.records) || [];
  const answerModels = (ctx.examAnswerModelOverlays && ctx.examAnswerModelOverlays.records) || [];
  const sourceAnnexes = (ctx.examSourceAnnexOverlays && ctx.examSourceAnnexOverlays.records) || [];
  const gate = ctx.ex2GateClosure || {};
  const reviewedClassifications = gate.reviewed_classifications || [];
  const answerModelByItem = new Map(answerModels.map((record) => [record.exam_item_id, record]));
  const sourceAnnexByItem = new Map(sourceAnnexes.map((record) => [record.exam_item_id, record]));
  const classificationsByPrefix = new Map();

  function questionPrefix(item) {
    const q = item.source_record_locator && item.source_record_locator.question_num;
    return q ? `q${q}` : item.exam_item_id;
  }

  for (const classification of reviewedClassifications) {
    const prefix = (classification.requirement_id || '').split('-')[0];
    if (!classificationsByPrefix.has(prefix)) classificationsByPrefix.set(prefix, []);
    classificationsByPrefix.get(prefix).push(classification);
  }

  const coverageRecords = items.map((item) => {
    const prefix = questionPrefix(item);
    const sourceMaterial = item.source_material || {};
    const answerOverlay = answerModelByItem.get(item.exam_item_id) || {};
    const sourceOverlay = sourceAnnexByItem.get(item.exam_item_id) || {};
    const blockingGapIds = [
      ...(sourceOverlay.blocking_gaps || []),
      ...((sourceMaterial.gaps || []).filter((gap) => gap.severity === 'blocking').map((gap) => gap.gap_id)),
    ];
    const uniqueBlockingGapIds = [...new Set(blockingGapIds)].sort();
    const reviewed = classificationsByPrefix.get(prefix) || [];
    const lessonHandoffStatus = uniqueBlockingGapIds.length
      ? 'blocked'
      : (item.lesson_build_handoff && item.lesson_build_handoff.handoff_status) || 'unknown';
    return {
      exam_item_id: item.exam_item_id,
      pilot_role: (answerOverlay.pilot_role || sourceOverlay.pilot_role || (item.question_classification && (item.question_classification.content_domains || []).find((domain) => domain.startsWith('pilot:')) || '').replace(/^pilot:/, '') || 'unknown'),
      exam: item.source_record_locator && item.source_record_locator.exam,
      level: item.source_record_locator && item.source_record_locator.level,
      year: item.source_record_locator && item.source_record_locator.year,
      timevak: item.source_record_locator && item.source_record_locator.timevak,
      opgave_num: item.source_record_locator && item.source_record_locator.opgave_num,
      question_num: item.source_record_locator && item.source_record_locator.question_num,
      points: item.prompt_metadata && item.prompt_metadata.points,
      question_type: item.prompt_metadata && item.prompt_metadata.question_type,
      answer_format: item.prompt_metadata && item.prompt_metadata.answer_format,
      prompt_status: item.prompt && item.prompt.prompt_status,
      ingestion_status: item.ingestion_status,
      source_material_status: sourceMaterial.source_material_status,
      answer_model_status: item.official_answer_model && item.official_answer_model.answer_model_status,
      source_object_counts: {
        tables: (sourceMaterial.tables || []).length,
        figures: (sourceMaterial.figures || []).length,
        graphs: (sourceMaterial.graphs || []).length,
        uitwerkbijlagen: (sourceMaterial.uitwerkbijlagen || []).length,
      },
      blocking_gap_ids: uniqueBlockingGapIds,
      lesson_handoff_status: lessonHandoffStatus,
      target_paragraph_candidate: item.lesson_build_handoff && item.lesson_build_handoff.target_paragraph_candidate,
      reviewed_requirement_ids: reviewed.map((record) => record.requirement_id),
      reviewed_classification_count: reviewed.length,
      product_boundary: item.product_boundary || {},
    };
  });

  const allBlockingGapIds = [...new Set(coverageRecords.flatMap((record) => record.blocking_gap_ids || []))].sort();
  const classificationCounts = countBy(reviewedClassifications, (record) => record.classification);
  const issueList = [
    issue(
      'exam-ingestion-coverage',
      1,
      'medium',
      'q3-calc-1',
      'operation_registry_need',
      EX2_GATE_CLOSURE,
      'Keep q3 annual cost-threshold comparison as an operation-registry need; use A61 only as source-reading support and keep A15 marked stale/incorrect for this task.',
      'A later governed EX-4 plan or review decides whether the annual threshold operation becomes an operation entry, a strengthened existing procedure, or another reviewed route.'
    ),
    issue(
      'exam-ingestion-coverage',
      2,
      'medium',
      'q3-answer-1',
      'answer_skill_need',
      EX2_GATE_CLOSURE,
      'Keep the threshold conclusion with unit and direction visible as a separate answer-skill need.',
      'A reviewed answer-skill route exists for threshold-conclusion wording, or a later gate explicitly assigns it to a governed procedure.'
    ),
    issue(
      'exam-ingestion-coverage',
      3,
      'high',
      'q19-source-annex-gap',
      'blocking_source_annex_gap',
      EX2_GATE_CLOSURE,
      'Keep q19 blocked for full mapping and lesson handoff until the official source figure and worksheet are reconstructed or a later gate accepts a visible limitation.',
      'The q19 overlay contains reconstructable source figure and uitwerkbijlage evidence, or the blocking gap remains explicitly carried forward.'
    ),
    issue(
      'exam-ingestion-coverage',
      4,
      'high',
      'q19-graph-object-gap',
      'blocking_graph_object_gap',
      EX2_GATE_CLOSURE,
      'Keep q19 PV/graph projection and lesson handoff blocked until the three market graph objects are reconstructable.',
      'The q19 overlay contains graph axes, units, line geometry, source locators, and worksheet context, or the blocking graph gap remains explicit.'
    ),
    issue(
      'exam-ingestion-coverage',
      5,
      'medium',
      'q19-graph-op-1',
      'existing_mtu_but_procedure_too_weak_plus_pv_graph_need',
      EX2_GATE_CLOSURE,
      'Carry A42 and D10 as stronger candidates, keep A45 as weak prerequisite/support only, and do not mutate graph/PV registries from EX-3.',
      'A later governed sprint either strengthens reviewed graph-shift procedures or creates a reviewed PV/graph route after source/graph gaps are resolved.'
    ),
    issue(
      'exam-ingestion-coverage',
      6,
      'medium',
      'q19-reason-1',
      'operation_registry_need',
      EX2_GATE_CLOSURE,
      'Keep chained multi-market reasoning as a provisional operation-registry need with D10/D13 partial support.',
      'A later reviewed plan decides the chained market-shift operation route without hidden source/graph gaps.'
    ),
    issue(
      'exam-ingestion-coverage',
      7,
      'medium',
      'q15-answer-1',
      'answer_skill_need',
      EX2_GATE_CLOSURE,
      'Keep the two-step correction-model explanation visible as an answer-skill need even though D27/F03/F09 cover content.',
      'A reviewed answer-skill route exists for two-step correction-model explanations, or a later gate assigns it to governed strengthened MTU procedures.'
    ),
  ];

  const authorityBoundary = {
    protected_reference_mutation_authorized: false,
    external_source_mutation_authorized: false,
    machine_reference_mutation_authorized: false,
    unit_minting_authorized: false,
    operation_registry_mutation_authorized: false,
    answer_skill_mutation_authorized: false,
    target_exercise_promotion_authorized: false,
    lesson_output_mutation_authorized: false,
    cp6_closure_authorized: false,
    year1_closure_authorized: false,
    diagnostics_authorized: false,
    adaptive_routing_authorized: false,
    mastery_decisions_authorized: false,
    automatic_sequencing_authorized: false,
    student_facing_ai_authorized: false,
    summative_use_authorized: false,
    pv_projection_authorized: false,
    pv_machine_promotion_authorized: false,
    student_facing_output_authorized: false,
  };

  const summary = {
    gate_status: gate.status || 'unknown',
    decision_scope: gate.decision_scope || 'unknown',
    allowed_next_sprint: gate.allowed_next_sprint || 'unknown',
    pilot_item_count: items.length,
    pilot_items_by_role: countBy(coverageRecords, (record) => record.pilot_role),
    pilot_items_by_year: countBy(coverageRecords, (record) => record.year),
    prompt_status_counts: countBy(items, (item) => item.prompt && item.prompt.prompt_status),
    source_material_status_counts: countBy(coverageRecords, (record) => record.source_material_status),
    answer_model_status_counts: countBy(coverageRecords, (record) => record.answer_model_status),
    source_object_counts: {
      tables: coverageRecords.reduce((sum, record) => sum + record.source_object_counts.tables, 0),
      figures: coverageRecords.reduce((sum, record) => sum + record.source_object_counts.figures, 0),
      graphs: coverageRecords.reduce((sum, record) => sum + record.source_object_counts.graphs, 0),
      uitwerkbijlagen: coverageRecords.reduce((sum, record) => sum + record.source_object_counts.uitwerkbijlagen, 0),
    },
    reviewed_classification_count: reviewedClassifications.length,
    classification_counts: classificationCounts,
    blocking_gap_count: allBlockingGapIds.length,
    blocked_item_count: coverageRecords.filter((record) => record.lesson_handoff_status === 'blocked').length,
    lesson_handoff_ready_with_gaps: coverageRecords.filter((record) => record.lesson_handoff_status === 'ready_with_gaps').length,
    lesson_handoff_blocked: coverageRecords.filter((record) => record.lesson_handoff_status === 'blocked').length,
    all_product_boundaries_false: items.every((item) => Object.entries(item.product_boundary || {})
      .filter(([key]) => key.endsWith('_authorized'))
      .every(([, value]) => value === false)),
    ...authorityBoundary,
  };

  const report = makeReport(
    'exam-ingestion-coverage',
    [EXAM_ITEM_OVERLAYS, EXAM_ANSWER_MODEL_OVERLAYS, EXAM_SOURCE_ANNEX_OVERLAYS, EX2_GATE_CLOSURE],
    allBlockingGapIds.length || issueList.length ? 'warn' : 'pass',
    issueList,
    summary
  );
  report.coverage_records = coverageRecords;
  report.reviewed_classifications = reviewedClassifications;
  report.conditions_carried_forward = gate.conditions_to_reopen_or_pass || [];
  report.blocked_outcomes = gate.blocked_outcomes || [];
  report.allowed_next_sprint_scope = gate.allowed_next_sprint_scope || [];
  report.blocked_next_sprint_scope = gate.blocked_next_sprint_scope || [];
  report.proof_required_before_next_use = [
    'q19 must remain blocked for lesson handoff and full MTU mapping until the source figure and uitwerkbijlage are reconstructable, or a later human gate explicitly accepts a visible limitation.',
    'q3 may move only to planning or dry-run lesson coordination while q3-calc-1 remains an operation-registry need and q3-answer-1 remains an answer-skill need.',
    'q15 may move only to planning or dry-run lesson coordination while q15-answer-1 remains an answer-skill need.',
    'Any unit, operation, answer-skill, or PV/graph mutation requires a later governed plan and explicit human authorization; EX-3 is reporting only.',
  ];
  report.authority_boundary = authorityBoundary;
  return report;
}

function main() {
  const ctx = {
    units: loadUnits(),
    terms: loadTerms(),
    exams: readJson(EXAMS, []),
    targets: readJson(TARGETS, {}),
    emptyNeeds: readJson(EMPTY_NEEDS, { entries: [], summary: {} }),
    qualityIssues: readJson(QUALITY_ISSUES, { issues: [] }),
    misconceptions: readJson(MISCONCEPTIONS, { records: [], authority_flags: {} }),
    unitDesignStatus: readJson(UNIT_DESIGN_STATUS, { records: [], authority_boundary: {} }),
    examItemOverlays: readJson(EXAM_ITEM_OVERLAYS, { records: [] }),
    examAnswerModelOverlays: readJson(EXAM_ANSWER_MODEL_OVERLAYS, { records: [] }),
    examSourceAnnexOverlays: readJson(EXAM_SOURCE_ANNEX_OVERLAYS, { records: [] }),
    ex2GateClosure: readJson(EX2_GATE_CLOSURE, { reviewed_classifications: [] }),
  };

  const reports = [
    buildDagIntegrity(ctx),
    buildTerminologyDrift(ctx),
    buildUnresolvedRefs(ctx),
    buildNeedsCoverage(ctx),
    buildTermsCoverage(ctx),
    buildProcedureCoverage(ctx),
    buildAspectsCoverage(ctx),
    buildDeadUnits(ctx),
    buildBegrippenCoverage(ctx),
    buildEmptyNeedsAuditSummary(ctx),
    buildReferenceQualityIssues(ctx),
    buildMisconceptionRegistry(ctx),
    buildUnitDesignStatus(ctx),
    buildExamIngestionCoverage(ctx),
  ];

  for (const report of reports) writeReport(report);

  const manifest = {
    generated_by: 'build-scripts/reports/generate-all.js',
    generated_on: now(),
    report_count: reports.length,
    reports: reports.map((report) => ({
      report_id: report.report_id,
      status: report.status,
      issue_count: report.issues.length,
      json_path: `reports/json/${report.report_id}.json`,
      markdown_path: `reports/markdown/${report.report_id}.md`,
      content_hash: sha(JSON.stringify(report)),
    })),
  };
  fs.writeFileSync(path.join(JSON_DIR, 'report-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`OK generated ${reports.length} JSON-first report(s). Manifest: reports/json/report-manifest.json`);
}

if (require.main === module) main();
