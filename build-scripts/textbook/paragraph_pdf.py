#!/usr/bin/env python3
"""HOW TO ADAPT: change the shared CSS/AST transforms and their fixture tests,
not copied Python regex snippets in lesson folders. Requires Pandoc + WeasyPrint.
Usage: python paragraph_pdf.py <paragraph-folder>
"""
import argparse
import html
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent
SUFFIXES = ('paragraaf', 'opgaven', 'antwoorden', 'samenvatting', 'toets', 'toetsmatrijs')


def plain(node):
    if isinstance(node, list):
        return ' '.join(plain(item) for item in node)
    if isinstance(node, dict):
        if node.get('t') == 'Str':
            return node['c']
        return plain(node.get('c', []))
    return ''


def has_image(node):
    if isinstance(node, list):
        return any(has_image(item) for item in node)
    return isinstance(node, dict) and (node.get('t') in ('Image', 'Figure') or has_image(node.get('c', [])))


def prepare_ast(document):
    """Keep a figure with its immediate instruction. Preserve native ordered-list
    start/style and bullet AST nodes: tables must not reset subquestion letters.
    Authors can use ::: figure-context for other groups requiring cohesion.
    """
    blocks = []
    for block in document['blocks']:
        if has_image(block) and block['t'] in ('Para', 'Figure'):
            group = [block]
            if blocks and blocks[-1]['t'] == 'Para' and re.search(r'\bfiguur\b', plain(blocks[-1]), re.I):
                group.insert(0, blocks.pop())
            block = {'t': 'Div', 'c': [['', ['figure-context'], []], group]}
        blocks.append(block)
    document['blocks'] = blocks
    return document


def pandoc(args, text):
    result = subprocess.run(['pandoc', *args], input=text, encoding='utf-8',
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    if result.stderr.strip():
        raise ValueError('Pandoc conversion requires attention: ' + result.stderr.strip())
    return result.stdout


def render_html(markdown, title):
    document = json.loads(pandoc(['--from=markdown+fancy_lists', '--to=json'], markdown))
    body = pandoc(['--from=json', '--to=html5'], json.dumps(prepare_ast(document), ensure_ascii=False))
    css = (ROOT / 'paragraph.css').read_text(encoding='utf-8')
    return ('<!doctype html>\n<html lang="nl"><head><meta charset="utf-8">'
            f'<title>{html.escape(title)}</title><style>{css}</style></head><body>{body}</body></html>\n')


def build(folder):
    from weasyprint import HTML, default_url_fetcher
    folder = Path(folder).resolve()
    if not re.match(r'^\d+\.\d+\.\d+\s+.+', folder.name):
        raise ValueError('Expected paragraph folder X.Y.Z Name')
    sources = sorted(p for p in folder.glob('*.md')
                     if any(p.stem.replace('–', '-').endswith(' - ' + suffix) for suffix in SUFFIXES))
    if not sources:
        raise ValueError('No textbook Markdown inputs')

    fetch_errors = []

    def fetch_local_input(url, *args, **kwargs):
        parsed = urlparse(url)
        if parsed.scheme == 'data':
            return default_url_fetcher(url, *args, **kwargs)
        if parsed.scheme != 'file':
            raise ValueError('PDF inputs must be local files')
        # url2pathname handles Windows drive letters and escaped filenames.
        from urllib.request import url2pathname
        target = Path(url2pathname(unquote(parsed.path))).resolve()
        if parsed.netloc not in ('', 'localhost') or not target.is_relative_to(folder):
            raise ValueError('PDF input escapes paragraph folder')
        return default_url_fetcher(url, *args, **kwargs)

    def local_fetch(url, *args, **kwargs):
        try:
            return fetch_local_input(url, *args, **kwargs)
        except Exception as error:
            fetch_errors.append(f'{url}: {error}')
            raise

    outputs = []
    for source in sources:
        markup = render_html(source.read_text(encoding='utf-8'), source.stem)
        pdf = HTML(string=markup, base_url=str(folder) + '/', url_fetcher=local_fetch).write_pdf(presentational_hints=True)
        if fetch_errors:
            raise ValueError('Missing or forbidden rendering inputs: ' + '; '.join(fetch_errors))
        source.with_suffix('.html').write_text(markup, encoding='utf-8', newline='\n')
        source.with_suffix('.pdf').write_bytes(pdf)
        outputs.extend([source.with_suffix('.html'), source.with_suffix('.pdf')])
    return outputs


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('folder', type=Path)
    for output in build(parser.parse_args().folder):
        print(output)
