// HOW TO ADAPT: read the paragraph's manuscript, answers and teacher route first.
// Update the adjacent source/assignment manifest, author distinct teaching examples,
// and retain the shared overview and complete question-before-answer sequence.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const sourceManifest=JSON.parse(await fs.readFile(new URL('./presentation-223.manifest.json',import.meta.url),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('223');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', TITLE='Inkomenselasticiteit en kruislingse elasticiteit';
const BASE=`https://github.com/meijer1973/4veco-lessen/blob/${sourceManifest.sourceCommit}/${sourceManifest.sourceEdition.split('/').map(encodeURIComponent).join('/')}/`;
const tables=[],slides=[],overviews=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,{example=false,target=false,overview=false}={}){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,overview?27:42,1480,overview?105:86,overview?43:50,{bold:true,name:'title'});
 rule(s,60,overview?182:146,1480);
 text(s,example?'Uitlegvoorbeeld — niet uit het boek':target?'§2.2.3 · Opgave 8 · Boekpagina 62':`§2.2.3 ${TITLE}`,60,848,1390,31,21,{color:C.muted,name:'footer'});
 text(s,String(p.slides.items.length),1480,846,60,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title,kind:overview?'overview':example?'authored-example':target?'target':'instruction'});return s;
}
function notes(s,page,explanation,question,misconception,transition,{example=false}={}){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${misconception}\n\nOvergang: ${transition}\n\nBron: Boek 2, editie chat-2026, revisie 21 september 2026; gedrukte pagina ${page}. ${BASE}boek/Boek_2_Compleet.pdf\nAntwoordmodel: ${BASE}bronnen/H2/${encodeURIComponent('2.2 Elasticiteit – antwoorden.md')}\n${example?'Uitlegvoorbeeld — niet uit het boek. De context en getallen zijn fictief en speciaal voor deze presentatie geschreven. De genoemde boekpagina onderbouwt de methode, niet deze voorbeeldgegevens.':''}`);
}
function table(s,values,x,y,w,h,widths,size=33){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:r%2?C.paper:C.pale;
  cell.text.style={typeface:FONT,fontSize:size,color:r===0?C.paper:C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:17,right:15,top:10,bottom:10}};
 }}tables.push(p.slides.items.length);return t;
}
function lines(s,items,{start=235,gap=155,labelWidth=400,size=38}={}){
 items.forEach(([label,content],i)=>{const y=start+i*gap;text(s,label,60,y,labelWidth,105,size,{bold:true,color:[C.blue,C.green,C.orange][i%3]});text(s,content,100+labelWidth,y,1440-labelWidth,112,size);});
}
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
 const s=slide(`Deze les: §2.2.3\n${TITLE}`,{overview:true});overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,139,1480,40,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,205,835,44,35,{bold:true});
 const ys=[263,354,407,462,639,717,780],hs=[83,45,45,174,75,52,52];
 route.forEach((r,i)=>{let color=active===i+1?C.blue:C.ink;text(s,`${i+1}.`,60,ys[i],48,hs[i],30,{bold:true,color,name:`route-number-${i+1}`});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:`route-${i+1}`});});
 text(s,'Lesdoelen',972,205,568,44,35,{bold:true});
 text(s,'Ei en Ek berekenen en duiden.\nGoederen en relaties indelen.\nEén factor in een functie wijzigen.',972,263,568,124,30,{name:'overview-goals'});
 rule(s,972,394,568);
 text(s,'Startopdracht',972,418,568,44,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 59\nOpgaven 1 en 2',972,470,568,92,33,{bold:active===2,name:'overview-start'});
 rule(s,972,577,568);
 text(s,'Huiswerk',972,601,568,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§2.2.3 · Opgaven 3 t/m 8\nBasis: 3, 4 en 5\nZelfstandig: 6 en 7\nDoelopgave: 8\nMaken en nakijken',972,660,568,184,30,{bold:active===7,name:'overview-homework'});
 notes(s,'59–62',`Laat het overzicht staan tijdens ${phase.toLowerCase()}. Start 1–2: pagina 59; basis 3: pagina 59 en 4–5: pagina 60; zelfstandig 6–7: pagina 61; doel 8: pagina 62. Huiswerk is 3 t/m 8 maken en nakijken. Bonus 9 en herhaling 10–11 zijn extra. De volledige route kan aanvullende lestijd vragen; dit is geen gemeten planning voor één les. Geef bij opgave 2 zo nodig kort steun: Ei gaat over inkomen en Ek over de prijs van een ander goed. Startantwoorden voor eventuele feedback nadat leerlingen zelf gewerkt hebben: 1a +10%, 1b 300 kaarten per week, 2a procentuele vraagreactie gedeeld door respectievelijk procentuele inkomensreactie of prijsreactie van een ander goed; 2b Px en Pz gelijk.`,phase==='Startopdracht'?'Welke rekenstap moet je ophalen?':'Welke opgave of stap wil je verbeteren?','Gebruik de gedrukte boekpagina: pagina 59 is fysieke PDF-pagina 61.',active===7?'Laat leerlingen het huiswerk in hun agenda zetten.':'Ga door naar de volgende lesfase wanneer de klas daaraan toe is.');
}

overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 lines(s,[['Inkomen','Ei berekenen en het goed indelen.'],['Een andere prijs','Ek berekenen, beide goederen noemen\nen hun relatie uitleggen.'],['Een vraagfunctie','Steeds één factor veranderen en verklaren\nwat met de gevraagde hoeveelheid gebeurt.']],{gap:180,labelWidth:430});
 notes(s,'52','De doelen bereiden opgave 8 voor. Voorkennis: procentuele veranderingen en invullen in een functie. Ei, Ek en de afzonderlijke functiescenario’s worden hier expliciet uitgelegd.','Welke grootheid hoort onder de breuk als je inkomen onderzoekt?','Een negatieve elasticiteit heeft niet bij elke noemer dezelfde economische betekenis.','Vergelijk eerst de oorzaken achter de drie elasticiteiten.');
}
{
 const s=slide('De noemer bepaalt wat je onderzoekt');
 table(s,[['Wat verandert?','Elasticiteit','Verhouding'],['Eigen prijs P','Ev','%ΔQv / %ΔP'],['Inkomen Y','Ei','%ΔQv / %ΔY'],['Prijs van ander goed Z','Ek','%ΔQv van X / %ΔP van Z']],60,221,1480,417,[620,280,580],35);
 text(s,'Boven: de vraagreactie. Onder: de onderzochte oorzaak.',60,691,1480,80,41,{bold:true,color:C.blue});
 notes(s,'52','Ev haalt voorkennis uit §2.2.1 op. Bij Ei en Ek blijft de eigen prijs gelijk. Andere vraagfactoren blijven steeds gelijk: ceteris paribus. Noem bij Ek het vraaggoed en het prijsgoed.','Als de prijs van een ander goed verandert, gebruik je dan Ev of Ek?','De prijs van X en de prijs van Z zijn verschillende grootheden.','Bereken eerst Ei met een afzonderlijke fictieve meting.');
}
{
 const s=slide('Inkomenselasticiteit berekenen',{example:true});
 text(s,'Fictieve meting: inkomen +8%; andere vraagfactoren gelijk',60,188,1480,80,35,{bold:true,color:C.blue});
 text(s,'Ei = %ΔQv / %ΔY',60,290,1480,74,49,{bold:true});
 table(s,[['Vraag naar','%ΔQv','Berekening Ei'],['Theaterkaarten','+12%','+12% / +8% = +1,5'],['Tijdschriften','+2%','+2% / +8% = +0,25'],['Budgetmaaltijden','−4%','−4% / +8% = −0,5']],60,408,1480,318,[650,270,560],35);
 text(s,'Behoud het teken; een elasticiteit heeft geen eenheid.',60,773,1480,56,35,{bold:true,color:C.orange});
 notes(s,'53','De drie gegevens zijn verzonnen meetuitkomsten voor dezelfde inkomensstijging. Reken de verhoudingen voor. +1,5 betekent dat de vraag procentueel anderhalf keer zo sterk stijgt als het inkomen. −0,5 betekent hier een dalende vraag bij stijgend inkomen.','Welk getal vertelt dat de vraag daalt bij meer inkomen?','Schrijf bij Ei geen euro of procent achter het eindgetal. Het is een verhouding van procentuele veranderingen.','Deel de drie uitkomsten in volgens de boekindeling.',{example:true});
}
{
 const s=slide('Goederen indelen volgens dit boek');
 table(s,[['Ei','Categorie','Bij een hoger inkomen'],['Ei < 0','Inferieur goed','Qv daalt.'],['0 < Ei < 1','Normaal goed','Qv stijgt procentueel minder sterk dan Y.'],['Ei > 1','Luxegoed','Qv stijgt procentueel sterker dan Y.']],60,216,1480,426,[280,420,780],34);
 text(s,'Ei = 0 en Ei = 1 zijn grenswaarden zonder categorielabel.',60,698,1480,62,36,{bold:true,color:C.orange});
 text(s,'De indeling geldt voor de onderzochte groep en situatie.',60,779,1480,52,34);
 notes(s,'53','Koppel terug naar de fictieve voorbeelden: theaterkaarten +1,5 luxe; tijdschriften +0,25 normaal; budgetmaaltijden −0,5 inferieur. Bij 0 verandert Qv niet; bij 1 verandert Qv procentueel even sterk als Y. Volg precies de drie categorieën van deze editie.','Waarom zegt inferieur niets over de kwaliteit van een product?','In bredere terminologie kan normaal ook alle positieve Ei omvatten. Hier geldt de expliciete boekindeling; luxe is geen uitspraak over het prijskaartje.','Onderzoek nu de prijs van een ander goed.');
}
{
 const s=slide('Kruislingse elasticiteit: twee goederen');
 text(s,'Ek = %ΔQv van goed X / %ΔP van goed Z',60,213,1480,95,47,{bold:true,color:C.blue});
 table(s,[['Teken','Relatie','Prijs Z en vraag X'],['Ek > 0','Substituten','Dezelfde richting'],['Ek < 0','Complementen','Tegengestelde richting']],60,381,1480,291,[300,560,620],36);
 text(s,'Noem altijd het vraaggoed X én het prijsgoed Z.',60,742,1480,75,40,{bold:true});
 notes(s,'54','Substituten kunnen elkaar vervangen, complementen worden samen gebruikt. Ek meet de vraag naar X ten opzichte van de prijs van Z. Houd de prijs van X, inkomen en overige vraagfactoren gelijk. Bij Ek = 0 is er in deze meting geen vraagreactie.','Welke twee goederen moet je bij de verhouding noemen?','Een positieve prijsverandering geeft niet vanzelf een positieve Ek: het teken van de teller telt ook mee.','Bekijk een prijsdaling met twee verschillende vraagreacties.');
}
{
 const s=slide('Een prijsdaling: het teken blijft betekenisvol',{example:true});
 text(s,'Twee afzonderlijke metingen: huurautoprijs daalt 8%',60,188,1480,76,37,{bold:true,color:C.blue});
 table(s,[['Vraaggoed X','%ΔQv van X','Ek t.o.v. huurautoprijs'],['Taxiritten','−4%','−4% / −8% = +0,5'],['Bijpassende kinderzitjes','+12%','+12% / −8% = −1,5']],60,323,1480,297,[620,300,560],34);
 text(s,'Taxi en huurauto: substituten',60,679,1480,60,40,{bold:true,color:C.green});
 text(s,'Kinderzitje en huurauto: complementen',60,765,1480,62,40,{bold:true,color:C.orange});
 notes(s,'54','Dit zijn twee fictieve afzonderlijke onderzoeken bij gelijkblijvende andere vraagfactoren. Taxiritten dalen als huurauto’s goedkoper worden: twee negatieve percentages geven een positieve verhouding. Bijpassende kinderzitjes worden juist meer gevraagd. In beide breuken is huurauto het prijsgoed.','Waarom blijft de relatie taxi–huurauto substitutie als beide veranderingen negatief zijn?','Verwijder mintekens niet voordat je deelt. Ek beschrijft een relatie tussen goederen, geen inkomenscategorie.','Pas de methode toe op een vraagfunctie met meerdere factoren.',{example:true});
}
{
 const s=slide('Een vraagfunctie: TaalClub X',{example:true});
 text(s,'Qx = 160 − 4Px + 2Pz + 0,02Y',60,192,1480,80,48,{bold:true,color:C.blue});
 table(s,[['Symbool','Betekenis en eenheid','Beginwaarde'],['Qx','Gevraagde abonnementen per maand','Te berekenen'],['Px','Maandprijs TaalClub X in euro','15'],['Pz','Maandprijs concurrerende taaldienst Z in euro','25'],['Y','Gemiddeld jaarinkomen in euro','15.000']],60,322,1480,438,[220,930,330],33);
 notes(s,'55','Eigen fictieve context en functie. Lees elke variabele met haar eenheid. De coëfficiënten horen bij deze eenheden: Y is jaarinkomen en Qx is maandelijkse vraag. De coefficient 0,02 is geen Ei.','Waarom deel je het jaarinkomen niet eerst door twaalf?','Een coëfficiënt is een verandering in aantallen per euro; een elasticiteit is een verhouding van procentuele veranderingen.','Vul eerst alle beginwaarden in.',{example:true});
}
{
 const s=slide('De beginhoeveelheid berekenen',{example:true});
 text(s,'TaalClub X · Px = 15; Pz = 25; Y = 15.000',60,191,1480,65,36,{bold:true});
 lines(s,[['Invullen','Qx = 160 − 4 × 15 + 2 × 25 + 0,02 × 15.000'],['Vermenigvuldigen','Qx = 160 − 60 + 50 + 300'],['Optellen','Qx = 450 abonnementen per maand']],{start:323,gap:158,labelWidth:410,size:38});
 notes(s,'55','Laat elke factor in de juiste term invullen. Vermenigvuldig vóór optellen en aftrekken. −60 hoort bij de eigen prijs, +50 bij de prijs van Z en +300 bij het inkomen. De beginhoeveelheid 450 is straks de percentagebasis.','Welke waarde wordt straks de oude hoeveelheid?','Verwar de constante 160 niet met Qx in de beginsituatie: alle termen tellen mee.','Verander alleen het inkomen.',{example:true});
}
{
 const s=slide('Alleen het inkomen verandert',{example:true});
 text(s,'Y: € 15.000 → € 18.000 per jaar',60,195,1480,72,45,{bold:true,color:C.blue});
 text(s,'Px blijft € 15; Pz blijft € 25 per maand.',60,290,1480,68,38);
 text(s,'Qx nieuw = 160 − 4 × 15 + 2 × 25 + 0,02 × 18.000',60,426,1480,82,39,{bold:true});
 text(s,'= 160 − 60 + 50 + 360 = 510',60,551,1480,76,44);
 text(s,'De vraag stijgt van 450 naar 510 abonnementen per maand.',60,708,1480,106,41,{bold:true,color:C.green});
 notes(s,'56, 58','Alleen de inkomensterm verandert van 300 in 360. Daardoor stijgt Qx met 60 abonnementen per maand. Omdat de prijzen gelijk blijven, beschrijft de functie hier uitsluitend het inkomensscenario.','Welk onderdeel van de berekening verandert?','De absolute stijging van 60 is niet de procentuele stijging.','Bereken met de oude waarden de percentages en Ei.',{example:true});
}
{
 const s=slide('Van de nieuwe hoeveelheid naar Ei',{example:true});
 text(s,'% verandering = (nieuw − oud) / oud × 100%',60,194,1480,80,42,{bold:true,color:C.blue});
 lines(s,[['Hoeveelheid','%ΔQx = (510 − 450) / 450 × 100%\n= +13,333333…%'],['Inkomen','%ΔY = (18.000 − 15.000) / 15.000 × 100%\n= +20%'],['Elasticiteit','Ei = 13,333333…% / 20% ≈ +0,67']],{start:321,gap:158,labelWidth:355,size:36});
 text(s,'0 < Ei < 1: TaalClub X is hier een normaal goed.',60,792,1480,46,34,{bold:true,color:C.green});
 notes(s,'53, 56, 58','Reken tussendoor ongerond: Ei is exact 2/3. De vraag groeit procentueel minder sterk dan het inkomen. Het oude inkomen is 15.000 en de oude hoeveelheid 450. Prijzen blijven gelijk.','Waarom staat 450 en niet 510 onder de eerste breuk?','Ei is niet 60/3.000 en ook niet 0,02. Eerst beide veranderingen procentueel maken.','Ga terug naar de beginsituatie voor een ander onderzoek.',{example:true});
}
{
 const s=slide('Terug naar het begin; alleen Pz verandert',{example:true});
 table(s,[['Afzonderlijk scenario','Px (€)','Pz (€)','Y (€ per jaar)','Qx per maand'],['Begin','15','25','15.000','450'],['Alleen hoger Y','15','25','18.000','510'],['Y terug; alleen hogere Pz','15','30','15.000','460']],60,207,1480,367,[565,170,170,295,280],30);
 text(s,'Qx = 160 − 4 × 15 + 2 × 30 + 0,02 × 15.000 = 460',60,630,1480,78,39,{bold:true});
 text(s,'Pz stijgt → Qx stijgt; Px en Y blijven gelijk.',60,752,1480,72,40,{bold:true,color:C.orange});
 notes(s,'56, 58','Zet Y terug op 15.000 en verhoog alleen Pz naar 30. Vergelijk 460 met de beginhoeveelheid 450. De term 2Pz stijgt van 50 naar 60. Hogere prijs van de concurrent gaat samen met meer vraag naar TaalClub X, passend bij substitutie. De prijzen in de tabel zijn maandprijzen.','Met welke rij vergelijk je het laatste scenario?','Met Y = 18.000 zou je twee veranderingen meenemen. Dan reken je een ander scenario uit.','Bespreek waarom afzonderlijke procentuele metingen geen gecombineerd effect bewijzen.',{example:true});
}
{
 const s=slide('Twee veranderingen tegelijk');
 table(s,[['Afzonderlijk onderzoek','Verwachte vraagreactie X'],['Een substituut Z wordt duurder','Qx stijgt.'],['Een complement W wordt duurder','Qx daalt.']],60,235,1480,323,[900,580],36);
 text(s,'De richtingen werken elkaar tegen.',60,626,1480,74,44,{bold:true,color:C.blue});
 text(s,'Voor het totale effect is een passend gezamenlijk model nodig.',60,748,1480,80,38);
 notes(s,'52, 56, 60','Dit is algemene aanpaksteun voor twee afzonderlijke onderzoeken. Elke meting houdt de andere factor gelijk. Als beide factoren tegelijk veranderen, mag je afzonderlijk gemeten percentages zonder extra model of aanname niet als bewezen totaal optellen. In een expliciet gegeven lineaire functie kun je wel de beschreven gezamenlijke waarden invullen, maar dat is een ander scenario dan een één-factor-onderzoek.','Kun je met alleen twee richtingen zeggen hoe groot het totale effect is?','Dat twee effecten tegengesteld zijn, bewijst niet dat ze precies even groot zijn.','Controleer het terugzetten met het TaalClub-voorbeeld.');
}
for(const reveal of [false,true]){
 const s=slide(reveal?'Korte controle · Terugzetten':'Korte controle',{example:true});
 text(s,'Je onderzoekt bij TaalClub alleen Pz: € 25 → € 30.',60,202,1480,76,40,{bold:true});
 text(s,'“Ik gebruik Y = 18.000, want dat was de vorige uitkomst.”',60,337,1480,130,48,{bold:true,color:C.blue});
 text(s,reveal?'Zet Y terug op 15.000.\nVergelijk Qx = 460 met Qx = 450.':'Klopt deze aanpak?\nWelke waarden moeten gelijk blijven?',60,546,1480,154,44,{bold:true,color:reveal?C.green:C.ink});
 if(reveal)text(s,'Px blijft 15; Y blijft 15.000.',60,752,1480,65,38);
 notes(s,'56',reveal?'De uitspraak is onjuist. 18.000 was een gewijzigd inkomen in een afzonderlijk onderzoek, geen nieuwe basis voor dit onderzoek. Zet Y terug op 15.000 en houd Px op 15.':'Laat leerlingen kort zelf nadenken. De antwoorddia volgt. Dit is een begripscontrole bij het eigen uitlegvoorbeeld, geen extra huiswerk.', 'Vanuit welke basis start het onderzoek naar Pz?','De laatste berekende situatie wordt niet automatisch de beginsituatie.',reveal?'Laat het overzicht staan tijdens de oefenroute.':'Toon het herstel van de aanpak.',{example:true});
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 8 · Inkomen, koffie en fitness',{target:true});
 text(s,'Gebruik steeds de oude waarde als noemer.',60,188,1480,68,39,{bold:true});
 text(s,'Ei = %ΔQv / %ΔY',60,291,1480,72,44,{bold:true,color:C.blue});
 table(s,[['Ei < 0','0 < Ei < 1','Ei > 1'],['Inferieur goed','Normaal goed','Luxegoed']],60,390,1480,155,[495,495,490],35);
 text(s,'Ei = 0 en Ei = 1 zijn grenswaarden.',60,577,1480,55,35);
 text(s,'Ek = %ΔQv van goed X / %ΔP van een ander goed Z',60,663,1480,92,40,{bold:true,color:C.green});
 text(s,'Noem bij Ek altijd beide goederen.',60,781,1480,49,34);
 notes(s,'62','Dit zijn de rekenafspraken en categorieën uit de volledige context van opgave 8. Bespreek de doelopgave pas nadat leerlingen die zelf geprobeerd hebben. Eerst volgen alle bronnen en deelvragen a tot en met e, zonder oplossingen.','Welke afspraak voorkomt een verkeerde percentagebasis?','Deze dia herhaalt alleen de gegeven context; er staan nog geen berekende antwoorden.','Toon bron inkomen en deelvragen a en b.');
}
{
 const s=slide('Opgave 8 · Bron inkomen en vragen a–b',{target:true});
 text(s,'Het gemiddelde inkomen stijgt 5%.',60,196,1480,74,42,{bold:true,color:C.blue});
 table(s,[['Vraag naar','Verandering'],['Maaltijdpakketten','Stijgt 8%'],['Budgetnoedels','Daalt 3%']],60,310,1480,244,[950,530],37);
 text(s,'a) Bereken met bron inkomen Ei voor maaltijdpakketten en budgetnoedels. (3 punten)',60,620,1480,97,36);
 text(s,'b) Classificeer beide goederen met de drie categorieën uit de context. (2 punten)',60,752,1480,85,36);
 notes(s,'62','Volledige bron inkomen en beide oorspronkelijke deelvragen. Leerlingen houden hun eigen uitwerking erbij. Geef nog geen oplossingen voordat alle vragen getoond zijn.','Welke twee verhoudingen vraagt a?','Vraag b vraagt om een categorie bij elk goed, niet alleen een teken.','Toon de koffiebron en vraag c.');
}
{
 const s=slide('Opgave 8 · Bron koffie en vraag c',{target:true});
 text(s,'De koffieprijs stijgt 10%.',60,194,1480,74,43,{bold:true,color:C.blue});
 table(s,[['Vraag naar','Verandering'],['Thee','Stijgt 4%'],['Koffiefilters','Daalt 6%']],60,307,1480,247,[950,530],37);
 text(s,'c) Bereken met bron koffie Ek voor de vraag naar thee ten opzichte van de koffieprijs\nen voor de vraag naar koffiefilters ten opzichte van de koffieprijs.\nNoem teller- en noemergoed en classificeer de relaties. (4 punten)',60,620,1480,194,36);
 notes(s,'62','Volledige koffiebron en onverkorte vraag c. Beide vraaggoederen en het prijsgoed zijn gegeven. Laat de rekenuitkomsten nog niet zien.','Welke goederen staan in de twee tellers?','De noemer is de koffieprijs, niet de theeprijs of filterprijs.','Toon de functiebron voor d en e.');
}
{
 const s=slide('Opgave 8 · Bron functie',{target:true});
 text(s,'Fitnessdienst X en concurrerende sportdienst Z',60,185,1480,71,38,{bold:true});
 text(s,'Qx = 100 − 2Px + 0,5Pz + 0,01Y',60,290,1480,82,47,{bold:true,color:C.blue});
 table(s,[['Symbool','Betekenis en eenheid','Beginsituatie'],['Qx','Gevraagde abonnementen van X per maand','Te berekenen'],['Px','Maandprijs fitnessdienst X in euro','10'],['Pz','Maandprijs concurrerende sportdienst Z in euro','20'],['Y','Gemiddeld jaarinkomen in euro','30.000']],60,410,1480,376,[215,955,310],31);
 notes(s,'62','Alle gegevens, symbolen, eenheden en beginwaarden uit bron functie staan hier. In de opgave is Y jaarinkomen; laat die eenheid intact.','Welke drie beginwaarden horen in de functie?','De maandelijkse vraag maakt het jaarinkomen niet tot een maandinkomen.','Toon eerst beide functievragen voordat de bespreking van antwoorden start.');
}
{
 const s=slide('Opgave 8 · Vragen d en e',{target:true});
 text(s,'d) Bereken Qx in de beginsituatie en nadat alleen Y stijgt naar 33.000. Bereken daarna %ΔQx, Ei en classificeer fitnessdienst X. Leg uit wat met Qx gebeurt en welke variabelen gelijk blijven. (4 punten)',60,214,1480,218,38);
 rule(s,60,477,1480);
 text(s,'e) Zet Y terug op 30.000. Bereken Qx nadat alleen Pz stijgt van 20 naar 24. Leg uit welke richting het verband tussen Pz en Qx heeft en welke variabelen gelijk blijven.\n(3 punten)',60,541,1480,217,38);
 notes(s,'62','De volledige vragen d en e sluiten het vragenblok af. Alle context en deelvragen zijn nu beschikbaar zonder oplossingen. Voor d is de inkomensverandering als percentage nodig om Ei uit te rekenen; e vertrekt opnieuw van het begin.','Waar staat in de opgave dat je een eerdere verandering moet terugzetten?','Alleen eindgetallen noemen beantwoordt de gevraagde richting en vaste variabelen niet.','Begin nu de stapsgewijze antwoorden bij a en b.');
}
{
 const s=slide('Opgave 8a–b · Inkomen en categorie',{target:true});
 text(s,'Ei = %ΔQv / %ΔY',60,189,1480,70,43,{bold:true,color:C.blue});
 table(s,[['Goed','Berekening','Categorie'],['Maaltijdpakketten','+8% / +5% = +1,6','Luxegoed: Ei > 1'],['Budgetnoedels','−3% / +5% = −0,6','Inferieur goed: Ei < 0']],60,325,1480,272,[525,505,450],34);
 text(s,'Maaltijdpakketten: Qv groeit procentueel sterker dan Y.',60,666,1480,72,39,{bold:true,color:C.green});
 text(s,'Budgetnoedels: Qv daalt bij een hoger inkomen.',60,768,1480,61,39,{bold:true,color:C.orange});
 notes(s,'62','a: behoud het minteken bij budgetnoedels. b: verbind de uitkomst aan de categorie en de economische betekenis. Het label geldt in deze meting, niet voor elk huishouden in elke situatie. Controle: 1,6 × 5% = 8% en −0,6 × 5% = −3%.','Welke grens gebruik je om maaltijdpakketten in te delen?','Inferieur is geen oordeel over kwaliteit; luxe is geen oordeel over de hoogte van de prijs.','Bereken nu beide kruislingse elasticiteiten.');
}
{
 const s=slide('Opgave 8c · Twee relaties met koffie',{target:true});
 table(s,[['Vraaggoed (teller)','Prijsgoed (noemer)','Berekening Ek','Relatie'],['Thee','Koffie','+4% / +10% = +0,4','Substituten'],['Koffiefilters','Koffie','−6% / +10% = −0,6','Complementen']],60,218,1480,314,[395,380,425,280],32);
 text(s,'Koffie duurder → meer vraag naar het alternatief thee.',60,608,1480,87,41,{bold:true,color:C.green});
 text(s,'Koffie duurder → minder vraag naar bijbehorende filters.',60,741,1480,88,41,{bold:true,color:C.orange});
 notes(s,'62','Spreek beide verhoudingen volledig uit. De noemer betreft in beide gevallen de koffieprijs; de teller gaat eerst over thee, daarna over koffiefilters. De tekens passen bij vervangende en samen gebruikte goederen. Controleer 0,4 × 10% = 4% en −0,6 × 10% = −6%.','Waarom is koffie in beide berekeningen het noemergoed?','Een negatieve Ek betekent complementen, geen inferieur goed.','Bereken eerst de twee hoeveelheden van d.');
}
{
 const s=slide('Opgave 8d · Oude en nieuwe hoeveelheid',{target:true});
 text(s,'Begin: Px = 10; Pz = 20; Y = 30.000',60,190,1480,70,39,{bold:true,color:C.blue});
 text(s,'Qx oud = 100 − 2 × 10 + 0,5 × 20 + 0,01 × 30.000\n= 100 − 20 + 10 + 300 = 390',60,290,1480,139,39);
 rule(s,60,466,1480);
 text(s,'Alleen Y wordt 33.000; Px en Pz blijven gelijk.',60,503,1480,67,38,{bold:true,color:C.green});
 text(s,'Qx nieuw = 100 − 2 × 10 + 0,5 × 20 + 0,01 × 33.000\n= 100 − 20 + 10 + 330 = 420',60,602,1480,132,39);
 text(s,'Qx stijgt met 30 abonnementen per maand.',60,774,1480,59,36,{bold:true});
 notes(s,'62','Vul alle gegevens in vóór het rekenen. De inkomensterm stijgt van 300 naar 330, de andere termen blijven gelijk. De uitkomsten hebben de eenheid abonnementen per maand. Controleer het verschil: 0,01 × 3.000 = 30.','Welke term verklaart de volledige stijging van Qx?','30 abonnementen is een absolute verandering, geen percentage.','Bereken percentages en Ei uit deze twee hoeveelheden.');
}
{
 const s=slide('Opgave 8d · Percentages en Ei',{target:true});
 lines(s,[['Hoeveelheid','%ΔQx = (420 − 390) / 390 × 100%\n= +7,692307…%'],['Inkomen','%ΔY = (33.000 − 30.000) / 30.000 × 100%\n= +10%'],['Elasticiteit','Ei = 7,692307…% / 10% ≈ +0,77']],{start:205,gap:166,labelWidth:355,size:38});
 text(s,'0 < Ei < 1: fitnessdienst X is hier een normaal goed.',60,738,1480,62,40,{bold:true,color:C.green});
 notes(s,'62','Gebruik de oude waarden 390 en 30.000. Reken tussendoor ongerond: Ei = 10/13, ongeveer 0,77. De vraag stijgt procentueel minder sterk dan het inkomen. Px = 10 en Pz = 20 blijven gelijk. Ei heeft geen eenheid.','Welke uitkomst bewijst dat de vraag minder sterk groeit dan het inkomen?','Delen door 420 geeft een ander percentage en voldoet niet aan de gegeven afspraak.','Zet het inkomen terug voordat je e uitrekent.');
}
{
 const s=slide('Opgave 8e · Inkomen terugzetten',{target:true});
 text(s,'Y terug naar 30.000; alleen Pz: 20 → 24',60,188,1480,81,42,{bold:true,color:C.orange});
 text(s,'Qx = 100 − 2 × 10 + 0,5 × 24 + 0,01 × 30.000\n= 100 − 20 + 12 + 300 = 392',60,317,1480,145,41);
 table(s,[['Vergelijking','Qx (abonnementen per maand)'],['Beginsituatie: Pz = 20','390'],['Alleen Pz = 24; Y terug op 30.000','392']],60,515,1480,223,[850,630],33);
 text(s,'Positief verband: Pz ↑, Qx ↑. Px = 10 en Y = 30.000 blijven gelijk.',60,770,1480,66,35,{bold:true,color:C.green});
 notes(s,'62','Je vergelijkt 392 met 390, niet met 420. Alleen de term 0,5Pz verandert: 10 wordt 12. De hogere prijs van sportdienst Z hangt in dit model samen met twee extra abonnementen van X per maand, passend bij substitutie. De gevraagde conclusie is de richting en de vaste variabelen; een Ek-berekening is hier niet gevraagd.','Waarom gebruik je 390 als basis voor je vergelijking?','Wie Y = 33.000 laat staan, krijgt 422 en beantwoordt een ander scenario.','Laat leerlingen hun eigen antwoorden op ontbrekende stappen controleren.');
}
{
 const s=slide('Antwoordcontrole bij opgave 8',{target:true});
 lines(s,[['a–b','Verhouding met teken én categorie.'],['c','Vraaggoed en prijsgoed genoemd;\nsubstituten of complementen verklaard.'],['d','Oud en nieuw Qx, beide percentages, Ei,\ncategorie en gelijkblijvende prijzen.'],['e','Y teruggezet; Qx vergeleken met het begin;\nrichting en vaste variabelen genoemd.']],{start:206,gap:139,labelWidth:210,size:36});
 text(s,'Verbeter één ontbrekende berekening of verklaring.',60,797,1480,43,33,{bold:true,color:C.blue});
 notes(s,'62','Laat leerlingen hun eigen uitwerking verbeteren. Volledige uitkomsten: a +1,6 en −0,6; b luxe en inferieur; c +0,4 en −0,6 met thee/koffie substituten en filters/koffie complementen; d 390 naar 420, 7,692307…%, inkomen 10%, Ei circa 0,77 normaal; e 392 en positief verband. In d blijven Px 10 en Pz 20 gelijk; in e Px 10 en Y 30.000.','Welke rekenstap of verklaring ontbrak nog?','Een juist getal alleen beantwoordt geen vraag die ook een classificatie, eenheid of verklaring verlangt.','Sluit af met hetzelfde lesoverzicht en het huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...sourceManifest,slides,overviewSlides:overviews,nativeTableSlides:tables,nativeChartSlides:[]},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const candidate=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),candidate]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath:path.join(FINAL,`2.2.3 ${TITLE} – presentatie.pptx`),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:[],verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({finalPath:result.finalPath,slides:slides.length,overviews,tables,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
