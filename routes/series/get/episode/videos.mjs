import check from '../../check/get.mjs';
import response from '../../../predefined/responses.mjs';

export default function getEpisodeVideos(router, db) {
  router.get(
    '/shared/:category/:serie/:season/:episode/video',
    check.preconfiguration,
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.season.bind(this, db),
    check.episode.bind(this, db),
    check.videos.bind(this, db),
    (req, res) => {
      const { category, serie, season, episode } = req.params;
      res.json(
        response.ok({
          path: ['series', 'shared', ...Object.values(req.params), 'video'],
          qualities: db.structure.shared[category][serie].season[
            season
          ].episode[episode].video.list()
        })
      );
    }
  );
}
