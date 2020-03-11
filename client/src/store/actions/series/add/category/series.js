import { SET_SERIES_CATEGORY_SERIES } from '../../../types';

export default (seriesState, language, category, series) => {
  let newSeries = {};
  if (seriesState[language][category]) {
    newSeries = seriesState[language][category];
  }
  for (let serie of series) {
    if (!newSeries[serie]) {
      newSeries[serie] = {};
    }
  }
  return {
    type: SET_SERIES_CATEGORY_SERIES,
    payload: {
      series: {
        ...seriesState,
        [language]: { ...seriesState[language], [category]: newSeries }
      }
    }
  };
};
