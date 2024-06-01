import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";

export default function getTrailerAudio(router, moviesDB, seriesDB) {
  router.get(
    "/trailer/:choosenTrailersDB/:language/:category/:trailer/audio/:quality",
    check.preconfiguration,
    check.choosenTrailersDB.bind(this, moviesDB, seriesDB),
    check.language.bind(this, moviesDB, seriesDB),
    check.category.bind(this, moviesDB, seriesDB),
    check.trailer.bind(this, moviesDB, seriesDB),
    check.audios.bind(this, moviesDB, seriesDB),
    check.audio.bind(this, moviesDB, seriesDB),
    (req, res) => {
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
          trailerDB.structure[language][category][trailer].trailer.audio[
            `${quality}_mp4`
          ].getAbsolutePath()
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
                "audio",
                quality,
              ],
              null,
              "Could not send audio file.",
              error
            )
          );
      }
    }
  );
}
