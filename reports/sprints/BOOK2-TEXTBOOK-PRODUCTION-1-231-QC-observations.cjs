/* HOW TO ADAPT: binds personally authored observations made AFTER viewing all
 * named pages/figures; not an automated visual verdict or a root acceptance. */
'use strict';
const fs=require('node:fs'), path=require('node:path'), crypto=require('node:crypto'), assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'), L=path.resolve(P,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-231', q=path.join(__dirname,prefix+'-QC');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const probes=json(q+'-probes-result.json');assert.equal(probes.status,'PASS');
const par=[
'Unique title, workshop motivation and four numbered frozen goals clear. Four-row purchased-unit table intact:18/14/10/6 at10, CS8/4/0 and excluded nonbuyer. Figure introduction leads to complete caption on next page, not an orphan heading.',
'Discrete bars/gaps8/4 and price10 remain distinct without color. Table-to-total12/30/42 and benefit-not-cash explanation legible. Continuous bounded model is introduced separately, not inferred from four bars. Dense lower text remains above footer.',
'Axes-only stage labels P euro/card, Q cards, (0,40),(80,0) are large. Substitution Q60 at given10 explained below, with highest-WTP full-sale premise. No premature shaded solution.',
'Demand and given-price stage adds P10 and Q60 projection, no CS yet. Given-price quantity is explicitly not calculated equilibrium. Strip-to-area reasoning introduces next full triangle.',
'Bookfair CS hatched above P10 and plain payment below; direct labels, base60 height30 and formula conditions match. Intact900/600/1500 table; dense page still readable without footer collision.',
'Misconception warning separates payment and group benefit. Price-change claim stays conditional. Museum context/domain and steps1–3 retain axes/units and Q20, with no orphan heading.',
'Museum figure shows Q20/P10 and correct CS triangle. Full caption and steps4–5 give200 euro group benefit, not per-person money. Text/figure progression is explicit.',
'Five-point non-heading recap directly after worked example and before Start. Neutral paper route. Start1 retrieves substitution/intercepts/axes and triangle8cm by6cm; Start2Noor6 and aquarium setup are accessible.',
'Aquarium Start2 graph is deliberately unshaded: P8/Q32, axes and full caption clear. Questions ask area and critique of refund misconception. Optional guided route is explicitly skippable with neutral wording.',
'Garden guided graph explicitly supplies base40/height20, P10/Q40 and CS region; fill-in prompts strong support. Climbing context leads to reduced-scaffold graph next page.',
'Climbing graph supplies demand only, no P/CS answer. Learner adds P12 and shade. Boardgame supplies no graph and requires full chain, with after-work check sentence only. Fading is visible.',
'Independent skate and cafe exercises complete on page, no hint graph. Learner computes/draws/shades/explains. Cafe392 payment-confusion item uses intercept transfer; no unintroduced operation.',
'Frozen target Opg8 context and all five subquestions2/3/2/3/2 remain together, unhinted and without answer figure. Bonus9 genuinely changes buyers/full-sale assumption; complete prompt below target.',
'Two closing exercises remain together, accessible demand-coordinate and bought-unit retrieval, no new theory. Large terminal whitespace preserves the closing pair rather than producing an avoidable mid-task blank.'
];
const opg=[
'Unique opgaven title and complete museum worked context/steps1–3. Same paper content as paragraph, sensible roomier pagination.',
par[6],par[7],par[8],par[9],par[10],par[11],par[12],par[13]
];
const ans=[
'Exact arithmetic/no rounding rule and units upfront. Start1a/b/c complete including24cm² and Why. Noor6 and aquarium256 with base32/height16; figure continues next page without orphan heading.',
'Aquarium answer figure closed triangle and256 caption; Sem is corrected as group WTP-payment, not refund/per visitor. Garden Q40 and CS400 calculations and Why clear.',
'Garden answer figure and400 group interpretation complete. Climbing Q24, axes48/24, CS144 and Why fully legible.',
'Climbing144 graph and group meaning match. Boardgame Q30 and CS225, axes40/20 and full shading steps are readable before answer graph next page.',
'Boardgame225 graph with Why addresses group/payment distinction. Skate Q48 and72/36 axes plus CS region0..48 are complete; continuation attribution remains clear.',
'Continued skate Why is a complete short paragraph with named skate graph immediately below. Figure576, units and not-equilibrium explanation clear. Cafe28/56 intercept reasoning and Q28 at14 legible.',
'Cafe CS196 and payment392 have distinct hatch/plain regions and direct labels. All explanation complete. Target begins with a2points,Q60 explicitly not an equilibrium; no footer collision.',
'Target b3 and c2 show axes/intercepts/price and exact region. Answer-only concert figure has CS bounded0..60 above20. d3 label and900 short answer stay together; expanded explanation follows next page.',
'Expanded target900 base60/height30 and e2 group-benefit-not-refund/revenue/per-person meaning complete. All five score table rows2/3/2/3/2=12 intact, legible and within page margins.',
'Bonus model answer complete with exactly three criteria together: actual12vs12 and highest-three counterfactual24; altered buyers/full-sale premise. Closing Q24 at6 and two buyers/CS3, including zero buyer and excluded nonbuyer; Book1 pointers printed.'
];
const figNotes={
fig_1:'Discrete participant categories remain bars, not a connected demand line. WTP18/14/10/6, price10, hatched gaps8/4, zero gap3 and unbought4 all explicit. Gray keeps hatches and purchase sentence clear.',
fig_2:'Axes-only stage deliberately omits demand/price/CS. P40,Q80 intercept dots, axes/units/ticks and coordinate summary clear in both modes.',
fig_3:'Adds demand and P10/Q60 projection without CS. Solid demand, long-dash price, short-dash projection distinguish roles in gray.',
fig_4:'CS triangle above10 and payment rectangle below10 have separate hatch/plain texture and labels. Region stops at60; intercepts40/80 and all coordinates readable.',
we_1:'Museum P10,Q20, intercepts30/30. Hatched CS200 triangle, clear direct labels and generous coordinate footer.',
ex_1:'Aquarium supplied Start graph P8,Q32, intercepts24/48; no premature CS shading, correct support for comprehension task.',
ex_2:'Garden stronger guided graph with CS, P10/Q40, base40 and height20 explicitly given in bottom text; no text collision.',
ex_3:'Climbing faded scaffold has only demand and intercepts24/48, no price/projection/CS. Learner action remains necessary.',
ex_4:'Aquarium answer CS256 shown above8, bounded0..32; full coordinate summary legible.',
ex_5:'Garden answer CS400 above10, bounded0..40; unlike guided image, footer gives coordinates rather than base/height.',
ex_6:'Climbing answer CS144 above12, bounded0..24; direct P12,Q24 and coordinates visible without color.',
ex_7:'Boardgame answer CS225 above5, bounded0..30; tick scales20/40, label box and coordinate footer clear.',
ex_8:'Skate answer CS576 above12, bounded0..48; demand intercepts36/72 and coordinate summary readable.',
ex_9:'Cafe answer distinguishes hatched CS196 above14 from plain payment392 rectangle below; P14/Q28 and intercepts28/56 clear in grayscale.',
ex_10:'Concert target answer only: P20,Q60, intercepts50/100 and CS triangle0..60. Native color/gray direct labels and complete coordinate summary clear.'
};
assert.equal(par.length,14);assert.equal(opg.length,9);assert.equal(ans.length,10);
const notes={paragraaf:par,opgaven:opg,antwoorden:ans};
const pages=probes.raw_and_decoded_rgb_page_parity.flatMap(row=>['color','grayscale'].map(mode=>{
 const file=mode==='color'?row.color_r17:row.gray_r17;
 assert.equal(hash(file),mode==='color'?row.r14_r17_r18_r19_raw:row.gray_raw_sha256);
 return {kind:row.kind,page:row.page,mode,path:file,raw_sha256:hash(file),dimensions:row.dimensions,
  personally_inspected:true,inspected_at_normal_reading_scale:true,visible_student_defects:0,
  observation:notes[row.kind][row.page-1]+' Footer identity and page count correct; grayscale does not remove essential information.'};
}));
const figs=probes.figures.map(row=>({...row,personally_inspected_color:true,personally_inspected_grayscale:true,
 inspection_display:'Native PNG2400x1800 viewed independently at1824x1368; all19 placed views also inspected on full1241x1754 pages.',
 visible_student_defects:0,observation:figNotes[row.stem.replace('2.3.1_','')]}));
assert.equal(pages.length,66);assert.equal(figs.length,15);assert(figs.every(f=>f.observation));
const manifests=[17,18,19].map(n=>{
 const file=path.join(__dirname,`${prefix}-build-manifest-r${n}.json`), m=json(file);
 assert.equal(m.inspection_status,'PENDING');
 const generation=m.documents.map(d=>{const f=path.join(d.proof_directory,'manifest.json'),j=json(f);
  assert.equal(j.inspection_status,'PENDING');assert.deepEqual(j.pages_inspected,[]);
  assert.equal(j.visible_student_defects,null);assert.equal(j.inspected_at_normal_reading_scale,false);
  return {path:f,raw_sha256:hash(f),inspection_status:'PENDING'};});
 return {revision:`r${n}`,path:file,raw_sha256:hash(file),generation};
});
const result={reviewer:'paragraph_231_specialist_qc',role:'distinct independent specialist QC; not author, source reviewer, or root integrator',
 recorded_after_personal_inspection_at:new Date().toISOString(),verdict:'PASS WITH FLAGS',
 reviewed_platform_baseline:probes.platform_baseline,reviewed_lessons_baseline:probes.lessons_baseline,
 canonical_review_raw_lf_sha256:'8f86129b14ef508e16f41d918299da7af2422655ff14fc9ba91b68a9b66e8943',
 approved_plan_lf_sha256:'60d6a743681e1361478395a591b7c82e44acf8c4587a93c4cc842b036cf017b1',
 probes_result_raw_sha256:hash(q+'-probes-result.json'),native_reproduction_raw_sha256:hash(q+'-native-reproduction.json'),
 manifests,pages,figures:figs,personally_inspected_images:96,visible_student_defects:0,
 applicability:{paper_pdf_pages:'all33 inspected color and grayscale',native_figures:'all15 color and grayscale; all19 placed occurrences',
  keyboard_focus_hover_tap:'N/A: static paper textbook and noninteractive print HTML; no controls',
  ocr:'N/A: born-digital PDF/HTML, not scanned document',screen_reader:'Not exercised; source lang/headings/alts/captions checked, no PDF/UA or AT certification',
  mobile_companion:'out of scope PartB; not inspected',classroom_timing:'UNOBSERVED52core/64support/76-80all',
  inspectie:'optional mapping deferred; no current protected-reference compliance claim'},
 root_validation:'PENDING',root_acceptance:'PENDING',handoff_renewal:'PENDING',production_ready:false,production_ready_with_flags:false};
fs.writeFileSync(q+'-personal-inspection-r17.json',JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({verdict:result.verdict,personally_inspected_images:96,raw_sha256:hash(q+'-personal-inspection-r17.json'),native_manifests_preserved:'PENDING'},null,2));
