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
    this.shadowRoot.appendChild(this.container);
    this.observer = new MutationObserver(() => {
      this.classToggle();
    });

    // VitePress binds '/' as a global open-search hotkey and only skips it when
    // event.target is an editable element - but for keys typed inside a shadow
    // tree, the target seen at the window level is retargeted to this host, never
    // the inner input. Stop such keystrokes here, before they bubble to the window
    // listener, so typing '/' in an example input (e.g. a date) does not open the
    // search box. The real origin is the first entry of the composed path.
    this.addEventListener('keydown', (event) => {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
      const origin = event.composedPath()[0];
      const tagName = origin && origin.tagName;
      if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || (origin && origin.isContentEditable)) {
        event.stopPropagation();
      }
    });
  }

  classToggle() {
    // The `dark` class must live on an element inside the shadow tree: the dark theme is
    // driven by `.dark { ... }` / the `dark:` variant (`.dark`, `.dark *`), and a bare `.dark`
    // selector in the shadow stylesheet cannot match the host (only `:host(...)` can). The
    // host's `:host` rule pins the light tokens, so toggling the class on the host has no
    // effect - it has to go on the container that wraps the example content.
    if (window.document.documentElement.classList.contains('dark')) {
      this.container.classList.add('dark');
    } else {
      this.container.classList.remove('dark');
    }
  }

  connectedCallback() {
    this.classToggle();
    this.observer.observe(window.document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // This element is internal: markup is handed to its `_code` property (see
    // LiveExample.vue / IconGallery.vue), never authored inline. Authoring
    // <component-container> with inline children in a doc does not work - VitePress
    // compiles the page through Vue, which hijacks Alpine's `@`/`:` shorthands (and
    // `{{ }}`) in the children before Alpine runs. `v-pre` would prevent that, but
    // Vue strips it at compile time so it cannot be detected here. Fail loudly
    // rather than silently render a broken demo.
    if (this._code == null && this.childElementCount > 0) {
      throw new Error('component-container does not accept inline markup - use <LiveExample> (which wraps an html code fence), or a component that sets its `_code` property.');
    }

    const customClass = this.getAttribute('data-class');
    if (!customClass || (!customClass.startsWith('p-') && !customClass.includes(' p-'))) {
      this.container.classList.add('p-6');
    }
    if (customClass) {
      if (customClass.includes('p-0')) this.container.classList.add('overflow-hidden');
      this.container.classList.add(...customClass.split(' '));
    }
    const inlineStyle = this.getAttribute('data-style');
    if (inlineStyle) this.container.setAttribute('style', inlineStyle);

    if (this._code != null) {
      // Alpine is loaded deferred, so wait until it exists before rendering - this
      // element may connect earlier during hydration.
      const render = () => this.render(this._code);
      if (window.Alpine) render();
      else document.addEventListener('alpine:init', () => setTimeout(render), { once: true });
    }
  }

  disconnectedCallback() {
    this.observer.disconnect();
    Alpine.destroyTree(this.container);
  }

  async render(htmlText) {
    // Parse the provided markup
    const template = document.createElement('template');
    template.innerHTML = htmlText;

    // Clone content
    const fragment = template.content.cloneNode(true);

    // Extract scripts
    const scripts = [...fragment.querySelectorAll('script')];

    // Remove scripts from fragment
    scripts.forEach((script) => script.remove());

    // Append HTML/CSS first
    this.container.appendChild(fragment);

    // Execute scripts sequentially
    for (const oldScript of scripts) {
      await this.executeScript(oldScript);
    }

    // Initialize the new element with Alpine
    Alpine.initTree(this.container);
  }

  executeScript(oldScript) {
    return new Promise((resolve, reject) => {
      const newScript = document.createElement('script');

      // Copy attributes
      for (const attr of oldScript.attributes) {
        newScript.setAttribute(attr.name, attr.value);
      }

      // External script
      if (oldScript.src) {
        newScript.src = oldScript.src;

        newScript.onload = resolve;
        newScript.onerror = reject;
      } else {
        // Inline script
        newScript.textContent = oldScript.textContent;
        resolve();
      }

      this.shadowRoot.appendChild(newScript);
    });
  }
}

customElements.define('component-container', ComponentContainer);
