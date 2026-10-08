import { expect, test } from '@playwright/test';
import { FIXED_TIME, gotoFixture, settle } from './helpers.js';

const cell = (page, key) => page.locator(`#picker [data-slot="slot-picker-cell"][data-key="${key}"]`);
const center = async (locator) => {
  const box = await locator.boundingBox();
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};
const logText = (page) => page.locator('#log').textContent();

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(FIXED_TIME);
  await gotoFixture(page, 'slot-picker');
});

test('a right-click on a slot opens the page menu at the pointer and names the slot', async ({ page }) => {
  const { x, y } = await center(cell(page, '2025-06-15T09:00'));
  await page.mouse.click(x, y, { button: 'right' });
  const menu = page.locator('#slot-menu');
  await expect(menu).toBeVisible();
  await settle(page);
  const box = await menu.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(x);
  expect(box.x).toBeLessThan(x + 16);
  expect(box.y).toBeGreaterThanOrEqual(y - 1);
  expect(box.y).toBeLessThan(y + 16);
  expect(await logText(page)).toContain('contextmenu b1');
});

test('a second right-click on another slot moves the open menu instead of closing it', async ({ page }) => {
  const first = await center(cell(page, '2025-06-15T09:00'));
  await page.mouse.click(first.x, first.y, { button: 'right' });
  await expect(page.locator('#slot-menu')).toBeVisible();
  await settle(page);
  // A slot in the next day column, clear of the open menu.
  const { x, y } = await center(cell(page, '2025-06-16T09:00'));
  await page.mouse.click(x, y, { button: 'right' });
  await settle(page);
  const menu = page.locator('#slot-menu');
  await expect(menu).toBeVisible();
  const box = await menu.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(x);
  expect(box.x).toBeLessThan(x + 16);
  expect(await logText(page)).toContain('contextmenu f2');
});

test('Shift+F10 on a focused slot opens the menu under it and Escape returns focus to the slot', async ({ page }) => {
  const booking = cell(page, '2025-06-15T09:00');
  await booking.focus();
  await page.keyboard.press('Shift+F10');
  const menu = page.locator('#slot-menu');
  await expect(menu).toBeVisible();
  await settle(page);
  const b = await booking.boundingBox();
  const m = await menu.boundingBox();
  expect(m.x).toBeGreaterThanOrEqual(b.x);
  expect(m.x).toBeLessThan(b.x + 16);
  expect(m.y).toBeGreaterThanOrEqual(b.y + b.height - 1);
  expect(m.y).toBeLessThan(b.y + b.height + 16);
  expect(await page.evaluate(() => document.activeElement.id)).toBe('slot-menu');
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  expect(await page.evaluate(() => document.activeElement.getAttribute('data-key'))).toBe('2025-06-15T09:00');
  expect(await logText(page)).toContain('contextmenu b1');
});

test('a real drag onto a droppable slot highlights it and reports the drop', async ({ page }) => {
  const booking = cell(page, '2025-06-15T09:00');
  const free = cell(page, '2025-06-15T10:00');
  const from = await center(booking);
  const to = await center(free);
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 10 });
  await expect(free).toHaveAttribute('data-drop-target', 'true');
  await expect(page.locator('#picker [data-slot="slot-picker-ghost"]')).toHaveCount(1);
  await expect(booking).toHaveAttribute('data-dragging', 'true');
  await page.mouse.up();
  await expect(free).not.toHaveAttribute('data-drop-target', 'true');
  await expect(page.locator('#picker [data-slot="slot-picker-ghost"]')).toHaveCount(0);
  expect(await logText(page)).toContain('drop b1 onto f1');
});

test('a clickable day header dispatches day-click from the keyboard', async ({ page }) => {
  const header = page.locator('#picker [data-slot="slot-picker-header"]').first();
  await expect(header).toHaveJSProperty('tagName', 'BUTTON');
  await header.focus();
  await page.keyboard.press('Enter');
  expect(await logText(page)).toContain('day 2025-06-15');
});

const weekCell = (page, key) => page.locator(`#week [data-slot="slot-picker-cell"][data-key="${key}"]`);

test('a narrow seven-day picker keeps its columns apart and scrolls sideways', async ({ page }) => {
  const layout = await page.locator('#week').evaluate((picker) => {
    const columns = [...picker.querySelectorAll('[data-slot="slot-picker-header"]')].map((header) => header.parentElement);
    const scrollBody = columns[0].parentElement.parentElement;
    const rects = columns.map((column) => column.getBoundingClientRect());
    return {
      overlaps: rects.slice(1).filter((rect, i) => rect.left < rects[i].right - 0.5).length,
      overflow: scrollBody.scrollWidth - scrollBody.clientWidth,
      monday: rects[0].width,
      friday: rects[4].width,
    };
  });
  expect(layout.overlaps).toBe(0);
  expect(layout.overflow).toBeGreaterThan(0);
  // Friday's tile group has a long description, which clips instead of
  // widening the day.
  expect(layout.friday).toBeLessThan(layout.monday * 2);
});

test('a drag after scrolling sideways drops on the day under the pointer', async ({ page }) => {
  const sunday = weekCell(page, '2025-06-22T09:30');
  await sunday.scrollIntoViewIfNeeded();
  const from = await center(weekCell(page, '2025-06-21T09:00'));
  const to = await center(sunday);
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 10 });
  await page.mouse.up();
  await expect(page.locator('#week-log')).toHaveText('week drop 2025-06-22');
});
