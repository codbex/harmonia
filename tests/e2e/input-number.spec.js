import { expect, test } from '@playwright/test';
import { gotoFixture, settle } from './helpers.js';

const state = (page) =>
  page.evaluate(() => ({
    value: document.getElementById('amount').value,
    scrollY: window.scrollY,
    focused: document.activeElement.id,
  }));

// Chrome steps a focused number input on wheel through its native spin button,
// a default action only a real browser performs.
test('scrolling over a focused number input scrolls the page and keeps the value', async ({ page }) => {
  await gotoFixture(page, 'input-number');
  await settle(page);

  // A click both focuses the input and leaves the pointer over it.
  await page.locator('#amount').click();
  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel(0, 300);
    await settle(page, 50);
  }
  await settle(page);

  const after = await state(page);
  expect(after.value).toBe('23');
  expect(after.scrollY).toBeGreaterThan(0);
  expect(after.focused).toBe('amount');
});

// Native keyboard stepping must survive hiding the spin button.
test('arrow keys still step the value', async ({ page }) => {
  await gotoFixture(page, 'input-number');
  await settle(page);

  const input = page.locator('#amount');
  await input.focus();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowDown');
  await expect(input).toHaveValue('24');
});

// Alpine writes the model back into the input on every change. A focused
// number input must keep the typed text through that write, or a decimal in
// progress is rewritten under the cursor (1.0 becomes 1, so 1.05 ends as 15).
test('inserting a decimal point keeps the typed text', async ({ page }) => {
  await gotoFixture(page, 'input-number');
  const input = page.locator('#decimal');
  const model = page.locator('#model');
  await input.click();
  await page.keyboard.type('10');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.type('.');
  await expect(input).toHaveValue('1.0');
  await expect(model).toHaveText('1');
  await page.keyboard.press('End');
  await page.keyboard.type('5');
  await expect(input).toHaveValue('1.05');
  await expect(model).toHaveText('1.05');
});

test('deleting the digit after the point keeps the point', async ({ page }) => {
  await gotoFixture(page, 'input-number');
  const input = page.locator('#decimal');
  await input.click();
  await page.keyboard.type('0.5');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('7');
  await expect(input).toHaveValue('0.7');
  await expect(page.locator('#model')).toHaveText('0.7');
});

test('typing a decimal with a zero after the point keeps every digit', async ({ page }) => {
  await gotoFixture(page, 'input-number');
  const input = page.locator('#decimal');
  await input.click();
  await page.keyboard.type('1.05');
  await expect(input).toHaveValue('1.05');
  await expect(page.locator('#model')).toHaveText('1.05');
});
