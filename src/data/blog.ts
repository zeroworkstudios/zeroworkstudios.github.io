// The blog registry. Posts are synced into src/content/blog/<slug>/post.md (npm run sync);
// this file adds what the post itself does not carry: its sidebar label and its links.
import type { MarkdownInstance } from 'astro';
import { home } from './packages';

type Frontmatter = { title: string; description: string; date: string };

export type PostLinks = {
  /** The same post on Unity Discussions. Leave empty until it is published there. */
  forum?: string;
  /** The same post on Reddit. */
  reddit?: string;
  /** The asset the post is about. */
  asset?: { name: string; url: string };
};

export type PostEntry = {
  slug: string;
  /** Short title for the sidebar. */
  label: string;
  links: PostLinks;
  /** The line above the links at the end of the post. */
  closing?: string;
  /** Shorter sidebar labels for long H2s, keyed by heading slug. */
  sectionLabels?: Record<string, string>;
};

const entries: PostEntry[] = [
  {
    slug: 'ui-framework-benchmark',
    label: 'UI framework benchmark',
    links: {
      forum: '',
      reddit: '',
      asset: {
        name: 'Combo Counter',
        url: 'https://assetstore.unity.com/packages/tools/gui/combo-counter-system-217635',
      },
    },
    closing:
      'Know one of these frameworks well, or ran the benchmark on other hardware? Comment below or reply on a thread.',
    sectionLabels: {
      'cpu-the-c-frameworks-are-cheap-the-javascript-ones-are-not': 'CPU Time',
      'garbage-noesisgui-allocates-every-frame': 'Garbage',
      'does-the-backend-or-the-graphics-api-change-anything': 'Backends and Graphics APIs',
      'scorecard-and-overall-ranking': 'Scorecard and Ranking',
      'what-i-take-from-it': 'What I Take from It',
    },
  },
];

const modules = import.meta.glob<MarkdownInstance<Frontmatter>>('../content/blog/*/post.md', { eager: true });

export type Post = PostEntry & {
  title: string;
  description: string;
  date: Date;
  Content: MarkdownInstance<Frontmatter>['Content'];
  /** The post's H2s, for the sidebar. */
  sections: { id: string; label: string }[];
};

export const posts: Post[] = entries
  .map((e) => {
    const mod = modules[`../content/blog/${e.slug}/post.md`];
    if (!mod) throw new Error(`Blog post ${e.slug} is not synced. Run npm run sync.`);
    const { title, description, date } = mod.frontmatter;
    return {
      ...e,
      title,
      description,
      date: new Date(date),
      Content: mod.Content,
      sections: [
        { id: 'tldr', label: 'TL;DR' },
        ...mod
          .getHeadings()
          .filter((h) => h.depth === 2)
          .map((h) => ({ id: h.slug, label: e.sectionLabels?.[h.slug] ?? h.text })),
        // The Giscus thread under every post (src/components/Comments.astro).
        { id: 'comments', label: 'Comments' },
      ],
    };
  })
  .sort((a, b) => b.date.getTime() - a.date.getTime());

/** /blog/, or a post's page: postHref('ui-framework-benchmark'). */
export const postHref = (slug?: string) => home(slug ? `blog/${slug}/` : 'blog/');

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
