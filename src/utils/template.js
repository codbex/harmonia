/**
 * This directive was originally inspired by Ben Nadel’s awesome “template-outlet” directive and has since evolved independently.
 * See https://www.bennadel.com/
 */

export default function (Alpine) {
  Alpine.directive('h-template', (el, { original, expression }, { evaluate, Alpine, cleanup }) => {
    if (el.hasAttribute(Alpine.prefixed('data'))) {
      const template = evaluate(expression);
      const clone = template.content.cloneNode(true).firstElementChild;
      Alpine.addScopeToNode(clone, Alpine.closestDataStack(el)[0], el.parentElement);
      Alpine.mutateDom(() => {
        el.after(clone);
        Alpine.initTree(clone);
      });
      // x-for reorders its items by moving each anchor and walking a cursor
      // forward, and it only knows to carry a rendered sibling along when the
      // anchor points at it through _x_currentIfEl, the same backref x-if sets.
      // Without it the clone is left behind whenever the list re-sorts.
      el._x_currentIfEl = clone;
      cleanup(() => {
        Alpine.destroyTree(clone);
        clone.remove();
        delete el._x_currentIfEl;
      });
    } else {
      console.error(`${original}: ${Alpine.prefixed('data')} directive is missing`);
    }
  });
}
