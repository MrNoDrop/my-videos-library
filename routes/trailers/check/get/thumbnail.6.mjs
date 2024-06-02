import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import golbalTrailerTitle from "../../../tools/globalTitle.mjs";

export default async function checkLanguageCategoryTrailerThumbnail(
  moviesDB,
  seriesDB,
  req,
  res,
  next
) {
  const { choosenTrailersDB, language, category, trailer } = req.parameters;
  let trailerDB;
  switch (choosenTrailersDB) {
    case "series":
      trailerDB = seriesDB;
      break;
    case "movies":
      trailerDB = moviesDB;
      break;
    default:
      throw new Error("check.choosenTrailersDB failed");
  }
  const thumbnails =
    trailerDB.structure.shared[
      await globalCategory(language, category, trailerDB)
    ][await golbalTrailerTitle(language, trailer, trailerDB)].trailer
      ?.thumbnails;
  if (thumbnails && thumbnails.list().length >= 1) {
    next();
  } else {
    res
      .status(404)
      .json(
        response.error.missing.file(
          { index: 6, value: "thumbnail" },
          [
            "trailers",
            "trailer",
            choosenTrailersDB,
            language,
            category,
            trailer,
            "thumbnail",
          ],
          null,
          "Missing thumbnail file."
        )
      );
  }
}
