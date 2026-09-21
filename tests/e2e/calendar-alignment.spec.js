import { expect, test } from '@playwright/test';
import { FIXED_TIME, gotoFixture } from './helpers.js';

// Playwright launches Chromium with --hide-scrollbars, which overlays the
// scrollbar and hides the very bug this file covers. `launchOptions` is
// worker-scoped, so it can only be set at file level - hence a spec of its own.
test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } });

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(FIXED_TIME);
  await gotoFixture(page, 'calendar');
});

// Right edge of the last cell in each of the three grids a week view lays out:
// day headers, the all-day strip, and the day columns.
const measure = (page, id) =>
  page.evaluate((id) => {
    const cal = document.querySelector(`#${id}`);
    const scroll = cal.querySelector('.overflow-y-auto.flex-1');
    const grids = cal.querySelectorAll('.grid');
    const strip = grids[1].parentElement;
    const right = (grid) => grid.lastElementChild.getBoundingClientRect().right;
    return {
      scrollbarWidth: scroll.offsetWidth - scroll.clientWidth,
      stripScrollbarWidth: strip.offsetWidth - strip.clientWidth,
      headerRight: right(grids[0]),
      allDayRight: right(grids[1]),
      columnRight: right(grids[grids.length - 1]),
    };
  }, id);

// A classic scrollbar is taken out of the scroll box's content width. Header and
// columns only stay in step while both sit inside that same box.
test('the week view day headers stay aligned with their columns beside a classic scrollbar', async ({ page }) => {
  const edges = await measure(page, 'visible');

  // Firefox and WebKit overlay their scrollbars, so there is nothing to reproduce there.
  test.skip(edges.scrollbarWidth === 0, 'the platform overlays its scrollbars');
  expect(edges.headerRight).toBeCloseTo(edges.columnRight, 0);
});

// The strip used to scroll on its own past three rows, and its scrollbar then
// narrowed its cells alone. It now caps at three rows and never scrolls.
test('the all-day strip stays aligned once a day passes its row cap', async ({ page }) => {
  const edges = await measure(page, 'allday');

  test.skip(edges.scrollbarWidth === 0, 'the platform overlays its scrollbars');
  await expect(page.locator('#allday [data-slot="overflow-more-btn"]')).toHaveText('+3 more');
  expect(edges.stripScrollbarWidth).toBe(0);
  expect(edges.allDayRight).toBeCloseTo(edges.columnRight, 0);
  expect(edges.headerRight).toBeCloseTo(edges.columnRight, 0);
});
