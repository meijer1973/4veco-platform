"""Prepare a NEW v5 registry candidate, never edit the input or confer approval.

Usage:
 python build/prepare_registry_update.py OLD.json NEW.json \
   --lesson-package-root edities/books34-v3

The declared root is the package's final repository-relative location in
4veco-lessen. Canonical blueprint/outline refs belong to 4veco-platform;
package file paths and payload hashes stay portable. Repository-facing
source_locator fields resolve the two without rewriting exercise content.
This is NOT the repository's v3 migration or a substitute for its validators.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
from pathlib import Path, PurePosixPath
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
REVISION = 'book34-lesson-balance-v3-20260915'
PREVIOUS_REVISION = 'book34-chat-v2-20260914'
BLUEPRINT = 'references/owned/course-blueprint-v5.md'
COUNTS = {'1': 12, '2': 12, '3': 14, '4': 17}
CHAPTER_COUNTS = {'3.1': 6, '3.2': 4, '3.3': 4, '4.1': 5, '4.2': 7, '4.3': 5}


def canonical(value: Any) -> str:
    return json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(',', ':'))


def relative_root(value: str) -> str:
    value = value.strip().rstrip('/')
    p = PurePosixPath(value)
    if not value or p.is_absolute() or '\\' in value or ':' in value or '..' in p.parts or '.' in p.parts:
        raise ValueError('lesson-package-root must be a safe repository-relative POSIX path')
    return p.as_posix()


def prepare(data: dict[str, Any], module: dict[str, Any], package_root: str) -> dict[str, Any]:
    package_root = relative_root(package_root)
    if data.get('schema_version') != 1 or data.get('blueprint_version') != 'v5' or data.get('blueprint_source') != BLUEPRINT:
        raise ValueError('Unsupported registry schema; inspect the current repository instead of guessing')
    if data.get('structure_revision') not in {PREVIOUS_REVISION, REVISION}:
        raise ValueError('Unknown current structural revision; do not overwrite concurrent curriculum work')
    if not isinstance(data.get('exercises'), list):
        raise ValueError('The v5 registry must contain an exercises array')
    old = data['exercises']
    if len(old) != 55 or len({r.get('id') for r in old}) != 55:
        raise ValueError('Expected 55 unique current Year 1 records')
    if {str(b): sum(r.get('module') == b for r in old) for b in (1, 2, 3, 4)} != COUNTS:
        raise ValueError('Existing per-book counts do not match 12/12/14/17')
    preserved = [r for r in old if r.get('module') not in (3, 4)]
    expected_preserved = {f'{b}.{c}.{p}' for b in (1, 2) for c in (1, 2, 3) for p in (1, 2, 3, 4)}
    if len(preserved) != 24 or {r.get('id') for r in preserved} != expected_preserved:
        raise ValueError('Books 1/2 do not match the expected 24 records; no output produced')
    if module.get('structure_revision') != REVISION:
        raise ValueError('Wrong package structural revision')
    candidates = copy.deepcopy(module.get('records', []))
    expected_ids = [f'{c}.{p}' for c, n in CHAPTER_COUNTS.items() for p in range(1, n + 1)]
    if [r.get('id') for r in candidates] != expected_ids:
        raise ValueError('Candidate IDs/order do not match the adopted v3 chapter counts')
    for r in candidates:
        pid = r['id']
        if r.get('structure_revision') != REVISION or r.get('source_identity', {}).get('revision') != REVISION:
            raise ValueError(f'{pid}: inconsistent structural identity')
        if pid != f'{r.get("module")}.{r.get("chapter")}.{r.get("paragraph")}' or r['source_identity'].get('paragraph_id') != pid:
            raise ValueError(f'{pid}: numeric and structural identities disagree')
        migration = r.get('v5_migration', {})
        if migration.get('structural_revision') != REVISION or migration.get('source_status') != 'candidate_review_ready':
            raise ValueError(f'{pid}: mixed target migration metadata')
        target = r.get('target_exercise', {})
        if r.get('record_status') != 'candidate_review_ready' or target.get('placeholder') is not False or not target.get('context') or not target.get('subquestions'):
            raise ValueError(f'{pid}: a populated, non-final candidate is required')
        if r.get('review_evidence') or r.get('target_quality_review') or r.get('v5_migration', {}).get('review_required_before_final') is not True:
            raise ValueError(f'{pid}: this helper cannot carry or confer final approval')
        if r.get('source_ref') != f'{BLUEPRINT} §{pid}':
            raise ValueError(f'{pid}: non-canonical blueprint reference')
        outline = f'references/authored/book-outlines/book-{r["module"]}-outline.md'
        if r['source_identity'].get('outline') != outline:
            raise ValueError(f'{pid}: non-canonical outline identity')
        pin = r['source_pin']
        def location(local: str) -> str:
            return package_root + '/' + relative_root(local)
        # No source strings, source_pin hashes or portable figure paths are changed.
        # Consumers resolve package paths against source_locator.package_root.
        r['source_locator'] = {
            'repository': 'meijer1973/4veco-lessen',
            'package_root': package_root,
            'student_manuscript': location(pin['student_file']),
            'answer_manuscript': location(pin['answer_file']),
            'target_excerpt': location(f'curriculum/target-excerpts/{pid}.md'),
            'package_record': location(f'curriculum/targets/{pid}.json'),
            'outline_repository': 'meijer1973/4veco-platform',
            'outline_path': outline,
            'asset_path_rule': 'Resolve target/answer figure.path and context_html src against package_root in this repository',
        }
    result = copy.deepcopy(data)
    result['exercises'] = copy.deepcopy(preserved) + candidates
    result['structure_revision'] = REVISION
    result['expected_count_bearing_paragraphs'] = dict(COUNTS)
    result['total_count_bearing_paragraphs'] = 55
    result.setdefault('_schema_doc', {})['record_status'] = (
        'reviewed_final, candidate_review_ready, migrated_from_v4_needs_v5_review, or placeholder_needs_review. '
        'A populated candidate is not a placeholder and is not independently approved.'
    )
    result['book34_package_migration'] = {
        'from_structure_revision': data['structure_revision'],
        'to_structure_revision': REVISION,
        'lesson_package_root': package_root,
        'preserved_books12_canonical_sha256': hashlib.sha256(canonical(preserved).encode('utf-8')).hexdigest(),
        'candidate_count': 31,
        'approval_conferred': False,
        'repository_migration_required': True,
        'note': 'The input and earlier previous_structural_registry provenance remain untouched; archive the received v2 registry during the governed v3 migration.',
    }
    after = [r for r in result['exercises'] if r.get('module') not in (3, 4)]
    if canonical(after) != canonical(preserved):
        raise ValueError('Book 1/2 preservation check failed')
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('existing_registry', type=Path)
    parser.add_argument('new_output', type=Path)
    parser.add_argument('--lesson-package-root', required=True)
    args = parser.parse_args()
    if args.new_output.exists() or args.new_output.resolve() == args.existing_registry.resolve():
        raise SystemExit('Output must be a new file; input is never edited')
    try:
        raw = args.existing_registry.read_bytes()
        data = json.loads(raw.decode('utf-8-sig'))
        module = json.loads((ROOT / 'curriculum/course-target-exercises-books34-v3.json').read_text(encoding='utf-8'))
        result = prepare(data, module, args.lesson_package_root)
        result['book34_package_migration']['input_registry_sha256'] = hashlib.sha256(raw).hexdigest()
        with args.new_output.open('x', encoding='utf-8', newline='\n') as out:
            out.write(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    except (OSError, ValueError, KeyError, TypeError) as exc:
        raise SystemExit(str(exc)) from exc
    print('Prepared new registry candidate; counts 12/12/14/17; all 24 Book 1/2 records preserved.')
    print('Top-level and target revisions match; canonical source_ref fields retained; source locators supplied.')
    print('No repository write or approval. Complete integration/V3_MIGRATION.md and actual repository validation.')


if __name__ == '__main__':
    main()
