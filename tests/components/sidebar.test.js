import { describe, expect, it } from 'vitest';
import sidebarPlugin from '../../src/components/sidebar.js';
import { createMockAlpine, mountDirective } from '../test-utils.js';

// The collapsed state has to be a tracked proxy for the aria-expanded effect to
// re-run. activeEffect is module scoped in the test utils, so a proxy from this
// instance is picked up by an effect from any mounted directive's context.
const { reactive } = createMockAlpine();

// happy-dom delivers MutationObserver records asynchronously, so an attribute-driven
// class change is only visible after a macrotask.
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('h-sidebar', () => {
  it('applies base classes', () => {
    const el = document.createElement('aside');
    mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: [] });
    expect(el.classList.contains('bg-sidebar')).toBe(true);
    expect(el.classList.contains('[--badge-ring:var(--sidebar)]')).toBe(true);
    expect(el.classList.contains('h-full')).toBe(true);
    expect(el.classList.contains('vbox')).toBe(true);
  });

  it('sets data-slot attribute', () => {
    const el = document.createElement('aside');
    mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: [] });
    expect(el.getAttribute('data-slot')).toBe('sidebar');
  });

  it('adds border-r by default', () => {
    const el = document.createElement('aside');
    mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: [] });
    expect(el.classList.contains('border-r')).toBe(true);
  });

  it('adds border-l for right modifier', () => {
    const el = document.createElement('aside');
    mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: ['right'] });
    expect(el.classList.contains('border-l')).toBe(true);
  });

  it('adds border-x and shadow-sm when data-elevated=true is set before mount', () => {
    const el = document.createElement('aside');
    el.setAttribute('data-elevated', 'true');
    mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: [] });
    expect(el.classList.contains('border-x')).toBe(true);
    expect(el.classList.contains('shadow-sm')).toBe(true);
  });

  it('does not add border-x or shadow-sm without data-elevated', () => {
    const el = document.createElement('aside');
    mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: [] });
    expect(el.classList.contains('border-x')).toBe(false);
    expect(el.classList.contains('shadow-sm')).toBe(false);
  });

  it('does not add border-x or shadow-sm when data-elevated=false', () => {
    const el = document.createElement('aside');
    el.setAttribute('data-elevated', 'false');
    mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: [] });
    expect(el.classList.contains('border-x')).toBe(false);
    expect(el.classList.contains('shadow-sm')).toBe(false);
  });

  it('prefers data-floating over data-elevated when both are set before mount', () => {
    const el = document.createElement('aside');
    el.setAttribute('data-floating', 'true');
    el.setAttribute('data-elevated', 'true');
    mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: [] });
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('rounded-lg')).toBe(true);
    expect(el.classList.contains('border-x')).toBe(false);
  });

  it('adds border-x and shadow-sm when data-elevated is set to true after mount', async () => {
    const el = document.createElement('aside');
    mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: [] });
    el.setAttribute('data-elevated', 'true');
    await flush();
    expect(el.classList.contains('border-x')).toBe(true);
    expect(el.classList.contains('shadow-sm')).toBe(true);
  });

  it('removes border-x and shadow-sm when data-elevated is set to false after mount', async () => {
    const el = document.createElement('aside');
    el.setAttribute('data-elevated', 'true');
    mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: [] });
    el.setAttribute('data-elevated', 'false');
    await flush();
    expect(el.classList.contains('border-x')).toBe(false);
    expect(el.classList.contains('shadow-sm')).toBe(false);
  });

  it('calls cleanup', () => {
    const el = document.createElement('aside');
    const { ctx } = mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: [] });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-sidebar-header', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-header', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('inset-shadow-[0_-1px_var(--sidebar-border)]')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-header');
  });

  it('removes inset-shadow when data-borderless=true', () => {
    const el = document.createElement('div');
    el.dataset.borderless = 'true';
    mountDirective(sidebarPlugin, 'h-sidebar-header', el);
    expect(el.classList.contains('inset-shadow-[0_-1px_var(--border)]')).toBe(false);
  });
});

describe('h-sidebar-header-item', () => {
  it('applies base classes and data-slot on a non-interactive element', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-header-item', el, { original: 'x-h-sidebar-header-item' });
    expect(el.classList.contains('hbox')).toBe(true);
    expect(el.classList.contains('font-semibold')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-header-item');
  });

  it('lets a wrapper holding truncated lines shrink', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-header-item', el, { original: 'x-h-sidebar-header-item' });
    expect(el.classList.contains('[&>div]:min-w-0')).toBe(true);
  });

  it('makes a button interactive', () => {
    const el = document.createElement('button');
    mountDirective(sidebarPlugin, 'h-sidebar-header-item', el, { original: 'x-h-sidebar-header-item' });
    expect(el.getAttribute('type')).toBe('button');
    expect(el.getAttribute('data-slot')).toBe('sidebar-header-item');
    expect(el.classList.contains('hbox')).toBe(true);
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('outline-hidden')).toBe(true);
    expect(el.classList.contains('ring-sidebar-ring')).toBe(true);
    expect(el.classList.contains('focus-visible:ring-[calc(var(--spacing)*0.75)]')).toBe(true);
  });

  it('makes an anchor interactive without giving it a type', () => {
    const el = document.createElement('a');
    mountDirective(sidebarPlugin, 'h-sidebar-header-item', el, { original: 'x-h-sidebar-header-item' });
    expect(el.hasAttribute('type')).toBe(false);
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('ring-sidebar-ring')).toBe(true);
    expect(el.classList.contains('focus-visible:ring-[calc(var(--spacing)*0.75)]')).toBe(true);
  });

  it('leaves any other element non-interactive', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-header-item', el, { original: 'x-h-sidebar-header-item' });
    expect(el.classList.contains('cursor-pointer')).toBe(false);
    expect(el.classList.contains('ring-sidebar-ring')).toBe(false);
    expect(el.classList.contains('focus-visible:ring-[calc(var(--spacing)*0.75)]')).toBe(false);
  });

  it('gives an interactive item no hover, active or selected state', () => {
    const el = document.createElement('button');
    mountDirective(sidebarPlugin, 'h-sidebar-header-item', el, { original: 'x-h-sidebar-header-item' });
    expect(el.classList.contains('hover:bg-sidebar-secondary')).toBe(false);
    expect(el.classList.contains('active:bg-sidebar-primary')).toBe(false);
    expect(el.classList.contains('data-[active=true]:bg-sidebar-primary')).toBe(false);
  });

  it('keeps a first-child avatar visible and resizes it when collapsed', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-header-item', el, { original: 'x-h-sidebar-header-item' });
    // The collapse hide rule exempts a first-child avatar so it stays visible.
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:[&>*:not(svg:first-child):not([data-slot=menu]):not([data-slot=avatar]:first-child)]:hidden!')).toBe(true);
    // and it fills the collapsed rail, with the item padding dropped.
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:[&>[data-slot=avatar]:first-child]:size-8!')).toBe(true);
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:has-[>[data-slot=avatar]:first-child]:p-0!')).toBe(true);
  });
});

describe('h-sidebar-content', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-content', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('flex-1')).toBe(true);
    expect(el.classList.contains('overflow-auto')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-content');
  });
});

describe('h-sidebar-group', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-group', el, {
      modifiers: [],
      expression: 'false',
    });
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-group');
  });

  it('initializes _h_sidebar_group state', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-group', el, {
      modifiers: [],
      expression: 'false',
    });
    expect(el._h_sidebar_group).toBeDefined();
    expect(el._h_sidebar_group.collapsable).toBe(false);
  });

  it('sets collapsable=true for collapsed modifier', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-group', el, {
      modifiers: ['collapsed'],
      expression: 'false',
    });
    expect(el._h_sidebar_group.collapsable).toBe(true);
  });
});

describe('h-sidebar-group-label', () => {
  function mountLabel(el, collapsable = false, collapsed = false) {
    const group = document.createElement('div');
    group._h_sidebar_group = {
      collapsable,
      controlId: undefined,
      controls: undefined,
      state: reactive({ collapsed }),
    };
    group.appendChild(el);
    const mounted = mountDirective(sidebarPlugin, 'h-sidebar-group-label', el, { original: 'x-h-sidebar-group-label' });
    return { ...mounted, group };
  }

  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountLabel(el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('gap-1')).toBe(true);
    expect(el.classList.contains('px-2')).toBe(true);
    expect(el.classList.contains('group/sidebar-group-label')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-group-label');
  });

  it('tightens right padding when actions are present', () => {
    const el = document.createElement('div');
    mountLabel(el);
    expect(el.classList.contains('has-[[data-slot=sidebar-group-actions]]:pr-1.5')).toBe(true);
  });

  it('throws when not placed inside a sidebar group', () => {
    const el = document.createElement('div');
    expect(() => mountDirective(sidebarPlugin, 'h-sidebar-group-label', el, { original: 'x-h-sidebar-group-label' })).toThrow();
  });

  describe('when the group is collapsible', () => {
    it('adds the collapse arrow, which the author does not supply', () => {
      const el = document.createElement('div');
      el.textContent = 'Application';
      mountLabel(el, true);
      const svg = el.querySelector('svg');
      expect(svg).not.toBeNull();
      // The arrow turns off the label's aria-expanded rather than a class of its own.
      expect(svg.getAttribute('class')).toContain('[[aria-expanded=true]>&]:rotate-90');
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });

    it('reports the starting state through aria-expanded', () => {
      const open = document.createElement('div');
      mountLabel(open, true, false);
      expect(open.getAttribute('aria-expanded')).toBe('true');
      const shut = document.createElement('div');
      mountLabel(shut, true, true);
      expect(shut.getAttribute('aria-expanded')).toBe('false');
    });

    it('follows a collapse driven from outside, not just a click', () => {
      // A bound expression can collapse the group without the click handler ever
      // running. aria-expanded used to be written once and then only on click,
      // so it went on claiming the group was open, and the arrow with it.
      const el = document.createElement('div');
      const { group } = mountLabel(el, true);
      expect(el.getAttribute('aria-expanded')).toBe('true');
      group._h_sidebar_group.state.collapsed = true;
      expect(el.getAttribute('aria-expanded')).toBe('false');
      group._h_sidebar_group.state.collapsed = false;
      expect(el.getAttribute('aria-expanded')).toBe('true');
    });

    it('still toggles the state and the attribute on click', () => {
      const el = document.createElement('div');
      const { group } = mountLabel(el, true);
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(group._h_sidebar_group.state.collapsed).toBe(true);
      expect(el.getAttribute('aria-expanded')).toBe('false');
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(group._h_sidebar_group.state.collapsed).toBe(false);
      expect(el.getAttribute('aria-expanded')).toBe('true');
    });

    it('becomes a keyboard-reachable control, since the component owns the click', () => {
      const el = document.createElement('div');
      mountLabel(el, true);
      expect(el.getAttribute('role')).toBe('button');
      expect(el.getAttribute('tabindex')).toBe('0');
    });

    it('keeps an author-supplied tabindex', () => {
      const el = document.createElement('div');
      el.setAttribute('tabindex', '-1');
      mountLabel(el, true);
      expect(el.getAttribute('tabindex')).toBe('-1');
    });

    it('leaves a button alone, which is already a control', () => {
      const el = document.createElement('button');
      mountLabel(el, true);
      expect(el.hasAttribute('role')).toBe(false);
      expect(el.hasAttribute('tabindex')).toBe(false);
      expect(el.getAttribute('type')).toBe('button');
    });

    it('toggles on Enter and Space', () => {
      for (const key of ['Enter', ' ']) {
        const el = document.createElement('div');
        const { group } = mountLabel(el, true);
        el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
        expect(group._h_sidebar_group.state.collapsed).toBe(true);
      }
    });

    it('ignores other keys', () => {
      const el = document.createElement('div');
      const { group } = mountLabel(el, true);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true }));
      expect(group._h_sidebar_group.state.collapsed).toBe(false);
    });

    it('stops Space from scrolling the page', () => {
      const el = document.createElement('div');
      mountLabel(el, true);
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
      el.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });
  });

  it('stays plain when the group is not collapsible', () => {
    const el = document.createElement('div');
    mountLabel(el, false);
    expect(el.querySelector('svg')).toBeNull();
    expect(el.hasAttribute('aria-expanded')).toBe(false);
    expect(el.hasAttribute('id')).toBe(false);
    expect(el.classList.contains('text-xs')).toBe(true);
    // A plain label is text, not a control: no role and no tab stop.
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.hasAttribute('tabindex')).toBe(false);
  });
});

describe('h-sidebar-group-actions', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-group-actions', el);
    expect(el.classList.contains('ml-auto')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('gap-1')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-group-actions');
  });

  it('does not autohide without the modifier', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-group-actions', el, { modifiers: [] });
    expect(el.classList.contains('pointer-fine:sr-only')).toBe(false);
    expect(el.classList.contains('focus-within:not-sr-only')).toBe(false);
  });

  it('adds touch-safe autohide classes with the autohide modifier', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-group-actions', el, { modifiers: ['autohide'] });
    expect(el.classList.contains('pointer-fine:sr-only')).toBe(true);
    expect(el.classList.contains('focus-within:not-sr-only')).toBe(true);
    expect(el.classList.contains('group-hover/sidebar-group-label:not-sr-only')).toBe(true);
    // not-sr-only zeroes margin, so ml-auto is re-asserted in the revealed states to keep the actions right-aligned.
    expect(el.classList.contains('focus-within:ml-auto')).toBe(true);
    expect(el.classList.contains('group-hover/sidebar-group-label:ml-auto')).toBe(true);
  });
});

describe('h-sidebar-group-action', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('button');
    mountDirective(sidebarPlugin, 'h-sidebar-group-action', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('aspect-square')).toBe(true);
    expect(el.classList.contains('shrink-0')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-group-action');
  });

  it('is not absolutely positioned', () => {
    const el = document.createElement('button');
    mountDirective(sidebarPlugin, 'h-sidebar-group-action', el);
    expect(el.classList.contains('absolute')).toBe(false);
    expect(el.classList.contains('top-3.5')).toBe(false);
    expect(el.classList.contains('right-3')).toBe(false);
  });

  it('sets type=button on a button element', () => {
    const el = document.createElement('button');
    mountDirective(sidebarPlugin, 'h-sidebar-group-action', el);
    expect(el.getAttribute('type')).toBe('button');
  });

  it('sets role=button on a non-button element', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-group-action', el);
    expect(el.getAttribute('role')).toBe('button');
  });
});

describe('h-sidebar-menu-action', () => {
  it('uses a touch-safe autohide (pointer-fine, not md)', () => {
    const el = document.createElement('button');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-action', el, { modifiers: ['autohide'] });
    expect(el.classList.contains('pointer-fine:opacity-0')).toBe(true);
    expect(el.classList.contains('md:opacity-0')).toBe(false);
    expect(el.classList.contains('group-hover/menu-item:opacity-100')).toBe(true);
    expect(el.classList.contains('group-focus-within/menu-item:opacity-100')).toBe(true);
  });

  it('does not autohide without the modifier', () => {
    const el = document.createElement('button');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-action', el, { modifiers: [] });
    expect(el.classList.contains('pointer-fine:opacity-0')).toBe(false);
  });
});

describe('h-sidebar-menu', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('ul');
    mountDirective(sidebarPlugin, 'h-sidebar-menu', el, { original: 'x-h-sidebar-menu' });
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('min-w-0')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-menu');
  });

  it('throws if element is not ul', () => {
    const el = document.createElement('div');
    expect(() => mountDirective(sidebarPlugin, 'h-sidebar-menu', el, { original: 'x-h-sidebar-menu' })).toThrow();
  });
});

describe('h-sidebar-menu-item', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('li');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-item', el, {
      original: 'x-h-sidebar-menu-item',
      modifiers: [],
      expression: 'false',
    });
    expect(el.getAttribute('data-slot')).toBe('sidebar-menu-item');
    expect(el._h_sidebar_menu_item).toBeDefined();
  });

  it('throws if element is not li', () => {
    const el = document.createElement('div');
    expect(() =>
      mountDirective(sidebarPlugin, 'h-sidebar-menu-item', el, {
        original: 'x-h-sidebar-menu-item',
        modifiers: [],
        expression: 'false',
      })
    ).toThrow();
  });
});

describe('h-sidebar-menu-button', () => {
  it('throws unless set on a button or a link', () => {
    const el = document.createElement('div');
    expect(() => mountDirective(sidebarPlugin, 'h-sidebar-menu-button', el, { original: 'x-h-sidebar-menu-button', modifiers: [] })).toThrow();
  });

  it('applies base classes and data-slot on a button', () => {
    const el = document.createElement('button');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-button', el, { original: 'x-h-sidebar-menu-button', modifiers: [] });
    expect(el.getAttribute('type')).toBe('button');
    expect(el.getAttribute('data-slot')).toBe('sidebar-menu-button');
    expect(el.classList.contains('flex')).toBe(true);
  });

  it('marks a button inside a sub menu with the sub slot', () => {
    const item = document.createElement('li');
    item._h_sidebar_menu_item = {
      isSub: true,
      collapsable: false,
      controlId: undefined,
      controls: undefined,
      state: reactive({ collapsed: false }),
    };
    const el = document.createElement('button');
    item.appendChild(el);
    mountDirective(sidebarPlugin, 'h-sidebar-menu-button', el, { original: 'x-h-sidebar-menu-button', modifiers: [] });
    expect(el.getAttribute('data-slot')).toBe('sidebar-menu-sub-button');
  });

  it('keeps an author-set data-slot', () => {
    const el = document.createElement('button');
    el.setAttribute('data-slot', 'custom');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-button', el, { original: 'x-h-sidebar-menu-button', modifiers: [] });
    expect(el.getAttribute('data-slot')).toBe('custom');
  });

  // A plain menu button may mark a selected filter, a trigger or anything else
  // that is not the current page, so it makes no aria-current claim of its own
  // and never touches one the author set. Navigation is h-sidebar-menu-nav.
  it('never sets aria-current', async () => {
    const el = document.createElement('a');
    el.setAttribute('data-active', 'true');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-button', el, { original: 'x-h-sidebar-menu-button', modifiers: [] });
    expect(el.hasAttribute('aria-current')).toBe(false);
    el.removeAttribute('data-active');
    await flush();
    el.setAttribute('data-active', 'true');
    await flush();
    expect(el.hasAttribute('aria-current')).toBe(false);
  });

  it('keeps an author-set aria-current', async () => {
    const el = document.createElement('a');
    el.setAttribute('aria-current', 'location');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-button', el, { original: 'x-h-sidebar-menu-button', modifiers: [] });
    expect(el.getAttribute('aria-current')).toBe('location');
    el.setAttribute('data-active', 'true');
    await flush();
    el.removeAttribute('data-active');
    await flush();
    expect(el.getAttribute('aria-current')).toBe('location');
  });

  // The badge ring reads the inherited --badge-ring, so the button re-declares
  // it alongside each of its own background states.
  it('keeps the badge ring in step with its background states', () => {
    const el = document.createElement('button');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-button', el, { original: 'x-h-sidebar-menu-button', modifiers: [] });
    expect(el.classList.contains('hover:[--badge-ring:var(--sidebar-secondary)]')).toBe(true);
    expect(el.classList.contains('active:[--badge-ring:var(--sidebar-primary)]')).toBe(true);
    expect(el.classList.contains('data-[active=true]:[--badge-ring:var(--sidebar-primary)]')).toBe(true);
  });

  it('lets a wrapper holding truncated lines shrink', () => {
    const el = document.createElement('button');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-button', el, { original: 'x-h-sidebar-menu-button', modifiers: [] });
    // Without this a wrapper keeps min-width:auto and its text overflows instead of truncating.
    expect(el.classList.contains('[&>div]:min-w-0')).toBe(true);
  });

  it('keeps a first-child avatar visible but padded when collapsed', () => {
    const el = document.createElement('button');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-button', el, { original: 'x-h-sidebar-menu-button', modifiers: [] });
    // Exempt a first-child avatar from the collapse hide rule.
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:[&>*:not(svg:first-child):not([data-slot=menu]):not([data-slot=avatar]:first-child)]:hidden!')).toBe(true);
    // Without data-logo the button keeps its padding and the avatar is not resized.
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:[&>[data-slot=avatar]:first-child]:size-8!')).toBe(false);
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:has-[>[data-slot=avatar]:first-child]:p-0!')).toBe(false);
  });

  it('rounds and centers a first-child icon or avatar with data-logo outside a header', () => {
    const el = document.createElement('button');
    el.setAttribute('data-logo', 'true');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-button', el, { original: 'x-h-sidebar-menu-button', modifiers: [] });
    // Round the icon or avatar and center it when the sidebar collapses.
    expect(el.classList.contains('[&>svg:first-child]:rounded-control')).toBe(true);
    expect(el.classList.contains('[&>[data-slot=avatar]:first-child]:rounded-control')).toBe(true);
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:justify-center!')).toBe(true);
    // Outside a header the logo is inset and sized down to fit the row.
    expect(el.classList.contains('pl-1')).toBe(true);
    expect(el.classList.contains('[&>svg:first-child]:size-6!')).toBe(true);
    expect(el.classList.contains('[&>[data-slot=avatar]:first-child]:size-6!')).toBe(true);
    expect(el.classList.contains('[&>[data-slot=avatar]:first-child]:text-xs')).toBe(true);
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:p-1')).toBe(true);
    // The old collapse-fill classes are gone.
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:[&>svg:first-child]:size-8!')).toBe(false);
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:has-[>svg:first-child]:p-0!')).toBe(false);
  });

  it('skips the inset sizing for a data-logo button inside a sidebar header', () => {
    const header = document.createElement('div');
    header.setAttribute('data-slot', 'sidebar-header');
    const el = document.createElement('button');
    el.setAttribute('data-logo', 'true');
    header.appendChild(el);
    mountDirective(sidebarPlugin, 'h-sidebar-menu-button', el, { original: 'x-h-sidebar-menu-button', modifiers: [] });
    // The always-on rounding and centering still apply.
    expect(el.classList.contains('[&>svg:first-child]:rounded-control')).toBe(true);
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:justify-center!')).toBe(true);
    // But the header logo keeps the button's own padding and full size.
    expect(el.classList.contains('pl-1')).toBe(false);
    expect(el.classList.contains('[&>svg:first-child]:size-6!')).toBe(false);
    expect(el.classList.contains('[&>[data-slot=avatar]:first-child]:size-6!')).toBe(false);
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:p-1')).toBe(false);
  });

  describe('when the menu item is collapsible', () => {
    function mountButton(collapsed = false) {
      const item = document.createElement('li');
      item._h_sidebar_menu_item = {
        isSub: false,
        collapsable: true,
        controlId: undefined,
        controls: undefined,
        state: reactive({ collapsed }),
      };
      const el = document.createElement('button');
      item.appendChild(el);
      mountDirective(sidebarPlugin, 'h-sidebar-menu-button', el, { original: 'x-h-sidebar-menu-button', modifiers: [] });
      return { el, item };
    }

    it('adds the collapse arrow and reports the starting state', () => {
      const { el } = mountButton();
      expect(el.querySelector('svg')).not.toBeNull();
      expect(el.getAttribute('aria-expanded')).toBe('true');
    });

    it('follows a collapse driven from outside, not just a click', () => {
      const { el, item } = mountButton();
      item._h_sidebar_menu_item.state.collapsed = true;
      expect(el.getAttribute('aria-expanded')).toBe('false');
      item._h_sidebar_menu_item.state.collapsed = false;
      expect(el.getAttribute('aria-expanded')).toBe('true');
    });

    it('still toggles the state and the attribute on click', () => {
      const { el, item } = mountButton();
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(item._h_sidebar_menu_item.state.collapsed).toBe(true);
      expect(el.getAttribute('aria-expanded')).toBe('false');
    });
  });
});

describe('h-sidebar-menu-nav', () => {
  // Shares the menu button body, so only the slot and the aria-current sync
  // are its own.
  it('applies the shared button treatment with its own data-slot', () => {
    const el = document.createElement('button');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-nav', el, { original: 'x-h-sidebar-menu-nav', modifiers: [] });
    expect(el.getAttribute('type')).toBe('button');
    expect(el.getAttribute('data-slot')).toBe('sidebar-menu-nav');
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('peer/menu-button')).toBe(true);
  });

  it('marks a nav inside a sub menu with the sub slot', () => {
    const item = document.createElement('li');
    item._h_sidebar_menu_item = {
      isSub: true,
      collapsable: false,
      controlId: undefined,
      controls: undefined,
      state: reactive({ collapsed: false }),
    };
    const el = document.createElement('a');
    item.appendChild(el);
    mountDirective(sidebarPlugin, 'h-sidebar-menu-nav', el, { original: 'x-h-sidebar-menu-nav', modifiers: [] });
    expect(el.getAttribute('data-slot')).toBe('sidebar-menu-sub-nav');
  });

  // data-active is the styling flag. Without aria-current the current destination
  // was marked by colour alone, unlike the menu, nav menu and bottom navigation.
  it('marks an active destination with aria-current', () => {
    const el = document.createElement('a');
    el.setAttribute('data-active', 'true');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-nav', el, { original: 'x-h-sidebar-menu-nav', modifiers: [] });
    expect(el.getAttribute('aria-current')).toBe('page');
  });

  it('leaves aria-current off an inactive destination', () => {
    for (const value of [null, 'false']) {
      const el = document.createElement('a');
      if (value !== null) el.setAttribute('data-active', value);
      mountDirective(sidebarPlugin, 'h-sidebar-menu-nav', el, { original: 'x-h-sidebar-menu-nav', modifiers: [] });
      expect(el.hasAttribute('aria-current')).toBe(false);
    }
  });

  it('follows data-active when it changes at runtime', async () => {
    const el = document.createElement('a');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-nav', el, { original: 'x-h-sidebar-menu-nav', modifiers: [] });
    el.setAttribute('data-active', 'true');
    await flush();
    expect(el.getAttribute('aria-current')).toBe('page');
    el.removeAttribute('data-active');
    await flush();
    expect(el.hasAttribute('aria-current')).toBe(false);
  });
});

describe('h-sidebar-separator', () => {
  it('applies base classes and attributes', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-separator', el);
    expect(el.classList.contains('bg-sidebar-border')).toBe(true);
    expect(el.classList.contains('shrink-0')).toBe(true);
    expect(el.classList.contains('h-px')).toBe(true);
    expect(el.getAttribute('role')).toBe('none');
    expect(el.getAttribute('data-slot')).toBe('sidebar-separator');
  });
});

describe('h-sidebar-menu-badge', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('span');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-badge', el, {
      original: 'x-h-sidebar-menu-badge',
    });
    expect(el.classList.contains('flex-1')).toBe(true);
    expect(el.classList.contains('text-xs')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-menu-badge');
  });

  it('throws if element is not span', () => {
    const el = document.createElement('div');
    expect(() =>
      mountDirective(sidebarPlugin, 'h-sidebar-menu-badge', el, {
        original: 'x-h-sidebar-menu-badge',
      })
    ).toThrow();
  });
});

describe('h-sidebar-footer', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-footer', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('inset-shadow-[0_1px_var(--sidebar-border)]')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-footer');
  });

  it('removes inset-shadow when data-borderless=true', () => {
    const el = document.createElement('div');
    el.dataset.borderless = 'true';
    mountDirective(sidebarPlugin, 'h-sidebar-footer', el);
    expect(el.classList.contains('inset-shadow-[0_1px_var(--border)]')).toBe(false);
  });
});
