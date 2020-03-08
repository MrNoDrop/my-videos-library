import check from '../../check/get.mjs';
import response from '../../../predefined/responses.mjs';

export default function getEpisodeSubtitle(router, db) {
  router.get(
    '/shared/:category/:serie/:season/:episode/subtitles/:subtitle',
    check.preconfiguration,
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.season.bind(this, db),
    check.episode.bind(this, db),
    check.subtitles.bind(this, db),
    check.subtitle.bind(this, db),
    (req, res) => {
      const { category, serie, season, episode, subtitle } = req.params;
      try {
        res.sendFile(
          db.structure.shared[category][serie].season[season].episode[
            episode
          ].subtitles[subtitle].getAbsolutePath()
        );
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
              { index: 7, value: subtitle },
              [
                'series',
                'shared',
                category,
                serie,
                season,
                episode,
                'subtitles',
                quality
              ],
              null,
              'Could not send subtitle file.',
              error
            )
          );
      }
    }
  );
}
