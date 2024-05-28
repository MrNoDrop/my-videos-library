import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import globalSerieTitle from "../../../tools/globalTitle.mjs";

export default async function checkLanguageCategorySerieSeasonEpisodeThumbnail(
  db,
  req,
  res,
  next
) {
  const { language, category, serie, season, episode } = req.parameters;
  const globCategory = await globalCategory(language, category, db);
  const globSerieTitle = await globalSerieTitle(language, serie, db);

  const thumbnails =
    db.structure.shared[globCategory][globSerieTitle].season[season].episode[
      episode
    ].thumbnails;
  if (thumbnails && thumbnails.list().length >= 1) {
    next();
  } else {
    res
      .status(404)
      .json(
        response.error.missing.file(
          { index: 6, value: "thumbnail" },
          ["series", language, category, serie, season, episode, "thumbnail"],
          null,
          "Missing thumbnail file."
        )
      );
  }
}
