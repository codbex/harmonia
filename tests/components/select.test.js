import { afterEach, describe, expect, it, vi } from 'vitest';

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

describe('h-select-input keyboard navigation', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function keydown(el, key) {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    el.dispatchEvent(event);
    return event;
  }

  // onKeyDown is registered on the select root inside onClick, so the whole
  // chain has to be mounted and the trigger clicked before keys do anything.
  function createOpenSelect({ count = 5, disabled = [], bareDisabled = [], hidden = [], descriptions = {}, labels, search = false } = {}) {
    const root = document.createElement('div');
    document.body.appendChild(root);
    mountDirective(selectPlugin, 'h-select', root, { modifiers: [] });

    const input = document.createElement('input');
    input.type = 'text';
    root.appendChild(input);
    mountDirective(selectPlugin, 'h-select-input', input, { original: 'x-h-select-input', expression: '' });

    const content = document.createElement('div');
    content.setAttribute('id', root._h_select.controls);
    root.appendChild(content);
    mountDirective(selectPlugin, 'h-select-content', content, { original: 'x-h-select-content' });

    if (search) {
      const searchEl = document.createElement('div');
      content.appendChild(searchEl);
      mountDirective(selectPlugin, 'h-select-search', searchEl, { original: 'x-h-select-search' });
    }

    const options = [];
    for (let i = 0; i < count; i++) {
      const option = document.createElement('div');
      const label = labels?.[i] ?? `Option ${i + 1}`;
      if (disabled.includes(i)) option.setAttribute('aria-disabled', 'true');
      if (bareDisabled.includes(i)) option.setAttribute('aria-disabled', '');
      if (descriptions[i] != null) option.setAttribute('data-description', descriptions[i]);
      content.appendChild(option);
      mountDirective(selectPlugin, 'h-select-option', option, { original: 'x-h-select-option', expression: `'${label}'` }, { evaluateLater: () => (cb) => cb(label) });
      // After mounting: the option's filter effect clears `hidden` while the
      // search is empty, so a class set earlier would be stripped.
      if (hidden.includes(i)) option.classList.add('hidden');
      options.push(option);
    }

    // Open with Enter on the trigger rather than a click, and without bubbling:
    // the mock's nextTick is synchronous, so a click would still be propagating
    // when the outside-dismiss listener lands on the document and would close
    // the list again, and a bubbling Enter would reach the root's own handler.
    root._h_select.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
    return { root, content, options, input, state: root._h_select };
  }

  const tabIndexes = (options) => options.map((option) => option.getAttribute('tabindex'));

  describe('arrow keys', () => {
    it('ArrowDown focuses the first option when nothing is focused yet', () => {
      const { root, options } = createOpenSelect({ count: 3 });
      keydown(root, 'ArrowDown');
      expect(document.activeElement).toBe(options[0]);
      expect(tabIndexes(options)).toEqual(['0', '-1', '-1']);
    });

    it('ArrowUp focuses the last option when nothing is focused yet', () => {
      const { root, options } = createOpenSelect({ count: 3 });
      keydown(root, 'ArrowUp');
      expect(document.activeElement).toBe(options[2]);
      expect(tabIndexes(options)).toEqual(['-1', '-1', '0']);
    });

    it('moves the roving tab stop forward and clears the old one', () => {
      const { root, options } = createOpenSelect({ count: 3 });
      keydown(root, 'ArrowDown');
      keydown(root, 'ArrowDown');
      expect(document.activeElement).toBe(options[1]);
      expect(tabIndexes(options)).toEqual(['-1', '0', '-1']);
    });

    it('wraps from the last option to the first and back', () => {
      const { root, options } = createOpenSelect({ count: 3 });
      keydown(root, 'ArrowUp');
      keydown(root, 'ArrowDown');
      expect(document.activeElement).toBe(options[0]);
      keydown(root, 'ArrowUp');
      expect(document.activeElement).toBe(options[2]);
    });
  });

  describe('disabled options', () => {
    it('ArrowDown lands on a disabled option in the middle', () => {
      const { root, options } = createOpenSelect({ count: 3, disabled: [1] });
      keydown(root, 'ArrowDown');
      expect(document.activeElement).toBe(options[0]);
      keydown(root, 'ArrowDown');
      expect(document.activeElement).toBe(options[1]);
    });

    it('ArrowDown wraps instead of landing on a trailing run of hidden options', () => {
      // Browser-verified regression: the old scan-and-wrap left focus on the
      // first skipped option when the skipped run reached the end.
      const { root, options } = createOpenSelect({ count: 5, hidden: [3, 4] });
      const visited = [];
      for (let i = 0; i < 4; i++) {
        keydown(root, 'ArrowDown');
        visited.push(options.indexOf(document.activeElement));
      }
      expect(visited).toEqual([0, 1, 2, 0]);
    });

    it('ArrowUp wraps instead of landing on a leading run of hidden options', () => {
      const { root, options } = createOpenSelect({ count: 5, hidden: [0, 1] });
      const visited = [];
      for (let i = 0; i < 4; i++) {
        keydown(root, 'ArrowUp');
        visited.push(options.indexOf(document.activeElement));
      }
      expect(visited).toEqual([4, 3, 2, 4]);
    });

    it('Home and End land on the first and last option, disabled or not', () => {
      const { root, options } = createOpenSelect({ count: 5, disabled: [0, 4] });
      keydown(root, 'End');
      expect(document.activeElement).toBe(options[4]);
      expect(tabIndexes(options)).toEqual(['-1', '-1', '-1', '-1', '0']);
      keydown(root, 'Home');
      expect(document.activeElement).toBe(options[0]);
      expect(tabIndexes(options)).toEqual(['0', '-1', '-1', '-1', '-1']);
    });

    it('PageUp and PageDown land on the first and last option, disabled or not', () => {
      const { root, options } = createOpenSelect({ count: 5, disabled: [0, 4] });
      keydown(root, 'PageDown');
      expect(document.activeElement).toBe(options[4]);
      keydown(root, 'PageUp');
      expect(document.activeElement).toBe(options[0]);
    });

    it('keeps every option reachable when they are all disabled', () => {
      const { root, options } = createOpenSelect({ count: 3, disabled: [0, 1, 2] });
      keydown(root, 'ArrowDown');
      expect(document.activeElement).toBe(options[0]);
      keydown(root, 'End');
      expect(document.activeElement).toBe(options[2]);
    });
  });

  describe('filtered options', () => {
    it('ArrowDown skips an option hidden by the search', () => {
      const { root, options } = createOpenSelect({ count: 3, hidden: [1] });
      keydown(root, 'ArrowDown');
      expect(document.activeElement).toBe(options[0]);
      keydown(root, 'ArrowDown');
      expect(document.activeElement).toBe(options[2]);
    });

    it('Home and End ignore hidden options at the ends', () => {
      const { root, options } = createOpenSelect({ count: 5, hidden: [0, 4] });
      keydown(root, 'Home');
      expect(document.activeElement).toBe(options[1]);
      keydown(root, 'End');
      expect(document.activeElement).toBe(options[3]);
    });

    it('walks only the options that survive a live search term', () => {
      const { root, options, state } = createOpenSelect({ count: 3, labels: ['Apple', 'Banana', 'Blueberry'] });
      state.search = 'b';
      expect(options[0].classList.contains('hidden')).toBe(true);
      keydown(root, 'ArrowDown');
      expect(document.activeElement).toBe(options[1]);
      keydown(root, 'ArrowDown');
      expect(document.activeElement).toBe(options[2]);
      keydown(root, 'ArrowDown');
      expect(document.activeElement).toBe(options[1]);
    });

    // The stop has to leave with the option. Left on something hidden it sits
    // outside the navigable list, and the arrows lose their place.
    it('drops the tab stop from an option the search hides', () => {
      const { root, options, state } = createOpenSelect({ count: 3, labels: ['Apple', 'Banana', 'Blueberry'] });
      keydown(root, 'ArrowDown');
      expect(tabIndexes(options)).toEqual(['0', '-1', '-1']);
      state.search = 'b';
      expect(options[0].classList.contains('hidden')).toBe(true);
      expect(options[0].getAttribute('tabindex')).toBe('-1');
    });

    it('resumes from the first visible option after the focused one is filtered out', () => {
      const { root, options, state } = createOpenSelect({ count: 3, labels: ['Apple', 'Banana', 'Blueberry'] });
      keydown(root, 'ArrowDown');
      expect(document.activeElement).toBe(options[0]);
      state.search = 'b';
      keydown(root, 'ArrowDown');
      expect(document.activeElement).toBe(options[1]);
    });

    // Filtering, then narrowing again without an arrow press in between. The
    // stop is never cleared, so it comes back on an option nobody focused.
    it('does not restore a stale tab stop when the search is cleared', () => {
      const { root, options, state } = createOpenSelect({ count: 3, labels: ['Apple', 'Banana', 'Blueberry'] });
      keydown(root, 'ArrowDown');
      expect(document.activeElement).toBe(options[0]);
      state.search = 'b';
      state.search = '';
      expect(tabIndexes(options)).toEqual(['-1', '-1', '-1']);
    });
  });

  describe('typeahead', () => {
    it('moves focus to the next option whose label starts with the key', () => {
      const { root, options } = createOpenSelect({ count: 3, labels: ['Apple', 'Banana', 'Cherry'] });
      keydown(root, 'b');
      expect(document.activeElement).toBe(options[1]);
      expect(tabIndexes(options)).toEqual(['-1', '0', '-1']);
    });

    it('cycles through repeated matches instead of sticking on the first', () => {
      const { root, options } = createOpenSelect({ count: 3, labels: ['Apple', 'Banana', 'Blueberry'] });
      keydown(root, 'b');
      expect(document.activeElement).toBe(options[1]);
      keydown(root, 'b');
      expect(document.activeElement).toBe(options[2]);
      keydown(root, 'b');
      expect(document.activeElement).toBe(options[1]);
    });

    it('matches case-insensitively', () => {
      const { root, options } = createOpenSelect({ count: 2, labels: ['Apple', 'Banana'] });
      keydown(root, 'B');
      expect(document.activeElement).toBe(options[1]);
    });

    it('matches a disabled option', () => {
      const { root, options } = createOpenSelect({ count: 3, labels: ['Apple', 'Banana', 'Blueberry'], disabled: [1] });
      keydown(root, 'b');
      expect(document.activeElement).toBe(options[1]);
    });

    it('skips a hidden option', () => {
      const { root, options } = createOpenSelect({ count: 3, labels: ['Apple', 'Banana', 'Blueberry'], hidden: [1] });
      keydown(root, 'b');
      expect(document.activeElement).toBe(options[2]);
    });

    it('does not match on the description text', () => {
      const { root } = createOpenSelect({ count: 2, labels: ['Apple', 'Cherry'], descriptions: { 0: 'Banana flavoured' } });
      const before = document.activeElement;
      keydown(root, 'b');
      expect(document.activeElement).toBe(before);
    });

    it('does nothing when no label matches', () => {
      const { root } = createOpenSelect({ count: 2, labels: ['Apple', 'Cherry'] });
      const before = document.activeElement;
      keydown(root, 'z');
      expect(document.activeElement).toBe(before);
    });

    it('forwards printable keys to the search input when the select has one', () => {
      const { root, options, state } = createOpenSelect({ count: 2, labels: ['Apple', 'Banana'], search: true });
      const focusSearch = vi.fn();
      state.focusSearch = focusSearch;
      keydown(root, 'ArrowDown');
      keydown(root, 'b');
      expect(focusSearch).toHaveBeenCalled();
      // The stop is released so the search input owns focus.
      expect(tabIndexes(options)).toEqual(['-1', '-1']);
    });
  });

  describe('activation guard', () => {
    function setupWithModel(options) {
      const setup = createOpenSelect(options);
      const set = vi.fn();
      setup.root._h_model.set = set;
      setup.root._h_model.get = () => '';
      return { ...setup, set };
    }

    it('does not select a disabled option on Enter', () => {
      const { options, set } = setupWithModel({ count: 2, disabled: [1] });
      keydown(options[1], 'Enter');
      expect(set).not.toHaveBeenCalled();
    });

    it('does not select a disabled option on click', () => {
      const { options, set } = setupWithModel({ count: 2, disabled: [1] });
      options[1].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      expect(set).not.toHaveBeenCalled();
    });

    it('still selects an enabled option on Enter and on click', () => {
      const { options, set } = setupWithModel({ count: 2 });
      keydown(options[0], 'Enter');
      expect(set).toHaveBeenCalled();
      set.mockClear();
      options[1].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      expect(set).toHaveBeenCalled();
    });

    it('requires the explicit "true" value, so a bare aria-disabled is selectable', () => {
      const { options, set } = setupWithModel({ count: 3, bareDisabled: [1] });
      options[1].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      expect(set).toHaveBeenCalled();
    });

    // The whole point of aria-disabled over the native attribute. Focus lands on
    // the option so it is announced, and Enter then does nothing.
    it('is reachable by the arrow keys but still cannot be selected', () => {
      const { root, options, set } = setupWithModel({ count: 2, disabled: [1] });
      keydown(root, 'ArrowDown');
      keydown(root, 'ArrowDown');
      expect(document.activeElement).toBe(options[1]);
      keydown(options[1], 'Enter');
      expect(set).not.toHaveBeenCalled();
    });

    // Activating a disabled option is a complete no-op. Closing the list would
    // read as though the key had done something.
    it('leaves the list open on Enter and Space over a disabled option', () => {
      for (const key of ['Enter', ' ']) {
        const { options, set, state } = setupWithModel({ count: 2, disabled: [1] });
        keydown(options[1], key);
        expect(set).not.toHaveBeenCalled();
        expect(state.expanded).toBe(true);
      }
    });

    it('still closes the list on Enter over an enabled option', () => {
      const { options, state } = setupWithModel({ count: 2 });
      keydown(options[0], 'Enter');
      expect(state.expanded).toBe(false);
    });
  });
});
