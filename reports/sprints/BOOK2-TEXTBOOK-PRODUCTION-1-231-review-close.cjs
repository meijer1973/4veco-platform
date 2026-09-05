// Bounded independent-review publication checks; real Git ranges, no fixtures.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const root=process.cwd(),lesson=path.resolve(root,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-231-review';
const pbase='85fa4910a7e6bcac69b36c38bffdf6c0d10d0c68',lbase='384d9967a124fcc917a2eea3fe549829919cbeb7';
const review='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus/2.3.1-review.md';
const git=(cwd,...args)=>cp.execFileSync('git',['-C',cwd,...args]);
const list=b=>b.toString('utf8').split('\0').filter(Boolean);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const save=(name,value)=>fs.writeFileSync(`reports/sprints/${prefix}-${name}.json`,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const ownPath=p=>p.startsWith(`reports/sprints/${prefix}-`)||/^reports\/sprints\/BOOK2-TEXTBOOK-PRODUCTION-1-231-REVIEW-command-log\.(jsonl|md)$/.test(p)||/^reports\/sprints\/BOOK2-TEXTBOOK-PRODUCTION-1-231-build-(attempt|manifest)-r(11|12|13)\.json$/.test(p)||/^reports\/rendered-proof\/BOOK2-TEXTBOOK-PRODUCTION-1\/231-(paragraaf|opgaven|antwoorden)-[a-f0-9]{12}-r(11|12|13)\/(manifest\.json|contact-sheet\.png|pages\/page-\d{3}\.png)$/.test(p);
const inventory=(repo,paths)=>paths.map(p=>({path:p,sha256:sha(fs.readFileSync(path.join(repo,p)))}));
if(process.argv[2]==='preflight'){
 const p=[...new Set([...list(git(root,'diff',pbase,'--name-only','-z')),...list(git(root,'ls-files','--others','--exclude-standard','-z'))])];
 const l=[...new Set([...list(git(lesson,'diff',lbase,'--name-only','-z')),...list(git(lesson,'ls-files','--others','--exclude-standard','-z'))])];
 if(!p.every(ownPath)||l.length!==1||l[0]!==review)throw Error('Unexpected owned path');
 const result={status:'PASS_STRICT_REVIEW_ONLY_PATHS',platform_base:pbase,lesson_base:lbase,platform:inventory(root,p),lessons:inventory(lesson,l),self_exclusion:'This generated preflight record and its subsequent command-log append are outside their own pre-write inventory; committed scope binds them next.'};
 save('preflight',result);console.log({status:result.status,platform_paths:p.length,lesson_paths:l.length});
}else if(process.argv[2]==='scope'){
 const phead=git(root,'rev-parse','HEAD').toString().trim(),lhead=git(lesson,'rev-parse','HEAD').toString().trim();
 const p=list(git(root,'diff','--name-only','-z',pbase,phead)),l=list(git(lesson,'diff','--name-only','-z',lbase,lhead));
 if(!p.every(ownPath)||l.length!==1||l[0]!==review)throw Error('Unexpected committed review path');
 const ranges=[['owned_platform','shared',root,pbase,phead],['owned_lessons','textbook',lesson,lbase,lhead],['complete_platform','shared',root,'96416b6b5bd57094576e9aba0a42d682584ec479',phead],['complete_lessons','textbook',lesson,'f09fd6e88edc5049b026b16b0158e7e188091d2d',lhead]];
 const checks=ranges.map(([name,lane,cwd,base,head])=>{const args=['build-scripts/workflows/check-paragraph-lane-scope.js','--lane',lane,'--cwd',cwd,'--base',base,'--head',head,'--json'];const r=cp.spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',maxBuffer:50*1024*1024});return {name,command:process.execPath,args,status:r.status,stderr:r.stderr,summary:JSON.parse(r.stdout)};});
 const by=Object.fromEntries(checks.map(x=>[x.name,x]));
 if(by.owned_platform.status!==1||by.owned_platform.summary.categories.unknown.length!==0||by.owned_platform.summary.failures.length!==2)throw Error('Unexpected own evidence-only scope');
 if(by.complete_platform.status!==1||by.complete_platform.summary.categories.unknown.length!==66||by.complete_platform.summary.failures.length!==1)throw Error('Unexpected inherited scope');
 if(by.owned_lessons.status!==0||by.complete_lessons.status!==0)throw Error('Unexpected lesson scope');
 const result={status:'STRICT_OWNED_PATHS_PASS_NATIVE_PLATFORM_FAIL_PRESERVED',platform_head:phead,lesson_head:lhead,owned_platform_base:pbase,owned_lesson_base:lbase,platform_paths:inventory(root,p),lesson_paths:inventory(lesson,l),canonical_review_raw_sha256:sha(fs.readFileSync(path.join(lesson,review))),canonical_review_lf_sha256:sha(Buffer.from(fs.readFileSync(path.join(lesson,review),'utf8').replaceAll('\r\n','\n'))),native_checks:checks,interpretation:'Native owned-platform evidence-only range FAILS for absent shared source and tail-only rule. Complete original candidate FAILS solely for 66 historical UNKNOWN grayscale paths. Both actual lesson scopes PASS. None is waived; root corrected candidate requires separate native checks.'};
 save('scope',result);console.log(JSON.stringify({status:result.status,platform_head:phead,lesson_head:lhead,canonical_review_raw_sha256:result.canonical_review_raw_sha256,canonical_review_lf_sha256:result.canonical_review_lf_sha256,checks:checks.map(c=>({name:c.name,status:c.status,unknown:c.summary.categories.unknown.length,failures:c.summary.failures.length}))},null,2));
}else throw Error('Expected preflight or scope');
