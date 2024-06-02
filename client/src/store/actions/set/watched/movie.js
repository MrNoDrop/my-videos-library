// import SET_WATCHED_MOVIE from "../../types";

export default (watched, language, category, title, value) => ({
  type: "SET_WATCHED_MOVIE",
  payload: {
    watched: {
      ...watched,
      movies: {
        [language]: {
          ...watched["movies"][language],
          [category]: {
            ...watched["movies"][language]?.[category],
            [title]: {
              ...watched["movies"][language]?.[category]?.[title],
              ...value,
            },
          },
        },
      },
    },
  },
});
