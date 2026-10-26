import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

async function walk(path) {
  const found = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const file = join(path, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(file)));
    else found.push(file);
  }
  return found;
}
const files = await walk('dist');
assert(
  !files.some((file) => /\.(map|env)$/.test(file)),
  'Source maps or environment files must not be published',
);
assert(
  !files.some((file) => /prompts|source-assets|node_modules/.test(file)),
  'Development assets must not be published',
);
for (const route of ['', 'features', 'about', 'services', 'projects']) {
  const html = await readFile(join('dist', route, 'index.html'), 'utf8');
  assert.equal(
    (html.match(/<h1[ >]/g) || []).length,
    1,
    'Each page needs exactly one pre-rendered heading',
  );
  assert(html.includes('rel="canonical"'), 'Missing canonical URL');
  assert(html.includes('name="description"'), 'Missing page description');
  assert(
    html.includes('itemtype="https://schema.org/WebPage"'),
    'Missing factual page structured data',
  );
  for (const property of [
    'og:title',
    'og:description',
    'og:url',
    'og:image',
    'og:image:alt',
    'og:image:width',
    'og:image:height',
  ])
    assert(html.includes(`property="${property}"`), `Missing ${property}`);
  for (const property of [
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image',
    'twitter:image:alt',
  ])
    assert(html.includes(`name="${property}"`), `Missing ${property}`);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert(
    !/localhost|127\.0\.0\.1/.test(canonical),
    'Local preview URLs must not become production canonicals',
  );
  const socialImage = await sharp(join('dist/social', `${route || 'home'}.jpg`)).metadata();
  assert.equal(socialImage.width, 1200);
  assert.equal(socialImage.height, 630);
  assert.equal(socialImage.format, 'jpeg');
  assert(html.includes('aria-label="Main navigation"'), 'Missing navigation label');
  assert(
    (await stat(join('dist', route, 'index.html.br'))).size > 0,
    'Missing compression sidecar',
  );
}
for (const file of files.filter((file) => /\.(html|css)$/.test(file))) {
  const body = await readFile(file, 'utf8');
  assert(!body.includes('__VITE_'), `Unresolved build asset in ${file}`);
  const paths = [
    ...body.matchAll(/(?:src=|href=|url\()["']?(\/(?:assets|images|fonts|social)\/[^\s"')<>]+)/g),
  ].map((match) => match[1]);
  for (const path of new Set(paths))
    assert((await stat(join('dist', path))).isFile(), `Missing asset ${path} in ${file}`);
}
for (const file of files.filter((file) => file.endsWith('.js'))) {
  const code = await readFile(file, 'utf8');
  assert(!code.includes('sourceMappingURL='), 'Source map reference found');
  assert(!/(?:sk-proj-|ghp_)[A-Za-z0-9]{20,}/.test(code), 'Potential secret found in client code');
}
console.log(
  'Release artifact checks passed: pre-rendered routes, metadata, compression, and no private build files.',
);
