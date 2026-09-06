"""HOW TO ADAPT: pure §214 SVG source, frozen plan geometry and source/answer roles.

No file writes, imports of native workers or subprocesses. All text is 40px;
never shrink a label to fit. Actual rendered ink and every figure require review.
"""
from html import escape

INK = "#1F2937"
TK = "#2D3748"
TO = "#1A5276"
WIDTH, HEIGHT = 1200, 1050
TITLES = [
    "Lichtservice: gegeven TK, TO en bronpunten zonder antwoordmarkeringen.",
    "Lichtservice: break-even, zones en verticale winstafstand binnen het normale bereik.",
    "SmoothBox: gegeven TK, TO en bronpunten met de normale grens 700.",
    "SmoothBox: break-even en bereik met de snelste positieve winstgroei.",
]


def n(v):
    return f"{float(v):.6f}".rstrip("0").rstrip(".")


def text(x, y, value, anchor="start", role="label", color=INK):
    return (f'<text x="{n(x)}" y="{n(y)}" text-anchor="{anchor}" '
            f'font-family="Arial" font-size="40px" font-weight="400" '
            f'fill="{color}" data-role="{role}">{escape(str(value))}</text>')


def line(x1, y1, x2, y2, role, color=INK, width=3, dash=""):
    return (f'<line x1="{n(x1)}" y1="{n(y1)}" x2="{n(x2)}" y2="{n(y2)}" '
            f'stroke="{color}" stroke-width="{width}" data-role="{role}"'
            + (f' stroke-dasharray="{dash}"' if dash else "") + '/>')


def dot(x, y, role, fill=INK, r=6):
    return f'<circle cx="{n(x)}" cy="{n(y)}" r="{r}" fill="{fill}" stroke="{INK}" stroke-width="2" data-role="{role}"/>'


def label_leader(px, py, x, y, value):
    from PIL import ImageFont
    font=ImageFont.truetype("C:/Windows/Fonts/arial.ttf",40)
    left,top,right,bottom=font.getbbox(value,anchor="ls")
    left,top,right,bottom=x+left,y+top,x+right,y+bottom
    if py < top:
        ex,ey=min(max(px,left),right),top-8
    elif py > bottom:
        ex,ey=min(max(px,left),right),bottom+8
    elif px < left:
        ex,ey=left-8,min(max(py,top),bottom)
    else:
        ex,ey=right+8,min(max(py,top),bottom)
    return line(px,py,ex,ey,"source-leader",width=1.8)


def figure(index):
    smooth = index >= 3
    answer = index % 2 == 0
    qmax, ymax = (1000, 5000) if smooth else (55, 360)
    X = lambda q: 160 + 880 * q / qmax
    Y = lambda euros: 820 - 670 * euros / ymax
    points = ([(0, 1200, 0), (700, 2600, 3500), (800, 2900, 4000),
               (900, 3250, 4500), (1000, 3650, 5000)] if smooth else
              [(0, 100, 0), (20, 150, 120), (40, 200, 240),
               (45, 220, 270), (55, 275, 330)])
    body = [text(160, 50, "TK en TO (€ per dag)", role="axis-title"),
            text(1180, 50, "SmoothBox" if smooth else "Lichtservice", "end", "heading")]
    for value in (range(0, 5001, 1000) if smooth else range(0, 361, 60)):
        body += [line(150, Y(value), 160, Y(value), "tick"),
                 text(135, Y(value)+14, str(value), "end", "tick-label")]
        if value:
            body.append(line(160, Y(value), 1040, Y(value), "grid", "#CBD5E0", 1, "3 9"))
    for value in ([0, 200, 400, 600, 800, 1000] if smooth else [0, 10, 20, 30, 40, 55]):
        body += [line(X(value), 820, X(value), 832, "tick"),
                 text(X(value), 876, str(value), "middle", "tick-label")]
    if not smooth:
        body.append(line(X(50), 820, X(50), 830, "minor-tick"))
    body += [line(160, 150, 160, 820, "axis", width=4),
             line(160, 820, 1040, 820, "axis", width=4),
             text(600, 1026, "Q (lunchboxen per dag)" if smooth else "Q (montages per dag)", "middle", "axis-title")]
    if smooth:
        body += [line(X(700), Y(3500), X(700), 820, "normal-limit", width=2, dash="3 10"),
                 text(160, 108, "Normale grens 700: stippellijn", role="source-boundary")]
    else:
        body.append(text(160, 108, "Normale afspraken: 0–40 montages", role="source-boundary"))
    for column, identity, color, dash in [(1, "TK", TK, "16 11"), (2, "TO", TO, "")]:
        coords = ' '.join(f"{n(X(row[0]))},{n(Y(row[column]))}" for row in points)
        body.append(f'<polyline points="{coords}" fill="none" stroke="{color}" stroke-width="5"'
                    f' data-role="curve-{identity}"' + (f' stroke-dasharray="{dash}"' if dash else '') + '/>')
        for q, tk, to in points:
            body.append(dot(X(q), Y(tk if column == 1 else to), f"source-{identity}-{q}", color))
    # Explicit point identities in wide leader lanes, not small crowded text.
    labels = ([
        (0, 1200, 220, 550, "TK: Q=0"), (0, 0, 230, 810, "TO: Q=0"),
        (700, 2600, 530, 590, "TK: Q=700"), (700, 3500, 420, 335, "TO: Q=700"),
        (800, 2900, 540, 670, "TK: Q=800"), (800, 4000, 550, 250, "TO: Q=800"),
        (900, 3250, 870, 535, "TK: Q=900"), (900, 4500, 665, 190, "TO: Q=900"),
        (1000, 3650, 900, 620, "TK: Q=1000"), (1000, 5000, 860, 108, "TO: Q=1000"),
    ] if smooth else [
        (0, 100, 220, 655, "TK: Q=0"), (0, 0, 230, 810, "TO: Q=0"),
        (20, 150, 265, 440, "TK: Q=20"), (20, 120, 400, 760, "TO: Q=20"),
        (40, 200, 635, 550, "TK: Q=40"), (40, 240, 475, 300, "TO: Q=40"),
        (45, 220, 870, 610, "TK: Q=45"), (45, 270, 740, 245, "TO: Q=45"),
        (55, 275, 1060, 325, "TK55"), (55, 330, 1060, 222, "TO55"),
    ])
    for q, euros, x, y, label in labels:
        if smooth and label == "TK: Q=1000":
            body += [line(X(q),Y(euros),1180,Y(euros),"source-leader",width=1.8),
                     line(1180,Y(euros),1180,600,"source-leader",width=1.8),
                     line(1180,600,1134,600,"source-leader",width=1.8)]
        elif not smooth and label == "TK: Q=45":
            body += [line(X(q),Y(euros),1030,Y(euros),"source-leader",width=1.8),
                     line(1030,Y(euros),1030,573,"source-leader",width=1.8)]
        else:
            body.append(label_leader(X(q),Y(euros),x,y,label))
        body.append(text(x, y, label, role="source-point-label"))
    if answer:
        beq, bem = (400, 2000) if smooth else (200/7, 1200/7)
        right = 700 if smooth else 40
        body += [dot(X(beq), Y(bem), "break-even", "white", 9),
                 line(X(beq), Y(bem), X(beq), 820, "answer-projection", width=2, dash="8 8")]
        # Range under the axis: open zero-profit endpoint, closed normal endpoint.
        body += [line(X(beq), 915, X(right), 915, "positive-fastest-range", width=4),
                 dot(X(beq), 915, "range-open", "white", 7),
                 dot(X(right), 915, "range-closed", INK, 7)]
        if smooth:
            body += [text(850, 740, "BE (400; 2.000)", role="answer-label"),
                     line(X(beq),Y(bem),X(beq),735,"answer-leader",width=2),
                     line(X(beq),735,842,735,"answer-leader",width=2),
                     text(600, 974, "Snelste positieve groei: 400 < Q ≤ 700", "middle", "answer-label")]
        else:
            body += [text(170, 360, "BE ≈ (28,57; 171,43)", role="answer-label"),
                     line(560, 368, X(beq), Y(bem), "answer-leader", width=2),
                     line(X(40), Y(200), X(40), Y(240), "profit-distance", width=5),
                     line(X(40)-10, Y(200), X(40)+10, Y(200), "profit-cap"),
                     line(X(40)-10, Y(240), X(40)+10, Y(240), "profit-cap"),
                     text(870, 475, "W = 40", role="answer-label"),
                     line(875, 440, X(40), (Y(200)+Y(240))/2, "answer-leader", width=2),
                     text(180, 195, "Verlies: Q < 200/7", role="answer-label"),
                     text(180, 245, "Winst: 200/7 < Q ≤ 40", role="answer-label"),
                     text(600, 974, "Snelste positieve groei: 200/7 < Q ≤ 40", "middle", "answer-label")]
    else:
        body += [text(600, 934, "TK: gestreept · TO: doorgetrokken", "middle", "legend"),
                 text(600, 982, "Bronpunten: Q bij TK of TO", "middle", "legend")]
    title = TITLES[index-1]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1050" viewBox="0 0 1200 1050" '
            f'role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title>'
            '<desc id="desc">Gegeven totale bedragen en bronpunten met assen in hoeveelheid per dag en euro per dag. '
            + ('Antwoordmarkeringen staan uitsluitend in deze antwoordfiguur.' if answer else 'Geen gevraagde antwoordmarkeringen.')
            + '</desc><rect width="1200" height="1050" fill="white"/>\n'
            + '\n'.join(body) + '\n</svg>\n')


def asset_sources():
    return {f"2.1.4_ex_{i}.svg": figure(i) for i in range(1, 5)}
