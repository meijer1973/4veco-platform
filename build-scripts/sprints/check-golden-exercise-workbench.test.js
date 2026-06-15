const checks = require('../lib/golden-exercise-policy-checks');

describe('Golden Exercise Workbench policy checks', () => {
  test('all required negative fixtures are caught by their expected policy rule', () => {
    const results = checks.checkNegativeFixtures();
    expect(results.map((item) => item.id)).toEqual(expect.arrayContaining([
      'pure_legacy_et_page_route',
      'hybrid_ge_plus_et_route',
      'golden_route_with_legacy_assets',
      'fake_graph_slope_question',
      'answer_giving_placeholder',
      'formula_token_bank_ordered_as_answer',
      'visually_identical_hidden_token_trap_oldq',
      'visually_identical_hidden_token_trap_unmarked_duplicate',
      'missing_after_interaction_proof',
    ]));
  });

  test('implemented 1.1.3 snapshot keeps the direct Golden shell without the visible workbench header', () => {
    expect(() => checks.checkImplementedSnapshotHtml()).not.toThrow();
  });

  test('current 1.1.3 formula tokens are explicit while A96 remains the formula policy exemplar', () => {
    const current = checks.checkCurrentGoldenSources();
    const implemented = current.find((item) => item.file.endsWith('1.1.3-exit-ticket.json'));
    expect(implemented).toBeTruthy();
    expect(implemented.quarantined_formula_token_traps).toEqual([]);
    expect(() => checks.validateExemplarIndexFormulaBoundary()).not.toThrow();
  });
});
