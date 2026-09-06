// HOW TO ADAPT: use a new branch and exact clean source pair; never fake index lineage.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),assert=require('assert/strict'),crypto=require('crypto');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const branch='agent/book2-212-qc-20260906',p=process.argv[2],l=process.argv[3];
for(const v of [p,l])assert.match(v,/^[a-f0-9]{40}$/);
const git=(cwd,args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8'}).trim();
for(const [cwd,sha] of [[root,p],[lessons,l]]){
  assert.equal(git(cwd,['rev-parse','HEAD']),sha);
  assert.equal(git(cwd,['branch','--show-current']),branch);
  assert.equal(git(cwd,['status','--porcelain']),'');
}
const timestamp=new Date().toISOString();
const env={...process.env,FOURVECO_PLATFORM_ROOT:root,FOURVECO_LESSEN_ROOT:lessons,
  FOURVECO_PLATFORM_SOURCE_REF:p,FOURVECO_LESSEN_SOURCE_REF:l,
  FOURVECO_PLATFORM_SOURCE_BRANCH:branch,FOURVECO_LESSEN_SOURCE_BRANCH:branch,
  FOURVECO_INDEX_GENERATED_AT:timestamp};
const args=['build-scripts/reports/github-agent-index.js'];
const result=cp.spawnSync('node',args,{cwd:root,env,encoding:'utf8'});
assert.equal(result.status,0,result.stderr);
const expected=[];const index=require('../../build-scripts/reports/github-agent-index.js');
for(const [name,cwd,sha] of [['platform',root,p],['lessen',lessons,l]]){
  const json=`reports/github-agent-index-${name}.json`,md=`reports/github-agent-index-${name}.md`;
  const value=JSON.parse(fs.readFileSync(path.join(root,json),'utf8'));
  assert.deepEqual(value,index.buildIndex('4veco-'+name,cwd,{env,sourceRef:sha,generatedAt:timestamp}));
  assert.equal(value.source_commit,sha);assert.equal(value.source_branch,branch);
  const text=fs.readFileSync(path.join(root,md),'utf8');assert(text.includes(sha)&&text.includes(branch));
  expected.push(json,md);
}
const actual=cp.execFileSync('git',['diff','--name-only','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean).sort();
assert.deepEqual(actual,expected.sort());assert.equal(git(lessons,['status','--porcelain']),'');
console.log(JSON.stringify({argv:['node',...args],cwd:root,exit:result.status,stdout:result.stdout,stderr:result.stderr,
  platform_source:p,lesson_source:l,branch,timestamp,exact_native_index_equivalence:true,
  files:expected.map(n=>({path:n,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,n))).digest('hex')}))},null,2));
