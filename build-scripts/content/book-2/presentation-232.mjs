// HOW TO ADAPT: follow docs/workflows/classroom-presentation.md; replace the
// source manifest, authored example and complete target, then render/review.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('232');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB',cs:'#85C1E9',ps:'#82E0AA'};
const FONT='Arial';
const title='Producentensurplus en totaal surplus';
const sourceCommit='d53080f38ebbdbba319e6d9b89dcba86067a72be';
const source=`https://github.com/meijer1973/4veco-lessen/blob/${sourceCommit}/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/`;
const tables=[],charts=[],manifest=[],overviews=[],graphSpecs=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,70),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(t,footer='§2.3.2 '+title){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,t,60,38,1480,88,t.startsWith('Deze les:')?44:52,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1390,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 manifest.push({number:p.slides.items.length,title:t});return s;
}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: leerlingenboek Boek 2, chat-2026, gedrukte pagina ${page}. ${source}boek/Boek_2_Compleet.pdf\nAntwoordmodel: ${source}boek/Boek_2_Compleet_Antwoorden.pdf\n${authored?'Uitlegvoorbeeld — niet uit het boek. Context en getallen zijn voor deze les gemaakt. De boekverwijzing betreft alleen de methode.':''}`);
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
  cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
 }}tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 8.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §2.3.2 '+title);overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,105,1450,42,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],790,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Evenwicht, CS, PS en TS bepalen.\nMet MK maximaal TS verklaren.\nEfficiëntie en eerlijkheid scheiden.',972,244,565,122,30,{name:'overview-goals'});
 rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 84 · Opgaven 1 en 2\n1: hulp p. 82; 2: verkennen p. 80',972,459,565,95,30,{bold:active===2,name:'overview-start'});
 rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§2.3.2 · Opgaven 3 t/m 8\nBasis: 3, 4 en 5\nZelfstandig: 6 en 7\nDoelopgave: 8\nMaken en nakijken',972,654,565,185,30,{bold:active===7,name:'overview-homework'});
 notes(s,'80, 84–89',`Laat het overzicht staan tijdens ${phase.toLowerCase()}. Start: 1–2 op p. 84. Basis: 3 op p. 85, 4–5 op p. 86. Zelfstandig: 6–7 op p. 87. Doel: 8, bronnen p. 88 en vragen p. 89. Huiswerk 3–8 maken en nakijken. Bonus 9 en herhaling 10–11 zijn extra. De volledige route hoeft niet in één les af. Opgave 1 haalt evenwicht op uit §1.3.2, maar daar stonden Qv(P) en Qa(P). De inverse vorm P(Q) is een verandering van voorstelling. Geef daarom zo nodig vooraf de steun op p. 82: beide formules geven P bij dezelfde Q; stel ze gelijk, los Q op en vul in. Laat dit na dia 7 opnieuw verwoorden. In opgave 2 is kopersvoordeel bekend uit §2.3.1, maar verkopersvoordeel en het wegvallen van de prijs zijn nieuw. Laat de leerling eerst op p. 80 de twee voordelen en figuur 1 lezen, de passende verschillen aanwijzen en twijfel noteren. Dit is verkennen met steun. Bij terugkeer vóór basiswerk: laat 2a–b opnieuw proberen en vraag waarom de betaling wegvalt. Bespreek dan zo nodig de antwoorden: CS 3, PS 4, samen 7 euro.`,active===2?'Welke uitleg op p. 80 helpt bij startopgave 2?':'Welke stap wil je nog verbeteren?', 'Nieuwe leerstof in startopgave 2 is nog geen veronderstelde beheersing. Een startscore bepaalt niet automatisch de oefenroute.',active===7?'Noteer 3 tot en met 8 maken en nakijken in de agenda.':'Ga verder met de lesfase op het overzicht.');
}
const authored='Uitlegvoorbeeld — niet uit het boek';
function example(s,context='Fietsbellen'){text(s,authored+' · '+context,60,182,1480,48,29,{bold:true,color:C.blue});}
function rows(s,data,y=280,step=140){data.forEach((r,i)=>{text(s,r[0],60,y+i*step,520,100,36,{bold:true,color:C.blue});text(s,r[1],620,y+i*step,920,110,38);});}
// Literal XY series preserve editable axes, exact numeric positions and area hatching.
function graph(s,{d=28,b=.5,a=4,m=.25,maxQ=56,maxP=28,unit='fietsbel',units='fietsbellen',mode='lines',x=60,y=250,w=1040,h=550}={}){
 const q=(d-a)/(b+m),price=d-b*q,series=[];
 const add=(name,xs,ys,color,width=4,dash=false)=>series.push({name,xValues:xs,values:ys,line:{fill:color,width,style:dash?'dashed':'solid'},marker:{symbol:'none',size:3}});
 if(['cs','both'].includes(mode))for(let n=1;n<32;n++){const z=q*n/32;add('CS arcering '+n,[z,z],[price,d-b*z],C.cs,5);}
 if(['ps','both'].includes(mode))for(let n=1;n<32;n++){const z=q*n/32;add('PS arcering '+n,[z,z],[a+m*z,price],C.ps,5);}
 add('V',[0,maxQ],[d,d-b*maxQ],C.blue,4);
 add('A = MK',[0,maxQ],[a,a+m*maxQ],C.green,4);
 if(mode!=='lines'){add('Pe',[0,q],[price,price],C.orange,3,true);add('Qe',[q,q],[0,price],C.muted,2,true);}
 function label(txt,z,v,color=C.ink){series.push({name:txt,xValues:[z],values:[v],line:{fill:'none',width:0},marker:{symbol:txt==='E'?'circle':'none',size:txt==='E'?9:3},dataLabelOverrides:[{idx:0,text:txt,position:'t',showValue:false,textStyle:{typeface:FONT,fontSize:28,fill:color,bold:true}}]});}
 label('V',maxQ*.87,d-b*maxQ*.87,C.blue);label('A = MK',maxQ*.8,a+m*maxQ*.8,C.green);
 if(mode!=='lines')label('E',q,price);
 if(['cs','both'].includes(mode))label('CS',q*.2,price+(d-price)*.35,C.ink);
 if(['ps','both'].includes(mode))label('PS',q*.2,a+(price-a)*.5,C.ink);
 // Remove binary floating-point tails before materializing the literal workbook.
 series.forEach(ser=>{ser.xValues=ser.xValues.map(v=>Number(v.toFixed(6)));ser.values=ser.values.map(v=>Number(v.toFixed(6)));});
 const axisStyle={typeface:FONT,fontSize:25,fill:C.ink};
 const ch=s.charts.add('scatter',{position:{left:x,top:y,width:w,height:h},series,scatterOptions:{style:'line'},hasLegend:false,
 xAxis:{min:0,max:maxQ,majorUnit:maxQ===100?20:8,numberFormatCode:'0',title:{text:`Q (${units})`,textStyle:axisStyle},textStyle:axisStyle,line:{fill:C.ink,width:1.5}},
 yAxis:{min:0,max:maxP,majorUnit:maxP===50?10:4,numberFormatCode:'0',title:{text:`P (€ per ${unit})`,textStyle:axisStyle},textStyle:axisStyle,majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 graphSpecs.push({slide:p.slides.items.length,d,b,a,m,maxQ,maxP,q,price,mode,series});
}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 rows(s,[['Evenwicht','Vraag en aanbod gelijkstellen en E markeren.'],['Surplus','CS, PS en TS berekenen met basis, hoogte en eenheid.'],['Extra handel','Betalingsbereidheid met MK vergelijken.'],['Betekenis','Maximaal TS onderscheiden van een eerlijke verdeling.']],208,148);
 notes(s,'80–84','De les bereidt voor op opgave 8a–e. Haal betalingsbereidheid en de driehoeksformule op uit §2.3.1 (p. 72–75). MK zijn extra kosten per extra product (§2.1.3, p. 19–21). We gaan van één transactie naar een doorlopende marktgrafiek.','Wat betekenen betalingsbereidheid en MK?','Een oppervlakte geeft euro, een hoogte euro per product.','Bekijk eerst één transactie.');
}
{
 const s=slide('Het voordeel van één transactie');example(s,'Sleutelhanger');
 text(s,'Betalingsbereidheid € 18 · Prijs € 11 · MK € 6',60,267,1480,70,42,{bold:true});
 table(s,[['Voor wie?','Vergelijking','Voordeel'],['Koper: CS','18 − 11','€ 7'],['Verkoper: PS','11 − 6','€ 5']],60,375,1480,260,[540,560,380],37);
 text(s,'Samen: (18 − 11) + (11 − 6) = 18 − 6 = € 12',60,699,1480,90,43,{bold:true,color:C.orange});
 notes(s,'80','MK zijn de extra kosten van de sleutelhanger. De koper waardeert deze hoger dan de prijs. De verkoper ontvangt meer dan MK. Dezelfde betaling van 11 gaat van koper naar verkoper en valt bij optellen weg. Het gezamenlijke voordeel is betalingsbereidheid min MK.','Waarom tellen we de prijs niet nog eens bij € 18 op?','Voordeel is geen terugbetaling. PS is evenmin automatisch winst.','Maak het onderscheid met winst expliciet.',true);
}
{
 const s=slide('Omzet, producentensurplus en winst');
 rows(s,[['Omzet','Het bedrag dat de verkoop oplevert.'],['Producentensurplus','Ontvangen prijs min MK, opgeteld over verkochte producten.'],['Winst','Opbrengst min álle kosten, ook de constante kosten.']],232,174);
 text(s,'Voor PS zijn de constante kosten nog niet afgetrokken.',60,756,1480,66,39,{bold:true,color:C.orange});
 notes(s,'80–81','Bij het doorlopende marktmodel geeft het gebied onder MK de variabele productiekosten weer. Het surplus daarboven is nog nodig om vaste kosten te dekken. Zonder de vaste kosten kun je geen winstgetal noemen. Verbind dit met TK, TVK en TCK uit §2.1.1.','Kun je uit alleen PS een winstbedrag afleiden?','Het hele prijs-maal-hoeveelheidgebied is omzet, niet PS.','Bekijk twee veranderingen bij dezelfde transactie.');
}
{
 const s=slide('Een hogere waardering en lagere MK');example(s,'Dezelfde sleutelhanger');
 text(s,'Prijs blijft € 11. Dezelfde transactie gaat door.',60,256,1480,60,38,{bold:true});
 table(s,[['Situatie','CS (€)','PS (€)','Samen (€)'],['Eerst: bereidheid 18, MK 6','7','5','12'],['Alleen bereidheid naar 20','9','5','14'],['Alleen MK naar 4','7','7','14'],['Beide veranderingen','9','7','16']],60,360,1480,365,[790,230,230,230],31);
 text(s,'Beide veranderingen vergroten het gezamenlijke voordeel.',60,776,1480,60,37,{bold:true,color:C.orange});
 notes(s,'80, 86','Ondersteunt basisopgave 5 met eigen getallen. Neem steeds eerst de beginsituatie. Hogere bereidheid: 20−11=9, dus CS neemt 2 toe. Lagere MK: 11−4=7, dus PS neemt 2 toe. Samen: 20−4=16, stijging 4. Laat leerlingen de effecten apart benoemen voordat de laatste rij besproken wordt.','Waarom versterken de twee effecten elkaar?','Een stijgend en een dalend invoergetal betekenen niet tegengestelde veranderingen van voordeel.','Ga nu van één transactie naar een doorlopende markt.',true);
}
{
 const s=slide('De aanbodlijn als MK-lijn');example(s);
 text(s,'Aanbod: P = 4 + 0,25Q',60,270,1480,65,43,{bold:true,color:C.green});
 table(s,[['Q (fietsbellen)','MK = 4 + 0,25Q','MK (€ per fietsbel)'],['16','4 + 0,25 × 16','8'],['32','4 + 0,25 × 32','12'],['48','4 + 0,25 × 48','16']],60,365,1480,335,[430,620,430],33);
 text(s,'In dit model: opeenvolgende eenheden met steeds hogere MK.',60,758,1480,80,35,{bold:true});
 notes(s,'81','Dit eigen marktvoorbeeld gebruikt Q in fietsbellen en P in euro per fietsbel. Binnen 0≤Q≤56 stelt A de marginale kosten van iedere opeenvolgende eenheid voor, ook van niet verkochte eenheden. Dat is een gegeven modelaanname. §2.1.3 leerde MK als intervalgemiddelde uit een tabel; hier lezen we MK rechtstreeks op een doorlopende lijn. Verder naar rechts betreft steeds een extra eenheid met hogere kosten.','Welke MK lees je bij Q=48?','Een aanbodlijn mag niet zonder modelaanname altijd met MK worden gelijkgesteld. Een punt op MK geeft niet de totale kosten.','Combineer aanbod met vraag om de verhandelde hoeveelheid te bepalen.',true);
}
{
 const s=slide('Het marktevenwicht berekenen');example(s);
 text(s,'Vraag: P = 28 − 0,5Q      Aanbod: P = 4 + 0,25Q',60,260,1480,70,39,{bold:true});
 rows(s,[['Dezelfde Q en P','28 − 0,5Q = 4 + 0,25Q'],['Q bepalen','24 = 0,75Q     dus Qe = 32 fietsbellen'],['P invullen','Pe = 28 − 0,5 × 32 = € 12 per fietsbel']],373,132);
 text(s,'Controle in aanbod: 4 + 0,25 × 32 = 12',60,779,1480,56,34,{bold:true,color:C.green});
 notes(s,'82–83','Herhaal de oude evenwichtsprocedure uit §1.3.2 met inverse functies. Beide geven P bij dezelfde Q, dus gelijkstellen. Tel 0,5Q aan beide kanten op en trek 4 af: 24=0,75Q. Deel door 0,75. Controleer de prijs in beide functies. We gebruiken vrije handel zonder extra handelskosten of gevolgen voor anderen. De laagste MK en hoogste betalingsbereidheid bepalen de verhandelde eenheden.','Waarom kun je deze twee uitdrukkingen gelijkstellen?','Alleen Q bij een gegeven prijs berekenen, zoals §2.3.1, is nog geen evenwicht berekenen.','Markeer de berekende combinatie op de gegeven lijnen.',true);
}
{
 const s=slide('Het evenwicht in de grafiek');example(s);graph(s,{mode:'equilibrium'});
 text(s,'E = (32; 12)',1150,283,390,65,40,{bold:true});
 text(s,'Qe = 32 fietsbellen\n\nPe = € 12\nper fietsbel',1150,380,390,226,35);
 text(s,'Beide lijnen geven\nbij Q = 32\ndezelfde prijs.',1150,655,390,135,34,{bold:true});
 notes(s,'81–83','De horizontale as is Q, de verticale P. E staat bij (hoeveelheid; prijs). Gebruik de hulplijnen om de coördinaten te lezen. Alleen de 32 verhandelde fietsbellen tellen mee in het surplus.','Welke coördinaat hoort op de horizontale as?','Verwissel (Q;P) niet met (P;Q).','Haal eerst het bekende kopersgebied terug.',true);
}
{
 const s=slide('Consumentensurplus boven de prijs');example(s);graph(s,{mode:'cs'});
 text(s,'Basis: 32 fietsbellen',1140,285,400,102,36,{bold:true});
 text(s,'Hoogte:\n28 − 12 = € 16\nper fietsbel',1140,425,400,161,36);
 text(s,'CS = ½ × 32 × 16\n= € 256',1140,669,400,120,37,{bold:true,color:C.blue});
 notes(s,'74–75, 82–83','Herhaal de driehoek uit §2.3.1: onder V, boven de betaalde prijs, tot Q=32. Niet tot de vraaglijn de Q-as snijdt. De hoogte is het verschil 28−12, niet de prijs 12. De oppervlakte telt het voordeel van verkochte eenheden in het doorlopende model op.','Welke drie grenzen omsluiten CS?','Een doorlopend model gebruikt oppervlakte. Tel dit niet op alsof het een tabel met 32 losse kopers is.','Voeg onder dezelfde prijs het verkopersgebied toe.',true);
}
{
 const s=slide('Producentensurplus onder de prijs');example(s);graph(s,{mode:'both'});
 text(s,'Basis: 32 fietsbellen',1140,285,400,102,36,{bold:true});
 text(s,'Hoogte PS:\n12 − 4 = € 8\nper fietsbel',1140,425,400,161,36);
 text(s,'PS = ½ × 32 × 8\n= € 128',1140,669,400,120,37,{bold:true,color:C.green});
 notes(s,'81–83','PS ligt onder P=12 en boven A=MK, tot Q=32. De aanbodlijn begint bij 4 op de verticale as, dus de hoogte is 12−4. De hele rechthoek 12×32 bevat ook variabele kosten en is geen PS.','Waarom trek je bij de hoogte 4 van 12 af?','Het gebied onder A hoort niet bij PS.','Tel beide voordelen op en controleer de eenheden.',true);
}
{
 const s=slide('Totaal surplus en de eenheden');example(s);
 table(s,[['Gebied','Berekening','Oppervlakte'],['CS','½ × 32 × (28 − 12)','€ 256'],['PS','½ × 32 × (12 − 4)','€ 128'],['TS = CS + PS','256 + 128','€ 384']],60,292,1480,349,[390,670,420],37);
 text(s,'Fietsbellen × euro per fietsbel = euro',60,707,1480,65,42,{bold:true,color:C.orange});
 notes(s,'82–83','TS is het gezamenlijke voordeel van kopers en verkopers. Controle: de hele driehoek tussen V en MK heeft basis 32 en hoogte 28−4=24: ½×32×24=384. De prijs verdeelt het voordeel. Het totaal is een bedrag in euro, geen bedrag per fietsbel.','Hoe controleer je 384 rechtstreeks met de totale driehoek?','CS en PS hoeven niet even groot te zijn.','Onderzoek of een extra transactie het totaal groter maakt.',true);
}
{
 const s=slide('Extra handel vóór en na het evenwicht');example(s);
 table(s,[['Q','Betalingsbereidheid','MK','Verschil'],['16','28 − 0,5 × 16 = € 20','4 + 0,25 × 16 = € 8','+ € 12'],['32','€ 12','€ 12','€ 0'],['48','28 − 0,5 × 48 = € 4','4 + 0,25 × 48 = € 16','− € 12']],60,289,1480,359,[130,590,540,220],30);
 text(s,'Vóór Qe: extra handel vergroot TS.',60,697,1480,56,40,{bold:true,color:C.blue});
 text(s,'Na Qe: extra handel verkleint TS.',60,772,1480,56,40,{bold:true,color:C.orange});
 notes(s,'82, 84','Vergelijk steeds V en MK bij dezelfde hoeveelheid. Bij Q=16 is de verticale afstand 12 euro positief. Bij Q=48 is deze −12. Dit is de marginale vergelijking in het doorlopende model; deze getallen zijn geen totale CS of PS. Ook rechts van het evenwicht mogen we MK lezen binnen het gegeven domein.','Welke twee bedragen vergelijk je bij Q=48?','Vergelijk de betalingsbereidheid met MK, niet alleen de prijs met MK.','Gebruik deze vergelijking om het maximum te verklaren.',true);
}
{
 const s=slide('Maximaal totaal surplus');example(s);
 rows(s,[['Tot Q = 32','Betalingsbereidheid is minstens zo hoog als MK.'],['Voorbij Q = 32','Extra eenheden kosten meer dan ze de kopers waard zijn.'],['Bij Q = 32','TS is maximaal binnen dit marktmodel.']],265,159);
 text(s,'€ 256 voor kopers en € 128 voor verkopers: geen oordeel over eerlijkheid.',60,763,1480,74,35,{bold:true,color:C.orange});
 notes(s,'82–84','Alle eenheden met positief gezamenlijk voordeel worden verhandeld. Verder uitbreiden voegt negatief voordeel toe. Die efficiëntie-uitkomst zegt niets over een norm voor eerlijke verdeling of verdeling binnen groepen. Extra handelskosten en gevolgen voor anderen blijven in dit model buiten beeld.','Bewijst een ongelijk CS en PS dat het totaal niet maximaal is?','Een maximum van het totale bedrag betekent niet dat iedereen evenveel krijgt of dat alle maatschappelijke effecten gemeten zijn.','Controleer de redenering met dezelfde fictieve markt.',true);
}
for(const reveal of [false,true]){
 const s=slide(reveal?'Korte controle · Bespreking':'Korte controle');example(s);
 text(s,'Bij Q = 40: betalingsbereidheid € 8 en MK € 14.',60,280,1480,85,43,{bold:true});
 text(s,'“Meer fietsbellen verkopen maakt TS altijd groter.”',60,423,1480,117,47,{bold:true,color:C.blue});
 text(s,reveal?'8 − 14 = − € 6 bij de marginale vergelijking.\nDe extra eenheid verlaagt TS in dit model.':'Klopt de uitspraak?\nGebruik de betalingsbereidheid en MK in je uitleg.',60,644,1480,155,42,{bold:reveal});
 notes(s,'82–84',reveal?'De uitspraak klopt niet. Voor deze extra eenheid zijn MK hoger dan de waardering. Het verschil is −6 euro. Benoem wat de koper voor de eenheid over heeft en wat die kost.':'Laat leerlingen eerst zelf denken en kort toelichten. Dit is een controle op het uitlegvoorbeeld, geen extra huiswerkopgave. De volgende dia toont de bespreking.','Vergroot of verkleint deze extra transactie TS?','Meer omzet is niet hetzelfde als meer totaal surplus.',reveal?'Keer terug naar startopgave 2 en begin daarna met basis 3–5.':'Bespreek de redenering.',true);
}
overview('Zelfstandig werken',4);
const targetFooter='§2.3.2 · Doelopgave 8 · Boekpagina 88–89';
const targetGraph={d:50,b:.5,a:5,m:.25,maxQ:100,maxP:50,unit:'kaartje',units:'kaartjes'};
{
 const s=slide('Opgave 8 · Concertkaartjes',targetFooter);
 text(s,'Vraag P = 50 − 0,5Q      Aanbod P = 5 + 0,25Q',60,183,1480,64,39,{bold:true});
 graph(s,{...targetGraph,mode:'lines',x:60,y:286,w:1020,h:529});
 text(s,'P: euro per kaartje\nQ: kaartjes',1130,293,410,100,35,{bold:true});
 text(s,'Binnen 0 ≤ Q ≤ 100\ngeeft de inverse\naanbodlijn de MK van\nelke opeenvolgende\neenheid, ook als die\nin evenwicht niet\nwordt verkocht.',1130,439,410,316,32);
 notes(s,'88','Toon eerst de gegevens, tabel en alle vragen zonder oplossingen. Laat leerlingen de functies en het domein in het boek aanwijzen. Evenwicht en surplus zijn nog niet gemarkeerd.','Welke betekenis geeft het model aan de aanbodlijn?','Ook een niet verkochte eenheid heeft in dit domein een MK-waarde.','Toon de brontabel voordat je alle deelvragen laat zien.');
}
{
 const s=slide('Opgave 8 · Bron: marginale vergelijking',targetFooter);
 table(s,[['Q (kaartjes)','Betalingsbereidheid volgens V','Marginale kosten volgens A'],['50','€ 25','€ 17,50'],['70','€ 15','€ 22,50']],60,233,1480,318,[280,600,600],35);
 text(s,'De waarden zijn berekend met de gegeven vraag- en aanbodfunctie.',60,599,1480,95,35);
 text(s,'De inverse aanbodlijn geeft P bij Q.\nIn deze opgave lees je die P ook als MK bij dezelfde Q.',60,723,1480,105,36,{bold:true});
 notes(s,'88','Deze volledige brontabel bevat dezelfde getallen als het boek en nog geen berekende surplusverschillen. Het notatiekader hoort bij de gegevens. Vergelijk V en MK bij dezelfde Q.','Welke rij gebruik je om de 70e positie in de grafiek te onderzoeken?','Een gegeven tabelwaarde is niet het antwoord op de gevraagde vergelijking.','Toon deelvragen a–c en daarna d–e.');
}
{
 const s=slide('Opgave 8 · Vragen a–c',targetFooter);
 [['a)','Bereken de evenwichtsprijs en -hoeveelheid.'],['b)','Markeer het evenwicht in de basisgrafiek en arceer en benoem CS en PS. Teken de lijnen niet opnieuw.'],['c)','Bereken CS, PS en TS met basis, hoogte en eenheid.']].forEach((r,i)=>{text(s,r[0],60,235+i*185,75,70,40,{bold:true,color:C.blue});text(s,r[1],155,235+i*185,1385,140,38);});
 notes(s,'89','Lees de volledige deelvragen a tot en met c. De context en de tabel staan op de voorafgaande dia’s en op boekpagina 88. Toon nog geen uitwerkingen.','Heb je zowel de gebieden als de berekeningen in je schrift?','Een juist eindgetal vervangt de markering en arcering bij b niet.','Toon ook d en e voordat je een antwoord bespreekt.');
}
{
 const s=slide('Opgave 8 · Vragen d–e',targetFooter);
 text(s,'d)',60,235,75,70,40,{bold:true,color:C.blue});
 text(s,'Vergelijk met de tabel bij Q = 50 en Q = 70 de betalingsbereidheid met de marginale kosten en geef per hoeveelheid aan of één extra transactie TS verhoogt of verlaagt.',155,235,1385,238,38);
 text(s,'e)',60,551,75,70,40,{bold:true,color:C.blue});
 text(s,'Leg uit waarom TS in dit model maximaal is bij Q = 60 en waarom dit geen oordeel over een eerlijke verdeling oplevert.',155,551,1385,207,38);
 notes(s,'89','Dit zijn de volledige deelvragen d en e uit het boek. Q=60 is al expliciet gegeven in de oorspronkelijke vraag e; dit is geen toegevoegd antwoord op de eerdere dia’s. Alle gegevens en vragen zijn nu beschikbaar, vóór de bespreking.','Welke economische redenering heb je naast je getallen opgeschreven?','Een maximaal totaalbedrag is nog geen oordeel over verdeling.','Begin nu de stapsgewijze uitwerking van a.');
}
{
 const s=slide('Opgave 8a · Evenwicht',targetFooter);
 rows(s,[['Gelijkstellen','50 − 0,5Q = 5 + 0,25Q'],['Hoeveelheid','45 = 0,75Q\nQe = 60 kaartjes'],['Prijs','Pe = 50 − 0,5 × 60\nPe = € 20 per kaartje']],234,170);
 text(s,'Controle: 5 + 0,25 × 60 = € 20 per kaartje',60,784,1480,56,34,{bold:true,color:C.green});
 notes(s,'88–89','Trek 5 af en tel 0,5Q op aan beide kanten. Deel 45 door 0,75. Vul 60 in V in en controleer in A. Antwoordmodel: Qe=60, Pe=20.','Waarom hoort bij 60 in beide functies dezelfde prijs?','De hoeveelheid is in kaartjes, de prijs in euro per kaartje.','Markeer de coördinaten en de beide gebieden.');
}
{
 const s=slide('Opgave 8b · Evenwicht en surplusgebieden',targetFooter);
 graph(s,{...targetGraph,mode:'both',y:211,h:600});
 text(s,'E = (60; 20)',1140,240,400,72,40,{bold:true});
 text(s,'CS\nBoven P = 20\nen onder V',1140,376,400,140,36,{bold:true,color:C.blue});
 text(s,'PS\nOnder P = 20\nen boven A = MK',1140,567,400,151,36,{bold:true,color:C.green});
 text(s,'Beide tot Q = 60.',1140,771,400,55,33,{bold:true});
 notes(s,'88–89','Het evenwicht is E(60;20). De blauwe driehoek heeft hoekpunten (0;50), (0;20), (60;20). De groene driehoek heeft (0;5), (0;20), (60;20). Geen oppervlak rechts van 60 telt mee. De oorspronkelijke lijnen blijven staan.','Waar stopt de basis van beide driehoeken?','Arceer het gebied onder de aanbodlijn niet als PS.','Bereken eerst de kopersdriehoek.');
}
{
 const s=slide('Opgave 8c · Consumentensurplus',targetFooter);
 rows(s,[['Basis','60 kaartjes'],['Hoogte','50 − 20 = € 30 per kaartje'],['Berekening','CS = ½ × 60 × 30 = € 900']],246,159);
 text(s,'Kopers hebben samen € 900 meer over dan ze betalen.',60,753,1480,79,40,{bold:true,color:C.blue});
 notes(s,'88–89','Neem basis 60 kaartjes en hoogte 30 euro per kaartje. Kaartjes maal euro per kaartje geeft euro. Het bedrag is het gezamenlijke voordeel van de kopers, niet de omzet of een korting.','Waarom is de hoogte 30 en niet 20?','De prijs zelf is niet automatisch de hoogte van CS.','Bereken PS en tel beide bedragen op.');
}
{
 const s=slide('Opgave 8c · Producentensurplus en totaal',targetFooter);
 rows(s,[['Basis','60 kaartjes'],['Hoogte PS','20 − 5 = € 15 per kaartje'],['Producentensurplus','PS = ½ × 60 × 15 = € 450']],219,141);
 text(s,'TS = CS + PS = 900 + 450 = € 1.350',60,686,1480,78,45,{bold:true,color:C.orange});
 text(s,'Controle: ½ × 60 × (50 − 5) = € 1.350',60,787,1480,49,32,{bold:true});
 notes(s,'88–89','De hoogte van PS is het prijsverschil tussen 20 en het startpunt 5 van A=MK. TS is 1350 euro. De controle gebruikt de driehoek tussen V en MK. PS is verkopersvoordeel boven de marginale productiekosten en niet zonder meer winst.','Welk beginpunt lees je voor de hoogte van PS?','Gebruik niet 20 als volledige hoogte en trek vaste kosten niet nog eens van TS af zonder gevraagde gegevens.','Bekijk de marginale vergelijking bij 50 en 70.');
}
{
 const s=slide('Opgave 8d · Wat doet extra handel met TS?',targetFooter);
 table(s,[['Q','Betalingsbereidheid − MK','Verschil','Extra transactie'],['50','25 − 17,50','+ € 7,50','Verhoogt TS'],['70','15 − 22,50','− € 7,50','Verlaagt TS']],60,259,1480,315,[150,660,300,370],34);
 text(s,'Bij 50 is de eenheid méér waard dan zij kost.',60,650,1480,61,39,{bold:true,color:C.blue});
 text(s,'Bij 70 kost de eenheid méér dan zij waard is.',60,759,1480,61,39,{bold:true,color:C.orange});
 notes(s,'88–89','Gebruik de brontabel. Beide verschillen betreffen de marginale vergelijking bij die hoeveelheid. Ook bij 70 mag de aanbodlijn als MK worden gelezen, hoewel dat punt rechts van het vrije evenwicht ligt. Die aanname stond uitdrukkelijk in de context.','Waarom mag je de MK bij 70 gebruiken?','Het verschil van 7,50 is geen totaal surplus van 50 of 70 kaartjes.','Verbind de twee tekens met het maximum bij 60.');
}
{
 const s=slide('Opgave 8e · Maximaal TS en verdeling',targetFooter);
 rows(s,[['Tot Q = 60','Betalingsbereidheid ≥ MK: handel levert gezamenlijk voordeel.'],['Na Q = 60','MK > betalingsbereidheid: extra handel verlaagt TS.'],['Conclusie','TS is maximaal bij Q = 60, binnen dit model.']],224,159);
 text(s,'De functies bevatten geen norm voor een eerlijke verdeling.',60,750,1480,83,40,{bold:true,color:C.orange});
 notes(s,'88–89','Tot het evenwicht zijn voordelige transacties mogelijk, op de grens is de marginale bijdrage nul en daarna negatief. Zo wordt TS gemaximaliseerd. CS=900 en PS=450 beschrijven de verdeling tussen groepen maar bewijzen geen eerlijkheid of oneerlijkheid. Het model geeft ook geen volledig oordeel over alle maatschappelijke gevolgen. Laat leerlingen een ontbrekende redenering of eenheid in hun eigen antwoord verbeteren.','Welke zin in je antwoord verklaart het maximum, en welke zin begrenst de conclusie?','Efficiëntie betekent niet automatisch CS=PS.','Keer terug naar het overzicht en noteer het huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({slides:manifest,overviewSlides:overviews,sourceCommit,tables,charts,graphSpecs},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'2.3.2 '+title+' – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...Array.from(new Set(tables)).flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:Array.from(new Set(tables)),requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:p.slides.items.length,overviews,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
