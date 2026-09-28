// HOW TO ADAPT: derive the assignment and every worked operation from the new
// paragraph's current edition. Keep the shared overview and native chart data.
// Runtime locations come from the installed presentation runtime environment.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const facts=JSON.parse(await fs.readFile(path.join(HERE,'presentation-214.manifest.json'),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('214');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', tables=[], charts=[], slides=[], overviews=[], graphContracts=[];
const source=`https://github.com/meijer1973/4veco-lessen/blob/${facts.sourceCommit}/${facts.sourceEdition.split('/').map(encodeURIComponent).join('/')}/`;
const title='§2.1.4 Gemengde opgaven';
const targetFooter=title+' · Opgave 5 · Boekpagina 32–33';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(label,footer=title){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,label,60,42,1480,86,52,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title:label});return s;
}
function notes(s,page,explanation,question,pitfall,transition){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: leerlingenboek Boek 2, chatuitgave 2026, revisie 21 september 2026, gedrukte pagina ${page}. ${source}boek/Boek_2_Compleet.pdf\nAntwoordmodel: ${source}bronnen/H1/${encodeURIComponent('2.1 Kosten en opbrengsten – antwoorden.md')}\nDocentenroute: ${source}bronnen/H1/Docenten_en_bouwverantwoording.md`);
}
function table(s,values,x,y,w,h,widths,size=32){
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
 'Korte herhaling en aanpak.',
 'Werk verder aan de gemengde opgaven, stel vragen en kijk je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 5.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: '+title);overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{
  const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Gegevens kiezen en combineren.\nTabel en grafiek verbinden.\nEen uitspraak onderbouwen.',972,244,565,122,30,{name:'overview-goals'});
 rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 29\nOpgave 1',972,459,565,95,33,{bold:active===2,name:'overview-start'});
 rule(s,972,570,568);
 text(s,'Huiswerk',972,591,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§2.1.4 · Opgaven 1–7\nGemengd: 1–4 · Doel: 5\nBonus / denkertje: 6\nHerhaling: 7\nMaken en nakijken',972,650,565,184,30,{bold:active===7,name:'overview-homework'});
 notes(s,'29–34',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start met opgave 1 op pagina 29. Deze gemengde paragraaf heeft geen afzonderlijke begeleide basissectie. Leerlingen werken met 1–4 naar doel 5 op pagina 32–33. Bespreek SmoothBox omdat deze echte doeloefening bronselectie, functies, break-even, GTK, marginale verschillen en grafiekinterpretatie samenbrengt. De klasopdracht/huiswerkopdracht is alle opgaven 1, 2, 3, 4, 5, 6 en 7 maken en nakijken, met behoud van het boeklabel bonus/denkertje bij 6 en herhaling bij 7. In de algemene docentenroute zijn 6 en 7 aanvullend; deze presentatie volgt de classroom-afspraak om alle gemengde opgaven als huiswerk te noemen. Begroot indien nodig vervolgwerktijd.`,active===2?'Welke grootheid vraagt opgave 1?':'Bij welke stap wil je hulp?', 'Verwar bezoekers niet met verkochte producten. Het startpaginanummer is het gedrukte nummer 29, niet PDF-pagina 31.',active===7?'Laat leerlingen het huiswerk in de agenda zetten.':'Ga door naar de volgende lesfase wanneer de klas daaraan toe is.');
}
overview('Startopdracht',2);
{
 const s=slide('De aanpak bij gemengde opgaven');
 const rows=[['Gegevens kiezen','Welke dag, hoeveelheid, periode en eenheid?'],['Bewerking kiezen','Totaal, per product of per extra product?'],['Tabel en grafiek','Tabelwaarden en lijnhoogten beschrijven dezelfde bedragen.'],['Uitspraak beoordelen','Berekening, economische betekenis en conclusie.']];
 rows.forEach((r,i)=>{let y=205+i*148;text(s,r[0],60,y,550,62,39,{bold:true,color:C.blue});text(s,r[1],675,y,860,107,36);if(i<3)rule(s,60,y+119,1480);});
 notes(s,'29–33','Er komt geen nieuwe theorie bij. Haal de aanpak uit de voorgaande paragrafen terug. Bij SmoothBox kies je straks per vraag de juiste dag en bron. Een verklaring moet zeggen wat de berekende verandering betekent. De lesdoelen zijn relevante gegevens kiezen, kosten en opbrengsten combineren, een tabel met een grafiek verbinden en een uitspraak onderbouwen.','Hoe zie je of een vraag een totaal of een bedrag per product verlangt?','Dezelfde formule op alle vragen toepassen werkt niet.','Gebruik de startopgave als kort uitgewerkt voorbeeld.');
}
{
 const s=slide('ShirtSprint: gegevens en functies');
 text(s,'Opgave 1 · Eén schoolfeest, maximaal 300 shirts',60,188,1480,60,36,{bold:true,color:C.blue});
 table(s,[['Gegeven uit de bron','Bewerking'],['Kraam € 480 + vergunning € 120','TCK = € 600 voor het schoolfeest'],['Shirt € 4 + bedrukking/verpakking € 1','€ 5 per shirt'],['Verkoopprijs € 11 per shirt','TO = 11Q']],60,292,1480,338,[780,700],32);
 text(s,'TK = 600 + 5Q',60,674,700,74,45,{bold:true,color:C.orange});
 text(s,'TO = 11Q',850,674,690,74,45,{bold:true,color:C.blue});
 text(s,'600 bezoekers is geen gegarandeerde afzet.',60,782,1480,54,34);
 notes(s,'29','Na de startopdracht: tel de vaste bedragen en de variabele bedragen per shirt apart op. Q is het aantal gemaakte én verkochte shirts voor dit feest. TK en TO staan in euro voor het schoolfeest, geldig tot en met 300 shirts. De bezoekverwachting heb je niet nodig om de functies te maken.','Welke bedragen veranderen in totaal als er meer shirts komen?','Een vast bedrag per shirt betekent geen constante totale kosten.','Vul de gevraagde hoeveelheid in.');
}
{
 const s=slide('ShirtSprint: totaal en per shirt');
 text(s,'Bij Q = 150 shirts',60,198,1480,60,38,{bold:true,color:C.blue});
 table(s,[['Grootheid','Berekening','Uitkomst'],['TK','600 + 5 × 150','€ 1.350 voor het feest'],['TO','11 × 150','€ 1.650 voor het feest'],['Winst = TO − TK','1.650 − 1.350','€ 300 voor het feest'],['GTK = TK / Q','1.350 / 150','€ 9 per shirt']],60,299,1480,407,[480,470,530],32);
 text(s,'Winst is een totaalverschil. GTK is een bedrag per shirt.',60,766,1480,67,37,{bold:true});
 notes(s,'29','Werk steeds via formule, invullen en uitkomst met eenheid. De winst van 300 euro hoort bij alle 150 shirts samen. De gemiddelde totale kosten verdelen 1350 euro over 150 shirts.','Waarom deel je bij GTK wel door 150 en bij winst niet?','Eenheid euro per shirt hoort niet bij totale winst.','Zoek vervolgens waar de totale opbrengst alle kosten dekt.');
}
{
 const s=slide('ShirtSprint: break-even');
 const rows=[['TO = TK','Opbrengst dekt alle kosten'],['11Q = 600 + 5Q','Functies invullen'],['6Q = 600','Aan beide kanten 5Q aftrekken'],['Q = 600 / 6 = 100 shirts','Delen door 6']];
 rows.forEach((r,i)=>{let y=204+i*131;text(s,r[0],60,y,950,82,42,{bold:true,color:i===3?C.green:C.ink});text(s,r[1],1060,y+7,480,90,32);});
 text(s,'Controle: TO = TK = € 1.100 voor het feest. Winst = € 0.',60,766,1480,70,36,{bold:true,color:C.blue});
 notes(s,'29','Bij 100 shirts: TO = 11 × 100 = 1100; TK = 600 + 5 × 100 = 1100 euro. De uitkomst past binnen 300 shirts capaciteit. De kassa is niet leeg: er is 1100 euro verkoopopbrengst, maar die dekt precies de kosten.','Is break-even hetzelfde als geen verkoopopbrengst?','Winst nul betekent niet dat TO nul is.','Herhaal kort de marginale rekenstap uit een tabel.');
}
{
 const s=slide('Marginale bedragen: verschillen delen');
 text(s,'SkateService · Opgave 4 · Eén stap uit de tabel',60,188,1480,61,36,{bold:true,color:C.blue});
 table(s,[['Q (beurten per week)','TK (€ per week)','TO (€ per week)'],['10','260','400'],['20','320','800']],60,276,1480,228,[520,480,480],32);
 text(s,'MK = ΔTK / ΔQ = (320 − 260) / (20 − 10) = € 6',60,561,1480,64,38,{bold:true,color:C.orange});
 text(s,'MO = ΔTO / ΔQ = (800 − 400) / (20 − 10) = € 40',60,657,1480,64,38,{bold:true,color:C.blue});
 text(s,'Beide bedragen zijn per extra onderhoudsbeurt.',60,774,1480,54,36);
 notes(s,'31','De teller is het verschil tussen de totale bedragen, de noemer het verschil tussen de hoeveelheden. Δ betekent verandering. Bij een groep van tien gaat het om het gemiddelde extra bedrag per extra beurt binnen die stap. Dit is korte herhaling van §2.1.3 met één echte tabelstap, geen nieuwe theorie. De capaciteit van SkateService is 30 beurten per week.','Waarom deel je door tien en niet door twintig?','MK is niet TK / Q. Dat laatste is GTK.','Verbind vervolgens totalen met een grafiek.');
}
function line(name,xs,ys,color,width=4,style='solid',symbol='none',label=true){
 return {name,xValues:xs,values:ys,line:{fill:color,width,style},marker:{symbol,size:9,fill:color,line:{fill:color,width:1}},
 ...(label?{dataLabelOverrides:[{idx:xs.length-1,text:name,position:'r',showValue:false,showSeriesName:true,textStyle:{typeface:FONT,fontSize:27,bold:true,fill:color}}]}:{})};
}
function chart(s,series,{xmax=1200,xstep=200,ymax=5500,ystep=1000,unit='lunchboxen per dag',period='dag'}={}){
 const ch=s.charts.add('scatter',{position:{left:60,top:208,width:1080,height:614},series,scatterOptions:{style:'lineWithMarkers'},hasLegend:false,
  xAxis:{min:0,max:xmax,majorUnit:xstep,numberFormatCode:'#,##0',title:{text:`Q (${unit})`,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5}},
  yAxis:{min:0,max:ymax,majorUnit:ystep,numberFormatCode:'#,##0',title:{text:`TO en TK (€ per ${period})`,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:{fill:C.line,width:1}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 graphContracts.push({slide:p.slides.items.length,axes:{xmax,xstep,ymax,ystep,unit,period},series:series.map(({name,xValues,values})=>({name,xValues,values}))});
 return ch;
}
{
 const s=slide('FotoFun: winst is een verticale afstand');
 chart(s,[line('TO',[0,120],[0,720],C.blue),line('TK',[0,120],[240,480],C.orange,4,'dashed'),line('Winstafstand',[90,90],[420,540],C.green,7,'solid','none',false)],{xmax:150,xstep:30,ymax:800,ystep:200,unit:'foto’s per feest',period:'feest'});
 text(s,'Bij Q = 90',1190,233,350,60,35,{bold:true});
 text(s,'TO = € 540\nTK = € 420',1190,341,350,132,34);
 text(s,'Winst = € 120\nper feest',1190,509,350,130,36,{bold:true,color:C.green});
 text(s,'Dezelfde Q,\ntwee lijnhoogten.',1190,709,350,96,31);
 notes(s,'30','Dit is de grafiek van FotoFun uit opgave 2 met het verticale antwoordlijnstuk bij Q = 90. De volledige TK-lijn loopt van (0; 240) tot (120; 480), TO van (0; 0) tot (120; 720). De capaciteit is 120 foto’s. Lees bij dezelfde Q twee hoogten: 540 en 420 euro. Hun verschil is 120 euro winst. Dit bereidt de grafiekbewerking van SmoothBox voor.','Waarom kun je hier geen driehoek als winst inkleuren?','De verticale as bevat al totale eurobedragen. Een oppervlakte vermenigvuldigt ook met hoeveelheid.','Laat het overzicht staan tijdens zelfstandig werken.');
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 5 · SmoothBox',targetFooter);
 text(s,'Twee festivaldagen · Maximaal 1.000 lunchboxen per dag',60,187,1480,94,39,{bold:true,color:C.blue});
 text(s,'Alle gemaakte lunchboxen worden voor € 5 per stuk verkocht. Gebruik bij elke vraag het juiste dagmenu.',60,297,1480,104,37);
 text(s,'Bron A · Vrijdag: het gewone menu',60,450,1480,66,41,{bold:true});
 table(s,[['Gegeven','Vrijdag'],['Totale constante kosten','€ 1.200 per dag'],['Variabele kosten','€ 2 per lunchbox'],['Verwachte festivalbezoekers','4.000']],60,544,1480,256,[940,540],32);
 notes(s,'32','Begin de bespreking nadat leerlingen de doeloefening hebben geprobeerd. Laat eerst alle bronnen en alle zes deelvragen zien, zonder antwoorden. Deze bedragen gelden op vrijdag tot en met de capaciteit. Q is het aantal lunchboxen per dag.','Welk menu hoort bij bron A?','Dezelfde verkoopprijs op beide dagen betekent niet dat de kosten gelijk zijn.','Toon bron B van zaterdag.');
}
{
 const s=slide('Opgave 5 · Bron B: zaterdag',targetFooter);
 text(s,'Een ander menu · Constante kosten: € 1.200 per dag',60,188,1480,62,37,{bold:true,color:C.green});
 text(s,'Meer productie vraagt steeds meer betaald werk per extra lunchbox. De variabele kosten per lunchbox zijn niet steeds gelijk.',60,276,1480,110,35);
 table(s,[['Q (lunchboxen per dag)','TK zaterdag (€ per dag)','TO zaterdag (€ per dag)'],['700','2.600','3.500'],['800','2.900','4.000'],['900','3.250','4.500'],['1.000','3.650','5.000']],60,421,1480,337,[500,490,490],31);
 text(s,'Gebruik voor zaterdag deze totalen, niet de € 2 uit bron A.',60,784,1480,51,32,{bold:true});
 notes(s,'32','Lees de zaterdagtabel letterlijk. De constante kosten blijven 1200 euro per dag. De tabel beschrijft een ander menu met stijgende extra arbeidskosten. Beide dagen hebben dezelfde capaciteit van 1000.','Welke bron geeft je de totale zaterdagkosten?','Gebruik de vrijdagfunctie niet voor zaterdag. Trek de zaterdagtabel niet door naar onbekende hoeveelheden.','Toon de bijbehorende basisgrafiek.');
}
function smoothGraph(stage){
 const s=slide(stage===0?'Opgave 5 · Bron C: basisgrafiek':stage===1?'Opgave 5e · Break-even en positieve winst':'Opgave 5e · De winstafstand bij 700',targetFooter);
 const series=[line('TO',[0,1000],[0,5000],C.blue),line('TK vrijdag',[0,1000],[1200,3200],C.orange,4,'dashed'),line('TK zaterdag',[700,800,900,1000],[2600,2900,3250,3650],C.green,4,'dotted','circle')];
 if(stage>0)series.push(line('Break-even',[400],[2000],C.ink,0,'solid','diamond',false),line('Hulplijn Q',[400,400],[0,2000],C.muted,2,'dashed','none',false),line('Hulplijn bedrag',[0,400],[2000,2000],C.muted,2,'dashed','none',false));
 if(stage===2)series.push(line('Winstafstand',[700,700],[2600,3500],C.ink,7,'solid','none',false));
 chart(s,series);
 text(s,stage===0?'Beide dagen':stage===1?'Vrijdag':'Bij Q = 700',1190,231,350,64,35,{bold:true});
 text(s,stage===0?'Capaciteit:\n1.000 lunchboxen\nper dag':stage===1?'Break-even:\n(400; 2.000)':'TO = € 3.500\nTK = € 2.600',1190,333,350,151,31,{bold:true,color:C.blue});
 text(s,stage===0?'Zaterdag:\nalleen de vier\ntabelpunten':stage===1?'Positieve winst:\n400 < Q ≤ 1.000\n\nGehele aantallen:\n401 t/m 1.000':'Verticale afstand:\n€ 900 per dag\n\nOp beide dagen\nbij deze Q.',1190,567,350,245,31,{bold:true,color:stage===1?C.orange:C.green});
 notes(s,stage===0?'32':'32–33',stage===0?'De basisgrafiek bevat TO voor beide dagen, de volledige vrijdagkostenlijn en alleen de vier gegeven zaterdagpunten verbonden. De curves stoppen bij 1000. Break-even en winstmarkering ontbreken hier bewust: die zijn gevraagd. De verdere asruimte is alleen voor leesbare labels.':stage===1?'Markeer (400; 2000). Vrijdag is TO boven TK bij 400 < Q ≤ 1000. Bij gehele lunchboxen zijn dat 401 tot en met 1000 per dag. Het punt bij 400 zelf hoort niet bij positieve winst. Beide dagen en alle drie curves blijven zichtbaar; over ongegeven zaterdaghoeveelheden trekken we geen conclusie.':'Het verticale lijnstuk bij 700 loopt van 2600 naar 3500 euro per dag. Het verschil is 900. Op deze hoeveelheid vallen de kostenpunten van beide dagen samen. Een gelijk winstniveau bij 700 betekent niet dat de winst daarna even snel groeit.',stage===0?'Welke lijnen horen bij welke dag?':stage===1?'Waarom begint positieve winst pas rechts van 400?':'Kunnen twee dagen dezelfde winst hebben en toch verschillende winstgroei?', 'Alleen gegeven zaterdagpunten verbinden. Winst is een verticale afstand, geen oppervlakte.',stage===0?'Toon nu alle deelvragen voordat je de antwoorden bespreekt.':stage===1?'Bekijk de verticale winstafstand bij 700.':'Vergelijk nu de groei per extra lunchbox.');
}
smoothGraph(0);
{
 const s=slide('Opgave 5 · Vragen a, b en c',targetFooter);
 const questions=[['a','Selecteer uit bron A de constante kosten, de variabele kosten per lunchbox en de verkoopprijs. Leg uit welke totale kosten met Q veranderen en welke gelijk blijven. Noem ook het gegeven dat je niet nodig hebt voor TK en TO.'],['b','Stel voor vrijdag de functies voor TK en TO op. Bereken de break-even-afzet.'],['c','Bereken voor vrijdag bij Q = 700 de winst en GTK. Noteer de volledige eenheden.']];
 const ys=[205,493,660], hs=[243,128,150];
 questions.forEach(([letter,q],i)=>{text(s,letter+')',60,ys[i],60,60,39,{bold:true,color:C.blue});text(s,q,151,ys[i],1389,hs[i],37);});
 notes(s,'33','Lees de vragen letterlijk. Gebruik bij a, b en c vrijdag, bron A. Laat de leerlingen hun eigen uitwerking erbij houden. Bespreek nog geen uitkomsten.','Welke bron hoort bij deze drie vragen?','Bij GTK wordt om per lunchbox gevraagd, bij winst om een totaal per dag.','Toon vraag d en daarna e en f.');
}
{
 const s=slide('Opgave 5 · Vraag d',targetFooter);
 text(s,'d) Bereken met bron B voor elk van de drie stappen op zaterdag MK en MO per extra lunchbox. Laat bij iedere MK-berekening teller en noemer zien.',60,206,1480,207,41);
 table(s,[['Stap op zaterdag','Van Q','Naar Q'],['Eerste stap','700','800'],['Tweede stap','800','900'],['Derde stap','900','1.000']],60,473,1480,316,[780,350,350],34);
 notes(s,'33','De drie stappen moeten alle drie worden uitgewerkt. De tabel herhaalt alleen de hoeveelheden uit de bron en geeft nog geen marginale antwoorden. Vraag ook MO per extra lunchbox.','Welke twee rijen gebruik je voor iedere stap?','Het verschil tussen de totale kosten is nog niet MK per extra lunchbox.','Toon ook de grafiekvraag en de uitspraak.');
}
{
 const s=slide('Opgave 5 · Vragen e en f',targetFooter);
 text(s,'e)',60,203,60,60,39,{bold:true,color:C.blue});
 text(s,'Markeer in bron C het break-evenpunt van vrijdag. Geef ook aan voor welke vrijdaghoeveelheden de verticale winstafstand positief is. Vergelijk de groei van die winstafstand per extra lunchbox op vrijdag met de drie zaterdagstappen. Op welke dag en bij welke hoeveelheden groeit de positieve winstafstand het snelst? Onderbouw met MK en MO.',151,203,1389,325,36);
 rule(s,60,562,1480);
 text(s,'f)',60,607,60,60,39,{bold:true,color:C.blue});
 text(s,'Een leerling zegt: “Door de vaste verkoopprijs leveren alle extra groepen van honderd lunchboxen evenveel extra winst op.” Beoordeel de uitspraak met de drie zaterdagstappen. Bereken daarbij de extra winst per groep.',151,607,1389,206,36);
 notes(s,'33','Nu zijn alle context, gegevens en deelvragen zonder oplossing getoond. Bij e vergelijk je beide dagen. Bij f gebruik je zaterdag. De uitspraak moet met alle drie de extra winsten beoordeeld worden. Er wordt geen winstmaximaliserende productie gevraagd.','Welke vergelijking moet je bij e maken, en welke bij f?','Een grotere winst is iets anders dan een snellere groei van de winst.','Start pas nu de stapsgewijze bespreking van de antwoorden.');
}
{
 const s=slide('Opgave 5a–b · Vrijdag: gegevens en functies',targetFooter);
 table(s,[['Grootheid','Vrijdag','Reactie op Q'],['TCK','€ 1.200 per dag','Blijft gelijk'],['TVK','€ 2 per lunchbox × Q','Verandert met Q'],['Verkoopprijs','€ 5 per lunchbox','Blijft gelijk']],60,210,1480,329,[400,540,540],32);
 text(s,'TK = 1.200 + 2Q',60,594,750,73,45,{bold:true,color:C.orange});
 text(s,'TO = 5Q',895,594,645,73,45,{bold:true,color:C.blue});
 text(s,'Totalen in € per dag · 0 ≤ Q ≤ 1.000 lunchboxen per dag',60,694,1480,62,35,{bold:true});
 text(s,'4.000 bezoekers is niet nodig voor TK en TO.',60,780,1480,52,34);
 notes(s,'32–33','Kies de constante kosten, variabele kosten per lunchbox en de prijs uit bron A en de algemene context. TCK blijven 1200 euro, TVK = 2Q groeit mee. Alle gemaakte lunchboxen worden verkocht voor 5 euro, dus TO = 5Q. Bezoekers zijn geen gegarandeerde kopers.','Waarom tel je de constante kosten alleen bij TK op?','2 euro per lunchbox is niet TVK in euro per dag.','Los TO = TK op.');
}
{
 const s=slide('Opgave 5b · De break-even-afzet',targetFooter);
 const r=[['TO = TK','Opbrengst dekt alle kosten'],['5Q = 1.200 + 2Q','Functies invullen'],['3Q = 1.200','Aan beide kanten 2Q aftrekken'],['Q = 1.200 / 3 = 400','Lunchboxen per dag']];
 r.forEach((a,i)=>{let y=208+i*132;text(s,a[0],60,y,925,82,45,{bold:true,color:i===3?C.green:C.ink});text(s,a[1],1035,y+7,505,86,32);});
 text(s,'Controle: TO = 5 × 400 = € 2.000 per dag',60,750,1480,52,34,{bold:true,color:C.blue});
 text(s,'TK = 1.200 + 2 × 400 = € 2.000 per dag. Winst = € 0.',60,798,1480,43,30);
 notes(s,'33','De break-even-afzet is 400 lunchboxen per dag. Dit is een geheel aantal en past binnen de capaciteit van 1000. Controleer beide functies: beide geven 2000 euro per dag. Gebruik straks de coördinaten (400; 2000).','Wat zijn de twee coördinaten van het break-evenpunt?','400 is de hoeveelheid, niet het eurobedrag.','Bereken nu winst en GTK bij 700.');
}
{
 const s=slide('Opgave 5c · Vrijdag bij 700 lunchboxen',targetFooter);
 text(s,'TK = 1.200 + 2 × 700 = € 2.600 per dag',60,216,1480,74,44,{bold:true,color:C.orange});
 text(s,'TO = 5 × 700 = € 3.500 per dag',60,333,1480,74,44,{bold:true,color:C.blue});
 rule(s,60,459,1480);
 text(s,'Winst = TO − TK = 3.500 − 2.600',60,514,1480,69,41);
 text(s,'= € 900 per dag',60,587,1480,68,45,{bold:true,color:C.green});
 text(s,'GTK = TK / Q = 2.600 / 700 ≈ € 3,71 per lunchbox',60,735,1480,84,40,{bold:true});
 notes(s,'33','Winst is de totale opbrengst min alle kosten. GTK verdeelt de totale kosten over alle 700 lunchboxen. Rond GTK pas bij de uitkomst af op centen. Controle: winst plus kosten is 900 + 2600 = 3500 euro per dag.','Welke uitkomst is een totaal en welke is per lunchbox?','Winst is niet 900 euro per lunchbox. Gebruik vrijdag voor deze vraag.','Gebruik voor d de zaterdagtabel.');
}
{
 const s=slide('Opgave 5d · MK en MO op zaterdag',targetFooter);
 text(s,'MK = ΔTK / ΔQ     MO = ΔTO / ΔQ',60,184,1480,67,41,{bold:true,color:C.blue});
 table(s,[['Stap (lunchboxen)','MK (€ per extra lunchbox)','MO (€ per extra lunchbox)'],['700 naar 800','(2.900 − 2.600) /\n(800 − 700) = 3,00','(4.000 − 3.500) /\n(800 − 700) = 5,00'],['800 naar 900','(3.250 − 2.900) /\n(900 − 800) = 3,50','(4.500 − 4.000) /\n(900 − 800) = 5,00'],['900 naar 1.000','(3.650 − 3.250) /\n(1.000 − 900) = 4,00','(5.000 − 4.500) /\n(1.000 − 900) = 5,00']],60,297,1480,440,[380,550,550],30);
 text(s,'De extra kosten per lunchbox stijgen.\nDe extra opbrengst blijft € 5.',60,750,1480,87,34,{bold:true});
 notes(s,'32–33','Elke stap bevat honderd extra lunchboxen. De kostenverschillen zijn 300, 350 en 400 euro. Deel elk verschil door 100: MK is 3, 3,50 en 4 euro per extra lunchbox. De opbrengstverschillen zijn steeds 500, dus MO steeds 5. Het gaat om gemiddelde marginale bedragen binnen elke tabelstap, niet om afgeleiden.','Waarom verandert MK terwijl TCK gelijk blijven?','Hogere marginale kosten maken de totale constante kosten niet hoger.','Verbind de berekeningen met de grafiek.');
}
smoothGraph(1);smoothGraph(2);
{
 const s=slide('Opgave 5e · Waar groeit de winst sneller?',targetFooter);
 text(s,'Groei van de winst per extra lunchbox = MO − MK',60,188,1480,84,40,{bold:true,color:C.blue});
 table(s,[['Dag en hoeveelheid','MO − MK','Winstgroei per extra lunchbox'],['Vrijdag: 400 < Q ≤ 1.000','5 − 2','€ 3,00'],['Zaterdag: 700 naar 800','5 − 3','€ 2,00'],['Zaterdag: 800 naar 900','5 − 3,50','€ 1,50'],['Zaterdag: 900 naar 1.000','5 − 4','€ 1,00']],60,319,1480,351,[680,270,530],31);
 text(s,'Vrijdag groeit de positieve winstafstand het snelst:\nmeer dan 400 tot en met 1.000 lunchboxen per dag.',60,714,1480,113,39,{bold:true,color:C.orange});
 notes(s,'33','Vergelijk per extra lunchbox. Op vrijdag blijft het verschil 3 euro binnen de capaciteit. Voor positieve winst moet Q bovendien boven 400 liggen. Alle drie de gegeven zaterdagstappen zijn positief maar groeien met 2, 1,50 en 1 euro per extra lunchbox. Bij hele producten luidt het vrijdaggebied 401 tot en met 1000. Dit is alleen een vergelijking met de drie gegeven zaterdagstappen.','Waarom vergelijk je niet alleen de winst bij één Q?','Geen uitspraak over ongegeven zaterdaghoeveelheden of over de maximale winst buiten de capaciteit.','Bereken nu de extra winst per hele groep van honderd.');
}
{
 const s=slide('Opgave 5f · Gelijke extra omzet, andere winst',targetFooter);
 text(s,'Extra winst = ΔTO − ΔTK = (MO − MK) × ΔQ',60,188,1480,82,40,{bold:true,color:C.blue});
 table(s,[['Stap op zaterdag','Berekening extra winst','Extra winst per dag'],['700 naar 800','500 − 300 = (5 − 3) × 100','€ 200'],['800 naar 900','500 − 350 = (5 − 3,50) × 100','€ 150'],['900 naar 1.000','500 − 400 = (5 − 4) × 100','€ 100']],60,312,1480,350,[400,680,400],31);
 text(s,'De uitspraak is onjuist.',60,708,1480,60,43,{bold:true,color:C.orange});
 text(s,'Elke groep levert € 500 extra omzet, maar vraagt meer extra kosten.',60,785,1480,51,34);
 notes(s,'33','De extra opbrengst per honderd blijft 500 euro. De extra kosten stijgen van 300 naar 350 naar 400. Daarom daalt de extra winst van 200 naar 150 naar 100 euro per dag. Controle via winstniveaus: bij 700 is winst 900; bij 800 1100; bij 900 1250; bij 1000 1350. Hun verschillen zijn dezelfde drie bedragen.','Welke kant van de winstberekening negeert de uitspraak?','Extra omzet is geen extra winst. 200, 150 en 100 zijn totaalbedragen voor een groep, niet per lunchbox.','Laat leerlingen een ontbrekende stap in hun eigen antwoord verbeteren.');
}
{
 const s=slide('Antwoordcontrole bij SmoothBox');
 const rows=[['Bron en eenheid','Vrijdag bij a–c, zaterdag bij d en f, beide dagen bij e.'],['Berekeningen','Formule, ingevulde getallen en volledige eenheid.'],['Grafiek','(400; 2.000), positieve winst en de groei per extra lunchbox.'],['Redenering','Gelijke extra omzet geeft bij stijgende MK minder extra winst.']];
 rows.forEach((r,i)=>{let y=202+i*144;text(s,r[0],60,y,480,65,38,{bold:true,color:C.blue});text(s,r[1],595,y,940,108,36);});
 text(s,'Verbeter één ontbrekende stap of uitleg in je eigen antwoord.',60,788,1480,50,32,{bold:true});
 notes(s,'32–33','Laat leerlingen zelf controleren of a tot en met f volledig zijn. Kijk vooral naar de bronkeuze op zaterdag, de teller én noemer bij MK en de vergelijking per extra lunchbox bij e. Vraag een berekening plus economische betekenis.','Welke verbetering maakt jouw antwoord controleerbaar?','Juiste losse getallen zonder vergelijking of verklaring beantwoorden e en f niet volledig.','Laat het afsluitende overzicht staan.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...facts,slides,overviewSlides:overviews,tableSlides:tables,chartSlides:charts},null,2));
await fs.writeFile(path.join(BUILD,'graph-contracts.json'),JSON.stringify(graphContracts,null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(HERE,'presentation-214-chart-labels.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'2.1.4 Gemengde opgaven – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
