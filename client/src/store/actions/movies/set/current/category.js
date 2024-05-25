import { SET_MOVIES_CURRENT_CATEGORY } from "../../../types";

export default (movies, category) => {
  return {
    type: SET_MOVIES_CURRENT_CATEGORY,
    payload: {
      movies: {
        ...movies,
        current: {
          ...movies.current,
          category: typeof category === "string" ? category : null,
        },
      },
    },
  };
};
