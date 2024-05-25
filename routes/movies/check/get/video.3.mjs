import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import golbalMovieTitle from "../../../tools/globalMovieTitle.mjs";

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
    db.structure.shared[globCategory][globMovieTitle].video.includes(quality)
  ) {
    next();
  } else {
    res.status(404).json(
      response.error.missing.file(
        { index: 5, value: quality },
        ["movies", "shared", category, movie, "video", quality],
        {
          existing: {
            qualities:
              db.structure.shared[globCategory][globMovieTitle].video.list(),
          },
        },
        "Missing video file."
      )
    );
  }
}
