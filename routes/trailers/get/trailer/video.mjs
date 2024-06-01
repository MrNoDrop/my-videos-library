import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import golbalTrailerTitle from "../../../tools/globalTitle.mjs";

export default function getTrailerVideo(router, moviesDB, seriesDB) {
  router.get(
    "/trailer/:choosenTrailersDB/:language/:category/:trailer/video/:quality",
    check.preconfiguration,
    check.choosenTrailersDB.bind(this, moviesDB, seriesDB),
    check.language.bind(this, moviesDB, seriesDB),
    check.category.bind(this, moviesDB, seriesDB),
    check.trailer.bind(this, moviesDB, seriesDB),
    check.videos.bind(this, moviesDB, seriesDB),
    check.video.bind(this, moviesDB, seriesDB),
    async (req, res) => {
      const { choosenTrailersDB, language, category, trailer, quality } =
        req.params;
      let trailerDB;
      switch (choosenTrailersDB) {
        case "series":
          trailerDB = seriesDB;
          break;
        case "movies":
          trailerDB = moviesDB;
          break;
        default:
          throw new Error("check.choosenTrailersDB failed");
      }
      try {
        res.sendFile(
          trailerDB.structure.shared[
            await globalCategory(language, category, trailerDB)
          ][
            await golbalTrailerTitle(language, trailer, trailerDB)
          ].trailer.video[`${quality}_mp4`].getAbsolutePath()
        );
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
              { index: 7, value: quality },
              [
                "trailers",
                "trailer",
                choosenTrailersDB,
                language,
                category,
                trailer,
                "video",
                quality,
              ],
              null,
              "Could not send video file.",
              error
            )
          );
      }
    }
  );
}
