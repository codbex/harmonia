export default function (Alpine) {
  Alpine.directive('h-text', (el, { modifiers }) => {
    switch (modifiers[0]) {
      case 'h1':
        el.classList.add('text-4xl', 'font-extrabold', 'tracking-tight');
        break;
      case 'h2':
        el.classList.add('text-3xl', 'font-semibold', 'tracking-tight');
        break;
      case 'h3':
        el.classList.add('text-2xl', 'font-semibold', 'tracking-tight');
        break;
      case 'h4':
        el.classList.add('text-xl', 'font-semibold', 'tracking-tight');
        break;
      case 'h5':
        el.classList.add('text-base', 'font-semibold', 'tracking-tight');
        break;
      case 'h6':
        el.classList.add('text-sm', 'font-semibold', 'tracking-tight');
        break;
      case 'blockquote':
        el.classList.add('mt-6', 'border-l-2', 'pl-6', 'italic');
        break;
      case 'code-inline':
        el.classList.add('bg-muted', 'relative', 'rounded', 'px-[0.3rem]', 'py-[0.2rem]', 'font-mono', 'text-sm', 'font-semibold', 'whitespace-pre');
        break;
      case 'code':
        el.classList.add('bg-muted', 'relative', 'rounded', 'p-3', 'font-mono', 'text-sm', 'font-semibold', 'whitespace-pre');
        break;
      case 'lead':
        el.classList.add('text-muted-foreground', 'text-xl');
        break;
      case 'lg':
        el.classList.add('text-lg', 'font-semibold');
        break;
      case 'sm':
        el.classList.add('text-sm', 'leading-none', 'font-medium');
        break;
      case 'xs':
        el.classList.add('text-xs', 'leading-none', 'font-medium');
        break;
      case 'muted':
        el.classList.add('text-muted-foreground', 'text-sm');
        break;
      default:
        el.classList.add('leading-7');
    }
  });
}
