import { expect, test } from '@playwright/test';
import { createRequire } from 'node:module';
import { gotoFixture } from './helpers.js';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

test('the CDN bundle registers every directive through deferred Alpine', async ({ page }) => {
  await gotoFixture(page, 'smoke');
  const slots = [
    ['#button', 'button'],
    ['#badge', 'badge'],
    ['#chip', 'chip'],
    ['label[for=name]', 'label'],
    ['#name', 'input'],
    ['[x-h-switch]', 'switch'],
    ['#progress', 'progress'],
    ['[x-h-separator]', 'separator'],
    ['[x-h-spinner]', 'spinner'],
    ['[x-h-avatar]', 'avatar'],
    ['[x-h-card]', 'card'],
  ];
  for (const [selector, slot] of slots) {
    await expect(page.locator(selector)).toHaveAttribute('data-slot', slot);
  }
});

test('window.Harmonia exposes the public API and the package version', async ({ page }) => {
  await gotoFixture(page, 'smoke');
  const api = await page.evaluate(() => ({
    version: window.Harmonia.version,
    functions: ['setColorScheme', 'getColorScheme', 'getSystemColorScheme', 'addColorSchemeListener', 'removeColorSchemeListener'].filter((name) => typeof window.Harmonia[name] === 'function'),
  }));
  expect(api.version).toBe(pkg.version);
  expect(api.functions).toHaveLength(5);
});

test('harmonia.css is applied, not just class names', async ({ page }) => {
  await gotoFixture(page, 'smoke');
  const button = page.locator('#button');
  const { backgroundColor, borderRadius } = await button.evaluate((el) => {
    const style = getComputedStyle(el);
    return { backgroundColor: style.backgroundColor, borderRadius: style.borderRadius };
  });
  expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(parseFloat(borderRadius)).toBeGreaterThan(0);
});

test('the page loads without console errors or page errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await gotoFixture(page, 'smoke');
  expect(errors).toEqual([]);
});

test('x-model round trip works with real Alpine', async ({ page }) => {
  await gotoFixture(page, 'smoke');
  await expect(page.locator('#model')).toHaveText('initial');
  await page.locator('#name').fill('updated');
  await expect(page.locator('#model')).toHaveText('updated');
});
