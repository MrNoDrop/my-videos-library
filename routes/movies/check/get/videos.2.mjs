import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import golbalMovieTitle from "../../../tools/globalTitle.mjs";

export default async function checkLanguageCategoryMovieVideo(
  db,
  req,
  res,
  next
) {
  const { language, category, movie } = req.parameters;
  const globCategory = await globalCategory(language, category, db);
  const globMovieTitle = await golbalMovieTitle(language, movie, db);

  if (db.structure.shared[globCategory][globMovieTitle].video) {
    next();
  } else {
    db.structure.shared[globCategory][globMovieTitle]
      .new("video")
      .then(() => next())
      .catch(async (error) => {
        if (error.type === db.errors.OPERATION_LOCKED) {
          let refresh = 0;
          while (db.operationIsLocked(error.lock.key) && refresh < 10) {
            await sleep(10);
            ++refresh;
          }
        }
        if (db.structure.shared[globCategory][globMovieTitle].video) {
          next();
        } else {
          res
            .status(500)
            .json(
              response.error.unknown(
                { index: 4, value: "video" },
                ["movies", language, category, movie, "video"],
                null,
                "Missing video folder.",
                error.type !== db.errors.OPERATION_LOCKED && error
              )
            );
        }
      });
  }
}

function sleep(millis) {
  return new Promise((resolve) => setTimeout(() => resolve(), millis));
}
