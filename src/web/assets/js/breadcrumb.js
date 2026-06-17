(() => {
  const STYLE_ID = 'dancopedia-breadcrumb-style';

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
.bc-wrap {
  background: #0b140d;
  border-bottom: 1px solid rgba(255,255,255,.07);
  width: 100%;
}
.bc-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 9px 40px;
}
.bc-list { list-style: none; margin: 0; padding: 0; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.bc-item { display: flex; align-items: center; gap: 6px; font-family: "Inter", system-ui, sans-serif; font-size: .75rem; color: rgba(255,255,255,.38); }
.bc-item a { color: rgba(255,255,255,.6); text-decoration: none; transition: color .18s; }
.bc-item a:hover { color: #fff; }
.bc-item--current span { color: rgba(255,255,255,.82); font-weight: 500; }
.bc-sep { color: rgba(255,255,255,.18); font-size: .65rem; }
@media (max-width: 768px) { .bc-inner { padding: 9px 20px; } }
`;
    document.head.appendChild(style);
  }

  function getBasePath() {
    const script = document.currentScript || document.querySelector('script[src*="breadcrumb.js"]');
    if (!script || !script.src) return './';

    const baseUrl = new URL('../../', script.src);
    return baseUrl.pathname.endsWith('/') ? baseUrl.pathname : `${baseUrl.pathname}/`;
  }

  function makeItem(item, index, total) {
    const isLast = index === total - 1;
    const li = document.createElement('li');
    li.className = `bc-item${isLast ? ' bc-item--current' : ''}`;

    if (!isLast && item.href) {
      const link = document.createElement('a');
      link.href = item.href;
      link.textContent = item.label;
      li.appendChild(link);
    } else {
      const span = document.createElement('span');
      span.textContent = item.label;
      li.appendChild(span);
    }

    if (!isLast) {
      const sep = document.createElement('span');
      sep.className = 'bc-sep';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '/';
      li.appendChild(sep);
    }

    return li;
  }

  function render(items, options = {}) {
    const container = document.querySelector(options.container || '#breadcrumb-container');
    if (!container || !items || !items.length) return;

    ensureStyles();

    const wrap = document.createElement('div');
    wrap.className = 'bc-wrap';
    const nav = document.createElement('nav');
    nav.className = 'bc-inner';
    nav.setAttribute('aria-label', 'Breadcrumb');
    const list = document.createElement('ol');
    list.className = 'bc-list';

    items.forEach((item, index) => list.appendChild(makeItem(item, index, items.length)));
    nav.appendChild(list);
    wrap.appendChild(nav);
    container.replaceChildren(wrap);
  }

  window.DancopediaBreadcrumbs = {
    basePath: getBasePath(),
    render
  };
})();
