import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import backdropPlugin from '../../src/components/backdrop.js';
import { mountDirective } from '../test-utils.js';

// happy-dom does not implement window.matchMedia
vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false, addListener: vi.fn(), removeListener: vi.fn() }));

describe('h-backdrop', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('registers the backdrop directive', () => {
    const { alpine } = mountDirective(backdropPlugin, 'h-backdrop', el);
    expect(alpine._directives['h-backdrop']).toBeDefined();
  });

  it('adds base classes', () => {
    mountDirective(backdropPlugin, 'h-backdrop', el);
    expect(el.classList.contains('hidden')).toBe(true);
    expect(el.classList.contains('fixed')).toBe(true);
    expect(el.classList.contains('inset-0')).toBe(true);
    expect(el.classList.contains('z-50')).toBe(true);
    expect(el.classList.contains('bg-black/60')).toBe(true);
    expect(el.classList.contains('opacity-0')).toBe(true);
    expect(el.classList.contains('*:scale-95')).toBe(true);
  });

  it('sets tabindex="-1"', () => {
    mountDirective(backdropPlugin, 'h-backdrop', el);
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('sets data-slot="backdrop"', () => {
    mountDirective(backdropPlugin, 'h-backdrop', el);
    expect(el.getAttribute('data-slot')).toBe('backdrop');
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(backdropPlugin, 'h-backdrop', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('disconnects the observer and removes the transitionend listener on cleanup', () => {
    const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');
    const removeSpy = vi.spyOn(el, 'removeEventListener');
    const { ctx } = mountDirective(backdropPlugin, 'h-backdrop', el);
    const cleanupFn = ctx.cleanup.mock.calls[0][0];
    cleanupFn();
    expect(disconnectSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith('transitionend', expect.any(Function));
    disconnectSpy.mockRestore();
    removeSpy.mockRestore();
  });
});

describe('h-backdrop open and close', () => {
  let el;
  let mounted;

  beforeEach(() => {
    mounted = null;
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    // An open backdrop holds a document-level listener, so a test that ends
    // with one open has to tear it down rather than just drop the element.
    mounted?.ctx.cleanup.mock.calls.forEach(([fn]) => fn());
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  // MutationObserver callbacks need a task turn to be delivered.
  const flush = () => new Promise((r) => setTimeout(r, 0));

  it('stops intercepting pointer events the moment the close starts', async () => {
    mounted = mountDirective(backdropPlugin, 'h-backdrop', el);
    el.setAttribute('data-open', 'true');
    await flush();
    expect(el.classList.contains('pointer-events-none')).toBe(false);
    el.setAttribute('data-open', 'false');
    await flush();
    expect(el.classList.contains('pointer-events-none')).toBe(true);
    expect(el.classList.contains('hidden')).toBe(false);
    el.dispatchEvent(new Event('transitionend'));
    expect(el.classList.contains('hidden')).toBe(true);
  });

  it('hides via the fallback timer when transitionend never fires', async () => {
    vi.useFakeTimers();
    mounted = mountDirective(backdropPlugin, 'h-backdrop', el);
    el.setAttribute('data-open', 'true');
    await vi.advanceTimersByTimeAsync(0);
    el.setAttribute('data-open', 'false');
    await vi.advanceTimersByTimeAsync(0);
    expect(el.classList.contains('hidden')).toBe(false);
    await vi.advanceTimersByTimeAsync(250);
    expect(el.classList.contains('hidden')).toBe(true);
  });

  // A transitionend from the abandoned close arriving between the reopen and
  // Alpine's nextTick used to pass the old opacity-0 class guard and wedge the
  // open backdrop hidden.
  it('ignores a late transitionend from an abandoned close after reopening', async () => {
    mounted = mountDirective(backdropPlugin, 'h-backdrop', el);
    const { alpine } = mounted;
    el.setAttribute('data-open', 'true');
    await flush();
    el.setAttribute('data-open', 'false');
    await flush();
    const pending = [];
    alpine.nextTick = (fn) => pending.push(fn);
    el.setAttribute('data-open', 'true');
    await flush();
    el.dispatchEvent(new Event('transitionend'));
    expect(el.classList.contains('hidden')).toBe(false);
    pending.forEach((fn) => fn());
    expect(el.classList.contains('opacity-0')).toBe(false);
  });
});

describe('h-backdrop focus containment', () => {
  let opener;
  let el;
  let first;
  let last;
  let mounted;

  const flush = () => new Promise((r) => setTimeout(r, 0));
  const tab = (shiftKey = false) => {
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true });
    (document.activeElement ?? el).dispatchEvent(event);
    return event;
  };

  beforeEach(() => {
    mounted = null;
    opener = document.createElement('button');
    document.body.appendChild(opener);
    el = document.createElement('div');
    document.body.appendChild(el);
    first = document.createElement('input');
    last = document.createElement('button');
    el.append(first, last);
  });

  afterEach(() => {
    // The trap listens on the document, so an open backdrop has to be torn down
    // rather than just dropped, or it keeps trapping into the next test.
    mounted?.ctx.cleanup.mock.calls.forEach(([fn]) => fn());
    document.body.innerHTML = '';
  });

  async function open() {
    mounted = mountDirective(backdropPlugin, 'h-backdrop', el);
    opener.focus();
    el.setAttribute('data-open', 'true');
    await flush();
    return mounted;
  }

  it('wraps forward from the last focusable element to the first', async () => {
    await open();
    last.focus();
    expect(tab().defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it('wraps backward from the first focusable element to the last', async () => {
    await open();
    first.focus();
    expect(tab(true).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  it('leaves Tab between two inner elements to the browser', async () => {
    await open();
    first.focus();
    expect(tab().defaultPrevented).toBe(false);
  });

  it('pulls focus in when it is somewhere outside the backdrop', async () => {
    await open();
    opener.focus();
    expect(tab().defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it('holds focus on the backdrop itself when it has nothing focusable inside', async () => {
    el.replaceChildren();
    await open();
    expect(tab().defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(el);
  });

  it('skips a disabled control when wrapping', async () => {
    last.setAttribute('disabled', '');
    await open();
    first.focus();
    expect(tab(true).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it('returns focus to whatever opened it', async () => {
    await open();
    first.focus();
    el.setAttribute('data-open', 'false');
    await flush();
    expect(document.activeElement).toBe(opener);
  });

  it('leaves focus alone when the opener is gone by the time it closes', async () => {
    await open();
    first.focus();
    opener.remove();
    el.setAttribute('data-open', 'false');
    await flush();
    expect(document.activeElement).toBe(first);
  });

  it('stops containing focus once it is closed', async () => {
    await open();
    el.setAttribute('data-open', 'false');
    await flush();
    last.focus();
    expect(tab().defaultPrevented).toBe(false);
  });

  it('removes the listener on cleanup', async () => {
    const { ctx } = await open();
    ctx.cleanup.mock.calls.at(-1)[0]();
    last.focus();
    expect(tab().defaultPrevented).toBe(false);
  });
});

describe('h-backdrop-item', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('registers the backdrop-item directive', () => {
    const { alpine } = mountDirective(backdropPlugin, 'h-backdrop-item', el);
    expect(alpine._directives['h-backdrop-item']).toBeDefined();
  });

  it('adds the transition classes', () => {
    mountDirective(backdropPlugin, 'h-backdrop-item', el);
    expect(el.classList.contains('transition-[opacity,scale]')).toBe(true);
    expect(el.classList.contains('motion-reduce:transition-none')).toBe(true);
    expect(el.classList.contains('duration-200')).toBe(true);
    expect(el.classList.contains('ease-out')).toBe(true);
  });
});
