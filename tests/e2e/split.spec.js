import { expect, test } from '@playwright/test';
import { drag, gotoFixture, settle } from './helpers.js';

const gutter = (page) => page.locator('[data-slot=split-gutter]');
const width = (locator) => locator.boundingBox().then((box) => box.width);

// Drags the gutter to just inside the container's right edge. Far enough to
// hit the min clamp, but the pointer stays inside the viewport (Firefox
// handles out-of-viewport mouse targets unreliably).
async function dragToRightEdge(page) {
  const container = await page.locator('#split').boundingBox();
  const handle = await gutter(page).boundingBox();
  const dx = container.x + container.width - (handle.x + handle.width / 2) - 2;
  await drag(page, gutter(page), dx, 0);
}

test('panels share the container width evenly on first layout', async ({ page }) => {
  await gotoFixture(page, 'split');
  const a = await width(page.locator('#panel-a'));
  const b = await width(page.locator('#panel-b'));
  expect(Math.abs(a - b)).toBeLessThan(2);
  const container = await width(page.locator('#split'));
  const g = await width(gutter(page));
  expect(Math.abs(a + b + g - container)).toBeLessThan(2);
});

test('dragging the gutter resizes both panels', async ({ page }) => {
  await gotoFixture(page, 'split');
  const beforeA = await width(page.locator('#panel-a'));
  const beforeB = await width(page.locator('#panel-b'));
  await drag(page, gutter(page), 100, 0);
  const afterA = await width(page.locator('#panel-a'));
  const afterB = await width(page.locator('#panel-b'));
  expect(afterA - beforeA).toBeGreaterThan(90);
  expect(afterA - beforeA).toBeLessThan(110);
  expect(beforeB - afterB).toBeGreaterThan(90);
});

test('a drag past the edge clamps at the shrinking panel data-min', async ({ page }) => {
  await gotoFixture(page, 'split');
  await dragToRightEdge(page);
  const b = await width(page.locator('#panel-b'));
  expect(Math.round(b)).toBe(100);
});

test('dragged sizes persist through localStorage across a reload', async ({ page }) => {
  await gotoFixture(page, 'split');
  await drag(page, gutter(page), 100, 0);
  await settle(page, 400); // saveSizes debounces 200ms
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('e2e.split.sizes')));
  expect(stored).toHaveLength(2);
  const a = await width(page.locator('#panel-a'));

  await page.reload();
  await gotoFixture(page, 'split');
  const restored = await width(page.locator('#panel-a'));
  expect(Math.abs(restored - a)).toBeLessThan(2);
});

test('the gutter is the first tab stop and the arrow keys resize the panels', async ({ page }) => {
  await gotoFixture(page, 'split');
  const before = await width(page.locator('#panel-a'));
  await page.keyboard.press('Tab');
  await expect(gutter(page)).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await settle(page);
  expect(Math.round((await width(page.locator('#panel-a'))) - before)).toBe(30);

  await page.keyboard.press('Shift+ArrowRight');
  await settle(page);
  expect(Math.round((await width(page.locator('#panel-a'))) - before)).toBe(130);

  await page.keyboard.press('Home');
  await settle(page);
  expect(Math.round(await width(page.locator('#panel-a')))).toBe(100);
  await expect(gutter(page)).toHaveAttribute('aria-valuenow', /^\d+$/);
});

test('a nested vertical split does not inherit min-width from the outer horizontal split', async ({ page }) => {
  await gotoFixture(page, 'split-nested');
  await settle(page);
  const bottom = page.locator('#inner-bottom');
  const styles = await bottom.evaluate((el) => {
    const s = getComputedStyle(el);
    return { minWidth: s.minWidth, minHeight: s.minHeight };
  });
  expect(styles.minWidth).toBe('0px');
  expect(styles.minHeight).toBe('100px');
  // The inner panel fills its parent instead of being pinned wider than it.
  const outerB = await width(page.locator('#outer-b'));
  expect(Math.abs((await width(bottom)) - outerB)).toBeLessThan(2);
});

test('a container resize re-lays panels while honoring data-min', async ({ page }) => {
  await gotoFixture(page, 'split');
  await dragToRightEdge(page); // pin panel B at its min
  await page.setViewportSize({ width: 480, height: 720 });
  await settle(page);
  const a = await width(page.locator('#panel-a'));
  const b = await width(page.locator('#panel-b'));
  expect(a).toBeGreaterThanOrEqual(99);
  expect(b).toBeGreaterThanOrEqual(99);
  const container = await width(page.locator('#split'));
  const g = await width(gutter(page));
  expect(Math.abs(a + b + g - container)).toBeLessThan(2);
});

test('a panel dragged shut stops at its own border and leaves a fixed panel alone', async ({ page }) => {
  await gotoFixture(page, 'split-gutterless');
  await settle(page);
  expect(Math.round(await width(page.locator('#fixed')))).toBe(200);
  const a = await width(page.locator('#panel-a'));
  // Well past the point where A has no content left.
  await drag(page, gutter(page), -(a + 40), 0);
  await settle(page);
  expect(await width(page.locator('#fixed'))).toBeCloseTo(200, 1);
  expect(await width(page.locator('#panel-a'))).toBeCloseTo(2, 1); // its two 1px borders
});
