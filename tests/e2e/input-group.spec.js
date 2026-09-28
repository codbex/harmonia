import { expect, test } from '@playwright/test';
import { gotoFixture, settle } from './helpers.js';

const styles = (page, selector) =>
  page.locator(selector).evaluate((el) => {
    const style = getComputedStyle(el);
    return { background: style.backgroundColor, borderStyle: style.borderTopStyle };
  });

// The control's own readonly rule carries an attribute selector, so only real
// CSS shows whether it outranks the transparent background of the group variant.
test('a read-only control inside a group keeps the group surface and dashes the border', async ({ page }) => {
  await gotoFixture(page, 'input-group');
  await settle(page);

  const plain = await styles(page, '#plain');
  expect(plain.borderStyle).toBe('solid');

  for (const [group, control] of [
    ['#readonly', '#readonly-input'],
    ['#readonly-textarea', '#readonly-textarea-control'],
  ]) {
    expect((await styles(page, control)).background).toBe('rgba(0, 0, 0, 0)');
    const groupStyle = await styles(page, group);
    expect(groupStyle.background).toBe(plain.background);
    expect(groupStyle.borderStyle).toBe('dashed');
  }
});
