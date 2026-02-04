import { v4 as uuidv4 } from 'uuid';
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

  Alpine.directive('h-accordion-item', (el, { original, expression, modifiers }, { effect, Alpine }) => {
    const accordion = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_accordion'));

    if (!accordion) {
      throw new Error(`${original} must be inside an accordion`);
    }

    el.classList.add('border-b', 'last:border-b-0', '[[data-variant=header]_&]:data-[state=closed]:border-b-0');
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

    const setAttributes = () => {
      el.setAttribute('data-state', el._h_accordionItem.expanded ? 'open' : 'closed');
    };

    setAttributes();

    effect(setAttributes);
  });

  Alpine.directive('h-accordion-trigger', (el, { original, expression }, { effect, evaluateLater, Alpine, cleanup }) => {
    if (el.tagName.length !== 2 && !el.tagName.startsWith('H')) {
      throw new Error(`${original} must be a header element`);
    }
    const accordion = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_accordion'));

    const accordionItem = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_accordionItem'));

    if (!accordionItem || !accordion) {
      throw new Error(`${original} must have an accordion and accordion item parent elements`);
    }

    el.classList.add(
      'flex',
      'h-12',
      '[[data-size=md]_&]:h-10',
      '[[data-size=sm]_&]:h-8',
      '[[data-variant=header]_&]:bg-object-header',
      '[[data-variant=header]_&]:text-object-header-foreground',
      '[[data-variant=header]_&]:px-4',
      '[[data-variant=header]_&]:border-b',
      '[[data-size=md][data-variant=header]_&]:px-3',
      '[[data-size=sm][data-variant=header]_&]:px-2.5'
    );
    el.setAttribute('tabIndex', '-1');

    const getLabel = evaluateLater(expression);

    const chevronDown = createSvg({
      icon: ChevronDown,
      classes: 'text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200',
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
      'text-sm',
      'font-medium',
      'transition-all',
      'outline-none',
      'hover:underline',
      'focus-visible:ring-[calc(var(--spacing)*0.75)]',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      '[&[data-state=open]>svg]:rotate-180'
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
      button.setAttribute('data-state', accordionItem._h_accordionItem.expanded ? 'open' : 'closed');
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

  Alpine.directive('h-accordion-content', (el, _, { effect, Alpine }) => {
    el.classList.add('pt-0', 'pb-4', 'overflow-hidden', 'text-sm', 'data-[state=closed]:hidden');
    el.setAttribute('data-slot', 'accordion-content');
    const parent = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_accordionItem'));
    if (parent) {
      el.setAttribute('id', parent._h_accordionItem.controls);
      el.setAttribute('aria-labelledby', parent._h_accordionItem.id);
      el.setAttribute('data-state', parent._h_accordionItem.expanded ? 'open' : 'closed');
      effect(() => {
        el.setAttribute('data-state', parent._h_accordionItem.expanded ? 'open' : 'closed');
      });
    }
  });
}
