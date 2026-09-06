// HOW TO ADAPT: read-only index-buffer diagnosis; never patch shared tools.
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {execFileSync}=require('child_process');
const root=path.resolve(__dirname,'../..'),ref='43dd62450b2b3b8b3d1b3c01232945f688bb67f6';
const args=['ls-tree','-r','--name-only',ref,'--'];
let failure;
try{execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']});}
catch(error){failure={code:error.code,errno:error.errno,syscall:error.syscall,status:error.status,message:error.message};}
if(!failure)throw Error('Expected observed default-buffer failure did not recur');
const bytes=execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
const result={actor:'paragraph_224_builder',ref,command:['git',...args],default_buffer_failure:failure,successful_read_only_retry:{maxBuffer:64*1024*1024,byte_length:bytes.length,raw_sha256:crypto.createHash('sha256').update(bytes).digest('hex'),paths:bytes.toString('utf8').trim().split(/\r?\n/).length},decision:'Keep shared index code exact. Use its existing explicit platform SOURCE_REF=HEAD route after clean commit and verify resulting full tracked inventory against actual Git. Keep lesson ref exact. Original generator failure wrote no indexes; subsequent stale freshness failure was expected, not PASS.'};
const out=path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-224-BUILD-index-diagnostic.json');
fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result,null,2));
