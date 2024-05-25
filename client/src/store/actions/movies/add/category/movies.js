import { SET_MOVIES_CATEGORY_MOVIES } from "../../../types";

export default (moviesState, language, category, movies) => {
  let newSeries = {};
  if (moviesState[language][category]) {
    newSeries = moviesState[language][category];
  }
  for (let serie of movies) {
    if (!newSeries[serie]) {
      newSeries[serie] = {};
    }
  }
  return {
    type: SET_MOVIES_CATEGORY_MOVIES,
    payload: {
      movies: {
        ...moviesState,
        [language]: { ...moviesState[language], [category]: newSeries },
      },
    },
  };
};
