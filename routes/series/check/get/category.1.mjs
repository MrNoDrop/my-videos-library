import response from '../../../predefined/responses.mjs';

export default function checkLanguageCategory(db, req, res, next) {
  const { language, category } = req.params;
  if (db.structure[language].list().includes(category)) {
    next();
  } else {
    res.json(
      response.error.unknownField(
        { index: 2, value: category },
        ['series', ...Object.values(req.params)],
        { existing: { categories: db.structure[language].list() } },
        'Category does not exist.'
      )
    );
  }
}
