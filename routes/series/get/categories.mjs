import response from '../../predefined/responses.mjs';
export default function getCategories(router, db) {
  router.get('/:language', (req, res) => {
    const { language } = req.params;
    if (db.isSupportedLanguage(language)) {
      try {
        const categories = db.structure[language].list();
        res.json(response.ok({ categories }));
      } catch (err) {
        const structuredResponse = response.error.unknown(
          { index: 1, value: language },
          ['series', language]
        );
        console.error(err, structuredResponse);
        res.json(structuredResponse);
      }
    } else {
      res.json(
        response.error.unknownField(
          { index: 1, value: language },
          ['series', language],
          { existing: { languages: db.structure.languages() } },
          'Language does not exist.'
        )
      );
    }
  });
}
