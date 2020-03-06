import response from '../../predefined/responses.mjs';

export default function getCategory(router, db) {
  router.get('/:language/:category', (req, res) => {
    const { language, category } = req.params;
    if (db.isSupportedLanguage(language)) {
      if (db.structure[language].list().includes(category)) {
        res.json(
          response.ok({
            path: ['series', language, category],
            series: db.structure[language][category].list()
          })
        );
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
  });
}
