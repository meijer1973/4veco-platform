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
