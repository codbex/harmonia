import { vi } from 'vitest';

export function createMockAlpine() {
  const _directives = {};
  return {
    _directives,
    directive(name, fn) {
      _directives[name] = fn;
    },
    reactive(obj) {
      return obj;
    },
    findClosest(el, fn) {
      let current = el;
      while (current) {
        if (fn(current)) return current;
        current = current.parentElement;
      }
      return null;
    },
    prefixed(str) {
      return `x-${str}`;
    },
    closestDataStack() {
      return [{}];
    },
    addScopeToNode: vi.fn(),
    mutateDom(fn) {
      fn();
    },
    nextTick(fn) {
      fn();
    },
    initTree: vi.fn(),
    destroyTree: vi.fn(),
  };
}

export function createMockContext(alpine, overrides = {}) {
  return {
    cleanup: vi.fn(),
    effect: (fn) => fn(),
    evaluate: vi.fn().mockReturnValue(null),
    evaluateLater: () => (cb) => cb(''),
    Alpine: alpine,
    ...overrides,
  };
}

export function mountDirective(plugin, directiveName, el, bindings = {}, contextOverrides = {}) {
  const alpine = createMockAlpine();
  plugin(alpine);
  const fn = alpine._directives[directiveName];
  if (!fn) throw new Error(`Directive '${directiveName}' not registered on mock alpine. Available: ${Object.keys(alpine._directives).join(', ')}`);
  const ctx = createMockContext(alpine, contextOverrides);
  fn(el, { modifiers: [], expression: '', ...bindings }, ctx);
  return { el, ctx, alpine };
}
