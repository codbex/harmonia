import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addDismiss, removeDismiss } from '../../src/utils/dismiss.js';

describe('dismiss', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('invokes the handler on a document click after addDismiss', () => {
    const handler = vi.fn();
    addDismiss(el, 'click', handler);

    document.dispatchEvent(new Event('click'));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not invoke the handler after removeDismiss', () => {
    const handler = vi.fn();
    addDismiss(el, 'click', handler);
    removeDismiss(el, 'click', handler);

    document.dispatchEvent(new Event('click'));

    expect(handler).not.toHaveBeenCalled();
  });

  it('listens on the element own document (single-realm page)', () => {
    // In the default test realm window.top === window, so the only target is the
    // element's own document; verify the listener is attached there.
    const handler = vi.fn();
    const spy = vi.spyOn(el.ownerDocument, 'addEventListener');

    addDismiss(el, 'click', handler);

    expect(spy).toHaveBeenCalledWith('click', handler, undefined);
    spy.mockRestore();
  });

  it('attaches to the parent document when the element lives in a same-origin iframe', () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    const frameDoc = iframe.contentDocument;
    const inner = frameDoc.createElement('div');
    frameDoc.body.appendChild(inner);

    const frameSpy = vi.spyOn(frameDoc, 'addEventListener');
    const topSpy = vi.spyOn(document, 'addEventListener');

    const handler = vi.fn();
    addDismiss(inner, 'click', handler);

    // Listener is attached both inside the iframe and on the parent document.
    expect(frameSpy).toHaveBeenCalledWith('click', handler, undefined);
    expect(topSpy).toHaveBeenCalledWith('click', handler, undefined);

    frameSpy.mockRestore();
    topSpy.mockRestore();
    iframe.remove();
  });
});
