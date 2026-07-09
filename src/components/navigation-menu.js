import { findAncestorState } from '../common/ancestor';
import uuidv4 from '../utils/uuid';
import { ChevronDown, createSvg } from './../common/icons';

const navItemTriggerClasses = [
  'inline-flex',
  'h-9',
  'w-max',
  'items-center',
  'justify-center',
  'rounded-control',
  'px-3',
  'py-2',
  'text-sm',
  'font-medium',
  'text-foreground',
  'whitespace-nowrap',
  'gap-1.5',
  'transition-colors',
  'duration-100',
  'motion-reduce:transition-none',
  'outline-ring/50',
  'focus-visible:outline-[calc(var(--spacing)*0.75)]',
  'focus-visible:outline',
  'cursor-pointer',
  'shrink-0',
  '[&_svg]:shrink-0',
  "[&_svg:not([class*='size-'])]:size-4",
  'has-[>svg]:px-2.5',
];

const navLinkVariants = {
  default: ['hover:bg-secondary-hover', 'hover:text-secondary-foreground', 'focus:bg-secondary-hover', 'focus:text-secondary-foreground', 'data-[active]:bg-secondary-hover'],
  clear: ['data-[active]:text-primary'],
  underline: ['hover:underline', 'data-[active]:text-primary'],
  outline: ['border', 'border-transparent', 'hover:border-border', 'focus:border-border', 'data-[active]:border-border'],
};

const navTriggerVariants = {
  default: [...navLinkVariants.default, 'data-[state=open]:bg-secondary-hover', 'group-has-[[data-active=true]]/nav-item:bg-secondary-hover'],
  clear: [...navLinkVariants.clear, 'data-[state=open]:text-primary', 'group-has-[[data-active=true]]/nav-item:text-primary'],
  underline: [...navLinkVariants.underline, 'data-[state=open]:text-primary', 'group-has-[[data-active=true]]/nav-item:text-primary'],
  outline: [...navLinkVariants.outline, 'data-[state=open]:border-border', 'group-has-[[data-active=true]]/nav-item:border-border'],
};

export default function (Alpine) {
  Alpine.directive('h-nav', (el, { original }, { Alpine, cleanup }) => {
    if (el.tagName !== 'NAV') {
      throw new Error(`${original} must be a nav element`);
    }
    if (!el.hasAttribute('aria-label')) {
      throw new Error(`${original} must have an "aria-label" attribute`);
    }
    el.classList.add('relative', 'flex', 'items-center');
    el.setAttribute('data-slot', 'nav');
    el._h_nav = Alpine.reactive({ variant: el.getAttribute('data-variant') ?? 'default' });
    const observer = new MutationObserver(() => {
      el._h_nav.variant = el.getAttribute('data-variant') ?? 'default';
    });
    observer.observe(el, { attributes: true, attributeFilter: ['data-variant'] });
    cleanup(() => observer.disconnect());
  });

  Alpine.directive('h-nav-list', (el, { original }, { effect, Alpine }) => {
    if (el.tagName !== 'UL') {
      throw new Error(`${original} must be a ul element`);
    }
    const nav = findAncestorState(Alpine, el, '_h_nav');
    if (!nav) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-nav')} element`);
    }
    el.classList.add('flex', 'flex-1', 'list-none', 'items-center');
    el.setAttribute('data-slot', 'nav-list');

    effect(() => {
      const variant = nav._h_nav.variant;
      if (variant === 'clear' || variant === 'underline') {
        el.classList.remove('gap-1');
      } else {
        el.classList.add('gap-1');
      }
    });
  });

  Alpine.directive('h-nav-item', (el, { original }) => {
    if (el.tagName !== 'LI') {
      throw new Error(`${original} must be a li element`);
    }
    if (el.parentElement?.getAttribute('data-slot') !== 'nav-list') {
      throw new Error(`${original} must be a direct child of a x-h-nav-list element`);
    }
    el.classList.add('relative', 'group/nav-item');
    el.setAttribute('data-slot', 'nav-item');
  });

  Alpine.directive('h-nav-trigger', (el, { original }, { effect, cleanup, Alpine }) => {
    if (el.tagName !== 'BUTTON') {
      throw new Error(`${original} must be a button element`);
    }
    const navItem = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('data-slot') === 'nav-item');
    if (!navItem) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-nav-item')} element`);
    }

    if (!el.hasAttribute('id')) {
      el.setAttribute('id', `nnt${uuidv4()}`);
    }

    const chevron = createSvg({
      icon: ChevronDown,
      classes: 'size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none [[data-state=open]_&]:rotate-180',
      attrs: { 'aria-hidden': 'true', role: 'presentation' },
    });

    el._h_menu_trigger = {
      isDropdown: true,
      navItem: true,
      openMenu: undefined,
      closeMenu: undefined,
      setOpen(open) {
        el.setAttribute('aria-expanded', String(open));
        el.setAttribute('data-state', open ? 'open' : 'closed');
      },
    };

    el.setAttribute('aria-haspopup', 'menu');
    el.setAttribute('aria-expanded', 'false');
    el.setAttribute('data-state', 'closed');

    el.classList.add('bg-transparent', 'disabled:opacity-disabled', 'disabled:pointer-events-none', ...navItemTriggerClasses);

    el.appendChild(chevron);
    el.setAttribute('data-slot', 'nav-trigger');

    const nav = findAncestorState(Alpine, el, '_h_nav');

    function setTriggerVariant(variant) {
      for (const classes of Object.values(navTriggerVariants)) {
        el.classList.remove(...classes);
      }
      el.classList.add(...(navTriggerVariants[variant] ?? navTriggerVariants.default));
    }

    if (nav) {
      effect(() => setTriggerVariant(nav._h_nav.variant));
    } else {
      setTriggerVariant('default');
    }

    let cancelHoverCleanup = null;

    if (nav?.hasAttribute('data-open-on-hover')) {
      el.classList.remove('cursor-pointer');
      let closeTimer = null;

      function scheduleClose() {
        closeTimer = setTimeout(() => {
          el._h_menu_trigger.closeMenu?.();
          closeTimer = null;
        }, 100);
      }

      function cancelClose() {
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = null;
        }
      }

      function onNavItemEnter() {
        cancelClose();
        el._h_menu_trigger.openMenu?.();
      }

      navItem.addEventListener('mouseenter', onNavItemEnter);
      navItem.addEventListener('mouseleave', scheduleClose);

      cancelHoverCleanup = () => {
        cancelClose();
        navItem.removeEventListener('mouseenter', onNavItemEnter);
        navItem.removeEventListener('mouseleave', scheduleClose);
      };
    }

    cleanup(() => {
      if (cancelHoverCleanup) cancelHoverCleanup();
      if (chevron.parentElement === el) el.removeChild(chevron);
    });
  });

  Alpine.directive('h-nav-link', (el, { original }, { effect, cleanup, Alpine }) => {
    if (el.tagName !== 'A' && el.tagName !== 'BUTTON') {
      throw new Error(`${original} must be an anchor or button element`);
    } else if (el.tagName === 'BUTTON') {
      el.setAttribute('type', 'button');
    }

    el.classList.add(...navItemTriggerClasses, 'no-underline', 'text-inherit', 'data-[active]:font-semibold');

    function setLinkVariant(variant) {
      for (const classes of Object.values(navLinkVariants)) {
        el.classList.remove(...classes);
      }
      el.classList.add(...(navLinkVariants[variant] ?? navLinkVariants.default));
    }

    const nav = findAncestorState(Alpine, el, '_h_nav');
    if (nav) {
      effect(() => setLinkVariant(nav._h_nav.variant));
    } else {
      setLinkVariant('default');
    }

    function syncActive() {
      if (el.hasAttribute('data-active')) {
        el.setAttribute('aria-current', 'page');
      } else {
        el.removeAttribute('aria-current');
      }
    }

    syncActive();

    const observer = new MutationObserver(syncActive);
    observer.observe(el, { attributes: true, attributeFilter: ['data-active'] });

    el.setAttribute('data-slot', 'nav-link');

    cleanup(() => observer.disconnect());
  });
}
