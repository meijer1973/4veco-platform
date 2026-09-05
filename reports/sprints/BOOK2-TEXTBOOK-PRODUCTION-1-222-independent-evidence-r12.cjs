// Independent reviewer evidence recorder. Reads the exact R12 payload only;
// writes this review's new attributed JSON, never a builder manifest.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
const pair = path.dirname(root);
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const norm = p => p.replaceAll('\\', '/');
const relative = p => norm(path.relative(pair, p));
const relocate = p => {
  const clean = norm(p);
  const match = clean.match(/\/(4veco-platform|4veco-lessen)\/(.*)$/);
  assert(match, `Unscoped path: ${p}`);
  const dest = path.resolve(pair, match[1], match[2]);
  assert(norm(dest).startsWith(norm(pair) + '/'));
  return dest;
};
const buildPath = path.join(__dirname, 'BOOK2-TEXTBOOK-PRODUCTION-1-222-build-r12.json');
const build = JSON.parse(fs.readFileSync(buildPath, 'utf8'));
assert.equal(build.inspection_status, 'PENDING');
const refs = new Map();
function bind(p, expected) {
  const hash = sha(p);
  if (expected) assert.equal(hash, expected, p);
  refs.set(relative(p), {path:relative(p), sha256:hash, bytes:fs.statSync(p).size});
  return refs.get(relative(p));
}
bind(buildPath);
for (const input of build.input_sources) bind(relocate(input.path), input.sha256);
const notes = {
  paragraaf: [
    'Problem-first toy-shop hook, four goals, prior TO/Ev/old-base retrieval and model conditions are complete and readable.',
    'Old revenue rectangle has exact P=5,Q=100, area500/week; table and surrounding explanation are together and readable.',
    'Same-scale old/new toy and coffee rectangles, percentage calculations and wrong/correct factor warning are intact; grayscale also inspected.',
    'Local-rule definition and all four price/revenue directions are adjacent; unchanged conditions and sufficiently-small limitation are readable.',
    'Revenue/profit boundary and worked pottery/comic a-d calculations are complete; local-rule introduction continues coherently.',
    'Concert counterexample and same-scale rectangles show1000 to900/week despite intervalEv=-0.8; factor1.5*0.6=0.9 and profit boundary intact; grayscale also inspected.',
    'Five-point recap is after worked example and before Start; printed route and brief retrieval/comprehension questions1-2 intact.',
    'Guided3 includes printed reminder, completion blanks and local/interval explanation scaffolds; no leaked underscore markup or lost subquestion.',
    'Faded4 and independent5 retain all subparts and source data; independent work has no answer-giving scaffold; page is dense but readable.',
    'Exact Nova/Stream target6a-f,11points, optional evaluative bonus7 and cumulative closing8-9 complete and legible.'
  ],
  opgaven: [
    'Worked pottery/comic a-e complete; all substitutions, units and local-rule conditions readable.',
    'Concert counterexample, figure, factor warning and profit boundary intact with no split-attention defect.',
    'Complete five-point recap then Start1-2, neutral printed support routing and retrieval checks.',
    'Guided3 all a-g and printed reminder intact; completion blanks remain visible.',
    'Faded4a-f and independent5a-f are complete and readable, including photo and benefit finite counterexamples.',
    'Frozen target6 all six parts and2/2/2/2/2/1points, bonus7 and closing8-9 intact.'
  ],
  antwoorden: [
    'Answer conventions, Start1-2 and3a complete; R12 absolute-Ev token in1a is unbroken. No clipping or isolated-word defect.',
    'Answers3b-g and4a-d readable; confirmed blocker222-R12-PROC-ORDER in4b: both cases calculate price percentage before quantity percentage, contrary to approved C22 order. Arithmetic and signed ratios are correct.',
    'Answers4e-f and5a-f include correct four local directions, finite/local distinction and cost boundary; no page defect.',
    'Target6a-e exact calculations/short answers/rubric complete; R12 absolute-Ev tokens are unbroken and structural breaks preserve wording and readability.',
    'Target6f one point, four-criterion evaluative bonus7 and closing8-9 complete. No stranded heading or omitted answer.'
  ]
};
const documents=[];
const imageRefs = new Set();
const htmlAltChecks=[];
for(const doc of build.documents) {
  const md=relocate(doc.source_md), html=relocate(doc.source_html), pdf=relocate(doc.source_pdf);
  const kind = path.basename(md).match(/ – (.+)\.md$/)[1];
  bind(md,doc.source_sha256); bind(html,doc.html_sha256); bind(pdf,doc.pdf_sha256);
  assert(fs.statSync(pdf).size>10000);
  const content=fs.readFileSync(md,'utf8');
  const htmlText=fs.readFileSync(html,'utf8');
  for(const m of htmlText.matchAll(/<img\b[^>]*\balt="([^"]*)"[^>]*>/g)) {
    const chars=Array.from(m[1]).length;
    htmlAltChecks.push({path:relative(html),line:htmlText.slice(0,m.index).split('\n').length,alt:m[1],characters:chars,
      noun_phrase:true,short_alt_limit:120,status:chars<=120?'PASS':'FAIL',finding:chars<=120?null:'222-R12-ALT-LENGTH'});
  }
  for(const m of content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
    assert(m[1].trim(), 'Missing image alt text');
    const p=path.resolve(path.dirname(md),m[2]);
    assert(fs.existsSync(p),p); imageRefs.add(relative(p));
  }
  for(const asset of doc.assets) bind(relocate(asset.path),asset.sha256);
  const proof=relocate(doc.proof_directory);
  const manifest=path.join(proof,'manifest.json');
  const rawManifest=JSON.parse(fs.readFileSync(manifest,'utf8'));
  assert.equal(rawManifest.inspection_status,'PENDING');
  assert.deepEqual(rawManifest.pages_inspected,[]);
  const pageFiles=fs.readdirSync(path.join(proof,'pages')).filter(p=>/^page-\d+\.png$/.test(p)).sort();
  assert.equal(pageFiles.length,notes[kind].length);
  documents.push({kind,pdf:bind(pdf,doc.pdf_sha256),generation_manifest:bind(manifest),original_manifest_status:'PENDING',
    pages:pageFiles.map((file,i)=>({page:i+1,...bind(path.join(proof,'pages',file),rawManifest.page_sha256[file]),
      inspection_method:'Personally viewed complete individual page at normal reading scale with view_image in this reviewer task; no inherited visual acceptance',
      visual_layout_verdict:'PASS',content_finding:kind==='antwoorden'&&i===1?'222-R12-PROC-ORDER':null,note:notes[kind][i]}))});
}
assert.equal(imageRefs.size,4);
const lessonDir=path.dirname(relocate(build.documents[0].source_md));
const assetNames=fs.readdirSync(path.join(lessonDir,'_assets')).filter(n=>/\.(svg|png)$/.test(n)).sort();
assert.equal(assetNames.length,8);
for(const name of assetNames) bind(path.join(lessonDir,'_assets',name));
for(const stem of ['2.2.2_fig_1','2.2.2_fig_2','2.2.2_fig_3','2.2.2_we_1']) {
  assert(assetNames.includes(stem+'.svg')&&assetNames.includes(stem+'.png'));
}
const plan=bind(path.join(lessonDir,'2.2.2-textbook-plan.md'));
const chapter=bind(path.join(path.dirname(lessonDir),'_chapter-plan.md'));
const lf=p=>crypto.createHash('sha256').update(fs.readFileSync(p,'utf8').replace(/\r\n?/g,'\n')).digest('hex');
assert.equal(lf(path.join(lessonDir,'2.2.2-textbook-plan.md')),build.plan_sha256);
assert.equal(lf(path.join(path.dirname(lessonDir),'_chapter-plan.md')),build.chapter_sha256);
const grays=[3,6].map(page=>({page,...bind(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-222-grayscale-r8',`paragraaf-page-${String(page).padStart(3,'0')}.png`)),
  personally_inspected:true,note:'Independently viewed this full grayscale page; pale fill versus dashed old border, labels and units remain distinct. Student R12 PDF is byte-identical to R8.'}));
const evidence={schema_version:1,reviewer:'paragraph_222_independent_review',task:'BOOK2-TEXTBOOK-PRODUCTION-1-222-REVIEW',review_round:'R12',date:'2026-09-05',
  builder_platform_head:'960c9c8973061cae5ef1403e41f3f75c319ad816',builder_lesson_head:'4b2be1d4a3443705cbaa53600b16ae95316e0c18',
  review_verdict:'FAIL',blockers:['222-R12-PROC-ORDER','222-R12-ALT-LENGTH'],mathematical_correctness:'PASS',visual_layout:'PASS',
  authority:'Unchanged exact frozen target and accepted C22/222 plans; owner teaching-hold release remains valid. This review is not target/merge authority.',
  paragraph_plan:plan,chapter_plan:chapter,target_record_sha256:build.target_record_sha256,
  inspection_claim:'All 21 full pages plus all 4 standalone PNG figures and 2 full grayscale probes personally inspected in this task; no root/builder/specialist inspection inherited.',
  documents,standalone_figures:assetNames.filter(n=>n.endsWith('.png')).map(n=>({file:relative(path.join(lessonDir,'_assets',n)),personally_inspected:true,verdict:'PASS'})),grayscale:grays,
  image_reference_count:imageRefs.size,asset_file_count:assetNames.length,html_alt_checks:htmlAltChecks,raw_references:[...refs.values()].sort((a,b)=>a.path.localeCompare(b.path)),
  rebuild_check:'BOOK2-TEXTBOOK-PRODUCTION-1-222-independent-render-check-r12.json',
  timing:{core_estimated:51.5,guided_extra:15,supported_estimated:66.5,all_estimated:79.5,observed:false},
  limits:['No specialist QC, handoff, student-use acceptance, whole-book/chapter approval or remote CI claim.','Original builder proofs/manifests unchanged; all relocated diagnostic reads are confined to own pair.']};
const destination=path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-222-independent-inspection-r12.json');
fs.writeFileSync(destination,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({status:'PASS',recorded_review_verdict:evidence.review_verdict,pages:21,figures:4,grayscale:2,raw_references:refs.size,output:relative(destination)},null,2));
