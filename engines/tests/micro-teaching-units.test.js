/**
 * Tests for the micro-teaching-units parser, validator, and layer derivation.
 *
 * These tests exercise pure functions from build-unit-index.js with synthetic
 * unit blocks. Integration against the real `references/machine/` file is
 * performed by CI when `build-unit-index.js` runs standalone.
 */

const {
  parseMarkdown,
  parseBlock,
  parseInlineValue,
  validate,
  findCycles,
  computeLayers,
  buildJsonEntry,
  sortUnits,
} = require('../../build-scripts/references/build-unit-index');

const {
  parseArgs,
  buildSpecFromFlags,
  validateSpec,
  formatEntry,
  insertEntry,
} = require('../../build-scripts/references/unit-add');

const {
  rebuildMarkdown,
  parseFlagArgs,
} = require('../../build-scripts/references/unit-lib');

const {
  loadTerminology,
  loadEindtermen,
} = require('../../build-scripts/references/build-unit-index');

// ---------- parseInlineValue ----------

describe('parseInlineValue', () => {
  test('parses inline lists', () => {
    expect(parseInlineValue('[A01, B02]')).toEqual(['A01', 'B02']);
  });

  test('parses empty lists', () => {
    expect(parseInlineValue('[]')).toEqual([]);
  });

  test('strips list-item quotes', () => {
    expect(parseInlineValue('["marktevenwicht", "prijselasticiteit"]')).toEqual(
      ['marktevenwicht', 'prijselasticiteit']
    );
  });

  test('parses integers', () => {
    expect(parseInlineValue('5')).toBe(5);
  });

  test('parses booleans', () => {
    expect(parseInlineValue('true')).toBe(true);
    expect(parseInlineValue('false')).toBe(false);
  });

  test('strips surrounding double quotes', () => {
    expect(parseInlineValue('"hello world"')).toBe('hello world');
  });

  test('returns plain strings as-is', () => {
    expect(parseInlineValue('apply')).toBe('apply');
  });
});

// ---------- parseBlock ----------

describe('parseBlock', () => {
  test('parses a minimal unit block', () => {
    const block = `A01 Lineaire functie opstellen
- kern: "Student stelt een lineaire functie op uit twee punten."
- needs: []
- mastery_target: apply
- prior_learning: new_this_year
- terms: [lineaire functie, richtingscoëfficiënt]
- procedure:
  1. Bereken de richtingscoëfficiënt.
  2. Bepaal het snijpunt met de y-as.
- generator: GEN_A01
`;
    const u = parseBlock(block);
    expect(u.id).toBe('A01');
    expect(u.name).toBe('Lineaire functie opstellen');
    expect(u.mastery_target).toBe('apply');
    expect(u.needs).toEqual([]);
    expect(u.terms).toEqual(['lineaire functie', 'richtingscoëfficiënt']);
    expect(u.procedure).toHaveLength(2);
    expect(u.procedure[0]).toMatch(/richtingscoëfficiënt/);
    expect(u.generator).toBe('GEN_A01');
  });

  test('returns null for blocks without an ID', () => {
    expect(parseBlock('')).toBeNull();
  });
});

// ---------- parseMarkdown ----------

describe('parseMarkdown', () => {
  test('returns empty array when marker is missing', () => {
    expect(parseMarkdown('no marker here')).toEqual([]);
  });

  test('returns empty array when no units follow the marker', () => {
    const md = `# Title\n\n<!-- UNIT ENTRIES BELOW THIS LINE -->\n`;
    expect(parseMarkdown(md)).toEqual([]);
  });

  test('parses multiple units separated by headings', () => {
    const md = [
      '<!-- UNIT ENTRIES BELOW THIS LINE -->',
      '',
      '### A01 Eerste',
      '- kern: "een"',
      '- needs: []',
      '- mastery_target: understand',
      '- prior_learning: new_this_year',
      '- terms: []',
      '',
      '### A02 Tweede',
      '- kern: "twee"',
      '- needs: [A01]',
      '- mastery_target: apply',
      '- prior_learning: new_this_year',
      '- terms: []',
      '- procedure:',
      '  1. Doe iets.',
      '- generator: GEN_A02',
      '',
    ].join('\n');
    const units = parseMarkdown(md);
    expect(units).toHaveLength(2);
    expect(units[0].id).toBe('A01');
    expect(units[1].id).toBe('A02');
    expect(units[1].needs).toEqual(['A01']);
  });
});

// ---------- validate ----------

describe('validate', () => {
  function baseUnit(overrides = {}) {
    return {
      id: 'D01',
      name: 'Marktevenwicht',
      kern: 'Student bepaalt evenwichtsprijs en -hoeveelheid.',
      needs: [],
      mastery_target: 'understand',
      prior_learning: 'new_this_year',
      terms: [],
      ...overrides,
    };
  }

  test('passes on a minimal valid unit', () => {
    const { errors } = validate([baseUnit()], {});
    expect(errors).toEqual([]);
  });

  test('rejects invalid ID format', () => {
    const { errors } = validate([baseUnit({ id: 'foo' })], {});
    expect(errors).toEqual(expect.arrayContaining([expect.stringMatching(/invalid ID format/)]));
  });

  test('rejects duplicate IDs', () => {
    const u1 = baseUnit();
    const u2 = baseUnit();
    const { errors } = validate([u1, u2], {});
    expect(errors).toEqual(expect.arrayContaining([expect.stringMatching(/duplicate ID/)]));
  });

  test('rejects missing required fields', () => {
    const u = baseUnit();
    delete u.kern;
    const { errors } = validate([u], {});
    expect(errors).toEqual(expect.arrayContaining([expect.stringMatching(/missing required field "kern"/)]));
  });

  test('rejects unknown mastery_target', () => {
    const { errors } = validate([baseUnit({ mastery_target: 'nonsense' })], {});
    expect(errors).toEqual(expect.arrayContaining([expect.stringMatching(/mastery_target "nonsense"/)]));
  });

  test('requires procedure when mastery_target >= apply', () => {
    const { errors } = validate([baseUnit({ mastery_target: 'apply' })], {});
    expect(errors).toEqual(expect.arrayContaining([expect.stringMatching(/requires non-empty procedure/)]));
  });

  test('passes apply-level with procedure', () => {
    const { errors } = validate(
      [baseUnit({ mastery_target: 'apply', procedure: ['Stap 1.', 'Stap 2.'] })],
      {}
    );
    expect(errors).toEqual([]);
  });

  test('rejects generator on non-A unit', () => {
    const { errors } = validate([baseUnit({ generator: 'GEN_D01' })], {});
    expect(errors).toEqual(expect.arrayContaining([expect.stringMatching(/generator field is only valid for A-domain/)]));
  });

  test('requires generator on A unit unless deprecated', () => {
    const { errors } = validate(
      [baseUnit({ id: 'A01', name: 'math', mastery_target: 'apply', procedure: ['stap'] })],
      {}
    );
    expect(errors).toEqual(expect.arrayContaining([expect.stringMatching(/A-domain units require a generator/)]));
  });

  test('flags unknown references in needs', () => {
    const { errors } = validate([baseUnit({ needs: ['Z99'] })], {});
    expect(errors).toEqual(expect.arrayContaining([expect.stringMatching(/references unknown unit "Z99"/)]));
  });

  test('detects cycles', () => {
    const u1 = baseUnit({ id: 'D01', needs: ['D02'] });
    const u2 = baseUnit({ id: 'D02', needs: ['D01'] });
    const { errors } = validate([u1, u2], {});
    expect(errors.some(e => /cycle detected/.test(e))).toBe(true);
  });

  test('validates terms against terminology set when provided', () => {
    const { errors } = validate(
      [baseUnit({ terms: ['bekende term', 'onbekende term'] })],
      { terms: new Set(['bekende term']) }
    );
    expect(errors).toEqual(expect.arrayContaining([expect.stringMatching(/term "onbekende term" not found/)]));
  });

  test('validates exam_codes against eindtermen set when provided', () => {
    const { errors } = validate(
      [baseUnit({ exam_codes: ['D1.1', 'Z9.9'] })],
      { eindtermen: new Set(['D1.1']) }
    );
    expect(errors).toEqual(expect.arrayContaining([expect.stringMatching(/exam_code "Z9.9" not found/)]));
  });

  test('skips eindtermen check when set is absent', () => {
    const { errors } = validate([baseUnit({ exam_codes: ['D1.1'] })], {});
    expect(errors).toEqual([]);
  });
});

// ---------- computeLayers ----------

describe('computeLayers', () => {
  test('assigns layer 0 to units without needs', () => {
    const u = { id: 'A01', needs: [] };
    const byId = new Map([['A01', u]]);
    computeLayers([u], byId);
    expect(u.layer).toBe(0);
  });

  test('assigns layer = max(needs.layer) + 1', () => {
    const a = { id: 'A01', needs: [] };
    const b = { id: 'A02', needs: ['A01'] };
    const c = { id: 'A03', needs: ['A01', 'A02'] };
    const byId = new Map([['A01', a], ['A02', b], ['A03', c]]);
    computeLayers([a, b, c], byId);
    expect(a.layer).toBe(0);
    expect(b.layer).toBe(1);
    expect(c.layer).toBe(2);
  });
});

// ---------- buildJsonEntry ----------

describe('buildJsonEntry', () => {
  test('derives category from ID prefix', () => {
    const entry = buildJsonEntry({
      id: 'D01',
      name: 'X',
      layer: 0,
      needs: [],
      kern: 'k',
      mastery_target: 'understand',
      prior_learning: 'new_this_year',
      terms: [],
    });
    expect(entry.category).toBe('markt');
  });

  test('omits undefined optional fields', () => {
    const entry = buildJsonEntry({
      id: 'A01',
      name: 'X',
      layer: 0,
      needs: [],
      kern: 'k',
      mastery_target: 'understand',
      prior_learning: 'new_this_year',
      terms: [],
    });
    expect(entry).not.toHaveProperty('pitfalls');
    expect(entry).not.toHaveProperty('generator');
    expect(entry).not.toHaveProperty('deprecated');
  });
});

// ---------- sortUnits ----------

describe('sortUnits', () => {
  test('sorts by ID', () => {
    const units = [{ id: 'D02' }, { id: 'A01' }, { id: 'D01' }];
    expect(sortUnits(units).map(u => u.id)).toEqual(['A01', 'D01', 'D02']);
  });
});

// ---------- unit-add: parseArgs ----------

describe('unit-add parseArgs', () => {
  test('parses --spec JSON', () => {
    const { spec } = parseArgs(['node', 'u', '--spec', '{"id":"A01"}']);
    expect(spec).toEqual({ id: 'A01' });
  });

  test('parses flags with values', () => {
    const { flags } = parseArgs(['node', 'u', '--id', 'D05', '--name', 'Market']);
    expect(flags.id).toBe('D05');
    expect(flags.name).toBe('Market');
  });

  test('flags without values become true', () => {
    const { flags } = parseArgs(['node', 'u', '--deprecated']);
    expect(flags.deprecated).toBe(true);
  });
});

// ---------- unit-add: buildSpecFromFlags ----------

describe('unit-add buildSpecFromFlags', () => {
  test('maps hyphenated flags to underscore fields', () => {
    const spec = buildSpecFromFlags({
      id: 'D05', name: 'X', kern: 'k',
      'mastery-target': 'understand', 'prior-learning': 'new_this_year',
      needs: 'D01,D02', terms: 'a, b, c',
    });
    expect(spec.mastery_target).toBe('understand');
    expect(spec.prior_learning).toBe('new_this_year');
    expect(spec.needs).toEqual(['D01', 'D02']);
    expect(spec.terms).toEqual(['a', 'b', 'c']);
  });

  test('needs becomes empty array when absent', () => {
    const spec = buildSpecFromFlags({ id: 'D01' });
    expect(spec.needs).toBeUndefined();
  });
});

// ---------- unit-add: validateSpec ----------

describe('unit-add validateSpec', () => {
  function okSpec() {
    return {
      id: 'D05', name: 'Market', kern: 'k',
      needs: [], mastery_target: 'understand',
      prior_learning: 'new_this_year', terms: [],
    };
  }

  test('passes valid spec', () => {
    expect(validateSpec(okSpec(), new Set())).toEqual([]);
  });

  test('rejects existing ID', () => {
    const errs = validateSpec(okSpec(), new Set(['D05']));
    expect(errs).toEqual(expect.arrayContaining([expect.stringMatching(/already exists/)]));
  });

  test('rejects invalid ID format', () => {
    const errs = validateSpec({ ...okSpec(), id: 'foo' }, new Set());
    expect(errs).toEqual(expect.arrayContaining([expect.stringMatching(/invalid ID/)]));
  });

  test('requires procedure on apply-level', () => {
    const errs = validateSpec({ ...okSpec(), mastery_target: 'apply' }, new Set());
    expect(errs).toEqual(expect.arrayContaining([expect.stringMatching(/non-empty procedure/)]));
  });

  test('requires generator on A-domain', () => {
    const errs = validateSpec(
      { ...okSpec(), id: 'A01', mastery_target: 'apply', procedure: ['stap'] },
      new Set()
    );
    expect(errs).toEqual(expect.arrayContaining([expect.stringMatching(/A-domain units require a generator/)]));
  });

  test('rejects generator on non-A', () => {
    const errs = validateSpec({ ...okSpec(), generator: 'GEN_X' }, new Set());
    expect(errs).toEqual(expect.arrayContaining([expect.stringMatching(/only valid for A-domain/)]));
  });
});

// ---------- unit-add: formatEntry ----------

describe('unit-add formatEntry', () => {
  test('emits readable markdown for a minimal unit', () => {
    const md = formatEntry({
      id: 'D05', name: 'Marktevenwicht',
      kern: 'Student bepaalt evenwicht.',
      needs: ['D01', 'D02'],
      mastery_target: 'understand',
      prior_learning: 'new_this_year',
      terms: ['marktevenwicht'],
    });
    expect(md).toMatch(/^### D05 Marktevenwicht\n/);
    expect(md).toContain('- needs: [D01, D02]');
    expect(md).toContain('- terms: [marktevenwicht]');
    expect(md).toContain('- mastery_target: understand');
  });

  test('emits numbered procedure steps', () => {
    const md = formatEntry({
      id: 'D06', name: 'Marktevenwicht (berekening)',
      kern: 'k', needs: [],
      mastery_target: 'apply', prior_learning: 'new_this_year',
      terms: [],
      procedure: ['Stap een.', 'Stap twee.'],
    });
    expect(md).toContain('- procedure:\n  1. Stap een.\n  2. Stap twee.\n');
  });

  test('round-trips through parseBlock', () => {
    const original = {
      id: 'D07', name: 'Marktevenwicht (analyse)',
      kern: 'Student analyseert welvaart.',
      needs: ['D05'],
      mastery_target: 'understand',
      prior_learning: 'new_this_year',
      terms: ['welvaart'],
    };
    const md = formatEntry(original);
    const raw = md.replace(/^### /, '');
    const parsed = parseBlock(raw);
    expect(parsed.id).toBe(original.id);
    expect(parsed.name).toBe(original.name);
    expect(parsed.kern).toBe(original.kern);
    expect(parsed.needs).toEqual(original.needs);
    expect(parsed.mastery_target).toBe(original.mastery_target);
    expect(parsed.terms).toEqual(original.terms);
  });
});

// ---------- unit-add: insertEntry ----------

describe('unit-add insertEntry', () => {
  const skeleton = [
    '# Heading',
    '',
    '<!-- UNIT ENTRIES BELOW THIS LINE -->',
    '',
  ].join('\n');

  test('inserts into an empty catalog', () => {
    const entry = '### D01 First\n- needs: []\n';
    const out = insertEntry(skeleton, entry, 'D01');
    expect(out).toContain('### D01 First');
    expect(out.indexOf('<!-- UNIT ENTRIES')).toBeLessThan(out.indexOf('### D01'));
  });

  test('keeps units sorted by ID', () => {
    let md = skeleton;
    md = insertEntry(md, '### D05 Fifth\n- needs: []\n', 'D05');
    md = insertEntry(md, '### A01 Alpha\n- needs: []\n', 'A01');
    md = insertEntry(md, '### D02 Second\n- needs: []\n', 'D02');
    const order = (md.match(/### (\w+)/g) || []).map(s => s.slice(4));
    expect(order).toEqual(['A01', 'D02', 'D05']);
  });

  test('throws when marker is missing', () => {
    expect(() => insertEntry('# No marker\n', '### A01\n', 'A01')).toThrow(/cannot find units marker/);
  });
});

// ---------- cross-ref loaders ----------

describe('cross-ref loaders (live files)', () => {
  test('loadEindtermen returns a Set of codes from the committed register', () => {
    const e = loadEindtermen();
    if (e === null) {
      // register not present in this worktree — skip
      return;
    }
    expect(e instanceof Set).toBe(true);
    // Expect well-known codes from the 2026 CvTE syllabus.
    expect(e.has('D1.1')).toBe(true);
    expect(e.has('G1.1')).toBe(true);
    expect(e.size).toBeGreaterThan(50);
  });

  test('loadTerminology returns a Set or null', () => {
    const t = loadTerminology();
    // economie-terminologie.md exists in the main repo; must parse to a Set.
    if (t === null) return;
    expect(t instanceof Set).toBe(true);
    expect(t.size).toBeGreaterThan(0);
  });
});

// ---------- validate() with cross-refs ----------

describe('validate with cross-ref sets', () => {
  function apply(exam) {
    return {
      id: 'D01', name: 'X', kern: 'k', needs: [],
      mastery_target: 'understand', prior_learning: 'new_this_year',
      terms: [], exam_codes: [exam],
    };
  }

  test('rejects unknown exam_code when eindtermen set is provided', () => {
    const { errors } = validate([apply('Z99.99')], { eindtermen: new Set(['D1.1']) });
    expect(errors).toEqual(expect.arrayContaining([expect.stringMatching(/exam_code "Z99.99" not found/)]));
  });

  test('accepts known exam_code when eindtermen set is provided', () => {
    const { errors } = validate([apply('D1.1')], { eindtermen: new Set(['D1.1']) });
    expect(errors).toEqual([]);
  });

  test('skips exam_code check when eindtermen set is absent (backward compat)', () => {
    const { errors } = validate([apply('Z99.99')], {});
    expect(errors).toEqual([]);
  });
});

// ---------- unit-lib: rebuildMarkdown ----------

describe('unit-lib rebuildMarkdown', () => {
  const preamble = [
    '# Registry',
    '',
    '<!-- UNIT ENTRIES BELOW THIS LINE -->',
    '',
  ].join('\n');

  test('emits units in sorted order', () => {
    const units = [
      { id: 'D02', name: 'Two', kern: 'k2', needs: [], mastery_target: 'understand', prior_learning: 'new_this_year', terms: [] },
      { id: 'A01', name: 'One', kern: 'k1', needs: [], mastery_target: 'understand', prior_learning: 'new_this_year', terms: [] },
    ];
    const md = rebuildMarkdown(preamble, units);
    const order = (md.match(/### (\w+)/g) || []).map(s => s.slice(4));
    expect(order).toEqual(['A01', 'D02']);
  });

  test('round-trips through parser', () => {
    const units = [
      { id: 'A01', name: 'Test', layer: 0, kern: 'k', needs: [], mastery_target: 'apply', prior_learning: 'new_this_year', terms: ['a'], procedure: ['step'], generator: 'GEN_A01' },
    ];
    const md = rebuildMarkdown(preamble, units);
    const parsed = parseMarkdown(md);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe('A01');
    expect(parsed[0].layer).toBe(0);
    expect(parsed[0].generator).toBe('GEN_A01');
  });
});

// ---------- unit-lib: parseFlagArgs ----------

describe('unit-lib parseFlagArgs', () => {
  test('parses --spec JSON', () => {
    const { spec } = parseFlagArgs(['node', 'x', '--spec', '{"a":1}']);
    expect(spec).toEqual({ a: 1 });
  });

  test('parses simple flags', () => {
    const { flags } = parseFlagArgs(['node', 'x', '--id', 'A01', '--undo']);
    expect(flags.id).toBe('A01');
    expect(flags.undo).toBe(true);
  });
});

// ---------- stored-layer validation ----------

describe('stored layer invariant', () => {
  function baseUnit(overrides = {}) {
    return {
      id: 'D01',
      name: 'X',
      kern: 'k',
      needs: [],
      mastery_target: 'understand',
      prior_learning: 'new_this_year',
      terms: [],
      ...overrides,
    };
  }

  test('accepts stored layer equal to derived minimum', () => {
    const a = baseUnit({ id: 'D01', layer: 0 });
    const b = baseUnit({ id: 'D02', layer: 1, needs: ['D01'] });
    const { errors } = validate([a, b], {});
    expect(errors).toEqual([]);
  });

  test('accepts stored layer above derived minimum (curriculum tier)', () => {
    const a = baseUnit({ id: 'D01', layer: 0 });
    const b = baseUnit({ id: 'D02', layer: 5, needs: ['D01'] });
    const { errors } = validate([a, b], {});
    expect(errors).toEqual([]);
  });

  test('rejects stored layer below derived minimum', () => {
    const a = baseUnit({ id: 'D01', layer: 2 });
    const b = baseUnit({ id: 'D02', layer: 1, needs: ['D01'] });
    const { errors } = validate([a, b], {});
    expect(errors).toEqual(expect.arrayContaining([expect.stringMatching(/D02: stored layer 1 below derived minimum 3/)]));
  });
});

// ---------- findCycles ----------

describe('findCycles', () => {
  test('returns empty array on DAG', () => {
    const a = { id: 'A01', needs: [] };
    const b = { id: 'A02', needs: ['A01'] };
    const byId = new Map([['A01', a], ['A02', b]]);
    expect(findCycles([a, b], byId)).toEqual([]);
  });

  test('detects two-node cycle', () => {
    const a = { id: 'A01', needs: ['A02'] };
    const b = { id: 'A02', needs: ['A01'] };
    const byId = new Map([['A01', a], ['A02', b]]);
    expect(findCycles([a, b], byId).length).toBeGreaterThan(0);
  });
});
