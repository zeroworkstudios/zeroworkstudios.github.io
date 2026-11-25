# zeroworkstudios.github.io

The Zero Work Studios website: one Astro site, deployed to GitHub Pages from this repo.

| URL | Page |
| --- | --- |
| `/` | The studio page: overview, Officer Hank's ID card, channels |
| `/games/` | Games home |
| `/<game>/` | A game's page, e.g. `/racket-kings/` |
| `/docs/` | Package docs home |
| `/docs/<slug>/` | A package's guide, `/docs/<slug>/changelog/` its changelog |
| `/blog/` | Blog home |
| `/blog/<slug>/` | A blog post |
| `/about/` | Old about-repo URL, redirects to `/` (keeps `#anchors`) |
| `/docs/combocounter` | Redirect used by the Combo Counter Setup window |

Every page shares the studio sidebar (`src/components/Sidebar.astro`): About and its sections,
the game plates, the package plates with the open package's section tree, the blog posts with
the open post's sections, and the Asset Store / Discord buttons. On phones it becomes a drawer
behind the Menu button.

```sh
npm install
npm run dev      # http://localhost:4321/ with hot reload
npm run build    # writes dist/
npm run preview  # serves dist/
npm run sync     # re-copies the package docs (Documentation.md / CHANGELOG.md / version) and blog posts
```

Pushing to `main` deploys via `.github/workflows/deploy.yml`. In the repo's Settings > Pages,
set the source to GitHub Actions.

## Layout

| Path | What it is |
| --- | --- |
| `src/layouts/StudioLayout.astro` | Every page: head, fonts, sidebar, mobile top bar and drawer, scroll spy. |
| `src/styles/shell.css` | Studio tokens, sidebar, drawer and cross-page view transitions. |
| `src/styles/plates.css` | Each package's and game's sidebar plate (and a package's section-tree skin), one block per slug. |
| `src/styles/about.css` | The about page column and Officer Hank's ID card (Tailwind utilities, no preflight). |
| `src/styles/shelf.css` | The docs home and games home: intro and one card per package or game. |
| `src/styles/kings.css` | The Racket Kings page. |
| `src/styles/blog.css` | The blog home and posts. |
| `src/data/links.json` | Studio links, mascot and social channels for the about page. |
| `src/data/games.ts` | Game registry for the sidebar and games home. |
| `src/data/packages.ts` | Package registry for the sidebar and docs home. `status: 'soon'` lists a package without a link. |
| `src/data/blog.ts` | Blog registry: each post's sidebar label, section labels and links (forum, Reddit, asset, email). |
| `src/content/<slug>/` | Synced package docs. Edit them in the Unity package, then `npm run sync`. |
| `src/content/blog/<slug>/` | Synced blog posts (`post.md` + `images/`). Edit them at the source, then `npm run sync`. |
| `src/lib/rehype-docs.mjs` | Turns the synced Markdown into page-specific markup (docs callouts; the blog's TL;DR card and score bars). |
| `src/packages/<slug>/` | A package's own look: its CSS, hero, components and syntax theme. |
| `src/pages/docs/<slug>/` | The package's guide and changelog pages. |
| `public/docs/sprites/` | Package assets served under `/docs/`. |

## Adding a package

1. Add its source folder to `scripts/sync-docs.mjs` and run `npm run sync`.
2. Set its entry in `src/data/packages.ts` to `status: 'live'`.
3. Create `src/packages/<slug>/` (theme CSS, hero) and `src/pages/docs/<slug>/index.astro` + `changelog.astro`, using Combo Counter as the template.

## Adding a game

1. Add it to `src/data/games.ts`.
2. Give it a plate in `src/components/GamePlate.astro` and a skin in `src/styles/plates.css`.
3. Create `src/pages/<slug>/index.astro`, using Racket Kings as the template.

## Adding a blog post

1. Write it as `post.md` (frontmatter: `title`, `description`, `date`) with an `images/` folder beside it.
2. Add its folder to the `posts` list in `scripts/sync-docs.mjs` and run `npm run sync`.
3. Add an entry to `src/data/blog.ts`: sidebar label, and the forum / Reddit links once it's posted there.
   Empty links are hidden on the built site and shown as dashed placeholders in `npm run dev`.
