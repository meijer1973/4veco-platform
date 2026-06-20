#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

function fail(message) {
  console.error(`Reasoning game skill check failed: ${message}`);
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

function main() {
  const skill = read('skills/econ-reasoning-game.md');
  assert(/^---\n[\s\S]+?\n---/.test(skill), 'skill must include frontmatter');
  assert(/name:\s*econ-reasoning-game/.test(skill), 'skill frontmatter must name econ-reasoning-game');
  assert(/econ-companion-artifacts/.test(skill), 'skill must inherit econ-companion-artifacts');
  assert(/copy product grammar[\s\S]*re-derive reasoning grammar/i.test(skill), 'skill must state the governing rule');
  assert(/not from the legacy reasoning engine's mode list/i.test(skill), 'skill must reject legacy mode-list design');
  [
    'Target Brief',
    'Archetype',
    'One Coherent Loop',
    'Shared Student Actions',
    'UI Standard',
    'Distractors',
    'Negative Fixtures First',
    'Rendered Proof',
    'Review',
    'Hard Fails',
    'Delivery'
  ].forEach((section) => {
    assert(skill.includes(section), `skill missing section: ${section}`);
  });
  [
    'functional_answer_builder',
    'graph_evidence_selector',
    'dual_pane_source_task_workspace',
    'stable positions',
    'no visible IDs',
    'initial desktop light',
    'mobile dark',
    'two-round lead synthesis'
  ].forEach((term) => {
    assert(skill.includes(term), `skill missing required term: ${term}`);
  });

  const checklist = readJson('skills/reasoning-game-checklist.json');
  assert(checklist.schema_version === 1, 'checklist schema_version must be 1');
  assert((checklist.hard_fails || []).includes('mode_picker_default'), 'checklist must reject mode picker default');
  assert((checklist.hard_fails || []).includes('generic_textarea_only'), 'checklist must reject generic textarea-only degradation');
  assert((checklist.proof_states || []).includes('wrong_retry'), 'checklist must require wrong/retry proof');
  assert((checklist.graph_specific_proof || []).includes('target_size_min_44_px'), 'checklist must require 44px graph target proof');
  [
    'student_product_adoption',
    'target_equivalent_proof',
    'diagnostics',
    'mastery_or_sequencing',
    'summative_use',
    'scale_gate'
  ].forEach((flag) => {
    assert((checklist.authority_must_remain_false || []).includes(flag), `checklist missing authority flag ${flag}`);
  });

  const archetypes = readJson('skills/reasoning-game-archetypes.json');
  assert(archetypes.schema_version === 1, 'archetypes schema_version must be 1');
  assert(Array.isArray(archetypes.archetypes) && archetypes.archetypes.length === 4, 'archetypes must list the four golden families');
  const archetypeText = JSON.stringify(archetypes);
  [
    'reasoning-market-price-mechanism-v3',
    'reasoning-1.1.1-choice-compass-v1',
    'reasoning-1.1.2-index-check-v1',
    'reasoning-1.1.3-graph-editorial-v2',
    'graph_evidence_selector',
    'functional_answer_builder'
  ].forEach((term) => assert(archetypeText.includes(term), `archetypes missing ${term}`));
  assert(archetypes.new_archetype_policy && archetypes.new_archetype_policy.requires_specialist_review === true, 'new archetypes must require specialist review');

  const template = read('skills/reasoning-game-prompt-template.md');
  [
    'Reasoning target:',
    'Central misconception:',
    'Selected archetype:',
    'How the paragraph reasoning grammar is re-derived:',
    'Negative fixtures:',
    'Rendered proof states:',
    'Authority boundary:'
  ].forEach((term) => assert(template.includes(term), `prompt template missing ${term}`));
  assert(/Reject the task if it asks to copy an exemplar mechanic/i.test(template), 'prompt template must reject mechanic copying');

  const umbrella = read('skills/econ-companion-artifacts.md');
  assert(umbrella.includes('skills/econ-reasoning-game.md'), 'umbrella companion skill must route redeneer-spel work to econ-reasoning-game');
  const agents = read('AGENTS.md');
  assert(agents.includes('skills/econ-reasoning-game.md'), 'AGENTS.md must mention the dedicated reasoning-game skill');
  assert(agents.includes('references/exemplars/product-excellence/reasoning-games/'), 'AGENTS.md must mention the reasoning-game exemplar library');
  assert(/legacy 5 modi/.test(agents), 'AGENTS.md must mark the old 5-mode reasoning route as legacy');

  console.log('Reasoning game skill check OK');
}

main();
