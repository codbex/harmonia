// A directive that mirrors state back to the author interpolates its expression
// onto the left of an assignment (`${expression} = true`). Only a reference can
// be assigned to, so a ternary, a logical expression or a call reads fine but
// produces a SyntaxError when written back. Alpine compiles expressions with
// `new AsyncFunction`, catches that SyntaxError itself and rethrows it from a
// `setTimeout`, so it never propagates back through `evaluate` and a try/catch
// around the call cannot see it. The expression has to be checked before it is
// handed over.
//
// Matches an identifier followed by any number of dotted, bracketed or optional
// accesses: `open`, `node.expanded`, `items[0].open`, `$store.ui.open`. Anything
// else (operators, calls, literals) is treated as not assignable.
const ASSIGNABLE = /^\s*[$_a-zA-Z][$\w]*(?:\s*(?:\.\s*[$_a-zA-Z][$\w]*|\[[^[\]]*\]))*\s*$/;

export function isAssignable(expression) {
  return typeof expression === 'string' && ASSIGNABLE.test(expression);
}
