import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 0, y: 0, placement: 'bottom' }),
  autoUpdate: vi.fn().mockReturnValue(() => {}),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
  size: vi.fn(),
}));

import weekPickerPlugin from '../../src/components/week-picker.js';
import { resolveLocale } from '../../src/utils/language.js';
import { mountDirective } from '../test-utils.js';

function createWrapper() {
  const el = document.createElement('div');
  const input = document.createElement('input');
  el.appendChild(input);
  document.body.appendChild(el);
  return el;
}

// Popup mounted on a hand-built picker state with a fabricated input, so the
// input's change handler and setCustomValidity calls can be asserted directly
// (mirrors the date-picker popup tests).
function createPopupSetup() {
  const wrapper = document.createElement('div');
  let inputChangeHandler;
  const input = {
    addEventListener: vi.fn((event, handler) => {
      if (event === 'change') inputChangeHandler = handler;
    }),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    value: '',
    setCustomValidity: vi.fn(),
  };
  wrapper._h_weekpicker = {
    state: { expanded: false },
    input,
    controls: 'ctrl-1',
  };
  const popup = document.createElement('div');
  wrapper.appendChild(popup);
  document.body.appendChild(wrapper);
  return { wrapper, popup, input, getHandler: () => inputChangeHandler };
}

function withModel(popup, expression = 'form.week') {
  popup._x_model = {
    value: '',
    get() {
      return this.value;
    },
    set(v) {
      this.value = v;
    },
  };
  popup.setAttribute('x-model', expression);
}

function bodyRows(popup) {
  return [...popup.querySelectorAll('[role="row"]')].filter((row) => row.hasAttribute('data-week'));
}

describe('h-week-picker', () => {
  it('registers the three week-picker directives', () => {
    const el = createWrapper();
    const { alpine } = mountDirective(weekPickerPlugin, 'h-week-picker', el, { original: 'h-week-picker' });
    expect(alpine._directives['h-week-picker']).toBeDefined();
    expect(alpine._directives['h-week-picker-trigger']).toBeDefined();
    expect(alpine._directives['h-week-picker-popup']).toBeDefined();
  });

  it('throws when the wrapper has no input', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect(() => mountDirective(weekPickerPlugin, 'h-week-picker', el, { original: 'h-week-picker' })).toThrow();
  });

  it('sets data-slot="week-picker" (standalone) and forces the input to type=text', () => {
    const el = createWrapper();
    mountDirective(weekPickerPlugin, 'h-week-picker', el, { original: 'h-week-picker' });
    expect(el.getAttribute('data-slot')).toBe('week-picker');
    expect(el.querySelector('input').getAttribute('type')).toBe('text');
  });

  it('sets data-slot="cell-input-week" with the table modifier', () => {
    const el = createWrapper();
    mountDirective(weekPickerPlugin, 'h-week-picker', el, { original: 'h-week-picker', modifiers: ['table'] });
    expect(el.getAttribute('data-slot')).toBe('cell-input-week');
  });

  it('lets the input shrink in table mode but not by default', () => {
    const plain = createWrapper();
    mountDirective(weekPickerPlugin, 'h-week-picker', plain, { original: 'h-week-picker' });
    expect(plain.querySelector('input').classList.contains('min-w-0')).toBe(false);

    const table = createWrapper();
    mountDirective(weekPickerPlugin, 'h-week-picker', table, { original: 'h-week-picker', modifiers: ['table'] });
    expect(table.querySelector('input').classList.contains('min-w-0')).toBe(true);
  });

  it('gates the input-to-trigger divider on the table having horizontal borders', () => {
    const plain = createWrapper();
    mountDirective(weekPickerPlugin, 'h-week-picker', plain, { original: 'h-week-picker' });
    expect(plain.querySelector('input').classList.contains('border-r')).toBe(true);

    const table = createWrapper();
    mountDirective(weekPickerPlugin, 'h-week-picker', table, { original: 'h-week-picker', modifiers: ['table'] });
    const input = table.querySelector('input');
    expect(input.classList.contains('border-r')).toBe(false);
    expect(input.classList.contains('[table[data-borders=rows]_&]:border-r')).toBe(true);
    expect(input.classList.contains('[table[data-borders=both]_&]:border-r')).toBe(true);
  });

  it('applies the shared validation frame classes of the date picker', () => {
    const el = createWrapper();
    mountDirective(weekPickerPlugin, 'h-week-picker', el, { original: 'h-week-picker' });
    expect(el.classList.contains('has-[input:user-invalid]:border-negative')).toBe(true);
    expect(el.querySelector('input').classList.contains('user-invalid:border-negative')).toBe(true);
  });
});

describe('h-week-picker-trigger', () => {
  let wrapper;
  let trigger;

  beforeEach(() => {
    wrapper = createWrapper();
    mountDirective(weekPickerPlugin, 'h-week-picker', wrapper, { original: 'h-week-picker' });
    trigger = document.createElement('button');
    trigger.setAttribute('aria-label', 'Choose week');
    wrapper.appendChild(trigger);
  });

  it('sets data-slot + aria-haspopup="dialog"', () => {
    mountDirective(weekPickerPlugin, 'h-week-picker-trigger', trigger, { original: 'h-week-picker-trigger' });
    expect(trigger.getAttribute('data-slot')).toBe('week-picker-trigger');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('throws without an accessible name', () => {
    const bare = document.createElement('button');
    wrapper.appendChild(bare);
    expect(() => mountDirective(weekPickerPlugin, 'h-week-picker-trigger', bare, { original: 'h-week-picker-trigger' })).toThrow(/aria-label/);
  });

  it('throws when not inside a week picker', () => {
    const orphan = document.createElement('button');
    orphan.setAttribute('aria-label', 'Choose week');
    document.body.appendChild(orphan);
    expect(() => mountDirective(weekPickerPlugin, 'h-week-picker-trigger', orphan, { original: 'h-week-picker-trigger' })).toThrow(/x-h-week-picker/);
  });
});

describe('h-week-picker-popup', () => {
  it('sets role="dialog", data-slot and the popover classes', () => {
    const { popup } = createPopupSetup();
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });
    expect(popup.getAttribute('role')).toBe('dialog');
    expect(popup.getAttribute('data-slot')).toBe('week-picker-calendar');
    expect(popup.classList.contains('absolute')).toBe(true);
    expect(popup.classList.contains('hidden')).toBe(true);
  });

  it('warns and returns early when not inside a week picker', () => {
    const orphan = document.createElement('div');
    document.body.appendChild(orphan);
    const consoleSpy = vi.spyOn(console, 'warn');
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', orphan, { original: 'h-week-picker-popup' });
    expect(consoleSpy).toHaveBeenCalled();
    expect(orphan.querySelector('[role="grid"]')).toBeNull();
    consoleSpy.mockRestore();
  });

  it('renders a labelled table grid: a header row of columnheaders plus six week rows', () => {
    const { popup } = createPopupSetup();
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });
    const grid = popup.querySelector('table[role="grid"]');
    expect(grid).not.toBeNull();
    const labelId = grid.getAttribute('aria-labelledby');
    expect(popup.querySelector(`#${labelId}`)).not.toBeNull();

    const headers = grid.querySelectorAll('thead th[role="columnheader"]');
    expect(headers.length).toBe(8);
    expect(headers[0].textContent).toBe('#');
    expect(headers[0].getAttribute('aria-label')).toBe('Week number');
    expect(headers[1].getAttribute('aria-label')).toBeTruthy();

    const weeks = bodyRows(popup);
    expect(weeks.length).toBe(6);
    weeks.forEach((row) => {
      expect(row.tagName).toBe('TR');
      expect(row.querySelectorAll('th[role="rowheader"]').length).toBe(1);
      expect(row.querySelectorAll('td[role="gridcell"]').length).toBe(7);
      expect(row.getAttribute('aria-label')).toMatch(/^Week \d+, \d{4}$/);
    });
  });

  it('gives exactly one week row the roving tabindex and marks the current week', () => {
    const { popup } = createPopupSetup();
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });
    const focusable = bodyRows(popup).filter((row) => row.getAttribute('tabindex') === '0');
    expect(focusable.length).toBe(1);
    expect(focusable[0].getAttribute('aria-current')).toBe('date');
  });

  it('selecting a week writes a YYYY-Www model value, closes and emits a change', () => {
    const { wrapper, popup, input } = createPopupSetup();
    withModel(popup);
    wrapper._h_weekpicker.state.expanded = true;
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });

    bodyRows(popup)[0].click();

    expect(popup._x_model.value).toMatch(/^\d{4}-W\d{2}$/);
    expect(wrapper._h_weekpicker.state.expanded).toBe(false);
    expect(input.value).toMatch(/^Week \d+, \d{4}$/);
    expect(input.dispatchEvent).toHaveBeenCalled();
    expect(input.dispatchEvent.mock.calls[0][0].type).toBe('change');
  });

  it('a click on a day cell selects the whole week (event delegation to the row)', () => {
    const { popup } = createPopupSetup();
    withModel(popup);
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });

    const row = bodyRows(popup)[2];
    row.querySelector('[role="gridcell"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(popup._x_model.value).toBe(`${row.dataset.year}-W${row.dataset.week.padStart(2, '0')}`);
    expect(row.getAttribute('aria-selected')).toBe('true');
  });

  it('clicking the month navigation does not close the popup', () => {
    const wrapper = createWrapper();
    mountDirective(weekPickerPlugin, 'h-week-picker', wrapper, { original: 'h-week-picker' });
    const trigger = document.createElement('button');
    trigger.setAttribute('aria-label', 'Choose week');
    wrapper.appendChild(trigger);
    mountDirective(weekPickerPlugin, 'h-week-picker-trigger', trigger, { original: 'h-week-picker-trigger' });
    const popup = document.createElement('div');
    wrapper.appendChild(popup);
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });

    // Non-bubbling click: the mock Alpine's nextTick is synchronous, so a
    // bubbling click would reach the just-added outside-click dismiss listener
    // and close the popover again within the same dispatch.
    trigger.dispatchEvent(new MouseEvent('click'));
    expect(wrapper._h_weekpicker.state.expanded).toBe(true);

    const labelBefore = popup.querySelector('h2').textContent;
    popup.querySelector('button[aria-label="previous month"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapper._h_weekpicker.state.expanded).toBe(true);
    expect(popup.querySelector('h2').textContent).not.toBe(labelBefore);

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapper._h_weekpicker.state.expanded).toBe(false);
  });

  it('Escape disarms the outside-click dismiss so the popup can reopen', () => {
    const wrapper = createWrapper();
    mountDirective(weekPickerPlugin, 'h-week-picker', wrapper, { original: 'h-week-picker' });
    const trigger = document.createElement('button');
    trigger.setAttribute('aria-label', 'Choose week');
    wrapper.appendChild(trigger);
    mountDirective(weekPickerPlugin, 'h-week-picker-trigger', trigger, { original: 'h-week-picker-trigger' });
    const popup = document.createElement('div');
    wrapper.appendChild(popup);
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });

    trigger.dispatchEvent(new MouseEvent('click'));
    expect(wrapper._h_weekpicker.state.expanded).toBe(true);
    popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(wrapper._h_weekpicker.state.expanded).toBe(false);

    // Reopen: a stale dismiss listener from the first open would close the
    // popup again on the very next document click.
    wrapper._h_weekpicker.state.expanded = true;
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapper._h_weekpicker.state.expanded).toBe(true);
  });

  it('Escape closes the popup', () => {
    const { wrapper, popup } = createPopupSetup();
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });
    wrapper._h_weekpicker.state.expanded = true;
    popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(wrapper._h_weekpicker.state.expanded).toBe(false);
  });

  it('ArrowUp/ArrowDown move the roving focus a week at a time', () => {
    const { popup } = createPopupSetup();
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });
    const rows = bodyRows(popup);
    const start = rows.findIndex((row) => row.getAttribute('tabindex') === '0');

    rows[start].dispatchEvent(new KeyboardEvent('keydown', { key: start < 5 ? 'ArrowDown' : 'ArrowUp', bubbles: true }));

    const next = bodyRows(popup).findIndex((row) => row.getAttribute('tabindex') === '0');
    expect(next).toBe(start < 5 ? start + 1 : start - 1);
  });

  it('ArrowUp from the first row moves the visible month back', () => {
    const { popup } = createPopupSetup();
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });
    const labelBefore = popup.querySelector('h2').textContent;
    const first = bodyRows(popup)[0];

    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    bodyRows(popup)[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

    expect(popup.querySelector('h2').textContent).not.toBe(labelBefore);
    expect(bodyRows(popup).some((row) => row.getAttribute('tabindex') === '0')).toBe(true);
  });

  it('PageDown moves the visible month forward keeping a focused week', () => {
    const { popup } = createPopupSetup();
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });
    const labelBefore = popup.querySelector('h2').textContent;
    const focused = bodyRows(popup).find((row) => row.getAttribute('tabindex') === '0');

    focused.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));

    expect(popup.querySelector('h2').textContent).not.toBe(labelBefore);
    expect(bodyRows(popup).filter((row) => row.getAttribute('tabindex') === '0').length).toBe(1);
  });

  it('Enter on a focused week row selects it and closes the popup', () => {
    const { wrapper, popup } = createPopupSetup();
    withModel(popup);
    wrapper._h_weekpicker.state.expanded = true;
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });

    const row = bodyRows(popup)[1];
    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(popup._x_model.value).toBe(`${row.dataset.year}-W${row.dataset.week.padStart(2, '0')}`);
    expect(wrapper._h_weekpicker.state.expanded).toBe(false);
  });

  it('applies an external model value: selection, view month and input display', () => {
    const { popup, input } = createPopupSetup();
    withModel(popup);
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' }, { evaluateLater: () => (cb) => cb('2025-W01') });

    // Week 1 of 2025 starts on Monday 2024-12-30, so the view shows December 2024.
    const expectedLabel = new Intl.DateTimeFormat(resolveLocale(), { month: 'long', year: 'numeric' }).format(new Date(2024, 11, 30));
    expect(popup.querySelector('h2').textContent).toBe(expectedLabel);
    const selected = bodyRows(popup).find((row) => row.getAttribute('aria-selected') === 'true');
    expect(selected.dataset.year).toBe('2025');
    expect(selected.dataset.week).toBe('1');
    expect(input.value).toBe('Week 1, 2025');
  });

  it('reports an invalid model value and leaves the selection unchanged', () => {
    const { popup, input } = createPopupSetup();
    withModel(popup);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' }, { evaluateLater: () => (cb) => cb('2025-W99') });

    expect(consoleSpy).toHaveBeenCalled();
    expect(input.setCustomValidity).toHaveBeenCalledWith('Input value is not a valid week.');
    expect(popup.querySelector('[aria-selected="true"]')).toBeNull();
    consoleSpy.mockRestore();
  });

  it('parses typed values in both the model and the display format', () => {
    const { popup, input, getHandler } = createPopupSetup();
    withModel(popup);
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });

    input.value = '2025-W24';
    getHandler()({ isTrusted: true });
    expect(popup._x_model.value).toBe('2025-W24');

    input.value = 'Week 30, 2025';
    getHandler()({ isTrusted: true });
    expect(popup._x_model.value).toBe('2025-W30');
  });

  it('rejects invalid typed values with a custom validity', () => {
    const { popup, input, getHandler } = createPopupSetup();
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    input.value = '2025-W60';
    getHandler()({ isTrusted: true });
    expect(input.setCustomValidity).toHaveBeenCalledWith('Input value is not a valid week.');

    input.value = 'garbage';
    getHandler()({ isTrusted: true });
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    consoleSpy.mockRestore();
  });

  it('ignores non-trusted change events', () => {
    const { popup, input, getHandler } = createPopupSetup();
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    input.value = 'garbage';
    getHandler()({ isTrusted: false });

    expect(consoleSpy).not.toHaveBeenCalled();
    expect(input.setCustomValidity).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('honours data-week-label for the display value, row labels and typed input', () => {
    const { popup, input, getHandler } = createPopupSetup();
    withModel(popup);
    popup.setAttribute('data-week-label', 'KW');
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });

    expect(bodyRows(popup)[0].getAttribute('aria-label')).toMatch(/^KW \d+, \d{4}$/);

    bodyRows(popup)[0].click();
    expect(input.value).toMatch(/^KW \d+, \d{4}$/);

    input.value = 'KW 24, 2025';
    getHandler()({ isTrusted: true });
    expect(popup._x_model.value).toBe('2025-W24');
  });

  it('honours data-week-column-label for the week number column header', () => {
    const { popup } = createPopupSetup();
    popup.setAttribute('data-week-column-label', 'Kalenderwoche');
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });
    expect(popup.querySelector('[role="columnheader"]').getAttribute('aria-label')).toBe('Kalenderwoche');
  });

  it('nav buttons reuse the button component and the header is initialized as an Alpine tree', () => {
    const { popup } = createPopupSetup();
    const { alpine } = mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });
    const navButtons = [popup.querySelector('button[aria-label="previous month"]'), popup.querySelector('button[aria-label="next month"]')];
    navButtons.forEach((btn) => {
      expect(btn.hasAttribute('x-h-button')).toBe(true);
      expect(btn.getAttribute('data-variant')).toBe('transparent');
      expect(btn.getAttribute('data-size')).toBe('icon');
    });
    expect(alpine.initTree).toHaveBeenCalledWith(navButtons[0].parentElement);
  });

  it('honours the data-aria-prev-month / data-aria-next-month overrides', () => {
    const { popup } = createPopupSetup();
    popup.setAttribute('data-aria-prev-month', 'Predishen mesets');
    popup.setAttribute('data-aria-next-month', 'Sledvasht mesets');
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });
    expect(popup.querySelector('button[aria-label="Predishen mesets"]')).not.toBeNull();
    expect(popup.querySelector('button[aria-label="Sledvasht mesets"]')).not.toBeNull();
  });

  it('renders localized weekday names from the configuration (Monday-first)', () => {
    const { popup } = createPopupSetup();
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup', expression: "{ locale: 'bg-BG' }" }, { evaluateLater: () => (cb) => cb({ locale: 'bg-BG' }) });
    // 2020-06-01 is a Monday.
    const expected = new Intl.DateTimeFormat('bg-BG', { weekday: 'short' }).format(new Date(2020, 5, 1));
    expect(popup.querySelectorAll('[role="columnheader"]')[1].textContent).toBe(expected);
  });

  it('opening focuses the selected week row', () => {
    // Real wrapper mount so the picker state is reactive and the popover's
    // expanded effect (which runs onOpen) actually fires.
    const wrapper = createWrapper();
    mountDirective(weekPickerPlugin, 'h-week-picker', wrapper, { original: 'h-week-picker' });
    const popup = document.createElement('div');
    wrapper.appendChild(popup);
    withModel(popup);
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' }, { evaluateLater: () => (cb) => cb('2025-W24') });

    wrapper._h_weekpicker.state.expanded = true;
    const selected = bodyRows(popup).find((row) => row.getAttribute('aria-selected') === 'true');
    expect(document.activeElement).toBe(selected);
  });

  it('cleanup removes the keyboard and click listeners', () => {
    const { wrapper, popup, getHandler } = createPopupSetup();
    withModel(popup);
    const { ctx } = mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });
    for (const [fn] of ctx.cleanup.mock.calls) fn();

    wrapper._h_weekpicker.state.expanded = true;
    popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(wrapper._h_weekpicker.state.expanded).toBe(true);

    bodyRows(popup)[0].click();
    expect(popup._x_model.value).toBe('');
    expect(wrapper._h_weekpicker.input.removeEventListener).toHaveBeenCalledWith('change', getHandler());
  });
});
