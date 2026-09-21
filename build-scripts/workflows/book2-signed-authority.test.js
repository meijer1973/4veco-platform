'use strict';
const successor = require('./book2-signed-authority');
const currentness = require('./check-book-outline-currentness');
const lifecycle = require('./check-book2-target-authority-remediation');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../..');

test('exact content successor is derived solely from the frozen baseline and finite deltas', () => {
  for (const [file, expected] of Object.entries(successor.expectedFiles())) {
    expect(fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n?/g,'\n')).toBe(expected);
  }
  expect(currentness.findBookOutlineFailures()).toEqual([]);
  expect(lifecycle.durableLifecycleState(lifecycle.readInputs().meta).failures).toEqual([]);
});
test.each(['status','holds','owner_approval','target_registry_pins','authority_sources','issue_229_candidate'])(
  'the signed successor cannot absorb an unlisted metadata mutation: %s', key => {
    const meta=JSON.parse(successor.expectedFiles()[successor.META]);
    meta[key]=null;
    expect(successor.matchesMeta(meta)).toBe(false);
  });
test('unlisted target edits, data, points and status cannot reuse the successor identity', () => {
  const input=lifecycle.readInputs();
  for (const mutate of [
    r=>r.exercises.find(r=>r.id==='2.1.1').lesson_goals.push('unlisted'),
    r=>r.exercises.find(r=>r.id==='2.2.1').target_exercise.subquestions[0].points++,
    r=>r.exercises.find(r=>r.id==='2.2.2').record_status='reviewed_final',
    r=>r.exercises.find(r=>r.id==='2.2.4').target_exercise.sources[0].rows[0][1]='€20',
  ]) {
    const registry=structuredClone(input.registry);mutate(registry);
    expect(successor.matchesRecords(registry.exercises.filter(r=>r.module===2),input.meta)).toBe(false);
  }
});
test('only the three exact old/new pin pairs are successors', () => {
  for(const t of successor.ledger.target_transitions) {
    expect(successor.targetSuccessor(t.id,t.before,t.after)).toBe(true);
    expect(successor.targetSuccessor(t.id,t.before,'0'.repeat(64))).toBe(false);
    expect(successor.targetSuccessor('2.3.1',t.before,t.after)).toBe(false);
  }
});
test('ordinary production and assembly holds remain effective', () => {
  const files=currentness.readFiles();
  expect(currentness.findBookOutlineFailures(files,{requireApproved:true,action:'paragraph_production',paragraph:'2.2.1'}).join('\n')).toContain('H-221-PRIOR');
  expect(currentness.findBookOutlineFailures(files,{requireApproved:true,action:'whole_book_assembly'}).join('\n')).toContain('H-BOOK2-ROOT-PLAN');
});
