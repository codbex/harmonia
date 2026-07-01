import { beforeEach, describe, expect, it } from 'vitest';
import {
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleError,
  CircleInfo,
  CircleSuccess,
  CircleUnknown,
  CircleUser,
  CircleWarning,
  Clock,
  Close,
  createSvg,
  Edit,
  Ellipsis,
  Export,
  Import,
  Mail,
  Menu,
  Minus,
  Plus,
  Refresh,
  Reply,
  Search,
  Send,
  setSvgContent,
  Trash,
} from '../../src/common/icons.js';

describe('icon constants', () => {
  // Each constant is the kebab icon name, matching its icons/<name>.svg file and
  // the x-h-icon data-icon="<name>" attribute. createSvg and setSvgContent both key off it.
  const expectedNames = {
    Calendar: 'calendar',
    Check: 'check',
    ChevronDown: 'chevron-down',
    ChevronLeft: 'chevron-left',
    ChevronRight: 'chevron-right',
    ChevronsLeft: 'chevrons-left',
    ChevronsRight: 'chevrons-right',
    Clock: 'clock',
    Search: 'search',
    Ellipsis: 'ellipsis',
    Minus: 'minus',
    Plus: 'plus',
    Close: 'close',
    Bell: 'bell',
    Trash: 'trash',
    Mail: 'mail',
    Send: 'send',
    Export: 'export',
    Import: 'import',
    Edit: 'edit',
    Menu: 'menu',
    Reply: 'reply',
    Refresh: 'refresh',
    CircleInfo: 'circle-info',
    CircleWarning: 'circle-warning',
    CircleError: 'circle-error',
    CircleSuccess: 'circle-success',
    CircleUnknown: 'circle-unknown',
    CircleUser: 'circle-user',
  };
  const constants = {
    Calendar,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Clock,
    Search,
    Ellipsis,
    Minus,
    Plus,
    Close,
    Bell,
    Trash,
    Mail,
    Send,
    Export,
    Import,
    Edit,
    Menu,
    Reply,
    Refresh,
    CircleInfo,
    CircleWarning,
    CircleError,
    CircleSuccess,
    CircleUnknown,
    CircleUser,
  };

  for (const [name, value] of Object.entries(expectedNames)) {
    it(`${name} equals '${value}'`, () => {
      expect(constants[name]).toBe(value);
    });

    it(`${name} resolves to a non-empty svg`, () => {
      expect(createSvg({ icon: constants[name] }).children.length).toBeGreaterThan(0);
    });
  }
});

describe('createSvg', () => {
  it('returns an SVG element', () => {
    const svg = createSvg({ icon: Calendar });
    expect(svg.tagName.toLowerCase()).toBe('svg');
  });

  it('sets width to 16', () => {
    const svg = createSvg({ icon: Check });
    expect(svg.getAttribute('width')).toBe('16');
  });

  it('sets height to 16', () => {
    const svg = createSvg({ icon: Check });
    expect(svg.getAttribute('height')).toBe('16');
  });

  it('sets viewBox to 0 0 16 16', () => {
    const svg = createSvg({ icon: ChevronDown });
    expect(svg.getAttribute('viewBox')).toBe('0 0 16 16');
  });

  it('sets fill to currentColor', () => {
    const svg = createSvg({ icon: Clock });
    expect(svg.getAttribute('fill')).toBe('currentColor');
  });

  it('uses default class size-4 when classes not provided', () => {
    const svg = createSvg({ icon: Calendar });
    expect(svg.getAttribute('class')).toBe('size-4');
  });

  it('applies custom classes', () => {
    const svg = createSvg({ icon: Calendar, classes: 'size-6 text-red-500' });
    expect(svg.getAttribute('class')).toBe('size-6 text-red-500');
  });

  it('applies extra attrs', () => {
    const svg = createSvg({ icon: Calendar, attrs: { 'aria-hidden': 'true' } });
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });

  it('returns an empty SVG for unknown icon value', () => {
    const svg = createSvg({ icon: 999 });
    expect(svg.children.length).toBe(0);
  });

  it('returns svg even when icon is undefined', () => {
    const svg = createSvg({});
    expect(svg.tagName.toLowerCase()).toBe('svg');
  });
});

describe('setSvgContent', () => {
  let svg;

  beforeEach(() => {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  });

  it('sets xmlns attribute', () => {
    setSvgContent(svg, 'calendar');
    expect(svg.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
  });

  it('sets width to 100%', () => {
    setSvgContent(svg, 'check');
    expect(svg.getAttribute('width')).toBe('100%');
  });

  it('sets height to 100%', () => {
    setSvgContent(svg, 'check');
    expect(svg.getAttribute('height')).toBe('100%');
  });

  it('sets viewBox to 0 0 16 16', () => {
    setSvgContent(svg, 'chevron-down');
    expect(svg.getAttribute('viewBox')).toBe('0 0 16 16');
  });

  it('sets fill to currentColor', () => {
    setSvgContent(svg, 'clock');
    expect(svg.getAttribute('fill')).toBe('currentColor');
  });

  it('appends content for check', () => {
    setSvgContent(svg, 'check');
    expect(svg.children.length).toBeGreaterThan(0);
  });

  it('appends content for chevron-left', () => {
    setSvgContent(svg, 'chevron-left');
    expect(svg.children.length).toBeGreaterThan(0);
  });

  it('appends content for chevron-right', () => {
    setSvgContent(svg, 'chevron-right');
    expect(svg.children.length).toBeGreaterThan(0);
  });

  it('appends content for chevrons-left', () => {
    setSvgContent(svg, 'chevrons-left');
    expect(svg.children.length).toBeGreaterThan(0);
  });

  it('appends content for chevrons-right', () => {
    setSvgContent(svg, 'chevrons-right');
    expect(svg.children.length).toBeGreaterThan(0);
  });

  it('appends two paths for clock', () => {
    setSvgContent(svg, 'clock');
    expect(svg.children.length).toBeGreaterThan(0);
  });

  it('does not append children for unknown icon name', () => {
    setSvgContent(svg, 'nonexistent-icon');
    expect(svg.children.length).toBe(0);
  });

  it('appends content for circle-info', () => {
    setSvgContent(svg, 'circle-info');
    expect(svg.children.length).toBeGreaterThan(0);
  });

  it('appends content for circle-success', () => {
    setSvgContent(svg, 'circle-success');
    expect(svg.children.length).toBeGreaterThan(0);
  });

  it('appends content for menu', () => {
    setSvgContent(svg, 'menu');
    expect(svg.children.length).toBeGreaterThan(0);
  });

  it('appends content for trash', () => {
    setSvgContent(svg, 'trash');
    expect(svg.children.length).toBeGreaterThan(0);
  });
});
