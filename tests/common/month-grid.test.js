import { describe, expect, it, vi } from 'vitest';
import { createMonthGrid, monthGridCellClasses, monthGridStep } from '../../src/common/month-grid';

describe('createMonthGrid', () => {
  it('builds a 4x3 grid of month cells', () => {
    const { table, cells } = createMonthGrid({ onPick: () => {} });
    expect(table.getAttribute('role')).toBe('grid');
    expect(table.querySelectorAll('tr[role="row"]').length).toBe(4);
    expect(cells.length).toBe(12);
    cells.forEach((cell, m) => {
      expect(cell.getAttribute('role')).toBe('gridcell');
      expect(cell.getAttribute('data-month')).toBe(String(m));
      expect(cell.getAttribute('tabindex')).toBe('-1');
      monthGridCellClasses.forEach((cls) => expect(cell.classList.contains(cls)).toBe(true));
    });
  });

  it('renders text, labels and state', () => {
    const { cells, render } = createMonthGrid({ onPick: () => {} });
    const now = new Date();
    render({ year: now.getFullYear(), locale: 'en-US', selectedMonth: 2, focusedMonth: 4, isDisabled: (m) => m === 0 });
    expect(cells[8].textContent).toBe('Sep');
    expect(cells[8].getAttribute('aria-label')).toBe(`September ${now.getFullYear()}`);
    expect(cells[2].getAttribute('aria-selected')).toBe('true');
    expect(cells[3].hasAttribute('aria-selected')).toBe(false);
    expect(cells[4].getAttribute('tabindex')).toBe('0');
    expect(cells.filter((c) => c.getAttribute('tabindex') === '0').length).toBe(1);
    expect(cells[now.getMonth()].getAttribute('aria-current')).toBe('date');
    expect(cells[0].getAttribute('aria-disabled')).toBe('true');
    expect(cells[1].hasAttribute('aria-disabled')).toBe(false);
  });

  it('clears state it no longer applies on the next render', () => {
    const { cells, render } = createMonthGrid({ onPick: () => {} });
    const now = new Date();
    render({ year: now.getFullYear(), locale: 'en-US', selectedMonth: 2, focusedMonth: 2, isDisabled: () => true });
    render({ year: now.getFullYear() + 1, locale: 'en-US', selectedMonth: null, focusedMonth: 0 });
    expect(cells.some((c) => c.hasAttribute('aria-selected'))).toBe(false);
    expect(cells.some((c) => c.hasAttribute('aria-current'))).toBe(false);
    expect(cells.some((c) => c.hasAttribute('aria-disabled'))).toBe(false);
  });

  it('calls onPick for a clicked cell, but not for a disabled one', () => {
    const onPick = vi.fn();
    const { cells, render } = createMonthGrid({ onPick });
    render({ year: 2026, locale: 'en-US', selectedMonth: null, focusedMonth: 0, isDisabled: (m) => m === 1 });
    cells[5].click();
    cells[1].click();
    expect(onPick).toHaveBeenCalledTimes(1);
    expect(onPick).toHaveBeenCalledWith(5);
  });

  it('stops clicks anywhere in the table only when asked to', () => {
    const outside = vi.fn();
    document.body.addEventListener('click', outside);
    const stopping = createMonthGrid({ onPick: () => {}, stopPropagation: true });
    const bubbling = createMonthGrid({ onPick: () => {} });
    document.body.append(stopping.table, bubbling.table);
    stopping.table.querySelector('tr').click();
    expect(outside).not.toHaveBeenCalled();
    bubbling.table.querySelector('tr').click();
    expect(outside).toHaveBeenCalledTimes(1);
    document.body.removeEventListener('click', outside);
    stopping.table.remove();
    bubbling.table.remove();
  });

  it('removes its click listener on destroy', () => {
    const onPick = vi.fn();
    const { cells, destroy } = createMonthGrid({ onPick });
    destroy();
    cells[0].click();
    expect(onPick).not.toHaveBeenCalled();
  });
});

describe('monthGridStep', () => {
  it('moves by one and by a row', () => {
    expect(monthGridStep(4, 'ArrowLeft')).toEqual({ index: 3, yearDelta: 0 });
    expect(monthGridStep(4, 'ArrowRight')).toEqual({ index: 5, yearDelta: 0 });
    expect(monthGridStep(4, 'ArrowUp')).toEqual({ index: 1, yearDelta: 0 });
    expect(monthGridStep(4, 'ArrowDown')).toEqual({ index: 7, yearDelta: 0 });
  });

  it('crosses into the previous and next year', () => {
    expect(monthGridStep(0, 'ArrowLeft')).toEqual({ index: 11, yearDelta: -1 });
    expect(monthGridStep(11, 'ArrowRight')).toEqual({ index: 0, yearDelta: 1 });
    expect(monthGridStep(1, 'ArrowUp')).toEqual({ index: 10, yearDelta: -1 });
    expect(monthGridStep(10, 'ArrowDown')).toEqual({ index: 1, yearDelta: 1 });
  });

  it('jumps to the ends and pages by year', () => {
    expect(monthGridStep(6, 'Home')).toEqual({ index: 0, yearDelta: 0 });
    expect(monthGridStep(6, 'End')).toEqual({ index: 11, yearDelta: 0 });
    expect(monthGridStep(6, 'PageUp')).toEqual({ index: 6, yearDelta: -1 });
    expect(monthGridStep(6, 'PageDown')).toEqual({ index: 6, yearDelta: 1 });
  });

  it('returns null for other keys', () => {
    expect(monthGridStep(6, 'Enter')).toBeNull();
    expect(monthGridStep(6, 'a')).toBeNull();
  });
});
