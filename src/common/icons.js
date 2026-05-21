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
export const Close = 12;
export const Bell = 13;
export const Trash = 14;
export const Mail = 15;
export const Send = 16;
export const Export = 17;
export const Import = 18;
export const Edit = 19;
export const Menu = 20;
export const Reply = 21;
export const Refresh = 22;
export const CircleInfo = 23;
export const CircleWarning = 24;
export const CircleError = 25;
export const CircleSuccess = 26;
export const CircleUnknown = 27;
export const CircleUser = 28;

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

function setCloseContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(
    null,
    'd',
    'm12.95 3.0503c-0.2938-0.2938-0.76686-0.2938-1.0607 0l-3.8891 3.8891-3.8891-3.8891c-0.2938-0.2938-0.76686-0.2938-1.0607 0-0.2938 0.2938-0.2938 0.76686 0 1.0607l3.8891 3.8891-3.8891 3.8891c-0.2938 0.2938-0.2938 0.76686 0 1.0607 0.2938 0.2938 0.76686 0.2938 1.0607 0l3.8891-3.8891 3.8891 3.8891c0.2938 0.2938 0.76686 0.2938 1.0607 0 0.2938-0.2938 0.2938-0.76686 0-1.0607l-3.8891-3.8891 3.8891-3.8891c0.2938-0.2938 0.2938-0.76686 0-1.0607z'
  );
  svg.appendChild(path1);
}

function setBellContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(null, 'd', 'm6.7206 13.171c-0.65794 0-0.78791 0.50739-0.53794 0.92414 0.72424 1.2064 2.9155 1.2064 3.6397 0 0.25-0.41678 0.11804-0.92414-0.53794-0.92414z');
  svg.appendChild(path1);

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttributeNS(
    null,
    'd',
    'm8.0017 1.0011c-1.4533-0.029274-2.9825 0.51861-3.8425 1.7418-1.0308 1.3944-1.1644 3.1887-1.131 4.8636-0.019737 1.2007-0.5306 2.3761-1.3316 3.2619-0.32199 0.50537 0.16335 1.2079 0.74794 1.108 3.7645-0.0022 7.5293 0.0045 11.294-0.0034 0.60962-0.02615 0.89718-0.87008 0.45127-1.2798-0.84568-0.96782-1.2957-2.2626-1.2151-3.5465 0.026492-1.7605-0.29402-3.6931-1.625-4.9635-0.88559-0.8583-2.141-1.1911-3.3478-1.182zm0 1.2923c1.1918-0.059451 2.4095 0.52351 3.006 1.5756 0.73891 1.2564 0.62867 2.7544 0.66947 4.1572 0.05518 0.93177 0.35347 1.8382 0.78938 2.6591h-8.9282c0.60148-1.0838 0.86112-2.3294 0.80315-3.5635-9.659e-4 -1.4009 0.15123-2.9948 1.2579-3.9921 0.64424-0.60975 1.5307-0.85343 2.4026-0.83627z'
  );
  svg.appendChild(path2);
}

function setTrashContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(
    null,
    'd',
    'm6.5156 6.9909c-0.36016 0-0.65232 0.29024-0.65234 0.65039l2e-3 1.1074v1.4844l-2e-3 1.1074c2.1e-5 0.36015 0.29218 0.65039 0.65234 0.65039 0.18009 0 0.34336-0.07187 0.46094-0.18945 0.11758-0.11758 0.18945-0.28085 0.18945-0.46094v-3.6992c0-0.18009-0.07187-0.34336-0.18945-0.46094-0.11758-0.11758-0.28085-0.18945-0.46094-0.18945z'
  );
  svg.appendChild(path1);

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttributeNS(
    null,
    'd',
    'm6.4082 1c-1.0468 0-1.9082 0.86333-1.9082 1.9102v1.0703h-2.2285a0.63636 0.63636 0 0 0-0.63477 0.63672 0.63636 0.63636 0 0 0 0.63477 0.63672h0.63672v7.8379c0 1.0468 0.86333 1.9082 1.9102 1.9082h6.3633c1.0468 0 1.9082-0.86138 1.9082-1.9082v-7.8379h0.63672a0.63636 0.63636 0 0 0 0.63672-0.63672 0.63636 0.63636 0 0 0-0.63672-0.63672h-2.2266v-1.0703c-1e-6 -1.0468-0.86138-1.9102-1.9082-1.9102zm0 1.2734h3.1836c0.35899 0 0.63477 0.27773 0.63477 0.63672v1.0703h-4.4531v-1.0703c0-0.35899 0.27577-0.63672 0.63476-0.63672zm-2.2266 2.9805h7.6367v7.8379c0 0.35899-0.27773 0.63672-0.63672 0.63672h-6.3633c-0.35899 0-0.63672-0.27773-0.63672-0.63672z'
  );
  svg.appendChild(path2);

  const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path3.setAttributeNS(
    null,
    'd',
    'm9.4853 6.9909c-0.36016 0-0.65232 0.29024-0.65234 0.65039l2e-3 1.1074v1.4844l-2e-3 1.1074c2.1e-5 0.36015 0.29218 0.65039 0.65234 0.65039 0.18009 0 0.34336-0.07187 0.46094-0.18945 0.11758-0.11758 0.18945-0.28085 0.18945-0.46094v-3.6992c0-0.18009-0.07187-0.34336-0.18945-0.46094-0.11758-0.11758-0.28085-0.18945-0.46094-0.18945z'
  );
  svg.appendChild(path3);
}

function setMailContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(
    null,
    'd',
    'm3 2.2725c-1.108 0-2 0.892-2 2v7.4551c0 1.108 0.892 2 2 2h10c1.108 0 2-0.892 2-2v-7.4551c0-1.108-0.892-2-2-2zm0.30078 1.2988h9.3984c0.554 0 1 0.446 1 1l-4.2031 2.7207c-0.46835 0.30545-0.96668 0.57394-1.4961 0.57422-0.52942-2.795e-4 -1.0277-0.26876-1.4961-0.57422l-4.2031-2.7207c0-0.554 0.446-1 1-1zm-1 2.5195 4.2031 2.7227c0.46835 0.30546 0.96668 0.45687 1.4961 0.45703 0.52942-1.57e-4 1.0277-0.15158 1.4961-0.45703l4.2031-2.7227v5.3379c0 0.554-0.446 1-1 1h-9.3984c-0.554 0-1-0.446-1-1z'
  );
  svg.appendChild(path1);
}

function setSendContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(
    null,
    'd',
    'm14.072 1.0638-12.641 4.7555c-0.56634 0.21308-0.56955 1.0125-0.04008 1.2365l5.2444 2.2184 2.2084 5.2144 2e-3 0.0061c0.16229 0.59685 0.99893 0.674 1.2545 0.09819l4.8416-12.619c0.25524-0.64396-0.38635-1.1184-0.86973-0.90981zm-2.4308 2.3427-4.6272 4.5771-3.5491-1.501zm0.96993 0.91983-3.1483 8.2023-1.517-3.5851z'
  );
  svg.appendChild(path1);
}

function setExportContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(
    null,
    'd',
    'm1.6367 8.873a0.6355 0.6355 0 0 0-0.63672 0.63477v3.1816c0 1.0469 0.8614 1.9102 1.9082 1.9102h10.184c1.0468 0 1.9082-0.86329 1.9082-1.9102v-3.1816a0.6355 0.6355 0 0 0-0.63672-0.63477 0.6355 0.6355 0 0 0-0.63476 0.63477v3.1816c0 0.35899-0.27773 0.63672-0.63672 0.63672h-10.184c-0.35899 1e-6 -0.63672-0.27773-0.63672-0.63672v-3.1816a0.6355 0.6355 0 0 0-0.63477-0.63477z'
  );
  svg.appendChild(path1);

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttributeNS(
    null,
    'd',
    'm8 1.4004c-0.36016 0-0.65232 0.29024-0.65234 0.65039v6.123l-2.457-2.457c-0.25556-0.25556-0.66436-0.25556-0.91992 0-0.25467 0.25467-0.25658 0.6672-0.00195 0.92188l3.5703 3.5703c0.25408 0.25408 0.66556 0.2542 0.91992 0l3.5703-3.5703c0.25556-0.25556 0.25556-0.66436 0-0.91992-0.25467-0.25467-0.6672-0.25659-0.92188-0.00195l-2.457 2.459v-6.125c0-0.36142-0.28897-0.65039-0.65039-0.65039z'
  );
  svg.appendChild(path2);
}

function setImportContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(
    null,
    'd',
    'm1.6367 8.873a0.6355 0.6355 0 0 0-0.63672 0.63477v3.1816c0 1.0469 0.8614 1.9102 1.9082 1.9102h10.184c1.0468 0 1.9082-0.86329 1.9082-1.9102v-3.1816a0.6355 0.6355 0 0 0-0.63672-0.63477 0.6355 0.6355 0 0 0-0.63476 0.63477v3.1816c0 0.35899-0.27773 0.63672-0.63672 0.63672h-10.184c-0.35899 1e-6 -0.63672-0.27773-0.63672-0.63672v-3.1816a0.6355 0.6355 0 0 0-0.63477-0.63477z'
  );
  svg.appendChild(path1);

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttributeNS(
    null,
    'd',
    'm8 10.4c-0.36016 0-0.65232-0.29024-0.65234-0.65039v-6.123l-2.457 2.457c-0.25556 0.25556-0.66436 0.25556-0.91992 0-0.25467-0.25467-0.25658-0.6672-0.00195-0.92187l3.5703-3.5703c0.25408-0.25408 0.66556-0.2542 0.91992 0l3.5703 3.5703c0.25556 0.25556 0.25556 0.66436 0 0.91992-0.25467 0.25467-0.6672 0.25659-0.92188 0.00195l-2.457-2.459v6.125c0 0.36142-0.28897 0.65039-0.65039 0.65039z'
  );
  svg.appendChild(path2);
}

function setEditContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(
    null,
    'd',
    'm13.713 1.5513c-0.73596-0.73596-1.9485-0.73464-2.6845 0.00137l-9.84 9.84c-0.11663 0.11665-0.1879 0.27904-0.18812 0.45726l-1e-7 2.5019c-6.96e-6 0.17354 0.070916 0.33848 0.1895 0.45863 0.12014 0.1186 0.2851 0.1895 0.45863 0.1895h2.5019c0.17854-1e-5 0.34044-0.07132 0.45726-0.18812l9.84-9.84c0.73601-0.73601 0.73733-1.9486 0.0014-2.6845zm-0.8953 0.8953 0.73601 0.73601c0.25239 0.25239 0.25102 0.64153-0.0014 0.89392l-0.75247 0.75249-1.6286-1.6286 0.75249-0.75249c0.25239-0.25239 0.64154-0.25376 0.89393-0.00137zm-2.5417 1.6492 1.6286 1.6286-7.9808 7.9808-1.6286-1.6286z'
  );
  svg.appendChild(path1);
}

function setMenuContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(null, 'd', 'm2.75 2.6667h10.5c0.4155 0 0.75 0.3345 0.75 0.75s-0.3345 0.75-0.75 0.75h-10.5c-0.4155 0-0.75-0.3345-0.75-0.75s0.3345-0.75 0.75-0.75z');
  svg.appendChild(path1);

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttributeNS(null, 'd', 'm2.75 7.25h10.5c0.4155 0 0.75 0.3345 0.75 0.75s-0.3345 0.75-0.75 0.75h-10.5c-0.4155 0-0.75-0.3345-0.75-0.75s0.3345-0.75 0.75-0.75z');
  svg.appendChild(path2);

  const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path3.setAttributeNS(null, 'd', 'm2.75 11.833h10.5c0.4155 0 0.75 0.3345 0.75 0.75s-0.3345 0.75-0.75 0.75h-10.5c-0.4155 0-0.75-0.3345-0.75-0.75s0.3345-0.75 0.75-0.75z');
  svg.appendChild(path3);
}

function setReplyContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(
    null,
    'd',
    'm7.1956 2.0915c-0.17362 0-0.33638 0.0536-0.4883 0.16212l-5.6331 4.3948c-0.21703 0.17363-0.32423 0.38999-0.32423 0.65042-1e-6 0.26044 0.1072 0.47874 0.32423 0.65238l5.6331 4.3948c0.15192 0.10852 0.31468 0.16212 0.4883 0.16212 0.23874 0 0.43882-0.08138 0.60159-0.24415 0.16278-0.16277 0.24415-0.36285 0.24415-0.60159v-1.3575h0.94536c2.2661 0 3.3516 1.6295 4.3674 3.3888 0.11666 0.20206 0.30215 0.21485 0.48245 0.21485 0.21839 0 0.47762-0.15346 0.65628-0.46291 0.33483-0.5924 0.55854-1.215 0.668-1.8653 0.10946-0.65035 0.1175-1.2995 0.02734-1.9435-0.09014-0.64391-0.28195-1.2659-0.57816-1.8712-0.29619-0.60528-0.69702-1.1599-1.1993-1.6622-0.60528-0.60528-1.2885-1.0607-2.0548-1.3634-0.76626-0.30264-1.5493-0.45315-2.3478-0.45315h-0.96684v-1.3497c0-0.23874-0.08138-0.43882-0.24415-0.60159-0.16277-0.16278-0.36285-0.24415-0.60159-0.24415zm-0.4551 1.9825v0.71488h2e-3c-1.91e-4 0.4412 0.35755 0.79894 0.79887 0.79887h1.4669c1.0795 0 2.5837 0.5738 3.4201 1.4102 0.61816 0.61816 1.0403 1.3452 1.2657 2.1759 0.22537 0.83065 0.21539 1.8427-0.0293 2.6798-0.97733-1.6928-2.5629-2.8498-4.678-2.8498h-1.4454c-0.44132-7.2e-5 -0.79906 0.35767-0.79887 0.79887h-2e-3v0.72074l-4.1701-3.2228z'
  );
  svg.appendChild(path1);
}

function setRefreshContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(
    null,
    'd',
    'm7.9707 0.75c-1.0016 0-1.9388 0.18895-2.8164 0.56641-0.87885 0.37799-1.6436 0.8916-2.2949 1.543-0.65124 0.65124-1.1649 1.4202-1.543 2.3086-0.37757 0.88727-0.56641 1.8304-0.56641 2.832s0.18888 1.9448 0.56641 2.832c0.37802 0.88836 0.89173 1.6574 1.543 2.3086 0.65124 0.65124 1.4202 1.1649 2.3086 1.543 0.88727 0.37757 1.8304 0.56641 2.832 0.56641 0.8314 0 1.6239-0.13224 2.3789-0.39648 0.75572-0.26451 1.4452-0.63563 2.0684-1.1172 0.62353-0.48181 1.1617-1.0492 1.6152-1.7012 0.45251-0.65049 0.77222-1.3715 0.96094-2.1641l2e-3 -2e-3 0.04297-0.13281c0.0065-0.0195 0.01172-0.04408 0.01172-0.07617 0-0.1934-0.06474-0.34794-0.19531-0.47852-0.13058-0.13057-0.28317-0.19336-0.47656-0.19336-0.13605 0-0.26917 0.04492-0.40234 0.14258-0.13208 0.09684-0.21022 0.20993-0.24414 0.3457-0.17355 0.65565-0.44381 1.2604-0.81055 1.8105-0.36657 0.54985-0.80651 1.018-1.3184 1.4043-0.51116 0.38578-1.0746 0.69046-1.6914 0.91211-0.61812 0.22216-1.2662 0.33208-1.9415 0.33208-0.8289 0-1.6015-0.15376-2.3164-0.46289-0.71353-0.30856-1.3406-0.73315-1.8809-1.2734-0.54029-0.5403-0.96684-1.1693-1.2754-1.8828-0.30913-0.71489-0.46289-1.4875-0.46289-2.3164-1e-7 -0.8289 0.15389-1.6058 0.46289-2.3301 0.30846-0.72294 0.72874-1.3518 1.2598-1.8828 0.53103-0.53103 1.1599-0.95131 1.8828-1.2598 0.72402-0.30891 1.4907-0.46289 2.3008-0.46289 1.0797 0 2.0859 0.26648 3.0117 0.79688 0.92594 0.53049 1.651 1.2595 2.1719 2.1855l0.06055 0.10742h-3.0117c-0.19448 1e-6 -0.35029 0.06014-0.48047 0.18164-0.12927 0.12065-0.19141 0.26754-0.19141 0.46094 0 0.19339 0.062788 0.34794 0.19336 0.47852 0.13057 0.13057 0.28512 0.19336 0.47852 0.19336h4.375c0.1934 0 0.34794-0.06279 0.47852-0.19336 0.13057-0.13057 0.19336-0.28512 0.19336-0.47852v-4.375c0-0.1934-0.06279-0.34794-0.19336-0.47852-0.13057-0.13057-0.28512-0.19336-0.47852-0.19336-0.19339 0-0.34029 0.06214-0.46094 0.19141-0.12151 0.13018-0.18164 0.28598-0.18164 0.48047v2.3613l-0.12891-0.17383c-0.67984-0.90645-1.533-1.6088-2.5625-2.1094-1.0298-0.50071-2.1207-0.75-3.2734-0.75z'
  );
  svg.appendChild(path1);
}

const circlePath =
  'M 8,0.75000006 A 7.25,7.25 0 0 0 0.75,8 7.25,7.25 0 0 0 8,15.25 7.25,7.25 0 0 0 15.25,8 7.25,7.25 0 0 0 8,0.75000006 Z M 8,2.0508 A 5.95,5.95 0 0 1 13.9492,8 5.95,5.95 0 0 1 8,13.9512 5.95,5.95 0 0 1 2.0508,8 5.95,5.95 0 0 1 8,2.0508 Z';

function setCircleInfoContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(null, 'd', 'm8 7.207c-0.36016 0-0.6505 0.29034-0.6505 0.6505v2.8306c0 0.36016 0.29034 0.6505 0.6505 0.6505 0.36016 0 0.6505-0.29034 0.6505-0.6505v-2.8306c0-0.36016-0.29034-0.6505-0.6505-0.6505z');
  svg.appendChild(path1);

  const circle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle1.setAttributeNS(null, 'cx', '8.0032');
  circle1.setAttributeNS(null, 'cy', '5.4545');
  circle1.setAttributeNS(null, 'r', '.6505');
  svg.appendChild(circle1);

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttributeNS(null, 'd', circlePath);
  svg.appendChild(path2);
}

function setCircleWarningContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(null, 'd', 'm8.0016 4.7327c-0.36016 0-0.6505 0.29034-0.6505 0.6505v2.8306c0 0.36016 0.29034 0.6505 0.6505 0.6505s0.6505-0.29034 0.6505-0.6505v-2.8306c0-0.36016-0.29034-0.6505-0.6505-0.6505z');
  svg.appendChild(path1);

  const circle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle1.setAttributeNS(null, 'cx', '7.9984');
  circle1.setAttributeNS(null, 'cy', '10.617');
  circle1.setAttributeNS(null, 'r', '.6505');
  svg.appendChild(circle1);

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttributeNS(null, 'd', circlePath);
  svg.appendChild(path2);
}

function setCircleErrorContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(null, 'd', circlePath);
  svg.appendChild(path1);

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttributeNS(
    null,
    'd',
    'm6.0166 5.3645c-0.16628 0-0.3336 0.06407-0.46094 0.19141-0.25467 0.25467-0.25465 0.6672 0 0.92188l1.5234 1.5215-1.5234 1.5234c-0.25467 0.25467-0.25469 0.6672 0 0.92187 0.25467 0.25467 0.66525 0.25467 0.91992 0l1.5234-1.5234 1.5234 1.5234c0.25467 0.25467 0.6672 0.25469 0.92187 0 0.25467-0.25467 0.25467-0.66525 0-0.91992l-1.5234-1.5234 1.5234-1.5234c0.25467-0.25467 0.25467-0.66525 0-0.91992-0.25467-0.25467-0.6672-0.2566-0.92187-2e-3l-1.5234 1.5234-1.5234-1.5234c-0.12734-0.12734-0.2927-0.19141-0.45898-0.19141z'
  );
  svg.appendChild(path2);
}

function setCircleSuccessContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(null, 'd', circlePath);
  svg.appendChild(path1);

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttributeNS(
    null,
    'd',
    'm10.524 5.757c-0.16628 1e-6 -0.3336 0.06407-0.46094 0.19141l-2.7207 2.7227-1.1309-1.1328c-0.25467-0.25467-0.66525-0.25467-0.91992 0-0.25467 0.25467-0.25658 0.6672-0.00195 0.92188l1.5918 1.5918c0.25467 0.25467 0.66525 0.25463 0.91992 0l3.1836-3.1836c0.25465-0.25467 0.25274-0.66525-2e-3 -0.91992-0.12734-0.12734-0.2927-0.19141-0.45898-0.19141z'
  );
  svg.appendChild(path2);
}

function setCircleUnknownContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(null, 'd', circlePath);
  svg.appendChild(path1);

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttributeNS(
    null,
    'd',
    'm8.0273 4.6844c-1.0807 0-1.8911 0.80753-1.8911 1.8654 0 0.2914 0.26536 0.55114 0.5572 0.55114 0.29183 0 0.55265-0.26874 0.55265-0.55114 0-0.25055 0.077134-0.43674 0.20289-0.56477 0.12576-0.12802 0.30885-0.21046 0.57839-0.21046 0.47844 0 0.72678 0.28654 0.72678 0.6541 0 0.27054-0.069541 0.42451-0.19381 0.58748-0.12338 0.16181-0.31514 0.32247-0.52843 0.52843-0.38485 0.36029-0.59051 0.86593-0.59051 1.3218 0 0.29183 0.25827 0.56628 0.55871 0.56628 0.30044 0 0.55871-0.27445 0.55871-0.56628 0-0.18611 0.052582-0.44507 0.24226-0.61625l0.00151-0.0015h0.00151c0.25623-0.23652 0.51176-0.45141 0.71618-0.72981 0.20442-0.27839 0.3437-0.62946 0.3437-1.0629 0-1.0019-0.8073-1.7715-1.8366-1.7715z'
  );
  svg.appendChild(path2);

  const circle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle1.setAttributeNS(null, 'cx', '8');
  circle1.setAttributeNS(null, 'cy', '10.665');
  circle1.setAttributeNS(null, 'r', '.6505');
  svg.appendChild(circle1);
}

function setCircleUserContent(svg) {
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(
    null,
    'd',
    'm8 0.75a7.25 7.25 0 0 0-7.25 7.25 7.25 7.25 0 0 0 7.25 7.25 7.25 7.25 0 0 0 7.25-7.25 7.25 7.25 0 0 0-7.25-7.25zm0 1.3008a5.95 5.95 0 0 1 5.9492 5.9492 5.95 5.95 0 0 1-1.3965 3.832c-0.32045-0.54275-0.75894-0.96968-1.3125-1.2793-0.55697-0.31152-1.1549-0.4668-1.7969-0.4668h-2.8867c-0.64193 0-1.2399 0.15527-1.7969 0.4668-0.55356 0.30962-0.99205 0.73654-1.3125 1.2793a5.95 5.95 0 0 1-1.3965-3.832 5.95 5.95 0 0 1 5.9492-5.9492zm-1.4453 9.334h2.8906c0.45252 2.79e-4 0.86077 0.12397 1.2285 0.36914 0.23059 0.15372 0.52694 0.36032 0.82812 1.0566a5.95 5.95 0 0 1-3.502 1.1406 5.95 5.95 0 0 1-3.502-1.1406c0.30119-0.69632 0.59754-0.90292 0.82812-1.0566 0.36775-0.24517 0.776-0.36886 1.2285-0.36914z'
  );
  svg.appendChild(path1);

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttributeNS(
    null,
    'd',
    'm8 3.555a2.719 2.719 0 0 0-2.7188 2.7188 2.719 2.719 0 0 0 2.7188 2.7188 2.719 2.719 0 0 0 2.7188-2.7188 2.719 2.719 0 0 0-2.7188-2.7188zm0 1.3008a1.4182 1.4182 0 0 1 1.418 1.418 1.4182 1.4182 0 0 1-1.418 1.418 1.4182 1.4182 0 0 1-1.418-1.418 1.4182 1.4182 0 0 1 1.418-1.418z'
  );
  svg.appendChild(path2);
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
    case Close:
      setCloseContent(svg);
      break;
    case Bell:
      setBellContent(svg);
      break;
    case Trash:
      setTrashContent(svg);
      break;
    case Mail:
      setMailContent(svg);
      break;
    case Send:
      setSendContent(svg);
      break;
    case Export:
      setExportContent(svg);
      break;
    case Import:
      setImportContent(svg);
      break;
    case Edit:
      setEditContent(svg);
      break;
    case Menu:
      setMenuContent(svg);
      break;
    case Reply:
      setReplyContent(svg);
      break;
    case Refresh:
      setRefreshContent(svg);
      break;
    case CircleInfo:
      setCircleInfoContent(svg);
      break;
    case CircleWarning:
      setCircleWarningContent(svg);
      break;
    case CircleError:
      setCircleErrorContent(svg);
      break;
    case CircleSuccess:
      setCircleSuccessContent(svg);
      break;
    case CircleUnknown:
      setCircleUnknownContent(svg);
      break;
    case CircleUser:
      setCircleUserContent(svg);
      break;
    default:
      break;
  }

  return svg;
}

export function setSvgContent(svg, icon) {
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
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
    case 'close':
      setCloseContent(svg);
      break;
    case 'bell':
      setBellContent(svg);
      break;
    case 'trash':
      setTrashContent(svg);
      break;
    case 'mail':
      setMailContent(svg);
      break;
    case 'send':
      setSendContent(svg);
      break;
    case 'export':
      setExportContent(svg);
      break;
    case 'import':
      setImportContent(svg);
      break;
    case 'edit':
      setEditContent(svg);
      break;
    case 'menu':
      setMenuContent(svg);
      break;
    case 'reply':
      setReplyContent(svg);
      break;
    case 'refresh':
      setRefreshContent(svg);
      break;
    case 'circle-info':
      setCircleInfoContent(svg);
      break;
    case 'circle-warning':
      setCircleWarningContent(svg);
      break;
    case 'circle-error':
      setCircleErrorContent(svg);
      break;
    case 'circle-success':
      setCircleSuccessContent(svg);
      break;
    case 'circle-unknown':
      setCircleUnknownContent(svg);
      break;
    case 'circle-user':
      setCircleUserContent(svg);
      break;
    default:
      break;
  }
}
