// HOW TO ADAPT: change the adjacent manifest and lesson content together.
// Runtime locations are supplied through the installed presentation runtime.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('332');
const assignment=JSON.parse(await fs.readFile(new URL('./presentation-332.manifest.json',import.meta.url),'utf8'));
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#1A5276',green:'#1E8449',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',tables=[],charts=[],slides=[],graphSpecs=[];
const bookURL=`https://github.com/meijer1973/4veco-lessen/blob/${assignment.lessonCommit}/edities/books34-v3/books/book-3/`;
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer='§3.3.2 Wereldmarktprijs, import, export en welvaart'){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,90,50,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1380,30,21,{color:C.muted,name:'footer'});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title});return s;
}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 3, actuele v3-uitgave, gedrukte boekpagina ${page}. ${bookURL}output/Boek_3_Compleet_v3.pdf\nManuscript en antwoordmodel: ${bookURL}chapters/3.3/3.3.2%20manuscript.md en ${bookURL}chapters/3.3/Antwoorden.md\n${authored?'Uitlegvoorbeeld — niet uit het boek. Regenjassen in Mira, inclusief functies en getallen, zijn voor deze presentatie gemaakt. Het boek onderbouwt de methode, niet deze voorbeeldgegevens.':''}`);
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
 'Bespreken van de doelopgave: opgave 17.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,'Deze les: §3.3.2 Wereldmarktprijs,\nimport, export en welvaart',60,30,1480,112,46,{bold:true,name:'overview-title'});
 text(s,'Nu: '+phase,60,152,1480,42,30,{bold:true,color:C.blue,name:'phase'});rule(s,60,198,1480);
 text(s,'Lesroute',60,220,835,43,34,{bold:true});
 const ys=[276,363,410,457,645,717,777],hs=[80,43,43,177,66,48,48];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,220,568,43,34,{bold:true});
 text(s,'Prijzen vergelijken, productie en\nverbruik bepalen, handelsstromen\nen gevolgen voor groepen uitleggen.',972,276,568,120,30,{name:'overview-goals'});
 rule(s,972,405,568);text(s,'Startopdracht',972,426,568,43,34,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 102 · Opgaven 11 en 12\n12: verkennen met de theorie,\np. 97–98',972,481,568,113,30,{bold:active===2,name:'overview-start'});
 rule(s,972,608,568);text(s,'Huiswerk',972,627,568,43,34,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§3.3.2 · Opgaven 13 t/m 17\nBasis: 13 en 14\nZelfstandig: 15 en 16\nDoelopgave: 17\nMaken en nakijken',972,681,568,178,29,{bold:active===7,name:'overview-homework'});
 text(s,'Boek 3 · v3 · Gedrukte boekpagina’s',60,856,1380,28,21,{color:C.muted,name:'footer'});
 text(s,String(p.slides.items.length),1470,852,70,30,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title:'Deze les',phase});
 notes(s,'97–105',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. Start 11–12 staat op p. 102, basis 13 op p. 102 en 14 op p. 103, zelfstandig 15–16 op p. 104 en doel 17 op p. 105. Huiswerk is 13, 14, 15, 16 en 17 maken en nakijken. Bonus 18 en herhaling 19–20 zijn extra. Opgave 11 haalt invullen in een formule terug. Opgave 12 vraagt de nieuwe koppeling van verbruik en productie aan import. Laat leerlingen daarvoor p. 97–98 lezen en de betekenissen bij Qa, Qv en het verschil aanwijzen. Laat twijfel staan; dit is verkennen. Keer vóór de basisopgaven terug naar 12 en laat de leerling het antwoord met de nieuwe werkwijze verbeteren. Startantwoorden voor eventuele feedback na een poging: 11a Qv=60, Qa=20 producten per week, 11b Qv kopers en Qa producenten. 12a 40 kratten per week, 12b 70 is het verbruik inclusief binnenlandse productie. Het docentadvies reserveert voorlopig twee lessen van 55 minuten voor de volledige route; de tijd is niet gemeten. Schuif de lesgrens zo nodig, behoud alle basisopgaven.`,phase==='Startopdracht'?'Welke uitleg op p. 97–98 helpt je bij opgave 12?':'Welke stap uit je eigen werk kun je nu verbeteren?','De start is geen bewijs dat de nieuwe importbewerking al wordt beheerst.',active===7?'Laat het huiswerk noteren.':'Ga verder met de passende lesfase.');
}
function example(s){text(s,'Uitlegvoorbeeld — niet uit het boek',60,177,1480,43,30,{bold:true,color:C.blue});}
const model={id:'mira',qMax:180,pMax:48,qStep:30,pStep:6,dIntercept:36,dSlope:-0.2,aIntercept:12,aSlope:0.2,qUnit:'regenjassen per week',pUnit:'€ per regenjas'};
const targetModel={id:'noro',qMax:160,pMax:80,qStep:20,pStep:10,dIntercept:80,dSlope:-0.5,aIntercept:0,aSlope:0.5,qUnit:'matten per week',pUnit:'€ per mat'};
function graph(s,m,{price=null,guides=false,equilibrium=false,full=false}={}){
 const qEq=(m.dIntercept-m.aIntercept)/(m.aSlope-m.dSlope),pEq=m.aIntercept+m.aSlope*qEq;
 const dEnd=Math.min(m.qMax,-m.dIntercept/m.dSlope),aEnd=Math.min(m.qMax,(m.pMax-m.aIntercept)/m.aSlope);
 const make=(name,xValues,values,color,width=4,dashed=false)=>({name,xValues:xValues.map(v=>Number(v.toFixed(10))),values:values.map(v=>Number(v.toFixed(10))),line:{fill:color,width,...(dashed?{style:'dashed'}:{})},marker:{symbol:'none'}});
 const hiddenLabel=idx=>({idx,showValue:false,showSeriesName:false,showCategoryName:false});
 // Interior collinear anchors give both labels whitespace away from axes/plot edges.
 const dLabel=dEnd*.12,aLabel=aEnd*.88;
 const series=[make('V',[0,dLabel,dEnd],[m.dIntercept,m.dIntercept+m.dSlope*dLabel,m.dIntercept+m.dSlope*dEnd],C.blue),make('A',[0,aLabel,aEnd],[m.aIntercept,m.aIntercept+m.aSlope*aLabel,m.aIntercept+m.aSlope*aEnd],C.green)];
 series[0].dataLabelOverrides=[hiddenLabel(0),{idx:1,text:'V',position:'top',textStyle:{typeface:FONT,fontSize:29,fill:C.blue,bold:true}},hiddenLabel(2)];
 series[1].dataLabelOverrides=[hiddenLabel(0),{idx:1,text:'A',position:'top',textStyle:{typeface:FONT,fontSize:29,fill:C.green,bold:true}},hiddenLabel(2)];
 if(equilibrium){series.push(make('Evenwichtshoeveelheid',[qEq,qEq],[0,pEq],C.muted,2,true),make('Evenwichtsprijs',[0,qEq],[pEq,pEq],C.muted,2,true));}
 if(price!==null){const qa=(price-m.aIntercept)/m.aSlope,qv=(price-m.dIntercept)/m.dSlope;
  const pw=make('Wereldmarktprijs',[0,m.qMax],[price,price],C.orange,3,true);
  pw.dataLabelOverrides=[hiddenLabel(0),{idx:1,text:`Pw = ${price}`,position:'top',textStyle:{typeface:FONT,fontSize:26,fill:C.orange,bold:true}}];series.push(pw);
  if(guides){series.push(make('Productie',[qa,qa],[0,price],C.green,2,true),make('Verbruik',[qv,qv],[0,price],C.blue,2,true));}
 }
 const ch=s.charts.add('scatter',{position:{left:60,top:full?320:245,width:full?1480:1030,height:full?475:550},series,scatterOptions:{style:'line'},hasLegend:false,
  xAxis:{min:0,max:m.qMax,majorUnit:m.qStep,numberFormatCode:'0',title:{text:`Q (${m.qUnit})`,textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:{fill:C.line,width:1}},
  yAxis:{min:0,max:m.pMax,majorUnit:m.pStep,numberFormatCode:'0',title:{text:`P (${m.pUnit})`,textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:{fill:C.line,width:1}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 graphSpecs.push({slide:p.slides.items.length,model:m,price,guides,equilibrium,series});
}

overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const items=[['De prijs vergelijken','Wereldmarktprijs en prijs zonder handel.'],['Drie hoeveelheden onderscheiden','Binnenlandse productie, verbruik en handelsstroom.'],['Gevolgen uitleggen','Prijs, hoeveelheid en surplus van elke binnenlandse groep.']];
 items.forEach((a,i)=>{const y=223+i*183;text(s,a[0],60,y,640,108,39,{bold:true,color:C.blue});text(s,a[1],750,y,790,112,36);if(i<2)rule(s,60,y+144,1480);});
 notes(s,'97','De bestemming is opgave 17, inclusief de redenering per groep en de kleine-landaanname. Voor opgave 16 is ook export nodig. De betekenis van import en export is behandeld in §3.3.1 p. 88. We herhalen kort de techniek van een gegeven prijs invullen en het lezen van twee lijnen.','Wat kan het verschil zijn tussen wat een land maakt en wat het gebruikt?','Vraag en aanbod hoeven bij een gegeven wereldprijs niet binnenlands gelijk te zijn.','Baken het model af.');
}
{
 const s=slide('Een klein land neemt de wereldprijs over');
 text(s,'Pw = gegeven prijs op de wereldmarkt',60,190,1480,62,44,{bold:true,color:C.blue});
 table(s,[['Voorwaarde','Betekenis in dit model'],['Klein en prijsnemend','De handel van dit land verandert Pw niet.'],['Concurrerende markt','Veel kopers en verkopers, gelijkwaardige producten.'],['Handel is beschikbaar','Voldoende buitenlands aanbod én buitenlandse vraag.'],['Vaste overige omstandigheden','Euro’s, geen transportkosten of handelsbelemmeringen.']],60,290,1480,425,[515,965],31);
 text(s,'Welvaartsvergelijking: binnenlandse kopers en producenten, zonder effecten op derden.',60,753,1480,71,30,{bold:true});
 notes(s,'97','Bij §3.2.1 was één onderneming prijsnemer. Nu is het land klein ten opzichte van de wereldmarkt. Dat is een extra schaalniveau en een expliciete aanname. De binnenlandse vraaglijn blijft dalend. Een horizontale wereldprijslijn toont de gegeven handelsprijs. Alle volgende voorbeelden gebruiken deze voorwaarden.','Waarom kan een kleine importeur de wereldprijs niet zelf bepalen?','Klein gaat hier om invloed op de wereldmarkt, niet om landoppervlak. Pw is geen horizontale binnenlandse vraaglijn.','Bekijk één aparte oefenmarkt.');
}
{
 const s=slide('Regenjassen in Mira: zonder handel');example(s);graph(s,model,{equilibrium:true});
 text(s,'Qv = 180 − 5P\nQa = 5P − 60',1130,260,410,116,37,{bold:true});
 text(s,'Zonder handel\nP = € 24\nQ = 60 per week',1130,418,410,157,37,{bold:true,color:C.blue});
 text(s,'Productie = verbruik',1130,652,410,90,34);
 notes(s,'97–98','Mira verkoopt regenjassen. Dit is een nieuw uitlegvoorbeeld met eigen gegevens. P is euro per jas en Q regenjassen per week. Het model van de vorige dia geldt. Zonder handel: 180−5P=5P−60, dus 240=10P, P=24 en Q=60. De vraag wordt nul bij P=36; aanbod start bij P=12. De grafiek toont uitsluitend niet-negatieve hoeveelheden.','Welke twee hoeveelheden zijn zonder handel gelijk?','Gebruik Qv voor verbruik en Qa voor productie; dezelfde uitkomst zonder handel maakt de betekenissen niet gelijk.','Voeg een lagere wereldprijs toe.',true);
}
{
 const s=slide('Een wereldmarktprijs onder € 24');example(s);graph(s,model,{price:18});
 text(s,'Pw = € 18',1130,265,410,64,44,{bold:true,color:C.orange});
 text(s,'€ 18 < € 24',1130,390,410,64,43,{bold:true});
 text(s,'Binnenlandse prijs:\n€ 18 per regenjas',1130,515,410,117,36);
 text(s,'De lijnen blijven gelijk.',1130,692,410,87,34,{bold:true});
 notes(s,'97–98','De gegeven wereldprijs is lager dan de prijs zonder handel. Binnenlandse kopers kunnen gelijkwaardige jassen voor 18 euro importeren. Binnenlandse aanbieders kunnen onder de aannames geen hogere prijs handhaven. Dezelfde binnenlandse lijnen blijven gelden.','Waar lees je nu productie en verbruik af?','Los Qv=Qa niet opnieuw op voor de binnenlandse markt met handel. Zoek beide hoeveelheden bij de gegeven P.','Lees de twee snijpunten met de prijslijn.',true);
}
{
 const s=slide('Bij één prijs horen twee hoeveelheden');example(s);graph(s,model,{price:18,guides:true});
 text(s,'Op A: productie',1130,262,410,57,36,{bold:true,color:C.green});text(s,'Qa = 30',1130,325,410,64,45,{bold:true});
 text(s,'Op V: verbruik',1130,457,410,57,36,{bold:true,color:C.blue});text(s,'Qv = 90',1130,520,410,64,45,{bold:true});
 text(s,'Regenjassen per week',1130,690,410,88,33);
 notes(s,'97–98','Volg de lijn op 18 euro eerst naar A, dan verticaal naar de hoeveelheidsas: 30. Doe hetzelfde bij V: 90. Deze horizontale afstand moet van buiten het land komen. Benoem eerst grootheid en eenheid, daarna de uitkomst.','Welke lijn hoort bij wat Mira zelf maakt?','Het rechter snijpunt is in deze importgrafiek het verbruik. Het is niet de binnenlandse productie.','Controleer het aflezen met de functies.',true);
}
{
 const s=slide('Import is het ontbrekende deel');example(s);
 table(s,[['Grootheid','Invullen bij P = 18','Per week'],['Productie Qa','5 × 18 − 60','30 regenjassen'],['Verbruik Qv','180 − 5 × 18','90 regenjassen'],['Import','Qv − Qa = 90 − 30','60 regenjassen']],60,280,1480,350,[470,565,445],34);
 text(s,'Controle: 30 productie + 60 import = 90 verbruik',60,697,1480,95,42,{bold:true,color:C.blue});
 notes(s,'98 en 101','Modelleer het invullen expliciet: eerst 5×18, daarna optellen of aftrekken. Leg naast iedere berekening dezelfde hoeveelheid uit de grafiek. Import is het verschil, niet het totale verbruik. De controle verbindt de goederenstromen. Deze eigen voorbeeldcijfers werken geen van de toegewezen boekopgaven uit.','Waarom tel je import bij de binnenlandse productie op?','Een uitkomst in regenjassen per week is geen eurobedrag.','Herhaal de betekenis van surplus voordat je het gevolg beoordeelt.',true);
}
{
 const s=slide('Surplus: welk voordeel meten we?');
 table(s,[['Groep','Surplus in de marktgrafiek','Hoort bij'],['Binnenlandse kopers','CS: onder V en boven de betaalde prijs','Binnenlands verbruik Qv'],['Binnenlandse producenten','PS: boven A en onder de ontvangen prijs','Binnenlandse productie Qa']],60,249,1480,347,[420,645,415],33);
 text(s,'Totaal binnenlands surplus = CS + PS',60,670,1480,70,44,{bold:true,color:C.blue});
 notes(s,'100','Haal Boek 2 §§2.3.1–2.3.2 terug: CS is het verschil tussen betalingsbereidheid en prijs; PS is het verschil tussen prijs en marginale kosten van de geleverde binnenlandse eenheden. Bij handel hebben CS en PS verschillende rechtergrenzen. Bespreek de richting, een volledige oppervlakterekening is hier geen doel. Wie dit moeilijk vindt, laat eerst de prijs en bijbehorende Q aanwijzen in de vorige grafiek.','Tot welke hoeveelheid hoort CS, en tot welke hoeveelheid PS?','CS is geen teruggave van geld. PS is niet de volledige omzet of automatisch winst.','Vergelijk Mira met en zonder import.');
}
{
 const s=slide('Import: kopers winnen, producenten verliezen');example(s);
 table(s,[['Mira','Zonder handel','Met import'],['Prijs per regenjas','€ 24','€ 18'],['Binnenlands verbruik','60 per week','90 per week'],['Binnenlandse productie','60 per week','30 per week']],60,277,1480,348,[700,390,390],34);
 text(s,'Kopers: lagere prijs, meer verbruik. CS stijgt.',60,682,1480,63,38,{bold:true,color:C.blue});
 text(s,'Producenten: lagere prijs, minder productie. PS daalt.',60,756,1480,63,38,{bold:true,color:C.green});
 notes(s,'98 en 100','Vergelijk telkens met dezelfde beginsituatie zonder handel. Voor kopers wordt het verschil tussen betalingsbereidheid en prijs groter en komen aankopen erbij. Binnenlandse producenten ontvangen minder en leveren minder. De prijsverandering geeft bewegingen langs de lijnen, geen verschuiving.','Welke twee gegevens onderbouwen het nadeel voor producenten?','Meer totaal verbruik betekent niet dat binnenlandse producenten meer verkopen.','Bekijk een alternatief met een hogere wereldprijs.',true);
}
{
 const s=slide('Export bij een hogere wereldmarktprijs');example(s);graph(s,model,{price:30,guides:true});
 text(s,'Nieuwe situatie:\nPw = € 30 > € 24',1130,260,410,128,38,{bold:true,color:C.orange});
 text(s,'Qa = 90\nQv = 30',1130,429,410,124,40,{bold:true});
 text(s,'Export = Qa − Qv\n= 90 − 30 = 60\nregenjassen per week',1130,619,410,166,34,{bold:true});
 notes(s,'99','Begin opnieuw bij Mira zonder handel: P=24 en Q=60. De wereldprijs van 30 euro is een alternatief voor de importvariant, geen volgende stap op een tijdlijn. Qa=5×30−60=90; Qv=180−5×30=30. Export=90−30=60. Controle: 30 binnenlands verbruik plus 60 export is 90 productie. Buitenlandse vraag is voldoende. Binnenlandse kopers moeten dezelfde hogere prijs betalen.','Welke hoeveelheid staat bij export rechts: productie of verbruik?','De importformule levert hier een negatief getal. Benoem de richting en bereken export als Qa−Qv.','Vergelijk de gevolgen per groep.',true);
}
{
 const s=slide('Export: producenten winnen, kopers verliezen');example(s);
 table(s,[['Mira','Zonder handel','Met export'],['Prijs per regenjas','€ 24','€ 30'],['Binnenlandse productie','60 per week','90 per week'],['Binnenlands verbruik','60 per week','30 per week']],60,277,1480,348,[700,390,390],34);
 text(s,'Producenten: hogere prijs, meer productie. PS stijgt.',60,682,1480,63,38,{bold:true,color:C.green});
 text(s,'Kopers: hogere prijs, minder verbruik. CS daalt.',60,756,1480,63,38,{bold:true,color:C.blue});
 notes(s,'99–100','Export vergroot afzetmogelijkheden voor binnenlandse producenten, maar de hogere prijs geldt ook voor binnenlandse kopers. Leg het verband met de vorige grafiek en de voorwaarden van de handel.','Waarom betalen ook de binnenlandse kopers 30 euro?','Export is geen bewijs dat iedere inwoner voordeliger kan kopen.','Maak onderscheid tussen het totaal en de afzonderlijke groepen.',true);
}
{
 const s=slide('Een hoger totaal kan samengaan met verlies');
 table(s,[['Vergeleken met geen handel','Import bij lagere Pw','Export bij hogere Pw'],['Binnenlands CS','Stijgt','Daalt'],['Binnenlands PS','Daalt','Stijgt'],['Binnenlands CS + PS','Stijgt in dit model','Stijgt in dit model']],60,245,1480,389,[690,395,395],32);
 text(s,'Een gezamenlijke winst zegt niet dat iedere groep wint.',60,707,1480,93,43,{bold:true,color:C.blue});
 notes(s,'100','Onder de genoemde modelaannames weegt het voordeel van de ene binnenlandse groep zwaarder dan het verlies van de andere. Dit is de surplusmaatstaf uit het boek, geen totale meting van welzijn, banen of eerlijkheid. Er is geen compensatie afgesproken. Deze beperking sluit aan op §3.3.1 p. 90.','Welke groep kan verliezen terwijl CS+PS stijgt?','Tel richtingen niet mechanisch op zonder model: het totale resultaat volgt hier uit de genoemde concurrentie- en handelsaannames.','Controleer de grenssituatie met dezelfde voorbeeldmarkt.');
}
{
 const s=slide('Korte check: Pw is precies € 24');example(s);
 text(s,'Mira: Qv = 180 − 5P en Qa = 5P − 60',60,265,1480,66,41,{bold:true});
 text(s,'Hoeveel produceert en verbruikt Mira per week?',60,410,1480,102,43);
 text(s,'Is er import of export?',60,573,1480,87,43,{bold:true,color:C.blue});
 text(s,'Leg je antwoord uit met de twee hoeveelheden.',60,731,1480,69,34);
 notes(s,'97–101','Geef denktijd. Bij P=24: Qv=180−120=60 en Qa=120−60=60 per week. Het verschil is nul, dus geen import of export in dit model. Laat de uitleg horen, niet alleen de getallen. Ga terug naar de afleesstap als leerlingen Qa en Qv verwisselen.','Wat betekent een verschil van nul?','Een land dat kan handelen hoeft op deze markt niet per se een positieve handelsstroom te hebben.','Keer op het overzicht terug naar startopgave 12, daarna basis 13–14.',true);
}
overview('Oefenen en nakijken',4);
{
 const s=slide('Opgave 17: kampeermatten in Noro','§3.3.2 · Doelopgave 17 · Boekpagina 105');
 text(s,'Lesbron · Kampeermatten in Noro',60,190,1480,59,38,{bold:true,color:C.blue});
 text(s,'Noro is een klein land met concurrerende aanbieders. Binnenlandse en buitenlandse matten zijn gelijkwaardig.',60,281,1480,126,38);
 text(s,'Buitenlandse aanbieders leveren voldoende tegen € 30 per mat; Noro beïnvloedt die prijs niet.',60,427,1480,126,38);
 text(s,'Er zijn geen transportkosten, handelsbelemmeringen of effecten op derden. Alle prijzen zijn in euro.',60,573,1480,126,38);
 text(s,'Zonder handel kosten de matten € 40.',60,725,1480,72,40,{bold:true});
 notes(s,'105','Dit is de complete, echte lesbron bij opgave 17. Leerlingen hebben hun eigen poging gemaakt. Toon eerst bron, figuur en alle vragen zonder antwoorden. De markt en de eenheid veranderen van regenjassen naar kampeermatten.','Welke aannames noemt deze bron?','Gegevens van Mira gelden hier niet.','Toon de gegeven grafiek en vraag a.');
}
{
 const s=slide('Opgave 17a: figuur 7 en de vraag','§3.3.2 · Doelopgave 17 · Boekpagina 105');
 text(s,'Lees bij de wereldmarktprijs de binnenlandse productie en het binnenlandse verbruik af. Bereken de import per week. (3p)',60,178,1480,116,34);
 graph(s,targetModel,{price:30,full:true});
 notes(s,'105','Figuur 7 is bewerkbaar nagemaakt met dezelfde asschalen, lijnen en wereldprijs als de gedrukte opgave. De oorspronkelijke figuur toont geen afleeslijnen of importpijl. Ze zijn hier eveneens nog afwezig. Q is matten per week. Gebruik de gegeven prijslijn en asschalen.','Welk gegeven moet je gebruiken voor het aflezen?','Lees geen getallen uit de voorgaande voorbeeldmarkt over.','Toon eerst ook b tot en met e; nog geen antwoorden.');
}
{
 const s=slide('Opgave 17b–e: alle vervolgvragen','§3.3.2 · Doelopgave 17 · Boekpagina 105');
 const q=assignment.target.subquestions.slice(1);const ys=[197,347,480,674],hs=[122,106,174,126];
 q.forEach((a,i)=>{text(s,a.label+'.',60,ys[i],60,hs[i],36,{bold:true,color:C.blue});text(s,`${a.prompt} (${a.points}p)`,140,ys[i],1390,hs[i],36);});
 notes(s,'105','Alle vijf deelvragen zijn nu beschikbaar zonder antwoorden. Laat leerlingen zo nodig hun werk erbij leggen. b vraagt prijs én productie, c vraagt CS, d vraagt een oordeel met een concrete groep, e vraagt de prijsnemende aanname.','Welke gevraagde redenering ontbreekt nog in je eigen antwoord?','Een los getal is geen volledige verklaring.','Begin daarna pas de stapsgewijze bespreking van a.');
}
{
 const s=slide('17a: aflezen bij € 30','§3.3.2 · Antwoord op 17a · Boekpagina 105');graph(s,targetModel,{price:30,guides:true});
 text(s,'Productie op A',1130,259,410,58,37,{bold:true,color:C.green});text(s,'Qa = 60',1130,333,410,66,46,{bold:true});
 text(s,'Verbruik op V',1130,480,410,58,37,{bold:true,color:C.blue});text(s,'Qv = 100',1130,554,410,66,46,{bold:true});
 text(s,'Matten per week',1130,718,410,71,33);
 notes(s,'105','Volg Pw=30 naar A en vervolgens naar Q: 60 matten per week. Volg dezelfde prijs naar V: 100. Bij aflezen heeft elk snijpunt zijn eigen betekenis. Deze lijnen corresponderen met P=0,5Q en P=80−0,5Q, maar de opgave vraagt aflezen, niet het afleiden van functies.','Waarom gebruik je dezelfde prijs bij beide lijnen?','De 100 matten zijn het totale binnenlandse verbruik, niet de import.','Bereken het verschil en controleer de goederenstroom.');
}
{
 const s=slide('17a: import en controle','§3.3.2 · Antwoord op 17a · Boekpagina 105');
 table(s,[['Stap','Uitwerking'],['Opzet','Import = Qv − Qa'],['Invullen','Import = 100 − 60'],['Uitkomst','40 matten per week'],['Controle','60 productie + 40 import = 100 verbruik']],60,245,1480,448,[430,1050],37);
 text(s,'De wereldmarkt levert het verschil.',60,745,1480,65,40,{bold:true,color:C.blue});
 notes(s,'105','Antwoordmodel 17a: Qa=60, Qv=100, import 40 matten per week. Benoem de twee aflezingen, de aftrekking en de eenheid. Een import van 100 zou de binnenlandse productie negeren.','Hoe zie je aan de controle dat het antwoord klopt?','Import is geen verschil tussen twee prijzen.','Vergelijk nu de binnenlandse producenten met de situatie zonder handel.');
}
{
 const s=slide('17b: gevolgen voor binnenlandse producenten','§3.3.2 · Antwoord op 17b · Boekpagina 105');
 table(s,[['Noro','Zonder handel','Met import'],['Ontvangen prijs per mat','€ 40','€ 30'],['Binnenlandse productie','80 per week','60 per week']],60,280,1480,300,[700,390,390],35);
 text(s,'Een lagere prijs leidt tot minder binnenlandse productie.',60,664,1480,111,42,{bold:true,color:C.green});
 notes(s,'105','Zonder handel lees je het snijpunt van V en A: P=40, Q=80. Met import zijn P=30 en Qa=60. Producenten ontvangen dus minder per mat en leveren minder matten per week. Dat is een beweging langs dezelfde aanbodlijn. Hun PS daalt. Prijs en productie zijn allebei nodig voor deze deelvraag.','Waar lees je de productie zonder handel af?','Bij de vergelijking na import gebruik je Qa=60, niet Qv=100.','Bekijk de binnenlandse kopers.');
}
{
 const s=slide('17c: consumentensurplus stijgt','§3.3.2 · Antwoord op 17c · Boekpagina 105');
 table(s,[['Binnenlandse kopers','Zonder handel','Met import'],['Betaalde prijs per mat','€ 40','€ 30'],['Verbruik','80 per week','100 per week']],60,258,1480,309,[700,390,390],35);
 text(s,'Lagere prijs: meer voordeel ten opzichte van de betalingsbereidheid.',60,646,1480,116,41,{bold:true,color:C.blue});
 notes(s,'105','CS stijgt. Bestaande kopers betalen 10 euro minder per mat en er komen aankopen tussen 80 en 100 matten bij. Het gebied onder V en boven de prijs wordt groter. Het surplus hoort bij het binnenlands verbruik van 100, ook al worden 40 matten ingevoerd. Een oppervlakterekening is niet gevraagd.','Welk verband leg je tussen de betaalde prijs en betalingsbereidheid?','Een lagere prijs verlaagt hier de betaalde uitgaven per mat, niet de betalingsbereidheid zelf.','Beoordeel vervolgens de uitspraak over alle groepen.');
}
{
 const s=slide('17d: de conclusie over alle groepen is onjuist','§3.3.2 · Antwoord op 17d · Boekpagina 105');
 table(s,[['Binnenlandse groep','Gevolg van import in Noro'],['Kopers','CS stijgt.'],['Producenten','PS daalt: een lagere prijs en minder productie.']],60,258,1480,322,[560,920],37);
 text(s,'CS + PS stijgt, maar producenten verliezen surplus.',60,672,1480,116,43,{bold:true,color:C.orange});
 notes(s,'105','Beoordeel expliciet: de leerling heeft ongelijk. Binnenlandse producenten vormen het concrete tegenvoorbeeld. Hun nadeel verdwijnt niet doordat het voordeel van kopers groter is. Noem dus zowel oordeel als groep en reden. Er volgt ook geen compensatie uit deze optelling.','Welke concrete groep weerlegt de uitspraak?','Een hoger totaal is geen garantie dat elk onderdeel stijgt.','Verklaar ten slotte de vaste wereldmarktprijs.');
}
{
 const s=slide('17e: Noro is klein en prijsnemend','§3.3.2 · Antwoord op 17e · Boekpagina 105');
 text(s,'Brongegeven',60,240,540,66,40,{bold:true,color:C.blue});text(s,'Noro beïnvloedt de wereldprijs niet.',650,240,890,120,44,{bold:true});
 rule(s,60,399,1480);
 text(s,'Gevolg',60,455,540,66,40,{bold:true,color:C.blue});text(s,'Meer import door Noro verandert Pw in dit model niet.',650,455,890,179,43);
 text(s,'Dit is een modelaanname voor dit land.',60,737,1480,67,37,{bold:true});
 notes(s,'105','Noro is volgens de bron klein en prijsnemend. De handelsomvang van Noro is te klein om de gegeven wereldmarktprijs te beïnvloeden. Verwijs expliciet naar de bron. De redenering is geen algemeen bewijs voor elk land of elke wereldmarkt.','Welk zinsdeel uit de bron onderbouwt dit antwoord?','Concludeer niet dat extra wereldwijde vraag nooit invloed op een wereldprijs heeft.','Controleer de volledigheid van het eigen antwoord.');
}
{
 const s=slide('Antwoordcontrole bij opgave 17');
 const items=[['a','Productie 60, verbruik 100, import 40 matten per week.'],['b','Prijs € 40 naar € 30, productie 80 naar 60 per week.'],['c','CS stijgt: lagere prijs en meer binnenlands verbruik.'],['d','Producenten verliezen PS, ondanks een hoger totaal.'],['e','Noro is volgens de bron klein en prijsnemend.']];
 items.forEach((a,i)=>{const y=201+i*113;text(s,a[0]+'.',60,y,70,69,37,{bold:true,color:C.blue});text(s,a[1],155,y,1380,90,36);});
 text(s,'Verbeter een ontbrekende stap in je eigen antwoord.',60,780,1480,58,34,{bold:true});
 notes(s,'105','Laat leerlingen hun eigen aflezing, eenheden en verklaringen controleren. Een correct eindgetal is niet genoeg wanneer de redenering ontbreekt. Gebruik gerichte feedback per deelvraag en laat de leerling die zelf verwerken.','Welke verbetering kun je nu zelf aanbrengen?','Antwoorden overschrijven toont nog geen begrip.','Laat het afsluitende overzicht staan.');
}
overview('Afsluiting en huiswerk',7);

await fs.writeFile(BUILD+'/slides.json',JSON.stringify({slides,tables,charts,graphSpecs,overviewSlides:[1,14,25]},null,2));
await fs.writeFile(BUILD+'/presentation.json',JSON.stringify(p.toProto()));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,assignment.outputName+'.pptx'),pythonExecutable:PYTHON,
 integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],
 fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:p.slides.items.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
