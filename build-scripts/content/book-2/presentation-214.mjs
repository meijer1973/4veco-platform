// HOW TO ADAPT: change the paragraph manifest, authored example and source-led
// lesson sequence together. Keep the overview shared and questions before answers.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const assignment=JSON.parse(await fs.readFile(path.join(HERE,'presentation-214.manifest.json'),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('214');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',title='§2.1.4 Gemengde opgaven',exampleLabel='Uitlegvoorbeeld — niet uit het boek';
const base=`https://github.com/meijer1973/4veco-lessen/blob/${assignment.sourceCommit}/`+assignment.sourceEdition.split('/').map(encodeURIComponent).join('/')+'/';
const tables=[],charts=[],slides=[],graphContracts=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(label,footer=title){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,label,60,42,1480,86,52,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title:label});return s;
}
function notes(s,page,explanation,question,pitfall,transition,{example=false}={}){
 const provenance=example?`Eigen uitlegvoorbeeld: Badgebalie op een verenigingsdag. Context en alle getallen zijn voor deze les gemaakt, niet afkomstig uit een boekopgave. Methode: ${assignment.teachingExample.methodSources}.`:`Leerlingenboek Boek 2, chatuitgave 2026, gedrukte pagina ${page}.`;
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: ${provenance}\n${base}boek/Boek_2_Compleet.pdf\nAntwoordmodel bij de echte boekopgaven: ${base}boek/Boek_2_Compleet_Antwoorden.pdf`);
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){
  t.rows[r].height=h/values.length;
  for(let c=0;c<values[0].length;c++){
   const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
   cell.text.style={typeface:FONT,fontSize:size,color:r===0?C.paper:C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
  }
 }
 tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift,\npen en rekenmachine.',
 'Maak de startopdracht.',
 'Korte herhaling en aanpak.',
 'Werk verder aan de gemengde opgaven, stel vragen en kijk je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 5.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: '+title);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,342,402,466,600,684,774],hs=[88,48,48,116,78,73,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Bron en grootheid kiezen;\nrekenen en grafieken verbinden;\nuitspraken onderbouwen.',972,244,565,122,31,{name:'overview-goals'});
 rule(s,972,374,568);
 text(s,'Startopdracht',972,400,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 29\nOpgave 1',972,452,565,90,33,{bold:active===2,name:'overview-start'});
 rule(s,972,552,568);
 text(s,'Huiswerk',972,577,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§2.1.4 · Opgaven 1 t/m 7\nZelfstandig: 1 t/m 4 · Doel: 5\n6: Bonus / Denkertje\n7: Herhaling\nMaken en nakijken',972,632,565,196,30,{bold:active===7,name:'overview-homework'});
 notes(s,'29–34',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. Start: opgave 1 op gedrukte pagina 29 (fysieke PDF-pagina 31). Er is geen afzonderlijke basis-/begeleide sectie. De route is 1–4 zelfstandig combineren, doel 5 SmoothBox (bronnen p. 32, vragen p. 33), 6 Bonus/Denkertje en 7 Herhaling (p. 34). Conform de gemengde-opgavenroute is huiswerk 1 tot en met 7 maken en nakijken, inclusief de herkenbare bonus- en herhalingslabels. Laat de docent ondersteuning geven waar nodig; er is geen nieuwe theorie. De hele route hoeft niet binnen één les af te zijn.`,active===2?'Welke grootheid wordt bij de startvraag gevraagd?':'Welke berekening of verklaring wil je nog verbeteren?','De bron noemt geen aparte basisopgaven. Verzin daarvoor geen nieuwe indeling.',active===7?'Laat de klas het huiswerk in de agenda noteren.':'Ga naar de volgende lesfase als de klas eraan toe is.');
}
function line(name,xValues,values,col,width=4,style='solid',symbol='none'){
 return {name,xValues,values,line:{fill:col,width,style},marker:{symbol,size:9,fill:col,line:{fill:col,width:1}}};
}
function chart(s,series,{example=false}={}){
 const settings=example?{xmax:150,xstep:20,ymax:500,ystep:100,unit:'badges per dag'}:{xmax:1350,xstep:200,ymax:5500,ystep:1000,unit:'lunchboxen per dag'};
 const ch=s.charts.add('scatter',{position:{left:60,top:230,width:1110,height:587},series,scatterOptions:{style:'lineWithMarkers'},hasLegend:false,
  xAxis:{min:0,max:settings.xmax,majorUnit:settings.xstep,numberFormatCode:'#,##0',title:{text:`Q (${settings.unit})`,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5}},
  yAxis:{min:0,max:settings.ymax,majorUnit:settings.ystep,numberFormatCode:'#,##0',title:{text:'TO en TK (€ per dag)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:{fill:C.line,width:1}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 graphContracts.push({slide:p.slides.items.length,...settings,series:series.map(({name,xValues,values})=>({name,xValues,values}))});
}
const targetFooter=title+' · Opgave 5 · Boekpagina 32–33';
const friday=()=>[line('TO',[0,1000],[0,5000],C.blue),line('TK vrijdag',[0,1000],[1200,3200],C.orange,4,'dashed'),line('TK zaterdag',[700,800,900,1000],[2600,2900,3250,3650],C.green,4,'dotted','circle')];

overview('Startopdracht',2);
{
 const s=slide('De gevraagde grootheid');
 table(s,[['De vraag gaat over…','Aanpak','Eenheid'],['Alle producten samen','TK, TO; winst = TO − TK','€ per periode'],['Gemiddeld per product','GTK = TK / Q','€ per product'],['Een extra groep producten','MK = ΔTK / ΔQ; MO = ΔTO / ΔQ','€ per extra product'],['Geen winst en geen verlies','TO = TK oplossen','Q: aantal producten']],60,200,1480,443,[450,635,395],31);
 text(s,'Eerst de juiste bron en periode, dan de berekening.',60,697,1480,62,39,{bold:true,color:C.blue});
 text(s,'Uitkomst → economische betekenis → conclusie',60,782,1480,52,34);
 notes(s,'29','Haal de methoden uit §§2.1.1–2.1.3 kort op. Δ betekent verandering tussen twee hoeveelheden. Een totaal, gemiddelde en marginaal bedrag beantwoorden verschillende vragen. Bij GTK moet Q positief zijn. Benoem de relevante bron, periode en capaciteit voordat leerlingen een formule kiezen. Lesdoelen: bronselectie, combineren van kosten en opbrengsten, tabellen en grafieken verbinden, en conclusies onderbouwen binnen de gegevens.','Welke woorden in de vraag maken duidelijk of je een totaal of een bedrag per extra product zoekt?','Een kostenverschil is nog geen MK als de stap uit meer dan één product bestaat.','Gebruik nu een apart klein uitlegvoorbeeld om de keuzes te laten zien.');
}
{
 const s=slide('Uitlegvoorbeeld · Badgebalie',exampleLabel);
 text(s,'Eén verenigingsdag · maximaal 120 badges · alles wordt verkocht',60,185,1480,55,34,{bold:true,color:C.blue});
 text(s,'Vaste kosten: € 96 per dag · Materiaal: € 1,20 per badge\nVerkoopprijs: € 3,60 per badge',60,265,1480,110,36);
 text(s,'TK = 96 + 1,20Q          TO = 3,60Q',60,403,1480,62,42,{bold:true});
 table(s,[['Q (badges per dag)','TK (€ per dag)','TO (€ per dag)','Winst (€ per dag)'],['80','96 + 1,20 × 80 = 192','3,60 × 80 = 288','288 − 192 = 96'],['100','96 + 1,20 × 100 = 216','3,60 × 100 = 360','360 − 216 = 144']],60,505,1480,285,[345,400,365,370],31);
 notes(s,'', 'Dit is een eigen uitlegvoorbeeld, geen toegewezen boekopgave. De vaste dagkosten veranderen niet met Q; de totale materiaalkosten zijn 1,20Q. Werk de eerste rij hardop uit: TK = 96 + 1,20 × 80 = 192; TO = 3,60 × 80 = 288; winst = 288 − 192 = 96 euro per dag. De tweede rij ondersteunt de volgende vergelijking. Alle gemaakte badges worden verkocht binnen dezelfde dag en capaciteit.','Welk gegeven vermenigvuldig je met Q, en welk gegeven niet?','€ 1,20 per badge is niet de totale kostenfunctie: de vaste dagkosten horen er ook bij.','Vergelijk gemiddeld per badge met per extra badge.',{example:true});
}
{
 const s=slide('Uitlegvoorbeeld · Gemiddeld en marginaal',exampleLabel);
 text(s,'Bij 80 badges: TK = € 192 per dag',60,190,1480,54,35,{bold:true,color:C.blue});
 text(s,'GTK = TK / Q = 192 / 80 = € 2,40 per badge',60,270,1480,80,44,{bold:true});
 rule(s,60,385,1480);
 text(s,'Stap van 80 naar 100 badges: ΔQ = 20 badges',60,422,1480,56,35,{bold:true,color:C.blue});
 text(s,'MK = (216 − 192) / 20 = € 1,20 per extra badge\nMO = (360 − 288) / 20 = € 3,60 per extra badge',60,512,1480,157,41);
 text(s,'Extra winst = (3,60 − 1,20) × 20 = € 48 per dag',60,728,1480,72,41,{bold:true,color:C.green});
 notes(s,'','GTK verdeelt alle 192 euro over alle 80 badges. MK en MO gaan alleen over de verschillen tussen 80 en 100. Teller MK = 24 euro extra kosten; noemer = 20 extra badges. Teller MO = 72 euro extra opbrengst. De extra winst is 48 euro per dag. Controle met vorige dia: 144 − 96 = 48. Als een tabel wisselende kostenverschillen geeft, reken je iedere stap afzonderlijk uit; een bedrag uit een andere situatie mag die tabel niet vervangen.','Waarom zijn € 2,40 GTK en € 1,20 MK allebei juist?','Deel voor MK niet TK door Q: dat geeft GTK. Een vaste verkoopprijs garandeert alleen gelijke MO, niet gelijke extra winst als MK verschilt.','Koppel de totale bedragen aan de grafiek.',{example:true});
}
{
 const s=slide('Uitlegvoorbeeld · Break-even en winst',exampleLabel);
 text(s,'3,60Q = 96 + 1,20Q   →   2,40Q = 96   →   Q = 40',60,179,1480,60,38,{bold:true});
 chart(s,[line('TO',[0,120],[0,432],C.blue),line('TK',[0,120],[96,240],C.orange,4,'dashed'),line('Break-even',[40],[144],C.ink,0,'solid','diamond'),line('Winstafstand',[80,80],[192,288],C.green,7)],{example:true});
 text(s,'Break-even',1210,287,330,55,35,{bold:true,color:C.blue});
 text(s,'40 badges\nTO = TK = € 144',1210,358,330,123,32);
 text(s,'Bij 80 badges',1210,530,330,55,35,{bold:true,color:C.green});
 text(s,'€ 288 − € 192\n= € 96 winst\nper dag',1210,608,330,161,32);
 notes(s,'','Los TO = TK op: 2,40Q = 96, dus 40 badges. Controle: TO = 3,60 × 40 = 144 en TK = 96 + 1,20 × 40 = 144 euro per dag. Het snijpunt is (40; 144). Bij 80 badges is de verticale afstand 288 − 192 = 96 euro winst per dag. De functies stoppen bij 120 badges; de as loopt alleen voor de labels verder. Positieve winst bij meer dan 40 tot en met 120 badges; bij gehele aantallen 41–120. Korte begripscheck: betekent break-even een lege kassa? Nee, de opbrengst is 144 euro.','Waarom meet je winst verticaal bij één hoeveelheid?','De verticale as bevat al totale eurobedragen. Een oppervlakte tussen deze lijnen geeft geen winstbedrag.','Laat nu de gemengde boekopgaven maken; de bespreking gebruikt daarna de echte SmoothBox-opgave.',{example:true});
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 5 · SmoothBox op het schoolfestival',targetFooter);
 text(s,'SmoothBox verkoopt lunchboxen op twee festivaldagen.',60,185,1480,65,38,{bold:true});
 text(s,'De capaciteit is op beide dagen 1.000 lunchboxen per dag.\nAlle gemaakte lunchboxen worden voor € 5 per stuk verkocht.\nGebruik het juiste dagmenu bij elke vraag.',60,280,1480,188,37);
 rule(s,60,505,1480);
 text(s,'Bron A · Vrijdag: het gewone menu',60,552,1480,65,40,{bold:true,color:C.orange});
 text(s,'De totale constante kosten zijn € 1.200 per dag. De variabele kosten zijn € 2 per lunchbox. Deze bedragen gelden tot en met de capaciteit. Er worden 4.000 festivalbezoekers verwacht.',60,640,1480,168,36);
 notes(s,'32','Begin de bespreking nadat leerlingen doelopgave 5 zelf hebben geprobeerd. Deze context en bron A komen uit de echte SmoothBox-opgave. Doel 5 is gekozen omdat het de hoofdstukbewerkingen combineert. Toon eerst alle bronnen en a–f, zonder oplossingen.','Welke dag hoort bij bron A?','Het bezoekcijfer is geen gegeven verkoophoeveelheid. Bewaar de uitwerking tot na alle vragen.','Toon ook het andere dagmenu en de tabel.');
}
{
 const s=slide('Opgave 5 · Bron B: zaterdag',targetFooter);
 text(s,'De constante kosten blijven € 1.200 per dag. Dit menu vraagt bij meer productie\nsteeds meer betaald werk per extra lunchbox. De variabele kosten per lunchbox\nzijn daarom niet steeds gelijk.',60,185,1480,164,36);
 text(s,'Gebruik voor zaterdag deze totale bedragen, niet de € 2 uit bron A.',60,383,1480,87,36,{bold:true,color:C.green});
 table(s,[['Q (lunchboxen per dag)','TK zaterdag (€ per dag)','TO zaterdag (€ per dag)'],['700','2.600','3.500'],['800','2.900','4.000'],['900','3.250','4.500'],['1.000','3.650','5.000']],60,500,1480,309,[500,490,490],32);
 notes(s,'32','Bron B is een ander menu op zaterdag, bij dezelfde capaciteit en dezelfde totale constante kosten. Behoud alle vier rijen. De tabel geeft totale bedragen; de marginale bedragen moeten nog worden berekend.','Wat is de eenheid van 2.900 in de tabel?','Gebruik niet de vrijdagkostenfunctie voor zaterdag. Er is geen nieuwe vaste kostensprong of uitbreiding van capaciteit.','Toon bron C en vervolgens alle deelvragen.');
}
{
 const s=slide('Opgave 5 · Bron C: basisgrafiek',targetFooter);
 text(s,'SmoothBox: twee festivaldagen, twee menu’s',60,180,1480,50,34,{bold:true,color:C.blue});
 chart(s,friday());
 text(s,'Capaciteit',1210,300,330,55,35,{bold:true});
 text(s,'1.000 lunchboxen\nper dag',1210,380,330,117,32);
 text(s,'Zaterdag:',1210,552,330,52,34,{bold:true,color:C.green});
 text(s,'alleen de punten\nuit bron B\nverbonden',1210,621,330,157,32);
 notes(s,'32','Dit is de basisgrafiek uit bron C, opnieuw opgebouwd met bewerkbare XY-reeksen. TO geldt voor beide dagen; TK vrijdag loopt van Q = 0 tot en met 1000; TK zaterdag bevat alleen de gegeven punten bij 700, 800, 900 en 1000. De as loopt voor de labels verder dan de capaciteit; de reeksen niet. De leerling moet break-even en de gevraagde markeringen zelf toevoegen. De grafiek bevat hier nog geen antwoordmarkeringen.','Welke kostengegevens zijn voor zaterdag daadwerkelijk bekend?','Trek de zaterdagreeks niet door naar onbekende hoeveelheden.','Toon alle vragen voordat de antwoorden verschijnen.');
}
{
 const s=slide('Opgave 5 · Vragen a, b en c',targetFooter);
 text(s,'Gebruik het bronblad. Q is het aantal lunchboxen per dag.',60,184,1480,54,33,{bold:true,color:C.blue});
 text(s,'a) Selecteer uit bron A de constante kosten, de variabele kosten per lunchbox en\nde verkoopprijs. Leg uit welke totale kosten met Q veranderen en welke gelijk\nblijven. Noem ook het gegeven dat je niet nodig hebt voor TK en TO.',60,272,1480,214,36);
 rule(s,60,515,1480);
 text(s,'b) Stel voor vrijdag de functies voor TK en TO op. Bereken de break-even-afzet.',60,548,1480,110,37);
 rule(s,60,683,1480);
 text(s,'c) Bereken voor vrijdag bij Q = 700 de winst en GTK. Noteer de volledige eenheden.',60,720,1480,106,37);
 notes(s,'33','Deze drie vragen gebruiken vrijdag. Alle onderdelen zijn letterlijk behouden. Wacht met het onthullen van oplossingen totdat ook d, e en f zijn getoond.','Welke bron hoort bij a tot en met c?','Een juist getal zonder gevraagde verklaring of volledige eenheid is niet het volledige antwoord.','Toon vraag d voor de zaterdagstappen.');
}
{
 const s=slide('Opgave 5 · Vraag d',targetFooter);
 text(s,'d) Bereken met bron B voor elk van de drie stappen op zaterdag MK en MO per extra lunchbox. Laat bij iedere MK-berekening teller en noemer zien.',60,195,1480,174,41);
 table(s,[['Stap op zaterdag','MK (€ per extra lunchbox)','MO (€ per extra lunchbox)'],['700 → 800','…','…'],['800 → 900','…','…'],['900 → 1.000','…','…']],60,430,1480,345,[410,535,535],32);
 notes(s,'33','Vraag d vraagt drie afzonderlijke MK- en drie MO-berekeningen. De lege tabel biedt schrijfruimte zonder oplossingen. Het bronblad blijft in het boek beschikbaar.','Welke twee rijen gebruik je voor de eerste stap?','De teller en noemer horen bij dezelfde stap; het totale kostenbedrag bij de eindhoeveelheid is niet de teller.','Toon de volledige grafiekvraag.');
}
{
 const s=slide('Opgave 5 · Vraag e',targetFooter);
 text(s,'e) Markeer in bron C het break-evenpunt van vrijdag. Geef ook aan voor welke vrijdaghoeveelheden de verticale winstafstand positief is.',60,201,1480,164,40);
 text(s,'Vergelijk de groei van die winstafstand per extra lunchbox op vrijdag met de drie zaterdagstappen.',60,415,1480,128,40);
 text(s,'Op welke dag en bij welke hoeveelheden groeit de positieve winstafstand het snelst? Onderbouw met MK en MO.',60,607,1480,163,40,{bold:true});
 notes(s,'33','Vraag e omvat drie onderdelen: snijpunt markeren, vrijdaghoeveelheden met positieve winst noemen, en de groei per extra lunchbox vergelijken met alle drie zaterdagstappen. Deze dia geeft nog geen oplossingen.','Waarom vraagt de vraag zowel een dag als hoeveelheden?','Vergelijk niet alleen de totale winst bij één Q: gevraagd is de groei per extra lunchbox.','Toon de laatste vraag voordat de bespreking van antwoorden begint.');
}
{
 const s=slide('Opgave 5 · Vraag f',targetFooter);
 text(s,'f) Een leerling zegt:',60,198,1480,65,40);
 text(s,'“Door de vaste verkoopprijs leveren alle extra groepen van honderd lunchboxen evenveel extra winst op.”',60,318,1480,161,46,{bold:true,color:C.blue});
 text(s,'Beoordeel de uitspraak met de drie zaterdagstappen. Bereken daarbij de extra winst per groep.',60,550,1480,148,40);
 text(s,'Houd je conclusie bij de gegeven hoeveelheden en menu’s.',60,754,1480,66,33,{bold:true});
 notes(s,'33','Alle bronnen en alle zes vragen zijn nu getoond. De slotzin herinnert aan de afbakening uit het boek. Het is niet nodig de werkelijke verkoop of een winstmaximaliserende hoeveelheid te voorspellen. Start hierna pas de antwoordbespreking.','Welke twee veranderingen bepalen de extra winst?','Een vaste verkoopprijs zegt op zichzelf niets over de verandering in kosten.','Begin bij de bronselectie van a.');
}
{
 const s=slide('Opgave 5a · De gegevens voor vrijdag',targetFooter);
 table(s,[['Gegeven','Betekenis'],['€ 1.200 per dag','TCK: het totaal blijft gelijk als Q verandert.'],['€ 2 per lunchbox','Variabele kosten per box; TVK = 2Q verandert met Q.'],['€ 5 per lunchbox','Verkoopprijs P. Alle lunchboxen worden verkocht.'],['4.000 verwachte bezoekers','Niet nodig om TK en TO op te stellen.']],60,208,1480,439,[450,1030],34);
 text(s,'Bezoekers zijn niet automatisch kopers.',60,712,1480,83,43,{bold:true,color:C.blue});
 notes(s,'32–33','Selecteer uit bron A TCK = 1200 euro per dag en variabele kosten 2 euro per lunchbox; de prijs 5 euro per lunchbox staat in de gezamenlijke context. TCK blijft 1200 als Q verandert. TVK = 2Q verandert wel. Het bezoekcijfer is niet nodig om TK en TO op te stellen, omdat het geen gegarandeerde afzet is.','Waarom kan het bedrag per lunchbox vast zijn terwijl totale variabele kosten veranderen?','Verwar een vast bedrag per product niet met totale constante kosten.','Stel de functies op en vind de break-even-afzet.');
}
{
 const s=slide('Opgave 5b · Vrijdag: functies en break-even',targetFooter);
 text(s,'TK = 1.200 + 2Q          TO = 5Q',60,190,1480,79,48,{bold:true,color:C.blue});
 text(s,'€ per dag · 0 ≤ Q ≤ 1.000 lunchboxen per dag',60,290,1480,54,32);
 rule(s,60,369,1480);
 text(s,'TO = TK\n5Q = 1.200 + 2Q\n3Q = 1.200\nQ = 400 lunchboxen per dag',60,417,945,267,44,{bold:true});
 text(s,'Controle',1060,428,480,61,36,{bold:true,color:C.green});
 text(s,'TO = 5 × 400\n= € 2.000 per dag\n\nTK = 1.200 + 800\n= € 2.000 per dag',1060,510,480,243,32);
 text(s,'Break-even: de winst is € 0 per dag.',60,755,970,67,37,{bold:true,color:C.orange});
 notes(s,'32–33','De functies gelden voor vrijdag tot en met 1000 lunchboxen per dag. Trek 2Q aan beide kanten af en deel door 3. De break-even-afzet is precies 400, een haalbaar geheel aantal onder de capaciteit. Bij 400 is TO gelijk aan TK: beide 2000 euro per dag. Break-even betekent nul winst, geen nulopbrengst.','Waarom tel je bij TK wel 1.200 op en bij TO niet?','Gebruik niet 4.000 bezoekers als Q.','Bereken vervolgens het totale resultaat en de gemiddelde kosten bij 700.');
}
{
 const s=slide('Opgave 5c · Vrijdag bij 700 lunchboxen',targetFooter);
 text(s,'TK = 1.200 + 2 × 700 = € 2.600 per dag\nTO = 5 × 700 = € 3.500 per dag',60,204,1480,157,43);
 rule(s,60,408,1480);
 text(s,'Winst = TO − TK\n= 3.500 − 2.600 = € 900 per dag',60,458,1480,140,44,{bold:true,color:C.green});
 text(s,'GTK = TK / Q\n= 2.600 / 700 ≈ € 3,71 per lunchbox',60,664,1480,146,44,{bold:true,color:C.orange});
 notes(s,'32–33','Alle berekeningen zijn voor vrijdag. Bereken eerst de totalen, dan winst en GTK. GTK is 26/7 euro per lunchbox; rond alleen het eindbedrag af op centen. Economische betekenis: na betaling van alle kosten blijft op deze dag 900 euro over; gemiddeld kost een lunchbox ongeveer 3,71 euro. Controle: (5 − 2600/700) × 700 = 900 exact.','Welke uitkomst gaat over de hele dag en welke over één lunchbox?','€ 900 per lunchbox is een verkeerde eenheid; € 3,71 per dag eveneens.','Wissel voor d bewust naar zaterdag en bron B.');
}
{
 const s=slide('Opgave 5d · De drie zaterdagstappen',targetFooter);
 text(s,'MK = ΔTK / ΔQ          MO = ΔTO / ΔQ',60,188,1480,60,40,{bold:true,color:C.blue});
 table(s,[['Stap','MK (€ per extra lunchbox)','MO (€ per extra lunchbox)'],['700 → 800','(2.900 − 2.600) / (800 − 700)\n= 300 / 100 = 3,00','(4.000 − 3.500) / 100\n= 500 / 100 = 5,00'],['800 → 900','(3.250 − 2.900) / (900 − 800)\n= 350 / 100 = 3,50','(4.500 − 4.000) / 100\n= 500 / 100 = 5,00'],['900 → 1.000','(3.650 − 3.250) / (1.000 − 900)\n= 400 / 100 = 4,00','(5.000 − 4.500) / 100\n= 500 / 100 = 5,00']],60,292,1480,410,[290,635,555],31);
 text(s,'Extra kosten per box stijgen; extra opbrengst per box blijft € 5.',60,749,1480,76,36,{bold:true,color:C.green});
 notes(s,'32–33','Gebruik uitsluitend bron B voor zaterdag. Laat bij elke MK zowel teller als noemer zien. ΔQ is telkens 100 lunchboxen. Extra kosten zijn 300, 350 en 400 euro per dag; extra opbrengst is telkens 500 euro per dag. Delen door 100 geeft de marginale bedragen uit de tabel. TCK blijft 1200: de grotere kostenstappen komen van het andere menu en meer betaald werk per extra lunchbox.','Waarom is de eerste MK € 3 en niet € 300?','€ 2 per lunchbox uit bron A hoort bij vrijdag. Dat bedrag vervangt de zaterdagtabel niet.','Gebruik het snijpunt en de marginale verschillen voor de grafiekvraag.');
}
{
 const s=slide('Opgave 5e · Vrijdag: positieve winst',targetFooter);
 text(s,'Break-even: (400; 2.000)',60,180,1480,52,37,{bold:true,color:C.blue});
 const series=friday();series.push(line('Break-even',[400],[2000],C.ink,0,'solid','diamond'),line('Winst vrijdag',[700,700],[2600,3500],C.green,7));
 chart(s,series);
 text(s,'TO > TK vrijdag',1210,292,330,92,35,{bold:true,color:C.orange});
 text(s,'400 < Q ≤ 1.000\n\nGehele aantallen:\n401 t/m 1.000\nlunchboxen per dag',1210,405,330,251,31);
 text(s,'Bij Q = 700:\n€ 900 winst',1210,701,330,104,31,{bold:true,color:C.green});
 notes(s,'32–33','Het break-evenpunt ligt precies bij Q 400 en 2000 euro per dag. Rechts van 400 ligt TO boven TK vrijdag, tot en met de capaciteit van 1000. Bij hele lunchboxen: 401 tot en met 1000. De positieve verticale afstand bij Q700 is 3500 − 2600 = 900 euro per dag. De volledige TO- en vrijdagkostenlijn zijn getekend; zaterdag blijft beperkt tot de vier gegeven punten. De volgende dia vergelijkt de groei per extra lunchbox.','Waarom hoort Q = 400 niet bij positieve winst?','Een positieve winstafstand is een verticaal verschil in totale eurobedragen, geen oppervlakte.','Vergelijk MO − MK voor vrijdag met elk van de drie zaterdagstappen.');
}
{
 const s=slide('Opgave 5e · Groei per extra lunchbox',targetFooter);
 table(s,[['Dag / hoeveelheid','MO','MK','MO − MK'],['Vrijdag: 400 < Q ≤ 1.000','€ 5,00','€ 2,00','€ 3,00'],['Zaterdag: 700 → 800','€ 5,00','€ 3,00','€ 2,00'],['Zaterdag: 800 → 900','€ 5,00','€ 3,50','€ 1,50'],['Zaterdag: 900 → 1.000','€ 5,00','€ 4,00','€ 1,00']],60,206,1480,405,[640,280,280,280],33);
 text(s,'Alle bedragen: € per extra lunchbox',60,644,1480,52,31,{color:C.muted});
 text(s,'Op vrijdag bij 400 < Q ≤ 1.000 groeit de positieve\nwinstafstand het snelst: € 3 per extra lunchbox.',60,724,1480,102,39,{bold:true,color:C.orange});
 notes(s,'32–33','Vrijdag is MO − MK = 5 − 2 = 3 euro per extra lunchbox. Zaterdag is dit achtereenvolgens 2, 1,50 en 1. De vrijdagwinstafstand is positief bij meer dan 400 tot en met 1000 lunchboxen per dag en groeit daar sneller dan in alle drie gegeven zaterdagstappen. De vrijdagwaarde 3 geldt ook elders binnen het model, maar de vraag gaat over positieve winstafstand. Voor zaterdag zijn de stapuitkomsten gemiddelden over de gegeven stappen; onbekende hoeveelheden of andere menu’s vallen buiten deze vergelijking.','Waarom betekent de grootste totale winst niet automatisch de grootste winstgroei per extra lunchbox?','Geen extrapolatie van zaterdag buiten 700–1000 en geen conclusie over een wereldwijd winstmaximum.','Vertaal de bedragen per extra box naar de hele groepen van honderd.');
}
{
 const s=slide('Opgave 5f · Extra omzet is niet extra winst',targetFooter);
 text(s,'Extra winst = ΔTO − ΔTK = (MO − MK) × ΔQ',60,184,1480,66,39,{bold:true,color:C.blue});
 table(s,[['Zaterdagstap','Extra TO (€ per dag)','Extra TK (€ per dag)','Extra winst (€ per dag)'],['700 → 800','500','300','(5 − 3) × 100 = 200'],['800 → 900','500','350','(5 − 3,50) × 100 = 150'],['900 → 1.000','500','400','(5 − 4) × 100 = 100']],60,300,1480,349,[350,320,320,490],31);
 text(s,'De uitspraak is onjuist.',60,693,1480,62,41,{bold:true,color:C.orange});
 text(s,'Elke groep brengt € 500 extra op, maar kost steeds meer.',60,772,1480,62,36);
 notes(s,'32–33','Elke extra groep bestaat uit 100 lunchboxen. Extra winst is 500 − 300 = 200, daarna 500 − 350 = 150 en vervolgens 500 − 400 = 100 euro per dag. Controle met totale zaterdagwinsten: bij Q700 900, Q800 1100, Q900 1250, Q1000 1350 euro per dag. De verschillen zijn 200, 150 en 100. Een vaste prijs maakt de extra omzet bij even grote groepen gelijk. Doordat MK stijgt, daalt de extra winst per groep. Laat leerlingen een ontbrekende eenheid, teller/noemer of onderbouwing in hun eigen antwoord verbeteren.','Welk deel van de uitspraak is wel waar, en welk deel niet?','Gelijke extra omzet is niet hetzelfde als gelijke extra winst.','Laat het laatste overzicht staan voor de huiswerkafsluiting.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...assignment,slides,nativeTableSlides:tables,nativeChartSlides:charts,graphContracts},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(HERE,'presentation-214-chart-labels.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'2.1.4 Gemengde opgaven – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...Array.from(new Set(tables)).flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:Array.from(new Set(tables)),requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
