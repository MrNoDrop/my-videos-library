import check from '../../check/get.mjs';
import response from '../../../predefined/responses.mjs';

export default function getEpisodeAudios(router, db) {
  router.get(
    '/:language/:category/:serie/:season/:episode/audio',
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.season.bind(this, db),
    check.episode.bind(this, db),
    check.audios.bind(this, db),
    (req, res) => {
      const { language, category, serie, season, episode } = req.params;
      res.json(
        response.ok({
          path: ['series', ...Object.values(req.params), 'audio'],
          qualities: db.structure[language][category][serie].season[
            season
          ].episode[episode].audio.list()
        })
      );
    }
  );
}
