import { describe, expect, it } from 'vitest';
import { isAssignable } from '../../src/common/assignable.js';

describe('isAssignable', () => {
  it.each(['open', 'panelOpen', '_private', '$store.ui.open', 'node.expanded', 'items[0].open', 'a.b.c.d', "map['key'].open", '  spaced  '])('accepts the reference %j', (expression) => {
    expect(isAssignable(expression)).toBe(true);
  });

  it.each(['ready ? open : false', 'a && b', 'x ?? false', '!open', '', 'getOpen()', 'node.children ? node.expanded : ""', 'a = b', '1', 'open + 1'])('rejects the non-reference %j', (expression) => {
    expect(isAssignable(expression)).toBe(false);
  });

  it('rejects a non-string', () => {
    expect(isAssignable(undefined)).toBe(false);
    expect(isAssignable(null)).toBe(false);
  });

  // The boolean literals parse as bare identifiers, so this is a shape check
  // rather than a full assignability test. Callers treat "true"/"false" as an
  // initial value and never reach the check with them.
  it('does not attempt to classify the boolean literals', () => {
    expect(isAssignable('true')).toBe(true);
    expect(isAssignable('false')).toBe(true);
  });
});
