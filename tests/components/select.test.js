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
