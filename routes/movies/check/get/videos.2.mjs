import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";

export default async function checkLanguageCategoryMovieVideo(
  db,
  req,
  res,
  next
) {
  const { language, category, movie } = req.parameters;
  const globCategory = await globalCategory(language, category, db);

  if (db.structure.shared[globCategory][movie].video) {
    next();
  } else {
    db.structure.shared[globCategory][movie]
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
        if (db.structure.shared[globCategory][movie].video) {
          next();
        } else {
          res
            .status(500)
            .json(
              response.error.unknown(
                { index: 4, value: "audio" },
                ["movies", "shared", ...Object.values(req.parameters), "video"],
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
