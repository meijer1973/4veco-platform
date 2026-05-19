#!/usr/bin/env node
/**
 * REF-CT0 planning artifact builder.
 *
 * HOW TO ADAPT:
 * - Keep this script report-side only. It must not write references/machine or
 *   references/external.
 * - Update CLASSIFICATION_RULES when a later sprint changes the non-authority
 *   categories or the active v5 baseline.
 * - Treat rough planning text as weak context. Do not turn rough proposals into
 *   machine registry changes from this script.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(REPO_ROOT, 'reports', 'reference-planning');
const DATA_OUT = path.join(REPO_ROOT, 'references', 'data', 'sprints', 'REF-CT0-mtu-classification.json');

const PATHS = {
  blueprint: 'references/owned/course-blueprint-v5.md',
  blueprintMeta: 'references/owned/course-blueprint-v5.meta.json',
  targetExercises: 'references/authored/course-target-exercises.json',
  v4TargetArchive: 'references/authored/archive/course-target-exercises-v4.json',
  units: 'references/machine/micro-teaching-units.json',
  roughBlueprint: 'knowledge/three Year blue print.md',
  blueprintFlagTriage: 'reports/json/blueprint-flag-triage.json',
  needsCoverage: 'reports/json/needs-coverage.json',
  termsCoverage: 'reports/json/terms-coverage.json',
  examGaps: 'reports/json/exam-question-extraction-gaps.json',
  referenceHealth: 'reports/json/reference-health.json',
};

const CATEGORIES = [
  'year_1_confirmed',
  'year_1_backfill_candidate',
  'year_2_skeleton_candidate',
  'year_3_skeleton_candidate',
  'duplicate_merge_split_candidate',
  'parked',
  'needs_evidence',
];

const CLASSIFICATION_RULES = {
  duplicateMergeSplitIds: new Set(['A09', 'A24', 'A31', 'D04']),
  parkedIds: new Set(['A34', 'D23', 'H26']),
  year1BackfillIds: new Set([
    'A05',
    'A45', 'A46', 'A47', 'A48', 'A49', 'A50', 'A51', 'A52',
    'A53', 'A54', 'A55', 'A56', 'A57', 'A58', 'A59', 'A60',
    'A61', 'A62', 'A63', 'A64', 'A65', 'A66', 'A67', 'A68',
    'A69', 'A70', 'A72', 'A73', 'A74', 'A75', 'A76', 'A77',
    'A78', 'A79', 'A82', 'A83', 'A84',
    'D01', 'D08', 'D28', 'D38', 'D39', 'D40',
  ]),
  year2Ids: new Set(['D14']),
  year3Ids: new Set(['D10', 'D17']),
  year2Categories: new Set([
    'ruilen over tijd',
    'risico en informatie',
    'samenwerken en onderhandelen',
    'welvaart en groei',
  ]),
  year3Categories: new Set(['goede en slechte tijden']),
};

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function readText(relPath) {
  return fs.readFileSync(repoPath(relPath), 'utf8');
}

function writeText(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text.endsWith('\n') ? text : `${text}\n`, 'utf8');
}

function unique(values) {
  return [...new Set(values)];
}

function sortIds(ids) {
  return [...ids].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function domainOf(id) {
  return String(id || '').replace(/[0-9].*$/, '');
}

function escapeMd(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function truncate(value, length = 160) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (text.length <= length) return text;
  return `${text.slice(0, length - 3)}...`;
}

function collectCoverage(exercises, liveUnitIds) {
  const coverage = new Map();
  const roleFields = [
    ['required_skills', 'required'],
    ['new_skills_introduced', 'introduced'],
    ['prior_knowledge_assumed', 'assumed'],
  ];

  for (const exercise of exercises) {
    for (const [field, role] of roleFields) {
      for (const unitId of exercise[field] || []) {
        if (!liveUnitIds.has(unitId)) continue;
        if (!coverage.has(unitId)) {
          coverage.set(unitId, { paragraphs: new Set(), roles: new Set(), statuses: new Set() });
        }
        const entry = coverage.get(unitId);
        entry.paragraphs.add(exercise.id);
        entry.roles.add(role);
        entry.statuses.add(exercise.record_status);
      }
    }
  }

  return coverage;
}

function classifyUnit(unit, coverage) {
  if (coverage.has(unit.id) && !unit.deprecated) {
    return {
      classification: 'year_1_confirmed',
      rationale: 'Referenced by at least one active v5 count-bearing target-exercise record.',
      evidence_strength: 'target_exercise_backed',
      next_review_action: 'REF-CT1 should verify paragraph coverage and review status before final quality claims.',
    };
  }

  if (CLASSIFICATION_RULES.duplicateMergeSplitIds.has(unit.id)) {
    return {
      classification: 'duplicate_merge_split_candidate',
      rationale: unit.id === 'D04'
        ? 'Rough blueprint treated D04 as unresolved, but S9a retired it with successor pointers; keep as historical cleanup context only.'
        : 'Known overlap in collective-supply scope; needs a human design decision before placement or mutation.',
      evidence_strength: unit.deprecated ? 'resolved_historical_context' : 'machine_registry_and_rough_blueprint_signal',
      next_review_action: unit.deprecated
        ? 'Do not revive. Use successor units and S9a records if this concept appears again.'
        : 'Prepare a bounded merge/split review before any target-exercise or registry change.',
    };
  }

  if (CLASSIFICATION_RULES.parkedIds.has(unit.id) || unit.deprecated) {
    return {
      classification: 'parked',
      rationale: unit.deprecated
        ? 'Deprecated machine record retained for provenance, not active planning.'
        : 'Active v5 parks this scope or lacks count-bearing support for immediate placement.',
      evidence_strength: unit.deprecated ? 'deprecated_registry_record' : 'v5_scope_boundary',
      next_review_action: 'Keep out of REF-CT1 mutation unless a later review explicitly reopens the scope.',
    };
  }

  if (CLASSIFICATION_RULES.year1BackfillIds.has(unit.id)) {
    return {
      classification: 'year_1_backfill_candidate',
      rationale: 'Live unit looks like a Year 1 foundation or representation step that is not yet cited by the active v5 target-exercise registry.',
      evidence_strength: 'machine_registry_plus_foundation_fit',
      next_review_action: 'REF-CT1 should decide whether this belongs in Year 1 target-exercise coverage or remains generator-blocked/backlog.',
    };
  }

  if (CLASSIFICATION_RULES.year2Ids.has(unit.id) || CLASSIFICATION_RULES.year2Categories.has(unit.category)) {
    return {
      classification: 'year_2_skeleton_candidate',
      rationale: 'Fits the later finance, risk, information, cooperation, public-goods, growth, redistribution, or public-finance skeleton.',
      evidence_strength: 'machine_registry_skeleton_fit',
      next_review_action: 'Do not build final target exercises before REF-CT1 and later Year 2 anchoring review.',
    };
  }

  if (CLASSIFICATION_RULES.year3Ids.has(unit.id) || CLASSIFICATION_RULES.year3Categories.has(unit.category)) {
    return {
      classification: 'year_3_skeleton_candidate',
      rationale: 'Fits the later macro-policy, monetary-policy, open-economy, or integration skeleton.',
      evidence_strength: 'machine_registry_skeleton_fit',
      next_review_action: 'Keep as Year 3 skeleton context until Year 2 foundations and CP-7 style anchoring are ready.',
    };
  }

  return {
    classification: 'needs_evidence',
    rationale: 'Not covered by active v5 target exercises and not safely placed by CT0 heuristics.',
    evidence_strength: 'insufficient_for_placement',
    next_review_action: 'Require exam or target-exercise evidence before placement, mutation, or production use.',
  };
}

function makeUnitRecords(units, coverage) {
  return units.map((unit) => {
    const classified = classifyUnit(unit, coverage);
    const coverageEntry = coverage.get(unit.id);
    return {
      record_id: `unit:${unit.id}`,
      candidate_type: 'machine_unit',
      unit_id: unit.id,
      label: unit.name,
      domain: domainOf(unit.id),
      source_category: unit.category,
      classification: classified.classification,
      current_status: unit.deprecated ? 'deprecated' : 'live',
      evidence_strength: classified.evidence_strength,
      evidence: {
        active_v5_paragraphs: coverageEntry ? sortIds(coverageEntry.paragraphs) : [],
        active_v5_roles: coverageEntry ? [...coverageEntry.roles].sort() : [],
        target_record_statuses: coverageEntry ? [...coverageEntry.statuses].sort() : [],
        needs: unit.needs || [],
        exam_codes: unit.exam_codes || [],
        deprecated_in_favor_of: unit.deprecated_in_favor_of || [],
      },
      rationale: classified.rationale,
      next_review_action: classified.next_review_action,
    };
  });
}

function makeMissingFlagRecords(exercises) {
  const records = [];
  for (const exercise of exercises) {
    const flags = exercise.missing_units_flagged || [];
    flags.forEach((flag, index) => {
      const isPlaceholder = flag === 'v5_placeholder_needs_review';
      records.push({
        record_id: `missing_flag:${exercise.id}:${index + 1}`,
        candidate_type: isPlaceholder ? 'placeholder_target_exercise' : 'target_exercise_missing_flag',
        paragraph_id: exercise.id,
        label: `${exercise.id} ${exercise.paragraph_title}`,
        classification: isPlaceholder ? 'needs_evidence' : 'year_1_backfill_candidate',
        current_status: exercise.record_status,
        evidence_strength: isPlaceholder ? 'placeholder_only' : 'target_exercise_flag',
        evidence: {
          paragraph_kind: exercise.paragraph_kind,
          introduces_new_theory: exercise.introduces_new_theory,
          source_ref: exercise.source_ref,
          flag,
          required_skills: exercise.required_skills || [],
          new_skills_introduced: exercise.new_skills_introduced || [],
          prior_knowledge_assumed: exercise.prior_knowledge_assumed || [],
        },
        rationale: isPlaceholder
          ? 'Active v5 placeholder marks a count-bearing consolidation paragraph that still needs a reviewed integration target exercise.'
          : 'Active v5 target exercise names an unresolved unit or concept gap; this is review input, not mutation authority.',
        next_review_action: isPlaceholder
          ? 'REF-CT1 should record placeholder coverage status and route it to target-exercise review before final claims.'
          : 'Review against existing live units first; only later use CLI mutation if human review confirms a missing MTU.',
      });
    });
  }
  return records;
}

function summarize(records) {
  const byClassification = Object.fromEntries(CATEGORIES.map((category) => [category, 0]));
  const byType = {};
  const byDomain = {};
  for (const record of records) {
    byClassification[record.classification] = (byClassification[record.classification] || 0) + 1;
    byType[record.candidate_type] = (byType[record.candidate_type] || 0) + 1;
    if (record.domain) byDomain[record.domain] = (byDomain[record.domain] || 0) + 1;
  }
  return { by_classification: byClassification, by_candidate_type: byType, by_domain: byDomain };
}

function idsByClassification(records, classification) {
  return records
    .filter((record) => record.classification === classification && record.unit_id)
    .map((record) => record.unit_id);
}

function recordsByClassification(records, classification) {
  return records.filter((record) => record.classification === classification);
}

function makeClassificationJson(context) {
  const { exercises, units, coverage, roughText, triage, needs, terms, examGaps, referenceHealth } = context;
  const unitRecords = makeUnitRecords(units, coverage);
  const flagRecords = makeMissingFlagRecords(exercises);
  const records = [...unitRecords, ...flagRecords];
  const summary = summarize(records);
  const liveUnits = units.filter((unit) => !unit.deprecated);
  const placeholders = exercises.filter((exercise) => exercise.record_status === 'placeholder_needs_review');

  return {
    schema_version: 1,
    sprint_id: 'REF-CT0',
    generated_on: '2026-05-19',
    generated_by: 'build-scripts/references/build-ref-ct0-planning-artifacts.js',
    authority_level: 'non_authoritative_planning_prototype',
    protected_reference_data_changed: false,
    allowed_use: [
      'reference-team planning',
      'REF-CT1 preparation',
      'candidate review packet input',
      'non-authoritative three-year skeleton discussion',
    ],
    not_allowed_use: [
      'machine registry mutation',
      'target-exercise mutation',
      'curriculum source-of-truth promotion',
      'student diagnostics',
      'adaptive routing',
      'mastery decisions',
      'automatic sequencing',
      'student-facing AI',
      'summative use',
      'PV projection',
      'PV machine promotion',
    ],
    source_paths: PATHS,
    active_v5_baseline: {
      blueprint_version: 'v5',
      count_bearing_paragraphs: exercises.length,
      by_book: countBy(exercises, (exercise) => String(exercise.module)),
      by_record_status: countBy(exercises, (exercise) => exercise.record_status),
      placeholder_count: placeholders.length,
      covered_live_unit_count: coverage.size,
    },
    rough_source_drift: {
      old_target_exercise_count_claim_seen: roughText.includes('49 target exercises'),
      rough_d04_unresolved_language_seen: roughText.includes('D04'),
      rough_candidate_ids_are_not_safe_to_reuse: true,
      notes: [
        'The rough blueprint uses the old 49-record target-exercise frame; active v5 has 54 count-bearing records.',
        'The rough blueprint treats D04 as unresolved; S9a has retired D04 through CLI-only mutation.',
        'The rough blueprint proposed IDs such as A45-A57; many A45+ ids now exist with reviewed catalog history and must not be treated as rough free IDs.',
      ],
    },
    diagnostic_report_baseline: {
      blueprint_flag_triage: {
        exercise_count: triage.exercise_count,
        raw_flag_count: triage.raw_flag_count,
        by_decision_category: triage.summary?.by_decision_category,
        by_priority: triage.summary?.by_priority,
        note: 'R4.3 report is v4-era diagnostic context, not active v5 authority.',
      },
      needs_coverage: needs.summary,
      terms_coverage: terms.summary,
      exam_question_extraction_gaps: examGaps.summary,
      reference_health_unit_counts: referenceHealth.unit_counts,
    },
    classification_categories: CATEGORIES,
    summary,
    records,
  };
}

function countBy(items, keyFn) {
  const counts = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function mdList(values) {
  if (!values.length) return '_None._';
  return values.map((value) => `- ${value}`).join('\n');
}

function idList(records, classification) {
  const ids = idsByClassification(records, classification);
  return ids.length ? sortIds(ids).join(', ') : 'None';
}

function makeBoundaryNote(data) {
  return `# REF-CT0 Source And Authority Boundary

Status: non-authoritative planning prototype

REF-CT0 exists to normalize a rough three-year planning note into reviewable planning context. It is not a curriculum source of truth, not a machine registry, and not permission to mutate protected reference data.

## Source Order

1. Real CvTE exam questions and reviewed extracted evidence.
2. Active authored target exercises and built platform exercises.
3. Consolidation exercises and reviewed lesson outputs.
4. Syllabus grouping for coverage orientation.
5. Owned blueprint prose, rough planning notes, and generated reports as weaker context.

## Active Baseline

- Active blueprint: \`${PATHS.blueprint}\`
- Active target-exercise registry: \`${PATHS.targetExercises}\`
- Count-bearing v5 records: ${data.active_v5_baseline.count_bearing_paragraphs}
- Placeholder records needing review: ${data.active_v5_baseline.placeholder_count}
- Covered live MTU ids in active v5 target records: ${data.active_v5_baseline.covered_live_unit_count}

## Rough Source Boundary

\`${PATHS.roughBlueprint}\` is treated as rough concept scaffolding only. Its useful contribution is broad sequencing pressure: stabilize current Year 1 foundations, then skeleton Year 2/Year 3 around uncovered finance, risk, information, cooperation, growth, and macro-policy clusters.

Known drift:

- It uses the old 49-record target-exercise frame; active v5 has 54 count-bearing records.
- It treats D04 as unresolved; S9a already retired D04 through CLI-only mutation.
- It proposes A45+ style ids as if they were free planning labels; current A45+ ids now have live catalog history and must be treated as machine registry facts, not rough proposals.
- It includes wider inflation/protectionism assumptions that active v5 parks outside the current print scope.

## Explicit Non-Uses

REF-CT0 must not mutate \`references/machine/\`, hand-edit \`references/external/\`, promote rough prose to \`references/owned/\`, mark placeholders as reviewed final, mint units, edit target exercises, or authorize diagnostics, adaptive routing, mastery decisions, automatic sequencing, student-facing AI, summative use, PV projection, or PV machine promotion.
`;
}

function makePrototype(data) {
  const year1Confirmed = idsByClassification(data.records, 'year_1_confirmed').length;
  const year1Backfill = idsByClassification(data.records, 'year_1_backfill_candidate').length;
  const year1MissingFlags = recordsByClassification(data.records, 'year_1_backfill_candidate')
    .filter((record) => record.candidate_type === 'target_exercise_missing_flag').length;
  const year2 = idsByClassification(data.records, 'year_2_skeleton_candidate').length;
  const year3 = idsByClassification(data.records, 'year_3_skeleton_candidate').length;

  return `# REF-CT0 Three-Year Planning Prototype

Status: non-authoritative planning prototype

This prototype is v5-aware. Year 1 means the current active four-book, four-test-week v5 print scope. Future-year books below are skeletons for review, not owned curriculum source.

## Year 1: Current v5 Print Scope

| Book | Count-bearing paragraphs | Active scope | CT0 status |
|---|---:|---|---|
| Book 1 | 12 | Grondslagen, vraag en aanbod | Confirmed as active v5 scope; coverage/backfill still needs REF-CT1 review. |
| Book 2 | 12 | Kosten, opbrengsten, elasticiteit en surplus | Confirmed as active v5 scope; migrated target records are not final-reviewed. |
| Book 3 | 14 | Overheidsingrijpen en marktvormen | Confirmed as active v5 scope; placeholders need integration-exercise review. |
| Book 4 | 16 | Marktfalen, arbeidsmarkt en internationale handel | Confirmed as active v5 scope; inflation and late macro are parked for later-year scope. |

Current v5 target records reference ${year1Confirmed} live MTU ids. CT0 also identifies ${year1Backfill} live Year 1 backfill MTU ids and ${year1MissingFlags} active v5 missing-flag records for REF-CT1 review.

## Year 1 Backfill Themes

- Graph and table foundations: P-Q graph drawing, reading/interpolation, source-table selection, and representation-specific percentage/index skills.
- Aggregation foundations: collective demand/supply scope must be reconciled before broader sequencing.
- Cost, revenue, and marginal reasoning: GVK/GCK, table-based MK/MO, break-even, and profit-table/graph representation skills.
- Intervention mechanics: non-equilibrium surplus/shortage, short-side reasoning, afwenteling, subsidies, minimum-price opkoop, and welfare-accounting checks.
- Trade/protectionism boundary: core trade remains in v5, but import-tariff/protectionism expansion is parked unless later target evidence reopens it.

## Year 2 Skeleton Candidate

The rough blueprint's five-book Year 2 load is not adopted as a v5 fact. CT0 compresses it into a four-test-week skeleton to match the active v5 baseline.

| Future book | Skeleton focus | Candidate domains |
|---|---|---|
| Y2 Book 1 | Time, stocks/flows, intergenerational exchange, pensions | E, H |
| Y2 Book 2 | Bonds, interest, housing, exchange-rate basics | H, E |
| Y2 Book 3 | Risk, insurance, information, principal-agent problems | G |
| Y2 Book 4 | Game theory, cooperation, public goods, growth and public finance foundations | F, H, selected D |

CT0 classifies ${year2} live MTU ids as Year 2 skeleton candidates. They remain candidates until reviewed target exercises and CP-7 style anchoring exist.

## Year 3 Skeleton Candidate

| Future book | Skeleton focus | Candidate domains |
|---|---|---|
| Y3 Book 1 | Keynesian macro, fiscal policy, shocks, output gaps | I, selected D/H |
| Y3 Book 2 | Monetary policy, IS-MB-GA, open economy, exchange-rate channels | I, H |
| Y3 Book 3 | Integrated policy, welfare, labour/trade/macro transfer | mixed |
| Y3 Book 4 | Final exam training and integration-only review | mixed, no automatic new MTUs |

CT0 classifies ${year3} live MTU ids as Year 3 skeleton candidates. Final exam training is treated as integration and packaging until exam or target-exercise evidence justifies new base units.

## Stop Boundary

This prototype is not a source of truth. REF-CT1 should use it only to prepare Year 1 coverage review and candidate packets; later sprints decide any mutations through CLI-backed, human-reviewed lanes.
`;
}

function makeClassificationMarkdown(data) {
  const summaryRows = CATEGORIES.map((category) => `| \`${category}\` | ${data.summary.by_classification[category] || 0} |`).join('\n');
  const duplicateRecords = recordsByClassification(data.records, 'duplicate_merge_split_candidate');
  const parkedRecords = recordsByClassification(data.records, 'parked');
  const needsEvidenceRecords = recordsByClassification(data.records, 'needs_evidence').slice(0, 25);

  return `# REF-CT0 MTU Classification

Status: non-authoritative planning prototype

The JSON mirror at \`references/data/sprints/REF-CT0-mtu-classification.json\` is the detailed record list. This Markdown view is the reviewer-readable projection.

## Summary

| Classification | Records |
|---|---:|
${summaryRows}

## Category Definitions

| Category | Meaning |
|---|---|
| \`year_1_confirmed\` | Live unit is referenced by an active v5 count-bearing target-exercise record. |
| \`year_1_backfill_candidate\` | Target-exercise flag or live foundation/representation unit needs Year 1 coverage review. |
| \`year_2_skeleton_candidate\` | Candidate for later finance, risk, information, cooperation, public goods, growth, or public-finance skeleton. |
| \`year_3_skeleton_candidate\` | Candidate for macro, monetary policy, open economy, integration, or final exam skeleton. |
| \`duplicate_merge_split_candidate\` | Scope overlap or retired rough-source issue needs a human design decision before use. |
| \`parked\` | Outside active v5 print scope, deprecated for provenance, or intentionally deferred. |
| \`needs_evidence\` | Too thin, stale, placeholder-only, or ambiguous for placement. |

## Unit Ids By Classification

| Classification | Unit ids |
|---|---|
| Year 1 confirmed | ${escapeMd(idList(data.records, 'year_1_confirmed'))} |
| Year 1 backfill candidate | ${escapeMd(idList(data.records, 'year_1_backfill_candidate'))} |
| Year 2 skeleton candidate | ${escapeMd(idList(data.records, 'year_2_skeleton_candidate'))} |
| Year 3 skeleton candidate | ${escapeMd(idList(data.records, 'year_3_skeleton_candidate'))} |

## Duplicate, Merge, Split, Or Retired-Scope Records

| Record | Label | Status | Next review action |
|---|---|---|---|
${duplicateRecords.map((record) => `| \`${record.record_id}\` | ${escapeMd(record.label)} | ${escapeMd(record.current_status)} | ${escapeMd(record.next_review_action)} |`).join('\n')}

## Parked Records

| Record | Label | Reason |
|---|---|---|
${parkedRecords.map((record) => `| \`${record.record_id}\` | ${escapeMd(record.label)} | ${escapeMd(record.rationale)} |`).join('\n')}

## Needs Evidence Preview

The full JSON contains all needs-evidence records. These are the first review-visible records:

| Record | Type | Label | Reason |
|---|---|---|---|
${needsEvidenceRecords.map((record) => `| \`${record.record_id}\` | ${escapeMd(record.candidate_type)} | ${escapeMd(record.label)} | ${escapeMd(record.rationale)} |`).join('\n')}

## Data Integrity

Protected reference data changed: \`${data.protected_reference_data_changed}\`.

REF-CT0 does not mutate \`references/machine/\` or \`references/external/\`. It does not mark placeholder target exercises as reviewed final.
`;
}

function makeReviewPacket(data) {
  const year1Backfill = recordsByClassification(data.records, 'year_1_backfill_candidate');
  const missingFlags = year1Backfill.filter((record) => record.candidate_type === 'target_exercise_missing_flag');
  const placeholders = data.records.filter((record) => record.candidate_type === 'placeholder_target_exercise');
  const duplicate = recordsByClassification(data.records, 'duplicate_merge_split_candidate');

  const priorityBackfill = year1Backfill
    .filter((record) => record.unit_id && /^(A(05|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|60|61|62|63|64|65|66|67|68|69|70|72|73|74|75|76|77|78|79|82|83|84)|D(01|08|28|38|39|40))$/.test(record.unit_id))
    .slice(0, 45);

  return `# REF-CT0 Candidate Review Packet

Status: ready for REF-CT1 preparation; no human gate closed here

## Purpose

This packet tells REF-CT1 what to review before any Year 1 target-exercise or MTU mutation work. It is non-authoritative and must not be used to mint units directly.

## Immediate REF-CT1 Questions

1. Which of the 104 live MTU ids already cited by active v5 target records are genuinely covered at paragraph level?
2. Which of the ${placeholders.length} placeholder target-exercise records need full integration exercises before coverage claims?
3. Which Year 1 backfill candidates should be linked to existing target exercises, handled by target-exercise rewrite, or routed to CLI-backed MTU review?
4. Which rough-source assumptions must be discarded because v5 changed the print scope?
5. Which duplicate/merge/split records require a human design decision before placement?

## Highest-Priority Year 1 Backfill Candidates

| Unit | Label | Why it is in the packet |
|---|---|---|
${priorityBackfill.map((record) => `| \`${record.unit_id}\` | ${escapeMd(record.label)} | ${escapeMd(record.rationale)} |`).join('\n')}

## Active v5 Missing-Flag Records

Current v5 target exercises contain ${missingFlags.length} non-placeholder missing-flag records. These are review prompts only:

| Paragraph | Flag |
|---|---|
${missingFlags.slice(0, 40).map((record) => `| \`${record.paragraph_id}\` | ${escapeMd(truncate(record.evidence.flag, 220))} |`).join('\n')}

${missingFlags.length > 40 ? `\nAdditional missing-flag records are in the JSON mirror.\n` : ''}

## Placeholder Records

The following active v5 records are count-bearing placeholders and cannot support final coverage claims:

| Paragraph | Label |
|---|---|
${placeholders.map((record) => `| \`${record.paragraph_id}\` | ${escapeMd(record.label)} |`).join('\n')}

## Duplicate Or Scope Decisions

| Record | Decision needed |
|---|---|
${duplicate.map((record) => `| \`${record.record_id}\` | ${escapeMd(record.next_review_action)} |`).join('\n')}

## Later-Year Skeleton Use

Year 2 and Year 3 records in the classification are planning skeletons only. They should help sequence later target-exercise design, but REF-CT1 should not use them to expand production beyond Year 1 foundation hardening.

## Stop Conditions For Reviewers

- Stop if a proposal edits \`references/machine/\` without a later approved CLI mutation sprint.
- Stop if a proposal treats placeholder target exercises as reviewed final.
- Stop if a proposal uses the rough three-year blueprint as owned curriculum source.
- Stop if a proposal authorizes diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, or PV machine promotion.
`;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const exercisesData = readJson(PATHS.targetExercises);
  const exercises = exercisesData.exercises || [];
  const units = readJson(PATHS.units);
  const liveUnitIds = new Set(units.filter((unit) => !unit.deprecated).map((unit) => unit.id));
  const coverage = collectCoverage(exercises, liveUnitIds);
  const roughText = readText(PATHS.roughBlueprint);

  const data = makeClassificationJson({
    exercises,
    units,
    coverage,
    roughText,
    triage: readJson(PATHS.blueprintFlagTriage),
    needs: readJson(PATHS.needsCoverage),
    terms: readJson(PATHS.termsCoverage),
    examGaps: readJson(PATHS.examGaps),
    referenceHealth: readJson(PATHS.referenceHealth),
  });

  writeText(DATA_OUT, JSON.stringify(data, null, 2));
  writeText(path.join(OUT_DIR, 'REF-CT0-source-authority-boundary.md'), makeBoundaryNote(data));
  writeText(path.join(OUT_DIR, 'REF-CT0-three-year-prototype.md'), makePrototype(data));
  writeText(path.join(OUT_DIR, 'REF-CT0-mtu-classification.md'), makeClassificationMarkdown(data));
  writeText(path.join(OUT_DIR, 'REF-CT0-candidate-review-packet.md'), makeReviewPacket(data));

  console.log(`OK REF-CT0 planning artifacts: records=${data.records.length}`);
  console.log(CATEGORIES.map((category) => `${category}=${data.summary.by_classification[category] || 0}`).join(', '));
}

if (require.main === module) main();
