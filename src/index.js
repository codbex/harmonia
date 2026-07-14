import accordion from './components/accordion';
import alert from './components/alert';
import avatar from './components/avatar';
import badge from './components/badge';
import breadcrumb from './components/breadcrumb';
import bubble from './components/bubble';
import button from './components/button';
import calendar from './components/calendar';
import card from './components/card';
import carousel from './components/carousel';
import chart from './components/chart';
import checkbox from './components/checkbox';
import chip from './components/chip';
import datepicker from './components/date-picker';
import datetimePicker from './components/datetime-picker';
import dialog from './components/dialog';
import expansionPanel from './components/expansion-panel';
import fieldset from './components/fieldset';
import fileUpload from './components/file-upload';
import icon from './components/icon';
import infoPage from './components/info-page';
import input from './components/input';
import label from './components/label';
import list from './components/list';
import menu from './components/menu';
import menubar from './components/menubar';
import monthPicker from './components/month-picker';
import navigationMenu from './components/navigation-menu';
import notifications from './components/notifications';
import pagination from './components/pagination';
import popover from './components/popover';
import progress from './components/progress';
import radio from './components/radio';
import range from './components/range';
import rating from './components/rating';
import select from './components/select';
import separator from './components/separator';
import sheet from './components/sheet';
import sidebar from './components/sidebar';
import skeleton from './components/skeleton';
import slotPicker from './components/slot-picker';
import spinner from './components/spinner';
import split from './components/split';
import stepIndicator from './components/step-indicator';
import _switch from './components/switch';
import table from './components/table';
import tabs from './components/tabs';
import tag from './components/tag';
import text from './components/text';
import textarea from './components/textarea';
import tile from './components/tile';
import timepicker from './components/time-picker';
import toolbar from './components/toolbar';
import tooltip from './components/tooltip';
import tree from './components/tree';
import weekPicker from './components/week-picker';

import { addColorSchemeListener, getColorScheme, getSystemColorScheme, removeColorSchemeListener, setColorScheme } from './utils/theme';

import { getBreakpointListener } from './utils/breakpoint-listener';

import template from './utils/template';

import include from './utils/include';

import focus from './utils/focus';

import dateFormat from './utils/date-format';

import { version } from '../package.json';

import { chartToImage, chartToSvg } from './utils/chart-export';

// Opt-in plugin bundles (Lucide, i18next, ...) expose their own APIs in an
// object under `plugins`, kept when a plugin script happened to create the
// namespace before this bundle ran.
window.Harmonia = {
  getBreakpointListener,
  addColorSchemeListener,
  chartToImage,
  chartToSvg,
  getColorScheme,
  removeColorSchemeListener,
  setColorScheme,
  getSystemColorScheme,
  version,
  plugins: (window.Harmonia && window.Harmonia.plugins) || {},
};

function registerPlugins() {
  window.Alpine.plugin(accordion);
  window.Alpine.plugin(alert);
  window.Alpine.plugin(avatar);
  window.Alpine.plugin(badge);
  window.Alpine.plugin(breadcrumb);
  window.Alpine.plugin(bubble);
  window.Alpine.plugin(button);
  window.Alpine.plugin(calendar);
  window.Alpine.plugin(card);
  window.Alpine.plugin(carousel);
  window.Alpine.plugin(chart);
  window.Alpine.plugin(checkbox);
  window.Alpine.plugin(chip);
  window.Alpine.plugin(datepicker);
  window.Alpine.plugin(datetimePicker);
  window.Alpine.plugin(dialog);
  window.Alpine.plugin(expansionPanel);
  window.Alpine.plugin(fieldset);
  window.Alpine.plugin(fileUpload);
  window.Alpine.plugin(icon);
  window.Alpine.plugin(infoPage);
  window.Alpine.plugin(input);
  window.Alpine.plugin(label);
  window.Alpine.plugin(list);
  window.Alpine.plugin(menu);
  window.Alpine.plugin(menubar);
  window.Alpine.plugin(monthPicker);
  window.Alpine.plugin(navigationMenu);
  window.Alpine.plugin(notifications);
  window.Alpine.plugin(pagination);
  window.Alpine.plugin(popover);
  window.Alpine.plugin(progress);
  window.Alpine.plugin(radio);
  window.Alpine.plugin(range);
  window.Alpine.plugin(rating);
  window.Alpine.plugin(select);
  window.Alpine.plugin(separator);
  window.Alpine.plugin(sheet);
  window.Alpine.plugin(sidebar);
  window.Alpine.plugin(skeleton);
  window.Alpine.plugin(spinner);
  window.Alpine.plugin(slotPicker);
  window.Alpine.plugin(split);
  window.Alpine.plugin(stepIndicator);
  window.Alpine.plugin(_switch);
  window.Alpine.plugin(table);
  window.Alpine.plugin(tabs);
  window.Alpine.plugin(tag);
  window.Alpine.plugin(text);
  window.Alpine.plugin(textarea);
  window.Alpine.plugin(tile);
  window.Alpine.plugin(timepicker);
  window.Alpine.plugin(toolbar);
  window.Alpine.plugin(tooltip);
  window.Alpine.plugin(tree);
  window.Alpine.plugin(weekPicker);
  // Utility plugins
  window.Alpine.plugin(focus);
  window.Alpine.plugin(template);
  window.Alpine.plugin(include);
  window.Alpine.plugin(dateFormat);
}

if (window.Alpine) registerPlugins();
else document.addEventListener('alpine:init', registerPlugins, { once: true });
