import response from '../../predefined/responses.mjs';

export default function getEpisode(router, db) {
  router.get('/:language/:category/:serie/:season/:episode', (req, res) => {
    const { language, category, serie, season, episode } = req.params;
    if (db.isSupportedLanguage(language)) {
      if (db.structure[language].list().includes(category)) {
        if (db.structure[language][category].list().includes(serie)) {
          if (
            db.structure[language][category][serie].season
              .list()
              .includes(season)
          ) {
            if (
              db.structure[language][category][serie].season[season].episode
                .list()
                .includes(episode)
            ) {
              if (
                db.structure[language][category][serie].season[season].episode[
                  episode
                ].manifest
              ) {
                (async () =>
                  res.json(
                    response.ok({
                      path: [
                        'series',
                        language,
                        category,
                        serie,
                        season,
                        episode
                      ],
                      manifest: `${db.structure[language][category][
                        serie
                      ].season[season].episode[episode].toUrl()}/manifest`,
                      info: db.structure[language][category][serie].season[
                        season
                      ].episode[episode].info
                        ? await db.structure[language][category][serie].season[
                            season
                          ].episode[episode].info.read()
                        : null,
                      subtitles: db.structure.shared[category][serie].season[
                        season
                      ].episode[episode].subtitles
                        ? (() => {
                            const keys = db.structure.shared[category][
                              serie
                            ].season[season].episode[episode].subtitles.list();
                            const subtitles = {};
                            for (let key of keys) {
                              subtitles[key] = db.structure.shared[category][
                                serie
                              ].season[season].episode[episode].subtitles[
                                key
                              ].toUrl();
                            }
                            return subtitles;
                          })()
                        : null
                    })
                  ))();
              } else {
                (async () =>
                  res.json(
                    response.error.missing.file(
                      { index: 6, value: 'manifest' },
                      [
                        'series',
                        language,
                        category,
                        serie,
                        season,
                        episode,
                        'manifest'
                      ],
                      {
                        path: [
                          'series',
                          language,
                          category,
                          serie,
                          season,
                          episode
                        ],
                        manifest: null,
                        info: db.structure[language][category][serie].season[
                          season
                        ].episode[episode].info
                          ? await db.structure[language][category][
                              serie
                            ].season[season].episode[episode].info.read()
                          : null,
                        subtitles: db.structure.shared[category][serie].season[
                          season
                        ].episode[episode].subtitles
                          ? (() => {
                              const keys = db.structure.shared[category][
                                serie
                              ].season[season].episode[
                                episode
                              ].subtitles.list();
                              const subtitles = {};
                              for (let key of keys) {
                                subtitles[key] = db.structure.shared[category][
                                  serie
                                ].season[season].episode[episode].subtitles[
                                  key
                                ].toUrl();
                              }
                              return subtitles;
                            })()
                          : null
                      },
                      'Missing manifest file.'
                    )
                  ))();
              }
            } else {
              res.json(
                response.error.unknownField(
                  { index: 5, value: episode },
                  ['series', language, category, serie, season, episode],
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
          } else {
            res.json(
              response.error.unknownField(
                { index: 4, value: season },
                ['series', language, category, serie, season],
                {
                  existing: {
                    seasons: db.structure[language][category][
                      serie
                    ].season.list()
                  }
                },
                'Season does not exist.'
              )
            );
          }
        } else {
          res.json(
            response.error.unknownField(
              { index: 3, value: serie },
              ['series', language, category, serie, season],
              {
                existing: {
                  series: db.structure[language][category].list()
                }
              },
              'Serie does not exist.'
            )
          );
        }
      } else {
        res.json(
          response.error.unknownField(
            { index: 2, value: category },
            ['series', language, category, serie, season],
            { existing: { categories: db.structure[language].list() } },
            'Category does not exist.'
          )
        );
      }
    } else {
      res.json(
        response.error.unknownField(
          { index: 1, value: language },
          ['series', language, category, serie, season],
          { existing: { languages: db.structure.languages() } },
          'Language does not exist.'
        )
      );
    }
  });
}
