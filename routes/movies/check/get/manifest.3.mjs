import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import golbalMovieTitle from "../../../tools/globalTitle.mjs";

export default async function checkLanguageCategoryMovieManifest(
  db,
  req,
  res,
  next
) {
  const { language, category, movie } = req.parameters;
  if (db.structure[language][category][movie].manifest_mpd) {
    next();
  } else {
    const globCategory = await globalCategory(language, category, db);
    const globMovieTitle = await golbalMovieTitle(language, movie, db);
    res.status(404).json(
      response.error.missing.file(
        { index: 4, value: "manifest" },
        ["movies", language, category, movie, "manifest"],
        {
          path: ["movies", language, category, movie],
          manifest: null,
          info: db.structure[language][category][movie].info_json
            ? await db.structure[language][category][movie].info_json.read()
            : null,
          subtitles: db.structure.shared[globCategory][globMovieTitle].subtitles
            ? await (async () => {
                const keys =
                  db.structure.shared[globCategory][
                    globMovieTitle
                  ].subtitles.list();
                const subtitles = {};
                for (let key of keys) {
                  subtitles[key.replace("_srt", "")] = db.structure.shared[
                    globCategory
                  ][globMovieTitle].subtitles[key]
                    .toUrl()
                    .replace("//", "/")
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
                  .replace("//", "/")
                  .replace("shared", language)
                  .replace(globCategory, category)
                  .replace(globMovieTitle, movie) + "/thumbnail"
              : null,
        },
        "Missing manifest file."
      )
    );
  }
}
