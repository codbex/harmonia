import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import dialogPlugin from '../../src/components/dialog.js';
import { mountDirective } from '../test-utils.js';

// happy-dom does not implement window.matchMedia
vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false, addListener: vi.fn(), removeListener: vi.fn() }));

describe('h-dialog-overlay', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('registers all dialog directives', () => {
    const { alpine } = mountDirective(dialogPlugin, 'h-dialog-overlay', el);
    expect(alpine._directives['h-dialog-overlay']).toBeDefined();
    expect(alpine._directives['h-dialog']).toBeDefined();
    expect(alpine._directives['h-dialog-header']).toBeDefined();
    expect(alpine._directives['h-dialog-title']).toBeDefined();
    expect(alpine._directives['h-dialog-close']).toBeDefined();
    expect(alpine._directives['h-dialog-description']).toBeDefined();
    expect(alpine._directives['h-dialog-footer']).toBeDefined();
  });

  it('adds base classes', () => {
    mountDirective(dialogPlugin, 'h-dialog-overlay', el);
    expect(el.classList.contains('hidden')).toBe(true);
    expect(el.classList.contains('fixed')).toBe(true);
    expect(el.classList.contains('inset-0')).toBe(true);
    expect(el.classList.contains('z-50')).toBe(true);
    expect(el.classList.contains('opacity-0')).toBe(true);
  });

  it('sets tabindex="-1"', () => {
    mountDirective(dialogPlugin, 'h-dialog-overlay', el);
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('sets data-slot="dialog-overlay"', () => {
    mountDirective(dialogPlugin, 'h-dialog-overlay', el);
    expect(el.getAttribute('data-slot')).toBe('dialog-overlay');
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(dialogPlugin, 'h-dialog-overlay', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-dialog-overlay open and close', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // MutationObserver callbacks need a task turn to be delivered.
  const flush = () => new Promise((r) => setTimeout(r, 0));

  it('opens by removing hidden and hides again through transitionend', async () => {
    mountDirective(dialogPlugin, 'h-dialog-overlay', el);
    el.setAttribute('data-open', 'true');
    await flush();
    expect(el.classList.contains('hidden')).toBe(false);
    expect(el.classList.contains('opacity-0')).toBe(false);
    el.setAttribute('data-open', 'false');
    await flush();
    expect(el.classList.contains('opacity-0')).toBe(true);
    expect(el.classList.contains('hidden')).toBe(false);
    el.dispatchEvent(new Event('transitionend'));
    expect(el.classList.contains('hidden')).toBe(true);
  });

  it('stops intercepting pointer events the moment the close starts', async () => {
    mountDirective(dialogPlugin, 'h-dialog-overlay', el);
    el.setAttribute('data-open', 'true');
    await flush();
    expect(el.classList.contains('pointer-events-none')).toBe(false);
    el.setAttribute('data-open', 'false');
    await flush();
    // Immediately, not only once the fade has finished.
    expect(el.classList.contains('pointer-events-none')).toBe(true);
    el.setAttribute('data-open', 'true');
    await flush();
    expect(el.classList.contains('pointer-events-none')).toBe(false);
  });

  it('hides via the fallback timer when transitionend never fires', async () => {
    vi.useFakeTimers();
    mountDirective(dialogPlugin, 'h-dialog-overlay', el);
    el.setAttribute('data-open', 'true');
    await vi.advanceTimersByTimeAsync(0);
    el.setAttribute('data-open', 'false');
    await vi.advanceTimersByTimeAsync(0);
    expect(el.classList.contains('hidden')).toBe(false);
    await vi.advanceTimersByTimeAsync(250);
    expect(el.classList.contains('hidden')).toBe(true);
  });

  it('reopening cancels the pending fallback timer', async () => {
    vi.useFakeTimers();
    mountDirective(dialogPlugin, 'h-dialog-overlay', el);
    el.setAttribute('data-open', 'true');
    await vi.advanceTimersByTimeAsync(0);
    el.setAttribute('data-open', 'false');
    await vi.advanceTimersByTimeAsync(0);
    el.setAttribute('data-open', 'true');
    await vi.advanceTimersByTimeAsync(300);
    expect(el.classList.contains('hidden')).toBe(false);
  });

  // A transitionend from the abandoned close arriving between the reopen and
  // Alpine's nextTick (a real task boundary in Alpine) used to pass the old
  // opacity-0 class guard and wedge the open overlay hidden.
  it('ignores a late transitionend from an abandoned close after reopening', async () => {
    const { alpine } = mountDirective(dialogPlugin, 'h-dialog-overlay', el);
    el.setAttribute('data-open', 'true');
    await flush();
    el.setAttribute('data-open', 'false');
    await flush();
    // Defer nextTick like real Alpine, so opacity-0 is still present when the
    // late event lands.
    const pending = [];
    alpine.nextTick = (fn) => pending.push(fn);
    el.setAttribute('data-open', 'true');
    await flush();
    expect(el.classList.contains('opacity-0')).toBe(true);
    el.dispatchEvent(new Event('transitionend'));
    expect(el.classList.contains('hidden')).toBe(false);
    pending.forEach((fn) => fn());
    expect(el.classList.contains('opacity-0')).toBe(false);
    expect(el.classList.contains('hidden')).toBe(false);
  });

  it('does not hide when the opening fade finishes', async () => {
    mountDirective(dialogPlugin, 'h-dialog-overlay', el);
    el.setAttribute('data-open', 'true');
    await flush();
    el.dispatchEvent(new Event('transitionend'));
    expect(el.classList.contains('hidden')).toBe(false);
  });
});

describe('h-dialog', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('adds base positioning and layout classes', () => {
    mountDirective(dialogPlugin, 'h-dialog', el);
    expect(el.classList.contains('fixed')).toBe(true);
    expect(el.classList.contains('position-center')).toBe(true);
    expect(el.classList.contains('z-50')).toBe(true);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('rounded-lg')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('shadow-xl')).toBe(true);
  });

  it('sets role="dialog"', () => {
    mountDirective(dialogPlugin, 'h-dialog', el);
    expect(el.getAttribute('role')).toBe('dialog');
  });

  it('sets data-slot="dialog"', () => {
    mountDirective(dialogPlugin, 'h-dialog', el);
    expect(el.getAttribute('data-slot')).toBe('dialog');
  });
});

describe('h-dialog-header', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('adds grid classes', () => {
    mountDirective(dialogPlugin, 'h-dialog-header', el);
    expect(el.classList.contains('grid')).toBe(true);
    expect(el.classList.contains('gap-2')).toBe(true);
  });

  it('sets data-slot="dialog-header"', () => {
    mountDirective(dialogPlugin, 'h-dialog-header', el);
    expect(el.getAttribute('data-slot')).toBe('dialog-header');
  });

  it('uses a shrinkable minmax(0,1fr) track so the close button stays in bounds', () => {
    // Same fix as the card header: a plain 1fr track will not shrink below its
    // title's min-content, pushing the trailing close button out on a narrow
    // dialog. minmax(0,1fr) lets the title column shrink instead.
    mountDirective(dialogPlugin, 'h-dialog-header', el);
    expect(el.classList.contains('grid-cols-[minmax(0,1fr)_auto]')).toBe(true);
    expect(el.classList.contains('grid-cols-[1fr_auto]')).toBe(false);
  });
});

describe('h-dialog-title', () => {
  let dialogEl, titleEl;

  beforeEach(() => {
    dialogEl = document.createElement('div');
    dialogEl.setAttribute('role', 'dialog');

    titleEl = document.createElement('h2');
    dialogEl.appendChild(titleEl);
    document.body.appendChild(dialogEl);
  });

  it('adds font-semibold class', () => {
    mountDirective(dialogPlugin, 'h-dialog-title', titleEl);
    expect(titleEl.classList.contains('font-semibold')).toBe(true);
    expect(titleEl.classList.contains('text-lg')).toBe(true);
  });

  it('sets data-slot="dialog-title"', () => {
    mountDirective(dialogPlugin, 'h-dialog-title', titleEl);
    expect(titleEl.getAttribute('data-slot')).toBe('dialog-title');
  });

  it('sets aria-labelledby on the dialog parent', () => {
    mountDirective(dialogPlugin, 'h-dialog-title', titleEl);
    expect(dialogEl.hasAttribute('aria-labelledby')).toBe(true);
    const labelledById = dialogEl.getAttribute('aria-labelledby');
    expect(titleEl.getAttribute('id')).toBe(labelledById);
  });

  it('does not set aria-labelledby when dialog already has aria-labelledby', () => {
    dialogEl.setAttribute('aria-labelledby', 'existing-id');
    mountDirective(dialogPlugin, 'h-dialog-title', titleEl);
    expect(dialogEl.getAttribute('aria-labelledby')).toBe('existing-id');
  });

  it('does not set aria-labelledby when dialog already has aria-label', () => {
    dialogEl.setAttribute('aria-label', 'My dialog');
    mountDirective(dialogPlugin, 'h-dialog-title', titleEl);
    expect(dialogEl.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('does not set aria-labelledby when dialog already has both aria-labelledby and aria-label', () => {
    dialogEl.setAttribute('aria-labelledby', 'existing-id');
    dialogEl.setAttribute('aria-label', 'My dialog');
    mountDirective(dialogPlugin, 'h-dialog-title', titleEl);
    expect(dialogEl.getAttribute('aria-labelledby')).toBe('existing-id');
  });
});

describe('h-dialog-close', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('button');
    document.body.appendChild(el);
  });

  it('adds opacity and focus classes', () => {
    mountDirective(dialogPlugin, 'h-dialog-close', el);
    expect(el.classList.contains('opacity-70')).toBe(true);
    expect(el.classList.contains('hover:opacity-100')).toBe(true);
  });

  it('sets data-slot="dialog-close"', () => {
    mountDirective(dialogPlugin, 'h-dialog-close', el);
    expect(el.getAttribute('data-slot')).toBe('dialog-close');
  });

  it('sets type="button"', () => {
    mountDirective(dialogPlugin, 'h-dialog-close', el);
    expect(el.getAttribute('type')).toBe('button');
  });
});

describe('h-dialog-description', () => {
  let dialogEl, descEl;

  beforeEach(() => {
    dialogEl = document.createElement('div');
    dialogEl.setAttribute('role', 'dialog');

    descEl = document.createElement('p');
    dialogEl.appendChild(descEl);
    document.body.appendChild(dialogEl);
  });

  it('adds muted foreground and text-sm classes', () => {
    mountDirective(dialogPlugin, 'h-dialog-description', descEl);
    expect(descEl.classList.contains('text-muted-foreground')).toBe(true);
    expect(descEl.classList.contains('text-sm')).toBe(true);
  });

  it('sets data-slot="dialog-description"', () => {
    mountDirective(dialogPlugin, 'h-dialog-description', descEl);
    expect(descEl.getAttribute('data-slot')).toBe('dialog-description');
  });

  it('sets aria-describedby on the dialog parent', () => {
    mountDirective(dialogPlugin, 'h-dialog-description', descEl);
    expect(dialogEl.hasAttribute('aria-describedby')).toBe(true);
    const describedById = dialogEl.getAttribute('aria-describedby');
    expect(descEl.getAttribute('id')).toBe(describedById);
  });

  it('does not set aria-describedby when dialog already has aria-describedby', () => {
    dialogEl.setAttribute('aria-describedby', 'existing-id');
    mountDirective(dialogPlugin, 'h-dialog-description', descEl);
    expect(dialogEl.getAttribute('aria-describedby')).toBe('existing-id');
  });

  it('does not set aria-describedby when dialog already has aria-description', () => {
    dialogEl.setAttribute('aria-description', 'My description');
    mountDirective(dialogPlugin, 'h-dialog-description', descEl);
    expect(dialogEl.hasAttribute('aria-describedby')).toBe(false);
  });
});

describe('h-dialog-footer', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('adds flex and gap classes', () => {
    mountDirective(dialogPlugin, 'h-dialog-footer', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('gap-2')).toBe(true);
    expect(el.classList.contains('flex-col-reverse')).toBe(true);
  });

  it('sets data-slot="dialog-footer"', () => {
    mountDirective(dialogPlugin, 'h-dialog-footer', el);
    expect(el.getAttribute('data-slot')).toBe('dialog-footer');
  });
});
