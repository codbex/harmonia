import { expect, test } from '@playwright/test';
import { gotoFixture, settle } from './helpers.js';

// x-h-select-input turns the real input into an sr-only model carrier and
// generates a [data-slot=select-input] button as the interactive trigger.
const trigger = (page, select = '#select') => page.locator(`${select} [data-slot=select-input]`);

test('picking an option updates the bound x-model value and closes the list', async ({ page }) => {
  await gotoFixture(page, 'select');
  await expect(page.locator('#content')).toBeAttached();
  await expect(page.locator('#content')).toBeHidden();

  await trigger(page).click();
  await expect(page.locator('#content')).toBeVisible();
  await settle(page);
  await page.locator('#opt-banana').click();

  await expect(page.locator('#content')).toBeHidden();
  await expect(page.locator('#model')).toHaveText('banana');
  await expect(trigger(page)).toHaveText('Banana');
});

test('a select near the bottom edge opens its list upward, inside the viewport', async ({ page }) => {
  await gotoFixture(page, 'select');
  await trigger(page, '#pinned-select').click();
  await expect(page.locator('#pinned-content')).toBeVisible();
  await settle(page);

  const input = await trigger(page, '#pinned-select').boundingBox();
  const content = await page.locator('#pinned-content').boundingBox();
  expect(content.y + content.height).toBeLessThanOrEqual(input.y + 1);
  expect(content.y).toBeGreaterThanOrEqual(0);
});

test('the option list is size-limited to fit the available space', async ({ page }) => {
  await gotoFixture(page, 'select');
  // Small viewport so the 12 options cannot fit and the size() middleware
  // must cap the list.
  await page.setViewportSize({ width: 800, height: 320 });
  await trigger(page, '#pinned-select').click();
  await expect(page.locator('#pinned-content')).toBeVisible();
  await settle(page);

  const content = await page.locator('#pinned-content').boundingBox();
  const viewport = page.viewportSize();
  expect(content.y).toBeGreaterThanOrEqual(0);
  expect(content.y + content.height).toBeLessThanOrEqual(viewport.height);
  const scrollable = await page.locator('#pinned-content').evaluate((el) => {
    const list = el.querySelector('[data-slot=select-list]');
    return el.scrollHeight > el.clientHeight || list.scrollHeight > list.clientHeight;
  });
  expect(scrollable).toBe(true);
});

test('the full keyboard flow selects an option and returns focus', async ({ page }) => {
  await gotoFixture(page, 'select');
  await trigger(page).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#content')).toBeVisible();
  await settle(page);

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  await expect(page.locator('#content')).toBeHidden();
  await expect(page.locator('#model')).not.toHaveText('');
  const focusIsTrigger = await page.evaluate(() => document.activeElement.getAttribute('data-slot') === 'select-input');
  expect(focusIsTrigger).toBe(true);
});

test('clicking outside closes the list without changing the selection', async ({ page }) => {
  await gotoFixture(page, 'select');
  await trigger(page).click();
  await expect(page.locator('#content')).toBeVisible();
  await settle(page);
  await page.mouse.click(500, 400);
  await expect(page.locator('#content')).toBeHidden();
  await expect(page.locator('#model')).toHaveText('');
});
