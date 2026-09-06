'use strict';
// Read-only full release/input gate. Native authors must additionally gate current action/durable authority.
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),N='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-232-INPUT-ROOT-';
const C='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-232-PRODUCTION-RELEASE-',R='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-232-INPUT-REVIEW-';
const CP='9c6d8a7c1ee98b91a67f6d560beb8534f5dbde56',RP='8fc63fe32f030371195f022971a2d5d42ddedeb8';
const pins={214:'f7752aa314f6db0cd8fd2eb076547b96f0624986e96553395e765adeb93dead6',232:'9705ba935c9c9f79e3b5981ba3e9119da34cd37bf165adc57323f2c6365d3a18'};
const candidatePins={214:'8adf329ff71e912335baa11d1e78a28afb8eb807de52306ffd867e35c7f0f376',232:'113d3321a3b859d582a4febf6ff71cd259111d6c5d233047113b1455f6bcc5dc'};
const reviewPins={'report.md':'373adbb84185500dfc1c17d27976e0eb7d0ecfb5157bb24ccfe32849415489ed','independent.json':'8dadf8d9f0c233e1fa5201984419eb8e66bb077c32c6177befb844a2bd984491','lineage.json':'fdbe250068cc81235c5b3217171a66de5f0412c6350992a24405dd4beb557d40'};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),readP=n=>fs.readFileSync(path.join(P,n));
const blob=(commit,n)=>cp.execFileSync('git',['show',commit+':'+n],{cwd:P,maxBuffer:128*1024*1024});
function verifyRelease(key,readers={},onSuccess=()=>{}){
 a(['214','232'].includes(key),'unknown requested paragraph');a.match(pins[key]||'',/^[a-f0-9]{64}$/,'release not pinned');
 const readPlatform=readers.platform||readP,readInput=readers.input||(r=>fs.readFileSync(path.join(r.repository==='4veco-platform'?P:L,r.path)));
 const bytes=(readers.release||readP)(N+key+'-release.json');a.equal(hash(bytes),pins[key],'whole immutable root release');const grant=JSON.parse(bytes);
 a.equal(grant.decision,'RELEASED_FOR_GATED_PART_A_AUTHORING');a.equal(grant.accountable_actor,'codex-root');a.equal(grant.paragraph,key==='214'?'2.1.4':'2.3.2');a.equal(grant.schema_version,1);a.equal(grant.future_pr_merges_authorized,false);a.equal(grant.companion_commissioned,false);a.equal(grant.student_release,false);
 a.equal(grant.candidate.commit,CP);a.equal(grant.candidate.path,C+key+'-inputs.json');a.equal(grant.candidate.raw_sha256,candidatePins[key]);a.equal(grant.independent_review.commit,RP);a.equal(grant.independent_review.actor,'paragraph_224_builder');a.equal(grant.independent_review.verdict,'INPUT PASS');
 for(const[n,h]of Object.entries(reviewPins)){const b=readPlatform(R+n);a.equal(hash(b),h,n);a(b.equals(blob(RP,R+n)),n);a.equal(grant.independent_review.files.find(r=>r.path===R+n)?.raw_sha256,h,n);}
 const checker=readPlatform(C+'check.cjs');a.equal(hash(checker),'927a4d012404b4e00cabfe793e9db45e22fae0660b968a3e97b6c007851c4f4b');a(checker.equals(blob(CP,C+'check.cjs')));a(readP(C+'check.cjs').equals(checker),'loaded checker differs from verified bytes');
 const candidate=readPlatform(C+key+'-inputs.json');a.equal(hash(candidate),candidatePins[key]);a(candidate.equals(blob(CP,C+key+'-inputs.json')));
 const mod=require('./BOOK2-TEXTBOOK-PRODUCTION-1-214-232-PRODUCTION-RELEASE-check.cjs');let reached=0;const manifest=mod.verifyManifest(candidate,key,readInput,()=>reached++);a.equal(reached,1);
 a.deepEqual(grant.output_contract,manifest.output_contract);a.deepEqual(grant.target,manifest.target);a.deepEqual(grant.plan,manifest.plan);a.deepEqual(grant.timing,manifest.timing);a.equal(grant.actual_input_count,manifest.inputs.length);
 onSuccess();return {grant,manifest};
}
module.exports={verifyRelease,pins,candidatePins,reviewPins,hash};
if(require.main===module){const key=process.argv[2],r=verifyRelease(key);console.log(JSON.stringify({status:'PASS',paragraph:r.grant.paragraph,release_sha256:pins[key],candidate_sha256:candidatePins[key],inputs:r.manifest.inputs.length,native_effects:0,permission:'Gated Part A authoring; current approved action/durable authority and all future review/acceptance gates still mandatory'}));}
