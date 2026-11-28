// Builds the studio's brand files from the animated logo, public/brand/zero-work-studios-logo.svg.
// Run with `npm run brand` after replacing that file, then commit what it writes:
//
//   public/brand/zero-work-studios-logo-static.svg   the finished logo, no animation (repeat visits)
//   public/og-image.png                               1200x630 social card
//
// and PNGs of the square studio mark, public/brand/zero-work-studios-mark.svg:
//
//   public/brand/zero-work-studios-mark-1024.png      uploads: Asset Store publisher logo, mailbox photo
//   public/brand/zero-work-studios-mark-512.png
//   public/apple-touch-icon.png                       180x180
//   public/favicon-32.png                             PNG favicon for browsers without SVG favicons
//
// The mark is hand-made, not built here: the logo's [0] and seated character on its charcoal, as
// SVG Tiny PS so the same file serves as the BIMI email logo. It allows no CSS, classes, clip paths,
// animation, text or images, and must stay square and under 32 kB. Strokes are ~30% heavier than in
// the logo so the line art survives a 40px avatar. If the logo's character changes, redo it by hand.
//
// The still frame is the logo with every animation off. The logo already shows its finished pose
// under prefers-reduced-motion, so its resting state is the final frame.
// PNGs are rendered with sharp (librsvg), which Astro already installs for its image pipeline.

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const pub = path.join(root, 'public');
const brand = path.join(pub, 'brand');
const source = fs.readFileSync(path.join(brand, 'zero-work-studios-logo.svg'), 'utf8');

const CHARCOAL = '#313131'; // the logo's own background

// ---- Still logo ----------------------------------------------------------------
const REDUCED = /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{\s*\*\s*\{\s*animation:\s*none\s*!important;\s*\}\s*\}/;
if (!REDUCED.test(source)) {
  console.error('✗ The logo no longer has its prefers-reduced-motion rule; update scripts/brand.mjs.');
  process.exit(1);
}
const still = source.replace(REDUCED, '* { animation: none !important; }');
fs.writeFileSync(path.join(brand, 'zero-work-studios-logo-static.svg'), still);
console.log('✓ brand/zero-work-studios-logo-static.svg');

/** Renders an SVG string to a PNG `size` wide, at a density that draws it sharp rather than upscaled. */
const raster = (svg, viewWidth, width) =>
  sharp(Buffer.from(svg), { density: Math.ceil((72 * width) / viewWidth) * 2 }).resize({ width });

async function write(img, out) {
  const info = await img.png({ compressionLevel: 9 }).toFile(out);
  console.log(`✓ ${path.relative(pub, out).replace(/\\/g, '/')} (${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} kB)`);
}

// Social card: the logo 1110 px wide, centred on its own charcoal.
const logo = await raster(still, 960, 1110).png().toBuffer();
const { height } = await sharp(logo).metadata();
await write(
  sharp({ create: { width: 1200, height: 630, channels: 3, background: CHARCOAL } }).composite([
    { input: logo, left: 45, top: Math.round((630 - height) / 2) },
  ]),
  path.join(pub, 'og-image.png'),
);

// ---- Square mark PNGs ----------------------------------------------------------
const mark = fs.readFileSync(path.join(brand, 'zero-work-studios-mark.svg'), 'utf8');
for (const [width, out] of [
  [1024, path.join(brand, 'zero-work-studios-mark-1024.png')],
  [512, path.join(brand, 'zero-work-studios-mark-512.png')],
  [180, path.join(pub, 'apple-touch-icon.png')],
  [32, path.join(pub, 'favicon-32.png')],
]) {
  await write(raster(mark, 256, width), out);
}
