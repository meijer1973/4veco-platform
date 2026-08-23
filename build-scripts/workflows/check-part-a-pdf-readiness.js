#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { PARA_TYPES, classifyParagraph } = require('../../scripts/lib/paragraph-types');

const MIN_PDF_BYTES = 10000;
const ACTIVE_BOOK_PATTERN = /^Boek \d+ - /;
const PARAGRAPH_PATTERN = /^\d+\.\d+\.\d+ /;
const TEXTBOOK_MARKDOWN_PATTERN = /(?:paragraaf|opgaven|antwoorden|samenvatting|toets|toetsmatrijs)\.md$/i;
const PARAGRAPH_TYPES = Object.freeze(Object.entries(PARA_TYPES).map(([type, spec]) => Object.freeze({
  type,
  required: spec.requiredPdf,
})));

function parseArgs(argv) {
  const options = {};
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === '--lesson-root') options.lessonRoot = value;
    else if (arg === '--expected-lesson-sha') options.expectedLessonSha = value;
    else if (arg === '--json-out') options.jsonOut = value;
    else if (arg === '--markdown-out') options.markdownOut = value;
    else throw new Error(`unknown argument: ${arg}`);
    index += 1;
  }

  for (const field of ['lessonRoot', 'expectedLessonSha', 'jsonOut', 'markdownOut']) {
    if (!options[field]) throw new Error(`missing required argument: ${field}`);
  }
  if (!/^[0-9a-f]{40}$/i.test(options.expectedLessonSha)) {
    throw new Error('--expected-lesson-sha must be a full 40-character commit SHA');
  }
  return options;
}

function git(root, args, options = {}) {
  const result = spawnSync('git', args, {
    cwd: root,
    encoding: options.encoding || 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${(result.stderr || result.stdout || '').trim()}`);
  }
  return result.stdout;
}

function gitValue(root, args) {
  return git(root, args).trim();
}

function trackedFiles(root, ref = 'HEAD') {
  return git(root, ['ls-tree', '-rz', '--name-only', ref, '--'])
    .split('\0')
    .filter(Boolean)
    .map((file) => file.replace(/\\/g, '/'));
}

function isActiveParagraphMarkdown(file) {
  const segments = file.split('/');
  if (segments.length < 4 || !ACTIVE_BOOK_PATTERN.test(segments[0])) return false;
  if (!PARAGRAPH_PATTERN.test(segments[segments.length - 2])) return false;
  return TEXTBOOK_MARKDOWN_PATTERN.test(segments[segments.length - 1]);
}

function findBySuffix(files, suffix) {
  const lowerSuffix = suffix.toLowerCase();
  return files.find((file) => path.posix.basename(file).toLowerCase().endsWith(lowerSuffix)) || null;
}

function fileSizeAtRef(root, ref, file) {
  return Number(gitValue(root, ['cat-file', '-s', `${ref}:${file}`]));
}

function paragraphType(directory) {
  const name = path.posix.basename(directory);
  const type = classifyParagraph(name);
  return PARAGRAPH_TYPES.find((entry) => entry.type === type);
}

function inspectParagraph(root, directory, files) {
  const localFiles = files.filter((file) => path.posix.dirname(file) === directory);
  const spec = paragraphType(directory);
  const markdown = spec.required.map((role) => findBySuffix(localFiles, `${role}.md`)).filter(Boolean);
  const buildScript = localFiles.includes(`${directory}/build_pdf.py`)
    ? `${directory}/build_pdf.py`
    : null;
  const pdfs = spec.required.map((role) => {
    const file = findBySuffix(localFiles, `${role}.pdf`);
    const bytes = file ? fileSizeAtRef(root, 'HEAD', file) : null;
    return {
      role,
      file,
      bytes,
      ok: Boolean(file && bytes >= MIN_PDF_BYTES),
    };
  });
  const failures = [];
  if (!buildScript) failures.push('missing build_pdf.py');
  for (const pdf of pdfs) {
    if (!pdf.file) failures.push(`missing ${pdf.role}.pdf`);
    else if (pdf.bytes < MIN_PDF_BYTES) {
      failures.push(`${pdf.role}.pdf is ${pdf.bytes} bytes; minimum is ${MIN_PDF_BYTES}`);
    }
  }

  return {
    path: directory,
    type: spec.type,
    textbook_markdown: markdown,
    build_pdf: buildScript,
    required_pdfs: pdfs,
    ok: failures.length === 0,
    failures,
  };
}

function buildReport(options) {
  const lessonRoot = path.resolve(options.lessonRoot);
  const expectedLessonSha = options.expectedLessonSha.toLowerCase();
  const repositoryRoot = path.resolve(gitValue(lessonRoot, ['rev-parse', '--show-toplevel']));
  const headSha = gitValue(lessonRoot, ['rev-parse', 'HEAD']).toLowerCase();
  const originMainSha = gitValue(lessonRoot, ['rev-parse', 'origin/main']).toLowerCase();
  const status = git(lessonRoot, ['status', '--porcelain']).trim();
  const repositoryFailures = [];

  if (repositoryRoot.toLowerCase() !== lessonRoot.toLowerCase()) {
    repositoryFailures.push(`lesson root is not the repository root: ${repositoryRoot}`);
  }
  if (status) repositoryFailures.push('lesson worktree is not clean');
  if (headSha !== originMainSha) repositoryFailures.push(`HEAD ${headSha} does not match origin/main ${originMainSha}`);
  if (headSha !== expectedLessonSha) repositoryFailures.push(`HEAD ${headSha} does not match expected lesson SHA ${expectedLessonSha}`);
  if (originMainSha !== expectedLessonSha) {
    repositoryFailures.push(`origin/main ${originMainSha} does not match expected lesson SHA ${expectedLessonSha}`);
  }

  const files = trackedFiles(lessonRoot, 'HEAD');
  const paragraphDirectories = Array.from(new Set(
    files.filter(isActiveParagraphMarkdown).map((file) => path.posix.dirname(file))
  )).sort((a, b) => a.localeCompare(b));
  const paragraphs = paragraphDirectories.map((directory) => inspectParagraph(lessonRoot, directory, files));
  const paragraphFailures = paragraphs.flatMap((paragraph) => (
    paragraph.failures.map((failure) => `${paragraph.path}: ${failure}`)
  ));
  const passed = paragraphs.filter((paragraph) => paragraph.ok).length;
  const failed = paragraphs.length - passed;
  const byType = Object.fromEntries(PARAGRAPH_TYPES.map(({ type }) => [
    type,
    paragraphs.filter((paragraph) => paragraph.type === type).length,
  ]));

  return {
    schema_version: 1,
    check: 'part-a-pdf-readiness',
    source_ref: 'origin/main',
    lesson_root: lessonRoot.replace(/\\/g, '/'),
    expected_lesson_sha: expectedLessonSha,
    observed_head_sha: headSha,
    observed_origin_main_sha: originMainSha,
    lesson_worktree_clean: !status,
    active_paragraph_rule: 'tracked textbook markdown inside Boek N paragraph directories named X.Y.Z Name',
    minimum_pdf_bytes: MIN_PDF_BYTES,
    summary: {
      paragraphs_checked: paragraphs.length,
      passed,
      failed,
      by_type: byType,
    },
    paragraphs,
    failures: [...repositoryFailures, ...paragraphFailures],
    ok: repositoryFailures.length === 0 && failed === 0 && paragraphs.length > 0,
  };
}

function renderMarkdown(report) {
  const lines = [
    '# Lesson Main Part A PDF Readiness',
    '',
    `- Source ref: \`${report.source_ref}\``,
    `- Lesson SHA: \`${report.observed_head_sha}\``,
    `- Expected SHA: \`${report.expected_lesson_sha}\``,
    `- Worktree clean: \`${report.lesson_worktree_clean}\``,
    `- Paragraphs: ${report.summary.paragraphs_checked}`,
    `- Passed: ${report.summary.passed}`,
    `- Failed: ${report.summary.failed}`,
    `- Verdict: \`${report.ok ? 'PASS' : 'FAIL'}\``,
    '',
    '| Paragraph | Type | build_pdf.py | Required PDFs | Result |',
    '|---|---|---|---|---|',
  ];

  for (const paragraph of report.paragraphs) {
    const pdfs = paragraph.required_pdfs
      .map((pdf) => `${pdf.role}: ${pdf.file ? `${pdf.bytes} bytes` : 'missing'}`)
      .join('; ');
    lines.push(`| ${paragraph.path} | ${paragraph.type} | ${paragraph.build_pdf ? 'present' : 'missing'} | ${pdfs} | ${paragraph.ok ? 'PASS' : 'FAIL'} |`);
  }

  if (report.failures.length > 0) {
    lines.push('', '## Failures', '');
    for (const failure of report.failures) lines.push(`- ${failure}`);
  }
  return `${lines.join('\n')}\n`;
}

function writeReport(report, options) {
  const jsonOut = path.resolve(options.jsonOut);
  const markdownOut = path.resolve(options.markdownOut);
  fs.mkdirSync(path.dirname(jsonOut), { recursive: true });
  fs.mkdirSync(path.dirname(markdownOut), { recursive: true });
  fs.writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(markdownOut, renderMarkdown(report), 'utf8');
}

function runCli(argv = process.argv) {
  try {
    const options = parseArgs(argv);
    const report = buildReport(options);
    writeReport(report, options);
    console.log(JSON.stringify({ ok: report.ok, summary: report.summary, failures: report.failures }, null, 2));
    return report.ok ? 0 : 1;
  } catch (error) {
    console.error(`Part A PDF readiness check failed: ${error.message}`);
    return 1;
  }
}

if (require.main === module) process.exit(runCli());

module.exports = {
  MIN_PDF_BYTES,
  PARAGRAPH_TYPES,
  parseArgs,
  isActiveParagraphMarkdown,
  paragraphType,
  inspectParagraph,
  buildReport,
  renderMarkdown,
  writeReport,
  runCli,
};
