import { expect, test } from '@playwright/test';
import { gotoFixture, settle } from './helpers.js';

// The aria-disabled resets only hold through the cascade of the real
// stylesheet: they outrank the hover and active colors, and the pressed colors
// are restated after them. Each disabled button is read against itself at rest
// and, where it helps, against an enabled twin.
const style = (page, id, prop) => page.locator(`#${id}`).evaluate((el, p) => getComputedStyle(el)[p], prop);

async function hover(page, id) {
  await page.locator(`#${id}`).hover();
  await settle(page);
}

test('an aria-disabled button stays in the tab order', async ({ page }) => {
  await gotoFixture(page, 'button');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement.id)).toBe('primary-disabled');
});

test('an aria-disabled button is dimmed and shows a not-allowed cursor', async ({ page }) => {
  await gotoFixture(page, 'button');
  expect(await style(page, 'primary-disabled', 'cursor')).toBe('not-allowed');
  expect(Number(await style(page, 'primary-disabled', 'opacity'))).toBeLessThan(1);
  expect(await style(page, 'primary-enabled', 'cursor')).toBe('pointer');
});

test('an aria-disabled button keeps its resting color under hover and press', async ({ page }) => {
  await gotoFixture(page, 'button');
  const resting = await style(page, 'primary-enabled', 'backgroundColor');
  await hover(page, 'primary-enabled');
  expect(await style(page, 'primary-enabled', 'backgroundColor')).not.toBe(resting);

  await hover(page, 'primary-disabled');
  expect(await style(page, 'primary-disabled', 'backgroundColor')).toBe(resting);
  await page.mouse.down();
  await settle(page);
  expect(await style(page, 'primary-disabled', 'backgroundColor')).toBe(resting);
  await page.mouse.up();
});

test('an aria-disabled outline button keeps its resting background and text under hover', async ({ page }) => {
  await gotoFixture(page, 'button');
  const background = await style(page, 'outline-disabled', 'backgroundColor');
  const color = await style(page, 'outline-disabled', 'color');
  await hover(page, 'outline-disabled');
  expect(await style(page, 'outline-disabled', 'backgroundColor')).toBe(background);
  expect(await style(page, 'outline-disabled', 'color')).toBe(color);
});

test('a pressed aria-disabled button keeps its pressed color under hover', async ({ page }) => {
  await gotoFixture(page, 'button');
  const pressed = await style(page, 'pressed-enabled', 'backgroundColor');
  expect(await style(page, 'pressed-disabled', 'backgroundColor')).toBe(pressed);
  await hover(page, 'pressed-disabled');
  expect(await style(page, 'pressed-disabled', 'backgroundColor')).toBe(pressed);
});

test('a selected aria-disabled group choice keeps its selected color under hover', async ({ page }) => {
  await gotoFixture(page, 'button');
  const selected = await style(page, 'choice-enabled', 'backgroundColor');
  expect(await style(page, 'choice-disabled', 'backgroundColor')).toBe(selected);
  await hover(page, 'choice-disabled');
  expect(await style(page, 'choice-disabled', 'backgroundColor')).toBe(selected);
});
