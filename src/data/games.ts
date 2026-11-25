// The games registry: one entry per game in the sidebar and on /games/.
// Each game has its own page at /<slug>/ (src/pages/<slug>/index.astro).
import { home } from './packages';

export type GameEntry = {
  slug: string;
  name: string;
  status: 'live' | 'soon';
  /** One sentence for the games page and the game's meta description. */
  summary: string;
};

export const games: GameEntry[] = [
  {
    slug: 'racket-kings',
    name: 'Racket Kings',
    status: 'soon',
    summary:
      'A first-person crime sandbox for up to five players per family, set in an interwar British industrial city.',
  },
];

/** A game's page, e.g. gameHref('racket-kings') is /racket-kings/. gameHref() is /games/. */
export const gameHref = (slug?: string) => home(slug ? `${slug}/` : 'games/');
