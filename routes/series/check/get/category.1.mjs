import response from '../../../predefined/responses.mjs';

export default function checkLanguageCategory(db, req, res, next) {
  const { language, category } = req.params;
  if (db.structure[language || 'shared'].includes(category)) {
    next();
  } else {
    res.status(400).json(
      response.error.unknownField(
        { index: 2, value: category },
        [
          'series',
          ...(language ? [] : ['shared']),
          ...Object.values(req.params)
        ],
        {
          existing: { categories: db.structure[language || 'shared'].list() }
        },
        'Category does not exist.'
      )
    );
  }
}
