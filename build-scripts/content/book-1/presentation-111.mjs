import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

// HOW TO ADAPT: read the new paragraph, answers and teacher guide; verify printed
// complete-book pages; replace the edition-qualified manifest, goals, examples
// and target content. Keep overview() as the single source for its three uses.
// Current Book 1 second edition; the adjacent manifest records the source authority.
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('111');
const authorManifest=JSON.parse(await fs.readFile(new URL('./presentation-111.tweede-editie-2026.manifest.json',import.meta.url),'utf8'));
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', title='Schaarste, keuzes en alternatieve kosten';
const source=`https://github.com/meijer1973/4veco-lessen/blob/${authorManifest.lessonCommit}/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/edities/tweede-editie-2026/`;
const tables=[],slides=[],overviews=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,50),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 1, tweede editie 2026, gedrukte boekpagina ${page}. ${source}boek/Boek_1_Compleet_Tweede_editie.pdf\nAntwoordmodel: ${source}bronnen/H1/Antwoorden.md\n${authored?'Uitlegvoorbeeld — niet uit het boek. De context en gegevens op deze dia zijn eigen auteurswerk. De boekpagina onderbouwt alleen de begrippen en methode.':''}`);
}
function slide(heading,{example=false,target=false,small=false}={}){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,heading,60,42,1480,86,small?41:52,{bold:true});rule(s,60,146,1480);
 if(example)text(s,'Uitlegvoorbeeld — niet uit het boek',60,167,1480,42,28,{color:C.muted});
 text(s,`§1.1.1 ${title}${target?' · Opgave 7 · Boekpagina 11':''}`,60,848,1420,30,21,{color:C.muted});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});slides.push({number:p.slides.items.length,title:heading});return s;
}
function table(s,values,x,y,w,h,widths,size=33){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const a=t.getCell(r,c);a.fill=r===0?C.ink:(r%2?C.paper:C.pale);a.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}
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
 const s=slide(`Deze les: §1.1.1 ${title}`,{small:true});overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,108,1450,40,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+(i+1)});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Beperking aanwijzen, uitkomsten\nvergelijken, alternatieve kosten\nuitleggen en kiezen bij een doel.',972,244,565,122,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 9 · Opgaven 1 en 2\n2: verkennen, theorie p. 6–8',972,459,565,95,30,{bold:active===2,name:'overview-start'});rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§1.1.1\nBasis: 3 en 4\nZelfstandig: 5 en 6\nDoelopgave: 7\nMaken en nakijken',972,654,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'6–11',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start 1–2: p. 9; basis 3: p. 9, basis 4: p. 10; zelfstandig 5–6: p. 10; doel 7: p. 11. Huiswerk is opgaven 3, 4, 5, 6 en 7 maken en nakijken. Bonus 8 en herhaling 9 zijn aanvullend. De volledige route is niet als één lesuur getimed.\n\nStart 1 haalt vermenigvuldigen, aftrekken en eenheden op. Neem beheersing niet automatisch aan. Start 2 is een eerste verkenning van schaarste en het opgegeven alternatief. Laat leerlingen de definities op p. 6–7 en de stappen op p. 8 gebruiken. Laat hen de passende uitleg aanwijzen en twijfel noteren. Het is geen toets van al beheerste economische begrippen.\n\nBij de tweede overzichtsdia: laat leerlingen opgave 2 na de instructie opnieuw beantwoorden. Vraag naar het beperkte middel, de onverenigbaarheid en de opgegeven activiteit. Geef zo nodig steun vóór opgave 3. Controleer ook of start 1 met de eenheden klopt. Laat basiswerk niet weg om de les sneller af te ronden.`,active===2?'Welke uitleg op p. 6–8 helpt je bij het gratis schoolplein?':active===7?'Heb je opgaven 3 tot en met 7 maken en nakijken genoteerd?':'Hoe verbeter je jouw eerste antwoord op opgave 2 met de uitleg van zojuist?','De docenteninformatie gebruikt lokale hoofdstukpagina’s. Hier staan de gecontroleerde gedrukte pagina’s van het complete boek.',active===2?'Na de start volgen de lesdoelen en de uitleg.':active===4?'Na het hernemen van opgave 2 beginnen leerlingen bij 3–4. Bespreek daarna het gemaakte doelwerk.':'Rond af. De volgende paragraaf vergelijkt uitkomsten met verhoudingen en percentages.');
}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 [['Beperking','Je wijst het schaarse middel en haalbare opties aan.'],['Vergelijking','Je vergelijkt totalen voor dezelfde tijd of ruimte.'],['Alternatieve kosten','Je benoemt de waarde van het beste opgegeven alternatief.'],['Doel','Je onderbouwt een keuze met een passend criterium.']].forEach((a,i)=>{const y=196+i*153;text(s,a[0],60,y,550,65,40,{bold:true,color:C.blue});text(s,a[1],680,y,850,105,36);if(i<3)rule(s,60,y+123,1480);});
 notes(s,'6–8','Deze doelen vormen samen de aanpak voor doelopgave 7. Dit is de eerste economische paragraaf: er is geen voorafgaande economieparagraaf die de begrippen al behandelt. De rekenstappen worden ook voorgedaan.','Welke beslissing vraagt meer dan alleen het hoogste bedrag zoeken?','Cijfers bepalen niet welk doel iemand moet kiezen.','Begin met behoeften en de beschikbare middelen.');
}
{
 const s=slide('Schaarste vraagt om een keuze');
 text(s,'Middelen zijn beperkt ten opzichte van de behoeften.',60,199,1480,96,45,{bold:true,color:C.blue});
 table(s,[['Behoeften','Middelen','Gevolg'],['Wat wil je bereiken?','Wat kun je inzetten?','Wat kan samen?'],['Bijvoorbeeld contact\nof ontspanning','Bijvoorbeeld tijd,\ngeld of ruimte','Niet alles kan tegelijk.\nJe moet kiezen.']],60,349,1480,330,[490,490,500],35);
 text(s,'Ook veel beschikbare ruimte kan op één moment schaars zijn.',60,736,1480,83,36,{bold:true});
 notes(s,'6','Een behoefte is iets waaraan je wilt voldoen. Een middel gebruik je daarvoor. Schaarste is relatief: middelen zijn beperkt ten opzichte van wat mensen ermee willen. Een school kan veel lokalen hebben terwijl één lokaal op hetzelfde moment voor twee lessen gewenst is. Het lokaal is dan schaars.','Kan een school met veel lokalen toch schaarse ruimte hebben?','Schaarste is niet hetzelfde als zeldzaamheid, een tijdelijk tekort of een hoge prijs.','Bekijk hoe een beperkt middel concrete opties uitsluit.');
}
{
 const s=slide('Eén atelier, twee uur',{example:true});
 text(s,'Een buurtvereniging heeft één gratis atelier voor twee uur.',60,244,1480,65,38,{bold:true});
 text(s,'Elke workshop gebruikt het hele atelier gedurende beide uren.',60,320,1480,62,36);
 table(s,[['Plan','Bedrag over per uur','Deelnemers'],['Papieratelier','€ 25','24'],['Textielatelier','€ 40','16']],60,423,1480,260,[530,510,440],34);
 text(s,'Beide zijn haalbaar. Alle uitgaven zijn al verrekend.',60,717,1480,56,34);
 text(s,'Een houtatelier kan niet: de begeleider is afwezig.',60,780,1480,50,31,{color:C.orange,bold:true});
 notes(s,'6–8','Eigen uitlegvoorbeeld. Hetzelfde atelier en hetzelfde tijdvak kunnen maar één workshop dragen. Papier en textiel zijn elk afzonderlijk uitvoerbaar. Hout is niet haalbaar: het benodigde personeel ontbreekt. Een onhaalbaar plan kan geen opgegeven haalbaar alternatief zijn. De bedragen zijn wat overblijft na uitgaven; trek die niet opnieuw af.','Welk middel is hier schaars en welke opties zijn werkelijk haalbaar?','Een mooi plan zonder beschikbare begeleider telt niet als haalbaar alternatief. Gratis huur maakt ruimte niet onbeperkt.','Het eerste doel is zoveel mogelijk geld voor de vereniging overhouden.',true);
}
{
 const s=slide('Totale bedragen voor dezelfde twee uur',{example:true});
 text(s,'Doel: zoveel mogelijk geld voor de vereniging overhouden',60,237,1480,87,38,{bold:true,color:C.blue});
 table(s,[['Plan','Berekening','Totaal voor twee uur'],['Papieratelier','2 uur × € 25 per uur','€ 50'],['Textielatelier','2 uur × € 40 per uur','€ 80']],60,378,1480,280,[460,620,400],34);
 text(s,'Keuze: textielatelier, want € 80 > € 50',60,728,1480,80,44,{bold:true,color:C.green});
 notes(s,'7–8','Eigen voorbeeld. Lees eerst de kolommen: het bedrag is per uur, maar het atelier is twee uur beschikbaar. Vermenigvuldig elke rij met diezelfde twee uur. De uitkomst is euro voor het hele tijdvak. De uren vallen als eenheid weg. Vergelijk pas daarna de totalen. De keuze volgt het expliciete gelddoel.','Waarom moeten we bij beide plannen met twee vermenigvuldigen?','€ 40 per uur en € 50 voor twee uur zijn geen vergelijkbare grootheden.','Wat vervalt door de keuze voor textiel?',true);
}
{
 const s=slide('Alternatieve kosten: het opgegeven alternatief',{example:true,small:true});
 text(s,'De waarde van het beste haalbare alternatief dat je opgeeft.',60,243,1480,118,43,{bold:true,color:C.blue});
 table(s,[['Gekozen','Beste opgegeven alternatief'],['Textielatelier\n€ 80 voor twee uur','Papieratelier\n€ 50 voor twee uur']],60,428,1480,226,[740,740],38);
 text(s,'Alternatieve kosten: € 50 uit het papieratelier',60,730,1480,80,43,{bold:true,color:C.orange});
 notes(s,'7–8','Eigen voorbeeld. Door textiel te kiezen vervalt papier. Hout was niet haalbaar en telt niet mee. Zonder textiel zou papier het beste haalbare alternatief zijn. De waarde daarvan is 50 euro voor hetzelfde tijdvak. Noem steeds de activiteit én de waarde.','Wat zou de vereniging anders met die twee uur in het atelier kunnen doen?','Alternatieve kosten zijn niet de opbrengst van het gekozen plan.','Vergelijk de alternatieve kosten met een betaling en met het verschil.',true);
}
{
 const s=slide('Betaling, gemist bedrag en verschil',{example:true});
 table(s,[['Welke vraag?','Antwoord in het atelier'],['Wat betaalt de vereniging aan huur?','€ 0'],['Wat levert het beste gemiste plan op?','€ 50 uit het papieratelier'],['Hoeveel meer levert de keuze op?','€ 80 − € 50 = € 30']],60,267,1480,423,[815,665],34);
 text(s,'Gratis gebruik kan een waardevol alternatief uitsluiten.',60,754,1480,64,40,{bold:true,color:C.orange});
 notes(s,'7–8','Eigen voorbeeld. Benoem drie verschillende vragen. De huurbetaling is nul. Toch loopt de vereniging de 50 euro uit papier mis. Zij betaalt die 50 euro aan niemand. Het verschil van 30 euro beschrijft hoeveel meer textiel opbrengt. Dat verschil is niet de waarde van het opgegeven plan.','Welke rij geeft de alternatieve kosten en waarom?','De woorden kosten en gratis verleiden tot alleen kijken naar een rekening.','Verander nu alleen het doel, terwijl alle gegevens gelijk blijven.',true);
}
{
 const s=slide('Het doel verandert de vergelijking',{example:true});
 table(s,[['Doel','Passende vergelijking','Keuze'],['Meeste geld overhouden','€ 80 tegenover € 50','Textielatelier'],['Meeste deelnemers bereiken','24 tegenover 16 deelnemers','Papieratelier']],60,286,1480,310,[575,525,380],34);
 text(s,'Bij deelname gaat de andere haalbare workshop verloren.',60,679,1480,65,38,{bold:true,color:C.blue});
 text(s,'De waarde van een alternatief hoeft geen geldbedrag te zijn.',60,771,1480,56,34);
 notes(s,'7–8','Eigen voorbeeld. Houd de twee uur en beide workshops gelijk. Voor het gelddoel vergelijk je euro’s. Voor deelname vergelijk je aantallen deelnemers en kies je papier. Dan vervalt textiel voor 16 deelnemers. Dat beschrijft het gemiste alternatief bij dit criterium, niet een verzonnen geldprijs voor deelname. De geldopbrengst alleen bepaalt geen universeel beste keuze.','Welke gegevens uit de tabel zijn relevant voor het nieuwe doel?','Tel deelnemers niet bij euro’s op en geef plezier of deelname geen ongevraagde geldwaarde.','Bekijk hoe je bij meer dan één gemiste optie het beste alternatief selecteert.',true);
}
{
 const s=slide('Het beste van meerdere haalbare alternatieven',{example:true,small:true});
 text(s,'Nieuwe situatie: Lina kiest twee uur wandelen.',60,238,1480,67,39,{bold:true});
 text(s,'Elke klus vraagt precies diezelfde twee uur. Combineren kan niet.',60,313,1480,60,34);
 table(s,[['Andere mogelijkheid','Inkomsten voor twee uur','Haalbaar?'],['Oppasklus','€ 22','Ja'],['Archiefklus','€ 18','Ja'],['Theaterklus','€ 30','Nee, al ingevuld']],60,414,1480,310,[540,540,400],32);
 text(s,'Zij geeft € 22 aan mogelijke inkomsten op.',60,771,1480,61,41,{bold:true,color:C.orange});
 notes(s,'7','Eigen tweede uitlegvoorbeeld, afzonderlijk van het atelier. Lina heeft al gekozen voor wandelen. Bij de vergelijking van gemiste inkomsten is oppassen met 22 euro het beste haalbare alternatief. De archiefklus geeft minder. Zonder wandelen zou Lina ook maar één klus kunnen doen: tel 22 en 18 dus niet op. Theater is niet beschikbaar. Er is geen eurobedrag voor het plezier van wandelen gegeven.','Waarom is het antwoord niet € 30 en ook niet € 40?','Het beste haalbare alternatief is één optie. Sommeer geen onderling onverenigbare gemiste opties.','Hernemen van startopgave 2; daarna de basisopgaven.',true);
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 7 · Eén aula, twee plannen',{target:true});
 text(s,'Een school organiseert een activiteit voor een goed doel.',60,198,1480,90,41,{bold:true});
 text(s,'De aula is vrijdag drie uur beschikbaar. De school kiest een muziekmiddag óf een ruilmarkt.',60,328,1480,127,38);
 text(s,'Elk plan gebruikt de aula de volledige drie uur. De school kan beide plannen uitvoeren, maar niet tegelijk.',60,514,1480,135,38);
 text(s,'Het doel is zoveel mogelijk geld voor het goede doel overhouden.',60,715,1480,105,40,{bold:true,color:C.blue});
 notes(s,'11','Dit is de oorspronkelijke context van opgave 7 uit de actuele tweede editie. Bespreek pas na de eigen poging van leerlingen. Toon eerst alle context, gegevens en vragen. Deze dia heeft nog geen antwoord.','Welke voorwaarden moet je bij de vergelijking vasthouden?','Verwissel deze aula niet met het uitlegvoorbeeld: drie uur in plaats van twee.','Toon de oorspronkelijke tabel en financiële voorwaarden.');
}
{
 const s=slide('Opgave 7 · Gegevens',{target:true});
 text(s,'In de bedragen zijn alle uitgaven voor de activiteit al verrekend. De aula is gratis.',60,199,1480,139,38,{bold:true});
 table(s,[['Plan','Bedrag over per uur','Verwacht aantal deelnemers'],['Muziekmiddag','€ 70','90'],['Ruilmarkt','€ 90','60']],60,397,1480,294,[500,470,510],33);
 text(s,'Beide plannen gebruiken de aula de volledige drie uur.',60,758,1480,65,36);
 notes(s,'11','Behoud de drie oorspronkelijke tabelkolommen. Deelnemers zijn verwachte aantallen per activiteit, geen aantallen per uur. De bedragen zijn per uur, na alle uitgaven. Er is geen grafiek in deze doelopgave.','Wat betekent per uur in de geldkolom?','Vermenigvuldig deelnemers niet automatisch met drie.','Toon a, b en c zonder uitwerking.');
}
{
 const s=slide('Opgave 7 · Vragen a, b en c',{target:true});
 const qs=[['a','Welk middel is schaars? Leg uit waarom de school moet kiezen.'],['b','Bereken voor beide plannen hoeveel geld overblijft. Welk plan past bij het genoemde doel?'],['c','Wat zijn de alternatieve kosten van de keuze uit b? Benoem de gemiste activiteit en het bedrag.']];
 qs.forEach((a,i)=>{const y=202+i*211;text(s,a[0]+')',60,y,75,68,42,{bold:true,color:C.blue});text(s,a[1],155,y,1380,155,40);if(i<2)rule(s,60,y+176,1480);});
 notes(s,'11','De volledige deelvragen a–c zijn overgenomen zonder antwoorden. Laat leerlingen hun eigen werk erbij houden. Antwoorden volgen nadat ook d–e zichtbaar zijn geweest.','Bij welke vraag moet je zowel een activiteit als een bedrag noemen?','Een eindbedrag alleen beantwoordt c niet volledig.','Toon eerst ook de laatste twee vragen.');
}
{
 const s=slide('Opgave 7 · Vragen d en e',{target:true});
 text(s,'d)',60,212,75,68,42,{bold:true,color:C.blue});text(s,'Een leerling zegt: “De aula is gratis, dus deze keuze heeft geen alternatieve kosten.” Leg uit waarom dit niet klopt.',155,212,1380,220,40);
 rule(s,60,470,1480);
 text(s,'e)',60,528,75,68,42,{bold:true,color:C.blue});text(s,'Het doel verandert in “zoveel mogelijk leerlingen laten deelnemen”. Welk plan kies je dan? Gebruik een gegeven uit de tabel.',155,528,1380,231,40);
 notes(s,'11','Nu zijn alle vijf deelvragen en de volledige context/tabel beschikbaar zonder oplossingen. Laat leerlingen zich eerst oriënteren op de gevraagde redeneringen.','Wat verandert in e en wat blijft hetzelfde?','Een nieuwe doelstelling is niet hetzelfde als een verandering van alle gegevens.','Begin nu pas met het bespreken van de antwoorden, bij a.');
}
{
 const s=slide('Opgave 7a · De schaarse aula',{target:true});
 table(s,[['Beperkt middel','Waarom is kiezen nodig?'],['De aula op vrijdag,\ngedurende drie uur','Elk plan vraagt het hele tijdvak.\nBeide tegelijk kan niet.']],60,243,1480,307,[640,840],39);
 text(s,'Elk plan is afzonderlijk haalbaar.',60,622,1480,68,41,{bold:true,color:C.blue});
 text(s,'De ruimte kan niet aan beide wensen tegelijk voldoen.',60,744,1480,76,39);
 notes(s,'11','Volledig antwoord a: de aula gedurende dezelfde drie uur is schaars. Muziek en ruilmarkt zijn afzonderlijk mogelijk, maar sluiten elkaar in dat tijdvak uit. Het gaat om beschikbare ruimte én tijd ten opzichte van de wensen.','Waarom moet het tijdvak in je antwoord terugkomen?','Alleen geld is schaars is hier geen antwoord. De huurprijs is niet de beperking.','Bereken de totale bedragen bij het gelddoel.');
}
{
 const s=slide('Opgave 7b · Beide totalen en de keuze',{target:true});
 text(s,'Totaal = aantal uren × bedrag over per uur',60,199,1480,91,43,{bold:true,color:C.blue});
 table(s,[['Plan','Berekening','Over voor het goede doel'],['Muziekmiddag','3 uur × € 70 per uur','€ 210'],['Ruilmarkt','3 uur × € 90 per uur','€ 270']],60,356,1480,296,[435,570,475],33);
 text(s,'Kies de ruilmarkt: € 270 > € 210 voor dezelfde drie uur.',60,723,1480,108,43,{bold:true,color:C.green});
 notes(s,'11','Opzet, invullen en uitkomst: beide uurtarieven vermenigvuldigen met drie. Muziek geeft 210 euro en ruilmarkt 270 euro over voor het goede doel. Alle uitgaven waren al verrekend. Bij het expliciete doel past de ruilmarkt omdat 270 het hoogste totaal is.','Waarom vergelijken we hier 210 en 270 in plaats van 90 en 60?','90 en 60 deelnemers horen bij een andere vergelijking. Kosten niet opnieuw aftrekken.','Benoem nu wat de gekozen ruilmarkt uitsluit.');
}
{
 const s=slide('Opgave 7c · Wat geeft de school op?',{target:true});
 text(s,'Door de ruilmarkt vervalt de muziekmiddag.',60,204,1480,112,45,{bold:true,color:C.blue});
 text(s,'Alternatieve kosten',60,362,1480,64,38,{bold:true});
 text(s,'€ 210 uit de gemiste muziekmiddag',60,448,1480,110,57,{bold:true,color:C.orange});
 rule(s,60,614,1480);
 text(s,'€ 270 − € 210 = € 60 extra geld door de ruilmarkt',60,672,1480,93,38);
 text(s,'Het verschil beschrijft hoeveel meer de gekozen optie oplevert.',60,777,1480,54,32);
 notes(s,'11','De school geeft de haalbare muziekmiddag op. Die zou voor dezelfde drie uur 210 euro opleveren. Dat is de waarde van het beste opgegeven alternatief. De 60 euro is het voordeel van de ruilmarkt boven muziek. Controle: noem activiteit, bedrag en tijdvak.','Welke vraag beantwoordt € 60 wél?','€ 60 is het verschil; € 270 hoort bij het gekozen plan. Geen van beide is de alternatieve kost van de ruilmarkt.','Beoordeel daarmee de uitspraak over gratis gebruik.');
}
{
 const s=slide('Opgave 7d · Gratis ruimte heeft een alternatief',{target:true,small:true});
 table(s,[['Huurbetaling','Gemiste mogelijkheid'],['€ 0','Muziekmiddag met € 210\nvoor het goede doel']],60,262,1480,270,[560,920],42);
 text(s,'De aula is gratis, maar dezelfde ruimte kan ook muziek huisvesten.',60,625,1480,122,42,{bold:true,color:C.blue});
 text(s,'Die mogelijke € 210 vervalt door de ruilmarkt.',60,774,1480,62,38);
 notes(s,'11','De uitspraak klopt niet. Gratis gaat over de betaalde huurprijs. De keuze voor de ruilmarkt sluit de muziekmiddag uit, die 210 euro kon opleveren. Er zijn dus alternatieve kosten hoewel er geen huurbetaling is.','Aan wie betaalt de school deze € 210?','Aan niemand: het gaat om gemiste mogelijke inkomsten, geen rekening of tweede uitgave.','Verander tot slot alleen het doel.');
}
{
 const s=slide('Opgave 7e · Zoveel mogelijk deelnemers',{target:true});
 text(s,'Nieuw doel: zoveel mogelijk leerlingen laten deelnemen',60,204,1480,117,42,{bold:true,color:C.blue});
 table(s,[['Plan','Verwacht aantal deelnemers'],['Muziekmiddag','90'],['Ruilmarkt','60']],60,389,1480,266,[740,740],39);
 text(s,'Kies de muziekmiddag: 90 > 60 deelnemers.',60,731,1480,102,45,{bold:true,color:C.green});
 notes(s,'11','Het nieuwe doel vergelijkt deelnemers in plaats van geld. Muziek heeft 90 verwachte deelnemers tegen 60 voor de ruilmarkt. Daarom past muziek nu beter. De beschikbare drie uur en de haalbaarheid blijven gelijk. De gegevens zijn verwachtingen; beloof geen werkelijk bezoekersaantal.','Waarom kan de keuze veranderen terwijl de tabel hetzelfde blijft?','Vermenigvuldig het verwachte aantal deelnemers niet met drie. Het is al het aantal voor de gehele activiteit.','Laat leerlingen hun eigen antwoorden controleren en verbeteren.');
}
{
 const s=slide('Controle van je antwoord op opgave 7');
 [['Beperking','Aula én hetzelfde tijdvak; plannen kunnen niet samen.'],['Berekening','3 × € 70 = € 210 en 3 × € 90 = € 270.'],['Alternatief','Muziekmiddag en € 210 bij de keuze voor de ruilmarkt.'],['Verklaring','Gratis huur sluit een gemiste mogelijkheid niet uit.'],['Doel','Geld: ruilmarkt. Deelname: muziek, 90 tegenover 60.']].forEach((a,i)=>{const y=196+i*116;text(s,a[0],60,y,420,60,37,{bold:true,color:C.blue});text(s,a[1],510,y,1025,92,35);});
 text(s,'Verbeter een ontbrekende stap of uitleg in je eigen werk.',60,788,1480,54,32,{bold:true});
 notes(s,'11','Controleer alle deelvragen. Een volledige redenering verbindt beperking, vergelijking en doel. Laat leerlingen een eigen tekortkoming verbeteren. De tabelwaarden en het antwoordmodel zijn in de actuele editie gecontroleerd.','Welke verbetering maakt jouw antwoord vollediger?','Een juist getal zonder de gevraagde activiteit, eenheid of verklaring kan onvolledig zijn.','Laat het laatste overzicht staan voor huiswerk en afsluiting.');
}
overview('Afsluiting / huiswerk',7);
await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,overviewSlides:overviews,tables,source:authorManifest},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,`1.1.1 ${title} – presentatie.pptx`),pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...Array.from(new Set(tables)).flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:Array.from(new Set(tables)),requiredNativeChartOwnerSlides:[],verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:p.slides.items.length,overviewSlides:overviews,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
