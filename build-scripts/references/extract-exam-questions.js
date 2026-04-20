#!/usr/bin/env node
/**
 * extract-exam-questions.js
 *
 * Parse CvTE havo/vwo economie opgaven PDFs in references/external/exams/
 * into a structured question table at
 *   references/external/exam-questions.json
 *
 * Each row captures the machine-extractable facts about a question; the
 * annotation fields (required_skills, question_type, exam_codes) are left
 * empty for the audit pass to fill via unit-add / unit-update.
 *
 * Row shape:
 *   {
 *     exam: "vw-1022-a-25-1",        // exam code
 *     level: "vwo",                  // vwo | havo
 *     year: 2025,
 *     tijdvak: 1,
 *     opgave_num: 1,
 *     opgave_name: "Zorgverzekering",
 *     question_num: 3,
 *     points: 2,
 *     text: "Bereken tot welk bedrag ...",
 *     required_skills: [],           // unit IDs — TODO via audit
 *     question_type: null,           // from vraagtypen-en-opgaveontwerp — TODO
 *     exam_codes: []                 // eindtermen — TODO
 *   }
 *
 * The opgaven PDFs use tab-separated question rows:
 *   <points>p \t <question-number> \t <question-text>
 * Question text can span multiple lines; we concatenate until the next
 * question start or the next Opgave header.
 */

const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const EXAMS_DIR = path.join(REPO_ROOT, 'references/external/exams');
const OUT_JSON  = path.join(REPO_ROOT, 'references/external/exam-questions.json');

// Match the "2p\t3\t<text>" line. The PDF sometimes renders the tab as
// wide whitespace; we accept runs of whitespace as a tab.
const QUESTION_START_RE = /^(\d+)p\s+(\d+)\s+(.+?)\s*$/;
const OPGAVE_RE = /^Opgave\s+(\d+)\s+(.+?)\s*$/;
const PAGE_FOOTER_RE = /^-- \d+ of \d+ --$/;
const PAGE_HEADER_RE = /^[vh][wa]-1022-a-\d+-\d+-o\s+\d+ \/ \d+\s+lees verder/;

function parseExamCode(filename) {
  const m = filename.match(/^(vw|ha)-1022-a-(\d\d)-(\d)-o\.pdf$/);
  if (!m) return null;
  return {
    code: filename.replace(/\.pdf$/, ''),
    level: m[1] === 'vw' ? 'vwo' : 'havo',
    year: 2000 + parseInt(m[2], 10),
    tijdvak: parseInt(m[3], 10),
  };
}

function cleanText(s) {
  return s.replace(/\s+/g, ' ').trim();
}

function extractQuestions(text, examMeta) {
  const lines = text.split(/\r?\n/);
  const questions = [];
  let currentOpgave = null;
  let currentQuestion = null;

  function flush() {
    if (currentQuestion) {
      currentQuestion.text = cleanText(currentQuestion.text);
      questions.push(currentQuestion);
      currentQuestion = null;
    }
  }

  for (const line of lines) {
    if (PAGE_FOOTER_RE.test(line.trim()) || PAGE_HEADER_RE.test(line.trim())) continue;

    const op = OPGAVE_RE.exec(line.trim());
    if (op) {
      flush();
      currentOpgave = { num: parseInt(op[1], 10), name: op[2].trim() };
      continue;
    }

    const q = QUESTION_START_RE.exec(line);
    if (q && currentOpgave) {
      flush();
      currentQuestion = {
        exam: examMeta.code,
        level: examMeta.level,
        year: examMeta.year,
        tijdvak: examMeta.tijdvak,
        opgave_num: currentOpgave.num,
        opgave_name: currentOpgave.name,
        question_num: parseInt(q[2], 10),
        points: parseInt(q[1], 10),
        text: q[3],
        required_skills: [],
        question_type: null,
        exam_codes: [],
      };
      continue;
    }

    if (currentQuestion) {
      currentQuestion.text += ' ' + line.trim();
    }
  }
  flush();
  return questions;
}

async function main() {
  if (!fs.existsSync(EXAMS_DIR)) {
    console.error(`missing: ${EXAMS_DIR}`);
    process.exit(1);
  }

  const pdfFiles = fs.readdirSync(EXAMS_DIR)
    .filter(f => /-o\.pdf$/.test(f))
    .sort();
  if (pdfFiles.length === 0) {
    console.error('no opgaven PDFs found; run download-exams.js first');
    process.exit(1);
  }

  const all = [];
  for (const f of pdfFiles) {
    const meta = parseExamCode(f);
    if (!meta) { console.warn(`skipping ${f}: cannot parse code`); continue; }
    const buf = fs.readFileSync(path.join(EXAMS_DIR, f));
    const text = (await new PDFParse({ data: new Uint8Array(buf) }).getText()).text;
    const questions = extractQuestions(text, meta);
    console.log(`${f}: ${questions.length} questions`);
    all.push(...questions);
  }

  all.sort((a, b) => {
    if (a.exam !== b.exam) return a.exam.localeCompare(b.exam);
    return a.question_num - b.question_num;
  });

  fs.writeFileSync(OUT_JSON, JSON.stringify(all, null, 2) + '\n');
  console.log(`\nwrote ${path.relative(REPO_ROOT, OUT_JSON)} (${all.length} total questions)`);

  const byExam = {};
  const byType = {};
  for (const q of all) {
    byExam[q.exam] = (byExam[q.exam] || 0) + 1;
  }
  console.log('distribution:', byExam);
}

if (require.main === module) main().catch(err => { console.error(err); process.exit(1); });

module.exports = { parseExamCode, extractQuestions };
