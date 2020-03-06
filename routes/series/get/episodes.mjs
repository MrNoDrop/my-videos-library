import response from '../../predefined/responses.mjs';

export default function getEpisodes(router, db) {
  router.get('/:language/:category/:serie/:season', (req, res) => {
    const { language, category, serie, season } = req.params;
    if (db.isSupportedLanguage(language)) {
      if (db.structure[language].list().includes(category)) {
        if (db.structure[language][category].list().includes(serie)) {
          if (
            db.structure[language][category][serie].season
              .list()
              .includes(season)
          ) {
            res.json(
              response.ok({
                path: ['series', language, category, serie, season],
                episodes: db.structure[language][category][serie].season[
                  season
                ].episode.list()
              })
            );
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
