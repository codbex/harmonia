/*
 * Static file server for the Playwright e2e suite. Serves the repo root so
 * fixture pages can load /dist/harmonia.js, /dist/harmonia.css and
 * /node_modules/alpinejs/dist/cdn.min.js over a real http origin (the bundle
 * reads localStorage at script-eval time, which throws on file:// and data:).
 *
 * The example templates under docs/public/templates/ are written for the docs
 * site, where /harmonia/ is the site base and /harmonia/lib/node_modules/ holds
 * the doc dependencies installed by `npm run docs:install`. Those URLs are
 * mapped onto the repo instead, so the templates run against the freshly built
 * dist and the root node_modules without a docs install.
 */
const fs = require('fs');
const http = require('http');
const path = require('path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.E2E_PORT) || 8787;

for (const required of ['dist/harmonia.js', 'dist/harmonia.css']) {
  if (!fs.existsSync(path.join(root, required))) {
    console.error(`${required} is missing. Run: node scripts/build.cjs && npm run tailwind`);
    process.exit(1);
  }
}

const mime = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.map': 'application/json',
  '.mjs': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

const HARMONIA_DIST = '/harmonia/lib/node_modules/@codbex/harmonia/dist/';
const HARMONIA_LIB = '/harmonia/lib/node_modules/';
const HARMONIA_BASE = '/harmonia/';

function rewrite(pathname) {
  if (pathname.startsWith(HARMONIA_DIST)) return '/dist/' + pathname.slice(HARMONIA_DIST.length);
  if (pathname.startsWith(HARMONIA_LIB)) return '/node_modules/' + pathname.slice(HARMONIA_LIB.length);
  if (pathname.startsWith(HARMONIA_BASE)) return '/docs/public/' + pathname.slice(HARMONIA_BASE.length);
  return pathname;
}

http
  .createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
    // The docs font stylesheet points at @fontsource files that only a docs
    // install provides. Fonts are not under test, so serve it empty rather
    // than let every template log a failed font request.
    if (pathname === '/harmonia/fonts.css') {
      res.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'text/css' });
      res.end('/* fonts are not served by the e2e server */');
      return;
    }
    const file = path.resolve(root, rewrite(pathname).replace(/^\/+/, ''));
    if (!file.startsWith(root + path.sep) && file !== root) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404).end('Not found');
        return;
      }
      res.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
      });
      res.end(data);
    });
  })
  .listen(port, '127.0.0.1', () => {
    console.warn(`e2e server on http://127.0.0.1:${port}`);
  });
