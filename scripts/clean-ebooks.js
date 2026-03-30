const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const EPUB_DIR = path.join(__dirname, '..', 'static', 'downloads', 'epub');

// Patterns to identify Gutenberg header/footer content
const gutenbergPatterns = [
  /\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG.*?\*\*\*/gi,
  /\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG.*?\*\*\*/gi,
  /Project Gutenberg[''']?s/gi,
  /Project Gutenberg/gi,
  /gutenberg\.org/gi,
  /www\.gutenberg\.org/gi,
  /Project Gutenberg License/gi,
  /Project Gutenberg-tm/gi,
  /project gutenberg literary archive foundation/gi,
  /GUTENBERG/g,
];

// Replacement branding
const BRAND = 'Wisdom Shelf';
const BRAND_URL = 'https://wisdom-shelf-ebooks.netlify.app';

function cleanContent(html) {
  let cleaned = html;

  // Remove entire Gutenberg license/header sections (common patterns in EPUB)
  // Remove sections between START/END markers
  cleaned = cleaned.replace(
    /\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG EBOOK.*?\*\*\*/gis,
    ''
  );
  cleaned = cleaned.replace(
    /\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG EBOOK.*?\*\*\*/gis,
    ''
  );

  // Remove paragraphs/divs that contain Gutenberg references
  cleaned = cleaned.replace(
    /<p[^>]*>[^<]*Project Gutenberg[^<]*<\/p>/gi,
    ''
  );
  cleaned = cleaned.replace(
    /<p[^>]*>[^<]*gutenberg\.org[^<]*<\/p>/gi,
    ''
  );

  // Remove links to gutenberg
  cleaned = cleaned.replace(
    /<a[^>]*href="[^"]*gutenberg[^"]*"[^>]*>[^<]*<\/a>/gi,
    ''
  );

  // Replace remaining text references
  gutenbergPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, BRAND);
  });

  // Clean up empty paragraphs left behind
  cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/g, '');
  cleaned = cleaned.replace(/<div[^>]*>\s*<\/div>/g, '');

  return cleaned;
}

function processEpub(filePath) {
  const slug = path.basename(filePath, '.epub');
  console.log(`Processing: ${slug}`);

  try {
    const zip = new AdmZip(filePath);
    const entries = zip.getEntries();
    let modified = 0;

    entries.forEach(entry => {
      // Only process HTML/XHTML content files
      if (entry.entryName.match(/\.(html|xhtml|htm)$/i)) {
        const content = entry.getData().toString('utf8');

        // Check if this file contains Gutenberg references
        if (/gutenberg/i.test(content) || /\*\*\* START OF/i.test(content) || /\*\*\* END OF/i.test(content)) {
          const cleaned = cleanContent(content);
          zip.updateFile(entry.entryName, Buffer.from(cleaned, 'utf8'));
          modified++;
        }
      }
    });

    // Save the modified EPUB
    zip.writeZip(filePath);
    console.log(`  Cleaned ${modified} files inside EPUB`);
  } catch (err) {
    console.log(`  ERROR: ${err.message}`);
  }
}

// Process all EPUBs
const epubFiles = fs.readdirSync(EPUB_DIR).filter(f => f.endsWith('.epub'));
console.log(`Found ${epubFiles.length} EPUB files\n`);

epubFiles.forEach(file => {
  processEpub(path.join(EPUB_DIR, file));
});

console.log('\nDone! All Gutenberg headers removed and replaced with Wisdom Shelf branding.');
