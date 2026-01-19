class SvgIcon extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute('src');
    if (!src) return;

    fetch(src)
      .then((res) => res.text())
      .then((svg) => {
        this.innerHTML = svg;
      })
      .catch((err) => console.error('Error loading SVG:', err));
  }
}

customElements.define('svg-icon', SvgIcon);
