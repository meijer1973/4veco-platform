// HOW TO ADAPT: derive assignments and page numbers from the current book.
// Native scatter series carry curves, guides and revenue hatching in data coordinates.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';
const HERE=path.dirname(fileURLToPath(import.meta.url));
const M=JSON.parse(await fs.readFile(path.join(HERE,'presentation-333.manifest.json'),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('333');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#1A5276',green:'#1E7449',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',tables=[],charts=[],slides=[],overviewSlides=[],graphSpecs=[];
const source='https://github.com/meijer1973/4veco-lessen/blob/'+M.sourceCommit+'/'+M.sourceEditionPath+'/';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,role='teaching',footer='§3.3.3 Protectionisme'){
 const s=p.slides.add();s.background.fill=C.paper;text(s,title,60,42,1480,88,49,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1380,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});slides.push({number:p.slides.items.length,title,role});return s;
}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 3, actuele v3-uitgave met routeherziening 21 september en getekende-elasticiteitsrevisie 26 september 2026. Gedrukte boekpagina ${page}. ${source}output/Boek_3_Compleet_v3.pdf\nAntwoordmodel en docentenroute: ${source}chapters/3.3/Antwoorden.md en ${source}chapters/3.3/Docenteninformatie.md\n${authored?'Uitlegvoorbeeld — niet uit het boek. Zelf ontworpen markt voor fietslampen in Linde, per week. De geciteerde boekpagina onderbouwt de methode, niet de fictieve context of getallen.':''}`);
}
function table(s,v,x=60,y=265,w=1480,h=320,widths=[500,490,490],size=33){
 const t=s.tables.add({rows:v.length,columns:v[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values:v});t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<v.length;r++){t.rows[r].height=h/v.length;for(let c=0;c<v[0].length;c++){const a=t.getCell(r,c);a.fill=r===0?C.ink:(r%2?C.paper:C.pale);a.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:17,right:15,top:10,bottom:10}};}}
 tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift,\npen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 27.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §3.3.3 Protectionisme','overview');overviewSlides.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,110,1480,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+i});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+i});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Import en opbrengst berekenen.\nGevolgen per groep verklaren.\nHeffing en quotum vergelijken.',972,244,565,122,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,401,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 112 · Opgaven 21 en 22\n22: verkennen, theorie p. 108–109',972,458,565,103,30,{name:'overview-start',bold:active===2});rule(s,972,578,568);
 text(s,'Huiswerk',972,600,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§3.3.3 Protectionisme\nBasis: 23 en 24\nZelfstandig: 25 en 26\nDoelopgave: 27\nMaken en nakijken: 23–27',972,653,565,181,30,{name:'overview-homework',bold:active===7});
 notes(s,'108–115',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. Start 21–22 p.112, basis 23 p.112 en 24 p.113, zelfstandig 25–26 p.114, doel 27 p.115. Huiswerk: 23, 24, 25, 26 en 27 maken en nakijken. Bonus 28 en herhaling 29–30 zijn extra. Start 21 herhaalt t maal belaste hoeveelheid uit §3.1.2, p.14. Start 22 gebruikt import = Qv − Qa uit §3.3.2, p.98, maar koppelt dit voor het eerst aan invoerheffing en een opbrengstrechthoek. Laat daarvoor p.108–109 lezen en de belastbare eenheden aanwijzen. Geen onaangekondigde beheersingstoets. Bij terugkeer vóór het basiswerk: laat 22 opnieuw proberen en bespreek welke eenheden belast zijn. De volledige route heeft geen aangetoonde eenlesfit. De handleiding reserveert voorlopig twee lessen van 55 minuten; verplaats de lesgrens of voltooi als huiswerk.`,active===2?'Welke eenheden zijn volgens de bron belast?':'Welke stap vraagt nog uitleg?','Alle verkopen tellen als import, of de startpoging als bewezen beheersing behandelen.','Ga door naar de volgende fase wanneer de klas eraan toe is.');return s;
}
function example(s){text(s,'Uitlegvoorbeeld — niet uit het boek',60,180,1480,46,30,{bold:true,color:C.blue});}
const E={id:'example',unit:'fietslampen',single:'fietslamp',a:50,b:.5,c:10,d:.5,pw:18,t:4,xmax:100,ymax:60,xstep:20,ystep:10};
const T={id:'target',unit:'rugzakken',single:'rugzak',a:80,b:.5,c:0,d:.5,pw:20,t:10,xmax:160,ymax:80,xstep:20,ystep:10};
function graph(s,m,stage){
 const series=[];const add=(name,x,y,color,style='solid',width=3)=>series.push({name,xValues:x,values:y,line:{fill:color,width,style},marker:{symbol:'none'}});
 const pe=(m.a*m.d+m.c*m.b)/(m.b+m.d),qe=(m.a-m.c)/(m.b+m.d),price=stage==='no-import'?pe:m.pw+m.t;
 const qa=(price-m.c)/m.d,qv=(m.a-price)/m.b;
 if(stage==='revenue'){for(let v=m.pw+.4;v<price;v+=.65)add('Arcering opbrengst',[qa,qv],[Number(v.toFixed(4)),Number(v.toFixed(4))],'#D8A255','solid',2);}
 add('V',[0,m.xmax],[m.a,m.a-m.b*m.xmax],C.blue,'solid',4);
 const end=Math.min(m.xmax,(m.ymax-m.c)/m.d);add('A',[0,end],[m.c,m.c+m.d*end],C.green,'solid',4);
 add('Pw',[0,m.xmax],[m.pw,m.pw],C.muted,'dashed',2);
 if(stage!=='free')add('Pw + t',[0,m.xmax],[m.pw+m.t,m.pw+m.t],C.orange,'dashed',3);
 const showQ=stage==='free'?[[(m.pw-m.c)/m.d,m.pw],[(m.a-m.pw)/m.b,m.pw]]:stage==='given'?[]:[[qa,price],[qv,price]];
 for(const [q,v]of showQ)add('Aflezen Q = '+q,[q,q],[0,v],C.line,'dashed',2);
 // Separate two-point edges avoid PowerPoint smoothing a closed scatter series.
 if(stage==='revenue'){
  add('Opbrengst ondergrens',[qa,qv],[m.pw,m.pw],C.orange,'solid',3);
  add('Opbrengst bovengrens',[qa,qv],[price,price],C.orange,'solid',3);
  add('Opbrengst linkergrens',[qa,qa],[m.pw,price],C.orange,'solid',3);
  add('Opbrengst rechtergrens',[qv,qv],[m.pw,price],C.orange,'solid',3);
 }
 if(stage==='no-import')add('Binnenlandse evenwichtsprijs',[0,qe],[pe,pe],C.ink,'dotted',3);
 // Use the authoring API's full position names, not OOXML's t/b/l codes.
 function label(name,x,y,color=C.ink,position='top',mark=false){series.push({name,xValues:[x],values:[y],line:{fill:'none',width:0},marker:{symbol:mark?'circle':'none',size:8,fill:color,line:{fill:color,width:1}},dataLabelOverrides:[{idx:0,text:name,position,showValue:false,textStyle:{typeface:FONT,fontSize:25,fill:color,bold:true}}]});}
 label('V',m.xmax*.18,m.a-m.b*m.xmax*.18+m.ymax*.025,C.blue);label('A',end*.92,m.c+m.d*end*.92-m.ymax*.025,C.green,'bottom');
 // Labels are offset from their lines, while the actual price series stays exact.
 label('Pw = '+m.pw,m.xmax*.84,m.pw-m.ymax*.045,C.muted,'right');
 if(stage!=='free')label('Pw + t = '+(m.pw+m.t),m.xmax*.79,m.pw+m.t+m.ymax*.045,C.orange,'right');
 if(stage==='no-import')label('E',qe,pe,C.ink,'bottom',true);
 for(const a of series){a.xValues=a.xValues.map(v=>Number(v.toFixed(6)));a.values=a.values.map(v=>Number(v.toFixed(6)));}
 const ch=s.charts.add('scatter',{position:{left:60,top:254,width:1010,height:565},series,scatterOptions:{style:'line'},hasLegend:false,
 xAxis:{min:0,max:m.xmax,majorUnit:m.xstep,numberFormatCode:'0',title:{text:'Q ('+m.unit+' per week)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}},
 yAxis:{min:0,max:m.ymax,majorUnit:m.ystep,numberFormatCode:'0',title:{text:'P (€ per '+m.single+')',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphSpecs.push({slide:p.slides.items.length,model:m,stage,qa,qv,price,qe,pe});return ch;
}
function side(s,top,middle,bottom){text(s,top,1120,273,420,140,35,{bold:true,color:C.blue});text(s,middle,1120,451,420,174,34);text(s,bottom,1120,663,420,145,32,{bold:true,color:C.orange});}
function target(t,role='target-answer'){return slide(t,role,'§3.3.3 Protectionisme · Opgave 27 · Boekpagina 115');}

overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const rows=[['Rekenen','Import en heffingsopbrengst, met eenheden.'],['Tekenen','De juiste opbrengstrechthoek in de marktgrafiek.'],['Verklaren','Gevolgen voor kopers, producenten en overheid.'],['Beoordelen','Een beleidsdoel, het quotum en de grens zonder import.']];
 rows.forEach((r,i)=>{text(s,r[0],60,213+i*142,360,65,40,{bold:true,color:C.blue});text(s,r[1],470,213+i*142,1070,102,38);});
 notes(s,'107–110','Deze doelen ondersteunen 23–27. Haal twee bekende relaties mondeling op: import = verbruik min binnenlandse productie (§3.3.2 p.98); opbrengst = bedrag per eenheid maal belaste eenheden (§3.1.2 p.14). De nieuwe stap is welke eenheden bij een invoerheffing belast zijn.','Hoe controleer je import met productie en verbruik?','Import en verbruik zijn verschillende hoeveelheden.','Vergelijk de twee instrumenten.');
}
{
 const s=slide('Protectionisme: bescherming tegen buitenlandse concurrentie');
 table(s,[['Instrument','Hoe werkt het?'],['Invoerheffing','Een bedrag per ingevoerd product'],['Importquotum','Een maximum aan invoer per periode']],60,227,1480,317,[580,900],35);
 text(s,'Doel uit de bron: bijvoorbeeld meer binnenlandse productie.',60,605,1480,83,38,{bold:true,color:C.blue});
 text(s,'De gevolgen verschillen per groep.',60,726,1480,70,42,{bold:true});
 notes(s,'107, 110','Protectionisme beschermt binnenlandse producenten door buitenlandse concurrentie te beperken. Een bron kan ook leveringszekerheid of tijdelijke aanpassing als doel noemen. Bepaal eerst het doel, dan mechanisme en effecten. Een productiequotum begrenst binnenlandse productie; een importquotum de invoer.','Is een hoeveelheid invoer hetzelfde als een bedrag aan belasting?','Een bereikt doel is geen bewijs dat iedereen profiteert.','Gebruik een eigen markt om de berekening te zien.');
}
{
 const s=slide('Fietslampen in Linde');example(s);
 table(s,[['Gegeven','Situatie per week'],['Wereldmarktprijs','€ 18 per fietslamp'],['Nieuwe invoerheffing','€ 4 per ingevoerde fietslamp'],['Beleidsdoel','Meer binnenlandse productie']],60,250,1480,341,[570,910],35);
 text(s,'Klein prijsnemend land, veel concurrerende aanbieders, gelijkwaardige lampen.\nGeen transportkosten, wisselkoersverandering of effecten op derden.',60,636,1480,127,33);
 text(s,'Importeurs dragen de heffing af. Er blijft import.',60,778,1480,48,33,{bold:true,color:C.blue});
 notes(s,'97, 107–109','Eigen voorbeeld. Vraag P = 50 − 0,5Q, aanbod P = 10 + 0,5Q. P in euro per lamp, Q in lampen per week. De grafieken geven de lijnen; functies oplossen is geen extra leerdoel. Binnenlands evenwicht is Q=40 en P=30. Buitenlands aanbod is beschikbaar tegen de gegeven wereldprijs. Alleen de aanname van vrije invoer verandert.','Verandert dit kleine land de wereldmarktprijs?','Buitenlandse en binnenlandse producenten ontvangen na de maatregel niet hetzelfde netto bedrag.','Lees eerst de vrije invoer.',true);
}
{
 const s=slide('Vrije invoer: verbruik, productie en import');example(s);graph(s,E,'free');side(s,'P = € 18 per lamp','Qa = 16 per week\nQv = 64 per week','Import = 64 − 16\n= 48 lampen per week');
 notes(s,'97–98','Eigen voorbeeld. Volg P=18 eerst naar A: binnenlandse productie 16. Daarna naar V: verbruik 64. Het horizontale verschil 48 wordt ingevoerd. Controle 16+48=64. Dit is de eerder geleerde leeswijze uit §3.3.2.','Welke hoeveelheid leveren binnenlandse producenten?','Zet vraag gelijk aan aanbod alleen bij de markt zonder handel, niet bij de gegeven lagere wereldprijs.','Voeg de invoerheffing toe op dezelfde assen.',true);
}
{
 const s=slide('De invoerheffing verhoogt de binnenlandse prijs');example(s);graph(s,E,'tariff');side(s,'P = Pw + heffing\n= 18 + 4 = € 22','Qa = 24 per week\nQv = 56 per week','A en V blijven staan.\nDe wereldprijs blijft € 18.');
 notes(s,'108','Zolang import plaatsvindt, is de binnenlandse prijs de gegeven wereldprijs plus heffing. Importeurs betalen 18 aan de buitenlandse verkoper en dragen 4 aan de overheid af. Binnenlandse producenten ontvangen ook 22, maar dragen deze invoerheffing niet af over hun eigen productie. Langs A neemt productie toe van 16 naar 24; langs V daalt verbruik van 64 naar 56.','Verschuift de binnenlandse aanbodlijn hier?','Behandel de invoerheffing niet als een algemene belasting op alle binnenlandse verkoop.','Bepaal nu de resterende import.',true);
}
{
 const s=slide('Alleen de resterende import is belast');example(s);
 text(s,'Import na de heffing = Qv − Qa',60,275,1480,65,44,{bold:true,color:C.blue});
 text(s,'56 − 24 = 32 fietslampen per week',60,370,1480,68,45,{bold:true});
 text(s,'Heffingsopbrengst = heffing × import na de heffing',60,520,1480,69,39,{bold:true,color:C.orange});
 text(s,'€ 4 per lamp × 32 lampen per week = € 128 per week',60,620,1480,115,41,{bold:true});
 text(s,'Controle: 24 binnenlandse lampen + 32 importlampen = 56 lampen.',60,769,1480,56,32);
 notes(s,'109, 111','Gebruik de hoeveelheden ná invoering. De 56 verkochte lampen bestaan uit 24 binnenlandse en 32 ingevoerde. Alleen die 32 zijn belast. De opbrengst gaat naar de overheid, niet naar de binnenlandse producent.','Waarom vermenigvuldigen we niet met 56 of met de oude import van 48?','Een tarief per eenheid is geen totale opbrengst.','Vertaal dezelfde berekening naar een rechthoek.',true);
}
{
 const s=slide('De opbrengstrechthoek');example(s);graph(s,E,'revenue');side(s,'Breedte: 56 − 24\n= 32 lampen per week','Hoogte: 22 − 18\n= € 4 per lamp','Oppervlakte:\n32 × 4 = € 128\nper week');
 notes(s,'109, 111','Begin bij Qa=24 en eindig bij Qv=56. De ondergrens is Pw=18 en de bovengrens de binnenlandse prijs 22. Arceer alleen dat gebied. De horizontale arcering is in dezelfde gegevenscoördinaten getekend als de lijnen. Laat een leerling grenzen en eenheden aanwijzen.','Waarom begint de rechthoek niet bij Q=0?','Opbrengst is een rechthoek en is niet hetzelfde als welvaartsverlies.','Vergelijk de groepen.',true);
}
{
 const s=slide('Wie merkt de hogere prijs?');example(s);
 table(s,[['Groep','Gevolg in Linde'],['Binnenlandse producenten','Prijs € 18 naar € 22; productie 16 naar 24'],['Binnenlandse kopers','Prijs € 18 naar € 22; verbruik 64 naar 56'],['Overheid','Ontvangt € 128 per week']],60,265,1480,371,[525,955],33);
 text(s,'CS daalt. PS stijgt. Overheidsontvangsten tellen mee.',60,689,1480,62,36,{bold:true});
 text(s,'Het binnenlandse totale surplus daalt in dit model.',60,773,1480,58,35,{bold:true,color:C.orange});
 notes(s,'109','Het productiedoel wordt ondersteund, maar kopers verliezen. CS betekent voordeel voor kopers; PS voordeel voor producenten vóór aftrek van vaste kosten. Onder deze kleine-landaannames compenseren PS-winst en overheidsontvangsten het CS-verlies niet volledig. Opbrengst verhuist, welvaartsverlies ontstaat door duurdere binnenlandse productie en wegvallend verbruik. Leveringszekerheid is niet automatisch in deze surplusmaat verwerkt.','Welke gegevens ondersteunen het productiedoel?','Een hoger PS is niet automatisch een grotere winst van dezelfde omvang of een voordeel voor iedereen.','Vergelijk nu een quotum met gratis vergunningen.',true);
}
{
 const s=slide('Een quotum begrenst de invoer');example(s);
 table(s,[['Bij dezelfde resterende import','Heffing','Quotum'],['Invoer per week','32 lampen','Maximaal 32 lampen'],['Regeling','€ 4 per importlamp','Gratis vergunningen, geen heffing'],['Overheidsontvangsten','€ 128 per week','€ 0 uit deze regeling']],60,262,1480,389,[640,390,450],31);
 text(s,'De vergunningregeling bepaalt of de overheid inkomsten krijgt.',60,730,1480,92,38,{bold:true,color:C.blue});
 notes(s,'110–111','In dezelfde markt kan een bindend quotum dezelfde importhoeveelheid opleveren. Gratis vergunningen en geen heffing geven echter geen ontvangsten uit deze regeling. Als vergunningen worden verkocht of geveild, moet dat expliciet in de bron staan. Berekening van quotumrente is hier geen leerdoel.','Welke informatie over vergunningen staat in de bron?','Een importquotum begrenst niet de binnenlandse productie en levert niet vanzelf belastingopbrengst op.','Onderzoek de grens van de prijsregel.',true);
}
{
 const s=slide('Een hoge heffing kan de import stoppen');example(s);graph(s,{...E,t:16},'no-import');side(s,'Andere heffing:\n€ 16 per importlamp','Importprijs: € 34\nBinnenlands evenwicht:\nP = € 30; Q = 40','Import = 0\nOpbrengst = 16 × 0\n= € 0 per week');
 notes(s,'110','Nieuwe situatie met dezelfde markt, maar heffing 16 in plaats van 4. De binnenlandse markt voorziet al bij 30 in 40 lampen. Import tegen 34 is niet nodig. Gebruik daarom niet mechanisch Pw+t als marktprijs. Buitenlandse prijs blijft 18. Bij tarief 12 bereikt de importprijs al 30 en is het importverschil nul. We tekenen geen exportuitkomst: de wereldprijs blijft lager.','Welke prijs vind je als binnenlandse vraag en aanbod elkaar ontmoeten?','De heffing is geen garantie dat de winkelprijs altijd met het hele tarief stijgt.','Keer terug naar een situatie waarin wél import blijft.',true);
}
{
 const s=slide('Wereldprijs en heffing kunnen tegelijk veranderen');example(s);
 text(s,'Terug naar t = € 4. V en A blijven gelijk. Elke situatie houdt import.',60,248,1480,77,34,{bold:true});
 table(s,[['Situatie','Pw','Heffing','Binnenlandse prijs'],['Begin','€ 18','€ 4','€ 22'],['Alleen Pw lager','€ 16','€ 4','€ 20'],['Alleen heffing hoger','€ 18','€ 6','€ 24'],['Beide veranderingen','€ 16','€ 6','€ 22']],60,354,1480,341,[550,250,270,410],32);
 text(s,'Vergelijk elke rij met het begin. Bij beide blijft de import gelijk.',60,756,1480,75,36,{bold:true,color:C.blue});
 notes(s,'108, 113','Ondersteun de werkwijze voor basis 24 met andere context en getallen. Splits de twee veranderingen: bij alleen Pw lager daalt P, stijgt Qv en daalt Qa, dus stijgt import. Alleen hoger tarief werkt andersom. Bij beide blijft P22, dus Qa24 en Qv56 en import32. Dit is geen uitwerking van de toegewezen notitieboekenopgave.','Wat gebeurt met import als alleen de wereldprijs daalt?','Een hogere heffing betekent niet zeker een hogere binnenlandse prijs als Pw tegelijk verandert.','Controleer of leerlingen de voorwaarde en grondslag zelf kunnen aanwijzen.',true);
}
{
 const s=slide('Korte controle');example(s);
 text(s,'Een leerling rekent in Linde:',60,270,1480,68,41);
 text(s,'“€ 4 × 56 = € 224 per week voor de overheid.”',60,378,1480,100,46,{bold:true,color:C.blue});
 text(s,'Welke hoeveelheid hoort in de berekening?\nLeg uit waarom.',60,562,1480,134,43,{bold:true});
 notes(s,'109','Dit is een check op het eigen uitlegvoorbeeld, geen huiswerkopgave. Laat leerlingen eerst zelf reageren. Gewenst: 32 importlampen, want 24 van de 56 zijn binnenlands geproduceerd. Pas na de antwoorden bevestigen: 4×32=128 euro per week.','Waar staan de 24 binnenlandse lampen in deze fout?','De binnenlandse prijs geldt voor alle producten, maar de invoerheffing alleen voor import.','Herneem start 22 en laat daarna het overzicht staan tijdens het basiswerk.',true);
}
overview('Zelfstandig werken',4);
{
 const s=target('Opgave 27: Schoolrugzakken in Daro','target-question');
 text(s,'Daro is klein en prijsnemend. Er zijn veel concurrerende aanbieders van\ngelijkwaardige rugzakken. Transportkosten en effecten op derden ontbreken.',60,212,1480,126,36);
 text(s,'De wereldprijs is € 20. Daro heft € 10 per ingevoerde rugzak,\nafgedragen door importeurs. Er blijft import.',60,380,1480,115,38,{bold:true,color:C.blue});
 text(s,'De minister wil meer binnenlandse productie. Winkeliers vrezen\nhogere prijzen voor scholieren.',60,542,1480,113,37);
 text(s,'Een alternatief is een quotum met gratis vergunningen, zonder heffing.',60,714,1480,104,37,{bold:true});
 notes(s,'115','Volledige lesbron uit de actuele doelopgave 27. Leerlingen hebben deze zelfstandig geprobeerd. Toon eerst alle brongegevens, tabel, figuur en deelvragen op de komende drie dia’s. Bespreek nog geen oplossingen.','Welk doel noemt de minister en wie uit zorg?','Importeurs dragen af; dat zegt nog niet wie economisch voordeel of nadeel heeft.','Toon de gegeven tabel.');
}
{
 const s=target('Opgave 27: de gegeven hoeveelheden','target-question');
 table(s,[['Situatie','Prijs per rugzak','Verbruik per week','Productie per week'],['Vrije invoer','€ 20','120','40'],['Met heffing','€ 30','100','60']],60,271,1480,300,[410,350,360,360],34);
 text(s,'Hoeveelheden in rugzakken. Gebruik de lesbron, tabel en figuur 6.',60,660,1480,105,37,{bold:true,color:C.blue});
 notes(s,'115','Alle gegeven waarden zijn identiek aan het boek. Import staat nog niet ingevuld en de opbrengst ontbreekt bewust. De volgende dia toont de gegeven figuur en vragen a–b.','Welke rij hoort bij de situatie na invoering?','De beginhoeveelheid gebruiken voor de opbrengst na de maatregel.','Toon figuur 6 en de eerste twee vragen.');
}
{
 const s=target('Opgave 27a–b: berekening en figuur 6','target-question');graph(s,T,'given');
 text(s,'a. (3p) Bereken de import na de heffing en de heffingsopbrengst per week.',1120,249,420,221,33,{bold:true});
 text(s,'b. (2p) Arceer in figuur 6 de heffingsopbrengst. Benoem de breedte en hoogte met eenheid.',1120,515,420,277,33,{bold:true});
 notes(s,'115','Figuur 6 opnieuw opgebouwd als bewerkbare XY-grafiek met dezelfde lijnen, asschalen en prijzen: V van (0,80) naar (160,0), A van (0,0) naar (160,80), prijzen 20 en 30. Dit zijn gegeven lijnen, geen extra op te lossen functies. Tekst bij de oorspronkelijke figuur: De lijnen en prijzen zijn gegeven. Teken alleen de gevraagde opbrengstrechthoek; niet opnieuw de markt. Geen oplossing zichtbaar.','Welke gegevens uit de tabel herken je in de figuur?','Vraag b vraagt het gebied, niet opnieuw de hele markt tekenen.','Laat ook c, d en e zien vóór de eerste oplossing.');
}
{
 const s=target('Opgave 27c–e: gevolgen en beleidsdoel','target-question');
 text(s,'c. (2p) Leg met gegevens uit waarom binnenlandse producenten\nen kopers verschillend worden geraakt.',60,231,1480,137,39,{bold:true});
 text(s,'d. (2p) Beoordeel: “Het productiedoel wordt bereikt, dus de\nmaatregel is voor iedereen gunstig.”',60,428,1480,140,39,{bold:true});
 text(s,'e. (2p) Waarom levert het beschreven alternatieve quotum\nniet dezelfde overheidsopbrengst op?',60,636,1480,134,39,{bold:true});
 notes(s,'115','Nu zijn volledige context, tabel, figuur en alle vijf deelvragen aangeboden zonder oplossingen. Geef denktijd en laat leerlingen hun eigen antwoord erbij houden.','Welke brongegevens heb je voor een oordeel per groep nodig?','Een politiek doel verwarren met een totaal oordeel over alle groepen.','Begin de gezamenlijke uitwerking bij a.');
}
{
 const s=target('27a: import en heffingsopbrengst');
 text(s,'Import na de heffing = Qv − Qa',60,223,1480,71,44,{bold:true,color:C.blue});
 text(s,'100 − 60 = 40 rugzakken per week',60,328,1480,78,47,{bold:true});
 text(s,'Opbrengst = heffing per rugzak × resterende import',60,480,1480,75,39,{bold:true,color:C.orange});
 text(s,'€ 10 × 40 = € 400 per week',60,587,1480,82,48,{bold:true});
 text(s,'Controle: 60 binnenlands + 40 import = 100 verbruik per week.',60,751,1480,77,34);
 notes(s,'115','Antwoord 27a: eerst 100−60=40 rugzakken per week. Dan 10 euro per rugzak maal 40 rugzakken per week =400 euro per week. De heffing rust alleen op resterende import. Het antwoordmodel kent 3 punten toe; benoem de twee rekenstappen en de eenheden.','Waarom hoort 100 niet rechtstreeks in de vermenigvuldiging?','Over de eigen productie van 60 rugzakken wordt deze invoerheffing niet afgedragen.','Laat dezelfde bedragen als een rechthoek zien.');
}
{
 const s=target('27b: de opbrengstrechthoek');graph(s,T,'revenue');side(s,'Breedte: 100 − 60\n= 40 rugzakken\nper week','Hoogte: 30 − 20\n= € 10 per rugzak','40 × 10 = € 400\nper week');
 notes(s,'115','Antwoord 27b: arceer vanaf Q=60 tot Q=100 en vanaf P20 tot P30. De ondergrens is wereldprijs, de bovengrens binnenlandse prijs. De rechthoek is niet de hele verkoop en geen verliesdriehoek. Vergelijk eigen tekening met de vier grenzen.','Welke eenheid krijgt de oppervlakte?','De prijs 30 als hoogte gebruiken in plaats van het prijsverschil 10.','Verklaar de verandering per groep.');
}
{
 const s=target('27c: producenten en kopers');
 table(s,[['Binnenlandse groep','Prijs per rugzak','Hoeveelheid per week'],['Producenten','€ 20 wordt € 30','40 wordt 60'],['Kopers','€ 20 wordt € 30','120 wordt 100']],60,256,1480,310,[520,480,480],34);
 text(s,'Een hogere prijs stimuleert aanbod en remt vraag.',60,637,1480,83,41,{bold:true,color:C.blue});
 text(s,'Producenten krijgen meer per rugzak. Scholieren betalen meer.',60,753,1480,80,35);
 notes(s,'115','Antwoord 27c bevat gegevens plus de economische reden. Producenten ontvangen een hogere prijs en breiden uit. Kopers betalen dezelfde hogere binnenlandse prijs en gebruiken minder. Die tegengestelde reacties verlopen langs ongewijzigde lijnen.','Welke gegevens tonen dat het nadeel van scholieren niet verdwijnt?','Van een hogere productie automatisch naar hogere banen of landelijke welvaart springen.','Beoordeel de uitspraak van d met dit onderscheid.');
}
{
 const s=target('27d: productiedoel en voordeel voor iedereen');
 text(s,'“Het productiedoel wordt bereikt, dus de maatregel is voor iedereen gunstig.”',60,227,1480,142,42,{bold:true,color:C.blue});
 text(s,'Het productiedoel wordt ondersteund:\n40 wordt 60 rugzakken per week.',60,431,1480,139,41,{bold:true,color:C.green});
 text(s,'De conclusie over iedereen volgt niet:\nscholieren betalen € 30 in plaats van € 20.',60,638,1480,138,41,{bold:true,color:C.orange});
 notes(s,'115','Antwoord 27d: beoordeel beide delen apart. Er is bewijs voor meer binnenlandse productie. Dat bewijst niet dat de maatregel voor iedereen gunstig is, want kopers betalen meer. Een breder werkgelegenheidseffect staat niet in de bron. Vermijd de onjuiste omkering dat een nadeel voor kopers betekent dat geen doel bereikt wordt.','Welk woord in de conclusie gaat verder dan de gegevens?','Iedereen gelijkstellen aan binnenlandse producenten.','Vergelijk tot slot de inkomsten bij het quotum.');
}
{
 const s=target('27e: gratis vergunningen, geen heffing');
 table(s,[['Regeling','Betaling aan de overheid'],['Invoerheffing','€ 10 per ingevoerde rugzak'],['Beschreven importquotum','Gratis vergunningen, zonder heffing']],60,276,1480,310,[710,770],35);
 text(s,'Het quotum geeft geen vergelijkbare betaling per rugzak.\nDaarom ontvang je hier niet opnieuw € 400 per week.',60,676,1480,147,41,{bold:true,color:C.orange});
 notes(s,'115','Antwoord 27e: een hoeveelheidsgrens is geen belasting. De beschreven gratis vergunningen en afwezigheid van heffing leveren geen overeenkomstige ontvangsten op. Zelfs als import 40 blijft, is er geen tarief van 10 voor de overheid. Verkoop van vergunningen is een andere regeling en staat niet in deze bron. Laat leerlingen één ontbrekende stap of eenheid in hun eigen antwoorden verbeteren.','Welke woorden uit de bron beslissen dit antwoord?','Bij elke importbeperking dezelfde opbrengstrechthoek voor de overheid invullen.','Sluit af met het overzicht en noteer het huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'slide-manifest.json'),JSON.stringify({slides,overviewSlides,tables,charts,graphSpecs,source:M},null,2));
const draft=path.join(BUILD,'candidate.pptx');await(await PresentationFile.exportPptx(p)).save(draft);execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const r=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'3.3.3 Protectionisme – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,final:r.finalPath,layout:r.presentationLayout.findingCount,package:r.packageIntegrity.status,import:r.firstPartyImport.passed}));
