import { expect, test } from '@playwright/test';
import { gotoFixture, settle } from './helpers.js';

// x-h-select-input turns the real input into an sr-only model carrier and
// generates a [data-slot=select-input] button as the interactive trigger.
const trigger = (page, select = '#select') => page.locator(`${select} [data-slot=select-input]`);

test('picking an option updates the bound x-model value and closes the list', async ({ page }) => {
  await gotoFixture(page, 'select');
  await expect(page.locator('#content')).toBeAttached();
  await expect(page.locator('#content')).toBeHidden();

  await trigger(page).click();
  await expect(page.locator('#content')).toBeVisible();
  await settle(page);
  await page.locator('#opt-banana').click();

  await expect(page.locator('#content')).toBeHidden();
  await expect(page.locator('#model')).toHaveText('banana');
  await expect(trigger(page)).toHaveText('Banana');
});

test('a select near the bottom edge opens its list upward, inside the viewport', async ({ page }) => {
  await gotoFixture(page, 'select');
  await trigger(page, '#pinned-select').click();
  await expect(page.locator('#pinned-content')).toBeVisible();
  await settle(page);

  const input = await trigger(page, '#pinned-select').boundingBox();
  const content = await page.locator('#pinned-content').boundingBox();
  expect(content.y + content.height).toBeLessThanOrEqual(input.y + 1);
  expect(content.y).toBeGreaterThanOrEqual(0);
});

test('the option list is size-limited to fit the available space', async ({ page }) => {
  await gotoFixture(page, 'select');
  // Small viewport so the 12 options cannot fit and the size() middleware
  // must cap the list.
  await page.setViewportSize({ width: 800, height: 320 });
  await trigger(page, '#pinned-select').click();
  await expect(page.locator('#pinned-content')).toBeVisible();
  await settle(page);

  const content = await page.locator('#pinned-content').boundingBox();
  const viewport = page.viewportSize();
  expect(content.y).toBeGreaterThanOrEqual(0);
  expect(content.y + content.height).toBeLessThanOrEqual(viewport.height);
  const scrollable = await page.locator('#pinned-content').evaluate((el) => {
    const list = el.querySelector('[data-slot=select-list]');
    return el.scrollHeight > el.clientHeight || list.scrollHeight > list.clientHeight;
  });
  expect(scrollable).toBe(true);
});

test('the full keyboard flow selects an option and returns focus', async ({ page }) => {
  await gotoFixture(page, 'select');
  await trigger(page).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#content')).toBeVisible();
  await settle(page);

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  await expect(page.locator('#content')).toBeHidden();
  await expect(page.locator('#model')).not.toHaveText('');
  const focusIsTrigger = await page.evaluate(() => document.activeElement.getAttribute('data-slot') === 'select-input');
  expect(focusIsTrigger).toBe(true);
});

// A dialog or sheet that closes on an Escape reaching the window must stay
// open when that Escape only closed the select's list.
test('an Escape that closes the list stops at the select, and passes through once it is closed', async ({ page }) => {
  await gotoFixture(page, 'select');
  await page.evaluate(() => {
    window.escapesOnWindow = 0;
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') window.escapesOnWindow++;
    });
  });
  const escapesOnWindow = () => page.evaluate(() => window.escapesOnWindow);

  // Focus on the trigger.
  await trigger(page).click();
  await expect(page.locator('#content')).toBeVisible();
  await settle(page);
  await page.keyboard.press('Escape');
  await expect(page.locator('#content')).toBeHidden();
  expect(await escapesOnWindow()).toBe(0);

  // Focus on an option.
  await page.keyboard.press('Enter');
  await expect(page.locator('#content')).toBeVisible();
  await settle(page);
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#content [role=option]:focus')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.locator('#content')).toBeHidden();
  expect(await escapesOnWindow()).toBe(0);

  await page.keyboard.press('Escape');
  expect(await escapesOnWindow()).toBe(1);
});

test('clicking outside closes the list without changing the selection', async ({ page }) => {
  await gotoFixture(page, 'select');
  await trigger(page).click();
  await expect(page.locator('#content')).toBeVisible();
  await settle(page);
  await page.mouse.click(500, 400);
  await expect(page.locator('#content')).toBeHidden();
  await expect(page.locator('#model')).toHaveText('');
});

const requiredBorder = (page) => page.locator('#required-select').evaluate((el) => getComputedStyle(el).borderColor);

const negativeColor = (page) =>
  page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = 'var(--negative)';
    document.body.appendChild(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });

// checkValidity() fires the same invalid event as a submit attempt, but only
// the submit attempt makes the input :user-invalid.
test('a required select shows its error after a submit attempt, not after checkValidity()', async ({ page }) => {
  await gotoFixture(page, 'select');
  const requiredTrigger = trigger(page, '#required-select');
  const negative = await negativeColor(page);

  await page.locator('#required-form').evaluate((form) => form.checkValidity());
  await settle(page);
  await expect(requiredTrigger).not.toHaveAttribute('aria-invalid');
  await expect(page.locator('#required-error')).toBeHidden();
  expect(await requiredBorder(page)).not.toBe(negative);

  await page.locator('#required-submit').click();
  await expect(requiredTrigger).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#required-error')).toBeVisible();
  await settle(page);
  expect(await requiredBorder(page)).toBe(negative);
});

// Closing the list is the select's "edited and left", so an empty required
// select shows its error from then on, until the form is reset.
test('a required select shows its error once its list is closed empty, until the form is reset', async ({ page }) => {
  await gotoFixture(page, 'select');
  const requiredTrigger = trigger(page, '#required-select');
  const content = page.locator('#required-select [data-slot=select-content]');
  const negative = await negativeColor(page);

  await requiredTrigger.click();
  await expect(content).toBeVisible();
  await settle(page);
  await page.keyboard.press('Escape');
  await expect(content).toBeHidden();
  await expect(requiredTrigger).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#required-error')).toBeVisible();
  await settle(page);
  // The trigger has focus again here, so this also checks that the invalid
  // border is not lost to the focus ring.
  expect(await requiredBorder(page)).toBe(negative);

  await page.locator('#required-form').evaluate((form) => form.reset());
  await expect(requiredTrigger).not.toHaveAttribute('aria-invalid');
  await expect(page.locator('#required-error')).toBeHidden();

  await requiredTrigger.click();
  await expect(content).toBeVisible();
  await settle(page);
  await page.locator('#required-select [data-slot=select-option]').click();
  await expect(content).toBeHidden();
  await expect(requiredTrigger).toHaveText('Apple');
  await expect(requiredTrigger).not.toHaveAttribute('aria-invalid');
});
