import response from '../../predefined/responses.mjs';
import check from '../check/get.mjs';

export default function getCategories(router, db) {
  router.get(
    '/:language',
    check.preconfiguration,
    check.language.bind(this, db),
    (req, res) => {
      const { language } = req.params;
      const categories = db.structure[language].list();
      res.json(response.ok({ path: ['series', language], categories }));
    }
  );
}
