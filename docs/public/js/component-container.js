import { getBreakpointListener, registerComponents } from '/harmonia/lib/node_modules/@codbex/harmonia/dist/harmonia.esm.js';
import Alpine from '/harmonia/lib/node_modules/alpinejs/dist/module.esm.min.js';

class ComponentContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/harmonia/lib/node_modules/@codbex/harmonia/dist/harmonia.css';
    this.shadowRoot.appendChild(style);
    this.container = document.createElement('div');
    this.container.classList.add('bg-background', 'text-foreground', 'border', 'rounded-md');
    this.container.setAttribute('v-pre', '');
    this.shadowRoot.appendChild(this.container);
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        this.classToggle();
      });
    });
    this.destroyObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            Alpine.destroyTree(node);
          }
        });
      }
    });
  }

  classToggle() {
    if (window.document.documentElement.classList.contains('dark')) {
      this.classList.add('dark');
    } else {
      this.classList.remove('dark');
    }
  }

  connectedCallback() {
    if (this.getAttribute('data-padding') === 'false') {
      this.container.classList.add('overflow-hidden');
    } else {
      this.container.classList.add('p-6');
    }
    if (this.hasAttribute('data-class')) {
      this.container.classList.add(...this.getAttribute('data-class').split(' '));
    }
    if (this.hasAttribute('data-style')) {
      this.container.setAttribute('style', this.getAttribute('data-style'));
    }
    if (this.hasAttribute('data-height')) {
      this.container.style.height = this.getAttribute('data-height');
    }
    this.classToggle();
    this.observer.observe(window.document.documentElement, { attributes: true, attributeFilter: ['class'] });
    if (this.hasAttribute('data-html')) {
      fetch('/harmonia' + this.getAttribute('data-html'))
        .then((response) => {
          if (response.status === 200) return response.text();
          throw response;
        })
        .then((template) => {
          this.container.innerHTML = template;
          let staticScript = this.container.querySelector('script');
          if (staticScript) {
            const script = document.createElement('script');
            for (let a = 0; a < staticScript.attributes.length; a++) {
              script.setAttribute(staticScript.attributes[a].name, staticScript.attributes[a].value);
            }
            const scriptText = document.createTextNode(`function initJS(Alpine, container, getBreakpointListener) {${staticScript.innerHTML}}`);
            script.appendChild(scriptText);
            staticScript.parentNode.replaceChild(script, staticScript);
            initJS(Alpine, this.container, getBreakpointListener);
          }
          registerComponents(Alpine.plugin);
          Alpine.initTree(this.container);
        })
        .catch((response) => {
          console.error(response);
        });
    } else if (this.hasAttribute('data-js')) {
      this.container.append(...this.childNodes);
      import('/harmonia' + this.getAttribute('data-js')).then((mod) => {
        mod.initJS(this.container);
        registerComponents(Alpine.plugin);
        Alpine.initTree(this.container);
      });
    } else {
      this.container.append(...this.childNodes);
      registerComponents(Alpine.plugin);
      Alpine.initTree(this.container);
    }
    this.destroyObserver.observe(this.container, {
      childList: true,
      subtree: true,
    });
  }

  disconnectedCallback() {
    this.observer.disconnect();
    this.destroyObserver.disconnect();
  }
}

customElements.define('component-container', ComponentContainer);
