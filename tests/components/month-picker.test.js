import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 0, y: 0, placement: 'bottom' }),
  autoUpdate: vi.fn().mockReturnValue(() => {}),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
  size: vi.fn(),
}));

import monthPickerPlugin from '../../src/components/month-picker.js';
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
  wrapper._h_monthpicker = {
    state: { expanded: false },
    input,
    controls: 'ctrl-1',
  };
  const popup = document.createElement('div');
  wrapper.appendChild(popup);
  document.body.appendChild(wrapper);
  return { wrapper, popup, input, getHandler: () => inputChangeHandler };
}

function withModel(popup, expression = 'form.month') {
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

describe('h-month-picker', () => {
  it('registers the three month-picker directives', () => {
    const el = createWrapper();
    const { alpine } = mountDirective(monthPickerPlugin, 'h-month-picker', el, { original: 'h-month-picker' });
    expect(alpine._directives['h-month-picker']).toBeDefined();
    expect(alpine._directives['h-month-picker-trigger']).toBeDefined();
    expect(alpine._directives['h-month-picker-popup']).toBeDefined();
  });

  it('throws when the wrapper has no input', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect(() => mountDirective(monthPickerPlugin, 'h-month-picker', el, { original: 'h-month-picker' })).toThrow();
  });

  it('sets data-slot="month-picker" (standalone) and forces the input to type=text', () => {
    const el = createWrapper();
    mountDirective(monthPickerPlugin, 'h-month-picker', el, { original: 'h-month-picker' });
    expect(el.getAttribute('data-slot')).toBe('month-picker');
    expect(el.querySelector('input').getAttribute('type')).toBe('text');
    expect(el.querySelector('input').getAttribute('id')).toBeTruthy();
  });

  it('sets data-slot="cell-input-month" with the table modifier', () => {
    const el = createWrapper();
    mountDirective(monthPickerPlugin, 'h-month-picker', el, { original: 'h-month-picker', modifiers: ['table'] });
    expect(el.getAttribute('data-slot')).toBe('cell-input-month');
  });

  it('lets the input shrink in table mode but not by default', () => {
    const plain = createWrapper();
    mountDirective(monthPickerPlugin, 'h-month-picker', plain, { original: 'h-month-picker' });
    expect(plain.querySelector('input').classList.contains('min-w-0')).toBe(false);

    const table = createWrapper();
    mountDirective(monthPickerPlugin, 'h-month-picker', table, { original: 'h-month-picker', modifiers: ['table'] });
    expect(table.querySelector('input').classList.contains('min-w-0')).toBe(true);
  });

  it('gates the input-to-trigger divider on the table having horizontal borders', () => {
    const plain = createWrapper();
    mountDirective(monthPickerPlugin, 'h-month-picker', plain, { original: 'h-month-picker' });
    expect(plain.querySelector('input').classList.contains('border-r')).toBe(true);

    const table = createWrapper();
    mountDirective(monthPickerPlugin, 'h-month-picker', table, { original: 'h-month-picker', modifiers: ['table'] });
    const input = table.querySelector('input');
    expect(input.classList.contains('border-r')).toBe(false);
    expect(input.classList.contains('[table[data-borders=rows]_&]:border-r')).toBe(true);
    expect(input.classList.contains('[table[data-borders=both]_&]:border-r')).toBe(true);
  });

  it('applies the shared validation frame classes of the date picker', () => {
    const el = createWrapper();
    mountDirective(monthPickerPlugin, 'h-month-picker', el, { original: 'h-month-picker' });
    expect(el.classList.contains('has-[input:user-invalid]:border-negative')).toBe(true);
    expect(el.querySelector('input').classList.contains('user-invalid:border-negative')).toBe(true);
  });
});

describe('h-month-picker-trigger', () => {
  let wrapper;
  let trigger;

  beforeEach(() => {
    wrapper = createWrapper();
    mountDirective(monthPickerPlugin, 'h-month-picker', wrapper, { original: 'h-month-picker' });
    trigger = document.createElement('button');
    trigger.setAttribute('aria-label', 'Choose month');
    wrapper.appendChild(trigger);
  });

  it('sets data-slot + aria-haspopup="dialog"', () => {
    mountDirective(monthPickerPlugin, 'h-month-picker-trigger', trigger, { original: 'h-month-picker-trigger' });
    expect(trigger.getAttribute('data-slot')).toBe('month-picker-trigger');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('throws when not a button', () => {
    const div = document.createElement('div');
    div.setAttribute('aria-label', 'Choose month');
    wrapper.appendChild(div);
    expect(() => mountDirective(monthPickerPlugin, 'h-month-picker-trigger', div, { original: 'h-month-picker-trigger' })).toThrow();
  });

  it('throws without an accessible name', () => {
    const bare = document.createElement('button');
    wrapper.appendChild(bare);
    expect(() => mountDirective(monthPickerPlugin, 'h-month-picker-trigger', bare, { original: 'h-month-picker-trigger' })).toThrow(/aria-label/);
  });

  it('throws when not inside a month picker', () => {
    const orphan = document.createElement('button');
    orphan.setAttribute('aria-label', 'Choose month');
    document.body.appendChild(orphan);
    expect(() => mountDirective(monthPickerPlugin, 'h-month-picker-trigger', orphan, { original: 'h-month-picker-trigger' })).toThrow(/x-h-month-picker/);
  });
});

describe('h-month-picker-popup', () => {
  it('sets role="dialog", data-slot and the popover classes', () => {
    const { popup } = createPopupSetup();
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });
    expect(popup.getAttribute('role')).toBe('dialog');
    expect(popup.getAttribute('data-slot')).toBe('month-picker-calendar');
    expect(popup.classList.contains('absolute')).toBe(true);
    expect(popup.classList.contains('hidden')).toBe(true);
  });

  it('warns and returns early when not inside a month picker', () => {
    const orphan = document.createElement('div');
    document.body.appendChild(orphan);
    const consoleSpy = vi.spyOn(console, 'warn');
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', orphan, { original: 'h-month-picker-popup' });
    expect(consoleSpy).toHaveBeenCalled();
    expect(orphan.querySelector('[role="grid"]')).toBeNull();
    consoleSpy.mockRestore();
  });

  it('renders a labelled table grid of four rows with three month gridcells each', () => {
    const { popup } = createPopupSetup();
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });
    const grid = popup.querySelector('table[role="grid"]');
    expect(grid).not.toBeNull();
    const labelId = grid.getAttribute('aria-labelledby');
    expect(popup.querySelector(`#${labelId}`)).not.toBeNull();
    const rows = grid.querySelectorAll('tr[role="row"]');
    expect(rows.length).toBe(4);
    rows.forEach((row) => expect(row.querySelectorAll('td[role="gridcell"]').length).toBe(3));
    expect(popup.querySelectorAll('[data-month]').length).toBe(12);
  });

  it('Enter or Space on a focused month cell selects it and closes', () => {
    const { wrapper, popup } = createPopupSetup();
    withModel(popup);
    wrapper._h_monthpicker.state.expanded = true;
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });
    const cells = [...popup.querySelectorAll('[data-month]')];

    cells[3].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(popup._x_model.value).toMatch(/^\d{4}-04$/);
    expect(wrapper._h_monthpicker.state.expanded).toBe(false);

    wrapper._h_monthpicker.state.expanded = true;
    cells[8].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(popup._x_model.value).toMatch(/^\d{4}-09$/);
    expect(wrapper._h_monthpicker.state.expanded).toBe(false);
  });

  it('gives exactly one month button the roving tabindex and marks the current month', () => {
    const { popup } = createPopupSetup();
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });
    const focusable = popup.querySelectorAll('[data-month][tabindex="0"]');
    expect(focusable.length).toBe(1);
    const now = new Date();
    expect(focusable[0].dataset.month).toBe(String(now.getMonth()));
    expect(focusable[0].getAttribute('aria-current')).toBe('date');
  });

  it('selecting a month writes a YYYY-MM model value, closes and emits a change', () => {
    const { wrapper, popup, input } = createPopupSetup();
    withModel(popup);
    wrapper._h_monthpicker.state.expanded = true;
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });

    popup.querySelector('[data-month="5"]').click(); // June (0-based)

    expect(popup._x_model.value).toMatch(/^\d{4}-06$/);
    expect(wrapper._h_monthpicker.state.expanded).toBe(false);
    expect(input.value).not.toBe('');
    expect(input.dispatchEvent).toHaveBeenCalled();
    expect(input.dispatchEvent.mock.calls[0][0].type).toBe('change');
  });

  it('clicking the year navigation does not close the popup', () => {
    const wrapper = createWrapper();
    mountDirective(monthPickerPlugin, 'h-month-picker', wrapper, { original: 'h-month-picker' });
    const trigger = document.createElement('button');
    trigger.setAttribute('aria-label', 'Choose month');
    wrapper.appendChild(trigger);
    mountDirective(monthPickerPlugin, 'h-month-picker-trigger', trigger, { original: 'h-month-picker-trigger' });
    const popup = document.createElement('div');
    wrapper.appendChild(popup);
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });

    // Non-bubbling click: the mock Alpine's nextTick is synchronous, so a
    // bubbling click would reach the just-added outside-click dismiss listener
    // and close the popover again within the same dispatch.
    trigger.dispatchEvent(new MouseEvent('click'));
    expect(wrapper._h_monthpicker.state.expanded).toBe(true);

    const yearBefore = popup.querySelector('h2').textContent;
    popup.querySelector('button[aria-label="previous year"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapper._h_monthpicker.state.expanded).toBe(true);
    expect(popup.querySelector('h2').textContent).not.toBe(yearBefore);

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapper._h_monthpicker.state.expanded).toBe(false);
  });

  it('Escape disarms the outside-click dismiss so the popup can reopen', () => {
    const wrapper = createWrapper();
    mountDirective(monthPickerPlugin, 'h-month-picker', wrapper, { original: 'h-month-picker' });
    const trigger = document.createElement('button');
    trigger.setAttribute('aria-label', 'Choose month');
    wrapper.appendChild(trigger);
    mountDirective(monthPickerPlugin, 'h-month-picker-trigger', trigger, { original: 'h-month-picker-trigger' });
    const popup = document.createElement('div');
    wrapper.appendChild(popup);
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });

    trigger.dispatchEvent(new MouseEvent('click'));
    expect(wrapper._h_monthpicker.state.expanded).toBe(true);
    popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(wrapper._h_monthpicker.state.expanded).toBe(false);

    // Reopen: a stale dismiss listener from the first open would close the
    // popup again on the very next document click.
    wrapper._h_monthpicker.state.expanded = true;
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapper._h_monthpicker.state.expanded).toBe(true);
  });

  it('Escape closes the popup', () => {
    const { wrapper, popup } = createPopupSetup();
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });
    wrapper._h_monthpicker.state.expanded = true;
    popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(wrapper._h_monthpicker.state.expanded).toBe(false);
  });

  it('arrow keys move the roving focus through the twelve months', () => {
    const { popup } = createPopupSetup();
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });
    const buttons = [...popup.querySelectorAll('[data-month]')];

    buttons[4].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(buttons[0].getAttribute('tabindex')).toBe('0');

    buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(buttons[1].getAttribute('tabindex')).toBe('0');

    buttons[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(buttons[4].getAttribute('tabindex')).toBe('0');

    buttons[4].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(buttons[11].getAttribute('tabindex')).toBe('0');
  });

  it('ArrowLeft from January wraps to December of the previous year', () => {
    const { popup } = createPopupSetup();
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });
    const buttons = [...popup.querySelectorAll('[data-month]')];
    const yearBefore = popup.querySelector('h2').textContent;

    buttons[4].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));

    expect(buttons[11].getAttribute('tabindex')).toBe('0');
    expect(popup.querySelector('h2').textContent).not.toBe(yearBefore);
  });

  it('PageUp/PageDown move a year keeping the focused month', () => {
    const { popup } = createPopupSetup();
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });
    const buttons = [...popup.querySelectorAll('[data-month]')];
    const yearBefore = popup.querySelector('h2').textContent;

    buttons[4].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));

    expect(buttons[0].getAttribute('tabindex')).toBe('0');
    expect(popup.querySelector('h2').textContent).not.toBe(yearBefore);

    buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));
    expect(popup.querySelector('h2').textContent).toBe(yearBefore);
  });

  it('applies an external model value to the input, selection and view year', () => {
    const { popup, input } = createPopupSetup();
    withModel(popup);
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' }, { evaluateLater: () => (cb) => cb('2025-06') });

    const june = popup.querySelector('[data-month="5"]');
    expect(june.getAttribute('aria-selected')).toBe('true');
    expect(june.getAttribute('tabindex')).toBe('0');
    expect(input.value).not.toBe('');
  });

  it('reports an invalid model value and leaves the selection unchanged', () => {
    const { popup, input } = createPopupSetup();
    withModel(popup);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' }, { evaluateLater: () => (cb) => cb('2025-13') });

    expect(consoleSpy).toHaveBeenCalled();
    expect(input.setCustomValidity).toHaveBeenCalledWith('Input value is not a valid month.');
    expect(popup.querySelector('[aria-selected="true"]')).toBeNull();
    consoleSpy.mockRestore();
  });

  it('parses a typed YYYY-MM value and syncs the model', () => {
    const { popup, input, getHandler } = createPopupSetup();
    withModel(popup);
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });

    input.value = '2025-06';
    getHandler()({ isTrusted: true });

    expect(popup._x_model.value).toBe('2025-06');
    expect(popup.querySelector('[data-month="5"]').getAttribute('aria-selected')).toBe('true');
  });

  it('rejects invalid typed values with a custom validity', () => {
    const { input, popup, getHandler } = createPopupSetup();
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    input.value = '2025-13';
    getHandler()({ isTrusted: true });
    expect(input.setCustomValidity).toHaveBeenCalledWith('Input value is not a valid month.');

    input.value = 'garbage';
    getHandler()({ isTrusted: true });
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    consoleSpy.mockRestore();
  });

  it('ignores non-trusted change events', () => {
    const { input, popup, getHandler } = createPopupSetup();
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    input.value = 'garbage';
    getHandler()({ isTrusted: false });

    expect(consoleSpy).not.toHaveBeenCalled();
    expect(input.setCustomValidity).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('renders localized month names from the configuration', () => {
    const { popup } = createPopupSetup();
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup', expression: "{ locale: 'bg-BG' }" }, { evaluateLater: () => (cb) => cb({ locale: 'bg-BG' }) });
    const expected = new Intl.DateTimeFormat('bg-BG', { month: 'short' }).format(new Date(2020, 0, 1));
    expect(popup.querySelector('[data-month="0"]').textContent).toBe(expected);
  });

  it('nav buttons reuse the button component and the header is initialized as an Alpine tree', () => {
    const { popup } = createPopupSetup();
    const { alpine } = mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });
    const navButtons = [popup.querySelector('button[aria-label="previous year"]'), popup.querySelector('button[aria-label="next year"]')];
    navButtons.forEach((btn) => {
      expect(btn.hasAttribute('x-h-button')).toBe(true);
      expect(btn.getAttribute('data-variant')).toBe('transparent');
      expect(btn.getAttribute('data-size')).toBe('icon');
    });
    expect(alpine.initTree).toHaveBeenCalledWith(navButtons[0].parentElement);
  });

  it('honours the data-aria-prev-year / data-aria-next-year overrides', () => {
    const { popup } = createPopupSetup();
    popup.setAttribute('data-aria-prev-year', 'Predishna godina');
    popup.setAttribute('data-aria-next-year', 'Sledvashta godina');
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });
    expect(popup.querySelector('button[aria-label="Predishna godina"]')).not.toBeNull();
    expect(popup.querySelector('button[aria-label="Sledvashta godina"]')).not.toBeNull();
  });

  it('opening focuses the selected month button', () => {
    // Real wrapper mount so the picker state is reactive and the popover's
    // expanded effect (which runs onOpen) actually fires.
    const wrapper = createWrapper();
    mountDirective(monthPickerPlugin, 'h-month-picker', wrapper, { original: 'h-month-picker' });
    const popup = document.createElement('div');
    wrapper.appendChild(popup);
    withModel(popup);
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' }, { evaluateLater: () => (cb) => cb('2025-06') });

    wrapper._h_monthpicker.state.expanded = true;
    expect(document.activeElement).toBe(popup.querySelector('[data-month="5"]'));
  });

  it('cleanup removes the keyboard and click listeners', () => {
    const { wrapper, popup, getHandler } = createPopupSetup();
    const { ctx } = mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });
    for (const [fn] of ctx.cleanup.mock.calls) fn();

    wrapper._h_monthpicker.state.expanded = true;
    popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(wrapper._h_monthpicker.state.expanded).toBe(true);
    expect(getHandler()).toBeDefined();
    expect(wrapper._h_monthpicker.input.removeEventListener).toHaveBeenCalledWith('change', getHandler());
  });
});
