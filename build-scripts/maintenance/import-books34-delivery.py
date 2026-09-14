#!/usr/bin/env python3
"""Import the fixed BOOK34-CHAT-IMPORT-OUTLINES-1 delivery, without rebuilding it.

HOW TO ADAPT: this is a finite migration, not a generic import lane. A different
delivery needs its own reviewed identities and mapping. Transport ZIPs stay in
the supplied external input directory. Existing unequal files are never replaced.
"""
import argparse
import csv
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import stat
from urllib.parse import quote
import zipfile

INPUTS = {
    'inputs/Boek_3_Compleet_Herzien_Bronpakket.zip': 'aa012c9f9012a5211815bdcaeaec0cf4201642ebd8a054372909f2bbad275a36',
    'inputs/Boek_4_Compleet_Bronpakket.zip': '91b8875bf847a582521caaeae4bfdcc82964a8606bfefc4cd54c0df3ec884713',
    'outlines/book-3-outline-v2.md': '4e558b63d8eb954de935ad366170f6373f533eae14f90633a89be0036c973217',
    'outlines/book-4-outline-v2.md': '3bfb4350bb1f990a8ea559272263e8ef35e1b72bd0cbc86b59c9aa6ad4fc0899',
}
BOOKS = {
    3: ('Boek 3 - Overheidsingrijpen, concurrentie en internationale handel', 'Boek_3_Compleet_Herzien_Bronpakket.zip', [[48,31,10],[38,23,7],[38,17,7]], [136,76,28]),
    4: ('Boek 4 - Monopolie, marktfalen en arbeidsmarkt', 'Boek_4_Compleet_Bronpakket.zip', [[38,20,7],[60,24,9],[50,18,8]], [162,64,28]),
}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def git_blob(data):
    return hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()


def safe_entries(z):
    seen = set()
    for entry in z.infolist():
        # ZipInfo normalizes Windows separators and truncates NULs. Reject the
        # original spelling before any such normalization can hide an input.
        name = entry.orig_filename
        if name != entry.filename:
            raise ValueError(f'Normalized archive path: {name}')
        p = PurePosixPath(name)
        if (p.is_absolute() or '..' in p.parts or '\\' in name or ':' in name
                or not p.parts or any(part.endswith((' ', '.')) for part in p.parts)):
            raise ValueError(f'Unsafe archive path: {name}')
        kind = stat.S_IFMT(entry.external_attr >> 16)
        if kind not in (0, stat.S_IFREG, stat.S_IFDIR):
            raise ValueError(f'Non-ordinary archive entry: {name}')
        key = name.rstrip('/').casefold()
        if key in seen:
            raise ValueError(f'Duplicate archive path: {name}')
        seen.add(key)
        if not entry.is_dir():
            yield entry


def write_preserved(root, relative, data):
    dest = Path(str((root / relative).resolve()).removeprefix('\\\\?\\'))
    resolved_root = Path(str(root.resolve()).removeprefix('\\\\?\\'))
    if not dest.is_relative_to(resolved_root):
        raise ValueError(f'Escaping destination: {relative}')
    # Windows long-path support must also cover Python's Win32 file operations.
    if os.name == 'nt':
        dest = Path('\\\\?\\' + str(dest))
    if dest.exists() and dest.read_bytes() != data:
        raise ValueError(f'Refusing to replace unequal file: {dest}')
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)


def link(label, target):
    return f'[{label}]({quote(str(target).replace(chr(92), "/"), safe="/#:")})'


def import_book(inputs, lesson, book, rows):
    name, archive, chapter_pages, complete_pages = BOOKS[book]
    edition = f'{name}/edities/chat-2026'
    files, containers = [], []
    dest_seen = set()

    def preserve(archive_id, member, dest, data):
        if dest.casefold() in dest_seen:
            raise ValueError(f'Destination collision: {dest}')
        dest_seen.add(dest.casefold())
        write_preserved(lesson, dest, data)
        files.append(dict(input_archive=archive_id, member=member, repository_path=dest,
                          bytes=len(data), sha256=sha(data), git_blob=git_blob(data), mode='100644'))

    with zipfile.ZipFile(inputs / 'inputs' / archive) as z:
        entries = list(safe_entries(z))
        roots = {PurePosixPath(e.filename).parts[0] for e in entries}
        if len(roots) != 1:
            raise ValueError(f'Expected one package root: {archive}')
        package_root = roots.pop() + '/'
        package_manifest = json.loads(z.read(package_root + 'manifest.json'))
        for entry in entries:
            data = z.read(entry)
            if entry.filename.lower().endswith('.zip'):
                if book != 3 or not entry.filename.startswith(package_root + 'hoofdstuk-bronpakketten/'):
                    raise ValueError(f'Unexpected nested container: {entry.filename}')
                container_id = archive + '!' + entry.filename
                containers.append(dict(input_archive=archive, member=entry.filename, bytes=len(data),
                                       sha256=sha(data), disposition='transport_only; unpacked into source_chapters/'))
                with zipfile.ZipFile(io.BytesIO(data)) as nested:
                    for child in safe_entries(nested):
                        if child.filename.lower().endswith('.zip'):
                            raise ValueError(f'Unexpected deeper ZIP: {child.filename}')
                        preserve(container_id, child.filename, f'{edition}/source_chapters/{child.filename}', nested.read(child))
            else:
                preserve(archive, entry.filename, f'{edition}/pakket/{entry.filename[len(package_root):]}', data)

    by_source = {(f['input_archive'], f['member']): f for f in files}
    paragraphs = []
    for row in rows:
        if int(row['book']) != book:
            continue
        item = by_source[(row['source_archive'], row['source_member'])]
        if item['sha256'] != row['source_sha256']:
            raise ValueError(f'Wrong active manuscript: {row["id"]}')
        paragraphs.append({**row, 'repository_path': item['repository_path']})
    if len(paragraphs) != {3:14,4:17}[book]:
        raise ValueError('Wrong manuscript count')

    roles = []
    role_names = ['student', 'answers', 'teacher']
    suffixes = ['', '_Antwoorden', '_Docenteninformatie']
    for role, suffix, count in zip(role_names, suffixes, complete_pages):
        rel = f'Boek_{book}_Compleet{suffix}.pdf'
        if book == 4:
            rel = 'output/' + rel
        roles.append(dict(scope='complete', role=role, pages=count, repository_path=f'{edition}/pakket/{rel}'))
    for chapter, counts in zip(package_manifest['chapters'], chapter_pages):
        for role, count in zip(role_names, counts):
            roles.append(dict(scope=chapter['id'], role=role, pages=count,
                              repository_path=f'{edition}/pakket/{chapter[role]}'))
    for role in roles:
        item = next(f for f in files if f['repository_path'] == role['repository_path'])
        role['sha256'] = item['sha256']

    manifest = dict(schema_version=1, task='BOOK34-CHAT-IMPORT-OUTLINES-1', book=book,
                    selected_input=f'inputs/{archive}', selected_input_sha256=INPUTS[f'inputs/{archive}'],
                    files=sorted(files, key=lambda f:f['repository_path']), transport_only=containers,
                    paragraphs=paragraphs, pdf_roles=roles, actual_archive_moves=[])
    write_preserved(lesson, f'{name}/IMPORT_MANIFEST.json', (json.dumps(manifest,ensure_ascii=False,indent=2)+'\n').encode())

    pdf_table = ['| Onderdeel | Leerling | Antwoorden | Docent |', '|---|---|---|---|']
    for scope in ['complete'] + [ch['id'] for ch in package_manifest['chapters']]:
        found = [r for r in roles if r['scope'] == scope]
        pdf_table.append('| ' + ('Compleet boek' if scope=='complete' else scope) + ' | ' + ' | '.join(
            link(f'{r["pages"]} pagina’s', r['repository_path'][len(name)+1:]) for r in found) + ' |')
    alias = '\nTitelalias: het geleverde Boek 3 gebruikt “volkomen concurrentie”; de geselecteerde outline en mapnaam gebruiken “concurrentie”. Dit is dezelfde herziene editie.\n' if book==3 else ''
    readme = f'# {name}\n\nDe geselecteerde chat-editie 2026 is de standaard printeditie. Schrijven en assemblage zijn voltooid; repository-import en structurele integratie zijn voorbereid/in PR.\n\n' + '\n'.join(pdf_table)
    readme += '\n\n' + link('Alle bewerkbare paragraafbronnen', 'edities/chat-2026/BRONNEN.md') + ' · ' + link('Editie en herkomst', 'edities/chat-2026/README.md') + ' · ' + link('Bestandsmanifest','IMPORT_MANIFEST.json') + '\n\n'
    readme += f'[Actuele outline en adoptie](https://github.com/meijer1973/4veco-platform/blob/codex/import-books34-outlines-20260914/references/authored/book-outlines/book-{book}-outline.meta.json). De outline is structureel geselecteerd; dit verleent geen formele targetgoedkeuring of companionacceptatie.\n' + alias
    write_preserved(lesson, f'{name}/README.md', readme.encode())

    navigation = f'# Boek {book} — geselecteerde editie\n\n' + link('Boek, hoofdstukken en downloads', '../../README.md') + ' · ' + link('Bewerkbare bronnen', 'BRONNEN.md') + '\n\n'
    navigation += f'De oorspronkelijke niet-containerbestanden uit `{archive}` staan ongewijzigd onder `pakket/`. Het originele transportpakket blijft buiten Git in het aangeleverde integratiepakket; de hash en alle mappings staan in ' + link('IMPORT_MANIFEST.json','../../IMPORT_MANIFEST.json') + '.\n\n'
    if book==3:
        navigation += 'De drie oorspronkelijke ZIPs onder `hoofdstuk-bronpakketten/` zijn transport-only en volledig uitgepakt onder `source_chapters/`. Verwijzingen naar die ZIPs in de originele package-README zijn historische transportverwijzingen. De actieve H1-bronnen zijn de herziene hoofdstukbestanden; `revision_base/` bevat uitsluitend historisch invoermateriaal. De toevoegingen 22A, 40A en 47A blijven behouden.\n\n'
    else:
        navigation += 'De al uitgepakte hoofdstukbronnen blijven onder `pakket/source_chapters/`, met hun oorspronkelijke interne relaties.\n\n'
    navigation += 'De bestanden in `pakket/` en de oorspronkelijke hoofdstukmappen zijn bewaard, inclusief meegeleverde QA, scripts en outlinekopieën. Die kopieën zijn herkomstmateriaal; de platformoutline met adoptiegegevens is het huidige structurele aanspreekpunt. Voer `author_*.py` niet uit voor deze import: die recepten kunnen handmatig herziene manuscripten overschrijven. Er zijn geen PDF’s herbouwd.\n'
    write_preserved(lesson, f'{edition}/README.md', navigation.encode())
    index = f'# Boek {book} — actieve bewerkbare bronnen\n\nVolg per hoofdstuk de oorspronkelijke `chapter-order.json`. Manuscripten zijn de primaire bewerkbare tekst; hoofdstuk-Markdown en paragraafexports zijn afgeleide bestanden.\n\n| Paragraaf | Geselecteerde titel | Actief manuscript |\n|---|---|---|\n'
    for row in paragraphs:
        index += f'| {row["id"]} | {row["outline_title"]} | ' + link('Manuscript', row['repository_path'][len(edition)+1:]) + ' |\n'
    index += '\n## Antwoorden, docentinformatie en volgorde\n\n'
    for chapter in package_manifest['chapters']:
        row = next(r for r in paragraphs if r['chapter']==chapter['id'])
        folder = str(PurePosixPath(row['repository_path']).parent)
        index += f'- {chapter["id"]}: ' + ' · '.join(link(label, folder[len(edition)+1:]+'/'+filename) for label,filename in [('Volgorde','chapter-order.json'),('Antwoorden','Antwoorden.md'),('Docentinformatie','Docenteninformatie.md')]) + '\n'
    write_preserved(lesson, f'{edition}/BRONNEN.md', index.encode())
    return {'book':book, 'preserved_files':len(files), 'transport_only':len(containers), 'paragraphs':len(paragraphs), 'pdf_roles':len(roles)}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--inputs', type=Path, required=True)
    ap.add_argument('--lessons', type=Path, required=True)
    args = ap.parse_args()
    for file, expected in INPUTS.items():
        if sha((args.inputs/file).read_bytes()) != expected:
            raise ValueError(f'Wrong selected input: {file}')
    with (args.inputs/'outlines/selected-paragraphs.csv').open(encoding='utf-8',newline='') as f:
        rows = list(csv.DictReader(f))
    print(json.dumps([import_book(args.inputs,args.lessons,b,rows) for b in BOOKS],indent=2))


if __name__ == '__main__':
    main()
