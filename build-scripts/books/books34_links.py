"""Append a whole PDF, resolving named destinations inside its own namespace.

PyMuPDF 1.26.7 drops named links on insert_pdf. Its get_links() exposes named
destination coordinates in PDF space; resolve_link() converts them to page
space. Do not copy those raw coordinates into an explicit LINK_GOTO.
"""
import math
import fitz


def resolved_links(source):
    pages = []
    for page in source:
        links = []
        for original in page.get_links():
            link = {k: v for k, v in original.items() if k not in ('xref', 'id')}
            if link['kind'] == fitz.LINK_NAMED:
                name = link.get('nameddest')
                if not name:
                    raise ValueError('Named link lacks a local destination')
                target, x, y = source.resolve_link('#nameddest='+name)
                if not 0 <= target < len(source) or not all(map(math.isfinite, (x, y))):
                    raise ValueError('Unresolved named destination '+name)
                link = {'kind': fitz.LINK_GOTO, 'from': link['from'],
                        'page': target, 'to': fitz.Point(x, y), 'zoom': link.get('zoom', 0)}
            if link['kind'] == fitz.LINK_GOTO and not 0 <= link['page'] < len(source):
                raise ValueError('Internal destination outside source document')
            links.append(link)
        pages.append(links)
    return pages


def insert_preserving_links(destination, source):
    """Append without duplicate annotations; preserve every original rectangle."""
    pages = resolved_links(source)  # Validate before changing the destination.
    offset = len(destination)
    destination.insert_pdf(source, links=False)
    for local_page, links in enumerate(pages):
        for original in links:
            link = dict(original)
            if link['kind'] == fitz.LINK_GOTO:
                link['page'] += offset
            destination[offset+local_page].insert_link(link)
    return sum(map(len, pages))
