// HOW TO ADAPT: task-only read-only Git stdout buffer; unchanged native indexes.
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process');
const root=path.resolve(__dirname,'../..'),real=cp.execFileSync;
for(const key of ['FOURVECO_PLATFORM_ROOT','FOURVECO_PLATFORM_SOURCE_REF','FOURVECO_PLATFORM_SOURCE_BRANCH','FOURVECO_LESSEN_ROOT','FOURVECO_LESSEN_SOURCE_REF','FOURVECO_LESSEN_SOURCE_BRANCH'])if(!process.env[key])throw Error('Missing exact paired '+key);
if(process.env.FOURVECO_PLATFORM_SOURCE_REF==='HEAD'||process.env.FOURVECO_LESSEN_SOURCE_REF==='HEAD')throw Error('No HEAD fallback');
const relative='build-scripts/reports/github-agent-index.js',entry=path.join(root,relative);
const expected=real('git',['show','b777877deb69a2094b9eff575e16e791744e85f1:'+relative],{cwd:root});
if(!fs.readFileSync(entry).equals(expected))throw Error('Shared index source changed');
cp.execFileSync=function(exe,args,options={}){
 if(exe!=='git'||!['ls-tree','ls-files','rev-parse','remote'].includes(args[0]))throw Error('Read-only native Git queries only');
 return real(exe,args,{...options,maxBuffer:64*1024*1024});
};
console.log('Unchanged native index script '+crypto.createHash('sha256').update(expected).digest('hex')+'; read-only Git stdout buffer67108864');
process.argv=[process.execPath,entry];require('module').runMain(entry);
