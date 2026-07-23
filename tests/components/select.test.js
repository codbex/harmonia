import { describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 10, y: 20, placement: 'bottom' }),
  autoUpdate: vi.fn().mockReturnValue(() => {}),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
  size: vi.fn(),
}));

vi.mock('../../src/common/input-size.js', () => ({
  sizeObserver: vi.fn().mockReturnValue({ disconnect: vi.fn() }),
}));

import selectPlugin from '../../src/components/select.js';
import { mountDirective } from '../test-utils.js';

describe('h-select', () => {
  it('initializes _h_select reactive state', () => {
    const el = document.createElement('div');
    mountDirective(selectPlugin, 'h-select', el, { modifiers: [] });
    expect(el._h_select).toBeDefined();
    expect(el._h_select.expanded).toBe(false);
    expect(el._h_select.multiple).toBe(false);
    expect(el._h_select.controls).toMatch(/^hsc/);
  });

  it('applies base classes', () => {
    const el = document.createElement('div');
    mountDirective(selectPlugin, 'h-select', el, { modifiers: [] });
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('select');
  });

  it('applies table-specific classes and data-slot for table modifier', () => {
    const el = document.createElement('div');
    mountDirective(selectPlugin, 'h-select', el, { modifiers: ['table'] });
    expect(el.getAttribute('data-slot')).toBe('cell-input-select');
    expect(el.classList.contains('h-10')).toBe(true);
  });

  it('calls cleanup', () => {
    const el = document.createElement('div');
    const { ctx } = mountDirective(selectPlugin, 'h-select', el, { modifiers: [] });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-select-input', () => {
  function createSelectInputSetup() {
    const container = document.createElement('div');
    const selectEl = document.createElement('div');
    selectEl._h_select = {
      fieldLabelId: undefined,
      trigger: undefined,
      controls: 'hsc-test',
      expanded: false,
      multiple: false,
      label: [],
      refreshLabel: undefined,
      listeners: [],
      search: '',
      focusSearch: undefined,
      filterType: 0,
    };
    selectEl._h_model = { set: undefined, get: undefined };
    const input = document.createElement('input');
    input.type = 'text';
    selectEl.appendChild(input);
    container.appendChild(selectEl);
    document.body.appendChild(container);
    return { container, selectEl, input };
  }

  it('applies hidden class and type=text to input', () => {
    const { input } = createSelectInputSetup();
    mountDirective(selectPlugin, 'h-select-input', input, {
      original: 'x-h-select-input',
      expression: '',
    });
    expect(input.classList.contains('hidden')).toBe(true);
    expect(input.getAttribute('type')).toBe('text');
  });

  it('creates a fake trigger with data-slot=select-input', () => {
    const { input, selectEl } = createSelectInputSetup();
    mountDirective(selectPlugin, 'h-select-input', input, {
      original: 'x-h-select-input',
      expression: '',
    });
    const trigger = selectEl.querySelector('[data-slot="select-input"]');
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute('role')).toBe('combobox');
  });

  it('throws if element is not an input', () => {
    const el = document.createElement('div');
    expect(() =>
      mountDirective(selectPlugin, 'h-select-input', el, {
        original: 'x-h-select-input',
        expression: '',
      })
    ).toThrow();
  });

  it('calls cleanup', () => {
    const { input } = createSelectInputSetup();
    const { ctx } = mountDirective(selectPlugin, 'h-select-input', input, {
      original: 'x-h-select-input',
      expression: '',
    });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-select-content', () => {
  function createSelectContentSetup() {
    const container = document.createElement('div');
    const selectEl = document.createElement('div');
    const fakeTrigger = document.createElement('span');
    selectEl._h_select = {
      fieldLabelId: undefined,
      trigger: fakeTrigger,
      controls: 'hsc-test',
      expanded: false,
    };
    const content = document.createElement('div');
    selectEl.appendChild(content);
    container.appendChild(selectEl);
    document.body.appendChild(container);
    return { container, selectEl, content };
  }

  it('applies base classes', () => {
    const { content } = createSelectContentSetup();
    mountDirective(selectPlugin, 'h-select-content', content, {
      original: 'x-h-select-content',
    });
    expect(content.classList.contains('absolute')).toBe(true);
    expect(content.classList.contains('bg-popover')).toBe(true);
    expect(content.classList.contains('hidden')).toBe(true);
  });

  it('sets role, tabindex, data-slot, and id attributes', () => {
    const { content, selectEl } = createSelectContentSetup();
    mountDirective(selectPlugin, 'h-select-content', content, {
      original: 'x-h-select-content',
    });
    expect(content.getAttribute('role')).toBe('listbox');
    expect(content.getAttribute('tabindex')).toBe('-1');
    expect(content.getAttribute('data-slot')).toBe('select-content');
    expect(content.getAttribute('id')).toBe(selectEl._h_select.controls);
  });

  it('calls cleanup', () => {
    const { content } = createSelectContentSetup();
    const { ctx } = mountDirective(selectPlugin, 'h-select-content', content, {
      original: 'x-h-select-content',
    });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-select-separator', () => {
  it('applies base classes and attributes', () => {
    const el = document.createElement('div');
    mountDirective(selectPlugin, 'h-select-separator', el);
    expect(el.classList.contains('bg-border')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('select-separator');
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.getAttribute('role')).toBe('none');
  });
});

describe('h-select-label', () => {
  it('applies base classes and sets data-slot', () => {
    const el = document.createElement('div');
    mountDirective(selectPlugin, 'h-select-label', el);
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    expect(el.classList.contains('text-xs')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('select-label');
  });
});

describe('h-select-option', () => {
  // Mount a real h-select on a host so the option gets a genuine reactive
  // _h_select ancestor state (findAncestorState walks parentElement).
  function mountOption(bindings = {}, { description, children = [] } = {}) {
    const host = document.createElement('div');
    document.body.appendChild(host);
    mountDirective(selectPlugin, 'h-select', host, { modifiers: [] });
    host._h_model = { get: () => '', set: () => {} };
    host._h_select.refreshLabel = () => {};

    const option = document.createElement('div');
    if (description != null) option.setAttribute('data-description', description);
    for (const child of children) option.appendChild(child);
    host.appendChild(option);

    const label = bindings.expression ? bindings.expression.replace(/^'|'$/g, '') : '';
    const ctx = mountDirective(selectPlugin, 'h-select-option', option, { original: 'x-h-select-option', expression: bindings.expression ?? '', ...bindings }, { evaluateLater: () => (cb) => cb(label) });
    return { host, option, state: host._h_select, ctx: ctx.ctx };
  }

  it('lays out the checkmark in flow on the right (order-last + ml-auto, no absolute)', () => {
    const { option } = mountOption({ expression: "'Apple'" });
    const indicator = option.querySelector('span[aria-hidden="true"]');
    expect(indicator).toBeTruthy();
    expect(indicator.classList.contains('order-last')).toBe(true);
    expect(indicator.classList.contains('ml-auto')).toBe(true);
    expect(indicator.classList.contains('absolute')).toBe(false);
    expect(option.classList.contains('relative')).toBe(false);
    expect(option.classList.contains('pr-8')).toBe(false);
  });

  it('pins a leading svg/img first and sizes an image', () => {
    const { option } = mountOption({ expression: "'Apple'" });
    expect(option.classList.contains('[&>svg]:order-first')).toBe(true);
    expect(option.classList.contains('[&>img]:order-first')).toBe(true);
    expect(option.classList.contains('[&>img:not([class*="size-"])]:size-4')).toBe(true);
    expect(option.classList.contains('[&>img]:pointer-events-none')).toBe(true);
  });

  it('leaves consumer-authored media accessibility to the author', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const img = document.createElement('img');
    const { option } = mountOption({ expression: "'Apple'" }, { children: [svg, img] });
    // The component must not inject aria-hidden or alt onto author media.
    expect(option.querySelector('svg').hasAttribute('aria-hidden')).toBe(false);
    expect(option.querySelector('img').hasAttribute('aria-hidden')).toBe(false);
    expect(option.querySelector('img').hasAttribute('alt')).toBe(false);
  });

  it('sets the accessible name from the label only', () => {
    const { option } = mountOption({ expression: "'Apple'" }, { description: 'A red fruit' });
    const labelledby = option.getAttribute('aria-labelledby');
    const labelEl = option.querySelector(`#${labelledby}`);
    expect(labelEl.innerText).toBe('Apple');
    // The description must not leak into the label element.
    expect(labelEl.innerText).not.toContain('red fruit');
  });

  it('renders a muted description and wires aria-describedby when data-description is set', () => {
    const { option } = mountOption({ expression: "'Apple'" }, { description: 'A red fruit' });
    const describedby = option.getAttribute('aria-describedby');
    expect(describedby).toBeTruthy();
    const descEl = option.querySelector(`#${describedby}`);
    expect(descEl.textContent).toBe('A red fruit');
    expect(descEl.classList.contains('text-muted-foreground')).toBe(true);
    expect(descEl.classList.contains('text-xs')).toBe(true);
  });

  it('shifts the description color to primary-foreground when the option is focused', () => {
    const { option } = mountOption({ expression: "'Apple'" }, { description: 'A red fruit' });
    const descEl = option.querySelector(`#${option.getAttribute('aria-describedby')}`);
    expect(descEl.classList.contains('[[data-slot=select-option]:focus_&]:text-primary-foreground/80')).toBe(true);
  });

  it('adds no description element or aria-describedby without data-description', () => {
    const { option } = mountOption({ expression: "'Apple'" });
    expect(option.hasAttribute('aria-describedby')).toBe(false);
    expect(option.querySelector('.text-xs')).toBeNull();
  });

  it('updates the description when the data-description attribute changes', async () => {
    const { option } = mountOption({ expression: "'Apple'" }, { description: 'Old' });
    const describedby = option.getAttribute('aria-describedby');
    option.setAttribute('data-description', 'New');
    // MutationObserver callbacks are microtasks.
    await new Promise((r) => setTimeout(r, 0));
    expect(option.querySelector(`#${describedby}`).textContent).toBe('New');
  });

  it('filters on the label only when the search does not include descriptions', () => {
    const { option, state } = mountOption({ expression: "'Apple'" }, { description: 'A tropical fruit' });
    state.includeDesc = false;
    state.filterType = 1; // contains
    state.search = 'tropical';
    expect(option.classList.contains('hidden')).toBe(true);
    state.search = 'appl';
    expect(option.classList.contains('hidden')).toBe(false);
  });

  it('filters on the description too when includeDesc is set (contains)', () => {
    const { option, state } = mountOption({ expression: "'Apple'" }, { description: 'A tropical fruit' });
    state.includeDesc = true;
    state.filterType = 1; // contains
    state.search = 'tropical';
    expect(option.classList.contains('hidden')).toBe(false);
  });

  it('keeps starts-with keyed on the label even when includeDesc is set', () => {
    const { option, state } = mountOption({ expression: "'Apple'" }, { description: 'tropical fruit' });
    state.includeDesc = true;
    state.filterType = 0; // starts-with
    state.search = 'tropical';
    expect(option.classList.contains('hidden')).toBe(true);
    state.search = 'app';
    expect(option.classList.contains('hidden')).toBe(false);
  });

  it('reads data-include-desc on the search element into reactive state', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    mountDirective(selectPlugin, 'h-select', host, { modifiers: [] });
    const search = document.createElement('div');
    search.setAttribute('data-include-desc', 'true');
    host.appendChild(search);
    mountDirective(selectPlugin, 'h-select-search', search, { original: 'x-h-select-search' });
    expect(host._h_select.includeDesc).toBe(true);
  });
});
