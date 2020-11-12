import { SET_SERIES_CATEGORY_SERIE_SEASONS } from '../../../types';

export default (seriesState, language, category, serie, seasons) => {
  let newSeasons = {};
  if (seriesState[language][category][serie]) {
    newSeasons = seriesState[language][category][serie];
  }
  for (let season of seasons) {
    if (!newSeasons[season]) {
      newSeasons[season] = {};
    }
  }
  return {
    type: SET_SERIES_CATEGORY_SERIE_SEASONS,
    payload: {
      series: {
        ...seriesState,
        [language]: {
          ...seriesState[language],
          [category]: {
            ...seriesState[language][category],
            [serie]: newSeasons
          }
        }
      }
    }
  };
};
