#!/usr/bin/env node
/**
 * Build CP.6e focused 1.1.3 Part A re-review artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this script read-only for lesson output and source references.
 * - If later lesson-side remediation changes the live 1.1.3 files, rerun this
 *   script to produce a new evidence decision; do not patch lesson files here.
 * - Keep validator expectations aligned with the recorded CP.6e scope.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_REPO = path.resolve(ROOT, '..', '4veco-lessen');
const PARAGRAPH_DIR = path.join(
  LESSON_REPO,
  'Boek 1 - Grondslagen, vraag en aanbod',
  '1.1 Hoofdstuk Economisch denken en rekenen',
  '1.1.3 Grafieken en tabellen',
);
const GENERATED_ON = '2026-05-21';

const CP6D = 'references/data/sprints/CP.6d-graph-heavy-evidence.json';
const OUTPUT_JSON = 'references/data/sprints/CP.6e-113-part-a-rereview.json';
const OUTPUT_MD = 'reports/reference-planning/CP.6e-113-part-a-rereview.md';
const HANDOFF_MD = 'reports/reference-planning/CP.6e-113-part-a-remediation-handoff.md';

const FILES = {
  review: '1.1.3-review.md',
  qualityRef: '1.1.3-quality-ref.yaml',
  paragraaf: '1.1.3 Grafieken en tabellen – paragraaf.md',
  opgaven: '1.1.3 Grafieken en tabellen – opgaven.md',
  antwoorden: '1.1.3 Grafieken en tabellen – antwoorden.md',
};

function repoPath(relPath) {
  return path.join(ROOT, relPath);
}

function read(relPath) {
  return fs.readFileSync(repoPath(relPath), 'utf8');
}

function readJson(relPath) {
  return JSON.parse(read(relPath));
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

function readLessonFile(fileName) {
  const absPath = path.join(PARAGRAPH_DIR, fileName);
  return {
    file_name: fileName,
    path: projectPath(absPath),
    exists: fs.existsSync(absPath),
    text: fs.existsSync(absPath) ? fs.readFileSync(absPath, 'utf8') : '',
  };
}

function matchLineValue(text, key) {
  const pattern = new RegExp(`^\\s*${key}:\\s*"?([^"\\r\\n]+)"?`, 'mi');
  const match = text.match(pattern);
  return match ? match[1].trim() : null;
}

function countMatches(text, pattern) {
  return (text.match(pattern) || []).length;
}

function figureSequence(markdown) {
  const matches = Array.from(markdown.matchAll(/Figuur\s+(\d+)/gi)).map((match) => Number(match[1]));
  const firstSeen = [];
  for (const number of matches) {
    if (!firstSeen.includes(number)) firstSeen.push(number);
  }
  const expected = firstSeen.slice().sort((a, b) => a - b);
  return {
    all_mentions: matches,
    first_seen_sequence: firstSeen,
    expected_sequence: expected,
    sequential_first_use: JSON.stringify(firstSeen) === JSON.stringify(expected),
    non_sequential_pairs: firstSeen
      .map((number, index) => ({ number, expected_at_position: expected[index], position: index + 1 }))
      .filter((item) => item.number !== item.expected_at_position),
  };
}

function imageRefs(markdown) {
  return Array.from(markdown.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)).map((match, index) => ({
    index: index + 1,
    alt: match[1],
    target: match[2],
  }));
}

function qualityRefState(text) {
  return {
    schema_version: matchLineValue(text, 'schema_version'),
    part_a_verdict: text.match(/partA:[\s\S]*?review:[\s\S]*?verdict:\s*"([^"]+)"/)?.[1] || null,
    part_a_last_reviewed:
      text.match(/partA:[\s\S]*?review:[\s\S]*?last_reviewed:\s*"([^"]+)"/)?.[1] || null,
    flags: Array.from(text.matchAll(/^\s+-\s+"([^"]+)"/gm)).map((match) => match[1]),
  };
}

function reviewState(text) {
  return {
    overall_verdict: text.match(/\|\s*\*\*Overall\*\*\s*\|\s*\*\*([^*]+)\*\*/)?.[1]?.trim() || null,
    action_items: Array.from(text.matchAll(/^\d+\.\s+(.+)$/gm)).map((match) => match[1].trim()),
    flag_count: countMatches(text, /\bFLAG\b/g),
    fail_count: countMatches(text, /\bFAIL\b/g),
  };
}

function decide(files, checks) {
  const requiredMissing = Object.values(files).filter((file) => !file.exists);
  if (requiredMissing.length > 0) {
    return {
      status: 'blocked_no_evidence',
      part_a_flag_cleared: false,
      cp6_unconditioned_closure_blocked_by_113_part_a: true,
      reason: `Required evidence missing: ${requiredMissing.map((file) => file.path).join(', ')}`,
    };
  }

  if (!checks.figure_sequence.sequential_first_use) {
    return {
      status: 'failed_clearance',
      part_a_flag_cleared: false,
      cp6_unconditioned_closure_blocked_by_113_part_a: true,
      reason: 'Current paragraaf.md still references Figuur 3 before Figuur 2, so the Part A figure-numbering flag is not cleared.',
    };
  }

  if (checks.repeated_worked_example.is_blocking) {
    return {
      status: 'failed_clearance',
      part_a_flag_cleared: false,
      cp6_unconditioned_closure_blocked_by_113_part_a: true,
      reason: 'Current opgaven.md repeats the worked example in a way CP.6e classifies as blocking.',
    };
  }

  return {
    status: 'cleared',
    part_a_flag_cleared: true,
    cp6_unconditioned_closure_blocked_by_113_part_a: false,
    reason: 'Focused Part A flags are no longer blocking in the live files.',
  };
}

function buildMarkdown(data) {
  return `# CP.6e Focused 1.1.3 Part A Re-Review

Generated: ${data.generated_on}

Status: ${data.decision.status}

Part A flag cleared: ${data.decision.part_a_flag_cleared}

CP-6 closed: ${data.cp6_closed}

Year 1 closed: ${data.year1_closed}

## Decision

${data.decision.reason}

CP.6e does not mutate lesson output, lesson review files, lesson quality refs, protected references, target exercises, placeholders, or machine registries. It does not close CP-6 or Year 1.

## Focused Evidence

| Check | Result |
|---|---|
| Required files present | ${data.checks.required_files_present} |
| Quality-ref Part A verdict | ${data.quality_ref.part_a_verdict} |
| Previous review overall verdict | ${data.review.overall_verdict || 'not structurally parsed'} |
| Figure first-use sequence | ${data.checks.figure_sequence.first_seen_sequence.join(' -> ')} |
| Figure first-use sequential | ${data.checks.figure_sequence.sequential_first_use} |
| Opgaven repeats worked example | ${data.checks.repeated_worked_example.present} |
| Repeated worked example accepted as non-blocking | ${data.checks.repeated_worked_example.accepted_as_non_blocking} |

## Figure Numbering

The current Part A paragraph first mentions figures in this order:

\`\`\`text
${data.checks.figure_sequence.first_seen_sequence.join(' -> ')}
\`\`\`

Expected first-use order:

\`\`\`text
${data.checks.figure_sequence.expected_sequence.join(' -> ')}
\`\`\`

The existing figure-numbering flag is therefore ${data.checks.figure_sequence.sequential_first_use ? 'cleared' : 'still open'}.

## Worked Example Repetition

Current \`opgaven.md\` ${data.checks.repeated_worked_example.present ? 'does' : 'does not'} include the worked example before the exercises.

CP.6e treats this as ${data.checks.repeated_worked_example.accepted_as_non_blocking ? 'accepted standalone-exercise scaffolding, not a CP-6 closure blocker by itself' : 'blocking for this focused clearance'}.

## Closure Consequence

- CP-6 unconditioned closure blocked by \`1.1.3\` Part A: ${data.decision.cp6_unconditioned_closure_blocked_by_113_part_a}
- CP-6 closure allowed now: ${data.cp6_closure_allowed_now}
- Year 1 closure allowed now: ${data.year1_closure_allowed_now}

## Next Action

${data.next_action}
`;
}

function buildHandoff(data) {
  const blockingFigure = !data.checks.figure_sequence.sequential_first_use;
  return `# CP.6e 1.1.3 Part A Remediation Handoff

Generated: ${data.generated_on}

Status: ${data.decision.status}

## Handoff Need

${blockingFigure ? 'Lesson-side remediation is required before the `1.1.3` Part A flag can be cleared.' : 'No lesson-side remediation handoff is required for figure numbering.'}

## Exact Blocking Issue

${blockingFigure ? 'The live `1.1.3 Grafieken en tabellen – paragraaf.md` still mentions `Figuur 3` before `Figuur 2`.' : 'No blocking figure-numbering issue remains.'}

Current first-use sequence:

\`\`\`text
${data.checks.figure_sequence.first_seen_sequence.join(' -> ')}
\`\`\`

Expected first-use sequence:

\`\`\`text
${data.checks.figure_sequence.expected_sequence.join(' -> ')}
\`\`\`

## Required Route

If remediation is needed, it must happen through an authorized lesson-side remediation/regeneration workflow. Do not hand-patch generated lesson output or quality refs from the references repo.

## Acceptance Evidence Needed Back

- lesson commit SHA;
- list of changed/generated \`1.1.3\` files;
- validation commands and outputs;
- updated Part A review/quality evidence showing the figure-numbering flag is cleared or explicitly accepted;
- confirmation that CP-6 and Year 1 are not closed by the lesson-side correction.
`;
}

function main() {
  const cp6d = readJson(CP6D);
  const files = Object.fromEntries(
    Object.entries(FILES).map(([key, fileName]) => [key, readLessonFile(fileName)]),
  );
  const quality = qualityRefState(files.qualityRef.text);
  const review = reviewState(files.review.text);
  const figure = figureSequence(files.paragraaf.text);
  const opgavenImageRefs = imageRefs(files.opgaven.text);
  const checks = {
    required_files_present: Object.values(files).every((file) => file.exists),
    figure_sequence: figure,
    paragraaf_image_refs: imageRefs(files.paragraaf.text),
    opgaven_image_refs: opgavenImageRefs,
    repeated_worked_example: {
      present: /##\s+Uitgewerkt voorbeeld/i.test(files.opgaven.text),
      accepted_as_non_blocking: true,
      is_blocking: false,
      rationale:
        'The previous review already identified this as likely intentional standalone-exercise scaffolding; CP.6e does not treat it as the remaining hard blocker unless a later lesson-quality gate changes that policy.',
    },
  };
  const decision = decide(files, checks);
  const data = {
    schema_version: 1,
    sprint_id: 'CP.6e',
    generated_on: GENERATED_ON,
    generated_by: 'build-scripts/references/build-cp6e-113-part-a-rereview.js',
    status: 'focused_part_a_rereview_recorded_not_closing',
    authority_level: 'non_mutating_focused_part_a_rereview',
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
    focused_paragraph: {
      paragraph_id: '1.1.3',
      title: 'Grafieken en tabellen',
      lesson_path: projectPath(PARAGRAPH_DIR),
    },
    source_paths: {
      cp6d: CP6D,
      review: files.review.path,
      quality_ref: files.qualityRef.path,
      paragraaf: files.paragraaf.path,
      opgaven: files.opgaven.path,
      antwoorden: files.antwoorden.path,
    },
    repository_state: {
      platform_head_at_generation: git('git rev-parse HEAD'),
      platform_status_at_generation: git('git status --short --branch'),
      lesson_head_at_generation: git('git rev-parse HEAD', LESSON_REPO),
      lesson_status_at_generation: git('git status --short --branch', LESSON_REPO),
    },
    cp6d_context: {
      status: cp6d.status,
      cp6d_part_a_status:
        cp6d.records.find((record) => record.paragraph_id === '1.1.3')?.cp6d_evidence_status || null,
    },
    quality_ref: quality,
    review,
    checks,
    decision,
    next_action:
      decision.status === 'cleared'
        ? 'Route the remaining CP-6 blockers into a later closure proposal or explicit hold decision; do not close CP-6 from CP.6e alone.'
        : 'Route lesson-side remediation/regeneration for the remaining 1.1.3 Part A figure-numbering flag before any unconditioned CP-6 closure proposal.',
  };

  writeJson(OUTPUT_JSON, data);
  writeText(OUTPUT_MD, buildMarkdown(data));
  writeText(HANDOFF_MD, buildHandoff(data));
}

main();
