import { expect, test } from '@playwright/test';
import { gotoFixture, seedColorScheme, settle } from './helpers.js';

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

// The rendered background of an element, and of the surface behind the table.
const background = (locator) => locator.evaluate((el) => getComputedStyle(el).backgroundColor);

test('a data-sticky=end cell stays at the end edge while the other cells scroll under it', async ({ page }) => {
  await gotoFixture(page, 'table');
  const scroller = page.locator('#pinned');
  const pinned = page.locator('#pinned tbody tr').first().locator('td[data-sticky]');
  const note = page.locator('#pinned tbody tr').first().locator('td').nth(2);
  const container = await scroller.boundingBox();
  const before = await pinned.boundingBox();
  const noteBefore = await note.boundingBox();

  await scroller.evaluate((el) => (el.scrollLeft = 200));
  await settle(page);

  const after = await pinned.boundingBox();
  const noteAfter = await note.boundingBox();
  expect(noteBefore.x - noteAfter.x).toBeGreaterThan(150);
  expect(Math.abs(after.x - before.x)).toBeLessThan(2);
  expect(Math.abs(after.x + after.width - (container.x + container.width))).toBeLessThan(24);
  // Opaque, so the scrolled cells do not show through it.
  expect(await background(pinned)).toBe(await background(page.locator('body')));
});

test('a data-sticky=end cell sits at the left edge of a right-to-left table', async ({ page }) => {
  await gotoFixture(page, 'table');
  const container = await page.locator('#pinned-rtl').boundingBox();
  const pinned = await page.locator('#pinned-rtl tbody tr').first().locator('td[data-sticky]').boundingBox();
  expect(Math.abs(pinned.x - container.x)).toBeLessThan(24);
});

test('a pinned cell takes its row hover and selected colours', async ({ page }) => {
  await gotoFixture(page, 'table');
  const hoverable = page.locator('#pinned tbody tr').first();
  const selected = page.locator('#pinned tbody tr').nth(1);

  expect(await background(selected.locator('td[data-sticky]'))).toBe(await background(selected));

  await hoverable.locator('td').first().hover();
  await settle(page);
  const rowColour = await background(hoverable);
  expect(rowColour).not.toBe(await background(page.locator('body')));
  expect(await background(hoverable.locator('td[data-sticky]'))).toBe(rowColour);
});

test('a pinned cell inside a card is painted with the card surface', async ({ page, context }) => {
  // Light mode paints the card and the page alike, so dark mode tells them apart.
  await seedColorScheme(context, 'dark');
  await gotoFixture(page, 'table');
  await settle(page);
  const card = await background(page.locator('#pinned-card'));
  expect(card).not.toBe(await background(page.locator('body')));
  expect(await background(page.locator('#pinned-in-card tbody tr').first().locator('td[data-sticky]'))).toBe(card);
  expect(await background(page.locator('#pinned-in-card thead th[data-sticky]'))).toBe(await background(page.locator('#pinned-in-card thead')));
});
