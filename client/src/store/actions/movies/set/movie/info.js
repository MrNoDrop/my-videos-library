import { SET_MOVIES_INFO } from "../../../types";

export default (movies, language, movie, info) => ({
  type: SET_MOVIES_INFO,
  payload: {
    movies: {
      ...movies,
      current: {
        ...movies.current,
      },
      [language]: {
        ...movies[language],
        [movies.current.category]: {
          ...movies[language][movies.current.category],
          [movie]: {
            ...movies[language][movies.current.category][movie],
            info: info || null,
          },
        },
      },
    },
  },
});
