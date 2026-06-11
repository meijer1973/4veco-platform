'use strict';

const { validate } = require('../check-course-target-exercises-v5');

function record(id, overrides = {}) {
  const [module, chapter, paragraph] = id.split('.').map(Number);
  const kind = overrides.paragraph_kind || 'theory';
  const status = overrides.record_status || 'migrated_from_v4_needs_v5_review';
  const base = {
    id,
    module,
    chapter,
    paragraph,
    paragraph_title: `Paragraph ${id}`,
    paragraph_kind: kind,
    introduces_new_theory: kind !== 'gemengde_opgaven',
    record_status: status,
    target_exercise: status === 'placeholder_needs_review'
      ? { placeholder: true, context: 'Placeholder', subquestions: [] }
      : kind === 'gemengde_opgaven'
        ? {
          context: 'Reviewed mixed transfer context where students select sources, calculate values, interpret a table or graph, and write an economic conclusion.',
          subquestions: [
            { label: 'a', prompt: 'Select the relevant source information.' },
            { label: 'b', prompt: 'Calculate the required totals and averages.' },
            { label: 'c', prompt: 'Interpret the table or graph.' },
            { label: 'd', prompt: 'Write an economic conclusion.' },
          ],
        }
        : { context: 'Migrated', subquestions: [] },
    placeholder_reason: status === 'placeholder_needs_review' ? 'Needs review.' : undefined,
    source_ref: `references/owned/course-blueprint-v5.md §${id}`,
    v5_migration: {
      source_status: status,
      review_required_before_final: status !== 'reviewed_final',
    },
  };
  if (kind === 'gemengde_opgaven' && status === 'reviewed_final') {
    base.mixed_target_profile = {
      integrates_paragraphs: ['2.1.1', '2.1.2'],
      source_selection_required: true,
      answer_construction_required: true,
      table_or_graph_interpretation_required: true,
      no_new_theory: true,
    };
  }
  return {
    ...base,
    ...overrides,
  };
}

function validData() {
  const ids = [
    '1.1.1', '1.1.2', '1.1.3', '1.1.4', '1.2.1', '1.2.2', '1.2.3', '1.2.4', '1.3.1', '1.3.2', '1.3.3', '1.3.4',
    '2.1.1', '2.1.2', '2.1.3', '2.1.4', '2.2.1', '2.2.2', '2.2.3', '2.2.4', '2.3.1', '2.3.2', '2.3.3', '2.3.4',
    '3.1.1', '3.1.2', '3.1.3', '3.1.4', '3.1.5', '3.1.6', '3.2.1', '3.2.2', '3.2.3', '3.2.4', '3.3.1', '3.3.2', '3.3.3', '3.3.4',
    '4.1.1', '4.1.2', '4.1.3', '4.1.4', '4.1.5', '4.1.6', '4.1.7', '4.2.1', '4.2.2', '4.2.3', '4.2.4', '4.2.5', '4.2.6', '4.2.7', '4.3.1', '4.3.2',
  ];
  const mixed = new Set(['1.1.4', '1.2.4', '1.3.4', '2.1.4', '2.2.4', '2.3.4', '3.1.6', '3.2.4', '3.3.4', '4.1.7', '4.2.7']);
  return {
    schema_version: 1,
    blueprint_version: 'v5',
    blueprint_source: 'references/owned/course-blueprint-v5.md',
    test_preparation_policy: { status: 'web_only', count_bearing: false },
    exercises: ids.map((id) => mixed.has(id)
      ? record(id, { paragraph_kind: 'gemengde_opgaven', introduces_new_theory: false, record_status: 'placeholder_needs_review', placeholder_reason: 'Mixed needs review.' })
      : record(id)),
  };
}

describe('check-course-target-exercises-v5', () => {
  test('accepts exact 12/12/14/16 v5 target records', () => {
    expect(validate(validData())).toEqual([]);
  });

  test('rejects stale v4 blueprint source', () => {
    const data = validData();
    data.blueprint_version = 'v4';
    data.blueprint_source = 'references/owned/course-blueprint-v4.md';
    data.exercises[0].source_ref = 'references/owned/course-blueprint-v4.md §1.1.1';
    const errors = validate(data).join('\n');
    expect(errors).toContain('blueprint_version must be v5');
    expect(errors).toContain('blueprint_source must be references/owned/course-blueprint-v5.md');
    expect(errors).toContain('stale v4 source_ref');
  });

  test('accepts reviewed-final mixed targets that meet the standard', () => {
    const data = validData();
    const mixed = data.exercises.find((exercise) => exercise.id === '2.1.4');
    Object.assign(mixed, record('2.1.4', {
      paragraph_kind: 'gemengde_opgaven',
      introduces_new_theory: false,
      record_status: 'reviewed_final',
    }));
    expect(validate(data)).toEqual([]);
  });

  test('rejects hidden final placeholders', () => {
    const data = validData();
    const mixed = data.exercises.find((exercise) => exercise.id === '1.1.4');
    mixed.record_status = 'reviewed_final';
    delete mixed.placeholder_reason;
    const errors = validate(data).join('\n');
    expect(errors).toContain('reviewed_final gemengde_opgaven requires a non-placeholder target_exercise');
  });

  test('rejects reviewed-final mixed targets without profile proof', () => {
    const data = validData();
    const mixed = data.exercises.find((exercise) => exercise.id === '2.1.4');
    Object.assign(mixed, record('2.1.4', {
      paragraph_kind: 'gemengde_opgaven',
      introduces_new_theory: false,
      record_status: 'reviewed_final',
    }));
    delete mixed.mixed_target_profile;
    const errors = validate(data).join('\n');
    expect(errors).toContain('reviewed_final gemengde_opgaven requires mixed_target_profile');
  });

  test('rejects wrong book counts', () => {
    const data = validData();
    data.exercises = data.exercises.filter((exercise) => exercise.id !== '4.3.2');
    const errors = validate(data).join('\n');
    expect(errors).toContain('expected 54 count-bearing records, got 53');
    expect(errors).toContain('Book 4 expected 16 records, got 15');
  });

  test('rejects missing blueprint anchors', () => {
    const data = validData();
    data.exercises[0].id = '9.9.9';
    data.exercises[0].source_ref = 'references/owned/course-blueprint-v5.md §9.9.9';
    const errors = validate(data).join('\n');
    expect(errors).toContain('9.9.9: active blueprint missing paragraph anchor');
  });
});
