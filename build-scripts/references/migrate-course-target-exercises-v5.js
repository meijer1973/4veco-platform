#!/usr/bin/env node
/**
 * L1.5Q Phase A migration seam.
 *
 * This script preserves the v4 target-exercise registry, creates a v5 owned
 * blueprint scaffold, and moves the stable active target-exercise path to v5.
 * It does not claim that placeholder records are pedagogically reviewed final.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const LESSON_REPO_ROOT = path.resolve(REPO_ROOT, '..', '4veco-lessen');
const TARGET_PATH = 'references/authored/course-target-exercises.json';
const ARCHIVE_PATH = 'references/authored/archive/course-target-exercises-v4.json';
const PLATFORM_BLUEPRINT_PATH = 'references/owned/course-blueprint-v5.md';
const PLATFORM_META_PATH = 'references/owned/course-blueprint-v5.meta.json';
const LESSON_BLUEPRINT_PATH = 'course_blueprint_v5.md';
const ACTIVE_BLUEPRINT_SOURCE = PLATFORM_BLUEPRINT_PATH;

const EXPECTED_COUNTS = { 1: 12, 2: 12, 3: 14, 4: 16 };

const V5_PLAN = [
  { id: '1.1.1', title: 'Schaarste en economisch denken', from: '1.1.1' },
  { id: '1.1.2', title: 'Percentages en indexcijfers', from: '1.1.2' },
  { id: '1.1.3', title: 'Grafieken en tabellen', from: '1.1.3' },
  { id: '1.1.4', title: 'Gemengde opgaven: economisch denken en rekenen', kind: 'gemengde_opgaven' },
  { id: '1.2.1', title: 'Individuele vraag', from: '1.2.1' },
  { id: '1.2.2', title: 'Vraagfactoren', from: '1.2.2' },
  { id: '1.2.3', title: 'Van individuele naar collectieve vraag', from: '1.2.3' },
  { id: '1.2.4', title: 'Gemengde opgaven: vraag', kind: 'gemengde_opgaven' },
  { id: '1.3.1', title: 'Aanbod', from: '1.3.1' },
  { id: '1.3.2', title: 'Marktevenwicht', from: '1.4.1' },
  { id: '1.3.3', title: 'Verschuivingen en nieuw evenwicht', from: '1.4.2' },
  { id: '1.3.4', title: 'Gemengde opgaven: aanbod en marktevenwicht', kind: 'gemengde_opgaven' },

  { id: '2.1.1', title: 'Kostenstructuren', from: '1.3.2' },
  { id: '2.1.2', title: 'Opbrengsten, winst en break-even', from: '1.3.3' },
  { id: '2.1.3', title: 'Marginale kosten en marginale opbrengsten', from: '1.4.3' },
  { id: '2.1.4', title: 'Gemengde opgaven: kosten en opbrengsten', kind: 'gemengde_opgaven' },
  { id: '2.2.1', title: 'Prijselasticiteit', from: '2.1.1' },
  { id: '2.2.2', title: 'Elasticiteit en omzet', from: '2.1.2' },
  { id: '2.2.3', title: 'Inkomenselasticiteit en kruiselingse elasticiteit', from: '2.1.3' },
  { id: '2.2.4', title: 'Gemengde opgaven: elasticiteit', kind: 'gemengde_opgaven' },
  { id: '2.3.1', title: 'Consumentensurplus', from: '2.2.1' },
  { id: '2.3.2', title: 'Producentensurplus en totaal surplus', from: '2.2.2' },
  { id: '2.3.3', title: 'Pareto-efficientie en welvaartsverlies', from: '2.2.3' },
  { id: '2.3.4', title: 'Gemengde opgaven: surplus en welvaart', kind: 'gemengde_opgaven' },

  { id: '3.1.1', title: 'Belastingen: wig en nieuw evenwicht', from: '2.3.1' },
  { id: '3.1.2', title: 'Belastingdruk en welvaartsverlies', from: '2.3.2' },
  { id: '3.1.3', title: 'Subsidies', from: '2.3.3' },
  { id: '3.1.4', title: 'Maximumprijs', from: '2.4.1' },
  { id: '3.1.5', title: 'Minimumprijs en quota', from: '2.4.2', related_v4_ids: ['2.4.3'] },
  { id: '3.1.6', title: 'Gemengde opgaven: overheidsingrijpen', kind: 'gemengde_opgaven' },
  { id: '3.2.1', title: 'Volkomen concurrentie: kenmerken', from: '3.1.1' },
  { id: '3.2.2', title: 'Winstmaximalisatie bij volkomen concurrentie', from: '3.1.2', related_v4_ids: ['1.4.4'] },
  { id: '3.2.3', title: 'Langetermijnevenwicht', from: '3.1.3' },
  { id: '3.2.4', title: 'Gemengde opgaven: volkomen concurrentie', kind: 'gemengde_opgaven' },
  { id: '3.3.1', title: 'Monopolie: kenmerken', from: '3.2.1' },
  { id: '3.3.2', title: 'Marginale opbrengst bij monopolie', from: '3.2.2' },
  { id: '3.3.3', title: 'Winstmaximalisatie bij monopolie', from: '3.2.3' },
  { id: '3.3.4', title: 'Gemengde opgaven: monopolie', kind: 'gemengde_opgaven' },

  { id: '4.1.1', title: 'Welvaartseffecten van monopolie', from: '3.3.1' },
  { id: '4.1.2', title: 'Prijsdiscriminatie', from: '3.3.2' },
  { id: '4.1.3', title: 'Marktvormen vergelijken', from: '3.3.3' },
  { id: '4.1.4', title: 'Negatieve externe effecten', from: '3.4.1' },
  { id: '4.1.5', title: 'Positieve externe effecten', from: '3.4.2' },
  { id: '4.1.6', title: 'Overheidsingrijpen bij marktfalen', from: '3.4.3' },
  { id: '4.1.7', title: 'Gemengde opgaven: marktvormen en marktfalen', kind: 'gemengde_opgaven' },
  { id: '4.2.1', title: 'Arbeidsvraag', from: '4.1.1' },
  { id: '4.2.2', title: 'Arbeidsaanbod en participatie', from: '4.1.2' },
  { id: '4.2.3', title: 'Evenwicht op de arbeidsmarkt', from: '4.1.3' },
  { id: '4.2.4', title: 'Werkloosheid', from: '4.2.1' },
  { id: '4.2.5', title: 'Minimumloon', from: '4.2.2' },
  { id: '4.2.6', title: 'Vakbonden, cao en arbeidsmarktbeleid', from: '4.2.3' },
  { id: '4.2.7', title: 'Gemengde opgaven: arbeidsmarkt', kind: 'gemengde_opgaven' },
  { id: '4.3.1', title: 'Absolute en comparatieve voordelen', from: '4.3.1' },
  { id: '4.3.2', title: 'Ruilwinst en ruilvoet', from: '4.3.2' },
];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function lessonPath(relPath) {
  return path.join(LESSON_REPO_ROOT, relPath);
}

function readJson(fullPath) {
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

function writeJson(fullPath, data) {
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(fullPath, text) {
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, text);
}

function parseId(id) {
  const parts = String(id).split('.').map((part) => Number(part));
  return { module: parts[0], chapter: parts[1], paragraph: parts[2] };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function placeholderExercise(item) {
  const isMixed = item.kind === 'gemengde_opgaven';
  return {
    placeholder: true,
    context: isMixed
      ? `Placeholder for ${item.id}: integrated practice across this chapter. It consolidates earlier theory and introduces no new theory.`
      : `Placeholder for ${item.id}: target exercise still needs v5 review after curriculum resequencing.`,
    subquestions: [
      {
        label: 'a',
        prompt: isMixed
          ? 'Combine at least two earlier skills from this chapter in one exam-style context.'
          : 'Replace this placeholder with a reviewed target exercise before classroom-scale production.',
      },
    ],
  };
}

function buildRecord(item, oldById) {
  const parts = parseId(item.id);
  const source = item.from ? oldById.get(item.from) : null;
  const isMixed = item.kind === 'gemengde_opgaven';
  const record = source ? clone(source) : {
    difficulty: isMixed ? 'MIXED' : 'PLACEHOLDER',
    target_exercise: placeholderExercise(item),
    lesson_goals: isMixed
      ? [`Consolidate and transfer the chapter skills for ${item.title}.`]
      : [`Define the final v5 learning target for ${item.title}.`],
    required_skills: [],
    prior_knowledge_assumed: [],
    new_skills_introduced: [],
    missing_units_flagged: ['v5_placeholder_needs_review'],
    exam_codes: [],
    difficulty_notes: isMixed
      ? 'Count-bearing consolidation paragraph. It introduces no new theory and needs a reviewed integration target exercise.'
      : 'Placeholder created during L1.5Q Phase A. Must be reviewed before final curriculum-quality claims.',
  };

  record.id = item.id;
  record.module = parts.module;
  record.chapter = parts.chapter;
  record.paragraph = parts.paragraph;
  record.paragraph_title = item.title;
  record.paragraph_kind = isMixed ? 'gemengde_opgaven' : 'theory';
  record.introduces_new_theory = !isMixed;
  record.record_status = source ? 'migrated_from_v4_needs_v5_review' : 'placeholder_needs_review';
  if (!source) record.placeholder_reason = isMixed
    ? 'Gemengde-opgaven target exercise must be designed as integration/transfer practice.'
    : 'No reviewed v5 target exercise exists yet.';
  if (source && item.related_v4_ids) {
    record.placeholder_reason = `Merged or related v4 records require review: ${item.related_v4_ids.join(', ')}.`;
  }
  if (source && !record.target_exercise) record.target_exercise = placeholderExercise(item);
  if (!source && record.target_exercise) record.target_exercise.placeholder = true;
  record.source_ref = `${ACTIVE_BLUEPRINT_SOURCE} §${item.id}`;
  record.v5_migration = {
    source_status: record.record_status,
    from_v4_id: item.from || null,
    related_v4_ids: item.related_v4_ids || [],
    review_required_before_final: record.record_status !== 'reviewed_final',
  };
  return record;
}

function buildRegistry(v4) {
  const oldById = new Map((v4.exercises || []).map((record) => [record.id, record]));
  const exercises = V5_PLAN.map((item) => buildRecord(item, oldById));
  return {
    schema_version: 1,
    blueprint_version: 'v5',
    blueprint_source: ACTIVE_BLUEPRINT_SOURCE,
    expected_count_bearing_paragraphs: EXPECTED_COUNTS,
    total_count_bearing_paragraphs: 54,
    test_preparation_policy: {
      status: 'web_only',
      count_bearing: false,
      printed_chapter: false,
      formal_test_scope: 'one formal test week per book',
    },
    archive_of_previous_active_registry: ARCHIVE_PATH,
    _schema_doc: {
      paragraph_kind: 'theory or gemengde_opgaven. Gemengde-opgaven records are count-bearing but introduce no new theory.',
      introduces_new_theory: 'False for gemengde_opgaven; true for theory paragraphs unless a future review says otherwise.',
      record_status: 'reviewed_final, migrated_from_v4_needs_v5_review, or placeholder_needs_review.',
      placeholder_rule: 'Placeholders are valid for Phase A source-of-truth migration but cannot be treated as final reviewed target exercises.',
    },
    exercises,
  };
}

function rowsByBook() {
  const grouped = new Map();
  for (const item of V5_PLAN) {
    const book = parseId(item.id).module;
    if (!grouped.has(book)) grouped.set(book, []);
    grouped.get(book).push(item);
  }
  return grouped;
}

function buildBlueprintMarkdown() {
  const lines = [];
  lines.push('# Course Blueprint v5 - Four Test-Week Book Plan');
  lines.push('');
  lines.push('Status: L1.5Q Phase B curriculum-source version');
  lines.push('Version: v5');
  lines.push('Active target-exercise registry: `references/authored/course-target-exercises.json`');
  lines.push('');
  lines.push('## Purpose');
  lines.push('');
  lines.push('This blueprint is the active curriculum-source document for the 2026/27 planning model. It replaces the v4 assumption that each book has four theory chapters plus a printed test-preparation chapter. The target-exercise registry remains the stronger exercise-first source of truth; this prose explains the book structure, test-week model, migration decisions, and boundaries for future production.');
  lines.push('');
  lines.push('## Core Decisions');
  lines.push('');
  lines.push('- Each formal test week corresponds to one book.');
  lines.push('- Student-facing message: the test is about this book.');
  lines.push('- Test-preparation packages are web-only and are not printed chapters.');
  lines.push('- Optional mid-book checks may exist as formative web diagnostics or quizzes.');
  lines.push('- Count-bearing paragraphs include theory paragraphs and gemengde-opgaven paragraphs.');
  lines.push('- Gemengde-opgaven paragraphs introduce no new theory; they consolidate and transfer.');
  lines.push('- Target-exercise placeholders are allowed during migration, but they are not reviewed-final learning-quality evidence.');
  lines.push('');
  lines.push('## What Changed From v4');
  lines.push('');
  lines.push('| v4 assumption | v5 decision |');
  lines.push('| --- | --- |');
  lines.push('| Every book has a printed Chapter 5 for test preparation. | Test preparation is web-only and outside the printed paragraph count. |');
  lines.push('| Each book has two formal test moments. | Each formal test week maps to exactly one book. Optional checks are formative only. |');
  lines.push('| Book 1 included costs, revenue, marginal analysis, and test preparation. | Book 1 print scope is 12 paragraphs: foundations, demand, supply, equilibrium, shifts. |');
  lines.push('| Consolidation/gemengde-opgaven paragraphs were not target-exercise records. | They are count-bearing v5 curriculum units with explicit no-new-theory records. |');
  lines.push('| v4 target-exercise registry had 49 records. | v5 target-exercise registry has 54 count-bearing records. |');
  lines.push('');
  lines.push('## Book Counts');
  lines.push('');
  lines.push('| Book | Count-bearing paragraphs | Formal test-week scope |');
  lines.push('| --- | ---: | --- |');
  lines.push('| Book 1 | 12 | Test week 1: Book 1 |');
  lines.push('| Book 2 | 12 | Test week 2: Book 2 |');
  lines.push('| Book 3 | 14 | Test week 3: Book 3 |');
  lines.push('| Book 4 | 16 | Test week 4: Book 4 |');
  lines.push('');
  lines.push('These counts are guarded by `scripts/check-course-target-exercises-v5.js`. The checker also verifies that test preparation is web-only and that placeholders are visibly non-final.');
  lines.push('');
  lines.push('## Book-Level Intent');
  lines.push('');
  lines.push('### Book 1 - Grondslagen, vraag en aanbod');
  lines.push('');
  lines.push('Book 1 becomes the lean opening book for the first formal test week. It teaches economic thinking, percentages/index numbers, graph/table reading, demand, supply, equilibrium, and shifts. Costs, revenue, and marginal analysis are deliberately excluded from the printed Book 1 scope so the first book is realistic for the publisher and the classroom calendar.');
  lines.push('');
  lines.push('### Book 2 - Kosten, opbrengsten, elasticiteit en surplus');
  lines.push('');
  lines.push('Book 2 absorbs the Book 1 production material that was cut from print: costs, revenue, break-even, and marginal concepts. It then moves into elasticity and surplus/welfare foundations. This preserves prerequisite order before government intervention and market structures.');
  lines.push('');
  lines.push('### Book 3 - Overheidsingrijpen en marktvormen');
  lines.push('');
  lines.push('Book 3 carries taxes, subsidies, price controls, quotas, volkomen concurrentie, and monopoly. It is the main procedural/diagrammatic book after students have the calculation and surplus foundations from Book 2.');
  lines.push('');
  lines.push('### Book 4 - Marktfalen, arbeidsmarkt en internationale handel');
  lines.push('');
  lines.push('Book 4 contains market-failure extensions, labour-market material, and a limited trade block. Inflation/CPI and late macro content are parked for a later-year macro scope and are not count-bearing in v5.');
  lines.push('');
  lines.push('## Migration Notes');
  lines.push('');
  lines.push('- Book 1 follows the L1.5P print scope: 12 paragraphs, no printed test-preparation chapter.');
  lines.push('- Book 1 cost, revenue, and marginal-analysis material is moved to later books rather than deleted.');
  lines.push('- Government intervention, monopoly, and market failure are shifted forward.');
  lines.push('- Inflation and late macro material are parked for a later year and are not count-bearing in v5.');
  lines.push('- Protectionism beyond the two retained trade paragraphs is parked until the trade/macro boundary is reviewed.');
  lines.push('');
  lines.push('## Target-Exercise Record Status');
  lines.push('');
  lines.push('| Status | Meaning | Closure boundary |');
  lines.push('| --- | --- | --- |');
  lines.push('| `migrated_from_v4_needs_v5_review` | Existing v4 target exercise reused or renumbered into v5. | Valid migration evidence; not yet a final v5 quality review. |');
  lines.push('| `placeholder_needs_review` | New or consolidation record created so the count-bearing unit is explicit. | Cannot be treated as reviewed final; needs future teacher-learning-quality review. |');
  lines.push('| `reviewed_final` | Reserved for target exercises that pass a later quality review. | Not used by this migration unless explicitly reviewed. |');
  lines.push('');
  lines.push('The full target-exercise distribution audit is deferred to L2.4-TEA. L1.5Q may close with placeholders only because the placeholders are visible and mechanically checked.');
  lines.push('');
  lines.push('## Table Of Contents');
  lines.push('');
  const grouped = rowsByBook();
  for (const [book, items] of [...grouped.entries()].sort((a, b) => a[0] - b[0])) {
    lines.push(`### Book ${book}`);
    lines.push('');
    lines.push('| Paragraph | Kind | Title | Status |');
    lines.push('| --- | --- | --- | --- |');
    for (const item of items) {
      const kind = item.kind === 'gemengde_opgaven' ? 'gemengde_opgaven' : 'theory';
      const status = item.from ? 'migrated_from_v4_needs_v5_review' : 'placeholder_needs_review';
      lines.push(`| ${item.id} | ${kind} | ${item.title} | ${status} |`);
    }
    lines.push('');
  }
  lines.push('## Paragraph Anchors');
  lines.push('');
  for (const item of V5_PLAN) {
    lines.push(`### \u00a7${item.id} - ${item.title}`);
    lines.push('');
    if (item.kind === 'gemengde_opgaven') {
      lines.push('Count-bearing gemengde-opgaven paragraph. Introduces no new theory; requires a reviewed integration target exercise before final curriculum-quality claims.');
    } else if (item.from) {
      lines.push(`Migrated from v4 target exercise \u00a7${item.from}. Needs v5 review before it can be marked reviewed_final.`);
    } else {
      lines.push('Placeholder paragraph. Needs v5 review before it can be marked reviewed_final.');
    }
    lines.push('');
  }
  lines.push('## Web-Only Test Preparation');
  lines.push('');
  lines.push('Test preparation remains available online as a package per book. It is not a printed chapter and does not count toward 12/12/14/16. The printed student message should remain simple: the formal test is about this book.');
  lines.push('');
  lines.push('## Future Quality Work');
  lines.push('');
  lines.push('- L1.6 should use this v5 source path when proving the next fresh paragraph pipeline.');
  lines.push('- Book 2 Part A should not start until this v5 source path is accepted as the active curriculum baseline.');
  lines.push('- L2.4-TEA remains the later target-exercise distribution audit after MTU quality and companion-review instruments mature.');
  lines.push('');
  return `${lines.join('\n')}`;
}

function buildMeta() {
  return {
    source_id: 'owned:course-blueprint-v5',
    title: 'Course Blueprint v5',
    path: PLATFORM_BLUEPRINT_PATH,
    source_type: 'course_blueprint',
    authority_level: 'owned_curriculum_design',
    completion_status: 'phase_b_curriculum_source',
    canonical_owned_source: true,
    supersedes: 'owned:course-blueprint-v4',
    origin_path: 'course_blueprint_v4.md',
    active_target_exercise_registry: TARGET_PATH,
    paragraph_counts: EXPECTED_COUNTS,
    total_count_bearing_paragraphs: 54,
    test_preparation_policy: {
      status: 'web_only',
      count_bearing: false,
      printed_chapter: false,
    },
    allowed_use: [
      'rag_retrieval',
      'course_design',
      'target_exercise_alignment',
      'owned_source_projection',
      'paragraph_and_chapter_planning',
    ],
    not_allowed_use: [
      'external_authority',
      'automatic_unit_minting_from_prose',
      'overriding_reviewed_machine_references',
      'overriding_external_exam_or_syllabus_authority',
      'treating_placeholders_as_reviewed_final',
    ],
    authority_notes: [
      'v5 is the active curriculum source after L1.5Q.',
      'Target exercises are the active exercise-first source of truth.',
      'Blueprint prose is contextual and design-oriented; it is not sufficient by itself to mint or mutate machine units.',
      'Placeholder records are explicit and must not be treated as reviewed final target exercises.',
    ],
  };
}

function main() {
  const targetFull = repoPath(TARGET_PATH);
  const archiveFull = repoPath(ARCHIVE_PATH);
  const current = readJson(targetFull);
  const v4 = current.blueprint_version === 'v4'
    ? current
    : readJson(archiveFull);

  if (!fs.existsSync(archiveFull)) {
    writeJson(archiveFull, v4);
  }

  const registry = buildRegistry(v4);
  writeJson(targetFull, registry);
  const blueprint = buildBlueprintMarkdown();
  writeText(repoPath(PLATFORM_BLUEPRINT_PATH), blueprint);
  writeJson(repoPath(PLATFORM_META_PATH), buildMeta());
  writeText(lessonPath(LESSON_BLUEPRINT_PATH), blueprint);

  console.log(`Archived v4 target exercises at ${ARCHIVE_PATH}`);
  console.log(`Wrote active v5 target exercises: ${registry.exercises.length} records`);
  console.log(`Wrote ${PLATFORM_BLUEPRINT_PATH}`);
  console.log(`Wrote ${PLATFORM_META_PATH}`);
  console.log(`Wrote lesson ${LESSON_BLUEPRINT_PATH}`);
}

if (require.main === module) main();

module.exports = {
  EXPECTED_COUNTS,
  V5_PLAN,
  buildRegistry,
  buildBlueprintMarkdown,
};
