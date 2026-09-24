import { expect, test } from '@playwright/test';
import { FIXED_TIME, gotoFixture, settle } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(FIXED_TIME);
  await gotoFixture(page, 'inline-calendar-range');
});

// A range day and the shadows bridging the gaps beside it must paint one color,
// or the bar shows seams wherever the background is not the page's own.
for (const id of ['light', 'dark']) {
  test(`a range reads as one bar in the ${id} calendar`, async ({ page }) => {
    const middle = page.locator(`#${id} td[data-range="middle"]`).first();
    await expect(middle).toBeVisible();
    await settle(page);
    const { background, shadow } = await middle.evaluate((td) => {
      const style = getComputedStyle(td);
      return { background: style.backgroundColor, shadow: style.boxShadow };
    });
    expect(background).not.toBe('rgba(0, 0, 0, 0)');
    expect(shadow.startsWith(`${background} `)).toBe(true);
  });
}
