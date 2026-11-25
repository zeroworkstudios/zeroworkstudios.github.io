import { getHeadings } from '../../content/combo-counter/Documentation.md';
import type { NavGroup } from '../../components/Sidebar.astro';

// Shorter sidebar labels for long headings. Anything not listed keeps its heading text.
const LABELS: Record<string, string> = {
  'ugui-textmesh-pro': 'uGUI',
  'breakcombo-and-resetscore': 'BreakCombo / ResetScore',
  'scene-layout-and-logging': 'Scene layout & logging',
};

const label = (h: { slug: string; text: string }) => LABELS[h.slug] ?? h.text;

/** The guide as a two-level tree: each H2 is a group, its H3s are the children. */
export const sections: NavGroup[] = [{ id: 'top', label: 'Overview', children: [] }];

for (const h of getHeadings()) {
  if (h.depth === 2) sections.push({ id: h.slug, label: label(h), children: [] });
  else if (h.depth === 3 && sections.length > 1) sections.at(-1)!.children.push({ id: h.slug, label: label(h) });
}
