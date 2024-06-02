// import SET_WATCHED_SERIE from "../../types";

export default (
  watched,
  language,
  category,
  title,
  season,
  episode,
  value
) => ({
  type: "SET_WATCHED_SERIE",
  payload: {
    watched: {
      ...watched,
      series: {
        [language]: {
          ...watched["series"][language],
          [category]: {
            ...watched["series"][language]?.[category],
            [title]: {
              ...watched["series"][language]?.[category]?.[title],
              [season]: {
                ...watched["series"][language]?.[category]?.[title]?.[season],
                [episode]: {
                  ...watched["series"][language]?.[category]?.[title]?.[
                    season
                  ]?.[episode],
                  ...value,
                },
              },
            },
          },
        },
      },
    },
  },
});
