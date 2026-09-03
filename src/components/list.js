import { isDisabled } from '../common/disabled';
import { listboxShellClasses } from '../common/shared-classes';
import { getFirstChar, isPrintableCharacter } from '../common/typeahead';
import uuidv4 from '../utils/uuid';

// Containers whose children are options rather than plain list rows. The
// combobox (src/components/combobox.js) is the listbox popup of a text field,
// so its items are the same options a listbox holds.
const OPTION_CONTAINERS = ['listbox', 'combobox'];

export default function (Alpine) {
  Alpine.directive('h-listbox', (el, _, { cleanup }) => {
    el.classList.add(...listboxShellClasses);
    el.setAttribute('data-slot', 'listbox');
    el.setAttribute('role', 'listbox');

    // Every option is reachable, disabled ones included. aria-disabled announces
    // the option as unavailable while leaving it focusable but inert.
    function getFocusableOptions() {
      return [...el.querySelectorAll('[role=option]')];
    }

    // Options find "the current one" through the roving tabindex, so the stop
    // has to be moved explicitly rather than just followed by focus.
    function moveFocus(target) {
      if (!target) return;
      const current = el.querySelector('[role=option][tabindex="0"]');
      if (current) current.setAttribute('tabindex', '-1');
      target.setAttribute('tabindex', '0');
      target.focus();
    }

    function findMatching(str, candidates) {
      for (const option of candidates) {
        if (getFirstChar(option.textContent).startsWith(str.toLowerCase())) {
          moveFocus(option);
          return true;
        }
      }
      return false;
    }

    function selectOption(option) {
      if (isDisabled(option)) return;
      const selected = el.querySelector('[aria-selected="true"]');
      if (selected) selected.removeAttribute('aria-selected');
      if (selected !== option) option.setAttribute('aria-selected', 'true');
    }

    function onKeyDown(event) {
      const options = getFocusableOptions();
      const index = options.findIndex((option) => option.getAttribute('tabindex') === '0');
      switch (event.key) {
        case 'Up':
        case 'ArrowUp':
          event.preventDefault();
          // Stepping with no stop yet enters from the near end, and the ends
          // clamp rather than wrap so the listbox has a discoverable start.
          moveFocus(index === -1 ? options[options.length - 1] : options[index - 1]);
          break;
        case 'Down':
        case 'ArrowDown':
          event.preventDefault();
          moveFocus(index === -1 ? options[0] : options[index + 1]);
          break;
        case 'Home':
        case 'PageUp':
          event.preventDefault();
          moveFocus(options[0]);
          break;
        case 'End':
        case 'PageDown':
          event.preventDefault();
          moveFocus(options[options.length - 1]);
          break;
        case ' ':
        case 'Enter': {
          const option = event.target.closest('[role=option]');
          if (!option) break;
          event.preventDefault();
          selectOption(option);
          break;
        }
        default:
          if (isPrintableCharacter(event.key)) {
            // Search from after the current option first, so repeating a letter
            // cycles through the matches instead of sticking on the first.
            if (!findMatching(event.key, options.slice(index + 1))) {
              findMatching(event.key, options);
            }
          }
      }
    }

    function onClick(event) {
      const option = event.target.closest('[role=option]');
      if (option) selectOption(option);
    }

    el.addEventListener('click', onClick);
    el.addEventListener('keydown', onKeyDown);

    // Which option holds the tab stop cannot be decided by the items
    // themselves, since an item cannot see whether an earlier one already
    // claimed it. Wait for them all to mount, then give the stop to the
    // selected option, or to the first one. A disabled option can hold the stop,
    // since it is still announced, just not selectable.
    function ensureTabStop() {
      if (el.querySelector('[role=option][tabindex="0"]')) return;
      const options = getFocusableOptions();
      const target = options.find((option) => option.getAttribute('aria-selected') === 'true') ?? options[0];
      if (target) target.setAttribute('tabindex', '0');
    }

    // Options rendered from a filtered list are replaced wholesale, taking the
    // tab stop with them. Without this the listbox would silently fall out of
    // the tab order for good, and with it the keydown handler above.
    const observer = new MutationObserver(ensureTabStop);
    observer.observe(el, { childList: true, subtree: true });
    queueMicrotask(ensureTabStop);

    cleanup(() => {
      observer.disconnect();
      el.removeEventListener('keydown', onKeyDown);
      el.removeEventListener('click', onClick);
    });
  });

  Alpine.directive('h-list', (el) => {
    el.classList.add('divide-solid', 'divide-y');
    el.setAttribute('data-slot', 'list');
    // A listbox only permits option and group children, so a list nested in one
    // is a group. Standalone it keeps the native list role, which is what makes
    // a screen reader announce the item count.
    const container = Alpine.findClosest(el.parentElement, (parent) => OPTION_CONTAINERS.includes(parent.getAttribute('data-slot')));
    if (container) el.setAttribute('role', 'group');
  });

  Alpine.directive('h-list-secondary', (el) => {
    el.classList.add('text-muted-foreground', '[[aria-selected=true]_&]:text-primary-foreground/75');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'list-secondary');
    }
  });

  Alpine.directive('h-list-header', (el, { original }, { Alpine }) => {
    el.classList.add(
      'font-medium',
      'flex',
      'items-center',
      'p-2',
      'gap-2',
      'align-middle',
      'bg-table-header',
      'text-table-header-foreground',
      '[[data-slot=listbox]>*:first-of-type_&:first-of-type]:rounded-t-control',
      '[[data-slot=listbox]>*:last-of-type_&:last-of-type]:rounded-b-control',
      '[[data-slot=combobox]>*:first-of-type_&:first-of-type]:rounded-t-control',
      '[[data-slot=combobox]>*:last-of-type_&:last-of-type]:rounded-b-control',
      '[[data-slot=combobox][data-variant=popover]>*:first-of-type_&:first-of-type]:rounded-t-md',
      '[[data-slot=combobox][data-variant=popover]>*:last-of-type_&:last-of-type]:rounded-b-md',
      '[[data-slot=combobox][data-variant=inline]>*:first-of-type_&:first-of-type]:rounded-t-none',
      '[[data-slot=combobox][data-variant=inline]>*:last-of-type_&:last-of-type]:rounded-b-none'
    );
    el.setAttribute('role', 'presentation');
    el.setAttribute('data-slot', 'list-header');
    const list = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('data-slot') === 'list');
    if (!list) {
      throw new Error(`${original} must be placed inside a list element`);
    }
    if (!el.hasAttribute('id')) {
      const id = `lbh${uuidv4()}`;
      el.setAttribute('id', id);
    }
    list.setAttribute('aria-labelledby', el.getAttribute('id'));
  });

  Alpine.directive('h-list-item', (el, { modifiers }, { cleanup }) => {
    el.classList.add('min-h-11', 'flex', 'items-center', 'p-2', 'gap-2', 'align-middle', 'outline-none');
    el.setAttribute('data-slot', 'list-item');
    const container = Alpine.findClosest(el.parentElement, (parent) => OPTION_CONTAINERS.includes(parent.getAttribute('data-slot')));
    function setInteractive() {
      el.classList.add(
        'focus:bg-table-hover',
        'focus:text-table-hover-foreground',
        'hover:bg-table-hover',
        'hover:text-table-hover-foreground',
        'active:bg-table-active',
        'active:text-table-active-foreground',
        'aria-selected:bg-primary',
        'aria-selected:text-primary-foreground',
        'hover:aria-selected:bg-primary-hover',
        'hover:aria-selected:text-primary-foreground',
        'focus:aria-selected:bg-primary-hover',
        'focus:aria-selected:text-primary-foreground',
        '[[data-slot=listbox]>*:first-of-type_&:first-of-type]:rounded-t-control',
        '[[data-slot=listbox]>*:last-of-type_&:last-of-type]:rounded-b-control',
        '[[data-slot=combobox]>*:first-of-type_&:first-of-type]:rounded-t-control',
        '[[data-slot=combobox]>*:last-of-type_&:last-of-type]:rounded-b-control',
        '[[data-slot=combobox][data-variant=popover]>*:first-of-type_&:first-of-type]:rounded-t-md',
        '[[data-slot=combobox][data-variant=popover]>*:last-of-type_&:last-of-type]:rounded-b-md',
        '[[data-slot=combobox][data-variant=inline]>*:first-of-type_&:first-of-type]:rounded-t-none',
        '[[data-slot=combobox][data-variant=inline]>*:last-of-type_&:last-of-type]:rounded-b-none',
        'aria-disabled:opacity-disabled',
        'aria-disabled:pointer-events-none',
        'aria-disabled:cursor-not-allowed'
      );
    }
    if (container) {
      setInteractive();
      // A combobox keeps focus in its text field, so the option the user is on
      // is marked rather than focused and needs the same highlight :focus gives
      // it inside a listbox.
      el.classList.add('data-[active=true]:bg-table-hover', 'data-[active=true]:text-table-hover-foreground', 'data-[active=true]:aria-selected:bg-primary-hover', 'data-[active=true]:aria-selected:text-primary-foreground');
      el.setAttribute('role', 'option');
      // Options start out unreachable either way. A listbox hands the tab stop
      // to one of them once they have all mounted, while a combobox never does,
      // since it is reached through its text field.
      el.setAttribute('tabindex', '-1');
    } else if (modifiers.includes('interactive')) {
      setInteractive();
      // Each interactive item is its own control rather than part of a
      // composite widget, so it takes a tab stop and Tab moves between them
      // the same way it moves between buttons.
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      // A native button activates on both Enter and Space, so an element only
      // playing one has to forward those keys itself.
      const onKeyDown = (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        if (isDisabled(el)) return;
        // Space scrolls the page and Enter submits a surrounding form, neither
        // of which a button press should do here.
        event.preventDefault();
        el.click();
      };
      el.addEventListener('keydown', onKeyDown);
      cleanup(() => el.removeEventListener('keydown', onKeyDown));
    }
  });
}
