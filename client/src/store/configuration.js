import { createBrowserHistory, routerMiddleware } from 'redux-first-routing';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

export const browserHistory = (() => createBrowserHistory())();

export default (() => {
  const middlewares = applyMiddleware(routerMiddleware(browserHistory), thunk);
  return [reducers, middlewares];
})();
