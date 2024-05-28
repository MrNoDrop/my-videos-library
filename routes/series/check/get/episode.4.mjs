import response from "../../../predefined/responses.mjs";

export default function checkLanguageCategorySerieSeasonEpisode(
  db,
  req,
  res,
  next
) {
  const { language, category, serie, season, episode } = req.parameters;
  if (
    db.structure[language][category][serie].season[season].episode?.includes(
      episode
    )
  ) {
    next();
  } else {
    res.status(400).json(
      response.error.unknownField(
        { index: 5, value: episode },
        ["series", language, category, serie, season, episode],
        {
          existing: {
            episodes:
              db.structure[language][category][serie].season[
                season
              ].episode?.list(),
          },
        },
        "Episode does not exist."
      )
    );
  }
}
