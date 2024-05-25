import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import golbalMovieTitle from "../../../tools/globalTitle.mjs";

export default async function checkLanguageCategoryMovieSubtitlesSubtitle(
  db,
  req,
  res,
  next
) {
  const { language, category, movie, subtitle } = req.parameters;
  const globCategory = await globalCategory(language, category, db);
  const globMovieTitle = await golbalMovieTitle(language, movie, db);
  if (
    db.structure.shared[globCategory][globMovieTitle].subtitles.includes(
      subtitle
    )
  ) {
    next();
  } else {
    res.status(404).json(
      response.error.missing.file(
        { index: 5, value: subtitle },
        ["movies", "shared", category, movie, "subtitles", subtitle],
        {
          existing: {
            subtitles:
              db.structure.shared[globCategory][
                globMovieTitle
              ].subtitles.list(),
          },
        },
        "Missing subtitle file."
      )
    );
  }
}
