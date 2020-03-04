import * as interactive_menu from './interactive/menu';
import * as interactive_viewmode from './interactive/viewmode';
import * as menu from './menu';
import * as animated from './animated';
import * as button from './button';
export default {
  interactive: { menu: interactive_menu, viewmode: interactive_viewmode },
  menu,
  animated,
  button
};
