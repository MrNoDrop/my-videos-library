import response from '../../../../predefined/responses.mjs';

export default async function checkLanguageCategorySerieSeasonEpisodeManifest(
  db,
  req,
  res,
  next
) {
  const { language, category, serie, season, episode } = req.params;
  if (
    db.structure[language][category][serie].season[season].episode[episode]
      .manifest
  ) {
    next();
  } else {
    res
      .status(404)
      .json(
        response.error.missing.file(
          { index: 6, value: 'manifest' },
          ['series', ...Object.values(req.params), 'manifest'],
          null,
          'Missing manifest file.'
        )
      );
  }
}
