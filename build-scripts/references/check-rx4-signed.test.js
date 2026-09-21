'use strict';
const check=require('./check-rx4-elasticity-market-diagram-mutations');
const units=require('../../references/machine/micro-teaching-units.json');
const unit=id=>structuredClone(units.find(u=>u.id===id));
const edit=(id,from,to)=>{const u=unit(id);u.procedure=u.procedure.map(s=>s.replaceAll(from,to));return u;};
test.each(['A82','A83','A84'])('%s accepts the signed procedure and rejects restored mandatory abs',id=>{
  expect(check.procedureHasElasticityInterpretation(unit(id))).toBe(true);
  const u=unit(id);u.procedure.push('Gebruik de absolute waarde van Ev voor de indeling.');
  expect(check.procedureHasElasticityInterpretation(u)).toBe(false);
  expect(check.procedureHasElasticityInterpretation(edit(id,'Ev < −1','Ev > 1'))).toBe(false);
  expect(check.procedureHasElasticityInterpretation(edit(id,'teken','richting'))).toBe(false);
});
test.each(['A82','A83'])('%s rejects incorrect normalization and zero handling',id=>{
  expect(check.procedureHasNormalization(unit(id))).toBe(true);
  expect(check.procedureHasNormalization(edit(id,'oude waarde','nieuwe waarde'))).toBe(false);
  expect(check.procedureHasNormalization(edit(id,'niet gedefinieerd','nul'))).toBe(false);
});
test('pairing, source discipline and local/finite revenue bounds remain checked',()=>{
  expect(check.procedureHasA82Pairing(edit('A82','dezelfde situatie','een andere situatie'))).toBe(false);
  expect(check.procedureHasA83GraphDiscipline(edit('A83','schaal','kleur'))).toBe(false);
  expect(check.procedureHasA84RevenueLogic(unit('A84'))).toBe(true);
  expect(check.procedureHasA84RevenueLogic(edit('A84','kleine veranderingen','alle veranderingen'))).toBe(false);
  expect(check.procedureHasA84RevenueLogic(edit('A84','−1 < Ev ≤ 0','−1 < Ev < 0'))).toBe(false);
});
