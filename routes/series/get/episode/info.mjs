export default function getEpisodeInfo(router, db) {
  router.get(
    '/:language/:category/:serie/:season/:episode/info',
    async (req, res, next) => {
      const { language, category, serie, season, episode } = req.params;
      if (db.isSupportedLanguage(language)) {
        next();
      } else {
        res.json(
          response.error.unknownField(
            { index: 1, value: language },
            ['series', language, category, serie, season, episode],
            { existing: { languages: db.structure.languages() } },
            'Language does not exist.'
          )
        );
      }
    },
    function(req, res, next) {
      const { language, category, serie, season, episode } = req.params;
      if (db.structure[language].list().includes(category)) {
        next();
      } else {
        res.json(
          response.error.unknownField(
            { index: 2, value: category },
            ['series', language, category, serie, season, episode],
            { existing: { categories: db.structure[language].list() } },
            'Category does not exist.'
          )
        );
      }
    },
    function(req, res, next) {
      const { language, category, serie, season, episode } = req.params;
      if (db.structure[language][category].list().includes(serie)) {
        next();
      } else {
        res.json(
          response.error.unknownField(
            { index: 3, value: serie },
            ['series', language, category, serie, season, episode],
            {
              existing: {
                series: db.structure[language][category].list()
              }
            },
            'Serie does not exist.'
          )
        );
      }
    },
    function(req, res, next) {
      const { language, category, serie, season, episode } = req.params;
      if (
        db.structure[language][category][serie].season.list().includes(season)
      ) {
        next();
      } else {
        res.json(
          response.error.unknownField(
            { index: 4, value: season },
            ['series', language, category, serie, season, episode],
            {
              existing: {
                seasons: db.structure[language][category][serie].season.list()
              }
            },
            'Season does not exist.'
          )
        );
      }
    },
    function(req, res, next) {
      const { language, category, serie, season, episode } = req.params;
      if (
        db.structure[language][category][serie].season[season].episode
          .list()
          .includes(episode)
      ) {
        next();
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
    },
    function(req, res) {
      res.send('ok');
    }
  );
}
