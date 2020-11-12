import { SET_SERIES_INFO } from '../../../types';

export default (series, language, episode, info) => ({
  type: SET_SERIES_INFO,
  payload: {
    series: {
      ...series,
      current: {
        ...series.current
      },
      [language]: {
        ...series[language],
        [series.current.category]: {
          ...series[language][series.current.category],
          [series.current.serie]: {
            ...series[language][series.current.category][series.current.serie],
            [series.current.season]: {
              ...series[language][series.current.category][
                series.current.serie
              ][series.current.season],
              [episode]: {
                ...series[language][series.current.category][
                  series.current.serie
                ][series.current.season][episode],
                info: info || null
              }
            }
          }
        }
      }
    }
  }
});
