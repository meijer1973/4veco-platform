"""HOW TO ADAPT: actual §231 HTML/PDF/proof, alt/caption, typography and placement checks.
Automated bounds are not personal visual acceptance. No files are changed.
"""
from pathlib import Path
import argparse
import base64
import hashlib
import json
import sys
import fitz
from bs4 import BeautifulSoup
from PIL import Image
from weasyprint import HTML
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_231 as b
from print_pipeline import digest
from verify_rebuild import check_manifest, check_archives, all_page_hashes
from test_source import images, bonus_criteria

def print_role(span, page_rect, title, number, total):
    """Only exact native footer strings may enter the reserved 21mm footer zone."""
    box=fitz.Rect(span["bbox"])
    if box.y0>=page_rect.height-16*72/25.4 and span["text"] in (title,f"{number} / {total}"):
        return "footer"
    limits=fitz.Rect(24*72/25.4,20*72/25.4,page_rect.width-20*72/25.4,page_rect.height-21*72/25.4)
    tolerance=2  # glyph bearings, not permission to enter the footer
    if box.x0<limits.x0-tolerance or box.y0<limits.y0-tolerance or box.x1>limits.x1+tolerance or box.y1>limits.y1+tolerance:
        raise ValueError(f"Body text outside native print margins on page {number}: {span['text']}")
    return "body"

def check(lesson_root,manifest_path):
    manifest=json.loads(manifest_path.read_text(encoding="utf-8"))
    folder=check_manifest(manifest)
    if folder!=(lesson_root/b.LESSON_REL).resolve():raise ValueError("Wrong lesson root")
    proof_hashes=all_page_hashes(manifest)
    documents=[]
    for kind,record in zip(b.KINDS,manifest["documents"]):
        md=Path(record["source_md"]).read_text(encoding="utf-8")
        refs=images(md)
        soup=BeautifulSoup(Path(record["source_html"]).read_text(encoding="utf-8"),"html.parser")
        actual_images=soup.find_all("img");figures=soup.find_all("figure")
        if len(actual_images)!=len(refs) or len(figures)!=len(refs):raise ValueError("Image count mismatch")
        for img,figure,ref in zip(actual_images,figures,refs):
            if img.get("alt")!=ref["alt"]:raise ValueError("Actual HTML alt mismatch")
            if not figure.find("figcaption") or " ".join(figure.find("figcaption").get_text(" ",strip=True).split())!=ref["caption"]:
                raise ValueError("Full caption mismatch")
            raw=base64.b64decode(img["src"].split(",",1)[1])
            if hashlib.sha256(raw).hexdigest()!=digest(folder/"_assets"/(ref["stem"]+".png")):
                raise ValueError("Embedded image bytes differ")
        if soup.find(id="title-block-header"):raise ValueError("Duplicate title")
        if kind!="antwoorden":
            if [" ".join(h.get_text(" ",strip=True).split()) for h in soup.find_all("h2")]!=b.HEADINGS:raise ValueError("HTML heading order")
        else:
            bonus_criteria(md)
            label=soup.find("strong",string="Beoordelingscriteria")
            bullet=label.parent.find_next_sibling("ul") if label else None
            if not bullet or len(bullet.find_all("li",recursive=False))!=3:raise ValueError("Rendered bonus criteria missing")
        pdf=fitz.open(record["source_pdf"])
        title=" ".join(soup.h1.get_text(" ",strip=True).split())
        if len(pdf)!=len(proof_hashes[kind]):raise ValueError("Page count mismatch")
        page_records=[]
        for number,page in enumerate(pdf,1):
            text=page.get_text()
            if len(text.strip())<20:raise ValueError("Blank page")
            if "\ufffd" in text or "\u25a1" in text:raise ValueError("Broken glyph")
            spans=[s for block in page.get_text("dict")["blocks"] if "lines" in block for line in block["lines"] for s in line["spans"] if s["text"].strip()]
            if any(s["size"]<11.99 for s in spans):raise ValueError("PDF text below12pt")
            for s in spans:
                box=fitz.Rect(s["bbox"])
                if box.x0<0 or box.y0<0 or box.x1>page.rect.width+.2 or box.y1>page.rect.height+.2:
                    raise ValueError("PDF text outside page")
            body=[s for s in spans if print_role(s,page.rect,title,number,len(pdf))=="body"]
            page_records.append({"page":number,"text_characters":len(text),"minimum_text_pt":min(s["size"] for s in spans),
                                 "fonts":sorted({s["font"] for s in spans}),"maximum_body_bottom_pt":max(s["bbox"][3] for s in body),
                                 "body_print_bottom_limit_pt":page.rect.height-21*72/25.4,"all_body_inside_native_print_margins":True})
        if kind=="antwoorden":
            text="\n".join(p.get_text() for p in pdf)
            if "Beoordelingscriteria" not in text or "optimale hoeveelheid" not in text:raise ValueError("PDF bonus criteria absent")
        layouts=HTML(string=Path(record["source_html"]).read_text(encoding="utf-8")).render()
        placements=[]
        for page_number,page in enumerate(layouts.pages,1):
            for box in page._page_box.descendants():
                if getattr(box,"element_tag",None)!="img":continue
                width_pt=box.width*.75;height_pt=box.height*.75
                font_pt=40*width_pt/1200
                if abs(width_pt-166*72/25.4)>.15 or abs(height_pt-124.5*72/25.4)>.15:
                    raise ValueError("Actual figure placement differs from approved166mm budget")
                if font_pt<12:raise ValueError("Figure text below12pt")
                x_pt=box.position_x*.75;y_pt=box.position_y*.75
                if x_pt<24*72/25.4-.2 or x_pt+width_pt>page.width*.75-20*72/25.4+.2 or y_pt<20*72/25.4-.2 or y_pt+height_pt>page.height*.75-21*72/25.4+.2:
                    raise ValueError("Figure outside native print margins")
                placements.append({"page":page_number,"x_pt":x_pt,"y_pt":y_pt,"width_pt":width_pt,"height_pt":height_pt,"source_text_print_pt":font_pt})
        if len(placements)!=len(refs):raise ValueError("Missing layout image")
        documents.append({"kind":kind,"pages":page_records,"images":refs,"image_placements":placements,
                          "generation_manifest":str(Path(record["proof_directory"])/"manifest.json"),
                          "generation_manifest_raw_sha256":digest(Path(record["proof_directory"])/"manifest.json")})
    for stem in b.ASSETS:
        with Image.open(folder/"_assets"/(stem+".png")) as png:
            if png.size!=(2400,1800):raise ValueError("Wrong PNG source dimensions")
    return {"paragraph":"2.3.1","manifest":str(manifest_path.resolve()),"manifest_raw_sha256":digest(manifest_path),
            "status":"PASS","documents":documents,"zip_archives":check_archives(folder),
            "all_generation_proof":"IMMUTABLE_PENDING","personal_visual_inspection":"NOT_SUPPLIED_BY_THIS_SCRIPT"}

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--lesson-root",type=Path,default=b.ROOT.parent/"4veco-lessen")
    parser.add_argument("--manifest",type=Path,required=True)
    args=parser.parse_args()
    print(json.dumps(check(args.lesson_root,args.manifest),ensure_ascii=False,indent=2))
