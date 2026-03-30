const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const EPUB_DIR = path.join(__dirname, '..', 'static', 'downloads', 'epub');
const COVERS_DIR = path.join(__dirname, '..', 'static', 'images', 'covers');

function replaceCovers(epubPath, coverPngPath) {
  const slug = path.basename(epubPath, '.epub');

  try {
    const zip = new AdmZip(epubPath);
    const entries = zip.getEntries();
    const coverData = fs.readFileSync(coverPngPath);

    let replaced = 0;

    entries.forEach(entry => {
      const name = entry.entryName.toLowerCase();

      // Find and replace cover images (common patterns in Gutenberg EPUBs)
      if (
        name.match(/cover\.(jpg|jpeg|png|gif|svg)$/i) ||
        name.match(/pg\d+\.cover\./i) ||
        name.match(/images\/cover/i) ||
        name.match(/cover-image/i) ||
        name.match(/title[-_]?page\.(jpg|jpeg|png)/i)
      ) {
        // Replace with our cover as PNG
        zip.updateFile(entry.entryName, coverData);
        replaced++;
        console.log(`  Replaced: ${entry.entryName}`);
      }
    });

    // If no cover image found by name, look for the first image that's large enough
    // (Gutenberg cover images are usually the first/largest image)
    if (replaced === 0) {
      // Check the OPF file for cover metadata
      const opfEntry = entries.find(e => e.entryName.match(/\.(opf)$/i));
      if (opfEntry) {
        const opfContent = opfEntry.getData().toString('utf8');
        // Find cover image reference in OPF
        const coverMatch = opfContent.match(/name="cover"[^/]*content="([^"]+)"/i) ||
                          opfContent.match(/properties="cover-image"[^/]*href="([^"]+)"/i) ||
                          opfContent.match(/id="cover[^"]*"[^>]*href="([^"]+)"/i) ||
                          opfContent.match(/id="img-cover[^"]*"[^>]*href="([^"]+)"/i);

        if (coverMatch) {
          const coverId = coverMatch[1];
          // Find the actual image by ID or href
          const hrefMatch = opfContent.match(new RegExp(`id="${coverId}"[^>]*href="([^"]+)"`, 'i')) ||
                           opfContent.match(new RegExp(`href="([^"]*${coverId}[^"]*)"`, 'i'));

          if (hrefMatch) {
            const imgPath = hrefMatch[1];
            // Find the entry with this path
            const imgEntry = entries.find(e =>
              e.entryName.endsWith(imgPath) || e.entryName.includes(imgPath)
            );
            if (imgEntry) {
              zip.updateFile(imgEntry.entryName, coverData);
              replaced++;
              console.log(`  Replaced (via OPF): ${imgEntry.entryName}`);
            }
          }
        }
      }
    }

    // Also look for any image files with "gutenberg" in the name
    entries.forEach(entry => {
      if (entry.entryName.toLowerCase().includes('gutenberg') &&
          entry.entryName.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
        zip.updateFile(entry.entryName, coverData);
        replaced++;
        console.log(`  Replaced (gutenberg): ${entry.entryName}`);
      }
    });

    // Also clean any remaining text references to Gutenberg in HTML files
    entries.forEach(entry => {
      if (entry.entryName.match(/\.(html|xhtml|htm)$/i)) {
        let content = entry.getData().toString('utf8');
        if (content.includes('Gutenberg') || content.includes('gutenberg')) {
          content = content.replace(/Project Gutenberg/gi, 'Wisdom Shelf');
          content = content.replace(/gutenberg\.org/gi, 'wisdom-shelf-ebooks.netlify.app');
          content = content.replace(/GUTENBERG/g, 'WISDOM SHELF');
          zip.updateFile(entry.entryName, Buffer.from(content, 'utf8'));
        }
      }
    });

    zip.writeZip(epubPath);
    console.log(`  Total images replaced: ${replaced}`);
    return replaced;
  } catch (err) {
    console.log(`  ERROR: ${err.message}`);
    return 0;
  }
}

// Process all EPUBs
const epubFiles = fs.readdirSync(EPUB_DIR).filter(f => f.endsWith('.epub'));
console.log(`Processing ${epubFiles.length} EPUB files\n`);

let totalReplaced = 0;
epubFiles.forEach(file => {
  const slug = file.replace('.epub', '');
  const coverPath = path.join(COVERS_DIR, `${slug}.png`);

  console.log(`Processing: ${slug}`);
  if (fs.existsSync(coverPath)) {
    totalReplaced += replaceCovers(path.join(EPUB_DIR, file), coverPath);
  } else {
    console.log(`  No cover found for ${slug}`);
  }
});

console.log(`\nDone! Replaced ${totalReplaced} cover images total.`);
