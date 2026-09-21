const { GEN: generators } = require('../skilltree/generators');
const { classifyDemand, measureDemand } = generators.A15;

describe('actual A15 signed-elasticity operations', () => {
  test.each([
    [-2, 'elastisch'], [-0.5, 'inelastisch'], [-1, 'eenheidselastisch'],
    [0, 'volkomen inelastisch'], [-0.999, 'inelastisch'], [-1.001, 'elastisch'],
    [2, 'geen gewone negatieve eigen-prijsindeling'], [NaN, 'niet gedefinieerd'],
  ])('%s keeps its sign and exact boundary', (ev, expected) => {
    expect(classifyDemand(ev)).toBe(expected);
  });
  test('measurement uses old values; zero price change is undefined', () => {
    expect(measureDemand(10, 500, 12, 420)).toEqual({ priceChange: 20, quantityChange: -16, ev: -0.8 });
    expect(measureDemand(20, 1000, 22, 800).ev).toBe(-2);
    expect(Number.isNaN(measureDemand(10, 100, 10, 80).ev)).toBe(true);
    expect(() => measureDemand(0, 100, 10, 80)).toThrow(RangeError);
  });
  test.each([
    [2, 2.2, 200, 220, 900, 'eenheidselastisch'],
    [2.4, 2.64, 240, 264, 900, 'eenheidselastisch'],
    [2.2, 1.98, 220, 198, 1100, 'eenheidselastisch'],
    [9.2, 9.66, 920, 966, 950, 'eenheidselastisch'],
    [2, 2.2, 200, 220, 900.1, 'inelastisch'],
    [2, 2.2, 200, 220, 899.9, 'elastisch'],
  ])('euro/cent observations preserve the same classification (%s to %s)',
    (oldEuro, newEuro, oldCent, newCent, quantity, expected) => {
      expect(classifyDemand(measureDemand(oldEuro, 1000, newEuro, quantity).ev)).toBe(expected);
      expect(classifyDemand(measureDemand(oldCent, 1000, newCent, quantity).ev)).toBe(expected);
    });
  test.each([[9.9, 990, 10, 980, 990, 1000], [9.99, 999, 10, 998, 999, 1000],
    [2e-7, 1000, 2.2e-7, 900, 2e-5, 2.2e-5]])(
    'exact decimal boundary survives small changes and scientific notation', (p, q, pNew, qNew, pCent, pNewCent) => {
      expect(measureDemand(p, q, pNew, qNew).ev).toBe(-1);
      expect(classifyDemand(measureDemand(pCent, q, pNewCent, qNew).ev)).toBe('eenheidselastisch');
    });
  test('all cent-priced unitary observations through EUR 100 are unit invariant', () => {
    let checked = 0;
    for (let oldCents = 1; oldCents <= 10000; oldCents++) {
      for (const percent of [5, 10, 20, 25, 50]) {
        if ((oldCents * percent) % 100) continue;
        const newCents = oldCents + oldCents * percent / 100;
        const quantity = 1000 - 10 * percent;
        expect(measureDemand(oldCents / 100, 1000, newCents / 100, quantity).ev).toBe(-1);
        expect(measureDemand(oldCents, 1000, newCents, quantity).ev).toBe(-1);
        checked++;
      }
    }
    expect(checked).toBe(11000);
    expect(Number.isNaN(measureDemand(2.2, 1000, 2.2, 1000).ev)).toBe(true);
  });
  test('classification does not round or absorb a non-unitary quotient', () => {
    expect(classifyDemand(-1 + 4 * Number.EPSILON)).toBe('inelastisch');
    expect(classifyDemand(-1 - 4 * Number.EPSILON)).toBe('elastisch');
    expect(classifyDemand(-1 + 1e-12)).toBe('inelastisch');
    expect(classifyDemand(-1 - 1e-12)).toBe('elastisch');
    expect(classifyDemand(Number.EPSILON)).toBe('geen gewone negatieve eigen-prijsindeling');
    expect(classifyDemand(-Number.EPSILON)).toBe('inelastisch');
    expect(classifyDemand(Infinity)).toBe('niet gedefinieerd');
    expect(classifyDemand(-Infinity)).toBe('niet gedefinieerd');
  });
  test('observed positive quotient is not silently made negative', () => {
    const observed = measureDemand(10, 100, 11, 120);
    expect(observed.ev).toBe(2);
    expect(classifyDemand(observed.ev)).toBe('geen gewone negatieve eigen-prijsindeling');
  });
  test('live generated questions use signed classification and retain paired calculations', () => {
    for (let i = 0; i < 80; i++) {
      const exercise = generators.A15();
      const copy = JSON.stringify(exercise);
      expect(copy).not.toMatch(/\|Ev\||absolute waarde/);
      expect(copy).toContain('Behoud het teken');
      expect(copy).toContain('oorspronkelijke');
      const step = exercise.steps.find(s => s.mode === 'mc' && s.q.startsWith('De Ev ='));
      const ev = Number(step.q.match(/De Ev = (-?\d+(?:\.\d+)?)/)[1]);
      expect(step.options[step.correctIdx]).toBe(classifyDemand(ev));
    }
  });
});
