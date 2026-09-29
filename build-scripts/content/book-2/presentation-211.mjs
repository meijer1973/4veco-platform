import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('211');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial';
const source='https://github.com/meijer1973/4veco-lessen/blob/f6518f513d1f22f82922d4a8d3d3842c369b14f7/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/edities/chat-2026/';
const tables=[],charts=[],manifest=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,50),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function notes(s,page,explanation,question,pitfall,transition,extra=''){
 explanation=explanation.replace(' De drie overzichtsdia’s gebruiken één gezamenlijke bron.','');
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: leerlingenboek Boek 2, chatuitgave 2026, actuele revisie 21 september 2026, gedrukte pagina ${page}. ${source}boek/Boek_2_Compleet.pdf\nAntwoordmodel: ${source}boek/Boek_2_Compleet_Antwoorden.pdf\n${extra}`);
}
function slide(title,footer='§2.1.1 Kostenstructuren'){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,86,52,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 manifest.push({number:p.slides.items.length,title});return s;
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
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 7.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §2.1.1 Kostenstructuren');
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Kosten indelen, functies opstellen,\ngemiddelden berekenen en\nveranderingen verklaren.',972,244,565,122,31,{name:'overview-goals'});
 rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 6 · Opgaven 1 en 2\n2: verkennen, theorie p. 2–4',972,459,565,95,30,{bold:active===2,name:'overview-start'});
 rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§2.1.1 Kostenstructuren\nBasis: 3 en 4\nZelfstandig: 5 en 6\nDoelopgave: 7\nMaken en nakijken',972,654,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'6–8',(`Laat deze dia staan tijdens ${phase.toLowerCase()}. De docent heeft expliciet gekozen voor opgaven 1 en 2 als startopdracht. Opgaven 3 en 4 zijn basis, 5 en 6 zelfstandig, 7 doel. Huiswerk: 3, 4, 5, 6 en 7 maken en nakijken. Start 1–2 en basis 3 staan op pagina 6; basis 4 en zelfstandig 5–6 staan op pagina 7; doel 7 op pagina 8. De drie overzichtsdia’s gebruiken één gezamenlijke bron. De volledige oefenroute hoeft niet binnen één les af te zijn.` + "\n\nStart en terugblik: Opgave 1 haalt invullen in een gegeven formule en verdelen op; de formule en betekenissen staan in de opgave. Kostenindeling en vooral TCK tegenover GCK zijn nieuw. Lees bij opgave 2 eerst de uitleg over constante en variabele kosten op p. 2 en over gemiddelde kosten op p. 4. Laat leerlingen bij deze verkenning aanwijzen welke uitleg zij gebruiken en hun twijfel noteren. Verwacht de nieuwe bewerking nog niet zonder steun. Bij terugkeer naar dit overzicht vóór het basiswerk: laat leerlingen opgave 2 opnieuw proberen na de uitleg, bespreek hun redenering en geef zo nodig extra steun. Dit is een verkennende start, geen toets van al beheerste nieuwe leerstof."),phase==='Startopdracht'?'Bij welke vraag wil je straks hulp?':'Waar ben je in de oefenroute?', 'Gebruik het gedrukte paginanummer: pagina 6 is de achtste fysieke pagina van het complete PDF-bestand.',phase==='Afsluiting / huiswerk'?'Laat leerlingen het huiswerk noteren.':'Ga verder zodra de klas klaar is voor de volgende lesfase.', 'Terminologie: het boek noemt 1–2 Startopgaven en 3–4 Begeleide inoefening. De docent heeft bovenstaande indeling bevestigd. Startantwoorden: 1a € 100; 1b € 5 per deelnemer. 2a huur € 600 in beide situaties, inkt € 100 respectievelijk € 200 per maand. 2b € 600 zijn TCK; GCK is € 1,20 respectievelijk € 0,60 per poster.');
 return s;
}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const items=[['Kosten indelen','Je legt uit welke totale bedragen veranderen bij meer productie.'],['Kostenfuncties opstellen','Je schrijft TCK, TVK en TK als functie van Q.'],['Kosten per product berekenen','Je berekent GCK, GVK en GTK met de juiste eenheid.'],['Een verandering verklaren','Je legt uit waarom TK kan stijgen terwijl GTK daalt.']];
 items.forEach((a,i)=>{const y=200+i*146;text(s,a[0],60,y,600,55,38,{bold:true,color:C.blue});text(s,a[1],695,y,820,106,35);if(i<3)rule(s,60,y+118,1480);});
 notes(s,'2', 'Koppel de doelen aan opgave 7. Leg afkortingen later stapsgewijs uit. Het gaat steeds om kosten in een bepaalde maand en binnen dezelfde capaciteit.', 'Wat is het verschil tussen alles bij elkaar en per product?', 'Een totaalbedrag en een bedrag per product zijn verschillende grootheden.', 'Gebruik Fles & Co uit de paragraaf als doorlopend uitlegvoorbeeld.');
}
{
 const s=slide('Constante en variabele kosten');
 text(s,'Fles & Co: dezelfde maand, maximaal 600 flessen',60,183,1480,52,35,{bold:true,color:C.blue});
 table(s,[['Kostenpost','200 flessen','400 flessen','Soort kosten'],['Huur per maand','€ 300','€ 300','Constant'],['Materiaal: € 2 per fles','€ 400','€ 800','Variabel']],60,287,1480,302,[535,275,275,395],34);
 text(s,'De indeling hangt af van het totale bedrag als Q verandert.',60,650,1480,100,41,{bold:true});
 notes(s,'2', 'Constante kosten veranderen niet met de geproduceerde hoeveelheid binnen dezelfde periode en capaciteit. Variabele kosten veranderen wel. Productiecapaciteit is de maximale hoeveelheid met de beschikbare mensen en middelen in die periode. Bij nul productie blijft de huur verschuldigd.', 'Welke kostenpost groeit mee als er meer flessen worden gemaakt?', 'Het materiaalbedrag per fles is vast, maar het totale materiaalbedrag is variabel.', 'Vertaal de twee kostenposten naar functies.');
}
{
 const s=slide('Van kostenpost naar kostenfunctie');
 text(s,'Q = aantal flessen per maand',60,189,1480,55,36,{bold:true,color:C.blue});
 const rows=[['Totale constante kosten','TCK = 300'],['Totale variabele kosten','TVK = 2 × Q = 2Q'],['Totale kosten','TK = TCK + TVK = 300 + 2Q']];
 rows.forEach((a,i)=>{let y=290+i*150;text(s,a[0],60,y,670,60,37);text(s,a[1],755,y,780,65,40,{bold:true,color:[C.blue,C.green,C.orange][i]});rule(s,60,y+93,1480);});
 text(s,'Totaal: € per maand',60,764,1470,55,34,{bold:true});
 notes(s,'3', 'Tel vaste maandbedragen op. Vermenigvuldig het bedrag per fles met Q. Tel beide totalen op voor TK. De functies gelden hier tot en met 600 flessen per maand. Bij 200 flessen: TVK = 2 × 200 = 400 en TK = 300 + 400 = 700 euro per maand.', 'Welke grootheid vermenigvuldig je met Q?', 'Vermenigvuldig de huur niet nog eens met het aantal flessen. € 2 is per fles; 2Q is het totale bedrag.', 'Lees eerst de twee afzonderlijke kostenlijnen.');
}
function totalGraph(includeTK){
 const s=slide(includeTK?'Totale kosten zijn de som van beide':'Kosten in een grafiek');
 text(s,'Fles & Co',60,182,1480,48,34,{bold:true,color:C.blue});
 const series=[{name:'TCK = 300',values:[300,300,300,300],line:{fill:C.blue,width:4,style:'dashed'},marker:{symbol:'square',size:7}},{name:'TVK = 2Q',values:[0,400,800,1200],line:{fill:C.green,width:4},marker:{symbol:'circle',size:7}}];
 if(includeTK)series.push({name:'TK = 300 + 2Q',values:[300,700,1100,1500],line:{fill:C.orange,width:5},marker:{symbol:'triangle',size:8}});
 series.forEach(a=>{a.xValues=[0,200,400,600];});
 const ch=s.charts.add('scatter',{position:{left:60,top:246,width:1040,height:556},series,scatterOptions:{style:'lineWithMarkers'},hasLegend:true,legend:{position:'bottom',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},xAxis:{min:0,max:600,majorUnit:200,numberFormatCode:'0',title:{text:'Q (flessen per maand)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}},yAxis:{min:0,max:1500,majorUnit:300,numberFormatCode:'#,##0',title:{text:'Kosten (€ per maand)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 text(s,includeTK?'Bij Q = 400':'Wat zie je?',1150,286,390,58,35,{bold:true});
 text(s,includeTK?'TVK = € 800\nTCK = € 300\nTK = € 1.100':'TCK: horizontaal\n\nTVK: vanaf nul',1150,369,390,216,34);
 text(s,includeTK?'Het verschil tussen\nTK en TVK is\nsteeds € 300.':'Elke extra fles\nkost € 2 materiaal.',1150,627,390,152,33,{bold:true,color:includeTK?C.orange:C.green});
 notes(s,'3',includeTK?'De derde lijn is steeds de verticale som van TCK en TVK. Lees bij Q = 400 de bedragen af. De schaal is exact gelijk aan de vorige dia. Van 200 naar 400 flessen stijgt TK van 700 naar 1100 euro: TK verdubbelt niet.':'De horizontale as geeft flessen per maand, de verticale as euro per maand. TCK is horizontaal op 300. TVK stijgt met 2 euro per extra fles vanaf nul. De punten liggen exact op de functies. Laat leerlingen beide lijnen aanwijzen.',includeTK?'Waarom ligt TK overal € 300 boven TVK?':'Welke lijn begint bij nul en waarom?', 'Vergelijk geen totaalbedrag met euro per fles. Alle lijnen in deze grafiek zijn totalen.',includeTK?'Ga van alle flessen samen naar één fles.':'Voeg TK toe op dezelfde assen en met dezelfde schaal.');
}
totalGraph(false);totalGraph(true);
{
 const s=slide('Gemiddelde kosten: het bedrag per product');
 text(s,'Gemiddeld = het bijbehorende totaal delen door Q',60,185,1475,65,39,{bold:true,color:C.blue});
 table(s,[['Gemiddelde kosten','Formule','Bij Fles & Co'],['Gemiddelde constante kosten','GCK = TCK / Q','300 / Q'],['Gemiddelde variabele kosten','GVK = TVK / Q','2Q / Q = 2'],['Gemiddelde totale kosten','GTK = TK / Q','(300 + 2Q) / Q']],60,285,1480,360,[670,410,400],32);
 text(s,'GTK = GCK + GVK',60,698,870,75,44,{bold:true,color:C.orange});
 text(s,'€ per fles\nAlleen bij Q > 0',1120,695,420,92,32,{bold:true});
 notes(s,'4', 'Gemiddelde kosten verdelen een totaalbedrag over de geproduceerde eenheden. Benoem elke afkorting volledig. Voor Fles & Co is GTK = 300 / Q + 2. GVK is in dit voorbeeld constant omdat het materiaalbedrag per fles constant is.', 'Hoe verdeel je de maandhuur over alle flessen?', 'Constante kosten betekent dat TCK gelijk blijft. GCK verandert juist met Q. Bij Q = 0 kun je geen gemiddelde berekenen.', 'Vul één productiehoeveelheid in.');
}
{
 const s=slide('Gemiddelde kosten bij 200 flessen');
 text(s,'Fles & Co: TCK = € 300, TVK = € 400, TK = € 700 per maand',60,185,1475,96,35,{bold:true});
 const a=[['GCK','300 / 200','= € 1,50 per fles'],['GVK','400 / 200','= € 2,00 per fles'],['GTK','700 / 200','= € 3,50 per fles']];
 a.forEach((r,i)=>{let y=318+i*140;text(s,r[0]+' =',60,y,225,65,46,{bold:true,color:[C.blue,C.green,C.orange][i]});text(s,r[1],305,y,500,65,46);text(s,r[2],825,y,710,70,46,{bold:true});});
 text(s,'Controle: € 1,50 + € 2,00 = € 3,50 per fles',60,766,1480,64,36,{bold:true});
 notes(s,'4', 'Herhaal hoe de totalen ontstaan: TVK = 2 × 200 = 400; TK = 300 + 400 = 700 euro per maand. Deel vervolgens elk passend totaal door 200. Lees de volledige eenheid mee.', 'Welk totaalbedrag hoort boven de breuk voor GTK?', 'Deel voor GTK niet alleen de huur of alleen het materiaal door Q.', 'Vergelijk daarna 200 met 400 flessen.');
}
{
 const s=slide('Meer flessen, lagere kosten per fles');
 table(s,[['Q (flessen per maand)','GCK (€ per fles)','GVK (€ per fles)','GTK (€ per fles)'],['200','1,50','2,00','3,50'],['400','0,75','2,00','2,75']],60,215,1480,280,[430,350,350,350],32);
 text(s,'Dezelfde € 300 huur over tweemaal zoveel flessen',60,558,1480,72,41,{bold:true,color:C.blue});
 text(s,'GCK halveert. Het materiaal blijft € 2 per fles.',60,670,1480,58,36);
 text(s,'Daarom daalt GTK, maar GTK halveert niet.',60,757,1480,58,39,{bold:true,color:C.orange});
 notes(s,'4', 'Bij 400 flessen: TVK = 800, TK = 1100 euro per maand. GCK = 300 / 400 = 0,75, GVK = 800 / 400 = 2 en GTK = 1100 / 400 = 2,75 euro per fles. Het constante deel per fles halveert, het variabele deel niet.', 'Welk deel van GTK wordt kleiner?', 'GCK halveert bij een verdubbeling van Q binnen dezelfde capaciteit. Dat betekent niet dat GTK halveert. GVK hoeft in andere situaties niet gelijk te blijven.', 'Controleer met één korte uitspraak of het verschil tussen totaal en gemiddeld duidelijk is.');
}
function check(reveal){
 const s=slide('Korte controle');
 text(s,'Bij Fles & Co verdubbelt Q van 200 naar 400 flessen.',60,199,1480,70,38,{bold:true});
 text(s,'“Dan verdubbelt TK en halveert GTK.”',60,347,1480,108,52,{bold:true,color:C.blue});
 if(!reveal){text(s,'Klopt deze uitspraak?\nGebruik de huur en de materiaalkosten in je uitleg.',60,558,1480,180,42);}
 else{table(s,[['','200 flessen','400 flessen'],['TK (€ per maand)','700','1.100'],['GTK (€ per fles)','3,50','2,75']],60,509,1480,224,[720,380,380],32);text(s,'Alleen TVK verdubbelt en GCK halveert.',60,776,1480,58,38,{bold:true,color:C.orange});}
 notes(s,'3–4',reveal?'Beide delen van de uitspraak zijn onjuist. De huur blijft in totaal gelijk. Daardoor verdubbelt TK niet. Alleen de huur per fles halveert, het materiaal per fles blijft 2 euro.':'Laat leerlingen kort individueel nadenken en dan hun redenering verwoorden. Het antwoord staat op de volgende dia. Dit is een begripscontrole op het uitlegvoorbeeld, geen nieuwe boekopgave.', 'Wat verandert in totaal, en wat verandert per fles?', 'Zonder onderscheid tussen T en G lijken de conclusies tegenstrijdig.',reveal?'Laat de overzichtsdia staan tijdens zelfstandig werken.':'Toon de twee berekeningen na de antwoorden van leerlingen.');
}
check(false);check(true);
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 7 · Bakkerij De Korenaar','§2.1.1 Kostenstructuren · Opgave 7 · Boekpagina 8');
 text(s,'Maximaal 1.000 broden per maand. Deze maand blijven de ruimte en ovens hetzelfde.',60,190,1480,103,37,{bold:true});
 text(s,'Tot en met die capaciteit gelden de volgende kosten:',60,306,1480,50,33);
 table(s,[['Kostenpost','Bedrag'],['Huur en verzekering samen','€ 440 per maand'],['Netaansluiting en energieabonnement samen','€ 60 per maand'],['Meel en verpakking samen','€ 0,70 per brood'],['Elektriciteitsverbruik van de ovens','€ 0,10 per brood']],60,394,1480,335,[1030,450],32);
 text(s,'Q is het aantal broden per maand.',60,773,1480,57,36,{bold:true});
 notes(s,'8', 'Start de bespreking pas nadat leerlingen zelf de doelopgave hebben geprobeerd. Dit zijn de oorspronkelijke context en gegevens uit opgave 7. De volgende twee dia’s tonen alle deelvragen zonder uitwerking.', 'Welke bedragen zijn per maand en welke per brood gegeven?', 'De energiekosten bestaan uit twee verschillende onderdelen. Dezelfde rekening betekent niet hetzelfde kostenpatroon.', 'Toon eerst deelvragen a en b, daarna c tot en met e.');
}
{
 const s=slide('Opgave 7 · Deelvragen a en b','§2.1.1 Kostenstructuren · Opgave 7 · Boekpagina 8');
 text(s,'a) Neem de classificatietabel over en vul alle lege cellen in. Geef telkens aan hoe het totale bedrag reageert op een verandering van Q.',60,185,1480,135,35);
 table(s,[['Kostenpost','Constant of variabel?','Reden'],['Huur en verzekering','…','…'],['Netaansluiting en abonnement','…','…'],['Meel en verpakking','…','…'],['Elektriciteitsverbruik ovens','…','…']],60,362,1480,325,[680,445,355],30);
 text(s,'b) Stel de functies voor TCK, TVK en TK op.',60,748,1480,68,38,{bold:true});
 notes(s,'8', 'Behoud de classificatietabel en alle lege cellen uit de boekopgave. Laat een leerling uitleggen wat bij Reden hoort, maar onthul de oplossing pas na de volgende vragendia.', 'Waar moet je uitleg naar verwijzen als je een kostenpost constant noemt?', 'Alleen het label constant of variabel is geen volledige beantwoording van a.', 'Toon ook de reken- en vergelijkingsvragen.');
}
{
 const s=slide('Opgave 7 · Deelvragen c, d en e','§2.1.1 Kostenstructuren · Opgave 7 · Boekpagina 8');
 text(s,'c) Bereken bij Q = 500 de GCK, GVK en GTK.\nNoteer de volledige eenheden.',60,195,1480,118,37);
 rule(s,60,342,1480);
 text(s,'d) Bereken bij Q = 1.000 de GCK, GVK en GTK.\nNoteer de volledige eenheden.',60,385,1480,120,37);
 rule(s,60,535,1480);
 text(s,'e) Vergelijk eerst TCK, TVK en TK bij beide hoeveelheden. Leg daarna met je uitkomsten uit waarom GCK halveert, GVK gelijk blijft en GTK niet halveert als Q verdubbelt. Je vergelijkt dezelfde maand en dezelfde productiecapaciteit.',60,582,1480,236,36);
 notes(s,'8', 'De deelvragen zijn inhoudelijk en qua gegevens ongewijzigd. Laat leerlingen hun eigen antwoorden erbij houden. Bij e zijn zowel de vergelijking van totalen als de verklaring van de gemiddelden nodig.', 'Welke twee stappen vraagt deelvraag e?', 'Een rij uitkomsten zonder verklaring is niet voldoende bij e.', 'Begin de stapsgewijze bespreking bij de indeling.');
}
{
 const s=slide('Opgave 7a · Kosten indelen','§2.1.1 Kostenstructuren · Opgave 7 · Boekpagina 8');
 table(s,[['Kostenpost','Soort','Reden bij meer broden'],['Huur en verzekering','Constant','Het maandbedrag blijft € 440.'],['Netaansluiting en abonnement','Constant','Het maandbedrag blijft € 60.'],['Meel en verpakking','Variabel','Het totaal stijgt met € 0,70 per extra brood.'],['Elektriciteitsverbruik ovens','Variabel','Het totaal stijgt met € 0,10 per extra brood.']],60,211,1480,480,[580,250,650],32);
 text(s,'Eén energierekening kan constante én variabele kosten bevatten.',60,742,1480,89,36,{bold:true,color:C.blue});
 notes(s,'8', 'Classificeer alle vier posten met een reden. Beoordeel het gedrag van het totale bedrag als Q verandert. De productie blijft in dezelfde maand binnen 1000 broden.', 'Waarom is het abonnement constant en het verbruik variabel?', 'Maandelijks betalen maakt verbruikskosten niet constant.', 'Tel eerst de vaste bedragen en vervolgens de bedragen per brood op.');
}
{
 const s=slide('Opgave 7b · De kostenfuncties','§2.1.1 Kostenstructuren · Opgave 7 · Boekpagina 8');
 text(s,'Vaste maandbedragen',60,198,620,50,33,{bold:true,color:C.blue});
 text(s,'TCK = 440 + 60 = 500',60,269,1480,76,48,{bold:true});
 text(s,'Variabele kosten per brood',60,386,1470,50,33,{bold:true,color:C.green});
 text(s,'€ 0,70 + € 0,10 = € 0,80 per brood',60,448,1480,65,44);
 text(s,'TVK = 0,80Q',60,539,1480,76,49,{bold:true});
 rule(s,60,645,1480);
 text(s,'TK = TCK + TVK = 500 + 0,80Q',60,692,1480,78,48,{bold:true,color:C.orange});
 text(s,'TCK, TVK en TK: € per maand. Q: broden per maand, tot en met 1.000.',60,790,1480,49,29);
 notes(s,'8', 'Vaste bedragen optellen geeft 500 euro per maand. De bedragen per brood optellen geeft 0,80 euro per brood. Vermenigvuldig 0,80 met de hoeveelheid en tel voor TK de 500 erbij.', 'Waarom staat Q wel bij 0,80 maar niet bij 500?', '€ 0,80 is GVK in deze opgave. TVK is 0,80Q en hangt af van de hoeveelheid.', 'Bereken nu eerst de totalen en vervolgens de gemiddelden bij 500 broden.');
}
function bakeryCalculation(q){
 const s=slide(`Opgave 7${q===500?'c':'d'} · ${q===500?'500':'1.000'} broden`,'§2.1.1 Kostenstructuren · Opgave 7 · Boekpagina 8');
 const qf=q===500?'500':'1.000',tvk=q*.8,tk=500+tvk,tkf=tk===900?'900':'1.300';
 text(s,'Eerst de totalen (€ per maand)',60,188,1470,56,34,{bold:true,color:C.blue});
 text(s,`TCK = € 500\nTVK = 0,80 × ${qf} = € ${tvk}\nTK = 500 + ${tvk} = € ${tkf}`,60,270,1480,180,43);
 rule(s,60,494,1480);
 text(s,'Daarna delen door het aantal broden',60,532,1480,55,34,{bold:true,color:C.blue});
 const out=q===500?['1,00','0,80','1,80']:['0,50','0,80','1,30'];
 text(s,`GCK = 500 / ${qf} = € ${out[0]} per brood\nGVK = ${tvk} / ${qf} = € ${out[1]} per brood\nGTK = ${tkf} / ${qf} = € ${out[2]} per brood`,60,612,1480,196,43,{bold:true});
 notes(s,'8',`Laat zien dat GCK, GVK en GTK telkens een ander totaal door dezelfde ${qf} broden delen. Rekencontrole: GCK + GVK = GTK. De ${qf} broden passen binnen de capaciteit.`, 'Welke eenheid schrijf je bij de gemiddelden?', 'Q = 1000 betekent in deze context niet duizend euro, maar duizend broden per maand.',q===500?'Herhaal dezelfde berekening bij 1000 broden.':'Vergelijk eerst de totale bedragen bij beide hoeveelheden.');
}
bakeryCalculation(500);bakeryCalculation(1000);
{
 const s=slide('Opgave 7e · Eerst de totalen vergelijken','§2.1.1 Kostenstructuren · Opgave 7 · Boekpagina 8');
 table(s,[['Q (broden per maand)','TCK (€ per maand)','TVK (€ per maand)','TK (€ per maand)'],['500','500','400','900'],['1.000','500','800','1.300']],60,222,1480,283,[430,350,350,350],31);
 const r=[['TCK blijft gelijk','De ruimte en ovens blijven hetzelfde.'],['TVK verdubbelt','Tweemaal zoveel broden vragen tweemaal zoveel variabele kosten.'],['TK stijgt, maar verdubbelt niet','Alleen het variabele deel verdubbelt.']];
 r.forEach((a,i)=>{let y=561+i*89;text(s,a[0],60,y,645,78,32,{bold:true,color:[C.blue,C.green,C.orange][i]});text(s,a[1],757,y,780,78,31);});
 notes(s,'8', 'Vergelijk dezelfde maand bij gelijkblijvende capaciteit. TCK blijven 500; TVK gaan van 400 naar 800; TK gaan van 900 naar 1300. Verdubbeld TK zou 1800 zijn, maar dat gebeurt niet.', 'Welk deel van de 900 euro wordt bij verdubbeling van Q groter?', 'Het blijven betalen van vaste kosten betekent niet dat alle kosten vast zijn.', 'Gebruik deze totalen om de verandering per brood te verklaren.');
}
{
 const s=slide('Opgave 7e · Waarom halveert GTK niet?','§2.1.1 Kostenstructuren · Opgave 7 · Boekpagina 8');
 table(s,[['Q (broden per maand)','GCK (€ per brood)','GVK (€ per brood)','GTK (€ per brood)'],['500','1,00','0,80','1,80'],['1.000','0,50','0,80','1,30']],60,218,1480,282,[430,350,350,350],31);
 text(s,'Dezelfde € 500 wordt over tweemaal zoveel broden verdeeld.',60,552,1480,90,39,{bold:true,color:C.blue});
 text(s,'GCK halveert. GVK blijft € 0,80 per brood.',60,661,1480,65,38);
 text(s,'Alleen het vaste deel van GTK halveert: € 0,50 + € 0,80 = € 1,30.',60,752,1480,81,37,{bold:true,color:C.orange});
 notes(s,'8', 'Bouw de oorzaak-gevolgrelatie op: dezelfde totale constante kosten gedeeld door twee keer zoveel broden geeft een gehalveerde GCK. Per brood zijn nog steeds evenveel meel, verpakking en energie nodig tegen dezelfde kosten. GVK blijft dus gelijk. Daardoor daalt GTK van 1,80 naar 1,30 en niet naar 0,90 euro per brood.', 'Welk bedrag zou je krijgen als GTK wel zou halveren?', 'De conclusie geldt binnen de gegeven maand, capaciteit en vaste variabele kosten per brood.', 'Laat leerlingen één fout of ontbrekende verklaring verbeteren.');
}
{
 const s=slide('Antwoordcontrole bij opgave 7');
 const items=[['Indeling','Alle vier kostenposten hebben een soort én een reden.'],['Berekeningen','500 + 0,80Q levert TK in euro per maand.'],['Eenheden','GCK, GVK en GTK staan in euro per brood.'],['Verklaring','Je verklaart waarom alleen GCK halveert.']];
 items.forEach((a,i)=>{let y=208+i*139;text(s,a[0],60,y,425,58,38,{bold:true,color:C.blue});text(s,a[1],535,y,1000,95,36);});
 text(s,'Verbeter één ontbrekende stap of onjuiste uitleg in je eigen antwoord.',60,784,1480,52,32,{bold:true});
 notes(s,'8', 'Laat leerlingen hun eigen werk verbeteren. Volledige controle: TCK 500; TVK 0,80Q; TK 500 + 0,80Q. Bij 500 broden: 1,00; 0,80; 1,80 euro per brood. Bij 1000 broden: 0,50; 0,80; 1,30. Bij e moeten ook de totalen vergeleken zijn: 500/500, 400/800 en 900/1300 euro per maand.', 'Welke stap ontbrak nog in jouw antwoord?', 'Een juist eindgetal zonder eenheid of gevraagde redenering is nog geen volledig antwoord.', 'Laat de laatste overzichtsdia staan en laat het huiswerk in de agenda zetten.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(BUILD+'/manifest.json',JSON.stringify({slides:manifest,overviewSlides:[1,12,23],sourceCommit:'f6518f513d1f22f82922d4a8d3d3842c369b14f7',sourcePrintedPages:{start:6,basis:[6,7],independent:7,target:8},assignment:{start:[1,2],basis:[3,4],independent:[5,6],target:7,homework:[3,4,5,6,7]}},null,2));
console.log('Slides:',p.slides.items.length);
const draft=BUILD+'/candidate.pptx';
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
console.log('Exported',draft);
await fs.writeFile(BUILD+'/presentation.json',JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:FINAL+'/2.1.1 Kostenstructuren – presentatie.pptx',pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...Array.from(new Set(tables)).flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:Array.from(new Set(tables)),requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
