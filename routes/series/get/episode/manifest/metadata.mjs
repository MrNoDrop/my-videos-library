import check from "../../../check/get.mjs";
import response from "../../../../predefined/responses.mjs";
import globalCategory from "../../../../tools/globalCategory.mjs";
import golbalSerieTitle from "../../../../tools/globalTitle.mjs";

export default function getSerieManifestMetadata(router, db) {
  router.get(
    "/:language/:category/:serie/:season/:episode/manifest/metadata",
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.seasons.bind(this, db),
    check.season.bind(this, db),
    check.episodes.bind(this, db),
    check.episode.bind(this, db),
    check.simple.manifest.bind(this, db),
    check.manifestMetadata.bind(this, db),
    async (req, res) => {
      const { language, category, serie, season, episode } = req.params;
      const globCategory = await globalCategory(language, category, db);
      const globSerieTitle = await golbalSerieTitle(language, serie, db);
      res.json(
        response.ok({
          path: [
            "series",
            language,
            category,
            serie,
            season,
            episode,
            "manifest",
            "metadata",
          ],
          metadata: await db.structure.shared[globCategory][
            globSerieTitle
          ].season[season].episode[episode].manifest.metadata_json.read(),
        })
      );
    }
  );
}
