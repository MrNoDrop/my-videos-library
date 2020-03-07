import response from '../../../predefined/responses.mjs';

export default async function checkLanguageCategorySerieSeasonEpisodeInfo(
  db,
  req,
  res,
  next
) {
  const { language, category, serie, season, episode } = req.params;

  if (
    db.structure[language][category][serie].season[season].episode[episode].info
  ) {
    next();
  } else {
    res
      .status(404)
      .json(
        response.error.missing.file(
          { index: 6, value: 'info' },
          ['series', ...Object.values(req.params)],
          null,
          'Missing info file.'
        )
      );
  }
}
