# Technical delivery evidence

All 1,005 original files match the fixed manifests. All 24 PDF roles open in strict pypdf mode, with every page/content stream readable and the supplied 24 page counts unchanged. All 31 active manuscripts match their chapter order; editable answer/teacher files and referenced assets resolve. Added book/edition/source navigation resolves locally.

37 pages were rendered with Poppler and visually inspected: both covers and complete contents, revised H1 student/answer/teacher samples and numbered insert references/answers, representative chapters in each book, and text-empty separator/trailing pages. No substantial clipping, missing figures, corrupted pages or numbering defect was encountered in these samples. Covers are raster images and correctly yield no extracted text; they are not blank. Blank page samples were retained unchanged. This is sampled technical QA, not a full content or economic review.

The JSON maps every rendered page to its PDF, sheet and cell. [Book 3 contents](book-3-contents.png), [Book 4 contents](book-4-contents.png).

Reproduce with `python build-scripts/maintenance/verify-books34-delivery.py --lessons ../4veco-lessen --output <external-QA-folder> --pdftoppm <Poppler-executable>`. Dependencies: pypdf, PyMuPDF, Pillow and Poppler. pypdf checks page streams; PyMuPDF extracts text; Poppler renders. No author/build recipe is executed and delivered files are never rewritten.

- [Contact sheet 1](contact-1.jpg)

- [Contact sheet 2](contact-2.jpg)

- [Contact sheet 3](contact-3.jpg)

- [Contact sheet 4](contact-4.jpg)

- [Contact sheet 5](contact-5.jpg)

- [Contact sheet 6](contact-6.jpg)

- [Contact sheet 7](contact-7.jpg)
