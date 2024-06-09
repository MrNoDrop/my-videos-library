import response from "../../../../predefined/responses.mjs";
import globalCategory from "../../../../tools/globalCategory.mjs";
import golbalSerieTitle from "../../../../tools/globalTitle.mjs";

export default async function checkManifestMetadata(db, req, res, next) {
  const { language, category, serie, season, episode } = req.parameters;

  const globCategory = await globalCategory(language, category, db);
  const globSerieTitle = await golbalSerieTitle(language, serie, db);
  if (
    db.structure.shared[globCategory][globSerieTitle].season[season].episode[
      episode
    ].manifest?.metadata_json
  ) {
    next();
  } else {
    try {
      if (
        !db.structure.shared[globCategory][globSerieTitle].season[season]
          .episode[episode].manifest
      ) {
        await db.structure.shared[globCategory][globSerieTitle].season[
          season
        ].episode[episode].new("manifest");
      }
      if (
        !db.structure.shared[globCategory][globSerieTitle].season[season]
          .episode[episode].manifest.metadata_json
      ) {
        await db.structure.shared[globCategory][globSerieTitle].season[
          season
        ].episode[episode].manifest.new("metadata.json", { credits: null });
      }
    } catch (error) {
      if (error.type === db.errors.OPERATION_LOCKED) {
        let refresh = 0;
        while (db.operationIsLocked(error.lock.key) && refresh < 10) {
          await sleep(10);
          ++refresh;
        }
      }
    }
    if (
      db.structure.shared[globCategory][globSerieTitle].season[season].episode[
        episode
      ].manifest?.metadata_json
    ) {
      next();
    } else {
      if (
        !db.structure.shared[globCategory][globSerieTitle].season[season]
          .episode[episode].manifest
      ) {
        res
          .status(500)
          .json(
            response.error.unknown(
              { index: 6, value: "manifest" },
              [
                "series",
                language,
                category,
                serie,
                season,
                episode,
                "manifest",
                "metadata",
              ],
              null,
              "Missing manifest folder.",
              error.type !== db.errors.OPERATION_LOCKED && error
            )
          );
      }
      if (
        !db.structure.shared[globCategory][globSerieTitle].season[season]
          .episode[episode].manifest?.metadata_json
      ) {
        res
          .status(404)
          .json(
            response.error.missing.file(
              { index: 7, value: "metadata" },
              [
                "series",
                language,
                category,
                serie,
                season,
                episode,
                "manifest",
                "metadata",
              ],
              null,
              "Missing metadata file."
            )
          );
      }
    }
  }
}

function sleep(millis) {
  return new Promise((resolve) => setTimeout(() => resolve(), millis));
}
