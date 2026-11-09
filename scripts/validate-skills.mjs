#!/usr/bin/env node
// Validate the skill set before committing. No dependencies (Node >= 18).
//   node scripts/validate-skills.mjs
// Exits non-zero and lists every problem found.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const fail = (msg) => problems.push(msg);

const read = (p) => readFileSync(resolve(ROOT, p), 'utf8');

/** Parse the `---` frontmatter block. Values only need to be readable, not fully YAML-correct. */
function frontmatter(text) {
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  return end === -1 ? null : text.slice(3, end);
}

const skillDirs = readdirSync(join(ROOT, 'skills')).filter((d) =>
  statSync(join(ROOT, 'skills', d)).isDirectory()
);

// 1. Every skill has a well-formed SKILL.md whose name matches its directory.
for (const dir of skillDirs) {
  const rel = `skills/${dir}/SKILL.md`;
  if (!existsSync(resolve(ROOT, rel))) {
    fail(`${dir}: missing SKILL.md`);
    continue;
  }
  const text = read(rel);
  const fm = frontmatter(text);
  if (!fm) {
    fail(`${rel}: no frontmatter block`);
    continue;
  }
  const name = /^name:\s*(\S+)/m.exec(fm)?.[1];
  if (!name) fail(`${rel}: frontmatter has no name`);
  else if (name !== dir) fail(`${rel}: name "${name}" does not match directory "${dir}"`);
  if (!/^description:/m.test(fm)) fail(`${rel}: frontmatter has no description`);
  if (!/version:/.test(fm)) fail(`${rel}: frontmatter has no metadata.version`);
  if (!/^source:|source:/m.test(fm)) fail(`${rel}: frontmatter has no metadata.source`);

  // 2. Every references/ or scripts/ path named in backticks must exist.
  const refs = text.matchAll(/`((?:\.\.\/[A-Za-z0-9_-]+\/)?(?:references|scripts)\/[A-Za-z0-9_./*-]+)`/g);
  for (const m of refs) {
    const p = m[1];
    if (p.includes('*')) continue; // glob, e.g. references/docs/*.md
    if (!existsSync(resolve(ROOT, 'skills', dir, p))) fail(`${rel}: broken path \`${p}\``);
  }

  // 3. A product skill without a doc snapshot is almost always an unfinished sync.
  const docs = resolve(ROOT, 'skills', dir, 'references', 'docs');
  if (!existsSync(docs)) fail(`${dir}: no references/docs/ — run sync-references.mjs`);
  else if (readdirSync(docs).length === 0) fail(`${dir}: references/docs/ is empty`);
}

// 4. The published index must list every skill plus the root suite, with real paths.
const index = JSON.parse(read('.well-known/agent-skills/index.json'));
const listed = new Set(index.skills.map((s) => s.name));
for (const s of index.skills) {
  if (!existsSync(resolve(ROOT, s.path.replace(/^\//, '')))) fail(`index.json: path not found ${s.path}`);
  if (!s.description) fail(`index.json: ${s.name} has no description`);
}
if (!listed.has('appotapay-suite')) fail('index.json: appotapay-suite entry missing');
for (const dir of skillDirs) if (!listed.has(dir)) fail(`index.json: ${dir} is not listed`);
for (const name of listed) {
  if (name !== 'appotapay-suite' && !skillDirs.includes(name)) fail(`index.json: ${name} has no skills/ directory`);
}

// 5. Every skill the OWNERS table routes to must exist, or a sync silently drops pages.
const owners = read('skills/appotapay/scripts/sync-references.mjs');
for (const m of owners.matchAll(/\[\s*'[^']+'\s*,\s*'([^']+)'\s*\]/g)) {
  if (!skillDirs.includes(m[1])) fail(`sync-references.mjs: OWNERS routes to unknown skill "${m[1]}"`);
}

// 6. The root suite and README should mention each skill, so nothing ships undiscoverable.
const suite = read('SKILL.md');
const readme = read('README.md');
for (const dir of skillDirs) {
  if (!suite.includes(dir)) fail(`SKILL.md: does not mention ${dir}`);
  if (!readme.includes(dir)) fail(`README.md: does not mention ${dir}`);
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):\n` + problems.map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}
console.log(`✓ ${skillDirs.length} skills valid, ${index.skills.length} indexed`);
