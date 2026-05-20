#!/usr/bin/env node
/**
 * Build CP.6b target-exercise review artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this script read-only for source references.
 * - Add future review evidence to references/data/sprints or a governed overlay;
 *   do not write back to course-target-exercises here.
 * - If CP-6 human decisions change, update the blocked outcomes and validator
 *   together.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const GENERATED_ON = '2026-05-20';

const TARGET_EXERCISES = 'references/authored/course-target-exercises.json';
const BLUEPRINT = 'references/owned/course-blueprint-v5.md';
const REF_CT1 = 'references/data/sprints/REF-CT1-year1-coverage.json';
const REF_CT2 = 'references/data/sprints/REF-CT2-precision-dual-coding-audit.json';
const CP6A_RECHECK = 'references/data/sprints/CP.6a-lesson-side-recheck.json';
const OUTPUT_JSON = 'references/data/sprints/CP.6b-target-exercise-review.json';
const OUTPUT_MD = 'reports/reference-planning/CP.6b-target-exercise-review.md';

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
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

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function sortParagraphs(records) {
  return records.slice().sort((a, b) => {
    const aa = a.id.split('.').map(Number);
    const bb = b.id.split('.').map(Number);
    for (let i = 0; i < Math.max(aa.length, bb.length); i += 1) {
      const diff = (aa[i] || 0) - (bb[i] || 0);
      if (diff !== 0) return diff;
    }
    return a.id.localeCompare(b.id);
  });
}

function subquestionSummary(record) {
  return (record.target_exercise?.subquestions || []).map((item) => ({
    label: item.label,
    prompt: item.prompt,
  }));
}

function futureArtifactsFor(record) {
  const artifacts = [
    'teacher-learning-quality review of the target exercise against active-v5 lesson goals',
    'operation decomposition into content, calculation, graph/source-reading, reasoning, and answer-writing requirements',
    'required-unit check against the current MTU registry',
    'explicit review artifact before any reviewed_final promotion proposal',
  ];
  if ((record.missing_units_flagged || []).length > 0) {
    artifacts.push('CP.6c classification of missing_units_flagged before final target-exercise closure');
  }
  if (['1.1.3'].includes(record.id)) {
    artifacts.push('CP.6e focused Part A re-review because the paragraph still carries the graph/table Part A flag');
  }
  if (['1.2.1', '1.2.2', '1.2.3', '1.3.1', '1.3.2', '1.3.3'].includes(record.id)) {
    artifacts.push('CP.6d graph-heavy evidence upgrade where the target exercise relies on graph/table reasoning');
  }
  if (['1.3.2', '1.3.3'].includes(record.id)) {
    artifacts.push('post-L-CP6A check that carried lesson-side flags remain visible during any final review');
  }
  return artifacts;
}

function reviewNoteFor(record) {
  const notes = [];
  if ((record.missing_units_flagged || []).length > 0) {
    notes.push('Contains missing-unit flags; CP.6c must classify them before final coverage can be claimed.');
  }
  if (record.required_skills?.length) {
    notes.push(`Current registry required_skills: ${record.required_skills.join(', ')}.`);
  }
  if (record.prior_knowledge_assumed?.length) {
    notes.push(`Assumes prior units: ${record.prior_knowledge_assumed.join(', ')}.`);
  }
  if (record.new_skills_introduced?.length) {
    notes.push(`Introduces units: ${record.new_skills_introduced.join(', ')}.`);
  }
  if (record.id === '1.1.3') {
    notes.push('Graph/table foundation remains coupled to the CP.6e Part A flag.');
  }
  if (record.id === '1.3.2' || record.id === '1.3.3') {
    notes.push('Lesson-side topic alignment is fixed by L-CP6A, but this does not promote the target exercise.');
  }
  return notes;
}

function migratedReviewRecord(record) {
  return {
    paragraph_id: record.id,
    paragraph_title: record.paragraph_title,
    paragraph_kind: record.paragraph_kind,
    source_ref: record.source_ref,
    current_record_status: record.record_status,
    v5_migration: record.v5_migration || null,
    target_exercise: {
      context: record.target_exercise?.context || '',
      subquestions: subquestionSummary(record),
    },
    lesson_goals: record.lesson_goals || [],
    required_skills: record.required_skills || [],
    prior_knowledge_assumed: record.prior_knowledge_assumed || [],
    new_skills_introduced: record.new_skills_introduced || [],
    missing_units_flagged: record.missing_units_flagged || [],
    exam_codes: record.exam_codes || [],
    review_outcome: 'valid_migration_evidence_not_reviewed_final',
    may_promote_to_reviewed_final_now: false,
    may_count_as_final_coverage_claim_now: false,
    registry_mutation_authorized: false,
    required_future_artifacts: futureArtifactsFor(record),
    review_notes: reviewNoteFor(record),
  };
}

const integrationDesigns = {
  '1.1.4': {
    design_id: 'CP.6b-design-1.1.4',
    status: 'draft_integration_design_ready_for_later_teacher_review_not_final',
    paragraph_id: '1.1.4',
    paragraph_title: 'Gemengde opgaven: economisch denken en rekenen',
    introduces_new_theory: false,
    placeholder_finalized: false,
    registry_mutation_authorized: false,
    integrated_prior_paragraphs: ['1.1.1', '1.1.2', '1.1.3'],
    integrated_skills_or_operations: [
      'scarcity and opportunity-cost reasoning',
      'percentage-change and index-number calculation',
      'P-Q table reading and graph drawing',
      'data-claim evaluation',
    ],
    target_exercise: {
      context:
        'A school fundraiser sells healthy lunch boxes. At different prices the expected quantity sold is P=EUR 4 -> Q=180, EUR 5 -> 150, EUR 6 -> 120, EUR 7 -> 90. The student council must choose one price and has only one stand, so choosing one price means giving up the next-best alternative.',
      subquestions: [
        {
          label: 'a',
          prompt:
            'Draw the price-quantity table as a graph with price on the vertical axis and quantity on the horizontal axis.',
        },
        {
          label: 'b',
          prompt:
            'Read or interpolate from your graph: about how many lunch boxes would be sold at EUR 5.50?',
        },
        {
          label: 'c',
          prompt:
            'Calculate the percentage change in quantity sold when the price rises from EUR 4 to EUR 6.',
        },
        {
          label: 'd',
          prompt:
            'The council chooses EUR 6. Explain the opportunity cost of not choosing EUR 5, using the table and your calculation.',
        },
        {
          label: 'e',
          prompt:
            'A poster claims: "A EUR 2 price increase halves sales." Use the table to decide whether that claim is correct.',
        },
      ],
    },
    review_conditions_before_final: [
      'teacher review checks that no new theory beyond 1.1.1-1.1.3 is introduced',
      'answer model makes opportunity cost explicit without introducing revenue/profit theory',
      'graph/table operations are checked against CP.6c/CP.6e outcomes before final registry mutation',
    ],
  },
  '1.2.4': {
    design_id: 'CP.6b-design-1.2.4',
    status: 'draft_integration_design_ready_for_later_teacher_review_not_final',
    paragraph_id: '1.2.4',
    paragraph_title: 'Gemengde opgaven: vraag',
    introduces_new_theory: false,
    placeholder_finalized: false,
    registry_mutation_authorized: false,
    integrated_prior_paragraphs: ['1.2.1', '1.2.2', '1.2.3'],
    integrated_skills_or_operations: [
      'individual willingness-to-pay demand',
      'movement along demand versus demand shift',
      'substitute/complement and normal-good reasoning',
      'horizontal aggregation of individual demand',
    ],
    target_exercise: {
      context:
        'Three students buy smoothies at school. Their maximum willingness to pay differs. At P=EUR 2, Ana wants 3, Bo wants 2, and Cem wants 4 smoothies per week. At P=EUR 3, Ana wants 2, Bo wants 1, and Cem wants 3. At P=EUR 4, Ana wants 1, Bo wants 0, and Cem wants 2.',
      subquestions: [
        {
          label: 'a',
          prompt:
            'Calculate collective demand at each listed price by adding quantities at the same price.',
        },
        {
          label: 'b',
          prompt:
            'Draw the collective demand curve and explain why you add quantities rather than prices.',
        },
        {
          label: 'c',
          prompt:
            'The smoothie price rises from EUR 3 to EUR 4. Is this a movement along the demand curve or a shift? Explain.',
        },
        {
          label: 'd',
          prompt:
            'A nearby juice bar lowers its price. Is that likely to shift demand for school smoothies left or right? Explain with substitute reasoning.',
        },
        {
          label: 'e',
          prompt:
            'Students receive more pocket money and smoothies are treated as a normal good. Show and explain the demand effect.',
        },
      ],
    },
    review_conditions_before_final: [
      'teacher review checks that the aggregate-demand table is solvable for 4-vwo students',
      'CP.6c classifies horizontal-aggregation missing flags before final coverage is claimed',
      'graph-heavy evidence is routed to CP.6d where visual closure is required',
    ],
  },
  '1.3.4': {
    design_id: 'CP.6b-design-1.3.4',
    status: 'draft_integration_design_ready_for_later_teacher_review_not_final',
    paragraph_id: '1.3.4',
    paragraph_title: 'Gemengde opgaven: aanbod en marktevenwicht',
    introduces_new_theory: false,
    placeholder_finalized: false,
    registry_mutation_authorized: false,
    integrated_prior_paragraphs: ['1.3.1', '1.3.2', '1.3.3'],
    integrated_skills_or_operations: [
      'supply factor and supply-shift reasoning',
      'equilibrium calculation by setting demand equal to supply',
      'surplus/shortage reasoning at a non-equilibrium price',
      'new-equilibrium comparison after one or two curve shifts',
    ],
    target_exercise: {
      context:
        'In the market for notebooks, demand is Qv = -2P + 120 and supply is Qa = 3P - 30. A new printing machine increases supply to Qa = 3P - 15. Later, a school campaign also raises demand to Qv = -2P + 140.',
      subquestions: [
        {
          label: 'a',
          prompt:
            'Calculate the original equilibrium price and quantity and mark the point in a graph.',
        },
        {
          label: 'b',
          prompt:
            'At P=EUR 35, determine whether there is a surplus or shortage and calculate its size.',
        },
        {
          label: 'c',
          prompt:
            'Calculate the new equilibrium after only the supply increase. Explain the direction of the shift.',
        },
        {
          label: 'd',
          prompt:
            'Calculate the equilibrium when both the supply increase and demand increase happen.',
        },
        {
          label: 'e',
          prompt:
            'Explain which direction quantity changes in the simultaneous-shift case, and why the price direction cannot always be predicted without the numbers.',
        },
      ],
    },
    review_conditions_before_final: [
      'teacher review checks that the target stays within supply, demand, equilibrium, and shifts',
      'costs/revenue/marginal-analysis theory remains out of active-v5 Book 1',
      'CP.6c classifies surplus/shortage and simultaneous-shift missing flags before final coverage is claimed',
      'CP.6d graph-heavy evidence is required before CP-6 closure uses this record',
    ],
  },
};

function designReviewRecord(record) {
  const design = integrationDesigns[record.id];
  return {
    source_placeholder_record: {
      paragraph_id: record.id,
      paragraph_title: record.paragraph_title,
      current_record_status: record.record_status,
      placeholder_reason: record.placeholder_reason || null,
      source_ref: record.source_ref,
      target_exercise_placeholder: Boolean(record.target_exercise?.placeholder),
    },
    ...design,
    review_outcome: 'draft_design_not_reviewed_final',
    may_promote_to_reviewed_final_now: false,
    may_count_as_final_coverage_claim_now: false,
  };
}

function formatList(items) {
  if (!items || items.length === 0) return 'none';
  return items.join(', ');
}

function markdownFor(data) {
  const migratedRows = data.migrated_records
    .map((record) => {
      const missing = record.missing_units_flagged.length;
      return `| ${record.paragraph_id} | ${record.paragraph_title} | ${record.current_record_status} | ${missing} | ${record.review_outcome} | no |`;
    })
    .join('\n');

  const placeholderRows = data.integration_target_exercise_designs
    .map((design) => {
      return `| ${design.paragraph_id} | ${design.paragraph_title} | ${design.status} | ${design.integrated_prior_paragraphs.join(', ')} | no |`;
    })
    .join('\n');

  const migratedDetails = data.migrated_records
    .map((record) => {
      return `### ${record.paragraph_id} - ${record.paragraph_title}

Status: \`${record.current_record_status}\`

Review outcome: \`${record.review_outcome}\`

Target context: ${record.target_exercise.context}

Required skills: ${formatList(record.required_skills)}

Missing-unit flags: ${record.missing_units_flagged.length ? record.missing_units_flagged.map((flag) => `\`${flag}\``).join('; ') : 'none'}

Required before final review:

${record.required_future_artifacts.map((item) => `- ${item}`).join('\n')}
`;
    })
    .join('\n');

  const designDetails = data.integration_target_exercise_designs
    .map((design) => {
      const subquestions = design.target_exercise.subquestions
        .map((item) => `- ${item.label}. ${item.prompt}`)
        .join('\n');
      return `### ${design.paragraph_id} - ${design.paragraph_title}

Status: \`${design.status}\`

Review outcome: \`${design.review_outcome}\`

Integrated prior paragraphs: ${design.integrated_prior_paragraphs.join(', ')}

Operations: ${design.integrated_skills_or_operations.join('; ')}

Context: ${design.target_exercise.context}

Subquestions:

${subquestions}

Review conditions before final:

${design.review_conditions_before_final.map((item) => `- ${item}`).join('\n')}
`;
    })
    .join('\n');

  return `# CP.6b Year-1 Target-Exercise Review

Generated: ${data.generated_on}

Status: ${data.status}

CP-6 not closed. Year 1 not closed. No protected reference mutation, lesson-output mutation, target-exercise promotion, placeholder finalization, or unit minting occurred.

## Summary

| Metric | Count |
|---|---:|
| Active-v5 Book 1 target-exercise records | ${data.summary.book1_record_count} |
| Migrated records needing v5 review | ${data.summary.migrated_needs_review_count} |
| Placeholder records needing integration design/review | ${data.summary.placeholder_needs_review_count} |
| Reviewed-final records | ${data.summary.reviewed_final_count} |
| Draft integration designs recorded | ${data.summary.integration_design_count} |
| Records promoted in CP.6b | ${data.summary.records_promoted_count} |

## Decision

CP.6b records a target-exercise review/design packet only. The nine migrated records remain valid migration evidence but are not \`reviewed_final\`. The three gemengde-opgaven records now have draft integration designs for later teacher-learning-quality review, but the placeholders are not finalized in the registry.

The next operational sprint is \`${data.next_operational_sprint}\`.

## Migrated Records

| Paragraph | Title | Current status | Missing flags | Review outcome | Promote now |
|---|---|---|---:|---|---|
${migratedRows}

${migratedDetails}

## Gemengde-Opgaven Draft Designs

| Paragraph | Title | Draft status | Integrated prior paragraphs | Finalized now |
|---|---|---|---|---|
${placeholderRows}

${designDetails}

## Remaining Blockers

${data.remaining_blockers.map((item) => `- ${item}`).join('\n')}

## Blocked Outcomes

${data.blocked_outcomes.map((item) => `- ${item}`).join('\n')}

## Next Operational Step

Proceed to \`${data.next_operational_sprint} Year-1 MTU Backfill Classification\`. Do not draft a CP-6 closure proposal yet.
`;
}

const targetExercises = readJson(TARGET_EXERCISES);
const refCt1 = readJson(REF_CT1);
const refCt2 = readJson(REF_CT2);
const cp6aRecheck = readJson(CP6A_RECHECK);

const book1 = sortParagraphs(targetExercises.exercises.filter((record) => record.module === 1));
const migrated = book1.filter((record) => record.record_status === 'migrated_from_v4_needs_v5_review');
const placeholders = book1.filter((record) => record.record_status === 'placeholder_needs_review');
const reviewedFinal = book1.filter((record) => record.record_status === 'reviewed_final');

const data = {
  schema_version: 1,
  sprint_id: 'CP.6b',
  generated_on: GENERATED_ON,
  generated_by: 'build-scripts/references/build-cp6b-target-exercise-review.js',
  status: 'target_exercise_review_recorded_not_final',
  authority_level: 'non_mutating_year1_target_exercise_review',
  cp6_closed: false,
  year1_closed: false,
  protected_reference_data_changed: false,
  lesson_output_changed: false,
  target_exercise_promotions: false,
  placeholder_finalization: false,
  unit_minting: false,
  no_protected_mutation_authorized: true,
  no_lesson_output_mutation_authorized: true,
  no_target_exercise_promotion_authorized: true,
  no_placeholder_finalization_authorized: true,
  no_unit_minting_authorized: true,
  source_paths: {
    target_exercises: TARGET_EXERCISES,
    blueprint: BLUEPRINT,
    ref_ct1: REF_CT1,
    ref_ct2: REF_CT2,
    cp6a_recheck: CP6A_RECHECK,
  },
  repository_state: {
    platform_head_before_cp6b_commit: git('git rev-parse HEAD'),
    lesson_head_at_generation: git('git -C ..\\4veco-lessen rev-parse HEAD'),
  },
  summary: {
    book1_record_count: book1.length,
    migrated_needs_review_count: migrated.length,
    placeholder_needs_review_count: placeholders.length,
    reviewed_final_count: reviewedFinal.length,
    integration_design_count: placeholders.length,
    records_promoted_count: 0,
    placeholders_finalized_count: 0,
    ref_ct1_missing_flag_count: refCt1.summary?.book1_missing_flag_count || 0,
    ref_ct2_cp6_quality_ready_count: refCt2.summary?.cp6_quality_ready_count || 0,
    cp6a_lesson_mismatch_resolved: cp6aRecheck.source_lesson_mismatch_resolved_for_cp6a === true,
  },
  decision: {
    status: 'non_final_review_packet_ready',
    final_year1_coverage_allowed_now: false,
    cp6_closure_allowed_now: false,
    registry_mutation_allowed_now: false,
    note:
      'CP.6b records review/design evidence only; later review and governed mutation are required before any reviewed_final or final coverage claim.',
  },
  migrated_records: migrated.map(migratedReviewRecord),
  integration_target_exercise_designs: placeholders.map(designReviewRecord),
  remaining_blockers: [
    'Nine migrated Book 1 target-exercise records still need explicit v5 review artifacts before any reviewed_final promotion proposal.',
    'Three gemengde-opgaven draft designs still need teacher-learning-quality review and governed registry-update procedure before placeholders can be replaced.',
    'CP.6c must classify the nine Year-1 MTU backfill candidates before any unit mutation or final target-exercise closure uses them.',
    'CP.6d must upgrade graph-heavy evidence where graph/table-heavy records are used for CP-6 closure evidence.',
    'CP.6e must clear or explicitly fail the remaining 1.1.3 Part A FLAG before unconditioned CP-6 closure.',
  ],
  blocked_outcomes: [
    'protected reference mutation',
    'lesson output mutation',
    'target-exercise promotion',
    'placeholder replacement',
    'placeholder finalization',
    'unit minting',
    'CP-6 closure',
    'Year-1 closure',
    'student diagnostics',
    'adaptive routing',
    'mastery decisions',
    'automatic sequencing',
    'student-facing AI',
    'summative use',
    'PV projection',
    'PV machine promotion',
    'student-facing generated output',
  ],
  next_operational_sprint: 'CP.6c',
};

writeJson(OUTPUT_JSON, data);
writeText(OUTPUT_MD, markdownFor(data));

console.log(`Wrote ${OUTPUT_JSON}`);
console.log(`Wrote ${OUTPUT_MD}`);
