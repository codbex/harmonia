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
  'whitespace-nowrap',
  'gap-1.5',
  'transition-colors',
  'duration-100',
  'motion-reduce:transition-none',
  'hover:bg-secondary-hover',
  'hover:text-secondary-foreground',
  'focus:bg-secondary-hover',
  'focus:text-secondary-foreground',
  'outline-ring/50',
  'focus-visible:outline-[calc(var(--spacing)*0.75)]',
  'focus-visible:outline',
  'cursor-pointer',
  'shrink-0',
  '[&_svg]:shrink-0',
  "[&_svg:not([class*='size-'])]:size-4",
  'has-[>svg]:px-2.5',
];

export default function (Alpine) {
  Alpine.directive('h-nav', (el, { original }) => {
    if (el.tagName !== 'NAV') {
      throw new Error(`${original} must be a nav element`);
    }
    if (!el.hasAttribute('aria-label')) {
      throw new Error(`${original} must have an "aria-label" attribute`);
    }
    el.classList.add('relative', 'z-10', 'flex', 'items-center');
    el.setAttribute('data-slot', 'nav');
  });

  Alpine.directive('h-nav-list', (el, { original }, { Alpine }) => {
    if (el.tagName !== 'UL') {
      throw new Error(`${original} must be a ul element`);
    }
    const nav = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('data-slot') === 'nav');
    if (!nav) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-nav')} element`);
    }
    el.classList.add('flex', 'flex-1', 'list-none', 'items-center', 'gap-1');
    el.setAttribute('data-slot', 'nav-list');
  });

  Alpine.directive('h-nav-item', (el, { original }) => {
    if (el.tagName !== 'LI') {
      throw new Error(`${original} must be a li element`);
    }
    if (el.parentElement?.getAttribute('data-slot') !== 'nav-list') {
      throw new Error(`${original} must be a direct child of a x-h-nav-list element`);
    }
    el.classList.add('relative');
    el.setAttribute('data-slot', 'nav-item');
  });

  Alpine.directive('h-nav-trigger', (el, { original }, { cleanup, Alpine }) => {
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

    el.classList.add('bg-transparent', 'data-[state=open]:bg-secondary-hover', 'disabled:opacity-50', 'disabled:pointer-events-none', ...navItemTriggerClasses);

    el.appendChild(chevron);
    el.setAttribute('data-slot', 'nav-trigger');

    const nav = Alpine.findClosest(el.parentElement, (p) => p.getAttribute('data-slot') === 'nav');
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

  Alpine.directive('h-nav-link', (el, { original }, { cleanup }) => {
    if (el.tagName !== 'A' && el.tagName !== 'BUTTON') {
      throw new Error(`${original} must be an anchor or button element`);
    } else if (el.tagName === 'BUTTON') {
      el.setAttribute('type', 'button');
    }

    el.classList.add(...navItemTriggerClasses, 'no-underline', 'text-inherit', 'data-[active]:bg-secondary-hover', 'data-[active]:font-semibold');

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
