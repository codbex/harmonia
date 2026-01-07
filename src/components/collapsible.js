export default function (Alpine) {
  Alpine.directive('h-collapsible', (el, { expression }, { effect, evaluate, evaluateLater, Alpine }) => {
    el._h_collapsible = Alpine.reactive({
      expanded: expression ? evaluate(expression) : false,
    });

    if (!el.hasAttribute('data-slot')) el.setAttribute('data-slot', 'collapsible');

    if (expression) {
      const getExpanded = evaluateLater(expression);
      effect(() => {
        getExpanded((expanded) => {
          el._h_collapsible.expanded = expanded;
        });
      });
    }
  });

  Alpine.directive('h-collapsible-trigger', (el, { modifiers }, { effect, Alpine, cleanup }) => {
    const collapsible = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_collapsible'));

    if (!collapsible) {
      throw new Error('h-collapsible-trigger must be inside an h-collapsible element');
    }

    if (!el.hasAttribute('data-slot')) el.setAttribute('data-slot', 'collapsible-trigger');

    if (modifiers.includes('chevron')) {
      el.classList.add('[&_svg]:transition-transform');
      if (modifiers.includes('90')) el.classList.add('[&[data-state=open]>svg:not(:first-child):last-child]:rotate-90', '[&[data-state=open]>svg:only-child]:rotate-90');
      else el.classList.add('[&[data-state=open]>svg:not(:first-child):last-child]:rotate-180', '[&[data-state=open]>svg:only-child]:rotate-180');
    }

    const handler = () => {
      collapsible._h_collapsible.expanded = !collapsible._h_collapsible.expanded;
    };

    effect(() => {
      el.setAttribute('data-state', collapsible._h_collapsible.expanded ? 'open' : 'closed');
    });

    el.addEventListener('click', handler);

    cleanup(() => {
      el.removeEventListener('click', handler);
    });
  });

  Alpine.directive('h-collapsible-content', (el, {}, { effect, Alpine }) => {
    const collapsible = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_collapsible'));
    if (!collapsible) {
      throw new Error('h-collapsible-content must be inside an h-collapsible element');
    }
    if (!el.hasAttribute('data-slot')) el.setAttribute('data-slot', 'collapsible-content');
    el.classList.add('data-[state=closed]:!hidden');
    effect(() => {
      el.setAttribute('data-state', collapsible._h_collapsible.expanded ? 'open' : 'closed');
    });
  });
}
