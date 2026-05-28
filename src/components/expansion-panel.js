import { ChevronDown, createSvg } from '../common/icons';
import uuidv4 from '../utils/uuid';
export default function (Alpine) {
  Alpine.directive('h-exp-panel', (el) => {
    el.classList.add('vbox', 'h-full', 'group/exp', 'data-[floating=true]:gap-2', 'data-[floating=true]:overflow-visible');
    el.setAttribute('data-slot', 'exp-panel');
  });

  Alpine.directive('h-exp-panel-item', (el, { expression }, { evaluate, evaluateLater, effect, Alpine }) => {
    el.classList.add(
      'flex',
      'flex-col',
      'overflow-hidden',
      'transition-all',
      'motion-reduce:transition-none',
      'duration-300',
      'ease-out',
      'h-full',
      'border-b',
      'last:border-b-0',
      'min-h-12',
      '[[data-size=md]_&]:min-h-10',
      '[[data-size=sm]_&]:min-h-8',
      '[[data-floating=true]_&]:border-b-0',
      '[[data-floating=true]_&]:overflow-visible'
    );
    el.setAttribute('data-slot', 'exp-panel-item');

    let itemId;
    if (el.hasAttribute('id')) {
      itemId = el.getAttribute('id');
    } else {
      itemId = `epi${uuidv4()}`;
    }

    function setExpanded(expanded) {
      if (expanded) {
        el.classList.add('flex-[1_1_0]');
        el.classList.remove('flex-[0_1_0]');
      } else {
        el.classList.add('flex-[0_1_0]');
        el.classList.remove('flex-[1_1_0]');
      }
    }

    el._h_expPanelItem = Alpine.reactive({
      controls: itemId,
      expanded: evaluate(expression || 'false'),
    });

    if (expression !== '' && expression !== undefined && expression !== null && expression !== 'true' && expression !== 'false') {
      const getIsExpanded = evaluateLater(expression);

      effect(() => {
        getIsExpanded((expanded) => {
          setExpanded(expanded);
        });
      });

      effect(() => {
        if (evaluate(expression) !== el._h_expPanelItem.expanded) {
          evaluate(`${expression} = ${el._h_expPanelItem.expanded}`);
        }
      });
    } else {
      effect(() => {
        setExpanded(el._h_expPanelItem.expanded);
      });
    }
  });

  Alpine.directive('h-exp-panel-trigger', (el, { original, expression }, { effect, evaluateLater, Alpine, cleanup }) => {
    if (el.tagName.length !== 2 && !el.tagName.startsWith('H')) {
      throw new Error(`${original} must be a header element`);
    }

    const expPanelItem = Alpine.findClosest(el.parentElement, (parent) => Object.prototype.hasOwnProperty.call(parent, '_h_expPanelItem'));

    if (!expPanelItem) {
      throw new Error(`${original} must have an exp-panel-item parent element`);
    }

    el.classList.add(
      'bg-object-header',
      'border-b',
      '[[data-slot=exp-panel-item]:last-child>&]:not-has-[button[aria-expanded=true]]:group-has-[button[aria-expanded=true]]/exp:border-b-0',
      'flex',
      'h-12',
      'min-h-12',
      'px-4',
      'text-object-header-foreground',
      '[[data-floating=true]_&]:border',
      '[[data-floating=true]_&]:!border-b',
      '[[data-floating=true]_&]:rounded-lg',
      '[[data-floating=true]_&]:shadow-xs',
      '[[data-size=md]_&]:h-10',
      '[[data-size=md]_&]:min-h-10',
      '[[data-size=md]_&]:px-3',
      '[[data-size=sm]_&]:h-8',
      '[[data-size=sm]_&]:min-h-8',
      '[[data-size=sm]_&]:px-2.5',
      '[[data-variant=transparent]_&]:bg-transparent',
      '[[data-variant=transparent]_&]:text-foreground'
    );
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
    button.setAttribute('data-slot', 'exp-panel-trigger');
    button.classList.add(
      'cursor-pointer',
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

    button.setAttribute('id', expPanelItem._h_expPanelItem.id);
    button.setAttribute('aria-controls', expPanelItem._h_expPanelItem.controls);

    const setAttributes = () => {
      button.setAttribute('aria-expanded', expPanelItem._h_expPanelItem.expanded);
    };

    const handler = () => {
      expPanelItem._h_expPanelItem.expanded = !expPanelItem._h_expPanelItem.expanded;
      setAttributes();
    };
    setAttributes();

    el.addEventListener('click', handler);

    cleanup(() => {
      el.removeEventListener('click', handler);
    });
  });

  Alpine.directive('h-exp-panel-content', (el) => {
    el.classList.add('flex-1', 'overflow-scroll');
    el.setAttribute('data-slot', 'exp-panel-content');
  });
}
