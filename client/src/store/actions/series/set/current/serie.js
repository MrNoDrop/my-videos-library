import { SET_SERIES_CURRENT_SERIE } from '../../../types';

export default (series, serie) => {
  return {
    type: SET_SERIES_CURRENT_SERIE,
    payload: {
      series: {
        ...series,
        current: {
          ...series.current,
          serie: typeof serie === 'string' ? serie : null
        }
      }
    }
  };
};
