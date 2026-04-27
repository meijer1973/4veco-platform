#!/usr/bin/env node
/**
 * exam-question-gap-audit.js
 *
 * Non-mutating R4.2 audit for references/external/exam-questions.json.
 * Produces an evidence-carrying gap report and patch queue for missing
 * required-skill and exam-code annotations. It does not edit protected
 * reference files.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const QUESTIONS_JSON = path.join(REPO_ROOT, 'references/external/exam-questions.json');
const UNITS_JSON = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.json');
const EINDTERMEN_JSON = path.join(REPO_ROOT, 'references/external/syllabus-eindtermen.json');
const AUDIT_FILES = [
  path.join(REPO_ROOT, 'build-scripts/references/audit-2023-2024.json'),
  path.join(REPO_ROOT, 'build-scripts/references/audit-2025.json'),
];
const REPORT_MD = path.join(REPO_ROOT, 'reports/exam-question-extraction-gaps.md');
const REPORT_JSON = path.join(REPO_ROOT, 'reports/json/exam-question-extraction-gaps.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function questionKey(exam, questionNum) {
  return `${exam}:q${questionNum}`;
}

function snippet(text, max = 260) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 3).trimEnd() + '...';
}

function loadAuditAnnotations() {
  const map = new Map();
  for (const file of AUDIT_FILES) {
    if (!fs.existsSync(file)) continue;
    const data = readJson(file);
    for (const [exam, packet] of Object.entries(data || {})) {
      for (const annotation of (packet && packet.annotations) || []) {
        const key = questionKey(exam, annotation.question_num);
        map.set(key, {
          source_file: path.relative(REPO_ROOT, file).replace(/\\/g, '/'),
          required_skills: annotation.required_skills || [],
          exam_codes: annotation.exam_codes || [],
          question_type: annotation.question_type ?? null,
        });
      }
    }
  }
  return map;
}

function classifySkillCandidates(skills, unitIds) {
  const unresolved = [];
  const existing = [];
  for (const skill of skills || []) {
    if (unitIds.has(skill)) existing.push(skill);
    else unresolved.push(skill);
  }
  return { existing, unresolved, all_existing: unresolved.length === 0 };
}

function deriveCodesFromSkills(skills, unitById) {
  const codes = new Set();
  const missing = [];
  for (const skill of skills || []) {
    const unit = unitById.get(skill);
    if (!unit) {
      missing.push(skill);
      continue;
    }
    for (const code of unit.exam_codes || []) codes.add(code);
  }
  return { codes: [...codes].sort(), missing_unit_ids: missing };
}

function nextAction({ gapTypes, audit, auditSkillStatus, derivedCodes }) {
  if (gapTypes.includes('invalid_required_skill') || gapTypes.includes('invalid_exam_code')) {
    return 'fix_invalid_current_annotation';
  }
  if (gapTypes.includes('missing_exam_codes') && derivedCodes.codes.length > 0 && !gapTypes.includes('missing_required_skills')) {
    return 'review_derived_exam_codes';
  }
  if (gapTypes.includes('missing_required_skills') && (!audit || audit.required_skills.length === 0)) {
    return 'manual_required_skill_review';
  }
  if (audit && audit.required_skills.length > 0 && auditSkillStatus.all_existing) {
    return 'review_and_apply_existing_unit_annotation';
  }
  if (audit && audit.required_skills.length > 0 && !auditSkillStatus.all_existing) {
    return 'map_or_mint_unresolved_audit_skills';
  }
  if (audit && audit.exam_codes.length > 0) {
    return 'review_audit_exam_codes';
  }
  return 'manual_question_review';
}

function main() {
  const questions = readJson(QUESTIONS_JSON);
  const units = readJson(UNITS_JSON);
  const eindtermen = readJson(EINDTERMEN_JSON);
  const unitById = new Map(units.map((unit) => [unit.id, unit]));
  const unitIds = new Set(unitById.keys());
  const codeSet = new Set(eindtermen.map((item) => item.code).filter(Boolean));
  const auditAnnotations = loadAuditAnnotations();

  const byExam = {};
  const gaps = [];
  const actionCounts = {};
  const gapTypeCounts = {};

  for (const q of questions) {
    byExam[q.exam] = (byExam[q.exam] || 0) + 1;

    const requiredSkills = Array.isArray(q.required_skills) ? q.required_skills : [];
    const examCodes = Array.isArray(q.exam_codes) ? q.exam_codes : [];
    const invalidSkills = requiredSkills.filter((skill) => !unitIds.has(skill));
    const invalidCodes = examCodes.filter((code) => !codeSet.has(code));
    const gapTypes = [];

    if (requiredSkills.length === 0) gapTypes.push('missing_required_skills');
    if (examCodes.length === 0) gapTypes.push('missing_exam_codes');
    if (!q.question_type) gapTypes.push('missing_question_type');
    if (invalidSkills.length > 0) gapTypes.push('invalid_required_skill');
    if (invalidCodes.length > 0) gapTypes.push('invalid_exam_code');
    if (gapTypes.length === 0) continue;

    for (const type of gapTypes) gapTypeCounts[type] = (gapTypeCounts[type] || 0) + 1;

    const key = questionKey(q.exam, q.question_num);
    const audit = auditAnnotations.get(key) || null;
    const auditSkillStatus = classifySkillCandidates(audit ? audit.required_skills : [], unitIds);
    const derivedCodes = deriveCodesFromSkills(requiredSkills, unitById);
    const recommendedNextAction = nextAction({ gapTypes, audit, auditSkillStatus, derivedCodes });
    actionCounts[recommendedNextAction] = (actionCounts[recommendedNextAction] || 0) + 1;

    gaps.push({
      id: key,
      status: 'needs_review',
      gap_types: gapTypes,
      recommended_next_action: recommendedNextAction,
      evidence: {
        exam: q.exam,
        level: q.level,
        year: q.year,
        tijdvak: q.tijdvak,
        opgave_num: q.opgave_num,
        opgave_name: q.opgave_name,
        question_num: q.question_num,
        points: q.points,
        pages: [q.page_start, q.page_end],
        text_snippet: snippet(q.text),
      },
      current: {
        required_skills: requiredSkills,
        exam_codes: examCodes,
        question_type: q.question_type ?? null,
        invalid_required_skills: invalidSkills,
        invalid_exam_codes: invalidCodes,
      },
      candidates: {
        audit_annotation: audit,
        audit_skill_status: auditSkillStatus,
        derived_exam_codes_from_current_skills: derivedCodes,
      },
    });
  }

  gaps.sort((a, b) => a.id.localeCompare(b.id));

  const json = {
    schema_version: '0.1',
    sprint_id: 'R4.2',
    generated_on: new Date().toISOString().slice(0, 10),
    source: 'references/external/exam-questions.json',
    question_count: questions.length,
    exam_count: Object.keys(byExam).length,
    by_exam: byExam,
    summary: {
      gap_records: gaps.length,
      gap_type_counts: gapTypeCounts,
      recommended_next_action_counts: actionCounts,
    },
    patch_queue: gaps,
  };

  fs.mkdirSync(path.dirname(REPORT_JSON), { recursive: true });
  fs.writeFileSync(REPORT_JSON, JSON.stringify(json, null, 2) + '\n');

  const lines = [];
  lines.push('# Exam-Question Extraction Gaps');
  lines.push('');
  lines.push(`Generated: ${json.generated_on}`);
  lines.push(`Questions: ${json.question_count}`);
  lines.push(`Exams represented: ${json.exam_count}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Gap records: ${gaps.length}`);
  for (const [type, count] of Object.entries(gapTypeCounts).sort()) {
    lines.push(`- ${type}: ${count}`);
  }
  lines.push('');
  lines.push('## Recommended Next Actions');
  lines.push('');
  for (const [action, count] of Object.entries(actionCounts).sort()) {
    lines.push(`- ${action}: ${count}`);
  }
  lines.push('');
  lines.push('## Patch Queue');
  lines.push('');
  for (const item of gaps) {
    const audit = item.candidates.audit_annotation;
    lines.push(`### ${item.id}`);
    lines.push('');
    lines.push(`- gaps: ${item.gap_types.join(', ')}`);
    lines.push(`- next action: ${item.recommended_next_action}`);
    lines.push(`- evidence: ${item.evidence.exam}, opgave ${item.evidence.opgave_num} "${item.evidence.opgave_name}", vraag ${item.evidence.question_num}, pages ${item.evidence.pages.join('-')}`);
    lines.push(`- current required_skills: [${item.current.required_skills.join(', ')}]`);
    lines.push(`- current exam_codes: [${item.current.exam_codes.join(', ')}]`);
    if (audit) {
      lines.push(`- audit candidate (${audit.source_file}): skills=[${audit.required_skills.join(', ')}], codes=[${audit.exam_codes.join(', ')}], type=${audit.question_type}`);
      if (item.candidates.audit_skill_status.unresolved.length > 0) {
        lines.push(`- unresolved audit skills: [${item.candidates.audit_skill_status.unresolved.join(', ')}]`);
      }
    } else {
      lines.push('- audit candidate: none');
    }
    if (item.candidates.derived_exam_codes_from_current_skills.codes.length > 0) {
      lines.push(`- derived exam_codes from current skills: [${item.candidates.derived_exam_codes_from_current_skills.codes.join(', ')}]`);
    }
    lines.push(`- text: ${item.evidence.text_snippet}`);
    lines.push('');
  }
  if (gaps.length === 0) lines.push('No extraction gaps found.');

  fs.writeFileSync(REPORT_MD, lines.join('\n').replace(/\n+$/g, '') + '\n');
  console.log(`OK  ${gaps.length} exam-question gap record(s). Report: ${path.relative(REPO_ROOT, REPORT_MD)}`);
}

if (require.main === module) main();

module.exports = { main, loadAuditAnnotations, deriveCodesFromSkills };
