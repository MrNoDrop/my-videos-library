import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import globalSerieTitle from "../../../tools/globalTitle.mjs";

export default async function checkLanguageCategorySerieSeasonEpisodeVideo(
  db,
  req,
  res,
  next
) {
  const { language, category, serie, season, episode } = req.parameters;
  const globCategory = await globalCategory(language, category, db);
  const globSerieTitle = await globalSerieTitle(language, serie, db);

  if (
    db.structure.shared[globCategory][globSerieTitle].season[season].episode[
      episode
    ].video
  ) {
    next();
  } else {
    db.structure.shared[globCategory][globSerieTitle].season[season].episode[
      episode
    ]
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
        if (
          db.structure.shared[globCategory][globSerieTitle].season[season]
            .episode[episode].video
        ) {
          next();
        } else {
          res
            .status(500)
            .json(
              response.error.unknown(
                { index: 6, value: "audio" },
                ["series", language, category, serie, season, episode, "video"],
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
