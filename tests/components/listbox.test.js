import { afterEach, describe, expect, it } from 'vitest';
import listPlugin from '../../src/components/list.js';
import listboxPlugin from '../../src/components/listbox.js';
import { mountDirective } from '../test-utils.js';

describe('h-listbox', () => {
  it('applies base classes', () => {
    const el = document.createElement('div');
    mountDirective(listboxPlugin, 'h-listbox', el);
    expect(el.classList.contains('bg-background')).toBe(true);
    expect(el.classList.contains('rounded-control')).toBe(true);
    expect(el.classList.contains('outline-none')).toBe(true);
  });

  it('sets role and data-slot attributes', () => {
    const el = document.createElement('div');
    mountDirective(listboxPlugin, 'h-listbox', el);
    expect(el.getAttribute('role')).toBe('listbox');
    expect(el.getAttribute('data-slot')).toBe('listbox');
  });

  it('calls cleanup on teardown', () => {
    const el = document.createElement('div');
    const { ctx } = mountDirective(listboxPlugin, 'h-listbox', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-listbox keyboard navigation', () => {
  const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

  function keydown(el, key) {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    el.dispatchEvent(event);
    return event;
  }

  // The initial tab stop is claimed in a microtask once every option has
  // mounted, so the helper is async and callers await it.
  async function createListbox({ groups = [3], disabled = [], selected, headers = false, separator = false, labels } = {}) {
    const listbox = document.createElement('div');
    document.body.appendChild(listbox);
    // Real Alpine walks the tree ancestor-first, and both h-list and
    // h-list-item read the listbox's data-slot, so the listbox mounts first.
    mountDirective(listboxPlugin, 'h-listbox', listbox);
    const options = [];
    let n = 0;

    groups.forEach((count, groupIndex) => {
      if (separator && groupIndex > 0) {
        // A plain element between groups is what breaks sibling-walking.
        listbox.appendChild(document.createElement('div'));
      }
      const list = document.createElement('ul');
      listbox.appendChild(list);
      // h-list-header looks for an ancestor already marked as a list, so the
      // list has to be mounted before its header.
      mountDirective(listPlugin, 'h-list', list);
      if (headers) {
        const header = document.createElement('li');
        header.textContent = `Group ${groupIndex + 1}`;
        list.appendChild(header);
        mountDirective(listPlugin, 'h-list-header', header, { original: 'x-h-list-header' });
      }
      for (let i = 0; i < count; i++, n++) {
        const item = document.createElement('li');
        item.textContent = labels ? labels[n] : `Item ${n + 1}`;
        if (disabled.includes(n)) item.setAttribute('aria-disabled', 'true');
        if (selected === n) item.setAttribute('aria-selected', 'true');
        list.appendChild(item);
        options.push(item);
      }
    });

    // The listbox claims the initial tab stop in a microtask, so it still sees
    // every option even though it mounted before them.
    options.forEach((item) => mountDirective(listPlugin, 'h-list-item', item, { modifiers: [] }));
    await flush();
    return { listbox, options };
  }

  const tabIndexes = (options) => options.map((option) => option.getAttribute('tabindex'));

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('the roving tab stop', () => {
    it('gives the stop to the first option, leaving the rest untabbable', async () => {
      const { options } = await createListbox({ groups: [3] });
      expect(tabIndexes(options)).toEqual(['0', '-1', '-1']);
    });

    it('gives the stop to the selected option when the author marked one', async () => {
      const { options } = await createListbox({ groups: [3], selected: 2 });
      expect(tabIndexes(options)).toEqual(['-1', '-1', '0']);
    });

    it('gives the stop to a disabled first option, which is still announced', async () => {
      const { options } = await createListbox({ groups: [3], disabled: [0] });
      expect(tabIndexes(options)).toEqual(['0', '-1', '-1']);
    });

    it('keeps the listbox in the tab order when every option is disabled', async () => {
      // Dropping it out of the tab order would hide the options entirely, which
      // is what aria-disabled exists to avoid.
      const { options } = await createListbox({ groups: [2], disabled: [0, 1] });
      expect(tabIndexes(options)).toEqual(['0', '-1']);
    });

    it('claims a stop for options that mount after the listbox settled', async () => {
      // A filtered list can render nothing at first, which used to leave the
      // listbox permanently out of the tab order.
      const { listbox } = await createListbox({ groups: [0] });
      const list = listbox.querySelector('ul');
      const late = document.createElement('li');
      list.appendChild(late);
      mountDirective(listPlugin, 'h-list-item', late, { modifiers: [] });
      await flush();
      expect(late.getAttribute('tabindex')).toBe('0');
    });

    it('re-establishes the stop when the options are replaced', async () => {
      // Filtering an x-for swaps the whole option set, taking the stop with it.
      const { listbox, options } = await createListbox({ groups: [3] });
      expect(tabIndexes(options)).toEqual(['0', '-1', '-1']);
      const list = listbox.querySelector('ul');
      list.replaceChildren();
      const replacements = [1, 2].map(() => {
        const item = document.createElement('li');
        list.appendChild(item);
        mountDirective(listPlugin, 'h-list-item', item, { modifiers: [] });
        return item;
      });
      await flush();
      expect(tabIndexes(replacements)).toEqual(['0', '-1']);
    });
  });

  describe('arrow keys', () => {
    it('moves the stop forward and clears the old one', async () => {
      const { listbox, options } = await createListbox({ groups: [3] });
      keydown(listbox, 'ArrowDown');
      expect(document.activeElement).toBe(options[1]);
      expect(tabIndexes(options)).toEqual(['-1', '0', '-1']);
    });

    it('moves the stop backward', async () => {
      const { listbox, options } = await createListbox({ groups: [3] });
      keydown(listbox, 'End');
      keydown(listbox, 'ArrowUp');
      expect(document.activeElement).toBe(options[1]);
      expect(tabIndexes(options)).toEqual(['-1', '0', '-1']);
    });

    it('clamps at the last option rather than wrapping', async () => {
      const { listbox, options } = await createListbox({ groups: [3] });
      keydown(listbox, 'End');
      keydown(listbox, 'ArrowDown');
      expect(document.activeElement).toBe(options[2]);
      expect(tabIndexes(options)).toEqual(['-1', '-1', '0']);
    });

    it('clamps at the first option rather than wrapping', async () => {
      const { listbox, options } = await createListbox({ groups: [3] });
      keydown(listbox, 'Home');
      keydown(listbox, 'ArrowUp');
      expect(document.activeElement).toBe(options[0]);
      expect(tabIndexes(options)).toEqual(['0', '-1', '-1']);
    });

    it('crosses a group boundary', async () => {
      const { listbox, options } = await createListbox({ groups: [2, 2] });
      keydown(listbox, 'ArrowDown');
      keydown(listbox, 'ArrowDown');
      expect(document.activeElement).toBe(options[2]);
    });

    it('crosses a group boundary with a non-list element between the groups', async () => {
      // Sibling-walking looked for the next UL and gave up on anything else.
      const { listbox, options } = await createListbox({ groups: [2, 2], separator: true });
      keydown(listbox, 'ArrowDown');
      keydown(listbox, 'ArrowDown');
      expect(document.activeElement).toBe(options[2]);
    });

    it('never lands on a group header', async () => {
      const { listbox, options } = await createListbox({ groups: [2, 2], headers: true });
      keydown(listbox, 'ArrowDown');
      keydown(listbox, 'ArrowDown');
      expect(document.activeElement).toBe(options[2]);
      expect(document.activeElement.getAttribute('data-slot')).toBe('list-item');
    });

    it('steps onto a disabled option', async () => {
      const { listbox, options } = await createListbox({ groups: [4], disabled: [1] });
      keydown(listbox, 'ArrowDown');
      expect(document.activeElement).toBe(options[1]);
    });
  });

  describe('Home, End, PageUp and PageDown', () => {
    it('land on the first and last option, disabled or not', async () => {
      const { listbox, options } = await createListbox({ groups: [5], disabled: [0, 4] });
      keydown(listbox, 'End');
      expect(document.activeElement).toBe(options[4]);
      keydown(listbox, 'Home');
      expect(document.activeElement).toBe(options[0]);
    });

    it('aliases PageUp and PageDown to Home and End', async () => {
      const { listbox, options } = await createListbox({ groups: [4] });
      keydown(listbox, 'PageDown');
      expect(document.activeElement).toBe(options[3]);
      keydown(listbox, 'PageUp');
      expect(document.activeElement).toBe(options[0]);
    });

    it('prevents the default, so the page does not scroll as well', async () => {
      // Home and End moved focus without preventing the default, so the page
      // jumped to the top or bottom at the same time.
      const { listbox } = await createListbox({ groups: [3] });
      for (const key of ['Home', 'End', 'PageUp', 'PageDown', 'ArrowUp', 'ArrowDown']) {
        expect(keydown(listbox, key).defaultPrevented, key).toBe(true);
      }
    });

    it('prevents the default even when there is nowhere to move', async () => {
      const { listbox, options } = await createListbox({ groups: [1] });
      for (const key of ['ArrowDown', 'ArrowUp', 'Home', 'End']) {
        expect(keydown(listbox, key).defaultPrevented, key).toBe(true);
      }
      expect(tabIndexes(options)).toEqual(['0']);
    });
  });

  describe('disabled options', () => {
    it('is reachable by the arrow keys but still cannot be selected', async () => {
      // The whole point of aria-disabled over the native attribute. Focus lands
      // on the option so it is announced, and Enter then does nothing.
      const { listbox, options } = await createListbox({ groups: [3], disabled: [1] });
      keydown(listbox, 'ArrowDown');
      expect(document.activeElement).toBe(options[1]);
      keydown(options[1], 'Enter');
      expect(options[1].hasAttribute('aria-selected')).toBe(false);
    });

    it('treats aria-disabled="false" as enabled, not as a bare attribute', async () => {
      // A bound attribute renders the literal string "false", so a presence
      // check would disable exactly the option the author meant to keep usable.
      const { options } = await createListbox({ groups: [3] });
      options[1].setAttribute('aria-disabled', 'false');
      options[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(options[1].getAttribute('aria-selected')).toBe('true');
    });

    it('ignores a valueless aria-disabled, since the value carries the meaning', async () => {
      const { options } = await createListbox({ groups: [3] });
      options[1].setAttribute('aria-disabled', '');
      options[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(options[1].getAttribute('aria-selected')).toBe('true');
    });

    it('does not select a disabled option by click', async () => {
      const { options } = await createListbox({ groups: [3], disabled: [1] });
      options[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(options[1].hasAttribute('aria-selected')).toBe(false);
    });

    it('does not select a disabled option by Enter', async () => {
      const { options } = await createListbox({ groups: [3], disabled: [1] });
      keydown(options[1], 'Enter');
      expect(options[1].hasAttribute('aria-selected')).toBe(false);
    });
  });

  describe('selection', () => {
    it('selects the focused option on Enter and moves selection on the next one', async () => {
      const { listbox, options } = await createListbox({ groups: [3] });
      keydown(listbox, 'ArrowDown');
      keydown(document.activeElement, 'Enter');
      expect(options[1].getAttribute('aria-selected')).toBe('true');
      keydown(listbox, 'ArrowDown');
      keydown(document.activeElement, ' ');
      expect(options[1].hasAttribute('aria-selected')).toBe(false);
      expect(options[2].getAttribute('aria-selected')).toBe('true');
    });

    it('selects on click', async () => {
      const { options } = await createListbox({ groups: [3] });
      options[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(options[2].getAttribute('aria-selected')).toBe('true');
    });

    it('ignores Enter that did not land on an option', async () => {
      const { listbox } = await createListbox({ groups: [3] });
      expect(keydown(listbox, 'Enter').defaultPrevented).toBe(false);
    });
  });

  describe('typeahead', () => {
    const labels = ['Apple', 'Banana', 'Blueberry', 'Cherry'];

    it('jumps to the next option starting with the typed character', async () => {
      const { listbox, options } = await createListbox({ groups: [4], labels });
      keydown(listbox, 'c');
      expect(document.activeElement).toBe(options[3]);
    });

    it('is case insensitive', async () => {
      const { listbox, options } = await createListbox({ groups: [4], labels });
      keydown(listbox, 'B');
      expect(document.activeElement).toBe(options[1]);
    });

    it('cycles through the matches when the same letter is repeated', async () => {
      const { listbox, options } = await createListbox({ groups: [4], labels });
      keydown(listbox, 'b');
      expect(document.activeElement).toBe(options[1]);
      keydown(listbox, 'b');
      expect(document.activeElement).toBe(options[2]);
      keydown(listbox, 'b');
      expect(document.activeElement).toBe(options[1]);
    });

    it('matches a disabled option', async () => {
      const { listbox, options } = await createListbox({ groups: [4], labels, disabled: [1] });
      keydown(listbox, 'b');
      expect(document.activeElement).toBe(options[1]);
    });

    it('leaves focus alone when nothing matches', async () => {
      const { listbox, options } = await createListbox({ groups: [4], labels });
      keydown(listbox, 'ArrowDown');
      keydown(listbox, 'z');
      expect(document.activeElement).toBe(options[1]);
    });
  });
});
