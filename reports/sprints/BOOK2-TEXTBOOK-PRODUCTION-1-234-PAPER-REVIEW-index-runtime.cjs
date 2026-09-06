'use strict';
// Owned read-only transport. It changes neither shared source nor Git configuration.
// Only exact explicit-ref ls-tree reads receive unquoted output and a 128 MiB buffer.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),A=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),original=cp.execFileSync,sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const standard=path.join(P,'build-scripts/reports/github-agent-index.js');A.equal(sha(fs.readFileSync(standard)),'44b235b2a65b36f28c316a7d9cee947e3ce049713ddcd53ced2321a7a9ec9b53');
for(const [k,root]of [['PLATFORM',P],['LESSEN',L]]){A.equal(path.resolve(process.env['FOURVECO_'+k+'_ROOT']),root);A.match(process.env['FOURVECO_'+k+'_SOURCE_REF'],/^[a-f0-9]{40}$/);A.equal(process.env['FOURVECO_'+k+'_SOURCE_BRANCH'],'agent/book2-234-paper-review-20260906');}
if(require.main!==module){
 cp.execFileSync=function(exe,args,opts){const root=opts?.cwd&&path.resolve(opts.cwd),key=root===P?'PLATFORM':root===L?'LESSEN':null;
  if(exe==='git'&&key&&JSON.stringify(args)===JSON.stringify(['ls-tree','-r','--name-only',process.env['FOURVECO_'+key+'_SOURCE_REF'],'--'])&&opts.maxBuffer===undefined)return original(exe,['-c','core.quotepath=false',...args],{...opts,maxBuffer:128*1024*1024});
  return original(exe,args,opts);
 };
}else if(process.argv[2]==='verify'){
 const rows=[];for(const [label,root,key]of [['platform',P,'PLATFORM'],['lessen',L,'LESSEN']]){
  const j=fs.readFileSync(path.join(P,'reports/github-agent-index-'+label+'.json')),v=JSON.parse(j),md=fs.readFileSync(path.join(P,'reports/github-agent-index-'+label+'.md'),'utf8');
  A.match(v.source_commit,/^[a-f0-9]{40}$/);A.equal(v.source_branch,process.env['FOURVECO_'+key+'_SOURCE_BRANCH']);
  const raw=original('git',['ls-tree','-r','--name-only','-z',v.source_commit,'--'],{cwd:root,maxBuffer:128*1024*1024});
  const skip=new Set(v.skipped_directories),expected=raw.toString('utf8').split('\0').filter(Boolean).filter(f=>!f.split('/').some(x=>skip.has(x))).sort(),actual=[...new Set(Object.values(v.groups).flat())].sort();
  A.deepEqual(actual,expected);A.equal(v.file_count,expected.length);A(!actual.includes('.git'));A(md.includes(v.source_commit));
  for(const [group,files]of Object.entries(v.groups)){A(md.includes('## '+group));for(const f of files)A(md.split('\n').includes('- '+f));}
  rows.push({label,source_commit:v.source_commit,files:expected.length,nul_inventory_sha256:sha(raw),index_json_sha256:sha(j),index_markdown_sha256:sha(md),actual_NUL_filename_set_exact:true,quoted_line_comparison:false});
 }
 console.log(JSON.stringify({status:'ACTUAL_NUL_FILENAMES_EXACT',rows,shared_source_sha256:sha(fs.readFileSync(standard))},null,2));
}else throw Error('verify');
