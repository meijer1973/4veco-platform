// HOW TO ADAPT: derive assignments, prerequisites and examples from the new paragraph;
// update its manifest before authoring. Use the installed runtime environment variables.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('223');
const sourceManifest=JSON.parse(await fs.readFile(new URL('./presentation-223.manifest.json',import.meta.url),'utf8'));
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', tables=[], slides=[], overviews=[];
const editionUrl='https://github.com/meijer1973/4veco-lessen/blob/'+sourceManifest.sourceCommit+'/'+sourceManifest.sourceEdition.split('/').map(encodeURIComponent).join('/')+'/';
const example='Uitlegvoorbeeld — niet uit het boek';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(title,footer='§2.2.3 · Inkomenselasticiteit en kruislingse elasticiteit'){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,38,1480,95,50,{bold:true});rule(s,60,151,1480);
 text(s,footer,60,851,1400,29,21,{color:C.muted,name:'footer'});
 text(s,String(p.slides.items.length),1470,848,70,30,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title});return s;
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;
  for(let c=0;c<values[0].length;c++){const z=t.getCell(r,c);z.fill=r===0?C.ink:(r%2?C.paper:C.pale);z.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}
 tables.push(p.slides.items.length);return t;
}
function notes(s,page,explanation,question,pitfall,transition,{authored=false,extra=''}={}){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 2, editie chat-2026, revisie 21 september 2026; gedrukte pagina ${page}. ${editionUrl}boek/Boek_2_Compleet.pdf\n${authored?'De context en cijfers op deze dia zijn een eigen uitlegvoorbeeld, niet uit het boek. De paginaverwijzing onderbouwt alleen de methode.':'Antwoordmodel: '+editionUrl+'boek/Boek_2_Compleet_Antwoorden.pdf'}\n${extra}`);
}
function label(s,str=example){text(s,str,60,185,1480,44,30,{bold:true,color:C.blue});}
function line(s,str,y,color=C.ink,size=43){text(s,str,60,y,1480,85,size,{bold:true,color});}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 8.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=p.slides.add();s.background.fill=C.paper;overviews.push(p.slides.items.length);
 const title='Deze les: §2.2.3 Inkomenselasticiteit\nen kruislingse elasticiteit';
 text(s,title,60,23,1480,110,44,{bold:true,name:'overview-title'});
 text(s,'Nu: '+phase,60,140,1480,39,30,{bold:true,color:C.blue,name:'phase'});rule(s,60,184,1480);
 text(s,'Lesroute',60,211,835,45,35,{bold:true});
 const ys=[266,351,406,460,632,703,772],hs=[77,45,45,160,60,58,45];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,211,568,45,35,{bold:true});
 text(s,'Ei en Ek berekenen en indelen.\nBeide goederen benoemen.\nVraagfuncties onderzoeken.',972,266,568,111,30,{name:'overview-goals'});rule(s,972,379,568);
 text(s,'Startopdracht · pagina 59',972,397,568,44,34,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Opgave 1: ophalen\nOpgave 2: verkennen met\nde theorie, p. 53–56',972,451,568,126,31,{name:'overview-start'});rule(s,972,583,568);
 text(s,'Huiswerk',972,605,568,44,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§2.2.3 · Opgaven 3 t/m 8\nBasis: 3, 4 en 5\nZelfstandig: 6 en 7 · Doel: 8\nMaken en nakijken',972,666,568,155,30,{name:'overview-homework'});
 text(s,'§2.2.3 · Inkomenselasticiteit en kruislingse elasticiteit',60,851,1400,29,21,{color:C.muted,name:'footer'});
 text(s,String(p.slides.items.length),1470,848,70,30,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title,role:'overview'});
 notes(s,'53–56 en 59–62',`Laat de dia staan tijdens ${phase.toLowerCase()}. Opgave 1 haalt procenten en eenvoudig invullen op. Bij twijfel geef je het rekenschema (nieuw − oud) / oud × 100%, of laat je eerst P vervangen en daarna vermenigvuldigen. Opgave 2 verkent nieuwe leerstof: 2a gebruikt definities op p. 53–54; bij 2b helpt het één-factor-voorbeeld op p. 55–56. Laat leerlingen die tekst erbij nemen en een voorlopige redenering noteren; verwacht nog geen zelfstandige beheersing. Na de uitleg keren we terug naar opgave 2. Basis 3 staat op p. 59, 4–5 op p. 60; zelfstandig 6–7 op p. 61; doel 8 op p. 62. Huiswerk: 3, 4, 5, 6, 7 en 8 maken en nakijken. Bonus en herhaling zijn extra.`, 'Welke stap lukt al, en welke wil je met de uitleg opnieuw bekijken?', 'Een startpoging bij nieuwe Ei-, Ek- en functie-scenario’s is geen toets van eerder verworven kennis.',phase==='Afsluiting / huiswerk'?'Laat het huiswerk in de agenda zetten. Rond de oefenroute zo nodig in aanvullende lestijd af.':'Ga naar de volgende lesfase; neem tijd voor vragen.',{extra:'Docenteninformatie: volledige route kan meer dan één les vragen. Er is geen gemeten tijdsclaim.'});
}

// 1: One shared overview, also used during practice and closure.
overview('Startopdracht',2);
// 2
{
 const s=slide('Lesdoelen · De veranderde factor bepaalt de noemer');
 table(s,[['Wat verandert?','Verhouding','Wat kun je uitleggen?'],['Eigen prijs P','Ev = %ΔQv / %ΔP','Opfrissen: reactie op de eigen prijs'],['Inkomen Y','Ei = %ΔQv / %ΔY','Soort goed in deze situatie'],['Prijs van ander goed Z','Ek = %ΔQx / %ΔPz','Relatie tussen X en Z']],60,235,1480,400,[470,480,530],32);
 text(s,'Bij functies: één factor veranderen, de rest gelijk houden.',60,708,1480,99,41,{bold:true,color:C.blue});
 notes(s,'36–38 en 52–56','Verbind met Ev uit §2.2.1: de teller is steeds de procentuele reactie van de vraag. De noemer bepaalt nu of je inkomen of de prijs van een ander goed onderzoekt. Na deze les kunnen leerlingen berekenen, het teken uitleggen, categorieën kiezen en een vraagfunctie met één verandering onderzoeken. Qx is Qv voor goed X.','Welke factor zou je onder de breuk zetten als alleen het inkomen verandert?','Gebruik de negatieve-Ev-indeling niet voor Ei of Ek. Hetzelfde getal beantwoordt een andere economische vraag.','Haal eerst procenten en functie-invulling op.');
}
// 3
{
 const s=slide('Procenten · De oude waarde is de basis');label(s);
 line(s,'Jaarinkomen: € 24.000 → € 25.200',280,C.blue);
 line(s,'%ΔY = (nieuw − oud) / oud × 100%',410);
 line(s,'%ΔY = (25.200 − 24.000) / 24.000 × 100%',515);
 line(s,'= +5%',645,C.green,57);
 notes(s,'37','Eigen rekenvoorbeeld ter opfrissing. De toename is 1.200 euro per jaar. Vergelijk die met het oude inkomen van 24.000 euro per jaar. Zo krijg je +5%, niet 1.200%. Bij een daling blijft het negatieve teken staan. Gebruik bij Q precies hetzelfde schema met de oude hoeveelheid als basis.','Welk bedrag hoort in de noemer, en waarom?','Deel niet door de nieuwe waarde. Zet geen euroteken bij het uiteindelijke percentage.','Vervang daarna een letter door een gegeven getal.',{authored:true});
}
// 4
{
 const s=slide('Een functie invullen');label(s);
 line(s,'Qv = 460 − 12P     |     P = 15',270,C.blue);
 text(s,'Qv: bezoeken per week · P: prijs in euro per bezoek',60,357,1480,59,33);
 line(s,'Qv = 460 − 12 × 15',452);
 line(s,'Qv = 460 − 180 = 280 bezoeken per week',578,C.green);
 text(s,'Eerst vervangen, dan vermenigvuldigen, daarna aftrekken.',60,748,1480,67,35,{bold:true});
 notes(s,'55; voorkennis volgens hoofdstukhandleiding','Eigen eenvoudige functie voor bibliotheekbezoeken. Laat zien dat 12P een vermenigvuldiging is. Vervang P door 15, reken 12 × 15 uit en trek dit af van 460. Dit is de opfrissing voor start 1b; de formele functie met meerdere factoren volgt verderop. De eenheid komt uit de betekenis van Qv.','Wat doe je eerst: 460 − 12 of 12 × 15?','Een minteken hoort bij de hele term −12P. Neem dat ook mee wanneer er meer termen volgen.','Onderzoek nu hoe inkomen de vraag verandert.',{authored:true});
}
// 5
{
 const s=slide('Inkomenselasticiteit · Vraagreactie op inkomen');label(s);
 line(s,'Muziekwinkel: inkomen +8%, prijzen gelijk',253,C.blue,39);
 table(s,[['Vraag naar…','%ΔQv','Ei = %ΔQv / %ΔY'],['Concertpakketten','+12%','+12% / +8% = +1,5'],['Bladmuziek','+4%','+4% / +8% = +0,5'],['Budget-cd’s','−4%','−4% / +8% = −0,5']],60,361,1480,355,[600,260,620],33);
 text(s,'Het teken vertelt of Qv met Y mee of tegen Y in beweegt.',60,754,1480,65,37,{bold:true});
 notes(s,'53','Dit is een verzonnen onderzoek bij een muziekwinkel met drie afzonderlijke vraagreacties op dezelfde inkomensstijging. Houd prijzen en overige vraagfactoren gelijk. Deel de procentuele vraagverandering door +8%. Bewaar het minteken bij budget-cd’s. Ei is een getal zonder procentteken. +1,5 betekent dat de vraag in deze meting procentueel anderhalf keer zo sterk groeit als het inkomen.','Welke vraag reageert tegengesteld aan het inkomen?','Negatief betekent bij Ei niet prijsinelastisch. Ei beschrijft inkomen, niet een eigen prijs.','Koppel het teken en de grootte aan de categorieën van dit boek.',{authored:true});
}
// 6
{
 const s=slide('Ei · Eerst het teken, dan de grootte');
 table(s,[['Ei','Categorie in dit boek','Bij een hoger inkomen'],['Ei < 0','Inferieur goed','Qv daalt'],['0 < Ei < 1','Normaal goed','Qv stijgt procentueel minder sterk'],['Ei > 1','Luxegoed','Qv stijgt procentueel sterker']],60,215,1480,352,[320,460,700],32);
 text(s,'Ei = 0: Qv verandert niet.\nEi = 1: Qv verandert procentueel even sterk als Y.',60,614,1480,108,36,{bold:true,color:C.blue});
 text(s,'Grenswaarden krijgen hier geen categorielabel.',60,752,1480,60,34);
 notes(s,'53','Pas toe op het muziekwinkelvoorbeeld: concertpakketten zijn hier luxe, bladmuziek normaal en budget-cd’s inferieur. Deze methode gebruikt normaal alleen voor 0 < Ei < 1. Grenswaarden 0 en 1 krijgen hier geen van de drie labels. De indeling geldt voor de onderzochte groep en situatie. Inferieur is geen oordeel over kwaliteit; luxe betekent niet alleen duur.','Wat vertelt Ei = −0,5 over de vraag bij een hoger inkomen?','Wissel niet stilzwijgend naar een andere definitie van normaal. Het teken blijft onderdeel van de indeling.','Verander nu de prijs van een ander goed.');
}
// 7
{
 const s=slide('Ek · Vraag naar X, prijs van Z');label(s);
 line(s,'Prijs van e-readers +20%; overige factoren gelijk',252,C.blue,39);
 table(s,[['Vraaggoed X','Prijsgoed Z','Ek = %ΔQx / %ΔPz'],['Papieren romans: +6%','E-readers: +20%','+6% / +20% = +0,3'],['Passende hoesjes: −8%','E-readers: +20%','−8% / +20% = −0,4']],60,355,1480,290,[590,400,490],32);
 text(s,'Ek > 0: substituten\nGoederen kunnen elkaar vervangen.',60,693,710,122,35,{bold:true,color:C.green});
 text(s,'Ek < 0: complementen\nGoederen worden samen gebruikt.',825,693,715,122,35,{bold:true,color:C.orange});
 notes(s,'54','Eigen voorbeeld: twee afzonderlijke relaties met de e-readerprijs als noemer. Duurdere e-readers gaan samen met meer vraag naar het alternatief papieren romans: substituten. De vraag naar hoesjes die bij de e-readers passen daalt: complementen. Benoem steeds de vraag naar X én de prijs van Z. De eigen prijs van romans of hoesjes en inkomen blijven gelijk. Bij Ek = 0 zie je in deze meting geen vraagreactie.','Wat staat boven de breuk voor de hoesjes, en wat staat eronder?','Een positieve prijsverandering maakt Ek niet vanzelf positief; het teken van de hoeveelheidsreactie telt ook mee.','Controleer dezelfde begrippen bij een dalende andere prijs.',{authored:true});
}
// 8
{
 const s=slide('Ook bij een prijsdaling blijft het teken betekenisvol');label(s);
 line(s,'Apart onderzoek: prijs van e-readers −20%',252,C.blue,40);
 table(s,[['Vraaggoed X','Ek ten opzichte van e-readerprijs','Relatie'],['Papieren romans: −6%','−6% / −20% = +0,3','Substituten'],['Passende hoesjes: +8%','+8% / −20% = −0,4','Complementen']],60,360,1480,300,[530,610,340],32);
 text(s,'Twee mintekens → positief. Eén minteken → negatief.',60,734,1480,87,40,{bold:true,color:C.blue});
 notes(s,'54','Een tweede, afzonderlijk verzonnen onderzoek levert de getoonde reacties. Deze cijfers zijn gegeven en niet automatisch afgeleid van de vorige prijsstijging. Andere factoren blijven gelijk. Goedkopere e-readers gaan hier samen met minder vraag naar papieren romans en meer vraag naar passende hoesjes. Het teken van de verhouding behoudt dezelfde betekenis.','Is de relatie tussen romans en e-readers nu veranderd omdat beide veranderingen negatief zijn?','Ek kan positief zijn terwijl de vraag daalt. Redeneer met teller én noemer.','Gebruik nu inkomen en de andere prijs in één vraagfunctie.',{authored:true});
}
// 9
{
 const s=slide('LeesClub X · De betekenis van de variabelen');label(s);
 line(s,'Qx = 160 − 4Px + 2Pz + 0,01Y',253,C.blue,46);
 table(s,[['Symbool','Betekenis en eenheid','Begin'],['Qx','Abonnementen op LeesClub X per maand','Te berekenen'],['Px','Maandprijs LeesClub X in euro','15'],['Pz','Maandprijs andere leesdienst Z in euro','20'],['Y','Gemiddeld jaarinkomen in euro','26.000']],60,371,1480,390,[230,940,310],31);
 notes(s,'55','Eigen uitlegvoorbeeld LeesClub X met een concurrerende leesdienst Z. Lees de betekenissen vóór het rekenen. De beginrij hoort alleen bij dit model. Jaarinkomen blijft jaarinkomen, hoewel Qx abonnementen per maand weergeeft: de coëfficiënten horen bij de opgegeven eenheden. De maandprijs wordt evenmin met twaalf vermenigvuldigd.','Waarom vullen we bij Y 26.000 in en niet 26.000 / 12?','De coëfficiënt 0,01 is geen Ei. Het is een verandering in abonnementen per maand per euro jaarinkomen.','Vul eerst alle drie beginwaarden in.',{authored:true});
}
// 10
{
 const s=slide('LeesClub X · De beginhoeveelheid');label(s);
 text(s,'Px = 15 · Pz = 20 · Y = 26.000',60,253,1480,67,37,{bold:true,color:C.blue});
 line(s,'Qx = 160 − 4 × 15 + 2 × 20 + 0,01 × 26.000',377,C.ink,41);
 line(s,'Qx = 160 − 60 + 40 + 260',507);
 line(s,'Qx = 400 abonnementen per maand',646,C.green,48);
 notes(s,'55','Vervang elk symbool door de eigen beginwaarde. Reken de drie vermenigvuldigingen uit, bewaar hun tekens en tel daarna op: 160 − 60 + 40 + 260 = 400. Deze beginhoeveelheid is straks de oude waarde bij percentages. De −4 laat zien dat een euro hogere eigen prijs binnen dit model vier abonnementen minder geeft; het is geen procentuele verhouding.','Welke hoeveelheid gebruiken we straks als oude waarde?','Tel niet alleen de veranderde term op: voor de beginhoeveelheid heb je de hele functie nodig.','Verander nu alleen Y.',{authored:true});
}
// 11
{
 const s=slide('LeesClub X · Alleen het inkomen verandert');label(s);
 table(s,[['Scenario','Px','Pz','Y'],['Begin','15','20','26.000'],['Alleen hoger Y','15','20','28.600']],60,265,1480,241,[640,210,210,420],34);
 line(s,'Qx nieuw = 160 − 4 × 15 + 2 × 20 + 0,01 × 28.600',560,C.ink,39);
 line(s,'= 160 − 60 + 40 + 286 = 426',671,C.green,45);
 text(s,'426 abonnementen per maand · Px en Pz blijven gelijk',60,773,1480,52,33,{bold:true});
 notes(s,'56 en 58','Alleen het jaarinkomen wordt 28.600. De twee prijzen blijven op hun beginwaarde. De inkomensterm stijgt van 260 naar 286; Qx groeit daarom van 400 naar 426 abonnementen per maand. Laat beide vaste prijswaarden in de berekening staan zodat de vergelijking controleerbaar is.','Welke term verandert, en welke twee variabelen houden we gelijk?','26 extra abonnementen is een absolute verandering, nog geen percentage en nog geen Ei.','Zet de hoeveelheids- en inkomensverandering om in procenten.',{authored:true});
}
// 12
{
 const s=slide('LeesClub X · Van hoeveelheden naar Ei');label(s);
 line(s,'%ΔQx = (426 − 400) / 400 × 100% = +6,5%',282,C.ink,41);
 line(s,'%ΔY = (28.600 − 26.000) / 26.000 × 100% = +10%',405,C.ink,39);
 line(s,'Ei = +6,5% / +10% = +0,65',544,C.green,49);
 line(s,'0 < Ei < 1 → normaal goed in deze situatie',681,C.blue,40);
 notes(s,'56 en 58','Het oude Qx is 400 en het oude Y is 26.000. Bereken beide procentuele veranderingen met hun eigen oude basis. De vraag groeit minder sterk dan het inkomen, dus X is volgens de boekindeling normaal. De berekende Ei is +0,65 en niet de functiecoëfficiënt 0,01. Elasticiteit heeft geen euro- of procent-eenheid.','Waarom delen we 26 door 400 en niet door 26.000?','Houd de grootheden bij elkaar: Q bij Q en Y bij Y. Deel daarna percentages, niet absolute verschillen.','Ga terug naar de oorspronkelijke beginsituatie voor een andere prijs.',{authored:true});
}
// 13
{
 const s=slide('LeesClub X · Terug naar het begin');label(s);
 table(s,[['Afzonderlijk scenario','Px','Pz','Y','Qx per maand'],['Begin','15','20','26.000','400'],['Alleen hoger Y','15','20','28.600','426'],['Y terug; alleen hoger Pz','15','25','26.000','410']],60,262,1480,326,[610,150,150,240,330],30);
 line(s,'Qx = 160 − 4 × 15 + 2 × 25 + 0,01 × 26.000 = 410',646,C.green,39);
 text(s,'Pz stijgt → Qx stijgt. Px en Y blijven op hun beginwaarde.',60,755,1480,70,36,{bold:true,color:C.blue});
 notes(s,'56 en 58','Het prijssegment begint weer bij Qx = 400. Zet het inkomen terug op 26.000, houd Px op 15 en wijzig alleen Pz naar 25. De term 2Pz wordt 50 in plaats van 40, dus Qx stijgt met 10 naar 410. Dit positieve verband past bij substituten. De nieuwe prijs komt niet boven op de eerdere inkomensstijging.','Waarom vergelijken we 410 met 400 en niet met 426?','Y = 28.600 laten staan zou twee veranderingen combineren; dan onderzoek je een ander scenario.','Bekijk wat je wel kunt zeggen als twee factoren tegelijk veranderen.',{authored:true});
}
// 14
{
 const s=slide('Twee factoren tegelijk');label(s);
 table(s,[['Afzonderlijk onderzoek','Gemeten reactie van e-readervraag'],['Papieren boeken worden 10% duurder','+4%'],['Passende hoesjes worden 20% duurder','−3%']],60,276,1480,276,[890,590],34);
 text(s,'Beide prijzen tegelijk omhoog: de richtingen werken elkaar tegen.',60,604,1480,113,41,{bold:true,color:C.blue});
 text(s,'Zonder gezamenlijk model is het totale effect niet zeker.',60,752,1480,71,36);
 notes(s,'52, 56 en 60; hoofdstukhandleiding §2.2.3','Eigen verkennend voorbeeld dat voorbereidt op basisopgave 5, zonder Fruitbar uit te werken. In elk afzonderlijk onderzoek blijven de andere vraagfactoren gelijk. Een duurder alternatief werkt richting meer e-readervraag, een duurder samen gebruikt hoesje richting minder. In een nieuwe situatie veranderen beide prijzen. De losse metingen leveren geen bewezen exacte som: +4% − 3% = +1% is zonder passend model geen zekere voorspelling.','Kun je uit deze twee metingen zeker afleiden hoeveel de gezamenlijke vraag verandert?','Twee stijgende prijzen bewijzen geen twee positieve Ek’s. De hoeveelheidsreactie staat in de teller.','Keer terug naar de verkenning uit de startopdracht.',{authored:true});
}
// 15
{
 const s=slide('Terug naar startopgave 2','§2.2.3 · Startopgave 2 · Boekpagina 59');
 text(s,'a) Wat deel je door wat bij Ei? En bij Ek?\nGebruik woorden, geen losse letters.',60,234,1480,152,43,{bold:true,color:C.blue});
 text(s,'b) Je verandert Y in een vraagfunctie met Px, Pz en Y.\nWelke variabelen houd je gelijk?',60,443,1480,150,41);
 text(s,'Vergelijk met je eerste poging en verbeter je uitleg.',60,701,1480,96,40,{bold:true,color:C.green});
 notes(s,'53–56 en 59','Terugkeer na instructie, vóór zelfstandig oefenen. Laat eerst leerlingen hun voorlopige antwoord herzien. Controleer mondeling: bij Ei procentuele verandering van de gevraagde hoeveelheid gedeeld door procentuele inkomensverandering; bij Ek procentuele vraagverandering van goed X gedeeld door procentuele prijsverandering van ander goed Z. Bij een verandering van Y blijven Px en Pz gelijk. Dit is feedback op een al geprobeerd startitem, geen vervanging van het separate uitlegvoorbeeld.','Kun je bij Ek beide goederen en bij het Y-scenario beide vaste prijzen benoemen?','Losse letters noemen zonder betekenis laat nog niet zien dat de noemer en het onderzoeksdoel begrepen zijn.','Laat het overzicht staan terwijl leerlingen beginnen bij basis 3–5.');
}
// 16
overview('Zelfstandig werken',4);
// 17–21: Every target source and subquestion precedes every solution.
{
 const s=slide('Opgave 8 · Inkomen, koffie en fitness','§2.2.3 · Doeloefening 8 · Boekpagina 62');
 line(s,'Gebruik steeds de oude waarde als noemer.',222,C.blue,42);
 line(s,'Ei = %ΔQv / %ΔY',348);
 text(s,'Ei < 0: inferieur goed · 0 < Ei < 1: normaal goed\nEi > 1: luxegoed · Ei = 0 en Ei = 1: grenswaarden',60,450,1480,113,36);
 line(s,'Ek = %ΔQv van goed X / %ΔP van ander goed Z',631,C.ink,40);
 text(s,'Noem bij Ek altijd beide goederen.',60,751,1480,61,37,{bold:true});
 notes(s,'62','Start de doelbespreking nadat leerlingen oefening 8 zelf hebben geprobeerd. Dit zijn de volledige rekenafspraken uit de originele context, inclusief de afwijkend begrensde categorie normaal en beide grenswaarden. De volgende vier dia’s geven alle drie bronnen en deelvragen a–e, zonder oplossingen. Laat leerlingen hun boek openhouden op p. 62.','Welke afspraak voorkomt dat we verkeerde procenten vergelijken?','De aanwijzingen op deze dia horen bij de opdracht; geef nog geen uitkomsten van de doelvragen.','Toon bron inkomen en de eerste twee vragen.');
}
{
 const s=slide('Opgave 8 · Bron inkomen en vragen a–b','§2.2.3 · Doeloefening 8 · Boekpagina 62');
 text(s,'Het gemiddelde inkomen stijgt 5%. De vraag naar maaltijdpakketten stijgt 8%; de vraag naar budgetnoedels daalt 3%.',60,215,1480,159,40,{bold:true,color:C.blue});
 rule(s,60,423,1480);
 text(s,'a) Bereken met bron inkomen Ei voor maaltijdpakketten en budgetnoedels. (3 punten)',60,473,1480,130,39);
 text(s,'b) Classificeer beide goederen met de drie categorieën uit de context. (2 punten)',60,670,1480,129,39);
 notes(s,'62','Toon de originele inkomensbron en beide volledige deelvragen. De hoeveelheid verandert bij twee verschillende goederen. Vraag leerlingen hun berekeningen en classificaties klaar te houden, maar bespreek de uitkomsten pas nadat alle doelvragen zijn getoond.','Welke gegevens horen bij a en welke stap vraagt b daarna?','Het inkomen stijgt voor beide goederen; de twee hoeveelheidsreacties hebben niet hetzelfde teken.','Toon de koffiebron en vraag c.');
}
{
 const s=slide('Opgave 8 · Bron koffie en vraag c','§2.2.3 · Doeloefening 8 · Boekpagina 62');
 text(s,'De koffieprijs stijgt 10%. De vraag naar thee stijgt 4%; de vraag naar koffiefilters daalt 6%.',60,222,1480,155,43,{bold:true,color:C.blue});rule(s,60,422,1480);
 text(s,'c) Bereken met bron koffie Ek voor de vraag naar thee ten opzichte van de koffieprijs en voor de vraag naar koffiefilters ten opzichte van de koffieprijs.',60,476,1480,191,39);
 text(s,'Noem teller- en noemergoed en classificeer de relaties. (4 punten)',60,701,1480,108,39);
 notes(s,'62','Bewaar de complete bron en alle eisen van c: beide berekeningen, tellergoed, noemergoed en relatie. Er staan hier geen oplossingen. Koffie is in beide verhoudingen het prijsgoed; laat leerlingen dat in hun eigen werk opzoeken.','Welke onderdelen moet een volledig antwoord op c bevatten?','Alleen de twee getallen noemen is onvoldoende: de opdracht vraagt goederen en relaties.','Toon nu de bron voor d en e.');
}
{
 const s=slide('Opgave 8 · Bron functie','§2.2.3 · Doeloefening 8 · Boekpagina 62');
 line(s,'Fitnessdienst X: Qx = 100 − 2Px + 0,5Pz + 0,01Y',224,C.blue,43);
 table(s,[['Grootheid','Betekenis en eenheid','Begin'],['Qx','Gevraagde abonnementen per maand','Te berekenen'],['Px','Maandprijs fitnessdienst X in euro','10'],['Pz','Maandprijs concurrerende sportdienst Z in euro','20'],['Y','Gemiddeld jaarinkomen in euro','30.000']],60,354,1480,400,[230,940,310],31);
 notes(s,'62','Deze native tabel herschikt de volledige functietekst uit het boek, met behoud van dienst X, de concurrerende sportdienst Z, alle eenheden en beginwaarden. Het betreft een nieuwe context met een eigen beginhoeveelheid; neem geen 400 uit LeesClub over.','Welke eenheid heeft Y, en welke eenheid zal Qx krijgen?','Maandabonnementen maken Y niet tot maandinkomen. De gegeven coëfficiënt hoort bij jaarinkomen.','Toon beide volledige functievragen voordat je de oplossingen bespreekt.');
}
{
 const s=slide('Opgave 8 · Vragen d–e','§2.2.3 · Doeloefening 8 · Boekpagina 62');
 text(s,'d) Bereken Qx in de beginsituatie en nadat alleen Y stijgt naar 33.000. Bereken daarna %ΔQx, Ei en classificeer fitnessdienst X. Leg uit wat met Qx gebeurt en welke variabelen gelijk blijven. (4 punten)',60,220,1480,259,39);
 rule(s,60,513,1480);
 text(s,'e) Zet Y terug op 30.000. Bereken Qx nadat alleen Pz stijgt van 20 naar 24. Leg uit welke richting het verband tussen Pz en Qx heeft en welke variabelen gelijk blijven. (3 punten)',60,571,1480,233,39);
 notes(s,'62','Alle subvragen a–e zijn nu beschikbaar geweest, zonder oplossingen. Vraag d omvat beide hoeveelheden, de procentuele reactie, Ei, classificatie, de absolute richting en vaste variabelen. Bij Ei is ook %ΔY nodig als tussenstap. Vraag e begint opnieuw bij Y = 30.000. Blader zo nodig terug naar de brondia of gebruik p. 62.','Welke regel zorgt dat e een afzonderlijk scenario is?','De inkomensstijging uit d mag niet blijven staan in e.','Begin pas nu met de uitwerkingen, bij a en b.');
}
// 22
{
 const s=slide('Opgave 8a–b · Ei berekenen en goederen indelen','§2.2.3 · Opgave 8a–b · Boekpagina 62');
 line(s,'Ei = %ΔQv / %ΔY',209,C.blue,43);
 table(s,[['Goed','Invullen en uitkomst','Categorie'],['Maaltijdpakketten','+8% / +5% = +1,6','Luxegoed: Ei > 1'],['Budgetnoedels','−3% / +5% = −0,6','Inferieur goed: Ei < 0']],60,325,1480,303,[470,560,450],32);
 text(s,'Maaltijdpakketten: Qv groeit procentueel sterker dan Y.\nBudgetnoedels: Qv daalt bij meer inkomen.',60,686,1480,133,37,{bold:true,color:C.green});
 notes(s,'62','Werk eerst beide verhoudingen uit en koppel dan aan de categorie. Maaltijdpakketten: +8 gedeeld door +5 is +1,6; budgetnoedels: −3 gedeeld door +5 is −0,6. Controleer met de richtingen in de bron. Ei is dimensieloos. De indeling geldt in deze meting; inferieur zegt niets over kwaliteit.','Past elk teken bij de vraagreactie uit de bron?','Schrijf −0,6 en niet +0,6. Het minteken bepaalt hier de categorie.','Ga naar vraag c: daar verandert een prijs van een ander goed.');
}
// 23
{
 const s=slide('Opgave 8c · Thee ten opzichte van koffie','§2.2.3 · Opgave 8c · Boekpagina 62');
 table(s,[['Teller: vraaggoed X','Noemer: prijsgoed Z'],['Vraag naar thee: +4%','Prijs van koffie: +10%']],60,228,1480,190,[740,740],36);
 line(s,'Ek = %ΔQ thee / %ΔP koffie',477,C.ink,43);
 line(s,'Ek = +4% / +10% = +0,4',582,C.green,49);
 text(s,'Substituten: duurdere koffie → meer vraag naar thee.',60,729,1480,92,40,{bold:true,color:C.blue});
 notes(s,'62','Noem de gehele verhouding in woorden. Thee is het vraaggoed, koffie het prijsgoed. Beide veranderingen zijn positief, dus Ek is positief. Thee is hier een alternatief voor koffie. Controleer dat de noemer niet de theeprijs is. De conclusie betreft deze situatie.','Welk goed staat in de teller, welk goed in de noemer?','Ek gaat niet over de koffiehoeveelheid, want die staat niet in deze teller.','Gebruik dezelfde koffieprijs voor de vraag naar koffiefilters.');
}
// 24
{
 const s=slide('Opgave 8c · Koffiefilters ten opzichte van koffie','§2.2.3 · Opgave 8c · Boekpagina 62');
 table(s,[['Teller: vraaggoed X','Noemer: prijsgoed Z'],['Vraag naar koffiefilters: −6%','Prijs van koffie: +10%']],60,228,1480,190,[740,740],36);
 line(s,'Ek = %ΔQ koffiefilters / %ΔP koffie',477,C.ink,43);
 line(s,'Ek = −6% / +10% = −0,6',582,C.orange,49);
 text(s,'Complementen: duurdere koffie → minder vraag naar filters.',60,729,1480,92,39,{bold:true,color:C.blue});
 notes(s,'62','Dezelfde prijsnoemer geeft met een negatieve teller een negatieve Ek. Filters en koffie worden samen gebruikt. Noem koffie expliciet als prijsgoed en koffiefilters als vraaggoed. Dit getal −0,6 is gelijk aan de Ei van budgetnoedels, maar de economische betekenis verschilt doordat de noemer anders is.','Waarom betekent −0,6 hier complementen en bij budgetnoedels inferieur?','Een gelijk getal bij twee elasticiteitssoorten betekent niet dezelfde economische conclusie.','Begin met de functie uit de fitnessbron.');
}
// 25
{
 const s=slide('Opgave 8d · Fitness in de beginsituatie','§2.2.3 · Opgave 8d · Boekpagina 62');
 line(s,'Qx = 100 − 2Px + 0,5Pz + 0,01Y',218,C.blue,45);
 text(s,'Px = 10 · Pz = 20 · Y = 30.000',60,336,1480,65,36,{bold:true});
 line(s,'Qx oud = 100 − 2 × 10 + 0,5 × 20 + 0,01 × 30.000',461,C.ink,39);
 line(s,'= 100 − 20 + 10 + 300',583,C.ink,43);
 line(s,'= 390 abonnementen per maand',709,C.green,47);
 notes(s,'62','Voer eerst alle vermenigvuldigingen uit en neem de tekens mee. 100 − 20 + 10 + 300 = 390. Dit is de eigen beginhoeveelheid van fitnessdienst X. Controleer de eenheid abonnementen per maand; het ingevulde Y is jaarinkomen in euro.','Waarom begint deze berekening niet bij 400?','De hoeveelheid uit het uitlegvoorbeeld is geen gegeven voor dit nieuwe model.','Verander alleen Y naar 33.000.');
}
// 26
{
 const s=slide('Opgave 8d · Alleen Y stijgt naar 33.000','§2.2.3 · Opgave 8d · Boekpagina 62');
 text(s,'Px = 10 en Pz = 20 blijven gelijk.',60,224,1480,83,43,{bold:true,color:C.blue});
 line(s,'Qx nieuw = 100 − 2 × 10 + 0,5 × 20 + 0,01 × 33.000',371,C.ink,39);
 line(s,'= 100 − 20 + 10 + 330',486);
 line(s,'= 420 abonnementen per maand',603,C.green,48);
 text(s,'Qx stijgt met 420 − 390 = 30 abonnementen per maand.',60,756,1480,70,37,{bold:true});
 notes(s,'62','Het inkomen verhoogt alleen de term 0,01Y, van 300 naar 330. Bij vaste prijzen groeit de hoeveelheid daarom met 30 abonnementen per maand tot 420. Benoem dat de absolute verandering door de hogere Y ontstaat binnen dit model en bij gelijkblijvende andere factoren.','Welk onderdeel van de functie verklaart de 30 extra abonnementen?','30 is een aantal abonnementen per maand; het is nog geen 30 procent.','Gebruik 390 en 420 voor de procentuele reactie en Ei.');
}
// 27
{
 const s=slide('Opgave 8d · Procenten, Ei en betekenis','§2.2.3 · Opgave 8d · Boekpagina 62');
 line(s,'%ΔQx = (420 − 390) / 390 × 100% = 7,692307…%',224,C.ink,40);
 line(s,'%ΔY = (33.000 − 30.000) / 30.000 × 100% = +10%',353,C.ink,39);
 line(s,'Ei = 7,692307…% / 10% ≈ +0,77',487,C.green,46);
 text(s,'0 < Ei < 1 → normaal goed in deze situatie.\nQx stijgt procentueel minder sterk dan Y.',60,647,1480,137,40,{bold:true,color:C.blue});
 notes(s,'62','Bewaar de tussenuitkomst op de rekenmachine. Exact is de procentuele groei 100/13 procent en Ei 10/13, ongeveer 0,76923077. Rond pas het eindantwoord af op +0,77. De bronprijzen Px = 10 en Pz = 20 blijven gelijk. Controleer: positieve reactie, maar minder dan de inkomensgroei van 10%; dus normaal volgens dit boek.','Waarom is +0,77 aannemelijk als de vraag ongeveer 7,69% en het inkomen 10% stijgt?','De functiecoëfficiënt 0,01 is geen Ei. Deel ook niet 30 abonnementen door 3.000 euro als elasticiteit.','Zet Y terug voordat je vraag e oplost.');
}
// 28
{
 const s=slide('Opgave 8e · Y terug, alleen Pz omhoog','§2.2.3 · Opgave 8e · Boekpagina 62');
 table(s,[['Scenario','Px','Pz','Y','Qx per maand'],['Begin','10','20','30.000','390'],['Alleen hoger Y (d)','10','20','33.000','420'],['Y terug; hoger Pz (e)','10','24','30.000','392']],60,210,1480,294,[610,150,150,240,330],30);
 line(s,'Qx = 100 − 2 × 10 + 0,5 × 24 + 0,01 × 30.000',553,C.ink,39);
 line(s,'= 100 − 20 + 12 + 300 = 392 abonnementen per maand',651,C.green,38);
 text(s,'Pz ↑ → Qx ↑ (390 → 392). Px = 10 en Y = 30.000 blijven gelijk.',60,769,1480,57,34,{bold:true,color:C.blue});
 notes(s,'62','Begin opnieuw met Y = 30.000. Alleen Pz wordt 24; Px blijft 10. De prijsbijdrage 0,5Pz neemt toe van 10 naar 12. Daarom groeit Qx van 390 naar 392 abonnementen per maand. Een duurdere concurrerende sportdienst Z gaat in dit model samen met meer vraag naar fitnessdienst X: een positief verband. Controleer dat de extra 30 uit d niet is meegenomen.','Waarom hoort 392 bij de vergelijking met 390 en niet met 420?','Met Y = 33.000 kom je op 422. Dat is een ander scenario met twee wijzigingen, geen antwoord op e.','Laat leerlingen de ontbrekende stappen in hun werk aanvullen.');
}
// 29
{
 const s=slide('Controle van je antwoord op opgave 8');
 const rows=[['a–b · Inkomen','Ei mét teken, categorie en betekenis in deze situatie.'],['c · Andere prijs','Beide Ek’s, beide goederen en beide relaties.'],['d · Hoger Y','Oud/nieuw Qx, procenten, Ei; Px en Pz gelijk.'],['e · Hoger Pz','Y teruggezet; nieuwe Qx, richting en vaste variabelen.']];
 rows.forEach((r,i)=>{let y=220+i*138;text(s,r[0],60,y,410,92,36,{bold:true,color:C.blue});text(s,r[1],510,y,1030,105,37);if(i<3)rule(s,60,y+109,1480);});
 text(s,'Verbeter één ontbrekende berekening of uitleg in je schrift.',60,780,1480,58,34,{bold:true,color:C.green});
 notes(s,'62','Geef ruimte om eigen werk na te kijken. Kerncontrole: 1,6 luxe; −0,6 inferieur; thee/koffie +0,4 substituten; filters/koffie −0,6 complementen; functie 390 naar 420, Ei ongeveer 0,77 normaal; na reset 392. Vraag specifiek naar oude noemers, eenheden en de vaste variabelen. De volledige oefenroute omvat ook basisopgaven 3–5.','Welke stap heb je nu toegevoegd of verbeterd?','Een juist eindgetal vervangt niet de gevraagde redenering of benoeming van beide goederen.','Keer terug naar het overzicht en noteer het huiswerk.');
}
// 30
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'slide-manifest.json'),JSON.stringify({slides,overviewSlides:overviews,nativeTableSlides:tables,sourceManifest},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'2.2.3 Inkomenselasticiteit en kruislingse elasticiteit – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:[],verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,overviews,tables:tables.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
