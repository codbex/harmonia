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

// The Escape stops at the menu, so a dialog or sheet listening for Escape on
// the window stays open. Once the menu is closed, Escape is the page's again.
test('Escape closes the menu and returns focus to the trigger', async ({ page }) => {
  await gotoFixture(page, 'menu');
  await page.evaluate(() => {
    window.escapesOnWindow = 0;
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') window.escapesOnWindow++;
    });
  });
  const escapesOnWindow = () => page.evaluate(() => window.escapesOnWindow);

  await openMenu(page);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu')).toBeHidden();
  expect(await activeId(page)).toBe('trigger');
  expect(await escapesOnWindow()).toBe(0);

  await page.keyboard.press('Escape');
  expect(await escapesOnWindow()).toBe(1);
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

test('a menu bound to a point opens at the right-click point, positioned by real floating-ui', async ({ page }) => {
  await gotoFixture(page, 'menu');
  const region = await page.locator('#point-region').boundingBox();
  const x = region.x + 40;
  const y = region.y + 30;
  await page.mouse.click(x, y, { button: 'right' });
  const menu = page.locator('#point-menu');
  await expect(menu).toBeVisible();
  await settle(page);
  const box = await menu.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(x);
  expect(box.x).toBeLessThan(x + 16);
  expect(box.y).toBeGreaterThanOrEqual(y - 1);
  expect(box.y).toBeLessThan(y + 16);
  expect(await activeId(page)).toBe('point-menu');
});

test('a second right-click in the region moves the open point menu instead of closing it', async ({ page }) => {
  await gotoFixture(page, 'menu');
  const region = await page.locator('#point-region').boundingBox();
  await page.mouse.click(region.x + 40, region.y + 30, { button: 'right' });
  const menu = page.locator('#point-menu');
  await expect(menu).toBeVisible();
  await settle(page);
  // Far to the right, clear of the open menu.
  const x = region.x + region.width - 240;
  const y = region.y + 60;
  await page.mouse.click(x, y, { button: 'right' });
  await settle(page);
  await expect(menu).toBeVisible();
  const box = await menu.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(x);
  expect(box.x).toBeLessThan(x + 16);
  expect(box.y).toBeGreaterThanOrEqual(y - 1);
  expect(box.y).toBeLessThan(y + 16);
});

test('a point menu closes on Escape and on an outside click', async ({ page }) => {
  await gotoFixture(page, 'menu');
  const region = await page.locator('#point-region').boundingBox();
  await page.mouse.click(region.x + 40, region.y + 30, { button: 'right' });
  const menu = page.locator('#point-menu');
  await expect(menu).toBeVisible();
  await settle(page);
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await page.mouse.click(region.x + 40, region.y + 30, { button: 'right' });
  await expect(menu).toBeVisible();
  await settle(page);
  await page.mouse.click(region.x + region.width - 40, region.y + region.height - 10);
  await expect(menu).toBeHidden();
});
