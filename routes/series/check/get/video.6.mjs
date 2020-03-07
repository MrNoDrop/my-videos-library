import response from '../../../predefined/responses.mjs';

export default async function checkLanguageCategorySerieSeasonEpisodeVideoQuality(
  db,
  req,
  res,
  next
) {
  const { category, serie, season, episode, quality } = req.params;
  if (
    db.structure.shared[category][serie].season[season].episode[
      episode
    ].video.includes(quality)
  ) {
    next();
  } else {
    res.status(404).json(
      response.error.missing.file(
        { index: 7, value: quality },
        [
          'series',
          'shared',
          category,
          serie,
          season,
          episode,
          'video',
          quality
        ],
        {
          existing: {
            qualities: db.structure.shared[category][serie].season[
              season
            ].episode[episode].video.list()
          }
        },
        'Missing video file.'
      )
    );
  }
}
