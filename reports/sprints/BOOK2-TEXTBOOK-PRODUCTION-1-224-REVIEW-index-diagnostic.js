// HOW TO ADAPT: preserve the actual first native index's quoted-path mismatch.
'use strict';
const fs=require('fs'),cp=require('child_process'),crypto=require('crypto'),path=require('path');
const P=path.resolve(__dirname,'../..'),prefix='BOOK2-TEXTBOOK-PRODUCTION-1-224-REVIEW';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const records=[];
for(const [repo,cwd,ref] of [['platform',P,'ab5de28d34d31cc7aa7979ac929f4750996d6e53'],['lessen',path.resolve(P,'../4veco-lessen'),'8fdf0e74885b19993998e69ac789e8bb91e860f8']]){
 const file='reports/github-agent-index-'+repo+'.json';
 const raw=cp.execFileSync('git',['show','1e7b9c2999926ee1c26177dab31f9c417472ba6d:'+file],{cwd:P,maxBuffer:64*1024*1024});
 const j=JSON.parse(raw),skip=new Set(j.skipped_directories);
 const expected=cp.execFileSync('git',['ls-tree','-r','--name-only','-z',ref],{cwd,maxBuffer:64*1024*1024}).toString().split('\0').filter(Boolean).filter(p=>!p.split('/').some(x=>skip.has(x))).sort();
 const actual=[...new Set(Object.values(j.groups).flat())].sort();
 records.push({repo,source_ref:ref,index_raw_sha256:sha(raw),expected_count:expected.length,actual_count:actual.length,exact:JSON.stringify(actual)===JSON.stringify(expected),extra:actual.filter(x=>!expected.includes(x)),missing:expected.filter(x=>!actual.includes(x))});
}
const result={actor:'paragraph_231_specialist_qc',first_index_tail:'1e7b9c2999926ee1c26177dab31f9c417472ba6d',status:'FAIL_RETAINED',records,
 description:'First independent NUL-path inventory probe exited1 on lesson Unicode Git octal quoting. The surrounding shell continued to stage/commit/push four indexes, so its finalzero was not probePASS. Counts matched, decoded paths did not. No pupil/source/evidence byte changed.',
 correction:'Only task index runner process and read-only Git children receive runtime core.quotePath=false. Shared native index source, shared Git configuration, inventory selection and predicates stay unchanged. A fresh exact committed pair and separate four-index tail follow. Preserve this first tail but exclude every index tail from root adoption.'};
const output=path.join(__dirname,prefix+'-index-diagnostic.json');fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,records:records.map(x=>({repo:x.repo,expected:x.expected_count,actual:x.actual_count,exact:x.exact,extra:x.extra.length,missing:x.missing.length})),sha256:sha(fs.readFileSync(output))}));
