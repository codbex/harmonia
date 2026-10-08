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
