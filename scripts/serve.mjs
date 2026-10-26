import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { securityHeaders } from './security.mjs';

const root = resolve('dist');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
};
const port = Number(process.env.PORT || 4187);
const server = http.createServer(async (req, res) => {
  Object.entries(securityHeaders).forEach(([key, value]) => res.setHeader(key, value));
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      await stat(file);
    } catch {
      res.statusCode = 404;
      file = resolve(root, '404.html');
    }
    if (pathname.startsWith('/.') || /\.(map|env)$/.test(pathname)) {
      res.statusCode = 404;
      file = resolve(root, '404.html');
    }
    res.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
    res.setHeader(
      'Cache-Control',
      res.statusCode === 404
        ? 'no-store'
        : pathname.startsWith('/assets/')
          ? 'public, max-age=31536000, immutable'
          : pathname.startsWith('/fonts/')
            ? 'public, max-age=31536000, immutable'
            : /^\/(images|social)\//.test(pathname)
              ? 'public, max-age=604800'
              : 'no-cache',
    );
    res.setHeader('Vary', 'Accept-Encoding');
    const encoding = req.headers['accept-encoding'] || '';
    for (const [name, suffix] of [
      ['br', '.br'],
      ['gzip', '.gz'],
    ]) {
      if (!encoding.includes(name)) continue;
      try {
        await stat(file + suffix);
        file += suffix;
        res.setHeader('Content-Encoding', name);
        break;
      } catch {
        /* Uncompressed assets remain supported. */
      }
    }
    const body = await readFile(file);
    res.setHeader('Content-Length', body.length);
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(400);
    res.end('Bad request');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Release preview: http://127.0.0.1:${port}`));
