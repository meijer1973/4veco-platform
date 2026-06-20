#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ReasoningComposer = require('../../engines/reasoning-composer');
const TaskShellEngine = require('../../engines/task-shell-engine');
const {
  allCompositions,
  blindTransfer
} = require('../exemplars/reasoning-golden-family-data');

const ROOT = path.resolve(__dirname, '..', '..');

function fail(message) {
  console.error(`Reasoning golden family gallery check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(rel) {
  const file = path.join(ROOT, rel);
  assert(fs.existsSync(file), `missing required file: ${rel}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(rel) {
  try {
    return JSON.parse(read(rel));
  } catch (error) {
    fail(`${rel} is not valid JSON: ${error.message}`);
  }
}

function assertFile(rel, minBytes) {
  const file = path.join(ROOT, rel);
  assert(fs.existsSync(file), `missing required file: ${rel}`);
  const stat = fs.statSync(file);
  assert(stat.size >= minBytes, `${rel} is unexpectedly small`);
  return stat;
}

function relGenerated(composition) {
  return `reports/reasoning-golden-family/generated/${composition.composition_id}.html`;
}

function relCompositionJson(composition) {
  return composition.composition_id === blindTransfer.composition_id
    ? `reports/reasoning-golden-family/blind-transfer/${composition.composition_id}.json`
    : `references/exemplars/product-excellence/reasoning-games/compositions/${composition.composition_id}.json`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function findComposition(id) {
  const composition = allCompositions.find((item) => item.composition_id === id);
  assert(composition, `unknown fixture composition: ${id}`);
  return clone(composition);
}

function replaceWithGraphConstruction(task) {
  task.family = 'graph_construction_substitute';
  task.interaction = {
    workspaceTitle: 'Tekenruimte',
    xAxisLabel: 'Horizontale as',
    yAxisLabel: 'Verticale as',
    pointRowsLabel: 'Punten',
    lineConfirmationLabel: 'Verbind de punten',
    lineShapeLabel: 'Lijnvorm',
    xInputLabel: 'P',
    yInputLabel: 'Q',
    emptyGraphAltText: 'Leeg diagram',
    pointCount: 2,
    axes: {
      x: { label: 'P', min: 0, max: 10 },
      y: { label: 'Q', min: 0, max: 700 }
    }
  };
  task.expected = {
    kind: 'graph_construction_substitute',
    axes: { xAccepted: ['p'], yAccepted: ['q'] },
    points: [{ x: 2, y: 600 }, { x: 8, y: 300 }],
    toleranceX: 0,
    toleranceY: 0,
    lineShape: 'decreasing'
  };
}

function replaceWithStructuredReasoning(task) {
  task.family = 'structured_reasoning';
  task.skillLabel = 'Redenering schrijven';
  task.prompt = 'Schrijf je redenering in een tekstvak.';
  task.interaction = { inputLabel: 'Redenering' };
  task.expected = {
    kind: 'self_check',
    criteria: ['Noem oorzaak.', 'Noem gevolg.']
  };
  task.feedback = {
    selfCheckTitle: 'Controleer je antwoord',
    selfCheckText: 'Vergelijk je tekst met de punten.',
    retryTitle: 'Vul eerst iets in',
    retryText: 'Schrijf je antwoord voordat je controleert.'
  };
}

function expectThrows(fn, pattern, id) {
  let threw = false;
  try {
    fn();
  } catch (error) {
    threw = true;
    assert(new RegExp(pattern).test(error.message), `${id} threw wrong error: ${error.message}`);
  }
  assert(threw, `${id} must fail validation`);
}

function applyFixture(fixture) {
  if (fixture.id === 'reshuffle_after_click_guard') {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const first = TaskShellEngine.stableSessionShuffle(items, 'fixture');
    const second = TaskShellEngine.stableSessionShuffle(items, 'fixture');
    assert(JSON.stringify(first) === JSON.stringify(second), 'stableSessionShuffle must be deterministic');
    assert(JSON.stringify(items) === JSON.stringify([{ id: 'a' }, { id: 'b' }, { id: 'c' }]), 'stableSessionShuffle must not mutate input');
    return;
  }

  const composition = findComposition(fixture.composition_id);
  switch (fixture.id) {
    case 'answer_giving_goal':
      composition.goal = 'Het juiste antwoord is P=2 en P=8 kiezen en concludeer dat altijd te sterk is.';
      break;
    case 'mode_overloaded_engine':
      composition.modePicker = true;
      break;
    case 'graph_construction_replaces_reasoning':
      replaceWithGraphConstruction(composition.taskSet.tasks[0]);
      break;
    case 'tiny_graph_targets':
      composition.taskSet.tasks[0].interaction.hitTargetPx = 32;
      break;
    case 'generic_textarea_only':
      replaceWithStructuredReasoning(composition.taskSet.tasks[2]);
      break;
    case 'missing_answer_preview':
      delete composition.taskSet.tasks[2].interaction.answerPreview;
      break;
    case 'correct_only_answer_rows':
      composition.taskSet.tasks[2].interaction.answerRows = composition.taskSet.tasks[2].interaction.answerRows.map((row) => ({
        ...row,
        options: row.options.map((option) => option.kind === 'distractor'
          ? { id: `${option.id}-as-answer`, label: option.label, kind: 'answer' }
          : option)
      }));
      break;
    case 'visible_internal_metadata':
      composition.taskSet.tasks[0].prompt = 'Gebruik A96 en kies de correct kaart.';
      break;
    case 'decorative_graph_only':
      composition.taskSet.tasks[0] = {
        ...composition.taskSet.tasks[0],
        family: 'choice',
        skillLabel: 'Grafiek bekijken',
        prompt: 'Welke uitspraak past?',
        interaction: {
          inputLabel: 'Uitspraak',
          options: [
            { id: 'a', label: 'De kop is te sterk.' },
            { id: 'b', label: 'De kop klopt altijd.' }
          ]
        },
        expected: { kind: 'choice', value: 'a' }
      };
      break;
    default:
      fail(`unhandled negative fixture: ${fixture.id}`);
  }
  expectThrows(() => ReasoningComposer.validateComposition(composition), fixture.expect_error || '.', fixture.id);
}

function validateScreenshots(proof) {
  const screenshotManifest = readJson('reports/reasoning-golden-family/screenshots/manifest.json');
  const requiredStates = ['initial', 'partial', 'wrong_retry', 'correct', 'answer_preview', 'next_action', 'mobile_dark_correct', 'keyboard_focus'];
  assert(screenshotManifest.schema_version === 1, 'screenshot manifest must use schema version 1');
  assert(screenshotManifest.goal === 'GOAL-REASONING-GOLDEN-FAMILY-1', 'screenshot manifest must name this goal');
  assert(Array.isArray(screenshotManifest.cases), 'screenshot manifest must contain cases');
  assert(screenshotManifest.cases.length === allCompositions.length * requiredStates.length, 'screenshot manifest must cover the required interaction states for every composition');
  assert(proof.screenshot_manifest === 'reports/reasoning-golden-family/screenshots/manifest.json', 'proof must link screenshot manifest');
  assert(Array.isArray(proof.screenshot_cases) && proof.screenshot_cases.length === screenshotManifest.cases.length, 'proof must summarize screenshot cases');

  allCompositions.forEach((composition) => {
    requiredStates.forEach((state) => {
      const item = screenshotManifest.cases.find((candidate) => (
        candidate.composition_id === composition.composition_id && candidate.state === state
      ));
      assert(item, `${composition.composition_id} missing screenshot state ${state}`);
      assert(item.screenshot && item.screenshot.endsWith('.png'), `${item.name} must reference a PNG screenshot`);
      assertFile(item.screenshot, 20_000);
      assert(item.proof && item.proof.compositionId === composition.composition_id, `${item.name} proof composition mismatch`);
      assert(item.proof.checkButtonCount === item.proof.taskCount, `${item.name} must render one check button per task`);
      assert(item.proof.modePickerVisible === false, `${item.name} must not show a mode picker`);
      assert(item.proof.focusProof && item.proof.focusProof.activeMatches === true, `${item.name} must prove focus target`);
      if (state === 'partial') {
        assert(item.proof.selectedCount > 0, `${item.name} must show a partial interaction state`);
      }
      if (state === 'wrong_retry') {
        assert(item.proof.feedbackStates.includes('retry'), `${item.name} must show retry feedback`);
      }
      if (state === 'correct' || state === 'answer_preview' || state === 'next_action' || state === 'mobile_dark_correct') {
        assert(item.proof.feedbackStates.includes('matched'), `${item.name} must show matched feedback`);
        assert(item.proof.answerPreview.some((preview) => preview.complete), `${item.name} must complete the final answer preview`);
      }
      if (state === 'answer_preview') {
        assert(item.proof.answerPreview.some((preview) => preview.complete && preview.visible), `${item.name} must visibly show the final answer preview`);
      }
      if (state === 'next_action') {
        assert(item.proof.nextActions.some((action) => action.visible && action.text), `${item.name} must visibly show a next-action route`);
      }
      if (item.proof.graphTargets.length) {
        assert(item.proof.minGraphTarget >= 44, `${item.name} graph targets must be at least 44px`);
      }
      if (state === 'mobile_dark_correct') {
        assert(item.theme === 'dark', `${item.name} must use dark theme`);
        assert(item.proof.paneProof.mobile === true, `${item.name} must be captured in mobile layout`);
      }
      if (state === 'keyboard_focus') {
        assert(item.proof.focusProof.activeMatches === true, `${item.name} must visibly exercise keyboard focus proof`);
      }
    });
  });
}

function main() {
  const gallery = read('reports/reasoning-golden-family/gallery.html');
  assert(gallery.includes('Reasoning Golden Family Gallery'), 'gallery page missing title');
  assert(gallery.includes('not product rollout approval'), 'gallery must state authority boundary');

  const proof = readJson('reports/json/reasoning-golden-family-proof.json');
  assert(proof.rule === 'copy product grammar; re-derive reasoning grammar', 'proof must carry transfer rule');
  assert(Array.isArray(proof.generated_pages) && proof.generated_pages.length === 5, 'proof must list four exemplars plus blind transfer');
  assert(proof.authority.student_product_adoption === false, 'proof must block student product adoption');

  allCompositions.forEach((composition) => {
    ReasoningComposer.validateComposition(composition);
    const generatedJson = readJson(relCompositionJson(composition));
    assert(JSON.stringify(generatedJson, null, 2) === JSON.stringify(composition, null, 2), `${composition.composition_id} generated JSON drifted`);
    const generatedHtml = read(relGenerated(composition));
    const expectedHtml = ReasoningComposer.renderCompositionPage(composition);
    assert(generatedHtml === expectedHtml, `${composition.composition_id} generated HTML drifted`);
    assert(!/legacy_reasoning_modes|mode picker|data-mode=/.test(generatedHtml), `${composition.composition_id} must not expose legacy modes`);
    assert(generatedHtml.includes('data-rg-check-task'), `${composition.composition_id} must include one-click check actions`);
    assert(generatedHtml.includes('data-answer-preview'), `${composition.composition_id} must include answer preview`);
  });

  const blindEntry = proof.generated_pages.find((entry) => entry.composition_id === blindTransfer.composition_id);
  assert(blindEntry && blindEntry.blind_transfer, 'proof must include blind transfer metadata');
  assert(blindEntry.blind_transfer.unseenParagraph === '1.2.2 Vraagfactoren', 'blind transfer must target unseen paragraph 1.2.2');
  assert(blindEntry.blind_transfer.noHumanMicroSpecification === true, 'blind transfer must record no human micro-specification');
  assert(
    fs.existsSync(path.join(ROOT, '..', '4veco-lessen', blindEntry.blind_transfer.sourceChecked)),
    'blind transfer sourceChecked must point to an existing lesson paragraph file'
  );
  validateScreenshots(proof);

  const fixtures = readJson('reports/reasoning-golden-family/negative-fixtures.json');
  assert(Array.isArray(fixtures.fixtures) && fixtures.fixtures.length >= 10, 'negative fixture suite must contain recurring defect cases');
  fixtures.fixtures.forEach(applyFixture);

  console.log('Reasoning golden family gallery check OK');
}

main();
