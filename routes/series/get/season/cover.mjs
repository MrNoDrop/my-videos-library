import globalCategory from "../../../tools/globalCategory.mjs";
import globalSerieTitle from "../../../tools/globalTitle.mjs";

export default function getSeasonCover(router, db) {
  router.get(
    "/:language/:category/:serie/:season/cover/:orientation",
    async (req, res) => {
      const { language, category, serie, season, orientation } = req.params;
      const globCategory = await globalCategory(language, category, db);
      const globSerieTitle = await globalSerieTitle(language, serie, db);

      try {
        res.sendFile(
          db.structure.shared[globCategory][globSerieTitle].season[
            season
          ].cover[orientation].getRandomPath()
        );
      } catch (err) {
        console.error(err);
      }
    }
  );
}
