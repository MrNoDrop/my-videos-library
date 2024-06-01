import check from "../../check/get.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import globalTrailerTitle from "../../../tools/globalTitle.mjs";

export default function getTrailerThumbnail(router, moviesDB, seriesDB) {
  router.get(
    "/trailer/:choosenTrailersDB/:language/:category/:trailer/thumbnail",
    check.preconfiguration,
    check.choosenTrailersDB.bind(this, moviesDB, seriesDB),
    check.language.bind(this, moviesDB, seriesDB),
    check.category.bind(this, moviesDB, seriesDB),
    check.trailer.bind(this, moviesDB, seriesDB),
    check.thumbnail.bind(this, moviesDB, seriesDB),
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
      try {
        res.sendFile(
          await trailerDB.structure.shared[
            await globalCategory(language, category, trailerDB)
          ][
            await globalTrailerTitle(language, trailer, trailerDB)
          ].trailer.thumbnails.getRandomPath()
        );
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
              { index: 6, value: "thumbnail" },
              [
                "trailers",
                "trailer",
                choosenTrailersDB,
                language,
                category,
                trailer,
                "thumbnail",
              ],
              null,
              "Could not send thumbnail file."
            )
          );
      }
    }
  );
}
