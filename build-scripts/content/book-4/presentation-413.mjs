// HOW TO ADAPT: read the current edition and complete target first. Update the
// adjacent manifest. Use one overview source and a fresh private workspace.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('413');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#1A5276',green:'#20665B',orange:'#A94D16',purple:'#7B2D8E',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',TITLE='Marginale opbrengst bij monopolie';
const sourceCommit='e734532a42b27732ac25ce990fc9448b12309d28';
const source=`https://github.com/meijer1973/4veco-lessen/blob/${sourceCommit}/edities/books34-v3/`;
const tables=[],charts=[],slides=[],overviews=[],graphContracts=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, editie books34-v3, gedrukte boekpagina ${page}. ${source}books/book-4/output/Boek_4_Compleet_v3.pdf\nManuscript en antwoordmodel: ${source}books/book-4/chapters/4.1/\n${authored?'Uitlegvoorbeeld — niet uit het boek. Was Nova en alle gegevens zijn voor deze les gemaakt. De boekverwijzing betreft uitsluitend de methode.':''}`);
}
function slide(title,footer=`§4.1.3 ${TITLE}`,titleSize=50){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,86,titleSize,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});slides.push({number:p.slides.items.length,title});return s;
}
function table(s,values,x,y,w,h,widths,size=34){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}
 tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.', 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 28.', 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide(`Deze les: §4.1.3 ${TITLE}`,undefined,42);overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'TO en MO afleiden; tabel invullen.\nTabelstap en punt onderscheiden.\nMO lager dan P verklaren.',972,244,565,122,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 29 · Opgaven 21 en 22\n22: verkennen met voorbeeld p. 28',972,459,565,95,30,{bold:active===2,name:'overview-start'});rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§4.1.3 · Opgaven 23 t/m 28\nBasis: 23, 24 en 25\nZelfstandig: 26 en 27\nDoelopgave: 28\nMaken en nakijken',972,654,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'28–33',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start 21–22 staat op p. 29. Basis 23 staat op p. 30, 24–25 op p. 31, zelfstandig 26–27 op p. 32 en doel 28 op p. 33. Huiswerk is 23 t/m 28 maken en nakijken. Bonus 29 en herhaling 30 zijn extra. Opgave 21 haalt vermenigvuldigen en de beperkte differentieerregel uit §3.2.2 op; die regel staat ook in de opgave. Bij moeite met uitwerken: vermenigvuldig q met elke term tussen de haakjes. Opgave 22 introduceert de twee omzetwerkingen. Laat leerlingen op p. 28 de twee verkoopplannen en stappen 3–4 gebruiken, de ontbrekende prijsverandering aanwijzen en hun twijfel noteren. Dit is ondersteunde verkenning. Laat opgave 22 na de uitleg opnieuw proberen vóór basis 23. De docenteninformatie adviseert voorlopig twee lessen van 55 minuten voor de hele normale route, zonder gemeten tijdsfit. Verschuif de lesgrens indien nodig en behoud alle basisopgaven.`, 'Welke stap lukt al, en waar wil je uitleg bij?', 'Hoofdstuklokale pagina 25 is boekpagina 29. Gebruik de gedrukte boekvoeter. Start 22 toetst geen veronderstelde beheersing van nieuwe leerstof.',active===7?'Laat het huiswerk in de agenda zetten.':'Ga door naar de volgende lesfase als de klas eraan toe is.');return s;
}
function ex(title,size=50){return slide(title,'Uitlegvoorbeeld — niet uit het boek · Was Nova',size);}
function target(title){return slide(title,'§4.1.3 · Doeloefening 28 · Pigment Prisma · Boekpagina 33');}
function en(s,page,e,q,m,t){notes(s,page,e,q,m,t,true);}
function lines(s,values,y=220,step=132,size=48){values.forEach((v,i)=>text(s,v,60,y+i*step,1480,92,size,{bold:i===values.length-1,color:i===values.length-1?C.purple:C.ink}));}

overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const rows=[['Vraagfunctie','TO en MO afleiden, met de tussenstappen.'],['Opbrengsttabel','P en TO berekenen en controleren.'],['Stap en punt','Een gemiddelde verandering onderscheiden van MO.'],['Uniforme prijs','Beide effecten op de totale opbrengst uitleggen.']];
 rows.forEach((a,i)=>{let y=210+i*146;text(s,a[0],60,y,480,58,39,{bold:true,color:C.blue});text(s,a[1],575,y,945,108,38);if(i<3)rule(s,60,y+118,1480);});
 notes(s,'24–28','Verbind de doelen aan opgave 28. Onderscheid een totaalbedrag per week en een bedrag per kg. De winstkeuze volgt in §4.1.4 nadat kosten zijn toegevoegd.','Wat meet een prijs per kg, en wat meet TO?','De hoogste omzet is geen bewijs van de hoogste winst.','Haal eerst de beperkte differentieerregel op.');
}
{
 const s=slide('De bekende differentieerregel');
 text(s,'aq² + bq + c heeft afgeleide 2aq + b',60,192,1480,70,46,{bold:true,color:C.blue});
 table(s,[['Term','Bewerking','Afgeleide'],['0,30q²','0,30 × 2; q² wordt q','0,60q'],['5q','q valt weg','5'],['80','Verandert niet met q','0']],60,312,1480,360,[440,660,380],36);
 text(s,'Het teken van elke term gaat mee.',60,727,1480,65,40,{bold:true,color:C.orange});
 notes(s,'25','Ververs de expliciet onderwezen regel uit Boek 3 §3.2.2, “Een beperkte rekenregel” en “Doe het één term tegelijk”. Dit rekenvoorbeeld is zelf gemaakt: de afgeleide van 0,30q² + 5q + 80 is 0,60q + 5. Bij opbrengsten gebruiken we straks ook een negatieve kwadratische term. Start 21 krijgt hier geen uitgewerkt antwoord.','Wat gebeurt er met een constante term?','De constante blijft in de oorspronkelijke functie staan.','Vergelijk twee verkoopplannen van Was Nova.');
}
{
 const s=ex('Twee verkoopplannen voor dezelfde week');
 text(s,'Was Nova verkoopt als enige een bijzondere meubelwas.',60,188,1480,60,38);
 text(s,'P = 28 − 0,40q',60,277,1480,75,52,{bold:true,color:C.blue});
 text(s,'q: kg per week, 0 ≤ q ≤ 70 · P: € per kg',60,369,1480,55,34);
 table(s,[['Weekplan','q (kg per week)','P (€ per kg)','TO (€ per week)'],['A','10','24','240'],['B','20','20','400']],60,457,1480,249,[300,400,390,390],32);
 text(s,'Binnen elk plan betaalt iedereen dezelfde prijs.',60,745,1480,65,38,{bold:true});
 en(s,'24–25','Zelfgemaakt doorlopend rekenmodel. Ook delen van een kg zijn mogelijk. Overige vraagfactoren blijven gelijk. Vul 10 en 20 in dezelfde vraagfunctie in. TO is P maal q. Vergelijk alternatieve plannen voor dezelfde week: er is geen terugbetaling aan eerdere kopers. De eerste 10 kg kosten in plan B ook 20 euro per kg.','Welke prijs geldt in plan B voor de eerste 10 kg?','Het tweede plan verkoopt niet eerst 10 kg voor 24 euro en daarna 10 kg voor 20 euro.','Splits de omzetverandering in twee effecten.');
}
{
 const s=ex('Meer afzet verandert twee bedragen');
 table(s,[['Effect van plan A naar B','Berekening','Verandering TO'],['10 extra kg tegen de nieuwe prijs','10 × € 20','+ € 200'],['Lagere prijs op de eerste 10 kg','10 × (€ 24 − € 20)','− € 40']],60,212,1480,350,[640,470,370],34);
 text(s,'Netto: € 200 − € 40 = € 160 per week',60,625,1480,73,47,{bold:true,color:C.green});
 text(s,'Controle: TO nieuw − TO oud = 400 − 240 = € 160',60,744,1480,62,35);
 en(s,'24, 28','De extra 10 kg leveren 200 euro op. De lagere uniforme prijs vermindert de opbrengst op de eerste 10 kg met 40 euro. Netto stijgt TO met 160 euro per week. Laat beide bedragen aanwijzen en controleer met het verschil tussen de totale opbrengsten. Dit mechanisme komt vóór de algemene conclusie over MO en P.','Waarom is de omzettoename kleiner dan 200 euro?','De prijsdaling raakt alle kg in het tweede weekplan.','Schrijf TO als functie van q.');
}
{
 const s=ex('Van de vraagfunctie naar TO');
 lines(s,['P = 28 − 0,40q','TO = P × q','TO = (28 − 0,40q) × q','TO = 28q − 0,40q²'],207,134,49);
 text(s,'TO: € per week',60,778,1480,50,34,{bold:true});
 en(s,'25','Vul de volledige prijsfunctie tussen haakjes in. Vermenigvuldig beide termen met q. 0,40q maal q wordt 0,40q² en behoudt het minteken. Controle bij q = 10: 280 − 40 = 240 euro per week, hetzelfde als P × q.','Waarom ontstaat q²?','Alleen 28 met q vermenigvuldigen laat de prijsdaling weg.','Differentieer elke term van TO.');
}
{
 const s=ex('Van TO naar MO');
 text(s,'TO = 28q − 0,40q²',60,191,1480,78,48,{bold:true,color:C.purple});
 table(s,[['Term in TO','Bewerking','Bijdrage aan MO'],['28q','q valt weg','28'],['−0,40q²','−0,40 × 2; q² wordt q','−0,80q']],60,316,1480,291,[440,620,420],36);
 text(s,'MO = 28 − 0,80q',60,672,1480,75,53,{bold:true,color:C.purple});
 text(s,'MO: € per kg bij een heel kleine uitbreiding rond q',60,777,1480,52,34);
 en(s,'25','MO is de afgeleide van TO in dit doorlopende model. Het minteken blijft staan. De eerste term geeft 28, de tweede −0,80q. MO beschrijft de verandering van TO per kg bij een heel kleine uitbreiding rond één punt.','Welke eenheid hoort bij MO?','MO is geen totaalbedrag en niet exact het verschil voor een hele extra kg.','Vul eerst de opbrengsttabel in.');
}
{
 const s=ex('Een opbrengsttabel invullen');
 text(s,'P = 28 − 0,40q     TO = P × q',60,190,1480,66,43,{bold:true});
 table(s,[['q (kg per week)','P (€ per kg)','TO (€ per week)'],['10','24','240'],['20','20','400'],['30','16','480']],60,308,1480,360,[480,460,540],36);
 text(s,'Bij q = 30: P = 28 − 0,40 × 30 = € 16 per kg',60,708,1480,55,35);
 text(s,'TO = 16 × 30 = € 480 per week',60,773,1480,58,38,{bold:true,color:C.purple});
 en(s,'25, 28','Bereken eerst P en dan TO. Controleer de derde rij met 28 × 30 − 0,40 × 30² = 840 − 360 = 480. Dit is een eigen voorbeeld, niet de invultabel van opgave 24 of 28.','Hoe veranderen de twee factoren van TO?','Een lagere prijs maakt TO niet automatisch lager.','Bereken de gemiddelde extra opbrengst over een tabelstap.');
}
{
 const s=ex('De gemiddelde extra opbrengst over een stap');
 text(s,'Van 10 naar 20 kg per week',60,190,1480,60,39,{bold:true,color:C.blue});
 lines(s,['ΔTO = 400 − 240 = € 160 per week','Δq = 20 − 10 = 10 kg per week','ΔTO / Δq = 160 / 10 = € 16 per kg'],306,145,47);
 text(s,'Een gemiddelde over de hele stap van 10 kg',60,752,1480,70,38,{bold:true});
 en(s,'27–28','Delta betekent verandering: nieuw minus oud. Deel de toename van TO door de toename van q. Euro per week gedeeld door kg per week geeft euro per kg. Dezelfde 160 euro vonden we met de twee omzetwerkingen.','Meet 16 euro één beginpunt of de hele stap?','De totale toename van 160 euro is geen MO van 160 euro per kg.','Lees P en MO op dezelfde hoeveelheidsas.');
}
function revenueGraph(mode){
 const titles=['De vraaglijn geeft de verkoopprijs','MO en P horen bij dezelfde hoeveelheid','Een positieve prijs kan samengaan met negatieve MO'];
 const s=ex(titles[mode],mode===2?44:50);
 text(s,'P = 28 − 0,40q'+(mode?'     MO = 28 − 0,80q':''),60,185,1480,58,37,{bold:true});
 const xs=[0,10,20,30,35,40,50,60,70];
 const series=[{name:'P = GO (q > 0)',xValues:xs,values:xs.map(q=>28-.4*q),line:{fill:C.blue,width:4},marker:{symbol:'none'}}];
 if(mode)series.push({name:'MO',xValues:xs,values:xs.map(q=>28-.8*q),line:{fill:C.purple,width:4},marker:{symbol:'none'}});
 const ch=s.charts.add('scatter',{position:{left:60,top:265,width:1020,height:516},series,scatterOptions:{style:'line'},hasLegend:false,dataLabels:{showValue:false,showSeriesName:false},xAxis:{min:0,max:70,majorUnit:10,tickLabelPosition:'low',numberFormatCode:'0',title:{text:'q (kg per week)',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5}},yAxis:{min:-28,max:28,majorUnit:14,numberFormatCode:'0',title:{text:'P en MO (€ per kg)',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphContracts.push({slide:p.slides.items.length,xMin:0,xMax:70,yMin:-28,yMax:28,series:series.map(v=>({name:v.name,x:v.xValues,y:v.values}))});
 text(s,'P = GO',885,404,190,43,30,{bold:true,color:C.blue,name:'direct-price-label'});
 if(mode)text(s,'MO',705,594,155,48,30,{bold:true,color:C.purple,name:'direct-mo-label'});
 const values=mode===0?['Bij q = 10','P = € 24 per kg','Bij q = 20','P = € 20 per kg']:mode===1?['Bij q = 10','MO = € 20 per kg','Bij q = 20','MO = € 12 per kg']:['Bij q = 40','P = € 12 per kg','MO = −€ 4 per kg','Iets minder afzet\nverhoogt hier TO.'];
 values.forEach((v,i)=>text(s,v,1120,285+i*112,420,i===3?110:65,i%2===0?34:35,{bold:i%2===0,color:i===2&&mode===2?C.purple:C.ink}));
 text(s,mode===2?'MO = 0 bij q = 35: hoogste TO in dit model. Kosten ontbreken.':mode===1?'De prijsverlaging werkt ook door op de eerste hoeveelheid.':'Uniforme prijs: GO = P bij q > 0.',60,795,1470,45,30,{bold:true});
 en(s,'26–27',mode===0?'q staat horizontaal en euro per kg verticaal. P daalt van 28 bij nul naar 0 bij 70. De assen blijven op de volgende dia’s gelijk. GO = TO / q is bij nul ongedefinieerd; de lijn toont daar alleen de prijsgrens.':mode===1?'MO heeft dezelfde verticale intercept als P maar daalt tweemaal zo snel. Bij q = 10 is P 24 en MO 20; bij q = 20 is P 20 en MO 12. Benoem de lagere opbrengst op de eerste hoeveelheid als oorzaak. Bij q > 0 is MO lager dan P. Bij nul vallen de lijnwaarden samen.':'Bij q = 40 is P 12 en MO −4. Iets meer verkopen verlaagt TO doordat de lagere prijs op alle kg zwaarder weegt. Iets minder afzet verhoogt TO lokaal. MO wisselt van positief naar negatief bij 35, met P 14 en TO 490 euro per week. Zonder kosten volgt geen winstmaximum.',mode===0?'Welke prijs hoort bij 20 kg?':mode===1?'Waarom ligt MO onder P?':'Wat doet een kleine vermindering rond 40 kg met TO?',mode===2?'Negatieve MO is geen negatieve verkoopprijs. Omzet en winst verschillen.':'GO bij q = 0 kun je niet berekenen door TO door q te delen.',mode===0?'Voeg MO toe op dezelfde assen.':mode===1?'Vergelijk de puntwaarden met het tabelgemiddelde.':'Probeer startopgave 22 opnieuw.');
}
revenueGraph(0);revenueGraph(1);
{
 const s=ex('Een tabelstap en twee puntwaarden');
 table(s,[['Wat meet je?','Berekening','Uitkomst'],['Gemiddelde over 10 tot 20 kg','(400 − 240) / (20 − 10)','€ 16 per kg'],['MO op het beginpunt q = 10','28 − 0,80 × 10','€ 20 per kg'],['MO op het eindpunt q = 20','28 − 0,80 × 20','€ 12 per kg']],60,229,1480,410,[580,535,365],33);
 text(s,'MO daalt onderweg. De hele stap heeft één gemiddelde.',60,714,1480,102,42,{bold:true,color:C.purple});
 en(s,'27–28','Het gemiddelde van de hele stap is 16, de beginwaarde 20 en de eindwaarde 12. De puntwaarde beschrijft een heel kleine uitbreiding rond q. Bij lineaire MO ligt het intervalgemiddelde halverwege de eindwaarden, maar leerlingen gebruiken verschil in TO gedeeld door verschil in q.','Moeten een beginpunt en een hele stap dezelfde uitkomst geven?','Het verschil is geen afrondingsfout: het zijn verschillende metingen.','Bekijk wat negatieve MO betekent.');
}
revenueGraph(2);
{
 const s=slide('Terug naar startopgave 22');
 text(s,'Boekpagina 29 · steun: voorbeeld Luma op pagina 28',60,196,1480,65,37,{bold:true,color:C.blue});
 text(s,'Welke prijsverandering op de eerste 30 kg ontbrak?',60,339,1480,122,48,{bold:true});
 text(s,'Herstel je eigen redenering en controleer ΔTO.',60,533,1480,113,46);
 text(s,'Gebruik beide omzetwerkingen voordat je verder oefent.',60,731,1480,70,37);
 notes(s,'28–29','Dit is de terugkeer naar de eerder verkende startopgave. Laat leerlingen eerst hun eigen antwoord herstellen. Luma: de prijs op de eerste 30 kg daalt van 9 naar 8 euro, dus 30 euro minder opbrengst. Extra 10 kg geven 80 euro, netto 50. Controle: 320 − 270 = 50. Bespreek desgewenst deze reeds gemaakte startvraag. Geef extra steun vóór basis 23 waar nodig.','Welk bedrag ontbrak in je eerste poging?','Luma is een andere context met andere gegevens dan Was Nova.','Laat het overzicht staan tijdens het basiswerk.');
}
overview('Zelfstandig werken',4);
{
 const s=target('Opgave 28 · Pigment Prisma');
 text(s,'Prisma is in dit oefenmodel de enige verkoper van een specifiek pigment.',60,186,1480,96,36);
 text(s,'P = 30 − 0,50q     0 ≤ q ≤ 60',60,299,1480,75,48,{bold:true,color:C.blue});
 text(s,'P is euro per kg; q is kg per week. Alle kg binnen een weekplan\nhebben dezelfde prijs. De hoeveelheden kunnen in dit rekenmodel\nook delen van een kg zijn.',60,394,1480,151,34);
 table(s,[['q (kg per week)','P (€ per kg)','TO (€ per week)'],['10','…','…'],['20','…','…'],['30','…','…']],60,578,1480,236,[480,460,540],31);
 notes(s,'33','De volledige bron en de volledige nog lege tabel horen bij de doelopgave. Gebruik de bron. Noteer bij ieder bedrag wat het meet. Dit is een nieuw model, met P = 30 − 0,50q en bovengrens 60. Laat alle volgende deelvragen zien voordat antwoorden worden onthuld.','Wat betekenen P en q?','De formule van Was Nova hoort hier niet bij.','Lees vragen a, b en c zonder uitwerking.');
}
{
 const s=target('Opgave 28 · Vragen a, b en c');
 text(s,'Gebruik de bron. Noteer bij ieder bedrag wat het meet.',60,184,1480,59,35,{bold:true,color:C.blue});
 text(s,'a. (2p) Stel uit de vraagfunctie de TO-functie en de MO-functie op. Laat de tussenstap met haakjes zien.',60,289,1480,130,39);
 text(s,'b. (2p) Neem de tabel over en vul de prijzen en totale opbrengsten in.',60,456,1480,120,39);
 text(s,'c. (3p) Bereken met de tabel de gemiddelde extra opbrengst per kg van 20 naar 30 kg. Bereken daarnaast MO bij q = 20 en leg uit waarom de uitkomsten verschillen.',60,617,1480,170,39);
 notes(s,'33','De vragen zijn uit de huidige doelopgave overgenomen. Houd de context en lege tabel beschikbaar. Nog geen uitkomsten tonen. Deel c vraagt twee berekeningen én een verklaring.','Welke twee metingen vraagt c?','Alleen twee getallen beantwoordt de verklaring niet.','Laat ook d en e zien vóór de bespreking.');
}
{
 const s=target('Opgave 28 · Vragen d en e');
 text(s,'d. (3p) Bereken voor de stap van 20 naar 30 kg afzonderlijk de opbrengst van de extra kg en de lagere opbrengst op de eerste 20 kg. Controleer de netto omzettoename.',60,225,1480,180,40);
 text(s,'e. (2p) Een leerling zegt: “Bij q = 20 is de prijs € 20. Daarom moet MO ook € 20 zijn.” Beoordeel met je berekening en de uniforme prijs uit de bron.',60,471,1480,180,40);
 text(s,'Laat je controle zien: twee berekeningen van dezelfde ΔTO.',60,747,1480,70,35,{bold:true,color:C.blue});
 notes(s,'33','Nu zijn bron, tabel en alle vijf deelvragen getoond zonder oplossingen. Laat leerlingen hun eigen werk erbij houden. De boeksteun zegt: twee manieren om dezelfde verandering van TO te berekenen moeten hetzelfde totaal opleveren. Een MO-puntwaarde en een gemiddelde over een grote stap hoeven niet gelijk te zijn.','Welke controle verbindt c met d?','De doelopgave omvat ook de brongebonden verklaring bij e.','Begin de uitwerking bij TO.');
}
{
 const s=target('28a · De totale opbrengst');
 lines(s,['P = 30 − 0,50q','TO = P × q','TO = (30 − 0,50q) × q','TO = 30q − 0,50q²'],204,133,50);
 text(s,'q: kg per week · TO: € per week',60,776,1480,55,35);
 notes(s,'33','Vervang P door de volledige vraagfunctie tussen haakjes. Vermenigvuldig beide termen met q. Controle bij q = 20: 30 × 20 − 0,50 × 20² = 600 − 200 = 400. Dat controleren we ook met P × q.','Waar komt q² vandaan?','De prijsverlaging moet mee in TO.','Differentieer deze TO-functie.');
}
{
 const s=target('28a · De marginale opbrengst');
 table(s,[['Term in TO','Afgeleide'],['30q','30'],['−0,50q²','−1,00q']],60,230,1480,330,[840,640],42);
 text(s,'MO = 30 − q',60,625,1480,88,59,{bold:true,color:C.purple});
 text(s,'MO: € per kg bij een heel kleine uitbreiding rond q',60,774,1480,53,34);
 notes(s,'33','Differentieer term voor term. Tweemaal −0,50 is −1. Dus MO = 30 − q. TO is euro per week; MO euro per kg. Laat leerlingen hun tussenstappen controleren.','Welk minteken moet blijven staan?','MO is niet de verkoopprijs P = 30 − 0,50q.','Vul per rij eerst P en dan TO in.');
}
{
 const s=target('28b · De opbrengsttabel');
 table(s,[['q (kg per week)','P (€ per kg)','TO (€ per week)'],['10','25','250'],['20','20','400'],['30','15','450']],60,228,1480,378,[480,460,540],37);
 text(s,'Bij q = 20: P = 30 − 0,50 × 20 = € 20 per kg',60,662,1480,63,37);
 text(s,'TO = 20 × 20 = € 400 per week',60,754,1480,69,42,{bold:true,color:C.purple});
 notes(s,'33','Alle rijen: bij 10 kg is P = 30 − 5 = 25 en TO = 25 × 10 = 250; bij 20 is P = 20 en TO = 400; bij 30 is P = 30 − 15 = 15 en TO = 15 × 30 = 450. De TO-functie geeft dezelfde totalen.','Waarom zet je bij 400 euro per week?','Prijs en TO hebben verschillende eenheden.','Gebruik het verschil tussen de laatste twee rijen.');
}
{
 const s=target('28c · Gemiddelde over 20 tot 30 kg');
 lines(s,['ΔTO = 450 − 400 = € 50 per week','Δq = 30 − 20 = 10 kg per week','ΔTO / Δq = 50 / 10 = € 5 per kg'],229,177,48);
 text(s,'Dit gemiddelde hoort bij de hele tabelstap.',60,763,1480,61,39,{bold:true});
 notes(s,'33','Gebruik twee verschillen. Deel 50 euro per week door 10 kg per week. Het antwoord is gemiddeld 5 euro per extra kg over deze stap.','Over hoeveel kg bereken je het gemiddelde?','De uitkomst is niet 50 euro per kg en ook niet TO gedeeld door q.','Bereken afzonderlijk MO op het beginpunt.');
}
{
 const s=target('28c · MO bij het beginpunt');
 text(s,'MO(20) = 30 − 20 = € 10 per kg',60,217,1480,88,52,{bold:true,color:C.purple});
 table(s,[['Meting','Betekenis','Uitkomst'],['MO(20)','Puntwaarde bij q = 20','€ 10 per kg'],['ΔTO / Δq','Gemiddelde van 20 tot 30 kg','€ 5 per kg']],60,367,1480,290,[410,700,370],35);
 text(s,'MO daalt tijdens de stap tot € 0 per kg bij q = 30.',60,718,1480,104,41,{bold:true});
 notes(s,'33','De afgeleide geldt op één punt. Bij q = 20 is die 10 euro per kg, bij q = 30 nul. Het gemiddelde over de hele toename is daardoor niet gelijk aan de beginwaarde. De verklaring hoort bij c.','Waarom zijn 10 en 5 allebei juist?','Intervalgemiddelde en puntwaarde zijn verschillende metingen.','Splits dezelfde omzettoename in twee effecten.');
}
{
 const s=target('28d · De twee omzetwerkingen');
 table(s,[['Effect','Berekening','Verandering TO'],['10 extra kg tegen € 15','10 × 15','+ € 150'],['€ 5 minder op de eerste 20 kg','20 × (20 − 15)','− € 100']],60,230,1480,330,[650,425,405],34);
 text(s,'Netto: € 150 − € 100 = € 50 per week',60,622,1480,88,48,{bold:true,color:C.green});
 text(s,'Controle: TO nieuw − TO oud = 450 − 400 = € 50',60,758,1480,64,36);
 notes(s,'33','Gebruik voor de extra kg de nieuwe prijs 15. Gebruik voor de eerste 20 kg het prijsverschil 20 − 15. Trek de lagere opbrengst van de extra opbrengst af. De 50 euro per week is hetzelfde totaal als bij c vóór delen door 10.','Welke prijs hoort bij de 10 extra kg?','Alleen extra verkoop tellen vergeet het verlies van 100 euro op de eerste hoeveelheid.','Beoordeel de uitspraak over prijs en MO.');
}
{
 const s=target('28e · Prijs en MO bij q = 20');
 table(s,[['Grootheid','Berekening','Bedrag per kg'],['Verkoopprijs P','30 − 0,50 × 20','€ 20'],['Marginale opbrengst MO','30 − 20','€ 10']],60,217,1480,308,[510,550,420],38);
 text(s,'De uitspraak is onjuist.',60,584,1480,67,47,{bold:true,color:C.orange});
 text(s,'Meer afzet vraagt een lagere uniforme prijs.\nOok de eerste hoeveelheid levert daardoor minder op.',60,695,1480,121,39,{bold:true});
 notes(s,'33','De koper betaalt 20 euro per kg, maar de verandering van TO bij een kleine uitbreiding is 10 euro per kg. Door de uniforme prijs raakt de prijsverlaging ook de eerste hoeveelheid. Noem de berekening én het mechanisme uit de bron.','Waarom is alleen “de MO-lijn ligt lager” geen verklaring?','De grafiekpositie is het gevolg, niet de economische oorzaak.','Controleer je eigen antwoord.');
}
{
 const s=slide('Controle van je doelopgave');
 const items=[['a en b','Functies, haakjes, tabel en eenheden.'],['c','Een hele stap én een puntwaarde, met verklaring.'],['d','Extra afzet, lagere prijs en dezelfde netto ΔTO.'],['e','De berekening verbonden aan de uniforme prijs.']];
 items.forEach((a,i)=>{let y=219+i*139;text(s,a[0],60,y,220,66,41,{bold:true,color:C.blue});text(s,a[1],322,y,1210,105,39);});
 text(s,'Verbeter één ontbrekende stap in je eigen uitwerking.',60,782,1480,55,35,{bold:true});
 notes(s,'33','Controleer a tot en met e, niet alleen de eindgetallen. a: TO = 30q − 0,50q² en MO = 30 − q. b: 250, 400, 450 euro per week. c: 5 tegenover 10 euro per kg met stap/puntverklaring. d: 150 − 100 = 50 euro per week. e: P 20 tegenover MO 10, met beide omzetwerkingen.','Welke redenering kun je scherper opschrijven?','Een juist getal vervangt een gevraagde uitleg niet.','Zet het huiswerk in de agenda.');
}
overview('Afsluiting / huiswerk',7);
await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({slides,overviewSlides:overviews,tables,charts,sourceCommit,graphContracts},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,`4.1.3 ${TITLE} – presentatie.pptx`),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...Array.from(new Set(tables)).flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:Array.from(new Set(tables)),requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({finalPath:result.finalPath,slides:p.slides.items.length,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
