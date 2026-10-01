// HOW TO ADAPT: use the current paragraph and answer model, update the adjacent
// source manifest, and keep one overview source. Runtime paths come from the
// installed presentation skill; see docs/workflows/classroom-presentation.md.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('322');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', TITLE='Marginale kosten en de afgeleide';
const sourceCommit='9b8304d5031cafac936a56281e144573a25fbbc9';
const source=`https://github.com/meijer1973/4veco-lessen/blob/${sourceCommit}/edities/books34-v3/`;
const tables=[],slides=[],overviews=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer=`§3.2.2 ${TITLE}`,size=50){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,80,size,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title});return s;
}
function notes(s,page,explanation,question,pitfall,transition,{authored=false,extra=''}={}){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 3, editie books34-v3, gedrukte boekpagina ${page}. ${source}books/book-3/output/Boek_3_Compleet_v3.pdf\nMethode en leerlingtekst: ${source}books/book-3/chapters/3.2/3.2.2%20manuscript.md\nAntwoordmodel: ${source}books/book-3/chapters/3.2/Antwoorden.md\n${authored?'Uitlegvoorbeeld — niet uit het boek. Context Cacaomenger Nova en alle voorbeeldgetallen zijn voor deze presentatie gemaakt. De boekverwijzing onderbouwt alleen de methode.':''}\n${extra}`);
}
function table(s,values,y,h,widths,size=34){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:60,top:y,width:1480,height:h,columnWidths:widths,values});
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
function example(s){text(s,'Uitlegvoorbeeld — niet uit het boek',60,181,1480,45,30,{bold:true,color:C.blue});}
function big(s,str,y=305,color=C.ink,size=52){text(s,str,60,y,1480,110,size,{bold:true,color});}
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
 const s=slide(`Deze les: §3.2.2 ${TITLE}`,undefined,46);overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],789,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'MK afleiden en uitleggen.\nPunt en tabelstap onderscheiden.\nKostenveranderingen verklaren.',972,244,565,122,30,{name:'overview-goals'});
 rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 65 · Opgaven 11 en 12\n12: verkennen, theorie p. 62–64',972,459,565,95,30,{bold:active===2,name:'overview-start'});
 rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§3.2.2\nBasis: 13 en 14\nZelfstandig: 15 en 16\nDoelopgave: 17\nMaken en nakijken',972,654,565,185,30,{bold:active===7,name:'overview-homework'});
 notes(s,'62–67',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start 11–12 staat op boekpagina 65; basis 13 op 65 en 14 op 66; zelfstandig 15–16 op 66; doel 17 op 67. Huiswerk is 13, 14, 15, 16 en 17 maken en nakijken. Bonus 18 en herhaling 19 zijn extra. Opgave 11 haalt ΔTK/Δq en eenheden op uit §2.1.3. Opgave 12 geeft de MK-functie al, maar de puntbetekenis is nieuw: laat leerlingen p. 62–64 als steun gebruiken, beide gegeven functies invullen en hun twijfel noteren. Verwacht nog geen zelfstandige beheersing van de afgeleide. Voor het basiswerk keren leerlingen terug naar 12 en verbeteren zij de betekenis met de zojuist gegeven uitleg. Plan zo nodig over meer lessen; de docentgids adviseert voorlopig twee lessen van 55 minuten, zonder gemeten fit.`,active===2?'Welk bedrag gaat over alle productie en welk bedrag over een kleine uitbreiding?':'Welke stap of uitleg vraagt nog hulp?','De hoofdstukhandleiding gebruikt lokale pagina 13 voor de start; de complete leerlinguitgave heeft hier gedrukte pagina 65.',active===7?'Laat het huiswerk in de agenda zetten. In §3.2.3 volgt de productie kiezen.':'Ga naar de volgende lesfase als de klas daaraan toe is.',{extra:'Docentroute: '+source+'books/book-3/chapters/3.2/Docenteninformatie.md. Terugkoppeling start indien nodig: 11a ΔTK = € 70 per week, Δq = 10 kg per week, gemiddelde = € 7 per kg; 12a TK(20) = € 120 per week, MK(20) = € 6 per kg. Deze antwoorden staan niet op de openingsdia.'});
}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const rows=[['Een functie afleiden','Van TK met q², q en een getal naar MK.'],['Een bedrag uitleggen','MK op één punt vergelijken met een tabelstap.'],['Een kostenverandering verklaren','Wat verandert in TK? Wat verandert in MK?']];
 rows.forEach((r,i)=>{const y=230+i*187;text(s,r[0],60,y,610,100,39,{bold:true,color:C.blue});text(s,r[1],720,y,810,108,37);if(i<2)rule(s,60,y+136,1480);});
 notes(s,'62–64','Koppel de doelen aan 17a–e. MK is een bedrag per kg, TK een totaal per week. De beperkte afgeleide is het nieuwe gereedschap. Productie kiezen via een marginale opbrengstvergelijking hoort bij §3.2.3.','Welke kostenmaat heb je nodig voor een heel kleine uitbreiding?','Afleiden betekent hier de verandering bepalen, niet TK door q delen.','Introduceer een afzonderlijk uitlegvoorbeeld.');
}
{
 const s=slide('Een kostenfunctie voor Nova');example(s);
 big(s,'TK = 0,15q² + 5q + 75',300,C.blue,60);
 table(s,[['Grootheid of voorwaarde','Betekenis'],['q','kg cacaomengsel per week'],['TK','euro per week'],['Productiecapaciteit','60 kg per week']],465,296,[650,830],33);
 text(s,'Ook delen van een kg zijn mogelijk. De € 75 blijft deze week gelijk.',60,782,1480,52,32,{bold:true});
 notes(s,'62–64','Nova mengt cacao. Het kostenmodel en de naam zijn zelfgemaakt. De productie ligt tussen 0 en 60 kg per week en mag doorlopen tussen gehele kilogrammen. De € 75 blijft deze week verschuldigd, ook bij nul productie. De overige termen veranderen met q. Gebruik steeds kleine q voor één onderneming.','Welke term verandert niet als Nova iets meer mengt?','De capaciteit is een modelgrens. Trek geen conclusies buiten 60 kg.','Bekijk wat de afgeleide met elke soort term doet.',{authored:true});
}
{
 const s=slide('De beperkte regel voor de afgeleide');
 big(s,'TK = aq² + bq + c',205,C.ink,50);
 table(s,[['Term in TK','Bewerking','Bijdrage aan MK'],['aq²','2 × a; q² wordt q','2aq'],['bq','De bijdrage per extra kg is b','b'],['c','Verandert niet als q verandert','0']],335,337,[360,700,420],34);
 big(s,'MK = 2aq + b',724,C.orange,54);
 notes(s,'63','a, b en c zijn de getallen in de gegeven kostenfunctie. Differentieer elke term apart en tel de bijdragen op. De afgeleide geeft de verandering op één punt, in euro per kg. De constante draagt nul bij omdat een uitbreiding dat bedrag niet verandert. Dit hoofdstuk vraagt alleen deze drie soorten termen.','Wat blijft van bq over?','Laat de exponent niet staan bij de q-term en neem c niet over in MK. Deel ook niet de gehele TK door q; dat zou GTK geven.','Pas deze regel toe op de functie van Nova.');
}
{
 const s=slide('Nova: term voor term afleiden');example(s);
 big(s,'TK = 0,15q² + 5q + 75',255,C.ink,48);
 table(s,[['Term in TK','Bewerking','Bijdrage aan MK'],['0,15q²','2 × 0,15 × q','0,30q'],['5q','5 per extra kg','5'],['75','Geen verandering door meer q','0']],370,315,[360,700,420],34);
 big(s,'MK = 0,30q + 5',738,C.orange,54);
 notes(s,'63–64','De kwadratische term geeft 0,30q. De lineaire term geeft 5. De constante term geeft nul. Tel op tot MK = 0,30q + 5. Controleer eerst de functie voordat je een hoeveelheid invult.','Waarom is de bijdrage van 75 nul?','De € 75 is niet kwijtgescholden: hij blijft in TK, alleen niet in MK.','Vul nu een productie in de nieuwe MK-functie in.',{authored:true});
}
{
 const s=slide('De puntwaarde bij q = 10');example(s);
 text(s,'MK = 0,30q + 5',60,260,1480,65,43,{bold:true});
 big(s,'MK(10) = 0,30 × 10 + 5',385,C.ink,52);
 big(s,'= € 8 per kg',523,C.orange,66);
 text(s,'Bij een zeer kleine uitbreiding rond 10 kg per week.',60,706,1480,78,39,{bold:true});
 notes(s,'62–64','MK bij 10 is 8 euro per kg. De afgeleide is een veranderingssnelheid op dat ene productieniveau. Bij een heel kleine uitbreiding benader je de extra totale kosten met 8 euro per kg maal de kleine hoeveelheid. Het is geen totale weekrekening en ook niet exact de kosten van één hele volgende kilogram.','Welke eenheid hoort bij dit bedrag?','Een hele extra kg kan bij stijgende MK iets meer kosten dan de puntwaarde.','Bereken vervolgens TK bij twee productiehoeveelheden.',{authored:true});
}
{
 const s=slide('De totale kosten bij 10 en 30 kg');example(s);
 text(s,'TK = 0,15q² + 5q + 75',60,256,1480,64,43,{bold:true});
 table(s,[['q (kg per week)','Invullen in TK','TK (€ per week)'],['10','0,15 × 10² + 5 × 10 + 75','140'],['30','0,15 × 30² + 5 × 30 + 75','360']],370,275,[390,670,420],34);
 text(s,'Eerst kwadrateren, dan vermenigvuldigen en optellen.',60,715,1480,75,40,{bold:true,color:C.blue});
 notes(s,'64','Bij 10: 0,15 × 100 + 50 + 75 = 140 euro per week. Bij 30: 0,15 × 900 + 150 + 75 = 360 euro per week. Beide hoeveelheden vallen binnen de capaciteit van 60. Herstel indien nodig invullen en kwadrateren voordat de klas met verschillen rekent.','Wat betekent het getal 140?','(0,15 × 10)² is niet 0,15 × 10². Gebruik de kwadratische term correct.','Bereken hoeveel kosten en hoeveel kg erbij komen.',{authored:true});
}
{
 const s=slide('Gemiddelde extra kosten over 10–30 kg');example(s);
 text(s,'ΔTK = 360 − 140 = € 220 per week',60,270,1480,75,45,{bold:true});
 text(s,'Δq = 30 − 10 = 20 kg per week',60,390,1480,75,45,{bold:true});
 rule(s,60,505,1480);
 big(s,'ΔTK / Δq = 220 / 20 = € 11 per extra kg',558,C.blue,49);
 text(s,'Het gemiddelde over de hele stap van 20 extra kg.',60,737,1480,70,39,{bold:true});
 notes(s,'62, 64','Haal de tabelmethode uit Boek 2 §2.1.3 op. Trek de twee totale kostenbedragen af en deel door de toename van q. Deel dus door 20, niet door eindhoeveelheid 30. De weken in teller en noemer vallen weg: euro per kg blijft.','Door welke hoeveelheid deel je de extra totale kosten?','€ 220 per week is ΔTK. Het is nog geen bedrag per kg.','Vergelijk de verschillende veranderingen naast elkaar.',{authored:true,extra:'Voorkennis: Boek 2 chat-2026, §2.1.3, gedrukte p. 19–20, definitie en uitgewerkte tabelstap ΔTK/ΔQ. In Boek 3 gebruikt één onderneming kleine q.'});
}
{
 const s=slide('Een puntwaarde en twee verschillende stappen');example(s);
 table(s,[['Plaats of stap','Wat meet je?','Uitkomst'],['Op q = 10','Puntwaarde van MK','€ 8 per kg'],['Van 10 naar 30 kg','Gemiddeld over 20 extra kg','€ 11 per kg'],['Van 10 naar 11 kg','Exacte extra totale kosten','€ 8,15 voor die kg']],291,368,[410,630,440],33);
 text(s,'MK stijgt: een langere stap bevat ook duurdere extra kg.',60,719,1480,90,40,{bold:true,color:C.orange});
 notes(s,'62–64','Op q = 10 is MK 8. Op q = 30 is MK = 0,30 × 30 + 5 = 14. De gemiddelde extra kosten over de tussenliggende 20 kg zijn 11. Ter controle van de hele kilogram: TK(11) = 0,15 × 121 + 55 + 75 = 148,15; TK(10) = 140, dus 8,15 extra voor die kg. Toon de laatste rij pas in de mondelinge uitleg nadat de eerste twee duidelijk zijn. Het gaat om verschillende veranderingen, dus verschillende uitkomsten kunnen tegelijk kloppen.','Waarom is € 11 niet de puntwaarde bij q = 10?','Gebruik een tabelgemiddelde niet als exacte afgeleide aan het eind van de stap.','Onderzoek daarna welke kostenverandering MK raakt.',{authored:true});
}
{
 const s=slide('Alleen de constante kosten stijgen');example(s);
 text(s,'Nova: de constante kosten stijgen van € 75 naar € 125 per week.',60,253,1480,102,38,{bold:true});
 table(s,[['Bij dezelfde q = 10','Oud','Nieuw'],['TK (€ per week)','140','190'],['MK (€ per kg)','8','8']],394,280,[740,370,370],36);
 text(s,'TK stijgt overal € 50. MK blijft 0,30q + 5.',60,729,1480,76,44,{bold:true,color:C.orange});
 notes(s,'63–64','Houd periode en capaciteit gelijk. TK nieuw = 0,15q² + 5q + 125. Bij 10 is dat 15 + 50 + 125 = 190. Beide MK-functies zijn 0,30q + 5. De extra 50 euro hangt niet af van q en verandert daarom niet bij een kleine uitbreiding. Bij gelijke opbrengst is de winst wel 50 euro lager.','Welke kosten moet Nova nog steeds betalen?','Constante kosten verdwijnen alleen uit de afgeleide, niet uit TK of de winst.','Vergelijk dit met een verandering van de lineaire variabele kosten.',{authored:true});
}
{
 const s=slide('Alleen de lineaire variabele kosten stijgen');example(s);
 text(s,'Terug naar het oorspronkelijke model. Nu verandert 5q in 6q.',60,253,1480,95,38,{bold:true});
 table(s,[['','Oorspronkelijk','Nieuw plan'],['TK','0,15q² + 5q + 75','0,15q² + 6q + 75'],['MK','0,30q + 5','0,30q + 6']],395,277,[260,610,610],36);
 text(s,'Bij q = 10: TK + € 10 per week, MK + € 1 per kg.',60,735,1480,72,40,{bold:true,color:C.green});
 notes(s,'63, 66','Dit is een nieuw, afzonderlijk scenario: de constante kosten zijn weer 75. Het verschil tussen de twee TK-functies is q euro per week, bij 10 dus 10 euro. De afgeleide van die extra q is 1. Daardoor neemt MK bij elke q met 1 euro per kg toe. Dit bereidt het onderscheid in basisopgave 14 voor zonder de boekopgave uit te werken.','Waarom verschilt de toename van TK van de toename van MK?','Tel niet de vaste-kostenschok van de vorige dia op bij dit afzonderlijke plan.','Controleer of leerlingen de twee oorzaken uit elkaar houden.',{authored:true});
}
{
 const s=slide('Korte controle');example(s);
 big(s,'“Hogere TK betekent altijd hogere MK.”',315,C.blue,52);
 text(s,'Klopt dit bij Nova?\nGebruik één van de twee kostenveranderingen.',60,536,1480,150,43);
 notes(s,'63–64, 66','Laat iedereen eerst een oordeel met reden formuleren. Gebruik de twee afzonderlijke veranderingen uit het uitlegvoorbeeld, geen toegewezen boekopgave. Een leerling moet de vaste-kostenvariant kunnen noemen als tegenvoorbeeld.','Welk plan kun je gebruiken om de uitspraak te beoordelen?','TK en MK hebben verschillende betekenissen en eenheden.','Laat de verklaring zien na de reacties.',{authored:true});
}
{
 const s=slide('Waarom die uitspraak niet altijd klopt');example(s);
 table(s,[['Verandering bij Nova','Effect op TK','Effect op MK'],['Alleen constant: + € 50','+ € 50 per week','Geen verandering'],['Alleen lineair: + 1q','+ q euro per week','+ € 1 per kg']],297,308,[610,440,430],34);
 text(s,'De oorzaak van de kostenstijging bepaalt het effect op MK.',60,692,1480,108,42,{bold:true,color:C.orange});
 notes(s,'63–64, 66','Hogere vaste kosten zijn het tegenvoorbeeld. Een gelijkblijvend totaalbedrag verandert de kleine extra kosten niet. Een hogere lineaire variabele-kostenterm doet dat wel. Bij dezelfde opbrengst verlaagt elke kostenstijging de winst; gelijke MK zegt niets over gelijkheid van totale kosten.','Welke term moet je bekijken voordat je iets over MK zegt?','Verwar de verandering bij dezelfde q niet met een productiestap.','Keer terug naar start 12 en begin daarna aan basis 13–14.',{authored:true});
}
overview('Zelfstandig werken',4);
const tf=`§3.2.2 ${TITLE} · Opgave 17 · Boekpagina 67`;
{
 const s=slide('Opgave 17 · Zadenverpakker',tf);
 text(s,'Voor één week geldt:',60,205,1480,65,39,{bold:true});
 big(s,'TK = 0,04q² + 4q + 400',310,C.blue,59);
 text(s,'q is kg per week; TK is euro per week.\nDe productiecapaciteit is 200 kg.',60,501,1480,150,42);
 text(s,'De constante kosten blijven deze week gelijk, ook bij q = 0.',60,715,1480,90,40,{bold:true});
 notes(s,'67','Bespreek het doel pas nadat leerlingen het hebben geprobeerd. Dit is de volledige context van de echte boekopgave, met de oorspronkelijke functie en capaciteit. Er is geen doelgrafiek of aanvullende tabel. De volgende twee dia’s tonen samen alle vijf deelvragen, nog zonder uitwerkingen.','Welke grootheden en grenzen zijn gegeven?','Gebruik nu de gegevens van Zadenverpakker; die van Nova horen bij het uitlegvoorbeeld.','Toon eerst a tot en met c en daarna d en e.');
}
{
 const s=slide('Opgave 17 · Deelvragen a, b en c',tf);
 const qs=[['a.','Leid de functie MK af. Laat per term zien wat je doet.'],['b.','Bereken MK bij q = 100. Geef de eenheid en leg de betekenis van dit bedrag uit.'],['c.','Bereken TK bij q = 100 en bij q = 150. Bereken vervolgens de gemiddelde extra kosten per kg over deze stap.']];
 qs.forEach((r,i)=>{const y=223+i*194;text(s,r[0],60,y,75,135,41,{bold:true,color:C.blue});text(s,r[1],158,y,1370,143,39);if(i<2)rule(s,60,y+151,1480);});
 notes(s,'67','Lees alle drie vragen. Laat de leerlingen aangeven welke functie of methode elke vraag vereist, maar onthul nog geen oplossing. Deze vragen zijn letterlijk overgenomen uit de huidige leerlingtekst. De context blijft op de voorgaande dia beschikbaar.','Welke vraag vraagt een puntwaarde en welke een tabelstap?','Een correct bedrag alleen beantwoordt b niet: eenheid en betekenis zijn ook gevraagd.','Toon d en e voordat de uitwerking begint.');
}
{
 const s=slide('Opgave 17 · Deelvragen d en e',tf);
 text(s,'d.',60,248,75,160,41,{bold:true,color:C.blue});text(s,'Waarom is de uitkomst van c niet gelijk aan MK bij q = 100? Gebruik wat beide bedragen meten.',158,248,1370,175,41);
 rule(s,60,470,1480);
 text(s,'e.',60,535,75,180,41,{bold:true,color:C.blue});text(s,'Alleen de constante kosten stijgen met € 100. Wat gebeurt er met de MK-functie en met TK bij q = 100? Verklaar.',158,535,1370,205,41);
 notes(s,'67','Nu zijn de volledige context en alle vijf vragen beschikbaar. Vraag eerst naar de redeneerstap die d van c onderscheidt. De docent kan naar eerdere dia’s teruggaan; de antwoorden volgen pas hierna.','Wat moet je naast rekenen bij d en e uitleggen?','“Dat zijn andere getallen” is geen economische verklaring.','Begin de uitwerking bij het afleiden per term.');
}
{
 const s=slide('Opgave 17a · MK afleiden',tf);
 text(s,'TK = 0,04q² + 4q + 400',60,212,1480,65,44,{bold:true});
 table(s,[['Term in TK','Bewerking','Bijdrage aan MK'],['0,04q²','2 × 0,04 × q','0,08q'],['4q','4 per extra kg','4'],['400','Geen verandering door meer q','0']],333,320,[360,700,420],35);
 big(s,'MK = 0,08q + 4',720,C.orange,58);
 notes(s,'67','Laat elke bijdrage benoemen: 0,04q² geeft 0,08q; 4q geeft 4; 400 geeft 0. Tel deze op. Dit dekt alle per-termhandelingen in vraag a.','Waar staat de 400 nog wel in?','Constante kosten leveren nul in MK maar blijven onderdeel van TK.','Vul 100 in de afgeleide in.');
}
{
 const s=slide('Opgave 17b · MK bij 100 kg',tf);
 text(s,'MK(q) = 0,08q + 4',60,235,1480,65,43,{bold:true});
 big(s,'MK(100) = 0,08 × 100 + 4',362,C.ink,52);
 big(s,'= € 12 per kg',505,C.orange,66);
 text(s,'De extra kostenwaarde per kg bij een zeer kleine uitbreiding\nrond 100 kg per week.',60,680,1480,127,40,{bold:true});
 notes(s,'67','0,08 maal 100 is 8; plus 4 geeft 12 euro per kg. Dit is een puntwaarde voor een zeer kleine uitbreiding rond 100 kg in het doorlopende model. Het gaat niet om de totale kosten van alle 100 kg en niet exact om de volledige volgende kg. 100 ligt binnen de capaciteit van 200.','Waarom schrijf je euro per kg en niet euro per week?','Verwar MK(100) niet met TK(100) of GTK(100).','Bereken nu TK aan beide kanten van de gevraagde tabelstap.');
}
{
 const s=slide('Opgave 17c · Eerst de totale kosten',tf);
 text(s,'TK = 0,04q² + 4q + 400',60,205,1480,66,43,{bold:true});
 text(s,'TK(100) = 0,04 × 100² + 4 × 100 + 400',60,330,1480,70,42);
 text(s,'= 400 + 400 + 400 = € 1.200 per week',60,427,1480,73,43,{bold:true,color:C.blue});
 rule(s,60,544,1480);
 text(s,'TK(150) = 0,04 × 150² + 4 × 150 + 400',60,590,1480,70,42);
 text(s,'= 900 + 600 + 400 = € 1.900 per week',60,694,1480,73,43,{bold:true,color:C.blue});
 notes(s,'67','100² is 10.000 en 150² is 22.500. Vermenigvuldig pas daarna met 0,04. Beide productiehoeveelheden blijven onder de capaciteit van 200. De vaste kosten 400 komen in beide totalen voor.','Waarom tel je ook bij 150 kg de 400 op?','Gebruik voor totale kosten de oorspronkelijke TK-functie, niet de MK-functie.','Gebruik de twee totalen om de gemiddelde extra kosten te bepalen.');
}
{
 const s=slide('Opgave 17c · Daarna de tabelstap',tf);
 text(s,'ΔTK = 1.900 − 1.200 = € 700 per week',60,253,1480,75,45,{bold:true});
 text(s,'Δq = 150 − 100 = 50 kg per week',60,378,1480,75,45,{bold:true});
 rule(s,60,496,1480);
 big(s,'ΔTK / Δq = 700 / 50 = € 14 per extra kg',552,C.blue,49);
 text(s,'Controle: 50 extra kg × € 14 per kg = € 700 per week.',60,740,1480,75,37,{bold:true});
 notes(s,'67','Bereken beide verschillen, deel 700 door 50 en geef de eenheid. De uitkomst is gemiddeld over de volledige stap van 100 naar 150 kg. De omgekeerde vermenigvuldiging controleert het kostenverschil.','Welk getal hoort in de noemer?','Deel niet door 150. Dat is de eindproductie, niet de productietoename.','Verklaar waarom 14 en 12 tegelijk juist kunnen zijn.');
}
{
 const s=slide('Opgave 17d · Wat meten de bedragen?',tf);
 table(s,[['','€ 12 per kg','€ 14 per kg'],['Meting','Puntwaarde bij q = 100','Gemiddelde over 100–150 kg'],['Verandering in q','Een zeer kleine uitbreiding','50 extra kg']],257,304,[290,595,595],34);
 text(s,'MK stijgt binnen de stap: van € 12 naar € 16 per kg.',60,617,1480,78,42,{bold:true,color:C.orange});
 text(s,'Daarom ligt het gemiddelde van € 14 boven de beginwaarde.',60,735,1480,75,38,{bold:true});
 notes(s,'67','De 12 is de afgeleide bij 100. De 14 is gemiddeld over 50 extra kg. De marginale kosten nemen toe met q: bij 150 is MK = 0,08 × 150 + 4 = 16. Daardoor bevat de stap ook duurdere productie dan bij het begin en is het gemiddelde hoger. De eindwaarde 16 is een extra controle, niet een andere methode die de verschillenberekening vervangt.','Welke verandering hoort bij ieder bedrag?','€ 14 is niet de exacte puntwaarde bij 150. Neem bij willekeurige modellen niet automatisch het gemiddelde van de eindwaarden.','Bekijk de laatste vraag bij dezelfde productie van 100 kg.');
}
{
 const s=slide('Opgave 17e · € 100 hogere constante kosten',tf,47);
 text(s,'Nieuwe TK = 0,04q² + 4q + 500',60,221,1480,76,47,{bold:true});
 text(s,'TK(100) = 400 + 400 + 500 = € 1.300 per week',60,363,1480,106,43,{bold:true,color:C.blue});
 rule(s,60,510,1480);
 big(s,'MK blijft 0,08q + 4',558,C.orange,55);
 text(s,'Die extra € 100 verandert niet als q verandert.',60,729,1480,74,42,{bold:true});
 notes(s,'67','De constante wordt 500. TK bij 100 is 1300, dus 100 euro meer dan voorheen. De afgeleide van 500 is net als die van 400 nul, daarom blijft MK dezelfde functie en bij 100 nog steeds 12 euro per kg. De constante kosten blijven in deze week binnen dezelfde capaciteit gelijk. Laat leerlingen hun eigen antwoord op eenheid en verklaring controleren en één ontbrekende stap verbeteren.','Welke kosten blijven in TK staan terwijl ze niets bijdragen aan MK?','Gelijke MK betekent niet gelijke TK of gelijke winst. Bij gelijke opbrengst is de winst nu 100 euro lager.','Laat de afsluitende overzichtsdia staan voor het huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({slides,overviewSlides:overviews,sourceCommit,sourcePrintedPages:{theory:[62,63,64],start:65,basis:[65,66],independent:66,target:67},assignment:{start:[11,12],basis:[13,14],independent:[15,16],target:17,homework:[13,14,15,16,17]},nativeTables:tables},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,`3.2.2 ${TITLE} – presentatie.pptx`),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:[],verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,overviews,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
