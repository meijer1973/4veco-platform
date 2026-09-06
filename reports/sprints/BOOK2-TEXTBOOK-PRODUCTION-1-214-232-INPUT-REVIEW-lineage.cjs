'use strict';
// Read-only historical/source/native-data audit. No render, build or foreign evidence writer.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),A=require('node:assert/strict'),zlib=require('node:zlib'),yaml=require('js-yaml'),sharp=require('sharp');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),R='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-',N=R+'214-232-INPUT-REVIEW';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),rd=(r,f)=>fs.readFileSync(path.join(r,f)),json=f=>JSON.parse(rd(P,f));
const git=(r,...args)=>cp.execFileSync('git',args,{cwd:r,maxBuffer:128*1024*1024});
const old='50db4c5da142812f47bf02219e393447caedecfb',gen='build-scripts/content/book-2/b2_213.py';
const report={status:'RUNNING',actor:'paragraph_224_builder',independent_input_review:true,fresh_native_builds:0,fresh_personal_views:0,checks:[],bindings:[]};
const check=(s,f)=>{f();report.checks.push(s);};
const base=json(N+'-baseline.json'),lnames=base.repositories.find(r=>r.name==='lessons').files.map(r=>r.path);
const one=test=>{const x=lnames.filter(test);A.equal(x.length,1);return x[0];};
const folder=id=>path.posix.dirname(one(f=>f.endsWith('/'+id+'-textbook-plan.md')));
function bind(repo,f,expected,commit){const b=rd(repo==='P'?P:L,f);A.equal(sha(b),expected,f);if(commit)A(b.equals(git(repo==='P'?P:L,'show',commit+':'+f)));report.bindings.push({repository:repo,path:f,raw_sha256:sha(b),commit:commit||null});return b;}
const replacements=[
 ['724a080619f2f072151edf20980071b3bef18cd60d1904c78f4aa906be8917c8','0d14506e314a11fef0637cc66cf29036f174b94cafbf7fa5ede2eff88937500f'],
 ['de2b8ed7dcc7a3c5c6eaac400892d2d37ac5212ccb3b9972fb004115a88c1fe2','4da6e5b4f0a70273d78c067f34484c8a5f6faf164b0f09c1559b9a73ff6611fe'],
 ['74ad2ed9c44d9aa05b6d6a680d5d273f2cad4b62e4bead5db303c006514238cd','79429b9f1750710baae46751a5792e4a02e7c177888a01f5ca3a15c4039a78f7'],
 ['e168e3c2b8698d12b699fbf60e7691fbbc8a15d61bd46a7988704d3c896c805c','73bd2a2447b38c9d95cbc3bd69b8037e0f46b7564655b4513009fd6707b7b07d'],
 ['f53521ed8812a4c8b8c33c1d66b34e0afe8425c1dffb1723f37771372b2baa09','9350d60fadee3494124f7b0593bc1efcf00db5ea292d0a19fc3f10518e11d1f8']];
const original=git(P,'show',old+':'+gen);A.equal(sha(original),'6a45771783de221c3d65b32d423c1f7e90c90e84a79d30c4e175bba8836b056a');let expected=original.toString('utf8');
for(const [a,b]of replacements){A.equal(expected.split(a).length-1,1);A.equal(expected.split(b).length-1,0);expected=expected.replace(a,b);}
const current=rd(P,gen);check('whole213 independently derived from fixed original plus exactly five once-only literals',()=>A(Buffer.from(expected).equals(current)));
A.equal(sha(current),'87ce47b88520abbde45c18114816dae7630e31453c48e0c505c87b7e9b031ce4');
report.source_derivation={original_commit:old,original_raw_sha256:sha(original),candidate_raw_sha256:sha(current),replacements,complete_bytes_equal:true};
for(const [name,b]of [['unrelated source suffix',Buffer.concat([current,Buffer.from('\n# drift')])],['early return',Buffer.from(current.toString().replace('def build(','def forged_build('))],...replacements.map(([a,b],i)=>['stale pin '+i,Buffer.from(current.toString().replace(b,a))])])check('reject whole-source '+name,()=>A(!Buffer.from(expected).equals(b)));
const pre=json(R+'213-QC-ROOT-preaccept-integrity.json');A.equal(sha(rd(P,R+'213-QC-ROOT-preaccept-integrity.json')),'95570be7bb0a213a4603e2e4fca7bc50b6b5eea2cdb59ae87eb4a3bdfd928bc4');
check('root source derivation agrees with independent fixed source derivation',()=>{A.equal(pre.subject.source.original_sha256,sha(original));A.equal(pre.subject.source.candidate_sha256,sha(current));A.deepEqual(pre.subject.source.five_once_only_literals,replacements);});
for(const [f,h]of Object.entries(pre.subject.source.preserved))check('whole original source/guard preserved '+f,()=>bind('P',f,h,old));
const testCounts=['test_source.py','test_bonus_contract.py'].map(f=>(rd(P,'build-scripts/content/book-2/213/'+f).toString().match(/^\s*def test_/gm)||[]).length);A.deepEqual(testCounts,[13,4]);report.original_test_methods=testCounts;
for(const r of pre.subject.inputs)check('actual213 consumed incoming '+r.path,()=>{const b=bind('L',r.path,r.raw_sha256,'1cf1c1f972f196791fb37f6bbee523b7a2e3b676');A.equal(sha(r.mode==='lf'?b.toString('utf8').replace(/\r\n?/g,'\n'):b),r.expected);});
const accepted={'2.1.1':['5e14325d70b6cc6aee643d9b57395c92b0904ffb','1fb8ce8555983dcb24a6192cc0a6a85ecc8c1c14','45064bdfe0c1548f25f097eef648400382403cdf'],
 '2.1.2':['42996c60b4a93843dfe8488b8e5a3ea704871667','82576440780607b06d8acb646d6030811740728b','6139336793edd9e79037fbae1be1586a5cc3a2ba'],
 '2.1.3':['1cf1c1f972f196791fb37f6bbee523b7a2e3b676','65da7f3930c2afba69ccb715b472b726b1429180','40e5e250ba7dcbc9efbb8165bfb9b426a1b43c99'],
 '2.3.1':['3199ff2ae89b39a472b48ee0818de5b1c191063a','a907539349d9b7e97e8678b9099b45faa089edb7','384d9967a124fcc917a2eea3fe549829919cbeb7']};
report.acceptance=[];
for(const [id,[commit,specialist,teaching]]of Object.entries(accepted)){const d=folder(id),qf=d+'/'+id+'-quality-ref.yaml',hf=d+'/'+id+'-textbook-handoff.md';
 const qc=bind('L',qf,sha(rd(L,qf)),commit),h=bind('L',hf,sha(rd(L,hf)),commit),q=yaml.load(qc.toString()),oldq=yaml.load(git(L,'show',specialist+':'+qf).toString());A.equal(q.schema_version,2);A(!q.companion);
 const allowed=id==='2.1.1'?['root_validation','root_acceptance','handoff_renewal','handoff_status','production_ready_with_flags','root_decision']:id==='2.1.2'?['root_validation','root_acceptance','handoff_renewal','production_ready_with_flags','current_succession']:['root_validation','root_acceptance','handoff_renewal','production_ready_with_flags'];
 for(const [key,v]of Object.entries(oldq.partA))if(!allowed.includes(key))check(id+' preserve specialist field '+key,()=>A.deepEqual(q.partA[key],v));
 if(id==='2.1.2'){const x=structuredClone(q.partA.current_succession),y=structuredClone(oldq.partA.current_succession);delete x.root_lineage_flag_closure;delete y.root_lineage_flag_closure;A.deepEqual(x,y);}
 A.deepEqual([...h.toString().matchAll(/^## ([1-9])\. /gm)].map(x=>+x[1]),[1,2,3,4,5,6,7,8,9]);
 const review=d+'/'+id+'-review.md';A.equal(q.partA.review_sha256||q.partA.review_sha256_lf||q.partA.review_raw_sha256,sha(rd(L,review)));
 for(const ed of ['paragraaf','opgaven','antwoorden']){const f=one(f=>f.startsWith(d+'/')&&f.endsWith(' – '+ed+'.md'));check(id+' actual accepted '+ed+' teaching unchanged from full paragraph review',()=>A(rd(L,f).equals(git(L,'show',teaching+':'+f))));}
 report.acceptance.push({id,actual_acceptance_commit:commit,specialist_commit:specialist,teaching_review_commit:teaching,quality_ref_sha256:sha(qc),handoff_sha256:sha(h),review_sha256:sha(rd(L,review)),nine_sections:true,old_pending_prose_not_current_hold:true});
}
// Native bytes and archive members are read, never regenerated.
const crcTable=Array.from({length:256},(_,v)=>{for(let i=0;i<8;i++)v=(v&1)?0xedb88320^(v>>>1):v>>>1;return v>>>0;});
const crc=b=>{let v=0xffffffff;for(const n of b)v=crcTable[(v^n)&255]^(v>>>8);return(v^0xffffffff)>>>0;};
function unzip(b){let e=b.length-22;while(e>=0&&b.readUInt32LE(e)!==0x06054b50)e--;A(e>=0);const count=b.readUInt16LE(e+10),end=b.readUInt32LE(e+16);let p=end;const rows=[];
 for(let i=0;i<count;i++){A.equal(b.readUInt32LE(p),0x02014b50);const flags=b.readUInt16LE(p+8),method=b.readUInt16LE(p+10),storedCRC=b.readUInt32LE(p+16),compressed=b.readUInt32LE(p+20),size=b.readUInt32LE(p+24),nl=b.readUInt16LE(p+28),el=b.readUInt16LE(p+30),cl=b.readUInt16LE(p+32),off=b.readUInt32LE(p+42),name=b.subarray(p+46,p+46+nl).toString('utf8');A(!(flags&1));A(!path.posix.isAbsolute(name)&&!name.split('/').includes('..')&&!name.includes('\\'));A.equal(b.readUInt32LE(off),0x04034b50);const data=off+30+b.readUInt16LE(off+26)+b.readUInt16LE(off+28),chunk=b.subarray(data,data+compressed),decoded=method===8?zlib.inflateRawSync(chunk):method===0?chunk:null;A(decoded);A.equal(decoded.length,size);A.equal(crc(decoded),storedCRC);A(decoded.equals(rd(L,folder('2.1.3')+'/'+name)));rows.push({name,crc:storedCRC,size,sha256:sha(decoded)});p+=46+nl+el+cl;}
 A.equal(new Set(rows.map(r=>r.name)).size,count);return rows;
}
for(const [f,h]of Object.entries(pre.subject.native))check('current accepted213 native '+f,()=>bind('L',folder('2.1.3')+'/'+f,h,'1cf1c1f972f196791fb37f6bbee523b7a2e3b676'));
for(const [ed,rows]of Object.entries(pre.subject.archives)){const f=folder('2.1.3')+'/2.1.3 Marginale kosten en marginale opbrengsten – '+ed+'.zip';check('independent safe CRC/current-byte ZIP '+ed,()=>A.deepEqual(unzip(rd(L,f)),rows));}
for(const [f,h]of Object.entries(pre.imported_evidence))bind('P',f,h);A.equal(Object.keys(pre.imported_evidence).length,234);
const post=json(R+'213-QC-ROOT-postaccept-check.json');A.equal(post.status,'PASS');A.equal(post.quality_ref_raw_sha256,sha(rd(L,folder('2.1.3')+'/2.1.3-quality-ref.yaml')));A.equal(post.handoff_raw_sha256,sha(rd(L,folder('2.1.3')+'/2.1.3-textbook-handoff.md')));
report.pages=[];
async function main(){
 for(const route of pre.routes){const n=R+'213-QC-ROOT-evidence/'+route.mode+'-'+route.revision,proof=json(n+'-reproduction.json'),b=rd(P,n+'-build.json'),m=JSON.parse(b);bind('P',n+'-reproduction.json',route.reproduction_sha256);A.equal(sha(b),route.manifest_sha256);A.equal(proof.build_manifest_sha256,sha(b));A.equal(proof.result,'PASS');A.equal(m.inspection_status,'PENDING');A.deepEqual(proof.native,pre.subject.native);A.deepEqual(proof.archives,pre.subject.archives);A.equal(proof.pages.length,30);
  for(const page of proof.pages){const prev=rd(P,page.previous),cur=rd(P,page.current);A.equal(sha(cur),page.sha256);A(prev.equals(cur));const a=await sharp(prev).removeAlpha().raw().toBuffer({resolveWithObject:true}),b=await sharp(cur).removeAlpha().raw().toBuffer({resolveWithObject:true});A.deepEqual([a.info.width,a.info.height],page.dimensions);A.deepEqual(a.info,b.info);A(a.data.equals(b.data));report.pages.push({route:route.revision,...page,independent_raw_equal:true,independent_decoded_rgb_sha256:sha(b.data),fresh_personal_inspection:false});}
 }
 // Every stored root postacceptance process is attributed, checked for genuine zero exit.
 report.postaccept_commands=[];for(const g of post.gates){const f=R+'213-QC-ROOT-evidence/postaccept-'+g+'.json',j=json(f);A.equal(j.exit_code??j.returncode,0,f);report.postaccept_commands.push({path:f,raw_sha256:sha(rd(P,f)),exit_code:j.exit_code??j.returncode});}
 // Original failed root create capture: only handoff prose matcher and initially unset pins changed.
 const first=json(R+'214-232-PRODUCTION-RELEASE-create-r1-diagnostic-process.json'),last=json(R+'214-232-PRODUCTION-RELEASE-create-r2-process.json'),checkLog=json(R+'214-232-PRODUCTION-RELEASE-check-r1-process.json');
 A.equal(first.exit_code,1);A.equal(last.exit_code,0);A.equal(checkLog.exit_code,0);for(const j of [first,last,checkLog])A.equal(sha(Buffer.from(j.helper_source_base64,'base64')),j.helper_raw_sha256);
 A.equal(checkLog.helper_raw_sha256,'927a4d012404b4e00cabfe793e9db45e22fae0660b968a3e97b6c007851c4f4b');
 const authored=json(R+'214-232-PRODUCTION-RELEASE-check.json');A.equal(authored.status,'PASS');A.equal(authored.checks.reduce((n,v)=>n+v.negative_actual_file_and_manifest_probes.length,0),305);A(authored.current_gates.every(g=>g.exit_code===0));
 report.attributed_author_checks={negatives:305,gate_count:authored.current_gates.length,raw_sha256:sha(rd(P,R+'214-232-PRODUCTION-RELEASE-check.json')),not_independent_probe_count:true,original_create_failure_retained:true};
 report.runtime_modules=['js-yaml','sharp'].map(name=>{const entry=require.resolve(name),packagePath=path.join(process.env.NODE_PATH,name,'package.json'),bytes=fs.readFileSync(packagePath),pkg=JSON.parse(bytes);return {name,version:pkg.version,entry,entry_raw_sha256:sha(fs.readFileSync(entry)),packagePath,package_raw_sha256:sha(bytes),child_only_NODE_PATH:process.env.NODE_PATH,installation:false};});
 report.status='PASS';report.native_read_only_summary={files:Object.keys(pre.subject.native).length,zip_members:Object.values(pre.subject.archives).map(a=>a.length),mechanical_raw_RGB_page_comparisons:report.pages.length,routes:pre.routes.map(r=>r.revision),attributed_specialist_views:72,new_personal_views:0};
 fs.writeFileSync(path.join(P,N+'-lineage.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({status:report.status,checks:report.checks.length,bindings:report.bindings.length,native:report.native_read_only_summary,source_derivation:report.source_derivation,acceptance:report.acceptance},null,2));
}
main().catch(e=>{console.error(e.stack);process.exitCode=1;});
