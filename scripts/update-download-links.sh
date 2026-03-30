#!/bin/bash
# Update download links in book markdown files to use local files

CONTENT_DIR="/c/Users/msi/projects/ebooks-site/content/ebooks"
PDF_DIR="/c/Users/msi/projects/ebooks-site/static/downloads/pdf"
EPUB_DIR="/c/Users/msi/projects/ebooks-site/static/downloads/epub"

for md in "$CONTENT_DIR"/*.md; do
  [ "$(basename "$md")" = "_index.md" ] && continue

  slug=$(basename "$md" .md)

  has_pdf=false
  has_epub=false
  [ -f "$PDF_DIR/${slug}.pdf" ] && has_pdf=true
  [ -f "$EPUB_DIR/${slug}.epub" ] && has_epub=true

  if $has_pdf; then
    # Replace downloadPDF line
    sed -i "s|^downloadPDF:.*|downloadPDF: \"/downloads/pdf/${slug}.pdf\"|" "$md"
    echo "$slug: PDF → local"
  fi

  if $has_epub; then
    # Replace downloadEPUB line
    sed -i "s|^downloadEPUB:.*|downloadEPUB: \"/downloads/epub/${slug}.epub\"|" "$md"
    echo "$slug: EPUB → local"
  fi

  if ! $has_pdf && ! $has_epub; then
    echo "$slug: SKIPPED (no local files)"
  fi
done

echo ""
echo "Done! Links updated."
