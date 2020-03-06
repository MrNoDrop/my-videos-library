import response from '../../predefined/responses.mjs';

export default function getSeasons(router, db) {
  router.get('/:language/:category/:serie', (req, res) => {
    const { language, category, serie } = req.params;
    if (db.isSupportedLanguage(language)) {
      if (db.structure[language].list().includes(category)) {
        if (db.structure[language][category].list().includes(serie)) {
          res.json(
            response.ok({
              seasons: db.structure[language][category][serie].season.list()
            })
          );
        } else {
          res.json(
            response.error.unknownField(
              { index: 3, value: serie },
              ['series', language, category, serie],
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
            ['series', language, category],
            { existing: { categories: db.structure[language].list() } },
            'Category does not exist.'
          )
        );
      }
    } else {
      res.json(
        response.error.unknownField(
          { index: 1, value: language },
          ['series', language, category],
          { existing: { languages: db.structure.languages() } },
          'Language does not exist.'
        )
      );
    }
    // if (!db.structure[language][category]) {
    //   res.json({
    //     error: `category missing`,
    //     category,
    //     categories: db.structure.list()
    //   });
    //   return;
    // }
    // if (!db.structure[language][category][serie]) {
    //   res.json({
    //     error: `serie missing`,
    //     serie,
    //     series: db.structure[language][category].list()
    //   });
    //   return;
    // }
    // try {
    //   res.json(db.structure[language][category][serie].season.list());
    // } catch (err) {
    //   console.error(err);
    // }
  });
}
