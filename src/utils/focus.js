export default function (Alpine) {
  Alpine.directive('h-focus', (el, { expression }, { effect, evaluateLater }) => {
    const getValue = evaluateLater(expression);
    effect(() => {
      getValue((val) => {
        if (val) el.focus();
      });
    });
  });
}
