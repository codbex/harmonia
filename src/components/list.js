import uuidv4 from '../utils/uuid';

// Containers whose children are options rather than plain list rows. The
// listbox (src/components/listbox.js) borrows this file's list and item for its
// markup, and the combobox (src/components/combobox.js) is the listbox popup of
// a text field, so its items are the same options a listbox holds.
const OPTION_CONTAINERS = ['listbox', 'combobox'];

// The listbox or combobox whose options this element belongs to, or undefined
// when it belongs to none. The walk stops at a list item, since a list nested
// inside one is that item's own content rather than more options for the
// listbox around it. Without the stop those rows claim 'role=option' and join
// the set the listbox and the combobox collect with '[role=option]', which
// hands the arrow keys and the tab stop to rows that are not options.
function findOptionContainer(Alpine, el) {
  const boundary = Alpine.findClosest(el.parentElement, (parent) => {
    const slot = parent.getAttribute('data-slot');
    return slot === 'list-item' || OPTION_CONTAINERS.includes(slot);
  });
  return boundary && OPTION_CONTAINERS.includes(boundary.getAttribute('data-slot')) ? boundary : undefined;
}

export default function (Alpine) {
  Alpine.directive('h-list', (el) => {
    el.classList.add('divide-solid', 'divide-y');
    el.setAttribute('data-slot', 'list');
    // A listbox only permits option and group children, so a list nested in one
    // is a group. Standalone it is a list, spelled out rather than left to the
    // native role, since the reset that strips the bullets also costs a 'ul' its
    // list semantics in Safari, and with them the announced item count.
    el.setAttribute('role', findOptionContainer(Alpine, el) ? 'group' : 'list');
  });

  Alpine.directive('h-list-secondary', (el) => {
    // Muted text has to give way on a highlighted row, whether the row is a
    // selected option ('aria-selected') or the current one in an interactive
    // list ('aria-current'). A bound 'aria-current' renders the literal string
    // "false" when the row is not current, which neither selector matches.
    el.classList.add('text-muted-foreground', '[[aria-selected=true]_&]:text-primary-foreground/75', '[[aria-current=true]_&]:text-primary-foreground/75', '[[aria-current=page]_&]:text-primary-foreground/75');
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

  Alpine.directive('h-list-item', (el) => {
    // An item holding an 'h-list-item-button' is painted from that child's
    // hover, focus, active and current state, which an item cannot express as a
    // class on itself. Those rules live in src/styles/list.css.
    el.classList.add('min-h-11', 'flex', 'items-center', 'p-2', 'gap-2', 'align-middle', 'outline-none');
    el.setAttribute('data-slot', 'list-item');
    const container = findOptionContainer(Alpine, el);
    // An option is a control in its own right, so unlike a plain item it paints
    // itself. Every selector here is scoped to a listbox or a combobox.
    function setOptionClasses() {
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
      setOptionClasses();
      // A combobox keeps focus in its text field, so the option the user is on
      // is marked rather than focused and needs the same highlight :focus gives
      // it inside a listbox.
      el.classList.add('data-[active=true]:bg-table-hover', 'data-[active=true]:text-table-hover-foreground', 'data-[active=true]:aria-selected:bg-primary-hover', 'data-[active=true]:aria-selected:text-primary-foreground');
      el.setAttribute('role', 'option');
      // Options start out unreachable either way. A listbox hands the tab stop
      // to one of them once they have all mounted, while a combobox never does,
      // since it is reached through its text field.
      el.setAttribute('tabindex', '-1');
    }
  });

  // What makes a list interactive. It is a real button or link inside the item
  // rather than the item itself, because a 'li' playing a button leaves its 'ul'
  // with no list items at all, which is invalid and costs the list its
  // announcement. Keeping the item a list item also leaves room beside the
  // control for actions of its own.
  Alpine.directive('h-list-item-button', (el, { original }) => {
    if (el.tagName !== 'BUTTON' && el.tagName !== 'A') {
      throw new Error(`${original} must be a button or a link`);
    } else if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) {
      // A row inside a form can be its submit, so an author-set type wins.
      el.setAttribute('type', 'button');
    }
    // The item paints itself from this child, so the two have to be a pair. A
    // control further down would leave the row lit by something the author did
    // not mean to be the row.
    if (el.parentElement?.getAttribute('data-slot') !== 'list-item') {
      throw new Error(`${original} must be a direct child of a ${Alpine.prefixed('h-list-item')} element`);
    }
    // An option is already the control, and a listbox permits nothing focusable
    // inside one.
    if (el.parentElement.getAttribute('role') === 'option') {
      throw new Error(`${original} cannot be used inside a listbox or a combobox`);
    }
    el.classList.add(
      'flex',
      'flex-1',
      // The item keeps its height while the control takes the padding, so the
      // area that lights up and the area that can be clicked are the same one.
      'self-stretch',
      'min-w-0',
      'items-center',
      'p-2',
      'gap-2',
      'align-middle',
      'text-left',
      'cursor-pointer',
      'outline-none',
      'svg-defaults',
      // Dimming belongs to the control rather than the row, so an action button
      // beside a disabled row control does not look disabled with it. Blocking
      // pointer events also keeps the row from lighting up.
      'disabled:pointer-events-none',
      'disabled:opacity-disabled',
      'disabled:cursor-not-allowed',
      'aria-disabled:pointer-events-none',
      'aria-disabled:opacity-disabled',
      'aria-disabled:cursor-not-allowed'
    );
    el.setAttribute('data-slot', 'list-item-button');
  });
}
