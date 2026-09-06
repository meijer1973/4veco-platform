// One-shot payload evidence; HOW TO ADAPT: create a new phase, never rebind this record.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-book-proof-namespace',base='8bd4bd66fa0352a770f5069c50ee1bbdf2f651bd',lh='30f57bfad2096c7afa507da48db9d82ee35a3c23',head=process.argv[2];
a.match(head,/^[a-f0-9]{40}$/);
const commands=[],sources=['build-scripts/books/build-book.py','build-scripts/books/lib_book.py','build-scripts/content/book-2/book_pipeline.py','build-scripts/content/book-2/test_book_proof_namespace.py'];
const logs=['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.md','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.jsonl'];
function sha(data){return crypto.createHash('sha256').update(data).digest('hex');}
function run(args,cwd=P,expected=0){const r=cp.spawnSync(args[0],args.slice(1),{cwd,maxBuffer:64*1024*1024});a(r.stdout&&r.stderr,'missing command output');const row={args,cwd,exit_code:r.status,stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8'),stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64')};commands.push(row);if(expected!==null)a.equal(r.status,expected,JSON.stringify(row));return row;}
a.equal(run(['git','rev-parse','HEAD']).stdout.trim(),head);
a.equal(run(['git','rev-parse','HEAD'],L).stdout.trim(),lh);
a.equal(run(['git','status','--porcelain'],L).stdout.trim(),'');
const dirty=run(['git','status','--porcelain']).stdout.trim().split('\n').filter(Boolean);
for(const row of dirty)a(logs.includes(row.slice(3)),row);
const changed=run(['git','diff','--name-only','--no-renames','-z',base,head]).stdout.split('\0').filter(Boolean);
for(const n of changed)a(sources.includes(n)||logs.includes(n)||n.startsWith('reports/sprints/'+prefix+'-'),n);
for(const n of sources)a(changed.includes(n),'missing source change '+n);
const sourceBindings=sources.map(n=>{const bytes=fs.readFileSync(path.join(P,n)),blob=cp.execFileSync('git',['show',head+':'+n],{cwd:P});a.equal(bytes.toString('utf8').replace(/\r\n/g,'\n'),blob.toString('utf8').replace(/\r\n/g,'\n'),n);return {path:n,raw_sha256:sha(bytes),git_sha256:sha(blob),git_blob:run(['git','rev-parse',head+':'+n]).stdout.trim()};});
const preserved=['build-scripts/content/book-2/print_pipeline.py','build-scripts/content/book-2/chapter_pipeline.py','build-scripts/content/book-2/test_book_pipeline.py','build-scripts/content/book-2/test_chapter_pipeline.py','build-scripts/content/book-2/test_print_pipeline.py','build-scripts/books/lib_book.test.js'];
run(['git','diff','--exit-code',base,head,'--',...preserved]);
const records=fs.readFileSync(path.join(P,logs[1]),'utf8').trim().split('\n').map(s=>JSON.parse(s)).filter(r=>r.started_at>='2026-09-06T02:01:25.722Z'&&r.started_at<'2026-09-06T02:05:00.000Z');
a.equal(records.length,7);for(const r of records){a.equal(r.exit_code,0);a.match(r.stdout_sha256,/^[a-f0-9]{64}$/);a.match(r.stderr_sha256,/^[a-f0-9]{64}$/);}
const scopes=[];
for(const[label,cwd,lane,b,h]of[
 ['incremental-platform',P,'shared',base,head],
 ['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',head],
 ['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lh]]){
 const r=JSON.parse(run(['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',b,'--head',h,'--json']).stdout);a.equal(r.ok,true);a.equal(r.categories.unknown.length,0);scopes.push({label,result:r});
}
run(['git','diff','--check',base,head]);
const whole=run(['git','diff','--check','96416b6b5bd57094576e9aba0a42d682584ec479',head],P,null);
const result={status:'PASS',author:'codex-root',independent_review:'PENDING',base,actual_payload:head,lessons:{base:lh,head:lh,increment:'UNCHANGED; native empty-diff lane check not claimed',clean:true},strict_owned_paths:changed,source_bindings:sourceBindings,preserved_original_sources:preserved,test_records:records,scopes,whitespace:{incremental_default_exit:0,complete_default_exit:whole.exit_code,complete_actual_diagnostics_preserved:true},commands};
fs.writeFileSync(path.join(__dirname,prefix+'-scope.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,head,owned_paths:changed.length,tests:records.length,scopes:scopes.map(s=>({label:s.label,counts:Object.fromEntries(Object.entries(s.result.categories).map(([k,v])=>[k,v.length]))})),whitespace:result.whitespace},null,2));
