// HOW TO ADAPT: derive the manifest, example and target from the current edition.
// Keep the single overview source and charts in economic coordinates. Runtime paths
// come from the installed presentation skill; see docs/workflows/classroom-presentation.md.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,PYTHON,SKILL,TOOLS,PLATFORM,workspace} from '../../presentations/runtime.mjs';

const spec=JSON.parse(await fs.readFile(new URL('./presentation-422.manifest.json',import.meta.url),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('422');
const lessonRoot=path.resolve(PLATFORM,'../4veco-lessen');
const hashes={};for(const f of spec.sources)hashes[f]=createHash('sha256').update(await fs.readFile(path.join(lessonRoot,spec.sourceRoot,f))).digest('hex');
const source=`https://github.com/meijer1973/4veco-lessen/blob/${spec.lessonCommit}/${spec.sourceRoot}`;
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',purple:'#7B2D8E',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',tables=[],charts=[],slides=[],graphs=[],overviews=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,64),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer='§4.2.2 Prijsdiscriminatie'){
 const s=p.slides.add();s.background.fill=C.paper;text(s,title,60,42,1480,80,50,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title});return s;
}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4 v3, gedrukte pagina ${page} van het complete leerlingenboek. ${source}output/Boek_4_Compleet_v3.pdf\nManuscript: ${source}chapters/4.2/4.2.2%20manuscript.md\nAntwoordmodel: ${source}chapters/4.2/Antwoorden.md#antwoord16\n${authored?'Uitlegvoorbeeld — niet uit het boek. Context Sterrenkoepel, functies en getallen zijn voor deze les gemaakt. Het boek onderbouwt uitsluitend de methode.':''}`);
}
function table(s,values,x,y,w,h,widths,size=34){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}
 tables.push(p.slides.items.length);return t;
}
function example(s){text(s,'Uitlegvoorbeeld — niet uit het boek · Sterrenkoepel',60,177,1480,43,28,{bold:true,color:C.blue});}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 16.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §4.2.2 Prijsdiscriminatie');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,40,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+(i+1)});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});text(s,'Voorwaarden herkennen; per groep\nQ en P kiezen; omzet, kosten, winst\nen de verdeling van surplus vergelijken.',972,242,565,128,30,{name:'overview-goals'});rule(s,972,381,568);
 text(s,'Startopdracht',972,400,565,45,35,{bold:true,color:active===2?C.blue:C.ink});text(s,'Pagina 66 · Opgaven 10 en 11\nVerkennen met de theorie:\n10: p. 64 · 11: p. 63',972,454,565,111,30,{bold:active===2,name:'overview-start'});rule(s,972,578,568);
 text(s,'Huiswerk',972,600,565,45,35,{bold:true,color:active===7?C.blue:C.ink});text(s,'§4.2.2 · Opgaven 12 t/m 16\nBasis: 12 en 13\nZelfstandig: 14 en 15\nDoelopgave: 16\nMaken en nakijken',972,655,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'63–69',`Laat het overzicht staan tijdens ${phase.toLowerCase()}. Start 10–11 op p. 66; basis 12 op p. 66 en 13 op p. 67; zelfstandig 14 op p. 67 en 15 op p. 68; doel 16 op p. 69. Huiswerk 12 t/m 16 maken en nakijken. Bonus 17 en herhaling 18 zijn extra. Start 10a herhaalt TO, TK en winst uit §4.1.4. Twee groepen als één bedrijf met één TCK is een nieuwe toepassing: verwijs voor 10b naar de formule en het kader op p. 64. Prijsdiscriminatie is nieuw bij 11: laat leerlingen de definitie en kostenwaarschuwing op p. 63 gebruiken. Dit is ondersteund verkennen, geen toets van beheerste nieuwe leerstof. Laat vóór basiswerk beide startvragen opnieuw bekijken en een twijfel verbeteren. De docent kan daarna de startantwoorden bespreken: 10 TO 520, TK 240, winst 280 euro per week; 11 alleen A. Geef die antwoorden niet vooraf. De handleiding reserveert voorlopig twee keer 55 minuten; de lesgrens is flexibel en de tijd is niet gemeten.`, 'Welke theoriepassage helpt bij je twijfel?', 'Gebruik de gedrukte boekpagina; hoofdstukpagina 14 heet in het complete boek 66. Laat de nieuwe toepassing geen onbedoelde voorkennistoets worden.',active===7?'Laat huiswerk en resterend werk in de agenda zetten.':'Volg de fase van de klas; rond zo nodig het oefenen in een volgende les af.');
}
function series(name,pts,color,width=3,labels=[]){return {name,xValues:pts.map(v=>Number(v[0].toFixed(8))),values:pts.map(v=>Number(v[1].toFixed(8))),line:{fill:color,width},marker:{symbol:'none'},dataLabelOverrides:labels.map(v=>({idx:v.idx,text:v.text,position:v.position||'t',showValue:false,showSeriesName:false,textStyle:{typeface:FONT,fontSize:26,fill:color,bold:true}}))};}
const E={id:'Sterrenkoepel',a:[54,30],b:2,c:6,xmax:30,ymax:60,step:12,cap:42};
const T={id:'FilmLab',a:[40,24],b:1,c:8,xmax:40,ymax:40,step:8,cap:64};
function panels(s,m,mode){
 for(let i=0;i<2;i++){
  const g=i?'B':'A',a=m.a[i],q=(a-m.c)/(2*m.b),pr=a-m.b*q;
  text(s,'Groep '+g,80+790*i,237,700,46,34,{bold:true});
  text(s,'P, MO en MK (€ per bezoek)',80+790*i,287,700,40,27);
  const v=[],demandLabelFraction=m.id==='FilmLab'?.55:.65;
  if(mode!=='base')v.push(series('guide Q',[[q,0],[q,mode==='price'?pr:m.c]],C.muted,1.5));
  if(mode==='price')v.push(series('guide P',[[0,pr],[q,pr]],C.muted,1.5,[{idx:1,text:`P_${g} = ${pr}`,position:'t'}]));
  v.push(series('Vraag / GO',[[0,a],[a/m.b*demandLabelFraction,a*(1-demandLabelFraction)],[a/m.b,0]],C.blue,4,[{idx:1,text:'Vraag',position:'r'}]));
  const mo=series('MO',[[0,a],[a/(2*m.b)*.5,a*.5],[a/(2*m.b),0]],C.purple,3,[{idx:1,text:'MO',position:'l'}]);mo.line.style='dashed';v.push(mo);
  v.push(series('MK',[[0,m.c],[m.xmax*.87,m.c],[m.xmax,m.c]],C.orange,3,[{idx:1,text:'MK',position:'t'}]));
  const chart=s.charts.add('scatter',{position:{left:60+790*i,top:330,width:705,height:407},series:v,scatterOptions:{style:'line'},hasLegend:false,xAxis:{min:0,max:m.xmax,majorUnit:m.xmax===40?10:6,numberFormatCode:'0',textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:null},yAxis:{min:0,max:m.ymax,majorUnit:m.step,numberFormatCode:'0',textStyle:{typeface:FONT,fontSize:25,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:C.paper,plotAreaFill:C.paper});
  applyPresentationChartFont(chart,{fontFamily:FONT});charts.push(p.slides.items.length);graphs.push({slide:p.slides.items.length,group:g,model:m,mode,series:v});
  text(s,`Q_${g} (bezoeken per week)`,90+790*i,744,655,43,27,{align:'center'});
  if(mode!=='base')text(s,mode==='price'?`Q_${g} = ${q}  →  P_${g} = € ${pr}`:`MO_${g} = MK  →  Q_${g} = ${q}`,90+790*i,790,655,44,31,{bold:true,color:C.blue,align:'center'});
 }
}

overview('Startopdracht',2);
{
 const s=slide('Wanneer is het prijsdiscriminatie?');
 text(s,'Dezelfde dienst · andere prijs · geen verklaring in de kosten',60,191,1480,104,39,{bold:true,color:C.blue});
 table(s,[['Voorbeeld','Wat verschilt?'],['Dezelfde toegang, korting met een persoonlijke pas','Alleen het tarief'],['Een bezoek inclusief een extra workshop','De dienst is uitgebreider'],['Een bestelling met betaalde bezorging','Bezorging kost extra']],60,337,1480,337,[1020,460],34);
 text(s,'Controleer eerst het product en de kosten.',60,752,1480,65,40,{bold:true});
 notes(s,'63','Prijsdiscriminatie betekent verschillende prijzen voor dezelfde dienst zonder dat een verschil in kosten dat verklaart. De drie korte situaties zijn zelfgemaakte herkenningsvoorbeelden. De eerste kan prijsdiscriminatie zijn; de andere twee leveren daarvoor geen voldoende bewijs. De klantnaam of een kortingssticker alleen bewijst niets.','Welke vergelijking moet je maken vóór je het woord prijsdiscriminatie gebruikt?','Een hogere prijs voor een ander product is niet automatisch prijsdiscriminatie.','Bekijk of de aanbieder de verschillende tarieven kan uitvoeren.');
}
{
 const s=slide('Drie voorwaarden voor groepsprijzen');
 [['1','Marktmacht','De aanbieder kan de prijs beïnvloeden.'],['2','Groepen scheiden','Herkenbare groepen verschillen in betalingsbereidheid of prijsgevoeligheid.'],['3','Doorverkoop beperken','Een goedkope persoonlijke pas kan niet naar de dure groep.']].forEach((r,i)=>{let y=206+i*196;text(s,r[0],60,y,90,70,48,{bold:true,color:C.blue});text(s,r[1],176,y,485,65,39,{bold:true});text(s,r[2],720,y,810,122,37);if(i<2)rule(s,176,y+155,1364);});
 notes(s,'63','Alle drie voorwaarden zijn nodig. Een persoonlijk gecontroleerd toegangsbewijs helpt groepen te scheiden en doorverkoop te voorkomen. Marktmacht geeft ruimte voor een eigen prijs. Verschil in vraag maakt verschillende tarieven interessant. Een sticker student of volwassene toont niet op zichzelf een elasticiteit aan.','Wat gebeurt er als iedereen zonder controle de goedkope pas kan kopen?','Groepen een naam geven is niet hetzelfde als groepen werkelijk gescheiden houden.','Pas de bekende monopoliemethode toe op twee afzonderlijke vragen.');
}
{
 const s=slide('Sterrenkoepel: twee groepen, één bedrijf');example(s);
 text(s,'Dezelfde toegang; gecontroleerde persoonlijke passen.\nDe aanbieder heeft marktmacht. Doorverkoop is onmogelijk.',60,245,1480,110,36);
 table(s,[['Vraag per groep','Kosten van het bedrijf'],['P_A = 54 − 2Q_A','MK = € 6 per bezoek'],['P_B = 30 − 2Q_B','TCK = € 72 per week']],60,390,1480,245,[740,740],36);
 text(s,'P: € per bezoek · Q: bezoeken per week\n0 ≤ Q_A ≤ 27 · 0 ≤ Q_B ≤ 15 · capaciteit: 42 bezoeken',60,679,1480,93,31);
 text(s,'Constante MK en genoeg capaciteit → per groep apart kiezen',60,785,1480,49,31,{bold:true,color:C.blue});
 notes(s,'64–65','Dit is het eigen uitlegvoorbeeld. Beide groepen gebruiken dezelfde dienst tegen dezelfde kosten. Constante gemeenschappelijke MK en een capaciteit van 42 maken afzonderlijk optimaliseren mogelijk. Er zijn geen externe effecten; vraag en kosten blijven in de latere vergelijking gelijk. De domeinen volgen uit niet-negatieve prijzen. De groepsgrenzen zijn geen extra productiecapaciteit.','Waarom kun je hier dezelfde MK gebruiken bij beide groepen?','Bij MK die afhangt van de totale afzet of een bindende gezamenlijke capaciteit zijn de twee keuzes niet onafhankelijk.','Stel voor elke groep TO en MO op.',true);
}
{
 const s=slide('Per groep van vraag naar marginale opbrengst');example(s);
 table(s,[['Stap','Groep A','Groep B'],['Vraag / GO','P_A = 54 − 2Q_A','P_B = 30 − 2Q_B'],['TO = P × Q','54Q_A − 2Q_A²','30Q_B − 2Q_B²'],['MO = afgeleide van TO','54 − 4Q_A','30 − 4Q_B']],60,273,1480,391,[510,485,485],34);
 text(s,'MO = MK → hoeveelheid → prijs op de eigen vraaglijn',60,735,1480,83,40,{bold:true,color:C.blue});
 notes(s,'64; voorkennis p. 32–33','Herhaal de route uit §4.1.4: vermenigvuldig P met Q en differentieer TO. Bij een lineaire vraag P = a − bQ wordt MO = a − 2bQ. Leg in woorden uit dat een prijsverlaging ook geldt voor eerdere verkochte bezoeken binnen dezelfde groep. Daarom ligt MO onder de prijs. Elke groep heeft één uniforme prijs.','Waarom wordt de coëfficiënt van Q in MO vier?','MO is niet de vraag en niet de verkoopprijs. De intercept blijft gelijk; de helling verdubbelt.','Kies eerst de hoeveelheden bij MK = 6.',true);
}
{
 const s=slide('Kies de hoeveelheid met MO = MK');example(s);panels(s,E,'quantity');
 notes(s,'64','Groep A: 54 − 4Q_A = 6 → 48 = 4Q_A → Q_A = 12. Groep B: 30 − 4Q_B = 6 → 24 = 4Q_B → Q_B = 6. Hoeveelheden zijn bezoeken per week. MO daalt in beide groepen van boven naar onder MK; vóór het snijpunt verhoogt extra afzet de winst en erna verlaagt die de winst. Samen 18 ≤ 42, dus haalbaar. Beide panelen hebben dezelfde asschalen.','Wat bepaalt het snijpunt: de prijs of de hoeveelheid?','De € 6 aan het snijpunt is MO en MK, niet de prijs van een toegangsbewijs.','Ga bij dezelfde hoeveelheden omhoog naar de eigen vraaglijn.',true);
}
{
 const s=slide('Lees de prijs op de eigen vraaglijn');example(s);panels(s,E,'price');
 notes(s,'64','Houd de gekozen hoeveelheid vast. A: P_A = 54 − 2 × 12 = 30 euro per bezoek. B: P_B = 30 − 2 × 6 = 18 euro per bezoek. Controleer door terug te substitueren in de vraag. De panelen gebruiken exact dezelfde schaal als de vorige dia; alleen de prijsgidsen zijn toegevoegd.','Waar lees je P af nadat je Q hebt gekozen?','Lees niet P_A af op de vraaglijn van B. Ook bij twee groepen geldt per groep P > MO = MK.','Vergelijk de groepsprijzen met een gegeven gemeenschappelijke prijs.',true);
}
{
 const s=slide('Vergelijk de omzet bij één en twee prijzen');example(s);
 text(s,'Gegeven vergelijkingsprijs: € 24 per bezoek voor beide groepen',60,242,1480,92,35,{bold:true});
 table(s,[['Per week','Eén prijs','Groepsprijzen'],['A: prijs × bezoeken','24 × 15 = € 360','30 × 12 = € 360'],['B: prijs × bezoeken','24 × 3 = € 72','18 × 6 = € 108'],['Totale omzet','€ 432','€ 468'],['Totale afzet','15 + 3 = 18','12 + 6 = 18']],60,365,1480,386,[480,500,500],33);
 text(s,'De omzet stijgt € 36; de totale afzet blijft 18.',60,781,1480,49,34,{bold:true,color:C.blue});
 notes(s,'64–65','De gemeenschappelijke prijs van 24 is gegeven. Los de vraagfuncties op: 24 = 54 − 2Q_A geeft Q_A = 15; 24 = 30 − 2Q_B geeft Q_B = 3. Tel de groepsomzetten op, niet de prijzen. In beide situaties zijn er 18 bezoeken, maar ze zijn anders verdeeld. Gebruik deze eigen getallen om de werkwijze te leren, niet een toegewezen opgave.','Hoe vind je de afzet als de gemeenschappelijke prijs al gegeven is?','Tel geen prijzen op tot een zogenaamde totaalprijs. TO is de som van P maal Q per groep.','Trek alle kosten één keer af.',true);
}
{
 const s=slide('Gezamenlijke vaste kosten tel je eenmaal');example(s);
 text(s,'TK = 72 + 6 × (Q_A + Q_B)',60,246,1480,80,48,{bold:true,color:C.blue});
 table(s,[['€ per week','Eén prijs','Groepsprijzen'],['TO','432','468'],['TVK = 6 × 18','108','108'],['TK = 72 + 108','180','180'],['Winst = TO − TK','252','288']],60,370,1480,363,[680,400,400],34);
 text(s,'Winst stijgt € 36. Dezelfde TCK blijft € 72.',60,781,1480,49,35,{bold:true});
 notes(s,'64–65','De extra omzet komt hier geheel in de winst terecht doordat de totale afzet en kosten gelijk blijven. Trek de gezamenlijke 72 niet bij elke groep afzonderlijk af. Totale kosten bevatten naast TCK ook TVK. Een berekening TO − TCK laat variabele kosten weg.','Waarom verandert TK hier niet door de groepsprijzen?','Constante MK betekent niet dat TK constant is; hier is juist de totale hoeveelheid gelijk.','Bekijk nu de gevolgen voor de kopers.',true);
}
{
 const s=slide('De kopers profiteren niet allemaal');example(s);
 table(s,[['Per groep','Eén prijs → groepsprijs','CS: driehoek boven de prijs'],['A','€ 24 → € 30\n15 → 12 bezoeken','½ × 15 × 30 = € 225\n½ × 12 × 24 = € 144'],['B','€ 24 → € 18\n3 → 6 bezoeken','½ × 3 × 6 = € 9\n½ × 6 × 12 = € 36']],60,269,1480,351,[280,525,675],33);
 text(s,'A: −€ 81     B: +€ 27     Totaal CS: −€ 54 per week',60,695,1480,74,39,{bold:true,color:C.blue});
 text(s,'CS samen: € 234 → € 180 per week',60,782,1480,49,34);
 notes(s,'65; voorkennis p. 55–57','Herhaal CS als de driehoek onder vraag en boven de betaalde prijs tot de verkochte hoeveelheid. De hoogte is het prijsintercept minus de prijs: A eerst 54 − 24 = 30 en daarna 54 − 30 = 24. B eerst 30 − 24 = 6 en daarna 30 − 18 = 12. A verliest 81 en B wint 27 euro, samen een daling van 54. Bespreek de prijs en de afzet van beide groepen afzonderlijk.','Waarom zegt korting voor B niets over het voordeel van A?','Gebruik voor de driehoek niet MK als ondergrens; CS gaat over betalingsbereidheid boven de prijs.','Tel het producentenvoordeel bij CS op.',true);
}
{
 const s=slide('Winst en totaal surplus zijn andere uitkomsten');example(s);
 text(s,'PS = TO − TVK     Winst = PS − TCK     TS = CS + PS',60,245,1480,79,36,{bold:true,color:C.blue});
 table(s,[['€ per week','Eén prijs','Groepsprijzen'],['CS','234','180'],['PS','432 − 108 = 324','468 − 108 = 360'],['TS = CS + PS','558','540'],['Winst = PS − 72','252','288']],60,366,1480,365,[580,450,450],33);
 text(s,'Winst: +€ 36     Totaal surplus: −€ 18 per week',60,781,1480,49,37,{bold:true,color:C.orange});
 notes(s,'65; voorkennis p. 55','PS laat de constante kosten nog buiten beschouwing. Trek daarom voor winst de 72 af van PS, niet nogmaals van TS in deze definitie. TS daalt ondanks gelijke afzet: de bezoeken zijn anders over A en B verdeeld. Vraag en kosten veranderen niet en er zijn geen externe effecten; TCK is in beide situaties hetzelfde. Dit voorbeeld levert een uitkomst voor dit geval, geen algemene wet dat prijsdiscriminatie altijd TS verlaagt.','Waarom is een winststijging op zichzelf geen welvaartsbewijs?','Gebruik in TS het producentensurplus, niet de winst. Een constant totaal aantal transacties garandeert geen gelijk TS.','Leg de verschillen tussen groepen uit zonder etiketten te gebruiken.',true);
}
{
 const s=slide('Prijsgevoeligheid vraagt gegevens over gedrag');
 const items=[['Goede alternatieven','Kopers kunnen gemakkelijker uitwijken.'],['Sterke reactie op de prijs','Een hoger tarief kan relatief veel kopers kosten.'],['Lager tarief kan lonen','Beoordeel dit met de vraag en kosten uit de bron.']];
 items.forEach((r,i)=>{const y=210+i*177;text(s,r[0],60,y,620,65,38,{bold:true,color:C.blue});text(s,r[1],755,y,775,120,37);if(i<2)rule(s,60,y+141,1480);});
 text(s,'Een groepsnaam of alleen een lijnhelling bewijst geen elasticiteit.',60,775,1480,60,32,{bold:true});
 notes(s,'68','Prijsgevoeligheid gaat over reacties, niet over de groepsnaam. Een groep met meer goede alternatieven kan sterker afhaken bij een prijsverhoging. Gebruik brongegevens om dit te onderbouwen. Dezelfde helling kan bij verschillende P en Q samengaan met andere procentuele reacties. Leid geen nieuwe elasticiteitsformule af. Voor de oefenvragen gebruiken we de gegeven vraagfuncties.','Welke informatie heb je nodig om prijsgevoeligheid te onderbouwen?','Studenten zijn niet per definitie in iedere context de prijsgevoeligste groep.','Controleer kort de drie stappen van de berekening.');
}
for(const reveal of [false,true]){
 const s=slide(reveal?'Controle: hoeveelheid, prijs en welvaart':'Korte controle vóór het oefenen');example(s);
 const items=reveal?[['Q_A = 12','Uit 54 − 4Q_A = 6.'],['P_A = € 30','Uit de vraag: 54 − 2 × 12.'],['Meer winst, minder TS','Winst +€ 36; TS −€ 18 per week.']]:[['MO_A = 6','Is dit ook de verkoopprijs?'],['Twee klantgroepen','Hoe vaak trek je de gezamenlijke TCK af?'],['De winst stijgt','Wat controleer je voor een\nwelvaartsconclusie?']];
 items.forEach((r,i)=>{const y=258+i*170;text(s,r[0],60,y,640,90,39,{bold:true,color:C.blue});text(s,r[1],755,y,775,119,37);if(i<2)rule(s,60,y+143,1480);});
 if(reveal)text(s,'Bekijk nu je startantwoorden bij 10 en 11 opnieuw.',60,783,1480,49,32,{bold:true});
 notes(s,'63–65',reveal?'Antwoorden: MO is niet P; lees P op de eigen vraag. TCK eenmaal voor het hele bedrijf. Controleer CS en PS en dus TS, met dezelfde aannames. Laat de klas nu 10b en 11 opnieuw beantwoorden met wat net is uitgelegd; bespreek alleen daarna de eerder gemaakte startvragen.':'Laat leerlingen kort denken en mondeling antwoorden voordat je de volgende dia toont. Dit is een controle op het eigen uitlegvoorbeeld, geen extra huiswerkopgave.','Welke stap zou je in je eigen werk extra controleren?','Een juist eindgetal zonder juiste grootheid of eenheid is onvoldoende.',reveal?'Laat het overzicht staan tijdens basis, zelfstandig werk en doelopgave.':'Onthul de antwoorden na de reacties.',true);
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 16 · FilmLab: bron A','§4.2.2 · Doelopgave 16 · Boekpagina 69');
 text(s,'FilmLab biedt dezelfde toegangsdienst aan A en B.\nHet heeft marktmacht.',60,192,1480,125,40,{bold:true});
 text(s,'De passen zijn persoonlijk; groepen worden gecontroleerd\nen doorverkoop is onmogelijk.',60,358,1480,122,39);
 table(s,[['Gegeven','Voor beide groepen samen'],['Marginale kosten','€ 8 voor elk bezoek'],['Totale constante kosten','€ 80 per week'],['Capaciteit','64 bezoeken']],60,539,1480,272,[670,810],35);
 notes(s,'69','Dit is de daadwerkelijke bron A van doelopgave 16, opgesplitst over deze en de volgende dia. De bespreking volgt op eigen werk. Toon eerst beide bronnen, de basisfiguur en alle vijf deelvragen zonder oplossing. De TCK geldt gezamenlijk.','Welke informatie gaat over de uitvoerbaarheid van verschillende tarieven?','De context en gegevens zijn nu FilmLab, niet meer Sterrenkoepel.','Toon de vraagfuncties en de nog niet ingevulde figuur.');
}
{
 const s=slide('Opgave 16 · Vraagfuncties en basisfiguur','§4.2.2 · Doelopgave 16 · Bron A · Boekpagina 69');
 text(s,'P_A = 40 − Q_A · 0 ≤ Q_A ≤ 40      P_B = 24 − Q_B · 0 ≤ Q_B ≤ 24',60,179,1480,45,31,{bold:true,color:C.blue});panels(s,T,'base');
 notes(s,'69','De figuur is figuur 10 uit het boek, opnieuw opgebouwd als twee bewerkbare XY-grafieken met dezelfde vraag-, MO- en MK-lijnen en schaal. P, MO en MK zijn euro per bezoek; Q_A en Q_B zijn bezoeken per week. De doelhoeveelheden en prijzen zijn nog niet gemarkeerd. De domeinen van de vraag zijn 0–40 en 0–24. De gezamenlijke capaciteit is 64.','Waar hoort straks de prijs van iedere groep?','Dit is geen oplossingsfiguur. Toon nog geen keuze of prijspunt.','Toon bron B met de gemeenschappelijke prijs en het gegeven CS.');
}
{
 const s=slide('Opgave 16 · Bron B: de vergelijking','§4.2.2 · Doelopgave 16 · Boekpagina 69');
 table(s,[['Gegeven','Eén prijs','Groepsprijzen'],['Prijs per bezoek','€ 20 voor A en B','Afzonderlijk winstmaximaal'],['Afzet A / afzet B','20 / 4 bezoeken per week','Te berekenen'],['Totale CS per week','€ 208','€ 160']],60,223,1480,373,[540,440,500],33);
 text(s,'De vraag en kosten veranderen niet. Er zijn geen externe effecten.',60,654,1480,95,37,{bold:true});
 text(s,'Gebruik beide bronnen. Je hoeft de gemeenschappelijke prijs\nvan € 20 niet opnieuw te bepalen.',60,758,1480,79,31);
 notes(s,'69','Deze gegevens zijn bron B uit het boek. De twee CS-bedragen zijn gegeven, geen voortijdige uitwerking. De overige uitkomsten komen pas na de vragendia’s. Alle vergelijkingen gaan over dezelfde week en dezelfde vraag en kosten.','Welk bedrag hoef je niet met een optimalisatie opnieuw te bepalen?','Het CS van 160 geldt bij de afzonderlijk winstmaximale groepsprijzen, niet bij willekeurige twee prijzen.','Toon eerst deelvragen a, b en c.');
}
{
 const s=slide('Opgave 16 · Deelvragen a, b en c','§4.2.2 · Doelopgave 16 · Boekpagina 69');
 const r=[['a · 3p','Bereken per groep MO, de winstmaximale hoeveelheid en de groepsprijs.'],['b · 3p','Bereken TO en winst bij één prijs en bij de groepsprijzen.'],['c · 2p','Welke groep betaalt meer en welke minder? Noem één noodzakelijke voorwaarde uit bron A.']];
 r.forEach((a,i)=>{let y=211+i*202;text(s,a[0],60,y,210,65,39,{bold:true,color:C.blue});text(s,a[1],316,y,1220,136,39);if(i<2)rule(s,60,y+167,1480);});
 notes(s,'69','Deelvragen a, b en c zijn volledig weergegeven. Laat leerlingen hun gemaakte werk erbij nemen, maar onthul nog geen antwoorden. Ook d en e moeten eerst beschikbaar zijn.','Welke verschillende grootheden vraagt a?', 'Een prijs is geen hoeveelheid en omzet is geen winst.','Toon ook d en e vóór de eerste uitwerking.');
}
{
 const s=slide('Opgave 16 · Deelvragen d en e','§4.2.2 · Doelopgave 16 · Boekpagina 69');
 text(s,'d · 3p',60,226,210,65,39,{bold:true,color:C.blue});text(s,'Bereken met bron B PS en TS in beide situaties. Is de hogere winst hier ook een hogere totale welvaart?',316,226,1220,180,40);rule(s,60,462,1480);
 text(s,'e · 2p',60,524,210,65,39,{bold:true,color:C.blue});text(s,'Waarom bewijst deze ene case niet dat prijsdiscriminatie altijd welvaart verlaagt?',316,524,1220,174,40);
 notes(s,'69','Deelvragen d en e zijn volledig weergegeven. Alle context, brondata, figuur en vijf vragen zijn nu getoond zonder uitwerking. Maak bij het bespreken onderscheid tussen het rekenoordeel in deze case en een algemene conclusie.','Wat is het verschil tussen de conclusies die d en e vragen?','Een negatief resultaat in één bronmodel is geen algemene economische wet.','Begin bij MO en de winstmaximale hoeveelheden.');
}
{
 const s=slide('16a · Bereken de winstmaximale hoeveelheden','§4.2.2 · FilmLab · Boekpagina 69');
 table(s,[['Stap','Groep A','Groep B'],['TO = P × Q','40Q_A − Q_A²','24Q_B − Q_B²'],['MO','40 − 2Q_A','24 − 2Q_B'],['MO = MK','40 − 2Q_A = 8','24 − 2Q_B = 8'],['Oplossen','32 = 2Q_A → Q_A = 16','16 = 2Q_B → Q_B = 8']],60,222,1480,424,[400,540,540],33);
 text(s,'MO daalt door MK heen: vóór de keuze MO > MK; erna MO < MK.',60,701,1480,81,34,{bold:true,color:C.blue});
 text(s,'Samen 16 + 8 = 24 bezoeken per week ≤ capaciteit 64.',60,786,1480,48,34);
 notes(s,'69','Dit volgt het antwoordmodel 16a. Laat de algebra en de betekenis van het snijpunt zien. Bij A ligt MO op Q = 15 nog op 10 en bij Q = 17 op 6; bij B geldt hetzelfde rond Q = 8. Beide MO-lijnen dalen door de constante MK = 8. Controleer de groepsdomeinen en gezamenlijke capaciteit: 24 ≤ 64.','Waarom is het snijpunt hier een maximum en geen minimum?','MO = MK is eerst een kandidaat; het verloop en de capaciteit maken de controle af.','Vul de hoeveelheden in op de eigen vraaglijn.');
}
{
 const s=slide('16a · Lees en controleer de groepsprijzen','§4.2.2 · FilmLab · Boekpagina 69');
 text(s,'P_A = 40 − 16 = € 24      P_B = 24 − 8 = € 16 per bezoek',60,181,1480,52,35,{bold:true,color:C.blue});panels(s,T,'price');
 notes(s,'69','De prijspunten horen op de eigen vraaglijn: (16,24) en (8,16). De € 8 van MO = MK is geen verkoopprijs. De functies en schalen zijn gelijk aan de basisfiguur. De totaalhoeveelheid is 24 bezoeken per week. Controle: bij P_A = 24 vraagt A 16 bezoeken en bij P_B = 16 vraagt B 8 bezoeken.','Welke stap voorkomt dat je € 8 als tarief kiest?','De constante kosten beïnvloeden hier de winsthoogte, niet de vergelijking van MO en MK.','Bereken TO, TK en winst in beide situaties.');
}
{
 const s=slide('16b · Omzet, kosten en winst vergelijken','§4.2.2 · FilmLab · Boekpagina 69');
 table(s,[['Per week','Eén prijs: € 20','Groepsprijzen'],['Totale afzet','20 + 4 = 24','16 + 8 = 24'],['TO','20 × 24 = € 480','24 × 16 + 16 × 8 = € 512'],['TVK','8 × 24 = € 192','8 × 24 = € 192'],['TK = TCK + TVK','80 + 192 = € 272','80 + 192 = € 272'],['Winst = TO − TK','480 − 272 = € 208','512 − 272 = € 240']],60,214,1480,475,[470,455,555],31);
 text(s,'Winst stijgt € 32 per week. De gezamenlijke TCK telt eenmaal.',60,753,1480,81,37,{bold:true,color:C.blue});
 notes(s,'69','Eén prijs: de bron geeft 20 en 4 bezoeken, samen 24. Bij de groepsprijzen is TO 384 + 128 = 512. Beide situaties hebben TVK 192 en TK 272. Winst is 208 respectievelijk 240 euro per week. Geef rekenregels, invulling en eenheden.','Waarom zijn de kosten in beide kolommen gelijk?','Trek 80 niet bij beide groepen af en vergeet ook de variabele kosten niet.','Vergelijk de tarieven per klantgroep.');
}
{
 const s=slide('16c · A betaalt meer, B betaalt minder','§4.2.2 · FilmLab · Boekpagina 69');
 table(s,[['Prijs per bezoek','Eén prijs','Groepsprijzen','Verschil'],['Groep A','€ 20','€ 24','€ 4 meer'],['Groep B','€ 20','€ 16','€ 4 minder']],60,228,1480,293,[520,320,320,320],36);
 text(s,'Eén noodzakelijke voorwaarde uit bron A:',60,595,1480,65,38,{bold:true,color:C.blue});
 text(s,'De gecontroleerde persoonlijke passen houden groepen\ngescheiden en voorkomen doorverkoop.',60,691,1480,134,40);
 notes(s,'69','A betaalt 24 in plaats van 20; B 16 in plaats van 20. Als genoemde voorwaarde volstaat bijvoorbeeld gecontroleerde persoonlijke passen tegen doorverkoop. Ook de genoemde marktmacht is een relevante noodzakelijke voorwaarde. Een hogere prijs bij A gaat samen met minder afzet; een lagere prijs bij B met meer.','Welke bronzin maakt de aparte tarieven uitvoerbaar?','Een korting voor B betekent niet dat iedereen korting krijgt.','Bereken PS en TS met de CS-bedragen uit bron B.');
}
{
 const s=slide('16d · Meer winst, maar minder totaal surplus','§4.2.2 · FilmLab · Boekpagina 69');
 text(s,'PS = TO − TVK     TS = CS + PS',60,197,1480,72,41,{bold:true,color:C.blue});
 table(s,[['€ per week','Eén prijs','Groepsprijzen'],['CS (bron B)','208','160'],['PS = TO − TVK','480 − 192 = 288','512 − 192 = 320'],['TS = CS + PS','208 + 288 = 496','160 + 320 = 480']],60,329,1480,336,[500,490,490],34);
 text(s,'ΔTS = −48 + 32 = −€ 16 per week',60,708,1480,65,43,{bold:true,color:C.orange});
 text(s,'Dus in deze case: winst +€ 32, totale welvaart lager.',60,788,1480,49,34,{bold:true});
 notes(s,'69','Dit zijn de bedragen uit antwoord 16d: PS 288 en 320; TS 496 en 480. Het CS daalt 48 en PS stijgt 32; het saldo is −16 euro per week. TCK blijft gelijk en er zijn geen externe effecten. Controleer winst = PS − 80: 208 en 240. De gelijke totale afzet zegt niet dat de verdeling van de bezoeken dezelfde waarde oplevert.','Welk deel van het CS-verlies wordt gecompenseerd door extra PS?','Vervang PS in de TS-som niet door winst. Meer winst is niet automatisch meer gezamenlijke welvaart.','Beperk de conclusie tot deze case.');
}
{
 const s=slide('16e · Eén case bewijst geen algemene richting','§4.2.2 · FilmLab · Boekpagina 69');
 text(s,'FilmLab: deze vraag, deze kosten en deze afzet',60,205,1480,82,41,{bold:true,color:C.blue});
 text(s,'In een andere situatie kan een lager groepstarief\nnieuwe kopers bereiken die anders niets kopen.',60,342,1480,137,42);rule(s,60,527,1480);
 text(s,'Dan kan de verandering van TS anders uitvallen.\nZonder die gegevens is de algemene richting niet bewezen.',60,585,1480,155,41,{bold:true});
 text(s,'Controleer je antwoord: winst → klantgroepen → begrensde welvaart.',60,787,1480,49,31);
 notes(s,'69','Het antwoordmodel noemt het bereiken van extra kopers als mogelijk mechanisme. Zeg kan, niet zal. Je hebt voor een ander geval opnieuw vraag, kosten, prijzen en afzet nodig. Ook een hoger TS zegt niet dat iedere groep wint of dat de verdeling eerlijk is. Laat leerlingen een ontbrekende rekenstap, eenheid of voorwaarde in hun eigen antwoorden a–e verbeteren.','Welke gegevens zou je voor een ander geval nodig hebben?','De mogelijkheid van een andere uitkomst bewijst die uitkomst nog niet.','Laat de identieke overzichtsdia staan voor afsluiting en huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({spec,sourceHashes:hashes,slides,overviewSlides:overviews,tables,charts,graphs},null,2));
const candidate=path.join(BUILD,'candidate.pptx');await (await PresentationFile.exportPptx(p)).save(candidate);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),candidate]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),candidate]);
// This runtime omits individual dLblPos on export. Preserve the intended native
// label positions explicitly: MO left; prices/demand right; MK above.
// Apply before validation; no chart values, objects or workbook data are changed.
execFileSync(PYTHON,['-c',`
from zipfile import ZipFile
from lxml import etree as E
import sys
f=sys.argv[1]
n={'c':'http://schemas.openxmlformats.org/drawingml/2006/chart','a':'http://schemas.openxmlformats.org/drawingml/2006/main'}
with ZipFile(f) as z: parts=[(i,z.read(i.filename)) for i in z.infolist()]
with ZipFile(f,'w') as z:
 for info,data in parts:
  if '/charts/' in info.filename and info.filename.endswith('.xml'):
   root=E.fromstring(data)
   for label in root.findall('.//c:dLbl',n):
    txt=''.join(label.xpath('.//a:t/text()',namespaces=n))
    pos=E.Element('{'+n['c']+'}dLblPos',val='l' if txt=='MO' else ('t' if txt=='MK' else 'r'))
    label.insert(list(label).index(label.find('c:showLegendKey',n)),pos)
   data=E.tostring(root,xml_declaration=True,encoding='UTF-8')
  z.writestr(info,data)
`,candidate]);
const finalPath=path.join(FINAL,spec.outputStem+'.pptx');
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath,pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:[...new Set(charts)],materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
