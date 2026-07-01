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

  async connectedCallback() {
    this.classToggle();
    this.observer.observe(window.document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const url = this.getAttribute('src');
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

    if (!url) {
      // Move all child nodes into wrapper
      while (this.firstChild) {
        this.container.appendChild(this.firstChild);
      }

      setTimeout(() => {
        // Initialize the new element with Alpine; Lucide icons render via the
        // x-h-lucide directive as Alpine initializes them.
        Alpine.initTree(this.container);
      });
    } else {
      try {
        const response = await fetch(`/harmonia/${url}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const htmlText = await response.text();

        await this.render(htmlText);
      } catch (err) {
        console.error('dynamic-fragment failed:', err);
      }
    }
  }

  disconnectedCallback() {
    this.observer.disconnect();
    Alpine.destroyTree(this.container);
  }

  async render(htmlText) {
    // Parse fetched HTML
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
