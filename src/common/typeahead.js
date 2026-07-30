export function isPrintableCharacter(str) {
  return str.length === 1 && /\S/.test(str);
}

export function getFirstChar(text) {
  const clean = text.replaceAll('\n', '').trim();
  if (clean) return clean[0].toLowerCase();
  return '';
}
