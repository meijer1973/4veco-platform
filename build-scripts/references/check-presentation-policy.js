#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const GOLDEN_PATH = 'references/exemplars/1.1.1-golden-presentation/';
const REQUIRED_POLICY_JSON = [
  'presentation-policy.json',
  'web-first-presentation-layout.json',
  'speaker-notes-policy.json',
  'didactic-route-policy.json',
];
const REQUIRED_AUTHORITY_BOUNDARIES = [
  'product_use',
  'scale_gate_1',
  'diagnostics',
  'mastery_claims',
  'automatic_sequencing',
  'summative_use',
  'target_equivalent_completion_language',
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validatePolicyRoot(root = path.resolve(__dirname, '..', '..')) {
  const policyDir = path.join(root, 'references', 'presentation');
  const indexPath = path.join(root, 'references', 'exemplars', 'exemplar-index.json');
  const failures = [];

  function check(label, fn) {
    try {
      fn();
    } catch (error) {
      failures.push(`${label}: ${error.message}`);
    }
  }

  check('policy directory', () => {
    assert(fs.existsSync(policyDir), `missing ${path.relative(root, policyDir)}`);
  });

  for (const file of REQUIRED_POLICY_JSON) {
    check(file, () => {
      const fullPath = path.join(policyDir, file);
      assert(fs.existsSync(fullPath), `missing ${path.relative(root, fullPath)}`);
      const json = readJson(fullPath);
      assert(json.schema_version === 1, 'schema_version must be 1');
      assert(json.derived_from === GOLDEN_PATH, `derived_from must be ${GOLDEN_PATH}`);
    });
  }

  check('presentation-policy authority boundary', () => {
    const json = readJson(path.join(policyDir, 'presentation-policy.json'));
    const boundaries = new Set(json.does_not_authorize || []);
    for (const item of REQUIRED_AUTHORITY_BOUNDARIES) {
      assert(boundaries.has(item), `missing does_not_authorize ${item}`);
    }
  });

  check('markdown policy references', () => {
    const markdownFiles = fs.readdirSync(policyDir).filter((file) => file.endsWith('.md'));
    assert(markdownFiles.length >= 5, 'expected markdown policy files');
    for (const file of markdownFiles) {
      const text = fs.readFileSync(path.join(policyDir, file), 'utf8');
      assert(text.includes(GOLDEN_PATH), `${file} must cite ${GOLDEN_PATH}`);
    }
  });

  check('exemplar index entry', () => {
    const index = readJson(indexPath);
    const entry = (index.entries || []).find((item) => item.id === '1.1.1-golden-presentation');
    assert(entry, 'missing exemplar-index entry for 1.1.1-golden-presentation');
    assert(entry.type === 'conceptual_exemplar', 'entry must remain conceptual_exemplar');
    assert(entry.path === GOLDEN_PATH, `entry path must be ${GOLDEN_PATH}`);
    assert(entry.surface === 'web_first_presentation', 'entry surface must be web_first_presentation');
    const boundaries = new Set(entry.does_not_authorize || []);
    for (const item of REQUIRED_AUTHORITY_BOUNDARIES) {
      assert(boundaries.has(item), `index entry missing does_not_authorize ${item}`);
    }
  });

  return failures;
}

function main() {
  const root = path.resolve(__dirname, '..', '..');
  const failures = validatePolicyRoot(root);
  if (failures.length) {
    console.error('Presentation policy check failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log('OK presentation policy references and authority boundaries');
}

if (require.main === module) main();

module.exports = {
  validatePolicyRoot,
  REQUIRED_AUTHORITY_BOUNDARIES,
  GOLDEN_PATH,
};
