import response from "../../../predefined/responses.mjs";

export default function checkLanguageCategorySerieSeasons(db, req, res, next) {
  let { language, category, serie } = req.parameters;
  if (db.structure[language][category][serie].season) {
    next();
  } else {
    db.structure[language][category][serie]
      .new("season")
      .then(() => next())
      .catch(async (error) => {
        if (error.type === db.errors.OPERATION_LOCKED) {
          let refresh = 0;
          while (db.operationIsLocked(error.lock.key) && refresh < 10) {
            await sleep(10);
            ++refresh;
          }
        }
        if (db.structure[language][category][serie].season) {
          next();
        } else {
          res
            .status(500)
            .json(
              response.error.unknown(
                { index: 3, value: serie },
                ["series", language, category, serie],
                null,
                "Missing series folder.",
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
