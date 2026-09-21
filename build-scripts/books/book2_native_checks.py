"""Validate actual rendered text bounds, including absolute-positioned panels."""

def check_layout(document):
    def walk(box):
        box=getattr(box,'_box',box)
        yield box
        for child in getattr(box,'children',()):yield from walk(child)
    failures=[]
    for number,page in enumerate(document.pages,1):
        for box in walk(page._page_box):
            element=getattr(box,'element',None)
            if element is None or not element.get('data-layout-width'):continue
            # Only the outer positioned block; inline descendants share element.
            if type(box).__name__ not in ('BlockBox','InlineBlockBox'):continue
            texts=[b for b in walk(box) if type(b).__name__=='TextBox']
            if not texts:continue
            if any(b.position_x < -.5 or b.position_y < -.5 or
                   b.position_x+b.width > page.width+.5 or
                   b.position_y+b.height > page.height+.5 for b in texts):
                failures.append(f'page {number}: native text outside physical page: '+''.join(b.text for b in texts)[:70])
            # WeasyPrint uses CSS px, while the source contract uses points.
            max_width=float(element.get('data-layout-width'))*4/3
            max_height=float(element.get('data-layout-height'))*4/3
            right=max(b.position_x+b.width for b in texts)-box.position_x
            bottom=max(b.position_y+b.height for b in texts)-box.position_y
            if right>max_width+.5 or bottom>max_height+.5:
                failures.append(f'page {number}: native text overflow ({right:.1f}/{max_width:.1f}, {bottom:.1f}/{max_height:.1f}): '+''.join(b.text for b in texts)[:70])
    if failures:raise ValueError('\n'.join(failures))
