const fs = require('fs');

// Regenerate the icon data map from icons/*.svg before bundling.
require('./generate-icons.cjs');

fs.rmSync('dist', { recursive: true, force: true });

build({
  entryPoints: [`src/index.js`],
  outfile: `dist/harmonia.js`,
  bundle: true,
  minify: false,
  sourcemap: false,
  platform: 'browser',
  define: { CDN: 'true' },
});

build({
  entryPoints: [`src/index.js`],
  outfile: `dist/harmonia.min.js`,
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: 'browser',
  define: { CDN: 'true' },
});

build({
  entryPoints: [`src/lucide.js`],
  outfile: `dist/harmonia-lucide.js`,
  bundle: true,
  minify: false,
  sourcemap: false,
  platform: 'browser',
  define: { CDN: 'true' },
});

build({
  entryPoints: [`src/lucide.js`],
  outfile: `dist/harmonia-lucide.min.js`,
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: 'browser',
  define: { CDN: 'true' },
});

build({
  entryPoints: [`src/i18next.js`],
  outfile: `dist/harmonia-i18next.js`,
  bundle: true,
  minify: false,
  sourcemap: false,
  platform: 'browser',
  define: { CDN: 'true' },
});

build({
  entryPoints: [`src/i18next.js`],
  outfile: `dist/harmonia-i18next.min.js`,
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: 'browser',
  define: { CDN: 'true' },
});

build({
  entryPoints: [`src/module.js`],
  outfile: `dist/harmonia.esm.js`,
  bundle: true,
  minify: false,
  sourcemap: false,
  platform: 'neutral',
  mainFields: ['main', 'module'],
});

build({
  entryPoints: [`src/module.js`],
  outfile: `dist/harmonia.esm.min.js`,
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: 'neutral',
  mainFields: ['main', 'module'],
});

function build(options) {
  options.define || (options.define = {});
  options.define['process.env.NODE_ENV'] = process.argv.includes('--watch') ? `'production'` : `'development'`;

  return require('esbuild')
    .build({
      ...options,
    })
    .catch(() => process.exit(1));
}
