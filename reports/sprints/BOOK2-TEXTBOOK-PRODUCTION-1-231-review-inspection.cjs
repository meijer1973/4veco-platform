// Bounded reviewer evidence: records personal observations already completed.
// This script hashes, binds and serializes observations; it cannot inspect images.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=process.cwd(),prefix='BOOK2-TEXTBOOK-PRODUCTION-1-231-review';
const lesson=path.resolve(root,'../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const assert=(value,message)=>{if(!value)throw Error(message)};
const reproduction=json(`reports/sprints/${prefix}-reproduction-result.json`);
const par=[
 'Problem-first pottery purchases, four goals and precise definition; all four discrete rows read and readable.',
 'Discrete 8+4+0=12 versus payment 30 and willingness 42; buyer 4 excluded. Linear-model transition explicit. Dense body stays inside its actual margin, clear of footer.',
 'Bookfair axes/intercepts (0,40),(80,0), units and substitution Qd=60; staged rather than answer-first graph.',
 'Price P10 meets demand at Q60; distinct solid/dash/projection shapes and direct labels. No-equilibrium explanation and area introduction readable.',
 'CS upper triangle and separate payment rectangle have distinct fill/hatch. Qualified linear formula gives 900/600/1500, correctly labelled table.',
 'Payment-versus-CS misconception and bounded lower-price statement; museum worked example begins with substitution and construction steps.',
 'Museum actual graph (0,30),(30,0),(20,10) and CS 200; base/height/units and group-not-cash interpretation readable.',
 'Five-point non-heading recap followed by neutral paper route. Retrieval function, axes, area and Noor question; aquarium context starts cleanly.',
 'Aquarium supplied price graph remains unshaded; learners select CS and calculate. Neutral support choice and garden context readable.',
 'Garden full support exposes base40/height20; fill-in algebra/area/meaning. Climbing context readable below.',
 'Climbing supplies only demand line; learner adds price and CS. Boardgame requires entire graph chain without a supplied graph; short check is afterward.',
 'Independent skate five-operation chain and cafe endpoint-driven construction/CS/payment critique; no supplied figure or procedural hint.',
 'Whole frozen five-part target and 12 points together on one page, no graph giveaway. Bonus asks actual changed buyer allocation.',
 'Two closing retrieval exercises, no new theory. Deliberate short closing page, no clipped text or isolated heading.'
];
const op=[par[5].replace('Payment-versus-CS misconception and bounded lower-price statement; ','') ,par[6],par[7],par[8],par[9],par[10],par[11],par[12],par[13]];
op[0]='Museum worked example steps 1–3: price substitution, units, axis/intercept construction and CS region explanation, all readable.';
const ans=[
 'All retrieval answers: film Q16/intercepts24, triangle24 cm², Noor6 and aquarium256; method and meaning supplied.',
 'Aquarium solution triangle, group-not-cash explanation, garden40/400 with full method.',
 'Garden CS solution graph and interpretation; climbing24/144 calculation below, clear and readable.',
 'Climbing CS solution graph and group meaning; boardgame30/225 construction and arithmetic.',
 'Boardgame solution graph and explanation; skate48 and axes/intercepts72/36 with region description.',
 'Ordinary continuing why paragraph, not orphan heading. Skate CS576 solution graph, amount and interpretation; cafe midpoint method begins.',
 'Cafe CS196 versus payment392 with distinct areas and explicit critique; target quantity60 begins below.',
 'Target axes/intercepts and shading explanation plus concert triangle P20/Q60; short D answer900 fits below.',
 'Target D complete base60/height30 method and E group meaning; full five-row 2/3/2/3/2 scoring table remains readable.',
 'Complete bonus model before exactly three criteria: actual12 then12, allocation failure and counterfactual24. Closing Q24/(24,6), two buyers/CS3; no new theory.'
];
const pageObservations=[];
for(const [edition,notes] of Object.entries({paragraaf:par,opgaven:op,antwoorden:ans})){
 const pdfHash=sha(path.join(lesson,`2.3.1 Consumentensurplus – ${edition}.pdf`));
 const proof=`reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/231-${edition}-${pdfHash.slice(0,12)}-r11`;
 const manifest=json(path.join(proof,'manifest.json'));
 assert(manifest.rendered_pages.length===notes.length,'Page count');
 notes.forEach((note,i)=>{
  const name=`page-${String(i+1).padStart(3,'0')}.png`;
  const color=`${proof}/pages/${name}`,gray=`reports/sprints/${prefix}-evidence/grayscale-r11/${edition}/${name}`;
  assert(sha(color)===manifest.page_sha256[name],'Color proof hash');
  const record=reproduction.all_page_grayscale.find(x=>x.path.replaceAll('\\','/').endsWith(gray));
  assert(record && record.sha256===sha(gray) && record.source_pdf_sha256===pdfHash,'Gray proof binding');
  for(const [mode,p] of [['color',color],['fresh_grayscale',gray]])pageObservations.push({edition,page:i+1,mode,path:p,sha256:sha(p),source_pdf_sha256:pdfHash,personally_read_completely:true,personally_inspected_at_normal_reading_scale:true,observation:note,visible_student_defects:[],grayscale_readability:mode==='fresh_grayscale'?'Labels, shape channels, hatching, tables and body readable; no colour-only information loss.':null});
 });
}
const figureNotes={fig_1:'18/14/10/6 bars at price10; only buyers1–3 purchased, upper 8/4 hatch and buyer3 zero, no negative surplus for buyer4.',fig_2:'Axes only, (0,40),(80,0), no premature demand/price/area.',fig_3:'Bookfair demand and given P10/Q60, unshaded.',fig_4:'Bookfair CS900 upper hatch and payment600 rectangle, distinct labels and regions.',we_1:'Museum P10/Q20, upper CS200, coordinate/axis units correct.',ex_1:'Aquarium P8/Q32 supplied graph unshaded, learner must select area.',ex_2:'Garden guided CS400 with base40/height20 explicitly supplied.',ex_3:'Climbing line only; price/quantity/CS remain learner construction.',ex_4:'Aquarium answer CS256, (32,8), upper triangle correct.',ex_5:'Garden answer CS400, (40,10), no misleading full-support basis caption.',ex_6:'Climbing answer CS144, (24,12), correct upper triangle.',ex_7:'Boardgame answer CS225, (30,5), demand intercepts20/40.',ex_8:'Skate answer CS576, (48,12), demand intercepts36/72.',ex_9:'Cafe answer CS196/payment392 distinct regions, (28,14), intercepts28/56.',ex_10:'Concert target answer CS900, (60,20), intercepts50/100, correct group answer figure only.'};
const figureObservations=Object.entries(figureNotes).map(([stem,observation])=>{const png=path.join(lesson,`_assets/2.3.1_${stem}.png`),svg=png.replace(/\.png$/,'.svg');return {stem,png_path:png,png_sha256:sha(png),svg_path:svg,svg_sha256:sha(svg),personally_inspected_native_png:true,observation,visible_student_defects:[],geometry:'Native 2400x1800 raster / 1200x900 SVG; text and direct labels clear, no clipping or collisions.',placed_font:'Actual 30pt SVG (=40px), 166mm/1200px placement gives 15.685039pt labels; native print checker verifies placement.'};});

const md=read(path.join(lesson,'2.3.1 Consumentensurplus – paragraaf.md'));
const answers=read(path.join(lesson,'2.3.1 Consumentensurplus – antwoorden.md'));
const teachingContract=(p,a)=>{
 assert(p.includes('Formule: driehoek bij een lineaire vraaglijn'),'Linear qualifier at first formula');
 assert(p.includes('Bij een lineaire vraaglijn en volledige verkoop aan de hoogste vragers: CS'),'Recap linear qualifier');
 const b=a.split('## Denkertje / Bonusopgave\n')[1].split('## Herhaling / Herhaling en interleaving\n')[0];
 const [model,criteria]=b.split('**Beoordelingscriteria**');
 assert(model.includes('De uitspraak klopt niet') && model.includes('(18 − 10) + (14 − 10) + (10 − 10) = € 12') && model.includes('(14 − 6) + (10 − 6) + (6 − 6) = € 12') && model.includes('niet aan de drie hoogste vragers'),'Whole bounded bonus model');
 assert((criteria?.match(/^- /gm)||[]).length===3,'Exactly three following criteria');
};
teachingContract(md,answers);
const teachingProbes=[];
for(const [name,p,a] of [['first formula linear qualifier removed',md.replace('Formule: driehoek bij een lineaire vraaglijn','Formule'),answers],['recap linear qualifier removed',md.replace('Bij een lineaire vraaglijn en volledige verkoop aan de hoogste vragers: CS','CS'),answers],['bonus model amount altered',md,answers.replace('(14 − 6) + (10 − 6) + (6 − 6) = € 12','(14 − 6) + (10 − 6) + (6 − 6) = € 24')],['bonus three criteria removed',md,answers.replace('**Beoordelingscriteria**','')]]){
 let rejected=false;try{teachingContract(p,a)}catch{rejected=true}assert(rejected,name);teachingProbes.push({probe:name,result:'REJECTED_AS_REQUIRED'});
}
const report={reviewer:'paragraph_231_independent_review',date:'2026-09-06',published_source_pair:{platform:'85fa4910a7e6bcac69b36c38bffdf6c0d10d0c68',lessons:'384d9967a124fcc917a2eea3fe549829919cbeb7'},inspection_method:'Personal direct full-page color and freshly rendered grayscale reading of every page; personal separate inspection of all 15 native PNGs. Not contact-sheet-only and not inferred from an automated PASS. This script only binds those completed observations to hashes.',page_observations:pageObservations,native_figure_observations:figureObservations,additional_teaching_mutations:teachingProbes,counts:{color_pages:33,grayscale_pages:33,native_figures:15,additional_negative_probes:4},native_manifests:'Preserved PENDING; this separate reviewer report does not rewrite builder inspection fields.',status:'PASS_SUBSTANTIVE_RENDER_REVIEW',timing:'UNOBSERVED: planned 52-minute core, 64 with support, 76–80 with all optional material; no classroom feasibility or attainment claim.',scope:'Original 66 UNKNOWN grayscale paths remain a separate integration FAIL in this unchanged reviewed branch.'};
fs.writeFileSync(`reports/sprints/${prefix}-inspection.json`,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:report.status,counts:report.counts,all_page_and_native_figure_observations_bound:true,native_manifests_untouched:true}));
