import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";
import parseSrt from "../../../../modules/parseSrt.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";

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

      try {
        if (parsed) {
          res.json(
            response.ok(
              parseSrt(
                await db.structure.shared[globCategory][movie].subtitles[
                  subtitle
                ].read()
              )
            )
          );
        } else {
          res.sendFile(
            db.structure.shared[globCategory][movie].subtitles[
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
