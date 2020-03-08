import response from '../../predefined/responses.mjs';
import check from '../check/get.mjs';

export default function getEpisode(router, db) {
  router.get(
    '/:language/:category/:serie/:season/:episode',
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.season.bind(this, db),
    check.episode.bind(this, db),
    check.manifest.bind(this, db),
    async (req, res) => {
      const { language, category, serie, season, episode } = req.params;
      res.json(
        response.ok({
          path: ['series', language, category, serie, season, episode],
          manifest: `${db.structure[language][category][serie].season[
            season
          ].episode[episode].toUrl()}/manifest`,
          info: db.structure[language][category][serie].season[season].episode[
            episode
          ].info
            ? await db.structure[language][category][serie].season[
                season
              ].episode[episode].info.read()
            : null,
          subtitles: db.structure.shared[category][serie].season[season]
            .episode[episode].subtitles
            ? (() => {
                const keys = db.structure.shared[category][serie].season[
                  season
                ].episode[episode].subtitles.list();
                const subtitles = {};
                for (let key of keys) {
                  subtitles[key] = db.structure.shared[category][serie].season[
                    season
                  ].episode[episode].subtitles[key].toUrl();
                }
                return Object.keys(subtitles).length > 0 ? subtitles : null;
              })()
            : null,
          thumbnail:
            db.structure.shared[category][serie].season[season].episode[episode]
              .thumbnails &&
            db.structure.shared[category][serie].season[season].episode[
              episode
            ].thumbnails.getRandomPath()
              ? db.structure.shared[category][serie].season[season].episode[
                  episode
                ].thumbnails &&
                db.structure.shared[category][serie].season[season].episode[
                  episode
                ].toUrl() + '/thumbnail'
              : null
        })
      );
    }
  );
}
