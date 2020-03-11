import { SET_SERIES } from '../../types';

export default series => ({
  type: SET_SERIES,
  payload: { series: series ? series : {} }
});
