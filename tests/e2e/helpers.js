export const FIXTURES = '/tests/e2e/fixtures';
export const COLOR_MODE_KEY = 'codbex.harmonia.colorMode';
export const FIXED_TIME = new Date('2025-06-15T10:00:00');

// Navigates to a fixture page and waits until the bundle registered on
// alpine:init and at least one directive produced its data-slot attribute.
export async function gotoFixture(page, name) {
  await page.goto(`${FIXTURES}/${name}.html`);
  await page.waitForFunction(() => window.Alpine && window.Harmonia);
  await page.waitForSelector('[data-slot]', { state: 'attached' });
}

// Most components carry 100-200ms transitions. Computed styles or visibility
// read before the transition settles report mid-fade values.
export function settle(page, ms = 250) {
  return page.waitForTimeout(ms);
}

// Must run before navigation: dist/harmonia.js reads this key at script-eval
// time, long before Alpine starts.
export function seedColorScheme(context, mode) {
  return context.addInitScript(([key, value]) => localStorage.setItem(key, value), [COLOR_MODE_KEY, mode]);
}

// Real pointer drag from the center of `locator` by (dx, dy). Multiple steps
// so pointermove fires repeatedly like a real drag gesture.
export async function drag(page, locator, dx, dy, steps = 10) {
  const box = await locator.boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + dx, cy + dy, { steps });
  await page.mouse.up();
}

// Popover-like content (menu, select, picker popups) is attached but hidden
// until opened, so a default visibility wait on it times out.
export async function openAttached(page, trigger, contentSelector) {
  await page.waitForSelector(contentSelector, { state: 'attached' });
  await trigger.click();
  const content = page.locator(contentSelector);
  await content.waitFor({ state: 'visible' });
  return content;
}
