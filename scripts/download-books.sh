#!/bin/bash
# Download PDF and EPUB files from Project Gutenberg
# Each book has: slug, gutenberg_id

DL_DIR="/c/Users/msi/projects/ebooks-site/static/downloads"

# Format: slug|gutenberg_id|pdf_path|epub_path
# Some books have different file structures on Gutenberg
BOOKS=(
  "as-a-man-thinketh|4507"
  "the-science-of-getting-rich|59844"
  "meditations|2680"
  "the-prince|1232"
  "autobiography-of-benjamin-franklin|20203"
  "the-way-of-peace|10740"
  "the-heavenly-life|20679"
  "how-they-succeeded|21291"
  "the-power-of-concentration|7352"
  "think-and-grow-rich|71421"
  "self-reliance|16643"
  "the-art-of-war|132"
  "the-wealth-of-nations|3300"
  "walden|205"
  "the-republic|1497"
  "on-liberty|34901"
  "the-analects|3330"
  "the-enchiridion|45109"
  "discourse-on-method|59"
  "the-game-of-life|69877"
)

for entry in "${BOOKS[@]}"; do
  IFS='|' read -r slug gid <<< "$entry"
  echo "=== Downloading: $slug (ID: $gid) ==="

  # Try EPUB first (most reliable format on Gutenberg)
  epub_url="https://www.gutenberg.org/ebooks/${gid}.epub3.images"
  echo "  EPUB: $epub_url"
  curl -sL -o "$DL_DIR/epub/${slug}.epub" "$epub_url" --max-time 30

  # Check if EPUB downloaded successfully (should be > 1KB)
  epub_size=$(stat -c%s "$DL_DIR/epub/${slug}.epub" 2>/dev/null || echo "0")
  if [ "$epub_size" -lt 1000 ]; then
    # Try alternate EPUB URL
    epub_url2="https://www.gutenberg.org/ebooks/${gid}.epub.images"
    curl -sL -o "$DL_DIR/epub/${slug}.epub" "$epub_url2" --max-time 30
  fi

  # Try to get PDF (Gutenberg doesn't always have PDF, try cache)
  pdf_url="https://www.gutenberg.org/cache/epub/${gid}/pg${gid}.pdf"
  echo "  PDF: $pdf_url"
  curl -sL -o "$DL_DIR/pdf/${slug}.pdf" "$pdf_url" --max-time 30

  # Check if PDF downloaded (some books don't have PDF on Gutenberg)
  pdf_size=$(stat -c%s "$DL_DIR/pdf/${slug}.pdf" 2>/dev/null || echo "0")
  if [ "$pdf_size" -lt 1000 ]; then
    echo "  WARNING: No PDF available for $slug, removing placeholder"
    rm -f "$DL_DIR/pdf/${slug}.pdf"
  fi

  echo "  Done!"
done

echo ""
echo "=== Download Summary ==="
echo "EPUBs: $(ls $DL_DIR/epub/*.epub 2>/dev/null | wc -l) files"
echo "PDFs:  $(ls $DL_DIR/pdf/*.pdf 2>/dev/null | wc -l) files"
