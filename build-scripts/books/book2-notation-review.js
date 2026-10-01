'use strict';
// Freshness is evidence binding, never a generated review verdict.
const fs=require('fs'),path=require('path'),r=require('./book2-notation-revision'),prior=require('./exercise-route-revision');
const REPORT='reports/review-gates/book2-notation-20261001/independent-review.md';
function check({root=r.ROOT,lessons=path.resolve(root,'../4veco-lessen')}={}){
 const report=fs.readFileSync(path.join(root,REPORT),'utf8'),bytes=fs.readFileSync(path.join(lessons,r.MANIFEST));
 const bindings=[...report.matchAll(/^Review manifest SHA256: `([a-f0-9]{64})`$/gm)];
 if(bindings.length!==1||bindings[0][1]!==prior.sha(bytes))throw Error('Missing/stale independent review binding');
 const verdict=report.match(/^## 2\. Verdict\s+([^\n]+)/m)?.[1];
 if(!['PASS','PASS WITH FLAGS'].includes(verdict))throw Error('Independent review not passing');
 for(let h=1;h<=3;h++)for(let p=1;p<=4;p++)if(!report.includes(`| 2.${h}.${p} |`))throw Error('Missing paragraph coverage');
 return {revision:r.REVISION,verdict,paragraphs:12,manifest_sha256:prior.sha(bytes)};
}
if(require.main===module)console.log(JSON.stringify(check(),null,2));
module.exports={check,REPORT};
