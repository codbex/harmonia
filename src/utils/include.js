export default function (Alpine) {
  Alpine.directive('h-include', (el, { original, modifiers, expression }, { evaluateLater, effect, cleanup, Alpine }) => {
    const getUrl = evaluateLater(expression);

    // Inline scripts run synchronously on append and must not be awaited:
    // yielding to a microtask between the fragment's insertion and its scripts
    // lets Alpine's mutation observer initialize the new tree first, so only
    // registrations from the first script would be visible to it. Only external
    // scripts return a promise (their load is inherently asynchronous).
    function executeScript(oldScript) {
      const newScript = document.createElement('script');

      // Copy attributes
      for (const attr of oldScript.attributes) {
        newScript.setAttribute(attr.name, attr.value);
      }

      if (oldScript.src) {
        const loaded = new Promise((resolve, reject) => {
          newScript.onload = resolve;
          newScript.onerror = reject;
        });
        newScript.src = oldScript.src;
        el.appendChild(newScript);
        return loaded;
      }

      newScript.textContent = oldScript.textContent;
      el.appendChild(newScript);
    }

    function initTree() {
      for (let i = 0; i < el.children.length; i++) {
        if (el.children[i].tagName !== 'SCRIPT') Alpine.initTree(el.children[i]);
      }
    }
    function destroyTree() {
      if (el.children.length) {
        for (let i = 0; i < el.children.length; i++) {
          if (el.children[i].tagName !== 'SCRIPT') Alpine.destroyTree(el.children[i]);
        }
      }
    }

    function getHtml(url) {
      const parsed = new URL(url, window.location.origin);

      if (parsed.origin === window.location.origin) {
        fetch(url)
          .then((response) => {
            if (response.status === 200) return response.text();
            throw response;
          })
          .then(async (content) => {
            if (el.getAttribute('data-js') === 'true' || modifiers.includes('js')) {
              const container = document.createElement('div');
              container.innerHTML = content;

              const scripts = [...container.querySelectorAll('script')];

              // Remove scripts from the container
              scripts.forEach((script) => script.remove());

              // Append HTML first
              while (container.childNodes.length > 0) {
                el.appendChild(container.childNodes[0]);
              }

              // Execute scripts sequentially (awaiting only external ones)
              for (const oldScript of scripts) {
                const loaded = executeScript(oldScript);
                if (loaded) await loaded;
              }
            } else {
              el.innerHTML = content;
            }
            // Initialize the new elements with Alpine
            initTree();

            el.dispatchEvent(new CustomEvent('fragment:loaded', { bubbles: false, detail: { url } }));
          })
          .catch((response) => {
            console.error(response);
          });
      } else {
        throw new Error(`${original}: external requests not allowed`);
      }
    }

    effect(() => {
      getUrl((url) => {
        destroyTree();
        el.innerHTML = '';
        if (url) getHtml(url);
      });
    });

    cleanup(() => {
      destroyTree();
    });
  }).before('bind');
}
