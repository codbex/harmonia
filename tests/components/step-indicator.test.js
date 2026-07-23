import { beforeEach, describe, expect, it, vi } from 'vitest';
import stepIndicatorPlugin from '../../src/components/step-indicator.js';
import { mountDirective } from '../test-utils.js';

describe('h-step-indicator', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('registers all step indicator directives', () => {
    const { alpine } = mountDirective(stepIndicatorPlugin, 'h-step-indicator', el);
    expect(alpine._directives['h-step-indicator']).toBeDefined();
    expect(alpine._directives['h-step-indicator-item']).toBeDefined();
    expect(alpine._directives['h-step-indicator-trigger']).toBeDefined();
    expect(alpine._directives['h-step-indicator-marker']).toBeDefined();
    expect(alpine._directives['h-step-indicator-content']).toBeDefined();
    expect(alpine._directives['h-step-indicator-title']).toBeDefined();
    expect(alpine._directives['h-step-indicator-description']).toBeDefined();
    expect(alpine._directives['h-step-indicator-separator']).toBeDefined();
    expect(alpine._directives['h-step-indicator-counter']).toBeDefined();
    expect(alpine._directives['h-step-indicator-progress']).toBeDefined();
  });

  it('sets data-slot="step-indicator"', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator', el);
    expect(el.getAttribute('data-slot')).toBe('step-indicator');
  });

  it('defaults data-orientation to horizontal when absent', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator', el);
    expect(el.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('leaves an explicit data-orientation untouched', () => {
    el.setAttribute('data-orientation', 'vertical');
    mountDirective(stepIndicatorPlugin, 'h-step-indicator', el);
    expect(el.getAttribute('data-orientation')).toBe('vertical');
  });

  it('stores the active-step expression for children', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator', el, { expression: 'currentStep' });
    expect(el._h_step_indicator.expression).toBe('currentStep');
  });

  it('exposes a reactive item registry with register/unregister', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator', el, { expression: 'currentStep' });
    expect(Array.isArray(el._h_step_indicator.items)).toBe(true);
    expect(el._h_step_indicator.items).toHaveLength(0);

    const a = { step: 1 };
    const b = { step: 2 };
    el._h_step_indicator.register(a);
    el._h_step_indicator.register(b);
    el._h_step_indicator.register(a); // ignores duplicates
    expect(el._h_step_indicator.items).toHaveLength(2);

    el._h_step_indicator.unregister(a);
    expect(el._h_step_indicator.items).toEqual([b]);
  });
});

describe('h-step-indicator-item', () => {
  let rootEl, el;

  // Expression-aware evaluateLater mock: the root's active-step expression
  // ('currentStep') resolves to `active`; an item's step expression is a JS
  // expression evaluated in scope (here the literal number strings).
  const evalWith = (active) => (expr) => (cb) => cb(expr === 'currentStep' ? active : Number(expr));

  let registry;

  beforeEach(() => {
    rootEl = document.createElement('div');
    registry = [];
    rootEl._h_step_indicator = {
      expression: 'currentStep',
      items: registry,
      register: (state) => registry.push(state),
      unregister: (state) => registry.splice(registry.indexOf(state), 1),
    };
    el = document.createElement('div');
    rootEl.appendChild(el);
    document.body.appendChild(rootEl);
  });

  it('sets data-slot="step-indicator-item"', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-item', el, { expression: '1' });
    expect(el.getAttribute('data-slot')).toBe('step-indicator-item');
  });

  it('registers its state on the root and unregisters on cleanup', () => {
    const { ctx } = mountDirective(stepIndicatorPlugin, 'h-step-indicator-item', el, { expression: '1' });
    expect(registry).toContain(el._h_step_indicator_item);
    // cleanup is the vi.fn mock; run the registered teardown to verify removal.
    ctx.cleanup.mock.calls.forEach(([fn]) => fn());
    expect(registry).not.toContain(el._h_step_indicator_item);
  });

  it('carries the collapse-mode visibility classes', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-item', el, { expression: '1' });
    expect(el.classList.contains('group-data-[collapsed=true]/step-indicator:data-[state=inactive]:hidden')).toBe(true);
    expect(el.classList.contains('group-data-[collapsed=true]/step-indicator:data-[state=completed]:hidden')).toBe(true);
  });

  it('creates reactive state with the parsed step number', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-item', el, { expression: '2' }, { evaluateLater: evalWith(1) });
    expect(el._h_step_indicator_item.step).toBe(2);
  });

  it('evaluates the step as a JS expression, not a literal (x-for usage)', () => {
    // Simulates `x-h-step-indicator-item="i + 1"` inside x-for: the expression
    // must be evaluated (here to 2), not parsed with Number("i + 1") (NaN).
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-item', el, { expression: 'i + 1' }, { evaluateLater: (expr) => (cb) => cb({ 'i + 1': 2, currentStep: 2 }[expr]) });
    expect(el._h_step_indicator_item.step).toBe(2);
    expect(el._h_step_indicator_item.state).toBe('active');
    expect(el.getAttribute('data-state')).toBe('active');
  });

  it('throws when not inside a step indicator', () => {
    const orphan = document.createElement('div');
    document.body.appendChild(orphan);
    expect(() => mountDirective(stepIndicatorPlugin, 'h-step-indicator-item', orphan, { original: 'h-step-indicator-item', expression: '1' })).toThrow();
  });

  it('marks the item completed when its step is before the active step', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-item', el, { expression: '1' }, { evaluateLater: evalWith(2) });
    expect(el._h_step_indicator_item.state).toBe('completed');
    expect(el.getAttribute('data-state')).toBe('completed');
  });

  it('marks the item active when its step equals the active step', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-item', el, { expression: '2' }, { evaluateLater: evalWith(2) });
    expect(el._h_step_indicator_item.state).toBe('active');
    expect(el.getAttribute('data-state')).toBe('active');
  });

  it('marks the item inactive when its step is after the active step', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-item', el, { expression: '3' }, { evaluateLater: evalWith(2) });
    expect(el._h_step_indicator_item.state).toBe('inactive');
    expect(el.getAttribute('data-state')).toBe('inactive');
  });
});

describe('h-step-indicator-trigger', () => {
  let rootEl, itemEl, triggerEl;

  beforeEach(() => {
    rootEl = document.createElement('div');
    rootEl._h_step_indicator = { expression: 'currentStep' };

    itemEl = document.createElement('div');
    itemEl._h_step_indicator_item = { step: 2, state: 'inactive' };
    rootEl.appendChild(itemEl);

    triggerEl = document.createElement('button');
    itemEl.appendChild(triggerEl);

    document.body.appendChild(rootEl);
  });

  it('sets data-slot="step-indicator-trigger"', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-trigger', triggerEl, { original: 'h-step-indicator-trigger' });
    expect(triggerEl.getAttribute('data-slot')).toBe('step-indicator-trigger');
  });

  it('writes the item step to the active-step expression on click', () => {
    const evaluate = vi.fn();
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-trigger', triggerEl, { original: 'h-step-indicator-trigger' }, { evaluate });
    triggerEl.dispatchEvent(new Event('click'));
    expect(evaluate).toHaveBeenCalledWith('currentStep = 2');
  });

  it('does not navigate when disabled', () => {
    const evaluate = vi.fn();
    triggerEl.disabled = true;
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-trigger', triggerEl, { original: 'h-step-indicator-trigger' }, { evaluate });
    triggerEl.dispatchEvent(new Event('click'));
    expect(evaluate).not.toHaveBeenCalled();
  });

  it('does not navigate when data-non-interactive is true', () => {
    const evaluate = vi.fn();
    triggerEl.setAttribute('data-non-interactive', 'true');
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-trigger', triggerEl, { original: 'h-step-indicator-trigger' }, { evaluate });
    triggerEl.dispatchEvent(new Event('click'));
    expect(evaluate).not.toHaveBeenCalled();
  });

  it('sets aria-current="step" when the item is active', () => {
    itemEl._h_step_indicator_item = { step: 2, state: 'active' };
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-trigger', triggerEl, { original: 'h-step-indicator-trigger' });
    expect(triggerEl.getAttribute('aria-current')).toBe('step');
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(stepIndicatorPlugin, 'h-step-indicator-trigger', triggerEl, { original: 'h-step-indicator-trigger' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('throws when not inside a step indicator item', () => {
    const orphan = document.createElement('button');
    rootEl.appendChild(orphan);
    expect(() => mountDirective(stepIndicatorPlugin, 'h-step-indicator-trigger', orphan, { original: 'h-step-indicator-trigger' })).toThrow();
  });
});

describe('h-step-indicator-marker', () => {
  let itemEl, el;

  beforeEach(() => {
    itemEl = document.createElement('div');
    itemEl._h_step_indicator_item = { step: 1, state: 'inactive' };
    el = document.createElement('span');
    itemEl.appendChild(el);
    document.body.appendChild(itemEl);
  });

  it('adds base circle classes', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-marker', el, { original: 'h-step-indicator-marker' });
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('size-8')).toBe(true);
  });

  it('sets data-slot="step-indicator-marker"', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-marker', el, { original: 'h-step-indicator-marker' });
    expect(el.getAttribute('data-slot')).toBe('step-indicator-marker');
  });

  it('does not inject any content', () => {
    el.textContent = 'X';
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-marker', el, { original: 'h-step-indicator-marker' });
    expect(el.textContent).toBe('X');
  });

  it('throws when not inside a step indicator item', () => {
    const orphan = document.createElement('span');
    document.body.appendChild(orphan);
    expect(() => mountDirective(stepIndicatorPlugin, 'h-step-indicator-marker', orphan, { original: 'h-step-indicator-marker' })).toThrow();
  });
});

describe('h-step-indicator-content', () => {
  it('adds layout classes and data-slot', () => {
    const el = document.createElement('span');
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-content', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('gap-1')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('step-indicator-content');
  });
});

describe('h-step-indicator-title', () => {
  it('adds base classes and data-slot', () => {
    const el = document.createElement('span');
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-title', el);
    expect(el.classList.contains('font-medium')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('step-indicator-title');
  });
});

describe('h-step-indicator-description', () => {
  it('adds base classes and data-slot', () => {
    const el = document.createElement('span');
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-description', el);
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('step-indicator-description');
  });
});

describe('h-step-indicator-separator', () => {
  let itemEl, el;

  beforeEach(() => {
    itemEl = document.createElement('div');
    itemEl._h_step_indicator_item = { step: 1, state: 'completed' };
    el = document.createElement('div');
    itemEl.appendChild(el);
    document.body.appendChild(itemEl);
  });

  it('adds base classes', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-separator', el, { original: 'h-step-indicator-separator' });
    expect(el.classList.contains('bg-border')).toBe(true);
    expect(el.classList.contains('flex-1')).toBe(true);
  });

  it('sets data-slot="step-indicator-separator"', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-separator', el, { original: 'h-step-indicator-separator' });
    expect(el.getAttribute('data-slot')).toBe('step-indicator-separator');
  });

  it('hides itself when the indicator is collapsed', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-separator', el, { original: 'h-step-indicator-separator' });
    expect(el.classList.contains('group-data-[collapsed=true]/step-indicator:hidden')).toBe(true);
  });

  it('throws when not inside a step indicator item', () => {
    const orphan = document.createElement('div');
    document.body.appendChild(orphan);
    expect(() => mountDirective(stepIndicatorPlugin, 'h-step-indicator-separator', orphan, { original: 'h-step-indicator-separator' })).toThrow();
  });
});

describe('h-step-indicator-counter', () => {
  let rootEl, el;

  // The counter evaluates the root's active-step expression ('currentStep').
  const evalActive = (active) => (expr) => (cb) => cb(expr === 'currentStep' ? active : '');

  beforeEach(() => {
    rootEl = document.createElement('div');
    rootEl._h_step_indicator = { expression: 'currentStep', items: [{ step: 1 }, { step: 2 }, { step: 3 }] };
    el = document.createElement('span');
    rootEl.appendChild(el);
    document.body.appendChild(rootEl);
  });

  it('sets data-slot and reveals only when collapsed', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-counter', el, { original: 'h-step-indicator-counter' }, { evaluateLater: evalActive(2) });
    expect(el.getAttribute('data-slot')).toBe('step-indicator-counter');
    expect(el.classList.contains('hidden')).toBe(true);
    expect(el.classList.contains('group-data-[collapsed=true]/step-indicator:block')).toBe(true);
  });

  it('renders "Step <active> of <total>" from the active step and item count', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-counter', el, { original: 'h-step-indicator-counter' }, { evaluateLater: evalActive(2) });
    expect(el.textContent).toBe('Step 2 of 3');
  });

  it('honors data-step-label and data-of-label overrides', () => {
    el.setAttribute('data-step-label', 'Stap');
    el.setAttribute('data-of-label', 'van');
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-counter', el, { original: 'h-step-indicator-counter' }, { evaluateLater: evalActive(2) });
    expect(el.textContent).toBe('Stap 2 van 3');
  });

  it('throws when not inside a step indicator', () => {
    const orphan = document.createElement('span');
    document.body.appendChild(orphan);
    expect(() => mountDirective(stepIndicatorPlugin, 'h-step-indicator-counter', orphan, { original: 'h-step-indicator-counter' })).toThrow();
  });
});

describe('h-step-indicator-progress', () => {
  let rootEl, el;

  const evalActive = (active) => (expr) => (cb) => cb(expr === 'currentStep' ? active : '');

  beforeEach(() => {
    rootEl = document.createElement('div');
    rootEl._h_step_indicator = { expression: 'currentStep', items: [{ step: 1 }, { step: 2 }, { step: 3 }, { step: 4 }] };
    el = document.createElement('div');
    rootEl.appendChild(el);
    document.body.appendChild(rootEl);
  });

  it('sets data-slot, role=progressbar, and reveals only when collapsed', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-progress', el, { original: 'h-step-indicator-progress' }, { evaluateLater: evalActive(1) });
    expect(el.getAttribute('data-slot')).toBe('step-indicator-progress');
    expect(el.getAttribute('role')).toBe('progressbar');
    expect(el.classList.contains('hidden')).toBe(true);
    expect(el.classList.contains('group-data-[collapsed=true]/step-indicator:block')).toBe(true);
  });

  it('fills the indicator to active/total and updates aria values', () => {
    mountDirective(stepIndicatorPlugin, 'h-step-indicator-progress', el, { original: 'h-step-indicator-progress' }, { evaluateLater: evalActive(2) });
    const indicator = el.querySelector('[data-slot=step-indicator-progress-indicator]');
    expect(indicator).not.toBeNull();
    // active 2 of 4 -> 50% -> translateX(-50%)
    expect(indicator.style.transform).toBe('translateX(-50%)');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('4');
    expect(el.getAttribute('aria-valuenow')).toBe('2');
  });

  it('throws when not inside a step indicator', () => {
    const orphan = document.createElement('div');
    document.body.appendChild(orphan);
    expect(() => mountDirective(stepIndicatorPlugin, 'h-step-indicator-progress', orphan, { original: 'h-step-indicator-progress' })).toThrow();
  });
});
