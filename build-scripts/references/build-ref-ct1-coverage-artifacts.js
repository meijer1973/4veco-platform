#!/usr/bin/env node
/**
 * Build REF-CT1 Year-1 coverage artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this script read-only with respect to reference sources. It may write
 *   only sprint/report artifacts listed in reports/sprints/REF-CT1-plan.md.
 * - For a later sprint, change SPRINT_ID, output paths, and the expected book
 *   filter. Do not broaden it into a generic mutation tool.
 * - Preserve the explicit "No CLI mutation authorized" language unless the
 *   later sprint plan allows mutation and names the CLI path.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'REF-CT1';
const GENERATED_ON = '2026-05-19';

const SOURCES = {
  targetExercises: 'references/authored/course-target-exercises.json',
  blueprint: 'references/owned/course-blueprint-v5.md',
  blueprintMeta: 'references/owned/course-blueprint-v5.meta.json',
  ct0Classification: 'references/data/sprints/REF-CT0-mtu-classification.json',
  lessonRoot: '../4veco-lessen',
};

const OUTPUTS = {
  coverageJson: 'references/data/sprints/REF-CT1-year1-coverage.json',
  coverageReport: 'reports/reference-planning/REF-CT1-year1-coverage.md',
  gapReport: 'reports/reference-planning/REF-CT1-mtu-gap-classification.md',
  reviewPacket: 'reports/reference-planning/REF-CT1-cp6-review-packet.md',
};

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}

function writeFile(relPath, content) {
  const file = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function md(value) {
  if (value === undefined || value === null || value === '') return '-';
  if (Array.isArray(value)) return value.length ? value.map(md).join('<br>') : '-';
  return String(value)
    .replace(/\r?\n/g, '<br>')
    .replace(/\|/g, '\\|');
}

function normalizeStatus(value) {
  return String(value || '').replace(/^"|"$/g, '').trim();
}

function sortParagraphs(a, b) {
  const pa = String(a.id || a.paragraph_id).split('.').map(Number);
  const pb = String(b.id || b.paragraph_id).split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff) return diff;
  }
  return 0;
}

function runGit(cwd, args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) return null;
  return result.stdout.trim();
}

function findChildStartingWith(base, prefix) {
  if (!fs.existsSync(base)) return null;
  const names = fs.readdirSync(base);
  const match = names.find((name) => name.startsWith(prefix));
  return match ? path.join(base, match) : null;
}

function findLessonParagraphDir(lessonRoot, paragraphId) {
  const bookDir = findChildStartingWith(lessonRoot, 'Boek 1 - ');
  if (!bookDir) return null;
  const chapterPrefix = paragraphId.split('.').slice(0, 2).join('.') + ' ';
  const chapterDir = findChildStartingWith(bookDir, chapterPrefix);
  if (!chapterDir) return null;
  return findChildStartingWith(chapterDir, `${paragraphId} `);
}

function extractQuotedScalar(text, pattern) {
  const match = text.match(pattern);
  return match ? normalizeStatus(match[1]) : null;
}

function readLessonEvidence(lessonRoot, paragraphId) {
  const paragraphDir = findLessonParagraphDir(lessonRoot, paragraphId);
  if (!paragraphDir) {
    return {
      paragraph_id: paragraphId,
      present: false,
      quality_ref_path: null,
      status_note: 'lesson paragraph directory not found',
    };
  }

  const qualityRef = path.join(paragraphDir, `${paragraphId}-quality-ref.yaml`);
  if (!fs.existsSync(qualityRef)) {
    return {
      paragraph_id: paragraphId,
      present: false,
      quality_ref_path: path.relative(ROOT, qualityRef).replace(/\\/g, '/'),
      status_note: 'quality reference not found',
    };
  }

  const yaml = fs.readFileSync(qualityRef, 'utf8');
  const relQualityRef = path.relative(ROOT, qualityRef).replace(/\\/g, '/');
  const requiredObjects = {};
  for (const key of ['ice_table', 'pq_graph', 'interpolation_graph', 'misleading_axis_comparison']) {
    if (new RegExp(`\\b${key}:\\s*true\\b`).test(yaml)) requiredObjects[key] = true;
  }

  return {
    paragraph_id: paragraphId,
    present: true,
    quality_ref_path: relQualityRef,
    partA_verdict: extractQuotedScalar(yaml, /partA:[\s\S]*?\n  review:[\s\S]*?\n    verdict:\s*"?([^"\n#]+)"?/),
    partA_last_reviewed: extractQuotedScalar(yaml, /partA:[\s\S]*?\n  review:[\s\S]*?\n    last_reviewed:\s*"?([^"\n#]+)"?/),
    companion_verdict: extractQuotedScalar(yaml, /companion:[\s\S]*?\n  review_verdict:\s*"?([^"\n#]+)"?/),
    companion_last_reviewed: extractQuotedScalar(yaml, /companion:[\s\S]*?\n  last_reviewed:\s*"?([^"\n#]+)"?/),
    companion_human_review_status: extractQuotedScalar(yaml, /companion:[\s\S]*?\n  human_review_status:\s*"?([^"\n#]+)"?/),
    l16r_dual_coding_status: extractQuotedScalar(yaml, /l16r_dual_coding:[\s\S]*?\n    status:\s*"?([^"\n#]+)"?/),
    l16r_required_objects_present: requiredObjects,
    status_note: 'read-only lesson evidence',
  };
}

function targetExerciseRows(source) {
  if (!source || !Array.isArray(source.exercises)) {
    throw new Error(`${SOURCES.targetExercises} must contain an exercises array`);
  }
  return source.exercises;
}

function unitRoles(record, unitId) {
  const roles = [];
  if ((record.required_skills || []).includes(unitId)) roles.push('required');
  if ((record.new_skills_introduced || []).includes(unitId)) roles.push('introduced');
  if ((record.prior_knowledge_assumed || []).includes(unitId)) roles.push('assumed');
  return roles;
}

function main() {
  const targetSource = readJson(SOURCES.targetExercises);
  const blueprintMeta = readJson(SOURCES.blueprintMeta);
  const ct0 = readJson(SOURCES.ct0Classification);

  const rows = targetExerciseRows(targetSource);
  const book1 = rows
    .filter((record) => record.module === 1)
    .sort(sortParagraphs);
  const book1Ids = new Set(book1.map((record) => record.id));

  const lessonRoot = path.resolve(ROOT, SOURCES.lessonRoot);
  const lessonGitCommit = runGit(lessonRoot, ['rev-parse', 'HEAD']);
  const lessonGitStatus = runGit(lessonRoot, ['status', '--short', '--branch']);
  const repoGitCommit = runGit(ROOT, ['rev-parse', 'HEAD']);

  const ct0Records = ct0.records || [];
  const confirmedUnits = ct0Records
    .filter((record) => record.candidate_type === 'machine_unit')
    .filter((record) => record.classification === 'year_1_confirmed')
    .filter((record) => (record.evidence?.active_v5_paragraphs || []).some((id) => book1Ids.has(id)))
    .sort((a, b) => String(a.unit_id).localeCompare(String(b.unit_id), 'en', { numeric: true }));
  const confirmedByUnit = new Map(confirmedUnits.map((record) => [record.unit_id, record]));

  const missingFlags = ct0Records
    .filter((record) => record.candidate_type === 'target_exercise_missing_flag')
    .filter((record) => book1Ids.has(record.paragraph_id))
    .sort((a, b) => sortParagraphs({ id: a.paragraph_id }, { id: b.paragraph_id }) || String(a.record_id).localeCompare(String(b.record_id)));
  const placeholders = ct0Records
    .filter((record) => record.candidate_type === 'placeholder_target_exercise')
    .filter((record) => book1Ids.has(record.paragraph_id))
    .sort((a, b) => sortParagraphs({ id: a.paragraph_id }, { id: b.paragraph_id }));

  const missingByParagraph = new Map();
  for (const flag of missingFlags) {
    if (!missingByParagraph.has(flag.paragraph_id)) missingByParagraph.set(flag.paragraph_id, []);
    missingByParagraph.get(flag.paragraph_id).push(flag);
  }
  const placeholderByParagraph = new Map(placeholders.map((record) => [record.paragraph_id, record]));

  const lessonEvidenceByParagraph = new Map(
    ['1.1.1', '1.1.2', '1.1.3'].map((id) => [id, readLessonEvidence(lessonRoot, id)])
  );

  const paragraphs = book1.map((record) => {
    const skillIds = uniq([
      ...(record.required_skills || []),
      ...(record.new_skills_introduced || []),
      ...(record.prior_knowledge_assumed || []),
    ]);
    const isPlaceholder =
      record.record_status === 'placeholder_needs_review' ||
      record.target_exercise?.placeholder === true ||
      (record.missing_units_flagged || []).includes('v5_placeholder_needs_review');
    const recordMissingFlags = missingByParagraph.get(record.id) || [];
    const placeholderRecord = placeholderByParagraph.get(record.id) || null;
    const lessonEvidence = lessonEvidenceByParagraph.get(record.id) || null;
    const canCountAsFinalCoverage =
      record.record_status === 'reviewed_final' &&
      !isPlaceholder &&
      !(lessonEvidence?.companion_human_review_status || '').includes('pending') &&
      lessonEvidence?.partA_verdict !== 'FLAG';

    return {
      paragraph_id: record.id,
      module: record.module,
      chapter: record.chapter,
      paragraph: record.paragraph,
      title: record.paragraph_title,
      paragraph_kind: record.paragraph_kind,
      introduces_new_theory: Boolean(record.introduces_new_theory),
      source_ref: record.source_ref,
      record_status: record.record_status,
      target_exercise_present: Boolean(record.target_exercise),
      target_exercise_placeholder: isPlaceholder,
      may_count_as_final_coverage_claim: canCountAsFinalCoverage,
      coverage_status: isPlaceholder
        ? 'placeholder_needs_evidence'
        : canCountAsFinalCoverage
          ? 'final_reviewed'
          : 'migrated_needs_v5_review',
      lesson_goals: record.lesson_goals || [],
      units: skillIds.map((unitId) => {
        const ct0Unit = confirmedByUnit.get(unitId);
        return {
          unit_id: unitId,
          label: ct0Unit?.label || null,
          classification: ct0Unit?.classification || 'not_classified_in_ref_ct0_book1_confirmed_set',
          roles: unitRoles(record, unitId),
          evidence_strength: ct0Unit?.evidence_strength || null,
        };
      }),
      missing_flags: recordMissingFlags.map((flag) => ({
        record_id: flag.record_id,
        classification: flag.classification,
        flag: flag.evidence?.flag || flag.label,
        evidence_strength: flag.evidence_strength,
        next_review_action: flag.next_review_action,
      })),
      placeholder_record: placeholderRecord
        ? {
            record_id: placeholderRecord.record_id,
            classification: placeholderRecord.classification,
            flag: placeholderRecord.evidence?.flag || 'v5_placeholder_needs_review',
            next_review_action: placeholderRecord.next_review_action,
          }
        : null,
      lesson_evidence: lessonEvidence,
    };
  });

  const statusCounts = paragraphs.reduce((acc, record) => {
    acc[record.record_status] = (acc[record.record_status] || 0) + 1;
    return acc;
  }, {});

  const l16rEvidence = lessonEvidenceByParagraph.get('1.1.3');
  const summary = {
    book: 1,
    expected_count_bearing_paragraphs: blueprintMeta.books?.find((book) => book.book === 1)?.count_bearing_paragraphs || 12,
    book1_count_bearing_paragraphs: paragraphs.length,
    migrated_needs_review_count: statusCounts.migrated_from_v4_needs_v5_review || 0,
    placeholder_needs_review_count: statusCounts.placeholder_needs_review || 0,
    reviewed_final_count: statusCounts.reviewed_final || 0,
    year1_confirmed_unit_count: confirmedUnits.length,
    book1_missing_flag_count: missingFlags.length,
    placeholder_needs_evidence_count: placeholders.length,
    required_built_evidence_paragraphs: ['1.1.1', '1.1.2', '1.1.3'],
    built_evidence_present_count: [...lessonEvidenceByParagraph.values()].filter((record) => record.present).length,
    final_coverage_claim_count: paragraphs.filter((record) => record.may_count_as_final_coverage_claim).length,
  };

  const coverage = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated_on: GENERATED_ON,
    generated_by: 'build-scripts/references/build-ref-ct1-coverage-artifacts.js',
    authority_level: 'non_mutating_year1_coverage_baseline',
    protected_reference_data_changed: false,
    no_cli_mutation_authorized: true,
    allowed_use: [
      'CP-6 review preparation',
      'Year-1 coverage baseline reporting',
      'backfill candidate triage before protected reference mutation',
    ],
    not_allowed_use: [
      'Year-1 final closure',
      'CP-6 closure',
      'target-exercise promotion',
      'placeholder finalization',
      'unit minting',
      'student diagnostics',
      'adaptive routing',
      'mastery decisions',
      'student-facing AI',
      'summative use',
      'PV projection',
    ],
    source_paths: SOURCES,
    repository_state: {
      platform_commit: repoGitCommit,
      lesson_commit: lessonGitCommit,
      lesson_status: lessonGitStatus,
      active_roadmap_version: 'v2.48-l16r-dual-coding-incident',
    },
    summary,
    coverage_decision: {
      cp6_status: 'review_packet_ready_not_closed',
      final_year1_closure_status: 'blocked_pending_cp6_human_review',
      may_mutate_protected_references: false,
      blockers: [
        '3 Book 1 placeholder target-exercise records still need reviewed integration target exercises.',
        '9 migrated Book 1 target-exercise records still need v5 final review before reviewed_final claims.',
        '9 Book 1 missing-flag records remain Year-1 backfill candidates, not mutation authority.',
        '1.1.3 remains pending L1.6R human review and has Part A FLAG status.',
      ],
      next_operational_action: 'Run the next precision/coverage audit and CP-6 human-review path before any Year-1 closure or CLI mutation.',
    },
    lesson_evidence: [...lessonEvidenceByParagraph.values()],
    confirmed_units: confirmedUnits.map((record) => ({
      unit_id: record.unit_id,
      label: record.label,
      domain: record.domain,
      classification: record.classification,
      evidence_strength: record.evidence_strength,
      active_v5_paragraphs: (record.evidence?.active_v5_paragraphs || []).filter((id) => book1Ids.has(id)),
      active_v5_roles: record.evidence?.active_v5_roles || [],
      target_record_statuses: record.evidence?.target_record_statuses || [],
    })),
    missing_flags: missingFlags.map((record) => ({
      record_id: record.record_id,
      paragraph_id: record.paragraph_id,
      label: record.label,
      classification: record.classification,
      current_status: record.current_status,
      evidence_strength: record.evidence_strength,
      flag: record.evidence?.flag || record.label,
      required_skills: record.evidence?.required_skills || [],
      next_review_action: record.next_review_action,
    })),
    placeholders: placeholders.map((record) => ({
      record_id: record.record_id,
      paragraph_id: record.paragraph_id,
      label: record.label,
      classification: record.classification,
      current_status: record.current_status,
      evidence_strength: record.evidence_strength,
      flag: record.evidence?.flag || 'v5_placeholder_needs_review',
      next_review_action: record.next_review_action,
      may_count_as_final_coverage_claim: false,
    })),
    paragraphs,
  };

  writeFile(OUTPUTS.coverageJson, `${JSON.stringify(coverage, null, 2)}\n`);
  writeFile(OUTPUTS.coverageReport, renderCoverageReport(coverage));
  writeFile(OUTPUTS.gapReport, renderGapReport(coverage));
  writeFile(OUTPUTS.reviewPacket, renderReviewPacket(coverage));

  console.log(`Wrote ${OUTPUTS.coverageJson}`);
  console.log(`Wrote ${OUTPUTS.coverageReport}`);
  console.log(`Wrote ${OUTPUTS.gapReport}`);
  console.log(`Wrote ${OUTPUTS.reviewPacket}`);
}

function renderCoverageReport(coverage) {
  const rows = coverage.paragraphs.map((record) => {
    const built = record.lesson_evidence
      ? [
          `Part A: ${record.lesson_evidence.partA_verdict || 'unknown'}`,
          `Companion: ${record.lesson_evidence.companion_verdict || 'unknown'}`,
          record.lesson_evidence.companion_human_review_status
            ? `Human: ${record.lesson_evidence.companion_human_review_status}`
            : null,
        ].filter(Boolean)
      : ['not required/read in REF-CT1'];
    return `| ${record.paragraph_id} | ${md(record.title)} | ${record.record_status} | ${record.target_exercise_placeholder ? 'yes' : 'no'} | ${record.units.map((unit) => `${unit.unit_id} (${unit.roles.join('+')})`).join('<br>') || '-'} | ${record.missing_flags.length} | ${record.may_count_as_final_coverage_claim ? 'yes' : 'no'} | ${md(built)} |`;
  });

  const evidenceRows = coverage.lesson_evidence.map((record) => {
    return `| ${record.paragraph_id} | ${record.present ? 'yes' : 'no'} | ${record.partA_verdict || '-'} | ${record.companion_verdict || '-'} | ${record.companion_human_review_status || '-'} | ${record.l16r_dual_coding_status || '-'} | ${md(record.quality_ref_path)} |`;
  });

  return `# REF-CT1 Year-1 Coverage Baseline

Generated: ${coverage.generated_on}

Authority: ${coverage.authority_level}. No CLI mutation authorized.

## Summary

- Book 1 count-bearing paragraphs: ${coverage.summary.book1_count_bearing_paragraphs}
- Migrated records needing v5 review: ${coverage.summary.migrated_needs_review_count}
- Placeholder records needing reviewed target exercises: ${coverage.summary.placeholder_needs_review_count}
- Reviewed-final target-exercise records: ${coverage.summary.reviewed_final_count}
- Confirmed target-exercise-backed MTUs: ${coverage.summary.year1_confirmed_unit_count}
- Year-1 missing-flag backfill candidates: ${coverage.summary.book1_missing_flag_count}
- Placeholder needs-evidence records: ${coverage.summary.placeholder_needs_evidence_count}

## Coverage Decision

CP-6 status: \`${coverage.coverage_decision.cp6_status}\`

Final Year-1 closure status: \`${coverage.coverage_decision.final_year1_closure_status}\`

Protected reference mutation allowed: \`${coverage.coverage_decision.may_mutate_protected_references}\`

Blockers:

${coverage.coverage_decision.blockers.map((blocker) => `- ${blocker}`).join('\n')}

## Paragraph Coverage

| Paragraph | Title | Record status | Placeholder | Units | Missing flags | Final coverage claim | Built evidence |
|---|---|---:|---:|---|---:|---:|---|
${rows.join('\n')}

## Built Evidence Read From Lesson Repository

Lesson repository commit: \`${coverage.repository_state.lesson_commit || 'unknown'}\`

| Paragraph | Quality ref present | Part A verdict | Companion verdict | Human review status | L1.6R status | Quality ref |
|---|---:|---|---|---|---|---|
${evidenceRows.join('\n')}

## Source Boundary

This report reads active v5, REF-CT0 classification data, and read-only lesson evidence. It does not edit \`references/machine/\`, \`references/external/\`, \`references/authored/course-target-exercises.json\`, \`references/owned/course-blueprint-v5.md\`, or \`../4veco-lessen\`.

No placeholder record may count as final Year-1 coverage. No migrated record may count as reviewed final until a later review/mutation path explicitly promotes it.
`;
}

function renderGapReport(coverage) {
  const confirmedRows = coverage.confirmed_units.map((record) => {
    return `| ${record.unit_id} | ${md(record.label)} | ${record.domain || '-'} | ${md(record.active_v5_paragraphs)} | ${md(record.active_v5_roles)} | ${md(record.target_record_statuses)} |`;
  });
  const missingRows = coverage.missing_flags.map((record) => {
    return `| ${record.paragraph_id} | ${record.record_id} | ${record.classification} | ${md(record.flag)} | ${md(record.required_skills)} | ${md(record.next_review_action)} |`;
  });
  const placeholderRows = coverage.placeholders.map((record) => {
    return `| ${record.paragraph_id} | ${record.record_id} | ${record.classification} | ${record.current_status} | ${md(record.next_review_action)} |`;
  });

  return `# REF-CT1 MTU Gap Classification

Generated: ${coverage.generated_on}

Authority: ${coverage.authority_level}. No CLI mutation authorized.

## Classification Summary

- \`year_1_confirmed\`: ${coverage.summary.year1_confirmed_unit_count} target-exercise-backed live MTUs in Book 1.
- \`year_1_backfill_candidate\`: ${coverage.summary.book1_missing_flag_count} missing-flag records.
- \`needs_evidence\`: ${coverage.summary.placeholder_needs_evidence_count} placeholder target-exercise records.
- \`year_2_skeleton_candidate\`, \`year_3_skeleton_candidate\`, \`duplicate_merge_split_candidate\`, and \`parked\`: none assigned for the Book 1 missing/placeholder surface by REF-CT1.

## Confirmed Book 1 MTUs

| Unit | Label | Domain | Active v5 paragraphs | Roles | Target record statuses |
|---|---|---:|---|---|---|
${confirmedRows.join('\n')}

## Year-1 Backfill Candidates

These records are target-exercise-backed gaps from REF-CT0. They are review input only; later CLI mutation requires separate authorization.

| Paragraph | Record | Classification | Flag | Required skills | Next review action |
|---|---|---|---|---|---|
${missingRows.join('\n')}

## Needs-Evidence Placeholders

These records are count-bearing paragraphs with placeholder target exercises. They cannot count as final coverage and must receive reviewed integration target exercises before closure.

| Paragraph | Record | Classification | Current status | Next review action |
|---|---|---|---|---|
${placeholderRows.join('\n')}

## Deliberately Deferred, Duplicate, Or Parked Items

REF-CT1 found no Book 1 missing/placeholder records that can be safely labelled future-year, duplicate, or parked from the available evidence. If a reviewer wants to defer or merge any backfill candidate, that decision belongs in CP-6 or a later protected mutation sprint.
`;
}

function renderReviewPacket(coverage) {
  const blockerLines = coverage.coverage_decision.blockers.map((blocker) => `- ${blocker}`).join('\n');
  const placeholderLines = coverage.placeholders.map((record) => `- ${record.paragraph_id}: ${record.label}`).join('\n');
  const missingLines = coverage.missing_flags.map((record) => `- ${record.paragraph_id}: ${record.flag}`).join('\n');

  return `# REF-CT1 CP-6 Review Packet

Generated: ${coverage.generated_on}

Status: CP-6 packet ready, CP-6 not closed.

No CLI mutation authorized.

## Review Scope

The reviewer should assess whether the Year-1 coverage baseline is complete enough to start the CP-6 closure path, not whether Year 1 is already closed.

Evidence base:

- Active v5 source: \`${SOURCES.blueprint}\`
- Active target-exercise registry: \`${SOURCES.targetExercises}\`
- REF-CT0 classification: \`${SOURCES.ct0Classification}\`
- Lesson-side read-only evidence for \`1.1.1\`, \`1.1.2\`, and \`1.1.3\`

## Planned Review Questions

1. Are the 12 Book 1 count-bearing target-exercise records the correct v5 basis for Year-1 coverage review?
2. For the 9 migrated Book 1 target-exercise records, what evidence is still required before any record can become \`reviewed_final\`?
3. For the 3 placeholder records, what integration target exercise must be designed before each paragraph can count as covered?
4. For the 9 Year-1 missing-flag records, which are true missing MTUs, which map to existing live units, and which should be merged or deferred?
5. Does the L1.6R status of \`1.1.3\` block CP-6 closure until human review confirms the visual remediation?
6. Is any protected mutation authorized now? The REF-CT1 packet recommendation is no.

## Current Blockers

${blockerLines}

## Placeholder Records

${placeholderLines}

## Missing-Flag Backfill Candidates

${missingLines}

## Stop Conditions

Stop CP-6 closure if any of these remain true:

- A placeholder record is still counted as final coverage.
- A migrated record is treated as \`reviewed_final\` without a later review/mutation artifact.
- \`1.1.3\` remains pending L1.6R human review or unresolved Part A flags while the packet claims final closure.
- A missing-flag candidate is directly converted into machine data without a protected CLI mutation sprint.
- Any student diagnostics, adaptive routing, mastery, AI, summative, PV, or product-use claim is made from this baseline.

## Packet Recommendation

Use this packet to start CP-6 review and the next precision/coverage audit. Do not close CP-6, do not close Year 1, and do not mutate protected reference data from REF-CT1 alone.
`;
}

main();
