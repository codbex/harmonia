import { describe, expect, it } from 'vitest';
import sheetPlugin from '../../src/components/sheet.js';
import { mountDirective } from '../test-utils.js';

describe('h-sheet-overlay', () => {
  it('initializes _h_sheet_overlay state', () => {
    const el = document.createElement('div');
    mountDirective(sheetPlugin, 'h-sheet-overlay', el, {
      expression: 'false',
    });
    expect(el._h_sheet_overlay).toBeDefined();
    expect(el._h_sheet_overlay.state).toBeDefined();
  });

  it('applies base classes', () => {
    const el = document.createElement('div');
    mountDirective(sheetPlugin, 'h-sheet-overlay', el, {
      expression: 'false',
    });
    expect(el.classList.contains('hidden')).toBe(true);
    expect(el.classList.contains('fixed')).toBe(true);
    expect(el.classList.contains('inset-0')).toBe(true);
    expect(el.classList.contains('z-50')).toBe(true);
    expect(el.classList.contains('bg-black/50')).toBe(true);
  });

  it('sets tabindex and data-slot attributes', () => {
    const el = document.createElement('div');
    mountDirective(sheetPlugin, 'h-sheet-overlay', el, {
      expression: 'false',
    });
    expect(el.getAttribute('tabindex')).toBe('-1');
    expect(el.getAttribute('data-slot')).toBe('sheet-overlay');
  });

  it('calls cleanup', () => {
    const el = document.createElement('div');
    const { ctx } = mountDirective(sheetPlugin, 'h-sheet-overlay', el, {
      expression: 'false',
    });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-sheet', () => {
  function createSheetSetup(side = 'bottom') {
    const container = document.createElement('div');
    const overlay = document.createElement('div');
    overlay._h_sheet_overlay = {
      state: { open: false },
    };
    const sheet = document.createElement('div');
    if (side) sheet.setAttribute('data-align', side);
    overlay.appendChild(sheet);
    container.appendChild(overlay);
    document.body.appendChild(container);
    return { container, overlay, sheet };
  }

  it('applies base classes', () => {
    const { sheet } = createSheetSetup();
    mountDirective(sheetPlugin, 'h-sheet', sheet, { original: 'x-h-sheet' });
    expect(sheet.classList.contains('hidden')).toBe(true);
    expect(sheet.classList.contains('bg-background')).toBe(true);
    expect(sheet.classList.contains('fixed')).toBe(true);
    expect(sheet.classList.contains('shadow-lg')).toBe(true);
  });

  it('sets data-slot attribute', () => {
    const { sheet } = createSheetSetup();
    mountDirective(sheetPlugin, 'h-sheet', sheet, { original: 'x-h-sheet' });
    expect(sheet.getAttribute('data-slot')).toBe('sheet');
  });

  it('applies bottom side classes by default', () => {
    const { sheet } = createSheetSetup('bottom');
    mountDirective(sheetPlugin, 'h-sheet', sheet, { original: 'x-h-sheet' });
    expect(sheet.classList.contains('inset-x-0')).toBe(true);
    expect(sheet.classList.contains('bottom-0')).toBe(true);
  });

  it('applies right side classes', () => {
    const { sheet } = createSheetSetup('right');
    mountDirective(sheetPlugin, 'h-sheet', sheet, { original: 'x-h-sheet' });
    expect(sheet.classList.contains('inset-y-0')).toBe(true);
    expect(sheet.classList.contains('right-0')).toBe(true);
  });

  it('applies left side classes', () => {
    const { sheet } = createSheetSetup('left');
    mountDirective(sheetPlugin, 'h-sheet', sheet, { original: 'x-h-sheet' });
    expect(sheet.classList.contains('inset-y-0')).toBe(true);
    expect(sheet.classList.contains('left-0')).toBe(true);
  });

  it('applies top side classes', () => {
    const { sheet } = createSheetSetup('top');
    mountDirective(sheetPlugin, 'h-sheet', sheet, { original: 'x-h-sheet' });
    expect(sheet.classList.contains('inset-x-0')).toBe(true);
    expect(sheet.classList.contains('top-0')).toBe(true);
  });

  it('throws if not placed inside sheet overlay', () => {
    const el = document.createElement('div');
    expect(() => mountDirective(sheetPlugin, 'h-sheet', el, { original: 'x-h-sheet' })).toThrow();
  });

  it('calls cleanup', () => {
    const { sheet } = createSheetSetup();
    const { ctx } = mountDirective(sheetPlugin, 'h-sheet', sheet, { original: 'x-h-sheet' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});
