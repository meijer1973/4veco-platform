'use strict';
const fs=require('fs'),path=require('path');
const successor=require('./lib/book2-signed-registry-successor');
const {validate}=require('./check-mtu-h7-protected-canonical-adjudication-bundle-4');
const root=path.resolve(__dirname,'../..');
const current=()=>JSON.parse(fs.readFileSync(path.join(root,successor.PATH),'utf8'));
const matrix='reports/mtu-hardening/mtu-h7-protected-canonical-adjudication-matrix-4.json';
const packet='reports/mtu-hardening/mtu-h7-protected-canonical-adjudication-bundle-4.json';
function withMutation(file,mutate,run) {
  const absolute=path.join(root,file),original=fs.readFileSync.bind(fs);
  const value=JSON.parse(original(absolute,'utf8'));mutate(value);
  const bytes=Buffer.from(JSON.stringify(value));
  const spy=jest.spyOn(fs,'readFileSync').mockImplementation((name,options)=>{
    if(String(name)===absolute)return typeof options==='string'||options?.encoding?bytes.toString('utf8'):bytes;
    return original(name,options);
  });
  try{return run();}finally{spy.mockRestore();}
}
test('exact reviewed registry reconstructs the complete historical registry and passes actual protected gate',()=>{
  const resolution=successor.resolve(current());
  expect(resolution.accepted).toBe(true);
  expect(resolution.before).toBe(successor.BEFORE);
  const result=validate();
  expect(result.failures).toEqual([]);
  expect(result.summary.negative_mutations_detected).toBe(7);
  expect(result.summary.reviewed_registry_successor.after).toBe(successor.AFTER);
});
test.each(['A15 character','unrelated unit','partial application'])('rejects %s',fault=>{
  const units=current();
  if(fault==='A15 character')units.find(x=>x.id==='A15').procedure[0]+='x';
  if(fault==='unrelated unit')units.find(x=>x.id==='A01').name+='x';
  if(fault==='partial application')units.find(x=>x.id==='A82').procedure=successor.resolve(current()).historical.find(x=>x.id==='A82').procedure;
  expect(successor.resolve(units).accepted).toBe(false);
});
test('historical view applies only to the two sealed A15 forbidden guards',()=>{
  const units=current(),r=successor.resolve(units),live=units.find(x=>x.id==='A15');
  const binding={id:'A15',role:'forbidden_over_trigger_guard'};
  for(const op of ['h7-ha23-2-q15-net-ratio-nivellering','h7-vw24-1-q17-insurance-cost-benefit'])
    expect(successor.comparisonUnit(r,op,binding,live)).toEqual(r.historical.find(x=>x.id==='A15'));
  expect(successor.comparisonUnit(r,'unreviewed',binding,live)).toBe(live);
  expect(successor.comparisonUnit(r,'h7-ha23-2-q15-net-ratio-nivellering',{...binding,role:'full_fit'},live)).toBe(live);
});
test('actual gate rejects an altered old semantic snapshot',()=>{
  const result=withMutation(matrix,doc=>{doc.operations[0].semantic_binding.mtu_objects.find(x=>x.id==='A15').semantic_snapshot.procedure[0]+='x';},validate);
  expect(result.failures.some(x=>x.includes('live MTU semantic binding drifted'))).toBe(true);
});
test('actual gate rejects releasing A15 from its forbidden role',()=>{
  const result=withMutation(matrix,doc=>{doc.operations[0].semantic_binding.mtu_objects.find(x=>x.id==='A15').role='full_fit';},validate);
  expect(result.failures.some(x=>x.includes('live MTU semantic binding drifted'))).toBe(true);
});
test('actual gate requires the original packet source hash; repinning it to new bytes fails',()=>{
  const result=withMutation(packet,doc=>{doc.source_hashes.find(x=>x.path===successor.PATH).sha256=successor.AFTER;},validate);
  expect(result.failures).toContain('source hash mismatch: '+successor.PATH);
});
test('actual gate rejects a one-character current A15 mutation',()=>{
  const result=withMutation(successor.PATH,doc=>{doc.find(x=>x.id==='A15').procedure[0]+='x';},validate);
  expect(result.failures).toContain('source hash mismatch: '+successor.PATH);
  expect(result.failures.some(x=>x.includes('live MTU semantic binding drifted'))).toBe(true);
});
