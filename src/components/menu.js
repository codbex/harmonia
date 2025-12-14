import { computePosition, flip, offset, shift, size } from '@floating-ui/dom';

export default function (Alpine) {
  Alpine.directive('h-menu-trigger', (el, { modifiers }) => {
    el._menu_trigger = {
      isDropdown: modifiers.includes('dropdown'),
    };
  });

  Alpine.directive('h-menu', (el, { modifiers }, { cleanup, Alpine }) => {
    el.classList.add('hidden', 'fixed', 'bg-popover', 'text-popover-foreground', 'font-normal', 'z-50', 'min-w-[8rem]', 'overflow-x-hidden', 'overflow-y-auto', 'rounded-md', 'p-1', 'shadow-md', 'border', 'outline-none');
    el.setAttribute('role', 'menu');
    el.setAttribute('aria-orientation', 'vertical');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'menu');
    if (!el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
      throw new Error('h-menu: must have an "aria-label" or "aria-labelledby" attribute');
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
      throw new Error('h-menu: menu must be placed after an h-menu-trigger element');
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

    function close(parent = false) {
      el.pauseKeyEvents = false;
      el.classList.add('hidden');
      Object.assign(el.style, {
        left: '0px',
        top: '0px',
      });
      top.removeEventListener('contextmenu', onClick);
      top.removeEventListener('click', onClick);
      el.removeEventListener('keydown', onKeydown);
      if (isSubmenu) {
        if (parent) {
          menuSubItem._menu_sub.closeTree();
        }
      } else {
        listenForTrigger(true);
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

    function onKeydown(event) {
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
            close();
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
            el.addEventListener('keydown', onKeydown);
          });
          Object.assign(el.style, {
            left: `${x}px`,
            top: `${y}px`,
          });
        });
      }
    }

    function openDropdown() {
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
      el.removeEventListener('keydown', onKeydown);
    });
  });

  Alpine.directive('h-menu-item', (el, {}, { cleanup, Alpine }) => {
    el.classList.add(
      'focus:bg-secondary-hover',
      'hover:bg-secondary-hover',
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

  Alpine.directive('h-menu-sub', (el, {}, { cleanup, Alpine }) => {
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
      "[&_svg:not([class*='size-'])]:size-4",
      'after:block',
      'after:bg-transparent',
      'after:border-t-[0.063rem]',
      'after:border-r-[0.063rem]',
      'after:border-muted-foreground',
      'after:pointer-events-none',
      'after:size-[0.438rem]',
      'after:rounded-[0.063rem]',
      'after:rotate-45',
      'after:ml-auto',
      'after:-translate-x-0.75'
    );
    el.setAttribute('role', 'menuitem');
    el.setAttribute('aria-haspopup', 'true');
    el.setAttribute('aria-expanded', 'false');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'menu-sub');

    const parentMenu = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('role') === 'menu');
    if (!parentMenu) throw new Error('h-menu-sub: Menu sub item must have a parent');

    el._menu_sub = {
      open: undefined,
      close: undefined,
      expanded: false,
      closeTree() {
        el.setAttribute('aria-expanded', 'false');
        this.expanded = false;
        el.removeEventListener('keydown', onKeydown);
        parentMenu.pauseKeyEvents = false;
        parentMenu._menu.close(true);
      },
    };

    const keyEvents = ['Right', 'ArrowRight', 'Enter', ' '];

    function onKeydown(event) {
      if (keyEvents.includes(event.key)) {
        event.stopPropagation();
        event.preventDefault();
        el.removeEventListener('keydown', onKeydown);
        const submenuitem = el.querySelector('[role^=menuitem][tabIndex="-1"]:first-of-type');
        if (submenuitem) {
          el.setAttribute('aria-expanded', 'true');
          el._menu_sub.open(el);
          parentMenu.pauseKeyEvents = true;
          Alpine.nextTick(() => {
            submenuitem.focus();
            el._menu_sub.expanded = true;
          });
        }
      }
    }

    function focusOut(event) {
      el.setAttribute('tabindex', '-1');
      if (event.type === 'mouseleave') {
        el._menu_sub.close();
        el._menu_sub.expanded = false;
        parentMenu.pauseKeyEvents = false;
        el.setAttribute('aria-expanded', 'false');
        parentMenu.focus();
      } else if (el._menu_sub.expanded) {
        el.setAttribute('aria-expanded', 'false');
        el._menu_sub.close();
        el._menu_sub.expanded = false;
        parentMenu.pauseKeyEvents = false;
        el.removeEventListener('keydown', onKeydown);
      }
    }

    function focusIn(event) {
      el.setAttribute('tabindex', '0');
      if (event.type === 'mouseenter') {
        el.setAttribute('aria-expanded', 'true');
        el.addEventListener('mouseleave', focusOut);
        el._menu_sub.open(el);
        el._menu_sub.expanded = true;
      } else {
        if (el._menu_sub.expanded) {
          el.setAttribute('aria-expanded', 'false');
          el._menu_sub.expanded = false;
          parentMenu.pauseKeyEvents = false;
        }
        el.addEventListener('keydown', onKeydown);
        el.addEventListener('blur', focusOut); // ?
      }
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

  Alpine.directive('h-menu-checkbox-item', (el, {}, { cleanup, Alpine }) => {
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
      'before:bg-transparent',
      'before:border-l-2',
      'before:border-b-2',
      'before:border-foreground',
      'before:pointer-events-none',
      'before:w-2.5',
      'before:h-1.5',
      'before:rounded-[0.125rem]',
      'before:-rotate-45',
      'before:-translate-x-0.75',
      'aria-[checked=true]:before:visible'
    );
    el.setAttribute('tabindex', '-1');
    el.setAttribute('role', 'menuitemcheckbox');
    el.setAttribute('data-slot', 'menu-checkbox-item');

    function setState(checked, dispatch = true) {
      if (dispatch)
        Alpine.nextTick(() => {
          el.dispatchEvent(new Event('change', { bubbles: true }));
        });
      el.setAttribute('aria-checked', checked);
    }

    if (el.hasOwnProperty('_x_model')) {
      function handler() {
        el._x_model.set(!el._x_model.get());
        setState(el._x_model.get());
      }

      setState(el._x_model.get(), false);

      el.addEventListener('click', handler);
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
        el.removeEventListener('click', handler);
        el.removeEventListener('keydown', handler);
      }
      el.removeEventListener('mouseenter', focusIn);
      el.removeEventListener('focus', focusIn);
      el.removeEventListener('blur', focusOut);
      el.removeEventListener('mouseleave', focusOut);
    });
  });

  Alpine.directive('h-menu-radio-item', (el, { expression }, { effect, evaluateLater, cleanup, Alpine }) => {
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

    if (el.hasOwnProperty('_x_model')) {
      function handler(event) {
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

      effect(() => {
        setState(el._x_model.get() === value);
      });

      el.addEventListener('click', handler);
      el.addEventListener('keydown', handler);
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
        el.removeEventListener('click', handler);
        el.removeEventListener('keydown', handler);
      }
      el.removeEventListener('mouseenter', focusIn);
      el.removeEventListener('focus', focusIn);
      el.removeEventListener('blur', focusOut);
      el.removeEventListener('mouseleave', focusOut);
    });
  });
}
