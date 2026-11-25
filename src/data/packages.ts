// The docs registry: one entry per package in the sidebar and on the docs home.
// `status: 'soon'` lists a package without a link. Delete an entry to hide it.
import comboMeta from '../content/combo-counter/meta.json';

/** package.json keeps full SemVer ("2.0.0"); people see "2.0". A non-zero patch stays ("2.0.1"). */
const displayVersion = (v: string) => v.replace(/^(\d+\.\d+)\.0$/, '$1');

export type PackageEntry = {
  slug: string;
  name: string;
  status: 'live' | 'soon';
  summary: string;
  version?: string;
  unity?: string;
  /** Asset Store page. */
  store?: string;
  /** Monogram tile, in the package's own colours. `bolt` draws the Combo Counter logo. */
  tile: { glyph: string; bg: string; fg: string; ink: string };
};

export const packages: PackageEntry[] = [
  {
    slug: 'combo-counter',
    name: 'Combo Counter',
    status: 'live',
    summary: 'Hit counters, scoring levels and floating word popups for seven Unity UI frameworks.',
    version: displayVersion(comboMeta.version),
    unity: comboMeta.unity,
    store: 'https://assetstore.unity.com/packages/tools/gui/combo-counter-system-217635',
    tile: { glyph: 'bolt', bg: '#D91129', fg: '#FFF6D6', ink: '#0C0A14' },
  },
  {
    slug: 'scene-stats',
    name: 'Scene Stats',
    status: 'soon',
    summary: 'A passive overlay for game FPS and camera CPU/GPU timings, in Play Mode and the Scene view.',
    tile: { glyph: 'SS', bg: '#E4D6A9', fg: '#622B14', ink: '#995F2F' },
  },
  {
    slug: 'gasworks',
    name: 'Gasworks',
    status: 'soon',
    summary: 'Render Graph lighting and post-processing modules for URP: GI, fog, reflections, AO, bloom, SMAA and tone mapping.',
    tile: { glyph: 'GW', bg: '#E4D6A9', fg: '#622B14', ink: '#995F2F' },
  },
];

/** Root of the docs section (/docs/). Package assets live under it too (public/docs/). */
export const base = import.meta.env.BASE_URL.replace(/\/?$/, '/') + 'docs/';
/** A docs URL: href() is the docs home, href('combo-counter/') a package guide. */
export const href = (path = '') => base + path.replace(/^\//, '');
/** A URL on the about page at the site root, e.g. home('#hank'). */
export const home = (hash = '') => import.meta.env.BASE_URL.replace(/\/?$/, '/') + hash;
