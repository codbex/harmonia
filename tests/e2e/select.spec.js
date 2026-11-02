import { expect, test } from '@playwright/test';
import { gotoFixture, settle } from './helpers.js';

// x-h-select-input turns the real input into a visually hidden model carrier
// and generates a [data-slot=select-input] button as the interactive trigger.
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

// The native input stays in normal flow. Positioned absolutely inside the
// unpositioned select it was placed against the page, where it stretched the
// document below the window and made the whole page scroll.
test('a select low in a scrolling form does not make the page scroll', async ({ page }) => {
  await gotoFixture(page, 'select-scroll');
  const pageScrolls = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight);
  expect(pageScrolls).toBe(false);

  const select = await page.locator('#low-select').boundingBox();
  const input = await page.locator('#low-input').boundingBox();
  expect(input.x).toBeGreaterThanOrEqual(select.x);
  expect(input.y).toBeGreaterThanOrEqual(select.y);
  expect(input.x + input.width).toBeLessThanOrEqual(select.x + select.width);
  expect(input.y + input.height).toBeLessThanOrEqual(select.y + select.height);
});

// The browser focuses the first invalid control and scrolls it into view. The
// input sits inside the select, so the form's own scroller moves to the select
// and the window stays put.
test('a failed submit scrolls the form scroller to the select, not the window', async ({ page }) => {
  await gotoFixture(page, 'select-scroll');
  await page.evaluate(() => {
    document.getElementById('main').scrollTop = 0;
    document.getElementById('form').requestSubmit();
  });
  await settle(page);

  await expect(trigger(page, '#low-select')).toHaveAttribute('aria-invalid', 'true');
  const scroll = await page.evaluate(() => ({
    window: window.scrollY,
    main: document.getElementById('main').scrollTop,
    viewport: window.innerHeight,
  }));
  expect(scroll.window).toBe(0);
  expect(scroll.main).toBeGreaterThan(0);
  // The anchor is the 1px input at the select's top edge, so the top is what
  // every engine brings into view.
  const select = await page.locator('#low-select').boundingBox();
  expect(select.y).toBeGreaterThanOrEqual(0);
  expect(select.y).toBeLessThan(scroll.viewport);
});

// A select with many options used to refresh its trigger label once per
// option, from inside each option's effect, so mounting n options and every
// change of the bound value walked the n options n times. A refresh writes
// aria-selected on every option, and the fixture counts those writes, so the
// number of refreshes is that count divided by the 1,400 options. Only real
// Alpine shows the cost: its scheduler is what re-ran the effects.
const MANY_OPTIONS = 1400;
const refreshes = (page) => page.evaluate((count) => window.ariaSelectedWrites / count, MANY_OPTIONS);

test('mounting 1,400 options resolves the preselected label with a bounded number of refreshes', async ({ page }) => {
  await gotoFixture(page, 'select-many');
  await expect(trigger(page, '#many-select')).toHaveText('Customer 42');
  await expect(page.locator('#many-select [role=option][aria-selected=true]')).toHaveCount(1);
  expect(await refreshes(page)).toBeLessThan(10);
});

test('changing the bound value of a 1,400 option select refreshes the label once, not once per option', async ({ page }) => {
  await gotoFixture(page, 'select-many');
  await expect(trigger(page, '#many-select')).toHaveText('Customer 42');
  const before = await refreshes(page);

  await page.evaluate(() => (window.Alpine.$data(document.getElementById('many')).value = '7'));
  await expect(trigger(page, '#many-select')).toHaveText('Customer 7');
  await expect(page.locator('#many-select [role=option][aria-selected=true]')).toHaveAttribute('data-value', '7');
  expect((await refreshes(page)) - before).toBeLessThan(10);

  // The option's label is reactive too, and renaming the selected one has to
  // reach the trigger through the refresh the option schedules.
  await page.evaluate(() => (window.Alpine.$data(document.getElementById('many')).options[6].text = 'Renamed 7'));
  await expect(trigger(page, '#many-select')).toHaveText('Renamed 7');
});

// The hidden input keeps the bound value even when no option carries it, so
// the label of an option that is gone, or that the value no longer points at,
// must not stay on the trigger.
test('the trigger falls back to the placeholder when the selected option is removed or the value matches no option', async ({ page }) => {
  await gotoFixture(page, 'select-many');
  const many = trigger(page, '#many-select');
  const selectedOptions = page.locator('#many-select [role=option][aria-selected=true]');

  await page.evaluate(() => (window.Alpine.$data(document.getElementById('many')).value = '7'));
  await expect(many).toHaveText('Customer 7');

  await page.evaluate(() => window.Alpine.$data(document.getElementById('many')).options.splice(6, 1));
  await expect(many).toHaveText('Select');
  await expect(page.locator('#many-select [data-slot=select-input] > span')).toHaveClass(/text-muted-foreground/);
  await expect(selectedOptions).toHaveCount(0);

  await page.evaluate(() => (window.Alpine.$data(document.getElementById('many')).value = '42'));
  await expect(many).toHaveText('Customer 42');

  await page.evaluate(() => (window.Alpine.$data(document.getElementById('many')).value = 'nope'));
  await expect(many).toHaveText('Select');
  await expect(selectedOptions).toHaveCount(0);
});
