import accordion from './components/accordion';
import alert from './components/alert';
import avatar from './components/avatar';
import badge from './components/badge';
import breadcrumb from './components/breadcrumb';
import button from './components/button';
import calendar from './components/calendar';
import card from './components/card';
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

export { version } from '../package.json';
export { getBreakpointListener } from './utils/breakpoint-listener';
export { getLanguageStorageKey, setLanguageStorageKey } from './utils/language';
export { addColorSchemeListener, getColorScheme, getSystemColorScheme, removeColorSchemeListener, setColorScheme } from './utils/theme';

import i18next from './plugins/i18next';
import lucide from './plugins/lucide';
import dateFormat from './utils/date-format';
import focus from './utils/focus';
import include from './utils/include';
import template from './utils/template';

export {
  accordion as Accordion,
  alert as Alert,
  avatar as Avatar,
  badge as Badge,
  breadcrumb as Breadcrumb,
  button as Button,
  calendar as Calendar,
  card as Card,
  chart as Chart,
  checkbox as Checkbox,
  chip as Chip,
  dateFormat as DateFormat,
  datepicker as DatePicker,
  datetimePicker as DateTimePicker,
  dialog as Dialog,
  expansionPanel as ExpansionPanel,
  fieldset as Fieldset,
  fileUpload as FileUpload,
  focus as Focus,
  i18next as I18next,
  icon as Icon,
  include as Include,
  infoPage as InfoPage,
  input as Input,
  label as Label,
  list as List,
  lucide as Lucide,
  menu as Menu,
  menubar as Menubar,
  navigationMenu as NavigationMenu,
  notifications as Notifications,
  pagination as Pagination,
  popover as Popover,
  progress as Progress,
  radio as Radio,
  range as Range,
  rating as Rating,
  select as Select,
  separator as Separator,
  sheet as Sheet,
  sidebar as Sidebar,
  skeleton as Skeleton,
  slotPicker as SlotPicker,
  spinner as Spinner,
  split as Split,
  stepIndicator as StepIndicator,
  _switch as Switch,
  table as Table,
  tabs as Tabs,
  tag as Tag,
  template as Template,
  text as Text,
  textarea as Textarea,
  tile as Tile,
  timepicker as TimePicker,
  toolbar as Toolbar,
  tooltip as Tooltip,
  tree as Tree,
};

export const registerComponents = (registerPlugin) => {
  registerPlugin(accordion);
  registerPlugin(alert);
  registerPlugin(avatar);
  registerPlugin(badge);
  registerPlugin(breadcrumb);
  registerPlugin(button);
  registerPlugin(calendar);
  registerPlugin(card);
  registerPlugin(chart);
  registerPlugin(checkbox);
  registerPlugin(chip);
  registerPlugin(dateFormat);
  registerPlugin(datepicker);
  registerPlugin(datetimePicker);
  registerPlugin(dialog);
  registerPlugin(expansionPanel);
  registerPlugin(fieldset);
  registerPlugin(fileUpload);
  registerPlugin(focus);
  registerPlugin(icon);
  registerPlugin(include);
  registerPlugin(infoPage);
  registerPlugin(input);
  registerPlugin(label);
  registerPlugin(list);
  registerPlugin(menu);
  registerPlugin(menubar);
  registerPlugin(navigationMenu);
  registerPlugin(notifications);
  registerPlugin(pagination);
  registerPlugin(popover);
  registerPlugin(progress);
  registerPlugin(radio);
  registerPlugin(range);
  registerPlugin(rating);
  registerPlugin(select);
  registerPlugin(separator);
  registerPlugin(sheet);
  registerPlugin(sidebar);
  registerPlugin(skeleton);
  registerPlugin(spinner);
  registerPlugin(slotPicker);
  registerPlugin(split);
  registerPlugin(stepIndicator);
  registerPlugin(_switch);
  registerPlugin(table);
  registerPlugin(tabs);
  registerPlugin(tag);
  registerPlugin(template);
  registerPlugin(text);
  registerPlugin(textarea);
  registerPlugin(tile);
  registerPlugin(timepicker);
  registerPlugin(toolbar);
  registerPlugin(tooltip);
  registerPlugin(tree);
};

export default registerComponents;
