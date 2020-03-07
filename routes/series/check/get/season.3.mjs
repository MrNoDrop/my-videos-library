import response from '../../../predefined/responses.mjs';

export default function checkLanguageCategorySerieSeason(db, req, res, next) {
  const { language, category, serie, season } = req.params;
  if (
    db.structure[language || 'shared'][category][serie].season.includes(season)
  ) {
    next();
  } else {
    res.status(400).json(
      response.error.unknownField(
        { index: 4, value: season },
        [
          'series',
          ...(language ? [] : ['shared']),
          ...Object.values(req.params)
        ],
        {
          existing: {
            seasons: db.structure[language || 'shared'][category][
              serie
            ].season.list()
          }
        },
        'Season does not exist.'
      )
    );
  }
}
