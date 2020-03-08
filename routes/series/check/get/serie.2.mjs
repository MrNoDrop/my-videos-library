import response from '../../../predefined/responses.mjs';

export default function checkLanguageCategorieSerie(db, req, res, next) {
  let { language, category, serie } = req.parameters;
  if (db.structure[language || 'shared'][category].includes(serie)) {
    next();
  } else {
    res.status(400).json(
      response.error.unknownField(
        { index: 3, value: serie },
        [
          'series',
          ...(language ? [] : ['shared']),
          ...Object.values(req.parameters)
        ],
        {
          existing: {
            series: db.structure[language || 'shared'][category].list()
          }
        },
        'Serie does not exist.'
      )
    );
  }
}
