import { create } from 'nouislider';

export default function (Alpine) {
  Alpine.directive('h-range', (el, { expression }, { evaluate, cleanup }) => {
    el.classList.add('harmonia-slider');
    el.setAttribute('data-slot', 'range');
    create(el, evaluate(expression));
    if (Object.prototype.hasOwnProperty.call(el, '_x_model')) {
      el.noUiSlider.on('change', (values) => {
        el._x_model.set(values);
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });

      cleanup(() => {
        el.noUiSlider.off('change');
      });
    }
  });
}
