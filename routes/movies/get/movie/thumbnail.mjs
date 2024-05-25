import check from "../../check/get.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import globalMovieTitle from "../../../tools/globalTitle.mjs";

export default function getMovieThumbnail(router, db) {
  router.get(
    "/:language/:category/:movie/thumbnail",
    check.preconfiguration,
    check.category.bind(this, db),
    check.movie.bind(this, db),
    check.thumbnail.bind(this, db),
    async (req, res) => {
      const { language, category, movie } = req.params;
      try {
        res.sendFile(
          await db.structure.shared[
            await globalCategory(language, category, db)
          ][
            await globalMovieTitle(language, movie, db)
          ].thumbnails.getRandomPath()
        );
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
              { index: 4, value: "thumbnail" },
              ["movies", language, category, movie, "thumbnail"],
              null,
              "Could not send thumbnail file."
            )
          );
      }
    }
  );
}
