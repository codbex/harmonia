function _p8(s) {
  const p = (Math.random().toString(16) + '000000000').substring(2, 10);
  return s ? `-${p.substring(0, 4)}-${p.substring(4, 8)}` : p;
}

let warned = false;

// `crypto.randomUUID` is only exposed in secure contexts, so the capability is
// checked per call rather than once at module load. `globalThis` is used instead
// of `self` because a bare `self` is unresolvable outside a browser and would
// throw a ReferenceError on import (optional chaining does not guard that).
const uuidv4 = function () {
  const crypto = typeof globalThis !== 'undefined' && globalThis.crypto;
  if (crypto && crypto.randomUUID) return crypto.randomUUID();

  if (!warned) {
    warned = true;
    console.warn('UUIDv4: Running in a non-secure context!');
  }

  return _p8() + _p8(true) + _p8(true) + _p8();
};

export default uuidv4;
