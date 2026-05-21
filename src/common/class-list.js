export function classListStartsWith(classList, term) {
  for (let i = 0; i < classList.length; i++) {
    if (classList.item(i).startsWith(term)) {
      return true;
    }
  }
  return false;
}
