#!/usr/bin/env node
// Fetch a LIVE AppotaPay doc page and print it as Markdown, so generated code matches the
// current spec. https://docs.appotapay.com is a Docusaurus site: there is no llms.txt / API
// export, so pages are discovered through sitemap.xml and converted from HTML here.
// No dependencies (Node >= 18, uses global fetch).
//
//   node fetch-doc.mjs index                  -> list every doc path (from sitemap.xml)
//   node fetch-doc.mjs index payment          -> only paths containing "payment"
//   node fetch-doc.mjs payment/signature      -> that page, as Markdown
//   node fetch-doc.mjs ewallet/request-payment
//   node fetch-doc.mjs --html payment/refund  -> raw HTML instead of Markdown
//   DOCS=https://docs.dev.appotapay.com node fetch-doc.mjs index
//
// Paths are exactly what the docs URL shows after the host. Paths with no version prefix are
// the CURRENT version; `1.1/...` and `1.0/...` are the archived ones.

const DOCS = (process.env.DOCS || 'https://docs.appotapay.com').replace(/\/$/, '');

async function get(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'appotapay-skills/fetch-doc' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  // Some doc pages are served with stray NUL and other C0 control bytes inside words
  // (e.g. "v\0\0ới"). Left in, they make the Markdown snapshot a binary file to git and
  // grep, so `git diff` after a sync becomes unreviewable. Strip them at the source.
  return (await res.text()).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
}

/** Every doc path on the site, current version first. */
export async function listPaths(filter = '') {
  const xml = await get(`${DOCS}/sitemap.xml`);
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(`${DOCS}/`, '').replace(/\/$/, ''))
    .filter((p) => p && p !== 'search')
    .filter((p) => !filter || p.includes(filter));
  const archived = (p) => /^1\.\d+\//.test(p);
  return paths.sort((a, b) => (archived(a) - archived(b)) || a.localeCompare(b));
}

// ---------- HTML -> Markdown (scoped to what Docusaurus emits) ----------

const decode = (s) =>
  s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&hellip;/g, '…')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&amp;/g, '&');

const stripTags = (s) => decode(s.replace(/<[^>]+>/g, '')).replace(/[ \t ]+/g, ' ').trim();

/** Cell text: keep inline code, drop everything else. */
function inline(html) {
  return decode(
    html
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, c) => '`' + stripTags(c) + '`')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/[ \t ]+/g, ' ')
    .trim()
    .replace(/\|/g, '\\|');
}

function tableToMd(html) {
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((r) =>
    [...r[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((c) => inline(c[1]))
  );
  if (!rows.length) return '';
  const width = Math.max(...rows.map((r) => r.length));
  const pad = (r) => [...r, ...Array(width - r.length).fill('')];
  const [head, ...body] = rows;
  return [
    `| ${pad(head).join(' | ')} |`,
    `| ${Array(width).fill('---').join(' | ')} |`,
    ...body.map((r) => `| ${pad(r).join(' | ')} |`),
  ].join('\n');
}

function codeToMd(openTag, html) {
  // Docusaurus wraps each line in <div class="token-line"> ending with <br>; tokens are spans.
  const text = decode(
    html
      .replace(/<br\s*\/?>\s*<\/div>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<[^>]+>/g, '')
  ).replace(/\n{3,}/g, '\n\n');
  const lang = /language-([\w-]+)/.exec(openTag)?.[1] || '';
  return '```' + lang + '\n' + text.replace(/\s+$/, '') + '\n```';
}

function listToMd(html, ordered) {
  return [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((m, i) => `${ordered ? `${i + 1}.` : '-'} ${inline(m[1])}`)
    .join('\n');
}

export function htmlToMarkdown(html) {
  const article = /<article[^>]*>([\s\S]*?)<\/article>/i.exec(html)?.[1] ?? html;
  const out = [];
  // Walk the block-level elements in document order.
  const blocks = /<(h[1-6]|table|pre|ul|ol|p|blockquote)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
  for (const m of article.matchAll(blocks)) {
    const [, tag, attrs = '', body] = m;
    const t = tag.toLowerCase();
    if (/^h[1-6]$/.test(t)) {
      const text = stripTags(body).replace(/​/g, '').replace(/​$/, '').trim();
      if (text) out.push(`${'#'.repeat(+t[1])} ${text}`);
    } else if (t === 'table') out.push(tableToMd(body));
    else if (t === 'pre') out.push(codeToMd(attrs, body));
    else if (t === 'ul' || t === 'ol') {
      if (/breadcrumb|table-of-contents|tabList|pagination/i.test(attrs)) continue; // site chrome
      out.push(listToMd(body, t === 'ol'));
    }
    else if (t === 'blockquote') out.push(stripTags(body).split('\n').map((l) => `> ${l}`).join('\n'));
    else {
      const text = inline(body).replace(/\\\|/g, '|');
      if (text) out.push(text);
    }
  }
  return out.filter(Boolean).join('\n\n').replace(/\n{3,}/g, '\n\n') + '\n';
}

export async function fetchDoc(path) {
  const url = `${DOCS}/${String(path).replace(/^\//, '')}`;
  const html = await get(url);
  return { url, html, markdown: `<!-- source: ${url} -->\n\n` + htmlToMarkdown(html) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const raw = args.includes('--html');
  const rest = args.filter((a) => a !== '--html');
  const [cmd, ...more] = rest;
  const run = async () => {
    if (!cmd || cmd === 'index') {
      const paths = await listPaths(more[0] || '');
      process.stdout.write(paths.join('\n') + '\n');
      process.stderr.write(`# ${paths.length} pages from ${DOCS}/sitemap.xml\n`);
      return;
    }
    const { url, html, markdown } = await fetchDoc(cmd);
    process.stderr.write(`# fetched ${url}\n`);
    process.stdout.write(raw ? html : markdown);
  };
  run().catch((e) => {
    process.stderr.write(String(e.message) + '\n');
    process.exit(1);
  });
}
