import { expect, test } from '@playwright/test';
import { gotoFixture, settle } from './helpers.js';

const styles = (page, selector) =>
  page.locator(selector).evaluate((el) => {
    const style = getComputedStyle(el);
    return { background: style.backgroundColor, borderStyle: style.borderTopStyle, border: style.borderColor };
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

// The group strips the control's own border, so only real CSS shows whether
// the group border follows the control's :user-invalid state.
test('a required grouped input shows the error on the group after a submit attempt, not on load', async ({ page }) => {
  await gotoFixture(page, 'input-group');
  const negative = await negativeColor(page);
  await settle(page);

  expect((await styles(page, '#required')).border).not.toBe(negative);

  await page.locator('#required-submit').click();
  await settle(page);
  expect((await styles(page, '#required')).border).toBe(negative);
});

test('a required grouped input under data-validate="immediate" shows the error on the group on load', async ({ page }) => {
  await gotoFixture(page, 'input-group');
  const negative = await negativeColor(page);
  await settle(page);

  expect((await styles(page, '#immediate')).border).toBe(negative);
});
