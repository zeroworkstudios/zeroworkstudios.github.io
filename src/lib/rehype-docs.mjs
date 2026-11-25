// Small rehype pass that gives synced package docs their page-specific markup.
// It is dependency-free on purpose: a recursive walk over the HAST tree.
//
// All markdown files:
//   - tables are wrapped in a scrollable, keyboard-focusable region
//   - code blocks are wrapped in a <figure> labelled with their language
// Blog posts only:
//   - "**TL;DR**" and the list after it become a summary card (#tldr)
//   - an ordered list of "Name, 9.5" scores becomes a ranked bar list
// Combo Counter files only:
//   - "> **Caution: …**" blockquotes become callouts
//   - **ALL CAPS** labels become replicas of the Setup window's buttons
//   - **Menu > Paths** become menu-path chips
//   - CHANGELOG version headings and Added / Changed / Removed get chips

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

const el = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });
const txt = (value) => ({ type: 'text', value });

const slug = (s) =>
  s.toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');

function addClass(node, ...names) {
  const current = node.properties.className ?? [];
  node.properties.className = [...(Array.isArray(current) ? current : [current]), ...names];
}

// Setup window button styles, keyed by the label the docs use (SetupWindow.uss).
const BUTTONS = [
  [/^\+?\s?SETUP (IN )?SCENE$/, 'setup'],
  [/^IN SCENE$/, 'inscene'],
  [/^(GET PLUGIN|IMPORT TMP)$/, 'get'],
  [/^(UI|PLAY) DEMO$/, 'demo'],
  [/^WORLD DEMO$/, 'world'],
  [/^CHECK FOR UPDATES$/, 'quiet'],
  [/^(HIT COMBO.*|BREAK COMBO|AMOUNT)$/, 'pill'],
];
// Setup window status badges (.badge-ready / -warning / -missing).
const BADGES = [
  [/^READY$/, 'ready'],
  [/^NOT INSTALLED$/, 'missing'],
  [/^(INSTALLING|IMPORT NEEDED|RESTART NEEDED|D3D11 REQUIRED)$/, 'warning'],
];
const isCapsLabel = (s) => /^[A-Z0-9 +/×…↓★]{3,}$/.test(s) && /[A-Z]{2}/.test(s);

// The Setup window's framework cards, inserted after the Frameworks intro as a visual index.
const FRAMEWORKS = [
  { mono: 'uGUI', name: 'uGUI', vendor: 'Unity, with TextMesh Pro', detail: 'Canvas UI with TextMesh Pro SDF text', backend: 'UGUI', builtIn: true, accent: '#3DDC97', to: 'ugui-textmesh-pro' },
  { mono: 'UTK', name: 'UI Toolkit', vendor: 'Unity, built in', detail: 'UXML / USS UI with TextCore SDF text', backend: 'UIToolkit', builtIn: true, accent: '#4CC9F0', to: 'ui-toolkit' },
  { mono: 'UT', name: 'UniText', vendor: 'LightSide, Git package', detail: 'Canvas UI with HarfBuzz-shaped Unicode text', backend: 'UniText', accent: '#FF9F1C', to: 'unitext' },
  { mono: 'FG', name: 'FairyGUI', vendor: 'FairyGUI, Git (embedded)', detail: 'Standalone UI system with its own batched renderer', backend: 'FairyGUI', accent: '#FF6B9A', to: 'fairygui' },
  { mono: 'N2', name: 'NoesisGUI 2.2', vendor: 'Noesis, Asset Store', detail: 'XAML UI from the NoesisGUI 2.2 Asset Store package', backend: 'NoesisGUI', accent: '#B388FF', to: 'noesisgui-22' },
  { mono: 'N4', name: 'NoesisGUI 4.0', vendor: 'Noesis, UPM tarball', detail: 'XAML UI with WPF-style data binding', backend: 'NoesisGUI', accent: '#9D6BFF', to: 'noesisgui-40' },
  { mono: 'JS', name: 'OneJS', vendor: 'Singtaa, Git package', detail: 'React / TypeScript UI on UI Toolkit', backend: 'OneJS', accent: '#C6F432', to: 'onejs' },
  { mono: 'RU', name: 'ReactUnity', vendor: 'ReactUnity, Git package', detail: 'React / CSS UI on uGUI or UI Toolkit', backend: 'ReactUnity', accent: '#61DAFB', to: 'reactunity' },
];

const frameworkGrid = () =>
  el(
    'ul',
    { className: ['fw-grid'], role: 'list' },
    FRAMEWORKS.map((f) =>
      el('li', {}, [
        el('a', { className: ['fw-card'], href: `#${f.to}`, style: `--accent:${f.accent}` }, [
          el('span', { className: ['fw-card__mono', ...(f.mono.length > 2 ? ['fw-card__mono--long'] : [])], ariaHidden: 'true' }, [txt(f.mono)]),
          el('span', { className: ['fw-card__body'] }, [
            el('span', { className: ['fw-card__top'] }, [
              el('span', { className: ['fw-card__name'] }, [txt(f.name)]),
              el('span', { className: ['chip', f.builtIn ? 'chip--ready' : 'chip--ink'] }, [txt(f.builtIn ? 'Built in' : 'Bridge')]),
            ]),
            el('span', { className: ['fw-card__vendor'] }, [txt(f.vendor)]),
            el('span', { className: ['fw-card__detail'] }, [txt(f.detail)]),
            el('code', { className: ['fw-card__enum'] }, [txt(`ComboBackend.${f.backend}`)]),
          ]),
        ]),
      ]),
    ),
  );

function insertFrameworkGrid(tree) {
  const kids = tree.children;
  const h = kids.findIndex((n) => n.type === 'element' && n.tagName === 'h2' && textOf(n).trim() === 'Frameworks');
  if (h === -1) return;
  const p = kids.findIndex((n, i) => i > h && n.type === 'element' && n.tagName === 'p');
  kids.splice(p === -1 ? h + 1 : p + 1, 0, frameworkGrid());
}

function enhanceCombo(node, parent, index, isChangelog) {
  if (node.type !== 'element') return;

  if (node.tagName === 'blockquote') {
    const first = node.children.find((c) => c.type === 'element');
    const lead = first?.children?.find((c) => c.type === 'element' && c.tagName === 'strong');
    if (lead && /^caution/i.test(textOf(lead))) addClass(node, 'cc-callout');
  }

  if (node.tagName === 'strong' && parent?.tagName !== 'h2' && parent?.tagName !== 'h3') {
    const label = textOf(node).trim();
    if (label.includes(' > ')) {
      const parts = label.split(' > ');
      node.properties.className = ['cc-menu'];
      node.children = parts.flatMap((p, i) =>
        i === 0 ? [el('span', {}, [txt(p)])] : [el('span', { className: ['sep'], ariaHidden: 'true' }, [txt('›')]), el('span', {}, [txt(p)])],
      );
    } else if (BADGES.some(([re]) => re.test(label))) {
      const variant = BADGES.find(([re]) => re.test(label))[1];
      node.properties.className = ['cc-badge', `cc-badge--${variant}`];
    } else if (isCapsLabel(label)) {
      const variant = BUTTONS.find(([re]) => re.test(label))?.[1] ?? 'quiet';
      node.properties.className = ['cc-key', `cc-key--${variant}`];
    }
  }

  if (isChangelog && node.tagName === 'h2') {
    const raw = textOf(node);
    const m = raw.match(/^\[?([\w.\-]+)\]?\s*-\s*(\d{4}-\d{2}-\d{2})$/);
    if (m) {
      node.properties.id ??= slug(raw);
      addClass(node, 'cl-version');
      node.children = [
        el('span', { className: ['cl-ver'] }, [txt(`v${m[1]}`)]),
        el('time', { className: ['cl-date'], dateTime: m[2] }, [txt(m[2])]),
      ];
    }
  }

  if (isChangelog && node.tagName === 'h3') {
    const kind = textOf(node).trim().toLowerCase();
    if (['added', 'changed', 'removed', 'fixed', 'deprecated', 'security'].includes(kind)) {
      addClass(node, 'cl-kind', `cl-kind--${kind}`);
    }
  }
}

// Table cells: identifiers and short values never break mid-word. Long code (JSON samples)
// keeps wrapping so it cannot force the table wider than the page.
function markTableCell(td) {
  const text = textOf(td).trim();
  if (text.length > 0 && text.length <= 16) addClass(td, 'cell-tight');
  const visit = (n) => {
    if (n.type !== 'element') return;
    if (n.tagName === 'code' && textOf(n).length > 34) addClass(n, 'code-long');
    n.children?.forEach(visit);
  };
  td.children.forEach(visit);
}

function wrapGeneric(node, parent, index, ctx) {
  if (node.type !== 'element' || !parent) return false;

  if (node.tagName === 'td') markTableCell(node);

  if (node.tagName === 'table' && ![parent.properties?.className ?? []].flat().includes('doc-table')) {
    parent.children[index] = el('div', { className: ['doc-table'], tabIndex: 0, role: 'region', ariaLabel: 'Table' }, [node]);
    return true;
  }

  if (node.tagName === 'pre' && parent.tagName !== 'figure') {
    const code = node.children.find((c) => c.tagName === 'code');
    const langClass = [code?.properties?.className ?? []].flat().find((c) => String(c).startsWith('language-'));
    const lang = node.properties.dataLanguage ?? (langClass ? String(langClass).slice(9) : '');
    // The package docs' XML is always UXML; a blog post's is plain XML (e.g. a link.xml).
    const xml = ctx.combo ? 'UXML' : 'XML';
    const label = { csharp: 'C#', cs: 'C#', tsx: 'TSX', ts: 'TS', json: 'JSON', xml, text: 'Text', plaintext: 'Shell' }[lang] ?? (lang || 'Shell');
    parent.children[index] = el('figure', { className: ['doc-code'] }, [
      el('figcaption', {}, [txt(label)]),
      node,
    ]);
    return true;
  }
  return false;
}

// ---- Blog posts --------------------------------------------------------------

const isEl = (n, tag) => n?.type === 'element' && (!tag || n.tagName === tag);

/** "**TL;DR**" followed by a list becomes the summary card at the top of the post (#tldr). */
function wrapTldr(tree) {
  const kids = tree.children;
  const p = kids.findIndex((n) => isEl(n, 'p') && textOf(n).trim() === 'TL;DR');
  if (p === -1) return;
  const list = kids.findIndex((n, i) => i > p && isEl(n));
  if (!isEl(kids[list], 'ul')) return;
  const card = el('aside', { id: 'tldr', className: ['tldr'], ariaLabelledby: 'tldr-title' }, [
    el('p', { id: 'tldr-title', className: ['tldr__title'] }, [txt('TL;DR')]),
    kids[list],
  ]);
  kids.splice(p, list - p + 1, card);
}

/** An ordered list of "Name, 9.5" scores becomes a ranked bar list, out of 10. */
function enhanceRanking(node) {
  if (!isEl(node, 'ol')) return;
  const items = node.children.filter((c) => isEl(c, 'li'));
  const rows = items.map((li) => textOf(li).trim().match(/^(.+),\s*(\d+(?:\.\d+)?)$/));
  if (!items.length || rows.some((m) => !m || Number(m[2]) > 10)) return;
  addClass(node, 'rank');
  items.forEach((li, i) => {
    const [, name, score] = rows[i];
    li.properties.style = `--score:${Number(score) / 10}`;
    li.children = [
      el('span', { className: ['rank__name'] }, [txt(name)]),
      el('span', { className: ['rank__bar'], ariaHidden: 'true' }, []),
      el('span', { className: ['rank__score'] }, [txt(score)]),
    ];
  });
}

function walk(node, parent, index, ctx) {
  if (wrapGeneric(node, parent, index, ctx)) {
    // The original node now sits inside the wrapper; keep walking it.
    const wrapper = parent.children[index];
    wrapper.children.forEach((child, i) => walk(child, wrapper, i, ctx));
    return;
  }
  if (ctx.combo) enhanceCombo(node, parent, index, ctx.changelog);
  if (ctx.blog) enhanceRanking(node);
  (node.children ?? []).forEach((child, i) => walk(child, node, i, ctx));
}

export default function rehypeDocs() {
  return (tree, file) => {
    const p = String(file?.path ?? file?.history?.[0] ?? '').replace(/\\/g, '/');
    const ctx = {
      combo: p.includes('/content/combo-counter/'),
      changelog: /CHANGELOG\.md$/i.test(p),
      blog: p.includes('/content/blog/'),
    };
    if (ctx.combo && !ctx.changelog) insertFrameworkGrid(tree);
    if (ctx.blog) wrapTldr(tree);
    walk(tree, null, 0, ctx);
  };
}
