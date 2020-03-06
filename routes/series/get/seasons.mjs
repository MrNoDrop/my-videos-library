import response from '../../predefined/responses.mjs';
import check from '../check/get.mjs';

export default function getSeasons(router, db) {
  router.get(
    '/:language/:category/:serie',
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.serie.bind(this, db),
    (req, res) => {
      const { language, category, serie } = req.params;
      res.json(
        response.ok({
          path: ['series', language, category, serie],
          seasons: db.structure[language][category][serie].season.list()
        })
      );
    }
  );
}
