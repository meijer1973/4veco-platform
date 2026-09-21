"""Check repaired Book 2 bytes, every chapter page/link, and actual cover geometry.

HOW TO ADAPT: paired with build_book2_chat.py and lesson assembly.json. This
checks this bounded repair, not full curriculum or paragraph acceptance.
"""
from __future__ import annotations

import argparse
from hashlib import sha256
import json
from pathlib import Path

import fitz
from pypdf import PdfReader

from build_book2_chat import EDITION, file_record, revision_inputs


def require(condition, message):
    if not condition:
        raise ValueError(message)


def color_close(actual, expected):
    if actual is None:
        return False
    rgb = tuple(int(expected[i:i+2], 16)/255 for i in (1, 3, 5))
    return max(abs(a-b) for a, b in zip(actual, rgb)) < 0.00001


def geometry_check(page, cover):
    """Read PDF drawing commands, not an unconnected calculation of the model."""
    drawings = page.get_drawings()
    sx, sy = page.rect.width/1055, page.rect.height/1491

    def actual_points(drawing):
        return [(point.x/sx, point.y/sy) for item in drawing["items"]
                if item[0] == "l" for point in item[1:3]]

    def match_path(color, expected, fill=False):
        candidates = [d for d in drawings if color_close(d["fill" if fill else "color"], color)]
        require(len(candidates) == 1, f"Expected one {'area' if fill else 'curve'} for {color}")
        actual = actual_points(candidates[0])
        for point in expected:
            require(any(max(abs(a-b) for a, b in zip(point, p)) < 0.02 for p in actual),
                    f"Cover geometry: missing {point} for {color}; got {actual}")
        require(all(any(max(abs(a-b) for a, b in zip(p, point)) < 0.02 for point in expected)
                    for p in actual), f"Unexpected vertices in {color}")

    costs = cover["costs"]
    fixed, variable, price = costs["fixed"], costs["variable_per_unit"], costs["price"]
    match_path("#E67E22", [(94, 745-fixed*0.06), (304, 745-(fixed+150*variable)*0.06)])
    match_path("#7B2D8E", [(94, 745), (304, 745-150*price*0.06)])
    # The same coordinate transform must put every printed table quantity on
    # the two actual segments (verified endpoints, linear interpolation).
    for row, q in enumerate(costs["quantities"]):
        total, revenue = fixed+variable*q, price*q
        values = [str(q), f"{total:,}".replace(",", "."),
                  "–" if q == 0 else (f"{total/q:.2f}".rstrip("0").rstrip(".").replace(".", ",")),
                  f"{revenue:,}".replace(",", "."), f"{revenue-total:,}".replace(",", ".")]
        for column, expected in enumerate(values):
            top = 825+34+26*row
            rect = fitz.Rect((52+60*column)*sx, top*sy, (52+60*(column+1))*sx, (top+26)*sy)
            require(page.get_textbox(rect).strip() == expected,
                    f"Wrong cover table value at Q={q}, column={column}: {page.get_textbox(rect)!r}")
    text = page.get_text()
    require("GTK" in text and "TKG" not in text and "(€/stuk)" in text, "Incorrect cover units/abbreviations")
    market = cover["market"]
    a, b, s, t = (market[k] for k in ["demand_intercept", "demand_slope", "supply_intercept", "supply_slope"])
    q_star = (a-s)/(b+t)
    p_star = s+t*q_star
    eq = (727+17*q_star, 817-14*p_star)
    match_path("#85C1E9", [(727, 817-14*a), (727, eq[1]), eq], fill=True)
    match_path("#82E0AA", [(727, 817-14*s), (727, eq[1]), eq], fill=True)
    match_path("#1A5276", [(727, 817-14*a), (982, 817-14*(a-b*15))])
    match_path("#1E8449", [(727, 817-14*s), (982, 817-14*(s+t*15))])
    # Entire label bounding boxes, including descenders, must lie in the areas.
    for word in page.get_text("words"):
        x0, y0, x1, y1, value, *_ = word
        x0, x1, y0, y1 = x0/sx, x1/sx, y0/sy, y1/sy
        if value == "Consumenten-" or value == "surplus" and y1 < eq[1]:
            require(y0 >= 817-14*(a-b*(x1-727)/17)-0.2 and y1 <= eq[1]+0.2,
                    f"CS label outside triangle: {word}")
        if value == "Producenten-" or value == "surplus" and y0 > eq[1]:
            require(y0 >= eq[1]-0.2 and y1 <= 817-14*(s+t*(x1-727)/17)+0.2,
                    f"PS label outside triangle: {word}")
    return {"cost_rows": 4, "break_even_Q": fixed/(price-variable),
            "CS_PS_triangles_and_labels": "PASS", "actual_PDF_vectors": "PASS"}


def verify(root: Path, revised: bool = False) -> dict:
    config = json.loads((root/"assembly.json").read_text(encoding="utf-8"))
    delivery = json.loads((root/"delivery-manifest.json").read_text(encoding="utf-8"))
    repair_path = root/("route-assembly-manifest.json" if revised else "repair-manifest.json")
    repair = json.loads(repair_path.read_text(encoding="utf-8"))
    repaired = {r["path"]: r for r in repair["files"]}
    changed = {config["cover"]["preview"], *(b["output"] for b in config["bundles"])}
    allowed = changed | {"assembly.json", config["cover"]["background"]}
    require(set(repaired) == allowed, "Repair manifest must bind exactly all assembly inputs and repaired outputs")
    for record in repair["files"]:
        require(file_record(root, root/record["path"]) == record, f"Repair hash mismatch: {record['path']}")
    if revised:
        revision_inputs(root)
        require(repair.get("chapter_inputs_sha256") == file_record(root, root/"route-chapter-inputs.json")["sha256"],
                "Stale assembly chapter binding")
        require(sha256((root/"repair-manifest.json").read_bytes()).hexdigest() ==
                "406fca18fac77d334c6824c2291ff6a7c761a1be82cc58c5ba7ea478507883f2", "Historical repair evidence changed")
    unchanged = 0
    for record in delivery["files"]:
        if revised or record["path"] in changed:
            continue
        actual = file_record(root, root/record["path"])
        require(all(actual[k] == record[k] for k in actual), f"Unexpected delivery change: {record['path']}")
        unchanged += 1
    stats, rendered, links, cover_bytes = [], 0, 0, None
    for bundle in config["bundles"]:
        with fitz.open(root/bundle["output"]) as final:
            require(len(final) == sum(bundle["page_counts"])+2, "Bundle pagination changed")
            current_cover = final[0].get_pixmap().samples
            if cover_bytes is None:
                cover_bytes = current_cover
            require(current_cover == cover_bytes, "The three covers differ")
            geometry_check(final[0], config["cover"])
            require("PDF-pagina" in final[1].get_text(), "Missing page-number explanation")
            offset = 2
            for path in bundle["chapters"]:
                with fitz.open(root/path) as source:
                    for index, page in enumerate(source):
                        merged = final[offset+index]
                        require(page.rect == merged.rect, f"Page dimensions changed: {path} p{index+1}")
                        require(page.get_text() == merged.get_text(), f"Page text changed: {path} p{index+1}")
                        require(page.get_pixmap().samples == merged.get_pixmap().samples,
                                f"Rendered page changed: {path} p{index+1}")
                        rendered += 1
                        before, after = page.get_links(), merged.get_links()
                        require(len(before) == len(after), f"Lost annotation: {path} p{index+1}")
                        for old, new in zip(before, after):
                            require(old["from"] == new["from"], "Link rectangle changed")
                            if old["kind"] in (fitz.LINK_GOTO, fitz.LINK_NAMED):
                                require(new["kind"] == fitz.LINK_GOTO, "Local link was not resolved")
                                require(new["page"] == old["page"]+offset, "Link targets wrong chapter")
                                # MuPDF exposes named targets in PDF coordinates,
                                # explicit targets in its top-left coordinate system.
                                expected = old["to"]
                                if old["kind"] == fitz.LINK_NAMED:
                                    expected = expected * source[old["page"]].transformation_matrix
                                require(max(abs(a-b) for a, b in zip(new["to"], expected)) < 0.001,
                                        "Link view position changed")
                            elif old["kind"] == fitz.LINK_URI:
                                require(new["kind"] == old["kind"], "External link action changed")
                                require(new["uri"] == old["uri"], "External link changed")
                            else:
                                raise ValueError(f"Unsupported link type needs review: {old['kind']}")
                            links += 1
                    offset += len(source)
            stats.append({"file": bundle["output"], "pages": len(final)})
    reader = PdfReader(root/config["bundles"][0]["output"])
    overview = {name: reader.get_destination_page_number(reader.named_destinations[name])+1
                for name in ["h2-overzicht", "h3-overzicht"]}
    require(overview == {"h2-overzicht": 72, "h3-overzicht": 109}, "Overview destinations incorrect")
    return {"ok": True, "scope": "Current chapter-to-book assembly, cover and links; source inventory requires the separate revision gate" if revised else "B2-01..04 and assembly preservation; no full paragraph acceptance",
            "unchanged_delivered_files": unchanged, "identical_rendered_chapter_pages": rendered,
            "preserved_link_annotations": links, "overview_destinations": overview,
            "bundles": stats, "cover_geometry": "PASS",
            "assembly_manifest_sha256": sha256(repair_path.read_bytes()).hexdigest()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lesson-root", type=Path,
                        default=Path(__file__).resolve().parents[3]/"4veco-lessen")
    parser.add_argument("--revised-chapters", action="store_true")
    args = parser.parse_args()
    print(json.dumps(verify(args.lesson_root.resolve()/EDITION, revised=args.revised_chapters), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
