import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";

export default function getMovieVideo(router, db) {
  router.get(
    "/:language/:category/:movie/video/:quality",
    check.preconfiguration,
    check.category.bind(this, db),
    check.movie.bind(this, db),
    check.videos.bind(this, db),
    check.video.bind(this, db),
    async (req, res) => {
      const { language, category, movie, quality } = req.params;
      try {
        res.sendFile(
          db.structure.shared[await globalCategory(language, category, db)][
            movie
          ].video[quality].getAbsolutePath()
        );
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
              { index: 5, value: quality },
              ["movies", language, category, movie, "video", quality],
              null,
              "Could not send video file.",
              error
            )
          );
      }
    }
  );
}
