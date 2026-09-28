import { expect, test } from '@playwright/test';
import { gotoFixture, settle } from './helpers.js';

const colors = (page, selector) =>
  page.locator(selector).evaluate((el) => {
    const style = getComputedStyle(el);
    return { background: style.backgroundColor, border: style.borderColor };
  });

const negativeColor = (page) =>
  page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = 'var(--negative)';
    document.body.appendChild(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });

// A required checkbox is :invalid from the start. Its border comes from
// utility classes, but its fill lives in checkbox.css, so only real CSS shows
// whether both wait for :user-invalid.
test('a required checkbox shows its error after a submit attempt, not on load', async ({ page }) => {
  await gotoFixture(page, 'checkbox');
  const negative = await negativeColor(page);
  await settle(page);

  let { background, border } = await colors(page, '#policy');
  expect(background).not.toBe(negative);
  expect(border).not.toBe(negative);

  await page.locator('#policy-submit').click();
  await settle(page);
  ({ background, border } = await colors(page, '#policy'));
  expect(background).toBe(negative);
  expect(border).toBe(negative);
});

test('a required checkbox under data-validate="immediate" shows its error on load', async ({ page }) => {
  await gotoFixture(page, 'checkbox');
  const negative = await negativeColor(page);
  await settle(page);

  const { background, border } = await colors(page, '#immediate');
  expect(background).toBe(negative);
  expect(border).toBe(negative);
});
