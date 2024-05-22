import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";

export default function getMovieSubtitles(router, db) {
  router.get(
    "/:language/:category/:movie/subtitles",
    check.preconfiguration,
    check.category.bind(this, db),
    check.movie.bind(this, db),
    check.subtitles.bind(this, db),
    async (req, res) => {
      const { language, category, movie } = req.params;
      res.json(
        response.ok({
          path: ["movies", language, ...Object.values(req.params), "subtitles"],
          subtitles:
            db.structure.shared[await globalCategory(language, category, db)][
              movie
            ].subtitles.list(),
        })
      );
    }
  );
}
