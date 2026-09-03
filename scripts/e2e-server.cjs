/*
 * Static file server for the Playwright e2e suite. Serves the repo root so
 * fixture pages can load /dist/harmonia.js, /dist/harmonia.css and
 * /node_modules/alpinejs/dist/cdn.min.js over a real http origin (the bundle
 * reads localStorage at script-eval time, which throws on file:// and data:).
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
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.map': 'application/json',
  '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

http
  .createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
    const file = path.resolve(root, pathname.replace(/^\/+/, ''));
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
