import response from "../../../../predefined/responses.mjs";

export default async function checkLanguageCategoryTrailerManifest(
  moviesDB,
  seriesDB,
  req,
  res,
  next
) {
  const { choosenTrailersDB, language, category, trailer } = req.parameters;
  let trailersDB = undefined;
  switch (choosenTrailersDB) {
    case "series":
      trailersDB = seriesDB;
      break;
    case "movies":
      trailersDB = moviesDB;
    default:
      throw new Error("Missing check.choosenTrailersDB in path");
  }
  if (trailersDB.structure[language][category][trailer].trailer.manifest_mpd) {
    next();
  } else {
    res
      .status(404)
      .json(
        response.error.missing.file(
          { index: 6, value: "manifest" },
          [
            "trailers",
            "trailer",
            choosenTrailersDB,
            language,
            category,
            trailer,
            "manifest",
          ],
          null,
          "Missing manifest file."
        )
      );
  }
}
