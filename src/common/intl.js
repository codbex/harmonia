// Memoizes Intl.DateTimeFormat instances by locale+options so hot render paths
// don't reconstruct expensive formatters. Create one cache per directive instance
// and call it wherever a formatter is needed.
export function createDateTimeFormatCache() {
  const cache = new Map();
  return (locale, options) => {
    const key = `${locale || ''}|${JSON.stringify(options)}`;
    let formatter = cache.get(key);
    if (!formatter) {
      formatter = new Intl.DateTimeFormat(locale, options);
      cache.set(key, formatter);
    }
    return formatter;
  };
}
