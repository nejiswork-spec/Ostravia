import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';
import { securityHeaders } from './security.mjs';
import { render } from '../.prerender/entry-server.js';
import sharp from 'sharp';

const siteUrl =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : '') ||
  'https://ostravia.vercel.app';
const origin = new URL(siteUrl).origin;
if (!['http:', 'https:'].includes(new URL(siteUrl).protocol))
  throw new Error('SITE_URL must be an HTTP or HTTPS origin.');
const isPreview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';
const routes = {
  '': [
    'Ostravia | Grow More Value',
    'Thoughtful landscape design, healthy soil, and practical field care. Grow more value from every acre with Ostravia.',
    'hero',
  ],
  features: [
    'Features | Ostravia',
    'Explore sowing window alerts, field health walkthroughs, and harvest readiness reviews for a clear view of every growing season.',
    'field',
  ],
  about: [
    'About | Ostravia',
    'Meet the Ostravia approach: thoughtful landscape design, purposeful planting, healthy soil, and lasting care for gardens and fields.',
    'garden',
  ],
  services: [
    'Services | Ostravia',
    'Explore plant selection, soil building, home garden design, and field care. Find considered support for your land with Ostravia.',
    'harvest',
  ],
  projects: [
    'Projects | Ostravia',
    'Explore illustrative garden and farmland concepts that connect landscape design, healthy soil, and a clear plan for every acre.',
    'hero',
  ],
};
const template = await readFile('dist/index.html', 'utf8');
const escape = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
await mkdir('dist/social', { recursive: true });
await sharp('public/favicon.svg').resize(180, 180).png().toFile('dist/apple-touch-icon.png');
await sharp('public/favicon.svg').resize(32, 32).png().toFile('dist/favicon.png');
for (const [route, [title, description, image]] of Object.entries(routes)) {
  const url = `${origin}/${route}`;
  const imageUrl = `${origin}/social/${route || 'home'}.jpg`;
  const imageAlt = `${title.replace(' | Ostravia', '')}: ${image === 'garden' ? 'a landscaped garden' : image === 'field' ? 'cultivated green fields' : image === 'harvest' ? 'a seasonal vegetable harvest' : 'rolling countryside'}`;
  const overlay = Buffer.from(
    '<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10291b" stop-opacity=".12"/><stop offset="1" stop-color="#10291b" stop-opacity=".9"/></linearGradient></defs><rect width="1200" height="630" fill="url(#shade)"/></svg>',
  );
  const cardText = (text, size) =>
    sharp({
      text: {
        text: `<span foreground="#f4f8e7">${escape(text)}</span>`,
        font: `Manrope ${size}`,
        fontfile: 'scripts/assets/Manrope.ttf',
        rgba: true,
      },
    })
      .png()
      .toBuffer();
  const heading = await cardText(
    route ? route[0].toUpperCase() + route.slice(1) : 'Grow more value.',
    72,
  );
  const caption = await cardText('Ostravia · Gardens, soil, and field care', 36);
  await sharp(`public/images/${image}-1600.webp`)
    .resize(1200, 630, { fit: 'cover' })
    .composite([
      { input: overlay },
      { input: heading, left: 64, top: 380 },
      { input: caption, left: 68, top: 500 },
    ])
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(`dist/social/${route || 'home'}.jpg`);
  const metadata = `<link rel="canonical" href="${escape(url)}"><meta property="og:type" content="website"><meta property="og:site_name" content="Ostravia"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(url)}"><meta property="og:image" content="${escape(imageUrl)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:alt" content="${escape(imageAlt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${escape(imageUrl)}"><meta name="twitter:image:alt" content="${escape(imageAlt)}"><meta itemprop="name" content="${escape(title)}"><meta itemprop="description" content="${escape(description)}"><link itemprop="url" href="${escape(url)}"><link itemprop="isPartOf" href="${escape(origin)}/">${isPreview ? '<meta name="robots" content="noindex,nofollow">' : ''}<link rel="preload" as="image" href="/images/${image}-mobile.webp" media="(max-width:640px)" fetchpriority="high"><link rel="preload" as="image" href="/images/${image}-1600.webp" media="(min-width:641px)" fetchpriority="high">`;
  const html = template
    .replace('<html lang="en">', '<html lang="en" itemscope itemtype="https://schema.org/WebPage">')
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?\s*>/,
      `<meta name="description" content="${escape(description)}">`,
    )
    .replace('</head>', `${metadata}</head>`);
  const renderedHtml = html.replace(
    '<div id="root"></div>',
    `<div id="root">${render(`/${route}`)}</div>`,
  );
  const directory = join('dist', route);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, 'index.html'), renderedHtml);
}
await writeFile(
  'dist/robots.txt',
  `User-agent: *\n${isPreview ? 'Disallow: /' : 'Allow: /'}\nSitemap: ${origin}/sitemap.xml\n`,
);
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(
    routes,
  )
    .map((route) => `<url><loc>${origin}/${route}</loc></url>`)
    .join('')}</urlset>`,
);
await writeFile(
  'dist/404.html',
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | Ostravia</title><link rel="icon" href="/favicon.svg"></head><body><main><h1>This path is still growing.</h1><p>The page you requested could not be found.</p><a href="/">Return to Ostravia</a></main></body></html>',
);
await writeFile(
  'dist/_headers',
  `/*\n${Object.entries(securityHeaders)
    .map(([name, value]) => `  ${name}: ${value}`)
    .join(
      '\n',
    )}\n\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/images/*\n  Cache-Control: public, max-age=604800\n`,
);
async function compress(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await compress(path);
    else if (/\.(js|css|html|svg|xml|txt)$/.test(entry.name)) {
      const body = await readFile(path);
      if (body.length < 1000) continue;
      await writeFile(
        `${path}.br`,
        brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }),
      );
      await writeFile(`${path}.gz`, gzipSync(body, { level: 9 }));
    }
  }
}
await compress('dist');
console.log(
  `Prepared ${Object.keys(routes).length} routes with metadata, headers, and compressed assets.`,
);
