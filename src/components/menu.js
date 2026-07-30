import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { isDisabled } from '../common/disabled';
import { addDismiss, removeDismiss } from '../utils/dismiss';
import uuidv4 from '../utils/uuid';
import { Check, ChevronRight, createSvg } from './../common/icons';
import { getFirstChar, isPrintableCharacter } from './../common/typeahead';
export default function (Alpine) {
  Alpine.directive('h-menu-trigger', (el, { modifiers }) => {
    el._h_menu_trigger = {
      isDropdown: modifiers.includes('dropdown'),
      setOpen(open) {
        el.setAttribute('aria-expanded', open);
      },
    };
    if (el._h_menu_trigger.isDropdown) {
      el.setAttribute('aria-haspopup', 'true');
      el.setAttribute('aria-expanded', 'false');
      if (!el.hasAttribute('id')) {
        el.setAttribute('id', `mt${uuidv4()}`);
      }
    }
    if (modifiers.includes('chevron')) {
      el.classList.add('[&>svg]:transition-transform', 'motion-reduce:[&>svg]:transition-none', '[&[aria-expanded=true]>svg:not(:first-child):last-child]:rotate-180');
    }
  });

  Alpine.directive('h-menu', (el, { original, modifiers }, { cleanup, Alpine }) => {
    if (el.tagName !== 'UL') {
      throw new Error(`${original} must be an ul element`);
    }
    el.classList.add(
      'hidden',
      'fixed',
      'bg-popover',
      'text-popover-foreground',
      'font-normal',
      'z-50',
      'min-w-[8rem]',
      'overflow-x-hidden',
      'overflow-y-auto',
      'rounded-md',
      'p-1',
      'shadow-md',
      'border',
      'outline-none',
      'transition-[opacity,scale]',
      'motion-reduce:transition-none',
      'duration-100',
      'ease-out',
      'opacity-0',
      'scale-95'
    );
    el.setAttribute('role', 'menu');
    el.setAttribute('aria-orientation', 'vertical');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'menu');
    const isSubmenu = modifiers.includes('sub');

    const menuTrigger = (() => {
      if (isSubmenu) return;
      let sibling = el.previousElementSibling;
      while (sibling && !Object.prototype.hasOwnProperty.call(sibling, '_h_menu_trigger')) {
        sibling = sibling.previousElementSibling;
      }
      if (!Object.prototype.hasOwnProperty.call(sibling, '_h_menu_trigger')) {
        throw new Error(`${original} menu must be placed after a menu trigger element`);
      }
      return sibling;
    })();

    function setAriaAttrubutes(parent) {
      if (!el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
        if (parent && parent.hasAttribute('id')) {
          el.setAttribute('aria-labelledby', parent.id);
        } else {
          throw new Error(`${original} must have an "aria-label" or "aria-labelledby" attribute`);
        }
      }
    }

    let menuSubItem;
    if (isSubmenu) {
      menuSubItem = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('data-slot') === 'menu-sub');
      if (!menuSubItem) {
        throw new Error(`${original} must be placed inside a ${Alpine.prefixed('h-menu-sub')} element`);
      }
      setAriaAttrubutes(menuSubItem);
    } else if (menuTrigger) {
      if (menuTrigger._h_menu_trigger.isDropdown) {
        if (!el.hasAttribute('id')) {
          el.setAttribute('id', `m${uuidv4()}`);
        }
        menuTrigger.setAttribute('aria-controls', el.getAttribute('id'));
        setAriaAttrubutes(menuTrigger);
      } else setAriaAttrubutes();
    } else {
      setAriaAttrubutes();
    }

    function listenForTrigger(listen) {
      if (listen) {
        if (menuTrigger._h_menu_trigger.isDropdown) menuTrigger.addEventListener('click', openDropdown);
        else menuTrigger.addEventListener('contextmenu', onContextmenu);
      } else {
        if (menuTrigger._h_menu_trigger.isDropdown) menuTrigger.removeEventListener('click', openDropdown);
        else menuTrigger.removeEventListener('contextmenu', onContextmenu);
      }
    }

    function close(closeParent = false, focusTrigger = false) {
      isOpen = false;
      el.pauseKeyEvents = false;
      if (autoUpdateCleanup) {
        autoUpdateCleanup();
        autoUpdateCleanup = null;
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.classList.add('hidden', 'scale-95', 'opacity-0');
        Object.assign(el.style, {
          left: '0px',
          top: '0px',
        });
      } else {
        el.classList.add('scale-95', 'opacity-0');
      }
      removeDismiss(el, 'contextmenu', onClick);
      removeDismiss(el, 'click', onClick);
      el.removeEventListener('keydown', onKeyDown);
      el.removeEventListener('focusin', onFocusIn);
      if (isSubmenu) {
        if (closeParent) {
          menuSubItem._menu_sub.closeTree();
        }
      } else {
        listenForTrigger(true);
        if (focusTrigger) menuTrigger.focus();
        if (menuTrigger._h_menu_trigger.isDropdown) {
          menuTrigger._h_menu_trigger.setOpen(false);
        }
      }
    }

    el._menu = { close };

    function findMatching(str, items) {
      for (let i = 0; i < items.length; i++) {
        if (getFirstChar(items[i].textContent).startsWith(str.toLowerCase())) {
          focusItem(items[i]);
          return true;
        }
      }
      return false;
    }

    // Every item is reachable, disabled ones included. aria-disabled announces
    // the item as unavailable while leaving it focusable, so passing over it
    // would hide it from the very users it is meant to inform. Activation is
    // guarded instead, on the keys and on the item itself.
    function getFocusableItems() {
      return Array.from(el.querySelectorAll(':scope > [role^=menuitem]'));
    }

    // Writes the stop across every item. Two items holding tabindex 0 would
    // collapse the arrow order onto whichever comes first.
    function setTabStop(target) {
      for (const item of getFocusableItems()) {
        item.setAttribute('tabindex', item === target ? '0' : '-1');
      }
    }

    // The only way focus moves between items, so the stop cannot drift.
    function focusItem(target) {
      if (!target) return;
      setTabStop(target);
      target.focus();
    }

    // Returns -1 while the menu itself still holds focus, which the callers
    // treat as "nothing focused yet".
    function currentItem(event, items) {
      const item = event.target.closest?.('[role^=menuitem]');
      return item && items.includes(item) ? items.indexOf(item) : -1;
    }

    function moveFocus(event, offset) {
      const items = getFocusableItems();
      if (!items.length) return;
      const current = currentItem(event, items);
      // With nothing focused yet, stepping down starts at the first item and
      // stepping up at the last.
      if (current === -1) {
        focusItem(items[offset > 0 ? 0 : items.length - 1]);
        return;
      }
      focusItem(items[(current + offset + items.length) % items.length]);
    }

    // Focus also arrives by click and by hover, so the stop follows it there
    // too. 'focus' does not bubble, hence focusin.
    function onFocusIn(event) {
      const item = event.target.closest?.('[role^=menuitem]');
      if (item && item.parentElement === el) setTabStop(item);
    }

    function onClick(event) {
      if (event.type === 'contextmenu') event.preventDefault();
      if (el.getAttribute('data-innerclicks') === 'true' && el.contains(event.composedPath()[0])) {
        return;
      } else close(isSubmenu);
    }

    el.pauseKeyEvents = false;

    function onKeyDown(event) {
      if (!el.pauseKeyEvents) {
        switch (event.key) {
          case 'Left':
          case 'ArrowLeft':
            if (isSubmenu) {
              Alpine.nextTick(() => menuSubItem.focus());
              close();
            } else if (menuTrigger?._h_menu_trigger.moveInBar) {
              event.preventDefault();
              menuTrigger._h_menu_trigger.moveInBar('previous');
            }
            break;
          case 'Right':
          case 'ArrowRight':
            if (!isSubmenu && menuTrigger?._h_menu_trigger.moveInBar) {
              event.preventDefault();
              menuTrigger._h_menu_trigger.moveInBar('next');
            }
            break;
          case 'Esc':
          case 'Escape':
            if (isSubmenu) {
              Alpine.nextTick(() => menuSubItem.focus());
            }
            close(undefined, true);
            break;
          case ' ':
          case 'Enter': {
            event.preventDefault();
            if (isDisabled(event.target.closest('[role^=menuitem]'))) break;
            event.target.click();
            close();
            if (isSubmenu) {
              menuSubItem._menu_sub.closeTree();
            }
            break;
          }
          case 'Tab':
            close();
            if (isSubmenu) {
              menuSubItem._menu_sub.closeTree();
            }
            break;
          case 'Down':
          case 'ArrowDown':
            event.preventDefault();
            moveFocus(event, 1);
            break;
          case 'Up':
          case 'ArrowUp':
            event.preventDefault();
            moveFocus(event, -1);
            break;
          case 'Home':
          case 'PageUp': {
            event.preventDefault();
            const items = getFocusableItems();
            focusItem(items[0]);
            break;
          }
          case 'End':
          case 'PageDown': {
            event.preventDefault();
            const items = getFocusableItems();
            focusItem(items[items.length - 1]);
            break;
          }
          default:
            if (isPrintableCharacter(event.key)) {
              // Search from after the focused item first, so repeating a letter
              // cycles through the matches instead of sticking on the first.
              const items = getFocusableItems();
              const current = currentItem(event, items);
              if (!findMatching(event.key, items.slice(current + 1))) {
                findMatching(event.key, items);
              }
            }
        }
      }
    }

    let autoUpdateCleanup;
    let isOpen = false;

    function open(parent) {
      if (!isOpen) {
        isOpen = true;
        el.classList.remove('hidden');
        el.pauseKeyEvents = false;
        function getPlacement() {
          if (isSubmenu) {
            return 'right-start';
          } else if (menuTrigger._h_menu_trigger.isDropdown) {
            return el.getAttribute('data-align') || 'bottom-start';
          }
          return 'right-start';
        }

        let firstOpen = true;

        function updatePosition() {
          const isFirst = firstOpen;
          firstOpen = false;
          computePosition(parent, el, {
            placement: getPlacement(),
            strategy: 'fixed',
            middleware: [
              offset(isSubmenu ? 0 : 4),
              flip(),
              shift({ padding: 4 }),
              size({
                apply({ availableWidth, availableHeight, elements }) {
                  Object.assign(elements.floating.style, {
                    maxWidth: `${Math.max(0, availableWidth) - 4}px`,
                    maxHeight: `${Math.max(0, availableHeight) - 4}px`,
                  });
                },
              }),
            ],
          }).then(({ x, y }) => {
            if (isFirst) {
              if (!isSubmenu) {
                const focusOnOpen = menuTrigger._h_menu_trigger.focusOnOpen;
                menuTrigger._h_menu_trigger.focusOnOpen = undefined;
                let focusTarget = el;
                if (focusOnOpen) {
                  // A disabled item can take the initial focus, since it is
                  // announced rather than hidden.
                  const items = getFocusableItems();
                  focusTarget = (focusOnOpen === 'last' ? items[items.length - 1] : items[0]) ?? el;
                }
                // Opening onto an item seeds the stop there, onto the menu
                // leaves every item at -1.
                Alpine.nextTick(() => (focusTarget === el ? el.focus() : focusItem(focusTarget)));
                listenForTrigger(false);
              }
              Alpine.nextTick(() => {
                addDismiss(el, 'contextmenu', onClick);
                addDismiss(el, 'click', onClick);
                el.addEventListener('keydown', onKeyDown);
                el.addEventListener('focusin', onFocusIn);
              });
            }
            Object.assign(el.style, {
              left: `${x}px`,
              top: `${y}px`,
            });
            el.classList.remove('scale-95', 'opacity-0');
          });
        }

        if (!isSubmenu && menuTrigger._h_menu_trigger.isDropdown) {
          autoUpdateCleanup = autoUpdate(parent, el, updatePosition);
        } else {
          updatePosition();
        }
      }
    }

    function openDropdown() {
      if (menuTrigger._h_menu_trigger.isDropdown) {
        menuTrigger._h_menu_trigger.setOpen(true);
      }
      open(menuTrigger);
    }

    function onContextmenu(event) {
      event.preventDefault();
      open({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: event.clientX,
            y: event.clientY,
            top: event.clientY,
            left: event.clientX,
            right: event.clientX,
            bottom: event.clientY,
          };
        },
      });
      listenForTrigger(false);
    }

    if (isSubmenu) {
      menuSubItem._menu_sub.open = open;
      menuSubItem._menu_sub.close = close;
    } else {
      if (menuTrigger._h_menu_trigger.navItem) {
        menuTrigger._h_menu_trigger.openMenu = openDropdown;
        menuTrigger._h_menu_trigger.closeMenu = close;
      }
      listenForTrigger(true);
    }

    function onTransitionEnd(event) {
      if (event.target === el && event.target.classList.contains('opacity-0')) {
        el.classList.add('hidden');
        Object.assign(el.style, {
          left: '0px',
          top: '0px',
        });
      }
    }

    el.addEventListener('transitionend', onTransitionEnd);

    cleanup(() => {
      if (autoUpdateCleanup) autoUpdateCleanup();
      if (menuTrigger) listenForTrigger(false);
      removeDismiss(el, 'click', onClick);
      removeDismiss(el, 'contextmenu', onClick);
      el.removeEventListener('keydown', onKeyDown);
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('transitionend', onTransitionEnd);
    });
  });

  Alpine.directive('h-menu-item', (el, { original }, { cleanup, Alpine }) => {
    if (el.tagName !== 'LI') {
      throw new Error(`${original} must be a li element`);
    }
    el.classList.add(
      'focus:bg-secondary-hover',
      'focus:text-secondary-foreground',
      'hover:bg-secondary-hover',
      'hover:text-secondary-foreground',
      'data-[active=true]:text-primary',
      'data-[active=true]:focus:bg-primary/10',
      'data-[active=true]:hover:bg-primary/10',
      'data-[active=true]:*:[svg]:text-primary!',
      'data-[variant=negative]:text-negative',
      'data-[variant=negative]:focus:bg-negative/10',
      'data-[variant=negative]:hover:bg-negative/10',
      'data-[variant=negative]:*:[svg]:text-negative!',
      "[&_svg:not([class*='text-'])]:text-muted-foreground",
      'relative',
      'flex',
      'cursor-default',
      'items-center',
      'gap-2',
      'rounded-sm',
      'px-2',
      'py-1.5',
      'text-sm',
      'outline-hidden',
      'select-none',
      'aria-disabled:pointer-events-none',
      'aria-disabled:cursor-not-allowed',
      'aria-disabled:opacity-disabled',
      'data-[inset=true]:pl-8',
      'svg-defaults',
      '[&>a]:no-underline',
      '[&>a]:text-inherit',
      '[&>a]:size-full'
    );
    el.setAttribute('role', 'menuitem');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'menu-item');

    const menu = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('role') === 'menu');

    // Hovering moves the real focus and the menu's focusin handler follows it.
    function onMouseEnter() {
      el.focus();
    }

    function onMouseLeave() {
      menu.focus();
    }

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);

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

    cleanup(() => {
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      observer.disconnect();
    });
  });

  Alpine.directive('h-menu-sub', (el, { original }, { cleanup, Alpine }) => {
    el.classList.add(
      'focus:bg-secondary-hover',
      'hover:bg-secondary-hover',
      'aria-expanded:bg-secondary-hover',
      "[&_svg:not([class*='text-'])]:text-muted-foreground",
      'relative',
      'flex',
      'cursor-default',
      'items-center',
      'gap-2',
      'rounded-sm',
      'px-2',
      'py-1.5',
      'text-sm',
      'outline-hidden',
      'select-none',
      'aria-disabled:pointer-events-none',
      'aria-disabled:cursor-not-allowed',
      'aria-disabled:opacity-disabled',
      'data-[inset=true]:pl-8',
      'svg-defaults'
    );
    el.setAttribute('role', 'menuitem');
    el.setAttribute('aria-haspopup', 'true');
    el.setAttribute('aria-expanded', 'false');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'menu-sub');

    const chevronRight = createSvg({ icon: ChevronRight, classes: 'size-4 ml-auto', attrs: { 'aria-hidden': true, role: 'presentation' } });
    el.appendChild(chevronRight);

    const parentMenu = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('role') === 'menu');
    if (!parentMenu) throw new Error(`${original} must have a parent`);

    if (!el.hasAttribute('id')) {
      el.setAttribute('id', `ms${uuidv4()}`);
    }

    el._menu_sub = {
      open: undefined,
      close: undefined,
      expanded: false,
      closeTree() {
        el.setAttribute('aria-expanded', 'false');
        this.expanded = false;
        el.removeEventListener('keydown', onKeyDown);
        parentMenu.pauseKeyEvents = false;
        parentMenu._menu.close(true);
      },
    };

    const keyEvents = ['Right', 'ArrowRight', 'Enter', ' '];

    function onKeyDown(event) {
      if (keyEvents.includes(event.key)) {
        // Consumed even when disabled, or the key would fall through to the
        // parent menu and act there.
        event.stopPropagation();
        event.preventDefault();
        if (isDisabled(el)) return;
        el.removeEventListener('keydown', onKeyDown);
        const submenu = el.querySelector(':scope > [role=menu]');
        const submenuitem = submenu?.querySelector(':scope > [role^=menuitem]');
        if (submenuitem) {
          el.setAttribute('aria-expanded', 'true');
          el._menu_sub.open(el);
          parentMenu.pauseKeyEvents = true;
          Alpine.nextTick(() => {
            submenuitem.focus();
            el._menu_sub.expanded = true;
            el.setAttribute('aria-expanded', true);
          });
        }
      }
    }

    function focusOut(event) {
      if (event.type === 'mouseleave') {
        // A disabled subitem never opened, so there is nothing to close.
        if (!isDisabled(el)) {
          el._menu_sub.close();
          el._menu_sub.expanded = false;
          el.setAttribute('aria-expanded', false);
        }
        parentMenu.pauseKeyEvents = false;
        parentMenu.focus();
      } else if (el._menu_sub.expanded) {
        el._menu_sub.close();
        el._menu_sub.expanded = false;
        el.setAttribute('aria-expanded', false);
        parentMenu.pauseKeyEvents = false;
        el.removeEventListener('keydown', onKeyDown);
      }
    }

    function focusIn(event) {
      // A disabled subitem is announced as a submenu that cannot be opened. It
      // still listens, to swallow the expand keys and to hand focus back.
      if (isDisabled(el)) {
        if (event.type === 'focus') el.addEventListener('keydown', onKeyDown);
        else if (event.type === 'mouseenter') el.addEventListener('mouseleave', focusOut);
        return;
      }
      if (event.type === 'click' && event.pointerType === 'touch' && (event.target === el || event.target.parentElement === el)) {
        el._menu_sub.open(el);
        el._menu_sub.expanded = true;
        el.setAttribute('aria-expanded', true);
        event.stopPropagation();
      } else if (event.type === 'mouseenter') {
        el.addEventListener('mouseleave', focusOut);
        el._menu_sub.open(el);
        el._menu_sub.expanded = true;
        el.setAttribute('aria-expanded', true);
      } else {
        if (el._menu_sub.expanded) {
          el._menu_sub.expanded = false;
          el.setAttribute('aria-expanded', false);
          parentMenu.pauseKeyEvents = false;
        }
        el.addEventListener('keydown', onKeyDown);
        el.addEventListener('blur', focusOut); // ?
      }
    }

    el.addEventListener('mouseenter', focusIn);
    el.addEventListener('click', focusIn);
    el.addEventListener('focus', focusIn);

    cleanup(() => {
      el.removeEventListener('mouseenter', focusIn);
      el.removeEventListener('click', focusIn);
      el.removeEventListener('focus', focusIn);
      el.removeEventListener('blur', focusOut);
      el.removeEventListener('mouseleave', focusOut);
      el.removeEventListener('keydown', onKeyDown);
    });
  });

  Alpine.directive('h-menu-item-secondary', (el) => {
    el.classList.add('text-muted-foreground', 'ml-auto', 'text-xs', 'tracking-widest');
    el.setAttribute('data-slot', 'menu-item-secondary');
  });

  Alpine.directive('h-menu-separator', (el) => {
    el.classList.add('bg-border', '-mx-1', 'my-1', 'h-px');
    el.setAttribute('role', 'presentation');
    el.setAttribute('data-slot', 'menu-separator');
  });

  Alpine.directive('h-menu-label', (el) => {
    el.classList.add('text-foreground', 'px-2', 'py-1.5', 'text-sm', 'font-semibold', 'text-left', 'data-[inset=true]:pl-8');
    el.setAttribute('data-slot', 'menu-label');
  });

  Alpine.directive('h-menu-checkbox-item', (el, { original }, { cleanup, Alpine }) => {
    if (el.tagName !== 'LI' && el.tagName !== 'DIV') {
      throw new Error(`${original} must be a li or div element`);
    }
    el.classList.add(
      'focus:bg-secondary-hover',
      'hover:bg-secondary-hover',
      'relative',
      'flex',
      'cursor-default',
      'items-center',
      'gap-2',
      'rounded-sm',
      'px-2',
      'py-1.5',
      'text-sm',
      'outline-hidden',
      'select-none',
      'aria-disabled:pointer-events-none',
      'aria-disabled:cursor-not-allowed',
      'aria-disabled:opacity-disabled',
      'transition-all',
      'motion-reduce:transition-none',
      'overflow-hidden',
      'aria-[checked=true]:[&>svg]:visible'
    );
    el.setAttribute('tabindex', '-1');
    el.setAttribute('role', 'menuitemcheckbox');
    el.setAttribute('data-slot', 'menu-checkbox-item');

    const check = createSvg({ icon: Check, classes: 'size-4 invisible', attrs: { 'aria-hidden': true, role: 'presentation' } });
    el.prepend(check);

    function setState(checked, dispatch = true) {
      if (dispatch)
        Alpine.nextTick(() => {
          el.dispatchEvent(new Event('change', { bubbles: true }));
        });
      el.setAttribute('aria-checked', checked);
    }

    function onActivate() {
      if (isDisabled(el)) return;
      el._x_model.set(!el._x_model.get());
      setState(el._x_model.get());
    }

    if (Object.prototype.hasOwnProperty.call(el, '_x_model')) {
      setState(el._x_model.get(), false);

      el.addEventListener('click', onActivate);
    }

    const menu = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('role') === 'menu');

    // Hovering moves the real focus and the menu's focusin handler follows it.
    function onMouseEnter() {
      el.focus();
    }

    function onMouseLeave() {
      menu.focus();
    }

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);

    cleanup(() => {
      if (Object.prototype.hasOwnProperty.call(el, '_x_model')) {
        el.removeEventListener('click', onActivate);
        el.removeEventListener('keydown', onActivate);
      }
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
    });
  });

  Alpine.directive('h-menu-radio-item', (el, { original, expression }, { effect, evaluateLater, cleanup, Alpine }) => {
    if (el.tagName !== 'LI' && el.tagName !== 'DIV') {
      throw new Error(`${original} must be a li or div element`);
    }
    el.classList.add(
      'focus:bg-secondary-hover',
      'hover:bg-secondary-hover',
      'relative',
      'flex',
      'cursor-default',
      'items-center',
      'gap-2',
      'rounded-sm',
      'pr-2',
      'pl-3.5',
      'py-1.5',
      'text-sm',
      'outline-hidden',
      'select-none',
      'aria-disabled:pointer-events-none',
      'aria-disabled:cursor-not-allowed',
      'aria-disabled:opacity-disabled',
      'transition-all',
      'motion-reduce:transition-none',
      'overflow-hidden',
      'before:invisible',
      'before:bg-foreground',
      'before:pointer-events-none',
      'before:size-2',
      'before:rounded-full',
      'before:-translate-x-0.75',
      'aria-[checked=true]:before:visible'
    );
    el.setAttribute('tabindex', '-1');
    el.setAttribute('type', 'radio');
    el.setAttribute('role', 'menuitemradio');
    el.setAttribute('data-slot', 'menu-radio-item');

    const getValue = evaluateLater(expression);
    let value;

    effect(() => {
      getValue((val) => (value = val));
    });

    function setState(checked, dispatch = true) {
      el.setAttribute('aria-checked', checked);
      if (dispatch) el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function onActivate(event) {
      if (isDisabled(el)) return;
      if (event.type === 'keydown') {
        if (event.key !== ' ' && event.key !== 'Enter') {
          return;
        } else if (event.key === ' ') {
          event.preventDefault();
        }
      }
      if (el._x_model.get() !== value) {
        el._x_model.set(value);
      }
    }

    if (Object.prototype.hasOwnProperty.call(el, '_x_model')) {
      effect(() => {
        setState(el._x_model.get() === value);
      });

      el.addEventListener('click', onActivate);
      el.addEventListener('keydown', onActivate);
    }

    const menu = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('role') === 'menu');

    // Hovering moves the real focus and the menu's focusin handler follows it.
    function onMouseEnter() {
      el.focus();
    }

    function onMouseLeave() {
      menu.focus();
    }

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);

    cleanup(() => {
      if (Object.prototype.hasOwnProperty.call(el, '_x_model')) {
        el.removeEventListener('click', onActivate);
        el.removeEventListener('keydown', onActivate);
      }
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
    });
  });
}
