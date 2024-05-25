import { SET_MOVIES_CATEGORIES } from "../../types";

export default (movies, language, categories) => {
  let newCategories = {};
  if (movies[language]) {
    newCategories = movies[language];
  }
  for (let category of categories) {
    if (!newCategories[category]) {
      newCategories[category] = {};
    }
  }
  return {
    type: SET_MOVIES_CATEGORIES,
    payload: { movies: { ...movies, [language]: newCategories } },
  };
};
