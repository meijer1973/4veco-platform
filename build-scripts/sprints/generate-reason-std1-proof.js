#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const ReasoningEngine = require(path.join(ROOT, 'engines', 'reasoning-engine.js'));
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine.js'));
const TaskShellUI = require(path.join(ROOT, 'engines', 'task-shell-ui.js'));

function relPath(rel) {
  return path.join(ROOT, rel);
}

function read(rel) {
  return fs.readFileSync(relPath(rel), 'utf8');
}

function write(rel, text) {
  fs.mkdirSync(path.dirname(relPath(rel)), { recursive: true });
  fs.writeFileSync(relPath(rel), text, 'utf8');
}

function withDeterministicRandom(callback) {
  const originalRandom = Math.random;
  let seed = 1701;
  Math.random = function deterministicRandom() {
    seed = (seed * 48271) % 0x7fffffff;
    return seed / 0x7fffffff;
  };
  try {
    return callback();
  } finally {
    Math.random = originalRandom;
  }
}

function createEngine(csv) {
  return new ReasoningEngine({
    csvString: csv,
    domain: 'economics',
    parNr: '1.1.1',
    roundsPerGame: 1,
  });
}

function collectRound(csv, mode) {
  const engine = createEngine(csv);
  engine.startGame(mode);
  return engine.getRound();
}

function wrongOrder(order) {
  const reversed = order.slice().reverse();
  if (reversed.join('\u0001') !== order.join('\u0001')) return reversed;
  const rotated = order.slice(1).concat(order[0]);
  return rotated;
}

function modeMapFromEngine(csv) {
  const engine = createEngine(csv);
  return engine.getStandardFamilyMap().map((row) => ({
    mode: row.mode,
    mode_name: row.modeName,
    candidate_family: row.candidateFamily,
    standard_action: row.standardAction,
    disposition: row.disposition,
  }));
}

function modeProof(csv, mode) {
  const round = collectRound(csv, mode);
  if (!round.taskShellTask) {
    return {
      mode,
      has_task_shell_task: false,
      candidate_family: round.standardFamily.candidateFamily,
      disposition: round.standardFamily.disposition,
    };
  }
  TaskShellEngine.validateTask(round.taskShellTask);
  if (mode === 5) {
    const empty = TaskShellEngine.evaluateTask(round.taskShellTask, '');
    const filled = TaskShellEngine.evaluateTask(round.taskShellTask, 'Oorzaak, tussenstap en conclusie.');
    return {
      mode,
      has_task_shell_task: true,
      candidate_family: round.standardFamily.candidateFamily,
      runtime_family: round.taskShellTask.family,
      task_id: round.taskShellTask.id,
      validation: 'passed',
      empty_response_state: empty.state,
      filled_response_state: filled.state,
      target_equivalent_proof: filled.boundaryFlags.targetEquivalentProof,
    };
  }
  const correct = TaskShellEngine.evaluateTask(round.taskShellTask, {
    order: round.taskShellTask.expected.order,
  });
  const wrong = TaskShellEngine.evaluateTask(round.taskShellTask, {
    order: wrongOrder(round.taskShellTask.expected.order),
  });
  return {
    mode,
    has_task_shell_task: true,
    candidate_family: round.standardFamily.candidateFamily,
    runtime_family: round.taskShellTask.family,
    task_id: round.taskShellTask.id,
    validation: 'passed',
    correct_response_state: correct.state,
    wrong_response_state: wrong.state,
    wrong_response_matched: wrong.matched,
  };
}

function buildMapJson(csv) {
  return {
    schema_version: 1,
    sprint_id: 'REASON-STD-1',
    generated: '2026-06-02',
    source: {
      engine: 'engines/reasoning-engine.js',
      task_shell_engine: 'engines/task-shell-engine.js',
      task_shell_ui: 'engines/task-shell-ui.js',
      sample_csv: 'source-data/book-1/reasoning/1.1.1.csv',
    },
    provenance: {
      generated_by: 'build-scripts/sprints/generate-reason-std1-proof.js',
      task_source: 'actual ReasoningEngine round.taskShellTask objects',
    },
    boundaries: {
      generated_lesson_output_authorized: false,
      source_data_mutation_authorized: false,
      product_route_adoption_authorized: false,
      target_equivalent_claims_authorized: false,
      diagnostics_authorized: false,
      mastery_or_sequencing_authorized: false,
      scale_gate_1_authorized: false,
      student_or_product_use_authorized: false,
    },
    modes: modeMapFromEngine(csv).map((row) => {
      const extras = {
        0: {
          student_action: 'Choose relevant reasoning steps and order them.',
          runtime_family: 'step_ordering',
          response_shape: '{ order: string[] }',
        },
        1: {
          student_action: 'Order the subquestions that build the reasoning route.',
          runtime_family: 'step_ordering',
          response_shape: '{ order: string[] }',
        },
        2: {
          student_action: 'Identify the faulty reasoning step.',
          runtime_family: null,
          response_shape: null,
          follow_up: 'Decide between two_tier_choice, bounded choice, or a new error_detection family after content review.',
        },
        3: {
          student_action: 'Build a causal or procedural flow from blocks.',
          runtime_family: 'step_ordering',
          response_shape: '{ order: string[] }',
        },
        4: {
          student_action: 'Match problems that share a reasoning structure.',
          runtime_family: null,
          response_shape: null,
          follow_up: 'Requires reviewed one-to-one matching banks and explanation/repair step before shared-shell adoption.',
        },
        5: {
          student_action: 'Write a short reasoning answer and self-check against criteria.',
          runtime_family: 'structured_reasoning',
          response_shape: 'string self-check',
        },
        null: {
          student_action: 'Use a source value as evidence and finish the underlying answer form.',
          runtime_family: 'composed_pattern',
          response_shape: 'source_value_selection + source_chain_builder + structured_short_response',
        },
      };
      return {
        ...row,
        ...extras[row.mode],
      };
    }),
  };
}

function buildProofJson(csv) {
  const proof = [0, 1, 2, 3, 4, 5].map((mode) => modeProof(csv, mode));
  return {
    schema_version: 1,
    sprint_id: 'REASON-STD-1',
    generated: '2026-06-02',
    proof_type: 'platform-runtime standard-family mapping and rendered report fixture',
    provenance: {
      generated_by: 'build-scripts/sprints/generate-reason-std1-proof.js',
      task_source: 'actual ReasoningEngine round.taskShellTask objects',
    },
    sample_source: 'source-data/book-1/reasoning/1.1.1.csv',
    validated_modes: proof.filter((row) => row.has_task_shell_task).map((row) => row.mode),
    deferred_modes: proof.filter((row) => !row.has_task_shell_task).map((row) => row.mode),
    validated_task_families: Array.from(new Set(proof.filter((row) => row.runtime_family).map((row) => row.runtime_family))),
    mode_proof: proof.filter((row) => row.has_task_shell_task),
    deferred_mode_proof: proof.filter((row) => !row.has_task_shell_task),
    rendered_fixture: 'reports/sprints/REASON-STD-1-rendered-fixture.html',
    boundaries: {
      generated_lesson_output_changed: false,
      reasoning_csv_changed: false,
      protected_reference_data_changed: false,
      target_equivalent_claims_authorized: false,
      diagnostics_authorized: false,
      mastery_or_sequencing_authorized: false,
      scale_gate_1_authorized: false,
      student_or_product_use_authorized: false,
    },
  };
}

function buildFixtureHtml(csv) {
  const tasks = [0, 1, 3, 5].map((mode) => collectRound(csv, mode).taskShellTask);
  const renderedShell = TaskShellUI.renderStaticHtml({
    schema_version: 1,
    id: 'REASON-STD-1-rendered-fixture',
    eyebrow: 'REASON-STD-1 rendered fixture',
    title: 'Reasoning standard-family fixture',
    intro: 'Generated from actual reasoning-engine taskShellTask objects. Review-only: no generated lesson output, no product-route adoption, and no target-equivalent authority.',
    tasks,
  });
  const provenance = {
    sprint_id: 'REASON-STD-1',
    generated_by: 'build-scripts/sprints/generate-reason-std1-proof.js',
    task_source: 'actual ReasoningEngine round.taskShellTask objects',
    source_csv: 'source-data/book-1/reasoning/1.1.1.csv',
    modes: [0, 1, 3, 5],
  };
  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>REASON-STD-1 rendered fixture</title>
  <link rel="stylesheet" href="../../engines/task-shell.css">
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f8fafc; color: #0f172a; }
    main { max-width: 1040px; margin: 0 auto; padding: 24px; }
    .proof-note { border: 1px solid #cbd5e1; background: #fff; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; }
    .dark-proof { background: #111827; color: #f9fafb; padding: 18px; margin-top: 24px; }
  </style>
</head>
<body>
<main>
  <div class="proof-note">
    <strong>REASON-STD-1</strong>
    <p>This fixture is generated from actual reasoning-engine taskShellTask objects. It is review-only and does not prove generated-route adoption.</p>
  </div>
  ${renderedShell}
  <section class="dark-proof" aria-label="Dark mode proof note">
    <p>Dark-mode review note: later route adoption must capture actual rendered screenshots. This fixture only provides task-shell markup in a dark-surface context for review.</p>
  </section>
  <script type="application/json" id="reason-std1-provenance">${JSON.stringify(provenance, null, 2)}</script>
</main>
</body>
</html>
`;
}

function stableJson(value) {
  return JSON.stringify(value, null, 2) + '\n';
}

function buildArtifacts(options = {}) {
  return withDeterministicRandom(() => {
    const csv = read('source-data/book-1/reasoning/1.1.1.csv');
    const mapJson = buildMapJson(csv);
    const proofJson = buildProofJson(csv);
    const fixtureHtml = buildFixtureHtml(csv);
    const artifacts = {
      mapJson,
      proofJson,
      fixtureHtml,
      mapJsonText: stableJson(mapJson),
      proofJsonText: stableJson(proofJson),
    };
    if (options.write) {
      write('reports/json/reason-std1-standard-family-map.json', artifacts.mapJsonText);
      write('reports/json/reason-std1-proof.json', artifacts.proofJsonText);
      write('reports/sprints/REASON-STD-1-rendered-fixture.html', artifacts.fixtureHtml);
    }
    return artifacts;
  });
}

if (require.main === module) {
  buildArtifacts({ write: true });
  console.log('Generated REASON-STD-1 proof artifacts');
}

module.exports = {
  buildArtifacts,
  wrongOrder,
};

