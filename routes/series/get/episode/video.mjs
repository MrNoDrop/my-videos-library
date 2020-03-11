import check from '../../check/get.mjs';
import response from '../../../predefined/responses.mjs';

export default function getEpisodeVideo(router, db) {
  router.get(
    '/shared/:category/:serie/:season/:episode/video/:quality',
    check.preconfiguration,
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.seasons.bind(this, db),
    check.season.bind(this, db),
    check.episodes.bind(this, db),
    check.episode.bind(this, db),
    check.videos.bind(this, db),
    check.video.bind(this, db),
    (req, res) => {
      const { category, serie, season, episode, quality } = req.params;
      try {
        res.sendFile(
          db.structure.shared[category][serie].season[season].episode[
            episode
          ].video[quality].getAbsolutePath()
        );
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
              { index: 7, value: quality },
              [
                'series',
                'shared',
                category,
                serie,
                season,
                episode,
                'video',
                quality
              ],
              null,
              'Could not send video file.',
              error
            )
          );
      }
    }
  );
}
