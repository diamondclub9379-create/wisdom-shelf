# Wisdom Shelf — Free Classic Ebooks

A static website offering beautifully formatted public domain ebooks for free download, monetized with Google AdSense.

## Tech Stack

- **Hugo** (static site generator)
- Custom theme: `wisdomshelf`
- Hosted on GitHub Pages / Netlify (free)

## Quick Start

```bash
# Install Hugo (if not already installed)
winget install Hugo.Hugo.Extended

# Run dev server
hugo server -D

# Build for production
hugo
```

Output goes to `public/` directory.

## Adding a New Book

Create a new file in `content/ebooks/`:

```bash
hugo new ebooks/book-slug.md
```

Then edit the frontmatter:

```yaml
---
title: "Book Title"
author: "Author Name"
year: 1900
description: "SEO description for this book page."
categories:
  - Self-Help       # or Philosophy, Business
tags:
  - relevant-tag
gutenbergId: "12345"
gutenbergURL: "https://www.gutenberg.org/ebooks/12345"
downloadPDF: "https://www.gutenberg.org/files/12345/12345-pdf.pdf"
downloadEPUB: "https://www.gutenberg.org/ebooks/12345.epub3.images"
weight: 10          # Lower = shows first
---

Write a unique 2-3 paragraph description here. Include what the reader
will learn and why this book matters. This is your SEO content.
```

## Setting Up AdSense

1. Apply for Google AdSense at https://adsense.google.com
2. Once approved, add your publisher ID to `hugo.toml`:
   ```toml
   [params]
     adsenseId = "ca-pub-XXXXXXXXXXXXXXXX"
   ```
3. Rebuild the site — ads will appear in the placeholder slots

## Ad Placement

Ad slots are placed in:
- Below hero section on homepage
- Above and below book grid on category pages
- Below book title on detail pages
- Above download buttons on detail pages
- Bottom of detail pages

## Project Structure

```
ebooks-site/
├── content/
│   ├── ebooks/          # Book pages (one .md per book)
│   ├── about.md         # About page
│   └── privacy.md       # Privacy Policy (required for AdSense)
├── themes/wisdomshelf/
│   ├── layouts/         # HTML templates
│   ├── static/css/      # Stylesheet
│   └── static/js/       # JavaScript
├── static/
│   └── robots.txt
└── hugo.toml            # Site configuration
```

## Deployment

### Netlify (Recommended)
1. Push to GitHub
2. Connect repo to Netlify
3. Set build command: `hugo`
4. Set publish directory: `public`
5. Set `HUGO_VERSION` environment variable to `0.159.1`

### GitHub Pages
1. Build with `hugo`
2. Push `public/` folder to `gh-pages` branch

## SEO Features

- Schema.org Book structured data on every book page
- Unique meta titles and descriptions
- Clean URL structure: `/ebooks/book-slug/`
- Auto-generated sitemap.xml
- robots.txt
- Open Graph tags

## Content Sources

All books sourced from [Project Gutenberg](https://www.gutenberg.org/) (public domain, free to use).

## License

Website code: MIT License
Book content: Public Domain
