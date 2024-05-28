import response from "../../predefined/responses.mjs";
import globalCategory from "../../tools/globalCategory.mjs";
import golbalMovieTitle from "../../tools/globalTitle.mjs";
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
      const globCategory = await globalCategory(language, category, db);
      const globMovieTitle = await golbalMovieTitle(language, movie, db);
      res.json(
        response.ok({
          path: ["movies", language, category, movie],
          manifest: `${db.structure[language][category][movie]
            .toUrl()
            .replace("shared", language)}/manifest`,
          info: db.structure[language][category][movie].info
            ? await db.structure[language][category][movie].info.read()
            : null,
          subtitles: db.structure.shared[globCategory][globMovieTitle].subtitles
            ? (() => {
                const keys =
                  db.structure.shared[globCategory][
                    globMovieTitle
                  ].subtitles.list();
                const subtitles = {};
                for (let key of keys) {
                  subtitles[key] = db.structure.shared[globCategory][
                    globMovieTitle
                  ].subtitles[key]
                    .toUrl()
                    .replace("shared", language)
                    .replace(globCategory, category)
                    .replace(globMovieTitle, movie);
                }
                return Object.keys(subtitles).length > 0 ? subtitles : null;
              })()
            : null,
          thumbnail:
            db.structure.shared[globCategory][globMovieTitle].thumbnails &&
            db.structure.shared[globCategory][
              globMovieTitle
            ].thumbnails.getRandomPath()
              ? db.structure.shared[globCategory][globMovieTitle].thumbnails &&
                db.structure.shared[globCategory][globMovieTitle]
                  .toUrl()
                  .replace("shared", language)
                  .replace(globCategory, category)
                  .replace(globMovieTitle, movie) + "/thumbnail"
              : null,
        })
      );
    }
  );
}
