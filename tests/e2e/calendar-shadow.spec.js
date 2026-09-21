import { expect, test } from '@playwright/test';
import { FIXED_TIME, FIXTURES } from './helpers.js';

// The "+N more" overflow popover is the calendar's only floating layer. It used to
// be appended to document.body, which works on a plain page and silently breaks
// inside a shadow root: the popover lands outside the tree that carries
// harmonia.css, so it renders unstyled, full width and nowhere near its trigger.
// The docs render every example that way, so these run against a shadow root.
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(FIXED_TIME);
  await page.goto(`${FIXTURES}/calendar-shadow.html`);
  await page.waitForFunction(() => window.Alpine && window.Harmonia && window.__shadowReady);
  // Playwright's CSS engine pierces open shadow roots, so plain selectors work.
  await page.waitForSelector('#week-cal [data-slot="overflow-more-btn"]');
});

const popoverState = (page, hostId) =>
  page.evaluate((hostId) => {
    const root = document.getElementById(hostId).shadowRoot;
    const inRoot = root.querySelector('[role="dialog"]');
    const inBody = [...document.body.children].some((c) => c.getAttribute?.('role') === 'dialog');
    if (!inRoot) return { inRoot: false, inBody };
    const style = getComputedStyle(inRoot);
    const box = inRoot.getBoundingClientRect();
    const trigger = root.querySelector('[data-slot="overflow-more-btn"]').getBoundingClientRect();
    return {
      inRoot: true,
      inBody,
      hidden: inRoot.classList.contains('hidden'),
      background: style.backgroundColor,
      borderWidth: style.borderTopWidth,
      width: Math.round(box.width),
      onScreen: box.top >= 0 && box.bottom <= window.innerHeight && box.left >= 0 && box.right <= window.innerWidth,
      gapBelowTrigger: Math.round(box.top - trigger.bottom),
      alignedWithTrigger: Math.round(box.left - trigger.left),
      events: inRoot.querySelectorAll('button').length,
      pageScroll: window.scrollY,
    };
  }, hostId);

test('the all-day overflow popover renders inside the shadow root, styled and over its trigger', async ({ page }) => {
  await page.locator('#week-cal [data-slot="overflow-more-btn"]').click();

  const state = await popoverState(page, 'week-host');
  // Escaping to document.body is the failure this whole spec exists for.
  expect(state.inRoot).toBe(true);
  expect(state.inBody).toBe(false);
  expect(state.hidden).toBe(false);
  // Unstyled, the popover is transparent, borderless and as wide as the page.
  expect(state.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(state.borderWidth).not.toBe('0px');
  expect(state.width).toBeLessThan(400);
  // Positioned by floating-ui at bottom-start with offset(4), not left where it was built.
  expect(state.onScreen).toBe(true);
  expect(state.gapBelowTrigger).toBeLessThanOrEqual(8);
  expect(state.alignedWithTrigger).toBe(0);
  expect(state.events).toBe(5);
  // A popover built outside its component sits at the end of the document, and
  // focusing its list then drags the whole page down to it.
  expect(state.pageScroll).toBe(0);
});

test('the month view overflow popover behaves the same inside a shadow root', async ({ page }) => {
  await page.locator('#month-cal [data-slot="overflow-more-btn"]').click();

  const state = await popoverState(page, 'month-host');
  expect(state.inRoot).toBe(true);
  expect(state.inBody).toBe(false);
  expect(state.hidden).toBe(false);
  expect(state.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(state.width).toBeLessThan(400);
  expect(state.onScreen).toBe(true);
  expect(state.pageScroll).toBe(0);
});

test('the popover moves focus into its list and hands it back on Escape', async ({ page }) => {
  const trigger = page.locator('#week-cal [data-slot="overflow-more-btn"]');
  await trigger.click();

  await expect.poll(() => page.evaluate(() => document.getElementById('week-host').shadowRoot.activeElement?.textContent)).toBe('Off-site 1');

  await page.keyboard.press('Escape');
  const after = await page.evaluate(() => {
    const root = document.getElementById('week-host').shadowRoot;
    return { hidden: root.querySelector('[role="dialog"]').classList.contains('hidden'), focus: root.activeElement?.getAttribute('data-slot') };
  });
  expect(after).toEqual({ hidden: true, focus: 'overflow-more-btn' });
});

// focusTrap looks focus up through shadow roots, since document.activeElement
// stops at the host and every Tab would otherwise look like focus arriving from
// outside the popover.
test('Tab cycles within the popover for a calendar inside a shadow root', async ({ page }) => {
  await page.locator('#month-cal [data-slot="overflow-more-btn"]').click();
  const focused = () =>
    page.evaluate(() => {
      const root = document.getElementById('month-host').shadowRoot;
      const active = root.activeElement;
      return { inside: root.querySelector('[role="dialog"]').contains(active), label: active?.textContent ?? null };
    });

  const stops = [await focused()];
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    stops.push(await focused());
  }
  expect(stops.every((step) => step.inside)).toBe(true);
  expect(stops[5].label).toBe(stops[0].label);
});

// Clicks from inside a shadow tree are retargeted to the host by the time the
// document-level outside-click listener sees them, so a contains() check would
// read every click on the popover as a click outside and close it instantly.
test('clicking an event inside the popover keeps it open, clicking outside closes it', async ({ page }) => {
  await page.locator('#week-cal [data-slot="overflow-more-btn"]').click();
  await page.evaluate(() => {
    window.__clicks = 0;
    document
      .getElementById('week-host')
      .shadowRoot.getElementById('week-cal')
      .addEventListener('event-click', () => window.__clicks++);
  });

  await page.locator('#week-host [role="dialog"] button').nth(1).click();
  expect(await page.evaluate(() => window.__clicks)).toBe(1);
  expect((await popoverState(page, 'week-host')).hidden).toBe(false);

  await page.locator('#outside').click();
  expect((await popoverState(page, 'week-host')).hidden).toBe(true);
});

// The outside-click handler treats the trigger as inside the popover, so without
// a toggle a second click falls through to the handler that opens it again.
test('the trigger toggles the popover shut on a second click', async ({ page }) => {
  const trigger = page.locator('#week-cal [data-slot="overflow-more-btn"]');

  await trigger.click();
  expect((await popoverState(page, 'week-host')).hidden).toBe(false);

  await trigger.click();
  expect((await popoverState(page, 'week-host')).hidden).toBe(true);
  // Focus comes back out of the closed popover, onto the trigger.
  expect(await page.evaluate(() => document.getElementById('week-host').shadowRoot.activeElement?.getAttribute('data-slot'))).toBe('overflow-more-btn');

  await trigger.click();
  expect((await popoverState(page, 'week-host')).hidden).toBe(false);
});
