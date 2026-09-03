import { expect, test } from '@playwright/test';
import { gotoFixture, settle } from './helpers.js';

const activeSlot = (page) => page.evaluate(() => document.activeElement.getAttribute('data-slot'));
const activeId = (page) => page.evaluate(() => document.activeElement.id);

test('an x-for list mounts with the roles and a single roving stop shared with the actions', async ({ page }) => {
  await gotoFixture(page, 'tabs');
  await expect(page.locator('#closable [data-slot=tab-list]')).toHaveAttribute('role', 'tablist');
  await expect(page.locator('#ct-1i')).toHaveAttribute('role', 'presentation');
  await expect(page.locator('#ct-2')).toHaveAttribute('role', 'tab');

  await expect(page.locator('#ct-2')).toHaveAttribute('tabindex', '0');
  await expect(page.locator('#ct-2i [data-slot=tab-action]')).toHaveAttribute('tabindex', '0');
  await expect(page.locator('#ct-1')).toHaveAttribute('tabindex', '-1');
  await expect(page.locator('#ct-1i [data-slot=tab-action]')).toHaveAttribute('tabindex', '-1');
});

test('Tab enters at the selected tab, reaches only its action, and moves on into the panel', async ({ page }) => {
  await gotoFixture(page, 'tabs');
  await page.keyboard.press('Tab');
  expect(await activeId(page)).toBe('ct-2');

  await page.keyboard.press('Tab');
  expect(await activeSlot(page)).toBe('tab-action');
  expect(await page.evaluate(() => document.activeElement.closest('[data-slot=tab-item]').id)).toBe('ct-2i');

  // The other tabs' actions hold tabindex -1, so the next stop is the panel.
  await page.keyboard.press('Tab');
  expect(await activeId(page)).toBe('ct-2c');
});

test('arrow keys move focus between tabs, also while an action has focus', async ({ page }) => {
  await gotoFixture(page, 'tabs');
  await page.locator('#ct-2').focus();
  await page.keyboard.press('ArrowRight');
  expect(await activeId(page)).toBe('ct-3');

  // From the now focused tab, Tab reaches its action, and an arrow from there
  // still navigates the list, wrapping around the end.
  await page.keyboard.press('Tab');
  expect(await activeSlot(page)).toBe('tab-action');
  await page.keyboard.press('ArrowRight');
  expect(await activeId(page)).toBe('ct-1');
});

test('a close action removes its tab without selecting it, and closing the selected tab hands the stop on', async ({ page }) => {
  await gotoFixture(page, 'tabs');
  await page.locator('#ct-1i [data-slot=tab-action]').click();
  await expect(page.locator('#ct-1i')).toHaveCount(0);
  await expect(page.locator('#ct-2')).toHaveAttribute('aria-selected', 'true');

  await page.locator('#ct-2i [data-slot=tab-action]').click();
  await expect(page.locator('#ct-2i')).toHaveCount(0);
  await expect(page.locator('#ct-3')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#ct-3')).toHaveAttribute('tabindex', '0');
});

test('a click on the item padding beside the transparent button still selects the tab', async ({ page }) => {
  await gotoFixture(page, 'tabs');
  const box = await page.locator('#ct-1i').boundingBox();
  await page.mouse.click(box.x + 3, box.y + box.height / 2);
  await expect(page.locator('#ct-1')).toHaveAttribute('aria-selected', 'true');
});

test('selection really renders on the item through the inner button aria-selected', async ({ page }) => {
  await gotoFixture(page, 'tabs');
  const shadow = (id) => page.locator(id).evaluate((el) => getComputedStyle(el).boxShadow);

  // The docked underline is an inset shadow drawn by the item's has- selector.
  expect(await shadow('#ct-2i')).not.toBe('none');
  expect(await shadow('#ct-1i')).toBe('none');

  await page.locator('#ct-1').click();
  await settle(page);
  expect(await shadow('#ct-1i')).not.toBe('none');
  expect(await shadow('#ct-2i')).toBe('none');
});

test('hovering an action applies the item hover surface, so the whole tab lights up', async ({ page }) => {
  await gotoFixture(page, 'tabs');
  const item = page.locator('#fl-1i');
  const background = () => item.evaluate((el) => getComputedStyle(el).backgroundColor);

  const resting = await background();
  await page.locator('#fl-1i [data-slot=tab-action]').hover();
  await settle(page);
  // Assert the settled computed style; el.matches(':hover') stays false under
  // automation even when the hover styles really apply.
  expect(await background()).not.toBe(resting);
});

test('a mixed list gates actions with x-if, and a late action adopts the current stop', async ({ page }) => {
  await gotoFixture(page, 'tabs');
  await expect(page.locator('#mx-1i [data-slot=tab-action]')).toHaveCount(0);
  await expect(page.locator('#mx-2i [data-slot=tab-action]')).toHaveCount(1);

  // An item without actions renders exactly like one with them.
  const bare = await page.locator('#mx-1i').boundingBox();
  const closable = await page.locator('#mx-2i').boundingBox();
  expect(Math.abs(bare.height - closable.height)).toBeLessThan(1);

  // mx-1 is selected and holds the stop, so the action mounting into its item
  // long after the stop settled must pick it up on its own.
  await page.locator('#make-closable').click();
  const action = page.locator('#mx-1i [data-slot=tab-action]');
  await action.waitFor({ state: 'attached' });
  await expect(action).toHaveAttribute('tabindex', '0');
});

test('an overflowing list fades its hidden edge and opens scrolled to the selected tab', async ({ page }) => {
  await gotoFixture(page, 'tabs');
  const list = page.locator('#overflow [data-slot=tab-list]');
  expect(await list.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  const fades = await list.evaluate((el) => ['fade-x-8', 'fade-l-8', 'fade-r-8'].filter((cls) => el.classList.contains(cls)));
  expect(fades.length).toBeGreaterThan(0);
});
