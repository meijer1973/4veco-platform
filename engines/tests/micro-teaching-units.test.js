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
