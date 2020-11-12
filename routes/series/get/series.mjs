import response from '../../predefined/responses.mjs';
import check from '../check/get.mjs';

export default function getSeries(router, db) {
  router.get(
    '/:language/:category',
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    (req, res) => {
      const { language, category } = req.params;
      res.json(
        response.ok({
          path: ['series', language, category],
          cover: [
            'series',
            'shared',
            category,
            '[serie]',
            'cover',
            '[orientation]'
          ],
          orientation: { horizontal: 'horizontal', vertical: 'vertical' },
          series: db.structure[language][category].list()
        })
      );
    }
  );
}
