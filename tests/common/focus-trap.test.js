import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { focusTrap } from '../../src/common/focus-trap.js';

describe('focusTrap', () => {
  let opener;
  let el;
  let first;
  let last;
  let trap;

  const tab = (shiftKey = false) => {
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true });
    (document.activeElement ?? el).dispatchEvent(event);
    return event;
  };

  beforeEach(() => {
    opener = document.createElement('button');
    document.body.appendChild(opener);
    el = document.createElement('div');
    el.setAttribute('tabindex', '-1');
    document.body.appendChild(el);
    first = document.createElement('input');
    last = document.createElement('button');
    el.append(first, last);
    trap = focusTrap(el);
  });

  afterEach(() => {
    // The trap listens on the document, so it has to be torn down rather than
    // just dropped, or it keeps trapping into the next test.
    trap.dispose();
    document.body.innerHTML = '';
  });

  it('wraps forward from the last focusable element to the first', () => {
    opener.focus();
    trap.trap();
    last.focus();
    expect(tab().defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it('wraps backward from the first focusable element to the last', () => {
    trap.trap();
    first.focus();
    expect(tab(true).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  it('leaves Tab between two inner elements to the browser', () => {
    trap.trap();
    first.focus();
    expect(tab().defaultPrevented).toBe(false);
  });

  it('pulls focus in when it is somewhere outside', () => {
    trap.trap();
    opener.focus();
    expect(tab().defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it('holds focus on the element itself when it has nothing focusable inside', () => {
    el.replaceChildren();
    trap.trap();
    expect(tab().defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(el);
  });

  it('skips a disabled control when wrapping', () => {
    last.setAttribute('disabled', '');
    trap.trap();
    first.focus();
    expect(tab(true).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it('picks up content added after it started trapping', () => {
    trap.trap();
    const added = document.createElement('button');
    el.appendChild(added);
    added.focus();
    expect(tab().defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it('returns focus to whatever had it when the trap started', () => {
    opener.focus();
    trap.trap();
    first.focus();
    trap.release();
    expect(document.activeElement).toBe(opener);
  });

  it('leaves focus alone when the opener is gone by the time it is released', () => {
    opener.focus();
    trap.trap();
    first.focus();
    opener.remove();
    trap.release();
    expect(document.activeElement).toBe(first);
  });

  it('stops containing focus once released', () => {
    trap.trap();
    trap.release();
    last.focus();
    expect(tab().defaultPrevented).toBe(false);
  });

  it('stops containing focus once disposed, without moving focus', () => {
    opener.focus();
    trap.trap();
    first.focus();
    trap.dispose();
    expect(document.activeElement).toBe(first);
    last.focus();
    expect(tab().defaultPrevented).toBe(false);
  });
});

// document.activeElement stops at the shadow host, so a trap that reads it
// directly sees every Tab as focus arriving from outside and pins focus to the
// first or last element instead of letting it move.
describe('focusTrap inside a shadow root', () => {
  let host;
  let root;
  let opener;
  let el;
  let first;
  let middle;
  let last;
  let trap;

  // composed, like a real key event: without it the keydown would not cross the
  // shadow boundary and would never reach the document-level listener.
  const tab = (shiftKey = false) => {
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true, composed: true });
    (root.activeElement ?? el).dispatchEvent(event);
    return event;
  };

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
    root = host.attachShadow({ mode: 'open' });
    opener = document.createElement('button');
    el = document.createElement('div');
    el.setAttribute('tabindex', '-1');
    root.append(opener, el);
    first = document.createElement('input');
    middle = document.createElement('input');
    last = document.createElement('button');
    el.append(first, middle, last);
    trap = focusTrap(el);
  });

  afterEach(() => {
    trap.dispose();
    document.body.innerHTML = '';
  });

  it('leaves Tab between two inner elements to the browser', () => {
    trap.trap();
    first.focus();
    expect(tab().defaultPrevented).toBe(false);
    middle.focus();
    expect(tab().defaultPrevented).toBe(false);
  });

  it('leaves Shift+Tab between two inner elements to the browser', () => {
    trap.trap();
    middle.focus();
    expect(tab(true).defaultPrevented).toBe(false);
  });

  it('still wraps at the ends', () => {
    trap.trap();
    last.focus();
    expect(tab().defaultPrevented).toBe(true);
    expect(root.activeElement).toBe(first);
    expect(tab(true).defaultPrevented).toBe(true);
    expect(root.activeElement).toBe(last);
  });

  it('returns focus to the opener inside the shadow root', () => {
    opener.focus();
    trap.trap();
    first.focus();
    trap.release();
    expect(root.activeElement).toBe(opener);
  });
});
