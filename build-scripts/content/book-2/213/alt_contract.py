"""Exact §213 short alternatives and retained captions; not a shared sanitizer."""
import base64
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup

CAPTIONS = {
    '2.1.3_fig_1': 'Dezelfde dag: de tabelstappen van 0 naar 10 en van 10 naar 20 fotohouders, met TK 20, 50 en 100 euro.',
    '2.1.3_fig_2': 'Dezelfde kostentabel met delta TK 30 en 50 euro, telkens delta Q 10, en MK 3 en 5 euro bij de rechter eindpunten.',
    '2.1.3_fig_3': 'Bij dezelfde hoeveelheden 0, 10 en 20 zijn de opbrengsten 0, 80 en 160 euro. Beide intervallen leveren 80 euro extra voor 10 extra producten: MO is telkens 8.',
    '2.1.3_fig_4': 'Twee intervalkaarten: winst van min 20 naar 30 geeft 50 gedeeld door 10 is 5; winst van 30 naar 60 geeft 30 gedeeld door 10 is 3. Dit is telkens MO min MK.',
    '2.1.3_we_1': 'Lus heeft over drie stappen MK 2 en MO 6; Bout heeft MK 2, 6 en 10 en MO 12. De eerste teller en noemer zijn uitgewerkt; waarden horen bij het rechter eindpunt.',
    '2.1.3_ex_1': 'Patches: uitgewerkt interval 0–3; vul interval 3–6 zelf aan.',
}
SHORT_ALTS = {
    **CAPTIONS,
    '2.1.3_fig_3': 'MO bij vaste prijs: 80 euro extra opbrengst voor 10 extra fotohouders in beide intervallen, dus 8 euro per houder.',
    '2.1.3_fig_4': 'Winsttoename per extra fotohouder: 5 euro in interval 0–10 en 3 euro in interval 10–20, telkens MO min MK.',
    '2.1.3_we_1': 'Eindpuntrijen van Lus en Bout: MK 2/2/2 tegenover 2/6/10; MO steeds 6 en 12 euro per extra sleutelhanger.',
}
CORRECTED = ('2.1.3_fig_3', '2.1.3_fig_4', '2.1.3_we_1')
NOUN_STARTS = ('Dezelfde dag:', 'Dezelfde kostentabel', 'MO bij vaste prijs:',
               'Winsttoename per extra fotohouder:', 'Eindpuntrijen van Lus en Bout:', 'Patches:')
TITLES = {
    '2.1.3_fig_1': 'Twee intervallen in de kostentabel; Q in fotohouders per dag, TK in euro per dag',
    '2.1.3_fig_2': 'MK berekend en geplaatst bij het rechter eindpunt; eerste en tweede interval',
    '2.1.3_fig_3': 'MO in dezelfde hoeveelheidstabel; vaste prijs per fotohouder',
    '2.1.3_fig_4': 'Totale winst en gemiddelde winsttoename zijn verschillende grootheden',
    '2.1.3_we_1': 'Drie eindpuntrijen van Lus en Bout; constante en stijgende MK',
    '2.1.3_ex_1': 'Eerste interval volledig gesteund; tweede interval met lege breuken en cellen',
}


def verify_html(html, kind, folder):
    soup = BeautifulSoup(html, 'html.parser')
    names = list(CAPTIONS) if kind == 'paragraaf' else ['2.1.3_we_1', '2.1.3_ex_1'] if kind == 'opgaven' else []
    images = soup.find_all('img')
    assert len(images) == len(names), (kind, 'complete image inventory')
    result = []
    for name, image in zip(names, images):
        assert image['src'].startswith('data:image/png;base64,')
        assert base64.b64decode(image['src'].split(',', 1)[1]) == (folder/'_assets'/f'{name}.png').read_bytes(), (kind, name, 'image identity')
        alt = image['alt']
        assert alt == SHORT_ALTS[name], (kind, name, 'short alt drift')
        assert 0 < len(alt) <= 120 and alt.startswith(NOUN_STARTS), (kind, name, 'short alt policy')
        figure = image.find_parent('figure')
        assert figure is not None and figure.figcaption is not None
        caption = ' '.join(figure.figcaption.get_text().split())
        assert caption == CAPTIONS[name], (kind, name, 'full caption drift')
        if name in CORRECTED:
            assert alt != CAPTIONS[name] and not figure.figcaption.has_attr('aria-hidden'), (kind, name, 'native distinct-caption semantics')
        result.append({'asset': name, 'alt': alt, 'length': len(alt), 'caption': caption,
                       'caption_attributes': figure.figcaption.attrs})
    return result


def verify_title(name, source):
    svg = ET.fromstring(source)
    title = svg.find('{http://www.w3.org/2000/svg}title')
    assert svg.get('role') == 'img' and svg.get('aria-labelledby') == 'title'
    assert title is not None and title.get('id') == 'title'
    assert title.text == TITLES[name] and 0 < len(title.text) <= 120, (name, 'accessible title drift')
    return {'asset': name, 'title': title.text, 'length': len(title.text)}
