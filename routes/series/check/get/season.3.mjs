import response from '../../../predefined/responses.mjs';

export default function checkLanguageCategorySerieSeason(db, req, res, next) {
  const { language, category, serie, season } = req.params;
  if (db.structure[language][category][serie].season.list().includes(season)) {
    next();
  } else {
    res.json(
      response.error.unknownField(
        { index: 4, value: season },
        ['series', ...Object.values(req.params)],
        {
          existing: {
            seasons: db.structure[language][category][serie].season.list()
          }
        },
        'Season does not exist.'
      )
    );
  }
}
