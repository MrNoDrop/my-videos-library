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
    res.status(404).json(
      response.error.missing.file(
        { index: 6, value: 'manifest' },
        ['series', ...Object.values(req.params), 'manifest'],
        {
          path: ['series', ...Object.values(req.params)],
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
                return Object.keys(subtitles).length > 0 ? subtitles : null;
              })()
            : null,
          thumbnail:
            db.structure.shared[category][serie].season[season].episode[episode]
              .thumbnails &&
            db.structure.shared[category][serie].season[season].episode[
              episode
            ].thumbnails.getRandomPath()
              ? db.structure.shared[category][serie].season[season].episode[
                  episode
                ].thumbnails &&
                db.structure.shared[category][serie].season[season].episode[
                  episode
                ].toUrl() + '/thumbnail'
              : null
        },
        'Missing manifest file.'
      )
    );
  }
}
