import response from "../../../predefined/responses.mjs";

export default function checkLanguageCategoryTrailerAudio(
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
      throw new Error("Missing check.choosenTrailersDB in path");
  }

  if (trailerDB.structure[language][category][trailer].trailer.audio) {
    next();
  } else {
    trailerDB.structure[language][category][trailer].trailer
      .new("audio")
      .then(() => next())
      .catch(async (error) => {
        if (error.type === trailerDB.errors.OPERATION_LOCKED) {
          let refresh = 0;
          while (trailerDB.operationIsLocked(error.lock.key) && refresh < 10) {
            await sleep(10);
            ++refresh;
          }
        }
        if (trailerDB.structure[language][category][trailer].trailer.audio) {
          next();
        } else {
          res
            .status(500)
            .json(
              response.error.unknown(
                { index: 6, value: "audio" },
                [
                  "trailers",
                  "trailer",
                  choosenTrailersDB,
                  language,
                  category,
                  trailer,
                  "audio",
                ],
                null,
                "Missing audio folder.",
                error.type !== trailerDB.errors.OPERATION_LOCKED && error
              )
            );
        }
      });
  }
}

function sleep(millis) {
  return new Promise((resolve) => setTimeout(() => resolve(), millis));
}
