// HOW TO ADAPT: derive the assignment from the current edition; change the manifest,
// authored example and target together. Keep chart series in economic coordinates.
// Runtime discovery and finalization follow skills/econ-pptx-templates.md.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,PYTHON,SKILL,TOOLS,PLATFORM,workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('312');
const spec=JSON.parse(await fs.readFile(new URL('./presentation-312.manifest.json',import.meta.url),'utf8'));
const lessonRoot=path.resolve(PLATFORM,'../4veco-lessen');
const source=`https://github.com/meijer1973/4veco-lessen/blob/${spec.lessonCommit}/${spec.sourceRoot}`;
const hashes={};for(const f of spec.sources)hashes[f]=createHash('sha256').update(await fs.readFile(path.join(lessonRoot,spec.sourceRoot,f))).digest('hex');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',red:'#A3302A',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',tables=[],charts=[],slides=[],graphs=[],overviews=[];
const tag='Uitlegvoorbeeld — niet uit het boek';
const E={id:'notitieboekjes',a:20,b:.3,c:4,d:.1,t:4,q0:40,p0:8,qt:30,pc:11,pp:7,xmax:60,ymax:22,unit:'notitieboekjes per week',price:'€ per notitieboekje'};
const T={id:'tassen',a:20,b:.2,c:2,d:.1,t:3,q0:60,p0:8,qt:50,pc:10,pp:7,xmax:100,ymax:22,unit:'tassen per dag',price:'€ per tas'};
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,64),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer='§3.1.2 Belastingdruk en welvaartsverlies',titleSize=50){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,80,titleSize,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title});return s;
}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 3 v3, actuele editie; gedrukte pagina ${page} van het complete leerlingenboek. ${source}output/Boek_3_Compleet_v3.pdf\nAntwoordmodel: ${source}chapters/3.1/Antwoorden.md\n${authored?'Uitlegvoorbeeld — niet uit het boek. Context notitieboekjes, functies en gegevens zijn voor deze les gemaakt; de boekverwijzing onderbouwt alleen de werkwijze.':''}`);
}
function table(s,values,x,y,w,h,widths,size=34){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
 }}tables.push(p.slides.items.length);return t;
}
function example(s){text(s,tag+' · Notitieboekjes',60,175,1470,43,28,{bold:true,color:C.blue});}
function pointSeries(name,points,color,width=3,labels=[]){return {name,xValues:points.map(a=>Number(a[0].toFixed(8))),values:points.map(a=>Number(a[1].toFixed(8))),line:{fill:color,width},marker:{symbol:'none'},dataLabelOverrides:labels.map(({idx,text:label,position='r'})=>({idx,text:label,position,showValue:false,showSeriesName:false,textStyle:{typeface:FONT,fontSize:26,fill:color,bold:true}}))};}
// Hatching is native XY series, not a raster overlay: every endpoint has economic coordinates.
function regionSeries(name,vertices,color,direction='vertical',spacing=1.5){
 const out=[pointSeries(name+' boundary',[...vertices,vertices[0]],color,2.5)];
 const axis=direction==='vertical'?0:1,other=1-axis;
 const lo=Math.min(...vertices.map(v=>v[axis])),hi=Math.max(...vertices.map(v=>v[axis]));
 for(let v=lo+spacing;v<hi-1e-7;v+=spacing){const cross=[];
  for(let i=0;i<vertices.length;i++){const a=vertices[i],b=vertices[(i+1)%vertices.length];if((a[axis]<=v&&b[axis]>v)||(b[axis]<=v&&a[axis]>v))cross.push(a[other]+(b[other]-a[other])*(v-a[axis])/(b[axis]-a[axis]));}
  if(cross.length===2){const ends=cross.sort((a,b)=>a-b).map(z=>axis===0?[v,z]:[z,v]);out.push(pointSeries(name+' hatch',ends,color,1.3));}
 }return out;
}
function graph(s,m,{mode='new',areas=[],shift=false,wide=false}={}){
 const q=mode==='old'?m.q0:m.qt,pc=mode==='old'?m.p0:m.pc,pp=mode==='old'?m.p0:m.pp;
 const regions={CS:[[0,pc],[q,pc],[0,m.a]],PS:[[0,m.c],[q,pp],[0,pp]],O:[[0,m.pp],[m.qt,m.pp],[m.qt,m.pc],[0,m.pc]],W:[[m.qt,m.pp],[m.q0,m.p0],[m.qt,m.pc]]};
 const colors={CS:'#85B8D6',PS:'#68B39A',O:'#C48D28',W:'#C8554B'};
 let series=[];for(const r of areas)series.push(...regionSeries(r,regions[r],colors[r],r==='W'?'horizontal':'vertical',r==='W'?.25:m.xmax/45));
 if(mode!=='base'){
  series.push(pointSeries('guide Q',[[q,0],[q,pc]],C.muted,1.5,mode==='new'?[{idx:0,text:`Qt = ${q}`,position:'t'}]:[]));
  series.push(pointSeries('guide Pc',[[0,pc],[q,pc]],C.muted,1.5,mode==='new'?[{idx:1,text:`Pc = ${pc}`,position:'t'}]:[]));
  if(mode==='new')series.push(pointSeries('guide Pp',[[0,pp],[q,pp]],C.muted,1.5,[{idx:1,text:`Pp = ${pp}`,position:'b'}]));
  if(areas.includes('W'))series.push(pointSeries('guide Q0',[[m.q0,0],[m.q0,m.p0]],C.muted,1.5));
 }
 const xd=Math.min(m.xmax,m.a/m.b),xa=Math.min(m.xmax,(m.ymax-m.c)/m.d);
 series.push(pointSeries('V',[[0,m.a],[xd,m.a-m.b*xd]],C.blue,4,[{idx:1,text:'V',position:'t'}]));
 series.push(pointSeries('A',[[0,m.c],[xa,m.c+m.d*xa]],C.green,4,[{idx:1,text:'A',position:'t'}]));
 if(shift){const x=Math.min(m.xmax,(m.ymax-m.c-m.t)/m.d);series.push(pointSeries('A + t',[[0,m.c+m.t],[x,m.c+m.t+m.d*x]],C.orange,3,[{idx:1,text:'A + t',position:'t'}]));}
 const label=(label,x,y,color=C.ink)=>series.push({...pointSeries(label,[[x,y]],color,0,[{idx:0,text:label,position:'ctr'}]),line:{fill:'none',width:0}});
 if(areas.includes('CS'))label('CS',q*.24,pc+(m.a-pc)*.35,C.blue);
 if(areas.includes('PS'))label('PS',q*.24,m.c+(pp-m.c)*.68,C.green);
 if(areas.includes('O'))label('O',m.qt*.4,(m.pc+m.pp)/2,C.orange);
 if(areas.includes('W'))label('W',m.qt+(m.q0-m.qt)*.23,(m.pc+m.pp)/2,C.red);
 const cfg={position:{left:60,top:245,width:wide?1480:995,height:560},series,scatterOptions:{style:'line'},hasLegend:false,xAxis:{min:0,max:m.xmax,majorUnit:m.xmax===60?10:20,numberFormatCode:'0',title:{text:`Q (${m.unit})`,textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.4},majorGridlines:null},yAxis:{min:0,max:m.ymax,majorUnit:5,numberFormatCode:'0',title:{text:`P (${m.price})`,textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.4}},chartFill:C.paper,plotAreaFill:C.paper};
 const ch=s.charts.add('scatter',cfg);applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphs.push({slide:p.slides.items.length,market:m,mode,areas,regions:Object.fromEntries(areas.map(a=>[a,regions[a]])),series});
}
function side(s,heading,body,bottom='',color=C.blue){text(s,heading,1090,257,450,60,34,{bold:true,color});text(s,body,1090,343,450,310,34);if(bottom)text(s,bottom,1090,668,450,145,32,{bold:true,color});}
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
 const s=slide('Deze les: §3.1.2 Belastingdruk en welvaartsverlies',undefined,44);overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,40,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+(i+1)});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});text(s,'Belastingdruk verdelen;\nCS, PS, O en W berekenen en\nmarkeren; prijsgevoeligheid uitleggen.',972,244,565,128,30,{name:'overview-goals'});rule(s,972,386,568);
 text(s,'Startopdracht',972,409,565,45,35,{bold:true,color:active===2?C.blue:C.ink});text(s,'Pagina 18 · Opgaven 10 en 11\n11: verkennen, theorie p. 14–16',972,463,565,93,30,{bold:active===2,name:'overview-start'});rule(s,972,575,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});text(s,'§3.1.2 · Opgaven 12 t/m 16\nBasis: 12 en 13\nZelfstandig: 14 en 15\nDoelopgave: 16\nMaken en nakijken',972,654,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'14–21',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start 10–11: p. 18; basis 12–13: p. 19; zelfstandig 14–15: p. 20; doel 16: p. 21. Huiswerk 12, 13, 14, 15 en 16 maken en nakijken. Bonus 17 en herhaling 18 zijn extra. Voor start 10: haal de driehoeksoppervlakte op (½ × basis × hoogte); CS onder V boven P, PS boven A onder P. Dit is eerder onderwezen in Boek 2 §§2.3.1–2.3.2. Start 11 verkent nieuwe belastingboekhouding: laat leerlingen theorie p. 14–16 lezen, daar O en W aanwijzen en hun twijfel noteren. Verwacht dat onderscheid nog niet zonder steun. Keer vóór het basiswerk terug naar 11 en laat de redenering opnieuw geven. Antwoorden voor feedback na de poging: 10 CS €160, PS €80; geen tijdseenheid gegeven. 11 W €30, O €120 is overdracht. Docentadvies: reserveer voorlopig twee lessen van 55 minuten en extra uitloop, geen gemeten tijdsgarantie. Les 1 uitleg en basis; les 2 afronden, zelfstandig, doel en feedback. Schrap bij tijdgebrek geen onderdelen.`, 'Welke oppervlakte of geldstroom bedoel je?', 'Gebruik paginanummers van het complete boek; hoofdstukpagina 14 is boekpagina 18.',active===7?'Laat huiswerk noteren en eventuele resterende oefening plannen.':'Ga door met de uitleg; bij zelfstandig werken eerst opgave 11 opnieuw laten beredeneren.');return s;
}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const rows=[['Last per product','Je vergelijkt Pc en Pp met de oude prijs P₀.'],['Gebieden en bedragen','Je berekent en markeert CS, PS, O en W.'],['Prijsgevoeligheid','Je verklaart wie relatief meer belasting draagt.']];
 rows.forEach((a,i)=>{let y=224+i*173;text(s,a[0],60,y,545,75,40,{bold:true,color:C.blue});text(s,a[1],660,y,870,105,38);rule(s,60,y+130,1480);});
 text(s,'Doelopgave 16 · Bedrukte tassen: wie betaalt?',60,773,1480,57,35,{bold:true});
 notes(s,'14–18','Koppel de doelen aan 16a–e: bedragen per tas en procent, belastingopbrengst, oude en nieuwe surplusgebieden, markering en verklaring. De overheid telt mee in de nieuwe welvaartsmaat.','Welk bedrag hoort bij één product, welk bedrag bij de hele markt?','Last per stuk, totale belastingopbrengst en welvaartsverlies zijn verschillende grootheden.','Begin met de afzonderlijke markt voor notitieboekjes.');
}
{
 const s=slide('Notitieboekjes · de markt en de belasting');example(s);
 text(s,'Vraag: Pc = 20 − 0,30Q\nAanbod: Pp = 4 + 0,10Q',60,257,1480,140,46,{bold:true});
 table(s,[['Situatie','Hoeveelheid per week','Prijs per notitieboekje'],['Zonder belasting','Q₀ = 40','P₀ = € 8'],['Met t = € 4 per stuk','Qt = 30','Pc = € 11 · Pp = € 7']],60,453,1480,245,[475,490,515],33);
 text(s,'Veel kopers en verkopers; geen effecten voor buitenstaanders of uitvoeringskosten.',60,748,1480,80,31);
 notes(s,'14–18','Eigen uitlegvoorbeeld. Alle waarden staan op de dia zodat rekenen met surplus centraal staat. Controleer oud: 20−0,30Q=4+0,10Q geeft Q40 en P8. Nieuw: 20−0,30Q=8+0,10Q geeft Q30, Pc11 en Pp7. Q is notitieboekjes per week; prijzen zijn euro per boekje. Oorspronkelijk aanbod is hier MK. Andere omstandigheden blijven gelijk.','Wat betaal je als koper en wat ontvangt de verkoper na afdracht?','Pp is ontvangst vóór productiekosten, geen winst.','Haal eerst CS en PS zonder belasting op.',true);
}
{
 const s=slide('Surplus zonder belasting');example(s);graph(s,E,{mode:'old',areas:['CS','PS']});
 side(s,'½ × basis × hoogte','CS = ½ × 40 × (20 − 8)\n= € 240 per week\n\nPS = ½ × 40 × (8 − 4)\n= € 80 per week','Samen: € 320 per week');
 notes(s,'14–18','Herhaal de bewerking voor start 10 met andere gegevens. CS ligt onder V en boven P0; PS boven de oorspronkelijke A en onder P0. Hoogten zijn prijsverschillen, geen hoeveelheden. Eenheden: notitieboekjes per week × euro per boekje = euro per week.','Waar lees je de hoogte van de CS-driehoek af?','De prijs zelf is niet de hoogte van beide driehoeken.','Voeg de belasting toe en lees de twee prijzen bij dezelfde hoeveelheid.',true);
}
{
 const s=slide('De belastingwig bij dezelfde hoeveelheid');example(s);graph(s,E,{shift:true});
 side(s,'Qt = 30 per week','Pc = € 11 op V\nPp = € 7 op A\n\nPc − Pp = t\n11 − 7 = € 4','A + t: Pc = 8 + 0,10Q',C.orange);
 notes(s,'7–9, 14','Dit herhaalt de in §3.1.1 gedemonstreerde omzetting. A+t is aanbod in kopersprijzen; productiekosten veranderen niet. De oorspronkelijke A blijft de lijn voor de verkopersontvangst en MK. Markeer Pc en Pp bij Qt=30.','Waarom lees je Pp op de oorspronkelijke A?','Pc is niet oude prijs plus hele belasting.','Vergelijk beide nieuwe prijzen met P0=8.',true);
}
{
 const s=slide('De belastingdruk per notitieboekje');example(s);
 table(s,[['Wie draagt de last?','Verandering ten opzichte van P₀','Last per stuk'],['Koper','Pc − P₀ = 11 − 8','€ 3'],['Verkoper','P₀ − Pp = 8 − 7','€ 1']],60,270,1480,270,[430,720,330],34);
 text(s,'Afwentelingspercentage = (Pc − P₀) / t × 100%',60,602,1480,65,39,{bold:true,color:C.blue});text(s,'3 / 4 × 100% = 75%',60,700,920,80,50,{bold:true});text(s,'Controle: € 3 + € 1 = € 4',1030,710,500,90,32,{bold:true});
 notes(s,'14','Koper betaalt 3 euro meer; verkoper ontvangt 1 euro minder per werkelijk verkocht boekje. De belasting per stuk is de som. 75% is het afwentelingspercentage; verkopers dragen 25%. Reken eerst het prijsverschil, deel daarna door t.','Waarom deel je door 4 en niet door 11?','Wie het bedrag overmaakt bepaalt niet automatisch wie de economische last draagt.','Bereken nu het resterende surplus bij de twee prijzen.',true);
}
{
 const s=slide('CS en PS met belasting');example(s);graph(s,E,{areas:['CS','PS']});
 side(s,'Nieuwe driehoeken','CS = ½ × 30 × (20 − 11)\n= € 135 per week\n\nPS = ½ × 30 × (7 − 4)\n= € 45 per week','CS boven Pc; PS onder Pp');
 notes(s,'15, 18','Beide driehoeken gebruiken de verkochte hoeveelheid 30. CS gebruikt Pc11 als ondergrens, PS gebruikt Pp7 als bovengrens. De ruimte tussen de prijzen wordt nog apart behandeld.','Welke prijs hoort bij welke driehoek?','Gebruik P0 of één middenprijs niet voor het nieuwe surplus.','Vul de ruimte tussen Pc en Pp boven de verkochte hoeveelheid in.',true);
}
{
 const s=slide('Belastingopbrengst: de verkochte producten');example(s);graph(s,E,{areas:['O']});
 side(s,'O = t × Qt','O = 4 × 30\n= € 120 per week\n\nBreedte: 30 per week\nHoogte: € 4 per stuk','O: verticaal gearceerd',C.orange);
 notes(s,'14–16, 18','De rechthoek loopt van Q = 0 tot Q = 30 en tussen Pp7 en Pc11. De overheid ontvangt alleen belasting over de 30 transacties die plaatsvinden. Dit is een overdracht en telt mee in de gekozen welvaartsmaat.','Waarom is de breedte 30 en niet 40?','Belastingontvangsten zijn geen verdwenen geld. De besteding is niet gegeven.','Bekijk de transacties tussen 30 en 40 die wegvallen.',true);
}
{
 const s=slide('Welvaartsverlies: gemiste voordelige transacties');example(s);graph(s,E,{areas:['W']});
 side(s,'W = ½ × (Q₀ − Qt) × t','W = ½ × (40 − 30) × 4\n= € 20 per week\n\nBasis: 10 per week\nHoogte: € 4 per stuk','W: horizontaal gearceerd',C.red);
 notes(s,'15–16, 18','Tussen Qt30 en Q040 ligt V boven A. Rond Q35 is betalingsbereidheid 20−0,30×35=9,50 en MK4+0,10×35=7,50: mogelijk voordeel 2 euro. Dit overbrugt de belasting van 4 euro niet; die handel valt weg. Tel alle gemiste voordelen op: driehoek W. De formule geldt voor deze rechte lijnen zonder externe effecten.','Waarom hoort de basis bij de afname van Q?','W is niet de rechthoek over de verkochte hoeveelheid.','Controleer de driehoek met de oude en nieuwe welvaartsmaat.',true);
}
{
 const s=slide('De welvaartsrekening');example(s);
 table(s,[['Grootheid (€ per week)','Zonder belasting','Met belasting'],['CS','240','135'],['PS','80','45'],['O','0','120'],['CS + PS + O','320','300']],60,263,1480,378,[680,400,400],34);
 text(s,'W = 320 − (135 + 45 + 120) = € 20 per week',60,700,1480,77,44,{bold:true,color:C.red});
 notes(s,'14–18','Sommeer CS en PS voor belasting. Na belasting telt O erbij: 135+45+120=300. Verschil 320−300=20. Dit bevestigt de driehoeksuitkomst. Model: geen effecten voor buitenstaanders of uitvoeringskosten; latere overheidsbesteding onbekend.','Welke post ontbreekt als je alleen nieuw CS en PS optelt?','Nieuwe welvaartsmaat is niet alleen privaat surplus.','Onderscheid dit verlies van de daling van CS plus PS.',true);
}
{
 const s=slide('Drie verschillende bedragen');example(s);
 table(s,[['Betekenis','Berekening','Bedrag per week'],['Daling CS + PS','(240 − 135) + (80 − 45)','€ 140'],['Overdracht aan overheid','4 × 30','€ 120'],['Welvaartsverlies','140 − 120','€ 20']],60,270,1480,345,[560,530,390],34);
 text(s,'Koperslast op verkochte boekjes: € 3 × 30 = € 90',60,670,1480,58,37,{bold:true,color:C.blue});text(s,'CS daalt € 105: ook € 15 voordeel op gemiste aankopen.',60,755,1480,65,35);
 notes(s,'16','De daling van CS is 105; PS daalt 35. Samen140. De overheid ontvangt120; alleen20 verdwijnt uit de maat. De koperslast per verkocht product maal Qt is90; het verloren CS is groter door gemiste aankopen. Voor verkopers: 1×30=30 plus5 gemist voordeel.','Waarom is de daling van CS groter dan 3×30?','Een last per verkocht product is niet het hele surplusverlies.','Vergelijk nu twee markten waarbij alleen de vraagreactie verschilt.',true);
}
{
 const s=slide('Prijsgevoeligheid · een gecontroleerde vergelijking');example(s);
 text(s,'Beide: P₀ = € 8 · Q₀ = 40 per week · Pp = 4 + 0,10Q · t = € 4',60,245,1480,100,35,{bold:true});
 table(s,[['Reactie van de kopers','Markt A','Markt B: notitieboekjes'],['Vraag','Pc = 12 − 0,10Q','Pc = 20 − 0,30Q'],['Q bij Pc = € 8','40','40'],['Q bij Pc = € 9','30','36⅔'],['Afname bij dezelfde prijsstijging','10','3⅓']],60,376,1480,365,[630,420,430],31);
 text(s,'In B reageren kopers minder sterk op dezelfde prijsstijging.',60,777,1480,51,34,{bold:true,color:C.blue});
 notes(s,'17','Dit is een eigen gecontroleerde vergelijking, los van de fruitbekermarkt in het boek. Beide markten starten op dezelfde prijs en hoeveelheid; aanbod en t zijn gelijk. A: bij P9 is Q=(12−9)/0,1=30. B: Q=(20−9)/0,3=36⅔. B verliest minder kopers; vergelijk gedrag, niet alleen getekende steilheid.','Wat houden we gelijk om de vraagreactie te vergelijken?','Een andere asschaal bewijst geen andere prijsgevoeligheid.','Vergelijk bij dezelfde belasting de nieuwe prijzen en aandelen.',true);
}
{
 const s=slide('Minder prijsgevoelige kopers dragen meer');example(s);
 table(s,[['Na dezelfde belasting van € 4','Markt A','Markt B: notitieboekjes'],['Qt per week','20','30'],['Pc / Pp per stuk','€ 10 / € 6','€ 11 / € 7'],['Koperslast per stuk','10 − 8 = € 2','11 − 8 = € 3'],['Kopersaandeel','2 / 4 × 100% = 50%','3 / 4 × 100% = 75%']],60,263,1480,374,[630,420,430],31);
 text(s,'Minder uitwijken bij een hogere prijs → groter aandeel bij kopers',60,697,1480,100,40,{bold:true,color:C.blue});
 notes(s,'17','A: 12−0,10Q=8+0,10Q geeft Qt20, Pc10, Pp6. B is het bestaande voorbeeld: Qt30, Pc11, Pp7. Minder gevoelige kopers blijven relatief vaker kopen zodat een groter deel van dezelfde belasting via de kopersprijs bij hen terechtkomt. Dezelfde redenering geldt omgekeerd voor verkopers: relatief minder prijsgevoelig aanbod betekent relatief meer last voor verkopers.','Hoe verklaar je 75% zonder te verwijzen naar wie afdraagt?','De afdrachtregel zegt niet welke prijsaanpassing ontstaat. Deze vergelijking houdt beginpunt, aanbod en belasting gelijk.','Controleer het onderscheid tussen O en W met het uitlegvoorbeeld.',true);
}
for(const reveal of [false,true]){
 const s=slide('Korte controle · opbrengst of verlies?');example(s);
 text(s,'Er worden 30 in plaats van 40 notitieboekjes verkocht.\nDe belasting is € 4 per verkocht boekje.',60,257,1480,135,43,{bold:true});
 if(!reveal){text(s,'“De overheid ontvangt € 40.\nHet welvaartsverlies is € 120.”',60,466,1480,145,49,{bold:true,color:C.blue});text(s,'Welke hoeveelheid hoort bij O, welke bij W?',60,710,1480,75,39);}
 else{table(s,[['Grootheid','Juiste basis','Uitkomst per week'],['O = t × Qt','30 verkochte boekjes','€ 120'],['W = ½ × (Q₀ − Qt) × t','10 gemiste transacties','€ 20']],60,462,1480,244,[600,500,380],32);text(s,'De overheid ontvangt over verkopen; W meet gemist voordeel.',60,760,1480,62,36,{bold:true});}
 notes(s,'15–18',reveal?'O=4×30=120; W=½×10×4=20. Beide bedragen in de uitspraak zijn fout. Verkochte versus gemiste eenheden bepaalt de berekening.':'Laat eerst individueel denken, dan kort toelichten. Dit is een begripscheck van het eigen voorbeeld, geen extra huiswerkopgave.','Welke breedte kies je en waarom?','4×(40−30) is noch O, noch de driehoek W.',reveal?'Keer terug naar startopgave 11; begin dan met basis 12 en 13.':'Laat leerlingen eerst antwoorden; toon daarna de berekeningen.',true);
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 16 · Bedrukte tassen: wie betaalt?', '§3.1.2 · Doelopgave 16 · Boekpagina 21',46);
 text(s,'Dit is de markt uit §3.1.1, met alle gegevens opnieuw gegeven.',60,198,1480,62,35);
 text(s,'Vraag: Pc = 20 − 0,20Q\nAanbod: Pp = 2 + 0,10Q',60,286,1480,129,45,{bold:true});
 table(s,[['Situatie','Hoeveelheid (tassen per dag)','Prijs (€ per tas)'],['Eerst','Q₀ = 60','P₀ = 8'],['Met t = € 3 per tas','Qt = 50','Pc = 10 · Pp = 7']],60,477,1480,243,[460,570,450],33);
 text(s,'De belasting heeft geen effecten voor buitenstaanders en geen uitvoeringskosten.',60,762,1480,69,32);
 notes(s,'21','Werkelijke context van 16, volledig weergegeven inclusief functies, eenheden en aannamen. Dit is een nieuwe markt: reset de notitieboekjesgegevens. Nog geen oplossingen geven. Alle vragen en de basisgrafiek volgen eerst.','Welke grootheden zijn al gegeven?','Meng de wekelijkse notitieboekjesmarkt niet met tassen per dag.','Toon de oorspronkelijke basisgrafiek.');
}
{
 const s=slide('Opgave 16 · De basisgrafiek','§3.1.2 · Doelopgave 16 · Boekpagina 21');
 text(s,'V: Pc = 20 − 0,20Q       A: Pp = 2 + 0,10Q',60,181,1480,55,35,{bold:true});graph(s,T,{mode:'base',wide:true});
 notes(s,'21','Native XY-reconstructie van figuur 5 met ongewijzigde functies en het oorspronkelijke bereik Q0–100, P0–22. Er staan nog geen antwoordgebieden of nieuwe prijsmarkeringen in. De oorspronkelijke A geeft de werkelijk ontvangen prijs.','Waar staan in de basisgrafiek de oorspronkelijke vraag en het aanbod?','Een middenprijs is niet de prijs van beide marktpartijen na belasting.','Toon deelvragen a tot en met c.');
}
{
 const s=slide('Opgave 16 · Deelvragen a, b en c','§3.1.2 · Doelopgave 16 · Boekpagina 21');
 text(s,'a. Bereken de last per tas voor beide kanten en het afwentelingspercentage.',60,228,1480,129,40);rule(s,60,390,1480);
 text(s,'b. Bereken de belastingopbrengst per dag.',60,441,1480,87,40);rule(s,60,558,1480);
 text(s,'c. Bereken CS en PS zonder en met belasting. Bereken daarna de welvaartsmaat met overheid en het welvaartsverlies.',60,608,1480,171,40);
 notes(s,'21','Alle oorspronkelijke deelvragen a–c staan zonder antwoorden op deze dia. Leerlingen houden hun eigen werk erbij. Vraag c bevat oude en nieuwe CS/PS én de welvaartsrekening.','Welke tussenstappen vraagt c?','Alleen een eindgetal W is geen volledige beantwoording.','Toon eerst ook d en e vóór de uitwerking.');
}
{
 const s=slide('Opgave 16 · Deelvragen d en e','§3.1.2 · Doelopgave 16 · Boekpagina 21');
 text(s,'d. Markeer Qt, Pc en Pp in de basisgrafiek. Arceer de belastingopbrengst en het welvaartsverlies verschillend. Noteer basis en hoogte van W.',60,238,1480,208,40);rule(s,60,496,1480);
 text(s,'e. Een koper zegt: “Als de vraag nog minder prijsgevoelig was, zouden wij minder belasting dragen.” Beoordeel, bij gelijk aanbod en dezelfde belasting.',60,559,1480,223,40);
 notes(s,'21','Nu zijn context, alle gegevens, basisgrafiek en alle vijf vragen beschikbaar geweest. Bespreek pas hierna de oplossingen, in de volgorde a–e.','Welke omstandigheden moet je bij e gelijk houden?','De uitspraak gaat over de relatieve prijsreactie, niet over de afdrachtregel.','Begin de oplossing met de twee lasten per tas.');
}
{
 const s=slide('Opgave 16a · De last per tas','§3.1.2 · Doelopgave 16 · Boekpagina 21');
 table(s,[['Marktpartij','Vergelijking met P₀ = € 8','Last per tas'],['Koper','Pc − P₀ = 10 − 8','€ 2'],['Verkoper','P₀ − Pp = 8 − 7','€ 1']],60,224,1480,287,[410,710,360],36);
 text(s,'Afwenteling = (Pc − P₀) / t × 100%',60,586,1480,68,43,{bold:true,color:C.blue});text(s,'= 2 / 3 × 100% ≈ 66,67%',60,690,1480,75,50,{bold:true});text(s,'Controle: € 2 + € 1 = € 3 per verkochte tas',60,793,1480,48,31);
 notes(s,'21','Exact aandeel is 2/3; afronden aan het einde geeft66,67%. Last verkopers is1/3 of33,33%. De som is de belasting per tas.','Waarom neem je P0 als vergelijkingsprijs?','66,67 is een percentage, geen bedrag per tas.','Bereken de totale belastingopbrengst.');
}
{
 const s=slide('Opgave 16b · De belastingopbrengst','§3.1.2 · Doelopgave 16 · Boekpagina 21');
 text(s,'O = t × Qt',60,225,1480,87,55,{bold:true,color:C.orange});text(s,'= € 3 per tas × 50 tassen per dag',60,368,1480,93,46);text(s,'= € 150 per dag',60,519,1480,100,58,{bold:true});text(s,'De overheid ontvangt alleen over de 50 daadwerkelijke verkopen.',60,728,1480,87,38);
 notes(s,'21','Gegeven t3 euro per tas en Qt50 tassen per dag. Vermenigvuldigen levert150 euro per dag. De 10 gemiste verkopen betalen geen belasting.','Welke hoeveelheid wordt belast?','Vermenigvuldig niet met Q060 of alleen met de koperslast2.','Bereken eerst de oude surplusgebieden.');
}
{
 const s=slide('Opgave 16c · Surplus zonder belasting','§3.1.2 · Doelopgave 16 · Boekpagina 21');graph(s,T,{mode:'old',areas:['CS','PS']});
 side(s,'Q₀ = 60 · P₀ = € 8','CS = ½ × 60 × (20 − 8)\n= € 360 per dag\n\nPS = ½ × 60 × (8 − 2)\n= € 180 per dag','Samen: € 540 per dag');
 notes(s,'21','Lees20 en2 als de prijsasintercepten van V en A. Basis60 tassen per dag, hoogten12 en6 euro per tas. Samen540.','Welke twee prijsverschillen zijn de hoogten?','De hoogte van PS is6, niet8.','Gebruik daarna Qt en de twee nieuwe prijzen.');
}
{
 const s=slide('Opgave 16c · Surplus met belasting','§3.1.2 · Doelopgave 16 · Boekpagina 21');graph(s,T,{areas:['CS','PS']});
 side(s,'Qt = 50 · Pc = 10 · Pp = 7','CS = ½ × 50 × (20 − 10)\n= € 250 per dag\n\nPS = ½ × 50 × (7 − 2)\n= € 125 per dag','De nieuwe prijzen zijn € per tas');
 notes(s,'21','Beide bases50. Hoogte CS10 euro per tas; PS5 euro per tas. CS250 enPS125 per dag. Oorspronkelijke A blijft MK.','Waarom ligt PS onder7 en niet onder10?','De belastingontvangst is niet onderdeel van het producentensurplus.','Tel de overheid erbij voor de nieuwe maat.');
}
{
 const s=slide('Opgave 16c · De nieuwe welvaartsmaat','§3.1.2 · Doelopgave 16 · Boekpagina 21');
 table(s,[['Grootheid (€ per dag)','Zonder belasting','Met belasting'],['CS','360','250'],['PS','180','125'],['O','0','150'],['CS + PS + O','540','525']],60,219,1480,385,[680,400,400],35);
 text(s,'Nieuw: 250 + 125 + 150 = € 525 per dag',60,653,1480,63,41,{bold:true});text(s,'W = 540 − 525 = € 15 per dag',60,753,1480,73,47,{bold:true,color:C.red});
 notes(s,'21','Daling CS+PS=110+55=165 euro per dag. O150 gaat naar overheid; restant15 is W. Controleer optelling en eenheid. De opgegeven afwezigheid van externe effecten en uitvoeringskosten maakt deze vergelijking passend.','Waarom is W niet165?','Verlies van privaat surplus is deels overdracht.','Markeer de prijzen en arceer O.');
}
{
 const s=slide('Opgave 16d · Prijzen, hoeveelheid en O','§3.1.2 · Doelopgave 16 · Boekpagina 21');graph(s,T,{areas:['O'],shift:true});
 side(s,'Markeringen','Qt = 50 tassen per dag\nPc = € 10 per tas\nPp = € 7 per tas\n\nO = 50 × (10 − 7)\n= € 150 per dag','O: verticale arcering',C.orange);
 notes(s,'21','De verticale gids ligt exact bijQ50. Horizontale grenzen7 en10. O loopt van0 tot50 tussen die prijzen. A+t: Pc5+0,10Q helpt het nieuwe evenwicht terugvinden. Op de volgende dia komt W erbij op dezelfde schaal.','Welke rechthoek hoort bij daadwerkelijk verkochte tassen?','De hele daling van CS/PS is niet de belastingrechthoek.','Voeg de verliesdriehoek tussen50 en60 toe.');
}
{
 const s=slide('Opgave 16d · De verliesdriehoek W','§3.1.2 · Doelopgave 16 · Boekpagina 21');graph(s,T,{areas:['O','W'],shift:true});
 side(s,'Gemiste transacties','Basis = 60 − 50\n= 10 tassen per dag\nHoogte = 10 − 7\n= € 3 per tas\n\nW = ½ × 10 × 3\n= € 15 per dag','W: horizontale arcering',C.red);
 notes(s,'21','W heeft hoekpunten(50,7),(60,8),(50,10). Dit is het gemiste voordeel tussen V en de oorspronkelijke A. Basis10 tassen per dag en hoogte3 euro per tas; oppervlakte15 euro per dag. O en W verschillen zowel in ligging als arceerrichting.','Hoe controleert dit de welvaartsrekening?','Q50 is niet de basis van W. De hele belastingband is niet verloren welvaart.','Beoordeel ten slotte de uitspraak over prijsgevoeligheid.');
}
{
 const s=slide('Opgave 16e · Wie kan minder makkelijk uitwijken?','§3.1.2 · Doelopgave 16 · Boekpagina 21',46);
 text(s,'“Als de vraag nog minder prijsgevoelig was,\nzouden wij minder belasting dragen.”',60,225,1480,152,43,{bold:true});
 text(s,'Onjuist, bij gelijk aanbod en dezelfde belasting.',60,447,1480,74,43,{bold:true,color:C.red});
 text(s,'Kopers kunnen minder makkelijk afzien van aankoop.\nEen groter deel komt via de kopersprijs bij hen terecht.',60,578,1480,139,40);
 text(s,'De minder prijsgevoelige kant draagt relatief meer last.',60,773,1480,56,36,{bold:true,color:C.blue});
 notes(s,'21','Verbind de conclusie aan de gecontroleerde vergelijking vóór het zelfstandig werk. Houd hetzelfde uitgangspunt, aanbod en belasting vast; minder vraagreactie betekent relatief meer last bij kopers. Andersom kunnen relatief weinig reagerende verkopers meer dragen. Laat leerlingen één ontbrekende berekening, eenheid of verklaring in16a–e herstellen.','Welke schakel verklaart het grotere kopersaandeel?','Wie afdraagt is geen verklaring van economische belastingdruk.','Keer terug naar hetzelfde overzicht en laat huiswerk noteren.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...spec,hashes,slides,overviewSlides:overviews,nativeTableSlides:tables,nativeChartSlides:charts},null,2));
await fs.writeFile(path.join(BUILD,'graphs.json'),JSON.stringify(graphs,null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const candidate=path.join(BUILD,'candidate.pptx');
console.log('Exporting',p.slides.items.length,'slides');await (await PresentationFile.exportPptx(p)).save(candidate);
execFileSync(PYTHON,[fileURLToPath(new URL('./presentation-312-package.py',import.meta.url)),candidate]);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),candidate]);
const finalPath=path.join(FINAL,'3.1.2 Belastingdruk en welvaartsverlies – presentatie.pptx');
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath,pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},tableArithmeticContracts:[10,25].map(slide=>({slide,table:1,label_column:0,total_row:4,value_columns:[1,2],component_rows:[1,2,3]})),requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
