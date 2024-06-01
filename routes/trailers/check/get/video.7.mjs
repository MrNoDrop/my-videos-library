import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import globalTrailerTitle from "../../../tools/globalTitle.mjs";

export default async function checkLanguageCategoryTrailerVideoQuality(
  moviesDB,
  seriesDB,
  req,
  res,
  next
) {
  const { choosenTrailersDB, language, category, trailer, quality } =
    req.parameters;
  let trailerDB;
  switch (choosenTrailersDB) {
    case "series":
      trailerDB = seriesDB;
      break;
    case "movies":
      trailerDB = moviesDB;
      break;
    default:
      throw new Error("Missing check.choosenTrailersDB in path");
  }
  const globCategory = await globalCategory(language, category, trailerDB);
  const globTrailerTitle = await globalTrailerTitle(
    language,
    trailer,
    trailerDB
  );
  if (
    trailerDB.structure.shared[globCategory][
      globTrailerTitle
    ].trailer.video.includes(`${quality}_mp4`)
  ) {
    next();
  } else {
    res.status(404).json(
      response.error.missing.file(
        { index: 7, value: quality },
        [
          "trailers",
          "trailer",
          choosenTrailersDB,
          language,
          category,
          trailer,
          "video",
          quality,
        ],
        {
          existing: {
            qualities: trailerDB.structure.shared[globCategory][
              globTrailerTitle
            ].trailer.video
              .list()
              .map((quality) => quality.replace("_mp4", "")),
          },
        },
        "Missing video file."
      )
    );
  }
}
