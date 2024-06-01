import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import golbalMovieTitle from "../../../tools/globalTitle.mjs";

export default async function checkLanguageCategoryTrailerVideo(
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
      break;
    default:
      throw new Error("Missing check.choosenTrailersDB in path");
  }

  const globCategory = await globalCategory(language, category, trailersDB);
  const globMovieTitle = await golbalMovieTitle(language, trailer, trailersDB);

  if (trailersDB.structure.shared[globCategory][globMovieTitle].trailer.video) {
    next();
  } else {
    trailersDB.structure.shared[globCategory][globMovieTitle].trailer
      .new("video")
      .then(() => next())
      .catch(async (error) => {
        if (error.type === trailersDB.errors.OPERATION_LOCKED) {
          let refresh = 0;
          while (trailersDB.operationIsLocked(error.lock.key) && refresh < 10) {
            await sleep(10);
            ++refresh;
          }
        }
        if (
          trailersDB.structure.shared[globCategory][globMovieTitle].trailer
            .video
        ) {
          next();
        } else {
          res
            .status(500)
            .json(
              response.error.unknown(
                { index: 6, value: "video" },
                [
                  "trailers",
                  "trailer",
                  choosenTrailersDB,
                  language,
                  category,
                  trailer,
                  "video",
                ],
                null,
                "Missing video folder.",
                error.type !== trailersDB.errors.OPERATION_LOCKED && error
              )
            );
        }
      });
  }
}

function sleep(millis) {
  return new Promise((resolve) => setTimeout(() => resolve(), millis));
}
