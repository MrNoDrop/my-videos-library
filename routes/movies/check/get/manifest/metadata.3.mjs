import response from "../../../../predefined/responses.mjs";
import globalCategory from "../../../../tools/globalCategory.mjs";
import golbalMovieTitle from "../../../../tools/globalTitle.mjs";

export default async function checkManifestMetadata(db, req, res, next) {
  const { language, category, movie } = req.parameters;

  const globCategory = await globalCategory(language, category, db);
  const globMovieTitle = await golbalMovieTitle(language, movie, db);
  if (
    db.structure.shared[globCategory][globMovieTitle].manifest?.metadata_json
  ) {
    next();
  } else {
    try {
      if (!db.structure.shared[globCategory][globMovieTitle].manifest) {
        await db.structure.shared[globCategory][globMovieTitle].new("manifest");
      }
      if (
        !db.structure.shared[globCategory][globMovieTitle].manifest
          .metadata_json
      ) {
        await db.structure.shared[globCategory][globMovieTitle].manifest.new(
          "metadata.json",
          { credits: null }
        );
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
      db.structure.shared[globCategory][globMovieTitle].manifest?.metadata_json
    ) {
      next();
    } else {
      if (!db.structure.shared[globCategory][globMovieTitle].manifest) {
        res
          .status(500)
          .json(
            response.error.unknown(
              { index: 4, value: "manifest" },
              ["movies", language, category, movie, "manifest", "metadata"],
              null,
              "Missing manifest folder.",
              error.type !== db.errors.OPERATION_LOCKED && error
            )
          );
      }
      if (
        !db.structure.shared[globCategory][globMovieTitle].manifest
          ?.metadata_json
      ) {
        res
          .status(404)
          .json(
            response.error.missing.file(
              { index: 5, value: "metadata" },
              ["movies", language, category, movie, "manifest", "metadata"],
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
