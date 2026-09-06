"""HOW TO ADAPT: §224 actual native output/DOM/ink/page checker, not review.

The --rebuild path genuinely regenerates through the authorized native builder
and compares all fifteen bytes. It is not a mocked proof or acceptance gate.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import fitz
from bs4 import BeautifulSoup
from PIL import Image, ImageFont
from weasyprint import HTML

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_224 as b


def snapshot(folder):
    return {str(p.relative_to(folder)):b.digest(p) for p in b.native_paths(folder)}


def figure_ink(source):
    root=ET.fromstring(source)
    boxes=[]
    for node in root.findall("{http://www.w3.org/2000/svg}text"):
        font_path="C:/Windows/Fonts/arialbd.ttf" if node.attrib.get("font-weight")=="700" else "C:/Windows/Fonts/arial.ttf"
        font=ImageFont.truetype(font_path,40)
        x=float(node.attrib["x"]);y=float(node.attrib["y"])
        value=node.text or ""
        width=font.getlength(value)
        anchor=node.attrib["text-anchor"]
        if anchor=="middle":x-=width/2
        elif anchor=="end":x-=width
        # Baseline anchor yields actual raster font ink, not nominal em boxes.
        left,top,right,bottom=font.getbbox(value,anchor="ls")
        box=[x+left,y+top,x+right,y+bottom]
        if box[0]<12 or box[1]<12 or box[2]>1188 or box[3]>888:
            raise ValueError(f"Figure ink outside 12px padding: {value}: {box}")
        boxes.append({"text":value,"box":box})
    for i,a in enumerate(boxes):
        for c in boxes[i+1:]:
            aa,cc=a["box"],c["box"]
            dx=max(cc[0]-aa[2],aa[0]-cc[2],0)
            dy=max(cc[1]-aa[3],aa[1]-cc[3],0)
            if dx<8 and dy<8:
                raise ValueError(f"Figure labels closer than8px: {a['text']} / {c['text']}")
    # Actual plotted axes, guide lines and rectangle edges must not cross text.
    segments=[]
    for node in root.findall("{http://www.w3.org/2000/svg}line"):
        segments.append([float(node.attrib[k]) for k in ("x1","y1","x2","y2")])
    for node in root.findall("{http://www.w3.org/2000/svg}rect"):
        if node.attrib.get("data-role")!="revenue":continue
        x,y,w,h=[float(node.attrib[k]) for k in ("x","y","width","height")]
        segments.extend([[x,y,x+w,y],[x,y,x,y+h],[x+w,y,x+w,y+h],[x,y+h,x+w,y+h]])
    for item in boxes:
        a=item["box"]
        for x1,y1,x2,y2 in segments:
            rect=[min(x1,x2),min(y1,y2),max(x1,x2),max(y1,y2)]
            dx=max(rect[0]-a[2],a[0]-rect[2],0);dy=max(rect[1]-a[3],a[1]-rect[3],0)
            if dx<8 and dy<8:
                raise ValueError(f"Figure label/axis clearance below8px: {item['text']}")
    return boxes


def check(lesson_root, manifest_path, *, rebuild=False):
    manifest=json.loads(manifest_path.read_text(encoding="utf-8"))
    folder=(lesson_root/b.LESSON_REL).resolve()
    before=snapshot(folder)
    if len(before)!=15:raise ValueError("Not fifteen native files")
    expected={str(Path(row["path"]).relative_to(b.LESSON_REL)):row["sha256"] for row in manifest["native_files"]}
    if before!=expected:raise ValueError("Manifest/native raw hashes differ")
    if rebuild:
        b.build(lesson_root)
        if snapshot(folder)!=before:raise ValueError("Additional native rebuild changed bytes")
    fresh=b.documents(b.target_record())
    results=[]
    for kind,record in zip(("opgaven","antwoorden"),manifest["documents"]):
        md=folder/f"{b.STEM} – {kind}.md"
        if md.read_bytes()!=(fresh[kind].rstrip()+"\n").encode():raise ValueError("Source/MD derivation differs")
        source=md.read_text(encoding="utf-8")
        refs=re.findall(r'!\[([^\]]+)\]\(_assets/(2\.2\.4_ex_[1-4])\.svg\)\{alt="([^"]+)"\}',source)
        soup=BeautifulSoup(md.with_suffix(".html").read_text(encoding="utf-8"),"html.parser")
        figures=soup.find_all("figure")
        if len(refs)!=2 or len(figures)!=2:raise ValueError("Expected two edition-specific figures")
        for (caption,stem,alt),figure in zip(refs,figures):
            img=figure.find("img");cap=figure.find("figcaption")
            if img is None or cap is None or img.get("alt")!=alt or len(alt)>120:raise ValueError("Functional actual alt differs")
            if " ".join(cap.get_text(" ",strip=True).split())!=" ".join(caption.split()):raise ValueError("Full caption differs")
            if cap.get("aria-hidden")=="true":raise ValueError("Distinct full caption hidden")
            if hashlib.sha256(base64.b64decode(img["src"].split(",",1)[1])).hexdigest()!=b.digest(folder/"_assets"/(stem+".png")):
                raise ValueError("Embedded PNG bytes differ")
            expected_indices=("1","2") if kind=="opgaven" else ("3","4")
            if stem[-1] not in expected_indices:raise ValueError("Source/answer figure role leaked")
        if soup.find(id="title-block-header"):raise ValueError("Duplicate title")
        pdf=fitz.open(md.with_suffix(".pdf"));pages=[]
        for number,page in enumerate(pdf,1):
            spans=[s for block in page.get_text("dict")["blocks"] if "lines" in block for line in block["lines"] for s in line["spans"] if s["text"].strip()]
            if not spans or any(s["size"]<11.99 for s in spans):raise ValueError("Blank page or below12pt text")
            if "\ufffd" in page.get_text():raise ValueError("Broken glyph")
            for span in spans:
                box=fitz.Rect(span["bbox"])
                if box.x0<0 or box.y0<0 or box.x1>page.rect.width+.2 or box.y1>page.rect.height+.2:raise ValueError("Text outside page")
            # Only exact page title and numbering are native footer strings.
            body=[];title=" ".join(soup.h1.get_text(" ",strip=True).split())
            for span in spans:
                if span["bbox"][1]>=page.rect.height-16*72/25.4 and span["text"] in (title,f"{number} / {len(pdf)}"):continue
                box=fitz.Rect(span["bbox"])
                if box.x0<24*72/25.4-2 or box.x1>page.rect.width-20*72/25.4+2 or box.y0<20*72/25.4-2 or box.y1>page.rect.height-21*72/25.4+2:
                    raise ValueError(f"Body outside native margins: {kind} page{number}: {span['text']}")
                body.append(span)
            pages.append({"page":number,"minimum_text_pt":min(s["size"] for s in spans),"body_spans":len(body),"text":page.get_text()})
        layouts=HTML(string=md.with_suffix(".html").read_text(encoding="utf-8")).render()
        placements=[]
        for number,page in enumerate(layouts.pages,1):
            for box in page._page_box.descendants():
                if getattr(box,"element_tag",None)!="img":continue
                w,h=box.width*.75,box.height*.75
                if abs(w-166*72/25.4)>.15 or abs(h-124.5*72/25.4)>.15:raise ValueError("Incorrect166mm figure placement")
                if 40*w/1200<12:raise ValueError("Placed figure below12pt")
                placements.append({"page":number,"width_pt":w,"height_pt":h,"label_pt":40*w/1200})
        if len(placements)!=2:raise ValueError("Image placement count differs")
        results.append({"kind":kind,"pages":pages,"figures":placements,"pdf_sha256":b.digest(md.with_suffix('.pdf'))})
    assets=[]
    for name,source in b.asset_sources().items():
        svg=folder/"_assets"/(name+".svg");png=svg.with_suffix(".png")
        if svg.read_bytes()!=source.encode():raise ValueError("SVG source derivation differs")
        with Image.open(png) as im:
            if im.size!=(2400,1800):raise ValueError("PNG is not2x source resolution")
        assets.append({"name":name,"svg_sha256":b.digest(svg),"png_sha256":b.digest(png),"ink_boxes":figure_ink(source)})
    return {"status":"PASS","paragraph":"2.2.4","manifest_sha256":b.digest(manifest_path),
            "actual_additional_native_rebuild":rebuild,"documents":results,"assets":assets,
            "personal_visual_review":"NOT_SUPPLIED_BY_THIS_SCRIPT"}


if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--lesson-root",type=Path,default=b.ROOT.parent/"4veco-lessen")
    parser.add_argument("--manifest",type=Path,required=True)
    parser.add_argument("--rebuild",action="store_true")
    args=parser.parse_args()
    print(json.dumps(check(args.lesson_root,args.manifest,rebuild=args.rebuild),ensure_ascii=False,indent=2))
