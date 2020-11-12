import response from '../../../predefined/responses.mjs';

export default async function checkLanguageCategorySerieSeasonEpisodeAudioQuality(
  db,
  req,
  res,
  next
) {
  const {
    language,
    category,
    serie,
    season,
    episode,
    quality
  } = req.parameters;
  if (
    db.structure[language][category][serie].season[season].episode[
      episode
    ].audio.includes(quality)
  ) {
    next();
  } else {
    res.status(404).json(
      response.error.missing.file(
        { index: 7, value: quality },
        [
          'series',
          language,
          category,
          serie,
          season,
          episode,
          'audio',
          quality
        ],
        {
          existing: {
            qualities: db.structure[language][category][serie].season[
              season
            ].episode[episode].audio.list()
          }
        },
        'Missing audio file.'
      )
    );
  }
}
