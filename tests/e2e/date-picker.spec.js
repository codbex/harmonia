import { expect, test } from '@playwright/test';
import { FIXED_TIME, gotoFixture, settle } from './helpers.js';

const calendar = (page) => page.locator('[data-slot=date-picker-calendar]');

// setFixedTime keeps "today" deterministic without freezing the setTimeout
// driven transitions (clock.install would).
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(FIXED_TIME);
  await gotoFixture(page, 'date-picker');
});

async function openCalendar(page) {
  await page.locator('#trigger').click();
  await expect(calendar(page)).toBeVisible();
  await settle(page);
}

test('the trigger opens a calendar on the fixed current month', async ({ page }) => {
  await openCalendar(page);
  await expect(calendar(page)).toContainText(/June/);
  await expect(calendar(page)).toContainText('2025');
});

test('clicking a day writes the YYYY-MM-DD model value and closes the popup', async ({ page }) => {
  await openCalendar(page);
  await calendar(page).getByText('20', { exact: true }).click();
  await expect(page.locator('#model')).toHaveText('2025-06-20');
  await expect(calendar(page)).toBeHidden();
  await expect(page.locator('#input')).not.toHaveValue('');
});

test('a typed date parses back into the model', async ({ page }) => {
  // Select a day first to learn the display format, then retype it with a
  // different day so the test does not depend on the format itself.
  await openCalendar(page);
  await calendar(page).getByText('20', { exact: true }).click();
  await expect(page.locator('#model')).toHaveText('2025-06-20');
  const display = await page.locator('#input').inputValue();

  const retyped = display.replace('20', '10');
  await page.locator('#input').fill(retyped);
  await page.keyboard.press('Enter');
  await expect(page.locator('#model')).toHaveText('2025-06-10');
});

test('arrow keys move the real gridcell focus and Enter selects', async ({ page }) => {
  // Select a day first so the keyboard base date and the roving tabindex agree.
  await openCalendar(page);
  await calendar(page).getByText('20', { exact: true }).click();
  await expect(calendar(page)).toBeHidden();

  await page.locator('#trigger').focus();
  await page.keyboard.press('Enter');
  await expect(calendar(page)).toBeVisible();
  await settle(page);

  const focusedDay = () => page.evaluate(() => document.activeElement.textContent.trim());
  expect(await focusedDay()).toBe('20');

  await page.keyboard.press('ArrowRight');
  expect(await focusedDay()).toBe('21');

  await page.keyboard.press('Enter');
  await expect(page.locator('#model')).toHaveText('2025-06-21');
});

// With no selection the visible focus stop is today's cell, and the keyboard
// handler must base navigation on that cell, not on the 1st of the month.
test('the first arrow press moves from the visibly focused day', async ({ page }) => {
  await page.locator('#trigger').focus();
  await page.keyboard.press('Enter');
  await expect(calendar(page)).toBeVisible();
  await settle(page);

  const focusedDay = () => page.evaluate(() => document.activeElement.textContent.trim());
  expect(await focusedDay()).toBe('15'); // today under the fixed clock
  await page.keyboard.press('ArrowRight');
  expect(await focusedDay()).toBe('16');
});

test('the popup is positioned inside the viewport', async ({ page }) => {
  await openCalendar(page);
  const box = await calendar(page).boundingBox();
  const viewport = page.viewportSize();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
});
