import { findAncestorState } from '../common/ancestor';
import uuidv4 from '../utils/uuid';
import { ChevronDown, createSvg } from './../common/icons';
export default function (Alpine) {
  Alpine.directive('h-accordion', (el, { expression, modifiers }, { Alpine }) => {
    el._h_accordion = modifiers.includes('single')
      ? Alpine.reactive({
          single: true,
          expandedId: expression ?? '',
        })
      : { single: false };
    el.setAttribute('data-slot', 'accordion');
  });

  Alpine.directive('h-accordion-item', (el, { original, expression, modifiers }, { Alpine }) => {
    const accordion = findAncestorState(Alpine, el, '_h_accordion');

    if (!accordion) {
      throw new Error(`${original} must be inside an accordion`);
    }

    el.classList.add('border-b', 'last:border-b-0');
    el.setAttribute('data-slot', 'accordion-item');

    const itemId = expression ?? `ha${uuidv4()}`;

    function getIsExpanded() {
      if (accordion._h_accordion.single) {
        if (accordion._h_accordion.expandedId !== '') {
          return accordion._h_accordion.expandedId === itemId;
        } else if (modifiers.includes('default')) {
          accordion._h_accordion.expandedId = itemId;
          return true;
        }
        return false;
      }
      return modifiers.includes('default');
    }

    el._h_accordionItem = Alpine.reactive({
      id: itemId,
      controls: `ha${uuidv4()}`,
      expanded: getIsExpanded(),
    });
  });

  Alpine.directive('h-accordion-trigger', (el, { original, expression }, { effect, evaluateLater, Alpine, cleanup }) => {
    if (el.tagName.length !== 2 && !el.tagName.startsWith('H')) {
      throw new Error(`${original} must be a header element`);
    }
    const accordion = findAncestorState(Alpine, el, '_h_accordion');

    const accordionItem = findAncestorState(Alpine, el, '_h_accordionItem');

    if (!accordionItem || !accordion) {
      throw new Error(`${original} must have an accordion and accordion item parent elements`);
    }

    el.classList.add('flex', 'text-sm', 'h-12', 'min-h-12', '[[data-size=md]_&]:h-10', '[[data-size=md]_&]:min-h-10', '[[data-size=sm]_&]:h-8', '[[data-size=sm]_&]:min-h-8');
    el.setAttribute('tabIndex', '-1');

    const getLabel = evaluateLater(expression);

    const chevronDown = createSvg({
      icon: ChevronDown,
      classes: 'text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform motion-reduce:transition-none duration-200',
      attrs: {
        'aria-hidden': true,
        role: 'presentation',
      },
    });

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('tabIndex', '0');
    button.setAttribute('data-slot', 'accordion-trigger');
    button.classList.add(
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'flex',
      'flex-1',
      'items-center',
      'justify-between',
      'gap-4',
      'text-left',
      'text-inherit',
      'font-medium',
      'transition-all',
      'motion-reduce:transition-none',
      'outline-none',
      'hover:underline',
      'focus-visible:ring-[calc(var(--spacing)*0.75)]',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      '[&[aria-expanded=true]>svg]:rotate-180'
    );
    el.appendChild(button);

    effect(() => {
      getLabel((label) => {
        button.innerText = label;
        button.appendChild(chevronDown);
      });
    });

    button.setAttribute('id', accordionItem._h_accordionItem.id);
    button.setAttribute('aria-controls', accordionItem._h_accordionItem.controls);

    const setAttributes = () => {
      button.setAttribute('aria-expanded', accordionItem._h_accordionItem.expanded);
    };

    const handler = () => {
      accordionItem._h_accordionItem.expanded = !accordionItem._h_accordionItem.expanded;
      setAttributes();
      if (accordion._h_accordion.single) {
        accordion._h_accordion.expandedId = accordionItem._h_accordionItem.id;
      }
    };
    setAttributes();

    el.addEventListener('click', handler);

    cleanup(() => {
      el.removeEventListener('click', handler);
    });

    if (accordion._h_accordion.single) {
      effect(() => {
        if (accordion._h_accordion.expandedId !== accordionItem._h_accordionItem.id) {
          accordionItem._h_accordionItem.expanded = false;
          setAttributes();
        }
      });
    }
  });

  Alpine.directive('h-accordion-content', (el, _, { effect, cleanup, Alpine }) => {
    el.classList.add('pb-0', 'overflow-hidden', 'text-sm', 'hidden', 'transition-[opacity,max-height,padding-bottom]', 'motion-reduce:transition-none', 'duration-200', 'ease-out', 'opacity-0');
    el.setAttribute('data-slot', 'accordion-content');
    const parent = findAncestorState(Alpine, el, '_h_accordionItem');
    if (parent) {
      el.setAttribute('id', parent._h_accordionItem.controls);
      el.setAttribute('aria-labelledby', parent._h_accordionItem.id);
      effect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          el.style.removeProperty('max-height');
          if (parent._h_accordionItem.expanded) {
            el.classList.add('pb-4', '[[data-size=md]_&]:pb-3', '[[data-size=sm]_&]:pb-2');
            el.classList.remove('hidden', 'pb-0', 'opacity-0');
          } else {
            el.classList.add('hidden', 'pb-0', 'opacity-0');
            el.classList.remove('pb-4', '[[data-size=md]_&]:pb-3', '[[data-size=sm]_&]:pb-2');
          }
        } else if (parent._h_accordionItem.expanded) {
          if (el.classList.contains('hidden')) {
            el.classList.add('pb-4', '[[data-size=md]_&]:pb-3', '[[data-size=sm]_&]:pb-2');
            el.classList.remove('hidden', 'pb-0');
            Alpine.nextTick(() => {
              el.style.maxHeight = `${el.scrollHeight}px`;
              el.classList.remove('opacity-0');
            });
          }
        } else {
          el.style.maxHeight = '0px';
          el.classList.add('opacity-0', 'pb-0');
          el.classList.remove('pb-4', '[[data-size=md]_&]:pb-3', '[[data-size=sm]_&]:pb-2');
        }
      });

      function onTransitionEnd(event) {
        if (event.target === el && event.target.classList.contains('opacity-0')) {
          el.classList.add('hidden');
        }
      }

      el.addEventListener('transitionend', onTransitionEnd);

      cleanup(() => {
        el.removeEventListener('transitionend', onTransitionEnd);
      });
    }
  });
}
