import { isDisabled } from '../common/disabled';
import { listboxShellClasses } from '../common/shared-classes';
import { getFirstChar, isPrintableCharacter } from '../common/typeahead';

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
}
