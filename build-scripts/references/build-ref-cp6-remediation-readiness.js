#!/usr/bin/env node
/**
 * Build REF-CP6 remediation/readiness artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this script read-only with respect to reference and lesson sources.
 * - For a later sprint, change SPRINT_ID, output paths, and the source
 *   blocker/audit baseline.
 * - Do not convert a routing decision into protected reference mutation,
 *   lesson-output mutation, CP-6 closure, or Year-1 closure.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'REF-CP6';
const GENERATED_ON = '2026-05-19';
const GATE_ID = 'GATE-CP6-year-1-paragraph-coverage';

const SOURCES = {
  refCt1Coverage: 'references/data/sprints/REF-CT1-year1-coverage.json',
  refCt2Audit: 'references/data/sprints/REF-CT2-precision-dual-coding-audit.json',
  targetExercises: 'references/authored/course-target-exercises.json',
  blueprint: 'references/owned/course-blueprint-v5.md',
  roadmap: 'references/reference-team-roadmap.md',
  refCt1ReviewPacket: 'reports/reference-planning/REF-CT1-cp6-review-packet.md',
  refCt2Cp6Status: 'reports/reference-planning/REF-CT2-cp6-status-update.md',
  lessonRoot: '../4veco-lessen',
};

const OUTPUTS = {
  readinessJson: 'references/data/sprints/REF-CP6-remediation-readiness.json',
  readinessReport: 'reports/reference-planning/REF-CP6-remediation-readiness.md',
  blockerRoutingReport: 'reports/reference-planning/REF-CP6-blocker-routing.md',
  reviewPacket: `reports/review-gates/${GATE_ID}/review-packet.md`,
  reviewPacketJson: `reports/review-gates/${GATE_ID}/review-packet.json`,
};

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}

function readText(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function writeFile(relPath, content) {
  const file = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function runGit(cwd, args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

function md(value) {
  if (value === undefined || value === null || value === '') return '-';
  if (Array.isArray(value)) return value.length ? value.map(md).join('<br>') : '-';
  return String(value).replace(/\r?\n/g, '<br>').replace(/\|/g, '\\|');
}

function unique(values) {
  return [...new Set(values.filter((value) => value !== undefined && value !== null && value !== ''))];
}

function activeRoadmapVersion() {
  const roadmap = readText(SOURCES.roadmap);
  const match = roadmap.match(/Roadmap version:\s*`([^`]+)`/);
  return match ? match[1] : null;
}

function summarizeItem(record) {
  return {
    paragraph_id: record.paragraph_id,
    target_title: record.target_title,
    lesson_title: record.lesson_title,
    target_record_status: record.target_record_status,
    source_lesson_alignment: record.source_lesson_alignment,
    dual_coding_status: record.dual_coding_status,
    precision_lint_status: record.precision_lint_status,
    blockers: record.blockers || [],
  };
}

function lane(laneId, title, status, items, requiredEvidence, authorityRequired, allowedNextAction, blockedAction, stopCondition) {
  return {
    lane_id: laneId,
    title,
    status,
    item_count: items.length,
    items,
    required_evidence: requiredEvidence,
    authority_required: authorityRequired,
    allowed_next_action: allowedNextAction,
    blocked_action: blockedAction,
    stop_condition: stopCondition,
  };
}

function buildReviewQuestions() {
  return [
    {
      id: 'CP6-Q1',
      topic: 'Source/lesson alignment',
      question: 'For 1.3.2 and 1.3.3, active v5 names market-equilibrium topics while the built lesson-side directories currently show Kostenstructuren and Opbrengsten. Which authority should drive remediation?',
      options: [
        'Treat active v5 as the intended source and require lesson-side remediation before CP-6 can close.',
        'Treat the built lesson-side sequence as evidence of a needed v5 source correction, requiring a later protected source-update path.',
        'Hold both records until a curriculum-owner decision resolves the sequencing.',
      ],
      open_answer_allowed: true,
    },
    {
      id: 'CP6-Q2',
      topic: 'Placeholder target exercises',
      question: 'For 1.1.4, 1.2.4, and 1.3.4, should each placeholder be replaced by a reviewed integration/transfer target exercise before any Year-1 final coverage claim?',
      options: [
        'Yes, all three need reviewed integration target exercises before final coverage.',
        'Only some need replacement; name which ones and why.',
        'No, placeholders may remain if they are explicitly excluded from final coverage.',
      ],
      open_answer_allowed: true,
    },
    {
      id: 'CP6-Q3',
      topic: 'Backfill candidates',
      question: 'The nine Year-1 backfill candidates include graph drawing, interpolation, demand aggregation, surplus/shortage, and simultaneous-shift reasoning. How should they be classified before any CLI-backed mutation lane?',
      options: [
        'Review each as true missing unit, existing-unit mapping, merge candidate, or defer candidate.',
        'Hold all nine until target exercises are reviewed-final.',
        'Authorize a later bounded review/mutation sprint for only the high-confidence candidates.',
      ],
      open_answer_allowed: true,
    },
    {
      id: 'CP6-Q4',
      topic: '1.1.3 remaining Part A FLAG',
      question: 'Does the remaining 1.1.3 Part A FLAG block CP-6 closure even though L1.6R dual-coding remediation is currently pass_with_flags?',
      options: [
        'Yes, CP-6 cannot close while Part A remains FLAG.',
        'No, L1.6R pass_with_flags is sufficient if the flag is explicitly carried forward.',
        'Hold until a focused Part A re-review is recorded.',
      ],
      open_answer_allowed: true,
    },
    {
      id: 'CP6-Q5',
      topic: 'Legacy quality-ref evidence',
      question: 'For graph-heavy 1.2 and 1.3 records that still rely on legacy quality-ref evidence, what review evidence is required before CP-6 closure?',
      options: [
        'Require upgraded Part A/Part B review records for each graph-heavy record.',
        'Allow legacy evidence only for non-mismatched paragraphs, with explicit flags.',
        'Hold all legacy-evidence records until companion visual review is complete.',
      ],
      open_answer_allowed: true,
    },
    {
      id: 'CP6-Q6',
      topic: 'Migrated target-exercise final review',
      question: 'Can any of the nine migrated Book 1 target-exercise records be promoted to reviewed_final from current evidence, or do they all require a later target-exercise review artifact?',
      options: [
        'None may be promoted from current evidence; all need later review artifacts.',
        'Only 1.1.1 and 1.1.2 are candidates for final review now.',
        'A subset may proceed; name the records and required proof.',
      ],
      open_answer_allowed: true,
    },
    {
      id: 'CP6-Q7',
      topic: 'Minimum CP-6 closure package',
      question: 'What is the minimum remediation package required before a later CP-6 closure proposal can be responsibly drafted?',
      options: [
        'Resolve source/lesson mismatch, replace placeholders, classify backfills, upgrade graph-heavy review evidence, and clear 1.1.3 Part A.',
        'Allow CP-6 to close with explicit conditions and route the remaining items to post-closure sprints.',
        'Hold CP-6 until all Year-1 Book 1 records are reviewed_final.',
      ],
      open_answer_allowed: true,
    },
    {
      id: 'CP6-Q8',
      topic: 'Protected mutation authority',
      question: 'Does this review authorize protected reference mutation, lesson-output mutation, target-exercise promotion, placeholder replacement, unit minting, or CP-6/Year-1 closure now?',
      options: [
        'No, this gate may only authorize later bounded sprints.',
        'Yes, but only for explicitly named low-risk items.',
        'Hold; authority cannot be decided until more evidence is gathered.',
      ],
      open_answer_allowed: true,
    },
    {
      id: 'CP6-Q9',
      topic: 'Next sprint routing',
      question: 'What should be the next operational step after the CP-6 review packet: a human gate, a lesson-side remediation sprint, a target-exercise design sprint, an MTU backfill review sprint, or a strategic pause?',
      options: [
        'Run the formal CP-6 human gate first.',
        'Resolve source/lesson alignment before the human gate.',
        'Split into separate remediation lanes before any gate.',
      ],
      open_answer_allowed: true,
    },
  ];
}

function buildArtifacts() {
  const ct1 = readJson(SOURCES.refCt1Coverage);
  const ct2 = readJson(SOURCES.refCt2Audit);
  const targetRegistry = readJson(SOURCES.targetExercises);
  const lessonRootAbs = path.resolve(ROOT, SOURCES.lessonRoot);

  const records = ct2.records.map(summarizeItem);
  const mismatches = ct2.records.filter((record) => record.source_lesson_alignment === 'topic_mismatch').map(summarizeItem);
  const placeholders = ct2.records.filter((record) => record.target_exercise_placeholder).map(summarizeItem);
  const migrated = ct2.records.filter((record) => record.target_record_status === 'migrated_from_v4_needs_v5_review').map(summarizeItem);
  const legacyEvidence = ct2.records.filter((record) => record.lesson_quality_ref_shape !== '2').map(summarizeItem);
  const partAFlags = ct2.records
    .filter((record) => record.paragraph_id === '1.1.3' || /FLAG|blocker/i.test((record.blockers || []).join(' ')))
    .filter((record) => record.paragraph_id === '1.1.3')
    .map(summarizeItem);
  const backfillCandidates = ct1.missing_flags.map((item) => ({
    paragraph_id: item.paragraph_id,
    label: item.label,
    flag: item.flag,
    classification: item.classification,
    current_status: item.current_status,
    required_skills: item.required_skills || [],
    next_review_action: item.next_review_action,
  }));

  const decisionLanes = [
    lane(
      'source_lesson_alignment',
      'Resolve or formally route active-v5 versus lesson-side topic mismatch',
      'human_decision_required',
      mismatches,
      ['Active v5 target titles', 'Lesson-side paragraph titles', 'Curriculum-owner decision on source versus lesson remediation'],
      'Formal CP-6 human review, then a later bounded source/lesson remediation sprint if authorized',
      'Prepare the mismatch decision for the CP-6 human gate.',
      'Silent source edit, silent lesson edit, or final coverage claim for mismatched records.',
      'Stop CP-6 closure while any source/lesson topic mismatch remains unresolved or unaccepted.'
    ),
    lane(
      'placeholder_target_exercises',
      'Replace or explicitly hold placeholder target exercises',
      'target_exercise_design_review_required',
      placeholders,
      ['Reviewed integration/transfer target exercise design for each placeholder paragraph', 'Teacher-learning-quality review before final coverage'],
      'Formal CP-6 human review, then later target-exercise design review',
      'Use the packet to decide whether placeholders block closure or route to a design sprint.',
      'Counting placeholder target exercises as reviewed_final coverage.',
      'Stop final coverage while placeholders are unresolved or counted as final.'
    ),
    lane(
      'backfill_candidates',
      'Classify Year-1 MTU backfill candidates before mutation',
      'mtu_backfill_review_required',
      backfillCandidates,
      ['Candidate label', 'Existing unit mapping check', 'Merge/defer/true-missing decision', 'Later CLI mutation plan if approved'],
      'Formal CP-6 human review, then later CLI-backed mutation sprint only if authorized',
      'Classify each candidate as true missing, existing-unit mapping, merge, defer, or hold.',
      'Minting units or editing machine references from REF-CP6.',
      'Stop mutation while candidates remain unreviewed.'
    ),
    lane(
      'legacy_review_evidence',
      'Upgrade legacy graph-heavy review evidence',
      'current_review_evidence_required',
      legacyEvidence,
      ['Current Part A review', 'Current Part B companion visual-review evidence where graph-heavy', 'Rendered/surface evidence for graph/table learning objects'],
      'Formal CP-6 human review, then lesson-side review/remediation sprint if authorized',
      'Name which legacy-evidence paragraphs need upgraded review before closure.',
      'Treating legacy quality-ref shape or asset counts as closure-ready.',
      'Stop CP-6 closure while graph-heavy records lack current review evidence.'
    ),
    lane(
      'part_a_l16r_flag',
      'Resolve remaining 1.1.3 Part A FLAG while preserving L1.6R pass-with-flags evidence',
      'part_a_review_required',
      partAFlags,
      ['Current 1.1.3 quality-ref', 'L1.6R incident and semantic visual QA record', 'Focused Part A re-review or explicit hold decision'],
      'Formal CP-6 human review, then focused Part A re-review if authorized',
      'Keep L1.6R pass-with-flags visible without collapsing the remaining Part A FLAG.',
      'Closing CP-6 while the Part A FLAG is hidden or ignored.',
      'Stop final Year-1 closure while 1.1.3 Part A remains FLAG unless a human gate explicitly accepts a conditioned hold.'
    ),
    lane(
      'target_exercise_final_review',
      'Review migrated target-exercise records before reviewed_final promotion',
      'target_exercise_review_required',
      migrated,
      ['Target exercise content', 'Required units and missing flags', 'Current lesson evidence', 'Teacher-learning-quality review'],
      'Formal CP-6 human review, then later target-exercise review/mutation sprint',
      'Decide which migrated records can enter final review and what proof they need.',
      'Promoting migrated records to reviewed_final from REF-CP6 alone.',
      'Stop target-exercise promotion while final review artifacts are missing.'
    ),
    lane(
      'formal_cp6_human_gate',
      'Run formal CP-6 human review before any closure claim',
      'packet_ready_not_closed',
      [{ gate_id: GATE_ID, review_packet: OUTPUTS.reviewPacket }],
      ['Review packet', 'Question list', 'Future one-question-at-a-time interview log', 'Future closure confirmation'],
      'Human reviewer in the formal CP-6 gate sprint',
      'Use this packet as input to the future CP-6 human gate.',
      'Writing closure or mutation authority inside REF-CP6.',
      'Stop if human review has not recorded answers and explicit closure confirmation.'
    ),
  ];

  const paragraphRoutes = records.map((record) => ({
    ...record,
    routed_lanes: decisionLanes
      .filter((entry) => JSON.stringify(entry.items).includes(`"paragraph_id":"${record.paragraph_id}"`))
      .map((entry) => entry.lane_id),
    closure_ready: false,
  }));

  const reviewQuestions = buildReviewQuestions();
  const readiness = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated_on: GENERATED_ON,
    generated_by: 'build-scripts/references/build-ref-cp6-remediation-readiness.js',
    authority_level: 'non_mutating_cp6_review_readiness',
    gate_id: GATE_ID,
    protected_reference_data_changed: false,
    lesson_output_changed: false,
    no_cli_mutation_authorized: true,
    no_cp6_closure_authorized: true,
    human_gate_completed: false,
    source_paths: SOURCES,
    repository_state: {
      platform_commit: runGit(ROOT, ['rev-parse', 'HEAD']),
      lesson_commit: runGit(lessonRootAbs, ['rev-parse', 'HEAD']),
      lesson_status: runGit(lessonRootAbs, ['status', '--short', '--branch']),
      active_roadmap_version_at_plan: activeRoadmapVersion(),
    },
    summary: {
      active_v5_paragraph_count: ct2.summary.active_v5_paragraph_count,
      cp6_quality_ready_count: ct2.summary.cp6_quality_ready_count,
      records_with_blockers_count: ct2.summary.records_with_blockers_count,
      placeholder_count: placeholders.length,
      source_lesson_mismatch_count: mismatches.length,
      backfill_candidate_count: backfillCandidates.length,
      legacy_quality_ref_count: legacyEvidence.length,
      part_a_flag_count: partAFlags.length,
      migrated_needs_final_review_count: migrated.length,
      decision_lane_count: decisionLanes.length,
      planned_review_question_count: reviewQuestions.length,
      cp6_closure_status: 'blocked_not_ready_for_closure',
      cp6_human_review_status: 'packet_ready_not_closed',
      final_year1_closure_status: 'blocked_pending_cp6_human_review_and_remediation',
    },
    cp6_decision: {
      status: 'packet_ready_not_closed',
      recommendation: 'Run the formal CP-6 human gate next. Do not close CP-6 or Year 1 from REF-CP6 alone.',
      allowed_next_sprint: 'GATE-CP6',
      blocked_closure_reasons: ct2.cp6_decision.required_before_cp6_closure,
    },
    decision_lanes: decisionLanes,
    paragraph_routes: paragraphRoutes,
    planned_review_questions: reviewQuestions,
    allowed_use: [
      'formal CP-6 human-review preparation',
      'Year-1 blocker routing',
      'planning later remediation or protected mutation lanes',
    ],
    not_allowed_use: [
      'CP-6 closure',
      'Year-1 closure',
      'target-exercise promotion',
      'placeholder finalization',
      'unit minting',
      'lesson output mutation',
      'student diagnostics',
      'adaptive routing',
      'mastery decisions',
      'automatic sequencing',
      'student-facing AI',
      'summative use',
      'PV projection',
      'PV machine promotion',
    ],
    target_registry_total_count_bearing_paragraphs: targetRegistry.total_count_bearing_paragraphs,
  };

  const reviewPacketJson = {
    schema_version: 1,
    gate_id: GATE_ID,
    sprint_id: SPRINT_ID,
    status: 'review_packet_ready_not_closed',
    generated_on: GENERATED_ON,
    protected_reference_data_changed: false,
    lesson_output_changed: false,
    human_interview_completed: false,
    gate_closure_completed: false,
    source_readiness_json: OUTPUTS.readinessJson,
    evidence_inputs: Object.values(SOURCES).filter((source) => source !== '../4veco-lessen'),
    review_questions: reviewQuestions,
    future_interview_protocol: [
      'Show the full question list before starting.',
      'Ask one question at a time.',
      'Record each answer before asking the next question.',
      'Run pattern analysis after initial answers.',
      'Ask targeted follow-ups for ambiguity or conflicting authority.',
      'Draft a closure proposal only after evidence is complete.',
      'Require explicit human confirmation before writing a closure record.',
    ],
    recommended_gate_status_before_interview: 'hold_until_reviewed',
    blocked_outcomes: readiness.not_allowed_use,
  };

  writeFile(OUTPUTS.readinessJson, `${JSON.stringify(readiness, null, 2)}\n`);
  writeFile(OUTPUTS.readinessReport, renderReadinessReport(readiness));
  writeFile(OUTPUTS.blockerRoutingReport, renderRoutingReport(readiness));
  writeFile(OUTPUTS.reviewPacket, renderReviewPacket(readiness, reviewPacketJson));
  writeFile(OUTPUTS.reviewPacketJson, `${JSON.stringify(reviewPacketJson, null, 2)}\n`);

  for (const relPath of Object.values(OUTPUTS)) {
    console.log(`Wrote ${relPath}`);
  }
}

function renderReadinessReport(readiness) {
  const lines = [];
  lines.push('# REF-CP6 Remediation And Review Readiness');
  lines.push('');
  lines.push(`Generated: ${readiness.generated_on}`);
  lines.push('');
  lines.push('No CLI mutation authorized. No lesson output mutation authorized. CP-6 not closed. Year 1 not closed.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Active-v5 Book 1 records: ${readiness.summary.active_v5_paragraph_count}`);
  lines.push(`- CP-6 quality-ready records: ${readiness.summary.cp6_quality_ready_count}`);
  lines.push(`- Records with blockers: ${readiness.summary.records_with_blockers_count}`);
  lines.push(`- Placeholder target exercises: ${readiness.summary.placeholder_count}`);
  lines.push(`- Source/lesson topic mismatches: ${readiness.summary.source_lesson_mismatch_count}`);
  lines.push(`- Year-1 backfill candidates: ${readiness.summary.backfill_candidate_count}`);
  lines.push(`- Legacy quality-ref records needing current review routing: ${readiness.summary.legacy_quality_ref_count}`);
  lines.push(`- Remaining Part A FLAG records: ${readiness.summary.part_a_flag_count}`);
  lines.push(`- Planned CP-6 review questions: ${readiness.summary.planned_review_question_count}`);
  lines.push('');
  lines.push('## Decision');
  lines.push('');
  lines.push(`- CP-6 closure status: \`${readiness.summary.cp6_closure_status}\``);
  lines.push(`- Human-review status: \`${readiness.summary.cp6_human_review_status}\``);
  lines.push(`- Recommendation: ${readiness.cp6_decision.recommendation}`);
  lines.push('');
  lines.push('## Decision Lanes');
  lines.push('');
  lines.push('| Lane | Status | Items | Authority required | Stop condition |');
  lines.push('|---|---|---:|---|---|');
  for (const entry of readiness.decision_lanes) {
    lines.push(`| ${md(entry.lane_id)} | ${md(entry.status)} | ${entry.item_count} | ${md(entry.authority_required)} | ${md(entry.stop_condition)} |`);
  }
  lines.push('');
  lines.push('## Required Before Any CP-6 Closure Claim');
  lines.push('');
  for (const item of readiness.cp6_decision.blocked_closure_reasons) {
    lines.push(`- ${item}`);
  }
  lines.push('');
  lines.push('## Blocked Uses');
  lines.push('');
  for (const item of readiness.not_allowed_use) {
    lines.push(`- ${item}`);
  }
  lines.push('');
  lines.push('## Operational Recommendation');
  lines.push('');
  lines.push('Run the formal CP-6 human gate next or deliberately insert a narrower remediation sprint first. Do not mutate protected references, change lesson output, or close CP-6 from this readiness packet alone.');
  lines.push('');
  return `${lines.join('\n').replace(/\n+$/g, '')}\n`;
}

function renderRoutingReport(readiness) {
  const lines = [];
  lines.push('# REF-CP6 Blocker Routing');
  lines.push('');
  lines.push(`Generated: ${readiness.generated_on}`);
  lines.push('');
  lines.push('No CLI mutation authorized. CP-6 not closed. Year 1 not closed.');
  lines.push('');
  lines.push('## Lane Details');
  lines.push('');
  for (const entry of readiness.decision_lanes) {
    lines.push(`### ${entry.lane_id}: ${entry.title}`);
    lines.push('');
    lines.push(`Status: \`${entry.status}\``);
    lines.push('');
    lines.push(`Allowed next action: ${entry.allowed_next_action}`);
    lines.push('');
    lines.push(`Blocked action: ${entry.blocked_action}`);
    lines.push('');
    lines.push('| Item | Detail |');
    lines.push('|---|---|');
    for (const item of entry.items) {
      const itemId = item.paragraph_id || item.gate_id || item.label || 'item';
      const detail = item.flag || item.label || item.target_title || item.review_packet || item.blockers || item.next_review_action || '';
      lines.push(`| ${md(itemId)} | ${md(detail)} |`);
    }
    lines.push('');
  }
  lines.push('## Paragraph Routing');
  lines.push('');
  lines.push('| Paragraph | Target title | Lesson title | Alignment | Status | Routed lanes |');
  lines.push('|---|---|---|---|---|---|');
  for (const record of readiness.paragraph_routes) {
    lines.push(`| ${md(record.paragraph_id)} | ${md(record.target_title)} | ${md(record.lesson_title)} | ${md(record.source_lesson_alignment)} | ${md(record.target_record_status)} | ${md(record.routed_lanes)} |`);
  }
  lines.push('');
  return `${lines.join('\n').replace(/\n+$/g, '')}\n`;
}

function renderReviewPacket(readiness, packet) {
  const lines = [];
  lines.push('# GATE-CP6 Year-1 Paragraph Coverage Review Packet');
  lines.push('');
  lines.push(`Generated: ${readiness.generated_on}`);
  lines.push('');
  lines.push('Status: review packet ready, CP-6 not closed, Year 1 not closed.');
  lines.push('');
  lines.push('No CLI mutation authorized. No protected reference mutation authorized. No lesson output mutation authorized.');
  lines.push('');
  lines.push('## Review Scope');
  lines.push('');
  lines.push('The reviewer should decide how to route Year-1 closure blockers, not whether REF-CP6 already closes Year 1.');
  lines.push('');
  lines.push('Evidence base:');
  lines.push('');
  for (const source of packet.evidence_inputs) {
    lines.push(`- \`${source}\``);
  }
  lines.push('');
  lines.push('## Full Planned Review Questions');
  lines.push('');
  lines.push('The future human review must show this complete list before starting, then ask one question at a time.');
  lines.push('');
  for (const question of packet.review_questions) {
    lines.push(`### ${question.id}: ${question.topic}`);
    lines.push('');
    lines.push(question.question);
    lines.push('');
    lines.push('Options:');
    for (const option of question.options) {
      lines.push(`- ${option}`);
    }
    lines.push('- Open answer / other, with rationale.');
    lines.push('');
  }
  lines.push('## Future Interview Protocol');
  lines.push('');
  for (const step of packet.future_interview_protocol) {
    lines.push(`- ${step}`);
  }
  lines.push('');
  lines.push('## Current Stop Conditions');
  lines.push('');
  lines.push('- Stop CP-6 closure while source/lesson topic mismatches remain unresolved or unaccepted.');
  lines.push('- Stop final coverage while placeholders are unresolved or counted as final target exercises.');
  lines.push('- Stop protected mutation while backfill candidates remain unreviewed.');
  lines.push('- Stop closure while graph-heavy records lack current review evidence.');
  lines.push('- Stop final Year-1 closure while `1.1.3` Part A remains `FLAG` unless a human gate explicitly accepts a conditioned hold.');
  lines.push('- Stop if any review answer attempts to authorize student diagnostics, adaptive routing, mastery, automatic sequencing, student-facing AI, summative use, PV projection, or student-facing output.');
  lines.push('');
  lines.push('## Recommended Next Action');
  lines.push('');
  lines.push('Run a formal CP-6 human-review gate using this packet, or explicitly insert a narrower remediation sprint before that gate. Do not close CP-6 or Year 1 from REF-CP6 alone.');
  lines.push('');
  return `${lines.join('\n').replace(/\n+$/g, '')}\n`;
}

buildArtifacts();
