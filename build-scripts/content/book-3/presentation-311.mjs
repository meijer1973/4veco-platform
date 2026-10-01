// HOW TO ADAPT: derive assignments and page numbers from the current complete book.
// Keep authored teaching data separate from assigned exercises; share the overview.
// Runtime paths are discovered through the installed presentation skill.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,
  PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('311');
const M=JSON.parse(await fs.readFile(new URL('./presentation-311.manifest.json',import.meta.url),'utf8'));
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#1A5276',green:'#1E7449',orange:'#A94D16',line:'#C6D2DB',pale:'#EFF4F7',muted:'#445B6B'};
const FONT='Arial',title='Eén product, twee prijzen',tables=[],charts=[],slides=[],graphs=[];
const source='https://github.com/meijer1973/4veco-lessen/blob/'+M.lessonCommit+'/';
const bookRoot='edities/books34-v3/books/book-3/';
const exampleLabel='Uitlegvoorbeeld — niet uit het boek';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(t,role='instruction',footer='§3.1.1 '+title){
 const s=p.slides.add();s.background.fill='#FFFFFF';text(s,t,60,42,1480,78,50,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1390,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title:t,role});return s;
}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 3, editie books34-v3, compleet leerlingenboek, gedrukte pagina ${page}. ${source+bookRoot}output/Boek_3_Compleet_v3.pdf\nMethode en opgaven: ${source+bookRoot}chapters/3.1/3.1.1%20manuscript.md\nAntwoordmodel: ${source+bookRoot}chapters/3.1/Antwoorden.md#ans7\n${authored?'Uitlegvoorbeeld — niet uit het boek. Fietslampjes, functies en belasting zijn afzonderlijk voor deze les gemaakt. De boekverwijzing onderbouwt de methode, niet deze gegevens.':''}`);
}
function table(s,values,x,y,w,h,widths,size=34){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?'#FFFFFF':C.pale);
  cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:14,top:10,bottom:10}};
 }}tables.push(p.slides.items.length);return t;
}
const overviewData={
 route:['Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.','Maak de startopdracht.','Uitleg bij de lesdoelen.','Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.','Klaar? Werk aan een ander vak. Geen devices.','Bespreken van de doelopgave: opgave 7.','Zet je huiswerk in je agenda.'],
 goals:'Evenwicht en twee prijzen berekenen.\nDe belastingwig tekenen.\nAfdragen en last dragen uitleggen.',
 start:'Pagina 9 · Opgaven 1 en 2\n2: verkennen, theorie p. 6–9',
 homework:'§3.1.1\nBasis: 3 en 4\nZelfstandig: 5 en 6\nDoelopgave: 7\nMaken en nakijken'
};
function overview(phase,active){
 const s=slide('Deze les: §3.1.1 '+title,'overview');text(s,'Nu: '+phase,60,112,1460,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 overviewData.route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,`${i+1}.`,60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+i});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+i});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});text(s,overviewData.goals,972,244,565,122,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});text(s,overviewData.start,972,459,565,95,30,{bold:active===2,name:'overview-start'});rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});text(s,overviewData.homework,972,654,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'6–12',`Laat de dia staan tijdens ${phase.toLowerCase()}. Opgave 1 haalt gelijkstellen en invullen op, eerder uitgelegd in Boek 2 §2.3.2, p.81–83. Geef bij haperende algebra korte steun: groepeer de Q-termen, deel door de coëfficiënt, vul terug in. Start 2 is een eerste verkenning van de nieuwe wig en economische last. Laat leerlingen de prijsnamen en wig op p.6 en het vergelijken met de oude prijs op p.9 gebruiken. Zij noteren hun redenering en twijfel; dit is geen onaangekondigde beheersingstoets. Bij terugkeer naar dit overzicht vóór het basiswerk laat je 2 opnieuw proberen en bespreek je waarom de oude prijs nodig is. Basis 3–4 staat op p.10, zelfstandig 5–6 op p.11, doel 7 op p.12. Huiswerk: 3,4,5,6,7 maken en nakijken. Bonus 8 en herhaling 9 zijn extra. De docentenroute adviseert voorlopig twee lessen van 55 minuten, zonder gemeten tijdsfit. Rond zo nodig in een volgende les af. Hoofdstukpagina’s 5 en 8 corresponderen met gedrukte complete-boekpagina’s 9 en 12.`, 'Welke uitleg helpt je bij de nieuwe begrippen in opgave 2?', 'Afdragen vertelt wie overmaakt; de last volgt pas uit vergelijking met de oude prijs.',active===7?'Laat het huiswerk in de agenda noteren.':'Ga verder als de klas aan de volgende fase toe is.');
}
const E={id:'example',a:30,b:.2,c:6,d:.1,t:6,q0:80,p0:14,qt:60,pc:18,pp:12,xmax:160,ymax:32,xstep:40,ystep:4,unit:'fietslampjes per week',single:'fietslampje',shiftPrice:20};
const T={id:'target',a:20,b:.2,c:2,d:.1,t:3,q0:60,p0:8,qt:50,pc:10,pp:7,xmax:100,ymax:22,xstep:20,ystep:5,unit:'tassen per dag',single:'tas',shiftPrice:11};
// All lines, guides, points, labels and the shift arrow remain native XY series.
function graph(s,m,stage){
 const series=[];
 const add=(name,x,y,color,style='solid',width=3)=>series.push({name,xValues:x,values:y,line:{fill:color,width,style},marker:{symbol:'none'}});
 const demandMax=Math.min(m.xmax,m.a/m.b),supplyMax=Math.min(m.xmax,(m.ymax-m.c)/m.d);
 add('V',[0,demandMax],[m.a,m.a-m.b*demandMax],C.blue);
 add('A',[0,supplyMax],[m.c,m.c+m.d*supplyMax],C.green);
 function label(name,x,y,color=C.ink,point=false){series.push({name,xValues:[x],values:[y],line:{fill:'none',width:0},marker:{symbol:point?'circle':'none',size:8,fill:color,line:{fill:color,width:1}},dataLabelOverrides:[{idx:0,text:name,position:'t',showValue:false,textStyle:{typeface:FONT,fontSize:28,fill:color,bold:true}}]});}
 label('V',demandMax*.88,m.a-m.b*demandMax*.88,C.blue);label('A',m.xmax*.89,m.c+m.d*m.xmax*.89,C.green);
 if(['shift','wedge'].includes(stage)){
  const max=Math.min(m.xmax,(m.ymax-m.c-m.t)/m.d);add('A + t',[0,max],[m.c+m.t,m.c+m.t+m.d*max],C.orange);
  label('A + t',m.xmax*.88,m.c+m.t+m.d*m.xmax*.88,C.orange);
 }
 if(stage==='free'){
  add('P₀ hulplijn',[0,m.q0],[m.p0,m.p0],C.muted,'dashed',2);add('Q₀ hulplijn',[m.q0,m.q0],[0,m.p0],C.muted,'dashed',2);
  series.push({name:'vrij evenwicht',xValues:[m.q0],values:[m.p0],line:{fill:'none',width:0},marker:{symbol:'circle',size:8,fill:C.ink,line:{fill:C.ink,width:1}}});
  label('E₀',m.q0+m.xmax*.035,m.p0+m.ymax*.045,C.ink);label('P₀ = '+m.p0,m.xmax*.17,m.p0+.4,C.ink);
 }
 if(stage==='shift'){
  const from=(m.shiftPrice-m.c)/m.d,to=(m.shiftPrice-m.c-m.t)/m.d,dx=m.xmax*.025,dy=m.ymax*.022;
  add('verschuiving bij gelijke kopersprijs',[from,to,to+dx,to,to+dx],[m.shiftPrice,m.shiftPrice,m.shiftPrice+dy,m.shiftPrice,m.shiftPrice-dy],C.orange,'solid',3);
 }
 if(stage==='wedge'){
  add('Pc hulplijn',[0,m.qt],[m.pc,m.pc],C.blue,'dashed',2);add('Pp hulplijn',[0,m.qt],[m.pp,m.pp],C.green,'dashed',2);
  add('Qt hulplijn',[m.qt,m.qt],[0,m.pp],C.muted,'dashed',2);add('belastingwig',[m.qt,m.qt,m.qt],[m.pp,(m.pp+m.pc)/2,m.pc],C.orange,'solid',5);
  label('Pc = '+m.pc,m.xmax*.18,m.pc+.25,C.blue);
  // Place each receipt label in the clear gap between its guide and the curves.
  label('Pp = '+m.pp,m.xmax*(m.id==='example'?.11:.25),m.pp+.25,C.green);
  label('Qt = '+m.qt,m.qt+m.xmax*.09,0.2,C.ink);
  // A single invisible label series is distinct from each actual point marker.
  for(const [name,y] of [['nieuw',m.pc],['ontvangst',m.pp]])series.push({name,xValues:[m.qt],values:[y],line:{fill:'none',width:0},marker:{symbol:'circle',size:8,fill:C.ink,line:{fill:C.ink,width:1}}});
 }
 for(const a of series){a.xValues=a.xValues.map(v=>+v.toFixed(6));a.values=a.values.map(v=>+v.toFixed(6));}
 const ch=s.charts.add('scatter',{position:{left:60,top:235,width:990,height:580},series,scatterOptions:{style:'line'},hasLegend:false,
 xAxis:{min:0,max:m.xmax,majorUnit:m.xstep,numberFormatCode:'0',title:{text:'Q ('+m.unit+')',textStyle:{typeface:FONT,fontSize:28,fill:C.ink}},textStyle:{typeface:FONT,fontSize:26,fill:C.ink},line:{fill:C.ink,width:1.5}},
 yAxis:{min:0,max:m.ymax,majorUnit:m.ystep,numberFormatCode:'0',title:{text:'P (€ per '+m.single+')',textStyle:{typeface:FONT,fontSize:28,fill:C.ink}},textStyle:{typeface:FONT,fontSize:26,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphs.push({slide:p.slides.items.length,model:m,stage,series});return ch;
}
function ex(t){const s=slide(t,'teaching-example');text(s,exampleLabel,60,177,1480,43,28,{color:C.muted});return s;}
function target(t,role='target-answer'){return slide(t,role,'§3.1.1 '+title+' · Opgave 7 · Boekpagina 12');}

overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 table(s,[['Je leert','Je gebruikt al'],['Het vrije en nieuwe evenwicht berekenen','Gelijkstellen en invullen'],['Pc, Pp en de belastingwig tekenen','Een punt (Q; P) in een grafiek'],['Afdragen en economische last onderscheiden','Een nieuw bedrag met het oude vergelijken']],60,225,1480,360,[890,590],34);
 text(s,'Waarom? Een belasting verandert wat kopers betalen én verkopers ontvangen.',60,668,1480,120,41,{bold:true,color:C.blue});
 notes(s,'6–9','De nieuwe handeling is het aanbod omzetten naar de kopersprijs. Eerder berekenden leerlingen één marktprijs, onder andere in Boek 2 §2.3.2 p.82–83. Hier staan na belasting twee prijzen bij dezelfde verhandelde hoeveelheid. We gebruiken hetzelfde marktmodel: veel prijsnemende kopers en verkopers, één product, overige omstandigheden gelijk. Alle gevraagde en aangeboden eenheden bij het nieuwe evenwicht worden verhandeld. Gevolgen voor buitenstaanders blijven buiten beeld.','Wat moet er in een marktevenwicht aan elkaar gelijk zijn?','Vraag en aanbod blijven even groot; de twee prijzen zijn na belasting niet gelijk.','Geef beide prijzen een eigen naam.');
}
{
 const s=slide('Twee prijzen bij één verkoop');
 table(s,[['Symbool','Betekenis'],['Pc','Wat de koper per product betaalt'],['Pp','Wat de verkoper na afdracht ontvangt'],['t','De belasting per verkocht product']],60,210,1480,335,[320,1160],36);
 text(s,'Pc − Pp = t',60,615,1480,80,58,{bold:true,color:C.orange});text(s,'Pp is de ontvangst vóór aftrek van productiekosten.',60,740,1480,74,38,{bold:true});
 notes(s,'6','Voor elk verkocht product splitst de betaling van de koper in ontvangst voor de verkoper en belasting. Hier draagt de verkoper de belasting af aan de overheid. De belasting is per product, niet een vast totaalbedrag. De symbolen volgen het boek. Pc is consumentprijs, Pp producentontvangst. Productiekosten zijn nog niet afgetrokken van Pp.','Welk bedrag moet de verkoper nog uit Pp betalen?','Pp is geen winst. Wie het geld overmaakt hoeft niet de hele economische last te dragen.','Gebruik nu een afzonderlijke oefenmarkt om de procedure te demonstreren.');
}
{
 const s=ex('De markt voor fietslampjes');
 table(s,[['Gegeven','Functie of bedrag'],['Vraag','Pc = 30 − 0,20Q'],['Aanbod','Pp = 6 + 0,10Q'],['Belasting, afgedragen door verkopers','t = € 6 per fietslampje']],60,260,1480,330,[860,620],35);
 text(s,'Q in fietslampjes per week. Prijzen in euro per fietslampje.',60,640,1480,62,36,{bold:true});text(s,'Veel prijsnemers. Het product en de overige omstandigheden blijven gelijk.',60,735,1480,90,34);
 notes(s,'6–9','Dit is een gemaakt uitlegvoorbeeld, geen boekopgave. Introduceer vraag en aanbod vóór invoering van de belasting. Kopers reageren op hun eigen betaling, verkopers op hun ontvangst. In dit model worden bij het nieuwe evenwicht alle aangeboden eenheden verkocht. De prijsfuncties blijven inhoudelijk hetzelfde. Alleen de vertaling tussen ontvangst en betaling verandert door de heffing.','Welke functie gebruik je voor de ontvangst van de verkoper?','Verwar de belasting per fietslampje niet met de totale belastingopbrengst.','Bereken eerst het vrije evenwicht.',true);
}
{
 const s=ex('Het vrije evenwicht berekenen');
 text(s,'Zonder belasting: Pc = Pp = P₀',60,260,1480,64,40,{bold:true,color:C.blue});
 text(s,'30 − 0,20Q = 6 + 0,10Q\n24 = 0,30Q\nQ₀ = 80 fietslampjes per week',60,365,1480,225,46);
 text(s,'P₀ = 30 − 0,20 × 80 = € 14 per fietslampje',60,646,1480,74,42,{bold:true});text(s,'Controle met aanbod: 6 + 0,10 × 80 = 14',60,760,1480,57,35);
 notes(s,'9','Herhaal kort de bekende algebra: tel 0,20Q bij beide kanten op en trek 6 af. Zo ontstaat 24 = 0,30Q. Deel beide kanten door 0,30. Vul de gevonden hoeveelheid in een prijsfunctie in. Met de andere functie controleer je dezelfde uitkomst. Zo krijgen leerlingen met kwetsbare voorkennis concrete steun vóór de nieuwe omzetting.','Waarom mag je zonder belasting de twee prijsfuncties gelijkstellen?','Q is een hoeveelheid per week, P een bedrag per fietslampje. De coëfficiënten tel je samen bij het verplaatsen van de Q-term.','Markeer dezelfde uitkomst in de grafiek.',true);
}
{
 const s=ex('Het vrije evenwicht in de grafiek');graph(s,E,'free');text(s,'E₀ = (80; 14)',1100,300,440,60,39,{bold:true});text(s,'80 fietslampjes\nper week\n\nEén prijs:\n€ 14 per fietslampje',1100,412,440,280,36);text(s,'V en A snijden elkaar.',1100,741,440,75,34,{bold:true,color:C.blue});
 notes(s,'7–9','Lees vanuit het snijpunt horizontaal de prijs en verticaal de hoeveelheid af. De coördinaatvolgorde is hoeveelheid, prijs. De vraaglijn eindigt bij Q = 150 omdat de prijs daar nul is; we tekenen geen negatieve prijzen. De horizontale as is numeriek. De grafieken van dit voorbeeld houden dezelfde assen, ook na de belasting.','Welk getal hoort op de horizontale as?','Een punt op de aanbodlijn hoeft geen marktevenwicht te zijn; daarvoor moet ook de vraaglijn erdoor gaan.','Vergelijk straks de gewenste ontvangst en benodigde betaling bij dezelfde hoeveelheid.',true);
}
{
 const s=ex('De belasting komt boven op de gewenste ontvangst');
 table(s,[['Q per week','Pp op A','t','Benodigde Pc'],['0','€ 6','€ 6','€ 12'],['60','€ 12','€ 6','€ 18'],['120','€ 18','€ 6','€ 24']],60,271,1480,325,[400,390,270,420],36);
 text(s,'Bij iedere hoeveelheid: Pc = Pp + 6',60,653,1480,79,48,{bold:true,color:C.orange});text(s,'De oorspronkelijke A blijft de gewenste ontvangst aangeven.',60,761,1480,60,34);
 notes(s,'8','Bij Q = 60 hoort volgens de oorspronkelijke A een gewenste ontvangst van 12 euro. Om na afdracht van 6 euro nog 12 euro over te houden, moet de koper 18 euro betalen. Doe dezelfde omzetting bij nul en 120. Deze rij bepaalt nog geen evenwicht: daarvoor moet je de vraag erbij betrekken. Productiekosten veranderen hier niet; A + t beschrijft dezelfde aanbodbeslissing in kopersprijzen.','Kan de verkoper 6 euro afdragen uit een betaling van 12 euro en toch 12 euro ontvangen?','Tel de belasting bij de gewenste ontvangst op, niet zonder meer bij de oude marktprijs.','Voer deze omzetting uit voor de hele aanbodfunctie.',true);
}
{
 const s=ex('Het aanbod in kopersprijzen');
 const rows=[['Oorspronkelijke A','Pp = 6 + 0,10Q'],['Belasting erbij','Pc = Pp + 6'],['Invullen en samenvoegen','Pc = (6 + 0,10Q) + 6'],['Nieuwe lijn A + t','Pc = 12 + 0,10Q']];
 rows.forEach((a,i)=>{const y=270+i*134;text(s,a[0],60,y,650,90,35,{bold:true,color:i===3?C.orange:C.ink});text(s,a[1],730,y,810,90,43,{bold:i===3,color:i===3?C.orange:C.ink});if(i<3)rule(s,60,y+101,1480);});
 notes(s,'8–9','Benoem bij elke regel welk bedrag wordt beschreven. De constante term neemt van 6 naar 12 toe. De helling 0,10 blijft gelijk omdat de heffing per eenheid vast is. Je telt de belasting dus niet bij de coëfficiënt van Q op. De nieuwe lijn is uitgedrukt in Pc; de oorspronkelijke A blijft beschikbaar om Pp te vinden.','Welk deel van de functie verandert door 6 euro per product?','A + t is geen nieuwe winstfunctie en ook geen gewijzigde betalingsbereidheid.','Bekijk zowel de verticale afstand als de horizontale verschuiving.',true);
}
{
 const s=ex('De aanbodlijn verschuift');graph(s,E,'shift');text(s,'A + t ligt € 6 hoger\nbij dezelfde Q.',1100,258,440,123,36,{bold:true,color:C.orange});text(s,'Rechte lijn door\n(0; 12) en (160; 28)',1100,407,440,104,34);text(s,'Bij Pc = € 20:\nzonder belasting 140\nmet belasting 80',1100,553,440,151,34);text(s,'De pijl vergelijkt\ndezelfde kopersprijs.',1100,750,440,80,30,{bold:true});
 notes(s,'7–8','De verticale afstand tussen de parallelle lijnen is steeds 6 euro. De horizontale pijl staat bij een vaste kopersprijs van 20 euro: zonder belasting is Qa = (20 − 6)/0,10 = 140, met belasting Qa = (20 − 12)/0,10 = 80. Daarom verschuift het aanbod in kopersprijzen naar links. Die 80 is een aangeboden hoeveelheid bij deze gekozen prijs, niet het nieuwe marktevenwicht. De pijl eindigt op A + t en begint op A. De vraaglijn verandert niet.','Wat houd je gelijk bij de horizontale pijl?','De lengte van de horizontale pijl is in fietslampjes, de verticale wig in euro per fietslampje.','Bereken het snijpunt van V met A + t.',true);
}
{
 const s=ex('De nieuwe hoeveelheid');text(s,'Vraag = aanbod in kopersprijzen',60,267,1480,63,40,{bold:true,color:C.blue});text(s,'30 − 0,20Q = 12 + 0,10Q\n18 = 0,30Q\nQt = 60 fietslampjes per week',60,389,1480,244,47);text(s,'Eerst 80, nu 60 fietslampjes per week.',60,718,1480,80,43,{bold:true,color:C.orange});
 notes(s,'9','Beide kanten van de vergelijking beschrijven nu Pc. Vraag en aanbod worden gelijk bij Q = 60. De letter t onder Q duidt de situatie met belasting aan, geen vermenigvuldiging. Gebruik daarna deze ene hoeveelheid voor beide prijsfuncties. De daling ten opzichte van de vrije hoeveelheid is 20 fietslampjes per week.','Waarom gebruik je hier 12 + 0,10Q en niet 6 + 0,10Q?','Vraag in Pc direct gelijkstellen aan aanbod in Pp zou de belasting vergeten.','Bereken wat kopers betalen en verkopers ontvangen.',true);
}
{
 const s=ex('Twee prijzen bij dezelfde nieuwe hoeveelheid');
 text(s,'Qt = 60 fietslampjes per week',60,267,1480,65,41,{bold:true});
 text(s,'Vraag geeft Pc',60,377,600,60,35,{bold:true,color:C.blue});text(s,'Pc = 30 − 0,20 × 60 = € 18',60,448,1480,66,47,{bold:true,color:C.blue});
 text(s,'Oorspronkelijke A geeft Pp',60,565,1480,60,35,{bold:true,color:C.green});text(s,'Pp = 6 + 0,10 × 60 = € 12',60,636,1480,66,47,{bold:true,color:C.green});text(s,'Controle: 18 − 12 = € 6 per fietslampje',60,760,1480,62,38,{bold:true,color:C.orange});
 notes(s,'9','Vul Q = 60 in V in voor de betaalde prijs. Vul dezelfde Q in de oorspronkelijke A in voor de ontvangst na afdracht. Je kunt Pp ook controleren met Pc − t. De uitkomst uit A + t is opnieuw 18 en dus de kopersprijs. Alle bedragen zijn per fietslampje; het gaat niet om totale belastingopbrengst.','Op welke lijn lees je het bedrag na afdracht af?','De twee prijzen horen niet bij twee verschillende verkochte hoeveelheden.','Markeer precies deze twee punten en hun verschil.',true);
}
{
 const s=ex('De belastingwig tekenen');graph(s,E,'wedge');text(s,'Bij Qt = 60',1100,278,440,65,40,{bold:true});text(s,'Pc op V en A + t\nPp op de oude A',1100,400,440,130,35);text(s,'Belastingwig:\n18 − 12 = € 6',1100,570,440,113,40,{bold:true,color:C.orange});text(s,'Eén verticale lijn\nverbindt beide prijzen.',1100,732,440,90,34);
 notes(s,'7–9','Het snijpunt van V en A + t ligt op (60;18). Ga bij Q = 60 recht omlaag naar de oorspronkelijke A: dat geeft (60;12). De oranje verticale lijn is de belastingwig. De horizontale stippellijnen verbinden de prijzen met de prijsas. De verticale stippellijn geeft de hoeveelheid. Dit is een andere vergelijking dan de horizontale verschuivingspijl bij een vaste kopersprijs.','Waarom moet de wig precies verticaal staan?','Een schuine verbinding vergelijkt prijzen bij verschillende hoeveelheden.','Vergelijk de nieuwe prijzen met de oude prijs van 14 euro.',true);
}
{
 const s=ex('Afdragen en de economische last');
 table(s,[['Per fietslampje','Zonder belasting','Met belasting','Last'],['Koper betaalt','€ 14','€ 18','18 − 14 = € 4'],['Verkoper ontvangt','€ 14','€ 12','14 − 12 = € 2']],60,278,1480,287,[445,330,315,390],33);
 text(s,'De verkoper draagt € 6 af.',60,638,1480,63,43,{bold:true});text(s,'Kopers dragen € 4 en verkopers € 2 van de last.',60,745,1480,75,40,{bold:true,color:C.orange});
 notes(s,'9','Afdragen is het betalen van 6 euro aan de overheid. De economische last per fietslampje meet je ten opzichte van de prijs zonder belasting. Kopers betalen 4 euro meer, verkopers ontvangen 2 euro minder. Samen is dat 6 euro, dezelfde wig. Dit is de prijsverandering per verhandeld product, niet een berekening van totale welvaartsverliezen. Hiervoor is de oude prijs nodig.','Welke informatie ontbreekt als je alleen Pc en Pp kent?','De partij die overmaakt draagt niet automatisch de hele last. Ook een stijgende kopersprijs impliceert geen hogere verkopersontvangst.','Controleer of je de oude prijs simpelweg mag verhogen met de heffing.',true);
}
{
 const s=ex('Korte controle');text(s,'“De oude prijs is € 14. De belasting is € 6.\nDus de koper gaat € 20 betalen.”',60,285,1480,176,48,{bold:true});text(s,'Welke verkopersontvangst hoort daarbij?\nHoeveel wordt dan gevraagd en aangeboden?',60,550,1480,160,41);text(s,'Gebruik de functies van de fietslampjesmarkt.',60,755,1480,60,34,{color:C.blue});
 notes(s,'8','Laat leerlingen eerst zelf redeneren met het uitlegvoorbeeld. Noteer Pc = 20, vraag naar de bijbehorende Pp en laat beide functies terugrekenen naar Q. Wie vastloopt krijgt de opstelling 20 = 30 − 0,20Qv en 14 = 6 + 0,10Qa. Dit is een directe begripscontrole en voegt geen huiswerk toe.','Zijn de gewenste hoeveelheden bij deze twee prijzen gelijk?','Een correcte wig is noodzakelijk maar op zichzelf onvoldoende voor marktevenwicht.','Onthul na de redeneringen de rekencontrole.',true);
}
{
 const s=ex('Een passende wig is nog geen evenwicht');text(s,'Bij Pc = € 20 hoort Pp = 20 − 6 = € 14.',60,268,1480,80,41,{bold:true});
 table(s,[['Vraag','Aanbod'],['20 = 30 − 0,20Qv','14 = 6 + 0,10Qa'],['Qv = 50 per week','Qa = 80 per week']],60,394,1480,267,[740,740],39);
 text(s,'50 ≠ 80. Deze prijzen geven geen marktevenwicht.',60,723,1480,92,41,{bold:true,color:C.orange});
 notes(s,'8','Vraag terugrekenen geeft (30 − 20)/0,20 = 50. Aanbod bij een ontvangst van 14 euro geeft (14 − 6)/0,10 = 80. Het aanbod is groter dan de vraag. Daarom kun je niet vooraf de hele belasting bij de oude prijs optellen. Bij de eerder gevonden Pc = 18 en Pp = 12 zijn beide gewenste hoeveelheden juist 60.','Aan welke twee voorwaarden moet de nieuwe situatie tegelijk voldoen?','Controleer zowel Qv = Qa als Pc − Pp = t.','Keer terug naar startopgave 2, daarna begint de basisroute.',true);
}
overview('Zelfstandig werken',4);
{
 const s=target('Opgave 7 · Bedrukte tassen','target-question');
 text(s,'Verschillende aanbieders verkopen dezelfde soort bedrukte tas.',60,207,1480,104,40,{bold:true});
 table(s,[['Vraag','Pc = 20 − 0,20Q'],['Aanbod','Pp = 2 + 0,10Q'],['Belasting','€ 3 per verkochte tas']],60,353,1480,260,[550,930],39);
 text(s,'Q is tassen per dag. Prijzen zijn euro per tas.',60,651,1480,64,36);text(s,'Verkopers dragen de belasting af.\nDe andere marktomstandigheden blijven gelijk.',60,744,1480,93,36,{bold:true});
 notes(s,'12','Dit zijn de werkelijke gegevens van opgave 7. Geef pas na de zelfstandige poging de bespreking. De volgende twee dia’s bevatten alle deelvragen en de basisgrafiek zonder nieuwe aanbodlijn of oplossingen. De belasting is per verkochte tas en wordt afgedragen door verkopers. De overige omstandigheden veranderen niet.','Welke partij draagt de belasting af volgens de opgave?','De vermelding wie afdraagt beantwoordt deelvraag e nog niet.','Toon eerst alle rekenvragen en daarna de teken- en redeneervragen.');
}
{
 const s=target('Opgave 7 · Deelvragen a, b en c','target-question');
 text(s,'a) Bereken de vrije evenwichtsprijs en -hoeveelheid.',60,223,1480,116,41);rule(s,60,364,1480);
 text(s,'b) Stel na invoering van de belasting het aanbod in kopersprijzen op. Bereken de nieuwe hoeveelheid.',60,405,1480,150,41);rule(s,60,591,1480);
 text(s,'c) Bereken de prijs die kopers betalen en het bedrag dat verkopers na afdracht ontvangen.',60,640,1480,150,41);
 notes(s,'12','Dit zijn de volledige deelvragen a, b en c. Laat leerlingen hun eigen werk erbij houden. Nog geen oplossingen: eerst moeten ook d en e zichtbaar zijn geweest. Let bij b op zowel de omzetting van de functie als de nieuwe hoeveelheid.','Welke twee handelingen vraagt b?','Alleen een nieuwe hoeveelheid opschrijven slaat de gevraagde functie over.','Toon de basisgrafiek en de laatste twee vragen.');
}
{
 const s=target('Opgave 7 · Deelvragen d en e','target-question');graph(s,T,'base');
 text(s,'d) Teken de nieuwe aanbodlijn in de basisgrafiek. Markeer de nieuwe hoeveelheid, beide prijzen en de belastingwig.',1080,216,460,279,33);
 text(s,'e) Een verkoper zegt: “Wij dragen alles af; dus wij dragen ook de hele economische last.” Beoordeel met de oude en nieuwe prijzen.',1080,535,460,286,33);
 notes(s,'12','De native basisgrafiek bevat exact de oorspronkelijke V en A: V loopt van (0;20) tot (100;0), A van (0;2) tot (100;12). De basisgrafiek in het boek loopt boven de hoogste genummerde prijs 20 nog iets door. Geen belastinglijn of antwoord is toegevoegd. Vraag d bevat vier markeringen naast de nieuwe aanbodlijn. Bij e is een oordeel met oude en nieuwe prijzen nodig.','Welke markeringen horen bij een volledig antwoord op d?','Een nieuwe lijn zonder beide prijzen en wig is nog geen volledige uitwerking.','Alle vragen zijn nu beschikbaar; begin de uitwerking bij a.');
}
{
 const s=target('Opgave 7a · Het vrije evenwicht');text(s,'Zonder belasting: Pc = Pp',60,232,1480,63,41,{bold:true,color:C.blue});text(s,'20 − 0,20Q = 2 + 0,10Q\n18 = 0,30Q\nQ₀ = 60 tassen per dag',60,360,1480,234,49);text(s,'P₀ = 20 − 0,20 × 60 = € 8 per tas',60,666,1480,73,46,{bold:true});text(s,'Controle: 2 + 0,10 × 60 = € 8 per tas',60,773,1480,56,34);
 notes(s,'12','Werk de gelijkstelling uit. De vrije hoeveelheid is 60 tassen per dag. Vul deze in vraag en aanbod in, beide geven 8 euro per tas. Bewaar de oude prijs voor de lastverdeling bij e. Dit antwoord stemt overeen met het hoofdstukantwoordmodel bij opgave 7a.','Waarom hebben we P₀ later opnieuw nodig?','De belasting hoort nog niet in de vrije evenwichtsberekening.','Vertaal de aanbodfunctie naar de kopersprijs met belasting.');
}
{
 const s=target('Opgave 7b · Aanbod in kopersprijzen');text(s,'De koper betaalt de ontvangst plus € 3 belasting.',60,230,1480,104,41,{bold:true});text(s,'Pc = Pp + 3\nPc = (2 + 0,10Q) + 3\nPc = 5 + 0,10Q',60,399,1480,258,53,{bold:true,color:C.orange});text(s,'De helling blijft 0,10. De prijsas-snijding wordt 5.',60,746,1480,80,38);
 notes(s,'12','Eerst de relatie Pc = Pp + 3, dan de oorspronkelijke aanbodfunctie invullen en constante termen optellen. Deze expliciete afleiding beantwoordt de eerste handeling in b. De kosten of voorkeuren zijn niet veranderd. A + t geeft het aanbod in de prijs die kopers moeten betalen.','Wat betekent de 5 in deze functie?','De functie voor Pp zelf blijft 2 + 0,10Q.','Gebruik vraag en aanbod in dezelfde prijs om Qt te berekenen.');
}
{
 const s=target('Opgave 7b · De nieuwe hoeveelheid');text(s,'V = A + t, beide in kopersprijzen',60,231,1480,78,41,{bold:true,color:C.blue});text(s,'20 − 0,20Q = 5 + 0,10Q\n15 = 0,30Q\nQt = 50 tassen per dag',60,386,1480,266,51);text(s,'Er worden 10 tassen per dag minder verhandeld.',60,744,1480,78,40,{bold:true});
 notes(s,'12','Los de vergelijking op: breng 5 naar links en de negatieve Q-term naar rechts. Deel 15 door 0,30. Het resultaat is 50 tassen per dag. Vergelijk met de vrije 60 en constateer de afname. De hogere betaalde prijs verlaagt de vraag, terwijl de lagere ontvangst het aanbod beperkt.','Welke prijsfuncties staan aan beide kanten?','Q is geen geldbedrag. Vermeld tassen per dag.','Vul 50 in de twee oorspronkelijke functies in.');
}
{
 const s=target('Opgave 7c · De twee prijzen');text(s,'Dezelfde Qt = 50 tassen per dag',60,229,1480,75,42,{bold:true});
 text(s,'Pc = 20 − 0,20 × 50 = € 10 per tas',60,386,1480,80,46,{bold:true,color:C.blue});text(s,'Pp = 2 + 0,10 × 50 = € 7 per tas',60,535,1480,80,46,{bold:true,color:C.green});text(s,'Controle: Pc − Pp = 10 − 7 = € 3 per tas',60,725,1480,88,42,{bold:true,color:C.orange});
 notes(s,'12','Vraag geeft Pc = 10. De oorspronkelijke A geeft Pp = 7. Controleer de ontvangst ook via 10 − 3 = 7. Het verschil van de twee bedragen komt overeen met de opgegeven belasting. Pp is na afdracht, maar voor alle productiekosten.','Waarom gebruiken we voor Pp de oorspronkelijke A?','Invullen in A + t levert Pc, niet Pp.','Teken eerst de nieuwe rechte aanbodlijn.');
}
{
 const s=target('Opgave 7d · De nieuwe aanbodlijn');graph(s,T,'shift');text(s,'A + t: Pc = 5 + 0,10Q',1090,246,450,110,36,{bold:true,color:C.orange});text(s,'Twee punten:\n(0; 5) en (100; 15)',1090,402,450,145,35);text(s,'Bij Pc = € 11:\nQa daalt van 90 naar 60.',1090,622,450,143,34);
 notes(s,'12','Teken een rechte lijn door twee berekende punten, (0;5) en (100;15). De lijn loopt parallel aan A. De horizontale pijl vergelijkt het aanbod bij dezelfde kopersprijs van 11 euro: (11 − 2)/0,10 = 90 en (11 − 5)/0,10 = 60. Deze hulphoeveelheden zijn niet het nieuwe evenwicht. Laat de pijl alleen het onderscheid tussen verschuiving en wig ondersteunen.','Hoe controleer je dat je nieuwe lijn parallel aan A loopt?','De verticale prijsas-snijding 5 is niet de nieuwe marktprijs.','Markeer het nieuwe snijpunt en ga bij dezelfde Q naar de oorspronkelijke A.');
}
{
 const s=target('Opgave 7d · Hoeveelheid, prijzen en wig');graph(s,T,'wedge');text(s,'(50; 10) op V en A + t',1090,266,450,115,36,{bold:true,color:C.blue});text(s,'(50; 7) op A',1090,448,450,67,36,{bold:true,color:C.green});text(s,'Belastingwig:\n10 − 7 = € 3 per tas',1090,616,450,150,36,{bold:true,color:C.orange});
 notes(s,'12','De volledige antwoordgrafiek bevat A + t, Qt = 50 en twee punten op dezelfde verticale lijn. De kopersprijs 10 ligt op V en A + t, de verkopersontvangst 7 op A. Verbind de punten met de belastingwig en geef de hulplijnen en grootheden een naam. Hiermee zijn alle gevraagde tekenhandelingen uit d uitgevoerd.','Welke lijn verbindt beide prijzen bij precies 50 tassen?','Pp op A + t aflezen zou de afdracht vergeten.','Gebruik de oude prijs van 8 euro om de uitspraak van de verkoper te beoordelen.');
}
{
 const s=target('Opgave 7e · Wie draagt de last?');
 table(s,[['Per tas','Oude prijs','Nieuwe prijs','Economische last'],['Koper','€ 8','€ 10','10 − 8 = € 2'],['Verkoper','€ 8','€ 7','8 − 7 = € 1']],60,239,1480,285,[410,300,330,440],35);
 text(s,'De uitspraak is onjuist.',60,595,1480,68,44,{bold:true,color:C.orange});text(s,'De verkoper draagt € 3 af, maar draagt € 1 last per tas.\nKopers dragen de overige € 2 per tas.',60,707,1480,121,38,{bold:true});
 notes(s,'12','Beoordeel de claim expliciet als onjuist. De koper betaalt 2 euro meer dan de oude prijs; de verkoper ontvangt 1 euro minder. Samen is de last per verhandelde tas 3 euro. De verkoper maakt het hele bedrag over aan de overheid, maar ontvangt via de hogere kopersprijs 2 euro meer om dit te helpen betalen. De uitwerking bevat oordeel, berekening en economische uitleg.','Wat is het verschil tussen de 3 euro die wordt overgemaakt en de 1 euro last?','Vergelijk met P₀, niet alleen Pc met Pp. Uit afdracht alleen volgt geen lastverdeling.','Keer terug naar de route en noteer het volledige huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(BUILD+'/slide-manifest.json',JSON.stringify({slides,graphs,overviewData,overviewSlides:slides.filter(x=>x.role==='overview').map(x=>x.number),sourceManifest:M},null,2));
await fs.writeFile(BUILD+'/presentation.json',JSON.stringify(p.toProto()));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
execFileSync(PYTHON,[fileURLToPath(new URL('./presentation-311-chart-labels.py',import.meta.url)),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'3.1.1 '+title+' – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...[...new Set(tables)].flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:[...new Set(tables)],requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({finalPath:result.finalPath,slides:slides.length,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
