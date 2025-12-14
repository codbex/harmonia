import { ChevronDown, createElement } from 'lucide';
import { v4 as uuidv4 } from 'uuid';

export default function (Alpine) {
  Alpine.directive('h-accordion', (el, { expression, modifiers }, { Alpine }) => {
    el._accordion = modifiers.includes('single')
      ? Alpine.reactive({
          single: true,
          expandedId: expression ?? '',
        })
      : { single: false };
    el.setAttribute('data-slot', 'accordion');
  });

  Alpine.directive('h-accordion-item', (el, { expression, modifiers }, { effect, Alpine }) => {
    const accordion = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_accordion'));

    if (!accordion) {
      throw new Error('h-accordion-item must be inside an h-accordion');
    }

    el.classList.add('border-b', 'last:border-b-0');
    el.setAttribute('data-slot', 'accordion-item');

    const itemId = expression ?? `ha${uuidv4()}`;

    function getIsExpanded() {
      if (accordion._accordion.single) {
        if (accordion._accordion.expandedId !== '') {
          return accordion._accordion.expandedId === itemId;
        } else if (modifiers.includes('default')) {
          accordion._accordion.expandedId = itemId;
          return true;
        }
        return false;
      }
      return modifiers.includes('default');
    }

    el._accordionItem = Alpine.reactive({
      id: itemId,
      controls: `ha${uuidv4()}`,
      expanded: getIsExpanded(),
    });

    const setAttributes = () => {
      el.setAttribute('data-state', el._accordionItem.expanded ? 'open' : 'closed');
    };

    setAttributes();

    effect(setAttributes);
  });

  Alpine.directive('h-accordion-trigger', (el, { expression }, { effect, evaluateLater, Alpine, cleanup }) => {
    if (el.tagName.length !== 2 && !el.tagName.startsWith('H')) {
      throw new Error('h-accordion-trigger must be a header element');
    }
    const accordion = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_accordion'));

    const accordionItem = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_accordionItem'));

    if (!accordionItem || !accordion) {
      throw new Error('h-accordion-trigger must be inside an h-accordion-item, which must be inside an h-accordion');
    }

    el.classList.add('flex');
    el.setAttribute('tabIndex', '-1');

    const getLabel = evaluateLater(expression);

    const chevronDown = createElement(ChevronDown, {
      class: ['text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200'],
      width: '16',
      height: '16',
      'aria-hidden': true,
      role: 'presentation',
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
      'items-start',
      'justify-between',
      'gap-4',
      'py-4',
      'text-left',
      'text-sm',
      'font-medium',
      'transition-all',
      'outline-none',
      'hover:underline',
      'focus-visible:ring-[3px]',
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

    button.setAttribute('id', accordionItem._accordionItem.id);
    button.setAttribute('aria-controls', accordionItem._accordionItem.controls);

    const setAttributes = () => {
      button.setAttribute('data-state', accordionItem._accordionItem.expanded ? 'open' : 'closed');
      button.setAttribute('aria-expanded', accordionItem._accordionItem.expanded);
    };

    const handler = () => {
      accordionItem._accordionItem.expanded = !accordionItem._accordionItem.expanded;
      setAttributes();
      if (accordion._accordion.single) {
        accordion._accordion.expandedId = accordionItem._accordionItem.id;
      }
    };
    setAttributes();

    el.addEventListener('click', handler);

    cleanup(() => {
      el.removeEventListener('click', handler);
    });

    if (accordion._accordion.single) {
      effect(() => {
        if (accordion._accordion.expandedId !== accordionItem._accordionItem.id) {
          accordionItem._accordionItem.expanded = false;
          setAttributes();
        }
      });
    }
  });

  Alpine.directive('h-accordion-content', (el, {}, { effect, Alpine }) => {
    el.classList.add('pt-0', 'pb-4', 'overflow-hidden', 'text-sm', 'data-[state=closed]:hidden');
    el.setAttribute('data-slot', 'accordion-content');
    const parent = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_accordionItem'));
    if (parent) {
      el.setAttribute('id', parent._accordionItem.controls);
      el.setAttribute('aria-labelledby', parent._accordionItem.id);
      el.setAttribute('data-state', parent._accordionItem.expanded ? 'open' : 'closed');
      effect(() => {
        el.setAttribute('data-state', parent._accordionItem.expanded ? 'open' : 'closed');
      });
    }
  });
}
