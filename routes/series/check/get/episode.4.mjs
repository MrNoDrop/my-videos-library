import response from '../../../predefined/responses.mjs';

export default function checkLanguageCategorySerieSeasonEpisode(
  db,
  req,
  res,
  next
) {
  const { language, category, serie, season, episode } = req.params;
  if (
    db.structure[language || 'shared'][category][serie].season[
      season
    ].episode.includes(episode)
  ) {
    next();
  } else {
    res.status(400).json(
      response.error.unknownField(
        { index: 5, value: episode },
        [
          'series',
          ...(language ? [] : ['shared']),
          ...Object.values(req.params)
        ],
        {
          existing: {
            episodes: db.structure[language || 'shared'][category][
              serie
            ].season[season].episode.list()
          }
        },
        'Episode does not exist.'
      )
    );
  }
}
