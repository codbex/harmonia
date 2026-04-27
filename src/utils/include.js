export default function (Alpine) {
  Alpine.directive('h-include', (el, { modifiers, expression }, { evaluateLater, effect }) => {
    const getUrl = evaluateLater(expression);

    function getHtml(url) {
      const parsed = new URL(url, window.location.origin);

      if (parsed.origin === window.location.origin) {
        fetch(url)
          .then((response) => {
            if (response.status === 200) return response.text();
            throw response;
          })
          .then((content) => {
            if (modifiers.includes('js')) {
              const container = document.createElement('div');
              container.innerHTML = content;
              let staticScript = container.querySelector('script');
              const script = document.createElement('script');
              for (let a = 0; a < staticScript.attributes.length; a++) {
                script.setAttribute(staticScript.attributes[a].name, staticScript.attributes[a].value);
              }
              script.appendChild(document.createTextNode(staticScript.innerHTML));
              staticScript.remove();
              while (container.childNodes.length > 0) {
                el.appendChild(container.childNodes[0]);
              }
              el.appendChild(script);
            } else {
              el.innerHTML = content;
            }
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
        if (url) getHtml(url);
        else el.innerHTML = '';
      });
    });
  }).before('bind');
}
