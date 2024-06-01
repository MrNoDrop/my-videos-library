import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import golbalMovieTitle from "../../../tools/globalTitle.mjs";

export default function getMovieVideos(router, moviesDB, seriesDB) {
  router.get(
    "/trailer/:choosenTrailersDB/:language/:category/:trailer/video",
    check.preconfiguration,
    check.choosenTrailersDB.bind(this, moviesDB, seriesDB),
    check.language.bind(this, moviesDB, seriesDB),
    check.category.bind(this, moviesDB, seriesDB),
    check.trailer.bind(this, moviesDB, seriesDB),
    check.videos.bind(this, moviesDB, seriesDB),
    async (req, res) => {
      const { choosenTrailersDB, language, category, trailer } = req.params;
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
      res.json(
        response.ok({
          path: [
            "trailers",
            "trailer",
            choosenTrailersDB,
            language,
            category,
            trailer,
            "video",
          ],
          qualities: trailerDB.structure.shared[
            await globalCategory(language, category, trailerDB)
          ][await golbalMovieTitle(language, trailer, trailerDB)].trailer.video
            .list()
            .map((quality) => quality.replace("_mp4", "")),
        })
      );
    }
  );
}
