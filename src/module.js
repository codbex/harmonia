import accordion from './components/accordion';
import alert from './components/alert';
import avatar from './components/avatar';
import badge from './components/badge';
import button from './components/button';
import calendar from './components/calendar';
import card from './components/card';
import checkbox from './components/checkbox';
import collapsible from './components/collapsible';
import datepicker from './components/datepicker';
import dialog from './components/dialog';
import fieldset from './components/fieldset';
import icon from './components/icon';
import infoPage from './components/info-page';
import input from './components/input';
import label from './components/label';
import list from './components/list';
import menu from './components/menu';
import pagination from './components/pagination';
import popover from './components/popover';
import progress from './components/progress';
import radio from './components/radio';
import range from './components/range';
import select from './components/select';
import separator from './components/separator';
import sheet from './components/sheet';
import sidebar from './components/sidebar';
import skeleton from './components/skeleton';
import spinner from './components/spinner';
import split from './components/split';
import _switch from './components/switch';
import table from './components/table';
import tabs from './components/tabs';
import tag from './components/tag';
import text from './components/text';
import textarea from './components/textarea';
import tile from './components/tile';
import timepicker from './components/timepicker';
import toolbar from './components/toolbar';
import tooltip from './components/tooltip';
import tree from './components/tree';

export { version } from '../package.json';
export { getBreakpointListener } from './utils/breakpoint-listener';
export { addColorSchemeListener, getColorScheme, removeColorSchemeListener, setColorScheme } from './utils/theme';

import focus from './utils/focus';
import template from './utils/template';

export {
  accordion as Accordion,
  alert as Alert,
  avatar as Avatar,
  badge as Badge,
  button as Button,
  calendar as Calendar,
  card as Card,
  checkbox as Checkbox,
  collapsible as Collapsible,
  datepicker as DatePicker,
  dialog as Dialog,
  fieldset as Fieldset,
  focus as Focus,
  icon as Icon,
  infoPage as InfoPage,
  input as Input,
  label as Label,
  list as List,
  menu as Menu,
  pagination as Pagination,
  popover as Popover,
  progress as Progress,
  radio as Radio,
  range as Range,
  select as Select,
  separator as Separator,
  sheet as Sheet,
  sidebar as Sidebar,
  skeleton as Skeleton,
  spinner as Spinner,
  split as Split,
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
  registerPlugin(button);
  registerPlugin(calendar);
  registerPlugin(card);
  registerPlugin(checkbox);
  registerPlugin(collapsible);
  registerPlugin(datepicker);
  registerPlugin(dialog);
  registerPlugin(fieldset);
  registerPlugin(focus);
  registerPlugin(icon);
  registerPlugin(infoPage);
  registerPlugin(input);
  registerPlugin(label);
  registerPlugin(list);
  registerPlugin(menu);
  registerPlugin(pagination);
  registerPlugin(popover);
  registerPlugin(progress);
  registerPlugin(radio);
  registerPlugin(range);
  registerPlugin(select);
  registerPlugin(separator);
  registerPlugin(sheet);
  registerPlugin(sidebar);
  registerPlugin(skeleton);
  registerPlugin(spinner);
  registerPlugin(split);
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
