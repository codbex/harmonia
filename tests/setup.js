// happy-dom's innerText setter calls .split() on the value, which fails for non-strings.
// Patch it to coerce to string first, matching real browser behaviour.
const nativeDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText');
if (nativeDescriptor?.set) {
  Object.defineProperty(HTMLElement.prototype, 'innerText', {
    get: nativeDescriptor.get,
    set(value) {
      nativeDescriptor.set.call(this, String(value ?? ''));
    },
    configurable: true,
  });
}
