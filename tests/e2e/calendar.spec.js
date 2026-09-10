import { expect, test } from '@playwright/test';
import { FIXED_TIME, gotoFixture } from './helpers.js';

// The fixture's event starts at 14:00 (840px at 1px per minute), so first-event
// opens the grid 8px above it at 832px. Under the fixed clock a lost anchor would
// fall back to "now" at 540 and the 08:00 default is 480, so neither can pass.
const EXPECTED_TOP = 832;

const gridScrollTop = (page, id) => page.evaluate((id) => document.querySelector(`#${id} .overflow-y-auto.flex-1`)?.scrollTop ?? -1, id);

// setFixedTime keeps "today" deterministic without freezing the setTimeout
// driven reveal of the loading fixture (clock.install would).
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(FIXED_TIME);
  await gotoFixture(page, 'calendar');
});

test('a visible week view opens just above the first event', async ({ page }) => {
  await expect.poll(() => gridScrollTop(page, 'visible')).toBe(EXPECTED_TOP);
});

test('a calendar hidden by x-show opens at the first event once revealed', async ({ page }) => {
  await page.locator('#reveal').click();
  await expect(page.locator('#revealed')).toBeVisible();
  await expect.poll(() => gridScrollTop(page, 'revealed')).toBe(EXPECTED_TOP);
});

test('a calendar configured while hidden opens at the first event after the reveal', async ({ page }) => {
  await expect(page.locator('#loaded')).toBeVisible();
  await expect.poll(() => gridScrollTop(page, 'loaded')).toBe(EXPECTED_TOP);
});
