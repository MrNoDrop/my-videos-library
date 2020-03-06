import response from '../../../predefined/responses.mjs';

export default function checkGetCategories(db, req, res, next) {
  const { language } = req.params;
  if (db.isSupportedLanguage(language)) {
    next();
  } else {
    res.json(
      response.error.unknownField(
        { index: 1, value: language },
        ['series', ...req.params],
        { existing: { languages: db.structure.languages() } },
        'Language does not exist.'
      )
    );
  }
}
