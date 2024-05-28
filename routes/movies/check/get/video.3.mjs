import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import globalMovieTitle from "../../../tools/globalTitle.mjs";

export default async function checkLanguageCategoryMovieVideoQuality(
  db,
  req,
  res,
  next
) {
  const { language, category, movie, quality } = req.parameters;
  const globCategory = await globalCategory(language, category, db);
  const globMovieTitle = await globalMovieTitle(language, movie, db);
  if (
    db.structure.shared[globCategory][globMovieTitle].video.includes(
      `${quality}_mp4`
    )
  ) {
    next();
  } else {
    res.status(404).json(
      response.error.missing.file(
        { index: 5, value: quality },
        ["movies", "shared", category, movie, "video", quality],
        {
          existing: {
            qualities: db.structure.shared[globCategory][globMovieTitle].video
              .list()
              .map((quality) => quality.replace("_mp4", "")),
          },
        },
        "Missing video file."
      )
    );
  }
}
