import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import golbalMovieTitle from "../../../tools/globalTitle.mjs";

export default function getMovieVideo(router, db) {
  router.get(
    "/:language/:category/:movie/video/:quality",
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.movie.bind(this, db),
    check.videos.bind(this, db),
    check.video.bind(this, db),
    async (req, res) => {
      const { language, category, movie, quality } = req.params;
      try {
        res.sendFile(
          db.structure.shared[await globalCategory(language, category, db)][
            await golbalMovieTitle(language, movie, db)
          ].video[`${quality}_mp4`].getAbsolutePath()
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
