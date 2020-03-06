import response from '../../../predefined/responses.mjs';

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
    res.json(
      response.error.missing.file(
        { index: 6, value: 'manifest' },
        ['series', ...req, params, 'manifest'],
        {
          path: ['series', ...req.params],
          manifest: null,
          info: db.structure[language][category][serie].season[season].episode[
            episode
          ].info
            ? await db.structure[language][category][serie].season[
                season
              ].episode[episode].info.read()
            : null,
          subtitles: db.structure.shared[category][serie].season[season]
            .episode[episode].subtitles
            ? (() => {
                const keys = db.structure.shared[category][serie].season[
                  season
                ].episode[episode].subtitles.list();
                const subtitles = {};
                for (let key of keys) {
                  subtitles[key] = db.structure.shared[category][serie].season[
                    season
                  ].episode[episode].subtitles[key].toUrl();
                }
                return subtitles;
              })()
            : null
        },
        'Missing manifest file.'
      )
    );
  }
}
