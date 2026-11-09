import { createHash } from 'node:crypto';
import { Liquid } from 'liquidjs';
import { marked } from 'marked';
import { parse as parseYaml } from 'yaml';
import { readFile, readdir, mkdir, writeFile, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const out = path.join(root, 'dist');
const base = (process.env.SITE_BASE || '').replace(/\/$/, '');
if (base && (!base.startsWith('/') || base.includes('..'))) throw new Error('SITE_BASE must be a clean URL path');
const engine = new Liquid({ root: path.join(root, '_includes'), extname: '.liquid', jekyllInclude: true, strictFilters: true });
const assetVersions = new Map();
for (const name of ['theme.css','experience.css','blog.css','references.css','autumn.css','site.js']) {
  assetVersions.set('assets/' + name, createHash('sha256').update(await readFile(path.join(root,'assets',name))).digest('hex').slice(0,12));
}
function relativeUrl(value) {
  const text = String(value);
  if (/^(https?:|mailto:|#)/.test(text)) return text;
  const clean = text.replace(/^\//, '');
  return base + '/' + clean + (assetVersions.has(clean) ? '?v=' + assetVersions.get(clean) : '');
}
engine.registerFilter('relative_url', relativeUrl);
function frontmatter(source, filename) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) throw new Error('Missing frontmatter: ' + filename);
  const data = parseYaml(match[1]);
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid frontmatter: ' + filename);
  return { data, body: match[2] };
}
marked.use({ walkTokens(token) {
  if ((token.type === 'image' || token.type === 'link') && /^(?:\/|assets\/)/.test(token.href)) token.href = relativeUrl(token.href);
}});
const data = {};
for (const file of await readdir(path.join(root, '_data'))) {
  if (file.endsWith('.json')) data[file.slice(0,-5)] = JSON.parse(await readFile(path.join(root, '_data', file), 'utf8'));
}
if (!data.personal?.name || !Array.isArray(data.work) || !Array.isArray(data.cv?.education)) throw new Error('Missing required content');
for (const paper of data.publications || []) {
  if (!paper.title || !['published', 'in-progress'].includes(paper.status)) throw new Error('Paper needs a title and valid status');
  if (paper.date && (!/^\d{4}-\d{2}-\d{2}$/.test(paper.date) || !Number.isFinite(Date.parse(paper.date)))) throw new Error('Paper date must be YYYY-MM-DD or empty');
  if (paper.url && !/^https?:\/\//i.test(paper.url)) throw new Error('Paper link must use http or https');
}
const ids = new Set();
for (const item of data.work) {
  if (ids.has(item.id)) throw new Error('Duplicate work id: ' + item.id);
  ids.add(item.id);
}
const posts = [];
for (const filename of await readdir(path.join(root, '_posts'))) {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})-([a-z0-9-]+)\.md$/);
  if (!match) continue;
  const parsed = frontmatter(await readFile(path.join(root, '_posts', filename), 'utf8'), filename);
  if (parsed.data.published === false) continue;
  if (parsed.data.example && data.blog?.showExamples === false) continue;
  const url = parsed.data.permalink || '/blog/' + match[2] + '/';
  if (!/^\/blog\/[a-z0-9-]+\/$/.test(url)) throw new Error('Blog permalink must be /blog/lowercase-slug/: ' + filename);
  const date = parsed.data.date || match[1];
  if (!Number.isFinite(Date.parse(date))) throw new Error('Invalid post date: ' + filename);
  if (!parsed.data.title || !parsed.body.trim()) throw new Error('Post needs a title and body: ' + filename);
  if (posts.some(post => post.url === url)) throw new Error('Duplicate blog URL: ' + url);
  posts.push({ ...parsed.data, date, url, content:marked.parse(parsed.body, { async:false }) });
}
posts.sort((a,b) => Date.parse(b.date)-Date.parse(a.date) || a.url.localeCompare(b.url));
const site = { data, posts, baseurl:base };
const template = await readFile(path.join(root,'_layouts/personal.liquid'),'utf8');
// Recreate generated output so unpublished/deleted posts never linger in a build.
await rm(out, { recursive:true, force:true });
await mkdir(out, { recursive:true });
await cp(path.join(root,'assets'), path.join(out,'assets'), { recursive:true });
let count = 0;
async function renderPage(page, content = '') {
  const route = String(page.permalink);
  if (!route.startsWith('/') || route.includes('..') || route.includes('\\')) throw new Error('Invalid route: ' + route);
  const html = await engine.parseAndRender(template,{site,page,content});
  const relative = route.replace(/^\//, '');
  const target = route.endsWith('.html') ? path.join(out,relative) : path.join(out,relative,'index.html');
  await mkdir(path.dirname(target),{recursive:true}); await writeFile(target,html);
  count++;
}
for (const filename of await readdir(path.join(root,'_pages'))) {
  const parsed = frontmatter(await readFile(path.join(root,'_pages',filename),'utf8'),filename);
  await renderPage(parsed.data);
}
for (const post of posts) await renderPage({ ...post, section:'blog_post', permalink:post.url, description:post.description || '' },post.content);
await writeFile(path.join(out,'robots.txt'),'User-agent: *\nAllow: /\n');
await writeFile(path.join(out,'.nojekyll'),'');
if (data.personal.cvPdf) {
  const bytes = await readFile(path.join(out,data.personal.cvPdf));
  if (!bytes.subarray(0,5).equals(Buffer.from('%PDF-'))) throw new Error('CV PDF missing or invalid');
}
console.log('Built ' + count + ' pages including ' + posts.length + ' blog posts. Base: ' + (base || '/'));

