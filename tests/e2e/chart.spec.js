import { expect, test } from '@playwright/test';
import { gotoFixture, settle } from './helpers.js';

// A series is painted with a `fill-chart-N` class that reads the
// `--chart-color-N` theme variable. Whether the rendered color really follows
// the variable is real CSS, which the unit suite cannot see.
const barFill = (page, seriesIndex) =>
  page.evaluate((i) => {
    const bars = document.querySelectorAll('#bar [data-slot=chart-bar]');
    return getComputedStyle(bars[i]).fill;
  }, seriesIndex);

// The computed fill of an SVG probe painted straight from the variable, so it
// serializes exactly like a bar's computed fill.
const variableFill = (page, name) =>
  page.evaluate((n) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.style.fill = `var(${n})`;
    svg.appendChild(rect);
    document.body.appendChild(svg);
    const fill = getComputedStyle(rect).fill;
    svg.remove();
    return fill;
  }, name);

test.beforeEach(async ({ page }) => {
  await gotoFixture(page, 'chart');
  await page.waitForSelector('#bar [data-slot=chart-bar]', { state: 'attached' });
  await settle(page);
});

test('series without a color paint with the chart color variables', async ({ page }) => {
  expect(await barFill(page, 0)).toBe(await variableFill(page, '--chart-color-1'));
  expect(await barFill(page, 1)).toBe(await variableFill(page, '--chart-color-2'));
});

test('overriding a chart color variable recolors the chart without a re-render', async ({ page }) => {
  const green = await barFill(page, 2);
  await page.evaluate(() => document.documentElement.style.setProperty('--chart-color-1', 'rgb(1, 2, 3)'));
  await settle(page);
  expect(await barFill(page, 0)).toBe('rgb(1, 2, 3)');
  // A deprecated standard color name keeps its fixed color.
  expect(await barFill(page, 2)).toBe(green);
});
