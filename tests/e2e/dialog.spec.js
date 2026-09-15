import { expect, test } from '@playwright/test';
import { gotoFixture, settle } from './helpers.js';

const activeId = (page) => page.evaluate(() => document.activeElement.id);
const style = (page, id, prop) => page.locator(`#${id}`).evaluate((el, p) => getComputedStyle(el)[p], prop);

async function openDialog(page) {
  await page.locator('#opener').click();
  await expect(page.locator('#overlay')).toBeVisible();
  await settle(page);
}

test('opening moves focus into the dialog through the real transition', async ({ page }) => {
  await gotoFixture(page, 'dialog');
  await openDialog(page);
  expect(await activeId(page)).toBe('name-1');
});

test('Tab cycles forward inside the dialog and never escapes it', async ({ page }) => {
  await gotoFixture(page, 'dialog');
  await openDialog(page);
  const seen = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    seen.push(await activeId(page));
  }
  // 4 focusables (2 inputs, 2 buttons): 8 tabs is two full cycles.
  expect(seen.slice(0, 4)).toEqual(['username-1', 'cancel', 'save', 'name-1']);
  expect(seen.slice(4)).toEqual(seen.slice(0, 4));
  const insideOverlay = await page.evaluate(() => document.getElementById('overlay').contains(document.activeElement));
  expect(insideOverlay).toBe(true);
});

test('Shift+Tab from the first control wraps to the last', async ({ page }) => {
  await gotoFixture(page, 'dialog');
  await openDialog(page);
  await page.keyboard.press('Shift+Tab');
  expect(await activeId(page)).toBe('save');
});

test('closing returns focus to the opener', async ({ page }) => {
  await gotoFixture(page, 'dialog');
  await openDialog(page);
  await page.keyboard.press('Escape');
  await expect(page.locator('#overlay')).toBeHidden();
  await settle(page);
  expect(await activeId(page)).toBe('opener');
});

test('reopening during the close transition still ends up open', async ({ page }) => {
  await gotoFixture(page, 'dialog');
  await openDialog(page);
  await page.locator('#cancel').click();
  // Reopen immediately, before the fade-out transition finishes.
  await page.locator('#opener').click();
  await settle(page, 400);
  await expect(page.locator('#overlay')).toBeVisible();
});

test('long content scrolls inside the dialog while the header stays put', async ({ page }) => {
  await gotoFixture(page, 'dialog');
  await page.locator('#long-opener').click();
  await expect(page.locator('#long-overlay')).toBeVisible();
  await settle(page);

  const content = page.locator('#long-content');
  const overflows = await content.evaluate((el) => el.scrollHeight > el.clientHeight);
  expect(overflows).toBe(true);

  const headerBefore = await page.locator('#long-header').boundingBox();
  await content.hover();
  await page.mouse.wheel(0, 500);
  await settle(page);
  expect(await content.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  const headerAfter = await page.locator('#long-header').boundingBox();
  expect(headerAfter.y).toBe(headerBefore.y);
});

// The border and the padding it tightens are both plain CSS, and the footer's
// rule reads its siblings, so only a real browser resolves either of them.
test('a bordered header and footer draw a rule and tighten their padding to it', async ({ page }) => {
  await gotoFixture(page, 'dialog');
  await page.locator('#long-opener').click();
  await expect(page.locator('#long-overlay')).toBeVisible();
  await settle(page);

  expect(await style(page, 'long-header', 'borderBottomWidth')).toBe('1px');
  expect(await style(page, 'long-header', 'paddingTop')).toBe('16px');
  expect(await style(page, 'long-header', 'paddingBottom')).toBe('8px');

  expect(await style(page, 'long-footer', 'borderTopWidth')).toBe('1px');
  expect(await style(page, 'long-footer', 'paddingTop')).toBe('8px');
  expect(await style(page, 'long-footer', 'paddingBottom')).toBe('8px');
});

test('a bordered footer keeps its own padding in a dialog with no content slot', async ({ page }) => {
  await gotoFixture(page, 'dialog');
  await page.locator('#plain-opener').click();
  await expect(page.locator('#plain-overlay')).toBeVisible();
  await settle(page);

  // Without a body slot the footer normally pays the 16 under the header, which
  // outranks the border padding on specificity unless it is excluded from it.
  expect(await style(page, 'plain-footer', 'paddingTop')).toBe('8px');

  // Dropping the border puts the same footer back on 16, so the exclusion above
  // is what the border padding depends on rather than a rule that never matched.
  await page.locator('#plain-footer').evaluate((el) => el.classList.remove('border-t'));
  expect(await style(page, 'plain-footer', 'paddingTop')).toBe('16px');
});
