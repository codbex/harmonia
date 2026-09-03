import { beforeEach, describe, expect, it, vi } from 'vitest';
import buttonPlugin, { buttonVariants, getButtonSize, setButtonClasses } from '../../src/components/button.js';
import { createMockAlpine, mountDirective } from '../test-utils.js';

describe('buttonVariants', () => {
  it('is an object', () => {
    expect(typeof buttonVariants).toBe('object');
    expect(buttonVariants).not.toBeNull();
  });

  it('has expected variant keys', () => {
    const expectedKeys = ['default', 'primary', 'positive', 'negative', 'outline', 'transparent', 'link'];
    for (const key of expectedKeys) {
      expect(buttonVariants).toHaveProperty(key);
    }
  });

  it('each variant contains arrays of class strings', () => {
    for (const [_, value] of Object.entries(buttonVariants)) {
      expect(Array.isArray(value)).toBe(true);
      for (const cls of value) {
        expect(typeof cls).toBe('string');
      }
    }
  });

  it('default variant includes bg-secondary', () => {
    expect(buttonVariants.default).toContain('bg-secondary');
    expect(buttonVariants.default).toContain('text-secondary-foreground');
  });

  it('primary variant includes bg-primary', () => {
    expect(buttonVariants.primary).toContain('bg-primary');
    expect(buttonVariants.primary).toContain('text-primary-foreground');
  });

  it('positive variant includes bg-positive', () => {
    expect(buttonVariants.positive).toContain('bg-positive');
  });

  it('negative variant includes bg-negative', () => {
    expect(buttonVariants.negative).toContain('bg-negative');
  });

  it('link variant includes text-primary and underline-offset-4', () => {
    expect(buttonVariants.link).toContain('text-primary');
    expect(buttonVariants.link).toContain('underline-offset-4');
  });
});

describe('setButtonClasses', () => {
  it('adds cursor-pointer', () => {
    const el = document.createElement('button');
    setButtonClasses(el);
    expect(el.classList.contains('cursor-pointer')).toBe(true);
  });

  it('adds inline-flex', () => {
    const el = document.createElement('button');
    setButtonClasses(el);
    expect(el.classList.contains('inline-flex')).toBe(true);
  });

  it('adds whitespace-nowrap', () => {
    const el = document.createElement('button');
    setButtonClasses(el);
    expect(el.classList.contains('whitespace-nowrap')).toBe(true);
  });

  it('adds font-medium', () => {
    const el = document.createElement('button');
    setButtonClasses(el);
    expect(el.classList.contains('font-medium')).toBe(true);
  });

  it('adds disabled:opacity-disabled', () => {
    const el = document.createElement('button');
    setButtonClasses(el);
    expect(el.classList.contains('disabled:opacity-disabled')).toBe(true);
  });
});

describe('getButtonSize', () => {
  it('returns correct classes for sm (non-addon)', () => {
    const classes = getButtonSize('sm', false);
    expect(Array.isArray(classes)).toBe(true);
    expect(classes).toContain('h-6.5');
    expect(classes).toContain('px-2.5');
  });

  it('returns correct classes for sm addon', () => {
    const classes = getButtonSize('sm', true);
    expect(classes).toContain('h-6');
    expect(classes).toContain('px-2');
  });

  it('returns correct classes for md (non-addon)', () => {
    const classes = getButtonSize('md', false);
    expect(classes).toContain('h-8');
    expect(classes).toContain('px-3');
  });

  it('returns correct classes for md addon', () => {
    const classes = getButtonSize('md', true);
    expect(classes).toContain('h-8');
    expect(classes).toContain('px-2.5');
  });

  it('returns default size classes for unknown size', () => {
    const classes = getButtonSize('default');
    expect(classes).toContain('h-9');
    expect(classes).toContain('px-4');
    expect(classes).toContain('py-2');
  });

  it('returns default when no size provided', () => {
    const classes = getButtonSize();
    expect(classes).toContain('h-9');
  });

  it('returns size icon classes', () => {
    const classes = getButtonSize('icon');
    expect(classes).toContain('size-9');
  });
});

describe('h-button directive', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('button');
    document.body.appendChild(el);
  });

  it('registers h-button and related directives', () => {
    const { alpine } = mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(alpine._directives['h-button']).toBeDefined();
    expect(alpine._directives['h-button-group']).toBeDefined();
    expect(alpine._directives['h-button-group-radio']).toBeDefined();
  });

  it('no longer registers h-button-group-separator', () => {
    const { alpine } = mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(alpine._directives['h-button-group-separator']).toBeUndefined();
  });

  it('sets data-slot="button"', () => {
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(el.getAttribute('data-slot')).toBe('button');
  });

  it('does not override existing data-slot', () => {
    el.setAttribute('data-slot', 'date-picker-trigger');
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(el.getAttribute('data-slot')).toBe('date-picker-trigger');
  });

  it('applies base button classes', () => {
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
  });

  it('applies default variant classes', () => {
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(el.classList.contains('bg-secondary')).toBe(true);
  });

  it('applies primary variant when data-variant="primary"', () => {
    el.setAttribute('data-variant', 'primary');
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(el.classList.contains('bg-primary')).toBe(true);
    expect(el.classList.contains('bg-secondary')).toBe(false);
  });

  it('applies default size classes', () => {
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(el.classList.contains('h-9')).toBe(true);
  });

  it('applies sm size when data-size="sm"', () => {
    el.setAttribute('data-size', 'sm');
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(el.classList.contains('h-6.5')).toBe(true);
    expect(el.classList.contains('h-9')).toBe(false);
  });

  it('applies addon styles with addon modifier', () => {
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button', modifiers: ['addon'] });
    expect(el.classList.contains('shadow-none')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('inline-flex')).toBe(false);
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-button-group directive', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('adds flex and items-stretch', () => {
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-stretch')).toBe(true);
  });

  it('sets role="group"', () => {
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.getAttribute('role')).toBe('group');
  });

  it('sets data-slot="button-group"', () => {
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.getAttribute('data-slot')).toBe('button-group');
  });

  it('applies horizontal variant classes by default', () => {
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.classList.contains('[&>*:not(:first-child)]:rounded-l-none')).toBe(true);
  });

  it('applies vertical variant classes when data-orientation="vertical"', () => {
    el.setAttribute('data-orientation', 'vertical');
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.classList.contains('flex-col')).toBe(true);
  });

  it('divides horizontally by default', () => {
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.classList.contains('divide-x')).toBe(true);
    expect(el.classList.contains('divide-y')).toBe(false);
  });

  it('divides vertically when data-orientation="vertical"', () => {
    el.setAttribute('data-orientation', 'vertical');
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.classList.contains('divide-y')).toBe(true);
    expect(el.classList.contains('divide-x')).toBe(false);
  });

  it('squares the corners of its children when borderless', () => {
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.classList.contains('data-[borderless=true]:[&>*]:rounded-none')).toBe(true);
  });

  it('drops the horizontal outer ring when borderless, keeping the dividers', () => {
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.classList.contains('data-[borderless=true]:[&>*]:border-y-0')).toBe(true);
    expect(el.classList.contains('data-[borderless=true]:[&>*:first-child]:border-l-0')).toBe(true);
    expect(el.classList.contains('data-[borderless=true]:[&>*:last-child]:border-r-0')).toBe(true);
  });

  it('drops the vertical outer ring when borderless, keeping the dividers', () => {
    el.setAttribute('data-orientation', 'vertical');
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.classList.contains('data-[borderless=true]:[&>*]:border-x-0')).toBe(true);
    expect(el.classList.contains('data-[borderless=true]:[&>*:first-child]:border-t-0')).toBe(true);
    expect(el.classList.contains('data-[borderless=true]:[&>*:last-child]:border-b-0')).toBe(true);
    expect(el.classList.contains('data-[borderless=true]:[&>*]:border-y-0')).toBe(false);
  });

  it('keeps a role set by the author', () => {
    el.setAttribute('role', 'toolbar');
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.getAttribute('role')).toBe('toolbar');
  });

  it('sets no aria-orientation without a model', () => {
    el.setAttribute('data-orientation', 'vertical');
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.hasAttribute('aria-orientation')).toBe(false);
  });

  it('does not require an accessible name without a model', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    mountDirective(buttonPlugin, 'h-button-group', el, { original: 'x-h-button-group' });
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});

// A single choice group and its choices, wired to a reactive store standing in
// for the x-model Alpine would have bound.
function makeGroup({ value = 'light', orientation, label = 'Theme', model = true } = {}) {
  const group = document.createElement('div');
  if (label !== null) group.setAttribute('aria-label', label);
  if (orientation) group.setAttribute('data-orientation', orientation);
  document.body.appendChild(group);

  const store = createMockAlpine().reactive({ value });
  if (model) {
    group._x_model = {
      get: () => store.value,
      set: (next) => {
        store.value = next;
      },
    };
  }

  const { ctx } = mountDirective(buttonPlugin, 'h-button-group', group, { original: 'x-h-button-group' });
  return { group, store, ctx };
}

function addChoice(group, value, { disabled = false } = {}) {
  const button = document.createElement('button');
  if (disabled) button.disabled = true;
  group.appendChild(button);
  const { ctx } = mountDirective(buttonPlugin, 'h-button-group-radio', button, { original: 'x-h-button-group-radio', expression: JSON.stringify(value) }, { evaluateLater: () => (cb) => cb(value) });
  return { button, ctx };
}

function press(el, key) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

describe('h-button-group directive with an x-model', () => {
  it('sets role="radiogroup"', () => {
    const { group } = makeGroup();
    expect(group.getAttribute('role')).toBe('radiogroup');
  });

  it('keeps a role set by the author', () => {
    const group = document.createElement('div');
    group.setAttribute('role', 'toolbar');
    group.setAttribute('aria-label', 'Theme');
    group._x_model = { get: () => 'light', set: () => {} };
    document.body.appendChild(group);
    mountDirective(buttonPlugin, 'h-button-group', group, { original: 'x-h-button-group' });
    expect(group.getAttribute('role')).toBe('toolbar');
  });

  it('sets aria-orientation="vertical" when vertical', () => {
    const { group } = makeGroup({ orientation: 'vertical' });
    expect(group.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('logs an error without an accessible name', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    makeGroup({ label: null });
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it('accepts aria-labelledby as the name', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const group = document.createElement('div');
    group.setAttribute('aria-labelledby', 'heading');
    group._x_model = { get: () => 'light', set: () => {} };
    document.body.appendChild(group);
    mountDirective(buttonPlugin, 'h-button-group', group, { original: 'x-h-button-group' });
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  // Alpine's .lazy listener would write the change event's detail object over
  // the bound value, so the event modifiers are rejected at init.
  it('rejects x-model event modifiers with a console error', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const group = document.createElement('div');
    group.setAttribute('aria-label', 'Theme');
    group.setAttribute('x-model.lazy', 'theme');
    group._x_model = { get: () => 'light', set: () => {} };
    document.body.appendChild(group);
    mountDirective(buttonPlugin, 'h-button-group', group, { original: 'x-h-button-group' });
    expect(error).toHaveBeenCalledWith('x-h-button-group: x-model.lazy is not supported, the model always updates immediately', group);
    error.mockRestore();
  });

  it('gives the tab stop to the selected choice', () => {
    const { group } = makeGroup({ value: 'dark' });
    const { button: light } = addChoice(group, 'light');
    const { button: dark } = addChoice(group, 'dark');
    expect(light.getAttribute('tabindex')).toBe('-1');
    expect(dark.getAttribute('tabindex')).toBe('0');
  });

  it('gives the tab stop to the first choice when none is selected', () => {
    const { group } = makeGroup({ value: 'auto' });
    const { button: light } = addChoice(group, 'light');
    const { button: dark } = addChoice(group, 'dark');
    expect(light.getAttribute('tabindex')).toBe('0');
    expect(dark.getAttribute('tabindex')).toBe('-1');
  });

  it('skips a disabled choice for the tab stop', () => {
    const { group } = makeGroup({ value: 'auto' });
    const { button: light } = addChoice(group, 'light', { disabled: true });
    const { button: dark } = addChoice(group, 'dark');
    expect(light.hasAttribute('tabindex')).toBe(true);
    expect(light.getAttribute('tabindex')).toBe('-1');
    expect(dark.getAttribute('tabindex')).toBe('0');
  });

  it('moves the selection and focus with ArrowRight, wrapping at the end', () => {
    const { group, store } = makeGroup();
    addChoice(group, 'light');
    addChoice(group, 'dark');
    const { button: auto } = addChoice(group, 'auto');

    const first = press(group.firstElementChild, 'ArrowRight');
    expect(first.defaultPrevented).toBe(true);
    expect(store.value).toBe('dark');

    press(group.children[1], 'ArrowRight');
    expect(store.value).toBe('auto');
    expect(document.activeElement).toBe(auto);

    press(auto, 'ArrowRight');
    expect(store.value).toBe('light');
  });

  it('moves backwards with ArrowLeft, wrapping at the start', () => {
    const { group, store } = makeGroup();
    addChoice(group, 'light');
    addChoice(group, 'dark');
    addChoice(group, 'auto');

    press(group.firstElementChild, 'ArrowLeft');
    expect(store.value).toBe('auto');
  });

  it('selects the first and last choice with Home and End', () => {
    const { group, store } = makeGroup({ value: 'dark' });
    addChoice(group, 'light');
    addChoice(group, 'dark');
    addChoice(group, 'auto');

    press(group.children[1], 'End');
    expect(store.value).toBe('auto');

    press(group.children[2], 'Home');
    expect(store.value).toBe('light');
  });

  it('steps over a disabled choice', () => {
    const { group, store } = makeGroup();
    addChoice(group, 'light');
    addChoice(group, 'dark', { disabled: true });
    addChoice(group, 'auto');

    press(group.firstElementChild, 'ArrowRight');
    expect(store.value).toBe('auto');
  });

  it('uses ArrowDown and ArrowUp when vertical', () => {
    const { group, store } = makeGroup({ orientation: 'vertical' });
    addChoice(group, 'light');
    addChoice(group, 'dark');

    const sideways = press(group.firstElementChild, 'ArrowRight');
    expect(sideways.defaultPrevented).toBe(false);
    expect(store.value).toBe('light');

    press(group.firstElementChild, 'ArrowDown');
    expect(store.value).toBe('dark');

    press(group.children[1], 'ArrowUp');
    expect(store.value).toBe('light');
  });

  it('ignores keys from outside the registered choices', () => {
    const { group, store } = makeGroup();
    addChoice(group, 'light');
    const stranger = document.createElement('button');
    group.appendChild(stranger);

    const event = press(stranger, 'ArrowRight');
    expect(event.defaultPrevented).toBe(false);
    expect(store.value).toBe('light');
  });

  it('stops handling keys after cleanup', () => {
    const { group, store, ctx } = makeGroup();
    addChoice(group, 'light');
    addChoice(group, 'dark');

    for (const call of ctx.cleanup.mock.calls) call[0]();

    press(group.firstElementChild, 'ArrowRight');
    expect(store.value).toBe('light');
  });
});

describe('h-button-group-radio directive', () => {
  it('throws when it is not a button', () => {
    const { group } = makeGroup();
    const div = document.createElement('div');
    group.appendChild(div);
    expect(() => mountDirective(buttonPlugin, 'h-button-group-radio', div, { original: 'x-h-button-group-radio' })).toThrow(/must be a button element/);
  });

  it('throws outside a button group', () => {
    const orphan = document.createElement('button');
    document.body.appendChild(orphan);
    expect(() => mountDirective(buttonPlugin, 'h-button-group-radio', orphan, { original: 'x-h-button-group-radio' })).toThrow(/must be inside a x-h-button-group element/);
  });

  it('throws when the group has no model to bind to', () => {
    const { group } = makeGroup({ model: false });
    const button = document.createElement('button');
    group.appendChild(button);
    expect(() => mountDirective(buttonPlugin, 'h-button-group-radio', button, { original: 'x-h-button-group-radio' })).toThrow(/requires an "x-model"/);
  });

  it('sets type="button" and role="radio"', () => {
    const { group } = makeGroup();
    const { button } = addChoice(group, 'light');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('role')).toBe('radio');
  });

  it('leaves the data-slot the button directive set', () => {
    const { group } = makeGroup();
    const button = document.createElement('button');
    group.appendChild(button);
    mountDirective(buttonPlugin, 'h-button', button, { original: 'x-h-button' });
    mountDirective(buttonPlugin, 'h-button-group-radio', button, { original: 'x-h-button-group-radio' }, { evaluateLater: () => (cb) => cb('light') });
    expect(button.getAttribute('data-slot')).toBe('button');
  });

  it('marks the selected choice with aria-checked and data-toggled', () => {
    const { group } = makeGroup({ value: 'dark' });
    const { button: light } = addChoice(group, 'light');
    const { button: dark } = addChoice(group, 'dark');

    expect(dark.getAttribute('aria-checked')).toBe('true');
    expect(dark.getAttribute('data-toggled')).toBe('true');
    expect(light.getAttribute('aria-checked')).toBe('false');
    expect(light.hasAttribute('data-toggled')).toBe(false);
  });

  it('never sets aria-pressed, which is invalid on a radio', () => {
    const { group } = makeGroup();
    const { button } = addChoice(group, 'light');
    expect(button.hasAttribute('aria-pressed')).toBe(false);
  });

  it('follows an external write to the bound value', () => {
    const { group, store } = makeGroup();
    const { button: light } = addChoice(group, 'light');
    const { button: dark } = addChoice(group, 'dark');

    store.value = 'dark';

    expect(dark.getAttribute('aria-checked')).toBe('true');
    expect(light.getAttribute('aria-checked')).toBe('false');
    expect(dark.getAttribute('tabindex')).toBe('0');
    expect(light.getAttribute('tabindex')).toBe('-1');
  });

  it('writes the value and dispatches change on click', () => {
    const { group, store } = makeGroup();
    addChoice(group, 'light');
    const { button: dark } = addChoice(group, 'dark');

    const changes = [];
    group.addEventListener('change', (event) => changes.push(event.detail));
    dark.click();

    expect(store.value).toBe('dark');
    expect(changes).toEqual([{ value: 'dark' }]);
  });

  it('does nothing when the selected choice is clicked again', () => {
    const { group } = makeGroup();
    const { button: light } = addChoice(group, 'light');

    const changes = [];
    group.addEventListener('change', (event) => changes.push(event.detail));
    light.click();

    expect(changes).toEqual([]);
  });

  it('unregisters and stops listening after cleanup', () => {
    const { group, store } = makeGroup();
    const { button: light } = addChoice(group, 'light');
    const { button: dark, ctx } = addChoice(group, 'dark');

    for (const call of ctx.cleanup.mock.calls) call[0]();

    dark.click();
    expect(store.value).toBe('light');

    // With the second choice gone, the stop falls back to the only one left.
    press(light, 'ArrowRight');
    expect(store.value).toBe('light');
  });
});
