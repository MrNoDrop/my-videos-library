import globalCategory from "../../../tools/globalCategory.mjs";
import globalSerieTitle from "../../../tools/globalTitle.mjs";

export default function getSerieCover(router, db) {
  router.get(
    "/:language/:category/:serie/cover/:orientation",
    async (req, res) => {
      const { language, category, serie, orientation } = req.params;
      const globCategory = await globalCategory(language, category, db);
      const globSerieTitle = await globalSerieTitle(language, serie, db);
      console.log(language, category, globCategory);
      try {
        res.sendFile(
          db.structure.shared[globCategory][globSerieTitle].cover[
            orientation
          ].getRandomPath()
        );
      } catch (err) {
        console.error(err);
      }
    }
  );
}
