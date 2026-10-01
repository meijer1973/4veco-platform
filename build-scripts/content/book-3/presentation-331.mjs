// HOW TO ADAPT: set the installed presentation runtime environment described in
// docs/workflows/classroom-presentation.md. Use a fresh PRESENTATION_WORKSPACE.
// Content is specific to Books 3/4 v3, §3.3.1. Read its adjacent source manifest.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('331');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', tables=[], slides=[], overviews=[];
const title='Waarom landen handelen: specialisatie en concurrentiepositie';
const stem='3.3.1 Waarom landen handelen – presentatie';
const src='https://github.com/meijer1973/4veco-lessen/blob/9b8304d5031cafac936a56281e144573a25fbbc9/edities/books34-v3/books/book-3/';
const example='Uitlegvoorbeeld — niet uit het boek';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(t,footer='§3.3.1 Waarom landen handelen',size=52){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,t,60,38,1480,100,size,{bold:true,name:'slide-title'});rule(s,60,150,1480);
 text(s,footer,60,851,1390,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,848,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title:t});return s;
}
function note(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 3, geselecteerde editie books34-v3, revisie book34-lesson-balance-v3-20260915, leerlingboek gedrukte pagina ${page}. ${src}output/Boek_3_Compleet_v3.pdf\nMethode: ${src}chapters/3.3/3.3.1%20manuscript.md\nAntwoordmodel: ${src}chapters/3.3/Antwoorden.md (opgaven 1–7).\n${authored?'Uitlegvoorbeeld — niet uit het boek. Elara, Vesta en hun producenten zijn door de presentatieauteur bedachte context en kwalitatieve gegevens. De boekpagina ondersteunt alleen de methode. Geen toegewezen boekopgave wordt hier uitgewerkt.':''}`);
}
function table(s,values,x,y,w,h,widths,size=34){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
 const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
 }}tables.push(p.slides.items.length);return t;
}
function teaching(t){const s=slide(t);text(s,example,60,174,1480,40,27,{color:C.muted});return s;}
function flow(s,left,right,goods,y=375){
 text(s,left,90,y,400,65,47,{bold:true,color:C.blue,align:'center'});
 text(s,right,1110,y,400,65,47,{bold:true,color:C.green,align:'center'});
 text(s,goods,510,y-40,580,55,36,{bold:true,align:'center'});
 s.shapes.add({geometry:'rightArrow',position:{left:520,top:y+30,width:560,height:44},fill:C.blue,line:{fill:'none',width:0}});
 text(s,'export / uitvoer',70,y+116,440,65,38,{bold:true,color:C.blue,align:'center'});
 text(s,'import / invoer',1090,y+116,440,65,38,{bold:true,color:C.green,align:'center'});
 text(s,'landsgrens',640,y+190,320,45,28,{color:C.muted,align:'center'});
 s.shapes.add({geometry:'line',position:{left:800,top:y+94,width:0,height:82},line:{fill:C.line,width:3}});
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen.\nLukt dat goed, ga dan naar de zelfstandige oefening.\nMaak daarna de doelopgave en kijk vervolgens je\nantwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 7.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=p.slides.add();s.background.fill=C.paper;overviews.push(p.slides.items.length);slides.push({number:p.slides.items.length,title:'Deze les: §3.3.1 '+title});
 text(s,'Deze les: §3.3.1 Waarom landen handelen:\nspecialisatie en concurrentiepositie',60,28,1480,108,44,{bold:true,name:'slide-title'});
 text(s,'Nu: '+phase,60,144,1480,40,30,{bold:true,color:C.blue,name:'phase'});rule(s,60,194,1480);
 text(s,'Lesroute',60,218,835,45,35,{bold:true});
 const ys=[277,365,417,469,636,716,778],hs=[80,45,45,157,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});text(s,r,116,ys[i],805,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,218,565,45,35,{bold:true});
 text(s,'Handelsstromen benoemen,\nvoordelen onderscheiden en\nspecialisatie verklaren.\nBronuitspraken beoordelen.',972,277,568,147,30,{name:'overview-goals'});rule(s,972,435,568);
 text(s,'Startopdracht',972,461,565,45,35,{bold:true});
 text(s,'Pagina 92 · Opgaven 1 en 2\n2: verkennen met theorie\nop p. 88–90',972,518,568,111,30,{name:'overview-start'});rule(s,972,639,568);
 text(s,'Huiswerk',972,648,565,45,35,{bold:true});
 text(s,'§3.3.1 · Maken en nakijken\nBasis: 3 en 4\nZelfstandig: 5 en 6\nDoelopgave: 7',972,700,568,147,30,{name:'overview-homework'});
 text(s,'§3.3.1 Waarom landen handelen',60,854,1390,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,851,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 note(s,'88–95',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start: 1–2 op p. 92. Basis: 3 op p. 92 en 4 op p. 93; zelfstandig: 5–6 op p. 94; doel: 7 op p. 95. Huiswerk: 3, 4, 5, 6 en 7 maken en nakijken. Bonus 8 en herhaling 9–10 zijn extra. Opgave 1 haalt alternatieve kosten op uit §1.1.1; help de transfer van lokaal naar productiemiddelen door te vragen wat niet tegelijk kan. Opgave 2 introduceert import/export en vooral het bewijs voor comparatief voordeel. Laat leerlingen voor 2a p. 88 lezen en voor 2b de begripsvergelijking op p. 89 en concurrentiepositie op p. 90 gebruiken. Laat hen hun gebruikte bronzin en twijfel noteren. Beoordeel dit als verkennen met steun. Bij terugkeer naar dit overzicht vóór het basiswerk: laat opgave 2 opnieuw proberen, bespreek de gebruikte bron en geef zo nodig extra steun. De docenthandleiding reserveert voorlopig twee lessen van 55 minuten; de fit is niet gemeten. Voltooi de route in een volgende les of als huiswerk als dat nodig is.`,phase==='Startopdracht'?'Welke bronzin helpt je bij een nieuwe term?':'Welke redenering wil je nog verbeteren?','De complete boekpaginering is gebruikt: hoofdstukpagina 6 is boekpagina 92. Startopgaven bewijzen geen beheersing van nieuwe stof.',active===7?'Huiswerk in de agenda. In §3.3.2 onderzoeken we de marktprijs.':'Bij zelfstandig werken: eerst terug naar startopgave 2, daarna basis 3 en 4.');
}
overview('Startopdracht',2);
{
 const s=slide('Lesdoelen');
 const rows=[['Handelsstromen','Je benoemt import en export vanuit beide landen.'],['Voordelen','Je vergelijkt middelen en alternatieve kosten.'],['Specialisatie','Je verklaart waarom ook een minder productief land kan meedoen.'],['Bronnen beoordelen','Je onderbouwt concurrentiepositie en begrenst uitspraken over winnaars.']];
 rows.forEach((a,i)=>{const y=207+i*150;text(s,a[0],60,y,450,105,38,{bold:true,color:C.blue});text(s,a[1],540,y,995,108,38);if(i<3)rule(s,60,y+119,1480);});
 note(s,'88–91','Verbind de lesdoelen aan de targetbewerkingen: een bronfeit selecteren, het juiste voordeel benoemen, passende specialisatie en handelsstroom verklaren, de ruilvoorwaarde noemen en een algemene claim met een concrete groep beoordelen. Er worden geen productieverhoudingen uitgerekend.','Welke vergelijking hoort bij relatief minder opofferen?','Een lagere verkoopprijs is geen bewijs van lagere alternatieve kosten.','Herhaal eerst de schaarste achter alternatieve kosten.');
}
{
 const s=teaching('Alternatieve kosten: opgegeven productie');
 text(s,'Een werkplaats in Elara gebruikt hetzelfde hout en dezelfde werktijd.',60,249,1480,110,39,{bold:true});
 table(s,[['Keuze','Daardoor minder mogelijk'],['Meer meubels maken','Speelgoed maken']],60,403,1480,235,[720,760],39);
 text(s,'De alternatieve kosten zijn de opgegeven andere productie.',60,726,1480,90,41,{bold:true,color:C.blue});
 note(s,'88–89','Herhaal de betekenis van de beste niet-gekozen mogelijkheid uit Boek 1 §1.1.1, kop Alternatieve kosten. In deze les gaat het om twee activiteiten met dezelfde schaarse middelen. Meer meubels betekent speelgoedproductie opgeven. Noem geen verzonnen geldwaarde of aantallen. Deze verandering van persoonlijke keuze naar een productieafweging maakt de landenvergelijking mogelijk.','Wat kan de werkplaats met dezelfde werktijd niet tegelijk maken?','Alternatieve kosten zijn niet automatisch een betaalde rekening.','Volg een levering van die meubels over de grens.',true);
}
{
 const s=teaching('Dezelfde levering, twee gezichtspunten');
 text(s,'Een bedrijf in Elara verkoopt meubels aan een koper in Vesta.',60,245,1480,92,39,{bold:true});flow(s,'Elara','Vesta','meubels');
 text(s,'Import: kopen uit het buitenland. Export: verkopen aan het buitenland.',60,725,1480,90,35,{bold:true});
 note(s,'88','Wijs eerst de richting van de goederen aan. Voor het verkopende Elara gaan de meubels naar buiten: export. Voor Vesta komen zij binnen: import. De begrippen gelden ook voor diensten. Een land of onderneming kan tegelijk andere producten importeren en exporteren. De pijl toont goederen, niet geld.','Vanuit welk land benoem je de stroom?','Een levering is niet voor beide landen export. De betaling loopt in de andere richting.','Vergelijk nu hoe de landen produceren.',true);
}
{
 const s=teaching('Absoluut voordeel: middelen per product');
 text(s,'Elara en Vesta maken meubels en speelgoed van dezelfde kwaliteit.',60,246,1480,92,39,{bold:true});
 table(s,[['Product','Benodigde middelen'],['Meubels','Elara gebruikt minder dan Vesta.'],['Speelgoed','Elara gebruikt minder dan Vesta.']],60,393,1480,294,[530,950],36);
 text(s,'Elara heeft bij beide producten een absoluut voordeel.',60,752,1480,75,41,{bold:true,color:C.blue});
 note(s,'89','Dit is een eigen kwalitatieve bron. Houd kwaliteit en product gelijk bij de vergelijking. Minder middelen voor hetzelfde product betekent een absoluut voordeel. Gelijkwaardig is: met dezelfde middelen meer produceren. Dit bepaalt nog niet welke activiteit relatief gunstig is.','Wat houden we gelijk als we de middelen vergelijken?','In beide activiteiten absoluut beter zijn betekent niet dat alle productie zelf maken het meest gunstig is.','De volgende vergelijking gaat over wat de landen opgeven.',true);
}
{
 const s=teaching('Comparatief voordeel: relatief minder opofferen');
 text(s,'Elara’s voorsprong is groot bij meubels en klein bij speelgoed.',60,244,1480,87,38,{bold:true});
 table(s,[['Extra speelgoed maken','Opgegeven meubelproductie'],['Elara','Relatief veel'],['Vesta','Relatief weinig']],60,377,1480,280,[720,760],37);
 text(s,'Vesta: lagere alternatieve kosten van speelgoed.\nElara: lagere alternatieve kosten van meubels.',60,710,1480,116,39,{bold:true,color:C.green});
 note(s,'89','De eigen bron zegt expliciet dat Vesta voor extra speelgoed relatief minder meubels opgeeft dan Elara. Dus Vesta heeft het comparatieve voordeel bij speelgoed. In deze vergelijking van twee activiteiten ligt Elara’s relatieve voordeel bij meubels: daarvoor geeft Elara relatief minder speelgoed op. Dit is kwalitatief gegeven; er zijn geen productiegetallen of verhoudingen te berekenen. Laat de leerling telkens het opgegeven andere product noemen.','Waarom kan Vesta toch een voordeel hebben terwijl Elara beide producten efficiënter maakt?','Vergelijk voor comparatief voordeel alternatieve kosten, niet alleen de middelen voor één product.','Gebruik die vergelijking voor de richting van specialisatie.',true);
}
{
 const s=teaching('Specialisatie en handel');
 table(s,[['Land','Richt zich meer op','Reden'],['Elara','Meubels','Lagere alternatieve kosten\nvan meubels'],['Vesta','Speelgoed','Lagere alternatieve kosten\nvan speelgoed']],60,272,1480,340,[350,410,720],35);
 text(s,'Een deel van de productie wordt geruild.',60,676,1480,68,42,{bold:true,color:C.blue});
 text(s,'Meer toeleggen op een activiteit kan ook zonder volledige specialisatie.',60,775,1480,60,33);
 note(s,'90','Specialisatie betekent zich sterker toeleggen op bepaalde activiteiten. Zij hoeft niet volledig te zijn. Elara kan meer meubels maken en aan Vesta verkopen; Vesta meer speelgoed en aan Elara verkopen. Benoem bij beide leveringen uitvoer voor de verkoper en invoer voor de koper. Beiden willen beide producten gebruiken.','Welke stroom past bij Vesta’s relatieve voordeel?','Absoluut voordeel en comparatief voordeel geven niet dezelfde specialisatierichtlijn.','Specialisatie alleen garandeert nog geen voor beide gunstige ruil.',true);
}
{
 const s=teaching('De voorwaarde voor wederzijds voordeel');
 text(s,'Vergelijk ruilen met zelf produceren',60,267,1480,85,47,{bold:true,color:C.blue});
 table(s,[['Elara beoordeelt','Vesta beoordeelt'],['Wat levert ruilen mij op\nten opzichte van zelf maken?','Wat levert ruilen mij op\nten opzichte van zelf maken?']],60,402,1480,234,[740,740],37);
 text(s,'De ruilafspraken moeten voor beide partijen aantrekkelijk zijn.',60,729,1480,100,43,{bold:true,color:C.green});
 note(s,'90–91','Bij specialisatie naar lagere alternatieve kosten kan gezamenlijk voordeel ontstaan. De afspraken over wat partijen voor hun producten terugkrijgen moeten elk land beter uitkomen dan zelf produceren. Transport en andere handelskosten kunnen het voordeel verkleinen. Er zijn geen gegevens voor een berekende ruilvoet; vraag die hier niet.','Waarmee vergelijk je of de ruil aantrekkelijk is?','Mogelijk gezamenlijk voordeel is geen garantie voor elke ruilafspraak of voor iedere inwoner.','Kijk nu waarom een buitenlandse klant juist deze producent kiest.',true);
}
{
 const s=teaching('Concurrentiepositie: wat waardeert de klant?');
 text(s,'Nieuwe situatie: een meubelmaker in Elara verbetert de afwerking, maar verhoogt de prijs.',60,246,1480,112,39,{bold:true});
 table(s,[['Bronfeit','Mogelijk gevolg voor de verkoop'],['Betere afwerking','Aantrekkelijker voor een kwaliteitsbewuste koper'],['Hogere prijs','Minder aantrekkelijk voor een prijsbewuste koper']],60,404,1480,302,[610,870],34);
 text(s,'Per saldo? Dat hangt af van de voorkeuren van de koper.',60,762,1480,72,39,{bold:true,color:C.orange});
 note(s,'90, 93–94','Dit is een nieuwe situatie bij één verkoper. De eerdere landenvergelijking hield kwaliteit gelijk; die aanname trekken we niet door naar deze verandering bij een meubelmaker. Concurrentiepositie is het vermogen om met andere aanbieders te concurreren. De klant kan letten op prijs, kwaliteit en betrouwbare levering. Werk beide veranderingen apart uit. Betere kwaliteit kan de producent aantrekkelijker maken, maar de hogere prijs kan kopers afschrikken. Zonder te weten wat de inkoper belangrijk vindt, volgt geen zekere nettoconclusie. Deze bron bevat geen vergelijking van opgegeven andere productie en bewijst dus geen comparatief voordeel. Dit eigen voorbeeld gebruikt andere veranderingen dan basisopgave 4.','Welke extra informatie heb je nodig voor een conclusie over de order?','Een productkenmerk en een vergelijking van alternatieve kosten zijn verschillende soorten bewijs.','Bouw nu een volledige, begrensde bronredenering.',true);
}
{
 const s=teaching('Een bronredenering in drie stappen');
 const rows=[['Bronfeit','De afwerking is beter, de prijs hoger.'],['Economisch verband','Kwaliteit kan kopers aantrekken;\neen hogere prijs kan kopers afschrikken.'],['Grens van de conclusie','Zonder voorkeuren van de koper\nis de uitkomst niet zeker.']];
 rows.forEach((r,i)=>{const y=275+i*178;text(s,r[0],60,y,450,120,37,{bold:true,color:[C.blue,C.green,C.orange][i]});text(s,r[1],575,y,960,125,39);if(i<2)rule(s,60,y+140,1480);});
 note(s,'93','Doe voor hoe een antwoord meer doet dan een bronzin overschrijven. Noem een feit, verklaar waarom het economisch relevant is en geef aan wat je niet zeker weet. Pas dit toe op de eigen meubelmaker. Het woord per saldo vraagt om het onderlinge gewicht van beide effecten. Dezezelfde antwoordbouw gebruiken leerlingen bij basis 4, zelfstandig 5–6 en doel 7.','Welke stap ontbreekt als je alleen “betere afwerking” schrijft?','Een reden geven maakt een onbewezen algemene conclusie nog niet waar.','Onderzoek vervolgens welke groepen wel en niet kunnen winnen.',true);
}
{
 const s=teaching('Handelsvoordeel verschilt per groep');
 text(s,'Vesta verkoopt speelgoed aan Elara.',60,261,1480,72,43,{bold:true,color:C.blue});
 table(s,[['Groep in Elara','Mogelijk gevolg'],['Kopers van speelgoed','Meer keuze of een aantrekkelijker aanbod'],['Speelgoedmakers','Klanten verliezen aan import'],['Werknemers bij die makers','Mogelijk ander werk moeten zoeken']],60,381,1480,354,[650,830],35);
 text(s,'Gezamenlijk voordeel bewijst niet dat iedereen wint.',60,772,1480,64,42,{bold:true,color:C.orange});
 note(s,'90–91','De eigen context voegt toe dat speelgoedmakers in Elara klanten aan import kunnen verliezen. Een land bestaat uit verschillende groepen. Kopers kunnen profiteren en concurrerende makers kunnen afzet verliezen. Voor werknemers zijn gevolgen mogelijk, maar zonder cijfers is niet bewezen hoeveel banen veranderen. Gebruik kan bij mogelijke gevolgen.','Welke concrete groep past niet bij de uitspraak dat iedereen wint?','Een winstgevende exportorder bewijst niets over alle binnenlandse bedrijven of banen.','Controleer kort of absoluut en comparatief voordeel nog uit elkaar blijven.',true);
}
function check(reveal){
 const s=teaching('Korte begripscheck');
 text(s,'“Elara gebruikt voor beide producten minder middelen.\nVesta kan dus geen voordeel hebben bij speelgoed.”',60,283,1480,180,46,{bold:true,color:C.blue});
 if(reveal){text(s,'De conclusie klopt niet.',60,514,1480,70,43,{bold:true,color:C.orange});text(s,'Vesta offert voor speelgoed relatief minder meubels op.\nDat geeft Vesta een comparatief voordeel.',60,627,1480,142,42);}
 else{text(s,'Klopt de conclusie?\nBenoem het verschil tussen middelen en alternatieve kosten.',60,573,1480,175,42);}
 note(s,'89',reveal?'Het bronfeit is absoluut: Elara heeft minder middelen nodig bij beide producten. De conclusie over Vesta volgt daar niet uit. Vesta’s lagere alternatieve kosten maken juist een comparatief voordeel mogelijk. Laat leerlingen het opgegeven product hardop noemen.':'Laat leerlingen kort denken en hun redenering geven. Gebruik alleen het eigen voorbeeld. Het antwoord staat op de volgende dia; dit is een begripcheck en geen extra huiswerk.', 'Welke informatie uit de eerdere vergelijking beslist hier?','Absoluut minder productief betekent niet comparatief ongunstig in alles.',reveal?'Terug naar startopgave 2 en dan oefenen.':'Bespreek de vergelijking.',true);
}
check(false);check(true);
overview('Zelfstandig werken',4);
const targetFooter='§3.3.1 · Opgave 7 · Boekpagina 95';
function target(t){return slide(t,targetFooter);}
{
 const s=target('Opgave 7 · Aster en Brin (1/2)');
 text(s,'Handelen ondanks twee absolute voordelen',60,194,1480,72,41,{bold:true,color:C.blue});
 text(s,'Werkplaatsen in Aster en Brin maken pompen en jassen van dezelfde kwaliteit. Dezelfde productiemiddelen kunnen voor beide activiteiten worden ingezet.',60,302,1480,170,39);
 text(s,'Aster heeft voor beide producten minder middelen nodig dan Brin. Zijn voorsprong is groot bij pompen en klein bij jassen.',60,508,1480,133,39);
 text(s,'Voor een extra jas offert Aster relatief veel pompen op. Brin offert daarvoor minder pompen op.',60,685,1480,129,39);
 note(s,'95','Dit is de volledige eerste alinea van de echte doelbron. Laat leerlingen hun eigen werk erbij nemen. Er worden nog geen voordelen benoemd in de oplossing; wijs alleen de bronzinnen aan die zij nodig kunnen hebben. De bron heeft geen figuur of productiegetallen.','Welke twee vergelijkingen staan in deze bron?','Een titel of bronzin is nog niet een volledig beargumenteerd antwoord.','Toon ook de tweede alinea van de bron.');
}
{
 const s=target('Opgave 7 · Aster en Brin (2/2)');
 text(s,'Beide landen willen pompen én jassen. Zij kunnen zonder hoge transportkosten handelen.',60,218,1480,133,41);
 text(s,'Asters pompen worden op tijd geleverd; buitenlandse kopers waarderen dat.',60,399,1480,112,41);
 text(s,'Jassenmakers in Aster verwachten klanten te verliezen aan jassen uit Brin.',60,558,1480,127,41);
 text(s,'Gebruik alleen de lesbron. Reken geen productieverhoudingen uit.',60,756,1480,74,34,{bold:true,color:C.blue});
 note(s,'95','Dit is de volledige tweede alinea en de werkinstructie van opgave 7. Het belang van tijdige levering en de mogelijke verliezende groep blijven expliciet zichtbaar. De volgende twee dia’s tonen alle vragen a–e voordat een antwoord wordt gegeven.','Waar geeft de bron informatie over klanten en groepen?','Zonder hoge transportkosten betekent niet dat iedere ruilafspraak automatisch voordeel geeft.','Toon alle deelvragen zonder antwoorden.');
}
{
 const s=target('Opgave 7 · Deelvragen a, b en c');
 const q=[['a · 2p','Welk land heeft een absoluut voordeel bij beide producten? Noem het brongegeven waarop je dat baseert.'],['b · 3p','Leg uit bij welk product elk land een comparatief voordeel heeft. Gebruik het begrip alternatieve kosten.'],['c · 2p','Beschrijf een passende richting van specialisatie en een bijbehorende handelsstroom. Benoem import en export vanuit de twee landen.']];
 q.forEach((r,i)=>{const y=205+i*204;text(s,r[0],60,y,185,65,36,{bold:true,color:C.blue});text(s,r[1],270,y,1265,159,39);if(i<2)rule(s,60,y+172,1480);});
 note(s,'95','De vragen zijn letterlijk uit de gedrukte doelopgave overgenomen. Laat nog geen uitwerkingen zien. Bij c zijn een richting van specialisatie én een goederenstroom vanuit twee gezichtspunten vereist.','Welke onderdelen vraagt c allemaal?','Alleen het product noemen beantwoordt c nog niet.','Toon ook d en e voordat de bespreking begint.');
}
{
 const s=target('Opgave 7 · Deelvragen d en e');
 text(s,'d · 2p',60,207,185,65,36,{bold:true,color:C.blue});text(s,'Leg uit onder welke voorwaarde de ruil beide landen voordeel kan opleveren. Gebruik daarnaast één bronfeit om Asters concurrentiepositie bij pompen te verklaren.',270,207,1265,208,39);rule(s,60,450,1480);
 text(s,'e · 2p',60,493,185,65,36,{bold:true,color:C.blue});text(s,'Een adviseur zegt: “Aster produceert beide goederen efficiënter, dus handel maakt alle inwoners van Aster beter af.” Beoordeel de uitspraak met een concrete groep uit de bron.',270,493,1265,222,39);
 text(s,'Controle: middelen en alternatieve kosten onderscheiden? Concrete groep genoemd?',60,765,1480,68,30,{bold:true});
 note(s,'95','Nu zijn de hele bron en alle vijf subvragen beschikbaar. De controlezin onderaan bewaart beide checks uit de boekopgave. Vraag d heeft twee onderdelen: ruilvoorwaarde en concurrentiepositie. E vraagt een oordeel met een concrete groep. De oplossingen volgen pas hierna.','Welke twee verschillende verklaringen vraagt d?','Een algemene zin dat handel goed is beantwoordt d en e niet.','Begin met het brongegeven voor a.');
}
{
 const s=target('Opgave 7a · Het absolute voordeel');
 text(s,'Bronfeit',60,231,390,70,38,{bold:true,color:C.blue});text(s,'Aster heeft voor beide producten minder middelen nodig.',500,231,1040,140,44);
 rule(s,60,430,1480);
 text(s,'Vergelijking',60,476,390,70,38,{bold:true,color:C.blue});text(s,'Hetzelfde product en dezelfde kwaliteit',500,476,1040,124,43);
 text(s,'Aster heeft een absoluut voordeel bij pompen én jassen.',60,710,1480,112,45,{bold:true,color:C.green});
 note(s,'95','Volledig antwoord: Aster heeft voor pompen en jassen minder productiemiddelen nodig bij dezelfde kwaliteit. Dat voldoet aan de definitie van absoluut voordeel. Geef zowel het land als het juiste bronfeit. Deze uitwerking dekt de twee gevraagde elementen van a.','Waarom hoort “dezelfde kwaliteit” bij de vergelijking?','De grootte van de voorsprong bepaalt hier niet of er een absoluut voordeel is.','Vergelijk voor b de opgegeven productie.');
}
{
 const s=target('Opgave 7b · De comparatieve voordelen');
 table(s,[['Land','Lagere alternatieve kosten van','Economische verklaring'],['Brin','Jassen','Voor een extra jas geeft het\nrelatief minder pompen op.'],['Aster','Pompen','Voor extra pompen geeft het\nrelatief minder jassen op.']],60,242,1480,396,[250,565,665],34);
 text(s,'Brins absolute nadeel sluit een comparatief voordeel niet uit.',60,721,1480,106,42,{bold:true,color:C.green});
 note(s,'95','De bron zegt direct dat Brin minder pompen opgeeft voor een extra jas. Dat zijn lagere alternatieve kosten van jassen en dus een comparatief voordeel van Brin. In deze twee-productenvergelijking is Asters relatieve kracht pompen: Aster geeft relatief minder jassen op voor pompen. Benoem beide landen en producten en koppel het begrip alternatieve kosten aan de opgegeven productie. Geen productieverhoudingen berekenen.','Welk ander product offert Brin op als het jassen maakt?','“Brin is goedkoper” is geen brongebonden uitleg van alternatieve kosten.','Gebruik die voordelen voor c.');
}
{
 const s=target('Opgave 7c · Specialisatie en goederenstroom');
 text(s,'Brin: meer jassen. Aster: meer pompen.',60,231,1480,70,44,{bold:true,color:C.blue});flow(s,'Brin','Aster','jassen',365);
 text(s,'Omgekeerd kunnen pompen van Aster naar Brin gaan.',60,731,1480,86,41,{bold:true});
 note(s,'95','Brin richt zich meer op jassen en Aster op pompen. Een passende goederenstroom is jassen van Brin naar Aster: export van Brin en import van Aster. Ook pompen van Aster naar Brin is correct mits beide gezichtspunten worden genoemd. Het gekozen voorbeeld toont één stroom volledig. Specialisatie hoeft niet volledig te zijn.','Wat noem je dezelfde jassenstroom vanuit Aster?','Verwissel handelsstroom en geldstroom niet.','Welke voorwaarde stelt d aan deze ruil?');
}
{
 const s=target('Opgave 7d · De ruilvoorwaarde');
 text(s,'Ruilen vergeleken met zelf produceren',60,234,1480,93,47,{bold:true,color:C.blue});
 table(s,[['Aster','Brin'],['De afgesproken ruil is\naantrekkelijker dan zelf maken.','De afgesproken ruil is\naantrekkelijker dan zelf maken.']],60,403,1480,237,[740,740],39);
 text(s,'Gunstige ruilafspraken voor beide partijen zijn nodig.',60,738,1480,91,43,{bold:true,color:C.green});
 note(s,'95','Eerste deel d: de ruilafspraken moeten voor beide partijen aantrekkelijk zijn ten opzichte van zelf produceren. De bron maakt duidelijk dat beide landen beide producten willen en zonder hoge transportkosten kunnen handelen. Dat ondersteunt de mogelijkheid van voordeel, maar vervangt de ruilvoorwaarde niet.','Is weinig transportkosten op zichzelf genoeg voor voordeel voor beiden?','Een gunstige specialisatierichting garandeert niet dat elke verdeling van de handelswinst aanvaardbaar is.','Beantwoord nu ook het tweede deel van d.');
}
{
 const s=target('Opgave 7d · Concurrentiepositie bij pompen');
 const r=[['Bronfeit','Asters pompen komen op tijd.'],['Belang van de klant','Buitenlandse kopers waarderen dat.'],['Gevolg','De betrouwbare levering maakt\nAsters aanbod aantrekkelijk.']];
 r.forEach((a,i)=>{const y=237+i*186;text(s,a[0],60,y,450,125,37,{bold:true,color:C.blue});text(s,a[1],575,y,960,129,43);if(i<2)rule(s,60,y+144,1480);});
 note(s,'95','Tweede deel d: op tijd leveren maakt Asters pompen aantrekkelijk voor buitenlandse kopers, die betrouwbaarheid waarderen. Verbind het bronfeit dus aan de concurrentiepositie. Een prijsverlaging of kwaliteitsverschil is hier niet gegeven. Kwaliteit is juist gelijk in de landenvergelijking.','Welk koopcriterium noemt de bron expliciet?','Verzin geen goedkopere pompen of betere kwaliteit.','Toets de brede conclusie van de adviseur aan de genoemde verliezende groep.');
}
{
 const s=target('Opgave 7e · Niet alle inwoners winnen');
 text(s,'Oordeel: de algemene conclusie is onjuist.',60,226,1480,80,45,{bold:true,color:C.orange});
 table(s,[['Concrete groep','Brongegeven'],['Jassenmakers in Aster','Zij verwachten klanten te verliezen\naan import uit Brin.']],60,409,1480,247,[600,880],39);
 text(s,'Efficiënter produceren bewijst geen voordeel voor elke inwoner.',60,742,1480,96,42,{bold:true});
 note(s,'95','Beoordeel de gevolgtrekking, niet het correcte eerste bronfeit. Aster produceert beide producten met minder middelen, maar uit dat absolute voordeel volgt niet dat iedereen wint door handel. De bron noemt jassenmakers die klanten kunnen verliezen aan Brin. Met die concrete groep is de algemene uitspraak weerlegd. Claim geen aantallen verloren banen, want die geeft de bron niet.','Welk deel van de uitspraak klopt, en welke conclusie gaat te ver?','“Handel is altijd slecht” is evenmin onderbouwd. Onderscheid groepen.','Laat leerlingen hun eigen antwoord controleren en verbeteren.');
}
{
 const s=slide('Antwoordcontrole bij opgave 7');
 const r=[['a en b','Middelen én alternatieve kosten duidelijk onderscheiden'],['c','Specialisatie plus export en import vanuit beide landen'],['d','Ruilvoorwaarde én betrouwbare levering uitgelegd'],['e','Oordeel met de jassenmakers in Aster onderbouwd']];
 r.forEach((a,i)=>{const y=211+i*139;text(s,a[0],60,y,240,80,40,{bold:true,color:C.blue});text(s,a[1],360,y,1175,103,40);});
 text(s,'Verbeter één ontbrekend bronfeit of één ontbrekende verklaring.',60,778,1480,60,34,{bold:true,color:C.orange});
 note(s,'95','Laat elke leerling het eigen antwoord aanvullen, niet alleen de conclusie overschrijven. Controleer alle vijf onderdelen en vooral beide delen van d. Het antwoordmodel staat gelijkwaardige formuleringen toe. Deze les introduceert de groepen die in §3.3.2 terugkomen bij wereldmarktprijs, binnenlandse productie en verbruik.','Welke stap ontbrak in jouw eigen antwoord?','Alleen de juiste landen of producten noemen is onvoldoende als de vraag een uitleg verlangt.','Laat de laatste overzichtsdia staan en noteer het huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,overviewSlides:overviews,nativeTableSlides:tables},null,2));
console.log('Slides:',p.slides.items.length);
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,stem+'.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:[],verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
