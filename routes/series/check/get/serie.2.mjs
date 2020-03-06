import response from '../../../predefined/responses.mjs';

export default function checkLanguageCategorieSerie(db, req, res, next) {
  const { language, category, serie } = req.params;
  if (db.structure[language][category].list().includes(serie)) {
    next();
  } else {
    res.json(
      response.error.unknownField(
        { index: 3, value: serie },
        ['series', ...req.params],
        {
          existing: {
            series: db.structure[language][category].list()
          }
        },
        'Serie does not exist.'
      )
    );
  }
}
