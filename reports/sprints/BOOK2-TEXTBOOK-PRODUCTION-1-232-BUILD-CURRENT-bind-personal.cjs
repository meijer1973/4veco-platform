'use strict';
// Binds already-recorded personal observations; this does not perform visual review.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {P,N,sha,save}=require('./BOOK2-TEXTBOOK-PRODUCTION-1-232-BUILD-CURRENT-evidence.cjs');
const read=n=>JSON.parse(fs.readFileSync(path.join(__dirname,N+n+'.json')));
const views=read('personal-views'),native=read('native-r1000003'),gray=read('grayscale-corrected');
assert.equal(views.source_commit,native.source_commit);assert.equal(views.production_ready,false);
const counts={paragraaf:19,opgaven:11,antwoorden:12},seen=new Map();
for(const row of views.observations){const ids=row.stems||row.pages.map(n=>row.kind==='native-figure'?'fig_'+n:n);assert.equal(ids.length,row.notes.length);for(let i=0;i<ids.length;i++)for(const mode of ['color','gray'])if(row[mode]){const key=[row.kind,ids[i],mode].join('/');assert.ok(!seen.has(key),'Duplicate personal view '+key);seen.set(key,row.notes[i]);}}
const records=[];
function bind(kind,id,mode,file,extra={}){const key=[kind,id,mode].join('/');assert.ok(seen.has(key),'Missing personal view '+key);records.push({kind,id,mode,path:path.relative(P,file).replaceAll('\\','/'),raw_sha256:sha(fs.readFileSync(file)),personal_observation:seen.get(key),...extra});seen.delete(key);}
for(const [kind,total] of Object.entries(counts)){const doc=native.documents.find(d=>d.source_pdf.endsWith(' – '+kind+'.pdf'));assert.ok(doc);assert.equal(sha(fs.readFileSync(doc.source_pdf)),doc.pdf_sha256);const names=fs.readdirSync(path.join(doc.proof_directory,'pages')).filter(n=>n.endsWith('.png'));assert.equal(names.length,total);for(let page=1;page<=total;page++){const name='page-'+String(page).padStart(3,'0')+'.png',g=gray.items.find(r=>r.kind===kind&&r.page===page);assert.ok(g);const gp=path.join(P,g.path);assert.equal(sha(fs.readFileSync(gp)),g.raw_sha256);bind(kind,page,'color',path.join(doc.proof_directory,'pages',name),{source_pdf_sha256:doc.pdf_sha256});bind(kind,page,'gray',gp,{source_pdf_sha256:doc.pdf_sha256,decoded_rgb_sha256:g.rgb_sha256});}}
const stems=[...Array.from({length:6},(_,i)=>'fig_'+(i+1)),'we_1',...Array.from({length:7},(_,i)=>'ex_'+(i+1))];
for(const stem of stems){const name='2.3.2_'+stem,g=gray.items.find(r=>r.kind==='native-figure'&&r.stem===name);assert.ok(g);const asset=path.join(native.paragraph_folder,'_assets',name);assert.equal(sha(fs.readFileSync(path.join(P,g.path))),g.raw_sha256);bind('native-figure',stem,'color',asset+'.png',{svg_sha256:sha(fs.readFileSync(asset+'.svg'))});bind('native-figure',stem,'gray',path.join(P,g.path),{decoded_rgb_sha256:g.rgb_sha256});}
assert.equal(seen.size,0);assert.equal(records.length,112);
for(const row of native.source_files)assert.equal(sha(fs.readFileSync(path.join(P,row.path))),row.sha256);
for(const [name,hash]of Object.entries(native.packet))assert.equal(sha(fs.readFileSync(path.join(native.paragraph_folder,name))),hash);
const files=['personal-views','native-r1000003','native-r1000004','native-r1000005','native-r1000006','parity-four-final','checker-rebuild-r1000006','final-check-corrected','grayscale-corrected','all-tests-source6-process','cli-probes-source6','namespace-probes','final-custody-current','final-release-process','final-structural-process','final-production-process','final-durable-process','final-bundle-process','final-author-profile-student-process','final-author-profile-print-process'];
const evidence=files.map(n=>({path:'reports/sprints/'+N+n+'.json',raw_sha256:sha(fs.readFileSync(path.join(__dirname,N+n+'.json')))}));
save('personal-binding',{status:'PASS_COVERAGE_AND_BYTE_BINDING_ONLY',actor:views.actor,role:views.role,source_commit:native.source_commit,method:views.method,counts:{full_page_color:42,full_page_gray:42,native_figure_color:14,native_figure_gray:14,total:112},records,source_files:native.source_files,native_packet:native.packet,evidence,root_acceptance:'PENDING',independent_review:'PENDING',specialist_qc:'PENDING',handoff:'PENDING',production_ready:false});
console.log(JSON.stringify({status:'PASS',bound_personal_views:records.length,native_files:Object.keys(native.packet).length,source_files:native.source_files.length}));
