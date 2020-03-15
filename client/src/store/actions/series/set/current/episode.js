import { SET_SERIES_CURRENT_EPISODE } from '../../../types';

export default (series, episode) => {
  return {
    type: SET_SERIES_CURRENT_EPISODE,
    payload: {
      series: {
        ...series,
        current: {
          ...series.current,
          episode: typeof episode === 'string' ? episode : null
        }
      }
    }
  };
};
