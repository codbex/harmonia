import { expect, test } from '@playwright/test';
import { FIXED_TIME, gotoFixture, settle } from './helpers.js';

// Every picker popover is a modal dialog: Tab and Shift+Tab stay inside it
// while it is open, and Esc hands focus back to the control that opened it.
const PICKERS = [
  { name: 'date', opener: '#date-open', popup: '[data-slot=date-picker-calendar]' },
  { name: 'date time', opener: '#datetime-open', popup: '[data-slot=datetime-picker-calendar]' },
  { name: 'month', opener: '#month-open', popup: '[data-slot=month-picker-calendar]' },
  { name: 'week', opener: '#week-open', popup: '[data-slot=week-picker-calendar]' },
  { name: 'time', opener: '[data-slot=time-picker-input]', popup: '[data-slot=time-picker-popup]' },
  { name: 'slot', opener: '#slot-open', popup: '[data-slot=slot-picker-calendar]' },
];

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(FIXED_TIME);
  await gotoFixture(page, 'pickers');
});

// The focused element's position inside the popup, or null when focus is outside.
function focusInside(page, popup) {
  return page.evaluate((selector) => {
    const root = document.querySelector(selector);
    const active = document.activeElement;
    return root.contains(active) ? active.outerHTML.slice(0, 80) : null;
  }, popup);
}

for (const { name, opener, popup } of PICKERS) {
  test(`Tab and Shift+Tab stay inside the open ${name} picker, and Esc returns focus`, async ({ page }) => {
    await page.locator(opener).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator(popup)).toBeVisible();
    await settle(page);
    await expect.poll(() => focusInside(page, popup)).not.toBeNull();

    const stops = new Set();
    for (const key of ['Tab', 'Shift+Tab']) {
      for (let i = 0; i < 12; i++) {
        await page.keyboard.press(key);
        const inside = await focusInside(page, popup);
        expect(inside, `${key} ${i + 1} left the popup`).not.toBeNull();
        stops.add(inside);
      }
    }
    // It cycles through the controls rather than sitting on one.
    expect(stops.size).toBeGreaterThan(1);

    await page.keyboard.press('Escape');
    await expect(page.locator(popup)).toBeHidden();
    await expect(page.locator(opener)).toBeFocused();
  });
}

test('a day picked with the mouse returns focus to the trigger', async ({ page }) => {
  await page.locator('#date-open').click();
  const popup = page.locator('[data-slot=date-picker-calendar]');
  await expect(popup).toBeVisible();
  await settle(page);
  await popup.getByText('20', { exact: true }).click();
  await expect(popup).toBeHidden();
  await expect(page.locator('#date-open')).toBeFocused();
});

test('a click outside an open picker keeps the focus it moved', async ({ page }) => {
  await page.locator('#date-open').click();
  await expect(page.locator('[data-slot=date-picker-calendar]')).toBeVisible();
  await settle(page);
  await page.locator('#after').click();
  await expect(page.locator('[data-slot=date-picker-calendar]')).toBeHidden();
  await expect(page.locator('#after')).toBeFocused();
});
