// Classroom presentation for Book 1, second edition 2026. Sources and prerequisite
// trace are in presentation-122.tweede-editie-2026.manifest.json.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('122');
const provenance=JSON.parse(await fs.readFile(new URL('./presentation-122.tweede-editie-2026.manifest.json',import.meta.url),'utf8'));
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#1A5276',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', TITLE='§1.2.2 Vraagfactoren';
const tables=[],charts=[],slides=[],overviewSlides=[],graphContracts=[];
const source=`https://github.com/meijer1973/4veco-lessen/blob/${provenance.lessonCommit}/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/edities/tweede-editie-2026/`;
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,65),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer=TITLE){const s=p.slides.add();s.background.fill=C.paper;text(s,title,60,42,1480,86,50,{bold:true});rule(s,60,146,1480);text(s,footer,60,848,1380,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});slides.push({number:p.slides.items.length,title});return s;}
function notes(s,page,explanation,question,pitfall,transition,authored=false){s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 1, tweede editie 2026, gedrukte boekpagina ${page}. ${source}boek/Boek_1_Compleet_Tweede_editie.pdf\nManuscript: ${source}bronnen/H2/1.2.2%20Vraagfactoren%20%E2%80%93%20paragraaf.md\nAntwoordmodel: ${source}bronnen/H2/Antwoorden.md\n${authored?'Uitlegvoorbeeld — niet uit het boek. Stadfiets, de verhuurde fietsen, scooterverhuur en alle bijbehorende gegevens zijn voor deze presentatie bedacht. De boekverwijzing onderbouwt alleen de methode.':''}`);}
function table(s,values,x,y,w,h,widths,size=33){const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:1,style:'solid'});for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const a=t.getCell(r,c);a.fill=r===0?C.ink:(r%2?C.paper:C.pale);a.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}tables.push(p.slides.items.length);return t;}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 19.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: '+TITLE);overviewSlides.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+(i+1)});text(s,r,116,ys[i],785,hs[i],30,{bold:active===i+1,color,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Oorzaken onderscheiden,\nbewegen of verschuiven tekenen\nen twee effecten combineren.',972,244,565,122,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 62 · Opgaven 12 en 13\n13: verkennen met de theorie\nop pagina 58–59',972,459,565,109,30,{bold:active===2,name:'overview-start'});rule(s,972,584,568);
 text(s,'Huiswerk',972,606,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§1.2.2 Vraagfactoren\nBasis: 14, 15 en 16\nZelfstandig: 17 en 18\nDoelopgave: 19\nMaken en nakijken',972,661,565,182,30,{bold:active===7,name:'overview-homework'});
 notes(s,'14, 48–49, 58–66',`Laat de dia staan tijdens ${phase.toLowerCase()}. Start 12–13 staat op p. 62. Basis 14 op p. 62, 15 op p. 63 en 16 op p. 64. Zelfstandig 17 op p. 64 en 18 op p. 65. Doelopgave 19 staat volledig op p. 66. Huiswerk: 14, 15, 16, 17, 18 en 19 maken en nakijken. Bonus 20 en herhaling 21–22 zijn extra. Start 12 herhaalt (nieuw − oud) / oud × 100% van p. 14 en invullen uit §1.2.1 p. 48. Herinner zo nodig aan haakjes en het minteken bij daling. Start 13 gebruikt het nieuwe onderscheid tussen bewegen en verschuiven. Laat leerlingen daarvoor p. 58–59 openen, de oorzaak in de opgave onderstrepen en bij de passende definitie zoeken. Een eerste poging met steun is een verkenning, geen bewijs van beheersing. Keer vóór het basiswerk naar 13 terug: laat de leerling de oorzaak en verandering opnieuw benoemen en vraag waarom de lijn gelijk blijft. De vorige paragraaf leerde q, P, invullen, snijpunten en (q; P) op p. 48–49. Deze les gaat naar groepsvraag Q, zonder al individuele vragen op te tellen. De complete route hoeft niet in één les af.`,active===2?'Welke stap herken je al, en waar heb je theorie bij nodig?':'Welke uitleg helpt je om startopgave 13 nu opnieuw te beantwoorden?','Hoofdstukpagina 18 is gedrukte boekpagina 62. De boekeditie en de gedrukte voetregels zijn gecontroleerd.',active===7?'Laat het huiswerk in de agenda zetten. De volgende paragraaf telt individuele vragen op.':'Ga verder wanneer de klas klaar is voor de volgende lesfase.');return s;
}
function example(s){text(s,'Uitlegvoorbeeld — niet uit het boek',60,174,1480,42,29,{color:C.muted});}
function series(name,points,color,width=4,style='solid',label){return {name,xValues:points.map(a=>Number(a[0].toPrecision(14))),values:points.map(a=>Number(a[1].toPrecision(14))),line:{fill:color,width,style},marker:{symbol:'none'},...(label?{dataLabelOverrides:[{idx:label.idx,text:label.text,position:label.pos||'top',showValue:false,textStyle:{typeface:FONT,fontSize:28,fill:color,bold:true}}]}:{})};}
const E={key:'Stadfiets',a:90,b:3,delta:18,p0:10,p1:14,xmax:120,ymax:40,xstep:20,ystep:10,unit:'fietsen per dag',single:'fiets per dag'};
const T={key:'Lumi',a:100,b:5,delta:20,p0:8,p1:10,xmax:120,ymax:24,xstep:20,ystep:4,unit:'bezoeken per week',single:'bezoek'};
function graph(s,m,{stage=0,intercepts=false,y=235,w=1010,h=554}={}){
 const ss=[],drawnCurves=[],drawnPoints=[];
 const curve=(name,a,color)=>{const points=[[0,a/m.b],[a*.80,(a-a*.80)/m.b],[a,0]];ss.push(series(name,points,color,4,'solid',{idx:1,text:name,pos:'top'}));drawnCurves.push({name,a,b:m.b,points});};
 curve('V₀',m.a,C.blue);if(stage>=2)curve('V₁',m.a+m.delta,C.green);
 const addPoint=(name,q,pr,pos)=>{
  const offset=name==='A'?[-2.8,-m.ymax*.075]:name==='B'?[2.8,m.ymax*.075]:null;
  ss.push({name,xValues:[q],values:[pr],line:{fill:'none',width:0},marker:{symbol:'circle',size:10,fill:C.ink,line:{fill:C.ink,width:1}},...(offset?{}:{dataLabelOverrides:[{idx:0,text:name,position:pos,showValue:false,textStyle:{typeface:FONT,fontSize:28,bold:true,fill:C.ink}}]})});
  // Native chart label positions are displaced from the marker so guide lines
  // do not pass through the letters. The marker retains exact data coordinates.
  if(offset)ss.push(series(name+' label',[[q+offset[0],pr+offset[1]]],C.ink,0,'solid',{idx:0,text:name,pos:'center'}));
  drawnPoints.push({name,q,p:pr});
 };
 const guide=(q,pr)=>{ss.push(series('Hulplijnen',[[0,pr],[q,pr],[q,0]],C.muted,1.5,'dashed'));};
 const arrow=(name,from,to,color)=>{ss.push(series(name,[from,to],color,4));const dx=to[0]-from[0],dy=to[1]-from[1];const n=Math.hypot(dx/m.xmax,dy/m.ymax);const ux=dx/m.xmax/n,uy=dy/m.ymax/n;const len=.018,wing=.009;const aa=[to[0]-m.xmax*(len*ux+wing*uy),to[1]-m.ymax*(len*uy-wing*ux)];const bb=[to[0]-m.xmax*(len*ux-wing*uy),to[1]-m.ymax*(len*uy+wing*ux)];ss.push(series(name+' pijlpunt',[aa,to,bb],color,4));};
 const qa=m.a-m.b*m.p0,qb=m.a-m.b*m.p1,qc=qb+m.delta;
 if(stage>=0.5){guide(qa,m.p0);addPoint('A',qa,m.p0,'bottom');}
 if(stage>=1){guide(qb,m.p1);addPoint('B',qb,m.p1,'left');arrow('Alleen eigen prijs',[qa,m.p0],[qb,m.p1],C.orange);}
 if(stage>=2){guide(qc,m.p1);addPoint('C',qc,m.p1,'top');arrow('Andere vraagfactor',[qb,m.p1],[qc,m.p1],C.green);}
 if(intercepts){const a=stage>=2?m.a+m.delta:m.a;addPoint(`(0; ${a/m.b})`,0,a/m.b,'right');addPoint(`(${a}; 0)`,a,0,'top');}
 const ch=s.charts.add('scatter',{position:{left:60,top:y,width:w,height:h},series:ss,scatterOptions:{style:'lineWithMarkers'},hasLegend:false,dataLabels:{showValue:false},xAxis:{min:0,max:m.xmax,majorUnit:m.xstep,numberFormatCode:'0',title:{text:`Q (${m.unit})`,textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5}},yAxis:{min:0,max:m.ymax,majorUnit:m.ystep,numberFormatCode:'0',title:{text:`P (€ per ${m.single})`,textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:{fill:C.line,width:1}},chartFill:C.paper,plotAreaFill:C.paper});applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 for(const c of drawnCurves)for(const [q,pr] of c.points)assert(Math.abs(q-(c.a-c.b*pr))<1e-8);
 for(const pt of drawnPoints){if(['A','B','C'].includes(pt.name))assert.equal(pt.q,m.a+(pt.name==='C'?m.delta:0)-m.b*pt.p);}
 graphContracts.push({slide:p.slides.items.length,model:m,stage,drawnCurves,drawnPoints,series:ss});return ch;
}

overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 [['Oorzaak','Eigen prijs of een andere vraagfactor?'],['Grafiek','Een ander punt of een andere lijn?'],['Twee veranderingen','Eerst afzonderlijk, daarna samen.']].forEach((a,i)=>{const y=218+i*155;text(s,a[0],60,y,590,65,40,{bold:true,color:C.blue});text(s,a[1],690,y,850,110,39);rule(s,60,y+119,1480);});
 text(s,'Eerst het product en de periode kiezen',60,744,1480,70,43,{bold:true});
 notes(s,'48–49, 58–61','De doelen bereiden op opgave 19 voor: invullen, specifieke factor benoemen, V₁ en A/B/C tekenen, netto-effect berekenen en een foute verklaring weerleggen. Verbind de bekende coördinatenvolgorde (q; P) met groepsvraag (Q; P). q hoort bij één koper, Q bij de groep. Het optellen van kopers komt pas in §1.2.3.','Wat betekent de horizontale as van een vraaggrafiek?','Vraag is wat kopers willen en kunnen kopen, geen vastgestelde verkoop of evenwicht.','Introduceer een eigen context met eigen gegevens.');
}
{
 const s=slide('Stadfiets: twee veranderingen');example(s);
 text(s,'Q = 90 − 3P',60,260,800,85,57,{bold:true,color:C.blue});text(s,'Q: fietsen per dag\nP: euro per fiets per dag\nGeldig voor 0 ≤ P ≤ 30',950,250,590,150,34);
 table(s,[['Verandering','Gegeven in dit voorbeeld'],['Eigen huurprijs','Van € 10 naar € 14 per fiets per dag'],['Scooterverhuur wordt duurder','Een substituut. Bij elke prijs 18 fietsen meer gevraagd.']],60,436,1480,273,[560,920],34);
 text(s,'De nieuwe lijn blijft recht tot Q = 0. Verder verandert niets.',60,756,1480,68,34,{bold:true});
 notes(s,'58–61','Dit is een zelfgemaakt voorbeeld. Onderzoek de groepsvraag naar huurfietsen bij Stadfiets per dag. Scooterverhuur kan die huur volgens de veronderstelling vervangen. De effectgrootte +18 komt uit het voorbeeld en is geen algemene wet. De nieuwe lijn blijft recht tot de hoeveelheid nul wordt. De prijsstijging en de duurdere scooter gebeuren tegelijk; we bekijken ze in denkstappen.','Welke verandering betreft het onderzochte product zelf?','Scooterhuur en fietshuur zijn twee verschillende prijzen.','Begin bij de oude situatie en de bekende grafiekprocedure.',true);
}
{
 const s=slide('De oude vraaglijn en het beginpunt');example(s);graph(s,E,{stage:.5,intercepts:true});
 text(s,'Bij P = € 10',1130,254,410,65,38,{bold:true,color:C.blue});text(s,'Q = 90 − 3 × 10\nQ = 60',1130,343,410,128,37,{bold:true});
 text(s,'A = (60; 10)',1130,520,410,63,38,{bold:true});text(s,'Q horizontaal\nP verticaal',1130,638,410,120,36);
 notes(s,'48–49, 58','Herhaal de tekenprocedure. P=0 geeft Q=90: (90;0). Q=0 geeft 3P=90 en P=30: (0;30). Verbind de snijpunten en zet A=(60;10) op de lijn. De assen tonen aantallen fietsen per dag en euro per fiets per dag. Alle grafieken van Stadfiets gebruiken dezelfde schalen.','Welk getal in (60;10) staat horizontaal?','Een prijs boven 30 valt buiten deze oude functie; een negatieve hoeveelheid is geen vraag.','Verander nu alleen de eigen fietsprijs.',true);
}
{
 const s=slide('Eigen prijs: bewegen langs V₀');example(s);graph(s,E,{stage:1});
 text(s,'€ 10 wordt € 14',1130,244,410,72,38,{bold:true,color:C.orange});text(s,'Q = 90 − 3 × 14\nQ = 48',1130,349,410,126,36,{bold:true});text(s,'B = (48; 14)',1130,525,410,65,38,{bold:true});text(s,'12 fietsen minder\nDe lijn blijft gelijk.',1130,650,410,116,35);
 notes(s,'58, 61','A wordt B langs dezelfde V₀. 48−60=−12 fietsen per dag. De overige omstandigheden houden we voor deze denkstap gelijk. B is een berekende tussensituatie, niet een afzonderlijk waargenomen gebeurtenis. De oranje pijl volgt de bestaande vraaglijn.','Waarom verplaatsen we het punt, maar laten we V₀ liggen?','Een hoger punt door een hogere prijs is geen verschuiving van de hele lijn.','Vergelijk daarna bij dezelfde prijs de oude met de nieuwe vraag.',true);
}
{
 const s=slide('Andere prijs: de vraaglijn verschuift');example(s);graph(s,E,{stage:2});
 text(s,'Bij dezelfde € 14',1130,244,410,72,37,{bold:true,color:C.green});text(s,'48 + 18 = 66\nfietsen per dag',1130,350,410,133,37,{bold:true});text(s,'C = (66; 14)',1130,530,410,62,38,{bold:true});text(s,'Scooterhuur duurder\nV₁ ligt rechts van V₀.',1130,650,410,125,34);
 notes(s,'59–61','De factor is de prijs van een substituut. Sommige klanten kiezen huurfietsen in plaats van de duurdere scooters. Bij iedere onderzochte prijs zijn er 18 fietsen extra gevraagd. De horizontale vergelijking B naar C houdt de fietsprijs op 14. De nieuwe lijn geldt als Q=108−3P tot P=36. Het verschil tussen de lijnen is horizontaal 18 bij eenzelfde prijs binnen beide domeinen.','Welke prijs blijft gelijk in de vergelijking van B en C?','Noem de prijs van een substituut, niet alleen een veranderde voorkeur.','Bereken nu hoe je de nieuwe lijn zelf tekent.',true);
}
{
 const s=slide('De nieuwe lijn tekenen');example(s);
 text(s,'Q = (90 − 3P) + 18 = 108 − 3P',60,248,1480,85,52,{bold:true,color:C.green});
 table(s,[['Snijpunt','Berekening','Coördinaat (Q; P)'],['Q-as: P = 0','Q = 108 − 3 × 0 = 108','(108; 0)'],['P-as: Q = 0','0 = 108 − 3P; 3P = 108; P = 36','(0; 36)']],60,390,1480,280,[410,700,370],32);
 text(s,'Verbind beide punten. Geldig voor 0 ≤ P ≤ 36.',60,722,1480,67,40,{bold:true});
 notes(s,'48–49, 59–61','De bron zegt +18 bij elke prijs, zodat alleen het constante getal van 90 naar 108 gaat. Voor het snijpunt met de prijsas lossen we Q=0 op. De bekende algebra geeft P=36. De uitbreiding tot die nulvraag is toegestaan omdat de voorbeeldbron de nieuwe lijn expliciet recht laat blijven. Controleer C: 108−3×14=66. Het snijpunt is geen daadwerkelijk gekozen marktprijs.','Waarom blijft de coëfficiënt −3 gelijk?','Tel geen 18 euro bij P op: de verandering is 18 fietsen.','Benoem ook de andere mogelijke vraagfactoren.',true);
}
{
 const s=slide('Substituten en complementen');
 table(s,[['Relatie uit de bron','Verandering','Vraag naar onderzocht product'],['Vervangen elkaar\nThee en koffie','Thee wordt duurder.\nKoffieprijs blijft gelijk.','Koffie: naar rechts'],['Samen gebruiken\nPrinter en inkt','Printer wordt duurder.\nInktprijs blijft gelijk.','Inkt: naar links']],60,232,1480,410,[475,500,505],34);
 text(s,'De specifieke factor: de prijs van een ander goed',60,731,1480,75,41,{bold:true,color:C.blue});
 notes(s,'60','Dit zijn de uitlegvoorbeelden uit de theorie, geen toegewezen oefenuitwerkingen. Substituten kunnen elkaar vervangen. Bij duurdere thee kiezen sommige kopers koffie. Complementen worden samen gebruikt. Bij duurdere printers koopt men minder printers en is minder bijpassende inkt nodig. De conclusie berust op het gegeven gebruik.','Welk product onderzoeken we in elke rij?','De printerprijs is niet de inktprijs. De relatie tussen goederen hangt af van de context.','Bekijk overige oorzaken, steeds bij gelijkblijvende eigen prijs.');
}
{
 const s=slide('Andere vraagfactoren');
 table(s,[['Factor','Wat bepaalt de richting?'],['Inkomen','Lees het gedrag: meer concerten kan rechts betekenen, minder goedkope maaltijden links.'],['Behoeften en voorkeuren','Meer waardering voor dit product: bij dezelfde prijs meer vraag.'],['Aantal kopers','Meer kopers vergroot de vraag van de groep.'],['Verwachtingen','Korting volgende week verwacht en aankoop uitgesteld: minder vraag nú.']],60,210,1480,520,[445,1035],32);
 text(s,'Vergelijk hetzelfde product, dezelfde prijs en dezelfde periode.',60,768,1480,65,36,{bold:true,color:C.blue});
 notes(s,'59–60','Inkomen heeft geen automatische richting voor elk goed. Geef de bronvoorbeelden: vaker concerten versus minder goedkope maaltijden omdat men vaker uit eten gaat. Bij voorkeuren kan warmer weer de behoefte aan ijs vergroten. Meer kopers verandert groepsvraag Q, zonder dat één bestaande koper meer hoeft te willen. Verwachtingen raken de huidige vraag als klanten nu uitstellen. De huidige eigen prijs blijft bij deze vergelijkingen gelijk.','Waarom is alleen “inkomen stijgt” onvoldoende om de richting te kennen?','Noem het brongegeven gedrag en verander de periode niet van nu naar volgende week.','Combineer de twee berekende effecten van Stadfiets.');
}
{
 const s=slide('Twee effecten samen');example(s);
 table(s,[['Denkstap','Gevraagde fietsen per dag','Verandering'],['A: oude situatie','60','—'],['B: alleen eigen prijs hoger','48','−12'],['C: ook scooterhuur duurder','66','+18 vanaf B']],60,254,1480,355,[665,505,310],33);
 text(s,'60 − 12 + 18 = 66 fietsen per dag',60,667,1480,75,47,{bold:true,color:C.green});text(s,'Tegengestelde effecten. Netto: 66 − 60 = 6 meer.',60,769,1480,62,36,{bold:true});
 notes(s,'61','De prijsstijging verkleint de gevraagde hoeveelheid en de duurdere scooter vergroot deze. Daarom werken ze elkaar tegen. Het verschuivingseffect is groter en het resultaat ligt 6 fietsen per dag boven de oude situatie. Alleen C bevat beide gelijktijdige veranderingen.','Vergelijk je voor het netto-effect C met A of met B?','+18 is alleen het verschuivingseffect. Het netto-effect is +6.','Controleer of de klas ook begrijpt wat zonder effectgroottes kan worden geconcludeerd.',true);
}
{
 const s=slide('Korte controle: de grootte ontbreekt');example(s);
 text(s,'Een afzonderlijke situatie zonder formule of effectgroottes',60,250,1480,90,42,{bold:true,color:C.blue});
 text(s,'De eigen fietsprijs stijgt.\nScooterhuur wordt ook duurder.\nScooterhuur is een substituut.',60,393,1480,180,43);
 text(s,'Worden uiteindelijk meer of minder fietsen gevraagd?',60,686,1480,107,47,{bold:true});
 notes(s,'61','Dit is een nieuwe, afzonderlijke situatie. De vorige getallen gelden hier niet. Laat leerlingen eerst het eigen-prijseffect benoemen, dan de verschuiving en daarna beoordelen of een netto-richting te geven is. Wacht met het antwoord tot de volgende dia.','Welke informatie heb je nodig om te kiezen tussen meer en minder?','Het toevallige netto-resultaat van Stadfiets is geen algemene regel voor twee veranderingen.','Bespreek de richting van beide effecten.',true);
}
{
 const s=slide('Tegenwerken zonder bekende grootte');example(s);
 table(s,[['Verandering','Effect op gevraagde hoeveelheid'],['Alleen de eigen fietsprijs hoger','Minder, langs dezelfde lijn'],['Alleen het substituut duurder','Meer bij dezelfde fietsprijs, lijn naar rechts']],60,270,1480,300,[720,760],35);
 text(s,'De uiteindelijke hoeveelheid is niet te bepalen.',60,635,1480,90,47,{bold:true,color:C.orange});text(s,'Bij versterkende effecten staat de richting wél vast.',60,761,1480,59,36,{bold:true});
 notes(s,'61, 64–65','Tegenwerkende effecten zonder groottes geven geen bepaalde netto-richting. Als de fietsprijs in deze losse situatie daalde en de scooterhuur steeg, zouden beide effecten de hoeveelheid vergroten: dan staat meer wel vast, ook zonder precieze grootte. Dat is een korte conceptuele variant, geen uitwerking van de danslessenopgave.','Wat verandert aan de conclusie als de eigen fietsprijs daalt?','Zeg niet dat twee veranderingen altijd onbeslisbaar zijn. Groottes en richtingen bepalen wat je kunt concluderen.','Keer naar de route terug en laat start 13 opnieuw beantwoorden vóór basis 14.',true);
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 19 · Filmhuis Lumi',TITLE+' · Opgave 19 · Boekpagina 66');
 text(s,'Q = 100 − 5P, voor 0 ≤ P ≤ 20',60,197,1480,75,48,{bold:true,color:C.blue});text(s,'Q is bezoeken per week. P is euro per bezoek.',60,289,1480,57,36);
 text(s,'Lumi verhoogt de prijs van € 8 naar € 10. Tegelijk worden kaartjes van een nabijgelegen bioscoop duurder. Volgens de bron zijn die bezoeken substituten.',60,390,1480,169,39);
 text(s,'Hierdoor worden bij Lumi bij elke onderzochte prijs 20 bezoeken extra gevraagd.',60,594,1480,109,39,{bold:true});
 text(s,'Neem aan dat de nieuwe vraaglijn recht blijft tot de gevraagde hoeveelheid nul is. Verder blijven de omstandigheden gelijk.',60,744,1480,90,33);
 notes(s,'66','Toon deze context pas nadat de doelopgave zelfstandig is geprobeerd. Alle gegevens en aannames komen uit de werkelijke boekopgave. De volgende twee dia’s tonen de beginfiguur en alle vijf deelvragen zonder antwoorden.','Welke twee prijzen veranderen volgens de bron?','De extra 20 bezoeken is broninformatie per gegeven prijs, niet het reeds bepaalde netto-effect.','Toon de beginfiguur en deelvragen a en b.');
}
{
 const s=slide('Opgave 19 · Beginfiguur, a en b',TITLE+' · Opgave 19 · Boekpagina 66');graph(s,T,{stage:0,y:206,w:920,h:565});
 text(s,'a',1055,210,80,50,39,{bold:true,color:C.blue});text(s,'Bereken Q vóór de veranderingen en na alleen de eigen prijsstijging. Benoem de grafische verandering.',1055,274,485,225,35);
 text(s,'b',1055,533,80,50,39,{bold:true,color:C.blue});text(s,'Welke specifieke factor veroorzaakt de andere verandering? Benoem de richting van de verschuiving.',1055,593,485,227,35);
 notes(s,'66','De beginfiguur is als bewerkbare XY-grafiek gereconstrueerd met dezelfde schalen 0–120 en 0–24, de oorspronkelijke V₀ en correcte eenheden. Er staan nog geen antwoorden, nieuwe lijn of punten op. Houd de context bij de hand.','Welke gegevens uit de context heb je voor a nodig?','V₀ is de vraaglijn; er is geen aanbodlijn of evenwicht in deze opgave.','Toon eerst ook c, d en e vóór de uitwerking.');
}
{
 const s=slide('Opgave 19 · Deelvragen c, d en e',TITLE+' · Opgave 19 · Boekpagina 66');
 text(s,'c) Teken de nieuwe vraaglijn in de figuur. Markeer A (oud), B (alleen de eigen prijsstijging) en C (beide veranderingen). Noteer hun coördinaten.',60,197,1480,167,38);rule(s,60,388,1480);
 text(s,'d) Bereken de uiteindelijke hoeveelheid en de verandering ten opzichte van het begin. Werken de twee effecten elkaar tegen of versterken ze elkaar?',60,430,1480,160,38);rule(s,60,614,1480);
 text(s,'e) Beoordeel: “De hogere prijs van Lumi verschuift zijn vraaglijn naar rechts.” Gebruik je uitkomsten.',60,659,1484,146,39);
 notes(s,'66','Alle deelvragen a–e zijn nu aangeboden zonder oplossingen. Laat leerlingen hun eigen werk bij de hand houden. c vraagt zowel de nieuwe lijn als drie gemarkeerde punten en coördinaten. d vraagt eindhoeveelheid, netto-verandering en de richting van beide effecten. e vraagt een beargumenteerd oordeel.','Waar vraagt de opgave om uitleg naast het berekenen?','Een punt op de juiste lijn zonder coördinaten is geen volledig antwoord op c.','Begin de bespreking met alleen de eigen prijs.');
}
{
 const s=slide('Opgave 19a · Eerst de eigen prijs',TITLE+' · Opgave 19 · Boekpagina 66');
 text(s,'Oud: P = € 8',60,214,600,70,39,{bold:true,color:C.blue});text(s,'Q = 100 − 5 × 8 = 60 bezoeken per week',60,306,1480,82,47,{bold:true});
 rule(s,60,427,1480);text(s,'Alleen de eigen prijs: P = € 10',60,473,1480,70,39,{bold:true,color:C.orange});text(s,'Q = 100 − 5 × 10 = 50 bezoeken per week',60,566,1480,82,47,{bold:true});
 text(s,'Beweging langs V₀. Er worden 10 bezoeken minder gevraagd.',60,747,1480,86,39,{bold:true});
 notes(s,'66','Vul eerst 8 en daarna 10 in dezelfde oude formule in. 50−60=−10 bezoeken per week. Laat leerlingen de eenheid opschrijven. De andere bioscoopprijs houden we in deze analytische stap nog gelijk.','Waarom gebruiken we hier twee keer dezelfde formule?','Bij B is alleen de eigen prijs verwerkt; het is niet de uiteindelijke situatie.','Zet A en B op V₀.');
}
{
 const s=slide('Opgave 19a en c · A en B op V₀',TITLE+' · Opgave 19 · Boekpagina 66');graph(s,T,{stage:1,y:208});
 text(s,'A = (60; 8)',1130,271,410,73,41,{bold:true,color:C.blue});text(s,'B = (50; 10)',1130,378,410,73,41,{bold:true,color:C.orange});text(s,'Eerst Q, dan P',1130,543,410,65,36,{bold:true});text(s,'B: alleen de eigen\nprijsstijging',1130,665,410,121,34);
 notes(s,'66','A ligt bij Q=60 en P=8. B ligt op dezelfde oude lijn bij Q=50 en P=10. De pijl beweegt over de lijn. De puntnamen en coördinaten horen samen. B is een tegenfeitelijke denkstap bij gelijktijdige veranderingen.','Waarom kan punt B nog niet het eindantwoord zijn?','Een stijging van P is geen opwaartse verschuiving van de vraaglijn.','Benoem nu de specifieke factor achter de nieuwe lijn.');
}
{
 const s=slide('Opgave 19b · De andere bioscoop',TITLE+' · Opgave 19 · Boekpagina 66');
 text(s,'De prijs van een substituut stijgt',60,223,1480,90,53,{bold:true,color:C.green});
 text(s,'Bij dezelfde prijs van Lumi:\n20 bezoeken per week extra gevraagd',60,405,1480,140,47,{bold:true});
 text(s,'De vraaglijn van Lumi verschuift naar rechts.',60,684,1480,98,46);
 notes(s,'66','De nabijgelegen bioscoop kan een bezoek aan Lumi vervangen volgens de bron. Die bioscoop wordt duurder. Kopers kiezen daardoor bij elke onderzochte Lumiprijs 20 extra Lumi-bezoeken. De specifieke factor is de prijs van een substituut, niet Lumi’s eigen prijs en niet zomaar voorkeur.','Welke prijs houden we gelijk wanneer we rechtsverschuiving zeggen?','Lumi wordt relatief aantrekkelijker is een tussenstap; de volledige oorzaak blijft de prijs van het substituut.','Stel de nieuwe functie op en bereken de snijpunten.');
}
{
 const s=slide('Opgave 19c · De nieuwe vraaglijn',TITLE+' · Opgave 19 · Boekpagina 66');
 text(s,'Q = (100 − 5P) + 20 = 120 − 5P',60,228,1480,82,51,{bold:true,color:C.green});
 table(s,[['Snijpunt','Berekening','Coördinaat'],['P = 0','Q = 120 − 5 × 0 = 120','(120; 0)'],['Q = 0','0 = 120 − 5P; 5P = 120; P = 24','(0; 24)']],60,391,1480,277,[365,750,365],33);
 text(s,'V₁ loopt recht tussen beide punten. 0 ≤ P ≤ 24.',60,742,1480,70,41,{bold:true});
 notes(s,'66','Tel 20 bij de hoeveelheid op voor elke prijs. De hellingscoëfficiënt blijft −5. Het snijpunt bij nul prijs is 120 bezoeken. Los nul hoeveelheid op voor het andere snijpunt: P=24. Het boek staat voortzetten van de rechte lijn tot nul expliciet toe. Beide snijpunten passen in de gegeven figuur.','Wat verandert er in de formule en wat blijft gelijk?','+20 bezoeken betekent geen prijsstijging van 20 euro.','Voeg V₁ en het uiteindelijke punt C toe.');
}
{
 const s=slide('Opgave 19c · De drie punten',TITLE+' · Opgave 19 · Boekpagina 66');graph(s,T,{stage:2,y:208});
 text(s,'A = (60; 8)',1130,255,410,66,39,{bold:true,color:C.blue});text(s,'B = (50; 10)',1130,350,410,66,39,{bold:true,color:C.orange});text(s,'C = (70; 10)',1130,445,410,66,39,{bold:true,color:C.green});text(s,'C: 120 − 5 × 10\n= 70 bezoeken\nper week',1130,612,410,164,34);
 notes(s,'66','De figuur heeft identieke schalen aan de beginfiguur. V₁ heeft snijpunten (0;24) en (120;0). A en B blijven op V₀. C=(70;10) ligt op V₁. B naar C is horizontaal: dezelfde Lumiprijs, 20 extra bezoeken. A naar C combineert de veranderingen. Controle: 70=120−5×10.','Waarom liggen B en C op dezelfde hoogte?','C ligt niet bij de oude prijs van 8; beide veranderingen gelden in de eindsituatie.','Vergelijk het einde met het echte begin.');
}
{
 const s=slide('Opgave 19d · Het netto-effect',TITLE+' · Opgave 19 · Boekpagina 66');
 text(s,'Uiteindelijk: Q = 120 − 5 × 10 = 70',60,222,1480,83,49,{bold:true,color:C.green});
 table(s,[['Effect','Bezoeken per week'],['Eigen prijsstijging: 50 − 60','−10'],['Duurdere bioscoop: 70 − 50','+20'],['Netto: 70 − 60','+10']],60,368,1480,336,[1000,480],35);
 text(s,'De effecten werken elkaar tegen. Netto 10 bezoeken meer.',60,756,1480,79,39,{bold:true});
 notes(s,'66','De eindhoeveelheid is 70 bezoeken per week. Vergelijk met 60 in A, niet met 50 in B. De eigen prijsstijging geeft −10; het substituuteffect +20. Samen −10+20=+10. De bron geeft de groottes, dus hier kan een netto-uitkomst wel worden berekend.','Wat zou de fout zijn als je +20 als totale verandering opschrijft?','Een positief netto-effect betekent niet dat beide oorzaken de vraag vergroten.','Gebruik deze aparte effecten om de uitspraak te beoordelen.');
}
{
 const s=slide('Opgave 19e · De uitspraak beoordelen',TITLE+' · Opgave 19 · Boekpagina 66');
 text(s,'“De hogere prijs van Lumi verschuift zijn vraaglijn naar rechts.”',60,205,1480,149,47,{bold:true,color:C.blue});
 text(s,'Onjuist',60,407,1480,85,55,{bold:true,color:C.orange});
 text(s,'Eigen prijsstijging: 60 naar 50 langs V₀.\nDuurdere bioscoop: 50 naar 70 bij dezelfde € 10.',60,543,1480,148,41,{bold:true});
 text(s,'De prijs van het substituut veroorzaakt de verschuiving.',60,753,1480,73,40,{bold:true,color:C.green});
 notes(s,'66','Een volledig oordeel weerlegt de oorzaak met de berekende effecten. Lumi’s hogere prijs vermindert de hoeveelheid langs V₀. De prijsstijging bij de andere bioscoop veroorzaakt V₁. De uiteindelijke stijging naar 70 bewijst dus geen omgekeerde eigen-prijsreactie.','Welk deel van de uitspraak is precies verkeerd?','Alleen “onjuist” is onvoldoende. Gebruik getallen, grafieksoort en specifieke oorzaak.','Laat leerlingen ontbrekende onderdelen van hun eigen antwoord aanvullen.');
}
{
 const s=slide('Antwoordcontrole bij opgave 19');
 [['a–b','Twee berekende hoeveelheden en de specifieke oorzaak.'],['c','V₁ plus A, B en C met coördinaten (Q; P).'],['d','70 bezoeken per week, netto +10 en tegenwerkende effecten.'],['e','De uitspraak weerlegd met beide afzonderlijke oorzaken.']].forEach((a,i)=>{let y=221+i*139;text(s,a[0],60,y,200,58,40,{bold:true,color:C.blue});text(s,a[1],310,y,1230,104,37);});
 text(s,'Vul één ontbrekende stap of uitleg in je eigen antwoord aan.',60,787,1480,53,33,{bold:true});
 notes(s,'66','Controleer tegen het antwoordmodel: 60 en 50, beweging langs V₀; substituutprijs stijgt, rechts; V₁=120−5P voor 0≤P≤24, A(60;8), B(50;10), C(70;10); Qnieuw 70 en netto +10; effecten tegenwerkend; eigen prijs veroorzaakt geen verschuiving. Laat leerlingen een fout of onvolledig onderdeel herstellen.','Welke stap ontbreekt nog in jouw uitwerking?','Een juiste eindhoeveelheid vervangt niet de grafiek, coördinaten of gevraagde redenering.','Sluit af met dezelfde huiswerkroute.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(BUILD+'/manifest.json',JSON.stringify({slides,overviewSlides,tables,charts,source:provenance,graphContracts},null,2));
await fs.writeFile(BUILD+'/presentation.json',JSON.stringify(p.toProto()));
const draft=BUILD+'/candidate.pptx';await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:FINAL+'/1.2.2 Vraagfactoren – presentatie.pptx',pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({slides:p.slides.items.length,overviewSlides,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
