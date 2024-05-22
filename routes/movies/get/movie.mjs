import response from "../../predefined/responses.mjs";
import globalCategory from "../../tools/globalCategory.mjs";
import check from "../check/get.mjs";

export default function getMovie(router, db) {
  router.get(
    "/:language/:category/:movie",
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.movie.bind(this, db),
    check.manifest.bind(this, db),
    async (req, res) => {
      const { language, category, movie } = req.params;
      const sharedCategory = await globalCategory(language, category, db);
      res.json(
        response.ok({
          path: ["movies", language, category, movie],
          manifest: `${db.structure[language][category][
            movie
          ].toUrl()}/manifest`,
          info: db.structure[language][category][movie].info
            ? await db.structure[language][category][movie].info.read()
            : null,
          subtitles: db.structure.shared[sharedCategory][movie].subtitles
            ? (() => {
                const keys =
                  db.structure.shared[sharedCategory][movie].subtitles.list();
                const subtitles = {};
                for (let key of keys) {
                  subtitles[key] =
                    db.structure.shared[sharedCategory][movie].subtitles[
                      key
                    ].toUrl();
                }
                return Object.keys(subtitles).length > 0 ? subtitles : null;
              })()
            : null,
          thumbnail:
            db.structure.shared[sharedCategory][movie].thumbnails &&
            db.structure.shared[sharedCategory][
              movie
            ].thumbnails.getRandomPath()
              ? db.structure.shared[sharedCategory][movie].thumbnails &&
                db.structure.shared[sharedCategory][movie].toUrl() +
                  "/thumbnail"
              : null,
        })
      );
    }
  );
}
