import { findAncestorState } from '../common/ancestor';
import { invalidInputClasses, userInvalidInputClasses } from '../common/shared-classes';
import { Check, createSvg } from './../common/icons';

export default function (Alpine) {
  Alpine.directive('h-checkbox', (el, { modifiers, original }, { effect }) => {
    // Additional component styles in 'src/styles/checkbox.css' and in 'src/styles/common.css'
    el.classList.add(
      '[&>input]:focus-visible:ring-[calc(var(--spacing)*0.75)]',
      'aspect-square',
      'bg-input-inner',
      'border',
      'border-input',
      'duration-200',
      'text-primary-foreground',
      ...invalidInputClasses,
      ...userInvalidInputClasses,
      'has-[input:checked]:bg-primary',
      'has-[input:checked]:border-primary',
      "has-[input:indeterminate]:after:content-['']",
      'has-[input:disabled]:cursor-not-allowed',
      'has-[input:disabled]:opacity-disabled',
      'relative',
      'shadow-input',
      'shrink-0',
      'transition-colors',
      'motion-reduce:transition-none'
    );
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'checkbox');

    const check = createSvg({ icon: Check, classes: 'size-full [input:checked~&]:visible invisible text-inherit', attrs: { 'aria-hidden': true, role: 'presentation' } });
    el.appendChild(check);

    if (modifiers.includes('tree')) {
      const treeItem = findAncestorState(Alpine, el, '_h_tree_item');
      if (!treeItem) throw new Error(`${original}.tree must be inside a ${Alpine.prefixed('h-tree-item')} element`);
      // A tree row is denser than a form, so the box is a size smaller there.
      // The radius keeps the same corner-to-size ratio as the default.
      el.classList.add('size-4', 'rounded-[0.35rem]', '[&>input]:rounded-[0.35rem]');
      const input = el.querySelector('input[type=checkbox]');
      // The tree item owns the disabled state, so one aria-disabled on the item
      // disables its row and its checkbox together.
      effect(() => {
        if (input) input.disabled = treeItem._h_tree_item.disabled;
      });
    } else {
      el.classList.add('size-5', 'rounded-[0.438rem]', '[&>input]:rounded-[0.438rem]');
    }
  });
}
