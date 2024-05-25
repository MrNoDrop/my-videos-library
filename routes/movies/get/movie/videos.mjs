import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import golbalMovieTitle from "../../../tools/globalTitle.mjs";

export default function getMovieVideos(router, db) {
  router.get(
    "/:language/:category/:movie/video",
    check.preconfiguration,
    check.category.bind(this, db),
    check.movie.bind(this, db),
    check.videos.bind(this, db),
    async (req, res) => {
      const { language, category, movie } = req.params;
      res.json(
        response.ok({
          path: ["movies", language, category, movie, "video"],
          qualities:
            db.structure.shared[await globalCategory(language, category, db)][
              await golbalMovieTitle(language, movie, db)
            ].video.list(),
        })
      );
    }
  );
}
