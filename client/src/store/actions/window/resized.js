import { WINDOW_RESIZED } from '../types';

export default (currentState, inner, outer) => ({
  type: WINDOW_RESIZED,
  payload: { window: { ...currentState.window, inner, outer } }
});
