import { SET_NAVIGATOR_ONLINE } from '../../types';

export default (currentNavigatorState, online) => {
  console.log('current:', currentNavigatorState, online);
  return {
    type: SET_NAVIGATOR_ONLINE,
    payload: { navigator: { ...currentNavigatorState, online: online } }
  };
};
