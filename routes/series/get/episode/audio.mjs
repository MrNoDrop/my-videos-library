import check from '../../check/get.mjs';
import response from '../../../predefined/responses.mjs';

export default function getEpisodeAudio(router, db) {
  router.get(
    '/:language/:category/:serie/:season/:episode/audio/:quality',
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.season.bind(this, db),
    check.episode.bind(this, db),
    check.audios.bind(this, db),
    check.audio.bind(this, db),
    (req, res) => {
      const {
        language,
        category,
        serie,
        season,
        episode,
        quality
      } = req.params;
      try {
        res.sendFile(
          db.structure[language][category][serie].season[season].episode[
            episode
          ].audio[quality].getAbsolutePath()
        );
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
              { index: 7, value: quality },
              [
                'series',
                language,
                category,
                serie,
                season,
                episode,
                'audio',
                quality
              ],
              null,
              'Could not send audio file.',
              error
            )
          );
      }
    }
  );
}
