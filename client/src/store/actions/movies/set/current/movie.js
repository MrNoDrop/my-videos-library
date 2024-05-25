import { SET_MOVIES_CURRENT_MOVIE } from "../../../types";

export default (movies, movie) => {
  return {
    type: SET_MOVIES_CURRENT_MOVIE,
    payload: {
      movies: {
        ...movies,
        current: {
          ...movies.current,
          movie: typeof movie === "string" ? movie : null,
        },
      },
    },
  };
};
