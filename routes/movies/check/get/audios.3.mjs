import response from "../../../predefined/responses.mjs";

export default function checkLanguageCategoryMovieAudio(db, req, res, next) {
  const { language, category, movie } = req.parameters;

  if (db.structure[language][category][movie].audio) {
    next();
  } else {
    db.structure[language][category][movie]
      .new("audio")
      .then(() => next())
      .catch(async (error) => {
        if (error.type === db.errors.OPERATION_LOCKED) {
          let refresh = 0;
          while (db.operationIsLocked(error.lock.key) && refresh < 10) {
            await sleep(10);
            ++refresh;
          }
        }
        if (db.structure[language][category][movie].audio) {
          next();
        } else {
          res
            .status(500)
            .json(
              response.error.unknown(
                { index: 4, value: "audio" },
                ["movies", ...Object.values(req.parameters), "audio"],
                null,
                "Missing audio folder.",
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
