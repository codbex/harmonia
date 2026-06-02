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
  it('Calendar equals 0', () => {
    expect(Calendar).toBe(0);
  });

  it('Check equals 1', () => {
    expect(Check).toBe(1);
  });

  it('ChevronDown equals 2', () => {
    expect(ChevronDown).toBe(2);
  });

  it('ChevronLeft equals 3', () => {
    expect(ChevronLeft).toBe(3);
  });

  it('ChevronRight equals 4', () => {
    expect(ChevronRight).toBe(4);
  });

  it('ChevronsLeft equals 5', () => {
    expect(ChevronsLeft).toBe(5);
  });

  it('ChevronsRight equals 6', () => {
    expect(ChevronsRight).toBe(6);
  });

  it('Clock equals 7', () => {
    expect(Clock).toBe(7);
  });

  it('Search equals 8', () => {
    expect(Search).toBe(8);
  });

  it('Ellipsis equals 9', () => {
    expect(Ellipsis).toBe(9);
  });

  it('Minus equals 10', () => {
    expect(Minus).toBe(10);
  });

  it('Plus equals 11', () => {
    expect(Plus).toBe(11);
  });

  it('Close equals 12', () => {
    expect(Close).toBe(12);
  });

  it('Bell equals 13', () => {
    expect(Bell).toBe(13);
  });

  it('Trash equals 14', () => {
    expect(Trash).toBe(14);
  });

  it('Mail equals 15', () => {
    expect(Mail).toBe(15);
  });

  it('Send equals 16', () => {
    expect(Send).toBe(16);
  });

  it('Export equals 17', () => {
    expect(Export).toBe(17);
  });

  it('Import equals 18', () => {
    expect(Import).toBe(18);
  });

  it('Edit equals 19', () => {
    expect(Edit).toBe(19);
  });

  it('Menu equals 20', () => {
    expect(Menu).toBe(20);
  });

  it('Reply equals 21', () => {
    expect(Reply).toBe(21);
  });

  it('Refresh equals 22', () => {
    expect(Refresh).toBe(22);
  });

  it('CircleInfo equals 23', () => {
    expect(CircleInfo).toBe(23);
  });

  it('CircleWarning equals 24', () => {
    expect(CircleWarning).toBe(24);
  });

  it('CircleError equals 25', () => {
    expect(CircleError).toBe(25);
  });

  it('CircleSuccess equals 26', () => {
    expect(CircleSuccess).toBe(26);
  });

  it('CircleUnknown equals 27', () => {
    expect(CircleUnknown).toBe(27);
  });

  it('CircleUser equals 28', () => {
    expect(CircleUser).toBe(28);
  });
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
