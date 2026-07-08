import { classListStartsWith } from '../common/class-list';
import { setSvgContent } from './../common/icons';

export default function (Alpine) {
  Alpine.directive('h-icon', (el, { original }, { cleanup }) => {
    if (el.tagName.toLowerCase() !== 'svg') {
      throw new Error(`${original} works only on svg elements`);
    } else if (!el.hasAttribute('role')) {
      throw new Error(`${original} must have a role`);
    } else if (el.getAttribute('role') === 'img' && !el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
      throw new Error(`${original}: svg images with the role of img must have an "aria-label" or "aria-labelledby" attribute`);
    }
    if (!classListStartsWith(el.classList, 'fill-')) {
      el.classList.add('fill-current');
    }
    el.setAttribute('data-slot', 'icon');

    let requestId = 0;
    let linkClasses = [];

    const clearContent = () => {
      el.classList.remove(...linkClasses);
      linkClasses = [];
      while (el.firstChild) el.removeChild(el.firstChild);
    };

    const renderIcon = () => {
      requestId++;
      if (el.hasAttribute('data-link')) {
        const id = requestId;
        fetch(el.getAttribute('data-link'))
          .then((response) => {
            if (response.status === 200) return response.text();
            throw response;
          })
          .then((content) => {
            if (id !== requestId) return;
            const parser = new DOMParser();
            const svg = parser.parseFromString(content, 'image/svg+xml');
            clearContent();
            for (let a = 0; a < svg.firstElementChild.attributes.length; a++) {
              const { name, value } = svg.firstElementChild.attributes[a];
              if (name === 'class') {
                const added = value.split(/\s+/).filter((token) => token !== '' && !el.classList.contains(token));
                el.classList.add(...added);
                linkClasses = added;
              } else {
                el.setAttribute(name, value);
              }
            }
            el.append(...svg.firstElementChild.children);
          })
          .catch((response) => {
            console.error(response);
          });
      } else if (el.hasAttribute('data-icon')) {
        clearContent();
        setSvgContent(el, el.getAttribute('data-icon'));
      }
    };

    renderIcon();

    const observer = new MutationObserver(renderIcon);
    observer.observe(el, { attributes: true, attributeFilter: ['data-icon', 'data-link'] });

    cleanup(() => {
      observer.disconnect();
    });
  });
}
