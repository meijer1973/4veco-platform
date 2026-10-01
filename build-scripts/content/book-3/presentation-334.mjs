// HOW TO ADAPT: read the current paragraph, answers and teacher route first.
// Keep the three overviews in one function. Runtime paths come from environment.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('334');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', title='3.3.4 Gemengde opgaven internationale handel';
const source='https://github.com/meijer1973/4veco-lessen/blob/9b8304d5031cafac936a56281e144573a25fbbc9/edities/books34-v3/books/book-3/';
const tables=[],charts=[],manifest=[],overviews=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function notes(s,page,explanation,question,pitfall,transition,extra=''){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 3, geselecteerde v3-editie, book34-lesson-balance-v3-20260915; actuele broncommit 9b8304d5031cafac936a56281e144573a25fbbc9. Gedrukte boekpagina ${page}. ${source}output/Boek_3_Compleet_v3.pdf\nAntwoordmodel: ${source}chapters/3.3/Antwoorden.md\nDocent: ${source}chapters/3.3/Docenteninformatie.md\n${extra}`);
}
function slide(heading,footer='§3.3.4 Gemengde opgaven internationale handel'){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,heading,60,42,1480,95,50,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 manifest.push({number:p.slides.items.length,title:heading});return s;
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;
  for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
   cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
  }
 } tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Korte herhaling en aanpak.',
 'Werk verder aan de gemengde opgaven, stel vragen en kijk je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 35.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=p.slides.add();s.background.fill=C.paper;overviews.push(p.slides.items.length);
 manifest.push({number:p.slides.items.length,title:'Deze les: §3.3.4 Gemengde opgaven internationale handel'});
 text(s,'Deze les: §3.3.4 Gemengde opgaven\ninternationale handel',60,30,1480,110,46,{bold:true,name:'overview-title'});
 text(s,'Nu: '+phase,60,151,1480,43,30,{bold:true,color:C.blue,name:'phase'});rule(s,60,202,1480);
 text(s,'Lesroute',60,230,835,45,35,{bold:true});
 const ys=[291,381,438,495,602,696,773],hs=[83,45,45,95,80,60,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,230,565,45,35,{bold:true});
 text(s,'Bronnen kiezen, comparatief voordeel\nuitleggen, import en opbrengst\nberekenen, conclusies onderbouwen.',972,289,568,130,30,{name:'overview-goals'});
 rule(s,972,420,568);
 text(s,'Startopdracht',972,445,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 117 · Opgave 31\nEerste gemengde opgave',972,500,565,86,30,{bold:active===2,name:'overview-start'});
 rule(s,972,596,568);
 text(s,'Huiswerk',972,616,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§3.3.4 · Opgaven 31–38\nVoorbereiding: 31–34 · Doel: 35\nBonus: 36 · Herhaling: 37–38\nMaken en nakijken',972,678,565,156,30,{bold:active===7,name:'overview-homework'});
 text(s,'§3.3.4 · Boekpagina’s 117–123',60,848,1350,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 notes(s,'117–123',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. De eerste gemengde opgave is 31, niet het hoofdstukbrede nummer 1. Start 31 haalt comparatief voordeel en import op uit §3.3.1 (p. 88–89) en §3.3.2 (p. 97–99). Geen nieuwe procedure wordt in de start verondersteld. Voorbereiding 31–34, doeloefening 35, bonus 36, herhaling 37–38. Er is volgens de docenteninformatie geen afzonderlijke basis- of begeleide sectie. De classroom-werkwijze voor gemengde opgaven schrijft alle genummerde opgaven als huiswerk voor; daarom ook 36 (met bonuslabel) en 37–38. Dit wijkt bewust af van de optionele bonus/herhaling in de algemene boekroute. Laat het werk zo nodig buiten deze les afmaken. Geen claim dat de volledige route in één les past. De drie overzichten komen uit dezelfde functie.`,phase==='Startopdracht'?'Welk begrip past bij elke vraag? Licht één keuze toe.':'Welke opgave of stap vraagt nog aandacht?','Eén gezamenlijk voordeel betekent niet dat elke groep wint.','Na start: korte herhaling. Na uitleg: verder met 32–35 en overige gemengde opgaven. Bij afsluiting: agenda.', 'Alleen voor feedback na de start: 31a comparatief voordeel, omdat het om opgegeven andere productie gaat; 31b import. Bespreek 35 omdat deze opgave bronkeuze, comparatief voordeel, import, heffingsopbrengst, grafiek en een begrensde conclusie samenbrengt.');
 return s;
}
function rows(s,items,{y=205,step=175,left=60,split=560,size=36}={}){items.forEach((a,i)=>{const yy=y+i*step;text(s,a[0],left,yy,split-left-40,115,size,{bold:true,color:[C.blue,C.green,C.orange][i%3]});text(s,a[1],split,yy,1540-split,135,size);if(i<items.length-1)rule(s,60,yy+step-30,1480);});}
function series(name,x,y,color,width=3){return {name,xValues:x,values:y,line:{fill:color,width},marker:{symbol:'none'}};}
function market(s,shade=false){
 const data=[series('Vraag V',[0,160],[40,0],C.blue),series('Aanbod A',[0,160],[0,40],C.green),series('Pw = 10',[0,160],[10,10],C.muted,2),series('Pw + t = 15',[0,160],[15,15],C.orange,2)];
 if(shade){
  // Exact hatch segments clipped to [60,100] x [10,15], in data coordinates.
  // Separate two-point sides avoid PowerPoint smoothing a closed scatter series.
  data.push(series('Ondergrens opbrengst',[60,100],[10,10],C.orange,3),
   series('Bovengrens opbrengst',[60,100],[15,15],C.orange,3),
   series('Linkergrens opbrengst',[60,60],[10,15],C.orange,3),
   series('Rechtergrens opbrengst',[100,100],[10,15],C.orange,3));
  for(let q=60;q<100;q+=4){const end=Math.min(q+10,100);data.push(series('Arcering '+q,[q,end],[10,10+(end-q)/2],C.orange,1));}
  for(let v=11;v<15;v++){const end=60+(15-v)*2;data.push(series('Arcering boven '+v,[60,end],[v,15],C.orange,1));}
 }
 const ch=s.charts.add('scatter',{position:{left:65,top:195,width:1110,height:610},series:data,hasLegend:false,scatterOptions:{style:'line'},
  xAxis:{min:0,max:160,majorUnit:20,position:'bottom',title:{text:'Q (jassen per week)',textStyle:{fontSize:26,typeface:FONT}},textStyle:{fontSize:24,typeface:FONT},line:{fill:C.ink,width:1},majorGridlines:{fill:C.line,width:0.5}},
  yAxis:{min:0,max:40,majorUnit:5,position:'left',title:{text:'P (€ per jas)',textStyle:{fontSize:26,typeface:FONT}},textStyle:{fontSize:24,typeface:FONT},line:{fill:C.ink,width:1},majorGridlines:{fill:C.line,width:0.5}},chartFill:C.paper,chartLine:{fill:'none',width:0},plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 text(s,'A',974,268,55,45,29,{bold:true,color:C.green});text(s,'V',974,614,55,45,29,{bold:true,color:C.blue});
 text(s,'Pw + t = € 15',1190,503,350,48,29,{bold:true,color:C.orange});text(s,'Pw = € 10',1190,566,350,45,29,{bold:true,color:C.muted});
 return ch;
}

overview('Startopdracht',2);
{
 const s=slide('Drie vergelijkingen bij internationale handel');
 rows(s,[['Absoluut voordeel','Minder middelen voor hetzelfde product.'],['Comparatief voordeel','Relatief minder andere productie opgeven.'],['Concurrentiepositie','Prijs, kwaliteit en betrouwbare levering.']],{step:185});
 text(s,'Een bronfeit bepaalt welke vergelijking je kunt maken.',60,786,1480,48,34,{bold:true});
 notes(s,'88–91','Korte herhaling van §3.3.1. Benoem wat in elke vergelijking constant blijft: product en kwaliteit bij absoluut voordeel; extra productie en opgeofferd ander product bij comparatief voordeel. Betrouwbare levering ondersteunt concurrentiepositie, maar bewijst geen comparatief voordeel. Laat een leerling bij elke vergelijking het soort bronfeit noemen.','Waarover gaat een uitspraak over minder opgegeven machineproductie?','Absoluut sterker bij beide producten maakt handel niet zinloos.','Herhaal de rekenaanpak met een eigen voorbeeld.');
}
{
 const s=slide('Fietshelmen in Ivera: eerst de juiste hoeveelheden');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,178,1480,47,29,{bold:true,color:C.blue});
 text(s,'Klein prijsnemend land. Heffing: € 4 per ingevoerde helm.\nDe wereldprijs blijft € 18. Er blijft import.',60,244,1480,102,36);
 table(s,[['Situatie','Prijs per helm','Verbruik per week','Productie per week'],['Vrije invoer','€ 18','90','30'],['Met heffing','€ 22','78','42']],60,382,1480,240,[400,320,380,380],32);
 text(s,'Import na de heffing = 78 − 42 = 36 helmen per week',60,668,1480,65,40,{bold:true,color:C.green});
 text(s,'Controle: 42 binnenlands + 36 ingevoerd = 78 gebruikt',60,764,1480,56,33);
 notes(s,'98, 108–109','Eigen uitlegvoorbeeld met eigen context/data: Ivera en fietshelmen, geen boekopgave. Verder geldt: gelijkwaardige producten, concurrentie, voldoende buitenlandse levering, geen transportkosten of effecten op derden. Neem de rij na de heffing. Binnenlands verbruik omvat binnenlandse productie én import. Alleen het verschil is ingevoerd. De gebruikte werkwijze is eerder onderwezen in §3.3.2 en §3.3.3.','Welke rij en welke twee kolommen heb je nodig?','78 helmen is het verbruik, niet de import.','Verbind de import met het overheidsbedrag.','De boekpagina’s onderbouwen alleen de methode, niet de verzonnen Ivera-gegevens.');
}
{
 const s=slide('De heffing geldt per ingevoerde helm');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,178,1480,47,29,{bold:true,color:C.blue});
 text(s,'€ 4 per helm',100,290,620,90,58,{bold:true,color:C.orange});
 text(s,'36 helmen per week',780,290,735,90,58,{bold:true,color:C.green});
 rule(s,100,400,1380);
 text(s,'Heffingsopbrengst = 4 × 36 = € 144 per week',100,454,1380,100,49,{bold:true});
 rows(s,[['In de grafiek','Hoogte: € 4 per helm\nBreedte: 36 helmen per week'],['Bij gratis vergunningen','Zonder invoerheffing ontvangt de overheid\ngeen bedrag per ingevoerde helm.']],{y:595,step:124,split:570,size:32});
 notes(s,'109–111','Vervolg eigen Ivera-voorbeeld. Vermenigvuldig de heffing per eenheid met de resterende import. De eenheden helm vallen weg, euro per week blijft. Herinner aan de rechthoek uit §3.3.3: tussen oude en nieuwe prijs en tussen productie en verbruik bij de nieuwe prijs. In Ivera liggen de grenzen bij prijs 18–22 en hoeveelheid 42–78. Een importquotum stelt een maximum; gratis vergunningen zonder heffing leveren geen ontvangsten op.','Waarom vermenigvuldig je met 36 en niet met 78?','De binnenlandse producent draagt deze invoerheffing niet af over eigen productie.','Onderbouw een conclusie vanuit de afzonderlijke groepen.','Ivera is authored, niet uit het boek.');
}
{
 const s=slide('Een conclusie gebruikt het doel én de gevolgen');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,178,1480,47,29,{bold:true,color:C.blue});
 rows(s,[['Producenten in Ivera','€ 18 wordt € 22 per helm.\nProductie: 30 wordt 42 per week.'],['Kopers in Ivera','€ 18 wordt € 22 per helm.\nVerbruik: 90 wordt 78 per week.'],['Onderbouwd oordeel','De productie stijgt.\nKopers betalen meer per helm.']],{y:275,step:175,size:37});
 notes(s,'89–91, 109–111','Vervolg eigen Ivera-voorbeeld. Een beleidsconclusie koppelt een bronfeit aan een doel en benoemt een tegengesteld gevolg. Binnenlandse productie behouden wordt ondersteund. Dit bewijst geen voordeel voor alle inwoners. Controleer voor elke nieuwe bron opnieuw de aannames. De regel wereldprijs plus heffing geldt hier omdat import blijft bestaan.','Welk gegeven ondersteunt het productiedoel en welk gegeven beschrijft het nadeel voor kopers?','Extra productie is niet automatisch gelijk aan extra totale welvaart of winst van elk bedrijf.','Laat het overzicht staan en laat leerlingen zelf aan de gemengde opgaven werken.','Ivera is authored, niet uit het boek. Geen uitwerking van opgaven 32–38 in deze instructiefase.');
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 35 · Bron A: productie en specialisatie','Opgave 35 · Boekpagina 120');
 text(s,'Nerin en Pelta maken machines en regenjassen van dezelfde kwaliteit. Nerin gebruikt voor beide minder middelen.',60,205,1480,125,40);
 text(s,'Het voordeel bij machines is groot; bij jassen klein. Voor extra jassen geeft Nerin relatief veel machineproductie op. Pelta geeft daarvoor minder machines op.',60,392,1480,180,40);
 text(s,'Beide landen kunnen hun productiemiddelen voor beide activiteiten gebruiken.',60,661,1480,112,40);
 notes(s,'120','Dit is de volledige inhoud van bron A van opgave 35. Leerlingen hebben de opgave eerst zelfstandig geprobeerd. Lees nu de bronnen opnieuw zonder antwoorden te onthullen. De figuur, tabel, overige bronnen en alle vragen volgen.','Welke twee producten vergelijkt deze bron?','Voeg geen zelfbedachte productieverhoudingen toe. De vergelijking blijft kwalitatief.','Lees bron B.');
}
{
 const s=slide('Opgave 35 · Bron B: markt en maatregel','Opgave 35 · Boekpagina 120');
 text(s,'Nerin is klein en prijsnemend. De markt kent concurrentie, voldoende buitenlandse levering, geen transportkosten en geen effecten op derden. Alle prijzen zijn in euro.',60,195,1480,166,37);
 text(s,'De wereldprijs is € 10. Nerin heft € 5 per ingevoerde jas, afgedragen door importeurs. Er blijft import.',60,427,1480,120,40,{bold:true,color:C.blue});
 text(s,'De minister wil binnenlandse productie behouden. Een winkelier wijst op duurdere regenkleding voor gezinnen.',60,639,1480,125,40);
 notes(s,'120','Volledige bron B. De kleine-landaanname houdt de wereldprijs constant. De importeurs dragen af. De bron zegt uitdrukkelijk dat import overblijft. De belangen van minister en winkelier worden pas bij de beantwoording beoordeeld.','Wie draagt volgens de bron de heffing af?','De wereldprijs stijgt niet met de invoerheffing.','Toon de tabel.');
}
{
 const s=slide('Opgave 35 · De tabel bij bron B','Opgave 35 · Boekpagina 120');
 table(s,[['Situatie','Prijs per jas','Binnenlands verbruik','Binnenlandse productie'],['Vrije invoer','€ 10','120','40'],['Met heffing','€ 15','100','60']],60,240,1480,325,[380,280,410,410],33);
 text(s,'Alle hoeveelheden zijn regenjassen per week.',60,635,1480,68,41,{bold:true});
 text(s,'De grafiek op de volgende dia geeft dezelfde markt weer.',60,746,1480,58,33);
 notes(s,'120','De tabel is inhoudelijk gelijk aan het boek en blijft bewerkbaar. De vraag- en aanbodlijnen zijn dezelfde voor en na de heffing. Dit is nog de vraagfase: reken de import en opbrengst nog niet voor.','Wat is de eenheid van de twee hoeveelheidskolommen?','De twee kolommen zijn geen twee verschillende landen.','Bekijk figuur 3.');
}
{
 const s=slide('Opgave 35 · Figuur 3: regenjassen in Nerin','Opgave 35 · Boekpagina 120');market(s);
 notes(s,'120','Bewerkbare XY-reconstructie van de gegeven figuur 3. Vraag loopt van (Q=0,P=40) tot (160,0); aanbod van (0,0) tot (160,40). Prijslijnen P=10 en P=15. Assen en snijpunten zijn gelijk aan de boekfiguur. De heffingsopbrengst is hier nog niet aangegeven.','Welke grootheid staat op elke as?','De hele vraag en het hele aanbod blijven binnenlands; import is straks het verschil bij één prijs.','Lees het alternatief in bron C.');
}
{
 const s=slide('Opgave 35 · Bron C: een alternatief','Opgave 35 · Boekpagina’s 120–121');
 text(s,'Een voorstel wil de invoer begrenzen met een importquotum.',60,220,1480,105,45,{bold:true});
 text(s,'De overheid geeft de invoervergunningen gratis weg en heft geen invoerheffing.',60,401,1480,125,44);
 rule(s,60,600,1480);
 text(s,'Gebruik de drie bronnen, de tabel en figuur 3 op boekpagina 120.\nNoteer bij berekeningen de eenheden en bij uitleg het gebruikte brongegeven.',60,661,1480,147,36);
 notes(s,'120–121','Volledige bron C en algemene opgave-instructie. Het manuscript noemt hoofdstukpagina 34; in het complete boek is dat gedrukte pagina 120. Deze verwijzing is hier omgezet naar de gecontroleerde boekpagina. De volgende drie dia’s tonen alle zes deelvragen zonder oplossingen.','Welke twee kenmerken van de vergunningenregeling noemt bron C?','Een begrensde hoeveelheid is nog geen belasting.','Toon vragen a en b.');
}
{
 const s=slide('Opgave 35 · Vragen a en b','Opgave 35 · Boekpagina 121');
 text(s,'a  (3p)',60,200,180,65,40,{bold:true,color:C.blue});
 text(s,'Leg met bron A uit waarom Pelta een comparatief voordeel kan hebben bij regenjassen, terwijl Nerin bij beide activiteiten een absoluut voordeel heeft.',260,200,1255,220,41);
 rule(s,60,476,1480);
 text(s,'b  (3p)',60,536,180,65,40,{bold:true,color:C.blue});
 text(s,'Bereken met bron B de import na de heffing en de heffingsopbrengst per week.',260,536,1255,175,41);
 notes(s,'121','Letterlijke deelvragen a en b. Toon nog geen uitkomsten. Ook c tot en met f moeten eerst beschikbaar zijn.','Welke bron hoort bij welke deelvraag?','Een juiste uitkomst zonder eenheden of gevraagde verklaring is onvolledig.','Toon c en d.');
}
{
 const s=slide('Opgave 35 · Vragen c en d','Opgave 35 · Boekpagina 121');
 text(s,'c  (3p)',60,200,180,65,40,{bold:true,color:C.blue});
 text(s,'Leg met prijs én hoeveelheid uit wat de maatregel betekent voor binnenlandse jassenmakers en binnenlandse kopers.',260,200,1255,185,41);
 rule(s,60,470,1480);
 text(s,'d  (2p)',60,535,180,65,40,{bold:true,color:C.blue});
 text(s,'Arceer de heffingsopbrengst in figuur 3. Benoem de breedte en hoogte met hun eenheden.',260,535,1255,185,41);
 notes(s,'121','Letterlijke deelvragen c en d. De figuur op dia 10 en boekpagina 120 bevat nog geen arcering. Laat leerlingen hun eigen tekening bij de hand houden.','Welke twee gegevens vraagt c voor elke groep?','Alleen prijs of alleen hoeveelheid is nog geen volledig antwoord.','Toon e en f.');
}
{
 const s=slide('Opgave 35 · Vragen e en f','Opgave 35 · Boekpagina 121');
 text(s,'e  (2p)',60,194,180,65,40,{bold:true,color:C.blue});
 text(s,'Waarom mag de overheid bij het quotum uit bron C niet zonder meer dezelfde ontvangsten verwachten?',260,194,1255,170,40);
 rule(s,60,420,1480);
 text(s,'f  (3p)',60,472,180,65,40,{bold:true,color:C.blue});
 text(s,'De minister zegt: “De binnenlandse productie stijgt, dus de heffing is voor alle inwoners gunstig.” Geef een oordeel met twee concrete gegevens uit de bronnen of tabel. Maak duidelijk welke conclusie wél wordt ondersteund.',260,472,1255,305,40);
 notes(s,'121','Letterlijke deelvragen e en f. Alle bronnen, tabel, figuur en zes vragen zijn nu zonder oplossingen getoond. Begin pas op de volgende dia de beantwoording.','Hoeveel concrete gegevens vraagt f?','Doelbereik en voordeel voor alle inwoners zijn verschillende conclusies.','Bespreek vanaf nu de antwoorden, eerst a.');
}
{
 const s=slide('35a · Pelta geeft relatief minder machines op','Opgave 35a · Boekpagina’s 120–121');
 rows(s,[['Bronfeit','Pelta geeft voor extra regenjassen\nminder machineproductie op.'],['Betekenis','Pelta heeft lagere alternatieve kosten\nvan regenjassen.'],['Conclusie','Pelta heeft een comparatief voordeel\nbij regenjassen.']],{step:175,size:39});
 text(s,'Nerin gebruikt voor beide producten absoluut minder middelen.',60,765,1480,65,34,{bold:true,color:C.muted});
 notes(s,'120–121','Antwoordmodel 35a: begin bij het opgegeven andere product. Relatief minder machines opofferen geeft lagere alternatieve kosten. Dit kan samengaan met Nerins absolute voordeel in beide producten. Geen berekende productietabel nodig of toegestaan als verzonnen brondata.','Welke woorden maken dit een relatieve vergelijking?','Een kleinere absolute achterstand is op zichzelf geen volledige uitleg zonder opgegeven andere productie.','Bereken de import na de heffing.');
}
{
 const s=slide('35b · Eerst import, dan heffingsopbrengst','Opgave 35b · Boekpagina’s 120–121');
 text(s,'Na de heffing: verbruik 100, productie 60 jassen per week',60,199,1480,65,37,{bold:true,color:C.blue});
 text(s,'Import = Qv − Qa',60,326,1480,70,46,{bold:true});
 text(s,'100 − 60 = 40 jassen per week',60,414,1480,72,49,{bold:true,color:C.green});
 rule(s,60,518,1480);
 text(s,'Heffingsopbrengst = heffing per jas × import',60,560,1480,70,40);
 text(s,'€ 5 per jas × 40 jassen per week = € 200 per week',60,648,1480,72,43,{bold:true,color:C.orange});
 text(s,'Controle: 60 + 40 = 100 jassen per week',60,770,1480,48,31);
 notes(s,'120–121','Selecteer eerst de rij Met heffing. Import = 100 min 60, daarna 5 maal 40. De overheid ontvangt 200 euro per week. Alleen de ingevoerde jassen worden belast. 5 maal 100 belast ten onrechte het hele verbruik; 5 maal 80 gebruikt de oude import.','Welke import hoort bij de heffing: vóór of na de maatregel?','De binnenlandse makers betalen niet de invoerheffing over hun 60 jassen.','Vergelijk nu per groep prijs en hoeveelheid.');
}
{
 const s=slide('35c · Dezelfde prijsstijging, andere gevolgen','Opgave 35c · Boekpagina’s 120–121');
 table(s,[['Groep in Nerin','Prijs per jas','Hoeveelheid per week'],['Jassenmakers','Ontvangen € 10 wordt € 15','Productie: 40 wordt 60'],['Kopers','Betalen € 10 wordt € 15','Verbruik: 120 wordt 100']],60,236,1480,350,[440,520,520],33);
 text(s,'Jassenmakers ontvangen meer per jas en produceren meer.',60,651,1480,60,38,{bold:true,color:C.green});
 text(s,'Kopers betalen € 5 meer per jas en kopen minder.',60,752,1480,60,38,{bold:true,color:C.orange});
 notes(s,'120–121','Antwoordmodel 35c vraagt voor beide groepen prijs én hoeveelheid. Vergeleken met vrije invoer: prijs stijgt 10 naar 15, productie 40 naar 60, verbruik 120 naar 100. Het gaat om binnenlandse kopers en producenten.','Wat is gunstig voor producenten maar nadelig voor kopers?','Een hogere verkoopprijs bewijst zonder kosteninformatie geen exacte winststijging van elk afzonderlijk bedrijf.','Laat de opbrengst in de grafiek zien.');
}
{
 const s=slide('35d · Heffingsopbrengst: de juiste rechthoek','Opgave 35d · Boekpagina’s 120–121');market(s,true);
 text(s,'Breedte: 100 − 60\n40 jassen per week',1190,208,350,105,30,{bold:true,color:C.green});
 text(s,'Hoogte: 15 − 10\n€ 5 per jas',1190,335,350,105,30,{bold:true,color:C.orange});
 text(s,'Oppervlakte\n40 × 5 = € 200\nper week',1190,649,350,143,31,{bold:true});
 notes(s,'120–121','Arceer exact Q=60 tot 100 en P=10 tot 15. De hatching is onderdeel van de native XY-chart, dus blijft gekoppeld aan datacoördinaten. Breedte = 40 jassen per week, hoogte = 5 euro per jas. Oppervlakte = 200 euro per week. Dit is geld voor de overheid. De figuur gebruikt dezelfde assen, curves en prijslijnen als de onopgeloste versie.','Waarom begint de rechthoek bij 60 in plaats van nul?','De oppervlakte tussen nul en 100 belast binnenlandse productie mee. Opbrengst is geen welvaartsverliesdriehoek.','Vergelijk met de vergunningenregeling.');
}
{
 const s=slide('35e · Gratis vergunningen leveren geen heffing op','Opgave 35e · Boekpagina’s 120–121');
 rows(s,[['Bron C','De invoervergunningen zijn gratis.\nEr is geen invoerheffing.'],['Wat de overheid ontvangt','Geen vergunningprijs en geen heffing\nper ingevoerde jas.'],['Conclusie','De overheid mag daarom niet dezelfde\n€ 200 per week verwachten.']],{step:180,size:39});
 notes(s,'120–121','Antwoordmodel 35e. Het quotum begrenst de hoeveelheid. Er is geen invoerheffing en de vergunningen worden gratis weggegeven. In deze regeling zijn de bedoelde overheidsontvangsten nul. Een mogelijke verkoop van vergunningen is een andere regeling, niet in bron C.','Welk brongegeven sluit opbrengst uit verkoop van vergunningen uit?','Een importbeperking geeft niet automatisch overheidsinkomsten.','Beoordeel de claim van de minister met twee concrete gegevens.');
}
{
 const s=slide('35f · Het productiedoel lukt, kopers betalen meer','Opgave 35f · Boekpagina’s 120–121');
 rows(s,[['Gegeven 1','Binnenlandse productie stijgt:\n40 wordt 60 jassen per week.'],['Gegeven 2','Gezinnen betalen meer:\n€ 10 wordt € 15 per jas.']],{y:213,step:185,size:40});
 rule(s,60,590,1480);
 text(s,'De heffing ondersteunt het behoud van binnenlandse productie.\nDe uitspraak “voor alle inwoners gunstig” is te breed.',60,645,1480,150,42,{bold:true,color:C.blue});
 notes(s,'120–121','Antwoordmodel 35f. Het productiedoel krijgt steun van de hogere productie. De hogere prijs voor gezinnen maakt de conclusie over alle inwoners te breed. Twee concrete gegevens plus een begrensd oordeel zijn nodig. Er hoeven geen surplusgebieden opnieuw te worden berekend. Laat leerlingen een ontbrekende bronkoppeling of eenheid verbeteren.','Welke zin in je antwoord beschrijft doelbereik, en welke begrenst de conclusie?','Een beleidsdoel erkennen verplicht niet tot de uitspraak dat iedereen wint.','Keer terug naar hetzelfde overzicht en laat huiswerk noteren.');
}
overview('Afsluiting en huiswerk',7);

await fs.writeFile(BUILD+'/manifest.json',JSON.stringify({slides:manifest,overviewSlides:overviews,tables,charts},null,2));
const draft=BUILD+'/candidate.pptx';
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
await fs.writeFile(BUILD+'/presentation.json',JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:FINAL+'/'+title+' – presentatie.pptx',pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({finalPath:result.finalPath,slides:p.slides.items.length,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
