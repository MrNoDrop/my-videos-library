import response from '../../predefined/responses.mjs';
import check from '../check/get.mjs';

export default function getEpisodes(router, db) {
  router.get(
    '/:language/:category/:serie/:season',
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.seasons.bind(this, db),
    check.season.bind(this, db),
    (req, res) => {
      const { language, category, serie, season } = req.params;
      res.json(
        response.ok({
          path: ['series', language, category, serie, season],
          cover: [
            'series',
            'shared',
            category,
            serie,
            season,
            '[episode]',
            'cover',
            '[orientation]'
          ],
          orientation: { horizontal: 'horizontal', vertical: 'vertical' },
          episodes: db.structure[language][category][serie].season[
            season
          ].episode.list()
        })
      );
    }
  );
}
