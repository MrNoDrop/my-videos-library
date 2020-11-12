import { SET_SERIES_CURRENT_SEASON } from '../../../types';

export default (series, season) => {
  return {
    type: SET_SERIES_CURRENT_SEASON,
    payload: {
      series: {
        ...series,
        current: {
          ...series.current,
          season: typeof season === 'string' ? season : null
        }
      }
    }
  };
};
