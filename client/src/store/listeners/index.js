import bindNavigatorListener from './listener/navigator';
import bindHistoryListener from './listener/history';
import bindWindowListeners from './listener/window';
import bindLanguageListener from './listener/language';
import bindPathListener from './listener/path';

const loop = setInterval;

export default store => {
  bindHistoryListener(store);
  bindWindowListeners(store);
  // bindRouterListener(store);
  loop(() => {
    bindPathListener(store);
    bindLanguageListener(store);
    bindNavigatorListener(store);
  }, 1);
};
