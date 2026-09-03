import { expect, test } from '@playwright/test';
import { gotoFixture, settle } from './helpers.js';

const bg = (page, id) => page.locator(`#${id}`).evaluate((el) => getComputedStyle(el).backgroundColor);
const activeId = (page) => page.evaluate(() => document.activeElement.id);

test('the list keeps its list items, so the ul is still announced as a list', async ({ page }) => {
  await gotoFixture(page, 'list');
  await expect(page.locator('#rows')).toHaveAttribute('role', 'list');
  const roles = await page.locator('#rows > li').evaluateAll((items) => items.map((item) => item.getAttribute('role')));
  expect(roles).toEqual([null, null, null, null, null]);
});

test('hovering the row control paints the row, hovering the action beside it does not', async ({ page }) => {
  await gotoFixture(page, 'list');
  const resting = await bg(page, 'with-action');

  await page.locator('#row-control').hover();
  await settle(page);
  const hovered = await bg(page, 'with-action');
  expect(hovered).not.toBe(resting);

  await page.locator('#row-action').hover();
  await settle(page);
  expect(await bg(page, 'with-action')).toBe(resting);
});

test('the row control fills the row, leaving only the action beside it', async ({ page }) => {
  await gotoFixture(page, 'list');
  const row = await page.locator('#with-action').boundingBox();
  const control = await page.locator('#row-control').boundingBox();
  const action = await page.locator('#row-action').boundingBox();

  // Inside the row's border, which on every row but the first is the divider
  // the list draws between items.
  const rowInner = await page.locator('#with-action').evaluate((el) => el.clientHeight);
  expect(control.height).toBe(rowInner);
  // Everything the action and the end inset do not take.
  expect(control.width).toBeGreaterThan(row.width - action.width - 20);
});

test('Tab reaches the row control and then the action, and the row paints while the control has focus', async ({ page }) => {
  await gotoFixture(page, 'list');
  const resting = await bg(page, 'with-action');

  await page.keyboard.press('Tab');
  expect(await activeId(page)).toBe('row-control');
  await settle(page);
  expect(await bg(page, 'with-action')).not.toBe(resting);

  await page.keyboard.press('Tab');
  expect(await activeId(page)).toBe('row-action');
});

test('aria-current paints the row, and the literal string false does not', async ({ page }) => {
  await gotoFixture(page, 'list');
  expect(await bg(page, 'current')).not.toBe(await bg(page, 'plain'));
  expect(await bg(page, 'not-current')).toBe(await bg(page, 'plain'));
});

test('a disabled row control is out of the tab order and never paints its row', async ({ page }) => {
  await gotoFixture(page, 'list');
  const resting = await bg(page, 'disabled');

  await page.locator('#disabled-control').hover({ force: true });
  await settle(page);
  expect(await bg(page, 'disabled')).toBe(resting);

  await page.locator('#not-current-control').focus();
  await page.keyboard.press('Tab');
  expect(await activeId(page)).not.toBe('disabled-control');
});
