import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";
import parseSrt from "../../../../modules/parseSrt.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import golbalMovieTitle from "../../../tools/globalTitle.mjs";

export default function getMovieSubtitle(router, db) {
  router.get(
    "/:language/:category/:movie/subtitles/:subtitle",
    check.preconfiguration,
    check.category.bind(this, db),
    check.movie.bind(this, db),
    check.subtitles.bind(this, db),
    check.subtitle.bind(this, db),
    async (req, res) => {
      const { language, category, movie, subtitle } = req.params;
      const { parsed } = req.query;
      const globCategory = await globalCategory(language, category, db);
      const globMovieTitle = await golbalMovieTitle(language, movie, db);

      try {
        if (parsed) {
          res.json(
            response.ok(
              parseSrt(
                await db.structure.shared[globCategory][
                  globMovieTitle
                ].subtitles[subtitle].read()
              )
            )
          );
        } else {
          res.sendFile(
            db.structure.shared[globCategory][globMovieTitle].subtitles[
              subtitle
            ].getAbsolutePath()
          );
        }
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
              { index: 5, value: subtitle },
              ["movies", language, category, movie, "subtitles", subtitle],
              null,
              "Could not send subtitle file.",
              error
            )
          );
      }
    }
  );
}
