import check from '../../check/get.mjs';
import response from '../../../predefined/responses.mjs';

export default function getEpisodeSubtitle(router, db) {
  router.get(
    '/:language/:category/:serie/:season/:episode/manifest',
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.season.bind(this, db),
    check.episode.bind(this, db),
    check.simple.manifest.bind(this, db),
    (req, res) => {
      const { language, category, serie, season, episode } = req.params;
      try {
        res.sendFile(
          db.structure[language][category][serie].season[season].episode[
            episode
          ].manifest.getAbsolutePath()
        );
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
              { index: 6, value: 'manifest' },
              ['series', ...Object.values(req.params), 'manifest'],
              null,
              'Could not send manifest file.',
              error
            )
          );
      }
    }
  );
}
