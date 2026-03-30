const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const COVER_WIDTH = 600;
const COVER_HEIGHT = 900;

// Color themes for covers - each book gets a unique elegant palette
const themes = [
  { bg: ['#1a1a2e', '#16213e'], accent: '#e94560', text: '#ffffff', sub: '#cccccc' },
  { bg: ['#0f3460', '#16213e'], accent: '#e94560', text: '#ffffff', sub: '#aabbcc' },
  { bg: ['#2c3e50', '#34495e'], accent: '#f39c12', text: '#ffffff', sub: '#bdc3c7' },
  { bg: ['#1b2838', '#2a475e'], accent: '#66c0f4', text: '#ffffff', sub: '#a3c2d8' },
  { bg: ['#3c1642', '#1b1b2f'], accent: '#e43f5a', text: '#ffffff', sub: '#c4a4c9' },
  { bg: ['#2d132c', '#801336'], accent: '#ee4540', text: '#ffffff', sub: '#d4a5a5' },
  { bg: ['#1a3c34', '#2d6a4f'], accent: '#95d5b2', text: '#ffffff', sub: '#b7e4c7' },
  { bg: ['#003049', '#023e7d'], accent: '#ffb703', text: '#ffffff', sub: '#8ecae6' },
  { bg: ['#3d0000', '#6b0000'], accent: '#ff6600', text: '#ffffff', sub: '#e0a899' },
  { bg: ['#1b1b1b', '#2d2d2d'], accent: '#c9a96e', text: '#ffffff', sub: '#999999' },
  { bg: ['#0b0b45', '#1b1464'], accent: '#ffd700', text: '#ffffff', sub: '#8888cc' },
  { bg: ['#2b2024', '#4a3040'], accent: '#d4a574', text: '#ffffff', sub: '#c0a090' },
  { bg: ['#1a1a40', '#3a3a80'], accent: '#ff6b6b', text: '#ffffff', sub: '#aaaadd' },
  { bg: ['#0d1b2a', '#1b263b'], accent: '#e0e1dd', text: '#ffffff', sub: '#778da9' },
  { bg: ['#212529', '#343a40'], accent: '#fca311', text: '#ffffff', sub: '#adb5bd' },
  { bg: ['#14213d', '#1d3557'], accent: '#fca311', text: '#ffffff', sub: '#a8dadc' },
  { bg: ['#2b2d42', '#3d405b'], accent: '#ef233c', text: '#ffffff', sub: '#8d99ae' },
  { bg: ['#132a13', '#31572c'], accent: '#ecf39e', text: '#ffffff', sub: '#90a955' },
  { bg: ['#1b0a2e', '#2e1065'], accent: '#c084fc', text: '#ffffff', sub: '#9f7aea' },
  { bg: ['#422006', '#713f12'], accent: '#fbbf24', text: '#ffffff', sub: '#d4a574' },
  // Additional themes for Neville Goddard books
  { bg: ['#1a0533', '#2d1b69'], accent: '#a78bfa', text: '#ffffff', sub: '#c4b5fd' },
  { bg: ['#064e3b', '#065f46'], accent: '#6ee7b7', text: '#ffffff', sub: '#a7f3d0' },
  { bg: ['#4a1942', '#6b2c5b'], accent: '#f0abfc', text: '#ffffff', sub: '#d8b4fe' },
  { bg: ['#172554', '#1e3a5f'], accent: '#38bdf8', text: '#ffffff', sub: '#7dd3fc' },
  { bg: ['#3b0764', '#581c87'], accent: '#e879f9', text: '#ffffff', sub: '#d946ef' },
  { bg: ['#1c1917', '#44403c'], accent: '#fcd34d', text: '#ffffff', sub: '#d6d3d1' },
  { bg: ['#0c4a6e', '#075985'], accent: '#22d3ee', text: '#ffffff', sub: '#67e8f9' },
  { bg: ['#365314', '#4d7c0f'], accent: '#bef264', text: '#ffffff', sub: '#a3e635' },
  { bg: ['#7f1d1d', '#991b1b'], accent: '#fca5a5', text: '#ffffff', sub: '#fecaca' },
  { bg: ['#312e81', '#3730a3'], accent: '#818cf8', text: '#ffffff', sub: '#a5b4fc' },
];

const books = [
  { slug: 'as-a-man-thinketh', title: 'As a Man\nThinketh', author: 'James Allen', year: '1903', category: 'SELF-HELP' },
  { slug: 'the-science-of-getting-rich', title: 'The Science\nof Getting Rich', author: 'Wallace D. Wattles', year: '1910', category: 'SELF-HELP' },
  { slug: 'meditations', title: 'Meditations', author: 'Marcus Aurelius', year: '180 AD', category: 'PHILOSOPHY' },
  { slug: 'the-prince', title: 'The Prince', author: 'Niccolò Machiavelli', year: '1532', category: 'BUSINESS' },
  { slug: 'autobiography-of-benjamin-franklin', title: 'Autobiography\nof Benjamin\nFranklin', author: 'Benjamin Franklin', year: '1791', category: 'BUSINESS' },
  { slug: 'the-way-of-peace', title: 'The Way\nof Peace', author: 'James Allen', year: '1907', category: 'SELF-HELP' },
  { slug: 'the-heavenly-life', title: 'The Heavenly\nLife', author: 'James Allen', year: '1907', category: 'SELF-HELP' },
  { slug: 'how-they-succeeded', title: 'How They\nSucceeded', author: 'Orison Swett Marden', year: '1901', category: 'BUSINESS' },
  { slug: 'the-power-of-concentration', title: 'The Power of\nConcentration', author: 'Theron Q. Dumont', year: '1918', category: 'SELF-HELP' },
  { slug: 'think-and-grow-rich', title: 'The Law\nof Success', author: 'Napoleon Hill', year: '1928', category: 'SELF-HELP' },
  { slug: 'self-reliance', title: 'Self-Reliance\n& Other Essays', author: 'Ralph Waldo Emerson', year: '1841', category: 'PHILOSOPHY' },
  { slug: 'the-art-of-war', title: 'The Art\nof War', author: 'Sun Tzu', year: '500 BC', category: 'STRATEGY' },
  { slug: 'the-wealth-of-nations', title: 'The Wealth\nof Nations', author: 'Adam Smith', year: '1776', category: 'ECONOMICS' },
  { slug: 'walden', title: 'Walden', author: 'Henry David Thoreau', year: '1854', category: 'PHILOSOPHY' },
  { slug: 'the-republic', title: 'The Republic', author: 'Plato', year: '375 BC', category: 'PHILOSOPHY' },
  { slug: 'on-liberty', title: 'On Liberty', author: 'John Stuart Mill', year: '1859', category: 'PHILOSOPHY' },
  { slug: 'the-analects', title: 'The Analects', author: 'Confucius', year: '479 BC', category: 'PHILOSOPHY' },
  { slug: 'the-enchiridion', title: 'The\nEnchiridion', author: 'Epictetus', year: '135 AD', category: 'PHILOSOPHY' },
  { slug: 'discourse-on-method', title: 'Discourse on\nthe Method', author: 'René Descartes', year: '1637', category: 'PHILOSOPHY' },
  { slug: 'the-game-of-life', title: 'The Game of\nLife & How\nto Play It', author: 'Florence Scovel Shinn', year: '1925', category: 'SELF-HELP' },
  // Neville Goddard books
  { slug: 'at-your-command', title: 'At Your\nCommand', author: 'Neville Goddard', year: '1939', category: 'SELF-HELP' },
  { slug: 'your-faith-is-your-fortune', title: 'Your Faith Is\nYour Fortune', author: 'Neville Goddard', year: '1941', category: 'SELF-HELP' },
  { slug: 'freedom-for-all', title: 'Freedom\nfor All', author: 'Neville Goddard', year: '1942', category: 'SELF-HELP' },
  { slug: 'feeling-is-the-secret', title: 'Feeling Is\nthe Secret', author: 'Neville Goddard', year: '1944', category: 'SELF-HELP' },
  { slug: 'prayer-the-art-of-believing', title: 'Prayer:\nThe Art of\nBelieving', author: 'Neville Goddard', year: '1945', category: 'SELF-HELP' },
  { slug: 'out-of-this-world', title: 'Out of\nThis World', author: 'Neville Goddard', year: '1949', category: 'SELF-HELP' },
  { slug: 'the-power-of-awareness', title: 'The Power of\nAwareness', author: 'Neville Goddard', year: '1952', category: 'SELF-HELP' },
  { slug: 'awakened-imagination', title: 'Awakened\nImagination', author: 'Neville Goddard', year: '1954', category: 'SELF-HELP' },
  { slug: 'seedtime-and-harvest', title: 'Seedtime\nand Harvest', author: 'Neville Goddard', year: '1956', category: 'SELF-HELP' },
  { slug: 'the-law-and-the-promise', title: 'The Law and\nthe Promise', author: 'Neville Goddard', year: '1961', category: 'SELF-HELP' },
];

function drawCover(book, theme, index) {
  const canvas = createCanvas(COVER_WIDTH, COVER_HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, COVER_WIDTH, COVER_HEIGHT);
  bgGrad.addColorStop(0, theme.bg[0]);
  bgGrad.addColorStop(1, theme.bg[1]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, COVER_WIDTH, COVER_HEIGHT);

  // Decorative geometric elements
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#ffffff';
  // Large circle
  ctx.beginPath();
  ctx.arc(COVER_WIDTH * 0.8, COVER_HEIGHT * 0.2, 200, 0, Math.PI * 2);
  ctx.fill();
  // Small circle
  ctx.beginPath();
  ctx.arc(COVER_WIDTH * 0.15, COVER_HEIGHT * 0.75, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Top accent line
  ctx.fillStyle = theme.accent;
  ctx.fillRect(60, 60, 80, 4);

  // Category label
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = theme.accent;
  ctx.letterSpacing = '3px';
  ctx.fillText(book.category, 60, 100);

  // Year
  ctx.font = '16px sans-serif';
  ctx.fillStyle = theme.sub;
  ctx.textAlign = 'right';
  ctx.fillText(book.year, COVER_WIDTH - 60, 100);
  ctx.textAlign = 'left';

  // Title
  const titleLines = book.title.split('\n');
  const titleSize = titleLines.length > 2 ? 52 : (titleLines.some(l => l.length > 12) ? 52 : 62);
  ctx.font = `bold ${titleSize}px Georgia, serif`;
  ctx.fillStyle = theme.text;

  const lineHeight = titleSize * 1.2;
  const titleStartY = 200;
  titleLines.forEach((line, i) => {
    ctx.fillText(line, 60, titleStartY + i * lineHeight);
  });

  // Decorative divider
  const dividerY = titleStartY + titleLines.length * lineHeight + 30;
  const divGrad = ctx.createLinearGradient(60, dividerY, 300, dividerY);
  divGrad.addColorStop(0, theme.accent);
  divGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = divGrad;
  ctx.fillRect(60, dividerY, 240, 3);

  // Author
  ctx.font = '22px Georgia, serif';
  ctx.fillStyle = theme.sub;
  ctx.fillText(book.author, 60, dividerY + 45);

  // Bottom accent bar
  ctx.fillStyle = theme.accent;
  ctx.fillRect(0, COVER_HEIGHT - 8, COVER_WIDTH, 8);

  // Bottom branding
  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = theme.sub;
  ctx.globalAlpha = 0.5;
  ctx.textAlign = 'center';
  ctx.fillText('WISDOM SHELF  •  FREE CLASSIC EBOOKS', COVER_WIDTH / 2, COVER_HEIGHT - 30);
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';

  // Subtle border
  ctx.strokeStyle = theme.accent;
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1;
  ctx.strokeRect(30, 30, COVER_WIDTH - 60, COVER_HEIGHT - 60);
  ctx.globalAlpha = 1;

  return canvas;
}

// Generate all covers
const outputDir = path.join(__dirname, '..', 'static', 'images', 'covers');

books.forEach((book, i) => {
  const theme = themes[i % themes.length];
  const canvas = drawCover(book, theme, i);
  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(outputDir, `${book.slug}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated: ${book.slug}.png`);
});

console.log(`\nDone! Generated ${books.length} covers.`);
