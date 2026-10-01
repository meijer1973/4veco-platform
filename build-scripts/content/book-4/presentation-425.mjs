// HOW TO ADAPT: derive route, pages and target from the current edition manifest.
// Keep the authored example distinct from assigned work. One overview source,
// native tables/XY graphs and source-bound teacher notes serve the whole lesson.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('425');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const FONT='Arial',C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',red:'#B7443E',pale:'#EFF4F7',line:'#C6D2DB',muted:'#445B6B'};
const tables=[],charts=[],slides=[],overviews=[],graphSpecs=[];
const source='https://github.com/meijer1973/4veco-lessen/blob/e734532a42b27732ac25ce990fc9448b12309d28/edities/books34-v3/';
const E={id:'authored',name:'Dakgroen',unit:'dakdiensten',one:'dakdienst',d:44,b:.5,a:8,k:.5,e:12,s:12,q0:36,p0:26,q:48,pc:20,pp:32,qe:48,xmax:80,ymax:60};
const T={id:'target',name:'Buurtcursus',unit:'deelnemers',one:'deelnemer',d:60,b:.5,a:20,k:.5,e:10,s:10,q0:40,p0:40,q:50,pc:35,pp:45,qe:50,xmax:100,ymax:70};
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,55),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(title,example=false){
 const s=p.slides.add();s.background.fill='#FFFFFF';text(s,title,60,42,1480,86,50,{bold:true});rule(s,60,146,1480);
 text(s,example?'Uitlegvoorbeeld — niet uit het boek':'§4.2.5 Positieve externe effecten',60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});slides.push({number:p.slides.items.length,title,example});return s;
}
function notes(s,pages,explanation,question,pitfall,transition,example=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, books34-v3, gedrukte boekpagina ${pages}. ${source}books/book-4/output/Boek_4_Compleet_v3.pdf\nLeerlingbron: ${source}books/book-4/chapters/4.2/4.2.5%20manuscript.md\nAntwoordmodel: ${source}books/book-4/chapters/4.2/Antwoorden.md#antwoord43\n${example?'Uitlegvoorbeeld — niet uit het boek. Dakgroen en alle bijbehorende gegevens zijn voor deze uitleg gemaakt. De boekverwijzing betreft uitsluitend de methode.':''}`);
}
function table(s,values,{x=60,y=245,w=1480,h=390,widths=null,size=34}={}){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths||Array(values[0].length).fill(w/values[0].length),values});t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.ink:r%2?'#FFFFFF':C.pale;cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}
 tables.push(p.slides.items.length);return t;
}
function rows(s,items,{y=235,gap=140,size=42}={}){items.forEach((r,i)=>text(s,r,60,y+i*gap,1480,gap-14,size,{bold:i===items.length-1,color:i===items.length-1?C.blue:C.ink}));}
const route=['Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.','Maak de startopdracht.','Uitleg bij de lesdoelen.','Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.','Klaar? Werk aan een ander vak. Geen devices.','Bespreken van de doelopgave: opgave 43.','Zet je huiswerk in je agenda.'];
function overview(phase,active){
 const s=slide('Deze les: §4.2.5 Positieve externe effecten');overviews.push(p.slides.items.length);text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+i});text(s,r,116,ys[i],790,hs[i],30,{bold:active===i+1,color,name:'route-'+i});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});text(s,'Privaat en extern voordeel.\nSubsidie en uitgaven berekenen.\nMaatschappelijk surplus en\nefficiënte hoeveelheid bepalen.',972,240,565,147,30,{name:'overview-goals'});rule(s,972,389,568);
 text(s,'Startopdracht',972,407,565,45,35,{bold:true,color:active===2?C.blue:C.ink});text(s,'Pagina 94 · Opgaven 37 en 38\n38: verkennen, theorie p. 88',972,461,565,93,30,{name:'overview-start'});rule(s,972,575,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});text(s,'§4.2.5\nBasis: 39 en 40\nZelfstandig: 41 en 42\nDoelopgave: 43\nMaken en nakijken',972,654,565,184,30,{name:'overview-homework'});
 notes(s,'88–98','Laat dit overzicht staan tijdens '+phase+'. Start 37–38 staat op gedrukte boekpagina 94 (hoofdstukpagina 42). Opgave 37 herhaalt de subsidiewig uit Boek 3 §3.1.3, boek p.23–26: Pp = Pc + s, invullen in beide oorspronkelijke functies en uitgaven over alle verkopen. Geef bij vastlopen deze procedure als hint. Bij 38 is het positieve effect nieuw: laat eerst de definitie en het onderscheid tussen koper, aanbieder en derden op p.88 lezen. Dit is ondersteunde verkenning, geen toets van nieuwe beheersing. Keer na de uitleg en vóór basiswerk terug naar beide startitems, laat leerlingen hun antwoord verbeteren en bespreek de bron voor hun keuze. Startantwoorden uitsluitend voor die nabespreking: 37 Q=10 stuks per dag, Pc=€10, Pp=€14, uitgaven €40 per dag; 38 onbetaald voordeel voor andere buurtbewoners is extern, eigen leren is privaat en lesgeld is een marktbetaling. Basis 39 p.94, 40 p.95; zelfstandig 41 p.95 en 42 p.96; doel 43 p.97. Huiswerk 39–43 maken en nakijken. Bonus 44 en herhaling 45 p.98 zijn extra. Docenteninformatie reserveert voorlopig twee lessen van 55 minuten plus mogelijke uitloop. Volledige tijdsfit en leerlingbeheersing zijn niet gemeten.','Welke stap lukt al, en waar helpt de theorie?','Hoofdstukpagina 42 is boekpagina 94. Positief extern voordeel is bij de start nog geen veronderstelde voorkennis.',active===7?'Laat het huiswerk noteren.':'Ga verder zodra de klas klaar is voor de volgende fase.');
}
function series(name,x,y,color,width=4,label=null,idx=null){return {name,xValues:x,values:y,line:{fill:color,width},marker:{symbol:'none'},...(label?{dataLabelOverrides:[{idx:idx??x.length-1,text:label,position:'top',showValue:false,textStyle:{typeface:FONT,fontSize:25,fill:color,bold:true}}]}:{})};}
function graph(s,m,{social=false,old=false,efficient=false,loss=false,shift=false,newPoint=false}={}){
 const ss=[],V=q=>m.d-m.b*q,A=q=>m.a+m.k*q,B=q=>V(q)+m.e;
 if(loss){const xx=[],yy=[];for(let i=0;i<=40;i++){let q=m.q0+(m.qe-m.q0)*i/40;xx.push(q,q);yy.push(i%2?B(q):A(q),i%2?A(q):B(q));}ss.push(series('Arcering gemiste baten',xx,yy,'#D6A099',1.2));ss.push(series('Grens verlies',[m.q0,m.qe,m.q0,m.q0],[A(m.q0),A(m.qe),B(m.q0),A(m.q0)],C.red,2.5));}
 const lx=m.xmax*.80;
 ss.push(series('Vraag',[0,lx,m.xmax],[V(0),V(lx),V(m.xmax)],C.blue,4,'Vraag',1));
 ss.push(series('A = MK',[0,lx,m.xmax],[A(0),A(lx),A(m.xmax)],C.red,4,'A = MK',1));
 if(social){ss.push(series('Baten maatschappelijk',[0,lx,m.xmax],[B(0),B(lx),B(m.xmax)],C.green,4));const labelQ=m.xmax*.30;ss.push(series('Maatschappelijke baten label',[labelQ],[B(labelQ)+7],C.green,0,'Baten maatschappelijk'));}
 if(shift){const start=Math.max(0,(m.s-m.a)/m.k);ss.push(series('A − s',[start,lx,m.xmax],[A(start)-m.s,A(lx)-m.s,A(m.xmax)-m.s],C.orange,4,'A − s',1));}
 const point=(q,pr,name,color)=>ss.push({...series(name,[q],[pr],color,0),marker:{symbol:'circle',size:9}});
 if(old){ss.push(series('Q0 en P0 hulplijnen',[0,m.q0,m.q0],[m.p0,m.p0,0],C.muted,1.4));point(m.q0,m.p0,'Marktevenwicht',C.ink);}
 if(efficient){ss.push(series('Qe hulplijn',[m.qe,m.qe],[0,A(m.qe)],C.muted,1.4));point(m.qe,A(m.qe),'Efficiënte hoeveelheid',C.green);}
 if(shift&&!newPoint){const price=m===E?12:25,from=(price-m.a)/m.k,to=(price-m.a+m.s)/m.k;ss.push(series('Horizontale verschuiving',[from,to],[price,price],C.muted,3));ss.push(series('Pijlpunt verschuiving',[to-2,to,to-2],[price+1,price,price-1],C.muted,3));}
 if(newPoint){ss.push(series('Pc hulplijnen',[0,m.q,m.q],[m.pc,m.pc,0],C.muted,1.4));ss.push(series('Pp hulplijn',[0,m.q],[m.pp,m.pp],C.muted,1.4));ss.push(series('Subsidiewig',[m.q,m.q],[m.pc,m.pp],C.orange,5));point(m.q,m.pc,'Kopersprijs',C.blue);point(m.q,m.pp,'Producentenontvangst',C.red);}
 const ax={textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5},numberFormatCode:'0'};
 const ch=s.charts.add('scatter',{position:{left:45,top:212,width:1090,height:605},series:ss,scatterOptions:{style:'lineWithMarkers'},hasLegend:false,dataLabels:{showValue:false,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},xAxis:{...ax,min:0,max:m.xmax,majorUnit:20,title:{text:`Q (${m.unit} per maand)`,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}}},yAxis:{...ax,min:0,max:m.ymax,majorUnit:10,title:{text:'P, kosten en baten (€ per '+m.one+')',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},majorGridlines:{fill:C.line,width:1}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphSpecs.push({slide:p.slides.items.length,model:m.id,social,old,efficient,loss,shift,newPoint,series:ss});
 return ch;
}
function aside(s,title,body,foot=''){text(s,title,1170,211,365,90,35,{bold:true,color:C.blue});text(s,body,1170,321,365,330,33);if(foot)text(s,foot,1170,671,365,143,31,{bold:true,color:C.orange});}

overview('Startopdracht',2);
{
 const s=slide('Privaat voordeel en voordeel voor derden',true);
 text(s,'Dakgroen: een fictieve markt voor groene-dakdiensten',60,192,1480,70,37,{bold:true,color:C.blue});
 table(s,[['Betrokkene','Wat krijgt diegene?','Economische betekenis'],['Koper','Een eigen groen dak','Privaat voordeel'],['Aanbieder','Betaling voor de dienst','Markttransactie'],['Omwonenden','Onbetaalde verkoeling','Positief extern effect']],{y:300,h:343,widths:[370,575,535],size:34});
 text(s,'De bron moet het voordeel voor derden afzonderlijk onderbouwen.',60,719,1480,93,38,{bold:true});
 notes(s,'88','Definieer een positief extern effect: voordeel voor een derde door productie of consumptie, niet verwerkt in een betaling of vergoeding. In deze verzonnen case neemt de bron onbetaalde verkoeling voor omwonenden aan. Het voordeel van het eigen dak hoort bij de koper. De aanbieder levert een betaalde dienst. Het bestaan of de omvang van baten in een echte dakmarkt volgt niet uit deze onderwijsdata. Verbind met de derde partij uit §4.2.4 en keer na alle uitleg terug naar start 38.','Wie profiteert zonder partij te zijn bij de koop?','Een betaling aan de aanbieder is geen externe baat.','Koppel het onderscheid aan functies en bedragen.',true);
}
{
 const s=slide('Dakgroen: gegevens van het uitlegvoorbeeld',true);
 table(s,[['Grootheid','Gegeven'],['Private vraag','Pc = 44 − 0,5Q'],['Oorspronkelijk aanbod = MK','Pp = 8 + 0,5Q'],['Extern voordeel','€ 12 per dakdienst'],['Subsidie aan aanbieders','€ 12 per uitgevoerde dakdienst'],['Eenheden en domein','Q per maand, 0–80; prijzen in € per dakdienst']],{y:198,h:488,widths:[650,830],size:34});
 text(s,'Veel aanbieders. Geen overige maatschappelijke kosten of baten.',60,735,1480,81,35,{bold:true});
 notes(s,'89–93','Alle getallen en de context Dakgroen zijn apart geschreven voor de uitleg. Geen toegewezen oefening wordt hiermee opgelost. Veronderstel concurrentie, gelijkblijvende overige omstandigheden, geen andere externe effecten, geen vaste kosten en geen financierings- of uitvoeringskosten. De aanbodlijn geeft marginale kosten. De baten voor derden zijn constant per dienst. Begin nog zonder subsidie.','Welke gegevens beschrijven een betaling en welke een echt voordeel?','Een bedrag per dienst is nog geen maandtotaal.','Bereken eerst de ongereguleerde markt.',true);
}
{
 const s=slide('De markt telt het private voordeel',true);graph(s,E,{old:true});aside(s,'Vraag = aanbod','44 − 0,5Q\n= 8 + 0,5Q\n\nQ₀ = 36\nP₀ = € 26','36 dakdiensten\nper maand');
 notes(s,'89','Gelijkstellen geeft 36 = Q. Invullen in beide functies geeft 26 euro per dakdienst. De vraag weerspiegelt private betalingsbereidheid. De ongereguleerde markt neemt de onbetaalde 12 euro voor derden niet in de keuze mee. De grafiek heeft Q per maand en bedragen per dienst, geen maandtotalen op de verticale as.','Welke baten ontbreken in deze marktvergelijking?','De vraaglijn bevat niet vanzelf het voordeel voor omwonenden.','Voeg het ontbrekende voordeel toe op dezelfde assen.',true);
}
{
 const s=slide('Baten voor iedereen per extra dakdienst',true);graph(s,E,{social:true,old:true});aside(s,'Privaat + extern','44 − 0,5Q + 12\n= 56 − 0,5Q\n\nBij Q = 40:\nprivaat € 24\nextern € 12\nsamen € 36','MK bij Q = 40:\n€ 28 per dienst');
 notes(s,'89','Lees op dezelfde verticale lijn bij Q=40. Private betalingsbereidheid 24 is lager dan kosten 28, maar maatschappelijke baten 36 zijn hoger. Daarom kan extra activiteit voor alle betrokkenen samen voordeel geven. De groene lijn ligt exact 12 euro boven de vraag, bij elke hoeveelheid. Zij is niet de prijs die kopers willen betalen.','Is een extra dienst rond Q=40 maatschappelijk zinvol?','Maatschappelijke baten zijn privaat plus extern, niet alleen extern.','Bepaal tot welke hoeveelheid de extra baten de kosten dekken.',true);
}
{
 const s=slide('Efficiënte hoeveelheid en gemiste baten',true);graph(s,E,{social:true,old:true,efficient:true,loss:true});aside(s,'Baten = MK','56 − 0,5Q\n= 8 + 0,5Q\nQe = 48\n\nVerlies:\n½ × (48 − 36) × 12\n= € 72 per maand','Arcering tussen\nbaten en MK,\nvan 36 tot 48');
 notes(s,'89, 91, 93','De efficiënte hoeveelheid is 48. Tussen 36 en 48 zijn maatschappelijke baten groter dan marginale kosten. De arcering is de gemiste netto-opbrengst, begrensd door (36;26), (36;38) en (48;32). Basis 12 diensten per maand, hoogte 12 euro per dienst, oppervlakte 72 euro per maand. Boven 48 overtreffen de extra kosten de extra baten. Demonstreer aanwijzen van beide grenslijnen, begin- en eindhoeveelheid en daarna de driehoeksformule.','Waarom stopt de winstgevende uitbreiding bij 48?','Meer productie is niet onbeperkt beter. Gebruik de maatschappelijke-batenlijn, niet de private vraag, als bovengrens.','Laat zien hoe subsidie de private keuze kan veranderen.',true);
}
{
 const s=slide('De bekende subsidiewig',true);rows(s,['Pp = Pc + s','8 + 0,5Q = 44 − 0,5Q + 12','Q = 48 dakdiensten per maand'],{y:215,gap:150,size:44});
 text(s,'Pc = 44 − 0,5 × 48 = € 20 per dakdienst',60,685,1480,60,39);text(s,'Pp = 8 + 0,5 × 48 = € 32 per dakdienst',60,770,1480,60,39,{bold:true,color:C.blue});
 notes(s,'90, 92','Haal §3.1.3 uit Boek 3 terug: producenten ontvangen de kopersbetaling plus subsidie. Invullen van vraag en aanbod in die prijsrelatie geeft de hoeveelheid. Bereken vervolgens Pc in de oorspronkelijke vraag en Pp in het oorspronkelijke aanbod. Controle: 32−20=12. De hoeveelheid is hier toevallig dezelfde als Qe doordat s gelijk is aan het constante externe voordeel.','Welke prijs gebruik je bij de oorspronkelijke aanbodlijn?','Pp is ontvangst inclusief subsidie, geen winst.','Vertaal de subsidie ook naar de aanbodlijn in kopersprijzen.',true);
}
{
 const s=slide('Aanbod in kopersprijzen',true);graph(s,E,{shift:true});aside(s,'Pc = Pp − s','Pc = 8 + 0,5Q − 12\nPc = −4 + 0,5Q\n\nBij Pc = € 12:\nzonder steun Q = 8\nmet steun Q = 32','De horizontale pijl\nvergelijkt aanbod\nbij dezelfde Pc.');
 notes(s,'90','Subsidie verlaagt de benodigde kopersbetaling. Bij Pc=12 levert de oorspronkelijke aanbodfunctie Q=8; A−s levert Q=32. De horizontale pijl loopt dus van (8;12) naar (32;12). De neerwaartse afstand bij eenzelfde Q is 12 euro. Het negatieve intercept van A−s is een algebraïsche uitkomst, geen waargenomen negatieve marktprijs; de grafiek toont het niet-negatieve prijsbereik vanaf Q=8. De oorspronkelijke A blijft de kostenlijn.','Wat houden we gelijk bij de horizontale verschuivingspijl?','Een verschuiving van aanbod is iets anders dan bewegen langs de vraag.','Lees nu beide prijzen bij dezelfde nieuwe hoeveelheid.',true);
}
{
 const s=slide('Eén hoeveelheid, twee prijzen',true);graph(s,E,{shift:true,newPoint:true});aside(s,'Bij Q = 48','Pc = € 20 op V\nPp = € 32 op A\n\nPp − Pc = € 12\n\nUitgaven:\n12 × 48 = € 576\nper maand','Subsidie voor alle\n48 diensten, ook\nde eerdere 36.');
 notes(s,'90, 92','Het snijpunt van V met A−s is (48;20). Lees bij dezelfde Q op de oorspronkelijke A de ontvangst 32. De verticale oranje wig is 12. Reken de uitgaven over alle 48 uitgevoerde diensten, niet alleen de twaalf extra. Totaal extern voordeel is óók 12×48, maar berust op een andere bronpost.','Waarom is 12 × (48 − 36) geen juiste begrotingsrekening?','Dezelfde waarde van subsidie en externe baten maakt die posten niet hetzelfde.','Bereken de voordelen van kopers en aanbieders.',true);
}
{
 const s=slide('CS en PS gebruiken hun eigen prijs',true);
 table(s,[['€ per maand','Zonder subsidie','Met subsidie'],['CS','½ × 36 × (44 − 26) = 324','½ × 48 × (44 − 20) = 576'],['PS','½ × 36 × (26 − 8) = 324','½ × 48 × (32 − 8) = 576']],{y:250,h:330,widths:[300,590,590],size:33});
 text(s,'CS: vraag boven Pc. PS: Pp boven de oorspronkelijke aanbodlijn.',60,641,1480,100,39,{bold:true,color:C.blue});
 text(s,'Oppervlakte = ½ × hoeveelheid × prijsverschil',60,777,1480,56,36);
 notes(s,'91, 93','Herhaal de driehoeksoppervlakte uit Boek 3 §3.1.3. CS gebruikt de intercept 44 en kopersprijs. PS gebruikt de oorspronkelijke aanbodintercept 8 en producentenontvangst inclusief subsidie. Laat de hoogte telkens als verschil benoemen. De 576 euro PS bevat de overheidsoverdracht al, daarom moet die uitgave straks uit de maatschappelijke rekening.','Welke twee bedragen bepalen de hoogte van de PS-driehoek?','PS berekenen met Pc vergeet de subsidie die aanbieders ontvangen.','Breid de twee marktvoordelen uit met overheid en derden.',true);
}
{
 const s=slide('De volledige maatschappelijke rekening',true);
 text(s,'CS + PS − subsidie-uitgaven + externe baten',60,190,1480,65,42,{bold:true,color:C.blue});
 table(s,[['Post (€ per maand)','Zonder subsidie','Met € 12 subsidie'],['CS','324','576'],['PS','324','576'],['Subsidie-uitgaven','0','12 × 48 = 576'],['Externe baten','12 × 36 = 432','12 × 48 = 576'],['Maatschappelijk surplus','1.080','1.152']],{y:285,h:403,widths:[650,400,430],size:32});
 text(s,'Verbetering: € 1.152 − € 1.080 = € 72 per maand',60,750,1480,74,40,{bold:true,color:C.green});
 notes(s,'91, 93','Zonder: 324+324+432=1080. Met: 576+576−576+576=1152. De uitgaven zijn een overdracht die in PS zit en bij de overheid ontbreekt. De externe baten zijn echt derdenvoordeel. De verbetering is 72, overeenkomstig de verliesdriehoek, niet de hele 576 subsidie of de 144 extra externe baten. Die extra diensten hebben ook private baten en productiekosten.','Welke twee posten ontbreken als je alleen CS en PS optelt?','Subsidie betalen creëert niet automatisch een even groot echt voordeel.','Controleer dat met een lagere subsidie.',true);
}
{
 const s=slide('Een lagere subsidie: verschillende bedragen',true);
 text(s,'Zelfde Dakgroen-markt: s = € 6, extern voordeel blijft € 12',60,191,1480,80,37,{bold:true,color:C.blue});
 text(s,'8 + 0,5Q = 44 − 0,5Q + 6 geeft Q = 42, Pc = € 23, Pp = € 29',60,289,1480,86,35);
 table(s,[['Post (€ per maand)','Berekening'],['CS + PS','441 + 441 = 882'],['Subsidie-uitgaven','6 × 42 = 252'],['Externe baten','12 × 42 = 504'],['Maatschappelijk surplus','882 − 252 + 504 = 1.134']],{y:393,h:330,widths:[690,790],size:32});
 text(s,'Uitgaven en externe baten blijven afzonderlijke posten.',60,764,1480,62,39,{bold:true,color:C.orange});
 notes(s,'90–93','Verander alleen de subsidie, niet de externe bate. Q=42; Pc=23, Pp=29. CS=½×42×(44−23)=441, PS=½×42×(29−8)=441. Uitgaven 252 en baten 504 vallen niet weg. Maatschappelijk surplus 1134 is 54 hoger dan zonder steun (1080), maar 18 lager dan bij s=12 (1152). Dit oefent het onderscheid vóór basisopgave 40 met eigen cijfers.','Waarom kun je de twee posten nu niet wegstrepen?','De subsidiehoogte bepaalt de uitgaven, de bronwaardering bepaalt de externe baten.','Bekijk ook hoe twee batencomponenten tegelijk kunnen veranderen.',true);
}
{
 const s=slide('Korte controle: twee baten veranderen',true);
 text(s,'Bij dezelfde hoeveelheid activiteit, met gelijke kosten:',60,207,1480,71,38,{bold:true});
 table(s,[['Verandering per extra dakdienst','Bedrag'],['Privaat voordeel','€ 3 hoger'],['Extern voordeel','€ 7 lager']],{y:340,h:267,widths:[1120,360],size:38});
 text(s,'Hoe veranderen de maatschappelijke baten per extra dienst?',60,692,1480,118,43,{bold:true,color:C.blue});
 notes(s,'89, 95','Aparte korte begripscontrole met zelfgeschreven cijfers. Houd Q gelijk en kosten constant. Laat leerlingen beide componenten apart benoemen en samenvoegen. Deze vraag bereidt de bewerking van opgave 41 voor zonder die opgave te beantwoorden.','Welke twee veranderingen tel je bij elkaar op?','Een hoger privaat voordeel garandeert geen hoger gezamenlijk voordeel.','Onthul pas na de leerlingreacties de berekening.',true);
}
{
 const s=slide('Korte controle: het gezamenlijke effect',true);rows(s,['Alleen privaat: maatschappelijke baten € 3 hoger','Alleen extern: maatschappelijke baten € 7 lager','Samen: + € 3 − € 7 = − € 4 per extra dakdienst'],{y:247,gap:163,size:40});
 text(s,'De maatschappelijke baten dalen hier ondanks hoger privaat voordeel.',60,766,1480,74,35,{bold:true,color:C.orange});
 notes(s,'89, 95','De maatschappelijke baten zijn de som van de twee afzonderlijke componenten. De daling voor derden is groter dan de stijging bij kopers. Dit is een vergelijking bij dezelfde hoeveelheid, geen berekening van een nieuw marktevenwicht. Laat de leerlingen nu start 38 opnieuw beantwoorden met de definitie.','Welke aanname hielden we gelijk bij deze optelsom?','Bedragen per extra dienst mag je niet zonder Q als maandtotalen beschrijven.','Keer terug naar de startitems en begin daarna het basiswerk.',true);
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 43 · Bron: Buurtcursus');
 text(s,'Een cursus geeft deelnemers eigen voordeel én helpt andere buurtbewoners. De bron waardeert uitsluitend dat bijkomende voordeel op € 10 per deelnemer.',60,197,1480,155,39);
 table(s,[['Gegeven','Waarde'],['Vraag','Pc = 60 − 0,5Q'],['Aanbod','Pp = 20 + 0,5Q'],['Hoeveelheid','Q is deelnemers per maand, van 0 tot 100'],['Prijzen','Euro per deelnemer']],{y:395,h:335,widths:[400,1080],size:34});
 text(s,'Boekpagina 97 · Eigen voordeel en voordeel voor anderen',60,772,1480,50,32,{bold:true,color:C.blue});
 notes(s,'97','Dit is de echte bron bij doelopgave 43, geen vervolg van Dakgroen. De vraagintercept is nu 60, de aanbodintercept 20 en extern voordeel 10. Lees de context en eenheden. De volgende dia bevat alle overige bronvoorwaarden. Toon eerst alle brongegevens, figuur en deelvragen, nog geen antwoorden.','Welke gegevens zijn anders dan in het uitlegvoorbeeld?','Gebruik geen functies of uitkomsten uit Dakgroen.','Maak de bron volledig met de subsidie en aannames.');
}
{
 const s=slide('Opgave 43 · Subsidie en voorwaarden');
 rows(s,['Er zijn veel aanbieders.','De overheid betaalt aanbieders € 10 subsidie\nvoor elke gebruikte cursusplaats.','Andere omstandigheden blijven gelijk.','Er zijn geen andere externe effecten, vaste kosten,\nfinancierings- of uitvoeringskosten.'],{y:205,gap:147,size:38});
 notes(s,'97','Vervolg van de volledige bron. De subsidie gaat naar aanbieders voor elke gebruikte plaats. Concurrentie en het ontbreken van andere kosten/baten maken de getekende aanbodlijn geschikt voor de marginale maatschappelijke-kostenvergelijking. Deze voorwaarden begrenzen de beleidsconclusie.','Voor welke cursusplaatsen betaalt de overheid?','Andere kosten ontbreken in dit model, niet automatisch in de werkelijkheid.','Toon de oorspronkelijke basisgrafiek.');
}
{
 const s=slide('Opgave 43 · Basisgrafiek');graph(s,T,{social:true});aside(s,'Gebruik de bron\nen de basisgrafiek','Private vraag\nMaatschappelijke baten\nOorspronkelijk aanbod','De subsidie is\ngeen nieuwe\nexterne baat.');
 notes(s,'97','Bewerkbare reconstructie van Figuur 28 met hetzelfde domein 0–100 en dezelfde schaal 0–70. Vraag 60−0,5Q, maatschappelijke baten 70−0,5Q, oorspronkelijk aanbod 20+0,5Q. Er zijn geen uitkomsten, hulplijnen of verliesarcering toegevoegd in deze vragensectie. De subsidie staat los van de gegeven 10 euro externe bate.','Welke lijn beschrijft wat de koper zelf voor een extra plaats over heeft?','De maatschappelijke-batenlijn is niet een hogere marktprijs.','Lees nu alle deelvragen voordat antwoorden volgen.');
}
{
 const s=slide('Opgave 43 · Deelvragen a, b en c');
 rows(s,['a. (2p) Benoem het private en externe voordeel.\nBereken de oorspronkelijke hoeveelheid en prijs.','b. (3p) Bereken na de subsidie Q, Pc, Pp\nen de overheidsuitgaven.','c. (4p) Bereken CS, PS en het maatschappelijk surplus\nvóór en na.'],{y:227,gap:191,size:40});
 notes(s,'97','Volledige deelvragen a–c uit opgave 43, inclusief de gevraagde vergelijking vóór en na. Geef nog geen berekeningen of eindantwoorden. Leerlingen moeten de doelopgave al zelfstandig hebben geprobeerd.','Welke grootheden moet je in twee situaties berekenen?','Vraag c vraagt zowel afzonderlijke surplussen als maatschappelijk surplus.','Toon ook de grafische en verklarende deelvragen.');
}
{
 const s=slide('Opgave 43 · Deelvragen d en e');
 rows(s,['d. (2p) Bepaal de efficiënte hoeveelheid en arceer\nhet oorspronkelijke welvaartsverlies.','e. (2p) Leg uit waarom dit anders uitpakt dan\ndezelfde subsidie zonder externe baten.'],{y:270,gap:241,size:43});
 notes(s,'97','Dit voltooit alle brongegevens en alle vijf subvragen zonder antwoorden. Bij d hoort de basisgrafiek van twee dia’s terug. Bij e moeten leerlingen de andere maatschappelijke grens verklaren. Pas op de volgende dia start de stapsgewijze uitwerking.','Welke twee situaties vergelijk je bij e?','Dezelfde subsidie zonder externe baten is een andere welvaartsvergelijking, niet een ander subsidiebedrag.','Start de feedback met het onderscheid tussen eigen en extern voordeel.');
}
{
 const s=slide('43a · Voordelen en oorspronkelijke uitkomst');
 text(s,'Privaat: eigen voordeel van deelnemers.\nExtern: bijkomend onbetaald voordeel voor andere buurtbewoners.',60,198,1480,157,39,{bold:true,color:C.blue});
 rows(s,['60 − 0,5Q = 20 + 0,5Q','Q₀ = 40 deelnemers per maand','P₀ = 60 − 0,5 × 40 = € 40 per deelnemer'],{y:396,gap:143,size:42});
 notes(s,'97','Het eigen voordeel staat in de vraag, het bijkomende derdenvoordeel ontbreekt uit de private marktvergelijking. Gelijkstellen geeft 40=Q; controle via aanbod: 20+0,5×40=40 euro. Zonder subsidie zijn Pc en Pp gelijk. Beide inhoudelijke en beide numerieke onderdelen van a zijn nodig.','Hoe controleer je de oorspronkelijke prijs met de andere functie?','De 10 euro externe bate tel je niet bij de prijs op om P0 te vinden.','Pas de subsidiewig toe.');
}
{
 const s=slide('43b · Hoeveelheid en beide prijzen');
 rows(s,['Pp = Pc + 10','20 + 0,5Q = 60 − 0,5Q + 10','Q₁ = 50 deelnemers per maand'],{y:202,gap:134,size:43});
 text(s,'Pc = 60 − 0,5 × 50 = € 35 per deelnemer',60,626,1480,66,39);text(s,'Pp = 20 + 0,5 × 50 = € 45 per deelnemer',60,711,1480,66,39,{bold:true,color:C.blue});
 notes(s,'97','Gelijkstellen met de omgekeerde wig geeft 50=Q. Pc op vraag is 35; Pp op oorspronkelijk aanbod is 45. Controle 45−35=10 euro subsidie. De producentenontvangst is niet de winst. Dit is dezelfde methode als in het uitlegvoorbeeld maar met de echte bronfuncties.','Welke controle verbindt de twee gevonden prijzen?','De subsidie wordt niet tweemaal toegevoegd.','Reken de uitgaven over alle gebruikte plaatsen.');
}
{
 const s=slide('43b · Uitgaven voor alle plaatsen');
 rows(s,['Overheidsuitgaven = s × Q₁','€ 10 per plaats × 50 plaatsen per maand','= € 500 per maand'],{y:229,gap:151,size:44});
 text(s,'Ook de 40 plaatsen die zonder subsidie zouden worden gebruikt\nkrijgen de subsidie.',60,735,1480,93,37,{bold:true,color:C.orange});
 notes(s,'97','Iedere gebruikte plaats ontvangt subsidie. De berekening 10×(50−40)=100 vergeet 400 euro subsidie op de oorspronkelijke veertig plaatsen. De externe baten zijn afzonderlijk ook 10×50, omdat de bron 10 euro echt voordeel per deelnemer waardeert.','Welke plaatsen ontbreken als je alleen de toename gebruikt?','500 euro uitgaven is geen berekend welvaartsverlies.','Bereken CS en PS vóór en na.');
}
{
 const s=slide('43c · CS en PS vóór en na');
 table(s,[['€ per maand','Zonder subsidie','Met subsidie'],['CS','½ × 40 × (60 − 40)\n= 400','½ × 50 × (60 − 35)\n= 625'],['PS','½ × 40 × (40 − 20)\n= 400','½ × 50 × (45 − 20)\n= 625']],{y:246,h:397,widths:[250,615,615],size:35});
 text(s,'CS gebruikt Pc. PS gebruikt Pp. Beide gebruiken de werkelijke Q.',60,713,1480,100,38,{bold:true,color:C.blue});
 notes(s,'97','Voor CS is de hoogte oorspronkelijk 60−40=20 en daarna 60−35=25. Voor PS is die 40−20=20 en daarna 45−20=25. Basis respectievelijk 40 en 50 deelnemers per maand. De oppervlakten hebben eenheid euro per maand. De gelijkheid van CS en PS volgt hier uit de symmetrische hellingen, niet uit een algemene regel.','Waar komt de 25 euro hoogte vandaan bij elk van de twee nieuwe driehoeken?','Een prijsniveau is niet hetzelfde als een prijsverschil.','Tel overheid en derden mee in de maatschappelijke vergelijking.');
}
{
 const s=slide('43c · Maatschappelijk surplus');
 text(s,'CS + PS − subsidie-uitgaven + externe baten',60,185,1480,64,42,{bold:true,color:C.blue});
 table(s,[['Post (€ per maand)','Vóór','Na'],['CS','400','625'],['PS','400','625'],['Subsidie-uitgaven','0','500'],['Externe baten','10 × 40 = 400','10 × 50 = 500'],['Maatschappelijk surplus','1.200','1.250']],{y:280,h:410,widths:[640,420,420],size:33});
 text(s,'Verbetering: € 1.250 − € 1.200 = € 50 per maand',60,752,1480,70,40,{bold:true,color:C.green});
 notes(s,'97','Vóór: 400+400+400=1200. Na: 625+625−500+500=1250. De uitgaven trek je af omdat de overheid de betaling doet die al in de voordelen van marktdeelnemers zit. Externe baten tel je op omdat die nog niet in CS of PS zitten. De volledige rekening bewijst een verbetering van 50.','Waarom hebben uitgaven en externe baten verschillende tekens?','De twee posten zijn hier numeriek gelijk door s=extern voordeel; dat is geen algemene wegstreepregel.','Controleer de verbetering met de efficiënte hoeveelheid en verliesdriehoek.');
}
{
 const s=slide('43d · Efficiënte hoeveelheid en verlies');graph(s,T,{social:true,old:true,efficient:true,loss:true});aside(s,'Baten = MK','70 − 0,5Q\n= 20 + 0,5Q\nQe = 50\n\nVerlies vóór:\n½ × (50 − 40) × 10\n= € 50 per maand','Arceer tussen\nbaten en MK,\nvan Q = 40 tot 50.');
 notes(s,'97','Maatschappelijke baten zijn 60−0,5Q+10=70−0,5Q. Gelijkstellen aan MK=20+0,5Q geeft Qe=50. Het oorspronkelijke verlies heeft hoekpunten (40;40), (40;50), (50;45). De oorspronkelijke hoeveelheid is 40, de efficiënte 50. Basis tien deelnemers per maand en hoogte tien euro per deelnemer geven vijftig euro per maand. Die gemiste baten verdwijnen bij de gegeven subsidie.','Welke twee lijnen vormen de schuine zijden van het verliesgebied?','Het hele gebied tussen private en maatschappelijke baten is niet het welvaartsverlies.','Verklaar waarom hetzelfde instrument zonder derdenvoordeel anders uitpakt.');
}
{
 const s=slide('43e · Dezelfde subsidie zonder externe baten');
 table(s,[['Maatschappelijk surplus\n(€ per maand)','Zonder subsidie','Met € 10 subsidie','Verandering'],['Zonder externe baten','400 + 400\n= 800','625 + 625 − 500\n= 750','−50'],['Met externe baten','800 + 400\n= 1.200','750 + 500\n= 1.250','+50']],{y:227,h:362,widths:[500,300,410,270],size:32});
 text(s,'De extra plaatsen kosten meer dan het private voordeel.\nHet voordeel voor derden maakt ze hier toch maatschappelijk zinvol.',60,669,1480,151,38,{bold:true,color:C.blue});
 notes(s,'97','Zonder externe baten zijn de extra transacties tussen 40 en 50 maatschappelijk ongunstig: MK overtreft private betalingsbereidheid. Dan daalt het surplus 800 naar 750. Met de bronbaten levert uitbreiding honderd euro extra voordeel voor derden, terwijl de private netto-rekening vijftig daalt: samen vijftig winst. De rekenmethode blijft hetzelfde, de maatschappelijke grens verandert. Conclusie geldt bij de gegeven concurrentie, constante baten en ontbrekende overige kosten; een hogere subsidie of extra uitvoeringskosten vraagt opnieuw rekenen. Laat leerlingen een ontbrekende stap of eenheid verbeteren.','Welke bronaanname verandert het teken van de welvaartsconclusie?','De subsidie alleen bewijst geen welvaartswinst.','Sluit af met de vaste huiswerkroute.');
}
overview('Afsluiting / huiswerk',7);

// Compare actual authored chart arrays with equations, including every hatch vertex.
const near=(a,b)=>{if(Math.abs(a-b)>1e-7)throw new Error(`Geometry mismatch: ${a} != ${b}`);};
for(const g of graphSpecs){const m=g.model==='authored'?E:T;for(const ser of g.series){for(let i=0;i<ser.xValues.length;i++){let q=ser.xValues[i],v=ser.values[i];if(q<0||q>m.xmax||v<0||v>m.ymax)throw new Error('Outside graph domain');if(ser.name==='Vraag')near(v,m.d-m.b*q);if(ser.name==='A = MK')near(v,m.a+m.k*q);if(ser.name==='Baten maatschappelijk')near(v,m.d-m.b*q+m.e);if(ser.name==='A − s')near(v,m.a+m.k*q-m.s);if(ser.name==='Arcering gemiste baten'){if(q<m.q0||q>m.qe)throw new Error('Wrong loss interval');if(Math.min(Math.abs(v-(m.a+m.k*q)),Math.abs(v-(m.d-m.b*q+m.e)))>1e-7)throw new Error('Wrong hatch boundary');}}
 if(ser.name==='Horizontale verschuiving'){near(ser.values[0],m.a+m.k*ser.xValues[0]);near(ser.values[1],m.a+m.k*ser.xValues[1]-m.s);}
 if(ser.name==='Grens verlies'){const expectedX=[m.q0,m.qe,m.q0,m.q0],expectedY=[m.p0,m.a+m.k*m.qe,m.p0+m.e,m.p0];ser.xValues.forEach((q,i)=>{near(q,expectedX[i]);near(ser.values[i],expectedY[i]);});}
}}
for(const m of [E,T]){near((m.d-m.a)/(m.b+m.k),m.q0);near((m.d-m.a+m.e)/(m.b+m.k),m.qe);near(m.pp-m.pc,m.s);near(m.d-m.b*m.q,m.pc);near(m.a+m.k*m.q,m.pp);const before=.5*m.q0*(m.d-m.a)+m.e*m.q0,after=.5*m.q*(m.d-m.pc)+.5*m.q*(m.pp-m.a)-m.s*m.q+m.e*m.q;near(after-before,.5*(m.qe-m.q0)*m.e);}
await fs.writeFile(BUILD+'/manifest.json',JSON.stringify({slides,overviewSlides:overviews,nativeTableSlides:tables,nativeChartSlides:charts,models:{authored:E,target:T},graphSpecs},null,2));
await fs.writeFile(BUILD+'/presentation.json',JSON.stringify(p.toProto()));
const draft=BUILD+'/candidate.pptx';await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:FINAL+'/4.2.5 Positieve externe effecten – presentatie.pptx',pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({slides:slides.length,overviews,finalPath:result.finalPath,package:result.packageIntegrity.status,layout:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
