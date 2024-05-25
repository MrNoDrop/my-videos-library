import globalCategory from "../../../tools/globalCategory.mjs";
import globalMovieTitle from "../../../tools/globalMovieTitle.mjs";

export default function getMovieCover(router, db) {
  router.get(
    "/:language/:category/:movie/cover/:orientation",
    async (req, res) => {
      const { language, category, movie, orientation } = req.params;
      try {
        res.sendFile(
          db.structure.shared[await globalCategory(language, category, db)][
            await globalMovieTitle(language, movie, db)
          ].cover[orientation].getRandomPath()
        );
      } catch (err) {
        console.error(err);
      }
    }
  );
}
