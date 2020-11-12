import { SET_SERIES_CURRENT_CATEGORY } from '../../../types';

export default (series, category) => {
  return {
    type: SET_SERIES_CURRENT_CATEGORY,
    payload: {
      series: {
        ...series,
        current: {
          ...series.current,
          category: typeof category === 'string' ? category : null
        }
      }
    }
  };
};
