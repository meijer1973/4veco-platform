'use strict';
// HOW TO ADAPT: §232 only. Exact six-market geometry; shared Sharp rasterizer.
// Native author controller gates this worker before output. --describe is read-only.
const fs=require('fs'),path=require('path'),a=require('assert/strict');
const C={ink:'#2D3748',demand:'#1A5276',supply:'#1E8449',bg:'#F7FAFC'};
const models={
 tulips:{a:30,b:.5,c:6,d:.25,qmax:60,pmax:30,qstep:10,pstep:6,title:'Tulpenbossen',unit:'bos',plural:'bossen'},
 towels:{a:30,b:1,c:6,d:1,qmax:30,pmax:40,qstep:6,pstep:10,title:'Sporthanddoeken',unit:'handdoek',plural:'handdoeken'},
 plants:{a:18,b:1,c:6,d:1,qmax:18,pmax:24,qstep:3,pstep:6,title:'Plantjes',unit:'plantje',plural:'plantjes'},
 candles:{a:26,b:.5,c:8,d:.25,qmax:52,pmax:26,qstep:13,pstep:6.5,title:'Kaarsen',unit:'kaars',plural:'kaarsen'},
 fruit:{a:36,b:.5,c:6,d:.25,qmax:72,pmax:36,qstep:12,pstep:6,title:'Fruitrepen',unit:'reep',plural:'fruitrepen'},
 concert:{a:50,b:.5,c:5,d:.25,qmax:100,pmax:50,qstep:20,pstep:10,title:'Concertkaartjes',unit:'kaartje',plural:'kaartjes'}
};
const specs=[
 ['fig_1','discrete','discrete','Eén paraplureparatie: de klant wint 8 euro en de reparateur 3 euro ten opzichte van betalingsbereidheid en marginale kosten. Samen is dat 11 euro.','Surplus van koper en reparateur bij één paraplureparatie.'],
 ['fig_2','tulips','demand','De vraag naar tulpenbossen: de betalingsbereidheid daalt van 30 naar 0 euro binnen het gegeven modelbereik.','Vraaglijn voor tulpenbossen vóór toevoeging van de aanbodlijn.'],
 ['fig_3','tulips','equilibrium','Het snijpunt van vraag en aanbod ligt bij 32 bossen en 14 euro per bos; beide functies geven dezelfde prijs.','Evenwicht van vraag en aanbod voor tulpenbossen.'],
 ['fig_4','tulips','cs','CS ligt boven 14 euro en onder de vraaglijn, van 0 tot 32 bossen; basis 32 en hoogte 16 leveren 256 euro op.','Consumentensurplus boven de prijs van tulpenbossen.'],
 ['fig_5','tulips','both','PS ligt onder 14 euro en boven de aanbodlijn, van 0 tot 32 bossen. PS is 128 euro; samen met CS is TS 384 euro.','Consumenten- en producentensurplus bij tulpenbossen.'],
 ['fig_6','summary','summary','Per transactie valt de prijs weg uit CS plus PS: het totale voordeel is betalingsbereidheid min marginale kosten. Een totaal is geen eerlijkheidsoordeel.','Samenhang van CS, PS en TS en de grens van een verdelingsuitspraak.'],
 ['we_1','towels','both','De markt voor sporthanddoeken heeft evenwicht 12 stuks bij 18 euro. CS en PS zijn elk 72 euro; TS is 144 euro.','Uitgewerkt surplusmodel voor sporthanddoeken.'],
 ['ex_1','plants','guided','Bij de plantjes zijn evenwicht, beide surplusgebieden en basis en hoogten al aangegeven als steun voor de berekening.','Gemarkeerde surplusgebieden bij plantjes met basis en hoogten.'],
 ['ex_2','candles','bare','De vraag- en aanbodlijn voor kaarsen staan volledig getekend. De gevraagde evenwichts- en surplusmarkeringen ontbreken nog.','Geleverde vraag- en aanbodlijnen voor kaarsen zonder antwoordmarkeringen.'],
 ['ex_3','fruit','bare','De vraag- en aanbodlijn voor fruitrepen zijn gegeven; de evenwichts- en surplusmarkeringen zijn nog niet ingevuld.','Geleverde vraag- en aanbodlijnen voor fruitrepen zonder antwoordmarkeringen.'],
 ['ex_4','concert','bare','De basisgrafiek bij de concertkaartjes bevat de volledige, gelabelde vraag- en aanbodlijn. Evenwicht, CS en PS zijn nog niet gemarkeerd.','Basisgrafiek voor concertkaartjes met vraag en aanbod zonder antwoordmarkeringen.'],
 ['ex_5','candles','both','Bij kaarsen ligt het evenwicht op 24 stuks en 14 euro; CS is 144 euro, PS 72 euro en TS 216 euro.','Oplossing van de surplusmarkeringen bij kaarsen.'],
 ['ex_6','fruit','both','Bij fruitrepen ligt het evenwicht op 40 stuks en 16 euro; CS is 400 euro, PS 200 euro en TS 600 euro.','Oplossing van de surplusmarkeringen bij fruitrepen.'],
 ['ex_7','concert','both','Bij concertkaartjes ligt het evenwicht op 60 kaartjes en 20 euro; CS is 900 euro, PS 450 euro en TS 1.350 euro.','Oplossing van het evenwicht en de surplusgebieden bij concertkaartjes.']
].map(([suffix,model,stage,caption,alt])=>({suffix,stem:'2.3.2_'+suffix,model,stage,caption,alt}));
const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const n=x=>Number(x.toFixed(6)),nl=x=>String(n(x)).replace('.',',');
const text=(id,x,y,value,anchor='start',transform='')=>`<text id="${id}" x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" font-family="Arial" font-size="40" font-weight="400" fill="${C.ink}"${transform?' transform="'+transform+'"':''}>${esc(value)}</text>`;
const line=(id,x1,y1,x2,y2,color=C.ink,dash='')=>`<line id="${id}" x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${color}" stroke-width="4"${dash?' stroke-dasharray="'+dash+'"':''}/>`;
function frame(s,body){return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" role="img" aria-labelledby="title desc">
<title id="title">${esc(s.alt)}</title><desc id="desc">${esc(s.caption)}</desc>
<defs><pattern id="cs-hatch" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M-6,6 L6,-6 M0,24 L24,0 M18,30 L30,18" stroke="${C.ink}" stroke-width="2"/></pattern><pattern id="ps-dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="2.5" fill="${C.ink}"/></pattern></defs>
<rect width="1200" height="900" fill="${C.bg}"/>
${body}
</svg>
`;}
function graph(s){
 const m=models[s.model],Q=(m.a-m.c)/(m.b+m.d),P=m.a-m.b*Q;
 a.equal(P,m.c+m.d*Q);const X=q=>180+900*q/m.qmax,Y=p=>720-540*p/m.pmax;
 const eq=!['bare','demand'].includes(s.stage),cs=['cs','both','guided'].includes(s.stage),ps=['both','guided'].includes(s.stage);
 let b=text('scene',600,68,m.title,'middle');
 if(s.stage==='guided')b+=text('geometry-help',600,125,'Basis 6; hoogten 6 en 6','middle');
 b+=text('p-title',55,450,'P (€ per '+m.unit+')','middle','rotate(-90 55 450)');
 for(let p=0;p<=m.pmax+.001;p+=m.pstep){b+=line('ptick-'+n(p),170,Y(p),180,Y(p));if(!eq||Math.abs(Y(p)-Y(P))>=48)b+=text('pnum-'+n(p),155,Y(p)+14,nl(p),'end');}
 for(let q=0;q<=m.qmax+.001;q+=m.qstep){b+=line('qtick-'+n(q),X(q),720,X(q),730);if(!eq||Math.abs(X(q)-X(Q))>=85)b+=text('qnum-'+n(q),X(q),790,nl(q),'middle');}
 if(eq)b+=text('pe-number',155,Y(P)+14,nl(P),'end')+text('qe-number',X(Q),790,nl(Q),'middle');
 b+=line('p-axis',180,180,180,720)+line('q-axis',180,720,1080,720)+text('q-title',630,860,'Q ('+m.plural+')','middle');
 function region(id,vertices,fill,pattern){const pts=vertices.map(([q,p])=>n(X(q))+','+n(Y(p))).join(' ');return `<polygon id="${id}-fill" points="${pts}" fill="${fill}" fill-opacity="0.45"/><polygon id="${id}-pattern" points="${pts}" fill="url(#${pattern})" stroke="${C.ink}" stroke-width="4"/>`;}
 if(cs)b+=region('cs',[[0,m.a],[0,P],[Q,P]],'#85C1E9','cs-hatch');
 if(ps)b+=region('ps',[[0,P],[0,m.c],[Q,P]],'#82E0AA','ps-dots');
 b+=line('demand',X(0),Y(m.a),X(m.qmax),Y(m.a-m.b*m.qmax),C.demand);
 if(s.stage!=='demand')b+=line('supply',X(0),Y(m.c),X(m.qmax),Y(m.c+m.d*m.qmax),C.supply,'20 12');
 // Each direct label sits in open space on the right, displaced from its curve.
 const ql=.83*m.qmax,dx=X(ql),dy=Y(m.a-m.b*ql);
 b+=text('demand-label',dx,dy-70,'Vraag','middle');
 if(s.stage!=='demand'){
  const sl=.82*m.qmax,sy=Y(m.c+m.d*sl);
  const below=m.d*m.qmax/m.pmax>.500001;
  b+=text('supply-label',X(sl),sy+(below?115:-55),'Aanbod / MK','middle');
 }
 if(eq){b+=line('price',180,Y(P),X(Q),Y(P),C.ink,'12 8')+line('quantity',X(Q),Y(P),X(Q),720,C.ink,'12 8');
  b+=`<circle id="equilibrium" cx="${n(X(Q))}" cy="${n(Y(P))}" r="6" fill="${C.ink}"/>`+text('e-label',X(Q)+90,Y(P)-(m.d*m.qmax/m.pmax>.500001?90:70),'E');
 }
 if(cs){const q=.15*Q,cy=Y((P+m.a-m.b*q)/2);b+=`<rect id="cs-label-background" x="${n(X(q)-48)}" y="${n(cy-30)}" width="96" height="60" fill="${C.bg}"/>`+text('cs-label',X(q),cy+14,'CS','middle');}
 if(ps){const q=.15*Q,cy=Y((P+m.c+m.d*q)/2);b+=`<rect id="ps-label-background" x="${n(X(q)-48)}" y="${n(cy-30)}" width="96" height="60" fill="${C.bg}"/>`+text('ps-label',X(q),cy+14,'PS','middle');}
 return frame(s,b);
}
function discrete(s){let b=text('scene',600,68,'Eén paraplureparatie','middle');
 b+='<rect id="buyer-band" x="220" y="240" width="390" height="240" fill="#85C1E9" fill-opacity="0.45"/><rect x="220" y="240" width="390" height="240" fill="url(#cs-hatch)"/>';
 b+='<rect id="seller-band" x="220" y="480" width="390" height="90" fill="#82E0AA" fill-opacity="0.45"/><rect x="220" y="480" width="390" height="90" fill="url(#ps-dots)"/>';
 b+=line('wtp',220,240,610,240)+line('price',220,480,610,480)+line('mc',220,570,610,570);
 b+=text('wtp-label',650,255,'WTP: € 18')+text('price-label',650,495,'Prijs: € 10')+text('mc-label',650,585,'MK: € 7');
 b+=`<rect id="cs-label-background" x="310" y="321" width="180" height="60" fill="${C.bg}"/><rect id="ps-label-background" x="310" y="496" width="180" height="60" fill="${C.bg}"/>`;
 b+=text('cs-label',400,365,'CS: € 8','middle')+text('ps-label',400,540,'PS: € 3','middle')+text('ts-label',650,380,'TS: € 11');
 b+=text('meaning',600,710,'Eén werkelijke transactie','middle');return frame(s,b);}
function summary(s){let b=text('scene',600,68,'Voordeel per transactie','middle');
 for(const[i,[label,rule]]of [['CS per gekochte eenheid','WTP − P'],['PS per verkochte eenheid','P − MK'],['TS per transactie','WTP − MK = CS + PS']].entries()){
  const y=160+i*220;b+=`<rect id="group-${i}" x="100" y="${y}" width="1000" height="170" fill="none" stroke="${C.ink}" stroke-width="4"/>`;
  b+=text('group-title-'+i,180,y+65,label)+text('group-rule-'+i,180,y+120,rule);
 }return frame(s,b);}
const sources=()=>Object.fromEntries(specs.map(s=>[s.stem,s.stage==='discrete'?discrete(s):s.stage==='summary'?summary(s):graph(s)]));
async function main(){if(process.argv[2]==='--describe'){console.log(JSON.stringify({models,specs}));return;}
 const output=path.resolve(process.argv[2]||'');if(path.basename(output)!=='_assets'||path.basename(path.dirname(output))!=='2.3.2 Producentensurplus en totaal surplus')throw Error('Exact §232 native _assets required');
 const sharp=require('sharp');fs.mkdirSync(output,{recursive:true});for(const[stem,svg]of Object.entries(sources())){fs.writeFileSync(path.join(output,stem+'.svg'),svg);await sharp(Buffer.from(svg)).resize(2400,1800).png().toFile(path.join(output,stem+'.png'));}
 console.log(JSON.stringify({pairs:14,canvas:[1200,900],png:[2400,1800],font_css_px:40,inspection:'NOT_PERFORMED_BY_GENERATOR'}));}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={models,specs,sources};
