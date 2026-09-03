import { expect, test } from '@playwright/test';
import { gotoFixture, settle } from './helpers.js';

test('the header row is sticky while the body scrolls under it', async ({ page }) => {
  await gotoFixture(page, 'table');
  const container = await page.locator('#scroller').boundingBox();
  const headBefore = await page.locator('#head').boundingBox();
  const rowBefore = await page.locator('#row-10').boundingBox();

  await page.locator('#scroller').evaluate((el) => (el.scrollTop = 300));
  await settle(page);

  const headAfter = await page.locator('#head').boundingBox();
  const rowAfter = await page.locator('#row-10').boundingBox();
  expect(rowAfter.y).toBeLessThan(rowBefore.y - 250);
  expect(Math.abs(headAfter.y - headBefore.y)).toBeLessThan(2);
  expect(Math.abs(headAfter.y - container.y)).toBeLessThan(8);
});

test('the row header column is sticky during horizontal scroll', async ({ page }) => {
  await gotoFixture(page, 'table');
  const container = await page.locator('#scroller').boundingBox();
  const rowHeader = page.locator('#row-1 th');
  const cell = page.locator('#row-1 td').first();
  const headerBefore = await rowHeader.boundingBox();
  const cellBefore = await cell.boundingBox();

  await page.locator('#scroller').evaluate((el) => (el.scrollLeft = 200));
  await settle(page);

  const headerAfter = await rowHeader.boundingBox();
  const cellAfter = await cell.boundingBox();
  expect(cellBefore.x - cellAfter.x).toBeGreaterThan(150);
  expect(Math.abs(headerAfter.x - headerBefore.x)).toBeLessThan(2);
  expect(Math.abs(headerAfter.x - container.x)).toBeLessThan(8);
});

test('collapsing a group really hides its member rows', async ({ page }) => {
  await gotoFixture(page, 'table');
  await expect(page.locator('#member-1')).toBeVisible();
  await expect(page.locator('#member-2')).toBeVisible();

  await page.locator('#group-button').click();
  await expect(page.locator('#group')).toHaveAttribute('data-collapsed', 'true');
  await expect(page.locator('#member-1')).toBeHidden();
  await expect(page.locator('#member-2')).toBeHidden();

  await page.locator('#group-button').click();
  await expect(page.locator('#member-1')).toBeVisible();
  await expect(page.locator('#member-2')).toBeVisible();
});

test('hovering a data-hoverable row changes its rendered background', async ({ page }) => {
  await gotoFixture(page, 'table');
  const row = page.locator('#row-2');
  const background = () => row.evaluate((el) => getComputedStyle(el).backgroundColor);

  const resting = await background();
  await row.hover();
  await settle(page);
  // Assert the settled computed style; el.matches(':hover') stays false under
  // automation even when the hover styles really apply.
  expect(await background()).not.toBe(resting);
});
