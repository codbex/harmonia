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
  // Measure once the buttons have their final size, or the column is still settling under load.
  await settle(page);
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

test('a menu opened from a pinned cell is above the pinned cells of the rows below', async ({ page }) => {
  await gotoFixture(page, 'table');
  await page.locator('#pinned-menu-trigger-1').click();
  const menu = page.locator('#pinned-menu-1');
  await menu.waitFor({ state: 'visible' });
  await settle(page);

  // The menu's end overlaps the pinned column of rows 2-4: each item must be the element hit there.
  const hits = await menu.evaluate((list) =>
    [...list.querySelectorAll('[data-slot=menu-item]')].map((item) => {
      const box = item.getBoundingClientRect();
      const hit = document.elementFromPoint(box.right - 5, box.top + box.height / 2);
      return item.contains(hit);
    })
  );
  expect(hits).toEqual([true, true, true]);

  // Page chrome above the pinned cell's own level, such as a sticky app bar at z-10, must not cover the menu either.
  const underBar = await menu.evaluate((list) => {
    const box = list.getBoundingClientRect();
    const bar = document.createElement('div');
    Object.assign(bar.style, { position: 'fixed', zIndex: '10', left: box.left + 'px', top: box.top + 'px', width: box.width / 2 + 'px', height: box.height + 'px' });
    document.body.appendChild(bar);
    const item = list.querySelector('[data-slot=menu-item]').getBoundingClientRect();
    const hit = document.elementFromPoint(item.left + 5, item.top + item.height / 2);
    bar.remove();
    return list.contains(hit);
  });
  expect(underBar).toBe(true);
});

// What is painted at the centre of a pinned header cell once the body has scrolled under it,
// and the z-index of the first pinned body cell.
const pinnedHeaderHit = (container) =>
  container.evaluate((el) => {
    // elementFromPoint sees only the viewport, and the table may sit below the fold.
    el.scrollIntoView({ block: 'center' });
    const th = el.querySelector('thead th[data-sticky]');
    const box = th.getBoundingClientRect();
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return { headerHit: th.contains(hit), bodyCellZ: getComputedStyle(el.querySelector('tbody td[data-sticky]')).zIndex };
  });

test('a pinned cell holding an expanded control that is not a popup stays under the sticky header', async ({ page }) => {
  await gotoFixture(page, 'table');
  const scroller = page.locator('#pinned-expanders');
  await scroller.evaluate((el) => (el.scrollTop = 60));
  await settle(page);
  expect(await pinnedHeaderHit(scroller)).toEqual({ headerHit: true, bodyCellZ: '1' });
});

test('a pinned end cell in a table with column borders draws a single line', async ({ page }) => {
  await gotoFixture(page, 'table');
  const widths = await page
    .locator('#pinned-borders tbody tr')
    .first()
    .evaluate((row) => {
      const cells = [...row.children];
      return {
        before: getComputedStyle(cells[cells.length - 2]).borderInlineEndWidth,
        pinned: getComputedStyle(cells[cells.length - 1]).borderInlineStartWidth,
      };
    });
  expect(widths).toEqual({ before: '0px', pinned: '1px' });
});

test('a pinned column works inside a dialog', async ({ page }) => {
  await gotoFixture(page, 'table');
  await page.locator('#pinned-dialog-open').click();
  await page.locator('[data-slot=dialog]').waitFor({ state: 'visible' });
  await settle(page, 400);

  const scroller = page.locator('#pinned-dialog-expanders');
  await scroller.evaluate((el) => (el.scrollTop = 60));
  await settle(page);
  expect(await pinnedHeaderHit(scroller)).toEqual({ headerHit: true, bodyCellZ: '1' });

  // The trigger row at the bottom of the dialog body, so the menu opens over the dialog footer.
  const trigger = page.locator('#pinned-dialog-trigger-1');
  await trigger.evaluate((el) => el.scrollIntoView({ block: 'end' }));
  await trigger.click();
  const menu = page.locator('#pinned-dialog-menu-1');
  await menu.waitFor({ state: 'visible' });
  await settle(page);
  const hits = await menu.evaluate((list) => {
    const inMenu = (x, y) => list.contains(document.elementFromPoint(x, y));
    const items = [...list.querySelectorAll('[data-slot=menu-item]')].map((item) => item.getBoundingClientRect());
    const menuBox = list.getBoundingClientRect();
    const footerBox = document.getElementById('pinned-dialog-close').getBoundingClientRect();
    const left = Math.max(menuBox.left, footerBox.left);
    const right = Math.min(menuBox.right, footerBox.right);
    const top = Math.max(menuBox.top, footerBox.top);
    const bottom = Math.min(menuBox.bottom, footerBox.bottom);
    return {
      // Above the pinned cells of the rows below.
      centres: items.map((box) => inMenu(box.left + box.width / 2, box.top + box.height / 2)),
      ends: items.map((box) => inMenu(box.right - 5, box.top + box.height / 2)),
      // Above the dialog footer it overlaps.
      overlapsFooter: right > left && bottom > top,
      aboveFooter: right > left && bottom > top && inMenu((left + right) / 2, (top + bottom) / 2),
    };
  });
  expect(hits).toEqual({ centres: [true, true, true], ends: [true, true, true], overlapsFooter: true, aboveFooter: true });
});

test('the row header column stays at the start edge of a right-to-left table during horizontal scroll', async ({ page }) => {
  await gotoFixture(page, 'table');
  const scroller = page.locator('#scroller-rtl');
  const header = page.locator('#row-rtl-1 th');
  const container = await scroller.boundingBox();
  const before = await header.boundingBox();

  // A right-to-left scroller counts leftwards from zero.
  await scroller.evaluate((el) => (el.scrollLeft = -200));
  await settle(page);

  const after = await header.boundingBox();
  expect(Math.abs(after.x + after.width - (before.x + before.width))).toBeLessThan(2);
  expect(Math.abs(after.x + after.width - (container.x + container.width))).toBeLessThan(2);
});

test('a select list inside a table container opens in full', async ({ page }) => {
  await gotoFixture(page, 'table');
  await page.locator('#plain-select [data-slot=select-input]').click();
  const content = page.locator('#plain-select [data-slot=select-content]');
  await content.waitFor({ state: 'visible' });
  await settle(page);

  const result = await content.evaluate((el) => {
    const container = el.closest('[data-slot=table-container]');
    container.scrollIntoView({ block: 'center' });
    const box = el.getBoundingClientRect();
    const hit = document.elementFromPoint(box.left + box.width / 2, box.bottom - 12);
    return { tallerThanContainer: box.height > container.getBoundingClientRect().height, bottomPainted: el.contains(hit) };
  });
  expect(result).toEqual({ tallerThanContainer: true, bottomPainted: true });
});
