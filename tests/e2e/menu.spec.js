import { expect, test } from '@playwright/test';
import { gotoFixture, settle } from './helpers.js';

const activeId = (page) => page.evaluate(() => document.activeElement.id);

async function openMenu(page, trigger = '#trigger', menu = '#menu') {
  await page.locator(trigger).click();
  await expect(page.locator(menu)).toBeVisible();
  await settle(page);
}

test('the menu opens below its trigger, positioned by real floating-ui', async ({ page }) => {
  await gotoFixture(page, 'menu');
  await openMenu(page);
  await expect(page.locator('#trigger')).toHaveAttribute('aria-expanded', 'true');
  const trigger = await page.locator('#trigger').boundingBox();
  const menu = await page.locator('#menu').boundingBox();
  expect(menu.y).toBeGreaterThanOrEqual(trigger.y + trigger.height);
  expect(menu.y).toBeLessThan(trigger.y + trigger.height + 16);
});

test('a menu near the bottom edge flips above its trigger and stays in the viewport', async ({ page }) => {
  await gotoFixture(page, 'menu');
  await openMenu(page, '#pinned-trigger', '#pinned-menu');
  const trigger = await page.locator('#pinned-trigger').boundingBox();
  const menu = await page.locator('#pinned-menu').boundingBox();
  const viewport = page.viewportSize();
  expect(menu.y + menu.height).toBeLessThanOrEqual(trigger.y + 1);
  expect(menu.y).toBeGreaterThanOrEqual(0);
  expect(menu.x).toBeGreaterThanOrEqual(0);
  expect(menu.x + menu.width).toBeLessThanOrEqual(viewport.width + 1);
});

test('arrow keys walk real focus through the items and wrap around', async ({ page }) => {
  await gotoFixture(page, 'menu');
  await openMenu(page);
  const order = ['item-away', 'item-sub', 'item-invite', 'item-logout'];
  for (const id of order) {
    await page.keyboard.press('ArrowDown');
    expect(await activeId(page)).toBe(id);
  }
  await page.keyboard.press('ArrowDown');
  expect(await activeId(page)).toBe(order[0]);
  await page.keyboard.press('ArrowUp');
  expect(await activeId(page)).toBe(order[order.length - 1]);
});

test('Escape closes the menu and returns focus to the trigger', async ({ page }) => {
  await gotoFixture(page, 'menu');
  await openMenu(page);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu')).toBeHidden();
  expect(await activeId(page)).toBe('trigger');
});

test('clicking outside dismisses the menu', async ({ page }) => {
  await gotoFixture(page, 'menu');
  await openMenu(page);
  await page.mouse.click(400, 400);
  await expect(page.locator('#menu')).toBeHidden();
  await expect(page.locator('#trigger')).toHaveAttribute('aria-expanded', 'false');
});

test('ArrowRight opens the submenu beside its item and ArrowLeft closes it back', async ({ page }) => {
  await gotoFixture(page, 'menu');
  await openMenu(page);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown'); // item-sub
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#submenu')).toBeVisible();
  await settle(page);
  expect(await activeId(page)).toBe('sub-15');
  const item = await page.locator('#item-sub').boundingBox();
  const submenu = await page.locator('#submenu').boundingBox();
  expect(submenu.x).toBeGreaterThanOrEqual(item.x + item.width - 8);

  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#submenu')).toBeHidden();
  expect(await activeId(page)).toBe('item-sub');
});
