import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";

export default function getTrailerAudios(router, moviesDB, seriesDB) {
  router.get(
    "/trailer/:choosenTrailersDB/:language/:category/:trailer/audio",
    check.preconfiguration,
    check.choosenTrailersDB.bind(this, moviesDB, seriesDB),
    check.language.bind(this, moviesDB, seriesDB),
    check.category.bind(this, moviesDB, seriesDB),
    check.trailer.bind(this, moviesDB, seriesDB),
    check.audios.bind(this, moviesDB, seriesDB),
    (req, res) => {
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
            "audio",
          ],
          qualities: trailerDB.structure[language][category][
            trailer
          ].trailer.audio
            .list()
            .map((quality) => quality.replace("_mp4", "")),
        })
      );
    }
  );
}
