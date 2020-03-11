import { SET_SERIES_CATEGORIES } from '../../types';

export default (series, language, categories) => {
  let newCategories = {};
  if (series[language]) {
    newCategories = series[language];
  }
  for (let category of categories) {
    if (!newCategories[category]) {
      newCategories[category] = {};
    }
  }
  return {
    type: SET_SERIES_CATEGORIES,
    payload: { series: { ...series, [language]: newCategories } }
  };
};
