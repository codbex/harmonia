import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import templatePlugin from '../../src/utils/template.js';
import { createMockAlpine, createMockContext } from '../test-utils.js';

function createTemplateElement(innerHTML = '<div class="cloned-content"></div>') {
  const template = document.createElement('template');
  template.innerHTML = innerHTML;
  return template;
}

describe('h-template directive', () => {
  let alpine;

  beforeEach(() => {
    alpine = createMockAlpine();
    templatePlugin(alpine);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function invokeDirective(el, expression, evaluateReturnValue, contextOverrides = {}) {
    const fn = alpine._directives['h-template'];
    const ctx = createMockContext(alpine, {
      evaluate: vi.fn().mockReturnValue(evaluateReturnValue),
      Alpine: alpine,
      ...contextOverrides,
    });
    fn(el, { expression, modifiers: [], original: 'h-template' }, ctx);
    return { ctx };
  }

  it('registers the h-template directive', () => {
    expect(alpine._directives['h-template']).toBeTypeOf('function');
  });

  it('inserts cloned template content before el when x-data is present', () => {
    const parent = document.createElement('div');
    const el = document.createElement('div');
    el.setAttribute('x-data', '{}');
    parent.appendChild(el);
    document.body.appendChild(parent);

    const fakeTemplate = createTemplateElement('<span id="tpl-child"></span>');
    invokeDirective(el, 'myTemplate', fakeTemplate);

    expect(parent.querySelector('#tpl-child')).not.toBeNull();

    document.body.removeChild(parent);
  });

  it('calls Alpine.addScopeToNode with the cloned element', () => {
    const parent = document.createElement('div');
    const el = document.createElement('div');
    el.setAttribute('x-data', '{}');
    parent.appendChild(el);
    document.body.appendChild(parent);

    const fakeTemplate = createTemplateElement('<div class="scoped"></div>');
    invokeDirective(el, 'myTemplate', fakeTemplate);

    expect(alpine.addScopeToNode).toHaveBeenCalled();

    document.body.removeChild(parent);
  });

  it('calls Alpine.initTree with the cloned element', () => {
    const parent = document.createElement('div');
    const el = document.createElement('div');
    el.setAttribute('x-data', '{}');
    parent.appendChild(el);
    document.body.appendChild(parent);

    const fakeTemplate = createTemplateElement('<div class="init-me"></div>');
    invokeDirective(el, 'myTemplate', fakeTemplate);

    expect(alpine.initTree).toHaveBeenCalled();

    document.body.removeChild(parent);
  });

  it('does NOT insert content when x-data attribute is missing', () => {
    const parent = document.createElement('div');
    const el = document.createElement('div');
    // no x-data attribute
    parent.appendChild(el);
    document.body.appendChild(parent);

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fakeTemplate = createTemplateElement('<div class="should-not-appear"></div>');
    invokeDirective(el, 'myTemplate', fakeTemplate);

    expect(parent.querySelector('.should-not-appear')).toBeNull();

    document.body.removeChild(parent);
    consoleErrorSpy.mockRestore();
  });

  it('logs a console.error when x-data attribute is missing', () => {
    const parent = document.createElement('div');
    const el = document.createElement('div');
    parent.appendChild(el);
    document.body.appendChild(parent);

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fakeTemplate = createTemplateElement('<div></div>');
    invokeDirective(el, 'myTemplate', fakeTemplate);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

    document.body.removeChild(parent);
    consoleErrorSpy.mockRestore();
  });

  it('registers a cleanup callback', () => {
    const parent = document.createElement('div');
    const el = document.createElement('div');
    el.setAttribute('x-data', '{}');
    parent.appendChild(el);
    document.body.appendChild(parent);

    const cleanupMock = vi.fn();
    const fakeTemplate = createTemplateElement('<div class="cleanup-test"></div>');
    invokeDirective(el, 'myTemplate', fakeTemplate, { cleanup: cleanupMock });

    expect(cleanupMock).toHaveBeenCalledTimes(1);

    document.body.removeChild(parent);
  });

  it('calls evaluate with the expression string', () => {
    const parent = document.createElement('div');
    const el = document.createElement('div');
    el.setAttribute('x-data', '{}');
    parent.appendChild(el);
    document.body.appendChild(parent);

    const fakeTemplate = createTemplateElement('<div></div>');
    const evaluateMock = vi.fn().mockReturnValue(fakeTemplate);
    invokeDirective(el, 'tplExpr', fakeTemplate, { evaluate: evaluateMock });

    expect(evaluateMock).toHaveBeenCalledWith('tplExpr');

    document.body.removeChild(parent);
  });
});
