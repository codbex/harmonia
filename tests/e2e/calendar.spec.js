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

// The all-day cell stacks its children in a block box, where an inline-level
// trigger would pick up the line box's leading and sit lower than the pills do.
test('the all-day overflow trigger is spaced like the pills above it', async ({ page }) => {
  const gaps = await page.evaluate(() => {
    const cell = document.querySelector('#allday [data-slot="overflow-more-btn"]').parentElement;
    const boxes = [...cell.children].map((child) => child.getBoundingClientRect());
    return boxes.slice(1).map((box, i) => Math.round((box.top - boxes[i].bottom) * 100) / 100);
  });

  expect(gaps).toHaveLength(2);
  expect(gaps[1]).toBe(gaps[0]);
});

// The popover is placed by floating-ui, so focusing its list before that resolves
// sends the browser scrolling to wherever the unplaced popover happens to sit.
test('the all-day overflow opens over its trigger without scrolling the page', async ({ page }) => {
  const trigger = page.locator('#allday [data-slot="overflow-more-btn"]');
  await trigger.scrollIntoViewIfNeeded();
  const scrollBefore = await page.evaluate(() => window.scrollY);

  await trigger.click();
  const popover = page.locator('#allday [role="dialog"]');
  await expect(popover).toBeVisible();

  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
  const box = await popover.boundingBox();
  const anchor = await trigger.boundingBox();
  expect(box.y).toBeGreaterThan(anchor.y);
  expect(box.y - (anchor.y + anchor.height)).toBeLessThan(16);
  await expect(popover.getByRole('button')).toHaveCount(5);
});

// WCAG 2.4.3: focus used to walk out of the open dialog, forward past the last
// event and out of the calendar, backward into the grid the popover covers.
test('Tab and Shift+Tab cycle within the open all-day overflow popover', async ({ page }) => {
  await page.locator('#allday [data-slot="overflow-more-btn"]').click();
  const focused = () =>
    page.evaluate(() => {
      const active = document.activeElement;
      const popover = document.querySelector('#allday [role="dialog"]');
      return { inside: popover.contains(active), label: (active.getAttribute('aria-label') || active.id || '').split(',')[0] };
    });

  const forward = [await focused()];
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    forward.push(await focused());
  }
  expect(forward.every((step) => step.inside)).toBe(true);
  // Five events, so the sixth stop is the first one again rather than #outside.
  expect(forward[5].label).toBe(forward[0].label);

  // The wrap left focus on the first event again, so Shift+Tab goes to the last.
  const backward = [];
  for (let i = 0; i < 2; i++) {
    await page.keyboard.press('Shift+Tab');
    backward.push(await focused());
  }
  expect(backward.every((step) => step.inside)).toBe(true);
  expect(backward[0].label).toBe(forward[4].label);
  expect(backward[1].label).toBe(forward[3].label);
});
