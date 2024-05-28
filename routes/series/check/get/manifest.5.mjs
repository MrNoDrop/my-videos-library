import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import globalSerieTitle from "../../../tools/globalTitle.mjs";

export default async function checkLanguageCategorySerieSeasonEpisodeManifest(
  db,
  req,
  res,
  next
) {
  const { language, category, serie, season, episode } = req.parameters;
  const globCategory = await globalCategory(language, category, db);
  const globSerieTitle = await globalSerieTitle(language, serie, db);
  if (
    db.structure[language][category][serie].season[season].episode[episode]
      .manifest_mpd
  ) {
    next();
  } else {
    res.status(404).json(
      response.error.missing.file(
        { index: 6, value: "manifest" },
        ["series", language, category, serie, season, episode, "manifest"],
        {
          path: ["series", language, category, serie, season, episode],
          manifest: null,
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
                console.log(subtitles);
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
        },
        "Missing manifest file."
      )
    );
  }
}
