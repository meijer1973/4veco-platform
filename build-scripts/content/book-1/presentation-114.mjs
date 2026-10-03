import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

// Current teaching authority: Book 1, tweede editie 2026. See adjacent manifest.
// Historical first-edition web companion sources are not used by this builder.
const assignment=JSON.parse(await fs.readFile(new URL('./presentation-114.tweede-editie-2026.manifest.json',import.meta.url),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('114');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', tables=[],charts=[],slides=[],overviews=[];
const source='https://github.com/meijer1973/4veco-lessen/blob/'+assignment.sourceCommit+'/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/edities/tweede-editie-2026/';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,50),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer='§1.1.4 Gemengde opgaven · Tweede editie 2026'){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,86,52,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title});return s;
}
function notes(s,page,explanation,question,pitfall,transition,extra=''){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 1, tweede editie 2026, gedrukte boekpagina ${page}. ${source}boek/Boek_1_Compleet_Tweede_editie.pdf\nAntwoordmodel: ${source}bronnen/H1/Antwoorden.md\n${extra}`);
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
  cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
 }}tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift,\npen en rekenmachine.',
 'Maak de startopdracht.',
 'Korte herhaling en aanpak.',
 'Werk verder aan de gemengde opgaven,\nstel vragen en kijk je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van opgave 36.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §1.1.4 Gemengde opgaven');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,342,403,468,601,703,774],hs=[80,45,45,110,75,50,52];
 route.forEach((r,i)=>{let color=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],795,hs[i],30,{bold:active===i+1,color,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Bron en methode kiezen.\nKeuze, grafiek en berekening\ncombineren. Advies onderbouwen.',972,244,565,126,30,{name:'overview-goals'});
 rule(s,972,385,568);
 text(s,'Startopdracht',972,410,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 39\nOpgave 34',972,471,565,94,30,{bold:active===2,name:'overview-start'});
 rule(s,972,582,568);
 text(s,'Huiswerk',972,607,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§1.1.4 Gemengde opgaven\nOpgaven 34, 35, 36, 37 en 38\nMaken en nakijken\nBespreekopgave: 36',972,665,565,161,30,{bold:active===7,name:'overview-homework'});
 notes(s,'39–42',`Laat het overzicht staan tijdens ${phase.toLowerCase()}. Start met de eerste echte opgave: 34 op p.39. De complete gemengde set 34,35,36,37,38 is huiswerk: maken en nakijken, ook de extra gemengde oefening 37–38. In het boek bestaan geen begeleide basisopgaven voor deze gemengde paragraaf. Werk van 34–35 naar doel 36, daarna 37–38. Bespreek 36 omdat deze keuze, grafiek, index en brongebonden advies combineert. Bronnen van 36 staan op p.40, alle vragen op p.41. Opgave 34 haalt eerder onderwezen handelingen op: per eenheid p.13, verandering p.14 en index p.16. Een gemaakte startopgave bewijst nog geen duurzame beheersing. Neem twijfel mee naar de korte herhaling. De volledige set hoeft niet binnen één les af te zijn.`,phase==='Startopdracht'?'Welke grootheid vergelijk je bij opgave 34?':'Welke stap vraagt nog uitleg?', 'Een totaalbedrag en een prijs per beker kunnen verschillend veranderen.',phase==='Afsluiting / huiswerk'?'Laat alle vijf nummers en maken en nakijken in de agenda zetten.':'Volg de volgende lesfase en laat leerlingen hun eerdere aanpak bijstellen.');
 return s;
}
overview('Startopdracht',2);
{
 const s=slide('Een passende aanpak bij elke bron');
 const rows=[['Lees','Wat moet je kiezen, berekenen of beoordelen?'],['Selecteer','Welke bron, eenheid en vergelijkingsbasis horen erbij?'],['Werk uit','Schrijf de bewerking of teken de juiste coördinaten.'],['Controleer','Past je antwoord bij de bron, het doel en de aanname?']];
 rows.forEach((r,i)=>{const y=211+i*143;text(s,r[0],60,y,365,60,40,{bold:true,color:C.blue});text(s,r[1],459,y,1080,94,36);if(i<3)rule(s,60,y+112,1480);});
 notes(s,'6–8, 13–16, 24–29, 38','Dit is een korte herhaling, geen nieuwe theorie. Koppel de aanpak aan de lesdoelen: een bron kiezen, eerdere methoden combineren en een conclusie onderbouwen. Vraag bij een keuze naar middel, doel en het beste haalbare alternatief (p.6–8). Bij de start: eerst totaal/aantal, daarna dezelfde prijzen per beker vergelijken, met de oude prijs als basis (p.13–16). Voor een prijs–hoeveelheidsgrafiek: Q horizontaal, P verticaal, punten (Q;P), gelijke stappen en alleen de gegeven rechte lijnstukken (p.24–26). Voor 37: eerst invullen of beide zijden bewerken, daarna terug invullen en domein controleren (p.27). Een hoogte is bovenkant min onderkant; rechthoek b×h, driehoek ½b×h, m×m geeft m² (p.28). Tijdvolgorde alleen bewijst geen oorzaak (p.29). Vraag een korte mondelinge herinnering en geef zo nodig het paginanummer voor herstel. Werk geen toegewezen opgave voor.','Welke noemer hoort bij een prijsverandering?','Een eerder gemaakte opgave is geen bewijs dat iedereen de handeling beheerst.','Gebruik een nieuw voorbeeld om bronkeuze te oefenen.');
}
{
 const s=slide('Buurttheater: twee aparte bronnen');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,181,1480,50,32,{bold:true,color:C.blue});
 table(s,[['Bron A · Dezelfde kaart door de jaren','Basisjaar','Jaar 2','Jaar 3'],['Prijs per kaart','€ 10','€ 11','€ 12,10']],60,251,1480,171,[730,250,250,250],30);
 table(s,[['Bron B · Model voor één avond','Prijs € 10','Prijs € 12'],['Verwachte bezoekers','90','70']],60,460,1480,161,[730,375,375],30);
 text(s,'B: rechte lijn tussen de punten, overige omstandigheden gelijk.',60,651,1480,49,30);
 text(s,'Welke bron gebruik je voor de prijsstijging van jaar 2 naar 3?\nWelke bron voorspelt bezoekers bij een kaartprijs van € 11?',60,741,1480,92,34,{bold:true});
 notes(s,'16, 26, 38','Eigen uitlegvoorbeeld met geconstrueerde theaterdata, niet uit een boekopgave. Bron A beschrijft prijzen in verschillende jaren. Bron B modelleert één avond bij verschillende prijzen. De gelijke bedragen 10 en 11 maken bronnen niet uitwisselbaar. Laat eerst de juiste bron kiezen. De index van het basisjaar is 100. De volgende twee dia’s bespreken uitsluitend deze eigen data.','Welke bron gaat over jaren, en welke over een prijskeuze voor één avond?','Maak van de jaarprijzen geen model voor bezoekers.','Werk eerst de jaarvergelijking uit.','De genoemde boekpagina’s onderbouwen alleen de methoden. Context en data zijn voor deze les geschreven.');
}
{
 const s=slide('Bron A: de oude waarde bepaalt de groei');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,181,1480,50,32,{bold:true,color:C.blue});
 text(s,'Van € 11 naar € 12,10 per kaart',60,277,1480,70,46,{bold:true});
 text(s,'(12,10 − 11) / 11 × 100% = 10%',60,390,1480,82,52,{bold:true,color:C.orange});
 rule(s,60,510,1480);
 text(s,'Basis € 10: index 110 en index 121',60,554,1480,64,41);
 text(s,'11 indexpunten / oude index 110 × 100% = 10%',60,658,1480,100,42,{bold:true,color:C.blue});
 notes(s,'14, 16, 38','Eigen voorbeeld. Selecteer bron A. Jaar 2: 11/10×100=110, jaar 3: 12,10/10×100=121. Het verschil is 11 indexpunten. Voor groei van jaar 2 naar 3 is jaar 2 de oude waarde: (121−110)/110×100%=10%. Controleer rechtstreeks met de prijzen: het verschil van 1,10 is 10% van 11. Bij de index staat geen euroteken.','Waarom deel je voor deze groei niet door de index van het basisjaar?','Een verschil in indexpunten is alleen numeriek gelijk aan procentuele groei als de oude index 100 is.','Gebruik bron B voor de andere vraag.','Uitlegvoorbeeld — niet uit het boek. De boekpagina’s zijn methodebronnen.');
}
{
 const s=slide('Bron B: een verwachting tussen twee punten');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,181,1480,50,32,{bold:true,color:C.blue});
 table(s,[['Kaartprijs (€)','10','11','12'],['Bezoekers per avond','90','?','70']],60,266,1480,198,[670,270,270,270],36);
 text(s,'€ 11 ligt halverwege € 10 en € 12.',60,517,1480,63,42,{bold:true});
 text(s,'90 − ½ × (90 − 70) = 80 bezoekers per avond',60,619,1480,70,43,{bold:true,color:C.blue});
 text(s,'Dit is een modelverwachting onder de afgesproken aannames.',60,752,1480,75,34);
 notes(s,'26, 29, 38','Eigen voorbeeld. Selecteer bron B. De prijsstap is 1 van 2 euro, dus de helft. De volledige daling van het aantal is 20, dus neem de helft van 20: 90−10=80 bezoekers per avond. Controleer dat 80 tussen 90 en 70 ligt. Bij een prijs–hoeveelheidsgrafiek wordt dit punt (80;11). De rechte lijn en gelijkblijvende omstandigheden zijn aannames. Een modeluitkomst garandeert geen echt aantal. Haal desgewenst het verschil tussen voorspellen en causaliteit op: meer bezoekers na een actie bewijst zonder meer informatie niet het effect van die actie.','Welke aanname maakt halverwege rekenen hier mogelijk?','De jaarprijs uit bron A verklaart geen bezoekers in bron B.','Laat leerlingen teruggaan naar hun eigen gemengde werk.','Uitlegvoorbeeld — niet uit het boek. De boekpagina’s onderbouwen de methode.');
}
overview('Gemengde opgaven',4);
{
 const s=slide('Opgave 36 · Een schoolactiviteit plannen','Opgave 36 · Boekpagina 40 · Eerst alle vragen');
 text(s,'Eén school, twee beslissingen',60,180,1480,55,36,{bold:true,color:C.blue});
 text(s,'Middagactiviteit en avondvoorstelling zijn afzonderlijke plannen\nin verschillende tijdvakken. Gebruik per vraag de passende bron.',60,243,1480,91,33);
 text(s,'Aula: twee uur beschikbaar. Elk uitvoerbaar plan vraagt alle twee uur.\nCombineren kan niet. Doel: het hoogste bedrag voor een goed doel.',60,355,1480,89,32);
 table(s,[['Bron A · Middagactiviteit','Bedrag over per uur, na alle uitgaven'],['Boekenruil','€ 60'],['Cultuuratelier','€ 75']],60,477,1480,261,[620,860],32);
 text(s,'Alle bronnen zijn geconstrueerde gegevens voor deze opgave.',60,780,1480,50,30);
 notes(s,'40','Presenteer eerst de volledige opgave, nog zonder antwoorden. Dit is bron A. Beide plannen zijn uitvoerbaar en gebruiken de volledige twee beschikbare uren. De bedragen zijn al na alle uitgaven. De middag en avond zijn losse plannen. Alle bronnen zijn geconstrueerde gegevens voor deze opgave.','Welke beperking geldt voor de middag?','Een bedrag per uur is nog geen totaal.','Bekijk eerst de vragen a en b.');
}
{
 const s=slide('Opgave 36 · Vragen bij bron A','Opgave 36 · Boekpagina 41 · Eerst alle vragen');
 text(s,'Schrijf bij elke berekening welke waarden je gebruikt\nen geef de juiste eenheid.',60,205,1480,109,37,{bold:true,color:C.blue});
 text(s,'a.',60,387,75,65,42,{bold:true,color:C.blue});
 text(s,'Leg met bron A uit waarom de school moet kiezen.\nBereken beide totaalbedragen en bepaal welk plan\nbij het doel past.',155,387,1380,167,39);
 text(s,'b.',60,638,75,65,42,{bold:true,color:C.blue});
 text(s,'Noem de alternatieve kosten van de keuze uit a.\nVerklaar waarom het verschil tussen beide\ngeldbedragen niet hetzelfde is.',155,638,1380,167,39);
 notes(s,'40–41','Toon de volledige algemene rekeninstructie en de beide deelvragen uit het boek. De vorige dia bevat bron A. Beide vragen vragen om een berekening én uitleg. Geef nu nog geen oplossing: alle bronnen en vragen gaan vooraf aan de antwoorddia’s.','Welke onderdelen vraagt a, behalve een keuze?','Alleen het gekozen plan noemen is niet voldoende.','Bekijk bron B voordat we antwoorden onthullen.');
}
{
 const s=slide('Opgave 36 · Bron B','Opgave 36 · Boekpagina 40 · Eerst alle vragen');
 text(s,'Een aparte avondvoorstelling',60,190,1480,65,42,{bold:true,color:C.blue});
 text(s,'Het model voorspelt bezoekers bij verschillende ticketprijzen.\nAndere omstandigheden blijven gelijk. Tussen de drie punten\nneemt de commissie een rechte lijn aan.',60,284,1480,145,35);
 table(s,[['Ticketprijs P (€ per bezoeker)','4','6','8'],['Verwacht aantal Q (per avond)','180','140','100']],60,459,1480,211,[730,250,250,250],32);
 text(s,'De zaal heeft voldoende plaatsen voor alle getoonde aantallen.',60,708,1480,56,33);
 text(s,'Voorstel: € 7 per ticket. Doel: minstens 130 bezoekers.',60,782,1480,57,36,{bold:true,color:C.orange});
 notes(s,'40','Lees bron B met alle voorwaarden. Het gaat om één aparte avond en verschillende mogelijke prijzen. De getallen zijn modelvoorspellingen, geen geobserveerde tijdreeks. Het model geldt tussen de gegeven punten. Noem de voldoende zaalcapaciteit en het bezoekersdoel van 130. Nog geen oplossing op deze dia.','Wat verandert binnen deze bron, en wat houden we gelijk?','Behandel de drie prijzen niet als drie achtereenvolgende jaren.','Bekijk de vragen bij bron B.');
}
{
 const s=slide('Opgave 36 · Vragen bij bron B','Opgave 36 · Boekpagina 41 · Eerst alle vragen');
 const q=[['c.','Teken zelf een grafiek op ruitjespapier. Benoem assen en\neenheden, kies een schaal en teken de punten en rechte lijnstukken.'],['d.','Bepaal met lineaire interpolatie het verwachte aantal\nbezoekers bij een ticketprijs van € 7.'],['g.','Past het prijsvoorstel van € 7 bij het doel van minstens\n130 bezoekers? Geef advies met het berekende aantal\nen één beperking van het model.']];
 q.forEach((a,i)=>{let y=211+i*207;text(s,a[0],60,y,75,65,42,{bold:true,color:C.blue});text(s,a[1],155,y,1380,164,37);});
 notes(s,'40–41','Alle handelingen uit c, d en g staan op de dia. Verwijs terug naar de volledige bron B op de vorige dia. Instructie: geef gebruikte waarden en eenheden. Vraag g staat hier naast c en d omdat zij dezelfde bron gebruikt; e en f komen hierna, nog steeds vóór elke oplossing.','Welke delen van je eigen uitwerking heb je nodig voor het advies?','Een advies zonder vergelijking met het doel of zonder modelbeperking beantwoordt g niet volledig.','Bekijk als laatste bron C met e en f.');
}
{
 const s=slide('Opgave 36 · Bron C en vragen e–f','Opgave 36 · Boekpagina 40–41 · Eerst alle vragen');
 text(s,'Dezelfde jaarlijkse voorstelling, prijzen tussen jaren',60,186,1480,60,36,{bold:true,color:C.blue});
 table(s,[['Jaar','Basisjaar','Jaar 2','Jaar 3'],['Ticketprijs','€ 4','€ 4,80','€ 6']],60,271,1480,164,[580,300,300,300],32);
 text(s,'Basisjaar = index 100. Dit is een jaarvergelijking,\nlos van het prijsvoorstel van € 7 uit bron B.',60,463,1480,84,33);
 text(s,'Bericht: “De prijsindex stijgt van jaar 2 naar jaar 3 met\n30 punten. Een ticket is dus 30% duurder geworden.”',60,573,1480,93,35,{bold:true,color:C.orange});
 text(s,'e. Bereken de prijsindexcijfers van jaar 2 en jaar 3. Bereken\n    vervolgens de procentuele prijsverandering tussen die jaren.',60,703,1480,84,32,{bold:true});
 text(s,'f. Beoordeel het bericht. Schrijf een verbeterde zin.',60,799,1480,45,32,{bold:true});
 notes(s,'40–41','Dit is de volledige bron C: dezelfde jaarlijkse voorstelling, prijs 4, 4,80 en 6 euro, basisjaar index 100, en de onjuiste claim. Alle zeven deelvragen zijn nu beschikbaar, zonder oplossingen. Laat leerlingen even hun eigen antwoorden en gebruikte bronnen klaarleggen. Bewaak de scheiding met de avondkeuze uit B.','Welke oude waarde hoort bij de verandering van jaar 2 naar jaar 3?','Een stijging in punten is niet vanzelf dezelfde procentuele stijging.','Start de bespreking met a, nadat alle vragen zichtbaar zijn geweest.');
}
{
 const s=slide('Opgave 36a · Keuze voor de middag');
 text(s,'Eén aula, twee uur, twee plannen die het hele tijdvak vragen',60,193,1480,84,37,{bold:true,color:C.blue});
 table(s,[['Plan','Berekening','Bedrag voor het goede doel'],['Boekenruil','2 uur × € 60 per uur','€ 120'],['Cultuuratelier','2 uur × € 75 per uur','€ 150']],60,316,1480,280,[430,590,460],32);
 text(s,'Keuze: cultuuratelier',60,655,1480,67,48,{bold:true,color:C.green});
 text(s,'€ 150 is het hoogste totaal. De twee plannen passen niet samen.',60,764,1480,74,35);
 notes(s,'40–41','a: Het beperkte middel is de aula gedurende die twee uur. Beide plannen vragen het hele tijdvak en kunnen niet worden gecombineerd. Daarom moet de school kiezen. Bereken beide totalen expliciet met uur maal euro per uur: 120 en 150 euro voor het goede doel. Kies cultuuratelier omdat het doel het hoogste bedrag is. Er hoeven geen kosten meer af: de bron geeft bedragen na alle uitgaven. Controle: 150>120 en beide opties duren twee uur.','Welk criterium bepaalt hier de keuze?','De grootste prijs of omzet is geen algemeen keuzecriterium. Het gegeven doel en netto bedragen bepalen deze keuze.','Bespreek wat de school door deze keuze opgeeft.');
}
{
 const s=slide('Opgave 36b · Het opgegeven alternatief');
 text(s,'Gekozen: cultuuratelier met € 150',60,205,1480,70,44,{bold:true,color:C.green});
 text(s,'Beste haalbare alternatief: boekenruil met € 120',60,315,1480,70,43,{bold:true,color:C.blue});
 text(s,'Alternatieve kosten = € 120',60,448,1480,88,56,{bold:true});
 rule(s,60,568,1480);
 text(s,'Verschil: € 150 − € 120 = € 30',60,617,1480,70,44,{bold:true,color:C.orange});
 text(s,'€ 30 is het extra bedrag door de gekozen activiteit.',60,741,1480,74,38);
 notes(s,'40–41','b: De school mist 120 euro van de boekenruil. Dat is de waarde van het beste haalbare opgegeven alternatief. De 30 euro is het voordeel van cultuuratelier ten opzichte van boekenruil. Het zijn verschillende grootheden en antwoorden op verschillende vragen. Alternatieve kosten worden hier aan niemand betaald.','Welk volledig plan laat de school liggen?','Noem niet 30 euro als alternatieve kosten en tel de uitkomsten niet bij elkaar op.','Zet nu de aparte bron B om in een grafiek.');
}
function graph(stage){
 const s=slide(stage===0?'Opgave 36c · Assen, schaal en punten':stage===1?'Opgave 36c · Rechte lijnstukken':'Opgave 36d · Lineair interpoleren');
 const series=[{name:'Model bron B',xValues:[100,140,180],values:[8,6,4],line:{fill:stage===0?'none':C.blue,width:4},marker:{symbol:'circle',size:12}}];
 if(stage===2){
  series.push({name:'Prijs 7',xValues:[0,120],values:[7,7],line:{fill:C.orange,width:2,style:'dashed'},marker:{symbol:'none',size:2}});
  series.push({name:'Aantal 120',xValues:[120,120],values:[0,7],line:{fill:C.orange,width:2,style:'dashed'},marker:{symbol:'none',size:2}});
 }
 const chart=s.charts.add('scatter',{position:{left:45,top:200,width:1070,height:600},series,scatterOptions:{style:stage===0?'marker':'lineWithMarkers',varyColors:false},hasLegend:false,dataLabels:{showValue:false,showCategoryName:false,showSeriesName:false},xAxis:{min:0,max:200,majorUnit:20,numberFormatCode:'0',title:{text:'Q (bezoekers per avond)',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5}},yAxis:{min:0,max:10,majorUnit:2,numberFormatCode:'0',title:{text:'P (€ per bezoeker)',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(chart,{fontFamily:FONT});charts.push(p.slides.items.length);
 text(s,'Model bron B',1128,202,412,55,34,{bold:true,color:C.blue});
 if(stage<2){text(s,'(Q; P)\n(180; 4)\n(140; 6)\n(100; 8)',1128,288,412,228,37,{bold:true});text(s,stage===0?'Q horizontaal\nP verticaal\n\nGelijke afstanden:\ngelijke stappen.':'Verbind de punten\nmet rechte\nlijnstukken.\n\nBuiten deze punten\ngeen voorspelling.',1128,555,412,235,32);}
 else {text(s,'€ 7: halverwege\n€ 6 en € 8',1128,285,412,97,34,{bold:true});text(s,'140 − ½ × 40\n= 120 bezoekers\nper avond',1128,442,412,150,36,{bold:true,color:C.orange});text(s,'Controle:\n100 < 120 < 140',1128,692,412,88,31);}
 const exp=stage===0?'c: Kies Q horizontaal in bezoekers per avond, P verticaal in euro per bezoeker. Schaal Q van 0 tot 200 met stap 20 en P van 0 tot 10 met stap 2. Schrijf elk tabelpaar in de juiste volgorde: (180;4),(140;6),(100;8). De grafiek toont alleen punten; de verbinding volgt hierna. Andere nette, correcte schalen zijn mogelijk.':stage===1?'c: Verbind de drie tabelpunten met rechte lijnstukken volgens de gegeven modelaanname. De lijn loopt alleen van (100;8) tot (180;4); trek hem niet naar de assen of buiten de brondata. Controleer minstens twee punten tegen bron B. De schaal is dezelfde als op de vorige dia.':'d: Het prijsverschil tussen 6 en 8 is 2 euro. 7−6=1 euro is de helft. Over het hele interval daalt Q van 140 naar 100: 40 bezoekers. De helft daarvan is 20. Q=140−20=120 bezoekers per avond. De guides eindigen op (120;7). Controle: 120 ligt halverwege 100 en 140. Dit volgt uit de rechte-lijnaanname en gelijkblijvende omstandigheden.';
 notes(s,'40–41',exp,stage<2?'Welk getal in het coördinatenpaar hoort bij de horizontale as?':'Welk deel van het prijsinterval gebruik je?',stage<2?'Wissel Q en P niet om en gebruik geen jaartallen uit bron C.':'De tussenwaarde is een modelverwachting, geen gemeten bezoekersaantal.',stage===0?'Verbind nu de punten.':stage===1?'Lees en bereken de tussenwaarde bij zeven euro.':'Bereken daarna de indexcijfers uit de afzonderlijke bron C.');
 return s;
}
graph(0);graph(1);graph(2);
{
 const s=slide('Opgave 36e · Indexcijfers met dezelfde basis');
 text(s,'Bron C: dezelfde voorstelling door de jaren. Basisprijs = € 4.',60,191,1480,76,38,{bold:true,color:C.blue});
 table(s,[['Jaar','Prijs','Waarde / basis × 100','Index'],['Basisjaar','€ 4','4 / 4 × 100','100'],['Jaar 2','€ 4,80','4,80 / 4 × 100','120'],['Jaar 3','€ 6','6 / 4 × 100','150']],60,314,1480,333,[340,285,585,270],34);
 text(s,'Controle: jaar 2 ligt 20% boven het basisjaar, jaar 3 50%.',60,727,1480,90,38,{bold:true});
 notes(s,'40–41','e, eerste stap: de basisprijs is 4 euro. Deel elke prijs door diezelfde 4 euro en vermenigvuldig met 100. De basisindex is 100, jaar 2 wordt 120 en jaar 3 wordt 150. Controleer de betekenis: 20% en 50% hoger dan de basisprijs. Bij indexcijfers staat geen euroteken. De procentuele verandering van jaar 2 naar 3 volgt op de volgende dia.','Welke noemer blijft voor beide indexen hetzelfde?','De basis voor een index is iets anders dan de oude waarde voor een verandering tussen twee andere jaren.','Vergelijk nu jaar 3 met jaar 2.');
}
{
 const s=slide('Opgave 36e · Groei tussen jaar 2 en jaar 3');
 text(s,'Oude index 120, nieuwe index 150',60,202,1480,73,45,{bold:true,color:C.blue});
 text(s,'Verschil: 150 − 120 = 30 indexpunten',60,325,1480,76,43);
 text(s,'(150 − 120) / 120 × 100% = 25%',60,460,1480,85,52,{bold:true,color:C.orange});
 rule(s,60,580,1480);
 text(s,'Controle met prijzen',60,629,1480,57,36,{bold:true});
 text(s,'(€ 6 − € 4,80) / € 4,80 × 100% = 25%',60,731,1480,81,43);
 notes(s,'40–41','e, tweede stap: voor deze groei is jaar 2 oud. Het indexverschil 30 wordt daarom gedeeld door 120, niet door 100. 30/120×100%=25%. Controleer rechtstreeks met de bronprijzen: 1,20/4,80×100%=25%. Een prijs van 6 euro is dus 25% hoger dan 4,80. Gebruik dezelfde grootheid en eenheid in teller en noemer.','Waarom is 120 hier de vergelijkingsbasis?','Dertig indexpunten wordt niet automatisch dertig procent.','Formuleer het verbeterde bericht.');
}
{
 const s=slide('Opgave 36f · Een correct bericht');
 text(s,'“De prijsindex stijgt van jaar 2 naar jaar 3\nmet 30 indexpunten.',60,243,1480,153,48,{bold:true,color:C.blue});
 text(s,'Een ticket wordt ten opzichte van jaar 2\n25% duurder.”',60,480,1480,153,48,{bold:true,color:C.orange});
 text(s,'Puntenverschil en procentuele verandering gebruiken een andere berekening.',60,743,1480,81,34);
 notes(s,'40–41','f: Het eerste deel van het oorspronkelijke bericht geeft het puntenverschil, maar de gevolgtrekking van 30% is fout. De verbeterde zin behoudt 30 indexpunten en geeft 25% relatieve prijsstijging met jaar 2 als vergelijkingsjaar. Laat leerlingen de zin in hun eigen werk herstellen.','Staan zowel de grootheid als het vergelijkingsjaar in je zin?','Verwar indexpunten niet met procentpunten: hier vergelijken we indexcijfers, geen aandelen in procenten.','Keer voor het bezoekersadvies terug naar bron B.');
}
{
 const s=slide('Opgave 36g · Advies over het avondvoorstel');
 text(s,'Bron B: € 7 geeft volgens het model 120 bezoekers per avond.',60,209,1480,100,42,{bold:true,color:C.blue});
 text(s,'120 < 130',60,352,1480,88,66,{bold:true,color:C.orange});
 text(s,'Het voorstel haalt het bezoekersdoel niet.',60,478,1480,74,44,{bold:true});
 text(s,'Advies: kies € 7 niet als minstens 130 bezoekers het doel is.',60,593,1480,102,37);
 text(s,'Beperking: de verwachting veronderstelt gelijkblijvende omstandigheden.',60,735,1480,89,35);
 notes(s,'40–41','g: Gebruik bron B en de eigen uitkomst van d: 120 bezoekers per avond bij 7 euro. Dat is lager dan het doel van minstens 130. Adviseer het voorstel niet te kiezen als dit bezoekersdoel leidend is. Noem één concrete modelbeperking: andere omstandigheden moeten gelijk blijven, of de tussenwaarde volgt uit de rechte-lijnaanname. Het model garandeert geen werkelijke opkomst. Een optimale nieuwe prijs hoeft voor deze vraag niet te worden berekend.','Welke drie onderdelen maken dit advies onderbouwd?','Gebruik de jaarindex uit C niet voor het bezoekersadvies.','Controleer of elk antwoord bij de juiste bron staat.');
}
{
 const s=slide('Antwoordcontrole bij opgave 36');
 const rows=[['Bron A','a–b: middel, doel, totalen en beste alternatief'],['Bron B','c–d: assen, eenheden, schaal en tussenwaarde'],['Bron C','e–f: vaste indexbasis en oude waarde voor groei'],['Bron B','g: resultaat, bezoekersdoel en modelbeperking']];
 rows.forEach((r,i)=>{let y=213+i*138;text(s,r[0],60,y,320,56,38,{bold:true,color:C.blue});text(s,r[1],425,y,1110,89,36);});
 text(s,'Verbeter een ontbrekende stap of onjuiste verklaring in je eigen werk.',60,794,1480,47,32,{bold:true});
 notes(s,'40–41','Loop a–g langs zonder nieuwe rekenstof toe te voegen. a: beperkte aula, twee uur, 120 en 150, cultuuratelier. b: 120 gemist alternatief tegenover 30 voordeel. c: juiste (Q;P)-paren en lijnstukken. d: 120 bezoekers. e: 120 en 150, 25% groei. f: 30 indexpunten en 25%. g: 120<130, advies en een modelbeperking. Vraag leerlingen een concrete ontbrekende stap te verbeteren. Dit is een controle van hun eigen uitwerking, geen claim dat alle handelingen duurzaam beheerst zijn.','Welke bron of controle ontbrak nog in jouw antwoord?','Een juist eindgetal vervangt de gevraagde redenering of eenheid niet.','Sluit af met hetzelfde overzicht en het volledige huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,overviewSlides:overviews,tableSlides:tables,chartSlides:charts,assignment},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
// The exporter derives marker fill from the series line. Explicitly fill the
// marker-only first reveal, without adding point overrides that PowerPoint
// renders as connecting line segments. Data and axes stay native and unchanged.
execFileSync(PYTHON,['-c',`
from zipfile import ZipFile
from lxml import etree as E
import sys
f=sys.argv[1]
ns={'c':'http://schemas.openxmlformats.org/drawingml/2006/chart','a':'http://schemas.openxmlformats.org/drawingml/2006/main'}
with ZipFile(f) as z: parts=[(i,z.read(i.filename)) for i in z.infolist()]
with ZipFile(f,'w') as out:
 for i,data in parts:
  if '/charts/' in i.filename and i.filename.endswith('.xml'):
   root=E.fromstring(data)
   for ser in root.findall('.//c:ser',ns):
    if ser.findtext('c:tx/c:v',namespaces=ns) != 'Model bron B': continue
    marker=ser.find('c:marker',ns)
    sp=marker.find('c:spPr',ns)
    if sp is not None: marker.remove(sp)
    sp=E.SubElement(marker,'{'+ns['c']+'}spPr')
    fill=E.SubElement(sp,'{'+ns['a']+'}solidFill'); E.SubElement(fill,'{'+ns['a']+'}srgbClr',val='17658A')
    ln=E.SubElement(sp,'{'+ns['a']+'}ln',w='19050'); fill=E.SubElement(ln,'{'+ns['a']+'}solidFill'); E.SubElement(fill,'{'+ns['a']+'}srgbClr',val='17658A')
   data=E.tostring(root,xml_declaration=True,encoding='UTF-8')
  out.writestr(i,data)
`,draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'1.1.4 Gemengde opgaven – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...[...new Set(tables)].flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:[...new Set(tables)],requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({finalPath:result.finalPath,slides:p.slides.items.length,overviews,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
