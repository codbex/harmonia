import { v4 as uuidv4 } from 'uuid';

export default function (Alpine) {
  Alpine.directive('h-listbox', (el, _, { cleanup }) => {
    el.classList.add(
      'divide-solid',
      'divide-y',
      'bg-input-inner',
      'border-input',
      'border',
      'rounded-control',
      'shadow-input',
      'outline-none',
      'disabled:pointer-events-none',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'focus-visible:ring-[calc(var(--spacing)*0.75)]',
      'aria-invalid:ring-negative/20',
      'dark:aria-invalid:ring-negative/40',
      'aria-invalid:border-negative',
      'invalid:!ring-negative/20',
      'dark:invalid:!ring-negative/40',
      'invalid:!border-negative',
      '[&>ul:first-child>*:first-child]:rounded-t-control',
      '[&>ul:last-child>*:last-child]:rounded-b-control'
    );
    el.setAttribute('data-slot', 'listbox');
    el.setAttribute('role', 'listbox');

    function focusFirstOption(elem) {
      const firstOption = elem.querySelector('[role="option"]');
      if (firstOption) firstOption.focus();
    }

    function focusLastOption(elem) {
      const itemList = elem.querySelectorAll('[role="option"]');
      if (itemList.length) {
        itemList[itemList.length - 1].focus();
      }
    }

    function selectOption(option) {
      const selected = el.querySelector('[aria-selected="true"]');
      if (selected) selected.removeAttribute('aria-selected');
      if (selected !== option) option.setAttribute('aria-selected', 'true');
    }

    function onKeyDown(event) {
      switch (event.key) {
        case 'PageUp':
        case 'PageDown':
          event.preventDefault();
          break;
        case 'Home':
          focusFirstOption(el);
          break;
        case 'End':
          focusLastOption(el);
          break;
        case 'Up':
        case 'ArrowUp':
          let prevElem = event.target.previousElementSibling;
          if (prevElem && prevElem.getAttribute('data-slot') !== 'list-header') {
            prevElem.focus();
          } else {
            prevElem = event.target.parentElement.previousElementSibling;
            if (prevElem && prevElem.tagName === 'UL') {
              focusLastOption(prevElem);
            }
          }
          break;
        case 'Down':
        case 'ArrowDown':
          let nextElem = event.target.nextElementSibling;
          if (nextElem) {
            nextElem.focus();
          } else {
            nextElem = event.target.parentElement.nextElementSibling;
            if (nextElem && nextElem.tagName === 'UL') {
              focusFirstOption(nextElem);
            }
          }
          break;
        case ' ':
        case 'Enter':
          selectOption(event.target);
          break;
        default:
          break;
      }
    }

    function onClick(event) {
      if (event.target.getAttribute('data-slot') === 'list-item') selectOption(event.target);
    }

    el.addEventListener('click', onClick);
    el.addEventListener('keydown', onKeyDown);
    cleanup(() => {
      el.removeEventListener('keydown', onKeyDown);
      el.removeEventListener('click', onClick);
    });
  });

  Alpine.directive('h-list', (el) => {
    el.classList.add('divide-solid', 'divide-y');
    el.setAttribute('data-slot', 'list');
    el.setAttribute('role', 'group');
  });

  Alpine.directive('h-list-header', (el, { original }, { Alpine }) => {
    el.classList.add('font-medium', 'flex', 'items-center', 'p-2', 'gap-2', 'align-middle', 'bg-table-header', 'text-table-header-foreground');
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

  Alpine.directive('h-list-item', (el, { modifiers }) => {
    el.classList.add('min-h-11', 'flex', 'items-center', 'p-2', 'gap-2', 'align-middle', 'outline-none');
    el.setAttribute('data-slot', 'list-item');
    const listbox = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('data-slot') === 'listbox');
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
        '[&[aria-selected=true]:hover]:bg-primary-hover',
        '[&[aria-selected=true]:hover]:text-primary-hover-foreground',
        '[&[aria-selected=true]:focus]:bg-primary-hover',
        '[&[aria-selected=true]:focus]:text-primary-hover-foreground'
      );
      el.setAttribute('tabindex', '0');
    }
    if (listbox) {
      setInteractive();
      el.setAttribute('role', 'option');
      el.setAttribute('tabindex', '0');
    } else if (modifiers.includes('interactive')) {
      setInteractive();
    } else {
      el.setAttribute('tabindex', '-1');
    }
  });
}
