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
import { createMockAlpine, mountDirective } from '../test-utils.js';

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
  function createSelectInputSetup({ field = false } = {}) {
    const container = document.createElement('div');
    const selectEl = document.createElement('div');
    selectEl._h_select = {
      fieldLabelId: undefined,
      ariaLabelledby: undefined,
      ariaLabel: undefined,
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
    let fieldLabel;
    if (field) {
      container.setAttribute('data-slot', 'field');
      fieldLabel = document.createElement('label');
      fieldLabel.setAttribute('data-slot', 'field-label');
      container.appendChild(fieldLabel);
    }
    container.appendChild(selectEl);
    document.body.appendChild(container);
    return { container, selectEl, input, fieldLabel };
  }

  // display:none would stop the browser focusing the input on a failed submit,
  // so it stays rendered and only visually hidden.
  it('hides the input without display:none and keeps it out of the a11y tree', () => {
    const { input } = createSelectInputSetup();
    mountDirective(selectPlugin, 'h-select-input', input, {
      original: 'x-h-select-input',
      expression: '',
    });
    expect(input.classList.contains('hidden')).toBe(false);
    expect(input.classList.contains('sr-only')).toBe(true);
    expect(input.classList.contains('pointer-events-none')).toBe(true);
    expect(input.getAttribute('tabindex')).toBe('-1');
    expect(input.getAttribute('aria-hidden')).toBe('true');
    expect(input.getAttribute('type')).toBe('text');
  });

  it('mirrors a failed native constraint onto the trigger', () => {
    const { input, selectEl } = createSelectInputSetup();
    mountDirective(selectPlugin, 'h-select-input', input, {
      original: 'x-h-select-input',
      expression: '',
    });
    expect(selectEl._h_select.trigger.hasAttribute('aria-invalid')).toBe(false);
    input.dispatchEvent(new Event('invalid'));
    expect(selectEl._h_select.trigger.getAttribute('aria-invalid')).toBe('true');
  });

  it('lets an explicit aria-invalid win over tracked native validity', () => {
    const { input, selectEl } = createSelectInputSetup();
    input.setAttribute('aria-invalid', 'false');
    mountDirective(selectPlugin, 'h-select-input', input, {
      original: 'x-h-select-input',
      expression: '',
    });
    input.dispatchEvent(new Event('invalid'));
    expect(selectEl._h_select.trigger.getAttribute('aria-invalid')).toBe('false');
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
    // A button so it is labelable by a "<label for>" and focusable without a
    // tabindex, with type=button so it never submits a surrounding form.
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.getAttribute('type')).toBe('button');
  });

  it('forwards aria-label and aria-labelledby from the input to the trigger', () => {
    const { input, selectEl } = createSelectInputSetup();
    input.setAttribute('aria-label', 'Country');
    input.setAttribute('aria-labelledby', 'outside-label');
    mountDirective(selectPlugin, 'h-select-input', input, {
      original: 'x-h-select-input',
      expression: '',
    });
    expect(selectEl._h_select.trigger.getAttribute('aria-label')).toBe('Country');
    expect(selectEl._h_select.trigger.getAttribute('aria-labelledby')).toBe('outside-label');
  });

  it('leaves the trigger unnamed when the author names nothing', () => {
    const { input, selectEl } = createSelectInputSetup();
    mountDirective(selectPlugin, 'h-select-input', input, {
      original: 'x-h-select-input',
      expression: '',
    });
    expect(selectEl._h_select.trigger.hasAttribute('aria-label')).toBe(false);
    expect(selectEl._h_select.trigger.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('names the trigger from a field label', () => {
    const { input, selectEl, fieldLabel } = createSelectInputSetup({ field: true });
    mountDirective(selectPlugin, 'h-select-input', input, {
      original: 'x-h-select-input',
      expression: '',
    });
    expect(fieldLabel.getAttribute('id')).toMatch(/^hsil/);
    expect(selectEl._h_select.trigger.getAttribute('aria-labelledby')).toBe(fieldLabel.getAttribute('id'));
  });

  it('prefers an author aria-labelledby over the field label', () => {
    const { input, selectEl } = createSelectInputSetup({ field: true });
    input.setAttribute('aria-labelledby', 'my-label');
    mountDirective(selectPlugin, 'h-select-input', input, {
      original: 'x-h-select-input',
      expression: '',
    });
    expect(selectEl._h_select.trigger.getAttribute('aria-labelledby')).toBe('my-label');
  });

  it('sets the trigger id from data-id and leaves the input id alone', () => {
    const { input, selectEl } = createSelectInputSetup();
    input.setAttribute('data-id', 'country-trigger');
    input.setAttribute('id', 'country-value');
    mountDirective(selectPlugin, 'h-select-input', input, {
      original: 'x-h-select-input',
      expression: '',
    });
    expect(selectEl._h_select.trigger.getAttribute('id')).toBe('country-trigger');
    expect(input.getAttribute('id')).toBe('country-value');
  });

  it('mirrors aria-invalid and required onto the trigger', () => {
    const { input, selectEl } = createSelectInputSetup();
    input.setAttribute('aria-invalid', 'true');
    input.required = true;
    mountDirective(selectPlugin, 'h-select-input', input, {
      original: 'x-h-select-input',
      expression: '',
    });
    expect(selectEl._h_select.trigger.getAttribute('aria-invalid')).toBe('true');
    expect(selectEl._h_select.trigger.getAttribute('aria-required')).toBe('true');
  });

  it('disables the trigger with the input, so it cannot be opened', () => {
    const { input, selectEl } = createSelectInputSetup();
    input.disabled = true;
    mountDirective(selectPlugin, 'h-select-input', input, {
      original: 'x-h-select-input',
      expression: '',
    });
    expect(selectEl._h_select.trigger.disabled).toBe(true);
    selectEl._h_select.trigger.click();
    expect(selectEl._h_select.expanded).toBe(false);
  });

  it('keeps the trigger in sync when the input attributes change', async () => {
    const { input, selectEl } = createSelectInputSetup();
    mountDirective(selectPlugin, 'h-select-input', input, {
      original: 'x-h-select-input',
      expression: '',
    });
    input.setAttribute('aria-label', 'Country');
    input.setAttribute('data-id', 'country-trigger');
    input.disabled = true;
    // MutationObserver callbacks are asynchronous.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(selectEl._h_select.trigger.getAttribute('aria-label')).toBe('Country');
    expect(selectEl._h_select.trigger.getAttribute('id')).toBe('country-trigger');
    expect(selectEl._h_select.trigger.disabled).toBe(true);
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

  // The option's multiple-mode activation delegates the whole toggle to this
  // setter, so its contract is what keeps the model array flat.
  it('toggles an array model value in and out through _h_model.set and dispatches change', () => {
    const { input, selectEl } = createSelectInputSetup();
    const model = ['apple'];
    input._x_model = { get: () => model, set: vi.fn() };
    mountDirective(selectPlugin, 'h-select-input', input, {
      original: 'x-h-select-input',
      expression: '',
    });
    expect(selectEl._h_select.multiple).toBe(true);
    const onChange = vi.fn();
    input.addEventListener('change', onChange);
    selectEl._h_model.set('apple');
    expect(model).toEqual([]);
    expect(onChange).toHaveBeenCalledTimes(1);
    selectEl._h_model.set('banana');
    expect(model).toEqual(['banana']);
    expect(onChange).toHaveBeenCalledTimes(2);
    input.removeEventListener('change', onChange);
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

// Programmatic writes to the bound property (a reusable dialog swapping its
// record) dispatch no change event, so the select has to follow the model
// itself. The stub's getter reads a reactive store so the directive's model
// effect re-runs when the test reassigns it, like Alpine's scope would.
describe('h-select-input model binding', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function createModelSelect(initialValue) {
    const store = createMockAlpine().reactive({ value: initialValue });
    const root = document.createElement('div');
    document.body.appendChild(root);
    mountDirective(selectPlugin, 'h-select', root, { modifiers: [] });

    const input = document.createElement('input');
    input.type = 'text';
    input._x_model = { get: () => store.value, set: (value) => (store.value = value) };
    root.appendChild(input);
    mountDirective(selectPlugin, 'h-select-input', input, { original: 'x-h-select-input', expression: '' });

    const options = {};
    for (const [label, value] of [
      ['Apple', 'apple'],
      ['Banana', 'banana'],
    ]) {
      const option = document.createElement('div');
      option.setAttribute('data-value', value);
      root.appendChild(option);
      mountDirective(selectPlugin, 'h-select-option', option, { original: 'x-h-select-option', expression: `'${label}'` }, { evaluateLater: () => (cb) => cb(label) });
      options[value] = option;
    }
    return { root, input, store, options, state: root._h_select };
  }

  const isSelected = (option) => option.getAttribute('aria-selected') === 'true' && !option.querySelector('span[aria-hidden]').classList.contains('invisible');

  it('reflects a programmatic model replacement without any change event', () => {
    const { store, options, state } = createModelSelect([]);
    expect(state.label).toEqual([]);
    store.value = ['apple'];
    expect(state.label).toEqual(['Apple']);
    expect(isSelected(options.apple)).toBe(true);
    expect(isSelected(options.banana)).toBe(false);
  });

  // The mode used to be read once at init, so a property that only became an
  // array later locked the select into single mode, and a toggle then replaced
  // the consumer's array with a plain string.
  it('recomputes multiple from the model type and appends on toggle', () => {
    const { root, store, options, state } = createModelSelect(undefined);
    expect(state.multiple).toBe(false);
    store.value = ['apple'];
    expect(state.multiple).toBe(true);
    expect(state.label).toEqual(['Apple']);
    expect(isSelected(options.apple)).toBe(true);
    root._h_model.set('banana');
    expect(store.value).toEqual(['apple', 'banana']);
  });

  // Each option registers its listener before its own label effect, so the last
  // option to mount still resolves a preselected value pointing at it.
  it('resolves a preselected value whose option registers last at mount', () => {
    const { options, state } = createModelSelect('banana');
    expect(state.label).toEqual(['Banana']);
    expect(isSelected(options.banana)).toBe(true);
    expect(isSelected(options.apple)).toBe(false);
  });
});

function createSelectPopupSetup(stateOverrides = {}) {
  const container = document.createElement('div');
  const selectEl = document.createElement('div');
  const fakeTrigger = document.createElement('button');
  selectEl._h_select = {
    fieldLabelId: undefined,
    ariaLabelledby: undefined,
    ariaLabel: undefined,
    trigger: fakeTrigger,
    controls: 'hsc-test',
    expanded: false,
    multiple: false,
    ...stateOverrides,
  };
  const content = document.createElement('div');
  const list = document.createElement('div');
  content.appendChild(list);
  selectEl.appendChild(content);
  container.appendChild(selectEl);
  document.body.appendChild(container);
  return { container, selectEl, content, list };
}

describe('h-select-content', () => {
  it('applies base classes', () => {
    const { content } = createSelectPopupSetup();
    mountDirective(selectPlugin, 'h-select-content', content, {
      original: 'x-h-select-content',
    });
    expect(content.classList.contains('absolute')).toBe(true);
    expect(content.classList.contains('bg-popover')).toBe(true);
    expect(content.classList.contains('hidden')).toBe(true);
  });

  // The popup is a plain container: the list inside it owns the listbox role and
  // does the scrolling, so a search row above it never scrolls away.
  it('is a column that does not scroll and carries no padding', () => {
    const { content } = createSelectPopupSetup();
    mountDirective(selectPlugin, 'h-select-content', content, {
      original: 'x-h-select-content',
    });
    expect(content.classList.contains('flex')).toBe(true);
    expect(content.classList.contains('flex-col')).toBe(true);
    expect(content.classList.contains('overflow-hidden')).toBe(true);
    expect(content.classList.contains('overflow-y-auto')).toBe(false);
    expect(content.classList.contains('p-1')).toBe(false);
  });

  it('sets data-slot and takes no listbox semantics', () => {
    const { content } = createSelectPopupSetup();
    mountDirective(selectPlugin, 'h-select-content', content, {
      original: 'x-h-select-content',
    });
    expect(content.getAttribute('data-slot')).toBe('select-content');
    expect(content.hasAttribute('role')).toBe(false);
    expect(content.hasAttribute('id')).toBe(false);
    expect(content.hasAttribute('tabindex')).toBe(false);
    expect(content.hasAttribute('aria-labelledby')).toBe(false);
    expect(content.hasAttribute('aria-multiselectable')).toBe(false);
  });

  it('calls cleanup', () => {
    const { content } = createSelectPopupSetup();
    const { ctx } = mountDirective(selectPlugin, 'h-select-content', content, {
      original: 'x-h-select-content',
    });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  describe('open and close', () => {
    function mountReactiveContent() {
      const { selectEl, content } = createSelectPopupSetup();
      selectEl._h_select = createMockAlpine().reactive(selectEl._h_select);
      mountDirective(selectPlugin, 'h-select-content', content, {
        original: 'x-h-select-content',
      });
      return { selectEl, content };
    }

    afterEach(() => {
      vi.useRealTimers();
    });

    it('stops intercepting pointer events the moment the close starts', () => {
      const { selectEl, content } = mountReactiveContent();
      selectEl._h_select.expanded = true;
      expect(content.classList.contains('hidden')).toBe(false);
      expect(content.classList.contains('pointer-events-none')).toBe(false);
      selectEl._h_select.expanded = false;
      expect(content.classList.contains('pointer-events-none')).toBe(true);
      expect(content.classList.contains('hidden')).toBe(false);
      content.dispatchEvent(new Event('transitionend'));
      expect(content.classList.contains('hidden')).toBe(true);
    });

    it('hides via the fallback timer when transitionend never fires', () => {
      vi.useFakeTimers();
      const { selectEl, content } = mountReactiveContent();
      selectEl._h_select.expanded = true;
      selectEl._h_select.expanded = false;
      expect(content.classList.contains('hidden')).toBe(false);
      vi.advanceTimersByTime(250);
      expect(content.classList.contains('hidden')).toBe(true);
    });

    // A transitionend from the abandoned close used to pass the old opacity-0
    // class guard and wedge the reopened popup hidden.
    it('ignores a late transitionend when reopened mid-fade', () => {
      const { selectEl, content } = mountReactiveContent();
      selectEl._h_select.expanded = true;
      selectEl._h_select.expanded = false;
      selectEl._h_select.expanded = true;
      expect(content.classList.contains('pointer-events-none')).toBe(false);
      content.dispatchEvent(new Event('transitionend'));
      expect(content.classList.contains('hidden')).toBe(false);
    });
  });
});

describe('h-select-list', () => {
  const mountList = (list) => mountDirective(selectPlugin, 'h-select-list', list, { original: 'x-h-select-list' });

  it('is the listbox and the scroll container', () => {
    const { list, selectEl } = createSelectPopupSetup();
    mountList(list);
    expect(list.getAttribute('data-slot')).toBe('select-list');
    expect(list.getAttribute('role')).toBe('listbox');
    expect(list.getAttribute('tabindex')).toBe('-1');
    expect(list.getAttribute('id')).toBe(selectEl._h_select.controls);
    expect(list.classList.contains('overflow-y-auto')).toBe(true);
    expect(list.classList.contains('min-h-0')).toBe(true);
    expect(list.classList.contains('p-1')).toBe(true);
  });

  // An unnamed select used to leave aria-labelledby="undefined" on the listbox,
  // pointing it at an id that cannot exist.
  it('leaves the listbox unnamed when the select has no label', () => {
    const { list } = createSelectPopupSetup();
    mountList(list);
    expect(list.hasAttribute('aria-labelledby')).toBe(false);
    expect(list.hasAttribute('aria-label')).toBe(false);
  });

  it('names the listbox from the resolved select label', () => {
    const { list } = createSelectPopupSetup({ ariaLabelledby: 'label-id' });
    mountList(list);
    expect(list.getAttribute('aria-labelledby')).toBe('label-id');
    expect(list.hasAttribute('aria-label')).toBe(false);
  });

  it('falls back to aria-label for the listbox name', () => {
    const { list } = createSelectPopupSetup({ ariaLabel: 'Country' });
    mountList(list);
    expect(list.getAttribute('aria-label')).toBe('Country');
    expect(list.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('marks the listbox multiselectable only for a multiple select', () => {
    const { list } = createSelectPopupSetup();
    mountList(list);
    expect(list.hasAttribute('aria-multiselectable')).toBe(false);

    const multiple = createSelectPopupSetup({ multiple: true });
    mountList(multiple.list);
    expect(multiple.list.getAttribute('aria-multiselectable')).toBe('true');
  });

  it('throws outside a select', () => {
    const el = document.createElement('div');
    expect(() => mountList(el)).toThrow();
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

describe('h-select-group', () => {
  it('exposes the group role and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(selectPlugin, 'h-select-group', el);
    expect(el.getAttribute('data-slot')).toBe('select-group');
    // Without the role the listbox owns a generic element and the group label is
    // dropped.
    expect(el.getAttribute('role')).toBe('group');
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
  function mountOption(bindings = {}, { description, children = [], value } = {}) {
    const host = document.createElement('div');
    document.body.appendChild(host);
    mountDirective(selectPlugin, 'h-select', host, { modifiers: [] });
    host._h_model = { get: () => '', set: () => {} };
    host._h_select.refreshLabel = () => {};

    const option = document.createElement('div');
    if (value != null) option.setAttribute('data-value', value);
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

  it('selects in multiple mode through _h_model.set with the raw value, not a direct push', () => {
    const { host, option } = mountOption({ expression: "'Apple'" }, { value: 'apple' });
    host._h_select.multiple = true;
    const model = [];
    const set = vi.fn();
    host._h_model = { get: () => model, set };
    option.click();
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith('apple');
    // The option must not touch the model array itself.
    expect(model).toEqual([]);
  });

  it('deselects in multiple mode through _h_model.set, never splicing the model itself', () => {
    const { host, option } = mountOption({ expression: "'Apple'" }, { value: 'apple' });
    host._h_select.multiple = true;
    const model = ['apple'];
    const set = vi.fn();
    host._h_model = { get: () => model, set };
    option.click();
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith('apple');
    expect(model).toEqual(['apple']);
  });

  // Encodes the reported corruption: one deselect used to leave [['apple']] in the
  // model (splice's return value pushed back in by set) instead of [].
  it('round-trips select and deselect against the model toggle without nesting arrays', () => {
    const { host, option } = mountOption({ expression: "'Apple'" }, { value: 'apple' });
    host._h_select.multiple = true;
    const model = ['apple'];
    host._h_model = {
      get: () => model,
      set: (value) => {
        const vIndex = model.indexOf(value);
        if (vIndex > -1) model.splice(vIndex, 1);
        else model.push(value);
      },
    };
    option.click();
    expect(model).toEqual([]);
    option.click();
    expect(model).toEqual(['apple']);
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

describe('h-select-search', () => {
  function mountSearch(attrs = {}) {
    const host = document.createElement('div');
    document.body.appendChild(host);
    mountDirective(selectPlugin, 'h-select', host, { modifiers: [] });
    const search = document.createElement('div');
    for (const [name, value] of Object.entries(attrs)) search.setAttribute(name, value);
    host.appendChild(search);
    mountDirective(selectPlugin, 'h-select-search', search, { original: 'x-h-select-search' });
    return { host, search, input: search.querySelector('input') };
  }

  // The combobox has to be the focusable input. On the wrapper the role sat on an
  // element no keyboard user could reach.
  it('puts the combobox semantics on the input, not on the row', () => {
    const { host, search, input } = mountSearch();
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-controls')).toBe(host._h_select.controls);
    expect(input.getAttribute('aria-haspopup')).toBe('listbox');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(search.hasAttribute('role')).toBe(false);
    expect(search.hasAttribute('aria-controls')).toBe(false);
    expect(search.hasAttribute('aria-expanded')).toBe(false);
    expect(search.getAttribute('data-slot')).toBe('select-search');
  });

  it('names the search input, overridably', () => {
    expect(mountSearch().input.getAttribute('aria-label')).toBe('Search');
    expect(mountSearch({ 'aria-label': 'Filter fruits' }).input.getAttribute('aria-label')).toBe('Filter fruits');
  });

  it('gives the search input its own data-slot so it cannot be mistaken for the trigger', () => {
    expect(mountSearch().input.getAttribute('data-slot')).toBe('select-search-input');
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
    root.appendChild(content);
    mountDirective(selectPlugin, 'h-select-content', content, { original: 'x-h-select-content' });

    if (search) {
      const searchEl = document.createElement('div');
      content.appendChild(searchEl);
      mountDirective(selectPlugin, 'h-select-search', searchEl, { original: 'x-h-select-search' });
    }

    // The list carries the id the trigger's aria-controls points at, so it is
    // what the keyboard code resolves the options from.
    const list = document.createElement('div');
    content.appendChild(list);
    mountDirective(selectPlugin, 'h-select-list', list, { original: 'x-h-select-list' });

    const options = [];
    for (let i = 0; i < count; i++) {
      const option = document.createElement('div');
      const label = labels?.[i] ?? `Option ${i + 1}`;
      if (disabled.includes(i)) option.setAttribute('aria-disabled', 'true');
      if (bareDisabled.includes(i)) option.setAttribute('aria-disabled', '');
      if (descriptions[i] != null) option.setAttribute('data-description', descriptions[i]);
      list.appendChild(option);
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
    return { root, content, list, options, input, state: root._h_select };
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
