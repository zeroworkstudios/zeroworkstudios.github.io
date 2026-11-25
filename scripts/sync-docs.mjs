// Copies each package's Documentation.md and CHANGELOG.md from the Unity repo
// into src/content/<slug>/, and each blog post into src/content/blog/<slug>/,
// so the site builds without the Unity projects.
// Run with `npm run sync` after editing a package's docs, then commit the copies.
//
// Transforms are deliberately small:
// - Documentation.md: drops the H1, intro and "Contents" list (the page hero and
//   the sidebar replace them), up to the first `---` rule.
// - Links to CHANGELOG.md point at the package's changelog page.

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

/** Source folders per package slug. Override with env vars when the repos live elsewhere. */
const packages = [
  {
    slug: 'combo-counter',
    source:
      process.env.COMBO_COUNTER_DIR ??
      'C:/Users/Rafay/repos/GasworksTestBed/Packages/com.zeroworkstudios.combocounter',
  },
];

function stripIntro(md) {
  const lines = md.split(/\r?\n/);
  const rule = lines.findIndex((l) => l.trim() === '---');
  return rule === -1 ? md : lines.slice(rule + 1).join('\n').replace(/^\s+/, '');
}

function rewriteLinks(md) {
  return md.replace(/\]\(CHANGELOG\.md(#[^)]*)?\)/g, (_, hash = '') => `](changelog/${hash})`);
}

let failed = false;
for (const pkg of packages) {
  const outDir = path.join(root, 'src', 'content', pkg.slug);
  fs.mkdirSync(outDir, { recursive: true });

  for (const [file, transform] of [
    ['Documentation.md', (md) => rewriteLinks(stripIntro(md))],
    ['CHANGELOG.md', (md) => md],
  ]) {
    const from = path.join(pkg.source, file);
    if (!fs.existsSync(from)) {
      console.error(`✗ ${pkg.slug}: ${from} not found`);
      failed = true;
      continue;
    }
    const out = transform(fs.readFileSync(from, 'utf8'));
    fs.writeFileSync(path.join(outDir, file), out);
    console.log(`✓ ${pkg.slug}/${file}`);
  }

  const manifest = path.join(pkg.source, 'package.json');
  if (fs.existsSync(manifest)) {
    const { version, unity } = JSON.parse(fs.readFileSync(manifest, 'utf8'));
    fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify({ version, unity }, null, 2) + '\n');
    console.log(`✓ ${pkg.slug}/meta.json (v${version}, Unity ${unity})`);
  }
}

// ---- Blog posts --------------------------------------------------------------
// Each post is a folder with post.md and its images/. The post is copied as-is; only the
// light-theme charts are copied (the site is light only), skipping the *.dark.png twins.
const posts = [
  {
    slug: 'ui-framework-benchmark',
    source:
      process.env.UI_BENCHMARK_POST_DIR ?? 'C:/Users/Rafay/repos/GasworksTestBed/Blog/ui-framework-benchmark',
  },
];

for (const post of posts) {
  const from = path.join(post.source, 'post.md');
  if (!fs.existsSync(from)) {
    console.error(`✗ blog/${post.slug}: ${from} not found`);
    failed = true;
    continue;
  }
  const outDir = path.join(root, 'src', 'content', 'blog', post.slug);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir, 'images'), { recursive: true });
  fs.copyFileSync(from, path.join(outDir, 'post.md'));

  const images = path.join(post.source, 'images');
  const pngs = fs.existsSync(images) ? fs.readdirSync(images).filter((f) => /\.(png|jpe?g|webp)$/i.test(f) && !/\.dark\./i.test(f)) : [];
  for (const f of pngs) fs.copyFileSync(path.join(images, f), path.join(outDir, 'images', f));
  console.log(`✓ blog/${post.slug}/post.md (+${pngs.length} images)`);
}

process.exit(failed ? 1 : 0);
