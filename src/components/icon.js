import { setSvgContent } from './../common/icons';

export default function (Alpine) {
  Alpine.directive('h-icon', (el, { original, modifiers }) => {
    if (el.tagName.toLowerCase() !== 'svg') {
      throw new Error(`${original} works only on svg elements`);
    } else if (!el.hasAttribute('role')) {
      throw new Error(`${original} must have a role`);
    } else if (el.getAttribute('role') === 'img' && !el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
      throw new Error(`${original}: svg images with the role of img must have an "aria-label" or "aria-labelledby" attribute`);
    }
    el.classList.add('fill-current');
    el.setAttribute('data-slot', 'icon');
    if (el.hasAttribute('data-link')) {
      fetch(el.getAttribute('data-link'))
        .then((response) => {
          if (response.status === 200) return response.text();
          throw response;
        })
        .then((content) => {
          const parser = new DOMParser();
          const svg = parser.parseFromString(content, 'image/svg+xml');
          for (let a = 0; a < svg.firstElementChild.attributes.length; a++) {
            el.setAttribute(svg.firstElementChild.attributes[a].name, svg.firstElementChild.attributes[a].value);
          }
          el.append(...svg.firstElementChild.children);
        })
        .catch((response) => {
          console.error(response);
        });
    } else if (modifiers[0]) {
      setSvgContent(el, modifiers[0]);
    }
  });
}
