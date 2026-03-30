const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 675; // 16:9 ratio

const themes = [
  { bg: ['#1a1a2e', '#16213e'], accent: '#e94560', icon: '📖' },
  { bg: ['#0f3460', '#16213e'], accent: '#66c0f4', icon: '🧠' },
  { bg: ['#2c3e50', '#34495e'], accent: '#f39c12', icon: '⚡' },
  { bg: ['#1b2838', '#2a475e'], accent: '#66c0f4', icon: '🏛️' },
  { bg: ['#3c1642', '#1b1b2f'], accent: '#e43f5a', icon: '✨' },
  { bg: ['#2d132c', '#801336'], accent: '#ee4540', icon: '🔥' },
  { bg: ['#1a3c34', '#2d6a4f'], accent: '#95d5b2', icon: '🌿' },
  { bg: ['#003049', '#023e7d'], accent: '#ffb703', icon: '💡' },
  { bg: ['#3d0000', '#6b0000'], accent: '#ff6600', icon: '⚔️' },
  { bg: ['#1b1b1b', '#2d2d2d'], accent: '#c9a96e', icon: '👑' },
  { bg: ['#0b0b45', '#1b1464'], accent: '#ffd700', icon: '🌟' },
  { bg: ['#2b2024', '#4a3040'], accent: '#d4a574', icon: '📜' },
  { bg: ['#1a1a40', '#3a3a80'], accent: '#ff6b6b', icon: '🎯' },
  { bg: ['#0d1b2a', '#1b263b'], accent: '#e0e1dd', icon: '🧭' },
  { bg: ['#212529', '#343a40'], accent: '#fca311', icon: '💪' },
  { bg: ['#14213d', '#1d3557'], accent: '#fca311', icon: '🔑' },
  { bg: ['#2b2d42', '#3d405b'], accent: '#ef233c', icon: '📝' },
  { bg: ['#132a13', '#31572c'], accent: '#ecf39e', icon: '🌱' },
  { bg: ['#1b0a2e', '#2e1065'], accent: '#c084fc', icon: '🔮' },
  { bg: ['#422006', '#713f12'], accent: '#fbbf24', icon: '⭐' },
  { bg: ['#1a0533', '#2d1b69'], accent: '#a78bfa', icon: '🪷' },
  { bg: ['#064e3b', '#065f46'], accent: '#6ee7b7', icon: '🏔️' },
  { bg: ['#4a1942', '#6b2c5b'], accent: '#f0abfc', icon: '💎' },
  { bg: ['#172554', '#1e3a5f'], accent: '#38bdf8', icon: '🌊' },
  { bg: ['#3b0764', '#581c87'], accent: '#e879f9', icon: '🦋' },
  { bg: ['#1c1917', '#44403c'], accent: '#fcd34d', icon: '🕯️' },
  { bg: ['#0c4a6e', '#075985'], accent: '#22d3ee', icon: '🧊' },
  { bg: ['#365314', '#4d7c0f'], accent: '#bef264', icon: '🍃' },
  { bg: ['#7f1d1d', '#991b1b'], accent: '#fca5a5', icon: '❤️' },
  { bg: ['#312e81', '#3730a3'], accent: '#818cf8', icon: '🌙' },
];

const articles = [
  { slug: 'as-a-man-thinketh-summary-lessons', title: 'As a Man Thinketh\nSummary & 7 Lessons', subtitle: 'James Allen' },
  { slug: 'neville-goddard-techniques-beginners-guide', title: '5 Neville Goddard\nTechniques', subtitle: "Beginner's Guide" },
  { slug: 'best-public-domain-self-help-books', title: '10 Best Free\nSelf-Help Books', subtitle: 'Public Domain Classics' },
  { slug: 'meditations-marcus-aurelius-summary', title: 'Meditations\nby Marcus Aurelius', subtitle: '10 Timeless Lessons' },
  { slug: 'science-of-getting-rich-summary', title: 'The Science of\nGetting Rich', subtitle: 'Wallace D. Wattles' },
  { slug: 'neville-goddard-vs-napoleon-hill', title: 'Neville Goddard\nvs Napoleon Hill', subtitle: 'Two Paths to Success' },
  { slug: 'law-of-assumption-complete-guide', title: 'The Law of\nAssumption', subtitle: 'A Complete Guide' },
  { slug: 'neville-goddard-quotes', title: '20 Powerful\nNeville Goddard Quotes', subtitle: 'With Explanations' },
  { slug: 'stoicism-beginners-guide', title: 'Stoicism for\nBeginners', subtitle: 'Marcus Aurelius & Epictetus' },
  { slug: 'power-of-concentration-summary', title: 'The Power of\nConcentration', subtitle: '5 Exercises for Focus' },
  { slug: 'feeling-is-the-secret-summary', title: 'Feeling Is\nthe Secret', subtitle: 'Apply It Tonight' },
  { slug: 'game-of-life-florence-scovel-shinn-summary', title: 'The Game of Life\nby Florence Scovel Shinn', subtitle: 'Key Lessons' },
  { slug: 'art-of-war-summary-modern-lessons', title: 'The Art of War\nby Sun Tzu', subtitle: 'Lessons for Modern Life' },
  { slug: 'revision-technique-neville-goddard', title: 'The Revision\nTechnique', subtitle: 'Neville Goddard Step-by-Step' },
  { slug: 'the-prince-machiavelli-summary', title: 'The Prince\nby Machiavelli', subtitle: 'Lessons on Power' },
  { slug: 'self-reliance-emerson-summary', title: 'Self-Reliance\nby Emerson', subtitle: 'Independent Thinking' },
  { slug: 'how-to-manifest-with-imagination', title: 'How to Manifest\nwith Imagination', subtitle: 'Classic Book Methods' },
  { slug: 'walden-thoreau-summary', title: 'Walden\nby Thoreau', subtitle: 'Lessons on Simple Living' },
  { slug: 'benjamin-franklin-autobiography-lessons', title: "Benjamin Franklin's\nAutobiography", subtitle: '7 Lessons for Success' },
  { slug: 'confucius-analects-wisdom', title: 'Confucius &\nThe Analects', subtitle: 'Ancient Wisdom Today' },
  { slug: 'morning-routine-classic-books', title: 'The Perfect\nMorning Routine', subtitle: 'From Classic Books' },
  { slug: 'wealth-of-nations-summary', title: 'The Wealth\nof Nations', subtitle: 'Adam Smith — Key Ideas' },
  { slug: 'best-stoic-philosophy-books-free', title: 'Best Stoic\nPhilosophy Books', subtitle: 'All Free Downloads' },
  { slug: 'power-of-awareness-summary', title: 'The Power of\nAwareness', subtitle: 'Complete Summary & Guide' },
  { slug: 'plato-republic-summary', title: "Plato's Republic\nSummary", subtitle: 'Ideas That Shape Our World' },
  { slug: 'james-allen-philosophy-guide', title: "James Allen's\nPhilosophy", subtitle: 'A Complete Guide' },
  { slug: 'build-unshakeable-mindset', title: 'Build an Unshakeable\nMindset', subtitle: 'Lessons from 5 Classics' },
  { slug: 'discourse-on-method-descartes-summary', title: 'Discourse on\nthe Method', subtitle: 'Descartes — I Think, Therefore I Am' },
  { slug: 'on-liberty-john-stuart-mill-summary', title: 'On Liberty\nby John Stuart Mill', subtitle: 'Why Free Speech Matters' },
  { slug: 'how-they-succeeded-lessons', title: 'How They\nSucceeded', subtitle: "Timeless Success Lessons" },
];

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  for (const word of words) {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawImage(article, theme, index) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bgGrad.addColorStop(0, theme.bg[0]);
  bgGrad.addColorStop(1, theme.bg[1]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Decorative circles
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(WIDTH * 0.85, HEIGHT * 0.15, 250, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(WIDTH * 0.1, HEIGHT * 0.85, 180, 0, Math.PI * 2);
  ctx.fill();
  // Extra decorative element
  ctx.beginPath();
  ctx.arc(WIDTH * 0.65, HEIGHT * 0.8, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Geometric line decoration on the right
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(WIDTH - 100 - i * 30, 80);
    ctx.lineTo(WIDTH - 100 - i * 30, HEIGHT - 80);
    ctx.stroke();
  }
  ctx.restore();

  // Top accent bar
  const accentGrad = ctx.createLinearGradient(80, 0, 500, 0);
  accentGrad.addColorStop(0, theme.accent);
  accentGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = accentGrad;
  ctx.fillRect(80, 70, 420, 4);

  // Category / branding
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = theme.accent;
  ctx.fillText('WISDOM SHELF  •  BLOG', 80, 110);

  // Title
  const titleLines = article.title.split('\n');
  const titleSize = 56;
  ctx.font = `bold ${titleSize}px Georgia, serif`;
  ctx.fillStyle = '#ffffff';

  const lineHeight = titleSize * 1.2;
  const titleStartY = 200;
  titleLines.forEach((line, i) => {
    ctx.fillText(line, 80, titleStartY + i * lineHeight);
  });

  // Divider
  const dividerY = titleStartY + titleLines.length * lineHeight + 20;
  const divGrad2 = ctx.createLinearGradient(80, dividerY, 400, dividerY);
  divGrad2.addColorStop(0, theme.accent);
  divGrad2.addColorStop(1, 'transparent');
  ctx.fillStyle = divGrad2;
  ctx.fillRect(80, dividerY, 320, 3);

  // Subtitle
  ctx.font = '26px Georgia, serif';
  ctx.fillStyle = '#cccccc';
  ctx.fillText(article.subtitle, 80, dividerY + 45);

  // Bottom accent bar
  ctx.fillStyle = theme.accent;
  ctx.fillRect(0, HEIGHT - 6, WIDTH, 6);

  // Bottom-right branding
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#666666';
  ctx.textAlign = 'right';
  ctx.fillText('wisdomshelf.com', WIDTH - 80, HEIGHT - 30);
  ctx.textAlign = 'left';

  // Subtle border
  ctx.strokeStyle = theme.accent;
  ctx.globalAlpha = 0.12;
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, WIDTH - 80, HEIGHT - 80);
  ctx.globalAlpha = 1;

  return canvas;
}

// Generate all images
const outputDir = path.join(__dirname, '..', 'static', 'images', 'blog');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

articles.forEach((article, i) => {
  const theme = themes[i % themes.length];
  const canvas = drawImage(article, theme, i);
  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(outputDir, `${article.slug}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated: ${article.slug}.png`);
});

console.log(`\nDone! Generated ${articles.length} blog images.`);
