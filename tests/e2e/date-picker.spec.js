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

const monthToggle = (page) => calendar(page).locator('button[aria-label$=", choose month"]');
const yearToggle = (page) => calendar(page).locator('button[aria-label$=", choose year"]');
// Day cells carry data-year too, so year cells are looked up inside the year grid.
const yearCell = (page, year) => calendar(page).locator(`table[aria-label="choose year"] td[data-year="${year}"]`);
const activeLabel = (page) => page.evaluate(() => document.activeElement.getAttribute('aria-label') || document.activeElement.textContent.trim());

test('the month toggle is a real toggle button that keeps the popup open and its size', async ({ page }) => {
  await openCalendar(page);
  const before = await calendar(page).boundingBox();
  await expect(monthToggle(page)).toHaveAttribute('aria-pressed', 'false');
  await monthToggle(page).click();
  await settle(page);
  await expect(calendar(page)).toBeVisible();
  await expect(monthToggle(page)).toHaveAttribute('aria-pressed', 'true');
  await expect(calendar(page).locator('td[aria-label="June 2025"]')).toBeVisible();
  const after = await calendar(page).boundingBox();
  expect(after.width).toBeCloseTo(before.width, 0);
  expect(after.height).toBeCloseTo(before.height, 0);
});

test('picking a month shows its days, focuses a day and leaves the model alone', async ({ page }) => {
  await openCalendar(page);
  await monthToggle(page).click();
  await calendar(page).locator('td[aria-label="September 2025"]').click();
  await settle(page);
  await expect(calendar(page)).toBeVisible();
  await expect(monthToggle(page)).toHaveText('September');
  await expect(monthToggle(page)).toHaveAttribute('aria-pressed', 'false');
  expect(await page.evaluate(() => document.activeElement.getAttribute('data-day'))).toBe('15');
  await expect(page.locator('#model')).toHaveText('');
});

test('the year list opens on the selected year with the year buttons in place of the month buttons', async ({ page }) => {
  await openCalendar(page);
  await yearToggle(page).click();
  await settle(page);
  await expect(calendar(page).getByRole('button', { name: 'previous year' })).toBeVisible();
  await expect(calendar(page).getByRole('button', { name: 'next year' })).toBeVisible();
  await expect(calendar(page).getByRole('button', { name: 'previous month' })).toBeHidden();
  await expect(calendar(page).getByRole('button', { name: 'next month' })).toBeHidden();
  const selected = yearCell(page, 2025);
  await expect(selected).toHaveAttribute('aria-selected', 'true');
  await expect(selected).toBeInViewport();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  await calendar(page).getByRole('button', { name: 'next year' }).click();
  await expect(yearToggle(page)).toHaveText('2026');
  await yearCell(page, 2030).click();
  await settle(page);
  await expect(yearToggle(page)).toHaveText('2030');
  await expect(monthToggle(page)).toHaveText('June');
});

test('Tab and Shift+Tab cycle between the header and an open grid', async ({ page }) => {
  await openCalendar(page);
  await monthToggle(page).focus();
  await page.keyboard.press('Enter');
  await expect(monthToggle(page)).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Tab');
  expect(await activeLabel(page)).toBe('2025, choose year');
  await page.keyboard.press('Tab');
  expect(await activeLabel(page)).toBe('next month');
  await page.keyboard.press('Tab');
  expect(await activeLabel(page)).toBe('June 2025');
  await page.keyboard.press('Tab');
  expect(await activeLabel(page)).toBe('previous month');
  await page.keyboard.press('Shift+Tab');
  expect(await activeLabel(page)).toBe('June 2025');
});

// The focused day's outline, read once the popover's focus has settled on a day.
async function focusedDayOutline(page) {
  await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute('role'))).toBe('gridcell');
  return page.evaluate(() => {
    const style = getComputedStyle(document.activeElement);
    return { day: document.activeElement.getAttribute('data-day'), style: style.outlineStyle, width: style.outlineWidth };
  });
}

test('a day focused from the keyboard shows a focus outline', async ({ page }) => {
  await page.locator('#trigger').focus();
  await page.keyboard.press('Enter');
  await expect(calendar(page)).toBeVisible();
  await settle(page);
  expect(await focusedDayOutline(page)).toEqual({ day: '15', style: 'solid', width: '3px' });
  await page.keyboard.press('ArrowRight');
  expect(await focusedDayOutline(page)).toEqual({ day: '16', style: 'solid', width: '3px' });
});

test('a day focused after a mouse open shows the outline only once a key is pressed', async ({ page }) => {
  await openCalendar(page);
  expect((await focusedDayOutline(page)).style).toBe('none');
  await page.keyboard.press('ArrowRight');
  expect(await focusedDayOutline(page)).toEqual({ day: '16', style: 'solid', width: '3px' });
});

test('a click on the disabled next month button at max keeps the popup open', async ({ page }) => {
  await gotoFixture(page, 'date-picker-max');
  await openCalendar(page);
  const next = calendar(page).getByRole('button', { name: 'next month' });
  await expect(next).toHaveAttribute('aria-disabled', 'true');
  // A real click at the button's position, which Playwright skips on an aria-disabled button.
  await next.click({ force: true });
  await settle(page);
  await expect(calendar(page)).toBeVisible();
  await expect(calendar(page).locator('h2')).toHaveText('June 2025');
});

test('Esc returns from a grid to the days, and a second Esc closes the popup', async ({ page }) => {
  await openCalendar(page);
  await yearToggle(page).click();
  await yearCell(page, 2025).focus();
  await page.keyboard.press('Escape');
  await expect(calendar(page)).toBeVisible();
  await expect(calendar(page).locator('table[aria-label="choose year"]')).toHaveCount(0);
  expect(await activeLabel(page)).toBe('2025, choose year');
  await page.keyboard.press('Escape');
  await expect(calendar(page)).toBeHidden();
});
