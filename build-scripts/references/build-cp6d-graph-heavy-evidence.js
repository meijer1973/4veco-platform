#!/usr/bin/env node
/**
 * Build CP.6d graph-heavy evidence artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this script read-only for lesson output and source references.
 * - Add later evidence in references/data/sprints or governed review artifacts;
 *   do not write back to lesson quality refs or protected references here.
 * - If the active-v5 Book 1 graph-heavy set changes, update this script and
 *   the CP.6d validator together after a recorded roadmap/gate decision.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_REPO = path.resolve(ROOT, '..', '4veco-lessen');
const LESSON_BOOK_ROOT = path.join(LESSON_REPO, 'Boek 1 - Grondslagen, vraag en aanbod');
const GENERATED_ON = '2026-05-20';

const TARGET_EXERCISES = 'references/authored/course-target-exercises.json';
const REF_CT2 = 'references/data/sprints/REF-CT2-precision-dual-coding-audit.json';
const CP6B = 'references/data/sprints/CP.6b-target-exercise-review.json';
const CP6C = 'references/data/sprints/CP.6c-mtu-backfill-classification.json';
const OUTPUT_JSON = 'references/data/sprints/CP.6d-graph-heavy-evidence.json';
const OUTPUT_MD = 'reports/reference-planning/CP.6d-graph-heavy-evidence.md';

const GRAPH_HEAVY_IDS = [
  '1.1.1',
  '1.1.2',
  '1.1.3',
  '1.2.1',
  '1.2.2',
  '1.2.3',
  '1.3.1',
  '1.3.2',
  '1.3.3',
];

const COMPANION_MARKERS = [
  'begeleide inoefening',
  'grafiekenspel',
  'instapquiz',
  'nieuws',
  'presentatie',
  'samenvatting',
  'stappenplan',
  'uitleg vaardigheden',
  'uitleg voorkennis',
  'wiskundevaardigheden',
];

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function readJson(relPath) {
  return JSON.parse(read(relPath));
}

function writeJson(relPath, data) {
  fs.writeFileSync(path.join(ROOT, relPath), `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(relPath, text) {
  fs.writeFileSync(path.join(ROOT, relPath), text);
}

function git(command, cwd = ROOT) {
  try {
    return execSync(command, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (_error) {
    return 'unavailable';
  }
}

function walk(dir, output = []) {
  if (!fs.existsSync(dir)) return output;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (fullPath.split(path.sep).includes('archive')) continue;
    if (entry.isDirectory()) {
      walk(fullPath, output);
    } else {
      output.push(fullPath);
    }
  }
  return output;
}

function toProjectPath(absPath) {
  if (!absPath) return null;
  const relToPlatform = path.relative(ROOT, absPath).replace(/\\/g, '/');
  return relToPlatform.startsWith('..') ? relToPlatform : relToPlatform;
}

function relToLessonBook(absPath) {
  return path.relative(LESSON_BOOK_ROOT, absPath).replace(/\\/g, '/');
}

function findExact(files, fileName) {
  return files.find((file) => path.basename(file) === fileName) || null;
}

function matchLineValue(text, key) {
  const pattern = new RegExp(`^\\s*${key}:\\s*"?([^"\\r\\n]+)"?`, 'mi');
  const match = text.match(pattern);
  return match ? match[1].trim() : null;
}

function matchAllLineValues(text, key) {
  const pattern = new RegExp(`^\\s*${key}:\\s*"?([^"\\r\\n]+)"?`, 'gmi');
  return Array.from(text.matchAll(pattern)).map((match) => match[1].trim());
}

function parseStructuralReviewVerdict(text) {
  const verdictSection = text.match(/##\s*(?:2\.\s*)?Verdict\s*\r?\n+([\s\S]{0,240})/i);
  if (verdictSection) {
    const verdict = verdictSection[1].match(/PASS WITH FLAGS|PASS|FAIL|FLAG|BLOCKED/i);
    if (verdict) return verdict[0].toUpperCase();
  }

  const inline = text.match(/^\s*(?:\*\*)?Verdict(?:\*\*)?:\s*(PASS WITH FLAGS|PASS|FAIL|FLAG|BLOCKED)\.?/im);
  return inline ? inline[1].toUpperCase() : null;
}

function countMatches(text, pattern) {
  return (text.match(pattern) || []).length;
}

function parseQualityRef(text) {
  const verdicts = matchAllLineValues(text, 'verdict');
  const reviewVerdicts = matchAllLineValues(text, 'review_verdict');
  const schemaVersion = matchLineValue(text, 'schema_version');
  return {
    schema_version: schemaVersion,
    shape: schemaVersion === '2' ? 'schema_version_2' : 'legacy_or_pre_schema',
    has_part_a_block: /^partA:/m.test(text),
    has_companion_block: /^companion:/m.test(text),
    title: matchLineValue(text, 'title'),
    chapter: matchLineValue(text, 'chapter'),
    target_exercise_status: matchLineValue(text, 'target_exercise_status'),
    cp6_quality_ready: matchLineValue(text, 'cp6_quality_ready'),
    verdicts,
    review_verdicts: reviewVerdicts,
    first_verdict: verdicts[0] || reviewVerdicts[0] || null,
    flags_count: countMatches(text, /\bFLAG\b|\bflags:/gi),
  };
}

function fileCounts(files) {
  const counts = {
    markdown: 0,
    html: 0,
    pdf: 0,
    svg: 0,
    png: 0,
    docx: 0,
    pptx: 0,
  };
  for (const file of files) {
    const ext = path.extname(file).slice(1).toLowerCase();
    if (Object.prototype.hasOwnProperty.call(counts, ext)) counts[ext] += 1;
  }
  return counts;
}

function companionEvidence(files) {
  const companionFiles = files.filter((file) => {
    const name = path.basename(file).toLowerCase();
    return COMPANION_MARKERS.some((marker) => name.includes(marker));
  });
  return {
    companion_material_exists: companionFiles.length > 0,
    companion_material_file_count: companionFiles.length,
    sample_files: companionFiles.slice(0, 8).map(toProjectPath),
  };
}

function reviewEvidence(reviewPath, qualityRef) {
  if (!reviewPath || !fs.existsSync(reviewPath)) {
    return {
      present: false,
      path: null,
      structural_verdict: null,
      quality_ref_verdict: qualityRef.first_verdict,
      evidence_verdict: qualityRef.first_verdict,
      verdict_source: qualityRef.first_verdict ? 'quality_ref' : 'none',
      flag_mentions: 0,
      fail_mentions: 0,
      legacy_unstructured: false,
    };
  }

  const text = fs.readFileSync(reviewPath, 'utf8');
  const structuralVerdict = parseStructuralReviewVerdict(text);
  const flagMentions = countMatches(text, /\bFLAG\b/gi);
  const failMentions = countMatches(text, /\bFAIL\b/gi);
  let evidenceVerdict = qualityRef.first_verdict || structuralVerdict;
  let verdictSource = qualityRef.first_verdict ? 'quality_ref' : 'review_file_structural';
  let legacyUnstructured = false;

  if (!evidenceVerdict) {
    legacyUnstructured = true;
    verdictSource = 'legacy_review_text';
    if (failMentions > 0) {
      evidenceVerdict = 'LEGACY REVIEW TEXT WITH FAIL MENTIONS';
    } else if (flagMentions > 0) {
      evidenceVerdict = 'LEGACY REVIEW TEXT WITH FLAG MENTIONS';
    } else {
      evidenceVerdict = 'LEGACY REVIEW TEXT WITHOUT STRUCTURAL VERDICT';
    }
  }

  return {
    present: true,
    path: toProjectPath(reviewPath),
    structural_verdict: structuralVerdict,
    quality_ref_verdict: qualityRef.first_verdict,
    evidence_verdict: evidenceVerdict,
    verdict_source: verdictSource,
    flag_mentions: flagMentions,
    fail_mentions: failMentions,
    legacy_unstructured: legacyUnstructured,
  };
}

function companionReviewEvidence(companionReviewPath, companion) {
  if (!companionReviewPath || !fs.existsSync(companionReviewPath)) {
    return {
      present: false,
      path: null,
      structural_verdict: null,
      required_now: companion.companion_material_exists,
      status: companion.companion_material_exists
        ? 'blocked_missing_companion_visual_review'
        : 'not_required_no_companion_material_detected',
    };
  }

  const text = fs.readFileSync(companionReviewPath, 'utf8');
  return {
    present: true,
    path: toProjectPath(companionReviewPath),
    structural_verdict: parseStructuralReviewVerdict(text),
    required_now: companion.companion_material_exists,
    status: 'current_companion_visual_review_present',
  };
}

function sourceLessonStatus(id, paragraphDir) {
  const relDir = relToLessonBook(paragraphDir);
  if (id === '1.3.2' && relDir.includes('Kostenstructuren')) return 'stale_invalid_costs_path';
  if (id === '1.3.3' && relDir.includes('Opbrengsten')) return 'stale_invalid_revenue_path';
  if ((id === '1.3.2' || id === '1.3.3') && relDir.includes('1.3 Hoofdstuk Aanbod en marktevenwicht')) {
    return 'aligned_after_l_cp6a_with_carried_conditions';
  }
  return 'aligned_or_not_chapter13_mismatch_scope';
}

function recordStatus(record) {
  if (!record.part_a_review.present) return 'blocked_missing_current_part_a_review';
  if (record.part_a_review.fail_mentions > 0) return 'blocked_part_a_fail_mentions';
  if (record.paragraph_id === '1.1.3' && String(record.quality_ref.first_verdict).toUpperCase() === 'FLAG') {
    return 'blocked_cp6e_part_a_flag_open';
  }
  if (record.companion_review.required_now && !record.companion_review.present) {
    return 'blocked_missing_current_part_b_review';
  }
  if (record.quality_ref.shape !== 'schema_version_2') {
    return 'current_part_a_present_quality_ref_upgrade_needed';
  }
  if (record.target_exercise_status !== 'reviewed_final') {
    return 'current_graph_evidence_present_target_exercise_not_final';
  }
  return 'current_graph_evidence_present_not_closure_ready';
}

function blockersFor(record) {
  const blockers = [];
  if (!record.part_a_review.present) blockers.push('Missing current exact Part A review file.');
  if (record.part_a_review.fail_mentions > 0) blockers.push('Part A review text contains FAIL mentions.');
  if (record.paragraph_id === '1.1.3' && String(record.quality_ref.first_verdict).toUpperCase() === 'FLAG') {
    blockers.push('1.1.3 Part A quality-ref verdict remains FLAG; CP.6e is required.');
  }
  if (record.companion_review.required_now && !record.companion_review.present) {
    blockers.push('Companion material exists but no current companion visual review file was found.');
  }
  if (record.quality_ref.shape !== 'schema_version_2') {
    blockers.push('Quality-ref is legacy/pre-schema rather than schema_version 2.');
  }
  if (record.part_a_review.legacy_unstructured) {
    blockers.push('Part A review file lacks a structural top-level verdict.');
  }
  if (record.target_exercise_status !== 'reviewed_final') {
    blockers.push(`Target-exercise status is ${record.target_exercise_status}, not reviewed_final.`);
  }
  if (record.source_lesson_alignment_status.startsWith('stale_invalid')) {
    blockers.push('Lesson path is stale for active v5.');
  }
  blockers.push('CP-6 closure also remains blocked by CP.6e and the non-final target-exercise lane.');
  return blockers;
}

function summary(records) {
  const count = (predicate) => records.filter(predicate).length;
  const byStatus = {};
  for (const record of records) {
    byStatus[record.cp6d_evidence_status] = (byStatus[record.cp6d_evidence_status] || 0) + 1;
  }
  return {
    graph_heavy_record_count: records.length,
    current_part_a_review_present_count: count((record) => record.part_a_review.present),
    current_companion_review_present_count: count((record) => record.companion_review.present),
    companion_review_required_now_count: count((record) => record.companion_review.required_now),
    companion_review_required_and_present_count: count(
      (record) => record.companion_review.required_now && record.companion_review.present,
    ),
    quality_ref_schema2_count: count((record) => record.quality_ref.shape === 'schema_version_2'),
    legacy_quality_ref_count: count((record) => record.quality_ref.shape !== 'schema_version_2'),
    structural_part_a_verdict_present_count: count((record) => Boolean(record.part_a_review.structural_verdict)),
    part_a_legacy_unstructured_count: count((record) => record.part_a_review.legacy_unstructured),
    part_a_flag_open_count: count((record) => record.cp6d_evidence_status === 'blocked_cp6e_part_a_flag_open'),
    source_lesson_mismatch_count: count((record) => record.source_lesson_alignment_status.startsWith('stale_invalid')),
    cp6_closure_ready_count: count((record) => record.may_count_as_cp6_closure_evidence_now),
    records_by_status: byStatus,
  };
}

function markdownTable(records) {
  const header = '| Paragraph | Live lesson path | Part A evidence | Part B evidence | Quality ref | CP.6d status |\n|---|---|---|---|---|---|';
  const rows = records.map((record) => {
    const partA = record.part_a_review.present
      ? `${record.part_a_review.evidence_verdict} (${record.part_a_review.verdict_source})`
      : 'missing';
    const partB = record.companion_review.required_now
      ? record.companion_review.status
      : 'not required now';
    return [
      `\`${record.paragraph_id}\` ${record.paragraph_title}`,
      `\`${record.lesson_path}\``,
      partA,
      partB,
      record.quality_ref.shape,
      record.cp6d_evidence_status,
    ].join(' | ');
  });
  return [header, ...rows.map((row) => `| ${row} |`)].join('\n');
}

function buildMarkdown(data) {
  const s = data.summary;
  return `# CP.6d Book 1 Graph-Heavy Evidence Upgrade

Generated: ${data.generated_on}

Status: ${data.status}

CP-6 closed: ${data.cp6_closed}

Year 1 closed: ${data.year1_closed}

## Decision

CP.6d upgrades the internal CP-6 graph-heavy evidence status ledger against the actual current lesson repository. It does not close CP-6 or Year 1 and does not mutate protected references or lesson output.

The live lesson repository no longer matches the stale REF-CT2 Chapter 1.3 assumption: active \`1.3.2\` is \`Marktevenwicht\`, active \`1.3.3\` is \`Verschuivingen en nieuw evenwicht\`, and both sit under \`1.3 Hoofdstuk Aanbod en marktevenwicht\`.

## Summary

- Graph-heavy active-v5 records checked: ${s.graph_heavy_record_count}
- Current exact Part A review files present: ${s.current_part_a_review_present_count}
- Companion reviews required now: ${s.companion_review_required_now_count}
- Companion reviews required and present: ${s.companion_review_required_and_present_count}
- Quality refs with \`schema_version: 2\`: ${s.quality_ref_schema2_count}
- Legacy/pre-schema quality refs: ${s.legacy_quality_ref_count}
- Part A records with legacy/unstructured verdict format: ${s.part_a_legacy_unstructured_count}
- Open \`1.1.3\` Part A FLAG records: ${s.part_a_flag_open_count}
- Current source/lesson mismatch count for active v5 Chapter 1.3: ${s.source_lesson_mismatch_count}
- Records allowed as CP-6 closure evidence now: ${s.cp6_closure_ready_count}

## Evidence Table

${markdownTable(data.records)}

## Record Notes

${data.records
  .map(
    (record) => `### ${record.paragraph_id} ${record.paragraph_title}

- Live path: \`${record.lesson_path}\`
- Source/lesson state: ${record.source_lesson_alignment_status}
- Part A review: ${record.part_a_review.present ? `present at \`${record.part_a_review.path}\`; evidence verdict ${record.part_a_review.evidence_verdict}` : 'missing'}
- Companion review: ${record.companion_review.present ? `present at \`${record.companion_review.path}\`` : record.companion_review.status}
- Quality-ref: ${record.quality_ref.shape}; path \`${record.quality_ref.path}\`
- Target-exercise status: ${record.target_exercise_status}
- Closure evidence now: ${record.may_count_as_cp6_closure_evidence_now}
- Remaining blockers:
${record.blockers.map((blocker) => `  - ${blocker}`).join('\n')}
`,
  )
  .join('\n')}
## Non-Authorizations

This sprint authorizes no protected reference mutation, no lesson-output mutation, no lesson-quality-ref hand patching, no companion review fabrication, no target-exercise promotion, no placeholder finalization, no unit minting, no CP-6 closure, no Year-1 closure, no student diagnostics, no adaptive routing, no mastery decisions, no automatic sequencing, no student-facing AI, no summative use, no PV projection, no PV machine promotion, and no student-facing output.

## Next Action

Run CP.6e focused \`1.1.3\` Part A re-review next. A later quality-workflow sprint should upgrade legacy/pre-schema graph-heavy quality refs where needed before any CP-6 closure proposal.
`;
}

function main() {
  const targetExercises = readJson(TARGET_EXERCISES);
  const refCt2 = readJson(REF_CT2);
  const cp6b = readJson(CP6B);
  const cp6c = readJson(CP6C);
  const targetById = new Map(targetExercises.exercises.map((exercise) => [exercise.id, exercise]));
  const allLessonFiles = walk(LESSON_BOOK_ROOT);

  const records = GRAPH_HEAVY_IDS.map((id) => {
    const target = targetById.get(id);
    const qualityRefPath = findExact(allLessonFiles, `${id}-quality-ref.yaml`);
    const paragraphDir = qualityRefPath ? path.dirname(qualityRefPath) : null;
    const paragraphFiles = paragraphDir ? walk(paragraphDir) : [];
    const qualityText = qualityRefPath ? fs.readFileSync(qualityRefPath, 'utf8') : '';
    const qualityRef = {
      present: Boolean(qualityRefPath),
      path: toProjectPath(qualityRefPath),
      ...parseQualityRef(qualityText),
    };
    const reviewPath = findExact(paragraphFiles, `${id}-review.md`);
    const companionReviewPath = findExact(paragraphFiles, `${id}-companion-visual-review.md`);
    const companion = companionEvidence(paragraphFiles);
    const record = {
      paragraph_id: id,
      paragraph_title: target ? target.paragraph_title : qualityRef.title || 'unknown',
      graph_heavy: true,
      lesson_path: paragraphDir ? relToLessonBook(paragraphDir) : null,
      source_lesson_alignment_status: paragraphDir
        ? sourceLessonStatus(id, paragraphDir)
        : 'missing_lesson_path',
      target_exercise_status: target ? target.record_status : qualityRef.target_exercise_status || 'unknown',
      target_exercise_review_outcome:
        cp6b.migrated_records.find((item) => item.paragraph_id === id)?.review_outcome || 'not_in_cp6b_migrated_records',
      file_counts: fileCounts(paragraphFiles),
      companion_material: companion,
      quality_ref: qualityRef,
      part_a_review: reviewEvidence(reviewPath, qualityRef),
      companion_review: companionReviewEvidence(companionReviewPath, companion),
      may_count_as_cp6_closure_evidence_now: false,
      protected_reference_mutation_authorized_now: false,
      lesson_output_mutation_authorized_now: false,
      target_exercise_promotion_authorized_now: false,
      placeholder_finalization_authorized_now: false,
      unit_minting_authorized_now: false,
    };
    record.cp6d_evidence_status = recordStatus(record);
    record.blockers = blockersFor(record);
    return record;
  });

  const data = {
    schema_version: 1,
    sprint_id: 'CP.6d',
    generated_on: GENERATED_ON,
    generated_by: 'build-scripts/references/build-cp6d-graph-heavy-evidence.js',
    status: 'graph_heavy_evidence_ledger_upgraded_not_closing',
    authority_level: 'non_mutating_graph_heavy_evidence_upgrade',
    cp6_closed: false,
    year1_closed: false,
    protected_reference_data_changed: false,
    lesson_output_changed: false,
    lesson_quality_ref_hand_patch: false,
    companion_review_fabrication: false,
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
    no_companion_review_fabrication_authorized: true,
    no_target_exercise_promotion_authorized: true,
    no_placeholder_finalization_authorized: true,
    no_unit_minting_authorized: true,
    no_cp6_closure_authorized: true,
    no_year1_closure_authorized: true,
    source_paths: {
      target_exercises: TARGET_EXERCISES,
      ref_ct2: REF_CT2,
      cp6b: CP6B,
      cp6c: CP6C,
      lesson_book_root: toProjectPath(LESSON_BOOK_ROOT),
      l_cp6a_handoff: '../4veco-lessen/archive/sprints/L-CP6A/L-CP6A-handoff-to-references.md',
      l_cp6a_closure_log: '../4veco-lessen/archive/sprints/L-CP6A/L-CP6A-closure-log.md',
    },
    repository_state: {
      platform_head_at_generation: git('git rev-parse HEAD'),
      platform_status_at_generation: git('git status --short --branch'),
      lesson_head_at_generation: git('git rev-parse HEAD', LESSON_REPO),
      lesson_status_at_generation: git('git status --short --branch', LESSON_REPO),
    },
    ref_ct2_diagnostic_context: {
      generated_on: refCt2.generated_on,
      stale_for_chapter13_after_l_cp6a: true,
      previous_source_lesson_mismatch_count: refCt2.summary.source_lesson_mismatch_count,
      previous_legacy_quality_ref_count: refCt2.summary.legacy_quality_ref_count,
    },
    cp6c_context: {
      mtu_backfill_classification_status: cp6c.status,
      later_cli_mutation_candidate_count: cp6c.summary.later_cli_mutation_candidate_count,
    },
    graph_heavy_paragraph_ids: GRAPH_HEAVY_IDS,
    records,
  };

  data.summary = summary(records);
  data.decision = {
    status: 'evidence_status_upgraded_not_closure_ready',
    final_year1_coverage_allowed_now: false,
    cp6_closure_allowed_now: false,
    registry_mutation_allowed_now: false,
    lesson_mutation_allowed_now: false,
    note:
      'Current live lesson evidence is now recorded for graph-heavy Book 1 records. CP-6 closure remains blocked by CP.6e, non-final target exercises, and remaining quality-ref/review workflow gaps.',
  };

  writeJson(OUTPUT_JSON, data);
  writeText(OUTPUT_MD, buildMarkdown(data));
}

main();
