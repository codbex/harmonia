export default function (Alpine) {
  Alpine.directive('h-include', (el, { modifiers, expression }, { evaluateLater, effect, cleanup, Alpine }) => {
    const getUrl = evaluateLater(expression);

    function executeScript(oldScript) {
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

        el.appendChild(newScript);
      });
    }

    function initTree() {
      for (let i = 0; i < el.children.length; i++) {
        if (el.children[i].tagName !== 'SCRIPT') Alpine.initTree(el.children[i]);
      }
    }
    function destroyTree() {
      if (el.children.length) {
        for (let i = 0; i < el.children.length; i++) {
          if (el.children[i].tagName !== 'SCRIPT') Alpine.initTree(el.children[i]);
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
            if (modifiers.includes('js')) {
              const container = document.createElement('div');
              container.innerHTML = content;

              const scripts = [...container.querySelectorAll('script')];

              // Remove scripts from the container
              scripts.forEach((script) => script.remove());

              // Append HTML first
              while (container.childNodes.length > 0) {
                el.appendChild(container.childNodes[0]);
              }

              // Execute scripts sequentially
              for (const oldScript of scripts) {
                await executeScript(oldScript);
              }
            } else {
              el.innerHTML = content;
            }
            // Initialize the new elements with Alpine
            initTree();
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
