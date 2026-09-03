import { afterEach, describe, expect, it } from 'vitest';
import comboboxPlugin from '../../src/components/combobox.js';
import listPlugin from '../../src/components/list.js';
import { mountDirective } from '../test-utils.js';

describe('h-combobox', () => {
  const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
  const activeOf = (options) => options.findIndex((option) => option.getAttribute('data-active') === 'true');

  // Mirrors the real markup: a text field elsewhere in the document, handed to
  // the popup through the directive's expression.
  async function createCombobox({ count = 3, hint = false, disabled = [], variant } = {}) {
    const control = document.createElement('input');
    document.body.appendChild(control);
    const combobox = document.createElement('div');
    document.body.appendChild(combobox);
    if (variant) combobox.setAttribute('data-variant', variant);
    const { ctx } = mountDirective(comboboxPlugin, 'h-combobox', combobox, { expression: '$refs.query', original: 'x-h-combobox' }, { evaluate: () => control });
    const list = document.createElement('ul');
    combobox.appendChild(list);
    mountDirective(listPlugin, 'h-list', list);
    if (hint) {
      // An empty-state row is not an option and must not be treated as one.
      list.appendChild(document.createElement('li'));
    }
    const options = [];
    for (let i = 0; i < count; i++) {
      const item = document.createElement('li');
      item.textContent = `Item ${i + 1}`;
      if (disabled.includes(i)) item.setAttribute('aria-disabled', 'true');
      list.appendChild(item);
      mountDirective(listPlugin, 'h-list-item', item, { modifiers: [] });
      options.push(item);
    }
    await flush();
    const press = (key) => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      control.dispatchEvent(event);
      return event;
    };
    return { control, combobox, list, options, press, ctx };
  }

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('setup', () => {
    it('applies the same shell as a listbox', async () => {
      const { combobox } = await createCombobox();
      expect(combobox.classList.contains('bg-background')).toBe(true);
      expect(combobox.classList.contains('rounded-control')).toBe(true);
    });

    it('is a listbox in ARIA and a combobox slot for styling', async () => {
      const { combobox } = await createCombobox();
      expect(combobox.getAttribute('role')).toBe('listbox');
      expect(combobox.getAttribute('data-slot')).toBe('combobox');
    });

    it('wires the combobox roles onto the control', async () => {
      const { control, combobox } = await createCombobox();
      expect(control.getAttribute('role')).toBe('combobox');
      expect(control.getAttribute('aria-controls')).toBe(combobox.getAttribute('id'));
      expect(combobox.getAttribute('id')).toBeTruthy();
      expect(control.getAttribute('aria-autocomplete')).toBe('list');
    });

    it('leaves roles the author already set alone', async () => {
      const control = document.createElement('input');
      control.setAttribute('role', 'searchbox');
      control.setAttribute('aria-autocomplete', 'both');
      document.body.appendChild(control);
      const combobox = document.createElement('div');
      document.body.appendChild(combobox);
      mountDirective(comboboxPlugin, 'h-combobox', combobox, { expression: '$refs.query', original: 'x-h-combobox' }, { evaluate: () => control });
      await flush();
      expect(control.getAttribute('role')).toBe('searchbox');
      expect(control.getAttribute('aria-autocomplete')).toBe('both');
    });

    it('does not set aria-expanded, which the author owns', async () => {
      const { control } = await createCombobox();
      expect(control.hasAttribute('aria-expanded')).toBe(false);
    });

    it('throws when no control is given', () => {
      const combobox = document.createElement('div');
      expect(() => mountDirective(comboboxPlugin, 'h-combobox', combobox, { expression: '', original: 'x-h-combobox' })).toThrow(/text field/);
    });

    it('keeps every option out of the tab order', async () => {
      // A combobox popup is reached with the arrow keys, never with Tab.
      const { options } = await createCombobox();
      expect(options.map((option) => option.getAttribute('tabindex'))).toEqual(['-1', '-1', '-1']);
    });
  });

  describe('variants', () => {
    it('swaps the shell for a popover surface', async () => {
      const { combobox } = await createCombobox({ variant: 'popover' });
      expect(combobox.classList.contains('bg-popover')).toBe(true);
      expect(combobox.classList.contains('rounded-md')).toBe(true);
      expect(combobox.classList.contains('shadow-md')).toBe(true);
      expect(combobox.classList.contains('border')).toBe(true);
      expect(combobox.classList.contains('bg-background')).toBe(false);
      expect(combobox.classList.contains('rounded-control')).toBe(false);
      expect(combobox.classList.contains('shadow-input')).toBe(false);
    });

    it('strips the shell for the inline variant', async () => {
      const { combobox } = await createCombobox({ variant: 'inline' });
      expect(combobox.classList.contains('bg-background')).toBe(false);
      expect(combobox.classList.contains('border')).toBe(false);
      expect(combobox.classList.contains('rounded-control')).toBe(false);
      expect(combobox.classList.contains('shadow-input')).toBe(false);
      expect(combobox.classList.contains('divide-y')).toBe(true);
    });

    it('follows data-variant changing after mount', async () => {
      const { combobox } = await createCombobox();
      combobox.setAttribute('data-variant', 'popover');
      await flush();
      expect(combobox.classList.contains('rounded-md')).toBe(true);
      expect(combobox.classList.contains('rounded-control')).toBe(false);
      combobox.removeAttribute('data-variant');
      await flush();
      expect(combobox.classList.contains('rounded-control')).toBe(true);
      expect(combobox.classList.contains('rounded-md')).toBe(false);
    });

    it('stops watching data-variant on cleanup', async () => {
      const { combobox, ctx } = await createCombobox();
      ctx.cleanup.mock.calls.at(-1)[0]();
      combobox.setAttribute('data-variant', 'inline');
      await flush();
      expect(combobox.classList.contains('rounded-control')).toBe(true);
    });
  });

  describe('the highlight', () => {
    it('starts with nothing highlighted', async () => {
      const { control, options } = await createCombobox();
      expect(activeOf(options)).toBe(-1);
      expect(control.hasAttribute('aria-activedescendant')).toBe(false);
    });

    it('enters from the top on the first ArrowDown, without taking focus', async () => {
      const { control, options, press } = await createCombobox();
      control.focus();
      press('ArrowDown');
      expect(activeOf(options)).toBe(0);
      expect(control.getAttribute('aria-activedescendant')).toBe(options[0].getAttribute('id'));
      expect(document.activeElement).toBe(control);
    });

    it('enters from the bottom on the first ArrowUp', async () => {
      const { options, press } = await createCombobox();
      press('ArrowUp');
      expect(activeOf(options)).toBe(2);
    });

    it('wraps at both ends', async () => {
      const { options, press } = await createCombobox();
      press('ArrowDown');
      press('ArrowDown');
      press('ArrowDown');
      expect(activeOf(options)).toBe(2);
      press('ArrowDown');
      expect(activeOf(options)).toBe(0);
      press('ArrowUp');
      expect(activeOf(options)).toBe(2);
    });

    it('moves the mark rather than leaving two options highlighted', async () => {
      const { options, press } = await createCombobox();
      press('ArrowDown');
      press('ArrowDown');
      expect(options[0].hasAttribute('data-active')).toBe(false);
      expect(options[1].getAttribute('data-active')).toBe('true');
    });

    it('skips a row that is not an option', async () => {
      const { options, press } = await createCombobox({ hint: true });
      press('ArrowDown');
      expect(activeOf(options)).toBe(0);
    });

    it('lands on a disabled option, which is still announced', async () => {
      const { options, press } = await createCombobox({ disabled: [0] });
      press('ArrowDown');
      expect(activeOf(options)).toBe(0);
    });

    it('clears the mark when its option is removed by a re-render', async () => {
      // Retyping swaps the whole result set, and a mark left behind would point
      // Enter and aria-activedescendant at a row that is gone.
      const { control, list, options } = await createCombobox();
      control.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      expect(control.getAttribute('aria-activedescendant')).toBe(options[0].getAttribute('id'));
      list.removeChild(options[0]);
      await flush();
      expect(control.hasAttribute('aria-activedescendant')).toBe(false);
    });

    it('does not promote a new option when the results change', async () => {
      // The mark is the user's to set, so a re-render leaves the list unmarked
      // rather than guessing at one.
      const { list, options } = await createCombobox();
      list.removeChild(options[0]);
      await flush();
      expect(activeOf(options.slice(1))).toBe(-1);
    });

    it('never writes aria-selected, which the author binds instead', async () => {
      const { options, press } = await createCombobox();
      press('ArrowDown');
      press('Enter');
      expect(options.some((option) => option.hasAttribute('aria-selected'))).toBe(false);
    });
  });

  describe('losing focus', () => {
    // focusout rather than blur, because it is what bubbles and what carries the
    // element focus is heading to.
    const leave = (from, to = null) => from.dispatchEvent(new window.FocusEvent('focusout', { relatedTarget: to, bubbles: true }));

    it('drops the mark when focus leaves for something else', async () => {
      const { control, options, press } = await createCombobox();
      const elsewhere = document.createElement('button');
      document.body.appendChild(elsewhere);
      press('ArrowDown');
      expect(activeOf(options)).toBe(0);
      leave(control, elsewhere);
      expect(activeOf(options)).toBe(-1);
      expect(control.hasAttribute('aria-activedescendant')).toBe(false);
    });

    it('drops the mark when focus goes nowhere at all', async () => {
      // Clicking plain page content blurs the field with no relatedTarget, which
      // is also what hiding or removing the widget looks like.
      const { control, options, press } = await createCombobox();
      press('ArrowDown');
      leave(control);
      expect(activeOf(options)).toBe(-1);
      expect(control.hasAttribute('aria-activedescendant')).toBe(false);
    });

    it('keeps the mark when focus moves into the popup', async () => {
      // Options are focusable, so clicking one really does take focus off the
      // field. That is a move within the widget, not a departure.
      const { control, options, press } = await createCombobox();
      press('ArrowDown');
      leave(control, options[1]);
      expect(activeOf(options)).toBe(0);
      expect(control.getAttribute('aria-activedescendant')).toBe(options[0].getAttribute('id'));
    });

    it('drops the mark when focus leaves from an option rather than the field', async () => {
      const { combobox, control, options, press } = await createCombobox();
      const elsewhere = document.createElement('button');
      document.body.appendChild(elsewhere);
      press('ArrowDown');
      leave(options[0], elsewhere);
      expect(combobox.contains(options[0])).toBe(true);
      expect(activeOf(options)).toBe(-1);
      expect(control.hasAttribute('aria-activedescendant')).toBe(false);
    });

    it('keeps the mark when focus returns to the field from the popup', async () => {
      const { control, options, press } = await createCombobox();
      press('ArrowDown');
      leave(options[0], control);
      expect(activeOf(options)).toBe(0);
    });

    it('stops watching focus on cleanup', async () => {
      const { control, options, press, ctx } = await createCombobox();
      press('ArrowDown');
      ctx.cleanup.mock.calls.at(-1)[0]();
      // Cleanup clears the mark itself, so put one back by hand. A handler still
      // attached would take it away again on the focusout below.
      options[0].setAttribute('data-active', 'true');
      leave(control);
      expect(activeOf(options)).toBe(0);
    });
  });

  it('takes aria-activedescendant off the field on cleanup', async () => {
    // The field outlives the popup, so a reference left on it would name an id
    // that has gone. The mutation observer cannot see this, since it watches the
    // popup's children rather than the popup itself being removed.
    const { control, press, ctx } = await createCombobox();
    press('ArrowDown');
    expect(control.hasAttribute('aria-activedescendant')).toBe(true);
    ctx.cleanup.mock.calls.at(-1)[0]();
    expect(control.hasAttribute('aria-activedescendant')).toBe(false);
  });

  describe('the keys it claims', () => {
    it('takes the arrows and leaves the editing keys to the field', async () => {
      const { press } = await createCombobox();
      expect(press('ArrowDown').defaultPrevented).toBe(true);
      expect(press('ArrowUp').defaultPrevented).toBe(true);
      // Home, End and typing belong to the text the user is entering.
      expect(press('Home').defaultPrevented).toBe(false);
      expect(press('End').defaultPrevented).toBe(false);
      expect(press('a').defaultPrevented).toBe(false);
      expect(press(' ').defaultPrevented).toBe(false);
      expect(press('Escape').defaultPrevented).toBe(false);
    });

    it('leaves the arrows alone when there is nothing to move through', async () => {
      const { press } = await createCombobox({ count: 0, hint: true });
      expect(press('ArrowDown').defaultPrevented).toBe(false);
    });

    it('activates the highlighted option on Enter', async () => {
      const { options, press } = await createCombobox();
      const clicked = [];
      options.forEach((option, index) => option.addEventListener('click', () => clicked.push(index)));
      press('ArrowDown');
      press('ArrowDown');
      expect(press('Enter').defaultPrevented).toBe(true);
      expect(clicked).toEqual([1]);
    });

    it('leaves Enter completely alone when nothing is highlighted', async () => {
      // This is what lets an author bind their own Enter handler for the
      // un-navigated case, for example opening the top result.
      const { press } = await createCombobox();
      const event = press('Enter');
      expect(event.defaultPrevented).toBe(false);
      expect(event.cancelBubble).toBe(false);
    });

    it('leaves Enter alone on a disabled option', async () => {
      const { options, press } = await createCombobox({ disabled: [0] });
      const clicked = [];
      options[0].addEventListener('click', () => clicked.push(0));
      press('ArrowDown');
      expect(press('Enter').defaultPrevented).toBe(false);
      expect(clicked).toEqual([]);
    });

    it('stops the keys it handles from reaching handlers on the field', async () => {
      const { control, press } = await createCombobox();
      const seen = [];
      control.addEventListener('keydown', (event) => seen.push(event.key));
      press('ArrowDown');
      press('Enter');
      press('Escape');
      expect(seen).toEqual(['Escape']);
    });
  });

  it('stops listening to the control on cleanup', async () => {
    const { options, press, ctx } = await createCombobox();
    ctx.cleanup.mock.calls.at(-1)[0]();
    press('ArrowDown');
    expect(activeOf(options)).toBe(-1);
  });
});
