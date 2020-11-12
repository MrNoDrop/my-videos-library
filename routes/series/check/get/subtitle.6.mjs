import response from '../../../predefined/responses.mjs';

export default async function checkLanguageCategorySerieSeasonEpisodeSubtitlesSubtitle(
  db,
  req,
  res,
  next
) {
  const { category, serie, season, episode, subtitle } = req.parameters;

  if (
    db.structure.shared[category][serie].season[season].episode[
      episode
    ].subtitles.includes(subtitle)
  ) {
    next();
  } else {
    res.status(404).json(
      response.error.missing.file(
        { index: 7, value: subtitle },
        [
          'series',
          'shared',
          category,
          serie,
          season,
          episode,
          'subtitles',
          subtitle
        ],
        {
          existing: {
            subtitles: db.structure.shared[category][serie].season[
              season
            ].episode[episode].subtitles.list()
          }
        },
        'Missing subtitle file.'
      )
    );
  }
}
