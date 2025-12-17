export function getBreakpointListener(handler, breakpoint = 768) {
  const mql = top.matchMedia(`(width <= ${breakpoint}px)`);
  const onWidthChange = (event) => {
    handler(event.matches);
  };
  mql.addEventListener('change', onWidthChange);
  handler(mql.matches);
  return {
    _mql: mql,
    _onWidthChange: onWidthChange,
    remove() {
      this._mql.removeEventListener('change', this._onWidthChange);
    },
  };
}
