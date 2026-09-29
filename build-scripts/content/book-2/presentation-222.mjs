// Paragraph-specific classroom deck. HOW TO ADAPT: derive a fresh manifest from
// the current paragraph, then replace lesson content; retain the shared runtime.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const sourceManifest=JSON.parse(await fs.readFile(new URL('./presentation-222.manifest.json',import.meta.url),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('222');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', tables=[],charts=[],slides=[],overviews=[];
const edition='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/edities/chat-2026/';
const source='https://github.com/meijer1973/4veco-lessen/blob/'+sourceManifest.lessonCommit+'/'+edition.split('/').map(encodeURIComponent).join('/');
const label='Uitlegvoorbeeld — niet uit het boek';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,50),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,{example=false,target=false}={}){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,86,52,{bold:true});rule(s,60,146,1480);
 text(s,example?label:target?'§2.2.2 Elasticiteit en omzet · Opgave 7 · Boekpagina 50':'§2.2.2 Elasticiteit en omzet',60,848,1400,30,21,{color:C.muted});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title,example,target});return s;
}
function notes(s,page,explanation,question,misconception,transition,{example=false,target=false}={}){
 const attribution=example?'Zelfgemaakt uitlegvoorbeeld met eigen context en gegevens, niet uit het boek. De boekpagina’s zijn uitsluitend de bron voor de methode. ':'';
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${misconception}\n\nOvergang: ${transition}\n\nBron: ${attribution}Leerlingenboek Boek 2, chatuitgave 2026, herziene theorie 21 september 2026, gedrukte pagina ${page}. ${source}boek/Boek_2_Compleet.pdf\n${target?'Antwoordmodel opgave 7: '+source+'bronnen/H2/paragrafen/'+encodeURIComponent('2.2.2 Elasticiteit en omzet')+'/'+encodeURIComponent('2.2.2 Elasticiteit en omzet – antwoorden.md'):''}`);
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
 } tables.push(p.slides.items.length);return t;
}
function line(s,str,y,{size=40,bold=false,color=C.ink}={}){return text(s,str,60,y,1480,100,size,{bold,color});}
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
 const s=slide('Deze les: §2.2.2 Elasticiteit en omzet');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Omzet berekenen en vergelijken,\nEv gebruiken en omzet van\nwinst onderscheiden.',972,244,565,122,31,{name:'overview-goals'});
 rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 48 · Opgaven 1 en 2\n2a: verkennen, theorie p. 45',972,459,565,95,30,{bold:active===2,name:'overview-start'});
 rule(s,972,568,568);
 text(s,'Huiswerk',972,595,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§2.2.2 Elasticiteit en omzet\nBasis: 3 en 4\nZelfstandig: 5 en 6\nDoelopgave: 7\nMaken en nakijken',972,651,565,185,30,{name:'overview-homework'});
 notes(s,'48–50',('Start met opgaven 1 en 2 op pagina 48. De basis bestaat uit allebei de begeleide opgaven 3 en 4, op pagina 48–49. Daarna volgen 5 en 6 op pagina 49 en doelopgave 7 op pagina 50. Huiswerk is 3 tot en met 7 maken en nakijken. Bonus 8 en herhaling 9–10 zijn extra. Laat deze dia staan tijdens het werken. De volledige route heeft geen gemeten lesduur; laat het huiswerk de route zo nodig afmaken.' + "\n\nStart en terugblik: Opgave 1 gebruikt TO uit §2.1.2, dia 3, en procentuele verandering met de oude waarde als basis, zoals opgehaald in §2.2.1. Opgave 2b gebruikt het onderscheid omzet/winst uit §2.1.2, dia 4. De lokale omzetregel in opgave 2a is nieuw. Zoek de uitleg en voorwaarden op p. 45 op. Opgave 2b kan het eerdere onderscheid tussen omzet en winst ophalen. Laat leerlingen bij deze verkenning aanwijzen welke uitleg zij gebruiken en hun twijfel noteren. Verwacht de nieuwe bewerking nog niet zonder steun. Bij terugkeer naar dit overzicht vóór het basiswerk: laat leerlingen opgave 2a opnieuw proberen na de uitleg, bespreek hun redenering en geef zo nodig extra steun. Dit is een verkennende start, geen toets van al beheerste nieuwe leerstof."),'Welke gegevens heb je nodig voor de omzet?','Omzet en winst zijn verschillende grootheden. Begeleide inoefening hoort bij de normale route.','Startopdracht'===phase?'Haal de eerdere kennis op, begeleid de verkenning van 2a met p. 45 en licht daarna de doelen toe.':active===4?'Bespreek na het werken alle onderdelen van opgave 7.':'Laat leerlingen het huiswerk in hun agenda zetten.');
}
overview('Startopdracht',2);
{
 const s=slide('Lesdoelen');
 const items=[['Omzet vergelijken','Je berekent TO vóór en na de prijswijziging.'],['Een verandering in procenten','Je vergelijkt het verschil met de oude omzet.'],['Elasticiteit gebruiken','Je verklaart de uitkomst en de grens van de lokale regel.'],['Winst onderscheiden','Je benoemt welke kostengegevens nog ontbreken.']];
 items.forEach((a,i)=>{const y=200+i*146;text(s,a[0],60,y,600,55,38,{bold:true,color:C.blue});text(s,a[1],695,y,820,108,35);if(i<3)rule(s,60,y+118,1480);});
 notes(s,'44–47','De doelen bereiden voor op 7a–f. Activeren: TO = P × Q, procentuele verandering ten opzichte van oud en Ev = %ΔQv / %ΔP. Alle gevraagde eenheden worden in de voorbeelden verkocht, dus Q = Qv.','Waarom kan een hogere prijs toch minder omzet geven?','Een hogere prijs alleen bepaalt de omzet niet.','Begin met een eigen workshopvoorbeeld.');
}
{
 const s=slide('KeramiekStudio: prijs en afzet',{example:true});
 line(s,'Verkochte workshopplaatsen per maand',185,{bold:true,color:C.blue});
 table(s,[['Situatie','P (€ per plaats)','Q (plaatsen per maand)'],['Oud','30','160'],['Nieuw','33','152']],60,290,1480,290,[380,500,600],36);
 line(s,'TO = P × Q',635,{size:52,bold:true,color:C.green});
 line(s,'Alle gevraagde plaatsen worden verkocht: Q = Qv.',754,{size:34});
 notes(s,'44, 46','Dit is een zelfgemaakt voorbeeld. KeramiekStudio verkoopt eerst 160 plaatsen voor 30 euro per plaats. Na de prijsverhoging tot 33 euro zijn dat 152 plaatsen per maand. Gebruik steeds P en Q uit dezelfde situatie. De omzet heeft als eenheid euro per maand.','Welke prijs hoort bij 152 verkochte plaatsen?','Vermenigvuldig niet de nieuwe prijs met de oude afzet.','Maak de oude omzet zichtbaar als een oppervlakte.',{example:true});
}
function revenueGraph(newSituation){
 const s=slide(newSituation?'De nieuwe omzetrechthoek':'Omzet als oppervlakte',{example:true});
 line(s,newSituation?'KeramiekStudio: oud gestreept, nieuw groen':'KeramiekStudio: oud P = € 30, Q = 160',179,{size:34,bold:true,color:C.blue});
 const series=[{name:'Oud: P = 30, Q = 160',xValues:[0,160,160,0,0],values:[0,0,30,30,0],line:{fill:newSituation?C.muted:C.blue,width:4,style:newSituation?'dashed':'solid'},marker:{symbol:'none'}}];
 if(newSituation)series.push({name:'Nieuw: P = 33, Q = 152',xValues:[0,152,152,0,0],values:[0,0,33,33,0],line:{fill:C.green,width:5},marker:{symbol:'none'}});
 const ch=s.charts.add('scatter',{position:{left:60,top:254,width:1020,height:557},series,scatterOptions:{style:'line',varyColors:false},lineOptions:{smooth:false},hasLegend:false,legend:{position:'bottom',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},xAxis:{min:0,max:200,majorUnit:40,numberFormatCode:'0',title:{text:'Q (plaatsen per maand)',textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5}},yAxis:{min:0,max:40,majorUnit:10,numberFormatCode:'0',title:{text:'P (€ per plaats)',textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 text(s,newSituation?'TO nieuw':'TO oud',1140,275,400,70,40,{bold:true,color:newSituation?C.green:C.blue});
 text(s,newSituation?'33 × 152':'30 × 160',1140,377,400,75,47);
 text(s,newSituation?'= € 5.016':'= € 4.800',1140,468,400,82,47,{bold:true});
 text(s,'per maand',1140,553,400,60,34);
 text(s,newSituation?'Hoger én smaller.\nDe oppervlakte\nwordt groter.':'Breedte × hoogte\ngeeft de omzet.',1140,668,400,153,33,{bold:true,color:newSituation?C.green:C.blue});
 notes(s,'44',newSituation?'De assen hebben dezelfde schaal. De groene rechthoek is hoger: de prijs is 33 in plaats van 30 euro. Hij is smaller: 152 in plaats van 160 plaatsen. Het product is 5016 euro per maand, 216 euro meer dan eerst. De grafiek toont omzetoppervlakken en geen geschatte vraagcurve.':'De horizontale as meet plaatsen per maand, de verticale as euro per plaats. Binnen de omtrek ligt een rechthoek van 160 × 30. De oppervlakte is 4800 euro per maand. Dit is een omzetrechthoek, geen winstvlak. Er wordt geen vraagfunctie verondersteld.',newSituation?'Waarom is alleen naar de hoogte kijken onvoldoende?':'Welke eenheid heeft breedte maal hoogte?','P is een bedrag per plaats. De verticale as geeft geen totale omzet.',newSituation?'Bereken daarna hoeveel procent de omzet verandert.':'Vergelijk nu met de nieuwe prijs en afzet op dezelfde assen.',{example:true});
}
revenueGraph(false);revenueGraph(true);
{
 const s=slide('De procentuele omzetverandering',{example:true});
 line(s,'KeramiekStudio: € 4.800 naar € 5.016 per maand',186,{size:36,bold:true,color:C.blue});
 line(s,'%ΔTO = (TO nieuw − TO oud) / TO oud × 100%',330,{size:42});
 line(s,'= (5.016 − 4.800) / 4.800 × 100%',457,{size:46});
 line(s,'= +4,5%',602,{size:62,bold:true,color:C.green});
 line(s,'€ 216 extra omzet, vergeleken met de oude € 4.800.',760,{size:35});
 notes(s,'46','Eerst het verschil: 5016 − 4800 = 216 euro per maand. Deel dit door 4800, de oude omzet, en vermenigvuldig met 100%. Dat is 4,5%. Het plusteken duidt een stijging aan.','Waarom delen we door 4800?','De noemer is de oude omzet, niet de nieuwe omzet, de prijs of het aantal.','Verbind deze uitkomst aan de relatieve hoeveelheidsreactie.',{example:true});
}
{
 const s=slide('Een relatief zwakke hoeveelheidsreactie',{example:true});
 table(s,[['KeramiekStudio','Verandering'],['P: € 30 naar € 33','+10%'],['Q: 160 naar 152 per maand','−5%']],60,210,1480,265,[1050,430],35);
 line(s,'Ev = −5% / +10% = −0,5',526,{size:48,bold:true,color:C.blue});
 line(s,'−1 < −0,5 < 0: prijsinelastische vraag',630,{size:40});
 line(s,'In deze meting stijgt TO met 4,5%.',750,{size:42,bold:true,color:C.green});
 notes(s,'45–46','De prijs stijgt relatief tweemaal zo sterk als de afzet daalt. Ev = −0,5 is prijsinelastisch. In deze meting weegt het hogere bedrag per plaats zwaarder: de directe berekening heeft de omzetstijging aangetoond. Ev beschrijft hier de gemeten stap en bewijst geen gelijke reactie bij een volgende prijs.','Is de reactie zwak in aantallen of in procenten?','Vergelijk procenten, geen euro’s met aantallen. Ev is dimensieloos.','Vergelijk nu met een sterke hoeveelheidsreactie.',{example:true});
}
{
 const s=slide('KajakStek: minder verhuringen',{example:true});
 line(s,'Alle gevraagde kajaks worden verhuurd.',185,{size:34,color:C.blue});
 table(s,[['Situatie','P (€ per verhuring)','Q (per week)','TO (€ per week)'],['Oud','25','200','25 × 200 = 5.000'],['Nieuw','30','140','30 × 140 = 4.200']],60,290,1480,288,[250,390,330,510],34);
 line(s,'TO daalt met € 800 per week.',649,{size:48,bold:true,color:C.orange});
 notes(s,'44, 46–47','Tweede zelfgemaakte context. Eerst 200 verhuringen voor 25 euro, daarna 140 voor 30 euro, telkens per week. TO oud is 5000 en TO nieuw 4200 euro per week. Gebruik bij ieder product de passende P en Q.','Hoeveel omzet verdwijnt per week?','De prijs is hoger maar de totale omzet kan lager zijn.','Bereken de procentuele verandering en verbind die aan Ev.',{example:true});
}
{
 const s=slide('Een relatief sterke hoeveelheidsreactie',{example:true});
 line(s,'KajakStek: € 5.000 naar € 4.200 per week',188,{size:36,bold:true,color:C.blue});
 line(s,'%ΔTO = (4.200 − 5.000) / 5.000 × 100% = −16%',312,{size:40});
 table(s,[['%ΔP','%ΔQ','Ev'],['+20%','−30%','−30% / +20% = −1,5']],60,452,1480,197,[390,390,700],37);
 line(s,'Ev < −1: prijselastisch. TO daalt in deze meting.',732,{size:39,bold:true,color:C.orange});
 notes(s,'45–47','Het omzetverschil van min 800 delen we door de oude 5000. Dat is min 16%. De prijs stijgt van 25 naar 30: plus 20%. Q daalt van 200 naar 140: min 30%. Ev is min 1,5, dus prijselastisch. De procentuele afzetdaling is sterker dan de procentuele prijsstijging.','Welke twee procentuele veranderingen vergelijken we voor Ev?','Ev gebruikt de hoeveelheidsverandering in de teller, niet de omzetverandering van min 16%.','Vat de lokale omzetregel samen.',{example:true});
}
function localRule(isTarget=false){
 const s=slide(isTarget?'Opgave 7e: de lokale omzetregel':'De lokale omzetregel',{target:isTarget});
 line(s,'Bij een kleine prijsverandering rond de huidige situatie',185,{size:36,bold:true,color:C.blue});
 table(s,[['Vraag','Kleine prijsstijging','Kleine prijsdaling'],['Prijsinelastisch\n−1 < Ev ≤ 0','TO stijgt','TO daalt'],['Prijselastisch\nEv < −1','TO daalt','TO stijgt'],['Unitair elastisch\nEv = −1','Effecten ongeveer\nin evenwicht','Effecten ongeveer\nin evenwicht']],60,303,1480,388,[530,475,475],32);
 line(s,'Bij gegeven oude en nieuwe waarden: TO altijd narekenen.',748,{size:36,bold:true,color:C.orange});
 notes(s,isTarget?'50':'45','Bij een kleine prijsstijging werken de hogere prijs en de lagere afzet tegen elkaar in. Bij prijsinelastische vraag is de relatieve hoeveelheidsreactie zwak en stijgt TO. Bij prijselastische vraag is zij sterk en daalt TO. Bij een kleine prijsdaling draaien de richtingen om. Bij Ev = −1 zijn de effecten lokaal ongeveer in evenwicht. De elasticiteit bij een punt is niet automatisch gelijk aan de gemeten verhouding over een grote stap.','Wat verandert aan de regel als de prijs daalt?','Deze regel is geen garantie voor elke grote eindige prijswijziging.','Laat zien waarom je beide omzetbedragen rechtstreeks berekent.',{target:isTarget});
}
localRule();
{
 const s=slide('Prijs en afzet zijn twee factoren',{example:true});
 line(s,'KajakStek: P +20%, Q −30%',191,{size:39,bold:true,color:C.blue});
 line(s,'TO nieuw / TO oud = (P nieuw / P oud) × (Q nieuw / Q oud)',328,{size:36});
 line(s,'= 1,20 × 0,70 = 0,84',476,{size:54,bold:true,color:C.green});
 line(s,'84% van de oude omzet: een daling van 16%.',613,{size:41});
 line(s,'Optellen van +20% en −30% zou −10% geven.',744,{size:35,color:C.orange});
 notes(s,'45, 47','Omdat TO = P × Q geldt exact dat de omzetfactor het product is van de prijsfactor en de hoeveelheidsfactor. 1,20 maal 0,70 is 0,84. De procenten simpel optellen laat de interactie van beide veranderingen weg. Een gemeten Ev over een grote stap bepaalt niet de lokale reactie bij elke prijs. Daarom reken je de twee omzetbedragen uit.','Waarom vermenigvuldigen we hier groeifactoren?','Een stijging en een daling kun je niet zonder meer tegen elkaar wegstrepen.','Bepaal welke gegevens nodig zijn voor een winstconclusie.',{example:true});
}
{
 const s=slide('Omzet en winst');
 line(s,'Winst = TO − TK',194,{size:60,bold:true,color:C.blue});
 table(s,[['Voor een winstvergelijking','Oud','Nieuw'],['Totale opbrengst','TO oud','TO nieuw'],['Totale kosten','TK oud nodig','TK nieuw nodig']],60,338,1480,297,[700,390,390],34);
 line(s,'Een omzetverandering geeft nog geen zekere winstrichting.',724,{size:39,bold:true,color:C.orange});
 notes(s,'44–47','Zet voor elke periode opbrengsten en kosten naast elkaar. Je kunt winst pas vergelijken als je beide kostenbedragen kent. Minder verkopen kan de kosten ook veranderen. Een volgende prijsstap kan bovendien een andere vraagreactie geven.','Welke twee extra bedragen zijn nodig?','Vul ontbrekende kosten niet automatisch als nul in.','Laat leerlingen een korte redenering toetsen.');
}
function check(reveal){
 const s=slide(reveal?'Korte controle: de redenering':'Korte controle');
 line(s,'Een aanbieder verlaagt de prijs een klein beetje.',198,{size:41,bold:true});
 line(s,'De lokale Ev is −0,5.',320,{size:45,bold:true,color:C.blue});
 if(reveal){line(s,'Prijsinelastisch: de omzet daalt volgens de lokale regel.',498,{size:39,bold:true,color:C.orange});line(s,'De winstrichting blijft onbekend zonder de kosten.',668,{size:39});}
 else{line(s,'Wat verwacht je voor TO? Leg uit.',498,{size:44});line(s,'Kun je ook de richting van de winst voorspellen?',668,{size:40});}
 notes(s,'45',reveal?'Bij prijsinelastische vraag groeit Q relatief weinig bij een kleine prijsdaling. De lagere opbrengst per eenheid weegt zwaarder en TO daalt lokaal. Voor winst ontbreken de kosten. Bij een werkelijke verandering met P en Q vóór en na controleer je TO rechtstreeks.':'Laat leerlingen eerst individueel een richting en een reden bedenken. Dit is een korte begripscontrole zonder extra huiswerkopgave. Gebruik de prijsdaling om te voorkomen dat leerlingen één omzetrichting aan het woord inelastisch koppelen.','Wat is de prijsrichting, en hoe sterk reageert Q relatief?','Prijsinelastisch betekent niet dat TO altijd stijgt.',reveal?'Laat de overzichtsdia staan tijdens het werken.':'Toon de redenering nadat leerlingen hun antwoord hebben gegeven.');
}
check(false);check(true);overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 7: Bioscoop Nova en StreamNow',{target:true});
 line(s,'Gebruik TO = P × Q. Alle gegevens die je nodig hebt staan hier.',187,{size:35});
 table(s,[['Aanbieder en periode','P oud','P nieuw','Q oud','Q nieuw','Ev'],['Bioscoop Nova\nper week','€ 10','€ 12','500','420','−0,8'],['StreamNow\nper maand','€ 20','€ 22','1.000','800','−2,0']],60,307,1480,323,[440,208,208,208,208,208],32);
 line(s,'Bij beide aanbieders stijgt P en daalt Q.',726,{size:40,bold:true,color:C.blue});
 notes(s,'50','Begin de bespreking nadat leerlingen de doelopgave hebben geprobeerd. Dit zijn alle oorspronkelijke gegevens van opgave 7. Nova: P van 10 naar 12, Q van 500 naar 420 per week, Ev min 0,8. StreamNow: P van 20 naar 22, Q van 1000 naar 800 per maand, Ev min 2,0. De tekst is als tabel herschikt zonder gegevens toe te voegen. De volgende twee dia’s tonen alle zes vragen zonder uitwerking.','Welke verschillende perioden staan in de gegevens?','Vergelijk elk bedrijf met zijn eigen oude situatie. Nova en StreamNow hebben verschillende perioden.','Toon vragen a tot en met d.',{target:true});
}
{
 const s=slide('Opgave 7: vragen a tot en met d',{target:true});
 const qs=[['a','Bereken voor Bioscoop Nova TO vóór en na de prijsverhoging. (2 punten)'],['b','Bereken de procentuele verandering van TO bij Bioscoop Nova en verbind die uitkomst met Ev = −0,8. (2 punten)'],['c','Bereken voor StreamNow TO vóór en na de prijsverhoging. (2 punten)'],['d','Bereken de procentuele verandering van TO bij StreamNow en verbind die uitkomst met Ev = −2. (2 punten)']];
 qs.forEach(([n,q],i)=>{text(s,n+')',60,197+i*155,75,65,39,{bold:true,color:C.blue});text(s,q,155,197+i*155,1380,135,37);});
 notes(s,'50','Laat de vier reken- en verklaringsvragen volledig lezen. a en c vragen oude en nieuwe TO. b en d vragen procenten en een verbinding met Ev. Geef op deze dia nog geen oplossingen.','Welke vraag vraagt naast rekenen ook om een verklaring?','Een elasticiteitslabel zonder verbinding met de gemeten omzet is onvolledig.','Toon e en f voordat de eerste uitwerking verschijnt.',{target:true});
}
{
 const s=slide('Opgave 7: vragen e en f',{target:true});
 text(s,'e)',60,206,75,65,40,{bold:true,color:C.blue});
 text(s,'Formuleer de lokale omzetregel voor een kleine prijsstijging bij prijsinelastische\nen bij prijselastische vraag. Leg uit waarom je bij een grote, eindige verandering\naltijd TO vóór en na berekent. (2 punten)',155,206,1380,246,39);
 text(s,'f)',60,572,75,65,40,{bold:true,color:C.blue});
 text(s,'Leg uit waarom uit deze omzetgegevens niet volgt dat de winst stijgt. (1 punt)',155,572,1380,146,39);
 notes(s,'50','Dit zijn de volledige vragen e en f. Nu zijn alle vragen beschikbaar zonder oplossingen. e bevat twee gevraagde onderdelen: de lokale regel en de reden om een eindige verandering direct te berekenen. f vraagt naar de ontbrekende kostengegevens.','Uit hoeveel onderdelen bestaat vraag e?','Een losse formule TO = P × Q beantwoordt nog niet waarom de lokale regel begrensd is.','Begin de uitwerking met a: de twee omzetbedragen van Nova.',{target:true});
}
function targetAmounts(n,company,P,Q,period){
 const s=slide(`Opgave 7${n}: ${company}, omzet vóór en na`,{target:true});
 line(s,'TO = P × Q',193,{size:45,bold:true,color:C.blue});
 table(s,[['Situatie','Invullen','TO (€ per '+period+')'],['Oud',`${P[0]} × ${Q[0]}`,company==='Nova'?'5.000':'20.000'],['Nieuw',`${P[1]} × ${Q[1]}`,company==='Nova'?'5.040':'17.600']],60,340,1480,310,[350,565,565],42);
 line(s,company==='Nova'?'Controle: € 40 meer omzet per week.':'Controle: € 2.400 minder omzet per maand.',738,{size:39,bold:true,color:company==='Nova'?C.green:C.orange});
 notes(s,'50',company==='Nova'?'TO oud = 10 × 500 = 5000 euro per week. TO nieuw = 12 × 420 = 5040 euro per week. Verschil: plus 40 euro per week. Gebruik beide keren de bijbehorende P en Q.':'TO oud = 20 × 1000 = 20000 euro per maand. TO nieuw = 22 × 800 = 17600 euro per maand. Verschil: min 2400 euro per maand.','Welke P en Q horen bij dezelfde situatie?','Nova is per week. StreamNow is per maand. Houd de juiste periode in het antwoord.','Zet het omzetverschil af tegen de oude omzet.',{target:true});
}
targetAmounts('a','Nova',[10,12],[500,420],'week');
{
 const s=slide('Opgave 7b: Nova, verandering en Ev',{target:true});
 line(s,'%ΔTO = (TO nieuw − TO oud) / TO oud × 100%',189,{size:39});
 line(s,'= (5.040 − 5.000) / 5.000 × 100% = +0,8%',306,{size:45,bold:true,color:C.green});
 table(s,[['Prijsverandering','Hoeveelheidsverandering','Ev'],['+20%','−16%','−0,8']],60,466,1480,191,[493,493,494],34);
 line(s,'Prijsinelastisch: −1 < −0,8 < 0.',705,{size:37,bold:true,color:C.blue});
 line(s,'De relatief zwakke afzetdaling past hier bij de omzetstijging.',768,{size:34});
 notes(s,'50','Verschil 40 gedeeld door 5000 maal 100% = plus 0,8%. P stijgt 20% en Q daalt 16%. Ev = −16 / 20 = −0,8. De directe TO-berekening toont dat de hogere prijs de hoeveelheidsdaling in deze meting meer dan compenseert. De omzet stijgt met slechts 0,8%, niet met 4%.','Waarom is de omzetstijging geen 20% − 16% = 4%?','Het label prijsinelastisch alleen is geen bewijs voor een omzetstijging bij iedere grote stap.','Bereken vervolgens StreamNow.',{target:true});
}
targetAmounts('c','StreamNow',[20,22],['1.000',800],'maand');
{
 const s=slide('Opgave 7d: StreamNow, verandering en Ev',{target:true});
 line(s,'%ΔTO = (TO nieuw − TO oud) / TO oud × 100%',189,{size:39});
 line(s,'= (17.600 − 20.000) / 20.000 × 100% = −12%',306,{size:44,bold:true,color:C.orange});
 table(s,[['Prijsverandering','Hoeveelheidsverandering','Ev'],['+10%','−20%','−2']],60,466,1480,191,[493,493,494],34);
 line(s,'Prijselastisch: Ev < −1.',705,{size:37,bold:true,color:C.blue});
 line(s,'De relatief sterke afzetdaling past hier bij de omzetdaling.',768,{size:34});
 notes(s,'50','Verschil min 2400 gedeeld door de oude omzet 20000 maal 100% = min 12%. P stijgt 10% en Q daalt 20%. Ev = −20 / 10 = −2. De hoeveelheid reageert procentueel tweemaal zo sterk. Dat past bij de berekende omzetdaling.','Hoe controleer je het minteken van het antwoord?','De teller voor %ΔTO is min 2400. Deel door 20000, niet door 17600.','Formuleer de lokale regel en verklaar de grens ervan.',{target:true});
}
localRule(true);
{
 const s=slide('Opgave 7e: een grote, eindige verandering',{target:true});
 line(s,'Een gemeten Ev geldt niet automatisch bij elke prijs.',189,{size:39,bold:true,color:C.blue});
 line(s,'De omzetfactor is de prijsfactor × de hoeveelheidsfactor.',323,{size:37});
 table(s,[['Controle','Factoren','Omzetverandering'],['Nova','1,20 × 0,84 = 1,008','+0,8%'],['StreamNow','1,10 × 0,80 = 0,88','−12%']],60,459,1480,265,[370,650,460],35);
 notes(s,'50','Bij een grote stap vermenigvuldig je de twee veranderfactoren. Het gemeten Ev tussen twee prijzen is niet automatisch de lokale elasticiteit bij elke tussenliggende prijs. Daarom geeft een lokaal label geen universele garantie voor een eindige verandering. Bereken TO oud en TO nieuw rechtstreeks. Controle: Nova 1,008 maal 5000 = 5040, StreamNow 0,88 maal 20000 = 17600.','Waarom kan je voor de grote stap niet volstaan met de vuistregel?','Procentuele veranderingen simpel optellen geeft bij Nova plus 4% en bij StreamNow min 10%, beide onjuist.','Bepaal tot slot wat ontbreekt voor winst.',{target:true});
}
{
 const s=slide('Opgave 7f: de winst is nog onbekend',{target:true});
 line(s,'Winst = TO − TK',202,{size:60,bold:true,color:C.blue});
 table(s,[['Je kent','Je mist'],['TO oud en TO nieuw','TK oud en TK nieuw']],60,385,1480,213,[740,740],39);
 line(s,'Zonder kosten vóór en na volgt geen zekere winstverandering.',722,{size:40,bold:true,color:C.orange});
 notes(s,'50','Bij Nova stijgt de omzet, bij StreamNow daalt zij. Voor beide ontbreekt de verandering van de totale kosten. Zonder TK oud en TK nieuw kun je de winst niet vergelijken. Kosten kunnen tegelijkertijd veranderen. Laat leerlingen ontbrekende eenheden en verklaringen in hun eigen antwoord aanvullen.','Welke gegevens zou je bij beide aanbieders nog opvragen?','Meer omzet is niet automatisch meer winst. Ook minder omzet bewijst zonder kosten geen dalende winst.','Laat de laatste overzichtsdia staan en laat het huiswerk noteren.',{target:true});
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...sourceManifest,slides,overviewSlides:overviews,nativeTableSlides:tables,nativeChartSlides:charts},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[fileURLToPath(new URL('./presentation-222-chart-geometry.py',import.meta.url)),draft,'--fix']);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'2.2.2 Elasticiteit en omzet – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:p.slides.items.length,overviews,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
