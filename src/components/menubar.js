import { findAncestorState } from '../common/ancestor';
import { disabledControlClasses } from '../common/shared-classes';
import uuidv4 from '../utils/uuid';

const menubarTriggerClasses = [
  'inline-flex',
  'h-9',
  '[[data-slot=menubar][data-size=md]_&]:h-8',
  '[[data-slot=menubar][data-size=sm]_&]:h-6.5',
  'select-none',
  'items-center',
  'justify-center',
  'gap-1.5',
  'rounded-control',
  '[[data-slot=menubar][data-variant=outline]_&]:rounded-none',
  'bg-transparent',
  'px-2',
  '[[data-slot=menubar][data-variant=outline]_&]:px-3',
  'py-1',
  'text-sm',
  'font-medium',
  'text-foreground',
  'whitespace-nowrap',
  'cursor-default',
  'shrink-0',
  'transition-colors',
  'duration-100',
  'motion-reduce:transition-none',
  'outline-ring/50',
  'focus-outline',
  'hover:bg-secondary-hover',
  'hover:text-secondary-foreground',
  'focus:bg-secondary-hover',
  'focus:text-secondary-foreground',
  'data-[state=open]:bg-secondary-hover',
  'data-[state=open]:text-secondary-foreground',
  ...disabledControlClasses,
  'svg-defaults',
];

export default function (Alpine) {
  Alpine.directive('h-menubar', (el, { original }, { Alpine, cleanup }) => {
    if (el.tagName !== 'UL') {
      throw new Error(`${original} must be a ul element`);
    }
    if (!el.hasAttribute('aria-label')) {
      throw new Error(`${original} must have an "aria-label" attribute`);
    }
    el.classList.add('flex', 'w-fit', 'list-none', 'items-center', 'rounded-control');
    el.setAttribute('role', 'menubar');
    el.setAttribute('aria-orientation', 'horizontal');
    el.setAttribute('data-slot', 'menubar');

    const variants = {
      outline: ['border', '[&>li:first-of-type>[data-slot=menubar-trigger]]:rounded-l-control', '[&>li:last-of-type>[data-slot=menubar-trigger]]:rounded-r-control'],
    };
    const allVariantClasses = Object.values(variants).flat();

    function applyVariant() {
      const variant = el.getAttribute('data-variant');
      el.classList.remove('gap-1', ...allVariantClasses);
      if (variant && Object.prototype.hasOwnProperty.call(variants, variant)) {
        el.classList.add(...variants[variant]);
      } else {
        el.classList.add('gap-1');
      }
    }

    applyVariant();

    const observer = new MutationObserver(() => applyVariant());

    observer.observe(el, { attributes: true, attributeFilter: ['data-variant'] });

    cleanup(() => observer.disconnect());

    el._h_menubar = Alpine.reactive({ open: null });
  });

  Alpine.directive('h-menubar-item', (el, { original }) => {
    if (el.tagName !== 'LI') {
      throw new Error(`${original} must be a li element`);
    }
    if (el.parentElement?.getAttribute('data-slot') !== 'menubar') {
      throw new Error(`${original} must be a direct child of a x-h-menubar element`);
    }
    el.classList.add('relative');
    el.setAttribute('role', 'none');
    el.setAttribute('data-slot', 'menubar-item');
  });

  Alpine.directive('h-menubar-trigger', (el, { original }, { cleanup, Alpine }) => {
    if (el.tagName !== 'BUTTON') {
      throw new Error(`${original} must be a button element`);
    }
    const menubar = findAncestorState(Alpine, el, '_h_menubar');
    if (!menubar) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-menubar')} element`);
    }
    const state = menubar._h_menubar;

    if (!el.hasAttribute('id')) {
      el.setAttribute('id', `mbt${uuidv4()}`);
    }
    el.setAttribute('type', 'button');
    el.setAttribute('role', 'menuitem');
    el.setAttribute('aria-haspopup', 'menu');
    el.setAttribute('aria-expanded', 'false');
    el.setAttribute('data-state', 'closed');
    el.setAttribute('data-slot', 'menubar-trigger');
    el.setAttribute('tabindex', menubar.querySelector('[data-slot=menubar-trigger][tabindex="0"]') ? '-1' : '0');
    el.classList.add(...menubarTriggerClasses);

    function getTriggers() {
      return Array.from(menubar.querySelectorAll('[data-slot=menubar-trigger]'));
    }

    function setTabStop(target) {
      for (const trigger of getTriggers()) {
        trigger.setAttribute('tabindex', trigger === target ? '0' : '-1');
      }
    }

    function moveFocus(direction) {
      const triggers = getTriggers();
      const index = triggers.indexOf(el);
      const next = direction === 'next' ? triggers[(index + 1) % triggers.length] : triggers[(index - 1 + triggers.length) % triggers.length];
      setTabStop(next);
      next.focus();
      return next;
    }

    el._h_menu_trigger = {
      isDropdown: true,
      navItem: true,
      openMenu: undefined,
      closeMenu: undefined,
      focusOnOpen: undefined,
      moveInBar(direction) {
        el._h_menu_trigger.closeMenu?.();
        const next = moveFocus(direction);
        if (next !== el) {
          next._h_menu_trigger.focusOnOpen = 'first';
          next._h_menu_trigger.openMenu?.();
        }
      },
      setOpen(open) {
        el.setAttribute('aria-expanded', String(open));
        el.setAttribute('data-state', open ? 'open' : 'closed');
        if (open) {
          if (state.open && state.open !== el) {
            state.open._h_menu_trigger.closeMenu?.();
          }
          state.open = el;
        } else if (state.open === el) {
          state.open = null;
        }
      },
    };

    function onKeyDown(event) {
      switch (event.key) {
        case 'Right':
        case 'ArrowRight':
        case 'Left':
        case 'ArrowLeft': {
          event.preventDefault();
          const wasOpen = state.open !== null;
          const next = moveFocus(event.key === 'Right' || event.key === 'ArrowRight' ? 'next' : 'previous');
          if (wasOpen && next !== el) {
            next._h_menu_trigger.focusOnOpen = 'first';
            next._h_menu_trigger.openMenu?.();
          }
          break;
        }
        case 'Down':
        case 'ArrowDown':
          event.preventDefault();
          el._h_menu_trigger.focusOnOpen = 'first';
          el._h_menu_trigger.openMenu?.();
          break;
        case 'Up':
        case 'ArrowUp':
          event.preventDefault();
          el._h_menu_trigger.focusOnOpen = 'last';
          el._h_menu_trigger.openMenu?.();
          break;
        case 'Home':
        case 'End': {
          event.preventDefault();
          const triggers = getTriggers();
          const target = event.key === 'Home' ? triggers[0] : triggers[triggers.length - 1];
          setTabStop(target);
          target.focus();
          break;
        }
        case 'Esc':
        case 'Escape':
          if (state.open === el) el._h_menu_trigger.closeMenu?.();
          break;
        case ' ':
        case 'Enter':
          el._h_menu_trigger.focusOnOpen = 'first';
          break;
      }
    }

    function onMouseEnter() {
      if (state.open && state.open !== el) {
        el._h_menu_trigger.openMenu?.();
      }
    }

    function onFocus() {
      setTabStop(el);
    }

    el.addEventListener('keydown', onKeyDown);
    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('focus', onFocus);

    cleanup(() => {
      el.removeEventListener('keydown', onKeyDown);
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('focus', onFocus);
      if (state.open === el) state.open = null;
    });
  });
}
