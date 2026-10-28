/**
 * 產生 public/ 的品牌資產：favicon（svg／ico）、apple-touch-icon、logo.png、og-default.png
 *
 * 正式 logo 確定之前的暫用版本：顯影液黑底＋安全燈紅的圓點（設計文件 §6）。
 * SVG 裡只排拉丁字（中文字在 sharp 的 SVG 轉檔器裡會找不到字型）。
 *
 * 用法：npm run brand-assets
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');

const BG = '#0e0e10';
const TEXT = '#f1ede6';
const MUTED = '#a19c94';
const ACCENT = '#ff4d3d';

const mark = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${BG}"/>
  <circle cx="32" cy="32" r="19" fill="none" stroke="${ACCENT}" stroke-opacity=".35" stroke-width="2"/>
  <circle cx="32" cy="32" r="11" fill="${ACCENT}"/>
</svg>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="0.9" cy="0.08" r="0.65">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity=".38"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${BG}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <circle cx="90" cy="118" r="9" fill="${ACCENT}"/>
  <text x="116" y="126" font-family="Helvetica, Arial, sans-serif" font-size="21" font-weight="600" letter-spacing="6" fill="${MUTED}">AI FILM &amp; VIDEO PRODUCTION · TAIPEI</text>
  <text x="78" y="392" font-family="Helvetica, Arial, sans-serif" font-size="88" font-weight="800" letter-spacing="12" fill="${TEXT}">HALLUCINATION</text>
  <text x="78" y="492" font-family="Helvetica, Arial, sans-serif" font-size="88" font-weight="800" letter-spacing="12" fill="${TEXT}">FIVE</text>
  <rect x="80" y="544" width="120" height="3" fill="${ACCENT}"/>
</svg>`;

/** 把多張 PNG 包成一個 .ico（ICO 允許直接內嵌 PNG） */
function pngsToIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, png }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
}

const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

writeFileSync(join(PUBLIC, 'favicon.svg'), mark(64));
writeFileSync(join(PUBLIC, 'apple-touch-icon.png'), await png(mark(180), 180));
writeFileSync(join(PUBLIC, 'logo.png'), await png(mark(512), 512));
writeFileSync(
  join(PUBLIC, 'favicon.ico'),
  pngsToIco(await Promise.all([16, 32, 48].map(async (size) => ({ size, png: await png(mark(size), size) })))),
);
writeFileSync(join(PUBLIC, 'og-default.png'), await sharp(Buffer.from(og)).png().toBuffer());

console.log('✓ favicon.svg / favicon.ico / apple-touch-icon.png / logo.png / og-default.png');
