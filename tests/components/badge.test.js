import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import badgePlugin from '../../src/components/badge.js';
import { mountDirective } from '../test-utils.js';

describe('h-badge', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('span');
    document.body.appendChild(el);
  });

  it('registers h-badge and h-badge-indicator directives', () => {
    const { alpine } = mountDirective(badgePlugin, 'h-badge', el);
    expect(alpine._directives['h-badge']).toBeDefined();
    expect(alpine._directives['h-badge-indicator']).toBeDefined();
  });

  it('adds base classes', () => {
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('px-2')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
  });

  it('sets data-slot="badge"', () => {
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.getAttribute('data-slot')).toBe('badge');
  });

  it('applies default variant classes', () => {
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-secondary')).toBe(true);
    expect(el.classList.contains('text-secondary-foreground')).toBe(true);
  });

  it('applies primary variant classes', () => {
    el.setAttribute('data-variant', 'primary');
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-primary')).toBe(true);
    expect(el.classList.contains('text-primary-foreground')).toBe(true);
  });

  it('applies positive variant classes', () => {
    el.setAttribute('data-variant', 'positive');
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-positive')).toBe(true);
    expect(el.classList.contains('text-positive-foreground')).toBe(true);
  });

  it('applies negative variant classes', () => {
    el.setAttribute('data-variant', 'negative');
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-negative')).toBe(true);
    expect(el.classList.contains('text-negative-foreground')).toBe(true);
  });

  it('applies warning variant classes', () => {
    el.setAttribute('data-variant', 'warning');
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-warning')).toBe(true);
    expect(el.classList.contains('text-warning-foreground')).toBe(true);
  });

  it('applies information variant classes', () => {
    el.setAttribute('data-variant', 'information');
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-information')).toBe(true);
    expect(el.classList.contains('text-information-foreground')).toBe(true);
  });

  it('applies outline variant classes', () => {
    el.setAttribute('data-variant', 'outline');
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-transparent')).toBe(true);
    expect(el.classList.contains('text-foreground')).toBe(true);
  });

  it('does not apply classes from other variants', () => {
    el.setAttribute('data-variant', 'primary');
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-secondary')).toBe(false);
    expect(el.classList.contains('bg-negative')).toBe(false);
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(badgePlugin, 'h-badge', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-badge-indicator', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('span');
    document.body.appendChild(el);
  });

  it('adds base classes', () => {
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('absolute')).toBe(true);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('font-bold')).toBe(true);
  });

  it('sets data-slot="badge-indicator"', () => {
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.getAttribute('data-slot')).toBe('badge-indicator');
  });

  it('applies primary variant by default', () => {
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('bg-primary')).toBe(true);
    expect(el.classList.contains('text-primary-foreground')).toBe(true);
  });

  it('applies negative variant', () => {
    el.setAttribute('data-variant', 'negative');
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('bg-negative')).toBe(true);
    expect(el.classList.contains('text-negative-foreground')).toBe(true);
    expect(el.classList.contains('bg-primary')).toBe(false);
  });

  it('applies warning variant', () => {
    el.setAttribute('data-variant', 'warning');
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('bg-warning')).toBe(true);
  });

  it('applies information variant', () => {
    el.setAttribute('data-variant', 'information');
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('bg-information')).toBe(true);
  });

  it('adds ping animation variant classes', () => {
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('data-[ping=true]:before:animate-ping')).toBe(true);
    expect(el.classList.contains('data-[ping=true]:before:absolute')).toBe(true);
    expect(el.classList.contains('data-[ping=true]:before:inline-flex')).toBe(true);
    expect(el.classList.contains('data-[ping=true]:before:w-full')).toBe(true);
    expect(el.classList.contains('data-[ping=true]:before:h-full')).toBe(true);
    expect(el.classList.contains('data-[ping=true]:before:rounded-full')).toBe(true);
    expect(el.classList.contains('data-[ping=true]:before:opacity-75')).toBe(true);
  });

  it('includes variant-specific ping background class for default (primary) variant', () => {
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('data-[ping=true]:before:bg-primary')).toBe(true);
  });

  it('includes variant-specific ping background class when data-variant is set', () => {
    el.setAttribute('data-variant', 'negative');
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('data-[ping=true]:before:bg-negative')).toBe(true);
    expect(el.classList.contains('data-[ping=true]:before:bg-primary')).toBe(false);
  });

  it('applies default size for a regular badge', () => {
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('h-4')).toBe(true);
    expect(el.classList.contains('min-w-4')).toBe(true);
    expect(el.classList.contains('text-xs')).toBe(true);
  });

  it('applies default size for a dot badge', () => {
    el.setAttribute('data-dot', 'true');
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('h-3')).toBe(true);
    expect(el.classList.contains('min-w-3')).toBe(true);
    expect(el.classList.contains('h-4')).toBe(false);
    expect(el.classList.contains('min-w-4')).toBe(false);
  });

  it('applies sm size for a regular badge', () => {
    el.setAttribute('data-size', 'sm');
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('h-3')).toBe(true);
    expect(el.classList.contains('min-w-3')).toBe(true);
    expect(el.classList.contains('text-2xs')).toBe(true);
    expect(el.classList.contains('h-4')).toBe(false);
    expect(el.classList.contains('min-w-4')).toBe(false);
    expect(el.classList.contains('text-xs')).toBe(false);
  });

  it('applies sm size for a dot badge', () => {
    el.setAttribute('data-size', 'sm');
    el.setAttribute('data-dot', 'true');
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('h-2.5')).toBe(true);
    expect(el.classList.contains('min-w-2.5')).toBe(true);
    expect(el.classList.contains('h-3')).toBe(false);
    expect(el.classList.contains('min-w-3')).toBe(false);
  });

  it('applies top-right position by default', () => {
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('-end-0.75')).toBe(true);
    expect(el.classList.contains('-top-0.75')).toBe(true);
    expect(el.classList.contains('[.rounded-full>&]:-end-0.25')).toBe(true);
    expect(el.classList.contains('[.rounded-full>&]:-top-0.25')).toBe(true);
  });

  it('applies top-left position', () => {
    el.setAttribute('data-position', 'top-left');
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('-start-0.75')).toBe(true);
    expect(el.classList.contains('-top-0.75')).toBe(true);
    expect(el.classList.contains('-end-0.75')).toBe(false);
  });

  it('applies bottom-left position', () => {
    el.setAttribute('data-position', 'bottom-left');
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('-start-0.75')).toBe(true);
    expect(el.classList.contains('-bottom-0.75')).toBe(true);
    expect(el.classList.contains('-top-0.75')).toBe(false);
    expect(el.classList.contains('-end-0.75')).toBe(false);
  });

  it('applies bottom-right position', () => {
    el.setAttribute('data-position', 'bottom-right');
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('-end-0.75')).toBe(true);
    expect(el.classList.contains('-bottom-0.75')).toBe(true);
    expect(el.classList.contains('-top-0.75')).toBe(false);
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-badge-indicator cut-out', () => {
  // happy-dom never runs layout, so the boxes are stubbed and the ResizeObserver
  // is captured to be fired by hand.
  let observers;
  let OriginalResizeObserver;
  let host;
  let el;

  // happy-dom exposes the offset properties as prototype getters and has no
  // offsetParent at all, so both have to be defined as own properties.
  const define = (node, props) => {
    for (const [key, value] of Object.entries(props)) {
      Object.defineProperty(node, key, { value, configurable: true });
    }
  };
  const hostBox = (node, width, height) => define(node, { offsetWidth: width, offsetHeight: height, clientLeft: 0, clientTop: 0 });
  const indicatorBox = (node, parent, left, top, width, height) => define(node, { offsetParent: parent, offsetLeft: left, offsetTop: top, offsetWidth: width, offsetHeight: height });

  beforeEach(() => {
    observers = [];
    OriginalResizeObserver = global.ResizeObserver;
    global.ResizeObserver = class {
      constructor(cb) {
        this.cb = cb;
        this.observe = vi.fn();
        this.disconnect = vi.fn();
        observers.push(this);
      }
    };
    host = document.createElement('button');
    document.body.appendChild(host);
    el = document.createElement('span');
    host.appendChild(el);
    hostBox(host, 32, 32);
    indicatorBox(el, host, 23, -3, 12, 12);
  });

  afterEach(() => {
    global.ResizeObserver = OriginalResizeObserver;
    document.body.innerHTML = '';
  });

  it('carves a gap out of the host around the indicator', () => {
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    observers[0].cb();
    const clip = host.style.clipPath;
    // Kept region, then the outer stadium and the inner one that gives the dot back.
    expect(clip.match(/M/g)).toHaveLength(3);
    expect(clip).toContain('M-10000 -10000H10032V10032H-10000Z');
    expect(clip).toContain('M29 -5A8 8 0 0 0 29 11');
    expect(clip).toContain('M29 -3H29A6 6 0 0 1 29 9');
  });

  it('leaves the host uncarved while the indicator is hidden', () => {
    // x-show sets display:none, which nulls offsetParent and zeroes the box.
    indicatorBox(el, null, 0, 0, 0, 0);
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    observers[0].cb();
    expect(host.style.clipPath).toBe('');
  });

  it('ignores an indicator positioned against something other than the host', () => {
    indicatorBox(el, document.body, 23, -3, 12, 12);
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    observers[0].cb();
    expect(host.style.clipPath).toBe('');
  });

  it('measures the layout box, not the transformed one', () => {
    // A scaled ancestor (the dialog opens its panel at scale(0.95)) skews every
    // client rect but no layout box, and never fires the resize observer again.
    host.getBoundingClientRect = () => ({ left: 100, top: 100, width: 30.4, height: 30.4 });
    el.getBoundingClientRect = () => ({ left: 121.85, top: 97.15, width: 11.4, height: 11.4 });
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    observers[0].cb();
    expect(host.style.clipPath).toContain('M-10000 -10000H10032V10032H-10000Z');
    expect(host.style.clipPath).toContain('M29 -3H29A6 6 0 0 1 29 9');
  });

  it('offsets the hole by the host border, since offsetLeft starts at the padding box', () => {
    define(host, { clientLeft: 2, clientTop: 2 });
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    observers[0].cb();
    expect(host.style.clipPath).toContain('M31 -1H31A6 6 0 0 1 31 11');
  });

  it('carves one gap per indicator sharing a host', () => {
    const second = document.createElement('span');
    host.appendChild(second);
    indicatorBox(second, host, -3, 23, 12, 12);
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    mountDirective(badgePlugin, 'h-badge-indicator', second);
    observers[0].cb();
    expect(host.style.clipPath.match(/M/g)).toHaveLength(5);
  });

  it('restores the host on cleanup', () => {
    const { ctx } = mountDirective(badgePlugin, 'h-badge-indicator', el);
    observers[0].cb();
    expect(host.style.clipPath).not.toBe('');
    ctx.cleanup.mock.calls[0][0]();
    expect(observers[0].disconnect).toHaveBeenCalled();
    expect(host.style.clipPath).toBe('');
  });
});
