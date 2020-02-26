import windowResized from '../../actions/window/resized';

export default store => {
  trackWindowSizeState(store);
};

function trackWindowSizeState(store) {
  store.dispatch(
    windowResized(
      store.getState().state,
      { width: window.innerWidth, height: window.innerHeight },
      { width: window.outerWidth, height: window.outerHeight }
    )
  );
  window.addEventListener('resize', event => {
    store.dispatch(
      windowResized(
        store.getState().state,
        { width: window.innerWidth, height: window.innerHeight },
        { width: window.outerWidth, height: window.outerHeight }
      )
    );
  });
}
