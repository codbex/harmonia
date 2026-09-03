import { expect, test } from '@playwright/test';
import { gotoFixture, seedColorScheme, settle } from './helpers.js';

const bodyBackground = (page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test('setColorScheme("dark") flips the class and the rendered colors', async ({ page }) => {
  await gotoFixture(page, 'smoke');
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  const lightBackground = await bodyBackground(page);

  await page.evaluate(() => window.Harmonia.setColorScheme('dark'));
  await expect(page.locator('html')).toHaveClass(/dark/);
  await settle(page);
  expect(await bodyBackground(page)).not.toBe(lightBackground);
});

test('a saved dark scheme applies at script evaluation time, before Alpine', async ({ page, context }) => {
  await seedColorScheme(context, 'dark');
  await page.goto('/tests/e2e/fixtures/smoke.html');
  // The class must be present as soon as the bundle evaluated, no Alpine needed.
  await page.waitForFunction(() => window.Harmonia);
  await expect(page.locator('html')).toHaveClass(/dark/);
  expect(await page.evaluate(() => window.Harmonia.getColorScheme())).toBe('dark');
});

test('auto mode tracks the real prefers-color-scheme media query', async ({ page, context }) => {
  await seedColorScheme(context, 'auto');
  await page.emulateMedia({ colorScheme: 'dark' });
  await gotoFixture(page, 'smoke');
  await expect(page.locator('html')).toHaveClass(/dark/);

  // Flipping the emulated preference must fire the real matchMedia change listener.
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});
