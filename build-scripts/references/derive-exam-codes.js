#!/usr/bin/env node
/**
 * derive-exam-codes.js
 *
 * For each question in `references/external/exam-questions.json` that has
 * non-empty `required_skills` but empty `exam_codes`, fill `exam_codes`
 * with the union of cited units' `exam_codes` from the catalog. The logic
 * is exact by transitivity: if a student needs unit X to answer a question,
 * and X addresses eindterm E, then the question tests E.
 *
 * Does NOT overwrite non-empty `exam_codes` (the audit may have picked
 * more specific codes than the unit-level mapping suggests).
 *
 * Reports how many questions got filled and how many remain empty-by-
 * transitivity (cited units themselves have no exam_codes — a reverse
 * signal that those units need wiring to the syllabus).
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const UNITS_JSON    = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.json');
const QUESTIONS_JSON = path.join(REPO_ROOT, 'references/external/exam-questions.json');

function main() {
  const units = JSON.parse(fs.readFileSync(UNITS_JSON, 'utf8'));
  const unitExamCodes = new Map(); // id -> array of exam_codes
  for (const u of units) unitExamCodes.set(u.id, Array.isArray(u.exam_codes) ? u.exam_codes : []);

  const questions = JSON.parse(fs.readFileSync(QUESTIONS_JSON, 'utf8'));
  let filled = 0, residual = 0;
  const residualDetail = [];

  for (const q of questions) {
    const hasSkills = Array.isArray(q.required_skills) && q.required_skills.length > 0;
    const hasCodes  = Array.isArray(q.exam_codes) && q.exam_codes.length > 0;
    if (!hasSkills || hasCodes) continue;

    const derived = new Set();
    const skillsWithoutCodes = [];
    for (const skillId of q.required_skills) {
      const codes = unitExamCodes.get(skillId);
      if (!codes || codes.length === 0) {
        skillsWithoutCodes.push(skillId);
        continue;
      }
      for (const c of codes) derived.add(c);
    }

    if (derived.size > 0) {
      q.exam_codes = [...derived].sort();
      filled++;
    } else {
      residual++;
      residualDetail.push(`${q.exam}:q${q.question_num} skills=[${q.required_skills.join(',')}] none-wired=[${skillsWithoutCodes.join(',')}]`);
    }
  }

  fs.writeFileSync(QUESTIONS_JSON, JSON.stringify(questions, null, 2) + '\n');
  console.log(`filled exam_codes on ${filled} questions`);
  console.log(`residual ${residual} questions whose cited units have no exam_codes`);
  if (residual > 0 && residual <= 30) {
    for (const d of residualDetail) console.log('  ' + d);
  } else if (residual > 30) {
    for (const d of residualDetail.slice(0, 20)) console.log('  ' + d);
    console.log(`  ... and ${residual - 20} more`);
  }
}

if (require.main === module) main();
module.exports = { main };
