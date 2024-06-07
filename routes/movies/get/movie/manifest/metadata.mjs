import check from "../../../check/get.mjs";
import response from "../../../../predefined/responses.mjs";
import globalCategory from "../../../../tools/globalCategory.mjs";
import golbalMovieTitle from "../../../../tools/globalTitle.mjs";

export default function getMovieManifestMetadata(router, db) {
  router.get(
    "/:language/:category/:movie/manifest/metadata",
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.movie.bind(this, db),
    check.simple.manifest.bind(this, db),
    check.manifestMetadata.bind(this, db),
    async (req, res) => {
      const { language, category, movie } = req.params;
      const globCategory = await globalCategory(language, category, db);
      const globMovieTitle = await golbalMovieTitle(language, movie, db);
      res.json(
        response.ok({
          path: ["movies", language, category, movie, "manifest", "metadata"],
          metadata: await db.structure.shared[globCategory][
            globMovieTitle
          ].manifest.metadata_json.read(),
        })
      );
    }
  );
}
