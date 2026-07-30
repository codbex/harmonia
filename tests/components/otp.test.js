import { afterEach, describe, expect, it, vi } from 'vitest';
import otpPlugin from '../../src/components/otp.js';
import { mountDirective } from '../test-utils.js';

// Mounts a root, then its groups and separators in DOM order, mirroring how
// Alpine walks the tree. Cells register with the root as each group initialises.
function build({ groups = [6], attrs = {}, inputAttrs = {}, separators = true, model } = {}) {
  const el = document.createElement('div');
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  const input = document.createElement('input');
  input.type = 'text';
  for (const [k, v] of Object.entries(inputAttrs)) input.setAttribute(k, v);
  if (model) {
    Object.defineProperty(input, '_x_model', { value: model, configurable: true });
  }
  el.appendChild(input);
  document.body.appendChild(el);

  const groupEls = [];
  const separatorEls = [];
  groups.forEach((length, i) => {
    if (i > 0 && separators) {
      const sep = document.createElement('div');
      sep.textContent = '-';
      el.appendChild(sep);
      separatorEls.push(sep);
    }
    const group = document.createElement('div');
    group.setAttribute('data-length', String(length));
    el.appendChild(group);
    groupEls.push(group);
  });

  const mounted = mountDirective(otpPlugin, 'h-otp', el, { original: 'x-h-otp' });
  for (const sep of separatorEls) mountDirective(otpPlugin, 'h-otp-separator', sep, { original: 'x-h-otp-separator' });
  for (const group of groupEls) mountDirective(otpPlugin, 'h-otp-group', group, { original: 'x-h-otp-group' });

  return { el, input, groupEls, separatorEls, ...mounted };
}

const cells = (el) => Array.from(el.querySelectorAll('[data-slot="otp-cell"]'));
const values = (el) => cells(el).map((c) => c.value);
const key = (cell, k) => cell.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));

function paste(target, text) {
  const event = new Event('paste', { bubbles: true, cancelable: true });
  event.clipboardData = { getData: () => text };
  target.dispatchEvent(event);
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

afterEach(() => {
  document.body.innerHTML = '';
});

describe('otp', () => {
  it('registers the directives', () => {
    const { alpine } = build();
    expect(alpine._directives['h-otp']).toBeDefined();
    expect(alpine._directives['h-otp-group']).toBeDefined();
    expect(alpine._directives['h-otp-separator']).toBeDefined();
  });

  it('throws without a native input child', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect(() => mountDirective(otpPlugin, 'h-otp', el, { original: 'x-h-otp' })).toThrow();
  });

  it('throws when a group or separator is outside a root', () => {
    const orphanGroup = document.createElement('div');
    document.body.appendChild(orphanGroup);
    expect(() => mountDirective(otpPlugin, 'h-otp-group', orphanGroup, { original: 'x-h-otp-group' })).toThrow();

    const orphanSeparator = document.createElement('div');
    document.body.appendChild(orphanSeparator);
    expect(() => mountDirective(otpPlugin, 'h-otp-separator', orphanSeparator, { original: 'x-h-otp-separator' })).toThrow();
  });

  it('generates one box per group and hides the native input', () => {
    const { el, input } = build({ groups: [3, 3] });
    expect(el.querySelectorAll('[data-slot="otp-group"]').length).toBe(2);
    expect(cells(el).length).toBe(6);
    expect(el.querySelectorAll('[data-slot="otp-separator"]').length).toBe(1);
    expect(el.getAttribute('role')).toBe('group');
    expect(input.getAttribute('aria-hidden')).toBe('true');
    expect(input.getAttribute('tabindex')).toBe('-1');
    // Not display:none, so a failed submit can still focus it.
    expect(input.classList.contains('hidden')).toBe(false);
  });

  it('uses a default accessible name unless one is provided', () => {
    const { el } = build();
    expect(el.getAttribute('role')).toBe('group');
    expect(el.getAttribute('aria-label')).toBe('One-time password');

    const { el: labelled } = build({ attrs: { 'aria-label': 'PIN' } });
    expect(labelled.getAttribute('aria-label')).toBe('PIN');

    const { el: referenced } = build({ attrs: { 'aria-labelledby': 'heading-id' } });
    expect(referenced.hasAttribute('aria-label')).toBe(false);
  });

  it('puts the border on the group, not the cells', () => {
    const { el, groupEls } = build({ groups: [3] });
    expect(groupEls[0].classList.contains('border')).toBe(true);
    expect(groupEls[0].classList.contains('rounded-control')).toBe(true);
    expect(groupEls[0].classList.contains('shadow-input')).toBe(true);
    for (const cell of cells(el)) {
      expect(cell.classList.contains('border-0')).toBe(true);
      expect(cell.classList.contains('rounded-none')).toBe(true);
      expect(cell.classList.contains('bg-transparent')).toBe(true);
      expect(cell.classList.contains('shadow-none')).toBe(true);
      // The overflow bug: cells must never carry a fixed square size.
      expect(cell.classList.contains('size-10')).toBe(false);
      expect(cell.classList.contains('h-full')).toBe(true);
    }
    // First cell has no left divider, the rest do.
    expect(cells(el)[0].classList.contains('first:border-l-0')).toBe(true);
  });

  it('sizes the groups from the root and reacts to a runtime change', async () => {
    const { el, groupEls } = build({ groups: [3, 3] });
    expect(groupEls.every((g) => g.classList.contains('h-9'))).toBe(true);
    expect(cells(el).every((c) => c.classList.contains('w-9'))).toBe(true);

    el.setAttribute('data-size', 'sm');
    await flush();
    expect(groupEls.every((g) => g.classList.contains('h-6.5'))).toBe(true);
    expect(groupEls.every((g) => g.classList.contains('h-9'))).toBe(false);
    expect(cells(el).every((c) => c.classList.contains('w-8'))).toBe(true);
  });

  it('starts small when the root is created with data-size', () => {
    const { el, groupEls } = build({ groups: [3], attrs: { 'data-size': 'sm' } });
    expect(groupEls[0].classList.contains('h-6.5')).toBe(true);
    expect(cells(el)[0].classList.contains('w-8')).toBe(true);
  });

  it('numbers cells continuously across groups', async () => {
    const { el } = build({ groups: [2, 2] });
    await flush();
    expect(cells(el).map((c) => c.getAttribute('data-index'))).toEqual(['0', '1', '2', '3']);
    expect(cells(el).map((c) => c.getAttribute('aria-label'))).toEqual(['Digit 1 of 4', 'Digit 2 of 4', 'Digit 3 of 4', 'Digit 4 of 4']);
    expect(cells(el)[0].getAttribute('autocomplete')).toBe('one-time-code');
    expect(
      cells(el)
        .slice(1)
        .every((c) => c.getAttribute('autocomplete') === 'off')
    ).toBe(true);
  });

  it('types a character, advances, and writes the native input', () => {
    const { el, input } = build();
    key(cells(el)[0], '4');
    expect(values(el)[0]).toBe('4');
    expect(input.value).toBe('4');
    expect(document.activeElement).toBe(cells(el)[1]);
  });

  it('advances across a group boundary while typing', () => {
    const { el } = build({ groups: [2, 2] });
    key(cells(el)[0], '1');
    key(cells(el)[1], '2');
    expect(document.activeElement).toBe(cells(el)[2]);
    key(cells(el)[2], '3');
    expect(values(el)).toEqual(['1', '2', '3', '']);
  });

  it('rejects characters outside a numeric charset', () => {
    const { el } = build();
    key(cells(el)[0], 'a');
    expect(values(el)[0]).toBe('');
  });

  it('accepts letters when alphanumeric', () => {
    const { el } = build({ attrs: { 'data-type': 'alphanumeric' } });
    key(cells(el)[0], 'a');
    expect(values(el)[0]).toBe('a');
  });

  it('clears in place on Backspace, then moves back when already empty', () => {
    const { el } = build();
    key(cells(el)[0], '1');
    key(cells(el)[1], '2');
    key(cells(el)[1], 'Backspace');
    expect(values(el)).toEqual(['1', '', '', '', '', '']);
    key(cells(el)[1], 'Backspace');
    expect(values(el)).toEqual(['', '', '', '', '', '']);
    expect(document.activeElement).toBe(cells(el)[0]);
  });

  it('moves focus with arrows, Home and End across groups', () => {
    const { el } = build({ groups: [3, 3] });
    const list = cells(el);
    key(list[2], 'ArrowRight');
    expect(document.activeElement).toBe(list[3]);
    key(list[3], 'ArrowLeft');
    expect(document.activeElement).toBe(list[2]);
    key(list[0], 'End');
    expect(document.activeElement).toBe(list[5]);
    key(list[5], 'Home');
    expect(document.activeElement).toBe(list[0]);
  });

  it('distributes a pasted code across groups, skipping punctuation', () => {
    const { el, input } = build({ groups: [3, 3] });
    const changes = [];
    input.addEventListener('change', () => changes.push(input.value));
    paste(cells(el)[0], '482-913');
    expect(values(el)).toEqual(['4', '8', '2', '9', '1', '3']);
    expect(input.value).toBe('482913');
    expect(changes.length).toBe(1);
  });

  it('pastes from the focused cell onward', () => {
    const { el } = build();
    paste(cells(el)[3], '45');
    expect(values(el)).toEqual(['', '', '', '4', '5', '']);
  });

  it('distributes a full code autofilled into the first cell', () => {
    const { el } = build();
    const cell = cells(el)[0];
    cell.value = '482913';
    cell.dispatchEvent(new Event('input', { bubbles: true }));
    expect(values(el)).toEqual(['4', '8', '2', '9', '1', '3']);
  });

  it('reads from and writes to an x-model bound on the native input', () => {
    let stored = '';
    const model = { get: () => stored, set: vi.fn((v) => (stored = v)) };
    const { el } = build({ model });
    key(cells(el)[0], '7');
    expect(stored).toBe('7');
    expect(model.set).toHaveBeenCalledWith('7');
  });

  it('seeds the cells from an x-model value', async () => {
    let stored = '123456';
    const model = { get: () => stored, set: (v) => (stored = v) };
    const { el } = build({ groups: [3, 3], model });
    await flush();
    expect(values(el)).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  it('fires complete once when the last cell is filled', () => {
    const { el } = build({ groups: [3] });
    const completions = [];
    el.addEventListener('complete', (e) => completions.push(e.detail.value));
    key(cells(el)[0], '1');
    key(cells(el)[1], '2');
    expect(completions.length).toBe(0);
    key(cells(el)[2], '3');
    expect(completions).toEqual(['123']);
    key(cells(el)[2], 'Backspace');
    key(cells(el)[2], '9');
    expect(completions).toEqual(['123', '129']);
  });

  it('mirrors disabled onto the cells and rejects edits', () => {
    const { el } = build({ inputAttrs: { disabled: '' } });
    expect(cells(el).every((c) => c.disabled)).toBe(true);
    key(cells(el)[0], '1');
    expect(values(el)[0]).toBe('');
  });

  it('mirrors readonly onto the cells and rejects edits', () => {
    const { el } = build({ inputAttrs: { readonly: '' } });
    expect(cells(el).every((c) => c.readOnly)).toBe(true);
    key(cells(el)[0], '1');
    expect(values(el)[0]).toBe('');
  });

  it('mirrors aria-invalid from the native input onto the cells', async () => {
    const { el, input } = build();
    expect(cells(el)[0].hasAttribute('aria-invalid')).toBe(false);
    input.setAttribute('aria-invalid', 'true');
    await flush();
    expect(cells(el).every((c) => c.getAttribute('aria-invalid') === 'true')).toBe(true);
  });

  it('masks the cells with a password type', () => {
    const { el } = build({ attrs: { 'data-mask': '' } });
    expect(cells(el).every((c) => c.getAttribute('type') === 'password')).toBe(true);
  });

  it('labels the group and each cell, allowing overrides', async () => {
    const { el } = build();
    await flush();
    expect(el.getAttribute('aria-label')).toBe('One-time password');
    expect(cells(el)[0].getAttribute('aria-label')).toBe('Digit 1 of 6');

    const custom = build({ groups: [3], attrs: { 'aria-label': 'Verification code', 'data-cell-label': 'Box {index}/{length}' } });
    await flush();
    expect(custom.el.getAttribute('aria-label')).toBe('Verification code');
    expect(cells(custom.el)[0].getAttribute('aria-label')).toBe('Box 1/3');
  });

  it('marks the separator decorative and keeps the author text', () => {
    const { separatorEls } = build({ groups: [3, 3] });
    expect(separatorEls[0].getAttribute('aria-hidden')).toBe('true');
    expect(separatorEls[0].getAttribute('data-slot')).toBe('otp-separator');
    expect(separatorEls[0].textContent).toBe('-');
  });

  it('seeds the cells from data-value once the groups have registered', async () => {
    const { el, input } = build({ groups: [3, 3], attrs: { 'data-value': '12' } });
    await flush();
    expect(values(el)).toEqual(['1', '2', '', '', '', '']);
    expect(input.value).toBe('12');
  });

  it('warns and falls back to one cell for a missing data-length', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const el = document.createElement('div');
    const input = document.createElement('input');
    el.appendChild(input);
    const group = document.createElement('div');
    el.appendChild(group);
    document.body.appendChild(el);
    mountDirective(otpPlugin, 'h-otp', el, { original: 'x-h-otp' });
    mountDirective(otpPlugin, 'h-otp-group', group, { original: 'x-h-otp-group' });
    expect(cells(el).length).toBe(1);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('restores the initial value on form reset', async () => {
    const form = document.createElement('form');
    document.body.appendChild(form);
    const el = document.createElement('div');
    el.setAttribute('data-value', '11');
    const input = document.createElement('input');
    el.appendChild(input);
    const group = document.createElement('div');
    group.setAttribute('data-length', '6');
    el.appendChild(group);
    form.appendChild(el);
    mountDirective(otpPlugin, 'h-otp', el, { original: 'x-h-otp' });
    mountDirective(otpPlugin, 'h-otp-group', group, { original: 'x-h-otp-group' });
    await flush();

    key(cells(el)[2], '5');
    expect(values(el)).toEqual(['1', '1', '5', '', '', '']);

    form.dispatchEvent(new Event('reset', { bubbles: true }));
    await flush();
    expect(values(el)).toEqual(['1', '1', '', '', '', '']);
  });

  it('unregisters its cells on cleanup', () => {
    const cleanups = [];
    const el = document.createElement('div');
    const input = document.createElement('input');
    el.appendChild(input);
    const group = document.createElement('div');
    group.setAttribute('data-length', '3');
    el.appendChild(group);
    document.body.appendChild(el);
    mountDirective(otpPlugin, 'h-otp', el, { original: 'x-h-otp' });
    mountDirective(otpPlugin, 'h-otp-group', group, { original: 'x-h-otp-group' }, { cleanup: (fn) => cleanups.push(fn) });
    expect(el._h_otp.cells.length).toBe(3);
    cleanups.forEach((fn) => fn());
    expect(el._h_otp.cells.length).toBe(0);
  });

  it('calls cleanup', () => {
    const { ctx } = build();
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});
