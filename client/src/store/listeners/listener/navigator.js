import setNavigatorOnline from '../../actions/set/navigator/online';

export default store => {
  const { online } = store.getState().state.navigator;
  if (navigator.onLine !== online) {
    console.log(navigator.onLine, online);
    store.dispatch(
      setNavigatorOnline(store.getState().state.navigator, navigator.onLine)
    );
  }
};
