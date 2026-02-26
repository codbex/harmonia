export const Calendar = 0;
export const Check = 1;
export const ChevronDown = 2;
export const ChevronLeft = 3;
export const ChevronRight = 4;
export const ChevronsLeft = 5;
export const ChevronsRight = 6;
export const Clock = 7;
export const Search = 8;
export const Ellipsis = 9;
export const Minus = 10;
export const Plus = 11;

function setCalendarContent(svg) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttributeNS(
    null,
    'd',
    'm5.4512 0.8252c-0.3601 0-0.65039 0.29029-0.65039 0.65039v0.69922h-1.3008c-1.108 0-2 0.892-2 2v9c0 1.108 0.892 2 2 2h9c1.108 0 2-0.892 2-2v-9c0-1.108-0.892-2-2-2h-1.2988v-0.69922c0-0.3601-0.29029-0.65039-0.65039-0.65039s-0.64844 0.29029-0.64844 0.65039v0.69922h-3.8027v-0.69922c0-0.3601-0.28834-0.65039-0.64844-0.65039zm-1.6504 2.6504h1v0.69922c1e-6 0.3601 0.29029 0.65039 0.65039 0.65039s0.64844-0.29029 0.64844-0.65039v-0.69922h3.8027v0.69922c0 0.3601 0.28834 0.65039 0.64844 0.65039s0.65039-0.29029 0.65039-0.65039v-0.69922h1c0.554 0 1 0.446 1 1v1.5h-10.4v-1.5c0-0.554 0.446-1 1-1zm-1 3.8008h10.4v5.5996c0 0.554-0.446 1-1 1h-8.4004c-0.554 0-1-0.446-1-1z'
  );
  svg.appendChild(path);
}

function setCheckContent(svg) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttributeNS(
    null,
    'd',
    'm12.937 4.049-6.5829 6.5829-3.2935-3.2914c-0.23947-0.23959-0.63055-0.24761-0.87815 0-0.24358 0.2437-0.24358 0.63448 0 0.87815l3.7315 3.7337c0.24646 0.24634 0.64298 0.23729 0.88026 0l7.0228-7.0251c0.24358-0.2437 0.24358-0.63448 0-0.87815-0.2433-0.24342-0.63667-0.24364-0.88026-1.5e-6z'
  );
  svg.appendChild(path);
}

function setChevronDownContent(svg) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttributeNS(
    null,
    'd',
    'm3.2098 5.353c-0.2797 0.27984-0.2797 0.72853 0 1.0083l4.2848 4.2872c0.283 0.28286 0.73831 0.27246 1.0108 0l4.2848-4.2872c0.2797-0.27984 0.2797-0.72853 0-1.0083-0.2797-0.27984-0.73098-0.27984-1.0108 0l-3.7795 3.7795-3.7818-3.7795c-0.27497-0.27511-0.72404-0.28432-1.0083 0z'
  );
  svg.appendChild(path);
}

function setChevronLeftContent(svg) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttributeNS(
    null,
    'd',
    'm10.647 12.79c-0.27984 0.2797-0.72853 0.2797-1.0083 0l-4.2872-4.2848c-0.28286-0.283-0.27246-0.73831 0-1.0108l4.2872-4.2848c0.27984-0.2797 0.72853-0.2797 1.0083 0 0.27984 0.2797 0.27984 0.73098 0 1.0108l-3.7795 3.7795 3.7795 3.7818c0.27511 0.27497 0.28432 0.72404 0 1.0083z'
  );
  svg.appendChild(path);
}

function setChevronRightContent(svg) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttributeNS(
    null,
    'd',
    'm5.353 12.79c0.27984 0.2797 0.72853 0.2797 1.0083 0l4.2872-4.2848c0.28286-0.283 0.27246-0.73831 0-1.0108l-4.2872-4.2848c-0.27984-0.2797-0.72853-0.2797-1.0083 0-0.27984 0.2797-0.27984 0.73098 0 1.0108l3.7795 3.7795-3.7795 3.7818c-0.27511 0.27497-0.28432 0.72404 0 1.0083z'
  );
  svg.appendChild(path);
}

function setChevronsLeftContent(svg) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttributeNS(
    null,
    'd',
    'm13 3c0.18212 0 0.36302 0.070121 0.50292 0.20996 0.27982 0.27969 0.27982 0.73097 0 1.0108l-3.7794 3.7794 3.7794 3.7819c0.27511 0.27496 0.28432 0.72402 0 1.0083-0.27984 0.27969-0.72852 0.27969-1.0083 0l-4.2872-4.2847c-0.28285-0.283-0.27246-0.7383 0-1.0108l4.2872-4.2847c0.13991-0.13985 0.32325-0.20996 0.50537-0.20996zm-5.7152 0c0.18212 0 0.36547 0.070121 0.50537 0.20996 0.27984 0.27969 0.27984 0.73097 0 1.0108l-3.7794 3.7794 3.7794 3.7819c0.27511 0.27496 0.28432 0.72402 0 1.0083-0.27984 0.27969-0.72852 0.27969-1.0083 0l-4.2872-4.2847c-0.28286-0.283-0.27246-0.7383 0-1.0108l4.2872-4.2847c0.13991-0.13985 0.32081-0.20996 0.50292-0.20996z'
  );
  svg.appendChild(path);
}

function setChevronsRightContent(svg) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttributeNS(
    null,
    'd',
    'm2.9996 3c-0.18212 0-0.36302 0.070121-0.50292 0.20996-0.27984 0.27969-0.27984 0.73097 0 1.0108l3.7794 3.7794-3.7794 3.7819c-0.27511 0.27496-0.28432 0.72402 0 1.0083 0.27984 0.27969 0.72852 0.27969 1.0083 0l4.2872-4.2847c0.28286-0.283 0.27246-0.7383 0-1.0108l-4.2872-4.2847c-0.13991-0.13985-0.32325-0.20996-0.50537-0.20996zm5.7152 0c-0.18212 0-0.36547 0.070121-0.50537 0.20996-0.27984 0.27969-0.27984 0.73097 0 1.0108l3.7794 3.7794-3.7794 3.7819c-0.27511 0.27496-0.28432 0.72402 0 1.0083 0.27984 0.27969 0.72852 0.27969 1.0083 0l4.2872-4.2847c0.28285-0.283 0.27246-0.7383 0-1.0108l-4.2872-4.2847c-0.13991-0.13985-0.32081-0.20996-0.50292-0.20996z'
  );
  svg.appendChild(path);
}

function setClockContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(
    null,
    'd',
    'm8 0.75a7.25 7.25 0 0 0-7.25 7.25 7.25 7.25 0 0 0 7.25 7.25 7.25 7.25 0 0 0 7.25-7.25 7.25 7.25 0 0 0-7.25-7.25zm0 1.3008a5.95 5.95 0 0 1 5.9492 5.9492 5.95 5.95 0 0 1-5.9492 5.9512 5.95 5.95 0 0 1-5.9492-5.9512 5.95 5.95 0 0 1 5.9492-5.9492z'
  );
  svg.appendChild(path1);

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttributeNS(
    null,
    'd',
    'm8 3.25c-0.3601 0-0.65039 0.29029-0.65039 0.65039v4.0996c-4.82e-5 0.2464 0.13303 0.40256 0.20508 0.47461l2.6035 2.6016c0.25463 0.25463 0.66334 0.25463 0.91797 0s0.25463-0.66334 0-0.91797l-2.4258-2.4277v-3.8301c0-0.3601-0.29029-0.65039-0.65039-0.65039z'
  );
  svg.appendChild(path2);
}

function setSearchContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(
    null,
    'd',
    'm7.31 1.31a5.9999 5.9999 0 0 0-5.9999 5.9999 5.9999 5.9999 0 0 0 5.9999 5.9999 5.9999 5.9999 0 0 0 5.9999-5.9999 5.9999 5.9999 0 0 0-5.9999-5.9999zm0 1.1992a4.7999 4.7999 0 0 1 4.8007 4.8007 4.7999 4.7999 0 0 1-4.8007 4.8007 4.7999 4.7999 0 0 1-4.8007-4.8007 4.7999 4.7999 0 0 1 4.8007-4.8007z'
  );
  svg.appendChild(path1);

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttributeNS(
    null,
    'd',
    'm10.705 10.705c0.23504-0.23504 0.6286-0.2199 0.88247 0.03394l2.9019 2.9019c0.25384 0.25384 0.26898 0.64742 0.03394 0.88247-0.23504 0.23504-0.6286 0.2199-0.88247-0.03394l-2.9019-2.9019c-0.25384-0.25384-0.26898-0.64742-0.03394-0.88247z'
  );
  svg.appendChild(path2);
}

function setEllipsisContent(svg) {
  const circle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle1.setAttributeNS(null, 'cx', '2');
  circle1.setAttributeNS(null, 'cy', '8');
  circle1.setAttributeNS(null, 'r', '1.5');
  svg.appendChild(circle1);

  const circle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle2.setAttributeNS(null, 'cx', '8');
  circle2.setAttributeNS(null, 'cy', '8');
  circle2.setAttributeNS(null, 'r', '1.5');
  svg.appendChild(circle2);

  const circle3 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle3.setAttributeNS(null, 'cx', '14');
  circle3.setAttributeNS(null, 'cy', '8');
  circle3.setAttributeNS(null, 'r', '1.5');
  svg.appendChild(circle3);
}

function setMinusContent(svg) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttributeNS(null, 'd', 'm2.75 7.25h10.5c0.4155 0 0.75 0.3345 0.75 0.75s-0.3345 0.75-0.75 0.75h-10.5c-0.4155 0-0.75-0.3345-0.75-0.75s0.3345-0.75 0.75-0.75z');
  svg.appendChild(path);
}

function setPlusContent(svg) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttributeNS(
    null,
    'd',
    'm8 2c-0.4155 0-0.75 0.3345-0.75 0.75v4.5h-4.5c-0.4155 0-0.75 0.3345-0.75 0.75s0.3345 0.75 0.75 0.75h4.5v4.5c0 0.4155 0.3345 0.75 0.75 0.75s0.75-0.3345 0.75-0.75v-4.5h4.5c0.4155 0 0.75-0.3345 0.75-0.75s-0.3345-0.75-0.75-0.75h-4.5v-4.5c0-0.4155-0.3345-0.75-0.75-0.75z'
  );
  svg.appendChild(path);
}

export function createSvg({ icon, classes = 'size-4', attrs } = {}) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttributeNS(null, 'width', '16');
  svg.setAttributeNS(null, 'height', '16');
  svg.setAttributeNS(null, 'viewBox', '0 0 16 16');
  svg.setAttributeNS(null, 'fill', 'currentColor');
  svg.setAttributeNS(null, 'class', classes);

  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      svg.setAttributeNS(null, key, value);
    }
  }

  switch (icon) {
    case Calendar:
      setCalendarContent(svg);
      break;
    case Check:
      setCheckContent(svg);
      break;
    case ChevronDown:
      setChevronDownContent(svg);
      break;
    case ChevronLeft:
      setChevronLeftContent(svg);
      break;
    case ChevronRight:
      setChevronRightContent(svg);
      break;
    case ChevronsLeft:
      setChevronsLeftContent(svg);
      break;
    case ChevronsRight:
      setChevronsRightContent(svg);
      break;
    case Clock:
      setClockContent(svg);
      break;
    case Search:
      setSearchContent(svg);
      break;
    case Ellipsis:
      setEllipsisContent(svg);
      break;
    case Minus:
      setMinusContent(svg);
      break;
    case Plus:
      setPlusContent(svg);
      break;
    default:
      break;
  }

  return svg;
}

export function setSvgContent(svg, icon) {
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'currentColor');

  switch (icon) {
    case 'calendar':
      setCalendarContent(svg);
      break;
    case 'check':
      setCheckContent(svg);
      break;
    case 'chevron-down':
      setChevronDownContent(svg);
      break;
    case 'chevron-left':
      setChevronLeftContent(svg);
      break;
    case 'chevron-right':
      setChevronRightContent(svg);
      break;
    case 'chevrons-left':
      setChevronsLeftContent(svg);
      break;
    case 'chevrons-right':
      setChevronsRightContent(svg);
      break;
    case 'clock':
      setClockContent(svg);
      break;
    case 'search':
      setSearchContent(svg);
      break;
    case 'ellipsis':
      setEllipsisContent(svg);
      break;
    case 'minus':
      setMinusContent(svg);
      break;
    case 'plus':
      setPlusContent(svg);
      break;
    default:
      break;
  }
}
