# Book 1 second edition · owner-authorized integration

The 2026-10-02 owner request selects the attached new Book 1 edition as the
current reading edition. The first edition remains frozen and archived; its
paragraph IDs and review status do not transfer to this edition.

The canonical route is [econ-exercise-builder](../../skills/econ-exercise-builder.md).
Source ownership and exact build commands live in the adjacent lesson repository:
`Boek 1 - Grondslagen, vraag en aanbod/edities/tweede-editie-2026/README.md`.
Edit those manuscripts; platform owns `build-scripts/books/book1_second_edition/`.
Normal builds render manuscripts, never reconstruct them from old author scripts.

The received ZIPs and research remain immutable under
`references/owned/book1-second-edition-2026/received/`. The complete first-edition
tree (including 1.4, 1.5 and companion material) is preserved in the lesson
`historisch/` ZIP and exact inventory. Legacy chapter URLs remain first edition;
the complete-book PDF URL supplies the actual new PDF. The generated current
landing page links only second-edition textbook outputs and an explicit archive.

Use `build-scripts/references/book1-edition.js` for edition-aware lookup. The new
target projection is built by `book1_second_edition/targets.py` from the owned
manuscripts and answers. The old global registry is retained as historical
evidence for Book 1 and unchanged authority for the other books. Current retrieval
must select the second-edition projection and must not reuse the old Book 1
`reviewed_final` status, machine mappings or presentation acceptance.

The ordinary independent Part A review covers all twelve paragraphs, preparation,
answers and saved output, with current file hashes. Rendering/CI and content
review remain separate from official exam alignment, measured lesson timing and
Part B acceptance. Existing presentations/quiz models are explicitly first edition;
this task does not silently rewrite or approve them for the new edition.

The bounded successor verifier preserves the accepted Book 2–4 repository pair
and historical evidence. It permits only the reviewed Book 1 edition, its finite
entry changes and the corresponding platform integration. A refreshed manifest
alone cannot confer a new independent PASS. No merge is authorized by this page.
