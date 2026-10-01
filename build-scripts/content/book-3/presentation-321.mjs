// HOW TO ADAPT: read the current paragraph, answers, teacher route and printed
// book pages first. Update the adjacent source manifest and teaching example.
// Runtime paths come from the installed presentation skill, never this source.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('321');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#1A5276',green:'#1E8449',orange:'#A94D16',purple:'#7B2D8E',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',TITLE='§3.2.1 Volkomen concurrentie';
const provenance=JSON.parse(await fs.readFile(new URL('./presentation-321.sources.json',import.meta.url),'utf8'));
const source=`https://github.com/meijer1973/4veco-lessen/blob/${provenance.lessonCommit}/edities/books34-v3/`;
const tables=[],charts=[],slides=[],overviewSlides=[],graphContracts=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,70),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer=TITLE){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,86,50,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1380,31,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,34,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title});return s;
}
function notes(s,page,explanation,question,pitfall,transition,{authored=false}={}){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 3, actuele v3-uitgave, gedrukte boekpagina ${page}. ${source}books/book-3/output/Boek_3_Compleet_v3.pdf\nManuscript: ${source}books/book-3/chapters/3.2/3.2.1%20manuscript.md\nAntwoordmodel: ${source}books/book-3/chapters/3.2/Antwoorden.md\n${authored?'Uitlegvoorbeeld — niet uit het boek. De havermarkt, teler Sam en alle voorbeeldgetallen zijn voor deze presentatie gemaakt. De bron ondersteunt de methode, niet deze context of data.':''}`);
}
function table(s,values,x,y,w,h,widths,size=34){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){
  t.rows[r].height=h/values.length;
  for(let c=0;c<values[0].length;c++){
   const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
   cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
  }
 }
 tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 7.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: '+TITLE+': kenmerken');overviewSlides.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],790,hs[i],30,{bold:active===i+1,color,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,185,568,45,35,{bold:true});
 text(s,'Prijsnemerschap verklaren,\nmarktprijs overnemen en\nTO, GO en MO berekenen.\nEen prijskeuze beoordelen.',972,240,568,143,30,{name:'overview-goals'});
 rule(s,972,391,568);
 text(s,'Startopdracht',972,408,568,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 57 · Opgaven 1 en 2\n2: verkennen met theorie\nop pagina 54–55',972,460,568,110,30,{bold:active===2,name:'overview-start'});
 rule(s,972,586,568);
 text(s,'Huiswerk',972,604,568,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§3.2.1\nBasis: 3 en 4\nZelfstandig: 5 en 6\nDoelopgave: 7\nMaken en nakijken',972,657,568,184,30,{bold:active===7,name:'overview-homework'});
 notes(s,'54–60',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start 1–2 op p. 57, basis 3 op p. 57 en 4 op p. 58, zelfstandig 5–6 op p. 59, doel 7 op p. 60. Huiswerk: opgaven 3, 4, 5, 6 en 7 maken en nakijken. Bonus 8 en herhaling 9–10 zijn extra. Opgave 1 haalt TO, GO en MO uit Boek 2 terug. Als dat hapert: TO = P × q, GO = TO / q en MO = ΔTO / Δq. Opgave 2 is een verkenning van nieuwe modelkenmerken en de overgang van markt naar onderneming. Laat leerlingen de vier kenmerken op p. 54 en de twee grafieken met toelichting op p. 55 gebruiken, en hun twijfel noteren. Verwacht nog geen zelfstandig beheerste nieuwe procedure. Bij terugkeer vóór het basiswerk: laat opgave 2 opnieuw proberen en laat leerlingen Q en q aanwijzen en hun modelredenering toelichten. De docenthandleiding reserveert voorlopig twee lessen van 55 minuten, zonder gemeten tijdsfit. Verschuif zo nodig de lesgrens en behoud alle begeleide inoefening.`,active===2?'Welke stap kun je al en waarbij gebruik je de theorie?':'Wat verbeter je na de uitleg in je antwoord op startopgave 2?', 'De boekpagina’s 54–60 verschillen van de lokale hoofdstukpagina’s 2–8. De nieuwe firmalijn is geen reeds beheerste voorkennis.',active===7?'Laat het huiswerk noteren. Volgende paragraaf: marginale kosten uit een functie.':'Ga naar de volgende lesfase als de klas eraan toe is.');
 return s;
}
function example(s){text(s,'Uitlegvoorbeeld — niet uit het boek',60,173,1480,45,29,{color:C.muted});}
function line(name,xValues,values,color,width=4,style='solid',label){
 // Remove binary floating-point residue at Excel's export boundary only.
 return {name,xValues:xValues.map(v=>Number(v.toPrecision(14))),values:values.map(v=>Number(v.toPrecision(14))),line:{fill:color,width,style},marker:{symbol:'none'},...(label?{dataLabelOverrides:xValues.map((_,idx)=>({idx,...(idx===label.idx?{text:label.text.replaceAll(' ','\u00a0'),position:label.pos||'top',textStyle:{typeface:FONT,fontSize:29,bold:true,fill:color}}:{}),showValue:false,showCategoryName:false,showSeriesName:false,showPercent:false}))}:{})};
}
const models={example:{key:'example',xmax:12,xstep:2,ymax:5,ystep:1,price:2.5,quantity:6,cap:180,qstep:60,demand:[4,-.25],supply:[1,.25]},target:{key:'target',xmax:10,xstep:2,ymax:6,ystep:1,price:3,quantity:4,cap:160,qstep:40,demand:[5,-.5],supply:[1,.5]}};
function chart(s,{m,firm=false,stage=0,x=60,y=285,w=720,h=475,label='P = GO = MO'}){
 const xmax=firm?m.cap:m.xmax,series=[];
 if(!firm){
  const xs=[0,m.xmax*.7,m.xmax];
  series.push(line('V',xs,xs.map(q=>m.demand[0]+m.demand[1]*q),C.blue,4,'solid',{idx:1,text:'V',pos:'bottom'}));
  series.push(line('A',xs,xs.map(q=>m.supply[0]+m.supply[1]*q),C.green,4,'solid',{idx:1,text:'A'}));
  if(stage>=1){
   series.push(line('Prijshulplijn',[0,m.quantity],[m.price,m.price],C.muted,2,'dashed'));
   series.push(line('Hoeveelheidshulplijn',[m.quantity,m.quantity],[0,m.price],C.muted,2,'dashed'));
   series.push({name:'E',xValues:[m.quantity],values:[m.price],line:{fill:C.ink,width:0},marker:{symbol:'circle',size:10},dataLabelOverrides:[{idx:0,text:'E',position:'right',showValue:false,textStyle:{typeface:FONT,fontSize:28,bold:true,fill:C.ink}}]});
  }
 }else if(stage>=1){
  series.push(line(label,[0,m.cap*.5,m.cap],[m.price,m.price,m.price],C.purple,5,'solid',{idx:1,text:label}));
 }else{
  // Invisible zero-line keeps the editable blank axes. No answer is exposed.
  series.push(line('Lege assen',[0,m.cap],[0,0],C.paper,0));
 }
 const ch=s.charts.add('scatter',{position:{left:x,top:y,width:w,height:h},series,scatterOptions:{style:'lineWithMarkers'},hasLegend:false,
  xAxis:{min:0,max:xmax,majorUnit:firm?m.qstep:m.xstep,numberFormatCode:'0',title:{text:firm?'q (kg per dag)':'Q (× 1.000 kg per dag)',textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:26,fill:C.ink},line:{fill:C.ink,width:2}},
  yAxis:{min:0,max:m.ymax,majorUnit:m.ystep,numberFormatCode:'0',title:{text:'P (€ per kg)',textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:26,fill:C.ink},line:{fill:C.ink,width:2},majorGridlines:{fill:C.line,width:1}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 graphContracts.push({slide:p.slides.items.length,chartOnSlide:s.charts.items.length,model:m.key,firm,stage,xmax,ymax:m.ymax,series:series.map(({name,xValues,values})=>({name,xValues,values}))});return ch;
}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const rows=[['Prijsnemerschap','Je verklaart waarom één kleine onderneming de marktprijs overneemt.'],['Markt en onderneming','Je neemt de prijs over en onderscheidt Q van q.'],['Opbrengsten en prijskeuze','Je berekent TO, GO en MO en beoordeelt een hogere of lagere prijs.']];
 rows.forEach((r,i)=>{const y=222+i*188;text(s,r[0],60,y,590,90,39,{bold:true,color:C.blue});text(s,r[1],690,y,850,120,38);if(i<2)rule(s,60,y+143,1480);});
 notes(s,'54–56','De markt bepaalt hier de prijs. De onderneming kiest binnen haar capaciteit hoeveel zij produceert. De optimale productie met kosten komt pas in §3.2.3. Vandaag verbinden we de marktprijs met de opbrengsten van één onderneming.', 'Wat kan een teler nog kiezen als de prijs vaststaat?', 'Prijsnemer zijn betekent niet dat de onderneming geen enkele keuze heeft.', 'Bekijk de vier aannames van dit model.');
}
{
 const s=slide('Vier kenmerken van volkomen concurrentie');
 table(s,[['Kenmerk','Betekenis'],['Veel kleine aanbieders en vragers','Eén deelnemer beïnvloedt de marktprijs nauwelijks.'],['Homogeen product','Kopers zien dezelfde kwaliteit als gelijkwaardig.'],['Doorzichtige markt','De relevante prijzen en kwaliteit zijn bekend.'],['Vrije toetreding en uittreding','Beginnen of stoppen kan zonder bijzondere barrières.']],60,216,1480,475,[670,810],34);
 text(s,'Eén onderneming is prijsnemer.',60,739,1480,77,46,{bold:true,color:C.blue});
 notes(s,'54','Leg uit dat de kenmerken samen het model vormen. Een koper kan bij andere kleine aanbieders een gelijkwaardig product tegen de bekende marktprijs kopen. Vrije toetreding en uittreding hoort bij het model; formele langetermijneffecten horen bij Boek 4. Gebruik dit als context om een prijskeuze te beoordelen.', 'Waarom gaat een koper niet vanzelf meer betalen aan één aanbieder?', 'Een model beschrijft aannames. Niet iedere landbouwmarkt voldoet er volledig aan.', 'Gebruik een afzonderlijk voorbeeld van een havermarkt.');
}
{
 const s=slide('De havermarkt');example(s);chart(s,{m:models.example,w:1020,h:550,y:249});
 text(s,'Veel kleine telers\nGelijke kwaliteit\nBekende prijzen\nVrij beginnen of stoppen',1120,295,420,276,33,{bold:true});
 text(s,'Q: alle telers samen',1120,665,420,95,34,{bold:true,color:C.blue});
 notes(s,'54–55','Eigen rekenvoorbeeld: de vraaglijn loopt van (0;4) naar (12;1), de aanbodlijn van (0;1) naar (12;4). Q staat in duizend kg per dag, P in euro per kg. De gegevens veronderstellen alle vier modelkenmerken. Herhaal de uit Boek 1 bekende bewerking: zoek het snijpunt, lees beide assen en pas de × 1.000-schaal toe.', 'Wat betekent het getal 6 op de horizontale as?', 'Een aswaarde van 6 betekent hier 6.000 kg per dag.', 'Lees op dezelfde assen het evenwicht af.',{authored:true});
}
{
 const s=slide('Het marktevenwicht');example(s);chart(s,{m:models.example,stage:1,w:1020,h:550,y:249});
 text(s,'P = € 2,50 per kg',1120,318,420,110,40,{bold:true,color:C.blue});
 text(s,'Q = 6 × 1.000\n= 6.000 kg per dag',1120,492,420,150,38,{bold:true});
 notes(s,'55','Wijs E aan. Volg de horizontale hulplijn naar P = 2,50. Volg de verticale hulplijn naar Q = 6 op een schaal van duizend kg per dag. Controle: vraag en aanbod zijn bij Q = 6 beide 2,50. Het cijfer 6 is geen productie van één teler.', 'Welke prijs past bij het snijpunt?', 'Lees niet de verticale hoogte van één willekeurig punt op een curve als evenwichtsprijs.', 'Bekijk nu één kleine teler bij die marktprijs.',{authored:true});
}
{
 const s=slide('De marktprijs en één teler');example(s);
 text(s,'De hele havermarkt',60,232,720,50,35,{bold:true});text(s,'Teler Sam: maximaal 180 kg per dag',850,232,690,50,33,{bold:true});
 chart(s,{m:models.example,stage:1});chart(s,{m:models.example,firm:true,x:850,w:690});
 text(s,'Sam neemt de prijs over: € 2,50 per kg.',60,781,1480,51,37,{bold:true,color:C.blue});
 notes(s,'55','Introduceer de representatieovergang expliciet. Links Q is alle aangeboden en gevraagde haver samen. Rechts q is Sams eigen afzet, maximaal 180 kg per dag. Neem alleen de prijs over. Rechts staat nog geen opbrengstlijn. Laat leerlingen eerst de asverschillen benoemen.', 'Welk getal verhuist naar rechts en welk getal niet?', 'De 6.000 kg van de markt past niet op Sams hoeveelheidsas en is niet zijn productie.', 'Teken rechts de lijn bij dezelfde prijs.',{authored:true});
}
{
 const s=slide('Elke kg brengt dezelfde prijs op');example(s);
 text(s,'De hele havermarkt',60,232,720,50,35,{bold:true});text(s,'Teler Sam: maximaal 180 kg per dag',850,232,690,50,33,{bold:true});
 chart(s,{m:models.example,stage:1});chart(s,{m:models.example,firm:true,stage:1,x:850,w:690,label:'P'});
 text(s,'Elke kg brengt € 2,50 op, binnen Sams capaciteit.',60,781,1480,51,36,{bold:true});
 notes(s,'55–56','De lijn rechts ligt op P = 2,50 en loopt binnen de getekende capaciteit tot q = 180. Een kleine verandering van Sams eigen afzet verandert de marktprijs in dit model niet. De dalende vraaglijn links blijft bestaan: een verandering van de marktprijs is iets anders dan een verandering van Sams eigen afzet.', 'Waarom loopt de lijn rechts horizontaal, terwijl V links daalt?', 'Horizontaal betekent niet onbeperkte productie of horizontale marktvraag.', 'Bereken de opbrengsten bij 60 kg per dag.',{authored:true});
}
{
 const s=slide('Totale en gemiddelde opbrengst');example(s);
 text(s,'Sam verkoopt 60 kg per dag voor € 2,50 per kg.',60,249,1480,60,38,{bold:true,color:C.blue});
 table(s,[['Grootheid','Berekening','Uitkomst'],['Totale opbrengst','TO = P × q = 2,50 × 60','€ 150 per dag'],['Gemiddelde opbrengst','GO = TO / q = 150 / 60','€ 2,50 per kg']],60,362,1480,299,[465,595,420],34);
 text(s,'GO = P bij één vaste verkoopprijs en q > 0.',60,730,1480,65,40,{bold:true});
 notes(s,'56','Herhaal de uit Boek 2 bekende formules. TO telt alle verkochte kg tegen 2,50 op: 150 euro per dag. GO deelt dat dagbedrag door 60 kg per dag: 2,50 euro per kg. Bij q = 0 is TO nul maar kun je GO niet berekenen. Het boek gebruikt q voor één onderneming; in Boek 2 heette die hoeveelheid nog Q.', 'Waarom hebben TO en GO een andere eenheid?', '150 is het totaal en niet de opbrengst van één kg. Delen door nul kan niet.', 'Vergelijk twee afzethoeveelheden om MO te vinden.',{authored:true});
}
{
 const s=slide('Marginale opbrengst: eerst aftrekken, dan delen');example(s);
 table(s,[['q (kg per dag)','TO (€ per dag)'],['60','2,50 × 60 = 150'],['90','2,50 × 90 = 225']],60,257,1480,267,[600,880],36);
 text(s,'ΔTO = 225 − 150 = € 75 per dag',60,575,1480,60,41);
 text(s,'Δq = 90 − 60 = 30 kg per dag',60,659,1480,60,41);
 text(s,'MO = ΔTO / Δq = 75 / 30 = € 2,50 per kg',60,754,1480,65,42,{bold:true,color:C.purple});
 notes(s,'56','Δ betekent de verandering. Eerst twee totale opbrengsten uitrekenen, daarna het verschil van 75 euro per dag delen door de toename van 30 kg per dag. Dit herhaalt de marginale tabelmethode uit §2.1.3, geen afgeleide. De hele uitbreiding levert 75 euro op; elke extra kg gemiddeld 2,50 euro.', 'Waarom is MO hier niet € 75?', 'Deel door de extra 30 kg en niet door de totale 90 kg.', 'Zet GO en MO bij de horizontale prijslijn.',{authored:true});
}
{
 const s=slide('De opbrengstlijn van één prijsnemer');example(s);
 chart(s,{m:models.example,firm:true,stage:1,w:1020,h:550,y:249});
 text(s,'P = GO = MO\n= € 2,50 per kg',1120,320,420,165,39,{bold:true,color:C.purple});
 text(s,'TO = 2,50 × q\nTO groeit met q.',1120,599,420,118,35);
 notes(s,'55–56','Label nu de lijn volledig als P = GO = MO. Alle drie zijn bedragen per kg. TO is een totaalbedrag per dag en stijgt met q. Bij q = 0 blijft de gegeven prijs bestaan maar is GO niet gedefinieerd; behandel de GO-gelijkheid alleen voor positieve afzet. De lijn stopt bij de capaciteit.', 'Welke opbrengst stijgt wél als Sam meer kg verkoopt?', 'TO hoort niet als naam bij deze horizontale lijn.', 'Beoordeel wat er gebeurt als Sam een andere prijs vraagt.',{authored:true});
}
{
 const s=slide('Een prijs boven de marktprijs');example(s);
 table(s,[['Zelfde kwaliteit haver','Prijs per kg'],['Andere kleine telers','€ 2,50'],['Sam vraagt','€ 2,75']],60,274,1480,273,[910,570],40);
 text(s,'Kopers kennen de prijzen en kopen elders.',60,631,1480,66,44,{bold:true,color:C.blue});
 text(s,'Sam verliest in dit model zijn afzet.',60,741,1480,62,41);
 notes(s,'54–56','Verbind de redenering aan de modelaannames: gelijkwaardig product, veel alternatieven, bekende prijzen en Sams kleine marktaandeel. Klanten kunnen dezelfde haver voor 2,50 kopen. Alleen zeggen dat hij prijsnemer is, verklaart de reactie van kopers nog niet.', 'Welke twee kenmerken heb je nodig om de keuze van de koper te verklaren?', 'Een hogere gevraagde prijs garandeert geen hogere totale opbrengst.', 'Vergelijk daarna een lagere prijs bij dezelfde afzet.',{authored:true});
}
{
 const s=slide('Een lagere prijs bij dezelfde afzet');example(s);
 text(s,'Sam verkoopt in beide gevallen 60 kg per dag.',60,249,1480,60,38,{bold:true,color:C.blue});
 table(s,[['Prijs per kg','TO per dag'],['€ 2,50','2,50 × 60 = € 150'],['€ 2,25','2,25 × 60 = € 135']],60,360,1480,267,[600,880],39);
 text(s,'TO daalt € 15. De kosten bij dezelfde q blijven gelijk.',60,685,1480,60,37);
 text(s,'De winst daalt dus € 15 per dag.',60,770,1480,58,41,{bold:true,color:C.orange});
 notes(s,'56','Voor 2,50 kan Sam zijn 60 kg al verkopen. Bij dezelfde productie verandert de hoeveelheid gebruikte productiemiddelen niet. Een prijsverlaging naar 2,25 vermindert daarom zowel opbrengst als winst met 15 euro per dag. Zonder kostengegevens kunnen we de verandering van winst bepalen, niet het totale winstbedrag.', 'Waarom zijn hier geen totale kosten nodig om de winstverandering te bepalen?', 'Dit is een vergelijking bij dezelfde afzet binnen de modelaannames, geen algemene regel voor ieder bedrijf.', 'Controleer steeds of het product nog homogeen is.',{authored:true});
}
{
 const s=slide('Wanneer past het model?');example(s);
 table(s,[['Haver die kopers gelijkwaardig vinden','Een eigen graanmengsel waar klanten extra voor betalen'],['Een hogere prijs laat kopers uitwijken.','Kopers zien dit product als anders.'],['Een horizontale opbrengstlijn past bij het model.','De aanname van een homogeen product ontbreekt.']],60,277,1480,348,[740,740],35);
 text(s,'Een andere modelaanname vraagt om een nieuwe beoordeling.',60,714,1480,95,39,{bold:true,color:C.blue});
 notes(s,'54–56, 59','Dit is een apart bedacht vergelijkingsvoorbeeld, geen uitwerking van opgave 6. Laat de leerlingen toetsen of kopers de producten als gelijkwaardig ervaren. Een bijzondere naam of verpakking alleen bewijst niet dat klanten extra willen betalen; die bereidheid is hier expliciet gegeven. Je hoeft nog geen nieuw marktmodel te tekenen.', 'Welke aanname verandert als klanten juist dit mengsel willen?', 'Gebruik P = GO = MO niet automatisch buiten de prijsnemersaannames.', 'Controleer kort of de kernbewerkingen duidelijk zijn.',{authored:true});
}
{
 const s=slide('Korte check bij het uitlegvoorbeeld');example(s);
 text(s,'Sam verkoopt nu 100 kg per dag voor € 2,50 per kg.',60,249,1480,65,40,{bold:true,color:C.blue});
 const prompts=['Wat zijn TO en GO, inclusief eenheid?','Wat is MO als Sam daarna 10 kg extra verkoopt?','Welke hoeveelheid hoort links: Q of q?'];
 prompts.forEach((v,i)=>text(s,v,60,382+i*132,1480,99,39));
 notes(s,'55–56','Laat kort een antwoord formuleren. Bespreek daarna mondeling: TO = 250 euro per dag, GO = 2,50 euro per kg. Bij 110 kg wordt TO = 275; MO = (275 − 250) / (110 − 100) = 2,50 euro per kg. Links hoort Q, alle telers samen. De getallen komen uit het eigen uitlegvoorbeeld en voegen geen huiswerk toe.', 'Welke eenheid helpt je TO en MO uit elkaar houden?', 'MO is niet de extra totale opbrengst van 25 euro.', 'Keer terug naar startopgave 2 en laat daarna bij de basisopgaven beginnen.',{authored:true});
}
overview('Oefenen',4);
{
 const s=slide('Doelopgave 7: Wortelveiling',TITLE+' · Opgave 7 · Boekpagina 60');
 text(s,'Veel kleine telers bieden wortelen van dezelfde kwaliteit aan. Kopers kennen alle prijzen. Beginnen of stoppen is vrij. Teler Mila kan tot 160 kg per dag leveren en bij de marktprijs verkopen.',60,182,1480,152,35);
 text(s,'De hele markt',60,359,720,48,34,{bold:true});text(s,'Eén onderneming: Mila',850,359,690,48,34,{bold:true});
 chart(s,{m:models.target,y:411,h:365});chart(s,{m:models.target,firm:true,x:850,w:690,y:411,h:365});
 text(s,'Figuur 5. Vul alleen de ontbrekende lijn en labels in de ondernemingsgrafiek aan.',60,789,1480,45,28);
 notes(s,'60','Dit is de volledige context van de werkelijke boekopgave 7. De bronfiguur is met dezelfde asschalen en curves bewerkbaar overgenomen: links V van (0;5) tot (10;0), A van (0;1) tot (10;6), rechts een lege grafiek tot q = 160. Toon eerst alle deelvragen op de volgende twee dia’s. Er staat nog geen oplossingslijn of gemarkeerd evenwicht.', 'Welke gegevens en aannames geeft de bron?', 'De markthoeveelheid staat in duizend kg per dag, die van Mila in kg per dag.', 'Lees eerst vragen a, b en c zonder de oplossing.');
}
{
 const s=slide('Opgave 7: vragen a, b en c',TITLE+' · Opgave 7 · Boekpagina 60');
 text(s,'a. (2p) Lees de marktprijs en de markthoeveelheid af. Noem één kenmerk uit de bron dat prijsnemerschap ondersteunt.',60,221,1480,127,38);
 text(s,'b. (2p) Teken rechts de opbrengstlijn van Mila. Label die als P = GO = MO.',60,411,1480,113,38);
 text(s,'c. (3p) Bereken bij q = 120 kg de TO en GO. Bereken MO wanneer Mila van 120 naar 140 kg gaat.',60,612,1480,140,38);
 notes(s,'60','De eerste drie deelvragen zijn volledig en zonder antwoorden weergegeven. Laat leerlingen hun eigen werk en de figuur op p. 60 erbij houden. Deelvraag a vraagt een aflezing én een modelkenmerk, b een getekende lijn én het label, c drie opbrengstbewerkingen met eenheden.', 'Welke verschillende bewerkingen vraagt deelvraag c?', 'Verwar het noemen van een kenmerk niet met het aflezen van de markt.', 'Toon ook d en e voordat de bespreking begint.');
}
{
 const s=slide('Opgave 7: vragen d en e',TITLE+' · Opgave 7 · Boekpagina 60');
 text(s,'d. (2p) Mila overweegt € 3,20 te vragen.\nLeg uit waarom zij in dit model daardoor haar kopers verliest.',60,249,1480,146,39);
 text(s,'e. (2p) Een klasgenoot zegt: “De markt verkoopt 4.000 kg, dus de lijn van Mila moet bij q = 4.000 eindigen.” Leg de fout uit.',60,503,1480,191,39);
 notes(s,'60','Nu zijn alle vragen a tot en met e zichtbaar geweest, zonder oplossingen. Het getal 4.000 is onderdeel van de letterlijke vraag e. Vraag d vereist de keuze van kopers op basis van modelkenmerken. Vraag e vereist het onderscheid tussen Q van de markt en q van Mila, inclusief haar capaciteit.', 'Welke aanname of grootheid moet je bij elk antwoord noemen?', 'Een juiste term zonder uitleg beantwoordt een verklaarvraag niet volledig.', 'Begin de bespreking met het evenwicht en een modelkenmerk.');
}
{
 const s=slide('Opgave 7a: evenwicht en prijsnemerschap',TITLE+' · Opgave 7 · Boekpagina 60');
 chart(s,{m:models.target,stage:1,w:1000,h:574,y:211});
 text(s,'P = € 3 per kg',1110,239,430,73,41,{bold:true,color:C.blue});
 text(s,'Q = 4 × 1.000\n= 4.000 kg per dag',1110,362,430,136,38,{bold:true});
 text(s,'Bijvoorbeeld:\nveel kleine telers.',1110,552,430,115,36,{bold:true});
 text(s,'Eén teler heeft\nnauwelijks prijsinvloed.',1110,702,430,116,33);
 notes(s,'60','Lees beide coördinaten van E af. P = 3 euro per kg. Q = 4 op de × 1.000-schaal, dus 4.000 kg per dag. Als onderbouwing volstaat één passend bronkenmerk, bijvoorbeeld veel kleine telers. Ook gelijke kwaliteit of bekende prijzen ondersteunen de verklaring. De lijnen kruisen op (4;3): V = 5 − 0,5 × 4 = 3 en A = 1 + 0,5 × 4 = 3.', 'Waarom schrijf je 4.000 en niet 4 kg per dag?', 'De 4.000 kg betreft alle telers samen.', 'Neem de prijs over naar Mila.');
}
{
 const s=slide('Opgave 7b: Mila’s opbrengstlijn',TITLE+' · Opgave 7 · Boekpagina 60');
 chart(s,{m:models.target,firm:true,stage:1,w:1020,h:574,y:211});
 text(s,'P = GO = MO\n= € 3 per kg',1120,285,420,159,42,{bold:true,color:C.purple});
 text(s,'Horizontaal op 3\nTot q = 160\nEenheid: € per kg',1120,576,420,192,35);
 notes(s,'60','Teken in de ondernemingsgrafiek een horizontale lijn op hoogte 3. Laat die lopen tot de gegeven capaciteit van 160 kg per dag en zet het label P = GO = MO erbij. De prijs geldt ook bij nul productie; GO is alleen gedefinieerd bij q groter dan nul. De lijn toont geen totale opbrengst.', 'Welke hoogte en welk eindpunt horen bij de lijn?', 'Het eindpunt 160 is capaciteit, geen berekende winstmaximaliserende productie.', 'Bereken nu totale en gemiddelde opbrengst bij q = 120.');
}
{
 const s=slide('Opgave 7c: TO en GO bij 120 kg',TITLE+' · Opgave 7 · Boekpagina 60');
 text(s,'TO = P × q',60,224,1480,73,49,{bold:true,color:C.blue});
 text(s,'TO = 3 × 120 = € 360 per dag',60,328,1480,77,49,{bold:true});
 rule(s,60,465,1480);
 text(s,'GO = TO / q',60,518,1480,73,49,{bold:true,color:C.purple});
 text(s,'GO = 360 / 120 = € 3 per kg',60,621,1480,78,49,{bold:true});
 text(s,'Controle: GO is gelijk aan de marktprijs.',60,775,1480,58,35);
 notes(s,'60','Begin bij de formule en vul daarna de gegeven marktprijs en Mila’s eigen q in. De totale opbrengst is 360 euro per dag. Deel door de eigen 120 kg per dag voor GO = 3 euro per kg. De afzet ligt binnen de capaciteit van 160. Controleer de uitkomst met de prijslijn.', 'Waarom deel je door 120 en niet door 4.000?', 'De totale markthoeveelheid is geen invoer voor Mila’s TO of GO.', 'Bereken vervolgens MO over de uitbreiding naar 140 kg.');
}
{
 const s=slide('Opgave 7c: MO bij 20 kg extra',TITLE+' · Opgave 7 · Boekpagina 60');
 table(s,[['q (kg per dag)','TO (€ per dag)'],['120','3 × 120 = 360'],['140','3 × 140 = 420']],60,207,1480,264,[600,880],37);
 text(s,'ΔTO = 420 − 360 = € 60 per dag',60,520,1480,60,42);
 text(s,'Δq = 140 − 120 = 20 kg per dag',60,613,1480,60,42);
 text(s,'MO = ΔTO / Δq = 60 / 20 = € 3 per kg',60,724,1480,67,44,{bold:true,color:C.purple});
 notes(s,'60','Bereken eerst de nieuwe TO van 420 euro per dag. Trek 360 af, neem ook het verschil in afzet en deel 60 door 20. Zowel 120 als 140 kg ligt binnen Mila’s capaciteit. Iedere extra kg levert dezelfde prijs van 3 euro op. Controle: MO = P = GO.', 'Wat is het verschil tussen de € 60 en de € 3?', 'ΔTO is extra totale opbrengst per dag; MO is opbrengst per extra kg.', 'Beoordeel Mila’s hogere prijs.');
}
{
 const s=slide('Opgave 7d: waarom kopers vertrekken',TITLE+' · Opgave 7 · Boekpagina 60');
 table(s,[['Wortelen van dezelfde kwaliteit','Prijs per kg'],['Andere telers','€ 3,00'],['Mila wil vragen','€ 3,20']],60,244,1480,290,[910,570],39);
 text(s,'Kopers kennen de prijzen en kunnen elders kopen.',60,611,1480,72,42,{bold:true,color:C.blue});
 text(s,'Daarom verliest Mila in dit model haar kopers.',60,745,1480,72,40);
 notes(s,'60','Koppel de bronkenmerken in een redenering: dezelfde kwaliteit, veel andere kleine telers en bekende prijzen. Voor dezelfde wortelen betaalt een koper elders 3 euro in plaats van 3,20. Mila kan als kleine aanbieder de marktprijs niet naar 3,20 verhogen.', 'Welke informatie uit de bron maakt uitwijken mogelijk?', 'Alleen zeggen dat de prijs te hoog is of dat Mila prijsnemer is, laat de verklaring onvolledig.', 'Vergelijk tot slot de hoeveelheidsassen.');
}
{
 const s=slide('Opgave 7e: Q is de markt, q is Mila',TITLE+' · Opgave 7 · Boekpagina 60');
 table(s,[['De hele markt','Mila'],['Q = 4.000 kg per dag','q is haar eigen afzet'],['Alle telers samen','Capaciteit: 160 kg per dag'],['Linker hoeveelheidsas: × 1.000 kg','Rechter hoeveelheidsas: kg']],60,243,1480,371,[740,740],36);
 text(s,'Alleen de prijs verhuist naar Mila’s grafiek.',60,682,1480,70,44,{bold:true,color:C.blue});
 text(s,'Haar lijn eindigt bij q = 160, niet bij de markthoeveelheid.',60,778,1480,55,34);
 notes(s,'60','Het getal 4.000 hoort bij de som van alle telers. Mila heeft een eigen hoeveelheid q en kan maximaal 160 kg per dag produceren en verkopen. Daarom loopt haar opbrengstlijn tot q = 160. Het feit dat één teler meer produceert, betekent niet dat alle andere telers evenredig meer produceren.', 'Welke twee verschillende economische objecten beschrijven de assen?', 'Q en q verschillen in betekenis en in schaal, niet alleen in lettergrootte.', 'Laat één fout of ontbrekende uitleg verbeteren en noteer het huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({slides,overviewSlides,nativeTableSlides:[...new Set(tables)],nativeChartSlides:[...new Set(charts)],graphContracts,sourceManifest:'presentation-321.sources.json',...provenance},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'3.2.1 Volkomen concurrentie – presentatie.pptx'),pythonExecutable:PYTHON,
 integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...[...new Set(tables)].flatMap(i=>['--require-native-table-slide',String(i)])],
 fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:[...new Set(tables)],requiredNativeChartOwnerSlides:[...new Set(charts)],materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:p.slides.items.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
