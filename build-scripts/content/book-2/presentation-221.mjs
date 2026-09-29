// HOW TO ADAPT: derive assignments, support and examples from the new paragraph
// and its manifest. Keep the shared overview and question-before-answer sequence.
// Runtime setup and rendering: docs/workflows/classroom-presentation.md.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const M=JSON.parse(await fs.readFile(new URL('./presentation-221.manifest.json',import.meta.url),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('221');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',tables=[],charts=[],slides=[],overviews=[];
const base=`https://github.com/meijer1973/4veco-lessen/blob/${M.sourceCommit}/${M.sourceEdition.split('/').map(encodeURIComponent).join('/')}/`;
const BOOK=base+'boek/Boek_2_Compleet.pdf';
const ANSWERS=base+'bronnen/H2/'+encodeURIComponent('2.2 Elasticiteit – antwoorden.md');
const EXAMPLE='Uitlegvoorbeeld — niet uit het boek';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,55),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer='§2.2.1 Prijselasticiteit'){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,86,52,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title});return s;
}
function notes(s,page,explanation,question,pitfall,transition,{authored=false,extra=''}={}){
 const provenance=authored?`Dit is een afzonderlijk, door de presentatiemaker bedacht uitlegvoorbeeld met eigen context en gegevens. Het komt niet uit een boekopgave. Het boek is alleen de bron voor de methode (p. ${page}).`:`Leerlingenboek, gedrukte pagina ${page}.`;
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 2, chatuitgave 2026, revisie 21 september 2026. ${provenance}\n${BOOK}\nAntwoordmodel: ${ANSWERS}\n${extra}`);
}
function table(s,values,x,y,w,h,widths,size=34){
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
function example(s,label='Keramiekcafé'){text(s,EXAMPLE,60,179,1480,48,30,{bold:true,color:C.blue});text(s,label,60,238,1480,55,39,{bold:true});}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 7.',
 'Zet je huiswerk in je agenda.'
];
const overviewData={goals:'Procenten en Ev berekenen,\nprijsgevoeligheid vergelijken\nen een verklaring beoordelen.',start:'Pagina 40 · Opgaven 1 en 2\n1: voorkennis ophalen\n2: verkennen met theorie p. 38',homework:'§2.2.1 Prijselasticiteit\nBasis: 3 en 4\nZelfstandig: 5 en 6\nDoelopgave: 7\nMaken en nakijken'};
function overview(phase,active){
 const s=slide('Deze les: §2.2.1 Prijselasticiteit');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,185,568,45,35,{bold:true});
 text(s,overviewData.goals,972,244,568,112,30,{name:'overview-goals'});rule(s,972,370,568);
 text(s,'Startopdracht',972,395,568,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,overviewData.start,972,452,568,131,30,{name:'overview-start'});rule(s,972,598,568);
 text(s,'Huiswerk',972,607,568,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,overviewData.homework,972,656,568,180,30,{name:'overview-homework'});
 notes(s,'38, 40–42',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start 1–2 staat op p. 40. Opgave 1 haalt procenten uit Boek 1 §1.1.2 op. Opgave 2 vraagt nieuwe formele kennis: Ev indelen en relatieve sterkte vergelijken. Laat leerlingen hiervoor de tabel en uitleg op p. 38 raadplegen. Dit is ondersteund verkennen, geen toets van al beheerste stof. Keer na de uitleg expliciet terug naar opgave 2 (dia 12) vóór zelfstandig werk. Basis 3 staat op p. 40, basis 4 en zelfstandig 5–6 op p. 41; doel 7 op p. 42. Huiswerk: 3, 4, 5, 6 en 7 maken en nakijken. Bonus 8 en herhaling 9–10 zijn extra. De gehele route is niet als één les van 55 minuten begroot.`,phase==='Startopdracht'?'Welke oude waarde hoort bij jouw procentberekening?':'Bij welke opgave heb je nog hulp nodig?', 'Een vraag bij Startopgaven kan nieuwe kennis vragen. Laat leerlingen hun eerste antwoord op 2 na de uitleg herzien.',phase==='Afsluiting / huiswerk'?'Noteer het huiswerk in de agenda.':'Ga verder met de volgende lesfase.',{extra:'Voorkennisbron: Boek 1 §1.1.2, Theorie / Procentuele verandering. Nieuwe begripskennis: Boek 2 p. 38. Ondersteuning en opdrachten zijn in alle drie overzichten gelijk.'});
}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const rows=[['Berekenen','Je berekent beide procenten en Ev met het juiste teken.'],['Indelen','Je vergelijkt Ev met −1 en 0.'],['Vergelijken','Je legt uit waar de relatieve prijsreactie sterker is.'],['Verklaren','Je onderscheidt een mogelijke reden van een bewezen oorzaak.']];
 rows.forEach((a,i)=>{const y=211+i*143;text(s,a[0],60,y,425,58,39,{bold:true,color:C.blue});text(s,a[1],535,y,1000,102,36);if(i<3)rule(s,60,y+116,1480);});
 notes(s,'36–39','Deze doelen bereiden alle onderdelen van Nova en StreamNow voor. De prijsgevoeligheid gaat om verhoudingen van procenten, niet om het aantal klanten dat verdwijnt. Procenten zijn eerder onderwezen, de verhouding Ev en de indeling zijn nieuw.','Wat heb je aan procenten als bedrijven verschillende aantallen klanten hebben?','Een percentage en een elasticiteit zijn verschillende soorten getallen.','Introduceer het afzonderlijke uitlegvoorbeeld.');
}
{
 const s=slide('Een hogere prijs bij het Keramiekcafé');example(s);
 table(s,[['Grootheid','Oud','Nieuw'],['P (€ per bezoek)','24','27'],['Qv (bezoeken per week)','160','148']],60,325,1480,290,[780,350,350]);
 text(s,'P is de eigen prijs. Qv is de gevraagde hoeveelheid.',60,661,1480,62,38,{bold:true});
 text(s,'Andere vraagfactoren blijven gelijk: ceteris paribus.',60,755,1480,62,36,{color:C.blue});
 notes(s,'36','Eigen voorbeeld: een Keramiekcafé verhoogt de prijs van 24 naar 27 euro per bezoek. De gevraagde hoeveelheid daalt van 160 naar 148 bezoeken per week. Benoem P en Qv en lees beide kolommen. Inkomen, voorkeuren en prijzen van alternatieven blijven in deze vergelijking gelijk. Dit is dezelfde aanname als bij een beweging langs de vraaglijn in Boek 1 §1.2.2. De prijs stijgt 3 euro; de hoeveelheid daalt 12 bezoeken. Die losse verschillen zijn nog geen maat voor relatieve gevoeligheid.','Waarom kun je 3 euro en 12 bezoeken niet rechtstreeks vergelijken?','Ceteris paribus is een modelaanname. Als tegelijk andere vraagfactoren veranderen, is niet alle waargenomen verandering aan de eigen prijs toe te schrijven.','Zet beide veranderingen om in percentages.',{authored:true});
}
{
 const s=slide('Procenten met de oude waarde als basis');example(s);
 text(s,'%Δ = (nieuw − oud) / oud × 100%',60,324,1480,72,46,{bold:true,color:C.blue});
 rule(s,60,422,1480);
 text(s,'Prijs',60,464,250,60,37,{bold:true});text(s,'(27 − 24) / 24 × 100% = +12,5%',350,461,1190,75,43);
 text(s,'Hoeveelheid',60,588,285,60,37,{bold:true});text(s,'(148 − 160) / 160 × 100% = −7,5%',350,585,1190,75,43);
 text(s,'Een stijging is positief. Een daling is negatief.',60,740,1480,64,37,{bold:true,color:C.green});
 notes(s,'37','Haal de vier stappen van Boek 1 §1.1.2 op: oud en nieuw noteren, nieuw min oud, delen door oud en vermenigvuldigen met 100%, teken duiden. Prijs: +3 / 24 = +0,125, dus +12,5%. Hoeveelheid: −12 / 160 = −0,075, dus −7,5%. Bewaar ongeronde tussenuitkomsten. Controle: 24 × 1,125 = 27 en 160 × 0,925 = 148.','Waarom staat bij Qv 160 onder de breuk?','Deel niet door de nieuwe waarde. Het minteken mag bij een daling niet verdwijnen.','Vergelijk de twee procentuele veranderingen visueel.',{authored:true});
}
{
 const s=slide('De hoeveelheid reageert procentueel minder sterk');example(s);
 const ch=s.charts.add('bar',{position:{left:60,top:323,width:1480,height:385},categories:['P','Qv'],series:[{name:'Procentuele verandering',values:[0.125,-0.075],fill:C.blue,dataLabelOverrides:[{idx:0,text:'+12,5%',position:'outEnd',textStyle:{typeface:FONT,fontSize:30,fill:C.ink,bold:true}},{idx:1,text:'−7,5%',position:'outEnd',textStyle:{typeface:FONT,fontSize:30,fill:C.ink,bold:true}}]}],barOptions:{direction:'bar',grouping:'clustered',gapWidth:95},hasLegend:false,
  xAxis:{tickLabelPosition:'low',textStyle:{typeface:FONT,fontSize:32,fill:C.ink},line:{fill:C.ink,width:1.5}},
  yAxis:{min:-0.10,max:0.15,majorUnit:0.05,numberFormatCode:'0%',textStyle:{typeface:FONT,fontSize:27,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},
  dataLabels:{showValue:true,position:'outEnd',textStyle:{typeface:FONT,fontSize:30,fill:C.ink,bold:true}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 text(s,'Prijs: +12,5%        Gevraagde hoeveelheid: −7,5%',60,753,1480,67,38,{bold:true,color:C.green});
 notes(s,'36–37','Lees eerst nul en de procentschaal. De balken staan op dezelfde schaal. P stijgt met 12,5%, Qv daalt met 7,5%. De tegengestelde richting en de kleinere relatieve hoeveelheidsreactie zijn afzonderlijke observaties. Ev vat de verhouding in één getal samen. Dit is een vergelijking van procentuele veranderingen, geen vraaglijn en geen grafiek van aantallen.','Welke balk is korter als je vanaf nul kijkt?','12 bezoeken minder is niet hetzelfde als 12% minder. De balklengte geeft het percentage vanaf de eigen oude waarde.','Deel de procentuele hoeveelheidsreactie door de procentuele prijsverandering.',{authored:true});
}
{
 const s=slide('Ev: hoeveelheidsreactie gedeeld door prijsverandering');example(s);
 text(s,'Ev = %ΔQv / %ΔP',60,323,1480,75,48,{bold:true,color:C.blue});
 text(s,'Ev = −7,5% / +12,5% = −0,6',60,445,1480,90,56,{bold:true});
 rule(s,60,570,1480);
 text(s,'De hoeveelheidsdaling is 0,6 maal de prijsstijging, in procenten.',60,623,1480,112,40,{bold:true,color:C.green});
 text(s,'Ev heeft geen eenheid en geen procentteken.',60,773,1480,55,34);
 notes(s,'37','Ev meet de procentuele reactie van Qv op een procentuele verandering van de eigen prijs. Zet Qv boven en P onder de breuk. −7,5 gedeeld door +12,5 is −0,6. De procenttekens vallen weg. Het negatieve teken geeft tegengestelde richtingen aan. In deze meting hoort gemiddeld 0,6% hoeveelheidsdaling bij 1% prijsstijging. Dat is een beschrijving van de gemeten stap, geen garantie voor de volgende prijswijziging. Positieve oude waarden zijn vereist; bij %ΔP = 0 is deze verhouding niet berekenbaar.','Wat staat in de teller en waarom?','Schrijf niet −0,6%. Draai teller en noemer niet om.','Gebruik het getal met zijn minteken om de vraag in te delen.',{authored:true});
}
{
 const s=slide('De vraag indelen met Ev');
 table(s,[['Waarde van Ev','Indeling','Reactie Qv ten opzichte van P'],['−1 < Ev < 0','Prijsinelastisch','Procentueel minder sterk'],['Ev = −1','Unitair elastisch','Procentueel even sterk'],['Ev < −1','Prijselastisch','Procentueel sterker'],['Ev = 0','Volkomen prijsinelastisch','Qv verandert niet']],60,213,1480,468,[330,480,670],32);
 text(s,'−1 < −0,6 < 0: prijsinelastisch',60,745,1480,75,45,{bold:true,color:C.green});
 notes(s,'38','Vergelijk de uitkomst rechtstreeks met −1 en 0, mét het minteken. Bij het eigen Keramiekcafé-voorbeeld is −0,6 tussen −1 en 0: de hoeveelheid reageert procentueel minder sterk dan de prijs. Bij −1 zijn de procentuele veranderingen even groot in tegengestelde richting. Ev = 0 is het grensgeval zonder hoeveelheidsreactie. Een positieve Ev past niet in deze tabel voor het hier onderzochte tegengestelde prijs-vraagverband.','Waar staat −0,6 ten opzichte van −1 en 0?','Prijsinelastisch betekent niet dat Qv helemaal niet verandert. Negatief betekent niet automatisch inelastisch.','Vergelijk twee verschillende negatieve elasticiteiten.',{extra:'De onderaan toegepaste Ev = −0,6 is van het afzonderlijke authored Keramiekcafé-voorbeeld, niet van een boekopgave.'});
}
{
 const s=slide('Prijsgevoeligheid vergelijken');example(s,'Keramiekcafé en Fotoworkshop');
 table(s,[['Aanbieder','Ev','Vergelijking','Indeling'],['Keramiekcafé','−0,6','−1 < −0,6 < 0','Prijsinelastisch'],['Fotoworkshop','−1,8','−1,8 < −1','Prijselastisch']],60,325,1480,281,[460,180,390,450],32);
 text(s,'Bij Fotoworkshop reageert Qv procentueel sterker op P.',60,658,1480,94,41,{bold:true,color:C.green});
 text(s,'Gemiddeld per 1% prijsstijging: 1,8% tegenover 0,6% daling.',60,775,1480,57,32);
 notes(s,'38–39','In een aparte prijsverhoging bij een verzonnen Fotoworkshop is Ev = −1,8 gemeten. Oud en nieuw P en Qv van die aanbieder zijn niet gegeven. Vergelijk 1,8 maal en 0,6 maal de procentuele prijsverandering. De eerste verhouding is drie keer zo groot, ondanks het kleinere getal −1,8. Dit is een vergelijking van relatieve reacties in de twee metingen. Je weet niet welke aanbieder absoluut meer bezoeken verliest.','Waarom is −1,8 hier de sterkere reactie?','De beginhoeveelheid van Fotoworkshop ontbreekt. Concludeer dus niet dat daar meer klanten verdwijnen.','Geef een mogelijke reden voor dit verschil.',{authored:true});
}
{
 const s=slide('Een mogelijke verklaring voor het verschil');example(s,'Fotoworkshop: Ev = −1,8 · Keramiekcafé: Ev = −0,6');
 text(s,'Mogelijke reden',60,333,430,65,39,{bold:true,color:C.blue});
 text(s,'Bij Fotoworkshop is een ander uitje\nmogelijk makkelijker te kiezen.',535,333,1000,142,39);
 rule(s,60,505,1480);
 text(s,'Economische redenering',60,555,440,112,36,{bold:true,color:C.green});
 text(s,'Meer uitwijkmogelijkheden kunnen de procentuele\nhoeveelheidsreactie op een hogere prijs versterken.',535,555,1000,147,38);
 text(s,'De elasticiteiten alleen bewijzen deze oorzaak niet.',60,765,1480,63,37,{bold:true,color:C.orange});
 notes(s,'38–39','Doe één volledige redenering voor: Fotoworkshop kan makkelijker vervangbaar zijn dan een bezoek aan het Keramiekcafé. Als klanten makkelijker naar een alternatief overstappen, kan een prijsstijging een sterkere daling van Qv uitlokken. De getallen geven alleen de reactie, niet het bewijs voor het motief. Ook uitstelbaarheid of budgetaandeel kan een plausibele hypothese zijn als het verband wordt uitgelegd. Gebruik woorden als mogelijk en kan.','Welk extra gegeven zou deze verklaring sterker maken?','Een plausibel verhaal is geen gemeten oorzaak. De prijs van het alternatief verandert hier niet; je berekent geen andere elasticiteitssoort.','Onderzoek nu een afzonderlijk geval met een prijsdaling.',{authored:true});
}
{
 const s=slide('Een prijsdaling in een nieuwe situatie');example(s,'BoekBox: maandabonnement');
 table(s,[['Grootheid','Oud','Nieuw'],['P (€ per abonnement per maand)','16','14'],['Qv (abonnementen per maand)','80','92']],60,313,1480,269,[780,350,350],32);
 text(s,'%ΔP = (14 − 16) / 16 × 100% = −12,5%',60,628,1480,65,40,{bold:true,color:C.blue});
 text(s,'%ΔQv = (92 − 80) / 80 × 100% = +15%',60,734,1480,65,40,{bold:true,color:C.green});
 notes(s,'37–38','Dit is een nieuw, afzonderlijk authored scenario met andere gegevens, geen omkering van het vorige voorbeeld. BoekBox verlaagt de maandprijs van 16 naar 14 euro per abonnement. Qv gaat van 80 naar 92 abonnementen per maand. Andere vraagfactoren blijven gelijk. Kies opnieuw de eigen oude waarden: 16 en 80. Controle: 16 × 0,875 = 14; 80 × 1,15 = 92.','Welk teken krijgt nu de noemer van Ev?','Een stijgende Qv betekent nog niet dat Ev positief is. Je moet ook het teken van de prijsverandering meenemen.','Bereken nu de verhouding en duid het teken.',{authored:true});
}
{
 const s=slide('Een negatieve Ev bij een stijgende hoeveelheid');example(s,'BoekBox');
 text(s,'Ev = +15% / −12,5% = −1,2',60,329,1480,88,54,{bold:true,color:C.blue});
 text(s,'−1,2 < −1: prijselastische vraag',60,461,1480,72,45,{bold:true,color:C.green});
 text(s,'De hoeveelheid stijgt procentueel 1,2 maal zo sterk\nals de prijs daalt.',60,601,1480,132,43);
 text(s,'Waarom blijft Ev negatief?',60,774,1480,55,35,{bold:true});
 notes(s,'37–38','Positief gedeeld door negatief is negatief. Ev = −1,2 betekent hier dat Qv procentueel 1,2 keer zo sterk toeneemt als P afneemt. De vraag is prijselastisch. Laat leerlingen het minteken mondeling verklaren, voordat zij met hun startantwoord terugkijken.','Waarom blijft Ev negatief terwijl Qv stijgt?','Negatief zegt dat de veranderingen tegengesteld zijn. Het zegt niet dat de gevraagde hoeveelheid moet dalen.','Keer nu terug naar de verkende begripscheck.',{authored:true});
}
{
 const s=slide('Terug naar startopgave 2','§2.2.1 Prijselasticiteit · Startopgave 2 · Boekpagina 40');
 text(s,'2a',60,211,130,70,46,{bold:true,color:C.blue});
 text(s,'Ev = −0,4: welke indeling past?\nLeg de relatieve reactie uit.',240,211,1290,133,42);
 rule(s,60,388,1480);
 text(s,'2b',60,440,130,70,46,{bold:true,color:C.blue});
 text(s,'Een leerling noemt de reactie bij Ev = −2 zwakker\ndan bij Ev = −0,4. Hoe verbeter je die uitspraak?',240,440,1290,153,42);
 text(s,'Herzie je eerste antwoord met de uitleg van deze les.',60,738,1480,78,38,{bold:true,color:C.green});
 notes(s,'38, 40','Dit is feedback op de eerder met het boek verkende startopgave, na het afzonderlijke uitlegvoorbeeld. Laat eerst leerlingen antwoorden, eventueel met de indeling op p. 38. 2a: −1 < −0,4 < 0, dus prijsinelastisch. 2b: bij −2 reageert Qv procentueel sterker dan bij −0,4, namelijk 2 maal tegenover 0,4 maal de procentuele prijsverandering. Verbind het teken aan de richting en de verhouding aan de sterkte. Laat iedereen zijn eerste antwoord aanpassen vóór zelfstandig werk.','Wat kun je nu preciezer zeggen dan bij de start?','Een eerste verkennend antwoord bewijst geen beheersing. Geef zo nodig extra steun bij de begeleide opgaven.','Laat de oefenroute staan. Begin bij basis 3 en 4.');
}
overview('Oefenen',4);
{
 const s=slide('Opgave 7: Bioscoop Nova en StreamNow','§2.2.1 Prijselasticiteit · Doeloefening · Boekpagina 42');
 text(s,'Bioscoop Nova verhoogt de ticketprijs van € 10 naar € 12.\nDe gevraagde hoeveelheid daalt van 500 naar 420 tickets per week.',60,197,1480,124,39);
 table(s,[['Bioscoop Nova','Oud','Nieuw'],['P (€ per ticket)','10','12'],['Qv (tickets per week)','500','420']],60,366,1480,262,[780,350,350],33);
 text(s,'Bij StreamNow is voor een andere prijsverhoging Ev = −2 gemeten.',60,666,1480,76,35);
 text(s,'Gebruik voor Nova de oude waarde als noemer en Ev = %ΔQv / %ΔP.',60,765,1480,65,34,{bold:true,color:C.blue});
 notes(s,'42','Lees de volledige context van de echte doeloefening. Nova en StreamNow zijn verschillende metingen. Alle data uit de context staan hier, plus dezelfde gegevens in een bewerkbare tabel. StreamNow heeft alleen een gegeven Ev. Toon nu eerst alle vier deelvragen op de volgende twee dia’s; geef nog geen uitwerking.','Welke gegevens horen bij Nova en welke bij StreamNow?','Gebruik Ev = −2 van StreamNow niet in de berekening voor Nova.','Toon deelvragen a en b.');
}
{
 const s=slide('Opgave 7: deelvragen a en b','§2.2.1 Prijselasticiteit · Doeloefening · Boekpagina 42');
 text(s,'a',60,206,120,70,46,{bold:true,color:C.blue});
 text(s,'Bereken voor Bioscoop Nova de procentuele prijsverandering,\nde procentuele verandering van de gevraagde hoeveelheid en Ev.\n(3 punten)',230,206,1300,205,40);
 rule(s,60,467,1480);
 text(s,'b',60,518,120,70,46,{bold:true,color:C.blue});
 text(s,'Classificeer de vraag naar bioscoopkaartjes en leg in gewone taal\nuit wat Ev = −0,8 betekent.\n(2 punten)',230,518,1300,202,40);
 notes(s,'42','Dit zijn de volledige deelvragen a en b uit het boek, zonder toegevoegde oplossingen. Het getal −0,8 staat al in de originele tekst van b. Laat leerlingen hun eigen uitwerking erbij pakken. Bewaar de beantwoording tot ook c en d getoond zijn.','Welke berekeningen vraagt a en welke uitleg vraagt b?','De gegeven Ev in b vervangt niet de gevraagde berekening in a.','Toon ook c en d voordat de antwoorden komen.');
}
{
 const s=slide('Opgave 7: deelvragen c en d','§2.2.1 Prijselasticiteit · Doeloefening · Boekpagina 42');
 text(s,'c',60,206,120,70,46,{bold:true,color:C.blue});
 text(s,'Classificeer de vraag naar StreamNow met Ev = −2 en vergelijk\nde prijsgevoeligheid met die van Bioscoop Nova.\n(2 punten)',230,206,1300,207,40);
 rule(s,60,467,1480);
 text(s,'d',60,518,120,70,46,{bold:true,color:C.blue});
 text(s,'Geef één plausibele contextverklaring voor het verschil in\nprijsgevoeligheid. Baseer je verklaring niet op een andere\nelasticiteitssoort. (2 punten)',230,518,1300,220,40);
 notes(s,'42','Dit zijn de volledige deelvragen c en d uit het boek. De context en alle deelvragen zijn nu beschikbaar zonder toegevoegde uitwerking. Vraag om één beredeneerde verklaring, geen opsomming zonder verband.','Waar moet je antwoord bij d meer doen dan alleen de getallen herhalen?','Gebruik geen inkomenselasticiteit of kruiselingse elasticiteit om dit verschil te verklaren.','Begin de bespreking bij de procentuele prijsverandering van Nova.');
}
function targetCalc(title,label,setup,substitution,result,check,explanation,pitfall,transition){
 const s=slide(title,'§2.2.1 Prijselasticiteit · Opgave 7 · Boekpagina 42');
 text(s,label,60,191,1480,55,36,{bold:true,color:C.blue});
 text(s,setup,60,285,1480,77,42);
 text(s,substitution,60,423,1480,80,46);
 text(s,result,60,567,1480,82,52,{bold:true,color:C.green});
 rule(s,60,693,1480);text(s,check,60,742,1480,77,35,{bold:true});
 notes(s,'42',explanation,'Welke oude waarde staat in jouw noemer?',pitfall,transition);
}
targetCalc('Opgave 7a: de procentuele prijsverandering','Nova: € 10 naar € 12 per ticket',
 '%ΔP = (nieuwe P − oude P) / oude P × 100%',
 '%ΔP = (12 − 10) / 10 × 100%',
 '%ΔP = +20%',
 'Controle: € 10 × 1,20 = € 12',
 'De prijs stijgt 2 euro ten opzichte van 10 euro. 2 / 10 × 100% = +20%. Het plusteken beschrijft een stijging. Benoem euro per ticket bij de oorspronkelijke waarden; het resultaat is een percentage.',
 'Delen door 12 zou de nieuwe waarde als basis nemen.','Bereken vervolgens de procentuele hoeveelheidsverandering.');
targetCalc('Opgave 7a: de procentuele hoeveelheidsverandering','Nova: 500 naar 420 tickets per week',
 '%ΔQv = (nieuwe Qv − oude Qv) / oude Qv × 100%',
 '%ΔQv = (420 − 500) / 500 × 100%',
 '%ΔQv = −16%',
 'Controle: 500 × 0,84 = 420 tickets per week',
 'Er worden 80 tickets per week minder gevraagd. −80 / 500 × 100% = −16%. 420 is 84% van het oude aantal, zodat de daling 16% bedraagt.',
 'De afname van 80 tickets is niet 80%. Houd het minteken vast.','Deel nu de twee percentages in de juiste volgorde.');
{
 const s=slide('Opgave 7a: de elasticiteit van Nova','§2.2.1 Prijselasticiteit · Opgave 7 · Boekpagina 42');
 text(s,'Ev = %ΔQv / %ΔP',60,217,1480,76,49,{bold:true,color:C.blue});
 text(s,'Ev = −16% / +20% = −0,8',60,386,1480,101,58,{bold:true});
 text(s,'Ev heeft geen eenheid en geen procentteken.',60,570,1480,70,39);
 rule(s,60,694,1480);text(s,'Controle: −0,8 × (+20%) = −16%',60,744,1480,72,42,{bold:true,color:C.green});
 notes(s,'42','Deel de reactie van de gevraagde hoeveelheid door de prijsverandering: −16 / +20 = −0,8. De breuk is negatief doordat P en Qv tegengesteld veranderen. Controleer door Ev met de prijsverandering te vermenigvuldigen. Dit geeft opnieuw −16%.','Welke procentuele verandering hoort boven de breuk?','Ev = −0,8 is geen daling van 0,8% en geen bedrag in euro.','Beantwoord b met indeling én betekenis.');
}
{
 const s=slide('Opgave 7b: prijsinelastische vraag','§2.2.1 Prijselasticiteit · Opgave 7 · Boekpagina 42');
 text(s,'−1 < −0,8 < 0',60,210,1480,88,58,{bold:true,color:C.blue});
 table(s,[['Nova, onderzochte verandering','Uitkomst'],['Procentuele prijsstijging','20%'],['Procentuele hoeveelheidsdaling','16%']],60,352,1480,258,[1050,430],36);
 text(s,'De hoeveelheidsdaling is 0,8 maal de prijsstijging, in procenten.',60,671,1480,117,42,{bold:true,color:C.green});
 notes(s,'42','Omdat −0,8 tussen −1 en 0 ligt, is de vraag prijsinelastisch. In gewone taal: in deze verandering daalt de gevraagde hoeveelheid procentueel minder sterk dan de prijs stijgt. Dat is 16% tegenover 20%, dus 0,8 maal. Gemiddeld per 1% prijsstijging hoort in deze meting 0,8% hoeveelheidsdaling.','Hoe laten de percentages zien dat de reactie minder sterk is?','Voorspel hiermee niet met zekerheid wat bij elke volgende prijswijziging gebeurt. Prijsinelastisch betekent niet dat niemand afhaakt.','Vergelijk Nova met StreamNow.');
}
{
 const s=slide('Opgave 7c: StreamNow is prijsgevoeliger','§2.2.1 Prijselasticiteit · Opgave 7 · Boekpagina 42');
 table(s,[['Aanbieder','Ev','Indeling'],['Bioscoop Nova','−0,8','Prijsinelastisch'],['StreamNow','−2','Prijselastisch: −2 < −1']],60,218,1480,280,[620,220,640],35);
 text(s,'Bij StreamNow reageert Qv procentueel sterker op P.',60,555,1480,83,42,{bold:true,color:C.green});
 text(s,'2 maal de prijsverandering tegenover 0,8 maal, in procenten.',60,666,1480,75,37);
 text(s,'De absolute aantallen verloren klanten kun je niet vergelijken.',60,770,1480,62,33,{color:C.orange});
 notes(s,'42','StreamNow heeft Ev = −2 < −1, dus prijselastische vraag. De gevraagde hoeveelheid reageert relatief sterker op een eigen prijsverhoging dan bij Nova met Ev = −0,8. De verhouding van de gevoeligheden is 2 / 0,8 = 2,5, maar dat is niet gevraagd en niet hetzelfde als het aantal verloren klanten. StreamNow heeft geen gegeven beginhoeveelheid.','Waarom vergelijk je procentuele reacties?','Kleiner op de getallenlijn betekent hier een sterkere tegengestelde reactie, niet een zwakkere.','Geef één mogelijke contextverklaring voor dit verschil.');
}
{
 const s=slide('Opgave 7d: een plausibele contextverklaring','§2.2.1 Prijselasticiteit · Opgave 7 · Boekpagina 42');
 text(s,'Mogelijke verklaring',60,202,1480,59,37,{bold:true,color:C.blue});
 text(s,'Een streamingabonnement is mogelijk makkelijker op te zeggen\nof te vervangen dan een bioscoopbezoek.',60,292,1480,146,44);
 rule(s,60,479,1480);
 text(s,'Dat kan bij StreamNow een sterkere procentuele\nhoeveelheidsreactie op een hogere eigen prijs verklaren.',60,536,1480,145,42,{bold:true,color:C.green});
 text(s,'De gegeven cijfers bewijzen deze oorzaak niet.',60,756,1480,67,38,{bold:true,color:C.orange});
 notes(s,'42','Dit is één antwoordmogelijkheid uit het antwoordmodel. De verklaring noemt een verschil in uitwijkmogelijkheden en verbindt dat met de eigen prijsgevoeligheid. Formuleer mogelijk of kan: er is geen onderzoek naar overstapgedrag gegeven. Een andere plausibele contextredenering is aanvaardbaar als deze hetzelfde mechanisme uitlegt en niet een andere elasticiteitssoort inzet.','Welke woorden maken duidelijk dat dit een mogelijke verklaring is?','Zeg niet dat StreamNow-klanten bewezen armer zijn of dat er een inkomensverandering heeft plaatsgevonden.','Laat leerlingen één ontbrekende stap of te stellige verklaring verbeteren.');
}
{
 const s=slide('Antwoordcontrole bij opgave 7');
 const rows=[['a · Berekening','Oude waarden als noemer, +20%, −16%, Ev = −0,8.'],['b · Betekenis','Prijsinelastisch, met 16% tegenover 20% toegelicht.'],['c · Vergelijking','StreamNow prijselastisch en relatief prijsgevoeliger.'],['d · Verklaring','Een mogelijk mechanisme, met een passende beperking.']];
 rows.forEach((a,i)=>{const y=212+i*136;text(s,a[0],60,y,470,69,36,{bold:true,color:C.blue});text(s,a[1],578,y,955,101,35);});
 text(s,'Verbeter één ontbrekende stap in je eigen antwoord.',60,785,1480,53,34,{bold:true,color:C.green});
 notes(s,'42','Controleer de volledigheid van a tot en met d. Een uitkomst zonder berekening of gevraagde betekenis is nog geen volledig antwoord. Laat leerlingen hun correctie in het schrift markeren. Bespreek eventueel waarom een negatieve Ev bij een prijsdaling ook mogelijk is, maar voeg geen extra huiswerk toe.','Wat pas je nu aan in je antwoord?','De classificatie alleen is onvoldoende wanneer de vraag om uitleg of vergelijking vraagt.','Zet het huiswerk op het laatste overzicht in de agenda.');
}
overview('Afsluiting / huiswerk',7);

if(JSON.stringify(overviews)!==JSON.stringify(M.overviewSlides))throw new Error('Overview slide manifest mismatch');
if(p.slides.items.length!==24)throw new Error('Unexpected slide count');
await fs.writeFile(BUILD+'/manifest.json',JSON.stringify({...M,slides,nativeTableSlides:tables,nativeChartSlides:charts},null,2));
await fs.writeFile(BUILD+'/presentation.json',JSON.stringify(p.toProto()));
console.log('Slides:',p.slides.items.length);
const draft=BUILD+'/candidate.pptx';
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:FINAL+'/2.2.1 Prijselasticiteit – presentatie.pptx',pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...Array.from(new Set(tables)).flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:Array.from(new Set(tables)),requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
