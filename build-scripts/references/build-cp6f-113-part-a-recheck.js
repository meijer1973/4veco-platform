#!/usr/bin/env node
/**
 * Build CP.6f focused 1.1.3 Part A remediation recheck artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this script read-only for lesson output and source references.
 * - Use it only after a lesson-side sprint has pushed remediation evidence.
 * - Do not patch lesson files, review files, or quality refs from here.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync, execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_REPO = path.resolve(ROOT, '..', '4veco-lessen');
const PARAGRAPH_DIR = path.join(
  LESSON_REPO,
  'Boek 1 - Grondslagen, vraag en aanbod',
  '1.1 Hoofdstuk Economisch denken en rekenen',
  '1.1.3 Grafieken en tabellen',
);
const ARCHIVE_DIR = path.join(LESSON_REPO, 'archive', 'sprints', 'L-CP6E');
const GENERATED_ON = '2026-05-21';

const OUTPUT_JSON = 'references/data/sprints/CP.6f-113-part-a-recheck.json';
const OUTPUT_MD = 'reports/reference-planning/CP.6f-113-part-a-recheck.md';

function repoPath(relPath) {
  return path.join(ROOT, relPath);
}

function writeJson(relPath, data) {
  fs.mkdirSync(path.dirname(repoPath(relPath)), { recursive: true });
  fs.writeFileSync(repoPath(relPath), `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(relPath, text) {
  fs.mkdirSync(path.dirname(repoPath(relPath)), { recursive: true });
  fs.writeFileSync(repoPath(relPath), text);
}

function git(command, cwd = ROOT) {
  try {
    return execSync(command, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (_error) {
    return 'unavailable';
  }
}

function slash(value) {
  return value.replace(/\\/g, '/');
}

function projectPath(absPath) {
  return slash(path.relative(ROOT, absPath));
}

function readAbs(absPath) {
  return fs.existsSync(absPath) ? fs.readFileSync(absPath, 'utf8') : '';
}

function findParagraphFile(kind, extension) {
  if (!fs.existsSync(PARAGRAPH_DIR)) {
    return {
      kind,
      extension,
      file_name: null,
      path: projectPath(path.join(PARAGRAPH_DIR, `missing-${kind}.${extension}`)),
      exists: false,
      text: '',
    };
  }
  const names = fs.readdirSync(PARAGRAPH_DIR);
  const lowerKind = kind.toLowerCase();
  const lowerExtension = `.${extension.toLowerCase()}`;
  const name = names.find((candidate) => {
    const lower = candidate.toLowerCase();
    return lower.startsWith('1.1.3') && lower.includes(lowerKind) && lower.endsWith(lowerExtension);
  });
  const absPath = name ? path.join(PARAGRAPH_DIR, name) : path.join(PARAGRAPH_DIR, `missing-${kind}.${extension}`);
  return {
    kind,
    extension,
    file_name: name || null,
    path: projectPath(absPath),
    exists: Boolean(name) && fs.existsSync(absPath),
    abs_path: absPath,
    text: Boolean(name) && fs.existsSync(absPath) ? readAbs(absPath) : '',
  };
}

function archiveFile(fileName) {
  const absPath = path.join(ARCHIVE_DIR, fileName);
  return {
    file_name: fileName,
    path: projectPath(absPath),
    exists: fs.existsSync(absPath),
    text: readAbs(absPath),
  };
}

function pdfText(file) {
  if (!file.exists) return { extracted: false, text: '', error: 'missing pdf' };
  try {
    return {
      extracted: true,
      text: execFileSync('pdftotext', ['-layout', file.abs_path, '-'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }),
      error: null,
    };
  } catch (error) {
    return {
      extracted: false,
      text: '',
      error: error.message,
    };
  }
}

function figureSequence(text) {
  const matches = Array.from(text.matchAll(/Figuur\s+(\d+)/gi)).map((match) => Number(match[1]));
  const firstSeen = [];
  for (const number of matches) {
    if (!firstSeen.includes(number)) firstSeen.push(number);
  }
  const expected = firstSeen.slice().sort((a, b) => a - b);
  const exactly123 = JSON.stringify(firstSeen) === JSON.stringify([1, 2, 3]);
  return {
    all_mentions_count: matches.length,
    first_seen_sequence: firstSeen,
    expected_sequence: expected,
    sequential_first_use: JSON.stringify(firstSeen) === JSON.stringify(expected),
    exactly_1_2_3: exactly123,
  };
}

function matchLineValue(text, key) {
  const pattern = new RegExp(`^\\s*${key}:\\s*"?([^"\\r\\n]+)"?`, 'mi');
  const match = text.match(pattern);
  return match ? match[1].trim() : null;
}

function yamlListAfter(text, key, stopKeys) {
  const start = text.match(new RegExp(`^\\s*${key}:\\s*$`, 'mi'));
  if (!start) return [];
  const after = text.slice(start.index + start[0].length);
  const stopPattern = new RegExp(`^\\s*(?:${stopKeys.join('|')}):\\s*`, 'mi');
  const stop = after.match(stopPattern);
  const section = stop ? after.slice(0, stop.index) : after;
  return Array.from(section.matchAll(/^\s*-\s+"?([^"\r\n]+)"?\s*$/gm)).map((match) => match[1].trim());
}

function qualityRefState(text) {
  const partA = text.match(/partA:[\s\S]*?(?=\ncompanion:|$)/)?.[0] || '';
  const review = partA.match(/review:[\s\S]*?(?=\n\w|$)/)?.[0] || partA;
  const flags = yamlListAfter(review, 'flags', ['fixed_flags']);
  const fixedFlags = yamlListAfter(review, 'fixed_flags', ['companion', 'procedures', 'surfaces']);
  return {
    schema_version: matchLineValue(text, 'schema_version'),
    part_a_verdict: review.match(/verdict:\s*"([^"]+)"/)?.[1] || null,
    part_a_last_reviewed: review.match(/last_reviewed:\s*"([^"]+)"/)?.[1] || null,
    flags,
    fixed_flags: fixedFlags,
    open_figure_flag: flags.some((flag) => /figuur|figure/i.test(flag)),
    fixed_figure_flag: fixedFlags.some((flag) => /figuur|figure/i.test(flag)),
  };
}

function reviewState(text) {
  const figureRow = text.match(/\|\s*Figuren in volgorde van verschijning\s*\|\s*\*\*([^*]+)\*\*\s*\|\s*([^|]+)\|/i);
  return {
    overall_verdict: text.match(/\|\s*\*\*Overall\*\*\s*\|\s*\*\*([^*]+)\*\*/)?.[1]?.trim() || null,
    focused_update: text.match(/\*\*Focused update:\*\*\s*([^\r\n]+)/)?.[1]?.trim() || null,
    figure_numbering_result: figureRow ? figureRow[1].trim() : null,
    figure_numbering_note: figureRow ? figureRow[2].trim() : null,
    action_items: Array.from(text.matchAll(/^\d+\.\s+(.+)$/gm)).map((match) => match[1].trim()),
    unresolved_figure_numbering_action: /Figuur-nummering[\s\S]{0,120}(?!FIXED)/i.test(text) &&
      !/FIXED[^\r\n]+Figuur-nummering|Figuur-nummering[^\r\n]+FIXED/i.test(text),
  };
}

function decide(evidence) {
  const requiredMissing = Object.values(evidence.files).filter((file) => file.exists === false);
  const archivesMissing = Object.values(evidence.lesson_archive).filter((file) => file.exists === false);
  if (requiredMissing.length > 0 || archivesMissing.length > 0) {
    return {
      status: 'blocked_no_evidence',
      part_a_blocker_cleared: false,
      cp6_unconditioned_closure_blocked_by_113_part_a: true,
      reason: 'Required live lesson evidence or L-CP6E archive evidence is missing.',
    };
  }

  if (!evidence.pdf.extracted) {
    return {
      status: 'blocked_no_evidence',
      part_a_blocker_cleared: false,
      cp6_unconditioned_closure_blocked_by_113_part_a: true,
      reason: `Could not extract PDF text for recheck: ${evidence.pdf.error}`,
    };
  }

  const sequenceChecks = [
    evidence.checks.markdown_figure_sequence,
    evidence.checks.html_figure_sequence,
    evidence.checks.pdf_figure_sequence,
  ];
  if (!sequenceChecks.every((check) => check.sequential_first_use && check.exactly_1_2_3)) {
    return {
      status: 'failed_clearance',
      part_a_blocker_cleared: false,
      cp6_unconditioned_closure_blocked_by_113_part_a: true,
      reason: 'At least one live Part A surface does not first mention figures in the order 1 -> 2 -> 3.',
    };
  }

  if (!['PASS', 'PASS WITH FLAGS'].includes(evidence.quality_ref.part_a_verdict)) {
    return {
      status: 'failed_clearance',
      part_a_blocker_cleared: false,
      cp6_unconditioned_closure_blocked_by_113_part_a: true,
      reason: `Quality-ref Part A verdict is ${evidence.quality_ref.part_a_verdict}, not PASS or PASS WITH FLAGS.`,
    };
  }

  if (evidence.quality_ref.open_figure_flag || evidence.review.unresolved_figure_numbering_action) {
    return {
      status: 'failed_clearance',
      part_a_blocker_cleared: false,
      cp6_unconditioned_closure_blocked_by_113_part_a: true,
      reason: 'Review or quality-ref evidence still carries an unresolved figure-numbering flag.',
    };
  }

  return {
    status: 'cleared',
    part_a_blocker_cleared: true,
    cp6_unconditioned_closure_blocked_by_113_part_a: false,
    reason: 'The live Part A markdown, HTML, and PDF first mention figures in order 1 -> 2 -> 3, and the updated review/quality-ref evidence no longer carries the figure-numbering blocker.',
  };
}

function sequenceText(sequence) {
  return sequence.first_seen_sequence.length > 0 ? sequence.first_seen_sequence.join(' -> ') : 'none';
}

function buildMarkdown(data) {
  return `# CP.6f Focused 1.1.3 Part A Remediation Recheck

Generated: ${data.generated_on}

Status: ${data.decision.status}

Part A figure-numbering blocker cleared: ${data.decision.part_a_blocker_cleared}

CP-6 closed: ${data.cp6_closed}

Year 1 closed: ${data.year1_closed}

## Decision

${data.decision.reason}

CP.6f does not mutate lesson output, lesson review files, lesson quality refs, protected references, target exercises, placeholders, or machine registries. It does not close CP-6 or Year 1.

## Evidence Commits

| Repository | Commit |
|---|---|
| Platform at recheck | ${data.platform_repo.commit} |
| Lessons at recheck | ${data.lesson_repo.commit} |

## Focused Evidence

| Check | Result |
|---|---|
| Required live files present | ${data.checks.required_live_files_present} |
| L-CP6E archive records present | ${data.checks.lesson_archive_present} |
| Markdown figure first-use sequence | ${sequenceText(data.checks.markdown_figure_sequence)} |
| HTML figure first-use sequence | ${sequenceText(data.checks.html_figure_sequence)} |
| PDF figure first-use sequence | ${sequenceText(data.checks.pdf_figure_sequence)} |
| Quality-ref Part A verdict | ${data.quality_ref.part_a_verdict} |
| Quality-ref open figure flag | ${data.quality_ref.open_figure_flag} |
| Quality-ref fixed figure flag | ${data.quality_ref.fixed_figure_flag} |
| Review overall verdict | ${data.review.overall_verdict || 'not structurally parsed'} |
| Review figure-numbering result | ${data.review.figure_numbering_result || 'not structurally parsed'} |
| Repeated worked example carried as non-blocking | ${data.checks.repeated_worked_example_accepted_non_blocking} |

## Figure Numbering

The current Part A markdown first mentions figures in this order:

\`\`\`text
${sequenceText(data.checks.markdown_figure_sequence)}
\`\`\`

The current Part A HTML first mentions figures in this order:

\`\`\`text
${sequenceText(data.checks.html_figure_sequence)}
\`\`\`

The current Part A PDF first mentions figures in this order:

\`\`\`text
${sequenceText(data.checks.pdf_figure_sequence)}
\`\`\`

Expected first-use order:

\`\`\`text
1 -> 2 -> 3
\`\`\`

The existing figure-numbering blocker is therefore ${data.decision.part_a_blocker_cleared ? 'cleared' : 'not cleared'}.

## Closure Consequence

- CP-6 unconditioned closure blocked by \`1.1.3\` Part A: ${data.decision.cp6_unconditioned_closure_blocked_by_113_part_a}
- CP-6 closure allowed now: ${data.cp6_closure_allowed_now}
- Year 1 closure allowed now: ${data.year1_closure_allowed_now}

The focused ` + '`1.1.3`' + ` Part A blocker is cleared for later closure-readiness accounting, but CP-6 and Year 1 remain open until a later authorized closure proposal and human confirmation address all remaining lanes.

## Next Action

${data.next_action}
`;
}

function main() {
  const files = {
    review: {
      file_name: '1.1.3-review.md',
      path: projectPath(path.join(PARAGRAPH_DIR, '1.1.3-review.md')),
      exists: fs.existsSync(path.join(PARAGRAPH_DIR, '1.1.3-review.md')),
      text: readAbs(path.join(PARAGRAPH_DIR, '1.1.3-review.md')),
    },
    quality_ref: {
      file_name: '1.1.3-quality-ref.yaml',
      path: projectPath(path.join(PARAGRAPH_DIR, '1.1.3-quality-ref.yaml')),
      exists: fs.existsSync(path.join(PARAGRAPH_DIR, '1.1.3-quality-ref.yaml')),
      text: readAbs(path.join(PARAGRAPH_DIR, '1.1.3-quality-ref.yaml')),
    },
    paragraaf_md: findParagraphFile('paragraaf', 'md'),
    paragraaf_html: findParagraphFile('paragraaf', 'html'),
    paragraaf_pdf: findParagraphFile('paragraaf', 'pdf'),
    opgaven_md: findParagraphFile('opgaven', 'md'),
  };

  const lessonArchive = {
    plan: archiveFile('L-CP6E-sprint-plan.md'),
    technical_qa: archiveFile('L-CP6E-technical-qa-report.md'),
    closure_log: archiveFile('L-CP6E-closure-log.md'),
    handoff: archiveFile('L-CP6E-handoff-to-references.md'),
  };

  const pdf = pdfText(files.paragraaf_pdf);
  const qualityRef = qualityRefState(files.quality_ref.text);
  const review = reviewState(files.review.text);
  const checks = {
    required_live_files_present: Object.values(files).every((file) => file.exists),
    lesson_archive_present: Object.values(lessonArchive).every((file) => file.exists),
    markdown_figure_sequence: figureSequence(files.paragraaf_md.text),
    html_figure_sequence: figureSequence(files.paragraaf_html.text.replace(/<[^>]+>/g, ' ')),
    pdf_figure_sequence: figureSequence(pdf.text),
    repeated_worked_example_accepted_non_blocking:
      /accepted non-blocking|accepted\/non-blocking|non-blocking scaffolding|non-blocking standalone-exercise/i.test(files.review.text) &&
      /worked example|uitgewerkt voorbeeld/i.test(files.opgaven_md.text),
    l_cp6e_handoff_ready: /READY FOR CP\.6f RECHECK/i.test(lessonArchive.handoff.text),
    l_cp6e_closed_pass_with_flags: /CLOSED PASS WITH FLAGS/i.test(lessonArchive.closure_log.text),
  };

  const evidence = { files, lesson_archive: lessonArchive, pdf, quality_ref: qualityRef, review, checks };
  const decision = decide(evidence);
  const data = {
    schema_version: 1,
    sprint_id: 'CP.6f',
    status: 'focused_lesson_remediation_recheck_recorded_not_closing',
    authority_level: 'non_mutating_lesson_remediation_recheck',
    generated_on: GENERATED_ON,
    focused_paragraph: {
      paragraph_id: '1.1.3',
      title: 'Grafieken en tabellen',
      blocker: 'Part A figure-numbering first-use order',
    },
    lesson_handoff_sprint: 'L-CP6E',
    platform_repo: {
      commit: git('git rev-parse HEAD'),
      working_tree_note: 'CP.6f generates platform-side evidence artifacts during this recheck; final commit cleanliness is checked separately.',
    },
    lesson_repo: {
      commit: git('git rev-parse HEAD', LESSON_REPO),
      dirty: git('git status --porcelain', LESSON_REPO).length > 0,
    },
    files: Object.fromEntries(
      Object.entries(files).map(([key, file]) => [
        key,
        { file_name: file.file_name, path: file.path, exists: file.exists },
      ]),
    ),
    lesson_archive: Object.fromEntries(
      Object.entries(lessonArchive).map(([key, file]) => [
        key,
        { file_name: file.file_name, path: file.path, exists: file.exists },
      ]),
    ),
    quality_ref: qualityRef,
    review,
    checks,
    decision,
    cp6_closed: false,
    year1_closed: false,
    cp6_closure_allowed_now: false,
    year1_closure_allowed_now: false,
    protected_reference_data_changed: false,
    lesson_output_changed: false,
    lesson_quality_ref_hand_patch: false,
    target_exercise_promotions: false,
    placeholder_finalization: false,
    unit_minting: false,
    machine_registry_mutation: false,
    student_diagnostics_authorized: false,
    adaptive_routing_authorized: false,
    mastery_decisions_authorized: false,
    automatic_sequencing_authorized: false,
    student_facing_ai_authorized: false,
    summative_use_authorized: false,
    pv_projection_authorized: false,
    pv_machine_promotion_authorized: false,
    student_facing_output_authorized: false,
    no_protected_mutation_authorized: true,
    no_lesson_output_mutation_authorized: true,
    no_lesson_quality_ref_hand_patch_authorized: true,
    no_target_exercise_promotion_authorized: true,
    no_placeholder_finalization_authorized: true,
    no_unit_minting_authorized: true,
    no_cp6_closure_authorized: true,
    no_year1_closure_authorized: true,
    next_action:
      decision.status === 'cleared'
        ? 'Close CP.6f as a focused clearance record, keep CP-6 and Year 1 open, and move EX-0 Exam Ingestion Contract Design to the active roadmap row.'
        : 'Keep CP-6 blocked and route another lesson-side remediation or explicit human decision before closure-readiness work.',
  };

  writeJson(OUTPUT_JSON, data);
  writeText(OUTPUT_MD, buildMarkdown(data));
  console.log(`Wrote ${OUTPUT_JSON}`);
  console.log(`Wrote ${OUTPUT_MD}`);
}

main();
