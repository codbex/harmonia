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
        el.before(clone);
        Alpine.initTree(clone);
      });
      cleanup(() => {
        clone.remove();
      });
    } else {
      console.error(`${original}: ${Alpine.prefixed('data')} directive is missing`);
    }
  });
}
