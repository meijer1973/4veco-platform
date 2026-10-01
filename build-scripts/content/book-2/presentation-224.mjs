// HOW TO ADAPT: read the classroom recipe and the new paragraph's complete
// questions/answers first. Update the adjacent manifest, examples and discussion;
// keep the overview in one function. Runtime paths come from the installed skill.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const authored = JSON.parse(await fs.readFile(fileURLToPath(new URL('./presentation-224.manifest.json',import.meta.url)),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('224');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', tables=[], slides=[], overviews=[];
const source=`https://github.com/meijer1973/4veco-lessen/blob/${authored.sourceCommit}/`+encodeURI(authored.sourceEdition)+'/';
const footer='§2.2.4 Gemengde opgaven';
const exampleFooter=footer+' · Uitlegvoorbeeld — niet uit het boek';
const targetFooter=footer+' · Opgave 5 · Boekpagina 67–68';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,foot=footer){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,86,52,{bold:true});rule(s,60,146,1480);
 text(s,foot,60,848,1400,30,21,{color:C.muted,name:'footer'});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title});return s;
}
function notes(s,page,explanation,question,pitfall,transition,example=false){
 const provenance=example
  ? `Zelfgemaakt uitlegvoorbeeld Klimwand; context, gegevens en uitkomsten zijn niet uit het boek. Methoden: leerlingenboek Boek 2, chat-2026, gedrukte pagina's 37–64. ${source}boek/Boek_2_Compleet.pdf`
  : `Leerlingenboek Boek 2, chat-2026, gedrukte pagina ${page}. ${source}boek/Boek_2_Compleet.pdf\nAntwoordmodel: ${source}bronnen/H2/${encodeURIComponent('2.2 Elasticiteit – antwoorden.md')}`;
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: ${provenance}`);
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
 const s=slide('Deze les: §2.2.4 Gemengde opgaven');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,606,700,774],hs=[80,45,45,125,73,65,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Bronnen kiezen; Ev, Ei en Ek.\nOmzet en vraag berekenen.\nEen advies onderbouwen.',972,244,565,122,31,{name:'overview-goals'});
 rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 65\nOpgave 1',972,459,565,95,33,{bold:active===2,name:'overview-start'});
 rule(s,972,570,568);
 text(s,'Huiswerk',972,591,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§2.2.4 · Opgaven 1–7\nGemengd: 1–4 · Doel: 5\nBonus / denkertje: 6\nHoofdstukcheck: 7\nMaken en nakijken',972,650,565,184,30,{bold:active===7,name:'overview-homework'});
 notes(s,'65–70',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start: opgave 1, gedrukte pagina 65. Er is geen afzonderlijke basis- of begeleide sectie. Werk met gemengde opgaven 1–4 naar doel 5 (StreamPlus, p. 67–68). Die echte doelopgave is gekozen omdat zij bronselectie, Ev, Ei, Ek, maandomzet, een één-factor-scenario en een begrensd advies combineert. Huiswerk: alle opgaven 1–7 maken en nakijken; behoud de labels bonus/denkertje bij 6 en hoofdstukcheck bij 7. De algemene docentenroute noemt 6 en 7 aanvullend; de classroom-afspraak voor gemengde paragrafen wijst alle opgaven toe. Plan zo nodig verdere werktijd; de volledige route is niet als één les getimed.`,active===2?'Welke verandering bepaalt de noemer?':'Welke berekening of redenering wil je verbeteren?', 'Een bron met andere gegevens is een afzonderlijk onderzoek. Voeg die gegevens niet zomaar samen.',active===7?'Laat leerlingen het huiswerk in hun agenda zetten.':'Ga door als de klas toe is aan de volgende lesfase.');
}

overview('Startopdracht',2);
{
 const s=slide('Klimwand · Prijsreactie en omzet',exampleFooter);
 text(s,'A · Dagkaarten, per maand · Andere vraagfactoren blijven gelijk',60,187,1480,55,33,{bold:true,color:C.blue});
 table(s,[['Gegeven','Oud','Nieuw'],['Prijs per dagkaart','€ 25','€ 30'],['Verkochte dagkaarten','400','360']],60,260,1480,240,[780,350,350],33);
 text(s,'%ΔP = (30 − 25) / 25 × 100% = +20%',60,543,1480,55,36);
 text(s,'%ΔQ = (360 − 400) / 400 × 100% = −10%',60,613,1480,55,36);
 text(s,'Ev = −10% / +20% = −0,5 → prijsinelastisch',60,683,1480,55,37,{bold:true,color:C.blue});
 text(s,'TO: 25 × 400 = € 10.000 → 30 × 360 = € 10.800 per maand',60,768,1480,64,35,{bold:true,color:C.green});
 notes(s,'37–52','Dit aparte, zelfgemaakte voorbeeld haalt bekende bewerkingen op. Dagkaarten worden volledig verkocht. Selecteer P en Q uit dezelfde situatie; bereken procentveranderingen met de oude waarde als noemer. Het negatieve teken geeft tegengestelde richtingen aan. −1 < −0,5 < 0: Q reageert relatief zwak. Vergelijk TO rechtstreeks: de gemeten omzet stijgt 800 euro per maand. Beperk dit tot deze waarneming; leid de omzetrichting bij eindige stappen niet uitsluitend af uit het elasticiteitslabel.','Waarom delen we de afname van 40 dagkaarten door 400?', 'Elasticiteit heeft geen euro-eenheid. Omzet is geen winst; bij eindige veranderingen blijft een directe omzetvergelijking nodig.', 'Gebruik bij inkomen en andere prijzen dezelfde teller, met een andere noemer.',true);
}
{
 const s=slide('Klimwand · Inkomen en een concurrent',exampleFooter);
 text(s,'B en C · Afzonderlijke metingen; andere vraagfactoren blijven gelijk',60,186,1480,62,32,{bold:true,color:C.blue});
 table(s,[['Onderzoek','Veranderingen','Berekening en indeling'],
 ['B · Pluskaart','Y: +6% · Q: +9%','Ei = +9% / +6% = +1,5\nLuxegoed'],
 ['B · Basiskaart','Y: +6% · Q: −3%','Ei = −3% / +6% = −0,5\nInferieur goed'],
 ['C · Dagkaart Klimwand','Prijs concurrent: +12%\nVraag Klimwand: +3%','Ek = +3% / +12% = +0,25\nSubstituten']],60,279,1480,400,[405,475,600],31);
 text(s,'Ei: inkomen in de noemer',60,729,700,61,35,{bold:true,color:C.blue});
 text(s,'Ek: prijs van de ándere dienst',810,729,730,61,35,{bold:true,color:C.green});
 notes(s,'53–64','Zelfgemaakte gegevens, afzonderlijke onderzoeken. B: bij 6% meer inkomen groeit de vraag naar Plus 9% en daalt de vraag naar Basis 3%. C: alleen de prijs van een concurrerende klimhal stijgt 12%; de vraag naar Klimwand groeit 3%. Benoem bij Ek de vraag naar Klimwand in de teller en de prijs van de concurrerende klimhal in de noemer. Een positieve Ek past bij substituten; een negatieve bij complementen. Ei-indeling volgens dit boek: onder nul inferieur, tussen nul en één normaal, boven één luxe. Grenzen nul en één krijgen hier geen categorie. De categorie geldt voor de onderzochte situatie.','Welk goed staat bij Ek in de teller, en welk in de noemer?', 'De prijs van Klimwand is niet de noemer van deze kruislingse elasticiteit. Tel de gemeten effecten uit afzonderlijke bronnen niet op.', 'Een regionaal model heeft eveneens zijn eigen gegevens.',true);
}
{
 const s=slide('Klimwand · Alleen het inkomen verandert',exampleFooter);
 text(s,'D · Regionaal model: Q = 200 − 2P + 0,01Y + 3Pc',60,196,1480,77,42,{bold:true,color:C.blue});
 text(s,'Q: dagkaarten per maand · P en Pc: € per dagkaart · Y: € per jaar',60,284,1480,58,31);
 table(s,[['Scenario','P','Pc','Y'],['Begin','25','20','30.000'],['Alleen hoger inkomen','25','20','30.600']],60,377,1480,223,[650,220,220,390],32);
 text(s,'Q oud = 200 − 2 × 25 + 0,01 × 30.000 + 3 × 20 = 510',60,645,1480,64,36);
 text(s,'Q nieuw = 200 − 2 × 25 + 0,01 × 30.600 + 3 × 20 = 516',60,718,1480,64,36,{bold:true,color:C.green});
 text(s,'ΔQ = +6 dagkaarten per maand · P en Pc blijven gelijk',60,792,1480,46,30,{bold:true});
 notes(s,'56–64','Het zelfgemaakte regionale model is apart van meting A. Begin met volledig invullen: 200 − 50 + 300 + 60 = 510. Alleen Y verandert: 200 − 50 + 306 + 60 = 516. De inkomensterm stijgt zes; de andere termen blijven gelijk. Dit is de gevraagde hoeveelheid binnen het model, geen bewezen extra omzet uit meting A. Het jaarinkomen wordt niet door twaalf gedeeld.','Welke term verandert als alleen Y stijgt?', 'De 400 verkochte dagkaarten uit A horen niet in dit regionale model; de coëfficiënt 0,01 is geen elasticiteit.', 'Gebruik berekeningen als bewijs en geef ook de grens aan.',true);
}
{
 const s=slide('Klimwand · Een onderbouwd advies',exampleFooter);
 const rows=[['Ondersteund · A','De onderzochte prijsstap verhoogde de maandomzet met € 800.'],['Tweede bron · C','De diensten zijn substituten: klanten reageren op de concurrentprijs.'],['Advies','Onderzoek een kleine volgende prijsstap en vergelijk opnieuw de omzet.'],['Niet bewezen · precies twee','Dezelfde reactie bij een volgende prijsstap.\nHogere winst: kostengegevens ontbreken.']];
 rows.forEach((r,i)=>{let y=205+i*149;text(s,r[0],60,y,520,80,35,{bold:true,color:i===3?C.orange:C.blue});text(s,r[1],625,y,915,122,35);if(i<3)rule(s,60,y+125,1480);});
 notes(s,'45–52, 65–68','Dit advies gaat uitsluitend over het zelfgemaakte Klimwand-voorbeeld. Verbind de berekende omzetstijging uit A met het kruisverband uit C. C geeft reden om concurrentprijzen mee te nemen bij een volgende stap, maar voorspelt niet automatisch de reactie op een eigen prijsverhoging. Noem één ondersteunde conclusie en precies twee niet-bewezen conclusies. De brongegevens ondersteunen de uitspraak over omzet; winst vraagt ook kosten. Leerlingen moeten deze antwoordvorm straks zelf op boekbronnen toepassen.','Welke zin is een bewezen waarneming en welke een advies?', 'Een voorstel om te onderzoeken is geen garantie dat de omzet of winst zal stijgen.', 'Laat het overzicht staan terwijl leerlingen de gemengde opgaven maken.',true);
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 5 · StreamPlus',targetFooter);
 text(s,'StreamPlus onderzoekt één recente prijsverhoging en mogelijke vervolgstappen.',60,182,1480,104,38,{bold:true});
 text(s,'Vragen 1–5: gebruik telkens alleen de aangegeven bron.\nVraag 6: combineer minstens twee bronnen.',60,300,1480,104,35,{color:C.blue});
 text(s,'Bron A · Standaardabonnement',60,433,1480,62,38,{bold:true});
 table(s,[['Gegeven','Oud','Nieuw'],['Prijs Standaard','€ 10','€ 12'],['Abonnees','50.000','43.000'],['Appscore','4,6/5','4,6/5']],60,511,1480,245,[780,350,350],32);
 text(s,'Gegeven: Ev = −0,7 · Prijzen per maand per abonnement · TO per maand',60,786,1480,50,31,{bold:true,color:C.blue});
 notes(s,'67','Toon eerst de volledige context, alle vier bronnen en alle zes vragen zonder oplossingen. De gemeten Ev in bron A is gegeven; deze opgave combineert eerder onderwezen handelingen en introduceert geen nieuwe formule. De prijzen zijn maandprijzen per abonnement. De appscore blijft als oorspronkelijk brongegeven staan; geef nog niet weg of die nodig is.','Over welke periode gaat de omzet?', 'Een gegeven Ev op de brondia is nog geen antwoord op de gevraagde classificatie en uitleg.', 'Toon bronnen B en C.');
}
{
 const s=slide('Opgave 5 · Bronnen B en C',targetFooter);
 text(s,'Bron B · Inkomen en gevraagde hoeveelheid',60,184,1480,62,38,{bold:true,color:C.blue});
 table(s,[['Verandering','Premium','Budget'],['Inkomen','+8%','+8%'],['Gevraagde hoeveelheid','+15%','−4%']],60,265,1480,210,[780,350,350],33);
 text(s,'Bron C · Prijs van een concurrerend abonnement',60,534,1480,62,38,{bold:true,color:C.blue});
 table(s,[['Gegeven','Oud','Nieuw'],['Prijs concurrerend abonnement','€ 8','€ 9'],['Vraag StreamPlus','Basis','+5%']],60,613,1480,210,[780,350,350],33);
 notes(s,'67','Dit zijn de volledige tabellen B en C uit de bron. Premium en Budget hebben dezelfde inkomensverandering. C noemt de prijs van de concurrerende dienst en de vraag naar StreamPlus. Geef nog geen berekening of indeling. Laat leerlingen beide bronnen op boekpagina 67 terugvinden.','Welke grootheden en diensten worden in elke bron gemeten?', 'Bron C geeft niet een nieuwe prijs van StreamPlus.', 'Toon het regionale model D.');
}
{
 const s=slide('Opgave 5 · Bron D',targetFooter);
 text(s,'Regionale vraagfunctie',60,190,1480,64,40,{bold:true,color:C.blue});
 text(s,'Q = 12.000 − 400P + 0,1Y + 300Pc',60,285,1480,80,52,{bold:true});
 table(s,[['Variabele','Betekenis','Beginsituatie'],['Q','Gevraagde abonnementen per maand','—'],['P','Maandprijs StreamPlus (€)','12'],['Pc','Maandprijs concurrent (€)','10'],['Y','Gemiddeld jaarinkomen (€)','40.000']],60,402,1480,337,[250,860,370],32);
 text(s,'Gebruik de gegevens uit D, niet het aantal uit A.',60,779,1480,60,35,{bold:true,color:C.orange});
 notes(s,'67','De formule, alle definities en de beginsituatie komen uit bron D. Dit regionale model heeft een eigen vraaghoeveelheid. Het streepje bij Q geeft alleen aan dat de beginsituatie berekend moet worden; het is geen gegeven nul. De boekbron waarschuwt uitdrukkelijk dat het aantal uit A hier niet gebruikt mag worden.','Welke variabelen zijn in de beginsituatie gegeven?', 'Y is gemiddeld jaarinkomen, ook al wordt Q per maand gemeten.', 'Toon nu alle zes vragen, nog zonder antwoorden.');
}
const questions=[
 'Selecteer uit bron A de gegevens voor een controleberekening van Ev en noem het gegeven dat daarvoor niet nodig is.',
 'Classificeer met de gegeven Ev=−0,7 de vraag en leg in gewone taal uit hoe sterk Q procentueel reageert op een prijsverandering.',
 'Bereken met bron A TO vóór en na de prijsverhoging.',
 'Bereken en classificeer met bron B Ei voor Premium en Budget en met bron C Ek van de vraag naar StreamPlus ten opzichte van de prijs van het concurrerende abonnement. Noem bij Ek beide diensten.',
 'Bereken met bron D Q in de beginsituatie en nadat alleen Y stijgt naar €42.000 per jaar. Noem welke variabelen gelijk blijven.',
 'Geef op basis van minstens twee bronnen een voorzichtig omzetadvies. Noem één conclusie die de bronnen ondersteunen en precies twee conclusies die zij niet bewijzen.'
];
for(const [start,end] of [[1,3],[4,5],[6,6]]){
 const s=slide(`Opgave 5 · ${start===end?'Vraag '+start:'Vragen '+start+'–'+end}`,targetFooter);
 text(s,'Gebruik de bronnen op boekpagina 67.',60,184,1480,60,34,{color:C.blue,bold:true});
 for(let i=start;i<=end;i++){
  const y=start===1?285+(i-start)*173:start===4?292+(i-start)*299:320;
  const h=start===1?150:255;
  text(s,String(i)+'.',60,y,75,h,39,{bold:true,color:C.blue});
  text(s,questions[i-1]+` (${i===4?4:2} punten)`,157,y,1383,h,36);
 }
 if(start===6)text(s,'Na afloop: vergelijk berekeningen, eenheden en redenering\nmet het antwoordenboek.',157,672,1383,111,34,{color:C.muted});
 notes(s,'68',`Volledige oorspronkelijke ${start===end?'vraag':'vragen'} ${start===end?start:start+'–'+end}, inclusief puntwaarden. Gebruik de bronnen op pagina 67; in het boek staan ze op de vorige pagina. Lees de opdracht zonder al een oplossingsstap te geven. De punten laten de omvang van het antwoord zien.`, 'Welke bron of bronnen vraagt de opdracht?', 'Een juist eindgetal is niet voldoende als de vraag ook een indeling of verklaring vraagt.',end===6?'Alle context, bronnen en zes vragen zijn nu getoond. Begin pas nu met de antwoorden.':'Toon de resterende vragen voordat de antwoorden worden besproken.');
}
{
 const s=slide('Opgave 5.1 · Relevante gegevens',targetFooter);
 table(s,[['Nodig voor Ev','Oud','Nieuw'],['P (€ per maand)','10','12'],['Q (abonnees)','50.000','43.000']],60,225,1480,258,[780,350,350],35);
 text(s,'Ev = %ΔQ / %ΔP',60,545,1480,86,52,{bold:true,color:C.blue});
 text(s,'De appscore 4,6/5 staat in geen van beide breuken.',60,686,1480,95,40,{bold:true,color:C.orange});
 notes(s,'67–68','Antwoord 1: P oud 10, P nieuw 12, Q oud 50.000 en Q nieuw 43.000. De appscore 4,6/5 is niet nodig voor de controleberekening. Selectie wordt onderbouwd door de formule: beide procentuele veranderingen hebben hun oude en nieuwe waarde nodig. Een waarderingscijfer beschrijft geen prijs- of hoeveelheidsverandering.','Waarom heb je van P én Q twee waarden nodig?', 'Appwaardering is niet hetzelfde als prijsgevoeligheid.', 'Controleer de gegeven Ev en leg de relatieve reactie uit.');
}
{
 const s=slide('Opgave 5.2 · Prijsinelastische vraag',targetFooter);
 text(s,'%ΔP = (12 − 10) / 10 × 100% = +20%',60,211,1480,72,43);
 text(s,'%ΔQ = (43.000 − 50.000) / 50.000 × 100% = −14%',60,317,1480,72,40);
 text(s,'Controle: Ev = −14% / +20% = −0,7',60,425,1480,72,43,{bold:true,color:C.blue});
 rule(s,60,535,1480);
 text(s,'−1 < −0,7 < 0 → prijsinelastische vraag',60,579,1480,79,43,{bold:true});
 text(s,'Q reageert 0,7 maal zo sterk, in tegengestelde richting.',60,709,1480,106,40,{bold:true,color:C.green});
 notes(s,'67–68','Antwoord 2: vergelijk de gegeven −0,7 met −1 en 0. De vraag is prijsinelastisch. Q daalt 14% terwijl P 20% stijgt. In deze waarneming is de procentuele hoeveelheidsreactie 0,7 maal de prijsverandering, in tegengestelde richting. De controle is aanvullende ondersteuning bij de gegeven Ev; er is geen nieuwe formule.','Wat vertelt het minteken, en wat vertelt de grootte 0,7?', 'Q daalt niet met 0,7 abonnement en ook niet met 70%. De uitkomst voorspelt niet elke volgende stap.', 'Vergelijk de twee maandelijkse omzetten rechtstreeks.');
}
{
 const s=slide('Opgave 5.3 · Maandomzet',targetFooter);
 text(s,'TO = P × Q',60,195,1480,79,48,{bold:true,color:C.blue});
 table(s,[['Situatie','Berekening','TO per maand'],['Oud','10 × 50.000','€ 500.000'],['Nieuw','12 × 43.000','€ 516.000']],60,327,1480,277,[370,580,530],36);
 text(s,'ΔTO = 516.000 − 500.000 = +€ 16.000 per maand',60,662,1480,81,41,{bold:true,color:C.green});
 text(s,'De hogere prijs compenseert hier het verlies aan abonnees.',60,770,1480,66,34);
 notes(s,'67–68','Antwoord 3: vermenigvuldig de oude prijs met het oude aantal, en de nieuwe prijs met het nieuwe aantal. TO stijgt met 16.000 euro per maand. De eenheid volgt uit een maandprijs per abonnement maal het aantal abonnees. De directe vergelijking bevestigt de stijging in deze gegevens; het elasticiteitslabel alleen is geen universele omzetgarantie voor eindige stappen.','Waarom hoort 43.000 bij de prijs van twaalf euro?', '€ 16.000 is extra omzet; zonder kosten is dit geen extra winst.', 'Wissel naar bron B: nu verandert het inkomen.');
}
{
 const s=slide('Opgave 5.4 · Inkomenselasticiteit',targetFooter);
 text(s,'Ei = %ΔQ / %ΔY',60,196,1480,80,48,{bold:true,color:C.blue});
 table(s,[['Abonnement','Berekening','Indeling in deze situatie'],['Premium','+15% / +8% = +1,875\n≈ +1,88','Ei > 1: luxegoed'],['Budget','−4% / +8% = −0,5','Ei < 0: inferieur goed']],60,327,1480,312,[340,590,550],34);
 text(s,'Premium: Q groeit relatief sterker dan Y.\nBudget: meer inkomen gaat samen met minder vraag.',60,709,1480,111,37,{bold:true,color:C.green});
 notes(s,'67–68','Antwoord 4, bron B. Premium: 15 gedeeld door 8 = 1,875, eventueel afgerond 1,88, luxegoed. Budget: −4 gedeeld door 8 = −0,5, inferieur goed. Bewaar ongeronde tussenuitkomsten. Dit zijn de labels van de methode voor de onderzochte groep/situatie; inferieur is een vraagreactie, geen oordeel over productkwaliteit.','Waarom is de noemer voor beide abonnementen gelijk?', 'Ei is dimensieloos en gebruikt geen prijsverandering in de noemer.', 'Bereken met C het verband tussen twee diensten.');
}
{
 const s=slide('Opgave 5.4 · Kruislingse elasticiteit',targetFooter);
 text(s,'Teller: vraag StreamPlus · Noemer: prijs concurrent',60,192,1480,73,38,{bold:true,color:C.blue});
 text(s,'%ΔPc = (9 − 8) / 8 × 100% = +12,5%',60,310,1480,77,43);
 text(s,'Ek = %ΔQ StreamPlus / %ΔPc',60,418,1480,72,42);
 text(s,'Ek = +5% / +12,5% = +0,4',60,526,1480,79,48,{bold:true});
 text(s,'StreamPlus en het concurrerende abonnement zijn substituten.',60,664,1480,101,40,{bold:true,color:C.green});
 notes(s,'67–68','Antwoord 4, bron C. Bereken eerst de procentuele stijging van de concurrentprijs met acht als oude waarde: 12,5%. Deel de stijging van de vraag naar StreamPlus van 5% door 12,5%: +0,4. Noem beide diensten. Het positieve teken past bij substituten: als de concurrent duurder wordt, neemt de vraag naar StreamPlus toe.','Waarom delen we niet door de euro prijsstijging van één?', 'De noemer moet procentueel zijn en over de concurrent gaan. +0,4 is geen eurobedrag.', 'Houd de gegevens van het regionale model D apart.');
}
{
 const s=slide('Opgave 5.5 · De beginsituatie',targetFooter);
 text(s,'Q = 12.000 − 400P + 0,1Y + 300Pc',60,204,1480,76,47,{bold:true,color:C.blue});
 text(s,'P = 12 · Pc = 10 · Y = 40.000',60,312,1480,68,40);
 text(s,'Q = 12.000 − 400 × 12 + 0,1 × 40.000 + 300 × 10',60,426,1480,79,39);
 text(s,'Q = 12.000 − 4.800 + 4.000 + 3.000',60,540,1480,77,43);
 text(s,'Q = 14.200 abonnementen per maand',60,687,1480,90,48,{bold:true,color:C.green});
 notes(s,'67–68','Antwoord 5, eerste stap. Vul elke variabele met de waarde uit D in. Reken de drie producten uit voordat je optelt: −4800, +4000, +3000. Resultaat: 14.200 gevraagde abonnementen per maand. Controleer de dimensies en houd het jaarinkomen als jaarinkomen.','Waarom is de uitgangshoeveelheid niet 50.000?', 'Bron A en het regionale model D beschrijven niet dezelfde meetbasis.', 'Verander uitsluitend Y naar 42.000.');
}
{
 const s=slide('Opgave 5.5 · Alleen Y wordt € 42.000',targetFooter);
 text(s,'P = 12 en Pc = 10 blijven gelijk',60,198,1480,69,43,{bold:true,color:C.blue});
 text(s,'Q = 12.000 − 400 × 12 + 0,1 × 42.000 + 300 × 10',60,317,1480,79,39);
 text(s,'Q = 12.000 − 4.800 + 4.200 + 3.000',60,425,1480,77,43);
 text(s,'Q = 14.400 abonnementen per maand',60,549,1480,81,48,{bold:true,color:C.green});
 rule(s,60,664,1480);
 text(s,'Controle: ΔQ = 0,1 × (42.000 − 40.000) = +200',60,709,1480,76,39,{bold:true});
 notes(s,'67–68','Antwoord 5, tweede stap. Alleen de inkomensterm wordt 4200 in plaats van 4000. De vraag stijgt van 14.200 naar 14.400, dus met 200 abonnementen per maand. Controle via 0,1 maal de inkomensverandering geeft dezelfde 200. Prijzen P=12 en Pc=10 blijven gelijk. Dit is een modeluitkomst onder deze voorwaarden.','Welke van de vier termen verschilt van de vorige dia?', 'Een hoger jaarinkomen wordt niet gedeeld door twaalf; de modelcoëfficiënt is op deze eenheden afgestemd.', 'Combineer nu twee bronnen tot een voorzichtig advies.');
}
{
 const s=slide('Opgave 5.6 · Onderbouwing van het advies',targetFooter);
 table(s,[['Rol in het advies','Bron','Onderbouwing'],['Ondersteunde conclusie','A','De onderzochte prijsverhoging verhoogde\nde maandomzet met € 16.000.'],['Tweede bron','C','StreamPlus en de concurrent zijn substituten.\nKlanten reageren op de concurrentprijs.']],60,232,1480,322,[420,170,890],33);
 text(s,'Advies: onderzoek een eventuele volgende prijswijziging zorgvuldig.',60,618,1480,113,42,{bold:true,color:C.blue});
 text(s,'Koppel je aanbeveling aan deze twee bronnen.',60,770,1480,62,34);
 notes(s,'67–68','Antwoord 6, eerste deel. Er is één hoofdconclusie over de waargenomen omzet, ondersteund door A. C levert een tweede relevante bron: de diensten zijn substituten en concurrentprijzen doen ertoe. Dat onderbouwt voorzichtig onderzoek naar een volgende prijsstap. B of D mag ook in een ander goed advies worden gebruikt, mits de relatie en grenzen kloppen. De volgende dia maakt het antwoord af met precies twee niet-bewezen conclusies.','Welke bron bewijst de omzetstijging, en welke bron begrenst de vervolgstap?', 'Een substitutierelatie voorspelt niet op zichzelf de precieze reactie op een volgende eigen prijsverandering.', 'Voeg precies twee niet-bewezen conclusies toe.');
}
{
 const s=slide('Opgave 5.6 · Precies twee grenzen',targetFooter);
 text(s,'Niet bewezen',60,192,1480,73,44,{bold:true,color:C.orange});
 text(s,'1',60,319,100,100,60,{bold:true,color:C.orange});
 text(s,'Dezelfde reactie bij een volgende prijsverhoging',218,320,1322,101,44,{bold:true});
 text(s,'De meting gaat over de onderzochte prijsstap.',218,439,1322,79,37);
 rule(s,60,559,1480);
 text(s,'2',60,618,100,100,60,{bold:true,color:C.orange});
 text(s,'Een hogere winst',218,619,1322,78,44,{bold:true});
 text(s,'De kosten ontbreken: omzet alleen bewijst geen winststijging.',218,728,1322,106,37);
 notes(s,'67–68','Volledig mogelijk antwoord: De onderzochte prijsverhoging verhoogde volgens A de maandomzet met 16.000 euro. C laat zien dat StreamPlus en het concurrerende abonnement substituten zijn; klanten reageren op de concurrentprijs. Onderzoek daarom een eventuele volgende prijswijziging zorgvuldig. Niet bewezen zijn dezelfde reactie bij een volgende prijsverhoging en een hogere winst, omdat kostengegevens ontbreken. Dit bevat één onderbouwde omzetconclusie, een tweede bron en precies twee grenzen.','Welke extra gegevens zouden nodig zijn om over winst te spreken?', 'Noem geen derde niet-bewezen conclusie als er precies twee worden gevraagd. Een ontbrekend bewijs is niet hetzelfde als bewijs dat iets onjuist is.', 'Laat leerlingen hun eigen antwoord verbeteren.');
}
{
 const s=slide('Controleer en verbeter je antwoord');
 const rows=[['Bronkeuze','A, B, C en D blijven bij hun eigen onderzoek.'],['Berekeningen','Oude waarde als basis; tussenstappen en eenheden.'],['Betekenis','Ev: sterkte en richting · Ei: categorie · Ek: twee diensten.'],['Advies','Minstens twee bronnen en precies twee niet-bewezen conclusies.']];
 rows.forEach((r,i)=>{let y=210+i*140;text(s,r[0],60,y,460,65,39,{bold:true,color:C.blue});text(s,r[1],570,y,970,106,36);});
 text(s,'Verbeter één volledige berekening of redenering.',60,787,1480,52,34,{bold:true});
 notes(s,'68–70','Laat leerlingen hun werk vergelijken met het antwoordmodel en één concrete verbetering uitvoeren. Controleer bij de eigen antwoorden ook de toelichtingen, niet alleen eindgetallen. Vraag bij Ek twee diensten, bij TO euro per maand en bij bron D abonnementen per maand plus gelijkblijvende prijzen. Beoordeel het advies op brongebruik én precies twee niet-bewezen conclusies. Dit is oefenfeedback, geen bewijs van blijvende beheersing.','Welke fout kun je nu zelf herstellen?', 'Een antwoord overschrijven is nog niet hetzelfde als begrijpen welke stap fout ging.', 'Keer terug naar het overzicht en noteer het huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...authored,slides,overviewSlides:overviews,nativeTableSlides:[...new Set(tables)],nativeChartSlides:[]},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'2.2.4 Gemengde opgaven – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...[...new Set(tables)].flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:[...new Set(tables)],requiredNativeChartOwnerSlides:[],verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,overviews,tables:tables.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
