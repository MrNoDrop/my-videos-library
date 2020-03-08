import response from '../../predefined/responses.mjs';
import check from '../check/get.mjs';

export default function getSeasons(router, db) {
  router.get(
    '/:language/:category/:serie',
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.serie.bind(this, db),
    (req, res) => {
      const { language, category, serie } = req.params;
      res.json(
        response.ok({
          path: ['series', language, category, serie],
          cover: [
            'series',
            'shared',
            category,
            serie,
            '[season]',
            'cover',
            '[orientation]'
          ],
          orientation: { horizontal: 'horizontal', vertical: 'vertical' },
          seasons: db.structure[language][category][serie].season.list()
        })
      );
    }
  );
}
