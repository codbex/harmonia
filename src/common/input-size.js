function setSize(el, size) {
  if (size === 'sm') {
    el.classList.add('h-6.5');
    el.classList.remove('h-9');
  } else {
    el.classList.add('h-9');
    el.classList.remove('h-6.5');
  }
}

export function sizeObserver(el) {
  const observer = new MutationObserver(() => {
    setSize(el, el.getAttribute('data-size'));
  });

  setSize(el, el.getAttribute('data-size'));

  observer.observe(el, { attributes: true, attributeFilter: ['data-size'] });
  return observer;
}
