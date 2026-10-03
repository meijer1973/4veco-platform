import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

// HOW TO ADAPT: derive assignments and graph domains from the new paragraph;
// retain one shared overview and separate authored instruction from target feedback.
// Current teaching authority: Book 1, second edition 2026, not the legacy 1.3.1.
const HERE=path.dirname(fileURLToPath(import.meta.url));
const provenance=JSON.parse(await fs.readFile(path.join(HERE,'presentation-131-second-edition-2026-manifest.json'),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('131');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',title='§1.3.1 Aanbod en aanbodfactoren';
const source='https://github.com/meijer1973/4veco-lessen/blob/'+provenance.sourceCommit+'/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/edities/tweede-editie-2026/';
const tables=[],charts=[],slides=[],overviews=[],graphContracts=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(heading,footer=title){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,heading,60,42,1480,86,50,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1390,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title:heading});return s;
}
function notes(s,page,explanation,question,pitfall,transition,extra=''){
 explanation=explanation.replace(/(\p{L})(?=\d)/gu,'$1 ').replace(/(\d)(?=\p{L})/gu,'$1 ');
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 1, tweede editie 2026. Gedrukte complete-boekpagina ${page}. ${source}boek/Boek_1_Compleet_Tweede_editie.pdf\nManuscript en antwoordmodel: ${source}bronnen/H3/ (1.3.1 Aanbod en aanbodfactoren – paragraaf.md; Antwoorden.md).\n${extra}`);
}
function exampleNotes(s,page,explanation,question,pitfall,transition){
 notes(s,page,explanation,question,pitfall,transition,'Uitlegvoorbeeld — niet uit het boek. Context en getallen over Houtwerk zijn voor deze presentatie geschreven. De bronpagina’s onderbouwen de methode, niet deze gegevens. Oud: q = 3P − 12, 4 ≤ P ≤ 16. Nieuw na duurdere houtprijs: q = 3P − 18, 6 ≤ P ≤ 16. q in houders per week, P in euro per houder. Eigen prijs van 8 naar 12; verder verandert er niets.');
}
function exampleLabel(s){text(s,'Uitlegvoorbeeld — niet uit het boek',60,178,1480,42,29,{bold:true,color:C.blue});}
function table(s,values,x,y,w,h,widths,size=33){
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
 'Bespreken van de doelopgave: opgave 9.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: '+title);overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1480,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Aanbod uitleggen en berekenen.\nBewegen en verschuiven onderscheiden.\nPlannen en verkoop uit elkaar houden.',972,244,565,122,30,{name:'overview-goals'});
 rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 90 · Opgaven 1 en 2\n2: verkennen, theorie p. 86 en 89',972,459,565,100,30,{bold:active===2,name:'overview-start'});
 rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§1.3.1\nBasis: 3, 4 en 5\nZelfstandig: 6, 7 en 8\nDoelopgave: 9\nMaken en nakijken',972,654,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'86, 89–94',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start 1–2 op p. 90; basis 3 op p. 90 en 4–5 op p. 91; zelfstandig 6–7 op p. 92 en 8 op p. 93; doel 9 op p. 94. Huiswerk: 3, 4, 5, 6, 7, 8 en 9 maken en nakijken. Bonus 10 en herhaling 11 zijn extra. De volledige route hoeft niet in één les af.\n\nStart 1 haalt substitutie en terugrekenen op uit §1.2.1, gedrukte pp. 48–50. Antwoorden: q = 12 stuks per maand; P = 5 euro per stuk, controle 18 − 2 × 5 = 8. Start 2 gebruikt nieuwe aanbodtaal: laat leerlingen p. 86 lezen (willen en kunnen aanbieden; nog geen verkoop) en stap 4 van het voorbeeld op p. 89. Laat hen de voorraad in de context als al aanwezige onderdelen herkennen. Behandel de poging als verkenning en laat twijfel noteren. Na de uitleg keren leerlingen terug naar opgave 2 en verbeteren hun reden vóór het basiswerk: aanbodplan 5 vervangingen deze middag, voorraad 8 binnenbanden op dit moment, werkelijke verkoop 3 vervangingen deze middag. Vraag steeds welke grootheid en periode bij een getal horen.`,active===2?'Welke vraag lukt al, en waar helpt de theorie?':active===4?'Hoe kun je opgave 2 nu verbeteren?':'Welke opgaven maak en controleer je thuis?','Een voorraad op één moment is geen hoeveelheid aangeboden dienstverlening per middag.',active===7?'Laat het huiswerk in de agenda zetten.':'Ga verder met de bijbehorende lesfase.','Alle pagina’s verwijzen naar de gedrukte complete tweede editie. Voorkennisbron: '+source+'bronnen/H2/');
 return s;
}

function line(name,xValues,values,color,width=4,style='solid',symbol='none',labels=[]){
 return {name,xValues,values,fill:color,line:{fill:color,width,style},marker:{symbol,size:10},dataLabelOverrides:labels.map(a=>({idx:a.idx,text:a.text,position:a.position||'top',showValue:false,textStyle:{typeface:FONT,fontSize:28,bold:true,fill:color}}))};
}
function guide(name,q,price){return line(name,[0,q,q],[price,price,0],C.muted,1.7,'dashed');}
function point(name,q,price,pos='left',color=C.ink){return line(name,[q],[price],color,0,'solid','circle',[{idx:0,text:name,position:pos}]);}
function graph(s,key,stage){
 const m=key==='target'?{a:4,b0:-40,b1:-52,min0:10,min1:13,max:30,oldP:20,newP:24,xmax:80,xstep:20,ymax:32,ystep:8,unit:'tassen per maand',punit:'€ per tas'}:{a:3,b0:-12,b1:-18,min0:4,min1:6,max:16,oldP:8,newP:12,xmax:42,xstep:6,ymax:18,ystep:2,unit:'houders per week',punit:'€ per houder'};
 const q0=P=>m.a*P+m.b0,q1=P=>m.a*P+m.b1;
 let series=[];
 // Stage 0: source line; 1: table-to-line; 2: movement; 3: shift at old price; 4: combined.
 if(stage===1)series.push(guide('Aflezen bij P = '+m.oldP,q0(m.oldP),m.oldP));
 if(stage===2||stage===4)series.push(guide('R-hulplijnen',q0(m.oldP),m.oldP),guide('S-hulplijnen',q0(m.newP),m.newP));
 if(stage===3)series.push(guide('Oud bij dezelfde prijs',q0(m.oldP),m.oldP),guide('Nieuw bij dezelfde prijs',q1(m.oldP),m.oldP));
 series.push(line('A₀',[0,q0(m.max)],[m.min0,m.max],C.green,4,'solid','none',[{idx:1,text:'A₀',position:'top'}]));
 if(stage>=3)series.push(line('A₁',[0,q1(m.max)],[m.min1,m.max],C.orange,4,'solid','none',[{idx:1,text:'A₁',position:'top'}]));
 if(stage===1)series.push(point('B',12,8,'top'));
 if(stage===2||stage===4)series.push(point('R',q0(m.oldP),m.oldP,'top'),point('S',q0(m.newP),m.newP,'top',C.green));
 if(stage===3)series.push(point('O',q0(m.oldP),m.oldP,'top',C.green),point('N',q1(m.oldP),m.oldP,'top',C.orange));
 if(stage===4)series.push(guide('T-hulplijn',q1(m.newP),m.newP),point('T',q1(m.newP),m.newP,'top',C.orange));
 const ch=s.charts.add('scatter',{position:{left:60,top:248,width:1030,height:560},series,scatterOptions:{style:'lineWithMarkers'},hasLegend:false,
  xAxis:{min:0,max:m.xmax,majorUnit:m.xstep,numberFormatCode:'0',title:{text:`q (${m.unit})`,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}},
  yAxis:{min:0,max:m.ymax,majorUnit:m.ystep,numberFormatCode:'0',title:{text:`P (${m.punit})`,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:{fill:C.line,width:1}},
  chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 graphContracts.push({slide:p.slides.items.length,key,stage,model:m,series:series.map(({name,xValues,values})=>({name,xValues,values}))});
 return m;
}

overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const rows=[['Aanbod uitleggen','Willen én kunnen aanbieden bij een prijs.'],['Met een functie rekenen','Hoeveelheid, prijs en eenheden controleren.'],['Een verandering verklaren','Eigen verkoopprijs of een aanbodfactor?'],['Een grafiek aanvullen','De nieuwe lijn en de juiste punten tekenen.']];
 rows.forEach((a,i)=>{let y=208+i*145;text(s,a[0],60,y,590,60,39,{bold:true,color:C.blue});text(s,a[1],710,y,830,103,37);if(i<3)rule(s,60,y+117,1480);});
 notes(s,'86–89','Koppel de doelen aan de latere doeloefening. Leerlingen kennen vraagfuncties, maar aanbod heeft een andere actor en een andere reactie op de eigen prijs. Leg aanbod opnieuw uit; neem dit niet als al beheerste stof aan.','Wie neemt hier het besluit: een koper of een verkoper?','Een aangeboden hoeveelheid is geen bewezen afzet.','Maak het onderscheid tussen een plan, een voorraad en een verkoop concreet.');
}
{
 const s=slide('Aanbodplan, voorraad en verkoop');exampleLabel(s);
 text(s,'Houtwerk maakt houten telefoonhouders.',60,248,1480,60,39,{bold:true});
 table(s,[['Wat beschrijft het getal?','In dit voorbeeld'],['Voorraad op dit moment','20 houders staan klaar.'],['Aanbodplan bij € 8 per houder','12 houders per week willen én kunnen leveren.'],['Werkelijke verkoop deze week','7 houders gekocht door klanten.']],60,355,1480,355,[670,810],34);
 text(s,'Aanbod vergelijkt zulke plannen bij verschillende prijzen.',60,770,1480,62,38,{bold:true,color:C.green});
 exampleNotes(s,'86 en 89','Begin bij de verkoper. Bij € 8 wil en kan hij 12 houders leveren in de week. De voorraad is wat op een bepaald moment al aanwezig is. Tijdens de week kan hij ook produceren. Daarom is voorraad niet automatisch de grens van een aanbodfunctie voor de week. Er worden volgens onze afzonderlijke aanname 7 gekocht. Het aanbodplan alleen bepaalt dat niet.','Welk getal gaat over wat er nu ligt, en welk getal over een plan?','Tel de voorraad en het aanbodplan niet op. Zij meten verschillende dingen.','Vergelijk nu meerdere mogelijke verkoopprijzen, terwijl andere omstandigheden gelijk blijven.');
}
{
 const s=slide('Dezelfde aanbodplannen in een formule');exampleLabel(s);
 text(s,'Houtwerk: q = 3P − 12',60,247,1480,70,48,{bold:true,color:C.green});
 text(s,'q: houders per week     P: euro per houder     4 ≤ P ≤ 16',60,335,1480,60,34);
 table(s,[['P (€ per houder)','4','8','12','16'],['q (houders per week)','0','12','24','36']],60,433,1480,196,[560,230,230,230,230],35);
 text(s,'Bij € 8: q = 3 × 8 − 12 = 12 houders per week',60,680,1480,75,41,{bold:true});
 text(s,'Houtprijs, techniek en beschikbare werktijd blijven gelijk.',60,785,1480,47,32);
 exampleNotes(s,'87–88','Lees eerst de variabelen en het geldigheidsgebied. 3P betekent 3 maal P. Bij 8 is de uitkomst 12. Ceteris paribus: de andere omstandigheden blijven gelijk. De functie geldt alleen voor 4 tot en met 16 euro. Gebruik een negatieve uitkomst daarbuiten niet als negatief aanbod. Dit model zegt ook niet hoeveel kopers kopen.','Welke grootheid vul je in, en welke grootheid krijg je terug?','De 12 in de formule is geen vaste voorraad. Het minteken past bij de prijsgrens van dit model.','Zet de tabelpunten op de assen.');
}
{
 const s=slide('Van tabel naar aanbodlijn');exampleLabel(s);graph(s,'example',1);
 text(s,'Een punt is (q; P)',1130,265,410,58,35,{bold:true,color:C.blue});
 text(s,'Bij € 8:\nB = (12; 8)',1130,360,410,116,39,{bold:true});
 text(s,'Twee lijnpunten:\n(0; 4) en (36; 16)',1130,520,410,118,34);
 text(s,'Horizontaal: hoeveelheid\nVerticaal: prijs',1130,690,410,113,31,{bold:true});
 exampleNotes(s,'87; voorkennis 48 en 51','Kies regelmatige assen: q horizontaal en P verticaal. Het punt bij P=8 is (12;8), niet (8;12). Reken twee verschillende punten uit. De gegeven rechte functie loopt van (0;4) tot (36;16). Verbind ze binnen de geldige grenzen. Lees ter controle vanaf P=8 horizontaal naar de lijn en verticaal naar q=12. Een aanbodlijn vat meerdere mogelijke plannen samen.','Waarom staat het prijsgetal als tweede in de coördinaten?','Een stijgende lijn is hier aanbod van één verkoper; zij is geen vraaglijn.','Verander alleen de eigen verkoopprijs.');
}
{
 const s=slide('Een hogere eigen prijs: langs dezelfde lijn');exampleLabel(s);graph(s,'example',2);
 text(s,'€ 8 wordt € 12',1130,265,410,60,36,{bold:true});
 text(s,'R = (12; 8)\nS = (24; 12)',1130,373,410,130,38,{bold:true,color:C.green});
 text(s,'+€ 4 per houder\n+12 houders per week',1130,550,410,123,34);
 text(s,'De 3 betekent:\n3 extra houders per week\nper euro prijsstijging.',1130,709,410,117,30,{bold:true});
 exampleNotes(s,'87','Vul beide prijzen in dezelfde functie in: 3×8−12=12 en 3×12−12=24. Alleen de verkoopprijs verandert. De lijn blijft liggen. De coëfficiënt 3 geeft de verandering in hoeveelheid per euro prijsstijging, niet de helling dP/dq van de getekende inverse lijn. Op deze assen is die helling 1/3 euro per extra houder. Een hogere opbrengst per houder maakt extra productie in dit model aantrekkelijk.','Welke omstandigheden blijven gelijk tussen R en S?','Een hogere eigen prijs verschuift de lijn niet. Het punt verandert.','Reken ook terug van een hoeveelheid naar de bijbehorende prijs.');
}
{
 const s=slide('Van een hoeveelheid terug naar de prijs');exampleLabel(s);
 text(s,'Welke prijs past bij 21 houders per week?',60,245,1480,70,41,{bold:true,color:C.blue});
 const rows=[['21 = 3P − 12','Vul q = 21 in.'],['33 = 3P','Tel aan beide kanten 12 op.'],['P = 11','Deel beide kanten door 3.']];
 rows.forEach((a,i)=>{let y=364+i*125;text(s,a[0],60,y,655,68,46,{bold:true});text(s,a[1],790,y+7,750,71,34);});
 text(s,'€ 11 per houder. Controle: 3 × 11 − 12 = 21.',60,766,1480,65,38,{bold:true,color:C.green});
 exampleNotes(s,'87; rekenmethode 49–50','Dit is de bekende terugrekenbewerking nu in een aanbodfunctie. Vul de hoeveelheid links in, houd de gelijkheid in stand met dezelfde bewerking aan beide kanten en controleer in de oorspronkelijke functie. P=11 ligt binnen 4≤P≤16. De eenheid is euro per houder, niet houders per week. Dit bereidt de zelfstandige inverse vraag in opgave6 voor zonder haar uit te werken.','Wat doe je aan beide kanten om −12 weg te werken?','Verwissel een gegeven hoeveelheid niet met de gevraagde prijs.','Verander nu de prijs van het hout, niet die van de houder.');
}
{
 const s=slide('Duurder hout: vergelijken bij dezelfde prijs');exampleLabel(s);
 text(s,'Nieuwe omstandigheden: hout wordt duurder.',60,250,1480,63,39,{bold:true});
 table(s,[['Bij P = € 8 per houder','Functie','Aanbod'],['Oude houtprijs','q = 3P − 12','3 × 8 − 12 = 12'],['Nieuwe houtprijs','q = 3P − 18','3 × 8 − 18 = 6']],60,368,1480,280,[520,420,540],34);
 text(s,'6 houders per week minder bij dezelfde verkoopprijs',60,698,1480,65,40,{bold:true,color:C.orange});
 text(s,'Nieuwe functie: geldig voor 6 ≤ P ≤ 16.',60,786,1480,46,32);
 exampleNotes(s,'88–89','Een houder is het eindproduct; hout is een productiemiddel. Vergelijk eerst dezelfde verkoopprijs van8 in beide functies. De nieuwe houtprijs verlaagt het aanbod van12 naar6 per week. Niet alleen één punt verandert: in dit model is het bij elke gemeenschappelijke prijs6 minder. De nieuwe lijn verschuift naar links. Bij dezelfde hoeveelheid is een hogere verkoopprijs nodig.','Waarom houden we de verkoopprijs hier op € 8?','Een productiemiddelprijs en de eigen productprijs zijn verschillende oorzaken.','Bereken twee punten om de nieuwe lijn te tekenen.');
}
{
 const s=slide('De nieuwe lijn tekenen en controleren');exampleLabel(s);graph(s,'example',3);
 text(s,'A₁: q = 3P − 18',1130,258,410,60,35,{bold:true,color:C.orange});
 text(s,'P = 6 geeft q = 0\nP = 16 geeft q = 30',1130,350,410,114,32);
 text(s,'Punten:\n(0; 6) en (30; 16)',1130,490,410,119,36,{bold:true});
 text(s,'Controle bij € 8:\nO: oud 12, N: nieuw 6\nhouders per week',1130,665,410,132,32);
 exampleNotes(s,'88–89; grafiekmethode 48 en 51','Bereken voor de nieuwe functie eerst twee punten: bij6 nul en bij16 dertig. Zet (0;6) en (30;16) in hetzelfde assenstelsel en verbind ze. De nieuwe lijn stopt bij de gegeven maximale prijs16. Vergelijk bij8 de hoeveelheden12 en6. Minder bij dezelfde prijs betekent naar links. Een derde controlepunt toont of de getekende lijn bij de functie past. De assenschalen zijn gelijk aan de vorige grafiek.','Welke twee waarden bepalen de nieuwe rechte lijn?','Teken de nieuwe lijn niet op goed geluk evenwijdig. Bepaal punten uit de functie.','Bekijk de andere aanbodfactoren en het verschil tussen één aanbieder en de markt.');
}
{
 const s=slide('Andere omstandigheden kunnen het aanbod veranderen');
 table(s,[['Verandering','Bij dezelfde verkoopprijs'],['Productiemiddelen worden duurder.','Minder aanbod: de lijn naar links.'],['Een betere techniek maakt meer productie mogelijk.','Meer aanbod: de lijn naar rechts.'],['Er komen aanbieders op de markt bij.','Meer marktaanbod: de lijn naar rechts.']],60,207,1480,391,[850,630],34);
 text(s,'q: één aanbieder',60,660,685,65,42,{bold:true,color:C.green});
 text(s,'Qₐ: alle aanbieders samen',790,660,750,65,42,{bold:true,color:C.blue});
 text(s,'Extra aanbieders veranderen niet vanzelf het plan van één bestaande aanbieder.',60,766,1480,74,34);
 notes(s,'88 en 92; voorkennis 68–69','Vergelijk telkens alleen de genoemde verandering. Bij dezelfde eigen verkoopprijs kan de hele lijn verschuiven. Het aantal aanbieders is een factor voor de markt. Leg de nieuwe notatie Qₐ uit: de subscript a betekent aanbod. Het idee van optellen bij dezelfde prijs is bekend uit collectieve vraag op pp68–69. Gebruik hier geen extra afgeleide aanbodfunctie. Vraag en aanbod zijn beide plannen, maar van andere actoren.','Bij welke rij moet je nadrukkelijk naar alle aanbieders samen kijken?','Meer verkopers hoeft het individuele aanbodplan q niet te veranderen. Noem de specifieke oorzaak; zeg niet alleen dat de markt verandert.','Combineer nu twee veranderingen in ons afzonderlijke uitlegvoorbeeld.');
}
{
 const s=slide('Twee veranderingen: de effecten apart berekenen');exampleLabel(s);
 text(s,'Houderprijs: € 8 naar € 12. Tegelijk wordt hout duurder.',60,245,1480,73,39,{bold:true});
 table(s,[['Situatie','Berekening','q per week'],['Begin: oude prijs en oude functie','3 × 8 − 12','12'],['Alleen hogere verkoopprijs','3 × 12 − 12','24'],['Daarna ook duurdere houtprijs','3 × 12 − 18','18']],60,363,1480,343,[740,450,290],33);
 text(s,'+12 door de houderprijs, −6 door het hout: netto +6.',60,760,1480,70,40,{bold:true,color:C.orange});
 exampleNotes(s,'89','Scheid de oorzaken. Eerst varieer je de verkoopprijs op de oude lijn:12 naar24, dus+12. Daarna vergelijk je bij dezelfde nieuwe prijs12 de oude met de nieuwe functie:24 naar18, dus−6. Uiteindelijk18, dus6 meer dan de beginhoeveelheid12. Dezelfde −6 vonden we bij de oude prijs; dat komt door de gegeven parallelle functies, niet door een algemene regel dat elk kosteneffect bij elke prijs even groot is.','Welke prijs en welke functie horen bij de laatste rij?','De tussenstap is een gedachte-experiment. Zij hoeft niet als werkelijke tussenweek te hebben plaatsgevonden.','Plaats de drie berekende situaties in één grafiek.');
}
{
 const s=slide('De drie situaties in één grafiek');exampleLabel(s);graph(s,'example',4);
 text(s,'R: oud',1130,264,410,54,36,{bold:true});text(s,'(12; 8)',1130,321,410,57,38);
 text(s,'S: alleen eigen prijs',1130,416,410,54,32,{bold:true,color:C.green});text(s,'(24; 12)',1130,470,410,60,38);
 text(s,'T: beide veranderingen',1130,570,410,54,32,{bold:true,color:C.orange});text(s,'(18; 12)',1130,624,410,60,38);
 text(s,'Aangeboden is nog\nniet verkocht.',1130,733,410,92,33,{bold:true});
 exampleNotes(s,'89','R ligt op de oude lijn bij8. S ligt nog op de oude lijn, maar bij12. T gebruikt de nieuwe lijn en de nieuwe prijs. De beweging R naar S en het verschil S naar T verbeelden verschillende oorzaken. Vergelijk S en T horizontaal bij prijs12. Controleer T in de nieuwe functie:3×12−18=18. Dit zijn aangeboden hoeveelheden, geen marktevenwicht en geen gegarandeerde verkopen.','Waarom ligt S nog op A₀, terwijl T op A₁ ligt?','Dezelfde eigen prijs van S en T maakt het mogelijk de houtverandering apart te herkennen.','Laat leerlingen de aanpak in woorden controleren, daarna hun startantwoord verbeteren.');
}
{
 const s=slide('Korte controle: wat kun je zonder getallen zeggen?');exampleLabel(s);
 text(s,'Een hogere houderprijs én duurder hout.',60,264,1480,82,48,{bold:true});
 text(s,'Je kent de grootte van beide effecten niet.',60,388,1480,64,38);
 text(s,'Is de uiteindelijke aangeboden hoeveelheid\nzeker groter dan eerst?',60,515,1480,147,47,{bold:true,color:C.blue});
 text(s,'Benoem eerst de twee oorzaken en hun richting.',60,740,1480,70,36);
 exampleNotes(s,'88–89','Dit is een korte begripscontrole op het uitlegvoorbeeld, geen nieuwe huiswerkopgave. Vraag eerst individueel na te denken. Antwoord: niet zeker. De hogere houderprijs vergroot q langs A. Duurder hout vermindert het aanbod bij dezelfde prijs en verschuift A naar links. De effecten werken tegen elkaar, maar de grootte ontbreekt. In de doorgerekende versie was het netto+6; dat resultaat geldt niet zonder die gegevens.','Welke informatie ontbreekt om het netto-effect vast te stellen?','Richting van een verschuiving alleen bepaalt het uiteindelijke verschil niet als ook de eigen prijs verandert.','Keer terug naar startopgave2: laat de nieuwe begrippen met een reden toepassen. Zet daarna het overzicht klaar voor het basiswerk.');
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 9 · Atelier Sprint',title+' · Doelopgave · Boekpagina 94');
 text(s,'Eén atelier maakt sporttassen.',60,194,1480,70,44,{bold:true});
 table(s,[['Aanbodfunctie','Geldig voor'],['Eerst: q = 4P − 40','10 ≤ P ≤ 30'],['Nieuw: q = 4P − 52','13 ≤ P ≤ 30']],60,312,1480,262,[910,570],39);
 text(s,'q: tassen per maand. P: euro per tas.',60,617,1480,64,36);
 text(s,'De verkoopprijs stijgt van € 20 naar € 24.\nTegelijk wordt stof duurder. Verder verandert er niets.',60,724,1480,113,38,{bold:true});
 notes(s,'94','Dit zijn de complete context, functies, geldigheidsgebieden, eenheden en veranderingen van de echte doelopgave9. Laat eigen werk erbij pakken. Er volgen eerst de gegeven grafiek en alle deelvragen, zonder uitwerking.','Wat hoort bij de oude situatie, en wat verandert er?','q betreft één atelier en tassen per maand. Dit is geen markt- of evenwichtsvraag.','Toon de beginlijn uit de opgave.');
}
{
 const s=slide('Opgave 9 · De gegeven beginlijn',title+' · Opgave 9 · Boekpagina 94');graph(s,'target',0);
 text(s,'Aanbod van één\ntassenatelier',1130,263,410,107,36,{bold:true});
 text(s,'Gebruik de gegeven\nbeginlijn; voeg de\nnieuwe lijn en alle\nmarkeringen zelf toe.',1130,425,410,222,35);
 text(s,'A₀: q = 4P − 40',1130,743,410,64,34,{bold:true,color:C.green});
 notes(s,'94','De native grafiek bevat precies de gegevens van figuur8: q-as0–80, prijs-as0–32, A₀ van(0;10) tot(80;30), met de oorspronkelijke eenheden. Geen nieuwe lijn of gevraagde R/S/T-markeringen wordt hier onthuld. De native grafiek is een bewerkbare reconstructie van de bronfiguur.','Welke lijn en welke markeringen moet je zelf toevoegen?','De assen verwisselen verandert de betekenis van alle coördinaten.','Toon alle deelvragen voor het bespreken van oplossingen.');
}
{
 const s=slide('Opgave 9 · Deelvragen a, b en c',title+' · Opgave 9 · Boekpagina 94');
 text(s,'a. Bereken q vóór de veranderingen en na alleen de verkoopprijsstijging. Wat betekent de 4 in de functie?',60,207,1480,139,39);
 rule(s,60,386,1480);
 text(s,'b. Welke factor verschuift A? Bereken ter vergelijking het nieuwe aanbod bij de oude prijs van € 20.',60,427,1480,145,39);
 rule(s,60,613,1480);
 text(s,'c. Teken A₁. Markeer R (oud), S (alleen hogere verkoopprijs) en T (beide veranderingen), met hun coördinaten.',60,657,1480,168,39);
 notes(s,'94','De drie deelvragen zijn onverkort overgenomen. Laat leerlingen nog geen klassikale oplossing zien. Voor c zijn zowel de nieuwe lijn als alle drie punten met coördinaten vereist.','Wat vraagt c naast het tekenen van een lijn?','Een eindpunt zonder uitleg van de twee oorzaken dekt de opgave nog niet.','Toon ook d en e voordat de uitwerking begint.');
}
{
 const s=slide('Opgave 9 · Deelvragen d en e',title+' · Opgave 9 · Boekpagina 94');
 text(s,'d. Bereken de uiteindelijke hoeveelheid en de verandering ten opzichte van het begin. Leg uit hoe de effecten samenwerken of tegenwerken.',60,231,1480,220,43);
 rule(s,60,500,1480);
 text(s,'e. Beoordeel: “De hogere verkoopprijs verschuift de aanbodlijn naar rechts.”',60,560,1480,183,45);
 notes(s,'94','Nu zijn de complete context, bronfiguur en alle vijf deelvragen beschikbaar voordat een antwoord is getoond. Bespreek pas hierna de uitwerkingen. Bij d horen zowel nettoverandering als de verklaring van twee effecten; e vraagt een oordeel met reden.','Welke grootheid vergelijk je met het begin?','Alleen zeggen dat iets onjuist is, geeft nog geen economische verklaring.','Begin de uitwerking bij de oude functie en beide verkoopprijzen.');
}
{
 const s=slide('Opgave 9a · Alleen de verkoopprijs veranderen',title+' · Opgave 9 · Boekpagina 94');
 text(s,'Oude functie: q = 4P − 40',60,209,1480,70,43,{bold:true,color:C.green});
 text(s,'Vóór de veranderingen',60,322,1480,52,33,{bold:true});
 text(s,'q = 4 × 20 − 40 = 40 tassen per maand',60,393,1480,72,44);
 text(s,'Na alleen de verkoopprijsstijging',60,527,1480,52,33,{bold:true});
 text(s,'q = 4 × 24 − 40 = 56 tassen per maand',60,598,1480,72,44);
 text(s,'De 4: per euro prijsstijging 4 extra tassen per maand.',60,763,1480,72,39,{bold:true,color:C.blue});
 notes(s,'94','Gebruik voor beide gevallen de oude functie. 4×20−40=40; 4×24−40=56. Het verschil is16. Een euro prijsstijging vergroot in dit model de aangeboden hoeveelheid met4 tassen per maand, bij gelijke overige omstandigheden. Controle:4 euro extra maal4 tassen per euro geeft16 tassen extra. Beide prijzen passen binnen10≤P≤30.','Waarom gebruik je hier nog niet de nieuwe functie?','De coëfficiënt4 is geen hoeveelheid van4 tassen zonder prijsverandering.','Plaats de twee combinaties op dezelfde oude lijn.');
}
{
 const s=slide('Opgave 9a en c · R en S op de oude lijn',title+' · Opgave 9 · Boekpagina 94');graph(s,'target',2);
 text(s,'R = (40; 20)',1130,289,410,65,39,{bold:true});
 text(s,'S = (56; 24)',1130,409,410,65,39,{bold:true,color:C.green});
 text(s,'Prijs omhoog:\nmeer aangeboden\nop dezelfde lijn.',1130,557,410,170,37);
 notes(s,'94','R=(40;20) is de oude situatie. S=(56;24) gebruikt de nieuwe verkoopprijs en oude omstandigheden. Controleer beide punten in q=4P−40. De prijsbeweging verandert het aanbodplan, niet de aanbodfunctie.','Welk punt beschrijft alleen de hogere verkoopprijs?','S is nog niet de einduitkomst omdat de stofprijs nog niet is meegenomen.','Onderzoek de stofverandering eerst bij de oude verkoopprijs.');
}
{
 const s=slide('Opgave 9b · Duurdere stof verschuift het aanbod',title+' · Opgave 9 · Boekpagina 94');
 text(s,'Factor: de prijs van stof, een productiemiddel',60,218,1480,105,43,{bold:true,color:C.orange});
 text(s,'Vergelijk bij dezelfde oude verkoopprijs van € 20.',60,369,1480,80,39);
 text(s,'Nieuw: q = 4 × 20 − 52 = 28 tassen per maand',60,496,1480,83,44,{bold:true});
 text(s,'28 − 40 = −12 tassen per maand',60,633,1480,78,43);
 text(s,'Minder aanbod bij dezelfde prijs: A verschuift naar links.',60,774,1480,60,38,{bold:true,color:C.orange});
 notes(s,'94','De specifieke factor is de prijs van stof. Vul de oude verkoopprijs20 in de nieuwe functie4P−52 in. De uitkomst28 is12 lager dan de oude40. De stofverandering maakt produceren bij dezelfde verkoopprijs minder aantrekkelijk. Controle:4×20−52=28 en20 ligt ook in het nieuwe geldigheidsgebied13–30.','Waarom vergelijk je hier met40 en niet met56?','28 is de nieuwe aangeboden hoeveelheid bij de oude prijs. Het is niet de eindhoeveelheid bij24.','Bepaal twee punten van A₁ en daarna het uiteindelijke punt T.');
}
{
 const s=slide('Opgave 9c · De nieuwe lijn en punt T berekenen',title+' · Opgave 9 · Boekpagina 94');
 text(s,'A₁: q = 4P − 52, voor 13 ≤ P ≤ 30',60,209,1480,74,43,{bold:true,color:C.orange});
 table(s,[['Prijs P','Invullen in de nieuwe functie','Punt (q; P)'],['13','q = 4 × 13 − 52 = 0','(0; 13)'],['30','q = 4 × 30 − 52 = 68','(68; 30)']],60,336,1480,286,[260,800,420],35);
 text(s,'T gebruikt beide veranderingen: P = 24 en A₁.',60,666,1480,65,38);
 text(s,'q = 4 × 24 − 52 = 44, dus T = (44; 24).',60,763,1480,70,42,{bold:true});
 notes(s,'94','Teken A₁ door de berekende eindpunten van het gegeven prijsgebied. De lijn loopt niet buiten13≤P≤30. T volgt uit de nieuwe prijs in de nieuwe functie:44. Controleer dat T tussen de eindpunten ligt. De eenheid van44 is tassen per maand;24 is euro per tas.','Waarom heb je voor A₁ aan twee berekende punten genoeg?','T hoort op A₁. Wie24 in de oude functie invult, vindt S in plaats van T.','Toon de volledige nieuwe lijn en de drie punten samen.');
}
{
 const s=slide('Opgave 9c · De complete tekening',title+' · Opgave 9 · Boekpagina 94');graph(s,'target',4);
 text(s,'R = (40; 20)\nOude situatie',1130,257,410,120,37,{bold:true});
 text(s,'S = (56; 24)\nAlleen eigen prijs',1130,433,410,120,36,{bold:true,color:C.green});
 text(s,'T = (44; 24)\nBeide veranderingen',1130,611,410,125,35,{bold:true,color:C.orange});
 notes(s,'94','De volledige figuur heeft A₀ van(0;10) tot(80;30), A₁ van(0;13) tot(68;30), R(40;20), S(56;24) en T(44;24). Elke reeks gebruikt numerieke q-waarden. De prijs- en hoeveelheidsschalen zijn identiek aan de beginfiguur en de vorige targetgrafiek. Vergelijk S met T bij24:12 minder door duurdere stof. T ligt rechts van R qua hoeveelheid, maar dat maakt de verschuiving van A niet rechtswaarts.','Hoe kunnen er uiteindelijk meer tassen aangeboden worden terwijl A naar links verschuift?','Verwar een nettoverandering van q tussen R en T niet met de richting van de hele lijn.','Zet de twee tegengestelde hoeveelheidseffecten naast elkaar.');
}
{
 const s=slide('Opgave 9d · Een netto toename van vier tassen',title+' · Opgave 9 · Boekpagina 94');
 text(s,'Uiteindelijk: q = 4 × 24 − 52 = 44 tassen per maand',60,202,1480,94,41,{bold:true});
 table(s,[['Effect','Verschil (tassen per maand)'],['Hogere verkoopprijs','56 − 40 = +16'],['Duurdere stof, bij dezelfde nieuwe prijs','44 − 56 = −12'],['Samen ten opzichte van het begin','44 − 40 = +4']],60,354,1480,349,[980,500],35);
 text(s,'De stijging van 16 is groter dan de daling van 12.',60,766,1480,74,39,{bold:true,color:C.blue});
 notes(s,'94','Herhaal eerst het juiste eindgetal44. Netto44−40=+4. De prijsstijging alleen geeft+16, de stofprijs−12 bij dezelfde prijs. Controle:40+16−12=44. De positieve bijdrage is in absolute waarde groter dan de negatieve, waardoor de uiteindelijke aangeboden hoeveelheid stijgt. Dit bewijst geen stijging van de werkelijke verkoop.','Welke controle verbindt beginhoeveelheid, beide effecten en eindhoeveelheid?','Zonder de gegeven groottes kon je bij tegengestelde effecten geen netto-richting bepalen.','Beoordeel nu de uitspraak over de richting van de aanbodlijn.');
}
{
 const s=slide('Opgave 9e · De oorzaak bepaalt de verandering',title+' · Opgave 9 · Boekpagina 94');
 text(s,'“De hogere verkoopprijs verschuift de aanbodlijn naar rechts.”',60,224,1480,136,44,{bold:true});
 text(s,'Onjuist',60,409,1480,73,52,{bold:true,color:C.orange});
 text(s,'Hogere tasprijs: beweging van R naar S langs A₀.',60,538,1480,93,40,{bold:true,color:C.green});
 text(s,'Duurdere stof: aanbodlijn A₀ verschuift naar links, naar A₁.',60,686,1480,105,40,{bold:true,color:C.orange});
 notes(s,'94','De uitspraak is onjuist omdat de eigen verkoopprijs de positie op een gegeven lijn verandert. Duurdere stof is de factor die de aanbodlijn verandert. Geef dit causale onderscheid, niet alleen een oordeel. Laat leerlingen een ontbrekende coördinaat, eenheid of reden in hun eigen antwoord verbeteren.','Welke prijs hoort bij het eindproduct en welke bij een productiemiddel?','De uiteindelijke hoeveelheid44 is groter dan40, maar A₁ ligt bij dezelfde prijs links van A₀.','Zet het huiswerk in de agenda met het vaste overzicht.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...provenance,slides,overviewSlides:overviews,nativeTables:tables,nativeCharts:charts,graphContracts},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,provenance.outputStem+'.pptx'),pythonExecutable:PYTHON,
 integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',
 layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],
 fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,
 receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,overviewSlides:overviews,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
