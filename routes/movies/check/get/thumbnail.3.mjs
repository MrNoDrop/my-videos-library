import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import golbalMovieTitle from "../../../tools/globalTitle.mjs";

export default async function checkLanguageCategoryMovieThumbnail(
  db,
  req,
  res,
  next
) {
  const { language, category, movie } = req.parameters;
  const thumbnails =
    db.structure.shared[await globalCategory(language, category, db)][
      await golbalMovieTitle(language, movie, db)
    ].thumbnails;
  if (thumbnails && thumbnails.list().length >= 1) {
    next();
  } else {
    res
      .status(404)
      .json(
        response.error.missing.file(
          { index: 4, value: "thumbnail" },
          ["movies", language, category, movie, "thumbnail"],
          null,
          "Missing thumbnail file."
        )
      );
  }
}
