import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

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
  assert(html.includes('aria-label="Main navigation"'), 'Missing navigation label');
  assert(
    (await stat(join('dist', route, 'index.html.br'))).size > 0,
    'Missing compression sidecar',
  );
}
for (const file of files.filter((file) => file.endsWith('.js'))) {
  const code = await readFile(file, 'utf8');
  assert(!code.includes('sourceMappingURL='), 'Source map reference found');
  assert(!/(?:sk-proj-|ghp_)[A-Za-z0-9]{20,}/.test(code), 'Potential secret found in client code');
}
console.log(
  'Release artifact checks passed: pre-rendered routes, metadata, compression, and no private build files.',
);
