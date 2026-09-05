// Exact pre-acceptance checkpoint. Preserve it after root metadata succession.
// Adapt by creating a new explicit checkpoint, never weakening historical pins.
const fs=require('fs'), path=require('path'), crypto=require('crypto'), assert=require('assert/strict');
const {execFileSync}=require('child_process');
const yaml=require('js-yaml');
const root=path.resolve(__dirname,'../..'), lessons=path.resolve(root,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-', qcPrefix=prefix+'211-R5-QC';
const rel='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren';
const p=path.join(lessons,rel), e=path.join(root,'reports/sprints',qcPrefix+'-evidence');
const oldP='3510fc4dd30c9c01f44111ecc022ae239e855758', oldL='25fbd9ba66f6ead59f512ec2eec1fd95159d834f';
const importedP='032414ee7d0159c6d94c199398e45f5b2a71e473', importedL='9a9d576dbe3e58e4cf3db6ffebfb2785e582c1e3';
const baseP='c84b5ccb03f6bc73e34d8c376368954cf363ca81';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(p), json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const git=(cwd,args)=>execFileSync('git',args,{cwd,maxBuffer:32*1024*1024});
const blob=(cwd,ref,rel)=>git(cwd,['show',ref+':'+rel]);
const names=(cwd,a,b)=>git(cwd,['diff','--name-only','-z',a,b]).toString('utf8').split('\0').filter(Boolean);
const bindings=[];
function verify(file,hash){assert.equal(sha(read(file)),hash,file); bindings.push({file:path.relative(root,file).replaceAll('\\','/'),sha256:hash});}
function local(file){
  const n=file.replaceAll('\\','/'), origin='C:/wt/book2-211-r5-qc-20260906/';
  assert(n.startsWith(origin),file);const out=path.resolve(root,'..',n.slice(origin.length));
  assert(out.startsWith(root+path.sep)||out.startsWith(lessons+path.sep));return out;
}
const imported=names(root,baseP,importedP);
assert.equal(imported.length,100);
for(const f of imported){
  assert(f.startsWith('reports/sprints/'+qcPrefix)||/^reports\/rendered-proof\/BOOK2-TEXTBOOK-PRODUCTION-1\/211-(paragraaf-9837e3a85f31|opgaven-97329415bacc|antwoorden-498b9a863eef)-r6\//.test(f),f);
  verify(path.join(root,f),sha(blob(root,importedP,f)));
}
const adopted=names(root,oldP,'a288bed1');
assert.deepEqual(adopted.sort(),[...imported,'reports/sprints/'+prefix+'211-root-acceptance-r5-plan.md'].sort());
assert.deepEqual(names(lessons,oldL,'HEAD'),[rel+'/2.1.1-quality-ref.yaml']);
verify(path.join(p,'2.1.1-quality-ref.yaml'),'0a48d356def16b38ba5cf473c735cb83ec9ca15fde245e6461a955e487fc19a1');
assert.deepEqual(read(path.join(p,'2.1.1-quality-ref.yaml')),blob(lessons,importedL,rel+'/2.1.1-quality-ref.yaml'));
verify(path.join(root,'reports/sprints',qcPrefix+'-report.md'),'9163d65e963907870d0b0a2e7d8427ad90425f68b8afd854ca691c614ff6c355');
verify(path.join(e,'independent-probes.json'),'5d8ea2bb601af72002653b9b4c2e33591482fd78abe4e00b41c6a24c67cbc7a6');
const q=yaml.load(read(path.join(p,'2.1.1-quality-ref.yaml')).toString('utf8'));
assert.deepEqual(Object.keys(q).sort(),['partA','schema_version']);
assert.equal(q.schema_version,2);assert.equal(q.partA.root_acceptance,'PENDING');
assert.equal(q.partA.specialist_verdict,'PASS');assert.equal(q.partA.hard_fails_open,0);
verify(path.join(p,'2.1.1-review.md'),q.partA.review_sha256);
const before=json(path.join(e,'before.json')), pass0=json(path.join(e,'pass0.json'));
for(const [file,h]of Object.entries(before)){
  if(file.endsWith('/2.1.1-quality-ref.yaml')){
    assert.equal(sha(blob(lessons,oldL,file)),h);verify(path.join(e,'historical-QC-snapshot.yaml'),h);
  }else verify(path.join(lessons,file),h);
}
for(const [file,h]of Object.entries(pass0.bindings)){
  if(file.endsWith('2.1.1-quality-ref.yaml'))continue;
  verify(local(file),h);
}
const full=json(path.join(e,'full-build.json')), probes=json(path.join(e,'independent-probes.json'));
assert.equal(probes.status,'PASS');assert.equal(probes.automated_visual_acceptance,false);
assert.equal(probes.assets.length,6);assert.equal(probes.tests.total,21);
assert.deepEqual(probes.changed_pages,[['antwoorden',7]]);
let pages=0,native=new Set();
for(const x of full.input_sources)verify(local(x.path),x.sha256);
for(const [i,d]of full.documents.entries()){
  for(const [f,h]of [['source_md','source_sha256'],['source_html','html_sha256'],['source_pdf','pdf_sha256']]){
    verify(local(d[f]),d[h]);native.add(local(d[f]));
  }
  for(const a of d.assets){verify(local(a.path),a.sha256);native.add(local(a.path));}
  const proof=local(d.proof_directory), manifest=json(path.join(proof,'manifest.json'));
  const qd=q.partA.rendered_evidence.documents[i];
  verify(path.join(proof,'manifest.json'),qd.manifest_sha256);
  assert.equal(manifest.inspection_status,'PENDING');assert.deepEqual(manifest.pages_inspected,[]);
  assert.equal(manifest.pdf_sha256,d.pdf_sha256);assert.equal(qd.pdf_sha256,d.pdf_sha256);
  assert.equal(manifest.rendered_pages.length,qd.page_count);
  const pd=probes.documents.find(x=>x.kind===qd.artifact);assert(pd);
  assert.equal(pd.pages.length,qd.page_count);assert.equal(pd.pdf_sha256,d.pdf_sha256);
  for(const pg of pd.pages){
    const n='page-'+String(pg.page).padStart(3,'0')+'.png';
    assert.equal(pg.sha256,manifest.page_sha256[n]);
    verify(path.join(root,pg.path),pg.sha256);verify(path.join(proof,'pages',n),pg.sha256);pages++;
  }
}
assert.equal(pages,31);assert.equal(native.size,21);
for(const a of probes.assets){
  verify(path.join(p,'_assets',a.asset+'.svg'),a.svg_sha256);
  verify(path.join(p,'_assets',a.asset+'.png'),a.png_sha256);
  verify(path.join(e,'native',a.asset+'.png'),a.native_sha256);
  verify(path.join(e,'grayscale',a.asset+'.png'),a.grayscale_sha256);
  assert.equal(a.native_pixel_delta,0);assert.equal(a.png_sha256,a.native_sha256);
}
const previous=path.join(root,'reports/sprints',prefix+'211-root-r5-reproduction-r5.json');
verify(previous,'b1a1b02dd5088f75821ee0c6e229c602eb748c9a2436cdedc9d2c31adceee58f');
const repro=json(previous);assert.equal(repro.native_full_identical,true);assert.equal(repro.native_print_only_identical,true);
assert.equal(Object.keys(repro.files).length,21);
for(const [file,h]of Object.entries(repro.files))verify(path.join(lessons,file),h);
const oldBuild=json(path.join(root,'reports/sprints',prefix+'211-root-r5-build-r5.json'));
for(const x of oldBuild.input_sources){
  const n=x.path.replaceAll('\\','/'), token='/4veco-platform/';
  assert(n.includes(token));verify(path.join(root,n.split(token)[1]),x.sha256);
}
const result={status:'PASS',checkpoint:'Pre-root-acceptance 211 R5 specialist adoption',imported_paths:imported.length,checks:bindings.length,native_files:native.size,pages,figures:6,root_prior_full_print_reproduction_rebound:true,root_visual:'Prior own R5 answer7 plus30 exact prior pages; no new personal-view claim',specialist_visual:'31 fresh full pages plus6 native figures and6 grays attributed in bound report',root_acceptance:'PENDING',bindings};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({...result,bindings:undefined},null,2));
