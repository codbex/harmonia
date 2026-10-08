import { expect, test } from '@playwright/test';

// The example templates under docs/public/templates/ double as end-to-end
// references, so each one has to load, route and render without a single
// console error or warning: a directive used against its contract throws or
// warns while it initializes, which is exactly what this catches. The e2e
// server maps the templates' /harmonia/ URLs onto dist/, node_modules/ and
// docs/public/ (see scripts/e2e-server.cjs).
const TEMPLATES = '/harmonia/templates';

// Placeholders for the routes whose id comes from the template's own store.
const INVOICE = Symbol('invoice');
const CHANNEL = Symbol('channel');
const DM = Symbol('dm');

const ROUTED = [
  {
    name: 'granite-erp',
    url: `${TEMPLATES}/granite-erp/index.html`,
    routes: ['/', '/inbox', '/approvals', '/invoices', INVOICE, '/bills', '/customers', '/vendors', '/inventory', '/documents', '/reports', '/settings', '/does-not-exist'],
  },
  {
    name: 'onyx-chat',
    url: `${TEMPLATES}/onyx-chat/index.html`,
    routes: ['/', '/channels', CHANNEL, DM, '/activity', '/people', '/settings', '/does-not-exist'],
  },
  {
    name: 'quartz-docs',
    url: `${TEMPLATES}/quartz-docs/index.html`,
    routes: ['/', '/guide/what-is-quartz', '/guide/getting-started', '/guide/queries', '/guide/caching', '/api', '/blog', '/blog/quartz-1-1', '/blog/announcing-quartz-1-0', '/does-not-exist'],
  },
];

// Records everything that would make a template a bad reference: console
// errors and warnings, uncaught exceptions, and requests that failed or 404ed.
// Each entry is prefixed with the route that was showing at the time.
function watch(page) {
  const problems = [];
  const state = { route: 'load' };
  const report = (text) => problems.push(`[${state.route}] ${text}`);
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') report(`console.${message.type()}: ${message.text()}`);
  });
  page.on('pageerror', (error) => report(`pageerror: ${error.message}`));
  page.on('requestfailed', (request) => report(`request failed: ${request.url()}`));
  page.on('response', (response) => {
    if (response.status() >= 400) report(`http ${response.status()}: ${response.url()}`);
  });
  return { problems, state };
}

async function load(page, url) {
  await page.goto(url);
  await page.waitForFunction(() => window.Alpine && window.Harmonia);
  await page.waitForSelector('[data-slot]', { state: 'attached' });
}

function resolveRoute(page, route) {
  if (route === INVOICE) return page.evaluate(() => '/invoices/' + window.Alpine.store('erp').invoices[0].id);
  if (route === CHANNEL) return page.evaluate(() => '/channels/' + window.Alpine.store('chat').channels[0].id);
  if (route === DM) return page.evaluate(() => '/dms/' + window.Alpine.store('chat').dms[0].id);
  return route;
}

// The routed templates use hash routing, so a route change is a hash change.
// Pinecone Router fetches the fragment and Alpine initializes it, after which
// the outlet holds a fresh tree of directives.
async function visit(page, route) {
  // A fresh load has no hash yet and shows the "/" route.
  const current = (await page.evaluate(() => location.hash)) || '#/';
  if (current !== '#' + route) {
    const outletBefore = await page.locator('#page-outlet').innerHTML();
    await page.evaluate((hash) => {
      location.hash = '#' + hash;
    }, route);
    await expect.poll(() => page.locator('#page-outlet').innerHTML()).not.toBe(outletBefore);
  }
  await expect.poll(() => page.locator('#page-outlet [data-slot]').count()).toBeGreaterThan(0);
  // Let fragment transitions and deferred icon rendering settle before the
  // next route, so their console output is attributed to this one.
  await page.waitForTimeout(300);
}

test.describe('single-page templates', () => {
  test('slate-dashboard renders without console errors', async ({ page }) => {
    const { problems } = watch(page);
    await load(page, `${TEMPLATES}/slate/slate-dashboard.html`);
    await expect.poll(() => page.locator('[data-slot]').count()).toBeGreaterThan(100);
    await page.waitForTimeout(300);
    expect(problems).toEqual([]);
  });

  test.describe('ember-habits', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('renders without console errors on a phone viewport', async ({ page }) => {
      const { problems } = watch(page);
      await load(page, `${TEMPLATES}/ember/ember-habits.html`);
      await expect.poll(() => page.locator('[data-slot]').count()).toBeGreaterThan(100);
      await page.waitForTimeout(300);
      expect(problems).toEqual([]);
    });
  });
});

test.describe('routed templates', () => {
  for (const template of ROUTED) {
    test(`${template.name} renders every route without console errors`, async ({ page }) => {
      const { problems, state } = watch(page);
      await load(page, template.url);
      await expect.poll(() => page.locator('#page-outlet [data-slot]').count()).toBeGreaterThan(0);
      for (const entry of template.routes) {
        const route = await resolveRoute(page, entry);
        state.route = route;
        await visit(page, route);
      }
      expect(problems).toEqual([]);
    });
  }
});
