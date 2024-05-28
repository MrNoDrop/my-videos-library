import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import globalSerieTitle from "../../../tools/globalTitle.mjs";

export default async function checkLanguageCategorySerieSeasonEpisodeVideoQuality(
  db,
  req,
  res,
  next
) {
  const { language, category, serie, season, episode, quality } =
    req.parameters;
  const globCategory = await globalCategory(language, category, db);
  const globSerieTitle = await globalSerieTitle(language, serie, db);

  if (
    db.structure.shared[globCategory][globSerieTitle].season[season].episode[
      episode
    ].video.includes(quality)
  ) {
    next();
  } else {
    res.status(404).json(
      response.error.missing.file(
        { index: 7, value: quality },
        [
          "series",
          language,
          category,
          serie,
          season,
          episode,
          "video",
          quality,
        ],
        {
          existing: {
            qualities:
              db.structure.shared[globCategory][globSerieTitle].season[
                season
              ].episode[episode].video.list(),
          },
        },
        "Missing video file."
      )
    );
  }
}
