'use strict';
// Check freshness/coverage transcription only; this never creates a review.
const fs=require('fs'),path=require('path');
const r=require('./books34-followups-revision'),prior=require('./exercise-route-revision');
const REPORT='reports/review-gates/books34-followups-20260928/independent-review.md';
function check({root=r.ROOT,lessons=path.resolve(root,'../4veco-lessen')}={}) {
  const report=fs.readFileSync(path.join(root,REPORT),'utf8');
  const manifest=fs.readFileSync(path.join(lessons,r.MANIFEST));
  const bindings=[...report.matchAll(/^Review manifest SHA256: `([a-f0-9]{64})`$/gm)];
  if(bindings.length!==1||bindings[0][1]!==prior.sha(manifest))throw Error('Missing/stale independent review binding');
  const verdict=report.match(/^## 2\. Verdict\s+([^\n]+)/m)?.[1];
  if(!['PASS','PASS WITH FLAGS'].includes(verdict))throw Error('Independent follow-up review is not passing');
  const routes=JSON.parse(fs.readFileSync(path.join(lessons,r.EDITION,'curriculum/lesson-routes-v3.json')));
  for(const id of Object.keys(routes))if(!new RegExp('^\\| '+id.replace(/\./g,'\\.')+' \\|','m').test(report))throw Error('Missing paragraph delta coverage '+id);
  return {revision:r.REVISION,verdict,paragraphs:Object.keys(routes).length,manifest_sha256:prior.sha(manifest)};
}
if(require.main===module){console.log(JSON.stringify(check(),null,2));}
module.exports={check,REPORT};
