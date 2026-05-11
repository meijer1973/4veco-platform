#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Convert 'presentatie.pptx' to a self-contained sibling HTML page.

Usage: python convert_presentatie.py [paragraph_folder_path]
       python convert_presentatie.py --all   (processes all paragraphs)

L1.5D Phase D2 — PPTX as web. Renders slide content as semantic HTML
(one <section class="slide"> per slide) with extracted text, embedded
images, and structured Vraag/Uitleg/Pitfall/Overgang speaker notes in a
collapsible <details> block per slide.

T1 (this commit) ships the converter skeleton + notes parser + minimal
single-column HTML so the deploy + landing-page pipeline is wired
end-to-end. T2 will replace `render_slide_body` with responsive
re-layout from pptx XML (kicker/title/body inference, S5 4-card cluster
detect, S6 pseudo-table detect, dark/light master classes, sticky
sidebar nav, IntersectionObserver active state). T2 changes do not
require schema changes — the slide-dict shape produced here is the
contract.
"""
import sys, io, os, glob, html as html_mod, re, hashlib
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def esc(text):
    return html_mod.escape(text if text is not None else '')


def find_paragraph_info(folder_path):
    """Extract paragraph number and name from folder path."""
    basename = os.path.basename(folder_path.rstrip('/\\'))
    parts = basename.split(' ', 1)
    number = parts[0]
    if ' - ' in basename:
        name = basename.split(' - ', 1)[1]
    else:
        name = parts[1] if len(parts) > 1 else basename
    return number, name


def get_cnvpr_descr(shape):
    """Return the descr attribute on the picture's cNvPr element, or ''."""
    try:
        xs = shape._element.xpath('.//*[local-name()="cNvPr"]/@descr')
        if xs:
            return xs[0]
    except Exception:
        pass
    return ''


def get_slide_master_name(slide):
    """Return the layout name for a slide, or '' if not retrievable.

    pptxgenjs serializes `addSlide({masterName:'DARK_HERO'})` as the
    slide LAYOUT name, not the slide-master name (the master itself is
    unnamed in pptxgenjs-built decks). The convention used in this
    project is 'LIGHT_ED' for light editorial slides and 'DARK_HERO'
    for dark hero/title/summary slides.
    """
    try:
        return slide.slide_layout.name or ''
    except Exception:
        return ''


def master_theme_class(master_name):
    """Map master name to 'slide--light' or 'slide--dark' CSS hook.

    Anything containing 'DARK' is dark; everything else (including '' and
    legacy decks) is light. Conservative default so a deck without master
    name doesn't accidentally render dark.
    """
    if 'DARK' in (master_name or '').upper():
        return 'slide--dark'
    return 'slide--light'


# ─────────────────────────────────────────────────────────────────────────────
# Notes parsing — Vraag / Uitleg / Pitfall / Overgang
# ─────────────────────────────────────────────────────────────────────────────

NOTE_KEYS = ('Vraag', 'Uitleg', 'Pitfall', 'Overgang')
# Matches a key prefix at the start of any line. Supports "Vraag:" with
# or without trailing whitespace. The first capture group is the key,
# the rest of the line (and continuation lines until the next key) is
# the body.
_NOTE_KEY_RE = re.compile(r'^(Vraag|Uitleg|Pitfall|Overgang)\s*:\s*(.*)$', re.MULTILINE)


def parse_notes(text):
    """Split speaker-notes text into structured dict and raw fallback.

    Returns {'structured': [(key, body), ...], 'raw': raw_text}.
    `structured` preserves source order (typically Vraag → Uitleg →
    Pitfall → Overgang but the parser tolerates any order or missing
    keys). When no canonical key is found `structured` is empty and the
    caller falls back to `raw`.

    Body text retains internal newlines; the renderer normalizes them.
    """
    if not text or not text.strip():
        return {'structured': [], 'raw': ''}

    matches = list(_NOTE_KEY_RE.finditer(text))
    if not matches:
        return {'structured': [], 'raw': text.strip()}

    structured = []
    for i, m in enumerate(matches):
        key = m.group(1)
        body_start = m.end()
        body_end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        # Re-include the first-line tail (group 2) plus continuation lines.
        first_line = m.group(2)
        rest = text[body_start:body_end]
        body = (first_line + '\n' + rest).strip('\n').rstrip()
        structured.append((key, body))
    return {'structured': structured, 'raw': text.strip()}


def render_notes(parsed):
    """Render parsed notes as a <details><dl>...</dl></details> block."""
    if not parsed['structured'] and not parsed['raw']:
        return ''
    inner_parts = []
    if parsed['structured']:
        inner_parts.append('      <dl class="slide-notes-list">')
        for key, body in parsed['structured']:
            inner_parts.append(f'        <dt class="slide-notes-key">{esc(key)}</dt>')
            inner_parts.append(
                '        <dd class="slide-notes-body">'
                + _render_notes_body(body)
                + '</dd>'
            )
        inner_parts.append('      </dl>')
    else:
        inner_parts.append(
            f'      <p class="slide-notes-fallback">{esc(parsed["raw"])}</p>'
        )
    return (
        '    <details class="slide-notes">\n'
        '      <summary>Docententoelichting (Vraag · Uitleg · Pitfall · Overgang)</summary>\n'
        + '\n'.join(inner_parts) + '\n'
        '    </details>\n'
    )


def _render_notes_body(body):
    """Render a single notes body, preserving paragraph and indent bullets.

    Lines starting with '•' or '·' (after optional indent) become bullet
    list items; consecutive paragraphs become separate <p> tags.
    Newlines preserved as <br> within a paragraph.
    """
    if not body:
        return ''
    lines = body.split('\n')
    out_parts = []
    para_buf = []
    bullet_buf = []

    def flush_para():
        if para_buf:
            out_parts.append('<p>' + '<br>'.join(esc(l.strip()) for l in para_buf) + '</p>')
            para_buf.clear()

    def flush_bullets():
        if bullet_buf:
            out_parts.append(
                '<ul>' + ''.join(f'<li>{esc(l)}</li>' for l in bullet_buf) + '</ul>'
            )
            bullet_buf.clear()

    for line in lines:
        stripped = line.strip()
        if not stripped:
            flush_para()
            flush_bullets()
            continue
        if stripped[0] in ('•', '·'):
            flush_para()
            bullet_buf.append(stripped.lstrip('•·').strip())
        else:
            flush_bullets()
            para_buf.append(line)
    flush_para()
    flush_bullets()
    return ''.join(out_parts)


# ─────────────────────────────────────────────────────────────────────────────
# Slide walk + image extraction
# ─────────────────────────────────────────────────────────────────────────────

def extract_slide(slide, slide_idx, assets_dir, image_cache, asset_prefix='_assets'):
    """Walk one slide; return a slide dict.

    Slide dict shape (the contract T2 will refine the renderer against):
      {
        'idx': 1-based slide number,
        'master_name': raw master name string,
        'theme_class': 'slide--light' or 'slide--dark',
        'text_frames': [{'text': str, 'top_emu': int, 'left_emu': int,
                          'height_emu': int, 'width_emu': int,
                          'max_font_pt': int_or_None,
                          'all_caps': bool, 'is_decorative_empty': bool}],
        'images': [{'src': asset-relative path, 'alt': str}],
        'notes': parsed-notes dict,
      }

    image_cache is a dict {sha1: (relative_src_path, alt)} so the same image
    embedded on multiple slides (e.g. we_1 on slides 6 and 7) shares one
    extracted file rather than duplicating.
    """
    text_frames = []
    images = []

    for shape in slide.shapes:
        if shape.shape_type == MSO_SHAPE_TYPE.PICTURE:
            try:
                img = shape.image
                blob = img.blob
                ext = img.ext or 'png'
                h = hashlib.sha1(blob).hexdigest()[:12]
                if h in image_cache:
                    src, alt = image_cache[h]
                else:
                    fname = f'presentatie-slide{slide_idx}-img-{h}.{ext}'
                    out_path = os.path.join(assets_dir, fname)
                    if not os.path.exists(out_path):
                        os.makedirs(assets_dir, exist_ok=True)
                        with open(out_path, 'wb') as f:
                            f.write(blob)
                    src = f'{asset_prefix}/{fname}'
                    alt = get_cnvpr_descr(shape) or ''
                    image_cache[h] = (src, alt)
                images.append({'src': src, 'alt': alt})
            except Exception as e:
                # Surface but don't fail the conversion — slide stays renderable.
                sys.stderr.write(
                    f'WARNING: slide {slide_idx}: image extract failed: {e}\n'
                )
            continue

        if not shape.has_text_frame:
            continue
        tf = shape.text_frame
        text = '\n'.join(p.text for p in tf.paragraphs).strip('\n')
        # Find largest font size used in this frame (in pt). python-pptx
        # returns None when font is inherited; treat as 0 so explicit sizes
        # dominate the title-inference heuristic in T2.
        max_pt = 0
        for p in tf.paragraphs:
            for r in p.runs:
                sz = r.font.size
                if sz is None:
                    continue
                pt = sz.pt if hasattr(sz, 'pt') else int(sz) / 12700
                if pt > max_pt:
                    max_pt = pt
        text_frames.append({
            'text': text,
            'top_emu':    shape.top if shape.top is not None else 0,
            'left_emu':   shape.left if shape.left is not None else 0,
            'height_emu': shape.height if shape.height is not None else 0,
            'width_emu':  shape.width if shape.width is not None else 0,
            'max_font_pt': max_pt or None,
            'all_caps': bool(text) and text.upper() == text and any(c.isalpha() for c in text),
            'is_decorative_empty': not text.strip(),
        })

    # Speaker notes
    notes_text = ''
    if slide.has_notes_slide:
        try:
            notes_text = slide.notes_slide.notes_text_frame.text or ''
        except Exception:
            notes_text = ''
    parsed_notes = parse_notes(notes_text)

    master_name = get_slide_master_name(slide)
    return {
        'idx': slide_idx,
        'master_name': master_name,
        'theme_class': master_theme_class(master_name),
        'text_frames': text_frames,
        'images': images,
        'notes': parsed_notes,
    }


# ─────────────────────────────────────────────────────────────────────────────
# T1 minimal renderer — single-column scroll, will be replaced in T2
# ─────────────────────────────────────────────────────────────────────────────

def render_slide_body(slide):
    """Render the inner HTML of one <section class="slide">.

    T1 implementation: flat output — kicker (longest ALL-CAPS short text
    frame at the top), title (largest-font frame), remaining frames as
    <p class="slide-text">, then images, then notes. T2 will replace
    this with layout-aware emission (card clusters, pseudo-table,
    sticky sidebar).
    """
    frames = [f for f in slide['text_frames'] if not f['is_decorative_empty']]

    # Title: largest max_font_pt; tie-break on earliest top.
    title_frame = None
    if frames:
        candidates = sorted(
            frames,
            key=lambda f: (-(f['max_font_pt'] or 0), f['top_emu']),
        )
        title_frame = candidates[0]

    # Kicker: short ALL-CAPS frame, top half of slide, NOT the title.
    kicker_frame = None
    for f in frames:
        if f is title_frame:
            continue
        if f['all_caps'] and len(f['text']) < 80 and f['top_emu'] < 1500000:
            kicker_frame = f
            break

    # Body: every other frame, ordered (top, left).
    body_frames = [
        f for f in frames if f is not title_frame and f is not kicker_frame
    ]
    body_frames.sort(key=lambda f: (f['top_emu'], f['left_emu']))

    parts = []
    if kicker_frame:
        parts.append(f'    <p class="slide-kicker">{esc(kicker_frame["text"])}</p>')
    if title_frame:
        parts.append(f'    <h2 class="slide-title">{esc(title_frame["text"])}</h2>')
    if body_frames:
        parts.append('    <div class="slide-body">')
        for f in body_frames:
            # Multi-paragraph frames: split on newlines, emit <p> per non-empty.
            for line in (ln for ln in f['text'].split('\n') if ln.strip()):
                parts.append(f'      <p class="slide-text">{esc(line.strip())}</p>')
        parts.append('    </div>')
    for img in slide['images']:
        alt = img['alt'] or ''
        parts.append(
            f'    <figure class="slide-figure">'
            f'<img src="{esc(img["src"])}" alt="{esc(alt)}">'
            f'</figure>'
        )
    notes_html = render_notes(slide['notes'])
    if notes_html:
        parts.append(notes_html.rstrip('\n'))
    return '\n'.join(parts) + '\n'


def render_html(slides, para_number, para_name, shared_prefix='../../shared'):
    docx_filename = f'{para_number} {para_name} – presentatie.pptx'

    hero = (
        '  <header class="hero">\n'
        '    <div class="hero-inner">\n'
        '      <a class="back-link" href="../index.html"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg> Terug naar overzicht</a>\n'
        f'      <span class="hero-badge">{esc(para_number)} &middot; Presentatie</span>\n'
        f'      <h1>{esc(para_name)} &mdash; Presentatie</h1>\n'
        f'      <p class="hero-sub">{len(slides)} dia\'s &middot; les-presentatie met sprekersnotities</p>\n'
        '      <div class="hero-actions">\n'
        f'        <a class="hero-action" href="{esc(docx_filename)}" download>Download als PowerPoint</a>\n'
        '      </div>\n'
        '    </div>\n'
        '  </header>\n'
    )

    sidebar_items = []
    for s in slides:
        # Derive short label: largest-font text frame, truncated.
        label = ''
        for f in s['text_frames']:
            if f['is_decorative_empty']:
                continue
            label = f['text']
            break
        # Prefer a title-like frame for the label.
        title_candidates = [
            f for f in s['text_frames']
            if not f['is_decorative_empty'] and not f['all_caps']
        ]
        if title_candidates:
            title_candidates.sort(
                key=lambda f: (-(f['max_font_pt'] or 0), f['top_emu']),
            )
            label = title_candidates[0]['text']
        label_short = (label or 'Dia').split('\n')[0]
        if len(label_short) > 32:
            label_short = label_short[:31] + '…'
        sidebar_items.append(
            f'        <a class="nav-item" href="#slide-{s["idx"]}">'
            f'<span class="nav-num">{s["idx"]:02d}</span>'
            f'<span class="nav-title">{esc(label_short)}</span></a>'
        )

    sidebar = (
        '  <nav class="sidebar" id="sidebar">\n'
        '    <div class="sidebar-header">\n'
        f'      <h2>{esc(para_number)} {esc(para_name)}</h2>\n'
        '      <p>Presentatie</p>\n'
        '    </div>\n'
        + '\n'.join(sidebar_items) + '\n'
        '  </nav>\n'
    )

    section_blocks = []
    for s in slides:
        body = render_slide_body(s)
        section_blocks.append(
            f'      <section class="slide {s["theme_class"]}" id="slide-{s["idx"]}" data-slide="{s["idx"]}">\n'
            f'{body}'
            f'      </section>'
        )
    main_grid = (
        '    <main class="presentatie-grid">\n'
        + '\n'.join(section_blocks) + '\n'
        '    </main>\n'
    )

    boot_script = (
        '<script>\n'
        '(function(){try{var m=localStorage.getItem("quizMode");\n'
        'if(!m && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches){m="dark";}\n'
        'if(m==="dark"){document.documentElement.setAttribute("data-theme","dark");}\n'
        '}catch(e){}})();\n'
        '</script>'
    )

    return f'''<!doctype html>
<html lang="nl" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(para_name)} &mdash; Presentatie</title>
  <link rel="stylesheet" href="{shared_prefix}/voorkennis.css">
  {boot_script}
</head>
<body data-layout="presentatie-v1" data-accent-domain="economisch">
<button class="sidebar-toggle" id="sidebarToggle" aria-label="Menu">&#9776;</button>
<div class="sidebarOverlay" id="sidebarOverlay"></div>
<div class="page-layout">
{sidebar}  <div class="content">
{hero}{main_grid}  </div>
</div>
<script src="{shared_prefix}/voorkennis.js"></script>
</body>
</html>
'''


# ─────────────────────────────────────────────────────────────────────────────
# Per-paragraph processing + CLI
# ─────────────────────────────────────────────────────────────────────────────

def process_paragraph(para_folder):
    """Process a single paragraph folder.

    Returns 'ok' | 'skip' | 'error'. 'skip' means no presentatie.pptx
    found (acceptable — paragraph doesn't carry this surface yet).
    'error' means parse/IO failure — deploy.js must surface as exit 1.
    """
    para_number, para_name = find_paragraph_info(para_folder)
    pattern = os.path.join(para_folder, '*presentatie*.pptx')
    found = [f for f in glob.glob(pattern) if not os.path.basename(f).startswith('~$')]
    if not found:
        print(f'  SKIP {para_number}: no presentatie.pptx found')
        return 'skip'
    pptx_path = found[0]

    assets_dir = os.path.join(para_folder, '_assets')

    try:
        pres = Presentation(pptx_path)
    except Exception as e:
        print(f'  ERROR {para_number}: cannot open pptx: {e}')
        return 'error'

    image_cache = {}
    slides = []
    try:
        for i, slide in enumerate(pres.slides, 1):
            slides.append(extract_slide(slide, i, assets_dir, image_cache))
    except Exception as e:
        print(f'  ERROR {para_number}: slide parse failed: {e}')
        return 'error'

    if not slides:
        print(f'  SKIP {para_number}: pptx has zero slides')
        return 'skip'

    try:
        html_content = render_html(slides, para_number, para_name)
        html_path = os.path.join(
            para_folder, f'{para_number} {para_name} – presentatie.html'
        )
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
    except Exception as e:
        print(f'  ERROR {para_number}: html render failed: {e}')
        return 'error'

    # Surface alt-text gaps as a WARN (not error) so the deploy keeps going
    # but the author sees the issue.
    empty_alt = sum(1 for s in slides for img in s['images'] if not img['alt'])
    n_images  = sum(len(s['images']) for s in slides)
    n_notes_struct = sum(1 for s in slides if s['notes']['structured'])
    if empty_alt:
        sys.stderr.write(
            f'WARNING: {para_number}: {empty_alt}/{n_images} slide images '
            'have empty alt-text (descr); add altText to addImage calls in '
            'the paragraph pptx builder.\n'
        )
    print(
        f'  OK {para_number} {para_name} ({len(slides)} slides, '
        f'{n_images} images, {n_notes_struct} structured-notes)'
    )
    return 'ok'


def main():
    args = sys.argv[1:]
    if not args:
        print('Usage: python convert_presentatie.py [path] or --all')
        sys.exit(1)

    had_error = False
    if args[0] == '--all':
        base = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        siblings_root = os.path.dirname(base)
        folders = []
        for boek in sorted(glob.glob(os.path.join(siblings_root, '4veco-lessen', 'Boek*'))):
            for chap in sorted(glob.glob(os.path.join(boek, '*'))):
                if not os.path.isdir(chap):
                    continue
                for para in sorted(glob.glob(os.path.join(chap, '*'))):
                    if os.path.isdir(para):
                        folders.append(para)
        for f in sorted(glob.glob(os.path.join(base, '3.*/3.*.*'))):
            folders.append(f)
        print(f'Found {len(folders)} candidate paragraph folders')
        success = 0
        for folder in folders:
            result = process_paragraph(folder)
            if result == 'ok':
                success += 1
            elif result == 'error':
                had_error = True
        print(f'\nDone: {success}/{len(folders)} converted')
    else:
        result = process_paragraph(args[0])
        if result == 'error':
            had_error = True

    sys.exit(1 if had_error else 0)


if __name__ == '__main__':
    main()
