import { getHeadings } from '../../content/combo-counter/CHANGELOG.md';
import type { NavLink } from '../../components/Sidebar.astro';

/**
 * The changelog's releases, newest first, for the sidebar. Each H2 is a release in the
 * Keep a Changelog form `[2.0] - 2026-11-04`; the link keeps the heading's own anchor.
 * They are sorted by version rather than trusted to file order, so 2.1 lands above 2.0
 * wherever it is written, and an `[Unreleased]` section stays at the very top.
 */
// rehype-docs rewrites the heading to `v2.0` + `2026-11-04`, so the text arrives as
// `v2.02026-11-04`. Strip the date, then any brackets or `v`, to accept either form.
const parse = (text: string) =>
  text
    .replace(/\s*-?\s*\d{4}-\d{2}-\d{2}$/, '')
    .replace(/^\[?v?|\]$/g, '')
    .trim();

const order = (v: string) =>
  /^unreleased$/i.test(v) ? [Infinity] : v.split('.').map((n) => Number.parseInt(n, 10) || 0);

const newerFirst = (a: string, b: string) => {
  const x = order(a);
  const y = order(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (y[i] ?? 0) - (x[i] ?? 0);
    if (d) return d;
  }
  return 0;
};

export const versions: NavLink[] = getHeadings()
  .filter((h) => h.depth === 2)
  .map((h) => ({ id: h.slug, version: parse(h.text) }))
  .sort((a, b) => newerFirst(a.version, b.version))
  .map(({ id, version }) => ({ id, label: /^unreleased$/i.test(version) ? 'Unreleased' : `v${version}` }));
