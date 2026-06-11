#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const checks = require('../lib/golden-exercise-policy-checks');

const PROOF_PATH = path.join(checks.ROOT, 'reports', 'json', 'golden-exercise-checkers-1-proof.json');

function main() {
  const proof = {
    schema_version: 1,
    sprint_id: 'GOLDEN-EXERCISE-CHECKERS-1',
    generated: new Date().toISOString(),
    status: 'passed',
    layout_registry: checks.validateLayoutRegistry(),
    interaction_policy: checks.validateInteractionPolicy(),
    short_check_policy: checks.validateShortCheckPolicySpec(),
    exemplar_formula_boundary: checks.validateExemplarIndexFormulaBoundary(),
    a96_fixture_policy: checks.validateA96FixturePolicy(),
    implemented_snapshot: checks.checkImplementedSnapshotHtml(),
    current_golden_sources: checks.checkCurrentGoldenSources(),
    negative_fixtures: checks.checkNegativeFixtures(),
    authority: {
      route_migration_authorized: false,
      renderer_generalization_authorized: false,
      generated_lesson_output_changed: false,
      legacy_renderers_deleted: false,
      product_use_authorized: false,
      scale_gate_1_authorized: false,
      target_equivalent_completion_language_authorized: false,
      diagnostics_mastery_or_summative_use_authorized: false,
    },
  };
  fs.mkdirSync(path.dirname(PROOF_PATH), { recursive: true });
  fs.writeFileSync(PROOF_PATH, `${JSON.stringify(proof, null, 2)}\n`);
  console.log(`GOLDEN-EXERCISE-CHECKERS-1 passed; proof written to ${checks.rel(PROOF_PATH)}`);
}

try {
  main();
} catch (error) {
  console.error(`check-golden-exercise-workbench failed: ${error.message}`);
  process.exit(1);
}
