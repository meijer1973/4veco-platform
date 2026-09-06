'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-224-PRODUCTION-RELEASE';
const base='e2ddb153c4da67b4707809ea9931f914805293dd',lh='8a3d4018ad6a5082449a17c59f991cbdc93fbb62',head=process.argv[2];
a.match(head,/^[a-f0-9]{40}$/);const commands=[];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,maxBuffer:128*1024*1024});
a.equal(git(P,'rev-parse','HEAD').toString().trim(),head);a.equal(git(L,'rev-parse','HEAD').toString().trim(),lh);
a.equal(git(P,'status','--porcelain').toString().trim(),'');a.equal(git(L,'status','--porcelain').toString().trim(),'');
function tree(cwd,ref){return new Map(git(cwd,'ls-tree','-r','-z',ref).toString('utf8').split('\0').filter(Boolean).map(s=>{const tab=s.indexOf('\t');return[s.slice(tab+1),s.slice(0,tab).split(' ')[2]];}));}
const changed=git(P,'diff','--name-only','--no-renames','-z',base,head).toString().split('\0').filter(Boolean);
for(const n of changed)a(n.startsWith('reports/sprints/'+prefix+'-'),n);
const custody=[];
for(const[cwd,prior,current]of[[P,base,head],[L,lh,lh]]){
 const old=tree(cwd,prior),now=tree(cwd,current);
 for(const[n,blob]of old)a.equal(now.get(n),blob,'prior file changed: '+n);
 const names=[...now.keys()],stdin=names.map(n=>JSON.stringify(n)).join('\n')+'\n';
 const actual=cp.execFileSync('git',['-c','core.longpaths=true','hash-object','--no-filters','--stdin-paths'],{cwd,input:stdin,encoding:'utf8',maxBuffer:128*1024*1024}).trim().split(/\r?\n/);
 a.equal(actual.length,names.length);for(let i=0;i<names.length;i++)a.equal(actual[i],now.get(names[i]),names[i]);
 custody.push({repository:path.basename(cwd),baseline:prior,head:current,inherited_files_exact:old.size,all_actual_raw_git_blobs_exact:now.size});
}
function run(args,cwd=P,expected=0){const r=cp.spawnSync(args[0],args.slice(1),{cwd,maxBuffer:128*1024*1024});
 const rec={args,cwd,exit_code:r.status,stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8'),stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64')};commands.push(rec);
 if(expected!==null)a.equal(r.status,expected,JSON.stringify(rec));return rec;}
const scopes=[];
for(const[label,cwd,lane,b,h,expected]of[
 ['release-only-platform',P,'shared',base,head,1],
 ['unchanged-lessons',L,'textbook',lh,lh,1],
 ['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',head,0],
 ['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lh,0]]){
 const result=JSON.parse(run(['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',b,'--head',h,'--json'],P,expected).stdout);
 a.equal(result.categories.unknown.length,0);a.equal(result.ok,expected===0);scopes.push({label,result});
}
run(['git','diff','--check',base,head]);run(['git','diff','--check',lh,lh],L);
const white=run(['git','diff','--check','96416b6b5bd57094576e9aba0a42d682584ec479',head],P,null);
const cr=run(['git','-c','core.whitespace=cr-at-eol','diff','--check','96416b6b5bd57094576e9aba0a42d682584ec479',head],P,null);
const result={status:'PASS',platform:{base,head},lessons:{head:lh,unchanged:true},strict_owned_paths:changed.map(n=>({path:n,raw_sha256:hash(fs.readFileSync(path.join(P,n)))})),custody,scopes,complete_historical_whitespace:{default_exit:white.exit_code,cr_at_eol_exit:cr.exit_code,no_foreign_normalization:true},commands};
fs.writeFileSync(path.join(__dirname,prefix+'-scope.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'PASS',head,changed:changed.length,custody,scopes:scopes.map(s=>({label:s.label,ok:s.result.ok,counts:Object.fromEntries(Object.entries(s.result.categories).map(([k,v])=>[k,v.length]))})),historical_whitespace:result.complete_historical_whitespace},null,2));
