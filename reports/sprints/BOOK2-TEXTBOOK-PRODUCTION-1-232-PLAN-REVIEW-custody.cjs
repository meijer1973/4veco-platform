'use strict';
// Hash custody and read-only historical evidence inspection. Only new own output.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const BP='8e2c8aff7d71875ce38740be410d2d771c1516b3',BL='9daf4b8a9696fcdce1d485d85dbc0c59b7b6dbe6';
const PREFIX='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-REVIEW';
const AP='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN';
const indexes=['platform','lessen'].flatMap(r=>['json','md'].map(x=>`reports/github-agent-index-${r}.${x}`));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:128*1024*1024}).trim();
const read=(root,rel)=>fs.readFileSync(path.join(root,rel));
const row=(root,rel)=>{const b=read(root,rel);return {path:rel,bytes:b.length,raw_sha256:sha(b),lf_sha256:sha(b.toString('utf8').replace(/\r\n?/g,'\n'))};};
const json=rel=>JSON.parse(read(P,rel));
const save=(name,data)=>fs.writeFileSync(path.join(P,PREFIX+'-'+name+'.json'),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const mode=process.argv[2];
if(mode==='baseline'){
 const old='C:/wt/book2-223-alt-review-20260906/4veco-platform/reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT-REVIEW-baseline.json';
 const prior=JSON.parse(fs.readFileSync(old));
 const instructions=prior.instructions.map(v=>{const root=v.repository==='4veco-platform'?P:L;const actual=row(root,v.path);assert.equal(actual.raw_sha256,v.raw_sha256);return {...actual,repository:v.repository,previous_personally_read_sha256:v.raw_sha256,unchanged:true};});
 for(const rel of ['skills/econ-textbook-paragraph.md','skills/econ-paragraph-review.md','skills/econ-quality-control.md','agents/teacher-learning-quality-review-agent.md','agents/student-experience-review-agent.md'])instructions.push({...row(P,rel),repository:'4veco-platform',full_personal_read_this_review:true});
 const pdf='C:/Users/meije/.codex/plugins/cache/openai-primary-runtime/pdf/26.904.11930/skills/pdf/SKILL.md';
 const preservation=[];
 for(const [name,root,base]of [['platform',P,BP],['lessons',L,BL]]){
  const files=git(root,'ls-tree','-r','--name-only','-z',base).split('\0').filter(Boolean);
  const changed=git(root,'diff','--name-only','-z',base).split('\0').filter(Boolean);
  assert(changed.every(f=>name==='platform'&&(f.startsWith(PREFIX+'-')||indexes.includes(f))));
  const raw=files.map(f=>{assert(fs.statSync(path.join(root,f)).isFile(),f);const b=read(root,f);return {path:f,bytes:b.length,raw_sha256:sha(b)};});
  preservation.push({repository:name,base,tracked_files:raw.length,git_clean_filter_unchanged:true,rows:raw});
 }
 const historical=[];
 for(const rel of git(P,'ls-tree','-r','--name-only','-z',BP).split('\0').filter(x=>x.startsWith(AP+'-')&&x.endsWith('.json'))){
  const data=json(rel),item={...row(P,rel),exit_code:data.exit_code??null};
  if(data.command){item.command=data.command;item.args=data.args;item.stderr=data.stderr;}
  if(/checks-r[234]-process/.test(rel)){
   assert.equal(data.exit_code,0);const parsed=JSON.parse(data.stdout);
   const suffix=rel.includes('r2-')?'checks-result':rel.includes('r3-')?'checks-result-r3':'checks-result-r4';
   assert.deepEqual(parsed,json(AP+'-'+suffix+'.json'));
   item.complete_result_identity=true;item.checks=parsed.checks;item.negative_names=parsed.negative_counterexamples_rejected;
   assert.equal(parsed.plan_raw_sha256,'df3d5c11364797f0d5b7190f2c0a2ce3c7cdd86d6d5e7fefde5c6e27d6d89967');
  }
  if(/scope-.*-process/.test(rel)){const s=JSON.parse(data.stdout);assert.equal(s.categories.unknown.length,0);item.scope={ok:s.ok,failures:s.failures,counts:Object.fromEntries(Object.entries(s.categories).map(([k,v])=>[k,v.length]))};}
  historical.push(item);
 }
 const whitespace=json(AP+'-platform-whitespace-process.json');assert.equal(whitespace.exit_code,2);
 const diagnosed=[...new Set([...whitespace.stdout.matchAll(/^(reports\/[^\r\n]+):\d+: trailing whitespace\.$/gm)].map(m=>m[1]))].sort();
 assert.deepEqual(diagnosed,['checks-result','checks-result-r3','checks-result-r4'].map(s=>AP+'-'+s+'.json').sort());
 for(const f of diagnosed){const s=read(P,f).toString('utf8');assert(s.includes('\r\n'));assert(!/[ \t]+\r?\n/.test(s));}
 const book='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus';
 const c23=book+'/2.3 Hoofdstuk Surplus en welvaart';
 const pins=[
 [L,book+'/_book-plan.md','b6ae8e07e05337838dc38b2838a6e5db43b2e153569fa5bc490cf4bfeb8d7a76','lf'],
 [L,c23+'/_chapter-plan.md','e8a07bfe212a6ae817db99fecb93e86812e1d9e9af533b7ef21591bbb9025dc7','lf'],
 [L,c23+'/2.3.1 Consumentensurplus/2.3.1-review.md','8f86129b14ef508e16f41d918299da7af2422655ff14fc9ba91b68a9b66e8943','raw'],
 [L,c23+'/2.3.1 Consumentensurplus/2.3.1-quality-ref.yaml','312ca25c21bf6428ded5162f2d299b8e73da25219fbb914cad88dcb8ca47820a','raw'],
 [L,c23+'/2.3.1 Consumentensurplus/2.3.1-textbook-handoff.md','69bdae1f9dd0efaace0a90db57e6ac0f17db627f93fdb333b48dafeb36eebe79','raw'],
 [L,book+'/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3-review.md','5064642034fac9763202d2424b87cef2f7cc909aaf3a6031b90d247ee44409c3','raw']
 ].map(([root,rel,pin,contract])=>{const r=row(root,rel);assert.equal(r[contract+'_sha256'],pin);return {...r,contract,expected:pin,repository:root===P?'platform':'lessons'};});
 const meta=json('references/authored/book-outlines/book-2-outline.meta.json');
 const releases=[];
 function walk(v){if(v&&typeof v==='object'){if(['H-BOOK2-ROOT-PLAN','H-CHAPTER-23-PLAN'].includes(v.id)){assert.equal(v.status,'released');releases.push(v);}for(const x of Object.values(v))walk(x);}}
 walk(meta);assert.equal(releases.length,2);
 save('custody',{status:'PASS',platform_input:BP,lessons_input:BL,operational_plan_commit:'69649b3eff09f42a51f9cfded8328d5e3e410401',
  instructions,prior_personal_read_evidence:{path:old,raw_sha256:sha(fs.readFileSync(old))},pdf_skill:{path:pdf,raw_sha256:sha(fs.readFileSync(pdf)),personally_read:true},
  authority_pins:pins,root_chapter_release_records:releases,historical_author_evidence:historical,
  retained_native_whitespace:{exit:2,exact_CRLF_only_files:diagnosed,bytes_rewritten:false},preservation,
  diagnostic_notes:['One read-only attempt sought the prior223 baseline in this branch where it was not imported; correct immutable old pair was read next.',
   'Initial author checker on ordinary Win32 path reported an existing >260-character filename missing. Identical script and all36 probes pass with extended-path spelling; no source edit.',
   'Independent r1/r2 failures are reviewer literal/heading-parser mistakes, corrected only in owned helper; original process records retained.'],
  product_generation:false});
 console.log(JSON.stringify({status:'PASS',instructions:instructions.length,prior_files:preservation.map(r=>({repository:r.repository,count:r.tracked_files})),historical_records:historical.length,pins:pins.length,releases:releases.length}));
}else if(mode==='verify'){
 const baseline=json(PREFIX+'-custody.json');
 for(const r of baseline.preservation){const root=r.repository==='platform'?P:L;for(const v of r.rows){if(r.repository==='platform'&&indexes.includes(v.path))continue;assert.equal(sha(read(root,v.path)),v.raw_sha256,v.path);}}
 console.log('PASS every prior raw file unchanged; exact four publication indexes are the only exception');
}else throw Error('baseline or verify');
