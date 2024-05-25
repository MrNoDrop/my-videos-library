import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import golbalMovieTitle from "../../../tools/globalMovieTitle.mjs";

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
          path: ["movies", language, category, movie, "subtitles"],
          subtitles:
            db.structure.shared[await globalCategory(language, category, db)][
              await golbalMovieTitle(language, movie, db)
            ].subtitles.list(),
        })
      );
    }
  );
}
