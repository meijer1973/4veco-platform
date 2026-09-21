'use strict';
// Historical comparison only. This exact four-unit successor does not authorize
// any H7 operation, change a forbidden role, or rewrite the protected packet.
const crypto=require('crypto');
const proposals=require('../../../reports/review-gates/book2-theory-signed-20260921/reference-proposals.json');
const PATH='references/machine/micro-teaching-units.json';
const BEFORE='6588a10086ecd1a0f08ac4ff3870469ad011c13970737b27d66f21f59e2dc1cd';
const AFTER='a67185a7e2f8b3389dccf9ef9108036cd02f0bfe2c270fed0fba15552332aaf8';
const OPERATIONS=new Set(['h7-ha23-2-q15-net-ratio-nivellering','h7-vw24-1-q17-insurance-cost-benefit']);
const hash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
function resolve(registry) {
  if(hash(registry)!==AFTER)return {accepted:false};
  const historical=structuredClone(registry);
  for(const id of ['A15','A82','A83','A84']) {
    const unit=historical.find(row=>row.id===id),proposal=proposals.units[id];
    if(!unit||!proposal)return {accepted:false};
    for(const [key,value] of Object.entries(proposal.patch)) {
      if(hash(unit[key])!==hash(value))return {accepted:false};
      unit[key]=structuredClone(proposal.before[key]);
    }
  }
  if(hash(historical)!==BEFORE)return {accepted:false};
  return {accepted:true,historical,before:BEFORE,after:AFTER};
}
function comparisonUnit(resolution,operationId,binding,liveUnit) {
  if(resolution.accepted && OPERATIONS.has(operationId) &&
      binding.id==='A15' && binding.role==='forbidden_over_trigger_guard')
    return resolution.historical.find(unit=>unit.id==='A15');
  return liveUnit;
}
module.exports={PATH,BEFORE,AFTER,resolve,comparisonUnit};
