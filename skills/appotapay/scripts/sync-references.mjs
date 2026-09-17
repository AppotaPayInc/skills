#!/usr/bin/env node
// Maintainer tool: refresh the OFFLINE snapshot under every skill's references/docs/ from the LIVE
// docs at https://docs.appotapay.com. Pages are discovered from sitemap.xml and converted to
// Markdown by fetch-doc.mjs, then routed to the skill that owns the product area.
//
// No dependencies (Node >= 18). Run from anywhere:
//   node skills/appotapay/scripts/sync-references.mjs              # current version only
//   node skills/appotapay/scripts/sync-references.mjs --archived   # also 1.1/ and 1.0/ pages
//   DOCS=https://docs.dev.appotapay.com node skills/appotapay/scripts/sync-references.mjs
//
// Review `git diff` afterwards: the snapshot is the fallback, the live docs are the source of truth.
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listPaths, fetchDoc } from './fetch-doc.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..'); // repo root

// doc-path prefix -> skill that owns it. First match wins; order matters (longest prefix first).
const OWNERS = [
  ['cc-merchant-host/', 'appotapay-credit-card'],
  ['merchant-hosted/', 'appotapay-merchant-hosted'],
  ['virtual-account/', 'appotapay-virtual-account'],
  ['charging-card/', 'appotapay-charging-card'],
  ['firm-banking/', 'appotapay-firm-banking'],
  ['mobile-topup', 'appotapay-mobile-topup'],
  ['subscription/', 'appotapay-subscription'],
  ['buy-card/', 'appotapay-buy-card'],
  ['ewallet/', 'appotapay-ewallet'],
  ['payment', 'appotapay-payment'],
  ['bill/', 'appotapay-bill'],
  ['pos/', 'appotapay-pos'],
  // shared / cross-cutting pages
  ['authentication', 'appotapay-auth'],
  ['security', 'appotapay-auth'],
  ['partner/', 'appotapay'],
  ['errors', 'appotapay'],
];

const ownerOf = (p) => OWNERS.find(([prefix]) => p === prefix.replace(/\/$/, '') || p.startsWith(prefix))?.[1];

const CONCURRENCY = 6;

async function main() {
  const archived = process.argv.includes('--archived');
  const all = await listPaths();
  const paths = archived ? all : all.filter((p) => !/^1\.\d+\//.test(p));
  const planned = paths.map((p) => ({ path: p, skill: ownerOf(p) }));

  const orphans = planned.filter((x) => !x.skill);
  if (orphans.length) {
    process.stderr.write(
      `! ${orphans.length} page(s) have no owning skill — add a prefix to OWNERS:\n` +
        orphans.map((o) => `    ${o.path}\n`).join('')
    );
  }

  const targets = planned.filter((x) => x.skill);
  // Wipe the snapshot dirs so pages removed upstream do not linger.
  for (const skill of new Set(targets.map((t) => t.skill))) {
    await rm(resolve(ROOT, 'skills', skill, 'references', 'docs'), { recursive: true, force: true });
  }

  let done = 0;
  const queue = [...targets];
  const worker = async () => {
    for (let job = queue.shift(); job; job = queue.shift()) {
      const slug = job.path.replace(/\//g, '-') || 'index';
      const out = resolve(ROOT, 'skills', job.skill, 'references', 'docs', `${slug}.md`);
      try {
        const { markdown } = await fetchDoc(job.path);
        await mkdir(dirname(out), { recursive: true });
        await writeFile(out, markdown);
        done++;
      } catch (e) {
        process.stderr.write(`FAIL ${job.path}: ${e.message}\n`);
      }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const perSkill = {};
  for (const t of targets) perSkill[t.skill] = (perSkill[t.skill] || 0) + 1;
  process.stderr.write(`\nsynced ${done}/${targets.length} pages\n`);
  for (const [skill, n] of Object.entries(perSkill).sort()) process.stderr.write(`  ${String(n).padStart(3)}  ${skill}\n`);
}

main().catch((e) => {
  process.stderr.write(String(e.stack || e.message) + '\n');
  process.exit(1);
});
