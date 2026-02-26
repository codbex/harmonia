import { computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { Check, ChevronRight, createSvg } from './../common/icons';

export default function (Alpine) {
  Alpine.directive('h-menu-trigger', (el, { modifiers }) => {
    el._menu_trigger = {
      isDropdown: modifiers.includes('dropdown'),
      setOpen(open) {
        el.setAttribute('data-state', open ? 'open' : 'closed');
      },
    };
    el.setAttribute('data-state', 'closed');
  });

  Alpine.directive('h-menu', (el, { original, modifiers }, { cleanup, Alpine }) => {
    if (el.tagName !== 'UL') {
      throw new Error(`${original} must be an ul element`);
    }
    el.classList.add('hidden', 'fixed', 'bg-popover', 'text-popover-foreground', 'font-normal', 'z-50', 'min-w-[8rem]', 'overflow-x-hidden', 'overflow-y-auto', 'rounded-md', 'p-1', 'shadow-md', 'border', 'outline-none');
    el.setAttribute('role', 'menu');
    el.setAttribute('aria-orientation', 'vertical');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'menu');
    if (!el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
      throw new Error(`${original} must have an "aria-label" or "aria-labelledby" attribute`);
    }

    const isSubmenu = modifiers.includes('sub');

    const menuTrigger = (() => {
      if (isSubmenu) return;
      let sibling = el.previousElementSibling;
      while (sibling && !sibling.hasOwnProperty('_menu_trigger')) {
        sibling = sibling.previousElementSibling;
      }
      return sibling;
    })();

    if (!isSubmenu && !menuTrigger) {
      throw new Error(`${original} menu must be placed after a menu trigger element`);
    }

    let menuSubItem;
    if (isSubmenu) menuSubItem = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('data-slot') === 'menu-sub');

    function listenForTrigger(listen) {
      if (listen) {
        if (menuTrigger._menu_trigger.isDropdown) menuTrigger.addEventListener('click', openDropdown);
        else menuTrigger.addEventListener('contextmenu', onContextmenu);
      } else {
        if (menuTrigger._menu_trigger.isDropdown) menuTrigger.removeEventListener('click', openDropdown);
        else menuTrigger.removeEventListener('contextmenu', onContextmenu);
      }
    }

    function close(closeParent = false, focusTrigger = false) {
      el.pauseKeyEvents = false;
      el.classList.add('hidden');
      Object.assign(el.style, {
        left: '0px',
        top: '0px',
      });
      top.removeEventListener('contextmenu', onClick);
      top.removeEventListener('click', onClick);
      el.removeEventListener('keydown', onKeyDown);
      if (isSubmenu) {
        if (closeParent) {
          menuSubItem._menu_sub.closeTree();
        }
      } else {
        listenForTrigger(true);
        if (focusTrigger) menuTrigger.focus();
        if (menuTrigger._menu_trigger.isDropdown) {
          menuTrigger._menu_trigger.setOpen(false);
        }
      }
    }

    el._menu = { close };

    function isPrintableCharacter(str) {
      return str.length === 1 && /\S/.test(str);
    }

    function getFirstChar(text) {
      const clean = text.replaceAll('\n', '').trim();
      if (clean) return clean[0].toLowerCase();
      return '';
    }

    function findMatching(str, items) {
      for (let i = 0; i < items.length; i++) {
        if (getFirstChar(items[i].textContent).startsWith(str.toLowerCase())) {
          items[i].focus();
          return true;
        }
      }
      return false;
    }

    function onClick(event) {
      if (event.type === 'contextmenu') event.preventDefault();
      close(isSubmenu);
    }

    el.pauseKeyEvents = false;

    function onKeyDown(event) {
      if (!el.pauseKeyEvents) {
        let menuitem;
        switch (event.key) {
          case 'Left':
          case 'ArrowLeft':
            if (isSubmenu) {
              Alpine.nextTick(() => menuSubItem.focus());
              close();
            }
            break;
          case 'Esc':
          case 'Escape':
            if (isSubmenu) {
              Alpine.nextTick(() => menuSubItem.focus());
            }
            close(undefined, true);
            break;
          case 'Tab':
          case ' ':
          case 'Enter':
            if (event.key !== 'Tab') {
              event.preventDefault();
              event.target.click();
            }
            close();
            if (isSubmenu) {
              menuSubItem._menu_sub.closeTree();
            }
            break;
          case 'Down':
          case 'ArrowDown':
            event.preventDefault();
            menuitem = el.querySelector(':scope > [role^=menuitem][tabIndex="0"] ~ [role^=menuitem][tabIndex="-1"]');
            if (!menuitem) menuitem = el.querySelector('[role^=menuitem][tabIndex="-1"]');
            if (menuitem) {
              menuitem.focus();
            }
            break;
          case 'Up':
          case 'ArrowUp':
            event.preventDefault();
            let menuitems = el.querySelectorAll(':scope > [role^=menuitem][tabIndex="-1"]:has(~ [role^=menuitem][tabIndex="0"])');
            if (menuitems.length) {
              menuitem = menuitems[menuitems.length - 1];
            } else {
              menuitem = el.querySelector(':scope > [role^=menuitem][tabIndex="-1"]:last-of-type');
            }
            if (menuitem) {
              menuitem.focus();
            }
            break;
          case 'Home':
          case 'PageUp':
            event.preventDefault();
            menuitem = el.querySelector(':scope > [role^=menuitem][tabIndex="-1"]:first-of-type');
            if (menuitem) {
              menuitem.focus();
            }
            break;
          case 'End':
          case 'PageDown':
            event.preventDefault();
            menuitem = el.querySelector(':scope > [role^=menuitem][tabIndex="-1"]:last-of-type');
            if (menuitem) {
              menuitem.focus();
            }
            break;
          default:
            if (isPrintableCharacter(event.key)) {
              let items = el.querySelectorAll(':scope > [role^=menuitem][tabindex="0"] ~ [role^=menuitem]');
              if (!findMatching(event.key, items)) {
                items = el.querySelectorAll(':scope > [role^=menuitem][tabindex="-1"]');
                findMatching(event.key, items);
              }
            }
        }
      }
    }

    function open(parent) {
      if (el.classList.contains('hidden')) {
        el.classList.remove('hidden');
        el.pauseKeyEvents = false;
        function getPlacement() {
          if (isSubmenu) {
            return 'right-start';
          } else if (menuTrigger._menu_trigger.isDropdown) {
            return el.getAttribute('data-align') || 'bottom-start';
          }
          return 'right-start';
        }
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
          if (!isSubmenu) {
            Alpine.nextTick(() => el.focus());
            listenForTrigger(false);
          }
          Alpine.nextTick(() => {
            top.addEventListener('contextmenu', onClick);
            top.addEventListener('click', onClick);
            el.addEventListener('keydown', onKeyDown);
          });
          Object.assign(el.style, {
            left: `${x}px`,
            top: `${y}px`,
          });
        });
      }
    }

    function openDropdown() {
      if (menuTrigger._menu_trigger.isDropdown) {
        menuTrigger._menu_trigger.setOpen(true);
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
      listenForTrigger(true);
    }

    cleanup(() => {
      listenForTrigger(false);
      top.removeEventListener('click', onClick);
      top.removeEventListener('contextmenu', onClick);
      el.removeEventListener('keydown', onKeyDown);
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
      'data-[variant=negative]:text-negative',
      'data-[variant=negative]:focus:bg-negative/10',
      'data-[variant=negative]:hover:bg-negative/10',
      'data-[variant=negative]:focus:text-negative',
      'data-[variant=negative]:hover:text-negative',
      'data-[variant=negative]:*:[svg]:!text-negative',
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
      'data-[disabled]:pointer-events-none',
      'data-[disabled]:opacity-50',
      'data-[inset=true]:pl-8',
      '[&_svg]:pointer-events-none',
      '[&_svg]:shrink-0',
      "[&_svg:not([class*='size-'])]:size-4"
    );
    el.setAttribute('role', 'menuitem');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'menu-item');

    const menu = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('role') === 'menu');

    function focusOut(event) {
      el.setAttribute('tabindex', '-1');
      if (event.type === 'mouseleave') menu.focus();
    }

    function focusIn() {
      el.setAttribute('tabindex', '0');
      el.addEventListener('blur', focusOut);
      el.addEventListener('mouseleave', focusOut);
    }

    el.addEventListener('mouseenter', focusIn);
    el.addEventListener('focus', focusIn);

    cleanup(() => {
      el.removeEventListener('mouseenter', focusIn);
      el.removeEventListener('focus', focusIn);
      el.removeEventListener('blur', focusOut);
      el.removeEventListener('mouseleave', focusOut);
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
      'data-[disabled]:pointer-events-none',
      'data-[disabled]:opacity-50',
      'data-[inset=true]:pl-8',
      '[&_svg]:pointer-events-none',
      '[&_svg]:shrink-0',
      "[&_svg:not([class*='size-'])]:size-4"
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
        event.stopPropagation();
        event.preventDefault();
        el.removeEventListener('keydown', onKeyDown);
        const submenuitem = el.querySelector('[role^=menuitem][tabIndex="-1"]:first-of-type');
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
      el.setAttribute('tabindex', '-1');
      if (event.type === 'mouseleave') {
        el._menu_sub.close();
        el._menu_sub.expanded = false;
        el.setAttribute('aria-expanded', false);
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
      el.setAttribute('tabindex', '0');
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
      'aria-[disabled=true]:pointer-events-none',
      'aria-[disabled=true]:cursor-not-allowed',
      'aria-[disabled=true]:opacity-50',
      'transition-all',
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
      el._x_model.set(!el._x_model.get());
      setState(el._x_model.get());
    }

    if (el.hasOwnProperty('_x_model')) {
      setState(el._x_model.get(), false);

      el.addEventListener('click', onActivate);
    }

    const menu = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('role') === 'menu');

    function focusOut(event) {
      el.setAttribute('tabindex', '-1');
      if (event.type === 'mouseleave') menu.focus();
    }

    function focusIn() {
      el.setAttribute('tabindex', '0');
      el.addEventListener('blur', focusOut);
      el.addEventListener('mouseleave', focusOut);
    }

    el.addEventListener('mouseenter', focusIn);
    el.addEventListener('focus', focusIn);

    cleanup(() => {
      if (el.hasOwnProperty('_x_model')) {
        el.removeEventListener('click', onActivate);
        el.removeEventListener('keydown', onActivate);
      }
      el.removeEventListener('mouseenter', focusIn);
      el.removeEventListener('focus', focusIn);
      el.removeEventListener('blur', focusOut);
      el.removeEventListener('mouseleave', focusOut);
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
      'aria-[disabled=true]:pointer-events-none',
      'aria-[disabled=true]:cursor-not-allowed',
      'aria-[disabled=true]:opacity-50',
      'transition-all',
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

    if (el.hasOwnProperty('_x_model')) {
      effect(() => {
        setState(el._x_model.get() === value);
      });

      el.addEventListener('click', onActivate);
      el.addEventListener('keydown', onActivate);
    }

    const menu = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('role') === 'menu');

    function focusOut(event) {
      el.setAttribute('tabindex', '-1');
      if (event.type === 'mouseleave') menu.focus();
    }

    function focusIn() {
      el.setAttribute('tabindex', '0');
      el.addEventListener('blur', focusOut);
      el.addEventListener('mouseleave', focusOut);
    }

    el.addEventListener('mouseenter', focusIn);
    el.addEventListener('focus', focusIn);

    cleanup(() => {
      if (el.hasOwnProperty('_x_model')) {
        el.removeEventListener('click', onActivate);
        el.removeEventListener('keydown', onActivate);
      }
      el.removeEventListener('mouseenter', focusIn);
      el.removeEventListener('focus', focusIn);
      el.removeEventListener('blur', focusOut);
      el.removeEventListener('mouseleave', focusOut);
    });
  });
}
