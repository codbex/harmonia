import { expect, test } from '@playwright/test';
import { gotoFixture, settle } from './helpers.js';

// Alpine keeps the x-if <template> in the card and inserts the rendered branch
// after it, so :last-child, :first-child and '+' all see a sibling that draws
// nothing. Only a real browser resolves those selectors, which is why the
// padding contract is checked here rather than in the unit suite.
const padding = (page, id, side) => page.locator(`#${id}`).evaluate((el, s) => getComputedStyle(el)[s], side);

const toggle = async (page) => {
  await page.locator('#toggle').click();
  await settle(page);
};

test('a header keeps its bottom padding while its content is behind a false x-if', async ({ page }) => {
  await gotoFixture(page, 'card');
  expect(await padding(page, 'header-only-header', 'paddingBottom')).toBe('24px');

  await toggle(page);
  expect(await padding(page, 'header-only-header', 'paddingBottom')).toBe('0px');
  expect(await padding(page, 'header-only-content', 'paddingTop')).toBe('16px');
  expect(await padding(page, 'header-only-content', 'paddingBottom')).toBe('24px');
});

test('a footer pays the gap under a header the x-if template sits between', async ({ page }) => {
  await gotoFixture(page, 'card');
  expect(await padding(page, 'with-footer-header', 'paddingBottom')).toBe('0px');
  expect(await padding(page, 'with-footer-footer', 'paddingTop')).toBe('16px');

  // The content now pays that 16 from both sides, so the footer stops paying it.
  await toggle(page);
  expect(await padding(page, 'with-footer-footer', 'paddingTop')).toBe('0px');
});

test('content pays the top edge while the header before it is behind a false x-if', async ({ page }) => {
  await gotoFixture(page, 'card');
  expect(await padding(page, 'conditional-header-content', 'paddingTop')).toBe('24px');

  await toggle(page);
  expect(await padding(page, 'conditional-header-content', 'paddingTop')).toBe('16px');
});

test('a dialog header keeps its bottom padding while its content is behind a false x-if', async ({ page }) => {
  await gotoFixture(page, 'card');
  expect(await padding(page, 'dialog-header', 'paddingBottom')).toBe('16px');

  await toggle(page);
  expect(await padding(page, 'dialog-header', 'paddingBottom')).toBe('0px');
});
