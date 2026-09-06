"""HOW TO ADAPT: actual §214 native inspection and optional genuine rebuild.

Mechanical checks never replace personal every-page/figure observations.
Each --rebuild needs an unused globally checked revision, never repair copies.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_214 as b


def segment_hits_box(segment, box, margin=3):
    x0,y0,x1,y1=segment;left,top,right,bottom=box
    bounds=[(x0,x1-x0,left-margin,right+margin),(y0,y1-y0,top-margin,bottom+margin)]
    low,high=0.,1.
    for origin,delta,minimum,maximum in bounds:
        if abs(delta)<1e-10:
            if origin<minimum or origin>maximum:return False
        else:
            a,c=(minimum-origin)/delta,(maximum-origin)/delta
            low=max(low,min(a,c));high=min(high,max(a,c))
            if low>high:return False
    return True


def line_text_collisions(svg,boxes):
    ns={"s":"http://www.w3.org/2000/svg"};segments=[];hits=[]
    for e in svg.findall("s:line",ns):
        if e.attrib.get("data-role")=="grid":continue
        segments.append((e.attrib.get("data-role"),[float(e.attrib[k]) for k in ["x1","y1","x2","y2"]]))
    for e in svg.findall("s:polyline",ns):
        points=[list(map(float,v.split(","))) for v in e.attrib["points"].split()]
        segments.extend((e.attrib.get("data-role"),a+c) for a,c in zip(points,points[1:]))
    for role,segment in segments:
        for box in boxes:
            if segment_hits_box(segment,box["ink_box"]):hits.append({"line_role":role,"segment":segment,"text":box["text"],"ink_box":box["ink_box"]})
    return hits


def check(lessons):
    import fitz
    from PIL import Image, ImageFont
    from bs4 import BeautifulSoup
    docs=b.documents(b.target_record());assets=b.load_owned("figures").asset_sources()
    b.verify_native_derivation(lessons,docs,assets)
    base=lessons/b.LESSON_REL
    result={"native":[],"pdfs":[],"figures":[],"errors":[],"personal_visual_review":"NOT PERFORMED BY THIS CHECKER"}
    for p in b.native_paths(lessons):result["native"].append({"path":p.relative_to(lessons).as_posix(),"sha256":b.sha(b.raw(p)),"bytes":len(b.raw(p))})
    for edition in ["opgaven","antwoorden"]:
        pdf=base/(b.STEM+" – "+edition+".pdf")
        doc=fitz.open(stream=b.raw(pdf),filetype="pdf")
        pages=[]
        for i,page in enumerate(doc,1):
            placed=[]
            for item in page.get_images(full=True):
                for rect in page.get_image_rects(item[0]):
                    mm=rect.width*25.4/72
                    pt=40*rect.width/1200
                    placed.append({"width_mm":mm,"height_mm":rect.height*25.4/72,"actual_placed_40px_pt":pt})
                    if abs(mm-166)>.01 or pt<12:result["errors"].append({"edition":edition,"page":i,"placed_figure":placed[-1]})
            pix=page.get_pixmap(matrix=fitz.Matrix(150/72,150/72),alpha=False,colorspace=fitz.csRGB)
            spans=[s for block in page.get_text("dict")["blocks"] if "lines" in block for line in block["lines"] for s in line["spans"] if s["text"].strip()]
            small=[s for s in spans if s["size"]<11.99]
            outside=[s for s in spans if s["bbox"][0]<0 or s["bbox"][1]<0 or s["bbox"][2]>page.rect.width+.1 or s["bbox"][3]>page.rect.height+.1]
            if small:result["errors"].append({"pdf":edition,"page":i,"small":small})
            if outside:result["errors"].append({"pdf":edition,"page":i,"outside":outside})
            pages.append({"page":i,"width":pix.width,"height":pix.height,"raw_RGB_sha256":b.sha(pix.samples),"minimum_text_pt":min((s["size"] for s in spans),default=None),"text":page.get_text(),"placed_figures":placed})
        soup=BeautifulSoup(b.raw(pdf.with_suffix(".html")),"html.parser")
        imgs=soup.find_all("img")
        if len(imgs)!=2:result["errors"].append({"edition":edition,"image_count":len(imgs)})
        figure_rows=[]
        for img in imgs:
            alt=img.get("alt","");fig=img.find_parent("figure");cap=fig.find("figcaption") if fig else None
            if len(alt)>120 or not re.match(r"^(Lichtservice|SmoothBox):",alt):result["errors"].append({"bad_alt":alt})
            if not cap or cap.get("aria-hidden")=="true" or cap.get_text(strip=True)==alt:result["errors"].append({"caption_missing_hidden_or_fallback":alt})
            figure_rows.append({"alt":alt,"length":len(alt),"caption":cap.get_text(" ",strip=True) if cap else None,"caption_aria_hidden":cap.get("aria-hidden") if cap else None})
        result["pdfs"].append({"edition":edition,"sha256":b.sha(b.raw(pdf)),"pages":pages,"HTML_figures":figure_rows})
    ns={"s":"http://www.w3.org/2000/svg"}
    font=ImageFont.truetype("C:/Windows/Fonts/arial.ttf",40)
    for name,source in assets.items():
        svg=ET.fromstring(source);boxes=[]
        for t in svg.findall("s:text",ns):
            value=t.text or "";x=float(t.attrib["x"]);y=float(t.attrib["y"]);anchor=t.attrib.get("text-anchor","start")
            x0,y0,x1,y1=font.getbbox(value,anchor={"start":"ls","middle":"ms","end":"rs"}[anchor])
            box=[x+x0,y+y0,x+x1,y+y1]
            boxes.append({"text":value,"role":t.attrib.get("data-role"),"ink_box":box})
            if min(box[0],box[1])<16 or box[2]>1184 or box[3]>1034:result["errors"].append({"figure":name,"ink_outside":boxes[-1]})
        collisions=[]
        for i,a in enumerate(boxes):
            for c in boxes[i+1:]:
                u,v=a["ink_box"],c["ink_box"]
                if u[0]<v[2]+4 and u[2]+4>v[0] and u[1]<v[3]+4 and u[3]+4>v[1]:collisions.append([a["text"],c["text"]])
        if collisions:result["errors"].append({"figure":name,"ink_collisions":collisions})
        line_hits=line_text_collisions(svg,boxes)
        if line_hits:result["errors"].append({"figure":name,"line_text_collisions":line_hits})
        png=base/"_assets"/name.replace(".svg",".png")
        with Image.open(b.data_path(png)) as image:
            image=image.convert("RGB")
            if image.size!=(1200,1050):result["errors"].append({"figure":name,"size":image.size})
            row={"name":name,"SVG_sha256":b.sha(source.encode()),"PNG_sha256":b.sha(b.raw(png)),"RGB_sha256":b.sha(image.tobytes()),"size":image.size,"source_font_px":40,"placed_font_pt":40*72/96*(166/25.4*96/1200),"ink_boxes":boxes}
        result["figures"].append(row)
    result["status"]="PASS" if not result["errors"] else "FAIL"
    return result


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lessons-root",type=Path,required=True)
    parser.add_argument("--output",type=Path,required=True)
    parser.add_argument("--rebuild",action="store_true")
    parser.add_argument("--proof-root",type=Path)
    parser.add_argument("--proof-suffix")
    args=parser.parse_args()
    b.must(not args.output.exists(),"Never overwrite an inspection record")
    if args.rebuild:
        b.must(args.proof_root and args.proof_suffix,"Rebuild needs fresh proof root/revision")
        b.build(args.lessons_root,args.proof_root,args.proof_suffix)
    result=check(args.lessons_root)
    with args.output.open("x",encoding="utf-8",newline="\n") as stream:json.dump(result,stream,ensure_ascii=False,indent=2);stream.write("\n")
    print(json.dumps({"status":result["status"],"files":len(result["native"]),"pages":[len(x["pages"]) for x in result["pdfs"]],"errors":result["errors"]},ensure_ascii=False))
    if result["errors"]:raise SystemExit(1)


if __name__ == "__main__":main()
