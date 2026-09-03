import { describe, expect, it } from 'vitest';
import listPlugin from '../../src/components/list.js';
import { mountDirective } from '../test-utils.js';

describe('h-list', () => {
  it('applies base classes', () => {
    const el = document.createElement('ul');
    mountDirective(listPlugin, 'h-list', el);
    expect(el.classList.contains('divide-solid')).toBe(true);
    expect(el.classList.contains('divide-y')).toBe(true);
  });

  it('spells out role=list when standalone', () => {
    // The reset that strips the bullets also costs a ul its list semantics in
    // Safari, and with them the announced item count.
    const el = document.createElement('ul');
    mountDirective(listPlugin, 'h-list', el);
    expect(el.getAttribute('role')).toBe('list');
    expect(el.getAttribute('data-slot')).toBe('list');
  });

  it('sets role=group when inside a listbox', () => {
    // A listbox permits only option and group children, so a nested list is a
    // group of options rather than a list in its own right.
    const listbox = document.createElement('div');
    listbox.setAttribute('data-slot', 'listbox');
    const el = document.createElement('ul');
    listbox.appendChild(el);
    mountDirective(listPlugin, 'h-list', el);
    expect(el.getAttribute('role')).toBe('group');
  });

  it('sets role=group when inside a combobox', () => {
    // A combobox popup is a listbox too, so a list inside it is a group.
    const combobox = document.createElement('div');
    combobox.setAttribute('data-slot', 'combobox');
    const el = document.createElement('ul');
    combobox.appendChild(el);
    mountDirective(listPlugin, 'h-list', el);
    expect(el.getAttribute('role')).toBe('group');
  });

  it('stays a group when a wrapper separates it from the combobox', () => {
    // The popup can hold more than the list (a hint, an empty state, a scroll
    // container), so the lookup must not require the list to be a direct child.
    const combobox = document.createElement('div');
    combobox.setAttribute('data-slot', 'combobox');
    const wrapper = document.createElement('div');
    const el = document.createElement('ul');
    wrapper.appendChild(el);
    combobox.appendChild(wrapper);
    mountDirective(listPlugin, 'h-list', el);
    expect(el.getAttribute('role')).toBe('group');
  });

  it('is a plain list when nested inside an option, not another group', () => {
    // A list inside an option is that option's own content. Called a group, its
    // rows would join the option set the listbox navigates.
    const listbox = document.createElement('div');
    listbox.setAttribute('data-slot', 'listbox');
    const outerList = document.createElement('ul');
    const option = document.createElement('li');
    listbox.appendChild(outerList);
    outerList.appendChild(option);
    mountDirective(listPlugin, 'h-list-item', option);

    const el = document.createElement('ul');
    option.appendChild(el);
    mountDirective(listPlugin, 'h-list', el);
    expect(el.getAttribute('role')).toBe('list');
  });
});

describe('h-list-secondary', () => {
  it('applies base classes', () => {
    const el = document.createElement('span');
    mountDirective(listPlugin, 'h-list-secondary', el);
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    // A selected option and the current row of an interactive list both paint
    // the row, so muted text has to give way inside either.
    expect(el.classList.contains('[[aria-selected=true]_&]:text-primary-foreground/75')).toBe(true);
    expect(el.classList.contains('[[aria-current=true]_&]:text-primary-foreground/75')).toBe(true);
    expect(el.classList.contains('[[aria-current=page]_&]:text-primary-foreground/75')).toBe(true);
  });

  it('sets data-slot attribute', () => {
    const el = document.createElement('span');
    mountDirective(listPlugin, 'h-list-secondary', el);
    expect(el.getAttribute('data-slot')).toBe('list-secondary');
  });

  it('recolors inside a selected item but not inside an unselected one', () => {
    // The muted class outranks the item's own selected foreground, which is what
    // made a hand written muted class illegible on a selected row. Asserting the
    // override class is present is not enough, so match the selector it compiles
    // to against a real selected item and a real unselected one.
    const list = document.createElement('ul');
    document.body.appendChild(list);
    const secondaries = [true, false].map((selected) => {
      const item = document.createElement('li');
      item.setAttribute('aria-selected', String(selected));
      list.appendChild(item);
      mountDirective(listPlugin, 'h-list-item', item);
      const secondary = document.createElement('span');
      item.appendChild(secondary);
      mountDirective(listPlugin, 'h-list-secondary', secondary);
      return secondary;
    });
    expect([...list.querySelectorAll('[aria-selected=true] span')]).toEqual([secondaries[0]]);
    list.remove();
  });

  it('recolors inside the current row but not inside one bound to a false expression', () => {
    // A bound aria-current renders the literal string "false" when the row is
    // not current, which the variant must not treat as current.
    const list = document.createElement('ul');
    document.body.appendChild(list);
    const secondaries = ['true', 'false'].map((current) => {
      const item = document.createElement('li');
      list.appendChild(item);
      mountDirective(listPlugin, 'h-list-item', item);
      const control = document.createElement('button');
      control.setAttribute('aria-current', current);
      item.appendChild(control);
      mountDirective(listPlugin, 'h-list-item-button', control, { original: 'x-h-list-item-button' });
      const secondary = document.createElement('span');
      control.appendChild(secondary);
      mountDirective(listPlugin, 'h-list-secondary', secondary);
      return secondary;
    });
    expect([...list.querySelectorAll('[aria-current=true] span')]).toEqual([secondaries[0]]);
    list.remove();
  });
});

describe('h-list-header', () => {
  it('applies base classes', () => {
    const container = document.createElement('div');
    const list = document.createElement('ul');
    list.setAttribute('data-slot', 'list');
    const header = document.createElement('li');
    list.appendChild(header);
    container.appendChild(list);

    mountDirective(listPlugin, 'h-list-header', header, {
      original: 'x-h-list-header',
    });
    expect(header.classList.contains('font-medium')).toBe(true);
    expect(header.classList.contains('flex')).toBe(true);
  });

  it('sets role and data-slot attributes', () => {
    const container = document.createElement('div');
    const list = document.createElement('ul');
    list.setAttribute('data-slot', 'list');
    const header = document.createElement('li');
    list.appendChild(header);
    container.appendChild(list);

    mountDirective(listPlugin, 'h-list-header', header, {
      original: 'x-h-list-header',
    });
    expect(header.getAttribute('role')).toBe('presentation');
    expect(header.getAttribute('data-slot')).toBe('list-header');
  });

  it('throws if not inside a list', () => {
    const header = document.createElement('li');
    expect(() =>
      mountDirective(listPlugin, 'h-list-header', header, {
        original: 'x-h-list-header',
      })
    ).toThrow();
  });

  it('assigns id to header and aria-labelledby to parent list', () => {
    const container = document.createElement('div');
    const list = document.createElement('ul');
    list.setAttribute('data-slot', 'list');
    const header = document.createElement('li');
    list.appendChild(header);
    container.appendChild(list);

    mountDirective(listPlugin, 'h-list-header', header, {
      original: 'x-h-list-header',
    });
    expect(header.getAttribute('id')).toBeTruthy();
    expect(list.getAttribute('aria-labelledby')).toBe(header.getAttribute('id'));
  });
});

describe('h-list-item', () => {
  it('applies base classes', () => {
    const el = document.createElement('li');
    mountDirective(listPlugin, 'h-list-item', el);
    expect(el.classList.contains('min-h-11')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
  });

  it('sets data-slot attribute', () => {
    const el = document.createElement('li');
    mountDirective(listPlugin, 'h-list-item', el);
    expect(el.getAttribute('data-slot')).toBe('list-item');
  });

  it('rounds only the outer corners of the whole listbox, not of each group', () => {
    // The rounding variants are scoped to the last group as well as the last
    // row, so a two-group listbox does not curve mid-list. Asserting the class
    // is present is not enough, since the per-group bug had it too. Match the
    // selector the variant compiles to against a real two-group listbox.
    const listbox = document.createElement('div');
    listbox.setAttribute('data-slot', 'listbox');
    document.body.appendChild(listbox);
    const groups = [0, 1].map(() => {
      const list = document.createElement('ul');
      listbox.appendChild(list);
      return [0, 1].map(() => {
        const item = document.createElement('li');
        list.appendChild(item);
        mountDirective(listPlugin, 'h-list-item', item);
        return item;
      });
    });
    const bottomRounded = [...listbox.querySelectorAll('[data-slot=listbox] > *:last-of-type li:last-of-type')];
    const topRounded = [...listbox.querySelectorAll('[data-slot=listbox] > *:first-of-type li:first-of-type')];
    expect(bottomRounded).toEqual([groups[1][1]]);
    expect(topRounded).toEqual([groups[0][0]]);
    listbox.remove();
  });

  it('never becomes a control itself, so its ul keeps its list items', () => {
    // A li playing a button leaves its ul with no list items at all, which is
    // invalid and costs the list its announcement. tabindex="-1" would not make
    // the item Tab-reachable either, only focusable in a focusable sweep.
    const el = document.createElement('li');
    mountDirective(listPlugin, 'h-list-item', el, { modifiers: ['interactive'] });
    expect(el.hasAttribute('tabindex')).toBe(false);
    expect(el.hasAttribute('role')).toBe(false);
  });

  it('sets role=option and tabindex -1 when inside listbox', () => {
    // The listbox is a single tab stop and hands the stop to one option once
    // they have all mounted, so an option never starts out tabbable.
    const container = document.createElement('div');
    const listbox = document.createElement('div');
    listbox.setAttribute('data-slot', 'listbox');
    const list = document.createElement('ul');
    const item = document.createElement('li');
    list.appendChild(item);
    listbox.appendChild(list);
    container.appendChild(listbox);

    mountDirective(listPlugin, 'h-list-item', item, { modifiers: [] });
    expect(item.getAttribute('role')).toBe('option');
    expect(item.getAttribute('tabindex')).toBe('-1');
  });

  it('sets role=option and tabindex -1 when inside a combobox', () => {
    // A combobox holds the same options, reached from its text field rather
    // than by Tab, so they stay out of the tab order for good.
    const combobox = document.createElement('div');
    combobox.setAttribute('data-slot', 'combobox');
    const list = document.createElement('ul');
    const item = document.createElement('li');
    list.appendChild(item);
    combobox.appendChild(list);

    mountDirective(listPlugin, 'h-list-item', item, { modifiers: [] });
    expect(item.getAttribute('role')).toBe('option');
    expect(item.getAttribute('tabindex')).toBe('-1');
    expect(item.classList.contains('hover:bg-table-hover')).toBe(true);
    // The highlight the combobox moves with the arrow keys, standing in for the
    // :focus styling a listbox option gets.
    expect(item.classList.contains('data-[active=true]:bg-table-hover')).toBe(true);
  });

  it('is still an option when a wrapper separates its list from the combobox', () => {
    // The popup can hold a hint, an empty state or a scroll container beside the
    // list, so the lookup must not require the list to be a direct child.
    const combobox = document.createElement('div');
    combobox.setAttribute('data-slot', 'combobox');
    const wrapper = document.createElement('div');
    const list = document.createElement('ul');
    const item = document.createElement('li');
    list.appendChild(item);
    wrapper.appendChild(list);
    combobox.appendChild(wrapper);

    mountDirective(listPlugin, 'h-list-item', item);
    expect(item.getAttribute('role')).toBe('option');
  });

  it('stays a plain row when its list is nested inside an option', () => {
    // The lookup used to walk the whole ancestor chain, so these rows claimed
    // role=option and joined the set the listbox and the combobox navigate with
    // querySelectorAll('[role=option]'), handing the arrow keys and the tab stop
    // to rows that are not options.
    const listbox = document.createElement('div');
    listbox.setAttribute('data-slot', 'listbox');
    const outerList = document.createElement('ul');
    const option = document.createElement('li');
    listbox.appendChild(outerList);
    outerList.appendChild(option);
    mountDirective(listPlugin, 'h-list-item', option);
    expect(option.getAttribute('role')).toBe('option');

    const innerList = document.createElement('ul');
    const row = document.createElement('li');
    innerList.appendChild(row);
    option.appendChild(innerList);
    mountDirective(listPlugin, 'h-list', innerList);
    mountDirective(listPlugin, 'h-list-item', row);

    expect(row.hasAttribute('role')).toBe(false);
    expect(row.hasAttribute('tabindex')).toBe(false);
    expect(listbox.querySelectorAll('[role=option]')).toHaveLength(1);
  });
});

describe('h-list-item-button', () => {
  // Mounts an item and returns a control of the given tag already inside it,
  // which is the only place the directive accepts one.
  const mountItem = (tag, { role } = {}) => {
    const item = document.createElement('li');
    if (role) item.setAttribute('role', role);
    mountDirective(listPlugin, 'h-list-item', item, { modifiers: [] });
    const control = document.createElement(tag);
    item.appendChild(control);
    return { item, control };
  };

  it.each(['button', 'a'])('accepts a %s, which activates without any help', (tag) => {
    // Tab, Enter and Space all come from the platform, so the directive adds no
    // listener and has nothing to clean up.
    const { control } = mountItem(tag);
    const { ctx } = mountDirective(listPlugin, 'h-list-item-button', control, { original: 'x-h-list-item-button' });
    expect(control.getAttribute('data-slot')).toBe('list-item-button');
    expect(ctx.cleanup).not.toHaveBeenCalled();
  });

  it('throws on anything that is not a button or a link', () => {
    const { control } = mountItem('div');
    expect(() => mountDirective(listPlugin, 'h-list-item-button', control, { original: 'x-h-list-item-button' })).toThrow('must be a button or a link');
  });

  it('types a button so it does not submit a surrounding form', () => {
    const { control } = mountItem('button');
    mountDirective(listPlugin, 'h-list-item-button', control, { original: 'x-h-list-item-button' });
    expect(control.getAttribute('type')).toBe('button');
  });

  it('leaves an author-set type alone, since a row can be a form submit', () => {
    const { control } = mountItem('button');
    control.setAttribute('type', 'submit');
    mountDirective(listPlugin, 'h-list-item-button', control, { original: 'x-h-list-item-button' });
    expect(control.getAttribute('type')).toBe('submit');
  });

  it('throws when it is not a direct child of a list item', () => {
    // The item paints itself from this child, so a control further down would
    // light up a row the author did not mean.
    const { item } = mountItem('button');
    const wrapper = document.createElement('div');
    const control = document.createElement('button');
    wrapper.appendChild(control);
    item.appendChild(wrapper);
    expect(() => mountDirective(listPlugin, 'h-list-item-button', control, { original: 'x-h-list-item-button' })).toThrow('must be a direct child of a x-h-list-item element');
  });

  it('throws when the item is an option, which is already the control', () => {
    const { control } = mountItem('button', { role: 'option' });
    expect(() => mountDirective(listPlugin, 'h-list-item-button', control, { original: 'x-h-list-item-button' })).toThrow('cannot be used inside a listbox or a combobox');
  });

  it('stretches to fill the row, so the highlight and the target agree', () => {
    const { control } = mountItem('button');
    mountDirective(listPlugin, 'h-list-item-button', control, { original: 'x-h-list-item-button' });
    expect(control.classList.contains('flex-1')).toBe(true);
    expect(control.classList.contains('self-stretch')).toBe(true);
    expect(control.classList.contains('p-2')).toBe(true);
  });

  it('dims itself rather than the row when disabled', () => {
    // An action button beside a disabled row control stays usable, so it must
    // not be dimmed along with it.
    const { control } = mountItem('button');
    mountDirective(listPlugin, 'h-list-item-button', control, { original: 'x-h-list-item-button' });
    for (const cls of ['disabled:opacity-disabled', 'disabled:pointer-events-none', 'disabled:cursor-not-allowed', 'aria-disabled:opacity-disabled', 'aria-disabled:pointer-events-none', 'aria-disabled:cursor-not-allowed']) {
      expect(control.classList.contains(cls)).toBe(true);
    }
  });
});
