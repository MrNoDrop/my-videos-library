import response from "../../predefined/responses.mjs";
import check from "../check/get.mjs";
import globalCategory from "../../tools/globalCategory.mjs";
import globalSerieTitle from "../../tools/globalTitle.mjs";

export default function getEpisode(router, db) {
  router.get(
    "/:language/:category/:serie/:season/:episode",
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.seasons.bind(this, db),
    check.season.bind(this, db),
    check.episodes.bind(this, db),
    check.episode.bind(this, db),
    check.manifest.bind(this, db),
    async (req, res) => {
      const { language, category, serie, season, episode } = req.params;
      const globCategory = await globalCategory(language, category, db);
      const globSerieTitle = await globalSerieTitle(language, serie, db);

      res.json(
        response.ok({
          path: ["series", language, category, serie, season, episode],
          manifest: `${db.structure[language][category][serie].season[
            season
          ].episode[episode]
            .toUrl()
            .replace("//", "/")}/manifest`,
          info: db.structure[language][category][serie].season[season].episode[
            episode
          ].info_json
            ? await db.structure[language][category][serie].season[
                season
              ].episode[episode].info_json.read()
            : null,
          subtitles: db.structure.shared[globCategory][globSerieTitle].season[
            season
          ].episode[episode].subtitles
            ? (() => {
                const keys =
                  db.structure.shared[globCategory][globSerieTitle].season[
                    season
                  ].episode[episode].subtitles.list();
                const subtitles = {};
                for (let key of keys) {
                  subtitles[key.replace("_srt", "")] = db.structure.shared[
                    globCategory
                  ][globSerieTitle].season[season].episode[episode].subtitles[
                    key
                  ]
                    .toUrl()
                    .replace("//", "/")
                    .replace("shared", language)
                    .replace(globCategory, category)
                    .replace(globSerieTitle, serie);
                }
                return Object.keys(subtitles).length > 0 ? subtitles : null;
              })()
            : null,
          thumbnail:
            db.structure.shared[globCategory][globSerieTitle].season[season]
              .episode[episode].thumbnails &&
            db.structure.shared[globCategory][globSerieTitle].season[
              season
            ].episode[episode].thumbnails.getRandomPath()
              ? db.structure.shared[globCategory][globSerieTitle].season[season]
                  .episode[episode].thumbnails &&
                db.structure.shared[globCategory][globSerieTitle].season[
                  season
                ].episode[episode]
                  .toUrl()
                  .replace("//", "/")
                  .replace("shared", language)
                  .replace(globCategory, category)
                  .replace(globSerieTitle, serie) + "/thumbnail"
              : null,
        })
      );
    }
  );
}
