import response from '../../../predefined/responses.mjs';

export default function checkLanguageCategorySerieSeasonEpisode(
  db,
  req,
  res,
  next
) {
  const { language, category, serie, season, episode } = req.params;
  if (
    db.structure[language][category][serie].season[season].episode
      .list()
      .includes(episode)
  ) {
    next();
  } else {
    res.json(
      response.error.unknownField(
        { index: 5, value: episode },
        ['series', ...Object.values(req.params)],
        {
          existing: {
            episodes: db.structure[language][category][serie].season[
              season
            ].episode.list()
          }
        },
        'Episode does not exist.'
      )
    );
  }
}
